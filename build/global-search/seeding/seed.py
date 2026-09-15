#!/usr/bin/env python3
"""IDEMPOTENT SEEDER — restores the suite's test data after any redeploy, AND proves it carries
the values the cases actually search for.

WHY: the QA branch is redeployed regularly and OUR DATA IS WIPED EVERY TIME. Re-seeding by hand
costs hours and produces different ids each run, which then rot in a committed state file.

🔴 THE LESSON THAT REWROTE THIS FILE (execution session, 2026-09-14).
The old version reported "6 of 7 records present" and was telling the truth — and the run still
lost hours, because **"the record exists" is not "the record carries the values the cases search
for."** Six declared field values were absent or different, one whole record type (a CONTACT) was
never declared at all, and FOUR of those looked exactly like product defects: you search a value,
nothing comes back. Three tickets were one step from being raised against fields the record simply
did not hold.

Three causes, all now handled here:
  1. THE PATCH BLOCK WAS NEVER EXECUTED. The manifest declared website / address_2 / telephone and
     this script only ever read `create`. Declared and never written.
  2. A 2xx IS NOT EVIDENCE A WRITE LANDED. /api/vehicles/change answers 201 to `model_name` and
     silently changes nothing — it works in IDs. Every write is now read back.
  3. A FIELD RENAMED BETWEEN WRITE AND READ WAS SKIPPED SILENTLY. The asset writes `model_name`
     and reads back `vehicle_model`; a key-by-key comparison finds no such key and moves on. That
     silent skip is where the whole problem lived.

SO THE REPORT NOW HAS THREE OUTCOMES, NEVER TWO:
     MATCH      — the record holds the declared value
     GAP        — the record holds something else (repairable with --confirm)
     NOT COMPARED — could not be checked at all
"no gaps found" and "no gaps I was able to look for" must never look the same on screen.

WHAT IT DOES: reads seed-manifest.json, and for every record FIND-OR-CREATE, then FIELD-VERIFY:
    found      -> records the LIVE id, verifies every declared field, repairs gaps on --confirm
    not found  -> creates it, then verifies
    blocked    -> reports why, and does not pretend

SAFE TO RUN ANY NUMBER OF TIMES. It never creates a duplicate of a record marked "unique".

USAGE
    python3 seed.py --check      # report only, writes nothing to the environment
    python3 seed.py --confirm    # find-or-create, and repair any declared field that is missing
TO ADD DATA FOR A NEW TEST CASE: add an entry to seed-manifest.json. Never edit this file.

AUTH is self-service (Rule 107): quick-login mints a session, and the rotated PHPSESSID is
captured from Set-Cookie (playbook §Q1 - not doing so makes every later call answer 409).
"""
import json, sys, os, re, ssl, urllib.parse, urllib.request, urllib.error, argparse, datetime

HERE = os.path.dirname(os.path.abspath(__file__))
# Which environment to seed. Defaults to the QA branch profile; set SEED_PROFILE to point at
# another one (production is PHPSESSID-only and has no SSO cookie - see playbook section K).
#     SEED_PROFILE=/tmp/prod/cookies.json python3 seed.py --check
COOKIES = os.environ.get('SEED_PROFILE', '/tmp/qa/cookies.json')
# One state file per environment, or a production run silently overwrites the QA branch's state
# and the next reader believes the wrong thing about the wrong estate.
ENV_LABEL = 'qa' if COOKIES == '/tmp/qa/cookies.json' else os.path.basename(os.path.dirname(COOKIES))
STATE_FILE = 'seed-state-live.json' if ENV_LABEL == 'qa' else f'seed-state-live-{ENV_LABEL}.json'
# 🔴 IDS ARE PER ENVIRONMENT AND MUST NEVER GO BACK INTO THE SHARED MANIFEST. They used to, and the
# first production run overwrote the QA branch's work-order ids with production's - after which the
# QA check reported those four work orders MISSING when they were sitting right there. The manifest
# is the shared plan; the ids of one estate's records are not part of it.
IDS_FILE = f'seed-ids-{ENV_LABEL}.json'

