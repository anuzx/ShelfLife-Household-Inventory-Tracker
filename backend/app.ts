import express from "express"

export const app = express()

app.use(express.json())

import authRouter from "./routes/auth.route"
import householdRouter from "./routes/household.route"
import itemRouter from "./routes/item.route"
import dashboardRouter from "./routes/dashboard.route"

app.use("/api/auth", authRouter)
app.use("/api/households", householdRouter)
app.use("/api/items", itemRouter)
app.use("/api/dashboard", dashboardRouter)

