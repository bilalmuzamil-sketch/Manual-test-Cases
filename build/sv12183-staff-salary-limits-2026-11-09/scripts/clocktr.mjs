import {sess,j} from './common.mjs'; import fs from 'fs';
const WO='b94d839f-0d91-4fdd-bf00-26fdd3d557ac', LINE='522f44cc-8a19-4501-8c7e-2f1bea2d0da7', ME='7f85bc58-9ff5-4b50-b3f3-d85821069066';
const s=await sess(); const p=s.page; const out=[]; const L=x=>{out.push(x);console.log(x);};
L('marker '+JSON.stringify(await s.marker()));
await s.go(`/workorders/${WO}/lines`); await p.waitForTimeout(3500);
const tid='button_clock_toggle_task_'+LINE; await p.evaluate(t=>document.querySelector(`[data-test-id="${t}"]`)?.scrollIntoView({block:'center'}),tid); await p.waitForTimeout(500);
let b=await s.box(tid); await p.screenshot({path:'/tmp/sv12183/TR-1-before-start.png'});
let n0=s.writes.length; await p.mouse.click(b.x,b.y); await p.waitForTimeout(3000); L('start writes '+j(s.writes.slice(n0)));
await p.screenshot({path:'/tmp/sv12183/TR-2-clocked-in.png'});
await p.waitForTimeout(65000);
b=await s.box(tid); await p.mouse.click(b.x,b.y); await p.waitForTimeout(2500);
const ta=p.locator('.q-dialog [data-test-id="input_tech_story"]').first(); if(await ta.count()){ await ta.click(); await p.keyboard.type('ZZAUTOTEST SV12183 pay rate check'); await p.waitForTimeout(400); }
await p.screenshot({path:'/tmp/sv12183/TR-3-clockout-window.png'});
n0=s.writes.length; const co=await s.box('button_clock_out'); await p.mouse.click(co.x,co.y); await p.waitForTimeout(3500); L('stop writes '+j(s.writes.slice(n0)));
await p.screenshot({path:'/tmp/sv12183/TR-4-after.png'});
const r=await s.api(`/api/technician-tasks/list?filters[0][field]=work_order&filters[0][value]=${WO}&pagination[rowsPerPage]=50`);
const rows=(r.json?.data?.collection||r.json?.data?.items||r.json?.data||[]); const mine=(Array.isArray(rows)?rows:[]).filter(x=>x.staff_id===ME);
L('list '+r.status+' total '+(Array.isArray(rows)?rows.length:'?')+' mine '+j(mine.map(x=>({id:x.id,rate:x.hourly_rate,start:x.start_date,end:x.end_date,hrs:x.total_time,desc:x.description}))));
fs.writeFileSync('/tmp/sv12183/TR-log.txt',out.join('\n')+'\n'); await s.close(); process.exit(0);
