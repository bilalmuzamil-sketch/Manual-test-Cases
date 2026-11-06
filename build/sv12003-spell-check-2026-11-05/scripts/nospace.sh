#!/bin/bash
# SV-12003: every box with NO space after the last word, 3 runs on the branch (+1 on production for comparison)
cd "$(dirname "$0")"
for i in 1 2 3; do TEXT='thee spellling are wrong wrng' SUFFIX=-nospace-$i HEADED=1 timeout 600 xvfb-run -a node matrix.mjs 737fce7f-bf9c-4634-960a-b72de9a2e7a7 87e80cf1-d08b-4af6-a3c6-c98eb0df680a > /tmp/sv12003/nospace-$i.log 2>&1; done
