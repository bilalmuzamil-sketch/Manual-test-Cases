# Findings — Schedule build verification, 2026-08-11

**Written up, not filed. The ticket-creation hold stands (Standing Rule 62 + the 2026-08-10 hold:
*"Do not create anything until my next order."*). No Jira call of any kind was made this pass.**

---

## 1 · BEHAVIOUR DEVIATIONS FOUND THIS PASS: **NONE**

**Not "none found" in the sense of a clean bill — none was *findable*.** A behaviour deviation is an
observation, and **the application was never reached**. Zero screens were opened, zero controls
driven, zero drags attempted.

**Nothing was inferred from the documents and written up as though it had been seen** (Rule 12).

---

## 2 · Findings that ARE genuine, all document-side

### F1 · The specification still says left-click AND right-click for the same menu

| | |
|---|---|
| **What it says** | **§4.10**: *"Create via **left-click** on empty grid space, which opens a menu with 'Create event' and 'New work order'."* · **§7**: *"**Left-click** on empty grid space opens a menu with: Create event, New work order."* · **§14.1**: *"…shift and event creation (including via **right-click** context menu and day-view click-to-create)…"* |
| **Why it matters** | Our cases assert **left-click** (C30016 step 1: *"**Left-click** an empty spot in a technician's cell"*). If the build implements right-click, the tester fails a case whose expectation is drawn from a document that **also** supports the build. |
| **Status** | **Pre-existing, unchanged in v27, already known.** Reported not resolved — it is Branko's to settle (Rules 55/57). |

### F2 · Our own suite spells one control two ways

`Filter & Display` (C30042) against `Filter and Display` (five sibling cases), and `VIN` (C30042)
against `VIN Number` (C30034, C30045). **At most one of each pair can be right**, so at least one
case sends the tester after a control that does not exist under that name. Both texts quoted side by
side in `CLASSIFICATION.md` §1. **Needs a live read to settle (class A).**

### F3 · The Schedule specification pins NO label wording at all — so the build decides all 85

Searched v27 for any requirement that **argues for** a string (`deliberately`, `rather than`,
`the label is`, `must read`, `reads exactly`, `wording`, `is called`, `named`). **Six passages
matched and none defends a wording** — they say *"labeled with the line count and total hours"*
(§4.3), *"labeled once at the start"* (§4.6), *"hidden rather than discarded"* (§5.3), which describe
behaviour, not text.

**So every label mention in the specification is a LOCATOR, there are ZERO class-B labels, and no
label dispute in this suite can be settled from the documents.** All 85 need a live read.

**This corrected an earlier conclusion of this very pass.** Nine strings — `Create Event` and
`New Work Order` in the Expected Results of C30016, C30017, C30054, C30075 and C38855 among them —
were first written up as class-B defects to be corrected *to the spec's lower case*. Under the
correct test they are class A/C, which **flips the likely answer entirely: if the build renders Title
Case, our cases are already right and nothing needs changing.** The better test comes from the
sibling Filters pass (`build/filters/build-verify-2026-08-11/CLASSIFICATION.md`), whose S12-R6
locator vs S11-R7 pinned contrast states it exactly. Full table in `CLASSIFICATION.md` §2.

### F4 · A PRD-vs-design divergence on the VIN toggle's name

Spec v27 §9 names the toggle **`VIN`**; CLAUDE.md records the **design** pinning **`VIN Number`**
(VIEW-04, 2026-07-22 reconciliation). Since 2026-08-06 **both are authoritative sources** (Rule 57 as
amended), so **this is a documents-disagree finding, which Rule 57 says is RAISED to the PO rather
than silently resolved.** Dating which is newer needs §9's own text diffed across spec versions
(Rule 31 trap (c)) — **not attempted, and not guessed.**

---

## 3 · Two claims in the brief, corrected on the evidence

**(a) "Build-verification has never been done on any of them."** True of **168**, not of **6**.
C43582–C43587 each carry `Last checked against build v3.5-af3a6e1 on 8/11/2026` and describe a real
observation made at authoring. **But `v3.5-af3a6e1` is no longer the running build**, so that
observation is now superseded — the correction does not make them current.

**(b) The expected build marker.** The brief recorded `v3.5-af3a6e1`; the branch is on
**`v3.5-65d6500`**, last-modified **Tue 11 Aug 2026 09:33:33 GMT**. The brief's own warning not to
assume was correct.

---

## 4 · What could NOT be checked, itemised so the gap is visible

