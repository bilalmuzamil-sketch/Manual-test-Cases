import {sess} from './lib.mjs'; import fs from 'fs';
const s=await sess('admin',{vp:{width:1800,height:1100}}); const bodies=[];
s.page.on('request',q=>{const u=q.url(); if(/department\/(create|delete|change)/.test(u)) bodies.push(q.method()+' '+u.replace(/https:\/\/[^/]+/,'')+' :: '+q.postData());});
s.page.on('response',async r=>{const u=r.url(); if(/department\/(create|delete|change)/.test(u)) bodies.push('  -> '+r.status()+' '+(await r.text().catch(()=>'')).slice(0,300));});
await s.go('/administration/departments'); await s.page.waitForTimeout(2500); console.log('url',s.page.url());
const ids=await s.page.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.offsetParent).map(e=>e.dataset.testId).filter(t=>/new|add|create|department/i.test(t))); console.log(ids.slice(0,20).join(' | '));
const nb=ids.find(t=>/button_(new|add)/i.test(t)); if(nb){ const b=await s.box(nb); await s.page.mouse.click(b.x,b.y); await s.page.waitForTimeout(1500);
 const d=await s.page.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.dataset.testId)); console.log('dialog',d.join(' | '));
 const inp=d.find(t=>/input.*name/i.test(t)); await s.page.locator(`[data-test-id="${inp}"] input, input[data-test-id="${inp}"]`).first().fill('ZZAUTOTEST SV-11565 Temp Dept A');
 const sv=d.find(t=>/save|submit|confirm/i.test(t)); const b2=await s.box(sv); await s.page.mouse.click(b2.x,b2.y); await s.page.waitForTimeout(2500); }
console.log(bodies.join('\n'));
await s.browser.close(); process.exit(0);
