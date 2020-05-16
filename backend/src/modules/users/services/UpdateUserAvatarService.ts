import { getRepository } from 'typeorm';
import { join } from 'path';
import { access, promises } from 'fs';

import uploadConfig from '@config/upload';

import AppError from '@shared/errors/AppError';

import User from '../infra/typeorm/entities/User';

interface RequestAtavarFileDTO {
  user_id: string;
  avatarFilename: string;
}

class UpdateUserAvatarService {
  public async execute({
    user_id,
    avatarFilename,
  }: RequestAtavarFileDTO): Promise<User> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can change avatar.', 401);
    }

    if (user.avatar) {
      const userAvatarFilePath = join(uploadConfig.directory, user.avatar);

      await access(userAvatarFilePath, async error => {
        if (!error) {
          await promises.unlink(userAvatarFilePath);
        }
      });
    }

    user.avatar = avatarFilename;

    await usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
