#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont
F="/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"; FB="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FM="/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"; FMB="/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf"
def f(p,s): return ImageFont.truetype(p,s)
OUT="/home/user/Manual-test-Cases/build/sv9940-average-cost-2026-09-22/ev/"
INK=(28,32,38); GREY=(110,118,128); RED=(198,40,40); REDBG=(253,236,234)
GREEN=(27,120,62); GREENBG=(232,245,236); LINE=(208,214,222)
tmp=ImageDraw.Draw(Image.new("RGB",(10,10)))
def wd(t,fo): return tmp.textlength(t,font=fo)

# ---------- exhibit 1: before vs after
bi=Image.open("/tmp/prod9940/crop_before.png").convert("RGB")
ai=Image.open("/tmp/sv9940/crop_after.png").convert("RGB")
W=bi.width; h=max(bi.height,ai.height); pad=30; gap=70; top=124; hdr=78
title="A four-figure Average Cost survives the save that used to destroy it"
sub="Both parts had their Average Cost set correctly first. Then only Min and Max were changed and saved - the customer's own trigger. 22 September 2026."
foot=["In each case the cost was already correct before this step, and the only thing edited was Min and Max. On production the cost then collapses to $1.00 and the",
      "sell price is recalculated from it; on the fix branch it is untouched. Below $1,000 nothing goes wrong, which is why smaller parts never showed the problem.",
      "",
      "Read back from the part's own edit screen after a full page reload, not from the inventory list."]
CW=int(max([W*2+pad*2+gap, wd(title,f(FB,30))+pad*2, wd(sub,f(F,19))+pad*2]+[wd(x,f(F,19))+pad*2 for x in foot]))
im=Image.new("RGB",(CW, top+hdr+h+34*len(foot)+52),"white"); d=ImageDraw.Draw(im)
d.text((pad,26),title,font=f(FB,30),fill=INK); d.text((pad,72),sub,font=f(F,19),fill=GREY)
gx=int((CW-(W*2+gap))/2); x1=max(pad,gx); x2=x1+W+gap
d.rounded_rectangle([x1-8,top,x1+W+8,top+hdr-14],8,fill=REDBG)
d.rounded_rectangle([x2-8,top,x2+W+8,top+hdr-14],8,fill=GREENBG)
d.text((x1+6,top+6),"BEFORE  -  PRODUCTION app.shopview.com",font=f(FB,21),fill=RED)
d.text((x1+6,top+34),"Average Cost was $1,069.03. After saving a Min/Max change: $1.00",font=f(F,17),fill=RED)
d.text((x2+6,top+6),"AFTER  -  fix branch sv9940 (v26.36.9-e96da48)",font=f(FB,21),fill=GREEN)
d.text((x2+6,top+34),"the same step leaves it at $1,069.03",font=f(F,17),fill=GREEN)
y=top+hdr; im.paste(bi,(x1,y)); im.paste(ai,(x2,y))
d.rectangle([x1-2,y-2,x1+W+1,y+bi.height+1],outline=RED,width=3)
d.rectangle([x2-2,y-2,x2+W+1,y+ai.height+1],outline=GREEN,width=3)
for X,col,dy in [(x1,RED,-16),(x2,GREEN,0)]:
    d.rectangle([X+20,y+330+dy,X+212,y+378+dy],outline=col,width=4)
yy=y+h+20
for ln in foot: d.text((pad,yy),ln,font=f(F,19),fill=INK if ln else GREY); yy+=34
im.save(OUT+"1-before-and-after-the-average-cost.png"); print(OUT+"1…", im.size)

# ---------- exhibit 2: the payload
rows=[("PRODUCTION  -  the save that breaks it", '"purchasePrice": "1,069.03"', "a comma-formatted STRING; the value lands as $1.00", RED, REDBG),
      ("FIX BRANCH  -  the same save",          '"purchasePrice": 1069.03',   "a NUMBER; the value is kept", GREEN, GREENBG)]
title2="The same request, sent two different ways"
sub2="Both are POST /api/inventory/parts/change, captured from the browser as the Save button was pressed."
foot2=["The screen sends the cost back as the text it is displaying. Once the value passes $1,000 that text carries a thousands comma, and the comma is where it is cut.",
       "That is why typing a new cost appears to work and it only breaks later: the value you type is still a plain number, so the first save is correct. The next save of",
       "anything else on that part - Min and Max, a bin quantity, a category - re-sends it as text and destroys it.",
       "",
       "The same wrong value from SV-8447, $3,896.04, was tried too: it survives on the fix branch, including after a second save."]
CW2=int(max([wd(title2,f(FB,30))+pad*2, wd(sub2,f(F,19))+pad*2]+[wd(x,f(F,19))+pad*2 for x in foot2]+[wd(r[1],f(FMB,26))+420 for r in rows]))
BH=104
im2=Image.new("RGB",(CW2, 124+len(rows)*(BH+18)+34*len(foot2)+56),"white"); d2=ImageDraw.Draw(im2)
d2.text((pad,26),title2,font=f(FB,30),fill=INK); d2.text((pad,72),sub2,font=f(F,19),fill=GREY)
yy=124
for lab,code,note,col,bg in rows:
    d2.rounded_rectangle([pad,yy,CW2-pad,yy+BH],10,fill=bg)
    d2.text((pad+18,yy+12),lab,font=f(FB,20),fill=col)
    d2.text((pad+18,yy+44),code,font=f(FMB,26),fill=col)
    d2.text((pad+18+wd(code,f(FMB,26))+26,yy+52),note,font=f(F,19),fill=INK)
    yy+=BH+18
yy+=14
for ln in foot2: d2.text((pad,yy),ln,font=f(F,19),fill=INK if ln else GREY); yy+=34
im2.save(OUT+"2-the-cost-is-sent-back-as-text.png"); print(OUT+"2…", im2.size)
