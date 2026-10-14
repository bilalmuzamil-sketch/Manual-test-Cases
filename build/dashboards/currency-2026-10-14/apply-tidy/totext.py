import json, re, html, sys
H="apply-tidy"; scope=json.load(open(f"{H}/scope.json"))
def t(h):
    h=re.sub(r"<li>","\n- ",h or ""); h=re.sub(r"</p>|<br>|</h\d>","\n",h); h=re.sub(r"<[^>]+>","",h)
    return re.sub(r"\n\s*\n+","\n",html.unescape(h)).strip()
with open(f"{H}/cases-text.txt","w") as f:
    for c in scope:
        d=json.load(open(f"{H}/snap-start/C{c}.json"))
        f.write(f"\n######## C{c} | atm {d['custom_atmstatus']} | refs {d.get('refs')} | {d['title']}\n## PRE\n{t(d['custom_preconds'])}\n## STEPS\n{t(d['custom_steps'])}\n## EXP\n{t(d['custom_expected'])}\n")
