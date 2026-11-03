import {prod1,arr} from '../common.mjs'; const s=await prod1(); console.log('loc',(await s.page.locator('[data-test-id="profile_menu_button"]').innerText().catch(()=>'?')).replace(/\s+/g,' '));
const r=(await s.api('/api/inventory/parts?limit=200&page=1')).json?.data; const c=arr(r); console.log('parts',c.length, c[0]?Object.keys(c[0]).join(',').slice(0,400):'');
const cored=c.filter(x=>Number(x.core_charge||x.core_price||0)>0||x.core_part_id); for(const x of cored.slice(0,8)) console.log('CORE',x.id,'|',x.part_number,'|',(x.description||'').slice(0,30),'| core',x.core_charge,x.core_price,'| qty',x.quantity||x.qty_on_hand,'| sell',x.sell_price);
await s.close(); process.exit(0);
