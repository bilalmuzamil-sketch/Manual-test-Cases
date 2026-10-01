#!/usr/bin/env python3
"""Assigns a LEAD TECHNICIAN and a SERVICE ADVISOR to a seeded work order, so that two cases
have a term a tester can actually type: SRI-WO-C2 (C146203) and SRI-WO-C3 (C146204).

WHY THIS IS A SCRIPT AND NOT A MANIFEST RECORD
The manifest creates records. This creates neither - it ATTACHES two people who already exist
to a work order the manifest already made. There is no staff-creation endpoint available to us
(`/api/staff/enrollment/create` only attaches an EXISTING person to a workplace), so a ZZ-named
technician cannot be seeded at all.

SO ATTRIBUTION IS EARNED A DIFFERENT WAY (Rule 110):
we pick a person whose SURNAME RETURNS NOTHING AT ALL before the assignment. After it, the only
row the surname can return is the one we assigned it to - which is exactly what the two cases
need, and it also puts the matched value in NEITHER the primary nor the secondary text, which is
the condition they are written to test.

🔴 THE ENDPOINTS WERE READ, NOT GUESSED (Rule 115) - app/src/api/work-orders/index.ts:
     POST /api/work-orders/change-lead-technician  {work_order_id, tech_assigned_id}
     POST /api/work-orders/change-service-advisor  {work_order_id, service_advisor_id}
   The staff lists are /api/technicians and /api/service-advisors.

🔴 THE NAMES ARE NOT STABLE ACROSS ENVIRONMENTS (Rule 111). Staff are environment data, not ours.
   The script prefers whoever it used last time (recorded in the state file); if that person is
   gone, or their surname is no longer a clean zero-match, it picks a fresh one and SAYS SO LOUDLY,
   because the two cases and the workbook then carry a stale term that must be re-read.
"""
import sys, os, json, time, importlib.util

HERE = os.path.dirname(os.path.abspath(__file__))
sys.argv = ['seed.py']
_s = importlib.util.spec_from_file_location('seedmod', os.path.join(HERE, 'seed.py'))
m = importlib.util.module_from_spec(_s); _s.loader.exec_module(m)

ENVLABEL = os.path.basename(os.path.dirname(os.environ.get('SEED_PROFILE', '/tmp/qa/cookies.json')))
STATE = os.path.join(HERE, f'wo-staff-assignment-{ENVLABEL}.json')
SEEDSTATE = os.path.join(HERE, f'seed-state-live-resultintegrity-{ENVLABEL}.json')
WO_KEY = 'ri_wo_twin_1'


def m_call_search(q):
    r = m.call('/api/search?q=' + q)
    return ((r['json'] or {}).get('data') or {}).get('groups') or []


def zero_match(surname):
    """True when the surname returns NOTHING anywhere - the only way the later hit is attributable."""
    r = m.call('/api/search?q=' + surname)
    groups = ((r['json'] or {}).get('data') or {}).get('groups') or []
    return sum(len(g.get('items') or []) for g in groups) == 0


def only_our_row(surname, wo_id, field):
    """The proof: exactly one row, ours, matched on the field we set - and the surname absent
    from BOTH displayed texts, which is what makes the case meaningful."""
    # 🔴 PRODUCTION INDEXES SLOWLY. 40 seconds was enough on the QA branch and nowhere near enough
    # here - measured 2026-10-01, where a newly created inventory part took around twenty minutes to
    # become searchable while its twin was instant. A short window turns a correct assignment into
    # "NOT proven", which is a false alarm on good data.
    for attempt in range(12):
        r = m.call('/api/search?q=' + surname)
        rows = [(g['type'], i)
                for g in (((r['json'] or {}).get('data') or {}).get('groups') or [])
                for i in (g.get('items') or [])]
        # IDENTITY, not row count. A count is not a verdict (Rule 110): on a populated estate the
        # surname legitimately returns other people's records, and insisting on exactly one row
        # would fail a perfectly good assignment. What must be true is that OUR work order is in
        # the list, matched on the field we just set.
        ours = [i for gt, i in rows
                if gt == 'work_orders' and i.get('id') == wo_id
                and (i.get('match') or {}).get('field') == field]
        if ours:
            i = ours[0]
            shown = f"{i.get('primary') or ''} {i.get('secondary') or ''}".lower()
            return True, i, (surname.lower() not in shown)
        time.sleep(15)
    return False, None, False


def clean_for(surname, wo_id):
    """🔴 THE TRAP: once we have assigned them, the remembered person's surname is NO LONGER a
    zero-match - it returns OUR row. Re-testing them with zero_match() would therefore reject the
    very person we want to keep, and the term would churn on every single reseed. The correct test
    is 'matches nothing that is not ours'."""
    r = m.call('/api/search?q=' + surname)
    rows = [i for g in (((r['json'] or {}).get('data') or {}).get('groups') or [])
            for i in (g.get('items') or [])]
    return all(i.get('id') == wo_id for i in rows)


