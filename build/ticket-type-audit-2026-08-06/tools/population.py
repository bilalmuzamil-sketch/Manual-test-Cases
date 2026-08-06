"""The population of tickets OUR OWN COMMITTED RECORDS claim we filed.

Derived the same way TICKET-LIST.md was (2026-08-06): from our records, NEVER from a
Jira author query -- the Jira account is SHARED with the QA lead, so `creator = us`
also returns tickets HE created (Standing Rule 53's corollary).

The 66 of TICKET-LIST.md are the base. THREE LATER BATCHES were filed after that list
was written and are added here, because auditing a stale population is exactly the
failure Standing Rule 31's lesson warns about.
"""

# --- The 66 of build/ticket-source-blocks-2026-08-06/TICKET-LIST.md -----------------
REPORT_SUITE_DEFECT_PACK = ["SV-8818", "SV-8819", "SV-8820", "SV-8821", "SV-8822", "SV-8823"]
REPORT_SUITE_APPROVED_WRITES = ["SV-8879", "SV-8880", "SV-8881"]
REPORT_SUITE_CHRIS_NEWREQS = ["SV-8907", "SV-8908"]
REPORT_SUITE_FULLVIU_S1 = [
    "SV-8925", "SV-8926", "SV-8927", "SV-8928", "SV-8929", "SV-8930", "SV-8931",
    "SV-8932", "SV-8934", "SV-8935", "SV-8936", "SV-8937", "SV-8938", "SV-8939",
    "SV-8940", "SV-8943", "SV-8944", "SV-8945", "SV-8946", "SV-8947", "SV-8948",
    "SV-8949", "SV-8950", "SV-8951", "SV-8952", "SV-8953", "SV-8954", "SV-8955",
    "SV-8956",
]
SCHEDULE_VIU_0804 = [
    "SV-8848", "SV-8849", "SV-8850", "SV-8851", "SV-8852", "SV-8853", "SV-8854",
    "SV-8855", "SV-8856", "SV-8857",
]
SCHEDULE_FINALVIU = ["SV-8886"]
SCHEDULE_FULLVIU = ["SV-8923", "SV-8924", "SV-8933", "SV-8941"]
SCHEDULE_HANDOFF = ["SV-8942", "SV-8957", "SV-8958", "SV-8959"]
FILTERS_VIU_0804 = ["SV-8843", "SV-8844", "SV-8845", "SV-8846", "SV-8847"]
FILTERS_RECHECK = ["SV-8871"]
FILTERS_FULLVIU = ["SV-8912"]

# --- Filed AFTER TICKET-LIST.md was written (same day) ------------------------------
# build/report-suite/full-viu-2026-08-06/testrail-execution-log-session2.md
REPORT_SUITE_FULLVIU_S2 = [
    "SV-8962", "SV-8963", "SV-8964", "SV-8965", "SV-8966",
    "SV-8967", "SV-8968", "SV-8969", "SV-8970",
]
# build/report-suite/full-viu-2026-08-06/FILED-SESSION3.md
REPORT_SUITE_FULLVIU_S3 = [
    "SV-8972", "SV-8973", "SV-8974", "SV-8975", "SV-8976", "SV-8977",
    "SV-8978", "SV-8979", "SV-8980", "SV-8981", "SV-8982", "SV-8983",
]

PROVENANCE = [
    ("Report Suite", "build/report-suite/defect-pack-2026-08-04/FILED.md", REPORT_SUITE_DEFECT_PACK),
    ("Report Suite", "build/report-suite/approved-writes-2026-08-05/TASK-C-TICKETS-FILED.md", REPORT_SUITE_APPROVED_WRITES),
    ("Report Suite", "build/report-suite/chris-newreqs-2026-08-05/FILED.md", REPORT_SUITE_CHRIS_NEWREQS),
    ("Report Suite", "build/report-suite/full-viu-2026-08-06/FILED.md", REPORT_SUITE_FULLVIU_S1),
    ("Report Suite", "build/report-suite/full-viu-2026-08-06/testrail-execution-log-session2.md", REPORT_SUITE_FULLVIU_S2),
    ("Report Suite", "build/report-suite/full-viu-2026-08-06/FILED-SESSION3.md", REPORT_SUITE_FULLVIU_S3),
    ("Schedule", "build/schedule/READINESS-2026-08-04.md", SCHEDULE_VIU_0804),
    ("Schedule", "build/schedule/final-viu-2026-08-05/FILED.md", SCHEDULE_FINALVIU),
    ("Schedule", "build/schedule/full-viu-2026-08-05/FILED.md", SCHEDULE_FULLVIU),
    ("Schedule", "build/schedule/full-viu-2026-08-05/TICKET-SOURCE-BLOCK-REQUIREMENT.md", SCHEDULE_HANDOFF),
    ("Filters", "build/filters/viu-2026-08-04/FILED.md", FILTERS_VIU_0804),
    ("Filters", "build/filters/recheck-2026-08-05/FILED.md", FILTERS_RECHECK),
    ("Filters", "build/filters/full-viu-2026-08-05/FILED.md", FILTERS_FULLVIU),
]

PROJECT_OF = {}
RECORD_OF = {}
for _proj, _rec, _keys in PROVENANCE:
    for _k in _keys:
        PROJECT_OF[_k] = _proj
        RECORD_OF[_k] = _rec

ALL = sorted(PROJECT_OF, key=lambda k: int(k.split("-")[1]))

# The 66 that TICKET-LIST.md itself enumerated, kept separate so the report can be
# honest about which rows are the newer additions.
IN_TICKET_LIST = set(
    REPORT_SUITE_DEFECT_PACK + REPORT_SUITE_APPROVED_WRITES + REPORT_SUITE_CHRIS_NEWREQS
    + REPORT_SUITE_FULLVIU_S1 + SCHEDULE_VIU_0804 + SCHEDULE_FINALVIU + SCHEDULE_FULLVIU
    + SCHEDULE_HANDOFF + FILTERS_VIU_0804 + FILTERS_RECHECK + FILTERS_FULLVIU
)

if __name__ == "__main__":
    print(f"population {len(ALL)}  (TICKET-LIST.md {len(IN_TICKET_LIST)}, "
          f"added since {len(ALL) - len(IN_TICKET_LIST)})")
    for k in ALL:
        print(k, PROJECT_OF[k], "" if k in IN_TICKET_LIST else "[added since]")
