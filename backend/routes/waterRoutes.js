import express from "express";
import multer from "multer";
import { protect } from "../middleware/auth.js";

import {
  getRecords,
  createRecord,
  updateRecord,
  deleteRecord,
  importCSV,
  getDashboardStats
} from "../controllers/waterController.js";

const router = express.Router();

const upload = multer({
  dest: "uploads/"
});

router.get("/", protect, getRecords);
router.post("/", protect, createRecord);

router.put("/:id", protect, updateRecord);
router.delete("/:id", protect, deleteRecord);

router.get("/dashboard", protect, getDashboardStats);

router.post(
  "/import",
  protect,
  upload.single("file"),
  importCSV
);

export default router;