// usage: node VE.mjs '<json {tag,id,name?,zip?,answer?}>'  edit a vendor on its page
import {ob,J,post} from './lib.mjs'; import fs from 'fs';
const P=JSON.parse(process.argv[2]); const s=await ob(); const p=s.page; await post(s,'/api/iam/change-location',{workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',workplace_timezone:'America/Edmonton'});
const W=[]; p.on('request',r=>{ if(r.method()!=='GET'&&/\/api\/.*vendor/i.test(r.url())) W.push(r.method()+' '+r.url().replace(/.*\/api/,'/api')+' :: '+(r.postData()||'').slice(0,200)); });
p.on('response',async r=>{ if(r.request().method()!=='GET'&&/\/api\/.*vendor/i.test(r.url())) W.push('  <- '+r.status()+' '+(await r.text().catch(()=>'')).slice(0,200)); });
const toasts=new Set(); const grab=async()=>{ for(const t of await p.locator('.q-notification').allInnerTexts().catch(()=>[])) toasts.add(t.replace(/\s+/g,' ').trim()); };
await s.go('/parts/vendor/'+P.id+'/contacts'); await p.waitForTimeout(3500);
await p.locator('[data-test-id="button_edit_vendor"]').click(); await p.waitForTimeout(1800);
const D=p.locator('.q-dialog').last(); const before=await D.locator('[data-test-id="input_vendor_name"]').inputValue();
if(P.name!=null) await D.locator('[data-test-id="input_vendor_name"]').fill(P.name); if(P.zip!=null) await D.locator('[data-test-id="input_vendor_postal_code"]').fill(P.zip);
await p.screenshot({path:`ev/${P.tag}-1-edit.png`});
const save=await D.locator('[data-test-id="vendor_save_button"]'); await save.click(); for(let i=0;i<10;i++){ await p.waitForTimeout(300); await grab(); }
const dialogs=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(d=>d.innerText.replace(/\s+/g,' ').slice(0,200))); await p.screenshot({path:`ev/${P.tag}-2-after-save.png`});
let answered=null; if(P.answer && dialogs.some(t=>/already exists/i.test(t))){ const b=p.locator('.q-dialog').last().locator('button').filter({hasText:P.answer==='continue'?/create|save|continue|yes/i:/cancel/i}).last(); answered=await b.innerText(); await b.click(); for(let i=0;i<8;i++){ await p.waitForTimeout(300); await grab(); } await p.screenshot({path:`ev/${P.tag}-3-after-answer.png`}); }
const after=(await s.api('/api/parts-catalogue/vendors?pagination%5Bpage%5D=1&pagination%5BrowsPerPage%5D=30&search='+encodeURIComponent(P.name||before))).json;
console.log(P.tag,'| name before',before,'| toasts',J([...toasts],300),'\n  dialogs',J(dialogs,400),'\n  answered',answered,'\n  writes',J(W,500));
fs.writeFileSync(`ve-${P.tag}.json`,JSON.stringify({P,before,toasts:[...toasts],dialogs,answered,W},null,1)); await s.close();
