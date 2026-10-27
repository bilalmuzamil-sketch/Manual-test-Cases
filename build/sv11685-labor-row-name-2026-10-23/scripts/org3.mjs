import {org2} from './org2lib.mjs';
const s=await org2();
s.L('flags',await s.api('/api/organization/feature-flags?organization_id='+s.ORG));
s.L('bk',await s.api('/api/bookkeeping/integration'));
s.L('wp',await s.api('/api/staff/my-workplaces'));
s.L('labour',await s.api('/api/labour-types?limit=50'));
s.L('tpl',await s.api('/api/adjustment-templates'));
s.L('adj-fake',await s.J('/api/work-orders/adjustments/add',{workOrderId:'00000000-0000-0000-0000-000000000000',kind:'fee',name:'x',calculationType:'flat',amount:1,scope:'whole_wo',taxable:false}));
await s.browser.close(); process.exit(0);
