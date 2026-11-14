import json,subprocess
from PIL import Image,ImageDraw,ImageFont
EV='/home/user/Manual-test-Cases/build/sv12545-aging-future-asof-2026-11-14/ev/'; OUT=EV+'../exhibits/'
F='/usr/share/fonts/truetype/dejavu/DejaVuSans'; fb=lambda s:ImageFont.truetype(F+'-Bold.ttf',s); fr=lambda s:ImageFont.truetype(F+'.ttf',s)
RED=(200,30,30); GRN=(20,140,60); BLU=(30,90,200)
def J(n): return json.load(open(EV+'cap/'+n+'.json'))['g']
def sc(b,k=2,pad=6): return [b[0]*k-pad,b[1]*k-pad,(b[0]+b[2])*k+pad,(b[1]+b[3])*k+pad]
def panel(img,title,col,boxes,caption,crop=None,num=True):
    img=img.copy(); d=ImageDraw.Draw(img)
    for i,(b,c) in enumerate(boxes):
        d.rectangle(b,outline=c,width=6)
        if num: x,y=b[0],b[1]; d.ellipse([x-26,y-26,x+14,y+14],fill=c); d.text((x-12,y-24),str(i+1),font=fb(28),fill='white')
    if crop: img=img.crop(crop)
    W=img.width; head=80; lines=caption; foot=24+len(lines)*44
    c=Image.new('RGB',(W,img.height+head+foot),'white'); c.paste(img,(0,head)); d=ImageDraw.Draw(c)
    d.rectangle([0,0,W,head],fill=col); d.text((22,18),title,font=fb(38),fill='white')
    y=img.height+head+14
    for ln in lines: d.text((22,y),ln,font=fr(32),fill=(30,30,30)); y+=44
    d.rectangle([0,0,W-1,c.height-1],outline=(170,170,170),width=3); return c
def stack(parts,name,gap=40):
    W=max(p.width for p in parts); parts=[p if p.width==W else p.resize((W,int(p.height*W/p.width)),Image.LANCZOS) for p in parts]
    c=Image.new('RGB',(W,sum(p.height for p in parts)+gap*(len(parts)-1)),'white'); y=0
    for p in parts: c.paste(p,(0,y)); y+=p.height+gap
    c.save(OUT+name); print(name,c.size)
TOT=[278,851,1292,48]
# EX1 before/after menu
b=Image.open(EV+'before-PIC1-qa-date-menu.png').convert('RGB')
before=panel(b,'BEFORE - QA branch before the fix (ticket picture, 11 Nov 2026)',RED,[],['Every day after today was greyed out and the next-month arrow did nothing.'],num=False)
a=Image.open(EV+'cap/A-menu-today.png').convert('RGB'); g=J('A-menu-today')
d15=sc(g['d15']); d30=sc(g['d30']); d14=sc(g['d14'])
days=[d15[0],d15[1],sc(g['d14'])[2],d30[3]]
after=panel(a,'AFTER - staging v26.45.4-f3d3d2d, 14 Nov 2026 (today = 11/14/2026)',GRN,[(days,GRN),(sc(g['next']),GRN),(sc(g['nexty']),GRN)],
 ['1  Every day after today (15 to 30 November) can be picked - none is greyed out.','2  The next-month arrow works (it moves to December).   3  The next-year arrow works (it moves to 2027).'],crop=(0,0,3200,1160))
stack([before,after],'EX1-before-after-date-menu.png')
# EX2 after picking Dec 31
a=Image.open(EV+'cap/B-after-dec31.png').convert('RGB'); g=J('B-after-dec31')
p2=panel(a,'A/R Aging Summary after picking 31 December 2026 (staging, 14 Nov 2026)',GRN,[(sc(g['chip']),GRN),(sc(g['row']),BLU),(sc(TOT),GRN)],
 ['1  The chip reads "As of: 12/31/2026" and the address ends with ?asOfDate=2026-12-31.',
  '2  10 Trucking: $300.00 was under Current today; on 12/31 it is under 1-30 Days (Total still $300.00).',
  '3  Totals for 12/31: Current $113.00 (today $43,985.93) - the rest moved into the older columns.'])
