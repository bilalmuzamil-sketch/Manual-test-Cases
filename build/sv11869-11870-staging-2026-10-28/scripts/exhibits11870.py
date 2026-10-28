# Builds the SV-11870 exhibits from the live screenshots + the saved element positions (boxes drawn at real coordinates).
import json, csv, io
from PIL import Image, ImageDraw, ImageFont
F='/usr/share/fonts/truetype/dejavu/'; fb=ImageFont.truetype(F+'DejaVuSans-Bold.ttf',22); fr=ImageFont.truetype(F+'DejaVuSans.ttf',20); fs=ImageFont.truetype(F+'DejaVuSans.ttf',16)
RED=(214,40,40); GREEN=(22,140,60); GREY=(110,110,110)
def row_of(csvf):
    rows=list(csv.reader(open(csvf,encoding='utf-8')))
    h=rows[0]; return h,rows[1:]
def make(case,out,title,crop,ok,note_lines,mark_key=None):
    im=Image.open(f'ev/import/staging-{case}-2-after-import.png').convert('RGB')
    boxes=json.load(open(f'ev/import/staging-{case}-2-boxes.json'))
    d=ImageDraw.Draw(im)
    for b in boxes:
        if mark_key and mark_key not in b['t']: continue
        col=GREEN if ok else RED
        pad=(60,10) if ok else (6,4)
        d.rectangle([b['x']-pad[0],b['y']-pad[1],b['x']+b['w']+pad[0]+40*ok,b['y']+b['h']+pad[1]],outline=(200,30,30) if not ok else (0,90,30),width=4)
    im=im.crop(crop)
    # header panel with what was uploaded
    h,rows=row_of(f'ev/import/{case}.csv')
    idx_item=[i for i,c in enumerate(h) if c.startswith('*Item')][0]; idx_t=[i for i,c in enumerate(h) if c.startswith('*Line Title')][0]; idx_d=[i for i,c in enumerate(h) if c.startswith('Line Description')][0]
    lines=[]
    for n,r in enumerate(rows, start=2):
        lines.append(f'Row {n}:  {h[idx_item]} = "{r[idx_item]}"   |   {h[idx_t]} = ' + (f'"{r[idx_t]}"' if r[idx_t] else '(left empty)') + f'   |   {h[idx_d]} = "{r[idx_d]}"')
    W=max(im.width,1260); top=60+34*len(lines)+(34*len(note_lines)); bot=10
    canvas=Image.new('RGB',(W,im.height+top+bot),'white'); cd=ImageDraw.Draw(canvas)
    cd.text((16,12),title,font=fb,fill=(20,20,20))
    y=52
    for l in lines: cd.text((16,y),l,font=fs,fill=GREY); y+=34
    for l in note_lines: cd.text((16,y),l,font=fr,fill=(GREEN if ok else RED)); y+=34
    canvas.paste(im,(0,top)); canvas.save(out); print(out,canvas.size)
make('labor-empty','ev/SV-11870-01-labor-empty-title.png','Labor row with *Line Title left empty: refused with the new message',(230,170,1430,370),False,['Page shows: Failed row 2 - "Line Title cannot be empty."  Invoices Created: 0'],'Line Title')
make('part-empty','ev/SV-11870-02-part-empty-title.png','Part row with *Line Title left empty: refused with the same message',(230,170,1430,370),False,['Page shows: Failed row 2 - "Line Title cannot be empty."  Invoices Created: 0'],'Line Title')
make('shop-supplies-empty','ev/SV-11870-03-shop-supplies-no-title.png','Shop Supplies row with no title: imports (no title needed)',(900,880,1440,1000),True,['Page shows: "All invoices have been imported successfully."  No failed rows.'],'imported')
make('old-header-empty','ev/SV-11870-04-old-column-names.png','File with the OLD column names, title left empty: same new message',(230,170,1430,370),False,['Page shows: Failed row 2 - "Line Title cannot be empty."  (old names still accepted)'],'Line Title')
