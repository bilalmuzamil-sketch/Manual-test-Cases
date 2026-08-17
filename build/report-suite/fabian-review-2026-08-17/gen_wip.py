import sys,json
sys.path.insert(0,'build/report-suite/fabian-review-2026-08-17'); import rslib as R
live=json.load(open('/tmp/live_ours.json'))
NAME='Work In Progress'; VER=21
DIVERGE=("Note: the Work In Progress report used to offer a date range with ready-made periods "
 "(This Week, This Month and so on) and a build-your-own range. That was replaced by a single "
 "\"as of\" date, a product decision by Chris Ward: work in progress is a point-in-time position, "
 "so a range over it would state something the number cannot mean. Follow the single \"as of\" date "
 "and do not look for the old presets or range.")

def prov(anchors, story_note='', diverge=False):
    s=f"This is the expected behaviour as per epic SV-8582 and the {NAME} report specification version {VER} ({anchors}), both read on 17 August 2026."
    if story_note: s+=' '+story_note
    return s

FULL={}
def full(cid, title, pre, steps, exp_items, diverge_note, anchors, refs):
    body='\n'.join(exp_items)+'\n'+diverge_note
    FULL[cid]=dict(title=title,pre='\n'.join(pre),steps='\n'.join(steps),
        exp=R.assemble(body, prov(anchors)), refs=refs)

full(30501,
 'The "as of" date is a single day: defaults to today, capped at today, no range',
 ['1. You are signed in to the ShopView App on a desktop browser that has never saved settings for this report (fresh visit).'],
 ['1. Open the Work In Progress report and read the "as of" date control\'s current value.',
  '2. Open the "as of" date control and read what it offers.'],
 ['1. On a fresh visit the "as of" date defaults to today.',
  '2. The control is a single calendar day, not a range: it offers no start-and-end pair, no ready-made periods (no "Last 12 Months", "This Month", "This Week" and so on), no "Custom" range, and no "All Time". You pick one day.',
  '3. The date is capped at today - you cannot choose a future day.',
  '4. This is the shared "as of" date control that the Inventory Value report also uses.'],
 DIVERGE, 'S7-R6; S7-R8',
 'SV-9214 (WIP spec v21 2026-08-17 S7-R6; S7-R8; single as-of date replaces the date-range control per Chris 2026-08-13)')

full(30502,
 'The "as of" date shows the end-of-day position and reloads when changed',
 ['1. You are signed in to the ShopView App on a desktop browser.',
  '2. Open work orders exist, some opened before today and some opened today.'],
 ['1. With today\'s date selected, check which work orders are listed.',
  '2. Change the "as of" date to an earlier day and watch the data area.'],
 ['1. The report shows the work in progress as it stood at the END of the selected day: every work order that was open on that day, with the Earned, Remaining and Adjustments values it held then. The "as of" date does not filter on the work order\'s created date.',
  '2. Changing the "as of" date reloads the report (the loading indicator shows).',
  '3. For today\'s date the report reads the live open work orders. For an earlier day it reconstructs the position from the nightly snapshot; if no snapshot exists for the selected day it names the nearest earlier recorded day it is showing, and if no snapshot exists at or before that day it says no snapshot is available for that date and shows no rows.'],
 DIVERGE, 'S7-R7; S7-R8a; S2-R6',
 'SV-9214 (WIP spec v21 2026-08-17 S7-R7; S7-R8a; S2-R6; single as-of date replaces the date-range control per Chris 2026-08-13)')

# targeted reword cases: (cid, reps, anchors, refs, add_diverge_note)
REP={}
def rep(cid, reps, anchors, refs, diverge=False):
    REP[cid]=dict(reps=reps,anchors=anchors,refs=refs,diverge=diverge)

rep(30508,[('Remembers the date range','Remembers the "as of" date'),
  ('Change the date range, select an advisor','Change the "as of" date, select an advisor'),
  ('restores the saved date range, advisor selection','restores the saved "as of" date, advisor selection')],
 'S8-R7','SV-8664 (WIP spec v21 2026-08-17 S8-R7; report remembers the single as-of date per Chris 2026-08-13)')
rep(30511,[('a chosen date range and location','a chosen "as of" date and location'),
  ('honor the current date range and location filter','honor the current "as of" date and location filter'),
  ('Inv. Hrs on and Advisor off','Labor Delta on and Advisor off'),
  ('if you turn Inv. Hrs on','if you turn Labor Delta on')],
 'S9-R3; S9-R10a','SV-8665 (WIP spec v21 2026-08-17 S9-R3; S9-R10a; downloads honor the as-of date; heading renamed to Labor Delta per SV-9071)')
