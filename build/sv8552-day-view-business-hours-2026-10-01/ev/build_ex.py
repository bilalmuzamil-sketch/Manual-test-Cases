import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from qa_exhibits import panel, stack, RED, GRN, BLU

B='/tmp/qa8552/'; P='/tmp/qa8552p/'
PROD='production app.shopview.com · build v26.39.2-1aeb22d · 1 Oct 2026 · 1700 x 1050'
BRCH='QA branch sv8552.qa.shopview.com · build v26.39.2-ad6deec · 1 Oct 2026 · 1700 x 1050'
CROP=(300,60,1700,500)
HRS=(523,1692); HRY=(130,168)

# 1 — the headline before/after, same saved hours, same screen
stack([
 panel(P+'prod-2026-10-02.png', CROP,
   'BEFORE — the shop opens 9:00 AM and the day still opens on all 24 hours',
   PROD + ' · saved hours Mon-Fri 9:00 AM - 5:00 PM',
   word=HRS, tipy=HRY, c=RED,
   word_note='12 AM to 11 PM crammed in - 52 px an hour'),
 panel(B+'a1-friday.png', CROP,
   'AFTER — the same Friday opens on the working day',
   BRCH + ' · same saved hours',
   word=HRS, tipy=HRY, c=GRN,
   word_note='8 AM to 6 PM filling the screen - 117 px an hour'),
], 'Friday 2 October on both builds, same shop hours and same screen width. The hour columns go from 52 px to 117 px wide, '
   'and the day opens one hour before opening and ends one hour after closing instead of showing the whole night.'
).save('ev/01-before-after.png')

# 2 — it follows the hours that are actually saved
stack([
 panel(B+'a1-friday.png', CROP, 'Friday - shop hours 9:00 AM to 5:00 PM', BRCH,
   word=HRS, tipy=HRY, c=BLU, word_note='opens 8 AM, ends 6 PM'),
 panel(B+'a3-wednesday.png', CROP, 'Wednesday - shop hours 8:30 AM to 4:30 PM', BRCH,
   word=HRS, tipy=HRY, c=BLU, word_note='opens 7 AM, ends 6 PM'),
], 'The window is read from the hours saved for that day, not a fixed one. Wednesday closes earlier and starts earlier, '
   'so its window starts an hour before 8:30 and is rounded out to whole hours.'
).save('ev/02-follows-the-saved-hours.png')

# 3 — jobs outside the hours widen it
stack([
 panel(B+'b3-before.png', CROP, 'Two jobs sit outside the shop hours, so the day stretches',
   BRCH + ' · Thursday 1 October · jobs 7:30-9:30 AM and 4:00-8:45 PM, both in the Service department',
   word=HRS, tipy=HRY, c=BLU, word_note='6 AM to 11 PM - whole hours either side of the work'),
 panel(B+'b3-hidden.png', CROP, 'Hide the Service department and the window does not move',
   BRCH + ' · same day, Service hidden, page refreshed - 15 lanes down to 1, neither job on screen',
   word=HRS, tipy=HRY, c=GRN, word_note='still 6 AM to 11 PM - hidden jobs still count'),
], 'The earliest job starts 7:30 AM and the latest work ends 9:17 PM. The window grows an hour past each and rounds to whole '
   'hours. Hiding the department that holds them removes them from the screen but does not shrink the day back.'
).save('ev/03-jobs-widen-the-window.png')

# 4 — a location with no saved hours is untouched
stack([
 panel(B+'h-nohours-friday.png', CROP, 'A location with no saved hours - unchanged',
   BRCH + ' · Staging Lethbridge - 4310 · Friday 2 October · no business hours saved',
   word=HRS, tipy=HRY, c=BLU, word_note='all 24 hours, the old layout'),
 panel(B+'h2-newhours.png', CROP, 'The same location, same Friday, after saving 7:00 AM - 3:00 PM',
   BRCH + ' · Staging Lethbridge - 4310 · hours saved, Schedule reloaded',
   word=HRS, tipy=HRY, c=GRN, word_note='now 6 AM to 4 PM'),
], 'Save hours and the window appears; clear them again and the old layout comes straight back. '
   'Nothing was left changed - the saved hours were read back afterwards and matched what was there before.'
).save('ev/04-no-saved-hours.png')

# 5 — clicking an empty spot near the right end still opens the right time
panel(B+'g4-create-event.png', (300,60,1700,760),
  'Clicking an empty spot near the right end opens the time you clicked',
  BRCH + ' · pointer at 7:17 PM on Julie Olson',
  c=BLU).save('ev/05-create-from-cell.png')
print('built')
