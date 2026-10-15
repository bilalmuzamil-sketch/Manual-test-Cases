set -u
run(){ timeout 160 node NT.mjs "$@" 2>&1 | grep -E "^T|list|reload|stored|input shows|Error|error" | cut -c1-400; }
run America/New_York type 1 T3-NY-type
run America/New_York cal 1 T4-NY-morning 2026-10-15T10:00:00-04:00
run America/Los_Angeles cal 1 T5-LA
run Pacific/Honolulu cal 1 T5-HNL
run UTC cal 1 T6-UTC
run Asia/Karachi cal 1 T6-KHI
run Asia/Tokyo cal 1 T6-TYO
run Pacific/Kiritimati cal 1 T6-KIR
run America/New_York cal 1 T7-NY-monthend 2026-10-31T20:00:00-04:00
run America/New_York cal 2 T7-NY-dst 2026-10-31T20:00:00-04:00
run America/New_York type 2 T7-NY-dst-type 2026-10-31T20:00:00-04:00
run America/New_York cal 0 T10-NY-today
echo BATCH1 DONE
