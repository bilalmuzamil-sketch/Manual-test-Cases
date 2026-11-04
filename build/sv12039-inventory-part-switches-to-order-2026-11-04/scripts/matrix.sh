#!/bin/bash
# usage: matrix.sh <env>   runs every dialog cell for that environment, one after another
cd /home/user/Manual-test-Cases/build/sv12039-inventory-part-switches-to-order-2026-11-04
E=$1; if [ $E = prod ]; then export ENV=prod WOJ=/tmp/sv12039/wo-prod-p1.json; P=p; NLEND=d3074237-1aab-42da-8a53-c0ebfad82605; NLMID=3c339691-0b33-422f-87bb-003c8dc24b60; LONG=5437ebf7-1ad8-4ed3-9973-3b3d1c424741; SHORT=ca02b406-9d34-475e-a911-cb1bb5f86a17;
else export WOJ=/tmp/sv12039/wo-explore.json; P=b; NLEND=38b4f487-f13d-46c7-8b2d-59f870c59d6e; NLMID=c1934d46-9993-4f28-8e22-40536f40c575; LONG=6074cef0-c9d3-46e9-984e-b53a45f939ba; SHORT=2d988fc4-3245-4330-8f0a-a4e4ea7dd963; fi
run(){ local TAG=$1; shift; env "$@" TAG=$P-$TAG SAVE=1 timeout 280 node scripts/dlg.mjs > /tmp/sv12039/log-$P-$TAG.txt 2>&1; echo "$P-$TAG exit $?"; }
run nl-end INV=$NLEND SEARCH="ZZ12039-NL-END" QTY=1
run normal-long INV=$LONG SEARCH="ZZ12039 LAMP - HEADLIGHT, HALOGEN, FOAM GROMMET, RIGHT HAND" QTY=1
run normal-short INV=$SHORT SEARCH="ZZ12039-RH" QTY=1
run nl-mid-catalog INV=$NLMID SEARCH="ZZ12039 LAMP - HEADLIGHT" KIND=catalogue_part QTY=1
run new-pn INV=x NEWPN=1 SEARCH="ZZ12039-BRAND-NEW-$(date +%H%M%S)" QTY=1
run nl-mid-edited INV=$NLMID SEARCH="ZZ12039 LAMP - HEADLIGHT" EDIT="X" QTY=1
run nl-mid-over-stock INV=$NLMID SEARCH="ZZ12039 LAMP - HEADLIGHT" QTY=2
echo done-$E > /tmp/sv12039/matrix-$E.done