def _ids_load():
    try: return json.load(open(f'{HERE}/{IDS_FILE}'))
    except Exception: return {}

def _ids_save(key, ids):
    d = _ids_load(); d[key] = ids
    json.dump(d, open(f'{HERE}/{IDS_FILE}', 'w'), indent=1)
CTX = ssl.create_default_context(cafile='/root/.ccr/ca-bundle.crt')

def _c(): return json.load(open(COOKIES))
def _save(c):
    open(COOKIES, 'w').write(json.dumps(c)); os.chmod(COOKIES, 0o600)

def call(path, method='GET', body=None):
    c = _c()
    # Send only the cookies this environment actually has. Production carries PHPSESSID alone;
    # sending empty sv_sso_session / cf_clearance values there is not the same as omitting them.
    ck = '; '.join(f"{k}={c[k]}" for k in ('sv_sso_session', 'PHPSESSID', 'cf_clearance')
                   if c.get(k))
    req = urllib.request.Request(f"https://{c['api']}{path}", method=method,
        data=json.dumps(body).encode() if body is not None else None,
        headers={'Cookie': ck, 'Accept': 'application/json', 'Content-Type': 'application/json',
                 'User-Agent': 'Mozilla/5.0', 'Referer': f"https://{c['host']}/"})
    try:
        r = urllib.request.urlopen(req, context=CTX, timeout=60); status, raw, hdrs = r.status, r.read(), r.headers
    except urllib.error.HTTPError as e:
        status, raw, hdrs = e.code, e.read(), e.headers
    except Exception as e:
        return {'status': 'ERR', 'error': str(e), 'json': None}
    for sc in hdrs.get_all('Set-Cookie') or []:          # playbook §Q1
        m = re.search(r'PHPSESSID=([^;]+)', sc)
        if m and m.group(1) not in ('deleted', '') and m.group(1) != c['PHPSESSID']:
            c['PHPSESSID'] = m.group(1); _save(c)
    try: j = json.loads(raw or b'{}')
    except Exception: j = None
    return {'status': status, 'json': j, 'raw': (raw or b'')[:250]}

def ensure_session():
    """Self-unblock: mint a session and set the location (playbook §Q2, §Q3)."""
    # Liveness probe must be valid in EVERY environment. '/api/search' is the V2 endpoint and
    # 404s on production, which runs V1 (its search is '/api/global-search/fetch') - probing it
    # there reports a dead session that is perfectly alive.
    if call('/api/staff/my-workplaces')['status'] != 200:
        # quick-login 500s on production (playbook section K) and it evicts other workers on a QA
        # branch (Rule 83). Only reach for it on the default QA profile, and never invent a session
        # on an environment where it cannot work.
        if COOKIES != '/tmp/qa/cookies.json':
            sys.exit("session is not live on this profile, and quick-login is a QA-branch-only "
                     "recovery - log in again and rewrite the profile")
        r = call('/api/quick-login', 'POST', {'key': 'admin'})
        print(f"  quick-login -> {r['status']}  (evicts other workers on this branch - Rule 83)")
        if r['status'] != 200: sys.exit("cannot authenticate")
    w = call('/api/staff/my-workplaces')
    if w['status'] == 200:
        d = (w['json'] or {}).get('data', w['json'])
        wps = d if isinstance(d, list) else (d.get('workplaces') or d.get('collection') or [])
        # SEED_WORKPLACE overrides the manifest hint, so another environment does not need the
        # manifest edited. Production is 'Trucks Hill 2' - it HAS canned lines (playbook section K).
        hint = os.environ.get('SEED_WORKPLACE') or \
            json.load(open(f'{HERE}/seed-manifest.json'))['environment']['workplace_name_hint']
        # 🔴 NEVER fall back to "the first workplace". Seeding the wrong shop is silent and wrong -
        # on production the first one is a DIFFERENT shop from the one we want.
        pick = next((x for x in wps if hint.lower() in (x.get('name') or '').lower()), None)
        if pick is None:
            sys.exit(f"no workplace matches {hint!r} - found: "
                     f"{[x.get('name') for x in wps]}. Set SEED_WORKPLACE to one of these.")
        if pick:
            r = call('/api/iam/change-location', 'POST',
                     {'workplace_id': pick['id'], 'workplace_timezone': pick.get('timezone', 'America/Edmonton')})
            print(f"  location -> {pick['name']}  ({r['status']})")
            return wps
    return []

