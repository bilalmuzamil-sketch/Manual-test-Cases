#!/usr/bin/env python3
"""Simple Flow — TestRail UPDATE-file generator (incremental unblock loop).

Given a list of SF- case IDs whose blocker just cleared, emit a TestRail-ready
UPDATE file containing ONLY those cases, rebuilt from the current case JSONs
(so any flipped viu_status / expected is picked up). This does NOT hit TestRail.

OUTPUT FORMAT
  - DEFAULT = TestRail suite XML (sections -> cases). Follows TestRail's XML
    import schema (suite/section/case with custom preconds/steps/expected). When
    the id map is present each case carries a <id>C#####</id> so the import
    TARGETS the existing case in place (no duplicates); without the map the case
    is emitted title-only and TestRail creates/matches by title.
  - --format csv still available: ID-matched CSV (updates cases IN PLACE) whose
    first column is the TestRail Case ID (e.g. 12345 or C12345); on import map
    that column to "ID" and choose "update existing".

MATCHING (both formats)
  - The Case-ID map build/simple-flow/testrail-id-map.csv (columns:
    sf_id,testrail_case_id) is what lets an UPDATE target existing cases. Pull it
    read-only via the TestRail API (with user permission) or the user exports it
    after the initial import.
  - If the map is ABSENT (or a given SF id is missing from it) the case is emitted
    keyed by Title (no <id>/ID column) and a WARNING is printed — Title matching
    risks duplicates, so establishing the id map is preferred.

CONTENT RULES: identical to gen_import.py — NO VIU wording, NO feature-flag phrase,
leaf section names, References = Jira story id(s) + spec-rule ref.

USAGE
  python3 gen_update.py SF-BULK-01 SF-BULK-02 ...        # ids on the command line
  python3 gen_update.py --file ids.txt                    # one SF id per line
  python3 gen_update.py --all-ready                       # every READY case (from tracker logic); emits XML
  python3 gen_update.py SF-REV-10 --format csv            # emit CSV instead of the default XML
  python3 gen_update.py SF-REV-10 --out /tmp/update.xml   # custom output path
  python3 gen_update.py SF-REV-10 --map /path/to/map.csv  # custom id-map path
"""
import argparse, csv, json, os, re, sys, html

BASE = os.path.dirname(os.path.abspath(__file__))          # build/simple-flow
ROOT = os.path.dirname(os.path.dirname(BASE))              # repo root
CASES_DIR = os.path.join(BASE, "cases")
REF = os.path.join(ROOT, "testrail-import", "sv5319-testrail-import-MATCHED.csv")
DEFAULT_MAP = os.path.join(BASE, "testrail-id-map.csv")
OUT_DIR = os.path.join(ROOT, "testrail-import")

FILES = [
    "group-A-settings-completion.json",
    "group-B-receiving-vendor.json",
    "group-C-review-permissions-validation-edge.json",
]

SV = {1: "SV-7696", 2: "SV-7697", 3: "SV-7698", 4: "SV-7699", 5: "SV-7700",
      6: "SV-7701", 7: "SV-7702", 8: "SV-7703", 9: "SV-7704", 10: "SV-7705",
      11: "SV-7706", 12: "SV-7707", 13: "SV-7708", 14: "SV-7709", 15: "SV-7710",
      16: "SV-7870", 17: "SV-7876", 18: "SV-8353"}


# --- shared content helpers (kept in sync with gen_import.py) ----------------
def clean(s):
    if not s:
        return s
    s = re.sub(r"\s*\(see (?:SF|FD)-[A-Z0-9-]+\)", "", s)
    m = re.match(r"^(\s*\d+\.\s*)EXPECTED PER SPEC:\s*(.*)$", s, re.I | re.S)
    if m:
        rest = m.group(2)
        rest = rest[:1].upper() + rest[1:] if rest else rest
        s = m.group(1) + rest
    return s


def joinlines(lst):
    return "\n".join(clean(x.rstrip()) for x in (lst or []))


