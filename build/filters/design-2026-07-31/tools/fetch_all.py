#!/usr/bin/env python3
"""Resumable Figma frame fetcher for the Filters design pass (Standing Rule 35).

Reads the canonical board list from ../frame-inventory.json, works out which
boards still have NO PNG in ../frames/, renders ONLY those, and downloads them.
Safe to run any number of times - already-downloaded boards are skipped.
Runnable from ANY working directory (all paths resolve off this file).

Usage
-----
    python3 build/filters/design-2026-07-31/tools/fetch_all.py
    python3 build/filters/design-2026-07-31/tools/fetch_all.py --scale 2 --batch 6
    python3 build/filters/design-2026-07-31/tools/fetch_all.py --once   # single try, no waiting

Exit codes
----------
    0 = every board in frame-inventory.json now has a PNG (85/85)
    2 = still short; a rate limit (HTTP 429) blocked the render
    3 = still short for some other reason (see output)

On a 429 the script prints - and (unless --no-log) appends to
../PENDING-FIGMA-FETCH.md - the UTC error timestamp, the fresh retry-after, and
re-arms DUE-AT = error time + 9 hours per Standing Rule 35.

The Figma token is read from /tmp/figma-token (secret - /tmp only, never committed).
"""
import argparse
import datetime
import json
import os
import re
import subprocess
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.dirname(HERE)                      # build/filters/design-2026-07-31
FRAMES = os.path.join(BASE, "frames")
INVENTORY = os.path.join(BASE, "frame-inventory.json")
URLCACHE = os.path.join(BASE, "imgurls.json")
QUEUE = os.path.join(BASE, "PENDING-FIGMA-FETCH.md")
TOKEN_PATH = "/tmp/figma-token"
FILE_KEY = "DR4gEODShYgJqkozs3mF5q"
DUE_HOURS = 9                                     # Standing Rule 35


def utcnow():
    return datetime.datetime.now(datetime.timezone.utc)


def stamp(dt):
    return dt.strftime("%Y-%m-%dT%H:%M:%SZ")


def have_png(board):
    p = os.path.join(FRAMES, board["file"])
    return os.path.exists(p) and os.path.getsize(p) > 1000


def download(board, urls):
    p = os.path.join(FRAMES, board["file"])
    if have_png(board):
        return True
    url = urls.get(board["id"])
    if not url:
        return False
    subprocess.run(["curl", "-sS", "-L", "-o", p, url],
                   capture_output=True, text=True, timeout=300)
    if not have_png(board):
        if os.path.exists(p):
            os.remove(p)
        return False
    return True


def render(ids, token, scale):
    """Ask Figma to render ids. Returns (urls, error_or_None, retry_after_or_None)."""
    r = subprocess.run(
        ["curl", "-sS", "-D", "/tmp/.figma-hdrs", "-H", f"X-Figma-Token: {token}",
         f"https://api.figma.com/v1/images/{FILE_KEY}"
         f"?ids={','.join(ids)}&format=png&scale={scale}"],
        capture_output=True, text=True, timeout=300)
    retry_after = None
    try:
        m = re.search(r"(?im)^retry-after:\s*(\d+)", open("/tmp/.figma-hdrs").read())
        if m:
            retry_after = int(m.group(1))
    except OSError:
        pass
    try:
        d = json.loads(r.stdout)
    except Exception:
        return {}, "unparseable response: " + r.stdout[:200], retry_after
    if d.get("err") or d.get("status") in (429, 403, 404):
        return {}, f"{d.get('status')} {d.get('err')}", retry_after
    return {k: v for k, v in (d.get("images") or {}).items() if v}, None, retry_after


