// second-organization session: sign in through the real login form
import {sess} from './lib.mjs'; import fs from 'fs';
export async function sess2(opts={}){ const s=await sess('none',opts); const P=s.page;
  await s.go('/login'); await P.waitForTimeout(1500);
  if(await s.box('login_email_input')){ await P.locator('[data-test-id="login_email_input"] input, input[data-test-id="login_email_input"]').first().fill('bilal.muzamil+sv11669@shopview.com');
    await P.locator('[data-test-id="login_password_input"] input, input[data-test-id="login_password_input"]').first().fill(fs.readFileSync('/tmp/qa21/org2-pass.txt','utf8'));
    const b=await s.box('login_submit_button'); await P.mouse.click(b.x,b.y); await P.waitForURL(u=>!/\/login/.test(u.toString()),{timeout:60000}).catch(()=>{}); await P.waitForTimeout(2500);}
  return s; }
