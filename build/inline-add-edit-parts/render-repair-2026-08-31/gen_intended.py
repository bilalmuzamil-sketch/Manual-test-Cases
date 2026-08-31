# -*- coding: utf-8 -*-
"""Derive the INTENDED readable content (blocks + text) for every Inline Add and Edit
Parts case, keyed by C-ID, for the UI render-repair.

Reuses the proven report-suite (damage-2026-08-26) block schema (Rule 27):
  - preconds : ONE block, each precondition as a literal-numbered line "N. ..." (soft breaks)
  - steps    : ONE block, each step as a literal-numbered line "N. ..." (soft breaks)
  - expected : block1 = numbered body lines (already numbered in the JSON),
               block2 = ["---", <provenance sentence(s)>],
               block3 = [<AUTOMATION marker line>]  (must remain LAST)

"blocks" = list of paragraphs; each paragraph = list of lines. In the editor:
Enter => new paragraph (<p>), Shift+Enter => soft line break (<br>). "text" is the
expected rendered innerText: lines joined by \n within a paragraph, "\n\n" between paragraphs.
This is the clean readable content the tester should see once the container is fr-view.
"""
import csv, json, glob, re, os

DIR = os.path.dirname(os.path.abspath(__file__))
ROOT = "/home/user/Manual-test-Cases"


def blocks_text(blocks):
    return "\n\n".join("\n".join(b) for b in blocks)


def numbered(items):
    """A list -> a single block of literal-numbered lines."""
    return [f"{i+1}. {str(x).strip()}" for i, x in enumerate(items) if str(x).strip()]


def expected_blocks(exp):
    parts = re.split(r'\n\s*---\s*\n', exp, maxsplit=1)
    body = [l.strip() for l in parts[0].split('\n') if l.strip()]   # keep literal "N." numbers
    blocks = [body]
    if len(parts) > 1 and parts[1].strip():
        tail = parts[1].strip()
        paras = re.split(r'\n\s*\n', tail)          # provenance para(s) ... AUTOMATION last
        auto = paras[-1].strip()
        prov = paras[:-1]
        prov_lines = ["---"]
        for p in prov:
            prov_lines += [l.strip() for l in p.split('\n') if l.strip()]
        blocks.append(prov_lines)
        blocks.append([auto])
    return blocks


def main():
    rows = list(csv.DictReader(open(f"{ROOT}/build/inline-add-edit-parts/testrail-id-map.csv")))
    iid2cid = {}
    for r in rows:
        cid = (r['testrail_case_id'] or '').strip().lstrip('C')
        if cid:
            iid2cid[r['internal_id']] = int(cid)

    cases = []
    for f in sorted(glob.glob(f"{ROOT}/build/inline-add-edit-parts/cases/cases-*.json")):
        cases += json.load(open(f))

    out = {}
    for c in cases:
        cid = iid2cid.get(c['id'])
        if not cid:
            continue
        pre = [numbered(c.get('preconditions') or [])]
        stp = [numbered(c.get('steps') or [])]
        exp = expected_blocks(c['expected'])
        rec = {"title": c['title'], "iid": c['id'], "fields": {}}
        rec["fields"]["custom_preconds"] = {"blocks": pre, "text": blocks_text(pre)}
        rec["fields"]["custom_steps"] = {"blocks": stp, "text": blocks_text(stp)}
        rec["fields"]["custom_expected"] = {"blocks": exp, "text": blocks_text(exp)}
        out[str(cid)] = rec

    with open(f"{DIR}/intended-blocks.json", "w") as f:
        json.dump(out, f, indent=1, ensure_ascii=False)
    print("cases:", len(out))
    # sanity: every expected ends with AUTOMATION
    bad = [k for k, v in out.items() if not v['fields']['custom_expected']['blocks'][-1][-1].startswith('AUTOMATION:')]
    print("expected NOT ending in AUTOMATION:", bad)
    # show one sample
    k = sorted(out, key=int)[0]
    print("sample", k, json.dumps(out[k], ensure_ascii=False)[:600])


if __name__ == '__main__':
    main()
