# ADDENDUM to VERIFICATION.md — TRUE versions · the FULL SBC v12→v13 delta · epic SV-8582 Tier-1

**Why this exists.** `VERIFICATION.md` (written earlier today) had to report versions from `lastModified`
because `getConfluencePage` exposes no version field. **That limit is now removed:**
`mcp__Atlassian__fetch` with a Confluence **ARI** returns `metadata.version` — the **true Confluence
version integer**. Every version below is that integer, read live on **2026-08-03**. All six full page
bodies were fetched (not phrase-searched), and the SBC delta below is a **structural diff**, not a
keyword hunt.

**No TestRail writes in this addendum. No Jira writes. Every case change is STAGED only.**

---

## 1. SOURCE-CURRENCY — TRUE Confluence versions (Standing Rule 31)

| Spec | pageId | **TRUE Confluence version** (live 2026-08-03) | `lastModified` | Our `spec-current-2026-07-31` mirror | Verdict |
|---|---|---|---|---|---|
| **SBC** Sales By Customer | 577634305 | **13** | Jul 31, 2026 | **12** | ❌ **STALE by exactly one version** |
| **SBR** Sales By Representative | 585629698 | **15** | Jul 29, 2026 | 15 | ✅ **CURRENT — same version** |
| **PV** Parts Velocity | 620888066 | **4** | Jul 29, 2026 | 4 | ✅ **CURRENT — same version** |
| **TU** Technician Utilization | 641400833 | **5** | Jul 29, 2026 | 5 | ✅ **CURRENT — same version** |
| **WIP** Work In Progress | 703660034 | **6** | Jul 29, 2026 | 6 | ✅ **CURRENT — same version** |
| **IV** Inventory Value | 720142338 | **3** | Jul 29, 2026 | 3 | ✅ **CURRENT — same version** |

**This is stronger than the earlier date-match:** five of six mirrors are **the same version integer**
as live, so those five mirrors are not merely "probably current" — they are **the current version**.
Only SBC moved, and by exactly one version.

**Rule 31's "markers lie" warning, tested here:** every page's own in-body Change Log is *also*
consistent with these integers (SBC's newest row is dated 2026-07-31; the other five stop at
2026-07-29). No contradiction between the metadata version and the in-body log on any of the six.
**Method note (for the playbook):** `getConfluencePage` → body only, no version;
**`fetch` with `ari:cloud:confluence:<cloudId>:page/<id>` → body PLUS `metadata.version`.** Use
`fetch` when the version matters.

---

## 2. THE FULL SBC v12 → v13 DELTA — the complete change, not a sample

**Method:** both bodies normalised (markdown emphasis, escaping, whitespace, curly quotes) and diffed
**structurally** in four independent dimensions — requirement anchors, requirement text, section
headings, and non-requirement prose bullets — plus a Change-Log row check. **No phrase search was
used** (it is the method that nearly produced a phantom finding on SBR).

| Dimension | Result |
|---|---|
| Requirement anchors present | **234 in v12 · 234 in v13** |
| Anchors **ADDED** | **0** |
| Anchors **REMOVED** | **0** |
| Anchors whose **TEXT CHANGED** | **2** — `S1-R2`, `S1-N1` |
| Section headings changed | **0** |
| Non-requirement prose bullets **added** | **0** |
| Non-requirement prose bullets **removed** | **1** — the Story 1 Prerequisite |
| Change-Log rows added | **1** — dated 2026-07-31 (absent from the v12 mirror; verified) |

**THE WHOLE DELTA IS THREE TEXT CHANGES, ALL ON THE SAME SUBJECT — THE PERMISSION GATE.**

**1. `S1-R2`**
- **v12:** *"The report is gated by a dedicated Sales By Customer report View permission — it is not tied to a generic \"all reports\" permission."*
- **v13:** *"The report is gated by ordinary reports access, not by a report-specific permission. Any user with standard reports access can open it; there is no dedicated Sales By Customer View permission."*

**2. `S1-N1`**
- **v12:** *"A user without the Sales By Customer report View permission does not see the report in navigation and cannot open it by direct link."*
- **v13:** *"A user without reports access does not see the report in navigation and cannot open it by direct link."*

**3. Story 1 Prerequisite — REMOVED**
- **v12:** *"User has the Sales By Customer report View permission."*
- **v13:** *(deleted)*

**4. New Change-Log row (verbatim, v13):**
> *"| 2026-07-31 | @chris / @claude | Corrected the Sales By Customer permission gate: the report is
> gated by ordinary reports access, not a dedicated Sales By Customer View permission (S1-R2, plus the
> Story 1 prerequisite and the S1-N1 negative case). This reverses the 2026-07-07 change that
> introduced a dedicated permission — that permission was specced before Custom Roles (CRP) existed.
> Per Chris's ruling recorded 2026-07-28 and re-confirmed 2026-07-31 on the SV-8598 / SV-8780
> permissions question sheet: reports are not hidden from normal reports access. Engineering (SV-8598)
> to drop the dedicated ROLE_SALES_BY_CUSTOMER_REPORT::VIEW atom, gate SBC endpoints on standard
> reports access, and confirm the atom does not linger in the Custom Roles matrix."*

