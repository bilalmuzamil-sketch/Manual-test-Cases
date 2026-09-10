import pymupdf, sys
def hexc(v): return '#%06X'%v
for path in sys.argv[1:]:
    d=pymupdf.open(path)
    print('=====',path)
    for pno,p in enumerate(d):
        for b in p.get_text("dict")['blocks']:
            for l in b.get('lines',[]):
                for s in l['spans']:
                    t=s['text'].strip()
                    if t.upper() in ('BALANCE','ESTIMATED TOTAL') or (s['size']>14 and '$' in t):
                        print(f"  p{pno} size {s['size']:6.2f}pt  colour {hexc(s['color'])}  font {s['font'][:22]:22}  bbox {tuple(round(v,1) for v in s['bbox'])}  {t!r}")
    # the rounded balance box: a drawing with curve items, near-black, ~210pt wide
    for pno,p in enumerate(d):
        for dr in p.get_drawings():
            r=dr['rect']
            kinds={it[0] for it in dr['items']}
            if 'c' in kinds and 150<r.width<260 and 20<r.height<70:
                print(f"  p{pno} ROUNDED BOX rect x{r.x0:.1f} y{r.y0:.1f} w{r.width:.1f} h{r.height:.1f} fill {dr.get('fill')} colour {dr.get('color')} width {dr.get('width')} items {len(dr['items'])}")
