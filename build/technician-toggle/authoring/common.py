"""Shared precondition and step phrases for the Technician Toggle cases (plain words, the screen's own labels).
Labels used, from the PRD and the design captions (design-2026-11-02, read only for labels): Settings, Staff; New Staff Member;
Edit Staff Member; Save & Close; Time Clock; Sales Representative; Technician; Billable; Role; Board View; Tech View; Technician filter;
Assign lead technician / Reassign lead technician (a card's more-actions menu); Lead Technician; Add Technician; New Line; Edit Line;
Edit Labor; Deactivate Account."""
ADMIN = "Sign in as an Admin at the test location."
LIST = "Start on Settings, Staff."
NEWWIN = "Open the New Staff Member window."
EDIT_A = "Open staff member A's Edit Staff Member window."
SAVE = "Click Save & Close."
WARN_TAIL = " They'll stay on it, but won't be offered as a technician on anything new."
WARN_TAIL_N = " They'll stay on them, but won't be offered as a technician on anything new."
NAME = "[staff member A's first and last name]"
NAME_NOTE = "In the warning texts, [staff member A's first and last name] stands for staff member A's name exactly as it was last saved."
TIP_TC = "Turn on Time Clock first. Only staff who clock in can be technicians."
TIP_ROLE = "This role can't be a technician."
WIN_TECH = 'The window shows the Technician toggle on.'


def staff(label="A", tech=True, tc=True, role="the built-in Technician role", where="enrolled at the test location only", extra=""):
    t = "on" if tech else "off"
    c = "on" if tc else "off"
    return (f"Have a new staff member for this test, staff member {label}, on {role}, with Time Clock {c} and Technician {t}, "
            f"{where}{extra}.")


def tech_b():
    return ("Have a new staff member for this test, staff member B, on the built-in Technician role, with Time Clock on and Technician "
            "on, enrolled at the test location only, so the list has a technician to compare with.")


def wo(n, status, lead, extra="", loc="at the test location", why=""):
    return f"Have a new service work order for this test, work order {n}, {loc}, in {status}, led by {lead}{extra}{why}."


TURN_OFF = ["Open staff member A's Edit Staff Member window.", "Switch Technician off.", "Click Save & Close."]
TURN_OFF_RES = [["The Edit Staff Member window opens with Technician on."], ["The Technician toggle is off."]]
