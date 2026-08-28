import sys,json; sys.path.insert(0,'/tmp/sv8815-staging')
from api import *
HD="b3c8c820-f815-4cf1-8938-10956c5ee71a"
CID="b3aa863a-665d-4096-8a14-b6c0bd9d50ee"
CAT="b25c5c04-fe8d-4c21-a15c-a02c69f1ee5d"
def boot():
    login(); call("POST","/iam/change-location",{"workplace_id":HD,"workplace_timezone":"America/Edmonton"})
def mkPartSale(prices,tag):
    c,d=call("POST","/part-sales",{"company_id":CID}); assert c==200,(c,d)
    ps=d['data'][0]['id']
    c,d=call("GET","/work-orders/lines/"+ps); line=d['data']['collection'][0]['line_id']
    ids=[]
    for i,pr in enumerate(prices):
        c,d=call("POST","/work-orders/part/make-request",{"line":line,"work_order":ps,
            "description":f"ZZAUTOTEST {tag} part {chr(65+i)}","quantity":1,"part_source_type":"found"})
        assert c==201,(c,d); pid=d['data']['id']; ids.append(pid)
        c,d=call("POST","/work-orders/part/change-request",{"id":pid,
            "description":f"ZZAUTOTEST {tag} part {chr(65+i)}","quantity":1,"sell_price":pr,
            "part_source_type":"found","part_category_id":CAT,"work_order":ps,"line":line})
        assert c==200,(c,d)
    # strip the org's default fees/discounts so the invoice is only the parts
    c,d=call("GET","/work-orders/view/"+ps)
    for a in d['data']['work_order']['adjustments']:
        call("POST","/work-orders/adjustments/remove",{"adjustmentId":a['id'],"workOrderId":ps})
    return ps,line,ids
def view(ps):
    c,d=call("GET","/work-orders/view/"+ps); w=d['data']['work_order']
    return {"num":w['number'],"sub":w['sub_total'],"tax":w['total_tax_cost'],"total":w['total_cost'],
            "invoiceId":w['invoice_id'],"status":w['status'],"adj":w['totalAdjustments']}
def lines(ps):
    c,d=call("GET","/work-orders/lines/"+ps); return d['data']['collection'][0]
