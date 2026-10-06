# -*- coding: utf-8 -*-
# Cases whose preconditions need dated readings: seeded by hand through Mark complete On a work order (S18-R19),
# coordinator decision 6 Oct 2026 (blocker B1 resolved from the specification). Executed inside gen.py.
import datetime as _dt
TODAY = _dt.date(2026, 10, 6)
def day(n):  # n days before the example test day
    d = TODAY - _dt.timedelta(days=n)
    return f"{d.day} {d.strftime('%b %Y')}"
def fmt(v): return f"{v:,}"
DATE_NOTE = ("Dates are for a run on 6 Oct 2026. On another day, move every date by the same number of days and seed and read on the same day, "
             "because an estimate and a reading's age both count days up to today.")
SEED_SCHED = ("Open Settings > Maintenance, press New schedule and create a throwaway schedule 'ZZAUTOTEST Reading seed' holding one routine "
              "service per reading you will seed, named 'ZZ Seed 1', 'ZZ Seed 2' and so on, each with a Calendar trigger of Every 12 months and no "
              "canned lines. Save. (If it already exists, reuse it.)")
RATE_SCHED = ("In Settings > Maintenance create a schedule 'ZZAUTOTEST Rate PM' with one service 'PM-M': a Distance trigger set At 360,000 mileage "
              "and a Calendar trigger of Every 12 months. Save.")
def seed_unit(unit, rate_sched=True):
    s = (f"Open Customers > 'ZZAUTOTEST Fleet Co' > Assets and create unit '{unit}' with New Asset, leaving Mileage and Engine Hours empty. "
         f"On its Maintenance tab press Enroll in Schedule, choose 'ZZAUTOTEST Reading seed' and give every seed service a last service date five "
         f"years ago (for example 6 Oct 2021), so each seed service reads Overdue and shows on the work order card; press Enroll.")
    if rate_sched:
        s += " Enroll the unit on 'ZZAUTOTEST Rate PM' too, with PM-M last done today."
    return s
SEED_HOW = ("Seed each reading in the table, oldest first: open Work Orders and press New Work Order for the unit; type the reading's mileage in the "
            "work order's Mileage field (and its engine hours in Engine Hours where the table gives one; leave the field untouched where it does not) "
            "and save; expand the Maintenance schedule card, open the three-dot menu of a seed service not used yet, choose Mark complete, keep On a "
            "work order with this work order chosen, set Reset date to the reading's date and press Mark complete. That work order's values become "
            "readings dated the Reset date. Confirm any warning the field shows.")
SEED_DONE = ("When every reading is in: on the unit's Maintenance tab open the 'ZZAUTOTEST Reading seed' schedule's menu, choose Remove from schedule "
             "and confirm, so the seed services add no rows. Check the Mileage card's last recorded value and date match the table's last reading.")
def table(unit, rows):
    """rows: list of (days_ago, mileage, hours_or_None)"""
    parts = []
    for i, (n, m, h) in enumerate(rows, 1):
        parts.append(f"{i}) {day(n)} · {fmt(m)} mileage" + (f" · {fmt(h)} engine hours" if h is not None else ""))
    return f"Readings for '{unit}' (oldest first): " + "; ".join(parts) + "."
def check_rows(rows):
    for (a, ma, _), (b, mb, _) in zip(rows, rows[1:]):
        assert a > b, rows   # oldest first
SEED_Q = Q("S18-R19", "Mark complete On a work order also records that work order's mileage and engine hours as the asset's readings, dated the Reset date")

