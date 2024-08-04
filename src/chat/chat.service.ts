import { and, asc, desc, eq, gt, lt, or } from 'drizzle-orm';
import { db } from '../drizzle/db';

import { messages } from '../drizzle/schema';
import { MessageType } from '../types';
import {
  CreateMessageSchemaType,
  DeleteMessageSchemaType,
  EditMessageSchemaType,
  getAllMessagesInChatSchemaType,
  GetMessageSchemaType,
  IdSchemaType,
} from './chat.schema';

export const getAllMessagesInChat = async (
  payload: getAllMessagesInChatSchemaType,
) => {
  const { user2Id, userId } = payload;
  return await db.query.messages.findFirst({
    where: or(
      and(
        eq(messages.senderId, Number(userId)),
        eq(messages.receiverId, Number(user2Id)),
      ),
      and(
        eq(messages.senderId, Number(user2Id)),
        eq(messages.receiverId, Number(userId)),
      ),
    ),
  });
};

export const findMessageById = async (
  payload: IdSchemaType,
): Promise<MessageType | null> => {
  const { id } = payload;
  const allMessages = await db
    .select()
    .from(messages)
    .where(eq(messages.id, Number(id)))
    .execute();

  return allMessages[0] || null;
};

export const editMessage = async (
  messageId: string,
  userId: string,
  payload: EditMessageSchemaType,
): Promise<MessageType | null> => {
  const { content } = payload;
  const [message] = await db
    .update(messages)
    .set({ content })
    .where(
      and(
        eq(messages.id, Number(messageId)),
        eq(messages.senderId, Number(userId)),
      ),
    )
    .returning()
    .execute();

  return message || null;
};

export async function getMessagesAfter(
  payload: GetMessageSchemaType,
): Promise<MessageType[]> {
  const { createdAt, limit, user2Id, userId } = payload;
  const getMessages = await db
    .select()
    .from(messages)
    .where(
      and(
        gt(messages.createdAt, createdAt.toDateString()),
        or(
          and(
            eq(messages.senderId, Number(userId)),
            eq(messages.receiverId, Number(user2Id)),
          ),
          and(
            eq(messages.senderId, Number(user2Id)),
            eq(messages.receiverId, Number(userId)),
          ),
        ),
      ),
    )
    .orderBy(asc(messages.createdAt))
    .limit(limit)
    .execute();

  return getMessages;
}

export async function getMessagesBefore(
  payload: GetMessageSchemaType,
): Promise<MessageType[]> {
  const { createdAt, limit, user2Id, userId } = payload;
  const getMessages = await db
    .select()
    .from(messages)
    .where(
      and(
        lt(messages.createdAt, createdAt.toDateString()),
        or(
          and(
            eq(messages.senderId, Number(userId)),
            eq(messages.receiverId, Number(user2Id)),
          ),
          and(
            eq(messages.senderId, Number(user2Id)),
            eq(messages.receiverId, Number(userId)),
          ),
        ),
      ),
    )
    .orderBy(desc(messages.createdAt))
    .limit(limit)
    .execute();

  return getMessages.reverse();
}

export async function deleteMessage(
  payload: DeleteMessageSchemaType,
  userId: string,
): Promise<MessageType | null> {
  const { messageId } = payload;
  const [message] = await db
    .delete(messages)
    .where(
      and(
        eq(messages.id, Number(messageId)),
        eq(messages.senderId, Number(userId)),
      ),
    )
    .returning()
    .execute();

  return message || null;
}

export async function insertMessage(
  payload: CreateMessageSchemaType,
): Promise<MessageType> {
  const [newMessage] = await db.insert(messages).values(payload).returning();
  return newMessage;
}
