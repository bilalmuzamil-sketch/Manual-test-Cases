// Shopview primitive components
// Depends on: React, ReactDOM (globals from UMD)

const { useState } = React;

// ── Icon (subset of Lucide-style outlined icons as inline SVG) ──
function Icon({ name, size = 18, stroke = 2, style, className }) {
  const paths = {
    plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    search: <><circle cx="11" cy="11" r="7"/><line x1="20" y1="20" x2="16.65" y2="16.65"/></>,
    'chevron-down': <polyline points="6 9 12 15 18 9"/>,
    'chevron-right': <polyline points="9 6 15 12 9 18"/>,
    'arrow-right': <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    'arrow-up': <><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
    user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    wrench: <path d="M14.7 6.3a4 4 0 1 0 5 5L21 13l-7 7-4-4 7-7z M13 11l-8 8a2 2 0 1 0 2.8 2.8l8-8"/>,
    truck: <><rect x="1" y="7" width="13" height="10" rx="1"/><path d="M14 10h4l3 4v3h-7"/><circle cx="5.5" cy="18.5" r="1.5"/><circle cx="17.5" cy="18.5" r="1.5"/></>,
    clipboard: <><rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1"/><line x1="9" y1="10" x2="15" y2="10"/><line x1="9" y1="14" x2="15" y2="14"/></>,
    box: <><path d="M21 8l-9 5-9-5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/></>,
    'file-text': <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></>,
    'more-horizontal': <><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></>,
    filter: <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>,
    check: <polyline points="20 6 9 17 4 12"/>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></>,
    copy: <><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>,
    home: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
    cart: <><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></>,
    store: <><path d="M3 9l1-5h16l1 5"/><path d="M4 9v11a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9"/><path d="M3 9a2.5 2.5 0 0 0 4.5 1.5A2.5 2.5 0 0 0 12 10a2.5 2.5 0 0 0 4.5.5A2.5 2.5 0 0 0 21 9"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/></>,
    tag: <><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></>,
    'help-circle': <><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 4.5 1.5c0 1.5-2 2-2 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    'git-merge': <><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="9" r="3"/><path d="M6 9v6"/><path d="M18 12a9 9 0 0 1-9 9"/></>,
    'external-link': <><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
         style={style} className={className}>
      {paths[name] || null}
    </svg>
  );
}

// ── Button ──
function Button({ variant = 'primary', size = 'md', icon, children, style, ...rest }) {
  const sizes = {
    sm: { h: 32, px: 12, fs: 13 },
    md: { h: 40, px: 16, fs: 14 },
    lg: { h: 48, px: 20, fs: 15 },
  }[size];
  const variants = {
    primary:    { bg: '#257CFF', color: '#fff', border: 'transparent' },
    secondary:  { bg: '#fff', color: '#364152', border: '#CDD5DF' },
    tertiary:   { bg: 'transparent', color: '#257CFF', border: 'transparent' },
    destructive:{ bg: '#EF4444', color: '#fff', border: 'transparent' },
    ghost:      { bg: 'transparent', color: '#364152', border: 'transparent' },
  }[variant];
  return (
    <button {...rest} style={{
      height: sizes.h, padding: `0 ${sizes.px}px`, fontSize: sizes.fs, fontWeight: 600,
      background: variants.bg, color: variants.color, border: `1px solid ${variants.border}`,
      borderRadius: 8, display: 'inline-flex', alignItems: 'center', gap: 6,
      cursor: 'pointer', fontFamily: 'inherit',
      boxShadow: variant === 'secondary' ? '0 1px 2px rgba(16,24,40,0.05)' : 'none',
      transition: 'background 120ms ease-out, border-color 120ms ease-out',
      ...style,
    }}>
      {icon && <Icon name={icon} size={16} />}
      {children}
    </button>
  );
}

// ── Badge ──
function Badge({ tone = 'neutral', children, style }) {
  const tones = {
    success: { bg: '#ABF5C4', fg: '#108737' },
    warning: { bg: '#FFF5E0', fg: '#B47A00' },
    error:   { bg: '#FCA397', fg: '#B52020' },
    info:    { bg: '#E5EDFF', fg: '#0868A7' },
    neutral: { bg: '#EEF2F6', fg: '#364152' },
    teal:    { bg: '#CCFBF1', fg: '#0F766E' },
    violet:  { bg: '#EDE9FE', fg: '#6D28D9' },
  }[tone];
  return (
    <span style={{
      padding: '2px 10px', borderRadius: 9999, fontSize: 12, fontWeight: 600,
      lineHeight: '18px', background: tones.bg, color: tones.fg, display: 'inline-flex',
      alignItems: 'center', gap: 4, ...style,
    }}>{children}</span>
  );
}

