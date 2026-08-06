"""Classify all 87 tickets into the five buckets and emit type-audit.json. READ-ONLY."""
import json, os, sys

sys.path.insert(0, os.path.dirname(__file__))
import population

ROOT = "/home/user/Manual-test-Cases/build/ticket-type-audit-2026-08-06"
live = json.load(open(f"{ROOT}/snapshots/live-state.json"))
det = json.load(open(f"{ROOT}/snapshots/bug-detail.json"))
probe = json.load(open(f"{ROOT}/snapshots/API-REFUSAL-PROBE.json"))
sweep = json.load(open(f"{ROOT}/snapshots/rollup-and-sweep.json"))
conv = json.load(open(f"{ROOT}/snapshots/project-convention.json"))
tm = json.load(open("/home/user/Manual-test-Cases/build/ticket-source-blocks-2026-08-06/tools/type-map.json"))

# --- bucket (B) target parents, each reasoned from BOTH routes the brief names:
#     the story the ticket already links `relates to`, AND the requirement its
#     source block cites. Confidence is stated, never implied.
TARGETS = {
    "SV-8818": {
        "story": "SV-8591", "confidence": "defensible",
        "why": "The fault is in the SHARED export code, not in one report -- the PDF "
               "download 500s on five of the six reports. SV-8591 is the shared "
               "'Export contract + 10k row-cap guard (CSV attachment + PDF scaffold)' "
               "story, so it is the one story that genuinely owns the defect. It is "
               "also the story the ticket already links.",
        "caveat": "Cross-cutting. No per-report story owns it, so the choice is a "
                  "judgement rather than a lookup.",
    },
    "SV-8820": {
        "story": "SV-8672", "confidence": "confident",
        "why": "Both routes agree exactly. The source block cites Inventory Value v4 "
               "S5-R2/R4/R7, and section 5 is the story 'Inv Value - Story 5 - As-Of "
               "Date and History' = SV-8672, which is also the story the ticket links.",
        "caveat": None,
    },
    "SV-8823": {
        "story": "SV-8677", "confidence": "confident",
        "why": "Both routes agree exactly. Source block cites Inventory Value v4 "
               "S10-R3/S10-R7; section 10 is 'Inv Value - Story 10 - Export to PDF and "
               "CSV' = SV-8677, which the ticket already links.",
        "caveat": None,
    },
    "SV-8845": {
        "story": "SV-8797", "confidence": "defensible",
        "why": "The failure only happens ON A PHONE, and SV-8797 is 'Mobile Filter Bar' "
               "-- the story the ticket links. Its sibling from the same batch, SV-8846, "
               "was converted onto SV-8797 by Ahtasham Amjad, so this matches his own "
               "precedent.",
        "caveat": "The mechanism is URL state, and the source block also cites S11-R2, "
                  "which is story 11 = SV-8796 'URL State & Shareable Links'. SV-8796 is "
                  "the defensible alternative if he reads it as a URL fault that merely "
                  "shows up on mobile.",
    },
    "SV-8848": {
        "story": "SV-8686", "confidence": "ask",
        "why": "The ticket links SV-8686 'Schedule Grid Layout & Navigation', which is "
               "where the time axis lives, and the defect shifts EVERY time shown by six "
               "hours.",
        "caveat": "ASK FIRST. Mudassir Qamar converted NINE of these ten Schedule tickets "
                  "(SV-8849 to SV-8857) and deliberately did NOT convert this one -- he "
                  "only STRIPPED its parent (SV-8685 -> None, 2026-08-05T09:21:39-0500). "
                  "Leaving one out of ten while converting the rest looks like a decision, "
                  "not an oversight; a six-hour offset on every time may be a platform "
                  "timezone fault rather than a Schedule story defect. Re-parenting it "
                  "would cut across his triage (Rule 53's corollary).",
    },
    "SV-8879": {
        "story": "SV-8603", "confidence": "ask",
        "why": "SV-8603 'SBC - Story 4 - Filter by location' is the story the ticket links.",
        "caveat": "ASK FIRST -- the parent cannot be determined confidently. The defect is "
                  "on ALL SIX reports, and every report has its OWN location-filter story "
                  "(SBC SV-8603, SBR SV-8638, Tech Util SV-8656, Inv Value SV-8674, and so "
                  "on). Parenting it to the Sales By Customer story alone would understate "
                  "it by five reports. Its source is also a product-owner answer that "
                  "OVERRIDES four specifications, so no single spec section points at one "
                  "story either. This is arguably the clearest case for LEAVING a "
                  "cross-cutting defect on the epic.",
    },
    "SV-8880": {
        "story": "SV-8631", "confidence": "confident",
        "why": "Both routes agree exactly. Source block cites Sales By Representative v17 "
               "S14-R15/S14-R20; section 14 is 'SBR - Story 14 - PDF and CSV exports' = "
               "SV-8631, which the ticket already links.",
        "caveat": None,
    },
    "SV-8881": {
        "story": "SV-8654", "confidence": "confident",
        "why": "Both routes agree exactly. Source block cites Technician Utilization v6 "
               "S7-R2/R3/R4; section 7 is 'Tech Util - Story 7 - Export to PDF and CSV' = "
               "SV-8654, which the ticket already links. This is the ticket the API "
               "refusal probe was run against, and it was proven byte-identical afterwards.",
        "caveat": None,
    },
}

