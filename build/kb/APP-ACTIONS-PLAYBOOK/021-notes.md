## NOTES

### Create / edit / delete a note
- **UI path:** WO (or Customer) detail → **Notes** tab → add note; existing note **more_horiz** menu → **Edit note** / **Delete note** / Attach files.
- **API:** `POST /api/note/create` body `{type:'work_order', reference_id:<WO>, content}` → **201** · `POST /api/note/update` → **200** · `POST /api/note/delete` → **200**. List `GET /api/notes`.
- **Who can edit/delete whose note (per updated spec):** **WO View = create/edit ANY note; WO Delete = delete ANY note.** Confirmed: Admin edited a Tech-authored note (`note/update` 200). JSA could create/edit/delete its **own** note (all 200/201); editing others' notes was tested against an admin-authored note.
- **Gotcha/Unblock:** the Quasar rich-text editor resists automation; note create/update still succeed via the endpoint. Story-history opens a panel (not a simple dialog).
- **Confidence:** High (create/update/delete executed).

### View History Logs (WO history + line story)
- **Scope:** **View History Logs governs work-order-level history (the WO Audit Log / History) AND line-level (line story/history) — for WORK ORDERS ONLY. There is NO history log for Part Sales or Purchase Orders. (Confirmed with product owner.)** Do not assert any part-sales or PO history behavior.
- **UI path:** WO detail → History / Audit Log section (WO-level); WO line → line story/history panel (line-level).

---

