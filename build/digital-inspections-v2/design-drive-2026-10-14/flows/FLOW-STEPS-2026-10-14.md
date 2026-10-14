
## FI-01 Mark axle OK then Undo  (Prototype - Fill Inspection.dc.html, 5.7s)
- ('text', 'Mark axle OK') -> clicked (1 matches)
    + Axle: Not OK | 10 positions marked OK | Undo
    - 0/4 | 2 of 12 positions | 2/4 | Mark axle OK
- ('text', 'Undo') -> clicked (1 matches)
    + 2 of 12 positions | Mark axle OK | 2/4 | 0/4
    - 10 positions marked OK | Axle: Not OK | Undo

## FI-02 Mark section OK then Undo  (Prototype - Fill Inspection.dc.html, 5.6s)
- ('text', 'Mark section OK') -> clicked (1 matches)
    + 2/2 | 2 fields · 2 complete | 31 answers marked OK | Undo | Axle: Not OK | Instruction
    - 0 | 0/4 | 2 fields · 0 complete | 2 of 12 positions | 2/4 | 4 | Mark section OK
- ('text', 'Undo') -> clicked (1 matches)
    + 0 | 2 fields · 0 complete | Mark section OK | 2 of 12 positions | 2/4 | 0/4 | 4
    - 2 fields · 2 complete | 2/2 | 31 answers marked OK | Axle: Not OK | Instruction | Undo

## FI-03 Not OK opens note + instruction, acknowledge  (Prototype - Fill Inspection.dc.html, 6.1s)
- ('text', 'Not OK', 0) -> clicked (1 matches)
    + NOTE | Required | INSTRUCTION | Required | Tag the unit out of service and tell the foreman before it leaves the bay. Record the chamber part number and the date code from the canister tag. | Do not release the unit for road test until the replacement chamber is fitted and the system has held 90 psi for five minutes with the engine off. | Bendix-chamber-out-of-service-procedure.pdf | 1.2 MB | Acknowledge | 5
    - 4 | Add Note
- ('text', 'Acknowledge') -> clicked (1 matches)
    + 4
    - 5
- ('text', 'Acknowledge') -> clicked (1 matches)
    + 5
    - 4

## FI-04 OK shows Instruction marker, open and Hide  (Prototype - Fill Inspection.dc.html, 6.2s)
- ('text', 'OK', 0) -> clicked (1 matches)
    + 1/2 | 2 fields · 1 complete | Instruction
    - 0 | 2 fields · 0 complete | 4
- ('textp', 'Instruction') -> clicked (1 matches)
    + INSTRUCTION | Hide | Check the dust boot is seated before closing the card.
    - Instruction
- ('text', 'Hide') -> clicked (1 matches)
    + Instruction
    - Check the dust boot is seated before closing the card. | Hide | INSTRUCTION

## FI-05 Verdict dropdown on a tire value  (Prototype - Fill Inspection.dc.html, 5.5s)
- ('css', '[id^=card-ax] button:has(svg)', 2) -> clicked (14 matches)
    + Left outer tire · Tire pressure · 42 psi
    - 
- ('text', 'Monitor', 0) -> clicked (2 matches)
    + 
    - Left outer tire · Tire pressure · 42 psi

## FI-06 Add axle, remove axle, Single/Dual  (Prototype - Fill Inspection.dc.html, 7.0s)
- ('text', '+ Add Axle') -> clicked (1 matches)
    + Axle 4 | Axle 4 | 0 of 12 positions
    - 2 of 12 positions | 2/4
- ('title', 'Remove this axle') -> clicked (1 matches)
    + 0 of 8 positions
    - 0 of 12 positions | 0/4 | Axle 4 | INNER | OUTER
- ('text', 'Single') -> clicked (1 matches)
    + 
    - 
- ('text', 'Dual') -> clicked (1 matches)
    + 0 of 12 positions | 0/4 | OUTER | INNER | INNER | OUTER | 0/4 | OUTER | INNER | INNER | OUTER
    - 0 of 8 positions

## FI-07 Axle tabs and top view  (Prototype - Fill Inspection.dc.html, 7.3s)
- ('width', 1440) -> width 1440
    + 
    - 
- ('text', 'Axle 2') -> clicked (1 matches)
    + 0 of 12 positions
    - 2 of 12 positions | 2/4
- ('text', 'Axle 3') -> clicked (1 matches)
    + 0 of 8 positions
    - 0 of 12 positions | 0/4 | INNER | OUTER

## FI-08 Next section, submit with items, outstanding list, go to first  (Prototype - Fill Inspection.dc.html, 6.4s)
- ('textp', 'Next: Air system') -> clicked (1 matches)
    + SECTION 2 OF 2 | Air-brake system leak check | Low-air warning buzzer | Back | Submit & Generate Report
    - + Add Axle | 0/4 | 2 of 12 positions | 2/4 | 3 | 32nds | Axle 1 | Axle 2 | Axle 3 | Bendix-chamber-service.pdf | Brake & tire measurements | Brake chamber condition | Brake lining | Dual | INNER | LEFT | Mark axle OK | Next: Air system | OUTER | Open | PDF | Per axle · a verdict on every position | Push-rod travel | RIGHT | Reference file · always available on this field | SECTION 1 OF 2 | Save & 
- ('text', 'Submit & Generate Report') -> clicked (1 matches)
    + Answer missing | Answer missing | 4 items before submitting | Answer | Section 1 · Brake & tire measurements · 30 positions | Answer | Section 1 · Brake chamber condition | Answer | Section 2 · Air-brake system leak check | Answer | Section 2 · Low-air warning buzzer | Go to the first one
    - 
- ('text', 'Go to the first one') -> clicked (1 matches)
    + SECTION 1 OF 2 | Brake & tire measurements | Per axle · a verdict on every position | 30 positions not inspected | Axle 1 | Axle 2 | Axle 3 | + Add Axle | TOP VIEW | 3 | Axle 1 | Single | Dual | 2 of 12 positions | Mark axle OK | Tire pressure | psi | 2/4 | LEFT | OUTER | INNER | RIGHT | INNER | OUTER | Tread depth | 32nds | 0/4 | LEFT | OUTER | INNER | RIGHT | INNER | OUTER | Brake lining | in. | LEFT | RIGHT | Push-rod travel | in. | LEFT | RIGHT | Brake chamber condition | PDF | Bendix-chamber-service.pdf | Reference file · always available on this field | Open | Save & Exit | Next: Air system
    - 4 items before submitting | Air-brake system leak check | Answer | Back | Go to the first one | Low-air warning buzzer | SECTION 2 OF 2 | Section 1 · Brake & tire measurements · 30 positions | Section 1 · Brake chamber condition | Section 2 · Air-brake system leak check | Section 2 · Low-air warning buzzer | Submit & Generate Report

## FI-09 Outstanding button toggles list, close  (Prototype - Fill Inspection.dc.html, 5.7s)
- ('textp', 'Outstanding') -> clicked (1 matches)
    + 4 items before submitting | Answer | Section 1 · Brake & tire measurements · 30 positions | Answer | Section 1 · Brake chamber condition | Answer | Section 2 · Air-brake system leak check | Answer | Section 2 · Low-air warning buzzer | Go to the first one
    - 
- ('textp', 'Outstanding') -> clicked (1 matches)
    + 
    - 4 items before submitting | Answer | Go to the first one | Section 1 · Brake & tire measurements · 30 positions | Section 1 · Brake chamber condition | Section 2 · Air-brake system leak check | Section 2 · Low-air warning buzzer

## FI-10 Complete everything and submit  (Prototype - Fill Inspection.dc.html, 6.7s)
- ('text', 'Mark section OK') -> clicked (1 matches)
    + 2/2 | 2 fields · 2 complete | 31 answers marked OK | Undo | Axle: Not OK | Instruction
    - 0 | 0/4 | 2 fields · 0 complete | 2 of 12 positions | 2/4 | 4 | Mark section OK
- ('textp', 'Next: Air system') -> clicked (1 matches)
    + SECTION 2 OF 2 | 2 fields · 0 complete | Mark section OK | Air-brake system leak check | Low-air warning buzzer | Back | Submit & Generate Report
    - + Add Axle | 2 fields · 2 complete | 3 | 31 answers marked OK | 32nds | Axle 1 | Axle 2 | Axle 3 | Axle: Not OK | Bendix-chamber-service.pdf | Brake & tire measurements | Brake chamber condition | Brake lining | Dual | INNER | Instruction | LEFT | Mark axle OK | Next: Air system | OUTER | Open | PDF | Per axle · a verdict on every position | Push-rod travel | RIGHT | Reference file · always availa
- ('text', 'Mark section OK') -> clicked (1 matches)
    + 4 | 2 fields · 2 complete | 2 answers marked OK | Undo
    - 0/2 | 2 fields · 0 complete | Mark section OK | Outstanding
