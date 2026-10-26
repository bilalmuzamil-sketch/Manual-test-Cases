import json
from PIL import Image,ImageDraw,ImageFont
EV='/home/user/Manual-test-Cases/build/sv11631-part-sale-parts-tab-2026-10-26/ev/'; C='/tmp/qa11631/w/cap/'
B=json.load(open(C+'boxes.json')); T=json.load(open(C+'touch.json'))
F=lambda n,b=False: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf'%('-Bold' if b else ''),n)
RED=(204,30,30); GREEN=(0,132,61); ORANGE=(214,110,0); BLUE=(30,90,200)
def badge(d,x,y,n,col,s=50): d.ellipse([x,y,x+s,y+s],fill=col); d.text((x+s/2,y+s/2),str(n),font=F(int(s*0.6),True),fill='white',anchor='mm')
def rect(d,b,z,ox,oy,col,pad=5,w=5): d.rectangle([(b[0]-pad)*z-ox,(b[1]-pad)*z-oy,(b[0]+b[2]+pad)*z-ox,(b[1]+b[3]+pad)*z-oy],outline=col,width=w)
def frame(im,head,sub,notes,col,maxw=None):
    W=max(im.width,1100); top=150; lines=[]
    for n,t in notes:
        words=t.split(); cur=''; first=True
        for wd in words:
            if F(27).getlength(cur+' '+wd)>W-130: lines.append((n if first else None,cur)); cur=wd; first=False
            else: cur=(cur+' '+wd).strip()
        lines.append((n if first else None,cur))
    out=Image.new('RGB',(W,im.height+top+30+46*len(lines)),'white'); d=ImageDraw.Draw(out)
    d.rectangle([0,0,W,top],fill=(244,245,247)); fs=38
    while F(fs,True).getlength(head)>W-40: fs-=1
    d.text((24,16),head,font=F(fs,True),fill=col); sl=sub.split(' || '); [d.text((24,74+30*i),t,font=F(24),fill=(60,60,60)) for i,t in enumerate(sl)]
    out.paste(im,(0,top)); y=top+im.height+20
    for n,t in lines:
        if n is not None: badge(d,24,y,n,col,40)
        d.text((80,y+6),t,font=F(27),fill=(30,30,30)); y+=46
    return out
