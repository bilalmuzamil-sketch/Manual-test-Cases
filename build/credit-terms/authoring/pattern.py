"""The QA lead's own case pattern (Rule 117 fourteenth amendment, 26 Oct 2026, "Yes, permanent, all suites").
Turns each case's authoring data (which keeps its {placeholders} and "For example:" lines for the setup file) into the TestRail form:
plain precondition bullets in setup order ("Sign in as …", "Have …", "Make sure …", "Use a desktop browser …", "Start on …"), the
Blocked line last; steps with plain record names; "Step N:" followed by one bullet per sentence of the result. Records keep a plain
name that is the same in the preconditions, steps and results ("term A", "customer B", "work order 1", "the test location"). A value the
result depends on (an amount, an unknown term text) becomes a plain fact (VALUES); a value read at setup time is a named number or date
("number A", "date B"). Example names (ZZAUTOTEST …, S2-15440, Staging Heavy Duty - 9919) are dropped: they were only examples and stay in
the setup file for Claude sessions. Hand-written forms for the few bullets the rules cannot phrase plainly are in PRE_OVR / STEP_OVR /
RES_OVR; every one is listed in pattern-format-2026-10-26/PASS-REPORT.md."""
import re

BLOCKED_P = 'If you cannot set up any of the above, mark this test Blocked: "setup not done".'

KIND = {"Vendor-invoice": "vendor invoice", "Work-order": "work order", "Part-sale": "part sale", "Credit-memo": "credit memo",
        "Term": "term", "Customer": "customer", "Vendor": "vendor", "User": "user", "Invoice": "invoice", "Role": "role",
        "Organization": "organization", "Asset": "asset", "Estimate": "estimate", "Location": "location",
        "Date": "date", "Count": "number", "Amount": "amount", "Text": "text", "Hours": "hours", "Address": "address"}
PLURAL = {"vendor invoice": "vendor invoices", "work order": "work orders", "term": "terms", "customer": "customers", "vendor": "vendors",
          "invoice": "invoices", "user": "users", "location": "locations"}
PH = re.compile(r"\{([A-Z][A-Za-z]*(?:-[a-z]+)?)-([A-Z0-9])\}")

# A value the expected result depends on becomes a plain fact (the old example value), per case.
VALUES = {
 "D-25": {"Amount-A": "$500.00"}, "D-27": {"Amount-A": "$5,000.00"}, "D-40": {"Amount-A": "$5,000.00"}, "D-36": {"Amount-A": "$500.00"},
 "S5-22": {"Text-A": '"Prepaid"'}, "S7-05": {"Text-A": '"Prepaid"'}, "S10-03": {"Text-A": '"Prepaid"'},
 "S3-12": {"Text-A": "a 32-character name"}, "S1-22": {"Address-A": "the Credit Terms page's web address"},
 "S12-10": {"Hours-A": "the difference in hours"},
}

def names_for(c):
    """Placeholder -> plain name for one case."""
    text = " ".join([a + " " + (b or "") for a, b in c["pre"]] + c["steps"] + c["res"] + [c["note"]])
    found = sorted(set(PH.findall(text)))
    locs = {x for k, x in found if k == "Location"}
    own_user = any(re.match(r"Your user name is \{User-A\}", a) for a, _ in c["pre"])
    out = {}
    for k, x in found:
        ph = "{" + k + "-" + x + "}"
        v = VALUES.get(c["key"], {}).get(k + "-" + x)
        if v: out[ph] = v
        elif k == "Location" and locs == {"A"}: out[ph] = "the test location"
        elif k == "User" and x == "A" and own_user: out[ph] = "your user name"
        else: out[ph] = f"{KIND[k]} {x}"
    if "{n}" in text: out["{n}"] = "N"
    return out

def _cap(s): return s[:1].upper() + s[1:] if s else s