- ('text', 'Submit & Generate Report') -> clicked (1 matches)
    + Inspection submitted | The report is on work order S-81 and the inspection is locked. 4 fields, 3 axles. | Start Again | View Completed Inspection
    - / 4 fields complete | 1 | 2 | 2 answers marked OK | 2 fields · 2 complete | 2/2 | 4 | Add Note | Add Photo | Advisor: Kimberly Barnes | Air system | Air-brake system leak check | Back | Brakes | Checkbox · note required if Monitor or Not OK | Low-air warning buzzer | Monitor | N/A | Not OK | OK | SECTION 2 OF 2 | SECTIONS | Submit & Generate Report | Tech: William Johns | Undo

## FI-11 Monitor needs note and ack, outstanding kinds  (Prototype - Fill Inspection.dc.html, 7.1s)
- ('textp', 'Next: Air system') -> clicked (1 matches)
    + SECTION 2 OF 2 | Air-brake system leak check | Low-air warning buzzer | Back | Submit & Generate Report
    - + Add Axle | 0/4 | 2 of 12 positions | 2/4 | 3 | 32nds | Axle 1 | Axle 2 | Axle 3 | Bendix-chamber-service.pdf | Brake & tire measurements | Brake chamber condition | Brake lining | Dual | INNER | LEFT | Mark axle OK | Next: Air system | OUTER | Open | PDF | Per axle · a verdict on every position | Push-rod travel | RIGHT | Reference file · always available on this field | SECTION 1 OF 2 | Save & 
- ('text', 'Monitor', 0) -> clicked (2 matches)
    + NOTE | Required | INSTRUCTION | Required | Re-check at the next PM and record the reading. Book the unit for a leak-down test if the loss is above 3 psi a minute. | PDF | Leak-test-steps.pdf | 820 KB | Acknowledge | 5
    - 4
- ('ph', 'Describe the problem and the recommended repair') -> clicked (1 matches)
    + 
    - 
- ('type', 'textarea', 0, 'Lost 3 psi') -> typed 'Lost 3 psi'
    + 4
    - 5
- ('text', 'Acknowledge') -> clicked (1 matches)
    + 1/2 | 2 fields · 1 complete | 3
    - 0 | 2 fields · 0 complete | 4
- ('textp', 'Outstanding') -> clicked (1 matches)
    + 3 items before submitting | Answer | Section 1 · Brake & tire measurements · 30 positions | Answer | Section 1 · Brake chamber condition | Answer | Section 2 · Low-air warning buzzer | Go to the first one
    - 

## FI-12 Reference file viewer  (Prototype - Fill Inspection.dc.html, 5.8s)
- ('text', 'Open') -> clicked (1 matches)
    + Close | Diagram
    - 
- ('text', 'Close') -> clicked (1 matches)
    + 
    - Close | Diagram

## FI-13 Instruction file viewer  (Prototype - Fill Inspection.dc.html, 6.2s)
- ('text', 'Not OK', 0) -> clicked (1 matches)
    + NOTE | Required | INSTRUCTION | Required | Tag the unit out of service and tell the foreman before it leaves the bay. Record the chamber part number and the date code from the canister tag. | Do not release the unit for road test until the replacement chamber is fitted and the system has held 90 psi for five minutes with the engine off. | Bendix-chamber-out-of-service-procedure.pdf | 1.2 MB | Acknowledge | 5
    - 4 | Add Note
- ('text', 'Bendix-chamber-out-of-service-procedure.pdf') -> clicked (1 matches)
    + Close | Diagram
    - 
- ('text', 'Close') -> clicked (1 matches)
    + 
    - Close | Diagram

## FI-14 Collapse and expand section  (Prototype - Fill Inspection.dc.html, 5.5s)
- ('title', 'Collapse section') -> clicked (1 matches)
    + Show 2 fields
    - + Add Axle | 0/4 | 2 of 12 positions | 2/4 | 3 | 32nds | Add Note | Add Photo | Axle 1 | Axle 2 | Axle 3 | Bendix-chamber-service.pdf | Brake & tire measurements | Brake chamber condition | Brake lining | Checkbox · note required if Monitor or Not OK | Dual | INNER | LEFT | Mark axle OK | Monitor | N/A | Not OK | OK | OUTER | Open | PDF | Per axle · a verdict on every position | Push-rod travel | 
- ('textp', 'Show 2 fields') -> clicked (1 matches)
    + Brake & tire measurements | Per axle · a verdict on every position | Axle 1 | Axle 2 | Axle 3 | + Add Axle | TOP VIEW | 3 | Axle 1 | Single | Dual | 2 of 12 positions | Mark axle OK | Tire pressure | psi | 2/4 | LEFT | OUTER | INNER | RIGHT | INNER | OUTER | Tread depth | 32nds | 0/4 | LEFT | OUTER | INNER | RIGHT | INNER | OUTER | Brake lining | in. | LEFT | RIGHT | Push-rod travel | in. | LEFT | RIGHT | Add Photo | Brake chamber condition | Checkbox · note required if Monitor or Not OK | PDF | Bendix-chamber-service.pdf | Reference file · always available on this field | Open | OK | Monitor | Not OK | N/A | Add Photo | Add Note
    - Show 2 fields

## FI-15 Phone: verdict sheet and last-section action  (Prototype - Fill Inspection.dc.html, 8.7s)
- ('text', 'Phone') -> clicked (1 matches)
    + 
    - / 4 fields complete | 0 | 2 | 3 | Advisor: Kimberly Barnes | Air system | Customers | Outstanding | Parts | Reports | SECTIONS | Save & Exit | Schedule | Staging Heavy Duty - 9919 | TOP VIEW | Tech: William Johns | WJ | Work Orders
- ('css', '[id^=card-ax] button:has(svg)', 2) -> clicked (14 matches)
    + Left outer tire · Tire pressure · 42 psi
    - 
- ('text', 'Not OK', -1) -> clicked (2 matches)
    + 
    - Left outer tire · Tire pressure · 42 psi
- ('textp', 'Next: Air system') -> clicked (1 matches)
    + SECTION 2 OF 2 | Air system | Air-brake system leak check | Low-air warning buzzer | Back | Review & Sign
    - + Add Axle | 0/2 | 0/4 | 1 | 2 of 12 positions | 2/4 | 32nds | Axle 1 | Axle 2 | Axle 3 | Bendix-chamber-service.pdf | Brake & tire measurements | Brake chamber condition | Brake lining | Brakes | Dual | INNER | LEFT | Mark axle OK | Next: Air system | OUTER | Open | PDF | Per axle · a verdict on every position | Push-rod travel | RIGHT | Reference file · always available on this field | SECTION 1
- ('text', 'Not OK', 0) -> clicked (2 matches)
    + NOTE | Required
    - 
- ('text', 'Review & Sign') -> clicked (1 matches)
    + Note missing | Answer missing | 4 items before submitting | Answer | Section 1 · Brake & tire measurements · 30 positions | Answer | Section 1 · Brake chamber condition | Note | Section 2 · Air-brake system leak check · Not OK | Answer | Section 2 · Low-air warning buzzer | Go to the first one
    - 

## FI-16 Change answer drops acknowledgement  (Prototype - Fill Inspection.dc.html, 6.7s)
- ('text', 'Not OK', 0) -> clicked (1 matches)
    + NOTE | Required | INSTRUCTION | Required | Tag the unit out of service and tell the foreman before it leaves the bay. Record the chamber part number and the date code from the canister tag. | Do not release the unit for road test until the replacement chamber is fitted and the system has held 90 psi for five minutes with the engine off. | Bendix-chamber-out-of-service-procedure.pdf | 1.2 MB | Acknowledge | 5
    - 4 | Add Note
- ('text', 'Acknowledge') -> clicked (1 matches)
    + 4
    - 5
- ('text', 'Monitor', 0) -> clicked (1 matches)
    + 
    - 1.2 MB | Acknowledge | Bendix-chamber-out-of-service-procedure.pdf | Do not release the unit for road test until the replacement chamber is fitted and the system has held 90 psi for five minutes with the engine off. | INSTRUCTION | Tag the unit out of service and tell the foreman before it leaves the bay. Record the chamber part number and the date code from the canister tag.
- ('text', 'Not OK', 0) -> clicked (1 matches)
    + INSTRUCTION | Tag the unit out of service and tell the foreman before it leaves the bay. Record the chamber part number and the date code from the canister tag. | Do not release the unit for road test until the replacement chamber is fitted and the system has held 90 psi for five minutes with the engine off. | Bendix-chamber-out-of-service-procedure.pdf | 1.2 MB | Acknowledge | 5
    - 4

## FI-17 Reset  (Prototype - Fill Inspection.dc.html, 5.8s)
- ('text', 'Mark section OK') -> clicked (1 matches)
    + 2/2 | 2 fields · 2 complete | 31 answers marked OK | Undo | Axle: Not OK | Instruction
    - 0 | 0/4 | 2 fields · 0 complete | 2 of 12 positions | 2/4 | 4 | Mark section OK
- ('text', 'Reset') -> clicked (1 matches)
    + 0 | 2 fields · 0 complete | Mark section OK | 2 of 12 positions | 2/4 | 0/4 | 4
    - 2 fields · 2 complete | 2/2 | 31 answers marked OK | Axle: Not OK | Instruction | Undo

