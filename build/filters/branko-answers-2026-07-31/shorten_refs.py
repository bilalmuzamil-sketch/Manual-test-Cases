#!/usr/bin/env python3
"""TestRail's `refs` (References) field has a MAX LENGTH of 250 characters —
exceeding it returns HTTP 400 {"error":"Field :refs does not match the required
pattern."} (discovered live 2026-07-31 on FLT-PARTS-13 at 298 chars, after the
4 Parts cases at 240 chars pushed fine).

6 of this pass's 10 refs strings were over the limit. They are shortened here to
<=240 chars, keeping BOTH Rule-20 halves (ticket + spec anchor) plus the Branko
attribution. Every detail dropped from `refs` is preserved in `notes` so nothing
is lost. Still COMMA-FREE.
"""
import json, glob, os
CASES = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "cases")

NEW = {
 "FLT-PARTS-13": 'Filters (Epic key TBD) (spec v1.6 §2 Parts Filters + Reports Filters); Branko answers 2026-07-31 Q3 ("support all the filters we have right now in the app as well as all choices per filter"); tech plan 2026-07-29 rollout rule',
 "FLT-RPTS-01": 'Filters (Epic key TBD) (spec v1.6 §2 Reports Filters; §4 Key Decisions "New date-range filter type" + "Multi-select where it makes sense"); Branko answers 2026-07-31 Q2/Q3/Q5/Q7; Figma 11903-10573',
 "FLT-RPTS-21": 'Filters (Epic key TBD) (spec v1.6 §2 Reports Filters; §4 Key Decisions "New date-range filter type" + "Multi-select where it makes sense"); Branko answers 2026-07-31 Q2/Q3/Q5/Q7; Figma 11903-10573',
 "FLT-RPTS-22": 'Filters (Epic key TBD) (spec v1.6 §2 Reports Filters; §4 "Multi-select where it makes sense"); Branko answers 2026-07-31 Q3/Q5 + Q4 (pointer only - the 6 new types are not enumerated in v1.6; see DELTAS.md F1); Figma 11903-10573',
 "FLT-RPTS-23": 'Filters (Epic key TBD) (spec v1.6 §4 "New date-range filter type"; §2 Reports Filters - start/end picker; no presets; no default; applies on the second date); Branko answers 2026-07-31 Q5; tech plan 2026-07-29 D19',
 "FLT-PERS-05": 'Filters (Epic key TBD) (spec v1.6 S10-R4; §4 "Parts and Reports selections are scoped to their view/tab and persist there"); Branko answers 2026-07-31 Q5 exception 1; tech plan 2026-07-29 D20',
}
# what was trimmed out of refs is kept in notes instead - nothing lost
NOTE_TAIL = {
 "FLT-RPTS-01": ' REFS TRIMMED 2026-07-31 to fit TestRail\'s 250-char References limit: the §4 Key Decisions bullet "Context-specific filter sets on Parts and Reports" also applies to this case and is cited here instead of in refs.',
 "FLT-RPTS-21": ' REFS TRIMMED 2026-07-31 to fit TestRail\'s 250-char References limit: the §4 Key Decisions bullet "Context-specific filter sets on Parts and Reports" also applies to this case and is cited here instead of in refs.',
 "FLT-RPTS-22": ' REFS TRIMMED 2026-07-31 to fit TestRail\'s 250-char References limit: the §4 bullets "Context-specific filter sets on Parts and Reports" and "New date-range filter type" also apply and are cited here instead of in refs.',
 "FLT-RPTS-23": ' REFS TRIMMED 2026-07-31 to fit TestRail\'s 250-char References limit: the URL form range=custom&from=YYYY-MM-DD&to=YYYY-MM-DD (spec v1.6 §2 Reports Filters) is cited in these notes instead of in refs.',
 "FLT-PARTS-13": ' REFS TRIMMED 2026-07-31 to fit TestRail\'s 250-char References limit: the tech-plan rollout rule is quoted in full above ("NO change to what is filterable").',
}
n = 0
for f in sorted(glob.glob(os.path.join(CASES, "cases-*.json"))):
    cs = json.load(open(f)); ch = False
    for c in cs:
        if c["id"] in NEW:
            assert len(NEW[c["id"]]) <= 240, (c["id"], len(NEW[c["id"]]))
            assert "," not in NEW[c["id"]], c["id"]
            c["spec_ref"] = NEW[c["id"]]
            if c["id"] in NOTE_TAIL:
                c["notes"] = (c.get("notes") or "") + NOTE_TAIL[c["id"]]
            ch = True; n += 1
            print(f'{len(NEW[c["id"]]):>4}  {c["id"]}')
    if ch:
        json.dump(cs, open(f, "w"), indent=1, ensure_ascii=False); open(f, "a").write("\n")
print("shortened", n)
