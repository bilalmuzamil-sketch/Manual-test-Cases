#!/bin/bash
# SV-11822 full branch matrix: location switched ON SCREEN, reload, Profile > chip. DPR x location x (no delay | late options RAF 1500), then one switch from the opened list.
cd "$(dirname "$0")"
summ(){ python3 -c "
import sys,json
o=[]
for l in sys.stdin:
  if l.startswith('MENUS'):
    for m in json.loads(l[6:]):
      if 'limit-select' in m['cls']: o.append('final y=%.0f vis=%s items=%d'%(m['y'],m['vis'],len(m['items'])))
  elif l.startswith('MENUS')==False and l.startswith(('SWITCHED','AFTER','CHIP NOW','BUILD')): o.append(l.strip()[:150])
print(' || '.join(o))"; }
for d in 1.25 1.5 1; do for w in "DVI Test" "Staging Heavy Duty - 9919" "Staging Lethbridge - 4310" "Test Location"; do for r in 0 1500; do
  echo "DPR $d | $w | RAF $r | $(env DIR=/tmp/qa94 RAF=$r CWAIT=200 timeout 170 node loc.mjs $d "m3-$d-$(echo $w|tr -dc A-Za-z|cut -c1-10)-r$r" "$w" 2>&1 | grep -E '^(MENUS|SWITCHED)' | summ)"; done; done; done
echo "SWITCH FROM LIST | DPR 1.25 | DVI Test -> Staging Lethbridge - 4310 | $(env DIR=/tmp/qa94 RAF=1500 CWAIT=200 SELECT='Staging Lethbridge - 4310' timeout 170 node loc.mjs 1.25 m3-switch 'DVI Test' 2>&1 | grep -E '^(MENUS|AFTER|CHIP NOW)' | summ)"
