# Invoice UI Refresh — test cases ready to automate

**Build they were checked on:** `v26.35.5-8c3cc21` (QA branch sv8218) · **checked on:** 31 August 2026

**Ready to automate: 55 test cases.**

Every case in this list has been checked on the build, end to end:

1. The starting situation the case needs can actually be set up on the build.
2. The screens and menus the case sends you to are really there.
3. The buttons and controls the case names are where it says they are.
4. The steps work in the order they are written.
5. Every on-screen word the case quotes matches what the build actually shows.

Each one now ends with `AUTOMATION: READY` and records the build it was checked against.

**What has NOT changed:** what each case *expects* still comes from the specification, the epic and the stories — never from the build. The build only supplied the wording of labels and menu paths, and the pass/fail verdict.

---

## The cases, by area

### Addresses — 5 case(s)

| Case | Title |
|---|---|
| [C44908](https://shopview.testrail.io/index.php?/cases/view/44908) | Bill To block shows the customer name and address |
| [C44909](https://shopview.testrail.io/index.php?/cases/view/44909) | Remit Payment To shows when a payee is configured (both mechanisms) |
| [C44910](https://shopview.testrail.io/index.php?/cases/view/44910) | Bill To spans full width when Remit Payment To is absent |
| [C44911](https://shopview.testrail.io/index.php?/cases/view/44911) | Remit Payment To is hidden when no payee is configured |
| [C44912](https://shopview.testrail.io/index.php?/cases/view/44912) | Bill To address fields hide when empty; the name line always shows |

### Asset Section — 5 case(s)

| Case | Title |
|---|---|
| [C44924](https://shopview.testrail.io/index.php?/cases/view/44924) | Asset section shows Asset name and VIN / Serial when present |
| [C44925](https://shopview.testrail.io/index.php?/cases/view/44925) | Asset section can show Unit, Plate, Mileage and Eng Hrs |
| [C44926](https://shopview.testrail.io/index.php?/cases/view/44926) | Unit, Plate, Mileage and Eng Hrs each hide when empty |
| [C44927](https://shopview.testrail.io/index.php?/cases/view/44927) | VIN / Serial hides when the asset has neither; Asset name still shows |
| [C45171](https://shopview.testrail.io/index.php?/cases/view/45171) | Asset section is hidden when the work order has no asset attached |

### Cross-Cutting and Regression — 6 case(s)

| Case | Title |
|---|---|
| [C45186](https://shopview.testrail.io/index.php?/cases/view/45186) | A snapshot created after the redesign carries the new fields when reopened |
| [C45187](https://shopview.testrail.io/index.php?/cases/view/45187) | An emailed invoice attaches the redesigned PDF |
| [C45188](https://shopview.testrail.io/index.php?/cases/view/45188) | The on-screen preview matches the generated PDF with no markup stripped |
| [C45189](https://shopview.testrail.io/index.php?/cases/view/45189) | Currency and percentage formats follow existing conventions for US and Canadian shops |
| [C45192](https://shopview.testrail.io/index.php?/cases/view/45192) | Invoice preview fits a mobile viewport with no clipping and no header overlap |
| [C45194](https://shopview.testrail.io/index.php?/cases/view/45194) | Special characters in shop and customer names render correctly on the document |

### Disclaimer, Signature and Footer — 2 case(s)

| Case | Title |
|---|---|
| [C44957](https://shopview.testrail.io/index.php?/cases/view/44957) | Footer shows the shop tax identifier exactly, with no added label |
| [C44958](https://shopview.testrail.io/index.php?/cases/view/44958) | Disclaimer and footer tax identifier hide when not configured |

### Document Visual Standard — 7 case(s)

| Case | Title |
|---|---|
| [C44972](https://shopview.testrail.io/index.php?/cases/view/44972) | Only the closed palette colours appear on any document |
| [C44974](https://shopview.testrail.io/index.php?/cases/view/44974) | Typography uses Inter with the specified weights |
| [C44975](https://shopview.testrail.io/index.php?/cases/view/44975) | Print/PDF ink floor keeps text and rules dark enough |
| [C44976](https://shopview.testrail.io/index.php?/cases/view/44976) | Every document is fully legible in grayscale |
| [C44979](https://shopview.testrail.io/index.php?/cases/view/44979) | Section labels use the three-tier hierarchy with exact sizes and inks |
| [C45213](https://shopview.testrail.io/index.php?/cases/view/45213) | Multi-page document uses standard page-break behaviour |
| [C45214](https://shopview.testrail.io/index.php?/cases/view/45214) | On-screen document fits the viewport; wide elements scroll in their own container |

### Estimate and Invoice Specifics — 5 case(s)

| Case | Title |
|---|---|
| [C44959](https://shopview.testrail.io/index.php?/cases/view/44959) | Estimate and Invoice differ only as Section 3 specifies |
| [C44960](https://shopview.testrail.io/index.php?/cases/view/44960) | Estimate shows 'Work Summary', 'Estimated Total', and 'Estimate date' |
| [C44961](https://shopview.testrail.io/index.php?/cases/view/44961) | Invoice shows 'Work Performed', 'Balance', 'Invoice date' and 'Due date' |
| [C45176](https://shopview.testrail.io/index.php?/cases/view/45176) | Paid date is the most recent applied row and may fall before the invoice date |
| [C45178](https://shopview.testrail.io/index.php?/cases/view/45178) | A zero-total invoice with nothing applied is not treated as fully paid |

### Financial Summary — 4 case(s)

| Case | Title |
|---|---|
| [C44941](https://shopview.testrail.io/index.php?/cases/view/44941) | Summary shows gross Labor and Parts rows, and Shop supplies when charged |
| [C44943](https://shopview.testrail.io/index.php?/cases/view/44943) | Adjustments group shows rollup Labor/Parts then each work-order-wide row |
| [C44944](https://shopview.testrail.io/index.php?/cases/view/44944) | Summary shows Subtotal, one row per tax, and the grand Total |
| [C44945](https://shopview.testrail.io/index.php?/cases/view/44945) | Adjustments heading and tax rows hide when nothing applies |

### Masthead and Letterhead — 3 case(s)

| Case | Title |
|---|---|
| [C44901](https://shopview.testrail.io/index.php?/cases/view/44901) | Masthead shows the shop location's full identity details |
| [C44902](https://shopview.testrail.io/index.php?/cases/view/44902) | Shop logo shows when set; nothing (no placeholder) shows when unset |
| [C44907](https://shopview.testrail.io/index.php?/cases/view/44907) | Masthead identity fields each hide when empty |

### Order Reference Fields — 3 case(s)

| Case | Title |
|---|---|
| [C44914](https://shopview.testrail.io/index.php?/cases/view/44914) | Terms field always shows, even when no terms are set |
| [C44915](https://shopview.testrail.io/index.php?/cases/view/44915) | Authorizer field shows the selected authorizer's full name |
| [C44918](https://shopview.testrail.io/index.php?/cases/view/44918) | Customer PO, Authorizer and Approval Code each hide when empty |

### Paid Banner, Payments and Balance — 7 case(s)

| Case | Title |
|---|---|
| [C44946](https://shopview.testrail.io/index.php?/cases/view/44946) | Payments heading and each applied payment row show correctly |
| [C44948](https://shopview.testrail.io/index.php?/cases/view/44948) | Deposit and applied customer-account credit show as labeled payment rows |
| [C44949](https://shopview.testrail.io/index.php?/cases/view/44949) | Excess payment sub-line reads exactly per the credited/ to-be-credited rule |
| [C44950](https://shopview.testrail.io/index.php?/cases/view/44950) | Balance equals Total minus all applied amounts, floored at $0.00 |
| [C44953](https://shopview.testrail.io/index.php?/cases/view/44953) | $0.00 payment rows hidden; no-payments state shows heading with Balance = Total |
| [C44954](https://shopview.testrail.io/index.php?/cases/view/44954) | No paid banner when the invoice has no portal-processed payment |
| [C45174](https://shopview.testrail.io/index.php?/cases/view/45174) | A fully reversed payment does not appear in the Payments section |

### Work Section — 8 case(s)

| Case | Title |
|---|---|
| [C44929](https://shopview.testrail.io/index.php?/cases/view/44929) | Work heading is 'Work Summary' on Estimate and 'Work Performed' on Invoice |
| [C44930](https://shopview.testrail.io/index.php?/cases/view/44930) | Work line numbers are sequential and zero-padded to two digits |
| [C44931](https://shopview.testrail.io/index.php?/cases/view/44931) | Each work line shows name, and description and scope-of-work note when present |
| [C44932](https://shopview.testrail.io/index.php?/cases/view/44932) | Labor and Parts entries are labeled exactly 'Labor' and 'Parts' |
| [C44933](https://shopview.testrail.io/index.php?/cases/view/44933) | Invoice Details settings show or hide the per-entry figures |
| [C44934](https://shopview.testrail.io/index.php?/cases/view/44934) | Line-level fee shows as a plain amount; discount shows in parentheses |
| [C44935](https://shopview.testrail.io/index.php?/cases/view/44935) | Line footer shows Labor, Parts and Line total with the divider rule |
| [C44936](https://shopview.testrail.io/index.php?/cases/view/44936) | Empty work section shows heading; Summary divider still precedes summary |

---

## ✅ Build verified but NOT marked — waiting on your go-ahead

**4 case(s) passed every check on the build, but TestRail flags them **Automated**.** Rule 71 means I do not change an Automated case without your explicit go-ahead, and Rule 65 means Vladimir Tomovic gets told when one changes. So they are **verified and untouched** — their markers still read "Not available on Build to test Yet", and they still show raw code on screen because I did not repair them either.

| Case | Title | What I observed on the build |
|---|---|---|
| [C44919](https://shopview.testrail.io/index.php?/cases/view/44919) | Authorizer is selected in the work order customer contact card | passed all five checks |
| [C44920](https://shopview.testrail.io/index.php?/cases/view/44920) | Authorizer is optional and can be cleared with 'No authorizer' | passed all five checks |
| [C44921](https://shopview.testrail.io/index.php?/cases/view/44921) | Authorizer's phone shows below the name when the contact has one | passed all five checks |
| [C44922](https://shopview.testrail.io/index.php?/cases/view/44922) | Authorizer is locked once the work order is invoiced | passed all five checks |

**Say the word and I will mark all of them READY, repair their display, and give you the list to send Vlad.**

---

## Still being worked on — not in this handover

| Group | Cases | Plain-English reason |
|---|---|---|
| Needs a data state I could not create yet | 31 | Mostly the Credit Invoice (12) and Parts Sale (7) cases. Some of this is probably not built yet — see the Credit Invoice pack and the developer questions.|
| Quotes a word I could not find on screen | 13 | Mostly invoice states (part-paid, voided, draft) the build does not appear to have.|
| Steps do an action rather than read the document | 16 | These need a person to click through them once.|

**Total: 119 cases in the suite; 55 ready to automate.**

---

## Display check — can a person actually read these cases?

**114 of 119 cases in the suite now display correctly.**

TestRail decides *per case* whether to show the stored text as formatted text or as raw code, and it depends on how the case was last written: through the **API** it shows raw code, through the **web editor** it displays properly. Everything in this suite had been written by API, so 61 cases were showing testers this:

> `<ol><li>You are signed in to ShopView.</li>...</ol>`

All of those have now been re-saved through the editor and display properly. The words were never wrong — only buried. **No expected behaviour was changed in that repair, and no marker was lifted on a case that is not build verified.**

**Still showing raw code: 5 case(s)** — C44919, C44920, C44921, C44922, C44985. These are the Automated ones above; I left them alone under Rule 71.
