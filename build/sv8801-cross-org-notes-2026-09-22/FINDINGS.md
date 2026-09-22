# SV-8801 — cross-organization note access. Findings.

**Environment:** `sv8801.qa.shopview.com`, build **`v26.36.8-18877c9`**, last-modified Mon 21 Sep 2026
13:33:09 GMT, etag `0c261af634bfc5c5ebcdc4909a6a8527`. **(The developer's 18 Sep comment says this host
"will not come up" — it does; see `SETUP.md`.)**

## §1 — The two-organization fixture, and why it is discriminating

| | Organization | session |
|---|---|---|
| **Org A** | `d55bc308-e61a-438d-b5f1-c7a73c89d49f` — Staging Foothills Group Inc | admin |
| **Org B** | `47a6280f-7b12-4d32-9f49-f51030793ccb` | `bilal.muzamil+8801@shopview.com` |

Both sessions were proven live **at the same time**, each returning its own `organizationId` from
`GET /api/organizations/settings`.

**Org B had no notes, so one was created — through Org B's own session:**

* note **`2e250fdf-5c5a-48e4-8f8a-8339c3eb14cb`**, type `customer`, content
  `ZZAUTOTEST SV-8801 Org B note`
* attachment **`83d2ddc9-72c8-46b7-8174-b1de96b2d277`** — `zzautotest_8801.txt`, 38 bytes

