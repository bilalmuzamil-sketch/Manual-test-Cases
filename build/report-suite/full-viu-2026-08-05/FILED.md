# FILED — Report Suite, 2026-08-05

## Nothing was filed this pass. Here is why, item by item.

**Standing Rule 52** requires a defect to be a `Story Defect` parented to the **owning story** with the
story also linked `relates to`, priority **Low**, and no Product Area field. **Standing Rule 53** requires
priority Low. Both are satisfiable — I simply reached the end of the session with one candidate properly
established and chose to report it rather than file it half-checked.

### Candidate 1 — the one that deserves a ticket

**Export money, dates and percentages arrive formatted as text on Sales By Customer and Sales By
Representative, where both specifications require plain numbers.**

- **Observed live** on `v3.5-16cf83f`: the SBC Summary CSV emits `$1,979.40`, `100.0%` and `Jul 31 2026`;
  the SBR Expanded CSV emits `$1,979.40`, `100.0%` and `Jul 31 2026`.
- **The documents say otherwise, plainly.** SBC v15 **S14-R9** ("a plain number to one decimal with no
  percent sign"), **S14-R10** ("Dates export as mm-dd-yyyy — for example, 05-14-2026"), **S14-R11**
  ("Currency values export as plain numbers with no dollar sign and no thousands separators"). SBR v17
  **S14-R17** ("numeric columns are emitted as plain numbers for re-pivoting — no currency symbol,
  thousands separators, or parentheses … Margin % is a number to one decimal").
- **Duplicate search performed:** I read **SV-8823** live. Its summary and description name **Inventory
  Value only** — *"Two things, both in the Inventory Value spreadsheet download."* It does **not** cover
  Sales By Customer or Sales By Representative. I did not run a JQL sweep for other candidates, and that
  is the gap that stopped me filing.
- **Exact test data, by its on-screen name** (Rule 50): customer **Beman Systems**, invoice **S-15826**,
  rep **Parth Fadadu**, location **Staging Heavy Duty - 9919**, range **This Quarter** for SBR and
  **Last Month** for SBC, both locations selected. Ruled out: the range is not the variable — the same
  formatting appears at Last Month, Last Quarter and Last Year.
- **Owning stories:** SBC exports story and SBR exports story under epic **SV-8582**. I did not confirm
  the exact story keys live, which is the second reason this is reported rather than filed.

**Recommendation: file it.** It is a real, user-facing, document-backed defect on two reports with no ticket.

### Candidate 2 — SV-8907 is worse than its ticket records

**SV-8907** (Open) says Work In Progress cannot be downloaded. Live it is worse than written: replaying the
product's **own** export request returned **HTTP 500 for both formats on all four tabs**. On the other five
reports the CSV works and only the PDF fails; on Work In Progress **the CSV fails too**.

**Recommendation:** add a comment to SV-8907 rather than file a new ticket. **I did not comment** — that is
a write to another author's ticket and I did not have a ruling for it.

### Candidate 3 — the Location column is implemented three ways out of six

Not filable while the specifications contradict themselves (Standing Rule 58). It is a **question for
Chris Ward**, not a defect, until he rules. See DELIBERATE-DECISIONS.md entry 1.

### Candidate 4 — see API-ASK.md item 1

Reachability not established, so Rule 51 says ask first.
