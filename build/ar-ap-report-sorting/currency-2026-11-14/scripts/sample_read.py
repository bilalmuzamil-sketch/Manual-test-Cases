"""Print the final tester text (title, preconditions, steps, results above the quotes) of a seeded random sample of the rewrite set + new cases."""
import json, random, re, html, sys
B = "/home/user/Manual-test-Cases/build/ar-ap-report-sorting"; W = f"{B}/currency-2026-11-14"
sys.path.insert(0, f"{B}/authoring"); import v13_layout as V
M = json.load(open(f"{W}/proposals-v13-on-live.json")); P = json.load(open(f"{B}/authoring/proposals.json"))
NEW = ["S3-33", "S3-34", "S3-35", "S3-36", "S5-41b", "S5-43"]
pool = sorted(V.REWRITE) + NEW
keys = sorted(random.Random(20261114).sample(pool, 20))
json.dump(keys, open(f"{W}/sample-20-keys.json", "w"))
def txt(s):
    s = re.sub(r"<li>", "\n - ", s or ""); s = re.sub(r"</p>|</ul>|</ol>", "\n", s); s = re.sub(r"<[^>]+>", "", s)
    return re.sub(r"\n\s*\n+", "\n", html.unescape(s)).strip()
part = sys.argv[1] if len(sys.argv) > 1 else "0"
for k in (keys[:10] if part == "0" else keys[10:]):
    f = (M.get(k) or P[k])["fields"]; e = f["custom_expected"].split("Exact quotes")[0]
    steps = re.findall(r"<li>(.*?)</li>", f["custom_steps"])
    print(f"\n===== {k} | {f['title']}\n{txt(f['custom_preconds'])}\nSTEPS: " + " | ".join(f"{i}. {html.unescape(s)}" for i, s in enumerate(steps, 1)) + "\n" + txt(e))
