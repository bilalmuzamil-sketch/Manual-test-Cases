# Custom Roles & Permissions Evolution Tracker

A permanent QA record of how ShopView's Custom Roles & Permissions were **specified**, how they are
**implemented**, and what **each release changed**, with the regression impact of every change.
The original PRD is never edited; this tracker sits beside it.

| Layer | What it is | Evidence level |
|---|---|---|
| Original PRD | Confluence 565116952 **v7**, first published 2026-06-01 | Documented intent |
| Latest PRD | Confluence 565116952 **v54**, 2026-07-16 (reference only) | Documented intent |
| Implementation baseline | `ShopView/shopview` **v26.43.3 @ 439ddb6**, measured on production 2026-10-29 | Repository analysis |
| Release snapshots | One per future release, added by Track Changes after review | Repository analysis |
| Verification | Statuses QA records in the portal | Observed by QA |

**Repository analysis is never presented as verified behaviour.** Verification statuses in the
portal are the only "observed" layer, and they start at *Not Tested*.

---

## Why version 7 is the original baseline

- v6 (2026-05-13) reads **"Status: Draft"**; v7 (2026-06-01 13:15 UTC) is the **first version that
  reads "Status: Published"** (Confluence diff v6→v7).
- v7→v10 changes only the Change Log (2 additions, 1 deletion), so the requirement text is identical.
- Engineering's locked spec in the product repo reads *"Locked 2026-06-02 after iterative sign-off"*.
- Confluence approvals are switched **off** on the page (`approvalsEnabled: false`, empty
  history). There is no formal approval record, and "Published" is the strongest evidence that exists.

Every v7 matrix row (39) and every quoted sentence (58) is re-checked word for word against the
saved v7 source on each build (`prd/build_prd_snapshot.py` → `verbatim_check`).

---

## Layout

```
prd/source/            the PRD versions, saved verbatim from the Confluence version API
prd/build_prd_snapshot.py   original PRD (v7) → snapshot; self-verifies against the v7 source
prd/parse_prd_markdown.py   any later PRD version (markdown export) → snapshot
tools/php/dump_permissions.php  loads the product's own permission classes from git at a commit
tools/extract_impl.py  implementation snapshot of a commit (never the working tree)
tools/engine/compare.js   THE comparison engine (browser and command line share it)
tools/snapshot_store.py   append-only store: write-once, read-only, SHA-256 registry
tools/track_changes.py    scan → review → confirm
tools/validate.py      validation suite (18 checks)
tools/build_history.py reconstructed release history before the baseline
snapshots/             recorded snapshots + registry.json   (never edit by hand)
reports/               change reports, history, VALIDATION.md
portal/                the portal page; build_portal.py assembles dist/
```

## What an implementation snapshot reads

| Fact | Source in the product repo |
|---|---|
| Permission catalog (61) | `FEPermissionEnum` |
| System-role defaults (11 roles) | `RoleFePermissionMappings::getMappings()` |
| What each permission grants on the server | `FEPermissionMappings::getMappings()` (permission → atoms) |
| Dependencies the server enforces | `FEPermissionCascade::IMPLIED_PARENTS` |
| Editability, clock-in, Office's editable carve-out | `Role::getUneditableTemplates()`, `getClockCapableTemplates()`, `getOfficeEditableFEPermissions()` |
| API authorization (606 routes) | every `#[Route]`/`#[Get]`/`#[Post]`… with its `#[IsGranted]` (incl. expressions), in-method `isGranted`/`denyAccessUnlessGranted`, voters and resolvers (followed one hop), and direct permission checks |
| Front end | on-screen labels (`labels.ts`), every file that reads a permission code, and a comment-stripped fingerprint of the role editor's cascade logic (`cascade.ts`) |
| Ticket leads | Jira keys written next to each permission and role default |

The PHP classes are **executed** at the commit (loaded through `git show`), so the defaults and
mappings are exactly what that release ships, not a text approximation.

---

## Track Changes: recording a release

