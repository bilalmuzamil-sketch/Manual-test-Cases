import sys, json; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, RED, GRN
from PIL import Image
C=(395,255,1030,705)
def fb(t,col,n): b=json.load(open(f'data/{t}.json'))['field_box']; return (b['x'],b['y'],b['x']+b['w'],b['y']+b['h'],col,n,'right')
p1=panel('ev/N1-1-typed.png',(395,255,1030,820),'1. Typed "accuride" (lower case): the list shows the existing Accuride',[fb('N1',GRN,1)],[(1,GRN,'Then Tab was pressed without clicking the option.')])
p2=panel('ev/N1-2-after-leave.png',C,'2. After Tab: the field picks the existing "Accuride"',[fb('N1',GRN,2)],[(2,GRN,'Saved part QA-11669-02 is linked to the same Accuride as QA-11669-01; no new manufacturer.')])
p3=panel('ev/N2-2-after-leave.png',C,'3. Typed "  ACCURIDE  " (spaces + capitals), then clicked Description',[fb('N2',GRN,3)],[(3,GRN,'The field shows "Accuride"; part QA-11669-03 saved to the same Accuride.')])
p4=panel('ev/B3-2-after-leave.png',C,'4. Typed only spaces, then Tab',[fb('B3',GRN,4)],[(4,GRN,'The field is left empty; part QA-11669-07 saved with no manufacturer and no empty entry was created.')])
p5=panel('ev/E1-2-dialog.png',C,'5. Edit Catalog Part on QA-11669-05: replaced Haldex with "ACCURIDE", then Tab',[fb('E1',GRN,5)],[(5,GRN,'The field shows "Accuride"; after saving, the part shows Manufacturer: Accuride and the list did not grow.')])
def row(ps,gap=30):
    W=sum(p.width for p in ps)+gap*(len(ps)-1); H=max(p.height for p in ps); o=Image.new('RGB',(W,H),(255,255,255)); x=0
    for p in ps: o.paste(p,(x,0)); x+=p.width+gap
    return o
stack([row([p1,p2]),row([p3,p4,p5])],gap=50).save('ev/02-dialog-checks.png'); print('ok')
