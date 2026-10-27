var Df = { exports: {} }, du = {};
var yh;
function Ay() {
  if (yh) return du;
  yh = 1;
  var s = /* @__PURE__ */ Symbol.for("react.transitional.element"), d = /* @__PURE__ */ Symbol.for("react.fragment");
  function b(o, z, A) {
    var E = null;
    if (A !== void 0 && (E = "" + A), z.key !== void 0 && (E = "" + z.key), "key" in z) {
      A = {};
      for (var U in z)
        U !== "key" && (A[U] = z[U]);
    } else A = z;
    return z = A.ref, {
      $$typeof: s,
      type: o,
      key: E,
      ref: z !== void 0 ? z : null,
      props: A
    };
  }
  return du.Fragment = d, du.jsx = b, du.jsxs = b, du;
}
var gh;
function zy() {
  return gh || (gh = 1, Df.exports = Ay()), Df.exports;
}
var c = zy(), Uf = { exports: {} }, mu = {}, qf = { exports: {} }, Hf = {};
var ph;
function Cy() {
  return ph || (ph = 1, (function(s) {
    function d(q, B) {
      var w = q.length;
      q.push(B);
      e: for (; 0 < w; ) {
        var xe = w - 1 >>> 1, pe = q[xe];
        if (0 < z(pe, B))
          q[xe] = B, q[w] = pe, w = xe;
        else break e;
      }
    }
    function b(q) {
      return q.length === 0 ? null : q[0];
    }
    function o(q) {
      if (q.length === 0) return null;
      var B = q[0], w = q.pop();
      if (w !== B) {
        q[0] = w;
        e: for (var xe = 0, pe = q.length, bt = pe >>> 1; xe < bt; ) {
          var Xt = 2 * (xe + 1) - 1, cl = q[Xt], v = Xt + 1, H = q[v];
          if (0 > z(cl, w))
            v < pe && 0 > z(H, cl) ? (q[xe] = H, q[v] = w, xe = v) : (q[xe] = cl, q[Xt] = w, xe = Xt);
          else if (v < pe && 0 > z(H, w))
            q[xe] = H, q[v] = w, xe = v;
          else break e;
        }
      }
      return B;
    }
    function z(q, B) {
      var w = q.sortIndex - B.sortIndex;
      return w !== 0 ? w : q.id - B.id;
    }
    if (s.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var A = performance;
      s.unstable_now = function() {
        return A.now();
      };
    } else {
      var E = Date, U = E.now();
      s.unstable_now = function() {
        return E.now() - U;
      };
    }
    var D = [], N = [], x = 1, m = null, j = 3, M = !1, G = !1, $ = !1, Q = !1, se = typeof setTimeout == "function" ? setTimeout : null, de = typeof clearTimeout == "function" ? clearTimeout : null, ve = typeof setImmediate < "u" ? setImmediate : null;
    function re(q) {
      for (var B = b(N); B !== null; ) {
        if (B.callback === null) o(N);
        else if (B.startTime <= q)
          o(N), B.sortIndex = B.expirationTime, d(D, B);
        else break;
        B = b(N);
      }
    }
    function Me(q) {
      if ($ = !1, re(q), !G)
        if (b(D) !== null)
          G = !0, je || (je = !0, ue());
        else {
          var B = b(N);
          B !== null && ee(Me, B.startTime - q);
        }
    }
    var je = !1, K = -1, F = 5, R = -1;
    function ae() {
      return Q ? !0 : !(s.unstable_now() - R < F);
    }
    function he() {
      if (Q = !1, je) {
        var q = s.unstable_now();
        R = q;
        var B = !0;
        try {
          e: {
            G = !1, $ && ($ = !1, de(K), K = -1), M = !0;
            var w = j;
            try {
              t: {
                for (re(q), m = b(D); m !== null && !(m.expirationTime > q && ae()); ) {
                  var xe = m.callback;
                  if (typeof xe == "function") {
                    m.callback = null, j = m.priorityLevel;
                    var pe = xe(
                      m.expirationTime <= q
                    );
                    if (q = s.unstable_now(), typeof pe == "function") {
                      m.callback = pe, re(q), B = !0;
                      break t;
                    }
                    m === b(D) && o(D), re(q);
                  } else o(D);
                  m = b(D);
                }
                if (m !== null) B = !0;
                else {
                  var bt = b(N);
                  bt !== null && ee(
                    Me,
                    bt.startTime - q
                  ), B = !1;
                }
              }
              break e;
            } finally {
              m = null, j = w, M = !1;
            }
            B = void 0;
          }
        } finally {
          B ? ue() : je = !1;
        }
      }
    }
    var ue;
    if (typeof ve == "function")
      ue = function() {
        ve(he);
      };
    else if (typeof MessageChannel < "u") {
      var Y = new MessageChannel(), ie = Y.port2;
      Y.port1.onmessage = he, ue = function() {
        ie.postMessage(null);
      };
    } else
      ue = function() {
        se(he, 0);
      };
    function ee(q, B) {
      K = se(function() {
        q(s.unstable_now());
      }, B);
    }
    s.unstable_IdlePriority = 5, s.unstable_ImmediatePriority = 1, s.unstable_LowPriority = 4, s.unstable_NormalPriority = 3, s.unstable_Profiling = null, s.unstable_UserBlockingPriority = 2, s.unstable_cancelCallback = function(q) {
      q.callback = null;
    }, s.unstable_forceFrameRate = function(q) {
      0 > q || 125 < q ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : F = 0 < q ? Math.floor(1e3 / q) : 5;
    }, s.unstable_getCurrentPriorityLevel = function() {
      return j;
    }, s.unstable_next = function(q) {
      switch (j) {
        case 1:
        case 2:
        case 3:
          var B = 3;
          break;
        default:
          B = j;
      }
      var w = j;
      j = B;
      try {
        return q();
      } finally {
        j = w;
      }
    }, s.unstable_requestPaint = function() {
      Q = !0;
    }, s.unstable_runWithPriority = function(q, B) {
      switch (q) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          q = 3;
      }
      var w = j;
      j = q;
      try {
        return B();
      } finally {
        j = w;
      }
    }, s.unstable_scheduleCallback = function(q, B, w) {
      var xe = s.unstable_now();
      switch (typeof w == "object" && w !== null ? (w = w.delay, w = typeof w == "number" && 0 < w ? xe + w : xe) : w = xe, q) {
        case 1:
          var pe = -1;
          break;
        case 2:
          pe = 250;
          break;
        case 5:
          pe = 1073741823;
          break;
        case 4:
          pe = 1e4;
          break;
        default:
          pe = 5e3;
      }
      return pe = w + pe, q = {
        id: x++,
        callback: B,
        priorityLevel: q,
        startTime: w,
        expirationTime: pe,
        sortIndex: -1
      }, w > xe ? (q.sortIndex = w, d(N, q), b(D) === null && q === b(N) && ($ ? (de(K), K = -1) : $ = !0, ee(Me, w - xe))) : (q.sortIndex = pe, d(D, q), G || M || (G = !0, je || (je = !0, ue()))), q;
    }, s.unstable_shouldYield = ae, s.unstable_wrapCallback = function(q) {
      var B = j;
      return function() {
        var w = j;
        j = B;
        try {
          return q.apply(this, arguments);
        } finally {
          j = w;
        }
      };
    };
  })(Hf)), Hf;
}
var bh;
function Oy() {
  return bh || (bh = 1, qf.exports = Cy()), qf.exports;
}
var Bf = { exports: {} }, ne = {};
var Sh;
function Ry() {
  if (Sh) return ne;
  Sh = 1;
  var s = /* @__PURE__ */ Symbol.for("react.transitional.element"), d = /* @__PURE__ */ Symbol.for("react.portal"), b = /* @__PURE__ */ Symbol.for("react.fragment"), o = /* @__PURE__ */ Symbol.for("react.strict_mode"), z = /* @__PURE__ */ Symbol.for("react.profiler"), A = /* @__PURE__ */ Symbol.for("react.consumer"), E = /* @__PURE__ */ Symbol.for("react.context"), U = /* @__PURE__ */ Symbol.for("react.forward_ref"), D = /* @__PURE__ */ Symbol.for("react.suspense"), N = /* @__PURE__ */ Symbol.for("react.memo"), x = /* @__PURE__ */ Symbol.for("react.lazy"), m = /* @__PURE__ */ Symbol.for("react.activity"), j = /* @__PURE__ */ Symbol.for("react.view_transition"), M = Symbol.iterator;
  function G(v) {
    return v === null || typeof v != "object" ? null : (v = M && v[M] || v["@@iterator"], typeof v == "function" ? v : null);
  }
  var $ = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, Q = Object.assign, se = {};
  function de(v, H, W) {
    this.props = v, this.context = H, this.refs = se, this.updater = W || $;
  }
  de.prototype.isReactComponent = {}, de.prototype.setState = function(v, H) {
    if (typeof v != "object" && typeof v != "function" && v != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, v, H, "setState");
  }, de.prototype.forceUpdate = function(v) {
    this.updater.enqueueForceUpdate(this, v, "forceUpdate");
  };
  function ve() {
  }
  ve.prototype = de.prototype;
  function re(v, H, W) {
    this.props = v, this.context = H, this.refs = se, this.updater = W || $;
  }
  var Me = re.prototype = new ve();
  Me.constructor = re, Q(Me, de.prototype), Me.isPureReactComponent = !0;
  var je = Array.isArray;
  function K() {
  }
  var F = { H: null, A: null, T: null, S: null }, R = Object.prototype.hasOwnProperty;
  function ae(v, H, W) {
    var I = W.ref;
    return {
      $$typeof: s,
      type: v,
      key: H,
      ref: I !== void 0 ? I : null,
      props: W
    };
  }
  function he(v, H) {
    return ae(v.type, H, v.props);
  }
  function ue(v) {
    return typeof v == "object" && v !== null && v.$$typeof === s;
  }
  function Y(v) {
    var H = { "=": "=0", ":": "=2" };
    return "$" + v.replace(/[=:]/g, function(W) {
      return H[W];
    });
  }
  var ie = /\/+/g;
  function ee(v, H) {
    return typeof v == "object" && v !== null && v.key != null ? Y("" + v.key) : H.toString(36);
  }
  function q(v) {
    switch (v.status) {
      case "fulfilled":
        return v.value;
      case "rejected":
        throw v.reason;
      default:
        switch (typeof v.status == "string" ? v.then(K, K) : (v.status = "pending", v.then(
          function(H) {
            v.status === "pending" && (v.status = "fulfilled", v.value = H);
          },
          function(H) {
            v.status === "pending" && (v.status = "rejected", v.reason = H);
          }
        )), v.status) {
          case "fulfilled":
            return v.value;
          case "rejected":
            throw v.reason;
        }
    }
    throw v;
  }
  function B(v, H, W, I, _e) {
    var Z = typeof v;
    (Z === "undefined" || Z === "boolean") && (v = null);
    var ce = !1;
    if (v === null) ce = !0;
    else
      switch (Z) {
        case "bigint":
        case "string":
        case "number":
          ce = !0;
          break;
        case "object":
          switch (v.$$typeof) {
            case s:
            case d:
              ce = !0;
              break;
            case x:
              return ce = v._init, B(
                ce(v._payload),
                H,
                W,
                I,
                _e
              );
          }
      }
    if (ce)
      return _e = _e(v), ce = I === "" ? "." + ee(v, 0) : I, je(_e) ? (W = "", ce != null && (W = ce.replace(ie, "$&/") + "/"), B(_e, H, W, "", function(dt) {
        return dt;
      })) : _e != null && (ue(_e) && (_e = he(
        _e,
        W + (_e.key == null || v && v.key === _e.key ? "" : ("" + _e.key).replace(
          ie,
          "$&/"
        ) + "/") + ce
      )), H.push(_e)), 1;
    ce = 0;
    var L = I === "" ? "." : I + ":";
    if (je(v))
      for (var te = 0; te < v.length; te++)
        I = v[te], Z = L + ee(I, te), ce += B(
          I,
          H,
          W,
          Z,
          _e
        );
    else if (te = G(v), typeof te == "function")
      for (v = te.call(v), te = 0; !(I = v.next()).done; )
        I = I.value, Z = L + ee(I, te++), ce += B(
          I,
          H,
          W,
          Z,
          _e
        );
    else if (Z === "object") {
      if (typeof v.then == "function")
        return B(
          q(v),
          H,
          W,
          I,
          _e
        );
      throw H = String(v), Error(
        "Objects are not valid as a React child (found: " + (H === "[object Object]" ? "object with keys {" + Object.keys(v).join(", ") + "}" : H) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return ce;
  }
  function w(v, H, W) {
    if (v == null) return v;
    var I = [], _e = 0;
    return B(v, I, "", "", function(Z) {
      return H.call(W, Z, _e++);
    }), I;
  }
  function xe(v) {
    if (v._status === -1) {
      var H = v._result, W = H();
      W.then(
        function(I) {
          (v._status === 0 || v._status === -1) && (v._status = 1, v._result = I, W.status === void 0 && (W.status = "fulfilled", W.value = I));
        },
        function(I) {
          (v._status === 0 || v._status === -1) && (v._status = 2, v._result = I, W.status === void 0 && (W.status = "rejected", W.reason = I));
        }
      ), v._status === -1 && (v._status = 0, v._result = W);
    }
    if (v._status === 1) return v._result.default;
    throw v._result;
  }
  var pe = typeof reportError == "function" ? reportError : function(v) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var H = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof v == "object" && v !== null && typeof v.message == "string" ? String(v.message) : String(v),
        error: v
      });
      if (!window.dispatchEvent(H)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", v);
      return;
    }
    console.error(v);
  };
  function bt(v) {
    var H = F.T, W = {};
    W.types = H !== null ? H.types : null, F.T = W;
    try {
      var I = v(), _e = F.S;
      _e !== null && _e(W, I), typeof I == "object" && I !== null && typeof I.then == "function" && I.then(K, pe);
    } catch (Z) {
      pe(Z);
    } finally {
      H !== null && W.types !== null && (H.types = W.types), F.T = H;
    }
  }
  function Xt(v) {
    var H = F.T;
    if (H !== null) {
      var W = H.types;
      W === null ? H.types = [v] : W.indexOf(v) === -1 && W.push(v);
    } else bt(Xt.bind(null, v));
  }
  var cl = {
    map: w,
    forEach: function(v, H, W) {
      w(
        v,
        function() {
          H.apply(this, arguments);
        },
        W
      );
    },
    count: function(v) {
      var H = 0;
      return w(v, function() {
        H++;
      }), H;
    },
    toArray: function(v) {
      return w(v, function(H) {
        return H;
      }) || [];
    },
    only: function(v) {
      if (!ue(v))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return v;
    }
  };
  return ne.Activity = m, ne.Children = cl, ne.Component = de, ne.Fragment = b, ne.Profiler = z, ne.PureComponent = re, ne.StrictMode = o, ne.Suspense = D, ne.ViewTransition = j, ne.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = F, ne.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(v) {
      return F.H.useMemoCache(v);
    }
  }, ne.addTransitionType = Xt, ne.cache = function(v) {
    return function() {
      return v.apply(null, arguments);
    };
  }, ne.cacheSignal = function() {
    return null;
  }, ne.cloneElement = function(v, H, W) {
    if (v == null)
      throw Error(
        "The argument must be a React element, but you passed " + v + "."
      );
    var I = Q({}, v.props), _e = v.key;
    if (H != null)
      for (Z in H.key !== void 0 && (_e = "" + H.key), H)
        !R.call(H, Z) || Z === "key" || Z === "__self" || Z === "__source" || Z === "ref" && H.ref === void 0 || (I[Z] = H[Z]);
    var Z = arguments.length - 2;
    if (Z === 1) I.children = W;
    else if (1 < Z) {
      for (var ce = Array(Z), L = 0; L < Z; L++)
        ce[L] = arguments[L + 2];
      I.children = ce;
    }
    return ae(v.type, _e, I);
  }, ne.createContext = function(v) {
    return v = {
      $$typeof: E,
      _currentValue: v,
      _currentValue2: v,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, v.Provider = v, v.Consumer = {
      $$typeof: A,
      _context: v
    }, v;
  }, ne.createElement = function(v, H, W) {
    var I, _e = {}, Z = null;
    if (H != null)
      for (I in H.key !== void 0 && (Z = "" + H.key), H)
        R.call(H, I) && I !== "key" && I !== "__self" && I !== "__source" && (_e[I] = H[I]);
    var ce = arguments.length - 2;
    if (ce === 1) _e.children = W;
    else if (1 < ce) {
      for (var L = Array(ce), te = 0; te < ce; te++)
        L[te] = arguments[te + 2];
      _e.children = L;
    }
    if (v && v.defaultProps)
      for (I in ce = v.defaultProps, ce)
        _e[I] === void 0 && (_e[I] = ce[I]);
    return ae(v, Z, _e);
  }, ne.createRef = function() {
    return { current: null };
  }, ne.forwardRef = function(v) {
    return { $$typeof: U, render: v };
  }, ne.isValidElement = ue, ne.lazy = function(v) {
    return {
      $$typeof: x,
      _payload: { _status: -1, _result: v },
      _init: xe
    };
  }, ne.memo = function(v, H) {
    return {
      $$typeof: N,
      type: v,
      compare: H === void 0 ? null : H
    };
  }, ne.startTransition = bt, ne.unstable_useCacheRefresh = function() {
    return F.H.useCacheRefresh();
  }, ne.use = function(v) {
    return F.H.use(v);
  }, ne.useActionState = function(v, H, W) {
    return F.H.useActionState(v, H, W);
  }, ne.useCallback = function(v, H) {
    return F.H.useCallback(v, H);
  }, ne.useContext = function(v) {
    return F.H.useContext(v);
  }, ne.useDebugValue = function() {
  }, ne.useDeferredValue = function(v, H) {
    return F.H.useDeferredValue(v, H);
  }, ne.useEffect = function(v, H) {
    return F.H.useEffect(v, H);
  }, ne.useEffectEvent = function(v) {
    return F.H.useEffectEvent(v);
  }, ne.useId = function() {
    return F.H.useId();
  }, ne.useImperativeHandle = function(v, H, W) {
    return F.H.useImperativeHandle(v, H, W);
  }, ne.useInsertionEffect = function(v, H) {
    return F.H.useInsertionEffect(v, H);
  }, ne.useLayoutEffect = function(v, H) {
    return F.H.useLayoutEffect(v, H);
  }, ne.useMemo = function(v, H) {
    return F.H.useMemo(v, H);
  }, ne.useOptimistic = function(v, H) {
    return F.H.useOptimistic(v, H);
  }, ne.useReducer = function(v, H, W) {
    return F.H.useReducer(v, H, W);
  }, ne.useRef = function(v) {
    return F.H.useRef(v);
  }, ne.useState = function(v) {
    return F.H.useState(v);
  }, ne.useSyncExternalStore = function(v, H, W) {
    return F.H.useSyncExternalStore(
      v,
      H,
      W
    );
  }, ne.useTransition = function() {
    return F.H.useTransition();
  }, ne.version = "19.3.1", ne;
}
var _h;
function Lf() {
  return _h || (_h = 1, Bf.exports = Ry()), Bf.exports;
}
var Yf = { exports: {} }, ut = {};
var Th;
function My() {
  if (Th) return ut;
  Th = 1;
  var s = Lf();
  function d(x) {
    var m = "https://react.dev/errors/" + x;
    if (1 < arguments.length) {
      m += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var j = 2; j < arguments.length; j++)
        m += "&args[]=" + encodeURIComponent(arguments[j]);
    }
    return "Minified React error #" + x + "; visit " + m + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function b() {
  }
  var o = {
    d: {
      f: b,
      r: function() {
        throw Error(d(522));
      },
      D: b,
      C: b,
      L: b,
      m: b,
      X: b,
      S: b,
      M: b
    },
    p: 0,
    findDOMNode: null
  }, z = /* @__PURE__ */ Symbol.for("react.portal"), A = /* @__PURE__ */ Symbol.for("react.recoverable"), E = /* @__PURE__ */ Symbol.for("react.optimistic_key");
  function U(x, m, j) {
    var M = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: z,
      key: M == null ? null : M === E ? E : "" + M,
      children: x,
      containerInfo: m,
      implementation: j
    };
  }
  var D = s.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function N(x, m) {
    if (x === "font") return "";
    if (typeof m == "string")
      return m === "use-credentials" ? m : "";
  }
  return ut.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = o, ut.browser = function(x) {
    return { $$typeof: A, _reason: x };
  }, ut.createPortal = function(x, m) {
    var j = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!m || m.nodeType !== 1 && m.nodeType !== 9 && m.nodeType !== 11)
      throw Error(d(299));
    return U(x, m, null, j);
  }, ut.flushSync = function(x) {
    var m = D.T, j = o.p;
    try {
      if (D.T = null, o.p = 2, x) return x();
    } finally {
      D.T = m, o.p = j, o.d.f();
    }
  }, ut.preconnect = function(x, m) {
    typeof x == "string" && (m ? (m = m.crossOrigin, m = typeof m == "string" ? m === "use-credentials" ? m : "" : void 0) : m = null, o.d.C(x, m));
  }, ut.prefetchDNS = function(x) {
    typeof x == "string" && o.d.D(x);
  }, ut.preinit = function(x, m) {
    if (typeof x == "string" && m && typeof m.as == "string") {
      var j = m.as, M = N(j, m.crossOrigin), G = typeof m.integrity == "string" ? m.integrity : void 0, $ = typeof m.fetchPriority == "string" ? m.fetchPriority : void 0;
      j === "style" ? o.d.S(
        x,
        typeof m.precedence == "string" ? m.precedence : void 0,
        {
          crossOrigin: M,
          integrity: G,
          fetchPriority: $
        }
      ) : j === "script" && o.d.X(x, {
        crossOrigin: M,
        integrity: G,
        fetchPriority: $,
        nonce: typeof m.nonce == "string" ? m.nonce : void 0
      });
    }
  }, ut.preinitModule = function(x, m) {
    if (typeof x == "string")
      if (typeof m == "object" && m !== null) {
        if (m.as == null || m.as === "script") {
          var j = N(
            m.as,
            m.crossOrigin
          );
          o.d.M(x, {
            crossOrigin: j,
            integrity: typeof m.integrity == "string" ? m.integrity : void 0,
            nonce: typeof m.nonce == "string" ? m.nonce : void 0,
            fetchPriority: typeof m.fetchPriority == "string" ? m.fetchPriority : void 0
          });
        }
      } else m == null && o.d.M(x);
  }, ut.preload = function(x, m) {
    if (typeof x == "string" && typeof m == "object" && m !== null && typeof m.as == "string") {
      var j = m.as, M = N(j, m.crossOrigin);
      o.d.L(x, j, {
        crossOrigin: M,
        integrity: typeof m.integrity == "string" ? m.integrity : void 0,
        nonce: typeof m.nonce == "string" ? m.nonce : void 0,
        type: typeof m.type == "string" ? m.type : void 0,
        fetchPriority: typeof m.fetchPriority == "string" ? m.fetchPriority : void 0,
        referrerPolicy: typeof m.referrerPolicy == "string" ? m.referrerPolicy : void 0,
        imageSrcSet: typeof m.imageSrcSet == "string" ? m.imageSrcSet : void 0,
        imageSizes: typeof m.imageSizes == "string" ? m.imageSizes : void 0,
        media: typeof m.media == "string" ? m.media : void 0
      });
    }
  }, ut.preloadModule = function(x, m) {
    if (typeof x == "string")
      if (m) {
        var j = N(m.as, m.crossOrigin);
        o.d.m(x, {
          as: typeof m.as == "string" && m.as !== "script" ? m.as : void 0,
          crossOrigin: j,
          integrity: typeof m.integrity == "string" ? m.integrity : void 0,
          nonce: typeof m.nonce == "string" ? m.nonce : void 0,
          fetchPriority: typeof m.fetchPriority == "string" ? m.fetchPriority : void 0
        });
      } else o.d.m(x);
  }, ut.requestFormReset = function(x) {
    o.d.r(x);
  }, ut.unstable_batchedUpdates = function(x, m) {
    return x(m);
  }, ut.useFormState = function(x, m, j) {
    return D.H.useFormState(x, m, j);
  }, ut.useFormStatus = function() {
    return D.H.useHostTransitionStatus();
  }, ut.version = "19.3.1", ut;
}
var Eh;
function Dy() {
  if (Eh) return Yf.exports;
  Eh = 1;
  function s() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(s);
      } catch (d) {
        console.error(d);
      }
  }
  return s(), Yf.exports = My(), Yf.exports;
}
var xh;
function Uy() {
  if (xh) return mu;
  xh = 1;
  var s = Oy(), d = Lf(), b = Dy();
  function o(e) {
    var t = "https://react.dev/errors/" + e;
    if (1 < arguments.length) {
      t += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var l = 2; l < arguments.length; l++)
        t += "&args[]=" + encodeURIComponent(arguments[l]);
    }
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function z(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function A(e) {
    for (var t = e, l = t; l && !l.alternate; )
      t = l, (t.flags & 4098) !== 0 && (e = t.return), l = t.return;
    for (; t.return; ) t = t.return;
    return t.tag === 3 ? e : null;
  }
  function E(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function U(e) {
    if (e.tag === 31) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function D(e) {
    if (A(e) !== e)
      throw Error(o(188));
  }
  function N(e) {
    var t = e.alternate;
    if (!t) {
      if (t = A(e), t === null) throw Error(o(188));
      return t !== e ? null : e;
    }
    for (var l = e, a = t; ; ) {
      var n = l.return;
      if (n === null) break;
      var u = n.alternate;
      if (u === null) {
        if (a = n.return, a !== null) {
          l = a;
          continue;
        }
        break;
      }
      if (n.child === u.child) {
        for (u = n.child; u; ) {
          if (u === l) return D(n), e;
          if (u === a) return D(n), t;
          u = u.sibling;
        }
        throw Error(o(188));
      }
      if (l.return !== a.return) l = n, a = u;
      else {
        for (var i = !1, f = n.child; f; ) {
          if (f === l) {
            i = !0, l = n, a = u;
            break;
          }
          if (f === a) {
            i = !0, a = n, l = u;
            break;
          }
          f = f.sibling;
        }
        if (!i) {
          for (f = u.child; f; ) {
            if (f === l) {
              i = !0, l = u, a = n;
              break;
            }
            if (f === a) {
              i = !0, a = u, l = n;
              break;
            }
            f = f.sibling;
          }
          if (!i) throw Error(o(189));
        }
      }
      if (l.alternate !== a) throw Error(o(190));
    }
    if (l.tag !== 3) throw Error(o(188));
    return l.stateNode.current === l ? e : t;
  }
  function x(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e;
    for (e = e.child; e !== null; ) {
      if (t = x(e), t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  function m(e, t, l, a, n, u) {
    for (; e !== null; ) {
      if ((e.tag === 5 || e.tag === 27 || e.tag === 6) && l(e, a, n, u) || (e.tag !== 22 || e.memoizedState === null) && (t || e.tag !== 5 && e.tag !== 27) && m(
        e.child,
        t,
        l,
        a,
        n,
        u
      ))
        return !0;
      e = e.sibling;
    }
    return !1;
  }
  function j(e) {
    for (e = e.return; e !== null; ) {
      if (e.tag === 3 || e.tag === 5 || e.tag === 27) return e;
      e = e.return;
    }
    return null;
  }
  function M(e) {
    var t = !1;
    for (e = e.return; e !== null && (e.tag === 4 && (t = !0), !(e.tag === 3 || e.tag === 5 || e.tag === 27)); )
      e = e.return;
    return t;
  }
  function G(e) {
    var t = [null, null], l = j(e);
    return l === null || $(
      t,
      e,
      l.child,
      { foundSelf: !1 }
    ), t;
  }
  function $(e, t, l, a) {
    for (; l !== null; ) {
      if (l === t) a.foundSelf = !0;
      else if (l.tag === 5 || l.tag === 27 || l.tag === 6) {
        if (a.foundSelf) return e[1] = l, !0;
        e[0] = l;
      } else if ((l.tag !== 22 || l.memoizedState === null) && $(
        e,
        t,
        l.child,
        a
      ))
        return !0;
      l = l.sibling;
    }
    return !1;
  }
  function Q(e) {
    switch (e.tag) {
      case 5:
      case 27:
      case 6:
        return e.stateNode;
      case 3:
        return e.stateNode.containerInfo;
      default:
        throw Error(o(559));
    }
  }
  var se = null, de = null;
  function ve(e, t, l) {
    return e === l ? !0 : e === t ? (se = e, !0) : !1;
  }
  function re(e, t, l) {
    return e === l ? (de = e, !1) : e === t ? (de !== null && (se = e), !0) : !1;
  }
  function Me(e) {
    if (e === null) return null;
    do
      e = e === null ? null : e.return;
    while (e && e.tag !== 5 && e.tag !== 27 && e.tag !== 3);
    return e || null;
  }
  function je(e, t, l) {
    for (var a = 0, n = e; n; n = l(n)) a++;
    n = 0;
    for (var u = t; u; u = l(u)) n++;
    for (; 0 < a - n; ) e = l(e), a--;
    for (; 0 < n - a; ) t = l(t), n--;
    for (; a--; ) {
      if (e === t || t !== null && e === t.alternate)
        return e;
      e = l(e), t = l(t);
    }
    return null;
  }
  var K = Object.assign, F = /* @__PURE__ */ Symbol.for("react.element"), R = /* @__PURE__ */ Symbol.for("react.transitional.element"), ae = /* @__PURE__ */ Symbol.for("react.portal"), he = /* @__PURE__ */ Symbol.for("react.fragment"), ue = /* @__PURE__ */ Symbol.for("react.strict_mode"), Y = /* @__PURE__ */ Symbol.for("react.profiler"), ie = /* @__PURE__ */ Symbol.for("react.consumer"), ee = /* @__PURE__ */ Symbol.for("react.context"), q = /* @__PURE__ */ Symbol.for("react.forward_ref"), B = /* @__PURE__ */ Symbol.for("react.suspense"), w = /* @__PURE__ */ Symbol.for("react.suspense_list"), xe = /* @__PURE__ */ Symbol.for("react.memo"), pe = /* @__PURE__ */ Symbol.for("react.lazy"), bt = /* @__PURE__ */ Symbol.for("react.activity"), Xt = /* @__PURE__ */ Symbol.for("react.legacy_hidden"), cl = /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel"), v = /* @__PURE__ */ Symbol.for("react.view_transition"), H = /* @__PURE__ */ Symbol.for("react.recoverable"), W = Symbol.iterator;
  function I(e) {
    return e === null || typeof e != "object" ? null : (e = W && e[W] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var _e = /* @__PURE__ */ Symbol.for("react.client.reference");
  function Z(e) {
    if (e == null) return null;
    if (typeof e == "function")
      return e.$$typeof === _e ? null : e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case he:
        return "Fragment";
      case Y:
        return "Profiler";
      case ue:
        return "StrictMode";
      case B:
        return "Suspense";
      case w:
        return "SuspenseList";
      case bt:
        return "Activity";
      case v:
        return "ViewTransition";
    }
    if (typeof e == "object")
      switch (e.$$typeof) {
        case ae:
          return "Portal";
        case ee:
          return e.displayName || "Context";
        case ie:
          return (e._context.displayName || "Context") + ".Consumer";
        case q:
          var t = e.render;
          return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
        case xe:
          return t = e.displayName || null, t !== null ? t : Z(e.type) || "Memo";
        case pe:
          t = e._payload, e = e._init;
          try {
            return Z(e(t));
          } catch {
          }
      }
    return null;
  }
  var ce = Array.isArray, L = d.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, te = b.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, dt = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, Wi = [], Ta = -1;
  function kt(e) {
    return { current: e };
  }
  function Ie(e) {
    0 > Ta || (e.current = Wi[Ta], Wi[Ta] = null, Ta--);
  }
  function Ue(e, t) {
    Ta++, Wi[Ta] = e.current, e.current = t;
  }
  var Ft = kt(null), pn = kt(null), xl = kt(null), pu = kt(null);
  function bu(e, t) {
    switch (Ue(xl, t), Ue(pn, e), Ue(Ft, null), t.nodeType) {
      case 9:
      case 11:
        e = (e = t.documentElement) && (e = e.namespaceURI) ? Nm(e) : 0;
        break;
      default:
        if (e = t.tagName, t = t.namespaceURI)
          t = Nm(t), e = jm(t, e);
        else
          switch (e) {
            case "svg":
              e = 1;
              break;
            case "math":
              e = 2;
              break;
            default:
              e = 0;
          }
    }
    Ie(Ft), Ue(Ft, e);
  }
  function Ea() {
    Ie(Ft), Ie(pn), Ie(xl);
  }
  function Ii(e) {
    var t = e.memoizedState;
    t !== null && (rn._currentValue = t.memoizedState, Ue(pu, e)), t = Ft.current;
    var l = jm(t, e.type);
    t !== l && (Ue(pn, e), Ue(Ft, l));
  }
  function Su(e) {
    pn.current === e && (Ie(Ft), Ie(pn)), pu.current === e && (Ie(pu), rn._currentValue = dt);
  }
  var Pi, wf;
  function Nl(e) {
    if (Pi === void 0)
      try {
        throw Error();
      } catch (l) {
        var t = l.stack.trim().match(/\n( *(at )?)/);
        Pi = t && t[1] || "", wf = -1 < l.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < l.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + Pi + e + wf;
  }
  var ec = !1;
  function tc(e, t) {
    if (!e || ec) return "";
    ec = !0;
    var l = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var a = {
        DetermineComponentFrameRoot: function() {
          try {
            if (t) {
              var O = function() {
                throw Error();
              };
              if (Object.defineProperty(O.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(O, []);
                } catch (X) {
                  var y = X;
                }
                Reflect.construct(e, [], O);
              } else {
                try {
                  O.call();
                } catch (X) {
                  y = X;
                }
                O = !1;
                try {
                  var _ = Object.getOwnPropertyDescriptor(
                    e.prototype,
                    "props"
                  );
                  Object.defineProperty(e.prototype, "props", {
                    configurable: !0,
                    set: function() {
                      throw Error();
                    }
                  }), O = !0, new e();
                } finally {
                  O && (_ !== void 0 ? Object.defineProperty(e.prototype, "props", _) : delete e.prototype.props);
                }
              }
            } else {
              try {
                throw Error();
              } catch (X) {
                y = X;
              }
              (O = e()) && typeof O.catch == "function" && O.catch(function() {
              });
            }
          } catch (X) {
            if (X && y && typeof X.stack == "string")
              return [X.stack, y.stack];
          }
          return [null, null];
        }
      };
      a.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var n = Object.getOwnPropertyDescriptor(
        a.DetermineComponentFrameRoot,
        "name"
      );
      n && n.configurable && Object.defineProperty(
        a.DetermineComponentFrameRoot,
        "name",
        { value: "DetermineComponentFrameRoot" }
      );
      var u = a.DetermineComponentFrameRoot(), i = u[0], f = u[1];
      if (i && f) {
        var r = i.split(`
`), p = f.split(`
`);
        for (n = a = 0; a < r.length && !r[a].includes("DetermineComponentFrameRoot"); )
          a++;
        for (; n < p.length && !p[n].includes(
          "DetermineComponentFrameRoot"
        ); )
          n++;
        if (a === r.length || n === p.length)
          for (a = r.length - 1, n = p.length - 1; 1 <= a && 0 <= n && r[a] !== p[n]; )
            n--;
        for (; 1 <= a && 0 <= n; a--, n--)
          if (r[a] !== p[n]) {
            if (a !== 1 || n !== 1)
              do
                if (a--, n--, 0 > n || r[a] !== p[n]) {
                  var T = `
` + r[a].replace(" at new ", " at ");
                  return e.displayName && T.includes("<anonymous>") && (T = T.replace("<anonymous>", e.displayName)), T;
                }
              while (1 <= a && 0 <= n);
            break;
          }
      }
    } finally {
      ec = !1, Error.prepareStackTrace = l;
    }
    return (l = e ? e.displayName || e.name : "") ? Nl(l) : "";
  }
  function Rh(e, t) {
    switch (e.tag) {
      case 26:
      case 27:
      case 5:
        return Nl(e.type);
      case 16:
        return Nl("Lazy");
      case 13:
        return e.child !== t && t !== null ? Nl("Suspense Fallback") : Nl("Suspense");
      case 19:
        return Nl("SuspenseList");
      case 0:
      case 15:
        return tc(e.type, !1);
      case 11:
        return tc(e.type.render, !1);
      case 1:
        return tc(e.type, !0);
      case 31:
        return Nl("Activity");
      case 30:
        return Nl("ViewTransition");
      default:
        return "";
    }
  }
  function Kf(e) {
    try {
      var t = "", l = null;
      do
        t += Rh(e, l), l = e, e = e.return;
      while (e);
      return t;
    } catch (a) {
      return `
Error generating stack: ` + a.message + `
` + a.stack;
    }
  }
  var lc = Object.prototype.hasOwnProperty, ac = s.unstable_scheduleCallback, nc = s.unstable_cancelCallback, Mh = s.unstable_shouldYield, Dh = s.unstable_requestPaint, St = s.unstable_now, Uh = s.unstable_getCurrentPriorityLevel, Jf = s.unstable_ImmediatePriority, kf = s.unstable_UserBlockingPriority, _u = s.unstable_NormalPriority, qh = s.unstable_LowPriority, Ff = s.unstable_IdlePriority, Hh = s.log, Bh = s.unstable_setDisableYieldValue, bn = null, _t = null;
  function jl(e) {
    if (typeof Hh == "function" && Bh(e), _t && typeof _t.setStrictMode == "function")
      try {
        _t.setStrictMode(bn, e);
      } catch {
      }
  }
  var Tt = Math.clz32 ? Math.clz32 : Qh, Yh = Math.log, Gh = Math.LN2;
  function Qh(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (Yh(e) / Gh | 0) | 0;
  }
  var Tu = 256, Eu = 262144, xu = 4194304;
  function Pl(e) {
    var t = e & 42;
    if (t !== 0) return t;
    switch (e & -e) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
        return 64;
      case 128:
        return 128;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
        return e & -e;
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return e & 3932160;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return e & 62914560;
      case 67108864:
        return 67108864;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 0;
      default:
        return e;
    }
  }
  function Nu(e, t, l) {
    var a = e.pendingLanes;
    if (a === 0) return 0;
    var n = 0, u = e.suspendedLanes, i = e.pingedLanes;
    e = e.warmLanes;
    var f = a & 134217727;
    return f !== 0 ? (a = f & ~u, a !== 0 ? n = Pl(a) : (i &= f, i !== 0 ? n = Pl(i) : l || (l = f & ~e, l !== 0 && (n = Pl(l))))) : (f = a & ~u, f !== 0 ? n = Pl(f) : i !== 0 ? n = Pl(i) : l || (l = a & ~e, l !== 0 && (n = Pl(l)))), n === 0 ? 0 : t !== 0 && t !== n && (t & u) === 0 && (u = n & -n, l = t & -t, u >= l || u === 32 && (l & 4194048) !== 0) ? t : n;
  }
  function Sn(e, t) {
    return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
  }
  function $f(e, t) {
    (t & 8) !== 0 && (t |= t & 32);
    var l = e.entangledLanes;
    if (l !== 0)
      for (e = e.entanglements, l &= t; 0 < l; ) {
        var a = 31 - Tt(l), n = 1 << a;
        t |= e[a], l &= ~n;
      }
    return t;
  }
  function Xh(e, t) {
    switch (e) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return t + 250;
      case 16:
      case 32:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1;
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function Wf() {
    var e = xu;
    return xu <<= 1, (xu & 62914560) === 0 && (xu = 4194304), e;
  }
  function uc(e) {
    for (var t = [], l = 0; 31 > l; l++) t.push(e);
    return t;
  }
  function _n(e, t) {
    e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
  }
  function Zh(e, t, l, a, n, u) {
    var i = e.pendingLanes;
    e.pendingLanes = l, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= l, e.entangledLanes &= l, e.errorRecoveryDisabledLanes &= l, e.shellSuspendCounter = 0;
    var f = e.entanglements, r = e.expirationTimes, p = e.hiddenUpdates;
    for (l = i & ~l; 0 < l; ) {
      var T = 31 - Tt(l), O = 1 << T;
      f[T] = 0, r[T] = -1;
      var y = p[T];
      if (y !== null)
        for (p[T] = null, T = 0; T < y.length; T++) {
          var _ = y[T];
          _ !== null && (_.lane &= -536870913);
        }
      l &= ~O;
    }
    a !== 0 && If(e, a, 0), u !== 0 && n === 0 && e.tag !== 0 && (e.suspendedLanes |= u & ~(i & ~t));
  }
  function If(e, t, l) {
    e.pendingLanes |= t, e.suspendedLanes &= ~t;
    var a = 31 - Tt(t);
    e.entangledLanes |= t, e.entanglements[a] = e.entanglements[a] | 1073741824 | l & 261930;
  }
  function Pf(e, t) {
    var l = e.entangledLanes |= t;
    for (e = e.entanglements; l; ) {
      var a = 31 - Tt(l), n = 1 << a;
      n & t | e[a] & t && (e[a] |= t), l &= ~n;
    }
  }
  function eo(e, t) {
    var l = t & -t;
    return l = (l & 42) !== 0 ? 1 : ic(l), (l & (e.suspendedLanes | t)) !== 0 ? 0 : l;
  }
  function ic(e) {
    switch (e) {
      case 2:
        e = 1;
        break;
      case 8:
        e = 4;
        break;
      case 32:
        e = 16;
        break;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        e = 128;
        break;
      case 268435456:
        e = 134217728;
        break;
      default:
        e = 0;
    }
    return e;
  }
  function cc(e) {
    return e &= -e, 2 < e ? 8 < e ? (e & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function to() {
    var e = te.p;
    return e !== 0 ? e : (e = window.event, e === void 0 ? 32 : fh(e.type));
  }
  function lo(e, t) {
    var l = te.p;
    try {
      return te.p = e, t();
    } finally {
      te.p = l;
    }
  }
  var sl = Math.random().toString(36).slice(2), Pe = "__reactFiber$" + sl, mt = "__reactProps$" + sl, xa = "__reactContainer$" + sl, ao = "__reactEvents$" + sl, Lh = "__reactListeners$" + sl, Vh = "__reactHandles$" + sl, no = "__reactResources$" + sl, Tn = "__reactMarker$" + sl, ju = "__reactLoad$" + sl;
  function Au(e) {
    delete e[Pe], delete e[mt], delete e[Lh], delete e[Vh];
  }
  function ea(e) {
    var t;
    if (t = e[Pe]) return t;
    for (var l = e.parentNode; l; ) {
      if (t = l[xa] || l[Pe]) {
        if (l = t.alternate, t.child !== null || l !== null && l.child !== null)
          for (e = Lm(e); e !== null; ) {
            if (l = e[Pe]) return l;
            e = Lm(e);
          }
        return t;
      }
      e = l, l = e.parentNode;
    }
    return null;
  }
  function Na(e) {
    if (e = e[Pe] || e[xa]) {
      var t = e.tag;
      if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3)
        return e;
    }
    return null;
  }
  function En(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
    throw Error(o(33));
  }
  function ja(e) {
    var t = e[no];
    return t || (t = e[no] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), t;
  }
  function ke(e) {
    e[Tn] = !0;
  }
  function uo(e) {
    e[ju] = void 0;
  }
  var io = /* @__PURE__ */ new Set(), co = {};
  function ta(e, t) {
    Aa(e, t), Aa(e + "Capture", t);
  }
  function Aa(e, t) {
    for (co[e] = t, e = 0; e < t.length; e++)
      io.add(t[e]);
  }
  var wh = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), so = {}, fo = {};
  function Kh(e) {
    return lc.call(fo, e) ? !0 : lc.call(so, e) ? !1 : wh.test(e) ? fo[e] = !0 : (so[e] = !0, !1);
  }
  var Ee = !1;
  function oo() {
    var e = Ee;
    return Ee = !1, e;
  }
  function zu(e, t, l) {
    if (Kh(t))
      if (l === null) e.removeAttribute(t);
      else {
        switch (typeof l) {
          case "undefined":
          case "function":
          case "symbol":
            e.removeAttribute(t);
            return;
          case "boolean":
            var a = t.toLowerCase().slice(0, 5);
            if (a !== "data-" && a !== "aria-") {
              e.removeAttribute(t);
              return;
            }
        }
        e.setAttribute(t, l);
      }
  }
  function Cu(e, t, l) {
    if (l === null) e.removeAttribute(t);
    else {
      switch (typeof l) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(t);
          return;
      }
      e.setAttribute(t, l);
    }
  }
  function fl(e, t, l, a) {
    if (a === null) e.removeAttribute(l);
    else {
      switch (typeof a) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(l);
          return;
      }
      e.setAttributeNS(t, l, a);
    }
  }
  function Et(e) {
    switch (typeof e) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return e;
      case "object":
        return e;
      default:
        return "";
    }
  }
  function ro(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function Jh(e, t, l) {
    var a = Object.getOwnPropertyDescriptor(
      e.constructor.prototype,
      t
    );
    if (!e.hasOwnProperty(t) && typeof a < "u" && typeof a.get == "function" && typeof a.set == "function") {
      var n = a.get, u = a.set;
      return Object.defineProperty(e, t, {
        configurable: !0,
        get: function() {
          return n.call(this);
        },
        set: function(i) {
          l = "" + i, u.call(this, i);
        }
      }), Object.defineProperty(e, t, {
        enumerable: a.enumerable
      }), {
        getValue: function() {
          return l;
        },
        setValue: function(i) {
          l = "" + i;
        },
        stopTracking: function() {
          e._valueTracker = null, delete e[t];
        }
      };
    }
  }
  function sc(e) {
    if (!e._valueTracker) {
      var t = ro(e) ? "checked" : "value";
      e._valueTracker = Jh(
        e,
        t,
        "" + e[t]
      );
    }
  }
  function mo(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var l = t.getValue(), a = "";
    return e && (a = ro(e) ? e.checked ? "true" : "false" : e.value), e = a, e !== l ? (t.setValue(e), !0) : !1;
  }
  var kh = /[\n"\\]/g;
  function Mt(e) {
    return e.replace(
      kh,
      function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function fc(e, t, l, a, n, u, i, f) {
    e.name = "", i != null && typeof i != "function" && typeof i != "symbol" && typeof i != "boolean" ? e.type = i : e.removeAttribute("type"), t != null ? i === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + Et(t)) : e.value !== "" + Et(t) && (e.value = "" + Et(t)) : i !== "submit" && i !== "reset" || e.removeAttribute("value"), t != null ? i === "number" && e.value == t ? oc(e, Et(e.value)) : oc(e, Et(t)) : l != null ? oc(e, Et(l)) : a != null && e.removeAttribute("value"), n == null && u != null && (e.defaultChecked = !!u), n != null && (e.checked = n && typeof n != "function" && typeof n != "symbol"), f != null && typeof f != "function" && typeof f != "symbol" && typeof f != "boolean" ? e.name = "" + Et(f) : e.removeAttribute("name");
  }
  function ho(e, t, l, a, n, u, i, f) {
    if (u != null && typeof u != "function" && typeof u != "symbol" && typeof u != "boolean" && (e.type = u), t != null || l != null) {
      if (!(u !== "submit" && u !== "reset" || t != null)) {
        sc(e);
        return;
      }
      l = l != null ? "" + Et(l) : "", t = t != null ? "" + Et(t) : l, f || t === e.value || (e.value = t), e.defaultValue = t;
    }
    a = a ?? n, a = typeof a != "function" && typeof a != "symbol" && !!a, e.checked = f ? e.checked : !!a, e.defaultChecked = !!a, i != null && typeof i != "function" && typeof i != "symbol" && typeof i != "boolean" && (e.name = i), sc(e);
  }
  function oc(e, t) {
    e.defaultValue !== "" + t && (e.defaultValue = "" + t);
  }
  function za(e, t, l, a) {
    if (e = e.options, t) {
      t = {};
      for (var n = 0; n < l.length; n++)
        t["$" + l[n]] = !0;
      for (l = 0; l < e.length; l++)
        n = t.hasOwnProperty("$" + e[l].value), e[l].selected !== n && (e[l].selected = n), n && a && (e[l].defaultSelected = !0);
    } else {
      for (l = "" + Et(l), t = null, n = 0; n < e.length; n++) {
        if (e[n].value === l) {
          e[n].selected = !0, a && (e[n].defaultSelected = !0);
          return;
        }
        t !== null || e[n].disabled || (t = e[n]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function vo(e, t, l) {
    if (t != null && (t = "" + Et(t), t !== e.value && (e.value = t), l == null)) {
      e.defaultValue !== t && (e.defaultValue = t);
      return;
    }
    e.defaultValue = l != null ? "" + Et(l) : "";
  }
  function yo(e, t, l, a) {
    if (t == null) {
      if (a != null) {
        if (l != null) throw Error(o(92));
        if (ce(a)) {
          if (1 < a.length) throw Error(o(93));
          a = a[0];
        }
        l = a;
      }
      l == null && (l = ""), t = l;
    }
    l = Et(t), e.defaultValue = l, a = e.textContent, a === l && a !== "" && a !== null && (e.value = a), sc(e);
  }
  function Ca(e, t) {
    if (t) {
      var l = e.firstChild;
      if (l && l === e.lastChild && l.nodeType === 3) {
        l.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var Fh = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function go(e, t, l) {
    var a = t.indexOf("--") === 0;
    l == null || typeof l == "boolean" || l === "" ? a ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : a ? e.setProperty(t, l) : typeof l != "number" || l === 0 || Fh.has(t) ? t === "float" ? e.cssFloat = l : e[t] = ("" + l).trim() : e[t] = l + "px";
  }
  function po(e, t, l) {
    if (t != null && typeof t != "object")
      throw Error(o(62));
    if (e = e.style, l != null) {
      for (var a in l)
        !l.hasOwnProperty(a) || t != null && t.hasOwnProperty(a) || (a.indexOf("--") === 0 ? e.setProperty(a, "") : a === "float" ? e.cssFloat = "" : e[a] = "", Ee = !0);
      for (var n in t)
        a = t[n], t.hasOwnProperty(n) && l[n] !== a && (go(e, n, a), Ee = !0);
    } else
      for (var u in t)
        t.hasOwnProperty(u) && go(e, u, t[u]);
  }
  function rc(e) {
    if (e.indexOf("-") === -1) return !1;
    switch (e) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var $h = /* @__PURE__ */ new Map([
    ["acceptCharset", "accept-charset"],
    ["htmlFor", "for"],
    ["httpEquiv", "http-equiv"],
    ["crossOrigin", "crossorigin"],
    ["accentHeight", "accent-height"],
    ["alignmentBaseline", "alignment-baseline"],
    ["arabicForm", "arabic-form"],
    ["baselineShift", "baseline-shift"],
    ["capHeight", "cap-height"],
    ["clipPath", "clip-path"],
    ["clipRule", "clip-rule"],
    ["colorInterpolation", "color-interpolation"],
    ["colorInterpolationFilters", "color-interpolation-filters"],
    ["colorProfile", "color-profile"],
    ["colorRendering", "color-rendering"],
    ["dominantBaseline", "dominant-baseline"],
    ["enableBackground", "enable-background"],
    ["fillOpacity", "fill-opacity"],
    ["fillRule", "fill-rule"],
    ["floodColor", "flood-color"],
    ["floodOpacity", "flood-opacity"],
    ["fontFamily", "font-family"],
    ["fontSize", "font-size"],
    ["fontSizeAdjust", "font-size-adjust"],
    ["fontStretch", "font-stretch"],
    ["fontStyle", "font-style"],
    ["fontVariant", "font-variant"],
    ["fontWeight", "font-weight"],
    ["glyphName", "glyph-name"],
    ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
    ["glyphOrientationVertical", "glyph-orientation-vertical"],
    ["horizAdvX", "horiz-adv-x"],
    ["horizOriginX", "horiz-origin-x"],
    ["imageRendering", "image-rendering"],
    ["letterSpacing", "letter-spacing"],
    ["lightingColor", "lighting-color"],
    ["markerEnd", "marker-end"],
    ["markerMid", "marker-mid"],
    ["markerStart", "marker-start"],
    ["maskType", "mask-type"],
    ["overlinePosition", "overline-position"],
    ["overlineThickness", "overline-thickness"],
    ["paintOrder", "paint-order"],
    ["panose-1", "panose-1"],
    ["pointerEvents", "pointer-events"],
    ["renderingIntent", "rendering-intent"],
    ["shapeRendering", "shape-rendering"],
    ["stopColor", "stop-color"],
    ["stopOpacity", "stop-opacity"],
    ["strikethroughPosition", "strikethrough-position"],
    ["strikethroughThickness", "strikethrough-thickness"],
    ["strokeDasharray", "stroke-dasharray"],
    ["strokeDashoffset", "stroke-dashoffset"],
    ["strokeLinecap", "stroke-linecap"],
    ["strokeLinejoin", "stroke-linejoin"],
    ["strokeMiterlimit", "stroke-miterlimit"],
    ["strokeOpacity", "stroke-opacity"],
    ["strokeWidth", "stroke-width"],
    ["textAnchor", "text-anchor"],
    ["textDecoration", "text-decoration"],
    ["textRendering", "text-rendering"],
    ["transformOrigin", "transform-origin"],
    ["underlinePosition", "underline-position"],
    ["underlineThickness", "underline-thickness"],
    ["unicodeBidi", "unicode-bidi"],
    ["unicodeRange", "unicode-range"],
    ["unitsPerEm", "units-per-em"],
    ["vAlphabetic", "v-alphabetic"],
    ["vHanging", "v-hanging"],
    ["vIdeographic", "v-ideographic"],
    ["vMathematical", "v-mathematical"],
    ["vectorEffect", "vector-effect"],
    ["vertAdvY", "vert-adv-y"],
    ["vertOriginX", "vert-origin-x"],
    ["vertOriginY", "vert-origin-y"],
    ["wordSpacing", "word-spacing"],
    ["writingMode", "writing-mode"],
    ["xmlnsXlink", "xmlns:xlink"],
    ["xHeight", "x-height"]
  ]), Wh = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Ou(e) {
    return Wh.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
  }
  function $t() {
  }
  var dc = null;
  function mc(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var Oa = null, Ra = null;
  function bo(e) {
    var t = Na(e);
    if (t && (e = t.stateNode)) {
      var l = e[mt] || null;
      e: switch (e = t.stateNode, t.type) {
        case "input":
          if (fc(
            e,
            l.value,
            l.defaultValue,
            l.defaultValue,
            l.checked,
            l.defaultChecked,
            l.type,
            l.name
          ), t = l.name, l.type === "radio" && t != null) {
            for (l = e; l.parentNode; ) l = l.parentNode;
            for (l = l.querySelectorAll(
              'input[name="' + Mt(
                "" + t
              ) + '"][type="radio"]'
            ), t = 0; t < l.length; t++) {
              var a = l[t];
              if (a !== e && a.form === e.form) {
                var n = a[mt] || null;
                if (!n) throw Error(o(90));
                fc(
                  a,
                  n.value,
                  n.defaultValue,
                  n.defaultValue,
                  n.checked,
                  n.defaultChecked,
                  n.type,
                  n.name
                );
              }
            }
            for (t = 0; t < l.length; t++)
              a = l[t], a.form === e.form && mo(a);
          }
          break e;
        case "textarea":
          vo(e, l.value, l.defaultValue);
          break e;
        case "select":
          t = l.value, t != null && za(e, !!l.multiple, t, !1);
      }
    }
  }
  var hc = !1;
  function So(e, t, l) {
    if (hc) return e(t, l);
    hc = !0;
    try {
      var a = e(t);
      return a;
    } finally {
      if (hc = !1, (Oa !== null || Ra !== null) && (Oi(), Oa && (t = Oa, e = Ra, Ra = Oa = null, bo(t), e)))
        for (t = 0; t < e.length; t++) bo(e[t]);
    }
  }
  function xn(e, t) {
    var l = e.stateNode;
    if (l === null) return null;
    var a = l[mt] || null;
    if (a === null) return null;
    l = a[t];
    e: switch (t) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (a = !a.disabled) || (e = e.type, a = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !a;
        break e;
      default:
        e = !1;
    }
    if (e) return null;
    if (l && typeof l != "function")
      throw Error(
        o(231, t, typeof l)
      );
    return l;
  }
  var ol = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), vc = !1;
  if (ol)
    try {
      var Nn = {};
      Object.defineProperty(Nn, "passive", {
        get: function() {
          vc = !0;
        }
      }), window.addEventListener("test", Nn, Nn), window.removeEventListener("test", Nn, Nn);
    } catch {
      vc = !1;
    }
  var Al = null, yc = null, Ru = null;
  function _o() {
    if (Ru) return Ru;
    var e, t = yc, l = t.length, a, n = "value" in Al ? Al.value : Al.textContent, u = n.length;
    for (e = 0; e < l && t[e] === n[e]; e++) ;
    var i = l - e;
    for (a = 1; a <= i && t[l - a] === n[u - a]; a++) ;
    return Ru = n.slice(e, 1 < a ? 1 - a : void 0);
  }
  function Mu(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function Du() {
    return !0;
  }
  function To() {
    return !1;
  }
  function st(e) {
    function t(l, a, n, u, i) {
      this._reactName = l, this._targetInst = n, this.type = a, this.nativeEvent = u, this.target = i, this.currentTarget = null;
      for (var f in e)
        e.hasOwnProperty(f) && (l = e[f], this[f] = l ? l(u) : u[f]);
      return this.isDefaultPrevented = (u.defaultPrevented != null ? u.defaultPrevented : u.returnValue === !1) ? Du : To, this.isPropagationStopped = To, this;
    }
    return K(t.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var l = this.nativeEvent;
        l && (l.preventDefault ? l.preventDefault() : typeof l.returnValue != "unknown" && (l.returnValue = !1), this.isDefaultPrevented = Du);
      },
      stopPropagation: function() {
        var l = this.nativeEvent;
        l && (l.stopPropagation ? l.stopPropagation() : typeof l.cancelBubble != "unknown" && (l.cancelBubble = !0), this.isPropagationStopped = Du);
      },
      persist: function() {
      },
      isPersistent: Du
    }), t;
  }
  var zl = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, Uu = st(zl), jn = K({}, zl, { view: 0, detail: 0 }), Ih = st(jn), gc, pc, An, qu = K({}, jn, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: Sc,
    button: 0,
    buttons: 0,
    relatedTarget: function(e) {
      return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
    },
    movementX: function(e) {
      return "movementX" in e ? e.movementX : (e !== An && (An && e.type === "mousemove" ? (gc = e.screenX - An.screenX, pc = e.screenY - An.screenY) : pc = gc = 0, An = e), gc);
    },
    movementY: function(e) {
      return "movementY" in e ? e.movementY : pc;
    }
  }), Eo = st(qu), Ph = K({}, qu, { dataTransfer: 0 }), ev = st(Ph), tv = K({}, jn, { relatedTarget: 0 }), bc = st(tv), lv = K({}, zl, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), av = st(lv), nv = K({}, zl, {
    clipboardData: function(e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    }
  }), uv = st(nv), iv = K({}, zl, { data: 0 }), xo = st(iv), cv = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, sv = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, fv = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function ov(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = fv[e]) ? !!t[e] : !1;
  }
  function Sc() {
    return ov;
  }
  var rv = K({}, jn, {
    key: function(e) {
      if (e.key) {
        var t = cv[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress" ? (e = Mu(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? sv[e.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: Sc,
    charCode: function(e) {
      return e.type === "keypress" ? Mu(e) : 0;
    },
    keyCode: function(e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function(e) {
      return e.type === "keypress" ? Mu(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    }
  }), dv = st(rv), mv = K({}, qu, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0
  }), No = st(mv), hv = K({}, zl, { submitter: 0 }), vv = st(hv), yv = K({}, jn, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: Sc
  }), gv = st(yv), pv = K({}, zl, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), bv = st(pv), Sv = K({}, qu, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), _v = st(Sv), Tv = K({}, zl, {
    newState: 0,
    oldState: 0,
    source: 0
  }), Ev = st(Tv), xv = [9, 13, 27, 32], _c = ol && "CompositionEvent" in window, zn = null;
  ol && "documentMode" in document && (zn = document.documentMode);
  var Nv = ol && "TextEvent" in window && !zn, jo = ol && (!_c || zn && 8 < zn && 11 >= zn), Ao = " ", zo = !1;
  function Co(e, t) {
    switch (e) {
      case "keyup":
        return xv.indexOf(t.keyCode) !== -1;
      case "keydown":
        return t.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function Oo(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var Ma = !1;
  function jv(e, t) {
    switch (e) {
      case "compositionend":
        return Oo(t);
      case "keypress":
        return t.which !== 32 ? null : (zo = !0, Ao);
      case "textInput":
        return e = t.data, e === Ao && zo ? null : e;
      default:
        return null;
    }
  }
  function Av(e, t) {
    if (Ma)
      return e === "compositionend" || !_c && Co(e, t) ? (e = _o(), Ru = yc = Al = null, Ma = !1, e) : null;
    switch (e) {
      case "paste":
        return null;
      case "keypress":
        if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
          if (t.char && 1 < t.char.length)
            return t.char;
          if (t.which) return String.fromCharCode(t.which);
        }
        return null;
      case "compositionend":
        return jo && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var zv = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0
  };
  function Ro(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!zv[e.type] : t === "textarea";
  }
  function Mo(e, t, l, a) {
    Oa ? Ra ? Ra.push(a) : Ra = [a] : Oa = a, t = Hi(t, "onChange"), 0 < t.length && (l = new Uu(
      "onChange",
      "change",
      null,
      l,
      a
    ), e.push({ event: l, listeners: t }));
  }
  var Cn = null, On = null;
  function Cv(e) {
    bm(e, 0);
  }
  function Hu(e) {
    var t = En(e);
    if (mo(t)) return e;
  }
  function Do(e, t) {
    if (e === "change") return t;
  }
  var Uo = !1;
  if (ol) {
    var Tc;
    if (ol) {
      var Ec = "oninput" in document;
      if (!Ec) {
        var qo = document.createElement("div");
        qo.setAttribute("oninput", "return;"), Ec = typeof qo.oninput == "function";
      }
      Tc = Ec;
    } else Tc = !1;
    Uo = Tc && (!document.documentMode || 9 < document.documentMode);
  }
  function Ho() {
    Cn && (Cn.detachEvent("onpropertychange", Bo), On = Cn = null);
  }
  function Bo(e) {
    if (e.propertyName === "value" && Hu(On)) {
      var t = [];
      Mo(
        t,
        On,
        e,
        mc(e)
      ), So(Cv, t);
    }
  }
  function Ov(e, t, l) {
    e === "focusin" ? (Ho(), Cn = t, On = l, Cn.attachEvent("onpropertychange", Bo)) : e === "focusout" && Ho();
  }
  function Rv(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown")
      return Hu(On);
  }
  function Mv(e, t) {
    if (e === "click") return Hu(t);
  }
  function Dv(e, t) {
    if (e === "input" || e === "change")
      return Hu(t);
  }
  function Uv(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var xt = typeof Object.is == "function" ? Object.is : Uv;
  function Rn(e, t) {
    if (xt(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null)
      return !1;
    var l = Object.keys(e), a = Object.keys(t);
    if (l.length !== a.length) return !1;
    for (a = 0; a < l.length; a++) {
      var n = l[a];
      if (!lc.call(t, n) || !xt(e[n], t[n]))
        return !1;
    }
    return !0;
  }
  function xc(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  function Yo(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function Go(e, t) {
    var l = Yo(e);
    e = 0;
    for (var a; l; ) {
      if (l.nodeType === 3) {
        if (a = e + l.textContent.length, e <= t && a >= t)
          return { node: l, offset: t - e };
        e = a;
      }
      e: {
        for (; l; ) {
          if (l.nextSibling) {
            l = l.nextSibling;
            break e;
          }
          l = l.parentNode;
        }
        l = void 0;
      }
      l = Yo(l);
    }
  }
  function Qo(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Qo(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function Xo(e) {
    e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
    for (var t = xc(e.document); t instanceof e.HTMLIFrameElement; ) {
      try {
        var l = typeof t.contentWindow.location.href == "string";
      } catch {
        l = !1;
      }
      if (l) e = t.contentWindow;
      else break;
      t = xc(e.document);
    }
    return t;
  }
  function Nc(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  var qv = ol && "documentMode" in document && 11 >= document.documentMode, Da = null, jc = null, Mn = null, Ac = !1;
  function Zo(e, t, l) {
    var a = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    Ac || Da == null || Da !== xc(a) || (a = Da, "selectionStart" in a && Nc(a) ? a = { start: a.selectionStart, end: a.selectionEnd } : (a = (a.ownerDocument && a.ownerDocument.defaultView || window).getSelection(), a = {
      anchorNode: a.anchorNode,
      anchorOffset: a.anchorOffset,
      focusNode: a.focusNode,
      focusOffset: a.focusOffset
    }), Mn && Rn(Mn, a) || (Mn = a, a = Hi(jc, "onSelect"), 0 < a.length && (t = new Uu(
      "onSelect",
      "select",
      null,
      t,
      l
    ), e.push({ event: t, listeners: a }), t.target = Da)));
  }
  function la(e, t) {
    var l = {};
    return l[e.toLowerCase()] = t.toLowerCase(), l["Webkit" + e] = "webkit" + t, l["Moz" + e] = "moz" + t, l;
  }
  var Ua = {
    animationend: la("Animation", "AnimationEnd"),
    animationiteration: la("Animation", "AnimationIteration"),
    animationstart: la("Animation", "AnimationStart"),
    transitionrun: la("Transition", "TransitionRun"),
    transitionstart: la("Transition", "TransitionStart"),
    transitioncancel: la("Transition", "TransitionCancel"),
    transitionend: la("Transition", "TransitionEnd")
  }, zc = {}, Lo = {};
  ol && (Lo = document.createElement("div").style, "AnimationEvent" in window || (delete Ua.animationend.animation, delete Ua.animationiteration.animation, delete Ua.animationstart.animation), "TransitionEvent" in window || delete Ua.transitionend.transition);
  function aa(e) {
    if (zc[e]) return zc[e];
    if (!Ua[e]) return e;
    var t = Ua[e], l;
    for (l in t)
      if (t.hasOwnProperty(l) && l in Lo)
        return zc[e] = t[l];
    return e;
  }
  var Vo = aa("animationend"), wo = aa("animationiteration"), Ko = aa("animationstart"), Hv = aa("transitionrun"), Bv = aa("transitionstart"), Yv = aa("transitioncancel"), Jo = aa("transitionend"), ko = /* @__PURE__ */ new Map(), Cc = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  Cc.push("scrollEnd");
  function Zt(e, t) {
    ko.set(e, t), ta(t, [e]);
  }
  var Gv = 0;
  function rl(e, t) {
    if (e.name != null && e.name !== "auto") return e.name;
    if (t.autoName !== null) return t.autoName;
    e = Kt.identifierPrefix;
    var l = Gv++;
    return e = "_" + e + "t_" + l.toString(32) + "_", t.autoName = e;
  }
  function Fo(e) {
    if (e == null || typeof e == "string")
      return e;
    var t = null, l = en;
    if (l !== null)
      for (var a = 0; a < l.length; a++) {
        var n = e[l[a]];
        if (n != null) {
          if (n === "none") return "none";
          t = t == null ? n : t + (" " + n);
        }
      }
    return t ?? e.default;
  }
  function dl(e, t) {
    return e = Fo(e), t = Fo(t), t == null ? e === "auto" ? null : e : t === "auto" ? null : t;
  }
  var Bu = typeof reportError == "function" ? reportError : function(e) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var t = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof e == "object" && e !== null && typeof e.message == "string" ? String(e.message) : String(e),
        error: e
      });
      if (!window.dispatchEvent(t)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", e);
      return;
    }
    console.error(e);
  }, Dt = [], qa = 0, Oc = 0;
  function Yu() {
    for (var e = qa, t = Oc = qa = 0; t < e; ) {
      var l = Dt[t];
      Dt[t++] = null;
      var a = Dt[t];
      Dt[t++] = null;
      var n = Dt[t];
      Dt[t++] = null;
      var u = Dt[t];
      if (Dt[t++] = null, a !== null && n !== null) {
        var i = a.pending;
        i === null ? n.next = n : (n.next = i.next, i.next = n), a.pending = n;
      }
      u !== 0 && $o(l, n, u);
    }
  }
  function Gu(e, t, l, a) {
    Dt[qa++] = e, Dt[qa++] = t, Dt[qa++] = l, Dt[qa++] = a, Oc |= a, e.lanes |= a, e = e.alternate, e !== null && (e.lanes |= a);
  }
  function Rc(e, t, l, a) {
    return Gu(e, t, l, a), Qu(e);
  }
  function na(e, t) {
    return Gu(e, null, null, t), Qu(e);
  }
  function $o(e, t, l) {
    e.lanes |= l;
    var a = e.alternate;
    a !== null && (a.lanes |= l);
    for (var n = !1, u = e.return; u !== null; )
      u.childLanes |= l, a = u.alternate, a !== null && (a.childLanes |= l), u.tag === 22 && (e = u.stateNode, e === null || e._visibility & 1 || (n = !0)), e = u, u = u.return;
    return e.tag === 3 ? (u = e.stateNode, n && t !== null && (n = 31 - Tt(l), e = u.hiddenUpdates, a = e[n], a === null ? e[n] = [t] : a.push(t), t.lane = l | 536870912), u) : null;
  }
  function Qu(e) {
    if (50 < eu)
      throw eu = 0, Ci = null, Error(o(185));
    for (var t = e.return; t !== null; )
      e = t, t = e.return;
    return e.tag === 3 ? e.stateNode : null;
  }
  var Ha = {};
  function Qv(e, t, l, a) {
    this.tag = e, this.key = l, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = a, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function ht(e, t, l, a) {
    return new Qv(e, t, l, a);
  }
  function Mc(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function ml(e, t) {
    var l = e.alternate;
    return l === null ? (l = ht(
      e.tag,
      t,
      e.key,
      e.mode
    ), l.elementType = e.elementType, l.type = e.type, l.stateNode = e.stateNode, l.alternate = e, e.alternate = l) : (l.pendingProps = t, l.type = e.type, l.flags = 0, l.subtreeFlags = 0, l.deletions = null), l.flags = e.flags & 1206910976, l.childLanes = e.childLanes, l.lanes = e.lanes, l.child = e.child, l.memoizedProps = e.memoizedProps, l.memoizedState = e.memoizedState, l.updateQueue = e.updateQueue, t = e.dependencies, l.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, l.sibling = e.sibling, l.index = e.index, l.ref = e.ref, l.refCleanup = e.refCleanup, l;
  }
  function Wo(e, t) {
    e.flags &= 1206910978;
    var l = e.alternate;
    return l === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = l.childLanes, e.lanes = l.lanes, e.child = l.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = l.memoizedProps, e.memoizedState = l.memoizedState, e.updateQueue = l.updateQueue, e.type = l.type, t = l.dependencies, e.dependencies = t === null ? null : {
      lanes: t.lanes,
      firstContext: t.firstContext
    }), e;
  }
  function Xu(e, t, l, a, n, u) {
    var i = 0;
    if (a = e, typeof a == "function") Mc(a) && (i = 1);
    else if (typeof a == "string")
      i = hy(
        e,
        l,
        Ft.current
      ) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
    else
      e: switch (a) {
        case bt:
          return e = ht(31, l, t, n), e.elementType = bt, e.lanes = u, e;
        case he:
          return ua(l.children, n, u, t);
        case ue:
          i = 8, n |= 24;
          break;
        case Y:
          return e = ht(12, l, t, n | 2), e.elementType = Y, e.lanes = u, e;
        case B:
          return e = ht(13, l, t, n), e.elementType = B, e.lanes = u, e;
        case w:
          return e = ht(19, l, t, n), e.elementType = w, e.lanes = u, e;
        case Xt:
        case v:
          return e = n | 32, e = ht(30, l, t, e), e.elementType = v, e.lanes = u, e.stateNode = {
            autoName: null,
            paired: null,
            clones: null,
            ref: null
          }, e;
        default:
          if (typeof a == "object" && a !== null)
            switch (a.$$typeof) {
              case ee:
                i = 10;
                break e;
              case ie:
                i = 9;
                break e;
              case q:
                i = 11;
                break e;
              case xe:
                i = 14;
                break e;
              case pe:
                i = 16, a = null;
                break e;
            }
          i = 29, l = Error(
            o(130, e === null ? "null" : typeof e, "")
          ), a = null;
      }
    return t = ht(i, l, t, n), t.elementType = e, t.type = a, t.lanes = u, t;
  }
  function ua(e, t, l, a) {
    return e = ht(7, e, a, t), e.lanes = l, e;
  }
  function Dc(e, t, l) {
    return e = ht(6, e, null, t), e.lanes = l, e;
  }
  function Io(e) {
    var t = ht(18, null, null, 0);
    return t.stateNode = e, t;
  }
  function Uc(e, t, l) {
    return t = ht(
      4,
      e.children !== null ? e.children : [],
      e.key,
      t
    ), t.lanes = l, t.stateNode = {
      containerInfo: e.containerInfo,
      pendingChildren: null,
      implementation: e.implementation
    }, t;
  }
  var Po = /* @__PURE__ */ new WeakMap();
  function Ut(e, t) {
    if (typeof e == "object" && e !== null) {
      var l = Po.get(e);
      return l !== void 0 ? l : (t = {
        value: e,
        source: t,
        stack: Kf(t)
      }, Po.set(e, t), t);
    }
    return {
      value: e,
      source: t,
      stack: Kf(t)
    };
  }
  var Ba = [], Ya = 0, Zu = null, Dn = 0, qt = [], Ht = 0, Cl = null, Wt = 1, It = "";
  function hl(e, t) {
    Ba[Ya++] = Dn, Ba[Ya++] = Zu, Zu = e, Dn = t;
  }
  function er(e, t, l) {
    qt[Ht++] = Wt, qt[Ht++] = It, qt[Ht++] = Cl, Cl = e;
    var a = Wt;
    e = It;
    var n = 32 - Tt(a) - 1;
    a &= ~(1 << n), l += 1;
    var u = 32 - Tt(t) + n;
    if (30 < u) {
      var i = n - n % 5;
      u = (a & (1 << i) - 1).toString(32), a >>= i, n -= i, Wt = 1 << 32 - Tt(t) + n | l << n | a, It = u + e;
    } else
      Wt = 1 << u | l << n | a, It = e;
  }
  function Lu(e) {
    e.return !== null && (hl(e, 1), er(e, 1, 0));
  }
  function qc(e) {
    for (; e === Zu; )
      Zu = Ba[--Ya], Ba[Ya] = null, Dn = Ba[--Ya], Ba[Ya] = null;
    for (; e === Cl; )
      Cl = qt[--Ht], qt[Ht] = null, It = qt[--Ht], qt[Ht] = null, Wt = qt[--Ht], qt[Ht] = null;
  }
  function tr(e, t) {
    qt[Ht++] = Wt, qt[Ht++] = It, qt[Ht++] = Cl, Wt = t.id, It = t.overflow, Cl = e;
  }
  var Fe = null, qe = null, me = !1, Ol = null, Bt = !1, Hc = Error(o(519));
  function Rl(e) {
    var t = Error(
      o(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML",
        ""
      )
    );
    throw Un(Ut(t, e)), Hc;
  }
  function lr(e) {
    var t = e.stateNode, l = e.type, a = e.memoizedProps;
    switch (t[Pe] = e, t[mt] = a, l) {
      case "dialog":
        ge("cancel", t), ge("close", t);
        break;
      case "iframe":
      case "object":
      case "embed":
        ge("load", t);
        break;
      case "video":
      case "audio":
        for (l = 0; l < lu.length; l++)
          ge(lu[l], t);
        break;
      case "source":
        ge("error", t);
        break;
      case "img":
      case "image":
      case "link":
        ge("error", t), ge("load", t);
        break;
      case "details":
        ge("toggle", t);
        break;
      case "input":
        ge("invalid", t), ho(
          t,
          a.value,
          a.defaultValue,
          a.checked,
          a.defaultChecked,
          a.type,
          a.name,
          !0
        );
        break;
      case "select":
        ge("invalid", t);
        break;
      case "textarea":
        ge("invalid", t), yo(t, a.value, a.defaultValue, a.children);
    }
    l = a.children, typeof l != "string" && typeof l != "number" && typeof l != "bigint" || t.textContent === "" + l || a.suppressHydrationWarning === !0 || Em(t.textContent, l) ? (a.popover != null && (ge("beforetoggle", t), ge("toggle", t)), a.onScroll != null && ge("scroll", t), a.onScrollEnd != null && ge("scrollend", t), a.onClick != null && (t.onclick = $t), t = !0) : t = !1, t || Rl(e, !0);
  }
  function Vu(e) {
    for (Fe = e.return; Fe; )
      switch (Fe.tag) {
        case 5:
        case 31:
        case 13:
          Bt = !1;
          return;
        case 27:
        case 3:
          Bt = !0;
          return;
        default:
          Fe = Fe.return;
      }
  }
  function Ga(e) {
    if (e !== Fe) return !1;
    if (!me) return Vu(e), me = !0, !1;
    var t = e.tag, l;
    if ((l = t !== 3 && t !== 27) && ((l = t === 5) && (l = e.type, l = !(l !== "form" && l !== "button") || mf(e.type, e.memoizedProps)), l = !l), l && qe && Rl(e), Vu(e), t === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(o(317));
      qe = Zm(e);
    } else if (t === 31) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(o(317));
      qe = Zm(e);
    } else
      t === 27 ? (t = qe, Jl(e.type) ? (e = Tf, Tf = null, qe = e) : qe = t) : qe = Fe ? Gt(e.stateNode.nextSibling) : null;
    return !0;
  }
  function ia() {
    qe = Fe = null, me = !1;
  }
  function Bc() {
    var e = Ol;
    return e !== null && (gt === null ? gt = e : gt.push.apply(
      gt,
      e
    ), Ol = null), e;
  }
  function Un(e) {
    Ol === null ? Ol = [e] : Ol.push(e);
  }
  var Yc = kt(null), ca = null, vl = null;
  function Ml(e, t, l) {
    Ue(Yc, t._currentValue), t._currentValue = l;
  }
  function yl(e) {
    e._currentValue = Yc.current, Ie(Yc);
  }
  function wu(e, t, l) {
    for (; e !== null; ) {
      var a = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, a !== null && (a.childLanes |= t)) : a !== null && (a.childLanes & t) !== t && (a.childLanes |= t), e === l) break;
      e = e.return;
    }
  }
  function Gc(e, t, l, a) {
    var n = e.child;
    for (n !== null && (n.return = e); n !== null; ) {
      var u = n.dependencies;
      if (u !== null) {
        var i = n.child;
        u = u.firstContext;
        e: for (; u !== null; ) {
          var f = u;
          u = n;
          for (var r = 0; r < t.length; r++)
            if (f.context === t[r]) {
              u.lanes |= l, f = u.alternate, f !== null && (f.lanes |= l), wu(
                u.return,
                l,
                e
              ), a || (i = null);
              break e;
            }
          u = f.next;
        }
      } else if (n.tag === 18) {
        if (i = n.return, i === null) throw Error(o(341));
        i.lanes |= l, u = i.alternate, u !== null && (u.lanes |= l), wu(i, l, e), i = null;
      } else
        n.tag === 13 && n.memoizedState !== null && n.memoizedState.dehydrated === null ? (n.lanes |= l, i = n.alternate, i !== null && (i.lanes |= l), wu(
          n.return,
          l,
          e
        ), i = n.child, i = i !== null ? i.sibling : null) : i = n.child;
      if (i !== null) i.return = n;
      else
        for (i = n; i !== null; ) {
          if (i === e) {
            i = null;
            break;
          }
          if (n = i.sibling, n !== null) {
            n.return = i.return, i = n;
            break;
          }
          i = i.return;
        }
      n = i;
    }
  }
  function sa(e, t, l, a) {
    e = null;
    for (var n = t, u = !1; n !== null; ) {
      if (!u) {
        if ((n.flags & 524288) !== 0) u = !0;
        else if ((n.flags & 262144) !== 0) break;
      }
      if (n.tag === 10) {
        var i = n.alternate;
        if (i === null) throw Error(o(387));
        if (i = i.memoizedProps, i !== null) {
          var f = n.type;
          xt(n.pendingProps.value, i.value) || (e !== null ? e.push(f) : e = [f]);
        }
      } else if (n === pu.current) {
        if (i = n.alternate, i === null) throw Error(o(387));
        i.memoizedState.memoizedState !== n.memoizedState.memoizedState && (e !== null ? e.push(rn) : e = [rn]);
      }
      n = n.return;
    }
    return e !== null && Gc(
      t,
      e,
      l,
      a
    ), t.flags |= 262144, e !== null;
  }
  function Ku(e) {
    for (e = e.firstContext; e !== null; ) {
      if (!xt(
        e.context._currentValue,
        e.memoizedValue
      ))
        return !0;
      e = e.next;
    }
    return !1;
  }
  function fa(e) {
    ca = e, vl = null, e = e.dependencies, e !== null && (e.firstContext = null);
  }
  function et(e) {
    return ar(ca, e);
  }
  function Ju(e, t) {
    return ca === null && fa(e), ar(e, t);
  }
  function ar(e, t) {
    var l = t._currentValue;
    if (t = { context: t, memoizedValue: l, next: null }, vl === null) {
      if (e === null) throw Error(o(308));
      vl = t, e.dependencies = { lanes: 0, firstContext: t }, e.flags |= 524288;
    } else vl = vl.next = t;
    return l;
  }
  var Xv = typeof AbortController < "u" ? AbortController : function() {
    var e = [], t = this.signal = {
      aborted: !1,
      addEventListener: function(l, a) {
        e.push(a);
      }
    };
    this.abort = function() {
      t.aborted = !0, e.forEach(function(l) {
        return l();
      });
    };
  }, Zv = s.unstable_scheduleCallback, Lv = s.unstable_NormalPriority, Ze = {
    $$typeof: ee,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function Qc() {
    return {
      controller: new Xv(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function qn(e) {
    e.refCount--, e.refCount === 0 && Zv(Lv, function() {
      e.controller.abort();
    });
  }
  function nr(e, t) {
    if ((e.pendingLanes & 4194048) !== 0) {
      var l = e.transitionTypes;
      for (l === null && (l = e.transitionTypes = []), e = 0; e < t.length; e++) {
        var a = t[e];
        l.indexOf(a) === -1 && l.push(a);
      }
    }
  }
  var Hn = null;
  function Vv(e) {
    var t = e.transitionTypes;
    return e.transitionTypes = null, t;
  }
  var Bn = null, Xc = 0, oa = 0, Qa = null;
  function wv(e, t) {
    if (Bn === null) {
      var l = Bn = [];
      Xc = 0, oa = af(), Qa = {
        status: "pending",
        value: void 0,
        then: function(a) {
          l.push(a);
        }
      };
    }
    return Xc++, t.then(ur, ur), t;
  }
  function ur() {
    if (--Xc === 0 && (Hn = null, Bn !== null)) {
      Qa !== null && (Qa.status = "fulfilled");
      var e = Bn;
      Bn = null, oa = 0, Qa = null;
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
  }
  function Kv(e, t) {
    var l = [], a = {
      status: "pending",
      value: null,
      reason: null,
      then: function(n) {
        l.push(n);
      }
    };
    return e.then(
      function() {
        a.status = "fulfilled", a.value = t;
        for (var n = 0; n < l.length; n++) (0, l[n])(t);
      },
      function(n) {
        for (a.status = "rejected", a.reason = n, n = 0; n < l.length; n++)
          (0, l[n])(void 0);
      }
    ), a;
  }
  var ir = L.S;
  L.S = function(e, t) {
    if (Id = St(), typeof t == "object" && t !== null && typeof t.then == "function" && wv(e, t), Hn !== null)
      for (var l = nn; l !== null; )
        nr(l, Hn), l = l.next;
    if (l = e.types, l !== null) {
      for (var a = nn; a !== null; )
        nr(a, l), a = a.next;
      if (oa !== 0) {
        a = Hn, a === null && (a = Hn = []);
        for (var n = 0; n < l.length; n++) {
          var u = l[n];
          a.indexOf(u) === -1 && a.push(u);
        }
      }
    }
    ir !== null && ir(e, t);
  };
  var ra = kt(null);
  function Zc() {
    var e = ra.current;
    return e !== null ? e : De.pooledCache;
  }
  function ku(e, t) {
    t === null ? Ue(ra, ra.current) : Ue(ra, t.pool);
  }
  function cr() {
    var e = Zc();
    return e === null ? null : { parent: Ze._currentValue, pool: e };
  }
  var Xa = Error(o(460)), Lc = Error(o(474)), Fu = Error(o(542)), $u = { then: function() {
  } };
  function sr(e) {
    return e = e.status, e === "fulfilled" || e === "rejected";
  }
  function fr(e, t, l) {
    switch (l = e[l], l === void 0 ? e.push(t) : l !== t && (t.then($t, $t), t = l), t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw e = t.reason, rr(e), e === void 0 && !("reason" in t) ? Error(o(600)) : e;
      default:
        if (typeof t.status == "string") t.then($t, $t);
        else {
          if (e = De, e !== null && 100 < e.shellSuspendCounter)
            throw Error(o(482));
          e = t, e.status = "pending", e.then(
            function(a) {
              if (t.status === "pending") {
                var n = t;
                n.status = "fulfilled", n.value = a;
              }
            },
            function(a) {
              if (t.status === "pending") {
                var n = t;
                n.status = "rejected", n.reason = a;
              }
            }
          );
        }
        switch (t.status) {
          case "fulfilled":
            return t.value;
          case "rejected":
            throw e = t.reason, rr(e), e;
        }
        throw ma = t, Xa;
    }
  }
  function da(e) {
    try {
      var t = e._init;
      return t(e._payload);
    } catch (l) {
      throw l !== null && typeof l == "object" && typeof l.then == "function" ? (ma = l, Xa) : l;
    }
  }
  var ma = null;
  function or() {
    if (ma === null) throw Error(o(459));
    var e = ma;
    return ma = null, e;
  }
  function rr(e) {
    if (e === Xa || e === Fu)
      throw Error(o(483));
  }
  var Za = null, Yn = 0;
  function Wu(e) {
    var t = Yn;
    return Yn += 1, Za === null && (Za = []), fr(Za, e, t);
  }
  function Dl(e, t) {
    t = t.props.ref, e.ref = t !== void 0 ? t : null;
  }
  function Iu(e, t) {
    throw t.$$typeof === F ? Error(o(525)) : (e = Object.prototype.toString.call(t), Error(
      o(
        31,
        e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e
      )
    ));
  }
  function dr(e) {
    function t(g, h) {
      if (e) {
        var S = g.deletions;
        S === null ? (g.deletions = [h], g.flags |= 16) : S.push(h);
      }
    }
    function l(g, h) {
      if (!e) return null;
      for (; h !== null; )
        t(g, h), h = h.sibling;
      return null;
    }
    function a(g) {
      for (var h = /* @__PURE__ */ new Map(); g !== null; )
        g.key === null ? h.set(g.index, g) : h.set(g.key, g), g = g.sibling;
      return h;
    }
    function n(g, h) {
      return g = ml(g, h), g.index = 0, g.sibling = null, g;
    }
    function u(g, h, S) {
      return g.index = S, e ? (S = g.alternate, S !== null ? (S = S.index, S < h ? (g.flags |= 2, h) : S) : (g.flags |= 134217730, h)) : (g.flags |= 1048576, h);
    }
    function i(g) {
      return e && g.alternate === null && (g.flags |= 134217730), g;
    }
    function f(g, h, S, C) {
      return h === null || h.tag !== 6 ? (h = Dc(S, g.mode, C), h.return = g, h) : (h = n(h, S), h.return = g, h);
    }
    function r(g, h, S, C) {
      var V = S.type;
      return V === he ? (g = T(
        g,
        h,
        S.props.children,
        C,
        S.key
      ), Dl(g, S), g) : h !== null && (h.elementType === V || typeof V == "object" && V !== null && V.$$typeof === pe && da(V) === h.type) ? (h = n(h, S.props), Dl(h, S), h.return = g, h) : (h = Xu(
        S.type,
        S.key,
        S.props,
        null,
        g.mode,
        C
      ), Dl(h, S), h.return = g, h);
    }
    function p(g, h, S, C) {
      return h === null || h.tag !== 4 || h.stateNode.containerInfo !== S.containerInfo || h.stateNode.implementation !== S.implementation ? (h = Uc(S, g.mode, C), h.return = g, h) : (h = n(h, S.children || []), h.return = g, h);
    }
    function T(g, h, S, C, V) {
      return h === null || h.tag !== 7 ? (h = ua(
        S,
        g.mode,
        C,
        V
      ), h.return = g, h) : (h = n(h, S), h.return = g, h);
    }
    function O(g, h, S) {
      if (typeof h == "string" && h !== "" || typeof h == "number" || typeof h == "bigint")
        return h = Dc(
          "" + h,
          g.mode,
          S
        ), h.return = g, h;
      if (typeof h == "object" && h !== null) {
        switch (h.$$typeof) {
          case R:
            return S = Xu(
              h.type,
              h.key,
              h.props,
              null,
              g.mode,
              S
            ), Dl(S, h), S.return = g, S;
          case ae:
            return h = Uc(
              h,
              g.mode,
              S
            ), h.return = g, h;
          case pe:
            return h = da(h), O(g, h, S);
        }
        if (ce(h) || I(h))
          return h = ua(
            h,
            g.mode,
            S,
            null
          ), h.return = g, h;
        if (typeof h.then == "function")
          return O(g, Wu(h), S);
        if (h.$$typeof === ee)
          return O(
            g,
            Ju(g, h),
            S
          );
        Iu(g, h);
      }
      return null;
    }
    function y(g, h, S, C) {
      var V = h !== null ? h.key : null;
      if (typeof S == "string" && S !== "" || typeof S == "number" || typeof S == "bigint")
        return V !== null ? null : f(g, h, "" + S, C);
      if (typeof S == "object" && S !== null) {
        switch (S.$$typeof) {
          case R:
            return S.key === V ? r(g, h, S, C) : null;
          case ae:
            return S.key === V ? p(g, h, S, C) : null;
          case pe:
            return S = da(S), y(g, h, S, C);
        }
        if (ce(S) || I(S))
          return V !== null ? null : T(g, h, S, C, null);
        if (typeof S.then == "function")
          return y(
            g,
            h,
            Wu(S),
            C
          );
        if (S.$$typeof === ee)
          return y(
            g,
            h,
            Ju(g, S),
            C
          );
        Iu(g, S);
      }
      return null;
    }
    function _(g, h, S, C, V) {
      if (typeof C == "string" && C !== "" || typeof C == "number" || typeof C == "bigint")
        return g = g.get(S) || null, f(h, g, "" + C, V);
      if (typeof C == "object" && C !== null) {
        switch (C.$$typeof) {
          case R:
            return g = g.get(
              C.key === null ? S : C.key
            ) || null, r(h, g, C, V);
          case ae:
            return g = g.get(
              C.key === null ? S : C.key
            ) || null, p(h, g, C, V);
          case pe:
            return C = da(C), _(
              g,
              h,
              S,
              C,
              V
            );
        }
        if (ce(C) || I(C))
          return g = g.get(S) || null, T(h, g, C, V, null);
        if (typeof C.then == "function")
          return _(
            g,
            h,
            S,
            Wu(C),
            V
          );
        if (C.$$typeof === ee)
          return _(
            g,
            h,
            S,
            Ju(h, C),
            V
          );
        Iu(h, C);
      }
      return null;
    }
    function X(g, h, S, C) {
      for (var V = null, Se = null, P = h, le = h = 0, we = null; P !== null && le < S.length; le++) {
        P.index > le ? (we = P, P = null) : we = P.sibling;
        var Te = y(
          g,
          P,
          S[le],
          C
        );
        if (Te === null) {
          P === null && (P = we);
          break;
        }
        e && P && Te.alternate === null && t(g, P), h = u(Te, h, le), Se === null ? V = Te : Se.sibling = Te, Se = Te, P = we;
      }
      if (le === S.length)
        return l(g, P), me && hl(g, le), V;
      if (P === null) {
        for (; le < S.length; le++)
          P = O(g, S[le], C), P !== null && (h = u(
            P,
            h,
            le
          ), Se === null ? V = P : Se.sibling = P, Se = P);
        return me && hl(g, le), V;
      }
      for (P = a(P); le < S.length; le++)
        we = _(
          P,
          g,
          le,
          S[le],
          C
        ), we !== null && (e && (Te = we.alternate, Te !== null && P.delete(Te.key === null ? le : Te.key)), h = u(
          we,
          h,
          le
        ), Se === null ? V = we : Se.sibling = we, Se = we);
      return e && P.forEach(function(Il) {
        return t(g, Il);
      }), me && hl(g, le), V;
    }
    function J(g, h, S, C) {
      if (S == null) throw Error(o(151));
      for (var V = null, Se = null, P = h, le = h = 0, we = null, Te = S.next(); P !== null && !Te.done; le++, Te = S.next()) {
        P.index > le ? (we = P, P = null) : we = P.sibling;
        var Il = y(g, P, Te.value, C);
        if (Il === null) {
          P === null && (P = we);
          break;
        }
        e && P && Il.alternate === null && t(g, P), h = u(Il, h, le), Se === null ? V = Il : Se.sibling = Il, Se = Il, P = we;
      }
      if (Te.done)
        return l(g, P), me && hl(g, le), V;
      if (P === null) {
        for (; !Te.done; le++, Te = S.next())
          Te = O(g, Te.value, C), Te !== null && (h = u(Te, h, le), Se === null ? V = Te : Se.sibling = Te, Se = Te);
        return me && hl(g, le), V;
      }
      for (P = a(P); !Te.done; le++, Te = S.next())
        Te = _(P, g, le, Te.value, C), Te !== null && (e && (we = Te.alternate, we !== null && P.delete(
          we.key === null ? le : we.key
        )), h = u(Te, h, le), Se === null ? V = Te : Se.sibling = Te, Se = Te);
      return e && P.forEach(function(jy) {
        return t(g, jy);
      }), me && hl(g, le), V;
    }
    function oe(g, h, S, C) {
      if (typeof S == "object" && S !== null && S.type === he && S.key === null && S.props.ref === void 0 && (S = S.props.children), typeof S == "object" && S !== null) {
        switch (S.$$typeof) {
          case R:
            e: {
              for (var V = S.key; h !== null; ) {
                if (h.key === V) {
                  if (V = S.type, V === he) {
                    if (h.tag === 7) {
                      l(
                        g,
                        h.sibling
                      ), C = n(
                        h,
                        S.props.children
                      ), Dl(C, S), C.return = g, g = C;
                      break e;
                    }
                  } else if (h.elementType === V || typeof V == "object" && V !== null && V.$$typeof === pe && da(V) === h.type) {
                    l(
                      g,
                      h.sibling
                    ), C = n(h, S.props), Dl(C, S), C.return = g, g = C;
                    break e;
                  }
                  l(g, h);
                  break;
                } else t(g, h);
                h = h.sibling;
              }
              S.type === he ? (C = ua(
                S.props.children,
                g.mode,
                C,
                S.key
              ), Dl(C, S), C.return = g, g = C) : (C = Xu(
                S.type,
                S.key,
                S.props,
                null,
                g.mode,
                C
              ), Dl(C, S), C.return = g, g = C);
            }
            return i(g);
          case ae:
            e: {
              for (V = S.key; h !== null; ) {
                if (h.key === V)
                  if (h.tag === 4 && h.stateNode.containerInfo === S.containerInfo && h.stateNode.implementation === S.implementation) {
                    l(
                      g,
                      h.sibling
                    ), C = n(h, S.children || []), C.return = g, g = C;
                    break e;
                  } else {
                    l(g, h);
                    break;
                  }
                else t(g, h);
                h = h.sibling;
              }
              C = Uc(S, g.mode, C), C.return = g, g = C;
            }
            return i(g);
          case pe:
            return S = da(S), oe(
              g,
              h,
              S,
              C
            );
        }
        if (ce(S))
          return X(
            g,
            h,
            S,
            C
          );
        if (I(S)) {
          if (V = I(S), typeof V != "function") throw Error(o(150));
          return S = V.call(S), J(
            g,
            h,
            S,
            C
          );
        }
        if (typeof S.then == "function")
          return oe(
            g,
            h,
            Wu(S),
            C
          );
        if (S.$$typeof === ee)
          return oe(
            g,
            h,
            Ju(g, S),
            C
          );
        Iu(g, S);
      }
      return typeof S == "string" && S !== "" || typeof S == "number" || typeof S == "bigint" ? (S = "" + S, h !== null && h.tag === 6 ? (l(g, h.sibling), C = n(h, S), C.return = g, g = C) : (l(g, h), C = Dc(S, g.mode, C), C.return = g, g = C), i(g)) : l(g, h);
    }
    return function(g, h, S, C) {
      try {
        Yn = 0;
        var V = oe(
          g,
          h,
          S,
          C
        );
        return Za = null, V;
      } catch (P) {
        if (P === Xa || P === Fu) throw P;
        var Se = ht(29, P, null, g.mode);
        return Se.lanes = C, Se.return = g, Se;
      }
    };
  }
  var ha = dr(!0), mr = dr(!1), Ul = !1;
  function Vc(e) {
    e.updateQueue = {
      baseState: e.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function wc(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
      baseState: e.baseState,
      firstBaseUpdate: e.firstBaseUpdate,
      lastBaseUpdate: e.lastBaseUpdate,
      shared: e.shared,
      callbacks: null
    });
  }
  function ql(e) {
    return { lane: e, tag: 0, payload: null, callback: null, next: null };
  }
  function Hl(e, t, l) {
    var a = e.updateQueue;
    if (a === null) return null;
    if (a = a.shared, (Ne & 2) !== 0) {
      var n = a.pending;
      return n === null ? t.next = t : (t.next = n.next, n.next = t), a.pending = t, t = Qu(e), $o(e, null, l), t;
    }
    return Gu(e, a, t, l), Qu(e);
  }
  function Gn(e, t, l) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (l & 4194048) !== 0)) {
      var a = t.lanes;
      a &= e.pendingLanes, l |= a, t.lanes = l, Pf(e, l);
    }
  }
  function Kc(e, t) {
    var l = e.updateQueue, a = e.alternate;
    if (a !== null && (a = a.updateQueue, l === a)) {
      var n = null, u = null;
      if (l = l.firstBaseUpdate, l !== null) {
        do {
          var i = {
            lane: l.lane,
            tag: l.tag,
            payload: l.payload,
            callback: null,
            next: null
          };
          u === null ? n = u = i : u = u.next = i, l = l.next;
        } while (l !== null);
        u === null ? n = u = t : u = u.next = t;
      } else n = u = t;
      l = {
        baseState: a.baseState,
        firstBaseUpdate: n,
        lastBaseUpdate: u,
        shared: a.shared,
        callbacks: a.callbacks
      }, e.updateQueue = l;
      return;
    }
    e = l.lastBaseUpdate, e === null ? l.firstBaseUpdate = t : e.next = t, l.lastBaseUpdate = t;
  }
  var Jc = !1;
  function Qn() {
    if (Jc) {
      var e = Qa;
      if (e !== null) throw e;
    }
  }
  function Xn(e, t, l, a) {
    Jc = !1;
    var n = e.updateQueue;
    Ul = !1;
    var u = n.firstBaseUpdate, i = n.lastBaseUpdate, f = n.shared.pending;
    if (f !== null) {
      n.shared.pending = null;
      var r = f, p = r.next;
      r.next = null, i === null ? u = p : i.next = p, i = r;
      var T = e.alternate;
      T !== null && (T = T.updateQueue, f = T.lastBaseUpdate, f !== i && (f === null ? T.firstBaseUpdate = p : f.next = p, T.lastBaseUpdate = r));
    }
    if (u !== null) {
      var O = n.baseState;
      i = 0, T = p = r = null, f = u;
      do {
        var y = f.lane & -536870913, _ = y !== f.lane;
        if (_ ? (be & y) === y : (a & y) === y) {
          y !== 0 && y === oa && (Jc = !0), T !== null && (T = T.next = {
            lane: 0,
            tag: f.tag,
            payload: f.payload,
            callback: null,
            next: null
          });
          e: {
            var X = e, J = f;
            y = t;
            var oe = l;
            switch (J.tag) {
              case 1:
                if (X = J.payload, typeof X == "function") {
                  O = X.call(oe, O, y);
                  break e;
                }
                O = X;
                break e;
              case 3:
                X.flags = X.flags & -65537 | 128;
              case 0:
                if (X = J.payload, y = typeof X == "function" ? X.call(oe, O, y) : X, y == null) break e;
                O = K({}, O, y);
                break e;
              case 2:
                Ul = !0;
            }
          }
          y = f.callback, y !== null && (e.flags |= 64, _ && (e.flags |= 8192), _ = n.callbacks, _ === null ? n.callbacks = [y] : _.push(y));
        } else
          _ = {
            lane: y,
            tag: f.tag,
            payload: f.payload,
            callback: f.callback,
            next: null
          }, T === null ? (p = T = _, r = O) : T = T.next = _, i |= y;
        if (f = f.next, f === null) {
          if (f = n.shared.pending, f === null)
            break;
          _ = f, f = _.next, _.next = null, n.lastBaseUpdate = _, n.shared.pending = null;
        }
      } while (!0);
      T === null && (r = O), n.baseState = r, n.firstBaseUpdate = p, n.lastBaseUpdate = T, u === null && (n.shared.lanes = 0), Ll |= i, e.lanes = i, e.memoizedState = O;
    }
  }
  function hr(e, t) {
    if (typeof e != "function")
      throw Error(o(191, e));
    e.call(t);
  }
  function vr(e, t) {
    var l = e.callbacks;
    if (l !== null)
      for (e.callbacks = null, e = 0; e < l.length; e++)
        hr(l[e], t);
  }
  var Bl = kt(null), Pu = kt(0);
  function yr(e, t) {
    e = _l, Ue(Pu, e), Ue(Bl, t), _l = e | t.baseLanes;
  }
  function kc() {
    Ue(Pu, _l), Ue(Bl, Bl.current);
  }
  function Fc() {
    _l = Pu.current, Ie(Bl), Ie(Pu);
  }
  var tt = kt(null), ct = null;
  function Yl(e) {
    var t = e.alternate;
    Ue(lt, lt.current & 1), Ue(tt, e), ct === null && (t === null || Bl.current !== null || t.memoizedState !== null) && (ct = e);
  }
  function $c(e) {
    Ue(lt, lt.current), Ue(tt, e), ct === null && (ct = e);
  }
  function gr(e) {
    e.tag === 22 ? (Ue(lt, lt.current), Ue(tt, e), ct === null && (ct = e)) : Gl();
  }
  function Gl() {
    Ue(lt, lt.current), Ue(tt, tt.current);
  }
  function Nt(e) {
    Ie(tt), ct === e && (ct = null), Ie(lt);
  }
  var lt = kt(0);
  function Zn(e, t) {
    Ue(tt, tt.current), Ue(lt, t);
  }
  function Wc(e) {
    Ie(lt), Ie(tt), ct === e && (ct = null);
  }
  function ei(e) {
    for (var t = e; t !== null; ) {
      if (t.tag === 13) {
        var l = t.memoizedState;
        if (l !== null && (l = l.dehydrated, l === null || Sf(l) || _f(l)))
          return t;
      } else if (t.tag === 19 && t.memoizedProps.revealOrder !== "independent") {
        if ((t.flags & 128) !== 0) return t;
      } else if (t.child !== null) {
        t.child.return = t, t = t.child;
        continue;
      }
      if (t === e) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) return null;
        t = t.return;
      }
      t.sibling.return = t.return, t = t.sibling;
    }
    return null;
  }
  var gl = 0, fe = null, Re = null, Le = null, ti = !1, La = !1, va = !1, li = 0, Ln = 0, Va = null, Jv = 0;
  function Ge() {
    throw Error(o(321));
  }
  function Ic(e, t) {
    if (t === null) return !1;
    for (var l = 0; l < t.length && l < e.length; l++)
      if (!xt(e[l], t[l])) return !1;
    return !0;
  }
  function Pc(e, t, l, a, n, u) {
    return gl = u, fe = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, L.H = e === null || e.memoizedState === null ? ed : td, va = !1, u = l(a, n), va = !1, La && (u = br(
      t,
      l,
      a,
      n
    )), pr(e), u;
  }
  function pr(e) {
    L.H = fi;
    var t = Re !== null && Re.next !== null;
    if (gl = 0, Le = Re = fe = null, ti = !1, Ln = 0, Va = null, t) throw Error(o(300));
    e === null || Ve || (e = e.dependencies, e !== null && Ku(e) && (Ve = !0));
  }
  function br(e, t, l, a) {
    fe = e;
    var n = 0;
    do {
      if (La && (Va = null), Ln = 0, La = !1, 25 <= n) throw Error(o(301));
      if (n += 1, Le = Re = null, e.updateQueue != null) {
        var u = e.updateQueue;
        u.lastEffect = null, u.events = null, u.stores = null, u.memoCache != null && (u.memoCache.index = 0);
      }
      L.H = t0, u = t(l, a);
    } while (La);
    return u;
  }
  function kv() {
    var e = L.H, t = e.useState()[0];
    return t = typeof t.then == "function" ? Vn(t) : t, e = e.useState()[0], (Re !== null ? Re.memoizedState : null) !== e && (fe.flags |= 1024), t;
  }
  function es() {
    var e = li !== 0;
    return li = 0, e;
  }
  function ts(e, t, l) {
    t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l;
  }
  function ls(e) {
    if (ti) {
      for (e = e.memoizedState; e !== null; ) {
        var t = e.queue;
        t !== null && (t.pending = null), e = e.next;
      }
      ti = !1;
    }
    gl = 0, Le = Re = fe = null, La = !1, Ln = li = 0, Va = null;
  }
  function ft() {
    var e = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return Le === null ? fe.memoizedState = Le = e : Le = Le.next = e, Le;
  }
  function Xe() {
    if (Re === null) {
      var e = fe.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = Re.next;
    var t = Le === null ? fe.memoizedState : Le.next;
    if (t !== null)
      Le = t, Re = e;
    else {
      if (e === null)
        throw fe.alternate === null ? Error(o(467)) : Error(o(310));
      Re = e, e = {
        memoizedState: Re.memoizedState,
        baseState: Re.baseState,
        baseQueue: Re.baseQueue,
        queue: Re.queue,
        next: null
      }, Le === null ? fe.memoizedState = Le = e : Le = Le.next = e;
    }
    return Le;
  }
  function ai() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function Vn(e) {
    var t = Ln;
    return Ln += 1, Va === null && (Va = []), e = fr(Va, e, t), t = fe, (Le === null ? t.memoizedState : Le.next) === null && (t = t.alternate, L.H = t === null || t.memoizedState === null ? ed : td), e;
  }
  function ni(e) {
    if (e !== null && typeof e == "object") {
      if (typeof e.then == "function") return Vn(e);
      if (e.$$typeof === H) return;
      if (e.$$typeof === ee) return et(e);
    }
    throw Error(o(438, String(e)));
  }
  function as(e) {
    var t = null, l = fe.updateQueue;
    if (l !== null && (t = l.memoCache), t == null) {
      var a = fe.alternate;
      a !== null && (a = a.updateQueue, a !== null && (a = a.memoCache, a != null && (t = {
        data: a.data.map(function(n) {
          return n.slice();
        }),
        index: 0
      })));
    }
    if (t == null && (t = { data: [], index: 0 }), l === null && (l = ai(), fe.updateQueue = l), l.memoCache = t, l = t.data[t.index], l === void 0)
      for (l = t.data[t.index] = Array(e), a = 0; a < e; a++)
        l[a] = cl;
    return t.index++, l;
  }
  function pl(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function ui(e) {
    var t = Xe();
    return ns(t, Re, e);
  }
  function ns(e, t, l) {
    var a = e.queue;
    if (a === null) throw Error(o(311));
    a.lastRenderedReducer = l;
    var n = e.baseQueue, u = a.pending;
    if (u !== null) {
      if (n !== null) {
        var i = n.next;
        n.next = u.next, u.next = i;
      }
      t.baseQueue = n = u, a.pending = null;
    }
    if (u = e.baseState, n === null) e.memoizedState = u;
    else {
      t = n.next;
      var f = i = null, r = null, p = t, T = !1;
      do {
        var O = p.lane & -536870913;
        if (O !== p.lane ? (be & O) === O : (gl & O) === O) {
          var y = p.revertLane;
          if (y === 0)
            r !== null && (r = r.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: p.action,
              hasEagerState: p.hasEagerState,
              eagerState: p.eagerState,
              next: null
            }), O === oa && (T = !0);
          else if ((gl & y) === y) {
            p = p.next, y === oa && (T = !0);
            continue;
          } else
            O = {
              lane: 0,
              revertLane: p.revertLane,
              gesture: null,
              action: p.action,
              hasEagerState: p.hasEagerState,
              eagerState: p.eagerState,
              next: null
            }, r === null ? (f = r = O, i = u) : r = r.next = O, fe.lanes |= y, Ll |= y;
          O = p.action, va && l(u, O), u = p.hasEagerState ? p.eagerState : l(u, O);
        } else
          y = {
            lane: O,
            revertLane: p.revertLane,
            gesture: p.gesture,
            action: p.action,
            hasEagerState: p.hasEagerState,
            eagerState: p.eagerState,
            next: null
          }, r === null ? (f = r = y, i = u) : r = r.next = y, fe.lanes |= O, Ll |= O;
        p = p.next;
      } while (p !== null && p !== t);
      if (r === null ? i = u : r.next = f, !xt(u, e.memoizedState) && (Ve = !0, T && (l = Qa, l !== null)))
        throw l;
      e.memoizedState = u, e.baseState = i, e.baseQueue = r, a.lastRenderedState = u;
    }
    return n === null && (a.lanes = 0), [e.memoizedState, a.dispatch];
  }
  function us(e) {
    var t = Xe(), l = t.queue;
    if (l === null) throw Error(o(311));
    l.lastRenderedReducer = e;
    var a = l.dispatch, n = l.pending, u = t.memoizedState;
    if (n !== null) {
      l.pending = null;
      var i = n = n.next;
      do
        u = e(u, i.action), i = i.next;
      while (i !== n);
      xt(u, t.memoizedState) || (Ve = !0), t.memoizedState = u, t.baseQueue === null && (t.baseState = u), l.lastRenderedState = u;
    }
    return [u, a];
  }
  function Sr(e, t, l) {
    var a = fe, n = Xe(), u = me;
    if (u) {
      if (l === void 0) throw Error(o(407));
      l = l();
    } else l = t();
    var i = !xt(
      (Re || n).memoizedState,
      l
    );
    if (i && (n.memoizedState = l, Ve = !0), n = n.queue, ss(Er.bind(null, a, n, e), [
      e
    ]), e = n.getSnapshot !== t || i || Le !== null && (Le.memoizedState.tag & 1) !== 0, wa(
      e ? 9 : 8,
      { destroy: void 0 },
      Tr.bind(null, a, n, l, t),
      null
    ), e) {
      if (a.flags |= 2048, De === null) throw Error(o(349));
      u || (gl & 127) !== 0 || _r(a, t, l);
    }
    return l;
  }
  function _r(e, t, l) {
    e.flags |= 16384, e = { getSnapshot: t, value: l }, t = fe.updateQueue, t === null ? (t = ai(), fe.updateQueue = t, t.stores = [e]) : (l = t.stores, l === null ? t.stores = [e] : l.push(e));
  }
  function Tr(e, t, l, a) {
    t.value = l, t.getSnapshot = a, xr(t) && Nr(e);
  }
  function Er(e, t, l) {
    return l(function() {
      xr(t) && Nr(e);
    });
  }
  function xr(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var l = t();
      return !xt(e, l);
    } catch {
      return !0;
    }
  }
  function Nr(e) {
    var t = na(e, 2);
    t !== null && pt(t, e, 2);
  }
  function is(e) {
    var t = ft();
    if (typeof e == "function") {
      var l = e;
      if (e = l(), va) {
        jl(!0);
        try {
          l();
        } finally {
          jl(!1);
        }
      }
    }
    return t.memoizedState = t.baseState = e, t.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: pl,
      lastRenderedState: e
    }, t;
  }
  function jr(e, t, l, a) {
    return e.baseState = l, ns(
      e,
      Re,
      typeof a == "function" ? a : pl
    );
  }
  function Fv(e, t, l, a, n) {
    if (si(e)) throw Error(o(485));
    if (e = t.action, e !== null) {
      var u = {
        payload: n,
        action: e,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function(i) {
          u.listeners.push(i);
        }
      };
      L.T !== null ? l(!0) : u.isTransition = !1, a(u), l = t.pending, l === null ? (u.next = t.pending = u, Ar(t, u)) : (u.next = l.next, t.pending = l.next = u);
    }
  }
  function Ar(e, t) {
    var l = t.action, a = t.payload, n = e.state;
    if (t.isTransition) {
      var u = L.T, i = {};
      i.types = u !== null ? u.types : null, L.T = i;
      try {
        var f = l(n, a), r = L.S;
        r !== null && r(i, f), zr(e, t, f);
      } catch (p) {
        cs(e, t, p);
      } finally {
        u !== null && i.types !== null && (u.types = i.types), L.T = u;
      }
    } else
      try {
        u = l(n, a), zr(e, t, u);
      } catch (p) {
        cs(e, t, p);
      }
  }
  function zr(e, t, l) {
    l !== null && typeof l == "object" && typeof l.then == "function" ? l.then(
      function(a) {
        Cr(e, t, a);
      },
      function(a) {
        return cs(e, t, a);
      }
    ) : Cr(e, t, l);
  }
  function Cr(e, t, l) {
    t.status = "fulfilled", t.value = l, Or(t), e.state = l, t = e.pending, t !== null && (l = t.next, l === t ? e.pending = null : (l = l.next, t.next = l, Ar(e, l)));
  }
  function cs(e, t, l) {
    var a = e.pending;
    if (e.pending = null, a !== null) {
      a = a.next;
      do
        t.status = "rejected", t.reason = l, Or(t), t = t.next;
      while (t !== a);
    }
    e.action = null;
  }
  function Or(e) {
    e = e.listeners;
    for (var t = 0; t < e.length; t++) (0, e[t])();
  }
  function Rr(e, t) {
    return t;
  }
  function Mr(e, t) {
    if (me) {
      var l = De.formState;
      if (l !== null) {
        e: {
          var a = fe;
          if (me) {
            if (qe) {
              t: {
                for (var n = qe, u = Bt; n.nodeType !== 8; ) {
                  if (!u) {
                    n = null;
                    break t;
                  }
                  if (n = Gt(
                    n.nextSibling
                  ), n === null) {
                    n = null;
                    break t;
                  }
                }
                u = n.data, n = u === "F!" || u === "F" ? n : null;
              }
              if (n) {
                qe = Gt(
                  n.nextSibling
                ), a = n.data === "F!";
                break e;
              }
            }
            Rl(a);
          }
          a = !1;
        }
        a && (t = l[0]);
      }
    }
    return l = ft(), l.memoizedState = l.baseState = t, a = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Rr,
      lastRenderedState: t
    }, l.queue = a, l = Wr.bind(
      null,
      fe,
      a
    ), a.dispatch = l, a = is(!1), u = ms.bind(
      null,
      fe,
      !1,
      a.queue
    ), a = ft(), n = {
      state: t,
      dispatch: null,
      action: e,
      pending: null
    }, a.queue = n, l = Fv.bind(
      null,
      fe,
      n,
      u,
      l
    ), n.dispatch = l, a.memoizedState = e, [t, l, !1];
  }
  function Dr(e) {
    var t = Xe();
    return Ur(t, Re, e);
  }
  function Ur(e, t, l) {
    if (t = ns(
      e,
      t,
      Rr
    )[0], e = ui(pl)[0], typeof t == "object" && t !== null && typeof t.then == "function")
      try {
        var a = Vn(t);
      } catch (i) {
        throw i === Xa ? Fu : i;
      }
    else a = t;
    t = Xe();
    var n = t.queue, u = n.dispatch;
    return l !== t.memoizedState && (fe.flags |= 2048, wa(
      9,
      { destroy: void 0 },
      $v.bind(null, n, l),
      null
    )), [a, u, e];
  }
  function $v(e, t) {
    e.action = t;
  }
  function qr(e) {
    var t = Xe(), l = Re;
    if (l !== null)
      return Ur(t, l, e);
    Xe(), t = t.memoizedState, l = Xe();
    var a = l.queue.dispatch;
    return l.memoizedState = e, [t, a, !1];
  }
  function wa(e, t, l, a) {
    return e = { tag: e, create: l, deps: a, inst: t, next: null }, t = fe.updateQueue, t === null && (t = ai(), fe.updateQueue = t), l = t.lastEffect, l === null ? t.lastEffect = e.next = e : (a = l.next, l.next = e, e.next = a, t.lastEffect = e), e;
  }
  function Hr() {
    return Xe().memoizedState;
  }
  function ii(e, t, l, a) {
    var n = ft();
    fe.flags |= e, n.memoizedState = wa(
      1 | t,
      { destroy: void 0 },
      l,
      a === void 0 ? null : a
    );
  }
  function ci(e, t, l, a) {
    var n = Xe();
    a = a === void 0 ? null : a;
    var u = n.memoizedState.inst;
    Re !== null && a !== null && Ic(a, Re.memoizedState.deps) ? n.memoizedState = wa(t, u, l, a) : (fe.flags |= e, n.memoizedState = wa(
      1 | t,
      u,
      l,
      a
    ));
  }
  function Br(e, t) {
    ii(8390656, 8, e, t);
  }
  function ss(e, t) {
    ci(2048, 8, e, t);
  }
  function Wv(e) {
    fe.flags |= 4;
    var t = fe.updateQueue;
    if (t === null)
      t = ai(), fe.updateQueue = t, t.events = [e];
    else {
      var l = t.events;
      l === null ? t.events = [e] : l.push(e);
    }
  }
  function Yr(e) {
    var t = Xe().memoizedState;
    return Wv({ ref: t, nextImpl: e }), function() {
      if ((Ne & 2) !== 0) throw Error(o(440));
      return t.impl.apply(void 0, arguments);
    };
  }
  function Gr(e, t) {
    return ci(4, 2, e, t);
  }
  function Qr(e, t) {
    return ci(4, 4, e, t);
  }
  function Xr(e, t) {
    if (typeof t == "function") {
      e = e();
      var l = t(e);
      return function() {
        typeof l == "function" ? l() : t(null);
      };
    }
    if (t != null)
      return e = e(), t.current = e, function() {
        t.current = null;
      };
  }
  function Zr(e, t, l) {
    l = l != null ? l.concat([e]) : null, ci(4, 4, Xr.bind(null, t, e), l);
  }
  function fs() {
  }
  function Lr(e, t) {
    var l = Xe();
    t = t === void 0 ? null : t;
    var a = l.memoizedState;
    return t !== null && Ic(t, a[1]) ? a[0] : (l.memoizedState = [e, t], e);
  }
  function Vr(e, t) {
    var l = Xe();
    t = t === void 0 ? null : t;
    var a = l.memoizedState;
    if (t !== null && Ic(t, a[1]))
      return a[0];
    if (a = e(), va) {
      jl(!0);
      try {
        e();
      } finally {
        jl(!1);
      }
    }
    return l.memoizedState = [a, t], a;
  }
  function os(e, t, l) {
    return l === void 0 || (gl & 1073741824) !== 0 && (be & 261930) === 0 ? e.memoizedState = t : (e.memoizedState = l, e = em(), fe.lanes |= e, Ll |= e, l);
  }
  function wr(e, t, l, a) {
    return xt(l, t) ? l : Bl.current !== null ? (e = os(e, l, a), xt(e, t) || (Ve = !0), e) : (gl & 106) === 0 || (gl & 1073741824) !== 0 && (be & 261930) === 0 ? (Ve = !0, e.memoizedState = l) : (e = em(), fe.lanes |= e, Ll |= e, t);
  }
  function Kr(e, t, l, a, n) {
    var u = te.p;
    te.p = u !== 0 && 8 > u ? u : 8;
    var i = L.T, f = {};
    f.types = i !== null ? i.types : null, L.T = f, ms(e, !1, t, l);
    try {
      var r = n(), p = L.S;
      if (p !== null && p(f, r), r !== null && typeof r == "object" && typeof r.then == "function") {
        var T = Kv(
          r,
          a
        );
        wn(
          e,
          t,
          T,
          Ct(e)
        );
      } else
        wn(
          e,
          t,
          a,
          Ct(e)
        );
    } catch (O) {
      wn(
        e,
        t,
        { then: function() {
        }, status: "rejected", reason: O },
        Ct()
      );
    } finally {
      te.p = u, i !== null && f.types !== null && (i.types = f.types), L.T = i;
    }
  }
  function Iv() {
  }
  function rs(e, t, l, a) {
    if (e.tag !== 5) throw Error(o(476));
    var n = Jr(e).queue;
    Kr(
      e,
      n,
      t,
      dt,
      l === null ? Iv : function() {
        return kr(e), l(a);
      }
    );
  }
  function Jr(e) {
    var t = e.memoizedState;
    if (t !== null) return t;
    t = {
      memoizedState: dt,
      baseState: dt,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: pl,
        lastRenderedState: dt
      },
      next: null
    };
    var l = {};
    return t.next = {
      memoizedState: l,
      baseState: l,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: pl,
        lastRenderedState: l
      },
      next: null
    }, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
  }
  function kr(e) {
    var t = Jr(e);
    t.next === null && (t = e.alternate.memoizedState), wn(
      e,
      t.next.queue,
      {},
      Ct()
    );
  }
  function ds() {
    return et(rn);
  }
  function Fr() {
    return Xe().memoizedState;
  }
  function $r() {
    return Xe().memoizedState;
  }
  function Pv(e) {
    for (var t = e.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var l = Ct();
          e = ql(l);
          var a = Hl(t, e, l);
          a !== null && (pt(a, t, l), Gn(a, t, l)), t = { cache: Qc() }, e.payload = t;
          return;
      }
      t = t.return;
    }
  }
  function e0(e, t, l) {
    var a = Ct();
    l = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, si(e) ? Ir(t, l) : (l = Rc(e, t, l, a), l !== null && (pt(l, e, a), Pr(l, t, a)));
  }
  function Wr(e, t, l) {
    var a = Ct();
    wn(e, t, l, a);
  }
  function wn(e, t, l, a) {
    var n = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (si(e)) Ir(t, n);
    else {
      var u = e.alternate;
      if (e.lanes === 0 && (u === null || u.lanes === 0) && (u = t.lastRenderedReducer, u !== null))
        try {
          var i = t.lastRenderedState, f = u(i, l);
          if (n.hasEagerState = !0, n.eagerState = f, xt(f, i))
            return Gu(e, t, n, 0), De === null && Yu(), !1;
        } catch {
        }
      if (l = Rc(e, t, n, a), l !== null)
        return pt(l, e, a), Pr(l, t, a), !0;
    }
    return !1;
  }
  function ms(e, t, l, a) {
    if (a = {
      lane: 2,
      revertLane: af(),
      gesture: null,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, si(e)) {
      if (t) throw Error(o(479));
    } else
      t = Rc(
        e,
        l,
        a,
        2
      ), t !== null && pt(t, e, 2);
  }
  function si(e) {
    var t = e.alternate;
    return e === fe || t !== null && t === fe;
  }
  function Ir(e, t) {
    La = ti = !0;
    var l = e.pending;
    l === null ? t.next = t : (t.next = l.next, l.next = t), e.pending = t;
  }
  function Pr(e, t, l) {
    if ((l & 4194048) !== 0) {
      var a = t.lanes;
      a &= e.pendingLanes, l |= a, t.lanes = l, Pf(e, l);
    }
  }
  var fi = {
    readContext: et,
    use: ni,
    useCallback: Ge,
    useContext: Ge,
    useEffect: Ge,
    useImperativeHandle: Ge,
    useLayoutEffect: Ge,
    useInsertionEffect: Ge,
    useMemo: Ge,
    useReducer: Ge,
    useRef: Ge,
    useState: Ge,
    useDebugValue: Ge,
    useDeferredValue: Ge,
    useTransition: Ge,
    useSyncExternalStore: Ge,
    useId: Ge,
    useHostTransitionStatus: Ge,
    useFormState: Ge,
    useActionState: Ge,
    useOptimistic: Ge,
    useMemoCache: Ge,
    useCacheRefresh: Ge,
    useEffectEvent: Ge
  }, ed = {
    readContext: et,
    use: ni,
    useCallback: function(e, t) {
      return ft().memoizedState = [
        e,
        t === void 0 ? null : t
      ], e;
    },
    useContext: et,
    useEffect: Br,
    useImperativeHandle: function(e, t, l) {
      l = l != null ? l.concat([e]) : null, ii(
        4194308,
        4,
        Xr.bind(null, t, e),
        l
      );
    },
    useLayoutEffect: function(e, t) {
      return ii(4194308, 4, e, t);
    },
    useInsertionEffect: function(e, t) {
      ii(4, 2, e, t);
    },
    useMemo: function(e, t) {
      var l = ft();
      t = t === void 0 ? null : t;
      var a = e();
      if (va) {
        jl(!0);
        try {
          e();
        } finally {
          jl(!1);
        }
      }
      return l.memoizedState = [a, t], a;
    },
    useReducer: function(e, t, l) {
      var a = ft();
      if (l !== void 0) {
        var n = l(t);
        if (va) {
          jl(!0);
          try {
            l(t);
          } finally {
            jl(!1);
          }
        }
      } else n = t;
      return a.memoizedState = a.baseState = n, e = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: n
      }, a.queue = e, e = e.dispatch = e0.bind(
        null,
        fe,
        e
      ), [a.memoizedState, e];
    },
    useRef: function(e) {
      var t = ft();
      return e = { current: e }, t.memoizedState = e;
    },
    useState: function(e) {
      e = is(e);
      var t = e.queue, l = Wr.bind(null, fe, t);
      return t.dispatch = l, [e.memoizedState, l];
    },
    useDebugValue: fs,
    useDeferredValue: function(e, t) {
      var l = ft();
      return os(l, e, t);
    },
    useTransition: function() {
      var e = is(!1);
      return e = Kr.bind(
        null,
        fe,
        e.queue,
        !0,
        !1
      ), ft().memoizedState = e, [!1, e];
    },
    useSyncExternalStore: function(e, t, l) {
      var a = fe, n = ft();
      if (me) {
        if (l === void 0)
          throw Error(o(407));
        l = l();
      } else {
        if (l = t(), De === null)
          throw Error(o(349));
        (be & 127) !== 0 || _r(a, t, l);
      }
      n.memoizedState = l;
      var u = { value: l, getSnapshot: t };
      return n.queue = u, Br(Er.bind(null, a, u, e), [
        e
      ]), a.flags |= 2048, wa(
        9,
        { destroy: void 0 },
        Tr.bind(
          null,
          a,
          u,
          l,
          t
        ),
        null
      ), l;
    },
    useId: function() {
      var e = ft(), t = De.identifierPrefix;
      if (me) {
        var l = It, a = Wt;
        l = (a & ~(1 << 32 - Tt(a) - 1)).toString(32) + l, t = "_" + t + "R_" + l, l = li++, 0 < l && (t += "H" + l.toString(32)), t += "_";
      } else
        l = Jv++, t = "_" + t + "r_" + l.toString(32) + "_";
      return e.memoizedState = t;
    },
    useHostTransitionStatus: ds,
    useFormState: Mr,
    useActionState: Mr,
    useOptimistic: function(e) {
      var t = ft();
      t.memoizedState = t.baseState = e;
      var l = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return t.queue = l, t = ms.bind(
        null,
        fe,
        !0,
        l
      ), l.dispatch = t, [e, t];
    },
    useMemoCache: as,
    useCacheRefresh: function() {
      return ft().memoizedState = Pv.bind(
        null,
        fe
      );
    },
    useEffectEvent: function(e) {
      var t = ft(), l = { impl: e };
      return t.memoizedState = l, function() {
        if ((Ne & 2) !== 0)
          throw Error(o(440));
        return l.impl.apply(void 0, arguments);
      };
    }
  }, td = {
    readContext: et,
    use: ni,
    useCallback: Lr,
    useContext: et,
    useEffect: ss,
    useImperativeHandle: Zr,
    useInsertionEffect: Gr,
    useLayoutEffect: Qr,
    useMemo: Vr,
    useReducer: ui,
    useRef: Hr,
    useState: function() {
      return ui(pl);
    },
    useDebugValue: fs,
    useDeferredValue: function(e, t) {
      var l = Xe();
      return wr(
        l,
        Re.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = ui(pl)[0], t = Xe().memoizedState;
      return [
        typeof e == "boolean" ? e : Vn(e),
        t
      ];
    },
    useSyncExternalStore: Sr,
    useId: Fr,
    useHostTransitionStatus: ds,
    useFormState: Dr,
    useActionState: Dr,
    useOptimistic: function(e, t) {
      var l = Xe();
      return jr(l, Re, e, t);
    },
    useMemoCache: as,
    useCacheRefresh: $r,
    useEffectEvent: Yr
  }, t0 = {
    readContext: et,
    use: ni,
    useCallback: Lr,
    useContext: et,
    useEffect: ss,
    useImperativeHandle: Zr,
    useInsertionEffect: Gr,
    useLayoutEffect: Qr,
    useMemo: Vr,
    useReducer: us,
    useRef: Hr,
    useState: function() {
      return us(pl);
    },
    useDebugValue: fs,
    useDeferredValue: function(e, t) {
      var l = Xe();
      return Re === null ? os(l, e, t) : wr(
        l,
        Re.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = us(pl)[0], t = Xe().memoizedState;
      return [
        typeof e == "boolean" ? e : Vn(e),
        t
      ];
    },
    useSyncExternalStore: Sr,
    useId: Fr,
    useHostTransitionStatus: ds,
    useFormState: qr,
    useActionState: qr,
    useOptimistic: function(e, t) {
      var l = Xe();
      return Re !== null ? jr(l, Re, e, t) : (l.baseState = e, [e, l.queue.dispatch]);
    },
    useMemoCache: as,
    useCacheRefresh: $r,
    useEffectEvent: Yr
  };
  function hs(e, t, l, a) {
    t = e.memoizedState, l = l(a, t), l = l == null ? t : K({}, t, l), e.memoizedState = l, e.lanes === 0 && (e.updateQueue.baseState = l);
  }
  var vs = {
    enqueueSetState: function(e, t, l) {
      e = e._reactInternals;
      var a = Ct(), n = ql(a);
      n.payload = t, l != null && (n.callback = l), t = Hl(e, n, a), t !== null && (pt(t, e, a), Gn(t, e, a));
    },
    enqueueReplaceState: function(e, t, l) {
      e = e._reactInternals;
      var a = Ct(), n = ql(a);
      n.tag = 1, n.payload = t, l != null && (n.callback = l), t = Hl(e, n, a), t !== null && (pt(t, e, a), Gn(t, e, a));
    },
    enqueueForceUpdate: function(e, t) {
      e = e._reactInternals;
      var l = Ct(), a = ql(l);
      a.tag = 2, t != null && (a.callback = t), t = Hl(e, a, l), t !== null && (pt(t, e, l), Gn(t, e, l));
    }
  };
  function ld(e, t, l, a, n, u, i) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(a, u, i) : t.prototype && t.prototype.isPureReactComponent ? !Rn(l, a) || !Rn(n, u) : !0;
  }
  function ad(e, t, l, a) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(l, a), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(l, a), t.state !== e && vs.enqueueReplaceState(t, t.state, null);
  }
  function ya(e, t) {
    var l = t;
    if ("ref" in t) {
      l = {};
      for (var a in t)
        a !== "ref" && (l[a] = t[a]);
    }
    if (e = e.defaultProps) {
      l === t && (l = K({}, l));
      for (var n in e)
        l[n] === void 0 && (l[n] = e[n]);
    }
    return l;
  }
  function nd(e) {
    Bu(e);
  }
  function ud(e) {
    console.error(e);
  }
  function id(e) {
    Bu(e);
  }
  function oi(e, t) {
    try {
      var l = e.onUncaughtError;
      l(t.value, { componentStack: t.stack });
    } catch (a) {
      setTimeout(function() {
        throw a;
      });
    }
  }
  function cd(e, t, l) {
    try {
      var a = e.onCaughtError;
      a(l.value, {
        componentStack: l.stack,
        errorBoundary: t.tag === 1 ? t.stateNode : null
      });
    } catch (n) {
      setTimeout(function() {
        throw n;
      });
    }
  }
  function ys(e, t, l) {
    return l = ql(l), l.tag = 3, l.payload = { element: null }, l.callback = function() {
      oi(e, t);
    }, l;
  }
  function sd(e) {
    return e = ql(e), e.tag = 3, e;
  }
  function fd(e, t, l, a) {
    var n = l.type.getDerivedStateFromError;
    if (typeof n == "function") {
      var u = a.value;
      e.payload = function() {
        return n(u);
      }, e.callback = function() {
        cd(t, l, a);
      };
    }
    var i = l.stateNode;
    i !== null && typeof i.componentDidCatch == "function" && (e.callback = function() {
      cd(t, l, a), typeof n != "function" && (Vl === null ? Vl = /* @__PURE__ */ new Set([this]) : Vl.add(this));
      var f = a.stack;
      this.componentDidCatch(a.value, {
        componentStack: f !== null ? f : ""
      });
    });
  }
  function l0(e, t, l, a, n) {
    if (l.flags |= 32768, a !== null && typeof a == "object" && typeof a.then == "function") {
      if (t = l.alternate, t !== null && sa(
        t,
        l,
        n,
        !0
      ), l = tt.current, l !== null) {
        switch (l.tag) {
          case 31:
          case 13:
          case 19:
            return ct === null ? Ri() : l.alternate === null && Qe === 0 && (Qe = 3), l.flags &= -257, l.flags |= 65536, l.lanes = n, a === $u ? l.flags |= 16384 : (t = l.updateQueue, t === null ? l.updateQueue = /* @__PURE__ */ new Set([a]) : t.add(a), ef(e, a, n)), !1;
          case 22:
            return l.flags |= 65536, a === $u ? l.flags |= 16384 : (t = l.updateQueue, t === null ? (t = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([a])
            }, l.updateQueue = t) : (l = t.retryQueue, l === null ? t.retryQueue = /* @__PURE__ */ new Set([a]) : l.add(a)), ef(e, a, n)), !1;
        }
        throw Error(o(435, l.tag));
      }
      return ef(e, a, n), Ri(), !1;
    }
    if (me)
      return t = tt.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = n, a !== Hc && (e = Error(o(422), { cause: a }), Un(Ut(e, l)))) : (a !== Hc && (t = Error(o(423), {
        cause: a
      }), Un(
        Ut(t, l)
      )), e = e.current.alternate, e.flags |= 65536, n &= -n, e.lanes |= n, a = Ut(a, l), n = ys(
        e.stateNode,
        a,
        n
      ), Kc(e, n), Qe !== 4 && (Qe = 2)), !1;
    var u = Error(o(520), { cause: a });
    if (u = Ut(u, l), Pn === null ? Pn = [u] : Pn.push(u), Qe !== 4 && (Qe = 2), t === null) return !0;
    a = Ut(a, l), l = t;
    do {
      switch (l.tag) {
        case 3:
          return l.flags |= 65536, e = n & -n, l.lanes |= e, e = ys(l.stateNode, a, e), Kc(l, e), !1;
        case 1:
          if (t = l.type, u = l.stateNode, (l.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || u !== null && typeof u.componentDidCatch == "function" && (Vl === null || !Vl.has(u))))
            return l.flags |= 65536, n &= -n, l.lanes |= n, n = sd(n), fd(
              n,
              e,
              l,
              a
            ), Kc(l, n), !1;
          break;
        case 22:
          if (l.memoizedState !== null)
            return l.flags |= 65536, !1;
      }
      l = l.return;
    } while (l !== null);
    return !1;
  }
  var gs = Error(o(461)), Ve = !1;
  function Je(e, t, l, a) {
    t.child = e === null ? mr(t, null, l, a) : ha(
      t,
      e.child,
      l,
      a
    );
  }
  function od(e, t, l, a, n) {
    l = l.render;
    var u = t.ref;
    if ("ref" in a) {
      var i = {};
      for (var f in a)
        f !== "ref" && (i[f] = a[f]);
    } else i = a;
    return fa(t), a = Pc(
      e,
      t,
      l,
      i,
      u,
      n
    ), f = es(), e !== null && !Ve ? (ts(e, t, n), bl(e, t, n)) : (me && f && Lu(t), t.flags |= 1, Je(e, t, a, n), t.child);
  }
  function rd(e, t, l, a, n) {
    if (e === null) {
      var u = l.type;
      return typeof u == "function" && !Mc(u) && u.defaultProps === void 0 && l.compare === null ? (t.tag = 15, t.type = u, dd(
        e,
        t,
        u,
        a,
        n
      )) : (e = Xu(
        l.type,
        null,
        a,
        t,
        t.mode,
        n
      ), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (u = e.child, !Ns(e, n)) {
      var i = u.memoizedProps;
      if (l = l.compare, l = l !== null ? l : Rn, l(i, a) && e.ref === t.ref)
        return bl(e, t, n);
    }
    return t.flags |= 1, e = ml(u, a), e.ref = t.ref, e.return = t, t.child = e;
  }
  function dd(e, t, l, a, n) {
    if (e !== null) {
      var u = e.memoizedProps;
      if (Rn(u, a) && e.ref === t.ref)
        if (Ve = !1, t.pendingProps = a = u, Ns(e, n))
          (e.flags & 131072) !== 0 && (Ve = !0);
        else
          return t.lanes = e.lanes, bl(e, t, n);
    }
    return ps(
      e,
      t,
      l,
      a,
      n
    );
  }
  function md(e, t, l, a) {
    var n = a.children, u = e !== null ? e.memoizedState : null;
    if (e === null && t.stateNode === null && (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), a.mode === "hidden") {
      if ((t.flags & 128) !== 0) {
        if (u = u !== null ? u.baseLanes | l : l, e !== null) {
          for (a = t.child = e.child, n = 0; a !== null; )
            n = n | a.lanes | a.childLanes, a = a.sibling;
          a = n & ~u;
        } else a = 0, t.child = null;
        return hd(
          e,
          t,
          u,
          l,
          a
        );
      }
      if ((l & 536870912) !== 0)
        t.memoizedState = { baseLanes: 0, cachePool: null }, e !== null && ku(
          t,
          u !== null ? u.cachePool : null
        ), u !== null ? yr(t, u) : kc(), gr(t);
      else
        return a = t.lanes = 536870912, hd(
          e,
          t,
          u !== null ? u.baseLanes | l : l,
          l,
          a
        );
    } else
      u !== null ? (ku(t, u.cachePool), yr(t, u), Gl(), t.memoizedState = null) : (e !== null && ku(t, null), kc(), Gl());
    return Je(e, t, n, l), t.child;
  }
  function Kn(e, t) {
    return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), t.sibling;
  }
  function hd(e, t, l, a, n) {
    var u = Zc();
    return u = u === null ? null : { parent: Ze._currentValue, pool: u }, t.memoizedState = {
      baseLanes: l,
      cachePool: u
    }, e !== null && ku(t, null), kc(), gr(t), e !== null && sa(e, t, a, !0), t.childLanes = n, null;
  }
  function ri(e, t) {
    return t = di(
      { mode: t.mode, children: t.children },
      e.mode
    ), t.ref = e.ref, e.child = t, t.return = e, t;
  }
  function vd(e, t, l) {
    return ha(t, e.child, null, l), e = ri(t, t.pendingProps), e.flags |= 2, Nt(t), t.memoizedState = null, e;
  }
  function a0(e, t, l) {
    var a = t.pendingProps, n = (t.flags & 128) !== 0;
    if (t.flags &= -129, e === null) {
      if (me) {
        if (a.mode === "hidden")
          return e = ri(t, a), t.lanes = 536870912, e.memoizedState = { baseLanes: 0, cachePool: null }, Kn(null, e);
        if ($c(t), (e = qe) ? (e = Xm(
          e,
          Bt
        ), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
          dehydrated: e,
          treeContext: Cl !== null ? { id: Wt, overflow: It } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, l = Io(e), l.return = t, t.child = l, Fe = t, qe = null)) : e = null, e === null) throw Rl(t);
        return t.lanes = 536870912, null;
      }
      return ri(t, a);
    }
    var u = e.memoizedState;
    if (u !== null) {
      var i = u.dehydrated;
      if ($c(t), n)
        if (t.flags & 256)
          t.flags &= -257, t = vd(
            e,
            t,
            l
          );
        else if (t.memoizedState !== null)
          t.child = e.child, t.flags |= 128, t = null;
        else throw Error(o(558));
      else if (Ve || sa(e, t, l, !1), n = (l & e.childLanes) !== 0, Ve || n) {
        if (Bl.current === null) {
          if (a = De, a !== null && (i = eo(a, l), i !== 0 && i !== u.retryLane))
            throw u.retryLane = i, na(e, i), pt(a, e, i), gs;
          Ri();
        }
        t = vd(
          e,
          t,
          l
        );
      } else
        e = u.treeContext, qe = Gt(i.nextSibling), Fe = t, me = !0, Ol = null, Bt = !1, e !== null && tr(t, e), t = ri(t, a), t.flags |= 134221824;
      return t;
    }
    return e = ml(e.child, {
      mode: a.mode,
      children: a.children
    }), e.ref = t.ref, t.child = e, e.return = t, e;
  }
  function Ka(e, t) {
    var l = t.ref;
    if (l === null)
      e !== null && e.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof l != "function" && typeof l != "object")
        throw Error(o(284));
      (e === null || e.ref !== l) && (t.flags |= 4194816);
    }
  }
  function ps(e, t, l, a, n) {
    return fa(t), l = Pc(
      e,
      t,
      l,
      a,
      void 0,
      n
    ), a = es(), e !== null && !Ve ? (ts(e, t, n), bl(e, t, n)) : (me && a && Lu(t), t.flags |= 1, Je(e, t, l, n), t.child);
  }
  function yd(e, t, l, a, n, u) {
    return fa(t), t.updateQueue = null, l = br(
      t,
      a,
      l,
      n
    ), pr(e), a = es(), e !== null && !Ve ? (ts(e, t, u), bl(e, t, u)) : (me && a && Lu(t), t.flags |= 1, Je(e, t, l, u), t.child);
  }
  function gd(e, t, l, a, n) {
    if (fa(t), t.stateNode === null) {
      var u = Ha, i = l.contextType;
      typeof i == "object" && i !== null && (u = et(i)), u = new l(a, u), t.memoizedState = u.state !== null && u.state !== void 0 ? u.state : null, u.updater = vs, t.stateNode = u, u._reactInternals = t, u = t.stateNode, u.props = a, u.state = t.memoizedState, u.refs = {}, Vc(t), i = l.contextType, u.context = typeof i == "object" && i !== null ? et(i) : Ha, u.state = t.memoizedState, i = l.getDerivedStateFromProps, typeof i == "function" && (hs(
        t,
        l,
        i,
        a
      ), u.state = t.memoizedState), typeof l.getDerivedStateFromProps == "function" || typeof u.getSnapshotBeforeUpdate == "function" || typeof u.UNSAFE_componentWillMount != "function" && typeof u.componentWillMount != "function" || (i = u.state, typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount(), i !== u.state && vs.enqueueReplaceState(u, u.state, null), Xn(t, a, u, n), Qn(), u.state = t.memoizedState), typeof u.componentDidMount == "function" && (t.flags |= 4194308), a = !0;
    } else if (e === null) {
      u = t.stateNode;
      var f = t.memoizedProps, r = ya(l, f);
      u.props = r;
      var p = u.context, T = l.contextType;
      i = Ha, typeof T == "object" && T !== null && (i = et(T));
      var O = l.getDerivedStateFromProps;
      T = typeof O == "function" || typeof u.getSnapshotBeforeUpdate == "function", f = t.pendingProps !== f, T || typeof u.UNSAFE_componentWillReceiveProps != "function" && typeof u.componentWillReceiveProps != "function" || (f || p !== i) && ad(
        t,
        u,
        a,
        i
      ), Ul = !1;
      var y = t.memoizedState;
      u.state = y, Xn(t, a, u, n), Qn(), p = t.memoizedState, f || y !== p || Ul ? (typeof O == "function" && (hs(
        t,
        l,
        O,
        a
      ), p = t.memoizedState), (r = Ul || ld(
        t,
        l,
        r,
        a,
        y,
        p,
        i
      )) ? (T || typeof u.UNSAFE_componentWillMount != "function" && typeof u.componentWillMount != "function" || (typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount()), typeof u.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof u.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = a, t.memoizedState = p), u.props = a, u.state = p, u.context = i, a = r) : (typeof u.componentDidMount == "function" && (t.flags |= 4194308), a = !1);
    } else {
      u = t.stateNode, wc(e, t), i = t.memoizedProps, T = ya(l, i), u.props = T, O = t.pendingProps, y = u.context, p = l.contextType, r = Ha, typeof p == "object" && p !== null && (r = et(p)), f = l.getDerivedStateFromProps, (p = typeof f == "function" || typeof u.getSnapshotBeforeUpdate == "function") || typeof u.UNSAFE_componentWillReceiveProps != "function" && typeof u.componentWillReceiveProps != "function" || (i !== O || y !== r) && ad(
        t,
        u,
        a,
        r
      ), Ul = !1, y = t.memoizedState, u.state = y, Xn(t, a, u, n), Qn();
      var _ = t.memoizedState;
      i !== O || y !== _ || Ul || e !== null && e.dependencies !== null && Ku(e.dependencies) ? (typeof f == "function" && (hs(
        t,
        l,
        f,
        a
      ), _ = t.memoizedState), (T = Ul || ld(
        t,
        l,
        T,
        a,
        y,
        _,
        r
      ) || e !== null && e.dependencies !== null && Ku(e.dependencies)) ? (p || typeof u.UNSAFE_componentWillUpdate != "function" && typeof u.componentWillUpdate != "function" || (typeof u.componentWillUpdate == "function" && u.componentWillUpdate(a, _, r), typeof u.UNSAFE_componentWillUpdate == "function" && u.UNSAFE_componentWillUpdate(
        a,
        _,
        r
      )), typeof u.componentDidUpdate == "function" && (t.flags |= 4), typeof u.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof u.componentDidUpdate != "function" || i === e.memoizedProps && y === e.memoizedState || (t.flags |= 4), typeof u.getSnapshotBeforeUpdate != "function" || i === e.memoizedProps && y === e.memoizedState || (t.flags |= 1024), t.memoizedProps = a, t.memoizedState = _), u.props = a, u.state = _, u.context = r, a = T) : (typeof u.componentDidUpdate != "function" || i === e.memoizedProps && y === e.memoizedState || (t.flags |= 4), typeof u.getSnapshotBeforeUpdate != "function" || i === e.memoizedProps && y === e.memoizedState || (t.flags |= 1024), a = !1);
    }
    return u = a, Ka(e, t), a = (t.flags & 128) !== 0, u || a ? (u = t.stateNode, l = a && typeof l.getDerivedStateFromError != "function" ? null : u.render(), t.flags |= 1, e !== null && a ? (t.child = ha(
      t,
      e.child,
      null,
      n
    ), t.child = ha(
      t,
      null,
      l,
      n
    )) : Je(e, t, l, n), t.memoizedState = u.state, e = t.child) : e = bl(
      e,
      t,
      n
    ), e;
  }
  function pd(e, t, l, a) {
    return ia(), t.flags |= 256, Je(e, t, l, a), t.child;
  }
  var bs = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function Ss(e) {
    return { baseLanes: e, cachePool: cr() };
  }
  function _s(e, t, l) {
    return e = e !== null ? e.childLanes & ~l : 0, t && (e |= zt), e;
  }
  function bd(e, t, l) {
    var a = t.pendingProps, n = !1, u = (t.flags & 128) !== 0, i;
    if ((i = u) || (i = e !== null && e.memoizedState === null ? !1 : (lt.current & 2) !== 0), i && (n = !0, t.flags &= -129), i = (t.flags & 32) !== 0, t.flags &= -33, e === null) {
      if (me) {
        if (n ? Yl(t) : Gl(), (e = qe) ? (e = Xm(
          e,
          Bt
        ), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
          dehydrated: e,
          treeContext: Cl !== null ? { id: Wt, overflow: It } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, l = Io(e), l.return = t, t.child = l, Fe = t, qe = null)) : e = null, e === null) throw Rl(t);
        return _f(e) ? t.lanes = 32 : t.lanes = 536870912, null;
      }
      return u = a.children, a = a.fallback, n ? (Gl(), n = t.mode, u = di(
        { mode: "hidden", children: u },
        n
      ), a = ua(
        a,
        n,
        l,
        null
      ), u.return = t, a.return = t, u.sibling = a, t.child = u, a = t.child, a.memoizedState = Ss(l), a.childLanes = _s(
        e,
        i,
        l
      ), t.memoizedState = bs, Kn(null, a)) : (Yl(t), Ts(t, u));
    }
    var f = e.memoizedState;
    if (f !== null) {
      var r = f.dehydrated;
      if (r !== null)
        return n0(
          e,
          t,
          u,
          i,
          a,
          r,
          f,
          l
        );
    }
    return n ? (Gl(), n = a.fallback, u = t.mode, f = e.child, r = f.sibling, a = ml(f, {
      mode: "hidden",
      children: a.children
    }), a.subtreeFlags = f.subtreeFlags & 1206910976, r !== null ? n = ml(r, n) : (n = ua(
      n,
      u,
      l,
      null
    ), n.flags |= 2), n.return = t, a.return = t, a.sibling = n, t.child = a, Kn(null, a), a = t.child, n = e.child.memoizedState, n === null ? n = Ss(l) : (u = n.cachePool, u !== null ? (f = Ze._currentValue, u = u.parent !== f ? { parent: f, pool: f } : u) : u = cr(), n = {
      baseLanes: n.baseLanes | l,
      cachePool: u
    }), a.memoizedState = n, a.childLanes = _s(
      e,
      i,
      l
    ), t.memoizedState = bs, Kn(e.child, a)) : (Yl(t), l = e.child, e = l.sibling, l = ml(l, {
      mode: "visible",
      children: a.children
    }), l.return = t, l.sibling = null, e !== null && (i = t.deletions, i === null ? (t.deletions = [e], t.flags |= 16) : i.push(e)), t.child = l, t.memoizedState = null, l);
  }
  function Ts(e, t) {
    return t = di(
      { mode: "visible", children: t },
      e.mode
    ), t.return = e, e.child = t;
  }
  function di(e, t) {
    return e = ht(22, e, null, t), e.lanes = 0, e;
  }
  function mi(e, t, l) {
    return ha(t, e.child, null, l), e = Ts(
      t,
      t.pendingProps.children
    ), e.flags |= 2, t.memoizedState = null, e;
  }
  function n0(e, t, l, a, n, u, i, f) {
    if (l)
      return t.flags & 256 ? (Yl(t), t.flags &= -257, mi(
        e,
        t,
        f
      )) : t.memoizedState !== null ? (Gl(), t.child = e.child, t.flags |= 128, null) : (Gl(), u = n.fallback, i = t.mode, n = di(
        { mode: "visible", children: n.children },
        i
      ), u = ua(
        u,
        i,
        f,
        null
      ), u.flags |= 2, n.return = t, u.return = t, n.sibling = u, t.child = n, ha(t, e.child, null, f), n = t.child, n.memoizedState = Ss(f), n.childLanes = _s(
        e,
        a,
        f
      ), t.memoizedState = bs, Kn(null, n));
    if (Yl(t), _f(u)) {
      if (a = u.nextSibling && u.nextSibling.dataset, a) var r = a.dgst;
      return a = r, a !== "" && (n = Error(o(419)), n.stack = "", n.digest = a, Un({ value: n, source: null, stack: null })), mi(
        e,
        t,
        f
      );
    }
    if (Ve || sa(e, t, f, !1), a = (f & e.childLanes) !== 0, Ve || a) {
      if (Bl.current !== null)
        return mi(
          e,
          t,
          f
        );
      if (a = De, a !== null && (n = eo(
        a,
        f
      ), n !== 0 && n !== i.retryLane))
        throw i.retryLane = n, na(e, n), pt(a, e, n), gs;
      return Sf(u) || Ri(), mi(
        e,
        t,
        f
      );
    }
    return Sf(u) ? (t.flags |= 192, t.child = e.child, null) : (e = i.treeContext, qe = Gt(u.nextSibling), Fe = t, me = !0, Ol = null, Bt = !1, e !== null && tr(t, e), t = Ts(
      t,
      n.children
    ), t.flags |= 134221824, t);
  }
  function Sd(e, t, l) {
    e.lanes |= t;
    var a = e.alternate;
    a !== null && (a.lanes |= t), wu(e.return, t, l);
  }
  function _d(e) {
    for (var t = null; e !== null; ) {
      var l = e.alternate;
      l !== null && ei(l) === null && (t = e), e = e.sibling;
    }
    return t;
  }
  function hi(e, t, l, a, n, u) {
    var i = e.memoizedState;
    i === null ? e.memoizedState = {
      isBackwards: t,
      rendering: null,
      renderingStartTime: 0,
      last: a,
      tail: l,
      tailMode: n,
      treeForkCount: u
    } : (i.isBackwards = t, i.rendering = null, i.renderingStartTime = 0, i.last = a, i.tail = l, i.tailMode = n, i.treeForkCount = u);
  }
  function Es(e) {
    var t = e.child;
    for (e.child = null; t !== null; ) {
      var l = t.sibling;
      t.sibling = e.child, e.child = t, t = l;
    }
  }
  function xs(e, t, l) {
    var a = t.pendingProps, n = a.revealOrder, u = a.tail;
    a = a.children;
    var i = lt.current;
    if (t.flags & 128)
      return Zn(t, i), null;
    var f = (i & 2) !== 0;
    if (f ? (i = i & 1 | 2, t.flags |= 128) : i &= 1, Zn(t, i), n === "backwards" && e !== null ? (Es(e), Je(e, t, a, l), Es(e)) : Je(e, t, a, l), a = me ? Dn : 0, !f && e !== null && (e.flags & 128) !== 0)
      e: for (e = t.child; e !== null; ) {
        if (e.tag === 13)
          e.memoizedState !== null && Sd(e, l, t);
        else if (e.tag === 19)
          Sd(e, l, t);
        else if (e.child !== null) {
          e.child.return = e, e = e.child;
          continue;
        }
        if (e === t) break e;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t)
            break e;
          e = e.return;
        }
        e.sibling.return = e.return, e = e.sibling;
      }
    switch (n) {
      case "backwards":
        l = _d(t.child), l === null ? (n = t.child, t.child = null) : (n = l.sibling, l.sibling = null, Es(t)), hi(
          t,
          !0,
          n,
          null,
          u,
          a
        );
        break;
      case "unstable_legacy-backwards":
        for (l = null, n = t.child, t.child = null; n !== null; ) {
          if (e = n.alternate, e !== null && ei(e) === null) {
            t.child = n;
            break;
          }
          e = n.sibling, n.sibling = l, l = n, n = e;
        }
        hi(
          t,
          !0,
          l,
          null,
          u,
          a
        );
        break;
      case "together":
        hi(
          t,
          !1,
          null,
          null,
          void 0,
          a
        );
        break;
      case "independent":
        t.memoizedState = null;
        break;
      default:
        l = _d(t.child), l === null ? (n = t.child, t.child = null) : (n = l.sibling, l.sibling = null), hi(
          t,
          !1,
          n,
          l,
          u,
          a
        );
    }
    return t.child;
  }
  function Td(e, t, l) {
    var a = t.pendingProps;
    return Ml(t, t.type, a.value), Je(e, t, a.children, l), t.child;
  }
  function bl(e, t, l) {
    if (e !== null && (t.dependencies = e.dependencies), Ll |= t.lanes, (l & t.childLanes) === 0)
      if (e !== null) {
        if (sa(
          e,
          t,
          l,
          !1
        ), (l & t.childLanes) === 0)
          return null;
      } else return null;
    if (e !== null && t.child !== e.child)
      throw Error(o(153));
    if (t.child !== null) {
      for (e = t.child, l = ml(e, e.pendingProps), t.child = l, l.return = t; e.sibling !== null; )
        e = e.sibling, l = l.sibling = ml(e, e.pendingProps), l.return = t;
      l.sibling = null;
    }
    return t.child;
  }
  function Ns(e, t) {
    return (e.lanes & t) !== 0 ? !0 : (e = e.dependencies, !!(e !== null && Ku(e)));
  }
  function u0(e, t, l) {
    switch (t.tag) {
      case 3:
        bu(t, t.stateNode.containerInfo), Ml(t, Ze, e.memoizedState.cache), ia();
        break;
      case 27:
      case 5:
        Ii(t);
        break;
      case 4:
        bu(t, t.stateNode.containerInfo);
        break;
      case 10:
        Ml(
          t,
          t.type,
          t.memoizedProps.value
        );
        break;
      case 31:
        if (t.memoizedState !== null)
          return t.flags |= 128, $c(t), null;
        break;
      case 13:
        var a = t.memoizedState;
        if (a !== null) {
          if (a.dehydrated !== null)
            return Yl(t), t.flags |= 128, null;
          a = sa(
            e,
            t,
            l,
            !1
          );
          var n = t.child.childLanes;
          return a || (l & n) !== 0 ? bd(e, t, l) : (Yl(t), e = bl(
            e,
            t,
            l
          ), e !== null ? e.sibling : null);
        }
        Yl(t);
        break;
      case 19:
        if (t.flags & 128)
          return xs(
            e,
            t,
            l
          );
        if (n = (e.flags & 128) !== 0, a = (l & t.childLanes) !== 0, a || (sa(
          e,
          t,
          l,
          !1
        ), a = (l & t.childLanes) !== 0), n) {
          if (a)
            return xs(
              e,
              t,
              l
            );
          t.flags |= 128;
        }
        if (n = t.memoizedState, n !== null && (n.rendering = null, n.tail = null, n.lastEffect = null), Zn(t, lt.current), a) break;
        return null;
      case 22:
        return t.lanes = 0, md(
          e,
          t,
          l,
          t.pendingProps
        );
      case 24:
        Ml(t, Ze, e.memoizedState.cache);
    }
    return bl(e, t, l);
  }
  function Ed(e, t, l) {
    if (e !== null)
      if (e.memoizedProps !== t.pendingProps)
        Ve = !0;
      else {
        if (!Ns(e, l) && (t.flags & 128) === 0)
          return Ve = !1, u0(
            e,
            t,
            l
          );
        Ve = (e.flags & 131072) !== 0;
      }
    else
      Ve = !1, me && (t.flags & 1048576) !== 0 && er(t, Dn, t.index);
    switch (t.lanes = 0, t.tag) {
      case 16:
        e: {
          var a = t.pendingProps;
          if (e = da(t.elementType), t.type = e, typeof e == "function")
            Mc(e) ? (a = ya(e, a), t.tag = 1, t = gd(
              null,
              t,
              e,
              a,
              l
            )) : (t.tag = 0, t = ps(
              null,
              t,
              e,
              a,
              l
            ));
          else {
            if (e != null) {
              var n = e.$$typeof;
              if (n === q) {
                t.tag = 11, t = od(
                  null,
                  t,
                  e,
                  a,
                  l
                );
                break e;
              } else if (n === xe) {
                t.tag = 14, t = rd(
                  null,
                  t,
                  e,
                  a,
                  l
                );
                break e;
              } else if (n === ee) {
                t.tag = 10, t.type = e, t = Td(
                  null,
                  t,
                  l
                );
                break e;
              }
            }
            throw t = Z(e) || e, Error(o(306, t, ""));
          }
        }
        return t;
      case 0:
        return ps(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 1:
        return a = t.type, n = ya(
          a,
          t.pendingProps
        ), gd(
          e,
          t,
          a,
          n,
          l
        );
      case 3:
        e: {
          if (bu(
            t,
            t.stateNode.containerInfo
          ), e === null) throw Error(o(387));
          a = t.pendingProps;
          var u = t.memoizedState;
          n = u.element, wc(e, t), Xn(t, a, null, l);
          var i = t.memoizedState;
          if (a = i.cache, Ml(t, Ze, a), a !== u.cache && Gc(
            t,
            [Ze],
            l,
            !0
          ), Qn(), a = i.element, u.isDehydrated)
            if (u = {
              element: a,
              isDehydrated: !1,
              cache: i.cache
            }, t.updateQueue.baseState = u, t.memoizedState = u, t.flags & 256) {
              t = pd(
                e,
                t,
                a,
                l
              );
              break e;
            } else if (a !== n) {
              n = Ut(
                Error(o(424)),
                t
              ), Un(n), t = pd(
                e,
                t,
                a,
                l
              );
              break e;
            } else
              for (e = t.stateNode.containerInfo, e.nodeType === 9 ? e = e.body : e = e.nodeName === "HTML" ? e.ownerDocument.body : e, qe = Gt(e.firstChild), Fe = t, me = !0, Ol = null, Bt = !0, l = mr(
                t,
                null,
                a,
                l
              ), t.child = l; l; )
                l.flags = l.flags & -3 | 134221824, l = l.sibling;
          else {
            if (ia(), a === n) {
              t = bl(
                e,
                t,
                l
              );
              break e;
            }
            Je(e, t, a, l);
          }
          t = t.child;
        }
        return t;
      case 26:
        return Ka(e, t), e === null ? (l = km(
          t.type,
          null,
          t.pendingProps,
          null
        )) ? t.memoizedState = l : me || (t.stateNode = Am(
          t.type,
          t.pendingProps,
          xl.current,
          t
        )) : t.memoizedState = km(
          t.type,
          e.memoizedProps,
          t.pendingProps,
          e.memoizedState
        ), null;
      case 27:
        return Ii(t), e === null && me && (a = t.stateNode = Vm(
          t.type,
          t.pendingProps,
          xl.current
        ), Fe = t, Bt = !0, n = qe, Jl(t.type) ? (Tf = n, qe = Gt(a.firstChild)) : qe = n), Je(
          e,
          t,
          t.pendingProps.children,
          l
        ), Ka(e, t), e === null && (t.flags |= 4194304), t.child;
      case 5:
        return e === null && me && ((n = a = qe) && (a = P0(
          a,
          t.type,
          t.pendingProps,
          Bt
        ), a !== null ? (t.stateNode = a, Fe = t, qe = Gt(a.firstChild), Bt = !1, n = !0) : n = !1), n || Rl(t)), Ii(t), n = t.type, u = t.pendingProps, i = e !== null ? e.memoizedProps : null, a = u.children, mf(n, u) ? a = null : i !== null && mf(n, i) && (t.flags |= 32), t.memoizedState !== null && (n = Pc(
          e,
          t,
          kv,
          null,
          null,
          l
        ), rn._currentValue = n), Ka(e, t), Je(e, t, a, l), t.child;
      case 6:
        return e === null && me && ((e = l = qe) && (l = ey(
          l,
          t.pendingProps,
          Bt
        ), l !== null ? (t.stateNode = l, Fe = t, qe = null, e = !0) : e = !1), e || Rl(t)), null;
      case 13:
        return bd(e, t, l);
      case 4:
        return bu(
          t,
          t.stateNode.containerInfo
        ), a = t.pendingProps, e === null ? t.child = ha(
          t,
          null,
          a,
          l
        ) : Je(e, t, a, l), t.child;
      case 11:
        return od(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 7:
        return a = t.pendingProps, Ka(e, t), Je(e, t, a, l), t.child;
      case 8:
        return Je(
          e,
          t,
          t.pendingProps.children,
          l
        ), t.child;
      case 12:
        return Je(
          e,
          t,
          t.pendingProps.children,
          l
        ), t.child;
      case 10:
        return Td(e, t, l);
      case 9:
        return n = t.type._context, a = t.pendingProps.children, fa(t), n = et(n), a = a(n), t.flags |= 1, Je(e, t, a, l), t.child;
      case 14:
        return rd(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 15:
        return dd(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 19:
        return xs(e, t, l);
      case 31:
        return a0(e, t, l);
      case 22:
        return md(
          e,
          t,
          l,
          t.pendingProps
        );
      case 24:
        return fa(t), a = et(Ze), e === null ? (n = Zc(), n === null && (n = De, u = Qc(), n.pooledCache = u, u.refCount++, u !== null && (n.pooledCacheLanes |= l), n = u), t.memoizedState = { parent: a, cache: n }, Vc(t), Ml(t, Ze, n)) : ((e.lanes & l) !== 0 && (wc(e, t), Xn(t, null, null, l), Qn()), n = e.memoizedState, u = t.memoizedState, n.parent !== a ? (n = { parent: a, cache: a }, t.memoizedState = n, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = n), Ml(t, Ze, a)) : (a = u.cache, Ml(t, Ze, a), a !== n.cache && Gc(
          t,
          [Ze],
          l,
          !0
        ))), Je(
          e,
          t,
          t.pendingProps.children,
          l
        ), t.child;
      case 30:
        return t.stateNode === null && (t.stateNode = {
          autoName: null,
          paired: null,
          clones: null,
          ref: null
        }), a = t.pendingProps, a.name != null && a.name !== "auto" ? t.flags |= e === null ? 18882560 : 18874368 : me && Lu(t), e !== null && e.memoizedProps.name !== a.name ? t.flags |= 4194816 : Ka(e, t), Je(e, t, a.children, l), t.child;
      case 29:
        throw t.pendingProps;
    }
    throw Error(o(156, t.tag));
  }
  function Sl(e) {
    e.flags |= 4;
  }
  function js(e, t, l, a, n) {
    var u;
    if ((u = (e.mode & 32) !== 0) && (u = l === null ? Im(t, a) : Im(t, a) && (a.src !== l.src || a.srcSet !== l.srcSet)), u) {
      if (e.flags |= 16777216, (n & 335544128) === n)
        if (e.stateNode.complete) e.flags |= 8192;
        else if (nm()) e.flags |= 8192;
        else
          throw ma = $u, Lc;
    } else e.flags &= -16777217;
  }
  function xd(e, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0)
      e.flags &= -16777217;
    else if (e.flags |= 16777216, !Pm(t))
      if (nm()) e.flags |= 8192;
      else
        throw ma = $u, Lc;
  }
  function vi(e, t) {
    t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag !== 22 ? Wf() : 536870912, e.lanes |= t, Wa |= t);
  }
  function Jn(e, t) {
    if (!me)
      switch (e.tailMode) {
        case "visible":
          break;
        case "collapsed":
          for (var l = e.tail, a = null; l !== null; )
            l.alternate !== null && (a = l), l = l.sibling;
          a === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : a.sibling = null;
          break;
        default:
          for (t = e.tail, l = null; t !== null; )
            t.alternate !== null && (l = t), t = t.sibling;
          l === null ? e.tail = null : l.sibling = null;
      }
  }
  function He(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, l = 0, a = 0;
    if (t)
      for (var n = e.child; n !== null; )
        l |= n.lanes | n.childLanes, a |= n.subtreeFlags & 1206910976, a |= n.flags & 1206910976, n.return = e, n = n.sibling;
    else
      for (n = e.child; n !== null; )
        l |= n.lanes | n.childLanes, a |= n.subtreeFlags, a |= n.flags, n.return = e, n = n.sibling;
    return e.subtreeFlags |= a, e.childLanes = l, t;
  }
  function i0(e, t, l) {
    var a = t.pendingProps;
    switch (qc(t), t.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return He(t), null;
      case 1:
        return He(t), null;
      case 3:
        return l = t.stateNode, a = null, e !== null && (a = e.memoizedState.cache), t.memoizedState.cache !== a && (t.flags |= 2048), yl(Ze), Ea(), l.pendingContext && (l.context = l.pendingContext, l.pendingContext = null), (e === null || e.child === null) && (Ga(t) ? Sl(t) : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, Bc())), He(t), null;
      case 26:
        var n = t.type, u = t.memoizedState;
        return e === null ? (Sl(t), u !== null ? (He(t), xd(t, u)) : (He(t), js(
          t,
          n,
          null,
          a,
          l
        ))) : u ? u !== e.memoizedState ? (Sl(t), He(t), xd(t, u)) : (He(t), t.flags &= -16777217) : (e = e.memoizedProps, e !== a && Sl(t), He(t), js(
          t,
          n,
          e,
          a,
          l
        )), null;
      case 27:
        if (Su(t), l = xl.current, n = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== a && Sl(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(o(166));
            return He(t), t.subtreeFlags &= -33554433, null;
          }
          e = Ft.current, Ga(t) ? lr(t) : (e = Vm(n, a, l), t.stateNode = e, Sl(t));
        }
        return He(t), t.subtreeFlags &= -33554433, null;
      case 5:
        if (Su(t), n = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== a && Sl(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(o(166));
            return He(t), t.subtreeFlags &= -33554433, null;
          }
          if (u = Ft.current, Ga(t))
            lr(t);
          else {
            var i = nu(
              xl.current
            );
            switch (u) {
              case 1:
                u = i.createElementNS(
                  "http://www.w3.org/2000/svg",
                  n
                );
                break;
              case 2:
                u = i.createElementNS(
                  "http://www.w3.org/1998/Math/MathML",
                  n
                );
                break;
              default:
                switch (n) {
                  case "svg":
                    u = i.createElementNS(
                      "http://www.w3.org/2000/svg",
                      n
                    );
                    break;
                  case "math":
                    u = i.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      n
                    );
                    break;
                  case "script":
                    u = i.createElement("div"), u.innerHTML = "<script><\/script>", u = u.removeChild(
                      u.firstChild
                    );
                    break;
                  case "select":
                    u = typeof a.is == "string" ? i.createElement("select", {
                      is: a.is
                    }) : i.createElement("select"), a.multiple ? u.multiple = !0 : a.size && (u.size = a.size);
                    break;
                  default:
                    u = typeof a.is == "string" ? i.createElement(n, { is: a.is }) : i.createElement(n);
                }
            }
            u[Pe] = t, u[mt] = a;
            e: for (i = t.child; i !== null; ) {
              if (i.tag === 5 || i.tag === 6)
                u.appendChild(i.stateNode);
              else if (i.tag !== 4 && i.tag !== 27 && i.child !== null) {
                i.child.return = i, i = i.child;
                continue;
              }
              if (i === t) break e;
              for (; i.sibling === null; ) {
                if (i.return === null || i.return === t)
                  break e;
                i = i.return;
              }
              i.sibling.return = i.return, i = i.sibling;
            }
            t.stateNode = u;
            e: switch (nt(u, n, a), n) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                a = !!a.autoFocus;
                break e;
              case "img":
                a = !0;
                break e;
              default:
                a = !1;
            }
            a && Sl(t);
          }
        }
        return He(t), t.subtreeFlags &= -33554433, js(
          t,
          t.type,
          e === null ? null : e.memoizedProps,
          t.pendingProps,
          l
        ), null;
      case 6:
        if (e && t.stateNode != null)
          e.memoizedProps !== a && Sl(t);
        else {
          if (typeof a != "string" && t.stateNode === null)
            throw Error(o(166));
          if (e = xl.current, Ga(t)) {
            if (e = t.stateNode, l = t.memoizedProps, a = null, n = Fe, n !== null)
              switch (n.tag) {
                case 27:
                case 5:
                  a = n.memoizedProps;
              }
            e[Pe] = t, e = !!(e.nodeValue === l || a !== null && a.suppressHydrationWarning === !0 || Em(e.nodeValue, l)), e || Rl(t, !0);
          } else
            e = nu(e).createTextNode(
              a
            ), e[Pe] = t, t.stateNode = e;
        }
        return He(t), null;
      case 31:
        if (l = t.memoizedState, e === null || e.memoizedState !== null) {
          if (a = Ga(t), l !== null) {
            if (e === null) {
              if (!a) throw Error(o(318));
              if (e = t.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(o(557));
              e[Pe] = t;
            } else
              ia(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            He(t), e = !1;
          } else
            l = Bc(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = l), e = !0;
          if (!e)
            return t.flags & 256 ? (Nt(t), t) : (Nt(t), null);
          if ((t.flags & 128) !== 0)
            throw Error(o(558));
        }
        return He(t), null;
      case 13:
        if (a = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (n = Ga(t), a !== null && a.dehydrated !== null) {
            if (e === null) {
              if (!n) throw Error(o(318));
              if (n = t.memoizedState, n = n !== null ? n.dehydrated : null, !n) throw Error(o(317));
              n[Pe] = t;
            } else
              ia(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            He(t), n = !1;
          } else
            n = Bc(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), n = !0;
          if (!n)
            return t.flags & 256 ? (Nt(t), t) : (Nt(t), null);
        }
        return Nt(t), (t.flags & 128) !== 0 ? (t.lanes = l, t) : (l = a !== null, e = e !== null && e.memoizedState !== null, l && (a = t.child, n = null, a.alternate !== null && a.alternate.memoizedState !== null && a.alternate.memoizedState.cachePool !== null && (n = a.alternate.memoizedState.cachePool.pool), u = null, a.memoizedState !== null && a.memoizedState.cachePool !== null && (u = a.memoizedState.cachePool.pool), u !== n && (a.flags |= 2048)), l !== e && l && (t.child.flags |= 8192), vi(t, t.updateQueue), He(t), null);
      case 4:
        return Ea(), e === null && sf(t.stateNode.containerInfo), t.flags |= 67108864, He(t), null;
      case 10:
        return yl(t.type), He(t), null;
      case 19:
        if (Wc(t), a = t.memoizedState, a === null) return He(t), null;
        if (n = (t.flags & 128) !== 0, u = a.rendering, u === null)
          if (n) Jn(a, !1);
          else {
            if (Qe !== 0 || e !== null && (e.flags & 128) !== 0)
              for (e = t.child; e !== null; ) {
                if (u = ei(e), u !== null) {
                  for (t.flags |= 128, Jn(a, !1), e = u.updateQueue, t.updateQueue = e, vi(t, e), t.subtreeFlags = 0, e = l, l = t.child; l !== null; )
                    Wo(l, e), l = l.sibling;
                  return Zn(
                    t,
                    lt.current & 1 | 2
                  ), me && hl(t, a.treeForkCount), t.child;
                }
                e = e.sibling;
              }
            a.tail !== null && St() > Ai && (t.flags |= 128, n = !0, Jn(a, !1), t.lanes = 4194304);
          }
        else {
          if (!n)
            if (e = ei(u), e !== null) {
              if (t.flags |= 128, n = !0, e = e.updateQueue, t.updateQueue = e, vi(t, e), Jn(a, !0), a.tail === null && a.tailMode !== "collapsed" && a.tailMode !== "visible" && !u.alternate && !me)
                return He(t), null;
            } else
              2 * St() - a.renderingStartTime > Ai && l !== 536870912 && (t.flags |= 128, n = !0, Jn(a, !1), t.lanes = 4194304);
          a.isBackwards ? (u.sibling = t.child, t.child = u) : (e = a.last, e !== null ? e.sibling = u : t.child = u, a.last = u);
        }
        if (a.tail !== null) {
          e = a.tail;
          e: {
            for (l = e; l !== null; ) {
              if (l.alternate !== null) {
                l = !1;
                break e;
              }
              l = l.sibling;
            }
            l = !0;
          }
          return a.rendering = e, a.tail = e.sibling, a.renderingStartTime = St(), e.sibling = null, u = lt.current, u = n ? u & 1 | 2 : u & 1, a.tailMode === "visible" || a.tailMode === "collapsed" || !l || me ? Zn(t, u) : (l = u, Ue(tt, t), Ue(lt, l), ct === null && (ct = t)), me && hl(t, a.treeForkCount), e;
        }
        return He(t), null;
      case 22:
      case 23:
        return Nt(t), Fc(), a = t.memoizedState !== null, e !== null ? e.memoizedState !== null !== a && (t.flags |= 8192) : a && (t.flags |= 8192), a ? (l & 536870912) !== 0 && (t.flags & 128) === 0 && (He(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : He(t), l = t.updateQueue, l !== null && vi(t, l.retryQueue), l = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (l = e.memoizedState.cachePool.pool), a = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (a = t.memoizedState.cachePool.pool), a !== l && (t.flags |= 2048), e !== null && Ie(ra), null;
      case 24:
        return l = null, e !== null && (l = e.memoizedState.cache), t.memoizedState.cache !== l && (t.flags |= 2048), yl(Ze), He(t), null;
      case 25:
        return null;
      case 30:
        return t.flags |= 33554432, He(t), null;
    }
    throw Error(o(156, t.tag));
  }
  function c0(e, t) {
    switch (qc(t), t.tag) {
      case 1:
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return yl(Ze), Ea(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 26:
      case 27:
      case 5:
        return Su(t), null;
      case 31:
        if (t.memoizedState !== null) {
          if (Nt(t), t.alternate === null)
            throw Error(o(340));
          ia();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 13:
        if (Nt(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null)
            throw Error(o(340));
          ia();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return Wc(t), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, e = t.memoizedState, e !== null && (e.rendering = null, e.tail = null), t.flags |= 4, t) : null;
      case 4:
        return Ea(), null;
      case 10:
        return yl(t.type), null;
      case 22:
      case 23:
        return Nt(t), Fc(), e !== null && Ie(ra), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 24:
        return yl(Ze), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function Nd(e, t) {
    switch (qc(t), t.tag) {
      case 3:
        yl(Ze), Ea();
        break;
      case 26:
      case 27:
      case 5:
        Su(t);
        break;
      case 4:
        Ea();
        break;
      case 31:
        t.memoizedState !== null && Nt(t);
        break;
      case 13:
        Nt(t);
        break;
      case 19:
        Wc(t);
        break;
      case 10:
        yl(t.type);
        break;
      case 22:
      case 23:
        Nt(t), Fc(), e !== null && Ie(ra);
        break;
      case 24:
        yl(Ze);
    }
  }
  function kn(e, t) {
    try {
      var l = t.updateQueue, a = l !== null ? l.lastEffect : null;
      if (a !== null) {
        var n = a.next;
        l = n;
        do {
          if ((l.tag & e) === e) {
            a = void 0;
            var u = l.create, i = l.inst;
            a = u(), i.destroy = a;
          }
          l = l.next;
        } while (l !== n);
      }
    } catch (f) {
      Ce(t, t.return, f);
    }
  }
  function Ql(e, t, l) {
    try {
      var a = t.updateQueue, n = a !== null ? a.lastEffect : null;
      if (n !== null) {
        var u = n.next;
        a = u;
        do {
          if ((a.tag & e) === e) {
            var i = a.inst, f = i.destroy;
            if (f !== void 0) {
              i.destroy = void 0, n = t;
              var r = l, p = f;
              try {
                p();
              } catch (T) {
                Ce(
                  n,
                  r,
                  T
                );
              }
            }
          }
          a = a.next;
        } while (a !== u);
      }
    } catch (T) {
      Ce(t, t.return, T);
    }
  }
  function jd(e) {
    var t = e.updateQueue;
    if (t !== null) {
      var l = e.stateNode;
      try {
        vr(t, l);
      } catch (a) {
        Ce(e, e.return, a);
      }
    }
  }
  function Ad(e, t, l) {
    l.props = ya(
      e.type,
      e.memoizedProps
    ), l.state = e.memoizedState;
    try {
      l.componentWillUnmount();
    } catch (a) {
      Ce(e, t, a);
    }
  }
  function Pt(e, t) {
    try {
      var l = e.ref;
      if (l !== null) {
        switch (e.tag) {
          case 26:
          case 27:
          case 5:
            var a = e.stateNode;
            break;
          case 30:
            var n = e.stateNode, u = rl(e.memoizedProps, n);
            (n.ref === null || n.ref.name !== u) && (n.ref = Um(u)), a = n.ref;
            break;
          case 7:
            if (e.stateNode === null) {
              var i = new Ot(e);
              m(
                e.child,
                !1,
                W0,
                i,
                void 0,
                void 0
              ), e.stateNode = i;
            }
            a = e.stateNode;
            break;
          default:
            a = e.stateNode;
        }
        typeof l == "function" ? e.refCleanup = l(a) : l.current = a;
      }
    } catch (f) {
      Ce(e, t, f);
    }
  }
  function at(e, t) {
    var l = e.ref, a = e.refCleanup;
    if (l !== null)
      if (typeof a == "function")
        try {
          a();
        } catch (n) {
          Ce(e, t, n);
        } finally {
          e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
        }
      else if (typeof l == "function")
        try {
          l(null);
        } catch (n) {
          Ce(e, t, n);
        }
      else l.current = null;
  }
  function yi(e, t) {
    if ((e.tag === 5 || e.tag === 27 || e.tag === 6) && e.alternate === null && t !== null)
      for (var l = 0; l < t.length; l++)
        Qm(
          e.stateNode,
          t[l]
        );
  }
  function zd(e) {
    for (var t = e.return; t !== null && (zs(t) && Qm(e.stateNode, t.stateNode), !As(t)); )
      t = t.return;
  }
  function Fn(e) {
    for (var t = e.return; t !== null && (zs(t) && I0(e.stateNode, t.stateNode), !As(t)); )
      t = t.return;
  }
  function As(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 27;
  }
  function zs(e) {
    return e && e.tag === 7 && e.stateNode !== null;
  }
  function Cs(e) {
    var t = e.type, l = e.memoizedProps, a = e.stateNode;
    try {
      e: switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          l.autoFocus && a.focus();
          break e;
        case "img":
          l.src ? a.src = l.src : l.srcSet && (a.srcset = l.srcSet);
      }
    } catch (n) {
      Ce(e, e.return, n);
    }
  }
  function Os(e, t, l) {
    try {
      var a = e.stateNode;
      D0(a, e.type, l, t), a[mt] = t;
    } catch (n) {
      Ce(e, e.return, n);
    }
  }
  function Cd(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && Jl(e.type) || e.tag === 4;
  }
  function Rs(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || Cd(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.tag === 27 && Jl(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function Ms(e, t, l, a) {
    var n = e.tag;
    if (n === 5 || n === 6)
      n = e.stateNode, t ? (l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l).insertBefore(n, t) : (t = l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l, t.appendChild(n), l = l._reactRootContainer, l != null || t.onclick !== null || (t.onclick = $t)), yi(e, a), Ee = !0;
    else if (n !== 4 && (n === 27 && (yi(e, a), a = null, Jl(e.type) && (l = e.stateNode, t = null)), e = e.child, e !== null))
      for (Ms(
        e,
        t,
        l,
        a
      ), e = e.sibling; e !== null; )
        Ms(
          e,
          t,
          l,
          a
        ), e = e.sibling;
  }
  function gi(e, t, l, a) {
    var n = e.tag;
    if (n === 5 || n === 6)
      n = e.stateNode, t ? l.insertBefore(n, t) : l.appendChild(n), yi(e, a), Ee = !0;
    else if (n !== 4 && (n === 27 && (yi(e, a), a = null, Jl(e.type) && (l = e.stateNode)), e = e.child, e !== null))
      for (gi(
        e,
        t,
        l,
        a
      ), e = e.sibling; e !== null; )
        gi(
          e,
          t,
          l,
          a
        ), e = e.sibling;
  }
  function Od(e) {
    var t = e.stateNode, l = e.memoizedProps;
    try {
      for (var a = e.type, n = t.attributes; n.length; )
        t.removeAttributeNode(n[0]);
      nt(t, a, l), t[Pe] = e, t[mt] = l;
    } catch (u) {
      Ce(e, e.return, u);
    }
  }
  var pi = !1, jt = null;
  function Rd(e) {
    (e.tag === 30 || (e.subtreeFlags & 33554432) !== 0) && (pi = !0);
  }
  var el = null;
  function Md() {
    var e = el;
    return el = null, e;
  }
  var vt = 0;
  function Ja(e, t, l, a, n) {
    return vt = 0, Dd(
      e.child,
      t,
      l,
      a,
      n
    );
  }
  function Dd(e, t, l, a, n) {
    for (var u = !1; e !== null; ) {
      if (e.tag === 5) {
        var i = e.stateNode;
        if (a !== null) {
          var f = yf(i);
          a.push(f), f.view && (u = !0);
        } else
          u || yf(i).view && (u = !0);
        pi = !0, Mm(
          i,
          vt === 0 ? t : t + "_" + vt,
          l
        ), vt++;
      } else (e.tag !== 22 || e.memoizedState === null) && (e.tag === 30 && n || Dd(
        e.child,
        t,
        l,
        a,
        n
      ) && (u = !0));
      e = e.sibling;
    }
    return u;
  }
  function tl(e, t) {
    for (; e !== null; )
      e.tag === 5 ? Dm(e.stateNode, e.memoizedProps) : (e.tag !== 22 || e.memoizedState === null) && (e.tag === 30 && t || tl(
        e.child,
        t
      )), e = e.sibling;
  }
  function bi(e) {
    if ((e.subtreeFlags & 18874368) !== 0)
      for (e = e.child; e !== null; ) {
        if ((e.tag !== 22 || e.memoizedState === null) && (bi(e), e.tag === 30 && (e.flags & 18874368) !== 0 && e.stateNode.paired)) {
          var t = e.memoizedProps;
          if (t.name == null || t.name === "auto")
            throw Error(o(544));
          var l = t.name;
          t = dl(t.default, t.share), t !== "none" && (Ja(
            e,
            l,
            t,
            null,
            !1
          ) || tl(e.child, !1));
        }
        e = e.sibling;
      }
  }
  function Ds(e, t) {
    if (e.tag === 30) {
      var l = e.stateNode, a = e.memoizedProps, n = rl(a, l), u = dl(
        a.default,
        l.paired ? a.share : a.enter
      );
      u !== "none" ? Ja(e, n, u, null, !1) ? (bi(e), l.paired || t || tn(e, a.onEnter)) : tl(e.child, !1) : bi(e);
    } else if ((e.subtreeFlags & 33554432) !== 0)
      for (e = e.child; e !== null; )
        Ds(e, t), e = e.sibling;
    else bi(e);
  }
  function Us(e) {
    if (jt !== null && jt.size !== 0) {
      var t = jt;
      if ((e.subtreeFlags & 18874368) !== 0)
        for (e = e.child; e !== null; ) {
          if (e.tag !== 22 || e.memoizedState === null) {
            if (e.tag === 30 && (e.flags & 18874368) !== 0) {
              var l = e.memoizedProps, a = l.name;
              if (a != null && a !== "auto") {
                var n = t.get(a);
                if (n !== void 0) {
                  var u = dl(
                    l.default,
                    l.share
                  );
                  if (u !== "none" && (Ja(
                    e,
                    a,
                    u,
                    null,
                    !1
                  ) ? (u = e.stateNode, n.paired = u, u.paired = n, tn(e, l.onShare)) : tl(e.child, !1)), t.delete(a), t.size === 0) break;
                }
              }
            }
            Us(e);
          }
          e = e.sibling;
        }
    }
  }
  function qs(e) {
    if (e.tag === 30) {
      var t = e.memoizedProps, l = rl(t, e.stateNode), a = jt !== null ? jt.get(l) : void 0, n = dl(
        t.default,
        a !== void 0 ? t.share : t.exit
      );
      n !== "none" && (Ja(e, l, n, null, !1) ? a !== void 0 ? (n = e.stateNode, a.paired = n, n.paired = a, jt.delete(l), tn(e, t.onShare)) : tn(e, t.onExit) : tl(e.child, !1)), jt !== null && Us(e);
    } else if ((e.subtreeFlags & 33554432) !== 0)
      for (e = e.child; e !== null; )
        qs(e), e = e.sibling;
    else
      jt !== null && Us(e);
  }
  function Ud(e) {
    for (e = e.child; e !== null; ) {
      if (e.tag === 30) {
        var t = e.memoizedProps, l = rl(t, e.stateNode);
        t = dl(t.default, t.update), e.flags &= -5, t !== "none" && Ja(
          e,
          l,
          t,
          e.memoizedState = [],
          !1
        );
      } else
        (e.subtreeFlags & 33554432) !== 0 && Ud(e);
      e = e.sibling;
    }
  }
  function Hs(e) {
    if ((e.subtreeFlags & 18874368) !== 0)
      for (e = e.child; e !== null; ) {
        if (e.tag !== 22 || e.memoizedState === null) {
          if (e.tag === 30 && (e.flags & 18874368) !== 0) {
            var t = e.stateNode;
            t.paired !== null && (t.paired = null, tl(e.child, !1));
          }
          Hs(e);
        }
        e = e.sibling;
      }
  }
  function Si(e) {
    if (e.tag === 30)
      e.stateNode.paired = null, tl(e.child, !1), Hs(e);
    else if ((e.subtreeFlags & 33554432) !== 0)
      for (e = e.child; e !== null; )
        Si(e), e = e.sibling;
    else Hs(e);
  }
  function qd(e) {
    for (e = e.child; e !== null; )
      e.tag === 30 ? tl(e.child, !1) : (e.subtreeFlags & 33554432) !== 0 && qd(e), e = e.sibling;
  }
  function Bs(e, t, l, a, n, u, i) {
    for (var f = !1; t !== null; ) {
      if (t.tag === 5) {
        var r = t.stateNode;
        if (u !== null && vt < u.length) {
          var p = u[vt], T = yf(r);
          (p.view || T.view) && (f = !0);
          var O;
          if (O = (e.flags & 4) === 0)
            if (T.clip) O = !0;
            else {
              O = p.rect;
              var y = T.rect;
              O = O.y !== y.y || O.x !== y.x || O.height !== y.height || O.width !== y.width;
            }
          O && (e.flags |= 4), T.abs ? T = !p.abs : (p = p.rect, T = T.rect, T = p.height !== T.height || p.width !== T.width), T && (e.flags |= 32);
        } else e.flags |= 32;
        (e.flags & 4) !== 0 && Mm(
          r,
          vt === 0 ? l : l + "_" + vt,
          n
        ), f && (e.flags & 4) !== 0 || (el === null && (el = []), el.push(
          r,
          vt === 0 ? a : a + "_" + vt,
          t.memoizedProps
        )), vt++;
      } else (t.tag !== 22 || t.memoizedState === null) && (t.tag === 30 && i ? e.flags |= t.flags & 32 : Bs(
        e,
        t.child,
        l,
        a,
        n,
        u,
        i
      ) && (f = !0));
      t = t.sibling;
    }
    return f;
  }
  function Hd(e, t) {
    for (e = e.child; e !== null; ) {
      if (e.tag === 30) {
        var l = e.memoizedProps, a = e.stateNode, n = rl(l, a), u = dl(l.default, l.update), i;
        i = e.memoizedState, e.memoizedState = null, a = e;
        var f = e.child;
        vt = 0, n = Bs(
          a,
          f,
          n,
          n,
          u,
          i,
          !1
        ), (e.flags & 4) !== 0 && n && tn(e, l.onUpdate);
      } else
        (e.subtreeFlags & 33554432) !== 0 && Hd(e);
      e = e.sibling;
    }
  }
  var $e = !1, Ae = !1, ll = !1, Ys = !1, Bd = typeof WeakSet == "function" ? WeakSet : Set, We = null, al = !1, $n = !1, _i = !1, Gs = !1;
  function s0(e, t, l) {
    if (e = e.containerInfo, rf = dn, e = Xo(e), Nc(e)) {
      if ("selectionStart" in e)
        var a = {
          start: e.selectionStart,
          end: e.selectionEnd
        };
      else
        e: {
          a = (a = e.ownerDocument) && a.defaultView || window;
          var n = a.getSelection && a.getSelection();
          if (n && n.rangeCount !== 0) {
            a = n.anchorNode;
            var u = n.anchorOffset, i = n.focusNode;
            n = n.focusOffset;
            try {
              a.nodeType, i.nodeType;
            } catch {
              a = null;
              break e;
            }
            var f = 0, r = -1, p = -1, T = 0, O = 0, y = e, _ = null;
            t: for (; ; ) {
              for (var X; y !== a || u !== 0 && y.nodeType !== 3 || (r = f + u), y !== i || n !== 0 && y.nodeType !== 3 || (p = f + n), y.nodeType === 3 && (f += y.nodeValue.length), (X = y.firstChild) !== null; )
                _ = y, y = X;
              for (; ; ) {
                if (y === e) break t;
                if (_ === a && ++T === u && (r = f), _ === i && ++O === n && (p = f), (X = y.nextSibling) !== null) break;
                y = _, _ = y.parentNode;
              }
              y = X;
            }
            a = r === -1 || p === -1 ? null : { start: r, end: p };
          } else a = null;
        }
      a = a || { start: 0, end: 0 };
    } else a = null;
    for (df = { focusedElem: e, selectionRange: a }, dn = !1, l = (l & 335544064) === l, We = t, t = l ? 9270 : 1024; We !== null; ) {
      if (e = We, l && (a = e.deletions, a !== null))
        for (u = 0; u < a.length; u++)
          l && qs(a[u]);
      if (e.alternate === null && (e.flags & 2) !== 0)
        l && Rd(e), Ti(l);
      else {
        if (e.tag === 22) {
          if (a = e.alternate, e.memoizedState !== null) {
            a !== null && a.memoizedState === null && l && qs(a), Ti(l);
            continue;
          } else if (a !== null && a.memoizedState !== null) {
            l && Rd(e), Ti(l);
            continue;
          }
        }
        a = e.child, (e.subtreeFlags & t) !== 0 && a !== null ? (a.return = e, We = a) : (l && Ud(e), Ti(l));
      }
    }
    jt = null;
  }
  function Ti(e) {
    for (; We !== null; ) {
      var t = We, l = e, a = t.alternate, n = t.flags;
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if ((n & 1024) !== 0 && a !== null) {
            l = void 0, n = a.memoizedProps, a = a.memoizedState;
            var u = t.stateNode;
            try {
              var i = ya(
                t.type,
                n
              );
              l = u.getSnapshotBeforeUpdate(
                i,
                a
              ), u.__reactInternalSnapshotBeforeUpdate = l;
            } catch (f) {
              Ce(t, t.return, f);
            }
          }
          break;
        case 3:
          if ((n & 1024) !== 0) {
            if (a = t.stateNode.containerInfo, l = a.nodeType, l === 9)
              bf(a);
            else if (l === 1)
              switch (a.nodeName) {
                case "HEAD":
                case "HTML":
                case "BODY":
                  bf(a);
                  break;
                default:
                  a.textContent = "";
              }
          }
          break;
        case 5:
        case 26:
        case 27:
        case 6:
        case 4:
        case 17:
          break;
        case 30:
          l && a !== null && (l = rl(
            a.memoizedProps,
            a.stateNode
          ), n = t.memoizedProps, n = dl(n.default, n.update), n !== "none" && Ja(
            a,
            l,
            n,
            a.memoizedState = [],
            !0
          ));
          break;
        default:
          if ((n & 1024) !== 0) throw Error(o(163));
      }
      if (a = t.sibling, a !== null) {
        a.return = t.return, We = a;
        break;
      }
      We = t.return;
    }
  }
  function Yd(e, t, l) {
    var a = l.flags;
    switch (l.tag) {
      case 0:
      case 11:
      case 15:
        nl(e, l), a & 4 && kn(5, l);
        break;
      case 1:
        if (nl(e, l), a & 4)
          if (e = l.stateNode, t === null)
            try {
              e.componentDidMount();
            } catch (i) {
              Ce(l, l.return, i);
            }
          else {
            var n = ya(
              l.type,
              t.memoizedProps
            );
            t = t.memoizedState;
            try {
              e.componentDidUpdate(
                n,
                t,
                e.__reactInternalSnapshotBeforeUpdate
              );
            } catch (i) {
              Ce(
                l,
                l.return,
                i
              );
            }
          }
        a & 64 && jd(l), a & 512 && Pt(l, l.return);
        break;
      case 3:
        if (nl(e, l), a & 64 && (e = l.updateQueue, e !== null)) {
          if (t = null, l.child !== null)
            switch (l.child.tag) {
              case 27:
              case 5:
                t = l.child.stateNode;
                break;
              case 1:
                t = l.child.stateNode;
            }
          try {
            vr(e, t);
          } catch (i) {
            Ce(l, l.return, i);
          }
        }
        break;
      case 27:
        t === null && a & 4 && Od(l);
      case 26:
      case 5:
        nl(e, l), t === null && a & 4 && Cs(l), a & 512 && Pt(l, l.return);
        break;
      case 12:
        nl(e, l);
        break;
      case 31:
        nl(e, l), a & 4 && Zd(e, l);
        break;
      case 13:
        nl(e, l), a & 4 && Ld(e, l), a & 64 && (e = l.memoizedState, e !== null && (e = e.dehydrated, e !== null && (l = S0.bind(
          null,
          l
        ), ty(e, l))));
        break;
      case 22:
        if (a = l.memoizedState !== null || $e, !a) {
          var u = t !== null && t.memoizedState !== null || Ae;
          t = $e, n = Ae, $e = a, (Ae = u) && !n ? (a = 2, (l.subtreeFlags & 8772) !== 0 && (a |= 1), wt(
            e,
            l,
            a
          )) : nl(e, l), $e = t, Ae = n;
        }
        break;
      case 30:
        nl(e, l), a & 512 && Pt(l, l.return);
        break;
      case 7:
        a & 512 && Pt(l, l.return);
      default:
        nl(e, l);
    }
  }
  function Qs(e, t) {
    for (e = e.child; e !== null; )
      Gd(e, t), e = e.sibling;
  }
  function Gd(e, t) {
    switch (e.tag) {
      case 5:
      case 26:
        try {
          var l = e.stateNode;
          if (t) {
            var a = l.style;
            typeof a.setProperty == "function" ? a.setProperty("display", "none", "important") : a.display = "none";
          } else {
            var n = e.stateNode, u = e.memoizedProps.style, i = u != null && u.hasOwnProperty("display") ? u.display : null;
            n.style.display = i == null || typeof i == "boolean" ? "" : ("" + i).trim();
          }
        } catch (r) {
          Ce(e, e.return, r);
        }
        Xs(e, t);
        break;
      case 6:
        try {
          e.stateNode.nodeValue = t ? "" : e.memoizedProps, Ee = !0;
        } catch (r) {
          Ce(e, e.return, r);
        }
        break;
      case 18:
        try {
          var f = e.stateNode;
          t ? Rm(f, !0) : Rm(e.stateNode, !1);
        } catch (r) {
          Ce(e, e.return, r);
        }
        break;
      case 22:
      case 23:
        e.memoizedState === null && Qs(e, t);
        break;
      default:
        Qs(e, t);
    }
  }
  function Xs(e, t) {
    if (e.subtreeFlags & 67108864)
      for (e = e.child; e !== null; ) {
        e: {
          var l = e, a = t;
          switch (l.tag) {
            case 4:
              Gd(l, a);
              break e;
            case 22:
              l.memoizedState === null && Xs(l, a);
              break e;
            default:
              Xs(l, a);
          }
        }
        e = e.sibling;
      }
  }
  function Qd(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, Qd(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && Au(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  var Be = null, yt = !1;
  function Lt(e, t, l) {
    for (l = l.child; l !== null; )
      Xd(e, t, l), l = l.sibling;
  }
  function Xd(e, t, l) {
    if (_t && typeof _t.onCommitFiberUnmount == "function")
      try {
        _t.onCommitFiberUnmount(bn, l);
      } catch {
      }
    switch (l.tag) {
      case 26:
        Ae || at(l, t), Lt(
          e,
          t,
          l
        ), l.memoizedState ? l.memoizedState.count-- : l.stateNode && !Ae && (l = l.stateNode, l.parentNode.removeChild(l));
        break;
      case 27:
        Ae || at(l, t), Fn(l);
        var a = Be, n = yt;
        Jl(l.type) && (Be = l.stateNode, yt = !1), Lt(
          e,
          t,
          l
        ), wm(
          l.stateNode,
          l.type,
          l.memoizedProps
        ), Be = a, yt = n;
        break;
      case 5:
        Ae || at(l, t), Fn(l);
      case 6:
        if (l.tag === 6 && Fn(l), a = Be, n = yt, Be = null, Lt(
          e,
          t,
          l
        ), Be = a, yt = n, Be !== null)
          if (yt)
            try {
              (Be.nodeType === 9 ? Be.body : Be.nodeName === "HTML" ? Be.ownerDocument.body : Be).removeChild(l.stateNode), Ee = !0;
            } catch (u) {
              Ce(
                l,
                t,
                u
              );
            }
          else
            try {
              Be.removeChild(l.stateNode), Ee = !0;
            } catch (u) {
              Ce(
                l,
                t,
                u
              );
            }
        break;
      case 18:
        Be !== null && (yt ? (e = Be, Om(
          e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e,
          l.stateNode
        ), mn(e)) : Om(Be, l.stateNode));
        break;
      case 4:
        a = Be, n = yt, Be = l.stateNode.containerInfo, yt = !0, Lt(
          e,
          t,
          l
        ), Be = a, yt = n;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        Ql(2, l, t), Ae || Ql(4, l, t), Lt(
          e,
          t,
          l
        );
        break;
      case 1:
        Ae || (at(l, t), a = l.stateNode, typeof a.componentWillUnmount == "function" && Ad(
          l,
          t,
          a
        )), Lt(
          e,
          t,
          l
        );
        break;
      case 21:
        Lt(
          e,
          t,
          l
        );
        break;
      case 22:
        Ae = (a = Ae) || l.memoizedState !== null, Lt(
          e,
          t,
          l
        ), Ae = a;
        break;
      case 30:
        at(l, t), Lt(
          e,
          t,
          l
        );
        break;
      case 7:
        Ae || at(l, t), Lt(
          e,
          t,
          l
        );
        break;
      default:
        Lt(
          e,
          t,
          l
        );
    }
  }
  function Zd(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
      e = e.dehydrated;
      try {
        mn(e);
      } catch (l) {
        Ce(t, t.return, l);
      }
    }
  }
  function Ld(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null))))
      try {
        mn(e);
      } catch (l) {
        Ce(t, t.return, l);
      }
  }
  function f0(e) {
    switch (e.tag) {
      case 31:
      case 13:
      case 19:
        var t = e.stateNode;
        return t === null && (t = e.stateNode = new Bd()), t;
      case 22:
        return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new Bd()), t;
      default:
        throw Error(o(435, e.tag));
    }
  }
  function Ei(e, t) {
    var l = f0(e);
    t.forEach(function(a) {
      if (!l.has(a)) {
        l.add(a);
        var n = _0.bind(null, e, a);
        a.then(n, n);
      }
    });
  }
  function ot(e, t, l) {
    var a = t.deletions;
    if (a !== null)
      for (var n = 0; n < a.length; n++) {
        var u = a[n], i = e, f = t, r = f;
        e: for (; r !== null; ) {
          switch (r.tag) {
            case 27:
              if (Jl(r.type)) {
                Be = r.stateNode, yt = !1;
                break e;
              }
              break;
            case 5:
              Be = r.stateNode, yt = !1;
              break e;
            case 3:
            case 4:
              Be = r.stateNode.containerInfo, yt = !0;
              break e;
          }
          r = r.return;
        }
        if (Be === null) throw Error(o(160));
        Xd(i, f, u), Be = null, yt = !1, i = u.alternate, i !== null && (i.return = null), u.return = null;
      }
    if (t.subtreeFlags & 13886)
      for (t = t.child; t !== null; )
        Vd(t, e, l), t = t.sibling;
  }
  var Vt = null;
  function Vd(e, t, l) {
    var a = e.alternate, n = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (n & 4 && (a = e.updateQueue, a = a !== null ? a.events : null, a !== null))
          for (var u = 0; u < a.length; u++) {
            var i = a[u];
            i.ref.impl = i.nextImpl;
          }
        ot(t, e, l), rt(e), n & 4 && (Ql(3, e, e.return), kn(3, e), Ql(5, e, e.return));
        break;
      case 1:
        ot(t, e, l), rt(e), n & 512 && (Ae || a === null || at(a, a.return)), n & 64 && $e && (e = e.updateQueue, e !== null && (t = e.callbacks, t !== null && (l = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = l === null ? t : l.concat(t))));
        break;
      case 26:
        if (u = Vt, ot(t, e, l), rt(e), n & 512 && (Ae || a === null || at(a, a.return)), n & 4)
          if (n = a !== null ? a.memoizedState : null, l = e.memoizedState, a === null)
            if (l === null)
              if (e.stateNode === null)
                if ($e)
                  e.stateNode = Am(
                    e.type,
                    e.memoizedProps,
                    t.containerInfo,
                    e
                  );
                else {
                  e: {
                    t = e.type, l = e.memoizedProps, n = u.ownerDocument || u;
                    t: switch (t) {
                      case "title":
                        a = n.getElementsByTagName("title")[0], (!a || a[Tn] || a[Pe] || a.namespaceURI === "http://www.w3.org/2000/svg" || a.hasAttribute("itemprop")) && (a = n.createElement(t), n.head.insertBefore(
                          a,
                          n.querySelector("head > title")
                        )), nt(a, t, l), a[Pe] = e, ke(a), t = a;
                        break e;
                      case "link":
                        if (u = Wm(
                          "link",
                          "href",
                          n
                        ).get(t + (l.href || ""))) {
                          for (i = 0; i < u.length; i++)
                            if (a = u[i], a.getAttribute("href") === (l.href == null || l.href === "" ? null : l.href) && a.getAttribute("rel") === (l.rel == null ? null : l.rel) && a.getAttribute("title") === (l.title == null ? null : l.title) && a.getAttribute("crossorigin") === (l.crossOrigin == null ? null : l.crossOrigin)) {
                              u.splice(i, 1);
                              break t;
                            }
                        }
                        a = n.createElement(t), nt(a, t, l), n.head.appendChild(a);
                        break;
                      case "meta":
                        if (u = Wm(
                          "meta",
                          "content",
                          n
                        ).get(t + (l.content || ""))) {
                          for (i = 0; i < u.length; i++)
                            if (a = u[i], a.getAttribute("content") === (l.content == null ? null : "" + l.content) && a.getAttribute("name") === (l.name == null ? null : l.name) && a.getAttribute("property") === (l.property == null ? null : l.property) && a.getAttribute("http-equiv") === (l.httpEquiv == null ? null : l.httpEquiv) && a.getAttribute("charset") === (l.charSet == null ? null : l.charSet)) {
                              u.splice(i, 1);
                              break t;
                            }
                        }
                        a = n.createElement(t), nt(a, t, l), n.head.appendChild(a);
                        break;
                      default:
                        throw Error(o(468, t));
                    }
                    a[Pe] = e, ke(a), t = a;
                  }
                  e.stateNode = t;
                }
              else
                $e || jf(u, e.type, e.stateNode);
            else
              e.stateNode = $m(
                u,
                l,
                e.memoizedProps
              );
          else
            n !== l ? (n === null ? (t = a.stateNode, t === null || Ae || t.parentNode.removeChild(t)) : n.count--, l === null ? $e || jf(u, e.type, e.stateNode) : $m(u, l, e.memoizedProps)) : l === null && e.stateNode !== null && Os(
              e,
              e.memoizedProps,
              a.memoizedProps
            );
        break;
      case 27:
        ot(t, e, l), rt(e), n & 512 && (Ae || a === null || at(a, a.return)), a !== null && n & 4 && Os(
          e,
          e.memoizedProps,
          a.memoizedProps
        );
        break;
      case 5:
        if (u = ll, ll = !1, ot(t, e, l), ll = u, rt(e), n & 512 && (Ae || a === null || at(a, a.return)), e.flags & 32) {
          t = e.stateNode;
          try {
            Ca(t, ""), Ee = !0;
          } catch (T) {
            Ce(e, e.return, T);
          }
        }
        n & 4 && e.stateNode != null && (t = e.memoizedProps, Os(
          e,
          t,
          a !== null ? a.memoizedProps : t
        )), n & 1024 && (Ys = !0);
        break;
      case 6:
        if (ot(t, e, l), rt(e), n & 4) {
          if (e.stateNode === null)
            throw Error(o(162));
          t = e.memoizedProps, l = e.stateNode;
          try {
            l.nodeValue = t, Ee = !0;
          } catch (T) {
            Ce(e, e.return, T);
          }
        }
        break;
      case 3:
        if (Ee = !1, Yi = null, u = Vt, Vt = uu(t.containerInfo), ot(t, e, l), Vt = u, rt(e), n & 4 && a !== null && a.memoizedState.isDehydrated)
          try {
            mn(t.containerInfo);
          } catch (T) {
            Ce(e, e.return, T);
          }
        Ys && (Ys = !1, wd(e)), Ee = !1;
        break;
      case 4:
        n = ll, ll = $e, a = oo(), u = Vt, Vt = uu(
          e.stateNode.containerInfo
        ), ot(t, e, l), rt(e), Vt = u, Ee && $n && (_i = !0), Ee = a, ll = n;
        break;
      case 12:
        ot(t, e, l), rt(e);
        break;
      case 31:
        ot(t, e, l), rt(e), n & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, Ei(e, t)));
        break;
      case 13:
        ot(t, e, l), rt(e), e.child.flags & 8192 && e.memoizedState !== null != (a !== null && a.memoizedState !== null) && (ji = St()), n & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, Ei(e, t)));
        break;
      case 22:
        u = e.memoizedState !== null, i = a !== null && a.memoizedState !== null;
        var f = $e, r = Ae, p = ll;
        $e = f || u, ll = p || u, Ae = r || i, ot(t, e, l), Ae = r, ll = p, $e = f, rt(e), n & 8192 && (t = e.stateNode, t._visibility = u ? t._visibility & -2 : t._visibility | 1, !u || a === null || i || $e || Ae || (t = i || Ae, l = $e, a = Ae, $e = u || $e, Ae = t, Xl(e, 2), $e = l, Ae = a), !u && ll || Qs(e, u)), n & 4 && (t = e.updateQueue, t !== null && (l = t.retryQueue, l !== null && (t.retryQueue = null, Ei(e, l))));
        break;
      case 19:
        ot(t, e, l), rt(e), n & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, Ei(e, t)));
        break;
      case 30:
        n & 512 && (Ae || a === null || at(a, a.return)), n = oo(), u = $n, i = (l & 335544064) === l, f = e.memoizedProps, $n = i && dl(
          f.default,
          f.update
        ) !== "none", ot(t, e, l), rt(e), i && a !== null && Ee && (e.flags |= 4), $n = u, Ee = n;
        break;
      case 21:
        break;
      case 7:
        n & 512 && (Ae || a === null || at(a, a.return)), a && a.stateNode !== null && (a.stateNode._fragmentFiber = e);
      default:
        ot(t, e, l), rt(e);
    }
  }
  function rt(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        for (var l, a = e.return; a !== null; ) {
          if (Cd(a)) {
            l = a;
            break;
          }
          a = a.return;
        }
        a = null;
        for (var n = e.return; n !== null; ) {
          if (zs(n)) {
            var u = n.stateNode;
            a === null ? a = [u] : a.push(u);
          }
          if (As(n)) break;
          n = n.return;
        }
        var i = a;
        if (l == null) throw Error(o(160));
        switch (l.tag) {
          case 27:
            var f = l.stateNode, r = Rs(e);
            gi(
              e,
              r,
              f,
              i
            );
            break;
          case 5:
            var p = l.stateNode;
            l.flags & 32 && (Ca(p, ""), l.flags &= -33);
            var T = Rs(e);
            gi(
              e,
              T,
              p,
              i
            );
            break;
          case 3:
          case 4:
            var O = l.stateNode.containerInfo, y = Rs(e);
            Ms(
              e,
              y,
              O,
              i
            );
            break;
          default:
            throw Error(o(161));
        }
      } catch (_) {
        Ce(e, e.return, _);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function wd(e) {
    if (e.subtreeFlags & 1024)
      for (e = e.child; e !== null; ) {
        var t = e;
        wd(t), t.tag === 5 && t.flags & 1024 && (t = t.stateNode, dn = !0, t.reset(), dn = !1), e = e.sibling;
      }
  }
  function ka(e, t) {
    if (t.subtreeFlags & 9270)
      for (t = t.child; t !== null; )
        Kd(t, e), t = t.sibling;
    else Hd(t);
  }
  function Kd(e, t) {
    var l = e.alternate;
    if (l === null) Ds(e, !1);
    else
      switch (e.tag) {
        case 3:
          if (Gs = al = !1, Md(), ka(t, e), !al && !_i) {
            if (e = el, e !== null)
              for (var a = 0; a < e.length; a += 3) {
                l = e[a];
                var n = e[a + 1];
                Dm(l, e[a + 2]), l = l.ownerDocument.documentElement, l !== null && l.animate(
                  { opacity: [0, 0], pointerEvents: ["none", "none"] },
                  {
                    duration: 0,
                    fill: "forwards",
                    pseudoElement: "::view-transition-group(" + n + ")"
                  }
                );
              }
            e = t.containerInfo, e = e.nodeType === 9 ? e.documentElement : e.ownerDocument.documentElement, e !== null && e.style.viewTransitionName === "" && (e.style.viewTransitionName = "none", e.animate(
              { opacity: [0, 0], pointerEvents: ["none", "none"] },
              {
                duration: 0,
                fill: "forwards",
                pseudoElement: "::view-transition-group(root)"
              }
            ), e.animate(
              { width: [0, 0], height: [0, 0] },
              {
                duration: 0,
                fill: "forwards",
                pseudoElement: "::view-transition"
              }
            )), Gs = !0;
          }
          el = null;
          break;
        case 5:
          ka(t, e);
          break;
        case 4:
          a = al, al = !1, ka(t, e), al && (_i = !0), al = a;
          break;
        case 22:
          e.memoizedState === null && (l.memoizedState !== null ? Ds(e, !1) : ka(t, e));
          break;
        case 30:
          a = al, n = Md(), al = !1, ka(t, e), al && (e.flags |= 4);
          var u = e.memoizedProps, i = e.stateNode;
          t = rl(u, i), i = rl(l.memoizedProps, i);
          var f = dl(u.default, u.update);
          f === "none" ? t = !1 : (u = l.memoizedState, l.memoizedState = null, l = e.child, vt = 0, t = Bs(
            e,
            l,
            t,
            i,
            f,
            u,
            !0
          ), vt !== (u === null ? 0 : u.length) && (e.flags |= 32)), (e.flags & 4) !== 0 && t ? (tn(
            e,
            e.memoizedProps.onUpdate
          ), el = n) : n !== null && (n.push.apply(n, el), el = n), al = (e.flags & 32) !== 0 ? !0 : a;
          break;
        default:
          ka(t, e);
      }
  }
  function nl(e, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; )
        Yd(e, t.alternate, t), t = t.sibling;
  }
  function Xl(e, t) {
    for (e = e.child; e !== null; ) {
      var l = e, a = t;
      switch (l.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          Ql(4, l, l.return), Xl(
            l,
            a
          );
          break;
        case 1:
          at(l, l.return);
          var n = l.stateNode;
          typeof n.componentWillUnmount == "function" && Ad(
            l,
            l.return,
            n
          ), Xl(
            l,
            a
          );
          break;
        case 27:
          (a & 2) !== 0 && wm(
            l.stateNode,
            l.type,
            l.memoizedProps
          );
        case 5:
          at(l, l.return), l.tag !== 5 && l.tag !== 27 || Fn(l), Xl(
            l,
            a
          );
          break;
        case 6:
          Fn(l);
          break;
        case 26:
          at(l, l.return), n = l.stateNode, l.memoizedState !== null || n === null || Ae || n.parentNode.removeChild(n), Xl(
            l,
            a
          );
          break;
        case 22:
          l.memoizedState === null && Xl(
            l,
            a
          );
          break;
        case 30:
          at(l, l.return), Xl(
            l,
            a
          );
          break;
        case 7:
          at(l, l.return);
        default:
          Xl(
            l,
            a
          );
      }
      e = e.sibling;
    }
  }
  function wt(e, t, l) {
    for (l = (t.subtreeFlags & 8772) !== 0 ? l : l & -2, t = t.child; t !== null; ) {
      var a = t.alternate, n = e, u = t, i = u.flags, f = (l & 1) !== 0;
      switch (u.tag) {
        case 0:
        case 11:
        case 15:
          wt(
            n,
            u,
            l
          ), kn(4, u);
          break;
        case 1:
          if (wt(
            n,
            u,
            l
          ), a = u, n = a.stateNode, typeof n.componentDidMount == "function")
            try {
              n.componentDidMount();
            } catch (T) {
              Ce(a, a.return, T);
            }
          if (a = u, n = a.updateQueue, n !== null) {
            var r = a.stateNode;
            try {
              var p = n.shared.hiddenCallbacks;
              if (p !== null)
                for (n.shared.hiddenCallbacks = null, n = 0; n < p.length; n++)
                  hr(p[n], r);
            } catch (T) {
              Ce(a, a.return, T);
            }
          }
          f && i & 64 && jd(u), Pt(u, u.return);
          break;
        case 27:
          (l & 2) !== 0 && Od(u);
        case 5:
          u.tag !== 5 && u.tag !== 27 || zd(u), wt(
            n,
            u,
            l
          ), f && a === null && i & 4 && Cs(u), Pt(u, u.return);
          break;
        case 6:
          zd(u);
          break;
        case 26:
          r = u.stateNode, u.memoizedState !== null || r === null || $e || jf(
            uu(r.ownerDocument),
            u.type,
            r
          ), wt(
            n,
            u,
            l
          ), f && a === null && i & 4 && Cs(u), Pt(u, u.return);
          break;
        case 12:
          wt(
            n,
            u,
            l
          );
          break;
        case 31:
          wt(
            n,
            u,
            l
          ), f && i & 4 && Zd(n, u);
          break;
        case 13:
          wt(
            n,
            u,
            l
          ), f && i & 4 && Ld(n, u);
          break;
        case 22:
          u.memoizedState === null && wt(
            n,
            u,
            l
          ), Pt(u, u.return);
          break;
        case 30:
          wt(
            n,
            u,
            l
          ), Pt(u, u.return);
          break;
        case 7:
          Pt(u, u.return);
        default:
          wt(
            n,
            u,
            l
          );
      }
      t = t.sibling;
    }
  }
  function Zs(e, t) {
    var l = null;
    e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (l = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== l && (e != null && e.refCount++, l != null && qn(l));
  }
  function Ls(e, t) {
    e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && qn(e));
  }
  function Yt(e, t, l, a) {
    var n = (l & 335544064) === l;
    if (t.subtreeFlags & (n ? 10262 : 10256))
      for (t = t.child; t !== null; )
        Jd(
          e,
          t,
          l,
          a
        ), t = t.sibling;
    else n && qd(t);
  }
  function Jd(e, t, l, a) {
    var n = (l & 335544064) === l;
    n && t.alternate === null && t.return !== null && t.return.alternate !== null && Si(t);
    var u = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        Yt(
          e,
          t,
          l,
          a
        ), u & 2048 && kn(9, t);
        break;
      case 1:
        Yt(
          e,
          t,
          l,
          a
        );
        break;
      case 3:
        Yt(
          e,
          t,
          l,
          a
        ), n && Gs && (e = e.containerInfo, e = e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, e.style.viewTransitionName === "root" && (e.style.viewTransitionName = ""), e = e.ownerDocument.documentElement, e !== null && e.style.viewTransitionName === "none" && (e.style.viewTransitionName = "")), u & 2048 && (u = null, t.alternate !== null && (u = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== u && (t.refCount++, u != null && qn(u)));
        break;
      case 12:
        if (u & 2048) {
          Yt(
            e,
            t,
            l,
            a
          ), u = t.stateNode;
          try {
            var i = t.memoizedProps, f = i.id, r = i.onPostCommit;
            typeof r == "function" && r(
              f,
              t.alternate === null ? "mount" : "update",
              u.passiveEffectDuration,
              -0
            );
          } catch (p) {
            Ce(t, t.return, p);
          }
        } else
          Yt(
            e,
            t,
            l,
            a
          );
        break;
      case 31:
        Yt(
          e,
          t,
          l,
          a
        );
        break;
      case 13:
        Yt(
          e,
          t,
          l,
          a
        );
        break;
      case 23:
        break;
      case 22:
        i = t.stateNode, f = t.alternate, t.memoizedState !== null ? (n && f !== null && f.memoizedState === null && Si(f), i._visibility & 2 ? Yt(
          e,
          t,
          l,
          a
        ) : Wn(
          e,
          t
        )) : (n && f !== null && f.memoizedState !== null && Si(t), i._visibility & 2 ? Yt(
          e,
          t,
          l,
          a
        ) : (i._visibility |= 2, Fa(
          e,
          t,
          l,
          a,
          (t.subtreeFlags & 10256) !== 0 || !1
        ))), u & 2048 && Zs(f, t);
        break;
      case 24:
        Yt(
          e,
          t,
          l,
          a
        ), u & 2048 && Ls(t.alternate, t);
        break;
      case 30:
        n && (u = t.alternate, u !== null && (tl(u.child, !0), tl(t.child, !0))), Yt(
          e,
          t,
          l,
          a
        );
        break;
      default:
        Yt(
          e,
          t,
          l,
          a
        );
    }
  }
  function Fa(e, t, l, a, n) {
    for (n = n && ((t.subtreeFlags & 10256) !== 0 || !1), t = t.child; t !== null; ) {
      var u = e, i = t, f = l, r = a, p = i.flags;
      switch (i.tag) {
        case 0:
        case 11:
        case 15:
          Fa(
            u,
            i,
            f,
            r,
            n
          ), kn(8, i);
          break;
        case 23:
          break;
        case 22:
          var T = i.stateNode;
          i.memoizedState !== null ? T._visibility & 2 ? Fa(
            u,
            i,
            f,
            r,
            n
          ) : Wn(
            u,
            i
          ) : (T._visibility |= 2, Fa(
            u,
            i,
            f,
            r,
            n
          )), n && p & 2048 && Zs(
            i.alternate,
            i
          );
          break;
        case 24:
          Fa(
            u,
            i,
            f,
            r,
            n
          ), n && p & 2048 && Ls(i.alternate, i);
          break;
        default:
          Fa(
            u,
            i,
            f,
            r,
            n
          );
      }
      t = t.sibling;
    }
  }
  function Wn(e, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) {
        var l = e, a = t, n = a.flags;
        switch (a.tag) {
          case 22:
            Wn(l, a), n & 2048 && Zs(
              a.alternate,
              a
            );
            break;
          case 24:
            Wn(l, a), n & 2048 && Ls(a.alternate, a);
            break;
          default:
            Wn(l, a);
        }
        t = t.sibling;
      }
  }
  var ga = 8192;
  function pa(e, t, l) {
    if (e.subtreeFlags & ga)
      for (e = e.child; e !== null; )
        kd(
          e,
          t,
          l
        ), e = e.sibling;
  }
  function kd(e, t, l) {
    switch (e.tag) {
      case 26:
        pa(
          e,
          t,
          l
        ), e.flags & ga && (e.memoizedState !== null ? vy(
          l,
          Vt,
          e.memoizedState,
          e.memoizedProps
        ) : (e = e.stateNode, (t & 335544128) === t && th(l, e)));
        break;
      case 5:
        pa(
          e,
          t,
          l
        ), e.flags & ga && (e = e.stateNode, (t & 335544128) === t && th(l, e));
        break;
      case 3:
      case 4:
        var a = Vt;
        Vt = uu(e.stateNode.containerInfo), pa(
          e,
          t,
          l
        ), Vt = a;
        break;
      case 22:
        e.memoizedState === null && (a = e.alternate, a !== null && a.memoizedState !== null ? (a = ga, ga = 16777216, pa(
          e,
          t,
          l
        ), ga = a) : pa(
          e,
          t,
          l
        ));
        break;
      case 30:
        if ((e.flags & ga) !== 0 && (a = e.memoizedProps.name, a != null && a !== "auto")) {
          var n = e.stateNode;
          n.paired = null, jt === null && (jt = /* @__PURE__ */ new Map()), jt.set(a, n);
        }
        pa(
          e,
          t,
          l
        );
        break;
      default:
        pa(
          e,
          t,
          l
        );
    }
  }
  function Fd(e) {
    var t = e.alternate;
    if (t !== null && (e = t.child, e !== null)) {
      t.child = null;
      do
        t = e.sibling, e.sibling = null, e = t;
      while (e !== null);
    }
  }
  function In(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var l = 0; l < t.length; l++) {
          var a = t[l];
          We = a, Wd(
            a,
            e
          );
        }
      Fd(e);
    }
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; )
        $d(e), e = e.sibling;
  }
  function $d(e) {
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        In(e), e.flags & 2048 && Ql(9, e, e.return);
        break;
      case 3:
        In(e);
        break;
      case 12:
        In(e);
        break;
      case 22:
        var t = e.stateNode;
        e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, xi(e)) : In(e);
        break;
      default:
        In(e);
    }
  }
  function xi(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var l = 0; l < t.length; l++) {
          var a = t[l];
          We = a, Wd(
            a,
            e
          );
        }
      Fd(e);
    }
    for (e = e.child; e !== null; ) {
      switch (t = e, t.tag) {
        case 0:
        case 11:
        case 15:
          Ql(8, t, t.return), xi(t);
          break;
        case 22:
          l = t.stateNode, l._visibility & 2 && (l._visibility &= -3, xi(t));
          break;
        default:
          xi(t);
      }
      e = e.sibling;
    }
  }
  function Wd(e, t) {
    for (; We !== null; ) {
      var l = We;
      switch (l.tag) {
        case 0:
        case 11:
        case 15:
          Ql(8, l, t);
          break;
        case 23:
        case 22:
          if (l.memoizedState !== null && l.memoizedState.cachePool !== null) {
            var a = l.memoizedState.cachePool.pool;
            a != null && a.refCount++;
          }
          break;
        case 24:
          qn(l.memoizedState.cache);
      }
      if (a = l.child, a !== null) a.return = l, We = a;
      else
        e: for (l = e; We !== null; ) {
          a = We;
          var n = a.sibling, u = a.return;
          if (Qd(a), a === l) {
            We = null;
            break e;
          }
          if (n !== null) {
            n.return = u, We = n;
            break e;
          }
          We = u;
        }
    }
  }
  var o0 = {
    getCacheForType: function(e) {
      var t = et(Ze), l = t.data.get(e);
      return l === void 0 && (l = e(), t.data.set(e, l)), l;
    },
    cacheSignal: function() {
      return et(Ze).controller.signal;
    }
  }, r0 = typeof WeakMap == "function" ? WeakMap : Map, Ne = 0, De = null, ye = null, be = 0, ze = 0, At = null, Zl = !1, $a = !1, Vs = !1, _l = 0, Qe = 0, Ll = 0, ba = 0, Ni = 0, zt = 0, Wa = 0, Pn = null, gt = null, ws = !1, ji = 0, Id = 0, Ai = 1 / 0, zi = null, Vl = null, Ye = 0, Kt = null, Sa = null, ul = 0, Ks = 0, Js = null, Pd = null, Ia = null, Pa = null, en = null, eu = 0, Ci = null;
  function Ct() {
    return (Ne & 2) !== 0 && be !== 0 ? be & -be : L.T !== null ? af() : to();
  }
  function em() {
    if (zt === 0)
      if ((be & 536870912) === 0 || me) {
        var e = Eu;
        Eu <<= 1, (Eu & 3932160) === 0 && (Eu = 262144), zt = e;
      } else zt = 536870912;
    return e = tt.current, e !== null && (e.flags |= 32), zt;
  }
  function tn(e, t) {
    if (t != null) {
      var l = e.stateNode, a = l.ref;
      a === null && (a = l.ref = Um(
        rl(e.memoizedProps, l)
      )), Pa === null && (Pa = []), Pa.push(t.bind(null, a));
    }
  }
  function pt(e, t, l) {
    (e === De && (ze === 2 || ze === 9) || e.cancelPendingCommit !== null) && (ln(e, 0), wl(
      e,
      be,
      zt,
      !1
    )), _n(e, l), ((Ne & 2) === 0 || e !== De) && (e === De && ((Ne & 2) === 0 && (ba |= l), Qe === 4 && wl(
      e,
      be,
      zt,
      !1
    )), il(e));
  }
  function tm(e, t, l) {
    if ((Ne & 6) !== 0) throw Error(o(327));
    var a = !l && (t & 127) === 0 && (t & e.expiredLanes) === 0 || Sn(e, t), n = a ? h0(e, t) : Fs(e, t, !0), u = a;
    do {
      if (n === 0) {
        $a && !a && wl(e, t, 0, !1);
        break;
      } else {
        if (l = e.current.alternate, u && !d0(l)) {
          n = Fs(e, t, !1), u = !1;
          continue;
        }
        if (n === 2) {
          if (u = t, e.errorRecoveryDisabledLanes & u)
            var i = 0;
          else
            i = e.pendingLanes & -536870913, i = i !== 0 ? i : i & 536870912 ? 536870912 : 0;
          if (i !== 0) {
            t = i;
            e: {
              var f = e;
              n = Pn;
              var r = f.current.memoizedState.isDehydrated;
              if (r && (ln(f, i).flags |= 256), i = Fs(
                f,
                i,
                !1
              ), i !== 2 && i !== 6) {
                if (Vs && !r) {
                  f.errorRecoveryDisabledLanes |= u, ba |= u, n = 4;
                  break e;
                }
                u = gt, gt = n, u !== null && (gt === null ? gt = u : gt.push.apply(
                  gt,
                  u
                ));
              }
              n = i;
            }
            if (u = !1, n !== 2) continue;
          }
        }
        if (n === 1) {
          ln(e, 0), wl(e, t, 0, !0);
          break;
        }
        e: {
          switch (a = e, u = n, u) {
            case 0:
            case 1:
              throw Error(o(345));
            case 4:
              if ((t & 4194048) !== t && (t & 62914560) !== t)
                break;
            case 6:
              wl(
                a,
                t,
                zt,
                !Zl
              );
              break e;
            case 2:
              gt = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(o(329));
          }
          if ((t & 62914560) === t && (n = ji + 300 - St(), 10 < n)) {
            if (wl(
              a,
              t,
              zt,
              !Zl
            ), Nu(a, 0, !0) !== 0) break e;
            ul = t, a.timeoutHandle = vf(
              lm.bind(
                null,
                a,
                l,
                gt,
                zi,
                ws,
                t,
                zt,
                ba,
                Wa,
                Zl,
                u,
                "Throttled",
                -0,
                0
              ),
              n
            );
            break e;
          }
          lm(
            a,
            l,
            gt,
            zi,
            ws,
            t,
            zt,
            ba,
            Wa,
            Zl,
            u,
            null,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    il(e);
  }
  function lm(e, t, l, a, n, u, i, f, r, p, T, O, y, _) {
    e.timeoutHandle = -1;
    var X = t.subtreeFlags, J = (u & 335544064) === u;
    if (O = null, (J || X & 8192 || (X & 16785408) === 16785408) && (O = {
      stylesheets: null,
      count: 0,
      imgCount: 0,
      imgBytes: 0,
      suspenseyImages: [],
      waitingForImages: !0,
      waitingForViewTransition: !1,
      unsuspend: $t
    }, jt = null, kd(
      t,
      u,
      O
    ), J && (X = O, J = e.containerInfo, J = (J.nodeType === 9 ? J : J.ownerDocument).__reactViewTransition, J != null && (X.count++, X.waitingForViewTransition = !0, X = su.bind(X), J.finished.then(X, X))), X = (u & 62914560) === u ? ji - St() : (u & 4194048) === u ? Id - St() : 0, X = yy(
      O,
      X
    ), X !== null)) {
      ul = u, e.cancelPendingCommit = X(
        om.bind(
          null,
          e,
          t,
          u,
          l,
          a,
          n,
          i,
          f,
          r,
          p,
          T,
          O,
          null,
          y,
          _
        )
      ), wl(e, u, i, !p);
      return;
    }
    om(
      e,
      t,
      u,
      l,
      a,
      n,
      i,
      f,
      r,
      p,
      T,
      O
    );
  }
  function d0(e) {
    for (var t = e; ; ) {
      var l = t.tag;
      if ((l === 0 || l === 11 || l === 15) && t.flags & 16384 && (l = t.updateQueue, l !== null && (l = l.stores, l !== null)))
        for (var a = 0; a < l.length; a++) {
          var n = l[a], u = n.getSnapshot;
          n = n.value;
          try {
            if (!xt(u(), n)) return !1;
          } catch {
            return !1;
          }
        }
      if (l = t.child, t.subtreeFlags & 16384 && l !== null)
        l.return = t, t = l;
      else {
        if (t === e) break;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e) return !0;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
    }
    return !0;
  }
  function wl(e, t, l, a) {
    t = $f(e, t), t &= ~Ni, t &= ~ba, e.suspendedLanes |= t, e.pingedLanes &= ~t, a && (e.warmLanes |= t), a = e.expirationTimes;
    for (var n = t; 0 < n; ) {
      var u = 31 - Tt(n), i = 1 << u;
      a[u] = -1, n &= ~i;
    }
    l !== 0 && If(e, l, t);
  }
  function Oi() {
    return (Ne & 6) === 0 ? (tu(0), !1) : !0;
  }
  function ks() {
    if (ye !== null) {
      if (ze === 0)
        var e = ye.return;
      else
        e = ye, vl = ca = null, ls(e), Za = null, Yn = 0, e = ye;
      for (; e !== null; )
        Nd(e.alternate, e), e = e.return;
      ye = null;
    }
  }
  function ln(e, t) {
    var l = e.timeoutHandle;
    return l !== -1 && (e.timeoutHandle = -1, H0(l)), l = e.cancelPendingCommit, l !== null && (e.cancelPendingCommit = null, l()), ul = 0, ks(), De = e, ye = l = ml(e.current, null), be = t, ze = 0, At = null, Zl = !1, $a = Sn(e, t), Vs = !1, Wa = zt = Ni = ba = Ll = Qe = 0, gt = Pn = null, ws = !1, _l = $f(e, t), Yu(), l;
  }
  function am(e, t) {
    fe = null, L.H = fi, t === Xa || t === Fu ? (t = or(), ze = 3) : t === Lc ? (t = or(), ze = 4) : ze = t === gs ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, At = t, ye === null && (Qe = 1, oi(
      e,
      Ut(t, e.current)
    ));
  }
  function nm() {
    var e = tt.current;
    return e === null ? !0 : (be & 4194048) === be ? ct === null : (be & 62914560) === be || (be & 536870912) !== 0 ? e === ct : !1;
  }
  function um() {
    var e = L.H;
    return L.H = fi, e === null ? fi : e;
  }
  function im() {
    var e = L.A;
    return L.A = o0, e;
  }
  function Ri() {
    Qe = 4, Zl || (be & 4194048) !== be && tt.current !== null || ($a = !0), (Ll & 134217727) === 0 && (ba & 134217727) === 0 || De === null || wl(
      De,
      be,
      zt,
      !1
    );
  }
  function Fs(e, t, l) {
    var a = Ne;
    Ne |= 2;
    var n = um(), u = im();
    (De !== e || be !== t) && (zi = null, ln(e, t)), t = !1;
    var i = Qe;
    e: do
      try {
        if (ze !== 0 && ye !== null) {
          var f = ye, r = At;
          switch (ze) {
            case 8:
              ks(), i = 6;
              break e;
            case 3:
            case 2:
            case 9:
            case 6:
              tt.current === null && (t = !0);
              var p = ze;
              if (ze = 0, At = null, an(e, f, r, p), l && $a) {
                i = 0;
                break e;
              }
              break;
            default:
              p = ze, ze = 0, At = null, an(e, f, r, p);
          }
        }
        m0(), i = Qe;
        break;
      } catch (T) {
        am(e, T);
      }
    while (!0);
    return t && e.shellSuspendCounter++, vl = ca = null, Ne = a, L.H = n, L.A = u, ye === null && (De = null, be = 0, Yu()), i;
  }
  function m0() {
    for (; ye !== null; ) cm(ye);
  }
  function h0(e, t) {
    var l = Ne;
    Ne |= 2;
    var a = um(), n = im();
    De !== e || be !== t ? (zi = null, Ai = St() + 500, ln(e, t)) : $a = Sn(
      e,
      t
    );
    e: do
      try {
        if (ze !== 0 && ye !== null) {
          t = ye;
          var u = At;
          t: switch (ze) {
            case 1:
              ze = 0, At = null, an(e, t, u, 1);
              break;
            case 2:
            case 9:
              if (sr(u)) {
                ze = 0, At = null, sm(t);
                break;
              }
              t = function() {
                ze !== 2 && ze !== 9 || De !== e || (ze = 7), il(e);
              }, u.then(t, t);
              break e;
            case 3:
              ze = 7;
              break e;
            case 4:
              ze = 5;
              break e;
            case 7:
              sr(u) ? (ze = 0, At = null, sm(t)) : (ze = 0, At = null, an(e, t, u, 7));
              break;
            case 5:
              var i = null;
              switch (ye.tag) {
                case 26:
                  i = ye.memoizedState;
                case 5:
                case 27:
                  var f = ye;
                  if (i ? Pm(i) : f.stateNode.complete) {
                    ze = 0, At = null;
                    var r = f.sibling;
                    if (r !== null) ye = r;
                    else {
                      var p = f.return;
                      p !== null ? (ye = p, Mi(p)) : ye = null;
                    }
                    break t;
                  }
              }
              ze = 0, At = null, an(e, t, u, 5);
              break;
            case 6:
              ze = 0, At = null, an(e, t, u, 6);
              break;
            case 8:
              ks(), Qe = 6;
              break e;
            default:
              throw Error(o(462));
          }
        }
        v0();
        break;
      } catch (T) {
        am(e, T);
      }
    while (!0);
    return vl = ca = null, L.H = a, L.A = n, Ne = l, ye !== null ? 0 : (De = null, be = 0, Yu(), Qe);
  }
  function v0() {
    for (; ye !== null && !Mh(); )
      cm(ye);
  }
  function cm(e) {
    var t = Ed(e.alternate, e, _l);
    e.memoizedProps = e.pendingProps, t === null ? Mi(e) : ye = t;
  }
  function sm(e) {
    var t = e, l = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = yd(
          l,
          t,
          t.pendingProps,
          t.type,
          void 0,
          be
        );
        break;
      case 11:
        t = yd(
          l,
          t,
          t.pendingProps,
          t.type.render,
          t.ref,
          be
        );
        break;
      case 5:
        ls(t);
        var a = t;
        a === Fe && (me ? (Vu(a), a.tag === 5 && a.stateNode != null && (qe = a.stateNode)) : (Vu(a), me = !0));
      default:
        Nd(l, t), t = ye = Wo(t, _l), t = Ed(l, t, _l);
    }
    e.memoizedProps = e.pendingProps, t === null ? Mi(e) : ye = t;
  }
  function an(e, t, l, a) {
    vl = ca = null, ls(t), Za = null, Yn = 0;
    var n = t.return;
    try {
      if (l0(
        e,
        n,
        t,
        l,
        be
      )) {
        Qe = 1, oi(
          e,
          Ut(l, e.current)
        ), ye = null;
        return;
      }
    } catch (u) {
      if (n !== null) throw ye = n, u;
      Qe = 1, oi(
        e,
        Ut(l, e.current)
      ), ye = null;
      return;
    }
    t.flags & 32768 ? (me || a === 1 ? e = !0 : $a || (be & 536870912) !== 0 ? e = !1 : (Zl = e = !0, (a === 2 || a === 9 || a === 3 || a === 6) && (a = tt.current, a !== null && a.tag === 13 && (a.flags |= 16384))), fm(t, e)) : Mi(t);
  }
  function Mi(e) {
    var t = e;
    do {
      if ((t.flags & 32768) !== 0) {
        fm(
          t,
          Zl
        );
        return;
      }
      e = t.return;
      var l = i0(
        t.alternate,
        t,
        _l
      );
      if (l !== null) {
        ye = l;
        return;
      }
      if (t = t.sibling, t !== null) {
        ye = t;
        return;
      }
      ye = t = e;
    } while (t !== null);
    Qe === 0 && (Qe = 5);
  }
  function fm(e, t) {
    do {
      var l = c0(e.alternate, e);
      if (l !== null) {
        l.flags &= 32767, ye = l;
        return;
      }
      if (l = e.return, l !== null && (l.flags |= 32768, l.subtreeFlags = 0, l.deletions = null), !t && (e = e.sibling, e !== null)) {
        ye = e;
        return;
      }
      ye = e = l;
    } while (e !== null);
    Qe = 6, ye = null;
  }
  function om(e, t, l, a, n, u, i, f, r, p, T, O) {
    e.cancelPendingCommit = null;
    do
      Di();
    while (Ye !== 0);
    if ((Ne & 6) !== 0) throw Error(o(327));
    if (t !== null) {
      if (t === e.current) throw Error(o(177));
      e === De && (ye = De = null, be = 0), Sa = t, Kt = e, ul = l, Js = n, Pd = a, y0(
        e,
        t,
        l,
        i,
        f,
        r,
        O
      );
    }
  }
  function y0(e, t, l, a, n, u, i) {
    var f = t.lanes | t.childLanes;
    if (Ks = f, f |= Oc, Zh(
      e,
      l,
      f,
      a,
      n,
      u
    ), Pa = null, (l & 335544064) === l ? (en = Vv(e), a = 10262) : (en = null, a = 10256), (t.subtreeFlags & a) !== 0 || (t.flags & a) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, T0(_u, function() {
      return Ps(), null;
    })) : (e.callbackNode = null, e.callbackPriority = 0), pi = !1, a = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || a) {
      a = L.T, L.T = null, n = te.p, te.p = 2, u = Ne, Ne |= 4;
      try {
        s0(e, t, l);
      } finally {
        Ne = u, te.p = n, L.T = a;
      }
    }
    Ye = 1, pi ? Ia = Z0(
      i,
      e.containerInfo,
      en,
      $s,
      Ws,
      p0,
      Is,
      Ps,
      g0
    ) : ($s(), Ws(), Is());
  }
  function g0(e) {
    if (Ye !== 0) {
      var t = Kt.onRecoverableError;
      t(e, { componentStack: null });
    }
  }
  function p0() {
    Ye === 3 && (Ye = 0, Kd(Sa, Kt), Ye = 4);
  }
  function $s() {
    if (Ye === 1) {
      Ye = 0;
      var e = Kt, t = Sa, l = ul, a = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || a) {
        a = L.T, L.T = null;
        var n = te.p;
        te.p = 2;
        var u = Ne;
        Ne |= 4;
        try {
          $n = _i = !1, Vd(t, e, l), l = df;
          var i = Xo(e.containerInfo), f = l.focusedElem, r = l.selectionRange;
          if (i !== f && f && f.ownerDocument && Qo(
            f.ownerDocument.documentElement,
            f
          )) {
            if (r !== null && Nc(f)) {
              var p = r.start, T = r.end;
              if (T === void 0 && (T = p), "selectionStart" in f)
                f.selectionStart = p, f.selectionEnd = Math.min(
                  T,
                  f.value.length
                );
              else {
                var O = f.ownerDocument || document, y = O && O.defaultView || window;
                if (y.getSelection) {
                  var _ = y.getSelection(), X = f.textContent.length, J = Math.min(r.start, X), oe = r.end === void 0 ? J : Math.min(r.end, X);
                  !_.extend && J > oe && (i = oe, oe = J, J = i);
                  var g = Go(
                    f,
                    J
                  ), h = Go(
                    f,
                    oe
                  );
                  if (g && h && (_.rangeCount !== 1 || _.anchorNode !== g.node || _.anchorOffset !== g.offset || _.focusNode !== h.node || _.focusOffset !== h.offset)) {
                    var S = O.createRange();
                    S.setStart(g.node, g.offset), _.removeAllRanges(), J > oe ? (_.addRange(S), _.extend(h.node, h.offset)) : (S.setEnd(h.node, h.offset), _.addRange(S));
                  }
                }
              }
            }
            for (O = [], _ = f; _ = _.parentNode; )
              _.nodeType === 1 && O.push({
                element: _,
                left: _.scrollLeft,
                top: _.scrollTop
              });
            for (typeof f.focus == "function" && f.focus(), f = 0; f < O.length; f++) {
              var C = O[f];
              C.element.scrollLeft = C.left, C.element.scrollTop = C.top;
            }
          }
          dn = !!rf, df = rf = null;
        } finally {
          Ne = u, te.p = n, L.T = a;
        }
      }
      e.current = t, Ye = 2;
    }
  }
  function Ws() {
    if (Ye === 2) {
      Ye = 0;
      var e = Kt, t = Sa, l = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || l) {
        l = L.T, L.T = null;
        var a = te.p;
        te.p = 2;
        var n = Ne;
        Ne |= 4;
        try {
          Yd(e, t.alternate, t);
        } finally {
          Ne = n, te.p = a, L.T = l;
        }
      }
      Ye = 3;
    }
  }
  function Is() {
    if (Ye === 4 || Ye === 3) {
      Ye = 0;
      var e = Ia;
      Ia = null, Dh();
      var t = Kt, l = Sa, a = ul, n = Pd, u = (a & 335544064) === a ? 10262 : 10256;
      if ((l.subtreeFlags & u) !== 0 || (l.flags & u) !== 0 ? Ye = 5 : (Ye = 0, Sa = Kt = null, rm(t, t.pendingLanes)), u = t.pendingLanes, u === 0 && (Vl = null), cc(a), l = l.stateNode, _t && typeof _t.onCommitFiberRoot == "function")
        try {
          _t.onCommitFiberRoot(
            bn,
            l,
            void 0,
            (l.current.flags & 128) === 128
          );
        } catch {
        }
      if (n !== null) {
        l = L.T, u = te.p, te.p = 2, L.T = null;
        try {
          for (var i = t.onRecoverableError, f = 0; f < n.length; f++) {
            var r = n[f];
            i(r.value, {
              componentStack: r.stack
            });
          }
        } finally {
          L.T = l, te.p = u;
        }
      }
      if (n = Pa, i = en, en = null, n !== null && (Pa = null, i === null && (i = []), e !== null))
        for (r = 0; r < n.length; r++)
          l = (0, n[r])(
            i
          ), l !== void 0 && e.finished.finally(l);
      (ul & 3) !== 0 && Di(), il(t), u = t.pendingLanes, (a & 261930) !== 0 && (u & 42) !== 0 ? t === Ci ? eu++ : (eu = 0, Ci = t) : (eu = 0, Ci = null), tu(0);
    }
  }
  function rm(e, t) {
    (e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, qn(t)));
  }
  function Di() {
    return Ia !== null && (Ia.skipTransition(), Ia = null), $s(), Ws(), Is(), Ps();
  }
  function Ps() {
    if (Ye !== 5) return !1;
    var e = Kt, t = Ks;
    Ks = 0;
    var l = cc(ul), a = L.T, n = te.p;
    try {
      te.p = 32 > l ? 32 : l, L.T = null, l = Js, Js = null;
      var u = Kt, i = ul;
      if (Ye = 0, Sa = Kt = null, ul = 0, (Ne & 6) !== 0) throw Error(o(331));
      var f = Ne;
      if (Ne |= 4, $d(u.current), Jd(
        u,
        u.current,
        i,
        l
      ), Ne = f, tu(0, !1), _t && typeof _t.onPostCommitFiberRoot == "function")
        try {
          _t.onPostCommitFiberRoot(bn, u);
        } catch {
        }
      return !0;
    } finally {
      te.p = n, L.T = a, rm(e, t);
    }
  }
  function dm(e, t, l) {
    t = Ut(l, t), t = ys(e.stateNode, t, 2), e = Hl(e, t, 2), e !== null && (_n(e, 2), il(e));
  }
  function Ce(e, t, l) {
    if (e.tag === 3)
      dm(e, e, l);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          dm(
            t,
            e,
            l
          );
          break;
        } else if (t.tag === 1) {
          var a = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof a.componentDidCatch == "function" && (Vl === null || !Vl.has(a))) {
            e = Ut(l, e), l = sd(2), a = Hl(t, l, 2), a !== null && (fd(
              l,
              a,
              t,
              e
            ), _n(a, 2), il(a));
            break;
          }
        }
        t = t.return;
      }
  }
  function ef(e, t, l) {
    var a = e.pingCache;
    if (a === null) {
      a = e.pingCache = new r0();
      var n = /* @__PURE__ */ new Set();
      a.set(t, n);
    } else
      n = a.get(t), n === void 0 && (n = /* @__PURE__ */ new Set(), a.set(t, n));
    n.has(l) || (Vs = !0, n.add(l), e = b0.bind(null, e, t, l), t.then(e, e));
  }
  function b0(e, t, l) {
    var a = e.pingCache;
    a !== null && a.delete(t), e.pingedLanes |= e.suspendedLanes & l, e.warmLanes &= ~l, De === e && (be & l) === l && ((Qe === 4 || Qe === 3 && (be & 62914560) === be && 300 > St() - ji) && (Ne & 2) === 0 ? ln(e, 0) : Ni |= l, Wa === be && (Wa = 0)), il(e);
  }
  function mm(e, t) {
    t === 0 && (t = Wf()), e = na(e, t), e !== null && (_n(e, t), il(e));
  }
  function S0(e) {
    var t = e.memoizedState, l = 0;
    t !== null && (l = t.retryLane), mm(e, l);
  }
  function _0(e, t) {
    var l = 0;
    switch (e.tag) {
      case 31:
      case 13:
        var a = e.stateNode, n = e.memoizedState;
        n !== null && (l = n.retryLane);
        break;
      case 19:
        a = e.stateNode;
        break;
      case 22:
        a = e.stateNode._retryCache;
        break;
      default:
        throw Error(o(314));
    }
    a !== null && a.delete(t), mm(e, l);
  }
  function T0(e, t) {
    return ac(e, t);
  }
  var nn = null, un = null, tf = !1, Ui = !1, lf = !1, Kl = 0;
  function il(e) {
    e !== un && e.next === null && (un === null ? nn = un = e : un = un.next = e), Ui = !0, tf || (tf = !0, x0());
  }
  function tu(e, t) {
    if (!lf && Ui) {
      lf = !0;
      do
        for (var l = !1, a = nn; a !== null; ) {
          if (e !== 0) {
            var n = a.pendingLanes;
            if (n === 0) var u = 0;
            else {
              var i = a.suspendedLanes, f = a.pingedLanes;
              u = (1 << 31 - Tt(42 | e) + 1) - 1, u &= n & ~(i & ~f), u = u & 201326741 ? u & 201326741 | 1 : u ? u | 2 : 0;
            }
            u !== 0 && (l = !0, gm(a, u));
          } else
            u = be, u = Nu(
              a,
              a === De ? u : 0,
              a.cancelPendingCommit !== null || a.timeoutHandle !== -1
            ), (u & 3) === 0 || Sn(a, u) || (l = !0, gm(a, u));
          a = a.next;
        }
      while (l);
      lf = !1;
    }
  }
  function E0() {
    hm();
  }
  function hm() {
    Ui = tf = !1;
    var e = 0;
    Kl !== 0 && q0() && (e = Kl);
    for (var t = St(), l = null, a = nn; a !== null; ) {
      var n = a.next, u = vm(a, t);
      u === 0 ? (a.next = null, l === null ? nn = n : l.next = n, n === null && (un = l)) : (l = a, (e !== 0 || (u & 3) !== 0) && (Ui = !0)), a = n;
    }
    Ye !== 0 && Ye !== 5 || tu(e), Kl !== 0 && (Kl = 0);
  }
  function vm(e, t) {
    for (var l = e.suspendedLanes, a = e.pingedLanes, n = e.expirationTimes, u = e.pendingLanes & -62914561; 0 < u; ) {
      var i = 31 - Tt(u), f = 1 << i, r = n[i];
      r === -1 ? ((f & l) === 0 || (f & a) !== 0) && (n[i] = Xh(f, t)) : r <= t && (e.expiredLanes |= f), u &= ~f;
    }
    if (t = De, l = be, l = Nu(
      e,
      e === t ? l : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), a = e.callbackNode, l === 0 || e === t && (ze === 2 || ze === 9) || e.cancelPendingCommit !== null)
      return a !== null && a !== null && nc(a), e.callbackNode = null, e.callbackPriority = 0;
    if ((l & 3) === 0 || Sn(e, l)) {
      if (t = l & -l, t === e.callbackPriority) return t;
      switch (a !== null && nc(a), cc(l)) {
        case 2:
        case 8:
          l = kf;
          break;
        case 32:
          l = _u;
          break;
        case 268435456:
          l = Ff;
          break;
        default:
          l = _u;
      }
      return a = ym.bind(null, e), l = ac(l, a), e.callbackPriority = t, e.callbackNode = l, t;
    }
    return a !== null && a !== null && nc(a), e.callbackPriority = 2, e.callbackNode = null, 2;
  }
  function ym(e, t) {
    if (Ye !== 0 && Ye !== 5)
      return e.callbackNode = null, e.callbackPriority = 0, null;
    var l = e.callbackNode;
    if (Di() && e.callbackNode !== l)
      return null;
    var a = be;
    return a = Nu(
      e,
      e === De ? a : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), a === 0 ? null : (tm(e, a, t), vm(e, St()), e.callbackNode != null && e.callbackNode === l ? ym.bind(null, e) : null);
  }
  function gm(e, t) {
    if (Di()) return null;
    tm(e, t, !0);
  }
  function x0() {
    B0(function() {
      (Ne & 6) !== 0 ? ac(
        Jf,
        E0
      ) : hm();
    });
  }
  function af() {
    if (Kl === 0) {
      var e = oa;
      e === 0 && (e = Tu, Tu <<= 1, (Tu & 261888) === 0 && (Tu = 256)), Kl = e;
    }
    return Kl;
  }
  function pm(e) {
    return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : Ou(e);
  }
  function N0(e, t, l, a, n) {
    if (t === "submit" && l && l.stateNode === n) {
      var u = pm(
        (n[mt] || null).action
      ), i = a.submitter;
      i && (t = (t = i[mt] || null) ? pm(t.formAction) : i.getAttribute("formAction"), t !== null && (u = t, i = null));
      var f = new Uu(
        "action",
        "action",
        null,
        a,
        n
      );
      e.push({
        event: f,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (a.defaultPrevented) {
                if (Kl !== 0) {
                  var r = new FormData(n, i);
                  rs(
                    l,
                    {
                      pending: !0,
                      data: r,
                      method: n.method,
                      action: u
                    },
                    null,
                    r
                  );
                }
              } else
                typeof u == "function" && (f.preventDefault(), r = new FormData(n, i), rs(
                  l,
                  {
                    pending: !0,
                    data: r,
                    method: n.method,
                    action: u
                  },
                  u,
                  r
                ));
            },
            currentTarget: n
          }
        ]
      });
    }
  }
  for (var nf = 0; nf < Cc.length; nf++) {
    var uf = Cc[nf], j0 = uf.toLowerCase(), A0 = uf[0].toUpperCase() + uf.slice(1);
    Zt(
      j0,
      "on" + A0
    );
  }
  Zt(Vo, "onAnimationEnd"), Zt(wo, "onAnimationIteration"), Zt(Ko, "onAnimationStart"), Zt("dblclick", "onDoubleClick"), Zt("focusin", "onFocus"), Zt("focusout", "onBlur"), Zt(Hv, "onTransitionRun"), Zt(Bv, "onTransitionStart"), Zt(Yv, "onTransitionCancel"), Zt(Jo, "onTransitionEnd"), Aa("onMouseEnter", ["mouseout", "mouseover"]), Aa("onMouseLeave", ["mouseout", "mouseover"]), Aa("onPointerEnter", ["pointerout", "pointerover"]), Aa("onPointerLeave", ["pointerout", "pointerover"]), ta(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), ta(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), ta("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), ta(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), ta(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), ta(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var lu = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), z0 = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(lu)
  );
  function bm(e, t) {
    t = (t & 4) !== 0;
    for (var l = 0; l < e.length; l++) {
      var a = e[l], n = a.event;
      a = a.listeners;
      e: {
        var u = void 0;
        if (t)
          for (var i = a.length - 1; 0 <= i; i--) {
            var f = a[i], r = f.instance, p = f.currentTarget;
            if (f = f.listener, r !== u && n.isPropagationStopped())
              break e;
            u = f, n.currentTarget = p;
            try {
              u(n);
            } catch (T) {
              Bu(T);
            }
            n.currentTarget = null, u = r;
          }
        else
          for (i = 0; i < a.length; i++) {
            if (f = a[i], r = f.instance, p = f.currentTarget, f = f.listener, r !== u && n.isPropagationStopped())
              break e;
            u = f, n.currentTarget = p;
            try {
              u(n);
            } catch (T) {
              Bu(T);
            }
            n.currentTarget = null, u = r;
          }
      }
    }
  }
  function ge(e, t) {
    var l = t[ao];
    l === void 0 && (l = t[ao] = /* @__PURE__ */ new Set());
    var a = e + "__bubble";
    l.has(a) || (Sm(t, e, 2, !1), l.add(a));
  }
  function cf(e, t, l) {
    var a = 0;
    t && (a |= 4), Sm(
      l,
      e,
      a,
      t
    );
  }
  var qi = "_reactListening" + Math.random().toString(36).slice(2);
  function sf(e) {
    if (!e[qi]) {
      e[qi] = !0, io.forEach(function(l) {
        l !== "selectionchange" && (z0.has(l) || cf(l, !1, e), cf(l, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[qi] || (t[qi] = !0, cf("selectionchange", !1, t));
    }
  }
  function Sm(e, t, l, a) {
    switch (fh(t)) {
      case 2:
        var n = Sy;
        break;
      case 8:
        n = _y;
        break;
      default:
        n = zf;
    }
    l = n.bind(
      null,
      t,
      l,
      e
    ), n = void 0, !vc || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (n = !0), a ? n !== void 0 ? e.addEventListener(t, l, {
      capture: !0,
      passive: n
    }) : e.addEventListener(t, l, !0) : n !== void 0 ? e.addEventListener(t, l, {
      passive: n
    }) : e.addEventListener(t, l, !1);
  }
  function ff(e, t, l, a, n) {
    var u = a;
    if ((t & 1) === 0 && (t & 2) === 0 && a !== null)
      e: for (; ; ) {
        if (a === null) return;
        var i = a.tag;
        if (i === 3 || i === 4) {
          var f = a.stateNode.containerInfo;
          if (f === n) break;
          if (i === 4)
            for (i = a.return; i !== null; ) {
              var r = i.tag;
              if ((r === 3 || r === 4) && i.stateNode.containerInfo === n)
                return;
              i = i.return;
            }
          for (; f !== null; ) {
            if (i = ea(f), i === null) return;
            if (r = i.tag, r === 5 || r === 6 || r === 26 || r === 27) {
              a = u = i;
              continue e;
            }
            f = f.parentNode;
          }
        }
        a = a.return;
      }
    So(function() {
      var p = u, T = mc(l), O = [];
      e: {
        var y = ko.get(e);
        if (y !== void 0) {
          var _ = Uu, X = e;
          switch (e) {
            case "keypress":
              if (Mu(l) === 0) break e;
            case "keydown":
            case "keyup":
              _ = dv;
              break;
            case "focusin":
              X = "focus", _ = bc;
              break;
            case "focusout":
              X = "blur", _ = bc;
              break;
            case "beforeblur":
            case "afterblur":
              _ = bc;
              break;
            case "click":
              if (l.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              _ = Eo;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              _ = ev;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              _ = gv;
              break;
            case Vo:
            case wo:
            case Ko:
              _ = av;
              break;
            case Jo:
              _ = bv;
              break;
            case "scroll":
            case "scrollend":
              _ = Ih;
              break;
            case "wheel":
              _ = _v;
              break;
            case "copy":
            case "cut":
            case "paste":
              _ = uv;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              _ = No;
              break;
            case "submit":
              _ = vv;
              break;
            case "toggle":
            case "beforetoggle":
              _ = Ev;
          }
          var J = (t & 4) !== 0, oe = !J && (e === "scroll" || e === "scrollend"), g = J ? y !== null ? y + "Capture" : null : y;
          J = [];
          for (var h = p, S; h !== null; ) {
            var C = h;
            if (S = C.stateNode, C = C.tag, C !== 5 && C !== 26 && C !== 27 || S === null || g === null || (C = xn(h, g), C != null && J.push(
              au(h, C, S)
            )), oe) break;
            h = h.return;
          }
          0 < J.length && (y = new _(
            y,
            X,
            null,
            l,
            T
          ), O.push({ event: y, listeners: J }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (_ = e === "mouseover" || e === "pointerover", y = e === "mouseout" || e === "pointerout", _ && l !== dc && (X = l.relatedTarget || l.fromElement) && (ea(X) || X[xa]))
            break e;
          (y || _) && (X = T.window === T ? T : (_ = T.ownerDocument) ? _.defaultView || _.parentWindow : window, y ? (_ = l.relatedTarget || l.toElement, y = p, _ = _ ? ea(_) : null, _ !== null && (oe = A(_), J = _.tag, _ !== oe || J !== 5 && J !== 27 && J !== 6) && (_ = null)) : (y = null, _ = p), y !== _ && (J = Eo, C = "onMouseLeave", g = "onMouseEnter", h = "mouse", (e === "pointerout" || e === "pointerover") && (J = No, C = "onPointerLeave", g = "onPointerEnter", h = "pointer"), oe = y == null ? X : En(y), S = _ == null ? X : En(_), X = new J(
            C,
            h + "leave",
            y,
            l,
            T
          ), X.target = oe, X.relatedTarget = S, C = null, ea(T) === p && (J = new J(
            g,
            h + "enter",
            _,
            l,
            T
          ), J.target = S, J.relatedTarget = oe, C = J), oe = C, J = y && _ ? je(
            y,
            _,
            C0
          ) : null, y !== null && _m(
            O,
            X,
            y,
            J,
            !1
          ), _ !== null && oe !== null && _m(
            O,
            oe,
            _,
            J,
            !0
          )));
        }
        e: {
          if (y = p ? En(p) : window, _ = y.nodeName && y.nodeName.toLowerCase(), _ === "select" || _ === "input" && y.type === "file")
            var V = Do;
          else if (Ro(y))
            if (Uo)
              V = Dv;
            else {
              V = Rv;
              var Se = Ov;
            }
          else
            _ = y.nodeName, !_ || _.toLowerCase() !== "input" || y.type !== "checkbox" && y.type !== "radio" ? p && rc(p.elementType) && (V = Do) : V = Mv;
          if (V && (V = V(e, p))) {
            Mo(
              O,
              V,
              l,
              T
            );
            break e;
          }
          Se && Se(e, y, p);
        }
        switch (Se = p ? En(p) : window, e) {
          case "focusin":
            (Ro(Se) || Se.contentEditable === "true") && (Da = Se, jc = p, Mn = null);
            break;
          case "focusout":
            Mn = jc = Da = null;
            break;
          case "mousedown":
            Ac = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Ac = !1, Zo(O, l, T);
            break;
          case "selectionchange":
            if (qv) break;
          case "keydown":
          case "keyup":
            Zo(O, l, T);
        }
        var P;
        if (_c)
          e: {
            switch (e) {
              case "compositionstart":
                var le = "onCompositionStart";
                break e;
              case "compositionend":
                le = "onCompositionEnd";
                break e;
              case "compositionupdate":
                le = "onCompositionUpdate";
                break e;
            }
            le = void 0;
          }
        else
          Ma ? Co(e, l) && (le = "onCompositionEnd") : e === "keydown" && l.keyCode === 229 && (le = "onCompositionStart");
        le && (jo && l.locale !== "ko" && (Ma || le !== "onCompositionStart" ? le === "onCompositionEnd" && Ma && (P = _o()) : (Al = T, yc = "value" in Al ? Al.value : Al.textContent, Ma = !0)), Se = Hi(p, le), 0 < Se.length && (le = new xo(
          le,
          e,
          null,
          l,
          T
        ), O.push({ event: le, listeners: Se }), P ? le.data = P : (P = Oo(l), P !== null && (le.data = P)))), (P = Nv ? jv(e, l) : Av(e, l)) && (le = Hi(p, "onBeforeInput"), 0 < le.length && (Se = new xo(
          "onBeforeInput",
          "beforeinput",
          null,
          l,
          T
        ), O.push({
          event: Se,
          listeners: le
        }), Se.data = P)), N0(
          O,
          e,
          p,
          l,
          T
        );
      }
      bm(O, t);
    });
  }
  function au(e, t, l) {
    return {
      instance: e,
      listener: t,
      currentTarget: l
    };
  }
  function Hi(e, t) {
    for (var l = t + "Capture", a = []; e !== null; ) {
      var n = e, u = n.stateNode;
      if (n = n.tag, n !== 5 && n !== 26 && n !== 27 || u === null || (n = xn(e, l), n != null && a.unshift(
        au(e, n, u)
      ), n = xn(e, t), n != null && a.push(
        au(e, n, u)
      )), e.tag === 3) return a;
      e = e.return;
    }
    return [];
  }
  function C0(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5 && e.tag !== 27);
    return e || null;
  }
  function _m(e, t, l, a, n) {
    for (var u = t._reactName, i = []; l !== null && l !== a; ) {
      var f = l, r = f.alternate, p = f.stateNode;
      if (f = f.tag, r !== null && r === a) break;
      f !== 5 && f !== 26 && f !== 27 || p === null || (r = p, n ? (p = xn(l, u), p != null && i.unshift(
        au(l, p, r)
      )) : n || (p = xn(l, u), p != null && i.push(
        au(l, p, r)
      ))), l = l.return;
    }
    i.length !== 0 && e.push({ event: t, listeners: i });
  }
  var O0 = /\r\n?/g, R0 = /\u0000|\uFFFD/g;
  function Tm(e) {
    return (typeof e == "string" ? e : "" + e).replace(O0, `
`).replace(R0, "");
  }
  function Em(e, t) {
    return t = Tm(t), Tm(e) === t;
  }
  function Oe(e, t, l, a, n, u) {
    switch (l) {
      case "children":
        if (typeof a == "string")
          t === "body" || t === "textarea" && a === "" || Ca(e, a);
        else if (typeof a == "number" || typeof a == "bigint")
          t !== "body" && Ca(e, "" + a);
        else return;
        break;
      case "className":
        Cu(e, "class", a);
        break;
      case "tabIndex":
        Cu(e, "tabindex", a);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        Cu(e, l, a);
        break;
      case "style":
        po(e, a, u);
        return;
      case "data":
        if (t !== "object") {
          Cu(e, "data", a);
          break;
        }
      case "src":
      case "href":
        if (a === "" && (t !== "a" || l !== "href")) {
          e.removeAttribute(l);
          break;
        }
        if (a == null || typeof a == "function" || typeof a == "symbol" || typeof a == "boolean") {
          e.removeAttribute(l);
          break;
        }
        a = Ou(a), e.setAttribute(l, a);
        break;
      case "action":
      case "formAction":
        if (typeof a == "function") {
          e.setAttribute(
            l,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          typeof u == "function" && (l === "formAction" ? (t !== "input" && Oe(e, t, "name", n.name, n, null), Oe(
            e,
            t,
            "formEncType",
            n.formEncType,
            n,
            null
          ), Oe(
            e,
            t,
            "formMethod",
            n.formMethod,
            n,
            null
          ), Oe(
            e,
            t,
            "formTarget",
            n.formTarget,
            n,
            null
          )) : (Oe(e, t, "encType", n.encType, n, null), Oe(e, t, "method", n.method, n, null), Oe(e, t, "target", n.target, n, null)));
        if (a == null || typeof a == "symbol" || typeof a == "boolean") {
          e.removeAttribute(l);
          break;
        }
        a = Ou(a), e.setAttribute(l, a);
        break;
      case "onClick":
        a != null && (e.onclick = $t);
        return;
      case "onScroll":
        a != null && ge("scroll", e);
        return;
      case "onScrollEnd":
        a != null && ge("scrollend", e);
        return;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(o(61));
          if (l = a.__html, l != null) {
            if (n.children != null) throw Error(o(60));
            u?.__html !== l && (e.innerHTML = l);
          }
        }
        break;
      case "multiple":
        e.multiple = a && typeof a != "function" && typeof a != "symbol";
        break;
      case "muted":
        e.muted = a && typeof a != "function" && typeof a != "symbol";
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "ref":
        break;
      case "autoFocus":
        break;
      case "xlinkHref":
        if (a == null || typeof a == "function" || typeof a == "boolean" || typeof a == "symbol") {
          e.removeAttribute("xlink:href");
          break;
        }
        l = Ou(a), e.setAttributeNS(
          "http://www.w3.org/1999/xlink",
          "xlink:href",
          l
        );
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        a != null && typeof a != "function" && typeof a != "symbol" ? e.setAttribute(l, a) : e.removeAttribute(l);
        break;
      case "inert":
      case "allowFullScreen":
      case "async":
      case "autoPlay":
      case "controls":
      case "credentialless":
      case "default":
      case "defer":
      case "disabled":
      case "disablePictureInPicture":
      case "disableRemotePlayback":
      case "formNoValidate":
      case "hidden":
      case "loop":
      case "noModule":
      case "noValidate":
      case "open":
      case "playsInline":
      case "readOnly":
      case "required":
      case "reversed":
      case "scoped":
      case "seamless":
      case "itemScope":
        a && typeof a != "function" && typeof a != "symbol" ? e.setAttribute(l, "") : e.removeAttribute(l);
        break;
      case "capture":
      case "download":
        a === !0 ? e.setAttribute(l, "") : a !== !1 && a != null && typeof a != "function" && typeof a != "symbol" ? e.setAttribute(l, a) : e.removeAttribute(l);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        a != null && typeof a != "function" && typeof a != "symbol" && !isNaN(a) && 1 <= a ? e.setAttribute(l, a) : e.removeAttribute(l);
        break;
      case "rowSpan":
      case "start":
        a == null || typeof a == "function" || typeof a == "symbol" || isNaN(a) ? e.removeAttribute(l) : e.setAttribute(l, a);
        break;
      case "popover":
        ge("beforetoggle", e), ge("toggle", e), zu(e, "popover", a);
        break;
      case "xlinkActuate":
        fl(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          a
        );
        break;
      case "xlinkArcrole":
        fl(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          a
        );
        break;
      case "xlinkRole":
        fl(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          a
        );
        break;
      case "xlinkShow":
        fl(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          a
        );
        break;
      case "xlinkTitle":
        fl(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          a
        );
        break;
      case "xlinkType":
        fl(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          a
        );
        break;
      case "xmlBase":
        fl(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          a
        );
        break;
      case "xmlLang":
        fl(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          a
        );
        break;
      case "xmlSpace":
        fl(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          a
        );
        break;
      case "is":
        zu(e, "is", a);
        break;
      case "innerText":
      case "textContent":
        return;
      default:
        if (!(2 < l.length) || l[0] !== "o" && l[0] !== "O" || l[1] !== "n" && l[1] !== "N")
          l = $h.get(l) || l, zu(e, l, a);
        else return;
    }
    Ee = !0;
  }
  function of(e, t, l, a, n, u) {
    switch (l) {
      case "style":
        po(e, a, u);
        return;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(o(61));
          if (l = a.__html, l != null) {
            if (n.children != null) throw Error(o(60));
            u?.__html !== l && (e.innerHTML = l);
          }
        }
        break;
      case "children":
        if (typeof a == "string") Ca(e, a);
        else if (typeof a == "number" || typeof a == "bigint")
          Ca(e, "" + a);
        else return;
        break;
      case "onScroll":
        a != null && ge("scroll", e);
        return;
      case "onScrollEnd":
        a != null && ge("scrollend", e);
        return;
      case "onClick":
        a != null && (e.onclick = $t);
        return;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "innerHTML":
      case "ref":
        return;
      case "innerText":
      case "textContent":
        return;
      default:
        if (!co.hasOwnProperty(l))
          e: {
            if (l[0] === "o" && l[1] === "n" && (n = l.endsWith("Capture"), u = l.slice(2, n ? l.length - 7 : void 0), t = e[mt] || null, t = t != null ? t[l] : null, typeof t == "function" && e.removeEventListener(u, t, n), typeof a == "function")) {
              typeof t != "function" && t !== null && (l in e ? e[l] = null : e.hasAttribute(l) && e.removeAttribute(l)), e.addEventListener(u, a, n);
              break e;
            }
            Ee = !0, l in e ? e[l] = a : a === !0 ? e.setAttribute(l, "") : zu(e, l, a);
          }
        return;
    }
    Ee = !0;
  }
  function nt(e, t, l) {
    switch (t) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "img":
        ge("error", e), ge("load", e);
        var a = !1, n = !1, u;
        for (u in l)
          if (l.hasOwnProperty(u)) {
            var i = l[u];
            if (i != null)
              switch (u) {
                case "src":
                  a = !0;
                  break;
                case "srcSet":
                  n = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(o(137, t));
                default:
                  Oe(e, t, u, i, l, null);
              }
          }
        n && Oe(e, t, "srcSet", l.srcSet, l, null), a && Oe(e, t, "src", l.src, l, null);
        return;
      case "input":
        ge("invalid", e);
        var f = u = i = n = null, r = null, p = null;
        for (a in l)
          if (l.hasOwnProperty(a)) {
            var T = l[a];
            if (T != null)
              switch (a) {
                case "name":
                  n = T;
                  break;
                case "type":
                  i = T;
                  break;
                case "checked":
                  r = T;
                  break;
                case "defaultChecked":
                  p = T;
                  break;
                case "value":
                  u = T;
                  break;
                case "defaultValue":
                  f = T;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (T != null)
                    throw Error(o(137, t));
                  break;
                default:
                  Oe(e, t, a, T, l, null);
              }
          }
        ho(
          e,
          u,
          f,
          r,
          p,
          i,
          n,
          !1
        );
        return;
      case "select":
        ge("invalid", e), a = i = u = null;
        for (n in l)
          if (l.hasOwnProperty(n) && (f = l[n], f != null))
            switch (n) {
              case "value":
                u = f;
                break;
              case "defaultValue":
                i = f;
                break;
              case "multiple":
                a = f;
              default:
                Oe(e, t, n, f, l, null);
            }
        t = u, l = i, e.multiple = !!a, t != null ? za(e, !!a, t, !1) : l != null && za(e, !!a, l, !0);
        return;
      case "textarea":
        ge("invalid", e), u = n = a = null;
        for (i in l)
          if (l.hasOwnProperty(i) && (f = l[i], f != null))
            switch (i) {
              case "value":
                a = f;
                break;
              case "defaultValue":
                n = f;
                break;
              case "children":
                u = f;
                break;
              case "dangerouslySetInnerHTML":
                if (f != null) throw Error(o(91));
                break;
              default:
                Oe(e, t, i, f, l, null);
            }
        yo(e, a, n, u);
        return;
      case "option":
        for (r in l)
          l.hasOwnProperty(r) && (a = l[r], a != null) && (r === "selected" ? e.selected = a && typeof a != "function" && typeof a != "symbol" : Oe(e, t, r, a, l, null));
        return;
      case "dialog":
        ge("beforetoggle", e), ge("toggle", e), ge("cancel", e), ge("close", e);
        break;
      case "iframe":
      case "object":
        ge("load", e);
        break;
      case "video":
      case "audio":
        for (a = 0; a < lu.length; a++)
          ge(lu[a], e);
        break;
      case "image":
        ge("error", e), ge("load", e);
        break;
      case "details":
        ge("toggle", e);
        break;
      case "embed":
      case "source":
      case "link":
        ge("error", e), ge("load", e);
      case "area":
      case "base":
      case "br":
      case "col":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "track":
      case "wbr":
      case "menuitem":
        for (p in l)
          if (l.hasOwnProperty(p) && (a = l[p], a != null))
            switch (p) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(o(137, t));
              default:
                Oe(e, t, p, a, l, null);
            }
        return;
      default:
        if (rc(t)) {
          for (T in l)
            l.hasOwnProperty(T) && (a = l[T], a !== void 0 && of(
              e,
              t,
              T,
              a,
              l,
              void 0
            ));
          return;
        }
    }
    for (f in l)
      l.hasOwnProperty(f) && (a = l[f], a != null && Oe(e, t, f, a, l, null));
  }
  var M0 = {};
  function D0(e, t, l, a) {
    switch (t) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "input":
        var n = null, u = null, i = null, f = null, r = null, p = null, T = null;
        for (_ in l) {
          var O = l[_];
          if (l.hasOwnProperty(_) && O != null)
            switch (_) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                r = O;
              default:
                a.hasOwnProperty(_) || Oe(e, t, _, null, a, O);
            }
        }
        for (var y in a) {
          var _ = a[y];
          if (O = l[y], a.hasOwnProperty(y) && (_ != null || O != null))
            switch (y) {
              case "type":
                _ !== O && (Ee = !0), u = _;
                break;
              case "name":
                _ !== O && (Ee = !0), n = _;
                break;
              case "checked":
                _ !== O && (Ee = !0), p = _;
                break;
              case "defaultChecked":
                _ !== O && (Ee = !0), T = _;
                break;
              case "value":
                _ !== O && (Ee = !0), i = _;
                break;
              case "defaultValue":
                _ !== O && (Ee = !0), f = _;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (_ != null)
                  throw Error(o(137, t));
                break;
              default:
                _ !== O && Oe(
                  e,
                  t,
                  y,
                  _,
                  a,
                  O
                );
            }
        }
        fc(
          e,
          i,
          f,
          r,
          p,
          T,
          u,
          n
        );
        return;
      case "select":
        _ = i = f = y = null;
        for (u in l)
          if (r = l[u], l.hasOwnProperty(u) && r != null)
            switch (u) {
              case "value":
                break;
              case "multiple":
                _ = r;
              default:
                a.hasOwnProperty(u) || Oe(
                  e,
                  t,
                  u,
                  null,
                  a,
                  r
                );
            }
        for (n in a)
          if (u = a[n], r = l[n], a.hasOwnProperty(n) && (u != null || r != null))
            switch (n) {
              case "value":
                u !== r && (Ee = !0), y = u;
                break;
              case "defaultValue":
                u !== r && (Ee = !0), f = u;
                break;
              case "multiple":
                u !== r && (Ee = !0), i = u;
              default:
                u !== r && Oe(
                  e,
                  t,
                  n,
                  u,
                  a,
                  r
                );
            }
        t = f, l = i, a = _, y != null ? za(e, !!l, y, !1) : !!a != !!l && (t != null ? za(e, !!l, t, !0) : za(e, !!l, l ? [] : "", !1));
        return;
      case "textarea":
        _ = y = null;
        for (f in l)
          if (n = l[f], l.hasOwnProperty(f) && n != null && !a.hasOwnProperty(f))
            switch (f) {
              case "value":
                break;
              case "children":
                break;
              default:
                Oe(e, t, f, null, a, n);
            }
        for (i in a)
          if (n = a[i], u = l[i], a.hasOwnProperty(i) && (n != null || u != null))
            switch (i) {
              case "value":
                n !== u && (Ee = !0), y = n;
                break;
              case "defaultValue":
                n !== u && (Ee = !0), _ = n;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (n != null) throw Error(o(91));
                break;
              default:
                n !== u && Oe(e, t, i, n, a, u);
            }
        vo(e, y, _);
        return;
      case "option":
        for (var X in l)
          y = l[X], l.hasOwnProperty(X) && y != null && !a.hasOwnProperty(X) && (X === "selected" ? e.selected = !1 : Oe(
            e,
            t,
            X,
            null,
            a,
            y
          ));
        for (r in a)
          y = a[r], _ = l[r], a.hasOwnProperty(r) && y !== _ && (y != null || _ != null) && (r === "selected" ? (y !== _ && (Ee = !0), e.selected = y && typeof y != "function" && typeof y != "symbol") : Oe(
            e,
            t,
            r,
            y,
            a,
            _
          ));
        return;
      case "img":
      case "link":
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
      case "menuitem":
        for (var J in l)
          y = l[J], l.hasOwnProperty(J) && y != null && !a.hasOwnProperty(J) && Oe(e, t, J, null, a, y);
        for (p in a)
          if (y = a[p], _ = l[p], a.hasOwnProperty(p) && y !== _ && (y != null || _ != null))
            switch (p) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (y != null)
                  throw Error(o(137, t));
                break;
              default:
                Oe(
                  e,
                  t,
                  p,
                  y,
                  a,
                  _
                );
            }
        return;
      default:
        if (rc(t)) {
          for (var oe in l)
            y = l[oe], l.hasOwnProperty(oe) && y !== void 0 && !a.hasOwnProperty(oe) && of(
              e,
              t,
              oe,
              void 0,
              a,
              y
            );
          for (T in a)
            y = a[T], _ = l[T], !a.hasOwnProperty(T) || y === _ || y === void 0 && _ === void 0 || of(
              e,
              t,
              T,
              y,
              a,
              _
            );
          return;
        }
    }
    for (var g in l)
      y = l[g], l.hasOwnProperty(g) && y != null && !a.hasOwnProperty(g) && Oe(e, t, g, null, a, y);
    for (O in a)
      y = a[O], _ = l[O], !a.hasOwnProperty(O) || y === _ || y == null && _ == null || Oe(e, t, O, y, a, _);
  }
  function xm(e) {
    switch (e) {
      case "css":
      case "script":
      case "font":
      case "img":
      case "image":
      case "input":
      case "link":
        return !0;
      default:
        return !1;
    }
  }
  function U0() {
    if (typeof performance.getEntriesByType == "function") {
      for (var e = 0, t = 0, l = performance.getEntriesByType("resource"), a = 0; a < l.length; a++) {
        var n = l[a], u = n.transferSize, i = n.initiatorType, f = n.duration;
        if (u && f && xm(i)) {
          for (i = 0, f = n.responseEnd, a += 1; a < l.length; a++) {
            var r = l[a], p = r.startTime;
            if (p > f) break;
            var T = r.transferSize, O = r.initiatorType;
            T && xm(O) && (r = r.responseEnd, i += T * (r < f ? 1 : (f - p) / (r - p)));
          }
          if (--a, t += 8 * (u + i) / (n.duration / 1e3), e++, 10 < e) break;
        }
      }
      if (0 < e) return t / e / 1e6;
    }
    return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
  }
  var rf = null, df = null;
  function nu(e) {
    return e.nodeType === 9 ? e : e.ownerDocument;
  }
  function Nm(e) {
    switch (e) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function jm(e, t) {
    if (e === 0)
      switch (t) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
    return e === 1 && t === "foreignObject" ? 0 : e;
  }
  function Am(e, t, l, a) {
    return l = nu(
      l
    ).createElement(e), l[Pe] = a, l[mt] = t, nt(l, e, t), ke(l), l;
  }
  function mf(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var hf = null;
  function q0() {
    var e = window.event;
    return e && e.type === "popstate" ? e === hf ? !1 : (hf = e, !0) : (hf = null, !1);
  }
  var vf = typeof setTimeout == "function" ? setTimeout : void 0, H0 = typeof clearTimeout == "function" ? clearTimeout : void 0, zm = typeof Promise == "function" ? Promise : void 0, Cm = typeof requestAnimationFrame == "function" ? requestAnimationFrame : vf, B0 = typeof queueMicrotask == "function" ? queueMicrotask : typeof zm < "u" ? function(e) {
    return zm.resolve(null).then(e).catch(Y0);
  } : vf;
  function Y0(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function Jl(e) {
    return e === "head";
  }
  function Om(e, t) {
    var l = t, a = 0;
    do {
      var n = l.nextSibling;
      if (e.removeChild(l), n && n.nodeType === 8)
        if (l = n.data, l === "/$" || l === "/&") {
          if (a === 0) {
            e.removeChild(n), mn(t);
            return;
          }
          a--;
        } else if (l === "$" || l === "$?" || l === "$~" || l === "$!" || l === "&")
          a++;
        else if (l === "html")
          Ef(
            e.ownerDocument.documentElement
          );
        else if (l === "head") {
          l = e.ownerDocument.head, Ef(l);
          for (var u = l.firstChild; u; ) {
            var i = u.nextSibling, f = u.nodeName;
            u[Tn] || f === "SCRIPT" || f === "STYLE" || f === "LINK" && u.rel.toLowerCase() === "stylesheet" || l.removeChild(u), u = i;
          }
        } else
          l === "body" && Ef(e.ownerDocument.body);
      l = n;
    } while (l);
    mn(t);
  }
  function Rm(e, t) {
    var l = e;
    e = 0;
    do {
      var a = l.nextSibling;
      if (l.nodeType === 1 ? t ? (l._stashedDisplay = l.style.display, l.style.display = "none") : (l.style.display = l._stashedDisplay || "", l.getAttribute("style") === "" && l.removeAttribute("style")) : l.nodeType === 3 && (t ? (l._stashedText = l.nodeValue, l.nodeValue = "") : l.nodeValue = l._stashedText || ""), a && a.nodeType === 8)
        if (l = a.data, l === "/$") {
          if (e === 0) break;
          e--;
        } else
          l !== "$" && l !== "$?" && l !== "$~" && l !== "$!" || e++;
      l = a;
    } while (l);
  }
  function Mm(e, t, l) {
    if (t = CSS.escape(t) !== t ? "r-" + btoa(t).replace(/=/g, "") : t, e.style.viewTransitionName = t, l != null && (e.style.viewTransitionClass = l), l = getComputedStyle(e), l.display === "inline") {
      if (t = e.getClientRects(), t.length === 1) var a = 1;
      else
        for (var n = a = 0; n < t.length; n++) {
          var u = t[n];
          0 < u.width && 0 < u.height && a++;
        }
      a === 1 && (e = e.style, e.display = t.length === 1 ? "inline-block" : "block", e.marginTop = "-" + l.paddingTop, e.marginBottom = "-" + l.paddingBottom);
    }
  }
  function Dm(e, t) {
    e = e.style, t = t.style;
    var l = t != null ? t.hasOwnProperty("viewTransitionName") ? t.viewTransitionName : t.hasOwnProperty("view-transition-name") ? t["view-transition-name"] : null : null;
    e.viewTransitionName = l == null || typeof l == "boolean" ? "" : ("" + l).trim(), l = t != null ? t.hasOwnProperty("viewTransitionClass") ? t.viewTransitionClass : t.hasOwnProperty("view-transition-class") ? t["view-transition-class"] : null : null, e.viewTransitionClass = l == null || typeof l == "boolean" ? "" : ("" + l).trim(), e.display === "inline-block" && (t == null ? e.display = e.margin = "" : (l = t.display, e.display = l == null || typeof l == "boolean" ? "" : l, l = t.margin, l != null ? e.margin = l : (l = t.hasOwnProperty("marginTop") ? t.marginTop : t["margin-top"], e.marginTop = l == null || typeof l == "boolean" ? "" : l, t = t.hasOwnProperty("marginBottom") ? t.marginBottom : t["margin-bottom"], e.marginBottom = t == null || typeof t == "boolean" ? "" : t)));
  }
  function G0(e, t, l) {
    return l = l.ownerDocument.defaultView, {
      rect: e,
      abs: t.position === "absolute" || t.position === "fixed",
      clip: t.clipPath !== "none" || t.overflow !== "visible" || t.filter !== "none" || t.mask !== "none" || t.mask !== "none" || t.borderRadius !== "0px",
      view: 0 <= e.bottom && 0 <= e.right && e.top <= l.innerHeight && e.left <= l.innerWidth
    };
  }
  function yf(e) {
    var t = e.getBoundingClientRect(), l = getComputedStyle(e);
    return G0(t, l, e);
  }
  function Q0(e) {
    return e.documentElement.clientHeight;
  }
  function X0(e) {
    this.addEventListener("load", e), this.addEventListener("error", e);
  }
  function Z0(e, t, l, a, n, u, i, f, r) {
    var p = t.nodeType === 9 ? t : t.ownerDocument;
    try {
      var T = p.startViewTransition({
        update: function() {
          var y = p.defaultView, _ = y.navigation && y.navigation.transition, X = p.fonts.status;
          a();
          var J = [];
          if (X === "loaded" && (Q0(p), p.fonts.status === "loading" && J.push(p.fonts.ready)), X = J.length, e !== null)
            for (var oe = e.suspenseyImages, g = 0, h = 0; h < oe.length; h++) {
              var S = oe[h];
              if (!S.complete) {
                var C = S.getBoundingClientRect();
                if (0 < C.bottom && 0 < C.right && C.top < y.innerHeight && C.left < y.innerWidth) {
                  if (g += eh(S), g > Gi) {
                    J.length = X;
                    break;
                  }
                  S = new Promise(
                    X0.bind(S)
                  ), J.push(S);
                }
              }
            }
          if (0 < J.length)
            return y = Promise.race([
              Promise.all(J),
              new Promise(function(V) {
                return setTimeout(V, 500);
              })
            ]).then(n, n), (_ ? Promise.allSettled([_.finished, y]) : y).then(u, u);
          if (n(), _)
            return _.finished.then(
              u,
              u
            );
          u();
        },
        types: l
      });
      p.__reactViewTransition = T;
      var O = [];
      return T.ready.then(
        function() {
          for (var y = p.documentElement.getAnimations({
            subtree: !0
          }), _ = 0; _ < y.length; _++) {
            var X = y[_], J = X.effect, oe = J.pseudoElement;
            if (oe != null && oe.startsWith("::view-transition")) {
              O.push(X), X = J.getKeyframes();
              for (var g = oe = void 0, h = !0, S = 0; S < X.length; S++) {
                var C = X[S], V = C.width;
                if (oe === void 0) oe = V;
                else if (oe !== V) {
                  h = !1;
                  break;
                }
                if (V = C.height, g === void 0) g = V;
                else if (g !== V) {
                  h = !1;
                  break;
                }
                delete C.width, delete C.height, C.transform === "none" && delete C.transform;
              }
              h && oe !== void 0 && g !== void 0 && (J.setKeyframes(X), h = getComputedStyle(
                J.target,
                J.pseudoElement
              ), h.width !== oe || h.height !== g) && (h = X[0], h.width = oe, h.height = g, h = X[X.length - 1], h.width = oe, h.height = g, J.setKeyframes(X));
            }
          }
          i();
        },
        function(y) {
          p.__reactViewTransition === T && (p.__reactViewTransition = null);
          try {
            typeof y == "object" && y !== null && y.name === "InvalidStateError" && (y.message === "View transition was skipped because document visibility state is hidden." || y.message === "Skipping view transition because document visibility state has become hidden." || y.message === "Skipping view transition because viewport size changed." || y.message === "Transition was aborted because of invalid state") && (y = null), y !== null && r(y);
          } finally {
            a(), n(), i();
          }
        }
      ), T.finished.finally(function() {
        for (var y = 0; y < O.length; y++)
          O[y].cancel();
        p.__reactViewTransition === T && (p.__reactViewTransition = null), f();
      }), T;
    } catch {
      return a(), n(), i(), null;
    }
  }
  function _a(e, t) {
    this._scope = document.documentElement, this._selector = "::view-transition-" + e + "(" + t + ")";
  }
  _a.prototype.animate = function(e, t) {
    return t = typeof t == "number" ? { duration: t } : K({}, t), t.pseudoElement = this._selector, this._scope.animate(e, t);
  }, _a.prototype.getAnimations = function() {
    for (var e = this._scope, t = this._selector, l = e.getAnimations({ subtree: !0 }), a = [], n = 0; n < l.length; n++) {
      var u = l[n].effect;
      u !== null && u.target === e && u.pseudoElement === t && a.push(l[n]);
    }
    return a;
  }, _a.prototype.getComputedStyle = function() {
    return getComputedStyle(this._scope, this._selector);
  };
  function Um(e) {
    return {
      name: e,
      group: new _a("group", e),
      imagePair: new _a("image-pair", e),
      old: new _a("old", e),
      new: new _a("new", e)
    };
  }
  function Ot(e) {
    this._fragmentFiber = e, this._observers = this._eventListeners = null;
  }
  Ot.prototype.addEventListener = function(e, t, l) {
    var a = null, n = null;
    if (!(l != null && typeof l != "boolean" && (a = l.signal || null, a !== null && a.aborted))) {
      this._eventListeners === null && (this._eventListeners = []);
      var u = this._eventListeners;
      if (Hm(u, e, t, l) === -1) {
        var i = this, f = t;
        l != null && typeof l != "boolean" && l.once === !0 && (f = function(r) {
          i.removeEventListener(
            e,
            t,
            l
          ), typeof t == "function" ? t.call(this, r) : t.handleEvent(r);
        }), a !== null && (n = i.removeEventListener.bind(
          i,
          e,
          t,
          l
        ), a.addEventListener("abort", n, { once: !0 }), n = a.removeEventListener.bind(a, "abort", n)), a = cn(l), u.push({
          type: e,
          listener: t,
          optionsOrUseCapture: l,
          attachedListener: f,
          cleanup: n
        }), m(
          this._fragmentFiber.child,
          !1,
          L0,
          e,
          f,
          a
        );
      }
      this._eventListeners = u;
    }
  };
  function L0(e, t, l, a) {
    return Q(e).addEventListener(
      t,
      l,
      a
    ), !1;
  }
  Ot.prototype.removeEventListener = function(e, t, l) {
    var a = this._eventListeners;
    if (a !== null && (t = Hm(
      a,
      e,
      t,
      l
    ), t !== -1)) {
      var n = a[t];
      l = n.attachedListener;
      var u = n.cleanup;
      n = cn(n.optionsOrUseCapture), m(
        this._fragmentFiber.child,
        !1,
        V0,
        e,
        l,
        n
      ), a.splice(t, 1), u !== null && u();
    }
  };
  function V0(e, t, l, a) {
    return Q(e).removeEventListener(
      t,
      l,
      a
    ), !1;
  }
  function cn(e) {
    return e != null && typeof e != "boolean" && (e.once === !0 || e.signal instanceof AbortSignal) ? { capture: e.capture, passive: e.passive } : e;
  }
  function qm(e) {
    return e == null ? "c=0" : typeof e == "boolean" ? "c=" + (e ? "1" : "0") : "c=" + (e.capture ? "1" : "0");
  }
  function Hm(e, t, l, a) {
    if (e.length === 0) return -1;
    a = qm(a);
    for (var n = 0; n < e.length; n++) {
      var u = e[n];
      if (u.type === t && u.listener === l && qm(u.optionsOrUseCapture) === a)
        return n;
    }
    return -1;
  }
  Ot.prototype.dispatchEvent = function(e) {
    var t = j(
      this._fragmentFiber
    );
    if (t === null) return !0;
    t = Q(t);
    var l = this._eventListeners;
    if (l !== null && 0 < l.length || !e.bubbles) {
      var a = t.nodeType === 9 ? t.createComment("") : document.createTextNode("");
      if (l)
        for (var n = 0; n < l.length; n++) {
          var u = l[n];
          a.addEventListener(
            u.type,
            u.attachedListener,
            cn(u.optionsOrUseCapture)
          );
        }
      if (t.appendChild(a), e = a.dispatchEvent(e), l)
        for (n = 0; n < l.length; n++)
          u = l[n], a.removeEventListener(
            u.type,
            u.attachedListener,
            cn(u.optionsOrUseCapture)
          );
      return t.removeChild(a), e;
    }
    return t.dispatchEvent(e);
  }, Ot.prototype.focus = function(e) {
    m(
      this._fragmentFiber.child,
      !0,
      Bm,
      e,
      void 0,
      void 0
    );
  };
  function Bm(e, t) {
    return e.tag === 6 ? !1 : (e = Q(e), ly(e, t));
  }
  Ot.prototype.focusLast = function(e) {
    var t = [];
    m(
      this._fragmentFiber.child,
      !0,
      gf,
      t,
      void 0,
      void 0
    );
    for (var l = t.length - 1; 0 <= l && !Bm(t[l], e); l--) ;
  };
  function gf(e, t) {
    return t.push(e), !1;
  }
  Ot.prototype.blur = function() {
    var e = j(
      this._fragmentFiber
    );
    e !== null && (e = Q(e), e = nu(e).activeElement, e !== null && m(
      this._fragmentFiber.child,
      !1,
      w0,
      e,
      void 0,
      void 0
    ));
  };
  function w0(e, t) {
    return e.tag === 6 ? !1 : (e = Q(e), e === t || e.contains(t) ? (t.blur(), !0) : !1);
  }
  Ot.prototype.observeUsing = function(e) {
    this._observers === null && (this._observers = /* @__PURE__ */ new Set()), this._observers.add(e), m(
      this._fragmentFiber.child,
      !1,
      K0,
      e,
      void 0,
      void 0
    );
  };
  function K0(e, t) {
    return e.tag === 6 || (e = Q(e), t.observe(e)), !1;
  }
  Ot.prototype.unobserveUsing = function(e) {
    var t = this._observers;
    if (t !== null && t.has(e)) {
      t.delete(e), m(
        this._fragmentFiber.child,
        !1,
        J0,
        e,
        void 0,
        void 0
      );
      for (var l = t = 0; l < Jt.length; l++) {
        var a = Jt[l];
        a.fragmentInstance === this && a.observer === e ? e.unobserve(a.instance) : Jt[t++] = a;
      }
      Jt.length = t;
    }
  };
  function J0(e, t) {
    return e.tag === 6 || (e = Q(e), t.unobserve(e)), !1;
  }
  var Jt = [], pf = !1;
  function k0(e, t, l) {
    Jt.push({
      fragmentInstance: e,
      observer: t,
      instance: l
    }), pf || (pf = !0, ay(function() {
      pf = !1;
      var a = Jt;
      Jt = [];
      for (var n = 0; n < a.length; n++) {
        var u = a[n];
        u.observer.unobserve(u.instance);
      }
    }));
  }
  Ot.prototype.getClientRects = function() {
    var e = [];
    return m(
      this._fragmentFiber.child,
      !1,
      F0,
      e,
      void 0,
      void 0
    ), e;
  };
  function F0(e, t) {
    if (e.tag === 6) {
      e = e.stateNode;
      var l = e.ownerDocument.createRange();
      l.selectNodeContents(e), t.push.apply(t, l.getClientRects());
    } else
      e = Q(e), t.push.apply(t, e.getClientRects());
    return !1;
  }
  Ot.prototype.getRootNode = function(e) {
    var t = j(
      this._fragmentFiber
    );
    return t === null ? this : Q(t).getRootNode(e);
  }, Ot.prototype.compareDocumentPosition = function(e) {
    var t = j(
      this._fragmentFiber
    );
    if (t === null) return Node.DOCUMENT_POSITION_DISCONNECTED;
    var l = [];
    m(
      this._fragmentFiber.child,
      !1,
      gf,
      l,
      void 0,
      void 0
    );
    var a = Q(t);
    if (l.length === 0) {
      if (l = a, M(this._fragmentFiber)) {
        e: {
          for (t = this._fragmentFiber.return; t !== null; ) {
            if (t.tag === 4) {
              t = t.stateNode.containerInfo;
              break e;
            }
            if (t.tag === 3 || t.tag === 5 || t.tag === 27)
              break;
            t = t.return;
          }
          t = null;
        }
        t != null && (l = t);
      }
      t = this._fragmentFiber;
      var n = a = l.compareDocumentPosition(e);
      return l === e ? n = Node.DOCUMENT_POSITION_CONTAINS : a & Node.DOCUMENT_POSITION_CONTAINED_BY && (l = G(t)[1], l === null ? n = Node.DOCUMENT_POSITION_PRECEDING : (e = Q(l).compareDocumentPosition(
        e
      ), n = e === 0 || e & Node.DOCUMENT_POSITION_FOLLOWING ? Node.DOCUMENT_POSITION_FOLLOWING : Node.DOCUMENT_POSITION_PRECEDING)), n |= Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
    }
    t = Q(l[0]), n = Q(l[l.length - 1]);
    var u = M(this._fragmentFiber) ? t.parentElement : a;
    if (u == null)
      return Node.DOCUMENT_POSITION_DISCONNECTED;
    a = u.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_CONTAINED_BY, u = u.compareDocumentPosition(n) & Node.DOCUMENT_POSITION_CONTAINED_BY;
    var i = t.compareDocumentPosition(e), f = n.compareDocumentPosition(e), r = i & Node.DOCUMENT_POSITION_CONTAINED_BY || f & Node.DOCUMENT_POSITION_CONTAINED_BY;
    return f = a && u && i & Node.DOCUMENT_POSITION_FOLLOWING && f & Node.DOCUMENT_POSITION_PRECEDING, t = a && t === e || u && n === e || r || f ? Node.DOCUMENT_POSITION_CONTAINED_BY : !a && t === e || !u && n === e ? Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC : i, t & Node.DOCUMENT_POSITION_DISCONNECTED || t & Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC || $0(
      t,
      this._fragmentFiber,
      l[0],
      l[l.length - 1],
      e
    ) ? t : Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
  };
  function $0(e, t, l, a, n) {
    var u = ea(n);
    if (e & Node.DOCUMENT_POSITION_CONTAINED_BY) {
      if (l = !!u)
        e: {
          for (; u !== null; ) {
            if (u.tag === 7 && (u === t || u.alternate === t)) {
              l = !0;
              break e;
            }
            u = u.return;
          }
          l = !1;
        }
      return l;
    }
    if (e & Node.DOCUMENT_POSITION_CONTAINS) {
      if (u === null)
        return u = n.ownerDocument, n === u || n === u.documentElement || n === u.body;
      e: {
        for (u = t, t = j(t); u !== null; ) {
          if (!(u.tag !== 5 && u.tag !== 3 && u.tag !== 27 || u !== t && u.alternate !== t)) {
            u = !0;
            break e;
          }
          u = u.return;
        }
        u = !1;
      }
      return u;
    }
    return e & Node.DOCUMENT_POSITION_PRECEDING ? ((t = !!u) && !(t = u === l) && (t = je(
      l,
      u,
      Me
    ), t === null ? t = !1 : (m(
      t,
      !0,
      ve,
      u,
      l
    ), u = se, se = null, t = u !== null)), t) : e & Node.DOCUMENT_POSITION_FOLLOWING ? ((t = !!u) && !(t = u === a) && (t = je(
      a,
      u,
      Me
    ), t === null ? t = !1 : (m(
      t,
      !0,
      re,
      u,
      a
    ), u = se, de = se = null, t = u !== null)), t) : !1;
  }
  function Ym(e, t) {
    var l = e.ownerDocument.createRange();
    l.selectNodeContents(e), e = l.getBoundingClientRect(), window.scrollTo(
      window.scrollX + e.left,
      t ? window.scrollY + e.top : window.scrollY + e.bottom - window.innerHeight
    );
  }
  Ot.prototype.scrollIntoView = function(e) {
    if (typeof e == "object") throw Error(o(566));
    var t = [];
    m(
      this._fragmentFiber.child,
      !1,
      gf,
      t,
      void 0,
      void 0
    );
    var l = e !== !1;
    if (t.length === 0) {
      var a = G(
        this._fragmentFiber
      );
      if (a = l ? a[1] || a[0] || j(this._fragmentFiber) : a[0] || a[1], a === null) return;
      if (a.tag === 6) {
        e = Q(a), Ym(e, l);
        return;
      }
      if (a = Q(a), a.nodeType !== 9) {
        if (a.nodeType === 11) {
          l = "host" in a ? a.host : null, l !== null && l.scrollIntoView(e);
          return;
        }
        a.scrollIntoView(e);
      }
    }
    for (a = l ? t.length - 1 : 0; a !== (l ? -1 : t.length); ) {
      var n = t[a];
      n.tag === 6 ? (n = Q(n), Ym(n, l)) : Q(n).scrollIntoView(e), a += l ? -1 : 1;
    }
  };
  function W0(e, t) {
    return e = Q(e), Gm(e, t), !1;
  }
  function Gm(e, t) {
    e.reactFragments == null && (e.reactFragments = /* @__PURE__ */ new Set()), e.reactFragments.add(t);
  }
  function Qm(e, t) {
    var l = t._eventListeners;
    if (l !== null)
      for (var a = 0; a < l.length; a++) {
        var n = l[a];
        e.addEventListener(
          n.type,
          n.attachedListener,
          cn(n.optionsOrUseCapture)
        );
      }
    e.nodeType !== 3 && (l = t._observers, l !== null && l.forEach(function(u) {
      for (var i = 0, f = 0; f < Jt.length; f++) {
        var r = Jt[f];
        (r.fragmentInstance !== t || r.observer !== u || r.instance !== e) && (Jt[i++] = r);
      }
      Jt.length = i, u.observe(e);
    }), Gm(e, t));
  }
  function I0(e, t) {
    var l = t._eventListeners;
    if (l !== null)
      for (var a = 0; a < l.length; a++) {
        var n = l[a];
        e.removeEventListener(
          n.type,
          n.attachedListener,
          cn(n.optionsOrUseCapture)
        );
      }
    e.nodeType !== 3 && (l = t._observers, l !== null && l.forEach(function(u) {
      typeof u.rootMargin == "string" ? k0(
        t,
        u,
        e
      ) : u.unobserve(e);
    }), e.reactFragments != null && e.reactFragments.delete(t));
  }
  function bf(e) {
    var t = e.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var l = t;
      switch (t = t.nextSibling, l.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          bf(l), Au(l);
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (l.rel.toLowerCase() === "stylesheet") continue;
      }
      e.removeChild(l);
    }
  }
  function P0(e, t, l, a) {
    for (; e.nodeType === 1; ) {
      var n = l;
      if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!a && (e.nodeName !== "INPUT" || e.type !== "hidden"))
          break;
      } else if (a) {
        if (!e[Tn])
          switch (t) {
            case "meta":
              if (!e.hasAttribute("itemprop")) break;
              return e;
            case "link":
              if (u = e.getAttribute("rel"), u === "stylesheet" && e.hasAttribute("data-precedence"))
                break;
              if (u !== n.rel || e.getAttribute("href") !== (n.href == null || n.href === "" ? null : n.href) || e.getAttribute("crossorigin") !== (n.crossOrigin == null ? null : n.crossOrigin) || e.getAttribute("title") !== (n.title == null ? null : n.title))
                break;
              return e;
            case "style":
              if (e.hasAttribute("data-precedence")) break;
              return e;
            case "script":
              if (u = e.getAttribute("src"), (u !== (n.src == null ? null : n.src) || e.getAttribute("type") !== (n.type == null ? null : n.type) || e.getAttribute("crossorigin") !== (n.crossOrigin == null ? null : n.crossOrigin)) && u && e.hasAttribute("async") && !e.hasAttribute("itemprop"))
                break;
              return e;
            default:
              return e;
          }
      } else if (t === "input" && e.type === "hidden") {
        var u = n.name == null ? null : "" + n.name;
        if (n.type === "hidden" && e.getAttribute("name") === u)
          return e;
      } else return e;
      if (e = Gt(e.nextSibling), e === null) break;
    }
    return null;
  }
  function ey(e, t, l) {
    if (t === "") return null;
    for (; e.nodeType !== 3; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !l || (e = Gt(e.nextSibling), e === null)) return null;
    return e;
  }
  function Xm(e, t) {
    for (; e.nodeType !== 8; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = Gt(e.nextSibling), e === null)) return null;
    return e;
  }
  function Sf(e) {
    return e.data === "$?" || e.data === "$~";
  }
  function _f(e) {
    return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
  }
  function ty(e, t) {
    var l = e.ownerDocument;
    if (e.data === "$~") e._reactRetry = t;
    else if (e.data !== "$?" || l.readyState !== "loading")
      t();
    else {
      var a = function() {
        t(), l.removeEventListener("DOMContentLoaded", a);
      };
      l.addEventListener("DOMContentLoaded", a), e._reactRetry = a;
    }
  }
  function Gt(e) {
    for (; e != null; e = e.nextSibling) {
      var t = e.nodeType;
      if (t === 1 || t === 3) break;
      if (t === 8) {
        if (t = e.data, t === "$" || t === "$!" || t === "$?" || t === "$~" || t === "&" || t === "F!" || t === "F")
          break;
        if (t === "/$" || t === "/&") return null;
      }
    }
    return e;
  }
  var Tf = null;
  function Zm(e) {
    e = e.nextSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var l = e.data;
        if (l === "/$" || l === "/&") {
          if (t === 0)
            return Gt(e.nextSibling);
          t--;
        } else
          l !== "$" && l !== "$!" && l !== "$?" && l !== "$~" && l !== "&" || t++;
      }
      e = e.nextSibling;
    }
    return null;
  }
  function Lm(e) {
    e = e.previousSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var l = e.data;
        if (l === "$" || l === "$!" || l === "$?" || l === "$~" || l === "&") {
          if (t === 0) return e;
          t--;
        } else l !== "/$" && l !== "/&" || t++;
      }
      e = e.previousSibling;
    }
    return null;
  }
  function ly(e, t) {
    function l() {
      a = !0;
    }
    if (e.ownerDocument.activeElement === e) return !0;
    var a = !1;
    try {
      e.ownerDocument.addEventListener("focus", l, !0), (e.focus || HTMLElement.prototype.focus).call(e, t);
    } finally {
      e.ownerDocument.removeEventListener("focus", l, !0);
    }
    return a;
  }
  function ay(e) {
    Cm(function() {
      Cm(function(t) {
        return e(t);
      });
    });
  }
  function Vm(e, t, l) {
    switch (t = nu(l), e) {
      case "html":
        if (e = t.documentElement, !e) throw Error(o(452));
        return e;
      case "head":
        if (e = t.head, !e) throw Error(o(453));
        return e;
      case "body":
        if (e = t.body, !e) throw Error(o(454));
        return e;
      default:
        throw Error(o(451));
    }
  }
  function wm(e, t, l) {
    for (var a in l) {
      var n = l[a];
      l.hasOwnProperty(a) && n != null && Oe(e, t, a, null, M0, n);
    }
    l.dangerouslySetInnerHTML != null && (e.textContent = ""), e.onclick === $t && (e.onclick = null), Au(e);
  }
  function Ef(e) {
    for (var t = e.attributes; t.length; )
      e.removeAttributeNode(t[0]);
    Au(e);
  }
  var Qt = /* @__PURE__ */ new Map(), Km = /* @__PURE__ */ new Set();
  function uu(e) {
    if (typeof e.getRootNode == "function") {
      var t = e.getRootNode();
      if (t.nodeType === 9 || t.nodeType === 11) return t;
    }
    return e.nodeType === 9 ? e : e.ownerDocument;
  }
  var Tl = te.d;
  te.d = {
    f: ny,
    r: uy,
    D: iy,
    C: cy,
    L: sy,
    m: fy,
    X: ry,
    S: oy,
    M: dy
  };
  function ny() {
    var e = Tl.f(), t = Oi();
    return e || t;
  }
  function uy(e) {
    var t = Na(e);
    t !== null && t.tag === 5 && t.type === "form" ? kr(t) : Tl.r(e);
  }
  var sn = typeof document > "u" ? null : document;
  function Jm(e, t, l) {
    var a = sn;
    if (a && typeof t == "string" && t) {
      var n = Mt(t);
      n = 'link[rel="' + e + '"][href="' + n + '"]', typeof l == "string" && (n += '[crossorigin="' + l + '"]'), Km.has(n) || (Km.add(n), e = { rel: e, crossOrigin: l, href: t }, a.querySelector(n) === null && (t = a.createElement("link"), nt(t, "link", e), ke(t), a.head.appendChild(t)));
    }
  }
  function iy(e) {
    Tl.D(e), Jm("dns-prefetch", e, null);
  }
  function cy(e, t) {
    Tl.C(e, t), Jm("preconnect", e, t);
  }
  function sy(e, t, l) {
    Tl.L(e, t, l);
    var a = sn;
    if (a && e && t) {
      var n = 'link[rel="preload"][as="' + Mt(t) + '"]';
      t === "image" && l && l.imageSrcSet ? (n += '[imagesrcset="' + Mt(
        l.imageSrcSet
      ) + '"]', typeof l.imageSizes == "string" && (n += '[imagesizes="' + Mt(
        l.imageSizes
      ) + '"]')) : n += '[href="' + Mt(e) + '"]';
      var u = n;
      switch (t) {
        case "style":
          u = fn(e);
          break;
        case "script":
          u = on(e);
      }
      if (!(Qt.has(u) || (e = K(
        {
          rel: "preload",
          href: t === "image" && l && l.imageSrcSet ? void 0 : e,
          as: t
        },
        l
      ), Qt.set(u, e), a.querySelector(n) !== null || t === "style" && a.querySelector(iu(u)) || t === "script" && a.querySelector(cu(u))))) {
        var i = a.createElement("link");
        nt(i, "link", e), t === "style" && (i[ju] = !0, i.onload = i.onerror = function() {
          uo(i);
        }), ke(i), a.head.appendChild(i);
      }
    }
  }
  function fy(e, t) {
    Tl.m(e, t);
    var l = sn;
    if (l && e) {
      var a = t && typeof t.as == "string" ? t.as : "script", n = 'link[rel="modulepreload"][as="' + Mt(a) + '"][href="' + Mt(e) + '"]', u = n;
      switch (a) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          u = on(e);
      }
      if (!Qt.has(u) && (e = K({ rel: "modulepreload", href: e }, t), Qt.set(u, e), l.querySelector(n) === null)) {
        switch (a) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (l.querySelector(cu(u)))
              return;
        }
        a = l.createElement("link"), nt(a, "link", e), ke(a), l.head.appendChild(a);
      }
    }
  }
  function oy(e, t, l) {
    Tl.S(e, t, l);
    var a = sn;
    if (a && e) {
      var n = ja(a).hoistableStyles, u = fn(e);
      t = t || "default";
      var i = n.get(u);
      if (!i) {
        var f = { loading: 0, preload: null };
        if (i = a.querySelector(
          iu(u)
        ))
          f.loading = 5;
        else {
          e = K(
            { rel: "stylesheet", href: e, "data-precedence": t },
            l
          ), (l = Qt.get(u)) && xf(e, l);
          var r = i = a.createElement("link");
          ke(r), nt(r, "link", e), r._p = new Promise(function(p, T) {
            r.onload = p, r.onerror = T;
          }), r.addEventListener("load", function() {
            f.loading |= 1;
          }), r.addEventListener("error", function() {
            f.loading |= 2;
          }), f.loading |= 4, Bi(i, t, a);
        }
        i = {
          type: "stylesheet",
          instance: i,
          count: 1,
          state: f
        }, n.set(u, i);
      }
    }
  }
  function ry(e, t) {
    Tl.X(e, t);
    var l = sn;
    if (l && e) {
      var a = ja(l).hoistableScripts, n = on(e), u = a.get(n);
      u || (u = l.querySelector(cu(n)), u || (e = K({ src: e, async: !0 }, t), (t = Qt.get(n)) && Nf(e, t), u = l.createElement("script"), ke(u), nt(u, "link", e), l.head.appendChild(u)), u = {
        type: "script",
        instance: u,
        count: 1,
        state: null
      }, a.set(n, u));
    }
  }
  function dy(e, t) {
    Tl.M(e, t);
    var l = sn;
    if (l && e) {
      var a = ja(l).hoistableScripts, n = on(e), u = a.get(n);
      u || (u = l.querySelector(cu(n)), u || (e = K({ src: e, async: !0, type: "module" }, t), (t = Qt.get(n)) && Nf(e, t), u = l.createElement("script"), ke(u), nt(u, "link", e), l.head.appendChild(u)), u = {
        type: "script",
        instance: u,
        count: 1,
        state: null
      }, a.set(n, u));
    }
  }
  function km(e, t, l, a) {
    var n = (n = xl.current) ? uu(n) : null;
    if (!n) throw Error(o(446));
    switch (e) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof l.precedence == "string" && typeof l.href == "string" ? (l = fn(l.href), t = ja(
          n
        ).hoistableStyles, a = t.get(l), a || (a = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, t.set(l, a)), a) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (l.rel === "stylesheet" && typeof l.href == "string" && typeof l.precedence == "string") {
          e = fn(l.href);
          var u = ja(
            n
          ).hoistableStyles, i = u.get(e);
          if (i || (n = n.ownerDocument || n, i = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, u.set(e, i), (u = n.querySelector(
            iu(e)
          )) ? u._p || (i.instance = u, i.state.loading = 5) : (u = Qt.get(e), u || (u = {
            rel: "preload",
            as: "style",
            href: l.href,
            crossOrigin: l.crossOrigin,
            integrity: l.integrity,
            media: l.media,
            hrefLang: l.hrefLang,
            referrerPolicy: l.referrerPolicy
          }, Qt.set(e, u)), my(
            n,
            e,
            u,
            i.state
          ))), t && a === null)
            throw Error(o(528, ""));
          return i;
        }
        if (t && a !== null)
          throw Error(o(529, ""));
        return null;
      case "script":
        return t = l.async, l = l.src, typeof l == "string" && t && typeof t != "function" && typeof t != "symbol" ? (l = on(l), t = ja(
          n
        ).hoistableScripts, a = t.get(l), a || (a = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, t.set(l, a)), a) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(o(444, e));
    }
  }
  function fn(e) {
    return 'href="' + Mt(e) + '"';
  }
  function iu(e) {
    return 'link[rel="stylesheet"][' + e + "]";
  }
  function Fm(e) {
    return K({}, e, {
      "data-precedence": e.precedence,
      precedence: null
    });
  }
  function my(e, t, l, a) {
    if (t = e.querySelector(
      'link[rel="preload"][as="style"][' + t + "]"
    )) {
      if (t[ju] !== !0) {
        a.loading = 1;
        return;
      }
    } else
      t = e.createElement("link"), t[ju] = !0, t.onload = t.onerror = uo.bind(null, t), nt(t, "link", l), ke(t), e.head.appendChild(t);
    a.preload = t, t.addEventListener("load", function() {
      return a.loading |= 1;
    }), t.addEventListener("error", function() {
      return a.loading |= 2;
    });
  }
  function on(e) {
    return '[src="' + Mt(e) + '"]';
  }
  function cu(e) {
    return "script[async]" + e;
  }
  function $m(e, t, l) {
    if (t.count++, t.instance === null)
      switch (t.type) {
        case "style":
          var a = e.querySelector(
            'style[data-href~="' + Mt(l.href) + '"]'
          );
          if (a)
            return t.instance = a, ke(a), a;
          var n = K({}, l, {
            "data-href": l.href,
            "data-precedence": l.precedence,
            href: null,
            precedence: null
          });
          return a = (e.ownerDocument || e).createElement(
            "style"
          ), ke(a), nt(a, "style", n), Bi(a, l.precedence, e), t.instance = a;
        case "stylesheet":
          n = fn(l.href);
          var u = e.querySelector(
            iu(n)
          );
          if (u)
            return t.state.loading |= 4, t.instance = u, ke(u), u;
          a = Fm(l), (n = Qt.get(n)) && xf(a, n), u = (e.ownerDocument || e).createElement("link"), ke(u);
          var i = u;
          return i._p = new Promise(function(f, r) {
            i.onload = f, i.onerror = r;
          }), nt(u, "link", a), t.state.loading |= 4, Bi(u, l.precedence, e), t.instance = u;
        case "script":
          return u = on(l.src), (n = e.querySelector(
            cu(u)
          )) ? (t.instance = n, ke(n), n) : (a = l, (n = Qt.get(u)) && (a = K({}, l), Nf(a, n)), e = e.ownerDocument || e, n = e.createElement("script"), ke(n), nt(n, "link", a), e.head.appendChild(n), t.instance = n);
        case "void":
          return null;
        default:
          throw Error(o(443, t.type));
      }
    else
      t.type === "stylesheet" && (t.state.loading & 4) === 0 && (a = t.instance, t.state.loading |= 4, Bi(a, l.precedence, e));
    return t.instance;
  }
  function Bi(e, t, l) {
    for (var a = l.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), n = a.length ? a[a.length - 1] : null, u = n, i = 0; i < a.length; i++) {
      var f = a[i];
      if (f.dataset.precedence === t) u = f;
      else if (u !== n) break;
    }
    u ? u.parentNode.insertBefore(e, u.nextSibling) : (t = l.nodeType === 9 ? l.head : l, t.insertBefore(e, t.firstChild));
  }
  function xf(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.title == null && (e.title = t.title);
  }
  function Nf(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.integrity == null && (e.integrity = t.integrity);
  }
  var Yi = null;
  function Wm(e, t, l) {
    if (Yi === null) {
      var a = /* @__PURE__ */ new Map(), n = Yi = /* @__PURE__ */ new Map();
      n.set(l, a);
    } else
      n = Yi, a = n.get(l), a || (a = /* @__PURE__ */ new Map(), n.set(l, a));
    if (a.has(e)) return a;
    for (a.set(e, null), l = l.getElementsByTagName(e), n = 0; n < l.length; n++) {
      var u = l[n];
      if (!(u[Tn] || u[Pe] || e === "link" && u.getAttribute("rel") === "stylesheet") && u.namespaceURI !== "http://www.w3.org/2000/svg") {
        var i = u.getAttribute(t) || "";
        i = e + i;
        var f = a.get(i);
        f ? f.push(u) : a.set(i, [u]);
      }
    }
    return a;
  }
  function jf(e, t, l) {
    e = e.ownerDocument || e, e.head.insertBefore(
      l,
      t === "title" ? e.querySelector("head > title") : null
    );
  }
  function hy(e, t, l) {
    if (l === 1 || t.itemProp != null) return !1;
    switch (e) {
      case "meta":
      case "title":
        return !0;
      case "style":
        if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "")
          break;
        return !0;
      case "link":
        if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError)
          break;
        return t.rel === "stylesheet" ? (e = t.disabled, typeof t.precedence == "string" && e == null) : !0;
      case "script":
        if (t.async && typeof t.async != "function" && typeof t.async != "symbol" && !t.onLoad && !t.onError && t.src && typeof t.src == "string")
          return !0;
    }
    return !1;
  }
  function Im(e, t) {
    return e === "img" && t.src != null && t.src !== "" && t.onLoad == null && t.loading !== "lazy";
  }
  function Pm(e) {
    return !(e.type === "stylesheet" && (e.state.loading & 3) === 0);
  }
  function eh(e) {
    return (e.width || 100) * (e.height || 100) * (typeof devicePixelRatio == "number" ? devicePixelRatio : 1) * 0.25;
  }
  function th(e, t) {
    typeof t.decode == "function" && (e.imgCount++, t.complete || (e.imgBytes += eh(t), e.suspenseyImages.push(t)), e = gy.bind(e), t.decode().then(e, e));
  }
  function vy(e, t, l, a) {
    if (l.type === "stylesheet" && (typeof a.media != "string" || matchMedia(a.media).matches !== !1) && (l.state.loading & 4) === 0) {
      if (l.instance === null) {
        var n = fn(a.href), u = t.querySelector(
          iu(n)
        );
        if (u) {
          t = u._p, t !== null && typeof t == "object" && typeof t.then == "function" && (e.count++, e = su.bind(e), t.then(e, e)), l.state.loading |= 4, l.instance = u, ke(u);
          return;
        }
        u = t.ownerDocument || t, a = Fm(a), (n = Qt.get(n)) && xf(a, n), u = u.createElement("link"), ke(u);
        var i = u;
        i._p = new Promise(function(f, r) {
          i.onload = f, i.onerror = r;
        }), nt(u, "link", a), l.instance = u;
      }
      e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(l, t), (t = l.state.preload) && (l.state.loading & 3) === 0 && (e.count++, l = su.bind(e), t.addEventListener("load", l), t.addEventListener("error", l));
    }
  }
  var Gi = 0;
  function yy(e, t) {
    return e.stylesheets && e.count === 0 && Xi(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(l) {
      var a = setTimeout(function() {
        if (e.stylesheets && Xi(e, e.stylesheets), e.unsuspend) {
          var u = e.unsuspend;
          e.unsuspend = null, u();
        }
      }, 6e4 + t);
      0 < e.imgBytes && Gi === 0 && (Gi = 62500 * U0());
      var n = setTimeout(
        function() {
          if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && Xi(e, e.stylesheets), e.unsuspend)) {
            var u = e.unsuspend;
            e.unsuspend = null, u();
          }
        },
        (e.imgBytes > Gi ? 50 : 800) + t
      );
      return e.unsuspend = l, function() {
        e.unsuspend = null, clearTimeout(a), clearTimeout(n);
      };
    } : null;
  }
  function lh(e) {
    if (e.count === 0 && (e.imgCount === 0 || !e.waitingForImages)) {
      if (e.stylesheets) Xi(e, e.stylesheets);
      else if (e.unsuspend) {
        var t = e.unsuspend;
        e.unsuspend = null, t();
      }
    }
  }
  function su() {
    this.count--, lh(this);
  }
  function gy() {
    this.imgCount--, lh(this);
  }
  var Qi = null;
  function Xi(e, t) {
    e.stylesheets = null, e.unsuspend !== null && (e.count++, Qi = /* @__PURE__ */ new Map(), t.forEach(py, e), Qi = null, su.call(e));
  }
  function py(e, t) {
    if (!(t.state.loading & 4)) {
      var l = Qi.get(e);
      if (l) var a = l.get(null);
      else {
        l = /* @__PURE__ */ new Map(), Qi.set(e, l);
        for (var n = e.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), u = 0; u < n.length; u++) {
          var i = n[u];
          (i.nodeName === "LINK" || i.getAttribute("media") !== "not all") && (l.set(i.dataset.precedence, i), a = i);
        }
        a && l.set(null, a);
      }
      n = t.instance, i = n.getAttribute("data-precedence"), u = l.get(i) || a, u === a && l.set(null, n), l.set(i, n), this.count++, a = su.bind(this), n.addEventListener("load", a), n.addEventListener("error", a), u ? u.parentNode.insertBefore(n, u.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(n, e.firstChild)), t.state.loading |= 4;
    }
  }
  var rn = {
    $$typeof: ee,
    Provider: null,
    Consumer: null,
    _currentValue: dt,
    _currentValue2: dt,
    _threadCount: 0
  };
  function by(e, t, l, a, n, u, i, f, r) {
    this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = uc(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = uc(0), this.hiddenUpdates = uc(null), this.identifierPrefix = a, this.onUncaughtError = n, this.onCaughtError = u, this.onRecoverableError = i, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = r, this.transitionTypes = null, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function ah(e, t, l, a, n, u, i, f, r, p, T, O) {
    return e = new by(
      e,
      t,
      l,
      i,
      r,
      p,
      T,
      O,
      f
    ), t = 1, u === !0 && (t |= 24), u = ht(3, null, null, t), e.current = u, u.stateNode = e, t = Qc(), t.refCount++, e.pooledCache = t, t.refCount++, u.memoizedState = {
      element: a,
      isDehydrated: l,
      cache: t
    }, Vc(u), e;
  }
  function nh(e) {
    return e ? (e = Ha, e) : Ha;
  }
  function uh(e, t, l, a, n, u) {
    n = nh(n), a.context === null ? a.context = n : a.pendingContext = n, a = ql(t), a.payload = { element: l }, u = u === void 0 ? null : u, u !== null && (a.callback = u), l = Hl(e, a, t), l !== null && (pt(l, e, t), Gn(l, e, t));
  }
  function ih(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var l = e.retryLane;
      e.retryLane = l !== 0 && l < t ? l : t;
    }
  }
  function Af(e, t) {
    ih(e, t), (e = e.alternate) && ih(e, t);
  }
  function ch(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = na(e, 67108864);
      t !== null && pt(t, e, 67108864), Af(e, 67108864);
    }
  }
  function sh(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = Ct();
      t = ic(t);
      var l = na(e, t);
      l !== null && pt(l, e, t), Af(e, t);
    }
  }
  var dn = !0;
  function Sy(e, t, l, a) {
    var n = L.T;
    L.T = null;
    var u = te.p;
    try {
      te.p = 2, zf(e, t, l, a);
    } finally {
      te.p = u, L.T = n;
    }
  }
  function _y(e, t, l, a) {
    var n = L.T;
    L.T = null;
    var u = te.p;
    try {
      te.p = 8, zf(e, t, l, a);
    } finally {
      te.p = u, L.T = n;
    }
  }
  function zf(e, t, l, a) {
    if (dn) {
      var n = Cf(a);
      if (n === null)
        ff(
          e,
          t,
          a,
          Zi,
          l
        ), oh(e, a);
      else if (Ey(
        n,
        e,
        t,
        l,
        a
      ))
        a.stopPropagation();
      else if (oh(e, a), t & 4 && -1 < Ty.indexOf(e)) {
        for (; n !== null; ) {
          var u = Na(n);
          if (u !== null)
            switch (u.tag) {
              case 3:
                if (u = u.stateNode, u.current.memoizedState.isDehydrated) {
                  var i = Pl(u.pendingLanes);
                  if (i !== 0) {
                    var f = u;
                    for (f.pendingLanes |= 2, f.entangledLanes |= 2; i; ) {
                      var r = 1 << 31 - Tt(i);
                      f.entanglements[1] |= r, i &= ~r;
                    }
                    il(u), (Ne & 6) === 0 && (Ai = St() + 500, tu(0));
                  }
                }
                break;
              case 31:
              case 13:
                f = na(u, 2), f !== null && pt(f, u, 2), Oi(), Af(u, 2);
            }
          if (u = Cf(a), u === null && ff(
            e,
            t,
            a,
            Zi,
            l
          ), u === n) break;
          n = u;
        }
        n !== null && a.stopPropagation();
      } else
        ff(
          e,
          t,
          a,
          null,
          l
        );
    }
  }
  function Cf(e) {
    return e = mc(e), Of(e);
  }
  var Zi = null;
  function Of(e) {
    if (Zi = null, e = ea(e), e !== null) {
      var t = A(e);
      if (t === null) e = null;
      else {
        var l = t.tag;
        if (l === 13) {
          if (e = E(t), e !== null) return e;
          e = null;
        } else if (l === 31) {
          if (e = U(t), e !== null) return e;
          e = null;
        } else if (l === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated)
            return t.tag === 3 ? t.stateNode.containerInfo : null;
          e = null;
        } else t !== e && (e = null);
      }
    }
    return Zi = e, null;
  }
  function fh(e) {
    switch (e) {
      case "beforetoggle":
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "seeked":
      case "submit":
      case "toggle":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "fullscreenerror":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 2;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "resize":
      case "scroll":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 8;
      case "message":
        switch (Uh()) {
          case Jf:
            return 2;
          case kf:
            return 8;
          case _u:
          case qh:
            return 32;
          case Ff:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var Rf = !1, kl = null, Fl = null, $l = null, fu = /* @__PURE__ */ new Map(), ou = /* @__PURE__ */ new Map(), Wl = [], Ty = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function oh(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        kl = null;
        break;
      case "dragenter":
      case "dragleave":
        Fl = null;
        break;
      case "mouseover":
      case "mouseout":
        $l = null;
        break;
      case "pointerover":
      case "pointerout":
        fu.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        ou.delete(t.pointerId);
    }
  }
  function ru(e, t, l, a, n, u) {
    return e === null || e.nativeEvent !== u ? (e = {
      blockedOn: t,
      domEventName: l,
      eventSystemFlags: a,
      nativeEvent: u,
      targetContainers: [n]
    }, t !== null && (t = Na(t), t !== null && ch(t)), e) : (e.eventSystemFlags |= a, t = e.targetContainers, n !== null && t.indexOf(n) === -1 && t.push(n), e);
  }
  function Ey(e, t, l, a, n) {
    switch (t) {
      case "focusin":
        return kl = ru(
          kl,
          e,
          t,
          l,
          a,
          n
        ), !0;
      case "dragenter":
        return Fl = ru(
          Fl,
          e,
          t,
          l,
          a,
          n
        ), !0;
      case "mouseover":
        return $l = ru(
          $l,
          e,
          t,
          l,
          a,
          n
        ), !0;
      case "pointerover":
        var u = n.pointerId;
        return fu.set(
          u,
          ru(
            fu.get(u) || null,
            e,
            t,
            l,
            a,
            n
          )
        ), !0;
      case "gotpointercapture":
        return u = n.pointerId, ou.set(
          u,
          ru(
            ou.get(u) || null,
            e,
            t,
            l,
            a,
            n
          )
        ), !0;
    }
    return !1;
  }
  function rh(e) {
    var t = ea(e.target);
    if (t !== null) {
      var l = A(t);
      if (l !== null) {
        if (t = l.tag, t === 13) {
          if (t = E(l), t !== null) {
            e.blockedOn = t, lo(e.priority, function() {
              sh(l);
            });
            return;
          }
        } else if (t === 31) {
          if (t = U(l), t !== null) {
            e.blockedOn = t, lo(e.priority, function() {
              sh(l);
            });
            return;
          }
        } else if (t === 3 && l.stateNode.current.memoizedState.isDehydrated) {
          e.blockedOn = l.tag === 3 ? l.stateNode.containerInfo : null;
          return;
        }
      }
    }
    e.blockedOn = null;
  }
  function Li(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var l = Cf(e.nativeEvent);
      if (l === null) {
        l = e.nativeEvent;
        var a = new l.constructor(
          l.type,
          l
        );
        dc = a, l.target.dispatchEvent(a), dc = null;
      } else
        return t = Na(l), t !== null && ch(t), e.blockedOn = l, !1;
      t.shift();
    }
    return !0;
  }
  function dh(e, t, l) {
    Li(e) && l.delete(t);
  }
  function xy() {
    Rf = !1, kl !== null && Li(kl) && (kl = null), Fl !== null && Li(Fl) && (Fl = null), $l !== null && Li($l) && ($l = null), fu.forEach(dh), ou.forEach(dh);
  }
  function Vi(e, t) {
    e.blockedOn === t && (e.blockedOn = null, Rf || (Rf = !0, s.unstable_scheduleCallback(
      s.unstable_NormalPriority,
      xy
    )));
  }
  var wi = null;
  function mh(e) {
    wi !== e && (wi = e, s.unstable_scheduleCallback(
      s.unstable_NormalPriority,
      function() {
        wi === e && (wi = null);
        for (var t = 0; t < e.length; t += 3) {
          var l = e[t], a = e[t + 1], n = e[t + 2];
          if (typeof a != "function") {
            if (Of(a || l) === null)
              continue;
            break;
          }
          var u = Na(l);
          u !== null && (e.splice(t, 3), t -= 3, rs(
            u,
            {
              pending: !0,
              data: n,
              method: l.method,
              action: a
            },
            a,
            n
          ));
        }
      }
    ));
  }
  function mn(e) {
    function t(r) {
      return Vi(r, e);
    }
    kl !== null && Vi(kl, e), Fl !== null && Vi(Fl, e), $l !== null && Vi($l, e), fu.forEach(t), ou.forEach(t);
    for (var l = 0; l < Wl.length; l++) {
      var a = Wl[l];
      a.blockedOn === e && (a.blockedOn = null);
    }
    for (; 0 < Wl.length && (l = Wl[0], l.blockedOn === null); )
      rh(l), l.blockedOn === null && Wl.shift();
    if (l = (e.ownerDocument || e).$$reactFormReplay, l != null)
      for (a = 0; a < l.length; a += 3) {
        var n = l[a], u = l[a + 1], i = n[mt] || null;
        if (typeof u == "function")
          i || mh(l);
        else if (i) {
          var f = null;
          if (u && u.hasAttribute("formAction")) {
            if (n = u, i = u[mt] || null)
              f = i.formAction;
            else if (Of(n) !== null) continue;
          } else f = i.action;
          typeof f == "function" ? l[a + 1] = f : (l.splice(a, 3), a -= 3), mh(l);
        }
      }
  }
  function hh() {
    function e(u) {
      u.canIntercept && u.info === "react-transition" && u.intercept({
        handler: function() {
          return new Promise(function(i) {
            return n = i;
          });
        },
        focusReset: "manual",
        scroll: "manual"
      });
    }
    function t() {
      n !== null && (n(), n = null), a || setTimeout(l, 20);
    }
    function l() {
      if (!a && !navigation.transition) {
        var u = navigation.currentEntry;
        u && u.url != null && navigation.navigate(u.url, {
          state: u.getState(),
          info: "react-transition",
          history: "replace"
        });
      }
    }
    if (typeof navigation == "object") {
      var a = !1, n = null;
      return navigation.addEventListener("navigate", e), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(l, 100), function() {
        a = !0, navigation.removeEventListener("navigate", e), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), n !== null && (n(), n = null);
      };
    }
  }
  function Mf(e) {
    this._internalRoot = e;
  }
  Ki.prototype.render = Mf.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(o(409));
    var l = t.current, a = Ct();
    uh(l, a, e, t, null, null);
  }, Ki.prototype.unmount = Mf.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      uh(e.current, 2, null, e, null, null), Oi(), t[xa] = null;
    }
  };
  function Ki(e) {
    this._internalRoot = e;
  }
  Ki.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = to();
      e = { blockedOn: null, target: e, priority: t };
      for (var l = 0; l < Wl.length && t !== 0 && t < Wl[l].priority; l++) ;
      Wl.splice(l, 0, e), l === 0 && rh(e);
    }
  };
  var vh = d.version;
  if (vh !== "19.3.1")
    throw Error(
      o(
        527,
        vh,
        "19.3.1"
      )
    );
  te.findDOMNode = function(e) {
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(o(188)) : (e = Object.keys(e).join(","), Error(o(268, e)));
    return e = N(t), e = e !== null ? x(e) : null, e = e === null ? null : e.stateNode, e;
  };
  var Ny = {
    bundleType: 0,
    version: "19.3.1",
    rendererPackageName: "react-dom",
    currentDispatcherRef: L,
    reconcilerVersion: "19.3.1"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Ji = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Ji.isDisabled && Ji.supportsFiber)
      try {
        bn = Ji.inject(
          Ny
        ), _t = Ji;
      } catch {
      }
  }
  return mu.createRoot = function(e, t) {
    if (!z(e)) throw Error(o(299));
    var l = !1, a = "", n = nd, u = ud, i = id;
    return t != null && (t.unstable_strictMode === !0 && (l = !0), t.identifierPrefix !== void 0 && (a = t.identifierPrefix), t.onUncaughtError !== void 0 && (n = t.onUncaughtError), t.onCaughtError !== void 0 && (u = t.onCaughtError), t.onRecoverableError !== void 0 && (i = t.onRecoverableError)), t = ah(
      e,
      1,
      !1,
      null,
      null,
      l,
      a,
      null,
      n,
      u,
      i,
      hh
    ), e[xa] = t.current, sf(e), new Mf(t);
  }, mu.hydrateRoot = function(e, t, l) {
    if (!z(e)) throw Error(o(299));
    var a = !1, n = "", u = nd, i = ud, f = id, r = null;
    return l != null && (l.unstable_strictMode === !0 && (a = !0), l.identifierPrefix !== void 0 && (n = l.identifierPrefix), l.onUncaughtError !== void 0 && (u = l.onUncaughtError), l.onCaughtError !== void 0 && (i = l.onCaughtError), l.onRecoverableError !== void 0 && (f = l.onRecoverableError), l.formState !== void 0 && (r = l.formState)), t = ah(
      e,
      1,
      !0,
      t,
      l ?? null,
      a,
      n,
      r,
      u,
      i,
      f,
      hh
    ), t.context = nh(null), l = t.current, a = Ct(), a = ic(a), n = ql(a), n.callback = null, Hl(l, n, a), l = a, t.current.lanes = l, _n(t, l), il(t), e[xa] = t.current, sf(e), new Ki(t);
  }, mu.version = "19.3.1", mu;
}
var Nh;
function qy() {
  if (Nh) return Uf.exports;
  Nh = 1;
  function s() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(s);
      } catch (d) {
        console.error(d);
      }
  }
  return s(), Uf.exports = Uy(), Uf.exports;
}
var Hy = qy(), k = Lf();
function vu(s, d = Date.now()) {
  const b = Date.parse(s);
  return Number.isFinite(b) ? Math.max(0, Math.floor((d - b) / 1e3)) : null;
}
function yn(s) {
  return s === null ? "Time unknown" : s < 60 ? `${s}s` : s < 3600 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${Math.floor(s / 3600)}h ${Math.floor(s % 3600 / 60)}m`;
}
function jh(s) {
  return Number(s.priority?.match(/\d+/)?.[0] ?? 99);
}
function Qf(s) {
  return [...s].sort(
    (d, b) => (d.status === "open" ? 0 : 1) - (b.status === "open" ? 0 : 1) || jh(d) - jh(b) || Number(["missing", "stale"].includes(d.public_feed_status)) - Number(["missing", "stale"].includes(b.public_feed_status)) || String(d.received_at ?? "").localeCompare(String(b.received_at ?? "")) || d.id.localeCompare(b.id)
  );
}
function yu(s, d, b = Date.now(), o = null) {
  if (s && s.decision !== "pending") return s.decision;
  if (o?.assessment_blockers?.length) return "incomplete";
  if (!s) return "unassessed";
  if (o && (s.incident_revision ?? 0) !== (o.incident_revision ?? 0) || s.version !== d) return "changed";
  const z = s.evidence_epoch ?? s.created_epoch;
  return !Number.isFinite(z) || b / 1e3 - z > 120 ? "expired" : s.approvable ? "ready" : "blocked";
}
function Xf(s, d, b) {
  return s.incident_id === d && s.simulation_epoch === b;
}
function Rt(s) {
  return ["completed", "cancelled"].includes(s.status) ? "completed" : s.status !== "open" ? "reserved" : s.public_source && !s.requirements_source && !s.prepared_intake ? ["missing", "stale"].includes(s.public_feed_status) ? "history" : "reports" : s.agent_state === "awaiting_approval" ? "approval" : s.assessment_blockers?.length || s.agent_state === "needs_input" || s.agent_state === "watching" ? "input" : "working";
}
function El(s) {
  return {
    assigned: "Assigned",
    responding: "Responding to pickup",
    on_scene: "On scene",
    transporting: "Transporting",
    handover: "Hospital handover",
    completed: "Completed",
    cancelled: "Exercise ended"
  }[s] || "Assigned";
}
function By(s) {
  const d = [
    "assigned",
    "responding",
    "on_scene",
    "transporting",
    "handover",
    "completed"
  ], b = d.indexOf(s);
  return b >= 0 && b < d.length - 1 ? d[b + 1] : null;
}
function Yy(s, d) {
  const b = s.find((z) => z.id === d);
  if (b && !["reports", "history"].includes(Rt(b)))
    return b.id;
  const o = Qf(
    s.filter((z) => !["reports", "history"].includes(Rt(z)))
  );
  return o.find((z) => z.status === "open")?.id || o[0]?.id || b?.id || Qf(s)[0]?.id || null;
}
function Ch(s) {
  const d = s.assessment_blockers || [];
  return d.some(
    (b) => b.includes("changed public call") || b.includes("feed") || b.includes("no longer")
  ) ? {
    title: "Can you verify this call?",
    body: "The published call changed or its source is no longer current. Review the details before ARC prepares another plan.",
    action: "Review call details",
    target: "intake"
  } : d.some((b) => b.includes("pickup location")) ? {
    title: "Where should the unit go?",
    body: "This report does not include a confirmed pickup point. Choose a location, then confirm the response requirements.",
    action: "Confirm pickup and requirements",
    target: "intake"
  } : d.length ? {
    title: "What response is needed?",
    body: "The public report does not supply the priority, required service and equipment. Confirm those details so ARC can assess this call.",
    action: "Confirm response requirements",
    target: "intake"
  } : {
    title: "This case needs your review",
    body: s.agent_reason || "Review the previous plan or adjust the requirements before asking ARC to continue.",
    action: "Review and retry",
    target: "retry"
  };
}
const it = (s) => !!s && s.lat != null && s.lon != null && Number.isFinite(Number(s.lat)) && Number.isFinite(Number(s.lon));
function $i(s) {
  return new Set(
    Object.entries(s.proposals || {}).filter(
      ([d, b]) => b.decision === "pending" && b.approvable && b.version === s.version && s.agent.states[d]?.state === "awaiting_approval"
    ).map(([, d]) => d.ambulance_id)
  );
}
function Vf(s = "") {
  return s.includes("Planning") ? "Reviewing the request…" : s.includes("Federating") ? "Checking unit and hospital availability…" : s.includes("Calculating") ? "Comparing eligible resources and routes…" : s.includes("Recalling") ? "Checking what changed…" : "Preparing the evidence explanation…";
}
const vn = (s) => String(s).replace(/\bsimulated\s+/gi, "").replace(/\bsynthetic\s+/gi, "").replace(/\bpredefined\s+/gi, "required ");
function Gy(s, d) {
  const b = d.fleet.find((z) => z.id === s?.selected?.ambulance_id), o = d.hospitals.find((z) => z.id === s?.selected?.hospital_id);
  return b && b.status !== "available" ? b.name + " is now " + b.status + "." : o && (!o.accepting || o.slots < 1) ? o.name + " is no longer available to receive this transfer." : d.closures.length ? "A road closure may affect this plan’s routes." : "The operational picture changed after this plan was assessed.";
}
function Zf(s) {
  return {
    priority: s.priority || "",
    service: s.service || "",
    equipment: s.equipment || "",
    lat: s.lat == null ? "" : String(s.lat),
    lon: s.lon == null ? "" : String(s.lon),
    pickup_label: s.pickup_label || s.name,
    notes: s.notes || "",
    revision: s.incident_revision || 0
  };
}
const gn = (s, d = !1) => new Date(s).toLocaleTimeString("en-CA", {
  timeZone: window.ARC_CITY.timezone,
  hour: "2-digit",
  minute: "2-digit",
  ...d ? { second: "2-digit" } : {}
}), hu = (s) => String(s).replace(
  /[&<>"']/g,
  (d) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[d]
);
function Qy(s) {
  const d = s.getSize(), b = d.x <= 760;
  let o = 24, z = 24, A = 110;
  if (b) {
    const E = document.querySelector(
      ".detail-panel:not([hidden]), .inbox-panel:not([hidden])"
    );
    if (E) {
      const U = E.getBoundingClientRect();
      A = d.y - U.top + 18;
    }
    return {
      paddingTopLeft: [24, 100],
      paddingBottomRight: [24, Math.min(A, d.y - 210)]
    };
  }
  for (const [E, U] of [
    [".inbox-panel", "left"],
    [".detail-panel", "right"]
  ]) {
    const D = document.querySelector(E);
    if (D) {
      const N = D.getBoundingClientRect();
      N.width && N.height && (U === "left" ? o = N.right + 24 : z = d.x - N.left + 24);
    }
  }
  return {
    paddingTopLeft: [o, 100],
    paddingBottomRight: [z, A]
  };
}
function Xy(s) {
  const d = k.useRef(null), b = k.useRef(null), o = k.useRef(s), z = k.useRef(null), A = k.useRef(null), E = k.useRef(""), U = k.useRef(-1);
  return o.current = s, k.useEffect(() => {
    const D = window.L, N = window.ARC_CITY, x = D.map(d.current, {
      zoomControl: !1,
      preferCanvas: !1,
      minZoom: 10,
      maxZoom: 19,
      scrollWheelZoom: !0
    }).setView(N.center, N.zoom);
    b.current = x, z.current = D.layerGroup().addTo(x), A.current = D.layerGroup().addTo(x), s.onMapReady(x), D.control.scale({ position: "bottomleft", imperial: !1, maxWidth: 100 }).addTo(x), x.attributionControl.addAttribution(N.basemap_credit), x.createPane("cachedStreets"), x.getPane("cachedStreets").style.zIndex = "150", x.getPane("cachedStreets").style.pointerEvents = "none";
    const m = D.layerGroup().addTo(x);
    let j = !0, M = !1, G = !1, $ = !1, Q;
    const se = new AbortController(), de = () => {
      M || (M = !0, fetch("/" + N.basemap, { signal: se.signal }).then((F) => F.json()).then((F) => {
        j && D.geoJSON(F, {
          pane: "cachedStreets",
          interactive: !1,
          style: (R) => ({
            color: "#fff",
            weight: String(R?.properties.class).includes("Arterial") ? 5 : 2.5,
            opacity: 1
          })
        }).addTo(m);
      }).catch(() => {
      }));
    }, ve = D.tileLayer(
      "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 19,
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }
    ), re = () => {
      G || !j || (G = !0, de(), x.getPane("cachedStreets").style.display = "", Q && x.hasLayer(Q) && x.removeLayer(Q), ve.addTo(x));
    };
    try {
      const F = D.maplibreGL({
        style: "https://tiles.openfreemap.org/styles/positron",
        interactive: !1
      });
      Q = F, F.addTo(x), F.getMaplibreMap().on("load", () => {
        !j || G || ($ = !0, x.getPane("cachedStreets").style.display = "none");
      }), F.getMaplibreMap().on("error", re);
    } catch {
      re();
    }
    const Me = setTimeout(() => {
      $ || re();
    }, 15e3), je = setTimeout(() => {
      $ || de();
    }, 1200);
    x.on("click", (F) => {
      if (!o.current.picking) return;
      const [R, ae, he, ue] = N.bounds;
      if (F.latlng.lat <= R || F.latlng.lat >= he || F.latlng.lng <= ae || F.latlng.lng >= ue) {
        o.current.notify(
          "Choose a pickup within " + N.name + " coverage."
        );
        return;
      }
      o.current.onPick(F.latlng.lat, F.latlng.lng);
    });
    const K = new ResizeObserver(() => x.invalidateSize({ pan: !1 }));
    return K.observe(d.current), () => {
      j = !1, se.abort(), clearTimeout(Me), clearTimeout(je), K.disconnect(), x.remove(), b.current = null;
    };
  }, []), k.useEffect(() => {
    const D = b.current, N = s.state, x = s.rec;
    if (!D || !N || !z.current) return;
    const m = N.incidents.find((R) => R.id === s.selected), j = yu(x, N.version, Date.now(), m), M = JSON.stringify([
      s.selected,
      s.feature,
      s.layers,
      x?.id,
      j,
      N.version,
      N.fleet,
      N.hospitals,
      N.incidents.filter(
        (R) => (R.status === "open" || R.id === s.selected) && R.service
      ).map((R) => [R.id, R.lat, R.lon, R.agent_state]),
      N.assignments.map((R) => [R.id, R.phase, R.hold_reason]),
      Object.entries(N.public_context).map(([R, ae]) => [
        R,
        ae.fetched_at,
        ae.stale
      ])
    ]);
    if (E.current === M) return;
    E.current = M, z.current.clearLayers();
    const G = window.L, $ = z.current, Q = x?.selected, se = $i(N), de = (R, ae) => s.feature?.kind === R && s.feature.id === ae, ve = (R, ae, he) => {
      R.on("click", (Y) => {
        o.current.picking || (G.DomEvent.stopPropagation(Y.originalEvent), o.current.onSelect(ae));
      }), R.addTo($);
      const ue = R.getElement?.();
      return ue && (ue.setAttribute("tabindex", "0"), ue.setAttribute("role", "button"), ue.setAttribute("aria-label", he), ue.addEventListener("keydown", (Y) => {
        const ie = Y;
        (ie.key === "Enter" || ie.key === " ") && (ie.preventDefault(), o.current.onSelect(ae));
      })), R;
    }, re = (R, ae, he) => {
      if (!it(R)) return;
      const ue = de(ae, R.id), Y = G.marker([R.lat, R.lon], {
        title: R.name,
        alt: R.name,
        icon: G.divIcon({
          className: "map-marker",
          html: `<div class="marker ${ae} ${he ? "muted" : ""} ${ue ? "active" : ""}">${ae === "hospital" ? "+" : "↗"}</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        })
      }).bindTooltip(hu(R.name));
      ve(Y, { kind: ae, id: R.id }, R.name);
    };
    N.hospitals.filter(
      (R) => s.layers.resources || R.id === Q?.hospital_id || de("hospital", R.id)
    ).forEach((R) => re(R, "hospital", !R.accepting || R.slots < 1)), N.fleet.filter(
      (R) => s.layers.resources || R.id === Q?.ambulance_id || de("unit", R.id)
    ).forEach(
      (R) => re(R, "unit", R.status !== "available" && !se.has(R.id))
    ), N.incidents.filter(
      (R) => (R.status === "open" || R.id === s.selected) && it(R) && (R.service || R.id === s.selected)
    ).forEach((R) => {
      if (!it(R)) return;
      const ae = R.agent_state === "awaiting_approval" ? "#28785c" : R.agent_state === "working" ? "#315fb6" : "#9c7131";
      ve(
        G.circleMarker([R.lat, R.lon], {
          radius: R.id === s.selected ? 10 : 7,
          color: ae,
          weight: R.id === s.selected ? 3 : 2,
          fillColor: ae,
          fillOpacity: R.id === s.selected ? 0.85 : 0.5
        }).bindTooltip(hu(R.name), {
          permanent: R.id === s.selected,
          direction: "top",
          offset: [0, -10],
          className: "selected-map-label"
        }),
        { kind: "incident", id: R.id },
        R.name
      );
    }), N.closures.forEach((R, ae) => {
      it(R) && ve(
        G.circle([R.lat, R.lon], {
          radius: R.radius_m,
          color: "#ac694b",
          fillOpacity: 0.15,
          weight: 2
        }).bindTooltip(hu(R.name)),
        { kind: "closure", id: R.id || String(ae) },
        R.name
      );
    });
    const Me = N.assignments.find((R) => R.incident_id === s.selected), je = !!Me?.hold_reason || x?.decision === "pending" && j !== "ready";
    if (Q)
      for (const [R, ae] of [
        [Q.pickup_route, "#255bd6"],
        [Q.transport_route, "#16786b"]
      ]) {
        const he = R.coordinates.map(
          ([ue, Y]) => [Y, ue]
        );
        G.polyline(he, {
          color: "#fff",
          weight: 8,
          opacity: 0.95,
          interactive: !1
        }).addTo($), G.polyline(he, {
          color: je ? "#9a783a" : ae,
          weight: 4.5,
          dashArray: je ? "6 6" : void 0,
          lineCap: "round",
          interactive: !1
        }).addTo($);
      }
    const K = (R, ae) => {
      let he = N.public_context[R]?.records || [];
      if (R === "roads" && it(m)) {
        const ue = (Y) => it(Y) ? Math.hypot(
          (Y.lat - m.lat) * 111,
          (Y.lon - m.lon) * 80
        ) : 1 / 0;
        he = [...he].sort((Y, ie) => ue(Y) - ue(ie));
      }
      for (const ue of he.slice(0, R === "roads" ? 100 : 500))
        it(ue) && ve(
          G.circleMarker([ue.lat, ue.lon], {
            radius: de(R, ue.id) ? 8 : R === "stations" ? 6 : 4,
            color: ae,
            weight: de(R, ue.id) ? 3 : 1,
            fillOpacity: 0.6
          }).bindTooltip(hu(ue.name)),
          { kind: R, id: ue.id },
          ue.name
        );
    };
    s.layers.calls && (K("police", "#66718a"), N.city.id === "seattle" && K("fire", "#66718a")), s.layers.roads && K("roads", "#a4762f"), s.layers.stations && N.city.id === "toronto" && K("stations", "#516e85");
    const F = N.public_context.traffic;
    if ((F?.mode === "live" && !F.stale || Q?.transport_route.traffic_aware) && D.attributionControl.addAttribution("© TomTom"), s.layers.traffic && F?.mode === "live" && !F.stale)
      for (const R of F.records) {
        const ae = (R.coordinates || []).filter(
          (he) => !Array.isArray(he)
        ).map((he) => [he.latitude, he.longitude]);
        ve(
          G.polyline(ae, {
            color: R.closed ? "#a33f39" : (R.speed_kph || 0) < (R.free_flow_kph || 0) * 0.5 ? "#c07928" : "#39816e",
            weight: 5,
            opacity: 0.65
          }).bindTooltip(hu(R.speed_kph + " km/h observed · " + R.name)),
          { kind: "traffic", id: R.id },
          R.name
        );
      }
  }, [s.state, s.rec, s.selected, s.feature, s.layers]), k.useEffect(() => {
    A.current?.clearLayers(), s.draftPoint && it(s.draftPoint) && window.L.circleMarker([s.draftPoint.lat, s.draftPoint.lon], {
      radius: 7,
      color: "#3974cc",
      fillOpacity: 0.4
    }).bindTooltip("Unsaved pickup", { permanent: !0 }).addTo(A.current);
  }, [s.draftPoint]), k.useEffect(() => {
    const D = b.current, N = o.current.state;
    if (!D || !N || !s.ready || U.current === s.focus.serial) return;
    U.current = s.focus.serial;
    const x = requestAnimationFrame(() => {
      D.invalidateSize({ pan: !1 });
      const { rec: m, selected: j, focus: M } = o.current, G = N.incidents.find((Q) => Q.id === j);
      let $ = [];
      M.mode === "feature" && it(M.point) ? $ = [[M.point.lat, M.point.lon]] : M.mode === "overview" ? $ = [
        ...N.fleet,
        ...N.hospitals,
        ...N.incidents.filter((Q) => Q.status === "open" && Q.service)
      ].flatMap(
        (Q) => it(Q) ? [[Q.lat, Q.lon]] : []
      ) : (it(G) && $.push([G.lat, G.lon]), m?.selected && $.push(
        ...m.selected.pickup_route.coordinates.map(
          ([Q, se]) => [se, Q]
        ),
        ...m.selected.transport_route.coordinates.map(
          ([Q, se]) => [se, Q]
        )
      )), $.length || ($ = [N.city.center]), D.fitBounds($, {
        ...Qy(D),
        maxZoom: M.mode === "overview" ? 14 : ($.length === 1, 15),
        animate: !1
      });
    });
    return () => cancelAnimationFrame(x);
  }, [s.focus, s.ready]), /* @__PURE__ */ c.jsx(
    "div",
    {
      id: "map",
      ref: d,
      className: s.picking ? "choosing-pickup" : "",
      "aria-label": `${window.ARC_CITY.name} incident, unit and hospital map`
    }
  );
}
const Ah = {
  close: "m6 6 12 12M6 18 18 6",
  chevron: "m6 14 6-6 6 6",
  inbox: "M4 4h16v16H4zM4 14h5l1 3h4l1-3h5",
  layers: "m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5",
  focus: "M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5M8 12h8m-4-4v8",
  overview: "M3 5l6-2 6 2 6-2v16l-6 2-6-2-6 2V5Zm6-2v16m6-14v16",
  settings: "M4 7h16M4 17h16M8 4v6m8 4v6",
  more: "M5 12h.01M12 12h.01M19 12h.01",
  unit: "M3 6h11v12H3zM14 10h4l3 4v4h-7M6 9v6m-3-3h6M5 20h2m10 0h2",
  hospital: "M4 21V3h16v18M9 21v-5h6v5M9 8h6m-3-3v6",
  pin: "M12 21s7-7 7-12A7 7 0 0 0 5 9c0 5 7 12 7 12Zm0-15v6m-3-3h6",
  arrow: "m5 19 14-14M5 5h14v14",
  pause: "M8 5v14M16 5v14",
  play: "m8 4 12 8-12 8V4Z",
  back: "m14 5-7 7 7 7",
  info: "M12 11v6m0-10v.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14"
};
function Ke({ name: s, size: d = 18 }) {
  return /* @__PURE__ */ c.jsx(
    "svg",
    {
      width: d,
      height: d,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.7",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      children: /* @__PURE__ */ c.jsx("path", { d: Ah[s] || Ah.info })
    }
  );
}
function Zy({
  workspace: s,
  layout: d
}) {
  const {
    s: b,
    setCollapsed: o,
    setFocus: z,
    picking: A,
    setPicking: E,
    open: U,
    counts: D,
    free: N,
    busyIncident: x,
    reviewing: m,
    map: j
  } = d;
  return /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
    A && /* @__PURE__ */ c.jsxs("div", { className: "pickup-prompt", role: "status", children: [
      /* @__PURE__ */ c.jsx(Ke, { name: "pin" }),
      /* @__PURE__ */ c.jsx("span", { children: "Click a pickup point on the map" }),
      /* @__PURE__ */ c.jsx(
        "button",
        {
          onClick: () => {
            E(null), o(!1);
          },
          children: "Cancel"
        }
      )
    ] }),
    /* @__PURE__ */ c.jsxs("div", { className: "map-controls", "aria-label": "Map controls", children: [
      /* @__PURE__ */ c.jsx(
        "button",
        {
          "aria-label": "Focus selected case",
          title: "Focus selected",
          onClick: () => z((M) => ({
            serial: M.serial + 1,
            mode: "selected"
          })),
          children: /* @__PURE__ */ c.jsx(Ke, { name: "focus" })
        }
      ),
      /* @__PURE__ */ c.jsx(
        "button",
        {
          "aria-label": "Show overview",
          title: "Overview",
          onClick: () => z((M) => ({
            serial: M.serial + 1,
            mode: "overview"
          })),
          children: /* @__PURE__ */ c.jsx(Ke, { name: "overview" })
        }
      ),
      /* @__PURE__ */ c.jsx("span", {}),
      /* @__PURE__ */ c.jsx(
        "button",
        {
          "aria-label": "Zoom in",
          title: "Zoom in",
          onClick: () => j.current?.zoomIn(),
          children: /* @__PURE__ */ c.jsx(Ke, { name: "plus" })
        }
      ),
      /* @__PURE__ */ c.jsx(
        "button",
        {
          "aria-label": "Zoom out",
          title: "Zoom out",
          onClick: () => j.current?.zoomOut(),
          children: /* @__PURE__ */ c.jsx(Ke, { name: "minus" })
        }
      )
    ] }),
    /* @__PURE__ */ c.jsxs("div", { className: "map-caption", children: [
      s.rec?.selected && /* @__PURE__ */ c.jsx("div", { className: "map-legend", children: m ? /* @__PURE__ */ c.jsxs("span", { children: [
        /* @__PURE__ */ c.jsx("i", { className: "review" }),
        "Previous plan · review required"
      ] }) : /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
        /* @__PURE__ */ c.jsxs("span", { children: [
          /* @__PURE__ */ c.jsx("i", {}),
          "Unit to incident"
        ] }),
        /* @__PURE__ */ c.jsxs("span", { children: [
          /* @__PURE__ */ c.jsx("i", { className: "transport" }),
          "Incident to hospital"
        ] })
      ] }) }),
      /* @__PURE__ */ c.jsx("p", { children: s.rec?.decision === "approved" ? "Approved route · exercise progress" : s.rec?.selected?.transport_route.traffic_aware ? "Traffic at assessment time · ordinary driving" : s.rec?.selected ? "Static driving estimates · no live traffic" : "Operational picture" }),
      /* @__PURE__ */ c.jsx("button", { className: "resource-summary", onClick: () => U("resources"), children: b ? /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
        /* @__PURE__ */ c.jsx("i", { className: N ? "" : "unavailable" }),
        N,
        " ",
        N === 1 ? "unit" : "units",
        " free",
        /* @__PURE__ */ c.jsx("span", { children: "·" }),
        b.hospitals.filter((M) => M.accepting && M.slots > 0).length,
        " ",
        "receiving facilities"
      ] }) : "Loading workspace…" })
    ] }),
    /* @__PURE__ */ c.jsxs("section", { className: "agent-bar", "aria-label": "ARC agent status", children: [
      /* @__PURE__ */ c.jsx("span", { className: `agent-orb ${s.job ? "running" : ""}` }),
      /* @__PURE__ */ c.jsxs("div", { className: "agent-copy", children: [
        /* @__PURE__ */ c.jsx("strong", { children: b ? b.agent.enabled ? s.job ? "ARC is assessing" : "ARC is monitoring" : "ARC is paused" : "Connecting to ARC" }),
        /* @__PURE__ */ c.jsx("p", { children: b?.agent.error || (s.job ? (x?.name || "Current case") + " · " + Vf(s.job.stage) : D && (D.approval || D.input) ? `${D.approval} plans to review · ${D.input} questions for you` : b?.agent.enabled ? "Following your cases and checking availability." : "Resume ARC to continue preparing plans.") })
      ] }),
      b && /* @__PURE__ */ c.jsxs(
        "button",
        {
          className: "agent-toggle",
          disabled: s.busy || !s.connected,
          "aria-label": b.agent.enabled ? "Pause agent" : "Resume agent",
          onClick: () => {
            s.mutate("/api/agent/control", { enabled: !b.agent.enabled }).catch(() => {
            });
          },
          children: [
            /* @__PURE__ */ c.jsx(Ke, { name: b.agent.enabled ? "pause" : "play", size: 16 }),
            /* @__PURE__ */ c.jsx("span", { children: b.agent.enabled ? "Pause" : "Resume" })
          ]
        }
      )
    ] })
  ] });
}
function ki(s, d) {
  return d ? d.kind === "incident" ? s.incidents.find((b) => b.id === d.id) || null : d.kind === "unit" ? s.fleet.find((b) => b.id === d.id) || null : d.kind === "hospital" ? s.hospitals.find((b) => b.id === d.id) || null : d.kind === "closure" ? s.closures.find((b, o) => (b.id || String(o)) === d.id) || null : s.public_context[d.kind]?.records.find((b) => b.id === d.id) || null : null;
}
const Ly = {
  unit: "RESPONSE UNIT",
  hospital: "RECEIVING FACILITY",
  incident: "CASE DETAILS",
  closure: "SCENARIO CLOSURE",
  fire: "PUBLIC FIRE REPORT",
  police: "PUBLIC POLICE REPORT",
  roads: "ROAD RESTRICTION",
  traffic: "TRAFFIC OBSERVATION",
  stations: "AMBULANCE STATION"
};
function Vy() {
  const [s, d] = k.useState(
    () => matchMedia("(max-width: 760px)").matches
  );
  return k.useEffect(() => {
    const b = matchMedia("(max-width: 760px)"), o = () => d(b.matches);
    return b.addEventListener("change", o), () => b.removeEventListener("change", o);
  }, []), s;
}
function wy(s) {
  const d = s.state, b = Vy(), [o, z] = k.useState(!b), [A, E] = k.useState("all"), [U, D] = k.useState({}), [N, x] = k.useState(b ? null : "feature"), [m, j] = k.useState(null), [M, G] = k.useState(!1), [$, Q] = k.useState({
    resources: !0,
    calls: !1,
    roads: !1,
    traffic: !1,
    stations: !1
  }), [se, de] = k.useState({ serial: 0, mode: "selected" }), [ve, re] = k.useState(null), [Me, je] = k.useState({}), [K, F] = k.useState({}), R = k.useRef(null), ae = k.useRef(""), he = k.useRef({}), ue = d?.incidents.find((Z) => Z.id === s.selected), Y = m || (s.selected ? { kind: "incident", id: s.selected } : null), ie = d ? ki(d, Y) : null;
  k.useEffect(() => {
    d && (ae.current && ae.current !== d.epoch && (je({}), E("all"), D({}), F({}), re(null), j(null), he.current = {}), ae.current = d.epoch);
  }, [d?.epoch]);
  const ee = () => {
    if (Y) {
      const Z = document.querySelector(".detail-panel .panel-body");
      Z && (he.current[Y.kind + Y.id] = Z.scrollTop);
    }
  };
  k.useEffect(() => {
    const Z = document.querySelector(".detail-panel .panel-body");
    Z && Y && (Z.scrollTop = he.current[Y.kind + Y.id] || 0);
  }, [Y?.kind, Y?.id, N, M]);
  const q = (Z) => {
    ee(), x(Z), G(!1), re(null), b && z(!1);
  }, B = async (Z) => {
    if (ee(), j(Z), re(null), x("feature"), G(!1), b && z(!1), Z.kind === "incident") {
      const ce = d?.incidents.find((L) => L.id === Z.id);
      ce && ["reports", "history", "completed"].includes(Rt(ce)) && E(Rt(ce)), await s.select(Z.id), de((L) => ({
        serial: L.serial + 1,
        mode: "selected"
      }));
    }
  }, w = (Z) => {
    B({ kind: "incident", id: Z });
  }, xe = () => {
    ee(), x(null), re(null), document.getElementById("show-selected")?.focus({ preventScroll: !0 });
  };
  k.useEffect(() => {
    const Z = (ce) => {
      ce.key === "Escape" && (ve ? (re(null), G(!1)) : N ? (x(null), G(!1)) : z(!1));
    };
    return window.addEventListener("keydown", Z), () => window.removeEventListener("keydown", Z);
  }, [N, ve]);
  const pe = (Z, ce) => je((L) => {
    const te = { ...L };
    return ce ? te[Z] = ce : delete te[Z], te;
  }), bt = K[s.selected || ""] || /* @__PURE__ */ new Set(), Xt = (Z, ce) => {
    if (!s.selected) return;
    const L = s.selected;
    F((te) => {
      const dt = new Set(te[L] || []);
      return dt.has(Z) === ce ? te : (ce ? dt.add(Z) : dt.delete(Z), { ...te, [L]: dt });
    });
  }, cl = d ? {
    approval: d.incidents.filter((Z) => Rt(Z) === "approval").length,
    input: d.incidents.filter((Z) => Rt(Z) === "input").length
  } : null, v = d ? d.fleet.filter(
    (Z) => Z.status === "available" && !$i(d).has(Z.id)
  ).length : 0, H = d?.incidents.find((Z) => Z.id === s.job?.incident_id), W = d ? yu(s.rec, d.version, s.now, ue) : "unassessed", I = !!d?.assignments.find((Z) => Z.incident_id === s.selected)?.hold_reason || s.rec?.decision === "pending" && W !== "ready", _e = N === "feature" ? ie?.name || "Case details" : N === "resources" ? "Resources" : N === "context" ? "Map & source details" : N === "controls" ? "Workspace controls" : "System details";
  return {
    s: d,
    mobile: b,
    inboxOpen: o,
    setInboxOpen: z,
    queueBucket: A,
    setQueueBucket: E,
    instructions: U,
    setInstructions: D,
    panel: N,
    setPanel: x,
    feature: m,
    setFeature: j,
    collapsed: M,
    setCollapsed: G,
    layers: $,
    setLayers: Q,
    focus: se,
    setFocus: de,
    picking: ve,
    setPicking: re,
    drafts: Me,
    incident: ue,
    currentFeature: Y,
    item: ie,
    open: q,
    selectFeature: B,
    openCase: w,
    closePanel: xe,
    setDraft: pe,
    details: bt,
    onDetail: Xt,
    counts: cl,
    free: v,
    busyIncident: H,
    status: W,
    reviewing: I,
    panelTitle: _e,
    map: R
  };
}
function Ky({
  workspace: s,
  layout: d
}) {
  const {
    s: b,
    mobile: o,
    inboxOpen: z,
    setInboxOpen: A,
    panel: E,
    setPanel: U,
    setFeature: D,
    open: N,
    counts: x
  } = d;
  return /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
    /* @__PURE__ */ c.jsxs("header", { className: "workspace-header", children: [
      /* @__PURE__ */ c.jsxs(
        "a",
        {
          className: "brand",
          href: "/?city=" + window.ARC_CITY.id,
          "aria-label": "ARC home",
          children: [
            /* @__PURE__ */ c.jsx("span", { className: "logo", children: /* @__PURE__ */ c.jsx(Ke, { name: "arrow", size: 23 }) }),
            /* @__PURE__ */ c.jsx("span", { children: "ARC" })
          ]
        }
      ),
      /* @__PURE__ */ c.jsx("span", { className: "header-divider" }),
      /* @__PURE__ */ c.jsxs("label", { className: "city-choice", children: [
        /* @__PURE__ */ c.jsx("span", { className: "sr-only", children: "City workspace" }),
        /* @__PURE__ */ c.jsxs(
          "select",
          {
            "aria-label": "City workspace",
            value: window.ARC_CITY.id,
            onChange: (m) => {
              window.location.href = "/?city=" + encodeURIComponent(m.target.value);
            },
            children: [
              /* @__PURE__ */ c.jsx("option", { value: "toronto", children: "Toronto dispatch" }),
              /* @__PURE__ */ c.jsx("option", { value: "seattle", children: "Seattle dispatch" })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ c.jsxs("div", { className: "workspace-utilities", children: [
      /* @__PURE__ */ c.jsxs(
        "span",
        {
          className: `connection ${s.connected ? "" : "offline"}`,
          role: "status",
          children: [
            /* @__PURE__ */ c.jsx("i", {}),
            s.connected ? "Workspace connected" : b ? "Connection lost" : "Connecting…"
          ]
        }
      ),
      /* @__PURE__ */ c.jsx("time", { children: gn(s.now) }),
      /* @__PURE__ */ c.jsxs(
        "button",
        {
          "aria-label": "Workspace controls",
          title: "Workspace controls",
          onClick: () => N(E === "controls" ? null : "controls"),
          "aria-pressed": E === "controls",
          children: [
            /* @__PURE__ */ c.jsx(Ke, { name: "settings" }),
            /* @__PURE__ */ c.jsx("span", { children: "Workspace controls" })
          ]
        }
      ),
      /* @__PURE__ */ c.jsx(
        "button",
        {
          className: "icon-button",
          "aria-label": "System details",
          title: "System details",
          onClick: () => N(E === "evidence" ? null : "evidence"),
          children: /* @__PURE__ */ c.jsx(Ke, { name: "more" })
        }
      )
    ] }),
    /* @__PURE__ */ c.jsxs("nav", { className: "workspace-nav", "aria-label": "Workspace panels", children: [
      /* @__PURE__ */ c.jsxs(
        "button",
        {
          "aria-expanded": z,
          onClick: () => {
            A(!z), o && !z && U(null);
          },
          children: [
            /* @__PURE__ */ c.jsx(Ke, { name: "inbox" }),
            /* @__PURE__ */ c.jsx("span", { children: "Inbox" }),
            !!x && x.approval + x.input > 0 && /* @__PURE__ */ c.jsx("b", { children: x.approval + x.input })
          ]
        }
      ),
      /* @__PURE__ */ c.jsxs(
        "button",
        {
          id: "show-selected",
          onClick: () => {
            D(
              s.selected ? { kind: "incident", id: s.selected } : null
            ), N("feature");
          },
          children: [
            /* @__PURE__ */ c.jsx(Ke, { name: "pin" }),
            /* @__PURE__ */ c.jsx("span", { children: "Selected case" })
          ]
        }
      ),
      /* @__PURE__ */ c.jsxs(
        "button",
        {
          "aria-pressed": E === "resources",
          onClick: () => N(E === "resources" ? null : "resources"),
          children: [
            /* @__PURE__ */ c.jsx(Ke, { name: "unit" }),
            /* @__PURE__ */ c.jsx("span", { children: "Resources" })
          ]
        }
      ),
      /* @__PURE__ */ c.jsxs(
        "button",
        {
          "aria-pressed": E === "context",
          onClick: () => N(E === "context" ? null : "context"),
          children: [
            /* @__PURE__ */ c.jsx(Ke, { name: "layers" }),
            /* @__PURE__ */ c.jsx("span", { children: "Layers" })
          ]
        }
      )
    ] }),
    !s.connected && b && /* @__PURE__ */ c.jsx("div", { className: "connection-warning", role: "alert", children: "Connection lost. The displayed picture may be out of date; approvals are unavailable." })
  ] });
}
function Oh({
  title: s,
  eyebrow: d,
  children: b,
  className: o = "",
  collapsed: z = !1,
  onCollapse: A,
  onClose: E,
  tools: U
}) {
  const D = k.useId();
  return /* @__PURE__ */ c.jsxs(
    "section",
    {
      className: `floating-panel ${o} ${z ? "is-collapsed" : ""}`,
      "aria-labelledby": D,
      children: [
        /* @__PURE__ */ c.jsxs("div", { className: "panel-header", children: [
          /* @__PURE__ */ c.jsxs("div", { className: "panel-title", children: [
            d && /* @__PURE__ */ c.jsx("span", { className: "eyebrow", children: d }),
            /* @__PURE__ */ c.jsx("h2", { id: D, children: s })
          ] }),
          /* @__PURE__ */ c.jsxs("div", { className: "panel-actions", children: [
            A && /* @__PURE__ */ c.jsx(
              "button",
              {
                className: "icon-button",
                "aria-label": `${z ? "Expand" : "Collapse"} ${s}`,
                "aria-expanded": !z,
                onClick: A,
                children: /* @__PURE__ */ c.jsx("span", { className: z ? "rotate" : "", children: /* @__PURE__ */ c.jsx(Ke, { name: "chevron" }) })
              }
            ),
            /* @__PURE__ */ c.jsx(
              "button",
              {
                className: "icon-button",
                "aria-label": `Close ${s}`,
                onClick: E,
                children: /* @__PURE__ */ c.jsx(Ke, { name: "close" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ c.jsxs("div", { className: "panel-content", hidden: z, children: [
          U && /* @__PURE__ */ c.jsx("div", { className: "panel-toolbar", children: U }),
          /* @__PURE__ */ c.jsx("div", { className: "panel-body", children: b })
        ] })
      ]
    }
  );
}
function Jy({
  workspace: s,
  incident: d,
  onDetail: b
}) {
  const o = s.state, z = s.rec, A = yu(z, o.version, s.now, d), E = Rt(d), U = Ch(d), D = o.assignments.find((j) => j.incident_id === d.id);
  let N = "", x = "", m = "";
  return E === "reserved" || E === "completed" ? (N = D?.hold_reason ? "This journey needs review" : El(D?.phase), x = D?.hold_reason || (["completed", "cancelled"].includes(D?.phase || "") ? "The unit and receiving slot were released. The unit stays at its last journey location." : D?.automatic ? "ARC is progressing this exercise along the approved route." : "This earlier assignment uses manual progress controls.")) : E === "reports" || E === "history" ? (N = E === "history" ? "Earlier public report" : "Is this a response case?", x = "This is a public report, not a confirmed request to ARC. " + U.body, m = "intake") : E === "input" ? (N = U.title, x = U.body, m = U.target) : A === "ready" ? (N = "ARC has a plan ready", x = "Review the unit, destination and explanation below. Resources stay available until you approve.") : A === "changed" || A === "expired" ? (N = "ARC is reviewing this plan", x = A === "changed" ? Gy(z, o) : "The previous evidence has aged. ARC will check current conditions before another approval.") : d.agent_state === "working" ? (N = "ARC is checking this case", x = Vf(d.agent_reason)) : d.agent_state === "waiting" ? (N = d.agent_reason?.includes("unit") ? "ARC is waiting for a unit" : d.agent_reason?.includes("receiving") ? "ARC is waiting for a receiving facility" : "ARC is monitoring this case", x = d.agent_reason || "") : (N = "ARC will prepare a plan", x = "ARC will check eligible units, receiving facilities and routes, then bring you a recommendation."), !o.agent.enabled && E === "working" && (N = "ARC is paused", x = "Resume ARC to continue preparing and refreshing plans."), /* @__PURE__ */ c.jsxs("section", { className: "case-guidance", children: [
    /* @__PURE__ */ c.jsx("span", { className: "eyebrow", children: "ARC" }),
    /* @__PURE__ */ c.jsx("h3", { children: N }),
    /* @__PURE__ */ c.jsx("p", { children: x }),
    m && /* @__PURE__ */ c.jsx(
      "button",
      {
        onClick: () => {
          b(m === "intake" ? "intake" : "manual", !0), requestAnimationFrame(
            () => document.querySelector(
              ".case-content details[open]"
            )?.scrollIntoView({ block: "nearest" })
          );
        },
        children: E === "reports" ? "Confirm this response case" : E === "history" ? "Review report details" : U.action
      }
    )
  ] });
}
function gu({ details: s, onDetail: d }) {
  return (b, o, z) => /* @__PURE__ */ c.jsxs(
    "details",
    {
      className: "review-details",
      open: s.has(b),
      onToggle: (A) => d(b, A.currentTarget.open),
      children: [
        /* @__PURE__ */ c.jsx("summary", { children: o }),
        z
      ]
    }
  );
}
function ky({
  workspace: s,
  incident: d,
  draft: b,
  setDraft: o,
  picking: z,
  onPick: A,
  details: E,
  onDetail: U
}) {
  const D = s.state, N = b || Zf(d), x = s.busy || !s.connected, m = !!((d.public_source || d.prepared_intake) && d.status === "open"), j = !!d.assessment_blockers?.length, [M, G] = k.useState(""), $ = gu({ details: E, onDetail: U });
  return m ? $(
    "intake",
    `Response details · ${j ? "review required" : "ready"}`,
    /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
      /* @__PURE__ */ c.jsxs("details", { className: "source-details", children: [
        /* @__PURE__ */ c.jsx("summary", { children: "Published information" }),
        /* @__PURE__ */ c.jsx("p", { className: "quiet", children: d.prepared_intake ? "Prepared demo profile. Priority, requirements and pickup are supplied for this exercise." : `Published: ${d.public_call_type || "Call"} · ${d.public_location || "Location unavailable"} · ${yn(vu(d.public_observed_at, s.now))} ago. ${d.public_kind === "fire" ? `Published fire units: ${d.public_units || "not supplied"} · alarm level ${d.public_alarm_level ?? "not supplied"}. ` : ""}${d.pickup_source === "dispatcher" ? "Pickup entered by dispatcher." : "Public positions are approximate."}` })
      ] }),
      /* @__PURE__ */ c.jsxs(
        "form",
        {
          onSubmit: async (Q) => {
            Q.preventDefault(), G("");
            const se = d.id;
            try {
              await s.mutate(
                "/api/incidents/details",
                { ...N, incident_id: se, revision: N.revision },
                "Incident details saved."
              ), o(void 0);
            } catch (de) {
              G(
                de instanceof Error ? de.message : "Could not save details"
              );
            }
          },
          children: [
            /* @__PURE__ */ c.jsx("div", { className: "form-grid", children: ["priority", "service", "equipment"].map((Q) => /* @__PURE__ */ c.jsxs("label", { children: [
              Q === "priority" ? "Priority" : Q === "service" ? "Required service" : "Required equipment",
              /* @__PURE__ */ c.jsxs(
                "select",
                {
                  required: !0,
                  value: N[Q],
                  onChange: (se) => o({ ...N, [Q]: se.target.value }),
                  children: [
                    /* @__PURE__ */ c.jsxs("option", { value: "", children: [
                      "Choose ",
                      Q
                    ] }),
                    (Q === "priority" ? ["Priority 1", "Priority 2", "Priority 3"] : Q === "service" ? ["general", "cardiac", "trauma", "neuro", "pediatric"] : ["general", "advanced"]).map((se) => /* @__PURE__ */ c.jsx("option", { value: se, children: se }, se))
                  ]
                }
              )
            ] }, Q)) }),
            /* @__PURE__ */ c.jsxs("label", { children: [
              "Pickup address or intersection",
              /* @__PURE__ */ c.jsx(
                "input",
                {
                  maxLength: 200,
                  value: N.pickup_label,
                  onChange: (Q) => o({ ...N, pickup_label: Q.target.value })
                }
              )
            ] }),
            /* @__PURE__ */ c.jsxs("div", { className: "form-grid coordinates", children: [
              /* @__PURE__ */ c.jsxs("label", { children: [
                "Pickup latitude",
                /* @__PURE__ */ c.jsx(
                  "input",
                  {
                    "aria-label": "Pickup latitude",
                    type: "number",
                    required: !0,
                    step: "any",
                    min: D.city.bounds[0] + 1e-6,
                    max: D.city.bounds[2] - 1e-6,
                    value: N.lat,
                    onChange: (Q) => o({ ...N, lat: Q.target.value })
                  }
                )
              ] }),
              /* @__PURE__ */ c.jsxs("label", { children: [
                "Pickup longitude",
                /* @__PURE__ */ c.jsx(
                  "input",
                  {
                    "aria-label": "Pickup longitude",
                    type: "number",
                    required: !0,
                    step: "any",
                    min: D.city.bounds[1] + 1e-6,
                    max: D.city.bounds[3] - 1e-6,
                    value: N.lon,
                    onChange: (Q) => o({ ...N, lon: Q.target.value })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ c.jsx(
              "button",
              {
                type: "button",
                className: "text-button",
                "aria-pressed": z,
                onClick: () => {
                  o(N), A();
                },
                children: z ? "Cancel map pickup" : "Choose pickup on map"
              }
            ),
            /* @__PURE__ */ c.jsx("p", { className: "micro", children: z ? "Click a confirmed pickup point on the map." : "Confirm the pickup point. A street or postal area alone is not an exact pickup." }),
            /* @__PURE__ */ c.jsxs("label", { children: [
              "Dispatcher notes",
              /* @__PURE__ */ c.jsx(
                "textarea",
                {
                  rows: 3,
                  maxLength: 1e3,
                  value: N.notes,
                  onChange: (Q) => o({ ...N, notes: Q.target.value })
                }
              )
            ] }),
            /* @__PURE__ */ c.jsx("p", { className: "micro", children: "Priority, requirements and notes are dispatcher entries, separate from public facts." }),
            (M || N.revision !== (d.incident_revision || 0)) && /* @__PURE__ */ c.jsxs("div", { className: "notice warning", role: "alert", children: [
              /* @__PURE__ */ c.jsx("p", { children: M || "This case changed while you were editing. Your draft has been preserved." }),
              /* @__PURE__ */ c.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    o(Zf(d)), G("");
                  },
                  children: "Discard draft and load current details"
                }
              )
            ] }),
            /* @__PURE__ */ c.jsx("button", { className: "primary", type: "submit", disabled: x, children: "Confirm & let ARC continue" })
          ]
        }
      )
    ] })
  ) : null;
}
function Fy({
  workspace: s,
  assignment: d,
  details: b,
  onDetail: o
}) {
  const z = s.busy || !s.connected, A = gu({ details: b, onDetail: o });
  return /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
    /* @__PURE__ */ c.jsxs("section", { className: "journey-progress", children: [
      /* @__PURE__ */ c.jsx("h3", { children: "Journey progress" }),
      /* @__PURE__ */ c.jsx("ol", { className: "journey-stages", children: [
        "assigned",
        "responding",
        "on_scene",
        "transporting",
        "handover",
        "completed"
      ].map((E) => /* @__PURE__ */ c.jsx(
        "li",
        {
          className: d.phase === E ? "current" : "",
          "aria-current": d.phase === E ? "step" : void 0,
          children: El(E)
        },
        E
      )) }),
      d.hold_reason ? /* @__PURE__ */ c.jsx("p", { className: "notice warning", children: d.hold_reason }) : ["completed", "cancelled"].includes(d.phase) ? /* @__PURE__ */ c.jsxs("p", { className: "quiet", children: [
        "Ended ",
        d.completed_at ? gn(d.completed_at) : "",
        " · resources released."
      ] }) : d.automatic ? /* @__PURE__ */ c.jsxs("p", { className: "quiet", children: [
        "Next stage in",
        " ",
        yn(
          Math.max(0, Math.ceil((d.phase_ends_epoch || 0) - s.now / 1e3))
        ),
        " ",
        "· ",
        d.speed,
        "× exercise clock"
      ] }) : /* @__PURE__ */ c.jsx("p", { className: "quiet", children: "Earlier assignment · advance stages manually in Journey controls." }),
      /* @__PURE__ */ c.jsx("p", { className: "micro", children: "Progress follows assessed routes and exercise timing, not live crew updates." })
    ] }),
    !["completed", "cancelled"].includes(d.phase) && A(
      "journey-controls",
      "Journey controls",
      /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
        /* @__PURE__ */ c.jsx("p", { className: "quiet", children: "Advance one exercise stage, or end this assignment and release its resources at the current position." }),
        /* @__PURE__ */ c.jsxs("div", { className: "button-row", children: [
          /* @__PURE__ */ c.jsxs(
            "button",
            {
              disabled: z || !!d.hold_reason,
              onClick: () => {
                s.mutate(
                  "/api/assignments/progress",
                  { id: d.id, revision: d.revision, action: "advance" },
                  "Assignment progress advanced."
                ).catch(() => {
                });
              },
              children: [
                "Advance to",
                " ",
                El(By(d.phase)).toLowerCase()
              ]
            }
          ),
          /* @__PURE__ */ c.jsx(
            "button",
            {
              disabled: z,
              onClick: () => {
                s.mutate(
                  "/api/assignments/progress",
                  { id: d.id, revision: d.revision, action: "cancel" },
                  "Exercise assignment ended; resources released."
                ).catch(() => {
                });
              },
              children: "End exercise assignment"
            }
          )
        ] })
      ] })
    ),
    A(
      "journey-history",
      "Journey history",
      /* @__PURE__ */ c.jsx("ol", { className: "trace", children: d.history.map((E, U) => /* @__PURE__ */ c.jsxs("li", { children: [
        El(E.phase),
        " · ",
        gn(E.at, !0)
      ] }, U)) })
    )
  ] });
}
function $y({
  workspace: s,
  details: d,
  onDetail: b
}) {
  const o = s.state, z = s.rec, A = z.selected, E = gu({ details: d, onDetail: b });
  return /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
    " ",
    E(
      "reasoning",
      "Why this plan?",
      /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
        z.explanation.evidence_ids.map((U) => {
          const D = z.evidence.find((N) => N.id === U);
          return D ? /* @__PURE__ */ c.jsxs("div", { className: "evidence-item", children: [
            /* @__PURE__ */ c.jsx("span", { className: "eid", children: U }),
            /* @__PURE__ */ c.jsx("p", { children: vn(D.text) })
          ] }, U) : null;
        }),
        z.alternatives.filter((U) => !U.eligible).map((U) => /* @__PURE__ */ c.jsxs("div", { className: "alternative-row", children: [
          /* @__PURE__ */ c.jsxs("strong", { children: [
            U.name,
            " · excluded"
          ] }),
          /* @__PURE__ */ c.jsx("p", { children: vn(U.reasons.join(" ")) })
        ] }, U.id))
      ] })
    ),
    E(
      "sources",
      "Evidence & activity",
      /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
        /* @__PURE__ */ c.jsxs("p", { className: "quiet", children: [
          "Routes:",
          " ",
          A ? `${A.transport_route.mode} ${A.transport_route.source}` : "unavailable or ineligible",
          " ",
          "·",
          " ",
          A?.transport_route.traffic_aware ? "Traffic at assessment time" : "Static estimates; no live traffic",
          /* @__PURE__ */ c.jsx("br", {}),
          "Assessed",
          " ",
          new Date(z.created_at).toLocaleString("en-CA", {
            timeZone: o.city.timezone
          })
        ] }),
        z.changes.map((U, D) => /* @__PURE__ */ c.jsx("p", { className: "notice", children: vn(U.text) }, D)),
        /* @__PURE__ */ c.jsx("ol", { className: "trace", children: z.trace.map((U, D) => /* @__PURE__ */ c.jsxs("li", { children: [
          /* @__PURE__ */ c.jsx("strong", { children: U.tool }),
          /* @__PURE__ */ c.jsx("br", {}),
          vn(U.detail)
        ] }, D)) }),
        Object.entries(z.source_rows).map(([U, D]) => /* @__PURE__ */ c.jsxs("p", { className: "micro", children: [
          U,
          " · observed",
          " ",
          D[0]?.observed_at || "missing timestamp"
        ] }, U))
      ] })
    )
  ] });
}
function Wy({
  workspace: s,
  incident: d,
  details: b,
  onDetail: o
}) {
  const z = s.state, A = s.rec, E = A.selected, U = yu(A, z.version, s.now, d), D = z.assignments.find((m) => m.incident_id === d.id), N = s.busy || !s.connected, x = gu({ details: b, onDetail: o });
  return /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
    E ? /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
      A.decision === "pending" && U === "ready" && /* @__PURE__ */ c.jsx("p", { className: "plan-explanation", children: vn(
        E.reasons?.[0] || "These resources meet the confirmed requirements."
      ).replace(
        "Lowest total driving time among eligible pairs; ties prefer more receiving slots, then stable ID.",
        "This is the shortest combined driving time among eligible plans."
      ) }),
      /* @__PURE__ */ c.jsxs("section", { className: "plan-section", children: [
        /* @__PURE__ */ c.jsxs("div", { className: "plan-label", children: [
          /* @__PURE__ */ c.jsx("span", { children: "RESPONSE UNIT" }),
          /* @__PURE__ */ c.jsx("span", { children: A.decision === "approved" ? El(D?.phase) : ["changed", "expired"].includes(U) ? "Previous plan" : "Proposed" })
        ] }),
        /* @__PURE__ */ c.jsxs("div", { className: "plan-main", children: [
          /* @__PURE__ */ c.jsxs("div", { children: [
            /* @__PURE__ */ c.jsx("strong", { children: A.source_rows.fleet.find((m) => m.id === E.ambulance_id)?.name || E.ambulance_id }),
            /* @__PURE__ */ c.jsxs("p", { children: [
              "Meets the ",
              d.equipment,
              " equipment requirement"
            ] })
          ] }),
          A.decision !== "approved" && /* @__PURE__ */ c.jsxs("div", { className: "eta", children: [
            /* @__PURE__ */ c.jsxs("strong", { children: [
              "~",
              E.pickup_min
            ] }),
            /* @__PURE__ */ c.jsx("small", { children: "min to pickup" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ c.jsxs("section", { className: "plan-section", children: [
        /* @__PURE__ */ c.jsx("div", { className: "plan-label", children: A.decision === "approved" ? "RECEIVING FACILITY" : "DESTINATION PREVIEW" }),
        /* @__PURE__ */ c.jsxs("div", { className: "plan-main", children: [
          /* @__PURE__ */ c.jsxs("div", { children: [
            /* @__PURE__ */ c.jsx("strong", { children: A.source_rows.hospitals.find((m) => m.id === E.hospital_id)?.name || E.hospital_id }),
            /* @__PURE__ */ c.jsxs("p", { children: [
              "Meets the ",
              d.service,
              " service requirement"
            ] })
          ] }),
          A.decision !== "approved" && /* @__PURE__ */ c.jsxs("div", { className: "eta transport", children: [
            /* @__PURE__ */ c.jsxs("strong", { children: [
              "~",
              E.transport_min
            ] }),
            /* @__PURE__ */ c.jsx("small", { children: "min from pickup" })
          ] })
        ] })
      ] }),
      A.decision !== "approved" && /* @__PURE__ */ c.jsx("p", { className: "micro", children: "Driving estimates exclude time on scene and hospital handover." })
    ] }) : /* @__PURE__ */ c.jsxs("p", { className: "notice warning", children: [
      /* @__PURE__ */ c.jsx("strong", { children: "No suitable plan yet" }),
      /* @__PURE__ */ c.jsx("br", {}),
      "ARC could not match the current requirements, available resources and routes."
    ] }),
    A.decision === "rejected" && /* @__PURE__ */ c.jsx("p", { className: "notice warning", children: "Plan rejected. Review the requirements or request another assessment when ready." }),
    !!A.changes.length && U === "ready" && /* @__PURE__ */ c.jsxs("div", { className: "notice", children: [
      /* @__PURE__ */ c.jsx("strong", { children: "What changed" }),
      A.changes.map((m, j) => /* @__PURE__ */ c.jsx("p", { children: vn(m.text) }, j))
    ] }),
    A.decision === "pending" && /* @__PURE__ */ c.jsxs(
      "div",
      {
        className: `evidence-quality ${["changed", "expired"].includes(U) ? "attention" : ""}`,
        children: [
          /* @__PURE__ */ c.jsx("span", { children: U === "expired" ? "Evidence expired" : "Checked" }),
          /* @__PURE__ */ c.jsxs("span", { children: [
            yn(
              Math.max(
                0,
                Math.floor(
                  s.now / 1e3 - (A.evidence_epoch || A.created_epoch)
                )
              )
            ),
            " ",
            "ago"
          ] })
        ]
      }
    ),
    U === "ready" && E && /* @__PURE__ */ c.jsxs("div", { className: "approval-area", children: [
      /* @__PURE__ */ c.jsxs("div", { className: "decision-actions", children: [
        /* @__PURE__ */ c.jsx(
          "button",
          {
            id: "approve",
            className: "primary approve",
            disabled: N || !!(s.job && !s.job.automatic && Xf(s.job, d.id, z.epoch)),
            onClick: () => {
              s.decide("approve");
            },
            children: "Approve plan"
          }
        ),
        /* @__PURE__ */ c.jsx(
          "button",
          {
            disabled: N || !!(s.job && !s.job.automatic && Xf(s.job, d.id, z.epoch)),
            onClick: () => {
              s.decide("reject");
            },
            children: "Reject plan"
          }
        )
      ] }),
      /* @__PURE__ */ c.jsx("p", { className: "micro", children: "Approval reserves this unit and one receiving slot." })
    ] }),
    !!A.alternatives.filter(
      (m) => m.type === "assignment" && m.eligible && m.id !== E?.id
    ).length && x(
      "alternatives",
      U === "ready" ? "Compare options" : "Other options at assessment",
      /* @__PURE__ */ c.jsx(c.Fragment, { children: A.alternatives.filter(
        (m) => m.type === "assignment" && m.eligible && m.id !== E?.id
      ).sort(
        (m, j) => m.pickup_min - j.pickup_min || m.transport_min - j.transport_min
      ).map((m) => /* @__PURE__ */ c.jsxs("div", { className: "alternative-row", children: [
        /* @__PURE__ */ c.jsx("strong", { children: m.name }),
        /* @__PURE__ */ c.jsxs("p", { children: [
          "~",
          m.pickup_min,
          " min response · ~",
          m.transport_min,
          " min transport"
        ] }),
        U === "ready" && /* @__PURE__ */ c.jsx(
          "button",
          {
            disabled: N || !!s.job,
            onClick: () => {
              s.assess(m.id);
            },
            children: "Ask ARC to review this option"
          }
        )
      ] }, m.id)) })
    ),
    /* @__PURE__ */ c.jsx($y, { workspace: s, details: b, onDetail: o })
  ] });
}
function Iy({
  workspace: s,
  incident: d,
  draft: b,
  setDraft: o,
  picking: z,
  onPick: A,
  details: E,
  onDetail: U,
  request: D,
  setRequest: N
}) {
  const x = s.state, m = s.rec, j = yu(m, x.version, s.now, d), M = Rt(d), G = x.assignments.find((re) => re.incident_id === d.id), $ = !!d.assessment_blockers?.length, Q = s.busy || !s.connected, se = { workspace: s, incident: d, details: E, onDetail: U }, de = gu({ details: E, onDetail: U }), ve = /* @__PURE__ */ c.jsx(
    ky,
    {
      ...se,
      draft: b,
      setDraft: o,
      picking: z,
      onPick: A
    }
  );
  return /* @__PURE__ */ c.jsxs("div", { className: "case-content", children: [
    /* @__PURE__ */ c.jsxs("div", { className: "case-meta", children: [
      /* @__PURE__ */ c.jsx(
        "span",
        {
          className: `priority ${d.priority === "Priority 1" ? "urgent" : ""}`,
          children: d.priority || "Needs triage"
        }
      ),
      /* @__PURE__ */ c.jsx("span", { children: d.prepared_intake ? "Prepared intake" : d.public_source || "Response case" })
    ] }),
    /* @__PURE__ */ c.jsx("p", { className: "quiet requirements", children: d.public_source && !d.prepared_intake ? d.public_call_type : `${d.service || "Unconfirmed"} service · ${d.equipment || "unconfirmed"} equipment` }),
    /* @__PURE__ */ c.jsx(Jy, { ...se }),
    s.errors[d.id] && /* @__PURE__ */ c.jsx("p", { className: "notice error", role: "alert", children: s.errors[d.id] }),
    s.job && Xf(s.job, d.id, x.epoch) && /* @__PURE__ */ c.jsxs("p", { className: "assessment-progress", role: "status", children: [
      /* @__PURE__ */ c.jsx("span", { className: "agent-orb running" }),
      Vf(s.job.stage)
    ] }),
    $ && ve,
    (m || G) && /* @__PURE__ */ c.jsxs("div", { className: "decision-heading", children: [
      /* @__PURE__ */ c.jsx("h3", { children: M === "completed" ? "Completed assignment" : M === "reserved" ? "Approved plan" : j === "ready" ? "Your decision" : "Response plan" }),
      /* @__PURE__ */ c.jsx(
        "span",
        {
          className: `status-label ${j === "ready" ? "success" : ""}`,
          children: {
            ready: "Ready for review",
            changed: "Review required",
            expired: "Evidence expired",
            approved: El(G?.phase),
            rejected: "Rejected",
            blocked: "Blocked",
            incomplete: "Details required"
          }[j]
        }
      )
    ] }),
    G && (!m || m.decision === "approved") && /* @__PURE__ */ c.jsx(
      Fy,
      {
        workspace: s,
        assignment: G,
        details: E,
        onDetail: U
      }
    ),
    m && /* @__PURE__ */ c.jsx(Wy, { ...se }),
    !$ && ve,
    d.status === "open" && !$ && !["working", "queued"].includes(d.agent_state || "") && de(
      "manual",
      "Ask ARC to review this case",
      /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
        /* @__PURE__ */ c.jsxs("label", { children: [
          "Add an instruction",
          /* @__PURE__ */ c.jsx(
            "textarea",
            {
              rows: 3,
              value: D,
              onChange: (re) => N(re.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ c.jsx(
          "button",
          {
            className: "secondary-action",
            disabled: Q || !!s.job,
            onClick: () => {
              s.assess(void 0, D);
            },
            children: s.job ? "Another assessment is running" : d.agent_state === "needs_input" ? "Retry assessment" : "Reassess now"
          }
        )
      ] })
    )
  ] });
}
function Py({
  record: s,
  city: d
}) {
  const [b, o] = k.useState(""), [z, A] = k.useState(!1);
  return /* @__PURE__ */ c.jsxs("details", { className: "review-details", children: [
    /* @__PURE__ */ c.jsxs("summary", { children: [
      "Camera ",
      s.id,
      " · ",
      s.name
    ] }),
    /* @__PURE__ */ c.jsx(
      "button",
      {
        onClick: () => {
          A(!1), o(
            `/api/cameras/${encodeURIComponent(s.id)}?city=${d}&t=${Date.now()}`
          );
        },
        children: b ? "Refresh snapshot" : "Load camera snapshot"
      }
    ),
    z ? /* @__PURE__ */ c.jsx("p", { role: "status", children: "Camera image unavailable." }) : b && /* @__PURE__ */ c.jsx(
      "img",
      {
        className: "camera-image",
        alt: `${d} traffic camera snapshot`,
        src: b,
        onError: () => A(!0)
      }
    )
  ] });
}
const eg = {
  fire: "Public fire dispatch activity. Published positions may be approximate. Feed disappearance does not establish resolution.",
  police: "Public calls near mapped intersections. Reports may remain published after they have been handled.",
  roads: "Partial and scheduled restrictions provide context; these points do not automatically block routes.",
  hospitals: "Posted waits are not ambulance acceptance or available receiving slots.",
  traffic: "Sampled speeds describe nearby segments. Route estimates identify whether traffic was included.",
  stations: "Official Toronto station locations. No live staffing or vehicle availability is supplied."
};
function tg({
  workspace: s,
  layers: d,
  setLayers: b,
  onSelect: o,
  onCase: z
}) {
  const A = s.state, [E, U] = k.useState("fire"), D = A.public_context[E], N = D?.records || [], x = A.incidents.find((M) => M.id === s.selected), m = (M) => it(M) && it(x) ? Math.hypot((M.lat - x.lat) * 111, (M.lon - x.lon) * 80) : 1 / 0, j = E === "police" ? [...N].sort(
    (M, G) => String(G.observed_at).localeCompare(String(M.observed_at))
  ).slice(0, 30) : E === "roads" ? [...N].sort((M, G) => m(M) - m(G)).slice(0, 20) : N;
  return /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
    /* @__PURE__ */ c.jsx("h3", { className: "section-title first", children: "Map layers" }),
    /* @__PURE__ */ c.jsx("div", { className: "layer-list", children: [
      ["resources", "All units and facilities"],
      ["calls", "Public calls"],
      ["roads", "Road restrictions"],
      ["traffic", "Sampled traffic speeds"],
      ...A.city.id === "toronto" ? [["stations", "Ambulance stations"]] : []
    ].map(([M, G]) => /* @__PURE__ */ c.jsxs("label", { children: [
      /* @__PURE__ */ c.jsx(
        "input",
        {
          type: "checkbox",
          checked: d[M],
          onChange: ($) => b({ ...d, [M]: $.target.checked })
        }
      ),
      /* @__PURE__ */ c.jsx("span", { children: G })
    ] }, M)) }),
    /* @__PURE__ */ c.jsxs("p", { className: "micro", children: [
      A.incidents.filter(
        (M) => M.status === "open" && M.service && !it(M)
      ).length,
      " ",
      "response cases need a pickup location."
    ] }),
    /* @__PURE__ */ c.jsx("h3", { className: "section-title", children: "Live context" }),
    /* @__PURE__ */ c.jsxs("label", { className: "field-label", children: [
      "Source",
      /* @__PURE__ */ c.jsxs(
        "select",
        {
          "aria-label": "Source",
          value: E,
          onChange: (M) => U(M.target.value),
          children: [
            /* @__PURE__ */ c.jsx("option", { value: "fire", children: "Fire & medical assists" }),
            A.city.id === "toronto" && /* @__PURE__ */ c.jsx("option", { value: "police", children: "Police calls" }),
            /* @__PURE__ */ c.jsx("option", { value: "roads", children: "Road restrictions" }),
            /* @__PURE__ */ c.jsx("option", { value: "hospitals", children: "Hospital wait context" }),
            /* @__PURE__ */ c.jsx("option", { value: "traffic", children: "Traffic conditions" }),
            A.city.id === "toronto" && /* @__PURE__ */ c.jsx("option", { value: "stations", children: "Ambulance stations" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ c.jsx("p", { className: "quiet", children: E === "hospitals" && A.city.id === "seattle" ? "No live Seattle hospital waits or acceptance feed is connected." : eg[E] }),
    /* @__PURE__ */ c.jsxs("p", { className: `micro ${D?.stale ? "attention" : ""}`, children: [
      D?.mode === "live" ? D.stale ? "Last retrieval is stale" : "Connected" : D?.mode === "cached" ? "Cached · refresh failed" : "Unavailable",
      D?.fetched_at ? " · retrieved " + gn(D.fetched_at) : "",
      D?.error ? " · " + D.error : ""
    ] }),
    /* @__PURE__ */ c.jsxs("div", { className: "public-list", children: [
      j.map((M) => /* @__PURE__ */ c.jsxs("div", { className: "public-row", children: [
        /* @__PURE__ */ c.jsx("strong", { children: M.name || M.id }),
        (E === "fire" || E === "police") && /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
          /* @__PURE__ */ c.jsxs("p", { children: [
            M.location,
            " ·",
            " ",
            yn(vu(M.observed_at, s.now)),
            " ago",
            M.units ? " · " + M.units : ""
          ] }),
          (() => {
            const G = A.incidents.find(
              ($) => $.public_source && $.public_observed_at === M.observed_at && $.public_location === M.location
            );
            return G ? /* @__PURE__ */ c.jsx("button", { onClick: () => z(G.id), children: "Open queued call" }) : null;
          })()
        ] }),
        E === "stations" && /* @__PURE__ */ c.jsx("p", { children: M.address }),
        E === "roads" && /* @__PURE__ */ c.jsx("p", { children: M.description }),
        E === "hospitals" && /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
          /* @__PURE__ */ c.jsxs("p", { children: [
            M.wait_min != null ? `${M.wait_min} min posted wait` : "Wait unavailable",
            M.patients_waiting != null ? ` · ${M.patients_waiting} waiting` : ""
          ] }),
          /* @__PURE__ */ c.jsxs("p", { children: [
            yn(vu(M.observed_at, s.now)),
            " ago",
            (vu(M.observed_at, s.now) ?? 1 / 0) > 7200 ? " · stale / unverified" : ""
          ] })
        ] }),
        E === "traffic" && /* @__PURE__ */ c.jsxs("p", { children: [
          M.speed_kph,
          " km/h observed · ",
          M.free_flow_kph,
          " km/h free flow ·",
          " ",
          M.closed ? "road closed" : "no closure reported"
        ] }),
        it(M) && E !== "hospitals" && /* @__PURE__ */ c.jsx(
          "button",
          {
            className: "text-button",
            onClick: () => o({ kind: E, id: M.id }),
            children: "Inspect on map ↗"
          }
        )
      ] }, M.id)),
      !j.length && /* @__PURE__ */ c.jsx("p", { className: "quiet", children: D?.mode === "live" ? "No records returned by this source." : "Waiting for available source data." })
    ] }),
    D?.source_url && /* @__PURE__ */ c.jsx("p", { className: "micro", children: /* @__PURE__ */ c.jsx("a", { href: D.source_url, target: "_blank", rel: "noreferrer", children: "Official source ↗" }) }),
    E === "traffic" && A.city.id === "toronto" && /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
      /* @__PURE__ */ c.jsx("p", { className: "quiet", children: "City traffic cameras · on-demand snapshots. Image capture time is not supplied; images may be old." }),
      [...A.public_context.cameras?.records || []].sort((M, G) => m(M) - m(G)).slice(0, 3).map((M) => /* @__PURE__ */ c.jsx(Py, { record: M, city: A.city.id }, M.id))
    ] }),
    /* @__PURE__ */ c.jsx("h3", { className: "section-title", children: "Recent activity" }),
    [
      ...s.activities,
      ...A.agent.events.map((M) => ({
        text: (M.incident_id ? M.incident_id + " · " : "") + M.text,
        at: M.at
      }))
    ].sort((M, G) => G.at.localeCompare(M.at)).slice(0, 6).map((M, G) => /* @__PURE__ */ c.jsxs("p", { className: "activity-row", children: [
      /* @__PURE__ */ c.jsx("time", { children: gn(M.at) }),
      M.text
    ] }, G))
  ] });
}
async function hn(s, d, b) {
  const o = new URL(s, window.location.origin);
  o.searchParams.set("city", window.ARC_CITY.id);
  const z = await fetch(o, {
    signal: b,
    ...d === void 0 ? {} : {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(d)
    }
  }), A = await z.json();
  if (!z.ok) throw new Error(A.error || "Service unavailable");
  return A;
}
const Fi = (s) => window.ARC_CITY.id === "toronto" ? s : `${s}.${window.ARC_CITY.id}`, Gf = {
  approval: "Review plans",
  input: "Questions for you",
  working: "With ARC",
  reserved: "Active assignments",
  completed: "Completed",
  reports: "Public reports",
  history: "Earlier reports"
}, zh = [
  "approval",
  "input",
  "working",
  "reserved",
  "completed",
  "reports",
  "history"
];
function lg(s, d) {
  const b = Rt(s);
  if (b === "reports") return "Confirm response requirements";
  if (b === "history") return "Earlier public report";
  if (b === "completed") return "View completed assignment";
  if (b === "reserved") {
    const o = d.assignments.find((z) => z.incident_id === s.id);
    return o?.hold_reason ? "Journey needs review" : El(o?.phase);
  }
  return b === "approval" ? "Review ARC’s plan" : b === "input" ? Ch(s).title : s.agent_state === "waiting" ? s.agent_reason?.includes("receiving") ? "Waiting for a receiving facility" : s.agent_reason?.includes("unit") ? "Waiting for a unit" : s.agent_reason?.includes("paused") ? "ARC is paused" : "ARC is monitoring availability" : s.agent_state === "working" ? "ARC is checking this call" : "ARC will prepare a plan";
}
function ag({
  state: s,
  selected: d,
  onSelect: b,
  onClose: o,
  now: z,
  bucket: A,
  setBucket: E
}) {
  const [U, D] = k.useState(
    () => sessionStorage.getItem(Fi("arc.queueSource")) || "all"
  ), N = k.useMemo(
    () => Object.fromEntries(
      zh.map((j) => [
        j,
        s.incidents.filter((M) => Rt(M) === j).length
      ])
    ),
    [s.incidents]
  ), x = ["reports", "history"].includes(A), m = k.useMemo(
    () => Qf(
      s.incidents.filter(
        (j) => (A === "all" ? !["reports", "history", "completed"].includes(Rt(j)) : Rt(j) === A) && (!x || U === "all" || U === "public" && !!j.public_source || U === "workspace" && !j.public_source || U === "prepared" && j.prepared_intake || j.public_kind === U)
      )
    ),
    [s.incidents, A, x, U]
  );
  return /* @__PURE__ */ c.jsxs(
    Oh,
    {
      title: "Work with ARC",
      eyebrow: "DISPATCH INBOX",
      className: "inbox-panel",
      onClose: o,
      children: [
        /* @__PURE__ */ c.jsx("div", { className: "queue-stages", children: ["approval", "working", "input"].map((j) => /* @__PURE__ */ c.jsxs(
          "button",
          {
            "data-queue-bucket": j,
            className: j,
            "aria-pressed": A === j,
            onClick: () => E(A === j ? "all" : j),
            children: [
              /* @__PURE__ */ c.jsx("b", { children: N[j] }),
              /* @__PURE__ */ c.jsx("span", { children: Gf[j] })
            ]
          },
          j
        )) }),
        /* @__PURE__ */ c.jsx("div", { className: "queue-aux", children: ["reserved", "completed", "reports", "history"].map((j) => /* @__PURE__ */ c.jsxs(
          "button",
          {
            "aria-pressed": A === j,
            onClick: () => E(A === j ? "all" : j),
            children: [
              Gf[j],
              " ",
              /* @__PURE__ */ c.jsx("b", { children: N[j] })
            ]
          },
          j
        )) }),
        x ? /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
          /* @__PURE__ */ c.jsxs("label", { className: "field-label", children: [
            "Incident source",
            /* @__PURE__ */ c.jsxs(
              "select",
              {
                "aria-label": "Incident source",
                value: U,
                onChange: (j) => {
                  D(j.target.value), sessionStorage.setItem(
                    Fi("arc.queueSource"),
                    j.target.value
                  );
                },
                children: [
                  /* @__PURE__ */ c.jsx("option", { value: "all", children: "All sources" }),
                  /* @__PURE__ */ c.jsx("option", { value: "public", children: "Public calls" }),
                  /* @__PURE__ */ c.jsxs("option", { value: "fire", children: [
                    s.city.name,
                    " Fire"
                  ] }),
                  s.city.id === "toronto" && /* @__PURE__ */ c.jsx("option", { value: "police", children: "Toronto Police" }),
                  /* @__PURE__ */ c.jsx("option", { value: "workspace", children: "Workspace cases" }),
                  /* @__PURE__ */ c.jsx("option", { value: "prepared", children: "Prepared intake" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ c.jsx("p", { className: "quiet", children: "Public reports need confirmed requirements before ARC can plan." }),
          /* @__PURE__ */ c.jsx("p", { className: "micro", children: (s.city.id === "seattle" ? ["fire"] : ["fire", "police"]).map(
            (j) => `${j === "fire" ? "Fire" : "Police"}: ${s.public_context[j]?.stale ? "stale" : s.public_context[j]?.mode === "live" ? "connected" : "unavailable"}`
          ).join(" · ") })
        ] }) : /* @__PURE__ */ c.jsx("p", { className: "quiet inbox-note", children: N.approval || N.input ? "Review a plan or answer a question. ARC follows up on the other cases." : "ARC is following your cases. The next decision will appear here." }),
        /* @__PURE__ */ c.jsxs("div", { className: "incident-list", children: [
          zh.map((j) => {
            const M = m.filter((G) => Rt(G) === j);
            return M.length ? /* @__PURE__ */ c.jsxs(
              "details",
              {
                className: "queue-group",
                open: A === j || ["approval", "input", "working"].includes(j) || M.some((G) => G.id === d),
                children: [
                  /* @__PURE__ */ c.jsxs("summary", { children: [
                    Gf[j],
                    " ",
                    /* @__PURE__ */ c.jsx("span", { children: M.length })
                  ] }),
                  M.map((G) => /* @__PURE__ */ c.jsxs(
                    "button",
                    {
                      className: `incident-card ${d === G.id ? "selected" : ""}`,
                      "data-incident": G.id,
                      "aria-pressed": d === G.id,
                      onClick: () => b(G.id),
                      onKeyDown: ($) => {
                        if (!["ArrowUp", "ArrowDown"].includes($.key)) return;
                        $.preventDefault();
                        const Q = m[(m.indexOf(G) + ($.key === "ArrowDown" ? 1 : -1) + m.length) % m.length];
                        b(Q.id), document.querySelector(
                          `[data-incident="${CSS.escape(Q.id)}"]`
                        )?.focus();
                      },
                      children: [
                        /* @__PURE__ */ c.jsxs("span", { className: "incident-top", children: [
                          /* @__PURE__ */ c.jsx(
                            "span",
                            {
                              className: `priority ${G.priority === "Priority 1" ? "urgent" : ""}`,
                              children: G.status === "open" ? G.priority || G.public_call_type || "Public report" : G.status === "assigned" ? "Approved" : "Ended"
                            }
                          ),
                          G.status === "open" && /* @__PURE__ */ c.jsx("span", { children: yn(
                            vu(
                              G.public_source ? G.public_observed_at : G.received_at || s.epoch,
                              z
                            )
                          ) })
                        ] }),
                        /* @__PURE__ */ c.jsx("strong", { children: G.name }),
                        /* @__PURE__ */ c.jsx(
                          "span",
                          {
                            className: `queue-state ${j === "input" ? "attention" : ""}`,
                            children: lg(G, s)
                          }
                        )
                      ]
                    },
                    G.id
                  ))
                ]
              },
              j
            ) : null;
          }),
          !m.length && /* @__PURE__ */ c.jsxs("div", { className: "empty-state", children: [
            /* @__PURE__ */ c.jsx("strong", { children: A === "approval" ? "No plans waiting for review" : A === "input" ? "No questions for you" : "Nothing in this view" }),
            /* @__PURE__ */ c.jsx("p", { children: x ? "Try another source or view current reports." : "ARC will bring the next decision here." })
          ] })
        ] })
      ]
    }
  );
}
function ng({
  state: s,
  feature: d,
  onCase: b
}) {
  const o = ki(s, d);
  if (!o)
    return /* @__PURE__ */ c.jsx("p", { className: "notice warning", children: "This feature is no longer in the current picture." });
  const z = [];
  let A = "";
  if (d.kind === "unit") {
    const E = s.fleet.find((D) => D.id === d.id), U = s.assignments.find((D) => D.id === E.active_assignment_id);
    z.push(
      [
        "Status",
        U ? El(U.phase) : $i(s).has(E.id) ? "Proposed" : E.status
      ],
      ["Equipment", E.equipment.replaceAll(",", " · ")]
    ), E.station_reference && z.push(
      ["Base", E.station_reference.name],
      ["Address", E.station_reference.address]
    ), U && z.push([
      "Assignment",
      /* @__PURE__ */ c.jsx("button", { className: "text-button", onClick: () => b(U.incident_id), children: "Open assigned case" })
    ]), A = "Unit availability and movement are exercise data, not live vehicle tracking.";
  } else if (d.kind === "hospital") {
    const E = s.hospitals.find((U) => U.id === d.id);
    z.push(
      [
        "Receiving status",
        E.accepting && E.slots > 0 ? "Accepting" : "Unavailable"
      ],
      ["Available slots", E.slots],
      ["Services", E.capabilities.replaceAll(",", " · ")]
    ), A = "Receiving availability is workspace exercise data, separate from public hospital waits.";
  } else if (d.kind === "closure")
    z.push([
      "Radius",
      String("radius_m" in o ? o.radius_m : "") + " m"
    ]), A = "This scenario closure participates in route eligibility checks.";
  else {
    const E = o;
    for (const [N, x] of [
      ["Address", "address"],
      ["Location", "location"],
      ["Description", "description"],
      ["Published units", "units"],
      ["Observed speed", "speed_kph"],
      ["Free-flow speed", "free_flow_kph"],
      ["Confidence", "confidence"]
    ]) {
      const m = E[x];
      m != null && z.push([N, `${m}${x.includes("kph") ? " km/h" : ""}`]);
    }
    E.observed_at && z.push([
      "Source updated",
      new Date(E.observed_at).toLocaleString("en-CA", {
        timeZone: s.city.timezone
      })
    ]), E.updated_ms && z.push([
      "Source updated",
      new Date(Number(E.updated_ms)).toLocaleString("en-CA", {
        timeZone: s.city.timezone
      })
    ]);
    const U = s.public_context[d.kind];
    z.push([
      "Feed status",
      U?.stale ? "Stale" : U?.mode === "live" ? "Connected" : U?.mode || "Unavailable"
    ]), U?.fetched_at && z.push(["Retrieved", gn(U.fetched_at)]), U?.source_url && z.push([
      "Source",
      /* @__PURE__ */ c.jsx("a", { href: U.source_url, target: "_blank", rel: "noreferrer", children: "Official source ↗" })
    ]), A = d.kind === "stations" ? "Official station location. The catalogue contains no live vehicles, staffing or availability." : d.kind === "roads" ? "Public restriction context. These points do not automatically block routes or alter travel estimates." : "Published context does not establish a confirmed response case or resource availability.";
    const D = s.incidents.find(
      (N) => N.public_source && N.public_observed_at === E.observed_at && N.public_location === E.location
    );
    D && z.push([
      "ARC case",
      /* @__PURE__ */ c.jsx("button", { className: "text-button", onClick: () => b(D.id), children: "Open queued call" })
    ]);
  }
  return it(o) && z.push([
    "Coordinates",
    `${o.lat.toFixed(5)}, ${o.lon.toFixed(5)}`
  ]), /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
    /* @__PURE__ */ c.jsx("div", { className: `feature-symbol ${d.kind}`, children: /* @__PURE__ */ c.jsx(
      Ke,
      {
        name: d.kind === "unit" ? "unit" : d.kind === "hospital" ? "hospital" : "pin",
        size: 26
      }
    ) }),
    /* @__PURE__ */ c.jsx("dl", { className: "attributes", children: z.map(([E, U]) => /* @__PURE__ */ c.jsxs("div", { children: [
      /* @__PURE__ */ c.jsx("dt", { children: E }),
      /* @__PURE__ */ c.jsx("dd", { children: U })
    ] }, E)) }),
    /* @__PURE__ */ c.jsx("p", { className: "quiet feature-note", children: A })
  ] });
}
function ug({
  state: s,
  onSelect: d
}) {
  const b = $i(s);
  return /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
    /* @__PURE__ */ c.jsx("p", { className: "quiet", children: "Units and receiving facilities across this workspace." }),
    s.city.id === "toronto" && /* @__PURE__ */ c.jsx("p", { className: "micro", children: "Station-based positions use official Toronto geography. Unit staging and availability are scenario data." }),
    /* @__PURE__ */ c.jsxs("h3", { className: "section-title", children: [
      "Response units",
      " ",
      /* @__PURE__ */ c.jsxs("span", { children: [
        s.fleet.filter(
          (o) => o.status === "available" && !b.has(o.id)
        ).length,
        " ",
        "free"
      ] })
    ] }),
    s.fleet.map((o) => /* @__PURE__ */ c.jsxs(
      "button",
      {
        className: "resource-row",
        onClick: () => d({ kind: "unit", id: o.id }),
        children: [
          /* @__PURE__ */ c.jsx("span", { className: "resource-icon", children: /* @__PURE__ */ c.jsx(Ke, { name: "unit" }) }),
          /* @__PURE__ */ c.jsxs("span", { className: "resource-copy", children: [
            /* @__PURE__ */ c.jsx("strong", { children: o.name }),
            /* @__PURE__ */ c.jsx("small", { children: o.equipment.replaceAll(",", " · ") }),
            o.station_reference && /* @__PURE__ */ c.jsxs("small", { children: [
              "Base: ",
              o.station_reference.name
            ] })
          ] }),
          /* @__PURE__ */ c.jsx(
            "span",
            {
              className: `status-label ${o.status === "available" ? "success" : ""}`,
              children: o.status === "assigned" ? El(
                s.assignments.find((z) => z.id === o.active_assignment_id)?.phase
              ) : b.has(o.id) ? "Proposed" : o.status
            }
          )
        ]
      },
      o.id
    )),
    /* @__PURE__ */ c.jsx("h3", { className: "section-title", children: "Receiving facilities" }),
    s.hospitals.map((o) => /* @__PURE__ */ c.jsxs(
      "button",
      {
        className: "resource-row",
        onClick: () => d({ kind: "hospital", id: o.id }),
        children: [
          /* @__PURE__ */ c.jsx("span", { className: "resource-icon hospital", children: /* @__PURE__ */ c.jsx(Ke, { name: "hospital" }) }),
          /* @__PURE__ */ c.jsxs("span", { className: "resource-copy", children: [
            /* @__PURE__ */ c.jsx("strong", { children: o.name }),
            /* @__PURE__ */ c.jsx("small", { children: o.capabilities.replaceAll(",", " · ") })
          ] }),
          /* @__PURE__ */ c.jsx(
            "span",
            {
              className: `status-label ${o.accepting && o.slots > 0 ? "success" : "warning"}`,
              children: o.accepting && o.slots > 0 ? o.slots + " slots" : "Unavailable"
            }
          )
        ]
      },
      o.id
    ))
  ] });
}
function ig({
  workspace: s,
  onClose: d
}) {
  const b = s.state, [o, z] = k.useState(!1), A = async (E) => {
    try {
      await s.mutate(
        "/api/scenario",
        { name: E, incident_id: s.selected },
        "Workspace conditions updated."
      ), d();
    } catch {
    }
  };
  return /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
    /* @__PURE__ */ c.jsx("p", { className: "quiet", children: "Changes apply to the selected case’s proposed resources." }),
    /* @__PURE__ */ c.jsx("div", { className: "scenario-buttons", children: [
      [
        "hospital-unavailable",
        "Hospital unavailable",
        "Proposed destination stops accepting transfers."
      ],
      [
        "road-closure",
        "Close approach road",
        "Block the current destination approach."
      ],
      [
        "fleet-busy",
        "Unit becomes busy",
        "Proposed unit becomes unavailable."
      ]
    ].map(([E, U, D]) => /* @__PURE__ */ c.jsxs(
      "button",
      {
        disabled: s.busy || !s.connected || !s.selected,
        onClick: () => {
          A(E);
        },
        children: [
          /* @__PURE__ */ c.jsx("strong", { children: U }),
          /* @__PURE__ */ c.jsx("span", { children: D })
        ]
      },
      E
    )) }),
    /* @__PURE__ */ c.jsxs("details", { className: "review-details", children: [
      /* @__PURE__ */ c.jsx("summary", { children: "Service conditions" }),
      /* @__PURE__ */ c.jsx("div", { className: "button-row", children: [
        ["stale-feed", "Stale feed"],
        ["no-destination", "No destination"],
        ["zetaris-offline", "Data failure"],
        ["ai-offline", "AI failure"],
        ["refresh", "Restore feeds"]
      ].map(([E, U]) => /* @__PURE__ */ c.jsx(
        "button",
        {
          disabled: s.busy || !s.connected,
          onClick: () => {
            A(E);
          },
          children: U
        },
        E
      )) })
    ] }),
    /* @__PURE__ */ c.jsxs("label", { className: "field-label", children: [
      "Exercise journey speed",
      /* @__PURE__ */ c.jsxs(
        "select",
        {
          value: b.journey_speed || 10,
          disabled: s.busy || !s.connected,
          onChange: (E) => {
            s.mutate(
              "/api/journeys/speed",
              { speed: Number(E.target.value) },
              "Exercise journey speed changed."
            ).catch(() => {
            });
          },
          children: [
            /* @__PURE__ */ c.jsx("option", { value: 1, children: "Real time (1×)" }),
            /* @__PURE__ */ c.jsx("option", { value: 10, children: "10×" }),
            /* @__PURE__ */ c.jsx("option", { value: 30, children: "30×" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ c.jsx("p", { className: "micro", children: "New approvals progress automatically using assessed driving times, plus 3 minutes on scene and 5 minutes for handover. Movement is simulated." }),
    /* @__PURE__ */ c.jsx(
      "button",
      {
        disabled: s.busy || !s.connected,
        onClick: () => {
          s.mutate("/api/demo/intake", {}).then(
            (E) => s.notify(
              E.loaded ? "Prepared intake loaded. ARC will assess automatically." : "Prepared intake is already loaded."
            )
          ).catch(() => {
          });
        },
        children: "Load prepared demo intake"
      }
    ),
    /* @__PURE__ */ c.jsx("p", { className: "quiet", children: b.scenario === "baseline" ? "Baseline scenario" : b.scenario.replaceAll("-", " ") }),
    /* @__PURE__ */ c.jsx("div", { className: "reset-section", children: o ? /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
      /* @__PURE__ */ c.jsx("p", { children: "Reset this city’s exercise cases, plans and reservations?" }),
      /* @__PURE__ */ c.jsxs("div", { className: "button-row", children: [
        /* @__PURE__ */ c.jsx(
          "button",
          {
            className: "danger",
            disabled: s.busy || !s.connected,
            onClick: () => {
              s.mutate("/api/reset", {}, "Workspace reset.").then(d).catch(() => {
              });
            },
            children: "Confirm reset"
          }
        ),
        /* @__PURE__ */ c.jsx("button", { onClick: () => z(!1), children: "Keep workspace" })
      ] })
    ] }) : /* @__PURE__ */ c.jsx(
      "button",
      {
        className: "text-button danger",
        onClick: () => z(!0),
        children: "Reset workspace"
      }
    ) })
  ] });
}
function cg({ workspace: s }) {
  const [d, b] = k.useState(null), [o, z] = k.useState("");
  k.useEffect(() => {
    const E = new AbortController();
    return hn(
      "/api/world",
      void 0,
      E.signal
    ).then(b).catch((U) => {
      E.signal.aborted || z(U.message);
    }), () => E.abort();
  }, []);
  const A = s.state;
  return /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
    o ? /* @__PURE__ */ c.jsx("p", { className: "notice error", children: o }) : d ? /* @__PURE__ */ c.jsx(c.Fragment, { children: [
      [
        "Zetaris · federated product query",
        s.rec?.zetaris || A.integrations.zetaris || "Assess an incident first."
      ],
      [
        "Nightshift → NVIDIA Nemotron",
        s.rec?.ai || "No completed AI assessment yet."
      ],
      [
        "Meterless World Model",
        {
          entities: d.entities.length,
          recent_events_returned: d.events.length,
          events: d.events.slice(-8)
        }
      ]
    ].map(([E, U]) => /* @__PURE__ */ c.jsxs("section", { className: "integration-block", children: [
      /* @__PURE__ */ c.jsx("h3", { children: String(E) }),
      /* @__PURE__ */ c.jsx("pre", { children: JSON.stringify(U, null, 2) })
    ] }, String(E))) }) : /* @__PURE__ */ c.jsx("p", { children: "Loading integration evidence…" }),
    /* @__PURE__ */ c.jsxs("h3", { className: "section-title", children: [
      A.city.name,
      " road context · ",
      A.public_roads.mode
    ] }),
    /* @__PURE__ */ c.jsx("p", { className: "quiet", children: A.public_roads.note || A.public_roads.error || "Public point restrictions are contextual, not validated closure polygons." }),
    /* @__PURE__ */ c.jsxs("p", { className: "micro", children: [
      A.public_roads.fetched_at || "Not fetched",
      " ·",
      " ",
      A.public_roads.records.length,
      " records"
    ] }),
    /* @__PURE__ */ c.jsx(
      "button",
      {
        disabled: s.busy || !s.connected,
        onClick: () => {
          s.mutate("/api/roads/refresh", {}, "Public road context refreshed.").catch(() => {
          });
        },
        children: "Refresh public road context"
      }
    )
  ] });
}
function sg({
  workspace: s,
  layout: d
}) {
  const {
    s: b,
    mobile: o,
    inboxOpen: z,
    setInboxOpen: A,
    queueBucket: E,
    setQueueBucket: U,
    instructions: D,
    setInstructions: N,
    panel: x,
    collapsed: m,
    setCollapsed: j,
    layers: M,
    setLayers: G,
    setFocus: $,
    picking: Q,
    setPicking: se,
    drafts: de,
    incident: ve,
    currentFeature: re,
    item: Me,
    selectFeature: je,
    openCase: K,
    closePanel: F,
    setDraft: R,
    details: ae,
    onDetail: he,
    panelTitle: ue
  } = d;
  return /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
    b && z && (!o || !x) && /* @__PURE__ */ c.jsx(
      ag,
      {
        bucket: E,
        setBucket: U,
        state: b,
        selected: s.selected,
        now: s.now,
        onSelect: K,
        onClose: () => A(!1)
      }
    ),
    b && x && /* @__PURE__ */ c.jsx(
      Oh,
      {
        title: ue,
        eyebrow: x === "feature" ? Ly[re?.kind || "incident"] : x === "context" ? "OPERATIONAL PICTURE" : x === "resources" ? "WORKSPACE AVAILABILITY" : "ARC WORKSPACE",
        className: "detail-panel",
        collapsed: m,
        onCollapse: () => {
          j(!m), Q && se(null);
        },
        onClose: F,
        tools: x === "feature" && Me && it(Me) ? /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
          /* @__PURE__ */ c.jsxs(
            "button",
            {
              onClick: () => $((Y) => ({
                serial: Y.serial + 1,
                mode: re?.kind === "incident" ? "selected" : "feature",
                point: Me
              })),
              children: [
                /* @__PURE__ */ c.jsx(Ke, { name: "focus", size: 15 }),
                "Zoom to"
              ]
            }
          ),
          re?.kind !== "incident" && /* @__PURE__ */ c.jsxs("button", { onClick: () => K(s.selected), children: [
            /* @__PURE__ */ c.jsx(Ke, { name: "back", size: 15 }),
            "Back to case"
          ] })
        ] }) : void 0,
        children: x === "feature" && re?.kind === "incident" && ve ? /* @__PURE__ */ c.jsx(
          Iy,
          {
            workspace: s,
            request: D[ve.id] ?? "Assess available resources and explain the best feasible assignment.",
            setRequest: (Y) => N((ie) => ({
              ...ie,
              [ve.id]: Y
            })),
            incident: ve,
            draft: de[ve.id],
            setDraft: (Y) => R(ve.id, Y),
            picking: Q === ve.id,
            onPick: () => {
              se(Q ? null : ve.id), !Q && o && j(!0);
            },
            details: ae,
            onDetail: he
          },
          b.epoch + ve.id
        ) : x === "feature" && re ? /* @__PURE__ */ c.jsx(
          ng,
          {
            state: b,
            feature: re,
            onCase: K
          }
        ) : x === "resources" ? /* @__PURE__ */ c.jsx(
          ug,
          {
            state: b,
            onSelect: (Y) => {
              je(Y);
              const ie = ki(b, Y);
              ie && $((ee) => ({
                serial: ee.serial + 1,
                mode: "feature",
                point: ie
              }));
            }
          }
        ) : x === "context" ? /* @__PURE__ */ c.jsx(
          tg,
          {
            workspace: s,
            layers: M,
            setLayers: G,
            onSelect: (Y) => {
              je(Y);
              const ie = ki(b, Y);
              ie && $((ee) => ({
                serial: ee.serial + 1,
                mode: "feature",
                point: ie
              }));
            },
            onCase: K
          }
        ) : x === "controls" ? /* @__PURE__ */ c.jsx(ig, { workspace: s, onClose: F }) : x === "evidence" ? /* @__PURE__ */ c.jsx(cg, { workspace: s }) : /* @__PURE__ */ c.jsx("p", { className: "quiet", children: "Select a case on the map or in your inbox." })
      }
    )
  ] });
}
function fg() {
  const [s, d] = k.useState(null), [b, o] = k.useState(
    () => sessionStorage.getItem(Fi("arc.selected"))
  ), [z, A] = k.useState({}), [E, U] = k.useState(!1), [D, N] = k.useState({}), [x, m] = k.useState(null), [j, M] = k.useState(!1), [G, $] = k.useState(""), [Q, se] = k.useState(Date.now()), [de, ve] = k.useState([]), re = k.useRef({
    selected: b,
    epoch: "",
    sequence: 0,
    first: !0,
    alive: !0,
    controller: new AbortController()
  }), Me = k.useCallback((Y) => $(Y), []), je = k.useCallback(
    (Y) => ve(
      (ie) => [{ text: Y, at: (/* @__PURE__ */ new Date()).toISOString() }, ...ie].slice(0, 7)
    ),
    []
  ), K = k.useCallback(async () => {
    const Y = re.current, ie = ++Y.sequence;
    try {
      const ee = window.ARC_INITIAL_STATE;
      window.ARC_INITIAL_STATE = void 0;
      const q = (ee ? await ee : null) || await hn("/api/state", void 0, Y.controller.signal);
      if (!Y.alive || ie !== Y.sequence) return;
      Y.epoch && Y.epoch !== q.epoch && (A({}), N({}), m(null), ve([])), Y.epoch = q.epoch;
      let B = Y.selected;
      if ((Y.first || !q.incidents.some((w) => w.id === B)) && (B = Yy(q.incidents, B)), Y.first = !1, Y.selected = B, o(B), d(q), B) {
        const w = await hn(
          "/api/recommendations/" + encodeURIComponent(B),
          void 0,
          Y.controller.signal
        );
        if (!Y.alive || ie !== Y.sequence) return;
        A((xe) => {
          const pe = { ...xe };
          return w?.simulation_epoch === q.epoch ? pe[B] = w : delete pe[B], pe;
        });
      }
      U(!0);
    } catch (ee) {
      Y.alive && ie === Y.sequence && !(ee instanceof DOMException && ee.name === "AbortError") && U(!1);
    }
  }, []), F = k.useCallback(
    (Y) => (re.current.selected = Y, o(Y), sessionStorage.setItem(Fi("arc.selected"), Y), K()),
    [K]
  );
  k.useEffect(() => {
    const Y = re.current;
    Y.alive = !0, Y.controller = new AbortController();
    let ie;
    const ee = async () => {
      await K(), Y.alive && (ie = setTimeout(ee, 2e3));
    };
    ee();
    const q = setInterval(() => se(Date.now()), 1e3);
    return () => {
      Y.alive = !1, Y.sequence++, Y.controller.abort(), clearTimeout(ie), clearInterval(q);
    };
  }, [K]), k.useEffect(() => {
    if (!G) return;
    const Y = setTimeout(() => $(""), 5e3);
    return () => clearTimeout(Y);
  }, [G]);
  const R = x || s?.assessments?.[0] || null;
  k.useEffect(() => {
    if (!R) return;
    N(
      (B) => B[R.incident_id] ? { ...B, [R.incident_id]: "" } : B
    );
    let Y = !1;
    const ie = new AbortController();
    let ee;
    const q = async () => {
      try {
        const B = await hn(
          "/api/jobs/" + R.id,
          void 0,
          ie.signal
        );
        if (Y) return;
        if (B.status === "running") {
          m(B), ee = setTimeout(q, 850);
          return;
        }
        if (m(null), B.simulation_epoch !== re.current.epoch) return;
        B.result && (A((w) => ({ ...w, [B.incident_id]: B.result })), N(
          (w) => w[B.incident_id] ? { ...w, [B.incident_id]: "" } : w
        ), B.incident_id !== re.current.selected && (!B.automatic || B.trigger === "new incident" || B.result.changes.some(
          (w) => /^(Assignment revised|Route estimates changed)/.test(
            w.text
          )
        )) && Me(
          B.incident_id + (B.result.approvable ? " · plan ready for approval" : " · assessment needs attention")
        ), B.automatic || je(B.incident_id + " · assessment complete")), B.status === "error" && !B.automatic && N((w) => ({
          ...w,
          [B.incident_id]: B.error || "Assessment failed"
        })), await K();
      } catch {
        Y || (K(), ee = setTimeout(q, 1500));
      }
    };
    return ee = setTimeout(q, 850), () => {
      Y = !0, ie.abort(), clearTimeout(ee);
    };
  }, [R?.id, K, je, Me]);
  const ae = k.useCallback(
    async (Y, ie, ee) => {
      M(!0);
      try {
        const q = await hn(Y, ie);
        return await K(), ee && (Me(ee), je(ee)), q;
      } catch (q) {
        throw await K(), Me(q instanceof Error ? q.message : "Request failed"), q;
      } finally {
        M(!1);
      }
    },
    [K, Me, je]
  ), he = async (Y, ie = "Assess available resources and explain the best feasible assignment.") => {
    if (!b || R || j || !E) return;
    const ee = b, q = z[ee];
    N((B) => ({ ...B, [ee]: "" })), M(!0);
    try {
      const B = await hn(
        Y ? "/api/alternative" : "/api/agent/retry",
        Y ? { recommendation_id: q.id, pair_id: Y } : { incident_id: ee, request: ie }
      );
      m(B), je(ee + " · assessment started");
    } catch (B) {
      N((w) => ({
        ...w,
        [ee]: B instanceof Error ? B.message : "Assessment unavailable"
      }));
    } finally {
      M(!1);
    }
  }, ue = async (Y) => {
    if (!b || j || !E) return;
    const ie = z[b];
    try {
      const ee = await ae(
        "/api/decision",
        { id: ie.id, action: Y },
        Y === "approve" ? "Assignment reserved." : "Plan rejected."
      );
      A((q) => ({
        ...q,
        [ie.incident_id]: ee
      }));
    } catch (ee) {
      N((q) => ({
        ...q,
        [ie.incident_id]: ee instanceof Error ? ee.message : "Decision failed"
      }));
    }
  };
  return {
    state: s,
    selected: b,
    select: F,
    rec: b && z[b] || null,
    connected: E,
    errors: D,
    job: R,
    busy: j,
    toast: G,
    now: Q,
    activities: de,
    notify: Me,
    refresh: K,
    mutate: ae,
    assess: he,
    decide: ue
  };
}
function og() {
  const s = fg(), d = wy(s), {
    s: b,
    inboxOpen: o,
    panel: z,
    setCollapsed: A,
    layers: E,
    focus: U,
    picking: D,
    setPicking: N,
    drafts: x,
    incident: m,
    currentFeature: j,
    selectFeature: M,
    setDraft: G,
    map: $
  } = d;
  return /* @__PURE__ */ c.jsxs(
    "main",
    {
      className: `arc-workspace ${o ? "inbox-open" : ""} ${z ? "detail-open" : ""} ${D ? "picking-location" : ""}`,
      children: [
        /* @__PURE__ */ c.jsx(
          Xy,
          {
            state: b,
            rec: s.rec,
            selected: s.selected,
            feature: j,
            layers: E,
            focus: U,
            ready: s.connected,
            picking: !!D,
            draftPoint: m && x[m.id] && x[m.id].lat && x[m.id].lon && (Number(x[m.id].lat) !== m.lat || Number(x[m.id].lon) !== m.lon) ? {
              lat: Number(x[m.id].lat),
              lon: Number(x[m.id].lon)
            } : null,
            onSelect: (Q) => {
              M(Q);
            },
            onPick: (Q, se) => {
              if (!D || !b) return;
              const de = b.incidents.find((ve) => ve.id === D);
              de && (G(de.id, {
                ...x[de.id] || Zf(de),
                lat: Q.toFixed(6),
                lon: se.toFixed(6)
              }), N(null), A(!1), s.notify("Pickup point selected. Save response details to confirm."));
            },
            onMapReady: (Q) => {
              $.current = Q;
            },
            notify: s.notify
          }
        ),
        /* @__PURE__ */ c.jsxs("div", { className: "workspace-ui", children: [
          /* @__PURE__ */ c.jsx(Ky, { workspace: s, layout: d }),
          /* @__PURE__ */ c.jsx(sg, { workspace: s, layout: d }),
          /* @__PURE__ */ c.jsx(Zy, { workspace: s, layout: d }),
          s.toast && /* @__PURE__ */ c.jsx("div", { className: "toast", role: "status", "aria-live": "polite", children: s.toast })
        ] })
      ]
    }
  );
}
class rg extends k.Component {
  state = { error: !1 };
  static getDerivedStateFromError() {
    return { error: !0 };
  }
  render() {
    return this.state.error ? /* @__PURE__ */ c.jsxs("div", { className: "fatal-error", children: [
      /* @__PURE__ */ c.jsx("h1", { children: "ARC couldn’t display this workspace" }),
      /* @__PURE__ */ c.jsx("p", { children: "Reload to reconnect to the current workspace." }),
      /* @__PURE__ */ c.jsx("button", { onClick: () => window.location.reload(), children: "Reload ARC" })
    ] }) : this.props.children;
  }
}
Hy.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ c.jsx(rg, { children: /* @__PURE__ */ c.jsx(og, {}) })
);
