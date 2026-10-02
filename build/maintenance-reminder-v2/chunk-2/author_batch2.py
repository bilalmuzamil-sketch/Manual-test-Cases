# -*- coding: utf-8 -*-
"""Chunk-2 batch 2: S11 Rate, estimate and confidence (26637)."""
import sys,os
sys.path.insert(0,os.path.dirname(__file__))
import mr2_lib as M
S="SV-10568"; L="S11, Rate, estimate and confidence"; P="Part 2 / S11"
pre=["You are signed in as a user with View customers, on the build under test. The Maintenance Reminders feature is on (maintenance_reminders flag).",
 "An asset is enrolled on a schedule with a mileage-triggered service and has a mileage reading history (e.g. unit 'ZZAUTOTEST Truck 12').",
 "Open the asset's Maintenance tab (the same estimate shows on the worklist and the work-order panel)."]

M.add(26637,"Estimate carries the last reading forward at a rate from the unit's own data",S,L,P,
 pre,
 ["Read a mileage-triggered service's estimated due date on the asset tab.","Confirm it is the last recorded reading projected forward at the unit's own rate.",
  "Add some readings from imported history and some from work orders; confirm both feed the estimate.","On a unit with no usable pair, confirm there is no estimate and the calendar carries the service."],
 ["An estimate is the last recorded reading carried forward at a computed rate.",
  "Readings from imported history and from work orders are both used.",
  "The rate is measured from the unit's own readings and nothing else; without a usable pair there is no rate and no estimate - the calendar carries the service and the row says the meter has no basis yet."],
 [("S11-R1","An estimate will be the last recorded reading carried forward at a computed rate"),
  ("S11-R3","Readings from imported history and from work orders will both be used"),
  ("S11-R14","A rate is measured from the unit's own readings and from nothing else. Without a usable pair there is no rate and no estimate: the calendar carries the service and the row says the meter has no basis yet. Comparing a meter against itself holds whichever distance unit a shop counts in, which a supplied figure cannot")])

M.add(26637,"The rate uses the unit's last three usable pairs over the days they span",S,L,P,
 pre,
 ["Give the unit more than three usable pairs of readings.","Confirm the rate uses only the last three pairs (older pairs ignored), as one summed period over the summed days.",
  "On a unit with one or two usable pairs, confirm all of them are used."],
 ["The rate is what the meter added across the unit's last three usable pairs, divided by the days those pairs span (the three intervals summed and read as one period).",
  "Older pairs are not used.","With one or two usable pairs, all of them are used."],
 [("S11-R2","The rate is what the meter added across the unit's last three usable pairs, divided by the days those pairs span: the three intervals are added together and read as one period. Older pairs are not used. With one or two usable pairs, all of them are used. A newer interval counts more simply because only the latest ones are taken")])

M.add(26637,"A usable pair, and the guards that discard pairs from the rate",S,L,P,
 pre,
 ["Create pairs that break each guard: less than 7 days apart; the reading did not increase; a future/impossible date; an implausibly high jump; two readings more than a year apart; readings older than 24 months.",
  "Confirm each such pair is discarded for the rate while the reading itself is kept and shown.","Check the usable-pair count drops with each discarded pair."],
 ["A usable pair is two consecutive readings that survive the guards, after impossible readings are removed, and only from the last 24 months.",
  "Pairs under 7 days apart, pairs where the reading did not increase, pairs beyond a plausible rate, and pairs more than a year apart are all discarded for rate purposes; the reading itself is kept and shown.",
  "Readings dated in the future or in an impossible year are discarded before anything runs.",
  "Where a guard discards a pair the usable-pair count drops with it."],
 [("S11-R23","A usable pair is two consecutive readings that survive the guards in S11-R4, S11-R5, S11-R19 and S11-R20, after S11-R6 has removed impossible readings. Only readings from the last 24 months count, per S11-R26. No usable pair is No data. In a clean history one pair is two visits, two or three pairs are three or four visits, and four or more pairs are five or more visits. Where a guard discards a pair the count drops with it"),
  ("S11-R4","Pairs less than seven days apart will be discarded"),
  ("S11-R5","Pairs where the reading did not increase will be discarded"),
  ("S11-R6","Readings dated in the future or in an impossible year will be discarded before anything runs"),
  ("S11-R19","A pair producing a rate beyond what that class of unit can plausibly accrue is discarded for rate purposes. The reading itself is kept and shown; nothing is refused at entry"),
  ("S11-R20","A pair whose two readings sit more than a year apart is not used for a rate. It averages across too long a span to describe what the unit is doing now")])

M.add(26637,"The rate is never cached; a correction anywhere recomputes it",S,L,P,
 pre,
 ["Build up a rate from several readings.","Correct a reading somewhere earlier in the history.","Confirm the rate (and the estimate) recompute."],
 ["The rate is never cached incrementally.","A correction anywhere in the history recomputes it."],
 [("S11-R7","The rate will never be cached incrementally. A correction anywhere in the history recomputes it")])

M.add(26637,"Confidence is Low, Medium or High; No data is a separate state",S,L,P,
 pre,
 ["Read the confidence word shown beneath an estimate.","On a unit with nothing to estimate from, read what shows instead."],
 ["Confidence is one of Low, Medium or High and grades an estimate (it is not the vocabulary used for a reading's own state).",
  "No data is a separate state, not a confidence level; it applies where there is nothing to estimate from, the calendar governs, and the row says the meter has no basis yet."],
 [("S11-R8","Confidence will be one of `Low`, `Medium`, `High`. It grades an estimate, and is deliberately not the vocabulary used for a reading's own state in S9-R2"),
  ("S11-R17","`No data` is a separate state, not a confidence level. It applies where there is nothing to estimate from, the calendar governs, and the row says the meter has no basis yet")])

