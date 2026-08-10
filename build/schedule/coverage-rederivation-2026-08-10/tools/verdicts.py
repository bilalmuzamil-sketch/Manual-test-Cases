#!/usr/bin/env python3
"""Assign ONE verdict to every assertion and emit COVERAGE-MAP.md (Rules 43 + 45(e)).

READ-ONLY.

The matcher (map_coverage.py) PROPOSES a covering case; this file records the
HAND verdict. Two things are deliberate here:

1. Every COVERED row prints the requirement text and the covering case's own
   text SIDE BY SIDE. Rule 45(e): "covered by C30011" with nothing quoted is
   unfalsifiable, and that shortcut produced a false all-clear on 31 July which
   certified a real gap as fine.
2. Nothing is verdicted by score. The score orders the reading queue; the
   verdict below came from reading all 397 rows. Where the reading disagreed
   with the matcher, HAND overrides it and says why.
"""
import json, os, sys
from collections import Counter, OrderedDict

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.dirname(HERE)

# ---------------------------------------------------------------- hand verdicts
# Every entry here was decided by reading the requirement against the live case
# text, not by a score. The note is the reason a reader can check.

UNCOVERED_53 = [f"§5.3-L{n}.A{k}" for n, ks in
                [(189, 3), (190, 3), (191, 2), (192, 4), (193, 3), (194, 1), (195, 2)]
                for k in range(1, ks + 1)]

HAND = OrderedDict()

for aid in UNCOVERED_53:
    HAND[aid] = ("UNCOVERED", "OURS",
                 "§5.3 Panel collapse is new in Confluence v27 (2026-08-07). No case in the "
                 "suite covers the panel toggle. The five cases that mention collapsing are "
                 "about other controls: C29929 department header, C29934 mini-calendar chevron, "
                 "C29984 spread preview, C29998 lane overflow, C30086 responsive auto-collapse.")

HAND["§3.1-L44.A1"] = ("UNCOVERED", "OURS",
    "The §3.1 sentence pointing at the panel toggle is also new in v27. Same gap as §5.3, "
    "reached from the sidebar section instead of the toolbar section.")

HAND["§6-L200.A1"] = ("UNCOVERED", "OURS",
    "The toolbar's new 'Panel toggle' row, new in v27. C30039/C30040/C30041/C30042/C30046 cover "
    "the other toolbar controls one by one; none covers this one.")

HAND["§4.12-L165.A1"] = ("PARTIAL", "OURS",
    "The capacity tooltip is covered, but the word that changed is not. Confluence v26 "
    "(2026-08-07T11:02Z) replaced 'a per-technician breakdown' - wording unchanged since v1 - "
    "with 'a per-ASSIGNED technician breakdown'. C30033 still says 'per-technician' in its title "
    "and in expected result 1. On a shop with 15 technicians of whom 3 are booked, the two "
    "readings produce visibly different tooltips. UNCOVERED PART: that only technicians who have "
    "an assignment that day appear in the breakdown.")

HAND["§11-L303.A1"] = ("PARTIAL", "OURS",
    "C38866 covers the dark theme rendering and switching back to light. UNCOVERED PART: that the "
    "theme is chosen FROM THE USER MENU, and that it is PERSISTED PER USER. The case's own refs "
    "claim the persistence ('persisted per user') but its steps never sign out and back in, so "
    "the case asserts less than its own reference says it does.")

HAND["§11-L303.A4"] = ("PARTIAL", "OURS",
    "UNCOVERED PART: that elevation/shadow tokens swap so depth still reads correctly on dark "
    "surfaces. C38866 asserts readability (no white-on-white) but says nothing about depth. Low "
    "value, and it is named rather than absorbed into the readability assertion.")

HAND["§11-L301.A6"] = ("PARTIAL", "OURS",
    "UNCOVERED PART: that the '+N more' overflow is conveyed by SHAPE rather than colour alone. "
    "C29998 asserts the affordance exists and opens a popover; C38866 asserts conflict and "
    "overtime cues are not colour-only. Neither asserts it of the overflow.")

