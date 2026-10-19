# SV-11124 photo-refresh exhibits (staging v26.40.19-e435950, 19 Oct 2026). Coordinates in CSS px (2x captures).
import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, RED, GRN, BLU
from PIL import Image
E='/home/user/Manual-test-Cases/build/obsolete-recheck-2026-10-19/sv11124/ev/'; O='/home/user/Manual-test-Cases/build/obsolete-recheck-2026-10-19/sv11124/exhibits/'
def hstack(ps,gap=40):
    H=max(p.height for p in ps); out=Image.new('RGB',(sum(p.width for p in ps)+gap*(len(ps)-1),H),(255,255,255)); x=0
    for p in ps: out.paste(p,(x,0)); x+=p.width+gap
    return out
crop=(0,0,1440,260); boxes=lambda c:[(60,98,196,244,c,1,'right'),(1378,8,1420,48,c,2,'below')]
a=panel(E+'A-2-reloaded.png',crop,'1. Tech uploads a red "A" photo and reloads the page',boxes(RED),[(1,RED,'Profile page shows the red A.'),(2,RED,'The photo at the top right shows the red A.')])
b=panel(E+'B-2-reloaded.png',crop,'2. Tech uploads a green "B" photo and reloads the page',boxes(GRN),[(1,GRN,'Profile page now shows the green B.'),(2,GRN,'The top-right photo also shows the green B. The old A is gone.')])
from ticket_exhibit import stack
stack([a,b]).save(O+'sv11124-01-own-screen.png')
sc=(220,470,760,580)
c=panel(E+'S1-admin-before.png',sc,'3. Admin, Schedule page: Tech ShopView\'s photo is the green B',[(306,519,341,555,GRN,1)],[(1,GRN,'Admin sees the green B.')])
d=panel(E+'S4-admin-reloaded.png',sc,'4. Tech uploads a blue "C" photo; Admin reloads the Schedule page',[(306,519,341,555,BLU,1)],[(1,BLU,'Admin now sees the blue C. The new photo shows for other people after a reload too.')])
stack([c,d]).save(O+'sv11124-02-other-user.png')
for f in ['01-own-screen','02-other-user']:
    i=Image.open(O+'sv11124-'+f+'.png'); print(f,i.width//2,i.height//2)
