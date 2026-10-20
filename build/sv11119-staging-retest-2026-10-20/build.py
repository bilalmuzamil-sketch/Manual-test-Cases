import sys, json; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from qa_exhibits import fnt, wrap, GRN, BLK, GREY
from PIL import Image, ImageDraw
BLU=(21,101,192); ORG=(230,120,0); S=2
d=json.load(open('ev/k9-top3.json')); G=d['geo']
def col(shot,g,mark=None,c=GRN):
    im=Image.open(f'ev/k9-top3-{shot}.png').convert('RGB'); dr=ImageDraw.Draw(im); pn=G[g]['panel']
    if mark:
        cd=[x for x in G[g]['cards'] if (x['n'] or '').endswith(mark)][0]; dr.rectangle(((cd['x'])*S-5,cd['y']*S-5,(cd['x']+cd['w'])*S+5,(cd['y']+cd['h'])*S+5),outline=c,width=7)
    else:
        top=G[g]['cards'][:3]; y1=top[-1]['y']+top[-1]['h']; dr.rectangle((pn['x']*S+6,top[0]['y']*S-8,(pn['x']+pn['w'])*S-6,y1*S+8),outline=GRN,width=7)
    y1=min(pn['y']+pn['h'],G[g]['cards'][2]['y']+G[g]['cards'][2]['h']+20)
    return im.crop((int(pn['x']*S)-10,int(pn['y']*S)-10,int((pn['x']+pn['w'])*S)+10,int(y1*S)))
def row(ims,labels,gap=24):
    f=fnt(28,True); H=max(i.height for i in ims)+50; W=sum(i.width for i in ims)+gap*(len(ims)-1); c=Image.new('RGB',(W,H),'white'); dr=ImageDraw.Draw(c); x=0
    for i,l in zip(ims,labels): dr.text((x,8),l,font=f,fill=BLK); c.paste(i,(x,50)); x+=i.width+gap
    return c
def panel(title,img,cap,W=1800):
    f=fnt(32,True); fc=fnt(26); d0=ImageDraw.Draw(Image.new('RGB',(10,10))); lines=wrap(d0,cap,fc,W-40)
    if img.width>W-40: img=img.resize((W-40,img.height*(W-40)//img.width))
    c=Image.new('RGB',(W,60+img.height+20+36*len(lines)+30),'white'); dr=ImageDraw.Draw(c); dr.text((20,12),title,font=f,fill=BLK); c.paste(img,(20,60)); dr.rectangle((19,59,20+img.width,60+img.height),outline=(200,205,212),width=2)
    y=80+img.height
    for l in lines: dr.text((20,y),l,font=fc,fill=GREY); y+=36
    return c
after=row([col('A1','A1','378',ORG),col('B1','B1','377',BLU),col('A2','A2'),col('B2','B2')],['Browser 1 moves','Browser 2 moves','Browser 1 refreshed','Browser 2 refreshed'])
before=Image.open('ev/sv11119-02-after-refresh.png').convert('RGB'); before=before.crop((0,0,before.width,int(before.height*0.745)))
ps=[panel('BEFORE - Staging build v26.40.19-c850386, 19 October 2026 (after both refresh)',before,'The column started Alpha, Mid, Zeta. Browser 1 moved Zeta to the top, then browser 2 (without refreshing) moved Mid to the top. After both refreshed they showed Zeta, Mid, Alpha: browser 2\'s move of Mid to the top was lost. (Under the spec it should have been Mid, Zeta, Alpha.)'),
    panel('AFTER - Staging build v26.40.20-0509710, 20 October 2026',after,'The column started Mid, Zeta, Alpha. Orange: browser 1 drags Alpha to the top. Blue: browser 2, without refreshing, drags Zeta to the top. Green: after both refresh, both browsers show Zeta, Alpha, Mid - browser 2\'s card is first and the other cards keep browser 1\'s order.')]
W=1800; c=Image.new('RGB',(W,sum(p.height for p in ps)+80),'white'); ImageDraw.Draw(c).text((20,20),'Board View: two people reorder the same technician at once',font=fnt(40,True),fill=BLK); y=80
for p in ps: c.paste(p,(0,y)); y+=p.height
c.save('sv11119-01-two-browsers-before-after.png'); print(c.size)
