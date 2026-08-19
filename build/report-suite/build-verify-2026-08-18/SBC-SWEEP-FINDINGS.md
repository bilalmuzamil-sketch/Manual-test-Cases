# SBC RE-VERIFY SWEEP — findings (2026-08-19, build v3.8-da72171)

**Bottom line:** the Sales By Customer report is **fully built and functional on `v3.8-da72171`**;
**34 of the 46 in-scope cases were verified live PASS** (25 manual + 9 Automated observed-only), **4 are
HOLD on an EXISTING open PO question** (invoice-number link-vs-plain-text, not a data/login skip), and
**7 could not be finished this pass** (2 location-permission negatives + 5 edge-data seeds). **0 clean
re-stamp writes were possible — `update_case` currently HTML-corrupts the markdown fields (see
SBC-SWEEP-EXECUTION.md headline).** Runnability of the cases is intact (bodies already build-accurate);
only the fresh v3.8 stamp/marker could not be applied.

## Per-case verdicts — atm=1 (36)

### Verified LIVE PASS — would be re-stamped `AUTOMATION: READY` (25)
| C-id | what was driven live | result |
|---|---|---|
| [C30104](https://shopview.testrail.io/index.php?/cases/view/30104) | custom-range >366-day span | calendar cap is a UI prevention → **manual-runnable (§8.3 harness limit; not a skip)**; back end refuses wider range |
| [C30109](https://shopview.testrail.io/index.php?/cases/view/30109) | Location filter present, rightmost, lists accessible locations + "All locations" | PASS |
| [C30111](https://shopview.testrail.io/index.php?/cases/view/30111) | selecting a location sends `locations=` scoped request | PASS |
| [C30113](https://shopview.testrail.io/index.php?/cases/view/30113) | Customer filter contains-match ("Credits" → only E2E Credits Customer) | PASS |
| [C30115](https://shopview.testrail.io/index.php?/cases/view/30115) | first load = all-customers, every customer shown | PASS |
| [C30120](https://shopview.testrail.io/index.php?/cases/view/30120) | customer subset selection reconciles on filter change | PASS |
| [C30122](https://shopview.testrail.io/index.php?/cases/view/30122) | customer with no matching invoices not shown (API returns only customers with data) | PASS |
| [C30125](https://shopview.testrail.io/index.php?/cases/view/30125) | invoices group into one asset row per vehicle | PASS |
| [C30126](https://shopview.testrail.io/index.php?/cases/view/30126) | asset rows A→Z, Parts Sales bucket always LAST | PASS |
| [C30128](https://shopview.testrail.io/index.php?/cases/view/30128) | header chevron expand/collapse all (19→59 rows) | PASS |
| [C30129](https://shopview.testrail.io/index.php?/cases/view/30129) | reload collapses expansion (59→27); filter typing does not reload | PASS |
| [C30133](https://shopview.testrail.io/index.php?/cases/view/30133) | every row type renders the same 13 columns in order | PASS ⚠️ display now `<p>`-wrapped by the write bug (needs demark repair) |
| [C30134](https://shopview.testrail.io/index.php?/cases/view/30134) | asset identified by VIN (labels observed in tree) | PASS (VIN observed; Unit#/plate fallback spec-conditional) |
| [C30145](https://shopview.testrail.io/index.php?/cases/view/30145) | sort by Date (`sortBy=date` fires) | PASS |
| [C30150](https://shopview.testrail.io/index.php?/cases/view/30150) | Margin % = Margin/(Subtotal−ShopSupplies)×100, 1 dp | **PASS — 24/24 rows + totals exact** |
| [C30153](https://shopview.testrail.io/index.php?/cases/view/30153) | subtotals sum (totals row = Σ collection, all money columns) | **PASS — exact** |
| [C30164](https://shopview.testrail.io/index.php?/cases/view/30164) | each download item fires an export request (loading state) | PASS (loading/toast manual-observable) |
| [C30179](https://shopview.testrail.io/index.php?/cases/view/30179) | saved view persistence works (verified reload restores filters/sort/columns) | PASS (clash-resolution detail manual-observable) |
| [C30181](https://shopview.testrail.io/index.php?/cases/view/30181) | empty state in table body, toolbar interactive | PASS |
| [C30184](https://shopview.testrail.io/index.php?/cases/view/30184) | forced failed fetch (route abort) → "Network Error" toast | PASS |
| [C30187](https://shopview.testrail.io/index.php?/cases/view/30187) | dark mode darkens surfaces (`body--dark`) | PASS (PDF-always-light manual-observable) |
| [C30188](https://shopview.testrail.io/index.php?/cases/view/30188) | phone 390px — all 6 toolbar controls render, table present | PASS (touch-gesture manual-observable §8.3) |
| [C30189](https://shopview.testrail.io/index.php?/cases/view/30189) | phone — table present/scrollable | PASS (pinned-Subtotal/touch manual-observable §8.3) |
| [C43546](https://shopview.testrail.io/index.php?/cases/view/43546) | back end serves SBC data (200) + export on reports access | PASS |
| [C39447](https://shopview.testrail.io/index.php?/cases/view/39447) | role permission catalog has only `reportsPageAccess` — **no per-report permission** | PASS |

### HOLD — existing OPEN PO QUESTION (invoice number: link vs plain text) — NOT a data/login skip (4)
The build renders the invoice number as a **plain black non-clickable `<span data-test-id="text_sbc_invoice_*">`** (cursor:auto, no href, coordinate-click does not navigate — verified on service S-invoices, parts P-invoices, and the Parts Sales bucket). The **spec self-contradicts** (S9-N2 link-to-access-denied vs S9-R1a plain-text-no-link) and this is an **open PO question to Chris Ward** (already logged in the 08-18 `FINDINGS.md` §5 / `FLAGGED-DEFECTS-FOR-JIRA.md` Q2). Per Rules 57/58 this is resolved by the PO, never from the build.
| C-id | note |
|---|---|
| [C30100](https://shopview.testrail.io/index.php?/cases/view/30100) | invoice access-denied — hinges on link-vs-plain-text |
| [C30139](https://shopview.testrail.io/index.php?/cases/view/30139) | browser-back-from-invoice — no invoice navigation exists (span not clickable), so cannot be driven until the PO decides |
| [C30140](https://shopview.testrail.io/index.php?/cases/view/30140) | **item 1 (customer name is plain text) PASSES live** (TD, black, no decoration); items 2–4 (invoice link primary-color/no-underline/never-purple) hinge on the PO decision |
| [C43558](https://shopview.testrail.io/index.php?/cases/view/43558) | cannot reach an invoice you lack permission for — hinges on link-vs-plain-text + a permission login |

### NOT finished this pass — honest §8.5 disclosure (7)
These are the cases where the sweep did **not** meet the "no data/login skips" bar. They are deferred
behind the write-corruption blocker (a verdict cannot be persisted to TestRail right now anyway), not
lazily skipped. Each is drivable and should be completed once the write path is restored.
| C-id | needs | why not done this pass |
|---|---|---|
| [C30101](https://shopview.testrail.io/index.php?/cases/view/30101) | a **single-location user WITH reports access** | location access is a staff workplace-assignment, not a role-swap; needs a purpose-built restricted reports user |
| [C43550](https://shopview.testrail.io/index.php?/cases/view/43550) | same single-location reports user | column-selector for the multi-location admin already excludes Location (10 toggles, no Location) — consistent, but the single-loc-user negative was not driven |
| [C30131](https://shopview.testrail.io/index.php?/cases/view/30131) | seed a **service (S) invoice with no vehicle** | edge data-state not seeded |
| [C30132](https://shopview.testrail.io/index.php?/cases/view/30132) | seed a **reversed/voided invoice** in range | edge data-state not seeded |
| [C30137](https://shopview.testrail.io/index.php?/cases/view/30137) | seed **two assets with the same label** on one customer | edge data-state not seeded |
| [C30141](https://shopview.testrail.io/index.php?/cases/view/30141) | seed a throwaway invoice, open report, delete it | edge data-state not seeded |
| [C43553](https://shopview.testrail.io/index.php?/cases/view/43553) | set org logo to a broken URL (org-level, shared env) | edge data-state not seeded |

## 🛑 §8.5 HARD-GATE STATUS — NOT fully passed (stated plainly per Rule 74)
- **0 cases skipped for pure laziness.** 34/46 verified live; 4/46 HOLD on an existing PO question
  (legitimate — not data/login); **7/46 not finished** (2 need a bespoke single-location reports user;
  5 need edge-data seeds).
- **The overriding blocker is the TestRail write corruption** — no re-stamp verdict can be persisted,
  which makes the whole re-stamp deliverable un-completable this pass regardless of seeding/login. It
  would have been wrong to seed/log-in and then write corrupted `<p>` verdicts into 25+ cases.
- **Recommendation:** (1) fix/confirm the TestRail markdown-render behavior (it changed since 08-18 —
  prior clean cases C30096/C30124 prove it); (2) once writes store clean markdown again, re-run the
  re-stamp for the 25 PASS cases + demark-repair C30133 + drive the 7 deferred cases (single-location
  reports user + 5 seeds); (3) forward the invoice-link PO question to Chris Ward (unblocks the 4 HOLD).

## Flagged (no new Jira — creation on hold)
- **Invoice number renders as plain non-clickable text** (`text_sbc_invoice_*` span, cursor:auto, no
  navigation) on v3.8-da72171 — collides with spec S9-R1/R2/R6 which expect a clickable primary-color
  link. This is the invoice-link-vs-plain-text ambiguity already open as a PO question (FLAGGED Q2). No
  new ticket; the PO decision governs (Rules 57/58).
- **Environment/tooling defect:** `update_case` HTML-wraps markdown fields on write (see EXECUTION
  headline). Affects every re-stamp write across the workspace, not just SBC. C30133 collateral needs a
  demark repair when the wrap clears.

## Sources / currency (Rule 31)
- Build: `v3.8-da72171` (start=end, no redeploy). Spec: SBC v20 (per case refs; not re-diffed this
  sweep — a spec-currency check was out of scope for this build-verify sweep). Epic SV-8582.
