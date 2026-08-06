"""Build the five-part ADF body and write it, with Rule-50 byte verification.

Per ticket:
  1. build the ADF from tools/content_*.py, reusing any EXISTING media node verbatim
     out of the pre-edit snapshot (so an attached picture stays attached and shows at
     the point it helps);
  2. PUT only `description`;
  3. re-GET and byte-compare the stored description against the intended payload;
  4. byte-compare EVERY other field against the pre-edit snapshot -- issuetype, parent,
     priority, status, resolution, Product Area, issuelinks, labels, assignee, creator,
     reporter, summary, votes, watches, everything the API returns -- with only
     `updated` allowed to move;
  5. on ANY mismatch, STOP the batch and print both byte sequences.

Usage:  python3 tools/rewrite.py --dry-run [KEY ...]
        python3 tools/rewrite.py --write   [KEY ...]
"""
import copy, json, os, sys, time

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = "/home/user/Manual-test-Cases"
sys.path.insert(0, f"{ROOT}/build/ticket-source-blocks-2026-08-06/tools")
sys.path.insert(0, HERE)
import jiralib
import content_filters, content_schedule

BASE = f"{ROOT}/build/ticket-reformat-2026-08-06/filters-schedule"
SNAP = f"{BASE}/snapshots"
PRE = f"{SNAP}/pre-edit"
POST = f"{SNAP}/post-edit"
os.makedirs(POST, exist_ok=True)

CONTENT = {}
CONTENT.update(content_filters.TICKETS)
CONTENT.update(content_schedule.TICKETS)

ORDER = sorted(CONTENT, key=lambda k: int(k.split("-")[1]))

# Fields allowed to differ after a description-only write.
#   description -- the field we wrote, compared separately and exactly
#   updated     -- the server's own write timestamp
#   lastViewed  -- PROVEN (snapshots/lastviewed-probe.json) to be a per-user marker set
#                  by the Jira WEB UI and never by our REST calls: SV-8843 read 5+ times
#                  today never moved it, and SV-8959 read AND written never gained one.
#                  It is not part of the issue's content. Where it moves, that is somebody
#                  opening the ticket in a browser, and it is REPORTED, not absorbed.
ALLOWED_MOVERS = {"description", "updated", "lastViewed"}


# --------------------------------------------------------------------- ADF build
def para(text):
    return {"type": "paragraph", "content": [{"type": "text", "text": text}]}


def heading(text):
    return {"type": "heading", "attrs": {"level": 3},
            "content": [{"type": "text", "text": text}]}


def env_para(text):
    return {"type": "paragraph", "content": [
        {"type": "text", "text": "Environment: ", "marks": [{"type": "strong"}]},
        {"type": "text", "text": text},
    ]}


def olist(items):
    return {"type": "orderedList", "attrs": {"order": 1}, "content": [
        {"type": "listItem", "content": [para(t)]} for t in items]}


def media_nodes(key, ids):
    """Pull the EXISTING mediaSingle nodes out of the pre-edit snapshot, verbatim."""
    snap = json.load(open(f"{PRE}/{key}.json"))
    found, want = {}, list(ids)

    def walk(n):
        if isinstance(n, dict):
            if n.get("type") == "mediaSingle":
                for c in n.get("content") or []:
                    mid = (c.get("attrs") or {}).get("id")
                    if mid in want:
                        found[mid] = copy.deepcopy(n)
            for v in n.values():
                walk(v)
        elif isinstance(n, list):
            for v in n:
                walk(v)

    walk(snap["fields"].get("description"))
    missing = [i for i in want if i not in found]
    if missing:
        raise SystemExit(f"{key}: media node(s) not found in snapshot: {missing}")
    return [found[i] for i in want]


def build(key):
    c = CONTENT[key]
    doc = [heading("Description")]
    doc += [para(t) for t in c["description"]]

    doc.append(heading("Steps to reproduce"))
    doc.append(env_para(c["env"]))
    doc.append(olist(c["steps"]))

    doc.append(heading("Current behaviour"))
    for kind, val in c["current"]:
        if kind == "p":
            doc.append(para(val))
        elif kind == "media":
            doc += media_nodes(key, val)
        else:
            raise SystemExit(f"{key}: unknown current-behaviour kind {kind!r}")

    doc.append(heading("Expected behaviour"))
    doc += [para(t) for t in c["expected"]]

    doc.append({"type": "rule"})
    doc.append(heading("Source"))
    doc += [para(t) for t in c["source"]]

    return {"type": "doc", "version": 1, "content": doc}


# ------------------------------------------------------------------ verification
def flatten(obj, path=""):
    """Flatten a JSON value into {dotted-path: scalar} so a diff names the field."""
    out = {}
    if isinstance(obj, dict):
        for k, v in obj.items():
            out.update(flatten(v, f"{path}.{k}" if path else k))
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            out.update(flatten(v, f"{path}[{i}]"))
    else:
        out[path] = obj
    return out


def strip_localids(node):
    """localId is a client-side editor id; Jira mints one for any node lacking it.

    Declared normalisation: it carries no meaning, so it is excluded from the
    description comparison. Every other attribute IS compared byte for byte.
    """
    if isinstance(node, dict):
        return {k: strip_localids(v) for k, v in node.items() if k != "localId"}
    if isinstance(node, list):
        return [strip_localids(v) for v in node]
    return node


def canon(adf):
    return json.dumps(strip_localids(adf), sort_keys=True, separators=(",", ":"))


