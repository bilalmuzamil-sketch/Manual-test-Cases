import {sess,arr} from './common.mjs'; const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(2500);
const v=(await s.api('/api/work-orders/view/00340a47-7110-4ba5-b5ee-2eb1cfb5f325')).json.data; const w=v.work_order||v; console.log('company',w.company_id||w.company?.id); await s.close(); process.exit(0);
