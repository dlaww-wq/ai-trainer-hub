'use client';

import { useState, useEffect } from 'react';
import { wsClient } from '@/lib/websocket/client';
import { Users, LogOut, Share2 } from 'lucide-react';

interface SessionMember {
  userId: string;
  username: string;
  isActive: boolean;
}

interface CollaborativeLearnSessionProps {
  templateId: string;
  currentStep: number;
}

export default function CollaborativeLearnSession({
  templateId,
  currentStep,
}: CollaborativeLearnSessionProps) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionName, setSessionName] = useState('');
  const [members, setMembers] = useState<SessionMember[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [joinSessionId, setJoinSessionId] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    wsClient.connect();

    // 이벤트 리스너 등록
    wsClient.onMemberJoined((data) => {
      console.log('멤버 참여:', data);
    });

    wsClient.onMemberLeft((data) => {
      console.log('멤버 나감:', data);
    });

    wsClient.onStepCompleted((data) => {
      console.log('단계 완료:', data);
    });

    return () => {
      wsClient.disconnect();
    };
  }, []);

  const handleCreateSession = async () => {
    setIsCreating(true);
    try {
      const result = await wsClient.createSession(
        sessionName || '새 협업 세션',
        username || '사용자'
      );
      setSessionId(result.sessionId);
      setMembers([{ userId: 'self', username: username || '사용자', isActive: true }]);
    } catch (error) {
      console.error('세션 생성 실패:', error);
      alert('세션 생성에 실패했습니다');
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinSession = async () => {
    setIsJoining(true);
    try {
      const result = await wsClient.joinSession(joinSessionId, username || '사용자');
      setSessionId(result.id);
      setSessionName(result.name);
    } catch (error) {
      console.error('세션 참여 실패:', error);
      alert('세션 참여에 실패했습니다');
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeaveSession = () => {
    if (sessionId) {
      wsClient.leaveSession(sessionId);
      setSessionId(null);
      setSessionName('');
      setMembers([]);
    }
  };

  if (!sessionId) {
    return (
      <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🤝 협업 학습 시작
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 새 세션 생성 */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800">새 세션 생성</h4>
            <input
              type="text"
              placeholder="세션 이름"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="당신의 이름"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleCreateSession}
              disabled={isCreating}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400"
            >
              {isCreating ? '생성 중...' : '세션 생성'}
            </button>
          </div>

          {/* 기존 세션 참여 */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800">기존 세션 참여</h4>
            <input
              type="text"
              placeholder="세션 ID"
              value={joinSessionId}
              onChange={(e) => setJoinSessionId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="당신의 이름"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleJoinSession}
              disabled={isJoining || !joinSessionId}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400"
            >
              {isJoining ? '참여 중...' : '세션 참여'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-green-200 bg-green-50 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-green-600" />
          {sessionName}
        </h3>
        <button
          onClick={handleLeaveSession}
          className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
        >
          <LogOut className="w-4 h-4" />
          세션 나가기
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 멤버 목록 */}
        <div className="md:col-span-2">
          <h4 className="font-semibold text-gray-800 mb-3">참여자 ({members.length})</h4>
          <div className="space-y-2">
            {members.map((member) => (
              <div
                key={member.userId}
                className="flex items-center justify-between px-3 py-2 bg-white rounded-lg border border-gray-200"
              >
                <span className="font-medium text-gray-800">{member.username}</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    member.isActive ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 세션 정보 */}
        <div className="space-y-3">
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <p className="text-sm text-gray-600">세션 ID</p>
            <p className="text-xs font-mono text-gray-800 break-all">{sessionId}</p>
          </div>
          <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700">
            <Share2 className="w-4 h-4" />
            공유
          </button>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-700">
          현재 진행 단계: <span className="font-bold">{currentStep}</span>
        </p>
      </div>
    </div>
  );
}
