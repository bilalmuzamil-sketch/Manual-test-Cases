# CHANGES MADE — Filters / SV-9041 — 2026-08-11

Two cases changed. Both diffs in full, so nothing has to be taken on trust.

---

## C29601 — FLT-COLL-01 — [view](https://shopview.testrail.io/index.php?/cases/view/29601)

*"The toolbar filter button collapses the bar and the table takes the space"*

**Changed: `custom_expected`, `refs`. Unchanged: title, preconditions, steps.**

### Expected Results — ADDED item 4 and the tester note

```diff
  1. The filter bar row is hidden.
  2. The work order table moves up and uses the reclaimed vertical space.
  3. The filter icon shows a pressed/active look while the bar is collapsed.
+ 4. The filter icon is shown on this page because the Work Orders page has more than one filter.
+    This button is only shown on a page that has more than one filter; on a page that has only one
+    filter the button is not shown at all and that page's filter bar is always on display.
+
+ Note for the tester: if you are ever on a page that has only one filter and you cannot find this
+ button, that is correct and is not a fault - do not raise it. On the Work Orders page, which has
+ five filters, the button should always be there.
```

**Scope-conditional (Rule 42):** *"only shown on a page that has more than one filter"*, not a closed
claim about where the button does or does not exist. **The plain tester sentence (Rule 7)** stops a
correct build reading as a failure on some other page.

### Provenance — sentence 1 gained SV-9041; **sentence 2 untouched**

```diff
- This is the expected behaviour as per epic SV-8785, read on 11 August 2026, and the Filters
- specification at Confluence version 19 (published 6 August 2026) (S1-R4, S1-R5), read on 11
- August 2026. Last checked against build v3.4.2-d00239b on 8/5/2026.
+ This is the expected behaviour as per epic SV-8785, read on 11 August 2026, the Filters
+ specification at Confluence version 19 (published 6 August 2026) (S1-R4, S1-R5), read on 11
+ August 2026, and ticket SV-9041 (https://shopview.atlassian.net/browse/SV-9041), read on 11
+ August 2026, which sets the condition for when this button is shown.
+ Last checked against build v3.4.2-d00239b on 8/5/2026.
```

**Sentence 1 names documents only** — epic, specification, ticket — and **sentence 2 is byte-identical**.
Neither was merged with the other.

**No Rule-56 divergence sentence, on purpose.** On the Work Orders page S1-R4 and SV-9041 give the
**same** answer: five chips is more than one, so the button is there. Adding a divergence sentence
would manufacture a conflict that does not exist, which Rule 56 forbids in as many words.

### refs

```diff
- SV-8786 (S1-R4; S1-R5) [spec v19 2026-08-06]
+ SV-8786; SV-9041 (S1-R4; S1-R5; SV-9041 - toggle shown only when the page has more than one filter) [spec v19 2026-08-06]
```
121 chars · 0 commas.

**Marker unchanged: `AUTOMATION: READY`**, still last, blank line before.

---

## C43562 — FLT-PR-PAR-01 — [view](https://shopview.testrail.io/index.php?/cases/view/43562)

*"Parts and Reports filters collapse, share and work on a phone as Work Orders do"*

**Changed: `custom_steps`, `custom_expected`, `refs`. Unchanged: title, preconditions.**

**This is the case that was genuinely contradicted** — as written it would have made a tester fail a
correct build on any single-filter Parts view or report.

### Step 2 — made conditional, and given the negative to check

```diff
- 2. Find the control that collapses the filter bar and use it. Then expand it again.
+ 2. Count the filter buttons on the page. If there is more than one, find the control that
+    collapses the filter bar and use it, then expand it again. If there is only one filter button,
+    check instead that there is no collapse control at all and the filter bar stays on display.
```

The step now **tests both branches** rather than presuming one.

### Expected — items 1, 2 and 3 conditioned; items 4, 5, 6 untouched

