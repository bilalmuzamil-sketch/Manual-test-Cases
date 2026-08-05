# iPhone test — SV-7324 (attaching an iPhone photo to a note)

**About 5 minutes. You need a real iPhone. This cannot be done on a computer.**

Ticket: [SV-7324](https://shopview.atlassian.net/browse/SV-7324)
Test on: **https://sv7324.qa.shopview.com/workorders/20bb22c9-7310-4573-8719-6b3f4bf1fe46/notes**
Build being tested: **v3.4.2-fc52c44**

---

## What this is about, in plain words

iPhones save photos in a format called **HEIC**. Web browsers cannot show HEIC pictures, so when
someone attached an iPhone photo to a note it never worked properly.

The fix does something clever: it tells the iPhone *"I only accept normal photo formats."* When the
iPhone hears that, **it converts the photo to a normal JPEG by itself, on the phone**, before it is
sent. So we should never receive a HEIC file at all.

**What you are checking: that the photo attaches and shows up, and that what arrives is a `.jpg`
file — not a `.heic` one.**

---

## Before you start (1 minute)

**Make sure the phone is actually saving photos as HEIC**, otherwise the test proves nothing:

1. On the iPhone open **Settings → Camera → Formats**
2. It must be set to **High Efficiency** (that is the HEIC one).
   If it says **Most Compatible**, the phone is already saving JPEGs — switch it to High Efficiency
   and **take a couple of fresh photos** to test with.
3. Take **3 photos**: one normal, and one as large as you can get (a very detailed scene, or use
   burst/portrait mode). Big files matter for check 4.

Then open **Safari** on the iPhone and go to the link above and sign in.

---

## Check 1 — attach a photo to a NEW note  ⭐ this is the important one

1. On the work order, go to the **Notes** tab.
2. Tap **Attach Files**.
3. Choose **Photo Library** and pick **one photo** from the camera roll.
4. Tap the confirm/**Create** option to save the note.

**What should happen:**
- The note is created and **the picture is visible in the note** (you can actually see the photo, not
  just a file name or a download link).
- No spinner that keeps spinning forever.
- No error message.

**Now prove it converted** — this is the bit that actually decides the ticket:
- Tap the attachment / use **Download** on it and look at the **file name**.
- It must end in **`.jpg`** (or `.jpeg`).
- ❌ If the name ends in **`.heic`**, the fix has NOT worked — write that down, it is the main failure
  we are looking for.

---

## Check 2 — attach a photo to an EXISTING note

1. Find a note that is already there.
2. Tap the **⋮** (three dots) on that note.
3. Tap **Attach files**.
4. Pick a photo from the camera roll.

**What should happen:** same as check 1 — the photo shows in the note, and the file name ends `.jpg`.

*(Why this is separate: the fix had to be applied in two different places in the app. One can work
while the other is broken.)*

---

## Check 3 — the known trade-off (so you don't report it as a bug)

1. Tap **Attach Files** again, but this time choose **Browse / Files** instead of Photo Library.
2. Try to find a `.heic` file saved in the Files app.

**Expected: you CANNOT pick it — it is greyed out or simply not shown. That is correct and
intentional. Do not raise a bug for it.**

The developer flagged this himself as a deliberate trade-off: only the camera-roll route converts the
photo. Making `.heic` selectable from Files would switch the conversion off, so the two cannot both
be had.

---

## Check 4 — the big photo and the multi-select 🔴 THE MOST IMPORTANT CHECK AFTER CHECK 1

**Please do not skip this one.** We have now proven, by running the app's real code, that there is a
timing trap in it: **if the photo takes longer than 0.3 seconds to arrive, the app throws it away
silently** — no error, no message, no spinner. We proved the app loses the file when that happens. What
we cannot know without a phone is whether the iPhone's photo conversion is slow enough to trigger it.
**Big photos are the most likely to trigger it. That is what you are hunting here.**

1. Tap **Attach Files** → **Photo Library**.
2. Select **your largest photo**, attach it, and watch what happens.
3. Then do it again selecting **3 photos at once**.
4. If you can, try once more on the **oldest / slowest iPhone** you can get hold of.

**Expected:** every photo attaches and appears, as `.jpg`.

**🔴 Watch for exactly this failure:** you pick the photo(s), the picker closes, and then **nothing
happens at all** — no photo attached, no error, no spinner, as if you had tapped Cancel.

If you see that: **write down the photo size, the iPhone model and the iOS version, and say so
straight away.** That is a real defect, we already know the mechanism, and it means the fix is not
finished — a bigger delay allowance would be needed before this can ship.

---

## What to send back

For each of the 4 checks, just: **worked / didn't work**, plus

1. A **screenshot of the note with the photo showing**.
2. The **attachment's file name** (the `.jpg` vs `.heic` answer — this is the key evidence).
3. **iPhone model and iOS version** (Settings → General → About). The dev asked for this — there is a
   note in the code to record which iOS version it was confirmed on.
4. If anything failed, a screenshot of the screen and roughly what you did just before.

---

## How to read the result

| What you saw | What it means |
|---|---|
| Photo shows in the note, file name ends `.jpg` | ✅ **The fix works.** This is what we want on checks 1, 2 and 4. |
| Photo attaches but the file name ends `.heic` | ❌ The phone didn't convert. **We have already ruled out the most likely cause** — the server's allowed-file list was checked on 5 Aug and correctly excludes HEIC, and we confirmed on the real page that the picker does not advertise it. So if you see this, it is something we have not accounted for and needs a developer. |
| You pick a photo and **nothing happens at all** | ❌ **The 300-millisecond timing trap.** This one is already **confirmed to exist in the code** — we proved a late-arriving photo is silently discarded. Your sighting would confirm the iPhone is slow enough to trigger it. Note the photo size, iPhone model and iOS version. |
| `.heic` can't be picked from the Files app | ✅ Expected and intentional. Not a bug. |
| Spinner spins forever | ❌ The original bug is back — this is the exact symptom the ticket was raised for. |

**Already checked for you, so you don't need to:** the picker really does hide HEIC on the real page
(both the **Attach Files** button and the **⋮ → Attach files** menu), the server's allowed-file list
has no HEIC in it, and dragging a `.heic` onto a note is correctly refused. Details in
`FINDINGS-2026-08-05.md`. **Your job is only the part that needs a phone.**

---

## One thing to ignore

Trying this on a **computer** with a `.heic` file will show an error. **That is expected** and is not
a defect — the QA lead already tested that on 5 August and Slavcho confirmed it:

> "This is expected behavior, .heic images are patented and are not supported by major browsers. This
> should be tested from an iPhone."

Browsers cannot read HEIC. The whole point of the fix is that the phone converts the photo before it
is ever uploaded, so **the iPhone is the only place this can be tested.**
