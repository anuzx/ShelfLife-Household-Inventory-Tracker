import { Router } from "express";
import { showStatus, itemExpiring } from "../controllers/dashboard.controller";
import { verifyUser } from "../middlewares/auth.middleware";

const router = Router();

router.use(verifyUser)

router.get("/status", showStatus);
router.get("/expiring", itemExpiring);

export default router;
