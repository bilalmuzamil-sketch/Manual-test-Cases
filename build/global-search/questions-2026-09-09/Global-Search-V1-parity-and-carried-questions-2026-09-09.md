# Global Search V2 — questions for the PO, engineer and designer

**Drafted 2026-09-09. NOT SENT** — a question sheet goes out last (Rule 66).
**8 questions need an answer.** Two further rows are kept visible with no answer needed.

Each question is written three times for three readers. **The PO only needs the first block.**

---

## PO-GS-SUBSTR-1 — Searching by plate, part number or VIN

**For the PO.** Today, if you type only PART of a number, we still find the record. Typing 4310 finds part AC-4310-XL. Typing the last six characters of a vehicle's VIN finds that vehicle. In the new search, must that still work - or will people have to type the whole number exactly? This is the biggest risk of the new search being a step backwards: if people must type the whole number, everyone who searches by a few digits today stops finding anything.

**Options.** (a) a partial number still finds the record, as today; (b) the whole number must be typed exactly

<details><summary>Technical detail (for the engineer)</summary>

V1 match is pure substring: useGlobalSearch.ts:90-92 does entry.search.toLowerCase().includes(query.replace(/\s+/g,'')) over a haystack built in SQL (lowercased, spaces stripped). Identifiers in that haystack: vin, licence_plate, unit (FetchDataQueryHandler.php:290-292); part_number BOTH hyphen-stripped and intact (:326-327); WO raw_number plus 5 shop-id variants (:95-111). V2 cases GS-FUZ-06/08/11 say identifiers 'require an exact match after normalization'. NEED: does the V2 matcher evaluate equality (normalized_term == normalized_identifier, e.g. an OpenSearch keyword term query) or containment (identifier CONTAINS term)? Equality is a functional regression against V1.

</details>

**For the designer.** If a partial identifier match is kept, does a partial hit need to look different from a full hit on the result row (the way a soft/fuzzy match is indicated in GS-FUZ-10)?

*Needed from Branko / Milos (PO), with an engineer to confirm the matcher. Open since 2026-09-09.*

---

## PO-GS-PARTSALE-1 — Who can see Part Sale results

**For the PO.** A person whose role covers Part Sales but NOT Work Orders is sent Part Sale results by the system, but the screen then hides them - so they see nothing. Should the new search keep this exactly as it is, or should such a person actually see their Part Sales? If we quietly tidy it up, we change who can see what.

**Options.** (a) keep today's behaviour unchanged; (b) let a Part-Sales-only person see Part Sale results

<details><summary>Technical detail (for the engineer)</summary>

The two layers gate the same rows on DIFFERENT sources. Backend: FEPermissionEnum::partSalesView (FetchDataQueryHandler.php:45, applied in filterWorkOrderRowsByArea :199-208). Frontend: getPermittedRoutesMap().WorkOrders (routingService.ts:80). So partSalesView && !WorkOrders yields rows over the wire that the client discards. Unifying the gate changes observable behaviour for that role and must be a decision, not a refactor side-effect.

</details>

**For the designer.** No design input needed.

*Needed from Branko / Milos (PO). Open since 2026-09-09.*

---

## PO-REG-6 — Searching a work order by its status

**For the PO.** You can find work orders today by typing their status - for example 'qualitycheck' or 'qc' brings back work orders that are in quality check. Was taking that away a deliberate decision? It was removed from the specification without a note, so we cannot tell if it was on purpose. If it was accidental, people lose a way of searching they use today.

**Options.** (a) the removal was intended; (b) it was accidental and status should stay searchable

<details><summary>Technical detail (for the engineer)</summary>

V1 concatenates wo.status into the WO haystack with underscores stripped, and special-cases quality_check to the literal 'qualitycheckqc' so both 'qualitycheck' and 'qc' match (FetchDataQueryHandler.php:113-116). At PRD v11 status was listed among the WO indexed fields; at v12 it was removed from section 4 with NO change-log entry.

</details>

**For the designer.** No design input needed.

*Needed from Branko / Milos (PO). Open since 2026-08-26.*

---

## PO-REG-1 — How search decides what you are allowed to see

**For the PO.** Search reuses the SAME permission list that the whole application uses to decide which pages you can open - about twenty other places rely on it, including where you land after logging in. Please confirm the new search will NOT change that shared list just for search. If it does, it can affect which pages people can open and where they land after login, far beyond search itself.

**Options.** (a) leave the shared list alone and give search its own rules; (b) change the shared list (needs a full re-test of navigation and login)

<details><summary>Technical detail (for the engineer)</summary>

routingService.ts getPermittedRoutesMap() is shared by ~20 router guards and the post-login redirect. SEARCH_TYPE_PERMITTED (routingService.ts:78-86) is layered on top of it. Re-gating search by editing that map is high-collateral; a search-local gate is the safe shape. Note the existing fail-safe: isSearchTypePermitted returns false for any unmapped type (:94-99), so a new BE entity cannot leak before its FE mapping is added - please preserve that default-deny.

