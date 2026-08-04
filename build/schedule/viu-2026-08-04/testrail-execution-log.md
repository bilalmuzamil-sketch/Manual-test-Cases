# Schedule — TestRail execution log, 2026-08-04 live VIU

**Manifest header: EXECUTED.** Operation type: **`update_case` ONLY**. No `add_case`, no
`delete_case`, no `add_section`, no run write.

## Totals

| | |
|---|---|
| operations | **169** |
| distinct cases touched | **165** |
| HTTP 200 | **169** |
| any other status | **0** |
| byte-verified **MATCH** | **169** |
| byte-verified MISMATCH | **0** |
| fields compared per operation | **28** (identical on every op) |

## The verification, per Standing Rule 50

Per operation, in order:

1. **re-GET** the case and prove it still byte-matches the pre-write snapshot
   (`snapshots/pre-write-cases.json`) — a drift check, so nothing written on top of someone
   else's change.
2. `update_case` with **only** the intended field (`custom_expected`).
3. **re-GET** and compare **every** field: the intended field byte-equal to the intended value,
   and **every other field byte-identical to the pre-write snapshot** (only `updated_on` and
   `updated_by` excepted as server-volatile).
4. A mismatch would mean **the write FAILED** — the batch stops and both byte sequences are
   dumped. **This did not happen: 0 mismatches in 169 operations.**

**Declared normalisation** (the only one, recorded in `APP-ACTIONS-PLAYBOOK.md` §J): TestRail's
`refs` splits on commas, trims each entry and rejoins with a bare comma. This pass wrote no
`refs`; the comparison honours the normalisation anyway.

**Rule 38:** the executor refuses any case whose `created_by` is not 3. All 165 passed that check,
so no foreign case was touched — there are none under group 4254 in any case.

## What was written into each case

- the **Standing Rule 54 provenance line, re-stamped to state 2** — naming the build date AND the
  build marker (`the build tested on 8/4/2026 (v3.5-4873abe)`), the epic, the specification version
  and the case's own § anchors. The stamper is **idempotent**: verified live afterwards that all
  165 carry the new line and that **not one carries it twice**.
- an **honesty variant** where the case does not rest plainly on the spec: 6 cases cite the
  engineering technical plan and say in words that no numbered requirement covers them; 5 say the
  behaviour follows a later product-owner decision and name the file it is recorded in; 4 say the
  specification states the point two different ways and a decision is still awaited.
- a **known-issue block** on every DEVIATION and NOT-BUILT case, in plain words, with the Jira link
  and an instruction on whether to mark the test failed or blocked.
- the **mandated wording verbatim** on the two HELD cases: *"DO NOT AUTOMATE YET: this behaviour is
  waiting on an answer from the product owner. Automating it now could lock in the wrong
  behaviour."*
- a **full replacement** of the expected result on the two cases where OUR text was wrong and the
  build was right (SCH-SCOPE-05 = C29967, SCH-LINE-03 = C29950).

## Run 357 — proven untouched, not assumed

| | before | after |
|---|---|---|
| `include_all` | false | false |
| tests | 165 | 165 |
| result records | 429 | 429 |

- the two `case_id` sets are **equal in both directions** (0 only-before, 0 only-after)
- **all 429 prior result records are present BY ID**, and there are **0 new** ones
- no case was added or retired, so no `update_run` union was needed (Rules 34 / 47)

## Per-operation records