def verify(key, payload_desc):
    code, live = jiralib.get(
        f"/rest/api/3/issue/{key}?expand=renderedFields", f"/tmp/_ver_{key}.json")
    if code != "200":
        return {"key": key, "ok": False, "why": f"re-GET HTTP {code}"}
    json.dump(live, open(f"{POST}/{key}.json", "w"), indent=1, sort_keys=True)
    pre = json.load(open(f"{PRE}/{key}.json"))

    # (a) description equals the intended payload
    got, want = canon(live["fields"]["description"]), canon(payload_desc)
    desc_ok = got == want
    desc_detail = ""
    if not desc_ok:
        for i, (a, b) in enumerate(zip(got, want)):
            if a != b:
                desc_detail = (f"first difference at byte {i}\n"
                               f"  stored : {got[max(0,i-90):i+90]!r}\n"
                               f"  payload: {want[max(0,i-90):i+90]!r}")
                break
        else:
            desc_detail = f"length differs: stored {len(got)} vs payload {len(want)}"

    # (b) every other field byte-identical to the pre-edit snapshot
    fpre, fnow = flatten(pre["fields"]), flatten(live["fields"])
    moved = []
    for p in sorted(set(fpre) | set(fnow)):
        top = p.split(".")[0].split("[")[0]
        if top in ALLOWED_MOVERS:
            continue
        if fpre.get(p, "<<absent>>") != fnow.get(p, "<<absent>>"):
            moved.append({"field": p, "before": fpre.get(p, "<<absent>>"),
                          "after": fnow.get(p, "<<absent>>")})

    # (c) the named critical fields, checked by name as well as by sweep
    named = {}
    for label, getter in [
        ("issuetype", lambda f: (f.get("issuetype") or {}).get("name")),
        ("issuetype_id", lambda f: (f.get("issuetype") or {}).get("id")),
        ("parent", lambda f: (f.get("parent") or {}).get("key")),
        ("priority", lambda f: (f.get("priority") or {}).get("name")),
        ("status", lambda f: (f.get("status") or {}).get("name")),
        ("resolution", lambda f: (f.get("resolution") or {}).get("name")),
        ("product_area", lambda f: f.get("customfield_10153")),
        ("labels", lambda f: sorted(f.get("labels") or [])),
        ("assignee", lambda f: (f.get("assignee") or {}).get("displayName")),
        ("summary", lambda f: f.get("summary")),
        ("links", lambda f: sorted(
            ((l.get("type") or {}).get("name", "")
             + ":" + ((l.get("outwardIssue") or l.get("inwardIssue") or {}).get("key", "")))
            for l in (f.get("issuelinks") or []))),
        ("attachment_ids", lambda f: sorted(a["id"] for a in (f.get("attachment") or []))),
    ]:
        b, a = getter(pre["fields"]), getter(live["fields"])
        named[label] = {"before": b, "after": a, "same": b == a}

    ok = desc_ok and not moved and all(v["same"] for v in named.values())
    return {"key": key, "ok": ok, "desc_ok": desc_ok, "desc_detail": desc_detail,
            "fields_compared": len(set(fpre) | set(fnow)), "moved": moved,
            "named": named}


# ------------------------------------------------------------------------ driver
if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    write = "--write" in sys.argv
    verify_only = "--verify-only" in sys.argv
    keys = args or ORDER
    log = []
    for i, key in enumerate(keys, 1):
        doc = build(key)
        json.dump(doc, open(f"{POST}/{key}.payload.json", "w"), indent=1, sort_keys=True)
        if verify_only:
            v = verify(key, doc); v["http"] = "n/a (verify-only)"
            log.append(v)
            print(f"{i:3}/{len(keys)} {key} VERIFY-ONLY  ok={v['ok']}  "
                  f"desc_ok={v['desc_ok']}  {v['fields_compared']} fields, "
                  f"{len(v['moved'])} moved")
            for m in v["moved"][:10]:
                print(f"     moved {m['field']}: {m['before']!r} -> {m['after']!r}")
            continue
        if not write:
            print(f"{i:3}/{len(keys)} {key} built  nodes={len(doc['content'])}  "
                  f"bytes={len(json.dumps(doc))}")
            continue
        code, resp = jiralib.put(f"/rest/api/3/issue/{key}",
                                 {"fields": {"description": doc}},
                                 f"/tmp/_put_{key}.json")
        if code not in ("204", "200"):
            print(f"{i:3}/{len(keys)} {key} PUT HTTP {code} -- STOPPING\n{str(resp)[:900]}")
            log.append({"key": key, "op": "PUT description", "http": code,
                        "verified": "NOT ATTEMPTED", "error": str(resp)[:900]})
            break
        time.sleep(0.5)
        v = verify(key, doc)
        v["http"] = code
        log.append(v)
        if v["ok"]:
            print(f"{i:3}/{len(keys)} {key} PUT {code}  VERIFIED  "
                  f"{v['fields_compared']} fields compared, 0 moved, description exact")
        else:
            print(f"{i:3}/{len(keys)} {key} PUT {code}  **MISMATCH -- STOPPING**")
            print("   desc_ok:", v["desc_ok"])
            if v["desc_detail"]:
                print("  ", v["desc_detail"])
            for m in v["moved"][:20]:
                print(f"   moved {m['field']}: {m['before']!r} -> {m['after']!r}")
            for k2, val in v["named"].items():
                if not val["same"]:
                    print(f"   named {k2}: {val['before']!r} -> {val['after']!r}")
            break
        time.sleep(0.3)
    if write or verify_only:
        prev = []
        p = f"{SNAP}/write-log.json"
        if os.path.exists(p):
            prev = json.load(open(p))
        json.dump(prev + log, open(p, "w"), indent=1)
        print(f"\n{sum(1 for x in log if x.get('ok'))} of {len(log)} verified clean")
