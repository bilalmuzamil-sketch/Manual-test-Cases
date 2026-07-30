#!/usr/bin/env python3
"""
reverse_coverage_diff.py - READ-ONLY TestRail checker. The REVERSE half of
build/testrail-foreign-cases-2026-07-31/foreign_overlap_check.py.

WHY THIS EXISTS (plain English)
  The original checker answers "which of THEIR cases duplicate OURS?" - it finds
  OVERLAP. It cannot find the thing that actually hurt us on 2026-07-31: an
  assertion in someone else's case that has NO counterpart anywhere in ours.
  That is a COVERAGE SIGNAL, not a nuisance. Vladimir Tomovic's C38923 asserted a
  Location column in the SBR CSV exports; no case of ours asserted it, and two of
  ours actively denied it. This script is the mechanical detector for that shape.

WHAT IT DOES
  1. Pulls every live case under the TestRail group(s) you name (get_* only).
  2. Splits them OURS vs FOREIGN by `created_by`, resolving ids via get_user/{id}.
  3. Breaks each FOREIGN case into ASSERTION UNITS (per step content / expected /
     preconds, split into sentences) - not whole-case blobs, because a single
     foreign case routinely mixes one assertion we cover with one we do not.
  4. For each unit it builds a SIGNATURE: the unit's highest-IDF (most
     discriminative) tokens, measured against OUR OWN corpus. Then it asks the
     only question that matters:
         Does ANY case of ours contain ALL of the signature tokens?
     - yes                          -> COVERED-BY (lists the case ids)
     - no, and a shared-topic case
       of ours carries a closed-list
       or negation marker           -> CONTRADICTS-OURS
     - no                           -> CANDIDATE GAP, and it NAMES THE MISSING
                                       TOKEN(S) - e.g. "no case of ours contains
                                       'location' together with 'csv'+'header'"
  5. Rolls a per-case verdict up from its units (worst wins) and writes
     markdown + CSV + JSON.

WHAT IT DOES NOT DO
  * It NEVER writes to TestRail. There is no POST code path in this file at all.
  * It does NOT touch, retitle, re-ref, move or delete anyone's cases (Rule 38).
  * It does NOT decide. It produces a verdict-ready table; a human reads both
    cases and rules. A CANDIDATE GAP is a question for the QA lead, never a
    licence to author or push (Rule 6).

HONESTY / KNOWN LIMITS (state these when quoting the output)
  * Lexical, not semantic. A gap phrased in words we happen to use elsewhere can
    read as COVERED-BY (false clear); a synonym can read as a gap (false alarm).
    Every verdict must be eyeballed. The signature tokens are printed precisely so
    a human can judge the match in one glance.
  * It compares against TestRail's LIVE case text, not the local JSON sources.
  * It proves nothing about the running build (Rule 12) - only about what is
    written down on each side.

USAGE
  source /tmp/tr-creds.env          # TESTRAIL_USER + TESTRAIL_KEY - never committed
  python3 reverse_coverage_diff.py --group 4281 --group 4110 --group 4254 \
          --md OUT.md --csv OUT.csv --json OUT.json

  Options: --sig-size 4 (signature token count) --project 1 --suite 1
           --ours-uid 3            (default: resolved from $TESTRAIL_USER)
           --scope-to-section      (only compare against OUR cases in the same
                                    top-level report/folder as the foreign case)
           --cache-dir /tmp/trrcd  --refresh

GROUP IDS in this workspace: Report Suite 4281 | Filters 4110 | Schedule 4254
"""

import argparse
import base64
import collections
import csv
import json
import math
import os
import re
import sys
import time
import urllib.request

HOST = os.environ.get("TESTRAIL_HOST", "https://shopview.testrail.io")

# ------------------------------------------------------------ API (read-only)


def auth():
    user, key = os.environ.get("TESTRAIL_USER"), os.environ.get("TESTRAIL_KEY")
    if not user or not key:
        sys.exit("ERROR: source your TestRail creds first (TESTRAIL_USER / "
                 "TESTRAIL_KEY). Creds live in /tmp only - never commit them.")
    token = base64.b64encode(f"{user}:{key}".encode()).decode()
    return user, {"Authorization": "Basic " + token, "Content-Type": "application/json"}


def api_get(path, headers, retries=5):
    """GET only. The ONLY network call in this file."""
    url = f"{HOST}/index.php?/api/v2/{path}"
    last = None
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers=headers)  # no data= -> GET
            with urllib.request.urlopen(req, timeout=90) as resp:
                return json.load(resp)
        except Exception as exc:  # noqa: BLE001 transient 5xx/timeouts happen
            last = exc
            time.sleep(2 ** attempt)
    raise RuntimeError(f"GET {path} failed after {retries} tries: {last}")


