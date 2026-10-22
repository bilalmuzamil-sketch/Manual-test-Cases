**Question 1 — Three tests about usage tracking still ask for the spacing button on Board View**

What these tests check: when someone uses the Work Orders screens, the app quietly records what they did (which view they opened, which fields they turned on, which spacing they picked). Three tests check that this recording is correct.

What happened: all three tests tell the tester to change the spacing (Compact / Regular / Comfortable) while on Board View. In this release Board View no longer has that spacing button. The product document says so in plain words: "Board View shows no Density control in this release." So the tester cannot do that step. The product is behaving as the document says; it is the tests that are out of date.

One of the three also says the app should record "the spacing was loaded" twice, once for each of the two views that had spacing. Now only Tech View has spacing, so that number may now be 1. I cannot change what a test expects unless you tell me to.

Your options:
- (a) Change the spacing step in all three tests to Tech View, and in the third test change the expected number from 2 to 1. Then I run them again on production. **My recommendation** — it matches the current document, the same fix you approved for the "default spacing" test this afternoon.
- (b) Change only the spacing step to Tech View, and keep the expected number at 2. If production records it once, that test will show as Failed and I will tell you.
- (c) Leave all three as they are, marked Blocked, until spacing comes back to Board View.

If you do not answer: the three tests stay Blocked with the reason written on them. Nothing else waits on this.

**Question 2 — A test that compares a screen with production, while we are testing production itself**

What the test checks: on the Sales By Customer report, the customer filter behaves the same as it does on the live site (production) today: "1 selected" shows and there is no "Clear selection" button.

What happened: today's whole run is on production. So the "compare with production" step compares production with itself; there is nothing different to compare. Everything else the test describes was seen and is correct.

Your options:
- (a) Mark it Passed, with a note that on production the comparison is with itself. **My recommendation** — every behaviour it lists was seen.
- (b) Leave it without a production result; its earlier staging result stays as the record.

If you do not answer: it stays without a production result. Nothing else waits on this.

**Question 3 — The Work Orders list has no "page 2"; it loads more as you scroll**

What the test checks: with more work orders than fit on one page, the list shows all of them, each once, and the total is right. Its steps talk about choosing how many rows a page shows and going to page 2.

What happened: the list has no rows-per-page choice and no page 2. Instead it loads 30 more each time you scroll to the bottom. All 35 test work orders showed, each once, and the total was right ($8,469.30). The test itself already says it is waiting for your decision on exactly this.

Your options:
- (a) Count "loads more as you scroll" as the pages, and mark it Passed — as was done on staging on 17 October. **My recommendation.**
- (b) Keep it waiting for your decision.

If you do not answer: it stays waiting, as it is now. Nothing else waits on this.
