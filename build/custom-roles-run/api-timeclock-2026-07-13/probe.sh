#!/bin/bash
CA=/root/.ccr/ca-bundle.crt
set -a; source /tmp/custom-roles/cookies-viu-0713.env; set +a
API=https://api.staging.shopview.com
ORG=d55bc308-e61a-438d-b5f1-c7a73c89d49f
WO=bfc5fd96-c70f-4ff2-a763-01bb1d30faca
TSID=$(cat /tmp/custom-roles/tsid.txt)
OUT=/home/user/Manual-test-Cases/build/custom-roles-run/api-timeclock-2026-07-13
LOG=$OUT/probe-results.tsv
: > $LOG
echo -e "area\tmethod\tpath\texpect\ttech_status\tsnippet" >> $LOG

probe() {
  local area="$1" method="$2" path="$3" expect="$4" data="$5"
  local resp code body
  if [ "$method" = "GET" ]; then
    resp=$(curl -sS --cacert $CA -x "$HTTPS_PROXY" \
      -b "sv_sso_session=$sv_sso_session; PHPSESSID=$TSID; cf_clearance=$cf_clearance" \
      "$API$path" -w "\n__HTTP:%{http_code}" 2>&1)
  else
    resp=$(curl -sS --cacert $CA -x "$HTTPS_PROXY" -H "Content-Type: application/json" \
      -b "sv_sso_session=$sv_sso_session; PHPSESSID=$TSID; cf_clearance=$cf_clearance" \
      -X "$method" "$API$path" -d "$data" -w "\n__HTTP:%{http_code}" 2>&1)
  fi
  code=$(echo "$resp" | grep -o '__HTTP:[0-9]*' | tail -1 | cut -d: -f2)
  body=$(echo "$resp" | sed 's/__HTTP:[0-9]*//' | tr '\n' ' ' | cut -c1-90)
  echo -e "${area}\t${method}\t${path}\t${expect}\t${code}\t${body}" >> $LOG
  echo "[$code] $method $path (expect $expect)"
}

echo "===== ALLOWED (expect 200) ====="
probe "Work Orders" GET "/api/work-orders?page=1" 200
probe "Work Orders" GET "/api/work-orders/view/$WO" 200
probe "Schedule" GET "/api/calendar?date=2026-07-01&end_date=2026-07-31" 200
probe "Timesheets" GET "/api/staff/clocked" 200

echo "===== RESTRICTED READ (expect 403) ====="
probe "Inventory/Parts" GET "/api/inventory/parts?page=1" 403
probe "POs/Orders" GET "/api/inventory/orders?page=1" 403
probe "Customers" GET "/api/customers?page=1" 403
probe "Vendors" GET "/api/vendors?page=1" 403
probe "Contacts" GET "/api/contacts?page=1" 403
probe "Reports (AP Aging)" GET "/api/reporting/account-payable/unpaid-invoices-report" 403
probe "Settings" GET "/api/organizations/settings" 403
probe "Staff/Roles" GET "/api/organizations/$ORG/roles" 403
probe "Staff" GET "/api/staff?page=1" 403
probe "Taxes (Finance)" GET "/api/taxes" 403
probe "Integrations (IBS)" GET "/api/ibs/settings" 403
probe "QuickBooks (Bookkeeping)" GET "/api/bookkeeping/settings" 403
probe "Departments" GET "/api/departments" 403

echo "===== WRITE ENFORCEMENT (expect 403) ====="
probe "Create Work Order" POST "/api/work-orders/create" 403 '{"description":"ZZAUTOTEST"}'
probe "Create Customer" POST "/api/customers/create" 403 '{"name":"ZZAUTOTEST"}'
