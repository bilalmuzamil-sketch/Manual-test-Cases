# -*- coding: utf-8 -*-
"""Apply the new case layout to the gap-fill cases (QA lead, 2026-10-01):
  TOP of preconditions: "How to test this" (automatable, or manual-preferred + WHY);
    for not-in-this-release cases also the author's release statement.
  BOTTOM of expected (after a line break): "Note from the author" — what the spec says about this.
Preview (no --apply) prints the full new preconds+expected for the sample ids."""
import json,urllib.request,base64,sys,re
c=json.load(open("/tmp/testrail/creds.json"))
HOST=c["host"].rstrip("/");AUTH=base64.b64encode(f'{c["user"]}:{c["password"]}'.encode()).decode()
def api(ep,data=None):
    r=urllib.request.Request(f"{HOST}/index.php?/api/v2/{ep}",data=(json.dumps(data).encode() if data is not None else None),
        headers={"Authorization":"Basic "+AUTH,"Content-Type":"application/json"})
    return json.load(urllib.request.urlopen(r,timeout=90))
def esc(t): return t.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")

MR_NOTE=("The spec author marked these Maintenance Reminders requirements as a draft: the wording was "
 "copied as it stands from the specification, has not yet been reviewed for handoff, and will be "
 "rewritten into the final format before developers pick it up. Treat the expected result as "
 "provisional until that rewrite. (Source: Confluence 'Chunk 2 MR', page 897679389.)")
DI_8347_NOTE=("The author says deletion is gated on the inspection's own status and the Work Orders > "
 "Lines permission, independent of the line's status: an incomplete inspection can be deleted even "
 "when its line is Complete. Today the Delete icon is wrongly hidden and the tester sees View mode "
 "only. (Source: story SV-8347.)")
DI_9882_NOTE=("The author says the inspection viewer today cannot display HEIC, TIFF, Word or Excel and "
 "only offers a download; this story adds server-side conversion, done on upload, so they render in "
 "place, while the download still returns the original file. Narrowing the accepted file types was "
 "rejected. (Source: story SV-9882.)")

AUTO="Can be automated - deterministic UI steps and on-screen values an automation script can drive and check."
# cid -> ("auto") or ("manual","why") ; and author note
MR=range(195859,195876); DI=range(195849,195859)
METHOD={}
for cid in list(MR)+list(DI): METHOD[cid]=("auto",)
METHOD[195862]=("manual","a person must confirm the badge colours (compliance shows orange, not red), the hover contents and the panel layout render correctly - a visual judgement a script cannot reliably make.")
METHOD[195853]=("manual","a person must confirm the converted document actually renders readably in the viewer, not merely that a frame appears - rendering fidelity is a visual judgement.")
METHOD[195854]=("manual","a person must confirm the converted spreadsheet renders readably in the viewer, not merely that a frame appears - rendering fidelity is a visual judgement.")
METHOD[195855]=("manual","a person must judge whether the wide spreadsheet is readable without clipping columns - the spec flags this as the case most likely to need a layout decision.")
METHOD[195856]=("manual","a person must confirm the converted photo/image renders correctly as an image in place - visual fidelity.")
METHOD[195857]=("manual","a person downloads the file and confirms it opens as the original type (e.g. a spreadsheet, not a PDF); proving the bytes are byte-for-byte identical needs automation / a checksum.")
def note(cid):
    if cid in MR: return MR_NOTE
    if cid in (195849,195850,195851,195852): return DI_8347_NOTE
    return DI_9882_NOTE

def top_banner(cid):
    m=METHOD[cid]
    if m[0]=="auto": txt="Can be automated - "+AUTO.split(" - ",1)[1]
    else: txt="Manual testing preferred. Why: "+m[1]
    return f"<p><strong>&#9654; How to test this:</strong> {esc(txt)}</p><p>&mdash; &mdash; &mdash;</p>"

def reformat(cid):
    cid=int(cid); live=api(f"get_case/{cid}")
    pre=live["custom_preconds"] or ""; exp=live["custom_expected"] or ""
    # strip any prior top banner / author note (idempotent; note may be before or after the marker)
    pre=re.sub(r'^<p><strong>&#9654; How to test this:.*?&mdash;</p>','',pre)
    exp=re.sub(r'<p>&mdash; &mdash; &mdash;</p><p><strong>Note from the author.*?</p>','',exp)
    newpre=top_banner(cid)+pre
    # author note is the LAST block, after the AUTOMATION marker (QA lead 2026-10-01: note truly last).
    # The marker stays the single machine literal the arithmetic counter greps for.
    note_block=f"<p>&mdash; &mdash; &mdash;</p><p><strong>Note from the author (what the spec says about this):</strong> &ldquo;{esc(note(cid))}&rdquo;</p>"
    newexp=exp+note_block
    if "--apply" in sys.argv:
        api(f"update_case/{cid}",{"custom_preconds":newpre,"custom_steps":live["custom_steps"],"custom_expected":newexp})
        print(f"[OK] C{cid} reformatted")
    return newpre,newexp

if __name__=="__main__":
    samples=[int(a) for a in sys.argv if a.isdigit()] or [195862,195849]
    for cid in samples:
        pre,exp=reformat(cid)
        d=api(f"get_case/{cid}")
        print(f"\n===== C{cid}: {d['title']} =====")
        print("--- PRECONDITIONS (new) ---"); print(re.sub('<[^>]+>','|',pre)[:900])
        print("--- EXPECTED tail (new) ---"); print(re.sub('<[^>]+>','|',exp)[-700:])
