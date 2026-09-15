#!/usr/bin/env python3
"""Build every Global Search report's picture, annotated.

One place, one table. The pictures built on 15 September had framing labels round each half and
nothing inside them - so a reader still had to work out where to look, which is exactly what "a bare
screenshot is not an annotated one" means. Every half now carries numbered boxes on the search box,
the counts and the result area, with a numbered legend underneath, in the house style.

The archived halves (the reports raised from the QA lead's recording) are ALREADY annotated that way,
so they are left alone - marking them again would draw boxes over his boxes.
"""
import os, subprocess, sys
from PIL import Image

D = '/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14'
TOOL = ['python3','/home/user/Manual-test-Cases/build/testing-tools/compose_compare.py']

def v1_bands(path, third):
    h = Image.open(path).height
    return [f'14,44,What was typed', f'46,68,The group it comes back under', f'70,{h-5},{third}']

def v2_bands(path, second, third):
    h = Image.open(path).height
    return [f'8,60,The same words typed', f'64,114,{second}', f'118,{max(150,h-45)},{third}']

def build(key, v1, v2, typed, v1_says, v2_says, caption, v1_notes=None, v2_notes=None,
          top_label=None, bottom_label=None, top_mark='good', bottom_mark='bad', typed_label=None):
    cmd = TOOL + ['--v1', f'{D}/{v1}', '--v2', f'{D}/{v2}', '--out', f'{D}/ticket-images/{key}.png',
                  '--typed', typed, '--v1-says', v1_says, '--v2-says', v2_says, '--caption', caption,
                  '--top-mark', top_mark, '--bottom-mark', bottom_mark]
    if top_label: cmd += ['--top-label', top_label]
    if bottom_label: cmd += ['--bottom-label', bottom_label]
    if typed_label: cmd += ['--typed-label', typed_label]
    for n in (v1_notes or []): cmd += ['--v1-note', n]
    for n in (v2_notes or []): cmd += ['--v2-note', n]
    r = subprocess.run(cmd, capture_output=True, text=True, env={**os.environ,'MAXW':'560'})
    print(('  ' + (r.stdout or r.stderr)).rstrip())

NOUGHT = 'Every count along the top reads nought'

# --- the thirteen where the live product finds it and the new version does not ----------------
PLAIN = [
 ('SV-10001','ZZT-77-3300','the part comes back, under Parts','nothing comes back at all',
  'A catalogue part number typed into both versions','the part itself comes back', NOUGHT,
  'What the panel says instead'),
 ('SV-10002','44872-9931','the customer comes back, under Customers','nothing comes back at all',
  "A customer's postcode typed into both versions",'the customer itself comes back', NOUGHT,
  'What the panel says instead'),
 ('SV-10003','bridgeporthauling-zzt.com','the customer comes back, under Customers','nothing comes back at all',
  "A customer's website typed into both versions",'the customer itself comes back', NOUGHT,
  'What the panel says instead'),
 ('SV-10004','Dispatch Supervisor','the company that person works for comes back','nothing comes back at all',
  "A contact's job title typed into both versions",'the company itself comes back', NOUGHT,
  'What the panel says instead'),
 ('SV-10005','43055-2210','the supplier comes back, under Vendors','nothing comes back at all',
  "A supplier's postcode typed into both versions",'the supplier itself comes back', NOUGHT,
  'What the panel says instead'),
 ('SV-10007','OHZZT471','the vehicle comes back, under Assets','nothing comes back at all',
  "A vehicle's number plate typed into both versions",'the vehicle itself comes back', NOUGHT,
  'What the panel says instead'),
 ('SV-10057','555-0143','the customer comes back, under Customers','nothing comes back at all',
  'Part of a telephone number typed into both versions','the customer itself comes back', NOUGHT,
  'What the panel says instead'),
 ('SV-10058','ZZ4471','the vehicle comes back, under Assets','nothing comes back at all',
  'Part of a chassis number typed into both versions','the vehicle itself comes back', NOUGHT,
  'What the panel says instead'),
 ('SV-10060','ernva','the customers in that town come back','nothing comes back at all',
  'A fragment from the middle of a town name typed into both versions','the customers themselves come back',
  NOUGHT,'What the panel says instead'),
]
for key,typed,v1s,v2s,cap,n3,c2,c3 in PLAIN:
    v1=f'prod-evidence/V1-{key}.png'; v2=f'qa-evidence/V2-{key}.png'
    print(key); build(key,v1,v2,typed,v1s,v2s,cap,v1_bands(f'{D}/{v1}',n3),v2_bands(f'{D}/{v2}',c2,c3))