# --- bucket (C) reasons ------------------------------------------------------------
C_REASONS = {
    "SV-8819": "CLOSED as Done -- the fix shipped. Converting a closed ticket changes "
               "nothing anybody will act on and would emit a change on settled work.",
    "SV-8821": "CLOSED OBSOLETE, and the QA lead ruled on it TODAY, verbatim: \"Marked it "
               "as AObsolete - ignore it for now.\" Its parent was also removed under the "
               "shared account today (2026-08-06T03:05:46-0500, SV-8582 -> None), so the "
               "parentless shape is a deliberate act, not drift.",
    "SV-8822": "CLOSED OBSOLETE -- WITHDRAWN under Standing Rule 51 as an API-only defect "
               "that no user or manual tester can reach. The finding is kept in the defect "
               "pack; the ticket was deliberately closed rather than deleted.",
    "SV-8843": "CLOSED OBSOLETE. It was reopened and then RE-CLOSED under the shared "
               "account on 2026-08-05T12:32:50-0500 -- a deliberate second decision.",
    "SV-8844": "CLOSED OBSOLETE (2026-08-05T02:40:48-0500). The underlying fault was "
               "confirmed fixed, so the closure is correct.",
    "SV-8847": "CLOSED OBSOLETE (2026-08-04T22:02:41-0500), though our own Filters records "
               "note the behaviour still reproduces. Whether to REOPEN it is a separate "
               "question from its type, and it is the QA lead's call -- not something to "
               "bundle into a type change.",
}

buckets = {"A": [], "B": [], "C": [], "D": [], "E": []}
rows = {}