def pick(listing, remembered, wo_id):
    """Prefer last run's person (keeps the workbook term stable); else the first clean zero-match."""
    # 🔴 ASK FOR THE WHOLE LIST. `/api/technicians` unqualified returns a short default page, and
    # on production that page did not include the staff this script had just created - so the
    # picker fell through to a surname shared by 60 work orders, which the 20-row group cap then
    # hid our record behind. A default page is not the list.
    r = m.call(listing + ('&' if '?' in listing else '?') + 'limit=200')
    people = (((r['json'] or {}).get('data') or {}).get('collection')
              or (r['json'] or {}).get('data') or [])
    byid = {}
    for p in people:
        full = (p.get('name') or f"{p.get('first_name','')} {p.get('last_name','')}").strip()
        parts = full.split()
        if len(parts) < 2:
            continue
        byid[p['id']] = (full, parts[-1])
    if remembered and remembered[0] in byid:
        pid = remembered[0]
        full, sur = byid[pid]
        if sur == remembered[2] and clean_for(sur, wo_id):
            return pid, full, sur, False          # unchanged - workbook term still valid
    for pid, (full, sur) in byid.items():
        if len(sur) >= 5 and zero_match(sur):
            return pid, full, sur, True           # CHANGED - the term moved
    # 🔴 PRODUCTION HAS NO SURNAME THAT MATCHES NOTHING, and demanding one stranded both cases on
    # the environment that matters most (2026-10-01). A zero-match surname was never the actual
    # requirement - it was a convenient way to GET the requirement, which is that the hit after the
    # assignment is ATTRIBUTABLE to the assignment (Rule 110). That holds just as well on a busy
    # estate, provided no work order ALREADY answers this surname on the field we are about to
    # set: then our row coming back on `lead_technician_name` can only be ours. Other rows in other
    # groups are the estate's own data and change nothing about what the case asserts.
    # 🔴 ZERO MATCHES IS A PREFERENCE, NOT A REQUIREMENT - AND INSISTING ON IT PICKED THE WORST
    # CANDIDATE ON PRODUCTION. Nobody there matches nothing, so the strict rule fell through to the
    # first name in the list, 'Muzammil', which 62 work orders already answer. The work_orders
    # group caps at 20 rows, so our record was in the index and simply never shown - "NOT proven"
    # over a correct assignment. Meanwhile the purpose-made 'Technicianov' matched 2 rows and was
    # skipped for not matching zero.
    # So rank by how CROWDED the surname is and take the quietest. Fewest competitors means our row
    # survives the cap, which is the thing that actually has to be true for a tester to see it.
    scored = []
    for pid, (full, sur) in byid.items():
        if len(sur) < 5:
            continue
        rows = [i for g in m_call_search(sur) for i in (g.get('items') or [])]
        if any(i.get('id') == wo_id for i in rows):
            continue                      # already answers for us - proves nothing afterwards
        scored.append((len(rows), pid, full, sur))
    if scored:
        scored.sort()
        n, pid, full, sur = scored[0]
        print(f"     ℹ {sur!r} is the quietest surname on this estate ({n} existing row(s)), so our "
              f"work order will not be hidden behind the 20-row group cap")
        return pid, full, sur, True
    return None, None, None, None


def main():
    prev = json.load(open(STATE)) if os.path.exists(STATE) else {}
    st = json.load(open(SEEDSTATE))
    try:
        wo = next(r['ids'][0] for r in st['records'] if r['key'] == WO_KEY and r.get('ids'))
    except StopIteration:
        sys.exit(f"🔴 {WO_KEY} has no id in {SEEDSTATE} — run the result-integrity seed first.")

    out, changed_any = {}, False
    for role, listing, endpoint, payload_key, field in (
            ('tech', '/api/technicians', '/api/work-orders/change-lead-technician',
             'tech_assigned_id', 'lead_technician_name'),
            ('advisor', '/api/service-advisors', '/api/work-orders/change-service-advisor',
             'service_advisor_id', 'service_advisor_name')):
        pid, full, sur, changed = pick(listing, prev.get(role), wo)
        if not pid:
            sys.exit(f"🔴 no {role} on this environment has a surname that matches nothing — "
                     f"cannot prove attribution, so nothing was assigned (Rule 110).")
        res = m.call(endpoint, 'POST', {'work_order_id': wo, payload_key: pid})
        if res['status'] not in (200, 201):
            sys.exit(f"🔴 {endpoint} -> {res['status']}")
        ok, item, hidden = only_our_row(sur, wo, field)
        if not ok:
            sys.exit(f"🔴 {sur!r} did not come back as exactly our row on {field} — NOT proven.")
        print(f"  ✅ {role:8} {full:28} type {sur!r} -> {item.get('primary')} "
              f"(match {field}, value {'absent from' if hidden else '🔴 PRESENT IN'} the two shown lines)")
        out[role] = [pid, full, sur]
        changed_any = changed_any or changed

    json.dump(out, open(STATE, 'w'), indent=1)
    if changed_any:
        print("\n🔴 THE STAFF CHANGED ON THIS ENVIRONMENT, SO THE TERMS CHANGED (Rule 111).")
        print("   SRI-WO-C2 / C146203 must now be typed as:", out['tech'][2])
        print("   SRI-WO-C3 / C146204 must now be typed as:", out['advisor'][2])
        print("   Re-run build_workbook.py and update_testrail.py, and tell the QA lead to retest both.")
    else:
        print("\n  same two people as last run — the workbook terms are unchanged.")


if __name__ == '__main__':
    main()
