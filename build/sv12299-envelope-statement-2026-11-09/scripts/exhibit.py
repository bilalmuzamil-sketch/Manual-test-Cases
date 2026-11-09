import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, RED, GRN, BLU
O='/home/user/Manual-test-Cases/build/sv12299-envelope-statement-2026-11-09/ev/exhibits/'
a=panel('/tmp/qa12299/A2-completed-1-dialog.png',(0,30,1240,880),
 '1. Production, work order S2-1944 (Complete, not invoiced yet): Finance tab > envelope icon',
 [(188,96,272,130,BLU,1),(415,60,570,98,GRN,2),(428,462,790,496,GRN,3)],
 [(1,BLU,'The work order is Complete and has not been invoiced yet.'),
  (2,GRN,'The envelope icon opens "Sending invoice".'),
  (3,GRN,'The email says "Please find your attached invoice for work order: S2-1944." The email that arrived had one attachment, invoice-for-order-S2-1944.pdf.')])
a.save(O+'01-send-before-invoicing.png')
b=panel('/tmp/qa12299/C-2-charge-selected.png',(200,290,1400,610),
 '2. Create Invoice opens New Customer Payment; this customer is on Net 30',
 [(214,406,496,452,BLU,1),(1220,554,1386,597,GRN,2)],
 [(1,BLU,'Payment Method is already set to "Charge Account" because the customer has Net 30 terms.'),
  (2,GRN,'Clicking "Charge Account" closes the window. The work order shows "Invoiced" and the invoice waits on the customer\'s account.')])
b.save(O+'02-charge-account.png')
c=panel('/tmp/qa12299/B-charged-1-dialog.png',(0,30,1240,880),
 '3. After Charge Account: envelope icon again (the customer\'s flow)',
 [(196,98,272,128,BLU,1),(420,62,564,96,GRN,2),(430,464,784,494,GRN,3)],
 [(1,BLU,'The work order is now "Invoiced".'),
  (2,GRN,'The same "Sending invoice" window opens.'),
  (3,GRN,'Sent. The email arrived with one attachment, invoice-for-order-S2-1944.pdf (picture 4).')])
c.save(O+'03-send-after-charge.png')
d=panel('/tmp/qa12299/Bpdf2x-1.png',(0,0,910,860),
 '4. The PDF attached to that email (page 1 of 1)',
 [(700,30,855,98,GRN,1),(60,374,334,412,GRN,2)],
 [(1,GRN,'It is the invoice: "Invoice: INV-S2-1944". The word "statement" does not appear anywhere in it.'),
  (2,GRN,'Work Order S2-1944, Terms Net 30 (the customer\'s terms).')])
d.save(O+'04-attached-pdf.png')
for n in ['01-send-before-invoicing','02-charge-account','03-send-after-charge','04-attached-pdf']:
    from PIL import Image; print(n, Image.open(O+n+'.png').size)
