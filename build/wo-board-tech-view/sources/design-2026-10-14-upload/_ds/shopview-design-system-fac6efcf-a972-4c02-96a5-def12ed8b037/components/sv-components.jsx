/* ============================================================================
   Shopview Design System — React component layer
   ----------------------------------------------------------------------------
   Every component renders the `sv-*` classes defined in components.css, so a
   React artboard and a plain-HTML artboard produce byte-identical pixels.

   No component in this file contains a hex colour, a font name, or a themed
   value. If you need a colour, it is a token. If a token does not exist, stop
   and say so — do not invent one.

   Requires, in this order:
     colors_and_type.css      tokens
     components.css           component layer
     lucide-icons.js          svIcon()          (optional, degrades gracefully)
     components/tokens.js     SV_T              (optional, for custom surfaces)
   ========================================================================== */

const { useState: useSvState, useEffect: useSvEffect, useRef: useSvRef, useCallback: useSvCallback } = React;

/* Icon — thin wrapper over the project's Lucide set.
   A missing glyph used to render as an empty box and say nothing, which is
   how `chevron-right` went unnoticed. Now it warns once per name, so a typo
   or a glyph that was never vendored shows up the first time it renders. */
const _svIconWarned = new Set();

function Icon({ name, size = 20, style, className }) {
  if (typeof window.svIcon === 'function') {
    const set = window.SV_LUCIDE;
    if (set && !set[name] && !_svIconWarned.has(name)) {
      _svIconWarned.add(name);
      console.warn(
        `[Shopview DS] No icon named "${name}". It is not in SV_LUCIDE (${set ? Object.keys(set).length : 0} glyphs). ` +
        'Pick an existing one, or vendor the glyph into lucide-icons.js — do not ship an empty box.'
      );
    }
    return window.svIcon(name, size, { style, className });
  }
  return <span aria-hidden className={className} style={{ display: 'inline-block', width: size, height: size, flex: 'none', ...style }} />;
}

const cx = (...parts) => parts.filter(Boolean).join(' ');

/* ------------------------------------------------------------------ BUTTON */
function Button({ variant = 'secondary', size = 'md', icon, iconTrailing, children, className, ...rest }) {
  return (
    <button
      type="button"
      className={cx('sv-btn', `sv-btn--${variant}`, size === 'sm' && 'sv-btn--sm', className)}
      {...rest}
    >
      {icon && <Icon name={icon} size={size === 'sm' ? 16 : 20} />}
      {children}
      {iconTrailing && <Icon name={iconTrailing} size={size === 'sm' ? 16 : 20} />}
    </button>
  );
}

function SplitButton({ variant = 'primary', children, onMain, onCaret, className, ...rest }) {
  return (
    <span className={cx('sv-split', `sv-split--${variant}`, className)} {...rest}>
      <button type="button" className="sv-split__label" onClick={onMain}>{children}</button>
      <span className="sv-split__divider" />
      <button type="button" className="sv-split__caret" onClick={onCaret} aria-label="More actions">
        <Icon name="chevron-down" size={14} />
      </button>
    </span>
  );
}

/* ------------------------------------------------------------------- INPUT
   Floating label. Two requirements the spec makes load-bearing:
     - the <input> renders BEFORE the <label>  (adjacent sibling combinator)
     - placeholder is a single space           (:not(:placeholder-shown))
   Both are handled here so no caller can get them wrong. */
function Input({ label, hint, error, id, className, ...rest }) {
  const auto = useSvRef(`sv-in-${Math.random().toString(36).slice(2, 9)}`);
  const fieldId = id || auto.current;
  return (
    <div className={className}>
      <div className={cx('sv-field', error && 'sv-field--error')}>
        <input id={fieldId} placeholder=" " {...rest} />
        <label htmlFor={fieldId}>{label}</label>
      </div>
      {(error || hint) && (
        <div className={cx('sv-hint', error && 'sv-hint--error')}>{error || hint}</div>
      )}
    </div>
  );
}

