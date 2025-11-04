import { Router } from 'express';
import { createUserController, listUsersController } from './user.controller';
import { ensureAuth } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';

export const userRouter = Router();

userRouter.post('/', ensureAuth, requireRole('admin'), createUserController);
userRouter.get('/', ensureAuth, requireRole('admin'), listUsersController);