def api_paged(path, key, headers):
    out, offset = [], 0
    while True:
        sep = "&" if "?" in path else "?"
        data = api_get(f"{path}{sep}limit=250&offset={offset}", headers)
        chunk = data.get(key, data) if isinstance(data, dict) else data
        out.extend(chunk)
        if isinstance(data, dict) and data.get("_links", {}).get("next"):
            offset += 250
            continue
        if len(chunk) < 250:
            return out
        offset += 250


def resolve_user(uid, headers, cache={}):
    """get_users is admin-only for our account; get_user/{id} works."""
    if uid in cache:
        return cache[uid]
    try:
        cache[uid] = api_get(f"get_user/{uid}", headers).get("name") or f"user {uid}"
    except Exception:
        cache[uid] = f"user {uid} (name unavailable)"
    return cache[uid]


# ------------------------------------------------------------ text handling

STOP = set("""a an and are as at be been being but by can could did do does for from had has have
he her his how if in into is it its of on once only or other our ours out over she should so some
such than that the their them then there these they this those to too under until up was were what
when where which while who why will with within would you your not no all any each one two both
same just also shall may might must then there upon per via across after before again still yet
case test step steps verify verifies check checks confirm confirms ensure ensures assert asserts
open opens click clicks select selects given when-then screen page view user users report reports
value values shows show shown display displays displayed appear appears appearing present""".split())

NEGATION = re.compile(
    r"\b(not|never|no|none|without|absent|hidden|excluded|omitted|cannot|"
    r"exactly|only these|no other|nothing else|is not offered|does not)\b", re.I)


def case_text(case):
    """Everything a tester would read: the ASSERTION, not just the title."""
    parts = [case.get("title") or ""]
    for f in ("custom_preconds", "custom_steps", "custom_expected",
              "custom_mission", "custom_goals"):
        if case.get(f):
            parts.append(str(case[f]))
    for step in case.get("custom_steps_separated") or []:
        for f in ("content", "expected", "additional_info"):
            if step.get(f):
                parts.append(str(step[f]))
    return "\n".join(parts)


def assertion_units(case):
    """Split a case into the individual claims it makes.

    One foreign case routinely mixes an assertion we cover with one we do not
    (C38921 is exactly that shape), so whole-case matching hides gaps. We split
    per field, per step, then per sentence.
    """
    raw = []
    for f in ("custom_preconds", "custom_steps", "custom_expected",
              "custom_mission", "custom_goals"):
        if case.get(f):
            raw.append((f, str(case[f])))
    for i, step in enumerate(case.get("custom_steps_separated") or [], 1):
        for f in ("content", "expected", "additional_info"):
            if step.get(f):
                raw.append((f"step{i}.{f}", str(step[f])))
    if not raw:  # steps-only cases with everything in the title
        raw.append(("title", case.get("title") or ""))

    units = []
    for where, blob in raw:
        blob = re.sub(r"\r", "", blob)
        for chunk in re.split(r"(?<=[.;:!?])\s+|\n+|(?:^|\s)[-*•]\s+", blob):
            chunk = re.sub(r"\s+", " ", (chunk or "")).strip(" -*•\t")
            if len(tokens(chunk)) >= 3:
                units.append((where, chunk))
    return units


