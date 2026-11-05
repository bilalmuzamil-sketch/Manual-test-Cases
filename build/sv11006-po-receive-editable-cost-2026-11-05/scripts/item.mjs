import {sess} from './common.mjs'; const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(1000);
const o=(await s.api('/api/inventory/orders/66455d0f-55dd-42ca-81d0-879dbfc08026')).json?.data?.order; console.log(Object.keys(o).join(','),'|',JSON.stringify(o.items[0]).slice(0,600)); await s.close(); process.exit(0);
