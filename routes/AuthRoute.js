import express from 'express';
import { loginUser, Signup, logOut } from '../controllers/AuthController.js';

const router = express.Router()


router.post('/login', Signup)
router.get('/rooms', loginUser)
router.post('/logout', logOut)

export default router