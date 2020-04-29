import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import authConfig from '../config/auth';

import AppError from '../errors/AppError';

import User from '../models/User';

interface RequestAuthDTO {
  email: string;
  password: string;
}

interface ResponseAuthDTO {
  user: User;
  token: string;
}

class AuthenticateUserService {
  public async exectute({
    email,
    password,
  }: RequestAuthDTO): Promise<ResponseAuthDTO> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    delete user.password;

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    const session: ResponseAuthDTO = { user, token };

    return session;
  }
}

export default AuthenticateUserService;
