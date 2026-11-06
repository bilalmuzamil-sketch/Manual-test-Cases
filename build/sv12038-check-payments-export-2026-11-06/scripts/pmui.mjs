import {sess} from './common.mjs'; const s=await sess(); const p=s.page; const reqs=[];
const NAME=process.env.NAME||'';
p.on('response',async r=>{ const u=r.url(); if(/\/api\//.test(u)&&!/envelope|collect|recent|notifications|avatar|feature-flags/.test(u)) { let b=''; try{b=(await r.text()).slice(0,300)}catch(e){} reqs.push(r.status()+' '+r.request().method()+' '+u.replace(/^https:\/\/[^/]+/,'').slice(0,160)+' '+(r.request().postData()||'').slice(0,200)+' => '+b); }});
await s.go('/administration/settings'); await p.waitForTimeout(5000);
const link=await p.$('text=Payment Methods'); if(link){ await link.click(); await p.waitForTimeout(4000);} console.log(p.url());
console.log(JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].map(a=>a.getAttribute('data-test-id')+'='+(a.innerText||'').replace(/\s+/g,' ').trim().slice(0,30)).filter(x=>!/nav_|menu_/.test(x)).slice(0,80))));
await p.screenshot({path:`../ev/${process.env.ENV}-payment-methods.png`});
if(NAME){ const b=await p.$('text=New Payment Method'); await b.click(); await p.waitForTimeout(2000);
  console.log('dlg',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(a=>a.getAttribute('data-test-id')+'='+(a.innerText||a.value||'').replace(/\s+/g,' ').trim().slice(0,40)))));
  const inp=await p.$('.q-dialog input'); await inp.fill(NAME); await p.waitForTimeout(500); await p.screenshot({path:`../ev/${process.env.ENV}-new-pm-filled.png`});
  if(process.env.DBL){ const b=await s.box('button_confirm_dialog'); await p.mouse.click(b.x,b.y,{clickCount:1}); await p.mouse.click(b.x,b.y,{clickCount:1}); } else await p.click('.q-dialog [data-test-id="button_confirm_dialog"]');
  await p.waitForTimeout(3000); await p.screenshot({path:`../ev/${process.env.ENV}-new-pm-after.png`});
  console.log('after',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.q-dialog, .q-notification')].map(a=>a.innerText.replace(/\s+/g,' ').trim().slice(0,200)))));
}
console.log(reqs.slice(-8).join('\n')); await s.close(); process.exit(0);
