const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authGuard } = require('../middleware/authGuard');

// Public routes
router.post('/create', userController.registerUser);
router.post('/login', userController.loginUser);

// Routes requiring authentication
router.get('/getall', authGuard, userController.getAllUsers);
router.get('/getuser/:id', authGuard, userController.getUserById);
router.put('/update/:id', authGuard, userController.updateUser);
router.delete('/delete/:id', authGuard, userController.deleteUser);


router.post('/change-password', async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    // Find the user by ID or email, depending on your setup
    const userId = req.user.id; // Replace with your actual user ID retrieval method

    // Retrieve user from database
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare old password with hashed password in database
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect old password' });
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update user's password in database
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/send-code', userController.sendCodeToEmail);
router.post("/verify-code", userController.verifyCode);
router.post("/request-code", userController.requestCode);

router.post(
  "/verify-code-and-change-password", userController.verifyCodeAndChangePassword
); 

module.exports = router;
