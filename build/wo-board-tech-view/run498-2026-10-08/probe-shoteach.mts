/** 15 Oct 2026 — proves WOB_SHOT_EACH: open() registers the page and __shotEach writes <id>-end.png into WOB_EV. */
import { open, done } from './session.mts';
const { browser } = await open('/workorders?tab=all');
await (globalThis as any).__shotEach?.('ZZSHOTEACH-probe'); await done(browser);