/* Dropdown field. Readonly input + chevron, exactly as the spec draws it. */
function Select({ label, hint, error, value, id, className, onClick, ...rest }) {
  const auto = useSvRef(`sv-sel-${Math.random().toString(36).slice(2, 9)}`);
  const fieldId = id || auto.current;
  return (
    <div className={className}>
      <div className={cx('sv-field', 'sv-field--select', error && 'sv-field--error')}>
        <input id={fieldId} placeholder=" " readOnly value={value ?? ''} onClick={onClick} {...rest} />
        <label htmlFor={fieldId}>{label}</label>
        <span className="sv-field__chevron"><Icon name="chevron-down" size={16} /></span>
      </div>
      {(error || hint) && (
        <div className={cx('sv-hint', error && 'sv-hint--error')}>{error || hint}</div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- CONTROLS
   Checked state is a TINTED fill with an accent glyph — not a solid accent
   fill with a white tick. Verified against preview/controls.html. */
function Checkbox({ checked = false, indeterminate = false, disabled = false, label, onChange, className }) {
  const box = (
    <span
      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : checked}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : 0}
      className={cx('sv-check', (checked || indeterminate) && 'is-checked', disabled && 'is-disabled', className)}
      onClick={() => !disabled && onChange?.(!checked)}
      onKeyDown={(e) => { if (!disabled && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); onChange?.(!checked); } }}
    >
      {(checked || indeterminate) && (
        <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          {indeterminate ? <path d="M2.5 5h5" /> : <path d="M1.5 5.2 3.9 7.5 8.5 2.5" />}
        </svg>
      )}
    </span>
  );
  if (!label) return box;
  return <label className="sv-control-row">{box}{label}</label>;
}

function Radio({ checked = false, disabled = false, label, onChange, name, className }) {
  const dot = (
    <span
      role="radio"
      aria-checked={checked}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : 0}
      data-name={name}
      className={cx('sv-radio', checked && 'is-checked', disabled && 'is-disabled', className)}
      onClick={() => !disabled && onChange?.(true)}
      onKeyDown={(e) => { if (!disabled && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); onChange?.(true); } }}
    >
      {checked && <span className={cx('sv-radio__dot', disabled && 'is-disabled')} />}
    </span>
  );
  if (!label) return dot;
  return <label className="sv-control-row">{dot}{label}</label>;
}

function Toggle({ on = false, disabled = false, label, onChange, className }) {
  const sw = (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={disabled}
      className={cx('sv-toggle', on && 'is-on', disabled && 'is-disabled', className)}
      onClick={() => !disabled && onChange?.(!on)}
    >
      <span className="sv-toggle__thumb" />
    </button>
  );
  if (!label) return sw;
  return <label className="sv-control-row">{sw}{label}</label>;
}

/* ------------------------------------------------------------------- BADGE
   tone: success | warning | danger | info | neutral
   `error` is accepted as an alias of `danger` for older artboards. */
function Badge({ tone = 'neutral', size = 'md', shape = 'rounded', bordered = true, children, className, ...rest }) {
  const t = tone === 'error' ? 'danger' : tone;
  return (
    <span
      className={cx('sv-badge', `sv-badge--${t}`, size === 'sm' && 'sv-badge--sm',
                    shape === 'square' && 'sv-badge--square', !bordered && 'sv-badge--flat', className)}
      {...rest}
    >{children}</span>
  );
}

/* Two status vocabularies. They are NOT interchangeable — a work order line
   moves through authorisation, an invoice moves through payment. Pick the map
   that matches the column you are rendering. */
const WORK_ORDER_STATUS = {
  'Draft': 'neutral',
  'Imported': 'neutral',
  'Estimate': 'info',
  'Requested': 'warning',
  'Authorization Required': 'warning',
  'Awaiting': 'warning',
  'Review': 'warning',
  'Authorized': 'info',
  'Approved': 'info',
  'In Progress': 'info',
  'Declined': 'danger',
  'Completed': 'success',
  'Complete': 'success',
};

