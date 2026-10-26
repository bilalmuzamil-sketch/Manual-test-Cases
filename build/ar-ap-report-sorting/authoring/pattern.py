"""The QA lead's own pattern for a test case (Rule 117 fourteenth amendment, 26 Oct 2026, "Yes, permanent, all suites").
Model: C665915 (Splitting Sales Representatives S1-01; build/splitting-sales-reps/authoring/trial_layout.py).

  Title            plain words, what the tester will see, at most 80 characters ("Design: " kept on design cases)
  Preconditions    short plain bullets telling the tester what to set up, in setup order ("Sign in as ...", "Have ...",
                   "Use a desktop browser ...", "Open ..."); no "Scenario:" line, no {placeholders}, no "For example:" lines,
                   no setup-file link, no who-to-ask; two records of one kind are named plainly ("customer A", "customer B")
                   and the same names are used in the steps and results; no "mark this test Blocked" line
                   (fifteenth amendment, 26 Oct 2026)
  Steps            numbered, plain, the build's own labels
  Expected Result  "Step N:" then bullets, one observable fact per bullet; then one blank paragraph
  below it         unchanged: the build-difference note, the exact quotes with their From: lines, References from Design, AUTOMATION

How a case is made: `convert(c)` turns the case model (ar_lib.C: preconditions with {placeholders} and "For example:" lines, one
"Step N:" result per step) into the pattern mechanically: placeholders become plain names, the example lines are dropped, the
standard sentences (Admin, starting screen, two locations) become instructions, and each result is split into its sentences.
Every case was then read in full in its converted form (26 Oct 2026) and corrected by hand where the mechanical form was not
plain enough, or where an example value is a fact the result depends on (it then stays, as a plain fact): `pattern_layout.LAYOUT`.
The setup file for Claude sessions keeps the {placeholders} and examples; it names the plain name each placeholder has in the case."""
import re

KIND = {"Location": "location", "Customer": "customer", "Vendor": "vendor", "Invoice": "invoice", "Bill": "bill",
        "Document": "document", "Bucket": "bucket", "Date": "date", "Credit-memo": "credit memo", "Deposit": "deposit",
        "Vendor-credit": "vendor credit", "User": "user", "Role": "role", "Vendors": "vendor set", "Work-order": "work order"}
PHR = re.compile(r"\{(" + "|".join(sorted((re.escape(k) for k in KIND), key=len, reverse=True)) + r")-([A-Z0-9])\}")

def plain_name(kind, letter):
    return f"{KIND[kind]} {letter}"

def plain(s):
    """{Customer-A} -> customer A; "Customer {Customer-A}" -> "Customer A"; "Customers {Customer-A} and {Customer-B}" -> "Customers A and B"."""
    if not s: return s
    # "Customers {Customer-A} and {Customer-B}" / "Vendors {Vendor-A}, {Vendor-B} and {Vendor-C}"
    def plural(m):
        # "Customers {Customer-A} and {Customer-B}" -> "Customer A and customer B": each record keeps its own plain name
        word, body = m.group(1), m.group(2)
        out = PHR.sub(lambda x: plain_name(x.group(1), x.group(2)), body)
        return (out[0].upper() + out[1:]) if word[0].isupper() else out
    s = re.sub(r"\b((?:[Cc]ustomer|[Vv]endor|[Ii]nvoice|[Bb]ill|[Dd]ocument|[Ll]ocation|[Uu]ser)s) "
               r"((?:\{[A-Za-z-]+-[A-Z0-9]\}(?:, | and |, and ))+\{[A-Za-z-]+-[A-Z0-9]\})", plural, s)
    # "Customer {Customer-A}" -> "Customer A" (the word before the placeholder is its own kind)
    for kind, word in sorted(KIND.items(), key=lambda x: -len(x[1])):
        s = re.sub(r"\b(" + re.escape(word) + r") \{" + re.escape(kind) + r"-([A-Z0-9])\}", r"\1 \2", s, flags=re.I)
    s = PHR.sub(lambda m: plain_name(m.group(1), m.group(2)), s)
    return s

