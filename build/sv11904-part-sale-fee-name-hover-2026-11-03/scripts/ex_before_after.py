import json
from PIL import Image, ImageDraw, ImageFont
F='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; FB='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
f=lambda n,b=False: ImageFont.truetype(FB if b else F,n)
RED=(200,40,40); GRN=(30,130,60); S=2
def panel(tag,img,boxes,title,col,caps):
    d=json.load(open(f'ev/{tag}.json')); th={t['t']:t for t in d['thAfter']}; fe=th['Fees & Discounts']; c0=d['cells'][0]; hb=th['Fees & Discounts']['h']
    top=c0['tdB'][1]-hb-12; x0=fe['x']-430; x1=1440; y1=c0['tdB'][1]+150
    im=Image.open(f'ev/{img}').convert('RGB').crop((x0*S,top*S,x1*S,y1*S))
    W=im.width; out=Image.new('RGB',(W,im.height+80+len(caps)*34+20),'white'); out.paste(im,(0,80)); dr=ImageDraw.Draw(out)
    dr.rectangle((0,0,W,70),fill=col); dr.text((14,8),title[0],font=f(26,True),fill='white'); dr.text((14,40),title[1],font=f(19),fill='white')
    def bx(r,cl): x,y,w,h=r; dr.rectangle(((x-x0)*S-6,(y-top)*S+80-6,(x-x0+w)*S+6,(y-top+h)*S+80+6),outline=cl,width=5)
    bx((fe['x'],c0['tdB'][1]-hb,fe['w'],hb),RED if col==RED else GRN)
    for r,cl in boxes(d): bx(r,cl)
    for i,(t,cl) in enumerate(caps): dr.text((14,im.height+92+i*34),t,font=f(22,i==0),fill=cl)
    return out
pb=panel('prod-1440','prod-1440-hover-row0.png',lambda d:[(d['cells'][0]['kids'][0]['b'],RED)],
  ('BEFORE - Production, part sale P-85 (Trucks Hill 2)','build v26.43.5-77de68c, 1440 wide, 3 Nov 2026'),RED,
  [('Heading "Fees & Discounts" wraps onto 2 lines (heading row 49 px).',RED),('Pointing at "ZZAUTOTEST Par..." shows nothing - the full name cannot be read.',RED)])
def ab(d):
    h=[x for x in d['hover'] if x['row']==0][0]; return [(h['elB'],GRN),(h['tipB'][0],GRN)]
pa=panel('branch-1440','branch-1440-hover-row0.png',ab,
  ('AFTER - QA branch sv11904, part sale P2-162','build v26.43.5-2999cf9, 1440 wide, 3 Nov 2026'),GRN,
  [('Heading on one line (heading row 39 px, same as every other heading).',GRN),('Pointing at "Such A Lo..." shows the full name "Such a Long name testing".',GRN)])
W=max(pb.width,pa.width); out=Image.new('RGB',(W,pb.height+pa.height+30),'white'); out.paste(pb,(0,0)); out.paste(pa,(0,pb.height+30))
out.save('ev/before-after-1440.png'); print(out.size)
