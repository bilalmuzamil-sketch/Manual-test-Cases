import {sess} from './common.mjs'; import fs from 'fs'; const s=await sess({dpr:1}); const p=s.page; await s.go('/schedule'); await p.waitForTimeout(5000);
const cards=await p.locator('[data-test-id="sidebar_work_order_card"]').allInnerTexts(); const c=cards.map(t=>t.split('\n').map(x=>x.trim()).filter(Boolean)).filter(a=>/^2 lines/.test(a[1]||'')&&!/· 0h \/ 0h/.test(a[1]));
console.log(c.slice(0,5)); const a=c[0]; fs.writeFileSync('/tmp/sv12048/wo-P1.json',JSON.stringify({tag:'P1',number:a[0],customerName:a[2]},null,1)); await s.close(); process.exit(0);
