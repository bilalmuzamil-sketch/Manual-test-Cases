#!/usr/bin/env python3
"""Generate /tmp/secret-fingerprints.json so scan_secrets.py runs in FULL mode.

WHY THIS EXISTS
---------------
`scan_secrets.py` has two modes. Without a fingerprint file it matches STRUCTURAL
patterns only -- "this looks like a 64-hex session cookie". With one it ALSO matches
the SHA-256 of the actual secret values we hold in /tmp, so a real credential is
caught even when it does not look like anything (a short password, a hand-typed
key, a value split across a line). The scanner ships its own `--build-fingerprints`;
this tool is the wider harvester: it reads the credential shapes this workspace
actually keeps (`/tmp/staging-cookie.txt`, `/tmp/testrail/creds.json`,
`/tmp/figma-token`, `/tmp/qa-cookies/*.txt`, `Cookie:` header files, `.hdrs` files)
which the scanner's narrower glob list misses -- `/tmp/rs-cookie.txt` and
`/tmp/qa-cookies/reports-cookie-header.txt` are both missed by `cookie*.txt`.

THE OUTPUT FORMAT IS NOT INVENTED. It is exactly what `scan_secrets.load_fingerprints()`
reads: {"sha256": [<hex>, ...], "note": "..."}. Verified against
`build/testing-tools/scan_secrets.py` (FINGERPRINT_FILE, load_fingerprints,
build_fingerprints) before writing a line of this file.

/tmp ONLY -- AND THE REASON IS NOT SQUEAMISHNESS
------------------------------------------------
Neither the raw values NOR their hashes may enter this repository. The repo is
PUBLIC, and a SHA-256 of a short or low-entropy secret (a password, a 6-digit OTP)
is brute-forceable offline in seconds -- an unsalted hash of a weak secret IS the
secret. So this tool REFUSES any output path outside /tmp, reads only from /tmp,
and `secret-fingerprints.json` is in .gitignore as a second line of defence.

USAGE
    python3 make_secret_fingerprints.py                 # harvest /tmp -> /tmp/secret-fingerprints.json
    python3 make_secret_fingerprints.py --dry-run       # show counts, write nothing
    python3 make_secret_fingerprints.py --selftest      # prove detection + the /tmp refusal
    python3 make_secret_fingerprints.py --verify        # after writing, scan the repo in full mode

WHAT IS DELIBERATELY NOT FINGERPRINTED
    - anything shorter than 12 chars, or Shannon entropy < 3.0 (prose, repeated
      characters) -- EXCEPT a value read from an explicit `password:`/`token:` key in
      a credential file, which is known to be a secret and so gets a lower bar (8
      chars, entropy 2.0). Without that exception the TestRail and Atlassian
      passwords, both under 12 characters, are silently NOT fingerprinted -- and a
      short password matches no structural pattern either, so it would be invisible
      in both modes. That was measured, not assumed: both creds.json files yielded
      zero fingerprints on the first real run.
    - hostnames, and bare cookie NAMES (`sv_sso_session`, `phpsessid`)
    - Atlassian accountIds (`7120xx:...`, raw or %3A-encoded) -- these are PUBLIC
      identifiers that appear in profile URLs and in every Jira snapshot we commit;
      fingerprinting one turns the scanner into a firehose
    - git object ids, ETag/last-modified values and build markers, which appear all
      over the repo by design
These exclusions are the same ones `scan_secrets.build_fingerprints()` applies, plus
the build-marker one, and they are the difference between a useful scanner and one
that everybody learns to ignore.
"""

import argparse
import glob
import hashlib
import json
import math
import os
import re
import subprocess
import sys
import tempfile
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))
SCANNER = os.path.join(HERE, "scan_secrets.py")

# The exact path scan_secrets.py reads (its FINGERPRINT_FILE constant).
DEFAULT_OUT = "/tmp/secret-fingerprints.json"

MIN_LEN = 12
MIN_ENTROPY = 3.0

# A value read from an explicit `password:` / `token:` key in a credential file is
# unambiguously a secret, so it earns a lower bar than a token scraped out of loose
# text. Without this, the TestRail and Atlassian passwords -- both shorter than 12
# characters -- are silently NOT fingerprinted, which is exactly the leak the full
# mode exists to catch (a short password matches no structural pattern either).
KEYED_MIN_LEN = 8
KEYED_MIN_ENTROPY = 2.0

