#!/bin/bash

# 스크린샷 디렉토리
SCREENSHOTS_DIR="/c/Users/pc/ai-trainer-hub/public/screenshots"
OUTPUT_DIR="/c/Users/pc/ai-trainer-hub/public/videos"
OUTPUT_FILE="$OUTPUT_DIR/demo.mp4"

# 출력 디렉토리 생성
mkdir -p "$OUTPUT_DIR"

echo "🎬 데모 영상 생성 시작..."
echo "📁 입력: $SCREENSHOTS_DIR"
echo "📁 출력: $OUTPUT_FILE"
echo ""

# FFmpeg 필터: 각 이미지 3초씩, 1초 페이드 인/아웃
ffmpeg -y \
  -framerate 1/3 \
  -i "$SCREENSHOTS_DIR/home.png" \
  -i "$SCREENSHOTS_DIR/templates.png" \
  -i "$SCREENSHOTS_DIR/solutions.png" \
  -i "$SCREENSHOTS_DIR/learn.png" \
  -filter_complex \
  "[0]scale=1440:900:force_original_aspect_ratio=decrease,pad=1440:900:(ow-iw)/2:(oh-ih)/2[v0]; \
   [1]scale=1440:900:force_original_aspect_ratio=decrease,pad=1440:900:(ow-iw)/2:(oh-ih)/2[v1]; \
   [2]scale=1440:900:force_original_aspect_ratio=decrease,pad=1440:900:(ow-iw)/2:(oh-ih)/2[v2]; \
   [3]scale=1440:900:force_original_aspect_ratio=decrease,pad=1440:900:(ow-iw)/2:(oh-ih)/2[v3]; \
   [v0]format=yuv420p[c0]; \
   [c0]pad=iw:ih:0:0:black[f0]; \
   [f0]fps=30[vv0]; \
   [v1]format=yuv420p[c1]; \
   [c1]pad=iw:ih:0:0:black[f1]; \
   [f1]fps=30[vv1]; \
   [v2]format=yuv420p[c2]; \
   [c2]pad=iw:ih:0:0:black[f2]; \
   [f2]fps=30[vv2]; \
   [v3]format=yuv420p[c3]; \
   [c3]pad=iw:ih:0:0:black[f3]; \
   [f3]fps=30[vv3]; \
   [vv0]scale=1440:900[s0]; \
   [vv1]scale=1440:900[s1]; \
   [vv2]scale=1440:900[s2]; \
   [vv3]scale=1440:900[s3]; \
   [s0][s1][s2][s3]concat=n=4:v=1:a=0,format=yuv420p" \
  -c:v libx264 \
  -preset fast \
  -crf 23 \
  -r 30 \
  "$OUTPUT_FILE"

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ 데모 영상 생성 완료!"
  ls -lh "$OUTPUT_FILE"
else
  echo "✗ 영상 생성 실패"
fi