def sub(text, names):
    """Replace every placeholder by its plain name, without doubling the kind word ("customer {Customer-A}" -> "customer A")."""
    if not text: return text
    t = text
    # "Customers {Customer-A}, {Customer-B} and {Customer-C}" -> "Customers A, B and C"; "terms {Term-A} (day 31), {Term-B} (day 30)" likewise
    for k, kw in sorted(KIND.items(), key=lambda kv: -len(kv[1])):
        # singular kind word right before its own placeholder: "customer {Customer-A}" -> "customer A"
        sg = re.compile(r"\b(" + kw[0] + "|" + kw[0].upper() + ")(" + re.escape(kw[1:]) + r") \{" + re.escape(k) + r"-([A-Z0-9])\}")
        t = sg.sub(lambda m: (m.group(1) + m.group(2) + " " + m.group(3)) if names.get("{" + k + "-" + m.group(3) + "}", "").startswith(kw + " ") else m.group(0), t)
        pl = PLURAL.get(kw)
        if not pl: continue
        item = r"\{" + re.escape(k) + r"-[A-Z0-9]\}(?: \([^)]*\))?"
        lst = re.compile(r"\b(" + pl[0] + "|" + pl[0].upper() + ")(" + re.escape(pl[1:]) + r") (" + item + r"(?:(?:, | and |, and )" + item + r")+)")
        def fix(m, k=k, kw=kw):
            if not all(names.get("{" + k + "-" + y + "}", "").startswith(kw + " ") for y in re.findall(r"\{" + re.escape(k) + r"-([A-Z0-9])\}", m.group(3))):
                return m.group(0)
            return m.group(1) + m.group(2) + " " + re.sub(r"\{" + re.escape(k) + r"-([A-Z0-9])\}", r"\1", m.group(3))
        t = lst.sub(fix, t)
        # "Work orders {Work-order-1} for X and {Work-order-2} for Y" -> "Work order 1 for X and work order 2 for Y"
        if k == "Term": continue   # "showing Terms {Term-A}": "Terms" is the invoice's label, not a plural
        one = re.compile(r"\b(" + pl[0] + "|" + pl[0].upper() + ")" + re.escape(pl[1:]) + r" \{" + re.escape(k) + r"-([A-Z0-9])\}")
        t = one.sub(lambda m: (m.group(1) + kw[1:] + " " + m.group(2)) if names.get("{" + k + "-" + m.group(2) + "}", "").startswith(kw + " ") else m.group(0), t)
    # typing a record's name
    t = re.sub(r"\b([Tt]ype|[Ee]nter|[Pp]aste) (\{(?:Term|Customer|Vendor)-[A-Z0-9]\})(?!'s)", r"\1 the name of \2", t)
    t = re.sub(r"\b(Name with) (\{Term-[A-Z0-9]\})", r"\1 the name of \2", t)
    # every other placeholder; capitalised at the start of a sentence
    def rep(m):
        v = names.get(m.group(0), m.group(0))
        s = t[:m.start()]
        if not s.strip() or re.search(r"[.!?]\s+$", s): v = _cap(v)
        return v
    t = re.sub(r"\{[A-Z][A-Za-z-]*-[A-Z0-9]\}|\{n\}", rep, t)
    return t

