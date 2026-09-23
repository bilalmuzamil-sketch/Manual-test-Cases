/* Shopview DS — token accessors.
 *
 * Components NEVER write a hex or a colour name. They read from SV_T.
 * Every value here is a `var(--sv-*)` reference into colors_and_type.css,
 * so every component themes for free under [data-theme="dark"].
 *
 * Only Tier-2 semantic tokens are exposed. Raw palette steps (--sv-grey-500,
 * --sv-primary-500, …) are deliberately NOT here: they do not flip in dark mode.
 */

const SV_T = {
  // ── surfaces ──────────────────────────────────────────────────────────
  canvas:        'var(--sv-surface-canvas)',   // page background
  surface:       'var(--sv-surface)',          // cards, inputs, header
  raised:        'var(--sv-surface-raised)',
  overlay:       'var(--sv-surface-overlay)',
  sunken:        'var(--sv-surface-sunken)',   // table head, disabled field
  hover:         'var(--sv-surface-hover)',
  selected:      'var(--sv-surface-selected)',
  navSelected:   'var(--sv-surface-nav-selected)',
  inverse:       'var(--sv-surface-inverse)',  // tooltip bubble
  scrim:         'var(--sv-scrim)',            // modal backdrop

  // ── text ──────────────────────────────────────────────────────────────
  text:          'var(--sv-text-primary)',
  textSecondary: 'var(--sv-text-secondary)',
  textMuted:     'var(--sv-text-muted)',
  textDisabled:  'var(--sv-text-disabled)',
  textInverse:   'var(--sv-text-inverse)',
  textOnAccent:  'var(--sv-text-on-accent)',
  textOnInverse: 'var(--sv-text-on-inverse)',  // NOT interchangeable with textInverse in dark

  // ── borders ───────────────────────────────────────────────────────────
  borderSubtle:  'var(--sv-border-subtle)',    // body row dividers
  border:        'var(--sv-border-default)',   // containers, header rule
  borderStrong:  'var(--sv-border-strong)',    // input + secondary button
  borderFocus:   'var(--sv-border-focus)',

  // ── accent ────────────────────────────────────────────────────────────
  accent:        'var(--sv-accent)',
  accentHover:   'var(--sv-accent-hover)',
  accentActive:  'var(--sv-accent-active)',
  accentText:    'var(--sv-accent-text)',
  accentSubtle:  'var(--sv-accent-subtle)',
  accentSubtleText: 'var(--sv-accent-subtle-text)',
  accentOnSolid: 'var(--sv-accent-on-solid)',

  // ── semantic tones ────────────────────────────────────────────────────
  // NOTE: --sv-error-* and --sv-danger-* are byte-identical aliases in both
  // themes. This layer standardises on `danger`. Do not introduce `error`.
  tone: {
    success: { base: 'var(--sv-success)', fill: 'var(--sv-success-fill)', border: 'var(--sv-success-border)', text: 'var(--sv-success-text)' },
    warning: { base: 'var(--sv-warning)', fill: 'var(--sv-warning-fill)', border: 'var(--sv-warning-border)', text: 'var(--sv-warning-text)' },
    danger:  { base: 'var(--sv-danger)',  fill: 'var(--sv-danger-fill)',  border: 'var(--sv-danger-border)',  text: 'var(--sv-danger-text)' },
    info:    { base: 'var(--sv-info)',    fill: 'var(--sv-info-fill)',    border: 'var(--sv-info-border)',    text: 'var(--sv-info-text)' },
    neutral: { base: 'var(--sv-border-strong)', fill: 'var(--sv-surface-sunken)', border: 'var(--sv-border-strong)', text: 'var(--sv-text-primary)' },
  },

  // ── elevation ─────────────────────────────────────────────────────────
  // --sv-shadow-* do NOT theme. --sv-elev-N-* do. Anything raised uses elev.
  elev: [
    { bg: 'var(--sv-elev-0-bg)', shadow: 'var(--sv-elev-0-shadow)', border: 'var(--sv-elev-0-border)' },
    { bg: 'var(--sv-elev-1-bg)', shadow: 'var(--sv-elev-1-shadow)', border: 'var(--sv-elev-1-border)' },
    { bg: 'var(--sv-elev-2-bg)', shadow: 'var(--sv-elev-2-shadow)', border: 'var(--sv-elev-2-border)' },
    { bg: 'var(--sv-elev-3-bg)', shadow: 'var(--sv-elev-3-shadow)', border: 'var(--sv-elev-3-border)' },
  ],
  focusRing:     'var(--sv-focus-ring)',

  // ── radii ─────────────────────────────────────────────────────────────
  radius: {
    xs: 'var(--sv-radius-xs)',   // 4  — kbd chip, checkbox
    sm: 'var(--sv-radius-sm)',   // 6  — tab pill, small icon button
    md: 'var(--sv-radius-md)',   // 8  — button, input, menu, alert, table
    lg: 'var(--sv-radius-lg)',   // 12 — modal, toast, card
    xl: 'var(--sv-radius-xl)',   // 16
    pill: 'var(--sv-radius-pill)',
  },

  // ── spacing (name is an index; px = index × 4) ─────────────────────────
  space: {
    1: 'var(--sv-space-1)',  2: 'var(--sv-space-2)',  3: 'var(--sv-space-3)',
    4: 'var(--sv-space-4)',  5: 'var(--sv-space-5)',  6: 'var(--sv-space-6)',
    8: 'var(--sv-space-8)', 10: 'var(--sv-space-10)', 12: 'var(--sv-space-12)',
    16: 'var(--sv-space-16)', 20: 'var(--sv-space-20)', 24: 'var(--sv-space-24)',
    32: 'var(--sv-space-32)',
  },

  // ── type ──────────────────────────────────────────────────────────────
  font:        'var(--sv-font-ui)',
  fontDisplay: 'var(--sv-font-display)',
  fontMono:    'var(--sv-font-mono)',

  // Whole type steps, ready to spread: style={{ ...SV_T.type.body }}
  type: {
    h1:      { fontSize: 'var(--sv-h1-size)', lineHeight: 'var(--sv-h1-lh)', fontWeight: 'var(--sv-h1-weight)', letterSpacing: '-0.01em' },
    h2:      { fontSize: 'var(--sv-h2-size)', lineHeight: 'var(--sv-h2-lh)', fontWeight: 'var(--sv-h2-weight)' },
    h3:      { fontSize: 'var(--sv-h3-size)', lineHeight: 'var(--sv-h3-lh)', fontWeight: 'var(--sv-h3-weight)' },
    h4:      { fontSize: 'var(--sv-h4-size)', lineHeight: 'var(--sv-h4-lh)', fontWeight: 'var(--sv-h4-weight)' },
    body:    { fontSize: 'var(--sv-body-size)', lineHeight: 'var(--sv-body-lh)', fontWeight: 'var(--sv-body-weight)' },
    bodyMed: { fontSize: 'var(--sv-body-size)', lineHeight: 'var(--sv-body-lh)', fontWeight: 'var(--sv-body-medium-weight)' },
    bodyBold:{ fontSize: 'var(--sv-body-size)', lineHeight: 'var(--sv-body-lh)', fontWeight: 'var(--sv-body-semibold-weight)' },
    body2:   { fontSize: 'var(--sv-body2-size)', lineHeight: 'var(--sv-body2-lh)', fontWeight: 'var(--sv-body2-weight)', letterSpacing: 'var(--sv-body2-tracking)' },
    caption: { fontSize: 'var(--sv-caption-size)', lineHeight: 'var(--sv-caption-lh)', fontWeight: 'var(--sv-caption-weight)', letterSpacing: 'var(--sv-caption-tracking)' },
  },

  // ── header geometry (read these; never hardcode a header height) ───────
  header: {
    height:        'var(--sv-header-height)',          // 64
    padding:       'var(--sv-header-padding)',         // 12px 20px 12px 28px — asymmetric on purpose
    gap:           'var(--sv-header-gap)',             // 16
    logoSize:      'var(--sv-header-logo-size)',       // 32
    controlHeight: 'var(--sv-header-control-height)',  // 34
    controlRadius: 'var(--sv-header-control-radius)',  // 8
  },
  headerV2: {
    height:        'var(--sv-header-v2-height)',       // 48 — a DIFFERENT component, not a drift
    padding:       'var(--sv-header-v2-padding)',
    gap:           'var(--sv-header-v2-gap)',
    logoSize:      'var(--sv-header-v2-logo-size)',
    controlHeight: 'var(--sv-header-v2-control-height)',
    avatarSize:    'var(--sv-header-v2-avatar-size)',
  },

  // ── motion ────────────────────────────────────────────────────────────
  motion: {
    fast:  '120ms ease-out',
    label: '160ms cubic-bezier(.2,.8,.2,1)',
  },
};

/* Tone name → token triplet, with a safe fallback. Used by Badge, Alert,
 * Toast, StatCard. `error` is accepted as an alias of `danger` so older
 * artboards keep working, but it is not documented. */
function svTone(name) {
  if (name === 'error') return SV_T.tone.danger;
  return SV_T.tone[name] || SV_T.tone.neutral;
}

Object.assign(window, { SV_T, svTone });
