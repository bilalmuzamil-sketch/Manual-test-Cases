#!/bin/bash
# run_full.sh <branch> <script> <ONLY> <tag> — 26 Oct 2026: run one run498 script for one case on a ticket's own QA branch; log + pictures under <branch>/full
B=/home/user/Manual-test-Cases/build/wo-board-tech-view/fix-verify-2026-10-26; mkdir -p $B/$1/full
cd /home/user/Manual-test-Cases/build/wo-board-tech-view/run498-2026-10-08
WOB_ORG=d55bc308-e61a-438d-b5f1-c7a73c89d49f WOB_LOC1=b3c8c820-f815-4cf1-8938-10956c5ee71a WOB_LOC2=f8a8b802-7780-4b16-bf10-343caeb616b2 QA_DPR=1 WOB_TZ=Asia/Karachi WOB_LOC_TZ=Asia/Karachi \
 ONLY=$3 GS_APP=https://$1.qa.shopview.com WOB_EV=$B/$1/full timeout 1500 ./wob-run.sh $2 > $B/$1/full-$4.log 2>&1; echo "EXIT $?" >> $B/$1/full-$4.log
