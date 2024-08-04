import { CookieOptions } from 'express';
import config from '../config/config.service';

export const AUTH_COOKIE_KEY = 'accessToken';

export const COOKIE_CONFIG: CookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: config.NODE_ENV === 'production' ? true : false,
  maxAge: config.SESSION_EXPIRES_IN,
};
