import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, RED, GRN, BLU
E='/home/user/Manual-test-Cases/build/sv12299-envelope-statement-2026-11-09/ev/rewalk-2026-11-10/'
O='/home/user/Manual-test-Cases/build/sv12299-envelope-statement-2026-11-09/ev/exhibits/'
a=panel(E+'A-05-hover-envelope.png',(300,70,1580,350),'Way 1 - Customers > customer > Invoices tab (production, 10 Nov 2026)',
  [(776,88,860,113,BLU,1),(1172,142,1217,185,RED,2)],
  [(1,BLU,'The Invoices tab on the customer page.'),(2,RED,'The envelope icon has no text; hovering it shows "Send Email".')])
b=panel(E+'A-06-dialog.png',(400,73,1200,820),'Clicking it opens "Sending statement"',
  [(420,100,600,130,RED,3),(1072,755,1178,797,RED,4)],
  [(3,RED,'The window says it sends a STATEMENT, not an invoice.'),(4,RED,'Send Email: the customer gets "Statement for <customer>" with "<customer> Statement.pdf" only.')])
stack([a,b]).save(O+'10-way1-customer-invoices-envelope.png')
c=panel(E+'B-05-for-customer-ticked.png',(300,80,1580,440),'Way 2 - work order S2-1944 > Notes tab (production, 10 Nov 2026)',
  [(1412,143,1440,177,BLU,1),(352,342,465,370,RED,2)],
  [(1,BLU,'Upload icon next to "New Note" (hover: "Attach Files") - the downloaded statement PDF was attached here.'),(2,RED,'"For Customer" ticked under the file.')])
d=panel(E+'B-08-include-ticked.png',(400,45,1200,845),'Finance tab > envelope opens "Sending invoice"',
  [(428,136,720,162,RED,3),(1072,782,1178,824,RED,4)],
  [(3,RED,'"Include \'For Customer\' Attachments in email" ticked.'),(4,RED,'Send Email: the customer gets the invoice AND the statement file.')])
stack([c,d]).save(O+'11-way2-work-order-for-customer-note.png')