# --- the four whose wording needs its own care ------------------------------------------------
print('SV-10006')
build('SV-10006','prod-evidence/V1-SV-10006.png','qa-evidence/V2-SV-10006.png','Ohio',
 'the customers in Ohio come back AND so does the supplier in Ohio',
 'the customers in Ohio come back, but the supplier in Ohio does not - the only supplier shown has Ohio in its name',
 'The name of a state typed into both versions',
 v1_bands(f'{D}/prod-evidence/V1-SV-10006.png','Both kinds of company come back - customers AND the supplier'),
 v2_bands(f'{D}/qa-evidence/V2-SV-10006.png','Vendors reads 1, so something was found',
          'but that one is Ohioville Diesel Services, matched on its NAME - the supplier in Ohio is missing'))
print('SV-10008')
build('SV-10008','prod-evidence/V1-SV-10008.png','qa-evidence/V2-SV-10008.png','Estimate',
 'the jobs at Estimate stage come back','no job at Estimate stage comes back; the one job shown is at Paid',
 'A job stage typed into both versions',
 v1_bands(f'{D}/prod-evidence/V1-SV-10008.png','the jobs sitting at that stage come back'),
 v2_bands(f'{D}/qa-evidence/V2-SV-10008.png','Work orders reads 1, and Customers and Vendors read many',
          'the one job is at Paid, and the rest are addresses containing the word Estate'))
print('SV-10025')
build('SV-10025','prod-evidence/V1-SV-10025.png','qa-evidence/V2-SV-10025.png','Marlene',
 'only the records that really carry that name come back','eighteen results, most of them nothing to do with the name typed',
 'A correctly spelled customer name typed into both versions',
 v1_bands(f'{D}/prod-evidence/V1-SV-10025.png','only the records carrying that name'),
 v2_bands(f'{D}/qa-evidence/V2-SV-10025.png','eighteen results across five groups',
          'battery terminals described as MARINE, and a vehicle belonging to Martens'))
print('SV-10055')
build('SV-10055','prod-evidence/V1-SV-10055.png','qa-evidence/V2-SV-10055.png','2019 Freightliner',
 'the vehicle comes back, under Assets','thirty-five results and not one of them a vehicle',
 "A vehicle's year and make typed into both versions",
 v1_bands(f'{D}/prod-evidence/V1-SV-10055.png','the vehicle itself comes back'),
 v2_bands(f'{D}/qa-evidence/V2-SV-10055.png','Assets reads nought, while thirty-five other things are found',
          'parts and orders, matched on the words Freightliner or 2019'))

# --- the two new supplier reports --------------------------------------------------------------
print('SV-10109')
build('SV-10109','prod-supplier/V1-supplier-address-line-2.png','fixed-shots/vendor-addr2-v2.png','Bay 12C',
 'the supplier whose address line 2 that is comes back, under Vendors',
 'that supplier does not come back. The one company listed under Vendors is B&K Truck Repair LLC, offered because its NAME looks a little like what was typed',
 "A supplier's address line 2 typed into both versions",
 v1_bands(f'{D}/prod-supplier/V1-supplier-address-line-2.png','the supplier itself comes back'),
 v2_bands(f'{D}/fixed-shots/vendor-addr2-v2.png','Vendors reads 1, so something was found',
          'but that one is B&K Truck Repair LLC, matched on its NAME - the supplier is missing'))
print('SV-10110')
build('SV-10110','prod-supplier/V1-supplier-website.png','c55692/step2-vendor-website.png','kestrelsupply-zzt.com',
 'the supplier comes back, under Vendors','nothing comes back at all',
 "A supplier's website typed into both versions",
 v1_bands(f'{D}/prod-supplier/V1-supplier-website.png','the supplier itself comes back'),
 v2_bands(f'{D}/c55692/step2-vendor-website.png',NOUGHT,'What the panel says instead'))
print('done')
