"""Put a clear BEFORE/AFTER banner on Board/Tech exhibits whose picture did not say which part is which (QA lead, 19 Oct)."""
from PIL import Image, ImageDraw, ImageFont
B=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',30); R=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',24)
GRN=(26,127,55); RED=(198,40,40); GRY=(55,65,81)
def wrap(d,t,f,w):
    out=[];line=''
    for x in t.split():
        s=(line+' '+x).strip()
        if d.textlength(s,font=f)>w: out.append(line); line=x
        else: line=s
    return out+[line]
def banner(img,title,sub,col):
    W=img.width; tmp=ImageDraw.Draw(Image.new('RGB',(10,10)))
    TL=wrap(tmp,title,B,W-40); L=wrap(tmp,sub,R,W-40); h=16+len(TL)*40+8+len(L)*32+18
    o=Image.new('RGB',(W,img.height+h),'white'); d=ImageDraw.Draw(o); d.rectangle((0,0,W,h),fill=col)
    y=16
    for l in TL: d.text((20,y),l,fill='white',font=B); y+=40
    y+=4
    for l in L: d.text((20,y),l,fill='white',font=R); y+=32
    o.paste(img,(0,h)); return o
SRC='/tmp/qa11310/ba/'; OUT='/home/user/Manual-test-Cases/build/board-tech-view-bugs-2026-10-16/before-after-fix-2026-10-19/'
items={
 'sv11405-01-card-pill':('AFTER THE FIX: staging (captured 17 Oct on build v26.40.19-754919e; re-measured on v26.40.19-31ad1e1 on 19 Oct, the same)','There is no BEFORE picture: Board View is not on Production, and this ticket has no screenshot. The ticket says the card used to show a plain status badge with no red or blue counts.'),
 'sv11402-01-header-drag':('AFTER THE FIX: staging (build v26.40.19-754919e, 17 Oct)','There is no BEFORE picture: Tech View is not on Production, and this ticket has no screenshot. Left: while dragging. Right: after letting go.'),
 'sv11406-01-held-header-push':('AFTER THE FIX: staging (build v26.40.19-754919e, 17 Oct)','There is no BEFORE picture: Tech View is not on Production, and this ticket has no screenshot. Steps 1 to 3 below are one scroll, top to bottom.'),
 'sv11407-01-back-top-item':('AFTER THE FIX: staging (build v26.40.19-754919e, 17 Oct)','There is no BEFORE picture: these views are not on Production, and this ticket has no screenshot. Inside the picture, "before opening" and "after Back" mean before and after pressing Back, not before and after the fix.'),
 'sv11409-01-avatar-names':('AFTER THE FIX: staging (build v26.40.19-754919e, 17 Oct)','There is no BEFORE picture: these views are not on Production, and this ticket has no screenshot.'),
}
for n,(t,s) in items.items():
    o=banner(Image.open(SRC+n+'.png').convert('RGB'),t,s,GRN); o.save(OUT+n+('-v3.png' if n.startswith('sv11405') else '-v2.png')); print(n,o.size)
# SV-11422: the ticket's own picture as BEFORE above the four AFTER panels
tk=Image.open(SRC+'ticket11422.png').convert('RGB'); after=Image.open('/home/user/Manual-test-Cases/build/board-tech-view-defects-2026-10-17/sv11422/ev/sv11422-01-first-tab.png').convert('RGB')
W=after.width; tk=tk.resize((W,int(tk.height*W/tk.width)))
top=banner(tk,'BEFORE THE FIX: the picture in this ticket (staging build v26.40.18-7d85b7d, 16 Oct)','With rows in Unassigned, the first Tab landed on the Unassigned group header (red box), not on the first row S2-36336.',RED)
bot=banner(after,'AFTER THE FIX: staging today (build v26.40.19-31ad1e1, 19 Oct)','1 and 3 (green): fixed, Tab lands on a row. 2 and 4 (red): still wrong when the only work order is out of sight.',GRN)
o=Image.new('RGB',(W,top.height+bot.height+20),'white'); o.paste(top,(0,0)); o.paste(bot,(0,top.height+20))
o.save(OUT+'sv11422-01-first-tab-v2.png'); print('sv11422',o.size)