const FINANCE_STATUS = {
  'Estimate': 'info',
  'Invoiced': 'info',
  'Awaiting': 'warning',
  'Partially Paid': 'warning',
  'Overdue': 'danger',
  'Unpaid': 'danger',
  'Paid': 'success',
};

/* Back-compat: the old global `statusTone` resolved both vocabularies from one
   map. Kept so existing artboards render, but new work should pass the map. */
const STATUS_TONE = { ...FINANCE_STATUS, ...WORK_ORDER_STATUS };

function statusTone(status, map) {
  return (map || STATUS_TONE)[status] || 'neutral';
}

function StatusBadge({ status, vocabulary = 'workOrder', ...rest }) {
  const map = vocabulary === 'finance' ? FINANCE_STATUS : WORK_ORDER_STATUS;
  return <Badge tone={map[status] || 'neutral'} {...rest}>{status}</Badge>;
}

/* -------------------------------------------------------------------- CARD */
/* `padded={false}` is the older ui_kits spelling of `flush`. Accepted so the
   demo and existing artboards keep working — and destructured rather than
   spread, so it never leaks onto the DOM node as an attribute. */
function Card({ children, flush = false, padded, className, ...rest }) {
  const isFlush = flush || padded === false;
  return <div className={cx('sv-card', isFlush && 'sv-card--flush', className)} {...rest}>{children}</div>;
}

/* -------------------------------------------------------------------- TABS
   Counts render as parenthesised text, matching the spec. They are not pills.
   Selected and hover look identical by design; aria-selected carries meaning. */
