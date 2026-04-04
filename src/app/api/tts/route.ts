import { NextRequest, NextResponse } from "next/server";
import { ElevenLabsClient } from "elevenlabs";

// 기본 목소리 ID (Rachel - 자연스러운 한국어 지원)
const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM";

function getClient() {
  return new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY || "" });
}

export async function POST(req: NextRequest) {
  try {
    const { text, voiceId, modelId } = await req.json();

    if (!text?.trim()) {
      return NextResponse.json({ error: "text 필수" }, { status: 400 });
    }

    if (!process.env.ELEVENLABS_API_KEY) {
      return NextResponse.json(
        { error: "ELEVENLABS_API_KEY 미설정" },
        { status: 500 }
      );
    }

    const audioStream = await getClient().textToSpeech.convert(
      voiceId || DEFAULT_VOICE_ID,
      {
        text,
        model_id: modelId || "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.3,
          use_speaker_boost: true,
        },
      }
    );

    // Stream을 Buffer로 변환
    const chunks: Buffer[] = [];
    for await (const chunk of audioStream) {
      chunks.push(Buffer.from(chunk));
    }
    const audioBuffer = Buffer.concat(chunks);

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.length.toString(),
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    console.error("[TTS] 오류:", err);
    return NextResponse.json({ error: "TTS 생성 실패" }, { status: 500 });
  }
}

// 사용 가능한 목소리 목록
export async function GET() {
  try {
    if (!process.env.ELEVENLABS_API_KEY) {
      return NextResponse.json({ voices: [] });
    }
    const { voices } = await getClient().voices.getAll();
    const voiceList = voices.map((v) => ({
      id: v.voice_id,
      name: v.name,
      category: v.category,
      preview_url: v.preview_url,
    }));
    return NextResponse.json({ voices: voiceList });
  } catch {
    return NextResponse.json({ voices: [] });
  }
}
