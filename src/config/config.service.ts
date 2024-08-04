import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
  REDIS_URL: z.string().url(),
  PORT: z.string().regex(/^\d+$/).transform(Number),
  DATABASE_URL: z.string().url(),
  CLIENT_SIDE_URL: z.string().url(),
  JWT_SECRET: z.string().min(1),
  JWT_EXPIRES_IN: z.string().min(1).transform(Number),
  SESSION_EXPIRES_IN: z.string().min(1).transform(Number),
  PASSWORD_RESET_TOKEN_EXPIRES_IN: z.string().min(1).transform(Number),
  SET_PASSWORD_TOKEN_EXPIRES_IN: z.string().min(1).transform(Number),
  NODE_ENV: z.union([z.literal('production'), z.literal('development')]),
});

export type Config = z.infer<typeof configSchema>;

const config = configSchema.parse(process.env);

export default config;
