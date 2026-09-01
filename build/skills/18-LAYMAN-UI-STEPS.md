# 18 — EVERY CASE IS RUNNABLE FROM THE UI BY A LAYMAN

> ## 🔴 THIS IS THE PRIMARY JOB OF A BUILD-VERIFICATION SESSION (QA lead, 2026-09-01)
>
> Verbatim: *"ONE of the major part of build verification is TO make the steps of replication and
> preconditions RUNNABLE and not to keep those test cases the spec level test cases. Make sure you
> do never fail in that part and this thing never bites me."*
>
> And, assigning the lane: *"Make sure ALL the test cases in the invoice refresh are moved from Spec
> level to UI based Runnable test cases with UI runnable preconditions and steps of reproduction for
> a manual tester. This is the primary job of this session."*
>
> **So build verification is NOT done when the verdicts are in.** A pass that establishes a case
> passes but leaves its preconditions and steps spec-level has **not finished the job**. Runnability
> is a deliverable of equal standing with the verdict, on **every** case in the suite — not only the
> ones that happened to be verified this run.
>
> **THE GATE IS `build/testing-tools/check_runnable_cases.py`** — run it against the suite and drive
> it to zero failures before reporting a suite done. It reads TestRail LIVE, so it cannot be fooled
> by a stale local file. It supersedes `check_layman_steps.py`, which passed any case containing the
> words *"open the"* and therefore reported a suite clean when 26 of 119 cases were not.
>
> **CALIBRATION, LEARNED THE HARD WAY (2026-09-01).** Requiring *every* step to name a place
> over-fires: once step 1 has the document on screen, *"Look at the masthead"* is exactly right and
> repeating the click path in every step is noise. Demanding it flagged 72 of 119 cases, nearly all
> of them wrongly. **The rule that matters is that the FIRST step must put the tester somewhere** —
> a screen, an on-screen anchor, or an explicit pointer back at the preconditions. A first step of
> *"Generate the Invoice."* strands the tester; *"Look at the addresses area"* as step 2 does not.
>
> **A GATE THAT CANNOT FAIL IS NOT A GATE.** Both times a checker here was too permissive it was
> because it looked for the presence of some friendly-looking word rather than for the thing a
> tester actually needs. When you write or change this gate, first prove it FAILS on a known-bad
> case, then prove it PASSES a known-good one.

**Standing requirement, QA lead 2026-08-31, verbatim:**
> *"make sure that all the tests which you have build verified have got the Steps or reproduction and
> preconditions which a lay many and a manual tester can easily follow from the UI"*
> *"steps of reproduction/preconditions should be from the UI preferably so that the Manual QA tester
> Viktoria can easily follow the steps of replication and set the preconditions from the UI. Those
> steps of replication and preconditions should be super easier for a lay man to follow"*

Named testers, assigned PER SUITE (QA lead, 2026-09-01): **Mudassir Qamar** — Invoice UI Refresh · **Viktoria Videnovic** — Inline Add and Edit Parts (6597) and Printer Friendly WO (6617), on sv9315. The spelling is **Viktoria**; older notes have "Victoria".

## 🛑 SCOPE — UNIVERSAL (QA lead, 2026-08-31, reaffirmed)
**This applies to EVERY case in EVERY suite — not only build-verified ones.** No case may ship with a
spec-level precondition or step. Verbatim: *"Make sure that NO test case has the spec level preconditions
and steps of replication — they should always be Runnable by the manual QA in the build."* A source-only
(Rule-85) suite is NOT exempt: draft the route from the **design/spec**, mark it PROVISIONAL until the
build confirms exact labels/filters, and NEVER invent an unreachable path or state (the hard line below).
On a no-build suite the EXPECTED results still come only from the documents (Rule 57); it is the
PRECONDITIONS/STEPS route that is drafted-from-design and confirmed at build time.

