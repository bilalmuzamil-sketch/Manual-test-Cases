#!/usr/bin/env python3
"""ENFORCE THE §1 CRITICAL CORE SIZE CAP — the guard that was prose-only until 2026-09-03.

    python3 build/testing-tools/check_section1_size.py            # measure and judge
    python3 build/testing-tools/check_section1_size.py --selftest  # prove the tool works

Exit codes:  0 = at or under the cap (a HEADROOM WARNING may still be printed)
             1 = OVER the cap
             2 = the tool could not measure honestly (missing/ambiguous boundary
                 markers, unparseable record, declaration disagrees with the record)

THE FAILURE CLASS THIS FILE EXISTS TO KILL
------------------------------------------
`CLAUDE.md` §1 CRITICAL CORE is hard-capped by clause 4 of the §1 ADMISSION GATE that the
QA lead approved on 2026-09-02. Until today the cap lived ONLY as prose — one sentence in
`CLAUDE.md` §1's own preamble and one in `build/rules/INTEGRITY.md`. Nothing measured it.

That is a guard that fails silently and late. §1 grew +8,576 bytes in six commits on
2026-09-02 alone, went to 24,259 B, and had to be brought back by a hand audit. On
2026-09-03 it sits with roughly a hundred bytes of headroom: THE NEXT SESSION TO ADD A
RULING BREACHES THE CAP WITHOUT KNOWING, because a QA-lead ruling arrives mid-task and
nobody re-measures a file they are only appending one bullet to. This tool is what
re-measures it.

🛑 WHAT THIS TOOL IS *NOT* ALLOWED TO CAUSE. Going over the cap is fixed by DEMOTING
EVIDENCE to the owning rule/skill (gate clauses 2 and 5) — the verbatim quote, the worked
example, the incident history — and by MERGING duplicate bullets on one subject (clause 3).
It is NEVER fixed by dropping an imperative or weakening a ruling: Rule 95 clause 12,
quality is never the thing cut, and the gate's own words, "A gate that loses a ruling has
failed" / "A §1 that is honest at 20 KB beats a §1 that hits 18 KB with a ruling weakened."
The failure message says so every time it fires, because the message is the only part of
this file a session under time pressure will actually read.

WHY THE HEADROOM WARNING EXISTS (report, never fail)
----------------------------------------------------
A hard gate that only speaks at the moment of breach tells a session it is stuck AFTER the
ruling has been drafted and the commit is being written. The warning fires while there is
still room to plan the demotion, so the consolidation is a deliberate pass and not an
emergency one.

HOW IT MEASURES — THE RECORDED COMMAND, NOT A NEW ONE
-----------------------------------------------------
`INTEGRITY.md` records the measuring command in terms, and says why it matters:

    awk '/^## 1 · CRITICAL CORE/,/^## 2 · THE RULE INDEX/' CLAUDE.md | head -n -1 | wc -c
    "-- that is the command the 21,013 B figure came from, so the two numbers are comparable."

Every §1 figure in the record (24,259 / 21,013 / 19,953 / 19,797 ...) came from that
pipeline. A tool that measured "the same thing" a slightly different way -- counting the
heading line, or keeping the `## 2` line, or stripping a trailing newline -- would produce
figures that could not be compared with a single number already written down, and the
record would quietly fork. So this file reproduces that pipeline's semantics EXACTLY:

    awk '/S/,/E/'   the first line matching S through the first LATER line matching E,
                    inclusive of both, newlines kept
    head -n -1      drop the LAST line of that span (the `## 2` heading)
    wc -c           BYTES, not characters -- §1 is full of multi-byte characters
                    (·, 🛑, —), so a character count reads far lower and would pass a
                    §1 that is over the cap.

The pure-Python reimplementation is not taken on trust: the selftest check named
"python figure == recorded shell pipeline" runs the RECORDED shell command verbatim against
the real `CLAUDE.md` and requires the two to agree byte for byte. If the shell or awk is
unavailable that check REPORTS ITSELF AS NOT RUN -- an absent cross-check is never a pass.

WHY A DECLARATION *PLUS* A BOTH-WAYS AUDIT, RATHER THAN PARSING THE RECORD ALONE
--------------------------------------------------------------------------------
This is the shape proven by `build/testing-tools/automation_markers.py`, and it is here for
the same reason, sharpened by something specific to `INTEGRITY.md`: THAT FILE DELIBERATELY
PRESERVES SUPERSEDED READINGS VERBATIM AND DATED. It carries a "🟠 LIVE STATE ... 21,013
bytes" block that is explicitly marked as superseded, sitting BELOW the reading that
replaced it. A tool that simply scraped the record for numbers would be scraping a file
whose stated policy is to keep old numbers on the page -- exactly the hazard
`automation_markers.py` documents, where canon quotes `AUTOMATION: Ready` as the bug and a
scraper would start accepting it.

So the two jobs are split and each given to the thing that can do it:

  DECLARATION (below)   the cap and the boundary markers, byte-exact, ONE copy, reviewable.
  AUDIT (`audit()`)     proves that declaration still agrees with the RECORD, in BOTH
                        directions, on every run -- and refuses to measure if it does not.

The audit reads the cap from BOTH files that state it (`INTEGRITY.md` clause 4 and
`CLAUDE.md` §1's own gate preamble) and requires all three -- the two records and this
declaration -- to agree. If the QA lead moves the cap, this tool STOPS AND SAYS ITS
DECLARATION IS STALE; it never silently judges §1 against a number nobody approved, and it
never silently passes a §1 it could not locate.

🛑 IF THE CAP OR THE BOUNDARY MARKERS CHANGE: change them in `INTEGRITY.md` (and
`CLAUDE.md` §1), then update the DECLARATION below to match and re-run this file. Do not
"fix" a stale-declaration failure by loosening the audit.
"""
import os
import re
import subprocess
import sys
import tempfile

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
# Captured at import against the real repo root so an error names this file correctly even
# when a test points REPO somewhere else.
_SELF = os.path.relpath(os.path.abspath(__file__), REPO)

