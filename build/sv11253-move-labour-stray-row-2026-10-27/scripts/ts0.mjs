import {sess} from './lib.mjs'; import fs from 'fs';
const D=JSON.parse(fs.readFileSync('../data/v6.json')); const s=await sess();
await s.go(`/workorders/${D.wo}/lines`); await s.waitFor('line_number_'+D.lines[1]); await s.page.waitForTimeout(1200);
const links=await s.page.evaluate(()=>[...document.querySelectorAll('a[href*="timesheet"],[data-test-id*="timesheet"]')].map(e=>(e.dataset.testId||'')+' '+(e.getAttribute('href')||'')+' «'+e.innerText.trim().slice(0,40)+'»'));
console.log('timesheet links on lines page',JSON.stringify(links));
const dots=await s.page.evaluate(()=>{const e=[...document.querySelectorAll('button')].find(b=>b.innerText.trim()==='more_vert'&&b.getBoundingClientRect().y<130); if(!e)return null; const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2,id:e.dataset.testId};});
console.log('dots',JSON.stringify(dots)); if(dots){await s.page.mouse.click(dots.x,dots.y); await s.page.waitForTimeout(900); console.log('menu',await s.page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>(e.dataset.testId||'')+':'+e.innerText.trim().replace(/\n/g,' ')).join(' | '))); await s.page.screenshot({path:'../ev/ts-path-menu.png'});}
await s.page.keyboard.press('Escape'); await s.page.getByText('Stats',{exact:true}).first().click(); await s.page.waitForTimeout(2000);
console.log('stats url',s.page.url(), JSON.stringify(await s.page.evaluate(()=>[...document.querySelectorAll('a[href*="timesheet"],[data-test-id*="timesheet"],button')].map(e=>(e.dataset.testId||'')+'«'+e.innerText.trim().slice(0,25)+'»').filter(t=>/time|sheet|edit/i.test(t)).slice(0,15))));
await s.browser.close(); process.exit(0);
