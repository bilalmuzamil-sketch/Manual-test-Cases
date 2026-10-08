# Extra brief for the regression walker (batch R, 83 cases, sections 47110 High · 47111 Medium · 47112 Low)

These 83 cases were written today by the authoring session and have NEVER been checked on the build. Your job = build-verify each one on
https://sv10043.qa.shopview.com (build v26.40.8-7a95011) AND write it in the new layout in the same pass. Output also carries the Expected.

## Getting onto the build (proven today)
- You are the ONLY process allowed to sign in to the test site while you run (parallel quick-logins rotate the shared sign-in and kill each
  other). Do not start more than one browser at a time.
- Wake check: `curl -s -o /dev/null -w '%{http_code}' https://sv10043api.qa.shopview.com/api/definitely-not-real-zz` → 401/404 awake, 302 asleep,
  503 booting. Wake: `curl -s -X POST https://fz4hhptxi8.execute-api.ca-central-1.amazonaws.com/default/toggleQaEnv -H 'Content-Type: application/json' -d '{"action":"wake","env":"sv10043"}'` then re-check every 30 s (max 10 min).
- Copy /tmp/cln/woblib.mjs into /tmp/cln/agent-R/ and import it there (`start(route,'admin')` gives {page,browser}; `mk(page)` gives dump/ov/tip/go/esc/body;
  dump(tag) saves <tag>.txt/.png into build/wo-board-tech-view/build-verify-2026-10-08/ — please change OUT in your copy to
  build/wo-board-tech-view/build-verify-2026-10-08/regression/ and prefix tags with the C-id or area). Existing probes in
  build/wo-board-tech-view/build-verify-2026-10-08/scripts/ show working patterns (Tech View search: `button[aria-label="Search"]` .last() then type;
  More actions: `button[aria-label="More actions for <WO number>"]`; Schedule drag; New Customer/Contact/Asset; Board columns render only on a wide
  viewport, setViewportSize 2600 wide). Write logs with fs.appendFileSync (console output is buffered). Run node with `timeout 400`.
- Sign-in options on a QA branch: only the Admin and Tech quick-login buttons. Other users: Settings > Staff impersonation (the case C368238 is about it —
  find the control) — use it to act as a reduced-role user, and exit it after. Never type or store passwords; secrets stay in /tmp only.
- Standing authorisation on this QA branch: create/change/delete test data, edit roles/permissions, use impersonation. Tag new data "ZZAUTOTEST".
  Restore anything that is not your own test data (leads, shifts, settings, pins, column choices) and log what you restored.
- Navigation the authors could not confirm (from their notes): the Edit Work Order window and how it opens + its Mileage / Engine Hours / PO field
  names; the Lines tab's assign-technician action; the Technicians field on New Line; Labor row More actions > Move labor; the Work Orders tab on an
  asset page and where its count sits; impersonation start/exit under Settings > Staff; where a profile photo is uploaded; the part sale status card's
  person field; Part Sales list request/return counts; Deliveries filter buttons; whether Vendors has a filter bar; report select-all / clear labels;
  List rows-per-page control; Dashboard cards with a table. Notes file: build/wo-board-tech-view/REGRESSION-CASES-2026-10-08-copy.md.

## Per case
1. Walk every precondition, setup action and step on the screen. Record each label you rely on in
   /tmp/cln/agent-R/OBSERVED-REGRESSION.md (area heading · labels in backticks · evidence file names). A label goes in only if you saw it.
2. Rewrite Preconditions + Steps in the layout (LAYOUT-BRIEF.md), with the build's real labels.
3. Expected: keep the head (everything before `<p><strong>Source`) byte-for-byte. Allowed edits only: in the Source paragraph replace
   "Source-verified 8 October 2026; not yet build-verified." with "Source-verified 8 October 2026."; add the line
   `<p>Last checked against build v26.40.8-7a95011 on 10/8/2026.</p>` immediately before the AUTOMATION marker paragraph; set the marker; and, where the
   build does not do what the Expected says, insert before `<p><strong>Source` a paragraph
   `<p><strong>What you should see today</strong> (build v26.40.8-7a95011, 10/8/2026): <what you saw>. (1) If you see exactly that, mark the case Failed and raise nothing new. (2) If it fails in a different way, that is a new problem: report it. (3) If it behaves as the expected results above say, the change has shipped: mark it Passed and tell the QA lead.</p>`
   (the Expected stays as written; never edit it towards the build).
4. Marker (exactly one, as its own last `<p>`): `AUTOMATION: READY` when you walked it and a tester can run it by hand ·
   `AUTOMATION: HOLD - not manually testable (developer/automated check only)` when only a developer can produce the condition (e.g. forced server
   refusal, race timing) — keep any hand-doable part as a step only if the case still makes sense · `AUTOMATION: HOLD - <short plain reason>` for a
   genuinely unobtainable thing · leave `AUTOMATION: HOLD - not yet build-verified on the Work Orders QA build` ONLY if you could not walk it, and say why.
5. Negative claims ("there is no X on this build", "cannot be done"): prove the instrument first — a positive control (same method found a similar thing),
   two attempts on a settled page, URL/new-tab checked, data read back — and write a claim file
   `python3 build/testing-tools/blocker_gate.py --new "<claim>" > build/wo-board-tech-view/build-verify-2026-10-08/regression/<name>-claim.json`, fill it,
   and `--check` it (must exit 0) before your output relies on it. If it cannot pass, say "not verified" in notes instead.
6. Output entry = `{"custom_preconds","custom_steps","custom_expected","notes"}`.

Work in area order to reuse set-up (work order page/lines → Schedule → asset/customer tabs → List behaviours → phone width → Part Sales/Parts pages →
reports → impersonation/photos → Customers/Dashboard). Save your output file after every area (it is your checkpoint). If you run low on context,
stop after saving and report exactly which C-ids are done and which are left.
