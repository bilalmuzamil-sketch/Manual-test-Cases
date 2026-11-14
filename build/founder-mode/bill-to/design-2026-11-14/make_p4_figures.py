#!/usr/bin/env python3
"""Page 4 ("Service For band on invoices and estimates") of the Bill To design, version 1794608112-d8a1 (14 Nov 2026): only this board
changed; the other 7 boards are byte-identical to version 1794239066-4906 (design-2026-11-09/). Reads files/project/ServiceFor.dc.html,
copies each redrawn picture (fetched with the Artifact tool, read with paths, 14 Nov 2026) to ../design-2026-11-09/images/ with a
-2026-11-14 suffix, and writes DESIGN-FIGURES-P4-2026-11-14.json in the same shape as DESIGN-FIGURES-2026-11-09.json.
python3 make_p4_figures.py <folder holding project/shots/*.png>"""
import re, html, json, os, sys, shutil, hashlib
H = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(H)
SRC = sys.argv[1]
s = open(f"{H}/files/project/ServiceFor.dc.html").read()
GROUP = {"invoice-billed-to-other": "invoice", "estimate-billed-to-other": "estimate", "part-sale-no-vehicle": "part-sale",
         "invoice-pays-for-itself": "pays-for-itself", "batch": "batch-page-1"}
out, n = [], 0
for row in re.split(r'<h3 class="bt-rowt">', s)[1:]:
    rowt = html.unescape(row.split("</h3>")[0])
    for fig in re.findall(r'<figure class="bt-fig">(.*?)</figure>', row, re.S):
        n += 1
        badge = html.unescape(re.search(r'sv-badge[^"]*">([^<]+)<', fig).group(1))
        name = html.unescape(re.search(r'bt-name">([^<]+)<', fig).group(1))
        src = re.search(r'src="([^"]+)"', fig).group(1); alt = html.unescape(re.search(r'alt="([^"]*)"', fig).group(1))
        caps = [html.unescape(re.sub(r"<[^>]+>", "", c)) for c in re.findall(r"<li>(.*?)</li>", fig, re.S)]
        side = "before" if "/before-" in src else "after"
        g = next(v for k, v in GROUP.items() if k in src)
        lay = "modern" if "modern" in src else ("legacy" if "legacy" in src else "")
        pic = f"bt-p4-{n:02d}-{side}-" + "-".join(x for x in (lay, g) if x) + "-2026-11-14.png"
        shutil.copyfile(f"{SRC}/project/{src}", f"{P}/design-2026-11-09/images/{pic}")
        out.append({"board": "ServiceFor.dc.html", "page": 4, "page_name": "Service For band on invoices and estimates", "n": n,
                    "row": rowt, "badge": badge, "heading": name, "captions": caps, "picture_in_design": src,
                    "figure_picture": f"images/{pic}", "alt": alt,
                    "sha256": hashlib.sha256(open(f"{SRC}/project/{src}", "rb").read()).hexdigest()})
json.dump({"design": "Bill To design, https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd, version 1794608112-d8a1, page 4 only",
           "made": "14 Nov 2026", "figures": len(out), "list": out}, open(f"{H}/DESIGN-FIGURES-P4-2026-11-14.json", "w"), indent=1, ensure_ascii=False)
for x in out: print(x["n"], x["figure_picture"], "|", x["row"][:30], "|", x["badge"], x["heading"])
