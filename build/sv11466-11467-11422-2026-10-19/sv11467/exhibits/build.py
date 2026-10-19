import sys,json; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, RED, GRN, BLU
from PIL import Image, ImageDraw
E='/home/user/Manual-test-Cases/build/sv11466-11467-11422-2026-10-19/sv11467/ev/'; O='/home/user/Manual-test-Cases/build/sv11466-11467-11422-2026-10-19/sv11467/exhibits/'
def pan(name,title,note,num=1):
    j=json.load(open(E+name+'-S2-33351-hd.json')); r=j['rows'][0]; P=r['pill']; B=r['badges']
    x0=P['x']-14; y0=min(b['y'] for b in B)-8; x1=max(b['x']+b['w'] for b in B)+40; y1=P['y']+P['h']+10
    return panel(E+name+'-S2-33351-hd.png',crop=(x0-40,y0,x1+260,y1),title=title,
      boxes=[(P['x']-3,P['y']-2,P['x']+P['w']+3,P['y']+P['h']+2,GRN,num)],notes=[(num,GRN,note)])
c=pan('tech_view-compact','AFTER: Tech View, Compact (Staging, build v26.40.19-c850386, 19 Oct)','The red 2 and blue 3 sit on the pill\'s top corner; "Ready For Review" is fully readable.')
# BEFORE: the ticket's own picture (top half = Tech View Compact on 16 Oct)
b=Image.open(E+'ticket-before-62484.png').convert('RGB').crop((0,0,380,95)); b=b.resize((b.width*3,b.height*3),Image.LANCZOS)
hdr=Image.new('RGB',(b.width,70),(244,246,250)); d=ImageDraw.Draw(hdr)
from ticket_exhibit import font
d.text((24,18),'BEFORE: Tech View, Compact (from this ticket, 16 Oct, build v26.40.19-754919e)',fill=(25,25,25),font=font(26,True))
cap=Image.new('RGB',(b.width,70),(255,255,255)); ImageDraw.Draw(cap).text((24,18),'The red 2 and blue 3 covered "view" (red box drawn on the ticket).',fill=RED,font=font(26))
bef=Image.new('RGB',(b.width,b.height+140),(255,255,255)); bef.paste(hdr,(0,0)); bef.paste(b,(0,70)); bef.paste(cap,(0,70+b.height))
bef.save(E+'before-panel.png'); 
stack([bef,c]).save(O+'sv11467-01-before-after-compact.png')
r=pan('tech_view-regular','Tech View, Regular','Same position on the corner.')
f=pan('tech_view-comfortable','Tech View, Comfortable (taller pill)','Same position on the corner.')
l=pan('list-x','List (unchanged)','The List pill, for comparison: the bubbles sit in the same place.')
stack([r,f,l]).save(O+'sv11467-02-all-densities-and-list.png')
for n in ['01-before-after-compact','02-all-densities-and-list']: print(n,Image.open(O+f'sv11467-{n}.png').size)