M.add(26637,"Estimated due date shows a month + confidence; exact date only if recorded",S,L,P,
 pre,
 ["Read an estimated due date and the confidence beneath it.","Confirm an estimate shows a month (not an exact day) at every confidence.","Find a due date that comes from a recorded reading."],
 ["Every estimated due date shows a month, at every confidence, with its confidence beneath it (High, Medium or Low confidence).",
  "A due or overdue service shows its badge and still its month.",
  "An exact date belongs to a recorded reading alone."],
 [("S11-R9","Every estimated due date shows a month, at every confidence, with its confidence beneath it as the meter and a word: High, Medium or Low confidence. The rule that produced it, for example based on mileage estimate, sits in the meter's hover. A due or overdue service shows its badge and still its month. An exact date belongs to a recorded reading alone")])

M.add(26637,"How each source renders: meter month, certificate End date, calendar month",S,L,P,
 pre,
 ["Read an overdue row driven by a meter estimate.","Read a compliance row driven by a certificate.","Read a row driven by the calendar.","Check each names the rule that produced it."],
 ["An overdue row from a meter estimate shows its estimated month and carries no figure at any confidence (never 'overdue by 1,200 mileage').",
  "A date from a certificate reads its End date and 'Certificate' (for example 14 Oct 2026 · Certificate).",
  "A date from the calendar reads its month and 'Calendar'.",
  "Every projected value names the rule that produced it: based on mileage, based on engine hours, based on the certificate term, or based on the calendar."],
 [("S11-R13","An overdue row derived from a meter estimate shows its estimated month and carries no figure at any confidence: never overdue by 1,200 mileage. A date from a certificate reads its End date and Certificate, for example 14 Oct 2026 · Certificate, because the certificate names the day. A date from the calendar reads its month and Calendar"),
  ("S11-R11","Every projected value will name the rule that produced it: based on mileage, based on engine hours, based on the certificate term, based on the calendar")])

M.add(26637,"Distance and engine hours each carry their own confidence",S,L,P,
 pre,
 ["On a unit with both mileage and engine-hours history, read the confidence on a mileage-driven date and on an hours-driven date.","Confirm they are computed independently."],
 ["Distance and engine hours each carry their own confidence, computed independently."],
 [("S11-R10","Distance and engine hours will each carry their own confidence, computed independently")])

M.add(26637,"Estimated values round (distance 100, hours 10); a rate reads as an accrual",S,L,P,
 pre,
 ["Read an estimated distance and an estimated hours value.","Read a recorded reading.","Read how the rate is expressed."],
 ["Estimated distance rounds to the nearest 100 and estimated hours to the nearest 10.",
  "A recorded reading is shown exactly as entered.",
  "A rate reads as an accrual without naming a unit, for example '640 a week' (the word mileage does not appear on a speculative rate)."],
 [("S11-R12","Estimated distance will round to the nearest 100 and estimated hours to the nearest 10. A recorded reading is shown exactly as entered"),
  ("S11-R18","A rate will read as an accrual without naming a unit, for example `640 a week`. The word mileage describes a unit's history, not a speculative rate, so it does not appear here")])

M.add(26637,"The meter hover: the rule, the disclaimer, and View work orders",S,L,P,
 pre,
 ["Hover (or tap) the meter beneath an estimated date.","Read the rule it gives and the line it ends with.","Find 'View work orders' and open it.","Where a card shows 'Measured from N visits', check what N counts."],
 ["The meter's hover gives the rule that produced the date (for example based on mileage estimate) and ends with: This is the system's best estimate from this unit's past readings. Check its history if in doubt.",
  "Beside it, View work orders opens the asset's Work Orders tab.",
  "'Measured from N visits' counts the readings that took part in at least one usable pair; a visit whose only pairs were discarded does not count."],
 [("S11-R27","The meter's hover ends with: This is the system's best estimate from this unit's past readings. Check its history if in doubt. Beside it, View work orders opens the asset's Work Orders tab"),
  ("S11-R25","Measured from N visits, where a card shows it, counts the readings that took part in at least one usable pair. A visit whose only pairs were discarded does not count")])

M.add(26637,"No projection is shown as fact; in Low a hand-sent reminder shows Soon",S,L,P,
 pre,
 ["Review how a projected date is presented versus a recorded one.","On a Low-confidence estimate, send a reminder by hand from the contact card and read the date it shows."],
 ["No date is ever presented as fact when it is a projection.",
  "In Low confidence, a reminder sent by hand shows 'Soon' rather than a month (the advisor may prefer to call)."],
 [("S11-N3","No date is ever presented as fact when it is a projection"),
  ("S11-N1","In Low, a reminder sent by hand shows Soon rather than a month, per S19-R9. The advisor may prefer to call")])

M.add(26637,"No data is the ordinary state; the meter gives no candidate, calendar governs",S,L,P,
 pre,
 ["On a unit with no usable meter pair (No data), confirm the meter produces no candidate and does not compete.","Confirm the calendar governs and the UI does not treat No data as missing data.","Compare how often engine hours sit in Low/No data versus distance."],
 ["In No data the meter produces no candidate at all and does not compete.",
  "No data is the ordinary state (four units in five have no meter basis) and the UI must not treat it as missing data; the calendar governs.",
  "Engine hours sit in Low and No data far more often than distance, because hours are recorded on roughly one visit in six."],
 [("S11-N2","In `No data` the meter produces no candidate at all and does not compete"),
  ("S11-E1","No data is the ordinary state. Four units in five have no meter basis, and the UI must not treat it as missing data"),
  ("S11-E4","Engine hours will sit in Low and No data far more often than distance, because hours are recorded on roughly one visit in six")])

M.save(os.path.join(os.path.dirname(__file__),"created-chunk2.json"))
