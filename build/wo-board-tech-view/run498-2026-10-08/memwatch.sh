#!/bin/bash
# 15 Oct 2026: two machine restarts in a row, both while one test script was running. Guard: every 10 s, if available
# memory falls under 2.5 GB, kill the newest headless Chromium tree and node test script, and log it, so a runaway script
# fails on its own instead of taking the machine (and every other pass) down with it.
LOG=$(dirname "$0")/evidence/staging-full-2026-10-14/memwatch.log
while true; do
  a=$(awk '/MemAvailable/ {print int($2/1024)}' /proc/meminfo)
  if [ "$a" -lt 2500 ]; then
    echo "$(date -u +%H:%M:%S) MemAvailable ${a} MB — killing test browsers and scripts" >> "$LOG"
    ps -eo pid,rss,args --sort=-rss | grep -E "[c]hrome|[t]sx|wob-run" | head -5 >> "$LOG"
    pkill -f "chrome-linux/chrome" ; pkill -f "npx tsx" ; pkill -f "tsx/dist"
    sleep 30
  fi
  sleep 10
done
