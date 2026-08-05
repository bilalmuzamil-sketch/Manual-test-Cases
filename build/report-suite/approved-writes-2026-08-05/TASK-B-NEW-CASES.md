# TASK B — the new cases Chris Ward's answers create

**Report Suite · epic SV-8582 · PO Chris Ward · 2026-08-05**

**The QA lead's authorisation, verbatim:** *"Yes, but give me the links of those cases then"* — so
the C-ids and links are the point of this paper, and they are in section 1.

**Outcome in one line:** **four of the five were authored and are live in TestRail; one — N2 — was
NOT authored**, because Chris's own answer contradicts itself about the very behaviour it would
have to assert.

---

## 1 · THE FOUR NEW CASES — C-ids and links

| Gap | Internal ID | **C-id** | **Link** | Section it sits in | Automation |
|---|---|---|---|---|---|
| **N1** | **SBC-COL-03** | **C43550** | https://shopview.testrail.io/index.php?/cases/view/43550 | Reports Suite / Sales By Customer Report / **SBC — Column Selector** (4299) | HOLD |
| **N3** | **WIP-PERS-05** | **C43551** | https://shopview.testrail.io/index.php?/cases/view/43551 | Reports Suite / Work In Progress / **WIP — Column Selection & Persistence** (4359) | HOLD |
| **N4** | **TU-EXP-10** | **C43552** | https://shopview.testrail.io/index.php?/cases/view/43552 | Reports Suite / Technician Utilization / **TU — Exports** (4346) | HOLD |
| **N5** | **SBC-EXP-17** | **C43553** | https://shopview.testrail.io/index.php?/cases/view/43553 | Reports Suite / Sales By Customer Report / **SBC — Exports** (4300) | HOLD |

| Gap | Internal ID | Status |
|---|---|---|
| **N2** | — | **NOT AUTHORED.** See section 4 |

**What each one covers, in one line:**

- **C43550** — a person who only has **access** to one location never sees a Location entry in the
  column-selection list, on any of the six reports. *This is the one the release would otherwise
  ship with nobody testing it.*
- **C43551** — if you switch the Location column off by hand, that choice is remembered next time,
  exactly like every other column choice.
- **C43552** — with two spreadsheet download options instead of one, both files hold the technician
  rows and the Summary row and neither holds per-day rows. *The second piece of real new coverage.*
- **C43553** — a logo that **is** set but whose picture will not load falls back to the built-in
  ShopView logo, while **no** uploaded logo means **no** logo at all. **No case on any report tested
  the middle branch before this one.**

---

## 2 · WERE THE ON-SCREEN LABELS CONFIRMED LIVE? — NO, AND THAT IS STATED ON THE RECORD

**No live observation was made this pass.** The QA branch redeployed this morning —
**`v3.5-16cf83f`**, `last-modified` Wed 05 Aug 2026 06:40:32 GMT, etag
`177c59546701e7810b894492dabc1423`, up from `v3.4.1-3d03023` on 4 August — and our sign-in died with
it (`GET /api/auth/me` → **HTTP 401 `sso_required`**), which is exactly what a deploy does to these
sessions.

**So where did every label in these four cases come from?** From our **own earlier live captures**,
reused rather than invented — and named here so anyone can check:

