"""The QA lead's own pattern for every case (Rule 117 fourteenth amendment, 26 Oct 2026, PERMANENT, all suites).

Shape (the model is C665915, S1-01, whose entry in trial_layout.py is kept exactly as the QA lead approved it):
  Preconditions: short plain bullets telling the tester what to set up, in setup order ("Sign in as ...", "Use a ...", "Have a ...",
                 "Open ... in a desktop browser ..."), no {placeholders}, no "For example:", no "Scenario:", the Blocked line last.
  Steps:         numbered, plain, the build's own labels, with the same plain record names as the preconditions.
  Expected:      "Expected Result", then per step "Step N:" and a bullet list (one observable fact per bullet), then a blank paragraph,
                 then, byte for byte as before, any known-problem or held note, the exact quotes with their From: lines, the References
                 from Design block and the AUTOMATION line last.

This module holds the plain-name machinery: a case's {placeholders} (which stay in the case model for the Claude-session setup file)
are turned into the plain names its preconditions use ("sales rep A", "the work order", "customer B"), and an old one-line result is
split into bullets at sentence and semicolon boundaries outside quotes. Nothing here adds, drops or softens a fact: the words of the
result are carried over, only the placeholders become plain names, and a split never happens inside quoted text."""
import re

def cap(s): return s[:1].upper() + s[1:] if s else s
PH = re.compile(r"\{([A-Z][^{}]*)\}")
BLOCKED_P = 'If you cannot set up any of the above, mark this test Blocked: "setup not done".'

# ---- shared precondition bullets (plain, setup order) ----
ADMIN_P = "Sign in as an Admin at the test location."
REPS2_P = 'Have two active staff members at the test location with their "Sales Representative" switch on: sales rep A and sales rep B.'
REPS3_P = ('Have three active staff members at the test location with their "Sales Representative" switch on: sales rep A, sales rep B '
           'and sales rep C.')
CUST_P = "Use a customer with no Sales Representative assigned."
DESK_P = "Use a desktop browser at least 1024 pixels wide."
def WO_P(state='one "Sales Representative" field reading "Unassigned"', who="that customer", lines=True):
    """An open, uninvoiced work order (what the old WO() helper described), with the state the case needs."""
    return f"Have an open, uninvoiced work order for {who}, with " + (f"one approved labor line, one part and {state}." if lines else f"{state}.")
def OPEN_P(what="the work order", where="a desktop browser at least 1024 pixels wide"):
    return f"Open {what} in {where}."
OPEN_WO_P = OPEN_P()
SBR_P = ("Open Reports > Sales By Representative in a desktop browser at least 1024 pixels wide, with the date range set to today.")

ORD = {1: "first", 2: "second", 3: "third"}
def default_names(text):
    """Plain names for the placeholders a case uses. One record of a kind is "the <kind>"; two or more are lettered or ordered."""
    phs = set(PH.findall(text)); n = {}
    def group(prefix): return sorted(x for x in phs if x.startswith(prefix))
    for x in group("Location-"): n[x] = {"Location-A": "the test location", "Location-B": "the second location", "Location-C": "the third location"}[x]
    for kind, word in (("Customer-", "customer"), ("Unit-", "unit"), ("Search-", "search word"), ("Date-", "date")):
        g = group(kind)
        for x in g: n[x] = f"the {word}" if len(g) == 1 else f"{word} {x[-1]}"
    for kind, word in (("Work-order-", "work order"), ("Part-sale-", "part sale")):
        g = group(kind)
        for x in g: n[x] = f"the {word}" if len(g) == 1 else f"the {ORD[int(x[-1])]} {word}"
    for x in group("Sales-rep-"): n[x] = f"sales rep {x[-1]}"
    for x in group("Staff-member-"): n[x] = f"staff member {x[-1]}"
    for x in group("User-"): n[x] = f"user {x[-1]}"
    return n

