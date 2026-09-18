# Global Search — full-suite coverage audit: Search Logic + Permissions (2026-09-18)

Re-checked the FULL suite against PRD 576978945 v1.5 (§6 Ranking, §7 Fuzzy, §9 role-based access) +
the engineering decision log. Cases read live this session; spec read live 2026-09-17 (unchanged since
2026-09-08).

## PART 1 — SEARCH LOGIC (§6 Ranking, §7 Fuzzy)

### Match quality (§6.1 shared)
| Requirement | Case | Status |
|---|---|---|
| Exact identifier +1.00 (and pinned) | C44850, C44843/44/46/49 | ✅ |
| Prefix name +0.70 > whole-word +0.50 > fuzzy +0.40 | C55707 | ✅ |
| Primary-name vs secondary-field +0.10 | C45139 (via contact match) | ✅ (see gap SL-2) |

### Entity signals (§6.1)
| Entity | Signals | Case | Status |
|---|---|---|---|
| Work Orders | open/active, recency 14d, assigned-to-me, viewed 7d, closed>90d demoted | C44851 | ✅ |
| Customers | ≥1 open WO, open-WO-count log-scaled, viewed 7d | C55708 | ⚠️ presence covered; COUNT-MAGNITUDE not (gap SL-1) |
| Assets | open WO, viewed, year>2015 tiebreak | C55709 | ✅ |
| Parts | in-stock, bin, sold 30d, viewed | C44852 + C55712 | ✅ |
| Vendors | open POs, used 30d | C55710 | ✅ |
| Part Sales | recency 7d dominant, Paid, created-by-me | C55711 | ✅ |
| Purchase Orders | Ordered, recency 14d, created-by-me | C45137 | ✅ |
| Vendor Invoices | Unpaid, recency 30d | C45138 | ✅ |
| Clamp + ties broken by recency | C55716 | ✅ |

### Cross-entity + contextual (§6.2, §6.3)
| Requirement | Case | Status |
|---|---|---|
| Group display order | C44827, C44830 | ✅ |
| Within-group score desc | C44851 | ✅ |
| Top >0.95 pinned single row | C44850, C44830 | ✅ |
| Customer-page bias +0.20 | C44853 | ✅ |
| WO-page: parts-on-WO −0.10, same-category +0.05 | C44854 | ✅ |

### Fuzzy (§7)
| Requirement | Case | Status |
|---|---|---|
| Identifier normalization (WO/VIN/phone/part/P#) | C44843/44/45/46/49 | ✅ |
| Trigram typo | C44839/40 | ✅ |
| Damerau transposition | C44841 | ✅ |
| Short-query stricter threshold | C55713 | ✅ |
| Phonetic fallback | C44842 | ✅ |
| Exact-only identifiers (WO/VIN/part/P#/PO#/invoice#) | C44844/46/47/49 + C55714 | ✅ |
| Fuzzy on part descriptions | C55715 | ✅ |
| Soft-match visual indicator | C44848 | ✅ |

### Search-logic gaps (both minor)
- **SL-1** — Customer *open-WO-count magnitude*: spec §6.1 says the open-WO count is log-scaled (more
  open WOs ranks higher). C55708 tests presence-of-open-WO, not "more opens ranks above fewer opens."
- **SL-2** — Primary-vs-secondary field bonus generalised beyond contacts: C45139 proves it for a
  contact-field match; not proven for a plain case (e.g. a part matched on its NAME ranks above a part
  matched only on a tag/description).
**Verdict: search logic is effectively fully covered; SL-1 and SL-2 are small refinements.**

## PART 2 — PERMISSIONS (§9 + Custom Roles risk)

### Covered today (folder 6734, 12 cases)
Both directions for all six gates (Work Orders / Part Sales / Customers+Assets / Parts / Vendors+POs+VIs
/ See Financial Data): C44877–C44882, C55702–C55706. Plus tenant isolation (C44880), TimeClock-only
(C44882), recent-list access (C55717).

### Why "spec-complete" is NOT "safe" here
§9 is one paragraph; the real permission surface is the **Custom Roles & Permissions** system (epic
SV-7388, ~515 cases). The engineering comment (2026-08-12) says search filtering follows THAT spec.
After Custom Roles ships, the ways a permission can wrongly hide/leak a search result multiply. These
are derived-invariant gaps (Rule 96), grounded in §9 "all result fields must respect role-based-access":

| # | Scenario NOT yet tested | Why it can bite | Grounding |
|---|---|---|---|
| **PERM-A** | Typing the EXACT number/ID of a record you lack permission to see must NOT surface it — no pinned top-hit, no row | The exact-ID path pins a result ABOVE the groups (§6.2); if permission is checked on the group path but not the pin path, an ID match could leak a forbidden record at the very top | §9 + §6.2 |
| **PERM-B** | A contact-field match must be hidden when the parent company's view bundle is absent (a customer contact match needs Customers:View; a vendor contact match needs Vendor & Order Management:View) | Contact matches return the COMPANY row (§4); a permission check that only looks at the matched field could leak a company via its contact | §4 + §9 |
| **PERM-C** | A role missing SEVERAL bundles at once hides ALL those groups together, and the groups it still has appear normally with correct counts | We only test one-bundle-missing at a time (C44882); real Custom Roles are combinations | §9 |
| **PERM-D** | A permission-hidden record must not leak through FUZZY matching either (a typo query that would match a forbidden record returns nothing for it) | Fuzzy widens what matches; a filter applied before fuzzy expansion could behave differently | §9 + §7 |

### Permission QUESTIONS (need Custom Roles spec / PO — cannot invent)
- **PERM-E** — Record-level "own records only" scoping: does Custom Roles have a "see only your own
  work orders / customers" style permission, and must search honour it (show only the user's own
  records, counts reduced accordingly)? C44880 covers tenant-level only. If such a permission exists this
  is a whole family of tests.
- **PERM-F** — Page-search (in-page list) permission parity: the decision log says page search = same
  permissions, but the page-search story SV-9306 is obsolete while its verify task SV-9311 is open. If
  page-search cutover ships, permission filtering must be tested there too.
- (already open) quick-action button permission gating (§5.4, spec silent); location/workplace scoping
  (OPEN-QUESTION-location-scope-2026-09-18.md).

## Recommendation
- Add the 4 grounded permission tests **PERM-A..PERM-D** (folder 6734) and the 2 small search-logic
  refinements **SL-1, SL-2** (Ranking folder) — 6 new cases, same shape/standard as the rest, added to
  the run, not-yet-build-verified.
- Raise **PERM-E, PERM-F** (+ the two already-open ones) with the product owner / Custom Roles spec
  before writing anything for them (Rule 58 — do not invent).