```diff
- 1. The filter bar on the Parts page and on the report can be collapsed and expanded, and the table
-    takes the freed space when it is collapsed - exactly as on the Work Orders page.
+ 1. On a Parts page or a report that has more than one filter, the filter bar can be collapsed and
+    expanded, and the table takes the freed space when it is collapsed - exactly as on the Work
+    Orders page. On a page that has only one filter there is no collapse control at all and the
+    filter bar is always on display; that is correct and is not a fault.

- 2. While the bar is collapsed the filters keep working, and the collapsed control shows that
-    filters are active - exactly as on the Work Orders page.
+ 2. Where that collapse control is present: while the bar is collapsed the filters keep working,
+    and the collapsed control shows that filters are active - exactly as on the Work Orders page.

- 3. Whether you left the bar collapsed or expanded is remembered when you come back to that page.
+ 3. Where that collapse control is present, whether you left the bar collapsed or expanded is
+    remembered when you come back to that page.
```

Items **4** (shareable URL), **5** (phone layout) and **6** (write down anything different) were left
exactly as they were — SV-9041 says nothing about them.

### Tester note — extended so a single-filter page reads as a PASS

```diff
  Note for the tester: only some Parts views and only some reports have the new filter bar so far.
  If the page you open has no filter bar, mark this test BLOCKED - do not mark it failed.
+ A page that has a filter bar with only one filter button and no collapse control is a PASS for
+ that page, not a failure.
```

### Provenance — Rule-56 divergence sentence ADDED, and Branko's ruling CITED not dropped

```diff
  ...He said that collapsing, the shareable web address and the phone layout all match the Work
  Orders page. The Filters specification at Confluence version 19 has no numbered requirement for
  this, so there is no requirement number to quote.
+ It also follows ticket SV-9041 (https://shopview.atlassian.net/browse/SV-9041), read on 11 August
+ 2026, which says the collapse control is only shown on a page that has more than one filter.
+ Branko's answer of 31 July 2026 says collapsing on Parts and Reports matches the Work Orders page
+ and does not mention any condition on the number of filters; ticket SV-9041, raised on 7 August
+ 2026, is the newer statement, so this test follows it and expects no collapse control on a page
+ that has only one filter.
  This test has not yet been checked against any build.
```

**All three parts Rule 56 requires are present:** where the newer source says it (the ticket, with
its link and read date) · where it differs from the earlier source (Branko's 31 July answer, named,
with what it said) · and that the latest is taken as prevailing.

**Rule 33 satisfied.** The case's existing `refs` credited Branko's ruling; that credit is **retained
in both the text and the refs**, and the reason for departing from it is stated. **We have reversed a
recorded ruling in silence once before; this is not that.**

**Sentence 2 — `This test has not yet been checked against any build.` — byte-identical.** Correct:
no build was opened, so the case still has no build check to report.

### refs

```diff
- SV-8785 [epic] (Branko answers 2026-07-31 Round-3 Q5=A - collapse; shareable URL and mobile all match Work Orders; spec v19 §4 Key Decisions - context-specific filter sets on Parts and Reports) [spec v19 2026-08-06]
+ SV-8785 [epic]; SV-9041 (Branko 2026-07-31 R3 Q5=A - collapse; URL and mobile match Work Orders; SV-9041 - collapse control only where a page has >1 filter; spec v19 §4 Key Decisions - context-specific filter sets) [spec v19 2026-08-06]
```
236 chars · 0 commas. **Condensed to fit 248 — nothing dropped** (see the execution log).

**Marker unchanged:** `AUTOMATION: HOLD - the new filter bar has reached only some Parts views and
one report tab, so most of this cannot be run yet`. Still correct, and still last.

---

## What was deliberately NOT changed

| | |
|---|---|
| **6 of the brief's 8 candidates** | C29602, C29603, C29604, C29605, C29629, C38903 — unaffected; reasons per case in `COVERAGE-VERDICT.md` |
| **C38882** | targeted by the killed pass's plan; it is the Date-Range case and has no toggle assertion |
| **The other 106 cases** | not in scope |
| **A new case for the single-filter negative** | a real gap, but `add_case` is barred by the active creation hold; written up for the QA lead |
| **Any Jira field, comment or transition** | zero Jira writes; the creation hold and Rule 62 both apply |
| **Run 352** | `update_run` never called; the run already holds all 114 cases |
| **Ahtasham's 5 foreign cases** | never touched (Rule 38) |
