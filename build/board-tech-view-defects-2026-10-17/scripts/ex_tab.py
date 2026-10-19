"""SV-11422 exhibit: four panels from x22c (staging v26.40.19-31ad1e1, 1440x900 at 2x), boxes on the focused element."""
from PIL import Image, ImageDraw, ImageFont
F='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'; f=ImageFont.truetype(F,26); fs=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',22)
P=[('A','#1a7f37','1. Rows in Unassigned: first Tab lands on the first row, S2-37015 (passes)',(0,286,1440,330)),
   ('B1','#c62828','2. Search S2-16688: Unassigned empty, the only row is far below. First Tab lands on the "Unassigned" header (fails)',(0,232,1440,282)),
   ('B3','#1a7f37','3. Same search with S2-16688 scrolled onto the screen: Tab lands on the row (passes)',(0,554,1440,600)),
   ('C','#c62828','4. Board View, same search: first Tab lands on the "Unassigned" column header; the card is in Brandi Smith\'s column off to the right (fails)',(17,205,303,252))]
W,H=1440,900; out=Image.new('RGB',(W*2,(H+90)*2),'white')
for k,(n,col,txt,box) in enumerate(P):
    im=Image.open(f'/tmp/qa11310/ex/x22c-{n}.png').resize((W,H)); d=ImageDraw.Draw(im)
    x0,y0,x1,y1=box; d.rectangle((x0+3,y0-6,x1-3,y1+6),outline=col,width=6)
    cv=Image.new('RGB',(W,H+90),'white'); cv.paste(im,(0,0)); dc=ImageDraw.Draw(cv)
    dc.rectangle((0,H,W,H+90),fill=col)
    words=txt.split(); line=''; ly=H+10
    for w in words:
        t=(line+' '+w).strip()
        if dc.textlength(t,font=f)>W-30: dc.text((15,ly),line,fill='white',font=f); ly+=36; line=w
        else: line=t
    dc.text((15,ly),line,fill='white',font=f)
    out.paste(cv,((k%2)*W,(k//2)*(H+90)))
out=out.resize((2048,int(2048*out.height/out.width)))
out.save('/home/user/Manual-test-Cases/build/board-tech-view-defects-2026-10-17/sv11422/ev/sv11422-01-first-tab.png'); print(out.size)
