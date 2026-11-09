import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, RED, GRN, BLU
O='/home/user/Manual-test-Cases/build/sv12299-envelope-statement-2026-11-09/ev/exhibits/'
a=panel('/tmp/qa12299/S-1-customer-invoices.png',(320,70,1580,345),
 '5. Production: Customers > the customer > Invoices tab',
 [(779,82,859,120,BLU,1),(1172,141,1218,186,RED,2),(330,252,1575,332,BLU,3)],
 [(1,BLU,'The customer\'s Invoices tab, listing the invoices charged to their account.'),
  (2,RED,'This envelope button sends a STATEMENT, not an invoice. It has no words on it, only the same envelope icon as the work order\'s Finance tab, and its tooltip just says "Send Email".'),
  (3,BLU,'The two invoices that end up on the statement.')])
a.save(O+'05-customer-invoices-tab-envelope.png')
b=panel('/tmp/qa12299/S-2-send-dialog.png',(400,70,1200,830),
 '6. Clicking it opens "Sending statement"',
 [(419,98,594,132,RED,1),(430,450,1008,474,RED,2)],
 [(1,RED,'The window says "Sending statement" (the work order envelope says "Sending invoice").'),
  (2,RED,'The text says "Please find your statement attached". The email arrived as "Statement for ZZAUTOTEST SV12299 Charge Account" with one file: "ZZAUTOTEST SV12299 Charge Account Statement.pdf".')])
b.save(O+'06-sending-statement-dialog.png')
c=panel('/tmp/qa12299/Jpdf-1.png',(0,0,909,560),
 '7a. The file the HD Force customer received: the reporter's statement file',
 [(76,190,207,233,RED,1),(50,390,860,430,BLU,2),(50,455,860,548,BLU,3)],
 [(1,RED,'Titled "Statement".'),(2,BLU,'One invoice line: Invoice #:S-6024.'),(3,BLU,'Ageing row: Current Due ... Amount Due.')])
d=panel('/tmp/qa12299/Spdf-1.png',(0,0,909,560),
 '7b. The statement I sent on production from the button in picture 5',
 [(76,190,207,233,RED,1),(50,355,860,427,BLU,2),(50,453,860,548,BLU,3)],
 [(1,RED,'Same "Statement" layout.'),(2,BLU,'Same invoice lines (here S2-1944 and S2-1945).'),(3,BLU,'Same ageing row. The two files are the same document type, from the same template.')])
stack([c,d]).save(O+'07-received-vs-reproduced-statement.png')
from PIL import Image
for n in ['05-customer-invoices-tab-envelope','06-sending-statement-dialog','07-received-vs-reproduced-statement']: print(n, Image.open(O+n+'.png').size)