# ---------------------------------------------------------------- preconditions
PRE_OVR = {  # (case key, original bullet) -> plain bullet(s); only where the rules below cannot phrase it plainly
 ("S1-22", "You have the Credit Terms page's web address, {Address-A}, copied earlier from an Admin's browser."):
   ["Have the Credit Terms page's web address, copied earlier from an Admin's browser."],
 ("S2-22", "Before you start, the Active tab's count reads {Count-A} and the Inactive tab's {Count-B} (write them down)."):
   ["Before you start, write down the Active tab's count (number A) and the Inactive tab's count (number B)."],
 ("DATA-24", "Before you start, the Active tab's count reads {Count-A} and the Inactive tab's {Count-B} (write them down)."):
   ["Before you start, write down the Active tab's count (number A) and the Inactive tab's count (number B)."],
 ("S4-08", "Before you start, Net 30's Customers count reads {Count-A} (write it down)."):
   ["Before you start, write down Net 30's Customers count (number A)."],
 ("S3-12", "A 32-character text, {Text-A}."): ["Have a name ready that is 32 characters long."],
 ("S12-10", "You are enrolled at {Location-B}, in a time zone {Hours-A} hours apart from {Location-A}."):
   ["Make sure you are also enrolled at location B, in a time zone a whole number of hours apart from location A, and note that difference in hours."],
 ("S3-06", "You are enrolled at {Location-B}, in a time zone where today's date is already {Date-B} while it is still {Date-A} at {Location-A}. Run the case at a time of day when the two dates differ."):
   ["Make sure you are also enrolled at location B, in a time zone where today's date is already one day later than at location A. Note location B's date (date B). Run the case at a time of day when the two dates differ."],
 ("DATA-18", "Today's date at {Location-B} is {Date-A}; {Date-B} is {Date-A} plus 30 days."):
   ["Note today's date at location B (date A).", "Work out date B: date A plus 30 days."],
 ("DATA-19", "Today's date at {Location-A} is {Date-A}; {Date-B} is {Date-A} plus 365 days, and {Date-C} is day 31 of the month after {Date-A}, or that month's last day if it is shorter."):
   ["Note today's date at the test location (date A).", "Work out date B: date A plus 365 days.",
    "Work out date C: day 31 of the month after date A, or that month's last day if it is shorter."],
 ("D-13", "Today on the calendar of the location you work in is {Date-A}, and {Date-B} is the date 14 days later."):
   ["Note today's date on the calendar of the location you work in (date A).", "Work out date B: the date 14 days later."],
 ("D-14", "Today on the calendar of the location you work in is {Date-A}, and {Date-B} is the 10th of the following month."):
   ["Note today's date on the calendar of the location you work in (date A).", "Work out date B: the 10th of the following month."],
 ("DATA-20", "The shop's own term {Term-A} is held by no customer, and Net 30 is held by {Count-B} customers, written down before you start (the Counter Sale customer is never counted)."):
   ["Make sure the shop's own term A is held by no customer.", "Before you start, write down how many customers hold Net 30 (number B; the Counter Sale customer is never counted)."],
 ("DATA-21", "Customer {Customer-A} and vendor {Vendor-A} were stored with a blank credit term before the release; COD's Customers count is {Count-A} and Vendors count {Count-B} with them included."):
   ["Make sure customer A and vendor A were stored with a blank credit term before the release.",
    "Before you start, write down COD's Customers count (number A) and Vendors count (number B), with them included."],
 ("DATA-22", "Net 45 is held by {Count-A} vendors (written down). Vendor {Vendor-A} is stored with \"NET 45\" and vendor {Vendor-B} holds Net 45 and is inactive; both are in {Count-A}."):
   ["Make sure vendor A is stored with \"NET 45\" and vendor B holds Net 45 and is inactive.",
    "Before you start, write down how many vendors hold Net 45 (number A, which includes vendor A and vendor B)."],
 ("DATA-23", "Net 15 is held by {Count-A} customers and Net 20 by {Count-B}, written down; three of the Net 15 customers are {Customer-A}, {Customer-B} and {Customer-C}."):
   ["Make sure three of the customers on Net 15 are customer A, customer B and customer C.",
    "Before you start, write down how many customers hold Net 15 (number A) and how many hold Net 20 (number B)."],
 ("S7-05", "On production, customer {Customer-A} is stored with a credit term text ShopView does not know, {Text-A}, and an invoice {Invoice-A} for it, dated Oct 5, 2026, was created before the release reached production; its due date then, {Date-A}, was written down (with a screenshot)."):
   ["Make sure that on production, customer A is stored with a credit term text ShopView does not know, \"Prepaid\", and that invoice A for it, dated Oct 5, 2026, was created before the release reached production.",
    "Have invoice A's due date from before the release written down (date A), with a screenshot."],
 ("S11-02", "Before the release reached production, these were written down on production (with screenshots): customer {Customer-A}'s term and credit limit, vendor {Vendor-A}'s term and credit limit, and invoice {Invoice-A}'s term and due date, and vendor invoice {Vendor-invoice-A}'s due date."):
   ["Have these written down on production from before the release reached production (with screenshots): customer A's term and credit limit, vendor A's term and credit limit, invoice A's term and due date, and vendor invoice A's due date."],
 ("S4-17", "The shop's own term {Term-A}, due 20 days after the invoice date, is held by exactly one customer, {Customer-A}, whose record misses details Edit Customer would ask for (for example no address)."):
   ["Make sure the shop's own term A, due 20 days after the invoice date, is held by exactly one customer, customer A, whose record has no address (a detail Edit Customer requires)."],
 ("S3-08", "A new name {Term-A} that no term has, and a customer {Customer-A} and a vendor {Vendor-A}."):
   ["Choose a new name for term A that no term has.", "Have a customer, customer A, and a vendor, vendor A."],
 ("D-38", "The log cannot be loaded (the setup file says how to make it fail on the test shop)."):
   ["Make sure the Credit Terms Log cannot be loaded on the test shop."],
}