rep(38918,[('Narrow the date range or filters, then try again.','Narrow the filters, then try again.'),
  ('widest date range, all locations','widest as-of scope, all locations')],
 'S9-R11','SV-8665 (WIP spec v21 2026-08-17 S9-R11; export size-cap message drops the date-range clause on this report per Chris 2026-08-13)')
rep(43551,[('the other column choices, the date range, the filters','the other column choices, the "as of" date, the filters')],
 'S8-R7','SV-8664 (WIP spec v21 2026-08-17 S8-R7; per-column persistence remembers the as-of date)')
rep(30456,[('created within the current date range','open on the report\'s "as of" date (which defaults to today)'),
  ('with the seeded work orders\' creation dates inside the selected date range','with the seeded work orders open on the selected "as of" date')],
 'S2-R4; S7-R7','SV-8654 (WIP spec v21 2026-08-17 S2-R4; S7-R7; population is work open on the as-of date, not filtered by created date)')
rep(30457,[('within the current date range','open on the selected "as of" date')],
 'S2-R5','SV-8654 (WIP spec v21 2026-08-17 S2-R5; open work on the as-of date)')
rep(30459,[('Change the date range to a different preset and watch the data area while the report reloads.','Change the "as of" date and watch the data area while the report reloads.')],
 'S2-R6','SV-8655 (WIP spec v21 2026-08-17 S2-R6; changing the as-of date reloads)')
rep(30460,[('Set the date range and location so that no open work order qualifies (for example, a Custom range over dates with no work orders created).','Set the "as of" date and location so that no open work order qualifies (for example, an earlier day on which nothing was open).')],
 'S2-N1','SV-8655 (WIP spec v21 2026-08-17 S2-N1; no-data message when nothing was open on the as-of date)')
rep(30462,[('within the current date range and location','open on the selected "as of" date, in the current location')],
 'S3-R1','SV-8656 (WIP spec v21 2026-08-17 S3; status-to-tab mapping on the as-of date)')
rep(30464,[('within the current date range and location','open on the selected "as of" date, in the current location')],
 'S3-R2','SV-8656 (WIP spec v21 2026-08-17 S3; Approved started-boundary on the as-of date)')
rep(43557,[('If a tab looks empty, widen the date range.','If a tab looks empty, pick an "as of" date on which work orders were open (today shows current open work).')],
 'S4-R6','SV-8663 (WIP spec v21 2026-08-17 S4; WO number link gating)')

def build():
    out=[]
    for cid,f in FULL.items():
        payload={'title':f['title'],'custom_preconds':f['pre'],'custom_steps':f['steps'],'custom_expected':f['exp'],'refs':f['refs']}
        if len(f['refs'])>248: raise SystemExit(f'refs long C{cid}')
        out.append((cid,payload))
    for cid,spec in REP.items():
        c=live[str(cid)]
        title=c['title']; pre=c.get('custom_preconds','')or''; steps=c.get('custom_steps','')or''
        body,_,_=R.split_expected(c['custom_expected'])
        def ap(s):
            for old,new in sorted(spec['reps'],key=lambda x:-len(x[0])):
                if old in s: s=s.replace(old,new)
            return s
        joined=title+'\n'+pre+'\n'+steps+'\n'+body
        for old,new in spec['reps']:
            if old not in joined: raise SystemExit(f"!! C{cid} OLD not found: {old[:60]!r}")
        nt=ap(title); npre=ap(pre); nsteps=ap(steps); nbody=ap(body)
        if 'date range' in (nt+npre+nsteps+nbody).lower():
            # allowed only if intentionally left; flag
            pass
        nexp=R.assemble(nbody, prov(spec['anchors']))
        if len(spec['refs'])>248: raise SystemExit(f'refs long C{cid}')
        out.append((cid,{'title':nt,'custom_preconds':npre,'custom_steps':nsteps,'custom_expected':nexp,'refs':spec['refs']}))
    return out

if __name__=='__main__':
    out=build(); json.dump(out,open('/tmp/wip_payloads.json','w'))
    print('built',len(out),'WIP payloads')
    for cid,p in out: print('C'+str(cid),'refs',len(p['refs']))