## TB-01 Follow-up toggles and acknowledgement  (Prototype - Template Builder.dc.html, 6.7s)
- ('text', 'Add follow-up to a response') -> clicked (1 matches)
    + Draft · unsaved
    - 1.4 MB | Attach File | Chamber-replacement-procedure.pdf | Check the dust boot is seated before closing the card. | Follow-up for this response | Not OK | OK | Published | Require acknowledgement | Tag the unit out of service and tell the foreman before it leaves the bay. Record the chamber part number from the canister tag.
- ('text', 'Add follow-up to a response') -> clicked (1 matches)
    + OK | Check the dust boot is seated before closing the card. | Not OK | Tag the unit out of service and tell the foreman before it leaves the bay. Record the chamber part number from the canister tag. | Follow-up for this response | Attach File | Follow-up for this response | Attach File | Require acknowledgement | Follow-up for this response | Chamber-replacement-procedure.pdf | 1.4 MB | Require acknowledgement | Follow-up for this response | Attach File
    - 
- ('text', 'Follow-up for this response', 3) -> clicked (4 matches)
    + N/A | No text yet
    - 
- ('text', 'Require acknowledgement', 0) -> clicked (2 matches)
    + 
    - 

## TB-02 Include Monitor off/on  (Prototype - Template Builder.dc.html, 5.7s)
- ('text', 'Include Monitor option') -> clicked (1 matches)
    + Draft · unsaved | Checkbox · OK / Not OK / N/A · reference file · note required if Not OK
    - Checkbox · OK / Monitor / Not OK / N/A · reference file · note required if Monitor / Not OK | Published
- ('text', 'Include Monitor option') -> clicked (1 matches)
    + Checkbox · OK / Monitor / Not OK / N/A · reference file · note required if Monitor / Not OK
    - Checkbox · OK / Not OK / N/A · reference file · note required if Not OK

## TB-03 Rename response  (Prototype - Template Builder.dc.html, 35.1s)
- ('title', 'Rename response', 0) -> clicked (4 matches)
    + 
    - 
- ('type', 'input[readonly]', 0, 'Pass') -> FAILED Locator.fill: Timeout 30000ms exceeded.
Call log:
  - waiting for locator
    + 
    - 

## TB-04 Attach and remove follow-up file  (Prototype - Template Builder.dc.html, 6.1s)
- ('text', 'Follow-up for this response', 3) -> clicked (4 matches)
    + Draft · unsaved | N/A | No text yet
    - Published
- ('text', 'Attach File', 0) -> clicked (3 matches)
    + 
    - 
- ('title', 'Remove file', 0) -> clicked (3 matches)
    + 
    - 

## TB-05 Validation toggles and summary  (Prototype - Template Builder.dc.html, 6.6s)
- ('text', 'Required to complete') -> clicked (1 matches)
    + Draft · unsaved | The technician must provide an answer, a note when Monitor or Not OK.
    - Published | The technician must provide a note when Monitor or Not OK.
- ('text', 'Photo required') -> clicked (1 matches)
    + The technician must provide an answer, a photo on every answer, a note when Monitor or Not OK.
    - The technician must provide an answer, a note when Monitor or Not OK.
- ('text', 'Photo required if Not OK') -> clicked (1 matches)
    + The technician must provide an answer, a photo when Not OK, a note when Monitor or Not OK.
    - The technician must provide an answer, a photo on every answer, a note when Monitor or Not OK.
- ('text', 'Note required if Monitor / Not OK') -> clicked (1 matches)
    + Checkbox · OK / Monitor / Not OK / N/A · reference file | The technician must provide an answer, a photo when Not OK.
    - Checkbox · OK / Monitor / Not OK / N/A · reference file · note required if Monitor / Not OK | The technician must provide an answer, a photo when Not OK, a note when Monitor or Not OK.

## TB-06 Add field picker, Per axle, Checkbox  (Prototype - Template Builder.dc.html, 7.0s)
- ('text', '+ Add Field', 0) -> clicked (2 matches)
    + FIELD TYPE
    - 
- ('text', 'Per axle', 0) -> clicked (2 matches)
    + Draft · unsaved | 3 | 3 fields | Per axle measurements | MEASUREMENT ROWS · EVERY AXLE | psi | 32nds | in. | mm | ft-lb | Every tire | Each side | psi | 32nds | in. | mm | ft-lb | Every tire | Each side | psi | 32nds | in. | mm | ft-lb | Every tire | Each side | psi | 32nds | in. | mm | ft-lb | Every tire | Each side | + Add Measurement Row | Axles | Select # of axles to start with | 3 | 4 | 5 | PDF, JPG or PNG · up to 10 MB | The technician must provide an answer, a note when Monitor or Not OK.
    - 1.2 MB · not in the customer report | 1.4 MB | A follow-up is text and one file, shown to the technician only when they give that response. | Add follow-up to a response | Bendix-chamber-service.pdf | Chamber-replacement-procedure.pdf | FIELD TYPE | Follow-up for this response | Include Monitor option | PDF | Published | RESPONSE OPTIONS | RESPONSE SETTINGS | Require acknowledgement | The technici
- ('text', '+ Add Field', 0) -> clicked (2 matches)
    + FIELD TYPE
    - 
- ('text', 'Checkbox', 0) -> clicked (2 matches)
    + 4 fields | New checkbox | RESPONSE OPTIONS | RESPONSE SETTINGS | Include Monitor option | Add follow-up to a response | A follow-up is text and one file, shown to the technician only when they give that response. | The technician must provide a note when Monitor or Not OK.
    - + Add Measurement Row | 3 | 3 fields | 32nds | 5 | Axles | Each side | Every tire | FIELD TYPE | MEASUREMENT ROWS · EVERY AXLE | Select # of axles to start with | The technician must provide an answer, a note when Monitor or Not OK. | ft-lb | in. | mm | psi

## TB-07 Per axle editor rows, units, scope, axles  (Prototype - Template Builder.dc.html, 6.7s)
- ('text', 'Brake & tire measurements') -> clicked (1 matches)
    + MEASUREMENT ROWS · EVERY AXLE | psi | 32nds | in. | mm | ft-lb | Every tire | Each side | psi | 32nds | in. | mm | ft-lb | Every tire | Each side | psi | 32nds | in. | mm | ft-lb | Every tire | Each side | psi | 32nds | in. | mm | ft-lb | Every tire | Each side | + Add Measurement Row | Axles | Select # of axles to start with | 3 | 4 | 5 | PDF, JPG or PNG · up to 10 MB | The technician must provide an answer, a note when Monitor or Not OK.
    - 1.2 MB · not in the customer report | 1.4 MB | A follow-up is text and one file, shown to the technician only when they give that response. | Add follow-up to a response | Bendix-chamber-service.pdf | Chamber-replacement-procedure.pdf | Follow-up for this response | Include Monitor option | PDF | RESPONSE OPTIONS | RESPONSE SETTINGS | Require acknowledgement | The technician must provide a note wh
- ('text', '+ Add Measurement Row') -> clicked (1 matches)
    + Draft · unsaved | Per axle · Tire pressure (psi), Tread depth (32nds), Brake lining (in.), Push-rod travel (in.), New measurement (in.) · 3 axles
    - Per axle · Tire pressure (psi), Tread depth (32nds), Brake lining (in.), Push-rod travel (in.) · 3 axles | Published
- ('select', 'mm', 0) -> selected mm
    + Per axle · Tire pressure (mm), Tread depth (32nds), Brake lining (in.), Push-rod travel (in.), New measurement (in.) · 3 axles
    - Per axle · Tire pressure (psi), Tread depth (32nds), Brake lining (in.), Push-rod travel (in.), New measurement (in.) · 3 axles
- ('select', 'side', 1) -> selected side
    + 
    - 
- ('title', 'Delete row', 0) -> clicked (5 matches)
    + Per axle · Tread depth (32nds), Brake lining (in.), Push-rod travel (in.), New measurement (in.) · 3 axles
    - Per axle · Tire pressure (mm), Tread depth (32nds), Brake lining (in.), Push-rod travel (in.), New measurement (in.) · 3 axles

## TB-08 Duplicate and delete field  (Prototype - Template Builder.dc.html, 5.4s)
- ('text', 'Duplicate Field') -> clicked (1 matches)
    + Draft · unsaved | 3 | 3 fields | Brake chamber condition (copy)
    - Published
- ('text', 'Delete Field') -> clicked (1 matches)
    + Select a field to edit its properties.
    - 1.2 MB · not in the customer report | 1.4 MB | 3 | 3 fields | A follow-up is text and one file, shown to the technician only when they give that response. | Add follow-up to a response | Attach File | Bendix-chamber-service.pdf | Brake chamber condition (copy) | Chamber-replacement-procedure.pdf | Checkbox | Delete Field | Duplicate Field | Field properties | Follow-up for this response | GENERAL 