# ---------------------------------------------------------------- C204180 worked rate example (S11-E6)
R180 = [(151, 333_700, None), (120, 334_000, None), (90, 336_700, None), (30, 342_700, None), (0, 345_700, None)]
check_rows(R180)
rate3 = (345_700 - 334_000) / 120; rate4 = (345_700 - 333_700) / 151
assert rate3 == 97.5
due3 = TODAY + _dt.timedelta(days=(360_000 - 345_700) / rate3); due4 = TODAY + _dt.timedelta(days=(360_000 - 345_700) / rate4)
assert due3.month == 3 and due4.month == 4
upd(204180, "Rate maths: last three usable pairs over the days they span (worked example)", ["S11"],
    [LOGIN_ADMIN, SEED_SCHED, RATE_SCHED, seed_unit("ZZAUTOTEST 501"),
     table("ZZAUTOTEST 501", R180) + " " + DATE_NOTE, SEED_HOW, SEED_DONE],
    ["Open unit 501's Maintenance tab and read the Mileage card's rate.",
     "Work out by hand from the last three pairs: (345,700 − 334,000) ÷ 120 days = 11,700 ÷ 120 = 97.5 a day, which is 682.5 a week.",
     "Read PM-M's due date and the trigger beneath it.",
     "Work out by hand: 360,000 − 345,700 = 14,300 to go; 14,300 ÷ 97.5 = about 147 days after the last reading (6 Oct 2026), "
     "which falls at the very start of March 2027 (1 to 2 Mar)."],
    ["The rate is 97.5 a day: 11,700 added over the 120 days the last three pairs span, read as one period (shown as about 682.5 a week; the spec "
     "does not say how the weekly figure is rounded).",
     "PM-M is due in March (Mar 2027 for a run on 6 Oct 2026), from the mileage estimate.",
     "The oldest pair (+300 over 31 days) is not used: with it the rate would be 12,000 ÷ 151 = about 79.5 a day and PM-M would fall due in April."],
    [Q("S11-R2"), Q("S11-E6"), SEED_Q],
    "Coordinator decision (B1): seed dated readings by hand through Mark complete On a work order. Dates chosen so the spec's own worked example "
    "(97.5 a day, due in March) is reproduced exactly, with an extra older pair that would move the month to April if it were used.",
    section=26644)

# ---------------------------------------------------------------- C204125 last three pairs / one or two pairs
RA = [(70, 300_000, None), (60, 302_000, None), (40, 304_000, None), (20, 306_000, None), (10, 307_000, None)]
RB = [(50, 400_000, None), (30, 401_000, None), (10, 403_000, None)]
check_rows(RA); check_rows(RB)
assert (307_000 - 302_000) / 50 * 7 == 700 and (403_000 - 400_000) / 40 * 7 == 525
upd(204125, "The rate uses the last three usable pairs; with one or two, all of them", ["S11"],
    [LOGIN_ADMIN, SEED_SCHED, seed_unit("ZZAUTOTEST 502", False), seed_unit("ZZAUTOTEST 503", False),
     table("ZZAUTOTEST 502", RA), table("ZZAUTOTEST 503", RB) + " " + DATE_NOTE, SEED_HOW, SEED_DONE],
    ["Open unit 502's Maintenance tab and read the Mileage card's rate.",
     "Work out by hand: the last three pairs add 5,000 over 50 days = 100 a day = 700 a week; all four pairs would give 7,000 over 60 days, about "
     "816.7 a week.",
     "Open unit 503's Maintenance tab and read the rate.",
     "Work out by hand: both pairs add 3,000 over 40 days = 75 a day = 525 a week; the last pair alone would give 700 a week."],
    ["Unit 502 (four usable pairs) reads 700 a week: only the last three pairs are used and the oldest is left out.",
     "Unit 503 (two usable pairs) reads 525 a week: with fewer than three pairs, all of them are used.",
     "Each rate is the reading added across the pairs divided by the days they span, read as one period."],
    [Q("S11-R2"), Q("S11-R18", "A rate will read as an accrual without naming a unit, for example 640 a week"), SEED_Q],
    "Coordinator decision (B1): seeded dated readings replace 'Give the unit more than three usable pairs', which a tester could not do. Figures "
    "chosen so each branch gives a different whole weekly rate.")

# ---------------------------------------------------------------- C204124 estimate carried forward; no pair -> calendar
RC = [(30, 340_000, None), (20, 341_000, None), (10, 342_000, None)]
check_rows(RC)
upd(204124, "An estimate carries the last reading forward at the unit's own rate", ["S11"],
    [LOGIN_ADMIN, SEED_SCHED, RATE_SCHED, seed_unit("ZZAUTOTEST 504"), table("ZZAUTOTEST 504", RC) + " " + DATE_NOTE, SEED_HOW, SEED_DONE,
     "Create unit 'ZZAUTOTEST 505' with no mileage at all and enroll it on 'ZZAUTOTEST Rate PM' with PM-M last done today."],
    ["Open unit 504's Maintenance tab and read the Mileage card: last recorded value, rate and current estimate.",
     "Work out by hand: rate (342,000 − 340,000) ÷ 20 days = 100 a day; 10 days since the last reading, so 342,000 + 1,000 = 343,000.",
     "Open unit 505's Maintenance tab and read the Mileage card and PM-M's due date.",
     "If the organization holds a unit with imported history (from a data import) and work order readings, open it and check both kinds appear in "
     "its Measured from N visits; if none exists, record that part as not checked by hand."],
    ["Unit 504's current estimate is 343,000: the last recorded reading (342,000) carried forward at the unit's own rate of 100 a day for 10 days.",
     "Unit 505, with no reading, has no rate and no estimate: PM-M is carried by the calendar and the row says the meter has no basis yet.",
     "Readings from imported history and from work orders both count toward the rate."],
    [Q("S11-R1"), Q("S11-R14"), Q("S11-R3"), SEED_Q],
    "Coordinator decision (B1): seeded readings give an exact expected estimate (Rule 116). Imported history cannot be created by hand, so that part is "
    "conditional on such a unit existing.")

