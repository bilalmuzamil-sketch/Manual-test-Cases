# Workflow Settings Page - Implementation Guide

## Overview
This document describes the workflow settings page design for Shopview's settings area. Use this to implement the settings page in your codebase.

## Page Structure

### Header & Navigation
- Fixed top header (64px) with logo, main nav, search, and user menu
- Fixed left sidebar (240px) with settings navigation
- Three tabs: Organization, Invoice, **Workflow** (active)

### Page Title
```
Workflow
Configure how advisors complete work orders and which fields are required.
```

## Settings Layout

Each setting is contained in a **white card** with:
- Background: `#FFFFFF`
- Border: 1px solid `#E3E8EF` (grey-200)
- Border radius: 12px
- Padding: 24px
- Margin bottom: 20px (equal spacing between cards)
- Box shadow: `0 1px 2px rgba(16,24,40,0.05)`

### Card Structure
Each card contains a single `.setting-row` with:
- Display: flex
- Justify-content: space-between
- Align-items: flex-start
- Gap: 24px

Left side (`.setting-info`):
- Setting title (14px, semibold, grey-700)
- Setting description (14px, grey-500)
- Toggle state explanation (conditional, see below)
- Subsections (for Create Purchase Orders only)

Right side (`.setting-control`):
- Toggle switch (44×24px)

## Settings List

### 1. Auto-approve lines
**Toggle:** ON by default

**Title:** Auto-approve lines  
**Description:** Configure whether new lines are approved automatically or require manual approval.

**State Explanations:**
- **ON:** New lines are approved automatically when they're added — no separate Approve step. Techs can start work immediately and progress shows on the WO.
- **OFF:** New lines require manual approval before techs can begin work. Advisors must explicitly approve each line.

---

### 2. Create purchase orders
**Toggle:** ON by default

**Title:** Create purchase orders  
**Description:** Configure whether purchase orders are created when a work order with vendor parts is completed.

**State Explanations:**
- **ON:** Purchase orders are created automatically on completion. You can enter vendor invoice numbers during or after the process.
- **OFF:** No purchase orders are created. Work order goes straight to done.

**Subsection (visible only when toggle is ON):**

Gray box with:
- Background: `#F8FAFC` (grey-50)
- Border: 1px solid `#E3E8EF`
- Border radius: 8px
- Padding: 16px
- Margin top: 16px

**Vendor invoice number**  
Choose whether entering a vendor invoice number is optional or required when completing a work order.

Radio options:
- ◉ Optional — advisors can skip and enter later (default)
- ○ Required — must enter before completing WO

---

### 3. Require Tech Story
**Toggle:** OFF by default

**Title:** Require Tech Story  
**Description:** Configure whether tech story is required before completing a line.

**State Explanations:**
- **ON:** Tech story is a required field before a line can be completed on a work order.
- **OFF:** Tech story is optional. Lines can be completed without entering tech notes.

---

### 4. Require Mileage
**Toggle:** OFF by default

**Title:** Require Mileage  
**Description:** Configure whether mileage is required before completing a line.

**State Explanations:**
- **ON:** Mileage is a required field before a line can be completed on a work order.
- **OFF:** Mileage is optional. Lines can be completed without entering mileage.

---

### 5. Require Engine Hours
**Toggle:** OFF by default

**Title:** Require Engine Hours  
**Description:** Configure whether engine hours are required before completing a line.

**State Explanations:**
- **ON:** Engine hours are a required field before a line can be completed on a work order.
- **OFF:** Engine hours are optional. Lines can be completed without entering engine hours.

---

### 6. Automatically Pick Inventory Parts
**Toggle:** ON by default

**Title:** Automatically Pick Inventory Parts  
**Description:** Configure whether inventory parts skip the pick step.

**State Explanations:**
- **ON:** Inventory and found parts automatically skip the pick step and go straight to staged when authorized.
- **OFF:** Inventory parts require manual picking. Parts must be picked before they can be staged.

---

## Toggle State Explanation Styling

Each setting shows ONE explanation box at a time based on toggle state:

```css
.toggle-state-explanation {
  margin-top: 12px;
  padding: 12px;
  background: #F8FAFC; /* grey-50 */
  border-radius: 6px;
  border-left: 3px solid #257CFF; /* blue when ON */
  font-size: 13px;
  color: #697586; /* grey-500 */
  line-height: 1.5;
}

.toggle-state-explanation.off {
  border-left-color: #CDD5DF; /* grey-300 when OFF */
}
```

The `<strong>` tag on "ON:" or "OFF:" should be:
- Font weight: 600
- Color: `#364152` (grey-700)

---

## Toggle Switch Styling

```css
.toggle-switch {
  position: relative;
  width: 44px;
  height: 24px;
  cursor: pointer;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  inset: 0;
  background: #CDD5DF; /* grey-300, OFF state */
  border-radius: 12px;
  transition: all 160ms ease-out;
}

.toggle-slider:before {
  content: '';
  position: absolute;
  height: 18px;
  width: 18px;
  left: 3px;
  top: 3px;
  background: white;
  border-radius: 50%;
  transition: all 160ms ease-out;
  box-shadow: 0 1px 3px rgba(0,0,0,0.15);
}

.toggle-switch input:checked + .toggle-slider {
  background: #257CFF; /* primary blue, ON state */
}

.toggle-switch input:checked + .toggle-slider:before {
  transform: translateX(20px);
}

.toggle-switch:hover .toggle-slider {
  background: #9AA4B2; /* grey-400 */
}

.toggle-switch input:checked:hover + .toggle-slider {
  background: #175CD3; /* primary-700 */
}
```

---

## JavaScript Behavior

### Toggle ON/OFF State Explanations
When a toggle is clicked:
1. Hide the current state explanation
2. Show the new state explanation
3. Update the border color (blue for ON, grey for OFF)

### Create Purchase Orders Special Behavior
When the "Create purchase orders" toggle is:
- **ON**: Show the "Vendor invoice number" subsection
- **OFF**: Hide the "Vendor invoice number" subsection completely

---

## Save Button

Fixed at bottom of page:
- Position: fixed, bottom: 0, right: 0, left: 240px (account for sidebar)
- Background: white
- Border top: 1px solid `#E3E8EF`
- Padding: 16px 24px
- Z-index: 50

Button:
- "Save Settings"
- Background: `#257CFF`
- Color: white
- Padding: 10px 20px
- Border radius: 8px
- Font size: 14px
- Font weight: 600
- Hover: `#175CD3` (primary-700)

---

## Spacing Summary

- Between cards: 20px
- Card padding: 24px
- Gap between setting info and toggle: 24px
- Margin top for state explanation: 12px
- Padding inside state explanation: 12px
- Margin top for subsection: 16px
- Padding inside subsection: 16px

---

## Default States

On page load:
- Auto-approve lines: **ON** (show ON explanation)
- Create purchase orders: **ON** (show ON explanation + vendor subsection)
- Require Tech Story: **OFF** (show OFF explanation)
- Require Mileage: **OFF** (show OFF explanation)
- Require Engine Hours: **OFF** (show OFF explanation)
- Automatically Pick Inventory Parts: **ON** (show ON explanation)

---

## Implementation Notes

1. Each toggle needs an `onChange` handler to swap the visible state explanation
2. The "Create purchase orders" toggle needs special logic to show/hide the vendor invoice subsection
3. All toggles should be keyboard accessible (Space/Enter to toggle)
4. The vendor invoice radio buttons inside the subsection are standard radio inputs with `name="vendor-invoice"`
5. Use the Shopview design system colors from `colors_and_type.css`
6. Icons (if any) should use Lucide icon library with 16px size
