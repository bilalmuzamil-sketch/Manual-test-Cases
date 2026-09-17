#!/usr/bin/env bash
# ONE COMMAND REBUILDS THE GLOBAL SEARCH V2 "FIBRIDGE" UNIVERSE AFTER A BRANCH REDEPLOY.
#
#   ./reseed_gsv2.sh qa       # the sv9160 QA branch      (keyword: RESEED GSV2 QA)
#   ./reseed_gsv2.sh live     # the production account    (keyword: RESEED GSV2 LIVE)
#
# WHY A SCRIPT AND NOT A LIST OF STEPS IN A DOCUMENT: the four steps depend on each other and the
# VERIFICATION STEP IS A DIFFERENT PROGRAM ON EACH ENVIRONMENT. Getting that wrong does not fail
# loudly - running the V2 verifier against production reports a dead environment that is perfectly
# healthy, and a tester then reseeds something that was never broken. Encoding it removes the choice.
#
# ORDER MATTERS AND IS NOT ARBITRARY:
#   2 must precede 3  - you cannot set a status on a work order that does not exist
#   3 must precede 4  - the purchase-order chain consumes work orders and needs them out of estimate
#   4 must precede 5  - 5 takes the LEFTOVER estimate work orders, so 4 claims its own first
#   5 must precede 7  - the verifier asserts all seven status badge colours
#   6 is independent  - roles touch no records, but run before the verifier so one run proves all
#
# SAFE TO RUN ANY NUMBER OF TIMES. Every step measures first and creates only the difference, and
# the seeder drops recorded ids that no longer resolve rather than appending new ones to dead ones.
set -uo pipefail
cd "$(dirname "$0")"
ENV="${1:-}"
export SEED_MANIFEST=seed-manifest-gs-v2.json

case "$ENV" in
  qa)
    unset SEED_PROFILE SEED_WORKPLACE
    HOST=https://sv9160.qa.shopview.com; VERIFIER=verify_gsv2.py; SUFFIX=qa
    COOKIE_HINT="the three browser cookies for sv9160 — sv_sso_session, PHPSESSID, cf_clearance — in /tmp/qa/cookies.json"
    ;;
  live)
    export SEED_PROFILE=/tmp/prod/cookies.json SEED_WORKPLACE="Trucks Hill 2"
    HOST=https://app.shopview.com; VERIFIER=verify_gsv2_v1.py; SUFFIX=prod
    COOKIE_HINT="a fresh production login — POST /api/login {username,password}, capture the rotated PHPSESSID into /tmp/prod/cookies.json"
    ;;
  *) echo "usage: $0 qa|live"; exit 2 ;;
esac

echo "=============================================================="
echo " RESEED GSV2 ${ENV^^}"
echo " build marker before: $(curl -s --max-time 20 "$HOST/" | grep -o 'content="v[^"]*"' | head -1)"
echo "=============================================================="

step () {                       # step <label> <command...>
  local label="$1"              # keep it: $1 is gone after the shift, and the failure message
  echo; echo "---- $label"      # printing "STOPPED at: python3" tells nobody anything
  shift
  if ! "$@"; then
    echo; echo "🔴 STOPPED at: $label"
    echo "   If this is an auth failure (401/409/503-after-login), the session expired."
    echo "   Supply: $COOKIE_HINT"
    exit 1
  fi
}

step "1/7  measure — writes nothing"              python3 seed.py --check
step "2/7  create the 33 records, verify fields"  python3 seed.py --confirm
step "3/7  spread the work-order statuses"        python3 set_wo_statuses.py --confirm
step "4/7  purchase orders, invoices, payments"   python3 seed_po_and_invoices.py --confirm
step "5/7  drive two WOs to Complete + Invoiced"  python3 complete_and_invoice.py --confirm
step "6/7  role fixtures for section 6734"        python3 seed_roles.py --confirm
step "7/7  PROVE IT — $VERIFIER"                  python3 "$VERIFIER"

echo; echo "---- writing the record inventory"
python3 dump_seed_manifest.py > "SEED-MANIFEST-GS-V2-${SUFFIX}.md" \
  && echo "     SEED-MANIFEST-GS-V2-${SUFFIX}.md"

echo
echo "=============================================================="
echo " ✅ RESEED GSV2 ${ENV^^} COMPLETE — and PROVEN, not just created."
echo " build marker after: $(curl -s --max-time 20 "$HOST/" | grep -o 'content="v[^"]*"' | head -1)"
echo
echo " 🔴 COMMIT THE INVENTORY. The ids changed if the branch was wiped, and git is the only"
echo "    durable store — the container and /tmp are not:"
echo "      git add -- build/global-search/seeding/"
echo "      python3 build/testing-tools/scan_secrets.py --staged"
echo "      git commit && git push"
echo "=============================================================="
