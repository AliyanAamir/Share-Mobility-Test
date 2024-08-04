import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ConflictError, NotFoundError } from '../errors/errors.service';

import {
  insertMessage,
  findMessageById,
  editMessage,
  getMessagesAfter,
  getMessagesBefore,
  deleteMessage,
} from './chat.service';

import { Socket as ISocket } from 'socket.io';

import { successResponse, errorResponse } from '../utils/api.utils';
import {
  CreateMessageSchemaType,
  DeleteMessageSchemaType,
  EditMessageSchemaType,
  GetMessageByIdSchemaType,
  GetMessageSchemaType,
  IdSchemaType,
} from './chat.schema';
import { OnlineUsers } from '../socket/online-users.socket';

export const handleInsertMessage = async (
  req: Request<never, never, CreateMessageSchemaType>,
  res: Response,
) => {
  try {
    const senderId = req.user.sub;
    const newMessage = await insertMessage(senderId, req.body);
    return successResponse(res, 'Message successfully created', newMessage);
  } catch (err) {
    if (err instanceof ConflictError) {
      return errorResponse(res, err.message, StatusCodes.CONFLICT);
    }
    return errorResponse(res, (err as Error).message, StatusCodes.BAD_REQUEST);
  }
};

export const handleFindMessageById = async (
  req: Request<IdSchemaType, never, never>,
  res: Response,
) => {
  try {
    const message = await findMessageById(req.params);
    if (!message) throw new NotFoundError('Message not found');
    return successResponse(res, 'Message found', message);
  } catch (err) {
    if (err instanceof NotFoundError) {
      return errorResponse(res, err.message, StatusCodes.NOT_FOUND);
    }
    return errorResponse(res, (err as Error).message, StatusCodes.BAD_REQUEST);
  }
};

export const handleEditMessage = async (
  req: Request<IdSchemaType, never, EditMessageSchemaType>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const userId = req.user.sub;

    const updatedMessage = await editMessage(id, userId, req.body);
    if (!updatedMessage)
      throw new NotFoundError('Message not found or not authorized to edit');
    return successResponse(res, 'Message successfully updated', updatedMessage);
  } catch (err) {
    if (err instanceof NotFoundError) {
      return errorResponse(res, err.message, StatusCodes.NOT_FOUND);
    }
    return errorResponse(res, (err as Error).message, StatusCodes.BAD_REQUEST);
  }
};

export const handleGetMessagesBeforeAndAfter = async (
  req: Request<GetMessageByIdSchemaType, never, never>,
  res: Response,
) => {
  try {
    const userId = req.user.sub;
    const messageId = req.params.id;
    const limit = +req.params.limit;
    const specificMessage = await findMessageById({ id: messageId });
    const receiverId = specificMessage?.receiverId.toString() as string;
    const user2Id =
      receiverId === userId
        ? (specificMessage?.senderId.toString() as string)
        : receiverId;

    const beforeMessagesQuery = getMessagesBefore({
      userId,
      user2Id,
      createdAt: specificMessage?.createdAt as string,
      limit,
    });
    const afterMessagesQuery = getMessagesAfter({
      userId,
      user2Id,
      createdAt: specificMessage?.createdAt as string,
      limit,
    });

    const [beforeMessages, afterMessages] = await Promise.all([
      beforeMessagesQuery,
      afterMessagesQuery,
    ]);

    return successResponse(res, 'Messages retrieved', {
      beforeMessages,
      afterMessages,
    });
  } catch (err) {
    return errorResponse(res, (err as Error).message, StatusCodes.BAD_REQUEST);
  }
};

export const handleDeleteMessage = async (
  req: Request<DeleteMessageSchemaType, never, never>,
  res: Response,
) => {
  try {
    const userId = req.user.sub as string;
    const deletedMessage = await deleteMessage(req.params, userId);
    if (!deletedMessage)
      throw new NotFoundError('Message not found or not authorized to delete');
    return successResponse(res, 'Message successfully deleted', deletedMessage);
  } catch (err) {
    if (err instanceof NotFoundError) {
      return errorResponse(res, err.message, StatusCodes.NOT_FOUND);
    }
    return errorResponse(res, (err as Error).message, StatusCodes.BAD_REQUEST);
  }
};

export function handleStablishChatSocket(
  io: ISocket,
  onlineUsers: OnlineUsers,
) {
  io.on('sendMessage', async (content, userId) => {
    const user = onlineUsers.get(userId);
    const senderId = onlineUsers.getUserIdBySocketId(io.id);

    if (user) {
      io.to(user).emit('sendMessage', { content, from: io.id });
    }

    await insertMessage(senderId.toString(), {
      content,
      receiverId: userId,
    });
  });
}
