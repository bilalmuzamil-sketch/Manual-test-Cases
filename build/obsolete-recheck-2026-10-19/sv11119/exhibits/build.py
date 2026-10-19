# SV-11119 exhibits: two Admin browsers reorder Vic Hover's Board View column (staging v26.40.19-e435950, 19 Oct 2026, 2x).
import sys, json; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, RED, GRN, BLU
from PIL import Image
E='/home/user/Manual-test-Cases/build/obsolete-recheck-2026-10-19/sv11119/ev/'; O='/home/user/Manual-test-Cases/build/obsolete-recheck-2026-10-19/sv11119/exhibits/'
def hstack(ps,gap=40):
    H=max(p.height for p in ps); out=Image.new('RGB',(sum(p.width for p in ps)+gap*(len(ps)-1),H),(255,255,255)); x=0
    for p in ps: out.paste(p,(x,0)); x+=p.width+gap
    return out
crop=(690,195,1030,900); Y=[(262,498),(506,742),(751,896)]
def bx(i,c,n): return (741,Y[i][0],1003,Y[i][1],c,n)
p0=panel(E+'k8-A0.png',crop,'1. Both browsers at the start',[bx(0,BLU,1),bx(1,BLU,2),bx(2,BLU,3)],
   [(1,BLU,'Alpha Freight QA1019 (S2-37378)'),(2,BLU,'Mid Trucking QA1019 (S2-37380)'),(3,BLU,'Zeta Hauling QA1019 (S2-37377)')])
a1=panel(E+'k8-A1.png',crop,'2. Browser 1 drags Zeta to the top',[bx(0,BLU,1)],[(1,BLU,'Browser 1 now shows Zeta, Alpha, Mid. Saved, no message.')])
b1=panel(E+'k8-B1.png',crop,'3. Browser 2 (not refreshed) drags Mid to the top',[bx(0,GRN,1),bx(1,GRN,2),bx(2,GRN,3)],
   [(1,GRN,'Browser 2 shows Mid, Alpha, Zeta. This is the later save, so this order should win.'),(2,GRN,'Alpha second'),(3,GRN,'Zeta third')])
hstack([p0,a1,b1]).save(O+'sv11119-01-two-browsers.png')
a2=panel(E+'k8-A2.png',crop,'4. Browser 1 after refresh',[bx(0,RED,1),bx(1,RED,2),bx(2,RED,3)],
   [(1,RED,'Zeta is first: browser 1\'s move.'),(2,RED,'Mid is second: browser 2 wanted it first.'),(3,RED,'Alpha is third: browser 2 had it second.')])
b2=panel(E+'k8-B2.png',crop,'5. Browser 2 after refresh',[bx(0,RED,1),bx(1,RED,2),bx(2,RED,3)],
   [(1,RED,'Same mix: Zeta, Mid, Alpha.'),(2,RED,'Expected (later save wins): Mid, Alpha, Zeta.'),(3,RED,'Neither person\'s order was kept.')])
hstack([a2,b2]).save(O+'sv11119-02-after-refresh.png')
for f in ['01-two-browsers','02-after-refresh']:
    i=Image.open(O+'sv11119-'+f+'.png'); print(f,i.width//2,i.height//2)
