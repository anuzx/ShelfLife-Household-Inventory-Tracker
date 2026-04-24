
import { Router } from "express";
import { createHousehold, joinHousehold, getCurrentUsersHousehold, listAllMembers } from "../controllers/household.controller";
import { VerifyUser } from "../middlewares/auth.middleware";
import { rateLimiter } from "../middlewares/ratelimiter.middleware";

const router = Router()

router.post("/", VerifyUser, createHousehold)

router.post("/join", VerifyUser, rateLimiter, joinHousehold)

router.get("/me", VerifyUser, getCurrentUsersHousehold)
router.get("/:id/members", VerifyUser, listAllMembers)
export default router 
