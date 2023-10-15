import express from 'express';
import { ctrlWrapper } from '../middleware/ctrlWrapper.js';

const router = express.Router()


router.get('/', ctrlWrapper(roomsController.GetRooms))
roomsRouter.get('/:id', ctrlWrapper(roomsController.GetRoomById))

export default router