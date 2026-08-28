#!/usr/bin/env python3
"""Post-write render self-check for TestRail case fields (Standing rule, 2026-08-28).

After ANY add_case / update_case, run this against the C-IDs you touched. It fetches
each case LIVE and flags the formatting traps that make a case render badly for a manual
tester (proven live 2026-08-28, C27800):

  1. STYLING inline tags that show literally: <b> <i> <u> <code> <em> <strong> <font> <span>.
  2. A "wall of text": prose paragraphs separated by a blank line but NOT split into
     block elements — TestRail wraps the whole value in one <p>, so those blank lines
     collapse and every paragraph runs together.
  3. No block structure at all in a multi-line field.

WARNING (reported, does NOT fail the check):
  * <br> — renders when added via the TestRail UI editor, but shows LITERALLY when written
    via the API. Since our scripts write via the API, do NOT emit <br> in an API payload.
    Put each line in its own <p>, or use a <ul><li> list. A <br> seen live is usually a
    human's UI edit (fine, leave it) — but never generate one from a script.

The ONLY tags proven to render when written via the API are BLOCK tags:
  <p>  <ol>/<ul> + <li>  <hr>.  Use only those.

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

# STYLING inline tags show literally when written via the API -> hard fail.
INLINE = re.compile(r"</?(b|i|u|em|strong|code|font|span)\b", re.I)
# <br> renders from a UI edit but shows literally from an API write -> WARN, not fail.
BR = re.compile(r"<br\b", re.I)
# Block tags that DO render via the API. (<br> counts as structure for the wall-of-text test,
# even though we warn on it, so a UI-edited <br> field is not double-reported as a wall.)
BLOCK = re.compile(r"<(p|ol|ul|li|hr|br|h[1-6]|table|blockquote)\b", re.I)

def check_field(name, val):
    """Return (problems, warnings). problems fail the check; warnings are reported only."""
    problems = []; warnings = []
    if not val:
        return problems, warnings
    if INLINE.search(val):
        tags = sorted(set(m.group(0) for m in INLINE.finditer(val)))
        problems.append(f"{name}: styling inline tag(s) {tags} — render literally; use block tags only")
    if BR.search(val):
        warnings.append(f"{name}: <br> present — renders from a UI edit but shows LITERALLY from an "
                        f"API write; never emit <br> from a script (use separate <p> or <ul><li>)")
    # Prose split by blank lines that never became blocks collapses into one paragraph.
    text_lines = [l for l in val.replace("\r", "").split("\n") if l.strip()]
    blank_sep = bool(re.search(r"\S[^\n]*\n\s*\n\s*\S", val))
    nblocks = len(BLOCK.findall(val))
    if blank_sep and nblocks < 2 and len(text_lines) > 1:
        problems.append(f"{name}: blank-line-separated paragraphs with no block structure "
                        f"(only {nblocks} block tag) — TestRail will collapse these into one paragraph")
    if len(text_lines) > 1 and nblocks == 0:
        problems.append(f"{name}: multi-line content with no block tags — will not line-break")
    return problems, warnings

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
        probs = []; warns = []
        for f in ("custom_preconds", "custom_steps", "custom_expected"):
            p, w = check_field(f, c.get(f)); probs += p; warns += w
        if probs:
            failed += 1
            print(f"C{cid}  ✗  \"{c.get('title','')[:70]}\"")
            for p in probs: print("      -", p)
            for w in warns: print("      ! (warn)", w)
        else:
            mark = "✓  renders clean" if not warns else "✓  renders (with warnings)"
            print(f"C{cid}  {mark}  \"{c.get('title','')[:60]}\"")
            for w in warns: print("      ! (warn)", w)
    if failed:
        print(f"\n{failed} case(s) FAILED the render self-check — fix formatting before continuing.")
        sys.exit(1)
    print(f"\nAll {len(ids)} case(s) passed the render self-check.")

if __name__ == "__main__":
    main()
