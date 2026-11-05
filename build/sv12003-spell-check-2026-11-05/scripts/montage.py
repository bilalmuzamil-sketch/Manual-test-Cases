# builds a labelled before/after grid: rows = boxes, columns = production typing | branch typing | branch after clicking out | branch clicked back in
from PIL import Image, ImageDraw, ImageFont
F='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; FB='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
f=lambda n,b=False: ImageFont.truetype(FB if b else F,n)
E='../ev/'; rows=[('Tech Story','tech_story'),('Edit Line - description','edit_line_description'),('New Line - description','new_line_description'),('Edit Customer - Notes','customer_notes'),('Edit Asset - Notes','vehicle_notes')]
cols=[('PRODUCTION\nwhile typing','prod-matrix','1-typing'),('QA BRANCH\nwhile typing','branch-matrix','1-typing'),('QA BRANCH\nafter clicking out','branch-matrix','2-clicked-out'),('QA BRANCH\nclicked back in','branch-matrix','3-refocus')]
CW,CH=520,120; LW=260; out=Image.new('RGB',(LW+CW*len(cols)+20,90+CH*len(rows)+150),'white'); d=ImageDraw.Draw(out)
for j,(t,_,_) in enumerate(cols): d.multiline_text((LW+j*CW+10,15),t,font=f(22,True),fill=(200,40,40) if j==0 else (30,120,60))
for i,(lab,k) in enumerate(rows):
  y=90+i*CH; d.text((10,y+40),lab,font=f(20,True),fill=(40,40,40))
  for j,(_,dirn,suf) in enumerate(cols):
    im=Image.open(f'{E}{dirn}/{k}-{suf}.png').convert('RGB'); im=im.crop((0,0,min(im.width,1040),min(im.height,90))); im.thumbnail((CW-20,CH-14))
    out.paste(im,(LW+j*CW+10,y+6)); d.rectangle((LW+j*CW+8,y+4,LW+j*CW+12+im.width,y+8+im.height),outline=(180,180,180),width=2)
y=90+len(rows)*CH+15
for t,c in [('Typed text: "thee spellling are wrong wrng". A red wavy line = spell check working ("thee" is a real word).',(40,40,40)),
            ('Tech Story + Edit Line: fixed on the QA branch. New Line: no spell check on purpose (Chris).',(30,120,60)),
            ('Edit Customer / Edit Asset Notes: no spell check on either build.',(200,40,40)),
            ('Tech Story: underline disappears after clicking out (first letter auto-capitalised), returns when clicked back in.',(200,120,0))]:
  d.text((10,y),t,font=f(20),fill=c); y+=30
out.save('../ev/spellcheck-matrix.png'); print(out.size)
