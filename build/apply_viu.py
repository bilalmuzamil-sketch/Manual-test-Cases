#!/usr/bin/env python3
"""Apply VIU (Verify-in-UI) pass-1 findings to the ShopView Custom Roles test suite.

Edits build/*.json in place (Parts B & C), with per-rule replacement counts.
Run once. Idempotent-ish: string replacements won't double-apply because targets
change; verified-status flip only touches remaining 'UNVERIFIED — VIU pending.'.
"""
import json
import os
import re
from collections import Counter

BUILD = os.path.dirname(os.path.abspath(__file__))
FILES = ["sp-crud.json", "sp-noncrud.json", "te.json", "combo.json"]

counts = Counter()

# --- Reusable constants ---
NAV_OLD_AND = "Administration > Roles and Permissions"
NAV_OLD_AMP = "Administration > Roles & Permissions"
NAV_NEW = ("Settings > Roles & Permissions (avatar menu → Settings → "
           "Roles & Permissions; URL /administration/roles-permissions)")

WAGES_NOTE = None  # handled by explicit label rule

VIU_MATCH = "VERIFIED (staging 2026-07-01) — MATCH; see VIU Findings Log"
def viu_disc(n):
    return f"VERIFIED (staging 2026-07-01) — DISCREPANCY; see VIU-{n}"
UNVERIFIED = "UNVERIFIED — VIU pending."

FIN_NOTE = " [Build-vs-spec: spec wording differed — see VIU-11.]"
INTEG_EXPECTED = ("No 'Integrations' sub-setting exists in the role editor (build); "
                  "Integrations (QuickBooks, IBS) is a top-level Administration area only. "
                  "[Build-vs-spec: see VIU-12.]")
DELETE_NOTE = (" [Build-vs-spec: no Delete action is present in the roles list UI for any "
               "role (system or custom) as of 2026-07-01 — SV-7502 appears unimplemented; "
               "see VIU-05.]")


def repl(text, old, new, rule):
    """Count-and-replace helper for plain substrings."""
    if text is None:
        return text
    n = text.count(old)
    if n:
        counts[rule] += n
        text = text.replace(old, new)
    return text


# --- Financial modal rewrite ---
# Matches the quoted modal body and replaces with the ACTUAL wording, keeping area.
# Handles both single- and double-quoted forms and the "[Area]" literal.
FIN_QUOTE_RE = re.compile(
    r"""(?P<q>["'])(?P<area>[^"']+?)\s+requires\s+(?:['"]?See Financial Data['"]?)"""
    r"""\s+to be enabled\.?\s*Enable it\??(?P=q)""")


def fin_modal_rewrite(text):
    """Rewrite any financial-modal quote to the actual title+body+buttons wording."""
    if text is None or "See Financial Data" not in text:
        return text

    def _sub(m):
        area = m.group("area").strip()
        if area == "[Area]":
            area = "[Area]"  # keep placeholder if generic
        counts["B2_financial_modal_quote"] += 1
        return (f'Modal title: "Enable See Financial Data?" '
                f'Body: "{area} requires See Financial Data. Enable it to grant this '
                f'permission?" Buttons: "Cancel" / "Enable"')

    new = FIN_QUOTE_RE.sub(_sub, text)
    return new


def touches_financial_modal(text):
    if not text:
        return False
    return bool(re.search(r"financial (confirm )?modal|See Financial Data", text, re.I))


