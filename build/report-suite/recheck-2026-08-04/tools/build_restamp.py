#!/usr/bin/env python3
"""Build the Rule-54 re-stamp plan from the LIVE case text.

WHY the wording changes as well as being re-applied:
  The old line said only "the build tested on 8/4/2026". Two builds existed on 8/4/2026
  (v3.4.1-0ed4433 and v3.4.1-3d03023), so the date ALONE cannot say which one was tested —
  the re-check queue itself flagged that ambiguity. Standing Rule 49 obligation (3) requires
  the BUILD MARKER to live on the case, and Rule 54 is the named mechanism for it. So the
  re-stamp adds the marker: "...tested on 8/4/2026 (build v3.4.1-3d03023), and as per...".

Idempotent: an existing "(build ...)" clause is REPLACED, never appended to.
"""
import json, os, re, sys
HERE=os.path.dirname(os.path.abspath(__file__))
BUILD_DATE='8/4/2026'
BUILD_MARKER='v3.4.1-3d03023'
LEAD='This is the expected behaviour as per the build tested on'
# matches "...tested on <date>" optionally already followed by "(build <marker>)"
DATE_CLAUSE=re.compile(re.escape(LEAD)+r'\s+([0-9]{1,2}/[0-9]{1,2}/[0-9]{4})(\s*\(build [^)]*\))?')

def restamp(expected):
    if LEAD not in expected: return expected, 'NO-LINE'
    def sub(m):
        return f'{LEAD} {BUILD_DATE} (build {BUILD_MARKER})'
    new, n = DATE_CLAUSE.subn(sub, expected)
    if n==0: return expected, 'LEAD-BUT-NO-DATE'
    return new, ('UNCHANGED' if new==expected else 'RESTAMPED')

def main():
    live=json.load(open(os.path.join(HERE,'..','data','live-cases-START.json')))
    ours=[c for c in live if c.get('created_by')==3]
    plan=[]; counts={}
    for c in ours:
        e=c.get('custom_expected') or ''
        new,kind=restamp(e)
        counts[kind]=counts.get(kind,0)+1
        if kind=='RESTAMPED':
            plan.append({'id':c['id'],'title':c['title'],'section_id':c['section_id'],
                         'field':'custom_expected','before':e,'after':new})
    print('cases considered:',len(ours))
    for k,v in sorted(counts.items()): print(f'  {k:16s} {v}')
    json.dump(plan, open(os.path.join(HERE,'..','data','restamp-plan.json'),'w'), indent=1)
    print('plan rows:',len(plan))
    # idempotency proof: apply twice, must be identical
    if plan:
        once=plan[0]['after']; twice,_=restamp(once)
        print('IDEMPOTENT:', twice==once)
        print('\nSAMPLE BEFORE:', plan[0]['before'].splitlines()[-1][:200])
        print('SAMPLE AFTER :', plan[0]['after'].splitlines()[-1][:200])
if __name__=='__main__': main()
