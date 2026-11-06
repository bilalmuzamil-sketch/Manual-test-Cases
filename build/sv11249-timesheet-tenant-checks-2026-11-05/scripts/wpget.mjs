import {sess} from './common.mjs'; const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(2000);
const r=await s.api('/api/workplaces'); console.log(r.status,JSON.stringify(r.json).slice(0,300)); await s.close(); process.exit(0);