def log_attempt(outcome, obtained, remaining, err_time, retry_after, due_at):
    """Append one row to the RETRY LOG table and re-arm DUE-AT in the queue file."""
    if not os.path.exists(QUEUE):
        return
    txt = open(QUEUE).read()
    # count existing attempt rows ONLY inside the RETRY LOG table (between the markers)
    seg = txt.split("<!-- RETRY-LOG-START -->")[-1].split("<!-- RETRY-LOG-END -->")[0]
    n = len(re.findall(r"(?m)^\|\s*\d+\s*\|", seg)) + 1
    row = (f"| {n} | {stamp(err_time)} | {outcome} | {obtained} | {remaining} | "
           f"{retry_after if retry_after is not None else '-'} | "
           f"{stamp(due_at) if due_at else 'n/a - COMPLETE'} |\n")
    txt = txt.replace("<!-- RETRY-LOG-END -->", row + "<!-- RETRY-LOG-END -->")
    if due_at:
        txt = re.sub(r"(?m)^\*\*DUE-AT \(re-attempt at or after this time\):\*\*.*$",
                     f"**DUE-AT (re-attempt at or after this time):** `{stamp(due_at)}` "
                     f"_(re-armed by attempt {n}: error {stamp(err_time)} + {DUE_HOURS}h)_",
                     txt)
    open(QUEUE, "w").write(txt)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--scale", default="2")
    ap.add_argument("--batch", type=int, default=6)
    ap.add_argument("--once", action="store_true",
                    help="one render attempt per batch, never sleep-and-retry")
    ap.add_argument("--no-log", action="store_true",
                    help="do not touch PENDING-FIGMA-FETCH.md")
    a = ap.parse_args()

    if not os.path.exists(TOKEN_PATH):
        print(f"MISSING TOKEN: {TOKEN_PATH} (secrets live in /tmp only - ask the user)")
        return 3
    token = open(TOKEN_PATH).read().strip()
    os.makedirs(FRAMES, exist_ok=True)
    inv = json.load(open(INVENTORY))
    urls = json.load(open(URLCACHE)) if os.path.exists(URLCACHE) else {}

    # 1. spend any render URLs we already hold (they expire, but cost nothing to try)
    for b in inv:
        download(b, urls)

    start_missing = [b for b in inv if not have_png(b)]
    print(f"inventory {len(inv)} boards | have {len(inv)-len(start_missing)} | "
          f"missing {len(start_missing)}", flush=True)
    if not start_missing:
        print(f"COMPLETE: {len(inv)}/{len(inv)} PNGs present.")
        if not a.no_log:
            log_attempt("already complete", 0, 0, utcnow(), None, None)
        return 0

    limited = False
    err_time = None
    retry_after = None
    todo = start_missing
    for i in range(0, len(todo), a.batch):
        batch = todo[i:i + a.batch]
        got_urls, err, ra = render([b["id"] for b in batch], token, a.scale)
        if err:
            print(f"  batch {i//a.batch+1}: RENDER FAILED -> {err} "
                  f"(retry-after={ra})", flush=True)
            if "429" in err or "Rate limit" in err:
                limited, err_time, retry_after = True, utcnow(), ra
                break                             # a hard cap - do not hammer it
            if a.once:
                continue
            time.sleep(20)
            got_urls, err, ra = render([b["id"] for b in batch], token, a.scale)
            if err:
                if "429" in err or "Rate limit" in err:
                    limited, err_time, retry_after = True, utcnow(), ra
                    break
                continue
        urls.update(got_urls)
        json.dump(urls, open(URLCACHE, "w"), indent=1)
        got = sum(1 for b in batch if download(b, urls))
        print(f"  batch {i//a.batch+1}/{-(-len(todo)//a.batch)}: "
              f"downloaded {got}/{len(batch)}", flush=True)
        if not a.once:
            time.sleep(5)

    still = [b for b in inv if not have_png(b)]
    obtained = len(start_missing) - len(still)
    print(f"\nRESULT: {len(inv)-len(still)}/{len(inv)} PNGs "
          f"(+{obtained} this run) | still missing {len(still)}")
    for b in still:
        print("  MISSING", b["id"], "|", b["name"], "|", b["path"])

    if not still:
        if not a.no_log:
            log_attempt("SUCCESS - all frames obtained", obtained, 0, utcnow(), None, None)
        print("\nQUEUE CAN BE CLOSED - all boards have PNGs. "
              "Update DESIGN-NOTES.md counts + frame-inventory.json png_source.")
        return 0

    due_at = None
    if limited:
        due_at = err_time + datetime.timedelta(hours=DUE_HOURS)
        print("\nRATE LIMITED (HTTP 429)")
        print(f"  error time (UTC): {stamp(err_time)}")
        print(f"  retry-after     : {retry_after}s "
              f"(~{round(retry_after/3600, 2) if retry_after else '?'}h)")
        print(f"  DUE-AT (Rule 35): {stamp(due_at)} = error time + {DUE_HOURS}h")
    if not a.no_log:
        log_attempt("HTTP 429 rate limit" if limited else "incomplete (non-429)",
                    obtained, len(still), err_time or utcnow(), retry_after, due_at)
    print(f"\nQUEUE STAYS OPEN: {QUEUE}")
    return 2 if limited else 3


if __name__ == "__main__":
    sys.exit(main())
