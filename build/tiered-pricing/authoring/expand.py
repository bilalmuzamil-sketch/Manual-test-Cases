"""One action per step for the work order Quick Add (Rule 135; consolidation, 14 Nov 2026; batch A's library request 4).

Steps such as "Add a part to line 1 with category A and cost 100.00." open the Add Part row, fill four boxes and save it in one step
(open-change-save, the bundle Rule 135 names). The design draws this row (board 10.6 "Quick Add a part with a cost": Add Part,
Part number, Description *, Qty *, Category, Cost, Sell price, Save, Cancel, More Options), so its labels are known and each action can
be its own step. expand() turns each such step into one action per step, keeps the author's results on the final "Click Save." step,
renumbers any "step N" text, makes sure the work order's precondition gives it a line to add the part to, and attaches board 10.6.

Steps for flows no source draws (a Part Sale's add-part row, Tech View, the part request modal, a special-order part's Source, returns,
credit memos, goodwill credits, invoicing, making a record from a picker) are not split: their field labels are in no source, so a split
would invent labels (Rule 57). build.py lists them under KEEP_WHOLE with that reason."""
import re

QA_FORM = "Part number | Description * | Qty * | Category | $ | Cost | $ | Sell price | Save | Cancel"
CTX_WO = re.compile(r"^(Open|Create a new) (work order (\d+)|customer ([A-Z])'s work order|the new work order)")
CTX_OTHER = re.compile(r"^(Open|Create a new) (Part Sale|a Part Sale|the Part Sale)|Tech View")

PATS = [  # (regex, how to read line / category / cost / quantity / work order)
    (re.compile(r"^Add a part to line (\d+) with (?:Quick Add, )?category ([A-Z]) and (?:cost ([\d.,]+)|(no cost))(?: and quantity (\d+))?\.$"),
     lambda m: dict(line=m[1], cat=m[2], cost=m[3], qty=m[5] or "1")),
    (re.compile(r"^Add a part with a cost of \$([\d.,]+) in category ([A-Z])\.$"), lambda m: dict(line=None, cat=m[2], cost=m[1], qty="1")),
    (re.compile(r"^Add a part in category ([A-Z]) with a cost of ([\d.,]+)\.$"), lambda m: dict(line=None, cat=m[1], cost=m[2], qty="1")),
    (re.compile(r"^Add a category ([A-Z]) part (?:to work order (\d+) )?at a cost of \$([\d.,]+)\.$"), lambda m: dict(line=None, cat=m[1], cost=m[3], qty="1", wo=m[2])),
    (re.compile(r"^Add a part with category ([A-Z]) and cost ([\d.,]+) to customer ([A-Z])'s work order\.$"),
     lambda m: dict(line="1", cat=m[1], cost=m[2], qty="1", open=f"Open customer {m[3]}'s work order.", cust=m[3])),
    (re.compile(r"^Add a part to work order (\d+) with the noted category and the noted cost\.$"),
     lambda m: dict(line=None, cat=None, cost="the noted cost", qty="1", wo=m[1], catx="the noted category")),
]
FILL = re.compile(r"^Fill the row with category ([A-Z]), cost ([\d.,]+) and sell price (-?[\d.,]+)\.$")
# other open-change-save steps whose screens the design draws (pages 2, 9, 14): Set Rule on a tier's page, a customer's tier in Edit Customer,
# Change Customer on a work order. Labels from the boards and from the cases that already spell these flows out (S2-52, S9-23, S14-03).
SETRULE = re.compile(r"^Set tier ([A-Z])'s rule in matrix ([A-Z]) to % Off (\d+) with Set Rule\.$")
PUTCUST = re.compile(r"^Put customer ([A-Z]) on (tier [A-Z]|Default) for work orders in Edit Customer\.$")
CHGCUST = re.compile(r"^Change the customer to customer ([A-Z]) with Change Customer in the work order's three-dot menu\.$")


def _wo_has_line(pre, wo):
    for x in pre:
        if re.search(rf"\bwork order {wo}\b", x) and x.startswith("Have"):
            return bool(re.search(r"\bline\b", x))
    return None


def _give_line(pre, wo):
    """Make the work order's precondition give it a labor line (line 1) for the part to go on; returns the new list."""
    out = []
    for x in pre:
        if re.search(rf"\bwork order {wo}\b", x) and x.startswith("Have") and not re.search(r"\bline\b", x):
            x = x[:-1] + ", with one labor line (line 1)." if x.endswith(".") else x + ", with one labor line (line 1)."
        out.append(x)
    return out


