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
