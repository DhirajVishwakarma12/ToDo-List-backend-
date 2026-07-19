import Router from 'express';
import * as authController from '../controller/auth.controller.js';

const router = Router();

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

router.get('/refresh-token', authController.refreshToken);
router.get('/logout', authController.logoutUser);
router.get('/logout-all', authController.logoutAll);
router.post('/otp', authController.verifyOtp);
router.post('/resendotp', authController.resendOtp);
router.get("/getme",authController.getMe)


export default router;