STATE = {}

def find(spec, _key=None):
    """FIND a record. Two modes, because ?search= works on some list endpoints and silently
    matches NOTHING on others (measured: broken on /api/work-orders). Where the spec gives a
    'control', search for it FIRST - if a record known to exist comes back empty the probe is
    broken and any 'missing' verdict is thrown away (Rule 104)."""
    coll = spec.get('coll', 'collection')   # 'child' mode reads a nested list, not a collection key
    def rows(r):
        d = (r['json'] or {}).get('data', {}) or {}
        if isinstance(d, dict): return d.get(coll) or []
        return d if isinstance(d, list) else []
    if spec.get('control'):
        c = call(f"{spec['list']}?search={urllib.parse.quote(spec['control'])}&limit=100")
        if c['status'] != 200 or len(rows(c)) == 0:
            # The declared control is a record that exists in ONE environment. Point the seeder at
            # another one and it vanishes - which looks exactly like a broken probe. So calibrate
            # against the environment actually in front of us: read a record off an unfiltered
            # page and search for a word out of it. That separates the three cases honestly -
            # search is broken / the endpoint is simply empty / search works and ours is missing.
            base = call(f"{spec['list']}?limit=5")
            brows = rows(base)
            if base['status'] != 200:
                return [], f"PROBE BROKEN - {spec['list']} answered {base['status']}"
            if brows:
                probe_val = str(brows[0].get(spec['field']) or '').strip()
                token = probe_val.split()[0] if probe_val else ''
                d = call(f"{spec['list']}?search={urllib.parse.quote(token)}&limit=100") if token else None
                if not token or d['status'] != 200 or len(rows(d)) == 0:
                    if spec['mode'] == 'search':
                        return [], ('PROBE BROKEN - ?search= returned nothing even for a value read '
                                    'from this same endpoint a moment ago')
            # brows empty = the endpoint genuinely holds no records here, so "missing" is the truth.
    if spec['mode'] == 'ids':
        # ?search= is broken and ?page= is ignored on some endpoints, so the only reliable
        # route is to verify by the ids the seeder recorded when it created them.
        out = []
        # Ids captured for THIS environment win; the manifest's are the starting default.
        # Ids captured for THIS environment win; the manifest's are the starting default.
        for i in (_ids_load().get(_key) or spec.get('ids', [])):
            r = call(spec['view'].replace('{id}', i))
            if r['status'] == 200:
                d = (r['json'] or {}).get('data', {}) or {}
                rec = d.get(spec['coll']) if isinstance(d, dict) else None
                if rec: out.append(rec)
        return out, 'ok'
    if spec['mode'] == 'child':
        # A record that lives INSIDE its parent and has no list endpoint of its own. A contact is
        # the case that forced this: there is no GET /api/contacts (404 in every shape), but
        # /api/customers/view/<company id> returns data.company.contacts[] with the id, the names
        # AND the job title. Looking for the parent and calling that "present" is the trap - the
        # company exists whether or not anyone works there.
        pid = STATE.get(spec['parent'])
        if not pid: return [], f"parent '{spec['parent']}' not available yet - check the record order"
        r = call(spec['view'].replace('{id}', str(pid)))
        if r['status'] != 200: return [], f"parent view {r['status']}"
        node = (r['json'] or {}).get('data', {}) or {}
        for step in spec['path'].split('.'):
            node = (node or {}).get(step) or ([] if step == spec['path'].split('.')[-1] else {})
        rows = node if isinstance(node, list) else []
        return [x for x in rows
                if str(x.get(spec['field']) or '').strip().lower() == str(spec['value']).strip().lower()], 'ok'
    if spec['mode'] == 'search':
        r = call(f"{spec['list']}?search={urllib.parse.quote(spec['value'])}&limit=100")
        if r['status'] != 200: return [], f"probe {r['status']}"
        return [x for x in rows(r) if str(x.get(spec['field']) or '') == spec['value']], 'ok'
    # page mode - and page params can be IGNORED, so stop as soon as a page repeats
    hits, page, seen_ids = [], 1, set()
    while page <= 60:
        r = call(f"{spec['list']}?page={page}&rowsPerPage=100")
        if r['status'] != 200: return hits, f"probe {r['status']}"
        items = rows(r)
        ids = {x.get('id') for x in items if isinstance(x, dict)}
        if ids and ids <= seen_ids:
            break                       # the endpoint ignored ?page= - stop rescanning
        seen_ids |= ids
        for x in items:
            if not isinstance(x, dict): continue
            v = str(x.get(spec['field']) or '')
            if 'prefix' in spec and v.startswith(spec['prefix']): hits.append(x)
            elif spec.get('value') and v == spec['value']: hits.append(x)
        if len(items) < 100: break
        page += 1
    return hits, 'ok'


