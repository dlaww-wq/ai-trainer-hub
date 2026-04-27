#!/bin/sh
cd /Users/imjaeyong/ai-trainer-hub-real
exec env PATH="/usr/local/bin:/usr/bin:/bin" \
  /usr/local/bin/node \
  /Users/imjaeyong/ai-trainer-hub-real/node_modules/.bin/next \
  dev \
  --port "${PORT:-3001}"
