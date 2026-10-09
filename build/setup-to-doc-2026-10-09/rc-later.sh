#!/bin/bash
cd /home/user/Manual-test-Cases
D=build/setup-to-doc-2026-10-09
while ps -eo args | grep -q "[r]elink.py"; do sleep 20; done
nohup bash $D/render_check.sh $D/rc-b.txt $D/render-b.log >/dev/null 2>&1 &
nohup bash $D/render_check.sh $D/rc-c.txt $D/render-c.log >/dev/null 2>&1 &