for key in population.ALL:
    v = live[key]
    itype = v["issuetype"]
    closed = v["status_category"] == "Done"
    row = {
        "key": key,
        "url": f"https://shopview.atlassian.net/browse/{key}",
        "project": v["project"],
        "record": v["record"],
        "in_ticket_list_2026_08_06": v["in_ticket_list"],
        "summary": v["summary"],
        "issuetype": itype,
        "issuetype_id": v["issuetype_id"],
        "hierarchy_level": v["hierarchyLevel"],
        "parent": v["parent"],
        "parent_type": v["parent_type"],
        "parent_summary": v["parent_summary"],
        "priority": v["priority"],
        "status": v["status"],
        "status_category": v["status_category"],
        "resolution": v["resolution"],
        "product_area": v["product_area"],
        "creator": v["creator"],
        "relates_to_stories": [
            {"key": l["key"], "summary": l["summary"]}
            for l in v["links"] if l["itype"] == "Story"
        ],
        "other_links": [
            {"name": l["name"], "key": l["key"], "type": l["itype"]}
            for l in v["links"] if l["itype"] != "Story"
        ],
        "type_changed_by": [
            {"who": c["who"], "when": c["when"], "from": c["from"], "to": c["to"]}
            for c in v["type_changes"]
        ],
        "parent_changed_by": [
            {"who": c["who"], "when": c["when"], "from": c["from"], "to": c["to"]}
            for c in v["parent_changes"]
        ],
        "source_cited": tm.get(key, {}).get("doc"),
    }

    if itype == "Story Defect" and v["type_changes"]:
        row["bucket"] = "D"
        row["bucket_reason"] = (
            "Converted from Bug to Story Defect by "
            + ", ".join(f"{c['who']} at {c['when']}" for c in v["type_changes"])
            + ". NOT TOUCHED -- another person's deliberate triage (Standing Rule 38 / "
              "Rule 53's corollary)."
        )
    elif itype == "Story Defect":
        row["bucket"] = "A"
        row["bucket_reason"] = (
            f"Filed directly in the correct shape: Story Defect (level -1 subtask) under "
            f"story {v['parent']}, which is itself a child of its epic. Product Area is "
            f"null, as this type has no such field. Nothing to do."
        )
    else:  # Bug
        if closed:
            row["bucket"] = "C"
            row["bucket_reason"] = C_REASONS[key]
        else:
            row["bucket"] = "B"
            t = TARGETS[key]
            row["bucket_reason"] = (
                "Ours, still a Bug, open, and under the current convention should be a "
                "Story Defect parented to its owning story."
            )
            row["target_parent_story"] = t["story"]
            row["target_parent_story_summary"] = det["stories"].get(t["story"], {}).get("summary")
            row["target_confidence"] = t["confidence"]
            row["target_why"] = t["why"]
            row["target_caveat"] = t["caveat"]
            row["side_effects_of_converting"] = [
                f"issuetype Bug (10008) -> Story Defect (10007); hierarchy level 0 -> -1 "
                f"(it becomes a subtask).",
                f"parent {v['parent'] or 'NONE'} -> {t['story']}.",
                f"Product Area \"{v['product_area']}\" is SILENTLY EMPTIED and the loss is "
                f"NOT recorded in the changelog. The QA lead has accepted this: "
                f"\"Product area loss is OK\".",
                "It leaves the epic's DIRECT child list -- measured: `parent = <epic>` "
                "returns 11 of our Bugs and 0 of our 73 Story Defects.",
                "Priority, status, description, the source block and the `relates to` "
                "story link are all unaffected.",
            ]
    buckets[row["bucket"]].append(key)
    rows[key] = row

# --- bucket (E): candidates examined and excluded ----------------------------------
excluded = []
for e in sweep.get("recent_bugs_not_in_our_records", []):
    if e["creator"] == "Bilal Muzamil":
        excluded.append({
            **e,
            "url": f"https://shopview.atlassian.net/browse/{e['key']}",
            "verdict": "NOT OURS",
            "why": "Created under the SHARED account, so authorship cannot be settled from "
                   "Jira alone -- but four independent tells all point away from us: it is "
                   "named in NONE of our committed records; it carries no Rule-54 source "
                   "block (our retrofit pass covered all 65 of ours); its body uses the QA "
                   "lead's own Jira template (\"Found this issue while testing this:\", "
                   "\"Steps of reproduction\") rather than our seven-section format; and its "
                   "subject is vendor invoicing and purchase orders (Product Area Parts), "
                   "which is none of our three active projects. FLAGGED for his "
                   "confirmation rather than claimed either way.",
        })
buckets["E"] = [e["key"] for e in excluded]

