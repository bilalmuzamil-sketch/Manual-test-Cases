#!/bin/bash
# Area 1 re-run driver (16 Nov 2026, staging). Five lanes, each on its own quick-login session, resumable
# (a step with a done-marker is skipped). Logs: /tmp/cln/rg16/logs/<lane>.log. SECRET-FREE.
A=/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/report-gaps-2026-11-16/area1
L=/tmp/cln/rg16/logs; D=/tmp/cln/rg16/done; mkdir -p $L $D
export TZ=Asia/Karachi PYTHONUNBUFFERED=1
ver(){ curl -s https://app.staging.shopview.com/ | grep -o 'app-version" content="[^"]*' | cut -d'"' -f3; }
step(){ lane=$1; name=$2; shift 2; [ -f $D/$lane.$name ] && return 0
  echo "== $(date -u +%FT%TZ) START $name build=$(ver)" >> $L/$lane.log
  "$@" >> $L/$lane.log 2>&1; rc=$?
  echo "== $(date -u +%FT%TZ) END $name rc=$rc" >> $L/$lane.log; [ $rc = 0 ] && touch $D/$lane.$name; return 0; }
waitS(){ while [ ! -f $D/S.ALL ]; do sleep 60; done; }
T=$A/tools; W1=$A/W1-labor-wip/tools; W2=$A/W2-sales-advisor-tax/tools; W3=$A/W3-parts/tools; W4=$A/W4-finance-accounting-comms/tools
laneS(){ export SV_SESS=/tmp/cln/rg16/sess-admin.txt
  step S collect_reports python3 $T/collect_reports.py
  step S oracle_invoices python3 $T/oracle_invoices.py
  step S fetch_wo_lines python3 $T/fetch_wo_lines.py
  step S make_wolist python3 $T/make_wolist.py
  touch $D/S.ALL; }
laneW1(){ export SV_SESS=/tmp/cln/rg16/w1/sess-w1.txt; cd $W1
  for s in collect_clocks collect_labor collect_wip fetch_wip_raw check_tu check_tu2 check_ta check_se check_wip_internal check_wip_filters oracle_wip; do step W1 $s python3 $W1/$s.py; done; }
laneW3(){ export SV_SESS=/tmp/cln/rg16/w3/sess-admin.txt; cd $W3
  step W3 parts_collect python3 $W3/parts_collect.py; step W3 pv_collect python3 $W3/pv_collect.py
  step W3 iv_collect python3 $W3/iv_collect.py; step W3 iv_collect_all python3 $W3/iv_collect.py ALL
  for s in filter_collect pv_internal iv_check filter_check sort_check; do step W3 $s python3 $W3/$s.py; done
  waitS; step W3 pv_recompute python3 $W3/pv_recompute.py; }
laneW2(){ export SV_SESS=/tmp/cln/rg16/w2/sess-w2.txt; cd $W2
  for s in collect_w2 collect_multi collect_presets fetch_tax_oracle; do step W2 $s python3 $W2/$s.py; done
  waitS
  for s in collect_filters fetch_stats check_sales check_saa check_sbc check_sbr check_te check_tax check_tax2 check_multi check_sales_customer check_sales_vs_invoice compact; do step W2 $s python3 $W2/$s.py; done; }
laneW4(){ export SV_SESS=/tmp/cln/rg16/w4/sess-w4.txt; cd $W4
  step W4 collect_ar python3 $W4/collect_ar.py; step W4 collect_ap python3 $W4/collect_ap.py
  step W4 collect_ap_ledgers_by_location python3 $W4/collect_ap_ledgers_by_location.py
  HD=$(TZ=Asia/Karachi date +%F)
  for snap in $(ls /tmp/cln/rg16/w4/ar | grep -v ledgers); do step W4 check_ar_$snap python3 $W4/check_ar.py $snap $( [ $snap = hd_$HD ] && echo --ledgers ); done
  for snap in $(ls /tmp/cln/rg16/w4/ap | grep -v ledgers); do step W4 check_ap_$snap python3 $W4/check_ap.py $snap $( [ $snap = hd_$HD ] && echo --ledgers ); done
  for s in check_ap_ledger_loc check_ibs check_notes check_qb_unexported; do step W4 $s python3 $W4/$s.py; done
  step W4 check_ar_pdf python3 $W4/check_ar_pdf.py hd_2026-09-30
  step W4 fetch_exports_sep python3 $W4/fetch_exports.py hd_sep b3c8c820-f815-4cf1-8938-10956c5ee71a Asia/Karachi 2026-09-01 2026-09-30
  step W4 fetch_exports_oct python3 $W4/fetch_exports.py hd_oct b3c8c820-f815-4cf1-8938-10956c5ee71a Asia/Karachi 2026-10-01 2026-10-31
  waitS
  step W4 fetch_payments python3 $W4/fetch_payments.py
  step W4 check_ar_history python3 $W4/check_ar_history.py
  step W4 check_exports_sep python3 $W4/check_exports.py hd_sep 2026-09-01 2026-09-30 Asia/Karachi
  step W4 check_exports_oct python3 $W4/check_exports.py hd_oct 2026-10-01 2026-10-31 Asia/Karachi; }
laneS & laneW1 & laneW3 & laneW2 & laneW4 & wait
echo "ALL LANES DONE $(date -u +%FT%TZ) build=$(ver)" >> $L/driver.log