def story_numbers(c):
    nums = set()
    a = c["area"]
    sr = c.get("story_ref", "") or ""
    for m in re.findall(r"\(Stor(?:y|ies)\s+([0-9/ and]+)\)", a):
        for n in re.findall(r"\d+", m):
            nums.add(int(n))
    for n in re.findall(r"\bS(\d+)-", sr):
        nums.add(int(n))
    for n in re.findall(r"\bS(\d+)\b(?!-)", sr):
        nums.add(int(n))
    for m in re.findall(r"\bStor(?:y|ies)\s+([0-9/ and]+)", sr):
        for n in re.findall(r"\d+", m):
            nums.add(int(n))
    if re.search(r"\bTS-?R?\d*", sr):
        nums.add(17)
    tmp = re.sub(r"\b(?:TS|C)-R\d+", "", sr)  # TS-R# = Story 17; C-R# = Story 18 core rules
    if not re.search(r"\bS\d+-", tmp) and re.search(r"\bR\d+\b", tmp):
        nums.add(16)
    return sorted(n for n in nums if n in SV)


def build_refs(c):
    nums = story_numbers(c)
    svs = [SV[n] for n in nums]
    spec = (c.get("story_ref") or "").strip()
    if svs and spec:
        return "{} ({})".format(", ".join(svs), spec)
    if svs:
        return ", ".join(svs)
    return spec


def section_for(c):
    """Leaf area name; API-related cases route to 'API — <area>' (STANDING RULE 4).
    Kept in sync with gen_import.py."""
    area = c["area"].strip()
    if c.get("api_related"):
        return "API — " + area
    return area


def load_cases():
    cases = []
    for fn in FILES:
        cases += json.load(open(os.path.join(CASES_DIR, fn)))
    return {c["id"]: c for c in cases}, cases


def load_map(path):
    if not path or not os.path.exists(path):
        return {}
    m = {}
    with open(path, newline="") as f:
        for row in csv.DictReader(f):
            sf = (row.get("sf_id") or "").strip()
            # Accept either an explicit testrail_case_id column or the exported
            # TestRail "ID"/"id"/"case_id" column (the map is exported from TestRail).
            tr = (row.get("testrail_case_id") or row.get("ID")
                  or row.get("id") or row.get("case_id") or "").strip()
            if sf and tr:
                m[sf] = tr
    return m


def ready_ids():
    """Return the SF ids currently classified READY by gen_blockers."""
    import importlib.util
    spec = importlib.util.spec_from_file_location("gen_blockers",
                                                  os.path.join(BASE, "gen_blockers.py"))
    gb = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(gb)
    _, cases = gb.load_cases(), None
    cases = []
    for fn in FILES:
        cases += json.load(open(os.path.join(CASES_DIR, fn)))
    return [c["id"] for c in cases if gb.classify(c)["state"] == "READY"]


