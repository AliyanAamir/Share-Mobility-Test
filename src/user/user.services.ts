import {
  InferInsertModel,
  InferSelectModel,
  SQLWrapper,
  and,
  count,
  desc,
  eq,
  ilike,
  inArray,
  or
} from 'drizzle-orm';

import { db } from '../drizzle/db';

import { users } from '../drizzle/schema';
import { ConflictError, NotFoundError } from '../errors/errors.service';
import { UserType } from '../types';
import { hashPassword } from '../utils/auth.utils';
import { GetPaginatorReturnType, getPaginator } from '../utils/getPaginator';

import { faker } from '@faker-js/faker';
import { randomInt } from '../utils/common.utils';
import {
  GetUsersSchemaType,
  UserUpdateSchemaType
} from './user.schema';

export const updateUser = async (
  payload: UserUpdateSchemaType,
  userId: number,
): Promise<UserType> => {
  const updatedUser = await db
    .update(users)
    .set({ ...payload })
    .where(eq(users.id, userId))
    .returning()
    .execute();

  return updatedUser[0];
};

export const activeToggle = async (userId: number) => {
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });

  if (!user) {
    throw new Error('User not found');
  }

  const toggleStatus = !user.isActive;

  await db
    .update(users)
    .set({ isActive: toggleStatus })
    .where(eq(users.id, userId))
    .execute();

  return toggleStatus;
};

export const getUserById = async (userId: number): Promise<UserType> => {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    with: {
      client: true,
      company: true,
    },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user;
};

export type GetUsersReturnType = {
  results: InferSelectModel<typeof users>[];
  paginatorInfo: GetPaginatorReturnType;
};

export const deleteUser = async (userId: number) => {
 

  await db.delete(users).where(eq(users.id, userId)).execute();
};

export const deleteBulkUsers = async (userIds: number[]) => {

  await db.delete(users).where(inArray(users.id, userIds)).execute();
};

export const getUsers = async (
  userId: number,
  payload: GetUsersSchemaType,
): Promise<GetUsersReturnType> => {
  const currentUser = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!currentUser) {
    throw new Error('User must be logged in');
  }

  const andConditions: (SQLWrapper | undefined)[] = [];

  if (payload.searchString) {
    andConditions.push(
      or(
        ilike(users.name, `%${payload.searchString}%`),
        ilike(users.email, `%${payload.searchString}%`),
      ),
    );
  }

  if (payload.filterByActive !== undefined && payload.filterByActive !== null) {
    andConditions.push(eq(users.isActive, payload.filterByActive));
  }

  const filter = and(...andConditions);

  const totalRecords = await db
    .select({ count: count(users.id) })
    .from(users)
    .where(filter)
    .execute();

  const paginatorInfo = getPaginator(
    payload.limitParam,
    payload.pageParam,
    totalRecords[0].count,
  );

  const results = await db.query.users.findMany({
    where: filter,
    with: {
      company: true,
    },
    limit: paginatorInfo.limit,
    offset: paginatorInfo.skip,
    orderBy: desc(users.id),
  });

  const  refinedResults = results;

  return {
    results: refinedResults,
    paginatorInfo,
  };
};

export const createUser = async (
  payload: InferInsertModel<typeof users>,
  checkExist: boolean = true,
): Promise<UserType> => {
  if (checkExist) {
    const isUserExist = await db.query.users.findFirst({
      where: eq(users.email, payload.email),
    });
    if (isUserExist) {
      throw new ConflictError('User already exists with a same email address');
    }
  }

  if (!payload.password) {
    throw new Error('Password is required');
  }

  const hashedPassword = await hashPassword(payload.password);

  const createdUser = (
    await db
      .insert(users)
      .values({
        ...payload,
        password: hashedPassword,
      })
      .returning()
      .execute()
  )[0];

  return { ...createdUser, password: '' };
};

export const seedUsers = async () => {
  await db.delete(users).execute();

  const password = 'Pa$$w0rd!';

  const usersEmails = [
    'owens@yopmail.com',
    'wells@yopmail.com',
    'garza@yopmail.com',
    'stuart@yopmail.com',
    'montoya@yopmail.com',
    'ruiz@yopmail.com',
    'hahn@yopmail.com',
  ];

  await Promise.all(
    usersEmails.map(async (email) => {
      const user = await createUser({
        email: email,
        name: faker.person.fullName(),

        password: password,
        isActive: [true, false][randomInt(1)],
      });

      return user;
    }),
  );
};