## TB-09 Preview, click a card returns to Edit  (Prototype - Template Builder.dc.html, 5.8s)
- ('text', 'Preview') -> clicked (1 matches)
    + SECTION 1 OF 2 | Note required if Monitor or Not OK | Axle 1 | Axle 2 | Axle 3 | + Axle | TOP VIEW | 3 | Tap a tire to jump to its value. Tint follows that tire’s verdict. | Tire pressure psi | L OUTER | L INNER | R INNER | R OUTER | Tread depth 32nds | L OUTER | L INNER | R INNER | R OUTER | Brake lining in. | LEFT | RIGHT | Push-rod travel in. | LEFT | RIGHT | Add Photo | Add Note | Note required if Monitor or Not OK | Open | N/A | Add Photo | Add Note | SECTION 2 OF 2 | Note required if Monitor or Not OK | N/A | Add Photo | Add Note | Note required if Monitor or Not OK | N/A | Add Photo | Add Note
    - + Add Field | + Add Section | 1.2 MB · not in the customer report | 1.4 MB | 2 fields | A follow-up is text and one file, shown to the technician only when they give that response. | Add follow-up to a response | Attach File | Chamber-replacement-procedure.pdf | Check the dust boot is seated before closing the card. | Checkbox · OK / Monitor / Not OK / N/A · note required if Monitor / Not OK | Che
- ('text', 'Low-air warning buzzer') -> clicked (1 matches)
    + OUTLINE | + Add Section | 2 fields | Per axle · Tire pressure (psi), Tread depth (32nds), Brake lining (in.), Push-rod travel (in.) · 3 axles | Checkbox · OK / Monitor / Not OK / N/A · reference file · note required if Monitor / Not OK | Check the dust boot is seated before closing the card. | Tag the unit out of service and tell the foreman before it leaves the bay. Record the chamber part number from the canister tag. | + Add Field | 2 fields | Checkbox · OK / Monitor / Not OK / N/A · note required if Monitor / Not OK | Re-check at the next PM and record the reading. | Checkbox · OK / Monitor / Not OK / N/A · note required if Monitor / Not OK | + Add Field | Field properties | LABEL | TYPE
    - + Axle | 3 | Add Note | Add Photo | Axle 1 | Axle 2 | Axle 3 | Bendix-chamber-service.pdf | Brake lining in. | L INNER | L OUTER | LEFT | N/A | Note required if Monitor or Not OK | Open | PDF | Push-rod travel in. | R INNER | R OUTER | RIGHT | SECTION 1 OF 2 | SECTION 2 OF 2 | TOP VIEW | Tap a tire to jump to its value. Tint follows that tire’s verdict. | Tire pressure psi | Tread depth 32nds
- ('text', 'Preview') -> clicked (1 matches)
    + SECTION 1 OF 2 | Note required if Monitor or Not OK | Axle 1 | Axle 2 | Axle 3 | + Axle | TOP VIEW | 3 | Tap a tire to jump to its value. Tint follows that tire’s verdict. | Tire pressure psi | L OUTER | L INNER | R INNER | R OUTER | Tread depth 32nds | L OUTER | L INNER | R INNER | R OUTER | Brake lining in. | LEFT | RIGHT | Push-rod travel in. | LEFT | RIGHT | Add Photo | Add Note | Note required if Monitor or Not OK | PDF | Bendix-chamber-service.pdf | Open | N/A | Add Photo | Add Note | SECTION 2 OF 2 | Note required if Monitor or Not OK | N/A | Add Photo | Add Note | Note required if Monitor or Not OK | N/A | Add Photo | Add Note
    - + Add Field | + Add Section | 2 fields | A follow-up is text and one file, shown to the technician only when they give that response. | Add follow-up to a response | Attach File | Check the dust boot is seated before closing the card. | Checkbox · OK / Monitor / Not OK / N/A · note required if Monitor / Not OK | Checkbox · OK / Monitor / Not OK / N/A · reference file · note required if Monitor / N

## TB-10 Publish toast  (Prototype - Template Builder.dc.html, 5.3s)
- ('text', 'Include Monitor option') -> clicked (1 matches)
    + Draft · unsaved | Checkbox · OK / Not OK / N/A · reference file · note required if Not OK
    - Checkbox · OK / Monitor / Not OK / N/A · reference file · note required if Monitor / Not OK | Published
- ('text', 'Publish') -> clicked (1 matches)
    + Published | Template published · new inspections use this version
    - Draft · unsaved

## TB-11 Add section  (Prototype - Template Builder.dc.html, 4.8s)
- ('text', '+ Add Section') -> clicked (1 matches)
    + Draft · unsaved | Section 3 | 0 | 3 | 0 fields
    - Published

## TB-12 General reference file remove/attach  (Prototype - Template Builder.dc.html, 5.4s)
- ('title', 'Remove file', -1) -> clicked (2 matches)
    + Draft · unsaved | PDF, JPG or PNG · up to 10 MB
    - 1.2 MB · not in the customer report | Bendix-chamber-service.pdf | Checkbox · OK / Monitor / Not OK / N/A · reference file · note required if Monitor / Not OK | Published
- ('text', 'Attach File', -1) -> clicked (4 matches)
    + Checkbox · OK / Monitor / Not OK / N/A · reference file · note required if Monitor / Not OK | 1.4 MB · not in the customer report
    - PDF, JPG or PNG · up to 10 MB

## TB-13 Disabled field types  (Prototype - Template Builder.dc.html, 5.8s)
- ('text', '+ Add Field', 0) -> clicked (2 matches)
    + FIELD TYPE
    - 
- ('text', 'Text', 0) -> clicked (2 matches)
    + 
    - 
- ('text', 'Photo', 0) -> clicked (2 matches)
    + 
    - 

## TB-14 Phone: properties sheet and Done  (Prototype - Template Builder.dc.html, 5.8s)
- ('text', 'Phone') -> clicked (1 matches)
    + 
    - 1.2 MB · not in the customer report | 1.4 MB | A follow-up is text and one file, shown to the technician only when they give that response. | AS | Add follow-up to a response | Admin | Air system | Attach File | Bendix-chamber-service.pdf | Brakes | Chamber-replacement-procedure.pdf | Checkbox | Customers | Delete Field | Duplicate Field | Field properties | Follow-up for this response | GENERAL R
- ('text', 'Low-air warning buzzer') -> clicked (1 matches)
    + Field properties | Checkbox | Done | LABEL | TYPE | Checkbox | Text | Measurement | Per axle | Photo | Instructions | RESPONSE OPTIONS | RESPONSE SETTINGS | Include Monitor option | Add follow-up to a response | A follow-up is text and one file, shown to the technician only when they give that response. | GENERAL REFERENCE FILE | PDF, JPG or PNG · up to 10 MB | Attach File | VALIDATION | Required to complete | Photo required | Photo required if Not OK | Note required if Monitor / Not OK | The technician must provide a note when Monitor or Not OK. | Duplicate Field | Delete Field
    - 
- ('text', 'Done') -> clicked (1 matches)
    + 
    - A follow-up is text and one file, shown to the technician only when they give that response. | Add follow-up to a response | Attach File | Checkbox | Delete Field | Done | Duplicate Field | Field properties | GENERAL REFERENCE FILE | Include Monitor option | Instructions | LABEL | Measurement | Note required if Monitor / Not OK | PDF, JPG or PNG · up to 10 MB | Per axle | Photo | Photo required | 

## TB-15 Change field type  (Prototype - Template Builder.dc.html, 4.8s)
- ('text', 'Per axle', -1) -> clicked (1 matches)
    + Draft · unsaved | MEASUREMENT ROWS · EVERY AXLE | psi | 32nds | in. | mm | ft-lb | Every tire | Each side | psi | 32nds | in. | mm | ft-lb | Every tire | Each side | psi | 32nds | in. | mm | ft-lb | Every tire | Each side | psi | 32nds | in. | mm | ft-lb | Every tire | Each side | + Add Measurement Row | Axles | Select # of axles to start with | 3 | 4 | 5 | PDF, JPG or PNG · up to 10 MB | The technician must provide an answer, a note when Monitor or Not OK.
    - 1.2 MB · not in the customer report | 1.4 MB | A follow-up is text and one file, shown to the technician only when they give that response. | Add follow-up to a response | Bendix-chamber-service.pdf | Chamber-replacement-procedure.pdf | Check the dust boot is seated before closing the card. | Checkbox · OK / Monitor / Not OK / N/A · reference file · note required if Monitor / Not OK | Follow-up fo

## WO-01 Build lines on this work order, review, uncheck, add  (Prototype - Work Order Handoff.dc.html, 9.0s)
- ('textp', 'Build lines') -> clicked (1 matches)
    + BUILD THE LINES ON | This work order | S-81 · Approved | A new work order | Seeded with this customer & unit
    - 