# ---------------------------------------------------------------- C204126 guards (rewritten again with seeding)
G = {"ZZAUTOTEST 510": ("control: three clean readings", [(50, 300_000, None), (30, 302_000, None), (10, 304_000, None)], 3),
     "ZZAUTOTEST 511": ("last pair only 3 days apart", [(50, 300_000, None), (30, 302_000, None), (27, 302_300, None)], 2),
     "ZZAUTOTEST 512": ("last reading lower", [(50, 300_000, None), (30, 302_000, None), (10, 301_500, None)], 2),
     "ZZAUTOTEST 513": ("last pair 1,900 a day", [(50, 300_000, None), (30, 302_000, None), (10, 340_000, None)], 2),
     "ZZAUTOTEST 514": ("last pair 410 days apart", [(500, 300_000, None), (470, 303_000, None), (60, 343_000, None)], 2)}
for u, (_, rows, _) in G.items(): check_rows(rows)
assert (340_000 - 302_000) / 20 > 1500 and 470 - 60 > 365
upd(204126, "A usable pair, and the guards that drop pairs from the rate", ["S11"],
    [LOGIN_ADMIN, SEED_SCHED,
     "Create five units, 'ZZAUTOTEST 510' to 'ZZAUTOTEST 514', each as follows: " + seed_unit("<unit>", False)]
    + [table(u, rows) + f" ({why})" for u, (why, rows, _) in G.items()]
    + [DATE_NOTE, SEED_HOW, SEED_DONE],
    ["Open each unit's Maintenance tab and read the Mileage card's Measured from N visits, the current reading and its date.",
     "Compare each N with your own count of readings that take part in at least one usable pair."],
    ["510 (control) reads Measured from 3 visits: both pairs are usable.",
     "511 reads 2 visits: the last pair, 3 days apart, is under seven days and is dropped.",
     "512 reads 2 visits: the last reading did not go up, so its pair is dropped; 301,500 is still shown as the current reading.",
     "513 reads 2 visits: the last pair adds 38,000 in 20 days (1,900 a day, above 1,500), so it is dropped; 340,000 is still kept and shown.",
     "514 reads 2 visits: the last two readings are 410 days apart, more than a year, so that pair is not used.",
     "Readings dated in the future or in an impossible year are dropped before anything runs. Reset date can never be in the future, so they "
     "cannot be entered by hand: record that part as not checked by hand."],
    [Q("S11-R23"), Q("S11-R25", "Measured from N visits, where a card shows it, counts the readings that took part in at least one usable pair"),
     Q("S11-R4"), Q("S11-R5"), Q("S11-R19"), Q("S11-R20"), Q("S11-R6"), SEED_Q],
    "S11-R19 was rewritten on 5 Oct (one ceiling of 1,500 mileage or 24 engine hours a day). Coordinator decision (B1): one seeded unit per guard "
    "plus a control, so each guard is seen on its own (Measured from N visits drops from 3 to 2).",
    anchors_changed=["S11-R19 (rewritten)"])

