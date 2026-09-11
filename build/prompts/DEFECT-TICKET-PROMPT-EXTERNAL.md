# Prompt — write a defect ticket that cannot be thrown back

Give this whole file to the person (or the AI assistant) writing the ticket. It is self-contained and
tool-agnostic. Where it says "the tracker" it means Jira, Azure DevOps, Linear or whatever you use.

---

## 0 · Before you write a word

**Finding something is not a reason to file.** Three things must be true first:

1. **Someone with authority has asked for a ticket for THIS finding.** A general "yes, raise bugs" from
   last week does not cover today's finding. Ask per ticket.
2. **One at a time.** File one → it gets reviewed → only then the next. Never a batch. A weak ticket in
   a batch discredits the good ones beside it.
3. **Re-reproduce it on the build as it stands today.** Findings go stale. If it no longer reproduces,
   close it and say so.

**The asymmetry that justifies the caution:** a finding held back one more day costs nothing and is
fully recoverable. A ticket thrown back cannot be recovered — a withdrawn ticket stays on the record,
and it spends the credibility that makes your next finding believed.

---

## 1 · Reconcile three ways before the ticket exists

Most rejected tickets are not badly written. They are **not defects**. Line up three things and read
all three **live** — never from memory, never from your own earlier notes:

| | What | Where it must come from |
|---|---|---|
| **A** | What the **test case** says should happen | read live from the test management tool |
| **B** | What the **specification** says **today** | fetched this session, quoted word for word, with its page id and the date you read it |
| **C** | What the **build actually does** | observed by you, on this build, with evidence captured |

Then:

- **A agrees with B, C differs** → a real defect. Proceed.
- **A disagrees with B** → **the test case is wrong, not the product.** Do not file. Propose correcting
  the case instead, showing both wordings side by side.
- **B is silent or ambiguous** → do not decide it yourself. Hold it and ask the product owner.

Never quote a requirement from your own notes, from the test case's own wording, or from a remembered
version of the spec. Open the source, take the wording, record the page id and the date you read it.

---

## 2 · Prove the finding is real before writing it up

Any claim of the form **nothing happened · it is absent · it is broken · it cannot be done** needs all
of this, or it is not a finding yet:

- **A positive control in the same run** — the same check, same path, same moment, against a case that
  *should* produce the thing. If the control does not produce it, your test is broken. Fix the test, do
  not file the finding.
- **At least two attempts** on a fully loaded page.
- **A check for what you might have missed** — did it open a new tab? navigate away? show a message
  that faded before you looked? On-screen messages disappear: watch from the moment of the click, not
  several seconds later.
- **The starting state read back.** A save that reports success is not proof the data landed. Read it
  back and confirm.
- **One question answered honestly, in writing:** *"What would make this my mistake, and how did I rule
  that out?"*

---

## 3 · The ticket — eight headings, in this order

| # | Heading | What goes in it |
|---|---|---|
| 1 | **Environment** | First, so the reader knows what they are looking at. Site · build number · which account and role · date · **the exact record used, with a full clickable link** so they can open it themselves. |
| 2 | **The problem** | Two or three plain sentences saying **what is happening**. **No assumed effects** — no severity, no impact paragraph, no "this will affect X customers", no guessing at consequences. State the fault, not its importance. |
| 3 | **Steps to reproduce** | Numbered, one action per line, **the easiest route a non-technical tester can follow** — including the steps that create any data needed, with the exact values to type. On-screen labels only. No API calls, no internal names. |
| 4 | **Screenshots** | **Inline and annotated**, sized to fill the description area without overflowing it. Each with a one-line caption saying what is happening. **Not a list of attachments** — embedded in the body where the reader is looking. |
| 5 | **Current behaviour** | Short plain bullets. What the build does today. Anything that IS correct goes here too, as a bullet. |
| 6 | **Expected behaviour** | Short plain bullets. What should happen. Non-technical. |
| 7 | **Sources** | Document name, page id, date read, a clickable link — then each requirement **quoted word for word in its own quote block, labelled with its id**, so anyone can navigate straight to it. |
| 8 | **Test cases** | The test run with its link, then each case id with its link. **A case number never travels alone** — case id, case link, and the run it ran in. |

### Language

