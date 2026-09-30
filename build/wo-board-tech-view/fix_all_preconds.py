# -*- coding: utf-8 -*-
"""Convert every WO Board case's PARAGRAPH preconditions to discrete, numbered, runnable,
build-glossary lines (Rule 117). Faithful: standard seed lines replace the repeated boilerplate
(Seed/setup + Build + Logged-in), and each case-specific line is kept as its own discrete step.
update_case only. Dry-run prints before/after; --apply writes."""
import json,urllib.request,base64,re,sys,html as H
c=json.load(open("/tmp/testrail/creds.json"))
HOST=c["host"].rstrip("/");AUTH=base64.b64encode(f'{c["user"]}:{c["password"]}'.encode()).decode()
def api(ep,data=None):
    r=urllib.request.Request(f"{HOST}/index.php?/api/v2/{ep}",data=(json.dumps(data).encode() if data is not None else None),
        headers={"Authorization":"Basic "+AUTH,"Content-Type":"application/json"})
    return json.load(urllib.request.urlopen(r,timeout=90))
def esc(t): return t.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")
def ol(x): return "<ol>"+"".join(f"<li>{esc(i)}</li>" for i in x)+"</ol>"
ALL=json.load(open("/tmp/wob_all_preconds.json"))

STD_TECHS=("The current location has at least 3 lead technicians shown as groups/columns "
  "(a technician is eligible when they are Clockable, Active, and their role is not Office or Time Clock User).")
STD_CREATE=("Via New Work Order, create several work orders and set a Lead Technician on each, "
  "spread across the technicians with some left Unassigned; then open the Work Orders page.")
STD_SEED_MARK="On the Work Orders QA build (Board View"  # marks the common boilerplate seed

def login_line(needs_edit):
    perm="Work Orders view permission" + (" and Work Orders create-and-edit" if needs_edit else "")
    return (f"You are signed in on the Work Orders build under test with {perm}; "
            "the Board View and Tech View display options are on.")

def split_variant(body):
    # split a non-standard seed sentence into discrete runnable lines
    body=re.sub(r'\s+',' ',body).strip()
    parts=re.split(r'\s-\s|\.\s+(?=[A-Z])|;\s+(?=[A-Z])', body)
    return [p.strip().rstrip('.')+'.' for p in parts if p.strip()]

def blocks(html):
    return [H.unescape(re.sub('<[^>]+>','',x)).strip() for x in re.findall(r'<p>(.*?)</p>',html,re.S)]

def transform(pc):
    bs=blocks(pc)
    # detect edit-permission ONLY from the dedicated login block, not the seed's conditional mention
    needs_edit=any(b.lower().startswith("logged in as") and
                   ("create-and-edit" in b.lower() or "create & edit" in b.lower() or
                    " view and " in b.lower()) for b in bs)
    out=[login_line(needs_edit), STD_TECHS]
    seed_added=False
    for b in bs:
        low=b.lower()
        if low.startswith("seed / setup:"):
            body=b.split(":",1)[1].strip()
            if STD_SEED_MARK.lower() in body.lower()[:60]:
                if not seed_added: out.append(STD_CREATE); seed_added=True
                # keep any case-specific clause after the standard "Sign in with... drags)." sentence
                tailm=re.search(r'drags\)\.\s*(.+)$', body)
                if tailm and tailm.group(1).strip():
                    for p in split_variant(tailm.group(1)): out.append(p)
            else:
                for p in split_variant(body): out.append(p)
                seed_added=True
        elif low.startswith("build:"):
            continue  # duplicate of login line
        elif low.startswith("logged in as a user with work orders view permission."):
            continue  # covered by login line
        elif low.startswith("logged in as a user with work orders view and"):
            continue  # covered by login line (needs_edit)
        elif low.startswith("logged in as"):
            out.append(b)  # a different login nuance -> keep
        else:
            out.append(b)  # case-specific data-state -> discrete line
    if not seed_added: out.insert(2,STD_CREATE)
    # dedupe while preserving order
    seen=set(); final=[]
    for l in out:
        k=re.sub(r'\s+',' ',l).strip().lower()
        if k and k not in seen: seen.add(k); final.append(re.sub(r'\s+',' ',l).strip())
    return final

def main():
    dry="--apply" not in sys.argv
    show=[a for a in sys.argv if a.startswith("show=")]
    show_ids=show[0].split("=")[1].split(",") if show else []
    done=0; skipped=0
    for cid,v in ALL.items():
        if '<li>' in v["pc"]:  # already a list (the 7 new) -> skip
            skipped+=1; continue
        newlines=transform(v["pc"])
        if cid in show_ids or (dry and done<2):
            print(f"\n===== C{cid}: {v['title']} =====")
            print("BEFORE (paragraphs):")
            for b in blocks(v["pc"]): print("   ¶",b[:140])
            print("AFTER (discrete lines):")
            for i,l in enumerate(newlines,1): print(f"   {i}. {l[:140]}")
        if not dry:
            api(f"update_case/{cid}",{"custom_preconds":ol(newlines)})
        done+=1
    print(f"\n{'[DRY] would convert' if dry else 'converted'} {done} cases | skipped {skipped} (already lists)")
main()
