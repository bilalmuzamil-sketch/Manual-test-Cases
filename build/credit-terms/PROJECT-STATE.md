# Credit terms — PROJECT STATE

## 23 Oct 2026 — intake
- QA lead, 23 Oct 2026: new testing suite "Credit terms". "NO Technical Plan as yet which I will share with you once I get it."
- PRD: Confluence 963346440 (https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/963346440/Credit+terms).
- Epic: SV-11638. Design: https://claude.ai/artifact/2erYxWz2ffDNcoXzEfu6wf (share key given; start page page-d2a1c944fabb).
- TestRail group 91454 (suite 1).
- Prior facts (not rules, not cases): build/sv9087-credit-term-2026-08-27/FINDINGS.md (today's credit-term behaviour verified on the
  SV-9087 branch: Net 30 due dates, Due on receipt, Credit Hold banner, Charge Account withheld from COD, vendor due dates) and
  build/sv8815-customer-credit-2026-08-20/.

## 23 Oct 2026 — intake done
- PRD v3 (2026-10-22T17:25:54Z, "Renamed to Credit terms", owner and design authority Chris Ward, status "Ready for tech plan -
  2026-10-22") saved: `sources/CONFLUENCE-963346440-v3-2026-10-23.md` (pandoc from the HTML body; the two legacy-content tables, S2-R1
  row menu and S12-R3 log rows, converted from the macro) and the raw `.html`. Read in full: 1,056 lines, sections 1–9, 211 requirement
  codes (S1–S12). Note: Story 11 has no S11-R15 (numbering goes R14 → R16).
- Stories SV-11670 (Story 1) … SV-11681 (Story 12), all Open, created 22 Oct, no comments: `sources/JIRA-SV-11638-stories-2026-10-23.md`.
  Every one of the 211 requirement lines is word-for-word the PRD's (7 differ only in bullet/table formatting). Stories add Context and
  Acceptance Criteria; their PRD link points at the draft URL (resumedraft.action?draftId=963346440).
- Design "Default Credit Terms" (artifact 2erYxWz2ffDNcoXzEfu6wf, version 1792722751-b285, created 2026-10-22T17:07Z): 9 pages, one
  HTML board each (Main, Default, NewTerm, Empty, NewCustomer, Inactive, Vendor, OverCredit, Invoice), 25 screenshots, ShopView design
  system copy. Saved in `design-2026-10-23/files/` (viewer runtime and fonts kept out of git by `.gitignore`).
- Project type: V2 / upgrade of an existing feature (credit terms exist today: twelve fixed terms). Baseline facts:
  `build/sv9087-credit-term-2026-08-27/FINDINGS.md`. To confirm with the QA lead.
- TestRail sections under group 91454 (`sections.json`): S1 91455 … S12 91466, DATA 91467 "Counts and due dates — exact numbers",
  DESIGN 91468 "Design — how it looks".