# --------------------------------------------------------------------------------------
# THE DECLARATION. Audited against the record on every run; never used unaudited.
#
#   CAP              gate clause 4, approved by the QA lead 2026-09-02.
#   START / END      the two awk range patterns, byte-exact INCLUDING the `·` separators.
#   WARN_HEADROOM    not a rule -- an operational courtesy, declared here so it is one
#                    number in one place rather than a magic constant in a print.
# --------------------------------------------------------------------------------------
DECLARED_CAP = 20000
DECLARED_START = '^## 1 · CRITICAL CORE'
DECLARED_END = '^## 2 · THE RULE INDEX'
WARN_HEADROOM = 500

# The files that RECORD the cap. The audit reads these; it never reads a note, a project
# state file, or a figure someone remembered.
INTEGRITY_REL = 'build/rules/INTEGRITY.md'
CLAUDE_REL = 'CLAUDE.md'

# `hard-capped at 20,000 bytes` -- the sentence clause 4 is written in, in both files.
_CAP_RE = re.compile(r'hard-capped at ([\d,]+)\s*bytes')
# The measuring pipeline, as a backticked span: `awk '/S/,/E/' CLAUDE.md | ... | wc -c`
_PIPELINE_RE = re.compile(r"`(awk\s+'/[^`\n]*wc -c)`")
# The two range patterns inside it. Non-greedy, so `/S/,/E/` splits at the FIRST `/,/`.
_RANGE_RE = re.compile(r"awk\s+'/(.+?)/,/(.+?)/'")

REMEDY = (
    'REMEDY -- demote EVIDENCE, never an imperative (gate clauses 2/5, Rule 95 clause 12):\n'
    '  1. Pick the largest bullet whose bulk is EVIDENCE -- a verbatim quote, a worked\n'
    '     example, an incident history -- not instruction.\n'
    '  2. Move that evidence into the rule or skill the bullet already points at, and\n'
    '     GREP-VERIFY IT IS PRESENT THERE **BEFORE** shortening the CLAUDE.md text\n'
    '     (clause 5: "a gate that loses a ruling has failed").\n'
    '  3. Shorten the bullet to the imperative plus the pointer. Re-run this check.\n'
    '  Also available: merge two bullets that cover ONE subject into one labelled-parts\n'
    '  bullet (clause 3) -- that is how the two TestRail-formatting bullets were fixed.\n'
    '  NEVER: delete a ruling, drop an imperative, or trim a QA-lead quote to make the\n'
    '  number. A §1 that is honest at 20 KB beats a §1 that hits 18 KB with a ruling\n'
    '  weakened. Record the result in build/rules/INTEGRITY.md.'
)


class StaleSectionSpec(RuntimeError):
    """The declaration above no longer agrees with the record that approved it."""


class Section1NotFound(RuntimeError):
    """§1's boundary markers are missing or ambiguous, so no honest figure exists.

    This is deliberately NOT a pass. A tool that reports `0 bytes -- under the cap`
    because it could not find the section has certified a file it never read.
    """