def cap(s):
    s = s.strip()
    return s[:1].upper() + s[1:] if s else s

def end(s):
    s = s.strip()
    return s if s.endswith((".", "?", "!", '."', '?"', ".)", ":")) else s + "."

# ---- preconditions -------------------------------------------------------------------------------------------------------------
ADMIN_RE = re.compile(r'^You are an Admin user \(the "Admin" role\) working at \{Location-([A-C])\}, your current location\.$')
TWO_LOC = ("The organization has open documents in these reports at two locations, {Location-A} and {Location-B}, and you are enrolled "
           "at both; {Location-A}'s name comes first in A to Z order.")
TWO_LOC_B = "The organization has open documents in these reports at a second location, {Location-B}, where you are also enrolled."
START_RE = re.compile(r"^Starting screen: (.*?) (?:is open )?in a desktop browser window (\S+ px) wide(.*)$")
NUMW = "One|Two|Three|Four|Five|Six|Seven|Eight|Nine|Ten"

def pre_one(a):
    """One precondition of the case model -> one or more plain instructions (placeholders still in; plain() runs after)."""
    m = ADMIN_RE.match(a)
    if m: return [f'Sign in as an Admin user (the "Admin" role), with {{Location-{m.group(1)}}} as your current location.']
    if a == TWO_LOC:
        return ["Have open documents in these reports at two locations, {Location-A} and {Location-B}, with {Location-A}'s name first in A to Z order.",
                "Make sure you are enrolled at both locations."]
    if a == TWO_LOC_B:
        return ["Have open documents in these reports at a second location, {Location-B}, and make sure you are enrolled there too."]
    m = START_RE.match(a)
    if m:
        screen, width, tail = m.group(1), m.group(2), m.group(3)
        after = screen.startswith("the release is installed; ")
        if after: screen = screen[len("the release is installed; "):]
        screen = screen.replace(" is open at ", " at ")
        theme = ""
        t = tail
        t = re.sub(r"^, as opened from the Reports menu", "", t)
        mt = re.match(r"^ in (light|dark) theme at 100% zoom", t)
        if mt: theme = f", in {mt.group(1)} theme at 100% zoom"; t = t[mt.end():]
        out = [f"Use a desktop browser window {width} wide{theme}."]
        out.append(("After the release is installed, open " if after else "Open ") + screen + ".")
        t = t.strip()
        if t in ("", "."): return out
        if t.startswith(", with "): out.append("Leave the report with " + t[len(", with "):])
        elif t.startswith("; "): out.append("Leave the report so that " + t[2:])
        else: out.append("Leave the report " + t.lstrip(", "))
        return out
    m = re.match(r"^The design (pictures?) (.*) (?:is|are) attached to this case and open beside the browser at 100% zoom; (compare .*)$", a)
    if m: return [f"Open the design {m.group(1)} {m.group(2)} (attached to this case) beside the browser at 100% zoom; {m.group(3)}"]
    m = re.match(r"^(\{(Customer|Vendor)-A\}) has (.+?); (\{\2-B\}) has (.+?)(?:; (\{\2-C\}) has (.+?))?\. Nothing else is open for the (two|three) on today's date\.$", a)
    if m:
        k = m.group(2).lower()
        out = [f"Have {m.group(8)} {k}s with only these open documents on today's date:", f"{m.group(1)}: {m.group(3)}.", f"{m.group(4)}: {m.group(5)}."]
        if m.group(6): out.append(f"{m.group(6)}: {m.group(7)}.")
        return out
    m = re.match(r"^(.*?); (?:[Cc]ustomer |[Vv]endor )?(\{(Customer|Vendor)-[B-F]\}) has (.*)$", a)
    if m and not re.search(r"\{(?:Customer|Vendor)-[B-F]\} has .*; ", m.group(1)):
        k = m.group(3).lower()
        return pre_one(m.group(1) + ".") + [f"Have a {k}, {m.group(2)}, with {m.group(4)}"]
    m = re.match(r"^(.*?) \(Reports, then (.*?)\) is open in (a second tab.*)$", a)
    if m: return [f"Open {m.group(1)} (Reports, then {m.group(2)}) in {m.group(3)}"]
    m = re.match(rf"^({NUMW}) (customers|vendors)(, [^:]*?,)? (?:have|has) (.*)$", a)
    if m and not re.match(r"(been|had|the) ", m.group(4)):
        mid = m.group(3) or ""
        return [f"Have {m.group(1).lower()} {m.group(2)}{mid} with {m.group(4)}"]
    m = re.match(r"^(Customer|Vendor) (\{(?:Customer|Vendor)-[A-F]\}),? (?:has|had) (.*)$", a)
    if m and not re.match(r"(been|had|the|its) ", m.group(3)):
        k = m.group(1).lower()
        return [f"Have a {k}, {m.group(2)}, with {m.group(3)}"]
    m = re.match(r"^(Customers|Vendors) (\{\w+-A\} and \{\w+-B\}) have (.*)$", a)
    if m and not re.match(r"(been|had|the) ", m.group(3)):
        return [f"Have two {m.group(1).lower()}, {m.group(2)}, with {m.group(3)}"]
    if re.match(r"^(You|Your) ", a): return ["Make sure " + a[0].lower() + a[1:]]
    if re.match(r"^(In|On|At|Before|After|Between|Today|For|From|Once) ", a): return ["Make sure that " + a[0].lower() + a[1:]]
    if re.match(r"^(The|Each|Every|Some|More|At least|Customers|Vendors|This|That|Both|Neither|No|Only|Other) ", a):
        return ["Make sure " + a[0].lower() + a[1:]]
    return ["Make sure " + a]