### ⇒ SPEC-WATCH items 1a, 2, 3 and 10 are now CONFIRMED, not merely assumed

The concern was that the unknown part of the 31-July delta might have touched them. **It did not — the
delta contains zero changes outside the three permission edits.** So their verdicts hold **against
v13**, the current version:

| Item | Verdict against v13 | Evidence |
|---|---|---|
| **1a** VIN → Unit # → plate (SBC) | ✅ **DONE** | v13 §2: *"Each asset row is labeled by the vehicle's VIN, falling back to Unit number, then plate."* (unchanged from v12) |
| **2** Print removed | ✅ **DONE** | v13: *"### Story 16: (removed — Print retired)"* — **but S18-R7 / S18-R10 still list "Print" as an export**; a residual self-contradiction, unchanged by v13 |
| **3** Summary / Expanded downloads | ✅ **DONE** | v13 Change-Log 2026-07-29 row + Stories 14/15 (unchanged) |
| **10** SBC Performance group + named anchors | ❌ **NOT DONE** | v13 `S1-R1`: *"\"Sales By Customer\" appears in the Reports left-side navigation."* — no group, no anchors. **The v13 edit did not touch it** |

**The DONE/NOT DONE table in `VERIFICATION.md` therefore stands in full**, and its four
previously-uncertain rows are now positively established.

---

## 3. PER-REQUIREMENT COVERAGE VERDICTS (Standing Rule 43 — one row per requirement)

**Deltas found by the diff: 3. Rows verdicted below: 3. Reconciled — no un-verdicted row.**