# Where credentials actually live in this workspace. Recursive so nested dirs
# (/tmp/testrail/creds.json, /tmp/qa-cookies/reports-cookie-header.txt) are found.
SOURCE_GLOBS = [
    "/tmp/**/creds*.json",
    "/tmp/**/cred*.json",
    "/tmp/**/cookies.json",
    "/tmp/**/*cookie*",
    "/tmp/**/*token*",
    "/tmp/**/*secret*",
    "/tmp/**/*passw*",
    "/tmp/**/*.hdrs",
    "/tmp/**/.figma-hdrs",
    "/tmp/**/testrail-ui.txt",
    "/tmp/**/staging-cookie.txt",
]

# Never read our own output back in as a source.
SOURCE_EXCLUDE_BASENAMES = {"secret-fingerprints.json"}

SKIP_SUFFIX = (".png", ".jpg", ".jpeg", ".gif", ".pdf", ".zip", ".xlsx", ".docx",
               ".mp4", ".webm", ".ico", ".woff", ".woff2", ".ttf", ".pyc")

SECRET_KEYS = ("password", "passwd", "pass", "key", "value", "token", "secret",
               "apikey", "api_key", "api-key", "auth", "authorization", "cookie",
               "session", "bearer")

TOKENISH = re.compile(r"[A-Za-z0-9%._\-+/=~]{12,}")
COOKIE_PAIR = re.compile(r"([A-Za-z0-9_\-]{3,40})=([^;\s]{8,})")


def entropy(s):
    if not s:
        return 0.0
    c = Counter(s)
    n = len(s)
    return -sum(v / n * math.log2(v / n) for v in c.values())


def excluded(v, keyed=False):
    """Return a reason string if v must NOT be fingerprinted, else None.

    `keyed` = the value came from an explicit secret-named key in a credential
    file, so it is known to be a secret and gets the lower length/entropy bar.
    """
    min_len = KEYED_MIN_LEN if keyed else MIN_LEN
    min_ent = KEYED_MIN_ENTROPY if keyed else MIN_ENTROPY
    if len(v) < min_len:
        return "too short"
    if re.search(r"\.(com|net|org|io|dev|local)\b", v):
        return "hostname"
    if re.match(r"^[a-z_.\-]+$", v):
        return "cookie name / bare identifier"
    if re.match(r"^7120\d\d(?::|%3A)", v, re.I):
        return "Atlassian accountId (public)"
    if re.match(r"^v\d+(\.\d+)*-[0-9a-f]{7,8}$", v):
        return "build marker (public)"
    if re.match(r"^(GMT|Mon|Tue|Wed|Thu|Fri|Sat|Sun)", v):
        return "date header"
    if entropy(v) < min_ent:
        return "entropy < %.1f" % min_ent
    return None


def harvest_text(raw, vals, rejected):
    """Pull candidate secret values out of one file's text."""
    def add(v, keyed=False):
        if not isinstance(v, str):
            return
        v = v.strip().strip('"\'')
        why = excluded(v, keyed=keyed)
        if why:
            rejected[why] += 1
            return
        vals.add(v)

    # 1. JSON credential files -- take the values of secret-ish keys.
    try:
        j = json.loads(raw)

        def walk(o):
            if isinstance(o, dict):
                for k, v in o.items():
                    if isinstance(v, str) and k.lower().replace("-", "_") in (
                            s.replace("-", "_") for s in SECRET_KEYS):
                        add(v, keyed=True)
                    else:
                        walk(v)
            elif isinstance(o, list):
                for v in o:
                    walk(v)

        walk(j)
        return
    except Exception:
        pass

    # 2. Cookie headers / KEY=VALUE files -- take the VALUE half only, so the
    #    cookie NAME is never fingerprinted.
    got_pair = False
    for name, value in COOKIE_PAIR.findall(raw):
        got_pair = True
        add(value)

    # 3. Bare token files (e.g. /tmp/figma-token is one line, no key, no '=').
    if not got_pair:
        for m in TOKENISH.findall(raw):
            add(m)


