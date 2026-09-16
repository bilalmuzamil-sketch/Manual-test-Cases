"""V1 GLOBAL SEARCH, RE-CREATED FROM ITS OWN SOURCE SO IT CAN BE RUN.

WHY THIS EXISTS
    Every claim we make about "what the old version could do" is otherwise a claim about code
    somebody read once. This file turns each of those claims into something anyone can RUN.
    Type a search term, get the answer the old product would have given.

WHAT IT IS FAITHFUL TO
    ShopView product repository at commit 55767168:
      api/src/Reporting/GlobalSearch/Application/FetchData/FetchDataQueryHandler.php
          fetchWorkOrderData  (lines  75-143)   work orders AND part sales, one query
          fetchVendorData     (lines 144-183)
          fetchCustomerData   (lines 213-266)
          fetchVehicleData    (lines 267-316)
          fetchPartData       (lines 317-340)   reads the CATALOGUE table, never inventory
      app/src/composables/useGlobalSearch.ts
          the query guard          (lines  66-71)
          pass 1, label startsWith (lines  76-82)
          pass 2, text contains    (lines  84-93)
          the permitted-type filter(lines 140-150)
          MAX_PER_TYPE = 3         (line  152)
          the two passes in order  (lines 156-200)
          history on zero results  (lines 229-231)

🔴 THE ONE THING MOST OFTEN GOT WRONG
    There are TWO matching passes and they behave differently.
      PASS 1 compares the typed text, WITH its spaces, against the record's VISIBLE LABEL,
              and only from the START of it.
      PASS 2 compares the typed text WITHOUT its spaces against one long combined text,
              and matches ANYWHERE inside it.
    A vehicle's visible label is "2019 Freightliner Cascadia", so "2019 Freightliner" matched
    on PASS 1 as a prefix. Modelling only pass 2 gives the right answer here by luck and the
    wrong answer elsewhere. Both are implemented.

WHAT IT DELIBERATELY DOES NOT DO
    It does not invent data. You give it records; it tells you what the old search would have
    returned for them. And it cannot speak for things that were never about matching - the
    keyboard shortcut, the row icons, the analytics event, how it looked on a phone. Those are
    marked NOT SIMULATABLE in the evidence register and rest on the code citation alone.
"""

MAX_PER_TYPE = 3          # useGlobalSearch.ts:152


# ─── the SQL string helpers, transcribed ────────────────────────────────────────────────────
def _nospace(s):
    """REPLACE(LOWER(CONCAT(...)), " ", "") - the shape used by every fetcher."""
    return "".join(s).lower().replace(" ", "")


def _phone(p):
    """REPLACE(REPLACE(tel, ")", "-"), "(", "") - used on customer and vendor telephones.

    So "(419) 555-0143" is stored as "419-555-0143". The typed text has only its SPACES
    removed, nothing else, which is why the dashed form matched in V1 and the bracketed form
    and the plain digits did not.
    """
    return (p or "").replace(")", "-").replace("(", "")


def _status(s):
    """CASE WHEN status = "quality_check" THEN "qualitycheckqc" ELSE REPLACE(status, "_", "")."""
    return "qualitycheckqc" if s == "quality_check" else (s or "").replace("_", "")


# ─── the five record builders ───────────────────────────────────────────────────────────────
def work_order(number, customer_name, status, shop_id="", kind="service", raw_number=""):
    """fetchWorkOrderData - ONE query serving BOTH work orders and part sales.

    `number` is the stored form, e.g. "S-17611". The query also writes four SHOP-PREFIXED
    variants of it, which is why a number with the shop number in front still found the job.
    """
    letter = "S" if kind == "service" else "P"
    stem = number.replace(f"{letter}-", "")
    variants = [f"{letter}{stem}", f"{letter}{shop_id}{stem}", f"{letter}{shop_id}-{stem}", f"{shop_id}-{stem}"]
    label = f"{letter}{shop_id}-{stem} {customer_name}" if shop_id else f"{number} {customer_name}"
    inner = _nospace([raw_number or "", *variants, number, customer_name, _status(status)])
    return {"type": "WorkOrder" if kind == "service" else "PartSale",
            "label": label,
            "search": f"{customer_name} {inner}"}          # name kept WITH spaces, then the stripped part


