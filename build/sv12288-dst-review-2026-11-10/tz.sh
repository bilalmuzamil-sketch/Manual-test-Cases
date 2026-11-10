#!/bin/bash
# Production: log in, read the location time-zone list the settings screen uses. Password from /tmp only.
J=$(mktemp)
curl -s -c $J -b $J -H 'Content-Type: application/json' https://api.shopview.com/api/login \
  -d "{\"username\":\"bilal.muzamil@shopview.com\",\"password\":\"$(cat /tmp/sv-prod-pw.txt)\"}" -o /dev/null -w 'login %{http_code}\n'
curl -s -b $J https://api.shopview.com/api/workplaces/timezones -o ev/prod-timezones.json -w 'timezones %{http_code}\n'
curl -s -b $J https://api.shopview.com/api/staff/my-workplaces -o /tmp/myws.json -w 'workplaces %{http_code}\n'
rm -f $J
