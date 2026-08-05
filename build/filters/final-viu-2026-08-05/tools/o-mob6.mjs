import * as H from './h.mjs'; import fs from 'fs';
const MOB={viewport:{width:390,height:844},isMobile:true,hasTouch:true,dsf:3,
  userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'};
const {browser,page,netlog}=await H.open({...MOB,settle:15000});
const R={build:'v3.4.2-d00239b',when:new Date().toISOString()};
const S=n=>{fs.writeFileSync('/tmp/fv/obs/mob6.json',JSON.stringify(R,null,1));console.log('.. '+n);};
const sh=()=>page.evaluate(()=>{const v=e=>e.offsetParent!==null||['fixed','absolute'].includes(getComputedStyle(e).position);
  const d=[...document.querySelectorAll('[data-test-id=mobile_filter_sheet]')].filter(e=>v(e)&&e.getBoundingClientRect().height>80);
  if(!d.length) return null; const e=d[0];
  return {text:e.innerText.slice(0,600),inputs:[...e.querySelectorAll('input')].map(i=>({ph:i.placeholder,testid:i.getAttribute('data-test-id')})),
   clear:[...e.querySelectorAll('button,a')].filter(x=>/clear/i.test(x.innerText||'')).map(x=>x.innerText.trim()),
   apply:[...e.querySelectorAll('button')].filter(b=>/apply/i.test(b.innerText)).map(b=>JSON.stringify(b.innerText)),
   optionIds:[...e.querySelectorAll('[data-test-id^=filter_option]')].map(x=>x.getAttribute('data-test-id')).slice(0,6),
   optionLabels:[...e.querySelectorAll('[data-test-id^=filter_option]')].map(x=>x.innerText.trim().slice(0,30)).slice(0,6)};});
const cards=()=>page.evaluate(()=>{const t=document.body.innerText;
  const st=(t.match(/\n(Estimate|Approved|In Progress|In progress|Review|Complete|Invoiced|Paid|Declined|Imported)\n/g)||[]).map(s=>s.trim());
  const m=t.search(/No work orders|No results|no results|nothing/i);
  return {statusCounts:st.reduce((a,b)=>(a[b]=(a[b]||0)+1,a),{}),n:(t.match(/S2-\d{4,6}/g)||[]).length,
   emptyText:m>=0?t.slice(Math.max(0,m-100),m+280):null};});
const chips=()=>page.evaluate(()=>[...document.querySelectorAll('.mobile-chip,[data-test-id^=filter_chip_]')].map(b=>b.innerText.trim().replace(/\n/g,'|')));
async function open_(t,n=4){for(let i=0;i<n;i++){await page.locator(`[data-test-id="${t}"]`).first().click({timeout:18000}).catch(()=>{});await page.waitForTimeout(2600);const s=await sh();if(s)return s;}return null;}
async function reset(){await page.goto('https://sv8785.qa.shopview.com/workorders?tab=all',{waitUntil:'domcontentloaded',timeout:60000});await page.waitForTimeout(9500);
  const cf=page.locator('[data-test-id="clear_filters"]');if(await cf.count()){await cf.first().click({timeout:15000}).catch(()=>{});await page.waitForTimeout(3500);} }

// MOB-06: Lead Technician + Service Advisor sheets
await reset();
R.tech=await open_('filter_chip_tech_assigned_id'); await H.shot(page,'mob6-tech'); S('tech');
console.log('LEAD TECHNICIAN sheet:',JSON.stringify(R.tech&&{text:R.tech.text.slice(0,110),inputs:R.tech.inputs,clear:R.tech.clear,apply:R.tech.apply,opts:R.tech.optionLabels}));
await reset();
R.adv=await open_('filter_chip_service_advisor_id'); await H.shot(page,'mob6-adv'); S('adv');
console.log('SERVICE ADVISOR sheet:',JSON.stringify(R.adv&&{text:R.adv.text.slice(0,110),inputs:R.adv.inputs,clear:R.adv.clear,apply:R.adv.apply,opts:R.adv.optionLabels}));

// MOB-10: produce a no-match state BY TAPPING (not by URL, which the phone ignores)
await reset();
{
 const o={};
 const s=await open_('filter_chip_status');
 o.sheetOpened=!!s;
 // Imported alone usually matches nothing on this data set
 await page.locator('[data-test-id="filter_option_status_imported"]').first().click({timeout:18000}).catch(()=>{});
 await page.waitForTimeout(6000);
 o.afterImported={url:page.url(),cards:await cards(),chips:await chips()};
 o.clearCtl=await page.evaluate(()=>({byTestId:!!document.querySelector('[data-test-id="clear_filters"]'),
   texts:[...document.querySelectorAll('button,a,span,div')].filter(e=>e.offsetParent&&/clear/i.test((e.innerText||'').trim())&&(e.innerText||'').trim().length<26).map(e=>e.innerText.trim()).slice(0,6)}));
 await H.shot(page,'mob6-empty-imported');
 R.mobEmptyByTap=o; S('empty');
 console.log('MOB-10 by TAPPING Imported: url',o.afterImported.url.slice(-46));
 console.log('  cards:',JSON.stringify(o.afterImported.cards).slice(0,300));
 console.log('  chips:',o.afterImported.chips.join(' | '));
 console.log('  clear controls on the empty screen:',JSON.stringify(o.clearCtl));
}
S('done'); await browser.close();
