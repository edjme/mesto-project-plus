import { Router } from 'express';
import config from 'config';
import {
  getUsers, getUserById, updateUserInfo, updateUserAvatar, getUserInfo,
} from '../controllers/users';
import { validatorUpdateUserAvatar, validatorUpdateUserInfo, validatorUserId } from '../validator/celebrate';

const userRouter = Router();
const usersPath: string = config.get('usersPath');
const idUsersPath: string = config.get('idUsersPath');
const patchUserPath: string = config.get('patchUserPath');
const patchUserAvatarPath: string = config.get('patchUserAvatarPath');

userRouter.get(usersPath, getUsers);

userRouter.get('/me', getUserInfo);

userRouter.get(idUsersPath, validatorUserId, getUserById);

userRouter.patch(
  patchUserPath,
  validatorUpdateUserInfo,
  updateUserInfo,
);

userRouter.patch(
  patchUserAvatarPath,
  validatorUpdateUserAvatar,
  updateUserAvatar,
);

export default userRouter;
