#!/usr/bin/env python3
"""Exhibits for the short-word ticket. Rule 116: landscape, 2x source downsampled, and a banner
that says WHAT YOU ARE LOOKING AT rather than repeating the ticket title."""
from PIL import Image, ImageDraw, ImageFont
D='build/global-search/shortword-2026-10-01/pics/'
def font(sz,b=False):
    for p in ['/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf'%('-Bold' if b else ''),
              '/usr/share/fonts/truetype/liberation/LiberationSans%s.ttf'%('-Bold' if b else '')]:
        try: return ImageFont.truetype(p,sz)
        except Exception: pass
    return ImageFont.load_default()
def panel(src,h,label,sub,good):
    im=Image.open(D+src).convert('RGB')
    im=im.crop((0,0,im.width,min(h,im.height)))
    if im.height<h:
        pad=Image.new('RGB',(im.width,h),'#ffffff'); pad.paste(im,(0,0)); im=pad
    head=92; out=Image.new('RGB',(im.width,im.height+head),'#ffffff'); out.paste(im,(0,head))
    d=ImageDraw.Draw(out); c='#1a7f37' if good else '#cf222e'
    d.rectangle([0,0,im.width,head],fill=c)
    d.text((26,16),label,font=font(31,True),fill='#fff'); d.text((26,54),sub,font=font(24),fill='#fff')
    d.rectangle([0,head,im.width-1,im.height+head-1],outline=c,width=5)
    return out
def pair(a,b,title,sub,out_name):
    gap=26; cap=118
    W=a.width+b.width+gap*3; H=max(a.height,b.height)+cap+gap*2
    o=Image.new('RGB',(W,H),'#f6f8fa'); o.paste(a,(gap,cap+gap)); o.paste(b,(gap*2+a.width,cap+gap))
    d=ImageDraw.Draw(o)
    d.text((gap,24),title,font=font(35,True),fill='#1f2328')
    d.text((gap,72),sub,font=font(28),fill='#57606a')
    o=o.resize((o.width//2,o.height//2),Image.LANCZOS)
    o.save(D+out_name); print('written',out_name,o.size)

# EXHIBIT 1 - the core fault: one letter, and the screen goes blank
pair(panel('wo-exact-Santa.png',700,'Typed correctly:  Santa','Six work orders come back.',True),
     panel('wo-blank-Saxta.png',700,'One letter wrong:  Saxta','Nothing. "No results found" - and no hint that a longer word would work.',False),
     'Work Orders tab - one letter changed, and the screen goes empty',
     'The message never tells the user a minimum length applies, or suggests typing more.',
     'EXHIBIT-1-one-letter-blank-screen.png')

# EXHIBIT 2 - the contradiction: same damage, opposite outcome, different tab
pair(panel('asset-works-Johxson.png',700,'Assets:  Johxson (from Johnson)','Forgiven. Seven records come back.',True),
     panel('po-blank-Adxms.png',700,'Purchase Orders:  Adxms (from Adams)','Not forgiven. Nothing at all.',False),
     'The same kind of slip, on two tabs, with opposite results',
     'A user who learns "typos are forgiven" on one screen gets a blank page on the next. Neither is an identifier.',
     'EXHIBIT-2-inconsistent-between-tabs.png')

# EXHIBIT 3 - it is not one tab
pair(panel('vi-blank-Abxdi.png',700,'Vendor Invoices:  Abxdi (from Abadi)','Nothing at all.',False),
     panel('ps-missing-Adrxan.png',700,'Part Sales:  Adrxan (from Adrian)','Results appear - but not the record you wanted.',False),
     'Two more tabs, two more ways to lose the record',
     'On one the screen is empty; on the other it is full of results that do not include what you searched for.',
     'EXHIBIT-3-more-tabs-affected.png')
