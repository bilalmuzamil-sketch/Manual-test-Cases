# PO questions from the 6597 build verification — PREPARED, NOT SENT

Rule 66: the question sheet is the last thing sent, once everything answerable without the PO is
done. These three are held for the QA lead to route.

| # | Question, in plain words | Why it is being asked | The cases it decides |
|---|---|---|---|
| 1 | **Can a part in inventory ever be held in no bin at all?** Every one of the 6,879 parts on the QA branch sits in at least one bin, and the screen that edits a part will not let you remove its only bin row — the little delete control only appears once there are two. | The specification describes a card that reads **"Not stocked"** for a part with no bins, and says such a part gets no allocation and no "Pulled from" chip. If the product never allows a part to have no bins, neither of those can ever be seen. | [C45239](https://shopview.testrail.io/index.php?/cases/view/45239), and the third leg of [C45222](https://shopview.testrail.io/index.php?/cases/view/45222) |
| 2 | **Can a part be saved with no cost and no sell price at all — genuinely blank, not 0.00?** The 18 parts on the branch that look priceless all actually hold 0.00. | The specification says that when a selected part has no cost or sell price on record, those two fields open **empty** and the user must fill them in. If the product always stores 0.00, the fields will always open with a number in them. | [C45060](https://shopview.testrail.io/index.php?/cases/view/45060) |
| 3 | **What makes a work order un-editable for a reason other than its status?** A lock? A closed accounting period? An integration hold? | The specification says the Add Part button and the Edit control are hidden when a work order "cannot be edited for any other existing reason", and nobody here knows what that covers, so the case cannot be made runnable — it is the one precondition left in the suite that names a state instead of a route. | [C44996](https://shopview.testrail.io/index.php?/cases/view/44996) |

**None of these is a defect.** Each is a case whose expectation may describe a state the product does
not produce — which is a question for the person who wrote the requirement, not a bug report
(Rule 58: an ambiguous source is never resolved by looking at the build).
