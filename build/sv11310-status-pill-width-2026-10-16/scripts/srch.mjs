import {open} from './qa.mjs'; import fs from 'fs';
const C=JSON.parse(fs.readFileSync('/tmp/qa11398/cookies.json'));
const s=await open({env:'staging',dir:'/tmp/qa11310',cookies:C,quick:'admin',vp:{width:1600,height:1000},dpr:2}); const p=s.page;
await s.go('/workorders?tab=all'); await p.waitForTimeout(6000);
await p.click('[data-test-id=toggle_display_option]'); await p.waitForTimeout(800); await p.click('[data-test-id=display_option_list]'); await p.waitForTimeout(4000);
console.log(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(t=>/search|filter|tab_|input/i.test(t)).join(' ')));
console.log(await p.evaluate(()=>[...document.querySelectorAll('td.cell.status .q-badge')].slice(0,2).map(b=>b.outerHTML.slice(0,400)).join('\n')));
await s.close();
