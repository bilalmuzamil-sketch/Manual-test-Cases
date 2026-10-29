#!/bin/bash
# Final re-run pass on the current build with the header-location assertion (F4 trap). Two lanes (Toronto / Karachi), each sequential.
# Logs to /tmp/cln/f2/final/. Each browser run keeps its own shots dir with suffix _final via the arg-free OUT name, so copy first.
D=$(cd "$(dirname "$0")" && pwd); L=/tmp/cln/f2/final; mkdir -p $L
for m in PV_DVI PV_DVI_B3 PV_DVI_B67 IV_DVI IV_DVI_DESEL PV_DVI_DESEL RET_PV_DESEL PV_HD PV_HD_DESEL; do [ -d /tmp/cln/f2/shots/$m ] && rm -rf /tmp/cln/f2/shots/${m}_first && mv /tmp/cln/f2/shots/$m /tmp/cln/f2/shots/${m}_first; done
# server reads first, one after the other (they share the private F2 session, and change-location is per session)
cd $D; TZ=America/Toronto python3 server_f2.py DVI final_after_cancel full > $L/srv_dvi.log 2>&1; TZ=Asia/Karachi python3 server_f2.py HD final full > $L/srv_hd.log 2>&1
( cd $D
  for m in PV_DVI PV_DVI_B3 IV_DVI; do TZ=America/Toronto timeout 900 node ev_f2.mjs $m > $L/$m.log 2>&1; done
  VW=2700 TZ=America/Toronto timeout 900 node ev_f2.mjs PV_DVI_B67 > $L/PV_DVI_B67.log 2>&1
  VW=2700 TZ=America/Toronto timeout 900 node ev_f2.mjs RET_PV_DESEL after_cancel > $L/RET_PV_DESEL.log 2>&1
  VW=2200 TZ=America/Toronto timeout 900 node ev_f2.mjs IV_DVI_DESEL > $L/IV_DVI_DESEL.log 2>&1
  TZ=America/Toronto timeout 900 node ev_f2.mjs PV_DVI_DESEL > $L/PV_DVI_DESEL.log 2>&1
  echo done > $L/lane_dvi.done ) &
( cd $D
  TZ=Asia/Karachi timeout 900 node ev_f2.mjs PV_HD > $L/PV_HD.log 2>&1
  VW=2700 TZ=Asia/Karachi timeout 900 node ev_f2.mjs PV_HD_DESEL > $L/PV_HD_DESEL.log 2>&1
  echo done > $L/lane_hd.done ) &
wait