def main():
    ap = argparse.ArgumentParser(description="Emit a TestRail UPDATE file for cleared cases.")
    ap.add_argument("ids", nargs="*", help="SF- case IDs to include")
    ap.add_argument("--file", help="file with one SF id per line")
    ap.add_argument("--all-ready", action="store_true", help="include every READY case")
    ap.add_argument("--map", default=DEFAULT_MAP, help="path to sf_id->testrail_case_id map CSV")
    ap.add_argument("--format", choices=["csv", "xml"], default="xml", help="output format (default xml)")
    ap.add_argument("--out", help="output path (default under testrail-import/)")
    args = ap.parse_args()

    ids = list(args.ids)
    if args.file:
        ids += [ln.strip() for ln in open(args.file) if ln.strip() and not ln.startswith("#")]
    if args.all_ready:
        ids += ready_ids()
    ids = [i.strip() for i in ids if i.strip()]
    # de-dupe, preserve order
    seen = set(); ids = [i for i in ids if not (i in seen or seen.add(i))]
    if not ids:
        ap.error("no case IDs supplied (pass SF- ids, --file, or --all-ready)")

    by_id, _ = load_cases()
    missing = [i for i in ids if i not in by_id]
    if missing:
        sys.exit("ERROR: unknown SF ids (not in cases/*.json): " + ", ".join(missing))

    idmap = load_map(args.map)
    if not idmap:
        print("WARNING: no id map at {} — emitting Title-keyed rows. ID-matching is "
              "PREFERRED to avoid duplicate cases on import. Export the TestRail Case "
              "IDs into build/simple-flow/testrail-id-map.csv (sf_id,testrail_case_id).".format(args.map),
              file=sys.stderr)

    rows = []           # list of (sf_id, testrail_id_or_None, case)
    unmapped = []
    for i in ids:
        c = by_id[i]
        tr = idmap.get(i)
        if idmap and not tr:
            unmapped.append(i)
        rows.append((i, tr, c))
    if unmapped:
        print("WARNING: these SF ids are missing from the id map — emitting them "
              "Title-keyed (risk of duplicates): " + ", ".join(unmapped), file=sys.stderr)

    id_matched = bool(idmap)  # ID column present if we have any map

    ts = ""  # keep filename stable/overwritable by default
    if args.out:
        out = args.out
    else:
        ext = "xml" if args.format == "xml" else "csv"
        out = os.path.join(OUT_DIR, "simple-flow-UPDATE.{}".format(ext))

    if args.format == "csv":
        write_csv(out, rows, id_matched)
    else:
        write_xml(out, rows)

    print("Wrote {} ({} case(s), {}).".format(
        out, len(rows), "ID-matched" if id_matched else "Title-keyed"))
    # content sanity
    blob = open(out, encoding="utf-8", errors="ignore").read().lower()
    print("viu occurrences:", blob.count("viu"), "| 'feature flag' occurrences:", blob.count("feature flag"))


def write_csv(out, rows, id_matched):
    with open(REF, newline="") as f:
        ref_header = next(csv.reader(f))
    if id_matched:
        header = ["ID"] + ref_header
    else:
        header = ref_header
    with open(out, "w", newline="") as f:
        w = csv.writer(f, quoting=csv.QUOTE_MINIMAL, lineterminator="\r\n")
        w.writerow(header)
        for sf, tr, c in rows:
            base = [
                clean(c["title"].strip()),
                section_for(c),
                "Functional",
                c["priority"].strip(),
                joinlines(c.get("preconditions", [])),
                joinlines(c.get("steps", [])),
                joinlines(c.get("expected", [])),
                build_refs(c),
                "", "",
            ]
            if id_matched:
                w.writerow([tr or ""] + base)
            else:
                w.writerow(base)


def write_xml(out, rows):
    """Minimal TestRail suite XML (sections -> cases). Import via TestRail 'XML'."""
    def esc(s):
        return html.escape(s or "", quote=False)

    # group by section (area)
    from collections import OrderedDict
    sections = OrderedDict()
    for sf, tr, c in rows:
        sections.setdefault(section_for(c), []).append((sf, tr, c))

    L = ['<?xml version="1.0" encoding="UTF-8"?>', "<suite>", "  <name>Simple Flow V1 — UPDATE</name>",
         "  <sections>"]
    for area, items in sections.items():
        L.append("    <section>")
        L.append("      <name>{}</name>".format(esc(area)))
        L.append("      <cases>")
        for sf, tr, c in items:
            L.append("        <case>")
            if tr:
                L.append("          <id>{}</id>".format(esc(str(tr) if str(tr).upper().startswith("C") else "C" + str(tr))))
            L.append("          <title>{}</title>".format(esc(clean(c["title"].strip()))))
            L.append("          <type>Functional</type>")
            L.append("          <priority>{}</priority>".format(esc(c["priority"].strip())))
            L.append("          <references>{}</references>".format(esc(build_refs(c))))
            L.append("          <custom>")
            L.append("            <preconds>{}</preconds>".format(esc(joinlines(c.get("preconditions", [])))))
            L.append("            <steps>{}</steps>".format(esc(joinlines(c.get("steps", [])))))
            L.append("            <expected>{}</expected>".format(esc(joinlines(c.get("expected", [])))))
            L.append("          </custom>")
            L.append("        </case>")
        L.append("      </cases>")
        L.append("    </section>")
    L += ["  </sections>", "</suite>", ""]
    open(out, "w", encoding="utf-8").write("\n".join(L))


if __name__ == "__main__":
    main()
