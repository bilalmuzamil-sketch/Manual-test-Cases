#!/usr/bin/env python3
"""Tester-readiness check, run on a suite's drafts before EVERY TestRail write (lessons L-12 to L-18, 26 Oct 2026).

It reads the tester text only (title, preconditions, steps and the results above "Exact quotes") and
  FAILS (exit 1) on: the "If you cannot set up any of the above, mark this test Blocked: setup not done" line or a variant
                     (Rule 117 fifteenth amendment; a note naming a build-specific reason to mark Blocked is allowed);
                     a case a manual tester cannot set up or reach (wording such as "automated check",
                     "a means other than the page", "cannot be loaded", "data repair", "slowed network");
                     a vague look word ("native", "as described", "looks right", "the same style", "as designed") in the
                     preconditions, steps or results (not in the title, not inside a quoted design name);
                     "Make sure" about a record this test creates ("Make sure ... was created / is new");
                     a case key or C-id in tester text; "ask your QA lead" or any who-to-ask line.
  LISTS for a human read: every result saying something does NOT appear / happen (needs a control the tester can see),
                     and a random sample of N cases printed in full tester text, which the coordinator must read
                     before writing (gates check words, not meaning: L-13).

python3 tester_readiness_check.py <suite folder> [--sample N] [--seed S] [--also <file.json> ...]
--also adds cases kept outside proposals.json (same {key: {"fields": {...}}} shape), e.g. Splitting Sales Representatives'
pattern-format-2026-10-26/DR-PATTERN.json. Every suite's TestRail write script calls require() and refuses to write on exit 1 (Rule 138).
The suite folder must hold authoring/proposals.json ({key: {"fields": {...}}} or {key: {...}})."""
import sys, json, re, html, random, os, signal
signal.signal(signal.SIGPIPE, signal.SIG_DFL)

HARD = {
    "Blocked line": r"setup not done|If you cannot set up any of the above|If any record above is missing",
    "not manual": r"automated check|means other than the page|request sent outside|outside the (page|window|screen) can reach|"
                  r"cannot be loaded|data repair|slowed network|developer-made failure|manual tester cannot|cannot set up this case",
    "vague look": r"\bnative\b|as described\b|looks right|the same style\b|as designed\b|as in the layout being checked",
    "Make sure for a record this test makes": r"Make sure [^.]{0,120}\b(was created|is new|created today)\b",
    "case id in tester text": r"\bC\d{5,6}\b|\b(S\d{1,2}|D|DATA|REL|DR)-\d{1,3}[a-c]?\b",
    "who to ask": r"ask your (QA lead|lead|manager)|ask the QA lead|tell the QA lead",
    # 27 Oct 2026: the old (8-16 Oct) layouts, forbidden in TestRail by Rule 117's fourteenth amendment; the readiness check had
    # passed 274 Parts Lifecycle cases still in that layout
    "old layout (placeholder)": r"\{[A-Z][A-Za-z]*(?:-[A-Za-z0-9]+)*\}",
    "old layout (For example line)": r"(?m)^\s*-?\s*For example:",
    "old layout (Scenario line)": r"(?m)^\s*-?\s*Scenario:",
    "old layout (setup document link)": r"docs\.google\.com/document|Setup \(manual QA tester and Claude session\)|Setup for claude session",
}
NEG = r"\b(does not|doesn't|is not|isn't|never|no longer|nothing|not shown|not listed|not sent|is gone|stays? unchanged)\b"


def txt(s):
    s = re.sub(r"<li>", "\n - ", s or ""); s = re.sub(r"</p>|</ul>|<br ?/?>", "\n", s); s = re.sub(r"<[^>]+>", "", s)
    return re.sub(r"\n\s*\n+", "\n", html.unescape(s)).strip()


def tester_text(f):
    e = f.get("custom_expected") or ""
    i = e.find("Exact quotes")
    return {"title": f.get("title", ""), "pre": txt(f.get("custom_preconds")), "steps": txt(f.get("custom_steps")),
            "exp": txt(e[:i] if i >= 0 else e)}


def main():
    a = sys.argv[1:]
    if not a: sys.exit(__doc__)
    folder = a[0]; n = int(a[a.index("--sample") + 1]) if "--sample" in a else 5
    seed = int(a[a.index("--seed") + 1]) if "--seed" in a else None
    P = json.load(open(os.path.join(folder, "authoring", "proposals.json")))
    for i, x in enumerate(a):
        if x == "--also": P.update(json.load(open(a[i + 1] if os.path.isabs(a[i + 1]) else os.path.join(folder, a[i + 1]))))
    hard, neg, T = [], [], {}
    for k, v in P.items():
        f = v.get("fields", v); t = tester_text(f); T[k] = t
        body = "\n".join(t.values()); inner = "\n".join([t["pre"], t["steps"], t["exp"]])
        raw = "\n".join(f.get(x) or "" for x in ("custom_preconds", "custom_steps"))  # a link's address is lost when tags are stripped
        for name, pat in HARD.items():
            # a look word inside a quoted design name ("The native Location menu") or in a design title is not the check itself
            src = re.sub(r'\S+\.png', '', re.sub(r'"[^"\n]*"|“[^”]*”', '""', inner)) if name == "vague look" else (inner if name == "case id in tester text" else (body + "\n" + raw if "link" in name else body))
            m = re.search(pat, src, re.I if name != "case id in tester text" else 0)
            if m: hard.append(f"{k}: {name}: …{src[max(0, m.start() - 60):m.end() + 40]}…".replace("\n", " "))
        for line in t["exp"].splitlines():
            if re.search(NEG, line, re.I): neg.append(f"{k}: {line.strip()[:160]}")
    print(f"cases {len(P)} | hard problems {len(hard)} | 'does not / never' results to read for a control {len(neg)}")
    for h in hard: print("PROBLEM", h)
    for x in neg: print("READ-CONTROL", x)
    rnd = random.Random(seed); keys = rnd.sample(sorted(T), min(n, len(T)))
    print(f"\n=== SAMPLE for the coordinator to read in full ({len(keys)} cases) ===")
    for k in keys:
        t = T[k]; print(f"\n----- {k}: {t['title']}\n{t['pre']}\nSTEPS\n{t['steps']}\n{t['exp']}")
    sys.exit(1 if hard else 0)


def require(folder, also=()):
    """Called by every suite's TestRail write script before it writes (Rule 138). Exits the caller on any hard problem."""
    import subprocess
    cmd = [sys.executable, os.path.abspath(__file__), folder, "--sample", "0"] + [y for x in also for y in ("--also", x)]
    r = subprocess.run(cmd, capture_output=True, text=True)
    head = r.stdout.splitlines()[0] if r.stdout else r.stderr[-300:]
    print("tester-readiness check (Rule 138):", head)
    if r.returncode != 0:
        print("\n".join(l for l in r.stdout.splitlines() if l.startswith("PROBLEM")) or r.stderr[-1000:])
        sys.exit("REFUSED: the tester-readiness check failed; fix the cases, then write (Rule 138)")


if __name__ == "__main__":
    main()
