import {sess} from './common.mjs'; import fs from 'fs';
const S=JSON.parse(fs.readFileSync(`/tmp/sv12048/wo-${process.argv[2]}.json`,'utf8')); const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(1500);
const v=(await s.api('/api/work-orders/lines/'+S.wo)).json; const t=JSON.stringify(v);
const i=t.indexOf(S.lines[0]); console.log(t.length, t.slice(Math.max(0,i-200), i+1800)); await s.close(); process.exit(0);
