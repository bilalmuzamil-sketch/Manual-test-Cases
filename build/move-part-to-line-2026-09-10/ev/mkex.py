import json
from PIL import Image, ImageDraw, ImageFont
F='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; FB='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
def fo(s,b=False): return ImageFont.truetype(FB if b else F, s)
RED=(208,42,42); DARK=(33,37,41); GREY=(108,117,125)
src=Image.open('/tmp/sv9833/mv3-filled.png').convert('RGB')
crop=src.crop((470,360,1130,640))
cw,ch=crop.size
pad=30; head=150; foot=210
W=max(cw+pad*2, 980)
xoff=(W-cw)//2
im=Image.new('RGB',(W, head+ch+foot),(247,248,250))
d=ImageDraw.Draw(im)
d.text((pad,14),'Move part to line — the dialog does nothing when pressed', font=fo(28,True), fill=DARK)
d.text((pad,54),'app.staging.shopview.com (released build v26.36.2-a678e3c) · work order S2-32850 · 10 Sep 2026', font=fo(19), fill=GREY)
d.text((pad,80),'Part (122993) Mobil 3309 ATF, 1L on line 1, moving to line 2. Both fields were actively chosen', font=fo(19), fill=GREY)
d.text((pad,104),'from their dropdowns, not just displayed.', font=fo(19), fill=GREY)
im.paste(crop,(xoff,head))
# boxes from the measured geometry of the two fields and the button, offset into the crop
def box(x,y,w,h,c=RED,wd=4):
    d.rectangle([xoff+x-4, head+y-4, xoff+x+w+4, head+y+h+4], outline=c, width=wd)
# Work Order field ~ (523,452)-(1078,489) in page coords -> minus crop origin (470,360)
box(523-470, 452-360, 555, 37)
box(523-470, 507-360, 555, 37)
box(968-470, 570-360, 111, 36)
y=head+ch+16
d.text((pad,y),'Observed on pressing Move To Line, five seconds of waiting:', font=fo(21,True), fill=DARK); y+=32
for t in ['no HTTP request of any kind was sent',
          'no toast, no error, no validation message anywhere in the dialog',
          'the dialog stayed open and the part did not move',
          'no JavaScript console error and no page error',
          'the same move through the API returned 200 and moved the part']:
    d.text((pad+14,y),'•  '+t, font=fo(20), fill=RED); y+=28
im.save('/home/user/Manual-test-Cases/build/move-part-to-line-2026-09-10/ev/EX1-move-to-line-does-nothing.png')
print('saved', im.size)
