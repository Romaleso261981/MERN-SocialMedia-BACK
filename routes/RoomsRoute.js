import express from 'express';
import { GetRooms } from '../controllers/RoomsController.js';

const router = express.Router()


router.get('/', GetRooms)

export default router