// The clear control inside the search box has no check in our suite (noted when the lane paused on
// 24 September). SV-10068 states the requirement in writing, so the Expected quotes it verbatim
// rather than being invented (Rule 114(a)). Case creation is expressly permitted (Rule 62-a).
// Block tags only - inline styling tags render literally when written through the API.
import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';

const title = 'The clear control appears only once you type, and empties the box without closing';

const preconds = [
'<p>You need nothing set up beyond being able to sign in. Any records will do.</p>',
'<ol>',
'<li>Sign in to ShopView.</li>',
'<li>Open the search window: click the Search box in the top bar, or press Ctrl and K together (Cmd and K on a Mac). A panel opens in the middle of the screen with a search box at the top, a row of tabs beneath it (All, Work orders, Customers, Assets, Parts, Vendors, Part sales, Purchase orders, Vendor invoices), and either your recent searches or a short line of helper text below that.</li>',
'<li>Have in mind any word that will find something on your shop - a customer name, part of a work order number, anything. For example on the test shop "Bridgeport" finds a customer; use whatever you know exists on yours.</li>',
'</ol>',
].join('');

const steps = [
'<ol>',
'<li>With the search window open and nothing typed yet, look at the right-hand end of the search box. Note whether a small clear icon (an x) is showing inside it.</li>',
'<li>Be careful not to confuse it with "Clear all", which sits to the right of the "Recent searches" heading further down and belongs to your search history, not to the box.</li>',
'<li>Now type your word into the search box and wait for results.</li>',
'<li>Look at the right-hand end of the search box again. Note whether the clear icon is showing now.</li>',
'<li>Click the clear icon.</li>',
'<li>Note three things: whether the search window is still open, whether the box is now empty, and whether you can carry on typing straight away without clicking back into it.</li>',
'</ol>',
].join('');

const expected = [
'<ol>',
'<li>Before anything is typed, the clear icon is NOT shown inside the search box. ("Clear all" beside the Recent searches heading is a different control and may be there - it empties your search history, not the box.)</li>',
'<li>Once something has been typed, the clear icon appears at the right-hand end of the search box.</li>',
'<li>Clicking it empties the search box.</li>',
'<li>Clicking it does NOT close the search window - the window stays open, and the cursor stays in the box so you can type again immediately.</li>',
'</ol>',
'<hr />',
'<p>Source</p>',
'<ul>',
'<li>Epic SV-9160. The requirement is stated in SV-10068 "UI / UX Fixes" (https://shopview.atlassian.net/browse/SV-10068), read on 28 September 2026, word for word: "This icon should be only shown when user has typed something in. The other thing is it shouldn\'t close the search modal, just clear search input" and "Clear icon shouldn\'t be shown when nothing is typed in."</li>',
'<li>The Global Search product requirements (Confluence page 576978945) describe the separate "Clear all" action on the Recent searches header, and do not cover the clear control inside the box - which is why this check names SV-10068 as its source.</li>',
'</ul>',
'<p>Last checked against build v26.39.1-02c6b6c on 9/28/2026.</p>',
'<p>AUTOMATION: READY</p>',
].join('');

const r = await api('add_case/6721', { method:'POST', body:{
  title, custom_preconds:preconds, custom_steps:steps, custom_expected:expected,
  custom_automation_type: 2, custom_atmstatus: 1, refs:'SV-10068', priority_id: 2, type_id: 5 } });
console.log('add_case ->', r.status);
if (r.status !== 200) { console.log(JSON.stringify(r.body).slice(0,400)); process.exit(1); }
const c = r.body;
console.log('created C' + c.id, '|', c.title, '(' + c.title.length + ' characters)');
console.log('automation type:', c.custom_automation_type, '| section', c.section_id, '| refs', c.refs);
const bad=/<(b|i|u|em|strong|code|br)\b/i;
for (const f of ['custom_preconds','custom_steps','custom_expected']) {
  const v=c[f]||'';
  console.log(' ', f, '| block tags:', /<(p|ol|ul|li|hr)\b/i.test(v), '| stray inline tags:', bad.test(v));
}
console.log('marker present exactly once:', (c.custom_expected.match(/AUTOMATION: READY/g)||[]).length);
console.log('\nC' + c.id + ' — https://shopview.testrail.io/index.php?/cases/view/' + c.id);