function Tabs({ tabs = [], value, onChange, className }) {
  return (
    <div className={cx('sv-tabs', className)} role="tablist">
      {tabs.map((t) => {
        const key = t.key ?? t.label;
        return (
          <button
            key={key}
            role="tab"
            type="button"
            aria-selected={key === value}
            className="sv-tab"
            onClick={() => onChange?.(key)}
          >
            {t.label}
            {typeof t.count === 'number' && <span className="sv-tab__count">{t.count}</span>}
            {t.dropdown && <Icon name="chevron-down" size={16} className="sv-tab__chev" />}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------- TABLE
   columns: [{ key, label, numeric?, width?, render?(row) }]
   Row hover, selection and sorting are extensions beyond the spec card and
   are opt-in, so a plain table still matches the documented default exactly. */
function Table({ columns = [], rows = [], getRowKey, hover = true, selectable = false,
                 selected = [], onSelect, sort, onSort, empty = 'Nothing to show.', className }) {
  const allSelected = selectable && rows.length > 0 && selected.length === rows.length;
  const keyOf = (row, i) => (getRowKey ? getRowKey(row, i) : (row.id ?? i));

  return (
    <table className={cx('sv-table', hover && 'sv-table--hover', className)}>
      <thead>
        <tr>
          {selectable && (
            <th className="sv-table__check">
              <Checkbox
                checked={allSelected}
                indeterminate={selected.length > 0 && !allSelected}
                onChange={(next) => onSelect?.(next ? rows.map(keyOf) : [])}
              />
            </th>
          )}
          {columns.map((c) => (
            <th key={c.key} className={c.numeric ? 'sv-num' : undefined} style={c.width ? { width: c.width } : undefined}>
              {onSort ? (
                <button
                  type="button"
                  className="sv-table__sort"
                  aria-sort={sort?.key === c.key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}
                  onClick={() => onSort(c.key, sort?.key === c.key && sort.dir === 'asc' ? 'desc' : 'asc')}
                >
                  {c.label}
                  <Icon name={sort?.key === c.key && sort.dir === 'desc' ? 'arrow-down' : 'arrow-up'} size={12} />
                </button>
              ) : c.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td className="sv-table__empty" colSpan={columns.length + (selectable ? 1 : 0)}>{empty}</td>
          </tr>
        ) : rows.map((row, i) => {
          const k = keyOf(row, i);
          const isSel = selectable && selected.includes(k);
          return (
            <tr key={k} aria-selected={isSel || undefined}>
              {selectable && (
                <td className="sv-table__check">
                  <Checkbox
                    checked={isSel}
                    onChange={(next) => onSelect?.(next ? [...selected, k] : selected.filter((x) => x !== k))}
                  />
                </td>
              )}
              {columns.map((c) => (
                <td key={c.key} className={c.numeric ? 'sv-num' : undefined}>
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/* ------------------------------------------------------------------- MODAL
   variant 'default'  — 68px title header, radius 12   (600px wide)
   variant 'confirm'  — icon + title + subtitle, radius 8, no body (460px)
   The scrim is rendered here; the spec card omits it but --sv-scrim exists. */
function Modal({ open = true, title, subtitle, icon, tone = 'warning', variant = 'default',
                 width, onClose, footer, footerSplit = false, children, className }) {
  useSvEffect(() => {
    if (!open || !onClose) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  const isConfirm = variant === 'confirm';
  const w = width || (isConfirm ? 460 : 600);
  const toneVar = tone === 'error' ? 'danger' : tone;

  return (
    <div className="sv-scrim" onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cx('sv-modal', isConfirm && 'sv-modal--confirm', className)}
        style={{ width: w }}
      >
        {isConfirm ? (
          <div className="sv-modal__header sv-modal__header--stacked">
            <div className="sv-modal__toprow">
              <span
                className="sv-modal__icon"
                style={{ background: `var(--sv-${toneVar}-fill)`, color: `var(--sv-${toneVar}-text)` }}
              >
                <Icon name={icon || 'circle-alert'} size={24} />
              </span>
              {onClose && <button type="button" className="sv-modal__close" onClick={onClose} aria-label="Close"><Icon name="x" size={20} /></button>}
            </div>
            <div className="sv-modal__textblock">
              <div className="sv-modal__title">{title}</div>
              {subtitle && <div className="sv-modal__subtitle">{subtitle}</div>}
            </div>
          </div>
        ) : (
          <div className="sv-modal__header">
            <div className="sv-modal__title">{title}</div>
            {onClose && <button type="button" className="sv-modal__close" onClick={onClose} aria-label="Close"><Icon name="x" size={20} /></button>}
          </div>
        )}

        {children && <div className={cx('sv-modal__body', variant === 'form' && 'sv-modal__body--form')}>{children}</div>}

        {footer && (
          <div className={cx('sv-modal__footer', footerSplit && 'sv-modal__footer--split')}>{footer}</div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- MENU
   Compose from MenuRow / MenuSection / MenuSep. `checkable` reserves the 16px
   gutter on every row so labels stay aligned whether or not they are ticked. */
function Menu({ wide = false, children, className, ...rest }) {
  return <div role="menu" className={cx('sv-menu', wide && 'sv-menu--wide', className)} {...rest}>{children}</div>;
}

function MenuRow({ icon, children, badge, kbd, submenu, checked, checkable = false,
                   active = false, danger = false, disabled = false, onClick, className }) {
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      className={cx('sv-menu__row', active && 'is-active', danger && 'is-danger', disabled && 'is-disabled', className)}
    >
      {checkable
        ? (checked ? <Icon name="check" size={16} style={{ color: 'var(--sv-accent)' }} /> : <span className="sv-menu__gutter" />)
        : (icon && <Icon name={icon} size={16} />)}
      <span className="sv-menu__label">{children}</span>
      {badge && <span className="sv-menu__badge">{badge}</span>}
      {kbd && <span className="sv-menu__kbd">{kbd}</span>}
      {submenu && <Icon name="chevron-right" size={16} className="sv-menu__chev" />}
    </button>
  );
}

const MenuSection = ({ children }) => <div className="sv-menu__section">{children}</div>;
const MenuSep = () => <div className="sv-menu__sep" role="separator" />;

/* ----------------------------------------------------------------- TOOLTIP
   placement is where the bubble sits relative to the trigger. The arrow goes
   on the opposite edge — handled here so callers cannot invert it. */
const TT_ARROW = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };

function Tooltip({ label, sub, placement = 'top', children, className }) {
  const arrow = TT_ARROW[placement];
  const rowAxis = placement === 'left' || placement === 'right';
  const bubble = (
    <div className={cx('sv-tt', sub && 'sv-tt--has-sub')}>
      <span className="sv-tt__label">{label}</span>
      {sub && <span className="sv-tt__sub">{sub}</span>}
    </div>
  );
  const arrowEl = <span className="sv-tt__arrow" />;
  // arrow before the bubble when it sits on the bubble's top/left edge
  const first = arrow === 'top' || arrow === 'left';

  return (
    <span className={cx('sv-tt-host', className)}>
      {children}
      <span className={`sv-tt-pop sv-tt-pop--${placement}`} role="tooltip">
        <span className={cx('sv-tt-wrap', rowAxis && 'sv-tt-wrap--row', `sv-tt-wrap--arrow-${arrow}`)}>
          {first ? arrowEl : null}
          {bubble}
          {first ? null : arrowEl}
        </span>
      </span>
    </span>
  );
}

/* --------------------------------------------------------- ALERT / TOAST */
const TONE_ICON = { success: 'circle-check', warning: 'circle-alert', danger: 'circle-x', info: 'info' };

function Alert({ tone = 'info', title, children, icon, onClose, className }) {
  const t = tone === 'error' ? 'danger' : tone;
  return (
    <div role="status" className={cx('sv-alert', `sv-alert--${t}`, className)}>
      <span className="sv-alert__icon"><Icon name={icon || TONE_ICON[t]} size={20} /></span>
      <div className="sv-alert__body">
        {title && <div className="sv-alert__title">{title}</div>}
        {children && <div className="sv-alert__support">{children}</div>}
      </div>
      {onClose && <button type="button" className="sv-alert__close" onClick={onClose} aria-label="Dismiss"><Icon name="x" size={20} /></button>}
    </div>
  );
}

function Toast({ tone = 'info', title, meta, children, icon, actions, compact = false, onClose, className }) {
  const t = tone === 'error' ? 'danger' : tone;
  return (
    <div role="status" className={cx('sv-toast', `sv-toast--${t}`, compact && 'sv-toast--compact', className)}>
      <span className="sv-toast__featured"><Icon name={icon || TONE_ICON[t]} size={20} /></span>
      <div className="sv-toast__body">
        <div className="sv-toast__title">
          {title}
          {meta && <span className="sv-toast__meta">{meta}</span>}
        </div>
        {children && <div className="sv-toast__support">{children}</div>}
        {actions && <div className="sv-toast__actions">{actions}</div>}
      </div>
      {onClose && <button type="button" className="sv-toast__close" onClick={onClose} aria-label="Dismiss"><Icon name="x" size={20} /></button>}
    </div>
  );
}

/* -------------------------------------------------------------- BREADCRUMB
   items: [{ label, href?, onClick? }] — the last item renders as current. */
function Breadcrumbs({ items = [], className }) {
  return (
    <nav aria-label="Breadcrumb" className={cx('sv-crumbs', className)}>
      {items.map((it, i) => {
        const last = i === items.length - 1;
        return (
          <React.Fragment key={it.label}>
            {last
              ? <span className="sv-crumbs__current" aria-current="page">{it.label}</span>
              : <a className="sv-crumbs__link" href={it.href || '#'} onClick={it.onClick}>{it.label}</a>}
            {!last && <span className="sv-crumbs__sep"><Icon name="chevron-right" size={16} /></span>}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

/* ------------------------------------------------------------------- SHELL */
const SV_NAV = [
  { key: 'work-orders', label: 'Work Orders' },
  { key: 'schedule', label: 'Schedule' },
  { key: 'customers', label: 'Customers' },
  { key: 'parts', label: 'Parts' },
  { key: 'reports', label: 'Reports' },
];

function Avatar({ name = '', className }) {
  const initials = name.split(' ').map((x) => x[0]).slice(0, 2).join('').toUpperCase();
  return <span className={cx('sv-avatar', className)}>{initials}</span>;
}

/* Reads every dimension from --sv-header-*. If the bar is the wrong height,
   change the token in colors_and_type.css — not this component. */
function AppHeader({ active = 'work-orders', nav = SV_NAV, user = 'Aaron Keating', onNavigate, onSearch, right, className }) {
  return (
    <header className={cx('sv-header', className)}>
      <span className="sv-header__logo">
        <svg viewBox="0 0 30 30" fill="currentColor" aria-label="Shopview"><circle cx="15" cy="15" r="13" /></svg>
      </span>
      <nav className="sv-header__nav">
        {nav.map((n) => (
          <button key={n.key} type="button" aria-current={n.key === active ? 'page' : undefined} onClick={() => onNavigate?.(n.key)}>
            {n.label}
          </button>
        ))}
      </nav>
      <span className="sv-header__spacer" />
      <button type="button" className="sv-header__search" onClick={onSearch}>
        <Icon name="search" size={20} />
        <span style={{ flex: 1, textAlign: 'left' }}>Search</span>
        <span className="sv-kbd"><span>⌘</span><span>K</span></span>
      </button>
      <span className="sv-header__right">
        {right}
        <Avatar name={user} />
      </span>
    </header>
  );
}

function SidePanel({ title, children, width, className }) {
  return (
    <aside className={cx('sv-side', className)} style={width ? { width } : undefined}>
      {title && <div className="sv-side__title">{title}</div>}
      {children}
    </aside>
  );
}

function StatCard({ label, value, delta, tone = 'info' }) {
  return (
    <Card style={{ padding: 'var(--sv-space-4)' }}>
      <div className="sv-stat__label">{label}</div>
      <div className="sv-stat__value">
        {value}
        {delta && <Badge tone={tone} size="sm">{delta}</Badge>}
      </div>
    </Card>
  );
}

/* The single page skeleton. All three existing screens collapse into this;
   use it instead of hand-rolling a layout, so every screen scrolls, pads and
   aligns the same way. */
function PageShell({ title, actions, breadcrumbs, sidebar, stats, tabs, children,
                     active = 'work-orders', onNavigate, header = true }) {
  return (
    <div className="sv-app">
      {header && <AppHeader active={active} onNavigate={onNavigate} />}
      <div className="sv-main">
        {sidebar && <SidePanel title={sidebar.title}>{sidebar.children}</SidePanel>}
        <div className="sv-content">
          {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
          <div className="sv-page-head">
            <h1>{title}</h1>
            <span className="sv-page-head__spacer" />
            {actions}
          </div>
          {stats && <div className="sv-stats">{stats}</div>}
          {tabs}
          {children}
        </div>
      </div>
    </div>
  );
}

/* Everything published flat (existing artboards use bare globals) and again
   under SV (the documented way to reach the system). */
const SV = {
  Icon, Button, SplitButton, Input, Select, Checkbox, Radio, Toggle,
  Badge, StatusBadge, WORK_ORDER_STATUS, FINANCE_STATUS, STATUS_TONE, statusTone,
  Card, Tabs, Table, Modal, Menu, MenuRow, MenuSection, MenuSep,
  Tooltip, Alert, Toast, Breadcrumbs,
  AppHeader, SidePanel, StatCard, PageShell, Avatar, SV_NAV,
};

Object.assign(window, SV, { SV });
