// API 엔드포인트: 협업 세션 관리
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { action, sessionId, username } = await request.json();

  switch (action) {
    case 'create':
      // 세션 생성 (WebSocket으로 처리)
      return NextResponse.json({ message: 'WebSocket으로 연결해주세요' });

    case 'join':
      // 세션 참여 (WebSocket으로 처리)
      return NextResponse.json({ message: 'WebSocket으로 연결해주세요' });

    case 'list':
      // 활성 세션 목록 (향후 DB 연동)
      return NextResponse.json({ sessions: [] });

    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sessionId = searchParams.get('sessionId');

  if (sessionId) {
    // 특정 세션 정보 조회
    return NextResponse.json({ sessionId, members: [] });
  }

  // 모든 활성 세션 목록
  return NextResponse.json({ sessions: [] });
}