| Check the brief asked for | Status |
|---|---|
| Every on-screen label — exact wording and capitalisation | **BLOCKED** — check-list built (85 strings, 195 mentions, 82 cases), nothing compared |
| The navigation path for each case | **BLOCKED** — not one route driven |
| Named test data exists and is findable | **BLOCKED** — 6 data names identified, none confirmed to exist |
| Step executability, drag-heavy cases in particular | **BLOCKED** |
| Whether **click-to-arm is back** (it blocked 7 cases when removed) | **BLOCKED — and this is the highest-value single check.** 7 cases sit on `HOLD - not re-checked against the current build - it needs a drag that could not be completed`; if click-to-arm has returned, all 7 become drivable |
| Panel collapse control still absent (C43582–C43587) | **BLOCKED** — re-confirmation owed |
| Raw markup census | **DONE — 0 of 174** (TestRail-side, no build needed) |

---

## 5 · Nothing to restore

**Nothing was seeded, created, deleted or modified anywhere.** No work order, shift, event, role or
setting was touched — the application was never reached. The only state that existed was a throwaway
headless browser's own `localStorage`, and its process has exited.

**One thing deliberately NOT done:** the app bounced to `/administration/locations` ("Create a
workplace to access the rest of the app") because `admin@shopview.com` genuinely has
`default_workplace: null`. **A default workplace was NOT faked into the seed.** The Report Suite pass
recorded exactly why (`build-verify-2026-08-10/RESUME.md`): seeding one **turns on behaviour the real
account does not get**, and it produced a false "fixed" reading there. The correct route is the app's
own `POST /api/iam/change-location` — attempted, and it returned 401 because the session had already
died.

---

# Attempt 2 — 2026-08-11 (session alive, application unreachable)

**No build finding was possible: the product was never reached.** Recorded here so the next pass does
not re-derive it.

## F-1 · The application redirects every route to `/administration/locations` (not a Schedule fault)

**Observed live** on build `v3.5-65d6500`, signed in as `admin@shopview.com`, location
`Staging Heavy Duty - 9919`. Five routes asked, five identical landings:
`/schedule`, `/workorders`, `/customers`, `/reports`, `/parts` → **all** `/administration/locations`.

**Cause, established rather than assumed:** the staff record for `admin@shopview.com` genuinely has
**`default_workplace: null`** and **`workplace_id: null`**. Ruled out on evidence:

- **not permissions** — `scheduleView`, `scheduleCreateAndEdit`, `scheduleDelete` all present
  (42 perms, `view_mode: full`);
- **not the session** — `/api/auth/me/fe-permissions` returned **HTTP 200** at pass start *and* pass
  end;
- **not the active workplace** — `POST /api/iam/change-location` returned **200**, the top bar read
  `Staging Heavy Duty - 9919`, `localStorage.location` held the right id;
- **not the chooser** — the app's **own top-bar location switcher** was opened and Heavy Duty picked
  through the UI (`switcher opened: true`, `picked: true`); it still bounced, so the switcher sets the
  session's active workplace but does not satisfy a guard that reads the staff record's default.

**Is this a defect worth a ticket?** **Unknown, and deliberately not asserted.** It may be correct
behaviour for an account with no default location — the Locations page is a plausible place to send
someone who has never chosen one. Saying more would require observing what a *properly configured*
account does, which is the very thing that is blocked. **No ticket prepared, and none could be filed
anyway — the creation hold stands (Rule 62).**

## F-2 · The click-to-arm reading from the first harvest is INVALID — recorded so it is not reused

The first harvest reported `html_has_arm: false`, and that looks like an answer to the highest-value
question in this pass (**7 cases** held on a drag, per **SV-8957**). **It is not.** It was measured on
`/administration/locations`. **An absence measured on the wrong page is not an absence**, so the
SV-8957 question remains **open and unanswered**.

## F-3 · Nothing in `CLASSIFICATION.md` could advance

Confirmed again from the documents: **the Schedule specification pins no label wording**, so all 85
asserted strings are class A or C and **the build decides every one**. There is no document-only
subset. The two internal clashes (`Filter & Display` vs `Filter and Display`; `VIN` vs `VIN Number`)
**remain defects in our own suite** — at most one spelling of a control can be right — but which side
is wrong still needs one live read.

## Not a finding, but worth recording: a tooling fault of ours

`/tmp/trlib.py`'s `getall()` builds `?limit=…` onto a URL (`index.php?/api/v2/…`) that already has a
`?`, producing **HTTP 400** on every paginated call while unpaginated `get_case` works — which reads
like a partial API outage rather than our bug. **Paginate with `&`.**