def resolve_out(path):
    """Refuse any output path outside /tmp. Returns the real path or raises."""
    real = os.path.realpath(os.path.expanduser(path))
    tmp_real = os.path.realpath("/tmp")
    if real != tmp_real and not real.startswith(tmp_real + os.sep):
        raise ValueError(
            "REFUSED: output must be inside /tmp, got %r (real %r).\n"
            "A hash of a short secret is brute-forceable, so fingerprints may never\n"
            "enter this PUBLIC repository -- not even hashed." % (path, real))
    if os.path.isdir(real):
        raise ValueError("REFUSED: %r is a directory, not a file." % path)
    return real


def source_files():
    seen = []
    for pat in SOURCE_GLOBS:
        for p in glob.glob(pat, recursive=True):
            if not os.path.isfile(p):
                continue
            if os.path.basename(p) in SOURCE_EXCLUDE_BASENAMES:
                continue
            if p.endswith(SKIP_SUFFIX):
                continue
            real = os.path.realpath(p)
            if not real.startswith(os.path.realpath("/tmp") + os.sep):
                continue          # a symlink pointing out of /tmp
            if real not in seen:
                seen.append(real)
    return sorted(seen)


def generate(out_path, dry_run=False, quiet=False):
    out_real = resolve_out(out_path)
    files = source_files()
    vals = set()
    rejected = Counter()
    per_file = []
    for p in files:
        try:
            raw = open(p, encoding="utf-8", errors="replace").read()
        except Exception as e:
            per_file.append((p, "unreadable: %s" % e))
            continue
        before = len(vals)
        harvest_text(raw, vals, rejected)
        per_file.append((p, "+%d" % (len(vals) - before)))

    if not quiet:
        print("credential files read from /tmp: %d" % len(files))
        for p, n in per_file:
            print("  %-52s %s" % (p, n))
        if rejected:
            print("rejected candidates by reason: %s" % dict(rejected))
        print("distinct secret VALUES harvested: %d  (values are never stored)" % len(vals))

    if not files:
        print("\nNO credential files found in /tmp. Nothing to fingerprint.\n"
              "The scanner will keep running in STRUCTURAL-ONLY mode, which is the\n"
              "honest outcome -- not an error, and not something to fake.")
    if dry_run:
        print("--dry-run: nothing written.")
        return 0, len(vals)

    payload = {
        "sha256": sorted(hashlib.sha256(v.encode()).hexdigest() for v in vals),
        "note": "Fingerprints only. Generated into /tmp by make_secret_fingerprints.py; "
                "NEVER commit this file -- a hash of a weak secret is the secret.",
    }
    with open(out_real, "w") as fh:
        json.dump(payload, fh, indent=1)
    os.chmod(out_real, 0o600)
    if not quiet:
        print("wrote %d fingerprints to %s (mode 600)" % (len(payload["sha256"]), out_real))
    return 0, len(vals)


def run_scanner(args):
    return subprocess.run([sys.executable, SCANNER] + args,
                          capture_output=True, text=True, cwd=os.path.dirname(HERE) or ".")


