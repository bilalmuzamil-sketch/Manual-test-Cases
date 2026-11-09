// usage: node undo.mjs <tag> <Day|Week|Month> <navDate YYYY-MM-DD> <series|following|shift> [blockIdx=0] [env]
import {sess,j} from './common.mjs'; import fs from 'fs';
const [TAG,VIEW,NAV,SCOPE,BI]=process.argv.slice(2); const W=JSON.parse(fs.readFileSync(`/tmp/sv12267/wo-${TAG}.json`,'utf8'));
const s=await sess({dir:process.env.DIR||'/tmp/qa93'}); const p=s.page; const out={tag:TAG,view:VIEW,nav:NAV,scope:SCOPE,wo:W.number,tech:W.tech};
const board=async()=>{const b=(await s.api('/api/schedule/board?from=2026-10-26T00:00:00Z&to=2026-12-20T23:59:59Z')).json?.data?.board; return (b?.shifts||[]).filter(x=>(x.workOrder?.id||x.workOrderId)===W.wo).map(x=>({id:x.id,s:x.startsAt,e:x.endsAt,m:x.durationMinutes,staff:x.staffId,series:x.seriesId,lines:(x.lines||x.workOrderLines||[]).length,cov:x.coverage})).sort((a,b)=>a.s<b.s?-1:1);};
const key=x=>[x.s,x.e,x.m,x.staff,x.lines,x.cov].join('|');
out.build=await p.evaluate(async()=>{const t=await (await fetch('/index.html?cb='+Date.now(),{cache:'no-store'})).text();return (t.match(/app-version" content="([^"]+)/)||[])[1];});
out.before=await board();
await s.go('/schedule'); await p.waitForTimeout(4500);
const vt=p.locator('[data-test-id="schedule_view_toggle"]').getByText(VIEW,{exact:true}); if(await vt.count()){await vt.first().click(); await p.waitForTimeout(1500);}
const mc=p.locator(`[data-test-id="button_mini_calendar_day_${NAV}"]`); if(await mc.count()){await mc.first().click(); await p.waitForTimeout(3500);} else out.navMissing=true;
const blocks=p.locator('.fc-event',{hasText:W.customerName}); out.blocksOnScreen=await blocks.count();
const blk=blocks.nth(Number(BI||0)); await blk.scrollIntoViewIfNeeded(); await p.waitForTimeout(500);
await p.screenshot({path:`/tmp/sv12267/${TAG}-1-before.png`}); out.blockBox=await blk.boundingBox();
await blk.click(); await p.waitForTimeout(2000);
out.detail=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(d=>d.innerText.replace(/\s+/g,' ').slice(0,300)));
await p.screenshot({path:`/tmp/sv12267/${TAG}-2-detail.png`});
const n0=s.writes.length; await p.locator('[data-test-id="button_shift_detail_delete"]').click(); await p.waitForTimeout(900);
out.scopeDlg=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(d=>d.innerText.replace(/\s+/g,' ').slice(0,300)+' || '+[...d.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(t=>/scope|delete|confirm/i.test(t)).join(',')));
await p.screenshot({path:`/tmp/sv12267/${TAG}-3-scope.png`});
const opt=p.locator(`[data-test-id="button_delete_scope_${SCOPE}"]`); if(await opt.count()){await opt.click(); await p.waitForTimeout(900);}
for(let k=0;k<3;k++){const c=p.locator('.q-dialog button').filter({hasText:/^(Delete|Delete shift|Delete shifts|Yes|Confirm|Are You Sure\?)$/i}); if(!(await c.count())) break; await c.last().click(); await p.waitForTimeout(1500);}
const u=p.getByRole('button',{name:'Undo',exact:true}); for(let w=0;w<20&&!(await u.count());w++) await p.waitForTimeout(250);
out.toast=await p.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>b.innerText.trim()==='Undo').map(b=>{let x=b;for(let i=0;i<4&&x.parentElement;i++)x=x.parentElement;return x.innerText.replace(/\s+/g,' ').slice(0,120)}));
out.undoButton=await u.count(); await p.screenshot({path:`/tmp/sv12267/${TAG}-4-deleted-toast.png`});
out.afterDelete=await board(); out.deleteWrites=s.writes.slice(n0).map(w=>w.slice(0,220));
const n1=s.writes.length; let restoreBody=null; p.on('request',q=>{if(/shifts\/restore/.test(q.url())) restoreBody=q.postData();});
if(out.undoButton){await u.first().click(); await p.waitForTimeout(4000);}
out.undoWrites=s.writes.slice(n1).map(w=>w.slice(0,220)); try{out.restoreCount=JSON.parse(restoreBody).shifts.length;}catch(e){out.restoreCount=null;}
await p.screenshot({path:`/tmp/sv12267/${TAG}-5-after-undo.png`});
await p.reload(); await p.waitForTimeout(5000); 
const vt2=p.locator('[data-test-id="schedule_view_toggle"]').getByText(VIEW,{exact:true}); if(await vt2.count()){await vt2.first().click(); await p.waitForTimeout(1200);} const mc2=p.locator(`[data-test-id="button_mini_calendar_day_${NAV}"]`); if(await mc2.count()){await mc2.first().click(); await p.waitForTimeout(3000);}
await p.screenshot({path:`/tmp/sv12267/${TAG}-6-after-reload.png`});
out.afterUndo=await board();
const B=new Set(out.before.map(key)), A=new Set(out.afterUndo.map(key));
out.missingAfterUndo=out.before.filter(x=>!A.has(key(x))).map(x=>x.s); out.extraAfterUndo=out.afterUndo.filter(x=>!B.has(key(x))).map(x=>x.s);
out.verdict=`before ${out.before.length} / afterDelete ${out.afterDelete.length} / afterUndo ${out.afterUndo.length} / missing ${out.missingAfterUndo.length} / extra ${out.extraAfterUndo.length}`;
fs.writeFileSync(`/tmp/sv12267/${TAG}-result.json`,JSON.stringify(out,null,1));
console.log(out.verdict,'| blocks',out.blocksOnScreen,'| undoBtn',out.undoButton,'| restoreCount',out.restoreCount,'| toast',j(out.toast),'| scope',j(out.scopeDlg).slice(0,300));
await s.close(); process.exit(0);
