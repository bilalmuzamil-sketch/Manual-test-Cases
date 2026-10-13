import {ob,J,post} from './lib.mjs';
const s=await ob({dpr:2,quick:'tech'}); const p=s.page; const net=[];
p.on('response',async r=>{ if(r.request().method()!=='GET'&&/\/api\/work-orders/.test(r.url())){ let b=''; try{b=(await r.text()).slice(0,160);}catch(e){} net.push(r.status()+' '+new URL(r.url()).pathname+' => '+b);} });
await post(s,'/api/iam/change-location',{workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',workplace_timezone:'America/Edmonton'}); await p.evaluate(()=>localStorage.setItem('location',JSON.stringify('b3c8c820-f815-4cf1-8938-10956c5ee71a')));
await s.go('/parts/part-sale/e71fd04b-aa1c-4b9a-b895-857803117877/part-requests'); await p.waitForTimeout(4000);
const ids=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="button_part_request_menu_"]')].map(e=>e.getAttribute('data-test-id')));
console.log('menus',ids.length);
await p.locator(`[data-test-id="${ids[1]}"]`).scrollIntoViewIfNeeded(); await p.locator(`[data-test-id="${ids[1]}"]`).click(); await p.waitForTimeout(2000);
console.log('popup:',await p.evaluate(()=>[...document.querySelectorAll('.q-menu,.q-popup,[role=menu],.q-list')].filter(e=>e.getBoundingClientRect().width>0).map(e=>e.innerText.replace(/\s+/g,' ').slice(0,200)).join(' ## ')));
await p.screenshot({path:'ev/ps-menu.png'}); await p.keyboard.press('Escape');
// description click -> dialog?
const d=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="input_description_"]')].map(e=>e.getAttribute('data-test-id'))[0]); console.log('desc',d);
// WO Lines tab part
await post(s,'/api/iam/change-location',{workplace_id:'f8a8b802-7780-4b16-bf10-343caeb616b2',workplace_timezone:'America/Edmonton'}); await p.evaluate(()=>localStorage.setItem('location',JSON.stringify('f8a8b802-7780-4b16-bf10-343caeb616b2')));
await s.go('/workorders/288cddba-f3ca-491d-8927-e86412a2ca24/lines'); await p.waitForTimeout(4000);
console.log('line part ids',await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(x=>/part/i.test(x)).filter((v,i,a)=>a.indexOf(v)===i).slice(0,40).join(' ')));
await p.screenshot({path:'ev/wo-lines.png'});
await s.close();
