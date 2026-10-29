# Render page 1 of a downloaded report PDF to PNG (pypdfium2) and print its first text lines. SECRET-FREE.
# Usage: python3 pdf_top.py IN.pdf OUT.png
import sys, pypdfium2 as pdfium
pdf = pdfium.PdfDocument(sys.argv[1]); pg = pdf[0]
pg.render(scale=2).to_pil().save(sys.argv[2])
print('\n'.join(pg.get_textpage().get_text_range().splitlines()[:8]))
