# Update — the current reading field, and the date a meter interval resolves to

Targeted change to the existing Maintenance Reminders canvas. Everything else stays as it is.

---

## Use one unit everywhere in this update

Every artboard below shows the same truck. The numbers must agree with each other — the current gallery's do not, and the arithmetic is checkable by anyone reading it.

- **Unit 402**, Freightliner Cascadia
- **Last real reading: 342,417 mi, taken 29 Aug 2026**, on work order **S3780-15211**
- **Today is 4 Sep 2026** — so every projection runs **6 days**
- Measured rate from its last 6 visits: **1,500 mi/week** (214/day)
- Rate recorded at enrolment: **2,000 mi/week** (286/day)
- **PM-A**: every 15,000 mi. Last done at 331,000, so the threshold is **346,000**

Derived values, and these are the only ones that may appear:

| | |
|---|---|
| Measured estimate | 342,417 + (214 × 6) = **≈ 343,700** |
| Assumed estimate | 342,417 + (286 × 6) = **≈ 344,100** |
| PM-A resolves to | (346,000 − 343,703) ÷ 214 ≈ 11 days → **about 15 September** |

**Do not invent other figures.** A reader who does the arithmetic must find it correct.

---

## 1. The gallery becomes four states, not six

Replace `CURRENT READING · SIX STATES` with **four**. The old six split one idea into several chips and invited the question *why does this state differ from that one*. These four differ in kind.

| Chip | When | Number |
|---|---|---|
| **Recorded** | a real reading exists | `342,417 mi` — exact, no `≈`, shown exactly as entered |
| **Measured** | seen enough times to work out its own rate | `≈ 343,700 mi` |
| **Assumed** | using the rate recorded at enrolment | `≈ 344,100 mi` |
| **No reading yet** | nothing to estimate from | no number |

**Delete** the separate `Stated`, `Guess` and `Later` cards.

- `Stated` and `Guess` merge into **Assumed** — see area 4. Whether the rate was typed by the customer or prefilled from a running type is stored, but it is not a state on screen.
- `Later` was never a fifth kind of guess. A telematics value **is** a Recorded reading with a different source line. Show it as a **second Recorded card**, marked *later*: `342,880 mi · Samsara · read 06:14 today`.

## 2. The line beneath the number

**Replace `as of today` on every estimated card.** It is technically true and it hides the only thing that matters — how far the projection has run from real evidence. Six days from a real reading is trustworthy; six months is fiction, and both currently read the same.

Estimated cards carry **how old the underlying reading is**:

> `≈ 343,700 mi` · `Measured from 6 visits · last read 6 days ago`
> `≈ 344,100 mi` · `2,000 mi/week from enrolment · last read 6 days ago`

Recorded cards keep **when the reading was taken**:

> `342,417 mi` · `Recorded 29 Aug on WO S3780-15211`
> `342,880 mi` · `Samsara · read 06:14 today`

The empty state says what is missing and what would fix it:

> `No reading yet` · `Seen once, on 3 Mar 2026`

**Also draw one stale card**, so the difference is visible in the gallery:

> `≈ 362,500 mi` · `Measured from 6 visits · last read 94 days ago` — with the age treated as a warning, not as neutral text.

## 3. Rounding carries the uncertainty

- **Recorded** shows exactly what was entered. `342,417`, never `342,000` — a rounded real reading looks synthetic.
- **Estimates round, and coarsen as the projection lengthens.** Under 30 days → nearest 100. Beyond that → nearest 500.

## 4. Tooltips — one per state, plain language

An info icon on each card. This is the copy:

**Recorded**
> Someone entered this on 29 August, on work order S3780-15211. It's the last real reading we have.

**Measured**
> We can't see this unit's odometer. This is worked out from how far it ran between its last 6 visits — about 1,500 miles a week. The last real reading was 6 days ago.

**Assumed**
> We can't see this unit's odometer, and we haven't seen it often enough to measure how it runs. This uses the 2,000 miles a week recorded when it was enrolled. The last real reading was 6 days ago.

**No reading yet**
> We have no reading and nothing to estimate from. Add a reading, or tell us roughly how far this unit runs in a week.

## 5. Engine hours are a second, parallel field

Same component, its own rate, **never derived from mileage**. A vocational unit logs around 2,000 hours and 18,000 miles a year, so one says nothing about the other.

Where an asset has both meters, draw **two fields side by side**, each with its own chip and its own tooltip. Do not merge them into one control.

---

## 6. A meter interval always resolves to a date — show it

**The change that makes the feature work at all.** We cannot see anyone's odometer, so a distance-only service would otherwise sit silent until someone volunteers a number. It never does so silently: the interval always resolves to a date, and the date is always visible with where it came from.

**On the service, in the programme editor**, beneath the interval:

> `15,000 mi` · `for this unit, about 15 September`

Info icon:
> We can't see this unit's odometer, so we work out when it will reach 15,000 miles from how it has been running, and remind you then. If anyone enters a real reading, this date moves.

**On a worklist row and on the asset's service row**, the same idea in the *why it is here* cell:

> `PM-A · due around 15 Sep · estimated from 6 visits`
> `PM-A · due around March · estimated, we've seen this unit once`

Note the second: **where confidence is low, show a month, not a day.** A date to the day claims a precision we do not have, and the spread between a long-haul and a vocational unit on the same interval is more than a year.

**Remove the earlier "add a calendar backstop" offer** from the trigger step. It is no longer needed — the date is always derived, so there is nothing for a backstop to catch.

---

## 7. The enrolment dialog gains one required field

This is what guarantees a date always exists.

**`Roughly how far does this unit run in a week?`** — required whenever the service being enrolled watches only a meter and the unit has no visit history. It is answerable from memory, which is the point: nobody has to walk out to the truck.

Beside it, **`What kind of running does it do?`** — long-haul · regional · local · vocational. Selecting one **prefills the weekly figure**, which the user can then correct. It is a prefill, not a separate setting, and it must not be drawn as its own tier or chip.

Below both, show live what it produces, so the consequence is visible before saving:

> `PM-A will come due around 15 September`

---

## 8. Rules

- No explanatory captions or annotations on the artboards. Everything users need is in the tooltips above.
- Existing design-system components only.
- Lay the four states in **one row, in the order given**, beneath the field they belong to. Place the stale card and the telematics card in the same row, at the end.
