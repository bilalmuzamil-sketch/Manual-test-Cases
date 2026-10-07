import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from PIL import Image
from ticket_exhibit import panel, stack, RED, GRN
R='/home/user/Manual-test-Cases/build/sv10642-wo-review-after-new-line-2026-10-07/ev/raw/'; O=R+'../'
def bx(g,n,c): x,y,w,h=g; return (x,y,x+w,y+h,c,n)
b=panel(R+'P4x2-error.png',crop=(20,80,1900,1100),
  title='BEFORE (production, build v26.40.8-1e8e914, 7 Oct 2026): work order S2-960, both lines complete, then a new line added that needs approval',
  boxes=[bx([256,103,59,21],1,RED),bx([1352,536,105,21],2,RED),bx([1715,87,156,36],3,RED),bx([1400,1015,400,76],4,RED)],
  notes=[(1,RED,'The work order still says Review.'),(2,RED,'The new line is waiting for approval.'),
         (3,RED,'Mark Reviewed is still offered.'),(4,RED,'Clicking it gives "Cannot complete work order with incomplete lines."')])
a=panel(R+'J2-3-after-add.png',crop=(20,80,1900,640),
  title='AFTER (QA branch sv10642, build v26.39.2-8b087eb, 7 Oct 2026): work order S10642-17590, the same steps',
  boxes=[bx([243,107,72,21],1,GRN),bx([1129,524,105,21],2,GRN),bx([1751,91,120,36],3,GRN)],
  notes=[(1,GRN,'The work order changes from Review to Approved as soon as the line is added.'),(2,GRN,'The new line is waiting for approval.'),
         (3,GRN,'Only New Line is shown here. Mark Reviewed is gone, so nobody can hit the error.')])
stack([b,a]).save(O+'01-before-vs-after-hd.png')
steps=[('J2-1-review.png','1. Both lines complete: the work order is at Review.',[([256,107,59,21],'Review'),([1715,91,156,36],'Mark Reviewed offered')]),
 ('J2-4-approved.png','2. New line added and then approved: the work order stays Approved.',[([243,107,72,21],'Approved'),([1218,524,72,21],'New line Approved')]),
 ('J2-5-completed-review.png','3. New line completed: the work order goes back to Review.',[([256,107,59,21],'Review'),([1285,524,72,21],'New line Complete'),([1715,91,156,36],'Mark Reviewed offered')]),
 ('J2-6-complete.png','4. Mark Reviewed clicked: the work order is Complete, no error.',[([244,107,72,21],'Complete')])]
ps=[]
for f,t,bs in steps:
  ps.append(panel(R+f,crop=(20,80,1900,575),title='QA branch, S10642-17590 - '+t,
    boxes=[bx(g,i+1,GRN) for i,(g,_) in enumerate(bs)],notes=[(i+1,GRN,n) for i,(_,n) in enumerate(bs)]))
stack(ps).save(O+'02-after-the-line-is-resolved-hd.png')
for f in ['01-before-vs-after-hd.png','02-after-the-line-is-resolved-hd.png']: print(f,Image.open(O+f).size)
