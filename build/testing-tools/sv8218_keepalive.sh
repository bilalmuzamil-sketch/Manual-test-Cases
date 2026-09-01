#!/bin/bash
# sv8218 auto-sleeps within minutes of idleness, which kills long browser runs mid-way.
while true; do
  curl -s -o /dev/null --max-time 10 https://sv8218.qa.shopview.com/ 2>/dev/null
  curl -s -o /dev/null --max-time 10 https://sv8218api.qa.shopview.com/ 2>/dev/null
  sleep 25
done
