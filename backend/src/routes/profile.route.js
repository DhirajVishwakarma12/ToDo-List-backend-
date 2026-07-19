import express from "express";
import * as profileController from '../controller/profile.controller.js';
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// profile routes
router.get('/viewprofile', authMiddleware, profileController.viewProfile);
router.post('/private-password', authMiddleware, profileController.setPrivatePassword);
router.post('/verify-private-password', authMiddleware, profileController.verifyPrivatePassword);

export default router;