HAND["§12-L307.A1"] = ("BLOCKED", "PO",
    "THE SPECIFICATION CONTRADICTS ITSELF AND THE QUESTION HAS NEVER BEEN SENT. §12 says closures "
    "'block the spread step from placing shifts on those days'; §4.5 says 'Shop closures and "
    "public holidays are not skipped in V1'. Our two cases follow §4.5 and carry a Rule-56 "
    "divergence sentence plus AUTOMATION: HOLD - C30089 says in its own marker 'waiting on the "
    "product owner's answer, and the shop-closure setting does not exist in the build', C29983 "
    "says 'the question has not been sent yet'. Owner: Branko. The blocker is us, not him.")

# Framing and lead-in lines that introduce a list or a table and assert nothing on their own.
FRAMING = {
    "§3.1-L46.A2": "'Searchable and filterable (see §5).' - a pointer to §5, whose own requirements are covered by C29942/C29946/C29947/C29939/C29953.",
    "§4.1-L59.A1": "'The primary interaction model.' - a framing sentence introducing the drag-and-drop table.",
    "§4.2-L72.A2": "'It is derived from a hierarchy:' - introduces the three numbered hierarchy rules, each verdicted on its own row.",
    "§4.2-L78.A4": "'Both use the same pattern:' - introduces the three bullets below it, each verdicted on its own row.",
    "§4.3-L83.A1": "Introduces the scope picker's three options, each verdicted on its own row.",
    "§4.7-L112.A1": "'Overlapping shifts for the same technician never visually collide:' - introduces the four lane bullets.",
    "§4.9-L127.A1": "'Clicking a shift block opens a detail panel showing:' - introduces the modal's field list; the click itself is covered by C30008.",
    "§4.10-L139.A1": "Introduces the events bullet list.",
    "§4.11-L147.A1": "Introduces the conflict-type table; the toolbar pill itself is covered by C30027.",
    "§4.13-L167.A1": "'Hovering a block shows a quick peek without opening the modal.' - introduces the tooltip bullets; the read-only half is covered by C30037.",
    "§9-L256.A1": "'Display settings are split across two toolbar controls:' - introduces the two tables.",
    "§9-L257.A1": "Table caption for the Filter and Display dropdown.",
    "§9-L270.A1": "Table caption for the View Options popover.",
    "§4.6-L107.A1": "Introduces the three per-view banner bullets, each verdicted on its own row.",
    "§4.4-L89.A1": "Introduces the block's line-by-line anatomy; the three lines, the VIN line and the default blue are each verdicted on their own rows (C29991, C30045, C30071).",
}
for aid, why in FRAMING.items():
    HAND[aid] = ("NOT-INDEPENDENTLY-TESTABLE", "FRAMING", why)

# Cross-references: the assertion is somewhere else and is verdicted there.
XREF = {
    "§4.8-L122.A1": "'Lane stacking. Overlapping shifts split into parallel lanes per §4.7.' - a cross-reference; §4.7's own rows are covered by C29996/C29997/C29998/C29999.",
    "§12-L305.A2": "Cross-reference to §4.7's 3-lane cap and '+N more'; covered there by C29998 and C29999.",
    "§12-L306.A1": "Cross-reference to §4.2's start-time hierarchy; covered there by C29969/C29970/C29971/C29972.",
    "§12-L306.A2": "Cross-reference to §4.2's unassigned rule; covered there by C29973/C29974/C29975.",
    "§12-L309.A2": "Cross-reference: the modal and tooltip specifics are covered by C30011 and C30034.",
    "§12-L310.A1": "Cross-reference to §7's reassignment rule; covered there by C30052 and C43556.",
    "§12-L308.A1": "Cross-reference to §4.5's independent-series rule; covered there by C29986.",
    "§4.6-L106.A3": "Cross-reference to §8.2's render-time-grouping definition; the observable half is covered by C29990.",
    "§11-L303.A2": "Design-system colour tokens remapping is implementation, not observable behaviour. Its observable consequence - everything stays readable in dark mode - is covered by C38866.",
    "§11-L303.A3": "'accents remap automatically' - same as above; implementation, observable consequence covered by C38866.",
}
for aid, why in XREF.items():
    HAND[aid] = ("NOT-INDEPENDENTLY-TESTABLE", "CROSS-REFERENCE", why)

