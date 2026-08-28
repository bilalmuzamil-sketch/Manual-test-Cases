#!/usr/bin/env python3
"""Annotate the two Issue Credit dialogs so the difference is visible without being explained.

Geometry comes from the page itself (getBoundingClientRect via cap.mjs), never from guessing at
pixels. Leader lines are drawn DIRECTIONALLY - a label to the right of its box gets its line from
the label's LEFT edge, otherwise the arrow is drawn straight through its own text (a real bug in the
earlier version of this script, which a collision-only guard happily passed).
"""
import json, sys
from PIL import Image, ImageDraw, ImageFont

F = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FR = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
RED = (208, 32, 32)
BLU = (20, 90, 200)
GRN = (16, 130, 60)


def annotate(tag, out_path, title, marks, footer):
    im = Image.open(f"/tmp/sv8815-staging/{tag}.png").convert("RGB")
    geom = json.load(open(f"/tmp/sv8815-staging/{tag}-geom.json"))["geom"]
    W, H = im.size
    pad = 300
    canvas = Image.new("RGB", (W, H + pad), (255, 255, 255))
    canvas.paste(im, (0, 0))
    d = ImageDraw.Draw(canvas)
    fb = ImageFont.truetype(F, 30)
    fr = ImageFont.truetype(FR, 27)
    ft = ImageFont.truetype(F, 34)

    placed = []
    for key, label, colour, side in marks:
        g = geom.get(key)
        if not g:
            print(f"  !! geometry missing for {key}")
            continue
        x, y, w, h = g["x"], g["y"], g["w"], g["h"]
        d.rectangle([x - 6, y - 6, x + w + 6, y + h + 6], outline=colour, width=5)
        if label is None:
            continue
        tw = int(d.textlength(label, font=fb))
        if side == "left":
            lx, ly = x - tw - 130, y + h // 2 - 20
        else:
            lx, ly = x + w + 130, y + h // 2 - 20
        # keep labels inside the frame and off each other
        lx = max(12, min(lx, W - tw - 12))
        while any(abs(ly - py) < 48 and abs(lx - px) < tw + 120 for px, py in placed):
            ly += 52
        placed.append((lx, ly))
        d.rectangle([lx - 12, ly - 10, lx + tw + 12, ly + 42], fill=(255, 255, 255), outline=colour, width=3)
        d.text((lx, ly), label, font=fb, fill=colour)
        # DIRECTIONAL leader - never through the label's own text
        if lx > x + w:
            d.line([lx - 12, ly + 16, x + w + 8, y + h // 2], fill=colour, width=4)
        elif lx + tw < x:
            d.line([lx + tw + 12, ly + 16, x - 8, y + h // 2], fill=colour, width=4)
        else:
            d.line([lx + tw // 2, ly - 12, x + w // 2, y + h + 8], fill=colour, width=4)

    d.rectangle([0, H, W, H + pad], fill=(248, 248, 250))
    d.line([0, H, W, H], fill=(120, 120, 130), width=3)
    d.text((28, H + 18), title, font=ft, fill=(20, 20, 30))
    yy = H + 68
    for line in footer:
        d.text((28, yy), line, font=fr, fill=(45, 45, 60))
        yy += 38
    canvas.save(out_path)
    print("wrote", out_path, canvas.size)


# ---- Invoice total: 0.26 + 0.25 = 0.51
annotate(
    "EX-invoice-total",
    "/tmp/sv8815-staging/EX-A-invoice-total-annotated.png",
    'BEFORE / AFTER pair, 1 of 2  -  location set to "Invoice total"',
    [
        ("currency_text_parts_return_tax", "Tax on the credit  $0.51", RED, "left"),
        ("currency_text_parts_return_total_e2f4e7d3-398c-44dc-b1f3-5acf3ecd830d", "part E  $5.35  (tax 0.25)", BLU, "left"),
        ("currency_text_parts_return_total_d15306ea-1799-4942-9b11-2b026201b0bb", "part F  $5.36  (tax 0.26)", BLU, "left"),
        ("currency_text_parts_return_total", "Credit total  $10.71", GRN, "left"),
        ("text_issue_credit_invoice_number", None, (90, 90, 100), "right"),
    ],
    [
        'Invoice P9-1347 was frozen under "Invoice total": subtotal $10.20, tax $0.51, total $10.71.',
        "The credit splits that frozen $0.51 as 0.26 + 0.25 - it does NOT recompute the tax per part.",
        "A recompute would have charged 0.26 + 0.26 = 0.52 and credited a cent more tax than was billed.",
        "Server response: work-orders/parts/calculate-tax -> totalTaxAmount 0.51, items 26 and 25 cents.",
        "Build v3.8-0cb5771 on app.staging.shopview.com, 20 Aug 2026.",
    ],
)

# ---- Line by line: 0.26 + 0.26 = 0.52
annotate(
    "EX-line-by-line",
    "/tmp/sv8815-staging/EX-B-line-by-line-annotated.png",
    'BEFORE / AFTER pair, 2 of 2  -  the CONTROL, location set to "Line by line (default)"',
    [
        ("currency_text_parts_return_tax", "Tax on the credit  $0.52", RED, "left"),
        ("currency_text_parts_return_total_8160c1e7-88b5-4deb-b5c1-1681f7db73ba", "part C  $5.36  (tax 0.26)", BLU, "left"),
        ("currency_text_parts_return_total_80aa772f-b6a8-4bca-b478-918e9f7629f6", "part D  $5.36  (tax 0.26)", BLU, "left"),
        ("currency_text_parts_return_total", "Credit total  $10.72", GRN, "left"),
        ("text_issue_credit_invoice_number", None, (90, 90, 100), "right"),
    ],
    [
        'Same two $5.10 parts, but this invoice was frozen under "Line by line": tax $0.52, total $10.72.',
        "The credit splits 0.26 + 0.26 = 0.52 - one cent more than the Invoice-total case above.",
        "So the credit follows whichever figure the invoice was actually billed at. That is the point.",
        "Server response: work-orders/parts/calculate-tax -> totalTaxAmount 0.52, items 26 and 26 cents.",
        "Build v3.8-0cb5771 on app.staging.shopview.com, 20 Aug 2026.",
    ],
)
