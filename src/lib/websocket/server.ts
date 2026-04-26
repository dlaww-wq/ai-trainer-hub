// WebSocket 서버 설정 (Socket.io)
import { Server as HTTPServer } from 'http';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error socket.io 패키지 미설치 (선택적 의존성)
import { Socket as ServerSocket, Server } from 'socket.io';

export interface LearnSession {
  id: string;
  name: string;
  creator: string;
  createdAt: Date;
  members: Map<string, SessionMember>;
  currentStep: number;
  results: SessionResult[];
}

export interface SessionMember {
  userId: string;
  username: string;
  joinedAt: Date;
  isActive: boolean;
}

export interface SessionResult {
  memberId: string;
  stepId: number;
  result: any;
  completedAt: Date;
}

export interface SessionEvent {
  type: 'step_completed' | 'member_joined' | 'member_left' | 'result_updated';
  data: any;
  timestamp: Date;
}

let io: Server;
const sessions = new Map<string, LearnSession>();

export function initializeWebSocket(httpServer: HTTPServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
      credentials: true,
    },
  });

  io.on('connection', (socket: ServerSocket) => {
    console.log(`[WebSocket] 사용자 연결: ${socket.id}`);

    // 협업 세션 생성
    socket.on('create_session', (data: { name: string; creator: string }, callback: (res: { success: boolean; sessionId?: string }) => void) => {
      const sessionId = `session_${Date.now()}`;
      const newSession: LearnSession = {
        id: sessionId,
        name: data.name,
        creator: data.creator,
        createdAt: new Date(),
        members: new Map(),
        currentStep: 0,
        results: [],
      };

      sessions.set(sessionId, newSession);
      socket.join(sessionId);

      const member: SessionMember = {
        userId: socket.id,
        username: data.creator,
        joinedAt: new Date(),
        isActive: true,
      };
      newSession.members.set(socket.id, member);

      callback({ success: true, sessionId });
      io.emit('session_created', { sessionId, name: data.name });
    });

    // 협업 세션 참여
    socket.on('join_session', (data: { sessionId: string; username: string }, callback: (res: { success: boolean; error?: string; session?: LearnSession }) => void) => {
      const session = sessions.get(data.sessionId);
      if (!session) {
        callback({ success: false, error: '세션을 찾을 수 없습니다' });
        return;
      }

      socket.join(data.sessionId);

      const member: SessionMember = {
        userId: socket.id,
        username: data.username,
        joinedAt: new Date(),
        isActive: true,
      };
      session.members.set(socket.id, member);

      callback({ success: true, session });

      io.to(data.sessionId).emit('member_joined', {
        memberId: socket.id,
        username: data.username,
      });
    });

    // 학습 단계 완료
    socket.on('step_completed', (data: { sessionId: string; stepId: number; result: any }) => {
      const session = sessions.get(data.sessionId);
      if (!session) return;

      const result: SessionResult = {
        memberId: socket.id,
        stepId: data.stepId,
        result: data.result,
        completedAt: new Date(),
      };

      session.results.push(result);
      session.currentStep = Math.max(session.currentStep, data.stepId + 1);

      io.to(data.sessionId).emit('step_completed', {
        memberId: socket.id,
        stepId: data.stepId,
        result: data.result,
      });
    });

    // 세션 종료
    socket.on('leave_session', (data: { sessionId: string }) => {
      const session = sessions.get(data.sessionId);
      if (session) {
        session.members.delete(socket.id);
        
        if (session.members.size === 0) {
          sessions.delete(data.sessionId);
        }
      }

      socket.leave(data.sessionId);
      io.to(data.sessionId).emit('member_left', { memberId: socket.id });
    });

    socket.on('disconnect', () => {
      console.log(`[WebSocket] 사용자 연결 해제: ${socket.id}`);

      // 모든 세션에서 제거
      sessions.forEach((session, sessionId) => {
        if (session.members.has(socket.id)) {
          session.members.delete(socket.id);
          io.to(sessionId).emit('member_left', { memberId: socket.id });

          if (session.members.size === 0) {
            sessions.delete(sessionId);
          }
        }
      });
    });
  });

  return io;
}

export function getIO(): Server {
  return io;
}

export function getSession(sessionId: string): LearnSession | undefined {
  return sessions.get(sessionId);
}

export function getAllSessions(): LearnSession[] {
  return Array.from(sessions.values());
}
