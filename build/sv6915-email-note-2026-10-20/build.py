import sys,json; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, RED, GRN, BLU
def b(t,k): return json.load(open(f'ev/{t}.json'))['boxes'][k]
def bx(l,c,n): return (l[0],l[1],l[2],l[3],c,n)
a=panel('ev/V5-all-filled.png',crop=(300,45,1125,800),title='1. Sending the invoice with every option switched on',
  boxes=[bx(b('V5-all','checkbox_include_customer_attachments'),BLU,1),bx(b('V5-all','input_optional_emails'),BLU,2),
         bx(b('V5-all','input_email_content'),GRN,3),bx(b('V5-all','toggle_include_bcc'),BLU,4)],
  notes=[(1,BLU,"'For Customer' attachments ticked (one photo is marked For Customer)."),(2,BLU,'An extra email address added.'),
         (3,GRN,'The note typed in the Email Content box.'),(4,BLU,'Include your email to BCC switched on.')])
r5=json.load(open('ev/V5-received.json')); r8=json.load(open('ev/V8-received.json'))
m=lambda r:(r['pf'][0]-6,r['pf'][3]+4,r['br'][2]+6,r['br'][1]-4)
c=panel('ev/V5-received.png',crop=(60,40,670,200),title='2. The email that arrived: the note is there',
  boxes=[(*m(r5),GRN,1)],notes=[(1,GRN,'The note arrived in full, even with attachments, BCC and an extra email.')])
stack([a,c]).save('01-all-options-note-arrives.png')
d=panel('ev/V8-angle-bracket-filled.png',crop=(325,40,1100,800),title='3. Sending a note that starts with "<"',
  boxes=[bx(b('V8-angle-bracket','input_email_content'),RED,1)],notes=[(1,RED,'The note starts with "<". No attachments, no BCC, no extra emails.')])
e=panel('ev/V8-received.png',crop=(60,40,670,170),title='4. The email that arrived: the note is missing',
  boxes=[(r8['pf'][0]-6,r8['pf'][3]+1,r8['br'][2]+6,r8['br'][1]-1,RED,1)],notes=[(1,RED,'Nothing appears between "Please find your attached invoice" and "Best regards".')])
stack([d,e]).save('02-note-starting-with-angle-bracket-missing.png')
for f in ['01-all-options-note-arrives.png','02-note-starting-with-angle-bracket-missing.png']:
  from PIL import Image; print(f,Image.open(f).size)
