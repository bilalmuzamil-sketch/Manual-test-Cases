run(){ timeout 170 node NT.mjs "$@" 2>&1 | grep -E "^P|list|stored|input shows|Error" | cut -c1-300; }
run America/New_York cal 2 P-T2-NY - prod WOP.json
run America/New_York cal 1 P-T4-NY-morning 2026-10-15T10:00:00-04:00 prod WOP.json
run America/Los_Angeles cal 1 P-T5-LA - prod WOP.json
run Asia/Karachi cal 1 P-T6-KHI - prod WOP.json
timeout 120 node NV.mjs America/New_York P-T9-view-NY prod WOP.json 2>&1 | cut -c1-300
timeout 120 node NV.mjs Asia/Karachi P-T9-view-KHI prod WOP.json 2>&1 | cut -c1-300
echo BATCHP DONE
