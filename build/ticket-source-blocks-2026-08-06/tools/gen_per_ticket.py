import json,glob,os
B={}
for f in ['blocks-schedule.json','blocks-filters.json','blocks-reportsuite.json']:
    B.update(json.load(open(f)))
fv={r['key']:r for r in json.load(open('../FINAL-VERIFICATION.json'))}
TYPE=json.load(open('type-map.json'))
PROJ={}
for k in B:
    n=int(k.split('-')[1])
    PROJ[k]='Schedule' if (8848<=n<=8857 or k in ('SV-8886','SV-8924','SV-8933','SV-8941','SV-8942','SV-8957','SV-8958','SV-8959')) else ('Filters' if k in ('SV-8843','SV-8844','SV-8845','SV-8846','SV-8847','SV-8871','SV-8912') else 'Report Suite')
out=['# Per-ticket record — the source found and the exact block written','',
 'One entry per ticket. **Source type** is one of the three the QA lead named: **1** a story in the epic · **2** the specification (PRD) · **3** a product owner answer in the questions spreadsheet.','',
 'The block text below is what is now live at the bottom of each ticket, appended after a line break. Nothing above it was altered.','']
for k in sorted(B):
    v=fv[k]; t=TYPE[k]
    out.append(f"## [{k}](https://shopview.atlassian.net/browse/{k}) — {PROJ[k]}")
    out.append('')
    out.append(f"| | |\n|---|---|\n| Status | **{v['status']}** |\n| Priority | {v['priority']} (unchanged) |\n| Type | {v['type']} (unchanged) |\n| Parent | {v['parent']} (unchanged) |\n| **Source type** | **{t['type']}** — {t['label']} |\n| Document named | {t['doc']} |\n| Verification | one block · description above it byte-identical · no other field changed |")
    out.append('')
    out.append('**The block as written:**')
    out.append('')
    for p in B[k]:
        out.append('> '+p.replace('\n',' '))
        out.append('>')
    out.append('')
open('../PER-TICKET-SOURCES.md','w').write('\n'.join(out))
print('ok', len(B))
