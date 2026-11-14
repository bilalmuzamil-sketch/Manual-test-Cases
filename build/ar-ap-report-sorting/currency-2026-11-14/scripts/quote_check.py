"""Re-stamp proof (QA lead 14 Nov 2026: "re-stamp every other case to v13, but only after a script proves its quotes are word for word in v13").
For every final body (the live-merged body of each existing case, the library body of each new case; the 14 Demo Day cases are not touched):
parse the quotes block, strip HTML and unescape, and check each quote word for word against its own source: PRD labels against PRD version 13
(sources/CONFLUENCE-947650561-v13-read-2026-11-13.md, markdown marks removed as the library does), Chris Ward's answers, the tech plan, the Jira
reading record, the saved Slack post. Also: every PRD From line names version 13 and none names 11 or 12. Writes quote-check.json; exit 1 on any failure."""
import sys, os, re, json, html
B = "/home/user/Manual-test-Cases/build/ar-ap-report-sorting"; W = f"{B}/currency-2026-11-14"
sys.path.insert(0, f"{B}/authoring"); os.chdir(f"{B}/authoring")
import ar_lib as L
V13MD = open(f"{B}/sources/CONFLUENCE-947650561-v13-read-2026-11-13.md").read().split("<!-- Saved")[0]
V13W = L.ws(L.md_to_text(V13MD)); V13RAW = L.ws(re.sub(r"\[([^\]]*)\]\(([^)]*)\)", r"\1", V13MD))
M = json.load(open(f"{W}/proposals-v13-on-live.json")); P = json.load(open(f"{B}/authoring/proposals.json"))
DEMO = {f"D-{n}" for n in range(82, 96)}
bodies = {k: v["fields"]["custom_expected"] for k, v in M.items()}
bodies.update({k: v["fields"]["custom_expected"] for k, v in P.items() if k not in M and k not in DEMO})
def src_ok(lab, t):
    t = L.ws(t)
    if lab.startswith("Chris Ward's answer"): return t in L.ws(L.ANS[int(re.findall(r"\d+", lab)[0])]), "answer"
    if lab.startswith("Tech plan"): return (t in L.TPW or t in L.TP_RAWW), "tech plan"
    if lab.startswith("Jira SV-"): return t in L.JIRAW, "Jira reading"
    if lab.startswith("Slack, Chris Ward"): return t in L.SLACKW, "Slack"
    return (t in V13W or t in V13RAW), "PRD v13"
out, fails, n = {}, {}, 0
for k, e in sorted(bodies.items()):
    part = e.split("Exact quotes from the source")[-1].split("References from Design")[0]
    froms = re.findall(r"<p>From: ([^<]*)</p>", part)
    vers = re.findall(r"Confluence 947650561, version (\d+)", " ".join(froms))
    rows = []
    for li in re.findall(r"<li>(.*?)</li>", part, re.S):
        m = re.match(r"\s*<strong>(.*?):</strong>\s*(.*)$", li, re.S)
        if not m: continue
        lab = html.unescape(re.sub(r"<[^>]+>", "", m.group(1))).strip()
        t = html.unescape(re.sub(r"<[^>]+>", "", m.group(2))).strip()
        t = re.sub(r'^[“"]', "", t); t = re.sub(r'[”"]$', "", t)
        ok, src = src_ok(lab, t); rows.append({"label": lab, "source": src, "ok": ok}); n += 1
        if not ok: fails.setdefault(k, []).append(lab)
    bad_from = [v for v in vers if v != "13"]
    if bad_from or not vers: fails.setdefault(k, []).append(f"From line PRD versions {vers}")
    out[k] = {"quotes": rows, "prd_versions": vers}
json.dump({"cases": len(bodies), "quotes": n, "fails": fails, "detail": out}, open(f"{W}/quote-check.json", "w"), indent=1, ensure_ascii=False)
print("cases", len(bodies), "| quotes checked", n, "| cases failing", len(fails), fails)
sys.exit(1 if fails else 0)
