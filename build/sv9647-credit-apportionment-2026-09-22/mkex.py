#!/usr/bin/env python3
"""SV-9647 exhibits, built from clips captured live on 2026-09-22."""
from PIL import Image, ImageDraw, ImageFont
F  = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FB = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
def f(p,s): return ImageFont.truetype(p,s)
OUT="/home/user/Manual-test-Cases/build/sv9647-credit-apportionment-2026-09-22/ev/"
INK=(28,32,38); GREY=(110,118,128); RED=(198,40,40); REDBG=(253,236,234)
GREEN=(27,120,62); GREENBG=(232,245,236); BLUE=(21,101,192); LINE=(208,214,222)

def panel(before, after, title, sub, blabel, alabel, bnote, anote, foot, out, pad=30):
    bi=Image.open(before).convert("RGB"); ai=Image.open(after).convert("RGB")
    W=max(bi.width,ai.width)
    bi=bi.resize((W,int(bi.height*W/bi.width))); ai=ai.resize((W,int(ai.height*W/ai.width)))
    h=max(bi.height,ai.height)
    tmp=ImageDraw.Draw(Image.new("RGB",(10,10)))
    def wd(t,fo): return tmp.textlength(t,font=fo)
    needed=[wd(title,f(FB,30))+pad*2, wd(sub,f(F,20))+pad*2]
    needed+=[wd(x,f(F,20))+pad*2 for x in foot]
    colw=int(max(W, wd(blabel,f(FB,21))+20, wd(bnote,f(F,17))+20, wd(alabel,f(FB,21))+20, wd(anote,f(F,17))+20))
    needed.append(colw*2+pad*3)
    CW=int(max(needed))
    top=122; hdr=76; footh=34*len(foot)+36
    im=Image.new("RGB",(CW, top+hdr+h+footh+pad),"white"); d=ImageDraw.Draw(im)
    d.text((pad,26), title, font=f(FB,30), fill=INK)
    d.text((pad,70), sub,  font=f(F,20),  fill=GREY)
    gap=70
    gx=int((CW-(colw*2+gap))/2)
    x1=max(pad,gx); x2=x1+colw+gap
    d.rounded_rectangle([x1-8,top,x1+colw+8,top+hdr-14],8,fill=REDBG)
    d.rounded_rectangle([x2-8,top,x2+colw+8,top+hdr-14],8,fill=GREENBG)
    d.text((x1+6,top+6),  blabel, font=f(FB,21), fill=RED)
    d.text((x1+6,top+34), bnote,  font=f(F,17),  fill=RED)
    d.text((x2+6,top+6),  alabel, font=f(FB,21), fill=GREEN)
    d.text((x2+6,top+34), anote,  font=f(F,17),  fill=GREEN)
    y=top+hdr
    im.paste(bi,(x1,y)); im.paste(ai,(x2,y))
    d.rectangle([x1-2,y-2,x1+W+1,y+bi.height+1], outline=RED,   width=3)
    d.rectangle([x2-2,y-2,x2+W+1,y+ai.height+1], outline=GREEN, width=3)
    yy=y+h+20
    for ln in foot:
        d.text((pad,yy), ln, font=f(F,20), fill=INK if ln else GREY); yy+=32
    im.save(out); print(out, im.size)

def single(src, title, sub, boxes, foot, out, scale=1.0):
    s=Image.open(src).convert("RGB")
    if scale!=1.0: s=s.resize((int(s.width*scale),int(s.height*scale)))
    tmp=ImageDraw.Draw(Image.new("RGB",(10,10)))
    def wd(t,fo): return tmp.textlength(t,font=fo)
    pad=30; top=122; footh=34*len(foot)+34
    CW=int(max([s.width+pad*2, wd(title,f(FB,29))+pad*2, wd(sub,f(F,19))+pad*2]+[wd(x,f(F,20))+pad*2 for x in foot]))
    im=Image.new("RGB",(CW, top+s.height+footh),"white"); d=ImageDraw.Draw(im)
    d.text((pad,26), title, font=f(FB,29), fill=INK)
    d.text((pad,70), sub,  font=f(F,19),  fill=GREY)
    im.paste(s,(pad,top)); d.rectangle([pad-2,top-2,pad+s.width+1,top+s.height+1],outline=LINE,width=2)
    for (bx,by,bw,bh,col) in boxes:
        d.rectangle([pad+bx,top+by,pad+bx+bw,top+by+bh], outline=col, width=3)
    yy=top+s.height+18
    for ln in foot:
        d.text((pad,yy), ln, font=f(F,20), fill=INK if ln else GREY); yy+=32
    im.save(out); print(out, im.size)


