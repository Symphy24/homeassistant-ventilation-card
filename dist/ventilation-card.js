/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const D = globalThis, q = D.ShadowRoot && (D.ShadyCSS === void 0 || D.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Z = Symbol(), tt = /* @__PURE__ */ new WeakMap();
let pt = class {
  constructor(t, e, r) {
    if (this._$cssResult$ = !0, r !== Z) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (q && t === void 0) {
      const r = e !== void 0 && e.length === 1;
      r && (t = tt.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), r && tt.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const _t = (a) => new pt(typeof a == "string" ? a : a + "", void 0, Z), bt = (a, ...t) => {
  const e = a.length === 1 ? a[0] : t.reduce((r, s, i) => r + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + a[i + 1], a[0]);
  return new pt(e, a, Z);
}, xt = (a, t) => {
  if (q) a.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const r = document.createElement("style"), s = D.litNonce;
    s !== void 0 && r.setAttribute("nonce", s), r.textContent = e.cssText, a.appendChild(r);
  }
}, et = q ? (a) => a : (a) => a instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const r of t.cssRules) e += r.cssText;
  return _t(e);
})(a) : a;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: At, defineProperty: kt, getOwnPropertyDescriptor: Et, getOwnPropertyNames: St, getOwnPropertySymbols: Mt, getPrototypeOf: Ct } = Object, $ = globalThis, rt = $.trustedTypes, Ht = rt ? rt.emptyScript : "", z = $.reactiveElementPolyfillSupport, M = (a, t) => a, N = { toAttribute(a, t) {
  switch (t) {
    case Boolean:
      a = a ? Ht : null;
      break;
    case Object:
    case Array:
      a = a == null ? a : JSON.stringify(a);
  }
  return a;
}, fromAttribute(a, t) {
  let e = a;
  switch (t) {
    case Boolean:
      e = a !== null;
      break;
    case Number:
      e = a === null ? null : Number(a);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(a);
      } catch {
        e = null;
      }
  }
  return e;
} }, Y = (a, t) => !At(a, t), at = { attribute: !0, type: String, converter: N, reflect: !1, useDefault: !1, hasChanged: Y };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), $.litPropertyMetadata ?? ($.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let A = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = at) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const r = Symbol(), s = this.getPropertyDescriptor(t, r, e);
      s !== void 0 && kt(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, e, r) {
    const { get: s, set: i } = Et(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: s, set(o) {
      const l = s == null ? void 0 : s.call(this);
      i == null || i.call(this, o), this.requestUpdate(t, l, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? at;
  }
  static _$Ei() {
    if (this.hasOwnProperty(M("elementProperties"))) return;
    const t = Ct(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(M("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(M("properties"))) {
      const e = this.properties, r = [...St(e), ...Mt(e)];
      for (const s of r) this.createProperty(s, e[s]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [r, s] of e) this.elementProperties.set(r, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, r] of this.elementProperties) {
      const s = this._$Eu(e, r);
      s !== void 0 && this._$Eh.set(s, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const r = new Set(t.flat(1 / 0).reverse());
      for (const s of r) e.unshift(et(s));
    } else t !== void 0 && e.push(et(t));
    return e;
  }
  static _$Eu(t, e) {
    const r = e.attribute;
    return r === !1 ? void 0 : typeof r == "string" ? r : typeof t == "string" ? t.toLowerCase() : void 0;
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
    for (const r of e.keys()) this.hasOwnProperty(r) && (t.set(r, this[r]), delete this[r]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return xt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((e) => {
      var r;
      return (r = e.hostConnected) == null ? void 0 : r.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var r;
      return (r = e.hostDisconnected) == null ? void 0 : r.call(e);
    });
  }
  attributeChangedCallback(t, e, r) {
    this._$AK(t, r);
  }
  _$ET(t, e) {
    var i;
    const r = this.constructor.elementProperties.get(t), s = this.constructor._$Eu(t, r);
    if (s !== void 0 && r.reflect === !0) {
      const o = (((i = r.converter) == null ? void 0 : i.toAttribute) !== void 0 ? r.converter : N).toAttribute(e, r.type);
      this._$Em = t, o == null ? this.removeAttribute(s) : this.setAttribute(s, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var i, o;
    const r = this.constructor, s = r._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const l = r.getPropertyOptions(s), n = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((i = l.converter) == null ? void 0 : i.fromAttribute) !== void 0 ? l.converter : N;
      this._$Em = s;
      const c = n.fromAttribute(e, l.type);
      this[s] = c ?? ((o = this._$Ej) == null ? void 0 : o.get(s)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, e, r, s = !1, i) {
    var o;
    if (t !== void 0) {
      const l = this.constructor;
      if (s === !1 && (i = this[t]), r ?? (r = l.getPropertyOptions(t)), !((r.hasChanged ?? Y)(i, e) || r.useDefault && r.reflect && i === ((o = this._$Ej) == null ? void 0 : o.get(t)) && !this.hasAttribute(l._$Eu(t, r)))) return;
      this.C(t, e, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: r, reflect: s, wrapped: i }, o) {
    r && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), i !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || r || (e = void 0), this._$AL.set(t, e)), s === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
    var r;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [i, o] of this._$Ep) this[i] = o;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [i, o] of s) {
        const { wrapped: l } = o, n = this[i];
        l !== !0 || this._$AL.has(i) || n === void 0 || this.C(i, void 0, o, n);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (r = this._$EO) == null || r.forEach((s) => {
        var i;
        return (i = s.hostUpdate) == null ? void 0 : i.call(s);
      }), this.update(e)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((r) => {
      var s;
      return (s = r.hostUpdated) == null ? void 0 : s.call(r);
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
A.elementStyles = [], A.shadowRootOptions = { mode: "open" }, A[M("elementProperties")] = /* @__PURE__ */ new Map(), A[M("finalized")] = /* @__PURE__ */ new Map(), z == null || z({ ReactiveElement: A }), ($.reactiveElementVersions ?? ($.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const C = globalThis, st = (a) => a, V = C.trustedTypes, it = V ? V.createPolicy("lit-html", { createHTML: (a) => a }) : void 0, ut = "$lit$", v = `lit$${Math.random().toFixed(9).slice(2)}$`, ft = "?" + v, Pt = `<${ft}>`, _ = document, P = () => _.createComment(""), L = (a) => a === null || typeof a != "object" && typeof a != "function", X = Array.isArray, Lt = (a) => X(a) || typeof (a == null ? void 0 : a[Symbol.iterator]) == "function", j = `[ 	
\f\r]`, S = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ot = /-->/g, nt = />/g, g = RegExp(`>|${j}(?:([^\\s"'>=/]+)(${j}*=${j}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), lt = /'/g, ht = /"/g, mt = /^(?:script|style|textarea|title)$/i, vt = (a) => (t, ...e) => ({ _$litType$: a, strings: t, values: e }), F = vt(1), x = vt(2), k = Symbol.for("lit-noChange"), p = Symbol.for("lit-nothing"), ct = /* @__PURE__ */ new WeakMap(), y = _.createTreeWalker(_, 129);
function $t(a, t) {
  if (!X(a) || !a.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return it !== void 0 ? it.createHTML(t) : t;
}
const Ot = (a, t) => {
  const e = a.length - 1, r = [];
  let s, i = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = S;
  for (let l = 0; l < e; l++) {
    const n = a[l];
    let c, d, h = -1, u = 0;
    for (; u < n.length && (o.lastIndex = u, d = o.exec(n), d !== null); ) u = o.lastIndex, o === S ? d[1] === "!--" ? o = ot : d[1] !== void 0 ? o = nt : d[2] !== void 0 ? (mt.test(d[2]) && (s = RegExp("</" + d[2], "g")), o = g) : d[3] !== void 0 && (o = g) : o === g ? d[0] === ">" ? (o = s ?? S, h = -1) : d[1] === void 0 ? h = -2 : (h = o.lastIndex - d[2].length, c = d[1], o = d[3] === void 0 ? g : d[3] === '"' ? ht : lt) : o === ht || o === lt ? o = g : o === ot || o === nt ? o = S : (o = g, s = void 0);
    const m = o === g && a[l + 1].startsWith("/>") ? " " : "";
    i += o === S ? n + Pt : h >= 0 ? (r.push(c), n.slice(0, h) + ut + n.slice(h) + v + m) : n + v + (h === -2 ? l : m);
  }
  return [$t(a, i + (a[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
};
class O {
  constructor({ strings: t, _$litType$: e }, r) {
    let s;
    this.parts = [];
    let i = 0, o = 0;
    const l = t.length - 1, n = this.parts, [c, d] = Ot(t, e);
    if (this.el = O.createElement(c, r), y.currentNode = this.el.content, e === 2 || e === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (s = y.nextNode()) !== null && n.length < l; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const h of s.getAttributeNames()) if (h.endsWith(ut)) {
          const u = d[o++], m = s.getAttribute(h).split(v), f = /([.?@])?(.*)/.exec(u);
          n.push({ type: 1, index: i, name: f[2], strings: m, ctor: f[1] === "." ? Tt : f[1] === "?" ? Dt : f[1] === "@" ? Nt : R }), s.removeAttribute(h);
        } else h.startsWith(v) && (n.push({ type: 6, index: i }), s.removeAttribute(h));
        if (mt.test(s.tagName)) {
          const h = s.textContent.split(v), u = h.length - 1;
          if (u > 0) {
            s.textContent = V ? V.emptyScript : "";
            for (let m = 0; m < u; m++) s.append(h[m], P()), y.nextNode(), n.push({ type: 2, index: ++i });
            s.append(h[u], P());
          }
        }
      } else if (s.nodeType === 8) if (s.data === ft) n.push({ type: 2, index: i });
      else {
        let h = -1;
        for (; (h = s.data.indexOf(v, h + 1)) !== -1; ) n.push({ type: 7, index: i }), h += v.length - 1;
      }
      i++;
    }
  }
  static createElement(t, e) {
    const r = _.createElement("template");
    return r.innerHTML = t, r;
  }
}
function E(a, t, e = a, r) {
  var o, l;
  if (t === k) return t;
  let s = r !== void 0 ? (o = e._$Co) == null ? void 0 : o[r] : e._$Cl;
  const i = L(t) ? void 0 : t._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== i && ((l = s == null ? void 0 : s._$AO) == null || l.call(s, !1), i === void 0 ? s = void 0 : (s = new i(a), s._$AT(a, e, r)), r !== void 0 ? (e._$Co ?? (e._$Co = []))[r] = s : e._$Cl = s), s !== void 0 && (t = E(a, s._$AS(a, t.values), s, r)), t;
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
    const { el: { content: e }, parts: r } = this._$AD, s = ((t == null ? void 0 : t.creationScope) ?? _).importNode(e, !0);
    y.currentNode = s;
    let i = y.nextNode(), o = 0, l = 0, n = r[0];
    for (; n !== void 0; ) {
      if (o === n.index) {
        let c;
        n.type === 2 ? c = new T(i, i.nextSibling, this, t) : n.type === 1 ? c = new n.ctor(i, n.name, n.strings, this, t) : n.type === 6 && (c = new Vt(i, this, t)), this._$AV.push(c), n = r[++l];
      }
      o !== (n == null ? void 0 : n.index) && (i = y.nextNode(), o++);
    }
    return y.currentNode = _, s;
  }
  p(t) {
    let e = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(t, r, e), e += r.strings.length - 2) : r._$AI(t[e])), e++;
  }
}
class T {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, r, s) {
    this.type = 2, this._$AH = p, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = r, this.options = s, this._$Cv = (s == null ? void 0 : s.isConnected) ?? !0;
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
    t = E(this, t, e), L(t) ? t === p || t == null || t === "" ? (this._$AH !== p && this._$AR(), this._$AH = p) : t !== this._$AH && t !== k && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Lt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== p && L(this._$AH) ? this._$AA.nextSibling.data = t : this.T(_.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var i;
    const { values: e, _$litType$: r } = t, s = typeof r == "number" ? this._$AC(t) : (r.el === void 0 && (r.el = O.createElement($t(r.h, r.h[0]), this.options)), r);
    if (((i = this._$AH) == null ? void 0 : i._$AD) === s) this._$AH.p(e);
    else {
      const o = new Ut(s, this), l = o.u(this.options);
      o.p(e), this.T(l), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = ct.get(t.strings);
    return e === void 0 && ct.set(t.strings, e = new O(t)), e;
  }
  k(t) {
    X(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let r, s = 0;
    for (const i of t) s === e.length ? e.push(r = new T(this.O(P()), this.O(P()), this, this.options)) : r = e[s], r._$AI(i), s++;
    s < e.length && (this._$AR(r && r._$AB.nextSibling, s), e.length = s);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var r;
    for ((r = this._$AP) == null ? void 0 : r.call(this, !1, !0, e); t !== this._$AB; ) {
      const s = st(t).nextSibling;
      st(t).remove(), t = s;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class R {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, r, s, i) {
    this.type = 1, this._$AH = p, this._$AN = void 0, this.element = t, this.name = e, this._$AM = s, this.options = i, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = p;
  }
  _$AI(t, e = this, r, s) {
    const i = this.strings;
    let o = !1;
    if (i === void 0) t = E(this, t, e, 0), o = !L(t) || t !== this._$AH && t !== k, o && (this._$AH = t);
    else {
      const l = t;
      let n, c;
      for (t = i[0], n = 0; n < i.length - 1; n++) c = E(this, l[r + n], e, n), c === k && (c = this._$AH[n]), o || (o = !L(c) || c !== this._$AH[n]), c === p ? t = p : t !== p && (t += (c ?? "") + i[n + 1]), this._$AH[n] = c;
    }
    o && !s && this.j(t);
  }
  j(t) {
    t === p ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Tt extends R {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === p ? void 0 : t;
  }
}
class Dt extends R {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== p);
  }
}
class Nt extends R {
  constructor(t, e, r, s, i) {
    super(t, e, r, s, i), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = E(this, t, e, 0) ?? p) === k) return;
    const r = this._$AH, s = t === p && r !== p || t.capture !== r.capture || t.once !== r.once || t.passive !== r.passive, i = t !== p && (r === p || s);
    s && this.element.removeEventListener(this.name, this, r), i && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Vt {
  constructor(t, e, r) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    E(this, t);
  }
}
const I = C.litHtmlPolyfillSupport;
I == null || I(O, T), (C.litHtmlVersions ?? (C.litHtmlVersions = [])).push("3.3.3");
const Rt = (a, t, e) => {
  const r = (e == null ? void 0 : e.renderBefore) ?? t;
  let s = r._$litPart$;
  if (s === void 0) {
    const i = (e == null ? void 0 : e.renderBefore) ?? null;
    r._$litPart$ = s = new T(t.insertBefore(P(), i), i, void 0, e ?? {});
  }
  return s._$AI(a), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w = globalThis;
class H extends A {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Rt(e, this.renderRoot, this.renderOptions);
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
    return k;
  }
}
var dt;
H._$litElement$ = !0, H.finalized = !0, (dt = w.litElementHydrateSupport) == null || dt.call(w, { LitElement: H });
const B = w.litElementPolyfillSupport;
B == null || B({ LitElement: H });
(w.litElementVersions ?? (w.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const zt = (a) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(a, t);
  }) : customElements.define(a, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const jt = { attribute: !0, type: String, converter: N, reflect: !1, hasChanged: Y }, Ft = (a = jt, t, e) => {
  const { kind: r, metadata: s } = e;
  let i = globalThis.litPropertyMetadata.get(s);
  if (i === void 0 && globalThis.litPropertyMetadata.set(s, i = /* @__PURE__ */ new Map()), r === "setter" && ((a = Object.create(a)).wrapped = !0), i.set(e.name, a), r === "accessor") {
    const { name: o } = e;
    return { set(l) {
      const n = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(o, n, a, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(o, void 0, a, l), l;
    } };
  }
  if (r === "setter") {
    const { name: o } = e;
    return function(l) {
      const n = this[o];
      t.call(this, l), this.requestUpdate(o, n, a, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + r);
};
function gt(a) {
  return (t, e) => typeof e == "object" ? Ft(a, t, e) : ((r, s, i) => {
    const o = s.hasOwnProperty(i);
    return s.constructor.createProperty(i, r), o ? Object.getOwnPropertyDescriptor(s, i) : void 0;
  })(a, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function It(a) {
  return gt({ ...a, state: !0, attribute: !1 });
}
var Bt = Object.defineProperty, Wt = Object.getOwnPropertyDescriptor, J = (a, t, e, r) => {
  for (var s = r > 1 ? void 0 : r ? Wt(t, e) : t, i = a.length - 1, o; i >= 0; i--)
    (o = a[i]) && (s = (r ? o(t, e, s) : o(s)) || s);
  return r && s && Bt(t, e, s), s;
};
const W = /* @__PURE__ */ new Set(["unknown", "unavailable", "none", ""]), qt = {
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
let U = class extends H {
  setConfig(a) {
    if (!a)
      throw new Error("Invalid ventilation-card configuration");
    this.config = {
      name: "Ventilation",
      exchanger_type: "rotary",
      show_airflow: !0,
      entities: {},
      ...a
    };
  }
  getCardSize() {
    return 5;
  }
  render() {
    const a = this.config;
    if (!a)
      return p;
    const t = a.entities ?? {}, e = a.show_airflow !== !1;
    return F`
      <ha-card>
        <div class="card">
          <header class="header">
            <h2>${a.name ?? "Ventilation"}</h2>
          </header>

          <div class="schematic" aria-label="Ventilation unit schematic">
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
  renderSchematic(a, t) {
    const e = this.entityDisplay("outdoor_temp", a), r = this.entityDisplay("supply_temp", a), s = this.entityDisplay("extract_temp", a), i = this.entityDisplay("exhaust_temp", a), o = this.entityDisplay("supply_fan", a), l = this.entityDisplay("extract_fan", a), n = this.entityDisplay("heat_exchanger_speed", a), c = this.entityDisplay("heater_output", a), d = this.entityNumericValue(a.supply_fan), h = this.entityNumericValue(a.extract_fan), u = this.entityNumericValue(a.heater_output), m = this.entityNumericValue(a.heat_exchanger_speed), f = t && d > 0, b = t && h > 0, yt = this.getAnimationDurationFromValue(d, 0.8, 4.8), wt = this.getAnimationDurationFromValue(h, 0.8, 4.8), K = this.getAnimationDurationFromValue(d, 1.45, 4.2), G = this.getAnimationDurationFromValue(h, 1.45, 4.2), Q = this.getAnimationDurationFromValue(m, 3.2, 14);
    return F`
      <svg
        viewBox="0 0 920 360"
        role="img"
        style="--supply-fan-duration: ${K}; --extract-fan-duration: ${G}; --rotor-duration: ${Q}; --supply-airflow-duration: ${yt}; --extract-airflow-duration: ${wt};"
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
        <path d="M886 120 H794" class="flow-line extract extract-air ${b ? "flow" : ""}"></path>
        <path d="M140 120 H20" class="duct-fill exhaust"></path>
        <path d="M126 120 H34" class="flow-line exhaust extract-air ${b ? "flow" : ""}"></path>
        <path d="M20 240 H140" class="duct-fill outdoor"></path>
        <path d="M34 240 H126" class="flow-line outdoor supply-air ${f ? "flow" : ""}"></path>
        <path d="M780 240 H900" class="duct-fill supply"></path>
        <path d="M794 240 H886" class="flow-line supply supply-air ${f ? "flow" : ""}"></path>

        <path d="M28 120 L40 113 L40 127 Z" class="outer-arrow exhaust"></path>
        <path d="M876 120 L888 113 L888 127 Z" class="outer-arrow extract"></path>
        <path d="M42 240 L30 233 L30 247 Z" class="outer-arrow outdoor"></path>
        <path d="M892 240 L880 233 L880 247 Z" class="outer-arrow supply"></path>

        <path d="M150 240 H194" class="internal-flow-line outdoor supply-air ${f ? "flow" : ""}"></path>
        <path d="M246 240 H388" class="internal-flow-line outdoor supply-air ${f ? "flow" : ""}"></path>
        <path d="M532 240 H624" class="internal-flow-line supply supply-air ${f ? "flow" : ""}"></path>
        <path d="M696 240 H712" class="internal-flow-line supply supply-air ${f ? "flow" : ""}"></path>
        <path d="M756 240 H770" class="internal-flow-line supply supply-air ${f ? "flow" : ""}"></path>
        <path d="M770 120 H728" class="internal-flow-line extract extract-air ${b ? "flow" : ""}"></path>
        <path d="M676 120 H532" class="internal-flow-line extract extract-air ${b ? "flow" : ""}"></path>
        <path d="M388 120 H294" class="internal-flow-line exhaust extract-air ${b ? "flow" : ""}"></path>
        <path d="M226 120 H150" class="internal-flow-line exhaust extract-air ${b ? "flow" : ""}"></path>

        ${this.renderFilter(220, 240)}
        ${this.renderFilter(702, 120)}
        ${this.renderHeatExchanger(460, 180, m, Q)}
        ${this.renderFan(260, 120, h, G, "extract")}
        ${this.renderFan(660, 240, d, K, "supply")}
        ${this.renderHeaterCoil(734, 240, u)}

        <g class="badges">
          ${this.renderValueLabel(28, 64, i.label, i.value, "exhaust")}
          ${this.renderValueLabel(792, 64, s.label, s.value, "extract")}
          ${this.renderValueLabel(28, 258, e.label, e.value, "outdoor")}
          ${this.renderValueLabel(792, 258, r.label, r.value, "supply")}
          ${this.renderValueLabel(190, 38, l.label, l.value, "component")}
          ${this.renderValueLabel(610, 304, o.label, o.value, "component")}
          ${this.renderValueLabel(411, 274, n.label, n.value, "component")}
          ${this.renderValueLabel(714, 178, c.label, c.value, u > 0 ? "heater-active" : "neutral")}
        </g>
      </svg>
    `;
  }
  renderFan(a, t, e, r, s) {
    const i = e > 0;
    return x`
      <g class="fan-symbol ${s}" transform="translate(${a} ${t})" style="--fan-duration: ${r};">
        <circle class="fan-ring" r="30"></circle>
        <g class="fan-blades ${i ? "spin" : ""}">
          <path d="M0 -23 C11 -22 20 -15 20 -6 C20 -1 16 2 11 1 C5 0 2 -8 0 -23"></path>
          <path d="M23 0 C22 11 15 20 6 20 C1 20 -2 16 -1 11 C0 5 8 2 23 0"></path>
          <path d="M0 23 C-11 22 -20 15 -20 6 C-20 1 -16 -2 -11 -1 C-5 0 -2 8 0 23"></path>
          <path d="M-23 0 C-22 -11 -15 -20 -6 -20 C-1 -20 2 -16 1 -11 C0 -5 -8 -2 -23 0"></path>
          <circle class="fan-hub" r="7"></circle>
        </g>
      </g>
    `;
  }
  renderHeatExchanger(a, t, e, r) {
    const s = e > 0;
    return x`
      <g class="heat-exchanger" transform="translate(${a} ${t})" style="--rotor-duration: ${r};">
        <circle class="rotor-ring" r="72"></circle>
        <g class="rotor-motion ${s ? "spin" : ""}">
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
  renderHeaterCoil(a, t, e) {
    return x`
      <g class="heater-coil ${e > 0 ? "active" : ""}" transform="translate(${a} ${t})">
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
  renderFilter(a, t) {
    return x`
      <g class="filter-symbol" transform="translate(${a} ${t})">
        <rect x="-18" y="-24" width="36" height="48" rx="4"></rect>
        <path d="M-11 -18 L11 18"></path>
        <path d="M-3 -18 L18 16"></path>
        <path d="M-18 -12 L3 22"></path>
      </g>
    `;
  }
  renderDamper(a, t) {
    return x`
      <g class="damper-symbol" transform="translate(${a} ${t})">
        <rect x="-19" y="-12" width="38" height="24" rx="3"></rect>
        <path d="M-13 8 L13 -8"></path>
        <circle r="2.5"></circle>
      </g>
    `;
  }
  renderValueLabel(a, t, e, r, s = "neutral") {
    return x`
      <g class="svg-badge ${s}" transform="translate(${a} ${t})">
        <rect width="98" height="34" rx="6"></rect>
        <text x="8" y="13" class="badge-label">${e}</text>
        <text x="8" y="27" class="badge-value">${r}</text>
      </g>
    `;
  }
  renderStatusItem(a, t) {
    const e = this.entityDisplay(a, t);
    return F`
      <div class="status-item ${e.tone ?? "normal"}">
        <span>${e.label}</span>
        <strong>${e.value}</strong>
      </div>
    `;
  }
  entityDisplay(a, t) {
    var o;
    const e = t[a], r = e ? (o = this.hass) == null ? void 0 : o.states[e] : void 0, s = this.formatEntityValue(r), i = this.entityTone(r);
    return {
      label: this.labelFor(a),
      value: s,
      tone: i
    };
  }
  labelFor(a) {
    var t, e;
    return ((e = (t = this.config) == null ? void 0 : t.labels) == null ? void 0 : e[a]) ?? qt[a];
  }
  formatEntityValue(a) {
    if (!a || W.has(String(a.state).toLowerCase()))
      return "—";
    const t = a.attributes.unit_of_measurement;
    return t ? `${a.state} ${t}` : a.state;
  }
  entityTone(a) {
    if (!a || W.has(String(a.state).toLowerCase()))
      return "normal";
    const t = String(a.state).toLowerCase();
    return ["on", "problem", "detected", "active", "true"].includes(t) ? "danger" : ["warning", "pending"].includes(t) ? "warning" : "normal";
  }
  entityNumericValue(a) {
    var r;
    const t = a ? (r = this.hass) == null ? void 0 : r.states[a] : void 0;
    if (!t || W.has(String(t.state).toLowerCase()))
      return 0;
    const e = Number.parseFloat(String(t.state).replace(",", "."));
    return Number.isFinite(e) ? Math.max(0, e) : ["on", "running", "active", "true"].includes(String(t.state).toLowerCase()) ? 100 : 0;
  }
  getAnimationDurationFromValue(a, t, e) {
    if (a <= 0)
      return `${e.toFixed(1)}s`;
    const r = Math.min(Math.max(a, 1), 100);
    return `${(e - r / 100 * (e - t)).toFixed(1)}s`;
  }
};
U.styles = bt`
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
      fill: var(--ha-card-background, var(--card-background-color, #ffffff));
      fill-opacity: 0.92;
      stroke: var(--divider-color, rgba(127, 127, 127, 0.56));
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
      fill: var(--primary-text-color, #111);
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
J([
  gt({ attribute: !1 })
], U.prototype, "hass", 2);
J([
  It()
], U.prototype, "config", 2);
U = J([
  zt("ventilation-card")
], U);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "ventilation-card",
  name: "Ventilation Card",
  description: "Residential ventilation/AHU visualization card."
});
export {
  U as VentilationCard
};
