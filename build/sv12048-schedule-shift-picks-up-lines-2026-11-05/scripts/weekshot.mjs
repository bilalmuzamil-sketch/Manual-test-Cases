// usage: node weekshot.mjs <shotName> [dayOffset=1] -> Schedule Week view on the week containing that day, scrolls the WO's lane (LANE env staffId) into view, screenshot ../ev/<shot>.png, prints blocks text for WO (WOTXT env)
import {sess} from './common.mjs'; const [SHOT,OFF]=process.argv.slice(2); const s=await sess({dpr:2}); const p=s.page; const d=new Date(Date.now()+Number(OFF||1)*86400000).toISOString().slice(0,10);
await s.go('/schedule'); await p.waitForTimeout(4500);
const mc=p.locator(`[data-test-id="button_mini_calendar_day_${d}"]`); if(await mc.count()){ await mc.first().click(); await p.waitForTimeout(2000);}
const vt=p.locator('[data-test-id="schedule_view_toggle"]').getByText('Week',{exact:true}); if(await vt.count()){ await vt.first().click(); await p.waitForTimeout(3500);}
if(process.env.LANE){ const l=p.locator(`[data-staff-id="${process.env.LANE}"]`).first(); if(await l.count()){ await l.scrollIntoViewIfNeeded(); await p.waitForTimeout(800);} }
if(process.env.WOTXT) console.log('BLOCKS',await p.evaluate(t=>[...document.querySelectorAll('.fc-event, [data-test-id^="schedule_shift"]')].filter(e=>e.offsetParent&&e.innerText.includes(t)).map(e=>{const r=e.getBoundingClientRect(); return Math.round(r.x)+','+Math.round(r.y)+','+Math.round(r.width)+'x'+Math.round(r.height)+' '+e.innerText.replace(/\s+/g,' ').slice(0,60);}).join(' | '),process.env.WOTXT));
await p.screenshot({path:`../ev/${SHOT}.png`}); await s.close(); process.exit(0);
