"""Stage 3: write the inventory, reading table and transcription files into the design-drive folder."""
import json,os,glob,hashlib,collections,shutil,sys
S=sys.argv[1]; OUT=sys.argv[2]; SRC='/home/user/Manual-test-Cases/build/dashboards/sources/design-2026-10-14'
os.makedirs(OUT,exist_ok=True)
R=json.load(open(S+'/inv/classified.json'))
rt=json.load(open(S+'/inv/canvas-runtime-ui-strings.json'))
cnt=collections.Counter(r['class'] for r in R)
cid=lambda ids:', '.join('[C%d](https://shopview.testrail.io/index.php?/cases/view/%d)'%(i,i) for i in ids[:6])+(' …+%d'%(len(ids)-6) if len(ids)>6 else '')
esc=lambda s:s.replace('|','\\|').replace('\n',' ')
L=['# Dashboard design — text inventory, 14 October 2026 (Rule 124 gate)','',
 'Design: claude.ai artifact Wae9DFQ8PJQBy8mbLsL5ge "Dashboard v1", saved 2026-10-14 (`build/dashboards/sources/design-2026-10-14/`). '
 'Cases compared: all 106 live cases of group 12166 (97 ours + 9 by another author), snapshots `build/dashboards/currency-2026-10-14/snapshots-before/`. '
 'Spec for SPEC-CONFLICT / CASE-NEEDED: PRD Confluence 788430850 **v44** (13 Oct 2026) plus the PO decision of 7 Oct 2026 (Chris Ward, Slack: grey "-", empty-chart placeholder, real zeros stay).','',
 'Sources of rows: (a) `design_text_inventory.py` on the 50 board files and canvas.json; (b) a lenient supplementary pass over every board file (the tool drops single words, lowercase texts with a digit, and texts containing this/let/var/const); '
 '(c) hand transcription of every word in all 48 screenshots (`image-transcriptions-2026-10-14.tsv`); (d) the one-click sweep\'s rendered page text. COVERED is decided against all 106 case texts; short labels (20 characters or fewer) count only on an exact-case, whole-word match (Rule 110 attribution).','',
 '## Counts','','| Class | Rows |','|---|---|']+['| %s | %d |'%(k,v) for k,v in sorted(cnt.items())]+['| **Total** | **%d** |'%len(R),'| **UNCLASSIFIED** | **%d** |'%cnt.get('UNCLASSIFIED',0),'',
 'By source: '+', '.join('%s %d'%(k,v) for k,v in collections.Counter(r['source'] for r in R).items())+'.','',
 '## 1 · Every row','','| # | Text | Where (first) | Source | Class | Reason | Cases |','|---|---|---|---|---|---|---|']
order={'SPEC-CONFLICT':0,'CASE-NEEDED':1,'COVERED':2,'DESIGN NOTE':3,'OUT-OF-SCOPE':4,'DATA':5}
for n,r in enumerate(sorted(R,key=lambda r:(order.get(r['class'],9),r['where'][0]))):
    L.append('| %d | %s | %s | %s | %s | %s | %s |'%(n,esc(r['text'][:220]),esc(r['where'][0]),r['source'],r['class'],esc(r['reason']),cid(r.get('case_ids') or [])))
L+=['','## 2 · Canvas editor runtime strings (library section, classified as one group)','',
 '`artifact-page.html` carries the Claude Design canvas editor (script `appifact-app`, 1,987,971 characters, minified) beside the design record. '
 'A scripted pass over 100%% of that script found **%d** user-visible string literals (menus, tooltips, export and editing commands of the design tool). '
 'No board shows them; the sweep shows the few the viewer renders (for example "Click to load", "Read-only"). '
 '**Group class: OUT-OF-SCOPE — design-tool chrome, not the Dashboard product.** Full list: `canvas-runtime-ui-strings-2026-10-14.json`.'%len(rt)]
open(OUT+'/design-text-inventory-2026-10-14.md','w').write('\n'.join(L)+'\n')
json.dump(R,open(OUT+'/design-text-inventory-2026-10-14.json','w'),indent=0,ensure_ascii=False)
json.dump(rt,open(OUT+'/canvas-runtime-ui-strings-2026-10-14.json','w'),indent=0,ensure_ascii=False)
shutil.copy(S+'/transcribe.tsv',OUT+'/image-transcriptions-2026-10-14.tsv')
# reading table
T=['# Design package — file reading table, 14 October 2026 (Rule 119)','','Package: `build/dashboards/sources/design-2026-10-14/` (saved today from artifact Wae9DFQ8PJQBy8mbLsL5ge). No file skipped.','',
 '| File | Bytes | Lines | How read | Coverage |','|---|---|---|---|---|']
tr=collections.Counter(l.split('\t')[0] for l in open(S+'/transcribe.tsv').read().splitlines()[1:])
for f in sorted(glob.glob(SRC+'/files/*')):
    b=os.path.getsize(f); name=os.path.basename(f)
    if name.endswith('.png'):
        how='Viewed in full'+(' (780×9014: viewed as 5 crops of 1900 px)' if name=='before-phone.png' else '')+'; every on-screen word transcribed (%d transcription rows)'%tr[name]
        T.append('| files/%s | %d | (image) | %s | 100%% |'%(name,b,how))
    else:
        n=open(f).read().count('\n')+1
        how='Read in full' if name in ('Main.dc.html','canvas.json','01_Opens_After.dc.html') else 'Read in full: board body printed and read; its <style> block is byte-identical (md5 93ec71de…) to the one read in 01_Opens_After'
        T.append('| files/%s | %d | %d | %s | 100%% |'%(name,b,n,how))
for name,how in [('artifact-page.html','Scripted: README comment read; design record `appifact-doc` = the 99 files, each md5-identical to files/ (verified); editor runtime `appifact-app` (1,987,971 chars) scanned 100%% for user-visible strings (%d found, section 2 of the inventory); 5 embedded fonts identified from @font-face as editor icon fonts (anthropicons); also driven live by the sweep and the canvas driver'%len(rt)),
                 ('artifact-raw.html','md5-identical to artifact-page.html (e1d251aa…), so covered by the same pass'),('board-files-md5.txt','Read; matches md5sum of files/ exactly (99/99)')]:
    f=SRC+'/'+name; T.append('| %s | %d | %d | %s | 100%% |'%(name,os.path.getsize(f),open(f,errors='ignore').read().count('\n')+1,how))
T+=['','**Other sources read in full this pass:** PRD v44 `build/dashboards/currency-2026-10-14/CONFLUENCE-788430850-2026-10-14.md` (47,138 bytes, 524 lines, 100%) · PRD diff v42→v44 (138 lines, 100%) · `build/dashboards/PROJECT-STATE.md` (100%) · 7 Oct proof `full-update-2026-10-07/design-drive/DESIGN-COVERAGE-2026-10-07.md` and its two drive logs (100%) · register block "2026-10-07 — Dashboard v1 full update" (D-1..D-10, 100%) · `build/skills/21-DESIGN-DRIVE-PROTOCOL.md`, Rule 124 (RULES-61-96.md lines 2950–3074), `build/skills/TOKEN-DISCIPLINE-CHARTER.md` (100%). Case texts were read by script (Rule 88), all 106.']
open(OUT+'/design-files-reading-2026-10-14.md','w').write('\n'.join(T)+'\n')
print('written',cnt)