out = {
    "generated": "2026-08-06",
    "question": "Which tickets that WE created are still an issuetype of Bug and should, "
                "under the convention now in force (Standing Rule 52, amended 2026-08-05), "
                "be a Story Defect parented to their owning story?",
    "ruling": "QA lead, 2026-08-06, verbatim: \"Leave the old tickets as it is, however if "
              "there is any old ticket that you have created as a bug that should be "
              "actually a story defect.\" Priorities on already-filed tickets were settled "
              "in the same breath and NOT ONE was touched.",
    "population": {
        "total": len(population.ALL),
        "from_TICKET_LIST_2026_08_06": len(population.IN_TICKET_LIST),
        "filed_after_that_list_was_written": len(population.ALL) - len(population.IN_TICKET_LIST),
        "how_derived": "From OUR OWN COMMITTED RECORDS, never a Jira author query -- the "
                       "account is shared with the QA lead, so `creator = us` also returns "
                       "his tickets (Rule 53's corollary). Every one was then read LIVE.",
        "all_read_live_http_200": all(live[k]["http"] == "200" for k in population.ALL),
        "creator_on_every_one": "Bilal Muzamil (the shared account)",
    },
    "buckets": {
        "A_already_correct": sorted(buckets["A"], key=lambda k: int(k.split("-")[1])),
        "B_ours_bug_should_convert": sorted(buckets["B"], key=lambda k: int(k.split("-")[1])),
        "C_ours_bug_left_alone": sorted(buckets["C"], key=lambda k: int(k.split("-")[1])),
        "D_converted_by_someone_else": sorted(buckets["D"], key=lambda k: int(k.split("-")[1])),
        "E_not_ours": buckets["E"],
    },
    "bucket_counts": {
        "A": len(buckets["A"]), "B": len(buckets["B"]), "C": len(buckets["C"]),
        "D": len(buckets["D"]), "E_examined_and_excluded": len(buckets["E"]),
    },
    "api_conversion_refusal": {
        "still_refuses": probe["api_still_refuses"],
        "probed": probe["target"], "target_story": probe["target_story"],
        "http": probe["http"], "response": probe["response"],
        "probe_was_harmless": probe["every_field_byte_identical"],
        "fields_compared": probe["fields_compared"],
        "conclusion": "Conversion remains UI-ONLY, via the \"Change work type\" wizard. "
                      "We cannot do it from here.",
    },
    "does_it_matter": {
        "measured_loss_epic_direct_children": {
            "our_bugs_appearing_as_direct_children_of_an_epic":
                len(sweep["our_bugs_in_any_epic_direct_children"]),
            "our_story_defects_appearing_as_direct_children_of_an_epic":
                len(sweep["our_sd_in_any_epic_direct_children"]),
            "note": "So converting REMOVES a ticket from the epic's own child list. This "
                    "contradicts the wording in Standing Rule 52 that a Story Defect "
                    "\"STILL ROLLS UP TO THE EPIC\" -- it rolls up only via a two-hop join "
                    "through the story, not in `parent = <epic>`.",
        },
        "parentEpic_operator": "Not a usable hierarchy traversal in this Jira -- "
                               "`parentEpic = SV-8582` returned only the epic itself, so it "
                               "is evidence for nothing either way.",
        "measured_gain_per_story_rollup": "`parent = SV-8654` returns 5 Story Defects today; "
                                          "SV-8881 is not among them. Converting makes each "
                                          "defect visible to whoever reviews its story.",
        "project_convention": {
            "story_defects_in_SV": conv["story_defect_total"],
            "parent_types": conv["parent_types"],
            "parented_to_an_epic": 0,
            "note": "Our 11 epic-parented Bugs are the outliers in project SV.",
        },
        "unverified": "Board behaviour was NOT checked. A level-0 Bug is normally its own "
                      "board card while a level -1 subtask is nested inside its parent, but "
                      "no board configuration was read live, so this is stated as ordinary "
                      "Jira behaviour rather than an observation of ours.",
    },
    "outside_in_sweep": {
        "jql": "project = SV AND issuetype = Bug AND created >= 2026-08-01",
        "bugs_found": sweep["all_recent_bugs"]["count"],
        "by_creator": sweep["recent_bugs_by_creator"],
        "not_in_our_records": len(sweep["recent_bugs_not_in_our_records"]),
        "created_under_our_shared_account_but_not_in_our_records": excluded,
        "reconciliation": "15 Bugs created under the shared account since 1 August = our 14 "
                          "still-Bug tickets + SV-8910. The 12 we filed as Bugs that others "
                          "converted no longer answer an `issuetype = Bug` query. The set is "
                          "fully accounted for.",
    },
    "tickets": rows,
}
json.dump(out, open(f"{ROOT}/type-audit.json", "w"), indent=1, sort_keys=True)

print("bucket counts:", out["bucket_counts"], " total",
      sum(len(v) for k, v in buckets.items() if k != "E"))
print("B:", out["buckets"]["B_ours_bug_should_convert"])
print("C:", out["buckets"]["C_ours_bug_left_alone"])
print("D:", out["buckets"]["D_converted_by_someone_else"])
print("E examined+excluded:", out["buckets"]["E_not_ours"])
print("all read live 200:", out["population"]["all_read_live_http_200"])
