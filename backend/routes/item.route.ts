import { Router } from "express";
import {
  listHouseholdItems,
  createNewItem,
  markStatus,
  updateItemDetails,
  removeItem,
} from "../controllers/item.controller";
import { verifyUser } from "../middlewares/auth.middleware";
const router = Router();

router.use(verifyUser)

router.get("/", listHouseholdItems);
router.post("/", createNewItem);
router.patch("/:id/status", markStatus);
router.put("/:id", updateItemDetails);
router.delete("/:id", removeItem);

export default router;
