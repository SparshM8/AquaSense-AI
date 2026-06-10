import express from "express";
import {
  getUsers,
  getAnalytics,
} from "../controllers/adminController.js";

import {
  protect,
  adminOnly,
} from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get("/users", getUsers);
router.get("/analytics", getAnalytics);

export default router;