#!/bin/bash
cd /tmp/qa10841
run(){ tag=$1; qty=$2; core=$3; plan=$4
  echo "=== $tag qty=$qty core=$core plan=$plan"
  timeout 250 node S1a.mjs $tag $qty $core 2>&1 | grep -E "^(make|order|saved)" | cut -c1-200
  if [ "$plan" != "none" ]; then timeout 300 node S1b.mjs $tag "$plan" 2>&1 | grep -E "^(order|requests|recv)" | cut -c1-400; fi; }
run S2 3 25 '[[1,"ZZ10841-B1"],[2,"ZZ10841-B2"]]'
run S3 3 25 '[[1,"ZZ10841-C1"],[2,"ZZ10841-C2"]]'
run S4 5 10 '[[1,"ZZ10841-D1"],[1,"ZZ10841-D2"],[3,"ZZ10841-D3"]]'
run S5 3 25 '[[1,"ZZ10841-E1"],[2,"ZZ10841-E2"]]'
run S6 1 25 '[[1,"ZZ10841-F1"]]'
run S7 3 25 '[[3,"ZZ10841-G1"]]'
run S8 5 3 '[[1,"ZZ10841-H1"],[2,"ZZ10841-H2"]]'
echo DONE
