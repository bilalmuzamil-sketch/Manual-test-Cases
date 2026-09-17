# INTAKE — Permissions (6734) + Ranking (6726) + Fuzzy (6725), 41 cases

**2026-09-17. Read the 41 REAL case bodies before doing anything (Rule 112), pulled live from TestRail
and saved beside this file as `case-bodies-41.json`.** Counts confirm the handoff exactly: 6734 = 12,
6726 = 15, 6725 = 14, all ours (`created_by = 3`), 41 total, no foreign cases in any of the three.

---

## 🔴 1 · THE HANDOFF'S FUZZY SECTION IS STALE — THE CASES SAY SOMETHING ELSE

The handoff §3 asks for **work order `S2-15276`**, with `S2-15286` / `S2-15266` absent.
**No case says that any more.** C44843, C44847 and C44850 all name **`S2-15430`**, and C44847's near
miss is **`S2-15431`**.

That is not a discrepancy to resolve — it is *this session's own correction from earlier today*, made
on the QA lead's approval under the identifier-correction rule: `S2-15276` **cannot exist**, because
work-order numbers are assigned by the branch. The handoff was written from the pre-correction text.

**Seeding `S2-15276` would therefore be actively wrong** — it would recreate the false-failure the
correction removed. **The case text wins.**

## 🟢 2 · MOST OF THE FUZZY FOLDER IS ALREADY SEEDED AND WAS PROVEN TODAY

The 39-check verifier (`build/global-search/seeding/verify_gsv2.py`) passed in full on
`v26.36.7-29ca209` **today**, and it already covers, by identity rather than by row count:

| Case | What it needs | State |
|---|---|---|
| C44839 | `Petersn` → Peterson Hauling | ✅ seeded, verified |
| C44840 | `Abrige` → Aabridge Freight | ✅ seeded, verified |
| C44841 | `frieghtliner` → Freightliner assets | ✅ seeded, verified |
| C44842 | `Filbridge` → Fibridge | ✅ seeded, verified |
| C44843 / C44847 / C44850 | `S2-15430` pinned; `S2-15431` absent | ✅ verified, incl. the record OPENS |
| C44845 | phone `(264) 328-6723` / `2643286723` | ✅ seeded, verified |
| C44846 | part number `65547` | ✅ seeded, verified |
| C44849 | `P2-58` found, `P2-59` absent | ✅ verified (and it is the fragile one — recheck before running) |

**So the Fuzzy folder's remaining work is small:** C44844 (an asset with a recorded VIN — a VIN is
already seeded and verified, needs confirming it is the one the case wants), C44848 (needs no data
beyond a fuzzy-reachable record, which exists), **C55713** (a 2–3 letter name AND a 4+ letter name,
each one edit from a query), **C55714** (the case names PO **`S9-25987`** — the handoff said "provide a
real PO number", but the case already picked one; it must be confirmed to exist, plus a vendor invoice
number), and **C55715** (a part whose description carries a distinctive misspellable word).

## 🟡 3 · RANKING IS GENUINELY UNSEEDED — and the handoff's method for it is sound

No ranking case names a literal except C44850's `S2-15430`. The handoff's rule — **one distinctive
keyword per case, shared only by that case's 2–3 records, differing in exactly one signal** — is the
right method and is what makes an ordering assertion trustworthy instead of noisy. Adopt it as written.

## 🔴 4 · PERMISSIONS CANNOT BE SEEDED FROM THE SESSION SUPPLIED — AND NEITHER CAN MOST OF THE REST

The session provided is a **technician-level login**. Measured, not assumed —
`GET /api/auth/me/fe-permissions` returns exactly **six** permissions:

```
customersView · scheduleView · woPickParts · woTechViewMode
workOrderLinesCreateAndEdit · workOrdersView
```

**What that rules out:**

| Needed for | Missing permission | Blocks |
|---|---|---|
| Create roles, assign staff | `rolesAndPermissionsCreateAndEdit`, `staffCreateAndEdit` | **All of 6734** — every reduced-permission user |
| Create parts | `catalogInventoryView` (+ create) | C44852, C55712, C55715, C44846 top-ups |
| Create part sales | `partSalesView` | C55711 |
| Create vendors, POs, vendor invoices | `vendorOrderManagementView` | C55710, C45137, C45138, C55714 |
| See prices | `seeFinancialData` | C55706's inverse |

It also returns **zero work orders** at the set location, so even the work-order ranking cases
(C44851, C55716) cannot be measured, let alone built, from this login.

**This is a proved blocker, and it blocks only what it actually blocks (Rule 68):** reading case text,
planning the manifest and writing the seed script all proceed without it — and have.

**What unblocks it:** a `PHPSESSID` captured from an **admin** browser session on `sv9160`, in the main
organisation. The documented `quick-login {key:'admin'}` recovery would also work **but evicts whoever
else is on the branch (Rule 83)** — including the QA lead's own browser — so it is not taken
unilaterally while he is actively working in it.