```bash
cd build/custom-roles-tracker/tools
python3 track_changes.py scan --production          # or: --ref v26.44.0, or --build-marker v26.44.0-abc1234
#   → reports/<previous>__to__<release>.md / .json and a pending snapshot
#   → review it (the portal's Track Changes view shows pending scans after a portal rebuild)
python3 track_changes.py confirm impl-v26.44.0 --by "Name"           # changed release
python3 track_changes.py confirm impl-v26.44.0 --by "Name" --checkpoint   # no-change release
cd ../portal && python3 build_portal.py --measure-production         # then republish the portal
```

What it guarantees:

- The release is pinned to its **exact commit**. A build marker whose commit is not in the repository
  **stops** the scan and asks; it never guesses.
- It compares by **meaning**. Comments, reordering and formatting produce no change (proven by `validate.py`).
- A release **already recorded is refused**, so there is no duplicate tab.
- A release with **no permission-related change** cannot be recorded as a changed-behaviour snapshot.
  It can be recorded only as a no-change checkpoint.
- A snapshot is **never recorded unreviewed**: `confirm` refuses without its change report.

The portal cannot read the repository itself, because a browser can't. Its Track Changes view shows
recorded and pending scans, reviews them with the same engine, lets QA **request** a scan and lets an
Editor **approve** one. A tracker run (this command, run by a person or by Claude) does the scan and
the recording.

## Storage, integrity, sharing

- `snapshots/<id>.json` is written once and made read-only. `registry.json` is append-only and pins each
  file by SHA-256. `python3 tools/snapshot_store.py verify` re-proves every hash, and the portal build
  refuses to run if any hash fails.
- The portal's shared database holds only what people add: verification statuses (Contributors and
  up), approval evidence (Editors), and scan requests. Snapshots never live there, so nothing in the
  database can rewrite history.
- **Where the tracker lives is still to be decided** (see the hand-over note): this repository is
  public, so the PRD text and the API map must not be committed here.

---

## Known limitations

1. **Front-end dependency logic** (`cascade.ts`) is compared by fingerprint, not rule by rule. A change
   is reported for QA to re-test the editor; the server cascade is compared rule by rule.
2. **Voters and resolvers** are followed one hop. Four voters check login, ownership or the admin
   portal rather than role permissions, and are listed by name.
3. **Data scoping** (for example, Technicians seeing only their own data, keyed off the role template)
   is query-layer code and is not extracted.
4. **Existing tenants:** the defaults are what a release *seeds*. The server does not re-normalise roles
   saved earlier, and shops can edit roles, so a live organisation's roles can differ.
5. **Outside this repository:** the 15 accounting permissions and HR are enforced by the accounting
   service (`shopview-accounting`, not inspected). The customer and billing portals are separate
   applications.
6. **PRD parsing:** the matrix, setting descriptions, dependencies, a few rules and the change log are
   structured. Long sections (Tech View restrictions, Digital Inspections, notes) are kept as text.
7. **Approvals:** none are recorded yet. The portal shows *Not Documented* until someone enters
   evidence, and never infers approval from a merge.
8. **Reconstructed history** (before the baseline) is repository evidence between release tags, not
   confirmed snapshots. Ticket and PR numbers come from commit messages and are leads.

## Evidence coverage at the baseline (v26.43.3)

| Item | Count | Covered |
|---|---|---|
| Permissions with label, group, default holders, server atoms | 61 / 61 | ✅ |
| System roles with defaults, editability, clock-in | 11 / 11 | ✅ |
| Server dependency rules | 29 | ✅ |
| API routes read | 606, of which 505 guarded | ✅ |
| Permissions with server enforcement found in this repo | 46 / 61 | The 15 accounting area permissions are enforced by the accounting service (one is also checked directly here). `timesheetsView` has **no** server check anywhere (front end only) |
| Original PRD settings with verbatim description | 44 / 44 | ✅ |
| Original PRD matrix rows / quotes verified verbatim | 39 / 39 · 58 / 58 | ✅ |
| Track Changes validation | 18 / 18 checks | ✅ (`reports/VALIDATION.md`) |
