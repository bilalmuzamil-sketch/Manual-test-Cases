"""Print a case from authoring/proposals.json as the tester reads it (title, preconditions, steps, expected result, notes),
optionally the quotes and design block (--all). Read-only."""
import json, re, html, sys
B = "/home/user/Manual-test-Cases/build/ar-ap-report-sorting"
prop = json.load(open(f"{B}/authoring/proposals.json"))
def t(h):
    h = re.sub(r"<li>", "\n  - ", h or ""); h = re.sub(r"</p>|</ul>|</ol>", "\n", h); h = re.sub(r"<[^>]+>", "", h)
    return re.sub(r"\n\s*\n+", "\n", html.unescape(h)).strip()
keys = sys.argv[1].split(","); full = "--all" in sys.argv
for k in keys:
    f = prop[k]["fields"]; e = f["custom_expected"]
    head, _, tail = e.partition("<p><strong>Exact quotes")
    print(f"######## {k} | {f['title']} | refs {f['refs']}")
    print(t(f["custom_preconds"])); print("STEPS:"); print(t(f["custom_steps"].replace("<li>", "<li>• ")))
    print(t(head))
    if full: print("---- " + t("<p><strong>Exact quotes" + tail))
    else: print("---- marker:", re.findall(r"AUTOMATION: [^<]*", e)[-1])
