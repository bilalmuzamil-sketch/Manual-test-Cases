# WO Board / Tech View suite — FAST RERUN (any branch, staging or production)

Written 9 Oct 2026 after run 498 on sv10043, at the QA lead's request: *"make sure that you do not have to rediscover
any path or anything again when you retest this FULL suite again on any other branch ... These tests should be super
quick for you"*. Everything below was proven on build v26.40.8-7a95011. **Do not rediscover — run.**

## 1 · One command

```bash
# once per environment: the sign-in cookie (never committed)
printf 'SV_SSO_SESSION=%s\n' '<cookie>' > /tmp/shopview/<key>.env && chmod 600 /tmp/shopview/<key>.env   # <key> = sv10043, staging, app …
# staging / production only: WOB_API=https://<api host>   (QA branches derive <branch>api.qa.shopview.com)
GS_APP=https://<branch>.qa.shopview.com ./run-all.sh /tmp/wob-rerun-<date>
```

`run-all.sh` does three things, unattended:
1. **Profile** — on a new environment it runs `discover-profile.mts` once and writes `profiles/<host>.json`
   (organisation id + the two locations the suite uses). sv10043's values are built in (`profile.mts`).
2. **Every FINAL script, only its own checks** — `rerun-order.txt` lists the 50 final scripts; `rerun-map.json` says
   which checks each one owns (250 of 253 scripted). Superseded attempts (`*-batch` → `*-fix`, `-fix2`, `-fix3`) are
   never run again. The sign-out check (`signout-fix.mts`) is always LAST: it ends the shared session.
3. **One log per script** in the log folder; judge each check from its log + pictures and write results with
   `build/testing-tools/push_results_to_run.py` (Failed needs `ticket_held` and a "held with the QA lead" note).

Manual only (3): C97026, C97033, C97034 — they read the Google Analytics REPORTS a day / a week later; this session has
no access to the property. The browser half of every analytics check is scripted and passes.

Single script on any environment: `GS_APP=… ONLY=C368169 ./wob-run.sh editwo-batch.mts`.

## 2 · What made run 498 slow — and what is now cut

| Cost in run 498 | Cut to |
|---|---|
| ~76 batch runs for 253 checks; most re-runs were MY script faults, found one at a time | 50 final scripts, each already carrying every fix below — one pass |
| Rediscovering routes (impersonation page, Edit Work Order, Parts filters, line menus, asset tab…) | All recorded in `build/APP-ACTIONS-PLAYBOOK.md` and baked into the scripts |
| A saved Status filter leaking between batches and emptying every list | `runner.mts` clears saved list filters at every sign-in |
| Signing in per batch | One saved session reused (`session.mts`); only re-signs when it stops working |
| Branch-specific ids hard-coded in 37 scripts | One profile per environment (`profile.mts`, `profiles/`) |
| Waiting for stuck batches | Per-step time limits + a silence watch; a frozen batch is killed and re-queued |

## 3 · Traps already handled (do not re-learn them)

- **Board/Tech View**: test technicians sit far right among ~100–190 columns — scroll to them (`toColumn`, `showCols`);
  Unassigned stays pinned left. Tech View is a virtual table: collapse big groups, then walk it (`techGroups`).
  Keyboard: one roving Tab stop (a card OR a column header), then the arrows. Live board updates need `WOB_LIVE=1`.
- **Seeding**: an authorized line APPROVES an Estimate (give Estimates no line). Asset changes must send the VIN.
  A shift can't be longer than the work's estimate — set the line's Estimated Time first; use a day the technician
  works (weekends show "Couldn't read this shop's working hours"). Choose lines → tick → hours → Create.
- **Line windows**: removing a scheduled technician asks "Remove technician?" (confirm). Edit Labor's Technician is
  multi-select — untick the old one in the same open list. Close lists by clicking the window title, not Escape.
- **Work order page**: no "Edit Work Order" window exists — lead / mileage / engine hours on the left card, PO on
  Finance (QA lead 9 Oct). The Lead Technician list opens at the current lead; "Unassigned" is at the TOP.
- **Parts pages**: no Vendor / State filters — the filter is the page's own Search at the RIGHT of the header
  (QA lead 9 Oct). A part request's PO can come out "Vendor missing": pick the vendor before Receive.
- **People**: impersonation = `/impersonate-user/<user id>`, Exit in the orange bar; run it as the admin, not the
  runner. Staff with labor can't be deleted ("Staff is being used elsewhere") — a "Deleted user" row only exists in
  old data (`deleted-search.mts`). The admin can switch only to locations he is enrolled at.
- **Pictures**: capture at 2x (`WOB_SCALE=2`) into `defect-drafts/raw`, wait for images to load before capturing,
  annotate with `annotate_v2.py --scale 2` (one marker per fault keeps leader lines off the toolbar).

## 4 · The held defect reports (filed only with the QA lead's per-ticket approval)

`defect-drafts/README.md` lists them with owning story, live status and pictures; ticket bodies are in
`defect-drafts/tickets/`. Re-verify each on the day's build before asking (the `recapture` scripts do it at 2x).
