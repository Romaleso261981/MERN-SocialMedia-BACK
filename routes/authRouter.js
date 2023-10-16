import express from 'express';
import { authController } from "../controllers/authController.js";
import { ctrlWrapper } from "../middleware/ctrlWrapper.js";

export const authRouter = express.Router();

authRouter.post("/signup", ctrlWrapper(authController.signup));
authRouter.post("/login", ctrlWrapper(authController.signin));
authRouter.get("/logout/:userId", ctrlWrapper(authController.signout));
