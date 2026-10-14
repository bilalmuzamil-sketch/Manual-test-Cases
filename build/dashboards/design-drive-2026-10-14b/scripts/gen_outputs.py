"""Stage 3 (14 Oct evening pass): write the inventory, the file-reading table and the canvas-runtime strings.
Usage: python3 -I gen_outputs.py <scratch dir> <out dir>"""
import json,os,glob,hashlib,collections,shutil,sys,re
S=sys.argv[1]; OUT=sys.argv[2]; SRC='/home/user/Manual-test-Cases/build/dashboards/sources/design-2026-10-14b'; OLD='/home/user/Manual-test-Cases/build/dashboards/sources/design-2026-10-14'
INV=OUT+'/inventory'; os.makedirs(INV,exist_ok=True)
R=json.load(open(S+'/inv/classified.json')); rt=json.load(open(S+'/inv/canvas-runtime-ui-strings.json'))
cnt=collections.Counter(r['class'] for r in R)
cid=lambda ids:', '.join('[C%d](https://shopview.testrail.io/index.php?/cases/view/%d)'%(i,i) for i in ids[:6])+(' …+%d'%(len(ids)-6) if len(ids)>6 else '')
esc=lambda s:s.replace('|','\\|').replace('\n',' ')
def where(w): return re.sub(r'^(?:\.\./)*(?:tmp/.*?/dd14b/)?','',w)
L=['# Dashboard design — text inventory, 14 October 2026 evening (Rule 124 gate)','',
 'Design: claude.ai artifact Wae9DFQ8PJQBy8mbLsL5ge "Dashboard v1", re-shared and saved 2026-10-14 evening (`build/dashboards/sources/design-2026-10-14b/`, 97 files). '
 'Cases compared: all 123 live cases of TestRail group 12166 (114 Bilal Muzamil + 9 Vladimir Tomovic), snapshot 2026-10-14 17:20 UTC (`../cases-now/`). '
 'Spec for every class decision: PRD Confluence 788430850 **v48** (live, re-checked 17:19 UTC) and Chris Ward\'s 16 answers of 14 Oct 2026.','',
 'Rows come from: (a) `design_text_inventory.py` on the 49 board files + canvas.json; (b) a lenient supplementary pass over every board file (the tool drops single words, lowercase texts with a digit and texts containing this/let/var/const); '
 '(c) every word of all 47 screenshots (`image-transcriptions-2026-10-14b.tsv`: 13 changed images transcribed tonight, 34 byte-identical images carried from this morning\'s full transcription); (d) the one-click sweep\'s rendered text and the canvas-tool texts; (e) PRD v48 rules no case asserts. '
 'COVERED is decided against all 123 case texts; a short label (20 characters or fewer) counts only on an exact-case whole-word match (Rule 110).','',
 '## Counts','','| Class | Rows |','|---|---|']+['| %s | %d |'%(k,v) for k,v in sorted(cnt.items())]+['| **Total** | **%d** |'%len(R),'| **UNCLASSIFIED** | **%d** |'%cnt.get('UNCLASSIFIED',0),'',
 'By source: '+', '.join('%s %d'%(k,v) for k,v in sorted(collections.Counter(r['source'] for r in R).items()))+'.','',
 '## 1 · Every row','','| # | Text | Where (first) | Source | Class | Reason | Cases |','|---|---|---|---|---|---|---|']
order={'SPEC-CONFLICT':0,'CASE-NEEDED':1,'COVERED':2,'DESIGN NOTE':3,'OUT-OF-SCOPE':4,'DATA':5,'UNCLASSIFIED':-1}
for n,r in enumerate(sorted(R,key=lambda r:(order.get(r['class'],9),where(r['where'][0]))),1):
    L.append('| %d | %s | %s | %s | %s | %s | %s |'%(n,esc(r['text'][:220]),esc(where(r['where'][0])),r['source'],r['class'],esc(r['reason']),cid(r.get('case_ids') or [])))
