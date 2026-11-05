import {sess} from './common.mjs'; const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(1000);
const o=(await s.api('/api/inventory/orders/'+process.argv[2])).json?.data?.order; console.log('po wo',o.work_order_id,'number',o.order_number,'type',o.workOrderType);
for(const i of o.items) console.log('item',i.part_number,JSON.stringify(i).match(/"(work_order_id|work_order_number|workOrderId|wo_number|line_id)":"[^"]*"/g)); await s.close(); process.exit(0);
