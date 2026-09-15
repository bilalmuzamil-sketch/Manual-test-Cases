#!/usr/bin/env python3
"""Part two: the seven whose halves are not a plain live-product-versus-new-version pair.

Four of them keep an ARCHIVED top half that the QA lead's own report already annotated - boxes are
not drawn over his boxes. Only the half photographed today gets marked up.
"""
import os, subprocess
from PIL import Image
D='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14'
TOOL=['python3','/home/user/Manual-test-Cases/build/testing-tools/compose_compare.py']

def run(cmd):
    r=subprocess.run(TOOL+cmd,capture_output=True,text=True,env={**os.environ,'MAXW':'560'})
    print(('  '+(r.stdout or r.stderr)).rstrip())

def v2b(path, second, third):
    h=Image.open(f'{D}/{path}').height
    return ['--v2-note','8,60,The same words typed', '--v2-note',f'64,114,{second}',
            '--v2-note',f'118,{max(150,h-45)},{third}']

SECTION = [
 ('SV-10014','0ED823VK8BWL1Y0MP','evidence/DEFECT-D1-vin.png','fixed-shots/SV-10014-now.png','Assets',
  'Assets said 1 along the top, and opening Assets said: No results',
  'Assets says 1 and opening Assets lists the vehicle - 2016 Ram 2500, 4 Star Truck Repair',
  "A vehicle's chassis number, and what the Assets section says about it",
  'Assets reads 1 - the same count as before','and the vehicle is listed, so the count and the section now agree'),
 ('SV-10015',"the supplier's contact email",'evidence/DEFECT-D2-vendor.png','fixed-shots/SV-10015-now.png','Vendors',
  'Vendors said 1 along the top, and opening Vendors said: No results',
  'Vendors says 1 and opening Vendors lists the supplier - Carolina Truck & Trailer Repair',
  "A supplier's contact email, and what the Vendors section says about it",
  'Vendors reads 1 - the same count as before','and the supplier is listed, so the count and the section now agree'),
 ('SV-10016','ZZT-88-4412','evidence/DEFECT-D3-part.png','fixed-shots/SV-10016-now.png','Parts',
  'Parts said 1 along the top, and opening Parts said: No results',
  'Parts says 1 and opening Parts lists the part - ZZAUTOTEST Brake Chamber Kestrel',
  'A part number, and what the Parts section says about it',
  'Parts reads 1 - the same count as before','and the part is listed, so the count and the section now agree'),
 ('SV-10017','part of a job number','evidence/DEFECT-D4-wo.png','fixed-shots/SV-10017-now.png','Work orders',
  'Work orders said 1 along the top, and opening Work orders said: No results',
  'Work orders says 1 and opening Work orders lists the job - S9160-17615, A & J Truck & Trailer Repair',
  'Part of a job number, and what the Work orders section says about it',
  'Work orders reads 1 - the same count as before','and the job is listed, so the count and the section now agree'),
]
for key,typed,v1,v2,sect,v1s,v2s,cap,c2,c3 in SECTION:
    print(key)
    run(['--v1',f'{D}/{v1}','--v2',f'{D}/{v2}','--out',f'{D}/ticket-images/{key}.png',
         '--typed',typed,'--typed-label','Typed into the search box:',
         '--top-mark','bad','--bottom-mark','good',
         '--top-label','AS REPORTED, 14 September','--bottom-label','THE SAME SEARCH TODAY, 15 September',
         '--v1-says',v1s,'--v2-says',v2s,'--caption',cap] + v2b(v2,c2,c3))

print('SV-10056')
run(['--v1',f'{D}/fixed-shots/SV-10056-v1.png','--v2',f'{D}/fixed-shots/SV-10056-v2.png',
     '--out',f'{D}/ticket-images/SV-10056.png',
     '--typed','the number of a job created seconds earlier','--typed-label','Typed into the search box:',
     '--top-mark','good','--bottom-mark','good',
     '--top-label','THE LIVE PRODUCT - a job made and searched straight away',
     '--bottom-label','THE NEW VERSION - a job made and searched straight away',
     '--v1-says','the job came back after 11 seconds',
     '--v2-says','the job came back after 10 seconds - the same, and inside the 30 asked for',
     '--caption','A brand new job, searched by its number on both versions',
     '--v1-note','14,44,The number of the job just created',
     '--v1-note','46,68,It comes back under Work Orders',
     '--v1-note','70,134,the job itself, eleven seconds after it was made'] +
    v2b('fixed-shots/SV-10056-v2.png','Work orders reads 1','the job itself, ten seconds after it was made'))

print('SV-10059')
run(['--v1',f'{D}/fixed-shots/SV-10059-then.png','--v2',f'{D}/fixed-shots/SV-10059-now.png',
     '--out',f'{D}/ticket-images/SV-10059.png',
     '--typed','something that matches nothing, then the box cleared','--typed-label','Done in the search box:',
     '--top-mark','bad','--bottom-mark','good',
     '--top-label','AS REPORTED, 15 September - a search that matched nothing',
     '--bottom-label','AFTER CLEARING THE BOX, checked again the same day',
     '--v1-says','the panel showed only the message, and nothing was listed',
     '--v2-says','the recently viewed list is back, under Recent searches',
     '--caption','What the search box shows after a search that finds nothing',
     '--v1-note','8,60,Something that matches nothing, typed in',
     '--v1-note','64,114,Every count reads nought',
     '--v1-note','118,295,and nothing at all is listed below it'] +
    v2b('fixed-shots/SV-10059-now.png','The box is empty again','and the recently viewed list is back, under Recent searches'))

print('SV-10061')
run(['--v1',f'{D}/enter-catalogue/crop-enter-without-mouse.png','--v2',f'{D}/enter-catalogue/crop-enter-after-hover.png',
     '--out',f'{D}/ticket-images/SV-10061.png',
     '--typed','Truck','--typed-label','Typed into the search box, both times:',
     '--top-mark','good','--bottom-mark','bad',
     '--top-label','WITHOUT TOUCHING THE MOUSE  -  press Enter',
     '--bottom-label','AFTER THE POINTER CROSSED THE LIST AND MOVED AWAY  -  press Enter',
     '--v1-says','Desert Edge Truck Service & Repair opens',
     '--v2-says','Henderson Mobile Truck Repair opens - the row the pointer passed over, which nobody clicked',
     '--caption','The same word, the same key, two different records',
     '--v1-note','8,50,The same word is still in the box',
     '--v1-note','88,215,and this is the record Enter opened',
     '--v2-note','8,50,The same word, typed the same way',
     '--v2-note','88,215,but a different record opened - the one the pointer crossed'])
print('done')
