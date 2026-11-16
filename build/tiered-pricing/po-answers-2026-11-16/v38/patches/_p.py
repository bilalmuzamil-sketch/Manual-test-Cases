def patch(f, pairs):
    s = open(f).read()
    for i, (o, n) in enumerate(pairs):
        c = s.count(o)
        if c != 1: raise SystemExit(f"{f} pair {i}: old text found {c} times: {o[:100]!r}")
        s = s.replace(o, n)
    open(f, 'w').write(s); print(f"{f}: {len(pairs)} replacements")
