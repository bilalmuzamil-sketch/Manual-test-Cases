# usage: python3.12 exhibit.py -> builds the annotated SV-7898 exhibits in ../ev/exh-*.png from the captured phone screenshots + element rects
import json, textwrap
from PIL import Image, ImageDraw, ImageFont
EV='../ev/'; F='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; FB='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
def font(s,b=False): return ImageFont.truetype(FB if b else F,s)
W=560; DPR=3
COL={'red':(214,40,40),'green':(30,150,70),'blue':(30,90,220),'orange':(230,120,0)}
def panel(png, boxes, title, caption, tcol='blue', crop=None):
    im=Image.open(EV+png+'.png').convert('RGB'); rects=json.load(open(EV+png+'.json'))
    if crop: im=im.crop((0,crop[0]*DPR,im.width,crop[1]*DPR))
    k=W/im.width; im=im.resize((W,int(im.height*k)),Image.LANCZOS); d=ImageDraw.Draw(im)
    oy=(crop[0] if crop else 0)
    n=0
    for lab,col,num in boxes:
        for r in [r for r in rects if r['lab']==lab][:1]:
            x0=r['x']*DPR*k-4; y0=(r['y']-oy)*DPR*k-4; x1=(r['x']+r['w'])*DPR*k+4; y1=(r['y']+r['h']-oy)*DPR*k+4
            d.rectangle([x0,y0,x1,y1],outline=COL[col],width=5)
            if num:
                cx,cy=max(18,x0-2),max(18,y0-2); d.ellipse([cx-17,cy-17,cx+17,cy+17],fill=COL[col]); d.text((cx,cy),str(num),font=font(20,True),fill='white',anchor='mm')
    head=Image.new('RGB',(W,56),COL[tcol]); hd=ImageDraw.Draw(head); hd.text((14,28),title,font=font(21,True),fill='white',anchor='lm')
    lines=[]; 
    for para in caption.split('\n'): lines+=textwrap.wrap(para,46) or ['']
    cap=Image.new('RGB',(W,24+len(lines)*27),'white'); cd=ImageDraw.Draw(cap)
    for i,l in enumerate(lines): cd.text((14,12+i*27),l,font=font(19),fill=(20,20,20))
    out=Image.new('RGB',(W,head.height+im.height+cap.height),'white'); out.paste(head,(0,0)); out.paste(im,(0,head.height)); out.paste(cap,(0,head.height+im.height)); return out
def row(panels,fn,top=None):
    h=max(p.height for p in panels); w=sum(p.width for p in panels)+20*(len(panels)+1)
    th=0
    if top: lines=textwrap.wrap(top,int(w/14.5)); th=20+len(lines)*30
    o=Image.new('RGB',(w,h+40+th),(235,237,240)); d=ImageDraw.Draw(o)
    if top:
        for i,l in enumerate(lines): d.text((20,14+i*30),l,font=font(22,True),fill=(20,20,20))
    x=20
    for p in panels: o.paste(p,(x,20+th)); d.rectangle([x-1,19+th,x+p.width,20+th+p.height],outline=(150,150,150)); x+=p.width+20
    o.save(EV+fn); print(fn,o.size)
import sys
P1=panel('ZP-toolbar-abort-none-t2',[('emptynote','red',1),('toast','red',2)],'BEFORE - production v26.45.1',
 '1 The paperclip left an empty note: the photo is gone (the server shows the note with 0 attachments).\n2 The only message is "Network Error". No Retry. A Take Photo picture cannot be picked again.','red')
P2=panel('Y-toolbar-abort-retry-t6',[('banner','green',1),('retry','green',2),('discard','orange',3),('toast','green',4)],'AFTER - QA branch sv7898',
 '1 The note keeps the photo: "1 file wasn\'t attached. Check your connection, then tap Retry."\n2 Retry   3 Discard\n4 One message: "Upload failed... Your files are kept on the note."','green')
P3=panel('Y-toolbar-abort-retry-after-retry',[('attachment','green',1)],'AFTER - tap Retry, back online',
 '1 The same photo (image.jpg, 1.45 MB) is attached to this note without picking it again. The server shows 1 attachment on the note, and it is still there after a reload.','green',crop=(212,700))
row([P1,P2,P3],'exh-1-before-after.png','Same action on both builds: iPhone 12 Pro, Notes tab, paperclip, photo picked, connection drops during the upload.')
P4=panel('Y-toolbar-slow-none-t20',[('progress','blue',1)],'Slow connection (40 KB/s upload)',
 '1 The note shows "Uploading 1 file... 54%". The percentage climbed while the photo uploaded (20%, 47%, 54% seen), and "Saving 1 file..." showed once it was sent.','blue')
P5=panel('Y-toolbar-hang-discard-t40',[('toast','blue',1),('banner','blue',2)],'Upload stops making progress',
 '1 After 30 s with no progress: "Upload stalled. Check your connection, then tap Retry."\n2 The photo is kept with Retry and Discard.','blue')
P6=panel('X-toolbar-abort-retry-create-t6',[('toast','blue',1)],'Paperclip: the note itself fails to save',
 '1 "Your file wasn\'t saved. The note may not have been created..." with Retry in the message. Retry created the note and attached the photo.','blue')
row([P4,P5,P6],'exh-2-progress-stall-create.png','QA branch sv7898, iPhone 12 Pro: progress, stall detection, and the paperclip create failure.')
P7=panel('XP-newnote-offline-long-offline-180s',[('pending','red',1),('save','red',2)],'Production v26.45.1 - 3 min offline',
 '1 Photo in the New Note window\n2 Save keeps spinning. No message.','red',crop=(0,664))
P8=panel('X-newnote-offline-long-offline-180s',[('pending','red',1),('save','red',2)],'QA branch sv7898 - 3 min offline',
 '1 Photo in the New Note window\n2 Same as production: Save still spinning after 3 minutes, no message, no banner, no Retry.','red',crop=(0,664))
row([P7,P8],'exh-3-newnote-offline-fail.png','New Note window: photo attached, phone goes offline, tap Save. Expected a message with Retry (developer test plan step 1).')
