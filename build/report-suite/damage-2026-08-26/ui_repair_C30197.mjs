import pkg from '/opt/node22/lib/node_modules/playwright/index.js'; const { chromium } = pkg;
import fs from 'fs';
const port = fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim();
const cid = '30197';
const C = JSON.parse(fs.readFileSync('/tmp/testrail/creds.json','utf8'));
const BLOCKS = [
 ['1. The full "Sales By Representative" label renders without crowding against the entry’s edges and without truncation.',
  '2. The label is not shortened to fit — the fix is the entry’s horizontal padding, not the name.'],
 ['---',
  'This is the expected behaviour as per epic SV-8582, read on 17 August 2026, and the Sales By Representative report specification version 24 (S1-R7), read on 17 August 2026.',
  'Last checked against build v3.8-bd246fd on 8/18/2026.',
  'Re-checked against the live specification on 26 August 2026: the requirements this case cites are unchanged, so only the version cited above was updated.'],
 ['AUTOMATION: READY'],
];
const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium', args:['--no-sandbox'], proxy:{server:`http://127.0.0.1:${port}`} });
const p = await b.newPage({ ignoreHTTPSErrors:true, viewport:{width:1500,height:1200} });
await p.goto('https://shopview.testrail.io/index.php?/auth/login/',{waitUntil:'domcontentloaded'});
await p.fill('#name',C.email); await p.fill('#password',C.password); await p.click('#button_primary');
await p.waitForLoadState('networkidle');
const view = async()=>{ await p.goto(`https://shopview.testrail.io/index.php?/cases/view/${cid}`,{waitUntil:'networkidle'});
  return await p.evaluate(()=>[...document.querySelectorAll('div[class^="markdown"]')].map(d=>d.className+' :: '+d.innerText.slice(0,70))); };
console.log('BEFORE:', JSON.stringify(await view()));
await p.goto(`https://shopview.testrail.io/index.php?/cases/edit/${cid}`,{waitUntil:'networkidle'});
const ed=p.locator('#custom_expected_display .fr-element');
await ed.click(); await p.keyboard.press('Control+A'); await p.keyboard.press('Delete');
for (let i=0;i<BLOCKS.length;i++){
  if(i) await p.keyboard.press('Enter');
  for (let j=0;j<BLOCKS[i].length;j++){ if(j) await p.keyboard.press('Shift+Enter'); await p.keyboard.insertText(BLOCKS[i][j]); }
}
await p.waitForTimeout(800);
await p.click('#accept',{timeout:20000});
await p.waitForLoadState('networkidle'); await p.waitForTimeout(2000);
console.log('url after save:', p.url());
console.log('AFTER:', JSON.stringify(await view()));
await p.screenshot({path:'/tmp/rsbridge/C30197-after.png'});
await b.close();