START_RE = re.compile(r"^Starting screen: (.*)$")
def pre_rule(a):
    """One original precondition (with placeholders) -> one imperative bullet (still with placeholders)."""
    if a.startswith("You are an Admin user working at "): return "Sign in as an Admin at " + a[len("You are an Admin user working at "):]
    m = re.match(r'^You and a second user, (\{User-B\}), are both signed in with the "Admin" role, in two separate browsers\.$', a)
    if m: return f'Sign in with the "Admin" role in one browser, and have a second user, {m.group(1)}, signed in with the "Admin" role in a second browser.'
    if a.startswith("You are signed in "): return "Sign in " + a[len("You are signed in "):]
    if a.startswith("You have "): return "Have " + a[len("You have "):]
    if a.startswith("You use "): return "Use " + a[len("You use "):]
    if a.startswith("You are "): return "Make sure you are " + a[len("You are "):]
    if re.match(r"^Your user name is \{User-A\}\.$", a): return "Note your user name."
    if a == "An Admin can check the result in a second browser.": return "Have an Admin signed in to a second browser, to check the result."
    m = re.match(r"^The shop has its own active (term|terms) (.*)$", a)
    if m: return f"Have the shop's own active {m.group(1)} {m.group(2)}"
    m = START_RE.match(a)
    if m:
        s = m.group(1)
        m2 = re.match(r"^your browser shows (.*?); (\{User-[A-Z]\})'s browser shows (.*)$", s)
        if m2: return f"Start with your browser showing {m2.group(1)} and {m2.group(2)}'s browser showing {m2.group(3)}"
        if " is open" in s: return "Start with " + s.replace(" is open", " open", 1)
        return "Start on " + s
    if a == "The browser window is 1440 px wide, at 100% zoom.": return "Use a desktop browser window 1440 pixels wide, at 100% zoom."
    m = re.match(r"^The design pictures? (.*) (?:is|are) attached to this case; open (?:it|each) at 100% zoom beside the screen\.$", a)
    if m:
        pl = "pictures" if "," in m.group(1) else "picture"
        return f"Open the attached design {pl} {m.group(1)} at 100% zoom beside the screen."
    m = re.match(r"^Today's date on the calendar of (\{Location-[A-Z]\}) is (\{Date-[A-Z]\})\.$", a)
    if m: return f"Note today's date on the calendar of {m.group(1)} ({m.group(2)})."
    m = re.match(r"^(\{Date-[A-Z]\}) is (.*)\.$", a)
    if m: return f"Work out {m.group(1)}: {m.group(2)}."
    m = re.match(r"^(A new name|A name|Names|A new name for it|A name for the new (?:customer|vendor)|A name for a new customer|Names for two new customers)(,? )(.*)$", a)
    if m:
        head = m.group(1)
        if head in ("A new name", "A name") and re.match(r"\{Term-[A-Z]\}", m.group(3)):
            ph = m.group(3)[:8]; rest = m.group(3)[8:]
            return f"Choose {head[0].lower()}{head[1:]} for {ph}{rest}"
        if head == "Names" and m.group(3).startswith("{Term-"):
            return "Choose names for " + m.group(3)
        return "Choose " + head[0].lower() + head[1:] + m.group(2) + m.group(3)
    if re.match(r"^A (contacts|vendor) import file", a): return "Have " + a[0].lower() + a[1:]
    if a.startswith("An organization "): return "Have an organization, " + a[len("An organization "):].replace("} ", "}, ", 1)
    if a.startswith("Other ") or a.startswith("Write down") or a.startswith("Before you start, write") or a.startswith("Run "): return a
    if a.startswith("Before you start, "): return "Before you start, make sure " + a[len("Before you start, "):]
    # any other statement of what must exist: "Make sure …"
    first = a.split(" ")[0]
    LOWER = {"The", "At", "All", "No", "Every", "Customer", "Customers", "Vendor", "Vendors", "Work", "Today's", "Today", "An", "A",
             "Both", "Names", "Your", "Its", "On", "Before", "QuickBooks"}
    if first in LOWER and first not in ("QuickBooks",): a = a[0].lower() + a[1:]
    if first == "On": return "Make sure that " + a
    if first == "Before": return "Make sure that " + a
    return "Make sure " + a

def order_key(p):
    if p.startswith("Sign in"): return 0
    if p.startswith("Use a desktop browser") or p.startswith("Use a phone"): return 2
    if p.startswith("Open the attached design"): return 3
    if p.startswith("Start "): return 4
    return 1

