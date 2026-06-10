import { Router } from "express";
import multer from "multer";

import { protect } from "../middleware/auth.js";
import * as ctrl from "../controllers/waterController.js";

const router = Router();

const upload = multer({
  dest: "uploads/",
});

router.use(protect);

router.get("/dashboard", ctrl.getDashboardStats);
router.get("/", ctrl.getRecords);
router.post("/", ctrl.createRecord);
router.put("/:id", ctrl.updateRecord);
router.delete("/:id", ctrl.deleteRecord);
router.post("/import-csv", upload.single("file"), ctrl.importCSV);

export default router;