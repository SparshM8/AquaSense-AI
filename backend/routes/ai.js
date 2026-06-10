import { Router } from "express";
import { protect } from "../middleware/auth.js";
import {
  getPredictions,
  getAnomalies,
  getRecommendations,
} from "../controllers/aiController.js";

const router = Router();

router.use(protect);

router.get("/predict", getPredictions);
router.get("/anomaly", getAnomalies);
router.get("/recommendations", getRecommendations);

export default router;