# --------------------------------------------------------------------------- the record


def _read(rel, repo=None):
    path = os.path.join(repo or REPO, rel)
    try:
        return open(path, encoding='utf-8').read()
    except OSError as exc:
        raise StaleSectionSpec(
            'cannot read %s (%s). The cap cannot be proven current, so this run would be\n'
            'judging §1 against a number it never checked. Run from the repo root.'
            % (rel, exc)) from None


def recorded_cap(rel, repo=None):
    """The cap as RECORDED in `rel`, or a loud failure. Exactly one statement is allowed."""
    hits = _CAP_RE.findall(_read(rel, repo))
    if len(hits) != 1:
        raise StaleSectionSpec(
            '%s states the cap %d time(s); expected exactly 1 match for %r.\n'
            'Either the sentence was reworded (fix this tool) or the file now states the\n'
            'cap twice (fix the file -- two copies of a number drift).'
            % (rel, len(hits), _CAP_RE.pattern))
    return int(hits[0].replace(',', ''))


def recorded_pipeline(repo=None):
    """(command, start_pattern, end_pattern) as recorded in INTEGRITY.md."""
    text = _read(INTEGRITY_REL, repo)
    cmds = _PIPELINE_RE.findall(text)
    if len(cmds) != 1:
        raise StaleSectionSpec(
            '%s records the measuring command %d time(s); expected exactly 1.\n'
            'The command is the reason every §1 figure in the record is comparable; if it\n'
            'is gone or duplicated, stop and reconcile the record before measuring.'
            % (INTEGRITY_REL, len(cmds)))
    cmd = cmds[0]
    rng = _RANGE_RE.search(cmd)
    if not rng:
        raise StaleSectionSpec(
            'the command recorded in %s is not an awk range this tool can read: %r'
            % (INTEGRITY_REL, cmd))
    return cmd, rng.group(1), rng.group(2)


def audit(repo=None):
    """Diff the DECLARATION against the RECORD, both ways. Returns a list of disagreements."""
    problems = []
    for rel in (INTEGRITY_REL, CLAUDE_REL):
        cap = recorded_cap(rel, repo)
        if cap != DECLARED_CAP:
            problems.append(
                'cap: this file declares %d, %s records %d' % (DECLARED_CAP, rel, cap))
    _cmd, start, end = recorded_pipeline(repo)
    if start != DECLARED_START:
        problems.append('start marker: this file declares %r, %s records %r'
                        % (DECLARED_START, INTEGRITY_REL, start))
    if end != DECLARED_END:
        problems.append('end marker: this file declares %r, %s records %r'
                        % (DECLARED_END, INTEGRITY_REL, end))
    return problems


def assert_current(repo=None):
    """Prove the declaration matches the record, or raise loudly. Never judges on a guess."""
    problems = audit(repo)
    if not problems:
        return DECLARED_CAP
    raise StaleSectionSpec(
        'THE §1 CAP DECLARATION IN %s IS STALE.\n' % _SELF
        + 'Refusing to judge §1 against a cap the record does not agree with.\n'
        + '\n'.join('  ' + p for p in problems)
        + '\n-> If the QA lead moved the cap or the section was renamed, update the\n'
          '   DECLARATION in %s to match the record. Do not loosen the audit.' % _SELF)


# ----------------------------------------------------------------------------- measuring


