// routes/auth.routes.js
const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/:userId', authController.me);
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.put('/update/:userId', authController.updateUser);
router.post('/verify-otp', authController.verifyOTP);
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-forgot-password-otp', authController.verifyForgotPasswordOtp);
router.post('/reset-password', authController.resetPassword);


module.exports = router;
