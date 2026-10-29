"""Print the text of a PDF (pypdf; the system 'cryptography' package is broken here, so it is disabled before import). Usage: python3 -I pdftext.py <file.pdf>"""
import sys; sys.modules['cryptography'] = None
import pypdf
for p in pypdf.PdfReader(sys.argv[1]).pages: print(p.extract_text())
