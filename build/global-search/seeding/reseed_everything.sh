#!/usr/bin/env bash
# REBUILD EVERY UNIVERSE THIS BRANCH HAS EVER BEEN SEEDED WITH — one command, after a redeploy.
#
#   ./reseed_everything.sh qa     (keyword: RESEED EVERYTHING QA)
#   ./reseed_everything.sh live   (keyword: RESEED EVERYTHING LIVE - V1-regression universe only;
#                                  the V2 and ranking universes are QA-branch features)
#
# WHY THIS EXISTS: a redeploy of sv9160 wipes seeded records. It has happened twice, once mid-
# handoff, taking 32 of 33 records with it. Three universes now live side by side and each has its
# OWN manifest, its OWN state file and its OWN verifier. Remembering to run three scripts in the
# right order, with the right verifier per environment, is exactly the kind of thing that gets done
# wrong at speed - so it is encoded here instead.
#
# 🔴 THE UNIVERSES MUST NEVER BE MIXED. Ids and state are keyed by manifest AND environment. The
# engine derives that key from the manifest FILENAME, so a new universe is isolated by construction.
#
# SAFE TO RUN ANY NUMBER OF TIMES. Every step measures first and creates only the difference.
set -uo pipefail
cd "$(dirname "$0")"

case "${1:-}" in
  qa)   HOST="https://sv9160.qa.shopview.com"; export SEED_PROFILE=/tmp/qa/cookies.json ;;
  live) HOST="https://app.shopview.com";       export SEED_PROFILE=/tmp/prod/creds.json
        export SEED_WORKPLACE="Trucks Hill 2" ;;
  *) echo "usage: $0 qa|live"; exit 2 ;;
esac

echo "=============================================================="
echo " RESEED EVERYTHING — ${1}"
echo " build marker before: $(curl -s --max-time 20 "$HOST/" | grep -o 'content="v[^"]*"' | head -1)"
echo "=============================================================="

FAILED=0
step() { local label="$1"; shift; echo; echo "---- $label"
         if ! "$@"; then echo; echo "🔴 STOPPED at: $label"; FAILED=1; return 1; fi; }

# ── universe 1 · V1-REGRESSION (11 records, sections 6769 / 8056) ──────────────────────────────
export SEED_MANIFEST=seed-manifest.json
step "1  V1-regression records"            python3 seed.py --confirm || exit 1
if [ "$1" = "qa" ]; then
  step "1b V1-regression PROOF (V2 search)"  python3 verify_gsv2_v1.py || true
else
  step "1b V1-regression PROOF (V1 search)"  python3 verify_gsv2_v1.py || exit 1
fi

# ── universe 2 · GLOBAL SEARCH V2 "Fibridge" (39 records, sections 6721-6740) ──────────────────
# QA only: production runs V1, whose search endpoint is a different program entirely.
if [ "$1" = "qa" ]; then
  export SEED_MANIFEST=seed-manifest-gs-v2.json
  step "2  Fibridge records"                python3 seed.py --confirm            || exit 1
  step "3  work-order status spread"        python3 set_wo_statuses.py --confirm || exit 1
  step "4  purchase orders + invoices"      python3 seed_po_and_invoices.py --confirm || exit 1
  step "5  two WOs to Complete + Invoiced"  python3 complete_and_invoice.py --confirm || exit 1
  step "6  role fixtures (section 6734)"    python3 seed_roles.py --confirm      || exit 1
  step "7  recent-activity list"            python3 touch_recent_entities.py --confirm || exit 1
  step "8  Fibridge PROOF — 39 checks"      python3 verify_gsv2.py               || exit 1

  # ── universe 3 · RANKING + fuzzy remainder (25 records, sections 6726 / 6725) ────────────────
  export SEED_MANIFEST=seed-manifest-ranking.json
  step "9  ranking + fuzzy records"         python3 seed.py --confirm            || exit 1
  # The records alone do not make a ranking case runnable - two rows that match identically cannot
  # pass or fail. This applies the one thing that must DIFFER between each pair.
  step "10 ranking signals (PO, activity, tie-break)" python3 apply_ranking_signals.py --confirm || exit 1
  step "11 ranking PROOF — 10 checks"       python3 verify_ranking.py            || exit 1
fi

echo
echo "---- writing the record inventories"
SEED_MANIFEST=seed-manifest-gs-v2.json python3 dump_seed_manifest.py \
  > "SEED-MANIFEST-GS-V2-$([ "$1" = qa ] && echo qa || echo prod).md" 2>/dev/null \
  && echo "     SEED-MANIFEST-GS-V2-*.md"

echo
echo "=============================================================="
if [ "$FAILED" = "0" ]; then
  echo " ✅ RESEED EVERYTHING COMPLETE — and PROVEN, not just created."
else
  echo " 🔴 FINISHED WITH FAILURES — read the log above. The data is NOT proven."
fi
echo " build marker after:  $(curl -s --max-time 20 "$HOST/" | grep -o 'content="v[^"]*"' | head -1)"
echo
echo " 🔴 IF THE MARKER CHANGED DURING THIS RUN the branch redeployed mid-reseed and records"
echo "    created before it are gone. Run this script again before believing anything."
echo
echo " 🔴 COMMIT THE STATE FILES — git is the only durable store, the container is not:"
echo "      git add -- build/global-search/seeding/"
echo "      python3 build/testing-tools/scan_secrets.py --staged"
echo "      git commit && git push"
echo "=============================================================="
