N='ZZAUTOTEST Xtreme Driveline 11071'
v(){ timeout 130 node VC.mjs "$1" 2>&1 | cut -c1-900; }
v '{"tag":"M2-exact","name":"ZZAUTOTEST Xtreme Driveline 11071","a1":"12 Test Road","city":"Calgary","zip":"T2P 1A1"}'
v '{"tag":"M3-case-space","name":"  zzautotest   XTREME driveline 11071 ","a1":"12  TEST road","city":"calgary","zip":"t2p 1a1"}'
v '{"tag":"M4-blank-a2","name":"ZZAUTOTEST Xtreme Driveline 11071","a1":"12 Test Road","a2":"   ","city":"Calgary","zip":"T2P 1A1"}'
v '{"tag":"M5-warn-cancel","name":"ZZAUTOTEST Xtreme Driveline 11071","a1":"12 Test Road","city":"Calgary","zip":"T3A 0B1","answer":"cancel"}'
v '{"tag":"M6-warn-continue","name":"ZZAUTOTEST Xtreme Driveline 11071","a1":"12 Test Road","city":"Calgary","zip":"T3A 0B1","answer":"continue"}'
v '{"tag":"M7-country","name":"ZZAUTOTEST Xtreme Driveline 11071","a1":"12 Test Road","city":"Calgary","zip":"T2P 1A1","country":"United States","answer":"cancel"}'
v '{"tag":"M8-other-name","name":"ZZAUTOTEST Other Vendor 11071","a1":"12 Test Road","city":"Calgary","zip":"T2P 1A1"}'
v '{"tag":"M9-rapid","name":"ZZAUTOTEST Rapid Save 11071","a1":"9 Rapid St","city":"Calgary","zip":"T2P 2B2","clicks":6}'
echo BATCHV DONE
