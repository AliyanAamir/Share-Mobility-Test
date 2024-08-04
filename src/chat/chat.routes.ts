import { Router } from 'express';
import { canAccess } from '../middlewares/can-access.middleware';
import { validateZodSchema } from '../middlewares/validate-zod-schema.middleware';
import {
  handleDeleteMessage,
  handleEditMessage,
  handleFindMessageById,
  handleGetMessagesBeforeAndAfter,
  handleInsertMessage,
} from './chat.controller';
import {
  createMessageSchema,
  deleteMessageSchema,
  editMessageSchema,
  GetMessageByIdSchema,
  IdSchema,
} from './chat.schema';

export const CHAT_ROUTER_ROOT = '/chat';

const chatRouter = Router();

chatRouter.post(
  '/message',
  canAccess(),
  validateZodSchema({ body: createMessageSchema }),
  handleInsertMessage,
);

chatRouter.get(
  '/message/:id',
  canAccess(),
  validateZodSchema({ params: IdSchema }),
  handleFindMessageById,
);

chatRouter.put(
  '/message/:id',
  canAccess(),
  validateZodSchema({ params: IdSchema, body: editMessageSchema }),
  handleEditMessage,
);

chatRouter.get(
  '/messages/:id/:limit',
  canAccess(),
  validateZodSchema({ params: GetMessageByIdSchema }),
  handleGetMessagesBeforeAndAfter,
);

chatRouter.delete(
  '/message/:id',
  canAccess(),
  validateZodSchema({ params: deleteMessageSchema }),
  handleDeleteMessage,
);

export default chatRouter;
