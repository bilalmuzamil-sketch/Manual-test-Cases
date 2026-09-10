#!/usr/bin/env bash
# run_queue.sh -- KEEP WORKING WITHOUT BEING PROMPTED.
#
# WHY THIS EXISTS. 2026-09-10: a probe finished, the next one was not launched, and the session sat
# idle until the QA lead asked "are you done? I do not see any running task". Nothing was blocked and
# nothing was finished -- the chain simply stopped between steps. In unattended mode that is dead time
# nobody is watching for.
#
# THE FIX: never hand-launch one step at a time. Put the whole remaining list in a queue file and let
# this runner walk it. Finishing a step STARTS the next one automatically; a step that crashes does
# not stop the queue.
#
# USAGE
#   build/testing-tools/run_queue.sh <queue-file> [tag]
#     queue-file : one command per line; blank lines and #comments ignored
#     tag        : label for the log (default: queue)
#
#   Status:  build/testing-tools/run_queue.sh --status [tag]
#
# The runner writes /tmp/queue-<tag>.log with a START/EXIT line per step and QUEUE-DONE at the end,
# so a session can poll one file instead of guessing.

set -uo pipefail
cd "$(dirname "$0")/../.." || exit 1

if [ "${1:-}" = "--status" ]; then
  tag="${2:-queue}"; log="/tmp/queue-${tag}.log"
  [ -f "$log" ] || { echo "no queue log for tag '${tag}'"; exit 1; }
  total=$(grep -c '^START ' "$log" 2>/dev/null || echo 0)
  done_n=$(grep -c '^EXIT '  "$log" 2>/dev/null || echo 0)
  if grep -q '^QUEUE-DONE' "$log"; then state="FINISHED"; else state="RUNNING"; fi
  echo "queue '${tag}': ${state} -- ${done_n} finished of ${total} started"
  grep -E '^(START|EXIT|QUEUE-DONE)' "$log" | tail -12
  exit 0
fi

queue="${1:?usage: run_queue.sh <queue-file> [tag]  |  run_queue.sh --status [tag]}"
tag="${2:-queue}"
log="/tmp/queue-${tag}.log"
: > "$log"

[ -f "$queue" ] || { echo "queue file not found: $queue" | tee -a "$log"; exit 1; }

n=0
while IFS= read -r line || [ -n "$line" ]; do
  case "$line" in ''|'#'*) continue ;; esac
  n=$((n+1))
  echo "START $n $(date -u +%H:%M:%S) :: $line" >> "$log"
  # the bridge port rotates; refresh it before every step rather than once per queue
  bash build/testing-tools/ensure_bridge.sh >/dev/null 2>&1
  # shellcheck disable=SC2086
  eval "$line" >> "$log" 2>&1
  echo "EXIT  $n rc=$? $(date -u +%H:%M:%S)" >> "$log"
  sleep 20                     # login trap 2: two quick-logins close together collide
done < "$queue"

echo "QUEUE-DONE $(date -u +%H:%M:%S) -- $n steps" >> "$log"
