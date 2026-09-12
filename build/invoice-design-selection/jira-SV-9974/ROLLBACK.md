# SV-9974 — how to put the description back exactly as Mudassir wrote it

https://shopview.atlassian.net/browse/SV-9974 — "Emailed invoice shows an unrelated company name in
the subject, body and footer", Bug · Medium · Open, reported by **Mudassir Qamar** on 2026-09-12.

The description was rewritten on 2026-09-12 at the QA lead's request ("make this ticket more
explanatory by adding some inline images and correcting what needs to be corrected"). **Nothing else
on the ticket was touched** — not the summary, type, priority, status, Product Area, reporter,
the `relates to` link to SV-9973, or Mudassir's own attachment.

## Files here

| File | What it is |
|---|---|
| `ORIGINAL-SV-9974-full-2026-09-12.json` | the whole issue as it stood before the edit (`GET /rest/api/3/issue/SV-9974?expand=renderedFields`) |
| `ORIGINAL-SV-9974-description.adf.json` | **the rollback payload** — the description exactly as stored, in Atlassian Document Format |
| `ORIGINAL-SV-9974-description.rendered.html` | what that description looked like on screen |

## To roll back

```bash
cd /home/user/Manual-test-Cases
python3 -c "
import json
adf=json.load(open('build/invoice-design-selection/jira-SV-9974/ORIGINAL-SV-9974-description.adf.json'))
json.dump({'fields':{'description':adf}}, open('/tmp/rollback-9974.json','w'))
"
bash build/atlassian-login/jira.sh PUT /rest/api/3/issue/SV-9974 /tmp/rollback-9974.json
```

A 204 means it is back. Re-read it with
`bash build/atlassian-login/jira.sh GET /rest/api/3/issue/SV-9974` and compare against
`ORIGINAL-SV-9974-description.adf.json`.

Note: the REST v3 endpoint takes **ADF**, which is why the rollback payload is stored as ADF rather
than as text. The rewrite itself is written through **`/rest/api/2/`**, which takes wiki markup and is
the only route that embeds images inline.

---

## What was changed on 2026-09-12, and what was not

**Changed — the description only.** Rewritten to the nine-heading house shape with three inline
annotated screenshots. Source kept here as `new-description.wiki`; the result as
`AFTER-SV-9974-description.rendered.html` and `AFTER-SV-9974-screenshot.png`.

**Added — three attachments** (`SV-9974-1-the-email.png`, `SV-9974-2-where-the-name-comes-from.png`,
`SV-9974-3-the-invoice-itself.png`), built by `build/testing-tools/annotate_shot.py` from the sources
in this folder and in `../staging-2026-09-12/evidence/`.

**Not touched:** summary · issue type · priority · status · Product Area · QA Assignee · reporter ·
the `relates to` link to SV-9973 · Mudassir's own attachment `image-20260912-101939.png` (still
attached, and image 1 is a cropped and annotated version of it).

**The one correction the ticket now carries.** The original "Note for dev" asked whether the string
was hardcoded or read from another organisation's record, and warned it might be a cross-tenant data
issue. It is neither: the portal serves invoice S-32981 with an account record whose id
`d55bc308-e61a-438d-b5f1-c7a73c89d49f` is *the same id* as the invoice's own organisation, and the
shop app's Settings for that account shows Company Name = "Bravo Mechanical Services" with the same
Tax ID that prints on the invoice. The email reads the **Company Name**; the document prints the
**Location**. Evidence: `../staging-2026-09-12/evidence/S30.json` and `S33-company-name-card.png`.

**Still open, deliberately not done:** the summary still reads "an unrelated company name", which the
evidence above contradicts. Changing a colleague's ticket title was left for the QA lead to approve.
Proposed replacement: *"Emailed invoice names the account's Company Name while the invoice itself
names the Location"*. SV-9973 carries the same disproved cross-tenant note and has not been touched.
