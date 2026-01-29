import express from "express"
import healthRoute from "./routes/health.route.js"
import pasteRoutes from "./routes/pastes.route.js"
import viewRoutes from "./routes/view.route.js"

const app = express()

app.use(express.static("public"))
app.use(express.json())

app.use("/api/healthz", healthRoute)
app.use("/api/pastes", pasteRoutes)
app.use("/p", viewRoutes)

export default app
