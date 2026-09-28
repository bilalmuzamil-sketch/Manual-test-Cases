// Capture the wrong highlight for the ticket. It shows on the FIRST search of a freshly opened
// app when the search is opened by clicking, so each attempt gets its own browser.
import fs from 'fs';
const P = await import('/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs');
for (let i = 1; i <= 6; i++) {
  const b = await P.openStaging('/customers', 'admin');
  await b.page.waitForTimeout(6000);
  await P.openPalette(b.page, 'click');
  await P.type(b.page, 'Bridgeport', 4200);
  const s = await P.read(b.page);
  console.log(`attempt ${i}: ${s.rowCount} rows, highlight at ${s.selectedIndex}`);
  if (s.selectedIndex > 0) {
    await b.page.screenshot({ path: `enter-defect/wrong-highlight.png` });
    fs.writeFileSync('enter-defect/wrong-highlight.json', JSON.stringify({
      attempt: i, rowCount: s.rowCount, selectedIndex: s.selectedIndex,
      topRow: s.rows[0].text.replace(/\s+/g, ' '),
      highlightedRow: s.rows[s.selectedIndex].text.replace(/\s+/g, ' '),
      allRows: s.rows.map(r => r.text.replace(/\s+/g, ' ').slice(0, 90)),
      groups: (s.groupRows || []).map(g => g.head.replace(/\s+/g, ' ')),
    }, null, 1));
    console.log('   captured:', s.rows[s.selectedIndex].text.replace(/\s+/g, ' ').slice(0, 60));
    await b.browser.close();
    break;
  }
  // and a correct one to sit beside it
  if (i === 1) await b.page.screenshot({ path: 'enter-defect/correct-highlight.png' });
  await b.browser.close();
}
