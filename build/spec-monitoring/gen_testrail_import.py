#!/usr/bin/env python3
"""Generate TestRail import files (XML + ID-augmented CSV) for both projects.

Reuses each project's existing gen_import.py verbatim (same cleaning rules:
VIU-word-free, feature-flag-free, API-section routing) by importing it as a
module, so this stays in lock-step with the canonical CSV/XLSX generators and
cannot drift. Then it joins each case to the TestRail id-map (internal id ->
C#####) and emits:

  testrail-import/<project>-v1-testrail-import.xml         (TestRail suite XML)
  testrail-import/<project>-v1-testrail-import-withIDs.csv (adds Case ID + link)

Standing rule #8: every case-listing deliverable carries the TestRail Case ID
(C#####) and a clickable link.

Run: python3 build/spec-monitoring/gen_testrail_import.py
"""
import csv, os, importlib.util
from html import escape

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, "testrail-import")
TR_LINK = "https://shopview.testrail.io/index.php?/cases/view/{}"

PROJECTS = [
    {
        "key": "fees-discounts",
        "suite": "Fees & Discounts V1",
        "gen": os.path.join(ROOT, "build", "fees-discounts", "gen_import.py"),
        "idmap": os.path.join(ROOT, "build", "fees-discounts", "testrail-id-map.csv"),
        "idcol": "fd_id",
    },
    {
        "key": "simple-flow",
        "suite": "Simple Flow V1",
        "gen": os.path.join(ROOT, "build", "simple-flow", "gen_import.py"),
        "idmap": os.path.join(ROOT, "build", "simple-flow", "testrail-id-map.csv"),
        "idcol": "sf_id",
    },
]


def load_gen(path, modname):
    spec = importlib.util.spec_from_file_location(modname, path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)  # regenerates canonical CSV/XLSX as a side effect
    return mod


def load_idmap(path, idcol):
    m = {}
    with open(path, newline="") as f:
        for r in csv.DictReader(f):
            m[r[idcol].strip()] = r["ID"].strip()
    return m


def xml_escape(s):
    return escape(s or "", quote=False)


for p in PROJECTS:
    mod = load_gen(p["gen"], "genmod_" + p["key"].replace("-", "_"))
    rows = mod.rows           # [title, section, type, priority, pre, steps, exp, refs, "", ""]
    cases = mod.cases         # aligned 1:1 with rows; cases[i]["id"] is the internal id
    header = mod.REF_HEADER
    idmap = load_idmap(p["idmap"], p["idcol"])

    mapped = sum(1 for c in cases if c["id"].strip() in idmap)

    # ---- ID-augmented CSV (Case ID + TestRail Link prepended) ----
    out_csv = os.path.join(OUT, p["key"] + "-v1-testrail-import-withIDs.csv")
    with open(out_csv, "w", newline="") as f:
        w = csv.writer(f, quoting=csv.QUOTE_MINIMAL, lineterminator="\r\n")
        w.writerow(["Case ID", "TestRail Link"] + header)
        for row, c in zip(rows, cases):
            num = idmap.get(c["id"].strip(), "")
            cid = ("C" + num) if num else ""
            link = TR_LINK.format(num) if num else ""
            w.writerow([cid, link] + row)

    # ---- TestRail suite XML (grouped by section, in first-appearance order) ----
    sections, order = {}, []
    for row, c in zip(rows, cases):
        sec = row[1]
        if sec not in sections:
            sections[sec] = []
            order.append(sec)
        sections[sec].append((row, c))

    out_xml = os.path.join(OUT, p["key"] + "-v1-testrail-import.xml")
    with open(out_xml, "w", encoding="utf-8") as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n<suite>\n')
        f.write("  <name>%s</name>\n  <sections>\n" % xml_escape(p["suite"]))
        for sec in order:
            f.write("    <section>\n      <name>%s</name>\n      <cases>\n" % xml_escape(sec))
            for row, c in sections[sec]:
                title, _, ctype, prio, pre, steps, exp, refs = row[:8]
                num = idmap.get(c["id"].strip(), "")
                f.write("        <case>\n")
                if num:
                    f.write("          <id>C%s</id>\n" % num)
                f.write("          <title>%s</title>\n" % xml_escape(title))
                f.write("          <type>%s</type>\n" % xml_escape(ctype))
                f.write("          <priority>%s</priority>\n" % xml_escape(prio))
                f.write("          <references>%s</references>\n" % xml_escape(refs))
                f.write("          <custom>\n")
                f.write("            <preconds>%s</preconds>\n" % xml_escape(pre))
                f.write("            <steps>%s</steps>\n" % xml_escape(steps))
                f.write("            <expected>%s</expected>\n" % xml_escape(exp))
                f.write("          </custom>\n        </case>\n")
            f.write("      </cases>\n    </section>\n")
        f.write("  </sections>\n</suite>\n")

    print("[%s] cases=%d mapped-to-TestRail-ID=%d sections=%d" %
          (p["key"], len(rows), mapped, len(order)))
    print("        XML: %s" % out_xml)
    print("        CSV: %s" % out_csv)
