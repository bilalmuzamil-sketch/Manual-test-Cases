import {sess} from './lib.mjs'; import fs from 'fs';
const s=await sess();
for(const p of ['/api/fe-permissions','/api/permissions','/api/roles/permissions','/api/role-templates']){const r=await s.api(p); const t=JSON.stringify(r.json??r.text); console.log(p,r.status,t.length,(t.match(/"[a-zA-Z]*[Mm]ove[a-zA-Z]*"/g)||[]).slice(0,10).join(','));}
await s.go('/administration/roles-permissions'); await s.page.waitForTimeout(1500);
const ids=await s.page.evaluate(()=>[...document.querySelectorAll('[data-test-id^="action_edit"]')].map(e=>e.dataset.testId)); const b=await s.box(ids[0]); await s.page.mouse.click(b.x,b.y); await s.page.waitForTimeout(2000);
console.log(await s.page.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].map(e=>e.dataset.testId).filter(t=>/move|labo/i.test(t)).join(' | ')));
const txt=await s.page.evaluate(()=>document.body.innerText); console.log((txt.match(/.*[Mm]ove.*/g)||[]).join('\n'));
await s.browser.close(); process.exit(0);
