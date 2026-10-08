// drives Plaid Link sandbox inside the app; leaves the page on the app's account-selection dialog
import {ob,j} from './lib.mjs';
export async function plaidLogin(s,{shot='pl/x',bank='First Platypus Bank'}={}){
  const p=s.page; await s.go('/accounting/banking/connect');
  let fr=null; for(let i=0;i<40&&!fr;i++){ await p.waitForTimeout(500); fr=p.frames().find(f=>/cdn\.plaid\.com\/link\/v2\/stable\/link\.html/.test(f.url())); }
  const F=p.frameLocator('iframe[src*="cdn.plaid.com"]');
  const dom=async l=>l.evaluate(e=>{const t=e.closest('button,a,[role=button],li,[role=option]')||e; t.click();});
  const step=async(n)=>{ await p.waitForTimeout(1800); await p.screenshot({path:`${shot}-${n}.png`}); return (await fr.evaluate(()=>document.body.innerText).catch(()=>'')).replace(/\n+/g,' | ').slice(0,400); };
  console.log('1',await step(1));
  await dom(F.getByText('Continue without phone number').first()); console.log('2',await step(2));
  const inp=F.locator('input').first(); await inp.fill('Platypus'); console.log('3',await step(3));
  await dom(F.getByText(bank,{exact:false}).first()); console.log('4',await step(4));
  { const opts=F.getByText(bank,{exact:true}); const n=await opts.count(); if(n>1){ await dom(opts.nth(n-1)); console.log('4a sub-bank',await step('4a')); } }
  // some institutions show an intermediate "Continue to login" page
  for(const t of ['Continue to login','Continue']){ const l=F.getByRole('button',{name:t}); if(await l.count().catch(()=>0)){ await l.first().click().catch(()=>{}); console.log('4b '+t,await step('4b')); break; } }
  await F.locator('input[type=text], input[name=username], input[id*=username]').first().fill('user_good');
  await F.locator('input[type=password]').first().fill('pass_good'); console.log('5',await step(5));
  await dom(F.getByRole('button',{name:/submit|continue|log in|sign in/i}).first()); console.log('6',await step(6));
  for(let k=0;k<5;k++){ const still=p.frames().some(f=>/cdn\.plaid\.com\/link\/v2\/stable\/link\.html/.test(f.url())); const vis=await p.locator('iframe[src*="cdn.plaid.com"]').first().isVisible().catch(()=>false); if(!still||!vis) break;
    const b=F.getByRole('button',{name:/^(continue|done|connect|allow|finish without saving)/i}); const fw=F.getByText('Finish without saving'); if(await fw.count().catch(()=>0)){ await dom(fw.first()); console.log('7f',await step('7f')); continue; } if(!(await b.count().catch(()=>0))) { await p.waitForTimeout(1500); continue; } await dom(b.last()).catch(()=>{}); console.log('7.'+k,await step('7'+k)); }
  await p.waitForTimeout(3000); await p.screenshot({path:`${shot}-app.png`});
  return {fr,F,step};
}
