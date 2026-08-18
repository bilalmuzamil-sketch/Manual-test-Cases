#!/usr/bin/env python3
"""Regenerate import (reflects reverted markers) + id-map per project; re-merge C-ids/refs from the
committed id-map (§3.6), assert no drift, verify shredding guard + header parity."""
import subprocess,os,csv,hashlib,sys,io
ROOT="/home/user/Manual-test-Cases"
PROJ={"schedule":"schedule-v1-testrail-import.csv",
      "report-suite":"Report-Suite_Sales-By-Customer-Report_testrail-import.csv",  # peer header check uses any
      "filters":"filters-v1-testrail-import.csv"}
def read_csv(path):
    with open(path,newline="",encoding="utf-8") as f: return list(csv.reader(f))
def sha_firstline(path):
    with open(path,newline="",encoding="utf-8") as f: return hashlib.sha256(f.readline().encode()).hexdigest()

peer_hdr=sha_firstline(os.path.join(ROOT,"testrail-import","filters-v1-testrail-import.csv"))
for proj in ["schedule","report-suite","filters"]:
    idmap=os.path.join(ROOT,"build",proj,"testrail-id-map.csv")
    committed=read_csv(idmap)             # header + rows (has C-ids + refs)
    chead=committed[0]; crows=committed[1:]
    cmap={r[0]:r for r in crows}          # internal_id -> committed row
    # run generator
    r=subprocess.run(["python3",os.path.join(ROOT,"build",proj,"gen_import.py")],
                     capture_output=True,text=True,cwd=ROOT)
    if r.returncode!=0:
        print(f"[{proj}] gen_import FAILED:\n{r.stdout[-500:]}\n{r.stderr[-800:]}"); sys.exit(1)
    # regenerated idmap
    regen=read_csv(idmap); rhead=regen[0]; rrows=regen[1:]
    # drift check: (internal_id, title, section) must match committed for every row, same set
    def keytuple(row):
        # columns: internal_id, C-id, title, section[, refs]
        return (row[0], row[2], row[3])
    reg_ids={row[0] for row in rrows}; com_ids=set(cmap)
    if reg_ids!=com_ids:
        print(f"[{proj}] ID-MAP DRIFT: only-regen={sorted(reg_ids-com_ids)[:10]} only-committed={sorted(com_ids-reg_ids)[:10]}")
        sys.exit(1)
    drift=[row[0] for row in rrows if keytuple(row)!=keytuple(cmap[row[0]])]
    if drift:
        print(f"[{proj}] ID-MAP title/section DRIFT on {len(drift)}: {drift[:10]}"); sys.exit(1)
    # no drift -> restore committed id-map verbatim (keeps C-ids + refs; byte-identical to committed)
    with open(idmap,"w",newline="",encoding="utf-8") as f:
        w=csv.writer(f); w.writerow(chead); w.writerows(crows)
    restored=open(idmap,encoding="utf-8").read()
    # verify import
    imp=os.path.join(ROOT,"testrail-import",PROJ[proj]) if os.path.exists(os.path.join(ROOT,"testrail-import",PROJ[proj])) else None
    # find the import file(s) for this project
    import glob
    if proj=="report-suite":
        imps=glob.glob(os.path.join(ROOT,"testrail-import","Report-Suite_*_testrail-import.csv"))
    elif proj=="schedule":
        imps=[os.path.join(ROOT,"testrail-import","schedule-v1-testrail-import.csv")]
    else:
        imps=[os.path.join(ROOT,"testrail-import","filters-v1-testrail-import.csv")]
    shred_total=0; rowcount=0
    for ip in imps:
        rows=read_csv(ip)
        rowcount+=len(rows)-1
        # shredding guard: a cell with a newline between (nearly) every char -> many single-char lines
        for row in rows[1:]:
            for cell in row:
                if "\n" in cell:
                    segs=cell.split("\n")
                    singles=sum(1 for s in segs if len(s.strip())<=1)
                    if len(segs)>8 and singles/len(segs)>0.5: shred_total+=1
        h=sha_firstline(ip)
        if h!=peer_hdr: print(f"[{proj}] HEADER MISMATCH {os.path.basename(ip)} sha!=peer"); sys.exit(1)
    blanks=sum(1 for row in crows if row[1].strip()=="")
    refs_present=sum(1 for row in crows if len(row)>4 and row[4].strip()!="")
    print(f"[{proj}] idmap rows={len(crows)} blanks={blanks} refs={refs_present}/{len(crows)} "
          f"| import rows={rowcount} shred_cells={shred_total} header==peer=YES | idmap restored (no drift)")
print("regen done.")
