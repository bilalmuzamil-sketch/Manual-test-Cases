# SOURCE CURRENCY — Report Suite — Fabian design-review reconciliation

## SOURCE CURRENCY — read 2026-08-17 (~19:20–19:35 UTC)

| Source | Identifier | Version / last updated | Date checked | Verdict |
|---|---|---|---|---|
| SBC spec | Confluence 577634305 | **v20**, edited 2026-08-12T19:10:14Z | 2026-08-17 | CURRENT (live). Our cases last aligned ~v17 → **STALE baseline folded in this pass** |
| SBR spec | Confluence 585629698 | **v22**, edited 2026-08-12T19:10:16Z | 2026-08-17 | CURRENT (live). Baseline stale |
| PV spec | Confluence 620888066 | **v10**, edited **2026-08-17T14:02:23Z (today)** | 2026-08-17 | CURRENT (live). Moved today — re-read at write start (Rule 59) |
| TU spec | Confluence 641400833 | **v9**, edited 2026-08-12T19:10:20Z | 2026-08-17 | CURRENT (live) |
| WIP spec | Confluence 703660034 | **v21**, edited 2026-08-14T14:46:28Z | 2026-08-17 | CURRENT (live). Baseline stale (large Adjustments + as-of delta) |
| IV spec | Confluence 720142338 | **v10**, edited 2026-08-13T14:43:14Z | 2026-08-17 | CURRENT (live). Baseline ~v5 stale |
| Epic + stories | SV-8582 | **114 children**, verified two ways (`parent=` 114 / `"Epic Link"=` 114, key sets EQUAL, no paging remainder); epic Open, updated 2026-08-10 | 2026-08-17 | CURRENT |
| Design (Claude artifact) | claude.ai/code/artifact/5da7345a-… (+ 42c35f46-…) | undated, editable share link | 2026-08-17 | **PARTIAL — could not fetch** (see note). Not datable → cannot displace a spec by recency. Escalated |
| Tech plan | — | not provided this pass | 2026-08-17 | MISSING — reminded (see OUTSTANDING) |
| PO answers (Fabian/Chris Loom review) | Loom-review change list, treated as dated PO answer | **2026-08-17** | 2026-08-17 | CURRENT — authoritative for this pass (latest wins, Rule 32) |

**Sources read at pass start: 2026-08-17 ~19:20 UTC · re-read at write start: (recorded in testrail-execution-log per batch) · verdict of second read: (per batch).**

### Full spec bodies fetched
Live storage bodies for all six specs saved to `specs/<RPT>-v-raw.json` and text-converted to `specs/<RPT>-v<RPT>.txt` (SBC 68k / SBR 86k / PV 56k / TU 47k / WIP 57k / IV 40k chars). These are the sources this pass diffs against.

### Design artifact — PARTIAL, honest note (Rule 12 / §1.4)
The QA lead supplied a Claude code artifact URL (`5da7345a-1c6f-41be-b1b5-db7d1930162e`; earlier `42c35f46-…`). WebFetch of a `claude.ai/code/artifact/...` URL is **not fetchable from this container** (it is an authenticated live editor page, not a static export), and it carries **no version and no date**, so under Rule 32/57 it **cannot be dated for recency** and does not displace the specs. **This pass proceeds from the six live specs + the verbatim Loom-review notes**, which is the authoritative product source for this pass. The design artifact is recorded PARTIAL and carried as an OUTSTANDING item (a dated export or screenshots are owed if any label must be pinned from it).

### The Loom-review change set → live sources (all confirmed present in the current specs and epic)
| Loom decision | Spec anchor(s) (live) | Owning story (live status) |
|---|---|---|
| Locked Estimates value tooltip (verbatim) | WIP **S5a-R2** (locked verbatim) | SV-8662 area / Story 5a (Fabian-signed) |
| Grouped totals as a math strip | *(spec silent on "math strip" wording)* — Loom-sourced, disclose | — |
| Amber glow on active tab | *(spec silent)* — Loom-sourced, disclose | shell SV-8593 |
| Column header labels wrap to two rows | SBR/TU mention wrap; *(exact "two rows" is Loom)* | shell SV-8593 |
| Asset hides "(no unit #)" — VIN alone | SBC **S8-R7/R8**, WIP asset col | SV-8610 / WIP Story 4 |
| Single "as of" date on WIP and IV | WIP **S7-R6/R7/R8/R8a**, IV **Story 5** | **SV-9214** (In Progress) |
| Adjustments column — WIP & SBC (SBR already) | WIP **S4-R29/R30/R21/R14/R2**, **S5-R13**, **S6-R2**, **S11-R8/R9**, **S4a**; SBC **S7-R6/S8-R12/S13-R4/S14-R4/R5/S15** | **SV-9282** (WIP), **SV-9280** (SBC), **SV-9281** (SBR) — all TESTING QA |
| CSV carries filter-summary metadata (all six) | IV **S10-R15a**, PV **S6-R11a**, (+ per-report anchors) | **SV-9283** (Code Review) |
| "Labor Delta" rename (was "Inv. Hrs") | SBC **S12-R1**, SBR **S3/§Terminology**, WIP **S4-R1** | **SV-9071** → **SV-8610** (SBC), **SV-8626** (SBR) |

Every Loom decision is confirmed in the live sources — the specs are ahead of our last case baseline, so this is a **spec-delta reconciliation**, not un-sourced authoring. Items marked *(spec silent)* are sourced from the 2026-08-17 Loom review and disclosed per Rule 56.

## OUTSTANDING — what I need from you
1. **Design artifact (Fabian's Claude design)** — could not fetch the `claude.ai/code/artifact` URL from this environment and it is undated. *Blocks:* pinning any exact on-screen label (amber-glow color, math-strip layout) from the design; those stay Loom-sourced and marked VIU-confirm. *Owner:* QA lead — a dated export/screenshots would let us pin labels. *Since:* this pass.
2. **Engineering tech plan** — not provided this pass (standard input, Rule 30). *Blocks:* edge-case/API-contract strengthening on the Adjustments money model. *Owner:* QA lead.
3. Build verification is **deferred by instruction** — every touched case carries `AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026` and awaits the later build-verify sync.