panel("/tmp/stg9647/clip_BEFORE_ps_4.66.png", "/tmp/sv9647/clip_AFTER_ps_4.66.png",
 "A $4.66 invoice used to list $87.98 of credits. Now it lists $4.66.",
 "The same part-sale invoice, same two credit memos, same single payment - captured on both builds on 22 September 2026.",
 "BEFORE  -  current live behaviour (staging, build v26.36.8-e2c29c5)",
 "AFTER  -  the fix branch sv9647 (build v26.36.8-fc4dd05)",
 "the two credits print their FULL face: $22.00 + $65.98 = $87.98 on a $4.66 invoice",
 "each credit prints only the part it actually paid: $1.17 + $3.49 = $4.66",
 ["This is the customer's complaint exactly. The credits were $22.00 and $65.98, and they were spread across two invoices in one payment.",
  "Before the fix every invoice printed the whole face of every credit, so a $4.66 invoice appeared to have $87.98 paid against it while still",
  "ending Balance $0.00. After the fix each invoice shows only its own share, and the rest of each credit appears on the other invoice.",
  "",
  "Nothing about the amounts owed changed - the totals, the tax and the Balance are identical on both sides. Only the itemisation was wrong."],
 OUT+"1-before-and-after-the-customers-invoice.png")

panel("/tmp/stg9647/clip_BEFORE_wo_145.04.png", "/tmp/sv9647/clip_AFTER_wo_145.04.png",
 "The same thing on a work order, with larger numbers",
 "A $145.04 work order invoice settled alongside a $406.09 one, from two credits ($200.00 and $300.00) plus $51.13 cash, in one payment.",
 "BEFORE  -  staging, build v26.36.8-e2c29c5",
 "AFTER  -  fix branch sv9647, build v26.36.8-fc4dd05",
 "$51.13 + $300.00 + $200.00 = $551.13 printed on a $145.04 invoice",
 "$51.13 + $56.35 + $37.56 = $145.04 - it adds up",
 ["Built deliberately as a second shape, on a work order rather than a part sale, to check the fix is not specific to one kind of document.",
  "The two slices add back to the full credits across the pair: $37.56 + $162.44 = $200.00, and $56.35 + $243.65 = $300.00.",
  "So every penny of both credits is still accounted for - it is now shown on the invoice that actually used it."],
 OUT+"2-before-and-after-a-work-order.png")

single("/tmp/sv9647/clip_xwp_hd.png",
 "Two shops, one payment: each invoice still shows only its own share",
 "Work orders in two different locations of the same company, settled together from one $250.00 credit. Fix branch sv9647, build v26.36.8-fc4dd05.",
 [(3,248,374,64,RED)],
 ["This is the case most likely to have been broken by a change like this, because paying invoices across two locations in one go is a normal thing to do.",
  "The $250.00 credit was shared between two invoices. This one shows $104.96 - its own share - alongside the $40.08 of cash that went to it.",
  "The full $250.00 face appears nowhere on the document, which is the result we needed."],
 OUT+"3-two-locations-one-payment.png")

single("/tmp/sv9647/clip_deposit.png",
 "Deposits are untouched, including the line that explains an overpayment",
 "A $200.00 deposit taken by gift card against a $145.04 work order. Fix branch sv9647, build v26.36.8-fc4dd05.",
 [(3,243,374,62,BLUE)],
 ["Deposits print differently from credits on purpose: the row shows what was used ($145.04) and the line beneath it spells out the deposit's",
  "full value and what happens to the remainder - \"of $200.00 - $54.96 will be credited\". That wording is unchanged by this fix.",
  "Cash rows, card rows, estimate documents and every total on the page were checked the same way and are also unchanged."],
 OUT+"4-deposits-unchanged.png")
