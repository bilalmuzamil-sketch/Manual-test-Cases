Simple Flow design bundle — preserved copy
Source: 2f9d4f23-Simple_Flow_Design_3.zip (uploaded 2026-07-13)

Contents copied: all HTML mockups, MD/HTML handoffs, JSX, CSS, SVG, and every
PNG (top-level, screenshots/, uploads/).

DELIBERATELY EXCLUDED from this repo copy: the 54 generic Inter TTF fonts
(fonts/, ~18MB) and the two tooling-metadata files (.design-canvas.state.json,
.thumbnail). The fonts are the standard open-source Inter family and are not
test-relevant; excluding them keeps the repo lean. The full untouched bundle
lives at /tmp/simple-flow/design3/ for the current session.

Verdict (see ../spec-diff-2026-07-13.md §B): this bundle is BYTE-IDENTICAL to the
prior 2026-07-10 bundle (890a4d0a-Simple_Flow_Design_2.zip) — which was itself a
byte-identical re-delivery of the 2026-07-09 bundle (a30380c8-Simple_Flow_Design_1.zip)
already cataloged in design-latest-catalog.md. This is the THIRD identical
re-delivery of the same design set: 0 new / 0 changed / 0 removed design artifacts.
`diff -rq` of the full unzip against the 2026-07-10 bundle returns exit 0 (zero
differences). No design-driven case impact.
