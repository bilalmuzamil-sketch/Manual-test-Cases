#!/usr/bin/env python3
"""Annotate the three payment-receipt evidence images for the Invoice UI Refresh pass.

Descended from build/sv8815-customer-credit-2026-08-20/tools/annotate.py (Rule 97 - a committed
harness is reused, never rebuilt). Everything that harness got right is carried over verbatim in
spirit:

  * leader lines are DIRECTIONAL - a label to the right of its anchor draws its line from the
    label's LEFT edge, so the arrow is never drawn straight through its own text;
  * label boxes are pushed apart so they cannot overlap;
  * a title bar and a footer carry the provenance, identically on every image.

TWO THINGS ARE NEW HERE, and they are the reason this file exists rather than a second copy of the
old one:

  1. GHOST ROW (ghost_row).  The finding is that a row is ABSENT.  A box around empty space does not
     communicate that.  A ghost row draws the missing row where it belongs - dashed, in the PROBLEM
     colour, over an opaque white patch so it visually occupies the space the real row would take.
  2. GEOMETRY IS LITERAL, NOT FROM getBoundingClientRect.  The sv8815 harness read a -geom.json
     emitted by cap.mjs.  These captures were taken without one, so every box below was MEASURED off
     the committed PNGs (row bands / colour bounding boxes) rather than guessed.  The measuring
     snippets are in the git history of this commit's message; re-measure, never eyeball, if the
     captures are ever re-taken.

COLOUR CONVENTION - identical on all three images, and stated on each image's footer:
    RED   = this is the problem / this is what is missing
    GREEN = this is the supporting fact that proves the problem is real

Inputs (all committed alongside this script):
    cap-s32052-top.png                                   -> ann-1-banner.png
    superseded/ann-2-balance-first-version-2026-09-07.png -> ann-2-balance.png   (patched, see below)
    cap-s32220-top.png                                   -> ann-3-twopayments.png

ann-2 IS PATCHED, NOT REBUILT.  No unannotated capture of the S-32052 document foot was ever
committed (checked: `git log --diff-filter=A` over this directory returns a single commit, d93b0eef,
which added only the two `cap-*.png` top-of-page captures).  Re-cropping the annotated PNG would
re-crop burned-in annotation, so instead the first version is kept under superseded/ and this script
repaints ONLY the annotation layer it owns: the title bar, the caption column and the footer.  The
sliced "SUMMARY" heading is inside the screenshot pixels and therefore CANNOT be fixed without a
fresh capture - it is left exactly as captured rather than redrawn, because redrawing product text
would be fabrication.

Run:  python3 annotate.py        (from this directory, or any - paths are resolved from __file__)
"""
import os
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))

FB = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FR = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

PROBLEM = (208, 32, 32)     # RED   - the thing that is wrong / missing
FACT = (16, 130, 60)        # GREEN - the supporting fact
INK = (28, 28, 36)
BAR = (24, 28, 42)
SUBBAR_BG = (253, 236, 236)
PAPER = (255, 255, 255)
FOOT_BG = (247, 247, 250)

f_title = ImageFont.truetype(FB, 25)
f_sub = ImageFont.truetype(FB, 23)
f_cap = ImageFont.truetype(FB, 22)
f_ghost = ImageFont.truetype(FB, 20)
f_foot = ImageFont.truetype(FR, 22)
f_footb = ImageFont.truetype(FB, 22)


# ---------------------------------------------------------------- drawing primitives

def wrap(d, text, font, width):
    """Greedy wrap to a pixel width."""
    out, line = [], ""
    for word in text.split():
        trial = (line + " " + word).strip()
        if d.textlength(trial, font=font) <= width or not line:
            line = trial
        else:
            out.append(line)
            line = word
    if line:
        out.append(line)
    return out


