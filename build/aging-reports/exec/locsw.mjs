// locsw.mjs — 11 Nov 2026: put the signed-in user at a given location THROUGH THE SCREEN and read it back. POST /api/iam/change-location
// answers 200 but the page keeps the location it shows in the header (it stayed at Lethbridge after an on-screen switch, s78/C715414 11 Nov),
// so a test that depends on "your current location" must switch the way a user does: header location button -> the location button under
// "Change Location:" -> the location's name. ensureLoc(page, name) returns the header's location text after the switch.
export async function ensureLoc(p, name) {
  const hdr = async () => (await p.locator('header, .q-header').innerText().catch(() => '')).replace(/\s+/g, ' ');
  if ((await hdr()).includes(name)) return name;
  const cur = (await hdr()).match(/Staging [A-Za-z ]+ - \d{4}|ZZAUTOTEST[^A-Z]*[A-Za-z ]+/)?.[0];
  await p.locator('header, .q-header').getByText(cur ? cur : /Staging/).first().click(); await p.waitForTimeout(1500);
  /* 11 Nov 19:50 (q3c C715480): after an on-screen switch the header reads the NEW location while the user menu may still name the OLD one under
     "Change Location:", and that name is plain text, not a button - so read the name from the menu itself and click it by its text; old route kept as fallback */
  const ml = (await p.locator('.q-menu').last().innerText().catch(() => '')).split('\n').map((t) => t.trim()).filter(Boolean); const inMenu = ml[ml.indexOf('Change Location:') + 1];
  if (ml.includes('Change Location:') && inMenu) await p.locator('.q-menu').last().getByText(inMenu, { exact: true }).first().click(); else await p.locator('.q-menu').last().locator('button, .q-btn, .q-field').filter({ hasText: cur || /Staging/ }).first().click(); await p.waitForTimeout(1500);
  await p.locator('.q-menu:visible, .q-dialog').last().getByText(name, { exact: true }).first().click(); await p.waitForTimeout(6000);
  const after = await hdr(); if (!after.includes(name)) throw new Error('location switch failed, header reads: ' + after.slice(-60)); return name;
}