def convert(c):
    pre = []
    for a, _b in c["pre"]:
        pre += pre_one(a)
    pre = [end(cap(tidy(plain(x)))) for x in sum((split_list(plain(y)) for y in pre), [])]
    steps = [end(cap(tidy(plain(s)))) for s in c["steps"]]
    results = []
    for i, r in enumerate(c["res"], 1):
        body = re.sub(rf"^Step {i}: ", "", r)
        results.append(merge_short([end(cap(tidy(x))) for x in split_facts(tidy(plain(body)))]))
    return dict(title=c["title"], pre=pre, steps=steps, results=results)

NAMES = "|".join(sorted((re.escape(v) for v in KIND.values()), key=len, reverse=True))
def tidy(s):
    """A plain name that opens a sentence gets its capital ("... date. customer B's name" -> "... date. Customer B's name")."""
    s = re.sub(r"(\. |: )(" + NAMES + r") ([A-Z0-9])\b", lambda m: m.group(1) + m.group(2)[0].upper() + m.group(2)[1:] + " " + m.group(3)
               if m.group(1) == ". " else m.group(0), s)
    s = s.replace(" and their names differ", ", whose names differ").replace("the the ", "the ").replace("(for example Wi-Fi)", "(such as Wi-Fi)")
    s = re.sub(r"^Make sure (Customer|Vendor) ([A-F])\b", lambda m: "Make sure " + m.group(1).lower() + " " + m.group(2), s)
    s = re.sub(r"^Make sure you are signed in as ", "Sign in as ", s)
    s = re.sub(r"^Make sure (A|One|Two|Three|Four|Five|Six|Seven|Eight|Nine|Ten) ([a-z])", lambda m: "Make sure " + m.group(1).lower() + " " + m.group(2), s)
    return s

LIST_ITEM = r"(?:(?:customer|vendor|document|invoice|bill|location|credit memo|vendor credit|deposit) [A-F]|Customer [A-F]|Vendor [A-F])\b"
FIXED = {"No other column is.": "No other column is marked as sorted.",
         "The standard error message as well.": "The standard error message shows as well."}
def merge_short(bs):
    """A fragment of one or two words ("Only one.") stays with the fact before it."""
    out = []
    for b in bs:
        b = FIXED.get(b, b)
        if out and len(b.split()) <= 2 and not b.startswith('"'):
            out[-1] = out[-1].rstrip(".") + ", " + b[0].lower() + b[1:]
        else: out.append(b)
    return out

