from PIL import Image, ImageDraw, ImageFont
import math
FB="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"; FR="/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
def F(sz,bold=True): return ImageFont.truetype(FB if bold else FR, sz)
RED=(211,47,47); GREEN=(27,120,60); BLUE=(21,101,192); WHITE=(255,255,255); DARK=(33,33,33)
def canvas(src,cap_lines,boxes,arrows):
    im=Image.open(src).convert("RGB"); W,H=im.size
    caph=34*len(cap_lines)+28
    out=Image.new("RGB",(W,H+caph),WHITE); out.paste(im,(0,0)); d=ImageDraw.Draw(out)
    for (x,y,w,h,c) in boxes: d.rectangle([x-4,y-4,x+w+4,y+h+4],outline=c,width=4)
    for (x1,y1,x2,y2,c) in arrows:
        d.line([x1,y1,x2,y2],fill=c,width=4); ang=math.atan2(y2-y1,x2-x1)
        for a in (ang-0.4,ang+0.4): d.line([x2,y2,x2-16*math.cos(a),y2-16*math.sin(a)],fill=c,width=4)
    y=H+12
    for (t,c) in cap_lines: d.text((20,y),t,fill=c,font=F(21)); y+=34
    return out

# MAIN FIX exhibit 1: Technician menu - Edit labor present, Move labor absent (last item = Edit labor @ 397,771,148,48)
canvas("raw-tech-menu.png",
  [("As a Technician, right-click a work-order line that has an assigned technician: the menu ends at \"Edit labor\".",GREEN),
   ("\"Move labor\" is NOT in the list - technicians can no longer move labor. Edit labor is kept. FIXED.",GREEN)],
  [(397,771,148,48,GREEN)],
  [(300,700,395,780,GREEN)]).save("exhibit-1-technician-no-move-labor.png")

# MAIN FIX exhibit 2: Admin menu - Move labor present (last item = Move labor @ 397,771,148,48)
canvas("raw-admin-menu.png",
  [("As an Admin, right-click the same line: \"Move labor\" IS present (below \"Edit labor\") and completes a move.",BLUE),
   ("Authorised roles keep the ability - only Technician lost it.",BLUE)],
  [(397,771,148,48,BLUE)],
  [(300,700,395,780,BLUE)]).save("exhibit-2-admin-move-labor.png")

# DIVERGENCE exhibit A: grid row Unassigned (line 2 Labor @ 428,421,69,18)
canvas("raw-grid.png",
  [("On the work-order Lines tab, line 2 \"Service - Wheels off single or tandem axle\" shows Labor = Unassigned.",RED)],
  [(428,421,69,18,RED)],
  [(560,470,505,428,RED)]).save("exhibit-3-row-unassigned.png")

# DIVERGENCE exhibit B: Edit Line dialog technicians (David Haynes + Emily Madden ~ x525 y476 w305 h24)
canvas("raw-editline.png",
  [("But opening that same line's \"Edit Line\" dialog shows two technicians assigned: David Haynes and Emily Madden.",RED),
   ("So the row says Unassigned while the Edit Line dialog shows technicians - the two disagree.",RED)],
  [(525,476,305,24,RED)],
  [(430,560,528,486,RED)]).save("exhibit-4-editline-assigned.png")
print("done")
