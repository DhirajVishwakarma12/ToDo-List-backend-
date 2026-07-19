import express from "express"
import * as taskController from "../controller/task.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

// import * as profileController from '../controller/profile.controller.js';

const router = express.Router()

//profile route
router.post('/createtask', authMiddleware, taskController.creatTasks);
router.get('/task', authMiddleware, taskController.Tasks);
router.get('/viewtask', authMiddleware, taskController.Tasks);
router.patch('/completetask/:taskId', authMiddleware, taskController.completeTask);

export default router;