def dashed_line(d, p0, p1, colour, width=3, dash=10, gap=7):
    (x0, y0), (x1, y1) = p0, p1
    dx, dy = x1 - x0, y1 - y0
    length = max(1.0, (dx * dx + dy * dy) ** 0.5)
    ux, uy = dx / length, dy / length
    pos = 0.0
    while pos < length:
        end = min(pos + dash, length)
        d.line([x0 + ux * pos, y0 + uy * pos, x0 + ux * end, y0 + uy * end],
               fill=colour, width=width)
        pos = end + gap


def dashed_rect(d, box, colour, width=3):
    x0, y0, x1, y1 = box
    dashed_line(d, (x0, y0), (x1, y0), colour, width)
    dashed_line(d, (x1, y0), (x1, y1), colour, width)
    dashed_line(d, (x1, y1), (x0, y1), colour, width)
    dashed_line(d, (x0, y1), (x0, y0), colour, width)


def ghost_row(d, box, left_text, right_text, label_x, value_right_x, colour=PROBLEM):
    """Draw the MISSING row where it belongs, inside the table it belongs to.

    Opaque white fill first, so the row occupies real space the way the real row would, then a dashed
    outline in the problem colour so no reader can mistake it for something the product printed.

    label_x / value_right_x are the SAME column edges the real rows above use, so the ghost row lines
    up with "Total Charged" rather than floating.  The font auto-shrinks until the two strings fit
    the column gap - never let them collide.
    """
    x0, y0, x1, y1 = box
    d.rectangle([x0, y0, x1, y1], fill=PAPER)
    dashed_rect(d, box, colour, width=3)
    size = 20
    while size > 11:
        f = ImageFont.truetype(FB, size)
        if (d.textlength(left_text, font=f) + d.textlength(right_text, font=f)
                + 18 <= value_right_x - label_x):
            break
        size -= 1
    f = ImageFont.truetype(FB, size)
    cy = (y0 + y1) // 2 - size // 2 - 2
    d.text((label_x, cy), left_text, font=f, fill=colour)
    d.text((value_right_x - d.textlength(right_text, font=f), cy), right_text, font=f, fill=colour)


def solid_box(d, anchor, colour, width=4):
    d.rectangle(list(anchor), outline=colour, width=width)


