import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const {
      user: { id: user_id },
      file: { filename: avatarFilename },
    } = request;

    const updateUserAvatar = container.resolve(UpdateUserAvatarService);

    const user = await updateUserAvatar.execute({
      user_id,
      avatarFilename,
    });

    delete user.password;

    return response.json(user);
  }
}

export default UserAvatarController;
