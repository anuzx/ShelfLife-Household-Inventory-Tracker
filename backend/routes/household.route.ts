
import { Router } from "express";
import { createHousehold, joinHousehold, getCurrentUsersHousehold, listAllMembers } from "../controllers/household.controller";

const router = Router()

router.post("/", createHousehold)

router.post("/join", joinHousehold)

router.get("/me", getCurrentUsersHousehold)
router.get("/:id/members", listAllMembers)
export default router 
