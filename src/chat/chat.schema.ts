import z from 'zod';

export const IdSchema = z.object({
  id: z.string({ required_error: 'Id is Required.' }),
});

export const GetMessageByIdSchema = z.object({
  id: z.string({ required_error: 'Id is Required.' }),
  limit: z.number({ required_error: 'Id is Required.' }).min(1),
});
export const getAllMessagesInChatSchema = z.object({
  userId: z.string({ required_error: 'Email is Required.' }),
  user2Id: z.string({ required_error: 'Socket Id is required' }),
});
export const editMessageSchema = z.object({
  content: z.string({ required_error: 'content is Required.' }),
});

export const getMessagesSchema = z.object({
  userId: z.string({ required_error: 'User ID' }),
  user2Id: z.string({ required_error: 'User2 ID' }),
  createdAt: z.date({ required_error: 'Created At is required' }),
  limit: z
    .number({ required_error: 'Limit is required' })
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit must not exceed 100'),
});

export const deleteMessageSchema = z.object({
  messageId: z.string({ required_error: 'Message ID' }),
});

export const createMessageSchema = z.object({
  senderId: z.string({ required_error: 'Sender ID' }).transform(Number),
  receiverId: z.string({ required_error: 'Receiver ID' }).transform(Number),
  content: z.string({ required_error: 'Content is Required' }),
});

export type CreateMessageSchemaType = z.infer<typeof createMessageSchema>;

export type IdSchemaType = z.infer<typeof IdSchema>;
export type getAllMessagesInChatSchemaType = z.infer<
  typeof getAllMessagesInChatSchema
>;
export type EditMessageSchemaType = z.infer<typeof editMessageSchema>;
export type GetMessageSchemaType = z.infer<typeof getMessagesSchema>;
export type GetMessageByIdSchemaType = z.infer<typeof GetMessageByIdSchema>;
export type DeleteMessageSchemaType = z.infer<typeof deleteMessageSchema>;
