#!/bin/bash
# Full re-run of SV-11006 checks on the current sv11006 build. Log: /tmp/sv11006/rerun.log
cd "$(dirname "$0")"; L=/tmp/sv11006/rerun.log; echo "START $(date -u +%T) build $(curl -s https://sv11006.qa.shopview.com/ | grep -o 'app-version" content="[^"]*"')" > $L
r(){ echo "### $*" >> $L; timeout 200 "$@" 2>&1 | grep -vE "^\s+at |Node.js|triggerUncaught|^\s*\^" | tail -6 | cut -c1-600 >> $L; }
r node seed.mjs e1; r node findpo.mjs e1; r node t1.mjs e1 80 25
r node fixseed.mjs e2; r node findpo.mjs e2; r node rc.mjs e2 10 1 fixed
r node seed.mjs e5; r node findpo.mjs e5; r node back.mjs e5; r node leave.mjs e5
r node seed.mjs e6; r node findpo.mjs e6; r env QUICK=tech node nosfd.mjs e6; r node partread.mjs e6
r node seed.mjs e7; r node findpo.mjs e7; r node womodal.mjs e7 60
r node seed.mjs e8a; r node findpo.mjs e8a; r node seed.mjs e8b; r node findpo.mjs e8b; r node bulk2.mjs e8a e8b 80
r env CORE=15 node seed.mjs e9; r node findpo.mjs e9; r node rc.mjs e9 70 1 core
r node seed2.mjs e10 none; r node later2.mjs e10; r node invoice.mjs e10; r node findpo.mjs e10; r node rc.mjs e10 ,25 1 inv; r node fin.mjs e10
r node seed2.mjs e11 none; r node later2.mjs e11; r node invoice.mjs e11; r node pay.mjs e11 go; r node findpo.mjs e11; r node rc.mjs e11 - 1 paid; r node fin.mjs e11
echo "END $(date -u +%T) build $(curl -s https://sv11006.qa.shopview.com/ | grep -o 'app-version" content="[^"]*"')" >> $L
