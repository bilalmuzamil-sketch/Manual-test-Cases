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
