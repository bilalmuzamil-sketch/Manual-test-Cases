# Global Search PRD 576978945 — v1.2 (Confluence version 11), read 2026-08-25

Full body is versioned at Confluence (page 576978945, version 11, in-body label "1.2",
Last Updated 8/25/2026). This snapshot captures the load-bearing deltas vs the v1.1 our
suite was authored against. Epic SV-9160 header now reads "16 stories" (live: 17 Story +
7 verify Tasks SV-9307–9313; SV-9306 page-search cutover added).

## Change log entry (verbatim), 2026-08-25, Branko Cicovic — v1.2:
Migrated all design references from Figma to Claude Design + interactive prototype link.
Added Contacts, Purchase Orders and Vendor Invoices to scope (§4, §5.2, §5.3, §6).
Recorded the "Show all" full-page handoff decision and its results banner (§5.2).
Removed AI from scope entirely (§2, §5, §8) and replaced the modal placeholder copy.
Moved quick actions out of v1 scope — documented §5.4, not built, no stories.
Added mobile requirements (§5.6), Non-Goals (§2), and the contact-field match rule (§4).
Specified `Clear all` on web and mobile, returning the panel to the first-time state (§5.2/§5.6/§8).

## Deltas that change our suite (v1.1 → v1.2)
1. **Show all N — BACK IN V1 (§5.2).** "When a group has more [than 5], a `Show all N` link
   appears to the right of the group header. Clicking it CLOSES the modal and navigates to that
   entity's list page with the query carried over," with a banner "Showing **N work orders**
   matching **«query»**" and a `Clear search` action; the list page's own inline search stays empty.
   Implemented for Work Orders in the prototype; each remaining entity list needs the same treatment.
   → REVERSES our D15 (tabs-only). Restore Show-all cases.
2. **Quick actions — OUT OF V1 (§5.4, §2 Non-Goals).** "Not in v1 … not part of the v1 build and
   carries no v1 stories." → REVERSES our D18. Move hover/quick-action cases to Out-of-V1.
3. **AI — removed entirely (§2/§5/§8).** Our no-AI cases already align; keep as V1 negatives.
4. **Modal placeholder copy (§5.1):** "Search work orders, customers, parts and more". Collapsed
   header trigger: "Search customers, work orders, parts…". Mobile (§5.6): "Search everything".
5. **Scope tabs (§5.2):** ten tabs — All · Work Orders · Customers · Contacts · Assets · Parts ·
   Vendors · Part Sales · Purchase Orders · Vendor Invoices; each carries its full-set count.
6. **Contact-field match (§4):** secondary line label is **"Contact match"**; a query reaching both
   returns TWO rows (the contact in Contacts + the company in its group with the label); neither
   suppresses the other.
7. **Clear all (§5.2/§5.6/§8):** first group header carries `Clear all`; empties the whole history;
   panel then falls back to the FIRST-TIME state (helper text + three quick-create). Web AND mobile.
8. **Mobile (§5.6):** full-screen (not a modal), `Cancel` in the top bar, no keyboard-hints footer,
   placeholder "Search everything". Scope = a horizontal CHIP row shown only once there is a query,
   listing only entity types that matched, each with a count. Results NOT capped per group, NO
   `Show all` (scroll the full grouped list). Group headers stick while scrolling. Tap opens the
   record. First-time / recent / no-results as §5.2 with quick-create stacked full-width. Clear all
   returns to first-time. DEFERRED on mobile v1: the full-page result handoff + banner, and keyboard nav.
9. **New entities' displayed fields (§5.3) + ranking (§6.1):**
   - Contacts — displayed: contact name (primary), owning company + telephone (secondary).
     Ranking: owning company has ≥1 open WO +0.20; called/viewed in 7d +0.10; primary contact +0.05.
   - Purchase Orders — displayed: PO number + vendor, status badge (Ordered/Received), total + date.
     Ranking: status=Ordered +0.30; recency 14-day half-life up to +0.25; created-by=current user +0.10.
   - Vendor Invoices — displayed: invoice number + vendor, status (Paid/Unpaid), total + date + type
     (Invoice/Sublet). Ranking: Unpaid +0.25; recency 30-day half-life up to +0.20.
   - Group order (§6.2): WO → Customers → Contacts → Assets → Parts → Vendors → Part Sales →
     Purchase Orders → Vendor Invoices.
10. **Telemetry (§6.4):** "schema in place from day 1 … mechanism only — no ML model in v1." NOTE:
    live epic shows SV-9167 (telemetry) in Board Backlog (our D20 deferred it). CONFLICT → PO question.
