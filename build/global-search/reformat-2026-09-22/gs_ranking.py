import json, urllib.request, base64, re
c=json.load(open("/tmp/testrail/creds.json"))
AUTH=base64.b64encode(f"{c['user']}:{c['password']}".encode()).decode()
def api(path,payload=None):
    data=json.dumps(payload).encode() if payload is not None else None
    req=urllib.request.Request(f"https://shopview.testrail.io/index.php?/api/v2/{path}",data=data,
        headers={'Authorization':f'Basic {AUTH}','Content-Type':'application/json'},method='POST' if payload else 'GET')
    return json.load(urllib.request.urlopen(req,timeout=60))
snap=json.load(open("build/global-search/reformat-2026-09-22/SNAPSHOT-gs-bodies-2026-09-22.json"))
def esc(s): return s.replace('&','&amp;').replace('<','&lt;').replace('>','&gt;')
def marker_of(cid):
    e=snap[str(cid)].get('custom_expected') or ""
    m=re.search(r'AUTOMATION:[^<]*', e)
    return m.group(0).strip() if m else "AUTOMATION: READY"
def lastcheck_of(cid):
    e=snap[str(cid)].get('custom_expected') or ""
    m=re.search(r'Last checked against build [^<]*', e)
    return m.group(0).strip() if m else None

def ef_block(cid):
    e=snap[str(cid)].get('custom_expected') or ""
    ps=re.findall(r'<p>(.*?)</p>', e, re.S)
    keep=[p for p in ps if ('EXPECT FAIL' in p and 'AUTOMATION' not in p) or p.strip().startswith('(1)')]
    return "".join(f"<p>{p}</p>" for p in keep)

