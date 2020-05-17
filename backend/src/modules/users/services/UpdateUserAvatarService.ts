import { join } from 'path';
import { access, promises } from 'fs';
import { inject, injectable } from 'tsyringe';

import uploadConfig from '@config/upload';

import AppError from '@shared/errors/AppError';

import IStorageProvider from '@shared/container/providers/StorageProviders/models/IStorageProvider';
import User from '../infra/typeorm/entities/User';

import IUsersRepository from '../repositories/IUsersRepository';

interface IRequestAtavarFileDTO {
  user_id: string;
  avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {
  private usersRepository: IUsersRepository;

  private storageProvider: IStorageProvider;

  constructor(
    @inject('UsersRepository')
    usersRepository: IUsersRepository,

    @inject('StorageProvider')
    storageProvider: IStorageProvider,
  ) {
    this.usersRepository = usersRepository;
    this.storageProvider = storageProvider;
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
      await this.storageProvider.deleteFile(user.avatar);
    }

    const filename = await this.storageProvider.saveFile(avatarFilename);

    user.avatar = filename;

    await this.usersRepository.update(user);

    return user;
  }
}

export default UpdateUserAvatarService;
