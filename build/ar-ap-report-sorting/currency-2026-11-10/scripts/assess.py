"""Per-case currency assessment (10 Nov 2026): every live case vs PRD v11, Jira of 10 Nov, the 5 Nov design. Read-only; writes assess.json."""
import json, re, html, csv, collections
B = "/home/user/Manual-test-Cases/build/ar-ap-report-sorting"
OUT = f"{B}/currency-2026-11-10"
live = json.load(open(f"{OUT}/live-before/live-cases-2026-11-10.json"))["cases"]
idmap = {int(r["case_id"]): r["key"] for r in csv.DictReader(open(f"{B}/testrail-id-map.csv"))}
prop = json.load(open(f"{B}/authoring/proposals.json"))
def txt(h):
    h = re.sub(r"<(/?)(p|li|ol|ul|h\d|br)\b[^>]*>", "\n", h or ""); h = re.sub(r"<[^>]+>", "", h)
    return html.unescape(h).replace(" ", " ")
def norm(s):
    s = s.replace("“", '"').replace("”", '"').replace("’", "'").replace("‘", "'")
    return re.sub(r"\s+", " ", s).strip()
def prdtext(p):
    t = open(p, encoding="utf-8").read(); t = re.sub(r"<[^>]+>", " ", t); return norm(html.unescape(t))
PRD11 = prdtext(f"{B}/sources/CONFLUENCE-947650561-2026-11-05-read-2026-11-10.html")
PRD9 = prdtext(f"{B}/sources/CONFLUENCE-947650561-v9-2026-10-26.html")
CHANGED = {"S1-R8", "S2-R7", "S3-R8a", "S8-R3", "S9-N2"}
NEWREQ = {"S1-R5a", "S2-R1a", "S2-R1b", "S2-R7a", "S3-R7a", "S5-E3"}
# design figures changed in the 5 Nov 2026 design version
DFIG = {"The customer row stays pinned": "Grouped fig 4 caption adds the same-date time-of-day known build bug (DD-04)",
        "Cleared: No locations": "Location fig 5 picture reshot 23 Oct (round 15); caption adds 'No Totals row and no Location column' (DD-03 corrected)",
        "Links only where they can open": "Links fig 3 picture reshot 23 Oct (round 15); caption names the WIP blue, semi-bold, no underline (DD-05 corrected)",
        "Another location asks first": "Links fig 4 caption now names Cancel left, Switch location right, close x, and the 'Switch Location' known build bug (DD-01)",
        "The native Vendor menu": "Filters vendor-menu picture reshot 23 Oct (round 15); 'Search vendors' plural, shown over 8 vendors, vendors A to Z (DD-02 corrected)"}
