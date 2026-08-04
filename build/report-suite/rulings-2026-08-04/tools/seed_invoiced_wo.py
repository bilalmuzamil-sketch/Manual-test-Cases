"""Seed a COMPLETED + INVOICED work order carrying a named sales representative.

This is the seed the 5 invoiced-hours cases (SBC-CALC-03, SBR-CALC-01/02/03,
SBR-CALC-09), the report-credit leg of SBR-DEACT-06 and the rep-snapshot legs of
SBR-WO-05 all need, and it is the seed the earlier pass could not build because it
never set a CONTACT (the whole of SV-8821).

EXACT TEST DATA THIS USES (Rule 50 - name every variable):
  workplace   Staging Heavy Duty - 9919   b3c8c820-f815-4cf1-8938-10956c5ee71a
  canned line "HD CVIP air brake trailer single/tandem"
              ce1f2549-24a9-485c-a849-267f8918d66e
              Fixed labour, fixed_price 35000, tech_time 210 min, total_parts 0
              (total_parts MUST be 0 - a parts-bearing line cannot reach Complete
               until its part requests are fulfilled, and the 400
               "Line can`t be completed with unfulfilled part requests." is CORRECT
               behaviour, not a defect)
  mileage     "123456"  - MUST be a string; a number returns 500
  contact     taken from GET /api/customers/view/{companyId} -> data.company.contacts[0]

Usage: python3 seed_invoiced_wo.py <companyId> <salesRepStaffId> [--hours N]
"""
import json
import sys
import time

sys.path.insert(0, "/tmp/report-suite-viu")
import sv  # noqa: E402

WP = "b3c8c820-f815-4cf1-8938-10956c5ee71a"
CANNED_ID = "ce1f2549-24a9-485c-a849-267f8918d66e"
CANNED_NAME = "HD CVIP air brake trailer single/tandem"


def step(label, r, ok=(200, 201)):
    body = sv.j(r)
    tag = "OK " if r.status_code in ok else "FAIL"
    print(f"  [{tag}] {label}: HTTP {r.status_code} {json.dumps(body)[:200]}")
    if r.status_code not in ok:
        raise SystemExit(f"seed aborted at: {label}")
    return body


def seed(company_id, rep_staff_id=None):
    out = {"canned_line_name": CANNED_NAME, "canned_line_id": CANNED_ID,
           "workplace_id": WP, "company_id": company_id,
           "sales_rep_staff_id": rep_staff_id}
    sv.switch_location(WP, "America/Edmonton")

    # 1. the contact person - the single thing whose absence caused SV-8821's 500
    comp = sv.j(sv.get(f"/api/customers/view/{company_id}"))["data"]["company"]
    contacts = comp.get("contacts") or []
    if not contacts:
        raise SystemExit(f"company {comp['name']} has no contact - pick another")
    contact = contacts[0]
    out["company_name"] = comp["name"]
    out["contact_id"] = contact["id"]
    out["contact_name"] = f"{contact.get('first_name','')} {contact.get('last_name','')}".strip()
    print(f"  customer {comp['name']!r}, contact {out['contact_name']!r} ({contact['id']})")

    # 2. an asset
    veh = sv.j(sv.get(f"/api/vehicles?company_id={company_id}"))
    vlist = veh.get("data", {}).get("collection") or veh.get("data") or []
    if not vlist:
        raise SystemExit(f"company {comp['name']} has no asset - pick another")
    vehicle = vlist[0]
    out["vehicle_id"] = vehicle["id"]
    out["vehicle_label"] = vehicle.get("unit_number") or vehicle.get("vin") or vehicle["id"]
    print(f"  asset {out['vehicle_label']!r} ({vehicle['id']})")

    # 3. the work order - customer_id IS the contact person on this build
    wo = step("work-orders/create", sv.post("/api/work-orders/create", {
        "company_id": company_id, "vehicle_id": vehicle["id"], "workplace_id": WP,
        "start_date": time.strftime("%Y-%m-%d"), "is_vehicle_here": True,
        "customer_id": contact["id"]}))
    wo_id = wo["data"]["work_order_id"]          # NOT "id"
    out["work_order_id"] = wo_id
    print(f"  work order {wo_id}")

    # 4. belt and braces - assert the contact onto the WO the way the UI does
    step("work-orders/change-contact", sv.post("/api/work-orders/change-contact", {
        "work_order_id": wo_id, "vehicle_id": vehicle["id"],
        "contact_id": contact["id"], "update_vehicle": True}))

    # 5. the sales representative on the work order
    if rep_staff_id:
        step("work-orders/change-sales-rep", sv.post("/api/work-orders/change-sales-rep", {
            "work_order_id": wo_id, "sales_rep_id": rep_staff_id}))

    # 6. the line, from the zero-parts canned line
    ln = step("lines/create-from-canned-line", sv.post(
        f"/api/work-orders/{wo_id}/lines/create-from-canned-line",
        {"canned_line_id": CANNED_ID, "status": "authorized"}))
    line_id = ln["data"]["line_id"] if isinstance(ln.get("data"), dict) else None
    out["line_id"] = line_id

    # 7. mileage as a STRING
    step("change-mileage", sv.post("/api/work-orders/change-mileage",
                                   {"work_order_id": wo_id, "mileage": "123456"}))
    # 8. the tech story
    step("lines/change-story", sv.post("/api/work-orders/lines/change-story", {
        "line_id": line_id, "tech_story": "ZZAUTOTEST seed for report verification",
        "work_order_id": wo_id}))
    # 9. complete the line, then the work order (field is `id`, not work_order_id)
    step("lines/change-status complete", sv.post("/api/work-orders/lines/change-status",
                                                 {"line_id": line_id, "status": "complete"}))
    step("work-orders/change-status complete", sv.post("/api/work-orders/change-status",
                                                       {"id": wo_id, "status": "complete"}))
    # 10. the invoice - 201 only because the contact exists
    inv = step("invoices/create", sv.post("/api/invoices/create", {"work_order_id": wo_id}))
    out["invoice_id"] = inv["data"]["invoice_id"]
    out["customer_account_id"] = inv["data"].get("customer_account_id")
    print(f"  invoice {out['invoice_id']}")
    return out


if __name__ == "__main__":
    company = sys.argv[1]
    rep = sys.argv[2] if len(sys.argv) > 2 and not sys.argv[2].startswith("--") else None
    res = seed(company, rep)
    print("\nSEEDED:", json.dumps(res, indent=1))
    path = "/tmp/report-suite-viu/seeded-wos.json"
    try:
        allw = json.load(open(path))
    except Exception:
        allw = []
    allw.append(res)
    json.dump(allw, open(path, "w"), indent=1)