Plain English throughout. **No jargon, no internal ids, no endpoints, no HTTP verbs, no case ids in the
reader-facing prose.** Use the product's exact on-screen labels. Everything technical goes in the last
section and nowhere above it.

If the reader has to decode it, or open something else to understand it, it is not written yet.

---

## 4 · Screenshots — the part most people get wrong

A ticket without inline annotated screenshots gets thrown back.

- **Capture the full screen**, and stamp it with the build number and the address, so the image proves
  its own provenance without the reader taking your word for it.
- **Annotate with numbered callout boxes and a legend underneath**, so a small box never has to carry a
  long caption. Numbered boxes let the prose refer to "①" and stay readable.
- **Two images usually tell the story**: what happens now, and what it should look like.
- Size them to the description frame. An image that overflows gets scrolled past; a thumbnail gets
  ignored.

Any image editor does this. If you want it scripted, a ~100-line Python script using Pillow is enough:
crop, draw red rectangles with numbered tags, append a legend strip. Ask and I will share ours.

---

## 5 · The markup trap — where this usually goes wrong with Jira

Jira has **two different markup dialects**, and the API route you choose decides which one you must
write. Mixing them produces a ticket that prints `h2.` and `{quote}` as literal text on the page.

| Route | Dialect | Use it for |
|---|---|---|
| Modern REST / MCP tools that build the rich document format | **Markdown** (`##`, `>`, `1.`, tables) | Creating the issue, and text-only edits |
| `PUT /rest/api/2/issue/{KEY}` | **Wiki markup** (`h2.`, `{quote}`, `\|\|`, `#`, `!file.png\|width=760!`) | **Any ticket carrying inline images — this is the only route that embeds them** |

### The sequence that works

1. **Create the issue** with the modern route, text only.
2. **Attach the images:** multipart POST to `/rest/api/3/issue/<KEY>/attachments` with the header
   `X-Atlassian-Token: no-check`.
3. **Replace the description:** `PUT /rest/api/2/issue/<KEY>` with the description as a **wiki-markup
   string** containing `!yourfile.png|width=760!`.
4. **Verify — never assume.** `GET /rest/api/3/issue/<KEY>?expand=renderedFields&fields=description`
   and check three things:
   - the document contains `mediaSingle` nodes,
   - the rendered HTML contains real `<img src=".../attachment/content/…">`,
   - the rendered HTML contains **no literal** `h2.`, `{quote}` or `||`.

**Attached-but-not-inline fails.** A 200 or 204 is not proof the page looks right — open it and look.

---

## 6 · Ticket fields

Set these to whatever your project uses, but decide them **once** and apply them consistently:

- **Issue type** — the defect type that sits under a story, not a standalone bug type if your workflow
  parents defects to stories.
- **Parent** — the owning story. Parenting to an epic is commonly rejected outright.
- **Priority** — agree a default with your lead and stick to it. Do not reach for the highest band to
  get attention; it is the fastest way to have all your tickets discounted.
- **Links** — also link the owning story as *relates to*.
- Leave out fields that do not apply to the type rather than guessing at values.

Never convert someone else's existing ticket to a different type — in Jira that is a UI-only operation
and it silently wipes some custom fields.

---

## 7 · Before you call it done

- [ ] Permission given, for this specific ticket
- [ ] Reconciled three ways — case, live spec, build
- [ ] Re-reproduced on today's build
- [ ] Positive control run for any "it does not happen" claim
- [ ] All eight headings, in the order above
- [ ] Screenshots inline and annotated, each with a caption
- [ ] Every requirement quoted word for word, labelled, with a link
- [ ] Each case id carries its link and its run
- [ ] Rendered page opened and checked: images really inline, no literal markup
- [ ] Read it once as the engineering manager receiving it. Could they throw it back? On what grounds?
      Close that gap before sending.

---

## 8 · What not to do

- Do not file without permission for that specific ticket.
- Do not file a batch.
- Do not state impact, severity or who is affected unless you measured it.
- Do not quote a requirement you have not opened this session.
- Do not file when the test case, not the product, is the thing that is wrong.
- Do not report "nothing happened" without a positive control.
- Do not put case ids, endpoints or HTTP verbs in the reader-facing prose.
- Do not trust a success code — open the rendered page and look at it.
