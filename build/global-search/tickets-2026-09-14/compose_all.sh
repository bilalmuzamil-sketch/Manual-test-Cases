#!/bin/bash
# One comparison picture per report: the live product above, the new version below, each cropped to
# the search panel so the words arrive at their own size. 560 inner = 588 wide, the width approved.
set -u
cd /home/user/Manual-test-Cases
C="python3 build/testing-tools/compose_compare.py"
D=build/global-search/tickets-2026-09-14
go(){ key=$1; src=$2; typed=$3; v1=$4; v2=$5; cap=$6
  MAXW=560 $C --v1 "$D/prod-evidence/V1-$src.png" --v2 "$D/qa-evidence/V2-$src.png" \
      --out "$D/ticket-images/$key.png" --typed "$typed" --v1-says "$v1" --v2-says "$v2" --caption "$cap"; }

go SV-10001 SV-10001 'ZZT-77-3300' \
  'the part comes back, under Parts' \
  'nothing comes back at all' \
  'A part number typed into both versions'
go SV-10003 SV-10003 'bridgeporthauling-zzt.com' \
  'the customer comes back, under Customers' \
  'nothing comes back at all' \
  "A customer's website address typed into both versions"
go SV-10004 SV-10004 'Dispatch Supervisor' \
  'the company that person works for comes back' \
  'nothing comes back at all' \
  "A contact's job title typed into both versions"
go SV-10005 SV-10005 '43055-2210' \
  'the supplier comes back, under Vendors' \
  'nothing comes back at all' \
  "A supplier's postcode typed into both versions"
go SV-10006 SV-10006 'Ohio' \
  'the suppliers in Ohio come back' \
  'only companies with Ohio in their NAME come back; the supplier in Ohio does not' \
  'The name of a state typed into both versions'
go SV-10007 SV-10007 'OHZZT471' \
  'the vehicle comes back, under Assets' \
  'nothing comes back at all' \
  "A vehicle's number plate typed into both versions"
go SV-10008 SV-10008 'Estimate' \
  'the jobs at Estimate stage come back' \
  'no job at Estimate stage comes back; the one job shown is at Paid' \
  'A job stage typed into both versions'
go SV-10025 SV-10025 'Marlene' \
  'three results, all of them the company asked for' \
  'eighteen results, most of them nothing to do with the name typed' \
  'A correctly spelled customer name typed into both versions'
go SV-10055 SV-10055 '2019 Freightliner' \
  'the vehicle comes back, under Assets' \
  'thirty-five results and not one of them a vehicle' \
  "A vehicle's year and make typed into both versions"
go SV-10057 SV-10057 '555-0143' \
  'the customer comes back, under Customers' \
  'nothing comes back at all' \
  'Part of a telephone number typed into both versions'
go SV-10058 SV-10058 'ZZ4471' \
  'the vehicle comes back, under Assets' \
  'nothing comes back at all' \
  'Part of a chassis number typed into both versions'
go SV-10060 SV-10060 'ernva' \
  'the customers in that town come back' \
  'nothing comes back at all' \
  'A fragment from the middle of a town name typed into both versions'
