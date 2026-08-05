# TASK C — the developer tickets

**Report Suite · epic SV-8582 · 2026-08-05**

**The QA lead's authorisation, verbatim:** *"Yes but give me the links of those tickets then"* — so
the links are section 1.

**Outcome in one line:** **three filed, two deliberately not filed** — one because the product owner's
answer contradicts itself, and one because **nobody has ever seen it fail on the build**.

---

## 1 · THE THREE TICKETS FILED — with their links

| # | **Key** | **Link** | What it says | Severity stated |
|---|---|---|---|---|
| **B1** | **SV-8879** | **https://shopview.atlassian.net/browse/SV-8879** | The Location chooser is shown to someone who has access to only one location, on all six reports | Low |
| **B2** | **SV-8880** | **https://shopview.atlassian.net/browse/SV-8880** | The Sales By Representative Summary spreadsheet is missing four columns the screen shows, and adds a Totals row | Medium |
| **B3** | **SV-8881** | **https://shopview.atlassian.net/browse/SV-8881** | The Technician Utilization download menu drops the word *Download* from all four options | Low |

**Every one of the three:** type **Bug** · priority **Low** · parent **SV-8582** (the epic) · owning
story linked with **Relates** · Product Area **Reports & Dashboards** · labels `reports-suite`,
`qa-found` · status **Open**.

---

## 2 · THE TWO NOT FILED, AND PRECISELY WHY

### B4 — the location column on Work In Progress and Inventory Value · BLOCKED ON CHRIS

His own answer points two ways about the same person:

- *"The location column selector should still be toggleable from the column selector list for the
  user, **if the above is satisfied**"* — reads as needing **both** his conditions (access to several
  **and** several selected), so somebody with access to several who has picked one gets **no** switch.
- *"(note - the column selector for locations should not appear **if the user doesn't satisfy #1**
  above.)"* — removes the switch only for people who lack **access** to several, so that same person
  **does** get it.

**We cannot write a correct "expected behaviour" for a developer while the requirement disagrees with
itself**, and a ticket with the wrong expected behaviour is worse than no ticket — it gets built to.
**One sentence from Chris unblocks it.** A follow-up question is already being prepared by another
worker.

### B5 — the logo fallback · NO LIVE EVIDENCE, AND THAT IS OUR SHORTFALL

**Nobody has ever seen this fail on the build.** Everything we hold is a **document reading**: three of
our cases assert that a missing logo falls back to the built-in one, and they assert it because the
Sales By Customer description says so at `S15-R17` — the very sentence Chris has now overruled.

**Our own live records say the state was never produced.** Both quotes verbatim:

> "the PDF logo fallback could not be exercised because **this organisation has an uploaded logo**"
> — `viu-2026-08-03/batch-pv-tu/VERDICTS.md`

> "**This org has no shop logo set**, so the logo-present branch is not observed."
> — `viu-2026-08-03/batch-wip-iv/VERDICTS.md`

One organisation always had a logo; the other never did. **The change-over nobody watched is exactly
what the ticket would have been about.** Filing it would mean telling a developer the product does
something we have not seen it do.

