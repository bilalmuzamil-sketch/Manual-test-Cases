# usage: python3.12 exhibit2.py -> SV-11684 retest exhibits (build 7516f9c, 6 Nov 2026)
src=open('exhibit.py').read(); exec(src[:src.index("PROD='")])
OLD='QA branch sv11684  build v26.45.1-5bdeeb6  5 Nov 2026'; NEW='QA branch sv11684  build v26.45.1-7516f9c  6 Nov 2026'
row([panel('V2-phone-1-tap.png',(0,90,390,240),[((24,148,366,175),RED,'Cut off; tap shows nothing',1)],'BEFORE - previous build, phone',RED,OLD,s=3),
     panel('R2V2-phone-0.png',(0,90,390,240),[((24,148,366,195),GRN,'Full email, wrapped in the card',1)],'AFTER - today\'s build, phone',GRN,NEW,s=3)],
    ['Vendor ZZAUTOTEST SV11684 long email > Contacts, iPhone 12 Pro preset (390 x 844, touch).','Before: the address was cut short with "..." and could not be read. Now it wraps onto two lines inside the card.'],'r2-1-phone-before-after.png')
row([panel('R2V2-1440.png',(20,60,640,260),[((40,152,340,182),RED,'Still cut off with "..."',1)],'TODAY\'S BUILD, desktop 1440 wide',RED,NEW),
     panel('R2V1-1280.png',(20,60,640,260),[((40,152,310,182),RED,'Cut off with "..."',1)],'TODAY\'S BUILD, desktop 1280 wide',RED,NEW)],
    ['Left: vendor ZZAUTOTEST SV11684 long email. Right: vendor Saint Cloud Diesel Repair (christopher.christensen@staging.shopview.local).','Both are cut short on one line; the rest only shows when the mouse rests on the address. At 900 wide and below they wrap.'],'r2-2-desktop-still-cut.png')
