#!/bin/bash
cd /home/user/Manual-test-Cases/build/sv12039-inventory-part-switches-to-order-2026-11-04
E=$1; if [ $E = prod ]; then export ENV=prod; P=p; WOJ=/tmp/sv12039/wo-prod-p1.json; NLMID=3c339691-0b33-422f-87bb-003c8dc24b60; SHORT=ca02b406-9d34-475e-a911-cb1bb5f86a17; OOS=00dd415d-1332-4b08-8332-036f92cf5d80; OOSPN=1238116; CO=bd77eaa6-963f-43fc-9a91-b950810ebf67;
else P=b; WOJ=/tmp/sv12039/wo-explore.json; NLMID=c1934d46-9993-4f28-8e22-40536f40c575; SHORT=2d988fc4-3245-4330-8f0a-a4e4ea7dd963; OOS=4f797f1e-3128-4280-8c47-083ebc9ae81f; OOSPN=19002; CO=6a7b6afc-084d-4584-aacb-773bcd71cbcd; fi
export WOJ
r(){ local T=$1; shift; env "$@" TAG=$P-$T timeout 300 node scripts/${SCRIPT:-dlg.mjs} > /tmp/sv12039/log-$P-$T.txt 2>&1; echo "$P-$T exit $?"; }
SCRIPT=dlg.mjs r out-of-stock INV=$OOS SEARCH=$OOSPN QTY=1 SAVE=1
SCRIPT=dlg.mjs r normal-over-stock INV=$SHORT SEARCH=ZZ12039-RH QTY=2 SAVE=1
SCRIPT=save.mjs r inline-nl-mid PN="ZZ12039 LAMP - HEADLIGHT" PID=$NLMID QTY=1
SCRIPT=ps.mjs r partsale-nl-mid COMPANY=$CO INV=$NLMID SEARCH="ZZ12039 LAMP - HEADLIGHT" QTY=1
echo done > /tmp/sv12039/matrix2-$E.done