def sub(text, names):
    """Replace placeholders with plain names. "Work order {Work-order-1}" becomes "the work order" (the kind word is not repeated)."""
    t = re.sub(r"\b([Ww]ork order|[Cc]ustomer|[Pp]art sale|[Ss]taff member|[Uu]ser|[Uu]nit) \{([^{}]+)\}", lambda m: (
        "{" + m.group(2) + "}" if (names.get(m.group(2), "").lower().endswith(m.group(1).lower())
                                   or m.group(1).lower() in names.get(m.group(2), "").lower()) else m.group(0)), text)
    # quoted text is handled piece by piece (quotes pair from left to right): "{Sales-rep-B}" alone is "sales rep B's name";
    # "{Sales-rep-B} (Inactive)" is "sales rep B's name followed by "(Inactive)""; any other quoted text that holds a name (a log
    # entry, a printed row) keeps its quotes, with each name shown as [sales rep B's name]
    parts = re.split(r'("[^"]*")', t)
    for i in range(1, len(parts), 2):
        q = parts[i]
        if "{" not in q: continue
        m1 = re.fullmatch(r'"\{([^{}]+)\}"', q)
        m2 = re.fullmatch(r'"\{([^{}]+)\}( ?\([^"()]*\))"', q)
        if m1: parts[i] = f"{names[m1.group(1)]}'s name"
        elif m2: parts[i] = f"{names[m2.group(1)]}'s name followed by \"{m2.group(2).strip()}\""
        else: parts[i] = PH.sub(lambda n: f"[{names[n.group(1)]}'s name]", q)
    t = "".join(parts)
    # a plain name that starts a sentence starts with a capital ("Sales rep B is not listed")
    t = PH.sub(lambda m: cap(names[m.group(1)]) if (m.start() == 0 or re.search(r"[.!?]\s$", m.string[:m.start()])) else names[m.group(1)], t)
    return t


def split_bullets(text):
    """Split one result into bullets at ". " (followed by a capital, a quote or a digit) and "; ", never inside quoted text or
    brackets. Each bullet starts with a capital and ends with its full stop."""
    out, cur, q, depth, i = [], "", False, 0, 0
    while i < len(text):
        ch = text[i]; cur += ch
        if ch in "“": q = True
        elif ch in "”": q = False
        elif ch == '"': q = not q
        elif ch == "(": depth += 1
        elif ch == ")": depth = max(0, depth - 1)
        if not q and depth == 0 and ch in ".;" and text[i + 1:i + 2] == " ":
            nxt = text[i + 2:i + 3]
            if ch == ";" or (ch == "." and (nxt.isupper() or nxt in "\"“" or nxt.isdigit())
                             and not re.search(r"(e\.g|i\.e|etc|vs|No|approx)$", cur[:-1])):
                out.append(cur.strip()); cur = ""; i += 2; continue
        i += 1
    if cur.strip(): out.append(cur.strip())
    res = []
    for b in out:
        b = b.rstrip(";").strip()
        if not b.endswith((".", "!", "?", ".\"", ".)")): b += "."
        res.append(cap(b))
    return res

PICS = "<<design pictures line>>"   # in a pattern entry's pre: replaced by pics_p() of the case's own browser-window line
def pics_p(old_pre):
    """The case's browser-window and design-pictures line, said as two setup instructions. The picture names, boards and the
    sample-data sentence are carried word for word."""
    line = next(a for a, _ in old_pre if a.startswith("The browser window is "))
    m = re.match(r"The browser window is (.*?), and the (design pictures?) (.*) attached to this case (?:are|is) open beside it at 100% "
                 r"\(actual size\)\. (.*)$", line)
    win, kind, lst, rest = m.groups()
    win = win.replace(" px", " pixels")
    w = f"Use {win}." if win.startswith(("a desktop browser", "a phone screen")) else f"Set the browser window to {win}."
    return [w, f"Open the {kind} {lst} attached to this case beside the browser window at 100% (actual size). {rest}"]
