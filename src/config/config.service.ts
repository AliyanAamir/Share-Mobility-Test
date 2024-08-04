import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
  REDIS_URL: z.string().url(),
  PORT: z.string().regex(/^\d+$/).transform(Number),
  DATABASE_URL: z.string().url(),
  
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.string().regex(/^\d+$/).transform(Number),
  SMTP_USERNAME: z.string().email(),
  EMAIL_FROM: z.string().email(),
  SMTP_FROM: z.string().min(1),
  SMTP_PASSWORD: z.string().min(1),
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
