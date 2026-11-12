"""References from Design (Rule 117 tenth amendment): an EMPTY hook in round 1 (12 Nov 2026).
The design worker (design-2026-11-12/, owner of DESIGN-DIVERGENCE-REGISTER.json) drives the design "Internal Work Orders, All flows v6.1"
(https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo). Round 2 fills DREFS ({case key: {"pages", "pictures", "words", "notes"}}) and,
for PRD cases, for_case() from that worker's spec-to-design table, so each case gets its block without an edit to the case files.
Until then no case carries a "References from Design" heading (a heading with no board behind it is refused by build.py)."""
DREFS = {}


def for_case(c):
    return DREFS.get(c["key"])
