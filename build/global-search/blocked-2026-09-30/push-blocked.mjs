// Re-post the four HELD checks as Blocked, now carrying what was actually observed on the build.
// Blocked results need no permission (Rule 113). The run's case list is never touched (Rule 34).
import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
const BUILD='v26.39.2-51a35e1', DATE='2026-09-30';
const C={
146221:`This check is held by its own Expected Behaviour ("Do not pass or fail it. Record what you saw"), so no pass or fail is recorded. It was run in full on staging and here is what the screen showed.

Typed H8A3X9 into the search box and opened the Customers heading. One result came back:

  7 Star Truck Repair · 30 open
  305 Harris Cape, Priscillabury, Nunavut · Matched: H8A3X9

The postcode is shown in full and highlighted. The label in front of it is the generic word "Matched" rather than the name of the field, so the row does not say the match came from the postcode. On a part the site says "Category:" and on a supplier "Contact match:", so the site is inconsistent with itself here rather than wrong.

Also observed: the postcode only matches whole — H8A3, 8A3X9, H8A3X and A3X9 all return nothing. Typing it with a space (H8A 3X9) still finds the customer and the line still reads "Matched: H8A3X9", the stored postcode rather than what was typed.

Still held pending the Product Owner's answer on whether that label should name the field.`,
146241:`This check is held by its own Expected Behaviour ("Do not pass or fail it. Record what you saw"), so no pass or fail is recorded. It was run in full on staging and here is what the screen showed.

Typed .Brake Parts into the search box and opened the Parts heading. The parts that came back because of their category read:

  E2E fixed-price inventory part · 49 Available · INVFIXED-1789476537669 · Category: .Brake Parts

This one names the field and shows the whole value, which is the behaviour the other two held checks are missing. Two parts higher in the list came back because the words Brake and Parts appear in their own names, which is correct and not a problem.

Still held pending the Product Owner's answer, which here is only a confirmation that this is the wanted shape.`,
146250:`This check is held by its own Expected Behaviour ("Do not pass or fail it. Record what you saw"), so no pass or fail is recorded. It was run in full on staging and here is what the screen showed.

Typed the supplier's email address into the search box and opened the Vendors heading. One result came back:

  Rowcheck Quiet Fields Supply · Contact match: zzhidden.vendor@staging.shopview.local · (264) 400-0900 · 21 Result Row Way, Fernvale, Ohio

The whole email address is shown. The label reads "Contact match", which tells you the match came from the contact details but not that it was the email address rather than the phone number or the address.

Still held pending the Product Owner's answer on whether that label should name the field.`,
146301:`This check is held by its own Expected Behaviour ("Do not pass or fail it. Record what you saw"), so no pass or fail is recorded. It was run in full on staging and here is what the screen showed.

Typed a single 9 and waited: results came back straight away. Typed a second 9 and waited: those results were replaced by a different, larger set.

The three things this check says must not happen did not happen — nothing showed an error, nothing froze, and the first set of results did not stay on screen behind the second.

Still held pending the Product Owner's answer on whether searching should wait until two or three characters have been typed.`};
for (const [cid,comment] of Object.entries(C)) {
  const r = await api(`add_result_for_case/415/${cid}`, {method:'POST', body:{status_id:2, comment:`Blocked on staging, build ${BUILD}, ${DATE}.\n\n${comment}`, version:BUILD}});
  console.log('C'+cid, '->', r.status, r.status===200?'ok':JSON.stringify(r.body).slice(0,140));
}
