#!/usr/bin/env python3
"""Writes wo-visual-config.json for build/testing-tools/design_visual_inventory.py (WO Board & Tech View, design export 14 Oct 2026)."""
import json, pathlib
MAIN, NOFIX, DET = "Work Orders.dc.html", "Work Orders -no page-fix-.dc.html", "Work Orders Details.dc.html"
TECH = {"click": "button[aria-label='By Lead Tech']"}
BOARD = {"click": "button[aria-label='Board']"}
HDR = "div[style*='grid-template-columns'][style*='position: sticky']"
def drag_js(src, dst, end=False):
    return ("(() => { const s = document.querySelector('[data-wo=\"%s\"]'); const t = document.querySelector('[data-group-id=\"%s\"] [data-gdrag]');"
            " const dt = new DataTransfer(); const o = {bubbles: true, cancelable: true, dataTransfer: dt}; const r = t.getBoundingClientRect();"
            " s.dispatchEvent(new DragEvent('dragstart', o)); t.dispatchEvent(new DragEvent('dragover', Object.assign({clientX: r.left + 20, clientY: r.top + 10}, o))); })()") % (src, dst)
def drag_row_js(src, dst_wo):
    return ("(() => { const s = document.querySelector('[data-wo=\"%s\"]'); const t = document.querySelector('[data-wo=\"%s\"]');"
            " const dt = new DataTransfer(); const o = {bubbles: true, cancelable: true, dataTransfer: dt}; const r = t.getBoundingClientRect();"
            " s.dispatchEvent(new DragEvent('dragstart', o)); t.dispatchEvent(new DragEvent('dragover', Object.assign({clientX: r.left + 30, clientY: r.top + r.height - 4}, o))); })()") % (src, dst_wo)
def drag_group_js(src, dst):
    return ("(() => { const s = document.querySelector('[data-group-id=\"%s\"] [data-gdrag]'); const t = document.querySelector('[data-group-id=\"%s\"] [data-gdrag]');"
            " const dt = new DataTransfer(); const o = {bubbles: true, cancelable: true, dataTransfer: dt}; const r = t.getBoundingClientRect();"
            " s.dispatchEvent(new DragEvent('dragstart', o)); t.dispatchEvent(new DragEvent('dragover', Object.assign({clientX: r.left + r.width / 2 + 5, clientY: r.top + r.height / 2 + 5}, o))); })()") % (src, dst)
SEARCH = [{"click": "div[data-popover-host][style*='padding: 16px 24px'] >> text=Search"}, {"type": "zzzz", "_wait": 900}]

