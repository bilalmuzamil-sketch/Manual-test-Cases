import {sess} from './common.mjs'; import fs from 'fs';
const s=await sess({dir:'/tmp/qa94'}); const p=s.page; const [WO,LN]=process.argv.slice(2);
const dump=async n=>{ const r=await p.evaluate(()=>({dlg:[...document.querySelectorAll('.q-dialog [data-test-id], .q-dialog textarea, .q-menu [data-test-id]')].map(e=>(e.getAttribute('data-test-id')||e.tagName)+'|'+(e.innerText||e.value||'').replace(/\s+/g,' ').trim().slice(0,50)),title:document.querySelector('.q-dialog')?.innerText.slice(0,200)})); console.log(n,JSON.stringify(r).slice(0,1800)); await p.screenshot({path:`/tmp/sv12003/${n}.png`}); };
await s.go('/workorders/'+WO+'/lines'); await p.waitForTimeout(4000);
await p.click(`[data-test-id="button_action_complete_line_${LN}"]`); await p.waitForTimeout(3500); await dump('A-line-complete');
await p.keyboard.press('Escape'); await p.waitForTimeout(1000);
await s.go('/workorders/'+WO+'/lines'); await p.waitForTimeout(4000);
await p.click('[data-test-id="badge_wo_status"]'); await p.waitForTimeout(1500); await dump('B-wo-status-menu');
await s.close(); process.exit(0);