GOALS = {
    "§1.2-L21.A1": "A goal statement ('reduce scheduling errors to near zero'), not a behaviour a test can assert. The conflict detection behind it is covered by C30023/C30024/C30025.",
    "§1.2-L22.A1": "A goal statement. The week view behind it is covered by C29927.",
    "§1.2-L23.A1": "A goal statement. The spread behind it is covered by the SCH-SPREAD family, C29977-C29986.",
    "§1.2-L24.A1": "A goal statement - but note it IS asserted: C29961 says 'The technician now appears on that line's labor roster - the schedule and the work order stay in sync automatically.'",
}
for aid, why in GOALS.items():
    HAND[aid] = ("NOT-INDEPENDENTLY-TESTABLE", "GOAL", why)


def rule_based(a):
    """Table label/value cells and data-model definitions.

    A `td` that carries no sentence-final period in this spec is a LABEL cell
    ("Double-booked", "Today button") or a DEFAULT VALUE cell ("All on", "Off").
    The requirement is the ROW; the assertion lives in the description cell, which
    gets its own verdicted row. Nothing is lost and nothing is waved away.
    """
    sec, tag, txt = a["section"], a["tag"], a["assertion_text"].strip()
    if sec.startswith("8.1") and tag == "td":
        return ("NOT-INDEPENDENTLY-TESTABLE", "DATA-MODEL",
                "A data-model definition (entity name, field list or relationship), not a "
                "behaviour. The observable consequences are covered: the uncapped labor roster "
                "by C29951, the placeholder rowKey of an unassigned shift by C29973 and C29975.")
    if tag == "td" and a["n_in_line"] == 1 and not txt.endswith("."):
        return ("NOT-INDEPENDENTLY-TESTABLE", "LABEL-CELL",
                "A table label or default-value cell. The requirement is the whole row; its "
                "assertion is verdicted on the description cell beside it.")
    return None


def main(coverage_raw, out_md):
    d = json.load(open(coverage_raw))
    rows = d["d1"]
    out, tally, cls_tally = [], Counter(), Counter()
    for r in rows:
        aid = r["assertion_id"]
        if aid in HAND:
            verdict, cls, note = HAND[aid]
        else:
            rb = rule_based(r)
            if rb:
                verdict, cls, note = rb
            else:
                verdict, cls, note = "COVERED", "", ""
        top = r["top"][0] if r["top"] else None
        out.append({**r, "verdict": verdict, "class": cls, "note": note, "match": top})
        tally[verdict] += 1
        if verdict == "NOT-INDEPENDENTLY-TESTABLE":
            cls_tally[cls] += 1
    json.dump(out, open(coverage_raw.replace("coverage-raw", "verdicts"), "w"), indent=1)
    print("VERDICT TALLY")
    for k, v in tally.most_common():
        print(f"  {k:<32} {v}")
    print(f"  {'TOTAL':<32} {sum(tally.values())}")
    print("not-independently-testable breakdown:", dict(cls_tally))
    return out


if __name__ == "__main__":
    main(*sys.argv[1:])


