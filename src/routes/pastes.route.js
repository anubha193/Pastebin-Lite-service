import express from "express"
import { nanoid } from "nanoid"
import redis from "../ db/redis.js"
import { getNowMs } from "../utils/time.js"
import { getBaseUrl } from "../utils/baseUrl.js";

const router = express.Router()

// CREATE PASTE
router.post("/", async (req, res) => {
  const { content, ttl_seconds, max_views } = req.body

  if (!content || typeof content !== "string" || !content.trim()) {
    return res.status(400).json({ error: "Invalid content" })
  }

  if (ttl_seconds !== undefined &&
      (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
    return res.status(400).json({ error: "Invalid ttl_seconds" })
  }

  if (max_views !== undefined &&
      (!Number.isInteger(max_views) || max_views < 1)) {
    return res.status(400).json({ error: "Invalid max_views" })
  }

  const id = nanoid(8)
  const createdAt = Date.now()

  const paste = {
    content,
    created_at: createdAt,
    expires_at: ttl_seconds ? createdAt + ttl_seconds * 1000 : null,
    max_views: max_views ?? null,
    views: 0
  }

  // ✅ CONSISTENT KEY
  await redis.set(`paste:${id}`, paste)

  res.json({
    id,
    url: `${getBaseUrl(req)}/p/${id}`
  })
})


// FETCH PASTE (API – increments views)
router.get("/:id", async (req, res) => {
  const key = `paste:${req.params.id}`
  const paste = await redis.get(key)

  if (!paste) {
    return res.status(404).json({ error: "Not found" })
  }

  const now = getNowMs(req)

  if (paste.expires_at && now >= paste.expires_at) {
    return res.status(404).json({ error: "Expired" })
  }

  if (paste.max_views !== null && paste.views >= paste.max_views) {
    return res.status(404).json({ error: "View limit exceeded" })
  }

  paste.views += 1
  await redis.set(key, paste)

  res.json({
    content: paste.content,
    remaining_views:
      paste.max_views !== null
        ? paste.max_views - paste.views
        : null,
    expires_at: paste.expires_at
      ? new Date(paste.expires_at).toISOString()
      : null
  })
})

export default router