res = []
for c in live:
    k = idmap[c["id"]]; P = txt(c["custom_preconds"]); S = txt(c["custom_steps"]); E = txt(c["custom_expected"])
    title = c["title"]; allt = "\n".join([title, P, S, E])
    head = E.split("Exact quotes from the source")[0]           # plain results (+ notes)
    tail = E.split("Exact quotes from the source")[1] if "Exact quotes from the source" in E else ""
    quotes = re.findall(r"(?m)^\s*([A-Z]{1,4}\d?-[A-Z]{0,2}\d+[a-z]?|[^\n:]{0,40}):\s*“(.*?)”\s*$", tail, re.S)
    codes = sorted(set(q[0] for q in quotes if re.match(r"^[A-Z]+\d?-", q[0])))
    reasons = []; parts = set(); bad = []
    # 1. quotes vs PRD v11 (only quotes under the PRD From line)
    prd_block = tail.split("From: Tech plan")[0].split("From: Developer verify")[0]
    for code, q in re.findall(r"(?m)^\s*([^\n:]{1,60}):\s*“(.*?)”", prd_block, re.S):
        if norm(q) not in PRD11:
            bad.append(code.strip()); parts.add("quotes")
    if bad: reasons.append("quote(s) no longer word for word in PRD v11: " + ", ".join(sorted(set(bad))))
    for cd in sorted(CHANGED & set(codes)):
        reasons.append(f"quotes {cd}, changed in v10/v11"); parts.update({"quotes"})
    # 2. behaviour triggers on tester text (title, preconditions, steps, plain results)
    tt = "\n".join([title, P, S, head]); low = tt.lower()
    trig = []
    if re.search(r'"today"|"yesterday"|days ago|reads today|shows today', low): trig.append("relative date wording (S2-R1a)")
    if re.search(r'transaction type[^.\n]{0,60}"credit"|"credit"[^.\n]{0,40}transaction type|reads "credit"|· credit ·', low): trig.append('credit Transaction Type "Credit" (S2-R1b)')
    if re.search(r"(credit memo|deposit|vendor credit)[^.\n]{0,120}(as-of date|on the as of|dated today|today's date)", low) and re.search(r"current|1-30|past due", low): trig.append("credit dated on the as-of date / its bucket or Past Due (S1-R5a)")
    if re.search(r"(credit memo|deposit|vendor credit)[^\n]{0,200}past due", low) and re.search(r"collection|a/p detail|unpaid", low): trig.append("Past Due value of a credit (S1-R5a)")
    if re.search(r"not yet due|due (in|after) \d+ days|negative|-\d+ under past due|past due[^.\n]{0,40}-\d", low): trig.append("not-yet-due Past Due (S1-R5a)")
    if re.search(r"(more than|over) 100 (documents|invoices|bills)|100 documents|first 100", low) and re.search(r"collection|unpaid", low): trig.append("100 documents inside an open customer/vendor (S1-R8)")
    if re.search(r"sort(ed)? by location|location (column )?header|click(s)? (the )?\"?location\"? (heading|header)", low) and re.search(r"one location|only location|single location|location column (is )?hid|hides|untick", low): trig.append("Location sort while the column hides (S2-R7a)")
    if "pdf" in low and re.search(r"\$-|\(-\$|negative amount|credit memo|vendor credit|deposit", low): trig.append("PDF with a negative amount (S3-R7a)")
    if "pdf" in low and re.search(r"\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w* \d{1,2},? \d{4}|date column|dates? (print|show|read)", low): trig.append("PDF dates (S3-R7a)")
    if re.search(r"location", low) and re.search(r"as of|as-of", low) and re.search(r"(change|pick|choose|set)[^.\n]{0,40}(as of|as-of)|(as of|as-of)[^.\n]{0,30}(to an earlier|to a date|earlier date|another date)", low): trig.append("Location filter with an as-of change (S5-E3)")
    if re.search(r"credit term", low) and ("csv" in low): trig.append('"Credit Term" CSV heading (S3-R8a, S9-N2)')
    if re.search(r"unpaid invoices", low) and re.search(r"1440", low) and re.search(r"wrap|location", low): trig.append("A/P Unpaid Invoices layout at 1440 (S8-R3)")
    if re.search(r"location[^.\n]{0,60}(wrap|second line|one line)|wrap[^.\n]{0,60}location", low): trig.append("Location wrapping (S8-R3)")
    if re.search(r"1-30 days past due", low) and re.search(r"credit memo|deposit|vendor credit", low): trig.append("credit in a bucket (S1-R5a check)")
    if re.search(r"bucket", low) and re.search(r"something went wrong|fail|error|not every line", low): trig.append("bucket load error (Story 4 Error Handling)")
    if trig: reasons += ["expected screen touched: " + t for t in trig]
    # 3. design
    dz = [f"{n}: {w}" for n, w in DFIG.items() if n in tail]
    if dz: reasons += ["design changed 5 Nov: " + d for d in dz]; parts.add("References from Design")
    if re.search(r"will be corrected|pictures will be", tail): reasons.append("design note says the pictures will be corrected; the 5 Nov design corrected them"); parts.add("References from Design")
    if re.search(r'· Credit ·|"Credit" \(|Transaction Type[^\n]{0,40}Credit\b', tail): reasons.append("design words show Transaction Type 'Credit' (PRD v10 S2-R1b now names the credit)"); parts.add("References from Design")
    res.append({"key": k, "case_id": c["id"], "title": title, "section_id": c["section_id"], "codes": codes, "reasons": reasons, "parts": sorted(parts),
                "marker": (re.findall(r"AUTOMATION: [^\n]*", E) or [""])[0], "refs": c.get("refs")})
json.dump(res, open(f"{OUT}/assess-raw.json", "w"), indent=1)
n = collections.Counter(bool(r["reasons"]) for r in res); print("flagged", n)
tc = collections.Counter(x[:110] for r in res for x in r["reasons"])
for t, v in tc.most_common(): print(v, t)

# --- diagnostics: quotes not found in v11, are they found in v9?
seen = {}
for c in live:
    E = txt(c["custom_expected"]); tail = E.split("Exact quotes from the source")[1] if "Exact quotes from the source" in E else ""
    prd_block = tail.split("From: Tech plan")[0].split("From: Developer verify")[0]
    for code, q in re.findall(r"(?m)^\s*([^\n:]{1,60}):\s*“(.*?)”", prd_block, re.S):
        nq = norm(q)
        if nq not in PRD11: seen.setdefault((code.strip(), nq), []).append(idmap[c["id"]])
json.dump([{"code": k[0], "quote": k[1], "in_v9": k[1] in PRD9, "cases": v} for k, v in seen.items()], open(f"{OUT}/quotes-not-in-v11.json", "w"), indent=1)
for (code, q), v in seen.items(): print("NOTFOUND", code, "| in v9:", q in PRD9, "|", len(v), "cases |", q[:160])