# ─────────────────────────────────────────────────────────────────────────────────────────────
# FIELD VERIFICATION — the half that was missing, and that cost the execution session hours.
# ─────────────────────────────────────────────────────────────────────────────────────────────
def declared_fields(rec):
    """Every value the manifest says this record must CARRY — the create payload, the patch block
    and any `extra_fields`. Structural values (tags, foreign ids, credit terms) are excluded by
    naming them in `skip_verify`, so exclusion is a decision on the record, never an accident."""
    d = {}
    d.update((rec.get('create') or {}).get('payload') or {})
    d.update((rec.get('patch') or {}).get('fields') or {})
    d.update(rec.get('extra_fields') or {})
    for k in (rec.get('skip_verify') or []):
        d.pop(k, None)
    return {k: v for k, v in d.items()
            if isinstance(v, (str, int, float)) and not isinstance(v, bool) and str(v).strip() != ''}

def verify_fields(rec, record):
    """THREE outcomes, never two. A field the record does not expose under the name the payload
    WRITES is NOT a pass — it is the silent branch, and it is where the asset's model hid
    ('model_name' written, 'vehicle_model' read back) while three cases sat unrunnable."""
    read_as = rec.get('read_as') or {}
    match, gap, not_compared = [], [], []
    for field, want in declared_fields(rec).items():
        key = read_as.get(field, field)
        if key is None:
            not_compared.append((field, "declared unreadable here — the list row does not expose it"))
            continue
        if key not in record:
            how = f"written as '{field}'" + (f", mapped to '{key}'" if key != field else "")
            not_compared.append((field, f"{how}, but the record exposes no such key"))
            continue
        got = record.get(key)
        if str(got if got is not None else '').strip().lower() == str(want).strip().lower():
            match.append(field)
        else:
            gap.append((field, want, got))
    return match, gap, not_compared

def resolve_by_example(spec, want):
    """WHEN THE LOOKUP TABLE IS NOT EXPOSED, THE EXISTING DATA IS THE LOOKUP TABLE.
    No vehicle-models endpoint answers on this branch — every shape of /api/vehicles/models,
    /api/vehicle-models and /api/vehicles/makers/{id}/models returns 404. But the branch already
    holds dozens of Cascadia vehicles, so the id can be taken off one of them."""
    r = call(f"{spec['list']}?search={urllib.parse.quote(str(want))}&limit=50")
    if r['status'] != 200: return None, f"lookup probe {r['status']}"
    d = (r['json'] or {}).get('data', {}) or {}
    rows = d.get(spec.get('coll', 'collection')) if isinstance(d, dict) else (d if isinstance(d, list) else [])
    hit = next((x for x in (rows or [])
                if str(x.get(spec['match_field']) or '').strip().lower() == str(want).strip().lower()), None)
    if not hit: return None, f"no existing record carries {spec['match_field']}={want!r}"
    out = {spec['take_as']: hit.get(spec['take'])}
    for dest, src in (spec.get('also_take') or {}).items():
        if hit.get(src) is not None: out[dest] = hit.get(src)
    return out, 'ok'

