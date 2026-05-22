/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const U = globalThis, Z = U.ShadowRoot && (U.ShadyCSS === void 0 || U.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Y = Symbol(), at = /* @__PURE__ */ new WeakMap();
let mt = class {
  constructor(t, e, a) {
    if (this._$cssResult$ = !0, a !== Y) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (Z && t === void 0) {
      const a = e !== void 0 && e.length === 1;
      a && (t = at.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), a && at.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Et = (r) => new mt(typeof r == "string" ? r : r + "", void 0, Y), gt = (r, ...t) => {
  const e = r.length === 1 ? r[0] : t.reduce((a, i, s) => a + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + r[s + 1], r[0]);
  return new mt(e, r, Y);
}, St = (r, t) => {
  if (Z) r.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const a = document.createElement("style"), i = U.litNonce;
    i !== void 0 && a.setAttribute("nonce", i), a.textContent = e.cssText, r.appendChild(a);
  }
}, it = Z ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const a of t.cssRules) e += a.cssText;
  return Et(e);
})(r) : r;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Ct, defineProperty: Mt, getOwnPropertyDescriptor: Ht, getOwnPropertyNames: Lt, getOwnPropertySymbols: Pt, getPrototypeOf: Ot } = Object, y = globalThis, st = y.trustedTypes, Nt = st ? st.emptyScript : "", z = y.reactiveElementPolyfillSupport, H = (r, t) => r, F = { toAttribute(r, t) {
  switch (t) {
    case Boolean:
      r = r ? Nt : null;
      break;
    case Object:
    case Array:
      r = r == null ? r : JSON.stringify(r);
  }
  return r;
}, fromAttribute(r, t) {
  let e = r;
  switch (t) {
    case Boolean:
      e = r !== null;
      break;
    case Number:
      e = r === null ? null : Number(r);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(r);
      } catch {
        e = null;
      }
  }
  return e;
} }, X = (r, t) => !Ct(r, t), ot = { attribute: !0, type: String, converter: F, reflect: !1, useDefault: !1, hasChanged: X };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), y.litPropertyMetadata ?? (y.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let k = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = ot) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const a = Symbol(), i = this.getPropertyDescriptor(t, a, e);
      i !== void 0 && Mt(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, a) {
    const { get: i, set: s } = Ht(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: i, set(o) {
      const n = i == null ? void 0 : i.call(this);
      s == null || s.call(this, o), this.requestUpdate(t, n, a);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? ot;
  }
  static _$Ei() {
    if (this.hasOwnProperty(H("elementProperties"))) return;
    const t = Ot(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(H("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(H("properties"))) {
      const e = this.properties, a = [...Lt(e), ...Pt(e)];
      for (const i of a) this.createProperty(i, e[i]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [a, i] of e) this.elementProperties.set(a, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, a] of this.elementProperties) {
      const i = this._$Eu(e, a);
      i !== void 0 && this._$Eh.set(i, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const a = new Set(t.flat(1 / 0).reverse());
      for (const i of a) e.unshift(it(i));
    } else t !== void 0 && e.push(it(t));
    return e;
  }
  static _$Eu(t, e) {
    const a = e.attribute;
    return a === !1 ? void 0 : typeof a == "string" ? a : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((e) => e(this));
  }
  addController(t) {
    var e;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((e = t.hostConnected) == null || e.call(t));
  }
  removeController(t) {
    var e;
    (e = this._$EO) == null || e.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const a of e.keys()) this.hasOwnProperty(a) && (t.set(a, this[a]), delete this[a]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return St(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((e) => {
      var a;
      return (a = e.hostConnected) == null ? void 0 : a.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var a;
      return (a = e.hostDisconnected) == null ? void 0 : a.call(e);
    });
  }
  attributeChangedCallback(t, e, a) {
    this._$AK(t, a);
  }
  _$ET(t, e) {
    var s;
    const a = this.constructor.elementProperties.get(t), i = this.constructor._$Eu(t, a);
    if (i !== void 0 && a.reflect === !0) {
      const o = (((s = a.converter) == null ? void 0 : s.toAttribute) !== void 0 ? a.converter : F).toAttribute(e, a.type);
      this._$Em = t, o == null ? this.removeAttribute(i) : this.setAttribute(i, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var s, o;
    const a = this.constructor, i = a._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const n = a.getPropertyOptions(i), l = typeof n.converter == "function" ? { fromAttribute: n.converter } : ((s = n.converter) == null ? void 0 : s.fromAttribute) !== void 0 ? n.converter : F;
      this._$Em = i;
      const c = l.fromAttribute(e, n.type);
      this[i] = c ?? ((o = this._$Ej) == null ? void 0 : o.get(i)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, e, a, i = !1, s) {
    var o;
    if (t !== void 0) {
      const n = this.constructor;
      if (i === !1 && (s = this[t]), a ?? (a = n.getPropertyOptions(t)), !((a.hasChanged ?? X)(s, e) || a.useDefault && a.reflect && s === ((o = this._$Ej) == null ? void 0 : o.get(t)) && !this.hasAttribute(n._$Eu(t, a)))) return;
      this.C(t, e, a);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: a, reflect: i, wrapped: s }, o) {
    a && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), s !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || a || (e = void 0), this._$AL.set(t, e)), i === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var a;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [s, o] of this._$Ep) this[s] = o;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [s, o] of i) {
        const { wrapped: n } = o, l = this[s];
        n !== !0 || this._$AL.has(s) || l === void 0 || this.C(s, void 0, o, l);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (a = this._$EO) == null || a.forEach((i) => {
        var s;
        return (s = i.hostUpdate) == null ? void 0 : s.call(i);
      }), this.update(e)) : this._$EM();
    } catch (i) {
      throw t = !1, this._$EM(), i;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((a) => {
      var i;
      return (i = a.hostUpdated) == null ? void 0 : i.call(a);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((e) => this._$ET(e, this[e]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
k.elementStyles = [], k.shadowRootOptions = { mode: "open" }, k[H("elementProperties")] = /* @__PURE__ */ new Map(), k[H("finalized")] = /* @__PURE__ */ new Map(), z == null || z({ ReactiveElement: k }), (y.reactiveElementVersions ?? (y.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const L = globalThis, nt = (r) => r, R = L.trustedTypes, lt = R ? R.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, vt = "$lit$", v = `lit$${Math.random().toFixed(9).slice(2)}$`, yt = "?" + v, Tt = `<${yt}>`, x = document, P = () => x.createComment(""), O = (r) => r === null || typeof r != "object" && typeof r != "function", J = Array.isArray, Dt = (r) => J(r) || typeof (r == null ? void 0 : r[Symbol.iterator]) == "function", I = `[ 	
\f\r]`, M = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ct = /-->/g, ht = />/g, $ = RegExp(`>|${I}(?:([^\\s"'>=/]+)(${I}*=${I}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), dt = /'/g, pt = /"/g, $t = /^(?:script|style|textarea|title)$/i, bt = (r) => (t, ...e) => ({ _$litType$: r, strings: t, values: e }), u = bt(1), A = bt(2), S = Symbol.for("lit-noChange"), p = Symbol.for("lit-nothing"), ut = /* @__PURE__ */ new WeakMap(), b = x.createTreeWalker(x, 129);
function _t(r, t) {
  if (!J(r) || !r.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return lt !== void 0 ? lt.createHTML(t) : t;
}
const Vt = (r, t) => {
  const e = r.length - 1, a = [];
  let i, s = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = M;
  for (let n = 0; n < e; n++) {
    const l = r[n];
    let c, d, h = -1, f = 0;
    for (; f < l.length && (o.lastIndex = f, d = o.exec(l), d !== null); ) f = o.lastIndex, o === M ? d[1] === "!--" ? o = ct : d[1] !== void 0 ? o = ht : d[2] !== void 0 ? ($t.test(d[2]) && (i = RegExp("</" + d[2], "g")), o = $) : d[3] !== void 0 && (o = $) : o === $ ? d[0] === ">" ? (o = i ?? M, h = -1) : d[1] === void 0 ? h = -2 : (h = o.lastIndex - d[2].length, c = d[1], o = d[3] === void 0 ? $ : d[3] === '"' ? pt : dt) : o === pt || o === dt ? o = $ : o === ct || o === ht ? o = M : (o = $, i = void 0);
    const g = o === $ && r[n + 1].startsWith("/>") ? " " : "";
    s += o === M ? l + Tt : h >= 0 ? (a.push(c), l.slice(0, h) + vt + l.slice(h) + v + g) : l + v + (h === -2 ? n : g);
  }
  return [_t(r, s + (r[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), a];
};
class N {
  constructor({ strings: t, _$litType$: e }, a) {
    let i;
    this.parts = [];
    let s = 0, o = 0;
    const n = t.length - 1, l = this.parts, [c, d] = Vt(t, e);
    if (this.el = N.createElement(c, a), b.currentNode = this.el.content, e === 2 || e === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (i = b.nextNode()) !== null && l.length < n; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const h of i.getAttributeNames()) if (h.endsWith(vt)) {
          const f = d[o++], g = i.getAttribute(h).split(v), m = /([.?@])?(.*)/.exec(f);
          l.push({ type: 1, index: s, name: m[2], strings: g, ctor: m[1] === "." ? Ft : m[1] === "?" ? Rt : m[1] === "@" ? jt : j }), i.removeAttribute(h);
        } else h.startsWith(v) && (l.push({ type: 6, index: s }), i.removeAttribute(h));
        if ($t.test(i.tagName)) {
          const h = i.textContent.split(v), f = h.length - 1;
          if (f > 0) {
            i.textContent = R ? R.emptyScript : "";
            for (let g = 0; g < f; g++) i.append(h[g], P()), b.nextNode(), l.push({ type: 2, index: ++s });
            i.append(h[f], P());
          }
        }
      } else if (i.nodeType === 8) if (i.data === yt) l.push({ type: 2, index: s });
      else {
        let h = -1;
        for (; (h = i.data.indexOf(v, h + 1)) !== -1; ) l.push({ type: 7, index: s }), h += v.length - 1;
      }
      s++;
    }
  }
  static createElement(t, e) {
    const a = x.createElement("template");
    return a.innerHTML = t, a;
  }
}
function C(r, t, e = r, a) {
  var o, n;
  if (t === S) return t;
  let i = a !== void 0 ? (o = e._$Co) == null ? void 0 : o[a] : e._$Cl;
  const s = O(t) ? void 0 : t._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== s && ((n = i == null ? void 0 : i._$AO) == null || n.call(i, !1), s === void 0 ? i = void 0 : (i = new s(r), i._$AT(r, e, a)), a !== void 0 ? (e._$Co ?? (e._$Co = []))[a] = i : e._$Cl = i), i !== void 0 && (t = C(r, i._$AS(r, t.values), i, a)), t;
}
class Ut {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: a } = this._$AD, i = ((t == null ? void 0 : t.creationScope) ?? x).importNode(e, !0);
    b.currentNode = i;
    let s = b.nextNode(), o = 0, n = 0, l = a[0];
    for (; l !== void 0; ) {
      if (o === l.index) {
        let c;
        l.type === 2 ? c = new V(s, s.nextSibling, this, t) : l.type === 1 ? c = new l.ctor(s, l.name, l.strings, this, t) : l.type === 6 && (c = new zt(s, this, t)), this._$AV.push(c), l = a[++n];
      }
      o !== (l == null ? void 0 : l.index) && (s = b.nextNode(), o++);
    }
    return b.currentNode = x, i;
  }
  p(t) {
    let e = 0;
    for (const a of this._$AV) a !== void 0 && (a.strings !== void 0 ? (a._$AI(t, a, e), e += a.strings.length - 2) : a._$AI(t[e])), e++;
  }
}
class V {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, a, i) {
    this.type = 2, this._$AH = p, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = a, this.options = i, this._$Cv = (i == null ? void 0 : i.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = C(this, t, e), O(t) ? t === p || t == null || t === "" ? (this._$AH !== p && this._$AR(), this._$AH = p) : t !== this._$AH && t !== S && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Dt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== p && O(this._$AH) ? this._$AA.nextSibling.data = t : this.T(x.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var s;
    const { values: e, _$litType$: a } = t, i = typeof a == "number" ? this._$AC(t) : (a.el === void 0 && (a.el = N.createElement(_t(a.h, a.h[0]), this.options)), a);
    if (((s = this._$AH) == null ? void 0 : s._$AD) === i) this._$AH.p(e);
    else {
      const o = new Ut(i, this), n = o.u(this.options);
      o.p(e), this.T(n), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = ut.get(t.strings);
    return e === void 0 && ut.set(t.strings, e = new N(t)), e;
  }
  k(t) {
    J(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let a, i = 0;
    for (const s of t) i === e.length ? e.push(a = new V(this.O(P()), this.O(P()), this, this.options)) : a = e[i], a._$AI(s), i++;
    i < e.length && (this._$AR(a && a._$AB.nextSibling, i), e.length = i);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var a;
    for ((a = this._$AP) == null ? void 0 : a.call(this, !1, !0, e); t !== this._$AB; ) {
      const i = nt(t).nextSibling;
      nt(t).remove(), t = i;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class j {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, a, i, s) {
    this.type = 1, this._$AH = p, this._$AN = void 0, this.element = t, this.name = e, this._$AM = i, this.options = s, a.length > 2 || a[0] !== "" || a[1] !== "" ? (this._$AH = Array(a.length - 1).fill(new String()), this.strings = a) : this._$AH = p;
  }
  _$AI(t, e = this, a, i) {
    const s = this.strings;
    let o = !1;
    if (s === void 0) t = C(this, t, e, 0), o = !O(t) || t !== this._$AH && t !== S, o && (this._$AH = t);
    else {
      const n = t;
      let l, c;
      for (t = s[0], l = 0; l < s.length - 1; l++) c = C(this, n[a + l], e, l), c === S && (c = this._$AH[l]), o || (o = !O(c) || c !== this._$AH[l]), c === p ? t = p : t !== p && (t += (c ?? "") + s[l + 1]), this._$AH[l] = c;
    }
    o && !i && this.j(t);
  }
  j(t) {
    t === p ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Ft extends j {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === p ? void 0 : t;
  }
}
class Rt extends j {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== p);
  }
}
class jt extends j {
  constructor(t, e, a, i, s) {
    super(t, e, a, i, s), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = C(this, t, e, 0) ?? p) === S) return;
    const a = this._$AH, i = t === p && a !== p || t.capture !== a.capture || t.once !== a.once || t.passive !== a.passive, s = t !== p && (a === p || i);
    i && this.element.removeEventListener(this.name, this, a), s && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class zt {
  constructor(t, e, a) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = a;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    C(this, t);
  }
}
const W = L.litHtmlPolyfillSupport;
W == null || W(N, V), (L.litHtmlVersions ?? (L.litHtmlVersions = [])).push("3.3.3");
const It = (r, t, e) => {
  const a = (e == null ? void 0 : e.renderBefore) ?? t;
  let i = a._$litPart$;
  if (i === void 0) {
    const s = (e == null ? void 0 : e.renderBefore) ?? null;
    a._$litPart$ = i = new V(t.insertBefore(P(), s), s, void 0, e ?? {});
  }
  return i._$AI(r), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const _ = globalThis;
class E extends k {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e;
    const t = super.createRenderRoot();
    return (e = this.renderOptions).renderBefore ?? (e.renderBefore = t.firstChild), t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = It(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) == null || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) == null || t.setConnected(!1);
  }
  render() {
    return S;
  }
}
var ft;
E._$litElement$ = !0, E.finalized = !0, (ft = _.litElementHydrateSupport) == null || ft.call(_, { LitElement: E });
const B = _.litElementPolyfillSupport;
B == null || B({ LitElement: E });
(_.litElementVersions ?? (_.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const xt = (r) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(r, t);
  }) : customElements.define(r, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Wt = { attribute: !0, type: String, converter: F, reflect: !1, hasChanged: X }, Bt = (r = Wt, t, e) => {
  const { kind: a, metadata: i } = e;
  let s = globalThis.litPropertyMetadata.get(i);
  if (s === void 0 && globalThis.litPropertyMetadata.set(i, s = /* @__PURE__ */ new Map()), a === "setter" && ((r = Object.create(r)).wrapped = !0), s.set(e.name, r), a === "accessor") {
    const { name: o } = e;
    return { set(n) {
      const l = t.get.call(this);
      t.set.call(this, n), this.requestUpdate(o, l, r, !0, n);
    }, init(n) {
      return n !== void 0 && this.C(o, void 0, r, n), n;
    } };
  }
  if (a === "setter") {
    const { name: o } = e;
    return function(n) {
      const l = this[o];
      t.call(this, n), this.requestUpdate(o, l, r, !0, n);
    };
  }
  throw Error("Unsupported decorator location: " + a);
};
function K(r) {
  return (t, e) => typeof e == "object" ? Bt(r, t, e) : ((a, i, s) => {
    const o = i.hasOwnProperty(s);
    return i.constructor.createProperty(s, a), o ? Object.getOwnPropertyDescriptor(i, s) : void 0;
  })(r, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function wt(r) {
  return K({ ...r, state: !0, attribute: !1 });
}
var qt = Object.defineProperty, Zt = Object.getOwnPropertyDescriptor, G = (r, t, e, a) => {
  for (var i = a > 1 ? void 0 : a ? Zt(t, e) : t, s = r.length - 1, o; s >= 0; s--)
    (o = r[s]) && (i = (a ? o(t, e, i) : o(i)) || i);
  return a && i && qt(t, e, i), i;
};
const Yt = [
  { key: "outdoor_temp", label: "Outdoor temperature" },
  { key: "supply_temp", label: "Supply temperature" },
  { key: "extract_temp", label: "Extract temperature" },
  { key: "exhaust_temp", label: "Exhaust temperature" },
  { key: "supply_fan", label: "Supply fan" },
  { key: "extract_fan", label: "Extract fan" },
  { key: "heat_exchanger_speed", label: "Heat exchanger speed" },
  { key: "heater_output", label: "Heater output" },
  { key: "filter_alarm", label: "Filter alarm" },
  { key: "alarm", label: "Alarm" },
  { key: "mode", label: "Mode" }
], Xt = [
  { key: "outdoor_temp", label: "Outdoor label" },
  { key: "supply_temp", label: "Supply label" },
  { key: "extract_temp", label: "Extract label" },
  { key: "exhaust_temp", label: "Exhaust label" },
  { key: "supply_fan", label: "Supply fan label" },
  { key: "extract_fan", label: "Extract fan label" },
  { key: "heat_exchanger_speed", label: "Heat exchanger label" },
  { key: "heater_output", label: "Heater label" },
  { key: "mode", label: "Mode label" },
  { key: "filter_alarm", label: "Filter alarm label" },
  { key: "alarm", label: "Alarm label" }
];
let T = class extends E {
  constructor() {
    super(...arguments), this.config = { type: "custom:ventilation-card" };
  }
  setConfig(r) {
    this.config = { ...r, type: r.type || "custom:ventilation-card" };
  }
  render() {
    var r, t, e, a, i, s, o;
    return this.hass ? u`
      <div class="editor">
        ${this.renderSection("General", u`
          ${this.renderTextField("Name", this.config.name ?? "", (n) => this.updateRoot("name", n))}
          <ha-select
            label="Exchanger type"
            .value=${this.config.exchanger_type ?? "rotary"}
            @selected=${(n) => {
      const l = n.target.value;
      this.updateRoot("exchanger_type", l);
    }}
            @change=${(n) => {
      const l = n.target.value;
      this.updateRoot("exchanger_type", l);
    }}
          >
            <mwc-list-item value="rotary">Rotary</mwc-list-item>
            <mwc-list-item value="crossflow">Crossflow</mwc-list-item>
            <mwc-list-item value="counterflow">Counterflow</mwc-list-item>
            <mwc-list-item value="none">None</mwc-list-item>
          </ha-select>
        `)}

        ${this.renderSection("Entities", u`
          ${Yt.map(
      ({ key: n, label: l }) => {
        var c;
        return u`
              <ha-entity-picker
                .hass=${this.hass}
                .value=${((c = this.config.entities) == null ? void 0 : c[n]) ?? ""}
                .label=${l}
                allow-custom-entity
                @value-changed=${(d) => this.updateNested("entities", n, d.detail.value ?? "")}
              ></ha-entity-picker>
            `;
      }
    )}
        `)}

        ${this.renderSection("Labels", u`
          ${Xt.map(
      ({ key: n, label: l }) => {
        var c;
        return this.renderTextField(l, ((c = this.config.labels) == null ? void 0 : c[n]) ?? "", (d) => this.updateNested("labels", n, d));
      }
    )}
        `)}

        ${this.renderSection("Airflow colors", u`
          ${this.renderColorField(
      "Outdoor/intake color",
      ((r = this.config.colors) == null ? void 0 : r.outdoor_air) ?? "",
      (n) => this.updateNested("colors", "outdoor_air", n)
    )}
          ${this.renderColorField(
      "Supply air color",
      ((t = this.config.colors) == null ? void 0 : t.supply_air) ?? "",
      (n) => this.updateNested("colors", "supply_air", n)
    )}
          ${this.renderColorField(
      "Extract air color",
      ((e = this.config.colors) == null ? void 0 : e.extract_air) ?? "",
      (n) => this.updateNested("colors", "extract_air", n)
    )}
          ${this.renderColorField(
      "Exhaust air color",
      ((a = this.config.colors) == null ? void 0 : a.exhaust_air) ?? "",
      (n) => this.updateNested("colors", "exhaust_air", n)
    )}
        `)}

        ${this.renderSection("Value box styling", u`
          ${this.renderColorField(
      "Value box border color",
      ((i = this.config.value_box) == null ? void 0 : i.border_color) ?? "",
      (n) => this.updateNested("value_box", "border_color", n)
    )}
          ${this.renderColorField(
      "Value box background color",
      ((s = this.config.value_box) == null ? void 0 : s.background_color) ?? "",
      (n) => this.updateNested("value_box", "background_color", n)
    )}
          ${this.renderColorField(
      "Value box text color",
      ((o = this.config.value_box) == null ? void 0 : o.text_color) ?? "",
      (n) => this.updateNested("value_box", "text_color", n)
    )}
        `)}
      </div>
    ` : p;
  }
  renderSection(r, t) {
    return u`<div class="section"><h3>${r}</h3><div class="fields">${t}</div></div>`;
  }
  renderTextField(r, t, e) {
    return u`<ha-textfield .label=${r} .value=${t} @input=${(a) => e(a.target.value)}></ha-textfield>`;
  }
  renderColorField(r, t, e) {
    return u`
      <div class="color-row">
        <ha-textfield .label=${r} .value=${t} placeholder="Default" @input=${(a) => e(a.target.value)}></ha-textfield>
        <input type="color" .value=${this.toColorValue(t)} @input=${(a) => e(a.target.value)} />
        <button type="button" @click=${() => e("")}>Clear</button>
      </div>
    `;
  }
  toColorValue(r) {
    return /^#[0-9A-F]{6}$/i.test(r) ? r : "#5fcf9b";
  }
  updateRoot(r, t) {
    const e = { ...this.config };
    t.trim() ? e[r] = t : delete e[r], this.updateConfig(e);
  }
  updateNested(r, t, e) {
    const a = { ...this.config }, i = { ...a[r] ?? {} };
    e.trim() ? i[t] = e : delete i[t], Object.keys(i).length === 0 ? delete a[r] : a[r] = i, this.updateConfig(a);
  }
  updateConfig(r) {
    this.config = r, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this.config },
        bubbles: !0,
        composed: !0
      })
    );
  }
};
T.styles = gt`
    .editor {
      display: grid;
      gap: 16px;
    }
    .section {
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.2));
      border-radius: 12px;
      padding: 12px;
    }
    h3 {
      margin: 0 0 12px;
      font-size: 15px;
    }
    .fields {
      display: grid;
      gap: 10px;
    }
    .color-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto auto;
      gap: 8px;
      align-items: center;
    }
  `;
G([
  K({ attribute: !1 })
], T.prototype, "hass", 2);
G([
  wt()
], T.prototype, "config", 2);
T = G([
  xt("ventilation-card-editor")
], T);
var Jt = Object.defineProperty, Kt = Object.getOwnPropertyDescriptor, Q = (r, t, e, a) => {
  for (var i = a > 1 ? void 0 : a ? Kt(t, e) : t, s = r.length - 1, o; s >= 0; s--)
    (o = r[s]) && (i = (a ? o(t, e, i) : o(i)) || i);
  return a && i && Jt(t, e, i), i;
};
const q = /* @__PURE__ */ new Set(["unknown", "unavailable", "none", ""]), Gt = {
  outdoor_temp: "Outdoor",
  supply_temp: "Supply",
  extract_temp: "Extract",
  exhaust_temp: "Exhaust",
  supply_fan: "Supply fan",
  extract_fan: "Extract fan",
  heat_exchanger_speed: "Heat exchanger",
  heater_output: "Heater",
  filter_alarm: "Filter alarm",
  alarm: "Alarm",
  mode: "Mode"
};
let D = class extends E {
  setConfig(r) {
    if (!r)
      throw new Error("Invalid ventilation-card configuration");
    this.config = {
      name: "Ventilation",
      exchanger_type: "rotary",
      show_airflow: !0,
      entities: {},
      ...r
    };
  }
  static async getConfigElement() {
    return await customElements.whenDefined("ventilation-card-editor"), document.createElement("ventilation-card-editor");
  }
  static getStubConfig() {
    return {
      type: "custom:ventilation-card",
      name: "Ventilation",
      exchanger_type: "rotary",
      entities: {}
    };
  }
  getCardSize() {
    return 5;
  }
  render() {
    const r = this.config;
    if (!r)
      return p;
    const t = r.entities ?? {}, e = r.show_airflow !== !1;
    return u`
      <ha-card>
        <div class="card">
          <header class="header">
            <h2>${r.name ?? "Ventilation"}</h2>
          </header>

          <div class="schematic" style=${this.schematicStyle()} aria-label="Ventilation unit schematic">
            ${this.renderSchematic(t, e)}
          </div>

          <footer class="status-strip">
            ${this.renderStatusItem("mode", t)}
            ${this.renderStatusItem("filter_alarm", t)}
            ${this.renderStatusItem("alarm", t)}
          </footer>
        </div>
      </ha-card>
    `;
  }
  schematicStyle() {
    var a, i;
    const r = (a = this.config) == null ? void 0 : a.colors, t = (i = this.config) == null ? void 0 : i.value_box;
    return [
      ["--vc-air-outdoor", r == null ? void 0 : r.outdoor_air],
      ["--vc-air-supply", r == null ? void 0 : r.supply_air],
      ["--vc-air-extract", r == null ? void 0 : r.extract_air],
      ["--vc-air-exhaust", r == null ? void 0 : r.exhaust_air],
      ["--vc-value-box-border-color", t == null ? void 0 : t.border_color],
      ["--vc-value-box-background-color", t == null ? void 0 : t.background_color],
      ["--vc-value-box-text-color", t == null ? void 0 : t.text_color]
    ].filter(([, s]) => s && s.trim().length > 0).map(([s, o]) => `${s}: ${o};`).join(" ");
  }
  renderSchematic(r, t) {
    const e = this.entityDisplay("outdoor_temp", r), a = this.entityDisplay("supply_temp", r), i = this.entityDisplay("extract_temp", r), s = this.entityDisplay("exhaust_temp", r), o = this.entityDisplay("supply_fan", r), n = this.entityDisplay("extract_fan", r), l = this.entityDisplay("heat_exchanger_speed", r), c = this.entityDisplay("heater_output", r), d = this.entityNumericValue(r.supply_fan), h = this.entityNumericValue(r.extract_fan), f = this.entityNumericValue(r.heater_output), g = this.entityNumericValue(r.heat_exchanger_speed), m = t && d > 0, w = t && h > 0, At = this.getAnimationDurationFromValue(d, 0.8, 4.8), kt = this.getAnimationDurationFromValue(h, 0.8, 4.8), tt = this.getAnimationDurationFromValue(d, 1.45, 4.2), et = this.getAnimationDurationFromValue(h, 1.45, 4.2), rt = this.getAnimationDurationFromValue(g, 3.2, 14);
    return u`
      <svg
        viewBox="0 0 920 360"
        role="img"
        style="--supply-fan-duration: ${tt}; --extract-fan-duration: ${et}; --rotor-duration: ${rt}; --supply-airflow-duration: ${At}; --extract-airflow-duration: ${kt};"
      >
        <defs>
          <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity="0.14"></feDropShadow>
          </filter>
          <marker id="arrow-outdoor" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L0,7 L7,3.5 z" class="arrow-head outdoor"></path>
          </marker>
          <marker id="arrow-supply" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L0,7 L7,3.5 z" class="arrow-head supply"></path>
          </marker>
          <marker id="arrow-extract" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L0,7 L7,3.5 z" class="arrow-head extract"></path>
          </marker>
          <marker id="arrow-exhaust" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L0,7 L7,3.5 z" class="arrow-head exhaust"></path>
          </marker>
        </defs>

        <rect x="140" y="54" width="640" height="246" rx="12" class="unit-shell"></rect>
        <line x1="140" y1="180" x2="780" y2="180" class="unit-divider"></line>
        <line x1="460" y1="54" x2="460" y2="300" class="unit-divider muted"></line>

        <path d="M780 120 H900" class="duct-outline"></path>
        <path d="M140 120 H20" class="duct-outline"></path>
        <path d="M20 240 H140" class="duct-outline"></path>
        <path d="M780 240 H900" class="duct-outline"></path>
        <path d="M140 120 H780" class="internal-duct-outline"></path>
        <path d="M140 240 H780" class="internal-duct-outline"></path>

        <path d="M780 120 H900" class="duct-fill extract"></path>
        <path d="M886 120 H794" class="flow-line extract extract-air ${w ? "flow" : ""}"></path>
        <path d="M140 120 H20" class="duct-fill exhaust"></path>
        <path d="M126 120 H34" class="flow-line exhaust extract-air ${w ? "flow" : ""}"></path>
        <path d="M20 240 H140" class="duct-fill outdoor"></path>
        <path d="M34 240 H126" class="flow-line outdoor supply-air ${m ? "flow" : ""}"></path>
        <path d="M780 240 H900" class="duct-fill supply"></path>
        <path d="M794 240 H886" class="flow-line supply supply-air ${m ? "flow" : ""}"></path>

        <path d="M28 120 L40 113 L40 127 Z" class="outer-arrow exhaust"></path>
        <path d="M876 120 L888 113 L888 127 Z" class="outer-arrow extract"></path>
        <path d="M42 240 L30 233 L30 247 Z" class="outer-arrow outdoor"></path>
        <path d="M892 240 L880 233 L880 247 Z" class="outer-arrow supply"></path>

        <path d="M150 240 H194" class="internal-flow-line outdoor supply-air ${m ? "flow" : ""}"></path>
        <path d="M246 240 H388" class="internal-flow-line outdoor supply-air ${m ? "flow" : ""}"></path>
        <path d="M532 240 H624" class="internal-flow-line supply supply-air ${m ? "flow" : ""}"></path>
        <path d="M696 240 H712" class="internal-flow-line supply supply-air ${m ? "flow" : ""}"></path>
        <path d="M756 240 H770" class="internal-flow-line supply supply-air ${m ? "flow" : ""}"></path>
        <path d="M770 120 H728" class="internal-flow-line extract extract-air ${w ? "flow" : ""}"></path>
        <path d="M676 120 H532" class="internal-flow-line extract extract-air ${w ? "flow" : ""}"></path>
        <path d="M388 120 H294" class="internal-flow-line exhaust extract-air ${w ? "flow" : ""}"></path>
        <path d="M226 120 H150" class="internal-flow-line exhaust extract-air ${w ? "flow" : ""}"></path>

        ${this.renderFilter(220, 240)}
        ${this.renderFilter(702, 120)}
        ${this.renderHeatExchanger(460, 180, g, rt)}
        ${this.renderFan(260, 120, h, et, "extract")}
        ${this.renderFan(660, 240, d, tt, "supply")}
        ${this.renderHeaterCoil(734, 240, f)}

        <g class="badges">
          ${this.renderValueLabel(28, 64, s.label, s.value, "exhaust")}
          ${this.renderValueLabel(792, 64, i.label, i.value, "extract")}
          ${this.renderValueLabel(28, 258, e.label, e.value, "outdoor")}
          ${this.renderValueLabel(792, 258, a.label, a.value, "supply")}
          ${this.renderValueLabel(190, 38, n.label, n.value, "component")}
          ${this.renderValueLabel(610, 304, o.label, o.value, "component")}
          ${this.renderValueLabel(411, 274, l.label, l.value, "component")}
          ${this.renderValueLabel(714, 178, c.label, c.value, f > 0 ? "heater-active" : "neutral")}
        </g>
      </svg>
    `;
  }
  renderFan(r, t, e, a, i) {
    const s = e > 0;
    return A`
      <g class="fan-symbol ${i}" transform="translate(${r} ${t})" style="--fan-duration: ${a};">
        <circle class="fan-ring" r="30"></circle>
        <g class="fan-blades ${s ? "spin" : ""}">
          <path d="M0 -23 C11 -22 20 -15 20 -6 C20 -1 16 2 11 1 C5 0 2 -8 0 -23"></path>
          <path d="M23 0 C22 11 15 20 6 20 C1 20 -2 16 -1 11 C0 5 8 2 23 0"></path>
          <path d="M0 23 C-11 22 -20 15 -20 6 C-20 1 -16 -2 -11 -1 C-5 0 -2 8 0 23"></path>
          <path d="M-23 0 C-22 -11 -15 -20 -6 -20 C-1 -20 2 -16 1 -11 C0 -5 -8 -2 -23 0"></path>
          <circle class="fan-hub" r="7"></circle>
        </g>
      </g>
    `;
  }
  renderHeatExchanger(r, t, e, a) {
    const i = e > 0;
    return A`
      <g class="heat-exchanger" transform="translate(${r} ${t})" style="--rotor-duration: ${a};">
        <circle class="rotor-ring" r="72"></circle>
        <g class="rotor-motion ${i ? "spin" : ""}">
          <path class="rotor-arrow" d="M-47 -43 A64 64 0 0 1 47 -43"></path>
          <path class="rotor-arrow-head" d="M35 -48 L47 -43 L43 -55"></path>
          <path class="rotor-arrow" d="M47 43 A64 64 0 0 1 -47 43"></path>
          <path class="rotor-arrow-head" d="M-35 48 L-47 43 L-43 55"></path>
        </g>
        <g class="heat-waves">
          <path d="M-28 -48 C-14 -30 -42 -12 -28 8 C-14 28 -42 42 -28 54"></path>
          <path d="M0 -54 C15 -34 -15 -14 0 8 C15 30 -15 44 0 58"></path>
          <path d="M28 -48 C42 -30 14 -12 28 8 C42 28 14 42 28 54"></path>
        </g>
      </g>
    `;
  }
  renderHeaterCoil(r, t, e) {
    return A`
      <g class="heater-coil ${e > 0 ? "active" : ""}" transform="translate(${r} ${t})">
        <path class="heater-frame" d="M-18 -28 V28"></path>
        <path d="M-10 -20 H22"></path>
        <path d="M-10 -10 H22"></path>
        <path d="M-10 0 H22"></path>
        <path d="M-10 10 H22"></path>
        <path d="M-10 20 H22"></path>
        <path class="heater-bus" d="M22 -20 V20"></path>
      </g>
    `;
  }
  renderFilter(r, t) {
    return A`
      <g class="filter-symbol" transform="translate(${r} ${t})">
        <rect x="-18" y="-24" width="36" height="48" rx="4"></rect>
        <path d="M-11 -18 L11 18"></path>
        <path d="M-3 -18 L18 16"></path>
        <path d="M-18 -12 L3 22"></path>
      </g>
    `;
  }
  renderDamper(r, t) {
    return A`
      <g class="damper-symbol" transform="translate(${r} ${t})">
        <rect x="-19" y="-12" width="38" height="24" rx="3"></rect>
        <path d="M-13 8 L13 -8"></path>
        <circle r="2.5"></circle>
      </g>
    `;
  }
  renderValueLabel(r, t, e, a, i = "neutral") {
    return A`
      <g class="svg-badge ${i}" transform="translate(${r} ${t})">
        <rect width="98" height="34" rx="6"></rect>
        <text x="8" y="13" class="badge-label">${e}</text>
        <text x="8" y="27" class="badge-value">${a}</text>
      </g>
    `;
  }
  renderStatusItem(r, t) {
    const e = this.entityDisplay(r, t);
    return u`
      <div class="status-item ${e.tone ?? "normal"}">
        <span>${e.label}</span>
        <strong>${e.value}</strong>
      </div>
    `;
  }
  entityDisplay(r, t) {
    var o;
    const e = t[r], a = e ? (o = this.hass) == null ? void 0 : o.states[e] : void 0, i = this.formatEntityValue(a), s = this.entityTone(a);
    return {
      label: this.labelFor(r),
      value: i,
      tone: s
    };
  }
  labelFor(r) {
    var t, e;
    return ((e = (t = this.config) == null ? void 0 : t.labels) == null ? void 0 : e[r]) ?? Gt[r];
  }
  formatEntityValue(r) {
    if (!r || q.has(String(r.state).toLowerCase()))
      return "—";
    const t = r.attributes.unit_of_measurement;
    return t ? `${r.state} ${t}` : r.state;
  }
  entityTone(r) {
    if (!r || q.has(String(r.state).toLowerCase()))
      return "normal";
    const t = String(r.state).toLowerCase();
    return ["on", "problem", "detected", "active", "true"].includes(t) ? "danger" : ["warning", "pending"].includes(t) ? "warning" : "normal";
  }
  entityNumericValue(r) {
    var a;
    const t = r ? (a = this.hass) == null ? void 0 : a.states[r] : void 0;
    if (!t || q.has(String(t.state).toLowerCase()))
      return 0;
    const e = Number.parseFloat(String(t.state).replace(",", "."));
    return Number.isFinite(e) ? Math.max(0, e) : ["on", "running", "active", "true"].includes(String(t.state).toLowerCase()) ? 100 : 0;
  }
  getAnimationDurationFromValue(r, t, e) {
    if (r <= 0)
      return `${e.toFixed(1)}s`;
    const a = Math.min(Math.max(r, 1), 100);
    return `${(e - a / 100 * (e - t)).toFixed(1)}s`;
  }
};
D.styles = gt`
    :host {
      display: block;
      --vc-air-outdoor: #63b489;
      --vc-air-supply: #d99a45;
      --vc-air-extract: #e5aa6f;
      --vc-air-exhaust: #456f9f;
      --vc-component-line: var(--primary-text-color, #1f2937);
      --vc-component-muted: var(--secondary-text-color, #6b7280);
      --vc-component-surface: var(--ha-card-background, var(--card-background-color, #ffffff));
    }

    ha-card {
      overflow: hidden;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      color: var(--primary-text-color, #111);
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, none);
    }

    .card {
      padding: 12px;
    }

    .header {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 8px;
    }

    h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      line-height: 1.2;
    }

    .schematic {
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.24));
      border-radius: 10px;
      background: transparent;
      overflow: hidden;
    }

    svg {
      display: block;
      width: 100%;
      height: auto;
      max-height: 360px;
      color: var(--primary-text-color, #111);
    }

    .unit-shell {
      fill: var(--ha-card-background, var(--card-background-color, transparent));
      fill-opacity: 0.72;
      filter: url(#soft-shadow);
      stroke: var(--divider-color, rgba(127, 127, 127, 0.5));
      stroke-width: 1.5;
    }

    .unit-divider {
      stroke: var(--divider-color, rgba(127, 127, 127, 0.45));
      stroke-width: 1;
    }

    .unit-divider.muted {
      stroke-dasharray: 5 6;
      stroke-opacity: 0.55;
    }

    .duct-outline {
      fill: none;
      stroke: var(--divider-color, rgba(127, 127, 127, 0.28));
      stroke-width: 25;
      stroke-linecap: round;
      stroke-linejoin: round;
      opacity: 0.5;
    }

    .duct-fill {
      fill: none;
      stroke-width: 22;
      stroke-linecap: round;
      stroke-linejoin: round;
      opacity: 0.14;
    }

    .internal-duct-outline {
      fill: none;
      stroke: var(--divider-color, rgba(127, 127, 127, 0.26));
      stroke-width: 23;
      stroke-linecap: round;
      stroke-linejoin: round;
      opacity: 0.36;
    }

    .flow-line,
    .internal-flow-line {
      fill: none;
      stroke-width: 2.5;
      stroke-linecap: round;
      stroke-dasharray: 9 9;
      opacity: 0.92;
    }

    .internal-flow-line {
      stroke-width: 2.2;
      opacity: 0.78;
    }

    .duct-fill.outdoor,
    .flow-line.outdoor,
    .internal-flow-line.outdoor {
      stroke: var(--vc-air-outdoor);
    }

    .duct-fill.supply,
    .flow-line.supply,
    .internal-flow-line.supply {
      stroke: var(--vc-air-supply);
    }

    .duct-fill.extract,
    .flow-line.extract,
    .internal-flow-line.extract {
      stroke: var(--vc-air-extract);
    }

    .duct-fill.exhaust,
    .flow-line.exhaust,
    .internal-flow-line.exhaust {
      stroke: var(--vc-air-exhaust);
    }

    .flow {
      animation: airflow var(--airflow-duration, 2.8s) linear infinite;
    }

    .flow.supply-air {
      --airflow-duration: var(--supply-airflow-duration, 2.8s);
    }

    .flow.extract-air {
      --airflow-duration: var(--extract-airflow-duration, 2.8s);
    }

    .arrow-head {
      stroke: none;
    }

    .arrow-head.outdoor {
      fill: var(--vc-air-outdoor);
    }

    .arrow-head.supply {
      fill: var(--vc-air-supply);
    }

    .arrow-head.extract {
      fill: var(--vc-air-extract);
    }

    .arrow-head.exhaust {
      fill: var(--vc-air-exhaust);
    }

    .outer-arrow {
      stroke: none;
    }

    .outer-arrow.outdoor {
      fill: var(--vc-air-outdoor);
    }

    .outer-arrow.supply {
      fill: var(--vc-air-supply);
    }

    .outer-arrow.extract {
      fill: var(--vc-air-extract);
    }

    .outer-arrow.exhaust {
      fill: var(--vc-air-exhaust);
    }

    .fan-symbol,
    .heat-exchanger,
    .heater-coil,
    .filter-symbol,
    .damper-symbol {
      color: var(--vc-component-line);
      opacity: 1;
      pointer-events: none;
    }

    .fan-ring,
    .rotor-ring,
    .filter-symbol rect,
    .damper-symbol rect {
      fill: var(--vc-component-surface);
      fill-opacity: 0.88;
      stroke: var(--vc-component-line);
      stroke-opacity: 0.9;
      stroke-width: 2.6;
    }

    .fan-blades {
      transform-box: fill-box;
      transform-origin: center;
    }

    .fan-blades path {
      fill: var(--vc-component-line);
      opacity: 0.9;
    }

    .fan-hub {
      fill: var(--vc-component-surface);
      fill-opacity: 0.95;
      stroke: var(--vc-component-line);
      stroke-width: 2.2;
    }

    .spin {
      animation: symbol-spin var(--fan-duration, var(--rotor-duration, 4s)) linear infinite;
      transform-box: fill-box;
      transform-origin: center;
    }

    .fan-symbol.supply .spin {
      animation-duration: var(--supply-fan-duration, 4s);
    }

    .fan-symbol.extract .spin {
      animation-duration: var(--extract-fan-duration, 4s);
    }

    .heat-exchanger .spin {
      animation-duration: var(--rotor-duration, 8s);
    }

    .heat-exchanger {
      color: var(--vc-component-line);
    }

    .rotor-motion {
      transform-box: fill-box;
      transform-origin: center;
    }

    .rotor-arrow,
    .heat-waves path,
    .filter-symbol path,
    .damper-symbol path,
    .heater-coil path {
      fill: none;
      stroke: var(--vc-component-line);
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .rotor-arrow {
      stroke-width: 2.8;
      opacity: 0.9;
    }

    .rotor-arrow-head {
      fill: none;
      stroke: var(--vc-component-line);
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-width: 2.6;
      opacity: 0.9;
    }

    .heat-waves path {
      stroke-width: 2.5;
      opacity: 0.88;
    }

    .filter-symbol path {
      stroke-width: 2;
      opacity: 0.82;
    }

    .damper-symbol path {
      stroke-width: 2.4;
      opacity: 0.86;
    }

    .damper-symbol circle {
      fill: var(--vc-component-line);
      opacity: 0.9;
    }

    .heater-coil {
      color: var(--vc-component-line);
      opacity: 0.9;
    }

    .heater-coil.active {
      color: var(--vc-air-supply);
      opacity: 0.95;
    }

    .heater-coil path {
      stroke: var(--vc-component-line);
      stroke-width: 3;
    }

    .heater-coil.active path {
      stroke: var(--vc-air-supply);
    }

    .heater-frame,
    .heater-bus {
      stroke-width: 3.8;
    }

    .svg-badge rect {
      fill: var(--vc-value-box-background-color, var(--ha-card-background, var(--card-background-color, #ffffff)));
      fill-opacity: 0.92;
      stroke: var(--vc-value-box-border-color, var(--divider-color, rgba(127, 127, 127, 0.56)));
      stroke-width: 1.35;
    }

    .svg-badge.outdoor rect {
      stroke: var(--vc-air-outdoor);
    }

    .svg-badge.supply rect {
      stroke: var(--vc-air-supply);
    }

    .svg-badge.extract rect {
      stroke: var(--vc-air-extract);
    }

    .svg-badge.exhaust rect {
      stroke: var(--vc-air-exhaust);
    }

    .svg-badge.heater-active rect {
      stroke: var(--vc-air-supply);
    }

    .svg-badge.component rect {
      fill-opacity: 0.96;
      stroke: var(--primary-text-color, #1f2937);
      stroke-opacity: 0.42;
      stroke-width: 1.6;
    }

    .svg-badge text {
      fill: var(--vc-value-box-text-color, var(--primary-text-color, #111));
      dominant-baseline: middle;
    }

    .svg-badge .badge-label {
      fill: var(--secondary-text-color, #727272);
      font-size: 9.5px;
      font-weight: 500;
    }

    .svg-badge .badge-value {
      font-size: 12px;
      font-weight: 600;
    }

    .status-strip {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 8px;
      margin-top: 8px;
    }

    .status-item {
      min-width: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 7px 9px;
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.2));
      border-radius: 8px;
      background: transparent;
    }

    .status-item span,
    .status-item strong {
      overflow-wrap: anywhere;
    }

    .status-item span {
      color: var(--secondary-text-color, #727272);
      font-size: 12px;
      line-height: 1.2;
    }

    .status-item strong {
      color: var(--primary-text-color, #111);
      font-size: 13px;
      font-weight: 600;
      line-height: 1.25;
      text-align: right;
    }

    .status-item.warning strong {
      color: var(--warning-color, #f6a623);
    }

    .status-item.danger strong {
      color: var(--error-color, #db4437);
    }

    @keyframes airflow {
      to {
        stroke-dashoffset: -18;
      }
    }

    @keyframes symbol-spin {
      to {
        transform: rotate(360deg);
      }
    }

    @media (max-width: 520px) {
      .card {
        padding: 10px;
      }

      h2 {
        font-size: 18px;
      }

      .status-strip {
        grid-template-columns: 1fr;
      }

      .svg-badge .badge-value {
        font-size: 11px;
      }
    }
  `;
Q([
  K({ attribute: !1 })
], D.prototype, "hass", 2);
Q([
  wt()
], D.prototype, "config", 2);
D = Q([
  xt("ventilation-card")
], D);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "ventilation-card",
  name: "Ventilation Card",
  description: "Residential ventilation/AHU visualization card."
});
export {
  D as VentilationCard
};
