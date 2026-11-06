// create an empty template (POST) and print its id
import {sess,post} from './common.mjs'; const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(3000);
const r=await post(s,'/api/inspection-templates',{name:process.argv[2]}); console.log(r.status, r.json?.data?.inspectionTemplate?.id||JSON.stringify(r.json).slice(0,200)); await s.close(); process.exit(0);