def normalise(text):
    text = re.sub(r"https?://\S+", " ", (text or "").lower())
    text = re.sub(r"[^a-z0-9%$.\s]", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def tokens(text):
    return {t.rstrip(".") for t in normalise(text).split()
            if t.rstrip(".") not in STOP and len(t.rstrip(".")) > 2}


def build_idf(our_cases):
    """IDF over OUR corpus: a token in few of our cases is discriminative."""
    n = max(1, len(our_cases))
    df = collections.Counter()
    for c in our_cases:
        for t in tokens(case_text(c)):
            df[t] += 1
    return {t: math.log((n + 1) / (d + 1)) + 1.0 for t, d in df.items()}, df, n


def signature(unit_text, idf, size):
    """The unit's most discriminative tokens, measured against OUR corpus.

    Tokens ABSENT from our corpus get the maximum weight - that is precisely the
    interesting case ("no case of ours ever uses this word").
    """
    maxw = (max(idf.values()) + 1.0) if idf else 2.0
    scored = sorted(tokens(unit_text), key=lambda t: (-idf.get(t, maxw), t))
    return scored[:size]


# ------------------------------------------------------------ sections

def descendants(section_id, sections):
    ids, changed = {section_id}, True
    while changed:
        changed = False
        for s in sections:
            if s["parent_id"] in ids and s["id"] not in ids:
                ids.add(s["id"])
                changed = True
    return ids


def section_path(sid, by_id):
    parts = []
    while sid in by_id:
        parts.append(by_id[sid]["name"])
        sid = by_id[sid]["parent_id"]
    return " > ".join(reversed(parts))


def top_folder(sid, by_id, group_id):
    """The report/area folder directly under the group - used by --scope-to-section."""
    chain = []
    while sid in by_id:
        chain.append(sid)
        sid = by_id[sid]["parent_id"]
    chain.append(sid)
    if group_id in chain:
        i = chain.index(group_id)
        return chain[i - 1] if i > 0 else group_id
    return chain[0] if chain else group_id


# ------------------------------------------------------------ the reverse diff

COVERED, GAP, CONTRA = "COVERED-BY", "CANDIDATE GAP", "CONTRADICTS-OURS"


def diff_unit(unit_text, sig, our_index, our_tokens_by_id):
    """The whole question in one function: does ANY case of ours assert all of this?"""
    if not sig:
        return COVERED, [], [], "no discriminative tokens - nothing to test"

    sets = [our_index.get(t, set()) for t in sig]
    full = set.intersection(*sets) if all(sets) else set()
    if full:
        return COVERED, sorted(full)[:6], [], f"all of {sig} co-occur in a case of ours"

    # Which token is the one nobody of ours ever pairs with the rest?
    best_missing, best_hits = None, set()
    for drop in range(len(sig)):
        kept = [t for i, t in enumerate(sig) if i != drop]
        hits = set.intersection(*[our_index.get(t, set()) for t in kept]) if kept and all(
                our_index.get(t) for t in kept) else set()
        if len(hits) > len(best_hits) or best_missing is None:
            best_missing, best_hits = sig[drop], hits

    ut = tokens(unit_text)
    contra = []
    for cid in list(best_hits)[:40]:
        their, txt = our_tokens_by_id[cid]
        if len(ut & their) >= max(2, len(ut) // 3) and NEGATION.search(txt):
            contra.append(cid)
    if contra:
        return (CONTRA, sorted(contra)[:6], [best_missing],
                f"our case(s) share the topic but carry a closed-list/negation marker, "
                f"and never mention '{best_missing}'")
    return (GAP, sorted(best_hits)[:6], [best_missing],
            f"no case of ours contains '{best_missing}' together with "
            f"{[t for t in sig if t != best_missing]}")


def main():
    ap = argparse.ArgumentParser(
        description="READ-ONLY reverse coverage diff: foreign assertions with no counterpart in ours.")
    ap.add_argument("--group", action="append", type=int, required=True,
                    help="Top-level TestRail section id (repeatable). 4281=Report Suite 4110=Filters 4254=Schedule")
    ap.add_argument("--project", type=int, default=1)
    ap.add_argument("--suite", type=int, default=1)
    ap.add_argument("--ours-uid", type=int, default=None)
    ap.add_argument("--sig-size", type=int, default=4)
    ap.add_argument("--scope-to-section", action="store_true",
                    help="Compare only against OUR cases in the same top-level folder")
    ap.add_argument("--md"), ap.add_argument("--csv"), ap.add_argument("--json")
    ap.add_argument("--cache-dir", default="/tmp/trrcd")
    ap.add_argument("--refresh", action="store_true")
    args = ap.parse_args()

    email, headers = auth()
    os.makedirs(args.cache_dir, exist_ok=True)

    def cached(name, fn):
        path = os.path.join(args.cache_dir, name)
        if os.path.exists(path) and not args.refresh:
            with open(path) as fh:
                return json.load(fh)
        data = fn()
        with open(path, "w") as fh:
            json.dump(data, fh)
        return data

    sections = cached(f"sections-{args.project}-{args.suite}.json",
                      lambda: api_paged(f"get_sections/{args.project}&suite_id={args.suite}",
                                        "sections", headers))
    all_cases = cached(f"cases-{args.project}-{args.suite}.json",
                       lambda: api_paged(f"get_cases/{args.project}&suite_id={args.suite}",
                                         "cases", headers))
    by_id = {s["id"]: s for s in sections}

    ours_uid = args.ours_uid
    if ours_uid is None:  # resolve OUR uid from the account we authenticated as
        for uid in range(1, 12):
            if resolve_user(uid, headers).lower().split()[0] in email.lower():
                ours_uid = uid
                break
    if ours_uid is None:
        sys.exit("ERROR: could not resolve OUR user id - pass --ours-uid explicitly.")

    report, results = [], []
    for group in args.group:
        ids = descendants(group, sections)
        cases = [c for c in all_cases if c["section_id"] in ids]
        ours = [c for c in cases if c.get("created_by") == ours_uid]
        foreign = [c for c in cases if c.get("created_by") != ours_uid]

        authors = collections.Counter(
            resolve_user(c.get("created_by"), headers) for c in foreign)
        head = {"group": group, "group_name": by_id.get(group, {}).get("name", str(group)),
                "live_total": len(cases), "ours": len(ours), "foreign": len(foreign),
                "foreign_authors": dict(authors)}
        report.append(head)
        print(f"\n=== group {group} '{head['group_name']}': live {len(cases)} "
              f"= ours {len(ours)} + foreign {len(foreign)} {dict(authors)}", flush=True)
        if not foreign:
            continue

        idf, _, _ = build_idf(ours)
        for c in foreign:
            pool = ours
            if args.scope_to_section:
                tf = top_folder(c["section_id"], by_id, group)
                pool = [o for o in ours if top_folder(o["section_id"], by_id, group) == tf] or ours
            index = collections.defaultdict(set)
            tok_by_id = {}
            for o in pool:
                txt = case_text(o)
                tk = tokens(txt)
                tok_by_id[o["id"]] = (tk, normalise(txt))
                for t in tk:
                    index[t].add(o["id"])

            units = assertion_units(c)
            urows, worst = [], COVERED
            for where, text in units:
                sig = signature(text, idf, args.sig_size)
                verdict, hits, missing, why = diff_unit(text, sig, index, tok_by_id)
                if verdict == CONTRA or (verdict == GAP and worst != CONTRA):
                    worst = verdict
                urows.append({"where": where, "assertion": text, "signature": sig,
                              "verdict": verdict, "our_cases": hits,
                              "missing_token": missing, "why": why})
            results.append({
                "group": group, "case_id": c["id"], "title": c.get("title"),
                "section": section_path(c["section_id"], by_id),
                "author": resolve_user(c.get("created_by"), headers),
                "refs": c.get("refs"), "case_verdict": worst, "units": urows})
            print(f"  C{c['id']} [{worst}] {c.get('title')[:70]}  "
                  f"({sum(1 for u in urows if u['verdict']==GAP)} gap / "
                  f"{sum(1 for u in urows if u['verdict']==CONTRA)} contra of {len(urows)} units)",
                  flush=True)

    if args.json:
        with open(args.json, "w") as fh:
            json.dump({"generated": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                       "ours_uid": ours_uid, "groups": report, "cases": results}, fh, indent=2)
    if args.csv:
        with open(args.csv, "w", newline="") as fh:
            w = csv.writer(fh)
            w.writerow(["group", "foreign_case", "author", "section", "case_verdict",
                        "unit_where", "unit_verdict", "signature", "missing_token",
                        "our_cases", "why", "assertion"])
            for r in results:
                for u in r["units"]:
                    w.writerow([r["group"], f"C{r['case_id']}", r["author"], r["section"],
                                r["case_verdict"], u["where"], u["verdict"],
                                " ".join(u["signature"]), " ".join(u["missing_token"]),
                                " ".join(f"C{i}" for i in u["our_cases"]), u["why"],
                                u["assertion"][:400]])
    if args.md:
        with open(args.md, "w") as fh:
            fh.write("# Reverse coverage diff - foreign assertions vs OUR suite\n\n")
            fh.write(f"**Generated:** {time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())} · "
                     f"**READ-ONLY** (get_* only, zero writes) · **OURS = user id "
                     f"{ours_uid}**\n\n")
            fh.write("| Group | Name | Live total | Ours | Foreign | Foreign authors |\n|---|---|---|---|---|---|\n")
            for h in report:
                fh.write(f"| {h['group']} | {h['group_name']} | {h['live_total']} | {h['ours']} | "
                         f"{h['foreign']} | {h['foreign_authors'] or '-'} |\n")
            for r in results:
                fh.write(f"\n## C{r['case_id']} - {r['case_verdict']}\n\n"
                         f"*{r['title']}*  \nSection: {r['section']}  \n"
                         f"Author: **{r['author']}** · refs: `{r['refs'] or 'None'}` · "
                         f"[open](https://shopview.testrail.io/index.php?/cases/view/{r['case_id']})\n\n")
                fh.write("| # | Verdict | Signature | Missing | Our nearest | Assertion |\n|---|---|---|---|---|---|\n")
                for i, u in enumerate(r["units"], 1):
                    fh.write(f"| {i} | {u['verdict']} | `{' '.join(u['signature'])}` | "
                             f"`{' '.join(u['missing_token']) or '-'}` | "
                             f"{' '.join('C'+str(x) for x in u['our_cases']) or '-'} | "
                             f"{u['assertion'][:220].replace('|','/')} |\n")
    tot = collections.Counter(r["case_verdict"] for r in results)
    print(f"\nFOREIGN CASES: {len(results)}  ->  {dict(tot)}")
    print("Reminder: CANDIDATE GAP = a question for the QA lead. Author nothing, push "
          "nothing, and never touch a foreign case (Rules 6 / 38).")


if __name__ == "__main__":
    main()
