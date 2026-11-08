import {sess} from './common.mjs';
const WO=process.env.WO, LINE=process.env.LINE; const s=await sess(); const p=s.page;
await s.go(`/workorders/${WO}/lines`); await p.waitForTimeout(3000);
const b=await s.box('button_clock_toggle_task_'+LINE); await p.mouse.click(b.x,b.y); await p.waitForTimeout(2500);
console.log(await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id], .q-dialog button, .q-dialog textarea')].map(e=>`${e.tagName}|${e.getAttribute('data-test-id')}|${(e.innerText||'').trim().slice(0,40)}`).join('\n')));
await p.screenshot({path:'../ev/stop-dialog.png'}); await s.close();
