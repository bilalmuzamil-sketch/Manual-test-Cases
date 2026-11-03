import {prod} from '../common.mjs'; import fs from 'fs'; const WO=process.argv[2]; const s=await prod('/tmp/qa71'); const p=s.page; const R={marker:await s.marker()}; let n=20;
const shot=async t=>{n++; await p.screenshot({path:`sv10130/${n}-${t}.png`});};
const read=()=>p.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].pop(); if(!d) return null; return {head:d.innerText.split('\n')[0],
  fields:[...d.querySelectorAll('.q-field')].map(f=>({label:(f.querySelector('.q-field__label')?.innerText||'').trim(),ph:[...f.querySelectorAll('input,textarea')].map(i=>i.getAttribute('placeholder')).join('|'),val:[...f.querySelectorAll('input,textarea')].map(i=>i.value).join('|').slice(0,80),sel:(f.querySelector('.q-field__native')?.innerText||'').trim().slice(0,60),err:(f.querySelector('.q-field__messages')?.innerText||'').trim()})).filter(f=>f.label).slice(0,3)};});
// A: empty save -> pick canned line -> wait -> Tab
await s.go(`/workorders/${WO}/lines`); await p.waitForTimeout(5000); if(!(await read())){ await p.locator('button:has-text("New Line")').last().click(); await p.waitForTimeout(1500);} 
await p.click('[data-test-id="button_save_close"]'); await p.waitForTimeout(1200); R.a_err=await read();
await p.click('[data-test-id="select_line_canned_line"]'); await p.waitForTimeout(1200); await p.locator('.q-menu .q-item').nth(2).click(); await p.waitForTimeout(3500); R.a_picked=await read(); await shot('picked-wait');
await p.keyboard.press('Tab'); await p.waitForTimeout(1500); R.a_tab=await read(); await shot('picked-tab');
await p.locator('.q-dialog [data-test-id="button_close_dialog"]').first().click().catch(()=>{}); await p.waitForTimeout(800);
// B: Edit Line on the saved line
const api=(await s.api(`/api/work-orders/lines/${WO}`)).json?.data?.collection||[]; R.b_api=api.map(l=>({id:l.line_id,name:l.line_name,desc:l.description}));
await s.go(`/workorders/${WO}/lines`); await p.waitForTimeout(5000); await p.click(`[data-test-id="line_labor_name_${api[0].line_id}"]`); await p.waitForTimeout(2000); R.b_edit=await read(); await shot('edit-line-new');
fs.writeFileSync('sv10130/result3.json',JSON.stringify(R,null,1)); console.log(JSON.stringify(R,null,1).slice(0,4000));
// C: list some older work orders
const w=(await s.api('/api/work-orders?page=1&limit=40&sort=created_at&descending=false')).json?.data; const c=w?.collection||w?.work_orders||w||[]; console.log('WOLIST',Array.isArray(c)?c.length:typeof c, JSON.stringify((Array.isArray(c)?c:[]).slice(0,6).map(x=>[x.id||x.work_order_id,x.display_number||x.number,x.created_at||x.start_date,x.lines_count]),null,0).slice(0,800));
await s.close(); process.exit(0);
