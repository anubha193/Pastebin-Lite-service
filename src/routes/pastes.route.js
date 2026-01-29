import express from "express"
import { nanoid } from "nanoid"
import redis from "../ db/redis.js"

const router = express.Router()

router.post("/", async (req, res) => {
  const { content, ttl_seconds, max_views } = req.body

  if (!content || typeof content !== "string" || !content.trim()) {
    return res.status(400).json({ error: "Invalid content" })
  }

  if (ttl_seconds && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
    return res.status(400).json({ error: "Invalid ttl_seconds" })
  }

  if (max_views && (!Number.isInteger(max_views) || max_views < 1)) {
    return res.status(400).json({ error: "Invalid max_views" })
  }

  const id = nanoid(8)
  const createdAt = Date.now()
  const expiresAt = ttl_seconds
    ? createdAt + ttl_seconds * 1000
    : null

  const paste = {
    content,
    created_at: createdAt,
    expires_at: expiresAt,
    max_views: max_views ?? null,
    views: 0
  }

  await redis.set(`paste:${id}`, JSON.stringify(paste))

  res.json({
    id,
    url: `${process.env.BASE_URL}/p/${id}`
  })
})

export default router
