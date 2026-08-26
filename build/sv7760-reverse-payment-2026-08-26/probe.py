#!/usr/bin/env python3
"""SV-7760 - reverse-customer-payment should return 4xx, not an opaque 500, when the payment
cannot be resolved for the caller's org.

BUDGET RULE FOR THIS SCRIPT: print a VERDICT LINE per probe, never a raw body dump.
Bodies are truncated to 130 chars. That is what keeps a test run cheap.

Non-destructive: a random UUID resolves to no payment, so nothing is reversed.
"""
import sys, json, uuid
sys.path.insert(0, '/tmp/sv8815-staging')
from api import call, login          # reuses this session's staging harness

EP = "/customer-account/reverse-customer-payment"

def short(d, n=130):
    s = d if isinstance(d, str) else json.dumps(d)
    return s[:n].replace("\n", " ")

print("auth:", login())

# what the endpoint wants, learned from the server rather than guessed
c, d = call("POST", EP, {})
print(f"empty body            -> {c}  {short(d)}")

probes = [
    ("nonexistent uuid",  {"payment_id": str(uuid.uuid4())}),
    ("nonexistent uuid2", {"paymentId": str(uuid.uuid4())}),
    ("malformed id",      {"payment_id": "not-a-uuid"}),
]
for label, body in probes:
    c, d = call("POST", EP, body)
    print(f"{label:21} -> {c}  {short(d)}")