PRD='Global Search — Product Requirements, Confluence page 576978945, version 1.5 (read 22 September 2026)'
# PRD §6/§5 verbatim quote bank (exact sentences)
Q={
'id100':('§6.1','Exact match on identifier (WO number, P-number, VIN, part number, PO number, invoice number, telephone digits) → +1.00 (and effectively always wins).'),
'prefix':('§6.1','Prefix match on primary name field → +0.70.'),
'wholeword':('§6.1','Whole-word match anywhere in indexed fields → +0.50.'),
'fuzzy':('§6.1','Fuzzy match (see §7) → score scaled by similarity, max +0.40.'),
'primarybonus':('§6.1','Bonus for match on the primary display name vs. a secondary indexed field → +0.10. A match on a contact field of a customer or vendor is a secondary-field match and does not receive this bonus (§4).'),
'wo':('§6.1','Open/active status (Approved, In Progress, Review) → +0.30; recency of last update — exponential decay with 14-day half-life — up to +0.25; assigned to the current user (lead tech or service advisor matches signed-in user) → +0.15; was viewed by current user in last 7 days → +0.10. Closed/Invoiced WOs older than 90 days are demoted by −0.20.'),
'cust':('§6.1','Has ≥1 open WO → +0.20; total open WO count, log-scaled, up to +0.15; viewed by user in last 7 days → +0.10.'),
'asset':('§6.1','Has open WO → +0.20; viewed recently → +0.10; year newer than 2015 → +0.05 (tie-breaker only).'),
'parts':('§6.1','In stock (>0) → +0.20; bin location present → +0.05; sold/used in last 30 days (frequency, log-scaled) → up to +0.15; viewed recently → +0.10. Out-of-stock parts are not demoted (you often search to confirm OOS).'),
'vendor':('§6.1','Has open POs → +0.20; used in last 30 days → +0.10.'),
'psale':('§6.1','Recency dominates — exponential decay, 7-day half-life — up to +0.30; status = Paid → +0.05; created-by = current user → +0.10.'),
'po':('§6.1','Status = Ordered (not yet received) → +0.30; recency of creation, exponential decay with 14-day half-life, up to +0.25; created-by = current user → +0.10.'),
'vi':('§6.1','Status = Unpaid → +0.25; recency of invoice date, exponential decay with 30-day half-life, up to +0.20.'),
'ties':('§6.1','The score is clamped to a sane range; ties are broken by recency (most recently updated wins). Because search returns at most 20 records per entity type (§5.2), ranking quality is what decides whether the record the user wanted is reachable at all.'),
'grouporder':('§6.2','Group display order in "All" is: Work Orders → Customers → Assets → Parts → Vendors → Part Sales → Purchase Orders → Vendor Invoices. Within each group, rows are sorted by score descending.'),
'pin':('§6.2','When the top result across all groups has a score > 0.95 (effectively an ID match), it is pinned as a separate single row at the very top, above the groups, labeled by its entity icon — the "if you typed S2-15276, jump straight to that WO" experience.'),
'ctxcust':('§6.3','If the user is currently on a Customer page, all candidate Assets and Work Orders owned by that customer get a +0.20 boost;'),
'ctxwo':('§6.3','if on a Work Order, parts already on that WO are demoted by −0.10 (the user is usually looking for something they don’t have yet) while other parts in the same category as the WO’s existing parts get +0.05.'),
'contact4':('§4','For ranking, a match on a contact field scores as a secondary-field match (§6.1) and carries no primary-name bonus.'),
'cap20':('§5.2','The scoped tab shows up to 20 rows, scrolled within the modal — there is no pagination and no further loading, and no Show all link inside the tab. Reaching a record beyond the 20 means narrowing the query.'),
}
# per-case: (id, [plain bullets], [quote keys])
CASES=[
(44850,["The record matched exactly on its identifier is pinned as a single row at the very top, above the grouped results, labelled with its entity icon.","This gives the 'type the number, jump straight to it' experience."],['id100','pin']),
(44851,["Open/active and recently-updated work orders rank above old, closed ones.","Work orders assigned to, or recently viewed by, the signed-in user are boosted.","Closed or Invoiced work orders older than 90 days are pushed down.","Within a group, rows are ordered by score, most relevant first."],['wo','grouporder']),
(44852,["The in-stock part ranks above the out-of-stock part.","The out-of-stock part is still shown — out-of-stock parts are not demoted below relevance and are not hidden."],['parts']),
(44853,["Assets and work orders owned by the customer whose page you are on rank higher than they would from an unrelated page.","This is a single lightweight contextual-bias signal."],['ctxcust']),
(44854,["Parts already on the work order you are viewing are pushed down relative to other matching parts.","Other parts in the same category as the work order's existing parts get a small lift."],['ctxwo']),
(45137,["A Purchase Order still Ordered (not yet received) ranks above received ones.","More recently created POs rank above older ones (recency fades over about two weeks).","A PO created by the signed-in user gets a small extra lift."],['po']),
(45138,["An Unpaid vendor invoice ranks above paid ones.","A more recent invoice date ranks higher (recency fades over about a month)."],['vi']),
(45139,["A match on a contact field (name, phone or email) is treated as a secondary-field match on the parent company and does not get the primary-name bonus.","Contacts are not ranked or grouped on their own — the company row carries the result."],['primarybonus','contact4']),
(55707,["The record whose name begins with the query ranks highest, a whole-word match ranks next, and a typo-only (fuzzy) match ranks lowest.","An exact identifier match, if present, would pin above all of them."],['prefix','wholeword','fuzzy','id100']),
(55708,["The customer that has an open work order and that you viewed recently ranks above the customer with neither.","Open work orders and a recent view both lift a customer up the list."],['cust']),
(55709,["The asset attached to an open work order (and/or viewed recently) ranks above the other.","A newer model year only breaks a tie; it does not by itself outrank an open-work-order asset."],['asset']),
(55710,["The vendor with open purchase orders (and/or used recently) ranks above the vendor with none."],['vendor']),
(55711,["A recently created part sale ranks well above an old one (the lift fades over roughly a week).","A part sale you created gets a small extra lift, and a Paid part sale gets a small lift."],['psale']),
(55712,["A part sold or used recently (and/or viewed recently) ranks above an equally-matching part with no recent activity.","A part that has a bin location gets a small extra lift."],['parts']),
(55716,["When everything else is equal, the more recently updated record ranks first."],['ties']),
(55722,["The customer with more open work orders ranks higher.","The effect is scaled, so a large gap in open-WO count matters more than a tiny one."],['cust']),
(55723,["A customer matched on its name ranks above a customer matched only on a secondary field.","A match on the primary display name carries a small bonus that a secondary-field match does not."],['primarybonus']),
(55724,["With all other signals equal, a name that begins with the query ranks first, a name that contains it as a whole word ranks second, and a typo-only match ranks last.","Order is decided purely by match strength: begins-with beats contains, which beats a typo."],['prefix','wholeword','fuzzy']),
(55729,["The record matched on its exact identifier is pinned as the single row at the very top, above all groups, even when a strong name match for the same text also exists.","An exact identifier match effectively always wins and is shown first."],['id100','pin']),
(55730,["On a broad query the scope tab shows at most 20 rows and a low-ranked target is not shown (no pagination, no load-more).","After narrowing the query the target appears; reaching a record beyond the top 20 means narrowing the query, and ranking decides what is reachable."],['cap20','ties']),
(72120,["On the Parts tab, a part whose description begins with the query ranks above one that only contains it, with a typo-only match last.","The begins-with part is credited more strongly than the contains part; nothing else differs, so match strength alone decides the order."],['prefix','wholeword','fuzzy']),
(72121,["On the Vendors tab, a vendor whose name begins with the query ranks above one that only contains it, with a typo-only match last.","Match strength alone decides the order."],['prefix','wholeword','fuzzy']),
(72122,["On the Assets tab, a vehicle whose name begins with the query ranks above one that only contains it, with a typo-only match last.","Match strength alone decides the order."],['prefix','wholeword','fuzzy']),
]
def build(cid,bullets,qkeys):
    results="".join(f"<li>{esc(b)}</li>" for b in bullets)
    secs=sorted({Q[k][0] for k in qkeys}, key=lambda s:s)
    lc=lastcheck_of(cid)
    srcline=(f"Epic SV-9160; {esc(PRD)}, {', '.join(secs)}."
             + (f" {esc(lc)}" if lc else ""))
    quotes="".join(f"<li><strong>{Q[k][0]}:</strong> &ldquo;{esc(Q[k][1])}&rdquo;</li>" for k in qkeys)
    marker=marker_of(cid)
    html=("<p><strong>Expected results</strong></p>"
          f"<ul>{results}</ul>"
          "<p><strong>Source &mdash; where this behaviour comes from</strong><br>"
          f"{srcline}</p>"
          "<p><strong>Exact quotes from the source (for reproducibility)</strong></p>"
          f"<ul>{quotes}</ul>"
          + ef_block(cid)
          + f"<p>{esc(marker)}</p>")
    return html
run=len(__import__('sys').argv)>1 and __import__('sys').argv[1]=='go'
for cid,bullets,qkeys in CASES:
    for k in qkeys:
        if k not in Q: raise SystemExit("bad key "+k)
    html=build(cid,bullets,qkeys)
    if run:
        api(f"update_case/{cid}",{'custom_expected':html})
        print(f"updated C{cid} (marker: {marker_of(cid)})")
    else:
        if cid in (55707,72120): print(f"\n=== C{cid} PREVIEW ===\n"+html[:1400])
print("\nCASES:",len(CASES))