def caption(d, text, colour, x, y, width, anchor=None, placed=None):
    """A filled caption block, plus a DIRECTIONAL leader to its anchor (never through its own text).

    Returns the block's bottom y so the caller can stack the next one.
    """
    lines = wrap(d, text, f_cap, width - 28)
    h = 20 + 28 * len(lines)
    if placed is not None:
        while any(not (y + h < py0 - 14 or y > py1 + 14) for py0, py1 in placed):
            y += 22
        placed.append((y, y + h))
    d.rectangle([x, y, x + width, y + h], fill=colour)
    yy = y + 10
    for line in lines:
        d.text((x + 14, yy), line, font=f_cap, fill=PAPER)
        yy += 28
    if anchor:
        ax0, ay0, ax1, ay1 = anchor
        acy = (ay0 + ay1) // 2
        cy = y + h // 2
        if x > ax1:                       # label sits right of the anchor -> leave from its LEFT
            d.line([x - 2, cy, ax1 + 6, acy], fill=colour, width=4)
        elif x + width < ax0:             # label sits left  of the anchor -> leave from its RIGHT
            d.line([x + width + 2, cy, ax0 - 6, acy], fill=colour, width=4)
        else:                             # stacked -> leave from the edge nearest the anchor
            d.line([x + width // 2, y + h + 2 if acy > cy else y - 2,
                    (ax0 + ax1) // 2, ay0 - 6 if acy > cy else ay1 + 6], fill=colour, width=4)
    return y + h


def title_bar(d, w, text):
    """Identical provenance on every image - auto-shrunk so it can never run off a narrow canvas."""
    d.rectangle([0, 0, w, 41], fill=BAR)
    size = 25
    while size > 12 and d.textlength(text, font=ImageFont.truetype(FB, size)) > w - 36:
        size -= 1
    f = ImageFont.truetype(FB, size)
    d.text((18, (41 - size) // 2 - 3), text, font=f, fill=(255, 255, 255))
    return 41


def sub_bar(d, w, top, text, colour=PROBLEM):
    d.rectangle([0, top, w, top + 40], fill=SUBBAR_BG)
    d.text((18, top + 8), text, font=f_sub, fill=colour)
    return top + 40


def footer(d, w, top, h, lines):
    d.rectangle([0, top, w, top + h], fill=FOOT_BG)
    d.line([0, top, w, top], fill=(150, 150, 160), width=2)
    yy = top + 14
    for text, bold in lines:
        d.text((22, yy), text, font=f_footb if bold else f_foot, fill=INK)
        yy += 32


KEY_LINE = "Red = the problem.    Green = the supporting fact."


# ---------------------------------------------------------------- image 1  (S-32052)

def build_ann1():
    src = Image.open(os.path.join(HERE, "cap-s32052-top.png")).convert("RGB")
    crop_top, crop_bot = 8, 292                     # keep the receipt block + the invoice number
    body = src.crop((0, crop_top, 1030, crop_bot))
    ox, W = 24, 1480
    top = 41 + 40 + 16
    H = top + body.height + 16 + 92
    canvas = Image.new("RGB", (W, H), PAPER)
    canvas.paste(body, (ox, top))
    d = ImageDraw.Draw(canvas)

    def C(x, y):                                     # capture pixel -> canvas pixel
        return ox + x, top + (y - crop_top)

    title_bar(d, W, "staging  ·  v26.35.9-9812433  ·  Customer Portal  ·  "
                    "Invoice S-32052  ·  payment receipt  ·  7 Sep 2026")
    sub_bar(d, W, 41, "IMAGE 1 OF 3  —  WHERE THE MISSING LINE BELONGS")

    # the missing row, drawn immediately under "Total Charged", inside the same table,
    # on the same two column edges the real rows use (label 662, value right edge 916)
    gx0, gy0 = C(654, 142)
    gx1, gy1 = C(926, 171)
    ghost_row(d, (gx0, gy0, gx1, gy1), "Remaining Balance", "CA$7.45",
              C(662, 0)[0], C(916, 0)[0])

    # the PARTIALLY PAID pill
    pill = C(844, 47) + C(971, 70)
    solid_box(d, pill, FACT)

    # green first, then red: each caption then sits level with its own anchor and its leader is
    # short - placing red first pushed the green block far below its pill and drew a long diagonal
    placed = []
    caption(d, "The invoice itself says PARTIALLY PAID — so it knows money is still owed.",
            FACT, 1076, pill[1] - 6, 380, anchor=pill, placed=placed)
    caption(d, "THIS LINE IS MISSING", PROBLEM, 1076, gy0 - 16, 380,
            anchor=(gx0, gy0, gx1, gy1), placed=placed)

    footer(d, W, top + body.height + 16, 92, [
        ("The receipt should show what is still owed, on its own line under Total Charged. "
         "It does not.", True),
        (KEY_LINE, False),
    ])
    out = os.path.join(HERE, "ann-1-banner.png")
    canvas.save(out)
    print("wrote", out, canvas.size)


# ---------------------------------------------------------------- image 2  (S-32052 foot, PATCHED)

def build_ann2():
    src_path = os.path.join(HERE, "superseded", "ann-2-balance-first-version-2026-09-07.png")
    src = Image.open(src_path).convert("RGB")
    W, H0 = src.size                                 # 910 x 755

    # insert a 40px sub-bar directly under the existing title bar, pushing the rest down
    canvas = Image.new("RGB", (W, H0 + 40), PAPER)
    canvas.paste(src.crop((0, 41, W, H0)), (0, 81))
    d = ImageDraw.Draw(canvas)

    # repaint ONLY the annotation layer this script owns: caption column + footer
    d.rectangle([458, 82, W, H0 + 40], fill=PAPER)
    d.rectangle([0, 714, W, H0 + 40], fill=PAPER)

    title_bar(d, W, "staging  ·  v26.35.9-9812433  ·  Customer Portal  ·  "
                    "Invoice S-32052  ·  document foot  ·  7 Sep 2026")
    sub_bar(d, W, 41, "IMAGE 2 OF 3  —  MONEY REALLY WAS STILL OWED", colour=FACT)

    # the two anchors are green outlines already burned into the screenshot layer, +40 for the sub-bar
    payments = (110, 321 + 40, 455, 379 + 40)
    balance = (110, 494 + 40, 455, 584 + 40)

    placed = []
    caption(d, "Total $17.45. Two payments of $5.00 were taken.", FACT, 500, payments[1] - 18, 400,
            anchor=payments, placed=placed)
    caption(d, "The same invoice says $7.45 is still owed — the number missing from the "
               "payment receipt shown in image 1.", FACT, 500, balance[1] + 6, 400,
            anchor=balance, placed=placed)

    footer(d, W, 714, 81, [
        ("The same invoice, further down the page.", True),
        ("Green = the supporting fact.", False),
    ])
    out = os.path.join(HERE, "ann-2-balance.png")
    canvas.save(out)
    print("wrote", out, canvas.size)


# ---------------------------------------------------------------- image 3  (S-32220)

def build_ann3():
    src = Image.open(os.path.join(HERE, "cap-s32220-top.png")).convert("RGB")
    crop_top, crop_bot = 8, 394                     # far enough down to keep the invoice number
    body = src.crop((0, crop_top, 1030, crop_bot))
    ox, W = 24, 1540
    top = 41 + 40 + 16
    H = top + body.height + 16 + 92
    canvas = Image.new("RGB", (W, H), PAPER)
    canvas.paste(body, (ox, top))
    d = ImageDraw.Draw(canvas)

    def C(x, y):
        return ox + x, top + (y - crop_top)

    title_bar(d, W, "staging  ·  v26.35.9-9812433  ·  Customer Portal  ·  "
                    "Invoice S-32220  ·  payment receipt  ·  7 Sep 2026")
    sub_bar(d, W, 41, "IMAGE 3 OF 3  —  A SECOND, DIFFERENT INVOICE: "
                      "THE SAME LINE IS MISSING HERE TOO")

    gx0, gy0 = C(654, 172)
    gx1, gy1 = C(926, 201)
    ghost_row(d, (gx0, gy0, gx1, gy1), "Remaining Balance", "CA$150.23",
              C(662, 0)[0], C(916, 0)[0])

    paid_pill = C(863, 47) + C(971, 70)
    solid_box(d, paid_pill, FACT)

    # Only TWO captions. The batch-marker caption and the "Payment X of Y" caption were removed:
    # the first argues a different requirement, and the second could only be placed either on top of
    # the payment details or at the end of a long diagonal across the whole image.
    placed = []
    caption(d, "This invoice is fully paid TODAY. But at the time of the first payment, $150.23 "
               "was still owed — that is the moment this receipt describes.",
            FACT, 1080, paid_pill[1] - 6, 430, anchor=paid_pill, placed=placed)
    caption(d, "THIS LINE IS MISSING", PROBLEM, 1080, gy0 - 14, 430,
            anchor=(gx0, gy0, gx1, gy1), placed=placed)

    footer(d, W, top + body.height + 16, 92, [
        ("This is not a new fault — the live product has never shown this line.", True),
        (KEY_LINE, False),
    ])
    out = os.path.join(HERE, "ann-3-twopayments.png")
    canvas.save(out)
    print("wrote", out, canvas.size)


if __name__ == "__main__":
    build_ann1()
    build_ann2()
    build_ann3()
