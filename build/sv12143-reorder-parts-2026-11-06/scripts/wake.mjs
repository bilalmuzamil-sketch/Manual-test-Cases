import {sess} from './common.mjs';
const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(4000); console.log('marker',JSON.stringify(await s.marker().catch(e=>String(e)))); console.log('url',s.page.url()); await s.close(); process.exit(0);
