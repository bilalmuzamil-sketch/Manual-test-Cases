"""Fetch the LIVE Confluence body of both specs, and their version numbers.

Standing Rule 31: the CONFLUENCE version number is authoritative; the version written
inside the page body is the documented trap (Schedule's in-body field reads "1.0").
Standing Rule 59: read them again immediately before the writes begin.
"""
import html, json, os, re, sys

ROOT = "/home/user/Manual-test-Cases"
sys.path.insert(0, f"{ROOT}/build/ticket-source-blocks-2026-08-06/tools")
import jiralib

OUT = f"{ROOT}/build/ticket-reformat-2026-08-06/filters-schedule/snapshots/specs"
os.makedirs(OUT, exist_ok=True)

PAGES = {"filters": "572030978", "schedule": "713031682"}


def strip(h):
    h = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", h, flags=re.S | re.I)
    h = re.sub(r"</(p|div|li|tr|h[1-6]|table)>", "\n", h, flags=re.I)
    h = re.sub(r"<br\s*/?>", "\n", h, flags=re.I)
    h = re.sub(r"</t[dh]>", " | ", h, flags=re.I)
    h = re.sub(r"<[^>]+>", "", h)
    h = html.unescape(h)
    h = re.sub(r"[ \t]+", " ", h)
    h = re.sub(r"\n{3,}", "\n\n", h)
    return h.strip()


if __name__ == "__main__":
    meta = {}
    for name, pid in PAGES.items():
        code, d = jiralib.get(
            f"/wiki/api/v2/pages/{pid}?body-format=storage",
            f"/tmp/_spec_{name}.json")
        if code != "200":
            print(name, "HTTP", code, str(d)[:300]); continue
        ver = (d.get("version") or {}).get("number")
        when = (d.get("version") or {}).get("createdAt")
        who = ((d.get("version") or {}).get("authorId"))
        body = ((d.get("body") or {}).get("storage") or {}).get("value", "")
        txt = strip(body)
        open(f"{OUT}/{name}-v{ver}.txt", "w").write(txt)
        open(f"{OUT}/{name}-v{ver}.storage.html", "w").write(body)
        inbody = re.search(r"Version[:\s|]*([0-9][0-9.]*)", txt)
        meta[name] = {"pageId": pid, "confluence_version": ver,
                      "version_created": when, "author_id": who,
                      "chars": len(txt),
                      "in_body_version_field": inbody.group(1) if inbody else None}
        print(f"{name:9} pageId={pid} CONFLUENCE VERSION={ver} "
              f"({when})  in-body 'Version' field={meta[name]['in_body_version_field']}  "
              f"{len(txt)} chars")
    json.dump(meta, open(f"{OUT}/versions.json", "w"), indent=1)
