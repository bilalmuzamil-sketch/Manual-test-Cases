import {sess} from './common.mjs';
const s=await sess({dir:'/tmp/qa94'}); const p=s.page;
await s.go('/workorders/737fce7f-bf9c-4634-960a-b72de9a2e7a7/lines'); await p.waitForTimeout(4000);
console.log('story link:',await p.locator('[data-test-id="line_tech_story_87e80cf1-d08b-4af6-a3c6-c98eb0df680a"]').innerText().catch(e=>'ERR'));
await s.go('/workorders/0e7e46b7-fac7-4c10-82db-c5a8cb04e9cb/lines'); await p.waitForTimeout(4000);
const b=await p.locator('[data-test-id="button_mark_reviewed"]').boundingBox(); console.log('mark reviewed box',JSON.stringify(b),'viewport',JSON.stringify(p.viewportSize()));
await s.close(); process.exit(0);