def split_list(s):
    """"... three open invoices, A, B and C: document A is ...; document B is ...; document C is ..." -> the lead-in, then one bullet
    per record (each part of the list names its own record)."""
    i = s.find(": ")
    while i >= 0:
        head, rest = s[:i + 1], s[i + 2:]
        parts = rest.split("; ")
        if len(parts) >= 2 and all(re.match(LIST_ITEM + r"(?::| is | has )", p) for p in parts):
            return [head] + [p.rstrip(".") + "." for p in parts]
        i = s.find(": ", i + 2)
    return [s]

# ", and <a new clause>" ends one fact and starts the next (a list such as "A, B, and C" is never split: its next word is a bare name)
AND_CLAUSE = re.compile(r"(?!the ⋯)(?:the |its |it |no |each |every |all |both |only |nothing |none |there |this |they |two group rows |"
                        r"(?:customer|vendor|bill|invoice|document|location|vendor credit|credit memo|deposit|bucket|user) [A-F] "
                        r"(?:is|are|has|shows|stays|sits|comes|appears|reads|keeps|still|opens|remains|does|cannot|can)\b|"
                        r'"[^"]+" (?:is|are|shows|stays|reads|has|sits|comes|appears|keeps|still)\b)')
# "X and <one of these>" is two facts even without a comma
AND_NOCOMMA = re.compile(r'(?:the "Success" message|a tooltip|the tooltip|its own chevron|nothing is downloaded|the header shows|the other groups|every group is |'
                         r'a "Success" message|the "Success"|both (?:customers|vendors) are |only (?:customer|vendor) [A-F]\'s group|'
                         r'(?:customer|vendor|bill|invoice|document|location|vendor credit|credit memo|deposit) [A-F] (?:is|shows|has|stays|sits|comes|appears|reads|keeps|still)\b)')
# "Every group expands, the column under the button is still not sorted." is two facts
COMMA_CLAUSE = re.compile(r"the column under the button is\b")
def split_facts(s):
    """Split a result into its sentences (and its top-level "; " parts), never inside quotes or brackets."""
    out, cur, q, depth, i = [], "", False, 0, 0
    while i < len(s):
        ch = s[i]
        if ch == '"': q = not q
        elif ch in "(" and not q: depth += 1
        elif ch == ")" and not q: depth = max(0, depth - 1)
        cur += ch
        if not q and depth == 0:
            if ch == "." and s[i + 1:i + 2] == " " and s[i + 2:i + 3][:1].isupper() and not re.search(r"\b(No|e\.g|i\.e|vs|approx)\.$", cur):
                out.append(cur.strip()); cur = ""; i += 1
            elif ch == ";" and s[i + 1:i + 2] == " ":
                out.append(cur[:-1].strip()); cur = ""; i += 1
            elif ch == "," and s[i + 1:i + 6] == " and " and AND_CLAUSE.match(s[i + 6:]):
                out.append(cur[:-1].strip()); cur = ""; i += 5
            elif ch == " " and s[i + 1:i + 5] == "and " and AND_NOCOMMA.match(s[i + 5:]):
                out.append(cur.strip()); cur = ""; i += 4
            elif ch == "," and s[i + 1:i + 2] == " " and COMMA_CLAUSE.match(s[i + 2:]):
                out.append(cur[:-1].strip()); cur = ""; i += 1
        i += 1
    if cur.strip(): out.append(cur.strip())
    return [x for x in out if x]

