# Ticket inventory — Filters (SV-8785) and Schedule (SV-8685)

**Population 27 = 22 rewritten + 5 closed and skipped.**

The population was established three independent ways and reconciled, because a
stale list is exactly the failure that made `build/ticket-source-blocks-2026-08-06/
TICKET-LIST.md` say 66 when the truth was 87:

| How | Count | What it misses |
|---|---|---|
| our committed records (`build/ticket-type-audit-2026-08-06/type-audit.json`) | 26 | `SV-8902`, a disposable probe never written into a FILED.md |
| the live epic tree, creator = us | 26 | `SV-8848`, whose parent was removed by Mudassir Qamar, so no parent walk can see it |
| a live author sweep of every SV issue this account created since 1 August | 92 | nothing, but it over-collects: it also returns the Report Suite half and 4 tickets in neither tree |
| **union of the first two** | **27** | — |

The two 26s are not the same 26. That is the whole reason both were run.

## The 22 rewritten

| Ticket | Project | Type | Status | Priority | Parent | Description bytes | Summary |
|---|---|---|---|---|---|---|---|
| [SV-8845](https://shopview.atlassian.net/browse/SV-8845) | Filters | Bug | Ready to Fix | Medium | SV-8785 | 4689 -> 4932 | On a phone, a shared filter link shows the filters as on but lists the wrong work orders |
| [SV-8846](https://shopview.atlassian.net/browse/SV-8846) | Filters | Story Defect | Ready to Fix | Medium | SV-8797 | 4484 -> 4523 | On a phone there is no Clear Filters button, so filters cannot all be cleared at once |
| [SV-8848](https://shopview.atlassian.net/browse/SV-8848) | Schedule | Bug | Open | Low | (none) | 6869 -> 5357 | Every time on the Schedule is shown six hours later than the time it was scheduled for |
| [SV-8849](https://shopview.atlassian.net/browse/SV-8849) | Schedule | Story Defect | Ready for QA | Low | SV-8692 | 5158 -> 4349 | A shift that is part of a multi-day series cannot be opened from the Week view |
| [SV-8850](https://shopview.atlassian.net/browse/SV-8850) | Schedule | Story Defect | Ready for QA | Low | SV-8693 | 4258 -> 3519 | The '+N more' link on a crowded day opens an empty box - the hidden shifts are never lis |
| [SV-8851](https://shopview.atlassian.net/browse/SV-8851) | Schedule | Story Defect | Ready for QA | Low | SV-8700 | 4655 -> 3650 | Turning on the Tech Hours option in View Options changes nothing on the screen |
| [SV-8852](https://shopview.atlassian.net/browse/SV-8852) | Schedule | Story Defect | Open | Low | SV-8697 | 4587 -> 3535 | The shift window warns about a scheduling clash but gives no way to fix it |
| [SV-8853](https://shopview.atlassian.net/browse/SV-8853) | Schedule | Story Defect | Open | Low | SV-8700 | 5710 -> 4830 | The Escape and Enter keys do not work on the delete and reassign confirmation windows |
| [SV-8854](https://shopview.atlassian.net/browse/SV-8854) | Schedule | Story Defect | Open | Low | SV-8687 | 5197 -> 4345 | A user who is not allowed to see work orders can still read the whole work order list on |
| [SV-8855](https://shopview.atlassian.net/browse/SV-8855) | Schedule | Story Defect | Open | Low | SV-8691 | 5241 -> 3891 | The spread window has no start date, so a second technician's run of days cannot be made |
| [SV-8856](https://shopview.atlassian.net/browse/SV-8856) | Schedule | Story Defect | Open | Low | SV-8694 | 4359 -> 3401 | Dragging a shift sideways in Day view jumps it a whole hour instead of a quarter of an h |
| [SV-8857](https://shopview.atlassian.net/browse/SV-8857) | Schedule | Story Defect | TESTING QA | Low | SV-8687 | 4616 -> 3873 | The Schedule sidebar filters have no 'Clear all' and the Filters button does not show ho |
| [SV-8871](https://shopview.atlassian.net/browse/SV-8871) | Filters | Story Defect | Ready to Fix | Medium | SV-8795 | 4650 -> 4697 | A saved Customer, Lead Technician or Service Advisor filter comes back without its name  |
| [SV-8886](https://shopview.atlassian.net/browse/SV-8886) | Schedule | Story Defect | Open | Low | SV-8689 | 15125 -> 4525 | Schedule scope picker: tick-box mode has no Select all and no Cancel, and the tally text |
| [SV-8912](https://shopview.atlassian.net/browse/SV-8912) | Filters | Story Defect | Ready to Fix | Medium | SV-8798 | 7592 -> 5286 | On a phone there is no page search: the magnifier opens global search, which does not na |
| [SV-8924](https://shopview.atlassian.net/browse/SV-8924) | Schedule | Story Defect | Open | Low | SV-8688 | 11163 -> 5141 | Schedule: assigning an unassigned job to a technician moves its saved start time six hou |
| [SV-8933](https://shopview.atlassian.net/browse/SV-8933) | Schedule | Story Defect | Open | Low | SV-8699 | 14593 -> 5840 | Working hours cannot be opened for a staff member who belongs to another location |
| [SV-8941](https://shopview.atlassian.net/browse/SV-8941) | Schedule | Story Defect | Open | Low | SV-8690 | 10185 -> 3869 | Month view shows the VIN on shift blocks although the spec says it is omitted there |
| [SV-8942](https://shopview.atlassian.net/browse/SV-8942) | Schedule | Story Defect | Open | Low | SV-8686 | 6840 -> 3827 | Schedule: at 960px and below the whole page scrolls sideways and the work order panel ne |
| [SV-8957](https://shopview.atlassian.net/browse/SV-8957) | Schedule | Story Defect | Open | Low | SV-8688 | 6701 -> 4033 | Schedule: the click alternative to dragging a job onto the grid has disappeared from the |
| [SV-8958](https://shopview.atlassian.net/browse/SV-8958) | Schedule | Story Defect | Open | Low | SV-8692 | 4946 -> 3451 | Schedule: Month view series bar does not name the technician it belongs to |
| [SV-8959](https://shopview.atlassian.net/browse/SV-8959) | Schedule | Story Defect | Open | Low | SV-8695 | 5497 -> 3842 | Schedule: hover tooltip puts the conflict warning at the bottom, not beside the customer |

**Across the 22 the descriptions went from 147,115 bytes to 94,716 — 35% shorter overall.**
But it is 19 shorter and **3 slightly LONGER**, not 22 shorter,
and the longer ones are worth saying out loud rather than hiding in an average:

- [SV-8845](https://shopview.atlassian.net/browse/SV-8845) 4689 -> 4932 bytes, **243 longer**
- [SV-8846](https://shopview.atlassian.net/browse/SV-8846) 4484 -> 4523 bytes, **39 longer**
- [SV-8871](https://shopview.atlassian.net/browse/SV-8871) 4650 -> 4697 bytes, **47 longer**

All three are Filters tickets that already used the older, terser five-part format,
so there was little bloat to remove — and the new Source section quotes more of the
specification than the old one did. Quoting the requirement is the part Stefan will
actually check, so that is a trade worth making.

The worst offenders shrank the most, and are now roughly a third of their old length:

- [SV-8886](https://shopview.atlassian.net/browse/SV-8886) 15125 -> 4525 bytes, 10600 removed
- [SV-8933](https://shopview.atlassian.net/browse/SV-8933) 14593 -> 5840 bytes, 8753 removed
- [SV-8941](https://shopview.atlassian.net/browse/SV-8941) 10185 -> 3869 bytes, 6316 removed
- [SV-8924](https://shopview.atlassian.net/browse/SV-8924) 11163 -> 5141 bytes, 6022 removed
- [SV-8942](https://shopview.atlassian.net/browse/SV-8942) 6840 -> 3827 bytes, 3013 removed

## The 5 closed and skipped

See `SKIPPED-CLOSED.md` for the reasoning and the per-ticket note.

- [SV-8843](https://shopview.atlassian.net/browse/SV-8843) — OBSOLETE — Filter bar sits on the same row as the tabs, so collapsing it frees no space
- [SV-8844](https://shopview.atlassian.net/browse/SV-8844) — OBSOLETE — Page Search is not working Anymore
- [SV-8847](https://shopview.atlassian.net/browse/SV-8847) — OBSOLETE — When only a page search is active the empty screen offers Clear Filters, which does no
- [SV-8902](https://shopview.atlassian.net/browse/SV-8902) — OBSOLETE — ZZAUTOTEST disposable probe - checking whether a Story Defect can be parented to a Sto
- [SV-8923](https://shopview.atlassian.net/browse/SV-8923) — OBSOLETE — Schedule: the Business Hours switch shades nothing - out-of-hours time looks identical
