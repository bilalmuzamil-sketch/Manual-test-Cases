# Dropdown Search bookmarklet

A bookmarklet that adds a search box for the dropdowns on whatever page you are on.

## Install

- **Easiest:** open `install.html` in your browser and drag the blue **Dropdown search** button onto the bookmarks bar.
- **By hand:** create a new bookmark, name it *Dropdown search*, and paste the whole contents of `bookmarklet.txt` into its URL field.

## Use

1. Click **Dropdown search** in the bookmarks bar. A search box opens at the top right of the page.
2. Type. Every matching option is listed with the dropdown it belongs to. Several words must all match, in any order (`sato ha` finds *Hana Sato*). Matching ignores upper/lower case.
3. **Custom dropdowns** (the kind that open a pop-up list, such as Quasar `q-select` in ShopView): open the dropdown first, then search. The pop-up stays open, options that do not match are hidden in it, and matches get a blue outline. Results from the open pop-up are listed first.
4. **↓ / ↑** move through the results, **Enter** or a click selects one, **Esc** closes the box (clicking the bookmarklet again also closes it). Drag the blue title bar to move the box.

Selecting a result:
- in a normal dropdown (`<select>`), sets its value and fires `input` + `change`, so the page reacts as if you had picked it. The dropdown gets a green outline for 1.5 s. A multi-select toggles the option;
- in a custom pop-up, clicks the option.

## What it searches

- Every visible, enabled `<select>` on the page, open or closed.
- Any open pop-up list built with: Quasar (`q-menu`/`q-item`), ARIA `role="listbox"`/`"menu"` (`option`, `menuitem…`), Bootstrap, Select2, Ant Design, MUI Autocomplete, Vuetify.

## Limits

- A custom dropdown is searchable only while it is open — its options do not exist on the page until then.
- **Long lists that load as you scroll** (Quasar virtual scroll, infinite scroll) only have the rows currently drawn on the page, so options further down are not found. Use the dropdown's own type-to-filter box where it has one.
- Hidden `<select>` elements behind custom widgets are skipped on purpose; selecting them would not update the widget you see.
- Dropdowns inside iframes are not searched.
- Some sites with a strict Content Security Policy block all bookmarklets.

## Editing

`dropdown-search.js` is the readable source. After changing it run:

```bash
node build.js
```

That regenerates `bookmarklet.txt` and `install.html` (and fails if the packed code is not valid JavaScript). The source must use block comments only and end every statement with a semicolon, because it is packed onto one line.

Test (uses the pre-installed Playwright; the fixture loads Vue 3.4.38 + Quasar 2.16.9 from jsDelivr):

```bash
node test/run_test.js
```

It checks a native `<select>` and a real Quasar `q-select`: matches listed, the Quasar pop-up stays open while you type in the box, non-matches hidden, Enter / ↓ select the right option, multi-word search, Esc and re-click close the box, no page errors.