def measure(text, start_pattern, end_pattern):
    """Bytes in §1, reproducing `awk '/S/,/E/' | head -n -1 | wc -c` exactly.

    Raises Section1NotFound rather than returning a figure it cannot vouch for. Every
    branch below is a way the shell pipeline would have returned a NUMBER THAT LOOKS FINE:
    a missing start marker gives 0 ("under the cap!"), a missing end marker silently
    measures to end of file, and a duplicated marker makes awk restart the range and
    measure a span nobody meant.
    """
    start_re, end_re = re.compile(start_pattern), re.compile(end_pattern)
    lines = text.splitlines(keepends=True)
    starts = [i for i, ln in enumerate(lines) if start_re.search(ln.rstrip('\n'))]
    ends = [i for i, ln in enumerate(lines) if end_re.search(ln.rstrip('\n'))]

    if not starts:
        raise Section1NotFound(
            'the §1 start marker %r does not appear in the file.\n'
            'The shell pipeline would print NOTHING here and `wc -c` would report 0 -- i.e.\n'
            'it would report a comfortable pass for a file whose §1 was never located.\n'
            'Either the heading was renamed (update INTEGRITY.md AND this tool) or the\n'
            'wrong file was measured.' % start_pattern)
    if len(starts) > 1:
        raise Section1NotFound(
            'the §1 start marker %r appears %d times (lines %s). awk restarts its range at\n'
            'each one, so the measured span would not be §1. Reconcile the file first.'
            % (start_pattern, len(starts), ', '.join(str(i + 1) for i in starts)))

    start = starts[0]
    after = [i for i in ends if i > start]
    if not after:
        raise Section1NotFound(
            'the §1 end marker %r does not appear after the start marker.\n'
            'awk would run the range to END OF FILE and report the whole rest of the\n'
            'document as §1 -- a wrong figure, not an obvious error. Reconcile first.'
            % end_pattern)
    if len(ends) > 1:
        raise Section1NotFound(
            'the §1 end marker %r appears %d times (lines %s); the span is ambiguous.'
            % (end_pattern, len(ends), ', '.join(str(i + 1) for i in ends)))

    span = lines[start:after[0] + 1]      # awk: inclusive of both boundary lines
    span = span[:-1]                      # head -n -1: drop the `## 2` heading line
    if not span:
        raise Section1NotFound(
            '§1 measured as an empty span (the start and end markers are adjacent).')
    return sum(len(ln.encode('utf-8')) for ln in span)   # wc -c: BYTES


def measure_file(claude_path, start_pattern, end_pattern):
    try:
        text = open(claude_path, encoding='utf-8').read()
    except OSError as exc:
        raise Section1NotFound('cannot read %s (%s)' % (claude_path, exc)) from None
    return measure(text, start_pattern, end_pattern)


def shell_measure(claude_path, command):
    """Run the RECORDED shell pipeline verbatim. Used to prove the Python agrees with it.

    Returns None when the shell or awk is unavailable -- an absent cross-check is reported
    as absent, never as a pass.
    """
    cmd = command.replace('CLAUDE.md', "'%s'" % claude_path, 1)
    try:
        out = subprocess.run(['bash', '-c', cmd], capture_output=True, text=True, timeout=60)
    except (OSError, subprocess.SubprocessError):
        return None
    if out.returncode != 0 or not out.stdout.strip():
        return None
    return int(out.stdout.strip())


# -------------------------------------------------------------------------------- report


def report(repo=None, out=print):
    """Measure and judge §1. Returns the process exit code (0 ok/warn, 1 over, 2 cannot)."""
    repo = repo or REPO
    try:
        cap = assert_current(repo)
        cmd, start, end = recorded_pipeline(repo)
    except StaleSectionSpec as exc:
        out(str(exc))
        out('\n§1 SIZE: NOT JUDGED -- the declaration could not be proven current.')
        return 2

    claude_path = os.path.join(repo, CLAUDE_REL)
    try:
        size = measure_file(claude_path, start, end)
    except Section1NotFound as exc:
        out('CANNOT MEASURE §1 CRITICAL CORE IN %s' % CLAUDE_REL)
        out(str(exc))
        out('\n§1 SIZE: NOT MEASURED -- this is a FAILURE, not a pass.')
        return 2

    out('§1 CRITICAL CORE SIZE CHECK -- %s' % CLAUDE_REL)
    out('  measured with (recorded in %s):' % INTEGRITY_REL)
    out('    %s' % cmd)
    out('  size : %s bytes' % format(size, ','))
    out('  cap  : %s bytes  (§1 ADMISSION GATE clause 4, QA lead 2026-09-02)' % format(cap, ','))

    if size > cap:
        out('  over : %s bytes OVER the cap' % format(size - cap, ','))
        out('')
        out('§1 IS OVER THE %s-BYTE CAP BY %s BYTES (measured %s).'
            % (format(cap, ','), format(size - cap, ','), format(size, ',')))
        out(REMEDY)
        return 1

    headroom = cap - size
    out('  head : %s bytes of headroom' % format(headroom, ','))
    if headroom < WARN_HEADROOM:
        out('')
        out('WARNING -- HEADROOM IS THIN: %s bytes left of the %s-byte cap.'
            % (format(headroom, ','), format(cap, ',')))
        out('  This is a REPORT, not a failure: §1 is within the cap today.')
        out('  Plan the next demotion NOW, while there is still room, rather than')
        out('  discovering it mid-ruling. A ~400-byte bullet is the gate\'s own unit,')
        out('  so at this headroom the next admission very likely breaches the cap.')
        out(REMEDY)
    out('')
    out('§1 SIZE: WITHIN CAP')
    return 0


