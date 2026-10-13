import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../../auth/better-auth';
import logger from '../../utils/logger';
import { allowedOrigins, isOriginAllowed, rejectOrigin } from '../../middleware/cors.middleware';

export interface NotificationPayload {
  id: string;
  title: string;
  body: string;
  metadata?: Record<string, unknown>;
  sentAt: string;
}

export interface RealtimeEventPayload {
  channel: string;
  event: string;
  data: unknown;
}

let io: Server | null = null;

const NOTIFICATION_ROOM_PREFIX = 'notifications:';

function userNotificationRoom(userId: string): string {
  return `${NOTIFICATION_ROOM_PREFIX}user:${userId}`;
}

export function initSocket(server: HttpServer): Server {
  io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (isOriginAllowed(origin, allowedOrigins)) {
          return callback(null, true);
        }
        return callback(rejectOrigin(origin as string));
      },
      credentials: true,
      methods: ['GET', 'POST'],
    },
    transports: ['polling', 'websocket'],
  });

  // Resolve the Better Auth session from the handshake (cookies or headers).
  // Guests may still connect, but only signed-in sockets can subscribe or join rooms.
  io.use(async (socket, next) => {
    try {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(socket.handshake.headers),
      });
      const user = session?.user;
      if (user && !user.isDeleted && user.isActive !== false) {
        socket.data.userId = user.id;
      }
    } catch (err) {
      logger.warn(`[Socket.IO] Session lookup failed for ${socket.id}: ${(err as Error).message}`);
    }
    next();
  });

  io.on('connection', (socket: Socket) => {
    logger.info(`[Socket.IO] Client connected: ${socket.id}`);
    let joinedRooms: string[] = [];

    // Subscribes the signed-in user to their own notification room. The user id
    // comes from the session, never from the client payload.
    socket.on('subscribe_notifications', () => {
      const userId: string | undefined = socket.data.userId;
      if (!userId) return;
      const room = userNotificationRoom(userId);
      if (!joinedRooms.includes(room)) {
        joinedRooms.push(room);
        void socket.join(room);
      }
      logger.info(`[Socket.IO] Socket ${socket.id} subscribed to notifications for user: ${userId}`);
    });

    // Generic Room Joining (e.g. workspace, dashboard, or chat)
    socket.on('join_room', (roomId: string) => {
      if (!socket.data.userId) return;
      if (!roomId || typeof roomId !== 'string') return;
      if (roomId.startsWith(NOTIFICATION_ROOM_PREFIX)) return;
      if (!joinedRooms.includes(roomId)) {
        joinedRooms.push(roomId);
        void socket.join(roomId);
      }
      logger.info(`[Socket.IO] Socket ${socket.id} joined room: ${roomId}`);
    });

    socket.on('leave_room', (roomId: string) => {
      if (!roomId) return;
      joinedRooms = joinedRooms.filter((r) => r !== roomId);
      void socket.leave(roomId);
      logger.info(`[Socket.IO] Socket ${socket.id} left room: ${roomId}`);
    });

    socket.on('disconnect', () => {
      logger.info(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });

  logger.info('[Socket.IO] Production realtime gateway initialized');
  return io;
}

/** Emit a notification to a specific user */
export function emitNotificationToUser(userId: string, notification: NotificationPayload): void {
  if (!io) return;
  const room = userNotificationRoom(userId);
  io.to(room).emit('notification:new', notification);
  logger.info(`[Socket.IO] Emitted notification to user room: ${room}`);
}

/** Broadcast an event to any room */
export function emitToRoom(room: string, event: string, data: unknown): void {
  if (!io) return;
  io.to(room).emit(event, data);
  logger.info(`[Socket.IO] Emitted event '${event}' to room: ${room}`);
}

/** Global broadcast */
export function emitBroadcast(event: string, data: unknown): void {
  if (!io) return;
  io.emit(event, data);
  logger.info(`[Socket.IO] Broadcasted event: ${event}`);
}

export function getIO(): Server | null {
  return io;
}
