import sys,json,datetime
sys.path.insert(0,'/tmp'); import tr
def now(): return datetime.datetime.utcnow().isoformat()+'Z'
LOG=open('build/report-suite/fabian-review-2026-08-17/testrail-execution-log.txt','a')
def L(s): LOG.write(s+'\n'); LOG.flush(); print(s)

CID=30493
st,live=tr.req(f"get_case/{CID}")
assert st==200
snap={k:live.get(k) for k in ['title','custom_preconds','custom_steps','custom_expected','refs','section_id','type_id','priority_id','custom_atmstatus']}
L(f"SNAPSHOT {now()} C{CID} atmstatus={snap['custom_atmstatus']} sec={snap['section_id']}")

exp=snap['custom_expected']
OLD='Estimates — "Quotes the customer has not approved yet — not counted in the totals."'
NEW='Estimates — "The total value of all estimate lines that have not yet been approved, including lines awaiting authorization on open work orders."'
assert OLD in exp, "old estimate line not found"
# split body/prov/marker at first '---'
body, _sep, _rest = exp.partition('\n\n---\n')
assert body and _sep, "no provenance separator"
body2 = body.replace(OLD, NEW)
note=("Note for the tester: the report's written specification currently states this Estimates "
      "explanation two ways - a shorter older wording and the design-review locked wording shown "
      "above. This test follows the design-review locked wording (Fabian's design review, "
      "17 August 2026), which is the most recent decision. The shorter wording is a leftover in "
      "the specification and has been raised with the product owner.")
body2 = body2 + "\n\n" + note
prov=("This is the expected behaviour as per epic SV-8582, read on 17 August 2026, and story "
      "SV-8661, and the Work In Progress report specification version 21 (S5-R12; S5a-R2), read on 17 August 2026.")
marker="AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026"
new_exp=f"{body2}\n\n---\n{prov}\n\n{marker}"
new_refs="SV-8661 (WIP spec v21 2026-08-14 S5-R12; S5a-R2 - Estimates explanation locked verbatim per Fabian design review 2026-08-17; S5-R12 short wording is a spec leftover)"
assert len(new_refs)<=248 and '<' not in new_exp and '>' not in new_exp

payload={'title':snap['title'],'refs':new_refs,'custom_preconds':snap['custom_preconds'],
         'custom_steps':snap['custom_steps'],'custom_expected':new_exp}
L(f"INTENT {now()} update_case C{CID} custom_expected(estimate-verbatim+divergence-note) refs(v21)")
st2,res=tr.req(f"update_case/{CID}",payload)
if st2!=200:
    L(f"  FAIL HTTP {st2} {json.dumps(res)[:200]}"); sys.exit(2)
st3,after=tr.req(f"get_case/{CID}")
def nr(s): return ','.join(p.strip() for p in (s or '').split(','))
checks={
  'custom_expected':(new_exp,after.get('custom_expected')),
  'refs':(nr(new_refs),nr(after.get('refs'))),
  'title':(snap['title'],after.get('title')),
  'custom_preconds':(snap['custom_preconds'],after.get('custom_preconds')),
  'custom_steps':(snap['custom_steps'],after.get('custom_steps')),
  'section_id':(snap['section_id'],after.get('section_id')),
  'custom_atmstatus':(snap['custom_atmstatus'],after.get('custom_atmstatus')),
}
mism=[k for k,(a,b) in checks.items() if a!=b]
if mism:
    for k in mism: L(f"  MISMATCH {k}\n   intended={checks[k][0]!r}\n   live={checks[k][1]!r}")
    L("STOP: byte mismatch"); sys.exit(3)
L(f"  OK C{CID} HTTP 200 verified: custom_expected+refs updated; preconds/steps/title/section/atmstatus byte-identical to snapshot")
# mirror local
import glob
for f in glob.glob('build/report-suite/cases/cases-wip-*.json'):
    d=json.load(open(f)); ch=False
    for c in d:
        if c.get('testrail_id')=='C30493':
            c['expected']=new_exp; c['refs']=new_refs; c['spec_ref']=new_refs; ch=True
    if ch: json.dump(d,open(f,'w'),indent=1); L(f"  mirrored local {f}")
LOG.close()