## RUNNABILITY LIFECYCLE — provisional at source-verification, FINALISED at build-verification (QA lead, 2026-08-31)
**"Build verification is the final touch-up after source verification to make the tests runnable."** So a
case's route has two states:
1. **PROVISIONAL (no build yet, Rule 85):** the route is drafted from the **design + spec**, marked
   *"provisional — to be confirmed on the build"*, and never fabricated. This is done at/after source
   verification so the case reads as runnable in the meantime.
2. **FINALISED (build exists):** the build-verification pass (skill 11/03) rewrites the route in the
   build's own on-screen labels, confirms every screen/menu/control is really there and the setup state
   is reachable, and stamps `AUTOMATION: READY` + the build marker. The provisional route is superseded.

**HANDOFF GATE (learned 2026-09-01):** before a build-verification session is asked to take a suite,
CERTIFY it source-side first — drive `check_runnable_cases.py` to **NOT RUNNABLE = 0 for every
non-Automated case** (Automated/foreign holds are the only allowed exceptions, Rule 71/38), confirm all
cases render `fr-view`, and confirm coverage is complete. This hands the build-verify session a clean
baseline so it spends its build access confirming exact labels, not fixing spec-level basics. **Do NOT
skip build verification on the strength of this certification** — the routes are still PROVISIONAL until
a build confirms them; a junior tester on unconfirmed labels is the failure this prevents. And build
verification needs a QA build to EXIST for the feature — a Rule-85 (no-build) suite cannot be
build-verified yet, only certified runnable-on-paper.

## 🛑 COORDINATION — CHECK FOR A BUILD AND AN ACTIVE BUILD-VERIFY SESSION BEFORE ANY RUNNABILITY PASS (learned the hard way, 2026-08-31)
Before launching a runnability pass on a suite, VERIFY LIVE (Rule 86 — never trust a PROJECT-STATE line):
- **Does a QA build exist now?** A `PROJECT-STATE.md` "QA env: none → Rule 85" line CAN BE STALE — another
  session may have recovered/created a build. Check recent commits (`git log --oneline -- build/<suite>/`),
  the suite's `build-verify-*/HANDOVER*.md`, and live `AUTOMATION: READY` + build markers on the cases.
- **Is a parallel session already build-verifying it?** If cases are turning `AUTOMATION: READY` on a real
  build and being made layman-followable, **that session OWNS the suite's runnability — DEFER to it, do
  NOT run a design-provisional pass over it.** Two sessions UI-editing the same cases collide (deadlocks,
  last-writer-wins overwrites that can downgrade a build-verified route to a provisional one).
- **What went wrong once:** a design-provisional Invoice pass was launched while a build-verify session
  held the recovered sv8218 build and had already made 100+/119 cases build-verified + layman-followable.
  No damage resulted (all stayed `fr-view`; the READY count only rose), but the pass was redundant and
  risked overwriting superior build-checked routes. **Provisional routes are ONLY for suites with no build
  and no active build-verify owner.**

## THE RULE

**A case is not tester-ready until a person who has never seen the feature can open the right screen
and reach the right state using only the case text.** "Generate the Invoice" is not a step — it is a
summary of one. The tester needs the clicks.

**Every case that inspects a document, a screen or a dialog carries, in its PRECONDITIONS, the route
to get there, written as UI clicks in the build's own words.** Nothing else changes: the STEPS still
describe the check, and the EXPECTED RESULTS still come from the documents, never the build (Rule 57).

### What "followable from the UI" means, concretely

| ❌ Not followable | ✅ Followable |
|---|---|
| "Generate the Invoice." | "Click **Work Orders** in the top menu. Open the work order. Click the **Finance** tab — the document appears on screen." |
| "Enable the Show declined work option." | "…and if the option is not on that dialog, say so and stop — do not use an API call to reach a state a tester cannot reach." |
| "POST /api/work-orders/{wo}/authorizer" | Name the real route AND the screen: "Open the work order, click the **Authorizer** row in the customer card…" — API-only steps belong to API-titled cases (Rule 4). |
| "Reach a credit in Partially applied status." | "Customers → open the customer → **Invoices** tab → the credit's row → the print icon (tooltip *Print credit memo*)." |