core = [
    {"id": "list", "meta": {"view": "List", "density": "Medium (List row height)"}, "actions": []},
    {"id": "tech-compact", "props": {"rowHeight": "small"}, "meta": {"view": "Tech View", "density": "Compact (design: Small)"}, "actions": [TECH]},
    {"id": "tech-regular", "meta": {"view": "Tech View", "density": "Regular (design: Medium)"}, "actions": [TECH]},
    {"id": "tech-comfortable", "props": {"rowHeight": "large"}, "meta": {"view": "Tech View", "density": "Comfortable (design: Large)"}, "actions": [TECH]},
    {"id": "board-detailed", "meta": {"view": "Board View", "density": "design: Detailed card"}, "actions": [BOARD]},
    {"id": "board-compact", "meta": {"view": "Board View", "density": "design: Compact card"}, "actions": [BOARD, {"click": "button[title='Card size']"}, {"click_text": "Compact"}]},
]
S = lambda i, view, actions, **k: dict({"id": i, "meta": {"view": view, "density": k.pop("density", "Regular (design: Medium)") if view == "Tech View" else k.pop("density", "design: Detailed card" if view == "Board View" else "")}, "actions": actions}, **k)
states = [
    S("tech-all-columns", "Tech View", [TECH, {"click": "button[title='Columns']"}, {"click_text": "Show all"}, {"press": "Escape"}, {"mouse": [5, 400]}]),
    S("tech-all-columns-compact", "Tech View", [TECH, {"click": "button[title='Columns']"}, {"click_text": "Show all"}, {"press": "Escape"}, {"mouse": [5, 400]}], props={"rowHeight": "small"}, density="Compact (design: Small)"),
    S("tech-all-columns-comfortable", "Tech View", [TECH, {"click": "button[title='Columns']"}, {"click_text": "Show all"}, {"press": "Escape"}, {"mouse": [5, 400]}], props={"rowHeight": "large"}, density="Comfortable (design: Large)"),
    S("tech-columns-menu", "Tech View", [TECH, {"click": "button[title='Columns']"}], probe={"host": "button[title='Columns']"}),
    S("tech-density-menu", "Tech View", [TECH, {"click": "button[title='Row height']"}], probe={"host": "button[title='Row height']"}),
    S("board-density-menu", "Board View", [BOARD, {"click": "button[title='Card size']"}], probe={"host": "button[title='Card size']"}),
    S("list-columns-menu", "List", [{"click": "button[title='Columns']"}], probe={"host": "button[title='Columns']"}),
    S("list-density-menu", "List", [{"click": "button[title='Row height']"}], probe={"host": "button[title='Row height']"}),
    S("tech-hover-switch-list", "Tech View", [TECH, {"hover": "button[aria-label='Table']"}], probe={"host": "button[aria-label='Table']"}),
    S("tech-hover-switch-tech", "Tech View", [TECH, {"hover": "button[aria-label='By Lead Tech']"}], probe={"host": "button[aria-label='By Lead Tech']"}),
    S("tech-hover-switch-board", "Tech View", [TECH, {"hover": "button[aria-label='Board']"}], probe={"host": "button[aria-label='Board']"}),
    S("board-hover-switch-board", "Board View", [BOARD, {"hover": "button[aria-label='Board']"}], probe={"host": "button[aria-label='Board']"}),
    S("tech-group-count-tooltip", "Tech View", [TECH, {"dispatch": ["section[data-group-id='esther'] > div[data-gdrag] [data-tip]", "mouseover"]}], probe={"host": "section[data-group-id='esther'] > div[data-gdrag] [data-tip]"}),
    S("tech-unassigned-count-tooltip", "Tech View", [TECH, {"dispatch": ["section[data-group-id='unassigned'] > div[data-gdrag] [data-tip]", "mouseover"]}], probe={"host": "section[data-group-id='unassigned'] > div[data-gdrag] [data-tip]"}),
    S("board-count-tooltip", "Board View", [BOARD, {"dispatch": ["section[data-group-id='esther'] [data-gdrag] [data-tip]", "mouseover"]}], probe={"host": "section[data-group-id='esther'] [data-gdrag] [data-tip]"}),
    S("tech-lock-tooltip", "Tech View", [TECH, {"eval": "document.querySelector(\"[data-wo='S1-511']\").scrollIntoView({block: 'center'})"}, {"dispatch": ["[data-wo='S1-511'] [data-tip-text]", "mouseover"]}], probe={"host": "[data-wo='S1-511'] [data-tip-text]"}),
    S("board-lock-tooltip", "Board View", [BOARD, {"eval": "document.querySelector(\"[data-wo='S1-511']\").scrollIntoView({block: 'center', inline: 'center'})"}, {"dispatch": ["[data-wo='S1-511'] [data-tip-text]", "mouseover"]}], probe={"host": "[data-wo='S1-511'] [data-tip-text]"}),
    S("tech-avatar-stack-hover", "Tech View", [TECH, {"hover": "[data-wo='S1-644'] img"}], probe={"host": "[data-wo='S1-644'] img"}),
    S("board-avatar-stack-hover", "Board View", [BOARD, {"hover": "[data-wo='S1-644'] img"}], probe={"host": "[data-wo='S1-644'] img"}),
    S("tech-row-hover", "Tech View", [TECH], hover_diff="[data-wo='S1-702']"),
    S("tech-group-header-hover", "Tech View", [TECH], hover_diff="section[data-group-id='esther'] > div[data-gdrag]"),
    S("board-card-hover", "Board View", [BOARD], hover_diff="[data-wo='S1-702']"),
    S("board-card-hover-locked", "Board View", [BOARD], hover_diff="[data-wo='S1-511']"),
    S("list-row-hover", "List", [], hover_diff="tbody tr"),
    S("tech-row-menu", "Tech View", [TECH, {"hover": "[data-wo='S1-702']"}, {"click": "[data-menu='S1-702']"}], probe={"host": "[data-menu='S1-702']"}),
    S("tech-row-menu-locked", "Tech View", [TECH, {"hover": "[data-wo='S1-511']"}, {"click": "[data-menu='S1-511']"}], probe={"host": "[data-menu='S1-511']"}),
    S("tech-row-menu-unassigned", "Tech View", [TECH, {"hover": "[data-wo='S1-352']"}, {"click": "[data-menu='S1-352']"}], probe={"host": "[data-menu='S1-352']"}),
    S("board-card-menu", "Board View", [BOARD, {"hover": "[data-wo='S1-702']"}, {"click": "[data-menu='S1-702']"}], probe={"host": "[data-menu='S1-702']"}),
    S("board-card-menu-button-over-badge", "Board View", [BOARD, {"hover": "[data-wo='S1-702']"}], probe={"host": "[data-menu='S1-702']"}),
    S("tech-reassign-dialog", "Tech View", [TECH, {"hover": "[data-wo='S1-702']"}, {"click": "[data-menu='S1-702']"}, {"click": "[role=menuitem] >> nth=0"}]),
    S("board-reassign-dialog", "Board View", [BOARD, {"hover": "[data-wo='S1-702']"}, {"click": "[data-menu='S1-702']"}, {"click": "[role=menuitem] >> nth=0"}]),
    S("tech-status-chip", "Tech View", [TECH, {"click": "button:has-text('Status') >> nth=0"}]),
    S("tech-technician-chip", "Tech View", [TECH, {"click": "button:has-text('Technician') >> nth=0"}]),
    S("board-technician-chip", "Board View", [BOARD, {"click": "button:has-text('Technician') >> nth=0"}]),
    S("list-chips", "List", []),
    S("tech-technician-chosen", "Tech View", [TECH, {"click": "button:has-text('Technician') >> nth=0"}, {"click_text": "Esther Howard"}, {"press": "Escape"}, {"mouse": [5, 400]}]),
    S("board-technician-chosen", "Board View", [BOARD, {"click": "button:has-text('Technician') >> nth=0"}, {"click_text": "Esther Howard"}, {"press": "Escape"}, {"mouse": [5, 400]}]),
    S("tech-assigned-to-me", "Tech View", [TECH, {"click": "button:has-text('Assigned to me') >> nth=0"}, {"mouse": [5, 400]}]),
    S("board-assigned-to-me", "Board View", [BOARD, {"click": "button:has-text('Assigned to me') >> nth=0"}, {"mouse": [5, 400]}]),
    S("tech-filtered-empty", "Tech View", [TECH, {"click": "button:has-text('Status') >> nth=0"}, {"click_text": "Paid"}, {"press": "Escape"}] + SEARCH),
    S("board-filtered-empty", "Board View", [BOARD, {"click": "button:has-text('Status') >> nth=0"}, {"click_text": "Paid"}, {"press": "Escape"}] + SEARCH),
    S("tech-search-empty", "Tech View", [TECH] + SEARCH),
    S("board-search-empty", "Board View", [BOARD] + SEARCH),
    S("list-filtered-empty", "List", [{"click": "button:has-text('Status') >> nth=0"}, {"click_text": "Paid"}, {"press": "Escape"}] + SEARCH),
    S("tech-no-technicians", "Tech View", [TECH], props={"emptyState": "no-technicians"}),
    S("board-no-technicians", "Board View", [BOARD], props={"emptyState": "no-technicians"}),
    S("tech-no-work-orders", "Tech View", [TECH], props={"emptyState": "no-work-orders"}),
    S("board-no-work-orders", "Board View", [BOARD], props={"emptyState": "no-work-orders"}),
    S("tech-nothing", "Tech View", [TECH], props={"emptyState": "nothing"}),
    S("tech-view-only", "Tech View", [TECH], props={"canAssign": False}),
    S("board-view-only", "Board View", [BOARD], props={"canAssign": False}),
    S("tech-no-financial", "Tech View", [TECH], props={"showFinancials": False}),
    S("board-no-financial", "Board View", [BOARD], props={"showFinancials": False}),
    S("board-pinned-two", "Board View", [BOARD, {"click": "button[data-pin='esther']"}, {"click": "button[data-pin='ralph']"}, {"mouse": [5, 400]}]),
    S("board-pinned-limit", "Board View", [BOARD] + [{"click": f"button[data-pin='{t}']"} for t in ["esther", "ralph", "jenny", "theresa", "kristin"]] + [{"hover": "button[data-pin='cameron']"}], probe={"host": "button[data-pin='cameron']"}),
    S("tech-collapsed-one", "Tech View", [TECH, {"click": "button[data-tech='esther']"}, {"mouse": [5, 400]}]),
    S("tech-collapsed-all", "Tech View", [TECH, {"click": "button[title='Collapse all']"}, {"mouse": [5, 400]}]),
    S("tech-drag-allowed", "Tech View", [TECH, {"eval": drag_js("S1-352", "esther")}]),
    S("tech-drag-refused-locked", "Tech View", [TECH, {"eval": drag_js("S1-511", "ralph")}]),
    S("tech-drag-reorder", "Tech View", [TECH, {"eval": drag_row_js("S1-702", "S1-644")}]),
    S("tech-drag-technician-group", "Tech View", [TECH, {"eval": drag_group_js("esther", "ralph")}]),
    S("board-drag-allowed", "Board View", [BOARD, {"eval": drag_js("S1-352", "esther")}]),
    S("board-drag-refused-locked", "Board View", [BOARD, {"eval": drag_js("S1-511", "ralph")}]),
    S("board-drag-refused-no-permission", "Board View", [BOARD, {"eval": drag_js("S1-352", "esther")}], props={"canAssign": False}),
    S("board-drag-column", "Board View", [BOARD, {"eval": drag_group_js("esther", "ralph")}]),
    S("board-scrolled-right", "Board View", [BOARD, {"eval": "(() => { const e = Array.from(document.querySelectorAll('div')).find(d => d.scrollWidth > d.clientWidth + 8 && /(auto|scroll)/.test(getComputedStyle(d).overflowX)); if (e) e.scrollLeft = 900; })()"}, {"wait": 400}]),
    S("tech-scrolled-down", "Tech View", [TECH, {"eval": "(() => { const e = Array.from(document.querySelectorAll('div')).find(d => d.scrollHeight > d.clientHeight + 8 && /(auto|scroll)/.test(getComputedStyle(d).overflowY)); if (e) e.scrollTop = 520; })()"}, {"wait": 400}]),
    S("tech-toast-after-reassign", "Tech View", [TECH, {"hover": "[data-wo='S1-702']"}, {"click": "[data-menu='S1-702']"}, {"click": "[role=menuitem] >> nth=0"}, {"click": "[role=dialog] button:has-text('Ralph Edwards')"}]),
    S("tech-frame-columns", "Tech View", [TECH], props={"frame": "columns"}),
    S("list-frame-settings", "List", [], props={"frame": "settings"}),
]
cfg = {
    "height": 900,
    "themes": {"light": {"color_scheme": "light", "eval": ["window.ShopviewTheme && ShopviewTheme.set('light')"]},
               "dark": {"color_scheme": "dark", "eval": ["window.ShopviewTheme && ShopviewTheme.set('dark')"]}},
    "token_prefer": ["--sv-text-", "--sv-accent", "--sv-surface", "--sv-border-", "--sv-success", "--sv-warning", "--sv-danger", "--sv-info", "--sv-cat-", "--sv-elev-", "--sv-"],
    "icon_registry_js": "window.SV_LUCIDE",
    "icon_registry_files": [{"file": "lucide-icons.js", "var": "SV_LUCIDE"}],
    "token_prefer_bg": ["--sv-surface", "--sv-accent", "--sv-border-", "--sv-success", "--sv-warning", "--sv-danger", "--sv-info", "--sv-cat-", "--sv-elev-", "--sv-text-", "--sv-"],
    "regions": [["tooltip", "[role=tooltip]"], ["row menu", "[role=menu]"], ["dialog", "[role=dialog]"], ["toast", "[role=status]"],
                ["open popover", ".sv-popover, #__open_popover"], ["display switcher", "[role=group][aria-label=View]"],
                ["toolbar", "div[data-popover-host][style*='padding: 16px 24px']"], ["app header", "header"],
                ["Tech View column header row", HDR], ["Tech View group header", "section[data-group-id] > div[data-gdrag]"],
                ["Tech View work order row", "div[data-wo][style*='grid-template-columns']"], ["Board column header", "section[data-group-id] > div > div[data-gdrag]"],
                ["Board card", "div[data-wo][style*='flex-direction: column']"], ["Board column", "section[data-group-id]"], ["minimap", "[data-mm]"],
                ["List table header", "thead"], ["List row", "tbody tr"], ["drag drop line / refusal pill", "div[style*='z-index: 350'], div[style*='z-index: 400']"]],
    "column_header_rows": ["thead tr", HDR],
    "cell_rows": ["tbody tr", "div[data-wo][style*='grid-template-columns']"],
    "row_types": {"Tech View group header": "section[data-group-id] > div[data-gdrag]", "Tech View work order row": "div[data-wo][style*='grid-template-columns']",
                  "Board column header": "section[data-group-id] > div > div[data-gdrag]", "Board card": "div[data-wo][style*='flex-direction: column']",
                  "Empty group or column": "section[data-group-id] div[style*='dashed'], section[data-group-id] > div[style*='justify-content: center']",
                  "Empty / first-run state": "div[style*='min-height: 420px'], div[style*='min-height: 320px'], div[style*='padding: 32px 24px']",
                  "List row": "tbody tr", "Filter chip": "div[data-popover-host] button[aria-expanded], div[data-popover-host] > div > div > button",
                  "Toolbar button": "button[title='Columns'], button[title='Row height'], button[title='Card size']"},
    "frame_targets": [{"name": "Tech View table (column header row)", "selector": HDR},
                      {"name": "Tech View first group header", "selector": "section[data-group-id] > div[data-gdrag]"},
                      {"name": "Board View column strip", "selector": "div[style*='width: max-content'][style*='gap: 16px']"},
                      {"name": "Board View first column", "selector": "section[data-group-id] > div[style*='border-radius: 12px']"},
                      {"name": "List table", "selector": "table"},
                      {"name": "Toolbar", "selector": "div[data-popover-host][style*='padding: 16px 24px']"},
                      {"name": "Empty state block", "selector": "div[style*='min-height: 320px'], div[style*='min-height: 420px']"}],
    "overlay_selectors": ["[role=tooltip]", "[role=menu]", "[role=dialog]", ".sv-popover", "#__open_popover", "span[style*='bottom: calc(100% + 6px)']", "[role=status]", "div[style*='z-index: 400']", "div[style*='z-index: 350']"],
    "sticky_probes": [{"name": "Tech View column header row (scroll down 400)", "selector": HDR, "dy": 400},
                      {"name": "Tech View 'Esther Howard' group header (scroll down 200)", "selector": "section[data-group-id='esther'] > div[data-gdrag]", "dy": 200},
                      {"name": "Tech View Unassigned group header (scroll down 200)", "selector": "section[data-group-id='unassigned'] > div[data-gdrag]", "dy": 200},
                      {"name": "Board 'Unassigned' column (scroll right 800)", "selector": "section[data-group-id='unassigned']", "dx": 800, "dy": 0},
                      {"name": "Board 'Esther Howard' column header (scroll its cards down 300)", "selector": "section[data-group-id='esther'] > div > div[data-gdrag]", "dy": 300}],
    "accent_token": "--sv-accent", "max_rows": 40, "row_key_attr": "data-wo",
    "matrix": [
        {"id": "core", "boards": [MAIN, NOFIX, DET], "themes": ["light", "dark"], "widths": [1440, 1536], "variants": core, "sticky": True},
        {"id": "widths", "boards": [MAIN], "themes": ["light"], "widths": [768, 1024, 1280, 1366, 1920],
         "variants": [v for v in core if v["id"] in ("list", "tech-regular", "tech-comfortable", "board-detailed")] + [states[0]]},
        {"id": "states", "boards": [MAIN], "themes": ["light", "dark"], "widths": [1440], "variants": states},
        {"id": "states1536", "boards": [MAIN], "themes": ["light"], "widths": [1536], "variants": [s for s in states if s["id"].startswith(("tech-all-columns", "tech-hover-switch", "tech-group-count", "tech-columns-menu"))]},
    ],
}
pathlib.Path(__file__).with_name("wo-visual-config.json").write_text(json.dumps(cfg, indent=1))
n = sum(len(m["boards"]) * len(m["themes"]) * len(m["widths"]) * len(m["variants"]) for m in cfg["matrix"])
print("states:", n)
