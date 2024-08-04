import { Router } from 'express';
import { validateZodSchema } from '../middlewares/validate-zod-schema.middleware';
import {
  handleChangePassword,
  handleForgetPassword,
  handleGetCurrentUser,
  handleLogin,
  handleLogout,
  handleRegisterUser,
  handleResetPassword,
  handleSetPassword,
} from './auth.controller';
import {
  changePasswordSchema,
  forgetPasswordSchema,
  loginUserSchema,
  registerUserSchema,
  resetPasswordSchema,
  setPasswordSchema,
} from './auth.schema';
import { canAccess } from '../middlewares/can-access.middleware';

export const AUTH_ROUTER_ROOT = '/auth';

const authRouter = Router();

authRouter.post(
  '/register/user',
  validateZodSchema({ body: registerUserSchema }),
  handleRegisterUser,
);

authRouter.post(
  '/login',
  validateZodSchema({ body: loginUserSchema }),
  handleLogin,
);

authRouter.post('/logout', canAccess(), handleLogout);

authRouter.get('/user', canAccess(), handleGetCurrentUser);

authRouter.post(
  '/forget-password',
  validateZodSchema({ body: forgetPasswordSchema }),
  handleForgetPassword,
);

authRouter.post(
  '/change-password',
  canAccess(),
  validateZodSchema({ body: changePasswordSchema }),
  handleChangePassword,
);

authRouter.post(
  '/reset-password',
  validateZodSchema({ body: resetPasswordSchema }),
  handleResetPassword,
);

authRouter.post(
  '/set-password',
  validateZodSchema({ body: setPasswordSchema }),
  handleSetPassword,
);

export default authRouter;
