import { Router } from "express";
import {
  getTaskDetails,
  getDetailsById,
  getTaskList,
  deleteDetailsById,
  updateTaskStatusByID,
} from "../controllers/tasks.controller";
import upload from "../modules/fileupload";

const router = Router();

router.get("/", getTaskList);
router.post("/:Id", upload.single("file"), getTaskDetails);
router.put("/:Id", getTaskDetails);
router.get("/:empId", getDetailsById);
router.put("/status/:Id", updateTaskStatusByID);
router.delete("/:Id", deleteDetailsById);

export default router;
