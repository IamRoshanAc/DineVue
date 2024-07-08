const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/create', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/getall', userController.getAllUsers); 

module.exports = router;