# ---------------------------------------------------------------- C204127 never cached; correction recomputes
RH = [(100, 333_000, None), (70, 335_100, None), (40, 338_100, None), (10, 341_100, None)]
check_rows(RH)
assert (341_100 - 333_000) / 90 == 90 and (342_000 - 333_000) / 90 == 100
upd(204127, "Correcting a reading recomputes the rate at once", ["S11", "S10"],
    [LOGIN_ADMIN, SEED_SCHED, seed_unit("ZZAUTOTEST 506", False), table("ZZAUTOTEST 506", RH) + " " + DATE_NOTE, SEED_HOW,
     "Do not remove the seed schedule yet. Note the work order that carries the last reading (341,100)."],
    ["Open unit 506's Maintenance tab and read the Mileage card's rate and current estimate.",
     "Work out by hand: (341,100 − 333,000) ÷ 90 days = 90 a day = 630 a week; estimate 341,100 + 90 × 10 = 342,000.",
     "Open the work order that carries the last reading and correct its Mileage field to 342,000; save.",
     "Reopen the Maintenance tab and read the rate and current estimate again.",
     "Work out by hand: (342,000 − 333,000) ÷ 90 = 100 a day = 700 a week; estimate 342,000 + 100 × 10 = 343,000.",
     "Remove the unit from 'ZZAUTOTEST Reading seed' (Remove from schedule)."],
    ["Before the correction the card reads 630 a week and a current estimate of 342,000.",
     "Straight after the correction, without waiting overnight, it reads 700 a week and 343,000: the rate is worked out again from the stored pairs.",
     "How to correct an older reading by hand is not stated by the spec (open question); this case corrects the latest one."],
    [Q("S11-R7"), Q("S10-E3", "A correction recomputes the rate from stored pairs and moves every threshold and queued reminder"),
     PQ("Plan 1 §3.2 TD-06", "one row per (WO, meter), updated in place on each WO edit that changes the value (TD-34)", "plan1"), SEED_Q],
    "Old steps ('Build up a rate', 'Correct a reading somewhere earlier') could not be done by hand. Coordinator decision (B1): seeded readings; the "
    "correction is made on the work order that carries the reading (corrected in place, Plan 1 TD-06). Correcting an older reading is DIVERGE D17.",
    plan1="section 3.2, TD-06")

# ---------------------------------------------------------------- C204181 every cell of the confidence table
AGES = {10: "up to 30 days", 60: "31 to 90 days", 120: "91 to 180 days", 250: "181 to 365 days", 400: "over 365 days"}
def conf(age, pairs):
    if age <= 30: return "Medium" if pairs == 1 else "High"
    if age <= 90: return "Low" if pairs == 1 else ("Medium" if pairs <= 3 else "High")
    if age <= 180: return "Low" if pairs == 1 else "Medium"
    if age <= 365: return "Medium" if pairs >= 4 else "Low"
    return "Low"
def clean_rows(age, pairs, start=300_000):
    return [(age + 10 * (pairs - i), start + 1000 * i, None) for i in range(pairs + 1)]
CELLS = [(10, 1), (10, 2), (60, 1), (60, 2), (60, 4), (120, 1), (120, 2), (250, 3), (250, 4), (400, 1)]
pre181 = [LOGIN_ADMIN, SEED_SCHED, RATE_SCHED,
          "Create ten units, 'ZZAUTOTEST 520' to 'ZZAUTOTEST 529', each as follows: " + seed_unit("<unit>")]
res181 = []
for k, (age, pairs) in enumerate(CELLS):
    u = f"ZZAUTOTEST {520 + k}"
    rows = clean_rows(age, pairs); check_rows(rows)
    pre181.append(table(u, rows) + f" (last reading {age} days old, {pairs} usable pair{'s' if pairs > 1 else ''})")
    res181.append(f"{u[11:]}: last reading {age} days old ({AGES[age]}), {pairs} usable pair{'s' if pairs > 1 else ''} → {conf(age, pairs)} confidence.")
pre181 += [DATE_NOTE + " Readings are 10 days apart and add 1,000 each, so every pair is usable.", SEED_HOW, SEED_DONE]
upd(204181, "Confidence table: age of last reading × usable pairs, every cell", ["S11"],
    pre181,
    ["Open each unit's Maintenance tab and read the confidence word under PM-M's due month (and on the Mileage card).",
     "Compare each with the table: up to 30 days: 1 pair Medium, 2 or more High; 31 to 90: 1 Low, 2 or 3 Medium, 4 or more High; 91 to 180: 1 Low, "
     "2 or more Medium; 181 to 365: 4 or more Medium, fewer Low; over 365: Low.",
     "On unit 522 (60 days, 1 pair) create a new work order, type 307,000 in its Mileage field and save, but do not invoice it. Read the confidence again.",
     "Invoice that work order (Finance > Create Invoice, record the payment). Read the confidence again."],
    res181 + ["With the In the shop value 307,000 on an open work order, unit 522 still reads Low and its last reading is still 60 days old.",
              "Once that work order is invoiced, 307,000 is recorded today: unit 522 now has 2 usable pairs read today and reads High."],
    [Q("S11-R22"), Q("S11-R24"), Q("S11-R21"), SEED_Q],
    "Coordinator decision (B1): one seeded unit per cell of the confidence table, so every cell is observed (Rule 116), plus the In the shop rule.",
    section=26644)