| # | Requirement | VERBATIM v13 text | Verdict | Covering case(s) |
|---|---|---|---|---|
| 1 | **SBC `S1-R2`** (changed) | *"The report is gated by ordinary reports access, not by a report-specific permission. Any user with standard reports access can open it; there is no dedicated Sales By Customer View permission."* | **COVERED BY CASE(S) — no change needed** | **SBC-PERM-01 = [C30098](https://shopview.testrail.io/index.php?/cases/view/30098)** — expected: *"The \"Sales By Customer\" entry is visible in the Reports navigation." / "The report opens and shows its data." / "Ordinary reports access alone is enough — this report does NOT need a permission of its own."* · **SBC-PERM-05 = [C39447](https://shopview.testrail.io/index.php?/cases/view/39447)** — *"There is NO \"Sales By Customer\" permission anywhere in the list for an administrator to switch on or off."* |
| 2 | **SBC `S1-N1`** (changed) | *"A user without reports access does not see the report in navigation and cannot open it by direct link."* | **COVERED BY CASE — no change needed** | **SBC-PERM-02 = [C30099](https://shopview.testrail.io/index.php?/cases/view/30099)** — *"\"Sales By Customer\" does not appear in the Reports navigation." / "Opening the report by direct link does not show the report…" / "The gate is the ordinary reports access — there is no separate Sales By Customer permission to remove."* |
| 3 | **SBC Story 1 Prerequisite** (REMOVED: *"User has the Sales By Customer report View permission."*) | *(deleted in v13)* | **COVERED BY CASE — no change needed**; the removal is what our cases already assert | Same three cases: their preconditions read *"ordinary reports access … and NO report-specific permission"* (C30098) and *"does NOT have reports access"* (C30099) — neither asks for an SBC-specific permission |

**Both texts are quoted side by side above (Rule 45(e)) — no verdict rests on a case id alone.**
**Result: the v13 delta requires ZERO case changes.** Our four SBC permission cases were already
brought onto the one-permission model earlier today (groups A/B), so v13 has caught up with them
rather than the reverse.

---

## 4. SURFACE MATRIX for the changed requirement (Standing Rule 40)

`S1-R2` is a permission gate, so it can touch every surface. **Each gets its own verdict; "N/A" is
stated with its reason, never skipped.**

| Surface | Verdict | Detail |
|---|---|---|
| **On screen — navigation entry** | ✅ **COVERED** | C30098 (visible with access) + C30099 (absent without) + SBC-NAV-01 [C30096](https://shopview.testrail.io/index.php?/cases/view/30096) |
| **On screen — the report opening** | ✅ **COVERED** | C30098 (*"The report opens and shows its data"*) + C30099 (direct-link blocked) |
| **Role permission editor** | ✅ **COVERED** | C39447 — the atom must not be OFFERED |
| **CSV export (Summary + Expanded)** | ⚠️ **NOT APPLICABLE AS WRITTEN — flagged** | v13 `S1-R2` speaks only of **opening** (*"can open it"*); unlike PV `S1-R4` (*"Both loading the report and exporting it require…"*) and WIP (*"the same permission covers the report and its downloads"*), **SBC's text makes no export-gating claim**, so there is nothing to verdict against. **Asymmetry flagged for Chris:** if the intent is suite-wide, SBC's sentence should say so too |
| **PDF export (Summary + Expanded)** | ⚠️ **same as CSV** | as above |
| **Print** | ✅ **N/A — retired** | Story 16 *"(removed — Print retired)"*. *(Residual: S18-R7/S18-R10 still name Print — reported separately)* |
| **API / back end** | 🔴 **CANDIDATE GAP — staged, not authored** | SBC has five API cases (SBC-API-01…05 = C30190–C30194) and **none of them asserts the permission gate at the back end.** PV has that half (PV-API-04 = [C30391](https://shopview.testrail.io/index.php?/cases/view/30391)). Proposal below |
| **Mobile / responsive** | ✅ **N/A** | the gate is not layout-dependent; no requirement states a mobile-specific permission behaviour |
| **Column selector** | ✅ **N/A** | a permission does not appear in the column selector |
| **Empty / error state** | ✅ **COVERED** | the access-denied path is C30099's expected result |

### STAGED — NOT EXECUTED (Standing Rule 6)

**Proposal SBC-API-06 (new, no C-id):** *the back end serves the SBC report data and its exports to a
user holding only the ordinary reports access* — the SBC twin of PV-API-04 (C30391), and the surface
that would catch the `ROLE_SALES_BY_CUSTOMER_REPORT::VIEW` atom still being enforced server-side after
the FE stops offering it. **This is exactly what SV-8780 is about, so it is a real gap, not a
formality.** Section: *"SBC — API"* (Rule 4). **Nothing authored, nothing pushed** — it needs the QA
lead's go-ahead, and a run-sync afterwards (Rule 34/47: run 359 is `include_all: false`).

**Also staged, and NOT done:** the `refs` of C30098 / C30099 / C39447 / C30096 could now cite
**"SBC spec v13 (2026-07-31)"** instead of the looser *"v-2026-07-31"* they carry. Cosmetic
traceability polish, outside this pass's authorisation.

---

## 5. EPIC SV-8582 — TIER-1 CURRENCY CHECK (Standing Rule 37 Tier 1 · NOT a full re-read)

**Child count verified two independent ways, with no paging remainder:**

| Query | totalCount | Returned | `hasNextPage` |
|---|---|---|---|
| `parent = SV-8582` | **97** | **97** | false |
| `"Epic Link" = SV-8582` | **97** | **97** | false |

**The two key sets are IDENTICAL — symmetric difference is empty.** Keys run **SV-8583 → SV-8679,
contiguous, zero gaps**, all issuetype **Story**.

**Live status split: 90 Open · 6 OBSOLETE · 1 In Progress** — this **confirms the coordinator's
expected figures exactly.**

### ⚠️ BUT IT DOES NOT MATCH OUR INGEST — 7 STATUS CHANGES SINCE 2026-07-27

Our ingest (`epic-sv8582/INGEST-SUMMARY.md`, 2026-07-27) recorded **OBSOLETE 12 · Open 85**. Live is
**OBSOLETE 6 · Open 90 · In Progress 1**. The difference is real, and this is the finding of the check:

| Key | Our ingest | **Live 2026-08-03** | Story | Jira `updated` |
|---|---|---|---|---|
| **SV-8589** | Open | **In Progress** | `[PR-1] inventory_changes INT→DECIMAL precision fix + QB correction` | 2026-07-30 |
| **SV-8594** | OBSOLETE | **Open (REOPENED)** | `[B1] Work In Progress (WIP) report + nightly snapshot cron` | 2026-07-29 |
| **SV-8595** | OBSOLETE | **Open (REOPENED)** | `[B2] Technician Utilization (TU) report` | 2026-07-29 |
| **SV-8596** | OBSOLETE | **Open (REOPENED)** | `[B3] Parts Velocity (PV) report + part.last_sold_at` | 2026-07-29 |
| **SV-8597** | OBSOLETE | **Open (REOPENED)** | `[B4] Inventory Value (IV) report + nightly snapshot + retention` | 2026-07-29 |
| **SV-8598** | OBSOLETE | **Open (REOPENED)** | `[B5] Sales By Customer (SBC) report + dedicated permission` | 2026-07-29 |
| **SV-8599** | OBSOLETE | **Open (REOPENED)** | `[B6] Sales By Representative (SBR) report + rep schema + staff dialog` | 2026-07-29 |

**NEW stories: 0. REMOVED stories: 0.** The only movement is those seven statuses.

**⚠️ A CORRECTION TO THE BRIEF, stated plainly:** the six now-OBSOLETE stories are **SV-8583–SV-8588**
(the plain-titled originals) — that part is right. But the stories that **CHANGED** are the
**`[B1]`–`[B6]` build stories SV-8594–SV-8599**, which our ingest had as OBSOLETE and which are now
**Open again**. They are *not* the same six, and they were not "already obsolete and stable".

### Does any coverage ride on a moved story?

| Check | Result |
|---|---|
| Cases citing the 6 OBSOLETE stories (SV-8583–8588) | **ZERO.** Confirmed — the brief's expectation holds, no coverage rides on them |
| Cases citing the 6 REOPENED stories | **SV-8598 → 2 cases.** **SBC-PERM-05 = [C39447](https://shopview.testrail.io/index.php?/cases/view/39447)** cites it as its driving ticket; **SBC-NAV-01 = [C30096](https://shopview.testrail.io/index.php?/cases/view/30096)** mentions it in its `refs` prose. SV-8594/95/96/97/99 → **0 cases** |
| Effect of the reopening | **Positive, and worth saying:** C39447's traceability now points at a **live, active** story. Had SV-8598 stayed OBSOLETE, our most important permission case would have cited a dead ticket (a Rule-20 authenticity problem). **No case needs changing** |
| Distinct SV keys cited across the 475 cases | **84** — 82 child stories + the epic **SV-8582** (cross-cutting, permitted by Rule 20) + **SV-8780** |
| **SV-8780** (the permission subtask) | Live: **Story Defect**, subtask, parent **SV-8598**, status **Ready to Fix**, updated **2026-08-02**. Confirms the brief. Out of scope for action by the QA lead's ruling *"Ignore this ticket."* |

### One coverage signal found in passing (not Tier-1 scope, flagged not acted on)

**15 child stories are cited by no case.** Fourteen are legitimately non-case-bearing: the 6 OBSOLETE
originals, the 5 reopened `[Bn]` build stories with no case (SV-8594/95/96/97/99), and 3 shared-chassis
/ back-end stories (SV-8590 export contract, SV-8591 row-cap guard, SV-8592 denormalised columns —
covered indirectly through the per-report export and cap cases). **The fifteenth is different:**

> **SV-8614 — "SBC - Story 16 - Print the report" — status Open.**

Print was **retired from the spec** (v13 Story 16 *"(removed — Print retired)"*) and our Print case was
deleted on 2026-07-28. **So a Jira story for a descoped feature is still Open** — and it is *correct*
that no case cites it (deliberate, recorded here per Rule 46). **For Chris/dev: SV-8614 should be
closed or marked OBSOLETE**, otherwise the next reader will build Print. This is a **third** live
Print inconsistency alongside SBC `S18-R7`/`S18-R10`.

**Tier 2 (opening every ticket, comments and images) was NOT done — it needs the QA lead's
authorisation (Rule 37).**

---

## OUTSTANDING — what I need from you

| # | What is needed | Who owes it | What it blocks | Since |
|---|---|---|---|---|
| 1 | **Go-ahead to author SBC-API-06** (the back-end permission case; the SBC twin of C30391) | you | The **API surface of the SBC permission gate is uncovered** — precisely the surface SV-8780 is about. Staged only; nothing written | 2026-08-03 |
| 2 | **A word on the SBC export-gating asymmetry** — PV and WIP say their permission covers exports; SBC's `S1-R2` speaks only of opening | Chris Ward (text) / you (whether to ask) | Two export surfaces on SBC have nothing to verdict against | 2026-08-03 |
| 3 | **SV-8614 "SBC - Story 16 - Print the report" is still Open for a retired feature** | Chris Ward / dev | Nothing in our suite (correctly uncited), but it will mislead a reader — third live Print inconsistency | 2026-08-03 |
| 4 | **Whether the 6 reopened `[B1]`–`[B6]` stories mean the build plan changed** | you / dev | Unknown. They went OBSOLETE → Open on 2026-07-29 with no comment on any of them. **A Tier-2 read would answer it, and Tier 2 needs your authorisation** | 2026-07-29 |
| 5 | **The four spec edits Chris still owes on PV / TU / WIP / IV** (the one-permission paragraph) | Chris Ward | 16 of our cases read differently from four spec pages | 2026-08-01 |
| 6 | **A QA branch + fresh cookies** | you / dev | **All 475 cases remain VIU-Pending** — nothing observed on a running build | 2026-07-22 |

**Cleared by this addendum:** the *"Confluence session cookies needed for true version numbers"* ask —
**withdrawn.** `mcp__Atlassian__fetch` with a page ARI returns `metadata.version`, so cookies are not
needed for version reads. **Do not send them for this purpose.**
