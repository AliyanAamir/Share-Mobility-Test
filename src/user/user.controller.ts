import { Request, Response } from 'express';

import { UserType } from '../types';
import { errorResponse, successResponse } from '../utils/api.utils';

import {
  BulkUserIdSchemaType,
  GetUsersSchemaType,
  UserIdSchemaType,
  UserUpdateSchemaType,
} from './user.schema';
import {
  activeToggle,
  deleteBulkUsers,
  deleteUser,
  getUserById,
  getUsers,
  seedUsers,
  updateUser,
} from './user.services';

export const handleUserUpdate = async (
  req: Request<never, never, UserUpdateSchemaType>,
  res: Response,
) => {
  try {
    const currentUser = req.user as UserType;
    if (!currentUser) {
      return errorResponse(req.user, 'User Doesnt Exists');
    }

    const user = await updateUser(req.body, currentUser.id);

    return successResponse(res, `Profile updated`, user);
  } catch (err) {
    return errorResponse(res, (err as Error).message);
  }
};

export const handleGetUserById = async (
  req: Request<UserIdSchemaType>,
  res: Response,
) => {
  try {
    const result = await getUserById(req.params.id);

    return successResponse(res, undefined, result);
  } catch (err) {
    return errorResponse(res, (err as Error).message);
  }
};

export const handleToggleActive = async (
  req: Request<UserIdSchemaType>,
  res: Response,
) => {
  try {
    const status = await activeToggle(req.params.id);

    return successResponse(
      res,
      `Status changed to ${status ? 'Active' : 'Disabled'}`,
    );
  } catch (err) {
    return errorResponse(res, (err as Error).message);
  }
};

export const handleUserSeeder = async (_: Request, res: Response) => {
  try {
    await seedUsers();

    return successResponse(res, 'Data seeded successfully');
  } catch (err) {
    return errorResponse(res, (err as Error).message);
  }
};

export const handleDeleteBulkUsers = async (
  req: Request<never, never, never, BulkUserIdSchemaType>,
  res: Response,
) => {
  try {
    await deleteBulkUsers(req.query.ids);

    return successResponse(res, 'Users are deleted');
  } catch (err) {
    return errorResponse(res, (err as Error).message);
  }
};

export const handleDeleteUser = async (
  req: Request<UserIdSchemaType, never>,
  res: Response,
) => {
  try {
    await deleteUser(req.params.id);

    return successResponse(res, 'User has been deleted');
  } catch (err) {
    return errorResponse(res, (err as Error).message);
  }
};

export const handleGetUsers = async (
  req: Request<never, never, never, GetUsersSchemaType>,
  res: Response,
) => {
  try {
    const { results, paginatorInfo } = await getUsers(
      Number(req.user.sub),
      req.query,
    );

    return res.json({ paginatorInfo: paginatorInfo, results: results });
  } catch (err) {
    return errorResponse(res, (err as Error).message);
  }
};