def pattern_pre(c, names, blocked):
    out = []
    for a, _ in c["pre"]:
        if a == blocked: continue
        ov = PRE_OVR.get((c["key"], a))
        bullets = ov if ov else [pre_rule(a)]
        out += [_cap(sub(b, names)) for b in bullets]
    out = sorted(out, key=order_key)  # stable: setup order, the starting screen last
    return out + [BLOCKED_P]

# ---------------------------------------------------------------- steps and results
STEP_OVR = {}   # (key, step number) -> plain step
RES_OVR = {     # (key, step number) -> list of bullets
 ("S1-36", 1): ["The role editor opens.", "There is no new toggle for credit terms.",
                "Credit Terms is governed by the existing \"Finance\" sub-row under \"Settings\".",
                "Move Customers is governed by the existing \"Customers\" row's \"Create & Edit\" column and the \"View and Manage AP/AR Data\" cross toggle.",
                "The Settings sub-toggles are the same six as before the release (App Settings, Service, Parts, Finance, Data Import, View/Manage Wages)."],
 ("D-33", 1): ["Under \"Invoice: INV-\" followed by work order 1's number, the lines read \"Invoice date: Oct 5, 2026\" and \"Due date: Nov 10, 2026\".",
               "The reference chips read \"Work Order\" with work order 1's number, \"Customer PO …\" and \"Terms\" with term A's name, the term name whole.",
               "The layout is today's (compare ct-p9-02-10th-of-next-month-invoice-oct-5-due-nov-10.png and today's ct-p9-01-an-invoice-today-net-30.png; the orange outline on the picture is not part of the screen)."],
 ("S12-10", 4): ["The newest row shows your user name under User.",
                 "It shows the date and time of the change as clocks at location A read them."],
 ("S12-10", 8): ["The same row now shows the time later by the difference in hours (as clocks at location B read it).",
                 "The date changes too if the move crosses midnight."],
}

def _split_sentences(body):
    """Split a result into sentences (never inside double quotes or brackets); a "; " outside quotes also splits, unless the sentence is
    a "label: a; b; c" list."""
    out, buf, q, depth, i = [], "", False, 0, 0
    while i < len(body):
        ch = body[i]; buf += ch
        if ch in '"“”': q = not q if ch == '"' else (ch == "“")
        elif ch == "(" and not q: depth += 1
        elif ch == ")" and not q: depth = max(0, depth - 1)
        elif ch in ".!?" and not q and depth == 0 and body[i + 1:i + 2] == " " and re.match(r"[A-Z0-9\"“{$]", body[i + 2:i + 3] or ""):
            out.append(buf.strip()); buf = ""; i += 1
        i += 1
    if buf.strip(): out.append(buf.strip())
    res = []
    for s in out:
        if ";" not in s: res.append(s); continue
        parts, buf, q, depth = [], "", False, 0
        for j, ch in enumerate(s):
            if ch == '"': q = not q
            elif ch == "(": depth += 1
            elif ch == ")": depth = max(0, depth - 1)
            if ch == ";" and not q and depth == 0 and s[j + 1:j + 2] == " ":
                parts.append(buf.strip()); buf = ""; continue
            buf += ch
        parts.append(buf.strip())
        res += [re.sub(r"^and ", "", p) for p in parts if p]
    fin = []
    for s in res:
        if re.fullmatch(r'"[^"]+"\.?', s): s = "The count reads " + s.rstrip(".") + "."   # a result that was only the on-screen words
        s = s.replace("User your user name", "User (your user name)")
        s = _cap(s)
        if not re.search(r"[.!?…\"”)]$", s): s += "."
        elif s.endswith(")") and not s.endswith(".)"): s += "."
        fin.append(s)
    return fin

def pattern_case(c, blocked):
    names = names_for(c)
    pre = pattern_pre(c, names, blocked)
    steps = [STEP_OVR.get((c["key"], i), _cap(sub(s, names))) for i, s in enumerate(c["steps"], 1)]
    results = []
    for i, r in enumerate(c["res"], 1):
        if (c["key"], i) in RES_OVR: results.append(RES_OVR[(c["key"], i)]); continue
        body = re.sub(r"^Step \d+: ", "", r)
        results.append(_split_sentences(sub(body, names)))
    note = sub(c["note"], names) if c["note"] else ""
    return dict(pre=pre, steps=steps, results=results, note=note, names=names)
