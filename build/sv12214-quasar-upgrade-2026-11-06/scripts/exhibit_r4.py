import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, RED, GRN
from PIL import Image
def side(a,b,gap=30):
    h=max(a.height,b.height); im=Image.new('RGB',(a.width+b.width+gap,h),'white'); im.paste(a,(0,0)); im.paste(b,(a.width+gap,0)); return im
CMP='Comparison only (read with the browser\'s developer tools, not a ShopView feature): '
m1=panel('ev/prod-r4-module.png',crop=(60,0,560,380),title='BEFORE: production (v26.45.2-132dcb4), module switcher',
 boxes=[(103,56,465,356,RED,1)],notes=[(1,RED,CMP+'marked as a menu, with no name.')])
m2=panel('ev/staging-r4-module.png',crop=(60,0,560,380),title='AFTER: staging (v26.45.2-c157d82), module switcher',
 boxes=[(103,56,465,277,GRN,1)],notes=[(1,GRN,CMP+'named "Switch module" (a dialog). The ShopHub button says it opens a dialog.')])
p1=panel('ev/prod-r4-profile.png',crop=(1100,0,1600,540),title='BEFORE: production, profile menu',
 boxes=[(1319,49,1579,519,RED,1)],notes=[(1,RED,CMP+'marked as a menu, with no name.')])
p2=panel('ev/staging-r4-profile.png',crop=(1100,0,1600,540),title='AFTER: staging, profile menu',
 boxes=[(1339,49,1599,519,GRN,1)],notes=[(1,GRN,CMP+'named "Profile and settings" (a dialog). The Profile button says it opens a dialog.')])
im=stack([side(m1,m2),side(p1,p2)]); im.save('ev/jira/03-module-profile-named-prod-vs-staging.png'); print(im.size)