- ('text', 'This work order') -> clicked (1 matches)
    + S-81 · Open · ABC Truck Lines · Unit 6130M | Work Order S-81 | Approved | New Line | Lines (0) | Parts (0) | Notes (2) | Timesheets | Finance | Drafting lines from Brake & Axle PM | 3 findings · labor and parts from your catalog | Lines | No lines on this work order yet.
    - 1 | 1 Monitor | 2 | 2 Not OK | 4/32nds | 42 psi | 9 OK | 98 psi | A new work order | AI | Air system | Air-brake system leak check | Axle 1 · Tire pressure · left inner | Axle 1 · Tire pressure · left outer | Axle 1 · Tread depth · left outer | BUILD THE LINES ON | Brake & Axle PM | Brake & tire measurements · Axle 1 · Tire pressure · left outer | Brake & tire measurements · Axle 1 · Tread depth ·
- ('wait', 2500) -> waited
    + AI | SHOPCOACH LINE BUILDER | 3 lines drafted from Brake & Axle PM · review before adding | Edit any title, description or labor. Uncheck a line to leave it out. | Axle 1 · Tread depth · left outer | hrs | Steer tire × 1 | Valve stem × 1 | Axle 1 · Tire pressure · left outer | hrs | No parts | Air-brake system leak check · Monitor | hrs | Gladhand seal × 2 | 3 of 3 selected · 2.5 hrs labor · 3 parts · nothing on the work order yet | Discard | Add 3 Lines
    - 3 findings · labor and parts from your catalog | Drafting lines from Brake & Axle PM
- ('css', 'label', 1) -> clicked (3 matches)
    + 2 of 3 selected · 2.2 hrs labor · 3 parts · nothing on the work order yet | Add 2 Lines
    - 3 of 3 selected · 2.5 hrs labor · 3 parts · nothing on the work order yet | Add 3 Lines
- ('textp', 'Add 2 Line') -> clicked (1 matches)
    + Lines (2) | Parts (3) | 2 lines | 1 | Replace left outer steer tire | Tread at 4/32nds, below the 5/32nds minimum. | 1.2 hrs | Estimate | 2 | Leak-down test, air system | Loss above spec at idle; confirm source before release. | 1.0 hrs | Estimate | 2 lines added to S-81
    - 2 of 3 selected · 2.2 hrs labor · 3 parts · nothing on the work order yet | 3 lines drafted from Brake & Axle PM · review before adding | AI | Add 2 Lines | Air-brake system leak check · Monitor | Axle 1 · Tire pressure · left outer | Axle 1 · Tread depth · left outer | Discard | Edit any title, description or labor. Uncheck a line to leave it out. | Gladhand seal × 2 | Lines (0) | No lines on thi

## WO-02 Build lines on a new work order  (Prototype - Work Order Handoff.dc.html, 8.4s)
- ('textp', 'Build lines') -> clicked (1 matches)
    + BUILD THE LINES ON | This work order | S-81 · Approved | A new work order | Seeded with this customer & unit
    - 
- ('text', 'A new work order') -> clicked (1 matches)
    + S-81 · Open · ABC Truck Lines · Unit 6130M | Work Order S-81 | Approved | New Line | Lines (0) | Parts (0) | Notes (2) | Timesheets | Finance | Drafting lines from Brake & Axle PM | 3 findings · labor and parts from your catalog | Lines | No lines on this work order yet.
    - 1 | 1 Monitor | 2 | 2 Not OK | 4/32nds | 42 psi | 9 OK | 98 psi | A new work order | AI | Air system | Air-brake system leak check | Axle 1 · Tire pressure · left inner | Axle 1 · Tire pressure · left outer | Axle 1 · Tread depth · left outer | BUILD THE LINES ON | Brake & Axle PM | Brake & tire measurements · Axle 1 · Tire pressure · left outer | Brake & tire measurements · Axle 1 · Tread depth ·
- ('wait', 2500) -> waited
    + AI | SHOPCOACH LINE BUILDER | 3 lines drafted from Brake & Axle PM · review before adding to a new work order | Edit any title, description or labor. Uncheck a line to leave it out. | Axle 1 · Tread depth · left outer | hrs | Steer tire × 1 | Valve stem × 1 | Axle 1 · Tire pressure · left outer | hrs | No parts | Air-brake system leak check · Monitor | hrs | Gladhand seal × 2 | 3 of 3 selected · 2.5 hrs labor · 3 parts · nothing on the work order yet | Discard | Add 3 Lines
    - 3 findings · labor and parts from your catalog | Drafting lines from Brake & Axle PM
