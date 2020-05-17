import { join } from 'path';
import { access, promises } from 'fs';
import { inject, injectable } from 'tsyringe';

import uploadConfig from '@config/upload';

import AppError from '@shared/errors/AppError';

import User from '../infra/typeorm/entities/User';

import IUsersRepository from '../repositories/IUsersRepository';

interface IRequestAtavarFileDTO {
  user_id: string;
  avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {
  private usersRepository: IUsersRepository;

  constructor(
    @inject('UsersRepository')
    usersRepository: IUsersRepository,
  ) {
    this.usersRepository = usersRepository;
  }

  public async execute({
    user_id,
    avatarFilename,
  }: IRequestAtavarFileDTO): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

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

    await this.usersRepository.update(user);

    return user;
  }
}

export default UpdateUserAvatarService;