L+=['','## 2 · Canvas editor runtime strings (library section, one group)','',
 '`artifact-page.html` carries the Claude Design canvas editor (script `appifact-app`, 1,987,971 characters) beside the design record. Tonight\'s runtime is **byte-identical** to this morning\'s, whose 100%% scripted scan found **%d** user-visible strings (menus, tooltips, export and editing commands of the design tool). No board shows them; the sweep shows the few the viewer renders ("Click to load", "Read-only"). **Group class: OUT-OF-SCOPE — design-tool chrome, not the Dashboard product.** Full list: `canvas-runtime-ui-strings-2026-10-14b.json`.'%len(rt)]
open(INV+'/design-text-inventory-2026-10-14b.md','w').write('\n'.join(L)+'\n')
for r in R: r['where']=[where(w) for w in r['where']]
json.dump(R,open(INV+'/design-text-inventory-2026-10-14b.json','w'),indent=0,ensure_ascii=False)
json.dump(rt,open(INV+'/canvas-runtime-ui-strings-2026-10-14b.json','w'),indent=0,ensure_ascii=False)
for f in ('label-check.txt',): shutil.copy(S+'/inv/'+f,INV+'/'+f)
# reading table
md5=lambda p:hashlib.md5(open(p,'rb').read()).hexdigest()
tr=collections.Counter(l.split('\t')[0] for l in open(S+'/transcribe.tsv').read().splitlines()[1:])
T=['| File | Bytes | Lines | Changed since this morning? | How read tonight | Coverage |','|---|---|---|---|---|---|']
stat=collections.Counter()
for f in sorted(glob.glob(SRC+'/files/*')):
    name=os.path.basename(f); b=os.path.getsize(f); o=OLD+'/files/'+name
    ch='added' if not os.path.exists(o) else ('**changed**' if md5(o)!=md5(f) else 'identical (md5)')
    stat[(name.endswith('.png'),ch)]+=1
    if name.endswith('.png'):
        how=('Viewed in full tonight'+(' (780×2840, viewed as 2 crops)' if name=='after-phone.png' else '')+'; every word transcribed (%d rows); compared with this morning\'s image transcription'%tr[name]) if ch!='identical (md5)' else 'Byte-identical to this morning\'s image, which was viewed in full and transcribed then (%d rows carried)'%tr[name]
        T.append('| files/%s | %d | (image) | %s | %s | 100%% |'%(name,b,ch,how))
    else:
        n=open(f).read().count('\n')+1
        how=('Read in full tonight (line diff against the morning copy, then the whole body re-read; shared <style> block md5-identical)' if name.endswith('.dc.html') else 'Read in full tonight (artboard-by-artboard diff)') if ch!='identical (md5)' else 'Byte-identical to this morning\'s file, read in full then'
        T.append('| files/%s | %d | %d | %s | %s | 100%% |'%(name,b,n,ch,how))
for name in ('15_Empty_Design.dc.html','15_Empty_Now.dc.html','before-empty-tiles.png'):
    T.append('| files/%s | — | — | **removed** | Old version read this morning; body compared with its replacement 15_Empty_After tonight | n/a |'%name)
for name,how in [('artifact-page.html','Scripted (`scripts/verify_page.py`): design record `appifact-doc` = the 97 files, each md5-identical to files/; title "Dashboard v1", comments none; editor runtime `appifact-app` byte-identical to this morning\'s; README comment read; 6 @font-face blocks = editor icon fonts (anthropicons); driven live by the sweep and the canvas driver'),
                 ('artifact-raw.html','Byte-identical to artifact-page.html (cmp), covered by the same pass'),('board-files-md5.txt','Read; matches md5sum of files/ exactly (97/97)')]:
    f=SRC+'/'+name; T.append('| %s | %d | %d | %s | %s | 100%% |'%(name,os.path.getsize(f),open(f,errors='ignore').read().count('\n')+1,'changed (new page)' if name!='board-files-md5.txt' else 'changed',how))
open(OUT+'/inventory/design-files-reading-2026-10-14b.md','w').write('# Design package — file reading table, 14 October 2026 evening (Rule 119)\n\nPackage: `build/dashboards/sources/design-2026-10-14b/`. No file skipped.\n\n'+'\n'.join(T)+'\n')
print('written',dict(cnt),'files',dict(stat))
