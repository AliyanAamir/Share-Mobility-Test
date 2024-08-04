import validator from 'validator';
import z from 'zod';

export const passwordValidation = (fieldName: string) =>
  z
    .string({ required_error: `${fieldName} is required` })
    .min(8, `${fieldName} must contain atleast 8 characters`)
    .max(64, `${fieldName} should not contain more than 64 characters`)
    .refine(
      (value) =>
        validator.isStrongPassword(value, {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minSymbols: 1,
          minNumbers: 1,
        }),
      `${fieldName} must be strong, should contain 1 lowercase letter, 1 uppercase letter, 1 special character, 1 number atleast`,
    );

const baseAuthSchema = {
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Email is not valid' }),
  password: passwordValidation('password'),
};

export const setPasswordSchema = z
  .object({
    token: z.string({ required_error: 'token is required' }).min(1),
    password: passwordValidation('password'),
    confirmPassword: passwordValidation('confirm password'),
  })
  .refine(
    (values) => values.confirmPassword === values.password,
    'Password and confirm password must be same',
  );

export const resetPasswordSchema = z.object({
  token: z.string({ required_error: 'token is required' }).min(1),
  password: passwordValidation('password'),
  confirmPassword: passwordValidation('confirm password'),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string({ required_error: 'Current password is required' })
      .min(1),
    newPassword: passwordValidation('new password'),
    confirmPassword: passwordValidation('confirm password'),
  })
  .refine(({ newPassword, confirmPassword }) => {
    return newPassword === confirmPassword;
  }, 'confirm password and new password must be same');

export const forgetPasswordSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Email must be valid' }),
});

export const registerUserSchema = z.object({
  ...baseAuthSchema,
  name: z.string({ required_error: 'Name is required' }),
});

export const UpdateSocketIdSchema = z.object({
  email: z.string({ required_error: 'Email is Required.' }),
  socketId: z.string({ required_error: 'Socket Id is required' }),
});

export const loginUserSchema = z.object({
  ...baseAuthSchema,
});

export type RegisterUserSchemaType = z.infer<typeof registerUserSchema>;
export type LoginUserSchemaType = z.infer<typeof loginUserSchema>;
export type UpdateSocketIdSchemaType = z.infer<typeof UpdateSocketIdSchema>;
export type ChangePasswordSchemaType = z.infer<typeof changePasswordSchema>;
export type ForgetPasswordSchemaType = z.infer<typeof forgetPasswordSchema>;
export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;
export type SetPasswordSchemaType = z.infer<typeof setPasswordSchema>;