UPD[-1]["expected_results"].append("Every grade matches the one table that ships with the specification beneath the requirements.")
UPD[-1]["custom_expected"] = expected(UPD[-1]["expected_results"], UPD[-1]["source"], UPD[-1]["quotes"])
assert (307_000 - 301_000) / 60 <= 1500

# ---------------------------------------------------------------- new: the band boundaries (Rule 116)
BOUND = [(30, 1), (31, 1), (90, 4), (91, 4), (180, 2), (181, 2), (365, 4), (366, 4)]
preB = [LOGIN_ADMIN, SEED_SCHED, RATE_SCHED, "Create eight units, 'ZZAUTOTEST 530' to 'ZZAUTOTEST 537', each as follows: " + seed_unit("<unit>")]
resB = []
for k, (age, pairs) in enumerate(BOUND):
    u = f"ZZAUTOTEST {530 + k}"
    rows = clean_rows(age, pairs); check_rows(rows)
    preB.append(table(u, rows) + f" (last reading {age} days old, {pairs} usable pair{'s' if pairs > 1 else ''})")
    resB.append(f"{u[11:]}: {age} days, {pairs} pair{'s' if pairs > 1 else ''} → {conf(age, pairs)}.")
preB += [DATE_NOTE, SEED_HOW, SEED_DONE]
assert [conf(a, p) for a, p in BOUND] == ["Medium", "Low", "High", "Medium", "Medium", "Low", "Medium", "Low"]
new("N17", "Confidence changes band exactly at 30/31, 90/91, 180/181 and 365/366 days", ["S11"],
    preB,
    ["On the day you seed, open each unit's Maintenance tab and read the confidence word under PM-M's due month.",
     "Pair the units up (530/531, 532/533, 534/535, 536/537) and check each pair changes band between its two ages."],
    resB + ["Each age is counted in whole days up to today at the location chosen in the header."],
    [Q("S11-R24", "By age of the last recorded reading, then usable pairs. Up to 30 days: one pair Medium, two or more High. 31 to 90 days: one pair "
                  "Low, two or three Medium, four or more High. 91 to 180 days: one pair Low, two or more Medium. 181 to 365 days: four or more "
                  "Medium, fewer Low. Over 365 days: Low"),
     Q("S12-R14", "Today is the day of the location the user is working in, as chosen in the header"), SEED_Q],
    "Rule 116 boundaries: the existing table case shows one unit inside each band; this case checks each band edge, using the seeding route "
    "(coordinator decision B1).", section=26644)

# ---------------------------------------------------------------- C204182 worked examples (S11-E5)
E1 = [(31, 300_000, None), (1, 303_000, None)]
E2 = [(120 + 20 * (5 - i), 300_000 + 2000 * i, None) for i in range(6)]
E3 = [(243 + 91 * (11 - i), 200_000 + 9100 * i, None) for i in range(12)]
E4 = [(425 + 91 * (11 - i), 200_000 + 9100 * i, None) for i in range(12)]
E0 = [(10, 300_000, None)]
for r in (E1, E2, E3, E4): check_rows(r)
in3 = [r for r in E3 if r[0] <= 730]; assert len(in3) == 6 and conf(243, 5) == "Medium" and conf(425, 3) == "Low" and conf(120, 5) == "Medium"
upd(204182, "Confidence worked examples: visits and age together decide the grade", ["S11"],
    [LOGIN_ADMIN, SEED_SCHED, RATE_SCHED, "Create five units, 'ZZAUTOTEST 540' to 'ZZAUTOTEST 544', each as follows: " + seed_unit("<unit>"),
     table("ZZAUTOTEST 540", E0) + " (one visit)",
     table("ZZAUTOTEST 541", E1) + " (two visits, the last one yesterday)",
     table("ZZAUTOTEST 542", E2) + " (six visits, five pairs, the last 120 days old)",
     table("ZZAUTOTEST 543", E3) + " (twelve visits about three months apart over three years, the last 243 days, about eight months, old)",
     table("ZZAUTOTEST 544", E4) + " (the same pattern as 543, but the last visit fourteen months, 425 days, ago)",
     DATE_NOTE, SEED_HOW, SEED_DONE],
    ["Open each unit's Maintenance tab and read the confidence under PM-M's due month, or what the row shows instead.",
     "For 543, count by hand the readings from the last 24 months (730 days): the six from 243 to 698 days ago, giving five pairs."],
    ["540, one visit: nothing is computed; the row reads No data and the calendar governs (one usable pair is the floor).",
     "541, two visits, the last yesterday: one pair, under 30 days → Medium.",
     "542, six visits, five pairs, last reading 120 days old → Medium.",
     "543, twelve visits over three years, the last eight months ago → Medium (five usable pairs inside 24 months, 181 to 365 days old).",
     "544, the same unit fourteen months after its last visit → Low.",
     "A unit whose every reading is older than 24 months reads No data and the calendar governs (checked in the 24-month cut-off case)."],
    [Q("S11-E5"), Q("S11-E2"), SEED_Q],
    "Coordinator decision (B1): each of the spec's worked examples is seeded literally ('the same unit fourteen months after' is reproduced as a second "
    "unit with the same visits shifted back six months, because a tester cannot wait).", section=26644)

