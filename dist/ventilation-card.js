/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const B = globalThis, ee = B.ShadowRoot && (B.ShadyCSS === void 0 || B.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, te = Symbol(), me = /* @__PURE__ */ new WeakMap();
let Le = class {
  constructor(e, i, r) {
    if (this._$cssResult$ = !0, r !== te) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = i;
  }
  get styleSheet() {
    let e = this.o;
    const i = this.t;
    if (ee && e === void 0) {
      const r = i !== void 0 && i.length === 1;
      r && (e = me.get(i)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), r && me.set(i, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Ye = (t) => new Le(typeof t == "string" ? t : t + "", void 0, te), Fe = (t, ...e) => {
  const i = t.length === 1 ? t[0] : e.reduce((r, a, s) => r + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(a) + t[s + 1], t[0]);
  return new Le(i, t, te);
}, Ge = (t, e) => {
  if (ee) t.adoptedStyleSheets = e.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of e) {
    const r = document.createElement("style"), a = B.litNonce;
    a !== void 0 && r.setAttribute("nonce", a), r.textContent = i.cssText, t.appendChild(r);
  }
}, ge = ee ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let i = "";
  for (const r of e.cssRules) i += r.cssText;
  return Ye(i);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Xe, defineProperty: qe, getOwnPropertyDescriptor: Ke, getOwnPropertyNames: Ze, getOwnPropertySymbols: Je, getPrototypeOf: Qe } = Object, v = globalThis, ye = v.trustedTypes, et = ye ? ye.emptyScript : "", q = v.reactiveElementPolyfillSupport, T = (t, e) => t, W = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? et : null;
      break;
    case Object:
    case Array:
      t = t == null ? t : JSON.stringify(t);
  }
  return t;
}, fromAttribute(t, e) {
  let i = t;
  switch (e) {
    case Boolean:
      i = t !== null;
      break;
    case Number:
      i = t === null ? null : Number(t);
      break;
    case Object:
    case Array:
      try {
        i = JSON.parse(t);
      } catch {
        i = null;
      }
  }
  return i;
} }, ie = (t, e) => !Xe(t, e), be = { attribute: !0, type: String, converter: W, reflect: !1, useDefault: !1, hasChanged: ie };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), v.litPropertyMetadata ?? (v.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let k = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, i = be) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(e, i), !i.noAccessor) {
      const r = Symbol(), a = this.getPropertyDescriptor(e, r, i);
      a !== void 0 && qe(this.prototype, e, a);
    }
  }
  static getPropertyDescriptor(e, i, r) {
    const { get: a, set: s } = Ke(this.prototype, e) ?? { get() {
      return this[i];
    }, set(o) {
      this[i] = o;
    } };
    return { get: a, set(o) {
      const l = a == null ? void 0 : a.call(this);
      s == null || s.call(this, o), this.requestUpdate(e, l, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? be;
  }
  static _$Ei() {
    if (this.hasOwnProperty(T("elementProperties"))) return;
    const e = Qe(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(T("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(T("properties"))) {
      const i = this.properties, r = [...Ze(i), ...Je(i)];
      for (const a of r) this.createProperty(a, i[a]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const i = litPropertyMetadata.get(e);
      if (i !== void 0) for (const [r, a] of i) this.elementProperties.set(r, a);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, r] of this.elementProperties) {
      const a = this._$Eu(i, r);
      a !== void 0 && this._$Eh.set(a, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const i = [];
    if (Array.isArray(e)) {
      const r = new Set(e.flat(1 / 0).reverse());
      for (const a of r) i.unshift(ge(a));
    } else e !== void 0 && i.push(ge(e));
    return i;
  }
  static _$Eu(e, i) {
    const r = i.attribute;
    return r === !1 ? void 0 : typeof r == "string" ? r : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var e;
    this._$ES = new Promise((i) => this.enableUpdating = i), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (e = this.constructor.l) == null || e.forEach((i) => i(this));
  }
  addController(e) {
    var i;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(e), this.renderRoot !== void 0 && this.isConnected && ((i = e.hostConnected) == null || i.call(e));
  }
  removeController(e) {
    var i;
    (i = this._$EO) == null || i.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), i = this.constructor.elementProperties;
    for (const r of i.keys()) this.hasOwnProperty(r) && (e.set(r, this[r]), delete this[r]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Ge(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$EO) == null || e.forEach((i) => {
      var r;
      return (r = i.hostConnected) == null ? void 0 : r.call(i);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$EO) == null || e.forEach((i) => {
      var r;
      return (r = i.hostDisconnected) == null ? void 0 : r.call(i);
    });
  }
  attributeChangedCallback(e, i, r) {
    this._$AK(e, r);
  }
  _$ET(e, i) {
    var s;
    const r = this.constructor.elementProperties.get(e), a = this.constructor._$Eu(e, r);
    if (a !== void 0 && r.reflect === !0) {
      const o = (((s = r.converter) == null ? void 0 : s.toAttribute) !== void 0 ? r.converter : W).toAttribute(i, r.type);
      this._$Em = e, o == null ? this.removeAttribute(a) : this.setAttribute(a, o), this._$Em = null;
    }
  }
  _$AK(e, i) {
    var s, o;
    const r = this.constructor, a = r._$Eh.get(e);
    if (a !== void 0 && this._$Em !== a) {
      const l = r.getPropertyOptions(a), n = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((s = l.converter) == null ? void 0 : s.fromAttribute) !== void 0 ? l.converter : W;
      this._$Em = a;
      const d = n.fromAttribute(i, l.type);
      this[a] = d ?? ((o = this._$Ej) == null ? void 0 : o.get(a)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(e, i, r, a = !1, s) {
    var o;
    if (e !== void 0) {
      const l = this.constructor;
      if (a === !1 && (s = this[e]), r ?? (r = l.getPropertyOptions(e)), !((r.hasChanged ?? ie)(s, i) || r.useDefault && r.reflect && s === ((o = this._$Ej) == null ? void 0 : o.get(e)) && !this.hasAttribute(l._$Eu(e, r)))) return;
      this.C(e, i, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, i, { useDefault: r, reflect: a, wrapped: s }, o) {
    r && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, o ?? i ?? this[e]), s !== !0 || o !== void 0) || (this._$AL.has(e) || (this.hasUpdated || r || (i = void 0), this._$AL.set(e, i)), a === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (i) {
      Promise.reject(i);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
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
    let e = !1;
    const i = this._$AL;
    try {
      e = this.shouldUpdate(i), e ? (this.willUpdate(i), (r = this._$EO) == null || r.forEach((a) => {
        var s;
        return (s = a.hostUpdate) == null ? void 0 : s.call(a);
      }), this.update(i)) : this._$EM();
    } catch (a) {
      throw e = !1, this._$EM(), a;
    }
    e && this._$AE(i);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var i;
    (i = this._$EO) == null || i.forEach((r) => {
      var a;
      return (a = r.hostUpdated) == null ? void 0 : a.call(r);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
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
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((i) => this._$ET(i, this[i]))), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
k.elementStyles = [], k.shadowRootOptions = { mode: "open" }, k[T("elementProperties")] = /* @__PURE__ */ new Map(), k[T("finalized")] = /* @__PURE__ */ new Map(), q == null || q({ ReactiveElement: k }), (v.reactiveElementVersions ?? (v.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const V = globalThis, xe = (t) => t, Y = V.trustedTypes, _e = Y ? Y.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, He = "$lit$", _ = `lit$${Math.random().toFixed(9).slice(2)}$`, Pe = "?" + _, tt = `<${Pe}>`, A = document, z = () => A.createComment(""), I = (t) => t === null || typeof t != "object" && typeof t != "function", re = Array.isArray, it = (t) => re(t) || typeof (t == null ? void 0 : t[Symbol.iterator]) == "function", K = `[ 	
\f\r]`, H = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ve = /-->/g, $e = />/g, w = RegExp(`>|${K}(?:([^\\s"'>=/]+)(${K}*=${K}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), we = /'/g, Ee = /"/g, Te = /^(?:script|style|textarea|title)$/i, Ve = (t) => (e, ...i) => ({ _$litType$: t, strings: e, values: i }), u = Ve(1), M = Ve(2), N = Symbol.for("lit-noChange"), c = Symbol.for("lit-nothing"), Se = /* @__PURE__ */ new WeakMap(), E = A.createTreeWalker(A, 129);
function ze(t, e) {
  if (!re(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return _e !== void 0 ? _e.createHTML(e) : e;
}
const rt = (t, e) => {
  const i = t.length - 1, r = [];
  let a, s = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", o = H;
  for (let l = 0; l < i; l++) {
    const n = t[l];
    let d, p, h = -1, f = 0;
    for (; f < n.length && (o.lastIndex = f, p = o.exec(n), p !== null); ) f = o.lastIndex, o === H ? p[1] === "!--" ? o = ve : p[1] !== void 0 ? o = $e : p[2] !== void 0 ? (Te.test(p[2]) && (a = RegExp("</" + p[2], "g")), o = w) : p[3] !== void 0 && (o = w) : o === w ? p[0] === ">" ? (o = a ?? H, h = -1) : p[1] === void 0 ? h = -2 : (h = o.lastIndex - p[2].length, d = p[1], o = p[3] === void 0 ? w : p[3] === '"' ? Ee : we) : o === Ee || o === we ? o = w : o === ve || o === $e ? o = H : (o = w, a = void 0);
    const m = o === w && t[l + 1].startsWith("/>") ? " " : "";
    s += o === H ? n + tt : h >= 0 ? (r.push(d), n.slice(0, h) + He + n.slice(h) + _ + m) : n + _ + (h === -2 ? l : m);
  }
  return [ze(t, s + (t[i] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), r];
};
class D {
  constructor({ strings: e, _$litType$: i }, r) {
    let a;
    this.parts = [];
    let s = 0, o = 0;
    const l = e.length - 1, n = this.parts, [d, p] = rt(e, i);
    if (this.el = D.createElement(d, r), E.currentNode = this.el.content, i === 2 || i === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (a = E.nextNode()) !== null && n.length < l; ) {
      if (a.nodeType === 1) {
        if (a.hasAttributes()) for (const h of a.getAttributeNames()) if (h.endsWith(He)) {
          const f = p[o++], m = a.getAttribute(h).split(_), g = /([.?@])?(.*)/.exec(f);
          n.push({ type: 1, index: s, name: g[2], strings: m, ctor: g[1] === "." ? st : g[1] === "?" ? ot : g[1] === "@" ? nt : G }), a.removeAttribute(h);
        } else h.startsWith(_) && (n.push({ type: 6, index: s }), a.removeAttribute(h));
        if (Te.test(a.tagName)) {
          const h = a.textContent.split(_), f = h.length - 1;
          if (f > 0) {
            a.textContent = Y ? Y.emptyScript : "";
            for (let m = 0; m < f; m++) a.append(h[m], z()), E.nextNode(), n.push({ type: 2, index: ++s });
            a.append(h[f], z());
          }
        }
      } else if (a.nodeType === 8) if (a.data === Pe) n.push({ type: 2, index: s });
      else {
        let h = -1;
        for (; (h = a.data.indexOf(_, h + 1)) !== -1; ) n.push({ type: 7, index: s }), h += _.length - 1;
      }
      s++;
    }
  }
  static createElement(e, i) {
    const r = A.createElement("template");
    return r.innerHTML = e, r;
  }
}
function L(t, e, i = t, r) {
  var o, l;
  if (e === N) return e;
  let a = r !== void 0 ? (o = i._$Co) == null ? void 0 : o[r] : i._$Cl;
  const s = I(e) ? void 0 : e._$litDirective$;
  return (a == null ? void 0 : a.constructor) !== s && ((l = a == null ? void 0 : a._$AO) == null || l.call(a, !1), s === void 0 ? a = void 0 : (a = new s(t), a._$AT(t, i, r)), r !== void 0 ? (i._$Co ?? (i._$Co = []))[r] = a : i._$Cl = a), a !== void 0 && (e = L(t, a._$AS(t, e.values), a, r)), e;
}
class at {
  constructor(e, i) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = i;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: i }, parts: r } = this._$AD, a = ((e == null ? void 0 : e.creationScope) ?? A).importNode(i, !0);
    E.currentNode = a;
    let s = E.nextNode(), o = 0, l = 0, n = r[0];
    for (; n !== void 0; ) {
      if (o === n.index) {
        let d;
        n.type === 2 ? d = new j(s, s.nextSibling, this, e) : n.type === 1 ? d = new n.ctor(s, n.name, n.strings, this, e) : n.type === 6 && (d = new lt(s, this, e)), this._$AV.push(d), n = r[++l];
      }
      o !== (n == null ? void 0 : n.index) && (s = E.nextNode(), o++);
    }
    return E.currentNode = A, a;
  }
  p(e) {
    let i = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(e, r, i), i += r.strings.length - 2) : r._$AI(e[i])), i++;
  }
}
class j {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, i, r, a) {
    this.type = 2, this._$AH = c, this._$AN = void 0, this._$AA = e, this._$AB = i, this._$AM = r, this.options = a, this._$Cv = (a == null ? void 0 : a.isConnected) ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const i = this._$AM;
    return i !== void 0 && (e == null ? void 0 : e.nodeType) === 11 && (e = i.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, i = this) {
    e = L(this, e, i), I(e) ? e === c || e == null || e === "" ? (this._$AH !== c && this._$AR(), this._$AH = c) : e !== this._$AH && e !== N && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : it(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== c && I(this._$AH) ? this._$AA.nextSibling.data = e : this.T(A.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var s;
    const { values: i, _$litType$: r } = e, a = typeof r == "number" ? this._$AC(e) : (r.el === void 0 && (r.el = D.createElement(ze(r.h, r.h[0]), this.options)), r);
    if (((s = this._$AH) == null ? void 0 : s._$AD) === a) this._$AH.p(i);
    else {
      const o = new at(a, this), l = o.u(this.options);
      o.p(i), this.T(l), this._$AH = o;
    }
  }
  _$AC(e) {
    let i = Se.get(e.strings);
    return i === void 0 && Se.set(e.strings, i = new D(e)), i;
  }
  k(e) {
    re(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let r, a = 0;
    for (const s of e) a === i.length ? i.push(r = new j(this.O(z()), this.O(z()), this, this.options)) : r = i[a], r._$AI(s), a++;
    a < i.length && (this._$AR(r && r._$AB.nextSibling, a), i.length = a);
  }
  _$AR(e = this._$AA.nextSibling, i) {
    var r;
    for ((r = this._$AP) == null ? void 0 : r.call(this, !1, !0, i); e !== this._$AB; ) {
      const a = xe(e).nextSibling;
      xe(e).remove(), e = a;
    }
  }
  setConnected(e) {
    var i;
    this._$AM === void 0 && (this._$Cv = e, (i = this._$AP) == null || i.call(this, e));
  }
}
class G {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, i, r, a, s) {
    this.type = 1, this._$AH = c, this._$AN = void 0, this.element = e, this.name = i, this._$AM = a, this.options = s, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = c;
  }
  _$AI(e, i = this, r, a) {
    const s = this.strings;
    let o = !1;
    if (s === void 0) e = L(this, e, i, 0), o = !I(e) || e !== this._$AH && e !== N, o && (this._$AH = e);
    else {
      const l = e;
      let n, d;
      for (e = s[0], n = 0; n < s.length - 1; n++) d = L(this, l[r + n], i, n), d === N && (d = this._$AH[n]), o || (o = !I(d) || d !== this._$AH[n]), d === c ? e = c : e !== c && (e += (d ?? "") + s[n + 1]), this._$AH[n] = d;
    }
    o && !a && this.j(e);
  }
  j(e) {
    e === c ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class st extends G {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === c ? void 0 : e;
  }
}
class ot extends G {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== c);
  }
}
class nt extends G {
  constructor(e, i, r, a, s) {
    super(e, i, r, a, s), this.type = 5;
  }
  _$AI(e, i = this) {
    if ((e = L(this, e, i, 0) ?? c) === N) return;
    const r = this._$AH, a = e === c && r !== c || e.capture !== r.capture || e.once !== r.once || e.passive !== r.passive, s = e !== c && (r === c || a);
    a && this.element.removeEventListener(this.name, this, r), s && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var i;
    typeof this._$AH == "function" ? this._$AH.call(((i = this.options) == null ? void 0 : i.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class lt {
  constructor(e, i, r) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    L(this, e);
  }
}
const Z = V.litHtmlPolyfillSupport;
Z == null || Z(D, j), (V.litHtmlVersions ?? (V.litHtmlVersions = [])).push("3.3.3");
const ct = (t, e, i) => {
  const r = (i == null ? void 0 : i.renderBefore) ?? e;
  let a = r._$litPart$;
  if (a === void 0) {
    const s = (i == null ? void 0 : i.renderBefore) ?? null;
    r._$litPart$ = a = new j(e.insertBefore(z(), s), s, void 0, i ?? {});
  }
  return a._$AI(t), a;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const S = globalThis;
class O extends k {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var i;
    const e = super.createRenderRoot();
    return (i = this.renderOptions).renderBefore ?? (i.renderBefore = e.firstChild), e;
  }
  update(e) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = ct(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var e;
    super.connectedCallback(), (e = this._$Do) == null || e.setConnected(!0);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = this._$Do) == null || e.setConnected(!1);
  }
  render() {
    return N;
  }
}
var Ne;
O._$litElement$ = !0, O.finalized = !0, (Ne = S.litElementHydrateSupport) == null || Ne.call(S, { LitElement: O });
const J = S.litElementPolyfillSupport;
J == null || J({ LitElement: O });
(S.litElementVersions ?? (S.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ie = (t) => (e, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const dt = { attribute: !0, type: String, converter: W, reflect: !1, hasChanged: ie }, ht = (t = dt, e, i) => {
  const { kind: r, metadata: a } = i;
  let s = globalThis.litPropertyMetadata.get(a);
  if (s === void 0 && globalThis.litPropertyMetadata.set(a, s = /* @__PURE__ */ new Map()), r === "setter" && ((t = Object.create(t)).wrapped = !0), s.set(i.name, t), r === "accessor") {
    const { name: o } = i;
    return { set(l) {
      const n = e.get.call(this);
      e.set.call(this, l), this.requestUpdate(o, n, t, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(o, void 0, t, l), l;
    } };
  }
  if (r === "setter") {
    const { name: o } = i;
    return function(l) {
      const n = this[o];
      e.call(this, l), this.requestUpdate(o, n, t, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + r);
};
function ae(t) {
  return (e, i) => typeof i == "object" ? ht(t, e, i) : ((r, a, s) => {
    const o = a.hasOwnProperty(s);
    return a.constructor.createProperty(s, r), o ? Object.getOwnPropertyDescriptor(a, s) : void 0;
  })(t, e, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function se(t) {
  return ae({ ...t, state: !0, attribute: !1 });
}
var pt = Object.defineProperty, ut = Object.getOwnPropertyDescriptor, oe = (t, e, i, r) => {
  for (var a = r > 1 ? void 0 : r ? ut(e, i) : e, s = t.length - 1, o; s >= 0; s--)
    (o = t[s]) && (a = (r ? o(e, i, a) : o(a)) || a);
  return r && a && pt(e, i, a), a;
};
const ft = [
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
], mt = [
  { key: "outdoor_air", label: "Outdoor air color", fallback: "#63b489" },
  { key: "supply_air", label: "Supply air color", fallback: "#d99a45" },
  { key: "extract_air", label: "Extract air color", fallback: "#e5aa6f" },
  { key: "exhaust_air", label: "Exhaust air color", fallback: "#456f9f" }
], Ae = [
  { value: "rotary", label: "Rotary" },
  { value: "crossflow", label: "Crossflow" },
  { value: "none", label: "None" }
], Ce = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" }
], Me = [
  { value: "entity", label: "Entity" },
  { value: "calculated", label: "Calculated" }
], De = /* @__PURE__ */ new Set([
  "outdoor_temp",
  "supply_temp",
  "extract_temp",
  "exhaust_temp",
  "supply_fan",
  "extract_fan",
  "heat_exchanger_speed",
  "heater_output"
]), gt = De, yt = 900;
let U = class extends O {
  constructor() {
    super(...arguments), this.config = { type: "custom:ventilation-card" };
  }
  connectedCallback() {
    super.connectedCallback(), this.loadHomeAssistantElements();
  }
  setConfig(t) {
    this.config = {
      ...t,
      type: t.type || "custom:ventilation-card",
      exchanger_type: t.exchanger_type ?? "rotary"
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
    var e;
    if (customElements.get("ha-entity-picker"))
      return;
    const t = customElements.get("hui-entities-card");
    try {
      await ((e = t == null ? void 0 : t.getConfigElement) == null ? void 0 : e.call(t));
    } catch (i) {
      console.warn("Unable to preload ha-entity-picker", i);
    }
  }
  renderGeneralSection() {
    var t, e;
    return this.renderSection(
      "General",
      u`
        ${this.renderTextField("Name", this.config.name ?? "", (i) => this.updateRoot("name", i))}
        <ha-select
          name="exchanger_type"
          label="Exchanger type"
          .value=${this.config.exchanger_type ?? "rotary"}
          .options=${Ae}
          @selected=${(i) => this.updateExchangerType(this.eventValue(i))}
          @change=${(i) => this.updateExchangerType(this.eventValue(i))}
        >
          ${Ae.map((i) => u`<mwc-list-item .value=${i.value}>${i.label}</mwc-list-item>`)}
        </ha-select>
        <ha-select
          name="ahu_size"
          label="AHU size"
          .value=${((t = this.config.layout) == null ? void 0 : t.ahu_size) ?? "medium"}
          .options=${Ce}
          @selected=${(i) => this.updateAhuSize(this.eventValue(i))}
          @change=${(i) => this.updateAhuSize(this.eventValue(i))}
        >
          ${Ce.map((i) => u`<mwc-list-item .value=${i.value}>${i.label}</mwc-list-item>`)}
        </ha-select>
        ${this.renderNumberField(
        "Compact layout breakpoint",
        (e = this.config.layout) == null ? void 0 : e.compact_breakpoint,
        (i) => this.updateCompactBreakpoint(i),
        {
          min: 500,
          max: 1200,
          step: 10,
          placeholder: String(yt),
          suffix: "px",
          helperText: "Switch to compact layout below this card width in px."
        }
      )}
      `,
      !0
    );
  }
  renderAirflowColorsSection() {
    return this.renderSection(
      "Airflow colors",
      u`
        ${mt.map(
        (t) => {
          var e;
          return this.renderColorField(
            t.label,
            ((e = this.config.colors) == null ? void 0 : e[t.key]) ?? "",
            t.fallback,
            (i) => this.updateNestedString("colors", t.key, i)
          );
        }
      )}
      `
    );
  }
  renderComponentsSection() {
    return this.renderSection(
      "Sensors and components",
      u`${ft.map((t) => this.renderComponentPanel(t))}`
    );
  }
  renderComponentPanel(t) {
    var i, r, a, s;
    const e = (i = this.config.value_boxes) == null ? void 0 : i[t.key];
    return u`
      <details class="component-panel">
        <summary>
          <span>${t.title}</span>
          <small>${((r = this.config.entities) == null ? void 0 : r[t.key]) || "No entity"}</small>
        </summary>
        <div class="panel-fields">
          ${this.renderSwitchField("Show", ((a = this.config.visibility) == null ? void 0 : a[t.key]) !== !1, (o) => this.updateNestedBoolean("visibility", t.key, o))}
          <ha-entity-picker
            .hass=${this.hass}
            .value=${((s = this.config.entities) == null ? void 0 : s[t.key]) ?? ""}
            .label=${"Entity"}
            allow-custom-entity
            ?allow-custom-entity=${!0}
            @value-changed=${(o) => {
      o.stopPropagation(), this.updateNestedString("entities", t.key, o.detail.value ?? "");
    }}
          ></ha-entity-picker>
          ${t.key === "heat_exchanger_speed" ? this.renderEfficiencyFields() : c}
          ${this.renderLabelField(t.key, t.defaultLabel)}
          ${this.renderColorField(
      "Value box border color",
      (e == null ? void 0 : e.border_color) ?? "",
      "#9e9e9e",
      (o) => this.updateValueBox(t.key, "border_color", o)
    )}
          ${this.renderNumberField("Font size", e == null ? void 0 : e.font_size, (o) => this.updateValueBox(t.key, "font_size", o))}
          ${gt.has(t.key) ? this.renderPositionOffsetFields(t.key) : c}
          ${De.has(t.key) ? this.renderFormatFields(t.key) : c}
          ${this.renderComponentAnimationFields(t.key)}
        </div>
      </details>
    `;
  }
  renderComponentAnimationFields(t) {
    var s, o, l, n, d;
    if (t !== "supply_fan" && t !== "extract_fan" && t !== "heat_exchanger_speed")
      return c;
    const e = (s = this.config.component_settings) == null ? void 0 : s[t], i = t === "heat_exchanger_speed" ? ((o = this.config.animations) == null ? void 0 : o.rotor_enabled) !== !1 : ((l = this.config.animations) == null ? void 0 : l.fans_enabled) !== !1, r = t === "heat_exchanger_speed" ? (n = this.config.animations) == null ? void 0 : n.rotor_max_speed : (d = this.config.animations) == null ? void 0 : d.fan_max_speed, a = (e == null ? void 0 : e.animation_max_speed) ?? (e == null ? void 0 : e.animation_speed) ?? r ?? 100;
    return u`
      <div class="field-group">
        ${this.renderSwitchField(
      "Enable animation",
      (e == null ? void 0 : e.animation_enabled) ?? i,
      (p) => this.updateComponentSetting(t, "animation_enabled", p)
    )}
        ${this.renderAnimationSpeedField(t, this.clampNumber(a, 0, 100))}
      </div>
    `;
  }
  renderEfficiencyFields() {
    var a, s;
    const t = this.config.efficiency, e = (t == null ? void 0 : t.source) === "entity" ? "entity" : "calculated", i = (t == null ? void 0 : t.enabled) !== !1 && ((t == null ? void 0 : t.enabled) === !0 || (t == null ? void 0 : t.source) != null), r = (t == null ? void 0 : t.has_supply_temp_before_heater) === !0;
    return u`
      <div class="feature-fields">
        <h4>Heat exchanger efficiency</h4>
        ${this.renderSwitchField(
      "Show efficiency",
      i,
      (o) => this.updateEfficiency("enabled", o)
    )}
        <ha-select
          name="efficiency_source"
          label="Efficiency source"
          .value=${e}
          .options=${Me}
          @selected=${(o) => this.updateEfficiencySource(this.eventValue(o))}
          @change=${(o) => this.updateEfficiencySource(this.eventValue(o))}
        >
          ${Me.map((o) => u`<mwc-list-item .value=${o.value}>${o.label}</mwc-list-item>`)}
        </ha-select>
        ${e === "entity" ? u`
              <ha-entity-picker
                .hass=${this.hass}
                .value=${((a = this.config.entities) == null ? void 0 : a.heat_exchanger_efficiency) ?? ""}
                .label=${"Efficiency entity"}
                allow-custom-entity
                ?allow-custom-entity=${!0}
                @value-changed=${(o) => {
      o.stopPropagation(), this.updateNestedString("entities", "heat_exchanger_efficiency", o.detail.value ?? "");
    }}
              ></ha-entity-picker>
            ` : u`
              ${this.renderSwitchField(
      "Has supply temperature before heater",
      r,
      (o) => this.updateEfficiency("has_supply_temp_before_heater", o)
    )}
              ${r ? u`
                    <ha-entity-picker
                      .hass=${this.hass}
                      .value=${((s = this.config.entities) == null ? void 0 : s.supply_temp_before_heater) ?? ""}
                      .label=${"Supply temperature before heater"}
                      allow-custom-entity
                      ?allow-custom-entity=${!0}
                      @value-changed=${(o) => {
      o.stopPropagation(), this.updateNestedString("entities", "supply_temp_before_heater", o.detail.value ?? "");
    }}
                    ></ha-entity-picker>
                  ` : c}
            `}
        ${this.renderNumberField(
      "Efficiency decimals",
      t == null ? void 0 : t.decimals,
      (o) => this.updateEfficiency("decimals", o == null ? void 0 : Math.round(o)),
      { min: 0, max: 4, placeholder: "0" }
    )}
        <small class="feature-help">Efficiency is shown in the heat exchanger value box when enabled.</small>
      </div>
    `;
  }
  renderAnimationSpeedField(t, e) {
    const i = `animation-max-speed-${t}`;
    return u`
      <div class="animation-speed-field">
        <label for=${i}>Animation speed at 100%:</label>
        <div class="animation-speed-input-row">
          <input
            id=${i}
            type="number"
            min="0"
            max="100"
            step="1"
            .value=${String(e)}
            @input=${(r) => this.updateAnimationMaxSpeed(t, r.target.value)}
            @change=${(r) => this.updateAnimationMaxSpeed(t, r.target.value)}
          />
          <span aria-hidden="true">%</span>
        </div>
        <small>Percent of full animation speed.</small>
      </div>
    `;
  }
  renderFormatFields(t) {
    var i;
    const e = (i = this.config.format) == null ? void 0 : i[t];
    return u`
      <div class="field-group">
        ${this.renderNumberField(
      "Decimals",
      e == null ? void 0 : e.decimals,
      (r) => this.updateFormat(t, "decimals", r == null ? void 0 : Math.round(r)),
      { min: 0, max: 4, placeholder: "Default" }
    )}
        ${this.renderSwitchField("Show unit", (e == null ? void 0 : e.show_unit) !== !1, (r) => this.updateFormat(t, "show_unit", r))}
      </div>
    `;
  }
  renderPositionOffsetFields(t) {
    var i;
    const e = (i = this.config.position_offsets) == null ? void 0 : i[t];
    return u`
      <div class="field-group position-offset-fields">
        ${this.renderNumberField("Position X offset", this.positionOffsetValue(e == null ? void 0 : e.x), (r) => this.updatePositionOffset(t, "x", r), {
      min: -200,
      max: 200,
      step: 1,
      placeholder: "0"
    })}
        ${this.renderNumberField("Position Y offset", this.positionOffsetValue(e == null ? void 0 : e.y), (r) => this.updatePositionOffset(t, "y", r), {
      min: -200,
      max: 200,
      step: 1,
      placeholder: "0"
    })}
        <small class="position-offset-help">Fine-tunes this value box position relative to the default layout.</small>
      </div>
    `;
  }
  renderSection(t, e, i = !1) {
    return u`
      <details class="section" ?open=${i}>
        <summary class="section-summary">${t}</summary>
        <div class="fields">${e}</div>
      </details>
    `;
  }
  renderTextField(t, e, i, r = "") {
    return u`
      <ha-textfield
        .label=${t}
        .value=${e}
        .placeholder=${r}
        @value-changed=${(a) => i(a.detail.value ?? "")}
        @input=${(a) => i(a.target.value)}
        @change=${(a) => i(a.target.value)}
      ></ha-textfield>
    `;
  }
  renderLabelField(t, e) {
    var r;
    const i = ((r = this.config.labels) == null ? void 0 : r[t]) ?? "";
    return u`
      <div class="label-field">
        <label for=${`label-${t}`}>Label</label>
        <input
          id=${`label-${t}`}
          type="text"
          .value=${i}
          placeholder=${e}
          @input=${(a) => this.updateLabel(t, a.target.value)}
          @change=${(a) => this.updateLabel(t, a.target.value)}
        />
        <small>Default: ${e}</small>
      </div>
    `;
  }
  renderNumberField(t, e, i, r = {}) {
    return u`
      <div class=${r.helperText ? "number-field has-helper" : "number-field"}>
        <ha-textfield
          .label=${t}
          .value=${e == null ? "" : String(e)}
          type="number"
          min=${String(r.min ?? 8)}
          max=${String(r.max ?? 24)}
          step=${String(r.step ?? 1)}
          .placeholder=${r.placeholder ?? "12"}
          .suffix=${r.suffix ?? ""}
          @input=${(a) => {
      const s = a.target.value.trim();
      i(s ? Number(s) : void 0);
    }}
          @change=${(a) => {
      const s = a.target.value.trim();
      i(s ? Number(s) : void 0);
    }}
        ></ha-textfield>
        ${r.helperText ? u`<small>${r.helperText}</small>` : c}
      </div>
    `;
  }
  renderSwitchField(t, e, i) {
    return u`
      <label class="switch-row">
        <span>${t}</span>
        <ha-switch
          .checked=${e}
          @change=${(r) => i(r.target.checked)}
        ></ha-switch>
      </label>
    `;
  }
  renderColorField(t, e, i, r) {
    return u`
      <div class="color-row">
        <label class="color-field">
          <span>${t}</span>
          <ha-textfield
            .value=${e}
            placeholder="Default"
            @input=${(a) => r(a.target.value)}
            @change=${(a) => r(a.target.value)}
          ></ha-textfield>
        </label>
        <input
          type="color"
          aria-label=${t}
          .value=${this.colorInputValue(e, i)}
          @input=${(a) => r(a.target.value)}
        />
        <ha-button appearance="plain" @click=${() => r("")}>Clear</ha-button>
      </div>
    `;
  }
  colorInputValue(t, e) {
    return /^#[0-9a-f]{6}$/i.test(t) ? t : e;
  }
  positionOffsetValue(t) {
    if (typeof t == "number")
      return Number.isFinite(t) ? t : void 0;
    if (typeof t == "string" && t.trim().length > 0) {
      const e = Number(t);
      return Number.isFinite(e) ? e : void 0;
    }
  }
  eventValue(t) {
    var i, r;
    const e = (i = t.detail) == null ? void 0 : i.value;
    return e ?? (((r = t.target) == null ? void 0 : r.value) ?? "").trim();
  }
  updateRoot(t, e) {
    const i = this.cloneConfig();
    e.trim() ? i[t] = e : delete i[t], this.updateConfig(i);
  }
  updateExchangerType(t) {
    ["rotary", "crossflow", "none"].includes(t) && this.updateConfig({ ...this.cloneConfig(), exchanger_type: t });
  }
  updateAhuSize(t) {
    if (!["small", "medium", "large"].includes(t))
      return;
    const e = this.cloneConfig();
    e.layout = {
      ...e.layout ?? {},
      ahu_size: t
    }, this.updateConfig(e);
  }
  updateCompactBreakpoint(t) {
    const e = this.cloneConfig(), i = { ...e.layout ?? {} };
    t == null || !Number.isFinite(t) ? delete i.compact_breakpoint : i.compact_breakpoint = this.clampNumber(t, 500, 1200), Object.keys(i).length > 0 ? e.layout = i : delete e.layout, this.updateConfig(e);
  }
  updateEfficiency(t, e) {
    const i = this.cloneConfig(), r = { ...i.efficiency ?? {} };
    e == null || typeof e == "number" && !Number.isFinite(e) ? delete r[t] : (t === "enabled" || t === "has_supply_temp_before_heater") && typeof e == "boolean" ? r[t] = e : t === "decimals" && typeof e == "number" && (r.decimals = this.clampNumber(e, 0, 4)), Object.keys(r).length > 0 ? i.efficiency = r : delete i.efficiency, this.updateConfig(i);
  }
  updateEfficiencySource(t) {
    if (t !== "entity" && t !== "calculated")
      return;
    const e = this.cloneConfig();
    e.efficiency = {
      ...e.efficiency ?? {},
      source: t
    }, this.updateConfig(e);
  }
  updateLabel(t, e) {
    const i = this.cloneConfig(), r = { ...i.labels ?? {} };
    e.trim() ? r[t] = e : delete r[t], Object.keys(r).length > 0 ? i.labels = r : delete i.labels, this.updateConfig(i);
  }
  updateNestedString(t, e, i) {
    const r = this.cloneConfig(), a = { ...r[t] ?? {} };
    i.trim() ? a[e] = i : delete a[e], Object.keys(a).length > 0 ? r[t] = a : delete r[t], this.updateConfig(r);
  }
  updateValueBox(t, e, i) {
    const r = this.cloneConfig(), a = { ...r.value_boxes ?? {} }, s = { ...a[t] ?? {} };
    typeof i == "string" ? i.trim() ? this.setValueBoxField(s, e, i) : delete s[e] : i != null && Number.isFinite(i) ? this.setValueBoxField(s, e, i) : delete s[e], Object.keys(s).length > 0 ? a[t] = s : delete a[t], Object.keys(a).length > 0 ? r.value_boxes = a : delete r.value_boxes, this.updateConfig(r);
  }
  updatePositionOffset(t, e, i) {
    const r = this.cloneConfig(), a = { ...r.position_offsets ?? {} }, s = { ...a[t] ?? {} };
    i == null || !Number.isFinite(i) ? delete s[e] : s[e] = this.clampNumber(i, -200, 200), Object.keys(s).length > 0 ? a[t] = s : delete a[t], Object.keys(a).length > 0 ? r.position_offsets = a : delete r.position_offsets, this.updateConfig(r);
  }
  updateNestedBoolean(t, e, i) {
    const r = this.cloneConfig(), a = { ...r[t] ?? {} };
    a[e] = i, t === "visibility" ? r.visibility = a : r.animations = a, this.updateConfig(r);
  }
  updateNestedNumber(t, e, i, r, a) {
    const s = this.cloneConfig(), o = { ...s[t] ?? {} };
    i == null || !Number.isFinite(i) ? delete o[e] : o[e] = this.clampNumber(i, r, a), Object.keys(o).length > 0 ? s[t] = o : delete s[t], this.updateConfig(s);
  }
  updateFormat(t, e, i) {
    const r = this.cloneConfig(), a = { ...r.format ?? {} }, s = { ...a[t] ?? {} };
    i == null || typeof i == "number" && !Number.isFinite(i) ? delete s[e] : e === "decimals" && typeof i == "number" ? s.decimals = this.clampNumber(i, 0, 4) : e === "show_unit" && typeof i == "boolean" && (s.show_unit = i), Object.keys(s).length > 0 ? a[t] = s : delete a[t], Object.keys(a).length > 0 ? r.format = a : delete r.format, this.updateConfig(r);
  }
  updateComponentSetting(t, e, i) {
    const r = this.cloneConfig(), a = { ...r.component_settings ?? {} }, s = { ...a[t] ?? {} };
    i == null || typeof i == "number" && !Number.isFinite(i) ? delete s[e] : e === "animation_enabled" && typeof i == "boolean" ? s.animation_enabled = i : e === "animation_max_speed" && typeof i == "number" ? (s.animation_max_speed = this.clampNumber(i, 0, 100), delete s.animation_speed) : e === "animation_speed" && typeof i == "number" && (s.animation_speed = this.clampNumber(i, 10, 150)), Object.keys(s).length > 0 ? a[t] = s : delete a[t], Object.keys(a).length > 0 ? r.component_settings = a : delete r.component_settings, this.updateConfig(r);
  }
  updateAnimationMaxSpeed(t, e) {
    const i = e.trim() === "" ? void 0 : Number(e);
    this.updateComponentSetting(t, "animation_max_speed", i);
  }
  setValueBoxField(t, e, i) {
    e === "border_color" && typeof i == "string" && (t.border_color = i), e === "font_size" && typeof i == "number" && (t.font_size = i);
  }
  cloneConfig() {
    const t = {
      ...this.config
    };
    return this.config.entities && (t.entities = { ...this.config.entities }), this.config.labels && (t.labels = { ...this.config.labels }), this.config.colors && (t.colors = { ...this.config.colors }), this.config.value_box && (t.value_box = { ...this.config.value_box }), this.config.value_boxes && (t.value_boxes = Object.fromEntries(
      Object.entries(this.config.value_boxes ?? {}).map(([e, i]) => [e, { ...i ?? {} }])
    )), this.config.position_offsets && (t.position_offsets = Object.fromEntries(
      Object.entries(this.config.position_offsets ?? {}).map(([e, i]) => [e, { ...i ?? {} }])
    )), this.config.visibility && (t.visibility = { ...this.config.visibility }), this.config.animations && (t.animations = { ...this.config.animations }), this.config.component_settings && (t.component_settings = Object.fromEntries(
      Object.entries(this.config.component_settings ?? {}).map(([e, i]) => [e, { ...i ?? {} }])
    )), this.config.layout && (t.layout = { ...this.config.layout }), this.config.format && (t.format = Object.fromEntries(
      Object.entries(this.config.format ?? {}).map(([e, i]) => [e, { ...i ?? {} }])
    )), this.config.efficiency && (t.efficiency = { ...this.config.efficiency }), t;
  }
  clampNumber(t, e, i) {
    return Number.isFinite(t) ? Math.min(Math.max(t, e), i) : e;
  }
  updateConfig(t) {
    this.config = t, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: t },
        bubbles: !0,
        composed: !0
      })
    );
  }
};
U.styles = Fe`
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

    .position-offset-fields {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .position-offset-help {
      grid-column: 1 / -1;
      color: var(--secondary-text-color);
      font-size: 12px;
      line-height: 1.25;
    }

    .feature-fields {
      display: grid;
      gap: 10px;
      padding: 10px;
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.2));
      border-radius: 8px;
    }

    .feature-fields h4 {
      margin: 0;
      color: var(--primary-text-color);
      font-size: 14px;
      font-weight: 600;
    }

    .feature-help {
      color: var(--secondary-text-color);
      font-size: 12px;
      line-height: 1.25;
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
oe([
  ae({ attribute: !1 })
], U.prototype, "hass", 2);
oe([
  se()
], U.prototype, "config", 2);
U = oe([
  Ie("ventilation-card-editor")
], U);
var bt = Object.defineProperty, xt = Object.getOwnPropertyDescriptor, X = (t, e, i, r) => {
  for (var a = r > 1 ? void 0 : r ? xt(e, i) : e, s = t.length - 1, o; s >= 0; s--)
    (o = t[s]) && (a = (r ? o(e, i, a) : o(a)) || a);
  return r && a && bt(e, i, a), a;
};
const P = /* @__PURE__ */ new Set(["unknown", "unavailable", "none", ""]), R = 920, _t = 360, vt = 650, $t = 900, ke = 0, wt = 0, Et = 100, St = 1e-3, Q = 8, Oe = 14, At = {
  small: 0.75,
  medium: 1,
  large: 1.25
}, y = {
  exhaust_temp: { x: 20, y: 120 },
  extract_temp: { x: 900, y: 120 },
  outdoor_temp: { x: 20, y: 240 },
  supply_temp: { x: 900, y: 240 },
  extract_fan: { x: 260, y: 120 },
  supply_fan: { x: 660, y: 240 },
  heat_exchanger_speed: { x: 460, y: 180 },
  heater_output: { x: 734, y: 240 }
}, Ct = {
  exhaust_temp: { offset: { x: 8, y: -64 }, align: "left" },
  extract_temp: { offset: { x: -8, y: -64 }, align: "right" },
  outdoor_temp: { offset: { x: 8, y: 18 }, align: "left" },
  supply_temp: { offset: { x: -8, y: 18 }, align: "right" },
  extract_fan: { offset: { x: 0, y: -78 }, align: "center" },
  supply_fan: { offset: { x: 0, y: 34 }, align: "center" },
  heat_exchanger_speed: { offset: { x: 0, y: 92 }, align: "center" },
  heater_output: { offset: { x: -22, y: -68 }, align: "right" }
}, Mt = {
  exhaust_temp: { offset: { x: 12, y: -280 }, align: "left" },
  extract_temp: { offset: { x: -12, y: -280 }, align: "right" },
  outdoor_temp: { offset: { x: 12, y: 190 }, align: "left" },
  supply_temp: { offset: { x: -12, y: 190 }, align: "right" },
  extract_fan: { offset: { x: 0, y: -195 }, align: "center" },
  supply_fan: { offset: { x: 0, y: 25 }, align: "center" },
  heat_exchanger_speed: { offset: { x: 0, y: 155 }, align: "center" },
  heater_output: { offset: { x: -26, y: -315 }, align: "right" }
}, kt = {
  heat_exchanger_speed: { x: -3, y: 0 },
  heater_output: { x: 65, y: -13 },
  supply_fan: { x: -10, y: 3 },
  extract_fan: { x: 10, y: -5 },
  supply_temp: { x: 18, y: 0 },
  extract_temp: { x: 18, y: 0 }
}, Ot = {
  heat_exchanger_speed: { x: -50, y: -80 },
  heater_output: { x: 65, y: 80 },
  supply_fan: { x: -10, y: 3 },
  extract_fan: { x: 10, y: 80 },
  exhaust_temp: { x: 0, y: 55 },
  supply_temp: { x: 18, y: -55 },
  extract_temp: { x: 18, y: 55 },
  outdoor_temp: { x: 0, y: -180 }
}, Nt = {
  outdoor_temp: "Outdoor air temperature",
  supply_temp: "Supply air temperature",
  extract_temp: "Extract air temperature",
  exhaust_temp: "Exhaust air temperature",
  supply_fan: "Supply fan",
  extract_fan: "Extract fan",
  heat_exchanger_speed: "Heat exchanger",
  heat_exchanger_efficiency: "Heat exchanger efficiency",
  heater_output: "Heater output",
  supply_temp_before_heater: "Supply temperature before heater",
  filter_alarm: "Filter alarm",
  alarm: "Alarm",
  mode: "Mode"
};
let F = class extends O {
  constructor() {
    super(...arguments), this.narrowLayout = !1;
  }
  setConfig(t) {
    if (!t)
      throw new Error("Invalid ventilation-card configuration");
    this.config = {
      name: "Ventilation",
      exchanger_type: "rotary",
      show_airflow: !0,
      entities: {},
      ...t
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
  connectedCallback() {
    super.connectedCallback(), this.hasUpdated && this.requestUpdate();
  }
  updated() {
    if (!this.resizeObserver) {
      this.observeCardWidth();
      return;
    }
    const t = this.renderRoot.querySelector(".card");
    t instanceof HTMLElement && this.updateResponsiveLayout(t.getBoundingClientRect().width);
  }
  disconnectedCallback() {
    var t;
    (t = this.resizeObserver) == null || t.disconnect(), this.resizeObserver = void 0, super.disconnectedCallback();
  }
  render() {
    const t = this.config;
    if (!t)
      return c;
    const e = ["mode", "filter_alarm", "alarm"].filter((i) => this.isVisible(i));
    return u`
      <ha-card>
        <div class="card ${this.narrowLayout ? "layout-narrow" : "layout-wide"}">
          <header class="header">
            <h2>${t.name ?? "Ventilation"}</h2>
          </header>

          <div class="schematic" style=${this.schematicStyle()} aria-label="Ventilation unit schematic">
            ${this.renderSchematic()}
          </div>

          ${e.length > 0 ? u`<footer class="status-strip">${e.map((i) => this.renderStatusItem(i))}</footer>` : c}
        </div>
      </ha-card>
    `;
  }
  observeCardWidth() {
    var e;
    const t = this.renderRoot.querySelector(".card");
    !(t instanceof HTMLElement) || typeof ResizeObserver > "u" || ((e = this.resizeObserver) == null || e.disconnect(), this.resizeObserver = new ResizeObserver(([i]) => {
      i && this.updateResponsiveLayout(i.contentRect.width);
    }), this.resizeObserver.observe(t), this.updateResponsiveLayout(t.getBoundingClientRect().width));
  }
  updateResponsiveLayout(t) {
    const e = t < this.compactLayoutBreakpoint();
    this.narrowLayout !== e && (this.narrowLayout = e);
  }
  schematicStyle() {
    var r, a;
    const t = (r = this.config) == null ? void 0 : r.colors, e = (a = this.config) == null ? void 0 : a.value_box;
    return [
      ["--vc-air-outdoor", t == null ? void 0 : t.outdoor_air],
      ["--vc-air-supply", t == null ? void 0 : t.supply_air],
      ["--vc-air-extract", t == null ? void 0 : t.extract_air],
      ["--vc-air-exhaust", t == null ? void 0 : t.exhaust_air],
      ["--vc-value-box-border-color", e == null ? void 0 : e.border_color],
      ["--vc-value-box-background-color", e == null ? void 0 : e.background_color]
    ].filter(([, s]) => s && s.trim().length > 0).map(([s, o]) => `${s}: ${o};`).join(" ");
  }
  renderSchematic() {
    var he, pe, ue, fe;
    const t = this.entityDisplay("outdoor_temp"), e = this.entityDisplay("supply_temp"), i = this.entityDisplay("extract_temp"), r = this.entityDisplay("exhaust_temp"), a = this.entityDisplay("supply_fan"), s = this.entityDisplay("extract_fan"), o = this.entityDisplay("heat_exchanger_speed"), l = this.entityDisplay("heater_output"), n = this.isEfficiencyVisible() ? this.heatExchangerEfficiencyValue() : void 0, d = this.entityNumericValue("supply_fan"), p = this.entityNumericValue("extract_fan"), h = this.entityNumericValue("heater_output"), f = this.entityNumericValue("heat_exchanger_speed"), m = ((he = this.config) == null ? void 0 : he.show_airflow) !== !1 && this.animationEnabled("enabled") && this.animationEnabled("airflow_enabled"), g = ((ue = (pe = this.config) == null ? void 0 : pe.animations) == null ? void 0 : ue.stop_when_zero) !== !1, b = this.componentAnimationSpeed("supply_fan", "fan_max_speed"), x = this.componentAnimationSpeed("extract_fan", "fan_max_speed"), ne = this.componentAnimationSpeed("heat_exchanger_speed", "rotor_max_speed"), $ = m && (d > 0 || !g), C = m && (p > 0 || !g), Ue = this.animationEnabled("enabled") && this.componentAnimationEnabled("supply_fan", "fans_enabled") && b > 0 && (d > 0 || !g), je = this.animationEnabled("enabled") && this.componentAnimationEnabled("extract_fan", "fans_enabled") && x > 0 && (p > 0 || !g), Re = this.animationEnabled("enabled") && this.componentAnimationEnabled("heat_exchanger_speed", "rotor_enabled") && ne > 0 && (f > 0 || !g), Be = this.getAnimationDurationFromValue(d, 0.8, 4.8, this.animationMaxSpeed("airflow_max_speed")), We = this.getAnimationDurationFromValue(p, 0.8, 4.8, this.animationMaxSpeed("airflow_max_speed")), le = this.getAnimationDurationFromValue(d, 1.45, 4.2, b), ce = this.getAnimationDurationFromValue(p, 1.45, 4.2, x), de = this.getAnimationDurationFromValue(f, 3.2, 14, ne);
    return u`
      <svg
        viewBox=${`0 0 ${R} ${this.schematicViewBoxHeight()}`}
        role="img"
        style="--supply-fan-duration: ${le}; --extract-fan-duration: ${ce}; --rotor-duration: ${de}; --supply-airflow-duration: ${Be}; --extract-airflow-duration: ${We};"
      >
        <defs>
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

        <g class="ahu-graphic" transform=${this.ahuTransform()}>
        <line x1="140" y1="180" x2="780" y2="180" class="unit-divider"></line>
        <line x1="460" y1="54" x2="460" y2="300" class="unit-divider muted"></line>

        <path d="M780 120 H900" class="duct-outline"></path>
        <path d="M140 120 H20" class="duct-outline"></path>
        <path d="M20 240 H140" class="duct-outline"></path>
        <path d="M780 240 H900" class="duct-outline"></path>
        <path d="M140 120 H780" class="internal-duct-outline"></path>
        <path d="M140 240 H780" class="internal-duct-outline"></path>

        <path d="M780 120 H900" class="duct-fill extract"></path>
        <path d="M886 120 H794" class="flow-line extract extract-air ${C ? "flow" : ""}"></path>
        <path d="M140 120 H20" class="duct-fill exhaust"></path>
        <path d="M126 120 H34" class="flow-line exhaust extract-air ${C ? "flow" : ""}"></path>
        <path d="M20 240 H140" class="duct-fill outdoor"></path>
        <path d="M34 240 H126" class="flow-line outdoor supply-air ${$ ? "flow" : ""}"></path>
        <path d="M780 240 H900" class="duct-fill supply"></path>
        <path d="M794 240 H886" class="flow-line supply supply-air ${$ ? "flow" : ""}"></path>

        <path d="M28 120 L40 113 L40 127 Z" class="outer-arrow exhaust"></path>
        <path d="M876 120 L888 113 L888 127 Z" class="outer-arrow extract"></path>
        <path d="M42 240 L30 233 L30 247 Z" class="outer-arrow outdoor"></path>
        <path d="M892 240 L880 233 L880 247 Z" class="outer-arrow supply"></path>

        <path d="M150 240 H194" class="internal-flow-line outdoor supply-air ${$ ? "flow" : ""}"></path>
        <path d="M246 240 H388" class="internal-flow-line outdoor supply-air ${$ ? "flow" : ""}"></path>
        <path d="M532 240 H624" class="internal-flow-line supply supply-air ${$ ? "flow" : ""}"></path>
        <path d="M696 240 H712" class="internal-flow-line supply supply-air ${$ ? "flow" : ""}"></path>
        <path d="M756 240 H770" class="internal-flow-line supply supply-air ${$ ? "flow" : ""}"></path>
        <path d="M770 120 H728" class="internal-flow-line extract extract-air ${C ? "flow" : ""}"></path>
        <path d="M676 120 H532" class="internal-flow-line extract extract-air ${C ? "flow" : ""}"></path>
        <path d="M388 120 H294" class="internal-flow-line exhaust extract-air ${C ? "flow" : ""}"></path>
        <path d="M226 120 H150" class="internal-flow-line exhaust extract-air ${C ? "flow" : ""}"></path>

        ${this.renderFilter(220, 240)}
        ${this.renderFilter(702, 120)}
        ${this.isVisible("heat_exchanger_speed") ? this.renderHeatExchanger(
      y.heat_exchanger_speed.x,
      y.heat_exchanger_speed.y,
      Re,
      de,
      ((fe = this.config) == null ? void 0 : fe.exchanger_type) ?? "rotary"
    ) : c}
        ${this.isVisible("extract_fan") ? this.renderFan(y.extract_fan.x, y.extract_fan.y, je, ce, "extract") : c}
        ${this.isVisible("supply_fan") ? this.renderFan(y.supply_fan.x, y.supply_fan.y, Ue, le, "supply") : c}
        ${this.isVisible("heater_output") ? this.renderHeaterCoil(y.heater_output.x, y.heater_output.y, h) : c}
        </g>
      </svg>
      <div class="badge-overlay">
          ${this.isVisible("exhaust_temp") ? this.renderValueLabel("exhaust_temp", r.label, r.value, "exhaust") : c}
          ${this.isVisible("extract_temp") ? this.renderValueLabel("extract_temp", i.label, i.value, "extract") : c}
          ${this.isVisible("outdoor_temp") ? this.renderValueLabel("outdoor_temp", t.label, t.value, "outdoor") : c}
          ${this.isVisible("supply_temp") ? this.renderValueLabel("supply_temp", e.label, e.value, "supply") : c}
          ${this.isVisible("extract_fan") ? this.renderValueLabel("extract_fan", s.label, s.value, "component") : c}
          ${this.isVisible("supply_fan") ? this.renderValueLabel("supply_fan", a.label, a.value, "component") : c}
          ${this.isVisible("heat_exchanger_speed") ? this.renderHeatExchangerValueLabel(o.label, o.value, n) : c}
          ${this.isVisible("heater_output") ? this.renderValueLabel("heater_output", l.label, l.value, h > 0 ? "heater-active" : "neutral") : c}
      </div>
    `;
  }
  renderFan(t, e, i, r, a) {
    return M`
      <g class="fan-symbol ${a}" transform="translate(${t} ${e})" style="--fan-duration: ${r};">
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
  renderHeatExchanger(t, e, i, r, a) {
    return a === "none" ? c : a === "crossflow" ? M`<g class="heat-exchanger crossflow" transform="translate(${t} ${e})" style="--rotor-duration: ${r};">
        <rect class="crossflow-box" x="-54" y="-54" width="108" height="108" rx="8"></rect>
        <path d="M-44 -42 L42 44"></path>
        <path d="M-42 44 L44 -42"></path>
      </g>` : M`
      <g class="heat-exchanger" transform="translate(${t} ${e})" style="--rotor-duration: ${r};">
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
  renderHeaterCoil(t, e, i) {
    return M`
      <g class="heater-coil ${i > 0 ? "active" : ""}" transform="translate(${t} ${e})">
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
  renderFilter(t, e) {
    return M`
      <g class="filter-symbol" transform="translate(${t} ${e})">
        <rect x="-18" y="-24" width="36" height="48" rx="4"></rect>
        <path d="M-11 -18 L11 18"></path>
        <path d="M-3 -18 L18 16"></path>
        <path d="M-18 -12 L3 22"></path>
      </g>
    `;
  }
  renderDamper(t, e) {
    return M`
      <g class="damper-symbol" transform="translate(${t} ${e})">
        <rect x="-19" y="-12" width="38" height="24" rx="3"></rect>
        <path d="M-13 8 L13 -8"></path>
        <circle r="2.5"></circle>
      </g>
    `;
  }
  renderValueLabel(t, e, i, r = "neutral") {
    var d, p;
    const a = (p = (d = this.config) == null ? void 0 : d.value_boxes) == null ? void 0 : p[t], s = this.getEntityId(t), o = this.badgePosition(t), l = this.clampNumber((a == null ? void 0 : a.font_size) ?? Oe, 8, 24), n = [
      `left: ${o.x / R * 100}%;`,
      `top: ${o.y / this.schematicViewBoxHeight() * 100}%;`,
      a != null && a.border_color ? `--vc-badge-border-color: ${a.border_color};` : "",
      `--vc-badge-font-size: ${l}px;`
    ].join(" ");
    return u`
      <div
        class="value-badge badge-${t} ${r} align-${o.align} ${s ? "interactive" : ""}"
        style=${n}
        role=${s ? "button" : c}
        tabindex=${s ? "0" : c}
        aria-label=${s ? `${e}: ${i}. Open details.` : c}
        @click=${s ? () => this.openMoreInfo(t) : c}
        @keydown=${s ? (h) => this.handleMoreInfoKeydown(h, t) : c}
      >
        <span class="badge-label">${e}</span>
        <strong class="badge-value">${i}</strong>
      </div>
    `;
  }
  renderHeatExchangerValueLabel(t, e, i) {
    var p, h;
    const r = "heat_exchanger_speed", a = (h = (p = this.config) == null ? void 0 : p.value_boxes) == null ? void 0 : h[r], s = this.getEntityId(r), o = this.badgePosition(r), l = this.clampNumber((a == null ? void 0 : a.font_size) ?? Oe, 8, 24), n = i == null ? `Speed: ${e}` : `Speed: ${e}. Efficiency: ${i}`, d = [
      `left: ${o.x / R * 100}%;`,
      `top: ${o.y / this.schematicViewBoxHeight() * 100}%;`,
      a != null && a.border_color ? `--vc-badge-border-color: ${a.border_color};` : "",
      `--vc-badge-font-size: ${l}px;`
    ].join(" ");
    return u`
      <div
        class="value-badge badge-${r} component align-${o.align} ${s ? "interactive" : ""}"
        style=${d}
        role=${s ? "button" : c}
        tabindex=${s ? "0" : c}
        aria-label=${s ? `${t}. ${n}. Open details.` : c}
        @click=${s ? () => this.openMoreInfo(r) : c}
        @keydown=${s ? (f) => this.handleMoreInfoKeydown(f, r) : c}
      >
        <span class="badge-label">${t}</span>
        <span class="badge-metric"><span>Speed:</span><strong>${e}</strong></span>
        ${i == null ? c : u`<span class="badge-metric"><span>Efficiency:</span><strong>${i}</strong></span>`}
      </div>
    `;
  }
  renderStatusItem(t) {
    var s, o, l;
    const e = this.entityDisplay(t), i = (o = (s = this.config) == null ? void 0 : s.value_boxes) == null ? void 0 : o[t], r = this.getEntityId(t), a = [
      i != null && i.border_color ? `--vc-status-border-color: ${i.border_color};` : "",
      i != null && i.font_size ? `--vc-status-font-size: ${i.font_size}px;` : ""
    ].join(" ");
    return t === "mode" && this.modeOptions().length > 0 ? u`
        <div class="status-item mode-select ${e.tone ?? "normal"}" style=${a}>
          <span>${e.label}</span>
          <select
            aria-label=${e.label}
            .value=${((l = this.getEntityState("mode")) == null ? void 0 : l.state) ?? ""}
            @change=${(n) => this.selectMode(n.target.value)}
          >
            ${this.modeOptions().map((n) => u`<option .value=${n}>${n}</option>`)}
          </select>
        </div>
      ` : u`
      <div
        class="status-item ${e.tone ?? "normal"} ${r ? "interactive" : ""}"
        style=${a}
        role=${r ? "button" : c}
        tabindex=${r ? "0" : c}
        @click=${r ? () => this.openMoreInfo(t) : c}
        @keydown=${r ? (n) => this.handleMoreInfoKeydown(n, t) : c}
      >
        <span>${e.label}</span>
        <strong>${e.value}</strong>
      </div>
    `;
  }
  entityDisplay(t) {
    const e = this.getEntityState(t), i = this.getEntityValue(t), r = this.entityTone(e);
    return {
      label: this.getLabel(t),
      value: i,
      tone: r
    };
  }
  getEntityId(t) {
    var a, s;
    const e = (s = (a = this.config) == null ? void 0 : a.entities) == null ? void 0 : s[t], i = typeof e == "string" ? e : typeof e == "object" && e !== null && "entity" in e ? e.entity : void 0;
    return typeof i != "string" ? void 0 : i.trim() || void 0;
  }
  getEntityState(t) {
    var i;
    const e = this.getEntityId(t);
    if (!(!e || !((i = this.hass) != null && i.states)))
      return this.hass.states[e];
  }
  openMoreInfo(t) {
    const e = this.getEntityId(t);
    e && this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: e },
        bubbles: !0,
        composed: !0
      })
    );
  }
  handleMoreInfoKeydown(t, e) {
    t.key !== "Enter" && t.key !== " " || (t.preventDefault(), this.openMoreInfo(e));
  }
  modeOptions() {
    var i;
    const t = this.getEntityId("mode"), e = (i = this.getEntityState("mode")) == null ? void 0 : i.attributes.options;
    return !(t != null && t.startsWith("input_select.")) || !Array.isArray(e) ? [] : e.filter((r) => typeof r == "string");
  }
  selectMode(t) {
    var i, r;
    const e = this.getEntityId("mode");
    !(e != null && e.startsWith("input_select.")) || !this.modeOptions().includes(t) || (r = (i = this.hass) == null ? void 0 : i.callService) == null || r.call(i, "input_select", "select_option", {
      entity_id: e,
      option: t
    });
  }
  getEntityValue(t) {
    return this.formatEntityValue(t, this.getEntityState(t));
  }
  getLabel(t) {
    var e, i;
    return ((i = (e = this.config) == null ? void 0 : e.labels) == null ? void 0 : i[t]) ?? Nt[t];
  }
  formatEntityValue(t, e) {
    var l, n;
    if (!e || P.has(String(e.state).toLowerCase()))
      return "—";
    const i = (n = (l = this.config) == null ? void 0 : l.format) == null ? void 0 : n[t], r = Number.parseFloat(String(e.state).replace(",", ".")), a = e.attributes.unit_of_measurement, s = (i == null ? void 0 : i.decimals) ?? (a === "%" ? 0 : void 0), o = s != null && Number.isFinite(r) ? r.toFixed(Math.round(this.clampNumber(s, 0, 4))) : e.state;
    return a && (i == null ? void 0 : i.show_unit) !== !1 ? `${o} ${a}` : String(o);
  }
  entityTone(t) {
    if (!t || P.has(String(t.state).toLowerCase()))
      return "normal";
    const e = String(t.state).toLowerCase();
    return ["on", "problem", "detected", "active", "true"].includes(e) ? "danger" : ["warning", "pending"].includes(e) ? "warning" : "normal";
  }
  entityNumericValue(t) {
    const e = this.getEntityState(t);
    if (!e || P.has(String(e.state).toLowerCase()))
      return 0;
    const i = Number.parseFloat(String(e.state).replace(",", "."));
    return Number.isFinite(i) ? Math.max(0, i) : ["on", "running", "active", "true"].includes(String(e.state).toLowerCase()) ? 100 : 0;
  }
  numericEntityState(t) {
    const e = this.getEntityState(t);
    if (!e || P.has(String(e.state).trim().toLowerCase()))
      return;
    const i = Number.parseFloat(String(e.state).trim().replace(",", "."));
    return Number.isFinite(i) ? i : void 0;
  }
  heatExchangerEfficiencyValue() {
    var r, a, s, o, l;
    if (this.efficiencySource() === "entity")
      return this.formatEfficiencyEntityValue();
    const t = this.heatExchangerEfficiency();
    if (t == null)
      return "—";
    const e = ((a = (r = this.config) == null ? void 0 : r.efficiency) == null ? void 0 : a.decimals) ?? ((l = (o = (s = this.config) == null ? void 0 : s.format) == null ? void 0 : o.heat_exchanger_speed) == null ? void 0 : l.decimals), i = Math.round(this.clampNumber(e ?? ke, 0, 4));
    return `${t.toFixed(i)} %`;
  }
  formatEfficiencyEntityValue() {
    var o, l, n, d, p, h, f, m;
    const t = this.getEntityState("heat_exchanger_efficiency");
    if (!t || P.has(String(t.state).trim().toLowerCase()))
      return "—";
    const e = Number.parseFloat(String(t.state).trim().replace(",", "."));
    if (!Number.isFinite(e))
      return "—";
    const i = t.attributes.unit_of_measurement, r = ((l = (o = this.config) == null ? void 0 : o.efficiency) == null ? void 0 : l.decimals) ?? ((p = (d = (n = this.config) == null ? void 0 : n.format) == null ? void 0 : d.heat_exchanger_efficiency) == null ? void 0 : p.decimals), a = Math.round(this.clampNumber(r ?? (i === "%" ? 0 : ke), 0, 4)), s = e.toFixed(a);
    return i && ((m = (f = (h = this.config) == null ? void 0 : h.format) == null ? void 0 : f.heat_exchanger_efficiency) == null ? void 0 : m.show_unit) !== !1 ? `${s} ${i}` : s;
  }
  isEfficiencyVisible() {
    var e;
    const t = (e = this.config) == null ? void 0 : e.efficiency;
    return !t || t.enabled === !1 ? !1 : t.enabled === !0 || t.source === "entity" || t.source === "calculated";
  }
  efficiencySource() {
    var t, e;
    return ((e = (t = this.config) == null ? void 0 : t.efficiency) == null ? void 0 : e.source) === "entity" ? "entity" : "calculated";
  }
  heatExchangerEfficiency() {
    var d, p, h, f, m, g;
    const t = this.numericEntityState("outdoor_temp"), e = this.numericEntityState("extract_temp");
    if (t == null || e == null)
      return;
    const i = e - t;
    if (Math.abs(i) < St)
      return;
    let r;
    if (((p = (d = this.config) == null ? void 0 : d.efficiency) == null ? void 0 : p.has_supply_temp_before_heater) === !0) {
      const b = this.numericEntityState("supply_temp_before_heater");
      b != null && (r = b - t);
    }
    if (r == null) {
      const b = this.numericEntityState("heater_output");
      if (b == null)
        return;
      if (b < 1) {
        const x = this.numericEntityState("supply_temp");
        if (x == null)
          return;
        r = x - t;
      } else {
        const x = this.numericEntityState("exhaust_temp");
        if (x == null)
          return;
        r = e - x;
      }
    }
    const a = r / i * 100;
    if (!Number.isFinite(a))
      return;
    const s = (f = (h = this.config) == null ? void 0 : h.efficiency) == null ? void 0 : f.clamp_min, o = (g = (m = this.config) == null ? void 0 : m.efficiency) == null ? void 0 : g.clamp_max, l = Number.isFinite(s) ? s : wt, n = Number.isFinite(o) ? o : Et;
    return this.clampNumber(a, Math.min(l, n), Math.max(l, n));
  }
  getAnimationDurationFromValue(t, e, i, r = 100) {
    if (t <= 0)
      return `${i.toFixed(1)}s`;
    const a = this.clampNumber(t, 1, 100), s = this.clampNumber(r, 0, 100) / 100;
    if (s <= 0)
      return `${i.toFixed(1)}s`;
    const o = i - a * s / 100 * (i - e);
    return `${Math.max(0.2, o).toFixed(1)}s`;
  }
  isVisible(t) {
    var e, i;
    return ((i = (e = this.config) == null ? void 0 : e.visibility) == null ? void 0 : i[t]) !== !1;
  }
  animationEnabled(t) {
    var e, i;
    return ((i = (e = this.config) == null ? void 0 : e.animations) == null ? void 0 : i[t]) !== !1;
  }
  animationMaxSpeed(t) {
    var e, i;
    return this.clampNumber(((i = (e = this.config) == null ? void 0 : e.animations) == null ? void 0 : i[t]) ?? 100, 10, 150);
  }
  componentAnimationEnabled(t, e) {
    var i, r, a;
    return ((a = (r = (i = this.config) == null ? void 0 : i.component_settings) == null ? void 0 : r[t]) == null ? void 0 : a.animation_enabled) ?? this.animationEnabled(e);
  }
  componentAnimationSpeed(t, e) {
    var r, a;
    const i = (a = (r = this.config) == null ? void 0 : r.component_settings) == null ? void 0 : a[t];
    return this.clampNumber((i == null ? void 0 : i.animation_max_speed) ?? (i == null ? void 0 : i.animation_speed) ?? this.animationMaxSpeed(e), 0, 100);
  }
  ahuTransform() {
    const t = this.ahuScale();
    return `translate(0 ${this.schematicYOffset()}) translate(460 180) scale(${t}) translate(-460 -180)`;
  }
  badgePosition(t) {
    var s, o;
    const e = this.scaledAnchor(y[t]), i = (this.narrowLayout ? Mt : Ct)[t], r = (this.narrowLayout ? Ot : kt)[t], a = (o = (s = this.config) == null ? void 0 : s.position_offsets) == null ? void 0 : o[t];
    return {
      x: this.clampNumber(
        e.x + i.offset.x + ((r == null ? void 0 : r.x) ?? 0) + this.positionOffsetValue(a == null ? void 0 : a.x),
        Q,
        R - Q
      ),
      y: Math.max(Q, e.y + i.offset.y + ((r == null ? void 0 : r.y) ?? 0) + this.positionOffsetValue(a == null ? void 0 : a.y)),
      align: i.align
    };
  }
  scaledAnchor(t) {
    const e = this.ahuScale();
    return {
      x: 460 + (t.x - 460) * e,
      y: this.schematicYOffset() + 180 + (t.y - 180) * e
    };
  }
  schematicViewBoxHeight() {
    return this.narrowLayout ? vt : _t;
  }
  schematicYOffset() {
    return this.narrowLayout ? 170 : 0;
  }
  ahuScale() {
    var i, r;
    const t = (r = (i = this.config) == null ? void 0 : i.layout) == null ? void 0 : r.ahu_size;
    return At[t === "small" || t === "large" ? t : "medium"];
  }
  compactLayoutBreakpoint() {
    var t, e;
    return this.clampNumber(((e = (t = this.config) == null ? void 0 : t.layout) == null ? void 0 : e.compact_breakpoint) ?? $t, 500, 1200);
  }
  positionOffsetValue(t) {
    if (typeof t == "number")
      return Number.isFinite(t) ? t : 0;
    if (typeof t == "string" && t.trim().length > 0) {
      const e = Number(t);
      return Number.isFinite(e) ? e : 0;
    }
    return 0;
  }
  clampNumber(t, e, i) {
    return Number.isFinite(t) ? Math.min(Math.max(t, e), i) : e;
  }
};
F.styles = Fe`
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
      font-family: var(--paper-font-body1_-_font-family, var(--ha-font-family, inherit));
      --vc-card-title-size: 20px;
      --vc-svg-max-height: 360px;
      --vc-default-text-size: 14px;
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
      position: relative;
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

    .layout-narrow svg {
      max-height: none;
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
      stroke-width: 7.5;
      stroke-linecap: round;
      stroke-dasharray: 15 12;
      opacity: 0.92;
    }

    .internal-flow-line {
      stroke-width: 6.6;
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

    .badge-overlay {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .value-badge {
      position: absolute;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 50px;
      max-width: calc(100% - 16px);
      padding: 5px 9px 6px;
      border: 1.35px solid var(--vc-badge-border-color, var(--vc-badge-tone-border-color, var(--vc-value-box-border-color, var(--divider-color, rgba(127, 127, 127, 0.56)))));
      border-radius: 6px;
      background: var(--vc-value-box-background-color, var(--ha-card-background, var(--card-background-color, #ffffff)));
      color: var(--primary-text-color, #111);
      line-height: 1.15;
      white-space: nowrap;
    }

    .value-badge.align-center {
      transform: translateX(-50%);
    }

    .value-badge.align-right {
      transform: translateX(-100%);
    }

    .value-badge.outdoor {
      --vc-badge-tone-border-color: var(--vc-air-outdoor);
    }

    .value-badge.supply {
      --vc-badge-tone-border-color: var(--vc-air-supply);
    }

    .value-badge.extract {
      --vc-badge-tone-border-color: var(--vc-air-extract);
    }

    .value-badge.exhaust {
      --vc-badge-tone-border-color: var(--vc-air-exhaust);
    }

    .value-badge.heater-active {
      --vc-badge-tone-border-color: var(--vc-air-supply);
    }

    .value-badge.component {
      border-color: var(--vc-badge-border-color, var(--vc-component-badge-border, var(--vc-value-box-border-color, var(--divider-color, rgba(127, 127, 127, 0.56)))));
    }

    .value-badge.badge-extract_fan,
    .value-badge.badge-supply_fan,
    .value-badge.badge-heat_exchanger_speed {
      --vc-component-badge-border: var(--secondary-text-color, #607080);
    }

    .value-badge .badge-label,
    .value-badge .badge-value,
    .value-badge .badge-metric {
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .value-badge .badge-label {
      color: var(--secondary-text-color, #727272);
      font-size: var(--vc-default-text-size);
      font-weight: 500;
    }

    .value-badge .badge-value {
      color: var(--primary-text-color, #111);
      font-size: var(--vc-badge-font-size, var(--vc-default-text-size));
      font-weight: 600;
    }

    .value-badge .badge-metric {
      display: grid;
      grid-template-columns: auto auto;
      justify-content: space-between;
      gap: 12px;
      color: var(--primary-text-color, #111);
      font-size: var(--vc-badge-font-size, var(--vc-default-text-size));
      font-weight: 500;
    }

    .value-badge .badge-metric strong {
      font-size: inherit;
      font-weight: 600;
    }

    .value-badge.interactive {
      pointer-events: auto;
      cursor: pointer;
    }

    .value-badge.interactive:focus {
      border-color: var(--primary-color, #03a9f4);
      border-width: 2px;
      outline: none;
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

    .status-item.interactive {
      cursor: pointer;
    }

    .status-item.interactive:focus {
      border-color: var(--primary-color, #03a9f4);
      outline: none;
    }

    .status-item span,
    .status-item strong {
      overflow-wrap: anywhere;
    }

    .status-item span {
      color: var(--secondary-text-color, #727272);
      font-size: var(--vc-default-text-size);
      line-height: 1.2;
    }

    .status-item strong {
      color: var(--primary-text-color, #111);
      font-size: var(--vc-status-font-size, var(--vc-default-text-size));
      font-weight: 600;
      line-height: 1.25;
      text-align: right;
    }

    .status-item select {
      min-width: 0;
      max-width: 60%;
      padding: 4px 6px;
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.35));
      border-radius: 5px;
      background: var(--ha-card-background, var(--card-background-color, transparent));
      color: var(--primary-text-color, #111);
      font: inherit;
      font-size: var(--vc-status-font-size, var(--vc-default-text-size));
      font-weight: 600;
      cursor: pointer;
    }

    .layout-narrow .status-strip {
      grid-template-columns: 1fr;
    }

    .status-item.warning strong {
      color: var(--warning-color, #f6a623);
    }

    .status-item.danger strong {
      color: var(--error-color, #db4437);
    }

    @keyframes airflow {
      to {
        stroke-dashoffset: -27;
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

    }
  `;
X([
  ae({ attribute: !1 })
], F.prototype, "hass", 2);
X([
  se()
], F.prototype, "config", 2);
X([
  se()
], F.prototype, "narrowLayout", 2);
F = X([
  Ie("ventilation-card")
], F);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "ventilation-card",
  name: "Ventilation Card",
  description: "Residential ventilation/AHU visualization card."
});
export {
  F as VentilationCard
};
