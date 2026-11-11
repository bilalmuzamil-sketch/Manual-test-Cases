#!/bin/bash
cd "$(dirname "$0")"
export NODE_PATH=$(npm root -g)
for env in qa prod; do timeout 3000 node inventory.js $env >> inventory.log 2>&1; done
echo DONE >> inventory.log
