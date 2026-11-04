import {sess} from './common.mjs'; import fs from 'fs';
const s=await sess(); const p=s.page; const reqs=[]; p.on('request',r=>{ if(/\/api\/work-orders\?/.test(r.url())) reqs.push(decodeURIComponent(r.url().replace(/^https:\/\/[^/]+/,''))); });
await s.go('/workorders'); await p.waitForTimeout(7000); console.log('marker',JSON.stringify(await s.marker()));
const heads=await p.evaluate(()=>[...document.querySelectorAll('th')].map(t=>t.innerText.replace(/\s+/g,' ').trim()+'|'+(t.getAttribute('data-test-id')||'')).filter(Boolean));
console.log('headers',JSON.stringify(heads));
const h=p.locator('th',{hasText:/Clocked In/i}).first(); console.log('clocked header count',await p.locator('th',{hasText:/Clocked In/i}).count());
if(await h.count()){ await h.click(); await p.waitForTimeout(4000); await h.click(); await p.waitForTimeout(4000); }
console.log('requests',JSON.stringify(reqs.slice(-3),null,1)); await p.screenshot({path:'/tmp/sv12112/probe.png'});
await s.close(); process.exit(0);
