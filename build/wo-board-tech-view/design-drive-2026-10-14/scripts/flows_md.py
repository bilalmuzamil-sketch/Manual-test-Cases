#!/usr/bin/env python3
"""Render flows.json (flow_drive.py output) as the step-by-step evidence appendix of FLOWS-2026-10-14.md.
    python3 -I flows_md.py <flows.json> > evidence/flows-steps-2026-10-14.md"""
import json, sys
r = json.load(open(sys.argv[1]))


def clean(ts, n=12):
    out = []
    for t in ts:
        if t.startswith("[iframe]"):
            continue
        out.append(t.replace("|", "/"))
    return out[:n]


def show(steps, ind=""):
    for s in steps:
        if "sub" in s:
            print(f"{ind}- **{s['sub']}**"); show(s["steps"], ind + "  "); continue
        if "variant" in s:
            print(f"{ind}- **variant {s['variant']}**"); show(s["steps"], ind + "  "); continue
        if "check" in s:
            v = s["result"]
            print(f"{ind}  - check: {s['check']} → `{v if not isinstance(v, list) else v[1]}`"); continue
        fr = sum(1 for t in s["new_text"] if t.startswith("[iframe]"))
        err = f" — **step error:** {s['error'][:140]}" if s["error"] else ""
        print(f"{ind}- {s['n']}. {s['action']}{err} · new text ({s['new_count']}): {'; '.join(clean(s['new_text']))}"
              + (f" (+{fr} inside the embedded page)" if fr else "") + (f" · gone {s['gone_count']}" if s['gone_count'] else "")
              + (f" · shot `{s['shot']}`" if s.get("shot") else ""))


for f in r:
    print(f"\n### {f['flow']} — {f.get('title', '')} ({f.get('seconds')} s)\n")
    if f.get("fatal"):
        print("FATAL: " + f["fatal"][-400:])
    show(f.get("steps", []))
