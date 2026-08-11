# Schedule §5.3 Panel collapse — the six new cases — 2026-08-11

**Six cases authored and pushed: [C43582](https://shopview.testrail.io/index.php?/cases/view/43582)–[C43587](https://shopview.testrail.io/index.php?/cases/view/43587).**
They close **all 19** assertions the 2026-08-10 requirement→case map left uncovered — 18 by
covering them and 1 by verdicting it NOT-INDEPENDENTLY-TESTABLE with the reason written down.
**The Schedule suite is now 174 cases.**

**The headline finding is separate from the coverage one and must not be confused with it: the
control does not exist in the build.** A coverage gap and a build gap are different things. The
coverage gap is closed; the build gap is reported below and is the QA lead's to act on.

---

## Where each case came from — the requirement quoted first, always

Expected behaviour is taken from the **document only** (Rule 57). The build supplied **labels**
(Rule 9) and the **verdict**, nothing else.

---

### SCH-PANEL-01 = [C43582](https://shopview.testrail.io/index.php?/cases/view/43582) · Grid Toolbar (section 4273)
**"Panel button sits left of Today and its tooltip names what it will do"**

> **Spec v27 §5.3, verbatim:** *"An icon button collapses and expands the left panel. It is the first
> item in the grid toolbar, left of Today, sitting in the same left gutter as the grid's row labels
> and avatars so it reads as belonging to the panel it controls, and grouping with the date controls.*
> *• **Control.** A borderless panel-left icon in secondary text color. The icon does not change
> between states; the tooltip carries the meaning — "Hide panel" when open, "Show panel" when
> collapsed."*
>
> **Spec v27 §6, verbatim, the new toolbar row:** *"**Panel toggle** | Collapses and expands the left
> work order panel (§5.3)."*

**Covers 7 assertions:** `§5.3-L189.A1`, `.A2`, `.A3` · `§5.3-L190.A1`, `.A2`, `.A3` · `§6-L200.A1`.

**Honest note on expected item 4.** The specification says *"a borderless **panel-left icon in
secondary text color**"*. *Secondary text color* is a design-system token, not something a
non-technical tester can read off a screen, and **we hold no dated design for this control**
(`SOURCE-CURRENCY.md` source D is PARTIAL). So the case asserts the observable form of it — *"no
border or box drawn around it, in the same muted grey as the other icon buttons in that row"* — with
three sibling icon buttons in that very row to compare against. **Said here rather than left for a
reviewer to notice.**

---

### SCH-PANEL-02 = [C43583](https://shopview.testrail.io/index.php?/cases/view/43583) · Grid Toolbar (4273)
**"Panel button hides the left panel and the grid widens into the space"**

> **Spec v27 §5.3, verbatim:** *"• **Behavior.** The panel animates closed over a short width
> transition, its divider disappears so no seam remains, and the grid reflows into the reclaimed
> space."*
>
> **Spec v27 §3.1, verbatim:** *"The panel can be collapsed and expanded from the grid toolbar (§5.3),
> handing its width to the grid without losing panel state."*

**Covers 3 assertions:** `§5.3-L191.A1`, `.A2` · `§3.1-L44.A1` (the *handing its width to the grid*
half; the *without losing panel state* half is SCH-PANEL-03).

**Observation recorded for whoever builds it.** Today the panel's right edge is at **x=287** and the
grid starts at **x=300**, and a scan of that 13-pixel gap found **no separate divider element at
all**. So the spec's *"its divider disappears"* may have no referent. Expected item 2 is therefore
written as the **observable outcome** — no leftover line, seam or empty strip — which is checkable
either way, rather than as a claim about an element that may not exist.

---

### SCH-PANEL-03 = [C43584](https://shopview.testrail.io/index.php?/cases/view/43584) · Grid Toolbar (4273)
**"What you had set up in the left panel survives hiding and showing it"**

> **Spec v27 §5.3, verbatim:** *"• **State preservation.** Contents are hidden rather than discarded.
> Calendar date, work-order scroll position, panel search text, drill-down state, and the selected
> work order all survive a collapse/expand cycle, and reopening returns to whichever panel mode was
> active."*

**Covers 5 assertions:** `§5.3-L192.A1`, `.A2`, `.A3`, `.A4` · `§3.1-L44.A1` (the *without losing
panel state* half).

**Build labels taken live from `v3.5-af3a6e1`**, so the steps name what the tester will actually see:
the search box placeholder is **`Search work orders`**, the drill-down's back control is
**`Back to work orders`**, and the work-order list genuinely scrolls (scrollHeight 2828 against a
691-pixel viewport, 21 cards), so step 3 is performable rather than decorative.
**"Panel mode"** is spec vocabulary for the two states §3.1 defines — the work order list and the
line drill-down — and expected item 5 says that in plain words instead of using the term.

---

### SCH-PANEL-04 = [C43585](https://shopview.testrail.io/index.php?/cases/view/43585) · Edge Cases and Responsiveness (section 4280)
**"On a narrow window the panel button still works and your choice holds"**

> **Spec v27 §5.3, verbatim:** *"• **Narrow viewports.** Below the 960px minimum supported width (§11)
> the panel auto-collapses. The toggle still works, so the user can expand it manually at any width;
> that manual choice holds until the next resize across the breakpoint."*

**Covers 2 assertions:** `§5.3-L193.A2`, `.A3` — **and deliberately NOT the first sentence.**
That sentence restates §11 and is already asserted, verbatim, by
**SCH-EDGE-02 = [C30086](https://shopview.testrail.io/index.php?/cases/view/30086)**
(*"On narrow viewports the sidebar collapses."*). Re-asserting it would be duplicate coverage
(Rule 45(e)). **Filed in Edge Cases and Responsiveness rather than Grid Toolbar so it sits beside
C30086**, the case covering the other half of the same bullet — a deliberate split of the §5.3
family, recorded here so it does not read as an accident.

---

### SCH-PANEL-05 = [C43586](https://shopview.testrail.io/index.php?/cases/view/43586) · Grid Toolbar (4273)
**"Menus and pop-up windows reposition when the left panel is hidden"**

> **Spec v27 §5.3, verbatim:** *"• **Popovers and modals.** Anything that positions itself clear of
> the panel falls back to a normal viewport margin while the panel is collapsed."*

**Covers 1 assertion:** `§5.3-L194.A1`.

**Kept as its own case rather than folded into SCH-PANEL-02, and the reasoning is on the record**
because it is the one merge a reviewer would reasonably challenge: its precondition is SCH-PANEL-02's
end state, but the failure it catches is different in kind — a dialog rendering half off screen is a
separate reportable bug from the panel failing to close. It is scored the lowest-value of the six in
`USEFULNESS-AUDIT.md` and the honest risk is stated there.

---

### SCH-PANEL-06 = [C43587](https://shopview.testrail.io/index.php?/cases/view/43587) · Grid Toolbar (4273)
**"Hiding the panel lasts for the rest of your sign-in but is not saved"**

> **Spec v27 §5.3, verbatim:** *"• **Persistence.** Not persisted in the prototype. Session-scoped per
> user for build — this is a working-mode preference, not a saved view."*

**Covers 1 assertion:** `§5.3-L195.A2`.

**`§5.3-L195.A1` — *"Persistence. Not persisted in the prototype."* — is verdicted
NOT-INDEPENDENTLY-TESTABLE and deliberately NOT authored.** It describes the **prototype's**
behaviour, not a requirement on the build, and the very next clause states the build requirement this
case asserts. A case written against it would test a prototype nobody ships. **Recorded as a
deliberate non-authoring (Rule 46), not left as a hole.**

**The case carries an OPEN QUESTION in its own tester-facing text (Rule 58).** §5.3 says
*session-scoped*; item **E12** of the 5 August design review asks for view settings *"stored at the
user level so they survive across sessions"*. **Those are different promises, and the ambiguity was
NOT resolved by looking at the build** — the case follows the written specification and says so, so a
tester is never left guessing why. See `QUESTIONS-FOR-BRANKO.md`.

---

## 🔴 THE CONTROL IS NOT BUILT — proven three ways, not assumed

Build **`v3.5-af3a6e1`** (last-modified Mon 10 Aug 2026 21:59:27 GMT, etag `0708dbc8bc1fe805e835a2f86d05abfb`),
`index.html` **byte-identical at 02:36Z and 03:27Z**, so nothing redeployed under this pass.

**(1) No control anywhere left of Today, at six viewport widths.** Fresh page loads at **1680, 1200,
959, 900, 760 and 600** pixels. At every one, the only buttons on Today's row to its left are the four
**mini-calendar** controls (`button_mini_calendar_month`, `_prev`, `_next`, `_collapse`). `Today` sits
at x=325; the grid's own left gutter begins at x=300; **there is nothing in between.**

**(2) Not hiding in a menu, and no keyboard route.** The **View options** menu holds exactly
`Business Hours · Tech Hours · Capacity Planning · Events · Show Saturday · Show Sunday`. The
**Filter & Display** menu holds exactly `Service · Work order status · Service/Parts · My Shifts ·
VIN Number`. Neither offers a panel control. `[`, `\` and `Ctrl+B` left the panel at **275 pixels
wide, unchanged**.

**(3) The decisive one — it is not in the shipped code.** The Schedule page is a lazy-loaded chunk.
In that chunk the strings **`Hide panel`, `Show panel`, `panel-left`, `Panel toggle`, `panelCollapse`,
`collapsePanel` and `togglePanel` appear ZERO times**, while every control that *is* built appears
exactly where expected — `Hide the calendar`, `schedule_sidebar`, `Search the grid`, `View options`,
`Filter and display options` all found. The whole chunk contains the substring `panel` **twice**, in
`SidebarLinePanel` and the CSS class `schedule-menu__panel`. **This is absence of the feature, not a
control we failed to find.**

**So all six cases carry `AUTOMATION: HOLD - the panel collapse control is not in the build`**, and
each tells the tester plainly to mark it **Blocked**, and to tell the QA lead if a panel button ever
does appear — which makes the cases self-monitoring for the fix, in the spirit of Rule 61's outcome 3.

**The near-miss that would have produced a false pass.** `button_mini_calendar_collapse` carries the
aria-label **"Hide the calendar"**, sits in the same left strip, and collapses something. It is the
**mini calendar's** own chevron — spec §5.2, already covered by
**SCH-MCAL-03 = [C29934](https://shopview.testrail.io/index.php?/cases/view/29934)**. Mistaking it for
the panel toggle would have closed this gap on paper while testing a different control.

---

## Two things observed that are already known, and were NOT re-reported

**Reported here, not filed, and not duplicated as new cases.**

**(1) The panel does not auto-collapse below 960px.** Measured on fresh loads at 959, 900, 760 and
600 pixels: the panel stayed **275 pixels wide and visible** while the grid shrank (1380 → 659 → 600
→ 460 → 300). The responsive logic *is* firing — `button_open_mobile_menu` appears at 959 and below —
so this is the app's behaviour, not a harness artefact.
**This is already C30086's assertion, already ticketed as
[SV-8942](https://shopview.atlassian.net/browse/SV-8942), and C30086 already carries
`AUTOMATION: READY - EXPECT FAIL (SV-8942)` with a "what you should see today" note describing exactly
this.** So the correct outcome was **Rule 61 outcome (1) — it fails with the stated symptom, raise
nothing new** — and that is what was done. **Rule 61 earned its keep here: without that note this
would have been written up as a fresh defect.**

**(2) The 168 pre-existing cases name builds that no longer exist** — 78 on `v3.5-d122eef` and 90 on
`v3.5-7ec992f`, against `v3.5-af3a6e1` running now. Under **Rule 60** that is the ordinary consequence
of a branch that is never declared final, touching layer 1 (labels) and layer 2 (verdicts) only. **No
expectation is invalidated** and nothing was re-stamped: re-stamping without re-observing would assert
a check that did not happen.

---

## Surface coverage

The full matrix is `SURFACE-MATRIX.md`. In one line: §5.3 touches the **toolbar, the sidebar, the
grid, popovers/modals, the narrow-viewport layout and session state** — and **no** export, print, PDF,
CSV, API or email surface, each marked N/A with its reason rather than skipped.

---

## OUTSTANDING — what I need from you

1. **A decision on the build gap.** §5.3 was written into the specification on 7 August and the
   control is not in the build four days later. **No ticket was raised: creating one is barred by
   your hold of 2026-08-10** (*"Do not create anything until my next order"*), which you have since
   clarified covers Jira but not test cases. Say the word and the ticket is ready to file — at which
   point the six cases move from `HOLD` to `READY - EXPECT FAIL (SV-xxxx)` with one edit each.
2. **Send the 6 August Branko sheet, with S-2 on it.** Item **S-2** is the session-scoped vs
   across-sessions conflict now cited on C43587. The sheet has been ready since 6 August and the
   blocker is us, not Branko.
3. **Confirm which design artefact is canonical for Schedule.** §5.3 specifies a *"panel-left icon"*
   and a precise gutter alignment; we hold no dated design for it, so expected item 4 of C43582
   asserts the observable form rather than the token.
