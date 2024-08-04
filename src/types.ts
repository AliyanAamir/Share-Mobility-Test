import { InferSelectModel } from 'drizzle-orm';
import { messages, users } from './drizzle/schema';

export type UserType = InferSelectModel<typeof users>;
export type MessageType = InferSelectModel<typeof messages>;