**It needs a live check first, and the check takes two minutes:** remove the organisation's uploaded
logo, download a printable file from any of the six reports, and look at the top right. That is an
ask — and it is also why the new case **SBC-EXP-17 = [C43553](https://shopview.testrail.io/index.php?/cases/view/43553)**
exists and sits on HOLD.

---

## 3 · WHICH OF THE FIVE HAD LIVE EVIDENCE — the honest table

| # | Live evidence? | The observation, and where it is recorded |
|---|---|---|
| **B1** | **YES** | `evidence/singleloc-matrix.json` — build `v3.4.1-0ed4433`, `capturedAt 2026-08-03T18:59:19.110Z`. A genuinely one-workplace subject (`accessibleCount: 1`, *Staging Lethbridge - 4310*) returned **`hasLocationControl: true` on all six reports**. Plus a screenshot showing the chooser on screen for that person |
| **B2** | **YES** | The Summary CSV heading row **captured from the downloaded file**, not retyped: `Representative,Location,"Inv. Hrs","Labor Invoiced","Labor Margin","Parts Invoiced","Parts Margin",Margin,"Margin %",Subtotal` — with `# Invoices`, `# Customers`, `Hrs Worked`, `Hrs Invoiced` absent, and a Totals row at the end |
| **B3** | **YES** | The four menu labels read off the open menu — *"Summary (PDF)", "Summary (CSV)", "Expanded (PDF)", "Expanded (CSV)"* — with the raw capture in `evidence/tu/ui/tu-ui-3.json` (`"clicked": "Summary (CSV)"`) |
| **B4** | **YES, but unusable** | The same `singleloc-matrix.json` shows Inventory Value keeping the Location column at single scope where the other five drop it. **The evidence is fine; the requirement is what is broken** |
| **B5** | **NO** | See section 2. The branch was never observed in the no-logo state |

---

## 4 · DUPLICATE SEARCH — done BEFORE filing

Searched `POST /rest/api/3/search/jql` *(note: `/rest/api/3/search` returns HTTP 410)* across
`project = SV AND issuetype = Bug` with a full-text sweep on each of: **"location filter"**,
**"location chooser"**, **"Sales By Representative export"**, **"summary CSV"**, **"download menu"**,
**"Technician Utilization download"**.

**No duplicate exists for any of the three.** Four near-misses were opened and ruled out, listed so the
assignee can see they were considered:

| Ticket | Why it is not a duplicate |
|---|---|
| **SV-8818** *PDF download fails with a server error…* (Ready to Fix) | A server failure on PDF generation. Nothing to do with a chooser, a spreadsheet's columns, or menu wording |
| **SV-8823** *Inventory Value spreadsheet: money arrives as text, and the file ignores the chosen columns…* (Ready to Fix) | Also about a download, but a **different report** and a **different fault** (formatting and column choice, not four absent columns) |
| **SV-4585** *Technician Efficiency - Download Expanded View Error* (Open) | **Technician Efficiency**, the older report — a different report and a different fault |
| **SV-8435** *Invoice list search/filter does not return expected results* (Done) | The invoice list, not a report's location chooser |

`"location chooser"` returned **0 hits**, which is itself useful: nobody has raised this before.

---

## 5 · VERIFICATION (Standing Rule 50 — exhaustive, then exact)

**Every field of every ticket was read back from Jira after creation and compared. No sampling.**

| Op | Operation | Target | HTTP | Verification |
|---:|---|---|---:|---|
| 8 | `POST /rest/api/2/issue` | **SV-8879** | **201** | **ALL PASS — 11 fields checked and matched:** type Bug · priority Low · severity Low · Product Area *Reports & Dashboards* · parent SV-8582 · exactly one link, `Relates → SV-8603` · labels `qa-found`,`reports-suite` · status Open · project SV · summary byte-equal |
| 9 | `POST /rest/api/3/issueLink` | SV-8879 → SV-8603 | **201** | link read back and confirmed present, and it is the **only** link |
| 10 | `POST /rest/api/3/issue/SV-8879/attachments` | the screenshot | **200** | attachment id `59340`, **size 98237 bytes = source file size, MATCH** |
| 11 | `PUT /rest/api/2/issue/SV-8879` (wiki markup, so the image resolves) | SV-8879 | **204** | **renders inline, verified not assumed:** stored ADF contains a `mediaSingle` › `media` node with the 36-character UUID `774cf1c3-eda1-4781-a7b3-e00137942b08`, **and** the rendered description contains a real `<img src=".../attachment/content/59340">` |
| 12 | `POST /rest/api/2/issue` | **SV-8880** | **201** | **ALL PASS — 11 fields**, severity Medium, `Relates → SV-8631`, only link |
| 13 | `POST /rest/api/3/issueLink` | SV-8880 → SV-8631 | **201** | confirmed, only link |
| 14 | `POST /rest/api/2/issue` | **SV-8881** | **201** | **ALL PASS — 11 fields**, severity Low, `Relates → SV-8654`, only link |
| 15 | `POST /rest/api/3/issueLink` | SV-8881 → SV-8654 | **201** | confirmed, only link |

**Format gates, machine-checked on all three descriptions after filing:**

| Gate | Result |
|---|---|
| All **seven** required sections present, in order | **7/7 on all three** |
| **No** reference to our test cases — no "QA test cases affected", no internal ids, no C-ids, no TestRail links | **0 hits on all three** |
| **No** "this branch is not final / provisional / may already be fixed" wording | **0 hits on all three** |
| Priority never High or Medium | **Low on all three** |
| Parent is the epic, never a story; no subtask conversion attempted | **SV-8582 on all three** |
| Link type is one of the eight that exist — `Relates`, not an invented semantic | **`Relates` on all three, and it is named as a deliberate choice** below |

**On the link type, said plainly:** the QA lead's instruction is that a defect is *linked to its story
as a story defect*. **None of the eight link types in this Jira means "is a defect of"** — they are
Blocks, Cause, Cloners, Duplicate, Fixes, Polaris work item link, Relates, Split (read live). **We used
`Relates` and are stating that choice rather than inventing a semantic.** It matches what the six
tickets filed on 4 August did, which he confirmed was correct: *"You did it correctly before."*

---

## 6 · TEST DATA NAMED IN THE REPRODUCTION STEPS (the hard requirement)

Because SV-8821 was closed as not-reproducible for exactly this reason, every variable each ticket's
flow touches is named by its on-screen name:

| | SV-8879 | SV-8880 | SV-8881 |
|---|---|---|---|
| **Who you sign in as** | `wesley.mcclure@staging.shopview.local`, role **Sales Representative** | `admin@shopview.com` (Administrator) | `admin@shopview.com` (Administrator) |
| **Location** | **Staging Lethbridge - 4310** (workplace `f8a8b802-…`) — access limited to that one | **All locations** | **All locations** |
| **Organisation** | Staging Foothills Group Inc | Staging Foothills Group Inc | Staging Foothills Group Inc |
| **Date range** | each report's own default (This Month ×4, This Year on Parts Velocity) | **This Month** | **This Year** |
| **Other controls** | — | Product Type *Parts & Service*, Invoice Status *All Statuses* | Technician *All technicians*, Location *All locations* |
| **The exact control/file** | the **Location** control reading *"All locations"* | **Download Summary (CSV)**, opened in a plain-text editor | the **three-dot** button, leftmost in the toolbar group |
| **Restore step included** | **yes** — Wesley McClure back to **Technician** at **Staging Lethbridge - 4310** | not needed, read-only | not needed, read-only |
| **What was tried and ruled out** | 4 rows | 4 rows | 4 rows |

Each ticket carries its own *"What was tried and ruled out"* table, so the reader does not repeat work
we already did — and so a variable we proved irrelevant is visibly proved, not merely asserted.

---

## 7 · OUTSTANDING — what I need from you

1. **One sentence from Chris on the location column** (for someone who can reach several locations but
   has selected one, is the Location option in the column list?). This unblocks **B4** and the new
   case N2.
2. **A live check on the logo**, then a decision on **B5**. Remove the organisation's uploaded logo,
   download a printable file, look at the top right. If it shows the built-in logo, B5 is real and I
   will file it on your word.
3. **Fresh sign-in for the QA branch.** It redeployed to **`v3.5-16cf83f`** this morning, so all three
   filed tickets rest on a build two deploys old. Each one names the build it was seen on, which is
   honest, but they are worth re-confirming before a developer picks them up.
4. **A word from Chris on the Technician Utilization menu count** — four options or three? SV-8881
   settles the wording on his own words and says plainly in its technical section that the **count** is
   our reading and is his to confirm.
5. **Nothing else.** No API-only item exists among the five, so there is no separate API ask this time.
