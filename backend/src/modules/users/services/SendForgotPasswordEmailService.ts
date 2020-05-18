import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

// import User from '../infra/typeorm/entities/User';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

interface IRequest {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  private mailProvider: IMailProvider;

  private usersRepository: IUsersRepository;

  private userTokensRepository: IUserTokensRepository;

  constructor(
    @inject('UsersRepository')
    usersRepository: IUsersRepository,

    @inject('MailProvider')
    mailProvider: IMailProvider,

    @inject('UserTokensRepository')
    userTokensRepository: IUserTokensRepository,
  ) {
    this.mailProvider = mailProvider;
    this.usersRepository = usersRepository;
    this.userTokensRepository = userTokensRepository;
  }

  public async execute({ email }: IRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('User does not exists.');
    }

    await this.userTokensRepository.generate(user.id);

    this.mailProvider.sendMail(
      email,
      'Pedido de recuperação de senha recebido.',
    );
  }
}

export default SendForgotPasswordEmailService;
