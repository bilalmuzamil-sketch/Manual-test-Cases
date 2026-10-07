import {open} from '/tmp/qa9667/qa-session-q.mjs'; import {C} from '/tmp/qa9667/lib.mjs'; import fs from 'fs';
const F=JSON.parse(fs.readFileSync('/tmp/qa9667/p3/fixtures.json')); const out={};
const s=await open({env:'branch',ticket:'9667',dir:'/tmp/qa9667',cookies:C,quick:'tech',vp:{width:1600,height:1000},dpr:2}); const p=s.page;
out.ver=await p.evaluate(()=>document.querySelector('meta[name="app-version"]')?.content);
const fe=await s.api('/api/auth/me/fe-permissions'); out.who=fe.json?.data?.template_slug+' '+fe.json?.data?.view_mode;
await s.go('/workorders/9027964a-0ff2-49ff-9838-172c4bb00c61/notes'); await p.waitForTimeout(2500);
for(let i=0;i<15;i++){ const got=await p.evaluate(n=>!!document.querySelector(`[data-test-id="note_card_${n}"]`),F.work_order.noteId); if(got) break; await p.mouse.wheel(0,2500); await p.waitForTimeout(1200); }
console.log('url',p.url(),'tids',await p.evaluate(()=>[...new Set([...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id').replace(/_[0-9a-f-]{36}.*/,'_ID')))].filter(t=>/note|tab/.test(t)).join(' ')));console.log('cards',await p.evaluate(()=>document.querySelectorAll('[data-test-id^="note_card_"]').length));
for(const k of ['work_order_line','work_order']){ const o=F[k];
  const r=await p.evaluate(([note,att])=>{const nc=document.querySelector(`[data-test-id="note_card_${note}"]`); if(!nc) return {found:false}; nc.scrollIntoView({block:'center'}); const R=e=>{const g=e.getBoundingClientRect();return [g.left,g.top,g.right,g.bottom].map(Math.round);};
    const card=document.querySelector(`[data-test-id="note_attachment_card_${att}"]`); const cb=document.querySelector(`[data-test-id="checkbox_attachment_for_customer_${att}"]`);
    return {found:true,noteR:R(nc),cardR:card?R(card):null,cb:!!cb,anyCbInNote:!!nc.querySelector('[data-test-id^="checkbox_attachment_for_customer_"]'),label:(nc.querySelector('[class*=chip],[class*=badge]')||{}).innerText,file:card?card.innerText.replace(/\n/g,' '):null};},[o.noteId,o.att]);
  await p.waitForTimeout(600); r.re=await p.evaluate(([note,att])=>{const R=e=>{const g=e.getBoundingClientRect();return [g.left,g.top,g.right,g.bottom].map(Math.round);};const nc=document.querySelector(`[data-test-id="note_card_${note}"]`);const card=document.querySelector(`[data-test-id="note_attachment_card_${att}"]`);return {noteR:nc?R(nc):null,cardR:card?R(card):null};},[o.noteId,o.att]);
  await p.screenshot({path:`/tmp/qa9667b/r4-rows12-${k}.png`}); out[k]=r; console.log(k,JSON.stringify(r).slice(0,400)); }
fs.writeFileSync('/tmp/qa9667b/r4-rows12.json',JSON.stringify(out,null,1)); console.log(out.ver,out.who); await s.close();
