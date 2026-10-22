#!/bin/bash
# 22 Oct 2026: for every finished entry of the production re-run queue (/tmp/queue-prod-redo3.log) not yet handled, keep a copy of the
# script's readings as evidence/prod-2026-10-22/<script>.redo3-<n>.json and write the judging packs for the tests that entry re-ran.
# Handled entries are listed in evidence/prod-2026-10-22/redo3-packed.txt. Prints "<n> <script> <C-ids>" per entry packed.
cd "$(dirname "$0")"; L=/tmp/queue-prod-redo3.log; EV=evidence/prod-2026-10-22; DONE=$EV/redo3-packed.txt; touch $DONE
grep '^EXIT' $L | while read -r _ n rest; do
  grep -qx "$n" $DONE && continue
  cmd=$(grep "^START $n " $L | sed 's/^START [0-9]* [0-9:]* :: //')
  echo "$cmd" | grep -o 'redo-one-1022.sh [^ ;&]* [^ ;&]*' | while read -r _ s ids; do
    [ "$ids" = "-" ] && continue; [ -f "$EV/$s.json" ] || { echo "$n $s no readings"; continue; }
    cp "$EV/$s.json" "$EV/$s.redo3-$n.json"; python3 judge_pack.py "$s.redo3-$n.json" ${ids//,/ } >/dev/null 2>&1; echo "$n $s $ids"; done
  echo "$n" >> $DONE
done
