# SV-8745 — Users cannot tag themselves in Work Order notes

**Verdict: PASS.** Tested 2026-09-30 on the QA branch `sv8745.qa.shopview.com`,
build **v26.39.1-068d31b**, with production **v26.39.2-1aeb22d** captured as the before-state.
All five acceptance criteria pass, and the reported fault was reproduced on production first.

---

## 1. Sources read

| Source | What it says | Read |
|---|---|---|
| **SV-8745** (Bug · TESTING QA · Medium · reporter Ryan Fyfe · assignee Stefan Mitrovic) | Customer Cody McCarthy / ShopView Truck Repair / 198 users, via Intercom. Users can no longer tag **themselves** in Work Order Notes, which breaks personal reminders. Five acceptance criteria. One attachment (`intercom-image-…png`, id 59115). | 2026-09-30 |
| **Attachment — the reporter's screenshot** | The **New Note** dialog on a work order: *Create note for → Work Order*, the box labelled *"You can @tag and notify another team member"*, **`@cody` typed and no suggestion list**. Behind it, a saved note shows a **highlighted mention of another person**, so tagging others worked. | 2026-09-30 |
| **Milos Vasic, 21 Aug (75478)** | *"This will be improvement as we didn't support this based on the code"* — i.e. the code never supported self-tagging. | 2026-09-30 |
| **QA handoff — Stefan Mitrovic, 29 Sep (77487)** | PR #3345 → main. Restores self-tagging in **Work Order and line notes** and keeps self-mentions in the existing notification/reminder flow. Review feedback addressed in commit **068d31bcea** — shared work-order type logic, legacy and event-payload tests, explicit self-mention email tests, small note-picker fixes. | 2026-09-30 |

The branch build marker is **`v26.39.1-068d31b`**, which matches the commit named in the handoff.

## 2. Builds

| | Build | `last-modified` | etag |
|---|---|---|---|
| Branch `sv8745.qa.shopview.com` | **v26.39.1-068d31b** | Tue, 29 Sep 2026 13:33:45 GMT | `095f0929d648f1437730b36865620a65` |
| Production `app.shopview.com` | **v26.39.2-1aeb22d** | Tue, 29 Sep 2026 09:36:08 GMT | `631482bb64cdcb1ec1f15b23ba76f192` |

Accounts: branch **Admin ShopView** (`admin@shopview.com`, user `6d71382d-4ddb-4707-a0f3-33b4bb78b0b8`);
production **Bilal Muzammil** (`bilal.muzamil@shopview.com`, user `1d610634-2618-4c70-9ce4-791f8d201642`).

## 3. Before — the fault reproduces on production

Work order **S2-917**, Notes tab, **New Note**. Typing into the note box, signed in as **Bilal Muzammil**:

| Typed | Suggestions offered |
|---|---|
| `@Bilal` — my own first name | **none** |
| `@bilal` | **none** |
| `@Muzammil` — my own surname | **none** |
| `@Ahtasham` — another person | **1 — Ahtasham Amjad** |
| `@Technician` — another person | **1 — Technician 1** |
| `@zzz` — control | none |

**The clearest single proof:** typing **`@B`** returns **one** name — **"Ahtesham ABCPROD"**, matched on the
B in the middle of *ABCPROD* — and does **not** return **"Bilal Muzammil"**, whose name *begins* with B.
The signed-in user is filtered out of the list. `@a` and `@e` each return ten names and neither includes
Bilal Muzammil. That is exactly the customer's report.

**Nothing was created on production.** The only write in the whole session was the login itself.

## 4. After — the fix branch, the five acceptance criteria

### AC 1 — a user can tag themselves, and the UI accepts it — **PASS**
Signed in as **Admin ShopView**, work order **S2-17358** → Notes → New Note:

| Typed | Suggestions offered |
|---|---|
| `@Admin` | **1 — Admin ShopView** (my own account) |
| `@admin` | **1 — Admin ShopView** |
| `@Admin S` | **1 — Admin ShopView** |
| `@ShopView` | **2 — Tech ShopView, Admin ShopView** |
| `@a` | 10 names, **including Admin ShopView** |
| `@Branko` | 1 — Branko Cicovic |
| `@zzz` | none |

