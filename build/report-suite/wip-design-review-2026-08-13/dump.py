import json,glob,re
for f in sorted(glob.glob('snapshots/C*-PRE.json'), key=lambda x:int(re.search(r'C(\d+)',x).group(1))):
    d=json.load(open(f))
    print("="*90)
    print(f"C{d['id']}  atm={d.get('custom_atmstatus')}  | {d['title']}")
    print(f"refs: {d.get('refs')}")
    print("--PRECONDS--"); print(d.get('custom_preconds'))
    print("--STEPS--"); print(d.get('custom_steps'))
    print("--EXPECTED--"); print(d.get('custom_expected'))
