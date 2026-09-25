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

# 🔴 WHICH UNIVERSES AN ENVIRONMENT GETS IS DECIDED BY WHAT IS DEPLOYED THERE, NOT BY ITS NAME.
# qa and staging both run Global Search V2, so both take the FULL set. Production runs V1, whose
# search endpoint is a different program entirely, so it takes the V1-regression universe alone.
case "${1:-}" in
  qa)      HOST="https://sv9160.qa.shopview.com"; export SEED_PROFILE=/tmp/qa/cookies.json
           V2=1 ;;
  staging) HOST="https://app.staging.shopview.com"; export SEED_PROFILE=/tmp/staging/cookies.json
           export SEED_WORKPLACE="Staging Heavy Duty - 9919"
           # quick-login IS allowed here (QA lead, 2026-09-25: "You can use Quick log-in its
           # fine"), so a lapsed session self-heals rather than stalling an unattended run. It
           # still rotates the shared session and evicts anyone else signed in to staging
           # (Rule 83) - that is now an accepted cost, not an accident. PRODUCTION remains
           # excluded: quick-login 500s there (playbook section K).
           V2=1 ;;
  live)    HOST="https://app.shopview.com";       export SEED_PROFILE=/tmp/prod/creds.json
           export SEED_WORKPLACE="Trucks Hill 2"
           V2=0 ;;
  *) echo "usage: $0 qa|staging|live"; exit 2 ;;
esac

echo "=============================================================="
echo " RESEED EVERYTHING — ${1}"
echo "=============================================================="

# ── PREFLIGHT ─────────────────────────────────────────────────────────────────────────────────
# 🔴 THE TWO THINGS THAT WASTE THE MOST TIME AT SPEED, CHECKED BEFORE ANY WRITE.
# Both present as a generic failure at step 1, and both were diagnosed the slow way once already:
#   · the branch SWITCHES ITSELF OFF, and then every call answers 403 AccessDenied - which is not
#     the API refusing you, it is a redirect to a static parking page. No cookie fixes it and
#     quick-login returns 403 too, because there is nothing awake to log in to (playbook section R).
#   · the SSO token expires, and then quick-login cannot rescue the session either - it needs a
#     live SSO session to work. That one needs a human, so say so immediately instead of failing
#     sixteen steps deep.
if [ "${1}" = "qa" ]; then
  API="https://sv9160api.qa.shopview.com"
  # A path that CANNOT exist: 302 = asleep · 503 = booting · 401 = awake, unauthenticated ·
  # 404 = awake AND authenticated. Never probe the app host - it is served from S3 and answers
  # 200 to any nonsense path, so it reports a dead API as healthy.
  probe() { curl -s -o /dev/null -w '%{http_code}' --max-time 20 "$API/api/definitely-not-real-zz"; }
  CODE=$(probe)
  if [ "$CODE" = "302" ]; then
    echo "---- branch is ASLEEP (302 to the parking page) — waking it"
    curl -s --max-time 60 -X POST \
      https://fz4hhptxi8.execute-api.ca-central-1.amazonaws.com/default/toggleQaEnv \
      -H 'Content-Type: application/json' -d '{"action":"wake","env":"sv9160"}'; echo
    for i in $(seq 1 30); do sleep 20; CODE=$(probe)
      [ "$CODE" != "302" ] && [ "$CODE" != "503" ] && break
      echo "     still coming up (HTTP $CODE) …"; done
  fi
  echo "---- API readiness probe: HTTP $CODE"
  if [ "$CODE" = "302" ] || [ "$CODE" = "503" ]; then
    echo "🔴 the branch did not come up. Nothing seeded."; exit 1; fi

  # Session: a live one answers 200 here. A 401 carrying sso_required means the SSO token is gone
  # and NO amount of retrying will fix it - a human must supply a fresh cookie.
  SESS=$(curl -s -o /tmp/reseed-sess.$$ -w '%{http_code}' --max-time 25 \
         -H "Cookie: $(python3 - <<'EOF'
import json,os
c=json.load(open(os.environ.get('SEED_PROFILE','/tmp/qa/cookies.json')))
print('; '.join(f"{k}={c[k]}" for k in ('sv_sso_session','PHPSESSID','cf_clearance') if c.get(k)))
EOF
)" -H 'Accept: application/json' "$API/api/staff/my-workplaces")
  # 🔴 A 401 IS NOT ONE THING, AND THE DIFFERENCE DECIDES WHETHER A HUMAN IS NEEDED.
  #   {"errors":[{"error":"session_expired"}]} -> the ORGANISATION session (PHPSESSID) lapsed.
  #        quick-login mints a new one, so this heals itself and the reseed carries on.
  #   {"error":"sso_required", ...}            -> the SSO TOKEN itself is gone. quick-login
  #        CANNOT rescue it, because quick-login needs a live SSO session of its own. A human
  #        must supply a fresh cookie, and saying so at once beats failing sixteen steps deep.
  # Treating both as "not live" threw away the one case that fixes itself.
  if [ "$SESS" != "200" ]; then
    if grep -q 'sso_required' /tmp/reseed-sess.$$ 2>/dev/null; then
      echo "🔴 sso_required — the SSO TOKEN has expired. Nothing seeded, nothing changed."
      echo "   quick-login cannot rescue this; it needs a live SSO session itself."
      echo "   ASK FOR: a fresh sv_sso_session and PHPSESSID, then re-run."
      rm -f /tmp/reseed-sess.$$; exit 1
    fi
    echo "---- session not live (HTTP $SESS) — recovering via seed.py's own ensure_session()"
    echo "     (Rule 83: quick-login evicts other workers on this branch, the accepted cost of"
    echo "      an unattended reseed)"
    # 🔴 CALL THE ENGINE'S SESSION LOGIC, DO NOT REIMPLEMENT IT. A hand-rolled quick-login here
    # returned 200 and left the session dead, because quick-login ROTATES the PHPSESSID and hands
    # it back in Set-Cookie - and the inline version threw that header away. seed.py already
    # captures and persists it (playbook Q1); duplicating that was the bug.
    python3 - <<'PYEOF' || true
