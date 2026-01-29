import express from "express";
import redis from '../ db/redis.js'

const router = express.Router()

router.get("/", async (_req, res) => {
  try {
    await redis.ping()
    res.json({ ok: true })
  } catch {
    res.status(500).json({ ok: false })
  }
})

export default router
