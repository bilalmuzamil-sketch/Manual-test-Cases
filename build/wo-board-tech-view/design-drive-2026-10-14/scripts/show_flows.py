"""Print a compact view of flows.json (python3 -I show_flows.py <flows.json> [flow-id ...])."""
import json, sys
r = json.load(open(sys.argv[1])); only = set(sys.argv[2:])
def show(steps, ind="  "):
    for s in steps:
        if "sub" in s:
            print(ind + "SUB", s["sub"]); show(s["steps"], ind + "  "); continue
        if "variant" in s:
            print(ind + "VARIANT", s["variant"]); show(s["steps"], ind + "  "); continue
        if "check" in s:
            print(ind + "CHECK", s["check"], "=>", s["result"]); continue
        nt = [t for t in s["new_text"] if not t.startswith("[iframe]")]
        fi = [t for t in s["new_text"] if t.startswith("[iframe]")]
        print(ind + f"STEP {s['n']} {s['action']}" + (f" ERR {s['error'][:160]}" if s["error"] else "") + f" | new {s['new_count']}: {nt[:14]}" + (f" (+{len(fi)} iframe)" if fi else "") + (f" | gone {s['gone_count']}: {s['gone_text'][:6]}" if s['gone_count'] < 12 and s['gone_count'] else f" | gone {s['gone_count']}"))
for f in r:
    if only and f["flow"] not in only: continue
    print(f["flow"], f.get("title", ""), f.get("seconds"), (f.get("fatal") or "")[-500:])
    show(f.get("steps", []))
