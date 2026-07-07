# Custom-Role Permissions Assessment — Fees & Discounts V1 and Simple Flow

> Question answered: for each feature, are its Custom-Role permissions properly
> **DEFINED** (and reusing existing permissions), or does the feature **REQUIRE new
> custom permission definitions** to be created?
>
> Verdict in one line each:
> - **Fees & Discounts V1 — DEFINED.** Reuses existing Custom-Roles permissions;
>   introduces **no** new permission. Two existing gates need tightening at build.
> - **Simple Flow — REQUIRES DEFINITION.** No role/permission matrix exists; the
>   roles for completion vs bulk-receive vs settings vs review are undecided, and the
>   Story-16 review sign-off gating is specifically undefined.

---

## 1. Fees & Discounts V1 — permissions are DEFINED (reuse only)

**Source:** `build/fees-discounts/requirements.md` §10 (Story 13 / Jira SV-7388),
the action→permission mapping table.

Story 13 states explicitly (S13-R1): **"Fees & Discounts adds no permission of its
own."** Every action maps to an **existing** Custom Roles permission. There are two
independent gates — the **per-org feature toggle** (feature exists) **and** the
**permission** (what a user may do); a user needs both.

Permissions the spec names, and their status:

| Action | Permission required | Status |
|---|---|---|
| See fee/discount **dollar amounts** (sidebar card, WO line table, Statistics tab, Financial Info card, Part Sales column & viewer, customer documents) | **See Financial Data** (S13-R2) | EXISTING — reused |
| Add/edit/remove a **Whole Work Order** adjustment | **Work Orders: Create and Edit** (S13-R3) | EXISTING — reused |
| Add/edit/remove a **Labor Line or Part Line** adjustment | **Work Order Lines: Create and Edit** (S13-R4) | EXISTING — reused |
| Add/edit/remove a **Part Sale** part adjustment | **Part Sales: Create and Edit** (S13-R5) | EXISTING — reused |
| Any add/edit/remove (money-visibility prerequisite) | **also requires See Financial Data** (S13-R6) | EXISTING — reused |
| **Remove** an adjustment | part of **Create and Edit**, NOT the separate "Delete" (S13-R7) | EXISTING — reused (semantics clarified) |
| Create/edit/delete an adjustment **template** (admin Fees & Discounts page) | **Settings → Finance** (S13-R8) | EXISTING — reused |
| View/change a **customer's default** fees & discounts | **Customer Management: Create and Edit** AND **Manage Accounts Payable and Receivable** (S13-R9) | EXISTING — reused (both required) |
| See fee/discount entries in the **WO history log** | **View History Logs** (S13-R10) | EXISTING — reused |

**New permissions introduced by this feature: NONE.**

**Two existing gates to tighten when the model ships (S13.4 "current-build
differences"):**
1. The admin Fees & Discounts page is shown today to any user with a location
   (S7-R7b); S13-R8 tightens it to **Settings → Finance**.
2. The current build may use one WO-edit check where S13-R3/R4 **split** whole-WO
   actions (Work Orders: Create and Edit) from line-level actions (Work Order Lines:
   Create and Edit).

Story 13 is the **target** model (SV-7388, not yet released). Until it ships the
feature uses the matching existing checks; behavior is the same, only setting names
change. **Bottom line: DEFINED — reuse existing permissions, add none, tighten two.**

---

## 2. Simple Flow — permissions REQUIRE new definitions (undecided)

**Source:** `build/simple-flow/requirements.md` §8 Open Questions + completeness gap
#1 + Story 11 and Story 16 notes.

Simple Flow has **NO consolidated permissions/role matrix** (unlike Custom Roles or
F&D Story 13). §8 explicitly lists as UNRESOLVED:
**"Permissions — which roles do completion vs bulk receive vs settings vs review."**
Completeness gap #1 adds: *"There is no consolidated permission table … any
role-based test cases would be guesses."*

What the spec DOES anchor (functionally, not as a role matrix):
- **Settings** — Story 1 AC: non-admin users cannot see/modify Work Order settings
  (admin/owner only).
- **Receiving** — Story 11: the Receive action is "hidden for office/readonly users."
- **Review sign-off** — Story 16 (SV-7870): "Mark Reviewed" is described as
  **manager/foreman only**, but the spec flags **role-gating review (custom roles vs
  open for v1)** as an **OPEN item (⚠️ Design pending)** — i.e. the actual permission
  is undefined.

What is genuinely undefined and must be **created/decided**:
- Which role(s) may perform **Simple completion** (SF-PERM-02).
- Which role(s) may perform **Bulk Receive** (SF-PERM-03).
- Which role(s) may **change Work Order settings** (owner/admin implied, but not a
  formal custom-role permission) (SF-PERM-01).
- Which role(s) may **Mark Reviewed / sign off** and whether this is governed by a
  custom-role permission or open to all for v1 (SF-PERM-04, SF-PERM-07). **This
  Story-16 review sign-off gating (R7) is specifically undefined.**

**Handling in the test cases:** these role-gating cases are INCLUDED (not dropped),
each with a **best-defensible functional expected** written around behavior that IS
defined/observed (e.g. completion uses the same access as standard work-order
completion; receiving uses existing PO-receive access; office/readonly do not see
Receive per Story 11; manager/foreman sign off per Story 16). None asserts an
undefined custom-role outcome.

**Bottom line: REQUIRES DEFINITION — a permission/role matrix (completion, bulk
receive, settings, review sign-off) must be authored before these cases can be made
definitive; the Story-16 review sign-off gating is the specific undefined item.**
