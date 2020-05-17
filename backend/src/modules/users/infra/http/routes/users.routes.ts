import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';

import UsersController from '../controllers/UsersController';
import UserAvatarController from '../controllers/UserAvatarController';

import ensureAuthenticatedMiddleware from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const uploadFile = multer(uploadConfig);
const uploadAvatarMiddleware = uploadFile.single('avatar');

const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

usersRouter.post('/', usersController.create);

usersRouter.patch(
  '/avatar',
  ensureAuthenticatedMiddleware,
  uploadAvatarMiddleware,
  userAvatarController.update,
);

export default usersRouter;
