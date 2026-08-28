from PIL import Image, ImageDraw, ImageFont
d='/home/user/Manual-test-Cases/build/sv9087-credit-term-2026-08-27/evidence'
def f(sz,b=False): return ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf'%('-Bold' if b else ''),sz)
red=(200,0,0); grn=(0,140,60); blk=(20,20,20); blue=(0,70,190); amber=(180,95,0)

# crop each screenshot to the informative top band (badge + invoice date field + invoice doc header dates)
def panel(fn, title, tcol, boxes):
    im=Image.open(f'{d}/{fn}').convert('RGB').crop((0,80,1600,660))  # drop the browser chrome row, keep badge+dates
    dr=ImageDraw.Draw(im)
    for (x1,y1,x2,y2,c) in boxes: dr.rectangle([x1,y1-80,x2,y2-80],outline=c,width=5)
    bar=Image.new('RGB',(im.width,58),tcol); ImageDraw.Draw(bar).text((16,14),title,font=f(27,True),fill='white')
    out=Image.new('RGB',(im.width,im.height+58),'white'); out.paste(bar,(0,0)); out.paste(im,(0,58))
    return out

# measured from the live DOM (getBoundingClientRect): badge y134; invoiced-layout dates y223-265; draft layout is ~40px lower (the Estimate/Invoice toggle row)
BADGE=(33,129,120,160,blue)
DATEFLD=(1116,86,1250,132,amber)          # draft: the editable Invoice Date field, top-right
DRAFT_DOC=(1056,258,1314,308,grn)         # draft-layout invoice-document dates (both lines)
INVOICED_DOC=(1056,217,1314,269,grn)      # invoiced-layout invoice-document dates (both lines), ~40px higher
p1=panel('RA-1-complete.png',        "1 — COMPLETE work order — invoice date Aug 27, 2026 (due Sep 26)", blk,   [BADGE,DATEFLD,DRAFT_DOC])
p2=panel('RA-2-invoiced.png',        "2 — INVOICED — badge flips to Invoiced, invoice date Aug 27, 2026 (due Sep 26)", grn, [BADGE,INVOICED_DOC])
p3=panel('RA-3-reversed.png',        "3 — REVERSED — back to Complete; re-invoice date defaults to TODAY (Aug 27)", amber, [BADGE,DATEFLD,DRAFT_DOC])
p4=panel('RA-4b-reinvoiced-backdated.png', "4 — RE-INVOICED — date changed BACK to Aug 21, 2026 (due Sep 20), no error", grn, [BADGE,INVOICED_DOC])

W=1500
def sc(im): return im.resize((W,int(im.height*W/im.width)))
panels=[sc(x) for x in (p1,p2,p3,p4)]
cap=300
H=sum(x.height for x in panels)+cap
canvas=Image.new('RGB',(W,H),'white'); y=0
for x in panels: canvas.paste(x,(0,y)); y+=x.height
dr=ImageDraw.Draw(canvas)
lines=[
 (blk,True, "SV-9087 — “Invoice reversal date cannot be changed, throws an error”."),
 (blk,False,"Reproduced the reporter's exact flow on sv9087.qa.shopview.com (build v26.35.4-b216483). Customer P&S Road"),
 (blk,False,"Service is stored as the mis-spelled term “NET 30”. Steps: reverse the invoice → recreate it (date defaults to"),
 (blk,False,"today) → change the invoice date back to the original earlier date."),
 (grn,True, "RESULT: PASSED. After the reversal the invoice date was changed from Aug 27 back to Aug 21, 2026 — the page"),
 (grn,False,"did NOT blank, no error boundary, the due date recomputed to Sep 20 (+30), and the invoice re-created with the"),
 (grn,False,"corrected date."),
 (red,False,"On the current (unfixed) build this is where the page throws an error and refuses to change the date — exactly"),
 (red,False,"what the customer reported (“it will not let me change the date … Gives us an error”)."),
 ((90,90,90),False,"Green box = the date on the invoice document (Invoice Date / Terms NET 30 / Due date); orange box = the"),
 ((90,90,90),False,"editable Invoice Date field; blue box = the work-order status badge."),
]
yy=y+12
for col,bold,txt in lines:
    dr.text((16,yy),txt,font=f(19,bold),fill=col); yy+=25
canvas.save(f'{d}/EX-A-reversal-reinvoice-date-change.png')
print('saved', canvas.size)
