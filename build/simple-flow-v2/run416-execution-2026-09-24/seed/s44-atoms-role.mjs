// C44607's last two mappings: the settings page should follow Settings > App Settings, and fixing a
// part number into the catalogue should follow Catalog & Inventory: Create & Edit. Build one role
// with both taken away, so each can be checked against the people who do hold them.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { buildRole, verifyRole, editRole } from './lib-role2.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const NAME='ZZAUTOTEST No Settings No Catalog';
const MATRIX={'Catalog and Inventory':[true,false,false],'App settings':[false,false,false]};
const {browser,page}=await bootProdLogin('/administration/roles-permissions',{settle:14000,viewport:{width:1680,height:1000}});
page.setDefaultTimeout(45000);
const exists=await page.evaluate((n)=>!![...document.querySelectorAll('tr')].find(t=>(t.innerText||'').includes(n)),NAME);
console.log('the role already exists:',exists);
const r= exists ? await editRole(page,NAME,{matrix:MATRIX}) : await buildRole(page,NAME,{matrix:MATRIX});
(r.log||[]).forEach(l=>console.log('  ',l));
console.log('  ',r.created||r.saved||r.opened, r.anyway||'');
const back=await verifyRole(page,NAME,MATRIX);
console.log('  read back:',JSON.stringify(back.got));
const ok=back.got&&Object.entries(MATRIX).every(([k,v])=>back.got[k]&&v.every((x,i)=>x===null||back.got[k][i]===x));
console.log('  >>> it carries what its name says:',!!ok);
fs.writeFileSync(`${EV}/s44-atoms-role.json`,JSON.stringify({r,back,ok},null,1));
await browser.close();
