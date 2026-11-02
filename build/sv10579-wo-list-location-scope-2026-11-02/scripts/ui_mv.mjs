import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const rd=f=>fs.readFileSync('/tmp/sv10579/'+f,'utf8').trim(); const Z=JSON.parse(rd('br-z.json'));
const s=await open({env:'branch',ticket:'10579',dir:'/tmp/qa1',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')}});
const p=s.page; const D='/tmp/sv10579/ui'; fs.mkdirSync(D,{recursive:true});
p.on('request',r=>{if(r.method()!=='GET'&&r.url().includes('/api/')) console.log('REQ',r.method(),r.url().replace(/.*\/api\//,''),(r.postData()||'').slice(0,250));});
p.on('response',async r=>{if(r.request().method()!=='GET'&&r.url().includes('/api/')) console.log('RES',r.status(),(await r.text().catch(()=>'' )).slice(0,200));});
await s.go('/workorders'); await p.waitForTimeout(3000);
const hdr=()=>p.evaluate(()=>document.querySelector('[data-test-id="profile_menu_button"]').innerText.split('\n')[0]);
if(!(await hdr()).includes('Lethbridge')){ await p.click('[data-test-id="profile_menu_button"]'); await p.waitForTimeout(1000); await p.click('[data-test-id="select_location"]'); await p.waitForTimeout(1200);
  for(const e of await p.$$('.q-menu .q-item, [role=option]')){ const t=(await e.innerText()).trim(); if(t.split('\n').pop().includes('Lethbridge')){ await e.click(); await p.waitForTimeout(4000); break; } } }
console.log('loc',await hdr());
await s.go('/workorders/'+Z.zId+'/lines'); await p.waitForTimeout(4000);
await p.waitForTimeout(1000); console.log('url',p.url());
const tabs=await p.$$('[role=tab], .q-tab'); for(const t of tabs){ if(/^Parts/.test((await t.innerText()).trim())){ await t.click(); await p.waitForTimeout(3000); break; } }
const ids=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(x=>/part|kebab|menu|more|move|tab/i.test(x)));
console.log([...new Set(ids)].join(' ').slice(0,1500));
await p.screenshot({path:D+'/z-parts.png'});
const row='[data-test-id="table_row_part_request_d40421ca-3a99-44f2-a4b7-77d2d1b81e92_2a0b705e-2a28-494e-b15d-40104d5dc0ed"]';
const btn=await p.$(row+' [data-test-id="button_part_request_action"]')||await p.$('[data-test-id="button_part_request_action"]'); await btn.click(); await p.waitForTimeout(1500);
const items=await p.$$('.q-menu .q-item'); for(const e of items) console.log('MENU',(await e.innerText()).replace(/\n/g,' | '), await e.getAttribute('data-test-id'));
await p.screenshot({path:D+'/z-menu.png'});
for(const e of items){ if(/move/i.test(await e.innerText())){ await e.click(); await p.waitForTimeout(3000); break; } }
await p.screenshot({path:D+'/z-move-dialog.png'});
const dids=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.getAttribute('data-test-id')+':'+(e.innerText||'').slice(0,40).replace(/\n/g,' ')));
console.log('DIALOG',dids.join(' || ').slice(0,1500));
const inp=await p.$('.q-dialog input'); if(inp){ await inp.click(); await p.waitForTimeout(1500); let opts=await p.$$eval('.q-menu .q-item',es=>es.map(e=>e.innerText.replace(/\n/g,' ')).slice(0,30)); console.log('OPTS-empty',JSON.stringify(opts));
  await inp.fill('17581'); await p.waitForTimeout(3000); opts=await p.$$eval('.q-menu .q-item',es=>es.map(e=>e.innerText.replace(/\n/g,' '))); console.log('OPTS-17581',JSON.stringify(opts)); await p.screenshot({path:D+'/z-move-search.png'}); }
process.exit(0);
