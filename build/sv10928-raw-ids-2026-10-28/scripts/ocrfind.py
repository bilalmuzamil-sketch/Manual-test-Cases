# Usage: python3 ocrfind.py <png> <substring>... -> prints CSS-px boxes of words containing each substring (1x captures)
import subprocess, sys, csv, io
def words(png):
    out=subprocess.run(['tesseract',png,'-','--psm','11','tsv'],capture_output=True,text=True).stdout
    return [r for r in csv.DictReader(io.StringIO(out),delimiter='\t',quoting=csv.QUOTE_NONE) if r.get('text','').strip()]
def find(png,sub):
    return [(int(r['left']),int(r['top']),int(r['left'])+int(r['width']),int(r['top'])+int(r['height']),r['text']) for r in words(png) if sub.lower() in r['text'].lower()]
if __name__=='__main__':
    for s in sys.argv[2:]: print(s, find(sys.argv[1],s)[:6])
