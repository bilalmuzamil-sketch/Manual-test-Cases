// Results for the three checks that turned out to be runnable after their rewrite.
// C146301 stays out of this - it is still held and is being deleted on the QA lead's instruction.
import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
const BUILD='staging 2026-09-30 19:18', D='2026-09-30';
const R={
146221:{s:1,c:`Passed on staging, ${D}.

This check was rewritten since it was last looked at, so it is no longer a held question - it now asks whether the labelled note on the row shows the WHOLE stored value rather than only the characters that were typed.

Typed H8A3X9 into the search box and opened the Customers heading. The row reads:

  7 Star Truck Repair · 31 open
  305 Harris Cape, Priscillabury, Nunavut · Postal code: H8A3X9

The note names the field ("Postal code") and shows the whole value.

Proof that it is showing the stored value and not the typing: typing it with a space, H8A 3X9, still finds the customer and the note still reads "Postal code: H8A3X9" - the stored form, not the form that was typed.

Worth noting separately: earlier the same day this same row read "Matched: H8A3X9", with a generic label that did not name the field. It now names it. Nothing was reported for that and nothing needs to be.

Also still open and unrelated to this result: postal code is not among the Customers indexed fields listed in the requirements (§4), yet it is matchable. That is question Q6 and is not part of this check.`},
146241:{s:5,c:`Failed on staging, ${D}.

The labelled note shows only the characters that were typed, not the whole stored value.

The part's category is ".Brake Parts". Typing the whole thing proves nothing, because the note would read the same either way - so it was typed as a fragment:

  typed ".Brake Parts"  ->  Category: .Brake Parts
  typed "Brake Part"    ->  Category: Brake Part      <- only what was typed
  typed "rake Part"     ->  Category: rake Part       <- only what was typed

The second and third are the fault. A person reading "Category: Brake Part" cannot tell which category this part is really in, and two parts in two different categories can draw the same note.

Already reported - no new ticket raised:
  SV-10634 - https://shopview.atlassian.net/browse/SV-10634 (Open)
  SV-10619 - https://shopview.atlassian.net/browse/SV-10619
  SV-10551 - https://shopview.atlassian.net/browse/SV-10551`},
146250:{s:5,c:`Failed on staging, ${D}.

The labelled note shows only the characters that were typed, not the whole stored value.

The supplier contact's email address is zzhidden.vendor@staging.shopview.local. Typed as a fragment:

  typed the whole address  ->  Contact match: zzhidden.vendor@staging.shopview.local
  typed "zzhidden"         ->  Contact match: ZZHIDDEN      <- only what was typed, and in capitals

"Contact match: ZZHIDDEN" tells the reader nothing about which address was matched, and any number of different addresses would draw the same note.

Already reported - no new ticket raised:
  SV-10634 - https://shopview.atlassian.net/browse/SV-10634 (Open)
  SV-10619 - https://shopview.atlassian.net/browse/SV-10619
  SV-10551 - https://shopview.atlassian.net/browse/SV-10551`}};
for (const [cid,{s,c}] of Object.entries(R)) {
  const r = await api(`add_result_for_case/415/${cid}`, {method:'POST', body:{status_id:s, comment:c, version:BUILD}});
  console.log('C'+cid, s===1?'Passed':'Failed', '->', r.status, r.status===200?'ok':JSON.stringify(r.body).slice(0,140));
}
