#!/usr/bin/env python3
"""Unpack a Claude design canvas saved by the Artifact tool (Rule 124 step 1).
  python3 extract_artifact_canvas.py <saved raw html> <out folder>
Writes <out>/artifact-raw.html (as received), <out>/artifact-page.html (browser-ready: '</' re-escaped inside the
embedded JSON, value unchanged), <out>/files/* (every embedded file), <out>/png/* (board images) and
<out>/board-files-md5.txt. Trap (13 Oct 2026): a saved copy can hold unescaped '</script' inside the JSON, which makes
the browser end the script early and the canvas render as loose text."""
import sys, json, os, re, base64, hashlib, shutil
src, out = sys.argv[1], sys.argv[2]
os.makedirs(f"{out}/files", exist_ok=True); os.makedirs(f"{out}/png", exist_ok=True)
shutil.copy(src, f"{out}/artifact-raw.html")
s = open(src, encoding="utf-8").read()
tag = '<script type="application/json" id="appifact-doc">'
i = s.index(tag) + len(tag); d, e = json.JSONDecoder().raw_decode(s, i)
seg = s[i:e].replace("</", "<\\/"); assert json.loads(seg) == d
open(f"{out}/artifact-page.html", "w", encoding="utf-8").write(s[:i] + seg + s[e:])
md5 = []
for name, v in d["content"]["files"].items():
    binary = name.lower().endswith((".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".woff", ".woff2", ".ttf"))
    data = base64.b64decode(v) if binary else (v if isinstance(v, str) else json.dumps(v)).encode()
    p = os.path.join(out, "files", name); os.makedirs(os.path.dirname(p), exist_ok=True); open(p, "wb").write(data)
    md5.append(f"{hashlib.md5(data).hexdigest()}  {name}")
    if not binary:
        for k, (ext, b) in enumerate(re.findall(r"data:image/(png|jpe?g|webp);base64,([A-Za-z0-9+/=]+)", data.decode("utf-8", "ignore"))):
            base = os.path.splitext(os.path.basename(name))[0].replace(".dc", "")
            open(f"{out}/png/{base}{'' if k == 0 else '-' + str(k)}.{'png' if ext == 'png' else 'jpg'}", "wb").write(base64.b64decode(b))
open(f"{out}/board-files-md5.txt", "w").write("\n".join(sorted(md5, key=lambda x: x.split("  ")[1])) + "\n")
print(f"title: {d.get('title')} · files: {len(md5)} · images: {len(os.listdir(out + '/png'))} · comments: {len(d.get('comments') or [])}")
