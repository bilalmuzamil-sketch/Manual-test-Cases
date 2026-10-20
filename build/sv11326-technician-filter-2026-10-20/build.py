import sys, json; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from qa_exhibits import fnt, wrap, GRN, BLK, GREY
from PIL import Image, ImageDraw
BLU=(21,101,192); ORG=(230,120,0)
def panel(title,img,cap,W=1800):
    f=fnt(32,True); fc=fnt(26); d0=ImageDraw.Draw(Image.new('RGB',(10,10))); lines=wrap(d0,cap,fc,W-40)
    if img.width>W-40: img=img.resize((W-40,img.height*(W-40)//img.width))
    c=Image.new('RGB',(W,60+img.height+20+36*len(lines)+30),'white'); d=ImageDraw.Draw(c); d.text((20,12),title,font=f,fill=BLK); c.paste(img,(20,60)); d.rectangle((19,59,20+img.width,60+img.height),outline=(200,205,212),width=2)
    y=80+img.height
    for l in lines: d.text((20,y),l,font=fc,fill=GREY); y+=36
    return c
def stack(title,ps):
    W=max(p.width for p in ps); c=Image.new('RGB',(W,sum(p.height for p in ps)+80),'white'); ImageDraw.Draw(c).text((20,20),title,font=fnt(40,True),fill=BLK); y=80
    for p in ps: c.paste(p,(0,y)); y+=p.height
    return c
def shot(name,marks,crop):
    im=Image.open(f'ev/{name}.png').convert('RGB'); b=json.load(open(f'ev/{name}.json')); d=ImageDraw.Draw(im)
    for k,c in marks.items():
        if k in b: x0,y0,x1,y1=b[k]; d.rectangle((x0-5,y0-5,x1+5,y1+5),outline=c,width=6)
    x0,y0,x1,y1=crop; return im.crop((x0*2,y0*2,x1*2,y1*2))
T='Staging build v26.40.20-0509710, 20 October 2026, Admin'
E1=stack('Board View: the new Technician filter',[
 panel('No technician chosen',shot('b0-none',{'chip':BLU,'brandi':GRN,'aaron':GRN},(0,60,1440,470)),'Blue box: the new Technician chip, right after Assigned to me. Every technician column shows, including the pinned Brandi Smith column and Aaron Baker (green boxes).'),
 panel('Aaron Baker chosen',shot('b2-aaron',{'chip':BLU,'aaron':GRN},(0,60,1440,470)),'The chip reads "Technician: Aaron Baker" (blue). Only Aaron Baker\'s column is left (green), with his 22 work orders. Unassigned and the pinned Brandi Smith column are hidden.'),
 panel('Aaron Baker, Brandi Smith and Unassigned chosen',shot('b3-three',{'chip':BLU,'un':GRN,'brandi':GRN,'aaron':GRN},(0,60,1440,470)),'The chip reads "Technician: Aaron Baker, +2". Exactly the three chosen columns show (green).'),
])
E1.save('sv11326-01-board-technician-filter.png')
E2=stack(T,[
 panel('The Technician list',shot('b1-menu',{'search':BLU,'un':GRN,'over':ORG},(780,60,1440,700)),'A search box (blue), then Unassigned first (green), then the technicians by first name and last name. Orange: the line "This change would exceed the 50-value limit across all filters" shows as soon as the list opens, before anything is ticked (see the question at the end).'),
])
E2.save('sv11326-02-technician-list.png')
E3=stack(T,[
 panel('Technician: Aaron Baker + search S2-37620 (Aaron is only on its line, not its lead)',shot('b4-empty',{'chip':BLU,'search':BLU,'empty':GRN,'btn':GRN},(0,60,1440,560)),'Nothing matches, so the board shows "No work orders match these filters", "Try removing a filter to widen your results." and a Clear all filters button (green).'),
 panel('After clicking Clear all filters',shot('b5-cleared',{'chip':BLU,'un':GRN},(0,60,1440,560)),'The Technician chip is cleared (blue) and S2-37620 shows in Unassigned (green), because it has no lead technician.'),
])
E3.save('sv11326-03-empty-state-and-clear.png')
E4=stack(T,[
 panel('List, with Aaron Baker still chosen',shot('b6-list',{'assigned':BLU,'asset':BLU},(0,60,1440,560)),'List shows no Technician chip (only Status, Assigned to me and Asset on Site) and lists every work order as if no technician were chosen.'),
 panel('Back to Tech View, groups collapsed',shot('t1-aaron',{'chip':BLU,'aaron':GRN},(0,60,1440,400)),'The choice comes back: "Technician: Aaron Baker" (blue) and only Aaron Baker\'s group shows (green).'),
])
E4.save('sv11326-04-list-and-tech-view.png')
for f in ['sv11326-01-board-technician-filter.png','sv11326-02-technician-list.png','sv11326-03-empty-state-and-clear.png','sv11326-04-list-and-tech-view.png']: print(f,Image.open(f).size)
q1=json.load(open('ev/q1-darrell-column.json')); hx0=q1['col'][0]/2
cx0=max(0,int(hx0-40)); 
Q=stack('Question for Chris - '+T,[
 panel('1. A deactivated technician still has a column',shot('q1-darrell-column',{'hdr':ORG},(cx0,60,min(1440,cx0+700),560)),'Darrell Martinez is deactivated: his name is cut short to "D.." next to the grey "Inactive" label (orange), and the cards below say "Darrell Martinez". His column still shows his 113 work orders.'),
 panel('2. He is not in the Technician list',shot('q2-darrell-search',{'search':BLU,'menu':ORG},(cx0,60,min(1440,cx0+700),560)),'Typing "Darrell" in the Technician list finds only Darrell Thomas (blue: search box). There is no Darrell Martinez to choose. The red line about the 50-value limit is also there, though nothing is ticked.'),
])
Q.save('sv11326-05-question-deactivated-technician.png'); print(Q.size)
