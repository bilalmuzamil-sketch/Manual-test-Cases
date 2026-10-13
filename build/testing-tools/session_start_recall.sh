#!/bin/bash
# SessionStart hook (Rule 127, 2026-10-13): put the recall mechanism and the newest learnings in front of every new session,
# so it knows instantly where earlier work is written down. Output goes into the session's context; keep it short.
cd "$(git rev-parse --show-toplevel 2>/dev/null || pwd)" || exit 0
newest=$(grep -hE "^#{2,3} L0" build/LEARNINGS-LOG.md 2>/dev/null | tail -8 | sed -E 's/^#{2,3} /  /' | cut -c1-150)
suites=$(ls build/*/PROJECT-STATE.md 2>/dev/null | sed 's#build/##; s#/PROJECT-STATE.md##' | tr '\n' ' ')
ctx="RULE 127 — RECALL BEFORE NEW WORK, SAVE LEARNING WITHOUT BEING ASKED.
Before any new suite, task, probe, fix or 'blocked': python3 build/testing-tools/recall.py \"<feature or problem words>\" and the matching row of build/KNOWLEDGE-MAP.md.
Suites with a PROJECT-STATE.md: ${suites}
Newest learnings (build/LEARNINGS-LOG.md):
${newest}
Whenever something is learned (trap, route, fix, tool, site fact, ruling), save it in the same pass where the map says; a Stop hook (learning_gate.py) checks this."
over=$(python3 build/testing-tools/knowledge_health.py 2>/dev/null | grep " OVER " | awk '{print $1" ("$2" "$3")"}' | tr '\n' ' ')
[ -n "$over" ] && ctx="${ctx}
RULE 128 — files over their size budget (never read them whole; recall.py finds the block, --rule N / --section \"<heading>\" --file F prints just that part; split stores with knowledge_health.py shard F): ${over}"
python3 - "$ctx" <<'PY'
import json, sys
print(json.dumps({"hookSpecificOutput": {"hookEventName": "SessionStart", "additionalContext": sys.argv[1]}}))
PY