def resolve_nested(spec):
    """Build a nested payload (an array of objects) out of ids that already exist on the branch.

    The inventory create needs `bins: [{id, isDefault, quantity}]` where `id` is an EXISTING bin
    location - a bin cannot be conjured by name, and the refusal says so precisely:
    "[0][id] This field is missing / [0][name] This field was not expected". Hardcoding a bin id
    would rot on the next redeploy, so take one off a part that already sits in a bin. Same
    principle as resolve_by_example, one level deeper: when the lookup table is not exposed, the
    existing data is the lookup table."""
    def fetch(q):
        r = call(f"{spec['list']}?{q}")
        if r['status'] != 200: return None
        d = (r['json'] or {}).get('data', {}) or {}
        return d.get(spec.get('coll', 'collection')) if isinstance(d, dict) else []

    def dig(rows):
        for row in (rows or []):
            node = row
            for step in spec['take_path'].split('.'):
                node = node[int(step)] if (isinstance(node, list) and step.isdigit()) else (node or {}).get(step)
                if node is None: break
            if node: return node
        return None

    rows = fetch(f"search={urllib.parse.quote(str(spec['search']))}&limit=25")
    if rows is None: return None, 'probe did not answer 200'
    node = dig(rows)
    if not node:
        # The named example is a record of ONE environment. Somewhere else it does not exist, and
        # the example was never the point - any row carrying the path will do. So sweep an
        # unfiltered page and take the first that has one.
        node = dig(fetch('limit=100'))
    if not node:
        return None, (f"no row carried {spec['take_path']} - not under search={spec['search']!r} "
                      f"and not in the first 100 rows of {spec['list']}")
    def sub(x):
        if x == '@': return node
        if isinstance(x, list): return [sub(i) for i in x]
        if isinstance(x, dict): return {k: sub(v) for k, v in x.items()}
        return x
    return sub(spec['template']), 'ok'


