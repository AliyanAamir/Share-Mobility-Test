import argon2 from 'argon2';
import { JsonWebTokenError, sign, verify } from 'jsonwebtoken';
import crypto from 'node:crypto';
import config from '../config/config.service';
import logger from '../lib/logger.service';

export type JwtPayload = {
  sub: string;
  email: string;
  name: string;
};

export type PasswordResetTokenPayload = {
  email: string;
  userId: string;
};

export type SetPasswordTokenPayload = {
  email: string;
  userId: string;
};

export type VerifyTokenType =
  | JwtPayload
  | PasswordResetTokenPayload
  | SetPasswordTokenPayload;

export const hashPassword = async (password: string): Promise<string> => {
  return argon2.hash(password);
};

export const compareHash = async (
  hashed: string,
  plainPassword: string,
): Promise<boolean> => {
  return argon2.verify(hashed, plainPassword);
};

export const signToken = async (payload: JwtPayload): Promise<string> => {
  return sign(payload, String(config.JWT_SECRET), {
    expiresIn: config.JWT_EXPIRES_IN,
  });
};

export const signPasswordResetToken = async (
  payload: PasswordResetTokenPayload,
) => {
  return sign(payload, String(config.JWT_SECRET), {
    expiresIn: config.PASSWORD_RESET_TOKEN_EXPIRES_IN,
  });
};

export const signSetPasswordToken = async (
  payload: SetPasswordTokenPayload,
) => {
  return sign(payload, String(config.JWT_SECRET), {
    expiresIn: config.SET_PASSWORD_TOKEN_EXPIRES_IN,
  });
};

export const verifyToken = async <T extends VerifyTokenType>(
  token: string,
): Promise<T> => {
  try {
    return verify(token, String(config.JWT_SECRET)) as T;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }

    if (err instanceof JsonWebTokenError) {
      throw new Error(err.message);
    }

    logger.error('verifyToken', { err });
    throw err;
  }
};

export const generateRandomPassword = (length: number = 16): string => {
  return crypto.randomBytes(length).toString('hex');
};
