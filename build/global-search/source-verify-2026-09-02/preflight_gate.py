#!/usr/bin/env python3
"""Pre-flight: run the runnable-gate audit on the AUTHORED intended-blocks text,
before applying to TestRail, so a wording failure is caught locally not post-hoc."""
import json, sys, importlib.util
spec=importlib.util.spec_from_file_location("crc","build/testing-tools/check_runnable_cases.py")
crc=importlib.util.module_from_spec(spec); spec.loader.exec_module(crc)
IB="build/global-search/source-verify-2026-09-02/intended-blocks.json"
cases=json.load(open(IB))
only=set(sys.argv[1:])
bad=0
for cid,c in cases.items():
    if only and cid not in only: continue
    f=c['fields']
    fake={'title':c.get('title',''),
          'custom_preconds':'<p>'+f['custom_preconds']['text'].replace('\n','</p><p>')+'</p>',
          'custom_steps':'<p>'+f['custom_steps']['text'].replace('\n','</p><p>')+'</p>'}
    fails=crc.audit(fake)
    if fails:
        bad+=1; print(f"C{cid}: {c.get('title','')[:50]}")
        for x in fails: print("   -",x)
print(f"\nPREFLIGHT: {len(only) or len(cases)} checked, {bad} would fail the runnable gate")
sys.exit(1 if bad else 0)
