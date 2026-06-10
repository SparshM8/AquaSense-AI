import express from "express";
import { protect } from "../middleware/auth.js";
import { generatePDF } from "../controllers/reportController.js";

const router = express.Router();

router.use(protect);

router.get("/pdf", generatePDF);

export default router;