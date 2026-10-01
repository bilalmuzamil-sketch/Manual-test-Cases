# -*- coding: utf-8 -*-
"""QA lead 2026-10-01 (round 3):
 (A) Rewrite C195857 so the byte-for-byte download check is RUNNABLE by a manual tester via a hand-back
     step (tester downloads + returns the file; the test author confirms it matches the original).
 (B) Add a plain-language "Where this stands for testing / What we are waiting on" block to every gap
     case that is not yet runnable on a build. It sits just above the author note (note stays last).
Idempotent. --apply writes; dry otherwise."""
import sys,re
sys.path.insert(0,"build/gap-fill")
import gf_deferred as G
api,esc,ol,ul = G.api,G.esc,G.ol,G.ul
APPLY="--apply" in sys.argv

# ---------------- (A) C195857 full rewrite ----------------
BANNER=("<p><strong>&#9654; How to test this:</strong> Manual testing (runnable with a hand-back step). "
 "A byte-for-byte match cannot be judged by eye, so the tester downloads the file and hands it back to "
 "the test author, who confirms it is identical to the original uploaded file (same file size and "
 "contents / matching checksum). That makes the whole check doable by hand.</p>"
 "<p>&mdash; &mdash; &mdash;</p>")
PRE=[
 "Build: Digital Inspection V2, on a reachable QA environment.",
 "An Excel reference file that renders as a document in the viewer after conversion (e.g. 'ZZAUTOTEST-torque-chart.xlsx'); the test author keeps a copy of the exact file that was uploaded.",
 "A HEIC reference file that renders as an image in the viewer after conversion (e.g. 'ZZAUTOTEST-photo.heic'); the test author keeps a copy of the exact file that was uploaded.",
 "A work order running that inspection, open on the technician fill screen.",
]
STEPS=[
 "Open the Excel reference file in the viewer and select Download; save the downloaded file.",
 "Open the HEIC reference file in the viewer and select Download; save the downloaded file.",
 "Check each download's file type: the Excel one ends .xlsx and opens in Excel; the HEIC one is a .heic image file - neither is a PDF or a converted web image.",
 "Hand both downloaded files back to the test author (attach or send them).",
 "Test author: compare each downloaded file against the original that was uploaded - same file size and same contents (a checksum / byte compare).",
]
RESULTS=[
 "Each download opens as the ORIGINAL type: the Excel one is a spreadsheet ending .xlsx; the HEIC one is the original .heic image - not the converted view and not a PDF.",
 "When the test author compares each downloaded file with the original upload, they are identical (same file size, same contents / matching checksum).",
 "The file shown in the viewer is the converted rendering; the file that downloads is the original the author uploaded.",
]
SRC=("Epic SV-8181 (Digital Inspection V2); story SV-9882 (DVI V2 - Convert reference files the viewer "
 "cannot render); Jira description (current, primary) + Confluence 768507905 S11-R4/R9; read 1 Oct 2026. "
 "Source-verified 1 October 2026; not yet build-verified.")
QUOTES=[("SV-9882 requirement","The original file is kept and is what the download action returns. The conversion is a rendering convenience, not a replacement — an author who uploaded an Excel sheet gets an Excel sheet back"),
        ("SV-9882 QA note","The download action still returns the original file, not the converted one")]
NOTE857=("The author says the inspection viewer today cannot display HEIC, TIFF, Word or Excel and only "
 "offers a download; this story adds server-side conversion, done on upload, so they render in place, "
 "while the download still returns the original file. Narrowing the accepted file types was rejected. "
 "(Source: story SV-9882.)")
MARK857="authored from story SV-9882 (status Open, not yet built); no reachable QA build - not build-verified."

def rewrite_857():
    preconds=BANNER+ol(PRE)
    exp=("<p><strong>Expected results</strong></p>"+ul(RESULTS)
         +f"<p><strong>Source - where this behaviour comes from</strong><br>{esc(SRC)}</p>"
         +"<p><strong>Exact quotes from the source (for reproducibility)</strong></p>"
         +"<ul>"+"".join(f"<li><strong>{esc(a)}:</strong> &ldquo;{esc(q)}&rdquo;</li>" for a,q in QUOTES)+"</ul>"
         +f"<p>AUTOMATION: HOLD - {esc(MARK857)}</p>"
         +"<p>&mdash; &mdash; &mdash;</p>"
         +f"<p><strong>Note from the author (what the spec says about this):</strong> &ldquo;{esc(NOTE857)}&rdquo;</p>")
    if APPLY:
        d=api("get_case/195857")
        api("update_case/195857",{"title":"Download returns the original uploaded file, not the converted version",
            "custom_preconds":preconds,"custom_steps":ol(STEPS),"custom_expected":exp})
        print("[OK] C195857 rewritten runnable")
    else:
        print("[DRY] C195857 would be rewritten (steps:",len(STEPS),"results:",len(RESULTS),")")

# ---------------- (B) testing-standing block ----------------
def standing(cid):
    if 195849<=cid<=195858: return ("Not testable on a build yet - these Digital Inspection V2 changes are not on a reachable QA environment.",
        "the stories SV-8347 and SV-9882 to be built on a reachable QA branch.")
    if 195859<=cid<=195875: return ("Not testable on a build yet - the Maintenance Reminders feature is not on a QA environment, and the expected wording is quoted from a draft spec page that may be reworded.",
        "the feature to be built on a QA branch, and the Chunk 2 spec page to be finalised.")
    if 195876<=cid<=195879: return ("Not for this release - listing parts-pricing rules that have no category is split to a later ticket and is not built now.",
        "the later ticket (SV-10403) to ship; until then our existing live case still correctly tests today's behaviour (those rules are not listed).")
    if 195880<=cid<=195892: return ("Not for this release - the automatic customer reminder email is deferred to a later phase (Phase 5).",
        "the feature to be scheduled and built, and four open questions about how the mail is sent (who it comes from, whether mass sending is possible, what queues the daily sends, the send time) to be answered.")
    if 195893<=cid<=195896: return ("Not testable on a build yet - the per-fee QuickBooks mapping is not built, and there is no formal spec yet, only a client request.",
        "the feature to be built and a spec with acceptance criteria written; testing also needs a ShopView org connected to a QuickBooks test company.")
    return None

STRIP=re.compile(r'<p>&mdash; &mdash; &mdash;</p><p><strong>Where this stands for testing:.*?</p>', re.S)
INS=re.compile(r'(<p>AUTOMATION: HOLD - [^<]*</p>)(<p>&mdash; &mdash; &mdash;</p><p><strong>Note from the author)', re.S)

def add_standing():
    done=0;bad=[]
    for cid in range(195849,195897):
        st=standing(cid)
        if not st: bad.append((cid,"no-category")); continue
        d=api(f"get_case/{cid}"); exp=d["custom_expected"] or ""
        exp=STRIP.sub("",exp)  # idempotent
        block=(f"<p>&mdash; &mdash; &mdash;</p><p><strong>Where this stands for testing:</strong> {esc(st[0])} "
               f"<strong>What we are waiting on:</strong> {esc(st[1])}</p>")
        new,n=INS.subn(r"\1"+block+r"\2",exp)
        if n!=1: bad.append((cid,f"insert-count={n}")); continue
        if APPLY:
            api(f"update_case/{cid}",{"custom_preconds":d["custom_preconds"],"custom_steps":d["custom_steps"],"custom_expected":new}); done+=1
        else: done+=1
    print(("[APPLY]" if APPLY else "[DRY]"),"standing added:",done,"problems:",bad)

if __name__=="__main__":
    rewrite_857()
    add_standing()
