e(){ timeout 130 node VE.mjs "$1" 2>&1 | cut -c1-1000; }
e '{"tag":"M10-rename-same-addr","id":"b8ca0b10-ced8-4761-84a5-415674973359","name":"ZZAUTOTEST Xtreme Driveline 11071"}'
e '{"tag":"M11-rename-diff-addr","id":"fa79422a-d9c8-46a6-b2e9-b53417efbd5a","name":"ZZAUTOTEST Xtreme Driveline 11071","answer":"cancel"}'
e '{"tag":"M12-save-unchanged","id":"fa79422a-d9c8-46a6-b2e9-b53417efbd5a"}'
e '{"tag":"M12b-save-unchanged-samename","id":"2f2f75e2-9f79-4b80-93d1-1bee25a78061"}'
echo BATCHE DONE