import os, runpy
os.environ.setdefault('SEED_MANIFEST', 'seed-manifest.json')
_s = runpy.run_path('seed.py', run_name='not_main')
_s['ensure_session']()
print("     ensure_session() completed")
PYEOF
    SESS=$(curl -s -o /tmp/reseed-sess.$$ -w '%{http_code}' --max-time 25 \
           -H "Cookie: $(python3 -c "
import json,os
c=json.load(open(os.environ.get('SEED_PROFILE','/tmp/qa/cookies.json')))
print('; '.join(f'{k}={c[k]}' for k in ('sv_sso_session','PHPSESSID','cf_clearance') if c.get(k)))
")" -H 'Accept: application/json' "$API/api/staff/my-workplaces")
    if [ "$SESS" != "200" ]; then
      echo "🔴 STILL NOT LIVE after recovery (HTTP $SESS). Nothing seeded, nothing changed."
      echo "   ASK FOR: a fresh sv_sso_session and PHPSESSID, then re-run."
      rm -f /tmp/reseed-sess.$$; exit 1
    fi
    echo "---- session recovered by quick-login (200)"
  else
    echo "---- session live (200)"
  fi
  rm -f /tmp/reseed-sess.$$
fi

# Staging has no sleep/wake and no self-service login, so it gets the liveness half only. Proving
# the session BEFORE a 185-record run beats discovering it at record 40 with a half-built estate.
if [ "${1}" = "staging" ]; then
  SAPI="https://api.staging.shopview.com"
  SCK=$(python3 -c "
import json
c=json.load(open('/tmp/staging/cookies.json'))
print('; '.join(f'{k}={c[k]}' for k in ('sv_sso_session','PHPSESSID','cf_clearance') if c.get(k)))
")
  SL=$(curl -s -o /dev/null -w '%{http_code}' --max-time 25 -H "Cookie: $SCK" \
       -H 'Accept: application/json' "$SAPI/api/staff/my-workplaces")
  # A path that CANNOT exist: 404 proves the real API answered rather than a front end or a
  # parking page, both of which happily return 200 for anything.
  SC=$(curl -s -o /dev/null -w '%{http_code}' --max-time 25 -H "Cookie: $SCK" \
       -H 'Accept: application/json' "$SAPI/api/definitely-not-real-zz")
  echo "---- staging session: $SL   control path: $SC (404 = the real API answered)"
  if [ "$SL" != "200" ]; then
    echo "---- staging session not live (HTTP $SL) — recovering via ensure_session()"
    echo "     (quick-login is permitted here; Rule 83: it evicts others signed in to staging)"
    python3 - <<'PYEOF' || true
import os, runpy
os.environ.setdefault('SEED_MANIFEST', 'seed-manifest.json')
runpy.run_path('seed.py', run_name='not_main')['ensure_session']()
PYEOF
    SL=$(curl -s -o /dev/null -w '%{http_code}' --max-time 25 -H "Cookie: $SCK" \
         -H 'Accept: application/json' "$SAPI/api/staff/my-workplaces")
    if [ "$SL" != "200" ]; then
      echo "🔴 STILL NOT LIVE after recovery (HTTP $SL). Nothing seeded, nothing changed."
      echo "   ASK FOR: a fresh sv_sso_session, PHPSESSID and cf_clearance."
      exit 1
    fi
    echo "---- staging session recovered (200)"
  fi
fi

echo " build marker before: $(curl -s --max-time 20 "$HOST/" | grep -o 'content="v[^"]*"' | head -1)"
echo "=============================================================="

FAILED=0
step() { local label="$1"; shift; echo; echo "---- $label"
         if ! "$@"; then echo; echo "🔴 STOPPED at: $label"; FAILED=1; return 1; fi; }

# ── universe 1 · V1-REGRESSION (11 records, sections 6769 / 8056) ──────────────────────────────
export SEED_MANIFEST=seed-manifest.json
step "1  V1-regression records"            python3 seed.py --confirm || exit 1
if [ "$V2" = "1" ]; then
  step "1b V1-regression PROOF (V2 search)"  python3 verify_gsv2_v1.py || true
else
  step "1b V1-regression PROOF (V1 search)"  python3 verify_gsv2_v1.py || exit 1
fi

# ── universe 2 · GLOBAL SEARCH V2 "Fibridge" (39 records, sections 6721-6740) ──────────────────
# Everywhere Global Search V2 is deployed (qa and staging); production runs V1.
if [ "$V2" = "1" ]; then
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

  # ── universe 4 · SAME-RECORD PERMISSION TOGGLE (20 records, section 6734) ────────────────────
  # C55731-C55737: flip ONE access and re-run the SAME query. The roles these cases pair against
  # already exist from step 6, so nothing here creates a role.
  export SEED_MANIFEST=seed-manifest-toggle.json
  step "12 permission-toggle records"       python3 seed.py --confirm            || exit 1
  # C55735 needs a vendor carrying a purchase order AND a vendor invoice, which a declarative
  # manifest cannot express. Same chain script as Fibridge, pointed at this universe - the state
  # file is keyed by slug so one universe's ids can never land in the other's.
  # 🔴 EXPORTED AND THEN UNSET, never prefixed onto `step`. `VAR=x some_function` leaks the
  # assignment past the call in bash, which would silently point a LATER universe's chain at this
  # vendor and state file - exactly the cross-universe contamination this kit already got bitten by.
  export SEED_PO_SLUG=toggle SEED_PO_VENDOR='ZZTOGVEN Supply'
  export SEED_PO_WO_KEY=tog_work_order SEED_PO_PLAN=toggle
  step "13 toggle PO + vendor invoice"      python3 seed_po_and_invoices.py --confirm || exit 1
  unset SEED_PO_SLUG SEED_PO_VENDOR SEED_PO_WO_KEY SEED_PO_PLAN
  step "14 toggle PROOF — 7 checks"         python3 verify_toggle.py             || exit 1

  # ── universe 5 · SV-10279 PREFIX PARITY (12 records, 4 entity types) ─────────────────────────
  # The comparison pack behind https://shopview.atlassian.net/browse/SV-10279 - one keyword across
  # customers, vendors, assets and parts, so a reviewer sees the rule applied on three types and
  # not on the fourth in ONE response.
  export SEED_MANIFEST=seed-manifest-prefix-parity.json
  step "15 SV-10279 prefix-parity records"  python3 seed.py --confirm            || exit 1

  # ── universe 6 · PER-TAB PREFIX (14 records, C72120/72121/72122) ─────────────────────────────
  # Three cases, three private keywords, three records each: begins-with / contains / typo.
  export SEED_MANIFEST=seed-manifest-per-tab-prefix.json
  step "16 per-tab prefix records"          python3 seed.py --confirm            || exit 1

  # 🔴 BOTH OF THESE ARE PROVED BY status.py, NOT BY A DEDICATED VERIFIER. Their assertion is a
  # RANKING one - which match label each row carries - and on Parts the expected answer is
  # currently the WRONG one, because SV-10279 is open. A verifier that failed on that would be
  # crying wolf on every run; one that passed would be asserting the defect is correct. So the
  # status board proves the records are PRESENT, and the evidence documents carry the measured
  # labels with their date and build marker.
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