// Map work-order statuses to badge tones
function statusTone(s) {
  return ({
    'Paid': 'success', 'Authorized': 'success', 'Completed': 'success', 'Approved': 'success',
    'Partially Paid': 'warning', 'Awaiting': 'warning', 'Requested': 'warning', 'Authorization Required': 'warning',
    'Unpaid': 'error', 'Overdue': 'error',
    'In Progress': 'info', 'Scheduled': 'info',
    'Draft': 'neutral',
  })[s] || 'neutral';
}

// ── Input ──
function Input({ label, hint, error, icon, style, ...rest }) {
  const [focused, setFocused] = useState(false);
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && <span style={{ fontSize: 12, fontWeight: 500, color: '#697586' }}>{label}</span>}
      <div style={{
        height: 40, borderRadius: 8, background: '#fff', display: 'flex', alignItems: 'center',
        padding: '0 12px', gap: 8,
        border: error ? '1px solid #EF4444' : (focused ? '2px solid #257CFF' : '1px solid #CDD5DF'),
        boxShadow: focused && !error ? '0 0 0 4px rgba(37,124,255,0.24)' : 'none',
        ...style,
      }}>
        {icon && <Icon name={icon} size={16} style={{ color: '#697586' }} />}
        <input {...rest} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ border: 0, outline: 0, flex: 1, fontSize: 14, fontFamily: 'inherit', color: '#202939', background: 'transparent' }} />
      </div>
      {(hint || error) && <span style={{ fontSize: 12, color: error ? '#B52020' : '#697586' }}>{error || hint}</span>}
    </label>
  );
}

// ── Card ──
function Card({ children, style, padded = true }) {
  return <div style={{
    background: '#fff', border: '1px solid #E3E8EF', borderRadius: 12,
    padding: padded ? 20 : 0, boxShadow: '0 1px 2px rgba(16,24,40,0.05)', ...style,
  }}>{children}</div>;
}

// ── Tabs ──
function Tabs({ tabs, value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid #E3E8EF' }}>
      {tabs.map(t => {
        const active = t.key === value;
        return (
          <button key={t.key} onClick={() => onChange?.(t.key)} style={{
            padding: '10px 14px', fontSize: 14, fontWeight: active ? 600 : 500,
            color: active ? '#257CFF' : '#697586',
            borderBottom: `2px solid ${active ? '#257CFF' : 'transparent'}`,
            marginBottom: -1, background: 'transparent', border: 'none', borderRadius: 0,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>
            {t.label}{typeof t.count === 'number' && <span style={{ opacity: 0.7, marginLeft: 4 }}>({t.count})</span>}
          </button>
        );
      })}
    </div>
  );
}

// ── Avatar ──
function Avatar({ name = '', size = 32, color }) {
  const initials = name.split(' ').map(x => x[0]).slice(0, 2).join('').toUpperCase();
  return <div style={{
    width: size, height: size, borderRadius: '50%', background: color || '#E5EDFF',
    color: color ? '#fff' : '#0868A7', fontWeight: 600, fontSize: size * 0.38,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none',
  }}>{initials}</div>;
}

// ── Toggle ──
function Toggle({ on, onChange }) {
  return (
    <button onClick={() => onChange?.(!on)} style={{
      width: 36, height: 20, borderRadius: 9999, border: 0, padding: 2,
      background: on ? '#257CFF' : '#CDD5DF', cursor: 'pointer',
      display: 'inline-flex', justifyContent: on ? 'flex-end' : 'flex-start', transition: 'background 120ms',
    }}>
      <span style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff' }} />
    </button>
  );
}

// ── Checkbox ──
function Checkbox({ checked, onChange, label }) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#364152', cursor: 'pointer' }}>
      <span onClick={() => onChange?.(!checked)} style={{
        width: 18, height: 18, borderRadius: 4,
        border: `1px solid ${checked ? '#257CFF' : '#CDD5DF'}`,
        background: checked ? '#257CFF' : '#fff',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none',
      }}>
        {checked && <Icon name="check" size={12} style={{ color: '#fff' }} stroke={3} />}
      </span>
      {label}
    </label>
  );
}

Object.assign(window, { Icon, Button, Badge, statusTone, Input, Card, Tabs, Avatar, Toggle, Checkbox });
