import express from 'express';
import { loginUser, Signup } from '../controllers/AuthController.js';

const router = express.Router()


router.post('/signup', Signup)
router.post('/rooms', loginUser)

export default router