| # | case | C-id | verdict | HTTP | fields compared | verification |
|---|---|---|---|---|---|---|
| 1 | SCH-NAV-01 | C29925 | PASS | 200 | 28 | MATCH |
| 2 | SCH-NAV-03 | C29927 | PASS | 200 | 28 | MATCH |
| 3 | SCH-NAV-04 | C29928 | PASS | 200 | 28 | MATCH |
| 4 | SCH-NAV-05 | C29929 | PASS | 200 | 28 | MATCH |
| 5 | SCH-NAV-06 | C29930 | PASS | 200 | 28 | MATCH |
| 6 | SCH-NAV-07 | C29931 | PASS | 200 | 28 | MATCH |
| 7 | SCH-MCAL-01 | C29932 | PASS | 200 | 28 | MATCH |
| 8 | SCH-MCAL-02 | C29933 | PASS | 200 | 28 | MATCH |
| 9 | SCH-MCAL-03 | C29934 | PASS | 200 | 28 | MATCH |
| 10 | SCH-MCAL-04 | C29935 | PASS | 200 | 28 | MATCH |
| 11 | SCH-WOL-01 | C29936 | PASS | 200 | 28 | MATCH |
| 12 | SCH-WOL-02 | C29937 | PASS | 200 | 28 | MATCH |
| 13 | SCH-WOL-04 | C29939 | PASS | 200 | 28 | MATCH |
| 14 | SCH-WOL-05 | C29940 | PASS | 200 | 28 | MATCH |
| 15 | SCH-WOL-06 | C29941 | PASS | 200 | 28 | MATCH |
| 16 | SCH-FILT-01 | C29942 | PASS | 200 | 28 | MATCH |
| 17 | SCH-FILT-02 | C29943 | PASS | 200 | 28 | MATCH |
| 18 | SCH-FILT-03 | C29944 | PASS | 200 | 28 | MATCH |
| 19 | SCH-FILT-04 | C29945 | PASS | 200 | 28 | MATCH |
| 20 | SCH-FILT-05 | C29946 | DEV | 200 | 28 | MATCH |
| 21 | SCH-FILT-06 | C29947 | PASS | 200 | 28 | MATCH |
| 22 | SCH-LINE-01 | C29948 | PASS | 200 | 28 | MATCH |
| 23 | SCH-LINE-03 | C29950 | PASS | 200 | 28 | MATCH |
| 24 | SCH-LINE-04 | C29951 | PASS | 200 | 28 | MATCH |
| 25 | SCH-LINE-05 | C29952 | PASS | 200 | 28 | MATCH |
| 26 | SCH-LINE-06 | C29953 | PASS | 200 | 28 | MATCH |
| 27 | SCH-LINE-07 | C29954 | PASS | 200 | 28 | MATCH |
| 28 | SCH-DND-01 | C29955 | PASS | 200 | 28 | MATCH |
| 29 | SCH-DND-02 | C29956 | PASS | 200 | 28 | MATCH |
| 30 | SCH-DND-03 | C29957 | PASS | 200 | 28 | MATCH |
| 31 | SCH-DND-04 | C29958 | PASS | 200 | 28 | MATCH |
| 32 | SCH-DND-05 | C29959 | PASS | 200 | 28 | MATCH |
| 33 | SCH-DND-06 | C29960 | DEV | 200 | 28 | MATCH |
| 34 | SCH-DND-07 | C29961 | PASS | 200 | 28 | MATCH |
| 35 | SCH-DND-08 | C29962 | NOTBUILT | 200 | 28 | MATCH |
| 36 | SCH-SCOPE-01 | C29963 | PASS | 200 | 28 | MATCH |
| 37 | SCH-SCOPE-02 | C29964 | PASS | 200 | 28 | MATCH |
| 38 | SCH-SCOPE-03 | C29965 | PASS | 200 | 28 | MATCH |
| 39 | SCH-SCOPE-05 | C29967 | PASS | 200 | 28 | MATCH |
| 40 | SCH-START-01 | C29969 | PASS | 200 | 28 | MATCH |
| 41 | SCH-START-02 | C29970 | EXT | 200 | 28 | MATCH |
| 42 | SCH-START-03 | C29971 | PASS | 200 | 28 | MATCH |
| 43 | SCH-START-04 | C29972 | PASS | 200 | 28 | MATCH |
| 44 | SCH-START-05 | C29973 | PASS | 200 | 28 | MATCH |
| 45 | SCH-START-06 | C29974 | PASS | 200 | 28 | MATCH |
| 46 | SCH-START-07 | C29975 | PASS | 200 | 28 | MATCH |
| 47 | SCH-SPREAD-02 | C29978 | PASS | 200 | 28 | MATCH |
| 48 | SCH-SPREAD-03 | C29979 | PASS | 200 | 28 | MATCH |
| 49 | SCH-SPREAD-04 | C29980 | PASS | 200 | 28 | MATCH |
| 50 | SCH-SPREAD-05 | C29981 | PASS | 200 | 28 | MATCH |
| 51 | SCH-SPREAD-06 | C29982 | DEV | 200 | 28 | MATCH |
| 52 | SCH-SPREAD-07 | C29983 | HELD | 200 | 28 | MATCH |
| 53 | SCH-SPREAD-08 | C29984 | PASS | 200 | 28 | MATCH |
| 54 | SCH-SPREAD-09 | C29985 | PASS | 200 | 28 | MATCH |
| 55 | SCH-SPREAD-10 | C29986 | PASS | 200 | 28 | MATCH |
| 56 | SCH-SPREAD-11 | C38863 | NOTBUILT | 200 | 28 | MATCH |
| 57 | SCH-SER-01 | C29987 | PASS | 200 | 28 | MATCH |
| 58 | SCH-SER-02 | C29988 | DEV | 200 | 28 | MATCH |
| 59 | SCH-SER-03 | C29989 | PASS | 200 | 28 | MATCH |
| 60 | SCH-SER-04 | C29990 | PASS | 200 | 28 | MATCH |
| 61 | SCH-BLOCK-01 | C29991 | PASS | 200 | 28 | MATCH |
| 62 | SCH-BLOCK-02 | C29992 | PASS | 200 | 28 | MATCH |
| 63 | SCH-BLOCK-05 | C29995 | PASS | 200 | 28 | MATCH |
| 64 | SCH-LANE-01 | C29996 | PASS | 200 | 28 | MATCH |
| 65 | SCH-LANE-02 | C29997 | PASS | 200 | 28 | MATCH |
| 66 | SCH-LANE-03 | C29998 | PASS | 200 | 28 | MATCH |
| 67 | SCH-LANE-04 | C29999 | DEV | 200 | 28 | MATCH |
| 68 | SCH-DAY-01 | C30001 | DEV | 200 | 28 | MATCH |
| 69 | SCH-DAY-03 | C30003 | PASS | 200 | 28 | MATCH |
| 70 | SCH-DAY-04 | C30004 | DEV | 200 | 28 | MATCH |
| 71 | SCH-DAY-05 | C30005 | PASS | 200 | 28 | MATCH |
| 72 | SCH-DAY-06 | C30006 | PASS | 200 | 28 | MATCH |
| 73 | SCH-MODAL-01 | C30008 | PASS | 200 | 28 | MATCH |
| 74 | SCH-MODAL-02 | C30009 | DEV | 200 | 28 | MATCH |
| 75 | SCH-MODAL-03 | C30010 | DEV | 200 | 28 | MATCH |
| 76 | SCH-MODAL-04 | C30011 | PASS | 200 | 28 | MATCH |
| 77 | SCH-MODAL-05 | C30012 | DEV | 200 | 28 | MATCH |
| 78 | SCH-MODAL-06 | C30013 | PASS | 200 | 28 | MATCH |
| 79 | SCH-MODAL-07 | C30014 | DEV | 200 | 28 | MATCH |
| 80 | SCH-MODAL-08 | C30015 | PASS | 200 | 28 | MATCH |
| 81 | SCH-EVT-01 | C30016 | PASS | 200 | 28 | MATCH |
| 82 | SCH-EVT-02 | C30017 | NOTBUILT | 200 | 28 | MATCH |
| 83 | SCH-EVT-03 | C30018 | PASS | 200 | 28 | MATCH |
| 84 | SCH-EVT-05 | C30020 | PASS | 200 | 28 | MATCH |
| 85 | SCH-EVT-06 | C30021 | PASS | 200 | 28 | MATCH |
| 86 | SCH-EVT-07 | C30022 | PASS | 200 | 28 | MATCH |
| 87 | SCH-EVT-08 | C30615 | PASS | 200 | 28 | MATCH |
| 88 | SCH-CONF-01 | C30023 | PASS | 200 | 28 | MATCH |
| 89 | SCH-CONF-02 | C30024 | PASS | 200 | 28 | MATCH |
| 90 | SCH-CONF-03 | C30025 | PASS | 200 | 28 | MATCH |
| 91 | SCH-CONF-05 | C30027 | PASS | 200 | 28 | MATCH |
| 92 | SCH-CONF-06 | C30028 | PASS | 200 | 28 | MATCH |
| 93 | SCH-CONF-07 | C30029 | PASS | 200 | 28 | MATCH |
| 94 | SCH-CAP-01 | C30030 | PASS | 200 | 28 | MATCH |
| 95 | SCH-CAP-02 | C30031 | PASS | 200 | 28 | MATCH |
| 96 | SCH-CAP-03 | C30032 | PASS | 200 | 28 | MATCH |
| 97 | SCH-CAP-04 | C30033 | PASS | 200 | 28 | MATCH |
| 98 | SCH-TIP-01 | C30034 | DEV | 200 | 28 | MATCH |
| 99 | SCH-TIP-02 | C30035 | PASS | 200 | 28 | MATCH |
| 100 | SCH-TIP-03 | C30036 | PASS | 200 | 28 | MATCH |
| 101 | SCH-TIP-04 | C30037 | PASS | 200 | 28 | MATCH |
| 102 | SCH-TIP-05 | C30038 | PASS | 200 | 28 | MATCH |
| 103 | SCH-TOOL-01 | C30039 | PASS | 200 | 28 | MATCH |
| 104 | SCH-TOOL-02 | C30040 | PASS | 200 | 28 | MATCH |
| 105 | SCH-TOOL-03 | C30041 | DEV | 200 | 28 | MATCH |
| 106 | SCH-VIEW-01 | C30042 | PASS | 200 | 28 | MATCH |
| 107 | SCH-VIEW-02 | C30043 | PASS | 200 | 28 | MATCH |
| 108 | SCH-VIEW-03 | C30044 | PASS | 200 | 28 | MATCH |
| 109 | SCH-VIEW-04 | C30045 | PASS | 200 | 28 | MATCH |
| 110 | SCH-VIEW-05 | C30046 | DEV | 200 | 28 | MATCH |
| 111 | SCH-VIEW-06 | C30047 | PASS | 200 | 28 | MATCH |
| 112 | SCH-VIEW-09 | C30050 | DEV | 200 | 28 | MATCH |
| 113 | SCH-VIEW-10 | C30051 | PASS | 200 | 28 | MATCH |
| 114 | SCH-REAS-01 | C30052 | PASS | 200 | 28 | MATCH |
| 115 | SCH-REAS-03 | C30054 | PASS | 200 | 28 | MATCH |
| 116 | SCH-REAS-06 | C38855 | PASS | 200 | 28 | MATCH |
| 117 | SCH-DEL-01 | C30057 | PASS | 200 | 28 | MATCH |
| 118 | SCH-DEL-02 | C30058 | PASS | 200 | 28 | MATCH |
| 119 | SCH-DEL-03 | C30059 | PASS | 200 | 28 | MATCH |
| 120 | SCH-DEL-04 | C30060 | PASS | 200 | 28 | MATCH |
| 121 | SCH-DEL-05 | C30061 | PASS | 200 | 28 | MATCH |
| 122 | SCH-DEL-06 | C30062 | PASS | 200 | 28 | MATCH |
| 123 | SCH-DEL-08 | C30064 | PASS | 200 | 28 | MATCH |
| 124 | SCH-DEL-09 | C30065 | PASS | 200 | 28 | MATCH |
| 125 | SCH-DEL-10 | C38864 | PASS | 200 | 28 | MATCH |
| 126 | SCH-KEY-01 | C30066 | DEV | 200 | 28 | MATCH |
| 127 | SCH-KEY-03 | C30068 | DEV | 200 | 28 | MATCH |
| 128 | SCH-KEY-05 | C30070 | PASS | 200 | 28 | MATCH |
| 129 | SCH-COLOR-01 | C30071 | PASS | 200 | 28 | MATCH |
| 130 | SCH-COLOR-02 | C30072 | PASS | 200 | 28 | MATCH |
| 131 | SCH-COLOR-03 | C30073 | PASS | 200 | 28 | MATCH |
| 132 | SCH-PERM-01 | C30074 | PASS | 200 | 28 | MATCH |
| 133 | SCH-PERM-02 | C30075 | PASS | 200 | 28 | MATCH |
| 134 | SCH-PERM-03 | C30076 | PASS | 200 | 28 | MATCH |
| 135 | SCH-PERM-04 | C30077 | PASS | 200 | 28 | MATCH |
| 136 | SCH-PERM-05 | C30078 | PASS | 200 | 28 | MATCH |
| 137 | SCH-PERM-06 | C30079 | PASS | 200 | 28 | MATCH |
| 138 | SCH-PERM-07 | C30080 | PASS | 200 | 28 | MATCH |
| 139 | SCH-PERM-08 | C30081 | DEV | 200 | 28 | MATCH |
| 140 | SCH-PERM-09 | C30082 | PASS | 200 | 28 | MATCH |
| 141 | SCH-PERM-10 | C30083 | PASS | 200 | 28 | MATCH |
| 142 | SCH-PERM-11 | C30084 | PASS | 200 | 28 | MATCH |
| 143 | SCH-PERM-12 | C30614 | PASS | 200 | 28 | MATCH |
| 144 | SCH-PERM-13 | C38926 | PASS | 200 | 28 | MATCH |
| 145 | SCH-EDGE-02 | C30086 | DEV | 200 | 28 | MATCH |
| 146 | SCH-EDGE-03 | C30087 | PASS | 200 | 28 | MATCH |
| 147 | SCH-EDGE-04 | C30088 | PASS | 200 | 28 | MATCH |
| 148 | SCH-EDGE-05 | C30089 | HELD | 200 | 28 | MATCH |
| 149 | SCH-EDGE-06 | C30090 | PASS | 200 | 28 | MATCH |
| 150 | SCH-EDGE-07 | C38865 | EXT | 200 | 28 | MATCH |
| 151 | SCH-EDGE-08 | C38866 | PASS | 200 | 28 | MATCH |
| 152 | SCH-HRS-02 | C38847 | PASS | 200 | 28 | MATCH |
| 153 | SCH-HRS-03 | C38848 | PASS | 200 | 28 | MATCH |
| 154 | SCH-HRS-04 | C38849 | PASS | 200 | 28 | MATCH |
| 155 | SCH-HRS-05 | C38850 | PASS | 200 | 28 | MATCH |
| 156 | SCH-HRS-06 | C38851 | PASS | 200 | 28 | MATCH |
| 157 | SCH-REG-01 | C38867 | PASS | 200 | 28 | MATCH |
| 158 | SCH-REG-02 | C38868 | PASS | 200 | 28 | MATCH |
| 159 | SCH-REG-03 | C38869 | PASS | 200 | 28 | MATCH |
| 160 | SCH-REG-04 | C38870 | PASS | 200 | 28 | MATCH |
| 161 | SCH-REG-05 | C38871 | PASS | 200 | 28 | MATCH |
| 162 | SCH-API-01 | C38872 | PASS | 200 | 28 | MATCH |
| 163 | SCH-API-02 | C38873 | NOTBUILT | 200 | 28 | MATCH |
| 164 | SCH-API-03 | C38874 | PASS | 200 | 28 | MATCH |
| 165 | SCH-API-04 | C38875 | PASS | 200 | 28 | MATCH |
| 166 | audit-fix | C29927 | AUDIT-FIX | 200 | 28 | MATCH |
| 167 | audit-fix | C29988 | AUDIT-FIX | 200 | 28 | MATCH |
| 168 | audit-fix | C30009 | AUDIT-FIX | 200 | 28 | MATCH |
| 169 | audit-fix | C30081 | AUDIT-FIX | 200 | 28 | MATCH |