# ------------------------------------------------------------------------------ selftest

_INTEGRITY_FIXTURE = (
    "# INTEGRITY\n\n"
    "4. **§1 is hard-capped at 20,000 bytes.** At the cap, the next admission requires\n"
    "   demoting something first.\n\n"
    "Measure it the same way every time:\n"
    "`awk '/^## 1 · CRITICAL CORE/,/^## 2 · THE RULE INDEX/' CLAUDE.md | head -n -1 | wc -c`\n"
)


def _fixture_repo(tmp, body_bytes, integrity=None, claude=None):
    """Write a miniature repo whose §1 body is `body_bytes` long, and return its path."""
    root = tempfile.mkdtemp(dir=tmp)
    os.makedirs(os.path.join(root, 'build', 'rules'))
    with open(os.path.join(root, INTEGRITY_REL), 'w', encoding='utf-8') as fh:
        fh.write(_INTEGRITY_FIXTURE if integrity is None else integrity)
    if claude is None:
        head = '## 1 · CRITICAL CORE — obey these\n'
        tail = '## 2 · THE RULE INDEX — all 100 rules\n'
        gate = ('\n- **§1 is hard-capped at 20,000 bytes.**\n')
        fixed = len(head.encode()) + len(gate.encode()) + 1      # +1 = the final newline
        filler = 'x' * max(0, body_bytes - fixed)
        claude = head + gate + filler + '\n' + tail
    with open(os.path.join(root, CLAUDE_REL), 'w', encoding='utf-8') as fh:
        fh.write(claude)
    return root


def _run(repo):
    """(exit_code, printed_text) for one report() run against a fixture repo."""
    lines = []
    code = report(repo, out=lambda *a: lines.append(' '.join(str(x) for x in a)))
    return code, '\n'.join(lines)