# ---------------------------------------------------------------- C204183 a discarded pair lowers the grade
CL = [(100, 300_000, None), (90, 301_000, None), (80, 302_000, None), (70, 303_000, None), (60, 304_000, None)]
BD = [(100, 300_000, None), (90, 301_000, None), (80, 302_000, None), (77, 302_300, None), (60, 304_000, None)]
check_rows(CL); check_rows(BD); assert conf(60, 4) == "High" and conf(60, 3) == "Medium"
upd(204183, "A dropped pair lowers the usable-pair count and so the confidence", ["S11"],
    [LOGIN_ADMIN, SEED_SCHED, RATE_SCHED, "Create units 'ZZAUTOTEST 545' and 'ZZAUTOTEST 546', each as follows: " + seed_unit("<unit>"),
     table("ZZAUTOTEST 545", CL) + " (five clean visits, four pairs)",
     table("ZZAUTOTEST 546", BD) + " (five visits; the 4th is only 3 days after the 3rd)", DATE_NOTE, SEED_HOW, SEED_DONE],
    ["Open each unit's Maintenance tab and read the confidence under PM-M's due month.",
     "Count the usable pairs by hand: 545 has four; 546 has three, because its 3-day pair is dropped."],
    ["545, five clean visits, last reading 60 days old, four pairs → High.",
     "546, five visits with one pair under seven days → three usable pairs → Medium: one grade lower than the clean history.",
     "The dropped pair is not counted; the visits themselves are kept."],
    [Q("S11-R23"), Q("S11-R4"), SEED_Q],
    "Coordinator decision (B1): seeded readings make the 'five visits, one bad pair' example exact.", section=26644)

# ---------------------------------------------------------------- C204184 rounding
RR = [(30, 340_000, 6_000), (20, 341_000, 6_100), (10, 342_040, 6_203)]
check_rows(RR)
m_est = 342_040 + (342_040 - 340_000) / 20 * 10; h_est = 6_203 + (6_203 - 6_000) / 20 * 10
assert m_est == 343_060 and abs(h_est - 6_304.5) < 1e-9
upd(204184, "Estimates round: mileage to the nearest 100, hours to the nearest 10", ["S11"],
    [LOGIN_ADMIN, SEED_SCHED, seed_unit("ZZAUTOTEST 547", False), table("ZZAUTOTEST 547", RR) + " " + DATE_NOTE, SEED_HOW, SEED_DONE],
    ["Open unit 547's Maintenance tab and read the Mileage card: last recorded value and current estimate.",
     "Work out by hand: rate (342,040 − 340,000) ÷ 20 = 102 a day; estimate 342,040 + 102 × 10 = 343,060.",
     "Read the Engine hours card the same way.",
     "Work out by hand: rate (6,203 − 6,000) ÷ 20 = 10.15 a day; estimate 6,203 + 101.5 = 6,304.5."],
    ["The mileage estimate shows 343,100 (343,060 rounded to the nearest 100).",
     "The engine hours estimate shows 6,300 (6,304.5 rounded to the nearest 10).",
     "The recorded readings show exactly as entered: 342,040 and 6,203, not rounded."],
    [Q("S11-R12"), SEED_Q],
    "Coordinator decision (B1): seeded readings give estimates that land between rounding steps, so rounding can be seen.", section=26644)

