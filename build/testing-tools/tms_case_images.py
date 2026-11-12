#!/usr/bin/env python3
"""Copy TestRail case pictures INTO TMS cases (TMS feature added by 2026-11-12: POST /projects/{id}/case-images).

Each TestRail attachment of a case is downloaded, uploaded to TMS as a case image, and shown in a block appended to the
TMS case's preconditions:
    <p><strong>Attached pictures</strong></p><p>name.png</p><p><img src="/api/v1/attachments/<id>" alt="name.png"></p>…
The expected result is never touched (Rule 113). Results are never touched: case images are not result attachments.
tms_sync.py ignores and preserves the block (PICTURES_HEAD = "<p><strong>Attached pictures").

Safe to re-run: every upload is recorded in build/tms/case-images-map.csv (TestRail attachment id -> TMS attachment id),
so a picture is never uploaded twice; a case whose preconditions already show TMS pictures is skipped. A case that still
carries the older TestRail-LINK list (tms_picture_links.py) has that list REPLACED by the embedded pictures.
`--skip-with-results` skips any case with a result in any TMS run.

    python3 tms_case_images.py --section 136701                 # dry run
    python3 tms_case_images.py --section 136701 --apply
"""
import argparse
import collections
import csv
import html
import json
import os
import sys

import requests

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import load_creds  # noqa: E402
from tms_client import TMS  # noqa: E402
from tms_sync import PICTURES_HEAD, TestRail, id_map, split_pictures  # noqa: E402

MAP = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "tms", "case-images-map.csv")
EMBEDDED = "/api/v1/attachments/"


def uploaded():
    try:
        return {int(r["testrail_attachment_id"]): int(r["tms_attachment_id"]) for r in csv.DictReader(open(MAP))}
    except OSError:
        return {}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--section", type=int, required=True)
    ap.add_argument("--apply", action="store_true")
    ap.add_argument("--skip-with-results", action="store_true")
    a = ap.parse_args()
    tr, tms, cmap, done = TestRail(), TMS(), id_map(), uploaded()
    tms.log_path = "/tmp/tms/case-images-ops.jsonl"
    base = load_creds.testrail_host() + "/index.php?/api/v2/"
    auth = load_creds.testrail_creds()
    with_results = set()
    if a.skip_with_results:
        for r in tms.get_all("/projects/1/runs"):
            with_results |= {i["case_id"] for i in tms.get_all("/runs/%d/items" % r["id"]) if i.get("latest_result")}
    sub, _ = tr.subtree(a.section)
    todo, skipped = [], collections.Counter()
    for sid in sub:
        for c in tr.paged("get_cases/1&suite_id=1&section_id=%d" % sid, "cases"):
            atts = tr.get("get_attachments_for_case/%d" % c["id"])
            atts = atts.get("attachments", atts) if isinstance(atts, dict) else atts
            if not atts:
                continue
            tid = cmap.get(c["id"], c["id"])
            if tid in with_results:
                skipped["has a result in a TMS run"] += 1
                continue
            code, d = tms.call("GET", "/cases/%d" % tid)
            if code != 200:
                skipped["not in TMS"] += 1
                continue
            cur = (d or {}).get("data", d)
            if EMBEDDED in (cur.get("preconditions") or ""):
                skipped["already shows TMS pictures"] += 1
                continue
            uniq = collections.OrderedDict()
            for x in atts:
                uniq.setdefault(x["id"], x["name"])
            todo.append((c["id"], tid, uniq, cur))
    n_pics = sum(len(u) for _, _, u, _ in todo)
    print("cases to give pictures: %d (%d pictures) | skipped: %s" % (len(todo), n_pics, dict(skipped)))
    if not a.apply:
        return 0
    ok_cases, bad = 0, []
    fh = open(MAP, "a", newline="")
    w = csv.writer(fh)
    if os.path.getsize(MAP) == 0:
        w.writerow(["testrail_attachment_id", "tms_attachment_id", "filename"])
    for cid, tid, uniq, cur in todo:
        parts = []
        try:
            for aid, name in uniq.items():
                if aid not in done:
                    q = requests.get(base + "get_attachment/%d" % aid, auth=auth, timeout=120)
                    q.raise_for_status()
                    mime = q.headers.get("content-type", "image/png").split(";")[0]
                    r = tms.s.post(tms.base + "/projects/1/case-images", files={"file": (name, q.content, mime)}, timeout=120)
                    if r.status_code != 201:
                        raise RuntimeError("upload %s -> %s %s" % (name, r.status_code, r.text[:200]))
                    j = r.json()
                    j = j.get("data", j)
                    done[aid] = j["id"]
                    w.writerow([aid, j["id"], name])
                    fh.flush()
                    tms.log("upload_case_image", tid, 201, "%s -> %s" % (name, j["id"]))
                parts.append('<p>%s</p><p><img src="%s%d" alt="%s"></p>' % (html.escape(name), EMBEDDED, done[aid], html.escape(name)))
        except Exception as e:  # noqa: BLE001 - report and move on; the case is left untouched
            bad.append((cid, str(e)[:120]))
            continue
        text = split_pictures(cur.get("preconditions"))[0]  # replaces an older TestRail-link list, if any
        block = "<p><strong>Attached pictures</strong></p>" + "".join(parts)
        code, _ = tms.update_case(tid, {"preconditions": text + block})
        g = tms.case(tid)
        g = g.get("data", g)
        ok = code == 200 and (g.get("preconditions") or "").count(EMBEDDED) >= len(uniq) and g.get("expected") == cur.get("expected")
        tms.log("embed_case_images", tid, code, "OK" if ok else "MISMATCH")
        ok_cases += ok
        if not ok:
            bad.append((cid, "read-back"))
    fh.close()
    print("cases done %d/%d | problems: %s" % (ok_cases, len(todo), bad[:15] or "none"))
    return 0 if not bad else 1


if __name__ == "__main__":
    sys.exit(main())
