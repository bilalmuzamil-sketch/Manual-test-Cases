# Brief — rewrite WO Board / Tech View cases into the QA lead's new layout (8 Oct 2026)

Repo: /home/user/Manual-test-Cases (branch claude/build-verification-setup-aieu36). You do NOT commit, push, or write to TestRail.
You write ONE output file (named in your task) and may use scratch space /tmp/cln/agent-<X>/ only.

## Read first (all short)
1. The QA lead's layout spec: build/wo-board-tech-view/HANDOVER-CASE-LAYOUT-2026-10-08.md — follow it exactly, including the four extra rules
   ("Needs" line · [placeholders] · results tied to steps · own data per case) and the worked example.
2. The observed screen labels of this build: build/wo-board-tech-view/OBSERVED-UI-LABELS-sv10043.md (build sv10043, v26.40.8-7a95011).
   It also lists which names are only example data and which screens/flows were proved (customer > contact > asset route, Schedule, etc.).

## QA lead's decision (8 Oct 2026) — overrides the layout file where they differ
**The Expected results field is NOT changed at all** (not even "Step N:" prefixes or [placeholders]). You rewrite ONLY Preconditions and Steps.
- Placeholders are defined in Setup and used in Steps. Where the Expected names an example (e.g. "S1-702", "Esther Howard"), Setup must say which
  placeholder that example stands for, e.g. `Record the number shown as [WO-1] (the expected results call it "S1-702").`
- **Step numbers must keep matching the Expected.** If the Expected refers to step numbers ("Step 5:", "Steps 8 to 10", "after step 2"), the new
  Steps list must keep those numbers pointing at the same actions. Move setup actions out of Steps only when that does not renumber any step the
  Expected refers to; otherwise leave that action in Steps (worded with placeholders) and say so in `notes`.
- If the Expected names a customer, technician or other data value without "e.g.", keep that exact value in Setup (do not rename it).

## Content rules (these are the lane's rules — obey them)
- Keep every correction already in the case word for word (Admin quick-login button, "you appear as Admin ShopView", Change Location via your
  initials, Time Clock on, at least one Department (required), Save & Close, Column Selection, Fields to display, Density, the 1024 px width, the
  New Customer > Contacts tab > New Contact > Assets tab > New Asset route, ready-made lines in "What Are You Doing?", Lead Technician read-only on
  an Estimate, etc.). Information needed to run the case is never dropped; repetition is.
- UI labels: only labels that appear in the case already or in OBSERVED-UI-LABELS-sv10043.md. Never invent a button name, path or state.
- Preconditions block = required starting state only (no instructions): first line "Needs: …" (users · browsers · Schedule access · rough minutes);
  build; role + the exact permissions; location; window width; settings the expected result depends on with their starting values; the exact data
  and how it relates (counts, statuses, who leads what); which names are examples and what must hold.
- Setup block = numbered instructions in the build's labels that create that state; record each assigned number/name once as [WO-1], [Tech-A],
  [User-B], [Cust-1] …; last item starts "Check the setup worked:" — what to look at and what to do if it does not match.
- Own data: every case uses its OWN ZZAUTOTEST customer named after its behaviour (e.g. "ZZAUTOTEST Empty Columns"), never one shared with another
  case — in particular the 64 cases that all used "ZZ Board Test Co" each get their own. Exception: a name the Expected states without "e.g." stays.
- Steps = only the behaviour under test, numbered, one action per line, exact control and value, using placeholders. Nothing vague.
- No developer jargon in Preconditions/Setup/Steps (no permission codes, API, endpoint, HTTP, server-side, ms, requirement ids).
- A case whose marker is `AUTOMATION: HOLD - not manually testable …` still gets the layout; keep its existing caveat wording.

## HTML shape (TestRail renders block tags only; NEVER <br>, <b>, <i>, <em>, <code> or plain newlines)
custom_preconds:
`<p><strong>Preconditions</strong></p><ul><li>Needs: …</li><li>…</li></ul><p><strong>Setup</strong></p><ol><li>…</li><li>Check the setup worked: …</li></ol>`
(nested `<ul><li>` inside an `<li>` is fine). custom_steps: `<ol><li>…</li></ol>`. Escape `>` as `&gt;`, `&` as `&amp;`; keep existing entities
such as `&ldquo;`.

## Output
JSON object keyed by case id (string, no "C"): `{"custom_preconds": "...", "custom_steps": "...", "notes": "one line: anything a reviewer must know
(step numbers kept, customer renamed from X to Y, anything you could not resolve)"}`.
Self-check before finishing (both must pass for your whole file):
- `python3 build/testing-tools/check_tester_runnable.py --bodies <a file where each case = live case with your two fields swapped in>`
- your own check that every case's Expected step references still point at the right steps, and that no ZZAUTOTEST customer name is used by
  two cases in your file.
Reply with: the output path, counts, and every case whose `notes` needs the reviewer's attention (C-id + note). Keep the reply short.