def selftest():
    """(a) a planted fake secret is fingerprinted AND then detected by
    scan_secrets.py in full mode; (b) a non-/tmp output path is refused."""
    ok = True
    print("SELFTEST -- make_secret_fingerprints.py\n")

    # ---- (b) first: the refusal. No side effects, so no cleanup needed.
    print("(b) refuse a non-/tmp output path")
    for bad in [os.path.join(HERE, "fp.json"), "/etc/fp.json", "./fp.json"]:
        try:
            resolve_out(bad)
            print("    %-40s NOT REFUSED  <-- FAIL" % bad)
            ok = False
        except ValueError:
            print("    %-40s refused      PASS" % bad)
    try:
        resolve_out("/tmp/fp-selftest.json")
        print("    %-40s accepted     PASS" % "/tmp/fp-selftest.json")
    except ValueError:
        print("    /tmp path was refused  <-- FAIL")
        ok = False

    # ---- (a) plant -> fingerprint -> detect
    print("\n(a) plant a fake secret, fingerprint it, prove the scanner catches it")
    fixture_dir = tempfile.mkdtemp(prefix="fpselftest-", dir="/tmp")
    # Deliberately BORING: no 64-hex shape, no "token"-looking prefix, so the
    # scanner's STRUCTURAL patterns should miss it and only the fingerprint hits.
    planted = "Zq7-marmalade-Trombone-91-selftest"
    fixture_cred = os.path.join(fixture_dir, "creds.json")
    with open(fixture_cred, "w") as fh:
        json.dump({"host": "https://example.invalid", "user": "qa", "password": planted}, fh)
    out = os.path.join(fixture_dir, "secret-fingerprints-selftest.json")

    vals, rej = set(), Counter()
    harvest_text(open(fixture_cred).read(), vals, rej)
    if planted in vals:
        print("    planted value harvested                      PASS")
    else:
        print("    planted value NOT harvested  <-- FAIL (rejected: %s)" % dict(rej))
        ok = False

    digest = hashlib.sha256(planted.encode()).hexdigest()
    with open(out, "w") as fh:
        json.dump({"sha256": [digest], "note": "selftest"}, fh)

    target = os.path.join(fixture_dir, "leaky_notes.md")
    with open(target, "w") as fh:
        fh.write("# notes\nthe qa password is %s and it must never ship\n" % planted)

    # Structural-only baseline: point the scanner at a fingerprint file that
    # does not exist, by temporarily moving the real one aside if present.
    real_fp = DEFAULT_OUT
    stash = None
    if os.path.exists(real_fp):
        stash = real_fp + ".selftest-stash"
        os.rename(real_fp, stash)
    try:
        base = run_scanner([target])
        structural_hit = "leaky_notes.md" in base.stdout
        print("    structural-only mode flags it?               %s"
              % ("yes (weak test, still valid)" if structural_hit else "no  <-- as designed"))

        os.replace(out, real_fp)
        full = run_scanner([target])
        if "leaky_notes.md" in full.stdout and full.returncode != 0:
            print("    FULL mode (fingerprints) flags it            PASS")
        else:
            print("    FULL mode did NOT flag it  <-- FAIL\n%s" % full.stdout[-600:])
            ok = False
        if "fingerprint" in full.stdout.lower() and "no /tmp/secret-fingerprints" in full.stdout:
            print("    scanner still says 'no fingerprints'  <-- FAIL")
            ok = False
        else:
            print("    scanner loaded the fingerprint file          PASS")
    finally:
        for p in (real_fp,):
            if os.path.exists(p):
                os.remove(p)
        if stash:
            os.rename(stash, real_fp)
        for p in (fixture_cred, target, out):
            if os.path.exists(p):
                os.remove(p)
        os.rmdir(fixture_dir)

    print("\nSELFTEST %s" % ("PASSED" if ok else "FAILED"))
    return 0 if ok else 1


def main():
    ap = argparse.ArgumentParser(
        description="Build /tmp/secret-fingerprints.json so scan_secrets.py runs in FULL mode. "
                    "Output and inputs are /tmp ONLY -- never committed.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="Run this at SESSION START (see build/skills/14-ACCESS-RESILIENCE.md). "
               "/tmp is ephemeral, so it must be re-run in every fresh container.")
    ap.add_argument("--out", default=DEFAULT_OUT,
                    help="output path; MUST be inside /tmp (default: %s)" % DEFAULT_OUT)
    ap.add_argument("--dry-run", action="store_true", help="report counts, write nothing")
    ap.add_argument("--quiet", action="store_true", help="suppress the per-file listing")
    ap.add_argument("--verify", action="store_true",
                    help="after writing, run scan_secrets.py --all in full mode and report")
    ap.add_argument("--selftest", action="store_true",
                    help="prove detection works and that a non-/tmp path is refused")
    a = ap.parse_args()

    if a.selftest:
        return selftest()

    try:
        rc, n = generate(a.out, dry_run=a.dry_run, quiet=a.quiet)
    except ValueError as e:
        print(str(e), file=sys.stderr)
        return 2

    if a.verify and not a.dry_run:
        print("\n--- scan_secrets.py --all (full mode) ---")
        r = run_scanner(["--all"])
        print(r.stdout.strip() or "(no output)")
        if r.stderr.strip():
            print(r.stderr.strip(), file=sys.stderr)
        print("scanner exit code: %d" % r.returncode)
        if r.returncode != 0:
            print("\nA FINGERPRINT MATCHED SOMETHING IN THE REPO. Two possibilities and they\n"
                  "need telling apart before anything is committed: either a real credential\n"
                  "is checked in (fix that), or a NON-secret was fingerprinted by mistake\n"
                  "(add it to excluded()). Do not suppress this.")
        return r.returncode
    return rc


if __name__ == "__main__":
    sys.exit(main())
