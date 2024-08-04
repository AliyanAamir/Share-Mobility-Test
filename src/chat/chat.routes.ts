import { Router } from 'express';
import { validateZodSchema } from '../middlewares/validate-zod-schema.middleware';
import {
    handleDeleteMessage,
    handleEditMessage,
    handleFindMessageById,
    handleGetMessagesAfter,
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

// Insert a new message
chatRouter.post(
  '/message',

  validateZodSchema({ body: createMessageSchema }),
  handleInsertMessage,
);

// Get a message by its ID
chatRouter.get(
  '/message/:id',

  validateZodSchema({ params: IdSchema }),
  handleFindMessageById,
);

// Edit a message
chatRouter.put(
  '/message/:id',

  validateZodSchema({ params: IdSchema, body: editMessageSchema }),
  handleEditMessage,
);

// Get messages before and after a specific message
chatRouter.get(
  '/messages/:id/after/:limit',
 
  validateZodSchema({ params: GetMessageByIdSchema }),
  handleGetMessagesAfter,
);

// Delete a message
chatRouter.delete(
  '/message/:id',

  validateZodSchema({ params: deleteMessageSchema }),
  handleDeleteMessage,
);

export default chatRouter;
