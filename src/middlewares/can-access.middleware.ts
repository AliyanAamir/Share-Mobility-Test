import { InferSelectModel, eq } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { db } from '../drizzle/db';
import { users } from '../drizzle/schema';
import { errorResponse } from '../utils/api.utils';
import { JwtPayload } from '../utils/auth.utils';

export const canAccess =
  () =>
  async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req: Request<any, any, any, any>,
    res: Response,
    next: NextFunction,
  ) => {
    if (!req.user) {
      return errorResponse(
        res,
        "token isn't attached or expired",
        StatusCodes.UNAUTHORIZED,
      );
    }

    const currentUser = (await db.query.users.findFirst({
      where: eq(users.id, Number((req.user as JwtPayload).sub)),
    })) as InferSelectModel<typeof users>;

    if (!currentUser) {
      return errorResponse(res, 'Login again', StatusCodes.UNAUTHORIZED);
    }

    if (!currentUser.isActive) {
      return errorResponse(
        res,
        'Your account has been disabled',
        StatusCodes.UNAUTHORIZED,
      );
    }

    req['user'] = { ...currentUser, sub: currentUser.id };

    next();
  };
