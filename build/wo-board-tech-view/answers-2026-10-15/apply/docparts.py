"""Setup-doc wording shared by the cases converted on 15 Oct 2026 (same wording as the 14 Oct v52 docs)."""
SIGNIN = ("Sign in as an Owner or Admin user. On a QA site click the Admin quick-login button on the sign-in page; you appear as "
          "\"Admin ShopView\". To check the permissions: your initials (top right) > Settings > Roles & Permissions > Admin > Work "
          "orders: View and Create & Edit are on.")
LOCATION = ("Pick one location for the whole case; it is shown in the top bar next to the bell (to change it: your initials > "
            "Change Location). This is {Location-A} (for example Staging Heavy Duty - 9919). Create everything below at {Location-A}.")
WIDTH = "Use a desktop browser window at least 1024 px wide (narrower windows show only the List, with no display switcher)."


def tech(ph, example, extra=""):
    return ("Your initials > Settings > Staff. Reuse a staff member only if they are active, have Time Clock on, {Location-A} in "
            "Location and a Role other than Office User or Time Clock User. Otherwise click New Staff Member and enter First Name and "
            f"Last Name (for example {example}), an Email, Role Technician, at least one Department (required), Location "
            "{Location-A}, turn Time Clock on, then Save & Close. " + f"This is {{{ph}}}." + (" " + extra if extra else ""))


def customer(ph, example):
    return (f"Top menu Customers > New Customer > Name (for example \"{example}\") > Save. This is {{{ph}}}; use it for this case "
            "only. On the customer page click Contacts > New Contact > First Name and Last Name (for example ZZAUTOTEST Contact) > "
            "Save. Then Assets > New Asset > pick the contact, Year (for example 2022), Make (type \"Freight\" and pick "
            "Freightliner), Model (for example M2), Unit (for example TRK-118) > Save. Contact and Make are required.")


def wo(ph, cust, example, lead=None, approved=True):
    s = (f"Work Orders > Create Work Order > in the New Work Order window pick {{{cust}}} and its asset > Save (if a Confirmation "
         "about the credit limit appears, click Create). The work order opens on its Lines tab with the New Line form. In What Are "
         "You Doing? type \"grease\" and pick the ready-made line \"Service - Full grease service\"")
    s += ", turn Line Approved on and click Save & Close. The status reads Approved." if approved else " and click Save & Close."
    s += f" Write down the number shown at the top left (for example {example}). This is {{{ph}}}."
    if lead:
        s += (f" On {{{ph}}}'s page pick {{{lead}}} in the Lead Technician dropdown; it saves at once (the dropdown shows once the "
              "work order is Approved).")
    elif approved:
        s += " Leave its Lead Technician empty, so it sits in Unassigned."
    return s


def view_only_user(ph, example_user, example_role):
    return ("Your initials > Settings > Roles & Permissions > Create Custom Role > Skip > Role Name (for example "
            f"\"{example_role}\") > under Work orders tick only View > Create. Then Settings > Staff > New Staff Member (for example "
            f"\"{example_user}\", with an email inbox you can open) with that role at {{Location-A}}, and finish the invite so the user "
            f"can sign in. This is {{{ph}}}.")


def no_shifts(techs):
    return (f"Open the Schedule page and check that {techs} have no shift on this case's work orders. If a window titled \"Clear … "
            "scheduled shifts?\" still appears during a move, click Keep shifts.")


PART2_EVIDENCE = "Evidence: a screenshot after each step that has an expected result, the build marker, and the real value of every brace name."
