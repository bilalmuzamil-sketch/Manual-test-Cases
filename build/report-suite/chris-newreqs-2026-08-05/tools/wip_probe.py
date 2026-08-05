#!/usr/bin/env python3
"""Re-runnable evidence script for this pass. Reads only; never writes to the app.
1. WIP filter option lists vs the union of every row across all four tabs (Rule 50, both directions).
2. The WIP export failure, probed per tab and per row-count.
NEVER calls quick-login (the shared session must not be rotated)."""
import sys,os,json,urllib.parse,collections
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
import sv
HD="b3c8c820-f815-4cf1-8938-10956c5ee71a"; LB="f8a8b802-7780-4b16-bf10-343caeb616b2"
LOCS=f"{HD},{LB}"
F=urllib.parse.quote("2025-09-01T00:00:00.000Z"); T=urllib.parse.quote("2026-08-05T23:59:59.000Z")
RNG=f"from={F}&to={T}"
TABS=["ApprovedPartiallyCompleted","ApprovedNotStarted","Completed","Estimates"]
def rows(tab,rpp=1000):
    c,d=sv.j(f"/api/reporting/reports/work-in-progress?{RNG}&locations={LOCS}&tab={tab}&pagination%5BrowsPerPage%5D={rpp}")
    dd=d.get('data') or {}
    return dd.get('collection') or [], (dd.get('pagination') or {})
def main():
    allrows=[]; pag={}
    for t in TABS:
        r,p=rows(t); allrows+=r; pag[t]=p
    c,d=sv.j(f"/api/reporting/reports/work-in-progress/filters?{RNG}&locations={LOCS}")
    flt=(d.get('data') or {})
    radv={r['advisor'] for r in allrows if r.get('advisor')}
    rcus={r['customer'] for r in allrows if r.get('customer')}
    runit={r['unit_number'] for r in allrows if r.get('unit_number')}
    rvin={r['vin'] for r in allrows if r.get('vin')}
    fadv=set(flt['advisors']); fcus=set(flt['customers'])
    funit={a['unit_number'] for a in flt['assets'] if a['unit_number']}
    fvin={a['vin'] for a in flt['assets'] if a['vin']}
    res={"rows_total":len(allrows),"pagination":pag,
      "advisors":{"rows":len(radv),"filters":len(fadv),"rows_minus_filters":sorted(radv-fadv),"filters_minus_rows":sorted(fadv-radv)},
      "customers":{"rows":len(rcus),"filters":len(fcus),"rows_minus_filters":sorted(rcus-fcus),"filters_minus_rows":sorted(fcus-rcus)},
      "units":{"rows":len(runit),"filters":len(funit),"rows_minus_filters":sorted(runit-funit),"filters_minus_rows":sorted(funit-runit)},
      "vins":{"rows":len(rvin),"filters":len(fvin),"rows_minus_filters":sorted(rvin-fvin),"filters_minus_rows":sorted(fvin-rvin)}}
    # exports per tab
    exp={}
    for t in TABS:
        c,_,_=sv.raw(sv.API+f"/api/reporting/reports/work-in-progress/export?format=csv&{RNG}&locations={HD}&tab={t}&columns=wo_number",out="/tmp/rs-nr/_e",hdrs=True)
        exp[t]={"http":c,"rows_in_tab":pag[t].get("rowsNumber")}
    res["export_csv_per_tab"]=exp
    print(json.dumps(res,indent=1))
if __name__=="__main__": main()
