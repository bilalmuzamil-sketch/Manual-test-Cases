import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, RED, GRN, BLU
O='/home/user/Manual-test-Cases/build/sv12299-envelope-statement-2026-11-09/ev/exhibits/'
a=panel('/tmp/qa12299/E-1-note-for-customer.png',(20,70,1000,420),
 'Picture 1: work order S2-1945 > Notes tab, the saved statement is attached with "For Customer" ticked',
 [(197,99,270,127,BLU,1),(456,86,524,114,BLU,2),(332,282,590,392,RED,3)],
 [(1,BLU,'The work order is already Invoiced (charged to the customer account).'),
  (2,BLU,'Notes tab.'),
  (3,RED,'The statement file "ZZAUTOTEST SV12299 Charge Account Statement (1).pdf" is attached to a note, with "For Customer" ticked.')])
a.save(O+'08-note-statement-for-customer.png')
b=panel('/tmp/qa12299/E-2-send-dialog.png',(400,30,1200,860),
 'Picture 2: Finance tab > envelope > "Sending invoice" with the first box ticked',
 [(420,64,563,94,BLU,1),(426,126,718,154,RED,2)],
 [(1,BLU,'This is the normal invoice envelope inside the work order.'),
  (2,RED,'"Include \'For Customer\' Attachments in email" is ticked. Every note file marked For Customer goes out with the invoice, including the statement.')])
b.save(O+'09-send-invoice-include-for-customer.png')
from PIL import Image
for n in ['08-note-statement-for-customer','09-send-invoice-include-for-customer']: print(n, Image.open(O+n+'.png').size)