### The five things a route must state

1. **The entry point** — the top-menu item or screen name, exactly as it is labelled.
2. **The record to open**, and how you know you have the right one.
3. **The tab or panel** to click.
4. **Where the thing appears** once you are there.
5. **Any filter or setting that hides it** — a default-on filter that hides the row is the difference
   between "not there" and "not found". *(Worked example: a fully-applied credit memo is hidden by the
   **Open only** chip, which defaults to on; a credit issued at another location does not appear at
   all because the list is workplace-scoped.)*

### SPLIT A VAGUE / MULTI-BEHAVIOUR CASE INTO CONCRETE SINGLE-BEHAVIOUR CASES, EACH BUILDING ITS OWN STATE (QA lead, C44996 → C45250–C45253, 2026-09-01)
*(This supersedes an earlier retracted note — the first C44996 example had a mistake. The pattern below is taken from the QA lead's corrected split, verified live.)*
When one case tries to cover several behaviours behind an abstract trigger ("Add Part/Edit hidden when the
work order is not editable **otherwise**"), it is neither runnable nor provable. Split it into **several
cases, each testing ONE behaviour**, and let each case **build its own state from scratch with named UI
controls** instead of asserting a state in the abstract. The corrected split of C44996:
- **C45250** — a Complete *line* offers no "+ Add Part". Steps build it: Work Orders → New Work Order →
  Lines tab → New Line → Parts section → "+ Add Part" → pick/receive → set the line to Complete → the
  button is gone. (Concrete trigger = a Complete line, reached by the steps — not "not editable otherwise".)
- **C45251** — on a Complete line, only the allowed part fields edit (inventory vs SPO lists spelled out).
- **C45252** — "+ Add Part": entering Cost fills Sell Price from the pricing matrix.
- **C45253** — changing the Category recalculates Sell Price from the matrix.
Each is one behaviour, each starts from "create the work order and line", each names the controls.

**SOURCE = "Manually added" for QA-lead product-knowledge cases.** When the QA lead authors a case from
product knowledge rather than the spec pipeline (e.g. field-level editability, pricing-matrix behaviour not
spelled out in the PRD), the provenance line reads **"Source: Manually added (QA lead, <date>)"** — not the
"as per epic … specification version …" line. Mark it **AUTOMATION: HOLD — manually added; to be
build-verified**, and flag any UI control names as PROVISIONAL until the build-verification session confirms
them. These still pass `check_runnable_cases.py` and render `fr-view` like any other case.

## 🛑 THE LINE THIS RULE MUST NOT CROSS

**Making a step followable must never make an unreachable state reachable on paper.** If the UI has
no control for the state the case needs, the case is **NOT AVAILABLE ON BUILD** (Rule 69) — it does
not get a step that quietly substitutes an API call.

Worked example, 2026-08-31: `includeDeclined=1` on the render endpoint produces the declined-work
document, but the **"Show declined work" toggle does not exist in the Invoice Details dialog**.
Rewriting C44937–C44939 to use the API parameter would have made three cases "pass" and **deleted the
finding that an operator cannot reach that state at all**. They were left unverified on purpose. Skill
03 §8.1 is the authority: rewriting a substantive gap into a runnable step deletes the finding.

## THE ROUTES, AS OBSERVED ON THE BUILD (sv8218, v26.35.5-8c3cc21, 2026-08-31)

Re-observe these per environment before reusing them — they are facts about a build, not law.

**A work order's Estimate or Invoice**
1. Click **Work Orders** in the top menu.
2. Open the work order (click its row in the list).
3. Click the **Finance** tab. The document appears on screen.
4. Use the **Estimate/Invoice** toggle above the document to switch between the two.
5. The printer icon prints it and the download icon saves it; the cog icon opens the invoice display
   settings (Labor rate, Labor hours, Labor price, Summarize labor total, Summarize parts total,
   Part number, Part description).

**A Parts Sale Estimate or Invoice** — **Customers** → open the customer → **Part Sales** tab → open
the part sale → **Finance** tab.

**A Credit Invoice** — **Customers** → open the customer → **Invoices** tab → the credit's row (its
number, e.g. `CM-100`, sits in the **Invoice #** column among ordinary invoice numbers) → the print
icon at the right of that row, tooltip **Print credit memo**. Your active location must be the one the
credit was issued at, and **Open only** must be off for a fully applied or refunded credit.

**The Authorizer** — open the work order; the **Authorizer** row is in the customer card on the left,
below **Contact** and **Phone**. The list offers only contacts with **Approves Work** ticked on their
contact record (**Customers** → customer → **Contacts** tab → edit a contact).

## HOW THIS IS CHECKED

`build/testing-tools/check_layman_steps.py` — flags any case whose preconditions and steps contain no
UI route (no screen name, no tab, no click). Run it before any handover; pair it with the
served-page render check (skill 04 §4.5), because a case can be perfectly worded and still unreadable
on screen.


---

# 🛑 RUNNABLE-SHAPED IS NOT BUILD-VERIFIED. THE LABELS HAVE TO BE READ OFF THE SCREEN. (2026-09-01)

**The question that exposed this, from the QA lead, verbatim:** *"kindly confirm if the preconditions
are also Build verified and runnable"*.

They were **runnable** — `check_runnable_cases.py` said 121/122 and 43/44, live. They were **not all
build-verified**, and the difference cost 118 cases:

| Claimed by the preconditions | Cases | What the build actually says |
|---|---|---|
| `“Work Order Line - Create and Edit”` | **117** | the role screen has a **“Work order lines”** section with a **“Create & Edit”** toggle. That exact string does not exist |
| `“Work Orders → Work Order View Mode”` | **90** | the **“Work orders”** section contains **“View mode”**, offering **“Full View”** and **“Tech view”** |
| `“Tech Story”` box on a line | 1 | the row is labelled **“Story”**, placeholder *“Add tech story for this line”* |
| *"the menu holds five items"* | 42 | five on an editable work order; **three on a Paid one** (no Fee / Discount, no Delete) |

**Why the gate could not catch it, and this is the point.** `check_runnable_cases.py` says so in its own
header: *"WHAT THIS CANNOT CHECK. Whether a route is CORRECT or still exists on the build — only that
one is present and tester-shaped."* A precondition can name a screen, give a click and point at a
control, and pass — while the control it names has never existed. **A green runnability score is not an
answer to "are the preconditions build-verified".**

## THE RULE

**A precondition is build-verified only when every UI label it QUOTES has been read off the served page
in a probe whose evidence is committed.** Not from an API field name (`workOrderLinesCreateAndEdit` is
not a label), not from the spec, not from a note in this repo, not from memory.

## THE TWO-PART GATE, from now on

```
python3 build/testing-tools/check_runnable_cases.py  --section-prefix "<suite>"   # is it tester-SHAPED?
python3 build/testing-tools/check_precond_labels.py --sections <ids> \
        --observed build/OBSERVED-UI-LABELS-<env>.md                              # are the labels REAL?
```

The second one compares every quoted label against **`build/OBSERVED-UI-LABELS-<env>.md`** — the
labels seen on that build, each row naming its evidence — and fails on any label never observed, plus
any label on its BARRED list (strings proven not to exist). Keep that file per environment and grow it
from probes.

**It caught its own maintainer within minutes of existing.** It flagged 42 correct cases because I had
copied `Fee & Discount` from an old note into the observed file when the build says `Fee / Discount`.
**The cases were right and my reference file was wrong** — so the file's own rule is now the first thing
in it: a label goes in only from a probe with committed evidence.

## AND STATE IT HONESTLY IN THE REPORT

"Runnable" and "build-verified" are two claims. Report them separately, per case, with numbers:
*"121 of 122 are runnable; the preconditions of the 118 that were walked on the build are build-verified;
the labels in all of them are now confirmed against the observed-label file."* **Never let a
runnability score stand in for a label check.**
