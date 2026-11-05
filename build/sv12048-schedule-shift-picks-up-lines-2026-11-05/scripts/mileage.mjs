import {sess,post} from './common.mjs'; import fs from 'fs'; const S=JSON.parse(fs.readFileSync(`/tmp/sv12048/wo-${process.argv[2]}.json`,'utf8')); const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(1000);
console.log('mileage',(await post(s,'/api/work-orders/change-mileage',{work_order_id:S.wo,mileage:'123456'})).status); await s.close(); process.exit(0);