def apply_layout(c, conv, L, G=None):
    """L = pattern_layout.LAYOUT[key]: any of title, pre, steps, results (whole replacements); pre_set (list of (start, [bullets]):
    the precondition that starts with `start` becomes these bullets); res_step ({step: [bullets]}); step_set ({step: text}); sub,
    pre_sub, step_sub, res_sub, title_sub (lists of (old, new) applied to every line of that part). G = pattern_layout.RES_SPLIT:
    {bullet: [bullets]} applied to every case (one result sentence that holds several facts, written once for all the cases that
    share it). Every replacement must find its target: a miss raises, so a stale correction can never pass silently."""
    out = dict(conv)
    out["results"] = [sum(([*G[b]] if G and b in G else [b] for b in r), []) for r in out["results"]]
    if not L: return out
    for f in ("title", "pre", "steps", "results"):
        if f in L: out[f] = L[f]
    for start, new in L.get("pre_set", []):
        hit = [i for i, x in enumerate(out["pre"]) if x.startswith(start)]
        if len(hit) != 1: raise KeyError(f"{c['key']}: pre_set {start!r} matches {len(hit)} preconditions")
        i = hit[0]; out["pre"] = out["pre"][:i] + list(new) + out["pre"][i + 1:]
    for n, new in L.get("res_step", {}).items():
        if not 1 <= n <= len(out["results"]): raise KeyError(f"{c['key']}: res_step {n}")
        out["results"][n - 1] = list(new)
    for n, new in L.get("step_set", {}).items():
        out["steps"][n - 1] = new
    def S(x, pairs, used):
        for a, b in pairs:
            if a in x: used.add(a)
            x = x.replace(a, b)
        return x
    used = set()
    subs = L.get("sub", [])
    out["title"] = S(out["title"], subs + L.get("title_sub", []), used)
    out["pre"] = [S(x, subs + L.get("pre_sub", []), used) for x in out["pre"]]
    out["steps"] = [S(x, subs + L.get("step_sub", []), used) for x in out["steps"]]
    out["results"] = [[S(x, subs + L.get("res_sub", []), used) for x in r] for r in out["results"]]
    miss = [a for a, _ in subs + L.get("title_sub", []) + L.get("pre_sub", []) + L.get("step_sub", []) + L.get("res_sub", []) if a not in used]
    if miss: raise KeyError(f"{c['key']}: replacement text not found: {miss}")
    return out

RECORD = re.compile(r"\b(customer|vendor|invoice|bill|document|location|bucket|date|user|credit memo|deposit|vendor credit|role|work order) ([A-F1-9])\b"
                    r"|\bthe second (?:customer|vendor|invoice|bill|document|location|bucket|user|work order|credit memo|deposit)\b", re.I)
def records(text):
    """The records a text names: ("customer", "A") ... and ("the second", "customer") for "the second customer"."""
    out = set()
    for m in RECORD.finditer(text):
        out.add((m.group(1).lower(), m.group(2)) if m.group(1) else ("the second", m.group(0).split()[-1].lower()))
    return out
SO = re.compile(r"\bso (?:that )?\w")
TWO_LOC_NEW = "Have open documents in these reports at two locations, location A and location B, with location A's name first in A to Z order."
ENROLLED = "Make sure you are enrolled at both locations."

