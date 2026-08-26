# Report Suite — approved write pass — 2026-08-26 — RESULT

**182 distinct cases written. Every write byte-verified by re-GET (Rule 50). No `add_case`, no `delete_case`, no run writes.**

Per-operation logs: `logs/`. Gate 0 evidence: `AUTOMATED-EXCLUSIONS.md` + `logs/gate0.log`.

| Group | Approved | Automated-excluded | Written & byte-verified | Held, not written |
|---|---|---|---|---|
| A — content rewrite | 15 | 2 | **10** | 3 (content already current → re-pinned instead) |
| B — add version pin | 10 | 1 | **8** (7 pinned + 1 rewritten) | 1 (C30491, Rule 58) |
| C — re-pin | 256 | 39 | **163** | 54 |
| D — format | 102 | 5 | **3** | 96 (premise disproven) |
| E — add marker | 13 | 9 | **0** | 4 (already marked) |

## Group A — the 15 named cases

Rewritten to the CURRENT spec and byte-verified (Rule 41 — the whole case was re-read, not just
the changed field):

| C-id | Report | What was superseded | Link |
|---|---|---|---|
| C30218 | SBR | Asserted a 13-column row layout; live v24 has 14 (Shop Supplies added) | https://shopview.testrail.io/index.php?/cases/view/30218 |
| C30234 | SBR | Subtotal formula omitted Shop Supplies; label list omitted it too | https://shopview.testrail.io/index.php?/cases/view/30234 |
| C30241 | SBR | Title and body said nine sortable financial columns; live v24 lists ten | https://shopview.testrail.io/index.php?/cases/view/30241 |
| C43828 | SBR | Said Adjustments sits between Parts Margin and Margin; Shop Supplies now sits between them | https://shopview.testrail.io/index.php?/cases/view/43828 |
| C43830 | SBR | Row tie-out omitted Shop Supplies from Subtotal | https://shopview.testrail.io/index.php?/cases/view/43830 |
| C30470 | WIP | Asserted a two-line Asset cell (Unit # over VIN); live v28 is single-line Unit # only | https://shopview.testrail.io/index.php?/cases/view/30470 |
| C30482 | WIP | Money-column list omitted Adjustments; v28 S2-R4 now allows a second Estimates row | https://shopview.testrail.io/index.php?/cases/view/30482 |
| C30525 | WIP | Named "the two-line asset cell"; live v28 names the single-line Asset cell | https://shopview.testrail.io/index.php?/cases/view/30525 |
| C30597 | IV | Said "the date-range control"; live v10 has a single "as of" date control | https://shopview.testrail.io/index.php?/cases/view/30597 |
| C30610 | IV | Asserted a separate "As of" indicator; v10 moves it inside the date control | https://shopview.testrail.io/index.php?/cases/view/30610 |

**Excluded as Automated (Rule 71):** C30287, C30518.

**NOT rewritten — content re-read and found already current, so they were re-pinned instead:**
C30474, C30512, C43820. Only whitespace inside a money-format example (`" $1,234.56"` → `"$1,234.56"`,
which these cases already stated the new way) and a context-note rewording moved in the spec.

### The committed stale-classifier under-reports — 6 false negatives in these 15

`reports/*-stale.json` marked **C30234, C30241, C43828, C43830, C30470 and C30525 as "false alarm"**.
They are genuinely stale. The classifier only flags a case that still REPEATS wording the spec has
REMOVED; a case superseded by an INSERTION (Shop Supplies added to a formula, a column count going
from nine to ten) repeats nothing retired and reads as clean. It also reported WIP as **0 stale**
while 2 of its cases were stale. Every verdict above comes from reading the case against the live
anchor text, not from the classifier.

It also found one genuinely stale case that is **not in the approved list and was therefore not
touched**: **C30536** (https://shopview.testrail.io/index.php?/cases/view/30536) — "First visit defaults to today and the active location" still asserts
the v6 default of the current calendar month date range; live v10 defaults to an "as of" date of today.

## Group B — 10 WIP cases with no version pin

8 of the 9 non-Automated cases cite **no spec anchor at all**, so the committed anchor-diff could not
clear them; each was read against live WIP v28 Story 5 directly.

- **Pinned to v28 (content confirmed to match):** C30487, C30489, C30490, C30493, C30520, C30524, C43818
- **C43838 rewritten instead** — it carried "the design review says amber but the build renders
  violet" as an OPEN design-vs-build question. Live v28 S5-R14 states the highlight is a soft violet
  fill and ring, resolving it in the build's favour. The case now states violet and asks nobody to
  raise it. Title also changed off the "(amber)" wording.
- **C30491 HELD, not pinned (Rule 58).** Live S5-R8 adds "including their work-order-level adjustments
  so the figure matches the estimate document the customer sees", which the case does not state, and
  the spec is internally inconsistent here: S5-R8 says "total quoted value of the jobs in the Estimates
  tab" while the S5-R12 tooltip says "all estimate lines that have not yet been approved", and S5-R9
  still uses the retired names Total Earned / Total Remaining. An ambiguous source is not resolved
  against the build — this needs a PO answer.
- **C30488** excluded as Automated.

## Group C — re-pins

**163 written.** Scope was deliberately narrowed to cases that are *provably* content-current:
each cites at least one spec anchor and **none of its cited anchors changed** between the held and
the live spec body. Each write bumps only the cited version and appends one sentence recording the
26 August re-check. A reverse-transform guard required an exact byte reconstruction of the original
before any case was sent, so no case could be altered beyond those two edits.

**54 writable cases were deliberately NOT re-pinned:**

| Why held | Count | C-ids |
|---|---|---|
| Cites a CHANGED anchor; cleared only by the lexical classifier, which is proven to under-report | 25 | C30345, C30348, C30365, C30366, C30368, C30369, C30370, C30371, C38924, C30381, C30382, C30455, C30459, C30464, C30485, C30501, C30502, C38916, C43551, C38918, C43836, C30528, C30530, C30531, C30533 |
| Cites ZERO spec anchors, so the diff cannot prove currency | 9 | C30235, C30236, C43839, C43547, C43592, C43593, C43594, C43821, C30526 |
| Content current, but the Expected field is multi-block and any write restructures it (see below) | 20 | C30195, C30206, C30208, C30213, C38913, C30226, C30229, C30230, C30231, C30233, C38894, C30237, C30238, C30325, C30475, C30476, C30477, C30478, C30479, C30480 |

Re-pinning any of these would risk recreating exactly the fault this pass exists to fix — a case
stamped with a version nobody read it against.

## Group D — format

**Done:** 2 over-length titles shortened by a TITLE-ONLY write, leaving their multi-block bodies
untouched (C30226 81→75, C30230 82→69); C30470's 87-char title was fixed inside Group A.
C43546 rewritten in plain words — the bare HTTP jargon is gone, but the response number is kept and
explained, because the case instructs the tester to read it in the Network panel and would be
unperformable without it.

**NOT DONE — 50 `raw-list-markup` + 46 `no-blank-line-before-marker`: the premise is disproven.**

The format check reasoned that the fields are `format: markdown`, so stored HTML displays literally.
Direct probe says otherwise: **this TestRail stores HTML and converts submitted plain text INTO it.**
Send `1. a\n2. b` and it comes back `<p>1. a\n2. b</p>`. The `<ol>/<li>/<p>/<hr>` in those 50 cases is
TestRail's own storage markup, not author error, so rewriting them to plain text would damage working
cases. Two further consequences worth his attention:

- the 46 "no blank line before the marker" cases are the same false positive — their marker sits in
  its own `<p>`, which renders as a separated block;
- the inverse worry is the real one: cases stored as **bare plain text** with `\n` line breaks would
  render as one run-on paragraph. That is an inference from the field format, **not observed**, and
  needs one look at a case in the TestRail UI to settle.

## Group E — the 13 markerless cases

**Zero writes, and that is the correct outcome.** All 13 already carry a Rule-69 marker,
`AUTOMATION: Not available on Build to test Yet - Last checked <date>`. The format checker reports
them as markerless only because it recognises the three canonical literals. Writing
`AUTOMATION: READY` over that would have destroyed the not-built signal and wrongly added them to
the ready-to-automate figure, which the conventions say excludes NOT-BUILT cases. 9 of the 13 are
Automated in any case. Whether to normalise that wording to a canonical literal is a convention
decision for the QA lead.

## Two durable TestRail facts established this pass

Both proven by probe and recorded in `htmlfmt.py`:

1. **The API sanitiser keeps only ONE top-level block.** Given two or more it relocates the first
   closing tag to the very end and nests everything inside it — `<ol>…</ol><hr><p>prov</p>` comes
   back as `<ol>…<hr><p>prov</p></ol>`. Only a single top-level block round-trips byte-identically.
   **Any write to a multi-block case silently restructures its body.** That is why the multi-block
   cases above were held rather than re-pinned.
2. **Fields omitted from `update_case` are preserved byte-identically** — they are NOT re-rendered.
   The standing write rule ("send all four text fields, TestRail re-renders any field you omit") is
   not true on this instance, and following it is what would restructure multi-block bodies.
   Surgical single-field edits are safe and were used for the title and re-pin writes.

It also normalises non-ASCII to named entities (`—` → `&mdash;`) and appends a trailing newline;
both are handled in `htmlfmt.ent()` so byte-verification is exact.

## OUTSTANDING — what I need from you

1. **The 45 Automated cases** (`AUTOMATED-EXCLUSIONS.md`) — read-assessed, none touched. Per-case
   go-ahead needed. The 2 that matter most are C30287 and C30518: both assert superseded
   expectations right now.
2. **C30536** — genuinely stale, not in the approved list, not touched. May I rewrite it?
3. **C30491** — held on a PO question: does the Estimates figure include work-order-level
   adjustments (S5-R8), and which wording governs when S5-R8, the S5-R12 tooltip and S5-R9 disagree?
4. **The 54 held Group C cases** — I can assess the 25 impacted ones by reading each against its
   changed anchor (that is what caught the 6 false negatives). Want me to?
5. **The 20 multi-block Group C cases** — re-pinning them means reformatting the whole body into a
   single block. Cosmetic-only reason. Approve, or leave them stale-pinned?
6. **One look at a case in the TestRail UI** to settle whether stored HTML renders or displays
   literally. That single observation decides the fate of the 96 untouched Group D cases.
7. **Group E wording** — leave the Rule-69 marker as is, or normalise it to a canonical literal?

