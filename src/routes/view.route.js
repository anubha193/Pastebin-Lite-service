import express from "express"
import redis from "../ db/redis.js"
import { escapeHtml } from "../utils/escapeHtml.js"
import { getNowMs } from "../utils/time.js"

const router = express.Router()

router.get("/:id", async (req, res) => {
  const raw = await redis.get(`paste:${req.params.id}`)
  if (!raw) return res.sendStatus(404)

  const paste = JSON.parse(raw)
  const now = getNowMs(req)

  if (
    (paste.expires_at && now >= paste.expires_at) ||
    (paste.max_views !== null && paste.views >= paste.max_views)
  ) {
    return res.sendStatus(404)
  }

  res.setHeader("Content-Type", "text/html")
  res.send(`
    <html>
      <body>
        <pre>${escapeHtml(paste.content)}</pre>
      </body>
    </html>
  `)
})

export default router