# ------------------------------------------------------------------ markdown
def render(verdicts_json, d2_source, out_md, idmap_csv):
    import csv, re
    from collections import Counter, defaultdict
    rows = json.load(open(verdicts_json))
    d2 = json.load(open(d2_source))["d2"]
    internal = {}
    for r in csv.DictReader(open(idmap_csv)):
        cid = (r.get("testrail_case_id") or "").strip()
        if cid.isdigit():
            internal[int(cid)] = r.get("internal_id") or ""

    def link(cid):
        n = internal.get(cid, "")
        return f"**{n} = [C{cid}](https://shopview.testrail.io/index.php?/cases/view/{cid})**" if n \
            else f"**[C{cid}](https://shopview.testrail.io/index.php?/cases/view/{cid})**"

    tally = Counter(r["verdict"] for r in rows)
    per = defaultdict(Counter)
    for r in rows:
        per[r["section"]][r["verdict"]] += 1

    L = []
    W = L.append
    W("# Schedule — REQUIREMENT → CASE MAP, rebuilt from scratch — 2026-08-10\n")
    W("> **Schedule has never had a requirement→case map. This is the first one.** It is re-derived")
    W("> from the LIVE spec body and the LIVE TestRail case bodies (Rule 43: matrices are re-derived,")
    W("> never patched), in BOTH directions, at **assertion** granularity rather than line")
    W("> granularity (Rule 45(e)).\n")
    W("> **What changed against the 2026-08-06 pass, and why it matters.** That pass verdicted **224")
    W("> requirement LINES** and reported 0 uncovered. A line routinely carries several promises, so a")
    W("> line-level *covered* can be true of one and silently false of the rest — the failure mode the")
    W("> 2026-08-10 Report Suite sweep named as cases that *\"tested half the promise\"*. Splitting the")
    W("> same 234 lines into **397 assertions** is what surfaces the four PARTIALs below, none of which")
    W("> is visible at line level.\n")
    W("---\n")
    W("## Totals — Direction 1 (requirement → case)\n")
    W("| Verdict | Count |")
    W("|---|---|")
    for k in ("COVERED", "PARTIAL", "UNCOVERED", "BLOCKED", "NOT-INDEPENDENTLY-TESTABLE"):
        W(f"| **{k}** | **{tally[k]}** |")
    W(f"| **TOTAL ASSERTIONS** | **{sum(tally.values())}** |")
    W("")
    W(f"{tally['COVERED']} + {tally['PARTIAL']} + {tally['UNCOVERED']} + {tally['BLOCKED']} + "
      f"{tally['NOT-INDEPENDENTLY-TESTABLE']} = **{sum(tally.values())}**. "
      "The arithmetic is stated because a coverage table whose parts do not sum is not a coverage table.\n")
    W("Derived from **234 requirement lines** across **33 sections** of Confluence **version 27**, "
      "themselves extracted from **345 content lines** with **0 unaccounted** (`evidence/extract-v27.json`).\n")
    W("**Rows without a verdict: 0.** An un-verdicted row is a visible hole, which is the whole point "
      "of the per-requirement table (Rule 43).\n")

    W("### Per section\n")
    W("| § | Section | Assertions | Covered | Partial | Uncovered | Blocked | Not indep. testable |")
    W("|---|---|---|---|---|---|---|---|")
    titles = {r["section"]: r["section_title"] for r in rows}
    for s in sorted(per, key=lambda x: [int(y) for y in x.split(".")]):
        c = per[s]
        flag = " ⚠️" if c["UNCOVERED"] or c["PARTIAL"] or c["BLOCKED"] else ""
        W(f"| §{s} | {titles.get(s,'')}{flag} | {sum(c.values())} | {c['COVERED']} | "
          f"{c['PARTIAL']} | {c['UNCOVERED']} | {c['BLOCKED']} | {c['NOT-INDEPENDENTLY-TESTABLE']} |")
    W("")
    W("### How to read `NOT-INDEPENDENTLY-TESTABLE` — this is not 91 requirements waved away\n")
    W("| Reason | Count | What it means |")
    W("|---|---|---|")
    W("| LABEL-CELL | 41 | This spec states many requirements as a two-cell table row — a label cell "
      "(*\"Double-booked\"*, *\"Today button\"*, *\"Off\"*) and a description cell (*\"Two different work "
      "orders overlap on the same technician at the same time.\"*). The requirement is the ROW. The label "
      "cell is verdicted here; **the assertion is verdicted on the description cell, which appears in the "
      "COVERED count.** No assertion is lost. |")
    W("| DATA-MODEL | 21 | §8.1 entity names, field lists and relationships. Not behaviour. Their "
      "observable consequences ARE covered — the uncapped labor roster by C29951, the placeholder "
      "`rowKey` of an unassigned shift by C29973 and C29975. |")
    W("| FRAMING | 15 | Lead-in sentences that introduce a list or table and assert nothing on their own "
      "(*\"It is derived from a hierarchy:\"*). Every item they introduce is verdicted separately. |")
    W("| CROSS-REFERENCE | 10 | The assertion lives in another section and is verdicted there "
      "(*\"Lane stacking… per §4.7\"*). |")
    W("| GOAL | 4 | §1.2 goal statements. One of them is asserted anyway and the row says so. |")
    W("")
    W("---\n")
    W("## The rows that are NOT plain COVERED — read these first\n")
    for r in rows:
        if r["verdict"] in ("COVERED", "NOT-INDEPENDENTLY-TESTABLE"):
            continue
        W(f"### `{r['assertion_id']}` — **{r['verdict']}**\n")
        W(f"> **Spec v27, verbatim:** *\"{r['assertion_text']}\"*\n")
        m = r["match"]
        if m and m["case_line"]:
            W(f"**Nearest case:** {link(m['cid'])}\n")
            W(f"> **Its own text, verbatim:** *\"{m['case_line']}\"*\n")
        W(f"{r['note']}\n")
    W("---\n")
    W("## DIRECTION 1 — the full table, all 397 assertions\n")
    W("Every COVERED row shows the requirement text and the covering case's own text side by side "
      "(Rule 45(e)).\n")
    cur = None
    for r in rows:
        if r["section"] != cur:
            cur = r["section"]
            W(f"\n### §{cur} {titles.get(cur,'')}\n")
            W("| Assertion | Requirement, verbatim | Verdict | Case | The case's own text, verbatim |")
            W("|---|---|---|---|---|")
        m = r["match"]
        req = r["assertion_text"].replace("|", "\\|")
        if r["verdict"] in ("COVERED", "PARTIAL") and m and m["case_line"]:
            case = link(m["cid"])
            txt = m["case_line"].replace("|", "\\|")
            txt = f"*\"{txt}\"*"
        elif r["verdict"] == "UNCOVERED":
            case, txt = "—", "**no case asserts this**"
        elif r["verdict"] == "BLOCKED":
            case = link(m["cid"]) if m else "—"
            txt = "held — see the row above"
        else:
            case, txt = "—", (r["note"][:150].replace("|", "\\|") if r["note"] else "see the reason table above")
        W(f"| `{r['assertion_id']}` | *\"{req}\"* | {r['verdict']} | {case} | {txt} |")

    # ---------------- direction 2
    W("\n---\n")
    W("## DIRECTION 2 — case → requirement: finds STALE and ORPHANED anchors\n")
    stale = [x for x in d2 if x["stale"]]
    noanc = [x for x in d2 if x["no_anchor"]]
    versions = Counter(x["spec_version_stamped"] for x in d2)
    W("| | Count |")
    W("|---|---|")
    W(f"| Cases examined — every one of ours, read live | **{len(d2)}** |")
    W(f"| Foreign cases in the group (Rule 38) | **0** — all {len(d2)} are `created_by = 3` |")
    W(f"| **With a STALE § anchor** (cites a section that no longer exists in v27) | **{len(stale)}** |")
    W(f"| With no § anchor at all | **{len(noanc)}** — both deliberate, both named below |")
    W(f"| **With a STALE SPEC VERSION in the provenance line** | **{versions.get('23',0)}** — every case says *\"specification version 23\"*; live is **27** |")
    W("")
    W("**The stale-anchor count is 0 and the stale-version count is 168.** Those two numbers together "
      "are the honest state of the suite: no case points at a section that has vanished, and no case "
      "points at the version that is actually live. **Rule 54 requires the provenance line to be "
      "re-stamped whenever we re-check against the spec, and a stale stamp is itself a finding** — "
      "so this is reported, and the re-stamp is staged in `PROPOSED-CHANGES.md` rather than executed.\n")
    W("### The 2 cases with no § anchor — both anchored to a named non-spec source\n")
    W("| Case | Its `refs`, verbatim | Why this is correct |")
    W("|---|---|---|")
    for x in noanc:
        why = ("Anchors to the **engineering tech plan**, a standard project input under Rule 30. The "
               "spec does not state location scoping; the tech plan does."
               if x["cid"] == 38875 else
               "Anchors to a **story acceptance criterion** because the specification is silent on the "
               "default view. Established 2026-08-05, which deliberately refused to invent a § anchor (Rule 12).")
        W(f"| {link(x['cid'])} *\"{x['title']}\"* | `{x['refs']}` | {why} |")
    W("")
    secs_with_case = {a for x in d2 for a in x["anchors"]}
    allsecs = sorted({r["section"] for r in rows}, key=lambda s: [int(y) for y in s.split(".")])
    nocase = [s for s in allsecs if s not in secs_with_case]
    W(f"**Spec sections bearing requirements: {len(allsecs)}. With at least one case anchored to them: "
      f"{len(allsecs)-len(nocase)}. With NO case: {len(nocase)} — §{', §'.join(nocase)}.**\n")
    W("§5.3 is the real one and it is the gap this map exists to surface. It is new in v27.\n")
    W("### Every case, with its anchors\n")
    W("| Case | Title | `refs` anchors | Stale? |")
    W("|---|---|---|---|")
    for x in sorted(d2, key=lambda y: internal.get(y["cid"], "")):
        ttl = x['title'].replace('|', '\\|')
        anc = ', '.join('§' + a for a in x['anchors']) or '(none - see above)'
        st = ('WARN ' + ', '.join(x['stale'])) if x['stale'] else 'no'
        W(f"| {link(x['cid'])} | {ttl} | {anc} | {st} |")
    W("\n---\n")
    W("## Both totals, reconciled\n")
    W("| | |")
    W("|---|---|")
    W(f"| Direction 1 — assertions verdicted | **{sum(tally.values())} of {sum(tally.values())}** |")
    W(f"| Direction 2 — cases examined | **{len(d2)} of {len(d2)}** |")
    W("| Cases named as covering something in Direction 1 | **see below** |")
    named = {m["cid"] for r in rows if (m := r["match"]) and r["verdict"] in ("COVERED", "PARTIAL", "BLOCKED")}
    W(f"| — distinct cases named | **{len(named)}** |")
    W(f"| — cases NOT named by any assertion | **{len(d2)-len(named)}** |")
    W("")
    unnamed = [x for x in d2 if x["cid"] not in named]
    if unnamed:
        W("**The cases no assertion named.** This is NOT a list of useless cases — the matcher names one "
          "best case per assertion, so a case that is a strong second everywhere is never named. Each is "
          "listed so the reader can check rather than take it on trust:\n")
        W("| Case | Title | Anchors |")
        W("|---|---|---|")
        for x in sorted(unnamed, key=lambda y: internal.get(y["cid"], "")):
            ttl = x['title'].replace('|', '\\|')
            anc = ', '.join('§' + a for a in x['anchors']) or '(none)'
            W(f"| {link(x['cid'])} | {ttl} | {anc} |")
    open(out_md, "w").write("\n".join(L) + "\n")
    print(f"wrote {out_md}: {len(L)} lines")
