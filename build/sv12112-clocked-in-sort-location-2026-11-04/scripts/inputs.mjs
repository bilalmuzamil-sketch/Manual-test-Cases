import {sess} from './common.mjs';
const s=await sess(); const p=s.page; await s.go('/workorders'); await p.waitForTimeout(6000);
console.log(JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('input,[data-test-id*=search]')].filter(i=>i.offsetParent).map(i=>i.tagName+'|'+(i.getAttribute('placeholder')||'')+'|'+(i.getAttribute('data-test-id')||'')+'|'+(i.closest('[data-test-id]')?.getAttribute('data-test-id')||'')))));
console.log(JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.q-tab, [role=tab]')].map(t=>t.innerText.replace(/\s+/g,' ').trim()+'|'+(t.getAttribute('data-test-id')||'')))));
console.log(JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>b.offsetParent&&b.getBoundingClientRect().y<200).map(b=>b.innerText.replace(/\s+/g,' ').trim().slice(0,25)+'|'+(b.getAttribute('data-test-id')||'')))));
await s.close(); process.exit(0);
