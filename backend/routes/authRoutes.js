const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController')
const { loginSchema, registerSchema, validateRequest } = require('../middlewares/validateMiddleware')
const upload = require('../utils/uploads')


router.post('/register', validateRequest(registerSchema),  authController.registerUser);
router.post('/login', validateRequest(loginSchema), authController.loginUser);
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-otp', authController.verifyOtp);
router.post('/reset-password',authController.resetPassword)

module.exports = router;
