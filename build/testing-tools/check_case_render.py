#!/usr/bin/env python3
"""Post-write render self-check for TestRail case fields (Standing rule, 2026-08-28).

After ANY add_case / update_case, run this against the C-IDs you touched. It fetches
each case LIVE and flags the formatting traps that make a case render badly for a manual
tester (proven live 2026-08-28, C27800):

  1. INLINE tags that show literally or unreliably: <b> <i> <u> <code> <br> <em> <strong>
  2. A "wall of text": prose paragraphs separated by a blank line but NOT split into
     block elements — TestRail wraps the whole value in one <p>, so those blank lines
     collapse and every paragraph runs together.
  3. No block structure at all in a multi-line field.

Exit code is non-zero if any case fails, so it can gate a commit / a push script.

Usage:  python3 build/testing-tools/check_case_render.py 27800 44804 45142
Creds:  /tmp/shopview-creds.env (Rule 82) or env vars TESTRAIL_API_KEY / CLAUDE_USERNAME.
Read-only: this script never writes to TestRail.
"""
import sys, os, re, ssl, json, base64, urllib.request, urllib.error

def creds():
    c = {}
    p = "/tmp/shopview-creds.env"
    if os.path.exists(p):
        for line in open(p):
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1); c[k] = v
    email = os.environ.get("TESTRAIL_EMAIL") or os.environ.get("CLAUDE_USERNAME") or c.get("CLAUDE_USERNAME")
    key = os.environ.get("TESTRAIL_API_KEY") or c.get("TESTRAIL_API_KEY")
    if not (email and key):
        sys.exit("no creds: set /tmp/shopview-creds.env or TESTRAIL_API_KEY / CLAUDE_USERNAME")
    return email, key

EMAIL, KEY = creds()
BASE = "https://shopview.testrail.io/index.php?/api/v2/"
CA = "/root/.ccr/ca-bundle.crt"
CTX = ssl.create_default_context(cafile=CA) if os.path.exists(CA) else ssl.create_default_context()

def get(path):
    r = urllib.request.Request(BASE + path)
    r.add_header("Authorization", "Basic " + base64.b64encode(f"{EMAIL}:{KEY}".encode()).decode())
    return json.loads(urllib.request.urlopen(r, context=CTX, timeout=60).read())

INLINE = re.compile(r"</?(b|i|u|em|strong|code|br|font|span)\b", re.I)
BLOCK = re.compile(r"<(p|ol|ul|li|hr|h[1-6]|table|blockquote)\b", re.I)

def check_field(name, val):
    problems = []
    if not val:
        return problems
    if INLINE.search(val):
        tags = sorted(set(m.group(0) for m in INLINE.finditer(val)))
        problems.append(f"{name}: inline tag(s) present {tags} — they render literally; use block tags only")
    # Strip block tags, then look for prose split by blank lines that never became blocks.
    # If the field has multiple non-empty text lines separated by a blank line but < 2 block tags,
    # it will collapse into a wall of text.
    text_lines = [l for l in val.replace("\r", "").split("\n") if l.strip()]
    blank_sep = bool(re.search(r"\S[^\n]*\n\s*\n\s*\S", val))
    nblocks = len(BLOCK.findall(val))
    if blank_sep and nblocks < 2 and len(text_lines) > 1:
        problems.append(f"{name}: blank-line-separated paragraphs with no block structure "
                        f"(only {nblocks} block tag) — TestRail will collapse these into one paragraph")
    if len(text_lines) > 1 and nblocks == 0:
        problems.append(f"{name}: multi-line content with no block tags — will not line-break")
    return problems

def main():
    ids = [a.lstrip("Cc") for a in sys.argv[1:]]
    if not ids:
        sys.exit("usage: check_case_render.py <C-ID> [<C-ID> ...]")
    failed = 0
    for cid in ids:
        try:
            c = get(f"get_case/{cid}")
        except urllib.error.HTTPError as e:
            print(f"C{cid}: FETCH ERROR HTTP {e.code}"); failed += 1; continue
        probs = []
        for f in ("custom_preconds", "custom_steps", "custom_expected"):
            probs += check_field(f, c.get(f))
        if probs:
            failed += 1
            print(f"C{cid}  ✗  \"{c.get('title','')[:70]}\"")
            for p in probs:
                print("      -", p)
        else:
            print(f"C{cid}  ✓  renders clean  \"{c.get('title','')[:60]}\"")
    if failed:
        print(f"\n{failed} case(s) FAILED the render self-check — fix formatting before continuing.")
        sys.exit(1)
    print(f"\nAll {len(ids)} case(s) passed the render self-check.")

if __name__ == "__main__":
    main()