SUB='sv11631.qa.shopview.com · build v26.43.1-a53a4ac · 26 Oct 2026 || '
# F1 part number
im=Image.open(C+'A-1440-pn-hover.png').convert('RGB'); a=B['A']; z=2; ox,oy=480*z,130*z; im=im.crop((ox,oy,1000*z,290*z)); d=ImageDraw.Draw(im)
rect(d,a['pn'],z,ox,oy,RED); badge(d,(a['pn'][0]+a['pn'][2]+10)*z-ox,(a['pn'][1]-2)*z-oy,1,RED)
frame(im,'R2: a 12-character part number is cut off',SUB+'1440 wide · part sale P2-109',[(1,'Part number WK4707Q-23KW shows as "WK4707Q-23..." and pointing at it shows nothing, so the full number cannot be read.')],RED).save(EV+'SV-11631_F1-part-number-cut.png')
# F2
full=Image.open(C+'A-1440-p2109.png').convert('RGB'); z=2; tb=a['table']; ox=1060*z
top=full.crop((ox,125*z,1440*z,265*z)); d=ImageDraw.Draw(top)
rect(d,a['badge'],z,ox,125*z,RED); badge(d,(a['badge'][0]-8)*z-ox-50,(a['badge'][1]-6)*z-125*z,1,RED)
by=tb[1]+tb[3]; bot=full.crop((ox,(by-60)*z,1440*z,(by+12)*z)); d2=ImageDraw.Draw(bot)
d2.rectangle([1100*z-ox,(by-13)*z-(by-60)*z,1420*z-ox,(by+1)*z-(by-60)*z],outline=RED,width=5); badge(d2,4,(by-19)*z-(by-60)*z,2,RED,44)
im=Image.new('RGB',(top.width,top.height+40+bot.height),'white'); im.paste(top,(0,0)); dd=ImageDraw.Draw(im)
dd.text((20,top.height+6),'... bottom of the same table ...',font=F(22),fill=(120,120,120)); im.paste(bot,(0,top.height+40))
frame(im,'R12: at 1440 the table no longer fits',SUB+'1440 wide · part sale P2-109',[(1,'A part with status "Requested" (just added, no price yet) makes the Status column wider, and the badge is half hidden under the pinned Actions column.'),(2,'The table now scrolls sideways (1146px of content in a 1130px space).')],RED).save(EV+'SV-11631_F2-requested-scrolls-at-1440.png')
# F3/F4 phone taps
for key,fn,title,note in [('desc','F3-phone-tap-description','R3: on a phone, tapping a cut-off Description shows nothing','Tapped "Engine Oil Filter, Kubota V24..." (part sale P2-162, read-only row). The full name never appears.'),('avatar','F4-phone-tap-avatar','On a phone, tapping the avatar shows nothing','Tapped the "JJ" avatar on the same row. The design says "Requested by {name} on {date}" shows on tap; nothing appears.')]:
    t=T[key]; z=3; im=Image.open(C+f'T-{key}-after.png').convert('RGB'); ox,oy=0,300*z; im=im.crop((0,oy,390*z,560*z)); d=ImageDraw.Draw(im)
    rect(d,t['el'],z,ox,oy,RED,4,6); tx,ty=t['tap']; d.ellipse([tx*z-ox-22,ty*z-oy-22,tx*z-ox+22,ty*z-oy+22],outline=(255,140,0),width=6)
    bx,byy=((t['el'][0]+t['el'][2]-20)*z-ox,(t['el'][1]+7)*z-oy) if key=='desc' else (40*z-ox,(t['el'][1]+7)*z-oy)
    badge(d,bx,byy,1,RED,54)
    frame(im,title,SUB+'390 wide phone, touch screen · Chrome phone mode',[(1,note+' The orange ring marks where the finger tapped.')],RED).save(EV+f'SV-11631_{fn}.png')
