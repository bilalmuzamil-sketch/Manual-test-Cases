"""Own diff of PRD v9 (26 Oct copy) vs current (5 Nov, read 10 Nov): HTML text blocks, so non-requirement text is compared too."""
import re, html, difflib, sys
S = "/home/user/Manual-test-Cases/build/ar-ap-report-sorting/sources"
def blocks(path):
    t = open(path, encoding="utf-8").read()
    t = re.sub(r"<(/?)(p|li|h[1-6]|tr|td|th)\b[^>]*>", "\n", t)
    t = re.sub(r"<[^>]+>", "", t)
    t = html.unescape(t).replace(" ", " ")
    return [re.sub(r"\s+", " ", l).strip() for l in t.split("\n") if l.strip()]
a = blocks(f"{S}/CONFLUENCE-947650561-v9-2026-10-26.html"); b = blocks(f"{S}/CONFLUENCE-947650561-2026-11-05-read-2026-11-10.html")
print("blocks v9", len(a), "current", len(b))
d = [l for l in difflib.unified_diff(a, b, "v9", "current", n=0, lineterm="")]
open(sys.argv[1], "w").write("\n".join(d))
print("diff lines", len(d), "removed", sum(1 for l in d if l.startswith("-") and not l.startswith("---")), "added", sum(1 for l in d if l.startswith("+") and not l.startswith("+++")))
# md vs html completeness check for the current copy
md = open(f"{S}/CONFLUENCE-947650561-2026-11-05-read-2026-11-10.md", encoding="utf-8").read()
mdn = re.sub(r"\s+", " ", re.sub(r"[*_`>|\\]", "", md))
miss = [x for x in b if re.sub(r"[*_`>|\\]", "", x) not in mdn and len(x) > 3]
print("html text blocks not found verbatim in md:", len(miss)); [print("  ", m[:150]) for m in miss[:15]]
