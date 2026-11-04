#!/usr/bin/env python3
"""Q38 re-check: the invoice record (own term + due date) and the customer card's current term, DVI Test in its live zone. Read-only.
Usage: TZ=Pacific/Fiji python3 d7_record.py"""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from s3 import use, get, dump
L = use('DVI'); W = L['wid']
INV = 'b0099f00-7006-4f6e-94b7-14e815983958'; CUST = '64b8444e-8f5b-48d6-9cfe-0c4fa1adb4b6'
s, iv = get(f'/api/invoices/{INV}/view', None, W); c = (iv.get('data') or {}).get('collection', {})
o = {'zones': L, 'invoice': {'status': s, **{k: c.get(k) for k in ('display_number', 'credit_terms', 'due_date', 'invoice_date', 'created_at', 'status')}}}
s, cv = get(f'/api/customers/view/{CUST}', None, W); cc = (cv.get('data') or {}).get('company') or {}
o['customer_card'] = {'status': s, 'name': cc.get('name'), **{k: cc.get(k) for k in cc if 'term' in k.lower()}}
print(json.dumps(o, default=str)[:1500]); print(dump('server-d7-DVI-records', o))
