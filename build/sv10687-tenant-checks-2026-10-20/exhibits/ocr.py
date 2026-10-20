"""Find where a phrase is drawn in a screenshot (tesseract word boxes), so boxes land on real pixels."""
import subprocess, csv, io, re
_cache = {}
def _tsv(path, psm='11'):
    out = subprocess.run(['tesseract', path, '-', '--psm', psm, 'tsv'], capture_output=True, text=True).stdout
    rows = [r for r in csv.DictReader(io.StringIO(out), delimiter='\t') if r.get('text','').strip()]
    return [(r['text'], int(r['left']), int(r['top']), int(r['width']), int(r['height'])) for r in rows]
def words(path):
    """Words from three passes: as-is, sparse; inverted grey (white text on coloured buttons); line mode."""
    if path not in _cache:
        from PIL import Image, ImageOps
        import tempfile, os
        im = Image.open(path).convert('L')
        inv = ImageOps.autocontrast(ImageOps.invert(im))
        t = tempfile.NamedTemporaryFile(suffix='.png', delete=False).name; inv.save(t)
        hi = im.point(lambda v: 0 if v < 200 else 255)
        t2 = tempfile.NamedTemporaryFile(suffix='.png', delete=False).name; hi.save(t2)
        _cache[path] = [_tsv(path), _tsv(t), _tsv(path,'3'), _tsv(t2)]
        os.unlink(t); os.unlink(t2)
    return _cache[path]
def norm(t): return re.sub(r'[^a-z0-9$.,\-]', '', t.lower())
def find(path, phrase, nth=0, region=None):
    """Return (x0,y0,x1,y1) of the nth occurrence of phrase (words in reading order, same line)."""
    target = [norm(t) for t in phrase.split()]; hits = []
    for ws in words(path):
     for i in range(len(ws)):
        ok = True; boxes = []
        for j, t in enumerate(target):
            if i+j >= len(ws) or norm(ws[i+j][0]) != t: ok = False; break
            boxes.append(ws[i+j])
        if ok:
            x0=min(b[1] for b in boxes); y0=min(b[2] for b in boxes); x1=max(b[1]+b[3] for b in boxes); y1=max(b[2]+b[4] for b in boxes)
            if region and not (region[0]<=x0<=region[2] and region[1]<=y0<=region[3]): continue
            if not any(abs(h[0]-x0)<8 and abs(h[1]-y0)<8 for h in hits): hits.append((x0,y0,x1,y1))
    hits.sort(key=lambda h:(h[1],h[0]))
    if len(hits) <= nth: raise KeyError(f'{phrase!r} not found in {path} (found {len(hits)})')
    return hits[nth]
