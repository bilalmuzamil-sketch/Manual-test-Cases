#!/usr/bin/env python3
"""File the six Story Defects the QA lead authorised on 2026-09-15.

Two are plain failures (the case, the specification and the build all agree something is broken).
Four come from his answered question sheet, where he ruled YES on every row. Two of those four are
reversals of a written V2 decision -- the specification asks for today's behaviour in so many words --
so those tickets QUOTE it, rather than letting engineering read a bug report against a decision they
implemented correctly.

Shape: the eight headings in the order the QA lead gave on 2026-09-10 --
  1 Environment (full link) | 2 The problem (no assumed impact) | 3 Steps to reproduce
  4 Screenshots inline at width 760 | 5 Current behaviour | 6 Expected behaviour
  7 Sources, quoted verbatim with page id and read date | 8 Test cases with run + links
Wiki markup, written with PUT /rest/api/2/issue/{KEY} -- the only route that embeds images.
Resumable on COMPLETION, never on a bare key.
"""
import json, os, subprocess, sys, time

DIR = os.path.dirname(os.path.abspath(__file__))
EVDIRS = [os.path.join(DIR, d) for d in ('run-evidence2', 'special-evidence', 'evidence', 'run-evidence')]
JIRA = '/home/user/Manual-test-Cases/build/atlassian-login/jira.sh'
STATE = os.path.join(DIR, 'SIX-DEFECTS.json')
RUN = 415
RUNLINK = 'https://shopview.testrail.io/index.php?/runs/view/415'
SPEC = ('Global Search - Product Requirements, Confluence page 576978945, Version 1.5, '
        'read live on 15 September 2026')
SPECLINK = ('https://shopview.atlassian.net/wiki/spaces/shopviewapp/pages/576978945/'
            'Global+Search+-+Product+Requirements')
BRANCH = 'https://sv9160.qa.shopview.com'


def jira(method, path, payload=None):
    args = ['bash', JIRA, method, path]
    if payload is not None:
        p = '/tmp/claude-0/_jira_payload_six.json'
        open(p, 'w').write(json.dumps(payload))
        args.append(p)
    r = subprocess.run(args, capture_output=True, text=True)
    out = r.stdout
    status = None
    for line in out.splitlines():
        if line.startswith('__HTTP:'):
            status = int(line.split(':')[1])
    body_txt = out.split('__HTTP:')[0].strip()
    try:
        j = json.loads(body_txt) if body_txt else None
    except Exception:
        j = None
    return status, j, body_txt[:300]


def find_image(filename):
    for d in EVDIRS:
        p = os.path.join(d, filename)
        if os.path.exists(p):
            return p
    return None


def attach(key, filename):
    path = find_image(filename)
    if not path:
        return False, 'not on disk in any evidence folder: ' + filename
    r = subprocess.run(['curl', '-s', '-w', '\n__HTTP:%{http_code}',
        '-b', os.environ.get('ATL_COOKIES', '/tmp/atlassian/cookies.txt'),
        '--cacert', '/root/.ccr/ca-bundle.crt',
        '-H', 'Accept: application/json',
        '-H', 'X-Atlassian-Token: no-check',
        '-H', 'Origin: https://shopview.atlassian.net',
        '-H', 'Referer: https://shopview.atlassian.net/browse/SV-9160',
        '-H', 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36',
        '-F', 'file=@%s' % path,
        'https://shopview.atlassian.net/rest/api/3/issue/%s/attachments' % key],
        capture_output=True, text=True)
    return ('__HTTP:200' in r.stdout), r.stdout[-80:]