def expand(pre, steps, res, pics, first_row, B, QD, S_=None):
    """Returns (pre, steps, res, pics, n_expanded). B and QD are tp_lib's builders; first_row is a PRD row the case already cites."""
    row = first_row or "S11-R7"
    q = lambda t: QD(t, "10.6", row)
    new_s, new_r, where, n = [], [], {}, 0
    ctx = None
    for i, (s, r) in enumerate(zip(steps, res), 1):
        m0 = CTX_WO.match(s)
        if m0: ctx = ("wo", m0[3] or (f"cust{m0[4]}" if m0[4] else "new"))
        elif CTX_OTHER.search(s): ctx = ("other", None)
        got = None
        for rx, rd in PATS:
            m = rx.match(s)
            if m: got = rd(m); break
        if got:
            wo = got.get("wo") or (ctx[1] if ctx and ctx[0] == "wo" else None)
            if got.get("open"): wo = "cust"
            ok = got.get("open") or (ctx and ctx[0] == "wo" and wo not in (None, "new") and not str(wo).startswith("cust"))
            if got.get("line") and not got.get("open") and ctx and ctx[0] == "wo": ok = True
            if not ok:
                got = None
            elif not got.get("line"):
                if _wo_has_line(pre, wo) is None: got = None          # the work order is not one the preconditions make
                else:
                    pre = _give_line(pre, wo); got["line"] = "1"
        if got:
            n += 1
            seq = []
            if got.get("open"):
                seq.append((got["open"], [B(f"Customer {got['cust']}'s work order opens.", q("Add Part"))]))
            L = got["line"]
            seq += [(f"Click Add Part under line {L}.", [B(f"A new part row opens under line {L} with Part number, Description, Qty, Category, Cost and "
                                                          "Sell price boxes and Save and Cancel.", q(QA_FORM))]),
                    ("Type a description in Description (for example Test part).", [B("Description holds the typed text.", q("Description *"))]),
                    (f"Type {got['qty']} in Qty.", [B(f"Qty holds {got['qty']}.", q("Qty *"))]),
                    (f"Pick {got.get('catx') or 'category ' + got['cat']} in Category.", [B(f"Category shows {got.get('catx') or 'category ' + got['cat']}.", q("Category"))])]
            if got["cost"]:
                seq.append((f"Type {got['cost']} in Cost.", [B(f"Cost holds {got['cost']} as typed.", q("Cost"))]))
            else:
                seq.append(("Leave Cost empty.", [B("Cost stays empty while the other boxes are filled.", q("Cost"))]))
            seq.append(("Click Save.", r))
            for st, rr in seq: new_s.append(st); new_r.append(rr)
            where[i] = len(new_s)
            continue
        mf = FILL.match(s)
        if mf:
            n += 1
            seq = [("Type a description in Description (for example Test part).", [B("Description holds the typed text.", q("Description *"))]),
                   ("Type 1 in Qty.", [B("Qty holds 1.", q("Qty *"))]),
                   (f"Pick category {mf[1]} in Category.", [B(f"Category shows category {mf[1]}.", q("Category"))]),
                   (f"Type {mf[2]} in Cost.", [B(f"Cost holds {mf[2]} as typed.", q("Cost"))]),
                   (f"Type {mf[3]} in Sell price.", r)]
            for st, rr in seq: new_s.append(st); new_r.append(rr)
            where[i] = len(new_s)
            continue
        seq = None
        m = SETRULE.match(s)
        if m and new_s and re.match(rf"^Click tier {m[1]}'s row", new_s[-1]):
            seq = [(f"Check matrix {m[2]}.", [B("The bulk bar shows the count 1.", S_("S2-R22"))]),
                   (f"Type {m[3]} in the bulk bar's value.", [B(f"% Off is picked with the value {m[3]}.", S_("S2-R22"))]),
                   ("Click Set Rule.", [B("The Set Rule question opens.", S_("S2-R23"))]),
                   ("Click Set Rule in the dialog.", r)]
        m = PUTCUST.match(s)
        if m:
            seq = [(f"Open customer {m[1]}'s page from Customers.", [B(f"Customer {m[1]}'s page opens.", S_("S9-R7"))]),
                   ("Click the edit pencil on the customer card.", [B("Edit Customer opens.", S_("S9-R7"))]),
                   ("Open the Work Order Tier picker.", [B(f"The picker lists {m[2]}.", S_("S9-R30"))]),
                   (f"Pick {m[2]}.", [B(f"Work Order Tier reads {m[2]}.", S_("S9-R1"))]),
                   ("Click Save.", r)]
        m = CHGCUST.match(s)
        if m:
            wo = ctx[1] if ctx and ctx[0] == "wo" and str(ctx[1]).isdigit() else None
            seq = [(f"Open work order {wo}'s three-dot menu." if wo else "Open the work order's three-dot menu.",
                    [B("The menu lists Change Customer, Split Work Order and Back to Work Orders.", S_("S14-R4"))]),
                   ("Click Change Customer.", [B("The Change Customer dialog opens.", S_("S14-R4"))]),
                   (f"Pick customer {m[1]}.", [B(f"Customer {m[1]} is picked.", S_("S14-R4"))]),
                   ("Click Update Customer.", r)]
        if seq:
            n += 1
            for st, rr in seq: new_s.append(st); new_r.append(rr)
            where[i] = len(new_s)
            continue
        new_s.append(s); new_r.append(r); where[i] = len(new_s)
    if n:
        fix = lambda t: re.sub(r"\b([Ss]teps?) (\d+)", lambda m: f"{m[1]} {where.get(int(m[2]), int(m[2]))}", t)
        pre = [fix(x) for x in pre]
        for rr in new_r:
            for b in rr: b.t = fix(b.t)
        if any("Add Part" in x for x in new_s) and "10.6" not in pics: pics = list(pics) + ["10.6"]
    return pre, new_s, new_r, pics, n
