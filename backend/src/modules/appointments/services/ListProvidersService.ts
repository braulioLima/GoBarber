import { inject, injectable } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
  user_id: string;
}

@injectable()
class ListProvidersService {
  private usersRepository: IUsersRepository;

  private cacheProvider: ICacheProvider;

  constructor(
    @inject('UsersRepository')
    usersRepository: IUsersRepository,

    @inject('CacheProvider')
    cacheProvider: ICacheProvider,
  ) {
    this.usersRepository = usersRepository;
    this.cacheProvider = cacheProvider;
  }

  public async execute({ user_id }: IRequest): Promise<User[]> {
    let users = await this.cacheProvider.recover<User[]>(
      `providers-list:${user_id}`,
    );

    if (!users) {
      const usersPromise = this.usersRepository.findAllProviders({
        except_user_id: user_id,
      });

      const cachePromise = this.cacheProvider.save(
        `providers-list:${user_id}`,
        users,
      );

      // eslint-disable-next-line
      const [usersData, _] = await Promise.all([usersPromise, cachePromise]);

      users = usersData;
    }

    return users;
  }
}

export default ListProvidersService;
