#!/usr/bin/env python3
"""Round 4 (13 Nov 2026): DESIGN-DIVERGENCE-REGISTER.json for PRD v1.3 and design 1794510020-d4ec. Rebuilt from the before-copy
po-answers-2026-11-12/write/DESIGN-DIVERGENCE-REGISTER-before-v1.3.json each run (idempotent). The coordinator's verdicts (skill 07 §6.0)
for the five differences of DESIGN-CHANGE-v1.3-2026-11-12.md §6; IWO-D62 found by the case worker (check_v13_text / board scan).
   python3 update_register_v13.py"""
import json, os
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D)
R = json.load(open(f"{P}/po-answers-2026-11-12/write/DESIGN-DIVERGENCE-REGISTER-before-v1.3.json"))
ids = {d["id"]: d for d in R["differences"]}; ns = {n["id"]: n for n in R["not_shown"]}
V = "PRD v1.3 (12 Nov 2026) and design 1794510020-d4ec"


def close(i, why, held=""):
    d = ids[i]; d["outcome_before_v1.3"] = d["outcome"]; d["outcome"] = "CLOSED-MATCHES-PRD"; d["ruling_or_question"] = why
    d["held_case"] = held; d["note"] = (d.get("note") or "") + f" Closed 13 Nov 2026 ({V})."


close("IWO-D02", "The redrawn boards (Flow 0 02, Happy 03, Review 1.3) give S1-R3 v1.3 word for word: one hint line, no second line. Case D-03.")
close("IWO-D20", "The redrawn Finance tab boards (Flow 1 07, Happy 17, Review 5.2) carry S3-R2 v1.3's sentence \"Closing posts the parts cost and shop supplies to your books and marks the work order Closed · Internal. You can reopen it later.\" Case D-38.")
close("IWO-D21", "Flow 1 7c now draws \"Posting date\" and the sentence of S3-E4 v1.3 (\"Closing marks the work order Closed · …\"). Case D-40.")
d = ids["IWO-D22"]; d["outcome_before_v1.3"] = d["outcome"]
d["design_words"] = ["Special orders and sublet row drawn without its note"]; d["prd_code"] = "S3-N4 / S3-R2"
d["ruling_or_question"] = ("Narrowed 13 Nov 2026: the redrawn 7b now says \"No account set for General Internal. …\"; only the missing Special orders note is left, "
                          "settled by S3-R2 / S3-N4 v1.3 (check a, the text wins). Case D-39.")
d = ids["IWO-D23"]; d["outcome_before_v1.3"] = d["outcome"]
d["design_words"] = d["design_words"][:2]; d["prd_code"] = "S2-R5 / S2-R3"
d["ruling_or_question"] = ("Narrowed 13 Nov 2026: v1.3 expects no closing sentence in the original work order window (S3-R2 (1)), so that part is gone; "
                          "the No Charge card wording behind the dialog stands, settled by S2-R5 and S2-R3. Case D-61.")
NEW = [
    ("IWO-D57", "wording (extra words)", "Flow 1 7e", "images/iwo-flow1-20-7e-close-vendor-bill-cost-moves-v13.png",
     ["A vendor bill on this work order was posted to another account. Closing moves that cost.", "Caliper (special order), vendor bill VB-2041"], "S3-R2",
     "CLOSED-BY-CHECK-C", "closed by check (c): design is the source where the PRD is silent. The lead sentence and the item line add to S3-R2's "
     "dialog and nothing contradicts it (coordinator, 13 Nov 2026). \"Caliper\" and \"VB-2041\" are example data. Cases D-93 (the design's words) and D-42 (title, rows, buttons).", "D-93"),
    ("IWO-D58", "inconsistent board", "Flow 1 7e", "images/iwo-flow1-20-7e-close-vendor-bill-cost-moves-v13.png",
     ["Behind the window the Special orders row says \"Already posted to 6500 Vehicle Expenses at the vendor bill\" while the window moves that $410.00 from Cost of Parts"],
     "S3-R2", "SETTLED-BY-PRD", "Skill 07 §6.0 check (a): the text wins: S3-R2 v1.3 gives a moved item the note \"Moved from [account] to [account]\". Cases D-42, S3-11.", ""),
    ("IWO-D59", "missing wording", "Flow 1 7c", "images/iwo-flow1-18-7c-finance-tab-no-accounting-integration-v13.png",
     ["Labor row drawn without \"Hours only, nothing posted\""], "S3-E4 / S3-R2", "SETTLED-BY-PRD",
     "Skill 07 §6.0 check (g): behaviour first: the cases test that nothing posts for labor and that the rows carry no account notes, and leave the "
     "\"Hours only\" wording out without an integration. Cases D-40, S3-46.", ""),
    ("IWO-D60", "wording", "Flow 1 7b", "images/iwo-flow1-17-7b-finance-tab-no-account-set-v13.png",
     ["Shop supplies note \"Posted to ShopView Review, credited to …\""], "S3-N4", "SETTLED-BY-PRD",
     "Skill 07 §6.0 check (a): S3-N4 v1.3 replaces the account note of an unmapped row with the \"No account set for [category]. …\" warning. Case D-39.", ""),
    ("IWO-D61", "wording and missing line", "Flow 2 04", "images/iwo-flow2-10-04-finance-tab-close-work-order-v13.png",
     ["Preview headed \"Estimate S2-35102\" with NO CHARGE and no \"Category:\" line"], "S3-R2 / S3-R5", "SETTLED-BY-PRD",
     "Skill 07 §6.0 check (a): S3-R2 calls the preview \"the preview of the NO CHARGE document (S3-R5)\"; S3-R5 gives \"No Charge Work Order [number]\" and \"Category: [name]\". Case D-60.", ""),
    ("IWO-D62", "stale board", "Happy 28 \"28 Close confirmation\" (not redrawn)", "images/iwo-happy-28-28-close-confirmation.png",
     ["Close work order S2-35102?", "This posts the parts cost and shop supplies to your books and marks the work order Closed · No Charge. You can reopen it later."],
     "S3-R1 / S3-R2", "SETTLED-BY-PRD",
     "Skill 07 §6.0 check (a): S3-R1 v1.3 closes on the press \"with no confirmation\"; check (d): the design's own notes say the same (c-hf-17 \"One press, like "
     "Create invoice: no confirmation\", c-rv-5-2 \"No Close confirmation (Nov 12)\"), so this one frame is stale. Board dropped from D-60's references. "
     "Found 13 Nov 2026 by the case worker (the design change list did not name it: the board's file did not change).", ""),
]
for i, kind, boards, pic, words, code, outcome, why, held in NEW:
    R["differences"].append({"id": i, "kind": kind, "boards": boards, "pictures": [pic], "design_words": words, "prd_code": code, "prd_words": [],
                             "outcome": outcome, "ruling_or_question": why, "held_case": held,
                             "note": f"From DESIGN-CHANGE-v1.3-2026-11-12.md §6 with the coordinator's verdict (13 Nov 2026)" if i != "IWO-D62" else "Case worker, 13 Nov 2026."})
