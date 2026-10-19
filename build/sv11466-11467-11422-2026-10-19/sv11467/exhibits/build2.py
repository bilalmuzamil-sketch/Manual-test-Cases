import sys,json; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import font, RED, GRN
from PIL import Image, ImageDraw
E='/home/user/Manual-test-Cases/build/sv11466-11467-11422-2026-10-19/sv11467/ev/'; O='/home/user/Manual-test-Cases/build/sv11466-11467-11422-2026-10-19/sv11467/exhibits/'
W=1140
def frame(img,title,note,col):
    img=img.resize((W,int(img.height*W/img.width)),Image.LANCZOS)
    out=Image.new('RGB',(W,img.height+150),(255,255,255)); d=ImageDraw.Draw(out)
    d.rectangle((0,0,W,70),fill=(244,246,250)); d.text((24,20),title,fill=(25,25,25),font=font(26,True))
    out.paste(img,(0,70)); d.rectangle((0,70,W-1,70+img.height),outline=(200,205,215),width=2)
    d.text((24,img.height+92),note,fill=col,font=font(26)); return out
def after(name):
    j=json.load(open(E+name+'-S2-33351-hd.json')); r=j['rows'][0]; P=r['pill']; B=r['badges']
    x0=P['x']-20; x1=max(b['x']+b['w'] for b in B)+40; y0=min(b['y'] for b in B)-3; y1=P['y']+P['h']+8
    im=Image.open(E+name+'-S2-33351-hd.png').convert('RGB').crop((int(x0*2),int(y0*2),int(x1*2),int(y1*2)))
    # make it wide like the BEFORE crop (W x ~285): pad left/right to keep the pill the same size as in the before picture
    tgt_pill=0.63*W  # pill width share in the before crop
    sc=tgt_pill/(P['w']*2); im=im.resize((int(im.width*sc),int(im.height*sc)),Image.LANCZOS)
    can=Image.new('RGB',(W,im.height),(255,255,255)); can.paste(im,(int(0.075*W)-int(20*2*sc),0)); return can
b=Image.open(E+'ticket-before-62484.png').convert('RGB').crop((0,25,380,95))
B=frame(b,'BEFORE: Tech View, Compact (from this ticket, 16 Oct 2026)','Before the fix: the red 2 and blue 3 covered "view" (red box from the ticket).',RED)
A=frame(after('tech_view-compact'),'AFTER: Tech View, Compact (Staging, 19 Oct 2026)','After the fix: the bubbles sit on the top corner and "Ready For Review" is readable.',GRN)
o=Image.new('RGB',(W,B.height+A.height+20),(255,255,255)); o.paste(B,(0,0)); o.paste(A,(0,B.height+20)); o.save(O+'sv11467-01-before-after-compact.png')
ps=[frame(after('tech_view-regular'),'Tech View, Regular','Same place on the corner; the word stays readable.',GRN),
    frame(after('tech_view-comfortable'),'Tech View, Comfortable (taller pill)','Same place on the corner; the word stays readable.',GRN),
    frame(after('list-x'),'List, for comparison','The List pill: the bubbles sit in the same place as in Tech View.',GRN)]
o=Image.new('RGB',(W,sum(p.height for p in ps)+40),(255,255,255)); y=0
for p in ps: o.paste(p,(0,y)); y+=p.height+20
o.save(O+'sv11467-02-all-densities-and-list.png')
for n in ['01-before-after-compact','02-all-densities-and-list']: print(n,Image.open(O+f'sv11467-{n}.png').size)
