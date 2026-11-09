// usage: node st.mjs <tag> <lineIdx> <status> -> POST lines/change-status (the exact request the Lines-tab Approve/Decline/Complete buttons send)
import {sess,post} from './common.mjs'; import fs from 'fs';
const [TAG,I,ST]=process.argv.slice(2); const S=JSON.parse(fs.readFileSync(`/tmp/sv12267/wo-${TAG}.json`,'utf8')); const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(1000);
const r=await post(s,'/api/work-orders/lines/change-status',{line_id:S.lines[Number(I)],status:ST,workOrderId:S.wo}); console.log('change-status',ST,r.status,JSON.stringify(r.json).slice(0,200)); await s.close(); process.exit(0);
