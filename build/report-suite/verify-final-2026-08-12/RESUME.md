# RESUME — Report Suite build verification, 12 August 2026

**Written for a fresh worker with no memory of this session. Everything needed is in git.**

---

## 1 · Where this stopped, in one paragraph

A verification pass against QA branch `sv8582` was stood down at the 5-hour usage limit with the
budget redirected to Schedule. **It made ZERO TestRail writes and ZERO Jira calls that create
anything.** Nothing is half-written. The build inventory, the runnability analysis and three
divergences for the QA lead are complete and committed; the **write phase never started**, and three
prepared changes are specified in §4 below ready to apply once authorised.

## 2 · The build — CHECK THIS FIRST, IT HAS MOVED TWICE IN A DAY

| | |
|---|---|
| running when this pass ran | **`v3.7-4626299`** |
| `index.html` last-modified | Wed, 12 Aug 2026 05:06:49 GMT |
| etag | `da084d29fbcc187229d2988862374d6b` |
| sha256 of `index.html` | `6dc177ab17a9243f4820e0523390602c0c06038f0d70ee165d1d26032ee9c85b` |
| read at | 05:21:48Z and 05:51:20Z — **byte-identical** |

It was `v3.6-8c28eed` a few hours earlier and `v3.5-f77875c` before that. **Re-read the marker before
trusting anything below**; if it has moved again, everything in `LABEL-DIFF.md` is a layer-1/layer-2
observation against a build that is gone (Rule 60), and the divergences in `DIVERGENCES.md` need
re-proving — they are cheap to re-prove, see §5.

```
curl -s -D- -o /tmp/i.html -H "Cookie: $CK" "https://sv8582.qa.shopview.com/index.html?cb=$(date +%s)" \
  | grep -iE 'last-modified|etag'; grep -o 'app-version[^>]*' /tmp/i.html
```

## 3 · What is verified and what is not — do not restate these numbers upward

