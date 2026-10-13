## GS.5 — UNBLOCKING RECIPES PROVEN 2026-09-15, AND THE FALSE BLOCKERS THEY REPLACE

Everything here was, at some point during that day, reported by me as impossible or as a product
fault. Every one turned out to be the harness. Read this before declaring anything blocked on a QA
branch.

### Driving Quasar controls (the staff editor, any q-select)

| Symptom | Cause | Fix |
|---|---|---|
| "The dropdown offers no options" | `element.click()` from `page.evaluate` never fires `mousedown`, which is what QSelect opens on | Drive it with `page.mouse.move` → `down` → `up`. Real events. (L0110) |
| The option list has 65 entries and picking one selects a person | The table BEHIND the dialog is itself `.q-item` rows; an unscoped selector reads it as the popup | Read options from the LAST `.q-menu` only, and **log the option TEXT** — the wrong list is obvious by its contents, invisible by its length (L0111) |
| "That role cannot be set" | The 10th/11th option is below the window; `scrollIntoView` scrolls the PAGE, not the popup | Scroll the popup's own container (`scrollTop`), then measure in a SEPARATE step, and use a tall viewport (1600×1400) |
| "The list never opened", six retries | The field click did not land; retrying the READ cannot fix a control that never opened | `ensureOpen()` — if no `.q-menu` exists, RE-CLICK the field, up to five times |
| Asking for "Service Advisor" sets "Senior Service Advisor" | Substring match; the longer name sorts first and contains the shorter | Exact option text first, substring only as fallback. Read the value back from the row afterwards, matching against the KNOWN name list and taking the LONGEST present (L0114) |
| "The edit dialog will not open" | The staff search box still held the previous term, so the row was not on screen | Clear the box (`Control+a`, `Backspace`) before typing; assert the row is found before clicking |

### Reading the search modal honestly

- **Park the mouse pointer** at (5,5) before every reading and **verify** with
  `document.elementFromPoint` — a pointer left where it clicked keeps a row hovered and produces a
  stable fake finding (L0117). This cost two wrong ticket descriptions.
- **Do not pre-choose a selector.** Dump every `data-test-id` in the panel. Recent items are
  `search_result_row_recent_today` / `_yesterday`; results are `search_result_row_<type>`; a pinned
  ID match is `search_result_row_pinned`; the empty state is `search_modal_no_results`. Counting one
  prefix chosen in advance is how a full panel reads as empty.
- **Hover ≠ active ≠ focused.** Test them separately; one regex called "highlighted" made a hover
  artefact indistinguishable from real keyboard focus.
- **Settle on the per-type counts**, never on the "All" total — the strip draws its total first
  (L0109).

### Identity, roles and impersonation

- `POST /api/switch-user {user_id}` — the id must be resolved **LIVE** from `/api/staff?search=`,
  not from a committed snapshot (a local `STAFF-LIVE.json` was missing the person entirely).
- Read identity from `GET /api/auth/me/fe-permissions`, field **`fe_permissions`** (snake case).
  Reading only `fePermissions` returns "0 permissions", which looks like an account that can do
  nothing.
- **Never clear localStorage** to force a re-read — it signs the app out, and the resulting "search
  is unreachable" looks like a permission result.
- Measured permission counts: time_clock_user 3 · sales_representative 8 · service_advisor 25 ·
  office 26 · parts_technician 28 · parts_manager 31 · administrator 43.

### Seeding

- Part sale: `POST /api/part-sales {company_id}` → 200. Findable in search within ~9s.
- A 201 is not proof a write landed: `POST /api/vehicles/change` accepts `model_name`, answers 201
  and silently drops it. **Read the field back.**

### The general rule these all share

Every entry above began as "the product cannot do X". Each was my instrument. Before writing that
sentence, run `python3 build/testing-tools/finding_gate.py --check <evidence.json>` — six questions,
each drawn from one of these.

---

