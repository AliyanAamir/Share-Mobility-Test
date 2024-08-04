import { Router } from 'express';
import { validateZodSchema } from '../middlewares/validate-zod-schema.middleware';
import {
  handleDeleteBulkUsers,
  handleDeleteUser,
  handleGetUserById,
  handleGetUsers,
  handleToggleActive,
  handleUserSeeder,
  handleUserUpdate,
} from './user.controller';
import {
  bulkUserIdsSchema,
  getUsersSchema,
  userIdSchema,
  userUpdateSchema,
} from './user.schema';
import { canAccess } from '../middlewares/can-access.middleware';

export const USER_ROUTER_ROOT = '/users';

const userRouter = Router();

userRouter.get('/seed', handleUserSeeder);

userRouter.patch(
  '/profile',
  canAccess(),
  validateZodSchema({ body: userUpdateSchema }),
  handleUserUpdate,
);

userRouter.get(
  '/:id/toggle-active',
  canAccess(),
  validateZodSchema({ params: userIdSchema }),
  handleToggleActive,
);

userRouter.get(
  '/',
  validateZodSchema({ query: getUsersSchema }),
  handleGetUsers,
);

userRouter.get(
  '/:id',
  validateZodSchema({ params: userIdSchema }),
  handleGetUserById,
);

userRouter.delete(
  '/bulk',
  validateZodSchema({ query: bulkUserIdsSchema }),
  handleDeleteBulkUsers,
);

userRouter.delete(
  '/:id',
  validateZodSchema({ params: userIdSchema }),
  handleDeleteUser,
);

export default userRouter;
