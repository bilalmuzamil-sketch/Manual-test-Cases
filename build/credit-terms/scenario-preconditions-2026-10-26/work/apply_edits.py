import sys
D = "/home/user/Manual-test-Cases/build/credit-terms/authoring/"
E = [
 # (file, old, new, expected count)
 ("common.py", """    return (f'You are signed in as a user with the "Admin" role, working in {{Location-{loc}}}.',""",
               """    return (f'You are an Admin user working at {{Location-{loc}}}.',""", 1),
 ("common.py", """PAGE = ('Starting screen: the Credit Terms page (Settings, then "Credit Terms" in the Finance group) is open on the Active tab.', None)""",
               """PAGE = ('Starting screen: the Credit Terms page (Settings, then "Credit Terms" in the Finance group), Active tab.', None)""", 1),
 ("common.py", """PAGE_INACTIVE = ('Starting screen: the Credit Terms page (Settings, then "Credit Terms" in the Finance group) is open on the Inactive tab.', None)""",
               """PAGE_INACTIVE = ('Starting screen: the Credit Terms page (Settings, then "Credit Terms" in the Finance group), Inactive tab.', None)""", 1),
 # S1-25: the QA lead's worked example (setup order: the two terms, then the default, then what is switched off)
 ("cases_s1.py", """  [ADMIN(), ("The shop's own term {Term-A}, due 14 days after the invoice date, is the default for new customers.", "For example: {Term-A} is ZZAUTOTEST S1-25 Fourteen."),
   ("The shop also has its own term {Term-B}, due on day 10 of the following month, and no other terms of its own.", "For example: {Term-B} is ZZAUTOTEST S1-25 Tenth."),
   ("Every term that can be deactivated is deactivated: Net 7, Net 15, Net 20, Net 30, Net 45, Net 50, Net 60, Net 90, Net 120 and {Term-B}.", None), PAGE],""",
  """  [ADMIN(), ("The shop created two terms of its own: {Term-A}, due 14 days after the invoice date, and {Term-B}, due on the 10th of the following month. It has no other terms of its own.",
              "For example: {Term-A} is ZZAUTOTEST S1-25 Fourteen and {Term-B} is ZZAUTOTEST S1-25 Tenth."),
   ("{Term-A} is the default for new customers.", None),
   ("Every term that can be switched off is deactivated: Net 7, Net 15, Net 20, Net 30, Net 45, Net 50, Net 60, Net 90, Net 120 and {Term-B}.", None), PAGE],""", 1),
 # S4-10: the term's example sat on the user-name line, before the term was named
 ("cases_s4.py", """[DEFAULT_COD, ("Your user name is {User-A}.", "For example: {Term-A} is ZZAUTOTEST S4-10 N20, {User-A} is ZZAUTOTEST S4-10 Admin."), ("The shop's own term {Term-A}, due 20 days after the invoice date, is held by exactly one customer, {Customer-A}, with a $0.00 limit.", "For example: {Customer-A} is ZZAUTOTEST S4-10 Solo.")],""",
  """[DEFAULT_COD, ("The shop's own term {Term-A}, due 20 days after the invoice date, is held by exactly one customer, {Customer-A}, with a $0.00 limit.", "For example: {Term-A} is ZZAUTOTEST S4-10 N20 and {Customer-A} is ZZAUTOTEST S4-10 Solo."), ("Your user name is {User-A}.", "For example: {User-A} is ZZAUTOTEST S4-10 Admin.")],""", 1),
 # S10: examples name their placeholder; the two customers of S10-14 on their own lines
 ("cases_s10.py", """"For example: Postman.")""", """"For example: the request tool is Postman.")""", 1),
 ("cases_s10.py", """"For example: ZZAUTOTEST S10-11 None and ZZAUTOTEST S10-11 Blank.")""", """"For example: {Customer-A} is ZZAUTOTEST S10-11 None and {Customer-B} is ZZAUTOTEST S10-11 Blank.")""", 1),
 ("cases_s10.py", """"For example: ZZAUTOTEST S10-12 Customer.")""", """"For example: {Customer-A} is ZZAUTOTEST S10-12 Customer.")""", 1),
 ("cases_s10.py", """"For example: ZZAUTOTEST S10-13 Customer.")""", """"For example: {Customer-A} is ZZAUTOTEST S10-13 Customer.")""", 1),
 ("cases_s10.py", """[("Names for a new customer, {Customer-A}; customer {Customer-B} exists on Net 30 with a $600.00 limit.", "For example: ZZAUTOTEST S10-14 New and ZZAUTOTEST S10-14 Existing.")],""",
  """[("A name for a new customer, {Customer-A}.", "For example: {Customer-A} is ZZAUTOTEST S10-14 New."),
     ("Customer {Customer-B} exists on Net 30 with a $600.00 limit.", "For example: {Customer-B} is ZZAUTOTEST S10-14 Existing.")],""", 1),
 ("cases_s10.py", """"For example: ZZAUTOTEST S10-15 Customer.")""", """"For example: {Customer-A} is ZZAUTOTEST S10-15 Customer.")""", 1),
 # S12-09: the customers in the example are named as the term's customers
 ("cases_s12.py", """"For example: {Term-A} is ZZAUTOTEST S12-09 N20, ZZAUTOTEST S12-09 Alpha, Bravo and Charlie.")""",
  """"For example: {Term-A} is ZZAUTOTEST S12-09 N20 and its customers are ZZAUTOTEST S12-09 Alpha, Bravo and Charlie.")""", 1),
 # DATA: examples name their placeholders
 ("cases_data.py", """"For example: S2-15440, S2-15441 and S2-15442.")""", """"For example: {Work-order-1} is S2-15440, {Work-order-2} is S2-15441 and {Work-order-3} is S2-15442.")""", 1),
 ("cases_data.py", """"For example: S2-15440 and S2-15441.")""", """"For example: {Work-order-1} is S2-15440 and {Work-order-2} is S2-15441.")""", 3),
 ("cases_data.py", """"For example: ZZAUTOTEST DATA-16 Cash and ZZAUTOTEST DATA-16 Receipt.")""", """"For example: {Customer-A} is ZZAUTOTEST DATA-16 Cash and {Customer-B} is ZZAUTOTEST DATA-16 Receipt.")""", 1),
 # Design: D-17 said both "COD is the default" and "Due on Receipt is the default instead of COD"; one plain line
 ("cases_design.py", """   [DEFAULT_COD, ("Due on Receipt is the default for new customers instead of COD.", None),""",
  """   [("Due on Receipt is the default for new customers, not COD.", None),""", 1),
 # Design: the starting screen goes last, after the window size and the attached pictures (setup order)
 ("cases_design.py", """    C(key, "DESIGN", title, [who or ADMIN()] + list(pre) + [W1440, PICS(figs)], st, rs, q, note=note, marker=marker)""",
  """    start = [p for p in pre if p[0].startswith("Starting screen:")]
    C(key, "DESIGN", title, [who or ADMIN()] + [p for p in pre if p not in start] + [W1440, PICS(figs)] + start, st, rs, q, note=note, marker=marker)""", 1),
]
for f, old, new, n in E:
    t = open(D + f).read()
    k = t.count(old)
    if k != n: sys.exit(f"STOP {f}: expected {n} got {k}: {old[:80]!r}")
for f, old, new, n in E:
    t = open(D + f).read(); open(D + f, "w").write(t.replace(old, new))
print("applied", len(E))