def selftest():
    passed, failed = [], []

    def check(name, ok, detail=''):
        (passed if ok else failed).append(name)
        print('  %s %s%s' % ('PASS' if ok else 'FAIL', name, ('  -- ' + detail) if not ok else ''))

    print('selftest: %s' % _SELF)
    tmp = tempfile.mkdtemp()

    # 1-3 -- the three verdicts, driven by size alone.
    code, txt = _run(_fixture_repo(tmp, 10000))
    check('under cap: exit 0', code == 0, 'exit=%d' % code)
    check('under cap: says WITHIN CAP, no warning',
          'WITHIN CAP' in txt and 'WARNING' not in txt)

    code, txt = _run(_fixture_repo(tmp, 25000))
    check('over cap: exit 1', code == 1, 'exit=%d' % code)
    check('over cap: names size, overage and the remedy',
          '25,000' in txt and '5,000 bytes OVER' in txt and 'demote EVIDENCE' in txt)
    check('over cap: forbids cutting an imperative',
          'never an imperative' in txt and 'NEVER: delete a ruling' in txt)

    code, txt = _run(_fixture_repo(tmp, 19_800))
    check('near cap: warns but does NOT fail', code == 0, 'exit=%d' % code)
    check('near cap: warning names the headroom and says it is not a failure',
          'WARNING' in txt and '200 bytes' in txt and 'not a failure' in txt)

    code, txt = _run(_fixture_repo(tmp, DECLARED_CAP))
    check('exactly at the cap is WITHIN cap (the rule is "over", not "at")',
          code == 0 and 'WITHIN CAP' in txt, 'exit=%d' % code)

    # 4 -- the boundary-marker failures. Each of these would otherwise be a quiet number.
    # NOTE: every CLAUDE.md fixture carries the gate sentence, because the audit reads the
    # recorded cap out of CLAUDE.md as well as INTEGRITY.md -- without it these fixtures would
    # fail for the wrong reason and prove nothing about the boundary markers.
    root = _fixture_repo(tmp, 10000, claude=(
        '## 9 · SOMETHING ELSE\n- **§1 is hard-capped at 20,000 bytes.**\nbody\n## 2 · THE RULE INDEX\n'))
    code, txt = _run(root)
    check('missing START marker: fails loudly, does not report 0 bytes as a pass',
          code == 2 and 'NOT MEASURED' in txt and 'FAILURE, not a pass' in txt
          and 'WITHIN CAP' not in txt, 'exit=%d' % code)

    root = _fixture_repo(tmp, 10000, claude=(
        '## 1 · CRITICAL CORE\n- **§1 is hard-capped at 20,000 bytes.**\nbody\n## 9 · SOMETHING ELSE\n'))
    code, txt = _run(root)
    check('missing END marker: fails loudly rather than measuring to EOF',
          code == 2 and 'END OF FILE' in txt and 'WITHIN CAP' not in txt, 'exit=%d' % code)

    root = _fixture_repo(tmp, 10000, claude=(
        '## 1 · CRITICAL CORE\n- **§1 is hard-capped at 20,000 bytes.**\na\n## 2 · THE RULE INDEX\n'
        '## 1 · CRITICAL CORE\nb\n## 2 · THE RULE INDEX\n'))
    code, txt = _run(root)
    check('duplicated markers: fails loudly (awk would restart the range)',
          code == 2 and 'appears 2 times' in txt, 'exit=%d' % code)

    # 5 -- the both-ways audit against the record.
    root = _fixture_repo(tmp, 10000,
                         integrity=_INTEGRITY_FIXTURE.replace('20,000', '18,000'))
    code, txt = _run(root)
    check('recorded cap != declared cap: refuses to judge',
          code == 2 and 'STALE' in txt and 'records 18000' in txt, 'exit=%d' % code)
    try:
        assert_current(root)
        check('cap disagreement raises the named exception', False, 'no exception raised')
    except StaleSectionSpec:
        check('cap disagreement raises the named exception StaleSectionSpec', True)
    except Exception as exc:                                   # noqa: BLE001
        check('cap disagreement raises the named exception', False, type(exc).__name__)

    root = _fixture_repo(tmp, 10000, integrity=_INTEGRITY_FIXTURE.replace(
        '^## 1 · CRITICAL CORE', '^## 1 · RENAMED CORE'))
    code, txt = _run(root)
    check('recorded START marker != declared: refuses to judge',
          code == 2 and 'start marker' in txt, 'exit=%d' % code)

    root = _fixture_repo(tmp, 10000, integrity='# INTEGRITY\n\nno cap sentence here\n')
    code, txt = _run(root)
    check('unparseable record: refuses to judge rather than assuming the cap',
          code == 2 and 'NOT JUDGED' in txt, 'exit=%d' % code)

    root = _fixture_repo(tmp, 10000)
    os.remove(os.path.join(root, INTEGRITY_REL))
    code, txt = _run(root)
    check('missing INTEGRITY.md: refuses to judge', code == 2, 'exit=%d' % code)

    # 6 -- the pure-Python measurement equals the RECORDED SHELL PIPELINE, on the real file.
    try:
        cmd, start, end = recorded_pipeline(REPO)
        py = measure_file(os.path.join(REPO, CLAUDE_REL), start, end)
        sh = shell_measure(os.path.join(REPO, CLAUDE_REL), cmd)
        if sh is None:
            check('python figure == recorded shell pipeline', False,
                  'shell/awk unavailable -- cross-check NOT RUN (reported, not assumed)')
        else:
            check('python figure == recorded shell pipeline (%s bytes)' % format(py, ','),
                  py == sh, 'python=%d shell=%d' % (py, sh))
    except (StaleSectionSpec, Section1NotFound) as exc:
        check('real-repo measurement', False, str(exc).splitlines()[0])

    # `wc -c` is BYTES. §1 is full of multi-byte characters (·, —, 🛑, §), so a character
    # count reads materially lower and would pass a §1 that is genuinely over the cap.
    multibyte = ('## 1 · CRITICAL CORE\n'
                 '- 🛑 A ruling — with an em dash and a §.\n'
                 '## 2 · THE RULE INDEX\n')
    body = multibyte[:multibyte.index('## 2')]
    check('counts BYTES not characters (multi-byte ·/—/🛑 in §1)',
          measure(multibyte, DECLARED_START, DECLARED_END) == len(body.encode('utf-8'))
          and len(body.encode('utf-8')) > len(body))

    # 7 -- the real repo's own state is judged, whatever the verdict is today.
    code, _txt = _run(REPO)
    check('real repo is judged with a real verdict (0 or 1, never 2)',
          code in (0, 1), 'exit=%d' % code)

    print('selftest: %s' % ('ALL PASS (%d checks)' % len(passed) if not failed
                            else '%d FAILURE(S): %s' % (len(failed), ', '.join(failed))))
    return 1 if failed else 0


def main(argv):
    if '--selftest' in argv:
        return selftest()
    if '-h' in argv or '--help' in argv:
        print(__doc__)
        return 0
    return report()


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
