from PIL import Image, ImageDraw, ImageFont
d='/home/user/Manual-test-Cases/build/sv9087-credit-term-2026-08-27/evidence'
def f(sz,b=False): return ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf'%('-Bold' if b else ''),sz)
red=(200,0,0); grn=(0,140,60); blk=(20,20,20); amber=(180,95,0)
W=1500
def sc(im,w=W): return im.resize((w,int(im.height*w/im.width)))
def titled(img,title,tcol,crop=None):
    im=img.crop(crop) if crop else img
    bar=Image.new('RGB',(im.width,58),tcol); ImageDraw.Draw(bar).text((16,14),title,font=f(26,True),fill='white')
    out=Image.new('RGB',(im.width,im.height+58),'white'); out.paste(bar,(0,0)); out.paste(im,(0,58)); return out

# PROD before: crop top band with the dates (Invoice Date field + invoice doc dates), draw box on Due date
pb=Image.open(d+'/PROD-repro-before.png').convert('RGB')
drp=ImageDraw.Draw(pb)
drp.rectangle([1068,262,1325,304],outline=red,width=5)      # invoice doc Invoice Date / Due date (both Aug 27)
drp.rectangle([760,595,1010,625],outline=red,width=4)       # Terms NET 30 + Due date Aug 27 row
p1=titled(pb,"PRODUCTION (app.shopview.com, UNFIXED) — customer term 'NET 30' (mis-spelled). Due date = Aug 27 = the invoice date (0 days, should be +30).",red,crop=(0,80,1600,660))
# PROD crash
pc=Image.open(d+'/PROD-repro-crash.png').convert('RGB')
p2=titled(pc,"PRODUCTION — after changing the Invoice Date: the whole Finance section CRASHES ('Something went wrong loading this section').",red,crop=(0,80,1600,430))
# sv9087 fixed (RA-4a: changed date to Aug 21, due Sep 20, no crash)
fx=Image.open(d+'/RA-4a-date-changed-back.png').convert('RGB')
drf=ImageDraw.Draw(fx); drf.rectangle([1068,258,1325,308],outline=grn,width=5)
p3=titled(fx,"QA BRANCH sv9087 (FIXED) — same 'NET 30' customer, same date change to Aug 21: invoice re-renders, due recomputes to Sep 20 (+30), NO crash.",grn,crop=(0,80,1600,660))

panels=[sc(p1),sc(p2),sc(p3)]
cap=210
H=sum(x.height for x in panels)+cap
canvas=Image.new('RGB',(W,H),'white'); y=0
for x in panels: canvas.paste(x,(0,y)); y+=x.height
dr=ImageDraw.Draw(canvas)
lines=[
 (blk,True, "SV-9087 — reproduced on PRODUCTION, then confirmed fixed on the QA branch."),
 (blk,False,"On production (the live, unfixed build) a customer stored with the mis-spelled credit term 'NET 30' shows the wrong due date (equal to the"),
 (blk,False,"invoice date instead of +30), and CHANGING the invoice date crashes the entire Finance section with an error boundary — exactly what the"),
 (blk,False,"customer reported. The mis-spelled term was seeded the same way we test it (it is the value the Contacts CSV import stores)."),
 (grn,True, "On the QA branch sv9087 the identical steps work: the invoice re-renders, the due date recomputes to +30, and there is no crash."),
 (grn,False,"This confirms two things at once: our reproduction method is valid, and the fix genuinely resolves the reported bug."),
 ((90,90,90),False,"Production test org 72b2cc90 (QA Testing workplace). The seeded customer's term was restored to its original value after the test."),
]
yy=y+12
for col,bold,txt in lines: dr.text((16,yy),txt,font=f(19,bold),fill=col); yy+=26
canvas.save(d+'/EX-PROD-reproduction.png'); print('saved', canvas.size)