| | |
|---|---:|
| our cases / live under group 4281 | **480 / 492** (12 are Vladimir Tomovic's — never edit) |
| every control + label + required surface verified on `v3.7` | **334** |
| …and with no unconfirmed data-state precondition either | **214** |
| …restricted to the three FINAL reports (WIP · TU · SBC) | **190 of 229** |
| **not verified** | **146** |

Reasons for the 146 (a case can have several): downloaded-file contents 58 · second sign-in 40 ·
seeded snapshot state 17 · another app screen 13 · phone viewport 8 · logo state 6 · dark mode 6 ·
label not observed 34.

**No case carries a `v3.7` build line.** The pass stopped before re-stamping, deliberately — a stamp
is a claim, and an unwritten one is better than an overstated one.

## 4 · The three prepared changes — exact, ready to apply, NOT yet authorised

All three are `update_case` on the **Expected Results field only**, adding a Rule-61 style tester
instruction and changing the final `AUTOMATION:` marker. **Send all three text fields on every
payload** (`custom_preconds`, `custom_steps`, `custom_expected`) — TestRail re-renders any text field
you omit. Byte-verify each write field by field; STOP the batch on any mismatch.

**Do NOT touch the steps of C30107 or C43591.** They are correct against the specification; the build
is what is behind.

| Case | Now | Change to |
|---|---|---|
| [C30107](https://shopview.testrail.io/index.php?/cases/view/30107) | `AUTOMATION: READY` | `AUTOMATION: HOLD - the multi-select Product Type filter this test needs (SV-9074) is not in the build yet` |
| [C43591](https://shopview.testrail.io/index.php?/cases/view/43591) | `AUTOMATION: READY` | same |
| [C38913](https://shopview.testrail.io/index.php?/cases/view/38913) | `AUTOMATION: READY` | `AUTOMATION: HOLD - the build does not follow the ratified Location rule; see SV-8954` (wording copied from its siblings C38912 / C43551 so all three read alike) |

Add to each, in the Expected Results **before** the provenance line, in plain words: what the tester
will actually see, and that they should **mark this BLOCKED, not failed**, because the control the
test needs is not built yet.

## 5 · How to re-run everything — the tooling is committed

```
cd build/report-suite/verify-final-2026-08-12/tools
# 0. secrets first: /tmp only, chmod 600
mkdir -p /tmp/qa-cookies && printf 'PHPSESSID=…; sv_sso_session=…; cf_clearance=…' \
  > /tmp/qa-cookies/reports-cookie-header.txt && chmod 600 /tmp/qa-cookies/reports-cookie-header.txt
python3 mkseed.py        # builds /tmp/seed.json from live API reads; prints role + workplace
python3 pull_live.py     # 492 live cases -> /tmp/rs812/live_now.json
node harvest.cjs         # per-report labels, headers, tabs, column menus     (~6 min)
node menus2.cjs          # EVERY control opened by exact test-id              (~10 min)
node nav.cjs             # navigation group placement                        (~2 min)
node loc_probe.cjs       # the Location-column question, both states          (~8 min)
node deep.cjs            # tabs, sort, expand, downloads, dark, phone         (~12 min)
python3 runnable.py      # the runnability diff over all 480 cases
```

`harness.cjs` is the shared bridge. Two things in it matter and cost time to rediscover:
- the bridge **fulfils with HTTP 599** on a thrown fetch instead of aborting, so *"the app never asked
  for this"* stops looking identical to *"the request failed"*. `bridge_errors` read **0** on every
  run today, which is what makes an absence statement worth making.
- **read the rendered text, not `textContent`** — the `capitalize` trap.

### Three traps that cost time today. Do not pay for them twice.

1. **`page.evaluate` takes an EXPRESSION.** A helper `function` declaration prepended to an IIFE is a
   syntax error and every report comes back empty. Put helpers **inside** the arrow body.
2. **`[data-test-id*=export]` matches the NAV LINK `report_nav_export_reports` first** and navigates
   off the report. Use exact ids; the download button is `btn_dropdown_<key>_export`.
3. **Control ids do not all end in `_filter`.** `select_sbc_product_type`, `select_sbr_product_type`,
   `select_sbr_invoice_status`, `toggle_sbr_show_unassigned`, `select_pv_type` do not. A pattern
   requiring `_filter` reports four real controls as missing.

## 6 · What is left, in the order I would do it

1. **Apply the three holds in §4** once authorised — they are on final reports and a tester meets
   them tomorrow.
2. **Get the QA lead's answer on the 57 bulk-closed tickets** (`DIVERGENCES.md` §1). It governs 75
   cases and nothing should move until it is answered.
3. **Verify sorting on Technician Utilization and Sales By Customer.** My probe's row extractor read
   the expand-chevron cell, so its "order did not change" is an artefact. Fix: read the *name* cell,
   not `tr.innerText.split('\n')[0]`. **Do not report a sort defect on the strength of my run.**
4. **Read the contents of the 10 downloaded files** — 58 cases turn on what is inside them. The files
   themselves download cleanly.
5. **The remaining three reports** (SBR 112 · PV 71 · IV 68) got the full static harvest and control
   sweep but no deep probe — no tabs/sort/expand/download/phone/dark run.
6. **Re-stamp Rule-54 sentence 2** on whatever you actually verify, and **only** on that.

## 7 · Environment — nothing to clean up, and here is the proof

**No test data was seeded. No server-side state was changed.** Across all six probe runs the request
bridge recorded **0 non-GET API calls** — checked by scanning the recorded API log of every run, not
assumed. **No `ZZAUTOTEST` record exists from this pass because none was ever created.**

Filter and column selections were changed while probing (for example selecting "All locations"), but
this suite stores those **in the browser only** — the Work In Progress specification states
persistence is per-browser and not tied to the account — and every probe ran in a throwaway browser
context discarded at the end. Ten report files were saved to `/tmp/rs812/dl/`, outside the
repository, and go with the container.

**`quick-login` and `switch-user` were deliberately never called**, because a sibling worker shares
the session token and both rotate it.

## 8 · Run 359 — proven untouched BY CONTENT, twice

`include_all` still **false** · **480** tests, case_id sets equal in both directions · **535** result
records, **0 missing by id, 0 new** against this morning's snapshot. Evidence
`evidence/run359-END.json`. Compared by content, never by `updated_on`.

## 9 · Read these, in this order

1. `DIVERGENCES.md` — **written for the QA lead**; three things need his decision
2. `FINDINGS.md` — the honest counts and the two false alarms avoided
3. `LABEL-DIFF.md` — what the build shows against what the cases say
4. `CHANGES-MADE.md` — nothing changed, and what was prepared
5. `testrail-execution-log.md` — zero writes, and the proof
6. `build/report-suite/build-viu-2026-08-12/` — the earlier pass the same day; its download verdict
   and `capitalize` catch are both re-confirmed here