# ---------------------------------------------------------------- C204185 24-month cut-off
RX = [(800, 300_000, None), (780, 302_000, None), (760, 304_000, None)]
RY = [(760, 300_000, None), (740, 302_000, None), (720, 304_000, None), (700, 306_000, None)]
check_rows(RX); check_rows(RY)
upd(204185, "24-month cut-off: readings older than two years give No data", ["S11"],
    [LOGIN_ADMIN, SEED_SCHED, RATE_SCHED, "Create units 'ZZAUTOTEST 548' and 'ZZAUTOTEST 549', each as follows: " + seed_unit("<unit>"),
     table("ZZAUTOTEST 548", RX) + " (every reading more than 24 months, 730 days, old)",
     table("ZZAUTOTEST 549", RY) + " (only the last two readings are inside 24 months)", DATE_NOTE, SEED_HOW, SEED_DONE],
    ["Open unit 548's Maintenance tab and read the Mileage card and PM-M's due date.",
     "Open unit 549's Maintenance tab and read the same."],
    ["548 reads No data: none of its readings is used for a rate or counted as a pair, and PM-M is carried by the calendar (due Oct 2027 for a run "
     "on 6 Oct 2026), exactly as for a unit never read.",
     "549 has an estimate built from its one pair inside 24 months only (Measured from 2 visits); its last reading is 700 days old, so it reads Low."],
    [Q("S11-R26"), Q("S11-R23", "Only readings from the last 24 months count, per S11-R26"), SEED_Q],
    "Coordinator decision (B1): Reset dates more than 24 months back seed readings older than the cut-off; a second unit straddles it.",
    section=26644)

# ---------------------------------------------------------------- C204186 earliest candidate; compliance End date
RM = [(25, 343_000, None), (15, 344_000, None), (5, 345_000, None)]
check_rows(RM)
due_m = TODAY + _dt.timedelta(days=-5 + (350_000 - 345_000) / 100)
assert due_m == _dt.date(2026, 11, 20)
upd(204186, "Due date: the earliest candidate wins; compliance is due on its End date", ["S12"],
    [LOGIN_ADMIN, SEED_SCHED,
     "In Settings > Maintenance create a schedule 'ZZAUTOTEST Due PM' with service 'PM-M' (Distance trigger At 350,000 mileage, Calendar trigger "
     "Every 12 months) and a compliance service 'CVIP' with a 12-month term and Remind before expiry of 1 month. Save.",
     "Create unit 'ZZAUTOTEST 550' as follows: " + seed_unit("ZZAUTOTEST 550", False) + " Enroll it on 'ZZAUTOTEST Due PM' too, with PM-M last done today.",
     table("ZZAUTOTEST 550", RM) + " " + DATE_NOTE, SEED_HOW, SEED_DONE,
     "Create four more units, 'ZZAUTOTEST 551' to 'ZZAUTOTEST 554', enroll each on 'ZZAUTOTEST Due PM', and on each Maintenance tab press Add record for "
     "CVIP with Term 12 months and Start date: 551 = 26 Oct 2025 (End 26 Oct 2026, inside the month before expiry); 552 = 6 Oct 2025 (End today); "
     "553 = 5 Oct 2025 (End yesterday); 554 = 26 Dec 2025 (End 26 Dec 2026, more than a month away)."],
    ["Open unit 550's Maintenance tab and read PM-M's Due cell and the trigger beneath it; open the row menu and read the other candidate.",
     "Work out by hand: rate (345,000 − 343,000) ÷ 20 = 100 a day; 350,000 − 345,000 = 5,000 to go = 50 days after the last reading "
     "(1 Oct 2026) = 20 Nov 2026. The calendar candidate is 6 Oct 2027.",
     "Open units 551 to 554 and read CVIP's due date and badge on each."],
    ["PM-M's Due cell shows Nov 2026 from the mileage estimate, the earlier of its two candidates; the row menu lists the calendar candidate (Oct 2027).",
     "551: CVIP is due on 26 Oct 2026, its End date, and reads due soon (inside its Remind before expiry).",
     "552: CVIP is due today, its End date.",
     "553: CVIP is overdue from the day after its End date (End 5 Oct 2026).",
     "554: CVIP shows its End date, 26 Dec 2026, with no due badge yet."],
    [Q("S12-R5"), Q("S12-R4"), Q("S12-R7", "the row menu lists every other candidate with its date and trigger"), SEED_Q],
    "Coordinator decision (B1): seeded readings give an exact meter candidate; certificates with chosen Start dates put CVIP at each state on the day.",
    section=26644)

