import { relations } from 'drizzle-orm';
import { boolean, date, pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email').unique().notNull(),
  name: varchar('name').notNull(),
  phoneNo: varchar('phone_no'),
  isActive: boolean('is_active').default(false),
  socketId: varchar('socket_id'),
  password: varchar('password').notNull(),
  passwordResetToken: varchar('password_reset_token'),
  setPasswordToken: varchar('set_password_token'),
  createdAt: date('created_at').defaultNow(),
  updatedAt: date('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date().toISOString()),
});

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  senderId: serial('sender_id')
    .references(() => users.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  receiverId: serial('reciever_id')
    .references(() => users.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  content: varchar('content').notNull(),
  createdAt: date('created_at').defaultNow(),
  updatedAt: date('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date().toISOString()),
});

export const messageRelation = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
  reciever: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
  }),
}));
