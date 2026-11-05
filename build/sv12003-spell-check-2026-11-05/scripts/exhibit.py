import json,glob
from PIL import Image, ImageDraw, ImageFont
F='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; FB='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
f=lambda n,b=False: ImageFont.truetype(FB if b else F,n)
RED=(200,40,40); GRN=(30,130,60); ORG=(215,120,0); GRY=(50,50,50); K=2
def res(env,name):
  for p in sorted(glob.glob(f'../ev/{env}-matrix/result-*.json')):
    for r in json.load(open(p)):
      if r['name']==name and r.get('dlg'): return r
def panel(env,name,state,head,col,note,mark=True):
  r=res(env,name); im=Image.open(f'../ev/{env}-matrix/{name}-full-{state}.png').convert('RGB')
  d=r['dlg']; b=r['box'+state[0]] if ('box'+state[0]) in r else r['box1']
  top=max(d['y'],b['y']-170); bot=min(d['y']+d['height'],max(b['y']+b['height']+60,top+330)); x0,y0,x1,y1=[int(v*K) for v in (d['x'],top,d['x']+d['width'],bot)]
  c=im.crop((x0,y0,x1,y1)); dr=ImageDraw.Draw(c)
  if mark: dr.rectangle((int(b['x']*K)-x0-6,int(b['y']*K)-y0-6,int((b['x']+b['width'])*K)-x0+6,int((b['y']+min(b['height'],70))*K)-y0+6),outline=col,width=7)
  c=c.resize((c.width//2,c.height//2),Image.LANCZOS)
  hh=Image.new('RGB',(c.width,70),col); ImageDraw.Draw(hh).text((14,10),head,font=f(22,True),fill='white'); ImageDraw.Draw(hh).text((14,40),note,font=f(17),fill='white')
  out=Image.new('RGB',(c.width,c.height+70),'white'); out.paste(hh,(0,0)); out.paste(c,(0,70)); return out
def row(panels,caption,fn):
  W=sum(p.width for p in panels)+20*(len(panels)+1); H=max(p.height for p in panels)+40+34*len(caption)
  o=Image.new('RGB',(W,H),'white'); x=20
  for p in panels: o.paste(p,(x,20)); ImageDraw.Draw(o).rectangle((x-1,19,x+p.width,20+p.height),outline=(170,170,170),width=2); x+=p.width+20
  y=max(p.height for p in panels)+30
  for t,c in caption: ImageDraw.Draw(o).text((20,y),t,font=f(20),fill=c); y+=34
  o.save('../ev/'+fn); print(fn,o.size)
P='PRODUCTION'; B='QA BRANCH sv12003'
T='Typed: "thee spellling are wrong wrng" ("thee" is a real word, so only "spellling" and "wrng" should be underlined).'
row([panel('prod','tech_story','1-typing','BEFORE - '+P,RED,'v26.45.1-6505633 - while typing: no red underline'),panel('branch','tech_story','1-typing','AFTER - '+B,GRN,'v26.45.0-440aa25 - typing: "spellling", "wrng" underlined')],
    [('Tech Story window (Work Orders > Lines tab > "Add tech story for this line"), 5 Nov 2026.',GRY),(T,GRY)],'before-after-tech-story.png')
row([panel('prod','edit_line_description','1-typing','BEFORE - '+P,RED,'v26.45.1-6505633 - Description: no underline'),panel('branch','edit_line_description','1-typing','AFTER - '+B,GRN,'v26.45.0-440aa25 - Description: underlined')],
    [('Edit Line window (Work Orders > Lines tab > click the line name), Description box, 5 Nov 2026.',GRY),('Typed "thee spellling are wrong wrng" at the end of the existing description',GRY),('(so "inspectionthee" is also a misspelling and is underlined).',GRY)],'before-after-edit-line.png')
row([panel('branch','new_line_description','1-typing','QA BRANCH - New Line',GRY,'no spell check here, on purpose (Chris, 30 Oct)'),panel('branch','new_note','1-typing','QA BRANCH - Notes tab > New Note',GRN,'misspellings underlined (same as before)')],
    [('Other boxes checked on the QA branch, 5 Nov 2026.',GRY)],'branch-new-line-new-note.png')
row([panel('branch','customer_notes','1-typing','QA BRANCH - Edit Customer > Notes',RED,'while typing: NO red underline'),panel('branch','vehicle_notes','1-typing','QA BRANCH - Edit Asset > Notes',RED,'while typing: NO red underline')],
    [('Customers > open the customer > pencil (edit) > Notes   |   Asset page > pencil (Edit Asset) > Notes.',GRY),('Production is the same. Typed: "thee spellling are wrong wrng".',GRY)],'remaining-customer-asset-notes.png')
row([panel('branch','tech_story','1-typing','1. While typing',GRN,'"spellling" and "wrng" underlined'),panel('branch','tech_story','2-clicked-out','2. After clicking the window title',RED,'"thee" became "Thee" and every underline is gone'),panel('branch','tech_story','3-refocus','3. After clicking back into the box',ORG,'underlines come back')],
    [('QA BRANCH sv12003 (v26.45.0-440aa25), Tech Story window, 5 Nov 2026.',GRY)],'remaining-tech-story-underline-disappears.png')
