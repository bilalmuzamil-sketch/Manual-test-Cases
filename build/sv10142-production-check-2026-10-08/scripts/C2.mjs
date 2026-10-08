import {op} from './lib.mjs'; import fs from 'fs';
const s=await op({dpr:1}); const p=s.page; const P=(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
await P('/api/iam/change-location',{workplace_id:'b617914c-16e9-4485-8e8b-193cd86aa416',workplace_timezone:'Africa/Accra'});
console.log('marker',JSON.stringify(await s.marker()));
const d=await s.api('/api/organizations/invoice-settings/view'); console.log('design',JSON.stringify(d.json).match(/documentDesign[^,]*/)?.[0]);
await P('/api/organizations/invoice-settings/change-design',{documentDesign:'modern'});
const W=JSON.parse(fs.readFileSync('prod/wo-A.json'));
await s.go('/workorders/'+W.wo+'/finance'); await p.waitForTimeout(4000);
const t=await p.evaluate(()=>document.body.innerText); const i=t.indexOf('Adjustments'); console.log('finance adj:',i, t.slice(i,i+300).replace(/\n/g,' | '));
const pop=[]; s.ctx.on('page',x=>pop.push(x)); const reqs=[]; p.on('request',r=>{if(/invoice|pdf|preview/i.test(r.url()))reqs.push(r.method()+' '+r.url().slice(0,140))});
const b=await s.box('button_print_invoice'); console.log('print box',!!b); if(b){await p.mouse.click(b.x,b.y); await p.waitForTimeout(4000);}
console.log('popups',pop.length, pop.map(x=>x.url().slice(0,120))); console.log(reqs.slice(0,8).join('\n'));
console.log('dialog',await p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(e=>e.innerText.slice(0,300).replace(/\n/g,' | ')).join(' ## ')));
await P('/api/organizations/invoice-settings/change-design',{documentDesign:'legacy'});
const d2=await s.api('/api/organizations/invoice-settings/view'); console.log('design after',JSON.stringify(d2.json).match(/documentDesign[^,]*/)?.[0]);
await s.close();
