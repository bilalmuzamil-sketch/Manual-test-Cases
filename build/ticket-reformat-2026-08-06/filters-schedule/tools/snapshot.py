"""Snapshot EVERY field of every ticket in the population, before any edit.

Standing Rule 50: the pre-write snapshot is the only thing that can later prove a field
was not touched, and the only place removed description material stays recoverable.
Writes one JSON per ticket plus a combined file, and a readable .md of each description.
"""
import json, os, sys, time

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = "/home/user/Manual-test-Cases"
sys.path.insert(0, f"{ROOT}/build/ticket-source-blocks-2026-08-06/tools")
sys.path.insert(0, HERE)
import jiralib

OUT = f"{ROOT}/build/ticket-reformat-2026-08-06/filters-schedule/snapshots"
PRE = f"{OUT}/pre-edit"
os.makedirs(PRE, exist_ok=True)

POP = json.load(open(f"{OUT}/population.json"))["population"]


def adf_text(node, depth=0):
    """Flatten an ADF document to readable plain text (for the recoverable .md)."""
    if node is None:
        return ""
    t = node.get("type")
    if t == "text":
        return node.get("text", "")
    if t == "hardBreak":
        return "\n"
    kids = node.get("content") or []
    inner = "".join(adf_text(k, depth + 1) for k in kids)
    if t == "paragraph":
        return inner + "\n\n"
    if t == "heading":
        lvl = (node.get("attrs") or {}).get("level", 1)
        return "#" * lvl + " " + inner + "\n\n"
    if t in ("bulletList", "orderedList"):
        return inner + "\n"
    if t == "listItem":
        return "- " + inner.strip() + "\n"
    if t == "rule":
        return "\n---\n\n"
    if t == "mediaSingle" or t == "mediaGroup":
        ids = []
        for k in kids:
            a = k.get("attrs") or {}
            ids.append(f"[media id={a.get('id')} type={a.get('type')}]")
        return " ".join(ids) + "\n\n"
    if t == "codeBlock":
        return "```\n" + inner + "\n```\n\n"
    if t == "blockquote":
        return "> " + inner.strip() + "\n\n"
    if t == "panel":
        return "[panel] " + inner.strip() + "\n\n"
    if t == "table":
        return inner + "\n"
    if t in ("tableRow",):
        return "| " + inner.strip() + "\n"
    if t in ("tableCell", "tableHeader"):
        return inner.strip() + " | "
    return inner


if __name__ == "__main__":
    combined = {}
    for i, key in enumerate(POP, 1):
        code, d = jiralib.get(f"/rest/api/3/issue/{key}?expand=renderedFields,changelog",
                              f"/tmp/_snap_{key}.json")
        if code != "200":
            print(f"{i:3}/{len(POP)} {key} HTTP {code} !!"); continue
        combined[key] = d
        json.dump(d, open(f"{PRE}/{key}.json", "w"), indent=1, sort_keys=True)
        desc = d["fields"].get("description")
        body = adf_text(desc) if desc else "(no description)"
        with open(f"{PRE}/{key}.md", "w") as fh:
            fh.write(f"# {key} — {d['fields']['summary']}\n\n")
            fh.write(f"Snapshot taken before the 2026-08-06 reformat. "
                     f"Live `updated` at snapshot time: {d['fields'].get('updated')}\n\n"
                     f"---\n\n")
            fh.write(body)
        n = len(json.dumps(desc)) if desc else 0
        print(f"{i:3}/{len(POP)} {key} ok  adf_bytes={n:6}  "
              f"status={d['fields']['status']['name']}", flush=True)
        time.sleep(0.1)
    json.dump(combined, open(f"{OUT}/pre-edit-all.json", "w"), indent=1, sort_keys=True)
    print("snapshotted", len(combined), "of", len(POP))