# tag, owner story, summary, problem, steps, images, current, expected, sources, cases, ruling
T = [
 ("year", "SV-9164",
  "Global Search: a vehicle cannot be found by its year together with its make or model",
  "Typing a vehicle's year together with its make or model returns no vehicles at all. Each word on "
  "its own works. It is only the combination that returns nothing.",
  ["Open ShopView on the QA branch: [%s/workorders|%s/workorders]" % (BRANCH, BRANCH),
   "Open the search box (the magnifying glass in the top bar, or Ctrl and K).",
   "Type *2019 Freightliner*",
   "Look at the Assets count along the top of the search box, and at the Assets group below it.",
   "Now clear the box and type *2019* on its own, then *Freightliner* on its own, then "
   "*Freightliner Cascadia*. Each of those returns vehicles."],
  [("Typing the year and the make together. No vehicles are returned.", "C53605-q1-all.png"),
   ("The Assets tab for the same query, confirming the group really is empty.", "C53605-q1-assets.png")],
  ["*2019 Freightliner* returns no vehicles. So do *2019 Cascadia* and *Cascadia 2019*.",
   "*2019* on its own returns twenty vehicles.",
   "*Freightliner* on its own returns twenty vehicles.",
   "*Freightliner Cascadia* returns twenty vehicles, including the one used here "
   "(2019 Freightliner Cascadia, unit ZZT-4471, owned by ZZAUTOTEST Bridgeport Hauling).",
   "The vehicle's record carries the right year, make and model - that was checked on the record first."],
  ["Typing a vehicle's year with its make or model returns that vehicle.",
   "The year is one of the things a vehicle can be found by, alongside make and model."],
  [("Section 4, Scope: Entities & Indexed Fields",
    "Assets (Vehicles). Indexed: year, make, model, VIN/serial #, unit number, owning customer name.")],
  [("C53605", "Finding an asset by its year")],
  None),

 ("newjob", "SV-9163",
  "Global Search: a newly created job is not findable for about 85 seconds, against a 30 second requirement",
  "A job that has just been created cannot be found by its number for roughly 85 seconds. The written "
  "requirement allows 30. Other newly created records appear well inside that window, so this is "
  "specific to jobs.",
  ["Open ShopView on the QA branch: [%s/workorders|%s/workorders]" % (BRANCH, BRANCH),
   "Create a new work order for the customer *ZZAUTOTEST Bridgeport Hauling* and note its number.",
   "Without reloading the page or signing out, open the search box and type that number.",
   "If nothing comes back, clear the box, retype the number, and keep timing.",
   "For comparison, create a new customer and a new part sale and time those the same way."],
  [("A brand new job, searched by its number.", "C53587-new-work-order.png"),
   ("A brand new customer, created and timed the same way in the same sitting, found after 17 seconds.",
    "C53586-new-customer.png")],
  ["A newly created job took about 85 seconds to become findable by its number.",
   "A newly created customer, timed the same way in the same sitting, took 17 seconds.",
   "A newly created part sale, timed the same way, took 9 seconds.",
   "No page refresh or sign-out was used in any of the three."],
  ["A newly created job is findable by its number within 30 seconds.",
   "No page refresh or sign-out should be needed.",
   "Related, and NOT the same thing: SV-3259 (\"Need to refresh page for a new work order to show up "
   "in global search\") is closed and was about needing a refresh at all. Here no refresh is needed - "
   "the job does appear on its own, just far too late."],
  [("Section 9, Non-Functional Requirements",
    "Index refresh latency <= 30s for entity create/update - the data-freshness indicator is "
    "explicitly deferred (section 2)."),
   ("Section 8, Functional Requirements",
    "creating an entity counts as a view, so a record the user just created is immediately recent and "
    "recency-boosted for that user")],
  [("C53587", "A new work order or part sale is findable within 30 seconds")],
  None),

 ("phone", "SV-9163",
  "Global Search: a customer cannot be found by its own telephone number",
  "Typing a customer's own telephone number returns nothing, written out or as plain digits. A "
  "supplier's telephone number does work.",
  ["Open ShopView on the QA branch: [%s/workorders|%s/workorders]" % (BRANCH, BRANCH),
   "Open Customers, open *ZZAUTOTEST Bridgeport Hauling*, and note the telephone number on the record.",
   "Open the search box and type that number exactly as it appears on the record.",
   "Clear the box and type the same number as plain digits, with no brackets, spaces or dashes.",
   "For comparison, do the same with a supplier's telephone number - that one is returned."],
  [("The customer's own telephone number typed into search. Nothing is returned.", "C55662-q1-all.png"),
   ("The same number as plain digits. Still nothing.", "C55662-q2-all.png")],
  ["The customer's own telephone number returns nothing, in either form.",
   "The number is on the customer's record - that was checked on the record itself.",
   "A supplier's telephone number does return the supplier, so telephone search works in general.",
   "Searching the customer by name returns it, so the customer itself is searchable."],
  ["Typing a customer's telephone number returns that customer.",
   "The number should match whether or not it is typed with brackets, spaces or dashes."],
  [("Section 4, Customers",
    "Customers. Indexed: customer name, telephone (digits only, normalized), address 1/2, city, "
    "state/province, plus the names, telephone numbers and email addresses of the customer's contacts."),
   ("Section 7, Fuzzy Matching - Normalization",
    "for identifier fields (WO number, part number, VIN, phone) also strip non-alphanumerics so "
    "S2-15276 and s215276 match, and (264) 328-6723 and 2643286723 match.")],
  [("C55662", "Finding a customer by their telephone number")],
  None),

 ("vinpart", "SV-9164",
  "Global Search: part of a chassis number no longer finds the vehicle",
  "The whole chassis number returns the vehicle. The last six characters of the same number return "
  "nothing.",
  ["Open ShopView on the QA branch: [%s/workorders|%s/workorders]" % (BRANCH, BRANCH),
   "Open Customers, open *ZZAUTOTEST Bridgeport Hauling*, open its vehicle *ZZT-4471*, and note the "
   "full chassis number on the record.",
   "Open the search box and type the whole chassis number. The vehicle is returned.",
   "Clear the box and type only the last six characters of that same number.",
   "Look at the Assets count along the top of the search box."],
  [("The whole chassis number. The vehicle is returned.", "C55669-q1-all.png"),
   ("The last six characters of the same number. Nothing is returned.", "C55669-q2-all.png")],
  ["The whole chassis number returns the vehicle.",
   "The last six characters of it return nothing, of any kind."],
  ["Part of a chassis number finds the vehicle, as it did in the previous version.",
   "This is the QA lead's ruling of 15 September 2026, taken against the previous version's behaviour."],
  [("Section 7, Fuzzy Matching - What is not fuzzy. PLEASE READ THIS FIRST: the written requirement "
    "asks for TODAY'S behaviour, so this ticket is a deliberate reversal of it and not a report that "
    "the requirement was built wrongly",
    "Exact identifier fields - VIN, WO number, P-number, part number, PO number, invoice number - "
    "bypass fuzzy logic and require exact match after normalization. A typo in a VIN is almost always "
    "a wrong VIN, not a typo, and fuzzy matching here would surface confusing results.")],
  [("C55669", "Finding an asset by part of its VIN")],
  "The previous version let a partial chassis number find the vehicle. The QA lead was asked whether "
  "that should still work and answered yes on 15 September 2026, so it is raised as work rather than "
  "closed as a deliberate change."),

 ("recents", "SV-9168",
  "Global Search: the recently viewed list does not come back after a search that finds nothing",
  "After a search that matches nothing, the panel shows a message and nothing else. Clearing the box "
  "does bring the recently viewed list back, so the list itself is working.",
  ["Open ShopView on the QA branch: [%s/workorders|%s/workorders]" % (BRANCH, BRANCH),
   "Open the search box without typing anything. Twenty recently viewed items are listed.",
   "Type something that matches nothing at all, for example *zzzqqqxxx*.",
   "Look at what is shown below the box."],
  [("A search that matches nothing. A message, and nothing to click.", "C55679-q1-all.png")],
  ["A message is shown and nothing is listed.",
   "With the box empty, twenty recently viewed items are listed - so the list is there and working."],
  ["The recently viewed list comes back when a search finds nothing, so there is still something to click.",
   "This is the QA lead's ruling of 15 September 2026, taken against the previous version's behaviour."],
  [("Section 5.2, States - No results. PLEASE READ THIS FIRST: the written requirement asks for "
    "TODAY'S behaviour in so many words, so this ticket is a deliberate reversal of it and not a "
    "report that the requirement was built wrongly",
    "No results. \"No results for '<query>'\" - plus \" in <Tab>\" when a scope tab other than All is "
    "active. Nothing else.")],
  [("C55679", "The no-results state falls back to recently viewed")],
  "The previous version brought the recently viewed list back. The QA lead was asked whether that "
  "should still happen and answered yes on 15 September 2026."),

 ("fragment", "SV-9164",
  "Global Search: a fragment from the middle of a word finds the record in some fields but not others",
  "Typing a fragment from the middle of a company's name finds the company. Typing a fragment from "
  "the middle of its town does not, although both are held on the same record.",
  ["Open ShopView on the QA branch: [%s/workorders|%s/workorders]" % (BRANCH, BRANCH),
   "Open Customers, open *ZZAUTOTEST Bridgeport Hauling*, and note the company name and the town on "
   "its address.",
   "Open the search box and type a few characters from the MIDDLE of the company name. The company "
   "is returned.",
   "Clear the box and type a few characters from the MIDDLE of the town. Nothing is returned."],
  [("A fragment from the middle of the company name. The company is returned.", "C55660-q1-all.png"),
   ("A fragment from the middle of the town on the same record. Nothing is returned.", "C55660-q2-all.png")],
  ["A fragment from the middle of the company name returns the company.",
   "A fragment from the middle of the town on the same record returns nothing.",
   "Both are fields the record carries, and searching either one in full returns the company."],
  ["A fragment from the middle of a word finds the record, whichever of the record's fields it comes from.",
   "Whatever the rule turns out to be, it should behave the same way across the fields of one record, "
   "so that a person can predict it.",
   "PLEASE DECIDE THIS TOGETHER WITH SV-10025. That ticket asks for the typo-tolerance to be "
   "TIGHTENED, because a correctly spelled name is being matched to different words. This one asks "
   "for it to be CONSISTENT across a record's fields. They pull in opposite directions, and fixing "
   "either one without the other is likely to make the other worse."],
  [("Section 7, Fuzzy Matching - Token n-gram matching. The requirement sets a similarity threshold "
    "rather than promising that fragments match, and says nothing about behaving differently from one "
    "field to another, which is what was actually seen",
    "Build trigram indexes on names (customer, contact, vendor, asset make/model), part descriptions, "
    "and tags. The query is also trigrammed; candidates with Jaccard similarity >= 0.35 against the "
    "query trigrams are eligible for fuzzy match.")],
  [("C55660", "Finding a customer by a fragment from the middle of a word")],
  "The previous version matched mid-word fragments. The QA lead was asked whether that should still "
  "work and answered yes on 15 September 2026."),
]