**The fixture is discriminating, which is the whole point.** A random UUID also returns not-found, so
passing the test with a made-up id would prove nothing. This note **genuinely exists** (Org B lists it)
and is **genuinely foreign** (it is absent from Org A's 36 notes). Both halves were checked.

**Contract notes worth keeping:** the request bodies are **snake_case** while the responses are
camelCase — `reference_id`, not `referenceId`, and `add-attachments` wants multipart
**`note_id` + `attachments[]`**. Four other field-name combinations return a **500**, not a validation
error, which makes this endpoint easy to misread as broken.

## §2 — Cross-organization attempts: all blocked, 400 not-found, never 403

Org A's session against Org B's note and attachment:

| Endpoint | Result |
|---|---|
| `POST /api/note/update` | **400** — ``Note `2e250fdf…` not found.`` |
| `POST /api/note/delete` | **400** — ``Note `2e250fdf…` not found.`` |
| `POST /api/note/add-attachments` | **400** — ``Note `2e250fdf…` not found.`` |
| `POST /api/note/delete-attachment` | **400** — ``Attachment `83d2ddc9…` not found.`` |
| `GET /api/note/download-attachment` | **400** — ``Attachment `83d2ddc9…` not found.`` |

**Zero 403s.** That is the specific requirement — a 403 would itself confirm the note exists.

## §3 — Database verification, which is where the old bug would have survived

The developer's third highlight: **before the fix, note delete and attachment delete returned 200 *and
actually mutated the row*, so a status-only assertion would have passed against the bug.** So the state
was re-read from Org B's own session after the attempts:

| Check | Result |
|---|---|
| Note still exists | **yes** — 1 note, was 1 |
| Content untampered | **yes** — still `ZZAUTOTEST SV-8801 Org B note`, **not** the `CROSS-ORG TAMPER ATTEMPT` string that was sent |
| Attachment survived the delete attempt | **yes** — 1 attachment, same id, same 38 bytes |
| No attachment added by the blocked upload | **yes** — still exactly 1 |

**Nothing was mutated.** The endpoints refuse *and* leave the row alone.

## §4 (part) — Positive controls: the instrument can see success

A negative result only means something if the same calls succeed when they should. Same-org:

| Control | Result |
|---|---|
| Org A updates its **own** note | **200**, and the edit **landed** — content re-read as `…control note EDITED` |
| Org A attaches to its **own** note | **201**, attachment present on re-read |
| Org B updates its **own** note | **200** |
| Org B attaches to its **own** note | **201** (this was how the fixture attachment was made) |

**So the 400s in §2 are the tenancy guard, not a broken harness.**

## Still to do

* **The before-capture.** Everything above shows the fix behaving correctly; none of it yet shows the
  bug existing on an unfixed build. Staging is a different build (`v26.36.8-339df81`) — if it still
  has the bug it is the BEFORE, and that is what turns this from "behaves correctly" into "verified
  fix". Needs staging cookies for a second org there.
* **The seventh endpoint.** The comment says six internal endpoints plus the **Customer Portal**
  attachment download. Five internal ones are covered above; the portal download is a separate
  controller and has not been touched. The description names only four endpoints — **the Powertools
  test plan would settle the enumeration.**
* **Same-org-without-permission must still return 403** (NoteVoter deliberately untouched) — needs a
  user lacking the Notes permission.
* **Portal thumbnail regression** — a break there shows as broken images rather than an error, so it
  has to be looked at, not status-checked.
* **Not to be filed** (developer's instruction): delete-attachment returns different error bodies for
  a nonexistent attachment id vs another org's.

---

## §5 — THE BEFORE-CAPTURE: the bug reproduces in full on staging

**Staging `app.staging.shopview.com`, build `v26.36.8-339df81`** — a different build from the fix
branch. Two organizations, both sessions live at once:

* **staging Org A** = `d55bc308-e61a-438d-b5f1-c7a73c89d49f`
* **staging Org B** = `302f69e8-5f45-4d4c-9d9b-002dc8abb2a4`

Same fixture discipline as the branch: a note created **through Org B's own session**
(`69aaaf08-b2f0-46e3-9492-0b6029b70f8c`, attachment `31909873-7673-444a-b953-c4cce4f6b9c4`), proven
**absent from Org A's 55 notes** before anything was attempted.

**Then, from Org A's session, against Org B's note — every step verified by re-reading as Org B:**

| # | Attempt from Org A | Status | What actually happened in Org B |
|---|---|---|---|
| 1 | `note/update` | **200** | content overwritten — now reads `TAMPERED BY ANOTHER ORGANIZATION` |
| 2 | `note/add-attachments` | **201** | file planted — attachments went **1 → 2** |
| 3 | `note/download-attachment` | **200, 38 bytes** | **the other organization's file contents came back**: `ZZAUTOTEST SV-8801 staging attachment` |
| 4 | `note/delete-attachment` | **200** | attachment destroyed — **2 → 1** |
| 5 | `note/delete` | **200** | **the note is gone** |

**Every endpoint is exploitable on the unfixed build, and each one really mutated the row** — exactly
the trap the developer warned about, where a status-only assertion proves nothing because the status
was 200 *and* the data changed.

### This also settles which build carries the fix

The question `SETUP.md` left open is now answered empirically rather than assumed: **staging
(`v26.36.8-339df81`) does NOT have the fix; the branch (`v26.36.8-18877c9`) does.** The same five calls
against the same kind of fixture behave in exactly opposite ways.

### One thing the ticket title understates

The summary says users can *"edit, delete, and attach files to"* another organization's notes.
**Step 3 shows they can also READ another organization's file content** — `download-attachment`
returned the bytes. That is data exfiltration, not just tampering, and it is not in the title.
**The fix does close it** (the branch returns 400 for the same call), so this is a note about how the
issue is described, not an additional defect.

### Staging left clean

The only staging records touched were the throwaway note and attachments created for this test, and
the test itself destroyed them. **Nothing pre-existing on staging was read, modified or deleted** —
every cross-org call was aimed at the `ZZAUTOTEST` note and no other id was ever used.

---

## §6 — The Powertools plan arrived, and it named two endpoints I had not covered

The handoff enumerates **six** internal endpoints plus the Customer Portal one. Five internal were
already covered in §2. The sixth is `POST /api/note/toggle-read-status`.

### `POST /api/note/toggle-read-status`

| From Org A, against | Status | Body |
|---|---|---|
| Org B's note id | **400** | `{"errors":[{"note_id":"Not found"}]}` |
| a random UUID | **400** | `{"errors":[{"note_id":"Not found"}]}` — **byte-identical** |
| **its own** note (control) | **200** | `{"data":{"is_read":true}}` |

The handoff asks for the exact body `{"errors":[{"note_id":"Not found"}]}` — that is what came back,
word for word.

**And no read-status was written.** Re-read from Org B's own session afterwards, the note still reports
`isRead: false`. The positive control on the same endpoint flipped Org A's own note to `is_read: true`
in the same minute, so the instrument does record a toggle when it is allowed to.

Contract note: the body field is **`note_id`** (snake_case). An empty body answers
`{"note_id":"Missing required parameter"}`, which is how the field name was established rather than
guessed.

### `GET /api/external/customer-portal/attachments/{attachmentId}` — NOT RUN, and why

This one is **blocked on something only the developer can give me**, and I would rather say so than
pass it on the strength of the handoff's own sentence that it "inherits the same guard".

* The endpoint answers **401 `{"errors":[{"error":"Invalid API key."}]}`** — it authenticates with a
  portal API key, not with a ShopView session, so `X-Organization-Id` / `X-Customer-Email` alone are
  not enough to reach it.
* That key lives in the portal application's own server configuration. It is not in the ShopView SPA
  bundle, not exposed by any organization/settings/integration endpoint I could find, and not
  derivable from the app.
* **No customer portal is deployed against this branch.** `sv8801portal`, `portal.sv8801` and
  `sv8801-portal` under `qa.shopview.com` all fail to resolve. The portal that exists
  (`shopview-portal-feature-branch-xn74b9.laravel.cloud`) was stood up for SV-9697 and points at the
  **sv9697** API, which does not carry this fix — so a test there would be a *before*, not an *after*.

**What would unblock it, either one:** the portal API key for this API host, or a portal deployment
pointed at `sv8801api.qa.shopview.com`. With either, the check is a single request.

## §7 — Non-enumerability: a foreign note looks exactly like one that does not exist

Handoff check 2. Each endpoint called twice from Org A — once with Org B's real id, once with a random
UUID — and the two responses compared.

| Endpoint | Foreign id | Random UUID | Identical? |
|---|---|---|---|
| `note/update` | 400 ``Note `2e250fdf…` not found.`` | 400 ``Note `3f2a91c4…` not found.`` | **yes** |
| `note/delete` | 400 ``Note `2e250fdf…` not found.`` | 400 ``Note `3f2a91c4…` not found.`` | **yes** |
| `note/add-attachments` | 400 ``Note `2e250fdf…` not found.`` | 400 ``Note `3f2a91c4…` not found.`` | **yes** |
| `note/toggle-read-status` | 400 `{"note_id":"Not found"}` | 400 `{"note_id":"Not found"}` | **yes** |
| `note/download-attachment` | 400 ``Attachment `83d2ddc9…` not found.`` | 400 ``Attachment `8b1d4c72…` not found.`` | **yes** |

Same status, same body shape, differing only in the echoed id — which is what the handoff asks for.

**The one documented exception reproduces exactly as described, and is deliberately NOT being filed.**
`POST /api/note/delete-attachment` answers a foreign attachment with
``Attachment `83d2ddc9…` not found.`` but a nonexistent one with
`Entity "App\Communication\Notes\Domain\Attachment" with property "id": "8b1d4c72…" does not exist.`
That is the accepted residual the handoff names — an unscoped validator running ahead of the guard.
It is an existence oracle only; the delete itself is still blocked (§3 proved the attachment survived).
I checked it rather than took it on trust, and I am not raising it.

### Download refusal hygiene

`GET /api/note/download-attachment` on Org B's attachment, full response captured:

* **400**, `content-type: application/problem+json`, body **85 bytes** of JSON.
* **No file bytes** — the 38-byte payload `ZZAUTOTEST SV-8801 attachment payload` does not appear.
* **No original filename** — `zzautotest_8801.txt` does not appear.
* **No `Content-Disposition` header at all.**
* **No Org B note id** — `2e250fdf…` does not appear anywhere in headers or body.
* The `x-organization-id` header echoes **Org A's own** organization, the requester's, not Org B's.

## §8 — Same-organization regression: the full lifecycle, as admin and as a technician

Handoff check 3. Nothing legitimate may break.

**As admin, on work order S2-4219** (`04ab678b…`), note `12eb53a5…`:

| Step | Result |
|---|---|
| create | **201** |
| edit | **200**, re-read as `…same-org WO note EDITED` |
| toggle read status | **200** `{"is_read":true}`, re-read `isRead: true` |
| add attachment (`_zz.png`, 4 328 bytes) | **201** |
| download it | **200**, **4 328 bytes, md5 `3bca593e…` — byte-identical to what was uploaded** |
| **thumbnails** | `small` **200**, a real 250×167 PNG · `large` **200**, a real 600×400 PNG |
| delete attachment | **200**, and a re-download now says not-found |
| delete note | **200**, and the note is gone from the work order's list |

**The thumbnail path is the one the handoff singles out** — the note JSON exposes thumbnails as
`note/download-attachment?id=…&thumbnail=small|large`, so they run through the newly guarded endpoint,
and a tenancy regression would show as broken images rather than an error. Both sizes returned real
image data. **And the guard still applies to them:** the same thumbnail request for Org B's attachment
comes back **400 not-found**.

### As a technician — and this is where 403 and 400 have to stay apart

Impersonated **Stephen Grimes, Technician**, whose permission set is exactly six atoms and
**does not include `workOrdersDelete`**:
`customersView, scheduleView, woPickParts, woTechViewMode, workOrderLinesCreateAndEdit, workOrdersView`.

His own note (`368e3d9f…` on S2-13311): create **201** → edit **200** → toggle **200** → attach **201**
→ download **200 with the identical md5 `3bca593e…`** → delete attachment **200** → delete note **200**.
Nothing about the fix gets in a legitimate user's way.

**Then handoff check 4, the distinction that matters — the same user, the same request shape, two
different refusals:**

| From the technician | Status | Body |
|---|---|---|
| delete a **co-worker's** note in **his own** organization | **403** | `{"errors":[{"error":"Access denied."}]}` |
| delete **Org B's** note | **400** | ``Note `2e250fdf…` not found.`` |
| update **Org B's** note | **400** | ``Note `2e250fdf…` not found.`` |
| download **Org B's** attachment | **400** | ``Attachment `83d2ddc9…` not found.`` |

**Permission still answers 403; tenancy answers 400 not-found.** The handoff is explicit that a 403 for
another organization's note would itself be a bug, because it confirms the note exists — that does not
happen.

Two supporting observations, both correct rather than faults, recorded so nobody re-raises them:

* The technician **can update** a co-worker's note (**200**) while being unable to **delete** it. That
  is the existing SV-8003 rule — Work Orders **View** carries create/edit of any note, Work Orders
  **Delete** carries deleting anyone else's — and it confirms `NoteVoter` is untouched and still
  discriminating in both directions.
* He **can delete his own** note without `workOrdersDelete`, which is the authorship half of the same
  rule.

## §9 — Legacy `organization_id IS NULL` rows: none in this organization

Handoff check 7. The failure shape is a note that is **visible in the list** but answers **400 not-found**
on a write, because the list read path is not organization-scoped while the write paths now are.

`GET /api/notes` returns Org A's **whole** note list — worth knowing, because **`reference_id` is
ignored**: the same 37 notes come back for three different work-order ids and for
`00000000-0000-0000-0000-000000000000`. So the list below is **every note Org A can see, not a sample.**

**All 37 were probed with `toggle-read-status` (and toggled back where it succeeded): 37 × 200, zero
400s.** No note in this organization is visible-but-unwritable, so the legacy-row caveat does not arise
here and there is nothing to file under check 7.

The developer still owes the production count of
`SELECT type, COUNT(*) FROM communication_note WHERE organization_id IS NULL GROUP BY type;` — that is
what sizes this on real data, and it is listed as owed in their own handoff.

## §10 — Shared `#[MapEntity]` infrastructure smoke (handoff check 6)

`RequestPayloadValueResolver` is used by every `#[MapEntity]` consumer in the application, so this is the
blast-radius check even though no behaviour change is expected.

| Consumer | How | Result |
|---|---|---|
| **Work order — create** | API | **201**, and the work order opens and renders (`S8801-17580`) |
| **Work order — edit** | API `work-orders/change-status` | **201**, re-read shows the status really moved `estimate → approved` |
| **Vehicle — create** | **through the screen**, New Asset dialog | **200**, and the new asset appears in the customer's Assets list (`ZZ8801`) |
| **Vehicle — edit** | **through the screen**, Edit Vehicle dialog | **201**, Color `ZZAUTOTEST-8801` still on screen after a full page reload |
| **Technician task — move** | see below | **not runnable on this branch — and it is not this change's doing** |

### The task move, and why it is not a finding

`POST /api/work-orders/tasks/move` answers **403 `Access denied.`** on the branch for a full
administrator — even for an empty body, so the voter runs ahead of validation. On **staging** the same
empty body reaches the validator and answers **400** `{"tasks":"Missing required parameter"},
{"line_id":"Missing required parameter"}`.

**That difference is configuration, not code, and I checked before calling it anything:**

* the permission behind this action is **`woMoveLabor`** (SV-8911);
* the branch administrator holds **42** permissions and **`woMoveLabor` is not among them**, while the
  staging administrator holds **59** and **does** have it;
* decisively, the branch's **own permission catalogue** — `GET /api/fe-permissions` — contains **43
  atoms and `woMoveLabor` is not one of them**. The atom does not exist in this build's data at all, so
  the endpoint refuses **everyone**, not just us.

The branch is cut from `main` rather than `develop` (the handoff says so), which is a plain explanation
for an older permission set. **Nothing here touches note tenancy, and it would refuse identically with
this change reverted.** Reported, not filed.

## §11 — Customer-visible note emails (handoff check 5): tested, and it needs the developer

This is the one the handoff calls a **silent** tripwire — no error, no failed job, simply no emails — so a
"no exception was thrown" answer would be worth nothing. I went looking for an actual mailbox.

**Mail from this branch does reach a real inbox.** Two invitation emails from `noreply@shopview.com`
arrived during this pass — 03:09:31Z to `bilal.muzamil+8801@shopview.com` and 03:52:30Z to
`bilal.muzamil+orgB@shopview.com` — sent by the branch itself when the two test organizations were
created. So the mailer is alive and outbound delivery works.

**Set-up, so the notification had a real address to go to.** The work order's contact was pointed at a
mailbox I can actually read: contact Heather Best (`f6b18290…`) changed from
`heather.best@staging.shopview.local` — a domain that does not exist — to
**`bilal.muzamil+sv8801@shopview.com`**, and set as the contact on work order **S8801-17580**
(`d542775f…`, customer *Abode Trucking & Repair*).

**Then three customer-visible notes on that work order:**

| # | How | Result |
|---|---|---|
| 1 | API `note/update` with `customer_visible: true` | **200**, re-read `customerVisible: true` |
| 2 | API `note/create` with `customer_visible: true` | **201**, re-read `customerVisible: true` |
| 3 | **through the screen** — New Note, tick **Customer Visible**, Save | **201**; the screen sends exactly `{"type":"work_order","reference_id":"d542775f…","customer_visible":true}`, which confirms the two API calls above were faithful |

**No notification email arrived, in about fifteen minutes of watching the inbox.**

**I am NOT calling that a defect, and here is the honest reason.** I could not establish the baseline:

* I could not get the same set-up onto the unfixed staging build to compare — staging's sign-in goes
  through Google SSO, so the second organization's screens are not reachable from here, and staging has
  no contacts-list endpoint I could find to repoint an address by API. **Without the before, a missing
  email could equally be normal.**
* The feature may legitimately require something I have not given it — portal enrolment for that
  contact, a different recipient than the work-order contact, or customer-portal mail switched off on QA
  branches. I found no portal-access flag on the contact record and no portal-enrolment endpoint to
  check.

**So this is a question for the developer, not a finding:** with the contact email set to a real
address and the note marked customer visible, should `SendCustomerNoteNotificationJob` have fired on
this branch — and did it? They can see the queue; I cannot. Everything they need to look it up is
above: the work order, the contact, the three note ids, and the timestamps.

## §12 — What was changed on the environments

**On the QA branch** (`sv8801`, no cleanup expected on per-ticket branches — the QA lead's ruling), all
tagged `ZZAUTOTEST` where the field allowed it:

* two organizations and their notes/attachments, per §1;
* work order **S8801-17580** created, then status moved `estimate → approved`, and its contact set to
  Heather Best;
* contact **Heather Best's email changed** to `bilal.muzamil+sv8801@shopview.com` (was
  `heather.best@staging.shopview.local`) — **worth knowing if anyone re-uses this customer**;
* vehicle **ZZ8801** created under *Abode Trucking & Repair*; vehicle *Trailtech Trailers 14674* had its
  **Color** set to `ZZAUTOTEST-8801`;
* several notes created on work orders, a customer and an asset, some with a PNG attachment;
* **all 37 of Org A's notes had their read status toggled and toggled back** during the §9 probe;
* the Admin role was **not** modified — the `woMoveLabor` gap in §10 is how the branch was seeded, not
  something we changed.

**On staging** (shared, so restored): one demo note was created in the second organization and
**deleted again — that organization is back to 0 notes, verified**. Nothing else was written.

## §13 — The comment, and the pre-post gate

**Posted as comment `77006` on SV-8801**, 22 September 2026.

**Pre-post gate (Standing Rule 72), all run immediately before posting:**

* **build marker re-read live** — `v26.36.8-18877c9`, last-modified Mon 21 Sep 13:33:09 GMT, etag
  `0c261af634bfc5c5ebcdc4909a6a8527`, and `index.html` **sha256-identical** to the copy fetched at the
  start of the pass, so nothing redeployed underneath the run;
* **ticket re-read** — still `TESTING QA`, priority Medium, one prior comment (Slavcho's 18 Sep
  handoff), nothing new since;
* **images** — uploaded as **real Jira attachments** (`61197`–`61200`) and referenced in wiki markup,
  not as external media (Rule 81);
* **voice scan** — no AI self-reference anywhere in the reader-facing text;
* **format** — verdict on the first line, and **no "Technical details for developers" section**
  (Rule 84 — not posted, and the question put to the QA lead instead).

**Read back from Jira after posting:** four media nodes, all `"type":"file"` with attachment uuids, in
the intended order; the checks table carries 15 rows (header + 14); the first line is the verdict.

**No defect ticket filed** — nothing was found wrong with the change itself, and the two open items are
questions, not findings.
