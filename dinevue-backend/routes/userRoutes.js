const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authGuard } = require('../middleware/authGuard');

// Public routes
router.post('/create', userController.registerUser);
router.post('/login', userController.loginUser);

// Routes requiring authentication
router.get('/getall', userController.getAllUsers);
router.get('/getuser/:id', userController.getUserById);
router.put('/update/:id', userController.updateUser);
router.delete('/delete/:id', userController.deleteUser);

// Password reset routes
router.post('/send-code', userController.sendCodeToEmail);
router.post("/verify-code", userController.verifyCode);
router.post("/request-code", userController.requestCode);
router.post("/verify-code-and-change-password", userController.verifyCodeAndChangePassword);

// Change password route
router.post('/change-password', userController.changePassword);

module.exports = router;