Selecting my own name inserts `@Admin ShopView ` into the note. Saving returned
**`POST /api/note/create` → 201** with `mentions: [{referenceId: "6d71382d-4ddb-4707-a0f3-33b4bb78b0b8"}]`
— my own user id. **No error of any kind.**

### AC 2 — the self-mention goes through the existing notification workflow — **PASS**
The moment the note saved, the app raised its own notification back to me:
**"New mention from Admin ShopView — ZZAUTOTEST self tag @Admin ShopView"**.

### AC 3 — the notification is visible, with no silent failure — **PASS**
Opening the **Notifications** panel shows both self-mentions as unread entries:

```
Admin ShopView   Line: S-17358 #1 - Repair - CW Rotation Solenoid Valve On Valve Bank - Leaking
04:47 AM, Today   ZZAUTOTEST line self tag @Admin ShopView
Admin ShopView   Work Order: S-17358
04:45 AM, Today   ZZAUTOTEST self tag @Admin ShopView
```

### AC 4 — it works in the relevant create and edit flows — **PASS**

| Flow | Result |
|---|---|
| **Work-order note** (*Create note for → Work Order*) | self-tag offered, saved `type: "work_order"` → **201** |
| **Line note** (*Create note for → Line #1: Repair — CW rotation solenoid valve…*) | self-tag offered, saved `type: "work_order_line"` → **201** |
| **Edit an existing note** (note ⋮ → **Edit note**, dialog titled *Update Note*) | self-tag offered inside the existing text, saved `POST /api/note/update` → **200** |
| **Self-tag + a reminder date** (the personal-reminder case the ticket is about) | reminder **Sep 21, 2026** saved together with the self-mention → **201** |

A saved self-mention renders as a highlighted mention on the note card, in its own style
(`note-mention-self`, blue text on a yellow highlight) — the same treatment other mentions get.

### AC 5 — no regression: tagging other people still works — **PASS**
`@Branko` → **Branko Cicovic**, selected, saved with a reminder date →
**201**, `mentions: [{referenceId: "0ded4e31-40f3-4f29-b860-e2bf114b27dc"}]` — Branko's id, not mine.

## 5. Everything else that differs between the two builds, and why

The whole New Note dialog was compared, not only the part the ticket names.

| | Production `v26.39.2-1aeb22d` | Branch `v26.39.1-068d31b` | Reading |
|---|---|---|---|
| Can you tag yourself | **no** | **yes** | the fix |
| Box label | *"You can @tag and notify another team member"* | *"You can @tag a team member"* | the word **"another"** removed — the wording matches the new behaviour |
| Suggestion list cap | 10 | 10 | unchanged |
| "Create note for" options | Work Order + one entry per line | Work Order + one entry per line | unchanged |
| Note ⋮ menu | Delete note · Edit note · Attach files | Delete note · Edit note · Attach files | unchanged |
| Character allowance | 2000 | 2000 | unchanged |
| Reminder Date, Customer Visible, Cancel, Save | present | present | unchanged |
| Internal test ids | `date_icon_` / `date_input_` / `dialog_title` | `date_icon_reminder_date` / `date_input_reminder_date` / `dialog_create_note` | named test ids — not visible to a user; matches the handoff's *"small note-picker fixes"* |

**No unexplained difference remains.**

## 6. One thing checked and deliberately not reported as a fault

The suggestion list shows a **subset** of the organisation's staff and caps at ten — on the branch
`@Cory`, `@Tianna` and `@Amanda` return nothing although those people are in the staff list. **Production
behaves the same way** (ten-name cap, a subset), so this is pre-existing scoping, not something this
change introduced, and it is outside this ticket. It is recorded here rather than raised.

## 7. Environment

**Branch** (per-ticket QA branch — no cleanup required): five `ZZAUTOTEST` notes left in place on work
order **S2-17358** so the result stays reproducible — three self-tagged, one line note, one tagging
Branko Cicovic, plus one edited note.

**Production** (restore-after discipline): **nothing was created or changed.** The dialog was opened and
typed into and then abandoned; the only write in the session was `POST /api/login`.

## 8. Evidence

* `ev/01-self-tag-before-after.png` — production typing your own name and getting nothing, beside the
  branch offering your own account.
* `ev/02-notification.png` — the self-mention delivered to the Notifications panel.
* `ev/03-other-users.png` — tagging another person, unchanged on both builds.