ns["IWO-N05"]["prd_words_or_state"] = "The one hint line of S1-R3 v1.3 for AccountingHub (names Accounting > Account Mappings), both integrations, and neither (ends at \"set there.\")"
ns["IWO-N05"]["checked"] = "13 Nov 2026, design 1794510020-d4ec: only the QuickBooks variant is drawn"
ns["IWO-N25"]["prd_words_or_state"] = ("\"Posts to [account] when the vendor bill is entered\" and \"includes $[core amount] core cost\" notes; \"Moved from [account] to [account]\" "
                                       "is now drawn in the 7e window but not as a note in the posting summary")
ns["IWO-N25"]["checked"] = "13 Nov 2026, design 1794510020-d4ec"
for i, code, w in [("IWO-N42", "S3-E5", "\"This work order changed. Review and close again.\" (the refusal while a Close window is open)"),
                   ("IWO-N43", "S3-R2", "the Finance tab of an open internal work order for a user without 'See Financial Data' (no posting summary)"),
                   ("IWO-N44", "S3-R2", "the Close window when both cases apply (the original work order selects above the \"Moved from\" rows)")]:
    R["not_shown"].append({"id": i, "prd_code": code, "prd_words_or_state": w,
                           "outcome": "DESIGN-SILENT: nothing drawn, so no held case (Rule 130.5); the PRD-following case is the only case",
                           "checked": "13 Nov 2026, design 1794510020-d4ec, all 167 boards"})
oc = [d["outcome"] for d in R["differences"]]
R["counts"] = {"differences": len(oc), "settled_by_prd": sum(o.startswith("SETTLED") for o in oc), "closed_matching": sum(o.startswith("CLOSED") for o in oc),
               "held_design_version": sum(o.startswith("HELD") for o in oc), "rulings": sum(o.startswith("RULING") for o in oc), "questions": 0, "not_shown": len(R["not_shown"])}
R["design"] = "https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo, canvas \"Internal Work Orders · All flows v6\", version 1794561577-f903 (boards byte-identical to 1794510020-d4ec, which redrew 15 boards on 12 Nov 2026; checked 13 Nov 2026)"
R["prd"] = "Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), saved build/founder-mode/internal-work-orders/sources/CONFLUENCE-942243841-v1.3-read-2026-11-12.md"
R["v1.3_update"] = ("13 Nov 2026, case worker round 4: IWO-D02, D20, D21 closed; D22, D23 narrowed; N05, N25 reworded; D57-D61 added with the coordinator's "
                    "verdicts (D57 closed by check (c), case D-93 runnable); D62 added (stale Happy 28 board); N42-N44 added (design-silent). No question. Before-copy: "
                    "po-answers-2026-11-12/write/DESIGN-DIVERGENCE-REGISTER-before-v1.3.json.")
R["S1-R3|Map their expense accounts in Integrations > QuickBooks."] = {"outcome": "REMOVED-FROM-PRD", "where": "PRD v1.3 S1-R3 has no second line; the design stopped drawing it (hintAccounts always false)"}
json.dump(R, open(f"{P}/DESIGN-DIVERGENCE-REGISTER.json", "w"), indent=1, ensure_ascii=False)
print(R["counts"])
