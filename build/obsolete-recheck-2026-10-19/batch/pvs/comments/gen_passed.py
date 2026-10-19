# Turns the 8 "same as production" comments into QA PASSED comments (QA lead, 19 Oct 2026:
# "if that follows the PRD now ... its status should be Done ... clearly confirm that it is QA passed").
# Usage: python3 gen_passed.py "<HH:MM>"  (edit time, CDT)
import sys, importlib.util
from PIL import Image
spec=importlib.util.spec_from_file_location('g','/home/user/Manual-test-Cases/build/obsolete-recheck-2026-10-19/batch/pvs/comments/gen.py'); g=importlib.util.module_from_spec(spec); spec.loader.exec_module(g)
T=g.T; HEAD=g.HEAD; emb=g.emb; O=g.O; t=sys.argv[1]
GREEN='{panel:bgColor=#e3fcef|borderColor=#00875a}\n*OVERALL QA STATUS: PASSED*\n{panel}\n\n'
NOTE=f'_Updated on 19 October 2026, {t} CDT: this comment first opened with "QA RE-CHECK: SAME ON PRODUCTION". It now gives the QA verdict, PASSED, and the ticket is moved to Done._\n\n'
WHY={'SV-11464':'This ticket is QA passed: the status pills work the way the spec (version 64, S6-R2a) asks, and the same as production.',
 'SV-11118':'This ticket is QA passed: the top-menu link behaves the same as production, which is what the spec (version 64, section 1) asks for List.',
 'SV-11099':'This ticket is QA passed: the empty search page matches the current spec (version 64, S1-N1a and S1-N1b) word for word.',
 'SV-11120':'This ticket is QA passed: the lead technician cannot be changed on a Paid work order, which is all the spec (version 64) asks; production shows it the same way.',
 'SV-11121':'This ticket is QA passed: the current spec (version 64) no longer asks for a Lead technician on Imported work orders, and the page matches production.',
 'SV-11107':'This ticket is QA passed: the line Audit log works the same as production, which is what the spec (version 64, S4-R18) asks.',
 'SV-11125':'This ticket is QA passed: the 60-day filter is kept after a reload, which is the check this ticket came from. The project spec does not cover the Parts > Returns page, and the page works the same as production.',
 'SV-11124':'This ticket is QA passed: a new profile photo shows after a reload, for the person who uploaded it and for other people (pictures 2 and 3 below). The Staff list has no photo column on production either, and the project spec does not ask for one.'}
for k,(pn,bul,img,cap,src,quote,steps) in T.items():
    b=GREEN+NOTE+HEAD+'\n'+'* '+WHY[k]+'\n'+''.join('* '+x+'\n' for x in bul)
    b+='\n*1. Production vs Staging*\n'+emb(img)+'\n_'+cap+'_\n'
    if k=='SV-11124':
        P='/home/user/Manual-test-Cases/build/obsolete-recheck-2026-10-19/sv11124/exhibits/'
        def e2(f): i=Image.open(P+f); return f'!{f}|width={i.width//2},height={i.height//2}!'
        b+='\n*2. A new photo shows after a reload (Tech\'s own screen)*\n'+e2('sv11124-01-own-screen.png')+'\n_Staging, signed in as Tech: after uploading a red A and reloading, both the profile photo (1) and the top-right photo (2) show A. After uploading a green B and reloading, both show B._\n'
        b+='\n*3. Other people see the new photo after a reload*\n'+e2('sv11124-02-other-user.png')+'\n_Staging, signed in as Admin in a second browser, Schedule page: Tech ShopView\'s photo is the green B. Tech then uploads a blue C; after Admin reloads the page it shows C._\n'
    b+='\n*Where the expected result comes from*\n'+src+'\n{quote}'+quote+'{quote}\n\n*How to see it yourself*\n'+''.join('# '+s+'\n' for s in steps)
    if k=='SV-11124':
        b+='\n*To check the photo refresh*\n# Sign in to Staging as any user and click your initials or photo at the top right, then *Edit Profile*.\n# Click the photo on the left (*Click to upload a profile photo*), choose a new picture and reload the page (F5): the new photo shows on the profile page and at the top right.\n# In a second browser, sign in as another user and click *Schedule* in the top menu. Find the first user\'s row: after you reload, it shows the new photo.\n'
    open(O+k+'-passed.txt','w').write(b); print(k,len(b))