def body(tag, owner, summary, problem, steps, images, current, expected, sources, cases, ruling):
    s = "h2. 1. Environment\n\n"
    s += ("* Site: [%s|%s] - QA branch sv9160, Global Search V2\n"
          "* Signed in as: an administrator\n"
          "* Observed: 15 September 2026\n"
          "* Records used: the customer ZZAUTOTEST Bridgeport Hauling and its vehicle ZZT-4471, "
          "reachable from [%s/customers|%s/customers]\n\n" % (BRANCH, BRANCH, BRANCH, BRANCH))
    s += "h2. 2. The problem\n\n" + problem + "\n\n"
    s += "h2. 3. Steps to reproduce\n\n"
    for st in steps:
        s += "# %s\n" % st
    s += "\nh2. 4. Screenshots\n\n"
    for cap, fn in images:
        s += "*%s*\n\n!%s|width=760!\n\n" % (cap, fn)
    s += "h2. 5. Current behaviour\n\n"
    for c in current:
        s += "* %s\n" % c
    s += "\nh2. 6. Expected behaviour\n\n"
    for e in expected:
        s += "* %s\n" % e
    if ruling:
        s += "\n%s\n" % ruling
    s += "\nh2. 7. Sources\n\n"
    s += "%s.\n[%s|%s]\n\n" % (SPEC, SPECLINK, SPECLINK)
    for label, quote in sources:
        s += "*%s*\n{quote}%s{quote}\n\n" % (label, quote)
    s += "h2. 8. Test cases\n\n"
    s += "Run %d: [%s|%s]\n\n" % (RUN, RUNLINK, RUNLINK)
    for cid, note in cases:
        n = cid[1:]
        s += ("* %s - %s: [https://shopview.testrail.io/index.php?/cases/view/%s"
              "|https://shopview.testrail.io/index.php?/cases/view/%s]\n" % (cid, note, n, n))
    return s


