import express from 'express';
import { loginUser, login } from '../controllers/AuthController.js';

const router = express.Router()


router.post('/login', login)
router.post('/login', loginUser)

export default router