/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const U = globalThis, K = U.ShadowRoot && (U.ShadyCSS === void 0 || U.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, J = Symbol(), ht = /* @__PURE__ */ new WeakMap();
let kt = class {
  constructor(t, e, r) {
    if (this._$cssResult$ = !0, r !== J) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (K && t === void 0) {
      const r = e !== void 0 && e.length === 1;
      r && (t = ht.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), r && ht.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Ut = (i) => new kt(typeof i == "string" ? i : i + "", void 0, J), Ct = (i, ...t) => {
  const e = i.length === 1 ? i[0] : t.reduce((r, a, s) => r + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(a) + i[s + 1], i[0]);
  return new kt(e, i, J);
}, Rt = (i, t) => {
  if (K) i.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const r = document.createElement("style"), a = U.litNonce;
    a !== void 0 && r.setAttribute("nonce", a), r.textContent = e.cssText, i.appendChild(r);
  }
}, pt = K ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const r of t.cssRules) e += r.cssText;
  return Ut(e);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: It, defineProperty: Bt, getOwnPropertyDescriptor: Wt, getOwnPropertyNames: Gt, getOwnPropertySymbols: Zt, getPrototypeOf: qt } = Object, v = globalThis, ut = v.trustedTypes, Xt = ut ? ut.emptyScript : "", W = v.reactiveElementPolyfillSupport, O = (i, t) => i, R = { toAttribute(i, t) {
  switch (t) {
    case Boolean:
      i = i ? Xt : null;
      break;
    case Object:
    case Array:
      i = i == null ? i : JSON.stringify(i);
  }
  return i;
}, fromAttribute(i, t) {
  let e = i;
  switch (t) {
    case Boolean:
      e = i !== null;
      break;
    case Number:
      e = i === null ? null : Number(i);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(i);
      } catch {
        e = null;
      }
  }
  return e;
} }, Q = (i, t) => !It(i, t), ft = { attribute: !0, type: String, converter: R, reflect: !1, useDefault: !1, hasChanged: Q };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), v.litPropertyMetadata ?? (v.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let E = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = ft) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const r = Symbol(), a = this.getPropertyDescriptor(t, r, e);
      a !== void 0 && Bt(this.prototype, t, a);
    }
  }
  static getPropertyDescriptor(t, e, r) {
    const { get: a, set: s } = Wt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: a, set(o) {
      const l = a == null ? void 0 : a.call(this);
      s == null || s.call(this, o), this.requestUpdate(t, l, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? ft;
  }
  static _$Ei() {
    if (this.hasOwnProperty(O("elementProperties"))) return;
    const t = qt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(O("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(O("properties"))) {
      const e = this.properties, r = [...Gt(e), ...Zt(e)];
      for (const a of r) this.createProperty(a, e[a]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [r, a] of e) this.elementProperties.set(r, a);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, r] of this.elementProperties) {
      const a = this._$Eu(e, r);
      a !== void 0 && this._$Eh.set(a, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const r = new Set(t.flat(1 / 0).reverse());
      for (const a of r) e.unshift(pt(a));
    } else t !== void 0 && e.push(pt(t));
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
    return Rt(t, this.constructor.elementStyles), t;
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
    var s;
    const r = this.constructor.elementProperties.get(t), a = this.constructor._$Eu(t, r);
    if (a !== void 0 && r.reflect === !0) {
      const o = (((s = r.converter) == null ? void 0 : s.toAttribute) !== void 0 ? r.converter : R).toAttribute(e, r.type);
      this._$Em = t, o == null ? this.removeAttribute(a) : this.setAttribute(a, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var s, o;
    const r = this.constructor, a = r._$Eh.get(t);
    if (a !== void 0 && this._$Em !== a) {
      const l = r.getPropertyOptions(a), n = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((s = l.converter) == null ? void 0 : s.fromAttribute) !== void 0 ? l.converter : R;
      this._$Em = a;
      const d = n.fromAttribute(e, l.type);
      this[a] = d ?? ((o = this._$Ej) == null ? void 0 : o.get(a)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, e, r, a = !1, s) {
    var o;
    if (t !== void 0) {
      const l = this.constructor;
      if (a === !1 && (s = this[t]), r ?? (r = l.getPropertyOptions(t)), !((r.hasChanged ?? Q)(s, e) || r.useDefault && r.reflect && s === ((o = this._$Ej) == null ? void 0 : o.get(t)) && !this.hasAttribute(l._$Eu(t, r)))) return;
      this.C(t, e, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: r, reflect: a, wrapped: s }, o) {
    r && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), s !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || r || (e = void 0), this._$AL.set(t, e)), a === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
        for (const [s, o] of this._$Ep) this[s] = o;
        this._$Ep = void 0;
      }
      const a = this.constructor.elementProperties;
      if (a.size > 0) for (const [s, o] of a) {
        const { wrapped: l } = o, n = this[s];
        l !== !0 || this._$AL.has(s) || n === void 0 || this.C(s, void 0, o, n);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (r = this._$EO) == null || r.forEach((a) => {
        var s;
        return (s = a.hostUpdate) == null ? void 0 : s.call(a);
      }), this.update(e)) : this._$EM();
    } catch (a) {
      throw t = !1, this._$EM(), a;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((r) => {
      var a;
      return (a = r.hostUpdated) == null ? void 0 : a.call(r);
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
E.elementStyles = [], E.shadowRootOptions = { mode: "open" }, E[O("elementProperties")] = /* @__PURE__ */ new Map(), E[O("finalized")] = /* @__PURE__ */ new Map(), W == null || W({ ReactiveElement: E }), (v.reactiveElementVersions ?? (v.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const F = globalThis, mt = (i) => i, I = F.trustedTypes, gt = I ? I.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, Mt = "$lit$", b = `lit$${Math.random().toFixed(9).slice(2)}$`, Lt = "?" + b, Yt = `<${Lt}>`, A = document, z = () => A.createComment(""), V = (i) => i === null || typeof i != "object" && typeof i != "function", tt = Array.isArray, Kt = (i) => tt(i) || typeof (i == null ? void 0 : i[Symbol.iterator]) == "function", G = `[ 	
\f\r]`, H = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, bt = /-->/g, vt = />/g, x = RegExp(`>|${G}(?:([^\\s"'>=/]+)(${G}*=${G}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), yt = /'/g, xt = /"/g, Nt = /^(?:script|style|textarea|title)$/i, Ht = (i) => (t, ...e) => ({ _$litType$: i, strings: t, values: e }), u = Ht(1), _ = Ht(2), C = Symbol.for("lit-noChange"), c = Symbol.for("lit-nothing"), _t = /* @__PURE__ */ new WeakMap(), $ = A.createTreeWalker(A, 129);
function Ot(i, t) {
  if (!tt(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return gt !== void 0 ? gt.createHTML(t) : t;
}
const Jt = (i, t) => {
  const e = i.length - 1, r = [];
  let a, s = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = H;
  for (let l = 0; l < e; l++) {
    const n = i[l];
    let d, p, h = -1, m = 0;
    for (; m < n.length && (o.lastIndex = m, p = o.exec(n), p !== null); ) m = o.lastIndex, o === H ? p[1] === "!--" ? o = bt : p[1] !== void 0 ? o = vt : p[2] !== void 0 ? (Nt.test(p[2]) && (a = RegExp("</" + p[2], "g")), o = x) : p[3] !== void 0 && (o = x) : o === x ? p[0] === ">" ? (o = a ?? H, h = -1) : p[1] === void 0 ? h = -2 : (h = o.lastIndex - p[2].length, d = p[1], o = p[3] === void 0 ? x : p[3] === '"' ? xt : yt) : o === xt || o === yt ? o = x : o === bt || o === vt ? o = H : (o = x, a = void 0);
    const f = o === x && i[l + 1].startsWith("/>") ? " " : "";
    s += o === H ? n + Yt : h >= 0 ? (r.push(d), n.slice(0, h) + Mt + n.slice(h) + b + f) : n + b + (h === -2 ? l : f);
  }
  return [Ot(i, s + (i[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
};
class P {
  constructor({ strings: t, _$litType$: e }, r) {
    let a;
    this.parts = [];
    let s = 0, o = 0;
    const l = t.length - 1, n = this.parts, [d, p] = Jt(t, e);
    if (this.el = P.createElement(d, r), $.currentNode = this.el.content, e === 2 || e === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (a = $.nextNode()) !== null && n.length < l; ) {
      if (a.nodeType === 1) {
        if (a.hasAttributes()) for (const h of a.getAttributeNames()) if (h.endsWith(Mt)) {
          const m = p[o++], f = a.getAttribute(h).split(b), g = /([.?@])?(.*)/.exec(m);
          n.push({ type: 1, index: s, name: g[2], strings: f, ctor: g[1] === "." ? te : g[1] === "?" ? ee : g[1] === "@" ? ie : B }), a.removeAttribute(h);
        } else h.startsWith(b) && (n.push({ type: 6, index: s }), a.removeAttribute(h));
        if (Nt.test(a.tagName)) {
          const h = a.textContent.split(b), m = h.length - 1;
          if (m > 0) {
            a.textContent = I ? I.emptyScript : "";
            for (let f = 0; f < m; f++) a.append(h[f], z()), $.nextNode(), n.push({ type: 2, index: ++s });
            a.append(h[m], z());
          }
        }
      } else if (a.nodeType === 8) if (a.data === Lt) n.push({ type: 2, index: s });
      else {
        let h = -1;
        for (; (h = a.data.indexOf(b, h + 1)) !== -1; ) n.push({ type: 7, index: s }), h += b.length - 1;
      }
      s++;
    }
  }
  static createElement(t, e) {
    const r = A.createElement("template");
    return r.innerHTML = t, r;
  }
}
function M(i, t, e = i, r) {
  var o, l;
  if (t === C) return t;
  let a = r !== void 0 ? (o = e._$Co) == null ? void 0 : o[r] : e._$Cl;
  const s = V(t) ? void 0 : t._$litDirective$;
  return (a == null ? void 0 : a.constructor) !== s && ((l = a == null ? void 0 : a._$AO) == null || l.call(a, !1), s === void 0 ? a = void 0 : (a = new s(i), a._$AT(i, e, r)), r !== void 0 ? (e._$Co ?? (e._$Co = []))[r] = a : e._$Cl = a), a !== void 0 && (t = M(i, a._$AS(i, t.values), a, r)), t;
}
class Qt {
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
    const { el: { content: e }, parts: r } = this._$AD, a = ((t == null ? void 0 : t.creationScope) ?? A).importNode(e, !0);
    $.currentNode = a;
    let s = $.nextNode(), o = 0, l = 0, n = r[0];
    for (; n !== void 0; ) {
      if (o === n.index) {
        let d;
        n.type === 2 ? d = new j(s, s.nextSibling, this, t) : n.type === 1 ? d = new n.ctor(s, n.name, n.strings, this, t) : n.type === 6 && (d = new re(s, this, t)), this._$AV.push(d), n = r[++l];
      }
      o !== (n == null ? void 0 : n.index) && (s = $.nextNode(), o++);
    }
    return $.currentNode = A, a;
  }
  p(t) {
    let e = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(t, r, e), e += r.strings.length - 2) : r._$AI(t[e])), e++;
  }
}
class j {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, r, a) {
    this.type = 2, this._$AH = c, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = r, this.options = a, this._$Cv = (a == null ? void 0 : a.isConnected) ?? !0;
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
    t = M(this, t, e), V(t) ? t === c || t == null || t === "" ? (this._$AH !== c && this._$AR(), this._$AH = c) : t !== this._$AH && t !== C && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Kt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== c && V(this._$AH) ? this._$AA.nextSibling.data = t : this.T(A.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var s;
    const { values: e, _$litType$: r } = t, a = typeof r == "number" ? this._$AC(t) : (r.el === void 0 && (r.el = P.createElement(Ot(r.h, r.h[0]), this.options)), r);
    if (((s = this._$AH) == null ? void 0 : s._$AD) === a) this._$AH.p(e);
    else {
      const o = new Qt(a, this), l = o.u(this.options);
      o.p(e), this.T(l), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = _t.get(t.strings);
    return e === void 0 && _t.set(t.strings, e = new P(t)), e;
  }
  k(t) {
    tt(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let r, a = 0;
    for (const s of t) a === e.length ? e.push(r = new j(this.O(z()), this.O(z()), this, this.options)) : r = e[a], r._$AI(s), a++;
    a < e.length && (this._$AR(r && r._$AB.nextSibling, a), e.length = a);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var r;
    for ((r = this._$AP) == null ? void 0 : r.call(this, !1, !0, e); t !== this._$AB; ) {
      const a = mt(t).nextSibling;
      mt(t).remove(), t = a;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class B {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, r, a, s) {
    this.type = 1, this._$AH = c, this._$AN = void 0, this.element = t, this.name = e, this._$AM = a, this.options = s, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = c;
  }
  _$AI(t, e = this, r, a) {
    const s = this.strings;
    let o = !1;
    if (s === void 0) t = M(this, t, e, 0), o = !V(t) || t !== this._$AH && t !== C, o && (this._$AH = t);
    else {
      const l = t;
      let n, d;
      for (t = s[0], n = 0; n < s.length - 1; n++) d = M(this, l[r + n], e, n), d === C && (d = this._$AH[n]), o || (o = !V(d) || d !== this._$AH[n]), d === c ? t = c : t !== c && (t += (d ?? "") + s[n + 1]), this._$AH[n] = d;
    }
    o && !a && this.j(t);
  }
  j(t) {
    t === c ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class te extends B {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === c ? void 0 : t;
  }
}
class ee extends B {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== c);
  }
}
class ie extends B {
  constructor(t, e, r, a, s) {
    super(t, e, r, a, s), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = M(this, t, e, 0) ?? c) === C) return;
    const r = this._$AH, a = t === c && r !== c || t.capture !== r.capture || t.once !== r.once || t.passive !== r.passive, s = t !== c && (r === c || a);
    a && this.element.removeEventListener(this.name, this, r), s && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class re {
  constructor(t, e, r) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    M(this, t);
  }
}
const Z = F.litHtmlPolyfillSupport;
Z == null || Z(P, j), (F.litHtmlVersions ?? (F.litHtmlVersions = [])).push("3.3.3");
const ae = (i, t, e) => {
  const r = (e == null ? void 0 : e.renderBefore) ?? t;
  let a = r._$litPart$;
  if (a === void 0) {
    const s = (e == null ? void 0 : e.renderBefore) ?? null;
    r._$litPart$ = a = new j(t.insertBefore(z(), s), s, void 0, e ?? {});
  }
  return a._$AI(i), a;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w = globalThis;
class k extends E {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = ae(e, this.renderRoot, this.renderOptions);
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
    return C;
  }
}
var Et;
k._$litElement$ = !0, k.finalized = !0, (Et = w.litElementHydrateSupport) == null || Et.call(w, { LitElement: k });
const q = w.litElementPolyfillSupport;
q == null || q({ LitElement: k });
(w.litElementVersions ?? (w.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ft = (i) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(i, t);
  }) : customElements.define(i, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const se = { attribute: !0, type: String, converter: R, reflect: !1, hasChanged: Q }, oe = (i = se, t, e) => {
  const { kind: r, metadata: a } = e;
  let s = globalThis.litPropertyMetadata.get(a);
  if (s === void 0 && globalThis.litPropertyMetadata.set(a, s = /* @__PURE__ */ new Map()), r === "setter" && ((i = Object.create(i)).wrapped = !0), s.set(e.name, i), r === "accessor") {
    const { name: o } = e;
    return { set(l) {
      const n = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(o, n, i, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(o, void 0, i, l), l;
    } };
  }
  if (r === "setter") {
    const { name: o } = e;
    return function(l) {
      const n = this[o];
      t.call(this, l), this.requestUpdate(o, n, i, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + r);
};
function et(i) {
  return (t, e) => typeof e == "object" ? oe(i, t, e) : ((r, a, s) => {
    const o = a.hasOwnProperty(s);
    return a.constructor.createProperty(s, r), o ? Object.getOwnPropertyDescriptor(a, s) : void 0;
  })(i, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function zt(i) {
  return et({ ...i, state: !0, attribute: !1 });
}
var ne = Object.defineProperty, le = Object.getOwnPropertyDescriptor, it = (i, t, e, r) => {
  for (var a = r > 1 ? void 0 : r ? le(t, e) : t, s = i.length - 1, o; s >= 0; s--)
    (o = i[s]) && (a = (r ? o(t, e, a) : o(a)) || a);
  return r && a && ne(t, e, a), a;
};
const ce = [
  { key: "outdoor_temp", title: "Outdoor air temperature", defaultLabel: "Outdoor air temperature" },
  { key: "supply_temp", title: "Supply air temperature", defaultLabel: "Supply air temperature" },
  { key: "extract_temp", title: "Extract air temperature", defaultLabel: "Extract air temperature" },
  { key: "exhaust_temp", title: "Exhaust air temperature", defaultLabel: "Exhaust air temperature" },
  { key: "supply_fan", title: "Supply fan", defaultLabel: "Supply fan" },
  { key: "extract_fan", title: "Extract fan", defaultLabel: "Extract fan" },
  { key: "heat_exchanger_speed", title: "Heat exchanger", defaultLabel: "Heat exchanger" },
  { key: "heater_output", title: "Heater output", defaultLabel: "Heater output" },
  { key: "mode", title: "Mode", defaultLabel: "Mode" },
  { key: "filter_alarm", title: "Filter alarm", defaultLabel: "Filter alarm" },
  { key: "alarm", title: "Alarm", defaultLabel: "Alarm" }
], de = [
  { key: "outdoor_air", label: "Outdoor air color", fallback: "#63b489" },
  { key: "supply_air", label: "Supply air color", fallback: "#d99a45" },
  { key: "extract_air", label: "Extract air color", fallback: "#e5aa6f" },
  { key: "exhaust_air", label: "Exhaust air color", fallback: "#456f9f" }
], $t = [
  { value: "rotary", label: "Rotary" },
  { value: "crossflow", label: "Crossflow" },
  { value: "none", label: "None" }
], he = /* @__PURE__ */ new Set([
  "outdoor_temp",
  "supply_temp",
  "extract_temp",
  "exhaust_temp",
  "supply_fan",
  "extract_fan",
  "heat_exchanger_speed",
  "heater_output"
]);
let T = class extends k {
  constructor() {
    super(...arguments), this.config = { type: "custom:ventilation-card" };
  }
  connectedCallback() {
    super.connectedCallback(), this.loadHomeAssistantElements();
  }
  setConfig(i) {
    this.config = {
      ...i,
      type: i.type || "custom:ventilation-card",
      exchanger_type: i.exchanger_type ?? "rotary"
    };
  }
  render() {
    return this.hass ? u`
      <div class="editor">
        ${this.renderGeneralSection()}
        ${this.renderComponentsSection()}
        ${this.renderAirflowColorsSection()}
      </div>
    ` : c;
  }
  async loadHomeAssistantElements() {
    var t;
    if (customElements.get("ha-entity-picker"))
      return;
    const i = customElements.get("hui-entities-card");
    try {
      await ((t = i == null ? void 0 : i.getConfigElement) == null ? void 0 : t.call(i));
    } catch (e) {
      console.warn("Unable to preload ha-entity-picker", e);
    }
  }
  renderGeneralSection() {
    return this.renderSection(
      "General",
      u`
        ${this.renderTextField("Name", this.config.name ?? "", (i) => this.updateRoot("name", i))}
        <ha-select
          name="exchanger_type"
          label="Exchanger type"
          .value=${this.config.exchanger_type ?? "rotary"}
          .options=${$t}
          @selected=${(i) => this.updateExchangerType(this.eventValue(i))}
          @change=${(i) => this.updateExchangerType(this.eventValue(i))}
        >
          ${$t.map((i) => u`<mwc-list-item .value=${i.value}>${i.label}</mwc-list-item>`)}
        </ha-select>
      `,
      !0
    );
  }
  renderAirflowColorsSection() {
    return this.renderSection(
      "Airflow colors",
      u`
        ${de.map(
        (i) => {
          var t;
          return this.renderColorField(
            i.label,
            ((t = this.config.colors) == null ? void 0 : t[i.key]) ?? "",
            i.fallback,
            (e) => this.updateNestedString("colors", i.key, e)
          );
        }
      )}
      `
    );
  }
  renderComponentsSection() {
    return this.renderSection(
      "Sensors and components",
      u`${ce.map((i) => this.renderComponentPanel(i))}`
    );
  }
  renderComponentPanel(i) {
    var e, r, a, s;
    const t = (e = this.config.value_boxes) == null ? void 0 : e[i.key];
    return u`
      <details class="component-panel">
        <summary>
          <span>${i.title}</span>
          <small>${((r = this.config.entities) == null ? void 0 : r[i.key]) || "No entity"}</small>
        </summary>
        <div class="panel-fields">
          ${this.renderSwitchField("Show", ((a = this.config.visibility) == null ? void 0 : a[i.key]) !== !1, (o) => this.updateNestedBoolean("visibility", i.key, o))}
          <ha-entity-picker
            .hass=${this.hass}
            .value=${((s = this.config.entities) == null ? void 0 : s[i.key]) ?? ""}
            .label=${"Entity"}
            allow-custom-entity
            ?allow-custom-entity=${!0}
            @value-changed=${(o) => {
      o.stopPropagation(), this.updateNestedString("entities", i.key, o.detail.value ?? "");
    }}
          ></ha-entity-picker>
          ${this.renderLabelField(i.key, i.defaultLabel)}
          ${this.renderColorField(
      "Value box border color",
      (t == null ? void 0 : t.border_color) ?? "",
      "#9e9e9e",
      (o) => this.updateValueBox(i.key, "border_color", o)
    )}
          ${this.renderNumberField("Font size", t == null ? void 0 : t.font_size, (o) => this.updateValueBox(i.key, "font_size", o))}
          ${he.has(i.key) ? this.renderFormatFields(i.key) : c}
          ${this.renderComponentAnimationFields(i.key)}
        </div>
      </details>
    `;
  }
  renderComponentAnimationFields(i) {
    var s, o, l, n, d;
    if (i !== "supply_fan" && i !== "extract_fan" && i !== "heat_exchanger_speed")
      return c;
    const t = (s = this.config.component_settings) == null ? void 0 : s[i], e = i === "heat_exchanger_speed" ? ((o = this.config.animations) == null ? void 0 : o.rotor_enabled) !== !1 : ((l = this.config.animations) == null ? void 0 : l.fans_enabled) !== !1, r = i === "heat_exchanger_speed" ? (n = this.config.animations) == null ? void 0 : n.rotor_max_speed : (d = this.config.animations) == null ? void 0 : d.fan_max_speed, a = (t == null ? void 0 : t.animation_max_speed) ?? (t == null ? void 0 : t.animation_speed) ?? r ?? 100;
    return u`
      <div class="field-group">
        ${this.renderSwitchField(
      "Enable animation",
      (t == null ? void 0 : t.animation_enabled) ?? e,
      (p) => this.updateComponentSetting(i, "animation_enabled", p)
    )}
        ${this.renderAnimationSpeedField(i, this.clampNumber(a, 0, 100))}
      </div>
    `;
  }
  renderAnimationSpeedField(i, t) {
    const e = `animation-max-speed-${i}`;
    return u`
      <div class="animation-speed-field">
        <label for=${e}>Animation speed at 100%:</label>
        <div class="animation-speed-input-row">
          <input
            id=${e}
            type="number"
            min="0"
            max="100"
            step="1"
            .value=${String(t)}
            @input=${(r) => this.updateAnimationMaxSpeed(i, r.target.value)}
            @change=${(r) => this.updateAnimationMaxSpeed(i, r.target.value)}
          />
          <span aria-hidden="true">%</span>
        </div>
        <small>Percent of full animation speed.</small>
      </div>
    `;
  }
  renderFormatFields(i) {
    var e;
    const t = (e = this.config.format) == null ? void 0 : e[i];
    return u`
      <div class="field-group">
        ${this.renderNumberField(
      "Decimals",
      t == null ? void 0 : t.decimals,
      (r) => this.updateFormat(i, "decimals", r == null ? void 0 : Math.round(r)),
      { min: 0, max: 4, placeholder: "Default" }
    )}
        ${this.renderSwitchField("Show unit", (t == null ? void 0 : t.show_unit) !== !1, (r) => this.updateFormat(i, "show_unit", r))}
      </div>
    `;
  }
  renderSection(i, t, e = !1) {
    return u`
      <details class="section" ?open=${e}>
        <summary class="section-summary">${i}</summary>
        <div class="fields">${t}</div>
      </details>
    `;
  }
  renderTextField(i, t, e, r = "") {
    return u`
      <ha-textfield
        .label=${i}
        .value=${t}
        .placeholder=${r}
        @value-changed=${(a) => e(a.detail.value ?? "")}
        @input=${(a) => e(a.target.value)}
        @change=${(a) => e(a.target.value)}
      ></ha-textfield>
    `;
  }
  renderLabelField(i, t) {
    var r;
    const e = ((r = this.config.labels) == null ? void 0 : r[i]) ?? "";
    return u`
      <div class="label-field">
        <label for=${`label-${i}`}>Label</label>
        <input
          id=${`label-${i}`}
          type="text"
          .value=${e}
          placeholder=${t}
          @input=${(a) => this.updateLabel(i, a.target.value)}
          @change=${(a) => this.updateLabel(i, a.target.value)}
        />
        <small>Default: ${t}</small>
      </div>
    `;
  }
  renderNumberField(i, t, e, r = {}) {
    return u`
      <div class=${r.helperText ? "number-field has-helper" : "number-field"}>
        <ha-textfield
          .label=${i}
          .value=${t == null ? "" : String(t)}
          type="number"
          min=${String(r.min ?? 8)}
          max=${String(r.max ?? 24)}
          step=${String(r.step ?? 1)}
          .placeholder=${r.placeholder ?? "12"}
          .suffix=${r.suffix ?? ""}
          @input=${(a) => {
      const s = a.target.value.trim();
      e(s ? Number(s) : void 0);
    }}
          @change=${(a) => {
      const s = a.target.value.trim();
      e(s ? Number(s) : void 0);
    }}
        ></ha-textfield>
        ${r.helperText ? u`<small>${r.helperText}</small>` : c}
      </div>
    `;
  }
  renderSwitchField(i, t, e) {
    return u`
      <label class="switch-row">
        <span>${i}</span>
        <ha-switch
          .checked=${t}
          @change=${(r) => e(r.target.checked)}
        ></ha-switch>
      </label>
    `;
  }
  renderColorField(i, t, e, r) {
    return u`
      <div class="color-row">
        <label class="color-field">
          <span>${i}</span>
          <ha-textfield
            .value=${t}
            placeholder="Default"
            @input=${(a) => r(a.target.value)}
            @change=${(a) => r(a.target.value)}
          ></ha-textfield>
        </label>
        <input
          type="color"
          aria-label=${i}
          .value=${this.colorInputValue(t, e)}
          @input=${(a) => r(a.target.value)}
        />
        <ha-button appearance="plain" @click=${() => r("")}>Clear</ha-button>
      </div>
    `;
  }
  colorInputValue(i, t) {
    return /^#[0-9a-f]{6}$/i.test(i) ? i : t;
  }
  eventValue(i) {
    var e, r;
    const t = (e = i.detail) == null ? void 0 : e.value;
    return t ?? (((r = i.target) == null ? void 0 : r.value) ?? "").trim();
  }
  updateRoot(i, t) {
    const e = this.cloneConfig();
    t.trim() ? e[i] = t : delete e[i], this.updateConfig(e);
  }
  updateExchangerType(i) {
    ["rotary", "crossflow", "none"].includes(i) && this.updateConfig({ ...this.cloneConfig(), exchanger_type: i });
  }
  updateLabel(i, t) {
    const e = this.cloneConfig(), r = { ...e.labels ?? {} };
    t.trim() ? r[i] = t : delete r[i], Object.keys(r).length > 0 ? e.labels = r : delete e.labels, this.updateConfig(e);
  }
  updateNestedString(i, t, e) {
    const r = this.cloneConfig(), a = { ...r[i] ?? {} };
    e.trim() ? a[t] = e : delete a[t], Object.keys(a).length > 0 ? r[i] = a : delete r[i], this.updateConfig(r);
  }
  updateValueBox(i, t, e) {
    const r = this.cloneConfig(), a = { ...r.value_boxes ?? {} }, s = { ...a[i] ?? {} };
    typeof e == "string" ? e.trim() ? this.setValueBoxField(s, t, e) : delete s[t] : e != null && Number.isFinite(e) ? this.setValueBoxField(s, t, e) : delete s[t], Object.keys(s).length > 0 ? a[i] = s : delete a[i], Object.keys(a).length > 0 ? r.value_boxes = a : delete r.value_boxes, this.updateConfig(r);
  }
  updateNestedBoolean(i, t, e) {
    const r = this.cloneConfig(), a = { ...r[i] ?? {} };
    a[t] = e, i === "visibility" ? r.visibility = a : r.animations = a, this.updateConfig(r);
  }
  updateNestedNumber(i, t, e, r, a) {
    const s = this.cloneConfig(), o = { ...s[i] ?? {} };
    e == null || !Number.isFinite(e) ? delete o[t] : o[t] = this.clampNumber(e, r, a), Object.keys(o).length > 0 ? s[i] = o : delete s[i], this.updateConfig(s);
  }
  updateFormat(i, t, e) {
    const r = this.cloneConfig(), a = { ...r.format ?? {} }, s = { ...a[i] ?? {} };
    e == null || typeof e == "number" && !Number.isFinite(e) ? delete s[t] : t === "decimals" && typeof e == "number" ? s.decimals = this.clampNumber(e, 0, 4) : t === "show_unit" && typeof e == "boolean" && (s.show_unit = e), Object.keys(s).length > 0 ? a[i] = s : delete a[i], Object.keys(a).length > 0 ? r.format = a : delete r.format, this.updateConfig(r);
  }
  updateComponentSetting(i, t, e) {
    const r = this.cloneConfig(), a = { ...r.component_settings ?? {} }, s = { ...a[i] ?? {} };
    e == null || typeof e == "number" && !Number.isFinite(e) ? delete s[t] : t === "animation_enabled" && typeof e == "boolean" ? s.animation_enabled = e : t === "animation_max_speed" && typeof e == "number" ? (s.animation_max_speed = this.clampNumber(e, 0, 100), delete s.animation_speed) : t === "animation_speed" && typeof e == "number" && (s.animation_speed = this.clampNumber(e, 10, 150)), Object.keys(s).length > 0 ? a[i] = s : delete a[i], Object.keys(a).length > 0 ? r.component_settings = a : delete r.component_settings, this.updateConfig(r);
  }
  updateAnimationMaxSpeed(i, t) {
    const e = t.trim() === "" ? void 0 : Number(t);
    this.updateComponentSetting(i, "animation_max_speed", e);
  }
  setValueBoxField(i, t, e) {
    t === "border_color" && typeof e == "string" && (i.border_color = e), t === "font_size" && typeof e == "number" && (i.font_size = e);
  }
  cloneConfig() {
    const i = {
      ...this.config
    };
    return this.config.entities && (i.entities = { ...this.config.entities }), this.config.labels && (i.labels = { ...this.config.labels }), this.config.colors && (i.colors = { ...this.config.colors }), this.config.value_box && (i.value_box = { ...this.config.value_box }), this.config.value_boxes && (i.value_boxes = Object.fromEntries(
      Object.entries(this.config.value_boxes ?? {}).map(([t, e]) => [t, { ...e ?? {} }])
    )), this.config.visibility && (i.visibility = { ...this.config.visibility }), this.config.animations && (i.animations = { ...this.config.animations }), this.config.component_settings && (i.component_settings = Object.fromEntries(
      Object.entries(this.config.component_settings ?? {}).map(([t, e]) => [t, { ...e ?? {} }])
    )), this.config.layout && (i.layout = { ...this.config.layout }), this.config.format && (i.format = Object.fromEntries(
      Object.entries(this.config.format ?? {}).map(([t, e]) => [t, { ...e ?? {} }])
    )), i;
  }
  clampNumber(i, t, e) {
    return Number.isFinite(i) ? Math.min(Math.max(i, t), e) : t;
  }
  updateConfig(i) {
    this.config = i, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: i },
        bubbles: !0,
        composed: !0
      })
    );
  }
};
T.styles = Ct`
    .editor {
      display: grid;
      gap: 16px;
    }

    .section {
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.2));
      border-radius: 8px;
      background: var(--card-background-color, transparent);
      overflow: hidden;
    }

    .fields {
      display: grid;
      gap: 12px;
      padding: 12px;
      border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.14));
    }

    .panel-fields {
      display: grid;
      gap: 12px;
    }

    ha-select,
    ha-textfield,
    ha-entity-picker,
    ha-switch {
      width: 100%;
    }

    .switch-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 12px;
      align-items: center;
      justify-items: stretch;
      width: 100%;
      min-height: 40px;
      color: var(--primary-text-color);
      font-size: 14px;
      line-height: 1.25;
      text-align: left;
    }

    .switch-row span {
      justify-self: start;
      text-align: left;
    }

    .switch-row ha-switch {
      width: auto;
      justify-self: end;
    }

    .label-field {
      display: grid;
      gap: 4px;
    }

    .label-field label {
      color: var(--primary-text-color);
      font-size: 13px;
      font-weight: 500;
      line-height: 1.25;
    }

    .label-field input {
      box-sizing: border-box;
      width: 100%;
      min-height: 40px;
      padding: 8px 12px;
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.35));
      border-radius: 4px;
      background: var(--mdc-text-field-fill-color, var(--card-background-color, transparent));
      color: var(--primary-text-color);
      font: inherit;
    }

    .label-field input:focus {
      border-color: var(--primary-color);
      outline: none;
    }

    .label-field input::placeholder {
      color: var(--secondary-text-color);
      opacity: 0.85;
    }

    .label-field small {
      color: var(--secondary-text-color);
      font-size: 12px;
      line-height: 1.25;
    }

    .field-group {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 12px;
      align-items: center;
    }

    .number-field {
      display: grid;
      gap: 4px;
      min-width: 0;
    }

    .number-field ha-textfield {
      width: 100%;
    }

    .number-field small {
      color: var(--secondary-text-color);
      font-size: 12px;
      line-height: 1.25;
    }

    .animation-speed-field {
      display: grid;
      gap: 4px;
      min-width: 0;
    }

    .animation-speed-field label {
      color: var(--primary-text-color);
      font-size: 13px;
      font-weight: 500;
      line-height: 1.25;
    }

    .animation-speed-input-row {
      display: grid;
      grid-template-columns: minmax(72px, 120px) auto;
      gap: 8px;
      align-items: center;
      justify-content: start;
    }

    .animation-speed-input-row input {
      box-sizing: border-box;
      width: 100%;
      min-height: 40px;
      padding: 8px 10px;
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.35));
      border-radius: 4px;
      background: var(--mdc-text-field-fill-color, var(--card-background-color, transparent));
      color: var(--primary-text-color);
      font: inherit;
    }

    .animation-speed-input-row input:focus {
      border-color: var(--primary-color);
      outline: none;
    }

    .animation-speed-input-row span,
    .animation-speed-field small {
      color: var(--secondary-text-color);
      font-size: 12px;
      line-height: 1.25;
    }

    .color-field {
      display: grid;
      gap: 4px;
      min-width: 0;
    }

    .color-field span {
      color: var(--primary-text-color);
      font-size: 13px;
      font-weight: 500;
      line-height: 1.25;
    }

    .component-panel {
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.2));
      border-radius: 8px;
      padding: 0;
      overflow: hidden;
    }

    summary {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 12px;
      align-items: center;
      min-height: 40px;
      padding: 0 12px;
      cursor: pointer;
      color: var(--primary-text-color);
      font-weight: 600;
      list-style-position: inside;
    }

    .section-summary {
      min-height: 44px;
      padding: 0 12px;
      font-size: 15px;
    }

    summary small {
      min-width: 0;
      max-width: 180px;
      overflow: hidden;
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 400;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .panel-fields {
      padding: 8px 12px 12px;
      border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.14));
    }

    .color-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 44px auto;
      gap: 8px;
      align-items: center;
    }

    input[type="color"] {
      width: 44px;
      height: 44px;
      padding: 2px;
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.35));
      border-radius: 6px;
      background: transparent;
      cursor: pointer;
    }

    ha-button {
      white-space: nowrap;
    }

    @media (max-width: 520px) {
      summary {
        grid-template-columns: minmax(0, 1fr);
        gap: 2px;
        padding-top: 8px;
        padding-bottom: 8px;
      }

      summary small {
        max-width: 100%;
      }

      .color-row {
        grid-template-columns: minmax(0, 1fr) 44px;
      }

      .field-group {
        grid-template-columns: minmax(0, 1fr);
      }

      .color-row ha-button {
        grid-column: 1 / -1;
        justify-self: start;
      }
    }
  `;
it([
  et({ attribute: !1 })
], T.prototype, "hass", 2);
it([
  zt()
], T.prototype, "config", 2);
T = it([
  Ft("ventilation-card-editor")
], T);
var pe = Object.defineProperty, ue = Object.getOwnPropertyDescriptor, rt = (i, t, e, r) => {
  for (var a = r > 1 ? void 0 : r ? ue(t, e) : t, s = i.length - 1, o; s >= 0; s--)
    (o = i[s]) && (a = (r ? o(t, e, a) : o(a)) || a);
  return r && a && pe(t, e, a), a;
};
const X = /* @__PURE__ */ new Set(["unknown", "unavailable", "none", ""]), wt = 920, fe = 50, At = 9, Y = 8, St = 10, me = 12, ge = {
  outdoor_temp: "Outdoor air temperature",
  supply_temp: "Supply air temperature",
  extract_temp: "Extract air temperature",
  exhaust_temp: "Exhaust air temperature",
  supply_fan: "Supply fan",
  extract_fan: "Extract fan",
  heat_exchanger_speed: "Heat exchanger",
  heater_output: "Heater output",
  filter_alarm: "Filter alarm",
  alarm: "Alarm",
  mode: "Mode"
};
let D = class extends k {
  setConfig(i) {
    if (!i)
      throw new Error("Invalid ventilation-card configuration");
    this.config = {
      name: "Ventilation",
      exchanger_type: "rotary",
      show_airflow: !0,
      entities: {},
      ...i
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
    const i = this.config;
    if (!i)
      return c;
    const t = ["mode", "filter_alarm", "alarm"].filter((r) => this.isVisible(r)), e = this.layoutSize();
    return u`
      <ha-card>
        <div class="card size-${e}">
          <header class="header">
            <h2>${i.name ?? "Ventilation"}</h2>
          </header>

          <div class="schematic" style=${this.schematicStyle()} aria-label="Ventilation unit schematic">
            ${this.renderSchematic()}
          </div>

          ${t.length > 0 ? u`<footer class="status-strip">${t.map((r) => this.renderStatusItem(r))}</footer>` : c}
        </div>
      </ha-card>
    `;
  }
  schematicStyle() {
    var r, a;
    const i = (r = this.config) == null ? void 0 : r.colors, t = (a = this.config) == null ? void 0 : a.value_box;
    return [
      ["--vc-air-outdoor", i == null ? void 0 : i.outdoor_air],
      ["--vc-air-supply", i == null ? void 0 : i.supply_air],
      ["--vc-air-extract", i == null ? void 0 : i.extract_air],
      ["--vc-air-exhaust", i == null ? void 0 : i.exhaust_air],
      ["--vc-value-box-border-color", t == null ? void 0 : t.border_color],
      ["--vc-value-box-background-color", t == null ? void 0 : t.background_color]
    ].filter(([, s]) => s && s.trim().length > 0).map(([s, o]) => `${s}: ${o};`).join(" ");
  }
  renderSchematic() {
    var nt, lt, ct, dt;
    const i = this.entityDisplay("outdoor_temp"), t = this.entityDisplay("supply_temp"), e = this.entityDisplay("extract_temp"), r = this.entityDisplay("exhaust_temp"), a = this.entityDisplay("supply_fan"), s = this.entityDisplay("extract_fan"), o = this.entityDisplay("heat_exchanger_speed"), l = this.entityDisplay("heater_output"), n = this.entityNumericValue("supply_fan"), d = this.entityNumericValue("extract_fan"), p = this.entityNumericValue("heater_output"), h = this.entityNumericValue("heat_exchanger_speed"), m = ((nt = this.config) == null ? void 0 : nt.show_airflow) !== !1 && this.animationEnabled("enabled") && this.animationEnabled("airflow_enabled"), f = ((ct = (lt = this.config) == null ? void 0 : lt.animations) == null ? void 0 : ct.stop_when_zero) !== !1, g = this.componentAnimationSpeed("supply_fan", "fan_max_speed"), L = this.componentAnimationSpeed("extract_fan", "fan_max_speed"), N = this.componentAnimationSpeed("heat_exchanger_speed", "rotor_max_speed"), y = m && (n > 0 || !f), S = m && (d > 0 || !f), Vt = this.animationEnabled("enabled") && this.componentAnimationEnabled("supply_fan", "fans_enabled") && g > 0 && (n > 0 || !f), Pt = this.animationEnabled("enabled") && this.componentAnimationEnabled("extract_fan", "fans_enabled") && L > 0 && (d > 0 || !f), Tt = this.animationEnabled("enabled") && this.componentAnimationEnabled("heat_exchanger_speed", "rotor_enabled") && N > 0 && (h > 0 || !f), Dt = this.getAnimationDurationFromValue(n, 0.8, 4.8, this.animationMaxSpeed("airflow_max_speed")), jt = this.getAnimationDurationFromValue(d, 0.8, 4.8, this.animationMaxSpeed("airflow_max_speed")), at = this.getAnimationDurationFromValue(n, 1.45, 4.2, g), st = this.getAnimationDurationFromValue(d, 1.45, 4.2, L), ot = this.getAnimationDurationFromValue(h, 3.2, 14, N);
    return u`
      <svg
        viewBox="0 0 920 360"
        role="img"
        style="--supply-fan-duration: ${at}; --extract-fan-duration: ${st}; --rotor-duration: ${ot}; --supply-airflow-duration: ${Dt}; --extract-airflow-duration: ${jt};"
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
        <path d="M886 120 H794" class="flow-line extract extract-air ${S ? "flow" : ""}"></path>
        <path d="M140 120 H20" class="duct-fill exhaust"></path>
        <path d="M126 120 H34" class="flow-line exhaust extract-air ${S ? "flow" : ""}"></path>
        <path d="M20 240 H140" class="duct-fill outdoor"></path>
        <path d="M34 240 H126" class="flow-line outdoor supply-air ${y ? "flow" : ""}"></path>
        <path d="M780 240 H900" class="duct-fill supply"></path>
        <path d="M794 240 H886" class="flow-line supply supply-air ${y ? "flow" : ""}"></path>

        <path d="M28 120 L40 113 L40 127 Z" class="outer-arrow exhaust"></path>
        <path d="M876 120 L888 113 L888 127 Z" class="outer-arrow extract"></path>
        <path d="M42 240 L30 233 L30 247 Z" class="outer-arrow outdoor"></path>
        <path d="M892 240 L880 233 L880 247 Z" class="outer-arrow supply"></path>

        <path d="M150 240 H194" class="internal-flow-line outdoor supply-air ${y ? "flow" : ""}"></path>
        <path d="M246 240 H388" class="internal-flow-line outdoor supply-air ${y ? "flow" : ""}"></path>
        <path d="M532 240 H624" class="internal-flow-line supply supply-air ${y ? "flow" : ""}"></path>
        <path d="M696 240 H712" class="internal-flow-line supply supply-air ${y ? "flow" : ""}"></path>
        <path d="M756 240 H770" class="internal-flow-line supply supply-air ${y ? "flow" : ""}"></path>
        <path d="M770 120 H728" class="internal-flow-line extract extract-air ${S ? "flow" : ""}"></path>
        <path d="M676 120 H532" class="internal-flow-line extract extract-air ${S ? "flow" : ""}"></path>
        <path d="M388 120 H294" class="internal-flow-line exhaust extract-air ${S ? "flow" : ""}"></path>
        <path d="M226 120 H150" class="internal-flow-line exhaust extract-air ${S ? "flow" : ""}"></path>

        ${this.renderFilter(220, 240)}
        ${this.renderFilter(702, 120)}
        ${this.isVisible("heat_exchanger_speed") ? this.renderHeatExchanger(460, 180, Tt, ot, ((dt = this.config) == null ? void 0 : dt.exchanger_type) ?? "rotary") : c}
        ${this.isVisible("extract_fan") ? this.renderFan(260, 120, Pt, st, "extract") : c}
        ${this.isVisible("supply_fan") ? this.renderFan(660, 240, Vt, at, "supply") : c}
        ${this.isVisible("heater_output") ? this.renderHeaterCoil(734, 240, p) : c}

        <g class="badges">
          ${this.isVisible("exhaust_temp") ? this.renderValueLabel(28, 64, r.label, r.value, "exhaust", "exhaust_temp") : c}
          ${this.isVisible("extract_temp") ? this.renderValueLabel(792, 64, e.label, e.value, "extract", "extract_temp") : c}
          ${this.isVisible("outdoor_temp") ? this.renderValueLabel(28, 258, i.label, i.value, "outdoor", "outdoor_temp") : c}
          ${this.isVisible("supply_temp") ? this.renderValueLabel(792, 258, t.label, t.value, "supply", "supply_temp") : c}
          ${this.isVisible("extract_fan") ? this.renderValueLabel(190, 38, s.label, s.value, "component", "extract_fan") : c}
          ${this.isVisible("supply_fan") ? this.renderValueLabel(610, 304, a.label, a.value, "component", "supply_fan") : c}
          ${this.isVisible("heat_exchanger_speed") ? this.renderValueLabel(411, 274, o.label, o.value, "component", "heat_exchanger_speed") : c}
          ${this.isVisible("heater_output") ? this.renderValueLabel(714, 178, l.label, l.value, p > 0 ? "heater-active" : "neutral", "heater_output") : c}
        </g>
      </svg>
    `;
  }
  renderFan(i, t, e, r, a) {
    return _`
      <g class="fan-symbol ${a}" transform="translate(${i} ${t})" style="--fan-duration: ${r};">
        <circle class="fan-ring" r="30"></circle>
        <g class="fan-blades ${e ? "spin" : ""}">
          <path d="M0 -23 C11 -22 20 -15 20 -6 C20 -1 16 2 11 1 C5 0 2 -8 0 -23"></path>
          <path d="M23 0 C22 11 15 20 6 20 C1 20 -2 16 -1 11 C0 5 8 2 23 0"></path>
          <path d="M0 23 C-11 22 -20 15 -20 6 C-20 1 -16 -2 -11 -1 C-5 0 -2 8 0 23"></path>
          <path d="M-23 0 C-22 -11 -15 -20 -6 -20 C-1 -20 2 -16 1 -11 C0 -5 -8 -2 -23 0"></path>
          <circle class="fan-hub" r="7"></circle>
        </g>
      </g>
    `;
  }
  renderHeatExchanger(i, t, e, r, a) {
    return a === "none" ? c : a === "crossflow" ? _`<g class="heat-exchanger crossflow" transform="translate(${i} ${t})" style="--rotor-duration: ${r};">
        <rect class="crossflow-box" x="-54" y="-54" width="108" height="108" rx="8"></rect>
        <path d="M-44 -42 L42 44"></path>
        <path d="M-42 44 L44 -42"></path>
      </g>` : _`
      <g class="heat-exchanger" transform="translate(${i} ${t})" style="--rotor-duration: ${r};">
        <circle class="rotor-ring" r="72"></circle>
        <g class="rotor-motion ${e ? "spin" : ""}">
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
  renderHeaterCoil(i, t, e) {
    return _`
      <g class="heater-coil ${e > 0 ? "active" : ""}" transform="translate(${i} ${t})">
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
  renderFilter(i, t) {
    return _`
      <g class="filter-symbol" transform="translate(${i} ${t})">
        <rect x="-18" y="-24" width="36" height="48" rx="4"></rect>
        <path d="M-11 -18 L11 18"></path>
        <path d="M-3 -18 L18 16"></path>
        <path d="M-18 -12 L3 22"></path>
      </g>
    `;
  }
  renderDamper(i, t) {
    return _`
      <g class="damper-symbol" transform="translate(${i} ${t})">
        <rect x="-19" y="-12" width="38" height="24" rx="3"></rect>
        <path d="M-13 8 L13 -8"></path>
        <circle r="2.5"></circle>
      </g>
    `;
  }
  renderValueLabel(i, t, e, r, a = "neutral", s) {
    var L, N;
    const o = s ? (N = (L = this.config) == null ? void 0 : L.value_boxes) == null ? void 0 : N[s] : void 0, l = this.clampNumber((o == null ? void 0 : o.font_size) ?? me, 8, 24), n = this.valueBadgeWidth(e, r, l), d = Math.max(34, l + St + 14), p = this.clampNumber(i, Y, wt - n - Y), h = At, m = 13, f = Math.max(27, m + l + 4), g = [
      o != null && o.border_color ? `--vc-badge-border-color: ${o.border_color};` : "",
      o != null && o.font_size ? `--vc-badge-font-size: ${o.font_size}px;` : ""
    ].join(" ");
    return _`
      <g class="svg-badge ${a}" transform="translate(${p} ${t})" style=${g}>
        <rect width=${n} height=${d} rx="6"></rect>
        <text x=${h} y=${m} class="badge-label">${e}</text>
        <text x=${h} y=${f} class="badge-value">${r}</text>
      </g>
    `;
  }
  valueBadgeWidth(i, t, e) {
    const r = this.estimateSvgTextWidth(i, St), a = this.estimateSvgTextWidth(t, e), s = wt - Y * 2;
    return Math.min(s, Math.ceil(Math.max(fe, r, a) + At * 2));
  }
  estimateSvgTextWidth(i, t) {
    return Array.from(i).reduce((e, r) => r === " " || "il.,:;|'![]()".includes(r) ? e + t * 0.32 : "MW@#%&".includes(r) ? e + t * 0.85 : r >= "0" && r <= "9" ? e + t * 0.58 : e + t * 0.56, 0);
  }
  renderStatusItem(i) {
    var a, s;
    const t = this.entityDisplay(i), e = (s = (a = this.config) == null ? void 0 : a.value_boxes) == null ? void 0 : s[i], r = [
      e != null && e.border_color ? `--vc-status-border-color: ${e.border_color};` : "",
      e != null && e.font_size ? `--vc-status-font-size: ${e.font_size}px;` : ""
    ].join(" ");
    return u`
      <div class="status-item ${t.tone ?? "normal"}" style=${r}>
        <span>${t.label}</span>
        <strong>${t.value}</strong>
      </div>
    `;
  }
  entityDisplay(i) {
    const t = this.getEntityState(i), e = this.getEntityValue(i), r = this.entityTone(t);
    return {
      label: this.getLabel(i),
      value: e,
      tone: r
    };
  }
  getEntityId(i) {
    var a, s;
    const t = (s = (a = this.config) == null ? void 0 : a.entities) == null ? void 0 : s[i], e = typeof t == "string" ? t : typeof t == "object" && t !== null && "entity" in t ? t.entity : void 0;
    return typeof e != "string" ? void 0 : e.trim() || void 0;
  }
  getEntityState(i) {
    var e;
    const t = this.getEntityId(i);
    if (!(!t || !((e = this.hass) != null && e.states)))
      return this.hass.states[t];
  }
  getEntityValue(i) {
    return this.formatEntityValue(i, this.getEntityState(i));
  }
  getLabel(i) {
    var t, e;
    return ((e = (t = this.config) == null ? void 0 : t.labels) == null ? void 0 : e[i]) ?? ge[i];
  }
  formatEntityValue(i, t) {
    var o, l;
    if (!t || X.has(String(t.state).toLowerCase()))
      return "—";
    const e = (l = (o = this.config) == null ? void 0 : o.format) == null ? void 0 : l[i], r = Number.parseFloat(String(t.state).replace(",", ".")), a = (e == null ? void 0 : e.decimals) != null && Number.isFinite(r) ? r.toFixed(Math.round(this.clampNumber(e.decimals, 0, 4))) : t.state, s = t.attributes.unit_of_measurement;
    return s && (e == null ? void 0 : e.show_unit) !== !1 ? `${a} ${s}` : String(a);
  }
  entityTone(i) {
    if (!i || X.has(String(i.state).toLowerCase()))
      return "normal";
    const t = String(i.state).toLowerCase();
    return ["on", "problem", "detected", "active", "true"].includes(t) ? "danger" : ["warning", "pending"].includes(t) ? "warning" : "normal";
  }
  entityNumericValue(i) {
    const t = this.getEntityState(i);
    if (!t || X.has(String(t.state).toLowerCase()))
      return 0;
    const e = Number.parseFloat(String(t.state).replace(",", "."));
    return Number.isFinite(e) ? Math.max(0, e) : ["on", "running", "active", "true"].includes(String(t.state).toLowerCase()) ? 100 : 0;
  }
  getAnimationDurationFromValue(i, t, e, r = 100) {
    if (i <= 0)
      return `${e.toFixed(1)}s`;
    const a = this.clampNumber(i, 1, 100), s = this.clampNumber(r, 0, 100) / 100;
    if (s <= 0)
      return `${e.toFixed(1)}s`;
    const o = e - a * s / 100 * (e - t);
    return `${Math.max(0.2, o).toFixed(1)}s`;
  }
  isVisible(i) {
    var t, e;
    return ((e = (t = this.config) == null ? void 0 : t.visibility) == null ? void 0 : e[i]) !== !1;
  }
  animationEnabled(i) {
    var t, e;
    return ((e = (t = this.config) == null ? void 0 : t.animations) == null ? void 0 : e[i]) !== !1;
  }
  animationMaxSpeed(i) {
    var t, e;
    return this.clampNumber(((e = (t = this.config) == null ? void 0 : t.animations) == null ? void 0 : e[i]) ?? 100, 10, 150);
  }
  componentAnimationEnabled(i, t) {
    var e, r, a;
    return ((a = (r = (e = this.config) == null ? void 0 : e.component_settings) == null ? void 0 : r[i]) == null ? void 0 : a.animation_enabled) ?? this.animationEnabled(t);
  }
  componentAnimationSpeed(i, t) {
    var r, a;
    const e = (a = (r = this.config) == null ? void 0 : r.component_settings) == null ? void 0 : a[i];
    return this.clampNumber((e == null ? void 0 : e.animation_max_speed) ?? (e == null ? void 0 : e.animation_speed) ?? this.animationMaxSpeed(t), 0, 100);
  }
  layoutSize() {
    var t, e;
    const i = (e = (t = this.config) == null ? void 0 : t.layout) == null ? void 0 : e.size;
    return i === "compact" || i === "large" ? i : "normal";
  }
  clampNumber(i, t, e) {
    return Number.isFinite(i) ? Math.min(Math.max(i, t), e) : t;
  }
};
D.styles = Ct`
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
      --vc-card-title-size: 20px;
      --vc-svg-max-height: 360px;
      --vc-status-label-size: 12px;
      --vc-status-default-value-size: 13px;
    }

    .card.size-compact {
      padding: 10px;
      --vc-card-title-size: 18px;
      --vc-svg-max-height: 320px;
      --vc-status-label-size: 11px;
      --vc-status-default-value-size: 12px;
    }

    .card.size-large {
      padding: 14px;
      --vc-card-title-size: 22px;
      --vc-svg-max-height: 420px;
      --vc-status-label-size: 13px;
      --vc-status-default-value-size: 14px;
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
      font-size: var(--vc-card-title-size);
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
      max-height: var(--vc-svg-max-height);
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
    .heat-exchanger.crossflow path {
      stroke-width: 6;
      opacity: 0.8;
    }

    .heat-exchanger.crossflow .crossflow-box {
      fill: var(--vc-component-surface);
      fill-opacity: 0.88;
      stroke: var(--vc-component-line);
      stroke-width: 2.6;
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
      stroke: var(--vc-badge-border-color, var(--vc-badge-tone-border-color, var(--vc-value-box-border-color, var(--divider-color, rgba(127, 127, 127, 0.56)))));
      stroke-width: 1.35;
    }

    .svg-badge.outdoor {
      --vc-badge-tone-border-color: var(--vc-air-outdoor);
    }

    .svg-badge.supply {
      --vc-badge-tone-border-color: var(--vc-air-supply);
    }

    .svg-badge.extract {
      --vc-badge-tone-border-color: var(--vc-air-extract);
    }

    .svg-badge.exhaust {
      --vc-badge-tone-border-color: var(--vc-air-exhaust);
    }

    .svg-badge.heater-active {
      --vc-badge-tone-border-color: var(--vc-air-supply);
    }

    .svg-badge.component rect {
      fill-opacity: 0.96;
      stroke: var(--vc-badge-border-color, var(--vc-value-box-border-color, var(--primary-text-color, #1f2937)));
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
      font-size: var(--vc-badge-font-size, 12px);
      font-weight: 600;
    }

    .status-strip {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
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
      border: 1px solid var(--vc-status-border-color, var(--vc-value-box-border-color, var(--divider-color, rgba(127, 127, 127, 0.2))));
      border-radius: 8px;
      background: transparent;
    }

    .status-item span,
    .status-item strong {
      overflow-wrap: anywhere;
    }

    .status-item span {
      color: var(--secondary-text-color, #727272);
      font-size: var(--vc-status-label-size);
      line-height: 1.2;
    }

    .status-item strong {
      color: var(--primary-text-color, #111);
      font-size: var(--vc-status-font-size, var(--vc-status-default-value-size));
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
        font-size: var(--vc-badge-font-size, 11px);
      }
    }
  `;
rt([
  et({ attribute: !1 })
], D.prototype, "hass", 2);
rt([
  zt()
], D.prototype, "config", 2);
D = rt([
  Ft("ventilation-card")
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
