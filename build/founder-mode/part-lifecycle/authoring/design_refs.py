"""Phase D fills DREFS: case key -> {"boards": ["4.1", ...], "pictures": ["<png name>", ...], "words": ["<verbatim canvas note>", ...]}.
pllib.design_of() ADDS these to the case's own design= references (boards, pictures, words), never replaces them. Every board number must
exist in canvas.json, every word must be verbatim in a canvas note, and every picture must exist in sources/design-2026-10-13-artifact/png/
or full-pass-2026-10-27/design/images/ (pllib.check)."""
DREFS = {}