print('ok')
# ---- extra points (comment 2), orange
ORG=ORANGE
# E1 category vs design
z=2; br=Image.open(C+'B-1440-p2162.png').convert('RGB'); b=B['B']; cy=b['cat'][1]
left=br.crop((990*z,int((cy-50)*z),1230*z,int((cy+45)*z))); d=ImageDraw.Draw(left); rect(d,b['cat'],z,990*z,int((cy-50)*z),ORG); badge(d,(b['cat'][0]+b['cat'][2]-24)*z-990*z,(cy+5)*z-int((cy-50)*z),1,ORG,44)
dz=Image.open('/tmp/qa11631/design/2ce68a46720cbca6610daaf7cd164ea5.png').convert('RGB'); dc=dz.crop((990,220,1230,315)).resize((480,190)); d3=ImageDraw.Draw(dc); d3.rectangle([(1041-990)*2,(262-220)*2,(1135-990)*2,(294-220)*2],outline=GREEN,width=5); badge(d3,(1135-990)*2-44,(262-220)*2+10,2,GREEN,40)
im=Image.new('RGB',(left.width+dc.width+40,max(left.height,dc.height)+50),'white'); dd=ImageDraw.Draw(im)
dd.text((10,8),'Branch (now)',font=F(26,True),fill=ORG); dd.text((left.width+40,8),'Design (target)',font=F(26,True),fill=GREEN)
im.paste(left,(0,50)); im.paste(dc,(left.width+40,50))
frame(im,'Category is cut where the design shows it in full',SUB+'1440 wide · part sale P2-162 vs the ticket design at 1440',[(1,'The branch Category box shows "HD-Fil..." (only about 54px of the 96px box holds text).'),(2,'The design shows "HD-Filters" in full in the same column at the same width.')],ORG).save(EV+'SV-11631_E1-category-cut-vs-design.png')
# E2 actions heading
th=b['actTh']; tx=b['actText']; ox,oy=1270*z,125*z; im=br.crop((ox,oy,1425*z,190*z)); d=ImageDraw.Draw(im)
c1=(th[0]+th[2]/2)*z-ox; c2=(tx[0]+tx[2]/2)*z-ox
d.line([c1,0,c1,im.height],fill=GREEN,width=3); d.line([c2,0,c2,im.height],fill=ORG,width=3)
rect(d,th,z,ox,oy,ORG,0,3)
frame(im.resize((im.width*2,im.height*2)),'The "Actions" heading is not centred over its column',SUB+'1440 wide · part sale P2-162 · picture enlarged 2x',[(1,'Green line: centre of the Actions column. Orange line: centre of the word "Actions". The word sits about 4px to the left.')],ORG).save(EV+'SV-11631_E2-actions-heading-off-centre.png')
# E3 sell price under actions at 1024
z=2; cimg=Image.open(C+'C-1024-p2109.png').convert('RGB'); c=B['C']; sy=c['sell'][1]; ox,oy=760*z,int(130*z)
im=cimg.crop((ox,oy,1010*z,int((sy+50)*z))); d=ImageDraw.Draw(im)
rect(d,c['sell'],z,ox,oy,ORG,3,4); ax=c['act'][0]*z-ox; d.line([ax,0,ax,im.height],fill=RED,width=3)
badge(d,ax-52,6,1,ORG,40)
frame(im,'At 1024, the right edge of the Sell Price box hides under Actions',SUB+'1024 wide · part sale P2-109 (rows with an Order button)',[(1,'Orange box: the Sell Price field. Red line: where the pinned Actions column begins. About 7px of the box sits under it; the value itself is still readable.')],ORG).save(EV+'SV-11631_E3-sell-price-edge-under-actions.png')
# E4 tooltip over dropdown
z=2; dimg=Image.open(C+'D-1440-tooltip-over-dropdown.png').convert('RGB'); dd_=B['D']; ox,oy=225*z,200*z
im=dimg.crop((ox,oy,1000*z,330*z)); d=ImageDraw.Draw(im)
rect(d,dd_['tip'],z,ox,oy,ORG,2,4); rect(d,dd_['firstOption'],z,ox,oy,RED,2,4)
badge(d,(dd_['tip'][0]-28)*z-ox,(dd_['tip'][1]+dd_['tip'][3]/2)*z-oy-22,1,ORG,44); badge(d,(dd_['firstOption'][0]+dd_['firstOption'][2]+6)*z-ox,(dd_['firstOption'][1]+dd_['firstOption'][3]/2)*z-oy-22,2,RED,44)
frame(im,'The Description tooltip stays on top of the open dropdown',SUB+'1440 wide · part sale P2-109',[(1,'The tooltip with the full description stays open after the dropdown is opened.'),(2,'It covers the left part of the first dropdown option.')],ORG).save(EV+'SV-11631_E4-tooltip-over-dropdown.png')
# BA before/after
W2,H2=1600,684
pr=Image.open('/tmp/qa11631/w/m-prod-p285/w1440.png').convert('RGB').crop((270*2,60*2,1440*2,560*2)).resize((W2,H2))
bn=br.crop((270*2,60*2,1440*2,560*2)).resize((W2,H2))
im=Image.new('RGB',(W2,2*H2+100),'white'); dd=ImageDraw.Draw(im)
dd.rectangle([0,0,W2,50],fill=(253,236,234)); dd.text((14,10),'BEFORE: production app.shopview.com · build v26.43.0-ffea43c · 26 Oct 2026 · part sale P2-85',font=F(24,True),fill=RED); im.paste(pr,(0,50))
dd.rectangle([0,H2+50,W2,H2+100],fill=(230,245,236)); dd.text((14,H2+60),'AFTER: sv11631.qa.shopview.com · build v26.43.1-a53a4ac · 26 Oct 2026 · part sale P2-162',font=F(24,True),fill=GREEN); im.paste(bn,(0,H2+100))
frame(im,'Parts tab of a part sale, before and after (1440 wide)','Production has no P2-162, so the before uses P2-85: same screen, same width, different parts. || ',[(1,'Before: the table is about 2188px wide in a 1122px space, so it scrolls sideways; rows are 49 to 139px tall with labels inside the boxes.'),(2,'After: all columns fit (1130px in 1130px), rows are 41px, and Actions is pinned on the right.')],BLUE).save(EV+'SV-11631_BA-before-after-1440.png')
print('extras ok')
