#!/bin/bash
until grep -q CANVAS2-EXIT /home/user/Manual-test-Cases/build/founder-mode/part-lifecycle/design-drive-2026-10-08/canvas.log; do sleep 20; done
