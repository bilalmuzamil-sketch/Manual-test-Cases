import {sess} from './lib.mjs'; import fs from 'fs';
const s=await sess(); const M=JSON.parse(fs.readFileSync('../data/matrix-branch.json')); const P=s.page; const urls=[];
P.on('response',async r=>{const u=r.url(); if(/lines|work-order/.test(u)&&r.request().method()==='GET'&&!/\.js/.test(u)) urls.push(u.split('/api')[1]);});
const r=await s.api('/api/technician-tasks/list?page=1&rowsPerPage=1'); console.log('list keys',Object.keys(r.json.data), JSON.stringify(r.json.data).replace(/"collection":\[.*?\],?/,'').slice(0,300));
await s.go('/reports/punch-clock-activities'); await P.waitForTimeout(3000);
await P.getByRole('button',{name:'New'}).click(); await P.waitForTimeout(1200);
const b=await s.box('select_timesheet_work_order'); await P.mouse.click(b.x,b.y); await P.waitForTimeout(500); await P.keyboard.type('17582',{delay:60}); await P.waitForTimeout(2500); await P.locator('.q-menu .q-item').first().click(); await P.waitForTimeout(2500);
console.log(urls.filter(u=>!/^\/work-orders\?/.test(u)).slice(-6).join('\n'));
await s.browser.close(); process.exit(0);
