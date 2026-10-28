// New Inventory Part → pick a catalog part that has a manufacturer → sample the Manufacturer field every 150 ms (normal, then with the
// manufacturers list held back 3.5 s).
import {open} from '../../testing-tools/qa-session.mjs'; import * as D from './detect.mjs'; import fs from 'fs';
const [env,pn]=process.argv.slice(2); const out=`/tmp/s10928/${env}-invmanu`; fs.mkdirSync(out,{recursive:true});
const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa28'),user:'bilal.muzamil@shopview.com'});
const ctl={ms:3500,maxShots:0}; await D.install(s,ctl); const p=s.page; const R={env,pn,runs:[]};
for(const mode of ['normal','manufacturers-slow']){
  await p.unroute('**/*').catch(()=>{});
  if(mode==='manufacturers-slow') await p.route(/parts-catalogue\/manufacturers/,async r=>{ await new Promise(x=>setTimeout(x,3500)); r.continue(); });
  await s.go('/parts/inventory'); await p.waitForTimeout(5000); await D.reset(p);
  await p.locator('[data-test-id="button_new_inventory_part"]').click(); await p.waitForTimeout(2000);
  await p.locator('[data-test-id="select_catalogue_part"]').click(); await p.keyboard.type(pn,{delay:40}); await p.waitForTimeout(3500);
  const opts=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.replace(/\s+/g,' ').trim()).slice(0,3));
  await p.locator('.q-menu .q-item',{hasText:pn}).first().click(); const t0=Date.now(); const seq=[]; let last=null;
  while(Date.now()-t0<7000){ const v=await p.evaluate(()=>{const e=document.querySelector('[data-test-id="select_manufacturer"]'); const f=e&&(e.closest('.q-field')||e); return f?f.innerText.replace(/\s+/g,' ').replace(/^Manufacturer/,'').replace('arrow_drop_down','').trim():'(none)';});
    if(v!==last){ seq.push([Date.now()-t0,v]); last=v; await p.screenshot({path:`${out}/${mode}-${seq.length}.png`}); } await p.waitForTimeout(150); }
  const hits=(await D.hits(p)).map(h=>h.text.slice(0,70)); R.runs.push({mode,opts,seq,hits}); console.log(mode,'options',JSON.stringify(opts),'\n  manufacturer',JSON.stringify(seq),'\n  hits',JSON.stringify(hits));
  await p.keyboard.press('Escape'); }
fs.writeFileSync(out+'/result.json',JSON.stringify(R,null,1)); console.log(JSON.stringify(await s.marker())); await s.close(); process.exit(0);
