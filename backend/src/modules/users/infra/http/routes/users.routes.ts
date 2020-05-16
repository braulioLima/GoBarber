import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';

import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

import ensureAuthenticatedMiddleware from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const uploadFile = multer(uploadConfig);
const uploadAvatarMiddleware = uploadFile.single('avatar');

usersRouter.post('/', async (request, response) => {
  const { name, email, password } = request.body;

  const createUserService = new CreateUserService();

  const user = await createUserService.execute({ name, email, password });

  delete user.password;

  return response.status(201).send(user);
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticatedMiddleware,
  uploadAvatarMiddleware,
  async (request, response) => {
    const {
      user: { id: user_id },
      file: { filename: avatarFilename },
    } = request;

    const updateUserAvatar = new UpdateUserAvatarService();

    const user = await updateUserAvatar.execute({
      user_id,
      avatarFilename,
    });

    delete user.password;

    return response.json(user);
  },
);

export default usersRouter;
