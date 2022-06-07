import { Router } from 'express';
const router = Router();
import passport from 'passport';

import * as usersController from '../controllers/users.controller';

// Login
router.post('/login', usersController.loginUser);

// Register
router.post('/register', usersController.registerUser);

// Verify account
router.post('/verify', usersController.verifyEmail);

// Forgot password 
router.post('/forgot-password', usersController.forgotPassword);

// Reset password 
router.post('/reset-password', usersController.resetPassword);

// Validate reset token 
router.post('/validate-reset-token', usersController.validateResetToken);

// Profile
router.get('/profile', passport.authenticate('jwt', {session: false}),  usersController.profileUser);

// Dashboard
router.get('/dashboard', passport.authenticate('jwt', {session: false}),  usersController.dashboardUser);

export default router;
