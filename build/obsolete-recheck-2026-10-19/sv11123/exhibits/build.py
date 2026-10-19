# SV-11123 exhibits (staging v26.40.19-e435950, 19 Oct 2026); coordinates CSS px from cap23e.json
import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, RED, GRN, BLU
from PIL import Image
E='/home/user/Manual-test-Cases/build/obsolete-recheck-2026-10-19/sv11123/ev/'; O='/home/user/Manual-test-Cases/build/obsolete-recheck-2026-10-19/sv11123/exhibits/'
def hstack(ps,gap=40):
    H=max(p.height for p in ps); out=Image.new('RGB',(sum(p.width for p in ps)+gap*(len(ps)-1),H),(255,255,255)); x=0
    for p in ps: out.paste(p,(x,0)); x+=p.width+gap
    return out
im=Image.open(E+'ticket23-before.png'); im.resize((im.width*2,im.height*2),Image.LANCZOS).save(E+'ticket23-before-2x.png')
b=panel(E+'ticket23-before-2x.png',crop=(16,110,560,460),title='BEFORE (from this ticket, 10 Oct 2026): Estimate part sale P10043-255',
        boxes=[(40,130,300,240,RED,1)],notes=[(1,RED,'The card shows the number, status and start date only. No technician or Sales Representative field.')])
a=panel(E+'pse-0.png',crop=(0,60,560,260),title='AFTER (staging build v26.40.19-e435950, 19 Oct 2026): Estimate part sale P2-2406',
        boxes=[(33,163,243,211,GRN,1,'right')],notes=[(1,GRN,'The card now has a Sales Representative field you can change.')])
hstack([b,a]).save(O+'sv11123-01-before-after.png')
c=panel(E+'pse-1-changed.png',crop=(0,60,560,260),title='1. Sales Representative changed to Ahtasham Admin',boxes=[(33,163,243,211,BLU,1,'right')],notes=[(1,BLU,'Picked Ahtasham Admin from the list.')])
r=panel(E+'pse-2-reloaded.png',crop=(0,60,560,260),title='2. After reloading the page',boxes=[(33,163,243,211,GRN,2,'right')],notes=[(2,GRN,'Still Ahtasham Admin, so the change was saved.')])
hstack([c,r]).save(O+'sv11123-02-change-and-reload.png')
for f in ['01-before-after','02-change-and-reload']:
    i=Image.open(O+'sv11123-'+f+'.png'); print(f,i.width//2,i.height//2)