def main():
    only = sys.argv[1] if len(sys.argv) > 1 else None
    dry = '--dry-run' in sys.argv
    state = json.load(open(STATE)) if os.path.exists(STATE) else {}
    for row in T:
        tag, owner, summary = row[0], row[1], row[2]
        if only and only != '--dry-run' and tag != only:
            continue
        if dry:
            missing = [fn for _, fn in row[5] if not find_image(fn)]
            print('%-9s -> %-8s %s' % (tag, owner, summary))
            print('   images: %s' % ('ALL PRESENT' if not missing else 'MISSING ' + ', '.join(missing)))
            continue
        done = state.get(tag, {})
        if done.get('key') and done.get('description_http') in (200, 204):
            print('%s: already complete as %s -- skipping' % (tag, done['key']))
            continue
        key = done.get('key')
        if not key:
            st, j, raw = jira('POST', '/rest/api/3/issue', {"fields": {
                "project": {"key": "SV"}, "issuetype": {"id": "10007"},
                "parent": {"key": owner}, "summary": summary, "priority": {"name": "Medium"}}})
            if st not in (200, 201):
                print('%s: CREATE FAILED %s %s' % (tag, st, raw))
                break
            key = j['key']
            state[tag] = {'key': key, 'summary': summary, 'parent': owner,
                          'created': time.strftime('%Y-%m-%dT%H:%M:%SZ')}
            json.dump(state, open(STATE, 'w'), indent=1)
            print('%s: created %s under %s' % (tag, key, owner))
        for _, fn in row[5]:
            ok, info = attach(key, fn)
            print('   attach %s: %s' % (fn, 'ok' if ok else 'FAILED ' + info))
        st2, _, _ = jira('PUT', '/rest/api/2/issue/%s' % key, {"fields": {"description": body(*row)}})
        print('   description: HTTP %s' % st2)
        state[tag]['description_http'] = st2
        json.dump(state, open(STATE, 'w'), indent=1)
    if not dry:
        print('\nFILED: %s' % json.dumps({k: v['key'] for k, v in state.items()}, indent=1))


if __name__ == '__main__':
    main()