# ---------------------------------------------------------------- C204187 work date, not paperwork date (step after invoicing)
upd(204187, "Next due counts from the Work done date chosen in the step, not the invoice", ["S18"],
    [LOGIN_ADMIN, SCHED, ENROLL, NEWWO, PANEL, ADDSVC, "On the Lines tab complete every PM-A line today."],
    ["Open the Finance tab and press Create Invoice.",
     "In When was the maintenance done? change PM-A's Work done date to 14 Sep 2026 and read the next due shown for it.",
     "Change the date again to 1 Aug 2026 and read the next due again.",
     "Press Confirm dates and record the payment. Open the asset's Maintenance tab and read PM-A."],
    ["The proposed date can be edited and names the day the work was done.",
     "With 14 Sep 2026 the next due follows PM-A's interval of 6 months: Mar 2027; changed to 1 Aug 2026 it updates at once to Feb 2027 (if the step "
     "shows no next due, check it on the Maintenance tab after confirming).",
     "After confirming, PM-A counts from 1 Aug 2026, not from the invoice date (today): its next due is Feb 2027."],
    [Q("S18-R14")],
    "Old precondition 'you can seed exact dated readings' did not apply and the steps were abstract. Rewritten click by click; the Monday example "
    "(S18-E8) stays in C204170, so this case keeps one behaviour.", section=26644)

# ---------------------------------------------------------------- C204128 / C204131 (useful extras)
upd(204128, "Confidence reads Low, Medium or High; No data is its own state", ["S11"],
    [LOGIN_ADMIN, SEED_SCHED, RATE_SCHED, "Create units 'ZZAUTOTEST 560' to 'ZZAUTOTEST 562' as follows: " + seed_unit("<unit>"),
     table("ZZAUTOTEST 560", clean_rows(10, 2)) + " (High)", table("ZZAUTOTEST 561", clean_rows(10, 1)) + " (Medium)",
     table("ZZAUTOTEST 562", clean_rows(60, 1)) + " (Low)", DATE_NOTE, SEED_HOW, SEED_DONE,
     "Create unit 'ZZAUTOTEST 563' with no mileage at all and enroll it on 'ZZAUTOTEST Rate PM' with PM-M last done today."],
    ["Open units 560, 561 and 562 and read the confidence under PM-M's due month and on the Mileage card.",
     "Read how each reading itself is labelled (recorded or estimated).",
     "Open unit 563 and read PM-M's row and the Mileage card."],
    ["560 reads High, 561 Medium and 562 Low confidence: one of three grades for the estimate.",
     "The readings themselves are labelled recorded or estimated, never Low, Medium or High.",
     "563 shows no confidence grade: it is in No data, the calendar governs PM-M and the row says the meter has no basis yet."],
    [Q("S11-R8"), Q("S11-R17"), SEED_Q],
    "Coordinator decision (B1, 'where useful'): seeded units show each grade side by side; the old precondition ('has a mileage reading history') "
    "did not say how to reach each state.")
assert conf(10, 2) == "High" and conf(10, 1) == "Medium" and conf(60, 1) == "Low"

RD = [(80, 296_000, 6_000), (70, 297_000, 6_100), (20, 302_000, None), (10, 303_000, None)]
check_rows(RD); assert conf(10, 3) == "High" and conf(70, 1) == "Low"
upd(204131, "Mileage and engine hours each carry their own confidence", ["S11"],
    [LOGIN_ADMIN, SEED_SCHED, RATE_SCHED, seed_unit("ZZAUTOTEST 564"), table("ZZAUTOTEST 564", RD) + " " + DATE_NOTE, SEED_HOW, SEED_DONE],
    ["Open unit 564's Maintenance tab and read the confidence on the Mileage card and on the Engine hours card."],
    ["Mileage: three usable pairs, the last reading 10 days old → High.",
     "Engine hours: one pair (the hours were typed on the first two work orders only), the last reading 70 days old → Low.",
     "The two grades differ because each meter is graded on its own readings."],
    [Q("S11-R10"), Q("S10-N6", "A reading on a work order counts only when someone entered or changed the value on that work order"), SEED_Q],
    "Coordinator decision (B1, 'where useful'): one seeded unit whose two meters have different histories.")
