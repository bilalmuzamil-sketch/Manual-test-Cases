#!/usr/bin/env python3
"""Authorized TestRail push 2026-07-29: 3 Simple Flow sell-price corrective cases.

Scope (user-authorized "Push" 2026-07-29):
  - 1 add_section: "Regression & Edge Cases — from tickets" under Simple Flow group 4058
    (no suitable regression/edge-from-tickets section existed; 4085 "Validation / Edge"
    is an authored validation section, not the 2026-07-29 meeting convention section).
  - 3 add_case (SF-RCV-14, SF-RCV-15, SF-VPART-08) with custom_atmstatus:3 +
    custom_automation_type:0; refs = "Fabian 2026-07-29 sell-price concern (ticket TBD)
    + QA lead repro 2026-07-29".
  - Re-GET verify each case. NOTHING else: no update_case, no delete, no run writes
    (run 325 = Ayesha's, untouched).

Creds: /tmp/tr-creds.env (never committed). Idempotence: writes state to
push-state-2026-07-29.json so a rerun does not duplicate.
"""
import json, os, re, subprocess, sys, time

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = "https://shopview.testrail.io/index.php?/api/v2"
SIMPLE_FLOW_GROUP = 4058
SECTION_NAME = "Regression & Edge Cases — from tickets"
REFS = "Fabian 2026-07-29 sell-price concern (ticket TBD) + QA lead repro 2026-07-29"
PRIORITY = {"High": 3, "Medium": 2}
TYPE_REGRESSION = 9
STATE_PATH = os.path.join(HERE, "push-state-2026-07-29.json")


def creds():
    env = {}
    with open("/tmp/tr-creds.env") as f:
        for line in f:
            m = re.match(r"export (\w+)=(.*)", line.strip())
            if m:
                env[m.group(1)] = m.group(2)
    return env["TESTRAIL_USER"], env["TESTRAIL_KEY"]


USER, KEY = creds()


def api(method, path, payload=None):
    cmd = ["curl", "-sS", "-u", f"{USER}:{KEY}", "-H", "Content-Type: application/json",
           "-w", "\n%{http_code}", f"{BASE}/{path}"]
    if method == "POST":
        cmd += ["-X", "POST", "-d", json.dumps(payload or {})]
    out = subprocess.run(cmd, capture_output=True, text=True).stdout
    body, code = out.rsplit("\n", 1)
    return int(code), (json.loads(body) if body.strip() else {})


def ol(items):
    """Numbered draft strings -> TestRail <ol><li> HTML (strip 'N. ' prefixes)."""
    lis = []
    for it in items:
        text = re.sub(r"^\d+\.\s*", "", it)
        lis.append(f"<li>{text}</li>")
    return "<ol>\n" + "\n".join(lis) + "\n</ol>\n"


def main():
    draft = json.load(open(os.path.join(HERE, "corrective-cases-draft.json")))
    state = json.load(open(STATE_PATH)) if os.path.exists(STATE_PATH) else {"cases": {}}

    # 1. section (create once)
    if "section_id" not in state:
        code, sec = api("POST", "add_section/1", {
            "suite_id": 1, "parent_id": SIMPLE_FLOW_GROUP, "name": SECTION_NAME,
            "description": "Edge-case/regression cases converted from tickets/findings (2026-07-29 execution-discipline convention). First intake: Fabian's 2026-07-29 sell-price concern."})
        if code != 200:
            sys.exit(f"add_section FAILED HTTP {code}: {sec}")
        state["section_id"] = sec["id"]
        json.dump(state, open(STATE_PATH, "w"), indent=2)
        print(f"add_section -> {sec['id']} '{sec['name']}' (parent {sec['parent_id']}) HTTP {code}")
    section_id = state["section_id"]

    # 2. add_case x3
    for c in draft["cases"]:
        sfid = c["id"]
        assert len(c["title"]) <= 80 and "<" not in c["title"] and ">" not in c["title"], sfid
        if sfid in state["cases"]:
            print(f"{sfid}: already pushed = C{state['cases'][sfid]}, skipping")
            continue
        payload = {
            "title": c["title"],
            "type_id": TYPE_REGRESSION,
            "priority_id": PRIORITY[c["priority"]],
            "refs": REFS,
            "custom_atmstatus": 3,
            "custom_automation_type": 0,
            "custom_preconds": ol(c["preconditions"]),
            "custom_steps": ol(c["steps"]),
            "custom_expected": ol(c["expected"]),
        }
        code, res = api("POST", f"add_case/{section_id}", payload)
        if code != 200:
            sys.exit(f"{sfid} add_case FAILED HTTP {code}: {res}")
        state["cases"][sfid] = res["id"]
        json.dump(state, open(STATE_PATH, "w"), indent=2)
        print(f"{sfid}: add_case -> C{res['id']} HTTP {code}")
        time.sleep(0.5)

    # 3. re-GET verify
    print("\n--- re-GET verification ---")
    all_ok = True
    for c in draft["cases"]:
        cid = state["cases"][c["id"]]
        code, live = api("GET", f"get_case/{cid}")
        checks = {
            "title": live.get("title") == c["title"],
            "section": live.get("section_id") == section_id,
            "refs": live.get("refs") == REFS,
            "atm": live.get("custom_atmstatus") == 3 and live.get("custom_automation_type") == 0,
            "preconds": live.get("custom_preconds") == ol(c["preconditions"]),
            "steps": live.get("custom_steps") == ol(c["steps"]),
            "expected": live.get("custom_expected") == ol(c["expected"]),
            "type": live.get("type_id") == TYPE_REGRESSION,
            "priority": live.get("priority_id") == PRIORITY[c["priority"]],
        }
        ok = all(checks.values())
        all_ok &= ok
        print(f"{c['id']} = C{cid}: HTTP {code} " + ("MATCH" if ok else f"MISMATCH {checks}"))
    print("\nALL VERIFIED MATCH" if all_ok else "\nVERIFICATION FAILED")
    sys.exit(0 if all_ok else 1)


if __name__ == "__main__":
    main()
