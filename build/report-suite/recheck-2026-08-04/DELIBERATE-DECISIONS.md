# DELIBERATE-DECISIONS register — Report Suite re-check on `v3.4.1-3d03023` · 2026-08-04

Standing Rule 46. Every deliberate non-action is written down **with its evidence and a plain
one-sentence answer**, before anyone asks. An undocumented deliberate omission is indistinguishable
from a miss.

---

## D1 · `MG-WIP-TOTAL-PINNED` — the merge is **DECLINED**. Not an omission. · RISK: **LOW**

**Plain answer:** we were asked to fold one Work In Progress case into another and we are deliberately
not doing it, because they test two different things and one of them would stop being tested.

**The decision:** **do not** absorb **WIP-VIS-03 =
[C30521](https://shopview.testrail.io/index.php?/cases/view/30521)** into **WIP-TOT-01 =
[C30494](https://shopview.testrail.io/index.php?/cases/view/30494)**. Both stay live and unchanged.

**Who decided:** the **QA lead**, on **2026-08-04**, in the brief for this pass — verbatim:
*"`MG-WIP-TOTAL-PINNED` (C30521 → C30494): **DECLINED.** Your predecessor's reasoning is sound —
different anchors, a column versus a row, and C30521 is the only WIP case covering the Total column
under sideways scroll. **Do not merge them.**"*
This **closes** the open question left in
`../final-push-2026-08-04/DELIBERATE-DECISIONS.md` D11, which had recorded the recommendation and
said *"Who closes it: the QA lead, with a yes or no."* **He has now said no.**

**The evidence behind the decline** (re-derived from scratch, not inherited):

| Reason | Evidence |
|---|---|
| **Different requirements** | C30521 cites Story 4 `S4-R22` and Story 10 `S10-R3`; C30494 cites Story 6 `S6-R1`, `S6-R4`, `S6-R5`. Coupling one case to two unrelated anchors is exactly what Rule 42 exists to prevent. |
| **Different observables — a column, not a row** | C30521: *"The Total **column** … stays fixed to the right edge while the rest of the columns scroll underneath."* C30494's title names a **Totals row**. Merging breaks the title-vs-expected check Rule 28 requires. |
| **Every other report keeps it standalone** | Sales By Customer [C30154](https://shopview.testrail.io/index.php?/cases/view/30154) · Sales By Representative [C30237](https://shopview.testrail.io/index.php?/cases/view/30237) · Inventory Value [C30553](https://shopview.testrail.io/index.php?/cases/view/30553). Merging would leave Work In Progress the only report of six without one. |
| **It is load-bearing** | A sweep of all 469 cases found **C30521 is the only Work In Progress case covering the Total column under sideways scroll** — C30522 covers the Totals *row* under *vertical* scroll, which is a different behaviour. |

**Consequence for the count, stated so nobody re-derives it:** the audit's *"468 recommended"*
assumed 10 removals. With **9 executed and this one declined**, the honest figure is **469 — exactly
what is live.** The un-executed plan row is therefore **explained, not outstanding.**
**Who closes it:** **closed** by the QA lead's ruling above.

---

## D2 · The columns/ordering defect was **NOT filed** — a duplicate already exists · RISK: **MEDIUM**

**Plain answer:** the problem is real and still happening, but a ticket for it already exists, so we
did not raise a second one — it needs re-opening rather than duplicating.

**The instruction** (QA lead, 2026-08-04, this pass's brief): *"The columns ticket: **FILE IT.** … **Search
Jira for duplicates first** … **and do not file if one exists — report instead.**"*

**A duplicate exists, and it is an exact one.** **[SV-8823](https://shopview.atlassian.net/browse/SV-8823)** —
*"Inventory Value spreadsheet: money arrives as text, **and the file ignores the chosen columns and
re-orders them**"*. Its summary already names **both halves**. Live status read this run:
**OBSOLETE / Done / priority Low / parent SV-8582**.

**So, following the instruction as written, nothing was filed.** Searches run (`/rest/api/3/search/jql`;
`/rest/api/3/search` is HTTP 410): columns-and-export wording · every `Inventory Value` issue · every
Bug under epic SV-8582. **SV-8823 was the only match on the columns behaviour**; the other hits
(SV-8155, SV-8009, SV-7550, SV-7134, SV-6715, SV-6081, SV-5455) are unrelated older export requests.

**The behaviour is re-confirmed on the new build**, so this is not a stale finding
(`evidence/ruling3/columns-param-sha256.json`): three exports of the same scope — no `columns`
parameter, `columns=part_number,description,qty`, and `columns=zzz_nonsense_column` — all return
**HTTP 200** and a **byte-identical file**, SHA-256 `15a811e72ff5f52b687a49dd233e19299d31764069a8a09ed290b337fe492187`.
All twelve columns come back whatever is asked for, an invalid column name raises **no** validation
error, and the file's order still differs from the screen (`Total Cost` is **last on screen** but
**9th of 12 in the file**).

**Why this is user-facing, so Rule 51's API gate does not apply:** a user picks columns in the Column
Selection panel, presses Download, and gets a file with columns they did not ask for in an order that
does not match what they were looking at. **No endpoint call is needed to see it.**

**Why SV-8823's closure does not settle it:** the QA lead's closing condition was explicitly about the
money half — *"Money arrives as text if that still shows the amount in number and that amount is
correct then its good to stay closed."* He was not asked about, and did not rule on, the columns.
Treating the closure as covering both would put a decision in his mouth.

**Who closes it:** **the QA lead**, with one of two words: **re-open SV-8823** (scoped to the columns
half), or **authorise a new ticket** split out of it. **We will not file a duplicate on our own
initiative, and we will not silently drop the finding.**

---

## D3 · Three cases still carry a "known issue" line for defects that remain open · RISK: **LOW**

**Plain answer:** two of the three reported defects are still broken on the new build, so their
warning lines correctly stay on the cases.

**SV-8818** (PDF download fails at scale) and **SV-8820** (Inventory Value values stock one day late)
were both **re-confirmed reproducible** this run, and both are **Open** in Jira. Their cases keep the
line unchanged. **SV-8819** is a different matter — see D4.
**Who closes it:** the developers, by fixing them.

---

## D4 · SV-8819 is fixed, and its "known issue" line was **REMOVED** · RISK: **LOW**

**Plain answer:** the Turns/Yr bug is genuinely fixed, so the sentence telling testers to ignore it has
been taken off both affected cases — but the Jira ticket is still Open and needs closing by someone else.

**The authorisation is explicit** — the QA lead's brief for this pass, verbatim: *"**If any is now
FIXED, that is important**: the case should pass, and its **'known issue / filed for a fix' line must
come off**."* So this is an instructed change, not our initiative.

**We proved both cases pass BEFORE removing anything** (`evidence/sv8819-case-verification.json`), because
removing a warning from a case that still fails would be worse than leaving it:

| Case | Its assertion | Verified how | Result |
|---|---|---|---|
| **PV-CALC-16 = [C30374](https://shopview.testrail.io/index.php?/cases/view/30374)** | *"the whole-day span **inclusive of BOTH** the start and end dates"* | `This Year` vs the same dates by hand; and 2025 full year | **216 = 216** and **365 = 365** — TRUE |
| **PV-CALC-09 = [C30367](https://shopview.testrail.io/index.php?/cases/view/30367)** | the formula; `0.00` at zero stock; a negative value with a leading minus | recomputed over **500 rows** | **0 formula mismatches** on every positive-stock row · **57** zero-stock rows all `0` · one genuine negative (`B3157 = -0.1689814814`) |

**A new observation this produced, recorded rather than filed:** Turns/Yr is also floored to `0` when
stock is **negative** (6 rows, e.g. `Fuel` at `-5,137` on hand). That is sensible and **no case asserts
otherwise**, so it is **not** a defect claim — it is written here so the next pass does not rediscover it
as an anomaly. It was, briefly, exactly that: it showed up as "6 formula mismatches" until the negative
stock explained it.

**⚠️ THE ONE THING STILL OWED BY SOMEONE ELSE:** **[SV-8819](https://shopview.atlassian.net/browse/SV-8819)
is still `Open` in Jira** (read live this run) while the build no longer has the fault. **Jira and the
build now disagree.** We did not change the ticket — priority and status are the QA lead's to move
(Rules 6 and 53).
**Who closes it:** **the QA lead / the developers**, by moving SV-8819 to a resolved status.

## D5 · The single-location Location filter is still not definitively settled · RISK: **LOW**

**Plain answer:** we proved the downloaded file behaves correctly, but proving what the *filter* does
for a genuinely single-location user needs a user account restricted to one location, which we did not
create.

The server-side half **is** settled: at single-location scope the file has **no Location column** on
all five reports that gate it. The screen half is not, because scoping the *active workplace* does not
make the signed-in user a *single-location user* — they still have access to both, which is why the
filter still offers "All locations". **We are labelling this rather than claiming it** (Rule 12).
**Who closes it:** a live check with a staff member whose access is restricted to one location — or
Chris Ward's pending ruling, which would make the question moot.

---

## D6 · The Rule-54 provenance line now names the build, which is a wording change · RISK: **LOW**

**Plain answer:** the line used to say only "the build tested on 8/4/2026", and two different builds
existed on that date — so we added the build's name to it.

Two builds shipped on 2026-08-04 (`v3.4.1-0ed4433` and `v3.4.1-3d03023`), and the re-check queue
itself flagged that the date alone had become ambiguous. **Standing Rule 49 obligation (3) requires
the build marker to live on the case, and names Rule 54 as the mechanism** — so the marker was missing
against Rule 49, not added on a whim. The line now reads *"…as per the build tested on 8/4/2026
(build v3.4.1-3d03023), and as per …"*. The stamper is **idempotent** — it replaces an existing
`(build …)` clause and never appends a second.
**Who closes it:** closed; flagged here only because it changes tester-facing text on all 469 cases.
