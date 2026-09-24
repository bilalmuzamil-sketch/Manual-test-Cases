/* @ds-bundle: {"format":4,"namespace":"ShopviewDesignSystem_fac6ef","components":[],"sourceHashes":{"ai-agent-icon.js":"45ee6b3b8619","assets/design-canvas.jsx":"862a6db59c7c","cards.jsx":"ce2b78c039f5","design-canvas.jsx":"862a6db59c7c","design-md/filter-bar.jsx":"e8b45d1d5bd3","design-md/filter-chip.jsx":"c7d8e44114bb","design-md/filter-dropdown.jsx":"67375d05119b","design-md/mobile-filters.jsx":"56f95e2b6334","design-md/tweaks-panel.jsx":"57fac7f3caf9","design-md/variation-a.jsx":"1b5e282bb121","design-md/variation-b.jsx":"be688489f8d3","filter-bar.jsx":"c0268b1b70b8","filter-chip.jsx":"629a3f4cae78","filter-dropdown.jsx":"2e107e11891c","mobile-filters.jsx":"56f95e2b6334","theme-toggle.js":"d783a00d8146","tweaks-panel.jsx":"a1107c630a56","ui_kits/shopview-app/app.jsx":"a73526bc73f1","ui_kits/shopview-app/chrome.jsx":"16bb4e110cd3","ui_kits/shopview-app/components.jsx":"bdc2d9b7af40","ui_kits/shopview-app/data.js":"d1fe487bf14a","ui_kits/shopview-app/screens.jsx":"a5e277be169a","variation-a.jsx":"e350f2244b83"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.ShopviewDesignSystem_fac6ef = window.ShopviewDesignSystem_fac6ef || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// ai-agent-icon.js
try { (() => {
/**
 * <ai-agent-icon> — Animated AI agent gear-cog icon
 * ShopView Design System
 *
 * Attributes:
 *   size    — display size in px (default: 24)
 *   color   — stroke/fill color (default: currentColor)
 *   state   — "idle" | "thinking" (default: "idle")
 *
 * Usage:
 *   <script src="ai-agent-icon.js"></script>
 *   <ai-agent-icon size="24"></ai-agent-icon>
 *   <ai-agent-icon size="32" state="thinking" color="#fff"></ai-agent-icon>
 */

class AiAgentIcon extends HTMLElement {
  static get observedAttributes() {
    return ['size', 'color', 'state'];
  }
  constructor() {
    super();
    this._root = this.attachShadow({
      mode: 'open'
    });
    this._blinkTimer = null;
    this._spinBusy = false;
  }
  connectedCallback() {
    this._render();
  }
  disconnectedCallback() {
    clearTimeout(this._blinkTimer);
  }
  attributeChangedCallback() {
    if (this.isConnected) this._render();
  }
  get _size() {
    return parseFloat(this.getAttribute('size') ?? '24');
  }
  get _color() {
    return this.getAttribute('color') ?? 'currentColor';
  }
  get _state() {
    return this.getAttribute('state') ?? 'idle';
  }

  // ── Gear path ────────────────────────────────────────────────────────────
  // Cubic beziers with tangent-matched control points → G1-continuous joins.
  _buildGear() {
    const cx = 12,
      cy = 12,
      Ro = 11.1,
      Ri = 8.9,
      n = 8;
    const step = Math.PI * 2 / n;
    const th = step * 0.13; // half-angle of tooth tip
    const sl = step * 0.20; // slope width (higher = gentler transition)
    const k = 0.52; // bezier tension

    const fmt = (r, a) => `${(cx + r * Math.cos(a)).toFixed(3)} ${(cy + r * Math.sin(a)).toFixed(3)}`;
    const cp = (r, a, dist, dir) => {
      const x = cx + r * Math.cos(a) + dir * dist * -Math.sin(a);
      const y = cy + r * Math.sin(a) + dir * dist * Math.cos(a);
      return `${x.toFixed(3)} ${y.toFixed(3)}`;
    };
    let d = '';
    for (let i = 0; i < n; i++) {
      const m = i * step - Math.PI / 2;
      const aVL = m - th - sl;
      const aTL = m - th;
      const aTR = m + th;
      const aVR = m + th + sl;
      const aVLn = (i + 1) * step - Math.PI / 2 - th - sl;
      const di = Ri * sl * k;
      const do_ = Ro * sl * k;
      if (i === 0) d += `M${fmt(Ri, aVL)}`;
      d += ` C${cp(Ri, aVL, di, +1)} ${cp(Ro, aTL, do_, -1)} ${fmt(Ro, aTL)}`;
      d += ` A${Ro} ${Ro} 0 0 1 ${fmt(Ro, aTR)}`;
      d += ` C${cp(Ro, aTR, do_, +1)} ${cp(Ri, aVR, di, -1)} ${fmt(Ri, aVR)}`;
      d += ` A${Ri} ${Ri} 0 0 1 ${fmt(Ri, aVLn)}`;
    }
    return d + ' Z';
  }

  // ── Render ───────────────────────────────────────────────────────────────
  _render() {
    clearTimeout(this._blinkTimer);
    this._spinBusy = false;
    const size = this._size;
    const color = this._color;
    const thinking = this._state === 'thinking';
    const gearD = this._buildGear();
    this._root.innerHTML = `
      <style>
        :host {
          display: inline-block;
          line-height: 0;
          cursor: pointer;
        }

        svg { display: block; overflow: visible; }

        /* Gear */
        .gear {
          transform-box: fill-box;
          transform-origin: 50% 50%;
        }
        .gear.thinking {
          animation: spin-loop 3.6s linear infinite;
        }

        /* Eyes */
        .eye-dot {
          transform-box: fill-box;
          transform-origin: 50% 50%;
          animation: look 6s ease-in-out infinite;
        }
        .eye-dot.thinking {
          animation: pulse 1.1s ease-in-out infinite;
        }
        .eye-l {
          transform-box: fill-box;
          transform-origin: 50% 50%;
        }
        .eye-l.blink {
          animation: blink .22s ease-in-out forwards;
        }

        /* Keyframes */
        @keyframes spin-once {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes spin-loop {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes look {
          0%,  10%  { transform: translateX(0px); }
          22%, 42%  { transform: translateX(-.65px); }
          52%, 72%  { transform: translateX(.65px); }
          82%, 100% { transform: translateX(0px); }
        }
        @keyframes pulse {
          0%,100% { transform: scale(1);   opacity: 1; }
          50%     { transform: scale(.54); opacity: .45; }
        }
        @keyframes blink {
          0%   { transform: scaleY(1); }
          38%  { transform: scaleY(.06); }
          100% { transform: scaleY(1); }
        }
      </style>

      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none"
           style="color:${color}">
        <g class="gear${thinking ? ' thinking' : ''}">
          <path d="${gearD}" stroke="currentColor" stroke-width="2"
                stroke-linejoin="round" stroke-linecap="round" fill="none"/>
        </g>
        <g class="eye-l">
          <circle cx="8.8" cy="12" r="1.3" fill="currentColor"
                  class="eye-dot${thinking ? ' thinking' : ''}"/>
        </g>
        <circle cx="15.2" cy="12" r="1.3" fill="currentColor"
                class="eye-dot${thinking ? ' thinking' : ''}"/>
      </svg>`;
    if (!thinking) {
      this._initHover();
      this._scheduleBlink();
    }
  }

  // ── Hover spin ───────────────────────────────────────────────────────────
  _initHover() {
    const svg = this._root.querySelector('svg');
    const gear = this._root.querySelector('.gear');
    svg.addEventListener('mouseenter', () => {
      if (this._spinBusy || this._state === 'thinking') return;
      this._spinBusy = true;
      gear.style.animation = 'none';
      gear.getBoundingClientRect(); // force reflow
      gear.style.animation = 'spin-once 1.05s cubic-bezier(0,0,.18,1) forwards';
      gear.addEventListener('animationend', () => {
        gear.style.animation = '';
        this._spinBusy = false;
      }, {
        once: true
      });
    });
  }

  // ── Blink scheduler ──────────────────────────────────────────────────────
  _scheduleBlink() {
    this._blinkTimer = setTimeout(() => {
      if (this._state === 'thinking') return;
      const eyeL = this._root.querySelector('.eye-l');
      if (eyeL) {
        eyeL.classList.remove('blink');
        eyeL.getBoundingClientRect();
        eyeL.classList.add('blink');
        eyeL.addEventListener('animationend', () => eyeL.classList.remove('blink'), {
          once: true
        });
      }
      this._scheduleBlink();
    }, 2000 + Math.random() * 5000);
  }
}
customElements.define('ai-agent-icon', AiAgentIcon);
})(); } catch (e) { __ds_ns.__errors.push({ path: "ai-agent-icon.js", error: String((e && e.message) || e) }); }

// assets/design-canvas.jsx
try { (() => {
// DesignCanvas.jsx — Figma-ish design canvas wrapper
// Warm gray grid bg + Sections + Artboards + PostIt notes.
// Artboards are reorderable (grip-drag), deletable, labels/titles are
// inline-editable, and any artboard can be opened in a fullscreen focus
// overlay (←/→/Esc). State persists to a .design-canvas.state.json sidecar
// via the host bridge. No assets, no deps.
//
// Usage:
//   <DesignCanvas>
//     <DCSection id="onboarding" title="Onboarding" subtitle="First-run variants">
//       <DCArtboard id="a" label="A · Dusk" width={260} height={480}>…</DCArtboard>
//       <DCArtboard id="b" label="B · Minimal" width={260} height={480}>…</DCArtboard>
//     </DCSection>
//   </DesignCanvas>

const DC = {
  bg: '#f0eee9',
  grid: 'rgba(0,0,0,0.06)',
  label: 'rgba(60,50,40,0.7)',
  title: 'rgba(40,30,20,0.85)',
  subtitle: 'rgba(60,50,40,0.6)',
  postitBg: '#fef4a8',
  postitText: '#5a4a2a',
  font: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
};

// One-time CSS injection (classes are dc-prefixed so they don't collide with
// the hosted design's own styles).
if (typeof document !== 'undefined' && !document.getElementById('dc-styles')) {
  const s = document.createElement('style');
  s.id = 'dc-styles';
  s.textContent = ['.dc-editable{cursor:text;outline:none;white-space:nowrap;border-radius:3px;padding:0 2px;margin:0 -2px}', '.dc-editable:focus{background:#fff;box-shadow:0 0 0 1.5px #c96442}', '[data-dc-slot]{transition:transform .18s cubic-bezier(.2,.7,.3,1)}', '[data-dc-slot].dc-dragging{transition:none;z-index:10;pointer-events:none}', '[data-dc-slot].dc-dragging .dc-card{box-shadow:0 12px 40px rgba(0,0,0,.25),0 0 0 2px #c96442;transform:scale(1.02)}',
  // isolation:isolate contains artboard content's z-indexes so a
  // z-indexed child (sticky navbar etc.) can't paint over .dc-header or
  // the .dc-menu popover that drops into the top of the card.
  '.dc-card{isolation:isolate;transition:box-shadow .15s,transform .15s}', '.dc-card *{scrollbar-width:none}', '.dc-card *::-webkit-scrollbar{display:none}',
  // Per-artboard header: grip + label on the left, delete/expand on the
  // right. Single flex row; when the artboard's on-screen width is too
  // narrow for both the label yields (ellipsis, then hidden entirely below
  // ~4ch via the container query) and the buttons stay on the row.
  '.dc-header{position:absolute;bottom:100%;left:-4px;margin-bottom:calc(4px * var(--dc-inv-zoom,1));z-index:2;', '  display:flex;align-items:center;container-type:inline-size}', '.dc-labelrow{display:flex;align-items:center;gap:4px;height:24px;flex:1 1 auto;min-width:0}', '.dc-grip{flex:0 0 auto;cursor:grab;display:flex;align-items:center;padding:5px 4px;border-radius:4px;transition:background .12s,opacity .12s}', '.dc-grip:hover{background:rgba(0,0,0,.08)}', '.dc-grip:active{cursor:grabbing}', '.dc-labeltext{flex:1 1 auto;min-width:0;cursor:pointer;border-radius:4px;padding:3px 6px;', '  display:flex;align-items:center;transition:background .12s;overflow:hidden}',
  // Below ~4ch of label room: hide the label entirely, and drop the grip to
  // hover-only (same reveal rule as .dc-btns) so a narrow header is clean
  // until the card is moused.
  '@container (max-width: 110px){', '  .dc-labeltext{display:none}', '  .dc-grip{opacity:0}', '  [data-dc-slot]:hover .dc-grip{opacity:1}', '}', '.dc-labeltext:hover{background:rgba(0,0,0,.05)}', '.dc-labeltext .dc-editable{overflow:hidden;text-overflow:ellipsis;max-width:100%}', '.dc-labeltext .dc-editable:focus{overflow:visible;text-overflow:clip}', '.dc-btns{flex:0 0 auto;margin-left:auto;display:flex;gap:2px;opacity:0;transition:opacity .12s}', '[data-dc-slot]:hover .dc-btns,.dc-btns:has(.dc-menu){opacity:1}', '.dc-expand,.dc-kebab{width:22px;height:22px;border-radius:5px;border:none;cursor:pointer;padding:0;', '  background:transparent;color:rgba(60,50,40,.7);display:flex;align-items:center;justify-content:center;', '  font:inherit;transition:background .12s,color .12s}', '.dc-expand:hover,.dc-kebab:hover{background:rgba(0,0,0,.06);color:#2a251f}',
  // Slot hosting an open menu floats above later siblings (which otherwise
  // paint on top — same z-index:auto, later DOM order) so the popup isn't
  // clipped by the next card.
  '[data-dc-slot]:has(.dc-menu){z-index:10}', '.dc-menu{position:absolute;top:100%;right:0;margin-top:4px;background:#fff;border-radius:8px;', '  box-shadow:0 8px 28px rgba(0,0,0,.18),0 0 0 1px rgba(0,0,0,.05);padding:4px;min-width:160px;z-index:10}', '.dc-menu button{display:block;width:100%;padding:7px 10px;border:0;background:transparent;', '  border-radius:5px;font-family:inherit;font-size:13px;font-weight:500;line-height:1.2;', '  color:#29261b;cursor:pointer;text-align:left;transition:background .12s;white-space:nowrap}', '.dc-menu button:hover{background:rgba(0,0,0,.05)}', '.dc-menu hr{border:0;border-top:1px solid rgba(0,0,0,.08);margin:4px 2px}', '.dc-menu .dc-danger{color:#c96442}', '.dc-menu .dc-danger:hover{background:rgba(201,100,66,.1)}',
  // Chrome (titles / labels / buttons) counter-scales against the viewport
  // zoom so it stays a constant on-screen size. --dc-inv-zoom is set by
  // DCViewport on every transform update and inherits to all descendants —
  // any overlay inside the world (e.g. a TweaksPanel on an artboard) can use
  // it the same way.
  //
  // The header uses transform:scale (out-of-flow, so layout impact doesn't
  // matter) with its world-space width set to card-width / inv-zoom so that
  // after counter-scaling its on-screen width exactly matches the card's —
  // that's what lets the container query + text-overflow behave against the
  // card's visible edge at every zoom level.
  //
  // The section head uses CSS zoom instead of transform so its layout box
  // grows with the counter-scale, pushing the card row down — otherwise the
  // constant-screen-size title would overflow into the (shrinking) world-
  // space gap and overlap the artboard headers at low zoom.
  '.dc-header{width:calc((100% + 4px) / var(--dc-inv-zoom,1));', '  transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom left}', '.dc-sectionhead{zoom:var(--dc-inv-zoom,1)}'].join('\n');
  document.head.appendChild(s);
}
const DCCtx = React.createContext(null);

// ─────────────────────────────────────────────────────────────
// DesignCanvas — stateful wrapper around the pan/zoom viewport.
// Owns runtime state (per-section order, renamed titles/labels, hidden
// artboards, focused artboard). Order/titles/labels/hidden persist to a
// .design-canvas.state.json
// sidecar next to the HTML. Reads go via plain fetch() so the saved
// arrangement is visible anywhere the HTML + sidecar are served together
// (omelette preview, direct link, downloaded zip). Writes go through the
// host's window.omelette bridge — editing requires the omelette runtime.
// Focus is ephemeral.
// ─────────────────────────────────────────────────────────────
const DC_STATE_FILE = '.design-canvas.state.json';
function DesignCanvas({
  children,
  minScale,
  maxScale,
  style
}) {
  const [state, setState] = React.useState({
    sections: {},
    focus: null
  });
  // Hold rendering until the sidecar read settles so the saved order/titles
  // appear on first paint (no source-order flash). didRead gates writes until
  // the read settles so the empty initial state can't clobber a slow read;
  // skipNextWrite suppresses the one echo-write that would otherwise follow
  // hydration.
  const [ready, setReady] = React.useState(false);
  const didRead = React.useRef(false);
  const skipNextWrite = React.useRef(false);
  React.useEffect(() => {
    let off = false;
    fetch('./' + DC_STATE_FILE).then(r => r.ok ? r.json() : null).then(saved => {
      if (off || !saved || !saved.sections) return;
      skipNextWrite.current = true;
      setState(s => ({
        ...s,
        sections: saved.sections
      }));
    }).catch(() => {}).finally(() => {
      didRead.current = true;
      if (!off) setReady(true);
    });
    const t = setTimeout(() => {
      if (!off) setReady(true);
    }, 150);
    return () => {
      off = true;
      clearTimeout(t);
    };
  }, []);
  React.useEffect(() => {
    if (!didRead.current) return;
    if (skipNextWrite.current) {
      skipNextWrite.current = false;
      return;
    }
    const t = setTimeout(() => {
      window.omelette?.writeFile(DC_STATE_FILE, JSON.stringify({
        sections: state.sections
      })).catch(() => {});
    }, 250);
    return () => clearTimeout(t);
  }, [state.sections]);

  // Build registries synchronously from children so FocusOverlay can read
  // them in the same render. Only direct DCSection > DCArtboard children are
  // walked — wrapping them in other elements opts out of focus/reorder.
  const registry = {}; // slotId -> { sectionId, artboard }
  const sectionMeta = {}; // sectionId -> { title, subtitle, slotIds[] }
  const sectionOrder = [];
  React.Children.forEach(children, sec => {
    if (!sec || sec.type !== DCSection) return;
    const sid = sec.props.id ?? sec.props.title;
    if (!sid) return;
    sectionOrder.push(sid);
    const persisted = state.sections[sid] || {};
    const abs = [];
    React.Children.forEach(sec.props.children, ab => {
      if (!ab || ab.type !== DCArtboard) return;
      const aid = ab.props.id ?? ab.props.label;
      if (aid) abs.push([aid, ab]);
    });
    // hidden is scoped to one source revision — when the agent regenerates
    // (artboard-ID set changes), prior deletes don't apply to new content.
    const srcKey = abs.map(([k]) => k).join('\x1f');
    const hidden = persisted.srcKey === srcKey ? persisted.hidden || [] : [];
    const srcIds = [];
    abs.forEach(([aid, ab]) => {
      if (hidden.includes(aid)) return;
      registry[`${sid}/${aid}`] = {
        sectionId: sid,
        artboard: ab
      };
      srcIds.push(aid);
    });
    const kept = (persisted.order || []).filter(k => srcIds.includes(k));
    sectionMeta[sid] = {
      title: persisted.title ?? sec.props.title,
      subtitle: sec.props.subtitle,
      slotIds: [...kept, ...srcIds.filter(k => !kept.includes(k))]
    };
  });
  const api = React.useMemo(() => ({
    state,
    section: id => state.sections[id] || {},
    patchSection: (id, p) => setState(s => ({
      ...s,
      sections: {
        ...s.sections,
        [id]: {
          ...s.sections[id],
          ...(typeof p === 'function' ? p(s.sections[id] || {}) : p)
        }
      }
    })),
    setFocus: slotId => setState(s => ({
      ...s,
      focus: slotId
    }))
  }), [state]);

  // Esc exits focus; any outside pointerdown commits an in-progress rename.
  React.useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') api.setFocus(null);
    };
    const onPd = e => {
      const ae = document.activeElement;
      if (ae && ae.isContentEditable && !ae.contains(e.target)) ae.blur();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPd, true);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPd, true);
    };
  }, [api]);
  return /*#__PURE__*/React.createElement(DCCtx.Provider, {
    value: api
  }, /*#__PURE__*/React.createElement(DCViewport, {
    minScale: minScale,
    maxScale: maxScale,
    style: style
  }, ready && children), state.focus && registry[state.focus] && /*#__PURE__*/React.createElement(DCFocusOverlay, {
    entry: registry[state.focus],
    sectionMeta: sectionMeta,
    sectionOrder: sectionOrder
  }));
}

// ─────────────────────────────────────────────────────────────
// DCViewport — transform-based pan/zoom (internal)
//
// Input mapping (Figma-style):
//   • trackpad pinch  → zoom   (ctrlKey wheel; Safari gesture* events)
//   • trackpad scroll → pan    (two-finger)
//   • mouse wheel     → zoom   (notched; distinguished from trackpad scroll)
//   • middle-drag / primary-drag-on-bg → pan
//
// Transform state lives in a ref and is written straight to the DOM
// (translate3d + will-change) so wheel ticks don't go through React —
// keeps pans at 60fps on dense canvases.
// ─────────────────────────────────────────────────────────────
function DCViewport({
  children,
  minScale = 0.1,
  maxScale = 8,
  style = {}
}) {
  const vpRef = React.useRef(null);
  const worldRef = React.useRef(null);
  const tf = React.useRef({
    x: 0,
    y: 0,
    scale: 1
  });
  // Persist viewport across reloads so the user lands back where they were
  // after an agent edit or browser refresh. The sandbox origin is already
  // per-project; pathname keeps multiple canvas files in one project apart.
  const tfKey = 'dc-viewport:' + location.pathname;
  const saveT = React.useRef(0);
  const lastPostedScale = React.useRef();
  const apply = React.useCallback(() => {
    const {
      x,
      y,
      scale
    } = tf.current;
    const el = worldRef.current;
    if (!el) return;
    el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    // Exposed for zoom-invariant chrome (labels, buttons, TweaksPanel).
    el.style.setProperty('--dc-inv-zoom', String(1 / scale));
    // Keep the host toolbar's % readout in sync with the canvas scale. Pan
    // ticks leave scale unchanged — skip the cross-frame post for those.
    if (lastPostedScale.current !== scale) {
      lastPostedScale.current = scale;
      window.parent.postMessage({
        type: '__dc_zoom',
        scale
      }, '*');
    }
    clearTimeout(saveT.current);
    saveT.current = setTimeout(() => {
      try {
        localStorage.setItem(tfKey, JSON.stringify(tf.current));
      } catch {}
    }, 200);
  }, [tfKey]);
  React.useLayoutEffect(() => {
    const flush = () => {
      clearTimeout(saveT.current);
      try {
        localStorage.setItem(tfKey, JSON.stringify(tf.current));
      } catch {}
    };
    try {
      const s = JSON.parse(localStorage.getItem(tfKey) || 'null');
      if (s && Number.isFinite(s.x) && Number.isFinite(s.y) && Number.isFinite(s.scale)) {
        tf.current = {
          x: s.x,
          y: s.y,
          scale: Math.min(maxScale, Math.max(minScale, s.scale))
        };
        apply();
      }
    } catch {}
    // Flush on pagehide and unmount so a reload within the 200ms debounce
    // window doesn't drop the last pan/zoom.
    window.addEventListener('pagehide', flush);
    return () => {
      window.removeEventListener('pagehide', flush);
      flush();
    };
  }, []);
  React.useEffect(() => {
    const vp = vpRef.current;
    if (!vp) return;
    const zoomAt = (cx, cy, factor) => {
      const r = vp.getBoundingClientRect();
      const px = cx - r.left,
        py = cy - r.top;
      const t = tf.current;
      const next = Math.min(maxScale, Math.max(minScale, t.scale * factor));
      const k = next / t.scale;
      // keep the world point under the cursor fixed
      t.x = px - (px - t.x) * k;
      t.y = py - (py - t.y) * k;
      t.scale = next;
      apply();
    };

    // Mouse-wheel vs trackpad-scroll heuristic. A physical wheel sends
    // line-mode deltas (Firefox) or large integer pixel deltas with no X
    // component (Chrome/Safari, typically multiples of 100/120). Trackpad
    // two-finger scroll sends small/fractional pixel deltas, often with
    // non-zero deltaX. ctrlKey is set by the browser for trackpad pinch.
    const isMouseWheel = e => e.deltaMode !== 0 || e.deltaX === 0 && Number.isInteger(e.deltaY) && Math.abs(e.deltaY) >= 40;
    const onWheel = e => {
      e.preventDefault();
      if (isGesturing) return; // Safari: gesture* owns the pinch — discard concurrent wheels
      if ((e.ctrlKey || e.metaKey) && !isMouseWheel(e)) {
        // trackpad pinch, or ctrl/cmd + smooth-scroll mouse. Notched
        // wheels fall through to the fixed-step branch below.
        zoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * 0.01));
      } else if (isMouseWheel(e)) {
        // notched mouse wheel — fixed-ratio step per click
        zoomAt(e.clientX, e.clientY, Math.exp(-Math.sign(e.deltaY) * 0.18));
      } else {
        // trackpad two-finger scroll — pan
        tf.current.x -= e.deltaX;
        tf.current.y -= e.deltaY;
        apply();
      }
    };

    // Safari sends native gesture* events for trackpad pinch with a smooth
    // e.scale; preferring these over the ctrl+wheel fallback gives a much
    // better feel there. No-ops on other browsers. Safari also fires
    // ctrlKey wheel events during the same pinch — isGesturing makes
    // onWheel drop those entirely so they neither zoom nor pan.
    let gsBase = 1;
    let isGesturing = false;
    const onGestureStart = e => {
      e.preventDefault();
      isGesturing = true;
      gsBase = tf.current.scale;
    };
    const onGestureChange = e => {
      e.preventDefault();
      zoomAt(e.clientX, e.clientY, gsBase * e.scale / tf.current.scale);
    };
    const onGestureEnd = e => {
      e.preventDefault();
      isGesturing = false;
    };

    // Drag-pan: middle button anywhere, or primary button on canvas
    // background (anything that isn't an artboard or an inline editor).
    let drag = null;
    const onPointerDown = e => {
      const onBg = !e.target.closest('[data-dc-slot], .dc-editable');
      if (!(e.button === 1 || e.button === 0 && onBg)) return;
      e.preventDefault();
      vp.setPointerCapture(e.pointerId);
      drag = {
        id: e.pointerId,
        lx: e.clientX,
        ly: e.clientY
      };
      vp.style.cursor = 'grabbing';
    };
    const onPointerMove = e => {
      if (!drag || e.pointerId !== drag.id) return;
      tf.current.x += e.clientX - drag.lx;
      tf.current.y += e.clientY - drag.ly;
      drag.lx = e.clientX;
      drag.ly = e.clientY;
      apply();
    };
    const onPointerUp = e => {
      if (!drag || e.pointerId !== drag.id) return;
      vp.releasePointerCapture(e.pointerId);
      drag = null;
      vp.style.cursor = '';
    };

    // Host-driven zoom (toolbar % menu). Zooms around viewport centre so the
    // visible midpoint stays fixed — matching the host's iframe-zoom feel.
    const onHostMsg = e => {
      const d = e.data;
      if (d && d.type === '__dc_set_zoom' && typeof d.scale === 'number') {
        const r = vp.getBoundingClientRect();
        zoomAt(r.left + r.width / 2, r.top + r.height / 2, d.scale / tf.current.scale);
      } else if (d && d.type === '__dc_probe') {
        // Host's [readyGen] reset asks whether a canvas is present; it
        // fires on the iframe's native 'load', which for canvases with
        // images/fonts is after our mount-time announce, so re-announce.
        // Clear the pan-tick guard so apply() re-posts the current scale
        // even if it's unchanged — the host just reset dcScale to 1.
        window.parent.postMessage({
          type: '__dc_present'
        }, '*');
        lastPostedScale.current = undefined;
        apply();
      }
    };
    window.addEventListener('message', onHostMsg);
    // Announce canvas mode so the host toolbar proxies its % control here
    // instead of scaling the iframe element (which would just shrink the
    // viewport window of an infinite canvas). The apply() that follows emits
    // the initial __dc_zoom so the toolbar % is correct before first pinch.
    // lastPostedScale reset mirrors the __dc_probe handler: the layout
    // effect's restore-path apply() may already have posted the restored
    // scale (before __dc_present), so clear the guard to re-post it in order.
    window.parent.postMessage({
      type: '__dc_present'
    }, '*');
    lastPostedScale.current = undefined;
    apply();
    vp.addEventListener('wheel', onWheel, {
      passive: false
    });
    vp.addEventListener('gesturestart', onGestureStart, {
      passive: false
    });
    vp.addEventListener('gesturechange', onGestureChange, {
      passive: false
    });
    vp.addEventListener('gestureend', onGestureEnd, {
      passive: false
    });
    vp.addEventListener('pointerdown', onPointerDown);
    vp.addEventListener('pointermove', onPointerMove);
    vp.addEventListener('pointerup', onPointerUp);
    vp.addEventListener('pointercancel', onPointerUp);
    return () => {
      window.removeEventListener('message', onHostMsg);
      vp.removeEventListener('wheel', onWheel);
      vp.removeEventListener('gesturestart', onGestureStart);
      vp.removeEventListener('gesturechange', onGestureChange);
      vp.removeEventListener('gestureend', onGestureEnd);
      vp.removeEventListener('pointerdown', onPointerDown);
      vp.removeEventListener('pointermove', onPointerMove);
      vp.removeEventListener('pointerup', onPointerUp);
      vp.removeEventListener('pointercancel', onPointerUp);
    };
  }, [apply, minScale, maxScale]);
  const gridSvg = `url("data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M120 0H0v120' fill='none' stroke='${encodeURIComponent(DC.grid)}' stroke-width='1'/%3E%3C/svg%3E")`;
  return /*#__PURE__*/React.createElement("div", {
    ref: vpRef,
    className: "design-canvas",
    style: {
      height: '100vh',
      width: '100vw',
      background: DC.bg,
      overflow: 'hidden',
      overscrollBehavior: 'none',
      touchAction: 'none',
      position: 'relative',
      fontFamily: DC.font,
      boxSizing: 'border-box',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: worldRef,
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      transformOrigin: '0 0',
      willChange: 'transform',
      width: 'max-content',
      minWidth: '100%',
      minHeight: '100%',
      padding: '60px 0 80px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: -6000,
      backgroundImage: gridSvg,
      backgroundSize: '120px 120px',
      pointerEvents: 'none',
      zIndex: -1
    }
  }), children));
}

// ─────────────────────────────────────────────────────────────
// DCSection — editable title + h-row of artboards in persisted order
// ─────────────────────────────────────────────────────────────
function DCSection({
  id,
  title,
  subtitle,
  children,
  gap = 48
}) {
  const ctx = React.useContext(DCCtx);
  const sid = id ?? title;
  const all = React.Children.toArray(children);
  const artboards = all.filter(c => c && c.type === DCArtboard);
  const rest = all.filter(c => !(c && c.type === DCArtboard));
  const sec = ctx && sid && ctx.section(sid) || {};
  // Must match DesignCanvas's srcKey computation exactly (it filters falsy
  // IDs), or onDelete persists a srcKey that DesignCanvas never recognizes.
  const allIds = artboards.map(a => a.props.id ?? a.props.label).filter(Boolean);
  const srcKey = allIds.join('\x1f');
  const hidden = sec.srcKey === srcKey ? sec.hidden || [] : [];
  const srcOrder = allIds.filter(k => !hidden.includes(k));
  const order = React.useMemo(() => {
    const kept = (sec.order || []).filter(k => srcOrder.includes(k));
    return [...kept, ...srcOrder.filter(k => !kept.includes(k))];
  }, [sec.order, srcOrder.join('|')]);
  const byId = Object.fromEntries(artboards.map(a => [a.props.id ?? a.props.label, a]));

  // marginBottom counter-scales so the on-screen gap between sections stays
  // constant — otherwise at low zoom the (world-space) gap collapses while
  // the screen-constant sectionhead below it doesn't, and the title reads as
  // belonging to the section above. paddingBottom below is just enough for
  // the 24px artboard-header (abs-positioned above each card) plus ~8px, so
  // the title sits tight against its own row at every zoom.
  return /*#__PURE__*/React.createElement("div", {
    "data-dc-section": sid,
    style: {
      marginBottom: 'calc(80px * var(--dc-inv-zoom, 1))',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 60px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-sectionhead",
    style: {
      paddingBottom: 36
    }
  }, /*#__PURE__*/React.createElement(DCEditable, {
    tag: "div",
    value: sec.title ?? title,
    onChange: v => ctx && sid && ctx.patchSection(sid, {
      title: v
    }),
    style: {
      fontSize: 28,
      fontWeight: 600,
      color: DC.title,
      letterSpacing: -0.4,
      marginBottom: 6,
      display: 'inline-block'
    }
  }), subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      color: DC.subtitle
    }
  }, subtitle))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap,
      padding: '0 60px',
      alignItems: 'flex-start',
      width: 'max-content'
    }
  }, order.map(k => /*#__PURE__*/React.createElement(DCArtboardFrame, {
    key: k,
    sectionId: sid,
    artboard: byId[k],
    order: order,
    label: (sec.labels || {})[k] ?? byId[k].props.label,
    onRename: v => ctx && ctx.patchSection(sid, x => ({
      labels: {
        ...x.labels,
        [k]: v
      }
    })),
    onReorder: next => ctx && ctx.patchSection(sid, {
      order: next
    }),
    onDelete: () => ctx && ctx.patchSection(sid, x => ({
      hidden: [...(x.srcKey === srcKey ? x.hidden || [] : []), k],
      srcKey
    })),
    onFocus: () => ctx && ctx.setFocus(`${sid}/${k}`)
  }))), rest);
}

// DCArtboard — marker; rendered by DCArtboardFrame via DCSection.
function DCArtboard() {
  return null;
}

// Per-artboard export (kind: 'png' | 'html'). Both paths share the same
// self-contained clone: computed styles baked in, @font-face / <img> /
// inline-style background-image urls inlined as data URIs. PNG wraps the
// clone in foreignObject→canvas at 3× the artboard's natural width×height
// (same pipeline the host uses for page captures); HTML wraps it in a
// minimal standalone document. Both are independent of viewport zoom.
async function dcExport(node, w, h, name, kind) {
  try {
    await document.fonts.ready;
  } catch {}
  const toDataURL = url => fetch(url).then(r => r.blob()).then(b => new Promise(res => {
    const fr = new FileReader();
    fr.onload = () => res(fr.result);
    fr.onerror = () => res(url);
    fr.readAsDataURL(b);
  })).catch(() => url);

  // Collect @font-face rules. ss.cssRules throws SecurityError on
  // cross-origin sheets (e.g. fonts.googleapis.com) — in that case fetch
  // the CSS text directly (those endpoints send ACAO:*) and regex-extract
  // the blocks. @import and @media/@supports are walked so nested
  // @font-face rules aren't missed.
  const fontRules = [],
    pending = [],
    seen = new Set();
  const scrapeCss = href => {
    if (seen.has(href)) return;
    seen.add(href);
    pending.push(fetch(href).then(r => r.text()).then(css => {
      for (const m of css.match(/@font-face\s*{[^}]*}/g) || []) fontRules.push({
        css: m,
        base: href
      });
      for (const m of css.matchAll(/@import\s+(?:url\()?['"]?([^'")\s;]+)/g)) scrapeCss(new URL(m[1], href).href);
    }).catch(() => {}));
  };
  const walk = (rules, base) => {
    for (const r of rules) {
      if (r.type === CSSRule.FONT_FACE_RULE) fontRules.push({
        css: r.cssText,
        base
      });else if (r.type === CSSRule.IMPORT_RULE && r.styleSheet) {
        const ibase = r.styleSheet.href || base;
        try {
          walk(r.styleSheet.cssRules, ibase);
        } catch {
          scrapeCss(ibase);
        }
      } else if (r.cssRules) walk(r.cssRules, base);
    }
  };
  for (const ss of document.styleSheets) {
    const base = ss.href || location.href;
    try {
      walk(ss.cssRules, base);
    } catch {
      if (ss.href) scrapeCss(ss.href);
    }
  }
  while (pending.length) await pending.shift();
  const fontCss = (await Promise.all(fontRules.map(async rule => {
    let out = rule.css,
      m;
    const re = /url\((['"]?)([^'")]+)\1\)/g;
    while (m = re.exec(rule.css)) {
      if (m[2].indexOf('data:') === 0) continue;
      let abs;
      try {
        abs = new URL(m[2], rule.base).href;
      } catch {
        continue;
      }
      out = out.split(m[0]).join('url("' + (await toDataURL(abs)) + '")');
    }
    return out;
  }))).join('\n');
  const cloneStyled = src => {
    if (src.nodeType === 8 || src.nodeType === 1 && src.tagName === 'SCRIPT') return document.createTextNode('');
    const dst = src.cloneNode(false);
    if (src.nodeType === 1) {
      const cs = getComputedStyle(src);
      let txt = '';
      for (let i = 0; i < cs.length; i++) txt += cs[i] + ':' + cs.getPropertyValue(cs[i]) + ';';
      dst.setAttribute('style', txt + 'animation:none;transition:none;');
      if (src.tagName === 'CANVAS') try {
        const im = document.createElement('img');
        im.src = src.toDataURL();
        im.setAttribute('style', txt);
        return im;
      } catch {}
    }
    for (let c = src.firstChild; c; c = c.nextSibling) dst.appendChild(cloneStyled(c));
    return dst;
  };
  const clone = cloneStyled(node);
  clone.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
  // Drop the card's own shadow/radius so the export is a flush w×h rect;
  // the artboard's own background (if any) is already in the computed style.
  clone.style.boxShadow = 'none';
  clone.style.borderRadius = '0';
  const jobs = [];
  clone.querySelectorAll('img').forEach(el => {
    const s = el.getAttribute('src');
    if (s && s.indexOf('data:') !== 0) jobs.push(toDataURL(el.src).then(d => el.setAttribute('src', d)));
  });
  [clone, ...clone.querySelectorAll('*')].forEach(el => {
    const bg = el.style.backgroundImage;
    if (!bg) return;
    let m;
    const re = /url\(["']?([^"')]+)["']?\)/g;
    while (m = re.exec(bg)) {
      const tok = m[0],
        url = m[1];
      if (url.indexOf('data:') === 0) continue;
      jobs.push(toDataURL(url).then(d => {
        el.style.backgroundImage = el.style.backgroundImage.split(tok).join('url("' + d + '")');
      }));
    }
  });
  await Promise.all(jobs);
  const xml = new XMLSerializer().serializeToString(clone);
  const save = (blob, ext) => {
    if (!blob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name + '.' + ext;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  if (kind === 'html') {
    const html = '<!doctype html><html><head><meta charset="utf-8"><title>' + name + '</title>' + (fontCss ? '<style>' + fontCss + '</style>' : '') + '</head><body style="margin:0">' + xml + '</body></html>';
    return save(new Blob([html], {
      type: 'text/html'
    }), 'html');
  }

  // PNG: the SVG's own width/height must be the output resolution — an
  // <img>-loaded SVG rasterizes at its intrinsic size, so sizing it at 1×
  // and ctx.scale()-ing up would just upscale a 1× bitmap. viewBox maps the
  // w×h foreignObject onto the px·w × px·h SVG canvas so the browser renders
  // the HTML at full resolution.
  const px = 3;
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + w * px + '" height="' + h * px + '" viewBox="0 0 ' + w + ' ' + h + '"><foreignObject width="' + w + '" height="' + h + '">' + (fontCss ? '<style><![CDATA[' + fontCss + ']]></style>' : '') + xml + '</foreignObject></svg>';
  const img = new Image();
  await new Promise((res, rej) => {
    img.onload = res;
    img.onerror = () => rej(new Error('svg load failed'));
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  });
  const cv = document.createElement('canvas');
  cv.width = w * px;
  cv.height = h * px;
  cv.getContext('2d').drawImage(img, 0, 0);
  cv.toBlob(blob => save(blob, 'png'), 'image/png');
}
function DCArtboardFrame({
  sectionId,
  artboard,
  label,
  order,
  onRename,
  onReorder,
  onFocus,
  onDelete
}) {
  const {
    id: rawId,
    label: rawLabel,
    width = 260,
    height = 480,
    children,
    style = {}
  } = artboard.props;
  const id = rawId ?? rawLabel;
  const ref = React.useRef(null);
  const cardRef = React.useRef(null);
  const menuRef = React.useRef(null);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [confirming, setConfirming] = React.useState(false);

  // ⋯ menu: close on any outside pointerdown. Two-click delete lives inside
  // the menu — first click arms the row, second commits; closing disarms.
  React.useEffect(() => {
    if (!menuOpen) {
      setConfirming(false);
      return;
    }
    const off = e => {
      if (!menuRef.current || !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('pointerdown', off, true);
    return () => document.removeEventListener('pointerdown', off, true);
  }, [menuOpen]);
  const doExport = kind => {
    setMenuOpen(false);
    if (!cardRef.current) return;
    const name = String(label || id || 'artboard').replace(/[^\w\s.-]+/g, '_');
    dcExport(cardRef.current, width, height, name, kind).catch(e => console.error('[design-canvas] export failed:', e));
  };

  // Live drag-reorder: dragged card sticks to cursor; siblings slide into
  // their would-be slots in real time via transforms. DOM order only
  // changes on drop.
  const onGripDown = e => {
    e.preventDefault();
    e.stopPropagation();
    const me = ref.current;
    // translateX is applied in local (pre-scale) space but pointer deltas and
    // getBoundingClientRect().left are screen-space — divide by the viewport's
    // current scale so the dragged card tracks the cursor at any zoom level.
    const scale = me.getBoundingClientRect().width / me.offsetWidth || 1;
    const peers = Array.from(document.querySelectorAll(`[data-dc-section="${sectionId}"] [data-dc-slot]`));
    const homes = peers.map(el => ({
      el,
      id: el.dataset.dcSlot,
      x: el.getBoundingClientRect().left
    }));
    const slotXs = homes.map(h => h.x);
    const startIdx = order.indexOf(id);
    const startX = e.clientX;
    let liveOrder = order.slice();
    me.classList.add('dc-dragging');
    const layout = () => {
      for (const h of homes) {
        if (h.id === id) continue;
        const slot = liveOrder.indexOf(h.id);
        h.el.style.transform = `translateX(${(slotXs[slot] - h.x) / scale}px)`;
      }
    };
    const move = ev => {
      const dx = ev.clientX - startX;
      me.style.transform = `translateX(${dx / scale}px)`;
      const cur = homes[startIdx].x + dx;
      let nearest = 0,
        best = Infinity;
      for (let i = 0; i < slotXs.length; i++) {
        const d = Math.abs(slotXs[i] - cur);
        if (d < best) {
          best = d;
          nearest = i;
        }
      }
      if (liveOrder.indexOf(id) !== nearest) {
        liveOrder = order.filter(k => k !== id);
        liveOrder.splice(nearest, 0, id);
        layout();
      }
    };
    const up = () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
      const finalSlot = liveOrder.indexOf(id);
      me.classList.remove('dc-dragging');
      me.style.transform = `translateX(${(slotXs[finalSlot] - homes[startIdx].x) / scale}px)`;
      // After the settle transition, kill transitions + clear transforms +
      // commit the reorder in the same frame so there's no visual snap-back.
      setTimeout(() => {
        for (const h of homes) {
          h.el.style.transition = 'none';
          h.el.style.transform = '';
        }
        if (liveOrder.join('|') !== order.join('|')) onReorder(liveOrder);
        requestAnimationFrame(() => requestAnimationFrame(() => {
          for (const h of homes) h.el.style.transition = '';
        }));
      }, 180);
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    "data-dc-slot": id,
    style: {
      position: 'relative',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-header",
    style: {
      color: DC.label
    },
    onPointerDown: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-labelrow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-grip",
    onPointerDown: onGripDown,
    title: "Drag to reorder"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "9",
    height: "13",
    viewBox: "0 0 9 13",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "2",
    cy: "2",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "2",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "2",
    cy: "6.5",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "6.5",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "2",
    cy: "11",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "11",
    r: "1.1"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "dc-labeltext",
    onClick: onFocus,
    title: "Click to focus"
  }, /*#__PURE__*/React.createElement(DCEditable, {
    value: label,
    onChange: onRename,
    onClick: e => e.stopPropagation(),
    style: {
      fontSize: 15,
      fontWeight: 500,
      color: DC.label,
      lineHeight: 1
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "dc-btns"
  }, /*#__PURE__*/React.createElement("div", {
    ref: menuRef,
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "dc-kebab",
    title: "More",
    onClick: () => setMenuOpen(o => !o)
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "2.5",
    cy: "6",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "6",
    cy: "6",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "9.5",
    cy: "6",
    r: "1.1"
  }))), menuOpen && /*#__PURE__*/React.createElement("div", {
    className: "dc-menu",
    onPointerDown: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => doExport('png')
  }, "Download PNG"), /*#__PURE__*/React.createElement("button", {
    onClick: () => doExport('html')
  }, "Download HTML"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("button", {
    className: "dc-danger",
    onClick: () => {
      if (confirming) {
        setMenuOpen(false);
        onDelete();
      } else setConfirming(true);
    }
  }, confirming ? 'Click again to delete' : 'Delete'))), /*#__PURE__*/React.createElement("button", {
    className: "dc-expand",
    onClick: onFocus,
    title: "Focus"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M7 1h4v4M5 11H1V7M11 1L7.5 4.5M1 11l3.5-3.5"
  }))))), /*#__PURE__*/React.createElement("div", {
    ref: cardRef,
    className: "dc-card",
    style: {
      borderRadius: 2,
      boxShadow: '0 1px 3px rgba(0,0,0,.08),0 4px 16px rgba(0,0,0,.06)',
      overflow: 'hidden',
      width,
      height,
      background: '#fff',
      ...style
    }
  }, children || /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#bbb',
      fontSize: 13,
      fontFamily: DC.font
    }
  }, id)));
}

// Inline rename — commits on blur or Enter.
function DCEditable({
  value,
  onChange,
  style,
  tag = 'span',
  onClick
}) {
  const T = tag;
  return /*#__PURE__*/React.createElement(T, {
    className: "dc-editable",
    contentEditable: true,
    suppressContentEditableWarning: true,
    onClick: onClick,
    onPointerDown: e => e.stopPropagation(),
    onBlur: e => onChange && onChange(e.currentTarget.textContent),
    onKeyDown: e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.currentTarget.blur();
      }
    },
    style: style
  }, value);
}

// ─────────────────────────────────────────────────────────────
// Focus mode — overlay one artboard; ←/→ within section, ↑/↓ across
// sections, Esc or backdrop click to exit.
// ─────────────────────────────────────────────────────────────
function DCFocusOverlay({
  entry,
  sectionMeta,
  sectionOrder
}) {
  const ctx = React.useContext(DCCtx);
  const {
    sectionId,
    artboard
  } = entry;
  const sec = ctx.section(sectionId);
  const meta = sectionMeta[sectionId];
  const peers = meta.slotIds;
  const aid = artboard.props.id ?? artboard.props.label;
  const idx = peers.indexOf(aid);
  const secIdx = sectionOrder.indexOf(sectionId);
  const go = d => {
    const n = peers[(idx + d + peers.length) % peers.length];
    if (n) ctx.setFocus(`${sectionId}/${n}`);
  };
  const goSection = d => {
    // Sections whose artboards are all deleted have slotIds:[] — step past
    // them to the next non-empty section so ↑/↓ doesn't dead-end.
    const n = sectionOrder.length;
    for (let i = 1; i < n; i++) {
      const ns = sectionOrder[((secIdx + d * i) % n + n) % n];
      const first = sectionMeta[ns] && sectionMeta[ns].slotIds[0];
      if (first) {
        ctx.setFocus(`${ns}/${first}`);
        return;
      }
    }
  };
  React.useEffect(() => {
    const k = e => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        go(-1);
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        go(1);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        goSection(-1);
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        goSection(1);
      }
    };
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  });
  const {
    width = 260,
    height = 480,
    children
  } = artboard.props;
  const [vp, setVp] = React.useState({
    w: window.innerWidth,
    h: window.innerHeight
  });
  React.useEffect(() => {
    const r = () => setVp({
      w: window.innerWidth,
      h: window.innerHeight
    });
    window.addEventListener('resize', r);
    return () => window.removeEventListener('resize', r);
  }, []);
  const scale = Math.max(0.1, Math.min((vp.w - 200) / width, (vp.h - 260) / height, 2));
  const [ddOpen, setDd] = React.useState(false);
  const Arrow = ({
    dir,
    onClick
  }) => /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      onClick();
    },
    style: {
      position: 'absolute',
      top: '50%',
      [dir]: 28,
      transform: 'translateY(-50%)',
      border: 'none',
      background: 'rgba(255,255,255,.08)',
      color: 'rgba(255,255,255,.9)',
      width: 44,
      height: 44,
      borderRadius: 22,
      fontSize: 18,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background .15s'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,.18)',
    onMouseLeave: e => e.currentTarget.style.background = 'rgba(255,255,255,.08)'
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 18 18",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: dir === 'left' ? 'M11 3L5 9l6 6' : 'M7 3l6 6-6 6'
  })));

  // Portal to body so position:fixed is the real viewport regardless of any
  // transform on DesignCanvas's ancestors (including the canvas zoom itself).
  return ReactDOM.createPortal(/*#__PURE__*/React.createElement("div", {
    onClick: () => ctx.setFocus(null),
    onWheel: e => e.preventDefault(),
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(24,20,16,.6)',
      backdropFilter: 'blur(14px)',
      fontFamily: DC.font,
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 72,
      display: 'flex',
      alignItems: 'flex-start',
      padding: '16px 20px 0',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setDd(o => !o),
    style: {
      border: 'none',
      background: 'transparent',
      color: '#fff',
      cursor: 'pointer',
      padding: '6px 8px',
      borderRadius: 6,
      textAlign: 'left',
      fontFamily: 'inherit'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18,
      fontWeight: 600,
      letterSpacing: -0.3
    }
  }, meta.title), /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 11 11",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    style: {
      opacity: .7
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2 4l3.5 3.5L9 4"
  }))), meta.subtitle && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 13,
      opacity: .6,
      fontWeight: 400,
      marginTop: 2
    }
  }, meta.subtitle)), ddOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '100%',
      left: 0,
      marginTop: 4,
      background: '#2a251f',
      borderRadius: 8,
      boxShadow: '0 8px 32px rgba(0,0,0,.4)',
      padding: 4,
      minWidth: 200,
      zIndex: 10
    }
  }, sectionOrder.filter(sid => sectionMeta[sid].slotIds.length).map(sid => /*#__PURE__*/React.createElement("button", {
    key: sid,
    onClick: () => {
      setDd(false);
      const f = sectionMeta[sid].slotIds[0];
      if (f) ctx.setFocus(`${sid}/${f}`);
    },
    style: {
      display: 'block',
      width: '100%',
      textAlign: 'left',
      border: 'none',
      cursor: 'pointer',
      background: sid === sectionId ? 'rgba(255,255,255,.1)' : 'transparent',
      color: '#fff',
      padding: '8px 12px',
      borderRadius: 5,
      fontSize: 14,
      fontWeight: sid === sectionId ? 600 : 400,
      fontFamily: 'inherit'
    }
  }, sectionMeta[sid].title)))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => ctx.setFocus(null),
    onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,.12)',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent',
    style: {
      border: 'none',
      background: 'transparent',
      color: 'rgba(255,255,255,.7)',
      width: 32,
      height: 32,
      borderRadius: 16,
      fontSize: 20,
      cursor: 'pointer',
      lineHeight: 1,
      transition: 'background .12s'
    }
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 64,
      bottom: 56,
      left: 100,
      right: 100,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: width * scale,
      height: height * scale,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      height,
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      background: '#fff',
      borderRadius: 2,
      overflow: 'hidden',
      boxShadow: '0 20px 80px rgba(0,0,0,.4)'
    }
  }, children || /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#bbb'
    }
  }, aid))), /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      fontSize: 14,
      fontWeight: 500,
      opacity: .85,
      textAlign: 'center'
    }
  }, (sec.labels || {})[aid] ?? artboard.props.label, /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: .5,
      marginLeft: 10,
      fontVariantNumeric: 'tabular-nums'
    }
  }, idx + 1, " / ", peers.length))), /*#__PURE__*/React.createElement(Arrow, {
    dir: "left",
    onClick: () => go(-1)
  }), /*#__PURE__*/React.createElement(Arrow, {
    dir: "right",
    onClick: () => go(1)
  }), /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: 'absolute',
      bottom: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: 8
    }
  }, peers.map((p, i) => /*#__PURE__*/React.createElement("button", {
    key: p,
    onClick: () => ctx.setFocus(`${sectionId}/${p}`),
    style: {
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      width: 6,
      height: 6,
      borderRadius: 3,
      background: i === idx ? '#fff' : 'rgba(255,255,255,.3)'
    }
  })))), document.body);
}

// ─────────────────────────────────────────────────────────────
// Post-it — absolute-positioned sticky note
// ─────────────────────────────────────────────────────────────
function DCPostIt({
  children,
  top,
  left,
  right,
  bottom,
  rotate = -2,
  width = 180
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top,
      left,
      right,
      bottom,
      width,
      background: DC.postitBg,
      padding: '14px 16px',
      fontFamily: '"Comic Sans MS", "Marker Felt", "Segoe Print", cursive',
      fontSize: 14,
      lineHeight: 1.4,
      color: DC.postitText,
      boxShadow: '0 2px 8px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
      transform: `rotate(${rotate}deg)`,
      zIndex: 5
    }
  }, children);
}
Object.assign(window, {
  DesignCanvas,
  DCSection,
  DCArtboard,
  DCPostIt
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "assets/design-canvas.jsx", error: String((e && e.message) || e) }); }

// cards.jsx
try { (() => {
/* Business card variations - all 5 designs
   Print spec: 3.5" × 2" trim, 1/8" bleed, crop marks
   At display scale: 1" = 120px (so 1050x600 print → 420x240 display)
   Bleed area: 450x270 / Trim line at 15px inset
*/

const PRINT_W = 420; // 3.5" × 120
const PRINT_H = 240; // 2.0" × 120
const BLEED = 15; // 0.125" × 120
const FULL_W = PRINT_W + BLEED * 2; // 450
const FULL_H = PRINT_H + BLEED * 2; // 270

// Person info
const PERSON = {
  name: "Lance Foubert",
  title: "Operations Manager",
  cell: "403.523.0488",
  email: "lfoubert@foothillsgroup.ca",
  web: "www.foothillsgroup.ca"
};
const LOCATIONS = [{
  city: "CALGARY",
  dept: "HEAVY DUTY",
  addr: "9919 Shepard Road SE",
  region: "Calgary, AB",
  phone: "403.523.0488"
}, {
  city: "CALGARY",
  dept: "AUTOMOTIVE",
  addr: "4700 112 Ave SE",
  region: "Calgary, AB",
  phone: "403.248.2810"
}, {
  city: "LETHBRIDGE",
  dept: "HD & AUTO",
  addr: "4310 9 Ave N",
  region: "Lethbridge, AB",
  phone: "403.327.3405"
}];

// ---------- Crop marks frame ----------
function CropFrame({
  children,
  bg = "#ffffff"
}) {
  const mark = {
    position: 'absolute',
    background: '#1a1a1a'
  };
  const len = 10;
  const w = 0.75;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: FULL_W + 40,
      height: FULL_H + 40,
      background: 'transparent',
      flexShrink: 0
    }
  }, [
  // top-left
  {
    top: 20 - len,
    left: 20 + BLEED,
    width: w,
    height: len
  }, {
    top: 20 + BLEED,
    left: 20 - len,
    width: len,
    height: w
  },
  // top-right
  {
    top: 20 - len,
    left: 20 + BLEED + PRINT_W - w,
    width: w,
    height: len
  }, {
    top: 20 + BLEED,
    left: 20 + FULL_W,
    width: len,
    height: w
  },
  // bottom-left
  {
    top: 20 + FULL_H,
    left: 20 + BLEED,
    width: w,
    height: len
  }, {
    top: 20 + BLEED + PRINT_H - w,
    left: 20 - len,
    width: len,
    height: w
  },
  // bottom-right
  {
    top: 20 + FULL_H,
    left: 20 + BLEED + PRINT_W - w,
    width: w,
    height: len
  }, {
    top: 20 + BLEED + PRINT_H - w,
    left: 20 + FULL_W,
    width: len,
    height: w
  }].map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...mark,
      ...s
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 20,
      left: 20,
      width: FULL_W,
      height: FULL_H,
      background: bg,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: BLEED,
      left: BLEED,
      width: PRINT_W,
      height: PRINT_H,
      outline: '0.5px dashed rgba(255,0,0,0.15)',
      pointerEvents: 'none',
      zIndex: 10
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: FULL_W,
      height: FULL_H
    }
  }, children)));
}

// ---------- Shared atoms ----------
const ShopLogo = ({
  color = "#1a1a1a",
  height = 28
}) => /*#__PURE__*/React.createElement("img", {
  src: color === '#ffffff' ? "assets/shop-logo-white.svg" : "assets/shop-logo.svg",
  alt: "Shop logo",
  style: {
    height,
    display: 'block'
  }
});
const XcmgLogo = ({
  variant = 'blue',
  height = 18
}) => /*#__PURE__*/React.createElement("img", {
  src: variant === 'white' ? "assets/xcmg-logo-white.svg" : "assets/xcmg-logo-blue.svg",
  alt: "XCMG",
  style: {
    height,
    display: 'block'
  }
});

// =====================================================
// VARIANT 1 — CLASSIC: Charcoal w/ blue accent bar
// =====================================================
function V1Front() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      background: '#f4f4f2',
      position: 'relative',
      fontFamily: 'Inter, sans-serif'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 18,
      background: '#0062B0'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: BLEED + 18,
      left: BLEED + 28
    }
  }, /*#__PURE__*/React.createElement(ShopLogo, {
    color: "#1a1a1a",
    height: 26
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: BLEED + 22,
      left: BLEED + 28,
      right: BLEED + 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Barlow Condensed", sans-serif',
      fontWeight: 700,
      fontSize: 26,
      letterSpacing: '0.01em',
      color: '#1a1a1a',
      lineHeight: 1,
      textTransform: 'uppercase'
    }
  }, PERSON.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Barlow Condensed", sans-serif',
      fontWeight: 500,
      fontSize: 13,
      letterSpacing: '0.18em',
      color: '#0062B0',
      marginTop: 4,
      textTransform: 'uppercase'
    }
  }, PERSON.title), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      height: 1,
      background: '#1a1a1a',
      opacity: 0.15
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      rowGap: 4,
      columnGap: 8,
      fontSize: 8.5,
      color: '#1a1a1a',
      letterSpacing: '0.02em'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#888',
      fontSize: 7,
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
      display: 'block'
    }
  }, "Cell"), PERSON.cell), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#888',
      fontSize: 7,
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
      display: 'block'
    }
  }, "Email"), PERSON.email), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: '1 / -1'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#888',
      fontSize: 7,
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
      display: 'block'
    }
  }, "Web"), PERSON.web))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: BLEED + 22,
      right: BLEED + 26,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 6,
      letterSpacing: '0.18em',
      color: '#666',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap'
    }
  }, "Authorized Dealer"), /*#__PURE__*/React.createElement(XcmgLogo, {
    variant: "blue",
    height: 13
  })));
}
function V1Back() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      background: '#ffffff',
      position: 'relative',
      fontFamily: 'Inter, sans-serif',
      color: '#1a1a1a'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 18,
      background: '#0062B0'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: BLEED + 22,
      left: BLEED + 28,
      right: BLEED + 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Barlow Condensed", sans-serif',
      fontWeight: 600,
      fontSize: 11,
      letterSpacing: '0.25em',
      textTransform: 'uppercase',
      marginBottom: 12,
      color: "#0062B0"
    }
  }, "Service Locations"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 10
    }
  }, LOCATIONS.map((loc, i) => /*#__PURE__*/React.createElement("div", {
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Barlow Condensed", sans-serif',
      fontWeight: 700,
      fontSize: 13,
      letterSpacing: '0.04em',
      color: '#1a1a1a',
      lineHeight: 1.05
    }
  }, loc.city), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Barlow Condensed", sans-serif',
      fontWeight: 500,
      fontSize: 8.5,
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
      marginTop: 1,
      color: "#0062B0"
    }
  }, loc.dept), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: 'rgba(0,0,0,0.15)',
      margin: '6px 0'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 7.5,
      lineHeight: 1.45,
      color: '#555'
    }
  }, loc.addr), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 7.5,
      lineHeight: 1.45,
      color: '#555'
    }
  }, loc.region), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8.5,
      marginTop: 4,
      fontWeight: 600
    }
  }, loc.phone))))));
}

// =====================================================
// VARIANT 2 — BOLD SPLIT: Charcoal panel on right
// =====================================================
function V2Front() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      display: 'flex',
      fontFamily: 'Inter, sans-serif'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '0 0 38%',
      background: '#f4f4f2',
      padding: `${BLEED + 18}px 14px ${BLEED + 18}px ${BLEED + 22}px`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(ShopLogo, {
    color: "#1a1a1a",
    height: 28
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 6.5,
      letterSpacing: '0.18em',
      color: '#666',
      textTransform: 'uppercase',
      marginBottom: 4
    }
  }, "Authorized Dealer"), /*#__PURE__*/React.createElement(XcmgLogo, {
    variant: "blue",
    height: 14
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      background: '#1a1a1a',
      color: '#fff',
      padding: `${BLEED + 22}px ${BLEED + 22}px ${BLEED + 22}px 18px`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Barlow Condensed", sans-serif',
      fontWeight: 700,
      fontSize: 24,
      lineHeight: 0.92,
      textTransform: 'uppercase',
      letterSpacing: '0.01em'
    }
  }, PERSON.name.split(' ')[0], /*#__PURE__*/React.createElement("br", null), PERSON.name.split(' ').slice(1).join(' ')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-block',
      alignSelf: 'flex-start',
      background: '#0062B0',
      color: '#fff',
      padding: '3px 7px',
      marginTop: 7,
      fontFamily: '"Barlow Condensed", sans-serif',
      fontWeight: 600,
      fontSize: 10,
      letterSpacing: '0.2em',
      textTransform: 'uppercase'
    }
  }, PERSON.title), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      fontSize: 8.5,
      lineHeight: 1.7
    }
  }, /*#__PURE__*/React.createElement("div", null, PERSON.cell), /*#__PURE__*/React.createElement("div", null, PERSON.email), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "rgb(255, 255, 255)"
    }
  }, PERSON.web))));
}
function V2Back() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      background: '#f4f4f2',
      position: 'relative',
      fontFamily: 'Inter, sans-serif',
      color: '#1a1a1a',
      padding: `${BLEED + 22}px ${BLEED + 22}px ${BLEED + 18}px ${BLEED + 22}px`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Barlow Condensed", sans-serif',
      fontWeight: 700,
      fontSize: 18,
      textTransform: 'uppercase',
      letterSpacing: '0.04em'
    }
  }, "Service Locations"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 3,
      width: 36,
      background: '#0062B0'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 12
    }
  }, LOCATIONS.map((loc, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      borderTop: '2px solid #1a1a1a',
      paddingTop: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Barlow Condensed", sans-serif',
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      lineHeight: 1
    }
  }, loc.city), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 7,
      letterSpacing: '0.15em',
      color: '#0062B0',
      textTransform: 'uppercase',
      marginTop: 2,
      fontWeight: 600
    }
  }, loc.dept), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 7.5,
      lineHeight: 1.5,
      marginTop: 6,
      color: '#444'
    }
  }, loc.addr, /*#__PURE__*/React.createElement("br", null), loc.region), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      marginTop: 4,
      fontWeight: 600
    }
  }, loc.phone)))));
}

// =====================================================
// VARIANT 3 — INDUSTRIAL TYPE: Big name takeover
// =====================================================
function V3Front() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      background: '#f4f4f2',
      position: 'relative',
      fontFamily: 'Inter, sans-serif'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: 0,
      height: 0,
      borderTop: `${FULL_H * 0.55}px solid #0062B0`,
      borderLeft: `${FULL_W * 0.4}px solid transparent`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: BLEED + 18,
      left: BLEED + 22
    }
  }, /*#__PURE__*/React.createElement(ShopLogo, {
    color: "#1a1a1a",
    height: 22
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: BLEED + 14,
      right: BLEED + 18,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: 3
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 6,
      letterSpacing: '0.2em',
      color: 'rgba(255,255,255,0.85)',
      textTransform: 'uppercase',
      fontWeight: 500
    }
  }, "Authorized Dealer"), /*#__PURE__*/React.createElement(XcmgLogo, {
    variant: "white",
    height: 12
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: BLEED + 22,
      bottom: BLEED + 60
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Barlow Condensed", sans-serif',
      fontWeight: 800,
      fontSize: 38,
      lineHeight: 0.85,
      textTransform: 'uppercase',
      color: '#1a1a1a',
      letterSpacing: '-0.01em'
    }
  }, PERSON.name.split(' ')[0]), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Barlow Condensed", sans-serif',
      fontWeight: 800,
      fontSize: 38,
      lineHeight: 0.85,
      textTransform: 'uppercase',
      color: '#1a1a1a',
      letterSpacing: '-0.01em'
    }
  }, PERSON.name.split(' ').slice(1).join(' ')), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Barlow Condensed", sans-serif',
      fontWeight: 600,
      fontSize: 11,
      letterSpacing: '0.2em',
      color: '#0062B0',
      textTransform: 'uppercase',
      marginTop: 6
    }
  }, PERSON.title)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: BLEED + 22,
      right: BLEED + 22,
      bottom: BLEED + 14,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      borderTop: '1.5px solid #1a1a1a',
      paddingTop: 7,
      fontSize: 8,
      color: '#1a1a1a',
      fontWeight: 500
    }
  }, /*#__PURE__*/React.createElement("div", null, PERSON.cell), /*#__PURE__*/React.createElement("div", null, PERSON.email), /*#__PURE__*/React.createElement("div", null, PERSON.web)));
}
function V3Back() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      background: '#1a1a1a',
      position: 'relative',
      fontFamily: 'Inter, sans-serif',
      color: '#fff',
      padding: `${BLEED + 18}px ${BLEED + 18}px ${BLEED + 14}px ${BLEED + 18}px`,
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Barlow Condensed", sans-serif',
      fontWeight: 800,
      fontSize: 22,
      textTransform: 'uppercase',
      letterSpacing: '-0.01em',
      lineHeight: 0.9
    }
  }, "Three Shops.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "rgb(0, 98, 176)"
    }
  }, "One Crew.")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 10,
      borderTop: '1px solid rgba(255,255,255,0.2)',
      paddingTop: 8
    }
  }, LOCATIONS.map((loc, i) => /*#__PURE__*/React.createElement("div", {
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 6,
      height: 6,
      background: '#0062B0'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Barlow Condensed", sans-serif',
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: '0.06em'
    }
  }, loc.city)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 6.5,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      marginTop: 1,
      marginLeft: 10,
      fontWeight: 600,
      color: "rgb(255, 255, 255)"
    }
  }, loc.dept), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 7,
      lineHeight: 1.4,
      marginTop: 5,
      color: '#bbb',
      marginLeft: 10
    }
  }, loc.addr, /*#__PURE__*/React.createElement("br", null), loc.region), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8.5,
      marginTop: 3,
      fontWeight: 600,
      marginLeft: 10
    }
  }, loc.phone)))));
}

// =====================================================
// VARIANT 4 — BLUEPRINT: White w/ technical grid
// =====================================================
function V4Front() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      background: '#fafafa',
      position: 'relative',
      fontFamily: 'Inter, sans-serif'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    style: {
      position: 'absolute',
      inset: 0
    },
    width: "100%",
    height: "100%"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("pattern", {
    id: "grid4",
    width: "12",
    height: "12",
    patternUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 12 0 L 0 0 0 12",
    fill: "none",
    stroke: "#e5e5e5",
    strokeWidth: "0.5"
  }))), /*#__PURE__*/React.createElement("rect", {
    width: "100%",
    height: "100%",
    fill: "url(#grid4)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: BLEED + 14,
      left: BLEED + 18,
      right: BLEED + 18,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: 8,
      borderBottom: '1px solid #1a1a1a'
    }
  }, /*#__PURE__*/React.createElement(ShopLogo, {
    color: "#1a1a1a",
    height: 20
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 6,
      letterSpacing: '0.2em',
      color: '#666',
      textTransform: 'uppercase'
    }
  }, "Auth. Dealer"), /*#__PURE__*/React.createElement(XcmgLogo, {
    variant: "blue",
    height: 12
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: BLEED + 18,
      right: BLEED + 18,
      top: BLEED + 60
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 6.5,
      letterSpacing: '0.2em',
      color: '#0062B0',
      textTransform: 'uppercase',
      marginBottom: 6
    }
  }, "// CONTACT"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Barlow Condensed", sans-serif',
      fontWeight: 700,
      fontSize: 30,
      lineHeight: 1,
      textTransform: 'uppercase',
      color: '#1a1a1a',
      letterSpacing: '0.01em'
    }
  }, PERSON.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Barlow Condensed", sans-serif',
      fontWeight: 500,
      fontSize: 12,
      letterSpacing: '0.18em',
      color: '#1a1a1a',
      textTransform: 'uppercase',
      marginTop: 3,
      opacity: 0.7
    }
  }, PERSON.title)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: BLEED + 18,
      right: BLEED + 18,
      bottom: BLEED + 12,
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 7,
      color: '#1a1a1a',
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      borderTop: '1px dotted #999',
      paddingTop: 3
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#666'
    }
  }, "CELL"), /*#__PURE__*/React.createElement("span", null, PERSON.cell)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#666'
    }
  }, "EMAIL"), /*#__PURE__*/React.createElement("span", null, PERSON.email)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#666'
    }
  }, "WEB"), /*#__PURE__*/React.createElement("span", null, PERSON.web))));
}
function V4Back() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      background: '#fafafa',
      position: 'relative',
      fontFamily: 'Inter, sans-serif',
      color: '#1a1a1a'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    style: {
      position: 'absolute',
      inset: 0
    },
    width: "100%",
    height: "100%"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("pattern", {
    id: "grid4b",
    width: "12",
    height: "12",
    patternUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 12 0 L 0 0 0 12",
    fill: "none",
    stroke: "#e5e5e5",
    strokeWidth: "0.5"
  }))), /*#__PURE__*/React.createElement("rect", {
    width: "100%",
    height: "100%",
    fill: "url(#grid4b)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      padding: `${BLEED + 16}px ${BLEED + 18}px ${BLEED + 12}px`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 6.5,
      letterSpacing: '0.2em',
      color: '#0062B0',
      textTransform: 'uppercase'
    }
  }, "// LOCATIONS"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 1,
      background: '#1a1a1a'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 6.5,
      letterSpacing: '0.2em',
      color: '#666'
    }
  }, "03")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 10
    }
  }, LOCATIONS.map((loc, i) => /*#__PURE__*/React.createElement("div", {
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 6,
      color: '#0062B0',
      letterSpacing: '0.15em'
    }
  }, "0", i + 1), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Barlow Condensed", sans-serif',
      fontWeight: 700,
      fontSize: 13,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      marginTop: 2,
      lineHeight: 1
    }
  }, loc.city), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 6.5,
      letterSpacing: '0.16em',
      color: '#666',
      textTransform: 'uppercase',
      marginTop: 2,
      fontWeight: 500
    }
  }, loc.dept), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 7,
      lineHeight: 1.45,
      marginTop: 6,
      color: '#444'
    }
  }, loc.addr, /*#__PURE__*/React.createElement("br", null), loc.region), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 8,
      marginTop: 4,
      fontWeight: 600
    }
  }, loc.phone))))));
}

// =====================================================
// VARIANT 5 — STENCIL: Heavy, all-charcoal w/ blue stripe
// =====================================================
function V5Front() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      background: '#1a1a1a',
      position: 'relative',
      fontFamily: 'Inter, sans-serif',
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      right: -20,
      width: 50,
      height: '100%',
      background: '#0062B0',
      transform: 'skewX(-12deg)'
    }
  }), /*#__PURE__*/React.createElement("svg", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 8,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("pattern", {
    id: "hatch5",
    width: "6",
    height: "6",
    patternUnits: "userSpaceOnUse",
    patternTransform: "rotate(45)"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "6",
    stroke: "#0062B0",
    strokeWidth: "2"
  }))), /*#__PURE__*/React.createElement("rect", {
    width: "100%",
    height: "100%",
    fill: "url(#hatch5)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: BLEED + 22,
      left: BLEED + 22
    }
  }, /*#__PURE__*/React.createElement(ShopLogo, {
    color: "#ffffff",
    height: 26
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: BLEED + 22,
      bottom: BLEED + 50
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Barlow Condensed", sans-serif',
      fontWeight: 700,
      fontSize: 26,
      lineHeight: 1,
      textTransform: 'uppercase',
      letterSpacing: '0.02em'
    }
  }, PERSON.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-block',
      marginTop: 5,
      fontFamily: '"Barlow Condensed", sans-serif',
      fontWeight: 600,
      fontSize: 11,
      letterSpacing: '0.2em',
      color: '#fff',
      textTransform: 'uppercase',
      borderBottom: '2px solid #0062B0',
      paddingBottom: 3
    }
  }, PERSON.title)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: BLEED + 22,
      bottom: BLEED + 14,
      fontSize: 7.5,
      color: '#cfcfcf',
      lineHeight: 1.6
    }
  }, /*#__PURE__*/React.createElement("div", null, PERSON.cell, " \xA0\xB7\xA0 ", PERSON.email), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "rgb(207, 207, 207)"
    }
  }, PERSON.web)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: BLEED + 18,
      right: BLEED + 18,
      zIndex: 2,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 6,
      letterSpacing: '0.2em',
      color: 'rgba(255,255,255,0.7)',
      textTransform: 'uppercase'
    }
  }, "Authorized Dealer"), /*#__PURE__*/React.createElement(XcmgLogo, {
    variant: "white",
    height: 12
  })));
}
function V5Back() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      background: '#f4f4f2',
      position: 'relative',
      fontFamily: 'Inter, sans-serif',
      color: '#1a1a1a',
      padding: `${BLEED + 22}px ${BLEED + 22}px ${BLEED + 16}px ${BLEED + 22}px`
    }
  }, /*#__PURE__*/React.createElement("svg", {
    style: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 8,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("pattern", {
    id: "hatch5b",
    width: "6",
    height: "6",
    patternUnits: "userSpaceOnUse",
    patternTransform: "rotate(45)"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "6",
    stroke: "#0062B0",
    strokeWidth: "2"
  }))), /*#__PURE__*/React.createElement("rect", {
    width: "100%",
    height: "100%",
    fill: "url(#hatch5b)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Barlow Condensed", sans-serif',
      fontWeight: 700,
      fontSize: 16,
      textTransform: 'uppercase',
      letterSpacing: '0.06em'
    }
  }, "Locations"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Barlow Condensed", sans-serif',
      fontWeight: 600,
      fontSize: 9,
      letterSpacing: '0.2em',
      color: '#0062B0',
      textTransform: 'uppercase'
    }
  }, "Alberta \xB7 03")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 10
    }
  }, LOCATIONS.map((loc, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      position: 'relative',
      paddingLeft: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      top: 2,
      bottom: 0,
      width: 2,
      background: '#0062B0'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Barlow Condensed", sans-serif',
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      lineHeight: 1
    }
  }, loc.city), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 6.5,
      letterSpacing: '0.16em',
      color: '#0062B0',
      textTransform: 'uppercase',
      marginTop: 2,
      fontWeight: 600
    }
  }, loc.dept), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 7,
      lineHeight: 1.45,
      marginTop: 5,
      color: '#444'
    }
  }, loc.addr, /*#__PURE__*/React.createElement("br", null), loc.region), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 8.5,
      marginTop: 3,
      fontWeight: 600
    }
  }, loc.phone)))));
}

// ---------- Card label row ----------
function CardSet({
  title,
  subtitle,
  FrontC,
  BackC,
  frontBg,
  backBg
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 28,
      width: FULL_W + 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      minHeight: 50
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Barlow Condensed", sans-serif',
      fontWeight: 700,
      fontSize: 16,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      color: '#1a1a1a',
      whiteSpace: 'nowrap'
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Inter, sans-serif',
      fontSize: 10,
      color: '#666',
      marginTop: 3,
      whiteSpace: 'nowrap'
    }
  }, subtitle)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 8,
      letterSpacing: '0.2em',
      color: '#999',
      marginBottom: 4,
      textTransform: 'uppercase'
    }
  }, "Front"), /*#__PURE__*/React.createElement(CropFrame, {
    bg: frontBg
  }, /*#__PURE__*/React.createElement(FrontC, null))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 8,
      letterSpacing: '0.2em',
      color: '#999',
      marginBottom: 4,
      textTransform: 'uppercase'
    }
  }, "Back"), /*#__PURE__*/React.createElement(CropFrame, {
    bg: backBg
  }, /*#__PURE__*/React.createElement(BackC, null)))));
}
function App() {
  const variants = [{
    title: '01 — Charcoal Bar',
    sub: 'Dark back · accent rail',
    f: V1Front,
    b: V1Back,
    fb: '#f4f4f2',
    bb: '#1a1a1a'
  }, {
    title: '02 — Bold Split',
    sub: 'Two-panel front · light back',
    f: V2Front,
    b: V2Back,
    fb: '#1a1a1a',
    bb: '#f4f4f2'
  }, {
    title: '03 — Industrial',
    sub: 'Big type · diagonal cut',
    f: V3Front,
    b: V3Back,
    fb: '#f4f4f2',
    bb: '#1a1a1a'
  }, {
    title: '04 — Blueprint',
    sub: 'Tech grid · monospace',
    f: V4Front,
    b: V4Back,
    fb: '#fafafa',
    bb: '#fafafa'
  }, {
    title: '05 — Stencil',
    sub: 'Hatched · skewed stripe',
    f: V5Front,
    b: V5Back,
    fb: '#1a1a1a',
    bb: '#f4f4f2'
  }];
  return /*#__PURE__*/React.createElement("div", {
    "data-screen-label": "Business Cards \u2014 5 variations",
    style: {
      minHeight: '100vh',
      background: '#e8e6e1',
      fontFamily: 'Inter, sans-serif',
      padding: '40px 30px 60px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1400,
      margin: '0 auto 30px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"Barlow Condensed", sans-serif',
      fontWeight: 700,
      fontSize: 32,
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
      color: '#1a1a1a',
      lineHeight: 1
    }
  }, "Business Card \u2014 5 Directions"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      marginTop: 8,
      fontSize: 11,
      color: '#555',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "Trim:"), " 3.5\u2033 \xD7 2\u2033"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "Bleed:"), " 0.125\u2033 all sides"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "Resolution:"), " 300 DPI"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "Color:"), " CMYK"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "Marks:"), " Crop marks shown at corners")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontSize: 10,
      color: '#888'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      width: 14,
      height: 1,
      background: 'red',
      opacity: 0.4,
      verticalAlign: 'middle',
      marginRight: 6
    }
  }), "Red dashed line = trim line \xB7 area beyond is bleed")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 30,
      justifyContent: 'flex-start',
      flexWrap: 'nowrap',
      overflowX: 'auto',
      paddingBottom: 20
    }
  }, variants.map((v, i) => /*#__PURE__*/React.createElement(CardSet, {
    key: i,
    title: v.title,
    subtitle: v.sub,
    FrontC: v.f,
    BackC: v.b,
    frontBg: v.fb,
    backBg: v.bb
  }))));
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "cards.jsx", error: String((e && e.message) || e) }); }

// design-canvas.jsx
try { (() => {
// DesignCanvas.jsx — Figma-ish design canvas wrapper
// Warm gray grid bg + Sections + Artboards + PostIt notes.
// Artboards are reorderable (grip-drag), deletable, labels/titles are
// inline-editable, and any artboard can be opened in a fullscreen focus
// overlay (←/→/Esc). State persists to a .design-canvas.state.json sidecar
// via the host bridge. No assets, no deps.
//
// Usage:
//   <DesignCanvas>
//     <DCSection id="onboarding" title="Onboarding" subtitle="First-run variants">
//       <DCArtboard id="a" label="A · Dusk" width={260} height={480}>…</DCArtboard>
//       <DCArtboard id="b" label="B · Minimal" width={260} height={480}>…</DCArtboard>
//     </DCSection>
//   </DesignCanvas>

const DC = {
  bg: '#f0eee9',
  grid: 'rgba(0,0,0,0.06)',
  label: 'rgba(60,50,40,0.7)',
  title: 'rgba(40,30,20,0.85)',
  subtitle: 'rgba(60,50,40,0.6)',
  postitBg: '#fef4a8',
  postitText: '#5a4a2a',
  font: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
};

// One-time CSS injection (classes are dc-prefixed so they don't collide with
// the hosted design's own styles).
if (typeof document !== 'undefined' && !document.getElementById('dc-styles')) {
  const s = document.createElement('style');
  s.id = 'dc-styles';
  s.textContent = ['.dc-editable{cursor:text;outline:none;white-space:nowrap;border-radius:3px;padding:0 2px;margin:0 -2px}', '.dc-editable:focus{background:#fff;box-shadow:0 0 0 1.5px #c96442}', '[data-dc-slot]{transition:transform .18s cubic-bezier(.2,.7,.3,1)}', '[data-dc-slot].dc-dragging{transition:none;z-index:10;pointer-events:none}', '[data-dc-slot].dc-dragging .dc-card{box-shadow:0 12px 40px rgba(0,0,0,.25),0 0 0 2px #c96442;transform:scale(1.02)}',
  // isolation:isolate contains artboard content's z-indexes so a
  // z-indexed child (sticky navbar etc.) can't paint over .dc-header or
  // the .dc-menu popover that drops into the top of the card.
  '.dc-card{isolation:isolate;transition:box-shadow .15s,transform .15s}', '.dc-card *{scrollbar-width:none}', '.dc-card *::-webkit-scrollbar{display:none}',
  // Per-artboard header: grip + label on the left, delete/expand on the
  // right. Single flex row; when the artboard's on-screen width is too
  // narrow for both the label yields (ellipsis, then hidden entirely below
  // ~4ch via the container query) and the buttons stay on the row.
  '.dc-header{position:absolute;bottom:100%;left:-4px;margin-bottom:calc(4px * var(--dc-inv-zoom,1));z-index:2;', '  display:flex;align-items:center;container-type:inline-size}', '.dc-labelrow{display:flex;align-items:center;gap:4px;height:24px;flex:1 1 auto;min-width:0}', '.dc-grip{flex:0 0 auto;cursor:grab;display:flex;align-items:center;padding:5px 4px;border-radius:4px;transition:background .12s,opacity .12s}', '.dc-grip:hover{background:rgba(0,0,0,.08)}', '.dc-grip:active{cursor:grabbing}', '.dc-labeltext{flex:1 1 auto;min-width:0;cursor:pointer;border-radius:4px;padding:3px 6px;', '  display:flex;align-items:center;transition:background .12s;overflow:hidden}',
  // Below ~4ch of label room: hide the label entirely, and drop the grip to
  // hover-only (same reveal rule as .dc-btns) so a narrow header is clean
  // until the card is moused.
  '@container (max-width: 110px){', '  .dc-labeltext{display:none}', '  .dc-grip{opacity:0}', '  [data-dc-slot]:hover .dc-grip{opacity:1}', '}', '.dc-labeltext:hover{background:rgba(0,0,0,.05)}', '.dc-labeltext .dc-editable{overflow:hidden;text-overflow:ellipsis;max-width:100%}', '.dc-labeltext .dc-editable:focus{overflow:visible;text-overflow:clip}', '.dc-btns{flex:0 0 auto;margin-left:auto;display:flex;gap:2px;opacity:0;transition:opacity .12s}', '[data-dc-slot]:hover .dc-btns,.dc-btns:has(.dc-menu){opacity:1}', '.dc-expand,.dc-kebab{width:22px;height:22px;border-radius:5px;border:none;cursor:pointer;padding:0;', '  background:transparent;color:rgba(60,50,40,.7);display:flex;align-items:center;justify-content:center;', '  font:inherit;transition:background .12s,color .12s}', '.dc-expand:hover,.dc-kebab:hover{background:rgba(0,0,0,.06);color:#2a251f}',
  // Slot hosting an open menu floats above later siblings (which otherwise
  // paint on top — same z-index:auto, later DOM order) so the popup isn't
  // clipped by the next card.
  '[data-dc-slot]:has(.dc-menu){z-index:10}', '.dc-menu{position:absolute;top:100%;right:0;margin-top:4px;background:#fff;border-radius:8px;', '  box-shadow:0 8px 28px rgba(0,0,0,.18),0 0 0 1px rgba(0,0,0,.05);padding:4px;min-width:160px;z-index:10}', '.dc-menu button{display:block;width:100%;padding:7px 10px;border:0;background:transparent;', '  border-radius:5px;font-family:inherit;font-size:13px;font-weight:500;line-height:1.2;', '  color:#29261b;cursor:pointer;text-align:left;transition:background .12s;white-space:nowrap}', '.dc-menu button:hover{background:rgba(0,0,0,.05)}', '.dc-menu hr{border:0;border-top:1px solid rgba(0,0,0,.08);margin:4px 2px}', '.dc-menu .dc-danger{color:#c96442}', '.dc-menu .dc-danger:hover{background:rgba(201,100,66,.1)}',
  // Chrome (titles / labels / buttons) counter-scales against the viewport
  // zoom so it stays a constant on-screen size. --dc-inv-zoom is set by
  // DCViewport on every transform update and inherits to all descendants —
  // any overlay inside the world (e.g. a TweaksPanel on an artboard) can use
  // it the same way.
  //
  // The header uses transform:scale (out-of-flow, so layout impact doesn't
  // matter) with its world-space width set to card-width / inv-zoom so that
  // after counter-scaling its on-screen width exactly matches the card's —
  // that's what lets the container query + text-overflow behave against the
  // card's visible edge at every zoom level.
  //
  // The section head uses CSS zoom instead of transform so its layout box
  // grows with the counter-scale, pushing the card row down — otherwise the
  // constant-screen-size title would overflow into the (shrinking) world-
  // space gap and overlap the artboard headers at low zoom.
  '.dc-header{width:calc((100% + 4px) / var(--dc-inv-zoom,1));', '  transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom left}', '.dc-sectionhead{zoom:var(--dc-inv-zoom,1)}'].join('\n');
  document.head.appendChild(s);
}
const DCCtx = React.createContext(null);

// ─────────────────────────────────────────────────────────────
// DesignCanvas — stateful wrapper around the pan/zoom viewport.
// Owns runtime state (per-section order, renamed titles/labels, hidden
// artboards, focused artboard). Order/titles/labels/hidden persist to a
// .design-canvas.state.json
// sidecar next to the HTML. Reads go via plain fetch() so the saved
// arrangement is visible anywhere the HTML + sidecar are served together
// (omelette preview, direct link, downloaded zip). Writes go through the
// host's window.omelette bridge — editing requires the omelette runtime.
// Focus is ephemeral.
// ─────────────────────────────────────────────────────────────
const DC_STATE_FILE = '.design-canvas.state.json';
function DesignCanvas({
  children,
  minScale,
  maxScale,
  style
}) {
  const [state, setState] = React.useState({
    sections: {},
    focus: null
  });
  // Hold rendering until the sidecar read settles so the saved order/titles
  // appear on first paint (no source-order flash). didRead gates writes until
  // the read settles so the empty initial state can't clobber a slow read;
  // skipNextWrite suppresses the one echo-write that would otherwise follow
  // hydration.
  const [ready, setReady] = React.useState(false);
  const didRead = React.useRef(false);
  const skipNextWrite = React.useRef(false);
  React.useEffect(() => {
    let off = false;
    fetch('./' + DC_STATE_FILE).then(r => r.ok ? r.json() : null).then(saved => {
      if (off || !saved || !saved.sections) return;
      skipNextWrite.current = true;
      setState(s => ({
        ...s,
        sections: saved.sections
      }));
    }).catch(() => {}).finally(() => {
      didRead.current = true;
      if (!off) setReady(true);
    });
    const t = setTimeout(() => {
      if (!off) setReady(true);
    }, 150);
    return () => {
      off = true;
      clearTimeout(t);
    };
  }, []);
  React.useEffect(() => {
    if (!didRead.current) return;
    if (skipNextWrite.current) {
      skipNextWrite.current = false;
      return;
    }
    const t = setTimeout(() => {
      window.omelette?.writeFile(DC_STATE_FILE, JSON.stringify({
        sections: state.sections
      })).catch(() => {});
    }, 250);
    return () => clearTimeout(t);
  }, [state.sections]);

  // Build registries synchronously from children so FocusOverlay can read
  // them in the same render. Only direct DCSection > DCArtboard children are
  // walked — wrapping them in other elements opts out of focus/reorder.
  const registry = {}; // slotId -> { sectionId, artboard }
  const sectionMeta = {}; // sectionId -> { title, subtitle, slotIds[] }
  const sectionOrder = [];
  React.Children.forEach(children, sec => {
    if (!sec || sec.type !== DCSection) return;
    const sid = sec.props.id ?? sec.props.title;
    if (!sid) return;
    sectionOrder.push(sid);
    const persisted = state.sections[sid] || {};
    const abs = [];
    React.Children.forEach(sec.props.children, ab => {
      if (!ab || ab.type !== DCArtboard) return;
      const aid = ab.props.id ?? ab.props.label;
      if (aid) abs.push([aid, ab]);
    });
    // hidden is scoped to one source revision — when the agent regenerates
    // (artboard-ID set changes), prior deletes don't apply to new content.
    const srcKey = abs.map(([k]) => k).join('\x1f');
    const hidden = persisted.srcKey === srcKey ? persisted.hidden || [] : [];
    const srcIds = [];
    abs.forEach(([aid, ab]) => {
      if (hidden.includes(aid)) return;
      registry[`${sid}/${aid}`] = {
        sectionId: sid,
        artboard: ab
      };
      srcIds.push(aid);
    });
    const kept = (persisted.order || []).filter(k => srcIds.includes(k));
    sectionMeta[sid] = {
      title: persisted.title ?? sec.props.title,
      subtitle: sec.props.subtitle,
      slotIds: [...kept, ...srcIds.filter(k => !kept.includes(k))]
    };
  });
  const api = React.useMemo(() => ({
    state,
    section: id => state.sections[id] || {},
    patchSection: (id, p) => setState(s => ({
      ...s,
      sections: {
        ...s.sections,
        [id]: {
          ...s.sections[id],
          ...(typeof p === 'function' ? p(s.sections[id] || {}) : p)
        }
      }
    })),
    setFocus: slotId => setState(s => ({
      ...s,
      focus: slotId
    }))
  }), [state]);

  // Esc exits focus; any outside pointerdown commits an in-progress rename.
  React.useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') api.setFocus(null);
    };
    const onPd = e => {
      const ae = document.activeElement;
      if (ae && ae.isContentEditable && !ae.contains(e.target)) ae.blur();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPd, true);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPd, true);
    };
  }, [api]);
  return /*#__PURE__*/React.createElement(DCCtx.Provider, {
    value: api
  }, /*#__PURE__*/React.createElement(DCViewport, {
    minScale: minScale,
    maxScale: maxScale,
    style: style
  }, ready && children), state.focus && registry[state.focus] && /*#__PURE__*/React.createElement(DCFocusOverlay, {
    entry: registry[state.focus],
    sectionMeta: sectionMeta,
    sectionOrder: sectionOrder
  }));
}

// ─────────────────────────────────────────────────────────────
// DCViewport — transform-based pan/zoom (internal)
//
// Input mapping (Figma-style):
//   • trackpad pinch  → zoom   (ctrlKey wheel; Safari gesture* events)
//   • trackpad scroll → pan    (two-finger)
//   • mouse wheel     → zoom   (notched; distinguished from trackpad scroll)
//   • middle-drag / primary-drag-on-bg → pan
//
// Transform state lives in a ref and is written straight to the DOM
// (translate3d + will-change) so wheel ticks don't go through React —
// keeps pans at 60fps on dense canvases.
// ─────────────────────────────────────────────────────────────
function DCViewport({
  children,
  minScale = 0.1,
  maxScale = 8,
  style = {}
}) {
  const vpRef = React.useRef(null);
  const worldRef = React.useRef(null);
  const tf = React.useRef({
    x: 0,
    y: 0,
    scale: 1
  });
  // Persist viewport across reloads so the user lands back where they were
  // after an agent edit or browser refresh. The sandbox origin is already
  // per-project; pathname keeps multiple canvas files in one project apart.
  const tfKey = 'dc-viewport:' + location.pathname;
  const saveT = React.useRef(0);
  const lastPostedScale = React.useRef();
  const apply = React.useCallback(() => {
    const {
      x,
      y,
      scale
    } = tf.current;
    const el = worldRef.current;
    if (!el) return;
    el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    // Exposed for zoom-invariant chrome (labels, buttons, TweaksPanel).
    el.style.setProperty('--dc-inv-zoom', String(1 / scale));
    // Keep the host toolbar's % readout in sync with the canvas scale. Pan
    // ticks leave scale unchanged — skip the cross-frame post for those.
    if (lastPostedScale.current !== scale) {
      lastPostedScale.current = scale;
      window.parent.postMessage({
        type: '__dc_zoom',
        scale
      }, '*');
    }
    clearTimeout(saveT.current);
    saveT.current = setTimeout(() => {
      try {
        localStorage.setItem(tfKey, JSON.stringify(tf.current));
      } catch {}
    }, 200);
  }, [tfKey]);
  React.useLayoutEffect(() => {
    const flush = () => {
      clearTimeout(saveT.current);
      try {
        localStorage.setItem(tfKey, JSON.stringify(tf.current));
      } catch {}
    };
    try {
      const s = JSON.parse(localStorage.getItem(tfKey) || 'null');
      if (s && Number.isFinite(s.x) && Number.isFinite(s.y) && Number.isFinite(s.scale)) {
        tf.current = {
          x: s.x,
          y: s.y,
          scale: Math.min(maxScale, Math.max(minScale, s.scale))
        };
        apply();
      }
    } catch {}
    // Flush on pagehide and unmount so a reload within the 200ms debounce
    // window doesn't drop the last pan/zoom.
    window.addEventListener('pagehide', flush);
    return () => {
      window.removeEventListener('pagehide', flush);
      flush();
    };
  }, []);
  React.useEffect(() => {
    const vp = vpRef.current;
    if (!vp) return;
    const zoomAt = (cx, cy, factor) => {
      const r = vp.getBoundingClientRect();
      const px = cx - r.left,
        py = cy - r.top;
      const t = tf.current;
      const next = Math.min(maxScale, Math.max(minScale, t.scale * factor));
      const k = next / t.scale;
      // keep the world point under the cursor fixed
      t.x = px - (px - t.x) * k;
      t.y = py - (py - t.y) * k;
      t.scale = next;
      apply();
    };

    // Mouse-wheel vs trackpad-scroll heuristic. A physical wheel sends
    // line-mode deltas (Firefox) or large integer pixel deltas with no X
    // component (Chrome/Safari, typically multiples of 100/120). Trackpad
    // two-finger scroll sends small/fractional pixel deltas, often with
    // non-zero deltaX. ctrlKey is set by the browser for trackpad pinch.
    const isMouseWheel = e => e.deltaMode !== 0 || e.deltaX === 0 && Number.isInteger(e.deltaY) && Math.abs(e.deltaY) >= 40;
    const onWheel = e => {
      e.preventDefault();
      if (isGesturing) return; // Safari: gesture* owns the pinch — discard concurrent wheels
      if ((e.ctrlKey || e.metaKey) && !isMouseWheel(e)) {
        // trackpad pinch, or ctrl/cmd + smooth-scroll mouse. Notched
        // wheels fall through to the fixed-step branch below.
        zoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * 0.01));
      } else if (isMouseWheel(e)) {
        // notched mouse wheel — fixed-ratio step per click
        zoomAt(e.clientX, e.clientY, Math.exp(-Math.sign(e.deltaY) * 0.18));
      } else {
        // trackpad two-finger scroll — pan
        tf.current.x -= e.deltaX;
        tf.current.y -= e.deltaY;
        apply();
      }
    };

    // Safari sends native gesture* events for trackpad pinch with a smooth
    // e.scale; preferring these over the ctrl+wheel fallback gives a much
    // better feel there. No-ops on other browsers. Safari also fires
    // ctrlKey wheel events during the same pinch — isGesturing makes
    // onWheel drop those entirely so they neither zoom nor pan.
    let gsBase = 1;
    let isGesturing = false;
    const onGestureStart = e => {
      e.preventDefault();
      isGesturing = true;
      gsBase = tf.current.scale;
    };
    const onGestureChange = e => {
      e.preventDefault();
      zoomAt(e.clientX, e.clientY, gsBase * e.scale / tf.current.scale);
    };
    const onGestureEnd = e => {
      e.preventDefault();
      isGesturing = false;
    };

    // Drag-pan: middle button anywhere, or primary button on canvas
    // background (anything that isn't an artboard or an inline editor).
    let drag = null;
    const onPointerDown = e => {
      const onBg = !e.target.closest('[data-dc-slot], .dc-editable');
      if (!(e.button === 1 || e.button === 0 && onBg)) return;
      e.preventDefault();
      vp.setPointerCapture(e.pointerId);
      drag = {
        id: e.pointerId,
        lx: e.clientX,
        ly: e.clientY
      };
      vp.style.cursor = 'grabbing';
    };
    const onPointerMove = e => {
      if (!drag || e.pointerId !== drag.id) return;
      tf.current.x += e.clientX - drag.lx;
      tf.current.y += e.clientY - drag.ly;
      drag.lx = e.clientX;
      drag.ly = e.clientY;
      apply();
    };
    const onPointerUp = e => {
      if (!drag || e.pointerId !== drag.id) return;
      vp.releasePointerCapture(e.pointerId);
      drag = null;
      vp.style.cursor = '';
    };

    // Host-driven zoom (toolbar % menu). Zooms around viewport centre so the
    // visible midpoint stays fixed — matching the host's iframe-zoom feel.
    const onHostMsg = e => {
      const d = e.data;
      if (d && d.type === '__dc_set_zoom' && typeof d.scale === 'number') {
        const r = vp.getBoundingClientRect();
        zoomAt(r.left + r.width / 2, r.top + r.height / 2, d.scale / tf.current.scale);
      } else if (d && d.type === '__dc_probe') {
        // Host's [readyGen] reset asks whether a canvas is present; it
        // fires on the iframe's native 'load', which for canvases with
        // images/fonts is after our mount-time announce, so re-announce.
        // Clear the pan-tick guard so apply() re-posts the current scale
        // even if it's unchanged — the host just reset dcScale to 1.
        window.parent.postMessage({
          type: '__dc_present'
        }, '*');
        lastPostedScale.current = undefined;
        apply();
      }
    };
    window.addEventListener('message', onHostMsg);
    // Announce canvas mode so the host toolbar proxies its % control here
    // instead of scaling the iframe element (which would just shrink the
    // viewport window of an infinite canvas). The apply() that follows emits
    // the initial __dc_zoom so the toolbar % is correct before first pinch.
    // lastPostedScale reset mirrors the __dc_probe handler: the layout
    // effect's restore-path apply() may already have posted the restored
    // scale (before __dc_present), so clear the guard to re-post it in order.
    window.parent.postMessage({
      type: '__dc_present'
    }, '*');
    lastPostedScale.current = undefined;
    apply();
    vp.addEventListener('wheel', onWheel, {
      passive: false
    });
    vp.addEventListener('gesturestart', onGestureStart, {
      passive: false
    });
    vp.addEventListener('gesturechange', onGestureChange, {
      passive: false
    });
    vp.addEventListener('gestureend', onGestureEnd, {
      passive: false
    });
    vp.addEventListener('pointerdown', onPointerDown);
    vp.addEventListener('pointermove', onPointerMove);
    vp.addEventListener('pointerup', onPointerUp);
    vp.addEventListener('pointercancel', onPointerUp);
    return () => {
      window.removeEventListener('message', onHostMsg);
      vp.removeEventListener('wheel', onWheel);
      vp.removeEventListener('gesturestart', onGestureStart);
      vp.removeEventListener('gesturechange', onGestureChange);
      vp.removeEventListener('gestureend', onGestureEnd);
      vp.removeEventListener('pointerdown', onPointerDown);
      vp.removeEventListener('pointermove', onPointerMove);
      vp.removeEventListener('pointerup', onPointerUp);
      vp.removeEventListener('pointercancel', onPointerUp);
    };
  }, [apply, minScale, maxScale]);
  const gridSvg = `url("data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M120 0H0v120' fill='none' stroke='${encodeURIComponent(DC.grid)}' stroke-width='1'/%3E%3C/svg%3E")`;
  return /*#__PURE__*/React.createElement("div", {
    ref: vpRef,
    className: "design-canvas",
    style: {
      height: '100vh',
      width: '100vw',
      background: DC.bg,
      overflow: 'hidden',
      overscrollBehavior: 'none',
      touchAction: 'none',
      position: 'relative',
      fontFamily: DC.font,
      boxSizing: 'border-box',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: worldRef,
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      transformOrigin: '0 0',
      willChange: 'transform',
      width: 'max-content',
      minWidth: '100%',
      minHeight: '100%',
      padding: '60px 0 80px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: -6000,
      backgroundImage: gridSvg,
      backgroundSize: '120px 120px',
      pointerEvents: 'none',
      zIndex: -1
    }
  }), children));
}

// ─────────────────────────────────────────────────────────────
// DCSection — editable title + h-row of artboards in persisted order
// ─────────────────────────────────────────────────────────────
function DCSection({
  id,
  title,
  subtitle,
  children,
  gap = 48
}) {
  const ctx = React.useContext(DCCtx);
  const sid = id ?? title;
  const all = React.Children.toArray(children);
  const artboards = all.filter(c => c && c.type === DCArtboard);
  const rest = all.filter(c => !(c && c.type === DCArtboard));
  const sec = ctx && sid && ctx.section(sid) || {};
  // Must match DesignCanvas's srcKey computation exactly (it filters falsy
  // IDs), or onDelete persists a srcKey that DesignCanvas never recognizes.
  const allIds = artboards.map(a => a.props.id ?? a.props.label).filter(Boolean);
  const srcKey = allIds.join('\x1f');
  const hidden = sec.srcKey === srcKey ? sec.hidden || [] : [];
  const srcOrder = allIds.filter(k => !hidden.includes(k));
  const order = React.useMemo(() => {
    const kept = (sec.order || []).filter(k => srcOrder.includes(k));
    return [...kept, ...srcOrder.filter(k => !kept.includes(k))];
  }, [sec.order, srcOrder.join('|')]);
  const byId = Object.fromEntries(artboards.map(a => [a.props.id ?? a.props.label, a]));

  // marginBottom counter-scales so the on-screen gap between sections stays
  // constant — otherwise at low zoom the (world-space) gap collapses while
  // the screen-constant sectionhead below it doesn't, and the title reads as
  // belonging to the section above. paddingBottom below is just enough for
  // the 24px artboard-header (abs-positioned above each card) plus ~8px, so
  // the title sits tight against its own row at every zoom.
  return /*#__PURE__*/React.createElement("div", {
    "data-dc-section": sid,
    style: {
      marginBottom: 'calc(80px * var(--dc-inv-zoom, 1))',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 60px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-sectionhead",
    style: {
      paddingBottom: 36
    }
  }, /*#__PURE__*/React.createElement(DCEditable, {
    tag: "div",
    value: sec.title ?? title,
    onChange: v => ctx && sid && ctx.patchSection(sid, {
      title: v
    }),
    style: {
      fontSize: 28,
      fontWeight: 600,
      color: DC.title,
      letterSpacing: -0.4,
      marginBottom: 6,
      display: 'inline-block'
    }
  }), subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      color: DC.subtitle
    }
  }, subtitle))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap,
      padding: '0 60px',
      alignItems: 'flex-start',
      width: 'max-content'
    }
  }, order.map(k => /*#__PURE__*/React.createElement(DCArtboardFrame, {
    key: k,
    sectionId: sid,
    artboard: byId[k],
    order: order,
    label: (sec.labels || {})[k] ?? byId[k].props.label,
    onRename: v => ctx && ctx.patchSection(sid, x => ({
      labels: {
        ...x.labels,
        [k]: v
      }
    })),
    onReorder: next => ctx && ctx.patchSection(sid, {
      order: next
    }),
    onDelete: () => ctx && ctx.patchSection(sid, x => ({
      hidden: [...(x.srcKey === srcKey ? x.hidden || [] : []), k],
      srcKey
    })),
    onFocus: () => ctx && ctx.setFocus(`${sid}/${k}`)
  }))), rest);
}

// DCArtboard — marker; rendered by DCArtboardFrame via DCSection.
function DCArtboard() {
  return null;
}

// Per-artboard export (kind: 'png' | 'html'). Both paths share the same
// self-contained clone: computed styles baked in, @font-face / <img> /
// inline-style background-image urls inlined as data URIs. PNG wraps the
// clone in foreignObject→canvas at 3× the artboard's natural width×height
// (same pipeline the host uses for page captures); HTML wraps it in a
// minimal standalone document. Both are independent of viewport zoom.
async function dcExport(node, w, h, name, kind) {
  try {
    await document.fonts.ready;
  } catch {}
  const toDataURL = url => fetch(url).then(r => r.blob()).then(b => new Promise(res => {
    const fr = new FileReader();
    fr.onload = () => res(fr.result);
    fr.onerror = () => res(url);
    fr.readAsDataURL(b);
  })).catch(() => url);

  // Collect @font-face rules. ss.cssRules throws SecurityError on
  // cross-origin sheets (e.g. fonts.googleapis.com) — in that case fetch
  // the CSS text directly (those endpoints send ACAO:*) and regex-extract
  // the blocks. @import and @media/@supports are walked so nested
  // @font-face rules aren't missed.
  const fontRules = [],
    pending = [],
    seen = new Set();
  const scrapeCss = href => {
    if (seen.has(href)) return;
    seen.add(href);
    pending.push(fetch(href).then(r => r.text()).then(css => {
      for (const m of css.match(/@font-face\s*{[^}]*}/g) || []) fontRules.push({
        css: m,
        base: href
      });
      for (const m of css.matchAll(/@import\s+(?:url\()?['"]?([^'")\s;]+)/g)) scrapeCss(new URL(m[1], href).href);
    }).catch(() => {}));
  };
  const walk = (rules, base) => {
    for (const r of rules) {
      if (r.type === CSSRule.FONT_FACE_RULE) fontRules.push({
        css: r.cssText,
        base
      });else if (r.type === CSSRule.IMPORT_RULE && r.styleSheet) {
        const ibase = r.styleSheet.href || base;
        try {
          walk(r.styleSheet.cssRules, ibase);
        } catch {
          scrapeCss(ibase);
        }
      } else if (r.cssRules) walk(r.cssRules, base);
    }
  };
  for (const ss of document.styleSheets) {
    const base = ss.href || location.href;
    try {
      walk(ss.cssRules, base);
    } catch {
      if (ss.href) scrapeCss(ss.href);
    }
  }
  while (pending.length) await pending.shift();
  const fontCss = (await Promise.all(fontRules.map(async rule => {
    let out = rule.css,
      m;
    const re = /url\((['"]?)([^'")]+)\1\)/g;
    while (m = re.exec(rule.css)) {
      if (m[2].indexOf('data:') === 0) continue;
      let abs;
      try {
        abs = new URL(m[2], rule.base).href;
      } catch {
        continue;
      }
      out = out.split(m[0]).join('url("' + (await toDataURL(abs)) + '")');
    }
    return out;
  }))).join('\n');
  const cloneStyled = src => {
    if (src.nodeType === 8 || src.nodeType === 1 && src.tagName === 'SCRIPT') return document.createTextNode('');
    const dst = src.cloneNode(false);
    if (src.nodeType === 1) {
      const cs = getComputedStyle(src);
      let txt = '';
      for (let i = 0; i < cs.length; i++) txt += cs[i] + ':' + cs.getPropertyValue(cs[i]) + ';';
      dst.setAttribute('style', txt + 'animation:none;transition:none;');
      if (src.tagName === 'CANVAS') try {
        const im = document.createElement('img');
        im.src = src.toDataURL();
        im.setAttribute('style', txt);
        return im;
      } catch {}
    }
    for (let c = src.firstChild; c; c = c.nextSibling) dst.appendChild(cloneStyled(c));
    return dst;
  };
  const clone = cloneStyled(node);
  clone.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
  // Drop the card's own shadow/radius so the export is a flush w×h rect;
  // the artboard's own background (if any) is already in the computed style.
  clone.style.boxShadow = 'none';
  clone.style.borderRadius = '0';
  const jobs = [];
  clone.querySelectorAll('img').forEach(el => {
    const s = el.getAttribute('src');
    if (s && s.indexOf('data:') !== 0) jobs.push(toDataURL(el.src).then(d => el.setAttribute('src', d)));
  });
  [clone, ...clone.querySelectorAll('*')].forEach(el => {
    const bg = el.style.backgroundImage;
    if (!bg) return;
    let m;
    const re = /url\(["']?([^"')]+)["']?\)/g;
    while (m = re.exec(bg)) {
      const tok = m[0],
        url = m[1];
      if (url.indexOf('data:') === 0) continue;
      jobs.push(toDataURL(url).then(d => {
        el.style.backgroundImage = el.style.backgroundImage.split(tok).join('url("' + d + '")');
      }));
    }
  });
  await Promise.all(jobs);
  const xml = new XMLSerializer().serializeToString(clone);
  const save = (blob, ext) => {
    if (!blob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name + '.' + ext;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  if (kind === 'html') {
    const html = '<!doctype html><html><head><meta charset="utf-8"><title>' + name + '</title>' + (fontCss ? '<style>' + fontCss + '</style>' : '') + '</head><body style="margin:0">' + xml + '</body></html>';
    return save(new Blob([html], {
      type: 'text/html'
    }), 'html');
  }

  // PNG: the SVG's own width/height must be the output resolution — an
  // <img>-loaded SVG rasterizes at its intrinsic size, so sizing it at 1×
  // and ctx.scale()-ing up would just upscale a 1× bitmap. viewBox maps the
  // w×h foreignObject onto the px·w × px·h SVG canvas so the browser renders
  // the HTML at full resolution.
  const px = 3;
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + w * px + '" height="' + h * px + '" viewBox="0 0 ' + w + ' ' + h + '"><foreignObject width="' + w + '" height="' + h + '">' + (fontCss ? '<style><![CDATA[' + fontCss + ']]></style>' : '') + xml + '</foreignObject></svg>';
  const img = new Image();
  await new Promise((res, rej) => {
    img.onload = res;
    img.onerror = () => rej(new Error('svg load failed'));
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  });
  const cv = document.createElement('canvas');
  cv.width = w * px;
  cv.height = h * px;
  cv.getContext('2d').drawImage(img, 0, 0);
  cv.toBlob(blob => save(blob, 'png'), 'image/png');
}
function DCArtboardFrame({
  sectionId,
  artboard,
  label,
  order,
  onRename,
  onReorder,
  onFocus,
  onDelete
}) {
  const {
    id: rawId,
    label: rawLabel,
    width = 260,
    height = 480,
    children,
    style = {}
  } = artboard.props;
  const id = rawId ?? rawLabel;
  const ref = React.useRef(null);
  const cardRef = React.useRef(null);
  const menuRef = React.useRef(null);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [confirming, setConfirming] = React.useState(false);

  // ⋯ menu: close on any outside pointerdown. Two-click delete lives inside
  // the menu — first click arms the row, second commits; closing disarms.
  React.useEffect(() => {
    if (!menuOpen) {
      setConfirming(false);
      return;
    }
    const off = e => {
      if (!menuRef.current || !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('pointerdown', off, true);
    return () => document.removeEventListener('pointerdown', off, true);
  }, [menuOpen]);
  const doExport = kind => {
    setMenuOpen(false);
    if (!cardRef.current) return;
    const name = String(label || id || 'artboard').replace(/[^\w\s.-]+/g, '_');
    dcExport(cardRef.current, width, height, name, kind).catch(e => console.error('[design-canvas] export failed:', e));
  };

  // Live drag-reorder: dragged card sticks to cursor; siblings slide into
  // their would-be slots in real time via transforms. DOM order only
  // changes on drop.
  const onGripDown = e => {
    e.preventDefault();
    e.stopPropagation();
    const me = ref.current;
    // translateX is applied in local (pre-scale) space but pointer deltas and
    // getBoundingClientRect().left are screen-space — divide by the viewport's
    // current scale so the dragged card tracks the cursor at any zoom level.
    const scale = me.getBoundingClientRect().width / me.offsetWidth || 1;
    const peers = Array.from(document.querySelectorAll(`[data-dc-section="${sectionId}"] [data-dc-slot]`));
    const homes = peers.map(el => ({
      el,
      id: el.dataset.dcSlot,
      x: el.getBoundingClientRect().left
    }));
    const slotXs = homes.map(h => h.x);
    const startIdx = order.indexOf(id);
    const startX = e.clientX;
    let liveOrder = order.slice();
    me.classList.add('dc-dragging');
    const layout = () => {
      for (const h of homes) {
        if (h.id === id) continue;
        const slot = liveOrder.indexOf(h.id);
        h.el.style.transform = `translateX(${(slotXs[slot] - h.x) / scale}px)`;
      }
    };
    const move = ev => {
      const dx = ev.clientX - startX;
      me.style.transform = `translateX(${dx / scale}px)`;
      const cur = homes[startIdx].x + dx;
      let nearest = 0,
        best = Infinity;
      for (let i = 0; i < slotXs.length; i++) {
        const d = Math.abs(slotXs[i] - cur);
        if (d < best) {
          best = d;
          nearest = i;
        }
      }
      if (liveOrder.indexOf(id) !== nearest) {
        liveOrder = order.filter(k => k !== id);
        liveOrder.splice(nearest, 0, id);
        layout();
      }
    };
    const up = () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
      const finalSlot = liveOrder.indexOf(id);
      me.classList.remove('dc-dragging');
      me.style.transform = `translateX(${(slotXs[finalSlot] - homes[startIdx].x) / scale}px)`;
      // After the settle transition, kill transitions + clear transforms +
      // commit the reorder in the same frame so there's no visual snap-back.
      setTimeout(() => {
        for (const h of homes) {
          h.el.style.transition = 'none';
          h.el.style.transform = '';
        }
        if (liveOrder.join('|') !== order.join('|')) onReorder(liveOrder);
        requestAnimationFrame(() => requestAnimationFrame(() => {
          for (const h of homes) h.el.style.transition = '';
        }));
      }, 180);
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    "data-dc-slot": id,
    style: {
      position: 'relative',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-header",
    style: {
      color: DC.label
    },
    onPointerDown: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-labelrow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-grip",
    onPointerDown: onGripDown,
    title: "Drag to reorder"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "9",
    height: "13",
    viewBox: "0 0 9 13",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "2",
    cy: "2",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "2",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "2",
    cy: "6.5",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "6.5",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "2",
    cy: "11",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "11",
    r: "1.1"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "dc-labeltext",
    onClick: onFocus,
    title: "Click to focus"
  }, /*#__PURE__*/React.createElement(DCEditable, {
    value: label,
    onChange: onRename,
    onClick: e => e.stopPropagation(),
    style: {
      fontSize: 15,
      fontWeight: 500,
      color: DC.label,
      lineHeight: 1
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "dc-btns"
  }, /*#__PURE__*/React.createElement("div", {
    ref: menuRef,
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "dc-kebab",
    title: "More",
    onClick: () => setMenuOpen(o => !o)
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "2.5",
    cy: "6",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "6",
    cy: "6",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "9.5",
    cy: "6",
    r: "1.1"
  }))), menuOpen && /*#__PURE__*/React.createElement("div", {
    className: "dc-menu",
    onPointerDown: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => doExport('png')
  }, "Download PNG"), /*#__PURE__*/React.createElement("button", {
    onClick: () => doExport('html')
  }, "Download HTML"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("button", {
    className: "dc-danger",
    onClick: () => {
      if (confirming) {
        setMenuOpen(false);
        onDelete();
      } else setConfirming(true);
    }
  }, confirming ? 'Click again to delete' : 'Delete'))), /*#__PURE__*/React.createElement("button", {
    className: "dc-expand",
    onClick: onFocus,
    title: "Focus"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M7 1h4v4M5 11H1V7M11 1L7.5 4.5M1 11l3.5-3.5"
  }))))), /*#__PURE__*/React.createElement("div", {
    ref: cardRef,
    className: "dc-card",
    style: {
      borderRadius: 2,
      boxShadow: '0 1px 3px rgba(0,0,0,.08),0 4px 16px rgba(0,0,0,.06)',
      overflow: 'hidden',
      width,
      height,
      background: '#fff',
      ...style
    }
  }, children || /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#bbb',
      fontSize: 13,
      fontFamily: DC.font
    }
  }, id)));
}

// Inline rename — commits on blur or Enter.
function DCEditable({
  value,
  onChange,
  style,
  tag = 'span',
  onClick
}) {
  const T = tag;
  return /*#__PURE__*/React.createElement(T, {
    className: "dc-editable",
    contentEditable: true,
    suppressContentEditableWarning: true,
    onClick: onClick,
    onPointerDown: e => e.stopPropagation(),
    onBlur: e => onChange && onChange(e.currentTarget.textContent),
    onKeyDown: e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.currentTarget.blur();
      }
    },
    style: style
  }, value);
}

// ─────────────────────────────────────────────────────────────
// Focus mode — overlay one artboard; ←/→ within section, ↑/↓ across
// sections, Esc or backdrop click to exit.
// ─────────────────────────────────────────────────────────────
function DCFocusOverlay({
  entry,
  sectionMeta,
  sectionOrder
}) {
  const ctx = React.useContext(DCCtx);
  const {
    sectionId,
    artboard
  } = entry;
  const sec = ctx.section(sectionId);
  const meta = sectionMeta[sectionId];
  const peers = meta.slotIds;
  const aid = artboard.props.id ?? artboard.props.label;
  const idx = peers.indexOf(aid);
  const secIdx = sectionOrder.indexOf(sectionId);
  const go = d => {
    const n = peers[(idx + d + peers.length) % peers.length];
    if (n) ctx.setFocus(`${sectionId}/${n}`);
  };
  const goSection = d => {
    // Sections whose artboards are all deleted have slotIds:[] — step past
    // them to the next non-empty section so ↑/↓ doesn't dead-end.
    const n = sectionOrder.length;
    for (let i = 1; i < n; i++) {
      const ns = sectionOrder[((secIdx + d * i) % n + n) % n];
      const first = sectionMeta[ns] && sectionMeta[ns].slotIds[0];
      if (first) {
        ctx.setFocus(`${ns}/${first}`);
        return;
      }
    }
  };
  React.useEffect(() => {
    const k = e => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        go(-1);
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        go(1);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        goSection(-1);
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        goSection(1);
      }
    };
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  });
  const {
    width = 260,
    height = 480,
    children
  } = artboard.props;
  const [vp, setVp] = React.useState({
    w: window.innerWidth,
    h: window.innerHeight
  });
  React.useEffect(() => {
    const r = () => setVp({
      w: window.innerWidth,
      h: window.innerHeight
    });
    window.addEventListener('resize', r);
    return () => window.removeEventListener('resize', r);
  }, []);
  const scale = Math.max(0.1, Math.min((vp.w - 200) / width, (vp.h - 260) / height, 2));
  const [ddOpen, setDd] = React.useState(false);
  const Arrow = ({
    dir,
    onClick
  }) => /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      onClick();
    },
    style: {
      position: 'absolute',
      top: '50%',
      [dir]: 28,
      transform: 'translateY(-50%)',
      border: 'none',
      background: 'rgba(255,255,255,.08)',
      color: 'rgba(255,255,255,.9)',
      width: 44,
      height: 44,
      borderRadius: 22,
      fontSize: 18,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background .15s'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,.18)',
    onMouseLeave: e => e.currentTarget.style.background = 'rgba(255,255,255,.08)'
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 18 18",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: dir === 'left' ? 'M11 3L5 9l6 6' : 'M7 3l6 6-6 6'
  })));

  // Portal to body so position:fixed is the real viewport regardless of any
  // transform on DesignCanvas's ancestors (including the canvas zoom itself).
  return ReactDOM.createPortal(/*#__PURE__*/React.createElement("div", {
    onClick: () => ctx.setFocus(null),
    onWheel: e => e.preventDefault(),
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(24,20,16,.6)',
      backdropFilter: 'blur(14px)',
      fontFamily: DC.font,
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 72,
      display: 'flex',
      alignItems: 'flex-start',
      padding: '16px 20px 0',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setDd(o => !o),
    style: {
      border: 'none',
      background: 'transparent',
      color: '#fff',
      cursor: 'pointer',
      padding: '6px 8px',
      borderRadius: 6,
      textAlign: 'left',
      fontFamily: 'inherit'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18,
      fontWeight: 600,
      letterSpacing: -0.3
    }
  }, meta.title), /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 11 11",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    style: {
      opacity: .7
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2 4l3.5 3.5L9 4"
  }))), meta.subtitle && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 13,
      opacity: .6,
      fontWeight: 400,
      marginTop: 2
    }
  }, meta.subtitle)), ddOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '100%',
      left: 0,
      marginTop: 4,
      background: '#2a251f',
      borderRadius: 8,
      boxShadow: '0 8px 32px rgba(0,0,0,.4)',
      padding: 4,
      minWidth: 200,
      zIndex: 10
    }
  }, sectionOrder.filter(sid => sectionMeta[sid].slotIds.length).map(sid => /*#__PURE__*/React.createElement("button", {
    key: sid,
    onClick: () => {
      setDd(false);
      const f = sectionMeta[sid].slotIds[0];
      if (f) ctx.setFocus(`${sid}/${f}`);
    },
    style: {
      display: 'block',
      width: '100%',
      textAlign: 'left',
      border: 'none',
      cursor: 'pointer',
      background: sid === sectionId ? 'rgba(255,255,255,.1)' : 'transparent',
      color: '#fff',
      padding: '8px 12px',
      borderRadius: 5,
      fontSize: 14,
      fontWeight: sid === sectionId ? 600 : 400,
      fontFamily: 'inherit'
    }
  }, sectionMeta[sid].title)))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => ctx.setFocus(null),
    onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,.12)',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent',
    style: {
      border: 'none',
      background: 'transparent',
      color: 'rgba(255,255,255,.7)',
      width: 32,
      height: 32,
      borderRadius: 16,
      fontSize: 20,
      cursor: 'pointer',
      lineHeight: 1,
      transition: 'background .12s'
    }
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 64,
      bottom: 56,
      left: 100,
      right: 100,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: width * scale,
      height: height * scale,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      height,
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      background: '#fff',
      borderRadius: 2,
      overflow: 'hidden',
      boxShadow: '0 20px 80px rgba(0,0,0,.4)'
    }
  }, children || /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#bbb'
    }
  }, aid))), /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      fontSize: 14,
      fontWeight: 500,
      opacity: .85,
      textAlign: 'center'
    }
  }, (sec.labels || {})[aid] ?? artboard.props.label, /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: .5,
      marginLeft: 10,
      fontVariantNumeric: 'tabular-nums'
    }
  }, idx + 1, " / ", peers.length))), /*#__PURE__*/React.createElement(Arrow, {
    dir: "left",
    onClick: () => go(-1)
  }), /*#__PURE__*/React.createElement(Arrow, {
    dir: "right",
    onClick: () => go(1)
  }), /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: 'absolute',
      bottom: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: 8
    }
  }, peers.map((p, i) => /*#__PURE__*/React.createElement("button", {
    key: p,
    onClick: () => ctx.setFocus(`${sectionId}/${p}`),
    style: {
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      width: 6,
      height: 6,
      borderRadius: 3,
      background: i === idx ? '#fff' : 'rgba(255,255,255,.3)'
    }
  })))), document.body);
}

// ─────────────────────────────────────────────────────────────
// Post-it — absolute-positioned sticky note
// ─────────────────────────────────────────────────────────────
function DCPostIt({
  children,
  top,
  left,
  right,
  bottom,
  rotate = -2,
  width = 180
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top,
      left,
      right,
      bottom,
      width,
      background: DC.postitBg,
      padding: '14px 16px',
      fontFamily: '"Comic Sans MS", "Marker Felt", "Segoe Print", cursive',
      fontSize: 14,
      lineHeight: 1.4,
      color: DC.postitText,
      boxShadow: '0 2px 8px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
      transform: `rotate(${rotate}deg)`,
      zIndex: 5
    }
  }, children);
}
Object.assign(window, {
  DesignCanvas,
  DCSection,
  DCArtboard,
  DCPostIt
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "design-canvas.jsx", error: String((e && e.message) || e) }); }

// design-md/filter-bar.jsx
try { (() => {
// Filter Bar — full toolbar context with table backdrop, plus interactive demo.

const CUSTOMERS = ["Transload Trucking", "Hard Rock Industries LLC", "RF Heavy", "Truck Zone", "1st Auto Parts Ltd", "Partmaster Ltd", "Auckland Motors Mitsubishi", "Dodson Autospares", "Texas Truck And Auto Parts", "Repco Grey Lynn", "Segedin Truck And Auto Pa…"];
const STATUSES = ["Estimate", "Approved", "In progress", "Review", "Complete", "Invoiced", "Paid", "Declined", "Reported"];
const TECHS = ["Eleanor Pena", "Esther Howard", "Jenny Wilson", "Annette Black", "Leslie Alexander", "Floyd Miles", "Theresa Webb", "Ralph Edwards"];
const ADVISORS = ["Kathryn Murphy", "Kristin Watson", "Theresa Webb", "Eleanor Pena", "Jenny Wilson"];
const ASSETS = ["Yes", "No"];

// Mini stub of a Work Orders table so the filter bar sits in real context
function TableBackdrop() {
  const rows = [{
    id: "S3-8412",
    est: "Estimate",
    est_color: "ok",
    cust: "Transload Trucking",
    asset: "Freightliner M2",
    vin: "1FD0W5HY2EEA05499",
    adv: "Esther Howard",
    tech: "Esther Howard",
    lines: 12,
    total: "$13,408.17"
  }, {
    id: "S3-3425",
    est: "Estimate",
    est_color: "ok",
    cust: "Hard Rock Industries LLC",
    asset: "—",
    vin: "1FD0W5HY2EEA05499",
    adv: "Theresa Webb",
    tech: "Ralph Edwards",
    lines: 14,
    total: "$2,321.53"
  }, {
    id: "S3-8554",
    est: "Estimate",
    est_color: "ok",
    cust: "RF Heavy",
    asset: "—",
    vin: "1FD0W5HY2EEA05499",
    adv: "Ralph Edwards",
    tech: "Jenny Wilson",
    lines: 10,
    total: "$5,932.32"
  }, {
    id: "S3-8423",
    est: "Estimate",
    est_color: "err",
    cust: "Truck Zone",
    asset: "—",
    vin: "1FD0W5HY2EEA05499",
    adv: "Annette Black",
    tech: "Leslie Alexander",
    lines: 5,
    total: "$48,013.11"
  }, {
    id: "S3-9665",
    est: "Estimate",
    est_color: "ok",
    cust: "1st Auto Parts Ltd",
    asset: "—",
    vin: "1FD0W5HY2EEA05499",
    adv: "Jenny Wilson",
    tech: "Kristin Watson",
    lines: 3,
    total: "$15,182.32"
  }, {
    id: "S3-1345",
    est: "Declined",
    est_color: "err",
    cust: "Partmaster Ltd",
    asset: "—",
    vin: "1FD0W5HY2EEA05499",
    adv: "Eleanor Pena",
    tech: "Esther Howard",
    lines: 2,
    total: "$13,199.51"
  }, {
    id: "S3-5234",
    est: "Estimate",
    est_color: "ok",
    cust: "Auckland Motors Mitsubishi",
    asset: "—",
    vin: "1FD0W5HY2EEA05499",
    adv: "Leslie Alexander",
    tech: "Theresa Webb",
    lines: 12,
    total: "$10,075.14"
  }, {
    id: "S3-9574",
    est: "Estimate",
    est_color: "err",
    cust: "Dodson Autospares",
    asset: "—",
    vin: "1FD0W5HY2EEA05499",
    adv: "Floyd Miles",
    tech: "Ralph Edwards",
    lines: 7,
    total: "$242,212.07"
  }, {
    id: "S3-0937",
    est: "Estimate",
    est_color: "ok",
    cust: "Segedin Truck And Auto Pa…",
    asset: "—",
    vin: "1FD0W5HY2EEA05499",
    adv: "Kathryn Murphy",
    tech: "Annette Black",
    lines: 9,
    total: "$13,408.17"
  }, {
    id: "S3-3456",
    est: "Declined",
    est_color: "err",
    cust: "Repco Grey Lynn",
    asset: "—",
    vin: "1FD0W5HY2EEA05499",
    adv: "Kristin Watson",
    tech: "Jenny Wilson",
    lines: 7,
    total: "$10,075.14"
  }];
  const Th = ({
    children,
    w
  }) => /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "12px 16px",
      fontWeight: 500,
      fontSize: 12,
      color: "var(--sv-grey-500)",
      borderBottom: "1px solid var(--sv-grey-200)",
      whiteSpace: "nowrap",
      background: "white",
      width: w
    }
  }, children);
  const Td = ({
    children,
    align
  }) => /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "14px 16px",
      fontWeight: 500,
      fontSize: 14,
      color: "var(--sv-grey-900)",
      borderBottom: "1px solid var(--sv-grey-100)",
      textAlign: align || "left",
      whiteSpace: "nowrap"
    }
  }, children);
  const [hoverRow, setHoverRow] = React.useState(null);
  return /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse",
      fontFamily: "var(--sv-font-ui)"
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement(Th, {
    w: 56
  }, "On Site"), /*#__PURE__*/React.createElement(Th, {
    w: 120
  }), /*#__PURE__*/React.createElement(Th, null, "Number"), /*#__PURE__*/React.createElement(Th, null, "Customer"), /*#__PURE__*/React.createElement(Th, null, "Asset"), /*#__PURE__*/React.createElement(Th, null, "Unit"), /*#__PURE__*/React.createElement(Th, null, "VIN/Serial #"), /*#__PURE__*/React.createElement(Th, null, "Progress"), /*#__PURE__*/React.createElement(Th, null, "Service Advisor"), /*#__PURE__*/React.createElement(Th, null, "Lead Technician"), /*#__PURE__*/React.createElement(Th, null, "Lines"), /*#__PURE__*/React.createElement(Th, null, "Total Price"))), /*#__PURE__*/React.createElement("tbody", null, rows.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: i,
    onMouseEnter: () => setHoverRow(i),
    onMouseLeave: () => setHoverRow(null),
    style: {
      background: hoverRow === i ? "var(--sv-grey-50)" : "transparent",
      transition: "background-color 120ms ease-out"
    }
  }, /*#__PURE__*/React.createElement(Td, null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-grid",
      placeItems: "center",
      width: 24,
      height: 24,
      borderRadius: 6,
      background: r.est_color === "err" ? "var(--sv-error-50)" : "var(--sv-success-50)",
      color: r.est_color === "err" ? "var(--sv-error-500)" : "var(--sv-success-600)"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8 1.333L1.333 4.667v3.333c0 3.682 2.985 6.667 6.667 6.667s6.667-2.985 6.667-6.667V4.667L8 1.333z"
  })))), /*#__PURE__*/React.createElement(Td, null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      height: 22,
      padding: "0 10px",
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 600,
      background: r.est_color === "err" ? hoverRow === i ? "#FDE3DE" : "var(--sv-error-50)" : hoverRow === i ? "#CFE3FF" : "var(--sv-primary-50)",
      color: r.est_color === "err" ? "var(--sv-error-700)" : "var(--sv-primary-700)",
      border: `1px solid ${r.est_color === "err" ? "var(--sv-error-200)" : "var(--sv-primary-200)"}`,
      transition: "background-color 120ms ease-out",
      cursor: "pointer"
    }
  }, r.est)), /*#__PURE__*/React.createElement(Td, null, r.id), /*#__PURE__*/React.createElement(Td, null, r.cust), /*#__PURE__*/React.createElement(Td, null, r.asset), /*#__PURE__*/React.createElement(Td, null, "\u2014"), /*#__PURE__*/React.createElement(Td, null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--sv-grey-500)"
    }
  }, r.vin)), /*#__PURE__*/React.createElement(Td, null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-block",
      width: 64,
      height: 6,
      borderRadius: 999,
      background: "var(--sv-grey-100)",
      verticalAlign: "middle"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 8,
      color: "var(--sv-grey-500)",
      fontSize: 12
    }
  }, "0%")), /*#__PURE__*/React.createElement(Td, null, r.adv), /*#__PURE__*/React.createElement(Td, null, r.tech), /*#__PURE__*/React.createElement(Td, null, r.lines), /*#__PURE__*/React.createElement(Td, null, r.total)))));
}

// Anchored popover wrapper
function Popover({
  open,
  anchorRef,
  children,
  onClose,
  offset = 8
}) {
  const [pos, setPos] = React.useState(null);
  React.useLayoutEffect(() => {
    if (!open || !anchorRef.current) return;
    const r = anchorRef.current.getBoundingClientRect();
    const host = anchorRef.current.closest("[data-popover-host]");
    const h = host ? host.getBoundingClientRect() : {
      left: 0,
      top: 0
    };
    setPos({
      left: r.left - h.left,
      top: r.bottom - h.top + offset
    });
  }, [open]);
  React.useEffect(() => {
    if (!open) return;
    const onDoc = e => {
      if (anchorRef.current && anchorRef.current.contains(e.target)) return;
      const pop = document.getElementById("__open_popover");
      if (pop && pop.contains(e.target)) return;
      onClose && onClose();
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, onClose]);
  if (!open || !pos) return null;
  return /*#__PURE__*/React.createElement("div", {
    id: "__open_popover",
    style: {
      position: "absolute",
      left: pos.left,
      top: pos.top,
      zIndex: 10
    }
  }, children);
}

// Top-level filter bar
function FilterBar({
  filters,
  setFilters,
  allCleared = false
}) {
  const [open, setOpen] = React.useState(null); // which filter id is open
  const statusRef = React.useRef();
  const custRef = React.useRef();
  const techRef = React.useRef();
  const advRef = React.useRef();
  const assetRef = React.useRef();
  const setVal = (k, v) => setFilters({
    ...filters,
    [k]: v
  });
  const valueText = arr => {
    if (!arr || arr.length === 0) return null;
    if (arr.length === 1) return arr[0];
    return `${arr[0]}, +${arr.length - 1}`;
  };
  const items = [{
    id: "status",
    icon: SVIcons.ICON_LOAD,
    label: "Status",
    ref: statusRef,
    list: STATUSES,
    panel: "status"
  }, {
    id: "cust",
    icon: SVIcons.ICON_USER,
    label: "Customer",
    ref: custRef,
    list: CUSTOMERS,
    panel: "search"
  }, {
    id: "tech",
    icon: SVIcons.ICON_WRENCH,
    label: "Lead Technician",
    ref: techRef,
    list: TECHS,
    panel: "search"
  }, {
    id: "adv",
    icon: SVIcons.ICON_HEADSET,
    label: "Service Advisor",
    ref: advRef,
    list: ADVISORS,
    panel: "search"
  }, {
    id: "asset",
    icon: SVIcons.ICON_TRUCK,
    label: "Asset on site",
    ref: assetRef,
    list: ASSETS,
    panel: "status"
  }];
  const hasAny = Object.values(filters).some(v => v && v.length > 0);
  return /*#__PURE__*/React.createElement("div", {
    "data-popover-host": true,
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "8px 24px",
      height: 60
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 4
    }
  }, items.map(it => {
    const v = filters[it.id] || [];
    const has = v.length > 0;
    return /*#__PURE__*/React.createElement(FilterChip, {
      key: it.id,
      refEl: it.ref,
      icon: it.icon,
      label: it.label,
      state: open === it.id ? "open" : "default",
      hasValue: has,
      valueText: valueText(v),
      onClick: () => setOpen(open === it.id ? null : it.id),
      onClear: () => setVal(it.id, [])
    });
  })), hasAny && /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setFilters({});
      setOpen(null);
    },
    style: {
      all: "unset",
      cursor: "pointer",
      color: "var(--sv-primary-500)",
      fontWeight: 500,
      fontSize: 14,
      lineHeight: "20px",
      padding: "0 8px"
    }
  }, "Clear filters"), items.map(it => /*#__PURE__*/React.createElement(Popover, {
    key: it.id,
    open: open === it.id,
    anchorRef: it.ref,
    onClose: () => setOpen(null)
  }, it.panel === "status" ? /*#__PURE__*/React.createElement(StatusDropdown, {
    options: it.list,
    value: filters[it.id] || [],
    onChange: v => setVal(it.id, v),
    onClear: () => setVal(it.id, [])
  }) : /*#__PURE__*/React.createElement(FilterDropdown, {
    title: it.label,
    options: it.list,
    value: filters[it.id] || [],
    onChange: v => setVal(it.id, v),
    onClear: () => setVal(it.id, [])
  }))));
}

// Full page chrome (header + tabs + filter bar + table)
function WorkOrdersPage({
  initial = {},
  frozenOpen = null
}) {
  const [filters, setFilters] = React.useState(initial);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1440,
      height: 900,
      overflow: "hidden",
      background: "white",
      fontFamily: "var(--sv-font-ui)",
      display: "flex",
      flexDirection: "column",
      border: "1px solid var(--sv-grey-200)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 64,
      padding: "0 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottom: "1px solid var(--sv-grey-200)",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/symbol-primary.svg",
    alt: "Shopview",
    style: {
      width: 28,
      height: 28
    }
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      gap: 4
    }
  }, ["Work Orders", "Schedule", "Customers", "Parts", "Reports"].map((n, i) => /*#__PURE__*/React.createElement("span", {
    key: n,
    style: {
      padding: "8px 12px",
      borderRadius: 8,
      background: i === 0 ? "var(--sv-grey-100)" : "transparent",
      color: i === 0 ? "var(--sv-grey-900)" : "var(--sv-grey-500)",
      fontWeight: 500,
      fontSize: 14,
      cursor: "pointer"
    }
  }, n)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      width: 360,
      height: 36,
      padding: "0 12px",
      background: "var(--sv-grey-50)",
      borderRadius: 8,
      border: "1px solid var(--sv-grey-200)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--sv-grey-500)"
    }
  }, SVIcons.ICON_SEARCH), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      color: "var(--sv-grey-500)",
      fontSize: 14
    }
  }, "Search"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "var(--sv-grey-500)",
      padding: "2px 6px",
      border: "1px solid var(--sv-grey-200)",
      borderRadius: 4
    }
  }, "\u2318 K")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 500,
      color: "var(--sv-grey-700)"
    }
  }, "Heavy Duty"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 32,
      height: 32,
      borderRadius: "50%",
      background: "var(--sv-primary-100)",
      color: "var(--sv-primary-700)",
      display: "grid",
      placeItems: "center",
      fontWeight: 600,
      fontSize: 13
    }
  }, "HD"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      gap: 4
    }
  }, ["All", "Estimates", "Completed", "My Work Orders"].map((t, i) => /*#__PURE__*/React.createElement("span", {
    key: t,
    style: {
      padding: "8px 12px",
      borderRadius: 8,
      background: i === 0 ? "var(--sv-grey-100)" : "transparent",
      color: i === 0 ? "var(--sv-grey-900)" : "var(--sv-grey-500)",
      fontWeight: 500,
      fontSize: 14,
      cursor: "pointer"
    }
  }, t))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("button", {
    title: "Search",
    style: {
      all: "unset",
      cursor: "pointer",
      height: 36,
      padding: "0 12px",
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      borderRadius: 8,
      color: "var(--sv-grey-700)",
      fontWeight: 500,
      fontSize: 14
    },
    onMouseEnter: e => e.currentTarget.style.background = "var(--sv-grey-100)",
    onMouseLeave: e => e.currentTarget.style.background = "transparent"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/icon-search.svg",
    width: "20",
    height: "20",
    alt: ""
  }), "Search"), /*#__PURE__*/React.createElement("button", {
    title: "Toggle filters",
    style: {
      all: "unset",
      cursor: "pointer",
      width: 36,
      height: 36,
      display: "grid",
      placeItems: "center",
      borderRadius: 8,
      background: "var(--sv-grey-100)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/icon-filter-toggle.svg",
    width: "20",
    height: "20",
    alt: ""
  })), /*#__PURE__*/React.createElement("button", {
    title: "Columns",
    style: {
      all: "unset",
      cursor: "pointer",
      width: 36,
      height: 36,
      display: "grid",
      placeItems: "center",
      borderRadius: 8
    },
    onMouseEnter: e => e.currentTarget.style.background = "var(--sv-grey-100)",
    onMouseLeave: e => e.currentTarget.style.background = "transparent"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/icon-columns.svg",
    width: "20",
    height: "20",
    alt: ""
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8
    }
  }), /*#__PURE__*/React.createElement("button", {
    style: {
      all: "unset",
      cursor: "pointer",
      height: 36,
      padding: "0 16px",
      borderRadius: 8,
      background: "var(--sv-primary-500)",
      color: "white",
      fontWeight: 600,
      fontSize: 14
    }
  }, "New Work Order"))), /*#__PURE__*/React.createElement(FilterBar, {
    filters: filters,
    setFilters: setFilters
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: "var(--sv-grey-200)",
      flex: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: "auto",
      background: "white"
    }
  }, /*#__PURE__*/React.createElement(TableBackdrop, null)));
}
window.WorkOrdersPage = WorkOrdersPage;
window.FilterBar = FilterBar;
window.CUSTOMERS = CUSTOMERS;
window.STATUSES = STATUSES;
window.TECHS = TECHS;
window.ADVISORS = ADVISORS;
})(); } catch (e) { __ds_ns.__errors.push({ path: "design-md/filter-bar.jsx", error: String((e && e.message) || e) }); }

// design-md/filter-chip.jsx
try { (() => {
// Shopview Filter Chip — pill-style filter trigger that lives in a Filter Bar.
// States mirror the Figma source: Default, Hover, Selected (item picked), Empty‑selected (open + no items yet).

const ICON_LOAD = /*#__PURE__*/React.createElement("img", {
  src: "assets/icon-status.svg",
  width: "16",
  height: "16",
  alt: ""
});
const ICON_USER = /*#__PURE__*/React.createElement("img", {
  src: "assets/icon-customer.svg",
  width: "16",
  height: "16",
  alt: ""
});
const ICON_WRENCH = /*#__PURE__*/React.createElement("img", {
  src: "assets/icon-technician.svg",
  width: "16",
  height: "16",
  alt: ""
});
const ICON_HEADSET = /*#__PURE__*/React.createElement("img", {
  src: "assets/icon-advisor.svg",
  width: "16",
  height: "16",
  alt: ""
});
const ICON_TRUCK = /*#__PURE__*/React.createElement("img", {
  src: "assets/icon-asset.svg",
  width: "16",
  height: "16",
  alt: ""
});
const ICON_CHEVRON = /*#__PURE__*/React.createElement("svg", {
  width: "20",
  height: "20",
  viewBox: "0 0 20 20",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.67",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "M5 7.5L10 12.5L15 7.5"
}));
const ICON_XCIRCLE = /*#__PURE__*/React.createElement("svg", {
  width: "16",
  height: "16",
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.5",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("circle", {
  cx: "8",
  cy: "8",
  r: "6.667"
}), /*#__PURE__*/React.createElement("path", {
  d: "M10 6L6 10M6 6l4 4"
}));
const ICON_X = /*#__PURE__*/React.createElement("svg", {
  width: "14",
  height: "14",
  viewBox: "0 0 14 14",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.5",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "M10.5 3.5l-7 7M3.5 3.5l7 7"
}));
const ICON_SEARCH = /*#__PURE__*/React.createElement("svg", {
  width: "20",
  height: "20",
  viewBox: "0 0 20 20",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.67",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("circle", {
  cx: "9.167",
  cy: "9.167",
  r: "5.833"
}), /*#__PURE__*/React.createElement("path", {
  d: "M17.5 17.5l-4.167-4.167"
}));
const ICON_CHECK = /*#__PURE__*/React.createElement("svg", {
  width: "12",
  height: "12",
  viewBox: "0 0 12 12",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "M10 3L4.5 8.5L2 6"
}));
const ICON_BARS = /*#__PURE__*/React.createElement("svg", {
  width: "16",
  height: "16",
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.5",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "M3 4h10M3 8h10M3 12h10"
}));
const ICON_BACK = /*#__PURE__*/React.createElement("svg", {
  width: "20",
  height: "20",
  viewBox: "0 0 20 20",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.67",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "M12.5 5L7.5 10L12.5 15"
}));

// Filter chip — exact figma spec:
// 28px tall pill, radius 100, padding 0 10px, gap 8px between children
// Default: transparent bg, icon #364152, label Inter 500/14 #364152, chevron 20px
// Hover: bg #EEF2F6 (grey-100)
// Selected: bg #D8ECFF (primary-100), text + icon #257CFF (primary-500), chevron shown
// Selected + hover: chevron fades out, X-circle fades in over it for clear action
function FilterChip({
  icon,
  label,
  state = "default",
  onClick,
  hasValue = false,
  valueText,
  onClear,
  refEl
}) {
  const [hovered, setHovered] = React.useState(false);
  const isSelected = state === "selected" || hasValue;
  const isHover = state === "hover" || hovered;
  const isOpen = state === "open";
  const bg = isSelected ? "var(--sv-primary-100)" : isHover || isOpen ? "var(--sv-grey-100)" : "transparent";
  const color = isSelected ? "var(--sv-primary-500)" : "var(--sv-grey-700)";
  const showClear = isSelected && hovered && onClear;
  return /*#__PURE__*/React.createElement("button", {
    ref: refEl,
    onClick: onClick,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    style: {
      all: "unset",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      height: 28,
      padding: "0 10px",
      borderRadius: 100,
      backgroundColor: bg,
      color,
      fontFamily: "var(--sv-font-ui)",
      fontWeight: 500,
      fontSize: 14,
      lineHeight: "20px",
      whiteSpace: "nowrap",
      transition: "background-color 120ms ease-out"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 16,
      height: 16,
      display: "grid",
      placeItems: "center",
      flex: "none",
      color
    }
  }, icon), /*#__PURE__*/React.createElement("span", null, hasValue && valueText ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--sv-grey-500)",
      fontWeight: 500
    }
  }, label, ": "), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--sv-grey-900)",
      fontWeight: 500
    }
  }, valueText)) : label), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      display: "grid",
      placeItems: "center",
      marginLeft: -4,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      display: "grid",
      placeItems: "center",
      color: "var(--sv-grey-700)",
      opacity: showClear ? 0 : 1,
      transition: "opacity 140ms ease",
      pointerEvents: "none"
    }
  }, ICON_CHEVRON), isSelected && onClear && /*#__PURE__*/React.createElement("span", {
    onClick: e => {
      e.stopPropagation();
      onClear();
    },
    style: {
      position: "absolute",
      inset: 0,
      display: "grid",
      placeItems: "center",
      color: "var(--sv-grey-700)",
      opacity: showClear ? 1 : 0,
      transition: "opacity 140ms ease",
      cursor: "pointer"
    }
  }, ICON_XCIRCLE)));
}
window.FilterChip = FilterChip;
window.SVIcons = {
  ICON_LOAD,
  ICON_USER,
  ICON_WRENCH,
  ICON_HEADSET,
  ICON_TRUCK,
  ICON_CHEVRON,
  ICON_XCIRCLE,
  ICON_X,
  ICON_SEARCH,
  ICON_CHECK,
  ICON_BARS,
  ICON_BACK
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "design-md/filter-chip.jsx", error: String((e && e.message) || e) }); }

// design-md/filter-dropdown.jsx
try { (() => {
// Filter dropdown panel — opens below a chip. Search input + scrollable checkbox list + "Clear selection".
// Matches Figma /Filters/Customer-v1 + /Filters/Customer-v1-selected.

function FilterCheckbox({
  checked,
  partial
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      width: 16,
      height: 16,
      flex: "none",
      borderRadius: 4,
      border: `1px solid ${checked ? "var(--sv-primary-500)" : "var(--sv-grey-300)"}`,
      background: checked ? "var(--sv-primary-50)" : "white",
      color: "var(--sv-primary-500)",
      display: "grid",
      placeItems: "center",
      transition: "all 120ms ease-out"
    }
  }, checked && SVIcons.ICON_CHECK);
}
function PanelSearch({
  value,
  onChange,
  placeholder = "Search customer",
  autoFocus
}) {
  const [focused, setFocused] = React.useState(autoFocus);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 12px 8px 12px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      height: 40,
      padding: "0 12px",
      borderRadius: 8,
      background: "var(--sv-grey-50)",
      border: `${focused ? 2 : 1}px solid ${focused ? "var(--sv-primary-500)" : "var(--sv-grey-200)"}`,
      boxShadow: focused ? "0 0 0 4px rgba(37,124,255,0.18)" : "none",
      transition: "all 120ms ease-out"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: focused ? "var(--sv-primary-500)" : "var(--sv-grey-500)",
      display: "grid",
      placeItems: "center"
    }
  }, SVIcons.ICON_SEARCH), /*#__PURE__*/React.createElement("input", {
    value: value,
    onChange: e => onChange(e.target.value),
    placeholder: placeholder,
    autoFocus: autoFocus,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: {
      border: "none",
      outline: "none",
      background: "transparent",
      flex: 1,
      height: 36,
      fontFamily: "var(--sv-font-ui)",
      fontWeight: 500,
      fontSize: 14,
      lineHeight: "20px",
      color: "var(--sv-grey-900)"
    }
  })));
}

// Variant A — multi-select with checkboxes + plain search
function FilterDropdown({
  title = "Customer",
  options,
  value,
  onChange,
  onClear,
  width = 320,
  withSearch = true,
  withFooter = true
}) {
  const [q, setQ] = React.useState("");
  const filtered = options.filter(o => o.toLowerCase().includes(q.toLowerCase()));
  const toggle = o => {
    const s = new Set(value);
    s.has(o) ? s.delete(o) : s.add(o);
    onChange(Array.from(s));
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      background: "white",
      borderRadius: 12,
      border: "1px solid var(--sv-grey-200)",
      boxShadow: "0 12px 24px rgba(11,23,51,0.10), 0 4px 8px rgba(11,23,51,0.05)",
      overflow: "hidden",
      fontFamily: "var(--sv-font-ui)"
    }
  }, withSearch && /*#__PURE__*/React.createElement(PanelSearch, {
    value: q,
    onChange: setQ,
    placeholder: `Search ${title.toLowerCase()}`,
    autoFocus: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxHeight: 320,
      overflow: "auto",
      padding: "4px 0 8px"
    }
  }, filtered.map(o => {
    const checked = value.includes(o);
    return /*#__PURE__*/React.createElement("label", {
      key: o,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 16px",
        cursor: "pointer",
        fontFamily: "var(--sv-font-ui)",
        fontWeight: 500,
        fontSize: 14,
        lineHeight: "20px",
        color: "var(--sv-grey-900)",
        transition: "background-color 100ms ease-out"
      },
      onMouseEnter: e => e.currentTarget.style.background = "var(--sv-grey-50)",
      onMouseLeave: e => e.currentTarget.style.background = "transparent"
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      checked: checked,
      onChange: () => toggle(o),
      style: {
        position: "absolute",
        opacity: 0,
        pointerEvents: "none"
      }
    }), /*#__PURE__*/React.createElement(FilterCheckbox, {
      checked: checked
    }), /*#__PURE__*/React.createElement("span", null, o));
  }), filtered.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "20px 16px",
      color: "var(--sv-grey-500)",
      fontSize: 14
    }
  }, "No matches")), withFooter && /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid var(--sv-grey-200)",
      padding: "12px 16px"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClear,
    style: {
      all: "unset",
      cursor: "pointer",
      color: "var(--sv-grey-700)",
      fontFamily: "var(--sv-font-ui)",
      fontWeight: 500,
      fontSize: 14,
      lineHeight: "20px"
    }
  }, "Clear selection")));
}

// Variant B — selected/with-pills search input at top (chips inline in the search box)
function FilterDropdownWithPills({
  title = "Customer",
  options,
  value,
  onChange,
  onClear,
  width = 320
}) {
  const [q, setQ] = React.useState("");
  const filtered = options.filter(o => o.toLowerCase().includes(q.toLowerCase()));
  const toggle = o => {
    const s = new Set(value);
    s.has(o) ? s.delete(o) : s.add(o);
    onChange(Array.from(s));
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      background: "white",
      borderRadius: 12,
      border: "1px solid var(--sv-grey-200)",
      boxShadow: "0 12px 24px rgba(11,23,51,0.10), 0 4px 8px rgba(11,23,51,0.05)",
      overflow: "hidden",
      fontFamily: "var(--sv-font-ui)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 12px 8px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      gap: 6,
      minHeight: 40,
      padding: "6px 36px 6px 10px",
      borderRadius: 8,
      background: "var(--sv-grey-50)",
      border: "2px solid var(--sv-primary-500)",
      boxShadow: "0 0 0 4px rgba(37,124,255,0.18)"
    }
  }, value.map(v => /*#__PURE__*/React.createElement("span", {
    key: v,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      height: 24,
      padding: "0 4px 0 8px",
      borderRadius: 6,
      background: "white",
      border: "1px solid var(--sv-grey-200)",
      fontWeight: 500,
      fontSize: 13,
      lineHeight: "20px",
      color: "var(--sv-grey-900)",
      maxWidth: 200
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, v), /*#__PURE__*/React.createElement("button", {
    onClick: () => toggle(v),
    style: {
      all: "unset",
      cursor: "pointer",
      color: "var(--sv-grey-500)",
      display: "grid",
      placeItems: "center",
      padding: 2
    }
  }, SVIcons.ICON_X))), /*#__PURE__*/React.createElement("input", {
    value: q,
    onChange: e => setQ(e.target.value),
    autoFocus: true,
    placeholder: value.length ? "" : `Search ${title.toLowerCase()}`,
    style: {
      border: "none",
      outline: "none",
      background: "transparent",
      flex: 1,
      minWidth: 60,
      height: 24,
      fontFamily: "var(--sv-font-ui)",
      fontWeight: 500,
      fontSize: 14,
      lineHeight: "20px",
      color: "var(--sv-grey-900)"
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: onClear,
    style: {
      all: "unset",
      cursor: "pointer",
      color: "var(--sv-grey-500)",
      position: "absolute",
      right: 8,
      top: 8,
      width: 20,
      height: 20,
      display: "grid",
      placeItems: "center"
    }
  }, SVIcons.ICON_XCIRCLE))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxHeight: 320,
      overflow: "auto",
      padding: "4px 0 8px"
    }
  }, filtered.map(o => {
    const checked = value.includes(o);
    return /*#__PURE__*/React.createElement("label", {
      key: o,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 16px",
        cursor: "pointer",
        fontFamily: "var(--sv-font-ui)",
        fontWeight: 500,
        fontSize: 14,
        lineHeight: "20px",
        color: "var(--sv-grey-900)"
      },
      onMouseEnter: e => e.currentTarget.style.background = "var(--sv-grey-50)",
      onMouseLeave: e => e.currentTarget.style.background = "transparent"
    }, /*#__PURE__*/React.createElement(FilterCheckbox, {
      checked: checked
    }), /*#__PURE__*/React.createElement("span", {
      onClick: () => toggle(o),
      style: {
        flex: 1
      }
    }, o));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid var(--sv-grey-200)",
      padding: "12px 16px"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClear,
    style: {
      all: "unset",
      cursor: "pointer",
      color: "var(--sv-grey-700)",
      fontFamily: "var(--sv-font-ui)",
      fontWeight: 500,
      fontSize: 14,
      lineHeight: "20px"
    }
  }, "Clear selection")));
}

// Simple single-select status list (for Status chip)
function StatusDropdown({
  options,
  value,
  onChange,
  onClear,
  width = 240
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      background: "white",
      borderRadius: 12,
      border: "1px solid var(--sv-grey-200)",
      boxShadow: "0 12px 24px rgba(11,23,51,0.10), 0 4px 8px rgba(11,23,51,0.05)",
      overflow: "hidden",
      fontFamily: "var(--sv-font-ui)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "8px 0"
    }
  }, options.map(o => {
    const checked = value.includes(o);
    return /*#__PURE__*/React.createElement("label", {
      key: o,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 16px",
        cursor: "pointer",
        fontWeight: 500,
        fontSize: 14,
        lineHeight: "20px",
        color: "var(--sv-grey-900)"
      },
      onClick: () => {
        const s = new Set(value);
        s.has(o) ? s.delete(o) : s.add(o);
        onChange(Array.from(s));
      },
      onMouseEnter: e => e.currentTarget.style.background = "var(--sv-grey-50)",
      onMouseLeave: e => e.currentTarget.style.background = "transparent"
    }, /*#__PURE__*/React.createElement(FilterCheckbox, {
      checked: checked
    }), /*#__PURE__*/React.createElement("span", null, o));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid var(--sv-grey-200)",
      padding: "12px 16px"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClear,
    style: {
      all: "unset",
      cursor: "pointer",
      color: "var(--sv-grey-700)",
      fontWeight: 500,
      fontSize: 14,
      lineHeight: "20px"
    }
  }, "Clear selection")));
}
window.FilterDropdown = FilterDropdown;
window.FilterDropdownWithPills = FilterDropdownWithPills;
window.StatusDropdown = StatusDropdown;
})(); } catch (e) { __ds_ns.__errors.push({ path: "design-md/filter-dropdown.jsx", error: String((e && e.message) || e) }); }

// design-md/mobile-filters.jsx
try { (() => {
// Mobile All Filters bottom sheet — matches /Filters/Mobile (Apply filters CTA at bottom).
function MobileFilters({
  onClose
}) {
  const sections = [{
    icon: SVIcons.ICON_LOAD,
    label: "Status",
    value: null
  }, {
    icon: SVIcons.ICON_USER,
    label: "Customer",
    value: null
  }, {
    icon: SVIcons.ICON_WRENCH,
    label: "Lead Technician",
    value: null
  }, {
    icon: SVIcons.ICON_HEADSET,
    label: "Service Advisor",
    value: null
  }, {
    icon: SVIcons.ICON_TRUCK,
    label: "Asset on site",
    value: null
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 402,
      height: 720,
      background: "white",
      display: "flex",
      flexDirection: "column",
      fontFamily: "var(--sv-font-ui)",
      borderRadius: 12,
      overflow: "hidden",
      border: "1px solid var(--sv-grey-200)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px 16px 12px 16px",
      borderBottom: "1px solid var(--sv-grey-100)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: 16,
      color: "var(--sv-grey-900)"
    }
  }, "All Filters"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      all: "unset",
      cursor: "pointer",
      color: "var(--sv-grey-500)",
      padding: 4
    }
  }, SVIcons.ICON_X)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: "auto",
      padding: "8px 16px"
    }
  }, sections.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "14px 4px",
      borderBottom: i === sections.length - 1 ? "none" : "1px solid var(--sv-grey-100)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      color: "var(--sv-grey-700)",
      fontWeight: 500,
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--sv-grey-500)"
    }
  }, s.icon), s.label), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--sv-grey-400)",
      transform: "rotate(-90deg)"
    }
  }, SVIcons.ICON_CHEVRON)))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16,
      borderTop: "1px solid var(--sv-grey-100)"
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      all: "unset",
      cursor: "pointer",
      width: "100%",
      height: 44,
      display: "grid",
      placeItems: "center",
      borderRadius: 8,
      background: "var(--sv-primary-500)",
      color: "white",
      fontWeight: 600,
      fontSize: 14
    }
  }, "Apply filters")));
}
window.MobileFilters = MobileFilters;
})(); } catch (e) { __ds_ns.__errors.push({ path: "design-md/mobile-filters.jsx", error: String((e && e.message) || e) }); }

// design-md/tweaks-panel.jsx
try { (() => {
// tweaks-panel.jsx
// Reusable Tweaks shell + form-control helpers.
//
// Owns the host protocol (listens for __activate_edit_mode / __deactivate_edit_mode,
// posts __edit_mode_available / __edit_mode_set_keys / __edit_mode_dismissed) so
// individual prototypes don't re-roll it. Ships a consistent set of controls so you
// don't hand-draw <input type="range">, segmented radios, steppers, etc.
//
// Usage (in an HTML file that loads React + Babel):
//
//   const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
//     "primaryColor": "#D97757",
//     "fontSize": 16,
//     "density": "regular",
//     "dark": false
//   }/*EDITMODE-END*/;
//
//   function App() {
//     const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
//     return (
//       <div style={{ fontSize: t.fontSize, color: t.primaryColor }}>
//         Hello
//         <TweaksPanel>
//           <TweakSection label="Typography" />
//           <TweakSlider label="Font size" value={t.fontSize} min={10} max={32} unit="px"
//                        onChange={(v) => setTweak('fontSize', v)} />
//           <TweakRadio  label="Density" value={t.density}
//                        options={['compact', 'regular', 'comfy']}
//                        onChange={(v) => setTweak('density', v)} />
//           <TweakSection label="Theme" />
//           <TweakColor  label="Primary" value={t.primaryColor}
//                        onChange={(v) => setTweak('primaryColor', v)} />
//           <TweakToggle label="Dark mode" value={t.dark}
//                        onChange={(v) => setTweak('dark', v)} />
//         </TweaksPanel>
//       </div>
//     );
//   }
//
// ─────────────────────────────────────────────────────────────────────────────

const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;width:100%;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}
`;

// ── useTweaks ───────────────────────────────────────────────────────────────
// Single source of truth for tweak values. setTweak persists via the host
// (__edit_mode_set_keys → host rewrites the EDITMODE block on disk).
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  // Accepts either setTweak('key', value) or setTweak({ key: value, ... }) so a
  // useState-style call doesn't write a "[object Object]" key into the persisted
  // JSON block.
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null ? keyOrEdits : {
      [keyOrEdits]: val
    };
    setValues(prev => ({
      ...prev,
      ...edits
    }));
    window.parent.postMessage({
      type: '__edit_mode_set_keys',
      edits
    }, '*');
  }, []);
  return [values, setTweak];
}

// ── TweaksPanel ─────────────────────────────────────────────────────────────
// Floating shell. Registers the protocol listener BEFORE announcing
// availability — if the announce ran first, the host's activate could land
// before our handler exists and the toolbar toggle would silently no-op.
// The close button posts __edit_mode_dismissed so the host's toolbar toggle
// flips off in lockstep; the host echoes __deactivate_edit_mode back which
// is what actually hides the panel.
function TweaksPanel({
  title = 'Tweaks',
  children
}) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  const offsetRef = React.useRef({
    x: 16,
    y: 16
  });
  const PAD = 16;
  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth,
      h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y))
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);
  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);
  React.useEffect(() => {
    const onMsg = e => {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') setOpen(true);else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({
      type: '__edit_mode_available'
    }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);
  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({
      type: '__edit_mode_dismissed'
    }, '*');
  };
  const onDragStart = e => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX,
      sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = ev => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy)
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };
  if (!open) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, __TWEAKS_STYLE), /*#__PURE__*/React.createElement("div", {
    ref: dragRef,
    className: "twk-panel",
    style: {
      right: offsetRef.current.x,
      bottom: offsetRef.current.y
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-hd",
    onMouseDown: onDragStart
  }, /*#__PURE__*/React.createElement("b", null, title), /*#__PURE__*/React.createElement("button", {
    className: "twk-x",
    "aria-label": "Close tweaks",
    onMouseDown: e => e.stopPropagation(),
    onClick: dismiss
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    className: "twk-body"
  }, children)));
}

// ── Layout helpers ──────────────────────────────────────────────────────────

function TweakSection({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "twk-sect"
  }, label), children);
}
function TweakRow({
  label,
  value,
  children,
  inline = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: inline ? 'twk-row twk-row-h' : 'twk-row'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label), value != null && /*#__PURE__*/React.createElement("span", {
    className: "twk-val"
  }, value)), children);
}

// ── Controls ────────────────────────────────────────────────────────────────

function TweakSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label,
    value: `${value}${unit}`
  }, /*#__PURE__*/React.createElement("input", {
    type: "range",
    className: "twk-slider",
    min: min,
    max: max,
    step: step,
    value: value,
    onChange: e => onChange(Number(e.target.value))
  }));
}
function TweakToggle({
  label,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-row twk-row-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "twk-toggle",
    "data-on": value ? '1' : '0',
    role: "switch",
    "aria-checked": !!value,
    onClick: () => onChange(!value)
  }, /*#__PURE__*/React.createElement("i", null)));
}
function TweakRadio({
  label,
  value,
  options,
  onChange
}) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  const opts = options.map(o => typeof o === 'object' ? o : {
    value: o,
    label: o
  });
  const idx = Math.max(0, opts.findIndex(o => o.value === value));
  const n = opts.length;

  // The active value is read by pointer-move handlers attached for the lifetime
  // of a drag — ref it so a stale closure doesn't fire onChange for every move.
  const valueRef = React.useRef(value);
  valueRef.current = value;
  const segAt = clientX => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor((clientX - r.left - 2) / inner * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };
  const onPointerDown = e => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = ev => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    ref: trackRef,
    role: "radiogroup",
    onPointerDown: onPointerDown,
    className: dragging ? 'twk-seg dragging' : 'twk-seg'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-seg-thumb",
    style: {
      left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
      width: `calc((100% - 4px) / ${n})`
    }
  }), opts.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.value,
    type: "button",
    role: "radio",
    "aria-checked": o.value === value
  }, o.label))));
}
function TweakSelect({
  label,
  value,
  options,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("select", {
    className: "twk-field",
    value: value,
    onChange: e => onChange(e.target.value)
  }, options.map(o => {
    const v = typeof o === 'object' ? o.value : o;
    const l = typeof o === 'object' ? o.label : o;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })));
}
function TweakText({
  label,
  value,
  placeholder,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("input", {
    className: "twk-field",
    type: "text",
    value: value,
    placeholder: placeholder,
    onChange: e => onChange(e.target.value)
  }));
}
function TweakNumber({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange
}) {
  const clamp = n => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({
    x: 0,
    val: 0
  });
  const onScrubStart = e => {
    e.preventDefault();
    startRef.current = {
      x: e.clientX,
      val: value
    };
    const decimals = (String(step).split('.')[1] || '').length;
    const move = ev => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-num"
  }, /*#__PURE__*/React.createElement("span", {
    className: "twk-num-lbl",
    onPointerDown: onScrubStart
  }, label), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: value,
    min: min,
    max: max,
    step: step,
    onChange: e => onChange(clamp(Number(e.target.value)))
  }), unit && /*#__PURE__*/React.createElement("span", {
    className: "twk-num-unit"
  }, unit));
}
function TweakColor({
  label,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-row twk-row-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("input", {
    type: "color",
    className: "twk-swatch",
    value: value,
    onChange: e => onChange(e.target.value)
  }));
}
function TweakButton({
  label,
  onClick,
  secondary = false
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: secondary ? 'twk-btn secondary' : 'twk-btn',
    onClick: onClick
  }, label);
}
Object.assign(window, {
  useTweaks,
  TweaksPanel,
  TweakSection,
  TweakRow,
  TweakSlider,
  TweakToggle,
  TweakRadio,
  TweakSelect,
  TweakText,
  TweakNumber,
  TweakColor,
  TweakButton
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "design-md/tweaks-panel.jsx", error: String((e && e.message) || e) }); }

// design-md/variation-a.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Variation A — Editorial Dossier — v2
// Long-scroll editorial layout. Sticky TOC. Large display type. Generous whitespace.

const VA_TOKENS = {
  blue: '#257CFF',
  blueHover: '#1752C0',
  blueDark: '#0868A7',
  ink: '#0F111A',
  text: '#202939',
  muted: '#4B5565',
  soft: '#697586',
  line: '#E3E8EF',
  strongLine: '#CDD5DF',
  bg: '#FFFFFF',
  bgWarm: '#FFFAEB',
  bgCool: '#E9F5FF',
  bgGrey: '#F8FAFC'
};

// ElevenLabs-inspired card: 8px radius, hairline border, soft surface with subtle inner highlight
const VA_CARD = {
  background: '#FFFFFF',
  border: `1px solid ${VA_TOKENS.line}`,
  borderRadius: 8,
  boxShadow: '0 1px 0 rgba(15,17,26,0.02), 0 1px 2px rgba(15,17,26,0.04)'
};
function VAContainer({
  children,
  narrow
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: narrow ? 860 : 1280,
      margin: '0 auto',
      padding: '0 64px'
    }
  }, children);
}
function VAEyebrow({
  children,
  color = VA_TOKENS.blue
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color,
      fontFamily: 'var(--sv-font-ui)'
    }
  }, children);
}
function VAHeader({
  density
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      borderBottom: `1px solid ${VA_TOKENS.line}`,
      background: VA_TOKENS.bg,
      position: 'sticky',
      top: 0,
      zIndex: 10,
      backdropFilter: 'saturate(150%) blur(8px)'
    }
  }, /*#__PURE__*/React.createElement(VAContainer, null, /*#__PURE__*/React.createElement("div", {
    style: {
      height: density === 'compact' ? 56 : 64,
      display: 'flex',
      alignItems: 'center',
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "logo-primary-light.svg",
    alt: "Shopview",
    style: {
      height: 22
    }
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 24,
      marginLeft: 'auto',
      fontSize: 13,
      color: VA_TOKENS.muted,
      fontWeight: 500
    }
  }, /*#__PURE__*/React.createElement("a", {
    style: {
      color: 'inherit'
    },
    href: "#logo"
  }, "Logo"), /*#__PURE__*/React.createElement("a", {
    style: {
      color: 'inherit'
    },
    href: "#color"
  }, "Color"), /*#__PURE__*/React.createElement("a", {
    style: {
      color: 'inherit'
    },
    href: "#type"
  }, "Type"), /*#__PURE__*/React.createElement("a", {
    style: {
      color: 'inherit'
    },
    href: "#space"
  }, "Space"), /*#__PURE__*/React.createElement("a", {
    style: {
      color: 'inherit'
    },
    href: "#icons"
  }, "Icons"), /*#__PURE__*/React.createElement("a", {
    style: {
      color: 'inherit'
    },
    href: "#components"
  }, "Components"), /*#__PURE__*/React.createElement("a", {
    style: {
      color: 'inherit'
    },
    href: "#motion"
  }, "Motion")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: VA_TOKENS.soft,
      fontFamily: 'var(--sv-font-mono)'
    }
  }, "v1.0 \xB7 Apr 2026"))));
}
function VAHero() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '120px 0 96px',
      background: VA_TOKENS.bg
    }
  }, /*#__PURE__*/React.createElement(VAContainer, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 320px',
      gap: 64,
      alignItems: 'end'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(VAEyebrow, null, "Shopview Design System \xB7 Edition 01"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--sv-font-display)',
      fontSize: 88,
      lineHeight: 0.96,
      fontWeight: 700,
      letterSpacing: '-0.035em',
      color: VA_TOKENS.ink,
      margin: '24px 0 0',
      textWrap: 'balance'
    }
  }, "The system", /*#__PURE__*/React.createElement("br", null), "that runs the", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("em", {
    style: {
      fontStyle: 'italic',
      fontWeight: 700,
      color: VA_TOKENS.blue
    }
  }, "shop floor.")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 19,
      lineHeight: 1.55,
      color: VA_TOKENS.muted,
      marginTop: 32,
      maxWidth: 560,
      textWrap: 'pretty'
    }
  }, "A reference document for the visual and verbal language of Shopview \u2014 built for the people who service semi-trucks, tractors, trailers, and fleet vehicles. Functional, not friendly. Direct, not decorative.")), /*#__PURE__*/React.createElement("div", {
    style: {
      border: `1px solid ${VA_TOKENS.line}`,
      borderRadius: 8,
      padding: 20,
      background: VA_TOKENS.bgGrey
    }
  }, /*#__PURE__*/React.createElement(VAEyebrow, {
    color: VA_TOKENS.muted
  }, "In this document"), /*#__PURE__*/React.createElement("ol", {
    style: {
      margin: '14px 0 0',
      padding: 0,
      listStyle: 'none',
      fontSize: 13,
      color: VA_TOKENS.text,
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, [['01', 'Logo'], ['02', 'Color'], ['03', 'Typography'], ['04', 'Spacing'], ['05', 'Iconography'], ['06', 'Components'], ['07', 'Motion']].map(([n, t]) => /*#__PURE__*/React.createElement("li", {
    key: n,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      borderBottom: `1px dashed ${VA_TOKENS.line}`,
      paddingBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: VA_TOKENS.soft,
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11
    }
  }, n), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500
    }
  }, t)), /*#__PURE__*/React.createElement("span", {
    style: {
      color: VA_TOKENS.soft,
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11
    }
  }, "\u2192"))))))));
}
function VASectionHead({
  n,
  kicker,
  title,
  lede,
  id
}) {
  return /*#__PURE__*/React.createElement("div", {
    id: id,
    style: {
      paddingTop: 96,
      paddingBottom: 32
    }
  }, /*#__PURE__*/React.createElement(VAContainer, null, /*#__PURE__*/React.createElement(VAEyebrow, null, n, " \xB7 ", kicker), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--sv-font-display)',
      fontSize: 56,
      lineHeight: 1.0,
      fontWeight: 600,
      letterSpacing: '-0.025em',
      color: VA_TOKENS.ink,
      margin: '12px 0 0'
    }
  }, title), lede && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 17,
      lineHeight: 1.6,
      color: VA_TOKENS.muted,
      margin: '20px 0 0',
      maxWidth: 640
    }
  }, lede)));
}

// 02. Logo
function VALogo() {
  return /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement(VASectionHead, {
    n: "01",
    id: "logo",
    kicker: "Mark & Wordmark",
    title: "One blue. One mark.",
    lede: "The wordmark sets in Inter Display 800 italic with a custom symbol replacing the 'o'. Brand blue #257CFF is the only fill."
  }), /*#__PURE__*/React.createElement(VAContainer, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: VA_TOKENS.bgGrey,
      border: `1px solid ${VA_TOKENS.line}`,
      borderRadius: 8,
      padding: '80px 64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "logo-primary-light.svg",
    alt: "Shopview wordmark",
    style: {
      width: 420
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 16,
      marginTop: 16
    }
  }, [{
    bg: VA_TOKENS.bg,
    label: 'On surface · #FFFFFF',
    note: 'Default'
  }, {
    bg: VA_TOKENS.bgGrey,
    label: 'On grey-25 · #F8FAFC',
    note: 'Subdued'
  }, {
    bg: VA_TOKENS.blue,
    label: 'On brand · #257CFF',
    note: 'Inverse — wordmark white',
    invert: true
  }].map((o, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...VA_CARD,
      background: o.bg,
      padding: 32,
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      height: 200,
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "symbol-primary.svg",
    alt: "",
    style: {
      height: 36,
      width: 36,
      filter: o.invert ? 'brightness(0) invert(1)' : 'none'
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: o.invert ? '#fff' : VA_TOKENS.muted,
      fontFamily: 'var(--sv-font-mono)'
    }
  }, o.label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: o.invert ? 'rgba(255,255,255,0.7)' : VA_TOKENS.soft,
      marginTop: 4
    }
  }, o.note))))))));
}

// 02. Color
function VAColor() {
  const groups = [{
    label: 'Brand',
    cols: 4,
    swatches: [{
      name: 'primary (Blue)',
      hex: '#257CFF',
      desc: 'Shopview Blue — primary CTA, links, active states.',
      fg: '#ffffff'
    }, {
      name: 'primary-active',
      hex: '#1752C0',
      desc: 'Hover / press state for primary.',
      fg: '#ffffff'
    }]
  }, {
    label: 'Surface',
    cols: 4,
    swatches: [{
      name: 'canvas',
      hex: '#FFFFFF',
      desc: 'Default page and card surface.'
    }, {
      name: 'canvas-soft',
      hex: '#F8FAFC',
      desc: 'Off-white page floor, subtle band.'
    }, {
      name: 'canvas-sub',
      hex: '#EEF2F6',
      desc: 'Side panel and sub-sidebar.'
    }]
  }, {
    label: 'Text',
    cols: 4,
    swatches: [{
      name: 'ink',
      hex: '#0F111A',
      desc: 'Headings, high-contrast text.',
      fg: '#ffffff'
    }, {
      name: 'body',
      hex: '#202939',
      desc: 'Default body copy.',
      fg: '#ffffff'
    }, {
      name: 'muted',
      hex: '#4B5565',
      desc: 'Secondary text, helper copy.',
      fg: '#ffffff'
    }]
  }, {
    label: 'Border',
    cols: 4,
    swatches: [{
      name: 'hairline',
      hex: '#E3E8EF',
      desc: 'Default 1px container border.'
    }, {
      name: 'divider',
      hex: '#CDD5DF',
      desc: 'Strong dividers, input borders.'
    }]
  }, {
    label: 'Semantic',
    cols: 4,
    swatches: [{
      name: 'success',
      hex: '#36B360',
      desc: 'Paid, Completed, Approved.',
      fg: '#ffffff'
    }, {
      name: 'warning',
      hex: '#EC9E00',
      desc: 'Authorization Required, Awaiting.',
      fg: '#ffffff'
    }, {
      name: 'error',
      hex: '#EF4444',
      desc: 'Overdue, destructive actions.',
      fg: '#ffffff'
    }, {
      name: 'info',
      hex: '#257CFF',
      desc: 'Tips, sync notifications.',
      fg: '#ffffff'
    }]
  }];
  const Swatch = ({
    s
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#FFFFFF',
      border: `1px solid ${VA_TOKENS.line}`,
      borderRadius: 12,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: s.hex,
      height: 100,
      borderBottom: s.hex.toLowerCase() === '#ffffff' ? `1px solid ${VA_TOKENS.line}` : 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 22px 22px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--sv-font-ui)',
      fontSize: 16,
      fontWeight: 600,
      color: VA_TOKENS.ink,
      letterSpacing: '-0.005em'
    }
  }, s.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 14,
      color: VA_TOKENS.soft
    }
  }, s.hex.toLowerCase()), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--sv-font-ui)',
      fontSize: 14,
      lineHeight: 1.45,
      color: VA_TOKENS.text,
      marginTop: 2
    }
  }, s.desc)));
  return /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement(VASectionHead, {
    n: "02",
    id: "color",
    kicker: "Palette & Tokens",
    title: "Blue-led, slate-structured.",
    lede: "One action blue. A slate-grey ladder for structure. Four semantic colors for status \u2014 never for decoration."
  }), /*#__PURE__*/React.createElement(VAContainer, null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#F2F3F5',
      border: `1px solid ${VA_TOKENS.line}`,
      borderRadius: 16,
      padding: 40,
      display: 'flex',
      flexDirection: 'column',
      gap: 48
    }
  }, groups.map(g => /*#__PURE__*/React.createElement("div", {
    key: g.label
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--sv-font-ui)',
      fontSize: 13,
      fontWeight: 700,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: VA_TOKENS.ink,
      marginBottom: 20
    }
  }, g.label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: `repeat(${g.cols}, 1fr)`,
      gap: 20
    }
  }, g.swatches.map(s => /*#__PURE__*/React.createElement(Swatch, {
    key: s.name,
    s: s
  }))))))));
}

// 04. Typography
function VAType() {
  const scale = [['H1', 'Display 600', '30 / 38', 'Page titles'], ['H2', 'Display 600', '24 / 32', 'Section titles'], ['H3', 'UI 500', '20 / 28', 'Subsection'], ['H4', 'UI 600', '16 / 24', 'Card titles'], ['Body 1', 'UI 400', '14 / 20', 'Default body'], ['Body 2', 'UI 500', '12 / 16', 'Labels, meta'], ['Caption', 'UI 600', '10 / 14', 'Eyebrows, micro']];
  return /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement(VASectionHead, {
    n: "03",
    id: "type",
    kicker: "Type System",
    title: "Inter, two cuts.",
    lede: "Inter at 18pt for UI and body. Inter Display at 28pt for headlines where the tighter optical cut reads better at scale."
  }), /*#__PURE__*/React.createElement(VAContainer, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      ...VA_CARD,
      padding: '64px 48px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--sv-font-display)',
      fontSize: 180,
      lineHeight: 0.9,
      fontWeight: 800,
      fontStyle: 'italic',
      letterSpacing: '-0.05em',
      color: VA_TOKENS.blue
    }
  }, "Aa"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 32,
      marginTop: 32,
      paddingTop: 32,
      borderTop: `1px solid ${VA_TOKENS.line}`
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: VA_TOKENS.soft,
      fontFamily: 'var(--sv-font-mono)'
    }
  }, "UI \xB7 18pt"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--sv-font-ui)',
      fontSize: 48,
      fontWeight: 600,
      color: VA_TOKENS.ink,
      marginTop: 8
    }
  }, "Inter"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: VA_TOKENS.muted,
      marginTop: 6
    }
  }, "The grotesque that runs every screen.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: VA_TOKENS.soft,
      fontFamily: 'var(--sv-font-mono)'
    }
  }, "Display \xB7 28pt"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--sv-font-display)',
      fontSize: 48,
      fontWeight: 700,
      color: VA_TOKENS.ink,
      marginTop: 8
    }
  }, "Inter Display"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: VA_TOKENS.muted,
      marginTop: 6
    }
  }, "For H1/H2 only \u2014 tighter aperture at scale.")))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24,
      ...VA_CARD,
      overflow: 'hidden'
    }
  }, scale.map(([n, w, lh, use], i) => /*#__PURE__*/React.createElement("div", {
    key: n,
    style: {
      display: 'grid',
      gridTemplateColumns: '80px 1fr 140px 120px 1fr',
      alignItems: 'baseline',
      gap: 24,
      padding: '20px 28px',
      borderTop: i ? `1px solid ${VA_TOKENS.line}` : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11,
      color: VA_TOKENS.blue
    }
  }, n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: i < 2 ? 'var(--sv-font-display)' : 'var(--sv-font-ui)',
      fontSize: parseInt(lh.split('/')[0]),
      lineHeight: `${parseInt(lh.split('/')[1])}px`,
      fontWeight: parseInt(w.split(' ')[1]),
      color: VA_TOKENS.ink
    }
  }, "The quick brown fox"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11,
      color: VA_TOKENS.soft
    }
  }, w), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11,
      color: VA_TOKENS.soft
    }
  }, lh), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: VA_TOKENS.muted
    }
  }, use)))))));
}

// 05. Spacing
function VASpacing() {
  const scale = [[1, 4], [2, 8], [3, 12], [4, 16], [5, 20], [6, 24], [8, 32], [10, 40], [12, 48], [16, 64], [20, 80], [24, 96]];
  const radii = [['xs', 4, 'Inputs (compact)'], ['sm', 6, 'Inline tags'], ['md', 8, 'Buttons, inputs, cards'], ['lg', 12, 'Large cards, modals'], ['xl', 16, 'Modal outer'], ['pill', 999, 'Badges, toggles']];
  return /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement(VASectionHead, {
    n: "04",
    id: "space",
    kicker: "Grid & Geometry",
    title: "Built on a 4-pixel grid.",
    lede: "Every spacing token is a multiple of 4. Radii follow the same logic \u2014 8px is the workhorse."
  }), /*#__PURE__*/React.createElement(VAContainer, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...VA_CARD,
      padding: 28
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 16,
      fontWeight: 600,
      color: VA_TOKENS.ink,
      margin: '0 0 20px'
    }
  }, "Spacing scale"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, scale.map(([n, px]) => /*#__PURE__*/React.createElement("div", {
    key: n,
    style: {
      display: 'grid',
      gridTemplateColumns: '60px 1fr 60px',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11,
      color: VA_TOKENS.soft
    }
  }, "space-", n), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 8,
      background: VA_TOKENS.bgCool,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      width: px,
      background: VA_TOKENS.blue
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11,
      color: VA_TOKENS.text,
      textAlign: 'right'
    }
  }, px, "px"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      ...VA_CARD,
      padding: 28
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 16,
      fontWeight: 600,
      color: VA_TOKENS.ink,
      margin: '0 0 20px'
    }
  }, "Radii"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, radii.map(([n, r, use]) => /*#__PURE__*/React.createElement("div", {
    key: n,
    style: {
      display: 'grid',
      gridTemplateColumns: '48px 1fr 60px',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 48,
      height: 48,
      background: VA_TOKENS.blue,
      borderRadius: r === 999 ? 999 : r
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11,
      color: VA_TOKENS.text
    }
  }, "radius-", n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: VA_TOKENS.soft,
      marginTop: 2
    }
  }, use)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11,
      color: VA_TOKENS.soft,
      textAlign: 'right'
    }
  }, r === 999 ? '∞' : `${r}px`))))))));
}

// 06. Iconography
function VAIcons() {
  const icons = ['plus', 'x', 'search', 'chevron-down', 'arrow-right', 'arrow-up', 'calendar', 'user', 'settings', 'wrench', 'truck', 'clipboard', 'box', 'file-text', 'filter', 'check', 'bell', 'copy'];
  return /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement(VASectionHead, {
    n: "05",
    id: "icons",
    kicker: "Iconography",
    title: "Outlined. 1.5\u20132px stroke.",
    lede: "Icons are line-only with rounded joins, sized at 16, 20, 24, or 32. Color comes from currentColor \u2014 no fills, no duotone."
  }), /*#__PURE__*/React.createElement(VAContainer, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 32,
      alignItems: 'center',
      padding: 32,
      ...VA_CARD,
      background: VA_TOKENS.bgGrey,
      borderRadius: '8px 8px 0 0'
    }
  }, [16, 20, 24, 32].map(s => /*#__PURE__*/React.createElement("div", {
    key: s,
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 64,
      height: 64,
      background: '#fff',
      border: `1px solid ${VA_TOKENS.line}`,
      borderRadius: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: VA_TOKENS.ink
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "wrench",
    size: s
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11,
      color: VA_TOKENS.soft
    }
  }, s, "px"))), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      height: 64,
      background: VA_TOKENS.line
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 64,
      height: 64,
      background: '#E5EDFF',
      borderRadius: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: VA_TOKENS.blue
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "wrench",
    size: 28,
    stroke: 1.75
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11,
      color: VA_TOKENS.soft
    }
  }, "featured"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(9, 1fr)',
      gap: 0,
      border: `1px solid ${VA_TOKENS.line}`,
      borderTop: 'none',
      borderRadius: '0 0 8px 8px',
      overflow: 'hidden'
    }
  }, icons.map((name, i) => /*#__PURE__*/React.createElement("div", {
    key: name,
    style: {
      aspectRatio: '1',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      color: VA_TOKENS.text,
      borderRight: (i + 1) % 9 !== 0 ? `1px solid ${VA_TOKENS.line}` : 'none',
      borderTop: i >= 9 ? `1px solid ${VA_TOKENS.line}` : 'none'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: name,
    size: 22,
    stroke: 1.75
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 10,
      color: VA_TOKENS.soft
    }
  }, name)))))));
}

// Buttons comprehensive showcase
function VAButtonsShowcase() {
  const baseBtn = {
    borderRadius: 8,
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    fontFamily: 'var(--sv-font-ui)',
    border: '1px solid transparent',
    cursor: 'pointer',
    transition: 'none',
    outline: 'none',
    // md size default
    height: 36,
    padding: '0 14px',
    fontSize: 14
  };
  const Caret = () => /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 14 14",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.75",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3.5 5.25L7 8.75l3.5-3.5"
  }));
  const SubLabel = ({
    children
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 10,
      color: VA_TOKENS.soft,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      marginBottom: 14
    }
  }, children);
  const ColHead = ({
    children
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '9px 0',
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 10,
      fontWeight: 700,
      color: VA_TOKENS.soft,
      textTransform: 'uppercase',
      letterSpacing: '0.1em'
    }
  }, children);

  // variant × state table data
  const variantRows = [{
    name: 'Primary',
    note: 'Main CTA — one per view',
    states: [{
      bg: '#257CFF',
      color: '#fff',
      borderColor: 'transparent',
      shadow: '0px 2px 2px 0px #D8ECFF'
    }, {
      bg: '#1752C0',
      color: '#fff',
      borderColor: 'transparent',
      shadow: '0px 2px 2px 0px #D8ECFF'
    }, {
      bg: '#257CFF',
      color: '#fff',
      borderColor: 'transparent',
      shadow: '0 0 0 4px rgba(37,124,255,0.24), 0px 2px 2px 0px #D8ECFF'
    }, {
      bg: '#BEDFFF',
      color: '#fff',
      borderColor: 'transparent',
      shadow: '0px 2px 2px 0px #D8ECFF',
      dim: true
    }]
  }, {
    name: 'Secondary',
    note: 'Supporting actions',
    states: [{
      bg: '#fff',
      color: '#344054',
      borderColor: '#D0D5DD',
      shadow: '0 1px 2px rgba(16,24,40,0.05)'
    }, {
      bg: '#EEF2F6',
      color: '#1D2939',
      borderColor: '#D0D5DD',
      shadow: '0 1px 2px rgba(16,24,40,0.05)'
    }, {
      bg: '#fff',
      color: '#344054',
      borderColor: '#D0D5DD',
      shadow: '0 0 0 4px #F2F4F7, 0 1px 2px rgba(16,24,40,0.05)'
    }, {
      bg: '#fff',
      color: '#D0D5DD',
      borderColor: '#EAECF0',
      shadow: '0 1px 2px rgba(16,24,40,0.05)',
      dim: true
    }]
  }, {
    name: 'Tertiary',
    note: 'Low-priority text actions',
    states: [{
      bg: 'transparent',
      color: '#344054',
      borderColor: 'transparent'
    }, {
      bg: '#EEF2F6',
      color: '#1D2939',
      borderColor: 'transparent'
    }, {
      bg: 'transparent',
      color: '#344054',
      borderColor: 'transparent',
      shadow: '0 0 0 4px #F2F4F7'
    }, {
      bg: 'transparent',
      color: '#D0D5DD',
      borderColor: 'transparent',
      dim: true
    }]
  }];
  const stateHeads = ['Default', 'Hover', 'Focus', 'Disabled'];
  const splitVariants = [{
    name: 'Split · Primary',
    states: [{
      bg: '#257CFF',
      color: '#fff',
      divider: '#2170E6',
      shadow: '0px 2px 2px 0px #D8ECFF',
      border: 'none',
      label: 'Default'
    }, {
      bg: '#175CD3',
      color: '#fff',
      divider: '#134FB6',
      shadow: '0px 2px 2px 0px #D8ECFF',
      border: 'none',
      label: 'Hover'
    }, {
      bg: '#257CFF',
      color: '#fff',
      divider: '#2170E6',
      shadow: '0 0 0 4px rgba(37,124,255,0.24), 0px 2px 2px 0px #D8ECFF',
      border: 'none',
      label: 'Focus'
    }, {
      bg: '#BEDFFF',
      color: '#fff',
      divider: 'rgba(255,255,255,.3)',
      shadow: '0px 2px 2px 0px #D8ECFF',
      border: 'none',
      dim: true,
      label: 'Disabled'
    }]
  }, {
    name: 'Split · Secondary',
    states: [{
      bg: '#fff',
      color: '#344054',
      divider: '#D0D5DD',
      shadow: '0 1px 2px rgba(16,24,40,.05)',
      border: '1px solid #D0D5DD',
      label: 'Default'
    }, {
      bg: '#EEF2F6',
      color: '#1D2939',
      divider: '#D0D5DD',
      shadow: '0 1px 2px rgba(16,24,40,.05)',
      border: '1px solid #D0D5DD',
      label: 'Hover'
    }, {
      bg: '#fff',
      color: '#344054',
      divider: '#D0D5DD',
      shadow: '0 0 0 4px #F2F4F7, 0 1px 2px rgba(16,24,40,.05)',
      border: '1px solid #D0D5DD',
      label: 'Focus'
    }, {
      bg: '#fff',
      color: '#D0D5DD',
      divider: '#EAECF0',
      shadow: '0 1px 2px rgba(16,24,40,.05)',
      border: '1px solid #EAECF0',
      dim: true,
      label: 'Disabled'
    }]
  }];
  const sizes = [{
    label: 'sm',
    token: 'btn-sm',
    h: 32,
    px: 12,
    fs: 13
  }, {
    label: 'md',
    token: 'btn-md',
    h: 40,
    px: 16,
    fs: 14,
    note: 'default'
  }, {
    label: 'lg',
    token: 'btn-lg',
    h: 48,
    px: 20,
    fs: 15
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: `1px solid ${VA_TOKENS.line}`,
      borderRadius: 8,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '160px repeat(4, 1fr)',
      background: VA_TOKENS.bgGrey,
      borderBottom: `1px solid ${VA_TOKENS.line}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 18px'
    }
  }, /*#__PURE__*/React.createElement(ColHead, null, "Variant")), stateHeads.map(h => /*#__PURE__*/React.createElement("div", {
    key: h,
    style: {
      padding: '10px 18px',
      borderLeft: `1px solid ${VA_TOKENS.line}`
    }
  }, /*#__PURE__*/React.createElement(ColHead, null, h)))), variantRows.map((row, ri) => /*#__PURE__*/React.createElement("div", {
    key: row.name,
    style: {
      display: 'grid',
      gridTemplateColumns: '160px repeat(4, 1fr)',
      borderTop: ri > 0 ? `1px solid ${VA_TOKENS.line}` : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: 3
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: VA_TOKENS.ink
    }
  }, row.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: VA_TOKENS.soft
    }
  }, row.note)), row.states.map((s, si) => /*#__PURE__*/React.createElement("div", {
    key: si,
    style: {
      padding: '18px',
      borderLeft: `1px solid ${VA_TOKENS.line}`,
      background: si === 3 ? VA_TOKENS.bgGrey : '#fff',
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("button", {
    disabled: s.dim,
    style: {
      ...baseBtn,
      background: s.bg,
      color: s.color,
      borderColor: s.borderColor,
      boxShadow: s.shadow || 'none',
      cursor: s.dim ? 'not-allowed' : 'pointer'
    }
  }, "Button")))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 12
    }
  }, sizes.map(sz => /*#__PURE__*/React.createElement("div", {
    key: sz.label,
    style: {
      ...VA_CARD,
      padding: '20px 22px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11,
      color: VA_TOKENS.text,
      fontWeight: 600
    }
  }, sz.token), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 10,
      color: VA_TOKENS.soft
    }
  }, sz.h, "px", sz.note ? ` · ${sz.note}` : '')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      ...baseBtn,
      height: sz.h,
      padding: `0 ${sz.px}px`,
      fontSize: sz.fs,
      background: '#257CFF',
      color: '#fff',
      borderColor: 'transparent',
      boxShadow: '0px 2px 2px 0px #D8ECFF'
    }
  }, "Button"), /*#__PURE__*/React.createElement("button", {
    style: {
      ...baseBtn,
      height: sz.h,
      padding: `0 ${sz.px}px`,
      fontSize: sz.fs,
      background: '#fff',
      color: '#344054',
      borderColor: '#D0D5DD',
      boxShadow: '0 1px 2px rgba(16,24,40,0.05)'
    }
  }, "Button"), /*#__PURE__*/React.createElement("button", {
    style: {
      ...baseBtn,
      height: sz.h,
      padding: `0 ${sz.px}px`,
      fontSize: sz.fs,
      background: 'transparent',
      color: '#344054',
      borderColor: 'transparent'
    }
  }, "Button"))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SubLabel, null, "With icons"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      flexWrap: 'wrap',
      alignItems: 'center',
      padding: '20px 22px',
      background: VA_TOKENS.bgGrey,
      border: `1px solid ${VA_TOKENS.line}`,
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: "plus"
  }, "Add Part"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    icon: "filter"
  }, "Filter"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    icon: "calendar"
  }, "Schedule"), /*#__PURE__*/React.createElement(Button, {
    variant: "tertiary",
    icon: "arrow-right"
  }, "View details"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 24
    }
  }, splitVariants.map(sv => /*#__PURE__*/React.createElement("div", {
    key: sv.name
  }, /*#__PURE__*/React.createElement(SubLabel, null, sv.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20,
      flexWrap: 'wrap'
    }
  }, sv.states.map((s, si) => /*#__PURE__*/React.createElement("div", {
    key: si,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      height: 36,
      borderRadius: 8,
      overflow: 'hidden',
      cursor: s.dim ? 'not-allowed' : 'pointer',
      background: s.bg,
      color: s.color,
      boxShadow: s.shadow || 'none',
      border: s.border || 'none',
      fontFamily: 'var(--sv-font-ui)',
      fontWeight: 600,
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      padding: '0 14px',
      display: 'flex',
      alignItems: 'center'
    }
  }, "Save"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 1,
      background: s.divider,
      alignSelf: 'stretch',
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 32,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Caret, null))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 10,
      color: VA_TOKENS.soft
    }
  }, s.label))))))));
}

// Floating-label input (matches preview/inputs.html spec)
function VAFloatInput({
  label,
  defaultValue = '',
  type = 'text',
  error,
  hint,
  disabled,
  isSelect
}) {
  const [value, setValue] = React.useState(defaultValue);
  const [focused, setFocused] = React.useState(false);
  const floated = focused || value.length > 0;
  const borderColor = error ? '#EF4444' : focused ? '#257CFF' : disabled ? '#E3E8EF' : '#CDD5DF';
  const shadow = focused && !error ? '0 0 0 4px rgba(37,124,255,0.18)' : focused && error ? '0 0 0 4px rgba(239,68,68,0.16)' : 'none';
  const labelColor = disabled ? '#9AA4B2' : error ? focused ? '#B52020' : '#B52020' : focused ? '#257CFF' : '#697586';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 40
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: type,
    value: value,
    onChange: e => setValue(e.target.value),
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    disabled: disabled,
    readOnly: isSelect,
    style: {
      width: '100%',
      height: 40,
      boxSizing: 'border-box',
      border: `1px solid ${borderColor}`,
      borderRadius: 8,
      padding: isSelect ? '0 32px 0 12px' : '0 12px',
      fontSize: 14,
      fontFamily: 'inherit',
      color: disabled ? '#9AA4B2' : '#202939',
      background: disabled ? '#F8FAFC' : '#fff',
      outline: 'none',
      boxShadow: shadow,
      cursor: disabled ? 'not-allowed' : isSelect ? 'pointer' : 'text',
      transition: 'border-color 120ms ease, box-shadow 120ms ease'
    }
  }), /*#__PURE__*/React.createElement("label", {
    style: {
      position: 'absolute',
      left: 10,
      top: floated ? 0 : '50%',
      transform: 'translateY(-50%)',
      padding: '0 4px',
      fontSize: floated ? 12 : 14,
      color: labelColor,
      background: disabled ? '#F8FAFC' : '#fff',
      pointerEvents: 'none',
      lineHeight: 1,
      transition: 'top 160ms cubic-bezier(.2,.8,.2,1), font-size 160ms cubic-bezier(.2,.8,.2,1), color 120ms ease'
    }
  }, label), isSelect && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: 10,
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      color: error ? '#EF4444' : focused ? '#257CFF' : '#697586'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 6l4 4 4-4"
  })))), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      marginTop: 6,
      fontSize: 12,
      color: error ? '#B52020' : '#697586'
    }
  }, error || hint));
}
function VAInputsShowcase() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px 24px'
    }
  }, /*#__PURE__*/React.createElement(VAFloatInput, {
    label: "Lead Technician",
    defaultValue: "Aaron Keating"
  }), /*#__PURE__*/React.createElement(VAFloatInput, {
    label: "Service Advisor"
  }), /*#__PURE__*/React.createElement(VAFloatInput, {
    label: "Phone",
    type: "tel",
    defaultValue: "(555) 555",
    error: "Enter a complete phone number."
  }), /*#__PURE__*/React.createElement(VAFloatInput, {
    label: "VIN",
    defaultValue: "830971",
    disabled: true
  }), /*#__PURE__*/React.createElement(VAFloatInput, {
    label: "Customer",
    hint: "Click \u2014 label floats above the value."
  }), /*#__PURE__*/React.createElement(VAFloatInput, {
    label: "Vehicle",
    defaultValue: "2019 Toyota Tacoma"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: VA_TOKENS.line
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 10,
      fontWeight: 700,
      color: VA_TOKENS.soft,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      marginBottom: 14
    }
  }, "Dropdown"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px 24px'
    }
  }, /*#__PURE__*/React.createElement(VAFloatInput, {
    label: "Category*",
    isSelect: true
  }), /*#__PURE__*/React.createElement(VAFloatInput, {
    label: "Category*",
    defaultValue: "Hard Parts",
    isSelect: true
  }), /*#__PURE__*/React.createElement(VAFloatInput, {
    label: "Category*",
    isSelect: true,
    error: "This field is required."
  }), /*#__PURE__*/React.createElement(VAFloatInput, {
    label: "Manufacturer",
    defaultValue: "Freightliner",
    isSelect: true,
    disabled: true
  }))));
}
function VABadgesShowcase() {
  const badgeBase = {
    fontFamily: 'var(--sv-font-ui)',
    fontWeight: 500,
    fontSize: 11,
    lineHeight: '11px',
    padding: '2px 8px',
    display: 'inline-flex',
    alignItems: 'center',
    height: 22,
    boxSizing: 'border-box',
    whiteSpace: 'nowrap'
  };
  const tones = [{
    name: 'Success',
    bordered: {
      background: '#EDFCF2',
      border: '1px solid #73E2A3',
      color: '#087443'
    },
    solid: {
      background: '#D3F8DF',
      color: '#087443'
    },
    location: true
  }, {
    name: 'Warning',
    bordered: {
      background: '#FFFCF5',
      border: '1px solid #FEDF89',
      color: '#B54708'
    },
    solid: {
      background: '#FEF0C7',
      color: '#B54708'
    }
  }, {
    name: 'Danger',
    bordered: {
      background: '#FFFBFA',
      border: '1px solid #FECDCA',
      color: '#D92D20'
    },
    solid: {
      background: '#FEE4E2',
      color: '#B42318'
    }
  }, {
    name: 'Info',
    bordered: {
      background: '#E9F5FF',
      border: '1px solid #82C1FB',
      color: '#175CD3'
    },
    solid: {
      background: '#E9F5FF',
      color: '#175CD3'
    }
  }, {
    name: 'Neutral',
    bordered: {
      background: '#EEF2F6',
      border: '1px solid #CDD5DF',
      color: '#373A41'
    },
    solid: {
      background: '#EEF2F6',
      color: '#364152'
    }
  }];
  const colHeads = ['Rounded · Border', 'Rounded · Solid', 'Square · Border', 'Square · Solid', 'Location'];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: `1px solid ${VA_TOKENS.line}`,
      borderRadius: 8,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '80px repeat(4, 1fr) 120px',
      background: VA_TOKENS.bgGrey,
      borderBottom: `1px solid ${VA_TOKENS.line}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '9px 14px'
    }
  }), colHeads.map((h, i) => /*#__PURE__*/React.createElement("div", {
    key: h,
    style: {
      padding: '9px 14px',
      borderLeft: `1px solid ${VA_TOKENS.line}`,
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 10,
      fontWeight: 700,
      color: VA_TOKENS.soft,
      textTransform: 'uppercase',
      letterSpacing: '0.1em'
    }
  }, h))), tones.map((t, ti) => /*#__PURE__*/React.createElement("div", {
    key: t.name,
    style: {
      display: 'grid',
      gridTemplateColumns: '80px repeat(4, 1fr) 120px',
      borderTop: ti > 0 ? `1px solid ${VA_TOKENS.line}` : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px',
      display: 'flex',
      alignItems: 'center',
      fontSize: 12,
      fontWeight: 600,
      color: VA_TOKENS.muted
    }
  }, t.name), [{
    ...badgeBase,
    borderRadius: 9999,
    ...t.bordered
  }, {
    ...badgeBase,
    borderRadius: 9999,
    ...t.solid
  }, {
    ...badgeBase,
    borderRadius: 8,
    ...t.bordered
  }, {
    ...badgeBase,
    borderRadius: 8,
    ...t.solid
  }].map((style, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      padding: '14px',
      borderLeft: `1px solid ${VA_TOKENS.line}`,
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: style
  }, "Label text"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px',
      borderLeft: `1px solid ${VA_TOKENS.line}`,
      display: 'flex',
      alignItems: 'center'
    }
  }, t.location && /*#__PURE__*/React.createElement("span", {
    style: {
      background: '#fff',
      border: '1px solid #D5D7DA',
      color: '#364152',
      borderRadius: 8,
      padding: '2px 4px 2px 8px',
      height: 24,
      fontWeight: 600,
      fontSize: 11,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      boxSizing: 'border-box'
    }
  }, "Storage ", /*#__PURE__*/React.createElement("span", {
    style: {
      background: '#fff',
      border: '1px solid #D5D7DA',
      borderRadius: 8,
      padding: '0 6px',
      height: 16,
      color: '#414651',
      fontWeight: 500,
      fontSize: 11,
      lineHeight: '16px',
      display: 'inline-flex',
      alignItems: 'center'
    }
  }, "4")))))));
}
function VAControlsShowcase() {
  const stateKeys = ['default', 'hover', 'focus', 'disabled'];
  const stateLabels = ['Default', 'Hover', 'Focus', 'Disabled'];
  const CheckBox = ({
    checked,
    state,
    indeterminate
  }) => {
    const isHover = state === 'hover',
      isFocus = state === 'focus',
      isDisabled = state === 'disabled';
    let bg = '#fff',
      border = '#CDD5DF',
      shadow = 'none';
    if (checked) {
      bg = '#E9F5FF';
      border = '#257CFF';
    }
    if (checked && isHover) bg = '#D8ECFF';
    if (!checked && isHover) bg = '#EEF2F6';
    if (isFocus) {
      shadow = '0 0 0 4px #D8ECFF';
      border = '#257CFF';
    }
    if (isDisabled) {
      bg = '#EEF2F6';
      border = '#CDD5DF';
      shadow = 'none';
    }
    const stroke = isDisabled ? '#CDD5DF' : '#257CFF';
    return /*#__PURE__*/React.createElement("span", {
      style: {
        width: 16,
        height: 16,
        borderRadius: 4,
        border: `1px solid ${border}`,
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: shadow
      }
    }, checked && /*#__PURE__*/React.createElement("svg", {
      width: "10",
      height: "10",
      viewBox: "0 0 10 10",
      fill: "none"
    }, indeterminate ? /*#__PURE__*/React.createElement("path", {
      d: "M2.5 5h5",
      stroke: stroke,
      strokeWidth: "1.5",
      strokeLinecap: "round"
    }) : /*#__PURE__*/React.createElement("path", {
      d: "M2 5l2.5 2.5L8 3",
      stroke: stroke,
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    })));
  };
  const RadioBtn = ({
    checked,
    state
  }) => {
    const isHover = state === 'hover',
      isFocus = state === 'focus',
      isDisabled = state === 'disabled';
    let bg = '#fff',
      border = '#CDD5DF',
      shadow = 'none';
    if (checked) {
      bg = '#E9F5FF';
      border = '#257CFF';
    }
    if (checked && isHover) bg = '#D8ECFF';
    if (!checked && isHover) bg = '#EEF2F6';
    if (isFocus) {
      shadow = '0 0 0 4px #D8ECFF';
      border = '#257CFF';
    }
    if (isDisabled) {
      bg = '#EEF2F6';
      border = '#CDD5DF';
      shadow = 'none';
    }
    return /*#__PURE__*/React.createElement("span", {
      style: {
        width: 16,
        height: 16,
        borderRadius: '50%',
        border: `1px solid ${border}`,
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: shadow
      }
    }, checked && /*#__PURE__*/React.createElement("span", {
      style: {
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: isDisabled ? '#CDD5DF' : '#257CFF'
      }
    }));
  };
  const ToggleBtn = ({
    on,
    state
  }) => {
    const isHover = state === 'hover',
      isFocus = state === 'focus',
      isDisabled = state === 'disabled';
    let bg = '#EEF2F6',
      shadow = 'none';
    if (on) bg = '#2170E6';
    if (on && isHover) bg = '#175CD3';
    if (!on && isHover) bg = '#E3E8EF';
    if (isFocus && !on) {
      bg = '#F8FAFC';
      shadow = '0 0 0 4px #D8ECFF';
    }
    if (isFocus && on) {
      bg = '#2170E6';
      shadow = '0 0 0 4px #D8ECFF';
    }
    if (isDisabled) {
      bg = '#EEF2F6';
      shadow = 'none';
    }
    return /*#__PURE__*/React.createElement("span", {
      style: {
        width: 36,
        height: 20,
        borderRadius: 12,
        background: bg,
        position: 'relative',
        flexShrink: 0,
        display: 'inline-block',
        boxShadow: shadow
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        width: 16,
        height: 16,
        borderRadius: '50%',
        background: isDisabled ? '#F8FAFC' : '#fff',
        top: 2,
        left: on ? 18 : 2,
        boxShadow: '0px 1px 2px rgba(16,24,40,0.06),0px 1px 3px rgba(16,24,40,0.1)',
        transition: 'left 120ms'
      }
    }));
  };
  const Table = ({
    title,
    rows
  }) => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 10,
      fontWeight: 700,
      color: VA_TOKENS.soft,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      marginBottom: 12
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      border: `1px solid ${VA_TOKENS.line}`,
      borderRadius: 8,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '110px repeat(4, 1fr)',
      background: VA_TOKENS.bgGrey,
      borderBottom: `1px solid ${VA_TOKENS.line}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '9px 14px'
    }
  }), stateLabels.map(l => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      padding: '9px 14px',
      borderLeft: `1px solid ${VA_TOKENS.line}`,
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 10,
      fontWeight: 700,
      color: VA_TOKENS.soft,
      textTransform: 'uppercase',
      letterSpacing: '0.1em'
    }
  }, l))), rows.map(([label, render], ri) => /*#__PURE__*/React.createElement("div", {
    key: label,
    style: {
      display: 'grid',
      gridTemplateColumns: '110px repeat(4, 1fr)',
      borderTop: `1px solid ${VA_TOKENS.line}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px',
      display: 'flex',
      alignItems: 'center',
      fontSize: 12,
      fontWeight: 600,
      color: VA_TOKENS.muted
    }
  }, label), stateKeys.map((sk, si) => /*#__PURE__*/React.createElement("div", {
    key: sk,
    style: {
      padding: '14px',
      borderLeft: `1px solid ${VA_TOKENS.line}`,
      display: 'flex',
      alignItems: 'center',
      background: si === 3 ? VA_TOKENS.bgGrey : '#fff'
    }
  }, render(sk)))))));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(Table, {
    title: "Checkbox",
    rows: [['Unchecked', sk => /*#__PURE__*/React.createElement(CheckBox, {
      checked: false,
      state: sk
    })], ['Checked', sk => /*#__PURE__*/React.createElement(CheckBox, {
      checked: true,
      state: sk
    })], ['Indeterminate', sk => /*#__PURE__*/React.createElement(CheckBox, {
      checked: true,
      state: sk,
      indeterminate: true
    })]]
  }), /*#__PURE__*/React.createElement(Table, {
    title: "Radio",
    rows: [['Unchecked', sk => /*#__PURE__*/React.createElement(RadioBtn, {
      checked: false,
      state: sk
    })], ['Checked', sk => /*#__PURE__*/React.createElement(RadioBtn, {
      checked: true,
      state: sk
    })]]
  }), /*#__PURE__*/React.createElement(Table, {
    title: "Toggle",
    rows: [['Off', sk => /*#__PURE__*/React.createElement(ToggleBtn, {
      on: false,
      state: sk
    })], ['On', sk => /*#__PURE__*/React.createElement(ToggleBtn, {
      on: true,
      state: sk
    })]]
  }));
}
function VANotificationsShowcase() {
  const XIcon = () => /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  }));
  const CloseBtn = () => /*#__PURE__*/React.createElement("button", {
    style: {
      flexShrink: 0,
      width: 20,
      height: 20,
      background: 'none',
      border: 0,
      padding: 0,
      color: '#9AA4B2',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(XIcon, null));
  const toasts = [{
    tone: 'success',
    iconBg: '#ECFDF3',
    iconColor: '#067647',
    icon: /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2.25",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("polyline", {
      points: "20 6 9 17 4 12"
    })),
    title: 'WO-1041 marked Completed',
    support: 'The work order is closed and the invoice is ready to send.',
    actions: [{
      label: 'Dismiss',
      muted: true
    }, {
      label: 'View invoice',
      muted: false
    }]
  }, {
    tone: 'warning',
    iconBg: '#FFFAEB',
    iconColor: '#B47A00',
    icon: /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "9",
      x2: "12",
      y2: "13"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "17",
      x2: "12.01",
      y2: "17"
    })),
    title: '3 Lines awaiting authorization',
    support: 'Customer approval required before technicians can begin.',
    actions: [{
      label: 'Undo',
      muted: true
    }]
  }, {
    tone: 'error',
    iconBg: '#FEF3F2',
    iconColor: '#B52020',
    icon: /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "10"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "8",
      x2: "12",
      y2: "12"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "16",
      x2: "12.01",
      y2: "16"
    })),
    title: "Couldn't authorize this Line",
    support: 'Customer signature is required before authorization.',
    actions: [{
      label: 'Dismiss',
      muted: true
    }, {
      label: 'Request signature',
      muted: false
    }]
  }, {
    tone: 'info',
    iconBg: '#E9F5FF',
    iconColor: '#0868A7',
    icon: /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "10"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "16",
      x2: "12",
      y2: "12"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "8",
      x2: "12.01",
      y2: "8"
    })),
    title: 'Version 1.4.1 is now available',
    support: 'Includes the new dashboard view. Pages will now load faster.',
    actions: [{
      label: 'Later',
      muted: true
    }, {
      label: "What's new",
      muted: false
    }]
  }];
  const compactToasts = [{
    iconColor: '#067647',
    barColor: '#067647',
    label: 'Work Order saved',
    icon: /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2.25",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M22 11.08V12a10 10 0 1 1-5.93-9.14"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: "22 4 12 14.01 9 11.01"
    }))
  }, {
    iconColor: '#B47A00',
    barColor: '#B47A00',
    label: '2 parts low in stock',
    icon: /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "9",
      x2: "12",
      y2: "13"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "17",
      x2: "12.01",
      y2: "17"
    }))
  }, {
    iconColor: '#B52020',
    barColor: '#B52020',
    label: "Couldn't sync timesheet",
    icon: /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "10"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "15",
      y1: "9",
      x2: "9",
      y2: "15"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "9",
      y1: "9",
      x2: "15",
      y2: "15"
    }))
  }];
  const alerts = [{
    style: {
      background: '#F6FEF9',
      borderColor: '#ABEFC6',
      color: '#067647'
    },
    dismissable: false,
    icon: /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2.25",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M22 11.08V12a10 10 0 1 1-5.93-9.14"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: "22 4 12 14.01 9 11.01"
    })),
    title: 'Invoice INV-04821 sent to PepsiCo Foods',
    support: "A copy is in the customer's outbox. Payment terms: Net 30."
  }, {
    style: {
      background: '#FFFAEB',
      borderColor: '#FEDF89',
      color: '#B47A00'
    },
    dismissable: true,
    icon: /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "9",
      x2: "12",
      y2: "13"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "17",
      x2: "12.01",
      y2: "17"
    })),
    title: '3 Lines awaiting authorization',
    support: 'Customer approval required before technicians can begin work.'
  }, {
    style: {
      background: '#FFFBFA',
      borderColor: '#FECDCA',
      color: '#B52020'
    },
    dismissable: true,
    icon: /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "10"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "8",
      x2: "12",
      y2: "12"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "16",
      x2: "12.01",
      y2: "16"
    })),
    title: 'Problem saving this Work Order',
    support: 'Bin location required for Part #BR-44211. Add a bin and try again.'
  }, {
    style: {
      background: '#E9F5FF',
      borderColor: '#BDD0FF',
      color: '#0868A7'
    },
    dismissable: true,
    icon: /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "10"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "16",
      x2: "12",
      y2: "12"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "8",
      x2: "12.01",
      y2: "8"
    })),
    title: 'Scheduled maintenance — Sunday 2:00 AM PT',
    support: 'Shopview will be unavailable for ~30 minutes during the 1.4.1 deploy.'
  }];
  const SubLabel = ({
    children
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 10,
      fontWeight: 700,
      color: VA_TOKENS.soft,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      marginBottom: 14
    }
  }, children);
  const toastCard = {
    background: '#fff',
    border: '1px solid #EEF2F6',
    borderRadius: 12,
    boxShadow: '0 4px 6px -2px rgba(16,24,40,0.03),0 12px 16px -4px rgba(16,24,40,0.08)'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SubLabel, null, "Toast \xB7 Full (400 \xD7 auto)"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16
    }
  }, toasts.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.tone,
    style: {
      ...toastCard,
      padding: 16,
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      flexShrink: 0,
      borderRadius: 9999,
      background: t.iconBg,
      color: t.iconColor,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, t.icon), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      lineHeight: '20px',
      color: '#1D2939'
    }
  }, t.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      lineHeight: '20px',
      color: '#697586',
      marginTop: 4
    }
  }, t.support), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      display: 'flex',
      gap: 16
    }
  }, t.actions.map(a => /*#__PURE__*/React.createElement("button", {
    key: a.label,
    style: {
      fontFamily: 'var(--sv-font-ui)',
      fontSize: 14,
      fontWeight: 600,
      cursor: 'pointer',
      background: 'none',
      border: 0,
      padding: 0,
      color: a.muted ? '#697586' : '#175CD3'
    }
  }, a.label)))), /*#__PURE__*/React.createElement(CloseBtn, null))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SubLabel, null, "Toast \xB7 Compact (single line)"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      flexWrap: 'wrap'
    }
  }, compactToasts.map((t, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...toastCard,
      position: 'relative',
      overflow: 'hidden',
      padding: '10px 16px',
      display: 'flex',
      gap: 12,
      alignItems: 'center',
      minWidth: 260
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 20,
      height: 20,
      flexShrink: 0,
      color: t.iconColor,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, t.icon), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontSize: 14,
      fontWeight: 600,
      lineHeight: '20px',
      color: '#1D2939'
    }
  }, t.label), /*#__PURE__*/React.createElement(CloseBtn, null), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: 3,
      overflow: 'hidden',
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      background: t.barColor,
      width: '60%'
    }
  })))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SubLabel, null, "Inline alert \xB7 Banner"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, alerts.map((a, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      borderRadius: 8,
      border: `1px solid ${a.style.borderColor}`,
      background: a.style.background,
      color: a.style.color,
      padding: '12px 14px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 20,
      height: 20,
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 1
    }
  }, a.icon), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      lineHeight: '20px'
    }
  }, a.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      lineHeight: '20px',
      opacity: 0.8,
      marginTop: 2
    }
  }, a.support)), a.dismissable && /*#__PURE__*/React.createElement("button", {
    style: {
      flexShrink: 0,
      width: 20,
      height: 20,
      background: 'none',
      border: 0,
      padding: 0,
      color: 'currentColor',
      opacity: 0.6,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(XIcon, null)))))));
}
function VAPillTabs({
  tabs,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      gap: 2,
      alignItems: 'center'
    }
  }, tabs.map(t => {
    const active = t.key === value;
    return /*#__PURE__*/React.createElement("button", {
      key: t.key,
      onClick: () => onChange?.(t.key),
      style: {
        height: 32,
        padding: '0 12px',
        border: 0,
        background: active ? '#EEF2F6' : 'transparent',
        borderRadius: 6,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontFamily: 'var(--sv-font-ui)',
        fontWeight: 500,
        fontSize: 14,
        lineHeight: '20px',
        color: active ? '#0F111A' : '#697586',
        cursor: 'pointer',
        transition: 'background-color 120ms ease, color 120ms ease'
      }
    }, t.label, typeof t.count === 'number' && /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'inherit'
      }
    }, "(", t.count, ")"));
  }));
}

// 07. Components
function VAComponents() {
  const [tab, setTab] = React.useState('lines');
  return /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement(VASectionHead, {
    n: "06",
    id: "components",
    kicker: "Component Library",
    title: "Twelve primitives. One blue.",
    lede: "Every screen reduces to a small set of primitives. Reuse aggressively. Build new ones only when the existing set truly doesn't cover the case."
  }), /*#__PURE__*/React.createElement(VAContainer, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(12, 1fr)',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: 'span 12',
      ...VA_CARD,
      padding: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      margin: 0,
      color: VA_TOKENS.ink
    }
  }, "Buttons"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11,
      color: VA_TOKENS.soft
    }
  }, "3 variants \xD7 3 sizes")), /*#__PURE__*/React.createElement(VAButtonsShowcase, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: 'span 12',
      ...VA_CARD,
      padding: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      margin: 0,
      color: VA_TOKENS.ink
    }
  }, "Inputs"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11,
      color: VA_TOKENS.soft
    }
  }, "floating label \xB7 text \xB7 dropdown")), /*#__PURE__*/React.createElement(VAInputsShowcase, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: 'span 12',
      ...VA_CARD,
      padding: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      margin: 0,
      color: VA_TOKENS.ink
    }
  }, "Badges"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11,
      color: VA_TOKENS.soft
    }
  }, "5 tones \xD7 4 variants")), /*#__PURE__*/React.createElement(VABadgesShowcase, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: 'span 12',
      ...VA_CARD,
      padding: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      margin: 0,
      color: VA_TOKENS.ink
    }
  }, "Tabs"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11,
      color: VA_TOKENS.soft
    }
  }, "pill \xB7 32px \xB7 radius-6")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 10,
      fontWeight: 700,
      color: VA_TOKENS.soft,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      marginBottom: 12
    }
  }, "States"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      gap: 2,
      alignItems: 'center',
      padding: '8px',
      background: VA_TOKENS.bgGrey,
      borderRadius: 8,
      border: `1px solid ${VA_TOKENS.line}`
    }
  }, [{
    label: 'Default',
    active: false,
    forced: false
  }, {
    label: 'Hover',
    active: false,
    forced: true
  }, {
    label: 'Active',
    active: true,
    forced: false
  }].map(({
    label,
    active,
    forced
  }) => /*#__PURE__*/React.createElement("div", {
    key: label,
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      height: 32,
      padding: '0 12px',
      border: 0,
      background: active || forced ? '#EEF2F6' : 'transparent',
      borderRadius: 6,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: 'var(--sv-font-ui)',
      fontWeight: 500,
      fontSize: 14,
      color: active || forced ? '#0F111A' : '#697586',
      cursor: 'pointer'
    }
  }, "Lines ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'inherit'
    }
  }, "(3)")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 10,
      color: VA_TOKENS.soft
    }
  }, label))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 10,
      fontWeight: 700,
      color: VA_TOKENS.soft,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      marginBottom: 12
    }
  }, "Live groups"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(VAPillTabs, {
    value: tab,
    onChange: setTab,
    tabs: [{
      key: 'lines',
      label: 'Lines',
      count: 17
    }, {
      key: 'parts',
      label: 'Parts',
      count: 20
    }, {
      key: 'returns',
      label: 'Part Returns'
    }, {
      key: 'notes',
      label: 'Notes',
      count: 2
    }, {
      key: 'time',
      label: 'Timesheets',
      count: 2
    }, {
      key: 'stats',
      label: 'Statistics'
    }, {
      key: 'finance',
      label: 'Finance'
    }]
  }), /*#__PURE__*/React.createElement(VAPillTabs, {
    value: tab,
    onChange: setTab,
    tabs: [{
      key: 'details',
      label: 'Details'
    }, {
      key: 'parts',
      label: 'Parts',
      count: 8
    }, {
      key: 'labor',
      label: 'Labor',
      count: 4
    }, {
      key: 'payments',
      label: 'Payments'
    }, {
      key: 'audit',
      label: 'Audit'
    }]
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: 'span 6',
      ...VA_CARD,
      padding: 28
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      margin: '0 0 20px',
      color: VA_TOKENS.ink
    }
  }, "Card \xB7 Work Order Line"), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: VA_TOKENS.soft,
      fontFamily: 'var(--sv-font-mono)'
    }
  }, "L-04"), /*#__PURE__*/React.createElement("h4", {
    style: {
      margin: '4px 0 0',
      fontSize: 16,
      fontWeight: 600
    }
  }, "Replace front brake pads"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: VA_TOKENS.muted,
      marginTop: 6
    }
  }, "Tech: M. Diaz \xB7 2.5 hr")), /*#__PURE__*/React.createElement(Badge, {
    tone: "warning"
  }, "Authorization Required")))), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: 'span 6',
      ...VA_CARD,
      padding: 28
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      margin: '0 0 20px',
      color: VA_TOKENS.ink
    }
  }, "Avatar"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: "Sam Hill",
    size: 40
  }), /*#__PURE__*/React.createElement(Avatar, {
    name: "Pat Liu",
    size: 40
  }), /*#__PURE__*/React.createElement(Avatar, {
    name: "Mae Diaz",
    size: 40
  }), /*#__PURE__*/React.createElement(Avatar, {
    name: "Aaron K",
    size: 40
  }), /*#__PURE__*/React.createElement(Avatar, {
    name: "Jane Doe",
    size: 40
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center',
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: "Sam Hill",
    size: 32
  }), /*#__PURE__*/React.createElement(Avatar, {
    name: "Pat Liu",
    size: 32
  }), /*#__PURE__*/React.createElement(Avatar, {
    name: "Mae Diaz",
    size: 32
  }), /*#__PURE__*/React.createElement(Avatar, {
    name: "Sam Hill",
    size: 24
  }), /*#__PURE__*/React.createElement(Avatar, {
    name: "Pat Liu",
    size: 24
  }), /*#__PURE__*/React.createElement(Avatar, {
    name: "Mae Diaz",
    size: 24
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: 'span 12',
      ...VA_CARD,
      padding: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      margin: 0,
      color: VA_TOKENS.ink
    }
  }, "Controls"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11,
      color: VA_TOKENS.soft
    }
  }, "checkbox \xB7 radio \xB7 toggle")), /*#__PURE__*/React.createElement(VAControlsShowcase, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: 'span 12',
      ...VA_CARD,
      padding: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      margin: 0,
      color: VA_TOKENS.ink
    }
  }, "Filters"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11,
      color: VA_TOKENS.soft
    }
  }, "chip \xB7 dropdown \xB7 bar")), /*#__PURE__*/React.createElement(VAFiltersBlock, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: 'span 12',
      ...VA_CARD,
      padding: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      margin: 0,
      color: VA_TOKENS.ink
    }
  }, "Notifications"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11,
      color: VA_TOKENS.soft
    }
  }, "toast \xB7 compact \xB7 inline alert")), /*#__PURE__*/React.createElement(VANotificationsShowcase, null)))));
}

// Filters showcase inside the components section
function VAFiltersBlock() {
  const [statusVal, setStatusVal] = React.useState(['Estimate', 'In progress', 'Approved']);
  const [custVal, setCustVal] = React.useState([]);
  const RowLabel = ({
    children
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11,
      color: VA_TOKENS.soft,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      marginBottom: 10
    }
  }, children);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 28
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(RowLabel, null, "Chip states"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 10,
      padding: 16,
      background: VA_TOKENS.bgGrey,
      borderRadius: 8,
      border: `1px solid ${VA_TOKENS.line}`
    }
  }, [['Default', {
    state: 'default'
  }], ['Hover', {
    state: 'hover'
  }], ['Open', {
    state: 'open'
  }], ['Selected', {
    hasValue: true,
    valueText: 'In progress',
    onClear: () => {}
  }]].map(([label, props]) => /*#__PURE__*/React.createElement("div", {
    key: label,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(FilterChip, _extends({
    icon: SVIcons.ICON_LOAD,
    label: "Status"
  }, props)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: VA_TOKENS.soft,
      fontFamily: 'var(--sv-font-mono)'
    }
  }, label))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(RowLabel, null, "Filter bar \u2014 applied set"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      flexWrap: 'wrap',
      padding: '10px 14px',
      background: '#fff',
      border: `1px solid ${VA_TOKENS.line}`,
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement(FilterChip, {
    icon: SVIcons.ICON_LOAD,
    label: "Status",
    hasValue: true,
    valueText: "In progress",
    onClear: () => {}
  }), /*#__PURE__*/React.createElement(FilterChip, {
    icon: SVIcons.ICON_USER,
    label: "Customer",
    hasValue: true,
    valueText: "RF Heavy, +2",
    onClear: () => {}
  }), /*#__PURE__*/React.createElement(FilterChip, {
    icon: SVIcons.ICON_WRENCH,
    label: "Lead Technician"
  }), /*#__PURE__*/React.createElement(FilterChip, {
    icon: SVIcons.ICON_HEADSET,
    label: "Service Advisor"
  }), /*#__PURE__*/React.createElement(FilterChip, {
    icon: SVIcons.ICON_TRUCK,
    label: "Asset on site"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: VA_TOKENS.blue,
      fontWeight: 500,
      fontSize: 14,
      paddingLeft: 8,
      cursor: 'pointer'
    }
  }, "Clear filters"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(RowLabel, null, "Dropdowns"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24,
      background: VA_TOKENS.bgGrey,
      border: `1px solid ${VA_TOKENS.line}`,
      borderRadius: 8,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(FilterChip, {
    icon: SVIcons.ICON_LOAD,
    label: "Status",
    hasValue: statusVal.length > 0,
    valueText: statusVal.length ? `${statusVal[0]}${statusVal.length > 1 ? `, +${statusVal.length - 1}` : ''}` : null,
    onClear: () => setStatusVal([])
  }), /*#__PURE__*/React.createElement(StatusDropdown, {
    options: window.STATUSES,
    value: statusVal,
    onChange: setStatusVal,
    onClear: () => setStatusVal([]),
    width: 260
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: VA_TOKENS.soft,
      fontFamily: 'var(--sv-font-mono)'
    }
  }, "Status \u2014 multi-select list")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24,
      background: VA_TOKENS.bgGrey,
      border: `1px solid ${VA_TOKENS.line}`,
      borderRadius: 8,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(FilterChip, {
    icon: SVIcons.ICON_USER,
    label: "Customer",
    hasValue: custVal.length > 0,
    valueText: custVal.length ? `${custVal[0]}${custVal.length > 1 ? `, +${custVal.length - 1}` : ''}` : null,
    onClear: () => setCustVal([])
  }), /*#__PURE__*/React.createElement(FilterDropdown, {
    title: "Customer",
    options: window.CUSTOMERS,
    value: custVal,
    onChange: setCustVal,
    onClear: () => setCustVal([]),
    width: 316
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: VA_TOKENS.soft,
      fontFamily: 'var(--sv-font-mono)'
    }
  }, "Customer \u2014 search + checklist")))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: VA_TOKENS.soft,
      lineHeight: 1.6
    }
  }, "28px pill \xB7 radius 100 \xB7 padding 0 10 \xB7 gap 8. Default: transparent / grey-700. Hover & open: grey-100. Selected: primary-100 fill, primary-500 text. Dropdown: 12px radius, shadow-lg, 320px wide for search variants, 240\u2013260px for status."));
}
function VATogglePair() {
  const [a, setA] = React.useState(true);
  const [b, setB] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Toggle, {
    on: a,
    onChange: setA
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13
    }
  }, "Show financials")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Toggle, {
    on: b,
    onChange: setB
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13
    }
  }, "Notify on completion")));
}
function VANotice({
  tone,
  text
}) {
  const tones = {
    success: {
      bg: '#ABF5C4',
      fg: '#108737',
      icon: 'check'
    },
    warning: {
      bg: '#FFF5E0',
      fg: '#B47A00',
      icon: 'bell'
    },
    error: {
      bg: '#FCA397',
      fg: '#B52020',
      icon: 'x'
    },
    info: {
      bg: '#E5EDFF',
      fg: '#0868A7',
      icon: 'bell'
    }
  }[tone];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 16px',
      background: tones.bg,
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 28,
      height: 28,
      borderRadius: 999,
      background: '#fff',
      color: tones.fg,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: tones.icon,
    size: 14,
    stroke: 2.5
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: tones.fg,
      fontWeight: 500
    }
  }, text));
}

// 08. Motion
function VAMotion() {
  return /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement(VASectionHead, {
    n: "07",
    id: "motion",
    kicker: "Motion",
    title: "120ms. Ease-out. No bounce.",
    lede: "Motion is utility, not personality. Hover lifts shadow. Press deepens fill. Focus glows. Nothing scales, nothing springs."
  }), /*#__PURE__*/React.createElement(VAContainer, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 16
    }
  }, [['Hover', 'shadow-sm → shadow-md', 'No scale. No translate.'], ['Press', 'fill → primary-800', 'No shrink.'], ['Focus', '4px blue@24% glow', 'Always visible. Always.'], ['Disabled', '40% opacity', 'No interaction.']].map(([t, m, n]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      ...VA_CARD,
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontFamily: 'var(--sv-font-mono)',
      color: VA_TOKENS.soft,
      marginBottom: 14
    }
  }, t), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 64,
      background: VA_TOKENS.bgGrey,
      borderRadius: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 14
    }
  }, t === 'Hover' && /*#__PURE__*/React.createElement("button", {
    style: {
      height: 40,
      padding: '0 16px',
      background: VA_TOKENS.blue,
      color: '#fff',
      border: 0,
      borderRadius: 8,
      fontWeight: 600,
      fontSize: 14,
      fontFamily: 'inherit',
      boxShadow: '0 4px 8px rgba(11,23,51,0.08)'
    }
  }, "Hover"), t === 'Press' && /*#__PURE__*/React.createElement("button", {
    style: {
      height: 40,
      padding: '0 16px',
      background: '#042260',
      color: '#fff',
      border: 0,
      borderRadius: 8,
      fontWeight: 600,
      fontSize: 14,
      fontFamily: 'inherit'
    }
  }, "Pressed"), t === 'Focus' && /*#__PURE__*/React.createElement("button", {
    style: {
      height: 40,
      padding: '0 16px',
      background: VA_TOKENS.blue,
      color: '#fff',
      border: 0,
      borderRadius: 8,
      fontWeight: 600,
      fontSize: 14,
      fontFamily: 'inherit',
      boxShadow: '0 0 0 4px rgba(37,124,255,0.24)'
    }
  }, "Focused"), t === 'Disabled' && /*#__PURE__*/React.createElement("button", {
    disabled: true,
    style: {
      height: 40,
      padding: '0 16px',
      background: '#B7D5FF',
      color: '#fff',
      border: 0,
      borderRadius: 8,
      fontWeight: 600,
      fontSize: 14,
      fontFamily: 'inherit'
    }
  }, "Disabled")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11,
      color: VA_TOKENS.text
    }
  }, m), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: VA_TOKENS.soft,
      marginTop: 4
    }
  }, n))))));
}
function VAFooter() {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      marginTop: 96,
      padding: '64px 0',
      borderTop: `1px solid ${VA_TOKENS.line}`,
      background: VA_TOKENS.bgGrey
    }
  }, /*#__PURE__*/React.createElement(VAContainer, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "logo-primary-light.svg",
    alt: "Shopview",
    style: {
      height: 18,
      opacity: 0.6
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: VA_TOKENS.soft,
      fontFamily: 'var(--sv-font-mono)'
    }
  }, "Shopview Design System \xB7 Edition 01 \xB7 Apr 2026"))));
}
function VariationA({
  density = 'comfortable'
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: VA_TOKENS.bg,
      color: VA_TOKENS.text,
      fontFamily: 'var(--sv-font-ui)',
      minHeight: '100%',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(VAHeader, {
    density: density
  }), /*#__PURE__*/React.createElement(VAHero, null), /*#__PURE__*/React.createElement(VALogo, null), /*#__PURE__*/React.createElement(VAColor, null), /*#__PURE__*/React.createElement(VAType, null), /*#__PURE__*/React.createElement(VASpacing, null), /*#__PURE__*/React.createElement(VAIcons, null), /*#__PURE__*/React.createElement(VAComponents, null), /*#__PURE__*/React.createElement(VAMotion, null), /*#__PURE__*/React.createElement(VAFooter, null));
}
window.VariationA = VariationA;
})(); } catch (e) { __ds_ns.__errors.push({ path: "design-md/variation-a.jsx", error: String((e && e.message) || e) }); }

// design-md/variation-b.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Variation A - Editorial Dossier - v2
// Long-scroll editorial layout. Sticky TOC. Large display type. Generous whitespace.

const VA_TOKENS = {
  blue: '#257CFF',
  blueHover: '#1752C0',
  blueDark: '#0868A7',
  ink: '#0F111A',
  text: '#202939',
  muted: '#4B5565',
  soft: '#697586',
  line: '#E3E8EF',
  strongLine: '#CDD5DF',
  bg: '#FFFFFF',
  bgWarm: '#FFFAEB',
  bgCool: '#E9F5FF',
  bgGrey: '#F8FAFC'
};

// ElevenLabs-inspired card: 8px radius, hairline border, soft surface with subtle inner highlight
const VA_CARD = {
  background: '#FFFFFF',
  border: `1px solid ${VA_TOKENS.line}`,
  borderRadius: 8,
  boxShadow: '0 1px 0 rgba(15,17,26,0.02), 0 1px 2px rgba(15,17,26,0.04)'
};
function VAContainer({
  children,
  narrow
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: narrow ? 860 : 1280,
      margin: '0 auto',
      padding: '0 64px'
    }
  }, children);
}
function VAEyebrow({
  children,
  color = VA_TOKENS.blue
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color,
      fontFamily: 'var(--sv-font-ui)'
    }
  }, children);
}
function VAHeader({
  density
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      borderBottom: `1px solid ${VA_TOKENS.line}`,
      background: VA_TOKENS.bg,
      position: 'sticky',
      top: 0,
      zIndex: 10,
      backdropFilter: 'saturate(150%) blur(8px)'
    }
  }, /*#__PURE__*/React.createElement(VAContainer, null, /*#__PURE__*/React.createElement("div", {
    style: {
      height: density === 'compact' ? 56 : 64,
      display: 'flex',
      alignItems: 'center',
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "logo-primary-light.svg",
    alt: "Shopview",
    style: {
      height: 22
    }
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 24,
      marginLeft: 'auto',
      fontSize: 13,
      color: VA_TOKENS.muted,
      fontWeight: 500
    }
  }, /*#__PURE__*/React.createElement("a", {
    style: {
      color: 'inherit'
    },
    href: "#logo"
  }, "Logo"), /*#__PURE__*/React.createElement("a", {
    style: {
      color: 'inherit'
    },
    href: "#color"
  }, "Color"), /*#__PURE__*/React.createElement("a", {
    style: {
      color: 'inherit'
    },
    href: "#type"
  }, "Type"), /*#__PURE__*/React.createElement("a", {
    style: {
      color: 'inherit'
    },
    href: "#space"
  }, "Space"), /*#__PURE__*/React.createElement("a", {
    style: {
      color: 'inherit'
    },
    href: "#icons"
  }, "Icons"), /*#__PURE__*/React.createElement("a", {
    style: {
      color: 'inherit'
    },
    href: "#components"
  }, "Components"), /*#__PURE__*/React.createElement("a", {
    style: {
      color: 'inherit'
    },
    href: "#ai-agent"
  }, "AI Agent")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: VA_TOKENS.soft,
      fontFamily: 'var(--sv-font-mono)'
    }
  }, "v1.0 \xB7 May 2026"))));
}
function VAHeroSearch() {
  const QUERY = 'WO-1041';
  const [phase, setPhase] = React.useState(0);
  const [cursorVis, setCursorVis] = React.useState(true);

  // Cursor blink
  React.useEffect(() => {
    const t = setInterval(() => setCursorVis(v => !v), 530);
    return () => clearInterval(t);
  }, []);

  // Phase delays (ms before advancing to next phase)
  const delays = [1200, 120, 120, 120, 120, 120, 120, 120, 350, 160, 160, 200, 260, 200, 260, 200, 260, 200, 2800];
  React.useEffect(() => {
    const delay = delays[phase] ?? 1200;
    const t = setTimeout(() => setPhase(p => p >= delays.length - 1 ? 0 : p + 1), delay);
    return () => clearTimeout(t);
  }, [phase]);

  // Derived visual state
  const typed = phase >= 1 ? QUERY.slice(0, Math.min(phase, 7)) : '';
  const showCursor = phase < 9;
  const showTabs = phase >= 9;
  const showS1 = phase >= 10;
  const showR1 = phase >= 11;
  const showS2 = phase >= 12;
  const showR2 = phase >= 13;
  const showS3 = phase >= 14;
  const showR3 = phase >= 15;
  const showS4 = phase >= 16;
  const showR4 = phase >= 17;
  const appear = visible => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(6px)',
    transition: 'opacity 240ms ease, transform 240ms ease',
    pointerEvents: visible ? 'auto' : 'none'
  });

  // Icons — using design system icon files (same as global search component)
  const grey500Filter = 'brightness(0) saturate(100%) invert(45%) sepia(12%) saturate(600%) hue-rotate(179deg) brightness(97%) contrast(85%)';
  const SearchIco = () => /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: typed ? '#364152' : '#9AA4B2',
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "8"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "21",
    y1: "21",
    x2: "16.65",
    y2: "16.65"
  }));
  const WOIco = () => /*#__PURE__*/React.createElement("img", {
    src: "../preview/icons/work-order-20.svg",
    width: "20",
    height: "20",
    alt: "",
    style: {
      display: 'block',
      filter: grey500Filter
    }
  });
  const UserIco = () => /*#__PURE__*/React.createElement("img", {
    src: "../preview/icons/user-20.svg",
    width: "20",
    height: "20",
    alt: "",
    style: {
      display: 'block',
      filter: grey500Filter
    }
  });
  const PartsIco = () => /*#__PURE__*/React.createElement("img", {
    src: "../preview/icons/settings-20.svg",
    width: "20",
    height: "20",
    alt: "",
    style: {
      display: 'block',
      filter: grey500Filter
    }
  });
  const AssetIco = () => /*#__PURE__*/React.createElement("img", {
    src: "../preview/icons/truck-20.svg",
    width: "20",
    height: "20",
    alt: "",
    style: {
      display: 'block',
      filter: grey500Filter
    }
  });
  const EntityBox = ({
    children
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      borderRadius: 12,
      background: '#EEF2F6',
      border: '1px solid #E3E8EF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, children);
  const Hl = ({
    text
  }) => {
    if (!typed) return /*#__PURE__*/React.createElement(React.Fragment, null, text);
    const lo = text.toLowerCase(),
      q = typed.toLowerCase();
    const idx = lo.indexOf(q);
    if (idx === -1) return /*#__PURE__*/React.createElement(React.Fragment, null, text);
    return /*#__PURE__*/React.createElement(React.Fragment, null, text.slice(0, idx), /*#__PURE__*/React.createElement("span", {
      style: {
        background: '#FEDF89',
        borderRadius: 2
      }
    }, text.slice(idx, idx + typed.length)), text.slice(idx + typed.length));
  };
  const SBadge = ({
    label,
    type = 'neutral'
  }) => {
    const s = {
      success: {
        background: '#EDFCF2',
        border: '1px solid #73E2A3',
        color: '#087443'
      },
      info: {
        background: '#E9F5FF',
        border: '1px solid #82C1FB',
        color: '#175CD3'
      },
      warning: {
        background: '#FFFCF5',
        border: '1px solid #FEDF89',
        color: '#B54708'
      },
      neutral: {
        background: '#EEF2F6',
        border: '1px solid #CDD5DF',
        color: '#373A41'
      }
    }[type] || {};
    return /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        fontWeight: 500,
        height: 20,
        padding: '0 7px',
        borderRadius: 9999,
        display: 'inline-flex',
        alignItems: 'center',
        whiteSpace: 'nowrap',
        ...s
      }
    }, label);
  };
  const SectionLbl = ({
    label
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '6px 16px 2px',
      fontSize: 11,
      fontWeight: 600,
      color: '#697586',
      letterSpacing: '0.03em'
    }
  }, label);
  const Row = ({
    icon,
    title,
    badge,
    badgeType,
    meta
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '7px 8px',
      borderRadius: 10,
      minHeight: 48
    }
  }, /*#__PURE__*/React.createElement(EntityBox, null, icon), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: '#0F111A',
      lineHeight: '18px'
    }
  }, /*#__PURE__*/React.createElement(Hl, {
    text: title
  })), badge && /*#__PURE__*/React.createElement(SBadge, {
    label: badge,
    type: badgeType
  })), meta && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: '#697586',
      lineHeight: '16px'
    }
  }, meta)));
  const tabLabels = ['All', 'Work Orders', 'Customers', 'Assets', 'Parts'];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      border: '4px solid #EEF2F6',
      borderRadius: 14,
      boxShadow: '0 8px 8px -4px rgba(16,24,40,0.03), 0 20px 24px -4px rgba(16,24,40,0.08)',
      overflow: 'hidden',
      fontFamily: 'var(--sv-font-ui)',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 50,
      background: '#fff',
      borderBottom: '1px solid #EEF2F6',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '0 16px'
    }
  }, /*#__PURE__*/React.createElement(SearchIco, null), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontSize: 14,
      fontWeight: 500,
      color: typed ? '#0F111A' : '#9AA4B2',
      display: 'flex',
      alignItems: 'center',
      gap: 0
    }
  }, typed || 'Search or ask a question', showCursor && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      width: 1.5,
      height: 14,
      background: '#257CFF',
      marginLeft: 1,
      opacity: cursorVis ? 1 : 0,
      verticalAlign: 'middle',
      transition: 'opacity 80ms'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: 220,
      paddingBottom: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...appear(showTabs),
      display: 'flex',
      gap: 2,
      padding: '10px 8px 4px',
      flexWrap: 'wrap'
    }
  }, tabLabels.map((l, i) => /*#__PURE__*/React.createElement("button", {
    key: l,
    style: {
      height: 26,
      padding: '0 10px',
      border: 0,
      background: i === 0 ? '#EEF2F6' : 'transparent',
      borderRadius: 6,
      fontSize: 13,
      fontWeight: 500,
      color: i === 0 ? '#0F111A' : '#697586',
      cursor: 'pointer',
      fontFamily: 'inherit'
    }
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: appear(showS1)
  }, /*#__PURE__*/React.createElement(SectionLbl, {
    label: "Work orders (1)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 8px',
      ...appear(showR1)
    }
  }, /*#__PURE__*/React.createElement(Row, {
    icon: /*#__PURE__*/React.createElement(WOIco, null),
    title: "WO-1041 Fisquare Farms",
    badge: "In Progress",
    badgeType: "info",
    meta: "M. Diaz \xB7 Apr 27, 2026"
  })), /*#__PURE__*/React.createElement("div", {
    style: appear(showS2)
  }, /*#__PURE__*/React.createElement(SectionLbl, {
    label: "Customers (1)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 8px',
      ...appear(showR2)
    }
  }, /*#__PURE__*/React.createElement(Row, {
    icon: /*#__PURE__*/React.createElement(UserIco, null),
    title: "Fisquare Farms",
    meta: "923 Ross Islands, X1T 2B1"
  })), /*#__PURE__*/React.createElement("div", {
    style: appear(showS3)
  }, /*#__PURE__*/React.createElement(SectionLbl, {
    label: "Parts (1)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 8px',
      ...appear(showR3)
    }
  }, /*#__PURE__*/React.createElement(Row, {
    icon: /*#__PURE__*/React.createElement(PartsIco, null),
    title: "Lube Filter \xB7 FL-1A",
    meta: "WO-1041 \xB7 qty 2 \xB7 $18.40 ea"
  })), /*#__PURE__*/React.createElement("div", {
    style: appear(showS4)
  }, /*#__PURE__*/React.createElement(SectionLbl, {
    label: "Assets (1)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 8px',
      ...appear(showR4)
    }
  }, /*#__PURE__*/React.createElement(Row, {
    icon: /*#__PURE__*/React.createElement(AssetIco, null),
    title: "2019 Freightliner M2 106",
    badge: "On Site",
    badgeType: "success",
    meta: "Fisquare Farms \xB7 1FD0W5HY2EEA05499"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 38,
      background: '#F8FAFC',
      borderTop: '1px solid #EEF2F6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14
    }
  }, [['↑↓', 'Navigate'], ['↵', 'Select']].map(([k, lbl]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: 'flex',
      gap: 5,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("kbd", {
    style: {
      fontSize: 10,
      fontWeight: 600,
      color: '#697586',
      background: '#E3E8EF',
      borderRadius: 4,
      padding: '1px 5px',
      fontFamily: 'var(--sv-font-ui)'
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: '#697586'
    }
  }, lbl)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 5,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: '#697586'
    }
  }, "Close"), /*#__PURE__*/React.createElement("kbd", {
    style: {
      fontSize: 10,
      fontWeight: 600,
      color: '#697586',
      background: '#E3E8EF',
      borderRadius: 4,
      padding: '1px 5px',
      fontFamily: 'var(--sv-font-ui)'
    }
  }, "esc"))));
}
function VAHero() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '120px 0 96px',
      background: VA_TOKENS.bg
    }
  }, /*#__PURE__*/React.createElement(VAContainer, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 420px',
      gap: 64,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(VAEyebrow, null, "Shopview Design System \xB7 Edition 01"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--sv-font-display)',
      fontSize: 88,
      lineHeight: 0.96,
      fontWeight: 700,
      letterSpacing: '-0.035em',
      color: VA_TOKENS.ink,
      margin: '24px 0 0',
      textWrap: 'balance'
    }
  }, "The system", /*#__PURE__*/React.createElement("br", null), "that runs the", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("em", {
    style: {
      fontStyle: 'italic',
      fontWeight: 700,
      color: VA_TOKENS.blue
    }
  }, "shop floor.")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 19,
      lineHeight: 1.55,
      color: VA_TOKENS.muted,
      marginTop: 32,
      maxWidth: 560,
      textWrap: 'pretty'
    }
  }, "A reference document for the visual and verbal language of Shopview - built for the people who service semi-trucks, tractors, trailers, and fleet vehicles. Functional, not friendly. Direct, not decorative.")), /*#__PURE__*/React.createElement(VAHeroSearch, null))));
}
function VASectionHead({
  n,
  kicker,
  title,
  lede,
  id
}) {
  return /*#__PURE__*/React.createElement("div", {
    id: id,
    style: {
      paddingTop: 96,
      paddingBottom: 32
    }
  }, /*#__PURE__*/React.createElement(VAContainer, null, /*#__PURE__*/React.createElement(VAEyebrow, null, n, " \xB7 ", kicker), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--sv-font-display)',
      fontSize: 56,
      lineHeight: 1.0,
      fontWeight: 600,
      letterSpacing: '-0.025em',
      color: VA_TOKENS.ink,
      margin: '12px 0 0'
    }
  }, title), lede && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 17,
      lineHeight: 1.6,
      color: VA_TOKENS.muted,
      margin: '20px 0 0',
      maxWidth: 640
    }
  }, lede)));
}

// 02. Logo
function VALogo() {
  return /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement(VASectionHead, {
    n: "01",
    id: "logo",
    kicker: "Mark & Wordmark",
    title: "One blue. One mark.",
    lede: "The wordmark sets in Inter Display 800 italic with a custom symbol replacing the 'o'. Brand blue #257CFF is the only fill."
  }), /*#__PURE__*/React.createElement(VAContainer, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: VA_TOKENS.bgGrey,
      border: `1px solid ${VA_TOKENS.line}`,
      borderRadius: 8,
      padding: '80px 64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "logo-primary-light.svg",
    alt: "Shopview wordmark",
    style: {
      width: 420
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 16,
      marginTop: 16
    }
  }, [{
    bg: VA_TOKENS.bg,
    label: 'On surface · #FFFFFF',
    note: 'Default'
  }, {
    bg: VA_TOKENS.bgGrey,
    label: 'On grey-25 · #F8FAFC',
    note: 'Subdued'
  }, {
    bg: VA_TOKENS.blue,
    label: 'On brand · #257CFF',
    note: 'Inverse - wordmark white',
    invert: true
  }].map((o, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...VA_CARD,
      background: o.bg,
      padding: 32,
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      height: 200,
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "symbol-primary.svg",
    alt: "",
    style: {
      height: 36,
      width: 36,
      filter: o.invert ? 'brightness(0) invert(1)' : 'none'
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: o.invert ? '#fff' : VA_TOKENS.muted,
      fontFamily: 'var(--sv-font-mono)'
    }
  }, o.label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: o.invert ? 'rgba(255,255,255,0.7)' : VA_TOKENS.soft,
      marginTop: 4
    }
  }, o.note))))))));
}

// 02. Color
function VAColor() {
  const groups = [{
    label: 'Brand',
    cols: 4,
    swatches: [{
      name: 'primary (Blue)',
      hex: '#257CFF',
      desc: 'Shopview Blue - primary CTA, links, active states.',
      fg: '#ffffff'
    }, {
      name: 'primary-active',
      hex: '#1752C0',
      desc: 'Hover / press state for primary.',
      fg: '#ffffff'
    }]
  }, {
    label: 'Surface',
    cols: 4,
    swatches: [{
      name: 'canvas',
      hex: '#FFFFFF',
      desc: 'Default page and card surface.'
    }, {
      name: 'canvas-soft',
      hex: '#F8FAFC',
      desc: 'Off-white page floor, subtle band.'
    }, {
      name: 'canvas-sub',
      hex: '#EEF2F6',
      desc: 'Side panel and sub-sidebar.'
    }]
  }, {
    label: 'Text',
    cols: 4,
    swatches: [{
      name: 'ink',
      hex: '#0F111A',
      desc: 'Headings, high-contrast text.',
      fg: '#ffffff'
    }, {
      name: 'body',
      hex: '#202939',
      desc: 'Default body copy.',
      fg: '#ffffff'
    }, {
      name: 'muted',
      hex: '#4B5565',
      desc: 'Secondary text, helper copy.',
      fg: '#ffffff'
    }]
  }, {
    label: 'Border',
    cols: 4,
    swatches: [{
      name: 'hairline',
      hex: '#E3E8EF',
      desc: 'Default 1px container border.'
    }, {
      name: 'divider',
      hex: '#CDD5DF',
      desc: 'Strong dividers, input borders.'
    }]
  }, {
    label: 'Semantic',
    cols: 4,
    swatches: [{
      name: 'success',
      hex: '#36B360',
      desc: 'Paid, Completed, Approved.',
      fg: '#ffffff'
    }, {
      name: 'warning',
      hex: '#EC9E00',
      desc: 'Authorization Required, Awaiting.',
      fg: '#ffffff'
    }, {
      name: 'error',
      hex: '#EF4444',
      desc: 'Overdue, destructive actions.',
      fg: '#ffffff'
    }, {
      name: 'info',
      hex: '#257CFF',
      desc: 'Tips, sync notifications.',
      fg: '#ffffff'
    }]
  }];
  const Swatch = ({
    s
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#FFFFFF',
      border: `1px solid ${VA_TOKENS.line}`,
      borderRadius: 12,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: s.hex,
      height: 100,
      borderBottom: s.hex.toLowerCase() === '#ffffff' ? `1px solid ${VA_TOKENS.line}` : 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 22px 22px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--sv-font-ui)',
      fontSize: 16,
      fontWeight: 600,
      color: VA_TOKENS.ink,
      letterSpacing: '-0.005em'
    }
  }, s.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 14,
      color: VA_TOKENS.soft
    }
  }, s.hex.toLowerCase()), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--sv-font-ui)',
      fontSize: 14,
      lineHeight: 1.45,
      color: VA_TOKENS.text,
      marginTop: 2
    }
  }, s.desc)));
  return /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement(VASectionHead, {
    n: "02",
    id: "color",
    kicker: "Palette & Tokens",
    title: "Blue-led, slate-structured.",
    lede: "One action blue. A slate-grey ladder for structure. Four semantic colors for status - never for decoration."
  }), /*#__PURE__*/React.createElement(VAContainer, null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#F2F3F5',
      border: `1px solid ${VA_TOKENS.line}`,
      borderRadius: 16,
      padding: 40,
      display: 'flex',
      flexDirection: 'column',
      gap: 48
    }
  }, groups.map(g => /*#__PURE__*/React.createElement("div", {
    key: g.label
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--sv-font-ui)',
      fontSize: 13,
      fontWeight: 700,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: VA_TOKENS.ink,
      marginBottom: 20
    }
  }, g.label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: `repeat(${g.cols}, 1fr)`,
      gap: 20
    }
  }, g.swatches.map(s => /*#__PURE__*/React.createElement(Swatch, {
    key: s.name,
    s: s
  }))))))));
}

// 04. Typography
function VAType() {
  const scale = [['H1', 'Display 600', '30 / 38', 'Page titles'], ['H2', 'Display 600', '24 / 32', 'Section titles'], ['H3', 'UI 500', '20 / 28', 'Subsection'], ['H4', 'UI 600', '16 / 24', 'Card titles'], ['Body 1', 'UI 400', '14 / 20', 'Default body'], ['Body 2', 'UI 500', '12 / 16', 'Labels, meta'], ['Caption', 'UI 600', '10 / 14', 'Eyebrows, micro']];
  return /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement(VASectionHead, {
    n: "03",
    id: "type",
    kicker: "Type System",
    title: "Inter, two cuts.",
    lede: "Inter at 18pt for UI and body. Inter Display at 28pt for headlines where the tighter optical cut reads better at scale."
  }), /*#__PURE__*/React.createElement(VAContainer, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      ...VA_CARD,
      padding: '64px 48px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--sv-font-display)',
      fontSize: 180,
      lineHeight: 0.9,
      fontWeight: 800,
      fontStyle: 'italic',
      letterSpacing: '-0.05em',
      color: VA_TOKENS.blue
    }
  }, "Aa"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 96,
      marginTop: 32,
      paddingTop: 32,
      borderTop: `1px solid ${VA_TOKENS.line}`
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: VA_TOKENS.soft,
      fontFamily: 'var(--sv-font-mono)'
    }
  }, "UI \xB7 18pt"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--sv-font-ui)',
      fontSize: 48,
      fontWeight: 600,
      color: VA_TOKENS.ink,
      marginTop: 24
    }
  }, "Inter"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: VA_TOKENS.muted,
      marginTop: 24
    }
  }, "The grotesque that runs every screen.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: VA_TOKENS.soft,
      fontFamily: 'var(--sv-font-mono)'
    }
  }, "Display \xB7 28pt"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--sv-font-display)',
      fontSize: 48,
      fontWeight: 700,
      color: VA_TOKENS.ink,
      marginTop: 24
    }
  }, "Inter Display"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: VA_TOKENS.muted,
      marginTop: 24
    }
  }, "For H1/H2 only - tighter aperture at scale.")))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24,
      ...VA_CARD,
      overflow: 'hidden'
    }
  }, scale.map(([n, w, lh, use], i) => /*#__PURE__*/React.createElement("div", {
    key: n,
    style: {
      display: 'grid',
      gridTemplateColumns: '80px 1fr 140px 120px 1fr',
      alignItems: 'baseline',
      gap: 24,
      padding: '20px 28px',
      borderTop: i ? `1px solid ${VA_TOKENS.line}` : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11,
      color: VA_TOKENS.blue
    }
  }, n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: i < 2 ? 'var(--sv-font-display)' : 'var(--sv-font-ui)',
      fontSize: parseInt(lh.split('/')[0]),
      lineHeight: `${parseInt(lh.split('/')[1])}px`,
      fontWeight: parseInt(w.split(' ')[1]),
      color: VA_TOKENS.ink
    }
  }, "Fleet service & repairs"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11,
      color: VA_TOKENS.soft
    }
  }, w), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11,
      color: VA_TOKENS.soft
    }
  }, lh), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: VA_TOKENS.muted
    }
  }, use)))))));
}

// 05. Spacing
function VASpacing() {
  const scale = [[1, 4], [2, 8], [3, 12], [4, 16], [5, 20], [6, 24], [8, 32], [10, 40], [12, 48], [16, 64], [20, 80], [24, 96]];
  const radii = [['xs', 4, 'Inputs (compact)'], ['sm', 6, 'Inline tags'], ['md', 8, 'Buttons, inputs, cards'], ['lg', 12, 'Large cards, modals'], ['xl', 16, 'Modal outer'], ['pill', 999, 'Badges, toggles']];
  return /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement(VASectionHead, {
    n: "04",
    id: "space",
    kicker: "Grid & Geometry",
    title: "Built on a 4-pixel grid.",
    lede: "Every spacing token is a multiple of 4. Radii follow the same logic - 8px is the workhorse."
  }), /*#__PURE__*/React.createElement(VAContainer, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...VA_CARD,
      padding: 28
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 16,
      fontWeight: 600,
      color: VA_TOKENS.ink,
      margin: '0 0 20px'
    }
  }, "Spacing scale"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, scale.map(([n, px]) => /*#__PURE__*/React.createElement("div", {
    key: n,
    style: {
      display: 'grid',
      gridTemplateColumns: '60px 1fr 60px',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11,
      color: VA_TOKENS.soft
    }
  }, "space-", n), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 8,
      background: VA_TOKENS.bgCool,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      width: px,
      background: VA_TOKENS.blue
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11,
      color: VA_TOKENS.text,
      textAlign: 'right'
    }
  }, px, "px"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      ...VA_CARD,
      padding: 28
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 16,
      fontWeight: 600,
      color: VA_TOKENS.ink,
      margin: '0 0 20px'
    }
  }, "Radii"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, radii.map(([n, r, use]) => /*#__PURE__*/React.createElement("div", {
    key: n,
    style: {
      display: 'grid',
      gridTemplateColumns: '48px 1fr 60px',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 48,
      height: 48,
      background: VA_TOKENS.blue,
      borderRadius: r === 999 ? 999 : r
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11,
      color: VA_TOKENS.text
    }
  }, "radius-", n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: VA_TOKENS.soft,
      marginTop: 2
    }
  }, use)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11,
      color: VA_TOKENS.soft,
      textAlign: 'right'
    }
  }, r === 999 ? '∞' : `${r}px`))))))));
}

// 05. Iconography
const _svgIconCache = {};
function SVGIcon({
  file,
  size
}) {
  const [svg, setSvg] = React.useState(_svgIconCache[file] || null);
  React.useEffect(() => {
    if (_svgIconCache[file]) {
      setSvg(_svgIconCache[file]);
      return;
    }
    fetch(file).then(r => r.ok ? r.text() : Promise.reject()).then(txt => {
      let t = txt.replace(/(<svg[^>]*)\s+width="[^"]*"/i, '$1').replace(/(<svg[^>]*)\s+height="[^"]*"/i, '$1');
      _svgIconCache[file] = t;
      setSvg(t);
    }).catch(() => {});
  }, [file]);
  if (!svg) return /*#__PURE__*/React.createElement("img", {
    src: file,
    alt: "",
    style: {
      width: size,
      height: size,
      display: 'block'
    }
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      lineHeight: 0,
      overflow: 'visible',
      flexShrink: 0
    },
    dangerouslySetInnerHTML: {
      __html: svg.replace(/<svg/, `<svg width="${size}" height="${size}" style="overflow:visible;display:block"`)
    }
  });
}
function ConstructionFrame({
  size,
  children
}) {
  const PAD = 9; // breathing room between icon and frame
  const TOTAL = size + PAD * 2;
  const T = 8; // tick length
  const C = 'rgba(154,164,178,0.55)';
  const tick = s => /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      background: C,
      ...s
    }
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: TOTAL,
      height: TOTAL,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      border: '1px solid ' + C,
      pointerEvents: 'none'
    }
  }), tick({
    top: -T,
    left: 0,
    width: '1px',
    height: T
  }), tick({
    top: 0,
    left: -T,
    width: T,
    height: '1px'
  }), tick({
    top: -T,
    right: 0,
    width: '1px',
    height: T
  }), tick({
    top: 0,
    right: -T,
    width: T,
    height: '1px'
  }), tick({
    bottom: -T,
    left: 0,
    width: '1px',
    height: T
  }), tick({
    bottom: 0,
    left: -T,
    width: T,
    height: '1px'
  }), tick({
    bottom: -T,
    right: 0,
    width: '1px',
    height: T
  }), tick({
    bottom: 0,
    right: -T,
    width: T,
    height: '1px'
  }), children);
}
function VAIcons() {
  const iconShowcase = [{
    name: 'Done',
    file: '../preview/icons/fig-check-verified.svg'
  }, {
    name: 'Asset',
    file: '../preview/icons/truck-20.svg'
  }, {
    name: 'Work Order',
    file: '../preview/icons/work-order-20.svg'
  }, {
    name: 'Clock In',
    file: '../preview/icons/fig-clock.svg'
  }, {
    name: 'Technician',
    file: '../preview/icons/tool-16.svg'
  }, {
    name: 'Edit',
    file: '../preview/icons/fig-edit-2.svg'
  }];
  const SIZES = [24, 20, 16];
  const CELL = 54;
  const GAP = 10;
  const gridCols = `28px repeat(${iconShowcase.length}, ${CELL}px)`;
  const FRAMED = new Set(['0-1', '1-1', '2-1']); // Truck column, all three sizes

  return /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement(VASectionHead, {
    n: "05",
    id: "icons",
    kicker: "Iconography",
    title: "Outlined. 1.3-2px stroke.",
    lede: "Icons are line-only with rounded joins, sized at 16, 20 or 24px."
  }), /*#__PURE__*/React.createElement(VAContainer, null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#F2F3F5',
      border: `1px solid ${VA_TOKENS.line}`,
      borderRadius: 16,
      overflow: 'hidden',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      minHeight: 340
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '52px',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--sv-font-display)',
      fontSize: 42,
      fontWeight: 700,
      color: VA_TOKENS.ink,
      lineHeight: 1.04,
      letterSpacing: '-0.028em'
    }
  }, "UI Icons"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      lineHeight: 1.65,
      color: VA_TOKENS.muted,
      margin: '20px 0 0'
    }
  }, "Custom icons built for the shop floor.", ' ', /*#__PURE__*/React.createElement("strong", {
    style: {
      color: VA_TOKENS.text
    }
  }, "150+ icons"), ' ', "across 9 semantic categories - legible at every size."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 20
    }
  }, ['Outlined', '1.3-2px stroke', '24×24', '20×20', '16×16'].map(tag => /*#__PURE__*/React.createElement("span", {
    key: tag,
    style: {
      padding: '4px 10px',
      border: '1px solid #CACFD6',
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 500,
      color: '#4B5565',
      background: '#F2F3F5',
      lineHeight: '18px'
    }
  }, tag))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      paddingTop: 40,
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "../preview/icons.html",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      background: VA_TOKENS.blue,
      color: '#fff',
      padding: '9px 20px',
      borderRadius: 8,
      fontWeight: 600,
      fontSize: 14,
      textDecoration: 'none',
      fontFamily: 'var(--sv-font-ui)'
    }
  }, "View Icons \u2192"))), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#fff',
      backgroundImage: 'radial-gradient(circle, rgba(154,164,178,0.35) 1px, transparent 1px)',
      backgroundSize: '22px 22px',
      borderLeft: `1px solid ${VA_TOKENS.line}`,
      padding: '52px 48px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: GAP,
      overflow: 'visible'
    }
  }, SIZES.map((sz, si) => /*#__PURE__*/React.createElement("div", {
    key: sz,
    style: {
      display: 'grid',
      gridTemplateColumns: gridCols,
      gap: GAP,
      alignItems: 'center',
      overflow: 'visible'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 10,
      color: VA_TOKENS.soft,
      textAlign: 'right',
      paddingRight: 2,
      lineHeight: 1
    }
  }, sz), iconShowcase.map(({
    name,
    file
  }, ii) => {
    const framed = FRAMED.has(`${si}-${ii}`);
    const iconEl = /*#__PURE__*/React.createElement(SVGIcon, {
      file: file,
      size: sz
    });
    return /*#__PURE__*/React.createElement("div", {
      key: name,
      style: {
        width: CELL,
        height: CELL,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible'
      }
    }, framed ? /*#__PURE__*/React.createElement(ConstructionFrame, {
      size: sz
    }, iconEl) : iconEl);
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: gridCols,
      gap: GAP,
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("div", null), iconShowcase.map(({
    name
  }) => /*#__PURE__*/React.createElement("div", {
    key: name,
    style: {
      textAlign: 'center',
      fontSize: 10,
      color: VA_TOKENS.soft,
      lineHeight: 1.3,
      fontFamily: 'var(--sv-font-mono)'
    }
  }, name))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: gridCols,
      gap: GAP,
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: `2 / ${iconShowcase.length + 2}`,
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 1,
      background: VA_TOKENS.strongLine
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: VA_TOKENS.soft,
      fontStyle: 'italic',
      whiteSpace: 'nowrap',
      fontFamily: 'var(--sv-font-ui)'
    }
  }, "24 \xB7 20 \xB7 16px"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 1,
      background: VA_TOKENS.strongLine
    }
  })))))));
}

// Buttons comprehensive showcase
function VAButtonsShowcase() {
  const baseBtn = {
    borderRadius: 8,
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    fontFamily: 'var(--sv-font-ui)',
    border: '1px solid transparent',
    cursor: 'pointer',
    transition: 'none',
    outline: 'none',
    // md size default
    height: 36,
    padding: '0 14px',
    fontSize: 14
  };
  const Caret = () => /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 14 14",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.75",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3.5 5.25L7 8.75l3.5-3.5"
  }));
  const SubLabel = ({
    children
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 10,
      color: VA_TOKENS.soft,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      marginBottom: 14
    }
  }, children);
  const ColHead = ({
    children
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '9px 0',
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 10,
      fontWeight: 700,
      color: VA_TOKENS.soft,
      textTransform: 'uppercase',
      letterSpacing: '0.1em'
    }
  }, children);

  // variant × state table data
  const variantRows = [{
    name: 'Primary',
    note: 'Main CTA - one per view',
    states: [{
      bg: '#257CFF',
      color: '#fff',
      borderColor: 'transparent',
      shadow: '0px 2px 2px 0px #D8ECFF'
    }, {
      bg: '#1752C0',
      color: '#fff',
      borderColor: 'transparent',
      shadow: '0px 2px 2px 0px #D8ECFF'
    }, {
      bg: '#257CFF',
      color: '#fff',
      borderColor: 'transparent',
      shadow: '0 0 0 4px rgba(37,124,255,0.24), 0px 2px 2px 0px #D8ECFF'
    }, {
      bg: '#BEDFFF',
      color: '#fff',
      borderColor: 'transparent',
      shadow: '0px 2px 2px 0px #D8ECFF',
      dim: true
    }]
  }, {
    name: 'Secondary',
    note: 'Supporting actions',
    states: [{
      bg: '#fff',
      color: '#344054',
      borderColor: '#D0D5DD',
      shadow: '0 1px 2px rgba(16,24,40,0.05)'
    }, {
      bg: '#EEF2F6',
      color: '#1D2939',
      borderColor: '#D0D5DD',
      shadow: '0 1px 2px rgba(16,24,40,0.05)'
    }, {
      bg: '#fff',
      color: '#344054',
      borderColor: '#D0D5DD',
      shadow: '0 0 0 4px #F2F4F7, 0 1px 2px rgba(16,24,40,0.05)'
    }, {
      bg: '#fff',
      color: '#D0D5DD',
      borderColor: '#EAECF0',
      shadow: '0 1px 2px rgba(16,24,40,0.05)',
      dim: true
    }]
  }, {
    name: 'Tertiary',
    note: 'Low-priority text actions',
    states: [{
      bg: 'transparent',
      color: '#344054',
      borderColor: 'transparent'
    }, {
      bg: '#EEF2F6',
      color: '#1D2939',
      borderColor: 'transparent'
    }, {
      bg: 'transparent',
      color: '#344054',
      borderColor: 'transparent',
      shadow: '0 0 0 4px #F2F4F7'
    }, {
      bg: 'transparent',
      color: '#D0D5DD',
      borderColor: 'transparent',
      dim: true
    }]
  }];
  const stateHeads = ['Default', 'Hover', 'Focus', 'Disabled'];
  const splitVariants = [{
    name: 'Split · Primary',
    states: [{
      bg: '#257CFF',
      color: '#fff',
      divider: '#2170E6',
      shadow: '0px 2px 2px 0px #D8ECFF',
      border: 'none',
      label: 'Default'
    }, {
      bg: '#175CD3',
      color: '#fff',
      divider: '#134FB6',
      shadow: '0px 2px 2px 0px #D8ECFF',
      border: 'none',
      label: 'Hover'
    }, {
      bg: '#257CFF',
      color: '#fff',
      divider: '#2170E6',
      shadow: '0 0 0 4px rgba(37,124,255,0.24), 0px 2px 2px 0px #D8ECFF',
      border: 'none',
      label: 'Focus'
    }, {
      bg: '#BEDFFF',
      color: '#fff',
      divider: 'rgba(255,255,255,.3)',
      shadow: '0px 2px 2px 0px #D8ECFF',
      border: 'none',
      dim: true,
      label: 'Disabled'
    }]
  }, {
    name: 'Split · Secondary',
    states: [{
      bg: '#fff',
      color: '#344054',
      divider: '#D0D5DD',
      shadow: '0 1px 2px rgba(16,24,40,.05)',
      border: '1px solid #D0D5DD',
      label: 'Default'
    }, {
      bg: '#EEF2F6',
      color: '#1D2939',
      divider: '#D0D5DD',
      shadow: '0 1px 2px rgba(16,24,40,.05)',
      border: '1px solid #D0D5DD',
      label: 'Hover'
    }, {
      bg: '#fff',
      color: '#344054',
      divider: '#D0D5DD',
      shadow: '0 0 0 4px #F2F4F7, 0 1px 2px rgba(16,24,40,.05)',
      border: '1px solid #D0D5DD',
      label: 'Focus'
    }, {
      bg: '#fff',
      color: '#D0D5DD',
      divider: '#EAECF0',
      shadow: '0 1px 2px rgba(16,24,40,.05)',
      border: '1px solid #EAECF0',
      dim: true,
      label: 'Disabled'
    }]
  }];
  const sizes = [{
    label: 'sm',
    token: 'btn-sm',
    h: 32,
    px: 12,
    fs: 13
  }, {
    label: 'md',
    token: 'btn-md',
    h: 40,
    px: 16,
    fs: 14,
    note: 'default'
  }, {
    label: 'lg',
    token: 'btn-lg',
    h: 48,
    px: 20,
    fs: 15
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: `1px solid ${VA_TOKENS.line}`,
      borderRadius: 8,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '160px repeat(4, 1fr)',
      background: VA_TOKENS.bgGrey,
      borderBottom: `1px solid ${VA_TOKENS.line}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 18px'
    }
  }, /*#__PURE__*/React.createElement(ColHead, null, "Variant")), stateHeads.map(h => /*#__PURE__*/React.createElement("div", {
    key: h,
    style: {
      padding: '10px 18px',
      borderLeft: `1px solid ${VA_TOKENS.line}`
    }
  }, /*#__PURE__*/React.createElement(ColHead, null, h)))), variantRows.map((row, ri) => /*#__PURE__*/React.createElement("div", {
    key: row.name,
    style: {
      display: 'grid',
      gridTemplateColumns: '160px repeat(4, 1fr)',
      borderTop: ri > 0 ? `1px solid ${VA_TOKENS.line}` : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: 3
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: VA_TOKENS.ink
    }
  }, row.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: VA_TOKENS.soft
    }
  }, row.note)), row.states.map((s, si) => /*#__PURE__*/React.createElement("div", {
    key: si,
    style: {
      padding: '18px',
      borderLeft: `1px solid ${VA_TOKENS.line}`,
      background: si === 3 ? VA_TOKENS.bgGrey : '#fff',
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("button", {
    disabled: s.dim,
    style: {
      ...baseBtn,
      background: s.bg,
      color: s.color,
      borderColor: s.borderColor,
      boxShadow: s.shadow || 'none',
      cursor: s.dim ? 'not-allowed' : 'pointer'
    }
  }, "Button")))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 12
    }
  }, sizes.map(sz => /*#__PURE__*/React.createElement("div", {
    key: sz.label,
    style: {
      ...VA_CARD,
      padding: '20px 22px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11,
      color: VA_TOKENS.text,
      fontWeight: 600
    }
  }, sz.token), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 10,
      color: VA_TOKENS.soft
    }
  }, sz.h, "px", sz.note ? ` · ${sz.note}` : '')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      ...baseBtn,
      height: sz.h,
      padding: `0 ${sz.px}px`,
      fontSize: sz.fs,
      background: '#257CFF',
      color: '#fff',
      borderColor: 'transparent',
      boxShadow: '0px 2px 2px 0px #D8ECFF'
    }
  }, "Button"), /*#__PURE__*/React.createElement("button", {
    style: {
      ...baseBtn,
      height: sz.h,
      padding: `0 ${sz.px}px`,
      fontSize: sz.fs,
      background: '#fff',
      color: '#344054',
      borderColor: '#D0D5DD',
      boxShadow: '0 1px 2px rgba(16,24,40,0.05)'
    }
  }, "Button"), /*#__PURE__*/React.createElement("button", {
    style: {
      ...baseBtn,
      height: sz.h,
      padding: `0 ${sz.px}px`,
      fontSize: sz.fs,
      background: 'transparent',
      color: '#344054',
      borderColor: 'transparent'
    }
  }, "Button"))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SubLabel, null, "With icons"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      flexWrap: 'wrap',
      alignItems: 'center',
      padding: '20px 22px',
      background: VA_TOKENS.bgGrey,
      border: `1px solid ${VA_TOKENS.line}`,
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: "plus"
  }, "Add Part"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    icon: "filter"
  }, "Filter"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    icon: "calendar"
  }, "Schedule"), /*#__PURE__*/React.createElement(Button, {
    variant: "tertiary",
    icon: "arrow-right"
  }, "View details"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 24
    }
  }, splitVariants.map(sv => /*#__PURE__*/React.createElement("div", {
    key: sv.name
  }, /*#__PURE__*/React.createElement(SubLabel, null, sv.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20,
      flexWrap: 'wrap'
    }
  }, sv.states.map((s, si) => /*#__PURE__*/React.createElement("div", {
    key: si,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      height: 36,
      borderRadius: 8,
      overflow: 'hidden',
      cursor: s.dim ? 'not-allowed' : 'pointer',
      background: s.bg,
      color: s.color,
      boxShadow: s.shadow || 'none',
      border: s.border || 'none',
      fontFamily: 'var(--sv-font-ui)',
      fontWeight: 600,
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      padding: '0 14px',
      display: 'flex',
      alignItems: 'center'
    }
  }, "Save"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 1,
      background: s.divider,
      alignSelf: 'stretch',
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 32,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Caret, null))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 10,
      color: VA_TOKENS.soft
    }
  }, s.label))))))));
}

// Floating-label input (matches preview/inputs.html spec)
function VAFloatInput({
  label,
  defaultValue = '',
  type = 'text',
  error,
  hint,
  disabled,
  isSelect
}) {
  const [value, setValue] = React.useState(defaultValue);
  const [focused, setFocused] = React.useState(false);
  const floated = focused || value.length > 0;
  const borderColor = error ? '#EF4444' : focused ? '#257CFF' : disabled ? '#E3E8EF' : '#CDD5DF';
  const shadow = focused && !error ? '0 0 0 4px rgba(37,124,255,0.18)' : focused && error ? '0 0 0 4px rgba(239,68,68,0.16)' : 'none';
  const labelColor = disabled ? '#9AA4B2' : error ? focused ? '#B52020' : '#B52020' : focused ? '#257CFF' : '#697586';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 40
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: type,
    value: value,
    onChange: e => setValue(e.target.value),
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    disabled: disabled,
    readOnly: isSelect,
    style: {
      width: '100%',
      height: 40,
      boxSizing: 'border-box',
      border: `1px solid ${borderColor}`,
      borderRadius: 8,
      padding: isSelect ? '0 32px 0 12px' : '0 12px',
      fontSize: 14,
      fontFamily: 'inherit',
      color: disabled ? '#9AA4B2' : '#202939',
      background: disabled ? '#F8FAFC' : '#fff',
      outline: 'none',
      boxShadow: shadow,
      cursor: disabled ? 'not-allowed' : isSelect ? 'pointer' : 'text',
      transition: 'border-color 120ms ease, box-shadow 120ms ease'
    }
  }), /*#__PURE__*/React.createElement("label", {
    style: {
      position: 'absolute',
      left: 10,
      top: floated ? 0 : '50%',
      transform: 'translateY(-50%)',
      padding: '0 4px',
      fontSize: floated ? 12 : 14,
      color: labelColor,
      background: disabled ? '#F8FAFC' : '#fff',
      pointerEvents: 'none',
      lineHeight: 1,
      transition: 'top 160ms cubic-bezier(.2,.8,.2,1), font-size 160ms cubic-bezier(.2,.8,.2,1), color 120ms ease'
    }
  }, label), isSelect && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: 10,
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      color: error ? '#EF4444' : focused ? '#257CFF' : '#697586'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 6l4 4 4-4"
  })))), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      marginTop: 6,
      fontSize: 12,
      color: error ? '#B52020' : '#697586'
    }
  }, error || hint));
}
function VAInputsShowcase() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px 24px'
    }
  }, /*#__PURE__*/React.createElement(VAFloatInput, {
    label: "Lead Technician",
    defaultValue: "Aaron Keating"
  }), /*#__PURE__*/React.createElement(VAFloatInput, {
    label: "Service Advisor"
  }), /*#__PURE__*/React.createElement(VAFloatInput, {
    label: "Phone",
    type: "tel",
    defaultValue: "(555) 555",
    error: "Enter a complete phone number."
  }), /*#__PURE__*/React.createElement(VAFloatInput, {
    label: "VIN",
    defaultValue: "830971",
    disabled: true
  }), /*#__PURE__*/React.createElement(VAFloatInput, {
    label: "Customer",
    hint: "Click - label floats above the value."
  }), /*#__PURE__*/React.createElement(VAFloatInput, {
    label: "Vehicle",
    defaultValue: "2019 Toyota Tacoma"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: VA_TOKENS.line
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 10,
      fontWeight: 700,
      color: VA_TOKENS.soft,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      marginBottom: 14
    }
  }, "Dropdown"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px 24px'
    }
  }, /*#__PURE__*/React.createElement(VAFloatInput, {
    label: "Category*",
    isSelect: true
  }), /*#__PURE__*/React.createElement(VAFloatInput, {
    label: "Category*",
    defaultValue: "Hard Parts",
    isSelect: true
  }), /*#__PURE__*/React.createElement(VAFloatInput, {
    label: "Category*",
    isSelect: true,
    error: "This field is required."
  }), /*#__PURE__*/React.createElement(VAFloatInput, {
    label: "Manufacturer",
    defaultValue: "Freightliner",
    isSelect: true,
    disabled: true
  }))));
}
function VABadgesShowcase() {
  const badgeBase = {
    fontFamily: 'var(--sv-font-ui)',
    fontWeight: 500,
    fontSize: 11,
    lineHeight: '11px',
    padding: '2px 8px',
    display: 'inline-flex',
    alignItems: 'center',
    height: 22,
    boxSizing: 'border-box',
    whiteSpace: 'nowrap'
  };
  const tones = [{
    name: 'Success',
    bordered: {
      background: '#EDFCF2',
      border: '1px solid #73E2A3',
      color: '#087443'
    },
    solid: {
      background: '#D3F8DF',
      color: '#087443'
    },
    location: true
  }, {
    name: 'Warning',
    bordered: {
      background: '#FFFCF5',
      border: '1px solid #FEDF89',
      color: '#B54708'
    },
    solid: {
      background: '#FEF0C7',
      color: '#B54708'
    }
  }, {
    name: 'Danger',
    bordered: {
      background: '#FFFBFA',
      border: '1px solid #FECDCA',
      color: '#D92D20'
    },
    solid: {
      background: '#FEE4E2',
      color: '#B42318'
    }
  }, {
    name: 'Info',
    bordered: {
      background: '#E9F5FF',
      border: '1px solid #82C1FB',
      color: '#175CD3'
    },
    solid: {
      background: '#E9F5FF',
      color: '#175CD3'
    }
  }, {
    name: 'Neutral',
    bordered: {
      background: '#EEF2F6',
      border: '1px solid #CDD5DF',
      color: '#373A41'
    },
    solid: {
      background: '#EEF2F6',
      color: '#364152'
    }
  }];
  const colHeads = ['Rounded · Border', 'Rounded · Solid', 'Square · Border', 'Square · Solid', 'Location'];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: `1px solid ${VA_TOKENS.line}`,
      borderRadius: 8,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '80px repeat(4, 1fr) 120px',
      background: VA_TOKENS.bgGrey,
      borderBottom: `1px solid ${VA_TOKENS.line}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '9px 14px'
    }
  }), colHeads.map((h, i) => /*#__PURE__*/React.createElement("div", {
    key: h,
    style: {
      padding: '9px 14px',
      borderLeft: `1px solid ${VA_TOKENS.line}`,
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 10,
      fontWeight: 700,
      color: VA_TOKENS.soft,
      textTransform: 'uppercase',
      letterSpacing: '0.1em'
    }
  }, h))), tones.map((t, ti) => /*#__PURE__*/React.createElement("div", {
    key: t.name,
    style: {
      display: 'grid',
      gridTemplateColumns: '80px repeat(4, 1fr) 120px',
      borderTop: ti > 0 ? `1px solid ${VA_TOKENS.line}` : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px',
      display: 'flex',
      alignItems: 'center',
      fontSize: 12,
      fontWeight: 600,
      color: VA_TOKENS.muted
    }
  }, t.name), [{
    ...badgeBase,
    borderRadius: 9999,
    ...t.bordered
  }, {
    ...badgeBase,
    borderRadius: 9999,
    ...t.solid
  }, {
    ...badgeBase,
    borderRadius: 8,
    ...t.bordered
  }, {
    ...badgeBase,
    borderRadius: 8,
    ...t.solid
  }].map((style, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      padding: '14px',
      borderLeft: `1px solid ${VA_TOKENS.line}`,
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: style
  }, "Label text"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px',
      borderLeft: `1px solid ${VA_TOKENS.line}`,
      display: 'flex',
      alignItems: 'center'
    }
  }, t.location && /*#__PURE__*/React.createElement("span", {
    style: {
      background: '#fff',
      border: '1px solid #D5D7DA',
      color: '#364152',
      borderRadius: 8,
      padding: '2px 4px 2px 8px',
      height: 24,
      fontWeight: 600,
      fontSize: 11,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      boxSizing: 'border-box'
    }
  }, "Storage ", /*#__PURE__*/React.createElement("span", {
    style: {
      background: '#fff',
      border: '1px solid #D5D7DA',
      borderRadius: 8,
      padding: '0 6px',
      height: 16,
      color: '#414651',
      fontWeight: 500,
      fontSize: 11,
      lineHeight: '16px',
      display: 'inline-flex',
      alignItems: 'center'
    }
  }, "4")))))));
}
function VAControlsShowcase() {
  // Simplified: show key states inline, no table

  const CheckBox = ({
    checked,
    state,
    indeterminate
  }) => {
    const isHover = state === 'hover',
      isFocus = state === 'focus',
      isDisabled = state === 'disabled';
    let bg = '#fff',
      border = '#CDD5DF',
      shadow = 'none';
    if (checked) {
      bg = '#E9F5FF';
      border = '#257CFF';
    }
    if (checked && isHover) bg = '#D8ECFF';
    if (!checked && isHover) bg = '#EEF2F6';
    if (isFocus) {
      shadow = '0 0 0 4px #D8ECFF';
      border = '#257CFF';
    }
    if (isDisabled) {
      bg = '#EEF2F6';
      border = '#CDD5DF';
      shadow = 'none';
    }
    const stroke = isDisabled ? '#CDD5DF' : '#257CFF';
    return /*#__PURE__*/React.createElement("span", {
      style: {
        width: 16,
        height: 16,
        borderRadius: 4,
        border: `1px solid ${border}`,
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: shadow
      }
    }, checked && /*#__PURE__*/React.createElement("svg", {
      width: "10",
      height: "10",
      viewBox: "0 0 10 10",
      fill: "none"
    }, indeterminate ? /*#__PURE__*/React.createElement("path", {
      d: "M2.5 5h5",
      stroke: stroke,
      strokeWidth: "1.5",
      strokeLinecap: "round"
    }) : /*#__PURE__*/React.createElement("path", {
      d: "M2 5l2.5 2.5L8 3",
      stroke: stroke,
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    })));
  };
  const RadioBtn = ({
    checked,
    state
  }) => {
    const isHover = state === 'hover',
      isFocus = state === 'focus',
      isDisabled = state === 'disabled';
    let bg = '#fff',
      border = '#CDD5DF',
      shadow = 'none';
    if (checked) {
      bg = '#E9F5FF';
      border = '#257CFF';
    }
    if (checked && isHover) bg = '#D8ECFF';
    if (!checked && isHover) bg = '#EEF2F6';
    if (isFocus) {
      shadow = '0 0 0 4px #D8ECFF';
      border = '#257CFF';
    }
    if (isDisabled) {
      bg = '#EEF2F6';
      border = '#CDD5DF';
      shadow = 'none';
    }
    return /*#__PURE__*/React.createElement("span", {
      style: {
        width: 16,
        height: 16,
        borderRadius: '50%',
        border: `1px solid ${border}`,
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: shadow
      }
    }, checked && /*#__PURE__*/React.createElement("span", {
      style: {
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: isDisabled ? '#CDD5DF' : '#257CFF'
      }
    }));
  };
  const ToggleBtn = ({
    on,
    state
  }) => {
    const isHover = state === 'hover',
      isFocus = state === 'focus',
      isDisabled = state === 'disabled';
    let bg = '#EEF2F6',
      shadow = 'none';
    if (on) bg = '#2170E6';
    if (on && isHover) bg = '#175CD3';
    if (!on && isHover) bg = '#E3E8EF';
    if (isFocus && !on) {
      bg = '#F8FAFC';
      shadow = '0 0 0 4px #D8ECFF';
    }
    if (isFocus && on) {
      bg = '#2170E6';
      shadow = '0 0 0 4px #D8ECFF';
    }
    if (isDisabled) {
      bg = '#EEF2F6';
      shadow = 'none';
    }
    return /*#__PURE__*/React.createElement("span", {
      style: {
        width: 36,
        height: 20,
        borderRadius: 12,
        background: bg,
        position: 'relative',
        flexShrink: 0,
        display: 'inline-block',
        boxShadow: shadow
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        width: 16,
        height: 16,
        borderRadius: '50%',
        background: isDisabled ? '#F8FAFC' : '#fff',
        top: 2,
        left: on ? 18 : 2,
        boxShadow: '0px 1px 2px rgba(16,24,40,0.06),0px 1px 3px rgba(16,24,40,0.1)',
        transition: 'left 120ms'
      }
    }));
  };
  const Item = ({
    label,
    children
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      alignItems: 'center'
    }
  }, children, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: VA_TOKENS.soft,
      fontFamily: 'var(--sv-font-mono)'
    }
  }, label));
  const Divider = () => /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      height: 28,
      background: VA_TOKENS.line,
      alignSelf: 'center'
    }
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 90,
      fontSize: 12,
      fontWeight: 600,
      color: VA_TOKENS.muted,
      paddingBottom: 18,
      flexShrink: 0
    }
  }, "Checkbox"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 40,
      alignItems: 'flex-end',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Item, {
    label: "Default"
  }, /*#__PURE__*/React.createElement(CheckBox, {
    checked: false
  })), /*#__PURE__*/React.createElement(Item, {
    label: "Checked"
  }, /*#__PURE__*/React.createElement(CheckBox, {
    checked: true
  })), /*#__PURE__*/React.createElement(Item, {
    label: "Indeterminate"
  }, /*#__PURE__*/React.createElement(CheckBox, {
    checked: true,
    indeterminate: true
  })), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement(Item, {
    label: "Focus"
  }, /*#__PURE__*/React.createElement(CheckBox, {
    checked: true,
    state: "focus"
  })), /*#__PURE__*/React.createElement(Item, {
    label: "Disabled"
  }, /*#__PURE__*/React.createElement(CheckBox, {
    checked: true,
    state: "disabled"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 90,
      fontSize: 12,
      fontWeight: 600,
      color: VA_TOKENS.muted,
      paddingBottom: 18,
      flexShrink: 0
    }
  }, "Radio"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 40,
      alignItems: 'flex-end',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Item, {
    label: "Default"
  }, /*#__PURE__*/React.createElement(RadioBtn, {
    checked: false
  })), /*#__PURE__*/React.createElement(Item, {
    label: "Checked"
  }, /*#__PURE__*/React.createElement(RadioBtn, {
    checked: true
  })), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement(Item, {
    label: "Focus"
  }, /*#__PURE__*/React.createElement(RadioBtn, {
    checked: true,
    state: "focus"
  })), /*#__PURE__*/React.createElement(Item, {
    label: "Disabled"
  }, /*#__PURE__*/React.createElement(RadioBtn, {
    checked: true,
    state: "disabled"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 90,
      fontSize: 12,
      fontWeight: 600,
      color: VA_TOKENS.muted,
      paddingBottom: 18,
      flexShrink: 0
    }
  }, "Toggle"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 40,
      alignItems: 'flex-end',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Item, {
    label: "Off"
  }, /*#__PURE__*/React.createElement(ToggleBtn, {
    on: false
  })), /*#__PURE__*/React.createElement(Item, {
    label: "On"
  }, /*#__PURE__*/React.createElement(ToggleBtn, {
    on: true
  })), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement(Item, {
    label: "Focus"
  }, /*#__PURE__*/React.createElement(ToggleBtn, {
    on: true,
    state: "focus"
  })), /*#__PURE__*/React.createElement(Item, {
    label: "Disabled"
  }, /*#__PURE__*/React.createElement(ToggleBtn, {
    on: false,
    state: "disabled"
  })))));
}
function VANotificationsShowcase() {
  const XIcon = () => /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  }));
  const CloseBtn = () => /*#__PURE__*/React.createElement("button", {
    style: {
      flexShrink: 0,
      width: 20,
      height: 20,
      background: 'none',
      border: 0,
      padding: 0,
      color: '#9AA4B2',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(XIcon, null));
  const toasts = [{
    tone: 'success',
    iconBg: '#ECFDF3',
    iconColor: '#067647',
    icon: /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2.25",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("polyline", {
      points: "20 6 9 17 4 12"
    })),
    title: 'WO-1041 marked Completed',
    support: 'The work order is closed and the invoice is ready to send.',
    actions: [{
      label: 'Dismiss',
      muted: true
    }, {
      label: 'View invoice',
      muted: false
    }]
  }, {
    tone: 'warning',
    iconBg: '#FFFAEB',
    iconColor: '#B47A00',
    icon: /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "9",
      x2: "12",
      y2: "13"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "17",
      x2: "12.01",
      y2: "17"
    })),
    title: '3 Lines awaiting authorization',
    support: 'Customer approval required before technicians can begin.',
    actions: [{
      label: 'Undo',
      muted: true
    }]
  }, {
    tone: 'error',
    iconBg: '#FEF3F2',
    iconColor: '#B52020',
    icon: /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "10"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "8",
      x2: "12",
      y2: "12"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "16",
      x2: "12.01",
      y2: "16"
    })),
    title: "Couldn't authorize this Line",
    support: 'Customer signature is required before authorization.',
    actions: [{
      label: 'Dismiss',
      muted: true
    }, {
      label: 'Request signature',
      muted: false
    }]
  }, {
    tone: 'info',
    iconBg: '#E9F5FF',
    iconColor: '#0868A7',
    icon: /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "10"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "16",
      x2: "12",
      y2: "12"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "8",
      x2: "12.01",
      y2: "8"
    })),
    title: 'Version 1.4.1 is now available',
    support: 'Includes the new dashboard view. Pages will now load faster.',
    actions: [{
      label: 'Later',
      muted: true
    }, {
      label: "What's new",
      muted: false
    }]
  }];
  const compactToasts = [{
    iconColor: '#067647',
    barColor: '#067647',
    label: 'Work Order saved',
    icon: /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2.25",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M22 11.08V12a10 10 0 1 1-5.93-9.14"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: "22 4 12 14.01 9 11.01"
    }))
  }, {
    iconColor: '#B47A00',
    barColor: '#B47A00',
    label: '2 parts low in stock',
    icon: /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "9",
      x2: "12",
      y2: "13"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "17",
      x2: "12.01",
      y2: "17"
    }))
  }, {
    iconColor: '#B52020',
    barColor: '#B52020',
    label: "Couldn't sync timesheet",
    icon: /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "10"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "15",
      y1: "9",
      x2: "9",
      y2: "15"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "9",
      y1: "9",
      x2: "15",
      y2: "15"
    }))
  }];
  const alerts = [{
    style: {
      background: '#F6FEF9',
      borderColor: '#ABEFC6',
      color: '#067647'
    },
    dismissable: true,
    icon: /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2.25",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M22 11.08V12a10 10 0 1 1-5.93-9.14"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: "22 4 12 14.01 9 11.01"
    })),
    title: 'Invoice INV-04821 sent to PepsiCo Foods',
    support: "A copy is in the customer's outbox. Payment terms: Net 30."
  }, {
    style: {
      background: '#FFFAEB',
      borderColor: '#FEDF89',
      color: '#B47A00'
    },
    dismissable: true,
    icon: /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "9",
      x2: "12",
      y2: "13"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "17",
      x2: "12.01",
      y2: "17"
    })),
    title: '3 Lines awaiting authorization',
    support: 'Customer approval required before technicians can begin work.'
  }, {
    style: {
      background: '#FFFBFA',
      borderColor: '#FECDCA',
      color: '#B52020'
    },
    dismissable: true,
    icon: /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "10"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "8",
      x2: "12",
      y2: "12"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "16",
      x2: "12.01",
      y2: "16"
    })),
    title: 'Problem saving this Work Order',
    support: 'Bin location required for Part #BR-44211. Add a bin and try again.'
  }, {
    style: {
      background: '#E9F5FF',
      borderColor: '#BDD0FF',
      color: '#0868A7'
    },
    dismissable: true,
    icon: /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "10"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "16",
      x2: "12",
      y2: "12"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "8",
      x2: "12.01",
      y2: "8"
    })),
    title: 'Scheduled maintenance - Sunday 2:00 AM PT',
    support: 'Shopview will be unavailable for ~30 minutes during the 1.4.1 deploy.'
  }];
  const SubLabel = ({
    children
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 10,
      fontWeight: 700,
      color: VA_TOKENS.soft,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      marginBottom: 14
    }
  }, children);
  const toastCard = {
    background: '#fff',
    border: '1px solid #EEF2F6',
    borderRadius: 12,
    boxShadow: '0 4px 6px -2px rgba(16,24,40,0.03),0 12px 16px -4px rgba(16,24,40,0.08)'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SubLabel, null, "Toast \xB7 Full (400 \xD7 auto)"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16
    }
  }, toasts.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.tone,
    style: {
      ...toastCard,
      padding: 16,
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      flexShrink: 0,
      borderRadius: 9999,
      background: t.iconBg,
      color: t.iconColor,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, t.icon), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      lineHeight: '20px',
      color: '#1D2939'
    }
  }, t.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      lineHeight: '20px',
      color: '#697586',
      marginTop: 4
    }
  }, t.support), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      display: 'flex',
      gap: 16
    }
  }, t.actions.map(a => /*#__PURE__*/React.createElement("button", {
    key: a.label,
    style: {
      fontFamily: 'var(--sv-font-ui)',
      fontSize: 14,
      fontWeight: 600,
      cursor: 'pointer',
      background: 'none',
      border: 0,
      padding: 0,
      color: a.muted ? '#697586' : '#175CD3'
    }
  }, a.label)))), /*#__PURE__*/React.createElement(CloseBtn, null))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SubLabel, null, "Toast \xB7 Compact (single line)"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      flexWrap: 'wrap'
    }
  }, compactToasts.map((t, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...toastCard,
      position: 'relative',
      overflow: 'hidden',
      padding: '10px 16px',
      display: 'flex',
      gap: 12,
      alignItems: 'center',
      minWidth: 260
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 20,
      height: 20,
      flexShrink: 0,
      color: t.iconColor,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, t.icon), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontSize: 14,
      fontWeight: 600,
      lineHeight: '20px',
      color: '#1D2939'
    }
  }, t.label), /*#__PURE__*/React.createElement(CloseBtn, null), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: 3,
      overflow: 'hidden',
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      background: t.barColor,
      width: '60%'
    }
  })))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SubLabel, null, "Inline alert \xB7 Banner"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, alerts.map((a, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      borderRadius: 8,
      border: `1px solid ${a.style.borderColor}`,
      background: a.style.background,
      color: a.style.color,
      padding: '12px 14px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 20,
      height: 20,
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 1
    }
  }, a.icon), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      lineHeight: '20px'
    }
  }, a.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      lineHeight: '20px',
      opacity: 0.8,
      marginTop: 2
    }
  }, a.support)), a.dismissable && /*#__PURE__*/React.createElement("button", {
    style: {
      flexShrink: 0,
      width: 20,
      height: 20,
      background: 'none',
      border: 0,
      padding: 0,
      color: 'currentColor',
      opacity: 0.6,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(XIcon, null)))))));
}
function VAPillTabs({
  tabs,
  value,
  onChange
}) {
  const [hovered, setHovered] = React.useState(null);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      gap: 2,
      alignItems: 'center'
    }
  }, tabs.map(t => {
    const active = t.key === value;
    const isHov = hovered === t.key && !active;
    return /*#__PURE__*/React.createElement("button", {
      key: t.key,
      onClick: () => onChange?.(t.key),
      onMouseEnter: () => setHovered(t.key),
      onMouseLeave: () => setHovered(null),
      style: {
        height: 32,
        padding: '0 12px',
        border: 0,
        background: active || isHov ? '#EEF2F6' : 'transparent',
        borderRadius: 6,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontFamily: 'var(--sv-font-ui)',
        fontWeight: 500,
        fontSize: 14,
        lineHeight: '20px',
        color: active ? '#0F111A' : '#697586',
        cursor: 'pointer',
        transition: 'background-color 120ms ease'
      }
    }, t.label, typeof t.count === 'number' && /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'inherit'
      }
    }, "(", t.count, ")"));
  }));
}

// 07. Components
function VAComponents() {
  const [tab, setTab] = React.useState('lines');
  return /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement(VASectionHead, {
    n: "06",
    id: "components",
    kicker: "Component Library",
    title: "Twelve primitives. One blue.",
    lede: "Every screen reduces to a small set of primitives. Reuse aggressively. Build new ones only when the existing set truly doesn't cover the case."
  }), /*#__PURE__*/React.createElement(VAContainer, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(12, 1fr)',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: 'span 12',
      ...VA_CARD,
      padding: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      margin: 0,
      color: VA_TOKENS.ink
    }
  }, "Buttons"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11,
      color: VA_TOKENS.soft
    }
  }, "3 variants \xD7 3 sizes")), /*#__PURE__*/React.createElement(VAButtonsShowcase, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: 'span 12',
      ...VA_CARD,
      padding: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      margin: 0,
      color: VA_TOKENS.ink
    }
  }, "Inputs"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11,
      color: VA_TOKENS.soft
    }
  }, "floating label \xB7 text \xB7 dropdown")), /*#__PURE__*/React.createElement(VAInputsShowcase, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: 'span 12',
      ...VA_CARD,
      padding: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      margin: 0,
      color: VA_TOKENS.ink
    }
  }, "Badges"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11,
      color: VA_TOKENS.soft
    }
  }, "5 tones \xD7 4 variants")), /*#__PURE__*/React.createElement(VABadgesShowcase, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: 'span 12',
      ...VA_CARD,
      padding: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      margin: 0,
      color: VA_TOKENS.ink
    }
  }, "Tabs"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11,
      color: VA_TOKENS.soft
    }
  }, "pill \xB7 32px \xB7 radius-6")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 10,
      fontWeight: 700,
      color: VA_TOKENS.soft,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      marginBottom: 12
    }
  }, "States"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      gap: 2,
      alignItems: 'center',
      padding: '8px',
      background: VA_TOKENS.bgGrey,
      borderRadius: 8,
      border: `1px solid ${VA_TOKENS.line}`
    }
  }, [{
    label: 'Default',
    active: false,
    forced: false
  }, {
    label: 'Hover',
    active: false,
    forced: true
  }, {
    label: 'Active',
    active: true,
    forced: false
  }].map(({
    label,
    active,
    forced
  }) => /*#__PURE__*/React.createElement("div", {
    key: label,
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      height: 32,
      padding: '0 12px',
      border: 0,
      background: active || forced ? '#EEF2F6' : 'transparent',
      borderRadius: 6,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: 'var(--sv-font-ui)',
      fontWeight: 500,
      fontSize: 14,
      color: active ? '#0F111A' : '#697586',
      cursor: 'pointer'
    }
  }, "Lines ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'inherit'
    }
  }, "(3)")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 10,
      color: VA_TOKENS.soft
    }
  }, label))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 10,
      fontWeight: 700,
      color: VA_TOKENS.soft,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      marginBottom: 12
    }
  }, "Live groups"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(VAPillTabs, {
    value: tab,
    onChange: setTab,
    tabs: [{
      key: 'lines',
      label: 'Lines',
      count: 17
    }, {
      key: 'parts',
      label: 'Parts',
      count: 20
    }, {
      key: 'returns',
      label: 'Part Returns'
    }, {
      key: 'notes',
      label: 'Notes',
      count: 2
    }, {
      key: 'time',
      label: 'Timesheets',
      count: 2
    }, {
      key: 'stats',
      label: 'Statistics'
    }, {
      key: 'finance',
      label: 'Invoice'
    }]
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: 'span 6',
      ...VA_CARD,
      padding: 28
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      margin: '0 0 20px',
      color: VA_TOKENS.ink
    }
  }, "Card \xB7 Work Order Line"), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: VA_TOKENS.soft,
      fontFamily: 'var(--sv-font-mono)'
    }
  }, "L-04"), /*#__PURE__*/React.createElement("h4", {
    style: {
      margin: '4px 0 0',
      fontSize: 16,
      fontWeight: 600
    }
  }, "Replace front brake pads"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: VA_TOKENS.muted,
      marginTop: 6
    }
  }, "Tech: M. Diaz \xB7 2.5 hr")), /*#__PURE__*/React.createElement(Badge, {
    tone: "warning"
  }, "Authorization Required")))), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: 'span 6',
      ...VA_CARD,
      padding: 28
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      margin: '0 0 20px',
      color: VA_TOKENS.ink
    }
  }, "Avatar"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: "Sam Hill",
    size: 40
  }), /*#__PURE__*/React.createElement(Avatar, {
    name: "Pat Liu",
    size: 40
  }), /*#__PURE__*/React.createElement(Avatar, {
    name: "Mae Diaz",
    size: 40
  }), /*#__PURE__*/React.createElement(Avatar, {
    name: "Aaron K",
    size: 40
  }), /*#__PURE__*/React.createElement(Avatar, {
    name: "Jane Doe",
    size: 40
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center',
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: "Sam Hill",
    size: 32
  }), /*#__PURE__*/React.createElement(Avatar, {
    name: "Pat Liu",
    size: 32
  }), /*#__PURE__*/React.createElement(Avatar, {
    name: "Mae Diaz",
    size: 32
  }), /*#__PURE__*/React.createElement(Avatar, {
    name: "Sam Hill",
    size: 24
  }), /*#__PURE__*/React.createElement(Avatar, {
    name: "Pat Liu",
    size: 24
  }), /*#__PURE__*/React.createElement(Avatar, {
    name: "Mae Diaz",
    size: 24
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: 'span 12',
      ...VA_CARD,
      padding: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      margin: 0,
      color: VA_TOKENS.ink
    }
  }, "Controls"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11,
      color: VA_TOKENS.soft
    }
  }, "checkbox \xB7 radio \xB7 toggle")), /*#__PURE__*/React.createElement(VAControlsShowcase, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: 'span 12',
      ...VA_CARD,
      padding: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      margin: 0,
      color: VA_TOKENS.ink
    }
  }, "Filters"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11,
      color: VA_TOKENS.soft
    }
  }, "chip \xB7 dropdown \xB7 bar")), /*#__PURE__*/React.createElement(VAFiltersBlock, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: 'span 12',
      ...VA_CARD,
      padding: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      margin: 0,
      color: VA_TOKENS.ink
    }
  }, "Notifications"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11,
      color: VA_TOKENS.soft
    }
  }, "toast \xB7 compact \xB7 inline alert")), /*#__PURE__*/React.createElement(VANotificationsShowcase, null)))));
}

// Filters showcase inside the components section
function VAFiltersBlock() {
  const [statusVal, setStatusVal] = React.useState(['Estimate', 'In progress', 'Approved']);
  const [custVal, setCustVal] = React.useState([]);
  const RowLabel = ({
    children
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11,
      color: VA_TOKENS.soft,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      marginBottom: 10
    }
  }, children);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 28
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(RowLabel, null, "Chip states"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 10,
      padding: 16,
      background: VA_TOKENS.bgGrey,
      borderRadius: 8,
      border: `1px solid ${VA_TOKENS.line}`
    }
  }, [['Default', {
    state: 'default'
  }], ['Hover', {
    state: 'hover'
  }], ['Open', {
    state: 'open'
  }], ['Selected', {
    hasValue: true,
    valueText: 'In progress',
    onClear: () => {}
  }]].map(([label, props]) => /*#__PURE__*/React.createElement("div", {
    key: label,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(FilterChip, _extends({
    icon: SVIcons.ICON_LOAD,
    label: "Status"
  }, props)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: VA_TOKENS.soft,
      fontFamily: 'var(--sv-font-mono)'
    }
  }, label))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(RowLabel, null, "Filter bar - applied set"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      flexWrap: 'wrap',
      padding: '10px 14px',
      background: '#fff',
      border: `1px solid ${VA_TOKENS.line}`,
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement(FilterChip, {
    icon: SVIcons.ICON_LOAD,
    label: "Status",
    hasValue: true,
    valueText: "In progress",
    onClear: () => {}
  }), /*#__PURE__*/React.createElement(FilterChip, {
    icon: SVIcons.ICON_USER,
    label: "Customer",
    hasValue: true,
    valueText: "RF Heavy, +2",
    onClear: () => {}
  }), /*#__PURE__*/React.createElement(FilterChip, {
    icon: SVIcons.ICON_WRENCH,
    label: "Lead Technician"
  }), /*#__PURE__*/React.createElement(FilterChip, {
    icon: SVIcons.ICON_HEADSET,
    label: "Service Advisor"
  }), /*#__PURE__*/React.createElement(FilterChip, {
    icon: SVIcons.ICON_TRUCK,
    label: "Asset on site"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: VA_TOKENS.blue,
      fontWeight: 500,
      fontSize: 14,
      paddingLeft: 8,
      cursor: 'pointer'
    }
  }, "Clear filters"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(RowLabel, null, "Dropdowns"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24,
      background: VA_TOKENS.bgGrey,
      border: `1px solid ${VA_TOKENS.line}`,
      borderRadius: 8,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(FilterChip, {
    icon: SVIcons.ICON_LOAD,
    label: "Status",
    hasValue: statusVal.length > 0,
    valueText: statusVal.length ? `${statusVal[0]}${statusVal.length > 1 ? `, +${statusVal.length - 1}` : ''}` : null,
    onClear: () => setStatusVal([])
  }), /*#__PURE__*/React.createElement(StatusDropdown, {
    options: window.STATUSES,
    value: statusVal,
    onChange: setStatusVal,
    onClear: () => setStatusVal([]),
    width: 260
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: VA_TOKENS.soft,
      fontFamily: 'var(--sv-font-mono)'
    }
  }, "Status - multi-select list")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24,
      background: VA_TOKENS.bgGrey,
      border: `1px solid ${VA_TOKENS.line}`,
      borderRadius: 8,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(FilterChip, {
    icon: SVIcons.ICON_USER,
    label: "Customer",
    hasValue: custVal.length > 0,
    valueText: custVal.length ? `${custVal[0]}${custVal.length > 1 ? `, +${custVal.length - 1}` : ''}` : null,
    onClear: () => setCustVal([])
  }), /*#__PURE__*/React.createElement(FilterDropdown, {
    title: "Customer",
    options: window.CUSTOMERS,
    value: custVal,
    onChange: setCustVal,
    onClear: () => setCustVal([]),
    width: 316
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: VA_TOKENS.soft,
      fontFamily: 'var(--sv-font-mono)'
    }
  }, "Customer - search + checklist")))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: VA_TOKENS.soft,
      lineHeight: 1.6
    }
  }, "28px pill \xB7 radius 100 \xB7 padding 0 10 \xB7 gap 8. Default: transparent / grey-700. Hover & open: grey-100. Selected: primary-100 fill, primary-500 text. Dropdown: 12px radius, shadow-lg, 320px wide for search variants, 240-260px for status."));
}
function VATogglePair() {
  const [a, setA] = React.useState(true);
  const [b, setB] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Toggle, {
    on: a,
    onChange: setA
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13
    }
  }, "Show financials")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Toggle, {
    on: b,
    onChange: setB
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13
    }
  }, "Notify on completion")));
}
function VANotice({
  tone,
  text
}) {
  const tones = {
    success: {
      bg: '#ABF5C4',
      fg: '#108737',
      icon: 'check'
    },
    warning: {
      bg: '#FFF5E0',
      fg: '#B47A00',
      icon: 'bell'
    },
    error: {
      bg: '#FCA397',
      fg: '#B52020',
      icon: 'x'
    },
    info: {
      bg: '#E5EDFF',
      fg: '#0868A7',
      icon: 'bell'
    }
  }[tone];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 16px',
      background: tones.bg,
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 28,
      height: 28,
      borderRadius: 999,
      background: '#fff',
      color: tones.fg,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: tones.icon,
    size: 14,
    stroke: 2.5
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: tones.fg,
      fontWeight: 500
    }
  }, text));
}

// 07. AI Agent Icon
function VAAIAgent() {
  const [demoState, setDemoState] = React.useState('idle');
  const AGENT_GRAD = 'linear-gradient(135deg, #7c3aed, #db2777)';
  const [iconPillSize, setIconPillSize] = React.useState(28);
  const textPillRef = React.useRef(null);
  React.useLayoutEffect(() => {
    if (textPillRef.current) setIconPillSize(textPillRef.current.offsetHeight);
  }, []);
  function AIIcon({
    size = 24,
    color = VA_TOKENS.ink,
    state = 'idle'
  }) {
    const containerRef = React.useRef(null);
    React.useEffect(() => {
      const container = containerRef.current;
      if (!container) return;
      let icon = container.querySelector('ai-agent-icon');
      if (!icon) {
        icon = document.createElement('ai-agent-icon');
        container.appendChild(icon);
      }
      icon.setAttribute('size', String(size));
      icon.setAttribute('color', color);
      icon.setAttribute('state', state);
    });
    return /*#__PURE__*/React.createElement("span", {
      ref: containerRef,
      style: {
        display: 'inline-flex',
        lineHeight: 0
      }
    });
  }
  const sizes = [16, 24, 32, 48, 64, 96];
  return /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement(VASectionHead, {
    n: "07",
    id: "ai-agent",
    kicker: "AI Agent",
    title: "One icon. Two states.",
    lede: "A self-contained animated web component with a gear-cog body and two eyes. Hover triggers a one-shot spin. Thinking state runs a continuous loop with eye pulse."
  }), /*#__PURE__*/React.createElement(VAContainer, null, /*#__PURE__*/React.createElement("div", {
    style: {
      ...VA_CARD,
      padding: 28,
      display: 'flex',
      flexDirection: 'column',
      gap: 28
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 10,
      fontWeight: 700,
      color: VA_TOKENS.soft,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      marginBottom: 20
    }
  }, "Sizes"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 32,
      alignItems: 'flex-end',
      flexWrap: 'wrap'
    }
  }, sizes.map(s => /*#__PURE__*/React.createElement("div", {
    key: s,
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(AIIcon, {
    size: s,
    color: VA_TOKENS.ink,
    state: "idle"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 10,
      color: VA_TOKENS.soft
    }
  }, s))))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: VA_TOKENS.line
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 48
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 10,
      fontWeight: 700,
      color: VA_TOKENS.soft,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      marginBottom: 20
    }
  }, "States"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 48,
      alignItems: 'flex-start'
    }
  }, [{
    s: 'idle',
    note: 'hover-spin · random blink'
  }, {
    s: 'thinking',
    note: 'continuous spin · eye pulse'
  }].map(({
    s,
    note
  }) => /*#__PURE__*/React.createElement("div", {
    key: s,
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(AIIcon, {
    size: 52,
    color: VA_TOKENS.ink,
    state: s
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11,
      color: VA_TOKENS.blue
    }
  }, s), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: VA_TOKENS.soft,
      textAlign: 'center',
      maxWidth: 110,
      lineHeight: 1.5
    }
  }, note)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24,
      display: 'flex',
      gap: 8,
      alignItems: 'center'
    }
  }, ['idle', 'thinking'].map(s => /*#__PURE__*/React.createElement("button", {
    key: s,
    onClick: () => setDemoState(s),
    style: {
      height: 28,
      padding: '0 12px',
      border: `1px solid ${demoState === s ? VA_TOKENS.blue : VA_TOKENS.line}`,
      background: demoState === s ? '#E9F5FF' : 'transparent',
      borderRadius: 6,
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11,
      color: demoState === s ? VA_TOKENS.blue : VA_TOKENS.muted,
      cursor: 'pointer',
      transition: 'all 120ms ease'
    }
  }, s)), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 4
    }
  }, /*#__PURE__*/React.createElement(AIIcon, {
    size: 26,
    color: VA_TOKENS.ink,
    state: demoState
  })))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 10,
      fontWeight: 700,
      color: VA_TOKENS.soft,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      marginBottom: 20
    }
  }, "In context"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: VA_TOKENS.soft,
      marginBottom: 10
    }
  }, "Icon button"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'center'
    }
  }, [{
    bg: VA_TOKENS.bgGrey,
    border: `1px solid ${VA_TOKENS.line}`,
    color: VA_TOKENS.ink,
    label: 'light'
  }, {
    bg: '#202939',
    border: `1px solid #364152`,
    color: '#ffffff',
    label: 'dark'
  }, {
    bg: AGENT_GRAD,
    border: 'none',
    color: '#ffffff',
    label: 'brand'
  }].map(({
    bg,
    border,
    color,
    label
  }) => /*#__PURE__*/React.createElement("div", {
    key: label,
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 999,
      background: bg,
      border,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(AIIcon, {
    size: 20,
    color: color
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: VA_TOKENS.soft,
      fontFamily: 'var(--sv-font-mono)'
    }
  }, label))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: VA_TOKENS.soft,
      marginBottom: 10
    }
  }, "Pill"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: textPillRef,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      padding: '7px 12px',
      background: VA_TOKENS.bgGrey,
      border: `1px solid ${VA_TOKENS.line}`,
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement(AIIcon, {
    size: 14,
    color: VA_TOKENS.muted
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 500,
      color: VA_TOKENS.muted,
      fontFamily: 'var(--sv-font-ui)'
    }
  }, "AI Agent")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: iconPillSize,
      height: iconPillSize,
      background: VA_TOKENS.bgGrey,
      border: `1px solid ${VA_TOKENS.line}`,
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement(AIIcon, {
    size: 14,
    color: VA_TOKENS.muted
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      padding: '7px 12px',
      background: AGENT_GRAD,
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement(AIIcon, {
    size: 14,
    color: "#ffffff",
    state: "thinking"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 500,
      color: '#fff',
      fontFamily: 'var(--sv-font-ui)'
    }
  }, "Thinking\u2026")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: iconPillSize,
      height: iconPillSize,
      background: AGENT_GRAD,
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement(AIIcon, {
    size: 14,
    color: "#ffffff",
    state: "thinking"
  })))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: VA_TOKENS.soft,
      marginBottom: 10
    }
  }, "FAB \xB7 48\xD748 \xB7 radius-lg"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 48,
      height: 48,
      background: VA_TOKENS.bgGrey,
      border: `1px solid ${VA_TOKENS.line}`,
      borderRadius: 14,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 12px rgba(15,17,26,0.08)'
    }
  }, /*#__PURE__*/React.createElement(AIIcon, {
    size: 24,
    color: VA_TOKENS.ink
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 48,
      height: 48,
      background: AGENT_GRAD,
      borderRadius: 14,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 16px rgba(124,58,237,0.28)'
    }
  }, /*#__PURE__*/React.createElement(AIIcon, {
    size: 24,
    color: "#ffffff",
    state: "thinking"
  }))))))))));
}
function VAFooter() {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      marginTop: 96,
      padding: '64px 0',
      borderTop: `1px solid ${VA_TOKENS.line}`,
      background: VA_TOKENS.bgGrey
    }
  }, /*#__PURE__*/React.createElement(VAContainer, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "logo-primary-light.svg",
    alt: "Shopview",
    style: {
      height: 18
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: VA_TOKENS.soft,
      fontFamily: 'var(--sv-font-mono)'
    }
  }, "Shopview Design System \xB7 Edition 01 \xB7 May 2026"))));
}
function VariationA({
  density = 'comfortable'
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: VA_TOKENS.bg,
      color: VA_TOKENS.text,
      fontFamily: 'var(--sv-font-ui)',
      minHeight: '100%',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(VAHeader, {
    density: density
  }), /*#__PURE__*/React.createElement(VAHero, null), /*#__PURE__*/React.createElement(VALogo, null), /*#__PURE__*/React.createElement(VAColor, null), /*#__PURE__*/React.createElement(VAType, null), /*#__PURE__*/React.createElement(VASpacing, null), /*#__PURE__*/React.createElement(VAIcons, null), /*#__PURE__*/React.createElement(VAComponents, null), /*#__PURE__*/React.createElement(VAAIAgent, null), /*#__PURE__*/React.createElement(VAFooter, null));
}
window.VariationA = VariationA;
})(); } catch (e) { __ds_ns.__errors.push({ path: "design-md/variation-b.jsx", error: String((e && e.message) || e) }); }

// filter-bar.jsx
try { (() => {
// Filter Bar — full toolbar context with table backdrop, plus interactive demo.

const CUSTOMERS = ["Transload Trucking", "Hard Rock Industries LLC", "RF Heavy", "Truck Zone", "1st Auto Parts Ltd", "Partmaster Ltd", "Auckland Motors Mitsubishi", "Dodson Autospares", "Texas Truck And Auto Parts", "Repco Grey Lynn", "Segedin Truck And Auto Pa…"];
const STATUSES = ["Estimate", "Approved", "In progress", "Review", "Complete", "Invoiced", "Paid", "Declined", "Imported"];
const TECHS = ["Eleanor Pena", "Esther Howard", "Jenny Wilson", "Annette Black", "Leslie Alexander", "Floyd Miles", "Theresa Webb", "Ralph Edwards"];
const ADVISORS = ["Kathryn Murphy", "Kristin Watson", "Theresa Webb", "Eleanor Pena", "Jenny Wilson"];
const ASSETS = ["Yes", "No"];

// Mini stub of a Work Orders table so the filter bar sits in real context
function TableBackdrop() {
  const rows = [{
    id: "S3-8412",
    est: "Estimate",
    est_color: "ok",
    cust: "Transload Trucking",
    asset: "Freightliner M2",
    vin: "1FD0W5HY2EEA05499",
    adv: "Esther Howard",
    tech: "Esther Howard",
    lines: 12,
    total: "$13,408.17"
  }, {
    id: "S3-3425",
    est: "Estimate",
    est_color: "ok",
    cust: "Hard Rock Industries LLC",
    asset: "—",
    vin: "1FD0W5HY2EEA05499",
    adv: "Theresa Webb",
    tech: "Ralph Edwards",
    lines: 14,
    total: "$2,321.53"
  }, {
    id: "S3-8554",
    est: "Estimate",
    est_color: "ok",
    cust: "RF Heavy",
    asset: "—",
    vin: "1FD0W5HY2EEA05499",
    adv: "Ralph Edwards",
    tech: "Jenny Wilson",
    lines: 10,
    total: "$5,932.32"
  }, {
    id: "S3-8423",
    est: "Estimate",
    est_color: "err",
    cust: "Truck Zone",
    asset: "—",
    vin: "1FD0W5HY2EEA05499",
    adv: "Annette Black",
    tech: "Leslie Alexander",
    lines: 5,
    total: "$48,013.11"
  }, {
    id: "S3-9665",
    est: "Estimate",
    est_color: "ok",
    cust: "1st Auto Parts Ltd",
    asset: "—",
    vin: "1FD0W5HY2EEA05499",
    adv: "Jenny Wilson",
    tech: "Kristin Watson",
    lines: 3,
    total: "$15,182.32"
  }, {
    id: "S3-1345",
    est: "Declined",
    est_color: "err",
    cust: "Partmaster Ltd",
    asset: "—",
    vin: "1FD0W5HY2EEA05499",
    adv: "Eleanor Pena",
    tech: "Esther Howard",
    lines: 2,
    total: "$13,199.51"
  }, {
    id: "S3-5234",
    est: "Estimate",
    est_color: "ok",
    cust: "Auckland Motors Mitsubishi",
    asset: "—",
    vin: "1FD0W5HY2EEA05499",
    adv: "Leslie Alexander",
    tech: "Theresa Webb",
    lines: 12,
    total: "$10,075.14"
  }, {
    id: "S3-9574",
    est: "Estimate",
    est_color: "err",
    cust: "Dodson Autospares",
    asset: "—",
    vin: "1FD0W5HY2EEA05499",
    adv: "Floyd Miles",
    tech: "Ralph Edwards",
    lines: 7,
    total: "$242,212.07"
  }, {
    id: "S3-0937",
    est: "Estimate",
    est_color: "ok",
    cust: "Segedin Truck And Auto Pa…",
    asset: "—",
    vin: "1FD0W5HY2EEA05499",
    adv: "Kathryn Murphy",
    tech: "Annette Black",
    lines: 9,
    total: "$13,408.17"
  }, {
    id: "S3-3456",
    est: "Declined",
    est_color: "err",
    cust: "Repco Grey Lynn",
    asset: "—",
    vin: "1FD0W5HY2EEA05499",
    adv: "Kristin Watson",
    tech: "Jenny Wilson",
    lines: 7,
    total: "$10,075.14"
  }];
  const Th = ({
    children,
    w
  }) => /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "12px 16px",
      fontWeight: 500,
      fontSize: 12,
      color: "var(--sv-grey-500)",
      borderBottom: "1px solid var(--sv-grey-200)",
      whiteSpace: "nowrap",
      background: "white",
      width: w
    }
  }, children);
  const Td = ({
    children,
    align
  }) => /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "14px 16px",
      fontWeight: 500,
      fontSize: 14,
      color: "var(--sv-grey-900)",
      borderBottom: "1px solid var(--sv-grey-100)",
      textAlign: align || "left",
      whiteSpace: "nowrap"
    }
  }, children);
  const [hoverRow, setHoverRow] = React.useState(null);
  return /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse",
      fontFamily: "var(--sv-font-ui)"
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement(Th, {
    w: 56
  }, "On Site"), /*#__PURE__*/React.createElement(Th, {
    w: 120
  }), /*#__PURE__*/React.createElement(Th, null, "Number"), /*#__PURE__*/React.createElement(Th, null, "Customer"), /*#__PURE__*/React.createElement(Th, null, "Asset"), /*#__PURE__*/React.createElement(Th, null, "Unit"), /*#__PURE__*/React.createElement(Th, null, "VIN/Serial #"), /*#__PURE__*/React.createElement(Th, null, "Progress"), /*#__PURE__*/React.createElement(Th, null, "Service Advisor"), /*#__PURE__*/React.createElement(Th, null, "Lead Technician"), /*#__PURE__*/React.createElement(Th, null, "Lines"), /*#__PURE__*/React.createElement(Th, null, "Total Price"))), /*#__PURE__*/React.createElement("tbody", null, rows.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: i,
    onMouseEnter: () => setHoverRow(i),
    onMouseLeave: () => setHoverRow(null),
    style: {
      background: hoverRow === i ? "var(--sv-grey-50)" : "transparent",
      transition: "background-color 120ms ease-out"
    }
  }, /*#__PURE__*/React.createElement(Td, null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-grid",
      placeItems: "center",
      width: 24,
      height: 24,
      borderRadius: 6,
      background: r.est_color === "err" ? "var(--sv-error-50)" : "var(--sv-success-50)",
      color: r.est_color === "err" ? "var(--sv-error-500)" : "var(--sv-success-600)"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8 1.333L1.333 4.667v3.333c0 3.682 2.985 6.667 6.667 6.667s6.667-2.985 6.667-6.667V4.667L8 1.333z"
  })))), /*#__PURE__*/React.createElement(Td, null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      height: 22,
      padding: "0 10px",
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 600,
      background: r.est_color === "err" ? hoverRow === i ? "#FDE3DE" : "var(--sv-error-50)" : hoverRow === i ? "#CFE3FF" : "var(--sv-primary-50)",
      color: r.est_color === "err" ? "var(--sv-error-700)" : "var(--sv-primary-700)",
      border: `1px solid ${r.est_color === "err" ? "var(--sv-error-200)" : "var(--sv-primary-200)"}`,
      transition: "background-color 120ms ease-out",
      cursor: "pointer"
    }
  }, r.est)), /*#__PURE__*/React.createElement(Td, null, r.id), /*#__PURE__*/React.createElement(Td, null, r.cust), /*#__PURE__*/React.createElement(Td, null, r.asset), /*#__PURE__*/React.createElement(Td, null, "\u2014"), /*#__PURE__*/React.createElement(Td, null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--sv-grey-500)"
    }
  }, r.vin)), /*#__PURE__*/React.createElement(Td, null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-block",
      width: 64,
      height: 6,
      borderRadius: 999,
      background: "var(--sv-grey-100)",
      verticalAlign: "middle"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 8,
      color: "var(--sv-grey-500)",
      fontSize: 12
    }
  }, "0%")), /*#__PURE__*/React.createElement(Td, null, r.adv), /*#__PURE__*/React.createElement(Td, null, r.tech), /*#__PURE__*/React.createElement(Td, null, r.lines), /*#__PURE__*/React.createElement(Td, null, r.total)))));
}

// Anchored popover wrapper
function Popover({
  open,
  anchorRef,
  children,
  onClose,
  offset = 8
}) {
  const [pos, setPos] = React.useState(null);
  React.useLayoutEffect(() => {
    if (!open || !anchorRef.current) return;
    const r = anchorRef.current.getBoundingClientRect();
    const host = anchorRef.current.closest("[data-popover-host]");
    const h = host ? host.getBoundingClientRect() : {
      left: 0,
      top: 0
    };
    setPos({
      left: r.left - h.left,
      top: r.bottom - h.top + offset
    });
  }, [open]);
  React.useEffect(() => {
    if (!open) return;
    const onDoc = e => {
      if (anchorRef.current && anchorRef.current.contains(e.target)) return;
      const pop = document.getElementById("__open_popover");
      if (pop && pop.contains(e.target)) return;
      onClose && onClose();
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, onClose]);
  if (!open || !pos) return null;
  return /*#__PURE__*/React.createElement("div", {
    id: "__open_popover",
    style: {
      position: "absolute",
      left: pos.left,
      top: pos.top,
      zIndex: 10
    }
  }, children);
}

// Top-level filter bar
function FilterBar({
  filters,
  setFilters,
  allCleared = false
}) {
  const [open, setOpen] = React.useState(null); // which filter id is open
  const statusRef = React.useRef();
  const custRef = React.useRef();
  const techRef = React.useRef();
  const advRef = React.useRef();
  const assetRef = React.useRef();
  const dateRef = React.useRef();
  const setVal = (k, v) => setFilters({
    ...filters,
    [k]: v
  });
  const valueText = (k, arr) => {
    if (k === "date") {
      if (!arr) return null;
      return arr; // date stores a string, not an array
    }
    if (!arr || arr.length === 0) return null;
    if (arr.length === 1) return arr[0];
    return `${arr[0]}, +${arr.length - 1}`;
  };
  const items = [{
    id: "status",
    icon: SVIcons.ICON_LOAD,
    label: "Status",
    ref: statusRef,
    list: STATUSES,
    panel: "status"
  }, {
    id: "cust",
    icon: SVIcons.ICON_USER,
    label: "Customer",
    ref: custRef,
    list: CUSTOMERS,
    panel: "search"
  }, {
    id: "tech",
    icon: SVIcons.ICON_WRENCH,
    label: "Lead Technician",
    ref: techRef,
    list: TECHS,
    panel: "search"
  }, {
    id: "adv",
    icon: SVIcons.ICON_HEADSET,
    label: "Service Advisor",
    ref: advRef,
    list: ADVISORS,
    panel: "search"
  }, {
    id: "asset",
    icon: SVIcons.ICON_TRUCK,
    label: "Asset on site",
    ref: assetRef,
    list: ASSETS,
    panel: "status"
  }, {
    id: "date",
    icon: SVIcons.ICON_CALENDAR,
    label: "Date Range",
    ref: dateRef,
    list: null,
    panel: "date"
  }];
  const hasAny = Object.entries(filters).some(([k, v]) => k === "date" ? !!v : v && v.length > 0);
  return /*#__PURE__*/React.createElement("div", {
    "data-popover-host": true,
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "8px 24px",
      height: 60
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 4
    }
  }, items.map(it => {
    const v = filters[it.id] || (it.panel === "date" ? null : []);
    const has = it.panel === "date" ? !!v : v.length > 0;
    return /*#__PURE__*/React.createElement(FilterChip, {
      key: it.id,
      refEl: it.ref,
      icon: it.icon,
      label: it.label,
      state: open === it.id ? "open" : "default",
      hasValue: has,
      valueText: valueText(it.id, v),
      onClick: () => setOpen(open === it.id ? null : it.id),
      onClear: () => setVal(it.id, [])
    });
  })), hasAny && /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setFilters({});
      setOpen(null);
    },
    style: {
      all: "unset",
      cursor: "pointer",
      color: "var(--sv-primary-500)",
      fontWeight: 500,
      fontSize: 14,
      lineHeight: "20px",
      padding: "0 8px"
    }
  }, "Clear filters"), items.map(it => /*#__PURE__*/React.createElement(Popover, {
    key: it.id,
    open: open === it.id,
    anchorRef: it.ref,
    onClose: () => setOpen(null)
  }, it.panel === "date" ? /*#__PURE__*/React.createElement(DateRangeDropdown, {
    value: filters[it.id] || null,
    onChange: v => setVal(it.id, v),
    onClear: () => setVal(it.id, null)
  }) : it.panel === "status" ? /*#__PURE__*/React.createElement(StatusDropdown, {
    options: it.list,
    value: filters[it.id] || [],
    onChange: v => setVal(it.id, v),
    onClear: () => setVal(it.id, [])
  }) : /*#__PURE__*/React.createElement(FilterDropdown, {
    title: it.label,
    options: it.list,
    value: filters[it.id] || [],
    onChange: v => setVal(it.id, v),
    onClear: () => setVal(it.id, [])
  }))));
}

// Full page chrome (header + tabs + filter bar + table)
function WorkOrdersPage({
  initial = {},
  frozenOpen = null
}) {
  const [filters, setFilters] = React.useState(initial);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1440,
      height: 900,
      overflow: "hidden",
      background: "white",
      fontFamily: "var(--sv-font-ui)",
      display: "flex",
      flexDirection: "column",
      border: "1px solid var(--sv-grey-200)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 64,
      padding: "0 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottom: "1px solid var(--sv-grey-200)",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/symbol-primary.svg",
    alt: "Shopview",
    style: {
      width: 28,
      height: 28
    }
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      gap: 4
    }
  }, ["Work Orders", "Schedule", "Customers", "Parts", "Reports"].map((n, i) => /*#__PURE__*/React.createElement("span", {
    key: n,
    style: {
      padding: "8px 12px",
      borderRadius: 8,
      background: i === 0 ? "var(--sv-grey-100)" : "transparent",
      color: i === 0 ? "var(--sv-grey-900)" : "var(--sv-grey-500)",
      fontWeight: 500,
      fontSize: 14,
      cursor: "pointer"
    }
  }, n)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      width: 360,
      height: 36,
      padding: "0 12px",
      background: "var(--sv-grey-50)",
      borderRadius: 8,
      border: "1px solid var(--sv-grey-200)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--sv-grey-500)"
    }
  }, SVIcons.ICON_SEARCH), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      color: "var(--sv-grey-500)",
      fontSize: 14
    }
  }, "Search"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "var(--sv-grey-500)",
      padding: "2px 6px",
      border: "1px solid var(--sv-grey-200)",
      borderRadius: 4
    }
  }, "\u2318 K")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 500,
      color: "var(--sv-grey-700)"
    }
  }, "Heavy Duty"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 32,
      height: 32,
      borderRadius: "50%",
      background: "var(--sv-primary-100)",
      color: "var(--sv-primary-700)",
      display: "grid",
      placeItems: "center",
      fontWeight: 600,
      fontSize: 13
    }
  }, "HD"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      gap: 4
    }
  }, ["All", "Estimates", "Completed", "My Work Orders"].map((t, i) => /*#__PURE__*/React.createElement("span", {
    key: t,
    style: {
      padding: "8px 12px",
      borderRadius: 8,
      background: i === 0 ? "var(--sv-grey-100)" : "transparent",
      color: i === 0 ? "var(--sv-grey-900)" : "var(--sv-grey-500)",
      fontWeight: 500,
      fontSize: 14,
      cursor: "pointer"
    }
  }, t))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("button", {
    title: "Search",
    style: {
      all: "unset",
      cursor: "pointer",
      height: 36,
      padding: "0 12px",
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      borderRadius: 8,
      color: "var(--sv-grey-700)",
      fontWeight: 500,
      fontSize: 14
    },
    onMouseEnter: e => e.currentTarget.style.background = "var(--sv-grey-100)",
    onMouseLeave: e => e.currentTarget.style.background = "transparent"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/icon-search.svg",
    width: "20",
    height: "20",
    alt: ""
  }), "Search"), /*#__PURE__*/React.createElement("button", {
    title: "Toggle filters",
    style: {
      all: "unset",
      cursor: "pointer",
      width: 36,
      height: 36,
      display: "grid",
      placeItems: "center",
      borderRadius: 8,
      background: "var(--sv-grey-100)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/icon-filter-toggle.svg",
    width: "20",
    height: "20",
    alt: ""
  })), /*#__PURE__*/React.createElement("button", {
    title: "Columns",
    style: {
      all: "unset",
      cursor: "pointer",
      width: 36,
      height: 36,
      display: "grid",
      placeItems: "center",
      borderRadius: 8
    },
    onMouseEnter: e => e.currentTarget.style.background = "var(--sv-grey-100)",
    onMouseLeave: e => e.currentTarget.style.background = "transparent"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/icon-columns.svg",
    width: "20",
    height: "20",
    alt: ""
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8
    }
  }), /*#__PURE__*/React.createElement("button", {
    style: {
      all: "unset",
      cursor: "pointer",
      height: 36,
      padding: "0 16px",
      borderRadius: 8,
      background: "var(--sv-primary-500)",
      color: "white",
      fontWeight: 600,
      fontSize: 14
    }
  }, "New Work Order"))), /*#__PURE__*/React.createElement(FilterBar, {
    filters: filters,
    setFilters: setFilters
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: "var(--sv-grey-200)",
      flex: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: "auto",
      background: "white"
    }
  }, /*#__PURE__*/React.createElement(TableBackdrop, null)));
}
window.WorkOrdersPage = WorkOrdersPage;
window.FilterBar = FilterBar;
window.CUSTOMERS = CUSTOMERS;
window.STATUSES = STATUSES;
window.TECHS = TECHS;
window.ADVISORS = ADVISORS;
})(); } catch (e) { __ds_ns.__errors.push({ path: "filter-bar.jsx", error: String((e && e.message) || e) }); }

// filter-chip.jsx
try { (() => {
// Shopview Filter Chip — pill-style filter trigger that lives in a Filter Bar.
// States mirror the Figma source: Default, Hover, Selected (item picked), Empty‑selected (open + no items yet).

const ICON_LOAD = /*#__PURE__*/React.createElement("img", {
  src: "assets/icon-status.svg",
  width: "16",
  height: "16",
  alt: ""
});
const ICON_USER = /*#__PURE__*/React.createElement("img", {
  src: "assets/icon-customer.svg",
  width: "16",
  height: "16",
  alt: ""
});
const ICON_WRENCH = /*#__PURE__*/React.createElement("img", {
  src: "assets/icon-technician.svg",
  width: "16",
  height: "16",
  alt: ""
});
const ICON_HEADSET = /*#__PURE__*/React.createElement("img", {
  src: "assets/icon-advisor.svg",
  width: "16",
  height: "16",
  alt: ""
});
const ICON_TRUCK = /*#__PURE__*/React.createElement("img", {
  src: "assets/icon-asset.svg",
  width: "16",
  height: "16",
  alt: ""
});
const ICON_CHEVRON = /*#__PURE__*/React.createElement("svg", {
  width: "20",
  height: "20",
  viewBox: "0 0 20 20",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.67",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "M5 7.5L10 12.5L15 7.5"
}));
const ICON_XCIRCLE = /*#__PURE__*/React.createElement("svg", {
  width: "16",
  height: "16",
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.5",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("circle", {
  cx: "8",
  cy: "8",
  r: "6.667"
}), /*#__PURE__*/React.createElement("path", {
  d: "M10 6L6 10M6 6l4 4"
}));
const ICON_X = /*#__PURE__*/React.createElement("svg", {
  width: "14",
  height: "14",
  viewBox: "0 0 14 14",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.5",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "M10.5 3.5l-7 7M3.5 3.5l7 7"
}));
const ICON_SEARCH = /*#__PURE__*/React.createElement("svg", {
  width: "20",
  height: "20",
  viewBox: "0 0 20 20",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.67",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("circle", {
  cx: "9.167",
  cy: "9.167",
  r: "5.833"
}), /*#__PURE__*/React.createElement("path", {
  d: "M17.5 17.5l-4.167-4.167"
}));
const ICON_CHECK = /*#__PURE__*/React.createElement("svg", {
  width: "12",
  height: "12",
  viewBox: "0 0 12 12",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "M10 3L4.5 8.5L2 6"
}));
const ICON_BARS = /*#__PURE__*/React.createElement("svg", {
  width: "16",
  height: "16",
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.5",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "M3 4h10M3 8h10M3 12h10"
}));
const ICON_BACK = /*#__PURE__*/React.createElement("svg", {
  width: "20",
  height: "20",
  viewBox: "0 0 20 20",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.67",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "M12.5 5L7.5 10L12.5 15"
}));
const ICON_CALENDAR = /*#__PURE__*/React.createElement("img", {
  src: "assets/icon-calendar.svg",
  width: "16",
  height: "16",
  alt: ""
});

// Filter chip — exact figma spec:
// 28px tall pill, radius 100, padding 0 10px, gap 8px between children
// Default: transparent bg, icon #364152, label Inter 500/14 #364152, chevron 20px
// Hover: bg #EEF2F6 (grey-100)
// Selected: bg #D8ECFF (primary-100), text + icon #257CFF (primary-500), chevron shown
// Selected + hover: chevron fades out, X-circle fades in over it for clear action
function FilterChip({
  icon,
  label,
  state = "default",
  onClick,
  hasValue = false,
  valueText,
  onClear,
  refEl
}) {
  const [hovered, setHovered] = React.useState(false);
  const isSelected = state === "selected" || hasValue;
  const isHover = state === "hover" || hovered;
  const isOpen = state === "open";
  const bg = isSelected ? "var(--sv-primary-100)" : isHover || isOpen ? "var(--sv-grey-100)" : "transparent";
  const color = isSelected ? "var(--sv-primary-500)" : "var(--sv-grey-700)";

  // Whether to show the clear icon overlay (selected + hovering)
  const showClear = isSelected && hovered && onClear;
  return /*#__PURE__*/React.createElement("button", {
    ref: refEl,
    onClick: onClick,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    style: {
      all: "unset",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      height: 28,
      padding: "0 10px",
      borderRadius: 100,
      backgroundColor: bg,
      color,
      fontFamily: "var(--sv-font-ui)",
      fontWeight: 500,
      fontSize: 14,
      lineHeight: "20px",
      whiteSpace: "nowrap",
      transition: "background-color 120ms ease-out"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 16,
      height: 16,
      display: "grid",
      placeItems: "center",
      flex: "none",
      color
    }
  }, icon), /*#__PURE__*/React.createElement("span", null, hasValue && valueText ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--sv-grey-500)",
      fontWeight: 500
    }
  }, label, ": "), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--sv-grey-900)",
      fontWeight: 500
    }
  }, valueText)) : label), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      display: "grid",
      placeItems: "center",
      marginLeft: -4,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      display: "grid",
      placeItems: "center",
      color: "var(--sv-grey-700)",
      opacity: showClear ? 0 : 1,
      transition: "opacity 140ms ease",
      pointerEvents: "none"
    }
  }, ICON_CHEVRON), isSelected && onClear && /*#__PURE__*/React.createElement("span", {
    onClick: e => {
      e.stopPropagation();
      onClear();
    },
    style: {
      position: "absolute",
      inset: 0,
      display: "grid",
      placeItems: "center",
      color: "var(--sv-grey-700)",
      opacity: showClear ? 1 : 0,
      transition: "opacity 140ms ease",
      cursor: "pointer"
    }
  }, ICON_XCIRCLE)));
}
window.FilterChip = FilterChip;
window.SVIcons = {
  ICON_LOAD,
  ICON_USER,
  ICON_WRENCH,
  ICON_HEADSET,
  ICON_TRUCK,
  ICON_CHEVRON,
  ICON_XCIRCLE,
  ICON_X,
  ICON_SEARCH,
  ICON_CHECK,
  ICON_BARS,
  ICON_BACK,
  ICON_CALENDAR
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "filter-chip.jsx", error: String((e && e.message) || e) }); }

// filter-dropdown.jsx
try { (() => {
// Filter dropdown panel — opens below a chip. Search input + scrollable checkbox list + "Clear selection".
// Matches Figma /Filters/Customer-v1 + /Filters/Customer-v1-selected.

function Checkbox({
  checked,
  partial
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      width: 16,
      height: 16,
      flex: "none",
      borderRadius: 4,
      border: `1px solid ${checked ? "var(--sv-primary-500)" : "var(--sv-grey-300)"}`,
      background: checked ? "var(--sv-primary-50)" : "white",
      color: "var(--sv-primary-500)",
      display: "grid",
      placeItems: "center",
      transition: "all 120ms ease-out"
    }
  }, checked && SVIcons.ICON_CHECK);
}
function PanelSearch({
  value,
  onChange,
  placeholder = "Search customer",
  autoFocus
}) {
  const [focused, setFocused] = React.useState(autoFocus);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 12px 8px 12px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      height: 40,
      padding: "0 12px",
      borderRadius: 8,
      background: "var(--sv-grey-50)",
      border: `${focused ? 2 : 1}px solid ${focused ? "var(--sv-primary-500)" : "var(--sv-grey-200)"}`,
      boxShadow: focused ? "0 0 0 4px rgba(37,124,255,0.18)" : "none",
      transition: "all 120ms ease-out"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: focused ? "var(--sv-primary-500)" : "var(--sv-grey-500)",
      display: "grid",
      placeItems: "center"
    }
  }, SVIcons.ICON_SEARCH), /*#__PURE__*/React.createElement("input", {
    value: value,
    onChange: e => onChange(e.target.value),
    placeholder: placeholder,
    autoFocus: autoFocus,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: {
      border: "none",
      outline: "none",
      background: "transparent",
      flex: 1,
      height: 36,
      fontFamily: "var(--sv-font-ui)",
      fontWeight: 500,
      fontSize: 14,
      lineHeight: "20px",
      color: "var(--sv-grey-900)"
    }
  })));
}

// Variant A — multi-select with checkboxes + plain search
function FilterDropdown({
  title = "Customer",
  options,
  value,
  onChange,
  onClear,
  width = 320,
  withSearch = true,
  withFooter = true
}) {
  const [q, setQ] = React.useState("");
  const filtered = options.filter(o => o.toLowerCase().includes(q.toLowerCase()));
  const toggle = o => {
    const s = new Set(value);
    s.has(o) ? s.delete(o) : s.add(o);
    onChange(Array.from(s));
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      background: "white",
      borderRadius: 12,
      border: "1px solid var(--sv-grey-200)",
      boxShadow: "0 12px 24px rgba(11,23,51,0.10), 0 4px 8px rgba(11,23,51,0.05)",
      overflow: "hidden",
      fontFamily: "var(--sv-font-ui)"
    }
  }, withSearch && /*#__PURE__*/React.createElement(PanelSearch, {
    value: q,
    onChange: setQ,
    placeholder: `Search ${title.toLowerCase()}`,
    autoFocus: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxHeight: 320,
      overflow: "auto",
      padding: "4px 0 8px"
    }
  }, filtered.map(o => {
    const checked = value.includes(o);
    return /*#__PURE__*/React.createElement("label", {
      key: o,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 16px",
        cursor: "pointer",
        fontFamily: "var(--sv-font-ui)",
        fontWeight: 500,
        fontSize: 14,
        lineHeight: "20px",
        color: "var(--sv-grey-900)",
        transition: "background-color 100ms ease-out"
      },
      onMouseEnter: e => e.currentTarget.style.background = "var(--sv-grey-50)",
      onMouseLeave: e => e.currentTarget.style.background = "transparent"
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      checked: checked,
      onChange: () => toggle(o),
      style: {
        position: "absolute",
        opacity: 0,
        pointerEvents: "none"
      }
    }), /*#__PURE__*/React.createElement(Checkbox, {
      checked: checked
    }), /*#__PURE__*/React.createElement("span", null, o));
  }), filtered.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "20px 16px",
      color: "var(--sv-grey-500)",
      fontSize: 14
    }
  }, "No matches")), withFooter && /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid var(--sv-grey-200)",
      padding: "12px 16px"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClear,
    style: {
      all: "unset",
      cursor: "pointer",
      color: "var(--sv-grey-700)",
      fontFamily: "var(--sv-font-ui)",
      fontWeight: 500,
      fontSize: 14,
      lineHeight: "20px"
    }
  }, "Clear selection")));
}

// Variant B — selected/with-pills search input at top (chips inline in the search box)
function FilterDropdownWithPills({
  title = "Customer",
  options,
  value,
  onChange,
  onClear,
  width = 320
}) {
  const [q, setQ] = React.useState("");
  const filtered = options.filter(o => o.toLowerCase().includes(q.toLowerCase()));
  const toggle = o => {
    const s = new Set(value);
    s.has(o) ? s.delete(o) : s.add(o);
    onChange(Array.from(s));
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      background: "white",
      borderRadius: 12,
      border: "1px solid var(--sv-grey-200)",
      boxShadow: "0 12px 24px rgba(11,23,51,0.10), 0 4px 8px rgba(11,23,51,0.05)",
      overflow: "hidden",
      fontFamily: "var(--sv-font-ui)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 12px 8px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      gap: 6,
      minHeight: 40,
      padding: "6px 36px 6px 10px",
      borderRadius: 8,
      background: "var(--sv-grey-50)",
      border: "2px solid var(--sv-primary-500)",
      boxShadow: "0 0 0 4px rgba(37,124,255,0.18)"
    }
  }, value.map(v => /*#__PURE__*/React.createElement("span", {
    key: v,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      height: 24,
      padding: "0 4px 0 8px",
      borderRadius: 6,
      background: "white",
      border: "1px solid var(--sv-grey-200)",
      fontWeight: 500,
      fontSize: 13,
      lineHeight: "20px",
      color: "var(--sv-grey-900)",
      maxWidth: 200
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, v), /*#__PURE__*/React.createElement("button", {
    onClick: () => toggle(v),
    style: {
      all: "unset",
      cursor: "pointer",
      color: "var(--sv-grey-500)",
      display: "grid",
      placeItems: "center",
      padding: 2
    }
  }, SVIcons.ICON_X))), /*#__PURE__*/React.createElement("input", {
    value: q,
    onChange: e => setQ(e.target.value),
    autoFocus: true,
    placeholder: value.length ? "" : `Search ${title.toLowerCase()}`,
    style: {
      border: "none",
      outline: "none",
      background: "transparent",
      flex: 1,
      minWidth: 60,
      height: 24,
      fontFamily: "var(--sv-font-ui)",
      fontWeight: 500,
      fontSize: 14,
      lineHeight: "20px",
      color: "var(--sv-grey-900)"
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: onClear,
    style: {
      all: "unset",
      cursor: "pointer",
      color: "var(--sv-grey-500)",
      position: "absolute",
      right: 8,
      top: 8,
      width: 20,
      height: 20,
      display: "grid",
      placeItems: "center"
    }
  }, SVIcons.ICON_XCIRCLE))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxHeight: 320,
      overflow: "auto",
      padding: "4px 0 8px"
    }
  }, filtered.map(o => {
    const checked = value.includes(o);
    return /*#__PURE__*/React.createElement("label", {
      key: o,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 16px",
        cursor: "pointer",
        fontFamily: "var(--sv-font-ui)",
        fontWeight: 500,
        fontSize: 14,
        lineHeight: "20px",
        color: "var(--sv-grey-900)"
      },
      onMouseEnter: e => e.currentTarget.style.background = "var(--sv-grey-50)",
      onMouseLeave: e => e.currentTarget.style.background = "transparent"
    }, /*#__PURE__*/React.createElement(Checkbox, {
      checked: checked
    }), /*#__PURE__*/React.createElement("span", {
      onClick: () => toggle(o),
      style: {
        flex: 1
      }
    }, o));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid var(--sv-grey-200)",
      padding: "12px 16px"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClear,
    style: {
      all: "unset",
      cursor: "pointer",
      color: "var(--sv-grey-700)",
      fontFamily: "var(--sv-font-ui)",
      fontWeight: 500,
      fontSize: 14,
      lineHeight: "20px"
    }
  }, "Clear selection")));
}

// Simple single-select status list (for Status chip)
function StatusDropdown({
  options,
  value,
  onChange,
  onClear,
  width = 240
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      background: "white",
      borderRadius: 12,
      border: "1px solid var(--sv-grey-200)",
      boxShadow: "0 12px 24px rgba(11,23,51,0.10), 0 4px 8px rgba(11,23,51,0.05)",
      overflow: "hidden",
      fontFamily: "var(--sv-font-ui)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "8px 0"
    }
  }, options.map(o => {
    const checked = value.includes(o);
    return /*#__PURE__*/React.createElement("label", {
      key: o,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 16px",
        cursor: "pointer",
        fontWeight: 500,
        fontSize: 14,
        lineHeight: "20px",
        color: "var(--sv-grey-900)"
      },
      onClick: () => {
        const s = new Set(value);
        s.has(o) ? s.delete(o) : s.add(o);
        onChange(Array.from(s));
      },
      onMouseEnter: e => e.currentTarget.style.background = "var(--sv-grey-50)",
      onMouseLeave: e => e.currentTarget.style.background = "transparent"
    }, /*#__PURE__*/React.createElement(Checkbox, {
      checked: checked
    }), /*#__PURE__*/React.createElement("span", null, o));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid var(--sv-grey-200)",
      padding: "12px 16px"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClear,
    style: {
      all: "unset",
      cursor: "pointer",
      color: "var(--sv-grey-700)",
      fontWeight: 500,
      fontSize: 14,
      lineHeight: "20px"
    }
  }, "Clear selection")));
}

// Date Range dropdown — single-select preset list with optional custom date inputs
const DATE_PRESETS = ["Today", "Yesterday", "This week", "This month", "Last month", "This quarter", "This year", "Custom"];
function DateRangeDropdown({
  value,
  onChange,
  onClear,
  width = 260
}) {
  const selected = value || null;
  const [customRange, setCustomRange] = React.useState("");
  const isCustom = selected === "Custom";
  const pick = preset => {
    onChange(preset === selected ? null : preset);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      background: "white",
      borderRadius: 12,
      border: "1px solid var(--sv-grey-200)",
      boxShadow: "0 12px 24px rgba(11,23,51,0.10), 0 4px 8px rgba(11,23,51,0.05)",
      overflow: "hidden",
      fontFamily: "var(--sv-font-ui)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "8px 0"
    }
  }, DATE_PRESETS.map(p => {
    const active = selected === p;
    return /*#__PURE__*/React.createElement("div", {
      key: p
    }, /*#__PURE__*/React.createElement("label", {
      onClick: () => pick(p),
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 16px",
        cursor: "pointer",
        fontWeight: 500,
        fontSize: 14,
        lineHeight: "20px",
        color: "var(--sv-grey-900)"
      },
      onMouseEnter: e => e.currentTarget.style.background = "var(--sv-grey-50)",
      onMouseLeave: e => e.currentTarget.style.background = "transparent"
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 16,
        height: 16,
        flex: "none",
        borderRadius: "50%",
        border: `${active ? 5 : 1}px solid ${active ? "var(--sv-primary-500)" : "var(--sv-grey-300)"}`,
        background: "white",
        transition: "all 120ms ease-out"
      }
    }), /*#__PURE__*/React.createElement("span", null, p)), p === "Custom" && isCustom && /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "4px 16px 12px 44px"
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "text",
      placeholder: "MM/DD/YYYY \u2013 MM/DD/YYYY",
      value: customRange,
      onChange: e => setCustomRange(e.target.value),
      onFocus: e => e.currentTarget.style.borderColor = "var(--sv-primary-500)",
      onBlur: e => e.currentTarget.style.borderColor = "var(--sv-grey-200)",
      style: {
        width: "100%",
        height: 36,
        padding: "0 10px",
        borderRadius: 8,
        border: "1px solid var(--sv-grey-200)",
        fontFamily: "var(--sv-font-ui)",
        fontSize: 13,
        fontWeight: 500,
        color: "var(--sv-grey-900)",
        outline: "none",
        transition: "border-color 120ms ease-out"
      }
    })));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid var(--sv-grey-200)",
      padding: "12px 16px"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClear,
    style: {
      all: "unset",
      cursor: "pointer",
      color: "var(--sv-grey-700)",
      fontWeight: 500,
      fontSize: 14,
      lineHeight: "20px"
    }
  }, "Clear selection")));
}
window.FilterDropdown = FilterDropdown;
window.FilterDropdownWithPills = FilterDropdownWithPills;
window.StatusDropdown = StatusDropdown;
window.DateRangeDropdown = DateRangeDropdown;
window.DATE_PRESETS = DATE_PRESETS;
window.Checkbox = Checkbox;
})(); } catch (e) { __ds_ns.__errors.push({ path: "filter-dropdown.jsx", error: String((e && e.message) || e) }); }

// mobile-filters.jsx
try { (() => {
// Mobile All Filters bottom sheet — matches /Filters/Mobile (Apply filters CTA at bottom).
function MobileFilters({
  onClose
}) {
  const sections = [{
    icon: SVIcons.ICON_LOAD,
    label: "Status",
    value: null
  }, {
    icon: SVIcons.ICON_USER,
    label: "Customer",
    value: null
  }, {
    icon: SVIcons.ICON_WRENCH,
    label: "Lead Technician",
    value: null
  }, {
    icon: SVIcons.ICON_HEADSET,
    label: "Service Advisor",
    value: null
  }, {
    icon: SVIcons.ICON_TRUCK,
    label: "Asset on site",
    value: null
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 402,
      height: 720,
      background: "white",
      display: "flex",
      flexDirection: "column",
      fontFamily: "var(--sv-font-ui)",
      borderRadius: 12,
      overflow: "hidden",
      border: "1px solid var(--sv-grey-200)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px 16px 12px 16px",
      borderBottom: "1px solid var(--sv-grey-100)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: 16,
      color: "var(--sv-grey-900)"
    }
  }, "All Filters"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      all: "unset",
      cursor: "pointer",
      color: "var(--sv-grey-500)",
      padding: 4
    }
  }, SVIcons.ICON_X)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: "auto",
      padding: "8px 16px"
    }
  }, sections.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "14px 4px",
      borderBottom: i === sections.length - 1 ? "none" : "1px solid var(--sv-grey-100)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      color: "var(--sv-grey-700)",
      fontWeight: 500,
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--sv-grey-500)"
    }
  }, s.icon), s.label), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--sv-grey-400)",
      transform: "rotate(-90deg)"
    }
  }, SVIcons.ICON_CHEVRON)))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16,
      borderTop: "1px solid var(--sv-grey-100)"
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      all: "unset",
      cursor: "pointer",
      width: "100%",
      height: 44,
      display: "grid",
      placeItems: "center",
      borderRadius: 8,
      background: "var(--sv-primary-500)",
      color: "white",
      fontWeight: 600,
      fontSize: 14
    }
  }, "Apply filters")));
}
window.MobileFilters = MobileFilters;
})(); } catch (e) { __ds_ns.__errors.push({ path: "mobile-filters.jsx", error: String((e && e.message) || e) }); }

// theme-toggle.js
try { (() => {
/* Shopview theming mechanism.
   Sets [data-theme] on <html> to one of: "light" | "dark" | "system".
   - "system" (default) follows the OS via prefers-color-scheme (handled in CSS).
   - "light"/"dark" are explicit overrides.
   Choice persists in localStorage under "sv-theme".
   Usage:
     <script src="theme-toggle.js"></script>
     ShopviewTheme.set("dark");      // explicit
     ShopviewTheme.cycle();          // light -> dark -> system -> light
     ShopviewTheme.get();            // "light" | "dark" | "system"
     ShopviewTheme.resolved();       // actual applied theme, "light" | "dark"
*/
(function () {
  var KEY = 'sv-theme';
  var VALID = ['light', 'dark', 'system'];
  var mql = window.matchMedia('(prefers-color-scheme: dark)');
  function read() {
    var v = null;
    try {
      v = localStorage.getItem(KEY);
    } catch (e) {}
    return VALID.indexOf(v) > -1 ? v : 'system';
  }
  function apply(pref) {
    document.documentElement.setAttribute('data-theme', pref);
  }
  function resolved() {
    var p = read();
    if (p === 'system') return mql.matches ? 'dark' : 'light';
    return p;
  }
  function set(pref) {
    if (VALID.indexOf(pref) < 0) pref = 'system';
    try {
      localStorage.setItem(KEY, pref);
    } catch (e) {}
    apply(pref);
    dispatch();
  }
  function cycle() {
    var order = ['light', 'dark', 'system'];
    set(order[(order.indexOf(read()) + 1) % order.length]);
  }
  function dispatch() {
    window.dispatchEvent(new CustomEvent('sv-theme-change', {
      detail: {
        pref: read(),
        resolved: resolved()
      }
    }));
  }

  // Apply immediately (before paint) to avoid a flash.
  apply(read());
  // React live to OS changes while in "system".
  mql.addEventListener('change', function () {
    if (read() === 'system') dispatch();
  });
  window.ShopviewTheme = {
    get: read,
    set: set,
    cycle: cycle,
    resolved: resolved
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "theme-toggle.js", error: String((e && e.message) || e) }); }

// tweaks-panel.jsx
try { (() => {
// tweaks-panel.jsx
// Reusable Tweaks shell + form-control helpers.
//
// Owns the host protocol (listens for __activate_edit_mode / __deactivate_edit_mode,
// posts __edit_mode_available / __edit_mode_set_keys / __edit_mode_dismissed) so
// individual prototypes don't re-roll it. Ships a consistent set of controls so you
// don't hand-draw <input type="range">, segmented radios, steppers, etc.
//
// Usage (in an HTML file that loads React + Babel):
//
//   const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
//     "primaryColor": "#D97757",
//     "palette": ["#D97757", "#29261b", "#f6f4ef"],
//     "fontSize": 16,
//     "density": "regular",
//     "dark": false
//   }/*EDITMODE-END*/;
//
//   function App() {
//     const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
//     return (
//       <div style={{ fontSize: t.fontSize, color: t.primaryColor }}>
//         Hello
//         <TweaksPanel>
//           <TweakSection label="Typography" />
//           <TweakSlider label="Font size" value={t.fontSize} min={10} max={32} unit="px"
//                        onChange={(v) => setTweak('fontSize', v)} />
//           <TweakRadio  label="Density" value={t.density}
//                        options={['compact', 'regular', 'comfy']}
//                        onChange={(v) => setTweak('density', v)} />
//           <TweakSection label="Theme" />
//           <TweakColor  label="Primary" value={t.primaryColor}
//                        options={['#D97757', '#2A6FDB', '#1F8A5B', '#7A5AE0']}
//                        onChange={(v) => setTweak('primaryColor', v)} />
//           <TweakColor  label="Palette" value={t.palette}
//                        options={[['#D97757', '#29261b', '#f6f4ef'],
//                                  ['#475569', '#0f172a', '#f1f5f9']]}
//                        onChange={(v) => setTweak('palette', v)} />
//           <TweakToggle label="Dark mode" value={t.dark}
//                        onChange={(v) => setTweak('dark', v)} />
//         </TweaksPanel>
//       </div>
//     );
//   }
//
// ─────────────────────────────────────────────────────────────────────────────

const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom right;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;width:100%;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}

  .twk-chips{display:flex;gap:6px}
  .twk-chip{position:relative;appearance:none;flex:1;min-width:0;height:46px;
    padding:0;border:0;border-radius:6px;overflow:hidden;cursor:default;
    box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.06);
    transition:transform .12s cubic-bezier(.3,.7,.4,1),box-shadow .12s}
  .twk-chip:hover{transform:translateY(-1px);
    box-shadow:0 0 0 .5px rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.12)}
  .twk-chip[data-on="1"]{box-shadow:0 0 0 1.5px rgba(0,0,0,.85),
    0 2px 6px rgba(0,0,0,.15)}
  .twk-chip>span{position:absolute;top:0;bottom:0;right:0;width:34%;
    display:flex;flex-direction:column;box-shadow:-1px 0 0 rgba(0,0,0,.1)}
  .twk-chip>span>i{flex:1;box-shadow:0 -1px 0 rgba(0,0,0,.1)}
  .twk-chip>span>i:first-child{box-shadow:none}
  .twk-chip svg{position:absolute;top:6px;left:6px;width:13px;height:13px;
    filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}
`;

// ── useTweaks ───────────────────────────────────────────────────────────────
// Single source of truth for tweak values. setTweak persists via the host
// (__edit_mode_set_keys → host rewrites the EDITMODE block on disk).
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  // Accepts either setTweak('key', value) or setTweak({ key: value, ... }) so a
  // useState-style call doesn't write a "[object Object]" key into the persisted
  // JSON block.
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null ? keyOrEdits : {
      [keyOrEdits]: val
    };
    setValues(prev => ({
      ...prev,
      ...edits
    }));
    window.parent.postMessage({
      type: '__edit_mode_set_keys',
      edits
    }, '*');
    // Same-window signal so in-page listeners (deck-stage rail thumbnails)
    // can react — the parent message only reaches the host, not peers.
    window.dispatchEvent(new CustomEvent('tweakchange', {
      detail: edits
    }));
  }, []);
  return [values, setTweak];
}

// ── TweaksPanel ─────────────────────────────────────────────────────────────
// Floating shell. Registers the protocol listener BEFORE announcing
// availability — if the announce ran first, the host's activate could land
// before our handler exists and the toolbar toggle would silently no-op.
// The close button posts __edit_mode_dismissed so the host's toolbar toggle
// flips off in lockstep; the host echoes __deactivate_edit_mode back which
// is what actually hides the panel.
function TweaksPanel({
  title = 'Tweaks',
  noDeckControls = false,
  children
}) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  // Auto-inject a rail toggle when a <deck-stage> is on the page. The
  // toggle drives the deck's per-viewer _railVisible via window message;
  // state is mirrored from the same localStorage key the deck reads so
  // the control reflects reality across reloads. The mechanism is the
  // message — authors who want custom placement can post it directly
  // and pass noDeckControls to suppress this one.
  const hasDeckStage = React.useMemo(() => typeof document !== 'undefined' && !!document.querySelector('deck-stage'), []);
  // Hide the toggle until the host has actually enabled the rail (the
  // __omelette_rail_enabled window message, posted only when the
  // omelette_deck_rail_enabled flag is on for this user). The initial read
  // covers TweaksPanel mounting after the message already arrived; the
  // listener covers the common case of mounting first.
  const [railEnabled, setRailEnabled] = React.useState(() => hasDeckStage && !!document.querySelector('deck-stage')?._railEnabled);
  React.useEffect(() => {
    if (!hasDeckStage || railEnabled) return undefined;
    const onMsg = e => {
      if (e.data && e.data.type === '__omelette_rail_enabled') setRailEnabled(true);
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [hasDeckStage, railEnabled]);
  const [railVisible, setRailVisible] = React.useState(() => {
    try {
      return localStorage.getItem('deck-stage.railVisible') !== '0';
    } catch (e) {
      return true;
    }
  });
  const toggleRail = on => {
    setRailVisible(on);
    window.postMessage({
      type: '__deck_rail_visible',
      on
    }, '*');
  };
  const offsetRef = React.useRef({
    x: 16,
    y: 16
  });
  const PAD = 16;
  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth,
      h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y))
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);
  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);
  React.useEffect(() => {
    const onMsg = e => {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') setOpen(true);else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({
      type: '__edit_mode_available'
    }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);
  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({
      type: '__edit_mode_dismissed'
    }, '*');
  };
  const onDragStart = e => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX,
      sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = ev => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy)
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };
  if (!open) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, __TWEAKS_STYLE), /*#__PURE__*/React.createElement("div", {
    ref: dragRef,
    className: "twk-panel",
    "data-noncommentable": "",
    style: {
      right: offsetRef.current.x,
      bottom: offsetRef.current.y
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-hd",
    onMouseDown: onDragStart
  }, /*#__PURE__*/React.createElement("b", null, title), /*#__PURE__*/React.createElement("button", {
    className: "twk-x",
    "aria-label": "Close tweaks",
    onMouseDown: e => e.stopPropagation(),
    onClick: dismiss
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    className: "twk-body"
  }, children, hasDeckStage && railEnabled && !noDeckControls && /*#__PURE__*/React.createElement(TweakSection, {
    label: "Deck"
  }, /*#__PURE__*/React.createElement(TweakToggle, {
    label: "Thumbnail rail",
    value: railVisible,
    onChange: toggleRail
  })))));
}

// ── Layout helpers ──────────────────────────────────────────────────────────

function TweakSection({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "twk-sect"
  }, label), children);
}
function TweakRow({
  label,
  value,
  children,
  inline = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: inline ? 'twk-row twk-row-h' : 'twk-row'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label), value != null && /*#__PURE__*/React.createElement("span", {
    className: "twk-val"
  }, value)), children);
}

// ── Controls ────────────────────────────────────────────────────────────────

function TweakSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label,
    value: `${value}${unit}`
  }, /*#__PURE__*/React.createElement("input", {
    type: "range",
    className: "twk-slider",
    min: min,
    max: max,
    step: step,
    value: value,
    onChange: e => onChange(Number(e.target.value))
  }));
}
function TweakToggle({
  label,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-row twk-row-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "twk-toggle",
    "data-on": value ? '1' : '0',
    role: "switch",
    "aria-checked": !!value,
    onClick: () => onChange(!value)
  }, /*#__PURE__*/React.createElement("i", null)));
}
function TweakRadio({
  label,
  value,
  options,
  onChange
}) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  // The active value is read by pointer-move handlers attached for the lifetime
  // of a drag — ref it so a stale closure doesn't fire onChange for every move.
  const valueRef = React.useRef(value);
  valueRef.current = value;

  // Segments wrap mid-word once per-segment width runs out. The track is
  // ~248px (280 panel − 28 body pad − 4 seg pad), each button loses 12px
  // to its own padding, and 11.5px system-ui averages ~6.3px/char — so 2
  // options fit ~16 chars each, 3 fit ~10. Past that (or >3 options), fall
  // back to a dropdown rather than wrap.
  const labelLen = o => String(typeof o === 'object' ? o.label : o).length;
  const maxLen = options.reduce((m, o) => Math.max(m, labelLen(o)), 0);
  const fitsAsSegments = maxLen <= ({
    2: 16,
    3: 10
  }[options.length] ?? 0);
  if (!fitsAsSegments) {
    // <select> emits strings — map back to the original option value so the
    // fallback stays type-preserving (numbers, booleans) like the segment path.
    const resolve = s => {
      const m = options.find(o => String(typeof o === 'object' ? o.value : o) === s);
      return m === undefined ? s : typeof m === 'object' ? m.value : m;
    };
    return /*#__PURE__*/React.createElement(TweakSelect, {
      label: label,
      value: value,
      options: options,
      onChange: s => onChange(resolve(s))
    });
  }
  const opts = options.map(o => typeof o === 'object' ? o : {
    value: o,
    label: o
  });
  const idx = Math.max(0, opts.findIndex(o => o.value === value));
  const n = opts.length;
  const segAt = clientX => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor((clientX - r.left - 2) / inner * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };
  const onPointerDown = e => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = ev => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    ref: trackRef,
    role: "radiogroup",
    onPointerDown: onPointerDown,
    className: dragging ? 'twk-seg dragging' : 'twk-seg'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-seg-thumb",
    style: {
      left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
      width: `calc((100% - 4px) / ${n})`
    }
  }), opts.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.value,
    type: "button",
    role: "radio",
    "aria-checked": o.value === value
  }, o.label))));
}
function TweakSelect({
  label,
  value,
  options,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("select", {
    className: "twk-field",
    value: value,
    onChange: e => onChange(e.target.value)
  }, options.map(o => {
    const v = typeof o === 'object' ? o.value : o;
    const l = typeof o === 'object' ? o.label : o;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })));
}
function TweakText({
  label,
  value,
  placeholder,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("input", {
    className: "twk-field",
    type: "text",
    value: value,
    placeholder: placeholder,
    onChange: e => onChange(e.target.value)
  }));
}
function TweakNumber({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange
}) {
  const clamp = n => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({
    x: 0,
    val: 0
  });
  const onScrubStart = e => {
    e.preventDefault();
    startRef.current = {
      x: e.clientX,
      val: value
    };
    const decimals = (String(step).split('.')[1] || '').length;
    const move = ev => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-num"
  }, /*#__PURE__*/React.createElement("span", {
    className: "twk-num-lbl",
    onPointerDown: onScrubStart
  }, label), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: value,
    min: min,
    max: max,
    step: step,
    onChange: e => onChange(clamp(Number(e.target.value)))
  }), unit && /*#__PURE__*/React.createElement("span", {
    className: "twk-num-unit"
  }, unit));
}

// Relative-luminance contrast pick — checkmarks drawn over a swatch need to
// read on both #111 and #fafafa without per-option configuration. Hex input
// only (#rgb / #rrggbb); named or rgb()/hsl() colors fall through to "light".
function __twkIsLight(hex) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, c => c + c) : h.padEnd(6, '0');
  const n = parseInt(x.slice(0, 6), 16);
  if (Number.isNaN(n)) return true;
  const r = n >> 16 & 255,
    g = n >> 8 & 255,
    b = n & 255;
  return r * 299 + g * 587 + b * 114 > 148000;
}
const __TwkCheck = ({
  light
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 14 14",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "M3 7.2 5.8 10 11 4.2",
  fill: "none",
  strokeWidth: "2.2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  stroke: light ? 'rgba(0,0,0,.78)' : '#fff'
}));

// TweakColor — curated color/palette picker. Each option is either a single
// hex string or an array of 1-5 hex strings; the card adapts — a lone color
// renders solid, a palette renders colors[0] as the hero (left ~2/3) with the
// rest stacked in a sharp column on the right. onChange emits the
// option in the shape it was passed (string stays string, array stays array).
// Without options it falls back to the native color input for back-compat.
function TweakColor({
  label,
  value,
  options,
  onChange
}) {
  if (!options || !options.length) {
    return /*#__PURE__*/React.createElement("div", {
      className: "twk-row twk-row-h"
    }, /*#__PURE__*/React.createElement("div", {
      className: "twk-lbl"
    }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("input", {
      type: "color",
      className: "twk-swatch",
      value: value,
      onChange: e => onChange(e.target.value)
    }));
  }
  // Native <input type=color> emits lowercase hex per the HTML spec, so
  // compare case-insensitively. String() guards JSON.stringify(undefined),
  // which returns the primitive undefined (no .toLowerCase).
  const key = o => String(JSON.stringify(o)).toLowerCase();
  const cur = key(value);
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-chips",
    role: "radiogroup"
  }, options.map((o, i) => {
    const colors = Array.isArray(o) ? o : [o];
    const [hero, ...rest] = colors;
    const sup = rest.slice(0, 4);
    const on = key(o) === cur;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      type: "button",
      className: "twk-chip",
      role: "radio",
      "aria-checked": on,
      "data-on": on ? '1' : '0',
      "aria-label": colors.join(', '),
      title: colors.join(' · '),
      style: {
        background: hero
      },
      onClick: () => onChange(o)
    }, sup.length > 0 && /*#__PURE__*/React.createElement("span", null, sup.map((c, j) => /*#__PURE__*/React.createElement("i", {
      key: j,
      style: {
        background: c
      }
    }))), on && /*#__PURE__*/React.createElement(__TwkCheck, {
      light: __twkIsLight(hero)
    }));
  })));
}
function TweakButton({
  label,
  onClick,
  secondary = false
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: secondary ? 'twk-btn secondary' : 'twk-btn',
    onClick: onClick
  }, label);
}
Object.assign(window, {
  useTweaks,
  TweaksPanel,
  TweakSection,
  TweakRow,
  TweakSlider,
  TweakToggle,
  TweakRadio,
  TweakSelect,
  TweakText,
  TweakNumber,
  TweakColor,
  TweakButton
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "tweaks-panel.jsx", error: String((e && e.message) || e) }); }

// ui_kits/shopview-app/app.jsx
try { (() => {
// Shopview UI kit demo app
const {
  useState: useStateApp
} = React;
function App() {
  const [page, setPage] = useStateApp('work-orders');
  const [woId, setWoId] = useStateApp(null);
  let body;
  if (page === 'work-orders' && woId) {
    body = /*#__PURE__*/React.createElement(WorkOrderDetail, {
      id: woId,
      onBack: () => setWoId(null)
    });
  } else if (page === 'work-orders') {
    body = /*#__PURE__*/React.createElement(WorkOrdersList, {
      onOpen: id => setWoId(id)
    });
  } else if (page === 'schedule') {
    body = /*#__PURE__*/React.createElement(Schedule, null);
  } else {
    body = /*#__PURE__*/React.createElement(EmptyPage, {
      title: page
    });
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#F8FAFC'
    }
  }, /*#__PURE__*/React.createElement(AppHeader, {
    active: page,
    onNavigate: k => {
      setPage(k);
      setWoId(null);
    }
  }), body);
}
function EmptyPage({
  title
}) {
  const pretty = {
    customers: 'Customers',
    parts: 'Parts',
    reports: 'Reports'
  }[title] || title;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 32px',
      background: '#F8FAFC'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 28,
      fontWeight: 600,
      color: '#202939',
      margin: 0,
      fontFamily: 'Inter Display, Inter',
      letterSpacing: '-0.01em'
    }
  }, pretty), /*#__PURE__*/React.createElement(Card, {
    style: {
      marginTop: 24,
      padding: 48,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: '#697586'
    }
  }, "Screen stub. The full ", pretty, " module would live here, built from the same primitives.")));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/shopview-app/app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/shopview-app/chrome.jsx
try { (() => {
// App chrome: header, side panel, stat tiles
const {
  useState: useStateChrome
} = React;
function AppHeader({
  active = 'work-orders',
  onNavigate
}) {
  const items = [{
    key: 'work-orders',
    label: 'Work Orders'
  }, {
    key: 'schedule',
    label: 'Schedule'
  }, {
    key: 'customers',
    label: 'Customers'
  }, {
    key: 'parts',
    label: 'Parts'
  }, {
    key: 'reports',
    label: 'Reports'
  }];
  return /*#__PURE__*/React.createElement("header", {
    style: {
      height: 60,
      borderBottom: '1px solid #E3E8EF',
      background: '#fff',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      gap: 24,
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      fontWeight: 700,
      fontStyle: 'italic',
      fontSize: 24,
      letterSpacing: '-0.03em',
      fontFamily: 'Inter Display, Inter'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#0F111A'
    }
  }, "Sh"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: '0.7em',
      height: '0.7em',
      position: 'relative',
      display: 'inline-block',
      marginLeft: 1,
      marginRight: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      inset: 0,
      background: '#257CFF',
      clipPath: 'polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      width: '22%',
      height: '22%',
      left: '39%',
      top: '39%',
      background: '#fff',
      borderRadius: '50%'
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#257CFF'
    }
  }, "pView")), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 2,
      flex: 1
    }
  }, items.map(it => /*#__PURE__*/React.createElement("button", {
    key: it.key,
    onClick: () => onNavigate?.(it.key),
    style: {
      padding: '8px 14px',
      borderRadius: 8,
      fontSize: 14,
      fontWeight: 500,
      background: active === it.key ? '#E5EDFF' : 'transparent',
      color: active === it.key ? '#0868A7' : '#364152',
      border: 0,
      cursor: 'pointer',
      fontFamily: 'inherit'
    }
  }, it.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 36,
      width: 280,
      border: '1px solid #CDD5DF',
      borderRadius: 8,
      display: 'flex',
      alignItems: 'center',
      padding: '0 12px',
      gap: 8,
      color: '#697586'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 16
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      flex: 1
    }
  }, "Search work orders, parts, customers\u2026"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      color: '#697586',
      border: '1px solid #E3E8EF',
      padding: '1px 6px',
      borderRadius: 4,
      background: '#F8FAFC'
    }
  }, "\u2318K")), /*#__PURE__*/React.createElement("button", {
    style: {
      width: 36,
      height: 36,
      border: '1px solid #CDD5DF',
      borderRadius: 8,
      background: '#fff',
      color: '#364152',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "bell",
    size: 18
  })), /*#__PURE__*/React.createElement(Avatar, {
    name: "Aaron Keating",
    size: 36
  }));
}
function SidePanel({
  children,
  title,
  width = 300
}) {
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width,
      flex: 'none',
      background: '#F8FAFC',
      borderRight: '1px solid #E3E8EF',
      padding: 20,
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: '#697586',
      letterSpacing: '0.04em',
      textTransform: 'uppercase'
    }
  }, title), children);
}
function StatCard({
  label,
  value,
  delta,
  tone = 'info'
}) {
  const tones = {
    info: {
      bg: '#E5EDFF',
      fg: '#0868A7'
    },
    success: {
      bg: '#ABF5C4',
      fg: '#108737'
    },
    warning: {
      bg: '#FFF5E0',
      fg: '#B47A00'
    },
    neutral: {
      bg: '#EEF2F6',
      fg: '#364152'
    }
  }[tone];
  return /*#__PURE__*/React.createElement(Card, {
    style: {
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: '#697586',
      fontWeight: 500,
      marginBottom: 6
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 28,
      fontWeight: 700,
      color: '#202939',
      fontFamily: 'Inter Display, Inter',
      letterSpacing: '-0.01em'
    }
  }, value), delta && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      padding: '2px 8px',
      borderRadius: 9999,
      background: tones.bg,
      color: tones.fg
    }
  }, delta)));
}
Object.assign(window, {
  AppHeader,
  SidePanel,
  StatCard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/shopview-app/chrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/shopview-app/components.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Shopview primitive components
// Depends on: React, ReactDOM (globals from UMD)

const {
  useState
} = React;

// ── Icon (subset of Lucide-style outlined icons as inline SVG) ──
function Icon({
  name,
  size = 18,
  stroke = 2,
  style,
  className
}) {
  const paths = {
    plus: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "5",
      x2: "12",
      y2: "19"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "5",
      y1: "12",
      x2: "19",
      y2: "12"
    })),
    x: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
      x1: "18",
      y1: "6",
      x2: "6",
      y2: "18"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "6",
      y1: "6",
      x2: "18",
      y2: "18"
    })),
    search: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "11",
      cy: "11",
      r: "7"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "20",
      y1: "20",
      x2: "16.65",
      y2: "16.65"
    })),
    'chevron-down': /*#__PURE__*/React.createElement("polyline", {
      points: "6 9 12 15 18 9"
    }),
    'chevron-right': /*#__PURE__*/React.createElement("polyline", {
      points: "9 6 15 12 9 18"
    }),
    'arrow-right': /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
      x1: "5",
      y1: "12",
      x2: "19",
      y2: "12"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: "12 5 19 12 12 19"
    })),
    'arrow-up': /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "19",
      x2: "12",
      y2: "5"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: "5 12 12 5 19 12"
    })),
    calendar: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
      x: "3",
      y: "4",
      width: "18",
      height: "18",
      rx: "2"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "16",
      y1: "2",
      x2: "16",
      y2: "6"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "8",
      y1: "2",
      x2: "8",
      y2: "6"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "3",
      y1: "10",
      x2: "21",
      y2: "10"
    })),
    user: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "7",
      r: "4"
    })),
    settings: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "3"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
    })),
    wrench: /*#__PURE__*/React.createElement("path", {
      d: "M14.7 6.3a4 4 0 1 0 5 5L21 13l-7 7-4-4 7-7z M13 11l-8 8a2 2 0 1 0 2.8 2.8l8-8"
    }),
    truck: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
      x: "1",
      y: "7",
      width: "13",
      height: "10",
      rx: "1"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M14 10h4l3 4v3h-7"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "5.5",
      cy: "18.5",
      r: "1.5"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "17.5",
      cy: "18.5",
      r: "1.5"
    })),
    clipboard: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
      x: "6",
      y: "4",
      width: "12",
      height: "17",
      rx: "2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "9",
      y1: "10",
      x2: "15",
      y2: "10"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "9",
      y1: "14",
      x2: "15",
      y2: "14"
    })),
    box: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M21 8l-9 5-9-5 9-5z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M3 8v8l9 5 9-5V8"
    })),
    'file-text': /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: "14 2 14 8 20 8"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "8",
      y1: "13",
      x2: "16",
      y2: "13"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "8",
      y1: "17",
      x2: "13",
      y2: "17"
    })),
    'more-horizontal': /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "1"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "19",
      cy: "12",
      r: "1"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "5",
      cy: "12",
      r: "1"
    })),
    filter: /*#__PURE__*/React.createElement("polygon", {
      points: "22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"
    }),
    check: /*#__PURE__*/React.createElement("polyline", {
      points: "20 6 9 17 4 12"
    }),
    bell: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M13.7 21a2 2 0 0 1-3.4 0"
    })),
    copy: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
      x: "9",
      y: "9",
      width: "13",
      height: "13",
      rx: "2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
    }))
  };
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: style,
    className: className
  }, paths[name] || null);
}

// ── Button ──
function Button({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  style,
  ...rest
}) {
  const sizes = {
    sm: {
      h: 32,
      px: 12,
      fs: 13
    },
    md: {
      h: 40,
      px: 16,
      fs: 14
    },
    lg: {
      h: 48,
      px: 20,
      fs: 15
    }
  }[size];
  const variants = {
    primary: {
      bg: '#257CFF',
      color: '#fff',
      border: 'transparent'
    },
    secondary: {
      bg: '#fff',
      color: '#364152',
      border: '#CDD5DF'
    },
    tertiary: {
      bg: 'transparent',
      color: '#257CFF',
      border: 'transparent'
    },
    destructive: {
      bg: '#EF4444',
      color: '#fff',
      border: 'transparent'
    },
    ghost: {
      bg: 'transparent',
      color: '#364152',
      border: 'transparent'
    }
  }[variant];
  return /*#__PURE__*/React.createElement("button", _extends({}, rest, {
    style: {
      height: sizes.h,
      padding: `0 ${sizes.px}px`,
      fontSize: sizes.fs,
      fontWeight: 600,
      background: variants.bg,
      color: variants.color,
      border: `1px solid ${variants.border}`,
      borderRadius: 8,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      cursor: 'pointer',
      fontFamily: 'inherit',
      boxShadow: variant === 'secondary' ? '0 1px 2px rgba(16,24,40,0.05)' : 'none',
      transition: 'background 120ms ease-out, border-color 120ms ease-out',
      ...style
    }
  }), icon && /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 16
  }), children);
}

// ── Badge ──
function Badge({
  tone = 'neutral',
  children,
  style
}) {
  const tones = {
    success: {
      bg: '#ABF5C4',
      fg: '#108737'
    },
    warning: {
      bg: '#FFF5E0',
      fg: '#B47A00'
    },
    error: {
      bg: '#FCA397',
      fg: '#B52020'
    },
    info: {
      bg: '#E5EDFF',
      fg: '#0868A7'
    },
    neutral: {
      bg: '#EEF2F6',
      fg: '#364152'
    },
    teal: {
      bg: '#CCFBF1',
      fg: '#0F766E'
    },
    violet: {
      bg: '#EDE9FE',
      fg: '#6D28D9'
    }
  }[tone];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      padding: '2px 10px',
      borderRadius: 9999,
      fontSize: 12,
      fontWeight: 600,
      lineHeight: '18px',
      background: tones.bg,
      color: tones.fg,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      ...style
    }
  }, children);
}

// Map work-order statuses to badge tones
function statusTone(s) {
  return {
    'Paid': 'success',
    'Authorized': 'success',
    'Completed': 'success',
    'Approved': 'success',
    'Partially Paid': 'warning',
    'Awaiting': 'warning',
    'Requested': 'warning',
    'Authorization Required': 'warning',
    'Unpaid': 'error',
    'Overdue': 'error',
    'In Progress': 'info',
    'Scheduled': 'info',
    'Draft': 'neutral'
  }[s] || 'neutral';
}

// ── Input ──
function Input({
  label,
  hint,
  error,
  icon,
  style,
  ...rest
}) {
  const [focused, setFocused] = useState(false);
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 500,
      color: '#697586'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 40,
      borderRadius: 8,
      background: '#fff',
      display: 'flex',
      alignItems: 'center',
      padding: '0 12px',
      gap: 8,
      border: error ? '1px solid #EF4444' : focused ? '2px solid #257CFF' : '1px solid #CDD5DF',
      boxShadow: focused && !error ? '0 0 0 4px rgba(37,124,255,0.24)' : 'none',
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 16,
    style: {
      color: '#697586'
    }
  }), /*#__PURE__*/React.createElement("input", _extends({}, rest, {
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: {
      border: 0,
      outline: 0,
      flex: 1,
      fontSize: 14,
      fontFamily: 'inherit',
      color: '#202939',
      background: 'transparent'
    }
  }))), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: error ? '#B52020' : '#697586'
    }
  }, error || hint));
}

// ── Card ──
function Card({
  children,
  style,
  padded = true
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      border: '1px solid #E3E8EF',
      borderRadius: 12,
      padding: padded ? 20 : 0,
      boxShadow: '0 1px 2px rgba(16,24,40,0.05)',
      ...style
    }
  }, children);
}

// ── Tabs ──
function Tabs({
  tabs,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      borderBottom: '1px solid #E3E8EF'
    }
  }, tabs.map(t => {
    const active = t.key === value;
    return /*#__PURE__*/React.createElement("button", {
      key: t.key,
      onClick: () => onChange?.(t.key),
      style: {
        padding: '10px 14px',
        fontSize: 14,
        fontWeight: active ? 600 : 500,
        color: active ? '#257CFF' : '#697586',
        borderBottom: `2px solid ${active ? '#257CFF' : 'transparent'}`,
        marginBottom: -1,
        background: 'transparent',
        border: 'none',
        borderRadius: 0,
        cursor: 'pointer',
        fontFamily: 'inherit'
      }
    }, t.label, typeof t.count === 'number' && /*#__PURE__*/React.createElement("span", {
      style: {
        opacity: 0.7,
        marginLeft: 4
      }
    }, "(", t.count, ")"));
  }));
}

// ── Avatar ──
function Avatar({
  name = '',
  size = 32,
  color
}) {
  const initials = name.split(' ').map(x => x[0]).slice(0, 2).join('').toUpperCase();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius: '50%',
      background: color || '#EEF2F6',
      color: color ? '#fff' : '#364152',
      fontWeight: 600,
      fontSize: size * 0.38,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 'none'
    }
  }, initials);
}

// ── Toggle ──
function Toggle({
  on,
  onChange
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => onChange?.(!on),
    style: {
      width: 36,
      height: 20,
      borderRadius: 9999,
      border: 0,
      padding: 2,
      background: on ? '#257CFF' : '#CDD5DF',
      cursor: 'pointer',
      display: 'inline-flex',
      justifyContent: on ? 'flex-end' : 'flex-start',
      transition: 'background 120ms'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 16,
      height: 16,
      borderRadius: '50%',
      background: '#fff'
    }
  }));
}

// ── Checkbox ──
function Checkbox({
  checked,
  onChange,
  label
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 14,
      color: '#364152',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => onChange?.(!checked),
    style: {
      width: 18,
      height: 18,
      borderRadius: 4,
      border: `1px solid ${checked ? '#257CFF' : '#CDD5DF'}`,
      background: checked ? '#257CFF' : '#fff',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 'none'
    }
  }, checked && /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 12,
    style: {
      color: '#fff'
    },
    stroke: 3
  })), label);
}
Object.assign(window, {
  Icon,
  Button,
  Badge,
  statusTone,
  Input,
  Card,
  Tabs,
  Avatar,
  Toggle,
  Checkbox
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/shopview-app/components.jsx", error: String((e && e.message) || e) }); }

// ui_kits/shopview-app/data.js
try { (() => {
// Shared mock data for the Shopview UI kit demo
window.SV_DATA = {
  workOrders: [{
    id: 'S-488',
    customer: 'PepsiCo Foods Can.',
    unit: 'T-220 Kenworth T680',
    status: 'Paid',
    total: 2480.00,
    date: 'Oct 30',
    lead: 'Aaron Keating'
  }, {
    id: 'S-487',
    customer: 'ABC Truck Lines',
    unit: 'TR-14 Freightliner Cascadia',
    status: 'Partially Paid',
    total: 1175.40,
    date: 'Mar 13',
    lead: 'Jackie Moore'
  }, {
    id: 'S-486',
    customer: 'Twin Cities Logistics',
    unit: '42 Volvo VNL',
    status: 'Unpaid',
    total: 820.00,
    date: 'Aug 2',
    lead: 'Mia Lopez'
  }, {
    id: 'S-485',
    customer: 'Redline Express',
    unit: 'F-08 Peterbilt 579',
    status: 'In Progress',
    total: 3240.00,
    date: 'Nov 1',
    lead: 'D. Martinez'
  }, {
    id: 'S-484',
    customer: 'Northwind Logistics',
    unit: 'H-21 Mack Anthem',
    status: 'Scheduled',
    total: 0,
    date: 'Nov 4',
    lead: 'Aaron Keating'
  }, {
    id: 'S-483',
    customer: 'Prairie Haulers',
    unit: 'L-05 Kenworth W990',
    status: 'Completed',
    total: 1890.00,
    date: 'Oct 28',
    lead: 'Jackie Moore'
  }],
  lines: [{
    id: 1,
    label: 'Perform oil and filter change',
    status: 'Completed',
    labor: 2.0,
    parts: 142.50,
    total: 392.50
  }, {
    id: 2,
    label: 'Replace front brake pads and rotors',
    status: 'Authorized',
    labor: 3.5,
    parts: 640.00,
    total: 1052.50
  }, {
    id: 3,
    label: 'Inspect and repair air compressor',
    status: 'Authorization Required',
    labor: 1.5,
    parts: 280.00,
    total: 456.50
  }, {
    id: 4,
    label: 'DOT inspection',
    status: 'Awaiting',
    labor: 1.0,
    parts: 0,
    total: 125.00
  }],
  schedule: [{
    tech: 'Aaron Keating',
    rows: [{
      day: 1,
      start: 8,
      hrs: 8,
      label: 'S-488 PepsiCo Foods',
      color: 'blue'
    }]
  }, {
    tech: 'Jackie Moore',
    rows: [{
      day: 1,
      start: 8,
      hrs: 4,
      label: 'S-487 ABC Truck',
      color: 'teal'
    }, {
      day: 1,
      start: 13,
      hrs: 3,
      label: 'S-483 Prairie',
      color: 'violet'
    }]
  }, {
    tech: 'Mia Lopez',
    rows: [{
      day: 1,
      start: 9,
      hrs: 6,
      label: 'S-486 Twin Cities',
      color: 'pink'
    }]
  }, {
    tech: 'D. Martinez',
    rows: [{
      day: 1,
      start: 8,
      hrs: 8,
      label: 'S-485 Redline Express',
      color: 'cyan'
    }]
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/shopview-app/data.js", error: String((e && e.message) || e) }); }

// ui_kits/shopview-app/screens.jsx
try { (() => {
// Full product screens
const {
  useState: useStateScreens
} = React;

// ── Work Orders list ──
function WorkOrdersList({
  onOpen
}) {
  const rows = window.SV_DATA.workOrders;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '24px 32px',
      background: '#F8FAFC',
      overflowY: 'auto',
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 28,
      fontWeight: 600,
      color: '#202939',
      margin: 0,
      fontFamily: 'Inter Display, Inter',
      letterSpacing: '-0.01em'
    }
  }, "Work Orders"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    icon: "filter",
    style: {
      marginRight: 8
    }
  }, "Filter"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: "plus"
  }, "New Work Order")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 12,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    label: "Open",
    value: "18",
    delta: "+3 this week",
    tone: "info"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Awaiting Authorization",
    value: "4",
    delta: "Action needed",
    tone: "warning"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "In Progress",
    value: "9",
    tone: "info"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Billed \xB7 7d",
    value: "$46,820",
    delta: "+12%",
    tone: "success"
  })), /*#__PURE__*/React.createElement(Card, {
    padded: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 16px',
      borderBottom: '1px solid #E3E8EF',
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    tabs: [{
      key: 'all',
      label: 'All',
      count: 32
    }, {
      key: 'mine',
      label: 'My Work Orders',
      count: 8
    }, {
      key: 'shop',
      label: 'Shop',
      count: 24
    }],
    value: "all",
    onChange: () => {}
  })), /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, ['WO #', 'Customer', 'Unit', 'Lead Tech', 'Status', 'Total', 'Date'].map((h, i) => /*#__PURE__*/React.createElement("th", {
    key: h,
    style: {
      textAlign: i >= 5 ? 'right' : 'left',
      fontSize: 12,
      fontWeight: 600,
      color: '#697586',
      padding: '12px 16px',
      borderBottom: '1px solid #E3E8EF',
      background: '#F8FAFC',
      letterSpacing: '0.02em'
    }
  }, h)))), /*#__PURE__*/React.createElement("tbody", null, rows.map(r => /*#__PURE__*/React.createElement("tr", {
    key: r.id,
    onClick: () => onOpen?.(r.id),
    style: {
      cursor: 'pointer'
    },
    onMouseEnter: e => e.currentTarget.style.background = '#F8FAFC',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent'
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '12px 16px',
      borderBottom: '1px solid #EEF2F6',
      color: '#257CFF',
      fontWeight: 600
    }
  }, r.id), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '12px 16px',
      borderBottom: '1px solid #EEF2F6',
      color: '#202939'
    }
  }, r.customer), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '12px 16px',
      borderBottom: '1px solid #EEF2F6',
      color: '#4B5565'
    }
  }, r.unit), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '12px 16px',
      borderBottom: '1px solid #EEF2F6'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: r.lead,
    size: 24
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#202939'
    }
  }, r.lead))), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '12px 16px',
      borderBottom: '1px solid #EEF2F6'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: statusTone(r.status)
  }, r.status)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '12px 16px',
      borderBottom: '1px solid #EEF2F6',
      textAlign: 'right',
      fontVariantNumeric: 'tabular-nums',
      color: '#202939',
      fontWeight: 500
    }
  }, r.total ? `$${r.total.toLocaleString('en-US', {
    minimumFractionDigits: 2
  })}` : '—'), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '12px 16px',
      borderBottom: '1px solid #EEF2F6',
      textAlign: 'right',
      color: '#697586',
      fontVariantNumeric: 'tabular-nums'
    }
  }, r.date)))))));
}

// ── Work Order detail ──
function WorkOrderDetail({
  id = 'S-487',
  onBack
}) {
  const wo = window.SV_DATA.workOrders.find(w => w.id === id) || window.SV_DATA.workOrders[1];
  const [tab, setTab] = useStateScreens('lines');
  const lines = window.SV_DATA.lines;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flex: 1,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(SidePanel, {
    title: "Work Order",
    width: 300
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      border: 0,
      background: 'transparent',
      color: '#257CFF',
      fontSize: 13,
      fontWeight: 500,
      padding: 0,
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      fontFamily: 'inherit'
    }
  }, "\u2190 All work orders"), /*#__PURE__*/React.createElement(Card, {
    style: {
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: '#697586',
      marginBottom: 4
    }
  }, "WO #"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: 700,
      color: '#202939',
      fontFamily: 'Inter Display, Inter'
    }
  }, wo.id), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: statusTone(wo.status)
  }, wo.status))), /*#__PURE__*/React.createElement(Card, {
    style: {
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: '#697586',
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      marginBottom: 10
    }
  }, "Customer"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      color: '#202939',
      fontSize: 14
    }
  }, wo.customer), /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#697586',
      fontSize: 13,
      marginTop: 4
    }
  }, "IBS# 4482 \xB7 (612) 555-0198"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      fontSize: 11,
      fontWeight: 700,
      color: '#697586',
      letterSpacing: '0.04em',
      textTransform: 'uppercase'
    }
  }, "Unit"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      color: '#202939',
      fontSize: 14,
      marginTop: 6
    }
  }, wo.unit), /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#697586',
      fontSize: 13,
      marginTop: 2
    }
  }, "VIN 1FUJGL\u2026830971 \xB7 218,440 mi")), /*#__PURE__*/React.createElement(Card, {
    style: {
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: '#697586',
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      marginBottom: 10
    }
  }, "People"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: wo.lead,
    size: 28
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 500,
      color: '#202939'
    }
  }, wo.lead), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: '#697586'
    }
  }, "Lead Technician"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: "Jackie Moore",
    size: 28
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 500,
      color: '#202939'
    }
  }, "Jackie Moore"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: '#697586'
    }
  }, "Service Advisor")))))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      background: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 32px',
      borderBottom: '1px solid #E3E8EF',
      display: 'flex',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: '#697586',
      marginBottom: 4
    }
  }, "Work Orders \xB7 ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#257CFF'
    }
  }, wo.id)), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 24,
      fontWeight: 600,
      color: '#202939',
      margin: 0,
      fontFamily: 'Inter Display, Inter',
      letterSpacing: '-0.01em'
    }
  }, wo.customer, " \xB7 ", wo.unit)), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    icon: "copy"
  }, "Duplicate"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: "plus"
  }, "New Line")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 32px'
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    value: tab,
    onChange: setTab,
    tabs: [{
      key: 'lines',
      label: 'Lines',
      count: lines.length
    }, {
      key: 'parts',
      label: 'Parts',
      count: 20
    }, {
      key: 'returns',
      label: 'Part Returns'
    }, {
      key: 'notes',
      label: 'Notes',
      count: 2
    }, {
      key: 'timesheets',
      label: 'Timesheets',
      count: 2
    }, {
      key: 'stats',
      label: 'Statistics'
    }, {
      key: 'finance',
      label: 'Finance'
    }]
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 32px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, lines.map(l => /*#__PURE__*/React.createElement(Card, {
    key: l.id,
    style: {
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 18px',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      borderBottom: '1px solid #EEF2F6'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 28,
      height: 28,
      borderRadius: 6,
      background: '#E5EDFF',
      color: '#0868A7',
      fontSize: 12,
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 'none'
    }
  }, "L", l.id), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: '#202939'
    }
  }, l.label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: '#697586',
      marginTop: 2
    }
  }, l.labor, " labor hrs \xB7 $", l.parts.toFixed(2), " parts")), /*#__PURE__*/React.createElement(Badge, {
    tone: statusTone(l.status)
  }, l.status), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 700,
      color: '#202939',
      fontVariantNumeric: 'tabular-nums',
      minWidth: 92,
      textAlign: 'right',
      fontFamily: 'Inter Display, Inter'
    }
  }, "$", l.total.toLocaleString('en-US', {
    minimumFractionDigits: 2
  })), l.status === 'Authorization Required' ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm"
  }, "Decline"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm"
  }, "Authorize")) : l.status === 'Authorized' ? /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    icon: "check"
  }, "Complete") : /*#__PURE__*/React.createElement("button", {
    style: {
      width: 32,
      height: 32,
      border: 0,
      background: 'transparent',
      color: '#697586',
      borderRadius: 6,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "more-horizontal",
    size: 18
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 24,
      padding: '8px 18px',
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: '#697586'
    }
  }, "Subtotal"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 600,
      color: '#202939',
      fontVariantNumeric: 'tabular-nums'
    }
  }, "$2,026.50")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: '#697586'
    }
  }, "Tax"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 600,
      color: '#202939',
      fontVariantNumeric: 'tabular-nums'
    }
  }, "$157.05")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: '#697586'
    }
  }, "Total"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 700,
      color: '#257CFF',
      fontVariantNumeric: 'tabular-nums',
      fontFamily: 'Inter Display, Inter'
    }
  }, "$2,183.55"))))));
}

// ── Schedule (week view) ──
function Schedule() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const hours = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
  const colorMap = {
    blue: {
      bg: '#E5EDFF',
      fg: '#0868A7',
      bar: '#257CFF'
    },
    teal: {
      bg: '#CCFBF1',
      fg: '#0F766E',
      bar: '#14B8A6'
    },
    violet: {
      bg: '#EDE9FE',
      fg: '#6D28D9',
      bar: '#8B5CF6'
    },
    pink: {
      bg: '#FCE7F3',
      fg: '#BE185D',
      bar: '#DB2777'
    },
    cyan: {
      bg: '#CFFAFE',
      fg: '#0E7490',
      bar: '#06B6D4'
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      background: '#F8FAFC'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '24px 32px 16px',
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 28,
      fontWeight: 600,
      color: '#202939',
      margin: 0,
      fontFamily: 'Inter Display, Inter',
      letterSpacing: '-0.01em'
    }
  }, "Schedule"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      border: '1px solid #CDD5DF',
      borderRadius: 8,
      overflow: 'hidden',
      marginRight: 12,
      background: '#fff'
    }
  }, ['Day', 'Week', 'Month'].map((v, i) => /*#__PURE__*/React.createElement("button", {
    key: v,
    style: {
      padding: '8px 14px',
      border: 0,
      fontSize: 13,
      fontWeight: 500,
      background: i === 1 ? '#E5EDFF' : '#fff',
      color: i === 1 ? '#0868A7' : '#364152',
      cursor: 'pointer',
      fontFamily: 'inherit'
    }
  }, v))), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    icon: "calendar"
  }, "Week of Nov 4"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: "plus",
    style: {
      marginLeft: 8
    }
  }, "New Work Order")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: 'auto',
      padding: '0 32px 24px'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padded: false,
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '180px repeat(5, 1fr)',
      borderBottom: '1px solid #E3E8EF'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 16px',
      fontSize: 12,
      fontWeight: 600,
      color: '#697586',
      background: '#F8FAFC'
    }
  }, "Technician"), days.map(d => /*#__PURE__*/React.createElement("div", {
    key: d,
    style: {
      padding: '12px 16px',
      fontSize: 12,
      fontWeight: 600,
      color: '#697586',
      background: '#F8FAFC',
      borderLeft: '1px solid #E3E8EF'
    }
  }, d))), window.SV_DATA.schedule.map((row, ri) => /*#__PURE__*/React.createElement("div", {
    key: row.tech,
    style: {
      display: 'grid',
      gridTemplateColumns: '180px repeat(5, 1fr)',
      minHeight: 80,
      borderBottom: ri < window.SV_DATA.schedule.length - 1 ? '1px solid #EEF2F6' : '0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: row.tech,
    size: 28
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 500,
      color: '#202939'
    }
  }, row.tech), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: '#697586'
    }
  }, "Technician"))), days.map((d, di) => /*#__PURE__*/React.createElement("div", {
    key: d,
    style: {
      borderLeft: '1px solid #EEF2F6',
      padding: 6,
      position: 'relative'
    }
  }, row.rows.filter(b => b.day === di + 1).map((b, bi) => {
    const c = colorMap[b.color] || colorMap.blue;
    return /*#__PURE__*/React.createElement("div", {
      key: bi,
      style: {
        background: c.bg,
        color: c.fg,
        borderLeft: `3px solid ${c.bar}`,
        borderRadius: 6,
        padding: '6px 10px',
        fontSize: 12,
        fontWeight: 600,
        marginBottom: 4
      }
    }, /*#__PURE__*/React.createElement("div", null, b.label), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 500,
        opacity: 0.8
      }
    }, b.start, ":00 \xB7 ", b.hrs, "h"));
  }))))))));
}
Object.assign(window, {
  WorkOrdersList,
  WorkOrderDetail,
  Schedule
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/shopview-app/screens.jsx", error: String((e && e.message) || e) }); }

// variation-a.jsx
try { (() => {
// Variation A — Editorial Dossier
// Long-scroll editorial layout. Sticky TOC. Large display type. Generous whitespace.

const VA_TOKENS = {
  blue: '#257CFF',
  blueHover: '#1752C0',
  blueDark: '#0868A7',
  ink: '#0F111A',
  text: '#202939',
  muted: '#4B5565',
  soft: '#697586',
  line: '#E3E8EF',
  strongLine: '#CDD5DF',
  bg: '#FFFFFF',
  bgWarm: '#FFFAEB',
  bgCool: '#E9F5FF',
  bgGrey: '#F8FAFC'
};

// ElevenLabs-inspired card: 8px radius, hairline border, soft surface with subtle inner highlight
const VA_CARD = {
  background: '#FFFFFF',
  border: `1px solid ${VA_TOKENS.line}`,
  borderRadius: 8,
  boxShadow: '0 1px 0 rgba(15,17,26,0.02), 0 1px 2px rgba(15,17,26,0.04)'
};
function VAContainer({
  children,
  narrow
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: narrow ? 760 : 1080,
      margin: '0 auto',
      padding: '0 64px'
    }
  }, children);
}
function VAEyebrow({
  children,
  color = VA_TOKENS.blue
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color,
      fontFamily: 'var(--sv-font-ui)'
    }
  }, children);
}
function VAHeader({
  density
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      borderBottom: `1px solid ${VA_TOKENS.line}`,
      background: VA_TOKENS.bg,
      position: 'sticky',
      top: 0,
      zIndex: 10,
      backdropFilter: 'saturate(150%) blur(8px)'
    }
  }, /*#__PURE__*/React.createElement(VAContainer, null, /*#__PURE__*/React.createElement("div", {
    style: {
      height: density === 'compact' ? 56 : 64,
      display: 'flex',
      alignItems: 'center',
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "logo-primary-light.svg",
    alt: "Shopview",
    style: {
      height: 22
    }
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 24,
      marginLeft: 'auto',
      fontSize: 13,
      color: VA_TOKENS.muted,
      fontWeight: 500
    }
  }, /*#__PURE__*/React.createElement("a", {
    style: {
      color: 'inherit'
    },
    href: "#brand"
  }, "Brand"), /*#__PURE__*/React.createElement("a", {
    style: {
      color: 'inherit'
    },
    href: "#color"
  }, "Color"), /*#__PURE__*/React.createElement("a", {
    style: {
      color: 'inherit'
    },
    href: "#type"
  }, "Type"), /*#__PURE__*/React.createElement("a", {
    style: {
      color: 'inherit'
    },
    href: "#space"
  }, "Space"), /*#__PURE__*/React.createElement("a", {
    style: {
      color: 'inherit'
    },
    href: "#icons"
  }, "Icons"), /*#__PURE__*/React.createElement("a", {
    style: {
      color: 'inherit'
    },
    href: "#components"
  }, "Components"), /*#__PURE__*/React.createElement("a", {
    style: {
      color: 'inherit'
    },
    href: "#motion"
  }, "Motion")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: VA_TOKENS.soft,
      fontFamily: 'var(--sv-font-mono)'
    }
  }, "v1.0 \xB7 Apr 2026"))));
}
function VAHero() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '120px 0 96px',
      background: VA_TOKENS.bg
    }
  }, /*#__PURE__*/React.createElement(VAContainer, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 320px',
      gap: 64,
      alignItems: 'end'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(VAEyebrow, null, "Shopview Design System \xB7 Edition 01"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--sv-font-display)',
      fontSize: 88,
      lineHeight: 0.96,
      fontWeight: 700,
      letterSpacing: '-0.035em',
      color: VA_TOKENS.ink,
      margin: '24px 0 0',
      textWrap: 'balance'
    }
  }, "The system", /*#__PURE__*/React.createElement("br", null), "that runs the", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("em", {
    style: {
      fontStyle: 'italic',
      fontWeight: 700,
      color: VA_TOKENS.blue
    }
  }, "shop floor.")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 19,
      lineHeight: 1.55,
      color: VA_TOKENS.muted,
      marginTop: 32,
      maxWidth: 560,
      textWrap: 'pretty'
    }
  }, "A reference document for the visual and verbal language of Shopview \u2014 built for the people who service semi-trucks, tractors, trailers, and fleet vehicles. Functional, not friendly. Direct, not decorative.")), /*#__PURE__*/React.createElement("div", {
    style: {
      border: `1px solid ${VA_TOKENS.line}`,
      borderRadius: 8,
      padding: 20,
      background: VA_TOKENS.bgGrey
    }
  }, /*#__PURE__*/React.createElement(VAEyebrow, {
    color: VA_TOKENS.muted
  }, "In this document"), /*#__PURE__*/React.createElement("ol", {
    style: {
      margin: '14px 0 0',
      padding: 0,
      listStyle: 'none',
      fontSize: 13,
      color: VA_TOKENS.text,
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, [['01', 'Brand'], ['02', 'Logo'], ['03', 'Color'], ['04', 'Typography'], ['05', 'Spacing'], ['06', 'Iconography'], ['07', 'Components'], ['08', 'Motion']].map(([n, t]) => /*#__PURE__*/React.createElement("li", {
    key: n,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      borderBottom: `1px dashed ${VA_TOKENS.line}`,
      paddingBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: VA_TOKENS.soft,
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11
    }
  }, n), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500
    }
  }, t)), /*#__PURE__*/React.createElement("span", {
    style: {
      color: VA_TOKENS.soft,
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11
    }
  }, "\u2192"))))))));
}
function VASectionHead({
  n,
  kicker,
  title,
  lede,
  id
}) {
  return /*#__PURE__*/React.createElement("div", {
    id: id,
    style: {
      paddingTop: 96,
      paddingBottom: 32
    }
  }, /*#__PURE__*/React.createElement(VAContainer, null, /*#__PURE__*/React.createElement(VAEyebrow, null, n, " \xB7 ", kicker), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--sv-font-display)',
      fontSize: 56,
      lineHeight: 1.0,
      fontWeight: 600,
      letterSpacing: '-0.025em',
      color: VA_TOKENS.ink,
      margin: '12px 0 0'
    }
  }, title), lede && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 17,
      lineHeight: 1.6,
      color: VA_TOKENS.muted,
      margin: '20px 0 0',
      maxWidth: 640
    }
  }, lede)));
}

// 01. Brand
function VABrand() {
  return /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement(VASectionHead, {
    n: "01",
    id: "brand",
    kicker: "Voice & Principles",
    title: "Functional, not friendly.",
    lede: "Shopview copy is verb-first, domain-specific, and gets out of the way. The product is a system of record for shops that don't have time for cheerful UI."
  }), /*#__PURE__*/React.createElement(VAContainer, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 16
    }
  }, [['Verb-first', 'New Work Order. Authorize. Decline. Complete. Add Part.', 'Never OK, Submit, or Click here.'], ['Domain-true', 'Work Order, Line, Bin Location, Service Advisor, IBS#, Eng. Hr.', 'Not "item", "entry", or "task".'], ['One primary', 'Exactly one primary action per view.', 'Secondary buttons for the rest.'], ['No emoji', 'Status communicated by badge + word.', 'Color alone never communicates state.'], ['Title Case nouns', 'Work Order, Part Returns, Canned Lines.', 'Sentence case for helper text.'], ['No "we"', 'The product is not a person.', 'No marketing fluff.']].map(([t, e, n], i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...VA_CARD,
      padding: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11,
      color: VA_TOKENS.soft
    }
  }, "0", i + 1), /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: 20,
      fontWeight: 600,
      color: VA_TOKENS.ink,
      margin: '12px 0 8px'
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      lineHeight: 1.55,
      color: VA_TOKENS.text,
      margin: 0
    }
  }, e), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      lineHeight: 1.5,
      color: VA_TOKENS.soft,
      margin: '8px 0 0'
    }
  }, n))))));
}

// 02. Logo
function VALogo() {
  return /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement(VASectionHead, {
    n: "02",
    id: "logo",
    kicker: "Mark & Wordmark",
    title: "One blue. One mark.",
    lede: "The wordmark sets in Inter Display 800 italic with a custom symbol replacing the 'o'. Brand blue #257CFF is the only fill."
  }), /*#__PURE__*/React.createElement(VAContainer, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: VA_TOKENS.bgGrey,
      border: `1px solid ${VA_TOKENS.line}`,
      borderRadius: 8,
      padding: '80px 64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "logo-primary-light.svg",
    alt: "Shopview wordmark",
    style: {
      width: 420
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 16,
      marginTop: 16
    }
  }, [{
    bg: VA_TOKENS.bg,
    label: 'On surface · #FFFFFF',
    note: 'Default'
  }, {
    bg: VA_TOKENS.bgGrey,
    label: 'On grey-25 · #F8FAFC',
    note: 'Subdued'
  }, {
    bg: VA_TOKENS.blue,
    label: 'On brand · #257CFF',
    note: 'Inverse — wordmark white',
    invert: true
  }].map((o, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...VA_CARD,
      background: o.bg,
      padding: 32,
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      height: 200,
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "symbol-primary.svg",
    alt: "",
    style: {
      height: 36,
      width: 36,
      filter: o.invert ? 'brightness(0) invert(1)' : 'none'
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: o.invert ? '#fff' : VA_TOKENS.muted,
      fontFamily: 'var(--sv-font-mono)'
    }
  }, o.label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: o.invert ? 'rgba(255,255,255,0.7)' : VA_TOKENS.soft,
      marginTop: 4
    }
  }, o.note))))))));
}

// 03. Color
function VAColor() {
  const primary = [['25', '#F6FAFF'], ['50', '#E0EEFF'], ['100', '#BDD0FF'], ['200', '#92C7FB'], ['300', '#6CABF6'], ['400', '#4A9AF4'], ['500', '#257CFF'], ['600', '#1F64DB'], ['700', '#1752C0'], ['800', '#042260'], ['900', '#01082D']];
  const grey = [['25', '#F8FAFC'], ['50', '#EEF2F6'], ['100', '#E3E8EF'], ['200', '#CDD5DF'], ['300', '#9AA4B2'], ['400', '#697586'], ['500', '#4B5565'], ['600', '#364152'], ['700', '#202939'], ['800', '#121926'], ['900', '#0F111A']];
  const semantic = [['Success', '#108737', '#36B360', '#ABF5C4'], ['Warning', '#B47A00', '#EC9E00', '#FFF5E0'], ['Error', '#B52020', '#EF4444', '#FCA397'], ['Info', '#0868A7', '#257CFF', '#E5EDFF']];
  const Ramp = ({
    name,
    scale,
    brand
  }) => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 18,
      fontWeight: 600,
      color: VA_TOKENS.ink,
      margin: 0
    }
  }, name), brand && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: VA_TOKENS.soft,
      fontFamily: 'var(--sv-font-mono)'
    }
  }, brand)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(11, 1fr)',
      gap: 0,
      border: `1px solid ${VA_TOKENS.line}`,
      borderRadius: 8,
      overflow: 'hidden'
    }
  }, scale.map(([n, hex], i) => {
    const dark = i >= 6;
    return /*#__PURE__*/React.createElement("div", {
      key: n,
      style: {
        background: hex,
        color: dark ? '#fff' : VA_TOKENS.ink,
        padding: '20px 10px 14px',
        minHeight: 96,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRight: i < 10 ? `1px solid ${VA_TOKENS.line}` : 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--sv-font-mono)',
        fontSize: 11,
        opacity: 0.85
      }
    }, n), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--sv-font-mono)',
        fontSize: 10,
        opacity: 0.7
      }
    }, hex));
  })));
  return /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement(VASectionHead, {
    n: "03",
    id: "color",
    kicker: "Palette & Tokens",
    title: "Blue-led, slate-structured.",
    lede: "One action blue. An eleven-step grey ladder for everything else. Four semantic colors for status, never for decoration."
  }), /*#__PURE__*/React.createElement(VAContainer, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 48
    }
  }, /*#__PURE__*/React.createElement(Ramp, {
    name: "Primary \xB7 Shopview Blue",
    brand: "Pantone 2727 C \xB7 #257CFF",
    scale: primary
  }), /*#__PURE__*/React.createElement(Ramp, {
    name: "Neutrals \xB7 Slate Grey",
    brand: "11 steps \xB7 F8FAFC \u2192 0F111A",
    scale: grey
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 18,
      fontWeight: 600,
      color: VA_TOKENS.ink,
      margin: '0 0 12px'
    }
  }, "Semantic"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 16
    }
  }, semantic.map(([name, text, base, fill]) => /*#__PURE__*/React.createElement("div", {
    key: name,
    style: {
      ...VA_CARD,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: fill,
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      background: '#fff',
      color: text,
      fontSize: 12,
      fontWeight: 600,
      padding: '3px 10px',
      borderRadius: 999
    }
  }, name)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: VA_TOKENS.soft
    }
  }, "fill"), /*#__PURE__*/React.createElement("span", null, fill)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: VA_TOKENS.soft
    }
  }, "base"), /*#__PURE__*/React.createElement("span", null, base)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: VA_TOKENS.soft
    }
  }, "text"), /*#__PURE__*/React.createElement("span", null, text))))))))));
}

// 04. Typography
function VAType() {
  const scale = [['H1', 'Display 600', '30 / 38', 'Page titles'], ['H2', 'Display 600', '24 / 32', 'Section titles'], ['H3', 'UI 500', '20 / 28', 'Subsection'], ['H4', 'UI 600', '16 / 24', 'Card titles'], ['Body 1', 'UI 400', '14 / 20', 'Default body'], ['Body 2', 'UI 500', '12 / 16', 'Labels, meta'], ['Caption', 'UI 600', '10 / 14', 'Eyebrows, micro']];
  return /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement(VASectionHead, {
    n: "04",
    id: "type",
    kicker: "Type System",
    title: "Inter, two cuts.",
    lede: "Inter at 18pt for UI and body. Inter Display at 28pt for headlines where the tighter optical cut reads better at scale."
  }), /*#__PURE__*/React.createElement(VAContainer, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      ...VA_CARD,
      padding: '64px 48px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--sv-font-display)',
      fontSize: 180,
      lineHeight: 0.9,
      fontWeight: 800,
      fontStyle: 'italic',
      letterSpacing: '-0.05em',
      color: VA_TOKENS.blue
    }
  }, "Aa"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 32,
      marginTop: 32,
      paddingTop: 32,
      borderTop: `1px solid ${VA_TOKENS.line}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      letterSpacing: "0px",
      lineHeight: "1.43"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: VA_TOKENS.soft,
      fontFamily: 'var(--sv-font-mono)'
    }
  }, "UI \xB7 18pt"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--sv-font-ui)',
      fontWeight: 600,
      color: VA_TOKENS.ink,
      marginTop: 8,
      fontSize: "47px"
    }
  }, "Inter"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: VA_TOKENS.muted,
      marginTop: 6
    }
  }, "The grotesque that runs every screen.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: VA_TOKENS.soft,
      fontFamily: 'var(--sv-font-mono)'
    }
  }, "Display \xB7 28pt"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--sv-font-display)',
      fontSize: 48,
      fontWeight: 700,
      color: VA_TOKENS.ink,
      marginTop: 8,
      height: "20px",
      lineHeight: "1.43"
    }
  }, "Inter Display"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: VA_TOKENS.muted,
      marginTop: 6,
      lineHeight: "1.54"
    }
  }, "For H1/H2 only \u2014 tighter aperture at scale.")))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24,
      ...VA_CARD,
      overflow: 'hidden'
    }
  }, scale.map(([n, w, lh, use], i) => /*#__PURE__*/React.createElement("div", {
    key: n,
    style: {
      display: 'grid',
      gridTemplateColumns: '80px 1fr 140px 120px 1fr',
      alignItems: 'baseline',
      gap: 24,
      padding: '20px 28px',
      borderTop: i ? `1px solid ${VA_TOKENS.line}` : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11,
      color: VA_TOKENS.blue
    }
  }, n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: i < 2 ? 'var(--sv-font-display)' : 'var(--sv-font-ui)',
      fontSize: parseInt(lh.split('/')[0]),
      lineHeight: `${parseInt(lh.split('/')[1])}px`,
      fontWeight: parseInt(w.split(' ')[1]),
      color: VA_TOKENS.ink
    }
  }, "The quick brown fox"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11,
      color: VA_TOKENS.soft
    }
  }, w), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11,
      color: VA_TOKENS.soft
    }
  }, lh), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: VA_TOKENS.muted
    }
  }, use)))))));
}

// 05. Spacing
function VASpacing() {
  const scale = [[1, 4], [2, 8], [3, 12], [4, 16], [5, 20], [6, 24], [8, 32], [10, 40], [12, 48], [16, 64], [20, 80], [24, 96]];
  const radii = [['xs', 4, 'Inputs (compact)'], ['sm', 6, 'Inline tags'], ['md', 8, 'Buttons, inputs, cards'], ['lg', 12, 'Large cards, modals'], ['xl', 16, 'Modal outer'], ['pill', 999, 'Badges, toggles']];
  return /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement(VASectionHead, {
    n: "05",
    id: "space",
    kicker: "Grid & Geometry",
    title: "Built on a 4-pixel grid.",
    lede: "Every spacing token is a multiple of 4. Radii follow the same logic \u2014 8px is the workhorse."
  }), /*#__PURE__*/React.createElement(VAContainer, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...VA_CARD,
      padding: 28
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 16,
      fontWeight: 600,
      color: VA_TOKENS.ink,
      margin: '0 0 20px'
    }
  }, "Spacing scale"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, scale.map(([n, px]) => /*#__PURE__*/React.createElement("div", {
    key: n,
    style: {
      display: 'grid',
      gridTemplateColumns: '60px 1fr 60px',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11,
      color: VA_TOKENS.soft
    }
  }, "space-", n), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 8,
      background: VA_TOKENS.bgCool,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      width: px,
      background: VA_TOKENS.blue
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11,
      color: VA_TOKENS.text,
      textAlign: 'right'
    }
  }, px, "px"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      ...VA_CARD,
      padding: 28
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 16,
      fontWeight: 600,
      color: VA_TOKENS.ink,
      margin: '0 0 20px'
    }
  }, "Radii"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, radii.map(([n, r, use]) => /*#__PURE__*/React.createElement("div", {
    key: n,
    style: {
      display: 'grid',
      gridTemplateColumns: '48px 1fr 60px',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 48,
      height: 48,
      background: VA_TOKENS.blue,
      borderRadius: r === 999 ? 999 : r
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11,
      color: VA_TOKENS.text
    }
  }, "radius-", n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: VA_TOKENS.soft,
      marginTop: 2
    }
  }, use)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11,
      color: VA_TOKENS.soft,
      textAlign: 'right'
    }
  }, r === 999 ? '∞' : `${r}px`))))))));
}

// 06. Iconography
function VAIcons() {
  const icons = ['plus', 'x', 'search', 'chevron-down', 'arrow-right', 'arrow-up', 'calendar', 'user', 'settings', 'wrench', 'truck', 'clipboard', 'box', 'file-text', 'filter', 'check', 'bell', 'copy'];
  return /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement(VASectionHead, {
    n: "06",
    id: "icons",
    kicker: "Iconography",
    title: "Outlined. 1.5\u20132px stroke.",
    lede: "Icons are line-only with rounded joins, sized at 16, 20, 24, or 32. Color comes from currentColor \u2014 no fills, no duotone."
  }), /*#__PURE__*/React.createElement(VAContainer, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 32,
      alignItems: 'center',
      padding: 32,
      ...VA_CARD,
      background: VA_TOKENS.bgGrey,
      borderRadius: '8px 8px 0 0'
    }
  }, [16, 20, 24, 32].map(s => /*#__PURE__*/React.createElement("div", {
    key: s,
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 64,
      height: 64,
      background: '#fff',
      border: `1px solid ${VA_TOKENS.line}`,
      borderRadius: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: VA_TOKENS.ink
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "wrench",
    size: s
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11,
      color: VA_TOKENS.soft
    }
  }, s, "px"))), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      height: 64,
      background: VA_TOKENS.line
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 64,
      height: 64,
      background: '#E5EDFF',
      borderRadius: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: VA_TOKENS.blue
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "wrench",
    size: 28,
    stroke: 1.75
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11,
      color: VA_TOKENS.soft
    }
  }, "featured"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(9, 1fr)',
      gap: 0,
      border: `1px solid ${VA_TOKENS.line}`,
      borderTop: 'none',
      borderRadius: '0 0 8px 8px',
      overflow: 'hidden'
    }
  }, icons.map((name, i) => /*#__PURE__*/React.createElement("div", {
    key: name,
    style: {
      aspectRatio: '1',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      color: VA_TOKENS.text,
      borderRight: (i + 1) % 9 !== 0 ? `1px solid ${VA_TOKENS.line}` : 'none',
      borderTop: i >= 9 ? `1px solid ${VA_TOKENS.line}` : 'none'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: name,
    size: 22,
    stroke: 1.75
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 10,
      color: VA_TOKENS.soft
    }
  }, name)))))));
}

// 07. Components
function VAComponents() {
  const [tab, setTab] = React.useState('lines');
  return /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement(VASectionHead, {
    n: "07",
    id: "components",
    kicker: "Component Library",
    title: "Twelve primitives. One blue.",
    lede: "Every screen reduces to a small set of primitives. Reuse aggressively. Build new ones only when the existing set truly doesn't cover the case."
  }), /*#__PURE__*/React.createElement(VAContainer, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(12, 1fr)',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: 'span 12',
      ...VA_CARD,
      padding: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      margin: 0,
      color: VA_TOKENS.ink
    }
  }, "Buttons"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11,
      color: VA_TOKENS.soft
    }
  }, "5 variants \xD7 3 sizes")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 32,
      flexWrap: 'wrap',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary"
  }, "New Work Order"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary"
  }, "Save"), /*#__PURE__*/React.createElement(Button, {
    variant: "tertiary"
  }, "View details"), /*#__PURE__*/React.createElement(Button, {
    variant: "destructive"
  }, "Delete Part"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost"
  }, "Cancel"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 1,
      height: 32,
      background: VA_TOKENS.line
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: "plus"
  }, "Add Part"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    icon: "filter"
  }, "Filter"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm"
  }, "Authorize"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg"
  }, "Complete Work Order"))), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: 'span 6',
      ...VA_CARD,
      padding: 28
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      margin: '0 0 20px',
      color: VA_TOKENS.ink
    }
  }, "Inputs"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Customer",
    placeholder: "ABC Truck Lines",
    icon: "search"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "VIN",
    placeholder: "1FTFW1ET5DFC10312",
    hint: "17 characters"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Bin Location",
    placeholder: "A-12-3",
    error: "Bin not found in current shop"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: 'span 6',
      ...VA_CARD,
      padding: 28
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      margin: '0 0 20px',
      color: VA_TOKENS.ink
    }
  }, "Status Badges"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8
    }
  }, ['Paid', 'Authorized', 'Completed', 'Approved'].map(s => /*#__PURE__*/React.createElement(Badge, {
    key: s,
    tone: statusTone(s)
  }, s))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8
    }
  }, ['Awaiting', 'Requested', 'Authorization Required', 'Partially Paid'].map(s => /*#__PURE__*/React.createElement(Badge, {
    key: s,
    tone: statusTone(s)
  }, s))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8
    }
  }, ['Unpaid', 'Overdue'].map(s => /*#__PURE__*/React.createElement(Badge, {
    key: s,
    tone: statusTone(s)
  }, s)), ['In Progress', 'Scheduled'].map(s => /*#__PURE__*/React.createElement(Badge, {
    key: s,
    tone: statusTone(s)
  }, s)), /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral"
  }, "Draft")))), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: 'span 12',
      ...VA_CARD,
      padding: 28
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      margin: '0 0 20px',
      color: VA_TOKENS.ink
    }
  }, "Tabs"), /*#__PURE__*/React.createElement(Tabs, {
    value: tab,
    onChange: setTab,
    tabs: [{
      key: 'lines',
      label: 'Lines',
      count: 17
    }, {
      key: 'parts',
      label: 'Parts',
      count: 20
    }, {
      key: 'returns',
      label: 'Part Returns'
    }, {
      key: 'notes',
      label: 'Notes',
      count: 2
    }, {
      key: 'time',
      label: 'Timesheets',
      count: 2
    }, {
      key: 'stats',
      label: 'Statistics'
    }, {
      key: 'finance',
      label: 'Finance'
    }]
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20,
      padding: 16,
      background: VA_TOKENS.bgGrey,
      borderRadius: 8,
      fontSize: 13,
      color: VA_TOKENS.muted,
      fontFamily: 'var(--sv-font-mono)'
    }
  }, "Active: ", tab)), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: 'span 6',
      ...VA_CARD,
      padding: 28
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      margin: '0 0 20px',
      color: VA_TOKENS.ink
    }
  }, "Card \xB7 Work Order Line"), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: VA_TOKENS.soft,
      fontFamily: 'var(--sv-font-mono)'
    }
  }, "L-04"), /*#__PURE__*/React.createElement("h4", {
    style: {
      margin: '4px 0 0',
      fontSize: 16,
      fontWeight: 600
    }
  }, "Replace front brake pads"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: VA_TOKENS.muted,
      marginTop: 6
    }
  }, "Tech: M. Diaz \xB7 2.5 hr")), /*#__PURE__*/React.createElement(Badge, {
    tone: "warning"
  }, "Authorization Required")))), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: 'span 6',
      ...VA_CARD,
      padding: 28
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      margin: '0 0 20px',
      color: VA_TOKENS.ink
    }
  }, "Avatar \xB7 Toggle \xB7 Checkbox"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 32,
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: -8
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: "Sam Hill",
    size: 36
  }), /*#__PURE__*/React.createElement(Avatar, {
    name: "Pat Liu",
    size: 36,
    color: "#7C3AED"
  }), /*#__PURE__*/React.createElement(Avatar, {
    name: "Mae Diaz",
    size: 36,
    color: "#0D9488"
  })), /*#__PURE__*/React.createElement(VATogglePair, null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Checkbox, {
    checked: true,
    label: "Authorized"
  }), /*#__PURE__*/React.createElement(Checkbox, {
    checked: false,
    label: "Hold for parts"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: 'span 12',
      ...VA_CARD,
      padding: 28
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      margin: '0 0 20px',
      color: VA_TOKENS.ink
    }
  }, "Notifications"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, [{
    tone: 'success',
    text: 'Work Order WO-1041 marked Completed.'
  }, {
    tone: 'warning',
    text: 'Two lines on WO-1038 require authorization.'
  }, {
    tone: 'error',
    text: 'Could not save: bin location A-12-3 is in another shop.'
  }, {
    tone: 'info',
    text: 'Inventory sync ran 4 minutes ago.'
  }].map(({
    tone,
    text
  }, i) => /*#__PURE__*/React.createElement(VANotice, {
    key: i,
    tone: tone,
    text: text
  })))))));
}
function VATogglePair() {
  const [a, setA] = React.useState(true);
  const [b, setB] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Toggle, {
    on: a,
    onChange: setA
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13
    }
  }, "Show financials")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Toggle, {
    on: b,
    onChange: setB
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13
    }
  }, "Notify on completion")));
}
function VANotice({
  tone,
  text
}) {
  const tones = {
    success: {
      bg: '#ABF5C4',
      fg: '#108737',
      icon: 'check'
    },
    warning: {
      bg: '#FFF5E0',
      fg: '#B47A00',
      icon: 'bell'
    },
    error: {
      bg: '#FCA397',
      fg: '#B52020',
      icon: 'x'
    },
    info: {
      bg: '#E5EDFF',
      fg: '#0868A7',
      icon: 'bell'
    }
  }[tone];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 16px',
      background: tones.bg,
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 28,
      height: 28,
      borderRadius: 999,
      background: '#fff',
      color: tones.fg,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: tones.icon,
    size: 14,
    stroke: 2.5
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: tones.fg,
      fontWeight: 500
    }
  }, text));
}

// 08. Motion
function VAMotion() {
  return /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement(VASectionHead, {
    n: "08",
    id: "motion",
    kicker: "Motion",
    title: "120ms. Ease-out. No bounce.",
    lede: "Motion is utility, not personality. Hover lifts shadow. Press deepens fill. Focus glows. Nothing scales, nothing springs."
  }), /*#__PURE__*/React.createElement(VAContainer, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 16
    }
  }, [['Hover', 'shadow-sm → shadow-md', 'No scale. No translate.'], ['Press', 'fill → primary-800', 'No shrink.'], ['Focus', '4px blue@24% glow', 'Always visible. Always.'], ['Disabled', '40% opacity', 'No interaction.']].map(([t, m, n]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      ...VA_CARD,
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontFamily: 'var(--sv-font-mono)',
      color: VA_TOKENS.soft,
      marginBottom: 14
    }
  }, t), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 64,
      background: VA_TOKENS.bgGrey,
      borderRadius: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 14
    }
  }, t === 'Hover' && /*#__PURE__*/React.createElement("button", {
    style: {
      height: 40,
      padding: '0 16px',
      background: VA_TOKENS.blue,
      color: '#fff',
      border: 0,
      borderRadius: 8,
      fontWeight: 600,
      fontSize: 14,
      fontFamily: 'inherit',
      boxShadow: '0 4px 8px rgba(11,23,51,0.08)'
    }
  }, "Hover"), t === 'Press' && /*#__PURE__*/React.createElement("button", {
    style: {
      height: 40,
      padding: '0 16px',
      background: '#042260',
      color: '#fff',
      border: 0,
      borderRadius: 8,
      fontWeight: 600,
      fontSize: 14,
      fontFamily: 'inherit'
    }
  }, "Pressed"), t === 'Focus' && /*#__PURE__*/React.createElement("button", {
    style: {
      height: 40,
      padding: '0 16px',
      background: VA_TOKENS.blue,
      color: '#fff',
      border: 0,
      borderRadius: 8,
      fontWeight: 600,
      fontSize: 14,
      fontFamily: 'inherit',
      boxShadow: '0 0 0 4px rgba(37,124,255,0.24)'
    }
  }, "Focused"), t === 'Disabled' && /*#__PURE__*/React.createElement("button", {
    disabled: true,
    style: {
      height: 40,
      padding: '0 16px',
      background: '#B7D5FF',
      color: '#fff',
      border: 0,
      borderRadius: 8,
      fontWeight: 600,
      fontSize: 14,
      fontFamily: 'inherit'
    }
  }, "Disabled")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--sv-font-mono)',
      fontSize: 11,
      color: VA_TOKENS.text
    }
  }, m), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: VA_TOKENS.soft,
      marginTop: 4
    }
  }, n))))));
}
function VAFooter() {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      marginTop: 96,
      padding: '64px 0',
      borderTop: `1px solid ${VA_TOKENS.line}`,
      background: VA_TOKENS.bgGrey
    }
  }, /*#__PURE__*/React.createElement(VAContainer, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "logo-primary-light.svg",
    alt: "Shopview",
    style: {
      height: 18,
      opacity: 0.6
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: VA_TOKENS.soft,
      fontFamily: 'var(--sv-font-mono)'
    }
  }, "Shopview Design System \xB7 Edition 01 \xB7 Apr 2026"))));
}
function VariationA({
  density = 'comfortable'
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: VA_TOKENS.bg,
      color: VA_TOKENS.text,
      fontFamily: 'var(--sv-font-ui)',
      minHeight: '100%',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(VAHeader, {
    density: density
  }), /*#__PURE__*/React.createElement(VAHero, null), /*#__PURE__*/React.createElement(VABrand, null), /*#__PURE__*/React.createElement(VALogo, null), /*#__PURE__*/React.createElement(VAColor, null), /*#__PURE__*/React.createElement(VAType, null), /*#__PURE__*/React.createElement(VASpacing, null), /*#__PURE__*/React.createElement(VAIcons, null), /*#__PURE__*/React.createElement(VAComponents, null), /*#__PURE__*/React.createElement(VAMotion, null), /*#__PURE__*/React.createElement(VAFooter, null));
}
window.VariationA = VariationA;
})(); } catch (e) { __ds_ns.__errors.push({ path: "variation-a.jsx", error: String((e && e.message) || e) }); }

})();
