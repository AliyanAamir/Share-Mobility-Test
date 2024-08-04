import * as z from 'zod';
import {
  isTransformableToBoolean,
  stringToBoolean,
  transformableToBooleanError,
} from '../utils/common.utils';
import validator from 'validator';

export const userIdSchema = z.object({
  id: z
    .string()
    .min(1)
    .refine((value) => validator.isNumeric(value), 'Id is not valid')
    .transform(Number),
});

export const userUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  phoneNo: z
    .string()
    .min(1)
    .refine(
      (value) => validator.isMobilePhone(value, 'any', { strictMode: true }),
      'Phone no must be valid',
    )
    .optional(),
  
});

export const bulkUserIdsSchema = z.object({
  ids: z
    .string()
    .array()
    .refine(
      (values) => values.every((value) => !isNaN(Number(value))),
      'Ids must be string-integer',
    )
    .transform((values) => values.map(Number)),
});

export const getUsersSchema = z.object({
  searchString: z.string().optional(),
  limitParam: z
    .string()
    .default('10')
    .refine(
      (value) => !isNaN(Number(value)) && Number(value) >= 0,
      'Input must be positive integer',
    )
    .transform(Number),
  pageParam: z
    .string()
    .default('1')
    .refine(
      (value) => !isNaN(Number(value)) && Number(value) >= 0,
      'Input must be positive integer',
    )
    .transform(Number),
  filterByActive: z
    .string()
    .refine(isTransformableToBoolean, transformableToBooleanError)
    .transform(stringToBoolean)
    .optional(),
});

export type GetUsersSchemaType = z.infer<typeof getUsersSchema>;

export type UserIdSchemaType = z.infer<typeof userIdSchema>;
export type BulkUserIdSchemaType = z.infer<typeof bulkUserIdsSchema>;

export type UserUpdateSchemaType = z.infer<typeof userUpdateSchema>;