def process_case(c):
    tid = c["test_id"]
    dep = c.get("dependency_mode", "")
    perm = c.get("permission", "")

    # ---------- PART B ----------
    # B1: navigation path
    for fld in ("preconditions", "role_setup", "test_data", "expected_final"):
        c[fld] = repl(c.get(fld), NAV_OLD_AMP, NAV_NEW, "B1_nav") if c.get(fld) else c.get(fld)
        c[fld] = repl(c.get(fld), NAV_OLD_AND, NAV_NEW, "B1_nav") if c.get(fld) else c.get(fld)
    for s in c.get("steps", []):
        for k in ("action", "expected"):
            s[k] = repl(s[k], NAV_OLD_AMP, NAV_NEW, "B1_nav")
            s[k] = repl(s[k], NAV_OLD_AND, NAV_NEW, "B1_nav")

    # B4: AP/AR toggle label (do before other rules; safe substrings)
    def apar(text):
        if text is None:
            return text
        text = repl(text, "Manage Accounts Payable and Receivable", "View and Manage AP/AR Data", "B4_apar_label")
        return text
    c["permission"] = apar(c.get("permission"))
    c["expected_final"] = apar(c.get("expected_final"))
    c["preconditions"] = apar(c.get("preconditions"))
    c["role_setup"] = apar(c.get("role_setup"))
    for s in c.get("steps", []):
        for k in ("action", "expected"):
            s[k] = apar(s[k])

    # B3: Wages label normalization (idempotent) + Integrations sub-setting handling.
    # "View/Manage Wages" already canonical; normalize bare "Manage Wages"/"Wages" only
    # when clearly the settings sub-toggle. In this suite the label is already correct,
    # so this is a no-op guard that still counts any real changes.
    def wages(text):
        if text is None:
            return text
        # Only touch standalone "Manage Wages" not already "View/Manage Wages"
        new = re.sub(r"(?<!/)\bManage Wages\b", "View/Manage Wages", text)
        if new != text:
            counts["B3_wages_label"] += new.count("View/Manage Wages") - text.count("View/Manage Wages")
        return new
    c["permission"] = wages(c.get("permission"))
    for s in c.get("steps", []):
        for k in ("action", "expected"):
            s[k] = wages(s[k])
    c["expected_final"] = wages(c.get("expected_final"))

    # B3: Integrations sub-setting case -> note + DISCREPANCY verdict
    is_integrations_case = bool(re.search(r"settingsIntegrations", perm)) or (
        tid.startswith("SP-SET-") and re.search(r"\bIntegrations\b", c.get("title", "")))
    if is_integrations_case:
        # Set expected on the case (append note to expected_final)
        if INTEG_EXPECTED not in c["expected_final"]:
            c["expected_final"] = c["expected_final"].rstrip() + " " + INTEG_EXPECTED
            counts["B3_integrations_note"] += 1

    # B2: financial confirm modal wording (steps + expected_final)
    case_has_fin_modal = False
    for s in c.get("steps", []):
        for k in ("action", "expected"):
            before = s[k]
            s[k] = fin_modal_rewrite(s[k])
            if s[k] != before:
                case_has_fin_modal = True
            elif touches_financial_modal(s[k]) and re.search(r"requires .{0,40}See Financial Data", s[k]):
                case_has_fin_modal = True
    # expected_final may describe modal wording too
    if re.search(r"requires .{0,40}See Financial Data.{0,30}Enable it", c["expected_final"]):
        c["expected_final"] = fin_modal_rewrite(c["expected_final"])
        case_has_fin_modal = True
    # Append the VIU-11 note to any step whose modal wording we rewrote
    for s in c.get("steps", []):
        for k in ("action", "expected"):
            if "Enable See Financial Data?" in s[k] and FIN_NOTE.strip() not in s[k]:
                s[k] = s[k].rstrip() + FIN_NOTE
                counts["B2_financial_note"] += 1

    # B6: Save -> Create for role-creation flows + Step-1 template dialog note
    def is_create_flow():
        blob = " ".join(s["action"] for s in c.get("steps", []))
        return "Create Custom Role" in blob or "create the custom role" in blob \
            or "follow the admin flow to create the custom role" in blob

    if is_create_flow():
        for s in c.get("steps", []):
            a = s["action"]
            # canonical create-persist phrasings
            a2 = a
            a2 = re.sub(r"Click Save to create the custom role",
                        "Click Create to create the custom role", a2)
            a2 = a2.replace("then Save.", "then Create.")
            a2 = re.sub(r"' > Save\.", "' > Create.", a2)  # naming step: '...' > Save.
            if a2 != a:
                counts["B6_save_to_create"] += 1
                s["action"] = a2
        # Add the Step-1 "Choose a template" dialog note to the create/entry step once
        for s in c.get("steps", []):
            if ("Create Custom Role" in s["action"] or
                    "follow the admin flow to create the custom role" in s["action"]):
                note = (" (Step 1 is a 'Choose a template' dialog with Skip / Apply; "
                        "the footer save button on the Create Role page is labelled 'Create'.)")
                if "Choose a template" not in s["action"]:
                    s["action"] = s["action"].rstrip() + note
                    counts["B6_template_dialog_note"] += 1
                break

    # B7: Delete-role cases -> none exist in this suite (record-delete only). No-op.

    # ---------- PART C: source_viu verdicts ----------
    verdict = None  # ('MATCH', None) or ('DISC', n)
    if "Cascade" in dep:
        verdict = ("MATCH", None)  # VIU-09/10
    if dep == "Parent gate: hide children" or re.search(r"Parts Department", perm):
        verdict = ("MATCH", None)  # VIU-13
    # Settings sub-setting cases (App Settings/Service/Parts/Finance/Data Import/Wages)
    settings_sub = bool(re.search(
        r"settings|App Settings|Data Import|View/Manage Wages",
        perm, re.I)) or tid.startswith("SP-SET-")
    if settings_sub:
        verdict = ("MATCH", None)  # VIU-12 (6 subs)
    if is_integrations_case:
        verdict = ("DISC", 12)
    if re.search(r"[Vv]iew ?[Mm]ode|viewMode", perm):
        verdict = ("MATCH", None)  # VIU-14
    if dep == "Financial gate: confirm modal":
        verdict = ("DISC", 11)  # VIU-11 (overrides where financial modal is the mode)

    if verdict is not None and c["source_viu"].rstrip().endswith(UNVERIFIED):
        prefix = c["source_viu"][: -len(UNVERIFIED)].rstrip()
        if verdict[0] == "MATCH":
            newstat = VIU_MATCH
            counts["C_verified_match"] += 1
        else:
            newstat = viu_disc(verdict[1])
            counts["C_verified_discrepancy"] += 1
        c["source_viu"] = (prefix + " " + newstat).strip()

    # B7 delete note already N/A; B2 financial DISCREPANCY verdict set above via dep.
    return c


def main():
    for fname in FILES:
        path = os.path.join(BUILD, fname)
        with open(path) as f:
            data = json.load(f)
        for c in data:
            process_case(c)
        with open(path, "w") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            f.write("\n")

    print("=== Replacement / update counts ===")
    for k in sorted(counts):
        print(f"  {k}: {counts[k]}")


if __name__ == "__main__":
    main()
