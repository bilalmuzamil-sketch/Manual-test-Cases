from PIL import Image, ImageDraw, ImageFont
F='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'; FR='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
B=(25,90,200)
im=Image.open('ev/prod/walk-2-imported-list.png').convert('RGB')
c=im.crop((0,50*2,1600*2,250*2)).copy(); d=ImageDraw.Draw(c)
def box(x0,y0,x1,y1,n,lx,ly):
    d.rectangle((x0*2,(y0-50)*2,x1*2,(y1-50)*2),outline=B,width=7)
    d.ellipse((lx*2-30,(ly-50)*2-30,lx*2+30,(ly-50)*2+30),fill=B); d.text((lx*2,(ly-50)*2),str(n),font=ImageFont.truetype(F,40),fill='white',anchor='mm')
box(1308,85,1342,116,1,1325,68)
box(730,86,907,116,2,818,68)
box(28,190,1569,233,3,14,211)
W=c.width; cap=Image.new('RGB',(W,230),'white'); dd=ImageDraw.Draw(cap); f=ImageFont.truetype(FR,40)
for i,t in enumerate(['1 = the list view button (three lines with dots), right of the filters.',
  '2 = Status filter, with only Imported ticked.',
  '3 = the imported invoice ZZQTYPDF-P (click its row to open it).']): dd.text((24,20+i*65),t,font=f,fill=B)
t=Image.new('RGB',(W,90),(40,40,40)); ImageDraw.Draw(t).text((24,20),'PRODUCTION (app.shopview.com) - Work Orders, All tab, list view, Status: Imported',font=ImageFont.truetype(F,40),fill='white')
o=Image.new('RGB',(W,t.height+c.height+cap.height),'white'); o.paste(t,(0,0)); o.paste(c,(0,t.height)); o.paste(cap,(0,t.height+c.height)); o.save('ev/prod-where-to-click.png'); print(o.size)