NUMW_RE = r"(?:a|an|two|three|four|five|six|eight)"
def relate(c, out, PL):
    """Preconditions relate to the steps and results, and every case stands alone (QA lead, 26 Oct 2026: "they must make sense and
    relate to the steps and expected results below"; "if one test case fails that does not block the other test case").
    Applied after the hand corrections, in this order:
    (1) the two-locations block follows PL.TWO_LOC (removed, or kept with its reason) where the case never names a location again;
    (2) a signed-in user the steps and results never name is not given a name;
    (3) a customer or vendor the steps and results never name is not given a name ("Have a customer with ...", then "that customer");
    (4) a location the steps and results never name is described, not named: "your current location", "your other location",
        "a third location"; "location A as your current location" is dropped, and the A to Z clause is kept only when both are named;
    (5) in PL.EXACT (cases that add up or change their own records) the customers and vendors are "new (created for this test)";
    (6) PL.PRE_ADD bullets are inserted (data a result needs that no precondition created)."""
    k = c["key"]
    later = " ".join(out["steps"] + sum(out["results"], []))
    used = records(later)
    pre = list(out["pre"])
    if k in PL.TWO_LOC:
        if TWO_LOC_NEW not in pre: raise KeyError(f"{k}: PL.TWO_LOC names a case without the two-locations bullet")
        i = pre.index(TWO_LOC_NEW); reason, keep_enrolled = PL.TWO_LOC[k]
        pre[i:i + 1] = [] if reason is None else [f"Have open documents in these reports at two locations, so {reason}."]
        if not keep_enrolled and ENROLLED in pre: pre.remove(ENROLLED)
    for u in ("B", "C"):
        if ("user", u) not in used:
            pre = [x.replace(f"Sign in as user {u}, whose ", "Sign in as a user whose ").replace(f"Sign in as user {u}, an ", "Sign in as an ")
                    .replace(f"a location user {u} is not enrolled in", "a location this user is not enrolled in") for x in pre]
    for kind in ("customer", "vendor"):
        unused = [x for x in "ABCDEF" if (kind, x) not in used and any(f"{kind} {x}" in y or f"{kind.capitalize()} {x}" in y for y in pre)]
        if len(unused) != 1: continue          # several unnamed parties of one kind are written by hand (PL.LAYOUT)
        x = unused[0]; nm = f"{kind} {x}"
        d = [i for i, y in enumerate(pre) if y.startswith(f"Have a {kind}, {nm}, with ") or y.startswith(f"Make sure {nm} has")]
        if len(d) != 1: continue
        i = d[0]
        pre[i] = pre[i].replace(f"Have a {kind}, {nm}, with ", f"Have a {kind} with ").replace(f"Make sure {nm} has", f"Make sure a {kind} has")
        pre = [y if j == i else y.replace(f"{nm}'s", f"that {kind}'s").replace(nm, f"that {kind}") for j, y in enumerate(pre)]
    both = ("location", "A") in used and ("location", "B") in used
    if not both:
        pre = [y.replace(", with location A's name first in A to Z order.", ".") for y in pre]
    if ("location", "A") not in used:
        pre = [y.replace(", with location A as your current location.", ".") for y in pre]
        pre = [y.replace("location A's", "your current location's").replace("location A", "your current location") for y in pre]
    if ("location", "B") not in used:
        pre = [y.replace("location B's", "your other location's").replace("location B", "your other location") for y in pre]
    if ("location", "C") not in used:
        pre = [y.replace("location C's", "the third location's").replace("location C", "a third location") for y in pre]
    pre = [y.replace("Have open documents in these reports at two locations, your current location and your other location.",
                     "Have open documents in these reports at two locations: your current location and your other location.") for y in pre]
    if k in PL.EXACT:
        def new(y):
            m = re.match(rf"^Have ({NUMW_RE}) (customers?|vendors?)\b(.*)$", y)
            if m: return f"Have {m.group(1)} new {m.group(2)} (created for this test){m.group(3)}"
            m = re.match(r"^Make sure a (customer|vendor) has(.*)$", y)
            if m: return f"Have a new {m.group(1)} (created for this test) that has{m.group(2)}"
            return y
        pre = [new(y) for y in pre]
    for after, add in PL.PRE_ADD.get(k, []):
        hit = [i for i, x in enumerate(pre) if x.startswith(after)]
        if len(hit) != 1: raise KeyError(f"{k}: PRE_ADD anchor {after!r} matches {len(hit)} preconditions")
        pre[hit[0] + 1:hit[0] + 1] = add
    out["pre"] = pre
    return out

def unrelated(p):
    """Gate helper: (bullet, names) for every precondition bullet that names a record the steps and results never use and gives no reason."""
    later = records(" ".join(p["steps"] + sum(p["results"], [])))
    bad = []
    for x in p["pre"]:
        miss = sorted(records(x) - later)
        if miss and not SO.search(x): bad.append((x, miss))
    return bad

def pattern(c):
    """The case in the QA lead's pattern: dict(title, pre, steps, results)."""
    import pattern_layout as PL, readthrough_layout as RTL, ar_lib as L
    # 26 Oct 2026: the tester read-through's corrections (readthrough_layout.py) come last
    return RTL.readthrough(c, relate(c, apply_layout(c, convert(c), PL.LAYOUT.get(c["key"]), PL.RES_SPLIT), PL), L)
