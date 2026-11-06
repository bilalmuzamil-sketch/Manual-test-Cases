# usage: python3.12 exhibit2.py -> retest exhibits ../ev/rt-*.png from the field crops (red spell-underline pixels boxed green, missing underline boxed red)
import textwrap
from PIL import Image, ImageDraw, ImageFont
F='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; FB='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
f=lambda n,b=False: ImageFont.truetype(FB if b else F,n)
RED=(200,40,40); GRN=(30,130,60); EV='../ev/'
def isred(p): r,g,b=p[:3]; return r>180 and g<90 and b<90
def panel(path,label,width=1000,crop_h=None):
    im=Image.open(EV+path).convert('RGB')
    if crop_h: im=im.crop((0,0,im.width,min(im.height,crop_h)))
    px=im.load(); xs=[];ys=[]
    for y in range(im.height):
        for x in range(im.width):
            if isred(px[x,y]): xs.append(x); ys.append(y)
    d=ImageDraw.Draw(im)
    if xs: d.rectangle((min(xs)-10,min(ys)-48,max(xs)+10,max(ys)+8),outline=GRN,width=5); col=GRN; tag='underlined'
    else:
        dark=[(x,y) for y in range(0,im.height,2) for x in range(0,im.width,2) if sum(px[x,y][:3])<250]
        if dark: x0=min(a for a,_ in dark); x1=max(a for a,_ in dark); y0=min(b for _,b in dark); y1=max(b for _,b in dark); d.rectangle((x0-10,y0-8,x1+10,y1+14),outline=RED,width=5)
        col=RED; tag='no underline'
    s=width/im.width; im=im.resize((width,int(im.height*s)))
    out=Image.new('RGB',(width,im.height+46),'white'); dd=ImageDraw.Draw(out); dd.text((4,8),label+'  →  '+tag,font=f(24,True),fill=col); out.paste(im,(0,46)); return out
def col(parts,pad=18):
    W=max(p.width for p in parts); H=sum(p.height for p in parts)+pad*(len(parts)-1); o=Image.new('RGB',(W,H),'white'); y=0
    for p in parts: o.paste(p,(0,y)); y+=p.height+pad
    return o
def head(w,t,c): h=Image.new('RGB',(w,58),c); ImageDraw.Draw(h).text((14,14),t,font=f(26,True),fill='white'); return h
def cap(img,lines):
    ls=[]; [ls.extend(textwrap.wrap(l,int(img.width/12.5))+['']) for l in lines]
    o=Image.new('RGB',(img.width,img.height+30*len(ls)+16),'white'); o.paste(img,(0,0)); d=ImageDraw.Draw(o)
    for i,l in enumerate(ls): d.text((14,img.height+8+30*i),l,font=f(22),fill=(30,30,30))
    return o
def side(a,b,pad=30):
    o=Image.new('RGB',(a.width+b.width+pad,max(a.height,b.height)),'white'); o.paste(a,(0,0)); o.paste(b,(a.width+pad,0)); return o
# 1 before/after: customer notes, asset notes, tech story clicked out
B=col([head(1000,'BEFORE - production v26.45.1-6505633 (5 Nov)',RED),panel('prod-matrix/customer_notes-2-clicked-out.png','Edit Customer > Notes',crop_h=140),panel('prod-matrix/vehicle_notes-2-clicked-out.png','Edit Asset > Notes',crop_h=140),panel('prod-matrix/tech_story-2-clicked-out.png','Tech Story, after clicking out',crop_h=140)])
A=col([head(1000,'AFTER - QA branch sv12003 v26.45.1-b7be383 (6 Nov)',GRN),panel('branch-matrix/customer_notes-2-clicked-out.png','Edit Customer > Notes',crop_h=140),panel('branch-matrix/vehicle_notes-2-clicked-out.png','Edit Asset > Notes',crop_h=140),panel('branch-matrix/tech_story-2-clicked-out.png','Tech Story, after clicking out',crop_h=140)])
cap(side(B,A),['Typed in each box: "thee spellling are wrong wrng " (with a space at the end), then clicked outside the box. Production underlines nothing. The QA branch underlines "spellling" and "wrng" in all three, and they stay after clicking out.']).save(EV+'rt-1-before-after.png')
# 2 remaining: tech story ending with a full stop vs edit line description
R=col([head(1000,'Tech Story - text ends "wrng." (full stop)',RED),panel('branch-matrix-period-1/tech_story-1-typing.png','1. While typing',crop_h=140),panel('branch-matrix-period-1/tech_story-2-clicked-out.png','2. After clicking out',crop_h=140),panel('branch-matrix-period-1/tech_story-3-refocus.png','3. After clicking back in',crop_h=140)])
C=col([head(1000,'Edit Line > Description - same text, no space at the end',GRN),panel('branch-matrix-nospace-2/edit_line_description-1-typing.png','1. While typing'),panel('branch-matrix-nospace-2/edit_line_description-2-clicked-out.png','2. After clicking out'),panel('branch-matrix-nospace-2/customer_notes-1-typing.png','Edit Customer > Notes, while typing',crop_h=140)])
cap(side(R,C),['QA branch sv12003 v26.45.1-b7be383. Left: Tech Story with the sentence ending in a full stop. Nothing is underlined while typing or after clicking out (2 of 2 tries; with no space and no full stop, 3 of 3). The underlines appear only after clicking back into the box.','Right: the same text in Edit Line Description and Edit Customer Notes is underlined straight away, including the last word, so this is not how Chrome behaves in general.']).save(EV+'rt-2-tech-story-last-word.png')
# 3 remaining: edit line title vs plain chrome one-line box
T=col([head(1000,'Edit Line > Title - typed " wrng spellling"',RED),panel('branch-parth-r2/title-1-typing.png','1. While typing'),panel('branch-parth-r2/title-2-clicked-out.png','2. After clicking out'),panel('branch-parth-r2/title-3-refocus.png','3. After clicking back in')])
P=col([head(1000,'Comparison only: a plain Chrome one-line box',(90,90,90)),panel('branch-parth/plain-input-1-typing.png','1. While typing'),panel('branch-parth/plain-input-2-clicked-out.png','2. After clicking out')])
cap(side(T,P),['QA branch, Edit Line window, Title box (2 of 2 tries). Nothing is underlined while typing; the underlines appear only after clicking back in, which also selects the whole title.','Right, comparison only (a blank test page in the same browser, not ShopView): a one-line box underlines while typing and drops the underline on click-out. That last part is the Chrome behaviour Parth describes; the Title box does not underline while typing at all.']).save(EV+'rt-3-edit-line-title.png')
print('ok')