def vendor(name, address_1="", address_2="", state="", postal="", city="", telephone="", email=""):
    """fetchVendorData - lines 144-183."""
    return {"type": "Vendor", "label": name,
            "search": _nospace([name, address_1, address_2, state, postal, city, _phone(telephone), email])}


def customer(name, address_1="", address_2="", state="", postal="", city="",
             telephone="", website="", contacts=()):
    """fetchCustomerData - lines 213-266. `contacts` is (first, last, title, telephone) tuples.

    Note the company name is written TWICE - once as-is and once with its spaces removed -
    which is what let someone type a company name with no spaces at all and still find it.
    """
    blob = [name, name.replace(" ", ""), address_1, address_2, state, postal, city,
            _phone(telephone), website]
    for first, last, title, tel in contacts:
        blob += [first or "", last or "", title or "", _phone(tel)]
    return {"type": "Customer", "label": name, "search": f"{name} {_nospace(blob)}"}


def vehicle(year, maker, model, unit="", vin="", plate="", owner=""):
    """fetchVehicleData - lines 267-316.

    🔴 The visible LABEL is "<year> <maker> <model>", which is why typing a year followed by a
    make matched on pass 1.
    """
    return {"type": "Vehicle", "label": f"{year} {maker} {model}",
            "search": _nospace([owner, str(year), maker, model, unit, vin, plate])}


def part(name, part_number=""):
    """fetchPartData - lines 317-340. Reads CataloguePart. There is NO inventory join anywhere
    in this query, so whether the shop ever held the part made no difference at all."""
    return {"type": "Part", "label": name,
            "search": _nospace([name, (part_number or "").replace("-", ""), part_number or ""])}


# ─── the client-side filter, transcribed ────────────────────────────────────────────────────
GROUP_OF = {"WorkOrder": "Work Orders", "PartSale": "Part Sales", "Customer": "Customers",
            "Contact": "Customers", "Vendor": "Vendors", "Vehicle": "Assets", "Part": "Parts"}


def search(query, records, history=(), permitted=None):
    """Return what V1's search panel would have shown.

    permitted: the set of types the signed-in user may see. None means "everything".
    Returns {"rows": [...], "showing_history": bool}.
    """
    q = (query or "").lower()

    # useGlobalSearch.ts:66-71 - under two characters, the panel shows recent items instead.
    if len(q) < 2:
        return {"rows": list(history), "showing_history": True, "why": "under two characters"}

    squashed = "".join(q.split())                 # normalizedSearch.replace(/\s+/g, "")
    allowed = None if permitted is None else set(permitted)
    rows, taken, matched_ids = [], {}, set()

    def push(rec, as_type):
        grp = GROUP_OF.get(as_type)
        if allowed is not None and as_type not in allowed:
            return                                 # the permitted-type filter, lines 140-150
        if taken.get(grp, 0) >= MAX_PER_TYPE:      # MAX_PER_TYPE = 3, per TYPE, no overall cap
            return
        taken[grp] = taken.get(grp, 0) + 1
        rows.append({"group": grp, "label": rec["label"], "type": as_type})

    # PASS 1 - the visible label, from the START, spaces kept.
    for r in records:
        if r["label"].lower().startswith(q):
            push(r, r["type"]); matched_ids.add(id(r))

    # PASS 2 - the whole combined text, ANYWHERE inside it, spaces removed from the query.
    for r in records:
        if id(r) in matched_ids:                   # already shown; never listed twice
            continue
        if squashed and squashed in r["search"].lower():
            # a customer matched on its CONTACT details is shown as a Contact, still the company
            push(r, "Contact" if r["type"] == "Customer" else r["type"])
            matched_ids.add(id(r))

    # useGlobalSearch.ts:229-231 - nothing matched, so the recent list comes back.
    if not rows:
        return {"rows": list(history), "showing_history": True, "why": "the search matched nothing"}
    return {"rows": rows, "showing_history": False, "why": ""}


def finds(query, records, **kw):
    """True if the query returned any real matches (not the recent-items fallback)."""
    r = search(query, records, **kw)
    return bool(r["rows"]) and not r["showing_history"]
