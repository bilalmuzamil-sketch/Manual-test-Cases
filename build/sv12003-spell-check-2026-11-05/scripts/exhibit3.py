# SV-12003 retest 3 exhibits: before (b7be383) vs after (9ae1530) + the two new boxes. Red-underline pixels are boxed on the image.
from PIL import Image, ImageDraw, ImageFont
F='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; FB='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
f=ImageFont.truetype(F,26); fb=ImageFont.truetype(FB,28); fh=ImageFont.truetype(FB,34)
def red_boxes(im):
    px=im.load(); cols={}
    for y in range(im.height):
        for x in range(im.width):
            r,g,b=px[x,y]
            if r>190 and g<90 and b<90: cols.setdefault(x//1,[]).append(y)
    xs=sorted(cols); runs=[]
    for x in xs:
        if runs and x-runs[-1][1]<=6: runs[-1][1]=x; runs[-1][2]=min(runs[-1][2],min(cols[x])); runs[-1][3]=max(runs[-1][3],max(cols[x]))
        else: runs.append([x,x,min(cols[x]),max(cols[x])])
    return [r for r in runs if r[1]-r[0]>8]
def panel(path,label,ok,W=1100):
    im=Image.open(path).convert('RGB'); sc=W/im.width; im=im.resize((W,int(im.height*sc)))
    d=ImageDraw.Draw(im); rb=red_boxes(im)
    for x0,x1,y0,y1 in rb: d.rectangle([x0-6,y0-30,x1+6,y1+6],outline=(0,140,60) if ok else (200,0,0),width=4)
    hdr=Image.new('RGB',(W,60),(230,245,234) if ok else (252,232,232)); dh=ImageDraw.Draw(hdr); dh.text((14,14),label,font=fb,fill=(20,20,20))
    out=Image.new('RGB',(W,im.height+60),'white'); out.paste(hdr,(0,0)); out.paste(im,(0,60)); return out,len(rb)
def grid(rows,title,cap,name):
    W=1100; pads=20; h=sum(max(a.height,b.height)+pads for a,b in rows)+90+110
    out=Image.new('RGB',(2*W+3*pads,h),'white'); d=ImageDraw.Draw(out); d.text((pads,20),title,font=fh,fill=(0,0,0)); y=80
    for a,b in rows: out.paste(a,(pads,y)); out.paste(b,(2*pads+W,y)); y+=max(a.height,b.height)+pads
    yy=y+10
    for line in cap: d.text((pads,yy),line,font=f,fill=(40,40,40)); yy+=36
    out.save('ev/'+name); print(name,out.size)
E='ev/'
a,na=panel(E+'branch-matrix-period-1/tech_story-1-typing.png','BEFORE (b7be383): Tech Story, text ends in "." - none',False)
b,nb=panel(E+'branch-matrix-r3-period/tech_story-1-typing.png','AFTER (9ae1530): same text - underlined',True)
c,nc=panel(E+'branch-parth/title-1-typing.png','BEFORE (b7be383): Edit Line Title, typing - none',False)
e,ne=panel(E+'branch-r3-gate/title-1-typing.png','AFTER (9ae1530): Edit Line Title, typing - underlined',True)
print('red runs',na,nb,nc,ne)
grid([(a,b),(c,e)],'SV-12003: the two remaining items, before and after Parth\'s fix',['Left: QA branch sv12003 build v26.45.1-b7be383 (my comment of 6 Nov 01:57 CST). Right: same branch, build v26.45.1-9ae1530, 6 Nov 2026.','Green boxes: the misspellings now underlined while typing. Typed text: "thee spellling are wrong wrng." and " wrng spellling".'],'r3-1-before-after.png')
g1,_=panel(E+'branch-r3-gate/wizard-1-typing.png','Line Complete > Tech stories step, while typing',True)
g2,_=panel(E+'branch-r3-gate/gate-1-typing.png','Mark Reviewed > Tech story window, while typing',True)
g3,_=panel(E+'branch-r3-gate/gate-2-clicked-out.png','Tech story window, after clicking outside the box',True)
g4,_=panel(E+'branch-r3-gate/gate-3-refocus.png','Tech story window, after clicking back in',True)
grid([(g1,g2),(g3,g4)],'SV-12003: the two new tech story boxes (build 9ae1530)',['Top left: work order S12003-17580, line 1 Complete, "Tech stories" step. Others: work order S2-17422 (Review), Mark Reviewed, "Tech story" window.','Typed text: " wrng spellling" (no space at the end). Green boxes: the underlined misspellings.'],'r3-2-new-boxes.png')