- ('textp', 'Add 3 Line') -> clicked (1 matches)
    + Lines (3) | Parts (3) | 3 lines | 1 | Replace left outer steer tire | Tread at 4/32nds, below the 5/32nds minimum. | 1.2 hrs | Estimate | 2 | Inflate left outer to spec | 42 psi against 100 psi spec; check for a leak while replacing. | 0.3 hrs | Estimate | 3 | Leak-down test, air system | Loss above spec at idle; confirm source before release. | 1.0 hrs | Estimate | 3 lines added to new work order S-82
    - 3 lines drafted from Brake & Axle PM · review before adding to a new work order | 3 of 3 selected · 2.5 hrs labor · 3 parts · nothing on the work order yet | AI | Add 3 Lines | Air-brake system leak check · Monitor | Axle 1 · Tire pressure · left outer | Axle 1 · Tread depth · left outer | Discard | Edit any title, description or labor. Uncheck a line to leave it out. | Gladhand seal × 2 | Lines (

## WO-03 Discard drafts  (Prototype - Work Order Handoff.dc.html, 8.4s)
- ('textp', 'Build lines') -> clicked (1 matches)
    + BUILD THE LINES ON | This work order | S-81 · Approved | A new work order | Seeded with this customer & unit
    - 
- ('text', 'This work order') -> clicked (1 matches)
    + S-81 · Open · ABC Truck Lines · Unit 6130M | Work Order S-81 | Approved | New Line | Lines (0) | Parts (0) | Notes (2) | Timesheets | Finance | Drafting lines from Brake & Axle PM | 3 findings · labor and parts from your catalog | Lines | No lines on this work order yet.
    - 1 | 1 Monitor | 2 | 2 Not OK | 4/32nds | 42 psi | 9 OK | 98 psi | A new work order | AI | Air system | Air-brake system leak check | Axle 1 · Tire pressure · left inner | Axle 1 · Tire pressure · left outer | Axle 1 · Tread depth · left outer | BUILD THE LINES ON | Brake & Axle PM | Brake & tire measurements · Axle 1 · Tire pressure · left outer | Brake & tire measurements · Axle 1 · Tread depth ·
- ('wait', 2500) -> waited
    + AI | SHOPCOACH LINE BUILDER | 3 lines drafted from Brake & Axle PM · review before adding | Edit any title, description or labor. Uncheck a line to leave it out. | Axle 1 · Tread depth · left outer | hrs | Steer tire × 1 | Valve stem × 1 | Axle 1 · Tire pressure · left outer | hrs | No parts | Air-brake system leak check · Monitor | hrs | Gladhand seal × 2 | 3 of 3 selected · 2.5 hrs labor · 3 parts · nothing on the work order yet | Discard | Add 3 Lines
    - 3 findings · labor and parts from your catalog | Drafting lines from Brake & Axle PM
- ('text', 'Discard') -> clicked (1 matches)
    + 
    - 3 lines drafted from Brake & Axle PM · review before adding | 3 of 3 selected · 2.5 hrs labor · 3 parts · nothing on the work order yet | AI | Add 3 Lines | Air-brake system leak check · Monitor | Axle 1 · Tire pressure · left outer | Axle 1 · Tread depth · left outer | Discard | Edit any title, description or labor. Uncheck a line to leave it out. | Gladhand seal × 2 | No parts | SHOPCOACH LINE B

## WO-04 Uncheck all lines disables Add  (Prototype - Work Order Handoff.dc.html, 10.0s)
- ('textp', 'Build lines') -> clicked (1 matches)
    + BUILD THE LINES ON | This work order | S-81 · Approved | A new work order | Seeded with this customer & unit
    - 
- ('text', 'This work order') -> clicked (1 matches)
    + S-81 · Open · ABC Truck Lines · Unit 6130M | Work Order S-81 | Approved | New Line | Lines (0) | Parts (0) | Notes (2) | Timesheets | Finance | Drafting lines from Brake & Axle PM | 3 findings · labor and parts from your catalog | Lines | No lines on this work order yet.
    - 1 | 1 Monitor | 2 | 2 Not OK | 4/32nds | 42 psi | 9 OK | 98 psi | A new work order | AI | Air system | Air-brake system leak check | Axle 1 · Tire pressure · left inner | Axle 1 · Tire pressure · left outer | Axle 1 · Tread depth · left outer | BUILD THE LINES ON | Brake & Axle PM | Brake & tire measurements · Axle 1 · Tire pressure · left outer | Brake & tire measurements · Axle 1 · Tread depth ·
- ('wait', 2500) -> waited
    + AI | SHOPCOACH LINE BUILDER | 3 lines drafted from Brake & Axle PM · review before adding | Edit any title, description or labor. Uncheck a line to leave it out. | Axle 1 · Tread depth · left outer | hrs | Steer tire × 1 | Valve stem × 1 | Axle 1 · Tire pressure · left outer | hrs | No parts | Air-brake system leak check · Monitor | hrs | Gladhand seal × 2 | 3 of 3 selected · 2.5 hrs labor · 3 parts · nothing on the work order yet | Discard | Add 3 Lines
    - 3 findings · labor and parts from your catalog | Drafting lines from Brake & Axle PM
- ('css', 'label', 0) -> clicked (3 matches)
    + 2 of 3 selected · 1.3 hrs labor · 1 parts · nothing on the work order yet | Add 2 Lines
    - 3 of 3 selected · 2.5 hrs labor · 3 parts · nothing on the work order yet | Add 3 Lines
- ('css', 'label', 1) -> clicked (3 matches)
    + 1 of 3 selected · 1.0 hrs labor · 1 parts · nothing on the work order yet | Add 1 Line
    - 2 of 3 selected · 1.3 hrs labor · 1 parts · nothing on the work order yet | Add 2 Lines
- ('css', 'label', 2) -> clicked (3 matches)
    + 0 of 3 selected · 0.0 hrs labor · 0 parts · nothing on the work order yet | Add 0 Lines
    - 1 of 3 selected · 1.0 hrs labor · 1 parts · nothing on the work order yet | Add 1 Line
- ('textp', 'Add 0 Line') -> clicked (1 matches)
    + 
    - 

## WO-05 ShopCoach off  (Prototype - Work Order Handoff.dc.html, 6.1s)
- toggle ShopCoach off -> clicked
    + S-81 · ABC Truck Lines · Inspection | Locked · read only | Inspection completed | Today 06:28 AM · William Johns · report posted to the work order | 9 OK | FINDINGS | Not OK | Brake & tire measurements · Axle 1 · Tire pressure · left outer | 42 psi | Not OK | Brake & tire measurements · Axle 1 · Tread depth · left outer | 4/32nds | Monitor | Air-brake system leak check | Note attached | The report is on the work order. Build the lines from the findings there. | View PDF | Go to work order | WHAT WAS ENTERED | every answer, section by section · read only | 1 | Brakes | Axle 1 · Tire pressure · left outer | 42 psi | Not OK | Axle 1 · Tire pressure · left inner | 98 psi | OK | Axle 1 · Tread de
    - 1 Not OK | 12 Sep · Sasha Reyes · template v1 | 14 May · Omar Diaz · template v1 | 2020 Kenworth T680 · 6130M | 28 Aug · William Johns · template v1 | 3 Jun · Sasha Reyes · template v1 | All OK | Annual DOT | Customers · Kustoms, LLC | Inspections | Inspections (5) | Invoices (3) | Licence plate — | Mileage 100,000 | Pre-trip DOT | S-47 | S-52 | S-69 | S-74 | S-81 | Today · William Johns · templat
- WO > Notes with ShopCoach off -> clicked
    + S-81 · Open · ABC Truck Lines · Unit 6130M | Work Order S-81 | Approved | New Line | Lines (0) | Parts (0) | Notes (2) | Timesheets | Finance | Inspection | Brake & Axle PM · completed | Today 06:28 AM · William Johns | 9 OK · 1 Monitor · 2 Not OK. Findings: tire pressure left outer 42 psi, tread depth left outer 4/32nds, slack adjuster travel on Monitor. | Open Inspection | Customer called about pickup | Yesterday · Kimberly Barnes
    - 1 | 1 Monitor | 2 | 2 Not OK | 4/32nds | 42 psi | 9 OK | 98 psi | Air system | Air-brake system leak check | Axle 1 · Tire pressure · left inner | Axle 1 · Tire pressure · left outer | Axle 1 · Tread depth · left outer | Brake & Axle PM | Brake & tire measurements · Axle 1 · Tire pressure · left outer | Brake & tire measurements · Axle 1 · Tread depth · left outer | Brake chamber condition | Brake
- Asset > Inspections with ShopCoach off -> clicked
    + Customers · Kustoms, LLC | 2020 Kenworth T680 · 6130M | VIN 1XKYD49X8LJ123456 | Mileage 100,000 | Licence plate — | Invoices (3) | Inspections (5) | Inspections | Brake & Axle PM | Today · William Johns · template v2 | 2 Not OK | 1 Monitor | S-81 | View | Pre-trip DOT | 12 Sep · Sasha Reyes · template v1 | All OK | S-74 | View | Brake & Axle PM | 28 Aug · William Johns · template v1 | 1 Not OK | S-69 | View | Annual DOT | 3 Jun · Sasha Reyes · template v1 | 1 Monitor | S-52 | View | Pre-trip DOT | 14 May · Omar Diaz · template v1 | All OK | S-47 | View
    - 9 OK · 1 Monitor · 2 Not OK. Findings: tire pressure left outer 42 psi, tread depth left outer 4/32nds, slack adjuster travel on Monitor. | Approved | Brake & Axle PM · completed | Customer called about pickup | Finance | Inspection | Lines (0) | New Line | Notes (2) | Open Inspection | Parts (0) | S-81 · Open · ABC Truck Lines · Unit 6130M | Timesheets | Today 06:28 AM · William Johns | View PDF 

## WO-06 Work order Notes tab, open inspection, PDF  (Prototype - Work Order Handoff.dc.html, 6.9s)
- ('text', 'Go to work order') -> clicked (1 matches)
    + S-81 · Open · ABC Truck Lines · Unit 6130M | Work Order S-81 | Approved | New Line | Lines (0) | Parts (0) | Notes (2) | Timesheets | Finance | Lines | No lines on this work order yet.
    - 1 | 1 Monitor | 2 | 2 Not OK | 4/32nds | 42 psi | 9 OK | 98 psi | AI | Air system | Air-brake system leak check | Axle 1 · Tire pressure · left inner | Axle 1 · Tire pressure · left outer | Axle 1 · Tread depth · left outer | Brake & Axle PM | Brake & tire measurements · Axle 1 · Tire pressure · left outer | Brake & tire measurements · Axle 1 · Tread depth · left outer | Brake chamber condition | 
- ('textp', 'Notes (') -> clicked (1 matches)
    + Inspection | Brake & Axle PM · completed | Today 06:28 AM · William Johns | 9 OK · 1 Monitor · 2 Not OK. Findings: tire pressure left outer 42 psi, tread depth left outer 4/32nds, slack adjuster travel on Monitor. | Open Inspection | View PDF | AI | Build lines | Customer called about pickup | Yesterday · Kimberly Barnes
    - Lines | No lines on this work order yet.
- ('text', 'View PDF', 0) -> clicked (1 matches)
    + Brake & Axle PM.pdf | Close | Inspection report · S-81
    - 
- ('text', 'Close') -> clicked (1 matches)
    + 
    - Brake & Axle PM.pdf | Close | Inspection report · S-81
- ('text', 'Open Inspection') -> clicked (1 matches)
    + S-81 · ABC Truck Lines · Inspection | Brake & Axle PM | Locked · read only | Inspection completed | Today 06:28 AM · William Johns · report posted to the work order | 9 OK | 1 Monitor | 2 Not OK | FINDINGS | Not OK | Brake & tire measurements · Axle 1 · Tire pressure · left outer | 42 psi | Not OK | Brake & tire measurements · Axle 1 · Tread depth · left outer | 4/32nds | Monitor | Air-brake system leak check | Note attached | ShopCoach can turn these 3 findings into work order lines with labor and parts. You review everything before it is added. | Go to work order | WHAT WAS ENTERED | every answer, section by section · read only | 1 | Brakes | Axle 1 · Tire pressure · left outer | 42 psi | 
    - 9 OK · 1 Monitor · 2 Not OK. Findings: tire pressure left outer 42 psi, tread depth left outer 4/32nds, slack adjuster travel on Monitor. | Approved | Brake & Axle PM · completed | Customer called about pickup | Finance | Inspection | Lines (0) | New Line | Notes (2) | Open Inspection | Parts (0) | S-81 · Open · ABC Truck Lines · Unit 6130M | Timesheets | Today 06:28 AM · William Johns | Work Orde

## WO-07 Build from Notes  (Prototype - Work Order Handoff.dc.html, 9.0s)
- ('text', 'Go to work order') -> clicked (1 matches)
    + S-81 · Open · ABC Truck Lines · Unit 6130M | Work Order S-81 | Approved | New Line | Lines (0) | Parts (0) | Notes (2) | Timesheets | Finance | Lines | No lines on this work order yet.
    - 1 | 1 Monitor | 2 | 2 Not OK | 4/32nds | 42 psi | 9 OK | 98 psi | AI | Air system | Air-brake system leak check | Axle 1 · Tire pressure · left inner | Axle 1 · Tire pressure · left outer | Axle 1 · Tread depth · left outer | Brake & Axle PM | Brake & tire measurements · Axle 1 · Tire pressure · left outer | Brake & tire measurements · Axle 1 · Tread depth · left outer | Brake chamber condition | 
- ('textp', 'Notes (') -> clicked (1 matches)
    + Inspection | Brake & Axle PM · completed | Today 06:28 AM · William Johns | 9 OK · 1 Monitor · 2 Not OK. Findings: tire pressure left outer 42 psi, tread depth left outer 4/32nds, slack adjuster travel on Monitor. | Open Inspection | View PDF | AI | Build lines | Customer called about pickup | Yesterday · Kimberly Barnes
    - Lines | No lines on this work order yet.
- ('textp', 'Build lines') -> clicked (1 matches)
    + Drafting lines from Brake & Axle PM | 3 findings · labor and parts from your catalog | Lines | No lines on this work order yet.
    - 9 OK · 1 Monitor · 2 Not OK. Findings: tire pressure left outer 42 psi, tread depth left outer 4/32nds, slack adjuster travel on Monitor. | AI | Brake & Axle PM · completed | Build lines | Customer called about pickup | Inspection | Open Inspection | Today 06:28 AM · William Johns | View PDF | Yesterday · Kimberly Barnes
- ('wait', 2500) -> waited
    + AI | SHOPCOACH LINE BUILDER | 3 lines drafted from Brake & Axle PM · review before adding | Edit any title, description or labor. Uncheck a line to leave it out. | Axle 1 · Tread depth · left outer | hrs | Steer tire × 1 | Valve stem × 1 | Axle 1 · Tire pressure · left outer | hrs | No parts | Air-brake system leak check · Monitor | hrs | Gladhand seal × 2 | 3 of 3 selected · 2.5 hrs labor · 3 parts · nothing on the work order yet | Discard | Add 3 Lines
    - 3 findings · labor and parts from your catalog | Drafting lines from Brake & Axle PM
- ('textp', 'Add 3 Line') -> clicked (1 matches)
    + Lines (3) | Parts (3) | 3 lines | 1 | Replace left outer steer tire | Tread at 4/32nds, below the 5/32nds minimum. | 1.2 hrs | Estimate | 2 | Inflate left outer to spec | 42 psi against 100 psi spec; check for a leak while replacing. | 0.3 hrs | Estimate | 3 | Leak-down test, air system | Loss above spec at idle; confirm source before release. | 1.0 hrs | Estimate | 3 lines added to S-81
    - 3 lines drafted from Brake & Axle PM · review before adding | 3 of 3 selected · 2.5 hrs labor · 3 parts · nothing on the work order yet | AI | Add 3 Lines | Air-brake system leak check · Monitor | Axle 1 · Tire pressure · left outer | Axle 1 · Tread depth · left outer | Discard | Edit any title, description or labor. Uncheck a line to leave it out. | Gladhand seal × 2 | Lines (0) | No lines on thi

## WO-08 Asset inspections tab, View, Build lines  (Prototype - Work Order Handoff.dc.html, 9.0s)
- ('text', 'Customers') -> clicked (1 matches)
    + Customers · Kustoms, LLC | 2020 Kenworth T680 · 6130M | VIN 1XKYD49X8LJ123456 | Mileage 100,000 | Licence plate — | Invoices (3) | Inspections (5) | Inspections | 1 of 5 has findings with no lines yet | Today · William Johns · template v2 | S-81 | View | Pre-trip DOT | 12 Sep · Sasha Reyes · template v1 | All OK | S-74 | View | 28 Aug · William Johns · template v1 | 1 Not OK | S-69 | View | Annual DOT | 3 Jun · Sasha Reyes · template v1 | S-52 | View | Pre-trip DOT | 14 May · Omar Diaz · template v1 | All OK | S-47 | View
    - 1 | 2 | 4/32nds | 42 psi | 9 OK | 98 psi | Air system | Air-brake system leak check | Axle 1 · Tire pressure · left inner | Axle 1 · Tire pressure · left outer | Axle 1 · Tread depth · left outer | Brake & tire measurements · Axle 1 · Tire pressure · left outer | Brake & tire measurements · Axle 1 · Tread depth · left outer | Brake chamber condition | Brakes | FINDINGS | Go to work order | Inspect
- ('text', 'View', 1) -> clicked (5 matches)
    + S-81 · ABC Truck Lines · Inspection | Locked · read only | Inspection completed | Today 06:28 AM · William Johns · report posted to the work order | 9 OK | FINDINGS | Not OK | Brake & tire measurements · Axle 1 · Tire pressure · left outer | 42 psi | Not OK | Brake & tire measurements · Axle 1 · Tread depth · left outer | 4/32nds | Monitor | Air-brake system leak check | Note attached | ShopCoach can turn these 3 findings into work order lines with labor and parts. You review everything before it is added. | View PDF | Go to work order | WHAT WAS ENTERED | every answer, section by section · read only | 1 | Brakes | Axle 1 · Tire pressure · left outer | 42 psi | Not OK | Axle 1 · Tire pressur
    - 1 Not OK | 1 of 5 has findings with no lines yet | 12 Sep · Sasha Reyes · template v1 | 14 May · Omar Diaz · template v1 | 2020 Kenworth T680 · 6130M | 28 Aug · William Johns · template v1 | 3 Jun · Sasha Reyes · template v1 | All OK | Annual DOT | Customers · Kustoms, LLC | Inspections | Inspections (5) | Invoices (3) | Licence plate — | Mileage 100,000 | Pre-trip DOT | S-47 | S-52 | S-69 | S-74 
- ('text', 'Customers') -> clicked (1 matches)
    + Customers · Kustoms, LLC | 2020 Kenworth T680 · 6130M | VIN 1XKYD49X8LJ123456 | Mileage 100,000 | Licence plate — | Invoices (3) | Inspections (5) | Inspections | 1 of 5 has findings with no lines yet | Today · William Johns · template v2 | S-81 | View | Pre-trip DOT | 12 Sep · Sasha Reyes · template v1 | All OK | S-74 | View | 28 Aug · William Johns · template v1 | 1 Not OK | S-69 | View | Annual DOT | 3 Jun · Sasha Reyes · template v1 | S-52 | View | Pre-trip DOT | 14 May · Omar Diaz · template v1 | All OK | S-47 | View
    - 1 | 2 | 4/32nds | 42 psi | 9 OK | 98 psi | Air system | Air-brake system leak check | Axle 1 · Tire pressure · left inner | Axle 1 · Tire pressure · left outer | Axle 1 · Tread depth · left outer | Brake & tire measurements · Axle 1 · Tire pressure · left outer | Brake & tire measurements · Axle 1 · Tread depth · left outer | Brake chamber condition | Brakes | FINDINGS | Go to work order | Inspect
- ('textp', 'Build lines') -> clicked (1 matches)
    + S-81 · Open · ABC Truck Lines · Unit 6130M | Work Order S-81 | Approved | New Line | Lines (0) | Parts (0) | Notes (2) | Timesheets | Finance | Drafting lines from Brake & Axle PM | 3 findings · labor and parts from your catalog | Lines | No lines on this work order yet.
    - 1 Monitor | 1 Not OK | 1 of 5 has findings with no lines yet | 12 Sep · Sasha Reyes · template v1 | 14 May · Omar Diaz · template v1 | 2 Not OK | 2020 Kenworth T680 · 6130M | 28 Aug · William Johns · template v1 | 3 Jun · Sasha Reyes · template v1 | AI | All OK | Annual DOT | Brake & Axle PM | Build lines | Customers · Kustoms, LLC | Inspections | Inspections (5) | Invoices (3) | Licence plate — |
- ('wait', 2500) -> waited
    + AI | SHOPCOACH LINE BUILDER | 3 lines drafted from Brake & Axle PM · review before adding | Edit any title, description or labor. Uncheck a line to leave it out. | Axle 1 · Tread depth · left outer | hrs | Steer tire × 1 | Valve stem × 1 | Axle 1 · Tire pressure · left outer | hrs | No parts | Air-brake system leak check · Monitor | hrs | Gladhand seal × 2 | 3 of 3 selected · 2.5 hrs labor · 3 parts · nothing on the work order yet | Discard | Add 3 Lines
    - 3 findings · labor and parts from your catalog | Drafting lines from Brake & Axle PM

## WO-09 Other tabs  (Prototype - Work Order Handoff.dc.html, 6.5s)
- ('text', 'Go to work order') -> clicked (1 matches)
    + S-81 · Open · ABC Truck Lines · Unit 6130M | Work Order S-81 | Approved | New Line | Lines (0) | Parts (0) | Notes (2) | Timesheets | Finance | Lines | No lines on this work order yet.
    - 1 | 1 Monitor | 2 | 2 Not OK | 4/32nds | 42 psi | 9 OK | 98 psi | AI | Air system | Air-brake system leak check | Axle 1 · Tire pressure · left inner | Axle 1 · Tire pressure · left outer | Axle 1 · Tread depth · left outer | Brake & Axle PM | Brake & tire measurements · Axle 1 · Tire pressure · left outer | Brake & tire measurements · Axle 1 · Tread depth · left outer | Brake chamber condition | 
- ('textp', 'Parts (') -> clicked (1 matches)
    + This tab is not part of the prototype.
    - Lines | No lines on this work order yet.
- ('text', 'Timesheets') -> clicked (1 matches)
    + 
    - 
- ('text', 'Finance') -> clicked (1 matches)
    + 
    - 

## WO-10 Phone: target sheet  (Prototype - Work Order Handoff.dc.html, 8.4s)
- ('text', 'Phone') -> clicked (1 matches)
    + Work Order | Asset
    - Customers | KB | Parts | Reports | Schedule | Staging Heavy Duty - 9919 | Work Orders
- ('textp', 'Build lines') -> clicked (1 matches)
    + Build the lines on | This work order | S-81 · Approved | A new work order | Seeded with this customer & unit
    - 
- ('text', 'This work order') -> clicked (1 matches)
    + S-81 · Open · ABC Truck Lines · Unit 6130M | Work Order S-81 | Approved | New Line | Lines (0) | Parts (0) | Notes (2) | Timesheets | Finance | Drafting lines from Brake & Axle PM | 3 findings · labor and parts from your catalog | Lines | No lines on this work order yet.
    - 1 | 1 Monitor | 2 | 2 Not OK | 4/32nds | 42 psi | 9 OK | 98 psi | A new work order | AI | Air system | Air-brake system leak check | Axle 1 · Tire pressure · left inner | Axle 1 · Tire pressure · left outer | Axle 1 · Tread depth · left outer | Brake & Axle PM | Brake & tire measurements · Axle 1 · Tire pressure · left outer | Brake & tire measurements · Axle 1 · Tread depth · left outer | Brake c
- ('wait', 2500) -> waited
    + AI | SHOPCOACH LINE BUILDER | 3 lines drafted from Brake & Axle PM · review before adding | Edit any title, description or labor. Uncheck a line to leave it out. | Axle 1 · Tread depth · left outer | hrs | Steer tire × 1 | Valve stem × 1 | Axle 1 · Tire pressure · left outer | hrs | No parts | Air-brake system leak check · Monitor | hrs | Gladhand seal × 2 | 3 of 3 selected · 2.5 hrs labor · 3 parts · nothing on the work order yet | Discard | Add 3 Lines
    - 3 findings · labor and parts from your catalog | Drafting lines from Brake & Axle PM

## WO-11 After lines added, Build lines gone  (Prototype - Work Order Handoff.dc.html, 9.4s)
- ('textp', 'Build lines') -> clicked (1 matches)
    + BUILD THE LINES ON | This work order | S-81 · Approved | A new work order | Seeded with this customer & unit
    - 
- ('text', 'This work order') -> clicked (1 matches)
    + S-81 · Open · ABC Truck Lines · Unit 6130M | Work Order S-81 | Approved | New Line | Lines (0) | Parts (0) | Notes (2) | Timesheets | Finance | Drafting lines from Brake & Axle PM | 3 findings · labor and parts from your catalog | Lines | No lines on this work order yet.
    - 1 | 1 Monitor | 2 | 2 Not OK | 4/32nds | 42 psi | 9 OK | 98 psi | A new work order | AI | Air system | Air-brake system leak check | Axle 1 · Tire pressure · left inner | Axle 1 · Tire pressure · left outer | Axle 1 · Tread depth · left outer | BUILD THE LINES ON | Brake & Axle PM | Brake & tire measurements · Axle 1 · Tire pressure · left outer | Brake & tire measurements · Axle 1 · Tread depth ·
- ('wait', 2500) -> waited
    + AI | SHOPCOACH LINE BUILDER | 3 lines drafted from Brake & Axle PM · review before adding | Edit any title, description or labor. Uncheck a line to leave it out. | Axle 1 · Tread depth · left outer | hrs | Steer tire × 1 | Valve stem × 1 | Axle 1 · Tire pressure · left outer | hrs | No parts | Air-brake system leak check · Monitor | hrs | Gladhand seal × 2 | 3 of 3 selected · 2.5 hrs labor · 3 parts · nothing on the work order yet | Discard | Add 3 Lines
    - 3 findings · labor and parts from your catalog | Drafting lines from Brake & Axle PM
- ('textp', 'Add 3 Line') -> clicked (1 matches)
    + Lines (3) | Parts (3) | 3 lines | 1 | Replace left outer steer tire | Tread at 4/32nds, below the 5/32nds minimum. | 1.2 hrs | Estimate | 2 | Inflate left outer to spec | 42 psi against 100 psi spec; check for a leak while replacing. | 0.3 hrs | Estimate | 3 | Leak-down test, air system | Loss above spec at idle; confirm source before release. | 1.0 hrs | Estimate | 3 lines added to S-81
    - 3 lines drafted from Brake & Axle PM · review before adding | 3 of 3 selected · 2.5 hrs labor · 3 parts · nothing on the work order yet | AI | Add 3 Lines | Air-brake system leak check · Monitor | Axle 1 · Tire pressure · left outer | Axle 1 · Tread depth · left outer | Discard | Edit any title, description or labor. Uncheck a line to leave it out. | Gladhand seal × 2 | Lines (0) | No lines on thi
- ('textp', 'Notes (') -> clicked (1 matches)
    + Inspection | Brake & Axle PM · completed | Today 06:28 AM · William Johns | 9 OK · 1 Monitor · 2 Not OK. Findings: tire pressure left outer 42 psi, tread depth left outer 4/32nds, slack adjuster travel on Monitor. | Open Inspection | View PDF | Customer called about pickup | Yesterday · Kimberly Barnes
    - 0.3 hrs | 1 | 1.0 hrs | 1.2 hrs | 2 | 3 | 3 lines | 42 psi against 100 psi spec; check for a leak while replacing. | Estimate | Inflate left outer to spec | Leak-down test, air system | Lines | Loss above spec at idle; confirm source before release. | Replace left outer steer tire | Tread at 4/32nds, below the 5/32nds minimum.
- ('text', 'Customers') -> clicked (1 matches)
    + Customers · Kustoms, LLC | 2020 Kenworth T680 · 6130M | VIN 1XKYD49X8LJ123456 | Mileage 100,000 | Licence plate — | Invoices (3) | Inspections (5) | Inspections | Brake & Axle PM | Today · William Johns · template v2 | 2 Not OK | 1 Monitor | S-81 | View | Pre-trip DOT | 12 Sep · Sasha Reyes · template v1 | All OK | S-74 | View | Brake & Axle PM | 28 Aug · William Johns · template v1 | 1 Not OK | S-69 | View | Annual DOT | 3 Jun · Sasha Reyes · template v1 | 1 Monitor | S-52 | View | Pre-trip DOT | 14 May · Omar Diaz · template v1 | All OK | S-47 | View
    - 9 OK · 1 Monitor · 2 Not OK. Findings: tire pressure left outer 42 psi, tread depth left outer 4/32nds, slack adjuster travel on Monitor. | Approved | Brake & Axle PM · completed | Customer called about pickup | Finance | Inspection | Lines (3) | New Line | Notes (2) | Open Inspection | Parts (3) | S-81 · Open · ABC Truck Lines · Unit 6130M | Timesheets | Today 06:28 AM · William Johns | View PDF 

## FD-01 A6 live: Mark field OK tooltip, press, Undo  (Inspection Fill V2 - Desktop.dc.html, 5.5s)
- ('css', "#a6 button:has-text('Mark field OK')") -> clicked (1 matches)
    + 2 positions marked OK
    - 
- ('text', 'Undo') -> clicked (2 matches)
    + 
    - 

## FD-02 A6 live: Single/Dual, verdict menu  (Inspection Fill V2 - Desktop.dc.html, 6.1s)
- ('css', "#a6 button:has-text('Single')") -> clicked (1 matches)
    + 1 position Monitor
    - 
- ('css', "#a6 button:has-text('Dual')") -> clicked (1 matches)
    + 
    - 1 position Monitor
- ('css', '#a6 .grp button', 1) -> FAILED target not found (0 matches)
    + 
    - 
- ('text', 'Not OK', -1) -> clicked (8 matches)
    + 
    - 

## HUB-01 Hub links  (Prototype - Hub.dc.html, 4.7s)
- ('textp', 'Template builder') -> clicked (1 matches)
    + Prototype hub | Template builder · checkbox and per axle are live, the other field types are disabled | Desktop | Phone | Work Orders | Schedule | Customers | Parts | Reports | Admin | Staging Heavy Duty - 9919 | AS | Admin · Inspection templates | Brake & Axle PM | Edit | Preview | Published | Publish | OUTLINE | Brakes | Air system | + Add Section | 2 fields | Brake & tire measurements | Per axle · Tire pressure (psi), Tread depth (32nds), Brake lining (in.), Push-rod travel (in.) · 3 axles | Brake chamber condition | Checkbox · OK / Monitor / Not OK / N/A · reference file · note required if Monitor / Not OK | OK | Check the dust boot is seated before closing the card. | Not OK | Tag the u
    - 3 | Add checkbox and per axle fields, rename responses, turn on follow-ups and acknowledgement, set validation, then switch to Preview. | All screens (static artboards) | Conditional follow-up artboards | Digital Inspections V2 | Filling an inspection | Inspection → work order | Reference | SV-8181 · DIGITAL INSPECTIONS V2 · PROTOTYPE | Template builder | The completed inspection, with ShopCoach o