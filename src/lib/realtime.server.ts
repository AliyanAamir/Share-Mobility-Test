import { Server as IServer } from 'http';
import { Server as RealtimeServer } from 'socket.io';
import { handleStablishChatSocket } from '../chat/chat.controller';
import { OnlineUsers } from '../socket/online-users.socket';

let io: RealtimeServer | null = null;

export const useSocketIo = (server?: IServer): RealtimeServer => {
  if (io instanceof RealtimeServer) {
    return io;
  } else if (!server) {
    throw new Error('Server instanse is required');
  }

  io = new RealtimeServer(server, {
    transports: ['websocket'],
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    const onlineUsers = new OnlineUsers();

    handleStablishChatSocket(socket, onlineUsers);

    socket.on('addUser', (userId) => {
      onlineUsers.addUser(userId, socket.id);
    });

    socket.on('disconnect', () => {
      onlineUsers.removeUser(socket.id);
      console.log(' user disconnected');
    });
  });

  return io;
};
