// WebSocket 클라이언트 (클라이언트 사이드)
import { io, Socket } from 'socket.io-client';

export interface ClientSession {
  id: string;
  name: string;
  members: Map<string, any>;
  currentStep: number;
}

class WebSocketClient {
  private socket: Socket | null = null;
  private isConnected = false;

  connect() {
    if (this.isConnected) return;

    const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    this.socket = io(url, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('[WebSocket] 연결됨');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('[WebSocket] 연결 해제됨');
      this.isConnected = false;
    });
  }

  createSession(name: string, creator: string): Promise<{ sessionId: string }> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('WebSocket이 연결되지 않음'));
        return;
      }

      this.socket.emit('create_session', { name, creator }, (response: any) => {
        if (response.success) {
          resolve({ sessionId: response.sessionId });
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  joinSession(sessionId: string, username: string): Promise<ClientSession> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('WebSocket이 연결되지 않음'));
        return;
      }

      this.socket.emit('join_session', { sessionId, username }, (response: any) => {
        if (response.success) {
          resolve(response.session);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  completeStep(sessionId: string, stepId: number, result: any) {
    if (!this.socket) return;

    this.socket.emit('step_completed', {
      sessionId,
      stepId,
      result,
    });
  }

  leaveSession(sessionId: string) {
    if (!this.socket) return;

    this.socket.emit('leave_session', { sessionId });
  }

  onStepCompleted(callback: (data: any) => void) {
    if (!this.socket) return;
    this.socket.on('step_completed', callback);
  }

  onMemberJoined(callback: (data: any) => void) {
    if (!this.socket) return;
    this.socket.on('member_joined', callback);
  }

  onMemberLeft(callback: (data: any) => void) {
    if (!this.socket) return;
    this.socket.on('member_left', callback);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.isConnected = false;
    }
  }
}

export const wsClient = new WebSocketClient();
