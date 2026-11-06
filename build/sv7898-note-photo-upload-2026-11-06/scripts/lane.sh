#!/bin/bash
# usage: QDIR=/tmp/qaNN lane.sh WO "ENTRY MODE ACTION [BREAK]" ...  -> runs each scenario in turn, one line of output per scenario log
WO=$1; shift
for sc in "$@"; do set -- $sc; T="${PFX}$1-$2-$3${4:+-$4}"; ENTRY=$1 MODE=$2 ACTION=$3 BREAK=$4 TAG=$T timeout 420 node run.mjs $WO > ../ev/$T.out 2>&1; echo "DONE $T exit $?"; done
