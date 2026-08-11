"""refs must be ONE comma-free entry of at most 248 characters (Rule 50's declared
TestRail pattern limit: 248 passes, 249 returns HTTP 400 'does not match the
required pattern'). Fail loudly BEFORE the write rather than burn an API error."""
def check(refs, cid=""):
    if "," in refs:
        raise SystemExit(f"refs for {cid} contains a comma -> TestRail would split it: {refs!r}")
    if len(refs) > 248:
        raise SystemExit(f"refs for {cid} is {len(refs)} chars (max 248): {refs!r}")
    return refs
