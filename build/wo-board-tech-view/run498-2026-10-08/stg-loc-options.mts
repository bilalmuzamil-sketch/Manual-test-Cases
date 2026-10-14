/** read-only: which locations does the admin's Change Location list offer on staging? */
import { bootOrigin } from '../../testing-tools/qa-branch-boot.mjs';
const { browser, page: p } = await bootOrigin({ app: 'https://app.staging.shopview.com', apiHost: 'api.staging.shopview.com', ssoFile: '/tmp/qa-cookies/staging-sso.txt', label: 'staging', route: '/customers', key: 'admin' }) as any;
await p.locator('[data-test-id="profile_menu_button"]').click(); await p.waitForTimeout(1200);
await p.locator('[data-test-id="select_location"]').click(); await p.waitForTimeout(1500);
console.log('OPTIONS', JSON.stringify(await p.locator('.q-menu .q-item').allInnerTexts()));
await browser.close(); process.exit(0);
