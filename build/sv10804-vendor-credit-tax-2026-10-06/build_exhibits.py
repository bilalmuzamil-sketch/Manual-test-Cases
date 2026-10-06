import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from PIL import Image
from ticket_exhibit import panel, stack, RED, GRN, BLU
R='/home/user/Manual-test-Cases/build/sv10804-vendor-credit-tax-2026-10-06/ev/raw/'; O=R+'../'
# BEFORE capture is 1x; upscale to 2x so both halves share the same pixel density
b=Image.open(R+'BEFORE-staging-je15501.png'); b.resize((b.width*2,b.height*2),Image.LANCZOS).save(R+'BEFORE-staging-je15501-2x.png')
before=panel(R+'BEFORE-staging-je15501-2x.png',crop=(208,390,1870,526),
  title='BEFORE the fix: staging, 2 Oct 2026 (build v26.40.3-36ebbb0). A part goes back to the vendor - Journal Entry #15501',
  boxes=[(256,457,1866,491,RED,1)],
  notes=[(1,RED,'The whole credit, $378.00 (part $360.00 + tax $18.00), is taken off the value of parts in stock (Parts Inventory). There is no Sales Tax Expense line, so the tax is never reversed.')])
after=panel(R+'AFTER-je13732.png',crop=(209,371,1569,540),
  title='AFTER the fix: QA branch sv10360, 6 Oct 2026 (build v26.40.8-1bc3b12). A part goes back to the vendor - Journal Entry #13732',
  boxes=[(257,438,1567,472,GRN,1),(257,472,1567,506,GRN,2)],
  notes=[(1,GRN,'Only the part, $171.00, is taken off the value of parts in stock (Parts Inventory).'),
         (2,GRN,'The $8.55 tax is taken back out of Sales Tax Expense, where it was recorded when the part came in.')])
stack([before,after]).save(O+'01-before-vs-after-hd.png')
shop=panel(R+'A-05-credit-before-post.png',crop=(336,150,1880,430),
  title='1. In ShopView: the credit for the returned part (Parts > Returns > Receive Credit)',
  boxes=[(1470,296,1872,340,BLU,1),(1470,392,1872,432,BLU,2)],
  notes=[(1,BLU,'Tax on the credit: $8.55.'),(2,BLU,'Total credit: $179.55 (the part $171.00 + the tax $8.55).')])
rcv=panel(R+'AFTER-je13729.png',crop=(209,332,1569,501),
  title='2. In AccountingHub: when the part was received - Journal Entry #13729',
  boxes=[(257,399,1567,433,GRN,1)],
  notes=[(1,GRN,'The $8.55 tax was recorded in Sales Tax Expense.')])
ret=panel(R+'AFTER-je13732.png',crop=(209,371,1569,540),
  title='3. In AccountingHub: when the part went back - Journal Entry #13732',
  boxes=[(257,472,1567,506,GRN,1),(257,438,1567,472,GRN,2)],
  notes=[(1,GRN,'The same $8.55 comes back out of Sales Tax Expense.'),(2,GRN,'Parts Inventory goes down by the part only, $171.00.')])
stack([shop,rcv,ret]).save(O+'02-credit-received-returned-hd.png')
rep=panel(R+'AFTER-taxdetail.png',crop=(294,300,1485,730),
  title='4. Sales Tax Detail report (6 Oct 2026): every vendor credit now shows its tax',
  boxes=[(342,499,1483,690,GRN,1),(342,691,1483,730,BLU,2)],
  notes=[(1,GRN,'Each credit appears as a minus line under its tax code: GST 5% or HST BC 12%. Clicking a credit number opens that vendor credit.'),
         (2,BLU,'Purchase tax for the day nets to $2.97: the tax on the bills less the tax on the credits.')])
stack([rep]).save(O+'03-sales-tax-detail-hd.png')
for f in ['01-before-vs-after-hd.png','02-credit-received-returned-hd.png','03-sales-tax-detail-hd.png']:
    im=Image.open(O+f); print(f,im.size)
