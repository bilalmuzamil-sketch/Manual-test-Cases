import {sess} from './common.mjs'; import fs from 'fs'; const S=JSON.parse(fs.readFileSync(`/tmp/sv12048/wo-${process.argv[2]}.json`,'utf8')); const s=await sess({dpr:1}); const p=s.page;
await s.go('/workorders/'+S.wo+'/lines'); await p.waitForTimeout(4500); console.log('LABOR',await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="line_labor_name_"]')].map(e=>e.innerText.trim()).join(' | ')));
const lt=(await s.api('/api/work-orders/'+S.wo+'/line-technicians')).json; console.log('LT',JSON.stringify(lt).slice(0,500)); await s.close(); process.exit(0);