| Label used | Where it was captured live | Which existing case holds it |
|---|---|---|
| The column-selection control is *"a separate control next to the overflow menu"* and hovering it reads *"Column Selection."* | live, 3–4 August | SBC-COL-01 = [C30156](https://shopview.testrail.io/index.php?/cases/view/30156) |
| The download menu is a **three-dot** button sitting **leftmost** in the toolbar's action cluster | live, 3–4 August | TU-EXP-01 = [C30434](https://shopview.testrail.io/index.php?/cases/view/30434) |
| The spreadsheet quotes any value containing a comma, e.g. `"$1,234.50"` | live, 3–4 August | TU-EXP-03 = [C30436](https://shopview.testrail.io/index.php?/cases/view/30436) |
| The logo sits **top-right** of the printable header, scaled without distortion | live, 3–4 August | SBC-EXP-10 = [C30168](https://shopview.testrail.io/index.php?/cases/view/30168) |
| The six report names as they read in the navigation | live, 3–4 August | the six `— Access & Navigation` cases |

**Nothing was invented, and nothing unconfirmable was asserted as a label.** Where a name genuinely
does not exist yet, the case says so instead of guessing — **C43552 step 2 and expected item 5 tell
the tester to WRITE DOWN the file names**, because names for two separate spreadsheet files have
never been written down anywhere and inventing a pair would have been a fabrication (Rule 12).

**Every one of the four ends with the words *"It has not been checked on a build yet."***

---

## 3 · THE PROVENANCE LINE — basis versus confirmation, told honestly

Chris's answer sheet is now the newest authoritative product source and **all six descriptions lag
it** — verified live today: Sales By Customer **13**, Sales By Representative **15**, Parts Velocity
**4**, Technician Utilization **5**, Work In Progress **6**, Inventory Value **3**, not one moved.
He authorised testing to his answers rather than to the documents (item T3-2 = **A**). So under
Standing Rule 54 every one of the four names **his file, with its link**, and **none of them claims
plain specification agreement**.

**But the four are not all the same shape, and pretending they were would be the dishonest part:**

| Case | His file is… | What the line says, and why |
|---|---|---|
| **C43550** | **THE SOLE BASIS** | *"Nothing in the Sales By Customer report specification version 13 covers this, so his answers are the only basis for it."* His rule is brand new; there is no anchor to agree or disagree with |
| **C43551** | **the reason the case exists**, but the expectation comes from the **specification** | The line leads with **WIP version 6 (S8-R7)** — the written rule that column choices are remembered — then says his decision *"is what makes Location a column you can switch on and off at all, and it does not say whether that choice is remembered"*. **The derivation is declared, not hidden** |
| **C43552** | **the reason the case exists**; the content comes from the **specification** | The line leads with **TU version 5 (S7-R7)**, then states plainly: *"That his answer leaves the menu with four options is our reading of his words and he has not confirmed it"* |
| **C43553** | **THE SOLE BASIS for the new branch**, and it **CONTRADICTS** the specification | The line quotes his words in full, then: *"This DIFFERS from the Sales By Customer report specification version 13 (S15-R17), which shows the built-in ShopView logo when no logo has been uploaded rather than when an uploaded one fails to load, and we have taken his newer decision as the one that prevails."* |

**The C43553 divergence, with both texts side by side** (Rule 45(e)) — this is a real reversal, not
a wording nicety:

| Sales By Customer specification v13, **S15-R17**, verbatim | Chris Ward, 2026-08-05, verbatim |
|---|---|
| *"The logo is chosen in this order: (1) the organization's uploaded logo; (2) the bundled ShopView logo when none is uploaded; (3) no logo."* | *"Use the company's own uploaded logo. If a logo is set but fails to load, fall back to the built-in ShopView logo. If no logo is uploaded, print no logo and let the text fill the space."* |

**The trigger for the built-in logo has moved** — the specification fires it when **nothing is
uploaded**; Chris fires it when **something is uploaded but broken**, and prints **no logo** in the
case the specification covers with the built-in one. Steps 2, 3 and 4 of C43553 walk exactly those
three states in order.

### Every one is on HOLD, and each says why in plain words

The QA lead's marker goes **last**, after the provenance line, with a blank line before it. All four
read **`AUTOMATION: HOLD`** with a plain reason, because **a brand-new case nobody has ever run is
not fit to automate** — an automated test written from a document and never executed by a human
encodes our reading of the document, and if the reading is wrong the automation makes it permanent.
On top of that:

| Case | The HOLD reason on the case |
|---|---|
| C43550 | *"nobody has run this test yet, and it needs a sign-in that has access to exactly one location."* |
| C43551 | *"…and the product owner has not confirmed that a hand-made Location choice is remembered."* |
| C43552 | *"the build does not offer two spreadsheet options yet, and the product owner has not confirmed that it should."* |
| C43553 | *"…and it needs an organization whose logo is set but will not load, which a tester cannot always produce."* |

**Note for the record:** this marker does not yet exist anywhere else in the suite — counted before
writing, **0 of 474** live cases carried `AUTOMATION: READY` or `AUTOMATION: HOLD`. These four are
the first.

---

## 4 · N2 — NOT AUTHORED, AND WHY THAT IS THE RIGHT ANSWER

**The gap:** *a person with access to several locations who has selected only one — is the Location
entry offered in the column list so they can switch it on by hand?*

**It cannot be authored, because Chris's own answer says both yes and no.** His words:

```
The location column
selector should still be toggleable
from the column selector
list for the user, if the above
is satisfied (note - the column
selector for locations
should not appear if the user
doesn't satisfy #1 above.
```

*"if the above is satisfied"* reads as needing **both** his conditions — access to several **and**
several selected — which for this person means **no switch**. But his own bracket removes the switch
only when someone lacks **access** to several, which for this same person means **yes, they get
it**. **The two sentences describe the same person differently**, and it is a common person, not an
edge case.

**Writing either answer would be inventing a requirement** (Rules 1 and 12), and automating it later
would make the invention permanent. Our delta paper had already told the QA lead this before he gave
his go-ahead — *"Cannot be authored until he clears the ambiguity"* — so authoring 4 of 5 is the set
he approved, not a shortfall against it.

**One sentence from Chris unblocks it.** It also unblocks developer ticket B4 (see the Task C paper).

---

## 5 · ⚠️ THE MOST IMPORTANT THING THIS PASS FOUND — two more live cases his answers make wrong

**This is not part of the authorised work. It was found while checking that the new cases would not
contradict existing ones (Standing Rule 28), and it is reported rather than fixed.**

Our delta paper named **seven** cases that Chris's answers make wrong and that nobody had frozen or
staged. **There are at least NINE.** A sweep of all 474 live cases for claims that Location is *not*
in the column selector found two more, and **neither is in the 46 staged edits and neither is in the
seven**:

| Case | Section | What it says today, verbatim | Why his answer breaks it |
|---|---|---|---|
| **SBC-COL-01** = [C30156](https://shopview.testrail.io/index.php?/cases/view/30156) | SBC — Column Selector | *"5. Note for the tester: there is no Location toggle in this panel. **That is correct** - the Location column appears by itself when you have more than one location in scope, so it is never something you switch on here."* | His **C2** says Location **is** in the selector when the conditions are met. The note does not merely omit the new rule — it actively tells the tester the opposite **is correct** |
| **SBR-COL-01** = [C30265](https://shopview.testrail.io/index.php?/cases/view/30265) | SBR — Column Selector | *"5. Note for the tester: if you have more than one location in scope you will also see a Location column on the table that is in neither list. **That is correct** - it appears by itself and is not something you can switch on or off here."* | Same |

**And both also close a list that his answer re-opens** (Standing Rule 42): C30156 expected item 3
enumerates *"nine toggles, in order"* and C30265 items 1 and 3 close a seven-toggle list and a
five-always-on list. If a Location entry now appears for a multi-location person, those closed lists
are wrong for exactly the people the reports are built for.

**Both cases' `refs` carry the same claim as a stated fact** — C30156: *"Location is automatic and
never a toggle"*; C30265: *"Location is automatic and in neither list"*.

**Why this matters more than it looks:** these two sit **directly beside** the new case C43550 in the
same two Column Selector sections. A tester reading them together gets opposite instructions. Under
Rule 28 a suite should not ship with an unresolved contradiction — but **editing them is authorised
by neither of my instructions** (they are not among the 46, and Task A and B do not reach them), so
they are named here as an **ask** and nothing was touched. **C43550's own wording states Chris's rule
plainly, so the disagreement is visible rather than buried.**

---

## 6 · RULE-4, RULE-20 AND TITLE CHECKS

| Check | Result |
|---|---|
| **Rule 4 — API content in an API-titled section** | **PASS.** All four were scanned for API endpoints, HTTP verbs and status codes: **0 tokens found** in any precondition, step or expected result. All four sit in functional (non-API) sections, correctly |
| **Rule 20 — `refs` carries ticket AND spec anchor** | **PASS.** C43550 `SV-8611 (SBC spec v13 … S13-R4 with S4-R12; …)` · C43551 `SV-8664 (WIP spec v6 … S8-R7 …)` · C43552 `SV-8654 (TU spec v5 … S7-R7 …)` · C43553 `SV-8613 (SBC spec v13 … S15-R17 and S15-R18 …)`. Every one names the exact story key **and** the requirement anchor, and each also records that Chris's answer is the basis |
| **`refs` length limit** | **PASS.** Every entry is comma-free and ≤ 248 characters, checked before the write. House style followed |
| **Title ≤ 80 characters** | **PASS** — 68 · 70 · 68 · 68 |
| **Numbered preconditions / steps / expected with line breaks** | **PASS** on all four |
| **`custom_atmstatus: 3` + `custom_automation_type: 0`** | **PASS** — set and byte-verified on all four |
| **No jargon, no ticket ids, no §-anchors in tester-facing text** | **PASS**, with the two authorised Rule-54 exceptions: the requirement reference and the source link in the provenance line |

---

## 7 · VERIFICATION (Standing Rule 50 — exhaustive, then exact)

| Op | Operation | Result | HTTP | Verification |
|---:|---|---|---:|---|
| 4 | `add_case` → section 4299 | **C43550** SBC-COL-03 | **200** | **MATCH** — 10 intended fields byte-equal to the intended payload + `section_id` confirmed; 30 fields present on the re-GET; 0 mismatch |
| 5 | `add_case` → section 4359 | **C43551** WIP-PERS-05 | **200** | **MATCH** — same, 0 mismatch |
| 6 | `add_case` → section 4346 | **C43552** TU-EXP-10 | **200** | **MATCH** — same, 0 mismatch |
| 7 | `add_case` → section 4300 | **C43553** SBC-EXP-17 | **200** | **MATCH** — same, 0 mismatch |

- Fields verified per case, **every one, no sampling:** `title` · `template_id` · `type_id` ·
  `priority_id` · `refs` · `custom_atmstatus` · `custom_automation_type` · `custom_preconds` ·
  `custom_steps` · `custom_expected` · `section_id`.
- **`refs` compared under the one declared server transformation** —
  `','.join(p.strip() for p in s.split(','))`. Declared here as required.
- **0 update · 0 delete · 0 section · 0 run writes** in this task.
- Full post-create bodies retained as evidence.
- **On any mismatch the create would have been treated as FAILED and the batch stopped.** None
  occurred.

---

## 8 · A DEFECT IN OUR OWN WORKING DATA — stated, not quietly worked around

**`build/report-suite/specs/*.md` is a STALE baseline and it is sitting in the obvious place a
future pass will look.** Its own header says *"ingested 2026-07-22 … from the exported `.doc`"*,
and the live Sales By Customer page is now **version 13 (2026-07-31)**. Compared against the live
page body today, that mirror is **missing** requirements `S4-R12`, `S4-R12a`, `S4-R13` and `S20-R19`
— the **Location column requirements**, which are the very heart of everything Chris answered — and
its Story 15 numbering is **shifted by three** (it calls the logo chain `S15-R14`; live calls it
`S15-R17`).

**The current mirror does exist** — `spec-current-2026-07-31/*-current.md` — and it is faithful:
all four missing anchors are present and its `S15-R17` matches the live text exactly.

**I read the stale one first.** Every anchor quoted in the Task A paper was then **re-verified
against the current mirror and against the live Confluence body**, and all of them turned out
identical in both, so **no Task A conclusion changed**. But the trap is real and it nearly bit: the
two directories look equally authoritative and only one is.

**The ask:** either refresh or clearly mark `build/report-suite/specs/` as superseded. I have not
touched it — spec mirrors are owned by the spec-currency passes, not by this one.

---

## 9 · OUTSTANDING — what I need from you

1. **One sentence from Chris on the location column** (his gap U1): for someone who can reach
   several locations but has selected only one, is the Location option offered in the column list?
   This unblocks **N2** and **developer ticket B4**.
2. **Your go-ahead to correct SBC-COL-01 = [C30156](https://shopview.testrail.io/index.php?/cases/view/30156)
   and SBR-COL-01 = [C30265](https://shopview.testrail.io/index.php?/cases/view/30265).** Both
   currently tell the tester that the *old* behaviour *"is correct"*, and both close a toggle list
   that Chris's answer re-opens. **This is the sharpest live risk on the suite that nothing is
   covering.**
3. **A word from Chris on the Technician Utilization menu count** — four options or three? C43552's
   whole premise is our reading of *"bring it into line with"*.
4. **Fresh sign-in for the QA branch** — it redeployed to `v3.5-16cf83f` this morning, so all four
   new cases are unverified and every earlier verdict is now two builds old.
5. **A decision on whether C43550 and C43553 should be split per report.** Each is deliberately
   **one** case walking all six reports, because the setup is the expensive part and six
   near-identical cases would be the exact duplication our own quality audit hunts. If you would
   rather have six of each, say so and it is a small job.
