
import { Router } from "express";
import { showStatus, itemExpiring } from "../controllers/dashboard.controller";

const router = Router()

router.get("/status", showStatus)
router.get("/expiring", itemExpiring)

export default router 
