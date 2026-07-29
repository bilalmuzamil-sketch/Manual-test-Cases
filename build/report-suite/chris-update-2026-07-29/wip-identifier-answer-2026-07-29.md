# Chris Ward — WIP-identifier answer (2026-07-29) — VERBATIM

- **Source:** relayed by the user (Bilal) 2026-07-29 — Chris Ward's reply to the
  WIP-identifier question sent 2026-07-29 (question text in `ChangeList-2026-07-29.md`,
  QUESTION-PENDING-CHRIS row; options were A = WIP also switches to VIN, then Unit #,
  then plate / B = WIP keeps the serial number).
- **Authority ruling:** NEWEST source (last-update-wins) — newer than the 2026-07-29
  group message, the kickoff video, and the current six specs.

---

## The answer

> **"A is the correct answer"**

= the **Work In Progress report ALSO uses VIN** (falls back to Unit #, then plate) as the
asset identifier — the same chain as Sales By Customer.

## Standing note 1 — the chain is the STANDARD everywhere (verbatim)

> "Not just for these specs though -- really good to keep this in mind for all actions
> moving forward."

= the **VIN → Unit # → plate** identifier chain is the standard going forward, for ALL
reports and all future work (not just SBC/WIP).

## Standing note 2 — VIN terminology caution (verbatim)

> "we just have to be careful with using the acronym VIN … it stands for VEHICLE
> identification number. So for a generator for example, it gets confusing when we say
> VIN rather than serial #. 90% of people will understand saying VIN though."

= keep the on-screen label "VIN" (build-accurate, Rule 9), but for NON-VEHICLE assets
(e.g. a generator) the value in that field is effectively the unit's serial number —
flipped cases carry a short plain tester note to this effect.

## Spec status caveat

Chris also said he **updated the spec before bed but has NOT hand-reviewed it** — when
his spec changelog lands (~2026-07-30), the re-diff must confirm the WIP identifier text
too (SPEC-WATCH deadline 2026-08-04 stands).

## Applied (LOCAL ONLY this pass — push separately authorized)

- WIP-COL-05 (C30470), WIP-FLT-03 (C30500), WIP-SORT-03 (C30485) flipped from the
  video-era serial ruling to the VIN chain (SBC-LBL-01 C30134 wording pattern mirrored).
- WIP-EXP-07 (C30516) expected-result caveat updated (on-screen Asset data = VIN chain).
- SBC-LBL-01 (C30134) notes-only: the "WIP question queued" residue closed (local
  metadata only — no TestRail field affected).
- Pre-edit backups: `backup/` (see MANIFEST.md, 2026-07-29 WIP-answer wave).