def repair(rec, record, gaps):
    """Write the missing values, then READ THE RECORD BACK — a 2xx is not evidence a write landed.
    /api/vehicles/change answers 201 to a model NAME and changes nothing; /api/customers/change
    ignores a sparse patch and wants the WHOLE record with the fields replaced. Both were found the
    expensive way, so both are handled here rather than rediscovered."""
    w = rec.get('write') or rec.get('patch') or {}
    ep = w.get('endpoint')
    if not ep:
        return {'ok': False, 'why': 'no write endpoint declared for this record — add a "write" block'}
    body = dict(record) if w.get('whole_record', True) else {}
    read_as = rec.get('read_as') or {}
    notes = []
    for field, want, _got in gaps:
        key = read_as.get(field, field)
        res = (w.get('resolve_ids') or {}).get(field)
        if res:                                   # the endpoint only accepts this as an ID
            got, how = resolve_by_example(res, want)
            if not got:
                notes.append(f"{field}: could not resolve to an id — {how}"); continue
            body.update(got); notes.append(f"{field}: resolved to {got} via existing data")
            continue
        if key is not None: body[key] = want
        body[field] = want                        # send BOTH names; the API may accept either
    for dest, src in (w.get('id_as') or {}).items():
        body[dest] = record.get(src)
    for dest, src in (w.get('also') or {}).items():
        body[dest] = STATE.get(src[1:]) if isinstance(src, str) and src.startswith('@') else src
    r = call(ep, 'POST', body)
    return {'ok': r['status'] in (200, 201), 'http': r['status'],
            'body': str(r['raw'][:160]), 'notes': notes}

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--confirm', action='store_true'); ap.add_argument('--check', action='store_true')
    a = ap.parse_args()
    if not (a.confirm or a.check): sys.exit("pass --check or --confirm")
    man = json.load(open(f'{HERE}/seed-manifest.json'))
    print("=== session ==="); ensure_session()
    report = []
    print("\n=== records ===")
    for rec in man['records']:
        k = rec['key']
        if '🔴 BLOCKED_BY' in rec:
            print(f"  {k:24s} 🔴 BLOCKED — {rec['🔴 BLOCKED_BY'][:80]}")
            report.append({'key': k, 'state': 'BLOCKED', 'reason': rec['🔴 BLOCKED_BY'], 'serves': rec['serves']})
            continue
        hits, how = find(rec['find'], k)
        if how != 'ok':
            print(f"  {k:24s} ⚠️  probe failed ({how}) — NOT reporting as missing (Rule 104)")
            report.append({'key': k, 'state': 'UNVERIFIED', 'reason': how, 'serves': rec['serves']}); continue

        if not hits:
            if a.check:
                print(f"  {k:24s} ❌ MISSING — would create")
                report.append({'key': k, 'state': 'MISSING', 'serves': rec['serves']}); continue
            print(f"  {k:24s} ❌ missing — creating…")
            payload = dict(rec['create']['payload'])
            for field, dep in (rec['create'].get('inject') or {}).items():
                if dep not in STATE: print(f"       cannot inject {field}: {dep} not available"); break
                payload[field] = STATE[dep]
            for field, ep in (rec['create'].get('resolve') or {}).items():
                rr = call(ep)
                if rr['status'] == 200:
                    d = (rr['json'] or {}).get('data', rr['json'])
                    lst = d if isinstance(d, list) else (d.get('collection') or [])
                    if lst: payload[field] = lst[0].get('id')
            for field, nspec in (rec['create'].get('resolve_nested') or {}).items():
                got, how = resolve_nested(nspec)
                if got is not None: payload[field] = got; print(f"       {field}: built from existing data -> {json.dumps(got)[:90]}")
                else: print(f"       🔴 cannot build {field}: {how}")
            for field, rspec in (rec['create'].get('resolve_by_example') or {}).items():
                got, how = resolve_by_example(rspec, rspec['value'])
                if got: payload.update(got); print(f"       {field}: resolved to {got} from existing data")
                else:   print(f"       🔴 cannot resolve {field}: {how}")
            reps = int(rec['create'].get('repeat', 1))
            made = []
            for _n in range(reps):
                r = call(rec['create']['endpoint'], 'POST', payload)
                ok = r['status'] in (200, 201)
                print(f"       create -> {r['status']}"
                      + ('' if ok else f"  {str(r.get('raw') or r.get('error') or '')[:120]}"))
                if not ok: break
                # 🔴 CAPTURE THE ID THE CREATE RETURNS. The work orders were found by a hardcoded id
                # list that a redeploy invalidates, so after every wipe they read as "created but not
                # findable" and four cases died quietly. An id the server just told us is the only one
                # that is never stale.
                newid = None
                if rec['create'].get('id_from'):
                    node = (r['json'] or {})
                    for step in rec['create']['id_from'].split('.'):
                        node = (node or {}).get(step) if isinstance(node, dict) else None
                    newid = node
                if newid: made.append(newid)
            if made:
                STATE[k] = made[0] if len(made) == 1 else made
                if rec['find'].get('mode') == 'ids':
                    rec['find']['ids'] = made          # for the verify pass in THIS run
                    _ids_save(k, made)
                    print(f"       recorded {len(made)} live id(s) in {IDS_FILE}")
            ok = bool(made) or (reps == 1 and ok)
            if not ok:
                report.append({'key': k, 'state': 'CREATE_FAILED', 'http': r['status'],
                               'body': str(r['raw'][:200]), 'serves': rec['serves']}); continue
            hits, _ = find(rec['find'], k)
            if not hits:
                print(f"       created but NOT FINDABLE — indexing lag, or the create dropped the finder field")
                report.append({'key': k, 'state': 'CREATED_NOT_FOUND', 'serves': rec['serves']}); continue

        record = hits[0]
        STATE[k] = record.get('id') if len(hits) == 1 else [h.get('id') for h in hits]
        dup = rec.get('unique') and len(hits) > 1
        match, gap, nc = verify_fields(rec, record)
        total = len(match) + len(gap) + len(nc)

        if gap and a.confirm:
            res = repair(rec, record, gap)
            for n in res.get('notes', []): print(f"       {n}")
            print(f"       repair -> {res.get('http')}" + ('' if res['ok'] else f"  {res.get('why') or res.get('body','')[:110]}"))
            if res['ok']:
                hits2, _ = find(rec['find'], k)          # READ BACK - a 2xx is not evidence
                if hits2:
                    record = hits2[0]
                    match, gap, nc = verify_fields(rec, record)
                    if gap: print(f"       🔴 the write reported success and did NOT land: "
                                  f"{', '.join(f for f,_,_ in gap)}")

        line = f"  {k:24s} {'✅' if not gap else '🔶'} present ({len(hits)})"
        line += f"   fields {len(match)}/{total} ✓"
        if gap: line += f"  · GAP: {', '.join(f for f,_,_ in gap)}"
        if nc:  line += f"  · NOT COMPARED: {', '.join(f for f,_ in nc)}"
        if dup: line += "   🔴 DUPLICATE — delete the extras"
        print(line)
        report.append({'key': k, 'state': 'DUPLICATE' if dup else 'PRESENT',
                       'ids': [h.get('id') for h in hits],
                       'fields_ok': match,
                       'gaps': [{'field': f, 'wanted': w, 'holds': g} for f, w, g in gap],
                       'not_compared': [{'field': f, 'why': w} for f, w in nc],
                       'serves': rec['serves']})

    # ── the two blocks that must never look the same ────────────────────────────────────────
    gaps = [(r['key'], g) for r in report for g in r.get('gaps', [])]
    ncs  = [(r['key'], n) for r in report for n in r.get('not_compared', [])]
    if gaps:
        print("\n=== DATA GAPS — a case searching these finds nothing, and it is NOT a product fault ===")
        for k, g in gaps:
            print(f"  {k}.{g['field']}: wanted {g['wanted']!r} but the record holds {g['holds']!r}")
    if ncs:
        print("\n=== NOT COMPARED — do NOT read these as clean ===")
        for k, n in ncs:
            print(f"  {k}.{n['field']}: {n['why']}")

    ts = datetime.datetime.utcnow().strftime('%Y-%m-%dT%H%M%SZ')
    json.dump({'when_utc': ts, 'environment': man['environment'], 'live_ids': STATE, 'records': report,
               '_note': 'Live ids re-derived this run. Never trust an older copy - a redeploy changes them.'},
              open(f'{HERE}/{STATE_FILE}', 'w'), indent=1)

    blocked = [r for r in report if r['state'] in ('BLOCKED', 'MISSING', 'CREATE_FAILED', 'DUPLICATE',
                                                   'CREATED_NOT_FOUND', 'UNVERIFIED')]
    at_risk = sorted({c for r in blocked for c in r.get('serves', [])}
                     | {c for r in report if r.get('gaps') for c in r.get('serves', [])})
    print(f"\n=== summary ===")
    print(f"  records present : {sum(1 for r in report if r['state'] == 'PRESENT')}/{len(report)}")
    print(f"  needing action  : {len(blocked)}  -> {', '.join(r['key'] for r in blocked) or 'none'}")
    print(f"  field gaps      : {len(gaps)}")
    print(f"  NOT COMPARED    : {len(ncs)}" + ("   🔴 this is not a clean bill of health" if ncs else ""))
    print(f"  cases at risk   : {len(at_risk)}  {at_risk}")
    print(f"  state written   : {STATE_FILE}")
    verified = [r for r in report if r['state'] == 'PRESENT']
    if not gaps and not ncs and verified and not blocked:
        print("\n  Every declared field on every record was checked, and every one matched.")
    elif not gaps and not ncs:
        # 🔴 THE VERY TRAP THIS FILE EXISTS TO CLOSE. Zero gaps across zero records is not a clean
        # bill of health - it is nothing having been looked at. Caught on 2026-09-15 when a redeploy
        # wiped every record and the old wording still read "every one matched".
        print(f"\n  🔴 NOT A CLEAN BILL OF HEALTH: {len(verified)} of {len(report)} records were actually")
        print(f"     present to be checked. Zero gaps across zero records means nothing was looked at.")

if __name__ == '__main__':
    main()
