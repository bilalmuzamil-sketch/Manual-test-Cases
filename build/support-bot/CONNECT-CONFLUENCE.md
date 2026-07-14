# Connect Confluence to your Support Bot (auto-update, no re-upload)

This makes the bot read the **live** Custom Roles & Permissions spec, so any
edit Product makes shows up in the bot's answers with **no manual re-upload**.

You do this once, inside claude.ai. It takes about 5 minutes.

---

## What you'll need

- You're an owner/admin of the **"Support: Custom Roles Release"** Project in
  claude.ai (the bot you already created).
- Your ShopView Confluence account (the same one you use to open the spec page).
- Your claude.ai plan allows connectors (Team/Enterprise, or Pro with
  connectors enabled). If you don't see the connector option, that's the
  blocker — see "If you can't find it" below.

---

## Step 1 — Turn on the Confluence connector

1. In claude.ai, click your name/profile (bottom-left) → **Settings**.
2. Open **Connectors** (may be called "Connectors" or "Integrations").
3. Find **Atlassian / Confluence** and click **Connect**.
4. A Confluence/Atlassian login window opens — sign in and click **Allow** to
   let Claude read your Confluence pages.
5. You should now see Confluence listed as **Connected**.

## Step 2 — Allow the connector inside your Project

1. Open your **"Support: Custom Roles Release"** Project.
2. Open the Project's **settings / tools** (the same area where you set
   instructions and knowledge).
3. Make sure **Confluence** is enabled/allowed for this Project so the bot can
   use it.

## Step 3 — Update the bot's instructions

The bot needs to know it can now use the live page. On the launcher page
(the 🛠️ link), the **"Copy the bot instructions"** button now includes this.

1. Open the 🛠️ launcher → **"Launch the AI bot"** tab → **Copy the bot
   instructions**.
2. In your Project → **Instructions** → select all, delete, paste the new text,
   save.

(The updated instructions tell the bot: the live Confluence page is the current
source of truth; still translate it into plain language; still follow the
escalation rules.)

## Step 4 — Test it

Start a **new chat** in the Project and ask:

> "According to the current spec, which two system roles cannot be edited?"

- ✅ Correct: **Office and Time Clock**. If you watch closely you may see it
  check Confluence before answering.
- If it says it can't access Confluence, re-check Steps 1–2 (the connector isn't
  enabled for the Project yet).

Then, to prove it's truly live: ask someone to make a tiny edit to the spec page
and ask the bot the same question again — it should reflect the edit without any
re-upload.

---

## Good to know

- **Keep the uploaded files too.** Leave `knowledge-base.md` and `faq.md` in the
  Project's knowledge. They're the bot's fast, safe, plain-language default; the
  live page is used when being current matters. The instructions tell the bot
  the live page wins if they ever disagree.
- **The daily sync still runs.** It keeps the GitHub copies and the launcher
  current and still alerts you on changes — a useful paper trail even though you
  no longer *need* to re-upload.
- **Access = the connected account's access.** The bot can read what your
  connected Confluence login can read. Use an account that can see the PM space.

## If you can't find the connector

If Settings has no Confluence connector, your claude.ai plan likely doesn't
include connectors for Projects. Two choices:
1. Ask your claude.ai workspace admin to enable connectors, or
2. Switch to the fully-automatic **custom bot** approach (reads the polished
   knowledge from GitHub, no connector needed) — ask Claude to build it.
