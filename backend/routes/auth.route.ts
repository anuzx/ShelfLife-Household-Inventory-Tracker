import { Router } from "express";
import { handleLogin, handleRegister } from "../controllers/auth.controller";
import { rateLimiter } from "../middlewares/ratelimiter.middleware";

const router = Router()

router.post("/register", handleRegister)
router.post("/login", rateLimiter, handleLogin)

export default router 