p2.save(OUT+'EX2-ar-summary-dec31.png'); print('EX2')
# EX3 saved link before/after (A/P Summary)
b=Image.open(EV+'before-PIC2-qa-saved-link.png').convert('RGB')
before=panel(b,'BEFORE - QA branch before the fix (ticket picture, 11 Nov 2026)',RED,[],['The link ...?asOfDate=2026-12-31 opened on today and the date was dropped from the address.'],num=False)
a=Image.open(EV+'cap/F-ap-summary-link.png').convert('RGB'); g=J('F-ap-summary-link')
after=panel(a,'AFTER - staging, 14 Nov 2026: /reports/ap-aging-summary?asOfDate=2026-12-31',GRN,[(sc(g['chip']),GRN),(sc(TOT),GRN)],
 ['1  The link opens on "As of: 12/31/2026" and the date stays in the address.','2  Current is $0.00 on 12/31: every bill due by then has moved into the past-due columns.'],crop=(0,0,3200,1800))
stack([before,after],'EX3-before-after-saved-link.png')
# EX4 past due counted to the picked day
a=Image.open(EV+'cap/C-ar-collection.png').convert('RGB'); g=J('C-ar-collection')
c1=panel(a,'A/R Aging Collection - opened by clicking 10 Trucking on the 12/31 summary',GRN,[(sc(g['chip']),GRN),(sc(g['cust']),GRN),(sc(g['due']),BLU),(sc(g['pd']),BLU)],
 ['1-2  Same day (12/31/2026) and the customer carried over from the summary.','3-4  S2-40221 is due Dec 13, 2026; Past Due = 18 = days from Dec 13 to Dec 31.'],crop=(0,0,3200,int((g['row'][1]+g['row'][3])*2+260)))
a=Image.open(EV+'cap/D-ap-detail.png').convert('RGB'); g=J('D-ap-detail')
c2=panel(a,'A/P Aging Detail - 123 Cannabis Forestlawn, as of 12/31/2026',GRN,[(sc(g['grp']),BLU),(sc(g['due']),BLU),(sc(g['pd']),BLU)],
 ['1  Bill ZZPV10282011 is in the "31-60 days past due" group.','2-3  Due Nov 28, 2026; Past Due = 33 = days from Nov 28 to Dec 31.'],crop=(0,int(g['grp'][1]*2-420),3200,int((g['row'][1]+g['row'][3])*2+200)))
stack([c1,c2],'EX4-past-due-counted-to-picked-day.png')
# EX5 bad links
parts=[]
for n,t in [('E1-link-1131','Link ?asOfDate=2026-11-31 (a day that does not exist)'),('E2-link-99991231','Link ?asOfDate=9999-12-31'),('E3-link-99991230','Link ?asOfDate=9999-12-30')]:
    a=Image.open(EV+f'cap/{n}.png').convert('RGB'); g=J(n); u=json.load(open(EV+f'cap/{n}.json'))['url']
    parts.append(panel(a,t,GRN,[(sc(g['chip']),GRN)],[f'Opens on "{"As of: 12/30/9999" if "30" in n[-2:] else "As of: 11/14/2026 (today)"}", no error.  Address after opening: {u.replace("https://app.staging.shopview.com","")}'],crop=(0,0,3200,560),num=False))
stack(parts,'EX5-unusable-links.png',gap=24)
# EX6 downloads
subprocess.run(['pdftoppm','-r','150','-f','1','-l','1','-png',EV+'ui/screen-arsum-1231.pdf','/tmp/_ex6'],check=True)
import glob; pg=Image.open(sorted(glob.glob('/tmp/_ex6*.png'))[0]).convert('RGB'); pg=pg.crop((0,0,pg.width,int(pg.height*0.20)))
csv1=open(EV+'ui/screen-arsum-1231.csv',encoding='utf-8-sig').read().splitlines()[:2]
c=Image.new('RGB',(pg.width,140),'white'); dd=ImageDraw.Draw(c); dd.text((30,20),'Download (CSV), first lines:',font=fb(26),fill=(30,30,30))
for i,l in enumerate(csv1): dd.text((30,60+i*36),l,font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf',26),fill=(30,30,30))
both=Image.new('RGB',(pg.width,pg.height+140),'white'); both.paste(pg,(0,0)); both.paste(c,(0,pg.height))
panel(both,'A/R Aging Summary on 12/31: ... > Download (PDF) / (CSV)',GRN,[],['The PDF header reads "As of Dec 31, 2026"; the CSV starts "As of: Dec 31, 2026" - the picked day.'],num=False).save(OUT+'EX6-downloads-print-picked-day.png'); print('EX6')
