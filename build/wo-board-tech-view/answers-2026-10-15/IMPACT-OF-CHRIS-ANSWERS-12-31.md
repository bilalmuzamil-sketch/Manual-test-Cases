# WO Board & Tech View — impact of Chris Ward's answers 12–31 (sheet 1gBGmNB4…, read 15 Oct 2026)
Spec now v54 (saved CONFLUENCE-845185030-2026-10-15.md); full v52→v54 text diff read 100% (PRD-TEXT-DIFF-v52-vs-now.txt, 91
lines): new S1-R9c, S3-R5a, S5-R4a; 26 rules reworded (incl. all of Story 11). Case text from the latest known copies
(merged-cases-latest-known.json = 14 Oct snapshot + every applied after-copy); TestRail could not be read live on 15 Oct (credentials
gone after the container restart). Vladimir's cases left out (QA lead, 15 Oct).

A. Expected result changes, case already run on a build (last 8–14 Oct) → update, then RETEST on staging (16)
C96909 Q24 tooltip words · C96916 Q30 Back scroll · C96929 S2-R6 ties (atm 3) · C96935 Q20 · C368127 Q20 · C96956 Q19 · C96990 Q27 ·
C96978 Q31 full name +N (atm 3) · C97021 C97022 C368150 C368151 C368152 Q28 · C581895 Q23 (staging 14 Oct)
B. Expected result changes, never run yet → update, then FIRST run on staging (13)
C590110 Q12 · C590112 Q13 · C590115 Q15 + S6-R2a widths · C590116 C590117 Q16 · C590120 Q22 Q27 · C590122 Q17 · C590125 Q29 ·
C590128 Q18 Q27 · C590129 Q19 · C590131 Q20 · C96927 Q25 (S5-R4a)
C. Only the quoted spec wording/source changes; what the tester checks is the same → no retest (18)
C96975 C96979 C96983 C368141 C96993 C96994 C96995 C96996 (S5-R4) · C97007 C368144 C368145 (S2-R6) · C368214 (S1-R8) ·
C368163 (S4-R12) · C590111 C590113 C590114 C590119 (S1-R9a/b, S5-R4, S2-R20) · C97011 (S11-R5; Escape-cancel-drag now tech-plan
only) · C97024 (Clocked in wording)
D. New coverage: S6-R2a List pill widths = production, Tech View same widths (new case; relates to SV-11310) · S5-R4a in C96927 ·
S3-R5a in C590120 · S1-R9c in C590125. Q21, Q26 need nothing (cases already follow the PRD; minimap out of scope).
Tickets Chris says need updating: SV-11318 (16px), SV-11320 (view-only header grips, no Unassigned grip). SV-11317's "runs off
the right edge" is not a defect on its own (Q13).
