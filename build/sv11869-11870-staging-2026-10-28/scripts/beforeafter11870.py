# SV-11870 before (production) vs after (staging): same CSV (old header, Line Title left empty) imported on both.
from PIL import Image, ImageDraw, ImageFont
F='/usr/share/fonts/truetype/dejavu/'; fb=ImageFont.truetype(F+'DejaVuSans-Bold.ttf',24); fr=ImageFont.truetype(F+'DejaVuSans.ttf',19)
RED=(200,30,30); GREEN=(0,120,50)
def half(env,label,sub,col,cap):
    im=Image.open(f'ev/import/{env}-old-header-empty-2-after-import.png').convert('RGB').crop((200,150,1440,370))
    d=ImageDraw.Draw(im); d.rectangle([778,128,980,162],outline=col,width=4)
    W=im.width; c=Image.new('RGB',(W,im.height+110),'white'); cd=ImageDraw.Draw(c)
    cd.rectangle([0,0,W,44],fill=col); cd.text((14,9),label,font=fb,fill='white')
    cd.text((14,52),sub,font=fr,fill=(60,60,60)); c.paste(im,(0,80)); cd.text((14,im.height+82),cap,font=fr,fill=col); return c
a=half('prod','BEFORE - Production (build v26.43.2-537378f), 28 Oct 2026','Settings > Invoices Import, same CSV: row 2 has Item = Labor and the line title left empty',RED,'Failure Reason reads "Line name cannot be empty." - the CSV column is not called "Line name"')
b=half('staging','AFTER - Staging (build v26.43.2-f8698cb), 28 Oct 2026','Settings > Invoices Import, same CSV: row 2 has Item = Labor and the line title left empty',GREEN,'Failure Reason now reads "Line Title cannot be empty." - matches the CSV column "*Line Title"')
out=Image.new('RGB',(a.width,a.height+b.height+20),'white'); out.paste(a,(0,0)); out.paste(b,(0,a.height+20))
out=out.resize((out.width*2,out.height*2),Image.LANCZOS) if False else out
out.save('ev/SV-11870-00-before-after.png'); print(out.size)
