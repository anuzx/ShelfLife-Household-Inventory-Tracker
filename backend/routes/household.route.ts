import { Router } from "express";
import {
  createHousehold,
  joinHousehold,
  getCurrentUsersHousehold,
  listAllMembers,
} from "../controllers/household.controller";
import { verifyUser } from "../middlewares/auth.middleware";
import { rateLimiter } from "../middlewares/ratelimiter.middleware";

const router = Router();

router.use(verifyUser);

router.post("/", createHousehold);

router.post("/join", rateLimiter, joinHousehold);

router.get("/me", getCurrentUsersHousehold);
router.get("/:id/members", listAllMembers);
export default router;
