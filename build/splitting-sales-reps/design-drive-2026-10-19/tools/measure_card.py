from PIL import Image
import sys,json
P='/home/user/Manual-test-Cases/build/splitting-sales-reps/design-drive-2026-10-19/unpacked/png/'
def load(f): return Image.open(P+f).convert('RGB')
def bbox(im,reg,pred):
    x0,y0,x1,y1=reg; px=im.load(); xs=[];ys=[]
    for y in range(y0,y1):
        for x in range(x0,x1):
            if pred(px[x,y]): xs.append(x); ys.append(y)
    return (min(xs),min(ys),max(xs)+1,max(ys)+1) if xs else None
near=lambda c,t=6:(lambda p:all(abs(a-b)<=t for a,b in zip(p,c)))
dark=lambda p:sum(p)<3*170
def text_rows(im,reg):
    """rows (y ranges) containing dark text pixels in region"""
    x0,y0,x1,y1=reg; px=im.load(); rows=[];cur=None
    for y in range(y0,y1):
        has=any(dark(px[x,y]) for x in range(x0,x1))
        if has and cur is None: cur=y
        if not has and cur is not None: rows.append((cur,y));cur=None
    if cur is not None: rows.append((cur,y1))
    return rows
def left_edge(im,reg):
    b=bbox(im,reg,dark); return b[0] if b else None
out={}
RING=(235,242,254); FILL=(227,229,232); TIP=(117,117,117)
for f in ['card-00-b-wo-rest2.png','card-02-n1-rest.png','card-03-n1-hover.png','card-05-n1-picked.png','card-06-n1-picked-hover.png','card-07-n1-add-tip.png','card-08-n1-add-menu.png','card-09-n1-added.png','card-10-n1-added-hover.png','card-12-n1-two.png','card-13-n1-remove-tip.png','card-14-n1-removed.png','card-17-n1-invoiced.png']:
    im=load(f); r={}
    r['text_rows_card']=text_rows(im,(30,240,230,520))
    r['ring_bbox']=bbox(im,(24,240,300,520),near(RING,3))
    r['btn_fill']=bbox(im,(215,240,300,520),near(FILL,3))
    r['tooltip']=bbox(im,(24,240,700,620),near(TIP,2))
    r['icon_dark_right_col']=bbox(im,(225,240,280,520),lambda p:sum(p)<3*200)
    r['text_left_edges']=[left_edge(im,(24,a,200,b)) for a,b in r['text_rows_card']]
    out[f]=r
print(json.dumps(out,indent=0))

print('=== targeted')
def run(f):
    im=load(f); px=im.load()
    res={'board':f}
    # rings (focus outline) per field: scan column x=120 for ring colour runs
    runs=[];cur=None
    for y in range(240,560):
        m=near(RING,3)(px[120,y])
        if m and cur is None: cur=y
        if not m and cur is not None: runs.append((cur,y-1));cur=None
    res['ring_runs_x120']=runs
    # ring horizontal extent at the row of the first field box centre
    if len(runs)>=2:
        yc=(runs[0][1]+runs[1][0])//2
        row=[x for x in range(24,300) if near(RING,3)(px[x,yc])]
        res['ring_x_at_y%d'%yc]=(min(row),max(row)) if row else None
    # caret (arrow) bbox: dark pixels in x 185..213 within card rows
    res['caret']=[]
    for (a,b) in ([(r[0],r[1]) for r in zip(runs[0::2],runs[1::2])] if runs else []):
        pass
    for y0,y1 in [(360,420),(420,480)]:
        bb=bbox(im,(185,y0,213,y1),lambda p:sum(p)<3*140)
        res['caret'].append(bb)
    # button fill bbox (exact light grey) near the + / x column
    res['btn_fill']=bbox(im,(216,350,300,520),near(FILL,2))
    # icon glyph bbox in button column
    res['icon']=bbox(im,(216,350,300,520),lambda p:sum(p)<3*175 and not near(TIP,2)(p))
    # tooltip: exact grey 117 in region below the buttons
    res['tooltip']=bbox(im,(100,400,560,540),near(TIP,1))
    return res
for f in ['card-03-n1-hover.png','card-06-n1-picked-hover.png','card-07-n1-add-tip.png','card-08-n1-add-menu.png','card-10-n1-added-hover.png','card-11-n1-labor-list.png','card-13-n1-remove-tip.png','card-15-n1-unassign-list.png']:
    print(json.dumps(run(f)))