</details>

**For the designer.** No design input needed.

*Needed from Branko / Milos (PO), with an engineer. Open since 2026-08-26.*

---

## PO-REG-2 — Time Clock users and search

**For the PO.** Someone whose role is Time Clock gets no search results at all - search comes back completely empty for them. Should that continue? This is an access boundary and the new specification does not mention it, so if it changes by accident Time Clock users could suddenly see customer and work order information.

**Options.** (a) keep Time Clock users seeing nothing; (b) let them see some results (please say which)

<details><summary>Technical detail (for the engineer)</summary>

FetchDataController.php:50-51 short-circuits on the role NAME: role.getName() == DefaultRoleNameEnum::TimeClock returns [] before normalization, independently of the FE permission bundles the handler otherwise gates on. A permission-bundle-only rewrite in V2 would silently drop this, because a Time Clock role may still resolve some view bundles.

</details>

**For the designer.** No design input needed.

*Needed from Branko / Milos (PO). Open since 2026-08-26.*

---

## PO-REG-3 — How many characters before search starts

**For the PO.** Search waits until you have typed at least two characters before it looks for anything. Should the new search keep that? The new specification sets a new typing delay but never states a minimum, so we cannot tell whether two is still intended. Related: today, when nothing matches, search shows your recent items rather than a 'no results' message.

**Options.** (a) keep two characters; (b) a different number (please say which)

<details><summary>Technical detail (for the engineer)</summary>

useGlobalSearch.ts:69-71 returns permittedHistory(history) when query.length < 2, and :229-231 ALSO returns history when the result set is empty - so V1 has no distinct empty state on either path. V2 specifies a real no-results state, which is a deliberate change. V1 debounce is 350 ms (GlobalSearch.vue:17 input-debounce); V2 section 8 sets 150 ms.

</details>

**For the designer.** The new no-results state replaces V1's 'show recent items instead' behaviour - please confirm the empty state is intended to appear where recents appear today.

*Needed from Branko / Milos (PO). Open since 2026-08-26.*

---

## PO-GS-ASSET-SHOWALL — 'Show all' on asset results

**For the PO.** Not yet built - this is about the new search only. Do asset results get a 'Show all' link inside the search panel, now that the separate full-page results view was dropped? This reverses an answer given earlier over Slack, so we would like it confirmed in writing. Our test cases follow the newest specification meanwhile.

**Options.** (a) yes, assets get 'Show all'; (b) no, they do not

<details><summary>Technical detail (for the engineer)</summary>

Spec v1.4 dropped the full-page hand-off; the in-modal Show all remains for the other groups. Cases follow v1.4 (Assets DO get it). Affected case: C44825.

</details>

**For the designer.** Please confirm whether the Assets group renders the 'Show all N' affordance in Design System 14, so spec and design agree before build.

*Needed from Branko (designer + PO). Open since 2026-09-07.*

---

## PO-GS-EMPTY-1 — Wording shown before you type anything

**For the PO.** Not yet built - this is about the new search only. Which wording is correct: 'Search for something', or 'Type to start searching for work orders, parts, customers and more'? The specification and the design say different things, so one needs to win. Our test cases follow the specification meanwhile.

**Options.** (a) the specification wording; (b) the design wording

<details><summary>Technical detail (for the engineer)</summary>

Spec section 5.2 states 'Search for something'. Design System 14 global-search.jsx renders the longer string. Cases follow the spec (Rule 57); the design lag is the finding, not a reason to change the case.

</details>

**For the designer.** This is a design-vs-spec copy conflict in your own artefact - please align global-search.jsx with the spec, or tell us the design wording is the newer intent.

*Needed from Branko (designer + PO). Open since 2026-09-02.*

---

## No answer needed — kept visible for completeness

### PO-REG-4 — Recording that someone used search

NO LONGER NEEDED - answered by the specification itself. Version 1.5 removed all of the new tracking from the project, so there is no clash with the existing usage event; it simply stays as it is.

*Technical note:* V1 fires a GA trackEvent('global_search_use') on select (GlobalSearch.vue:211-217), before the already-on-record guard, so it also fires on a no-op re-select. v1.5 deleted section 6.4 and the impression/click logging from section 8, so nothing competes with it.

### PO-REG-5 — The order results appear in

NO INPUT NEEDED - recorded for completeness. The new search introduces proper ranking, which we treat as an intended improvement rather than something broken.

*Technical note:* V1 order is arrival order: WO rows are ORDER BY wo.start_date DESC (FetchDataQueryHandler.php:124); the other four queries have no ORDER BY at all, so their order is whatever MySQL returns. Group headers land at first-match position, so group order is query-dependent.
