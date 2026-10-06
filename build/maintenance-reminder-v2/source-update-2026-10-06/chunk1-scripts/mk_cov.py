import sys,os,glob,re
S,P,N=sys.argv[1:]
notes=open(N).read()
excl=["2026-10-01 14.18.45","2026-10-01 14.20.40","2026-10-01 14.32.37","2026-10-01 18.37.16","2026-10-02 11.22.56","2026-10-02 11.23.47","2026-10-02 11.44.33","2026-10-02 11.48.20","2026-10-02 11.53.11","2026-10-02 11.54.00","2026-10-02 13.49.32","2026-10-02 17.57.10","2026-10-02 18.00.49"]
def stamp(b):
  m=re.search(r'(\d{4}-\d{2}-\d{2}) at (\d{2}\.\d{2}\.\d{2})',b); return m.group(1)+' '+m.group(2)
pngs=sorted(glob.glob(P+'/uploads/*.png'))
inscope=[p for p in pngs if stamp(os.path.basename(p)) not in excl]
assert len(inscope)==106,len(inscope)
crop={"2026-09-03 19.53.07","2026-09-23 18.55.10","2026-09-23 19.27.00","2026-09-08 09.57.55","2026-09-16 15.04.05","2026-09-16 14.58.10","2026-09-16 15.09.35","2026-09-22 15.29.11"}
canvas={"2026-09-03 19.53.07","2026-09-23 18.55.10","2026-09-23 19.27.00"}
out=["","---","","## Z. Reading coverage","",
"In-scope files: **106 screenshots + 25 Markdown + 8 handoff HTML/JSON (6 `.dc.html` + 2 `.json`) + 5 `_tools` files = 144 files.** Every one was opened and read to its last byte or line. **No in-scope file was unreadable.** The method column names the extra method used where a plain open was not enough.","",
"### Z1. Screenshots — uploads/*.png (106; the 13 read in the earlier pass are excluded as instructed)","",
"| # | Path | Size (bytes) | Read 100% | Notes entry | Method / note |","|---|---|---|---|---|---|"]
missing=[]
for i,p in enumerate(inscope,1):
  b=os.path.basename(p); st=stamp(b)
  m=re.search(r'^### (A\d+)\. '+re.escape(st),notes,re.M)
  if not m: missing.append(b)
  meth="Image viewer"
  if st in canvas: meth="Viewer + Pillow crop/upscale 3–8×. Titles, frame labels and layout read; the body text of this zoomed-out canvas is below pixel resolution, so the same frames' text was read from the html boards (C4–C6)"
  elif st in crop: meth="Viewer + Pillow crop/upscale (tiny tile)"
  out.append(f"| {i} | uploads/{b} | {os.path.getsize(p):,} | yes | {m.group(1) if m else '??'} | {meth} |")
out+=["","### Z2. Markdown (25)","","| # | Path | Size (bytes) | Read 100% | Notes entry |","|---|---|---|---|---|"]
mds=sorted(glob.glob(P+'/design_handoff_maintenance_reminders/**/*.md',recursive=True))+sorted(glob.glob(P+'/uploads/*.md'))
assert len(mds)==25,len(mds)
for i,p in enumerate(mds,1):
  r=os.path.relpath(p,P)
  if '/_ds/' in r: m=re.search(r'^### (B\d+)\. design_handoff_maintenance_reminders/_ds/',notes,re.M)
  else: m=re.search(r'^### (B\d+)\. '+re.escape(r)+r' \(',notes,re.M)
  if not m: missing.append(r)
  out.append(f"| {i} | {r} | {os.path.getsize(p):,} | yes | {m.group(1) if m else '??'} |")
out+=["","### Z3. Handoff HTML and JSON (8)","","| # | Path | Size (bytes) | Read 100% | Notes entry | Method |","|---|---|---|---|---|---|"]
hj=[('Maintenance Reminders.dc.html','C1'),('SettingsSidebar.dc.html','C2'),('ShopviewHeader.dc.html','C3'),('Chunk 1.dc.html','C4'),('Chunk 2.dc.html','C5'),('Maintenance Reminders - Flow Map.dc.html','C6')]
H=P+'/design_handoff_maintenance_reminders/'
for i,(f,c) in enumerate(hj,1):
  out.append(f"| {i} | design_handoff_maintenance_reminders/{f} | {os.path.getsize(H+f):,} | yes | {c} | All visible text extracted with a Python html.parser script and read line by line; x-dc logic scripts read |")
for j,(f,c) in enumerate([('_adherence.oxlintrc.json','C7'),('_ds_manifest.json','C8')],7):
  q=glob.glob(H+'_ds/*/'+f)[0]
  out.append(f"| {j} | {os.path.relpath(q,P)} | {os.path.getsize(q):,} | yes | {c} | Parsed with json and printed in full |")
out+=["","### Z4. _tools (5)","","| # | Path | Size (bytes) | Read 100% | Notes entry | Method |","|---|---|---|---|---|---|"]
for i,(f,c,m) in enumerate([('inv1.txt','D1','folded at 1,800 chars, every line read'),('inv1b.txt','D2','read in full; macros expanded and diffed against inv1 (0 differences)'),('inv1c.txt','D3','read in full; macros expanded and diffed against inv1 (0 differences)'),('audit.json','D4','parsed, every key and value printed'),('card.txt','D5','read raw')],1):
  out.append(f"| {i} | _tools/{f} | {os.path.getsize(P+'/_tools/'+f):,} | yes | {c} | {m} |")
out+=["","### Z5. Unreadable files","","**None.** The coordinator's rule was applied to three screenshots that are zoomed-out canvas captures (2026-09-03 19.53.07, 2026-09-23 18.55.10, 2026-09-23 19.27.00). Methods used on them: the image viewer; Pillow crop of each region; upscale 3×–8× with LANCZOS. Their frame titles, layout and large labels were read. Their small body text is below one pixel per glyph in the capture, so no method can recover it from the image. The same frames exist as text in the html boards (`Chunk 1.dc.html`, `Chunk 2.dc.html`, Flow Map), which were read in full (C4–C6), so their content is covered.","",
"**Outside this assignment (not read here, listed so nothing is silently dropped):** the 13 screenshots read in the earlier pass. Also the root-level boards `Maintenance Reminders Demo.dc.html`, `Canned lines per location - proposal.dc.html` and `4-work-order (old WO chrome).dc.html`, plus `_archive-pages/`, `_backup-before-ds/`, `assets/` and `support.js`. The root `Chunk 1`/`Chunk 2` boards are byte-identical to the handoff copies (checked with `cmp`). Also `_tools/` `c1.js`, `c1.tmp`, `c2.tmp`, `dsx.js`, `h.js`, `mc.js`, `mob.js`, `parts.json` and `trash.txt`, and the handoff fonts and svg (excluded by the brief)."]
print("missing:",missing)
open(S+'/coverage.md','w').write("\n".join(out)+"\n")
