var Rf = { exports: {} }, du = {};
var vh;
function jy() {
  if (vh) return du;
  vh = 1;
  var f = /* @__PURE__ */ Symbol.for("react.transitional.element"), d = /* @__PURE__ */ Symbol.for("react.fragment");
  function E(r, H, B) {
    var U = null;
    if (B !== void 0 && (U = "" + B), H.key !== void 0 && (U = "" + H.key), "key" in H) {
      B = {};
      for (var J in H)
        J !== "key" && (B[J] = H[J]);
    } else B = H;
    return H = B.ref, {
      $$typeof: f,
      type: r,
      key: U,
      ref: H !== void 0 ? H : null,
      props: B
    };
  }
  return du.Fragment = d, du.jsx = E, du.jsxs = E, du;
}
var yh;
function Ay() {
  return yh || (yh = 1, Rf.exports = jy()), Rf.exports;
}
var c = Ay(), Mf = { exports: {} }, mu = {}, Df = { exports: {} }, Uf = {};
var gh;
function zy() {
  return gh || (gh = 1, (function(f) {
    function d(R, q) {
      var V = R.length;
      R.push(q);
      e: for (; 0 < V; ) {
        var Ne = V - 1 >>> 1, ye = R[Ne];
        if (0 < H(ye, q))
          R[Ne] = q, R[V] = ye, V = Ne;
        else break e;
      }
    }
    function E(R) {
      return R.length === 0 ? null : R[0];
    }
    function r(R) {
      if (R.length === 0) return null;
      var q = R[0], V = R.pop();
      if (V !== q) {
        R[0] = V;
        e: for (var Ne = 0, ye = R.length, St = ye >>> 1; Ne < St; ) {
          var wt = 2 * (Ne + 1) - 1, ke = R[wt], h = wt + 1, M = R[h];
          if (0 > H(ke, V))
            h < ye && 0 > H(M, ke) ? (R[Ne] = M, R[h] = V, Ne = h) : (R[Ne] = ke, R[wt] = V, Ne = wt);
          else if (h < ye && 0 > H(M, V))
            R[Ne] = M, R[h] = V, Ne = h;
          else break e;
        }
      }
      return q;
    }
    function H(R, q) {
      var V = R.sortIndex - q.sortIndex;
      return V !== 0 ? V : R.id - q.id;
    }
    if (f.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var B = performance;
      f.unstable_now = function() {
        return B.now();
      };
    } else {
      var U = Date, J = U.now();
      f.unstable_now = function() {
        return U.now() - J;
      };
    }
    var X = [], C = [], O = 1, y = null, N = 3, z = !1, Y = !1, P = !1, W = !1, ze = typeof setTimeout == "function" ? setTimeout : null, de = typeof clearTimeout == "function" ? clearTimeout : null, ve = typeof setImmediate < "u" ? setImmediate : null;
    function se(R) {
      for (var q = E(C); q !== null; ) {
        if (q.callback === null) r(C);
        else if (q.startTime <= R)
          r(C), q.sortIndex = q.expirationTime, d(X, q);
        else break;
        q = E(C);
      }
    }
    function fe(R) {
      if (P = !1, se(R), !Y)
        if (E(X) !== null)
          Y = !0, Ee || (Ee = !0, $());
        else {
          var q = E(C);
          q !== null && I(fe, q.startTime - R);
        }
    }
    var Ee = !1, w = -1, Z = 5, x = -1;
    function ue() {
      return W ? !0 : !(f.unstable_now() - x < Z);
    }
    function me() {
      if (W = !1, Ee) {
        var R = f.unstable_now();
        x = R;
        var q = !0;
        try {
          e: {
            Y = !1, P && (P = !1, de(w), w = -1), z = !0;
            var V = N;
            try {
              t: {
                for (se(R), y = E(X); y !== null && !(y.expirationTime > R && ue()); ) {
                  var Ne = y.callback;
                  if (typeof Ne == "function") {
                    y.callback = null, N = y.priorityLevel;
                    var ye = Ne(
                      y.expirationTime <= R
                    );
                    if (R = f.unstable_now(), typeof ye == "function") {
                      y.callback = ye, se(R), q = !0;
                      break t;
                    }
                    y === E(X) && r(X), se(R);
                  } else r(X);
                  y = E(X);
                }
                if (y !== null) q = !0;
                else {
                  var St = E(C);
                  St !== null && I(
                    fe,
                    St.startTime - R
                  ), q = !1;
                }
              }
              break e;
            } finally {
              y = null, N = V, z = !1;
            }
            q = void 0;
          }
        } finally {
          q ? $() : Ee = !1;
        }
      }
    }
    var $;
    if (typeof ve == "function")
      $ = function() {
        ve(me);
      };
    else if (typeof MessageChannel < "u") {
      var b = new MessageChannel(), L = b.port2;
      b.port1.onmessage = me, $ = function() {
        L.postMessage(null);
      };
    } else
      $ = function() {
        ze(me, 0);
      };
    function I(R, q) {
      w = ze(function() {
        R(f.unstable_now());
      }, q);
    }
    f.unstable_IdlePriority = 5, f.unstable_ImmediatePriority = 1, f.unstable_LowPriority = 4, f.unstable_NormalPriority = 3, f.unstable_Profiling = null, f.unstable_UserBlockingPriority = 2, f.unstable_cancelCallback = function(R) {
      R.callback = null;
    }, f.unstable_forceFrameRate = function(R) {
      0 > R || 125 < R ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : Z = 0 < R ? Math.floor(1e3 / R) : 5;
    }, f.unstable_getCurrentPriorityLevel = function() {
      return N;
    }, f.unstable_next = function(R) {
      switch (N) {
        case 1:
        case 2:
        case 3:
          var q = 3;
          break;
        default:
          q = N;
      }
      var V = N;
      N = q;
      try {
        return R();
      } finally {
        N = V;
      }
    }, f.unstable_requestPaint = function() {
      W = !0;
    }, f.unstable_runWithPriority = function(R, q) {
      switch (R) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          R = 3;
      }
      var V = N;
      N = R;
      try {
        return q();
      } finally {
        N = V;
      }
    }, f.unstable_scheduleCallback = function(R, q, V) {
      var Ne = f.unstable_now();
      switch (typeof V == "object" && V !== null ? (V = V.delay, V = typeof V == "number" && 0 < V ? Ne + V : Ne) : V = Ne, R) {
        case 1:
          var ye = -1;
          break;
        case 2:
          ye = 250;
          break;
        case 5:
          ye = 1073741823;
          break;
        case 4:
          ye = 1e4;
          break;
        default:
          ye = 5e3;
      }
      return ye = V + ye, R = {
        id: O++,
        callback: q,
        priorityLevel: R,
        startTime: V,
        expirationTime: ye,
        sortIndex: -1
      }, V > Ne ? (R.sortIndex = V, d(C, R), E(X) === null && R === E(C) && (P ? (de(w), w = -1) : P = !0, I(fe, V - Ne))) : (R.sortIndex = ye, d(X, R), Y || z || (Y = !0, Ee || (Ee = !0, $()))), R;
    }, f.unstable_shouldYield = ue, f.unstable_wrapCallback = function(R) {
      var q = N;
      return function() {
        var V = N;
        N = q;
        try {
          return R.apply(this, arguments);
        } finally {
          N = V;
        }
      };
    };
  })(Uf)), Uf;
}
var ph;
function Cy() {
  return ph || (ph = 1, Df.exports = zy()), Df.exports;
}
var qf = { exports: {} }, ce = {};
var bh;
function Oy() {
  if (bh) return ce;
  bh = 1;
  var f = /* @__PURE__ */ Symbol.for("react.transitional.element"), d = /* @__PURE__ */ Symbol.for("react.portal"), E = /* @__PURE__ */ Symbol.for("react.fragment"), r = /* @__PURE__ */ Symbol.for("react.strict_mode"), H = /* @__PURE__ */ Symbol.for("react.profiler"), B = /* @__PURE__ */ Symbol.for("react.consumer"), U = /* @__PURE__ */ Symbol.for("react.context"), J = /* @__PURE__ */ Symbol.for("react.forward_ref"), X = /* @__PURE__ */ Symbol.for("react.suspense"), C = /* @__PURE__ */ Symbol.for("react.memo"), O = /* @__PURE__ */ Symbol.for("react.lazy"), y = /* @__PURE__ */ Symbol.for("react.activity"), N = /* @__PURE__ */ Symbol.for("react.view_transition"), z = Symbol.iterator;
  function Y(h) {
    return h === null || typeof h != "object" ? null : (h = z && h[z] || h["@@iterator"], typeof h == "function" ? h : null);
  }
  var P = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, W = Object.assign, ze = {};
  function de(h, M, ee) {
    this.props = h, this.context = M, this.refs = ze, this.updater = ee || P;
  }
  de.prototype.isReactComponent = {}, de.prototype.setState = function(h, M) {
    if (typeof h != "object" && typeof h != "function" && h != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, h, M, "setState");
  }, de.prototype.forceUpdate = function(h) {
    this.updater.enqueueForceUpdate(this, h, "forceUpdate");
  };
  function ve() {
  }
  ve.prototype = de.prototype;
  function se(h, M, ee) {
    this.props = h, this.context = M, this.refs = ze, this.updater = ee || P;
  }
  var fe = se.prototype = new ve();
  fe.constructor = se, W(fe, de.prototype), fe.isPureReactComponent = !0;
  var Ee = Array.isArray;
  function w() {
  }
  var Z = { H: null, A: null, T: null, S: null }, x = Object.prototype.hasOwnProperty;
  function ue(h, M, ee) {
    var te = ee.ref;
    return {
      $$typeof: f,
      type: h,
      key: M,
      ref: te !== void 0 ? te : null,
      props: ee
    };
  }
  function me(h, M) {
    return ue(h.type, M, h.props);
  }
  function $(h) {
    return typeof h == "object" && h !== null && h.$$typeof === f;
  }
  function b(h) {
    var M = { "=": "=0", ":": "=2" };
    return "$" + h.replace(/[=:]/g, function(ee) {
      return M[ee];
    });
  }
  var L = /\/+/g;
  function I(h, M) {
    return typeof h == "object" && h !== null && h.key != null ? b("" + h.key) : M.toString(36);
  }
  function R(h) {
    switch (h.status) {
      case "fulfilled":
        return h.value;
      case "rejected":
        throw h.reason;
      default:
        switch (typeof h.status == "string" ? h.then(w, w) : (h.status = "pending", h.then(
          function(M) {
            h.status === "pending" && (h.status = "fulfilled", h.value = M);
          },
          function(M) {
            h.status === "pending" && (h.status = "rejected", h.reason = M);
          }
        )), h.status) {
          case "fulfilled":
            return h.value;
          case "rejected":
            throw h.reason;
        }
    }
    throw h;
  }
  function q(h, M, ee, te, _e) {
    var D = typeof h;
    (D === "undefined" || D === "boolean") && (h = null);
    var ne = !1;
    if (h === null) ne = !0;
    else
      switch (D) {
        case "bigint":
        case "string":
        case "number":
          ne = !0;
          break;
        case "object":
          switch (h.$$typeof) {
            case f:
            case d:
              ne = !0;
              break;
            case O:
              return ne = h._init, q(
                ne(h._payload),
                M,
                ee,
                te,
                _e
              );
          }
      }
    if (ne)
      return _e = _e(h), ne = te === "" ? "." + I(h, 0) : te, Ee(_e) ? (ee = "", ne != null && (ee = ne.replace(L, "$&/") + "/"), q(_e, M, ee, "", function(mt) {
        return mt;
      })) : _e != null && ($(_e) && (_e = me(
        _e,
        ee + (_e.key == null || h && h.key === _e.key ? "" : ("" + _e.key).replace(
          L,
          "$&/"
        ) + "/") + ne
      )), M.push(_e)), 1;
    ne = 0;
    var Q = te === "" ? "." : te + ":";
    if (Ee(h))
      for (var ae = 0; ae < h.length; ae++)
        te = h[ae], D = Q + I(te, ae), ne += q(
          te,
          M,
          ee,
          D,
          _e
        );
    else if (ae = Y(h), typeof ae == "function")
      for (h = ae.call(h), ae = 0; !(te = h.next()).done; )
        te = te.value, D = Q + I(te, ae++), ne += q(
          te,
          M,
          ee,
          D,
          _e
        );
    else if (D === "object") {
      if (typeof h.then == "function")
        return q(
          R(h),
          M,
          ee,
          te,
          _e
        );
      throw M = String(h), Error(
        "Objects are not valid as a React child (found: " + (M === "[object Object]" ? "object with keys {" + Object.keys(h).join(", ") + "}" : M) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return ne;
  }
  function V(h, M, ee) {
    if (h == null) return h;
    var te = [], _e = 0;
    return q(h, te, "", "", function(D) {
      return M.call(ee, D, _e++);
    }), te;
  }
  function Ne(h) {
    if (h._status === -1) {
      var M = h._result, ee = M();
      ee.then(
        function(te) {
          (h._status === 0 || h._status === -1) && (h._status = 1, h._result = te, ee.status === void 0 && (ee.status = "fulfilled", ee.value = te));
        },
        function(te) {
          (h._status === 0 || h._status === -1) && (h._status = 2, h._result = te, ee.status === void 0 && (ee.status = "rejected", ee.reason = te));
        }
      ), h._status === -1 && (h._status = 0, h._result = ee);
    }
    if (h._status === 1) return h._result.default;
    throw h._result;
  }
  var ye = typeof reportError == "function" ? reportError : function(h) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var M = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof h == "object" && h !== null && typeof h.message == "string" ? String(h.message) : String(h),
        error: h
      });
      if (!window.dispatchEvent(M)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", h);
      return;
    }
    console.error(h);
  };
  function St(h) {
    var M = Z.T, ee = {};
    ee.types = M !== null ? M.types : null, Z.T = ee;
    try {
      var te = h(), _e = Z.S;
      _e !== null && _e(ee, te), typeof te == "object" && te !== null && typeof te.then == "function" && te.then(w, ye);
    } catch (D) {
      ye(D);
    } finally {
      M !== null && ee.types !== null && (M.types = ee.types), Z.T = M;
    }
  }
  function wt(h) {
    var M = Z.T;
    if (M !== null) {
      var ee = M.types;
      ee === null ? M.types = [h] : ee.indexOf(h) === -1 && ee.push(h);
    } else St(wt.bind(null, h));
  }
  var ke = {
    map: V,
    forEach: function(h, M, ee) {
      V(
        h,
        function() {
          M.apply(this, arguments);
        },
        ee
      );
    },
    count: function(h) {
      var M = 0;
      return V(h, function() {
        M++;
      }), M;
    },
    toArray: function(h) {
      return V(h, function(M) {
        return M;
      }) || [];
    },
    only: function(h) {
      if (!$(h))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return h;
    }
  };
  return ce.Activity = y, ce.Children = ke, ce.Component = de, ce.Fragment = E, ce.Profiler = H, ce.PureComponent = se, ce.StrictMode = r, ce.Suspense = X, ce.ViewTransition = N, ce.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Z, ce.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(h) {
      return Z.H.useMemoCache(h);
    }
  }, ce.addTransitionType = wt, ce.cache = function(h) {
    return function() {
      return h.apply(null, arguments);
    };
  }, ce.cacheSignal = function() {
    return null;
  }, ce.cloneElement = function(h, M, ee) {
    if (h == null)
      throw Error(
        "The argument must be a React element, but you passed " + h + "."
      );
    var te = W({}, h.props), _e = h.key;
    if (M != null)
      for (D in M.key !== void 0 && (_e = "" + M.key), M)
        !x.call(M, D) || D === "key" || D === "__self" || D === "__source" || D === "ref" && M.ref === void 0 || (te[D] = M[D]);
    var D = arguments.length - 2;
    if (D === 1) te.children = ee;
    else if (1 < D) {
      for (var ne = Array(D), Q = 0; Q < D; Q++)
        ne[Q] = arguments[Q + 2];
      te.children = ne;
    }
    return ue(h.type, _e, te);
  }, ce.createContext = function(h) {
    return h = {
      $$typeof: U,
      _currentValue: h,
      _currentValue2: h,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, h.Provider = h, h.Consumer = {
      $$typeof: B,
      _context: h
    }, h;
  }, ce.createElement = function(h, M, ee) {
    var te, _e = {}, D = null;
    if (M != null)
      for (te in M.key !== void 0 && (D = "" + M.key), M)
        x.call(M, te) && te !== "key" && te !== "__self" && te !== "__source" && (_e[te] = M[te]);
    var ne = arguments.length - 2;
    if (ne === 1) _e.children = ee;
    else if (1 < ne) {
      for (var Q = Array(ne), ae = 0; ae < ne; ae++)
        Q[ae] = arguments[ae + 2];
      _e.children = Q;
    }
    if (h && h.defaultProps)
      for (te in ne = h.defaultProps, ne)
        _e[te] === void 0 && (_e[te] = ne[te]);
    return ue(h, D, _e);
  }, ce.createRef = function() {
    return { current: null };
  }, ce.forwardRef = function(h) {
    return { $$typeof: J, render: h };
  }, ce.isValidElement = $, ce.lazy = function(h) {
    return {
      $$typeof: O,
      _payload: { _status: -1, _result: h },
      _init: Ne
    };
  }, ce.memo = function(h, M) {
    return {
      $$typeof: C,
      type: h,
      compare: M === void 0 ? null : M
    };
  }, ce.startTransition = St, ce.unstable_useCacheRefresh = function() {
    return Z.H.useCacheRefresh();
  }, ce.use = function(h) {
    return Z.H.use(h);
  }, ce.useActionState = function(h, M, ee) {
    return Z.H.useActionState(h, M, ee);
  }, ce.useCallback = function(h, M) {
    return Z.H.useCallback(h, M);
  }, ce.useContext = function(h) {
    return Z.H.useContext(h);
  }, ce.useDebugValue = function() {
  }, ce.useDeferredValue = function(h, M) {
    return Z.H.useDeferredValue(h, M);
  }, ce.useEffect = function(h, M) {
    return Z.H.useEffect(h, M);
  }, ce.useEffectEvent = function(h) {
    return Z.H.useEffectEvent(h);
  }, ce.useId = function() {
    return Z.H.useId();
  }, ce.useImperativeHandle = function(h, M, ee) {
    return Z.H.useImperativeHandle(h, M, ee);
  }, ce.useInsertionEffect = function(h, M) {
    return Z.H.useInsertionEffect(h, M);
  }, ce.useLayoutEffect = function(h, M) {
    return Z.H.useLayoutEffect(h, M);
  }, ce.useMemo = function(h, M) {
    return Z.H.useMemo(h, M);
  }, ce.useOptimistic = function(h, M) {
    return Z.H.useOptimistic(h, M);
  }, ce.useReducer = function(h, M, ee) {
    return Z.H.useReducer(h, M, ee);
  }, ce.useRef = function(h) {
    return Z.H.useRef(h);
  }, ce.useState = function(h) {
    return Z.H.useState(h);
  }, ce.useSyncExternalStore = function(h, M, ee) {
    return Z.H.useSyncExternalStore(
      h,
      M,
      ee
    );
  }, ce.useTransition = function() {
    return Z.H.useTransition();
  }, ce.version = "19.3.1", ce;
}
var Sh;
function wf() {
  return Sh || (Sh = 1, qf.exports = Oy()), qf.exports;
}
var Hf = { exports: {} }, it = {};
var _h;
function Ry() {
  if (_h) return it;
  _h = 1;
  var f = wf();
  function d(O) {
    var y = "https://react.dev/errors/" + O;
    if (1 < arguments.length) {
      y += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var N = 2; N < arguments.length; N++)
        y += "&args[]=" + encodeURIComponent(arguments[N]);
    }
    return "Minified React error #" + O + "; visit " + y + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function E() {
  }
  var r = {
    d: {
      f: E,
      r: function() {
        throw Error(d(522));
      },
      D: E,
      C: E,
      L: E,
      m: E,
      X: E,
      S: E,
      M: E
    },
    p: 0,
    findDOMNode: null
  }, H = /* @__PURE__ */ Symbol.for("react.portal"), B = /* @__PURE__ */ Symbol.for("react.recoverable"), U = /* @__PURE__ */ Symbol.for("react.optimistic_key");
  function J(O, y, N) {
    var z = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: H,
      key: z == null ? null : z === U ? U : "" + z,
      children: O,
      containerInfo: y,
      implementation: N
    };
  }
  var X = f.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function C(O, y) {
    if (O === "font") return "";
    if (typeof y == "string")
      return y === "use-credentials" ? y : "";
  }
  return it.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = r, it.browser = function(O) {
    return { $$typeof: B, _reason: O };
  }, it.createPortal = function(O, y) {
    var N = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!y || y.nodeType !== 1 && y.nodeType !== 9 && y.nodeType !== 11)
      throw Error(d(299));
    return J(O, y, null, N);
  }, it.flushSync = function(O) {
    var y = X.T, N = r.p;
    try {
      if (X.T = null, r.p = 2, O) return O();
    } finally {
      X.T = y, r.p = N, r.d.f();
    }
  }, it.preconnect = function(O, y) {
    typeof O == "string" && (y ? (y = y.crossOrigin, y = typeof y == "string" ? y === "use-credentials" ? y : "" : void 0) : y = null, r.d.C(O, y));
  }, it.prefetchDNS = function(O) {
    typeof O == "string" && r.d.D(O);
  }, it.preinit = function(O, y) {
    if (typeof O == "string" && y && typeof y.as == "string") {
      var N = y.as, z = C(N, y.crossOrigin), Y = typeof y.integrity == "string" ? y.integrity : void 0, P = typeof y.fetchPriority == "string" ? y.fetchPriority : void 0;
      N === "style" ? r.d.S(
        O,
        typeof y.precedence == "string" ? y.precedence : void 0,
        {
          crossOrigin: z,
          integrity: Y,
          fetchPriority: P
        }
      ) : N === "script" && r.d.X(O, {
        crossOrigin: z,
        integrity: Y,
        fetchPriority: P,
        nonce: typeof y.nonce == "string" ? y.nonce : void 0
      });
    }
  }, it.preinitModule = function(O, y) {
    if (typeof O == "string")
      if (typeof y == "object" && y !== null) {
        if (y.as == null || y.as === "script") {
          var N = C(
            y.as,
            y.crossOrigin
          );
          r.d.M(O, {
            crossOrigin: N,
            integrity: typeof y.integrity == "string" ? y.integrity : void 0,
            nonce: typeof y.nonce == "string" ? y.nonce : void 0,
            fetchPriority: typeof y.fetchPriority == "string" ? y.fetchPriority : void 0
          });
        }
      } else y == null && r.d.M(O);
  }, it.preload = function(O, y) {
    if (typeof O == "string" && typeof y == "object" && y !== null && typeof y.as == "string") {
      var N = y.as, z = C(N, y.crossOrigin);
      r.d.L(O, N, {
        crossOrigin: z,
        integrity: typeof y.integrity == "string" ? y.integrity : void 0,
        nonce: typeof y.nonce == "string" ? y.nonce : void 0,
        type: typeof y.type == "string" ? y.type : void 0,
        fetchPriority: typeof y.fetchPriority == "string" ? y.fetchPriority : void 0,
        referrerPolicy: typeof y.referrerPolicy == "string" ? y.referrerPolicy : void 0,
        imageSrcSet: typeof y.imageSrcSet == "string" ? y.imageSrcSet : void 0,
        imageSizes: typeof y.imageSizes == "string" ? y.imageSizes : void 0,
        media: typeof y.media == "string" ? y.media : void 0
      });
    }
  }, it.preloadModule = function(O, y) {
    if (typeof O == "string")
      if (y) {
        var N = C(y.as, y.crossOrigin);
        r.d.m(O, {
          as: typeof y.as == "string" && y.as !== "script" ? y.as : void 0,
          crossOrigin: N,
          integrity: typeof y.integrity == "string" ? y.integrity : void 0,
          nonce: typeof y.nonce == "string" ? y.nonce : void 0,
          fetchPriority: typeof y.fetchPriority == "string" ? y.fetchPriority : void 0
        });
      } else r.d.m(O);
  }, it.requestFormReset = function(O) {
    r.d.r(O);
  }, it.unstable_batchedUpdates = function(O, y) {
    return O(y);
  }, it.useFormState = function(O, y, N) {
    return X.H.useFormState(O, y, N);
  }, it.useFormStatus = function() {
    return X.H.useHostTransitionStatus();
  }, it.version = "19.3.1", it;
}
var Th;
function My() {
  if (Th) return Hf.exports;
  Th = 1;
  function f() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(f);
      } catch (d) {
        console.error(d);
      }
  }
  return f(), Hf.exports = Ry(), Hf.exports;
}
var Eh;
function Dy() {
  if (Eh) return mu;
  Eh = 1;
  var f = Cy(), d = wf(), E = My();
  function r(e) {
    var t = "https://react.dev/errors/" + e;
    if (1 < arguments.length) {
      t += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var l = 2; l < arguments.length; l++)
        t += "&args[]=" + encodeURIComponent(arguments[l]);
    }
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function H(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function B(e) {
    for (var t = e, l = t; l && !l.alternate; )
      t = l, (t.flags & 4098) !== 0 && (e = t.return), l = t.return;
    for (; t.return; ) t = t.return;
    return t.tag === 3 ? e : null;
  }
  function U(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function J(e) {
    if (e.tag === 31) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function X(e) {
    if (B(e) !== e)
      throw Error(r(188));
  }
  function C(e) {
    var t = e.alternate;
    if (!t) {
      if (t = B(e), t === null) throw Error(r(188));
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
          if (u === l) return X(n), e;
          if (u === a) return X(n), t;
          u = u.sibling;
        }
        throw Error(r(188));
      }
      if (l.return !== a.return) l = n, a = u;
      else {
        for (var i = !1, s = n.child; s; ) {
          if (s === l) {
            i = !0, l = n, a = u;
            break;
          }
          if (s === a) {
            i = !0, a = n, l = u;
            break;
          }
          s = s.sibling;
        }
        if (!i) {
          for (s = u.child; s; ) {
            if (s === l) {
              i = !0, l = u, a = n;
              break;
            }
            if (s === a) {
              i = !0, a = u, l = n;
              break;
            }
            s = s.sibling;
          }
          if (!i) throw Error(r(189));
        }
      }
      if (l.alternate !== a) throw Error(r(190));
    }
    if (l.tag !== 3) throw Error(r(188));
    return l.stateNode.current === l ? e : t;
  }
  function O(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e;
    for (e = e.child; e !== null; ) {
      if (t = O(e), t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  function y(e, t, l, a, n, u) {
    for (; e !== null; ) {
      if ((e.tag === 5 || e.tag === 27 || e.tag === 6) && l(e, a, n, u) || (e.tag !== 22 || e.memoizedState === null) && (t || e.tag !== 5 && e.tag !== 27) && y(
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
  function N(e) {
    for (e = e.return; e !== null; ) {
      if (e.tag === 3 || e.tag === 5 || e.tag === 27) return e;
      e = e.return;
    }
    return null;
  }
  function z(e) {
    var t = !1;
    for (e = e.return; e !== null && (e.tag === 4 && (t = !0), !(e.tag === 3 || e.tag === 5 || e.tag === 27)); )
      e = e.return;
    return t;
  }
  function Y(e) {
    var t = [null, null], l = N(e);
    return l === null || P(
      t,
      e,
      l.child,
      { foundSelf: !1 }
    ), t;
  }
  function P(e, t, l, a) {
    for (; l !== null; ) {
      if (l === t) a.foundSelf = !0;
      else if (l.tag === 5 || l.tag === 27 || l.tag === 6) {
        if (a.foundSelf) return e[1] = l, !0;
        e[0] = l;
      } else if ((l.tag !== 22 || l.memoizedState === null) && P(
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
  function W(e) {
    switch (e.tag) {
      case 5:
      case 27:
      case 6:
        return e.stateNode;
      case 3:
        return e.stateNode.containerInfo;
      default:
        throw Error(r(559));
    }
  }
  var ze = null, de = null;
  function ve(e, t, l) {
    return e === l ? !0 : e === t ? (ze = e, !0) : !1;
  }
  function se(e, t, l) {
    return e === l ? (de = e, !1) : e === t ? (de !== null && (ze = e), !0) : !1;
  }
  function fe(e) {
    if (e === null) return null;
    do
      e = e === null ? null : e.return;
    while (e && e.tag !== 5 && e.tag !== 27 && e.tag !== 3);
    return e || null;
  }
  function Ee(e, t, l) {
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
  var w = Object.assign, Z = /* @__PURE__ */ Symbol.for("react.element"), x = /* @__PURE__ */ Symbol.for("react.transitional.element"), ue = /* @__PURE__ */ Symbol.for("react.portal"), me = /* @__PURE__ */ Symbol.for("react.fragment"), $ = /* @__PURE__ */ Symbol.for("react.strict_mode"), b = /* @__PURE__ */ Symbol.for("react.profiler"), L = /* @__PURE__ */ Symbol.for("react.consumer"), I = /* @__PURE__ */ Symbol.for("react.context"), R = /* @__PURE__ */ Symbol.for("react.forward_ref"), q = /* @__PURE__ */ Symbol.for("react.suspense"), V = /* @__PURE__ */ Symbol.for("react.suspense_list"), Ne = /* @__PURE__ */ Symbol.for("react.memo"), ye = /* @__PURE__ */ Symbol.for("react.lazy"), St = /* @__PURE__ */ Symbol.for("react.activity"), wt = /* @__PURE__ */ Symbol.for("react.legacy_hidden"), ke = /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel"), h = /* @__PURE__ */ Symbol.for("react.view_transition"), M = /* @__PURE__ */ Symbol.for("react.recoverable"), ee = Symbol.iterator;
  function te(e) {
    return e === null || typeof e != "object" ? null : (e = ee && e[ee] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var _e = /* @__PURE__ */ Symbol.for("react.client.reference");
  function D(e) {
    if (e == null) return null;
    if (typeof e == "function")
      return e.$$typeof === _e ? null : e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case me:
        return "Fragment";
      case b:
        return "Profiler";
      case $:
        return "StrictMode";
      case q:
        return "Suspense";
      case V:
        return "SuspenseList";
      case St:
        return "Activity";
      case h:
        return "ViewTransition";
    }
    if (typeof e == "object")
      switch (e.$$typeof) {
        case ue:
          return "Portal";
        case I:
          return e.displayName || "Context";
        case L:
          return (e._context.displayName || "Context") + ".Consumer";
        case R:
          var t = e.render;
          return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
        case Ne:
          return t = e.displayName || null, t !== null ? t : D(e.type) || "Memo";
        case ye:
          t = e._payload, e = e._init;
          try {
            return D(e(t));
          } catch {
          }
      }
    return null;
  }
  var ne = Array.isArray, Q = d.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, ae = E.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, mt = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, $i = [], Ta = -1;
  function $t(e) {
    return { current: e };
  }
  function Pe(e) {
    0 > Ta || (e.current = $i[Ta], $i[Ta] = null, Ta--);
  }
  function Ue(e, t) {
    Ta++, $i[Ta] = e.current, e.current = t;
  }
  var Ft = $t(null), pn = $t(null), Nl = $t(null), yu = $t(null);
  function gu(e, t) {
    switch (Ue(Nl, t), Ue(pn, e), Ue(Ft, null), t.nodeType) {
      case 9:
      case 11:
        e = (e = t.documentElement) && (e = e.namespaceURI) ? Nm(e) : 0;
        break;
      default:
        if (e = t.tagName, t = t.namespaceURI)
          t = Nm(t), e = xm(t, e);
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
    Pe(Ft), Ue(Ft, e);
  }
  function Ea() {
    Pe(Ft), Pe(pn), Pe(Nl);
  }
  function Fi(e) {
    var t = e.memoizedState;
    t !== null && (rn._currentValue = t.memoizedState, Ue(yu, e)), t = Ft.current;
    var l = xm(t, e.type);
    t !== l && (Ue(pn, e), Ue(Ft, l));
  }
  function pu(e) {
    pn.current === e && (Pe(Ft), Pe(pn)), yu.current === e && (Pe(yu), rn._currentValue = mt);
  }
  var Wi, Lf;
  function xl(e) {
    if (Wi === void 0)
      try {
        throw Error();
      } catch (l) {
        var t = l.stack.trim().match(/\n( *(at )?)/);
        Wi = t && t[1] || "", Lf = -1 < l.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < l.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + Wi + e + Lf;
  }
  var Ii = !1;
  function Pi(e, t) {
    if (!e || Ii) return "";
    Ii = !0;
    var l = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var a = {
        DetermineComponentFrameRoot: function() {
          try {
            if (t) {
              var A = function() {
                throw Error();
              };
              if (Object.defineProperty(A.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(A, []);
                } catch (G) {
                  var v = G;
                }
                Reflect.construct(e, [], A);
              } else {
                try {
                  A.call();
                } catch (G) {
                  v = G;
                }
                A = !1;
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
                  }), A = !0, new e();
                } finally {
                  A && (_ !== void 0 ? Object.defineProperty(e.prototype, "props", _) : delete e.prototype.props);
                }
              }
            } else {
              try {
                throw Error();
              } catch (G) {
                v = G;
              }
              (A = e()) && typeof A.catch == "function" && A.catch(function() {
              });
            }
          } catch (G) {
            if (G && v && typeof G.stack == "string")
              return [G.stack, v.stack];
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
      var u = a.DetermineComponentFrameRoot(), i = u[0], s = u[1];
      if (i && s) {
        var o = i.split(`
`), p = s.split(`
`);
        for (n = a = 0; a < o.length && !o[a].includes("DetermineComponentFrameRoot"); )
          a++;
        for (; n < p.length && !p[n].includes(
          "DetermineComponentFrameRoot"
        ); )
          n++;
        if (a === o.length || n === p.length)
          for (a = o.length - 1, n = p.length - 1; 1 <= a && 0 <= n && o[a] !== p[n]; )
            n--;
        for (; 1 <= a && 0 <= n; a--, n--)
          if (o[a] !== p[n]) {
            if (a !== 1 || n !== 1)
              do
                if (a--, n--, 0 > n || o[a] !== p[n]) {
                  var T = `
` + o[a].replace(" at new ", " at ");
                  return e.displayName && T.includes("<anonymous>") && (T = T.replace("<anonymous>", e.displayName)), T;
                }
              while (1 <= a && 0 <= n);
            break;
          }
      }
    } finally {
      Ii = !1, Error.prepareStackTrace = l;
    }
    return (l = e ? e.displayName || e.name : "") ? xl(l) : "";
  }
  function Oh(e, t) {
    switch (e.tag) {
      case 26:
      case 27:
      case 5:
        return xl(e.type);
      case 16:
        return xl("Lazy");
      case 13:
        return e.child !== t && t !== null ? xl("Suspense Fallback") : xl("Suspense");
      case 19:
        return xl("SuspenseList");
      case 0:
      case 15:
        return Pi(e.type, !1);
      case 11:
        return Pi(e.type.render, !1);
      case 1:
        return Pi(e.type, !0);
      case 31:
        return xl("Activity");
      case 30:
        return xl("ViewTransition");
      default:
        return "";
    }
  }
  function Vf(e) {
    try {
      var t = "", l = null;
      do
        t += Oh(e, l), l = e, e = e.return;
      while (e);
      return t;
    } catch (a) {
      return `
Error generating stack: ` + a.message + `
` + a.stack;
    }
  }
  var ec = Object.prototype.hasOwnProperty, tc = f.unstable_scheduleCallback, lc = f.unstable_cancelCallback, Rh = f.unstable_shouldYield, Mh = f.unstable_requestPaint, _t = f.unstable_now, Dh = f.unstable_getCurrentPriorityLevel, Kf = f.unstable_ImmediatePriority, Jf = f.unstable_UserBlockingPriority, bu = f.unstable_NormalPriority, Uh = f.unstable_LowPriority, kf = f.unstable_IdlePriority, qh = f.log, Hh = f.unstable_setDisableYieldValue, bn = null, Tt = null;
  function jl(e) {
    if (typeof qh == "function" && Hh(e), Tt && typeof Tt.setStrictMode == "function")
      try {
        Tt.setStrictMode(bn, e);
      } catch {
      }
  }
  var Et = Math.clz32 ? Math.clz32 : Gh, Bh = Math.log, Yh = Math.LN2;
  function Gh(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (Bh(e) / Yh | 0) | 0;
  }
  var Su = 256, _u = 262144, Tu = 4194304;
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
  function Eu(e, t, l) {
    var a = e.pendingLanes;
    if (a === 0) return 0;
    var n = 0, u = e.suspendedLanes, i = e.pingedLanes;
    e = e.warmLanes;
    var s = a & 134217727;
    return s !== 0 ? (a = s & ~u, a !== 0 ? n = Pl(a) : (i &= s, i !== 0 ? n = Pl(i) : l || (l = s & ~e, l !== 0 && (n = Pl(l))))) : (s = a & ~u, s !== 0 ? n = Pl(s) : i !== 0 ? n = Pl(i) : l || (l = a & ~e, l !== 0 && (n = Pl(l)))), n === 0 ? 0 : t !== 0 && t !== n && (t & u) === 0 && (u = n & -n, l = t & -t, u >= l || u === 32 && (l & 4194048) !== 0) ? t : n;
  }
  function Sn(e, t) {
    return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
  }
  function $f(e, t) {
    (t & 8) !== 0 && (t |= t & 32);
    var l = e.entangledLanes;
    if (l !== 0)
      for (e = e.entanglements, l &= t; 0 < l; ) {
        var a = 31 - Et(l), n = 1 << a;
        t |= e[a], l &= ~n;
      }
    return t;
  }
  function Qh(e, t) {
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
  function Ff() {
    var e = Tu;
    return Tu <<= 1, (Tu & 62914560) === 0 && (Tu = 4194304), e;
  }
  function ac(e) {
    for (var t = [], l = 0; 31 > l; l++) t.push(e);
    return t;
  }
  function _n(e, t) {
    e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
  }
  function Xh(e, t, l, a, n, u) {
    var i = e.pendingLanes;
    e.pendingLanes = l, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= l, e.entangledLanes &= l, e.errorRecoveryDisabledLanes &= l, e.shellSuspendCounter = 0;
    var s = e.entanglements, o = e.expirationTimes, p = e.hiddenUpdates;
    for (l = i & ~l; 0 < l; ) {
      var T = 31 - Et(l), A = 1 << T;
      s[T] = 0, o[T] = -1;
      var v = p[T];
      if (v !== null)
        for (p[T] = null, T = 0; T < v.length; T++) {
          var _ = v[T];
          _ !== null && (_.lane &= -536870913);
        }
      l &= ~A;
    }
    a !== 0 && Wf(e, a, 0), u !== 0 && n === 0 && e.tag !== 0 && (e.suspendedLanes |= u & ~(i & ~t));
  }
  function Wf(e, t, l) {
    e.pendingLanes |= t, e.suspendedLanes &= ~t;
    var a = 31 - Et(t);
    e.entangledLanes |= t, e.entanglements[a] = e.entanglements[a] | 1073741824 | l & 261930;
  }
  function If(e, t) {
    var l = e.entangledLanes |= t;
    for (e = e.entanglements; l; ) {
      var a = 31 - Et(l), n = 1 << a;
      n & t | e[a] & t && (e[a] |= t), l &= ~n;
    }
  }
  function Pf(e, t) {
    var l = t & -t;
    return l = (l & 42) !== 0 ? 1 : nc(l), (l & (e.suspendedLanes | t)) !== 0 ? 0 : l;
  }
  function nc(e) {
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
  function uc(e) {
    return e &= -e, 2 < e ? 8 < e ? (e & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function eo() {
    var e = ae.p;
    return e !== 0 ? e : (e = window.event, e === void 0 ? 32 : sh(e.type));
  }
  function to(e, t) {
    var l = ae.p;
    try {
      return ae.p = e, t();
    } finally {
      ae.p = l;
    }
  }
  var sl = Math.random().toString(36).slice(2), et = "__reactFiber$" + sl, ht = "__reactProps$" + sl, Na = "__reactContainer$" + sl, lo = "__reactEvents$" + sl, wh = "__reactListeners$" + sl, Zh = "__reactHandles$" + sl, ao = "__reactResources$" + sl, Tn = "__reactMarker$" + sl, Nu = "__reactLoad$" + sl;
  function xu(e) {
    delete e[et], delete e[ht], delete e[wh], delete e[Zh];
  }
  function ea(e) {
    var t;
    if (t = e[et]) return t;
    for (var l = e.parentNode; l; ) {
      if (t = l[Na] || l[et]) {
        if (l = t.alternate, t.child !== null || l !== null && l.child !== null)
          for (e = wm(e); e !== null; ) {
            if (l = e[et]) return l;
            e = wm(e);
          }
        return t;
      }
      e = l, l = e.parentNode;
    }
    return null;
  }
  function xa(e) {
    if (e = e[et] || e[Na]) {
      var t = e.tag;
      if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3)
        return e;
    }
    return null;
  }
  function En(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
    throw Error(r(33));
  }
  function ja(e) {
    var t = e[ao];
    return t || (t = e[ao] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), t;
  }
  function $e(e) {
    e[Tn] = !0;
  }
  function no(e) {
    e[Nu] = void 0;
  }
  var uo = /* @__PURE__ */ new Set(), io = {};
  function ta(e, t) {
    Aa(e, t), Aa(e + "Capture", t);
  }
  function Aa(e, t) {
    for (io[e] = t, e = 0; e < t.length; e++)
      uo.add(t[e]);
  }
  var Lh = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), co = {}, so = {};
  function Vh(e) {
    return ec.call(so, e) ? !0 : ec.call(co, e) ? !1 : Lh.test(e) ? so[e] = !0 : (co[e] = !0, !1);
  }
  var xe = !1;
  function fo() {
    var e = xe;
    return xe = !1, e;
  }
  function ju(e, t, l) {
    if (Vh(t))
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
  function Au(e, t, l) {
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
  function Nt(e) {
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
  function oo(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function Kh(e, t, l) {
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
  function ic(e) {
    if (!e._valueTracker) {
      var t = oo(e) ? "checked" : "value";
      e._valueTracker = Kh(
        e,
        t,
        "" + e[t]
      );
    }
  }
  function ro(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var l = t.getValue(), a = "";
    return e && (a = oo(e) ? e.checked ? "true" : "false" : e.value), e = a, e !== l ? (t.setValue(e), !0) : !1;
  }
  var Jh = /[\n"\\]/g;
  function Mt(e) {
    return e.replace(
      Jh,
      function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function cc(e, t, l, a, n, u, i, s) {
    e.name = "", i != null && typeof i != "function" && typeof i != "symbol" && typeof i != "boolean" ? e.type = i : e.removeAttribute("type"), t != null ? i === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + Nt(t)) : e.value !== "" + Nt(t) && (e.value = "" + Nt(t)) : i !== "submit" && i !== "reset" || e.removeAttribute("value"), t != null ? i === "number" && e.value == t ? sc(e, Nt(e.value)) : sc(e, Nt(t)) : l != null ? sc(e, Nt(l)) : a != null && e.removeAttribute("value"), n == null && u != null && (e.defaultChecked = !!u), n != null && (e.checked = n && typeof n != "function" && typeof n != "symbol"), s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" ? e.name = "" + Nt(s) : e.removeAttribute("name");
  }
  function mo(e, t, l, a, n, u, i, s) {
    if (u != null && typeof u != "function" && typeof u != "symbol" && typeof u != "boolean" && (e.type = u), t != null || l != null) {
      if (!(u !== "submit" && u !== "reset" || t != null)) {
        ic(e);
        return;
      }
      l = l != null ? "" + Nt(l) : "", t = t != null ? "" + Nt(t) : l, s || t === e.value || (e.value = t), e.defaultValue = t;
    }
    a = a ?? n, a = typeof a != "function" && typeof a != "symbol" && !!a, e.checked = s ? e.checked : !!a, e.defaultChecked = !!a, i != null && typeof i != "function" && typeof i != "symbol" && typeof i != "boolean" && (e.name = i), ic(e);
  }
  function sc(e, t) {
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
      for (l = "" + Nt(l), t = null, n = 0; n < e.length; n++) {
        if (e[n].value === l) {
          e[n].selected = !0, a && (e[n].defaultSelected = !0);
          return;
        }
        t !== null || e[n].disabled || (t = e[n]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function ho(e, t, l) {
    if (t != null && (t = "" + Nt(t), t !== e.value && (e.value = t), l == null)) {
      e.defaultValue !== t && (e.defaultValue = t);
      return;
    }
    e.defaultValue = l != null ? "" + Nt(l) : "";
  }
  function vo(e, t, l, a) {
    if (t == null) {
      if (a != null) {
        if (l != null) throw Error(r(92));
        if (ne(a)) {
          if (1 < a.length) throw Error(r(93));
          a = a[0];
        }
        l = a;
      }
      l == null && (l = ""), t = l;
    }
    l = Nt(t), e.defaultValue = l, a = e.textContent, a === l && a !== "" && a !== null && (e.value = a), ic(e);
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
  var kh = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function yo(e, t, l) {
    var a = t.indexOf("--") === 0;
    l == null || typeof l == "boolean" || l === "" ? a ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : a ? e.setProperty(t, l) : typeof l != "number" || l === 0 || kh.has(t) ? t === "float" ? e.cssFloat = l : e[t] = ("" + l).trim() : e[t] = l + "px";
  }
  function go(e, t, l) {
    if (t != null && typeof t != "object")
      throw Error(r(62));
    if (e = e.style, l != null) {
      for (var a in l)
        !l.hasOwnProperty(a) || t != null && t.hasOwnProperty(a) || (a.indexOf("--") === 0 ? e.setProperty(a, "") : a === "float" ? e.cssFloat = "" : e[a] = "", xe = !0);
      for (var n in t)
        a = t[n], t.hasOwnProperty(n) && l[n] !== a && (yo(e, n, a), xe = !0);
    } else
      for (var u in t)
        t.hasOwnProperty(u) && yo(e, u, t[u]);
  }
  function fc(e) {
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
  ]), Fh = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function zu(e) {
    return Fh.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
  }
  function Wt() {
  }
  var oc = null;
  function rc(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var Oa = null, Ra = null;
  function po(e) {
    var t = xa(e);
    if (t && (e = t.stateNode)) {
      var l = e[ht] || null;
      e: switch (e = t.stateNode, t.type) {
        case "input":
          if (cc(
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
                var n = a[ht] || null;
                if (!n) throw Error(r(90));
                cc(
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
              a = l[t], a.form === e.form && ro(a);
          }
          break e;
        case "textarea":
          ho(e, l.value, l.defaultValue);
          break e;
        case "select":
          t = l.value, t != null && za(e, !!l.multiple, t, !1);
      }
    }
  }
  var dc = !1;
  function bo(e, t, l) {
    if (dc) return e(t, l);
    dc = !0;
    try {
      var a = e(t);
      return a;
    } finally {
      if (dc = !1, (Oa !== null || Ra !== null) && (zi(), Oa && (t = Oa, e = Ra, Ra = Oa = null, po(t), e)))
        for (t = 0; t < e.length; t++) po(e[t]);
    }
  }
  function Nn(e, t) {
    var l = e.stateNode;
    if (l === null) return null;
    var a = l[ht] || null;
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
        r(231, t, typeof l)
      );
    return l;
  }
  var ol = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), mc = !1;
  if (ol)
    try {
      var xn = {};
      Object.defineProperty(xn, "passive", {
        get: function() {
          mc = !0;
        }
      }), window.addEventListener("test", xn, xn), window.removeEventListener("test", xn, xn);
    } catch {
      mc = !1;
    }
  var Al = null, hc = null, Cu = null;
  function So() {
    if (Cu) return Cu;
    var e, t = hc, l = t.length, a, n = "value" in Al ? Al.value : Al.textContent, u = n.length;
    for (e = 0; e < l && t[e] === n[e]; e++) ;
    var i = l - e;
    for (a = 1; a <= i && t[l - a] === n[u - a]; a++) ;
    return Cu = n.slice(e, 1 < a ? 1 - a : void 0);
  }
  function Ou(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function Ru() {
    return !0;
  }
  function _o() {
    return !1;
  }
  function ft(e) {
    function t(l, a, n, u, i) {
      this._reactName = l, this._targetInst = n, this.type = a, this.nativeEvent = u, this.target = i, this.currentTarget = null;
      for (var s in e)
        e.hasOwnProperty(s) && (l = e[s], this[s] = l ? l(u) : u[s]);
      return this.isDefaultPrevented = (u.defaultPrevented != null ? u.defaultPrevented : u.returnValue === !1) ? Ru : _o, this.isPropagationStopped = _o, this;
    }
    return w(t.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var l = this.nativeEvent;
        l && (l.preventDefault ? l.preventDefault() : typeof l.returnValue != "unknown" && (l.returnValue = !1), this.isDefaultPrevented = Ru);
      },
      stopPropagation: function() {
        var l = this.nativeEvent;
        l && (l.stopPropagation ? l.stopPropagation() : typeof l.cancelBubble != "unknown" && (l.cancelBubble = !0), this.isPropagationStopped = Ru);
      },
      persist: function() {
      },
      isPersistent: Ru
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
  }, Mu = ft(zl), jn = w({}, zl, { view: 0, detail: 0 }), Wh = ft(jn), vc, yc, An, Du = w({}, jn, {
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
    getModifierState: pc,
    button: 0,
    buttons: 0,
    relatedTarget: function(e) {
      return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
    },
    movementX: function(e) {
      return "movementX" in e ? e.movementX : (e !== An && (An && e.type === "mousemove" ? (vc = e.screenX - An.screenX, yc = e.screenY - An.screenY) : yc = vc = 0, An = e), vc);
    },
    movementY: function(e) {
      return "movementY" in e ? e.movementY : yc;
    }
  }), To = ft(Du), Ih = w({}, Du, { dataTransfer: 0 }), Ph = ft(Ih), ev = w({}, jn, { relatedTarget: 0 }), gc = ft(ev), tv = w({}, zl, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), lv = ft(tv), av = w({}, zl, {
    clipboardData: function(e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    }
  }), nv = ft(av), uv = w({}, zl, { data: 0 }), Eo = ft(uv), iv = {
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
  }, cv = {
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
  }, sv = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function fv(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = sv[e]) ? !!t[e] : !1;
  }
  function pc() {
    return fv;
  }
  var ov = w({}, jn, {
    key: function(e) {
      if (e.key) {
        var t = iv[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress" ? (e = Ou(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? cv[e.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: pc,
    charCode: function(e) {
      return e.type === "keypress" ? Ou(e) : 0;
    },
    keyCode: function(e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function(e) {
      return e.type === "keypress" ? Ou(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    }
  }), rv = ft(ov), dv = w({}, Du, {
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
  }), No = ft(dv), mv = w({}, zl, { submitter: 0 }), hv = ft(mv), vv = w({}, jn, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: pc
  }), yv = ft(vv), gv = w({}, zl, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), pv = ft(gv), bv = w({}, Du, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Sv = ft(bv), _v = w({}, zl, {
    newState: 0,
    oldState: 0,
    source: 0
  }), Tv = ft(_v), Ev = [9, 13, 27, 32], bc = ol && "CompositionEvent" in window, zn = null;
  ol && "documentMode" in document && (zn = document.documentMode);
  var Nv = ol && "TextEvent" in window && !zn, xo = ol && (!bc || zn && 8 < zn && 11 >= zn), jo = " ", Ao = !1;
  function zo(e, t) {
    switch (e) {
      case "keyup":
        return Ev.indexOf(t.keyCode) !== -1;
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
  function Co(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var Ma = !1;
  function xv(e, t) {
    switch (e) {
      case "compositionend":
        return Co(t);
      case "keypress":
        return t.which !== 32 ? null : (Ao = !0, jo);
      case "textInput":
        return e = t.data, e === jo && Ao ? null : e;
      default:
        return null;
    }
  }
  function jv(e, t) {
    if (Ma)
      return e === "compositionend" || !bc && zo(e, t) ? (e = So(), Cu = hc = Al = null, Ma = !1, e) : null;
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
        return xo && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var Av = {
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
  function Oo(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!Av[e.type] : t === "textarea";
  }
  function Ro(e, t, l, a) {
    Oa ? Ra ? Ra.push(a) : Ra = [a] : Oa = a, t = Ui(t, "onChange"), 0 < t.length && (l = new Mu(
      "onChange",
      "change",
      null,
      l,
      a
    ), e.push({ event: l, listeners: t }));
  }
  var Cn = null, On = null;
  function zv(e) {
    pm(e, 0);
  }
  function Uu(e) {
    var t = En(e);
    if (ro(t)) return e;
  }
  function Mo(e, t) {
    if (e === "change") return t;
  }
  var Do = !1;
  if (ol) {
    var Sc;
    if (ol) {
      var _c = "oninput" in document;
      if (!_c) {
        var Uo = document.createElement("div");
        Uo.setAttribute("oninput", "return;"), _c = typeof Uo.oninput == "function";
      }
      Sc = _c;
    } else Sc = !1;
    Do = Sc && (!document.documentMode || 9 < document.documentMode);
  }
  function qo() {
    Cn && (Cn.detachEvent("onpropertychange", Ho), On = Cn = null);
  }
  function Ho(e) {
    if (e.propertyName === "value" && Uu(On)) {
      var t = [];
      Ro(
        t,
        On,
        e,
        rc(e)
      ), bo(zv, t);
    }
  }
  function Cv(e, t, l) {
    e === "focusin" ? (qo(), Cn = t, On = l, Cn.attachEvent("onpropertychange", Ho)) : e === "focusout" && qo();
  }
  function Ov(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown")
      return Uu(On);
  }
  function Rv(e, t) {
    if (e === "click") return Uu(t);
  }
  function Mv(e, t) {
    if (e === "input" || e === "change")
      return Uu(t);
  }
  function Dv(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var xt = typeof Object.is == "function" ? Object.is : Dv;
  function Rn(e, t) {
    if (xt(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null)
      return !1;
    var l = Object.keys(e), a = Object.keys(t);
    if (l.length !== a.length) return !1;
    for (a = 0; a < l.length; a++) {
      var n = l[a];
      if (!ec.call(t, n) || !xt(e[n], t[n]))
        return !1;
    }
    return !0;
  }
  function Tc(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  function Bo(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function Yo(e, t) {
    var l = Bo(e);
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
      l = Bo(l);
    }
  }
  function Go(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Go(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function Qo(e) {
    e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
    for (var t = Tc(e.document); t instanceof e.HTMLIFrameElement; ) {
      try {
        var l = typeof t.contentWindow.location.href == "string";
      } catch {
        l = !1;
      }
      if (l) e = t.contentWindow;
      else break;
      t = Tc(e.document);
    }
    return t;
  }
  function Ec(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  var Uv = ol && "documentMode" in document && 11 >= document.documentMode, Da = null, Nc = null, Mn = null, xc = !1;
  function Xo(e, t, l) {
    var a = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    xc || Da == null || Da !== Tc(a) || (a = Da, "selectionStart" in a && Ec(a) ? a = { start: a.selectionStart, end: a.selectionEnd } : (a = (a.ownerDocument && a.ownerDocument.defaultView || window).getSelection(), a = {
      anchorNode: a.anchorNode,
      anchorOffset: a.anchorOffset,
      focusNode: a.focusNode,
      focusOffset: a.focusOffset
    }), Mn && Rn(Mn, a) || (Mn = a, a = Ui(Nc, "onSelect"), 0 < a.length && (t = new Mu(
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
  }, jc = {}, wo = {};
  ol && (wo = document.createElement("div").style, "AnimationEvent" in window || (delete Ua.animationend.animation, delete Ua.animationiteration.animation, delete Ua.animationstart.animation), "TransitionEvent" in window || delete Ua.transitionend.transition);
  function aa(e) {
    if (jc[e]) return jc[e];
    if (!Ua[e]) return e;
    var t = Ua[e], l;
    for (l in t)
      if (t.hasOwnProperty(l) && l in wo)
        return jc[e] = t[l];
    return e;
  }
  var Zo = aa("animationend"), Lo = aa("animationiteration"), Vo = aa("animationstart"), qv = aa("transitionrun"), Hv = aa("transitionstart"), Bv = aa("transitioncancel"), Ko = aa("transitionend"), Jo = /* @__PURE__ */ new Map(), Ac = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  Ac.push("scrollEnd");
  function Zt(e, t) {
    Jo.set(e, t), ta(t, [e]);
  }
  var Yv = 0;
  function rl(e, t) {
    if (e.name != null && e.name !== "auto") return e.name;
    if (t.autoName !== null) return t.autoName;
    e = Jt.identifierPrefix;
    var l = Yv++;
    return e = "_" + e + "t_" + l.toString(32) + "_", t.autoName = e;
  }
  function ko(e) {
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
    return e = ko(e), t = ko(t), t == null ? e === "auto" ? null : e : t === "auto" ? null : t;
  }
  var qu = typeof reportError == "function" ? reportError : function(e) {
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
  }, Dt = [], qa = 0, zc = 0;
  function Hu() {
    for (var e = qa, t = zc = qa = 0; t < e; ) {
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
  function Bu(e, t, l, a) {
    Dt[qa++] = e, Dt[qa++] = t, Dt[qa++] = l, Dt[qa++] = a, zc |= a, e.lanes |= a, e = e.alternate, e !== null && (e.lanes |= a);
  }
  function Cc(e, t, l, a) {
    return Bu(e, t, l, a), Yu(e);
  }
  function na(e, t) {
    return Bu(e, null, null, t), Yu(e);
  }
  function $o(e, t, l) {
    e.lanes |= l;
    var a = e.alternate;
    a !== null && (a.lanes |= l);
    for (var n = !1, u = e.return; u !== null; )
      u.childLanes |= l, a = u.alternate, a !== null && (a.childLanes |= l), u.tag === 22 && (e = u.stateNode, e === null || e._visibility & 1 || (n = !0)), e = u, u = u.return;
    return e.tag === 3 ? (u = e.stateNode, n && t !== null && (n = 31 - Et(l), e = u.hiddenUpdates, a = e[n], a === null ? e[n] = [t] : a.push(t), t.lane = l | 536870912), u) : null;
  }
  function Yu(e) {
    if (50 < eu)
      throw eu = 0, Ai = null, Error(r(185));
    for (var t = e.return; t !== null; )
      e = t, t = e.return;
    return e.tag === 3 ? e.stateNode : null;
  }
  var Ha = {};
  function Gv(e, t, l, a) {
    this.tag = e, this.key = l, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = a, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function vt(e, t, l, a) {
    return new Gv(e, t, l, a);
  }
  function Oc(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function ml(e, t) {
    var l = e.alternate;
    return l === null ? (l = vt(
      e.tag,
      t,
      e.key,
      e.mode
    ), l.elementType = e.elementType, l.type = e.type, l.stateNode = e.stateNode, l.alternate = e, e.alternate = l) : (l.pendingProps = t, l.type = e.type, l.flags = 0, l.subtreeFlags = 0, l.deletions = null), l.flags = e.flags & 1206910976, l.childLanes = e.childLanes, l.lanes = e.lanes, l.child = e.child, l.memoizedProps = e.memoizedProps, l.memoizedState = e.memoizedState, l.updateQueue = e.updateQueue, t = e.dependencies, l.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, l.sibling = e.sibling, l.index = e.index, l.ref = e.ref, l.refCleanup = e.refCleanup, l;
  }
  function Fo(e, t) {
    e.flags &= 1206910978;
    var l = e.alternate;
    return l === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = l.childLanes, e.lanes = l.lanes, e.child = l.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = l.memoizedProps, e.memoizedState = l.memoizedState, e.updateQueue = l.updateQueue, e.type = l.type, t = l.dependencies, e.dependencies = t === null ? null : {
      lanes: t.lanes,
      firstContext: t.firstContext
    }), e;
  }
  function Gu(e, t, l, a, n, u) {
    var i = 0;
    if (a = e, typeof a == "function") Oc(a) && (i = 1);
    else if (typeof a == "string")
      i = my(
        e,
        l,
        Ft.current
      ) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
    else
      e: switch (a) {
        case St:
          return e = vt(31, l, t, n), e.elementType = St, e.lanes = u, e;
        case me:
          return ua(l.children, n, u, t);
        case $:
          i = 8, n |= 24;
          break;
        case b:
          return e = vt(12, l, t, n | 2), e.elementType = b, e.lanes = u, e;
        case q:
          return e = vt(13, l, t, n), e.elementType = q, e.lanes = u, e;
        case V:
          return e = vt(19, l, t, n), e.elementType = V, e.lanes = u, e;
        case wt:
        case h:
          return e = n | 32, e = vt(30, l, t, e), e.elementType = h, e.lanes = u, e.stateNode = {
            autoName: null,
            paired: null,
            clones: null,
            ref: null
          }, e;
        default:
          if (typeof a == "object" && a !== null)
            switch (a.$$typeof) {
              case I:
                i = 10;
                break e;
              case L:
                i = 9;
                break e;
              case R:
                i = 11;
                break e;
              case Ne:
                i = 14;
                break e;
              case ye:
                i = 16, a = null;
                break e;
            }
          i = 29, l = Error(
            r(130, e === null ? "null" : typeof e, "")
          ), a = null;
      }
    return t = vt(i, l, t, n), t.elementType = e, t.type = a, t.lanes = u, t;
  }
  function ua(e, t, l, a) {
    return e = vt(7, e, a, t), e.lanes = l, e;
  }
  function Rc(e, t, l) {
    return e = vt(6, e, null, t), e.lanes = l, e;
  }
  function Wo(e) {
    var t = vt(18, null, null, 0);
    return t.stateNode = e, t;
  }
  function Mc(e, t, l) {
    return t = vt(
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
  var Io = /* @__PURE__ */ new WeakMap();
  function Ut(e, t) {
    if (typeof e == "object" && e !== null) {
      var l = Io.get(e);
      return l !== void 0 ? l : (t = {
        value: e,
        source: t,
        stack: Vf(t)
      }, Io.set(e, t), t);
    }
    return {
      value: e,
      source: t,
      stack: Vf(t)
    };
  }
  var Ba = [], Ya = 0, Qu = null, Dn = 0, qt = [], Ht = 0, Cl = null, It = 1, Pt = "";
  function hl(e, t) {
    Ba[Ya++] = Dn, Ba[Ya++] = Qu, Qu = e, Dn = t;
  }
  function Po(e, t, l) {
    qt[Ht++] = It, qt[Ht++] = Pt, qt[Ht++] = Cl, Cl = e;
    var a = It;
    e = Pt;
    var n = 32 - Et(a) - 1;
    a &= ~(1 << n), l += 1;
    var u = 32 - Et(t) + n;
    if (30 < u) {
      var i = n - n % 5;
      u = (a & (1 << i) - 1).toString(32), a >>= i, n -= i, It = 1 << 32 - Et(t) + n | l << n | a, Pt = u + e;
    } else
      It = 1 << u | l << n | a, Pt = e;
  }
  function Xu(e) {
    e.return !== null && (hl(e, 1), Po(e, 1, 0));
  }
  function Dc(e) {
    for (; e === Qu; )
      Qu = Ba[--Ya], Ba[Ya] = null, Dn = Ba[--Ya], Ba[Ya] = null;
    for (; e === Cl; )
      Cl = qt[--Ht], qt[Ht] = null, Pt = qt[--Ht], qt[Ht] = null, It = qt[--Ht], qt[Ht] = null;
  }
  function er(e, t) {
    qt[Ht++] = It, qt[Ht++] = Pt, qt[Ht++] = Cl, It = t.id, Pt = t.overflow, Cl = e;
  }
  var Fe = null, qe = null, he = !1, Ol = null, Bt = !1, Uc = Error(r(519));
  function Rl(e) {
    var t = Error(
      r(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML",
        ""
      )
    );
    throw Un(Ut(t, e)), Uc;
  }
  function tr(e) {
    var t = e.stateNode, l = e.type, a = e.memoizedProps;
    switch (t[et] = e, t[ht] = a, l) {
      case "dialog":
        pe("cancel", t), pe("close", t);
        break;
      case "iframe":
      case "object":
      case "embed":
        pe("load", t);
        break;
      case "video":
      case "audio":
        for (l = 0; l < lu.length; l++)
          pe(lu[l], t);
        break;
      case "source":
        pe("error", t);
        break;
      case "img":
      case "image":
      case "link":
        pe("error", t), pe("load", t);
        break;
      case "details":
        pe("toggle", t);
        break;
      case "input":
        pe("invalid", t), mo(
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
        pe("invalid", t);
        break;
      case "textarea":
        pe("invalid", t), vo(t, a.value, a.defaultValue, a.children);
    }
    l = a.children, typeof l != "string" && typeof l != "number" && typeof l != "bigint" || t.textContent === "" + l || a.suppressHydrationWarning === !0 || Tm(t.textContent, l) ? (a.popover != null && (pe("beforetoggle", t), pe("toggle", t)), a.onScroll != null && pe("scroll", t), a.onScrollEnd != null && pe("scrollend", t), a.onClick != null && (t.onclick = Wt), t = !0) : t = !1, t || Rl(e, !0);
  }
  function wu(e) {
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
    if (!he) return wu(e), he = !0, !1;
    var t = e.tag, l;
    if ((l = t !== 3 && t !== 27) && ((l = t === 5) && (l = e.type, l = !(l !== "form" && l !== "button") || rf(e.type, e.memoizedProps)), l = !l), l && qe && Rl(e), wu(e), t === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(r(317));
      qe = Xm(e);
    } else if (t === 31) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(r(317));
      qe = Xm(e);
    } else
      t === 27 ? (t = qe, Jl(e.type) ? (e = Sf, Sf = null, qe = e) : qe = t) : qe = Fe ? Gt(e.stateNode.nextSibling) : null;
    return !0;
  }
  function ia() {
    qe = Fe = null, he = !1;
  }
  function qc() {
    var e = Ol;
    return e !== null && (pt === null ? pt = e : pt.push.apply(
      pt,
      e
    ), Ol = null), e;
  }
  function Un(e) {
    Ol === null ? Ol = [e] : Ol.push(e);
  }
  var Hc = $t(null), ca = null, vl = null;
  function Ml(e, t, l) {
    Ue(Hc, t._currentValue), t._currentValue = l;
  }
  function yl(e) {
    e._currentValue = Hc.current, Pe(Hc);
  }
  function Zu(e, t, l) {
    for (; e !== null; ) {
      var a = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, a !== null && (a.childLanes |= t)) : a !== null && (a.childLanes & t) !== t && (a.childLanes |= t), e === l) break;
      e = e.return;
    }
  }
  function Bc(e, t, l, a) {
    var n = e.child;
    for (n !== null && (n.return = e); n !== null; ) {
      var u = n.dependencies;
      if (u !== null) {
        var i = n.child;
        u = u.firstContext;
        e: for (; u !== null; ) {
          var s = u;
          u = n;
          for (var o = 0; o < t.length; o++)
            if (s.context === t[o]) {
              u.lanes |= l, s = u.alternate, s !== null && (s.lanes |= l), Zu(
                u.return,
                l,
                e
              ), a || (i = null);
              break e;
            }
          u = s.next;
        }
      } else if (n.tag === 18) {
        if (i = n.return, i === null) throw Error(r(341));
        i.lanes |= l, u = i.alternate, u !== null && (u.lanes |= l), Zu(i, l, e), i = null;
      } else
        n.tag === 13 && n.memoizedState !== null && n.memoizedState.dehydrated === null ? (n.lanes |= l, i = n.alternate, i !== null && (i.lanes |= l), Zu(
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
        if (i === null) throw Error(r(387));
        if (i = i.memoizedProps, i !== null) {
          var s = n.type;
          xt(n.pendingProps.value, i.value) || (e !== null ? e.push(s) : e = [s]);
        }
      } else if (n === yu.current) {
        if (i = n.alternate, i === null) throw Error(r(387));
        i.memoizedState.memoizedState !== n.memoizedState.memoizedState && (e !== null ? e.push(rn) : e = [rn]);
      }
      n = n.return;
    }
    return e !== null && Bc(
      t,
      e,
      l,
      a
    ), t.flags |= 262144, e !== null;
  }
  function Lu(e) {
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
  function tt(e) {
    return lr(ca, e);
  }
  function Vu(e, t) {
    return ca === null && fa(e), lr(e, t);
  }
  function lr(e, t) {
    var l = t._currentValue;
    if (t = { context: t, memoizedValue: l, next: null }, vl === null) {
      if (e === null) throw Error(r(308));
      vl = t, e.dependencies = { lanes: 0, firstContext: t }, e.flags |= 524288;
    } else vl = vl.next = t;
    return l;
  }
  var Qv = typeof AbortController < "u" ? AbortController : function() {
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
  }, Xv = f.unstable_scheduleCallback, wv = f.unstable_NormalPriority, we = {
    $$typeof: I,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function Yc() {
    return {
      controller: new Qv(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function qn(e) {
    e.refCount--, e.refCount === 0 && Xv(wv, function() {
      e.controller.abort();
    });
  }
  function ar(e, t) {
    if ((e.pendingLanes & 4194048) !== 0) {
      var l = e.transitionTypes;
      for (l === null && (l = e.transitionTypes = []), e = 0; e < t.length; e++) {
        var a = t[e];
        l.indexOf(a) === -1 && l.push(a);
      }
    }
  }
  var Hn = null;
  function Zv(e) {
    var t = e.transitionTypes;
    return e.transitionTypes = null, t;
  }
  var Bn = null, Gc = 0, oa = 0, Qa = null;
  function Lv(e, t) {
    if (Bn === null) {
      var l = Bn = [];
      Gc = 0, oa = tf(), Qa = {
        status: "pending",
        value: void 0,
        then: function(a) {
          l.push(a);
        }
      };
    }
    return Gc++, t.then(nr, nr), t;
  }
  function nr() {
    if (--Gc === 0 && (Hn = null, Bn !== null)) {
      Qa !== null && (Qa.status = "fulfilled");
      var e = Bn;
      Bn = null, oa = 0, Qa = null;
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
  }
  function Vv(e, t) {
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
  var ur = Q.S;
  Q.S = function(e, t) {
    if (Wd = _t(), typeof t == "object" && t !== null && typeof t.then == "function" && Lv(e, t), Hn !== null)
      for (var l = nn; l !== null; )
        ar(l, Hn), l = l.next;
    if (l = e.types, l !== null) {
      for (var a = nn; a !== null; )
        ar(a, l), a = a.next;
      if (oa !== 0) {
        a = Hn, a === null && (a = Hn = []);
        for (var n = 0; n < l.length; n++) {
          var u = l[n];
          a.indexOf(u) === -1 && a.push(u);
        }
      }
    }
    ur !== null && ur(e, t);
  };
  var ra = $t(null);
  function Qc() {
    var e = ra.current;
    return e !== null ? e : De.pooledCache;
  }
  function Ku(e, t) {
    t === null ? Ue(ra, ra.current) : Ue(ra, t.pool);
  }
  function ir() {
    var e = Qc();
    return e === null ? null : { parent: we._currentValue, pool: e };
  }
  var Xa = Error(r(460)), Xc = Error(r(474)), Ju = Error(r(542)), ku = { then: function() {
  } };
  function cr(e) {
    return e = e.status, e === "fulfilled" || e === "rejected";
  }
  function sr(e, t, l) {
    switch (l = e[l], l === void 0 ? e.push(t) : l !== t && (t.then(Wt, Wt), t = l), t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw e = t.reason, or(e), e === void 0 && !("reason" in t) ? Error(r(600)) : e;
      default:
        if (typeof t.status == "string") t.then(Wt, Wt);
        else {
          if (e = De, e !== null && 100 < e.shellSuspendCounter)
            throw Error(r(482));
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
            throw e = t.reason, or(e), e;
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
  function fr() {
    if (ma === null) throw Error(r(459));
    var e = ma;
    return ma = null, e;
  }
  function or(e) {
    if (e === Xa || e === Ju)
      throw Error(r(483));
  }
  var wa = null, Yn = 0;
  function $u(e) {
    var t = Yn;
    return Yn += 1, wa === null && (wa = []), sr(wa, e, t);
  }
  function Dl(e, t) {
    t = t.props.ref, e.ref = t !== void 0 ? t : null;
  }
  function Fu(e, t) {
    throw t.$$typeof === Z ? Error(r(525)) : (e = Object.prototype.toString.call(t), Error(
      r(
        31,
        e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e
      )
    ));
  }
  function rr(e) {
    function t(g, m) {
      if (e) {
        var S = g.deletions;
        S === null ? (g.deletions = [m], g.flags |= 16) : S.push(m);
      }
    }
    function l(g, m) {
      if (!e) return null;
      for (; m !== null; )
        t(g, m), m = m.sibling;
      return null;
    }
    function a(g) {
      for (var m = /* @__PURE__ */ new Map(); g !== null; )
        g.key === null ? m.set(g.index, g) : m.set(g.key, g), g = g.sibling;
      return m;
    }
    function n(g, m) {
      return g = ml(g, m), g.index = 0, g.sibling = null, g;
    }
    function u(g, m, S) {
      return g.index = S, e ? (S = g.alternate, S !== null ? (S = S.index, S < m ? (g.flags |= 2, m) : S) : (g.flags |= 134217730, m)) : (g.flags |= 1048576, m);
    }
    function i(g) {
      return e && g.alternate === null && (g.flags |= 134217730), g;
    }
    function s(g, m, S, j) {
      return m === null || m.tag !== 6 ? (m = Rc(S, g.mode, j), m.return = g, m) : (m = n(m, S), m.return = g, m);
    }
    function o(g, m, S, j) {
      var K = S.type;
      return K === me ? (g = T(
        g,
        m,
        S.props.children,
        j,
        S.key
      ), Dl(g, S), g) : m !== null && (m.elementType === K || typeof K == "object" && K !== null && K.$$typeof === ye && da(K) === m.type) ? (m = n(m, S.props), Dl(m, S), m.return = g, m) : (m = Gu(
        S.type,
        S.key,
        S.props,
        null,
        g.mode,
        j
      ), Dl(m, S), m.return = g, m);
    }
    function p(g, m, S, j) {
      return m === null || m.tag !== 4 || m.stateNode.containerInfo !== S.containerInfo || m.stateNode.implementation !== S.implementation ? (m = Mc(S, g.mode, j), m.return = g, m) : (m = n(m, S.children || []), m.return = g, m);
    }
    function T(g, m, S, j, K) {
      return m === null || m.tag !== 7 ? (m = ua(
        S,
        g.mode,
        j,
        K
      ), m.return = g, m) : (m = n(m, S), m.return = g, m);
    }
    function A(g, m, S) {
      if (typeof m == "string" && m !== "" || typeof m == "number" || typeof m == "bigint")
        return m = Rc(
          "" + m,
          g.mode,
          S
        ), m.return = g, m;
      if (typeof m == "object" && m !== null) {
        switch (m.$$typeof) {
          case x:
            return S = Gu(
              m.type,
              m.key,
              m.props,
              null,
              g.mode,
              S
            ), Dl(S, m), S.return = g, S;
          case ue:
            return m = Mc(
              m,
              g.mode,
              S
            ), m.return = g, m;
          case ye:
            return m = da(m), A(g, m, S);
        }
        if (ne(m) || te(m))
          return m = ua(
            m,
            g.mode,
            S,
            null
          ), m.return = g, m;
        if (typeof m.then == "function")
          return A(g, $u(m), S);
        if (m.$$typeof === I)
          return A(
            g,
            Vu(g, m),
            S
          );
        Fu(g, m);
      }
      return null;
    }
    function v(g, m, S, j) {
      var K = m !== null ? m.key : null;
      if (typeof S == "string" && S !== "" || typeof S == "number" || typeof S == "bigint")
        return K !== null ? null : s(g, m, "" + S, j);
      if (typeof S == "object" && S !== null) {
        switch (S.$$typeof) {
          case x:
            return S.key === K ? o(g, m, S, j) : null;
          case ue:
            return S.key === K ? p(g, m, S, j) : null;
          case ye:
            return S = da(S), v(g, m, S, j);
        }
        if (ne(S) || te(S))
          return K !== null ? null : T(g, m, S, j, null);
        if (typeof S.then == "function")
          return v(
            g,
            m,
            $u(S),
            j
          );
        if (S.$$typeof === I)
          return v(
            g,
            m,
            Vu(g, S),
            j
          );
        Fu(g, S);
      }
      return null;
    }
    function _(g, m, S, j, K) {
      if (typeof j == "string" && j !== "" || typeof j == "number" || typeof j == "bigint")
        return g = g.get(S) || null, s(m, g, "" + j, K);
      if (typeof j == "object" && j !== null) {
        switch (j.$$typeof) {
          case x:
            return g = g.get(
              j.key === null ? S : j.key
            ) || null, o(m, g, j, K);
          case ue:
            return g = g.get(
              j.key === null ? S : j.key
            ) || null, p(m, g, j, K);
          case ye:
            return j = da(j), _(
              g,
              m,
              S,
              j,
              K
            );
        }
        if (ne(j) || te(j))
          return g = g.get(S) || null, T(m, g, j, K, null);
        if (typeof j.then == "function")
          return _(
            g,
            m,
            S,
            $u(j),
            K
          );
        if (j.$$typeof === I)
          return _(
            g,
            m,
            S,
            Vu(m, j),
            K
          );
        Fu(m, j);
      }
      return null;
    }
    function G(g, m, S, j) {
      for (var K = null, Se = null, le = m, ie = m = 0, Ve = null; le !== null && ie < S.length; ie++) {
        le.index > ie ? (Ve = le, le = null) : Ve = le.sibling;
        var Te = v(
          g,
          le,
          S[ie],
          j
        );
        if (Te === null) {
          le === null && (le = Ve);
          break;
        }
        e && le && Te.alternate === null && t(g, le), m = u(Te, m, ie), Se === null ? K = Te : Se.sibling = Te, Se = Te, le = Ve;
      }
      if (ie === S.length)
        return l(g, le), he && hl(g, ie), K;
      if (le === null) {
        for (; ie < S.length; ie++)
          le = A(g, S[ie], j), le !== null && (m = u(
            le,
            m,
            ie
          ), Se === null ? K = le : Se.sibling = le, Se = le);
        return he && hl(g, ie), K;
      }
      for (le = a(le); ie < S.length; ie++)
        Ve = _(
          le,
          g,
          ie,
          S[ie],
          j
        ), Ve !== null && (e && (Te = Ve.alternate, Te !== null && le.delete(Te.key === null ? ie : Te.key)), m = u(
          Ve,
          m,
          ie
        ), Se === null ? K = Ve : Se.sibling = Ve, Se = Ve);
      return e && le.forEach(function(Il) {
        return t(g, Il);
      }), he && hl(g, ie), K;
    }
    function k(g, m, S, j) {
      if (S == null) throw Error(r(151));
      for (var K = null, Se = null, le = m, ie = m = 0, Ve = null, Te = S.next(); le !== null && !Te.done; ie++, Te = S.next()) {
        le.index > ie ? (Ve = le, le = null) : Ve = le.sibling;
        var Il = v(g, le, Te.value, j);
        if (Il === null) {
          le === null && (le = Ve);
          break;
        }
        e && le && Il.alternate === null && t(g, le), m = u(Il, m, ie), Se === null ? K = Il : Se.sibling = Il, Se = Il, le = Ve;
      }
      if (Te.done)
        return l(g, le), he && hl(g, ie), K;
      if (le === null) {
        for (; !Te.done; ie++, Te = S.next())
          Te = A(g, Te.value, j), Te !== null && (m = u(Te, m, ie), Se === null ? K = Te : Se.sibling = Te, Se = Te);
        return he && hl(g, ie), K;
      }
      for (le = a(le); !Te.done; ie++, Te = S.next())
        Te = _(le, g, ie, Te.value, j), Te !== null && (e && (Ve = Te.alternate, Ve !== null && le.delete(
          Ve.key === null ? ie : Ve.key
        )), m = u(Te, m, ie), Se === null ? K = Te : Se.sibling = Te, Se = Te);
      return e && le.forEach(function(xy) {
        return t(g, xy);
      }), he && hl(g, ie), K;
    }
    function re(g, m, S, j) {
      if (typeof S == "object" && S !== null && S.type === me && S.key === null && S.props.ref === void 0 && (S = S.props.children), typeof S == "object" && S !== null) {
        switch (S.$$typeof) {
          case x:
            e: {
              for (var K = S.key; m !== null; ) {
                if (m.key === K) {
                  if (K = S.type, K === me) {
                    if (m.tag === 7) {
                      l(
                        g,
                        m.sibling
                      ), j = n(
                        m,
                        S.props.children
                      ), Dl(j, S), j.return = g, g = j;
                      break e;
                    }
                  } else if (m.elementType === K || typeof K == "object" && K !== null && K.$$typeof === ye && da(K) === m.type) {
                    l(
                      g,
                      m.sibling
                    ), j = n(m, S.props), Dl(j, S), j.return = g, g = j;
                    break e;
                  }
                  l(g, m);
                  break;
                } else t(g, m);
                m = m.sibling;
              }
              S.type === me ? (j = ua(
                S.props.children,
                g.mode,
                j,
                S.key
              ), Dl(j, S), j.return = g, g = j) : (j = Gu(
                S.type,
                S.key,
                S.props,
                null,
                g.mode,
                j
              ), Dl(j, S), j.return = g, g = j);
            }
            return i(g);
          case ue:
            e: {
              for (K = S.key; m !== null; ) {
                if (m.key === K)
                  if (m.tag === 4 && m.stateNode.containerInfo === S.containerInfo && m.stateNode.implementation === S.implementation) {
                    l(
                      g,
                      m.sibling
                    ), j = n(m, S.children || []), j.return = g, g = j;
                    break e;
                  } else {
                    l(g, m);
                    break;
                  }
                else t(g, m);
                m = m.sibling;
              }
              j = Mc(S, g.mode, j), j.return = g, g = j;
            }
            return i(g);
          case ye:
            return S = da(S), re(
              g,
              m,
              S,
              j
            );
        }
        if (ne(S))
          return G(
            g,
            m,
            S,
            j
          );
        if (te(S)) {
          if (K = te(S), typeof K != "function") throw Error(r(150));
          return S = K.call(S), k(
            g,
            m,
            S,
            j
          );
        }
        if (typeof S.then == "function")
          return re(
            g,
            m,
            $u(S),
            j
          );
        if (S.$$typeof === I)
          return re(
            g,
            m,
            Vu(g, S),
            j
          );
        Fu(g, S);
      }
      return typeof S == "string" && S !== "" || typeof S == "number" || typeof S == "bigint" ? (S = "" + S, m !== null && m.tag === 6 ? (l(g, m.sibling), j = n(m, S), j.return = g, g = j) : (l(g, m), j = Rc(S, g.mode, j), j.return = g, g = j), i(g)) : l(g, m);
    }
    return function(g, m, S, j) {
      try {
        Yn = 0;
        var K = re(
          g,
          m,
          S,
          j
        );
        return wa = null, K;
      } catch (le) {
        if (le === Xa || le === Ju) throw le;
        var Se = vt(29, le, null, g.mode);
        return Se.lanes = j, Se.return = g, Se;
      }
    };
  }
  var ha = rr(!0), dr = rr(!1), Ul = !1;
  function wc(e) {
    e.updateQueue = {
      baseState: e.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function Zc(e, t) {
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
    if (a = a.shared, (je & 2) !== 0) {
      var n = a.pending;
      return n === null ? t.next = t : (t.next = n.next, n.next = t), a.pending = t, t = Yu(e), $o(e, null, l), t;
    }
    return Bu(e, a, t, l), Yu(e);
  }
  function Gn(e, t, l) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (l & 4194048) !== 0)) {
      var a = t.lanes;
      a &= e.pendingLanes, l |= a, t.lanes = l, If(e, l);
    }
  }
  function Lc(e, t) {
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
  var Vc = !1;
  function Qn() {
    if (Vc) {
      var e = Qa;
      if (e !== null) throw e;
    }
  }
  function Xn(e, t, l, a) {
    Vc = !1;
    var n = e.updateQueue;
    Ul = !1;
    var u = n.firstBaseUpdate, i = n.lastBaseUpdate, s = n.shared.pending;
    if (s !== null) {
      n.shared.pending = null;
      var o = s, p = o.next;
      o.next = null, i === null ? u = p : i.next = p, i = o;
      var T = e.alternate;
      T !== null && (T = T.updateQueue, s = T.lastBaseUpdate, s !== i && (s === null ? T.firstBaseUpdate = p : s.next = p, T.lastBaseUpdate = o));
    }
    if (u !== null) {
      var A = n.baseState;
      i = 0, T = p = o = null, s = u;
      do {
        var v = s.lane & -536870913, _ = v !== s.lane;
        if (_ ? (be & v) === v : (a & v) === v) {
          v !== 0 && v === oa && (Vc = !0), T !== null && (T = T.next = {
            lane: 0,
            tag: s.tag,
            payload: s.payload,
            callback: null,
            next: null
          });
          e: {
            var G = e, k = s;
            v = t;
            var re = l;
            switch (k.tag) {
              case 1:
                if (G = k.payload, typeof G == "function") {
                  A = G.call(re, A, v);
                  break e;
                }
                A = G;
                break e;
              case 3:
                G.flags = G.flags & -65537 | 128;
              case 0:
                if (G = k.payload, v = typeof G == "function" ? G.call(re, A, v) : G, v == null) break e;
                A = w({}, A, v);
                break e;
              case 2:
                Ul = !0;
            }
          }
          v = s.callback, v !== null && (e.flags |= 64, _ && (e.flags |= 8192), _ = n.callbacks, _ === null ? n.callbacks = [v] : _.push(v));
        } else
          _ = {
            lane: v,
            tag: s.tag,
            payload: s.payload,
            callback: s.callback,
            next: null
          }, T === null ? (p = T = _, o = A) : T = T.next = _, i |= v;
        if (s = s.next, s === null) {
          if (s = n.shared.pending, s === null)
            break;
          _ = s, s = _.next, _.next = null, n.lastBaseUpdate = _, n.shared.pending = null;
        }
      } while (!0);
      T === null && (o = A), n.baseState = o, n.firstBaseUpdate = p, n.lastBaseUpdate = T, u === null && (n.shared.lanes = 0), Zl |= i, e.lanes = i, e.memoizedState = A;
    }
  }
  function mr(e, t) {
    if (typeof e != "function")
      throw Error(r(191, e));
    e.call(t);
  }
  function hr(e, t) {
    var l = e.callbacks;
    if (l !== null)
      for (e.callbacks = null, e = 0; e < l.length; e++)
        mr(l[e], t);
  }
  var Bl = $t(null), Wu = $t(0);
  function vr(e, t) {
    e = _l, Ue(Wu, e), Ue(Bl, t), _l = e | t.baseLanes;
  }
  function Kc() {
    Ue(Wu, _l), Ue(Bl, Bl.current);
  }
  function Jc() {
    _l = Wu.current, Pe(Bl), Pe(Wu);
  }
  var lt = $t(null), st = null;
  function Yl(e) {
    var t = e.alternate;
    Ue(at, at.current & 1), Ue(lt, e), st === null && (t === null || Bl.current !== null || t.memoizedState !== null) && (st = e);
  }
  function kc(e) {
    Ue(at, at.current), Ue(lt, e), st === null && (st = e);
  }
  function yr(e) {
    e.tag === 22 ? (Ue(at, at.current), Ue(lt, e), st === null && (st = e)) : Gl();
  }
  function Gl() {
    Ue(at, at.current), Ue(lt, lt.current);
  }
  function jt(e) {
    Pe(lt), st === e && (st = null), Pe(at);
  }
  var at = $t(0);
  function wn(e, t) {
    Ue(lt, lt.current), Ue(at, t);
  }
  function $c(e) {
    Pe(at), Pe(lt), st === e && (st = null);
  }
  function Iu(e) {
    for (var t = e; t !== null; ) {
      if (t.tag === 13) {
        var l = t.memoizedState;
        if (l !== null && (l = l.dehydrated, l === null || pf(l) || bf(l)))
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
  var gl = 0, oe = null, Me = null, Ze = null, Pu = !1, Za = !1, va = !1, ei = 0, Zn = 0, La = null, Kv = 0;
  function Ge() {
    throw Error(r(321));
  }
  function Fc(e, t) {
    if (t === null) return !1;
    for (var l = 0; l < t.length && l < e.length; l++)
      if (!xt(e[l], t[l])) return !1;
    return !0;
  }
  function Wc(e, t, l, a, n, u) {
    return gl = u, oe = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, Q.H = e === null || e.memoizedState === null ? Pr : ed, va = !1, u = l(a, n), va = !1, Za && (u = pr(
      t,
      l,
      a,
      n
    )), gr(e), u;
  }
  function gr(e) {
    Q.H = ci;
    var t = Me !== null && Me.next !== null;
    if (gl = 0, Ze = Me = oe = null, Pu = !1, Zn = 0, La = null, t) throw Error(r(300));
    e === null || Le || (e = e.dependencies, e !== null && Lu(e) && (Le = !0));
  }
  function pr(e, t, l, a) {
    oe = e;
    var n = 0;
    do {
      if (Za && (La = null), Zn = 0, Za = !1, 25 <= n) throw Error(r(301));
      if (n += 1, Ze = Me = null, e.updateQueue != null) {
        var u = e.updateQueue;
        u.lastEffect = null, u.events = null, u.stores = null, u.memoCache != null && (u.memoCache.index = 0);
      }
      Q.H = e0, u = t(l, a);
    } while (Za);
    return u;
  }
  function Jv() {
    var e = Q.H, t = e.useState()[0];
    return t = typeof t.then == "function" ? Ln(t) : t, e = e.useState()[0], (Me !== null ? Me.memoizedState : null) !== e && (oe.flags |= 1024), t;
  }
  function Ic() {
    var e = ei !== 0;
    return ei = 0, e;
  }
  function Pc(e, t, l) {
    t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l;
  }
  function es(e) {
    if (Pu) {
      for (e = e.memoizedState; e !== null; ) {
        var t = e.queue;
        t !== null && (t.pending = null), e = e.next;
      }
      Pu = !1;
    }
    gl = 0, Ze = Me = oe = null, Za = !1, Zn = ei = 0, La = null;
  }
  function ot() {
    var e = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return Ze === null ? oe.memoizedState = Ze = e : Ze = Ze.next = e, Ze;
  }
  function Xe() {
    if (Me === null) {
      var e = oe.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = Me.next;
    var t = Ze === null ? oe.memoizedState : Ze.next;
    if (t !== null)
      Ze = t, Me = e;
    else {
      if (e === null)
        throw oe.alternate === null ? Error(r(467)) : Error(r(310));
      Me = e, e = {
        memoizedState: Me.memoizedState,
        baseState: Me.baseState,
        baseQueue: Me.baseQueue,
        queue: Me.queue,
        next: null
      }, Ze === null ? oe.memoizedState = Ze = e : Ze = Ze.next = e;
    }
    return Ze;
  }
  function ti() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function Ln(e) {
    var t = Zn;
    return Zn += 1, La === null && (La = []), e = sr(La, e, t), t = oe, (Ze === null ? t.memoizedState : Ze.next) === null && (t = t.alternate, Q.H = t === null || t.memoizedState === null ? Pr : ed), e;
  }
  function li(e) {
    if (e !== null && typeof e == "object") {
      if (typeof e.then == "function") return Ln(e);
      if (e.$$typeof === M) return;
      if (e.$$typeof === I) return tt(e);
    }
    throw Error(r(438, String(e)));
  }
  function ts(e) {
    var t = null, l = oe.updateQueue;
    if (l !== null && (t = l.memoCache), t == null) {
      var a = oe.alternate;
      a !== null && (a = a.updateQueue, a !== null && (a = a.memoCache, a != null && (t = {
        data: a.data.map(function(n) {
          return n.slice();
        }),
        index: 0
      })));
    }
    if (t == null && (t = { data: [], index: 0 }), l === null && (l = ti(), oe.updateQueue = l), l.memoCache = t, l = t.data[t.index], l === void 0)
      for (l = t.data[t.index] = Array(e), a = 0; a < e; a++)
        l[a] = ke;
    return t.index++, l;
  }
  function pl(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function ai(e) {
    var t = Xe();
    return ls(t, Me, e);
  }
  function ls(e, t, l) {
    var a = e.queue;
    if (a === null) throw Error(r(311));
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
      var s = i = null, o = null, p = t, T = !1;
      do {
        var A = p.lane & -536870913;
        if (A !== p.lane ? (be & A) === A : (gl & A) === A) {
          var v = p.revertLane;
          if (v === 0)
            o !== null && (o = o.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: p.action,
              hasEagerState: p.hasEagerState,
              eagerState: p.eagerState,
              next: null
            }), A === oa && (T = !0);
          else if ((gl & v) === v) {
            p = p.next, v === oa && (T = !0);
            continue;
          } else
            A = {
              lane: 0,
              revertLane: p.revertLane,
              gesture: null,
              action: p.action,
              hasEagerState: p.hasEagerState,
              eagerState: p.eagerState,
              next: null
            }, o === null ? (s = o = A, i = u) : o = o.next = A, oe.lanes |= v, Zl |= v;
          A = p.action, va && l(u, A), u = p.hasEagerState ? p.eagerState : l(u, A);
        } else
          v = {
            lane: A,
            revertLane: p.revertLane,
            gesture: p.gesture,
            action: p.action,
            hasEagerState: p.hasEagerState,
            eagerState: p.eagerState,
            next: null
          }, o === null ? (s = o = v, i = u) : o = o.next = v, oe.lanes |= A, Zl |= A;
        p = p.next;
      } while (p !== null && p !== t);
      if (o === null ? i = u : o.next = s, !xt(u, e.memoizedState) && (Le = !0, T && (l = Qa, l !== null)))
        throw l;
      e.memoizedState = u, e.baseState = i, e.baseQueue = o, a.lastRenderedState = u;
    }
    return n === null && (a.lanes = 0), [e.memoizedState, a.dispatch];
  }
  function as(e) {
    var t = Xe(), l = t.queue;
    if (l === null) throw Error(r(311));
    l.lastRenderedReducer = e;
    var a = l.dispatch, n = l.pending, u = t.memoizedState;
    if (n !== null) {
      l.pending = null;
      var i = n = n.next;
      do
        u = e(u, i.action), i = i.next;
      while (i !== n);
      xt(u, t.memoizedState) || (Le = !0), t.memoizedState = u, t.baseQueue === null && (t.baseState = u), l.lastRenderedState = u;
    }
    return [u, a];
  }
  function br(e, t, l) {
    var a = oe, n = Xe(), u = he;
    if (u) {
      if (l === void 0) throw Error(r(407));
      l = l();
    } else l = t();
    var i = !xt(
      (Me || n).memoizedState,
      l
    );
    if (i && (n.memoizedState = l, Le = !0), n = n.queue, is(Tr.bind(null, a, n, e), [
      e
    ]), e = n.getSnapshot !== t || i || Ze !== null && (Ze.memoizedState.tag & 1) !== 0, Va(
      e ? 9 : 8,
      { destroy: void 0 },
      _r.bind(null, a, n, l, t),
      null
    ), e) {
      if (a.flags |= 2048, De === null) throw Error(r(349));
      u || (gl & 127) !== 0 || Sr(a, t, l);
    }
    return l;
  }
  function Sr(e, t, l) {
    e.flags |= 16384, e = { getSnapshot: t, value: l }, t = oe.updateQueue, t === null ? (t = ti(), oe.updateQueue = t, t.stores = [e]) : (l = t.stores, l === null ? t.stores = [e] : l.push(e));
  }
  function _r(e, t, l, a) {
    t.value = l, t.getSnapshot = a, Er(t) && Nr(e);
  }
  function Tr(e, t, l) {
    return l(function() {
      Er(t) && Nr(e);
    });
  }
  function Er(e) {
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
    t !== null && bt(t, e, 2);
  }
  function ns(e) {
    var t = ot();
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
  function xr(e, t, l, a) {
    return e.baseState = l, ls(
      e,
      Me,
      typeof a == "function" ? a : pl
    );
  }
  function kv(e, t, l, a, n) {
    if (ii(e)) throw Error(r(485));
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
      Q.T !== null ? l(!0) : u.isTransition = !1, a(u), l = t.pending, l === null ? (u.next = t.pending = u, jr(t, u)) : (u.next = l.next, t.pending = l.next = u);
    }
  }
  function jr(e, t) {
    var l = t.action, a = t.payload, n = e.state;
    if (t.isTransition) {
      var u = Q.T, i = {};
      i.types = u !== null ? u.types : null, Q.T = i;
      try {
        var s = l(n, a), o = Q.S;
        o !== null && o(i, s), Ar(e, t, s);
      } catch (p) {
        us(e, t, p);
      } finally {
        u !== null && i.types !== null && (u.types = i.types), Q.T = u;
      }
    } else
      try {
        u = l(n, a), Ar(e, t, u);
      } catch (p) {
        us(e, t, p);
      }
  }
  function Ar(e, t, l) {
    l !== null && typeof l == "object" && typeof l.then == "function" ? l.then(
      function(a) {
        zr(e, t, a);
      },
      function(a) {
        return us(e, t, a);
      }
    ) : zr(e, t, l);
  }
  function zr(e, t, l) {
    t.status = "fulfilled", t.value = l, Cr(t), e.state = l, t = e.pending, t !== null && (l = t.next, l === t ? e.pending = null : (l = l.next, t.next = l, jr(e, l)));
  }
  function us(e, t, l) {
    var a = e.pending;
    if (e.pending = null, a !== null) {
      a = a.next;
      do
        t.status = "rejected", t.reason = l, Cr(t), t = t.next;
      while (t !== a);
    }
    e.action = null;
  }
  function Cr(e) {
    e = e.listeners;
    for (var t = 0; t < e.length; t++) (0, e[t])();
  }
  function Or(e, t) {
    return t;
  }
  function Rr(e, t) {
    if (he) {
      var l = De.formState;
      if (l !== null) {
        e: {
          var a = oe;
          if (he) {
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
    return l = ot(), l.memoizedState = l.baseState = t, a = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Or,
      lastRenderedState: t
    }, l.queue = a, l = Fr.bind(
      null,
      oe,
      a
    ), a.dispatch = l, a = ns(!1), u = rs.bind(
      null,
      oe,
      !1,
      a.queue
    ), a = ot(), n = {
      state: t,
      dispatch: null,
      action: e,
      pending: null
    }, a.queue = n, l = kv.bind(
      null,
      oe,
      n,
      u,
      l
    ), n.dispatch = l, a.memoizedState = e, [t, l, !1];
  }
  function Mr(e) {
    var t = Xe();
    return Dr(t, Me, e);
  }
  function Dr(e, t, l) {
    if (t = ls(
      e,
      t,
      Or
    )[0], e = ai(pl)[0], typeof t == "object" && t !== null && typeof t.then == "function")
      try {
        var a = Ln(t);
      } catch (i) {
        throw i === Xa ? Ju : i;
      }
    else a = t;
    t = Xe();
    var n = t.queue, u = n.dispatch;
    return l !== t.memoizedState && (oe.flags |= 2048, Va(
      9,
      { destroy: void 0 },
      $v.bind(null, n, l),
      null
    )), [a, u, e];
  }
  function $v(e, t) {
    e.action = t;
  }
  function Ur(e) {
    var t = Xe(), l = Me;
    if (l !== null)
      return Dr(t, l, e);
    Xe(), t = t.memoizedState, l = Xe();
    var a = l.queue.dispatch;
    return l.memoizedState = e, [t, a, !1];
  }
  function Va(e, t, l, a) {
    return e = { tag: e, create: l, deps: a, inst: t, next: null }, t = oe.updateQueue, t === null && (t = ti(), oe.updateQueue = t), l = t.lastEffect, l === null ? t.lastEffect = e.next = e : (a = l.next, l.next = e, e.next = a, t.lastEffect = e), e;
  }
  function qr() {
    return Xe().memoizedState;
  }
  function ni(e, t, l, a) {
    var n = ot();
    oe.flags |= e, n.memoizedState = Va(
      1 | t,
      { destroy: void 0 },
      l,
      a === void 0 ? null : a
    );
  }
  function ui(e, t, l, a) {
    var n = Xe();
    a = a === void 0 ? null : a;
    var u = n.memoizedState.inst;
    Me !== null && a !== null && Fc(a, Me.memoizedState.deps) ? n.memoizedState = Va(t, u, l, a) : (oe.flags |= e, n.memoizedState = Va(
      1 | t,
      u,
      l,
      a
    ));
  }
  function Hr(e, t) {
    ni(8390656, 8, e, t);
  }
  function is(e, t) {
    ui(2048, 8, e, t);
  }
  function Fv(e) {
    oe.flags |= 4;
    var t = oe.updateQueue;
    if (t === null)
      t = ti(), oe.updateQueue = t, t.events = [e];
    else {
      var l = t.events;
      l === null ? t.events = [e] : l.push(e);
    }
  }
  function Br(e) {
    var t = Xe().memoizedState;
    return Fv({ ref: t, nextImpl: e }), function() {
      if ((je & 2) !== 0) throw Error(r(440));
      return t.impl.apply(void 0, arguments);
    };
  }
  function Yr(e, t) {
    return ui(4, 2, e, t);
  }
  function Gr(e, t) {
    return ui(4, 4, e, t);
  }
  function Qr(e, t) {
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
  function Xr(e, t, l) {
    l = l != null ? l.concat([e]) : null, ui(4, 4, Qr.bind(null, t, e), l);
  }
  function cs() {
  }
  function wr(e, t) {
    var l = Xe();
    t = t === void 0 ? null : t;
    var a = l.memoizedState;
    return t !== null && Fc(t, a[1]) ? a[0] : (l.memoizedState = [e, t], e);
  }
  function Zr(e, t) {
    var l = Xe();
    t = t === void 0 ? null : t;
    var a = l.memoizedState;
    if (t !== null && Fc(t, a[1]))
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
  function ss(e, t, l) {
    return l === void 0 || (gl & 1073741824) !== 0 && (be & 261930) === 0 ? e.memoizedState = t : (e.memoizedState = l, e = Pd(), oe.lanes |= e, Zl |= e, l);
  }
  function Lr(e, t, l, a) {
    return xt(l, t) ? l : Bl.current !== null ? (e = ss(e, l, a), xt(e, t) || (Le = !0), e) : (gl & 106) === 0 || (gl & 1073741824) !== 0 && (be & 261930) === 0 ? (Le = !0, e.memoizedState = l) : (e = Pd(), oe.lanes |= e, Zl |= e, t);
  }
  function Vr(e, t, l, a, n) {
    var u = ae.p;
    ae.p = u !== 0 && 8 > u ? u : 8;
    var i = Q.T, s = {};
    s.types = i !== null ? i.types : null, Q.T = s, rs(e, !1, t, l);
    try {
      var o = n(), p = Q.S;
      if (p !== null && p(s, o), o !== null && typeof o == "object" && typeof o.then == "function") {
        var T = Vv(
          o,
          a
        );
        Vn(
          e,
          t,
          T,
          Ot(e)
        );
      } else
        Vn(
          e,
          t,
          a,
          Ot(e)
        );
    } catch (A) {
      Vn(
        e,
        t,
        { then: function() {
        }, status: "rejected", reason: A },
        Ot()
      );
    } finally {
      ae.p = u, i !== null && s.types !== null && (i.types = s.types), Q.T = i;
    }
  }
  function Wv() {
  }
  function fs(e, t, l, a) {
    if (e.tag !== 5) throw Error(r(476));
    var n = Kr(e).queue;
    Vr(
      e,
      n,
      t,
      mt,
      l === null ? Wv : function() {
        return Jr(e), l(a);
      }
    );
  }
  function Kr(e) {
    var t = e.memoizedState;
    if (t !== null) return t;
    t = {
      memoizedState: mt,
      baseState: mt,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: pl,
        lastRenderedState: mt
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
  function Jr(e) {
    var t = Kr(e);
    t.next === null && (t = e.alternate.memoizedState), Vn(
      e,
      t.next.queue,
      {},
      Ot()
    );
  }
  function os() {
    return tt(rn);
  }
  function kr() {
    return Xe().memoizedState;
  }
  function $r() {
    return Xe().memoizedState;
  }
  function Iv(e) {
    for (var t = e.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var l = Ot();
          e = ql(l);
          var a = Hl(t, e, l);
          a !== null && (bt(a, t, l), Gn(a, t, l)), t = { cache: Yc() }, e.payload = t;
          return;
      }
      t = t.return;
    }
  }
  function Pv(e, t, l) {
    var a = Ot();
    l = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, ii(e) ? Wr(t, l) : (l = Cc(e, t, l, a), l !== null && (bt(l, e, a), Ir(l, t, a)));
  }
  function Fr(e, t, l) {
    var a = Ot();
    Vn(e, t, l, a);
  }
  function Vn(e, t, l, a) {
    var n = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (ii(e)) Wr(t, n);
    else {
      var u = e.alternate;
      if (e.lanes === 0 && (u === null || u.lanes === 0) && (u = t.lastRenderedReducer, u !== null))
        try {
          var i = t.lastRenderedState, s = u(i, l);
          if (n.hasEagerState = !0, n.eagerState = s, xt(s, i))
            return Bu(e, t, n, 0), De === null && Hu(), !1;
        } catch {
        }
      if (l = Cc(e, t, n, a), l !== null)
        return bt(l, e, a), Ir(l, t, a), !0;
    }
    return !1;
  }
  function rs(e, t, l, a) {
    if (a = {
      lane: 2,
      revertLane: tf(),
      gesture: null,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, ii(e)) {
      if (t) throw Error(r(479));
    } else
      t = Cc(
        e,
        l,
        a,
        2
      ), t !== null && bt(t, e, 2);
  }
  function ii(e) {
    var t = e.alternate;
    return e === oe || t !== null && t === oe;
  }
  function Wr(e, t) {
    Za = Pu = !0;
    var l = e.pending;
    l === null ? t.next = t : (t.next = l.next, l.next = t), e.pending = t;
  }
  function Ir(e, t, l) {
    if ((l & 4194048) !== 0) {
      var a = t.lanes;
      a &= e.pendingLanes, l |= a, t.lanes = l, If(e, l);
    }
  }
  var ci = {
    readContext: tt,
    use: li,
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
  }, Pr = {
    readContext: tt,
    use: li,
    useCallback: function(e, t) {
      return ot().memoizedState = [
        e,
        t === void 0 ? null : t
      ], e;
    },
    useContext: tt,
    useEffect: Hr,
    useImperativeHandle: function(e, t, l) {
      l = l != null ? l.concat([e]) : null, ni(
        4194308,
        4,
        Qr.bind(null, t, e),
        l
      );
    },
    useLayoutEffect: function(e, t) {
      return ni(4194308, 4, e, t);
    },
    useInsertionEffect: function(e, t) {
      ni(4, 2, e, t);
    },
    useMemo: function(e, t) {
      var l = ot();
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
      var a = ot();
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
      }, a.queue = e, e = e.dispatch = Pv.bind(
        null,
        oe,
        e
      ), [a.memoizedState, e];
    },
    useRef: function(e) {
      var t = ot();
      return e = { current: e }, t.memoizedState = e;
    },
    useState: function(e) {
      e = ns(e);
      var t = e.queue, l = Fr.bind(null, oe, t);
      return t.dispatch = l, [e.memoizedState, l];
    },
    useDebugValue: cs,
    useDeferredValue: function(e, t) {
      var l = ot();
      return ss(l, e, t);
    },
    useTransition: function() {
      var e = ns(!1);
      return e = Vr.bind(
        null,
        oe,
        e.queue,
        !0,
        !1
      ), ot().memoizedState = e, [!1, e];
    },
    useSyncExternalStore: function(e, t, l) {
      var a = oe, n = ot();
      if (he) {
        if (l === void 0)
          throw Error(r(407));
        l = l();
      } else {
        if (l = t(), De === null)
          throw Error(r(349));
        (be & 127) !== 0 || Sr(a, t, l);
      }
      n.memoizedState = l;
      var u = { value: l, getSnapshot: t };
      return n.queue = u, Hr(Tr.bind(null, a, u, e), [
        e
      ]), a.flags |= 2048, Va(
        9,
        { destroy: void 0 },
        _r.bind(
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
      var e = ot(), t = De.identifierPrefix;
      if (he) {
        var l = Pt, a = It;
        l = (a & ~(1 << 32 - Et(a) - 1)).toString(32) + l, t = "_" + t + "R_" + l, l = ei++, 0 < l && (t += "H" + l.toString(32)), t += "_";
      } else
        l = Kv++, t = "_" + t + "r_" + l.toString(32) + "_";
      return e.memoizedState = t;
    },
    useHostTransitionStatus: os,
    useFormState: Rr,
    useActionState: Rr,
    useOptimistic: function(e) {
      var t = ot();
      t.memoizedState = t.baseState = e;
      var l = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return t.queue = l, t = rs.bind(
        null,
        oe,
        !0,
        l
      ), l.dispatch = t, [e, t];
    },
    useMemoCache: ts,
    useCacheRefresh: function() {
      return ot().memoizedState = Iv.bind(
        null,
        oe
      );
    },
    useEffectEvent: function(e) {
      var t = ot(), l = { impl: e };
      return t.memoizedState = l, function() {
        if ((je & 2) !== 0)
          throw Error(r(440));
        return l.impl.apply(void 0, arguments);
      };
    }
  }, ed = {
    readContext: tt,
    use: li,
    useCallback: wr,
    useContext: tt,
    useEffect: is,
    useImperativeHandle: Xr,
    useInsertionEffect: Yr,
    useLayoutEffect: Gr,
    useMemo: Zr,
    useReducer: ai,
    useRef: qr,
    useState: function() {
      return ai(pl);
    },
    useDebugValue: cs,
    useDeferredValue: function(e, t) {
      var l = Xe();
      return Lr(
        l,
        Me.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = ai(pl)[0], t = Xe().memoizedState;
      return [
        typeof e == "boolean" ? e : Ln(e),
        t
      ];
    },
    useSyncExternalStore: br,
    useId: kr,
    useHostTransitionStatus: os,
    useFormState: Mr,
    useActionState: Mr,
    useOptimistic: function(e, t) {
      var l = Xe();
      return xr(l, Me, e, t);
    },
    useMemoCache: ts,
    useCacheRefresh: $r,
    useEffectEvent: Br
  }, e0 = {
    readContext: tt,
    use: li,
    useCallback: wr,
    useContext: tt,
    useEffect: is,
    useImperativeHandle: Xr,
    useInsertionEffect: Yr,
    useLayoutEffect: Gr,
    useMemo: Zr,
    useReducer: as,
    useRef: qr,
    useState: function() {
      return as(pl);
    },
    useDebugValue: cs,
    useDeferredValue: function(e, t) {
      var l = Xe();
      return Me === null ? ss(l, e, t) : Lr(
        l,
        Me.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = as(pl)[0], t = Xe().memoizedState;
      return [
        typeof e == "boolean" ? e : Ln(e),
        t
      ];
    },
    useSyncExternalStore: br,
    useId: kr,
    useHostTransitionStatus: os,
    useFormState: Ur,
    useActionState: Ur,
    useOptimistic: function(e, t) {
      var l = Xe();
      return Me !== null ? xr(l, Me, e, t) : (l.baseState = e, [e, l.queue.dispatch]);
    },
    useMemoCache: ts,
    useCacheRefresh: $r,
    useEffectEvent: Br
  };
  function ds(e, t, l, a) {
    t = e.memoizedState, l = l(a, t), l = l == null ? t : w({}, t, l), e.memoizedState = l, e.lanes === 0 && (e.updateQueue.baseState = l);
  }
  var ms = {
    enqueueSetState: function(e, t, l) {
      e = e._reactInternals;
      var a = Ot(), n = ql(a);
      n.payload = t, l != null && (n.callback = l), t = Hl(e, n, a), t !== null && (bt(t, e, a), Gn(t, e, a));
    },
    enqueueReplaceState: function(e, t, l) {
      e = e._reactInternals;
      var a = Ot(), n = ql(a);
      n.tag = 1, n.payload = t, l != null && (n.callback = l), t = Hl(e, n, a), t !== null && (bt(t, e, a), Gn(t, e, a));
    },
    enqueueForceUpdate: function(e, t) {
      e = e._reactInternals;
      var l = Ot(), a = ql(l);
      a.tag = 2, t != null && (a.callback = t), t = Hl(e, a, l), t !== null && (bt(t, e, l), Gn(t, e, l));
    }
  };
  function td(e, t, l, a, n, u, i) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(a, u, i) : t.prototype && t.prototype.isPureReactComponent ? !Rn(l, a) || !Rn(n, u) : !0;
  }
  function ld(e, t, l, a) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(l, a), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(l, a), t.state !== e && ms.enqueueReplaceState(t, t.state, null);
  }
  function ya(e, t) {
    var l = t;
    if ("ref" in t) {
      l = {};
      for (var a in t)
        a !== "ref" && (l[a] = t[a]);
    }
    if (e = e.defaultProps) {
      l === t && (l = w({}, l));
      for (var n in e)
        l[n] === void 0 && (l[n] = e[n]);
    }
    return l;
  }
  function ad(e) {
    qu(e);
  }
  function nd(e) {
    console.error(e);
  }
  function ud(e) {
    qu(e);
  }
  function si(e, t) {
    try {
      var l = e.onUncaughtError;
      l(t.value, { componentStack: t.stack });
    } catch (a) {
      setTimeout(function() {
        throw a;
      });
    }
  }
  function id(e, t, l) {
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
  function hs(e, t, l) {
    return l = ql(l), l.tag = 3, l.payload = { element: null }, l.callback = function() {
      si(e, t);
    }, l;
  }
  function cd(e) {
    return e = ql(e), e.tag = 3, e;
  }
  function sd(e, t, l, a) {
    var n = l.type.getDerivedStateFromError;
    if (typeof n == "function") {
      var u = a.value;
      e.payload = function() {
        return n(u);
      }, e.callback = function() {
        id(t, l, a);
      };
    }
    var i = l.stateNode;
    i !== null && typeof i.componentDidCatch == "function" && (e.callback = function() {
      id(t, l, a), typeof n != "function" && (Ll === null ? Ll = /* @__PURE__ */ new Set([this]) : Ll.add(this));
      var s = a.stack;
      this.componentDidCatch(a.value, {
        componentStack: s !== null ? s : ""
      });
    });
  }
  function t0(e, t, l, a, n) {
    if (l.flags |= 32768, a !== null && typeof a == "object" && typeof a.then == "function") {
      if (t = l.alternate, t !== null && sa(
        t,
        l,
        n,
        !0
      ), l = lt.current, l !== null) {
        switch (l.tag) {
          case 31:
          case 13:
          case 19:
            return st === null ? Ci() : l.alternate === null && Qe === 0 && (Qe = 3), l.flags &= -257, l.flags |= 65536, l.lanes = n, a === ku ? l.flags |= 16384 : (t = l.updateQueue, t === null ? l.updateQueue = /* @__PURE__ */ new Set([a]) : t.add(a), Is(e, a, n)), !1;
          case 22:
            return l.flags |= 65536, a === ku ? l.flags |= 16384 : (t = l.updateQueue, t === null ? (t = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([a])
            }, l.updateQueue = t) : (l = t.retryQueue, l === null ? t.retryQueue = /* @__PURE__ */ new Set([a]) : l.add(a)), Is(e, a, n)), !1;
        }
        throw Error(r(435, l.tag));
      }
      return Is(e, a, n), Ci(), !1;
    }
    if (he)
      return t = lt.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = n, a !== Uc && (e = Error(r(422), { cause: a }), Un(Ut(e, l)))) : (a !== Uc && (t = Error(r(423), {
        cause: a
      }), Un(
        Ut(t, l)
      )), e = e.current.alternate, e.flags |= 65536, n &= -n, e.lanes |= n, a = Ut(a, l), n = hs(
        e.stateNode,
        a,
        n
      ), Lc(e, n), Qe !== 4 && (Qe = 2)), !1;
    var u = Error(r(520), { cause: a });
    if (u = Ut(u, l), Pn === null ? Pn = [u] : Pn.push(u), Qe !== 4 && (Qe = 2), t === null) return !0;
    a = Ut(a, l), l = t;
    do {
      switch (l.tag) {
        case 3:
          return l.flags |= 65536, e = n & -n, l.lanes |= e, e = hs(l.stateNode, a, e), Lc(l, e), !1;
        case 1:
          if (t = l.type, u = l.stateNode, (l.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || u !== null && typeof u.componentDidCatch == "function" && (Ll === null || !Ll.has(u))))
            return l.flags |= 65536, n &= -n, l.lanes |= n, n = cd(n), sd(
              n,
              e,
              l,
              a
            ), Lc(l, n), !1;
          break;
        case 22:
          if (l.memoizedState !== null)
            return l.flags |= 65536, !1;
      }
      l = l.return;
    } while (l !== null);
    return !1;
  }
  var vs = Error(r(461)), Le = !1;
  function Je(e, t, l, a) {
    t.child = e === null ? dr(t, null, l, a) : ha(
      t,
      e.child,
      l,
      a
    );
  }
  function fd(e, t, l, a, n) {
    l = l.render;
    var u = t.ref;
    if ("ref" in a) {
      var i = {};
      for (var s in a)
        s !== "ref" && (i[s] = a[s]);
    } else i = a;
    return fa(t), a = Wc(
      e,
      t,
      l,
      i,
      u,
      n
    ), s = Ic(), e !== null && !Le ? (Pc(e, t, n), bl(e, t, n)) : (he && s && Xu(t), t.flags |= 1, Je(e, t, a, n), t.child);
  }
  function od(e, t, l, a, n) {
    if (e === null) {
      var u = l.type;
      return typeof u == "function" && !Oc(u) && u.defaultProps === void 0 && l.compare === null ? (t.tag = 15, t.type = u, rd(
        e,
        t,
        u,
        a,
        n
      )) : (e = Gu(
        l.type,
        null,
        a,
        t,
        t.mode,
        n
      ), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (u = e.child, !Es(e, n)) {
      var i = u.memoizedProps;
      if (l = l.compare, l = l !== null ? l : Rn, l(i, a) && e.ref === t.ref)
        return bl(e, t, n);
    }
    return t.flags |= 1, e = ml(u, a), e.ref = t.ref, e.return = t, t.child = e;
  }
  function rd(e, t, l, a, n) {
    if (e !== null) {
      var u = e.memoizedProps;
      if (Rn(u, a) && e.ref === t.ref)
        if (Le = !1, t.pendingProps = a = u, Es(e, n))
          (e.flags & 131072) !== 0 && (Le = !0);
        else
          return t.lanes = e.lanes, bl(e, t, n);
    }
    return ys(
      e,
      t,
      l,
      a,
      n
    );
  }
  function dd(e, t, l, a) {
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
        return md(
          e,
          t,
          u,
          l,
          a
        );
      }
      if ((l & 536870912) !== 0)
        t.memoizedState = { baseLanes: 0, cachePool: null }, e !== null && Ku(
          t,
          u !== null ? u.cachePool : null
        ), u !== null ? vr(t, u) : Kc(), yr(t);
      else
        return a = t.lanes = 536870912, md(
          e,
          t,
          u !== null ? u.baseLanes | l : l,
          l,
          a
        );
    } else
      u !== null ? (Ku(t, u.cachePool), vr(t, u), Gl(), t.memoizedState = null) : (e !== null && Ku(t, null), Kc(), Gl());
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
  function md(e, t, l, a, n) {
    var u = Qc();
    return u = u === null ? null : { parent: we._currentValue, pool: u }, t.memoizedState = {
      baseLanes: l,
      cachePool: u
    }, e !== null && Ku(t, null), Kc(), yr(t), e !== null && sa(e, t, a, !0), t.childLanes = n, null;
  }
  function fi(e, t) {
    return t = oi(
      { mode: t.mode, children: t.children },
      e.mode
    ), t.ref = e.ref, e.child = t, t.return = e, t;
  }
  function hd(e, t, l) {
    return ha(t, e.child, null, l), e = fi(t, t.pendingProps), e.flags |= 2, jt(t), t.memoizedState = null, e;
  }
  function l0(e, t, l) {
    var a = t.pendingProps, n = (t.flags & 128) !== 0;
    if (t.flags &= -129, e === null) {
      if (he) {
        if (a.mode === "hidden")
          return e = fi(t, a), t.lanes = 536870912, e.memoizedState = { baseLanes: 0, cachePool: null }, Kn(null, e);
        if (kc(t), (e = qe) ? (e = Qm(
          e,
          Bt
        ), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
          dehydrated: e,
          treeContext: Cl !== null ? { id: It, overflow: Pt } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, l = Wo(e), l.return = t, t.child = l, Fe = t, qe = null)) : e = null, e === null) throw Rl(t);
        return t.lanes = 536870912, null;
      }
      return fi(t, a);
    }
    var u = e.memoizedState;
    if (u !== null) {
      var i = u.dehydrated;
      if (kc(t), n)
        if (t.flags & 256)
          t.flags &= -257, t = hd(
            e,
            t,
            l
          );
        else if (t.memoizedState !== null)
          t.child = e.child, t.flags |= 128, t = null;
        else throw Error(r(558));
      else if (Le || sa(e, t, l, !1), n = (l & e.childLanes) !== 0, Le || n) {
        if (Bl.current === null) {
          if (a = De, a !== null && (i = Pf(a, l), i !== 0 && i !== u.retryLane))
            throw u.retryLane = i, na(e, i), bt(a, e, i), vs;
          Ci();
        }
        t = hd(
          e,
          t,
          l
        );
      } else
        e = u.treeContext, qe = Gt(i.nextSibling), Fe = t, he = !0, Ol = null, Bt = !1, e !== null && er(t, e), t = fi(t, a), t.flags |= 134221824;
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
        throw Error(r(284));
      (e === null || e.ref !== l) && (t.flags |= 4194816);
    }
  }
  function ys(e, t, l, a, n) {
    return fa(t), l = Wc(
      e,
      t,
      l,
      a,
      void 0,
      n
    ), a = Ic(), e !== null && !Le ? (Pc(e, t, n), bl(e, t, n)) : (he && a && Xu(t), t.flags |= 1, Je(e, t, l, n), t.child);
  }
  function vd(e, t, l, a, n, u) {
    return fa(t), t.updateQueue = null, l = pr(
      t,
      a,
      l,
      n
    ), gr(e), a = Ic(), e !== null && !Le ? (Pc(e, t, u), bl(e, t, u)) : (he && a && Xu(t), t.flags |= 1, Je(e, t, l, u), t.child);
  }
  function yd(e, t, l, a, n) {
    if (fa(t), t.stateNode === null) {
      var u = Ha, i = l.contextType;
      typeof i == "object" && i !== null && (u = tt(i)), u = new l(a, u), t.memoizedState = u.state !== null && u.state !== void 0 ? u.state : null, u.updater = ms, t.stateNode = u, u._reactInternals = t, u = t.stateNode, u.props = a, u.state = t.memoizedState, u.refs = {}, wc(t), i = l.contextType, u.context = typeof i == "object" && i !== null ? tt(i) : Ha, u.state = t.memoizedState, i = l.getDerivedStateFromProps, typeof i == "function" && (ds(
        t,
        l,
        i,
        a
      ), u.state = t.memoizedState), typeof l.getDerivedStateFromProps == "function" || typeof u.getSnapshotBeforeUpdate == "function" || typeof u.UNSAFE_componentWillMount != "function" && typeof u.componentWillMount != "function" || (i = u.state, typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount(), i !== u.state && ms.enqueueReplaceState(u, u.state, null), Xn(t, a, u, n), Qn(), u.state = t.memoizedState), typeof u.componentDidMount == "function" && (t.flags |= 4194308), a = !0;
    } else if (e === null) {
      u = t.stateNode;
      var s = t.memoizedProps, o = ya(l, s);
      u.props = o;
      var p = u.context, T = l.contextType;
      i = Ha, typeof T == "object" && T !== null && (i = tt(T));
      var A = l.getDerivedStateFromProps;
      T = typeof A == "function" || typeof u.getSnapshotBeforeUpdate == "function", s = t.pendingProps !== s, T || typeof u.UNSAFE_componentWillReceiveProps != "function" && typeof u.componentWillReceiveProps != "function" || (s || p !== i) && ld(
        t,
        u,
        a,
        i
      ), Ul = !1;
      var v = t.memoizedState;
      u.state = v, Xn(t, a, u, n), Qn(), p = t.memoizedState, s || v !== p || Ul ? (typeof A == "function" && (ds(
        t,
        l,
        A,
        a
      ), p = t.memoizedState), (o = Ul || td(
        t,
        l,
        o,
        a,
        v,
        p,
        i
      )) ? (T || typeof u.UNSAFE_componentWillMount != "function" && typeof u.componentWillMount != "function" || (typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount()), typeof u.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof u.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = a, t.memoizedState = p), u.props = a, u.state = p, u.context = i, a = o) : (typeof u.componentDidMount == "function" && (t.flags |= 4194308), a = !1);
    } else {
      u = t.stateNode, Zc(e, t), i = t.memoizedProps, T = ya(l, i), u.props = T, A = t.pendingProps, v = u.context, p = l.contextType, o = Ha, typeof p == "object" && p !== null && (o = tt(p)), s = l.getDerivedStateFromProps, (p = typeof s == "function" || typeof u.getSnapshotBeforeUpdate == "function") || typeof u.UNSAFE_componentWillReceiveProps != "function" && typeof u.componentWillReceiveProps != "function" || (i !== A || v !== o) && ld(
        t,
        u,
        a,
        o
      ), Ul = !1, v = t.memoizedState, u.state = v, Xn(t, a, u, n), Qn();
      var _ = t.memoizedState;
      i !== A || v !== _ || Ul || e !== null && e.dependencies !== null && Lu(e.dependencies) ? (typeof s == "function" && (ds(
        t,
        l,
        s,
        a
      ), _ = t.memoizedState), (T = Ul || td(
        t,
        l,
        T,
        a,
        v,
        _,
        o
      ) || e !== null && e.dependencies !== null && Lu(e.dependencies)) ? (p || typeof u.UNSAFE_componentWillUpdate != "function" && typeof u.componentWillUpdate != "function" || (typeof u.componentWillUpdate == "function" && u.componentWillUpdate(a, _, o), typeof u.UNSAFE_componentWillUpdate == "function" && u.UNSAFE_componentWillUpdate(
        a,
        _,
        o
      )), typeof u.componentDidUpdate == "function" && (t.flags |= 4), typeof u.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof u.componentDidUpdate != "function" || i === e.memoizedProps && v === e.memoizedState || (t.flags |= 4), typeof u.getSnapshotBeforeUpdate != "function" || i === e.memoizedProps && v === e.memoizedState || (t.flags |= 1024), t.memoizedProps = a, t.memoizedState = _), u.props = a, u.state = _, u.context = o, a = T) : (typeof u.componentDidUpdate != "function" || i === e.memoizedProps && v === e.memoizedState || (t.flags |= 4), typeof u.getSnapshotBeforeUpdate != "function" || i === e.memoizedProps && v === e.memoizedState || (t.flags |= 1024), a = !1);
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
  function gd(e, t, l, a) {
    return ia(), t.flags |= 256, Je(e, t, l, a), t.child;
  }
  var gs = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function ps(e) {
    return { baseLanes: e, cachePool: ir() };
  }
  function bs(e, t, l) {
    return e = e !== null ? e.childLanes & ~l : 0, t && (e |= Ct), e;
  }
  function pd(e, t, l) {
    var a = t.pendingProps, n = !1, u = (t.flags & 128) !== 0, i;
    if ((i = u) || (i = e !== null && e.memoizedState === null ? !1 : (at.current & 2) !== 0), i && (n = !0, t.flags &= -129), i = (t.flags & 32) !== 0, t.flags &= -33, e === null) {
      if (he) {
        if (n ? Yl(t) : Gl(), (e = qe) ? (e = Qm(
          e,
          Bt
        ), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
          dehydrated: e,
          treeContext: Cl !== null ? { id: It, overflow: Pt } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, l = Wo(e), l.return = t, t.child = l, Fe = t, qe = null)) : e = null, e === null) throw Rl(t);
        return bf(e) ? t.lanes = 32 : t.lanes = 536870912, null;
      }
      return u = a.children, a = a.fallback, n ? (Gl(), n = t.mode, u = oi(
        { mode: "hidden", children: u },
        n
      ), a = ua(
        a,
        n,
        l,
        null
      ), u.return = t, a.return = t, u.sibling = a, t.child = u, a = t.child, a.memoizedState = ps(l), a.childLanes = bs(
        e,
        i,
        l
      ), t.memoizedState = gs, Kn(null, a)) : (Yl(t), Ss(t, u));
    }
    var s = e.memoizedState;
    if (s !== null) {
      var o = s.dehydrated;
      if (o !== null)
        return a0(
          e,
          t,
          u,
          i,
          a,
          o,
          s,
          l
        );
    }
    return n ? (Gl(), n = a.fallback, u = t.mode, s = e.child, o = s.sibling, a = ml(s, {
      mode: "hidden",
      children: a.children
    }), a.subtreeFlags = s.subtreeFlags & 1206910976, o !== null ? n = ml(o, n) : (n = ua(
      n,
      u,
      l,
      null
    ), n.flags |= 2), n.return = t, a.return = t, a.sibling = n, t.child = a, Kn(null, a), a = t.child, n = e.child.memoizedState, n === null ? n = ps(l) : (u = n.cachePool, u !== null ? (s = we._currentValue, u = u.parent !== s ? { parent: s, pool: s } : u) : u = ir(), n = {
      baseLanes: n.baseLanes | l,
      cachePool: u
    }), a.memoizedState = n, a.childLanes = bs(
      e,
      i,
      l
    ), t.memoizedState = gs, Kn(e.child, a)) : (Yl(t), l = e.child, e = l.sibling, l = ml(l, {
      mode: "visible",
      children: a.children
    }), l.return = t, l.sibling = null, e !== null && (i = t.deletions, i === null ? (t.deletions = [e], t.flags |= 16) : i.push(e)), t.child = l, t.memoizedState = null, l);
  }
  function Ss(e, t) {
    return t = oi(
      { mode: "visible", children: t },
      e.mode
    ), t.return = e, e.child = t;
  }
  function oi(e, t) {
    return e = vt(22, e, null, t), e.lanes = 0, e;
  }
  function ri(e, t, l) {
    return ha(t, e.child, null, l), e = Ss(
      t,
      t.pendingProps.children
    ), e.flags |= 2, t.memoizedState = null, e;
  }
  function a0(e, t, l, a, n, u, i, s) {
    if (l)
      return t.flags & 256 ? (Yl(t), t.flags &= -257, ri(
        e,
        t,
        s
      )) : t.memoizedState !== null ? (Gl(), t.child = e.child, t.flags |= 128, null) : (Gl(), u = n.fallback, i = t.mode, n = oi(
        { mode: "visible", children: n.children },
        i
      ), u = ua(
        u,
        i,
        s,
        null
      ), u.flags |= 2, n.return = t, u.return = t, n.sibling = u, t.child = n, ha(t, e.child, null, s), n = t.child, n.memoizedState = ps(s), n.childLanes = bs(
        e,
        a,
        s
      ), t.memoizedState = gs, Kn(null, n));
    if (Yl(t), bf(u)) {
      if (a = u.nextSibling && u.nextSibling.dataset, a) var o = a.dgst;
      return a = o, a !== "" && (n = Error(r(419)), n.stack = "", n.digest = a, Un({ value: n, source: null, stack: null })), ri(
        e,
        t,
        s
      );
    }
    if (Le || sa(e, t, s, !1), a = (s & e.childLanes) !== 0, Le || a) {
      if (Bl.current !== null)
        return ri(
          e,
          t,
          s
        );
      if (a = De, a !== null && (n = Pf(
        a,
        s
      ), n !== 0 && n !== i.retryLane))
        throw i.retryLane = n, na(e, n), bt(a, e, n), vs;
      return pf(u) || Ci(), ri(
        e,
        t,
        s
      );
    }
    return pf(u) ? (t.flags |= 192, t.child = e.child, null) : (e = i.treeContext, qe = Gt(u.nextSibling), Fe = t, he = !0, Ol = null, Bt = !1, e !== null && er(t, e), t = Ss(
      t,
      n.children
    ), t.flags |= 134221824, t);
  }
  function bd(e, t, l) {
    e.lanes |= t;
    var a = e.alternate;
    a !== null && (a.lanes |= t), Zu(e.return, t, l);
  }
  function Sd(e) {
    for (var t = null; e !== null; ) {
      var l = e.alternate;
      l !== null && Iu(l) === null && (t = e), e = e.sibling;
    }
    return t;
  }
  function di(e, t, l, a, n, u) {
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
  function _s(e) {
    var t = e.child;
    for (e.child = null; t !== null; ) {
      var l = t.sibling;
      t.sibling = e.child, e.child = t, t = l;
    }
  }
  function Ts(e, t, l) {
    var a = t.pendingProps, n = a.revealOrder, u = a.tail;
    a = a.children;
    var i = at.current;
    if (t.flags & 128)
      return wn(t, i), null;
    var s = (i & 2) !== 0;
    if (s ? (i = i & 1 | 2, t.flags |= 128) : i &= 1, wn(t, i), n === "backwards" && e !== null ? (_s(e), Je(e, t, a, l), _s(e)) : Je(e, t, a, l), a = he ? Dn : 0, !s && e !== null && (e.flags & 128) !== 0)
      e: for (e = t.child; e !== null; ) {
        if (e.tag === 13)
          e.memoizedState !== null && bd(e, l, t);
        else if (e.tag === 19)
          bd(e, l, t);
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
        l = Sd(t.child), l === null ? (n = t.child, t.child = null) : (n = l.sibling, l.sibling = null, _s(t)), di(
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
          if (e = n.alternate, e !== null && Iu(e) === null) {
            t.child = n;
            break;
          }
          e = n.sibling, n.sibling = l, l = n, n = e;
        }
        di(
          t,
          !0,
          l,
          null,
          u,
          a
        );
        break;
      case "together":
        di(
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
        l = Sd(t.child), l === null ? (n = t.child, t.child = null) : (n = l.sibling, l.sibling = null), di(
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
  function _d(e, t, l) {
    var a = t.pendingProps;
    return Ml(t, t.type, a.value), Je(e, t, a.children, l), t.child;
  }
  function bl(e, t, l) {
    if (e !== null && (t.dependencies = e.dependencies), Zl |= t.lanes, (l & t.childLanes) === 0)
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
      throw Error(r(153));
    if (t.child !== null) {
      for (e = t.child, l = ml(e, e.pendingProps), t.child = l, l.return = t; e.sibling !== null; )
        e = e.sibling, l = l.sibling = ml(e, e.pendingProps), l.return = t;
      l.sibling = null;
    }
    return t.child;
  }
  function Es(e, t) {
    return (e.lanes & t) !== 0 ? !0 : (e = e.dependencies, !!(e !== null && Lu(e)));
  }
  function n0(e, t, l) {
    switch (t.tag) {
      case 3:
        gu(t, t.stateNode.containerInfo), Ml(t, we, e.memoizedState.cache), ia();
        break;
      case 27:
      case 5:
        Fi(t);
        break;
      case 4:
        gu(t, t.stateNode.containerInfo);
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
          return t.flags |= 128, kc(t), null;
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
          return a || (l & n) !== 0 ? pd(e, t, l) : (Yl(t), e = bl(
            e,
            t,
            l
          ), e !== null ? e.sibling : null);
        }
        Yl(t);
        break;
      case 19:
        if (t.flags & 128)
          return Ts(
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
            return Ts(
              e,
              t,
              l
            );
          t.flags |= 128;
        }
        if (n = t.memoizedState, n !== null && (n.rendering = null, n.tail = null, n.lastEffect = null), wn(t, at.current), a) break;
        return null;
      case 22:
        return t.lanes = 0, dd(
          e,
          t,
          l,
          t.pendingProps
        );
      case 24:
        Ml(t, we, e.memoizedState.cache);
    }
    return bl(e, t, l);
  }
  function Td(e, t, l) {
    if (e !== null)
      if (e.memoizedProps !== t.pendingProps)
        Le = !0;
      else {
        if (!Es(e, l) && (t.flags & 128) === 0)
          return Le = !1, n0(
            e,
            t,
            l
          );
        Le = (e.flags & 131072) !== 0;
      }
    else
      Le = !1, he && (t.flags & 1048576) !== 0 && Po(t, Dn, t.index);
    switch (t.lanes = 0, t.tag) {
      case 16:
        e: {
          var a = t.pendingProps;
          if (e = da(t.elementType), t.type = e, typeof e == "function")
            Oc(e) ? (a = ya(e, a), t.tag = 1, t = yd(
              null,
              t,
              e,
              a,
              l
            )) : (t.tag = 0, t = ys(
              null,
              t,
              e,
              a,
              l
            ));
          else {
            if (e != null) {
              var n = e.$$typeof;
              if (n === R) {
                t.tag = 11, t = fd(
                  null,
                  t,
                  e,
                  a,
                  l
                );
                break e;
              } else if (n === Ne) {
                t.tag = 14, t = od(
                  null,
                  t,
                  e,
                  a,
                  l
                );
                break e;
              } else if (n === I) {
                t.tag = 10, t.type = e, t = _d(
                  null,
                  t,
                  l
                );
                break e;
              }
            }
            throw t = D(e) || e, Error(r(306, t, ""));
          }
        }
        return t;
      case 0:
        return ys(
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
        ), yd(
          e,
          t,
          a,
          n,
          l
        );
      case 3:
        e: {
          if (gu(
            t,
            t.stateNode.containerInfo
          ), e === null) throw Error(r(387));
          a = t.pendingProps;
          var u = t.memoizedState;
          n = u.element, Zc(e, t), Xn(t, a, null, l);
          var i = t.memoizedState;
          if (a = i.cache, Ml(t, we, a), a !== u.cache && Bc(
            t,
            [we],
            l,
            !0
          ), Qn(), a = i.element, u.isDehydrated)
            if (u = {
              element: a,
              isDehydrated: !1,
              cache: i.cache
            }, t.updateQueue.baseState = u, t.memoizedState = u, t.flags & 256) {
              t = gd(
                e,
                t,
                a,
                l
              );
              break e;
            } else if (a !== n) {
              n = Ut(
                Error(r(424)),
                t
              ), Un(n), t = gd(
                e,
                t,
                a,
                l
              );
              break e;
            } else
              for (e = t.stateNode.containerInfo, e.nodeType === 9 ? e = e.body : e = e.nodeName === "HTML" ? e.ownerDocument.body : e, qe = Gt(e.firstChild), Fe = t, he = !0, Ol = null, Bt = !0, l = dr(
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
        return Ka(e, t), e === null ? (l = Jm(
          t.type,
          null,
          t.pendingProps,
          null
        )) ? t.memoizedState = l : he || (t.stateNode = jm(
          t.type,
          t.pendingProps,
          Nl.current,
          t
        )) : t.memoizedState = Jm(
          t.type,
          e.memoizedProps,
          t.pendingProps,
          e.memoizedState
        ), null;
      case 27:
        return Fi(t), e === null && he && (a = t.stateNode = Zm(
          t.type,
          t.pendingProps,
          Nl.current
        ), Fe = t, Bt = !0, n = qe, Jl(t.type) ? (Sf = n, qe = Gt(a.firstChild)) : qe = n), Je(
          e,
          t,
          t.pendingProps.children,
          l
        ), Ka(e, t), e === null && (t.flags |= 4194304), t.child;
      case 5:
        return e === null && he && ((n = a = qe) && (a = I0(
          a,
          t.type,
          t.pendingProps,
          Bt
        ), a !== null ? (t.stateNode = a, Fe = t, qe = Gt(a.firstChild), Bt = !1, n = !0) : n = !1), n || Rl(t)), Fi(t), n = t.type, u = t.pendingProps, i = e !== null ? e.memoizedProps : null, a = u.children, rf(n, u) ? a = null : i !== null && rf(n, i) && (t.flags |= 32), t.memoizedState !== null && (n = Wc(
          e,
          t,
          Jv,
          null,
          null,
          l
        ), rn._currentValue = n), Ka(e, t), Je(e, t, a, l), t.child;
      case 6:
        return e === null && he && ((e = l = qe) && (l = P0(
          l,
          t.pendingProps,
          Bt
        ), l !== null ? (t.stateNode = l, Fe = t, qe = null, e = !0) : e = !1), e || Rl(t)), null;
      case 13:
        return pd(e, t, l);
      case 4:
        return gu(
          t,
          t.stateNode.containerInfo
        ), a = t.pendingProps, e === null ? t.child = ha(
          t,
          null,
          a,
          l
        ) : Je(e, t, a, l), t.child;
      case 11:
        return fd(
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
        return _d(e, t, l);
      case 9:
        return n = t.type._context, a = t.pendingProps.children, fa(t), n = tt(n), a = a(n), t.flags |= 1, Je(e, t, a, l), t.child;
      case 14:
        return od(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 15:
        return rd(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 19:
        return Ts(e, t, l);
      case 31:
        return l0(e, t, l);
      case 22:
        return dd(
          e,
          t,
          l,
          t.pendingProps
        );
      case 24:
        return fa(t), a = tt(we), e === null ? (n = Qc(), n === null && (n = De, u = Yc(), n.pooledCache = u, u.refCount++, u !== null && (n.pooledCacheLanes |= l), n = u), t.memoizedState = { parent: a, cache: n }, wc(t), Ml(t, we, n)) : ((e.lanes & l) !== 0 && (Zc(e, t), Xn(t, null, null, l), Qn()), n = e.memoizedState, u = t.memoizedState, n.parent !== a ? (n = { parent: a, cache: a }, t.memoizedState = n, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = n), Ml(t, we, a)) : (a = u.cache, Ml(t, we, a), a !== n.cache && Bc(
          t,
          [we],
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
        }), a = t.pendingProps, a.name != null && a.name !== "auto" ? t.flags |= e === null ? 18882560 : 18874368 : he && Xu(t), e !== null && e.memoizedProps.name !== a.name ? t.flags |= 4194816 : Ka(e, t), Je(e, t, a.children, l), t.child;
      case 29:
        throw t.pendingProps;
    }
    throw Error(r(156, t.tag));
  }
  function Sl(e) {
    e.flags |= 4;
  }
  function Ns(e, t, l, a, n) {
    var u;
    if ((u = (e.mode & 32) !== 0) && (u = l === null ? Wm(t, a) : Wm(t, a) && (a.src !== l.src || a.srcSet !== l.srcSet)), u) {
      if (e.flags |= 16777216, (n & 335544128) === n)
        if (e.stateNode.complete) e.flags |= 8192;
        else if (am()) e.flags |= 8192;
        else
          throw ma = ku, Xc;
    } else e.flags &= -16777217;
  }
  function Ed(e, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0)
      e.flags &= -16777217;
    else if (e.flags |= 16777216, !Im(t))
      if (am()) e.flags |= 8192;
      else
        throw ma = ku, Xc;
  }
  function mi(e, t) {
    t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag !== 22 ? Ff() : 536870912, e.lanes |= t, Wa |= t);
  }
  function Jn(e, t) {
    if (!he)
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
  function u0(e, t, l) {
    var a = t.pendingProps;
    switch (Dc(t), t.tag) {
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
        return l = t.stateNode, a = null, e !== null && (a = e.memoizedState.cache), t.memoizedState.cache !== a && (t.flags |= 2048), yl(we), Ea(), l.pendingContext && (l.context = l.pendingContext, l.pendingContext = null), (e === null || e.child === null) && (Ga(t) ? Sl(t) : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, qc())), He(t), null;
      case 26:
        var n = t.type, u = t.memoizedState;
        return e === null ? (Sl(t), u !== null ? (He(t), Ed(t, u)) : (He(t), Ns(
          t,
          n,
          null,
          a,
          l
        ))) : u ? u !== e.memoizedState ? (Sl(t), He(t), Ed(t, u)) : (He(t), t.flags &= -16777217) : (e = e.memoizedProps, e !== a && Sl(t), He(t), Ns(
          t,
          n,
          e,
          a,
          l
        )), null;
      case 27:
        if (pu(t), l = Nl.current, n = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== a && Sl(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(r(166));
            return He(t), t.subtreeFlags &= -33554433, null;
          }
          e = Ft.current, Ga(t) ? tr(t) : (e = Zm(n, a, l), t.stateNode = e, Sl(t));
        }
        return He(t), t.subtreeFlags &= -33554433, null;
      case 5:
        if (pu(t), n = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== a && Sl(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(r(166));
            return He(t), t.subtreeFlags &= -33554433, null;
          }
          if (u = Ft.current, Ga(t))
            tr(t);
          else {
            var i = nu(
              Nl.current
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
            u[et] = t, u[ht] = a;
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
            e: switch (ut(u, n, a), n) {
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
        return He(t), t.subtreeFlags &= -33554433, Ns(
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
            throw Error(r(166));
          if (e = Nl.current, Ga(t)) {
            if (e = t.stateNode, l = t.memoizedProps, a = null, n = Fe, n !== null)
              switch (n.tag) {
                case 27:
                case 5:
                  a = n.memoizedProps;
              }
            e[et] = t, e = !!(e.nodeValue === l || a !== null && a.suppressHydrationWarning === !0 || Tm(e.nodeValue, l)), e || Rl(t, !0);
          } else
            e = nu(e).createTextNode(
              a
            ), e[et] = t, t.stateNode = e;
        }
        return He(t), null;
      case 31:
        if (l = t.memoizedState, e === null || e.memoizedState !== null) {
          if (a = Ga(t), l !== null) {
            if (e === null) {
              if (!a) throw Error(r(318));
              if (e = t.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(r(557));
              e[et] = t;
            } else
              ia(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            He(t), e = !1;
          } else
            l = qc(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = l), e = !0;
          if (!e)
            return t.flags & 256 ? (jt(t), t) : (jt(t), null);
          if ((t.flags & 128) !== 0)
            throw Error(r(558));
        }
        return He(t), null;
      case 13:
        if (a = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (n = Ga(t), a !== null && a.dehydrated !== null) {
            if (e === null) {
              if (!n) throw Error(r(318));
              if (n = t.memoizedState, n = n !== null ? n.dehydrated : null, !n) throw Error(r(317));
              n[et] = t;
            } else
              ia(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            He(t), n = !1;
          } else
            n = qc(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), n = !0;
          if (!n)
            return t.flags & 256 ? (jt(t), t) : (jt(t), null);
        }
        return jt(t), (t.flags & 128) !== 0 ? (t.lanes = l, t) : (l = a !== null, e = e !== null && e.memoizedState !== null, l && (a = t.child, n = null, a.alternate !== null && a.alternate.memoizedState !== null && a.alternate.memoizedState.cachePool !== null && (n = a.alternate.memoizedState.cachePool.pool), u = null, a.memoizedState !== null && a.memoizedState.cachePool !== null && (u = a.memoizedState.cachePool.pool), u !== n && (a.flags |= 2048)), l !== e && l && (t.child.flags |= 8192), mi(t, t.updateQueue), He(t), null);
      case 4:
        return Ea(), e === null && uf(t.stateNode.containerInfo), t.flags |= 67108864, He(t), null;
      case 10:
        return yl(t.type), He(t), null;
      case 19:
        if ($c(t), a = t.memoizedState, a === null) return He(t), null;
        if (n = (t.flags & 128) !== 0, u = a.rendering, u === null)
          if (n) Jn(a, !1);
          else {
            if (Qe !== 0 || e !== null && (e.flags & 128) !== 0)
              for (e = t.child; e !== null; ) {
                if (u = Iu(e), u !== null) {
                  for (t.flags |= 128, Jn(a, !1), e = u.updateQueue, t.updateQueue = e, mi(t, e), t.subtreeFlags = 0, e = l, l = t.child; l !== null; )
                    Fo(l, e), l = l.sibling;
                  return wn(
                    t,
                    at.current & 1 | 2
                  ), he && hl(t, a.treeForkCount), t.child;
                }
                e = e.sibling;
              }
            a.tail !== null && _t() > xi && (t.flags |= 128, n = !0, Jn(a, !1), t.lanes = 4194304);
          }
        else {
          if (!n)
            if (e = Iu(u), e !== null) {
              if (t.flags |= 128, n = !0, e = e.updateQueue, t.updateQueue = e, mi(t, e), Jn(a, !0), a.tail === null && a.tailMode !== "collapsed" && a.tailMode !== "visible" && !u.alternate && !he)
                return He(t), null;
            } else
              2 * _t() - a.renderingStartTime > xi && l !== 536870912 && (t.flags |= 128, n = !0, Jn(a, !1), t.lanes = 4194304);
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
          return a.rendering = e, a.tail = e.sibling, a.renderingStartTime = _t(), e.sibling = null, u = at.current, u = n ? u & 1 | 2 : u & 1, a.tailMode === "visible" || a.tailMode === "collapsed" || !l || he ? wn(t, u) : (l = u, Ue(lt, t), Ue(at, l), st === null && (st = t)), he && hl(t, a.treeForkCount), e;
        }
        return He(t), null;
      case 22:
      case 23:
        return jt(t), Jc(), a = t.memoizedState !== null, e !== null ? e.memoizedState !== null !== a && (t.flags |= 8192) : a && (t.flags |= 8192), a ? (l & 536870912) !== 0 && (t.flags & 128) === 0 && (He(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : He(t), l = t.updateQueue, l !== null && mi(t, l.retryQueue), l = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (l = e.memoizedState.cachePool.pool), a = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (a = t.memoizedState.cachePool.pool), a !== l && (t.flags |= 2048), e !== null && Pe(ra), null;
      case 24:
        return l = null, e !== null && (l = e.memoizedState.cache), t.memoizedState.cache !== l && (t.flags |= 2048), yl(we), He(t), null;
      case 25:
        return null;
      case 30:
        return t.flags |= 33554432, He(t), null;
    }
    throw Error(r(156, t.tag));
  }
  function i0(e, t) {
    switch (Dc(t), t.tag) {
      case 1:
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return yl(we), Ea(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 26:
      case 27:
      case 5:
        return pu(t), null;
      case 31:
        if (t.memoizedState !== null) {
          if (jt(t), t.alternate === null)
            throw Error(r(340));
          ia();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 13:
        if (jt(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null)
            throw Error(r(340));
          ia();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return $c(t), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, e = t.memoizedState, e !== null && (e.rendering = null, e.tail = null), t.flags |= 4, t) : null;
      case 4:
        return Ea(), null;
      case 10:
        return yl(t.type), null;
      case 22:
      case 23:
        return jt(t), Jc(), e !== null && Pe(ra), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 24:
        return yl(we), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function Nd(e, t) {
    switch (Dc(t), t.tag) {
      case 3:
        yl(we), Ea();
        break;
      case 26:
      case 27:
      case 5:
        pu(t);
        break;
      case 4:
        Ea();
        break;
      case 31:
        t.memoizedState !== null && jt(t);
        break;
      case 13:
        jt(t);
        break;
      case 19:
        $c(t);
        break;
      case 10:
        yl(t.type);
        break;
      case 22:
      case 23:
        jt(t), Jc(), e !== null && Pe(ra);
        break;
      case 24:
        yl(we);
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
    } catch (s) {
      Oe(t, t.return, s);
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
            var i = a.inst, s = i.destroy;
            if (s !== void 0) {
              i.destroy = void 0, n = t;
              var o = l, p = s;
              try {
                p();
              } catch (T) {
                Oe(
                  n,
                  o,
                  T
                );
              }
            }
          }
          a = a.next;
        } while (a !== u);
      }
    } catch (T) {
      Oe(t, t.return, T);
    }
  }
  function xd(e) {
    var t = e.updateQueue;
    if (t !== null) {
      var l = e.stateNode;
      try {
        hr(t, l);
      } catch (a) {
        Oe(e, e.return, a);
      }
    }
  }
  function jd(e, t, l) {
    l.props = ya(
      e.type,
      e.memoizedProps
    ), l.state = e.memoizedState;
    try {
      l.componentWillUnmount();
    } catch (a) {
      Oe(e, t, a);
    }
  }
  function el(e, t) {
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
            (n.ref === null || n.ref.name !== u) && (n.ref = Dm(u)), a = n.ref;
            break;
          case 7:
            if (e.stateNode === null) {
              var i = new Rt(e);
              y(
                e.child,
                !1,
                F0,
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
    } catch (s) {
      Oe(e, t, s);
    }
  }
  function nt(e, t) {
    var l = e.ref, a = e.refCleanup;
    if (l !== null)
      if (typeof a == "function")
        try {
          a();
        } catch (n) {
          Oe(e, t, n);
        } finally {
          e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
        }
      else if (typeof l == "function")
        try {
          l(null);
        } catch (n) {
          Oe(e, t, n);
        }
      else l.current = null;
  }
  function hi(e, t) {
    if ((e.tag === 5 || e.tag === 27 || e.tag === 6) && e.alternate === null && t !== null)
      for (var l = 0; l < t.length; l++)
        Gm(
          e.stateNode,
          t[l]
        );
  }
  function Ad(e) {
    for (var t = e.return; t !== null && (js(t) && Gm(e.stateNode, t.stateNode), !xs(t)); )
      t = t.return;
  }
  function $n(e) {
    for (var t = e.return; t !== null && (js(t) && W0(e.stateNode, t.stateNode), !xs(t)); )
      t = t.return;
  }
  function xs(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 27;
  }
  function js(e) {
    return e && e.tag === 7 && e.stateNode !== null;
  }
  function As(e) {
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
      Oe(e, e.return, n);
    }
  }
  function zs(e, t, l) {
    try {
      var a = e.stateNode;
      M0(a, e.type, l, t), a[ht] = t;
    } catch (n) {
      Oe(e, e.return, n);
    }
  }
  function zd(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && Jl(e.type) || e.tag === 4;
  }
  function Cs(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || zd(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.tag === 27 && Jl(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function Os(e, t, l, a) {
    var n = e.tag;
    if (n === 5 || n === 6)
      n = e.stateNode, t ? (l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l).insertBefore(n, t) : (t = l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l, t.appendChild(n), l = l._reactRootContainer, l != null || t.onclick !== null || (t.onclick = Wt)), hi(e, a), xe = !0;
    else if (n !== 4 && (n === 27 && (hi(e, a), a = null, Jl(e.type) && (l = e.stateNode, t = null)), e = e.child, e !== null))
      for (Os(
        e,
        t,
        l,
        a
      ), e = e.sibling; e !== null; )
        Os(
          e,
          t,
          l,
          a
        ), e = e.sibling;
  }
  function vi(e, t, l, a) {
    var n = e.tag;
    if (n === 5 || n === 6)
      n = e.stateNode, t ? l.insertBefore(n, t) : l.appendChild(n), hi(e, a), xe = !0;
    else if (n !== 4 && (n === 27 && (hi(e, a), a = null, Jl(e.type) && (l = e.stateNode)), e = e.child, e !== null))
      for (vi(
        e,
        t,
        l,
        a
      ), e = e.sibling; e !== null; )
        vi(
          e,
          t,
          l,
          a
        ), e = e.sibling;
  }
  function Cd(e) {
    var t = e.stateNode, l = e.memoizedProps;
    try {
      for (var a = e.type, n = t.attributes; n.length; )
        t.removeAttributeNode(n[0]);
      ut(t, a, l), t[et] = e, t[ht] = l;
    } catch (u) {
      Oe(e, e.return, u);
    }
  }
  var yi = !1, At = null;
  function Od(e) {
    (e.tag === 30 || (e.subtreeFlags & 33554432) !== 0) && (yi = !0);
  }
  var tl = null;
  function Rd() {
    var e = tl;
    return tl = null, e;
  }
  var yt = 0;
  function Ja(e, t, l, a, n) {
    return yt = 0, Md(
      e.child,
      t,
      l,
      a,
      n
    );
  }
  function Md(e, t, l, a, n) {
    for (var u = !1; e !== null; ) {
      if (e.tag === 5) {
        var i = e.stateNode;
        if (a !== null) {
          var s = hf(i);
          a.push(s), s.view && (u = !0);
        } else
          u || hf(i).view && (u = !0);
        yi = !0, Rm(
          i,
          yt === 0 ? t : t + "_" + yt,
          l
        ), yt++;
      } else (e.tag !== 22 || e.memoizedState === null) && (e.tag === 30 && n || Md(
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
  function ll(e, t) {
    for (; e !== null; )
      e.tag === 5 ? Mm(e.stateNode, e.memoizedProps) : (e.tag !== 22 || e.memoizedState === null) && (e.tag === 30 && t || ll(
        e.child,
        t
      )), e = e.sibling;
  }
  function gi(e) {
    if ((e.subtreeFlags & 18874368) !== 0)
      for (e = e.child; e !== null; ) {
        if ((e.tag !== 22 || e.memoizedState === null) && (gi(e), e.tag === 30 && (e.flags & 18874368) !== 0 && e.stateNode.paired)) {
          var t = e.memoizedProps;
          if (t.name == null || t.name === "auto")
            throw Error(r(544));
          var l = t.name;
          t = dl(t.default, t.share), t !== "none" && (Ja(
            e,
            l,
            t,
            null,
            !1
          ) || ll(e.child, !1));
        }
        e = e.sibling;
      }
  }
  function Rs(e, t) {
    if (e.tag === 30) {
      var l = e.stateNode, a = e.memoizedProps, n = rl(a, l), u = dl(
        a.default,
        l.paired ? a.share : a.enter
      );
      u !== "none" ? Ja(e, n, u, null, !1) ? (gi(e), l.paired || t || tn(e, a.onEnter)) : ll(e.child, !1) : gi(e);
    } else if ((e.subtreeFlags & 33554432) !== 0)
      for (e = e.child; e !== null; )
        Rs(e, t), e = e.sibling;
    else gi(e);
  }
  function Ms(e) {
    if (At !== null && At.size !== 0) {
      var t = At;
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
                  ) ? (u = e.stateNode, n.paired = u, u.paired = n, tn(e, l.onShare)) : ll(e.child, !1)), t.delete(a), t.size === 0) break;
                }
              }
            }
            Ms(e);
          }
          e = e.sibling;
        }
    }
  }
  function Ds(e) {
    if (e.tag === 30) {
      var t = e.memoizedProps, l = rl(t, e.stateNode), a = At !== null ? At.get(l) : void 0, n = dl(
        t.default,
        a !== void 0 ? t.share : t.exit
      );
      n !== "none" && (Ja(e, l, n, null, !1) ? a !== void 0 ? (n = e.stateNode, a.paired = n, n.paired = a, At.delete(l), tn(e, t.onShare)) : tn(e, t.onExit) : ll(e.child, !1)), At !== null && Ms(e);
    } else if ((e.subtreeFlags & 33554432) !== 0)
      for (e = e.child; e !== null; )
        Ds(e), e = e.sibling;
    else
      At !== null && Ms(e);
  }
  function Dd(e) {
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
        (e.subtreeFlags & 33554432) !== 0 && Dd(e);
      e = e.sibling;
    }
  }
  function Us(e) {
    if ((e.subtreeFlags & 18874368) !== 0)
      for (e = e.child; e !== null; ) {
        if (e.tag !== 22 || e.memoizedState === null) {
          if (e.tag === 30 && (e.flags & 18874368) !== 0) {
            var t = e.stateNode;
            t.paired !== null && (t.paired = null, ll(e.child, !1));
          }
          Us(e);
        }
        e = e.sibling;
      }
  }
  function pi(e) {
    if (e.tag === 30)
      e.stateNode.paired = null, ll(e.child, !1), Us(e);
    else if ((e.subtreeFlags & 33554432) !== 0)
      for (e = e.child; e !== null; )
        pi(e), e = e.sibling;
    else Us(e);
  }
  function Ud(e) {
    for (e = e.child; e !== null; )
      e.tag === 30 ? ll(e.child, !1) : (e.subtreeFlags & 33554432) !== 0 && Ud(e), e = e.sibling;
  }
  function qs(e, t, l, a, n, u, i) {
    for (var s = !1; t !== null; ) {
      if (t.tag === 5) {
        var o = t.stateNode;
        if (u !== null && yt < u.length) {
          var p = u[yt], T = hf(o);
          (p.view || T.view) && (s = !0);
          var A;
          if (A = (e.flags & 4) === 0)
            if (T.clip) A = !0;
            else {
              A = p.rect;
              var v = T.rect;
              A = A.y !== v.y || A.x !== v.x || A.height !== v.height || A.width !== v.width;
            }
          A && (e.flags |= 4), T.abs ? T = !p.abs : (p = p.rect, T = T.rect, T = p.height !== T.height || p.width !== T.width), T && (e.flags |= 32);
        } else e.flags |= 32;
        (e.flags & 4) !== 0 && Rm(
          o,
          yt === 0 ? l : l + "_" + yt,
          n
        ), s && (e.flags & 4) !== 0 || (tl === null && (tl = []), tl.push(
          o,
          yt === 0 ? a : a + "_" + yt,
          t.memoizedProps
        )), yt++;
      } else (t.tag !== 22 || t.memoizedState === null) && (t.tag === 30 && i ? e.flags |= t.flags & 32 : qs(
        e,
        t.child,
        l,
        a,
        n,
        u,
        i
      ) && (s = !0));
      t = t.sibling;
    }
    return s;
  }
  function qd(e, t) {
    for (e = e.child; e !== null; ) {
      if (e.tag === 30) {
        var l = e.memoizedProps, a = e.stateNode, n = rl(l, a), u = dl(l.default, l.update), i;
        i = e.memoizedState, e.memoizedState = null, a = e;
        var s = e.child;
        yt = 0, n = qs(
          a,
          s,
          n,
          n,
          u,
          i,
          !1
        ), (e.flags & 4) !== 0 && n && tn(e, l.onUpdate);
      } else
        (e.subtreeFlags & 33554432) !== 0 && qd(e);
      e = e.sibling;
    }
  }
  var We = !1, Ae = !1, al = !1, Hs = !1, Hd = typeof WeakSet == "function" ? WeakSet : Set, Ie = null, nl = !1, Fn = !1, bi = !1, Bs = !1;
  function c0(e, t, l) {
    if (e = e.containerInfo, ff = dn, e = Qo(e), Ec(e)) {
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
            var s = 0, o = -1, p = -1, T = 0, A = 0, v = e, _ = null;
            t: for (; ; ) {
              for (var G; v !== a || u !== 0 && v.nodeType !== 3 || (o = s + u), v !== i || n !== 0 && v.nodeType !== 3 || (p = s + n), v.nodeType === 3 && (s += v.nodeValue.length), (G = v.firstChild) !== null; )
                _ = v, v = G;
              for (; ; ) {
                if (v === e) break t;
                if (_ === a && ++T === u && (o = s), _ === i && ++A === n && (p = s), (G = v.nextSibling) !== null) break;
                v = _, _ = v.parentNode;
              }
              v = G;
            }
            a = o === -1 || p === -1 ? null : { start: o, end: p };
          } else a = null;
        }
      a = a || { start: 0, end: 0 };
    } else a = null;
    for (of = { focusedElem: e, selectionRange: a }, dn = !1, l = (l & 335544064) === l, Ie = t, t = l ? 9270 : 1024; Ie !== null; ) {
      if (e = Ie, l && (a = e.deletions, a !== null))
        for (u = 0; u < a.length; u++)
          l && Ds(a[u]);
      if (e.alternate === null && (e.flags & 2) !== 0)
        l && Od(e), Si(l);
      else {
        if (e.tag === 22) {
          if (a = e.alternate, e.memoizedState !== null) {
            a !== null && a.memoizedState === null && l && Ds(a), Si(l);
            continue;
          } else if (a !== null && a.memoizedState !== null) {
            l && Od(e), Si(l);
            continue;
          }
        }
        a = e.child, (e.subtreeFlags & t) !== 0 && a !== null ? (a.return = e, Ie = a) : (l && Dd(e), Si(l));
      }
    }
    At = null;
  }
  function Si(e) {
    for (; Ie !== null; ) {
      var t = Ie, l = e, a = t.alternate, n = t.flags;
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
            } catch (s) {
              Oe(t, t.return, s);
            }
          }
          break;
        case 3:
          if ((n & 1024) !== 0) {
            if (a = t.stateNode.containerInfo, l = a.nodeType, l === 9)
              gf(a);
            else if (l === 1)
              switch (a.nodeName) {
                case "HEAD":
                case "HTML":
                case "BODY":
                  gf(a);
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
          if ((n & 1024) !== 0) throw Error(r(163));
      }
      if (a = t.sibling, a !== null) {
        a.return = t.return, Ie = a;
        break;
      }
      Ie = t.return;
    }
  }
  function Bd(e, t, l) {
    var a = l.flags;
    switch (l.tag) {
      case 0:
      case 11:
      case 15:
        ul(e, l), a & 4 && kn(5, l);
        break;
      case 1:
        if (ul(e, l), a & 4)
          if (e = l.stateNode, t === null)
            try {
              e.componentDidMount();
            } catch (i) {
              Oe(l, l.return, i);
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
              Oe(
                l,
                l.return,
                i
              );
            }
          }
        a & 64 && xd(l), a & 512 && el(l, l.return);
        break;
      case 3:
        if (ul(e, l), a & 64 && (e = l.updateQueue, e !== null)) {
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
            hr(e, t);
          } catch (i) {
            Oe(l, l.return, i);
          }
        }
        break;
      case 27:
        t === null && a & 4 && Cd(l);
      case 26:
      case 5:
        ul(e, l), t === null && a & 4 && As(l), a & 512 && el(l, l.return);
        break;
      case 12:
        ul(e, l);
        break;
      case 31:
        ul(e, l), a & 4 && Xd(e, l);
        break;
      case 13:
        ul(e, l), a & 4 && wd(e, l), a & 64 && (e = l.memoizedState, e !== null && (e = e.dehydrated, e !== null && (l = b0.bind(
          null,
          l
        ), ey(e, l))));
        break;
      case 22:
        if (a = l.memoizedState !== null || We, !a) {
          var u = t !== null && t.memoizedState !== null || Ae;
          t = We, n = Ae, We = a, (Ae = u) && !n ? (a = 2, (l.subtreeFlags & 8772) !== 0 && (a |= 1), Kt(
            e,
            l,
            a
          )) : ul(e, l), We = t, Ae = n;
        }
        break;
      case 30:
        ul(e, l), a & 512 && el(l, l.return);
        break;
      case 7:
        a & 512 && el(l, l.return);
      default:
        ul(e, l);
    }
  }
  function Ys(e, t) {
    for (e = e.child; e !== null; )
      Yd(e, t), e = e.sibling;
  }
  function Yd(e, t) {
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
        } catch (o) {
          Oe(e, e.return, o);
        }
        Gs(e, t);
        break;
      case 6:
        try {
          e.stateNode.nodeValue = t ? "" : e.memoizedProps, xe = !0;
        } catch (o) {
          Oe(e, e.return, o);
        }
        break;
      case 18:
        try {
          var s = e.stateNode;
          t ? Om(s, !0) : Om(e.stateNode, !1);
        } catch (o) {
          Oe(e, e.return, o);
        }
        break;
      case 22:
      case 23:
        e.memoizedState === null && Ys(e, t);
        break;
      default:
        Ys(e, t);
    }
  }
  function Gs(e, t) {
    if (e.subtreeFlags & 67108864)
      for (e = e.child; e !== null; ) {
        e: {
          var l = e, a = t;
          switch (l.tag) {
            case 4:
              Yd(l, a);
              break e;
            case 22:
              l.memoizedState === null && Gs(l, a);
              break e;
            default:
              Gs(l, a);
          }
        }
        e = e.sibling;
      }
  }
  function Gd(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, Gd(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && xu(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  var Be = null, gt = !1;
  function Lt(e, t, l) {
    for (l = l.child; l !== null; )
      Qd(e, t, l), l = l.sibling;
  }
  function Qd(e, t, l) {
    if (Tt && typeof Tt.onCommitFiberUnmount == "function")
      try {
        Tt.onCommitFiberUnmount(bn, l);
      } catch {
      }
    switch (l.tag) {
      case 26:
        Ae || nt(l, t), Lt(
          e,
          t,
          l
        ), l.memoizedState ? l.memoizedState.count-- : l.stateNode && !Ae && (l = l.stateNode, l.parentNode.removeChild(l));
        break;
      case 27:
        Ae || nt(l, t), $n(l);
        var a = Be, n = gt;
        Jl(l.type) && (Be = l.stateNode, gt = !1), Lt(
          e,
          t,
          l
        ), Lm(
          l.stateNode,
          l.type,
          l.memoizedProps
        ), Be = a, gt = n;
        break;
      case 5:
        Ae || nt(l, t), $n(l);
      case 6:
        if (l.tag === 6 && $n(l), a = Be, n = gt, Be = null, Lt(
          e,
          t,
          l
        ), Be = a, gt = n, Be !== null)
          if (gt)
            try {
              (Be.nodeType === 9 ? Be.body : Be.nodeName === "HTML" ? Be.ownerDocument.body : Be).removeChild(l.stateNode), xe = !0;
            } catch (u) {
              Oe(
                l,
                t,
                u
              );
            }
          else
            try {
              Be.removeChild(l.stateNode), xe = !0;
            } catch (u) {
              Oe(
                l,
                t,
                u
              );
            }
        break;
      case 18:
        Be !== null && (gt ? (e = Be, Cm(
          e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e,
          l.stateNode
        ), mn(e)) : Cm(Be, l.stateNode));
        break;
      case 4:
        a = Be, n = gt, Be = l.stateNode.containerInfo, gt = !0, Lt(
          e,
          t,
          l
        ), Be = a, gt = n;
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
        Ae || (nt(l, t), a = l.stateNode, typeof a.componentWillUnmount == "function" && jd(
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
        nt(l, t), Lt(
          e,
          t,
          l
        );
        break;
      case 7:
        Ae || nt(l, t), Lt(
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
  function Xd(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
      e = e.dehydrated;
      try {
        mn(e);
      } catch (l) {
        Oe(t, t.return, l);
      }
    }
  }
  function wd(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null))))
      try {
        mn(e);
      } catch (l) {
        Oe(t, t.return, l);
      }
  }
  function s0(e) {
    switch (e.tag) {
      case 31:
      case 13:
      case 19:
        var t = e.stateNode;
        return t === null && (t = e.stateNode = new Hd()), t;
      case 22:
        return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new Hd()), t;
      default:
        throw Error(r(435, e.tag));
    }
  }
  function _i(e, t) {
    var l = s0(e);
    t.forEach(function(a) {
      if (!l.has(a)) {
        l.add(a);
        var n = S0.bind(null, e, a);
        a.then(n, n);
      }
    });
  }
  function rt(e, t, l) {
    var a = t.deletions;
    if (a !== null)
      for (var n = 0; n < a.length; n++) {
        var u = a[n], i = e, s = t, o = s;
        e: for (; o !== null; ) {
          switch (o.tag) {
            case 27:
              if (Jl(o.type)) {
                Be = o.stateNode, gt = !1;
                break e;
              }
              break;
            case 5:
              Be = o.stateNode, gt = !1;
              break e;
            case 3:
            case 4:
              Be = o.stateNode.containerInfo, gt = !0;
              break e;
          }
          o = o.return;
        }
        if (Be === null) throw Error(r(160));
        Qd(i, s, u), Be = null, gt = !1, i = u.alternate, i !== null && (i.return = null), u.return = null;
      }
    if (t.subtreeFlags & 13886)
      for (t = t.child; t !== null; )
        Zd(t, e, l), t = t.sibling;
  }
  var Vt = null;
  function Zd(e, t, l) {
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
        rt(t, e, l), dt(e), n & 4 && (Ql(3, e, e.return), kn(3, e), Ql(5, e, e.return));
        break;
      case 1:
        rt(t, e, l), dt(e), n & 512 && (Ae || a === null || nt(a, a.return)), n & 64 && We && (e = e.updateQueue, e !== null && (t = e.callbacks, t !== null && (l = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = l === null ? t : l.concat(t))));
        break;
      case 26:
        if (u = Vt, rt(t, e, l), dt(e), n & 512 && (Ae || a === null || nt(a, a.return)), n & 4)
          if (n = a !== null ? a.memoizedState : null, l = e.memoizedState, a === null)
            if (l === null)
              if (e.stateNode === null)
                if (We)
                  e.stateNode = jm(
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
                        a = n.getElementsByTagName("title")[0], (!a || a[Tn] || a[et] || a.namespaceURI === "http://www.w3.org/2000/svg" || a.hasAttribute("itemprop")) && (a = n.createElement(t), n.head.insertBefore(
                          a,
                          n.querySelector("head > title")
                        )), ut(a, t, l), a[et] = e, $e(a), t = a;
                        break e;
                      case "link":
                        if (u = Fm(
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
                        a = n.createElement(t), ut(a, t, l), n.head.appendChild(a);
                        break;
                      case "meta":
                        if (u = Fm(
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
                        a = n.createElement(t), ut(a, t, l), n.head.appendChild(a);
                        break;
                      default:
                        throw Error(r(468, t));
                    }
                    a[et] = e, $e(a), t = a;
                  }
                  e.stateNode = t;
                }
              else
                We || Nf(u, e.type, e.stateNode);
            else
              e.stateNode = $m(
                u,
                l,
                e.memoizedProps
              );
          else
            n !== l ? (n === null ? (t = a.stateNode, t === null || Ae || t.parentNode.removeChild(t)) : n.count--, l === null ? We || Nf(u, e.type, e.stateNode) : $m(u, l, e.memoizedProps)) : l === null && e.stateNode !== null && zs(
              e,
              e.memoizedProps,
              a.memoizedProps
            );
        break;
      case 27:
        rt(t, e, l), dt(e), n & 512 && (Ae || a === null || nt(a, a.return)), a !== null && n & 4 && zs(
          e,
          e.memoizedProps,
          a.memoizedProps
        );
        break;
      case 5:
        if (u = al, al = !1, rt(t, e, l), al = u, dt(e), n & 512 && (Ae || a === null || nt(a, a.return)), e.flags & 32) {
          t = e.stateNode;
          try {
            Ca(t, ""), xe = !0;
          } catch (T) {
            Oe(e, e.return, T);
          }
        }
        n & 4 && e.stateNode != null && (t = e.memoizedProps, zs(
          e,
          t,
          a !== null ? a.memoizedProps : t
        )), n & 1024 && (Hs = !0);
        break;
      case 6:
        if (rt(t, e, l), dt(e), n & 4) {
          if (e.stateNode === null)
            throw Error(r(162));
          t = e.memoizedProps, l = e.stateNode;
          try {
            l.nodeValue = t, xe = !0;
          } catch (T) {
            Oe(e, e.return, T);
          }
        }
        break;
      case 3:
        if (xe = !1, Hi = null, u = Vt, Vt = uu(t.containerInfo), rt(t, e, l), Vt = u, dt(e), n & 4 && a !== null && a.memoizedState.isDehydrated)
          try {
            mn(t.containerInfo);
          } catch (T) {
            Oe(e, e.return, T);
          }
        Hs && (Hs = !1, Ld(e)), xe = !1;
        break;
      case 4:
        n = al, al = We, a = fo(), u = Vt, Vt = uu(
          e.stateNode.containerInfo
        ), rt(t, e, l), dt(e), Vt = u, xe && Fn && (bi = !0), xe = a, al = n;
        break;
      case 12:
        rt(t, e, l), dt(e);
        break;
      case 31:
        rt(t, e, l), dt(e), n & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, _i(e, t)));
        break;
      case 13:
        rt(t, e, l), dt(e), e.child.flags & 8192 && e.memoizedState !== null != (a !== null && a.memoizedState !== null) && (Ni = _t()), n & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, _i(e, t)));
        break;
      case 22:
        u = e.memoizedState !== null, i = a !== null && a.memoizedState !== null;
        var s = We, o = Ae, p = al;
        We = s || u, al = p || u, Ae = o || i, rt(t, e, l), Ae = o, al = p, We = s, dt(e), n & 8192 && (t = e.stateNode, t._visibility = u ? t._visibility & -2 : t._visibility | 1, !u || a === null || i || We || Ae || (t = i || Ae, l = We, a = Ae, We = u || We, Ae = t, Xl(e, 2), We = l, Ae = a), !u && al || Ys(e, u)), n & 4 && (t = e.updateQueue, t !== null && (l = t.retryQueue, l !== null && (t.retryQueue = null, _i(e, l))));
        break;
      case 19:
        rt(t, e, l), dt(e), n & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, _i(e, t)));
        break;
      case 30:
        n & 512 && (Ae || a === null || nt(a, a.return)), n = fo(), u = Fn, i = (l & 335544064) === l, s = e.memoizedProps, Fn = i && dl(
          s.default,
          s.update
        ) !== "none", rt(t, e, l), dt(e), i && a !== null && xe && (e.flags |= 4), Fn = u, xe = n;
        break;
      case 21:
        break;
      case 7:
        n & 512 && (Ae || a === null || nt(a, a.return)), a && a.stateNode !== null && (a.stateNode._fragmentFiber = e);
      default:
        rt(t, e, l), dt(e);
    }
  }
  function dt(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        for (var l, a = e.return; a !== null; ) {
          if (zd(a)) {
            l = a;
            break;
          }
          a = a.return;
        }
        a = null;
        for (var n = e.return; n !== null; ) {
          if (js(n)) {
            var u = n.stateNode;
            a === null ? a = [u] : a.push(u);
          }
          if (xs(n)) break;
          n = n.return;
        }
        var i = a;
        if (l == null) throw Error(r(160));
        switch (l.tag) {
          case 27:
            var s = l.stateNode, o = Cs(e);
            vi(
              e,
              o,
              s,
              i
            );
            break;
          case 5:
            var p = l.stateNode;
            l.flags & 32 && (Ca(p, ""), l.flags &= -33);
            var T = Cs(e);
            vi(
              e,
              T,
              p,
              i
            );
            break;
          case 3:
          case 4:
            var A = l.stateNode.containerInfo, v = Cs(e);
            Os(
              e,
              v,
              A,
              i
            );
            break;
          default:
            throw Error(r(161));
        }
      } catch (_) {
        Oe(e, e.return, _);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function Ld(e) {
    if (e.subtreeFlags & 1024)
      for (e = e.child; e !== null; ) {
        var t = e;
        Ld(t), t.tag === 5 && t.flags & 1024 && (t = t.stateNode, dn = !0, t.reset(), dn = !1), e = e.sibling;
      }
  }
  function ka(e, t) {
    if (t.subtreeFlags & 9270)
      for (t = t.child; t !== null; )
        Vd(t, e), t = t.sibling;
    else qd(t);
  }
  function Vd(e, t) {
    var l = e.alternate;
    if (l === null) Rs(e, !1);
    else
      switch (e.tag) {
        case 3:
          if (Bs = nl = !1, Rd(), ka(t, e), !nl && !bi) {
            if (e = tl, e !== null)
              for (var a = 0; a < e.length; a += 3) {
                l = e[a];
                var n = e[a + 1];
                Mm(l, e[a + 2]), l = l.ownerDocument.documentElement, l !== null && l.animate(
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
            )), Bs = !0;
          }
          tl = null;
          break;
        case 5:
          ka(t, e);
          break;
        case 4:
          a = nl, nl = !1, ka(t, e), nl && (bi = !0), nl = a;
          break;
        case 22:
          e.memoizedState === null && (l.memoizedState !== null ? Rs(e, !1) : ka(t, e));
          break;
        case 30:
          a = nl, n = Rd(), nl = !1, ka(t, e), nl && (e.flags |= 4);
          var u = e.memoizedProps, i = e.stateNode;
          t = rl(u, i), i = rl(l.memoizedProps, i);
          var s = dl(u.default, u.update);
          s === "none" ? t = !1 : (u = l.memoizedState, l.memoizedState = null, l = e.child, yt = 0, t = qs(
            e,
            l,
            t,
            i,
            s,
            u,
            !0
          ), yt !== (u === null ? 0 : u.length) && (e.flags |= 32)), (e.flags & 4) !== 0 && t ? (tn(
            e,
            e.memoizedProps.onUpdate
          ), tl = n) : n !== null && (n.push.apply(n, tl), tl = n), nl = (e.flags & 32) !== 0 ? !0 : a;
          break;
        default:
          ka(t, e);
      }
  }
  function ul(e, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; )
        Bd(e, t.alternate, t), t = t.sibling;
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
          nt(l, l.return);
          var n = l.stateNode;
          typeof n.componentWillUnmount == "function" && jd(
            l,
            l.return,
            n
          ), Xl(
            l,
            a
          );
          break;
        case 27:
          (a & 2) !== 0 && Lm(
            l.stateNode,
            l.type,
            l.memoizedProps
          );
        case 5:
          nt(l, l.return), l.tag !== 5 && l.tag !== 27 || $n(l), Xl(
            l,
            a
          );
          break;
        case 6:
          $n(l);
          break;
        case 26:
          nt(l, l.return), n = l.stateNode, l.memoizedState !== null || n === null || Ae || n.parentNode.removeChild(n), Xl(
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
          nt(l, l.return), Xl(
            l,
            a
          );
          break;
        case 7:
          nt(l, l.return);
        default:
          Xl(
            l,
            a
          );
      }
      e = e.sibling;
    }
  }
  function Kt(e, t, l) {
    for (l = (t.subtreeFlags & 8772) !== 0 ? l : l & -2, t = t.child; t !== null; ) {
      var a = t.alternate, n = e, u = t, i = u.flags, s = (l & 1) !== 0;
      switch (u.tag) {
        case 0:
        case 11:
        case 15:
          Kt(
            n,
            u,
            l
          ), kn(4, u);
          break;
        case 1:
          if (Kt(
            n,
            u,
            l
          ), a = u, n = a.stateNode, typeof n.componentDidMount == "function")
            try {
              n.componentDidMount();
            } catch (T) {
              Oe(a, a.return, T);
            }
          if (a = u, n = a.updateQueue, n !== null) {
            var o = a.stateNode;
            try {
              var p = n.shared.hiddenCallbacks;
              if (p !== null)
                for (n.shared.hiddenCallbacks = null, n = 0; n < p.length; n++)
                  mr(p[n], o);
            } catch (T) {
              Oe(a, a.return, T);
            }
          }
          s && i & 64 && xd(u), el(u, u.return);
          break;
        case 27:
          (l & 2) !== 0 && Cd(u);
        case 5:
          u.tag !== 5 && u.tag !== 27 || Ad(u), Kt(
            n,
            u,
            l
          ), s && a === null && i & 4 && As(u), el(u, u.return);
          break;
        case 6:
          Ad(u);
          break;
        case 26:
          o = u.stateNode, u.memoizedState !== null || o === null || We || Nf(
            uu(o.ownerDocument),
            u.type,
            o
          ), Kt(
            n,
            u,
            l
          ), s && a === null && i & 4 && As(u), el(u, u.return);
          break;
        case 12:
          Kt(
            n,
            u,
            l
          );
          break;
        case 31:
          Kt(
            n,
            u,
            l
          ), s && i & 4 && Xd(n, u);
          break;
        case 13:
          Kt(
            n,
            u,
            l
          ), s && i & 4 && wd(n, u);
          break;
        case 22:
          u.memoizedState === null && Kt(
            n,
            u,
            l
          ), el(u, u.return);
          break;
        case 30:
          Kt(
            n,
            u,
            l
          ), el(u, u.return);
          break;
        case 7:
          el(u, u.return);
        default:
          Kt(
            n,
            u,
            l
          );
      }
      t = t.sibling;
    }
  }
  function Qs(e, t) {
    var l = null;
    e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (l = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== l && (e != null && e.refCount++, l != null && qn(l));
  }
  function Xs(e, t) {
    e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && qn(e));
  }
  function Yt(e, t, l, a) {
    var n = (l & 335544064) === l;
    if (t.subtreeFlags & (n ? 10262 : 10256))
      for (t = t.child; t !== null; )
        Kd(
          e,
          t,
          l,
          a
        ), t = t.sibling;
    else n && Ud(t);
  }
  function Kd(e, t, l, a) {
    var n = (l & 335544064) === l;
    n && t.alternate === null && t.return !== null && t.return.alternate !== null && pi(t);
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
        ), n && Bs && (e = e.containerInfo, e = e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, e.style.viewTransitionName === "root" && (e.style.viewTransitionName = ""), e = e.ownerDocument.documentElement, e !== null && e.style.viewTransitionName === "none" && (e.style.viewTransitionName = "")), u & 2048 && (u = null, t.alternate !== null && (u = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== u && (t.refCount++, u != null && qn(u)));
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
            var i = t.memoizedProps, s = i.id, o = i.onPostCommit;
            typeof o == "function" && o(
              s,
              t.alternate === null ? "mount" : "update",
              u.passiveEffectDuration,
              -0
            );
          } catch (p) {
            Oe(t, t.return, p);
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
        i = t.stateNode, s = t.alternate, t.memoizedState !== null ? (n && s !== null && s.memoizedState === null && pi(s), i._visibility & 2 ? Yt(
          e,
          t,
          l,
          a
        ) : Wn(
          e,
          t
        )) : (n && s !== null && s.memoizedState !== null && pi(t), i._visibility & 2 ? Yt(
          e,
          t,
          l,
          a
        ) : (i._visibility |= 2, $a(
          e,
          t,
          l,
          a,
          (t.subtreeFlags & 10256) !== 0 || !1
        ))), u & 2048 && Qs(s, t);
        break;
      case 24:
        Yt(
          e,
          t,
          l,
          a
        ), u & 2048 && Xs(t.alternate, t);
        break;
      case 30:
        n && (u = t.alternate, u !== null && (ll(u.child, !0), ll(t.child, !0))), Yt(
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
  function $a(e, t, l, a, n) {
    for (n = n && ((t.subtreeFlags & 10256) !== 0 || !1), t = t.child; t !== null; ) {
      var u = e, i = t, s = l, o = a, p = i.flags;
      switch (i.tag) {
        case 0:
        case 11:
        case 15:
          $a(
            u,
            i,
            s,
            o,
            n
          ), kn(8, i);
          break;
        case 23:
          break;
        case 22:
          var T = i.stateNode;
          i.memoizedState !== null ? T._visibility & 2 ? $a(
            u,
            i,
            s,
            o,
            n
          ) : Wn(
            u,
            i
          ) : (T._visibility |= 2, $a(
            u,
            i,
            s,
            o,
            n
          )), n && p & 2048 && Qs(
            i.alternate,
            i
          );
          break;
        case 24:
          $a(
            u,
            i,
            s,
            o,
            n
          ), n && p & 2048 && Xs(i.alternate, i);
          break;
        default:
          $a(
            u,
            i,
            s,
            o,
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
            Wn(l, a), n & 2048 && Qs(
              a.alternate,
              a
            );
            break;
          case 24:
            Wn(l, a), n & 2048 && Xs(a.alternate, a);
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
        Jd(
          e,
          t,
          l
        ), e = e.sibling;
  }
  function Jd(e, t, l) {
    switch (e.tag) {
      case 26:
        pa(
          e,
          t,
          l
        ), e.flags & ga && (e.memoizedState !== null ? hy(
          l,
          Vt,
          e.memoizedState,
          e.memoizedProps
        ) : (e = e.stateNode, (t & 335544128) === t && eh(l, e)));
        break;
      case 5:
        pa(
          e,
          t,
          l
        ), e.flags & ga && (e = e.stateNode, (t & 335544128) === t && eh(l, e));
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
          n.paired = null, At === null && (At = /* @__PURE__ */ new Map()), At.set(a, n);
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
  function kd(e) {
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
          Ie = a, Fd(
            a,
            e
          );
        }
      kd(e);
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
        e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, Ti(e)) : In(e);
        break;
      default:
        In(e);
    }
  }
  function Ti(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var l = 0; l < t.length; l++) {
          var a = t[l];
          Ie = a, Fd(
            a,
            e
          );
        }
      kd(e);
    }
    for (e = e.child; e !== null; ) {
      switch (t = e, t.tag) {
        case 0:
        case 11:
        case 15:
          Ql(8, t, t.return), Ti(t);
          break;
        case 22:
          l = t.stateNode, l._visibility & 2 && (l._visibility &= -3, Ti(t));
          break;
        default:
          Ti(t);
      }
      e = e.sibling;
    }
  }
  function Fd(e, t) {
    for (; Ie !== null; ) {
      var l = Ie;
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
      if (a = l.child, a !== null) a.return = l, Ie = a;
      else
        e: for (l = e; Ie !== null; ) {
          a = Ie;
          var n = a.sibling, u = a.return;
          if (Gd(a), a === l) {
            Ie = null;
            break e;
          }
          if (n !== null) {
            n.return = u, Ie = n;
            break e;
          }
          Ie = u;
        }
    }
  }
  var f0 = {
    getCacheForType: function(e) {
      var t = tt(we), l = t.data.get(e);
      return l === void 0 && (l = e(), t.data.set(e, l)), l;
    },
    cacheSignal: function() {
      return tt(we).controller.signal;
    }
  }, o0 = typeof WeakMap == "function" ? WeakMap : Map, je = 0, De = null, ge = null, be = 0, Ce = 0, zt = null, wl = !1, Fa = !1, ws = !1, _l = 0, Qe = 0, Zl = 0, ba = 0, Ei = 0, Ct = 0, Wa = 0, Pn = null, pt = null, Zs = !1, Ni = 0, Wd = 0, xi = 1 / 0, ji = null, Ll = null, Ye = 0, Jt = null, Sa = null, il = 0, Ls = 0, Vs = null, Id = null, Ia = null, Pa = null, en = null, eu = 0, Ai = null;
  function Ot() {
    return (je & 2) !== 0 && be !== 0 ? be & -be : Q.T !== null ? tf() : eo();
  }
  function Pd() {
    if (Ct === 0)
      if ((be & 536870912) === 0 || he) {
        var e = _u;
        _u <<= 1, (_u & 3932160) === 0 && (_u = 262144), Ct = e;
      } else Ct = 536870912;
    return e = lt.current, e !== null && (e.flags |= 32), Ct;
  }
  function tn(e, t) {
    if (t != null) {
      var l = e.stateNode, a = l.ref;
      a === null && (a = l.ref = Dm(
        rl(e.memoizedProps, l)
      )), Pa === null && (Pa = []), Pa.push(t.bind(null, a));
    }
  }
  function bt(e, t, l) {
    (e === De && (Ce === 2 || Ce === 9) || e.cancelPendingCommit !== null) && (ln(e, 0), Vl(
      e,
      be,
      Ct,
      !1
    )), _n(e, l), ((je & 2) === 0 || e !== De) && (e === De && ((je & 2) === 0 && (ba |= l), Qe === 4 && Vl(
      e,
      be,
      Ct,
      !1
    )), cl(e));
  }
  function em(e, t, l) {
    if ((je & 6) !== 0) throw Error(r(327));
    var a = !l && (t & 127) === 0 && (t & e.expiredLanes) === 0 || Sn(e, t), n = a ? m0(e, t) : Js(e, t, !0), u = a;
    do {
      if (n === 0) {
        Fa && !a && Vl(e, t, 0, !1);
        break;
      } else {
        if (l = e.current.alternate, u && !r0(l)) {
          n = Js(e, t, !1), u = !1;
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
              var s = e;
              n = Pn;
              var o = s.current.memoizedState.isDehydrated;
              if (o && (ln(s, i).flags |= 256), i = Js(
                s,
                i,
                !1
              ), i !== 2 && i !== 6) {
                if (ws && !o) {
                  s.errorRecoveryDisabledLanes |= u, ba |= u, n = 4;
                  break e;
                }
                u = pt, pt = n, u !== null && (pt === null ? pt = u : pt.push.apply(
                  pt,
                  u
                ));
              }
              n = i;
            }
            if (u = !1, n !== 2) continue;
          }
        }
        if (n === 1) {
          ln(e, 0), Vl(e, t, 0, !0);
          break;
        }
        e: {
          switch (a = e, u = n, u) {
            case 0:
            case 1:
              throw Error(r(345));
            case 4:
              if ((t & 4194048) !== t && (t & 62914560) !== t)
                break;
            case 6:
              Vl(
                a,
                t,
                Ct,
                !wl
              );
              break e;
            case 2:
              pt = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(r(329));
          }
          if ((t & 62914560) === t && (n = Ni + 300 - _t(), 10 < n)) {
            if (Vl(
              a,
              t,
              Ct,
              !wl
            ), Eu(a, 0, !0) !== 0) break e;
            il = t, a.timeoutHandle = mf(
              tm.bind(
                null,
                a,
                l,
                pt,
                ji,
                Zs,
                t,
                Ct,
                ba,
                Wa,
                wl,
                u,
                "Throttled",
                -0,
                0
              ),
              n
            );
            break e;
          }
          tm(
            a,
            l,
            pt,
            ji,
            Zs,
            t,
            Ct,
            ba,
            Wa,
            wl,
            u,
            null,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    cl(e);
  }
  function tm(e, t, l, a, n, u, i, s, o, p, T, A, v, _) {
    e.timeoutHandle = -1;
    var G = t.subtreeFlags, k = (u & 335544064) === u;
    if (A = null, (k || G & 8192 || (G & 16785408) === 16785408) && (A = {
      stylesheets: null,
      count: 0,
      imgCount: 0,
      imgBytes: 0,
      suspenseyImages: [],
      waitingForImages: !0,
      waitingForViewTransition: !1,
      unsuspend: Wt
    }, At = null, Jd(
      t,
      u,
      A
    ), k && (G = A, k = e.containerInfo, k = (k.nodeType === 9 ? k : k.ownerDocument).__reactViewTransition, k != null && (G.count++, G.waitingForViewTransition = !0, G = su.bind(G), k.finished.then(G, G))), G = (u & 62914560) === u ? Ni - _t() : (u & 4194048) === u ? Wd - _t() : 0, G = vy(
      A,
      G
    ), G !== null)) {
      il = u, e.cancelPendingCommit = G(
        fm.bind(
          null,
          e,
          t,
          u,
          l,
          a,
          n,
          i,
          s,
          o,
          p,
          T,
          A,
          null,
          v,
          _
        )
      ), Vl(e, u, i, !p);
      return;
    }
    fm(
      e,
      t,
      u,
      l,
      a,
      n,
      i,
      s,
      o,
      p,
      T,
      A
    );
  }
  function r0(e) {
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
  function Vl(e, t, l, a) {
    t = $f(e, t), t &= ~Ei, t &= ~ba, e.suspendedLanes |= t, e.pingedLanes &= ~t, a && (e.warmLanes |= t), a = e.expirationTimes;
    for (var n = t; 0 < n; ) {
      var u = 31 - Et(n), i = 1 << u;
      a[u] = -1, n &= ~i;
    }
    l !== 0 && Wf(e, l, t);
  }
  function zi() {
    return (je & 6) === 0 ? (tu(0), !1) : !0;
  }
  function Ks() {
    if (ge !== null) {
      if (Ce === 0)
        var e = ge.return;
      else
        e = ge, vl = ca = null, es(e), wa = null, Yn = 0, e = ge;
      for (; e !== null; )
        Nd(e.alternate, e), e = e.return;
      ge = null;
    }
  }
  function ln(e, t) {
    var l = e.timeoutHandle;
    return l !== -1 && (e.timeoutHandle = -1, q0(l)), l = e.cancelPendingCommit, l !== null && (e.cancelPendingCommit = null, l()), il = 0, Ks(), De = e, ge = l = ml(e.current, null), be = t, Ce = 0, zt = null, wl = !1, Fa = Sn(e, t), ws = !1, Wa = Ct = Ei = ba = Zl = Qe = 0, pt = Pn = null, Zs = !1, _l = $f(e, t), Hu(), l;
  }
  function lm(e, t) {
    oe = null, Q.H = ci, t === Xa || t === Ju ? (t = fr(), Ce = 3) : t === Xc ? (t = fr(), Ce = 4) : Ce = t === vs ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, zt = t, ge === null && (Qe = 1, si(
      e,
      Ut(t, e.current)
    ));
  }
  function am() {
    var e = lt.current;
    return e === null ? !0 : (be & 4194048) === be ? st === null : (be & 62914560) === be || (be & 536870912) !== 0 ? e === st : !1;
  }
  function nm() {
    var e = Q.H;
    return Q.H = ci, e === null ? ci : e;
  }
  function um() {
    var e = Q.A;
    return Q.A = f0, e;
  }
  function Ci() {
    Qe = 4, wl || (be & 4194048) !== be && lt.current !== null || (Fa = !0), (Zl & 134217727) === 0 && (ba & 134217727) === 0 || De === null || Vl(
      De,
      be,
      Ct,
      !1
    );
  }
  function Js(e, t, l) {
    var a = je;
    je |= 2;
    var n = nm(), u = um();
    (De !== e || be !== t) && (ji = null, ln(e, t)), t = !1;
    var i = Qe;
    e: do
      try {
        if (Ce !== 0 && ge !== null) {
          var s = ge, o = zt;
          switch (Ce) {
            case 8:
              Ks(), i = 6;
              break e;
            case 3:
            case 2:
            case 9:
            case 6:
              lt.current === null && (t = !0);
              var p = Ce;
              if (Ce = 0, zt = null, an(e, s, o, p), l && Fa) {
                i = 0;
                break e;
              }
              break;
            default:
              p = Ce, Ce = 0, zt = null, an(e, s, o, p);
          }
        }
        d0(), i = Qe;
        break;
      } catch (T) {
        lm(e, T);
      }
    while (!0);
    return t && e.shellSuspendCounter++, vl = ca = null, je = a, Q.H = n, Q.A = u, ge === null && (De = null, be = 0, Hu()), i;
  }
  function d0() {
    for (; ge !== null; ) im(ge);
  }
  function m0(e, t) {
    var l = je;
    je |= 2;
    var a = nm(), n = um();
    De !== e || be !== t ? (ji = null, xi = _t() + 500, ln(e, t)) : Fa = Sn(
      e,
      t
    );
    e: do
      try {
        if (Ce !== 0 && ge !== null) {
          t = ge;
          var u = zt;
          t: switch (Ce) {
            case 1:
              Ce = 0, zt = null, an(e, t, u, 1);
              break;
            case 2:
            case 9:
              if (cr(u)) {
                Ce = 0, zt = null, cm(t);
                break;
              }
              t = function() {
                Ce !== 2 && Ce !== 9 || De !== e || (Ce = 7), cl(e);
              }, u.then(t, t);
              break e;
            case 3:
              Ce = 7;
              break e;
            case 4:
              Ce = 5;
              break e;
            case 7:
              cr(u) ? (Ce = 0, zt = null, cm(t)) : (Ce = 0, zt = null, an(e, t, u, 7));
              break;
            case 5:
              var i = null;
              switch (ge.tag) {
                case 26:
                  i = ge.memoizedState;
                case 5:
                case 27:
                  var s = ge;
                  if (i ? Im(i) : s.stateNode.complete) {
                    Ce = 0, zt = null;
                    var o = s.sibling;
                    if (o !== null) ge = o;
                    else {
                      var p = s.return;
                      p !== null ? (ge = p, Oi(p)) : ge = null;
                    }
                    break t;
                  }
              }
              Ce = 0, zt = null, an(e, t, u, 5);
              break;
            case 6:
              Ce = 0, zt = null, an(e, t, u, 6);
              break;
            case 8:
              Ks(), Qe = 6;
              break e;
            default:
              throw Error(r(462));
          }
        }
        h0();
        break;
      } catch (T) {
        lm(e, T);
      }
    while (!0);
    return vl = ca = null, Q.H = a, Q.A = n, je = l, ge !== null ? 0 : (De = null, be = 0, Hu(), Qe);
  }
  function h0() {
    for (; ge !== null && !Rh(); )
      im(ge);
  }
  function im(e) {
    var t = Td(e.alternate, e, _l);
    e.memoizedProps = e.pendingProps, t === null ? Oi(e) : ge = t;
  }
  function cm(e) {
    var t = e, l = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = vd(
          l,
          t,
          t.pendingProps,
          t.type,
          void 0,
          be
        );
        break;
      case 11:
        t = vd(
          l,
          t,
          t.pendingProps,
          t.type.render,
          t.ref,
          be
        );
        break;
      case 5:
        es(t);
        var a = t;
        a === Fe && (he ? (wu(a), a.tag === 5 && a.stateNode != null && (qe = a.stateNode)) : (wu(a), he = !0));
      default:
        Nd(l, t), t = ge = Fo(t, _l), t = Td(l, t, _l);
    }
    e.memoizedProps = e.pendingProps, t === null ? Oi(e) : ge = t;
  }
  function an(e, t, l, a) {
    vl = ca = null, es(t), wa = null, Yn = 0;
    var n = t.return;
    try {
      if (t0(
        e,
        n,
        t,
        l,
        be
      )) {
        Qe = 1, si(
          e,
          Ut(l, e.current)
        ), ge = null;
        return;
      }
    } catch (u) {
      if (n !== null) throw ge = n, u;
      Qe = 1, si(
        e,
        Ut(l, e.current)
      ), ge = null;
      return;
    }
    t.flags & 32768 ? (he || a === 1 ? e = !0 : Fa || (be & 536870912) !== 0 ? e = !1 : (wl = e = !0, (a === 2 || a === 9 || a === 3 || a === 6) && (a = lt.current, a !== null && a.tag === 13 && (a.flags |= 16384))), sm(t, e)) : Oi(t);
  }
  function Oi(e) {
    var t = e;
    do {
      if ((t.flags & 32768) !== 0) {
        sm(
          t,
          wl
        );
        return;
      }
      e = t.return;
      var l = u0(
        t.alternate,
        t,
        _l
      );
      if (l !== null) {
        ge = l;
        return;
      }
      if (t = t.sibling, t !== null) {
        ge = t;
        return;
      }
      ge = t = e;
    } while (t !== null);
    Qe === 0 && (Qe = 5);
  }
  function sm(e, t) {
    do {
      var l = i0(e.alternate, e);
      if (l !== null) {
        l.flags &= 32767, ge = l;
        return;
      }
      if (l = e.return, l !== null && (l.flags |= 32768, l.subtreeFlags = 0, l.deletions = null), !t && (e = e.sibling, e !== null)) {
        ge = e;
        return;
      }
      ge = e = l;
    } while (e !== null);
    Qe = 6, ge = null;
  }
  function fm(e, t, l, a, n, u, i, s, o, p, T, A) {
    e.cancelPendingCommit = null;
    do
      Ri();
    while (Ye !== 0);
    if ((je & 6) !== 0) throw Error(r(327));
    if (t !== null) {
      if (t === e.current) throw Error(r(177));
      e === De && (ge = De = null, be = 0), Sa = t, Jt = e, il = l, Vs = n, Id = a, v0(
        e,
        t,
        l,
        i,
        s,
        o,
        A
      );
    }
  }
  function v0(e, t, l, a, n, u, i) {
    var s = t.lanes | t.childLanes;
    if (Ls = s, s |= zc, Xh(
      e,
      l,
      s,
      a,
      n,
      u
    ), Pa = null, (l & 335544064) === l ? (en = Zv(e), a = 10262) : (en = null, a = 10256), (t.subtreeFlags & a) !== 0 || (t.flags & a) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, _0(bu, function() {
      return Ws(), null;
    })) : (e.callbackNode = null, e.callbackPriority = 0), yi = !1, a = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || a) {
      a = Q.T, Q.T = null, n = ae.p, ae.p = 2, u = je, je |= 4;
      try {
        c0(e, t, l);
      } finally {
        je = u, ae.p = n, Q.T = a;
      }
    }
    Ye = 1, yi ? Ia = X0(
      i,
      e.containerInfo,
      en,
      ks,
      $s,
      g0,
      Fs,
      Ws,
      y0
    ) : (ks(), $s(), Fs());
  }
  function y0(e) {
    if (Ye !== 0) {
      var t = Jt.onRecoverableError;
      t(e, { componentStack: null });
    }
  }
  function g0() {
    Ye === 3 && (Ye = 0, Vd(Sa, Jt), Ye = 4);
  }
  function ks() {
    if (Ye === 1) {
      Ye = 0;
      var e = Jt, t = Sa, l = il, a = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || a) {
        a = Q.T, Q.T = null;
        var n = ae.p;
        ae.p = 2;
        var u = je;
        je |= 4;
        try {
          Fn = bi = !1, Zd(t, e, l), l = of;
          var i = Qo(e.containerInfo), s = l.focusedElem, o = l.selectionRange;
          if (i !== s && s && s.ownerDocument && Go(
            s.ownerDocument.documentElement,
            s
          )) {
            if (o !== null && Ec(s)) {
              var p = o.start, T = o.end;
              if (T === void 0 && (T = p), "selectionStart" in s)
                s.selectionStart = p, s.selectionEnd = Math.min(
                  T,
                  s.value.length
                );
              else {
                var A = s.ownerDocument || document, v = A && A.defaultView || window;
                if (v.getSelection) {
                  var _ = v.getSelection(), G = s.textContent.length, k = Math.min(o.start, G), re = o.end === void 0 ? k : Math.min(o.end, G);
                  !_.extend && k > re && (i = re, re = k, k = i);
                  var g = Yo(
                    s,
                    k
                  ), m = Yo(
                    s,
                    re
                  );
                  if (g && m && (_.rangeCount !== 1 || _.anchorNode !== g.node || _.anchorOffset !== g.offset || _.focusNode !== m.node || _.focusOffset !== m.offset)) {
                    var S = A.createRange();
                    S.setStart(g.node, g.offset), _.removeAllRanges(), k > re ? (_.addRange(S), _.extend(m.node, m.offset)) : (S.setEnd(m.node, m.offset), _.addRange(S));
                  }
                }
              }
            }
            for (A = [], _ = s; _ = _.parentNode; )
              _.nodeType === 1 && A.push({
                element: _,
                left: _.scrollLeft,
                top: _.scrollTop
              });
            for (typeof s.focus == "function" && s.focus(), s = 0; s < A.length; s++) {
              var j = A[s];
              j.element.scrollLeft = j.left, j.element.scrollTop = j.top;
            }
          }
          dn = !!ff, of = ff = null;
        } finally {
          je = u, ae.p = n, Q.T = a;
        }
      }
      e.current = t, Ye = 2;
    }
  }
  function $s() {
    if (Ye === 2) {
      Ye = 0;
      var e = Jt, t = Sa, l = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || l) {
        l = Q.T, Q.T = null;
        var a = ae.p;
        ae.p = 2;
        var n = je;
        je |= 4;
        try {
          Bd(e, t.alternate, t);
        } finally {
          je = n, ae.p = a, Q.T = l;
        }
      }
      Ye = 3;
    }
  }
  function Fs() {
    if (Ye === 4 || Ye === 3) {
      Ye = 0;
      var e = Ia;
      Ia = null, Mh();
      var t = Jt, l = Sa, a = il, n = Id, u = (a & 335544064) === a ? 10262 : 10256;
      if ((l.subtreeFlags & u) !== 0 || (l.flags & u) !== 0 ? Ye = 5 : (Ye = 0, Sa = Jt = null, om(t, t.pendingLanes)), u = t.pendingLanes, u === 0 && (Ll = null), uc(a), l = l.stateNode, Tt && typeof Tt.onCommitFiberRoot == "function")
        try {
          Tt.onCommitFiberRoot(
            bn,
            l,
            void 0,
            (l.current.flags & 128) === 128
          );
        } catch {
        }
      if (n !== null) {
        l = Q.T, u = ae.p, ae.p = 2, Q.T = null;
        try {
          for (var i = t.onRecoverableError, s = 0; s < n.length; s++) {
            var o = n[s];
            i(o.value, {
              componentStack: o.stack
            });
          }
        } finally {
          Q.T = l, ae.p = u;
        }
      }
      if (n = Pa, i = en, en = null, n !== null && (Pa = null, i === null && (i = []), e !== null))
        for (o = 0; o < n.length; o++)
          l = (0, n[o])(
            i
          ), l !== void 0 && e.finished.finally(l);
      (il & 3) !== 0 && Ri(), cl(t), u = t.pendingLanes, (a & 261930) !== 0 && (u & 42) !== 0 ? t === Ai ? eu++ : (eu = 0, Ai = t) : (eu = 0, Ai = null), tu(0);
    }
  }
  function om(e, t) {
    (e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, qn(t)));
  }
  function Ri() {
    return Ia !== null && (Ia.skipTransition(), Ia = null), ks(), $s(), Fs(), Ws();
  }
  function Ws() {
    if (Ye !== 5) return !1;
    var e = Jt, t = Ls;
    Ls = 0;
    var l = uc(il), a = Q.T, n = ae.p;
    try {
      ae.p = 32 > l ? 32 : l, Q.T = null, l = Vs, Vs = null;
      var u = Jt, i = il;
      if (Ye = 0, Sa = Jt = null, il = 0, (je & 6) !== 0) throw Error(r(331));
      var s = je;
      if (je |= 4, $d(u.current), Kd(
        u,
        u.current,
        i,
        l
      ), je = s, tu(0, !1), Tt && typeof Tt.onPostCommitFiberRoot == "function")
        try {
          Tt.onPostCommitFiberRoot(bn, u);
        } catch {
        }
      return !0;
    } finally {
      ae.p = n, Q.T = a, om(e, t);
    }
  }
  function rm(e, t, l) {
    t = Ut(l, t), t = hs(e.stateNode, t, 2), e = Hl(e, t, 2), e !== null && (_n(e, 2), cl(e));
  }
  function Oe(e, t, l) {
    if (e.tag === 3)
      rm(e, e, l);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          rm(
            t,
            e,
            l
          );
          break;
        } else if (t.tag === 1) {
          var a = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof a.componentDidCatch == "function" && (Ll === null || !Ll.has(a))) {
            e = Ut(l, e), l = cd(2), a = Hl(t, l, 2), a !== null && (sd(
              l,
              a,
              t,
              e
            ), _n(a, 2), cl(a));
            break;
          }
        }
        t = t.return;
      }
  }
  function Is(e, t, l) {
    var a = e.pingCache;
    if (a === null) {
      a = e.pingCache = new o0();
      var n = /* @__PURE__ */ new Set();
      a.set(t, n);
    } else
      n = a.get(t), n === void 0 && (n = /* @__PURE__ */ new Set(), a.set(t, n));
    n.has(l) || (ws = !0, n.add(l), e = p0.bind(null, e, t, l), t.then(e, e));
  }
  function p0(e, t, l) {
    var a = e.pingCache;
    a !== null && a.delete(t), e.pingedLanes |= e.suspendedLanes & l, e.warmLanes &= ~l, De === e && (be & l) === l && ((Qe === 4 || Qe === 3 && (be & 62914560) === be && 300 > _t() - Ni) && (je & 2) === 0 ? ln(e, 0) : Ei |= l, Wa === be && (Wa = 0)), cl(e);
  }
  function dm(e, t) {
    t === 0 && (t = Ff()), e = na(e, t), e !== null && (_n(e, t), cl(e));
  }
  function b0(e) {
    var t = e.memoizedState, l = 0;
    t !== null && (l = t.retryLane), dm(e, l);
  }
  function S0(e, t) {
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
        throw Error(r(314));
    }
    a !== null && a.delete(t), dm(e, l);
  }
  function _0(e, t) {
    return tc(e, t);
  }
  var nn = null, un = null, Ps = !1, Mi = !1, ef = !1, Kl = 0;
  function cl(e) {
    e !== un && e.next === null && (un === null ? nn = un = e : un = un.next = e), Mi = !0, Ps || (Ps = !0, E0());
  }
  function tu(e, t) {
    if (!ef && Mi) {
      ef = !0;
      do
        for (var l = !1, a = nn; a !== null; ) {
          if (e !== 0) {
            var n = a.pendingLanes;
            if (n === 0) var u = 0;
            else {
              var i = a.suspendedLanes, s = a.pingedLanes;
              u = (1 << 31 - Et(42 | e) + 1) - 1, u &= n & ~(i & ~s), u = u & 201326741 ? u & 201326741 | 1 : u ? u | 2 : 0;
            }
            u !== 0 && (l = !0, ym(a, u));
          } else
            u = be, u = Eu(
              a,
              a === De ? u : 0,
              a.cancelPendingCommit !== null || a.timeoutHandle !== -1
            ), (u & 3) === 0 || Sn(a, u) || (l = !0, ym(a, u));
          a = a.next;
        }
      while (l);
      ef = !1;
    }
  }
  function T0() {
    mm();
  }
  function mm() {
    Mi = Ps = !1;
    var e = 0;
    Kl !== 0 && U0() && (e = Kl);
    for (var t = _t(), l = null, a = nn; a !== null; ) {
      var n = a.next, u = hm(a, t);
      u === 0 ? (a.next = null, l === null ? nn = n : l.next = n, n === null && (un = l)) : (l = a, (e !== 0 || (u & 3) !== 0) && (Mi = !0)), a = n;
    }
    Ye !== 0 && Ye !== 5 || tu(e), Kl !== 0 && (Kl = 0);
  }
  function hm(e, t) {
    for (var l = e.suspendedLanes, a = e.pingedLanes, n = e.expirationTimes, u = e.pendingLanes & -62914561; 0 < u; ) {
      var i = 31 - Et(u), s = 1 << i, o = n[i];
      o === -1 ? ((s & l) === 0 || (s & a) !== 0) && (n[i] = Qh(s, t)) : o <= t && (e.expiredLanes |= s), u &= ~s;
    }
    if (t = De, l = be, l = Eu(
      e,
      e === t ? l : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), a = e.callbackNode, l === 0 || e === t && (Ce === 2 || Ce === 9) || e.cancelPendingCommit !== null)
      return a !== null && a !== null && lc(a), e.callbackNode = null, e.callbackPriority = 0;
    if ((l & 3) === 0 || Sn(e, l)) {
      if (t = l & -l, t === e.callbackPriority) return t;
      switch (a !== null && lc(a), uc(l)) {
        case 2:
        case 8:
          l = Jf;
          break;
        case 32:
          l = bu;
          break;
        case 268435456:
          l = kf;
          break;
        default:
          l = bu;
      }
      return a = vm.bind(null, e), l = tc(l, a), e.callbackPriority = t, e.callbackNode = l, t;
    }
    return a !== null && a !== null && lc(a), e.callbackPriority = 2, e.callbackNode = null, 2;
  }
  function vm(e, t) {
    if (Ye !== 0 && Ye !== 5)
      return e.callbackNode = null, e.callbackPriority = 0, null;
    var l = e.callbackNode;
    if (Ri() && e.callbackNode !== l)
      return null;
    var a = be;
    return a = Eu(
      e,
      e === De ? a : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), a === 0 ? null : (em(e, a, t), hm(e, _t()), e.callbackNode != null && e.callbackNode === l ? vm.bind(null, e) : null);
  }
  function ym(e, t) {
    if (Ri()) return null;
    em(e, t, !0);
  }
  function E0() {
    H0(function() {
      (je & 6) !== 0 ? tc(
        Kf,
        T0
      ) : mm();
    });
  }
  function tf() {
    if (Kl === 0) {
      var e = oa;
      e === 0 && (e = Su, Su <<= 1, (Su & 261888) === 0 && (Su = 256)), Kl = e;
    }
    return Kl;
  }
  function gm(e) {
    return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : zu(e);
  }
  function N0(e, t, l, a, n) {
    if (t === "submit" && l && l.stateNode === n) {
      var u = gm(
        (n[ht] || null).action
      ), i = a.submitter;
      i && (t = (t = i[ht] || null) ? gm(t.formAction) : i.getAttribute("formAction"), t !== null && (u = t, i = null));
      var s = new Mu(
        "action",
        "action",
        null,
        a,
        n
      );
      e.push({
        event: s,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (a.defaultPrevented) {
                if (Kl !== 0) {
                  var o = new FormData(n, i);
                  fs(
                    l,
                    {
                      pending: !0,
                      data: o,
                      method: n.method,
                      action: u
                    },
                    null,
                    o
                  );
                }
              } else
                typeof u == "function" && (s.preventDefault(), o = new FormData(n, i), fs(
                  l,
                  {
                    pending: !0,
                    data: o,
                    method: n.method,
                    action: u
                  },
                  u,
                  o
                ));
            },
            currentTarget: n
          }
        ]
      });
    }
  }
  for (var lf = 0; lf < Ac.length; lf++) {
    var af = Ac[lf], x0 = af.toLowerCase(), j0 = af[0].toUpperCase() + af.slice(1);
    Zt(
      x0,
      "on" + j0
    );
  }
  Zt(Zo, "onAnimationEnd"), Zt(Lo, "onAnimationIteration"), Zt(Vo, "onAnimationStart"), Zt("dblclick", "onDoubleClick"), Zt("focusin", "onFocus"), Zt("focusout", "onBlur"), Zt(qv, "onTransitionRun"), Zt(Hv, "onTransitionStart"), Zt(Bv, "onTransitionCancel"), Zt(Ko, "onTransitionEnd"), Aa("onMouseEnter", ["mouseout", "mouseover"]), Aa("onMouseLeave", ["mouseout", "mouseover"]), Aa("onPointerEnter", ["pointerout", "pointerover"]), Aa("onPointerLeave", ["pointerout", "pointerover"]), ta(
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
  ), A0 = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(lu)
  );
  function pm(e, t) {
    t = (t & 4) !== 0;
    for (var l = 0; l < e.length; l++) {
      var a = e[l], n = a.event;
      a = a.listeners;
      e: {
        var u = void 0;
        if (t)
          for (var i = a.length - 1; 0 <= i; i--) {
            var s = a[i], o = s.instance, p = s.currentTarget;
            if (s = s.listener, o !== u && n.isPropagationStopped())
              break e;
            u = s, n.currentTarget = p;
            try {
              u(n);
            } catch (T) {
              qu(T);
            }
            n.currentTarget = null, u = o;
          }
        else
          for (i = 0; i < a.length; i++) {
            if (s = a[i], o = s.instance, p = s.currentTarget, s = s.listener, o !== u && n.isPropagationStopped())
              break e;
            u = s, n.currentTarget = p;
            try {
              u(n);
            } catch (T) {
              qu(T);
            }
            n.currentTarget = null, u = o;
          }
      }
    }
  }
  function pe(e, t) {
    var l = t[lo];
    l === void 0 && (l = t[lo] = /* @__PURE__ */ new Set());
    var a = e + "__bubble";
    l.has(a) || (bm(t, e, 2, !1), l.add(a));
  }
  function nf(e, t, l) {
    var a = 0;
    t && (a |= 4), bm(
      l,
      e,
      a,
      t
    );
  }
  var Di = "_reactListening" + Math.random().toString(36).slice(2);
  function uf(e) {
    if (!e[Di]) {
      e[Di] = !0, uo.forEach(function(l) {
        l !== "selectionchange" && (A0.has(l) || nf(l, !1, e), nf(l, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[Di] || (t[Di] = !0, nf("selectionchange", !1, t));
    }
  }
  function bm(e, t, l, a) {
    switch (sh(t)) {
      case 2:
        var n = by;
        break;
      case 8:
        n = Sy;
        break;
      default:
        n = jf;
    }
    l = n.bind(
      null,
      t,
      l,
      e
    ), n = void 0, !mc || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (n = !0), a ? n !== void 0 ? e.addEventListener(t, l, {
      capture: !0,
      passive: n
    }) : e.addEventListener(t, l, !0) : n !== void 0 ? e.addEventListener(t, l, {
      passive: n
    }) : e.addEventListener(t, l, !1);
  }
  function cf(e, t, l, a, n) {
    var u = a;
    if ((t & 1) === 0 && (t & 2) === 0 && a !== null)
      e: for (; ; ) {
        if (a === null) return;
        var i = a.tag;
        if (i === 3 || i === 4) {
          var s = a.stateNode.containerInfo;
          if (s === n) break;
          if (i === 4)
            for (i = a.return; i !== null; ) {
              var o = i.tag;
              if ((o === 3 || o === 4) && i.stateNode.containerInfo === n)
                return;
              i = i.return;
            }
          for (; s !== null; ) {
            if (i = ea(s), i === null) return;
            if (o = i.tag, o === 5 || o === 6 || o === 26 || o === 27) {
              a = u = i;
              continue e;
            }
            s = s.parentNode;
          }
        }
        a = a.return;
      }
    bo(function() {
      var p = u, T = rc(l), A = [];
      e: {
        var v = Jo.get(e);
        if (v !== void 0) {
          var _ = Mu, G = e;
          switch (e) {
            case "keypress":
              if (Ou(l) === 0) break e;
            case "keydown":
            case "keyup":
              _ = rv;
              break;
            case "focusin":
              G = "focus", _ = gc;
              break;
            case "focusout":
              G = "blur", _ = gc;
              break;
            case "beforeblur":
            case "afterblur":
              _ = gc;
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
              _ = To;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              _ = Ph;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              _ = yv;
              break;
            case Zo:
            case Lo:
            case Vo:
              _ = lv;
              break;
            case Ko:
              _ = pv;
              break;
            case "scroll":
            case "scrollend":
              _ = Wh;
              break;
            case "wheel":
              _ = Sv;
              break;
            case "copy":
            case "cut":
            case "paste":
              _ = nv;
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
              _ = hv;
              break;
            case "toggle":
            case "beforetoggle":
              _ = Tv;
          }
          var k = (t & 4) !== 0, re = !k && (e === "scroll" || e === "scrollend"), g = k ? v !== null ? v + "Capture" : null : v;
          k = [];
          for (var m = p, S; m !== null; ) {
            var j = m;
            if (S = j.stateNode, j = j.tag, j !== 5 && j !== 26 && j !== 27 || S === null || g === null || (j = Nn(m, g), j != null && k.push(
              au(m, j, S)
            )), re) break;
            m = m.return;
          }
          0 < k.length && (v = new _(
            v,
            G,
            null,
            l,
            T
          ), A.push({ event: v, listeners: k }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (_ = e === "mouseover" || e === "pointerover", v = e === "mouseout" || e === "pointerout", _ && l !== oc && (G = l.relatedTarget || l.fromElement) && (ea(G) || G[Na]))
            break e;
          (v || _) && (G = T.window === T ? T : (_ = T.ownerDocument) ? _.defaultView || _.parentWindow : window, v ? (_ = l.relatedTarget || l.toElement, v = p, _ = _ ? ea(_) : null, _ !== null && (re = B(_), k = _.tag, _ !== re || k !== 5 && k !== 27 && k !== 6) && (_ = null)) : (v = null, _ = p), v !== _ && (k = To, j = "onMouseLeave", g = "onMouseEnter", m = "mouse", (e === "pointerout" || e === "pointerover") && (k = No, j = "onPointerLeave", g = "onPointerEnter", m = "pointer"), re = v == null ? G : En(v), S = _ == null ? G : En(_), G = new k(
            j,
            m + "leave",
            v,
            l,
            T
          ), G.target = re, G.relatedTarget = S, j = null, ea(T) === p && (k = new k(
            g,
            m + "enter",
            _,
            l,
            T
          ), k.target = S, k.relatedTarget = re, j = k), re = j, k = v && _ ? Ee(
            v,
            _,
            z0
          ) : null, v !== null && Sm(
            A,
            G,
            v,
            k,
            !1
          ), _ !== null && re !== null && Sm(
            A,
            re,
            _,
            k,
            !0
          )));
        }
        e: {
          if (v = p ? En(p) : window, _ = v.nodeName && v.nodeName.toLowerCase(), _ === "select" || _ === "input" && v.type === "file")
            var K = Mo;
          else if (Oo(v))
            if (Do)
              K = Mv;
            else {
              K = Ov;
              var Se = Cv;
            }
          else
            _ = v.nodeName, !_ || _.toLowerCase() !== "input" || v.type !== "checkbox" && v.type !== "radio" ? p && fc(p.elementType) && (K = Mo) : K = Rv;
          if (K && (K = K(e, p))) {
            Ro(
              A,
              K,
              l,
              T
            );
            break e;
          }
          Se && Se(e, v, p);
        }
        switch (Se = p ? En(p) : window, e) {
          case "focusin":
            (Oo(Se) || Se.contentEditable === "true") && (Da = Se, Nc = p, Mn = null);
            break;
          case "focusout":
            Mn = Nc = Da = null;
            break;
          case "mousedown":
            xc = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            xc = !1, Xo(A, l, T);
            break;
          case "selectionchange":
            if (Uv) break;
          case "keydown":
          case "keyup":
            Xo(A, l, T);
        }
        var le;
        if (bc)
          e: {
            switch (e) {
              case "compositionstart":
                var ie = "onCompositionStart";
                break e;
              case "compositionend":
                ie = "onCompositionEnd";
                break e;
              case "compositionupdate":
                ie = "onCompositionUpdate";
                break e;
            }
            ie = void 0;
          }
        else
          Ma ? zo(e, l) && (ie = "onCompositionEnd") : e === "keydown" && l.keyCode === 229 && (ie = "onCompositionStart");
        ie && (xo && l.locale !== "ko" && (Ma || ie !== "onCompositionStart" ? ie === "onCompositionEnd" && Ma && (le = So()) : (Al = T, hc = "value" in Al ? Al.value : Al.textContent, Ma = !0)), Se = Ui(p, ie), 0 < Se.length && (ie = new Eo(
          ie,
          e,
          null,
          l,
          T
        ), A.push({ event: ie, listeners: Se }), le ? ie.data = le : (le = Co(l), le !== null && (ie.data = le)))), (le = Nv ? xv(e, l) : jv(e, l)) && (ie = Ui(p, "onBeforeInput"), 0 < ie.length && (Se = new Eo(
          "onBeforeInput",
          "beforeinput",
          null,
          l,
          T
        ), A.push({
          event: Se,
          listeners: ie
        }), Se.data = le)), N0(
          A,
          e,
          p,
          l,
          T
        );
      }
      pm(A, t);
    });
  }
  function au(e, t, l) {
    return {
      instance: e,
      listener: t,
      currentTarget: l
    };
  }
  function Ui(e, t) {
    for (var l = t + "Capture", a = []; e !== null; ) {
      var n = e, u = n.stateNode;
      if (n = n.tag, n !== 5 && n !== 26 && n !== 27 || u === null || (n = Nn(e, l), n != null && a.unshift(
        au(e, n, u)
      ), n = Nn(e, t), n != null && a.push(
        au(e, n, u)
      )), e.tag === 3) return a;
      e = e.return;
    }
    return [];
  }
  function z0(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5 && e.tag !== 27);
    return e || null;
  }
  function Sm(e, t, l, a, n) {
    for (var u = t._reactName, i = []; l !== null && l !== a; ) {
      var s = l, o = s.alternate, p = s.stateNode;
      if (s = s.tag, o !== null && o === a) break;
      s !== 5 && s !== 26 && s !== 27 || p === null || (o = p, n ? (p = Nn(l, u), p != null && i.unshift(
        au(l, p, o)
      )) : n || (p = Nn(l, u), p != null && i.push(
        au(l, p, o)
      ))), l = l.return;
    }
    i.length !== 0 && e.push({ event: t, listeners: i });
  }
  var C0 = /\r\n?/g, O0 = /\u0000|\uFFFD/g;
  function _m(e) {
    return (typeof e == "string" ? e : "" + e).replace(C0, `
`).replace(O0, "");
  }
  function Tm(e, t) {
    return t = _m(t), _m(e) === t;
  }
  function Re(e, t, l, a, n, u) {
    switch (l) {
      case "children":
        if (typeof a == "string")
          t === "body" || t === "textarea" && a === "" || Ca(e, a);
        else if (typeof a == "number" || typeof a == "bigint")
          t !== "body" && Ca(e, "" + a);
        else return;
        break;
      case "className":
        Au(e, "class", a);
        break;
      case "tabIndex":
        Au(e, "tabindex", a);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        Au(e, l, a);
        break;
      case "style":
        go(e, a, u);
        return;
      case "data":
        if (t !== "object") {
          Au(e, "data", a);
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
        a = zu(a), e.setAttribute(l, a);
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
          typeof u == "function" && (l === "formAction" ? (t !== "input" && Re(e, t, "name", n.name, n, null), Re(
            e,
            t,
            "formEncType",
            n.formEncType,
            n,
            null
          ), Re(
            e,
            t,
            "formMethod",
            n.formMethod,
            n,
            null
          ), Re(
            e,
            t,
            "formTarget",
            n.formTarget,
            n,
            null
          )) : (Re(e, t, "encType", n.encType, n, null), Re(e, t, "method", n.method, n, null), Re(e, t, "target", n.target, n, null)));
        if (a == null || typeof a == "symbol" || typeof a == "boolean") {
          e.removeAttribute(l);
          break;
        }
        a = zu(a), e.setAttribute(l, a);
        break;
      case "onClick":
        a != null && (e.onclick = Wt);
        return;
      case "onScroll":
        a != null && pe("scroll", e);
        return;
      case "onScrollEnd":
        a != null && pe("scrollend", e);
        return;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(r(61));
          if (l = a.__html, l != null) {
            if (n.children != null) throw Error(r(60));
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
        l = zu(a), e.setAttributeNS(
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
        pe("beforetoggle", e), pe("toggle", e), ju(e, "popover", a);
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
        ju(e, "is", a);
        break;
      case "innerText":
      case "textContent":
        return;
      default:
        if (!(2 < l.length) || l[0] !== "o" && l[0] !== "O" || l[1] !== "n" && l[1] !== "N")
          l = $h.get(l) || l, ju(e, l, a);
        else return;
    }
    xe = !0;
  }
  function sf(e, t, l, a, n, u) {
    switch (l) {
      case "style":
        go(e, a, u);
        return;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(r(61));
          if (l = a.__html, l != null) {
            if (n.children != null) throw Error(r(60));
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
        a != null && pe("scroll", e);
        return;
      case "onScrollEnd":
        a != null && pe("scrollend", e);
        return;
      case "onClick":
        a != null && (e.onclick = Wt);
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
        if (!io.hasOwnProperty(l))
          e: {
            if (l[0] === "o" && l[1] === "n" && (n = l.endsWith("Capture"), u = l.slice(2, n ? l.length - 7 : void 0), t = e[ht] || null, t = t != null ? t[l] : null, typeof t == "function" && e.removeEventListener(u, t, n), typeof a == "function")) {
              typeof t != "function" && t !== null && (l in e ? e[l] = null : e.hasAttribute(l) && e.removeAttribute(l)), e.addEventListener(u, a, n);
              break e;
            }
            xe = !0, l in e ? e[l] = a : a === !0 ? e.setAttribute(l, "") : ju(e, l, a);
          }
        return;
    }
    xe = !0;
  }
  function ut(e, t, l) {
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
        pe("error", e), pe("load", e);
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
                  throw Error(r(137, t));
                default:
                  Re(e, t, u, i, l, null);
              }
          }
        n && Re(e, t, "srcSet", l.srcSet, l, null), a && Re(e, t, "src", l.src, l, null);
        return;
      case "input":
        pe("invalid", e);
        var s = u = i = n = null, o = null, p = null;
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
                  o = T;
                  break;
                case "defaultChecked":
                  p = T;
                  break;
                case "value":
                  u = T;
                  break;
                case "defaultValue":
                  s = T;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (T != null)
                    throw Error(r(137, t));
                  break;
                default:
                  Re(e, t, a, T, l, null);
              }
          }
        mo(
          e,
          u,
          s,
          o,
          p,
          i,
          n,
          !1
        );
        return;
      case "select":
        pe("invalid", e), a = i = u = null;
        for (n in l)
          if (l.hasOwnProperty(n) && (s = l[n], s != null))
            switch (n) {
              case "value":
                u = s;
                break;
              case "defaultValue":
                i = s;
                break;
              case "multiple":
                a = s;
              default:
                Re(e, t, n, s, l, null);
            }
        t = u, l = i, e.multiple = !!a, t != null ? za(e, !!a, t, !1) : l != null && za(e, !!a, l, !0);
        return;
      case "textarea":
        pe("invalid", e), u = n = a = null;
        for (i in l)
          if (l.hasOwnProperty(i) && (s = l[i], s != null))
            switch (i) {
              case "value":
                a = s;
                break;
              case "defaultValue":
                n = s;
                break;
              case "children":
                u = s;
                break;
              case "dangerouslySetInnerHTML":
                if (s != null) throw Error(r(91));
                break;
              default:
                Re(e, t, i, s, l, null);
            }
        vo(e, a, n, u);
        return;
      case "option":
        for (o in l)
          l.hasOwnProperty(o) && (a = l[o], a != null) && (o === "selected" ? e.selected = a && typeof a != "function" && typeof a != "symbol" : Re(e, t, o, a, l, null));
        return;
      case "dialog":
        pe("beforetoggle", e), pe("toggle", e), pe("cancel", e), pe("close", e);
        break;
      case "iframe":
      case "object":
        pe("load", e);
        break;
      case "video":
      case "audio":
        for (a = 0; a < lu.length; a++)
          pe(lu[a], e);
        break;
      case "image":
        pe("error", e), pe("load", e);
        break;
      case "details":
        pe("toggle", e);
        break;
      case "embed":
      case "source":
      case "link":
        pe("error", e), pe("load", e);
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
                throw Error(r(137, t));
              default:
                Re(e, t, p, a, l, null);
            }
        return;
      default:
        if (fc(t)) {
          for (T in l)
            l.hasOwnProperty(T) && (a = l[T], a !== void 0 && sf(
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
    for (s in l)
      l.hasOwnProperty(s) && (a = l[s], a != null && Re(e, t, s, a, l, null));
  }
  var R0 = {};
  function M0(e, t, l, a) {
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
        var n = null, u = null, i = null, s = null, o = null, p = null, T = null;
        for (_ in l) {
          var A = l[_];
          if (l.hasOwnProperty(_) && A != null)
            switch (_) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                o = A;
              default:
                a.hasOwnProperty(_) || Re(e, t, _, null, a, A);
            }
        }
        for (var v in a) {
          var _ = a[v];
          if (A = l[v], a.hasOwnProperty(v) && (_ != null || A != null))
            switch (v) {
              case "type":
                _ !== A && (xe = !0), u = _;
                break;
              case "name":
                _ !== A && (xe = !0), n = _;
                break;
              case "checked":
                _ !== A && (xe = !0), p = _;
                break;
              case "defaultChecked":
                _ !== A && (xe = !0), T = _;
                break;
              case "value":
                _ !== A && (xe = !0), i = _;
                break;
              case "defaultValue":
                _ !== A && (xe = !0), s = _;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (_ != null)
                  throw Error(r(137, t));
                break;
              default:
                _ !== A && Re(
                  e,
                  t,
                  v,
                  _,
                  a,
                  A
                );
            }
        }
        cc(
          e,
          i,
          s,
          o,
          p,
          T,
          u,
          n
        );
        return;
      case "select":
        _ = i = s = v = null;
        for (u in l)
          if (o = l[u], l.hasOwnProperty(u) && o != null)
            switch (u) {
              case "value":
                break;
              case "multiple":
                _ = o;
              default:
                a.hasOwnProperty(u) || Re(
                  e,
                  t,
                  u,
                  null,
                  a,
                  o
                );
            }
        for (n in a)
          if (u = a[n], o = l[n], a.hasOwnProperty(n) && (u != null || o != null))
            switch (n) {
              case "value":
                u !== o && (xe = !0), v = u;
                break;
              case "defaultValue":
                u !== o && (xe = !0), s = u;
                break;
              case "multiple":
                u !== o && (xe = !0), i = u;
              default:
                u !== o && Re(
                  e,
                  t,
                  n,
                  u,
                  a,
                  o
                );
            }
        t = s, l = i, a = _, v != null ? za(e, !!l, v, !1) : !!a != !!l && (t != null ? za(e, !!l, t, !0) : za(e, !!l, l ? [] : "", !1));
        return;
      case "textarea":
        _ = v = null;
        for (s in l)
          if (n = l[s], l.hasOwnProperty(s) && n != null && !a.hasOwnProperty(s))
            switch (s) {
              case "value":
                break;
              case "children":
                break;
              default:
                Re(e, t, s, null, a, n);
            }
        for (i in a)
          if (n = a[i], u = l[i], a.hasOwnProperty(i) && (n != null || u != null))
            switch (i) {
              case "value":
                n !== u && (xe = !0), v = n;
                break;
              case "defaultValue":
                n !== u && (xe = !0), _ = n;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (n != null) throw Error(r(91));
                break;
              default:
                n !== u && Re(e, t, i, n, a, u);
            }
        ho(e, v, _);
        return;
      case "option":
        for (var G in l)
          v = l[G], l.hasOwnProperty(G) && v != null && !a.hasOwnProperty(G) && (G === "selected" ? e.selected = !1 : Re(
            e,
            t,
            G,
            null,
            a,
            v
          ));
        for (o in a)
          v = a[o], _ = l[o], a.hasOwnProperty(o) && v !== _ && (v != null || _ != null) && (o === "selected" ? (v !== _ && (xe = !0), e.selected = v && typeof v != "function" && typeof v != "symbol") : Re(
            e,
            t,
            o,
            v,
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
        for (var k in l)
          v = l[k], l.hasOwnProperty(k) && v != null && !a.hasOwnProperty(k) && Re(e, t, k, null, a, v);
        for (p in a)
          if (v = a[p], _ = l[p], a.hasOwnProperty(p) && v !== _ && (v != null || _ != null))
            switch (p) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (v != null)
                  throw Error(r(137, t));
                break;
              default:
                Re(
                  e,
                  t,
                  p,
                  v,
                  a,
                  _
                );
            }
        return;
      default:
        if (fc(t)) {
          for (var re in l)
            v = l[re], l.hasOwnProperty(re) && v !== void 0 && !a.hasOwnProperty(re) && sf(
              e,
              t,
              re,
              void 0,
              a,
              v
            );
          for (T in a)
            v = a[T], _ = l[T], !a.hasOwnProperty(T) || v === _ || v === void 0 && _ === void 0 || sf(
              e,
              t,
              T,
              v,
              a,
              _
            );
          return;
        }
    }
    for (var g in l)
      v = l[g], l.hasOwnProperty(g) && v != null && !a.hasOwnProperty(g) && Re(e, t, g, null, a, v);
    for (A in a)
      v = a[A], _ = l[A], !a.hasOwnProperty(A) || v === _ || v == null && _ == null || Re(e, t, A, v, a, _);
  }
  function Em(e) {
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
  function D0() {
    if (typeof performance.getEntriesByType == "function") {
      for (var e = 0, t = 0, l = performance.getEntriesByType("resource"), a = 0; a < l.length; a++) {
        var n = l[a], u = n.transferSize, i = n.initiatorType, s = n.duration;
        if (u && s && Em(i)) {
          for (i = 0, s = n.responseEnd, a += 1; a < l.length; a++) {
            var o = l[a], p = o.startTime;
            if (p > s) break;
            var T = o.transferSize, A = o.initiatorType;
            T && Em(A) && (o = o.responseEnd, i += T * (o < s ? 1 : (s - p) / (o - p)));
          }
          if (--a, t += 8 * (u + i) / (n.duration / 1e3), e++, 10 < e) break;
        }
      }
      if (0 < e) return t / e / 1e6;
    }
    return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
  }
  var ff = null, of = null;
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
  function xm(e, t) {
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
  function jm(e, t, l, a) {
    return l = nu(
      l
    ).createElement(e), l[et] = a, l[ht] = t, ut(l, e, t), $e(l), l;
  }
  function rf(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var df = null;
  function U0() {
    var e = window.event;
    return e && e.type === "popstate" ? e === df ? !1 : (df = e, !0) : (df = null, !1);
  }
  var mf = typeof setTimeout == "function" ? setTimeout : void 0, q0 = typeof clearTimeout == "function" ? clearTimeout : void 0, Am = typeof Promise == "function" ? Promise : void 0, zm = typeof requestAnimationFrame == "function" ? requestAnimationFrame : mf, H0 = typeof queueMicrotask == "function" ? queueMicrotask : typeof Am < "u" ? function(e) {
    return Am.resolve(null).then(e).catch(B0);
  } : mf;
  function B0(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function Jl(e) {
    return e === "head";
  }
  function Cm(e, t) {
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
          _f(
            e.ownerDocument.documentElement
          );
        else if (l === "head") {
          l = e.ownerDocument.head, _f(l);
          for (var u = l.firstChild; u; ) {
            var i = u.nextSibling, s = u.nodeName;
            u[Tn] || s === "SCRIPT" || s === "STYLE" || s === "LINK" && u.rel.toLowerCase() === "stylesheet" || l.removeChild(u), u = i;
          }
        } else
          l === "body" && _f(e.ownerDocument.body);
      l = n;
    } while (l);
    mn(t);
  }
  function Om(e, t) {
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
  function Rm(e, t, l) {
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
  function Mm(e, t) {
    e = e.style, t = t.style;
    var l = t != null ? t.hasOwnProperty("viewTransitionName") ? t.viewTransitionName : t.hasOwnProperty("view-transition-name") ? t["view-transition-name"] : null : null;
    e.viewTransitionName = l == null || typeof l == "boolean" ? "" : ("" + l).trim(), l = t != null ? t.hasOwnProperty("viewTransitionClass") ? t.viewTransitionClass : t.hasOwnProperty("view-transition-class") ? t["view-transition-class"] : null : null, e.viewTransitionClass = l == null || typeof l == "boolean" ? "" : ("" + l).trim(), e.display === "inline-block" && (t == null ? e.display = e.margin = "" : (l = t.display, e.display = l == null || typeof l == "boolean" ? "" : l, l = t.margin, l != null ? e.margin = l : (l = t.hasOwnProperty("marginTop") ? t.marginTop : t["margin-top"], e.marginTop = l == null || typeof l == "boolean" ? "" : l, t = t.hasOwnProperty("marginBottom") ? t.marginBottom : t["margin-bottom"], e.marginBottom = t == null || typeof t == "boolean" ? "" : t)));
  }
  function Y0(e, t, l) {
    return l = l.ownerDocument.defaultView, {
      rect: e,
      abs: t.position === "absolute" || t.position === "fixed",
      clip: t.clipPath !== "none" || t.overflow !== "visible" || t.filter !== "none" || t.mask !== "none" || t.mask !== "none" || t.borderRadius !== "0px",
      view: 0 <= e.bottom && 0 <= e.right && e.top <= l.innerHeight && e.left <= l.innerWidth
    };
  }
  function hf(e) {
    var t = e.getBoundingClientRect(), l = getComputedStyle(e);
    return Y0(t, l, e);
  }
  function G0(e) {
    return e.documentElement.clientHeight;
  }
  function Q0(e) {
    this.addEventListener("load", e), this.addEventListener("error", e);
  }
  function X0(e, t, l, a, n, u, i, s, o) {
    var p = t.nodeType === 9 ? t : t.ownerDocument;
    try {
      var T = p.startViewTransition({
        update: function() {
          var v = p.defaultView, _ = v.navigation && v.navigation.transition, G = p.fonts.status;
          a();
          var k = [];
          if (G === "loaded" && (G0(p), p.fonts.status === "loading" && k.push(p.fonts.ready)), G = k.length, e !== null)
            for (var re = e.suspenseyImages, g = 0, m = 0; m < re.length; m++) {
              var S = re[m];
              if (!S.complete) {
                var j = S.getBoundingClientRect();
                if (0 < j.bottom && 0 < j.right && j.top < v.innerHeight && j.left < v.innerWidth) {
                  if (g += Pm(S), g > Bi) {
                    k.length = G;
                    break;
                  }
                  S = new Promise(
                    Q0.bind(S)
                  ), k.push(S);
                }
              }
            }
          if (0 < k.length)
            return v = Promise.race([
              Promise.all(k),
              new Promise(function(K) {
                return setTimeout(K, 500);
              })
            ]).then(n, n), (_ ? Promise.allSettled([_.finished, v]) : v).then(u, u);
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
      var A = [];
      return T.ready.then(
        function() {
          for (var v = p.documentElement.getAnimations({
            subtree: !0
          }), _ = 0; _ < v.length; _++) {
            var G = v[_], k = G.effect, re = k.pseudoElement;
            if (re != null && re.startsWith("::view-transition")) {
              A.push(G), G = k.getKeyframes();
              for (var g = re = void 0, m = !0, S = 0; S < G.length; S++) {
                var j = G[S], K = j.width;
                if (re === void 0) re = K;
                else if (re !== K) {
                  m = !1;
                  break;
                }
                if (K = j.height, g === void 0) g = K;
                else if (g !== K) {
                  m = !1;
                  break;
                }
                delete j.width, delete j.height, j.transform === "none" && delete j.transform;
              }
              m && re !== void 0 && g !== void 0 && (k.setKeyframes(G), m = getComputedStyle(
                k.target,
                k.pseudoElement
              ), m.width !== re || m.height !== g) && (m = G[0], m.width = re, m.height = g, m = G[G.length - 1], m.width = re, m.height = g, k.setKeyframes(G));
            }
          }
          i();
        },
        function(v) {
          p.__reactViewTransition === T && (p.__reactViewTransition = null);
          try {
            typeof v == "object" && v !== null && v.name === "InvalidStateError" && (v.message === "View transition was skipped because document visibility state is hidden." || v.message === "Skipping view transition because document visibility state has become hidden." || v.message === "Skipping view transition because viewport size changed." || v.message === "Transition was aborted because of invalid state") && (v = null), v !== null && o(v);
          } finally {
            a(), n(), i();
          }
        }
      ), T.finished.finally(function() {
        for (var v = 0; v < A.length; v++)
          A[v].cancel();
        p.__reactViewTransition === T && (p.__reactViewTransition = null), s();
      }), T;
    } catch {
      return a(), n(), i(), null;
    }
  }
  function _a(e, t) {
    this._scope = document.documentElement, this._selector = "::view-transition-" + e + "(" + t + ")";
  }
  _a.prototype.animate = function(e, t) {
    return t = typeof t == "number" ? { duration: t } : w({}, t), t.pseudoElement = this._selector, this._scope.animate(e, t);
  }, _a.prototype.getAnimations = function() {
    for (var e = this._scope, t = this._selector, l = e.getAnimations({ subtree: !0 }), a = [], n = 0; n < l.length; n++) {
      var u = l[n].effect;
      u !== null && u.target === e && u.pseudoElement === t && a.push(l[n]);
    }
    return a;
  }, _a.prototype.getComputedStyle = function() {
    return getComputedStyle(this._scope, this._selector);
  };
  function Dm(e) {
    return {
      name: e,
      group: new _a("group", e),
      imagePair: new _a("image-pair", e),
      old: new _a("old", e),
      new: new _a("new", e)
    };
  }
  function Rt(e) {
    this._fragmentFiber = e, this._observers = this._eventListeners = null;
  }
  Rt.prototype.addEventListener = function(e, t, l) {
    var a = null, n = null;
    if (!(l != null && typeof l != "boolean" && (a = l.signal || null, a !== null && a.aborted))) {
      this._eventListeners === null && (this._eventListeners = []);
      var u = this._eventListeners;
      if (qm(u, e, t, l) === -1) {
        var i = this, s = t;
        l != null && typeof l != "boolean" && l.once === !0 && (s = function(o) {
          i.removeEventListener(
            e,
            t,
            l
          ), typeof t == "function" ? t.call(this, o) : t.handleEvent(o);
        }), a !== null && (n = i.removeEventListener.bind(
          i,
          e,
          t,
          l
        ), a.addEventListener("abort", n, { once: !0 }), n = a.removeEventListener.bind(a, "abort", n)), a = cn(l), u.push({
          type: e,
          listener: t,
          optionsOrUseCapture: l,
          attachedListener: s,
          cleanup: n
        }), y(
          this._fragmentFiber.child,
          !1,
          w0,
          e,
          s,
          a
        );
      }
      this._eventListeners = u;
    }
  };
  function w0(e, t, l, a) {
    return W(e).addEventListener(
      t,
      l,
      a
    ), !1;
  }
  Rt.prototype.removeEventListener = function(e, t, l) {
    var a = this._eventListeners;
    if (a !== null && (t = qm(
      a,
      e,
      t,
      l
    ), t !== -1)) {
      var n = a[t];
      l = n.attachedListener;
      var u = n.cleanup;
      n = cn(n.optionsOrUseCapture), y(
        this._fragmentFiber.child,
        !1,
        Z0,
        e,
        l,
        n
      ), a.splice(t, 1), u !== null && u();
    }
  };
  function Z0(e, t, l, a) {
    return W(e).removeEventListener(
      t,
      l,
      a
    ), !1;
  }
  function cn(e) {
    return e != null && typeof e != "boolean" && (e.once === !0 || e.signal instanceof AbortSignal) ? { capture: e.capture, passive: e.passive } : e;
  }
  function Um(e) {
    return e == null ? "c=0" : typeof e == "boolean" ? "c=" + (e ? "1" : "0") : "c=" + (e.capture ? "1" : "0");
  }
  function qm(e, t, l, a) {
    if (e.length === 0) return -1;
    a = Um(a);
    for (var n = 0; n < e.length; n++) {
      var u = e[n];
      if (u.type === t && u.listener === l && Um(u.optionsOrUseCapture) === a)
        return n;
    }
    return -1;
  }
  Rt.prototype.dispatchEvent = function(e) {
    var t = N(
      this._fragmentFiber
    );
    if (t === null) return !0;
    t = W(t);
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
  }, Rt.prototype.focus = function(e) {
    y(
      this._fragmentFiber.child,
      !0,
      Hm,
      e,
      void 0,
      void 0
    );
  };
  function Hm(e, t) {
    return e.tag === 6 ? !1 : (e = W(e), ty(e, t));
  }
  Rt.prototype.focusLast = function(e) {
    var t = [];
    y(
      this._fragmentFiber.child,
      !0,
      vf,
      t,
      void 0,
      void 0
    );
    for (var l = t.length - 1; 0 <= l && !Hm(t[l], e); l--) ;
  };
  function vf(e, t) {
    return t.push(e), !1;
  }
  Rt.prototype.blur = function() {
    var e = N(
      this._fragmentFiber
    );
    e !== null && (e = W(e), e = nu(e).activeElement, e !== null && y(
      this._fragmentFiber.child,
      !1,
      L0,
      e,
      void 0,
      void 0
    ));
  };
  function L0(e, t) {
    return e.tag === 6 ? !1 : (e = W(e), e === t || e.contains(t) ? (t.blur(), !0) : !1);
  }
  Rt.prototype.observeUsing = function(e) {
    this._observers === null && (this._observers = /* @__PURE__ */ new Set()), this._observers.add(e), y(
      this._fragmentFiber.child,
      !1,
      V0,
      e,
      void 0,
      void 0
    );
  };
  function V0(e, t) {
    return e.tag === 6 || (e = W(e), t.observe(e)), !1;
  }
  Rt.prototype.unobserveUsing = function(e) {
    var t = this._observers;
    if (t !== null && t.has(e)) {
      t.delete(e), y(
        this._fragmentFiber.child,
        !1,
        K0,
        e,
        void 0,
        void 0
      );
      for (var l = t = 0; l < kt.length; l++) {
        var a = kt[l];
        a.fragmentInstance === this && a.observer === e ? e.unobserve(a.instance) : kt[t++] = a;
      }
      kt.length = t;
    }
  };
  function K0(e, t) {
    return e.tag === 6 || (e = W(e), t.unobserve(e)), !1;
  }
  var kt = [], yf = !1;
  function J0(e, t, l) {
    kt.push({
      fragmentInstance: e,
      observer: t,
      instance: l
    }), yf || (yf = !0, ly(function() {
      yf = !1;
      var a = kt;
      kt = [];
      for (var n = 0; n < a.length; n++) {
        var u = a[n];
        u.observer.unobserve(u.instance);
      }
    }));
  }
  Rt.prototype.getClientRects = function() {
    var e = [];
    return y(
      this._fragmentFiber.child,
      !1,
      k0,
      e,
      void 0,
      void 0
    ), e;
  };
  function k0(e, t) {
    if (e.tag === 6) {
      e = e.stateNode;
      var l = e.ownerDocument.createRange();
      l.selectNodeContents(e), t.push.apply(t, l.getClientRects());
    } else
      e = W(e), t.push.apply(t, e.getClientRects());
    return !1;
  }
  Rt.prototype.getRootNode = function(e) {
    var t = N(
      this._fragmentFiber
    );
    return t === null ? this : W(t).getRootNode(e);
  }, Rt.prototype.compareDocumentPosition = function(e) {
    var t = N(
      this._fragmentFiber
    );
    if (t === null) return Node.DOCUMENT_POSITION_DISCONNECTED;
    var l = [];
    y(
      this._fragmentFiber.child,
      !1,
      vf,
      l,
      void 0,
      void 0
    );
    var a = W(t);
    if (l.length === 0) {
      if (l = a, z(this._fragmentFiber)) {
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
      return l === e ? n = Node.DOCUMENT_POSITION_CONTAINS : a & Node.DOCUMENT_POSITION_CONTAINED_BY && (l = Y(t)[1], l === null ? n = Node.DOCUMENT_POSITION_PRECEDING : (e = W(l).compareDocumentPosition(
        e
      ), n = e === 0 || e & Node.DOCUMENT_POSITION_FOLLOWING ? Node.DOCUMENT_POSITION_FOLLOWING : Node.DOCUMENT_POSITION_PRECEDING)), n |= Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
    }
    t = W(l[0]), n = W(l[l.length - 1]);
    var u = z(this._fragmentFiber) ? t.parentElement : a;
    if (u == null)
      return Node.DOCUMENT_POSITION_DISCONNECTED;
    a = u.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_CONTAINED_BY, u = u.compareDocumentPosition(n) & Node.DOCUMENT_POSITION_CONTAINED_BY;
    var i = t.compareDocumentPosition(e), s = n.compareDocumentPosition(e), o = i & Node.DOCUMENT_POSITION_CONTAINED_BY || s & Node.DOCUMENT_POSITION_CONTAINED_BY;
    return s = a && u && i & Node.DOCUMENT_POSITION_FOLLOWING && s & Node.DOCUMENT_POSITION_PRECEDING, t = a && t === e || u && n === e || o || s ? Node.DOCUMENT_POSITION_CONTAINED_BY : !a && t === e || !u && n === e ? Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC : i, t & Node.DOCUMENT_POSITION_DISCONNECTED || t & Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC || $0(
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
        for (u = t, t = N(t); u !== null; ) {
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
    return e & Node.DOCUMENT_POSITION_PRECEDING ? ((t = !!u) && !(t = u === l) && (t = Ee(
      l,
      u,
      fe
    ), t === null ? t = !1 : (y(
      t,
      !0,
      ve,
      u,
      l
    ), u = ze, ze = null, t = u !== null)), t) : e & Node.DOCUMENT_POSITION_FOLLOWING ? ((t = !!u) && !(t = u === a) && (t = Ee(
      a,
      u,
      fe
    ), t === null ? t = !1 : (y(
      t,
      !0,
      se,
      u,
      a
    ), u = ze, de = ze = null, t = u !== null)), t) : !1;
  }
  function Bm(e, t) {
    var l = e.ownerDocument.createRange();
    l.selectNodeContents(e), e = l.getBoundingClientRect(), window.scrollTo(
      window.scrollX + e.left,
      t ? window.scrollY + e.top : window.scrollY + e.bottom - window.innerHeight
    );
  }
  Rt.prototype.scrollIntoView = function(e) {
    if (typeof e == "object") throw Error(r(566));
    var t = [];
    y(
      this._fragmentFiber.child,
      !1,
      vf,
      t,
      void 0,
      void 0
    );
    var l = e !== !1;
    if (t.length === 0) {
      var a = Y(
        this._fragmentFiber
      );
      if (a = l ? a[1] || a[0] || N(this._fragmentFiber) : a[0] || a[1], a === null) return;
      if (a.tag === 6) {
        e = W(a), Bm(e, l);
        return;
      }
      if (a = W(a), a.nodeType !== 9) {
        if (a.nodeType === 11) {
          l = "host" in a ? a.host : null, l !== null && l.scrollIntoView(e);
          return;
        }
        a.scrollIntoView(e);
      }
    }
    for (a = l ? t.length - 1 : 0; a !== (l ? -1 : t.length); ) {
      var n = t[a];
      n.tag === 6 ? (n = W(n), Bm(n, l)) : W(n).scrollIntoView(e), a += l ? -1 : 1;
    }
  };
  function F0(e, t) {
    return e = W(e), Ym(e, t), !1;
  }
  function Ym(e, t) {
    e.reactFragments == null && (e.reactFragments = /* @__PURE__ */ new Set()), e.reactFragments.add(t);
  }
  function Gm(e, t) {
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
      for (var i = 0, s = 0; s < kt.length; s++) {
        var o = kt[s];
        (o.fragmentInstance !== t || o.observer !== u || o.instance !== e) && (kt[i++] = o);
      }
      kt.length = i, u.observe(e);
    }), Ym(e, t));
  }
  function W0(e, t) {
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
      typeof u.rootMargin == "string" ? J0(
        t,
        u,
        e
      ) : u.unobserve(e);
    }), e.reactFragments != null && e.reactFragments.delete(t));
  }
  function gf(e) {
    var t = e.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var l = t;
      switch (t = t.nextSibling, l.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          gf(l), xu(l);
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
  function I0(e, t, l, a) {
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
  function P0(e, t, l) {
    if (t === "") return null;
    for (; e.nodeType !== 3; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !l || (e = Gt(e.nextSibling), e === null)) return null;
    return e;
  }
  function Qm(e, t) {
    for (; e.nodeType !== 8; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = Gt(e.nextSibling), e === null)) return null;
    return e;
  }
  function pf(e) {
    return e.data === "$?" || e.data === "$~";
  }
  function bf(e) {
    return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
  }
  function ey(e, t) {
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
  var Sf = null;
  function Xm(e) {
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
  function wm(e) {
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
  function ty(e, t) {
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
  function ly(e) {
    zm(function() {
      zm(function(t) {
        return e(t);
      });
    });
  }
  function Zm(e, t, l) {
    switch (t = nu(l), e) {
      case "html":
        if (e = t.documentElement, !e) throw Error(r(452));
        return e;
      case "head":
        if (e = t.head, !e) throw Error(r(453));
        return e;
      case "body":
        if (e = t.body, !e) throw Error(r(454));
        return e;
      default:
        throw Error(r(451));
    }
  }
  function Lm(e, t, l) {
    for (var a in l) {
      var n = l[a];
      l.hasOwnProperty(a) && n != null && Re(e, t, a, null, R0, n);
    }
    l.dangerouslySetInnerHTML != null && (e.textContent = ""), e.onclick === Wt && (e.onclick = null), xu(e);
  }
  function _f(e) {
    for (var t = e.attributes; t.length; )
      e.removeAttributeNode(t[0]);
    xu(e);
  }
  var Qt = /* @__PURE__ */ new Map(), Vm = /* @__PURE__ */ new Set();
  function uu(e) {
    if (typeof e.getRootNode == "function") {
      var t = e.getRootNode();
      if (t.nodeType === 9 || t.nodeType === 11) return t;
    }
    return e.nodeType === 9 ? e : e.ownerDocument;
  }
  var Tl = ae.d;
  ae.d = {
    f: ay,
    r: ny,
    D: uy,
    C: iy,
    L: cy,
    m: sy,
    X: oy,
    S: fy,
    M: ry
  };
  function ay() {
    var e = Tl.f(), t = zi();
    return e || t;
  }
  function ny(e) {
    var t = xa(e);
    t !== null && t.tag === 5 && t.type === "form" ? Jr(t) : Tl.r(e);
  }
  var sn = typeof document > "u" ? null : document;
  function Km(e, t, l) {
    var a = sn;
    if (a && typeof t == "string" && t) {
      var n = Mt(t);
      n = 'link[rel="' + e + '"][href="' + n + '"]', typeof l == "string" && (n += '[crossorigin="' + l + '"]'), Vm.has(n) || (Vm.add(n), e = { rel: e, crossOrigin: l, href: t }, a.querySelector(n) === null && (t = a.createElement("link"), ut(t, "link", e), $e(t), a.head.appendChild(t)));
    }
  }
  function uy(e) {
    Tl.D(e), Km("dns-prefetch", e, null);
  }
  function iy(e, t) {
    Tl.C(e, t), Km("preconnect", e, t);
  }
  function cy(e, t, l) {
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
      if (!(Qt.has(u) || (e = w(
        {
          rel: "preload",
          href: t === "image" && l && l.imageSrcSet ? void 0 : e,
          as: t
        },
        l
      ), Qt.set(u, e), a.querySelector(n) !== null || t === "style" && a.querySelector(iu(u)) || t === "script" && a.querySelector(cu(u))))) {
        var i = a.createElement("link");
        ut(i, "link", e), t === "style" && (i[Nu] = !0, i.onload = i.onerror = function() {
          no(i);
        }), $e(i), a.head.appendChild(i);
      }
    }
  }
  function sy(e, t) {
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
      if (!Qt.has(u) && (e = w({ rel: "modulepreload", href: e }, t), Qt.set(u, e), l.querySelector(n) === null)) {
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
        a = l.createElement("link"), ut(a, "link", e), $e(a), l.head.appendChild(a);
      }
    }
  }
  function fy(e, t, l) {
    Tl.S(e, t, l);
    var a = sn;
    if (a && e) {
      var n = ja(a).hoistableStyles, u = fn(e);
      t = t || "default";
      var i = n.get(u);
      if (!i) {
        var s = { loading: 0, preload: null };
        if (i = a.querySelector(
          iu(u)
        ))
          s.loading = 5;
        else {
          e = w(
            { rel: "stylesheet", href: e, "data-precedence": t },
            l
          ), (l = Qt.get(u)) && Tf(e, l);
          var o = i = a.createElement("link");
          $e(o), ut(o, "link", e), o._p = new Promise(function(p, T) {
            o.onload = p, o.onerror = T;
          }), o.addEventListener("load", function() {
            s.loading |= 1;
          }), o.addEventListener("error", function() {
            s.loading |= 2;
          }), s.loading |= 4, qi(i, t, a);
        }
        i = {
          type: "stylesheet",
          instance: i,
          count: 1,
          state: s
        }, n.set(u, i);
      }
    }
  }
  function oy(e, t) {
    Tl.X(e, t);
    var l = sn;
    if (l && e) {
      var a = ja(l).hoistableScripts, n = on(e), u = a.get(n);
      u || (u = l.querySelector(cu(n)), u || (e = w({ src: e, async: !0 }, t), (t = Qt.get(n)) && Ef(e, t), u = l.createElement("script"), $e(u), ut(u, "link", e), l.head.appendChild(u)), u = {
        type: "script",
        instance: u,
        count: 1,
        state: null
      }, a.set(n, u));
    }
  }
  function ry(e, t) {
    Tl.M(e, t);
    var l = sn;
    if (l && e) {
      var a = ja(l).hoistableScripts, n = on(e), u = a.get(n);
      u || (u = l.querySelector(cu(n)), u || (e = w({ src: e, async: !0, type: "module" }, t), (t = Qt.get(n)) && Ef(e, t), u = l.createElement("script"), $e(u), ut(u, "link", e), l.head.appendChild(u)), u = {
        type: "script",
        instance: u,
        count: 1,
        state: null
      }, a.set(n, u));
    }
  }
  function Jm(e, t, l, a) {
    var n = (n = Nl.current) ? uu(n) : null;
    if (!n) throw Error(r(446));
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
          }, Qt.set(e, u)), dy(
            n,
            e,
            u,
            i.state
          ))), t && a === null)
            throw Error(r(528, ""));
          return i;
        }
        if (t && a !== null)
          throw Error(r(529, ""));
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
        throw Error(r(444, e));
    }
  }
  function fn(e) {
    return 'href="' + Mt(e) + '"';
  }
  function iu(e) {
    return 'link[rel="stylesheet"][' + e + "]";
  }
  function km(e) {
    return w({}, e, {
      "data-precedence": e.precedence,
      precedence: null
    });
  }
  function dy(e, t, l, a) {
    if (t = e.querySelector(
      'link[rel="preload"][as="style"][' + t + "]"
    )) {
      if (t[Nu] !== !0) {
        a.loading = 1;
        return;
      }
    } else
      t = e.createElement("link"), t[Nu] = !0, t.onload = t.onerror = no.bind(null, t), ut(t, "link", l), $e(t), e.head.appendChild(t);
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
            return t.instance = a, $e(a), a;
          var n = w({}, l, {
            "data-href": l.href,
            "data-precedence": l.precedence,
            href: null,
            precedence: null
          });
          return a = (e.ownerDocument || e).createElement(
            "style"
          ), $e(a), ut(a, "style", n), qi(a, l.precedence, e), t.instance = a;
        case "stylesheet":
          n = fn(l.href);
          var u = e.querySelector(
            iu(n)
          );
          if (u)
            return t.state.loading |= 4, t.instance = u, $e(u), u;
          a = km(l), (n = Qt.get(n)) && Tf(a, n), u = (e.ownerDocument || e).createElement("link"), $e(u);
          var i = u;
          return i._p = new Promise(function(s, o) {
            i.onload = s, i.onerror = o;
          }), ut(u, "link", a), t.state.loading |= 4, qi(u, l.precedence, e), t.instance = u;
        case "script":
          return u = on(l.src), (n = e.querySelector(
            cu(u)
          )) ? (t.instance = n, $e(n), n) : (a = l, (n = Qt.get(u)) && (a = w({}, l), Ef(a, n)), e = e.ownerDocument || e, n = e.createElement("script"), $e(n), ut(n, "link", a), e.head.appendChild(n), t.instance = n);
        case "void":
          return null;
        default:
          throw Error(r(443, t.type));
      }
    else
      t.type === "stylesheet" && (t.state.loading & 4) === 0 && (a = t.instance, t.state.loading |= 4, qi(a, l.precedence, e));
    return t.instance;
  }
  function qi(e, t, l) {
    for (var a = l.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), n = a.length ? a[a.length - 1] : null, u = n, i = 0; i < a.length; i++) {
      var s = a[i];
      if (s.dataset.precedence === t) u = s;
      else if (u !== n) break;
    }
    u ? u.parentNode.insertBefore(e, u.nextSibling) : (t = l.nodeType === 9 ? l.head : l, t.insertBefore(e, t.firstChild));
  }
  function Tf(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.title == null && (e.title = t.title);
  }
  function Ef(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.integrity == null && (e.integrity = t.integrity);
  }
  var Hi = null;
  function Fm(e, t, l) {
    if (Hi === null) {
      var a = /* @__PURE__ */ new Map(), n = Hi = /* @__PURE__ */ new Map();
      n.set(l, a);
    } else
      n = Hi, a = n.get(l), a || (a = /* @__PURE__ */ new Map(), n.set(l, a));
    if (a.has(e)) return a;
    for (a.set(e, null), l = l.getElementsByTagName(e), n = 0; n < l.length; n++) {
      var u = l[n];
      if (!(u[Tn] || u[et] || e === "link" && u.getAttribute("rel") === "stylesheet") && u.namespaceURI !== "http://www.w3.org/2000/svg") {
        var i = u.getAttribute(t) || "";
        i = e + i;
        var s = a.get(i);
        s ? s.push(u) : a.set(i, [u]);
      }
    }
    return a;
  }
  function Nf(e, t, l) {
    e = e.ownerDocument || e, e.head.insertBefore(
      l,
      t === "title" ? e.querySelector("head > title") : null
    );
  }
  function my(e, t, l) {
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
  function Wm(e, t) {
    return e === "img" && t.src != null && t.src !== "" && t.onLoad == null && t.loading !== "lazy";
  }
  function Im(e) {
    return !(e.type === "stylesheet" && (e.state.loading & 3) === 0);
  }
  function Pm(e) {
    return (e.width || 100) * (e.height || 100) * (typeof devicePixelRatio == "number" ? devicePixelRatio : 1) * 0.25;
  }
  function eh(e, t) {
    typeof t.decode == "function" && (e.imgCount++, t.complete || (e.imgBytes += Pm(t), e.suspenseyImages.push(t)), e = yy.bind(e), t.decode().then(e, e));
  }
  function hy(e, t, l, a) {
    if (l.type === "stylesheet" && (typeof a.media != "string" || matchMedia(a.media).matches !== !1) && (l.state.loading & 4) === 0) {
      if (l.instance === null) {
        var n = fn(a.href), u = t.querySelector(
          iu(n)
        );
        if (u) {
          t = u._p, t !== null && typeof t == "object" && typeof t.then == "function" && (e.count++, e = su.bind(e), t.then(e, e)), l.state.loading |= 4, l.instance = u, $e(u);
          return;
        }
        u = t.ownerDocument || t, a = km(a), (n = Qt.get(n)) && Tf(a, n), u = u.createElement("link"), $e(u);
        var i = u;
        i._p = new Promise(function(s, o) {
          i.onload = s, i.onerror = o;
        }), ut(u, "link", a), l.instance = u;
      }
      e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(l, t), (t = l.state.preload) && (l.state.loading & 3) === 0 && (e.count++, l = su.bind(e), t.addEventListener("load", l), t.addEventListener("error", l));
    }
  }
  var Bi = 0;
  function vy(e, t) {
    return e.stylesheets && e.count === 0 && Gi(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(l) {
      var a = setTimeout(function() {
        if (e.stylesheets && Gi(e, e.stylesheets), e.unsuspend) {
          var u = e.unsuspend;
          e.unsuspend = null, u();
        }
      }, 6e4 + t);
      0 < e.imgBytes && Bi === 0 && (Bi = 62500 * D0());
      var n = setTimeout(
        function() {
          if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && Gi(e, e.stylesheets), e.unsuspend)) {
            var u = e.unsuspend;
            e.unsuspend = null, u();
          }
        },
        (e.imgBytes > Bi ? 50 : 800) + t
      );
      return e.unsuspend = l, function() {
        e.unsuspend = null, clearTimeout(a), clearTimeout(n);
      };
    } : null;
  }
  function th(e) {
    if (e.count === 0 && (e.imgCount === 0 || !e.waitingForImages)) {
      if (e.stylesheets) Gi(e, e.stylesheets);
      else if (e.unsuspend) {
        var t = e.unsuspend;
        e.unsuspend = null, t();
      }
    }
  }
  function su() {
    this.count--, th(this);
  }
  function yy() {
    this.imgCount--, th(this);
  }
  var Yi = null;
  function Gi(e, t) {
    e.stylesheets = null, e.unsuspend !== null && (e.count++, Yi = /* @__PURE__ */ new Map(), t.forEach(gy, e), Yi = null, su.call(e));
  }
  function gy(e, t) {
    if (!(t.state.loading & 4)) {
      var l = Yi.get(e);
      if (l) var a = l.get(null);
      else {
        l = /* @__PURE__ */ new Map(), Yi.set(e, l);
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
    $$typeof: I,
    Provider: null,
    Consumer: null,
    _currentValue: mt,
    _currentValue2: mt,
    _threadCount: 0
  };
  function py(e, t, l, a, n, u, i, s, o) {
    this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = ac(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = ac(0), this.hiddenUpdates = ac(null), this.identifierPrefix = a, this.onUncaughtError = n, this.onCaughtError = u, this.onRecoverableError = i, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = o, this.transitionTypes = null, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function lh(e, t, l, a, n, u, i, s, o, p, T, A) {
    return e = new py(
      e,
      t,
      l,
      i,
      o,
      p,
      T,
      A,
      s
    ), t = 1, u === !0 && (t |= 24), u = vt(3, null, null, t), e.current = u, u.stateNode = e, t = Yc(), t.refCount++, e.pooledCache = t, t.refCount++, u.memoizedState = {
      element: a,
      isDehydrated: l,
      cache: t
    }, wc(u), e;
  }
  function ah(e) {
    return e ? (e = Ha, e) : Ha;
  }
  function nh(e, t, l, a, n, u) {
    n = ah(n), a.context === null ? a.context = n : a.pendingContext = n, a = ql(t), a.payload = { element: l }, u = u === void 0 ? null : u, u !== null && (a.callback = u), l = Hl(e, a, t), l !== null && (bt(l, e, t), Gn(l, e, t));
  }
  function uh(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var l = e.retryLane;
      e.retryLane = l !== 0 && l < t ? l : t;
    }
  }
  function xf(e, t) {
    uh(e, t), (e = e.alternate) && uh(e, t);
  }
  function ih(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = na(e, 67108864);
      t !== null && bt(t, e, 67108864), xf(e, 67108864);
    }
  }
  function ch(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = Ot();
      t = nc(t);
      var l = na(e, t);
      l !== null && bt(l, e, t), xf(e, t);
    }
  }
  var dn = !0;
  function by(e, t, l, a) {
    var n = Q.T;
    Q.T = null;
    var u = ae.p;
    try {
      ae.p = 2, jf(e, t, l, a);
    } finally {
      ae.p = u, Q.T = n;
    }
  }
  function Sy(e, t, l, a) {
    var n = Q.T;
    Q.T = null;
    var u = ae.p;
    try {
      ae.p = 8, jf(e, t, l, a);
    } finally {
      ae.p = u, Q.T = n;
    }
  }
  function jf(e, t, l, a) {
    if (dn) {
      var n = Af(a);
      if (n === null)
        cf(
          e,
          t,
          a,
          Qi,
          l
        ), fh(e, a);
      else if (Ty(
        n,
        e,
        t,
        l,
        a
      ))
        a.stopPropagation();
      else if (fh(e, a), t & 4 && -1 < _y.indexOf(e)) {
        for (; n !== null; ) {
          var u = xa(n);
          if (u !== null)
            switch (u.tag) {
              case 3:
                if (u = u.stateNode, u.current.memoizedState.isDehydrated) {
                  var i = Pl(u.pendingLanes);
                  if (i !== 0) {
                    var s = u;
                    for (s.pendingLanes |= 2, s.entangledLanes |= 2; i; ) {
                      var o = 1 << 31 - Et(i);
                      s.entanglements[1] |= o, i &= ~o;
                    }
                    cl(u), (je & 6) === 0 && (xi = _t() + 500, tu(0));
                  }
                }
                break;
              case 31:
              case 13:
                s = na(u, 2), s !== null && bt(s, u, 2), zi(), xf(u, 2);
            }
          if (u = Af(a), u === null && cf(
            e,
            t,
            a,
            Qi,
            l
          ), u === n) break;
          n = u;
        }
        n !== null && a.stopPropagation();
      } else
        cf(
          e,
          t,
          a,
          null,
          l
        );
    }
  }
  function Af(e) {
    return e = rc(e), zf(e);
  }
  var Qi = null;
  function zf(e) {
    if (Qi = null, e = ea(e), e !== null) {
      var t = B(e);
      if (t === null) e = null;
      else {
        var l = t.tag;
        if (l === 13) {
          if (e = U(t), e !== null) return e;
          e = null;
        } else if (l === 31) {
          if (e = J(t), e !== null) return e;
          e = null;
        } else if (l === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated)
            return t.tag === 3 ? t.stateNode.containerInfo : null;
          e = null;
        } else t !== e && (e = null);
      }
    }
    return Qi = e, null;
  }
  function sh(e) {
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
        switch (Dh()) {
          case Kf:
            return 2;
          case Jf:
            return 8;
          case bu:
          case Uh:
            return 32;
          case kf:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var Cf = !1, kl = null, $l = null, Fl = null, fu = /* @__PURE__ */ new Map(), ou = /* @__PURE__ */ new Map(), Wl = [], _y = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function fh(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        kl = null;
        break;
      case "dragenter":
      case "dragleave":
        $l = null;
        break;
      case "mouseover":
      case "mouseout":
        Fl = null;
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
    }, t !== null && (t = xa(t), t !== null && ih(t)), e) : (e.eventSystemFlags |= a, t = e.targetContainers, n !== null && t.indexOf(n) === -1 && t.push(n), e);
  }
  function Ty(e, t, l, a, n) {
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
        return $l = ru(
          $l,
          e,
          t,
          l,
          a,
          n
        ), !0;
      case "mouseover":
        return Fl = ru(
          Fl,
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
  function oh(e) {
    var t = ea(e.target);
    if (t !== null) {
      var l = B(t);
      if (l !== null) {
        if (t = l.tag, t === 13) {
          if (t = U(l), t !== null) {
            e.blockedOn = t, to(e.priority, function() {
              ch(l);
            });
            return;
          }
        } else if (t === 31) {
          if (t = J(l), t !== null) {
            e.blockedOn = t, to(e.priority, function() {
              ch(l);
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
  function Xi(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var l = Af(e.nativeEvent);
      if (l === null) {
        l = e.nativeEvent;
        var a = new l.constructor(
          l.type,
          l
        );
        oc = a, l.target.dispatchEvent(a), oc = null;
      } else
        return t = xa(l), t !== null && ih(t), e.blockedOn = l, !1;
      t.shift();
    }
    return !0;
  }
  function rh(e, t, l) {
    Xi(e) && l.delete(t);
  }
  function Ey() {
    Cf = !1, kl !== null && Xi(kl) && (kl = null), $l !== null && Xi($l) && ($l = null), Fl !== null && Xi(Fl) && (Fl = null), fu.forEach(rh), ou.forEach(rh);
  }
  function wi(e, t) {
    e.blockedOn === t && (e.blockedOn = null, Cf || (Cf = !0, f.unstable_scheduleCallback(
      f.unstable_NormalPriority,
      Ey
    )));
  }
  var Zi = null;
  function dh(e) {
    Zi !== e && (Zi = e, f.unstable_scheduleCallback(
      f.unstable_NormalPriority,
      function() {
        Zi === e && (Zi = null);
        for (var t = 0; t < e.length; t += 3) {
          var l = e[t], a = e[t + 1], n = e[t + 2];
          if (typeof a != "function") {
            if (zf(a || l) === null)
              continue;
            break;
          }
          var u = xa(l);
          u !== null && (e.splice(t, 3), t -= 3, fs(
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
    function t(o) {
      return wi(o, e);
    }
    kl !== null && wi(kl, e), $l !== null && wi($l, e), Fl !== null && wi(Fl, e), fu.forEach(t), ou.forEach(t);
    for (var l = 0; l < Wl.length; l++) {
      var a = Wl[l];
      a.blockedOn === e && (a.blockedOn = null);
    }
    for (; 0 < Wl.length && (l = Wl[0], l.blockedOn === null); )
      oh(l), l.blockedOn === null && Wl.shift();
    if (l = (e.ownerDocument || e).$$reactFormReplay, l != null)
      for (a = 0; a < l.length; a += 3) {
        var n = l[a], u = l[a + 1], i = n[ht] || null;
        if (typeof u == "function")
          i || dh(l);
        else if (i) {
          var s = null;
          if (u && u.hasAttribute("formAction")) {
            if (n = u, i = u[ht] || null)
              s = i.formAction;
            else if (zf(n) !== null) continue;
          } else s = i.action;
          typeof s == "function" ? l[a + 1] = s : (l.splice(a, 3), a -= 3), dh(l);
        }
      }
  }
  function mh() {
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
  function Of(e) {
    this._internalRoot = e;
  }
  Li.prototype.render = Of.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(r(409));
    var l = t.current, a = Ot();
    nh(l, a, e, t, null, null);
  }, Li.prototype.unmount = Of.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      nh(e.current, 2, null, e, null, null), zi(), t[Na] = null;
    }
  };
  function Li(e) {
    this._internalRoot = e;
  }
  Li.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = eo();
      e = { blockedOn: null, target: e, priority: t };
      for (var l = 0; l < Wl.length && t !== 0 && t < Wl[l].priority; l++) ;
      Wl.splice(l, 0, e), l === 0 && oh(e);
    }
  };
  var hh = d.version;
  if (hh !== "19.3.1")
    throw Error(
      r(
        527,
        hh,
        "19.3.1"
      )
    );
  ae.findDOMNode = function(e) {
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(r(188)) : (e = Object.keys(e).join(","), Error(r(268, e)));
    return e = C(t), e = e !== null ? O(e) : null, e = e === null ? null : e.stateNode, e;
  };
  var Ny = {
    bundleType: 0,
    version: "19.3.1",
    rendererPackageName: "react-dom",
    currentDispatcherRef: Q,
    reconcilerVersion: "19.3.1"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Vi = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Vi.isDisabled && Vi.supportsFiber)
      try {
        bn = Vi.inject(
          Ny
        ), Tt = Vi;
      } catch {
      }
  }
  return mu.createRoot = function(e, t) {
    if (!H(e)) throw Error(r(299));
    var l = !1, a = "", n = ad, u = nd, i = ud;
    return t != null && (t.unstable_strictMode === !0 && (l = !0), t.identifierPrefix !== void 0 && (a = t.identifierPrefix), t.onUncaughtError !== void 0 && (n = t.onUncaughtError), t.onCaughtError !== void 0 && (u = t.onCaughtError), t.onRecoverableError !== void 0 && (i = t.onRecoverableError)), t = lh(
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
      mh
    ), e[Na] = t.current, uf(e), new Of(t);
  }, mu.hydrateRoot = function(e, t, l) {
    if (!H(e)) throw Error(r(299));
    var a = !1, n = "", u = ad, i = nd, s = ud, o = null;
    return l != null && (l.unstable_strictMode === !0 && (a = !0), l.identifierPrefix !== void 0 && (n = l.identifierPrefix), l.onUncaughtError !== void 0 && (u = l.onUncaughtError), l.onCaughtError !== void 0 && (i = l.onCaughtError), l.onRecoverableError !== void 0 && (s = l.onRecoverableError), l.formState !== void 0 && (o = l.formState)), t = lh(
      e,
      1,
      !0,
      t,
      l ?? null,
      a,
      n,
      o,
      u,
      i,
      s,
      mh
    ), t.context = ah(null), l = t.current, a = Ot(), a = nc(a), n = ql(a), n.callback = null, Hl(l, n, a), l = a, t.current.lanes = l, _n(t, l), cl(t), e[Na] = t.current, uf(e), new Li(t);
  }, mu.version = "19.3.1", mu;
}
var Nh;
function Uy() {
  if (Nh) return Mf.exports;
  Nh = 1;
  function f() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(f);
      } catch (d) {
        console.error(d);
      }
  }
  return f(), Mf.exports = Dy(), Mf.exports;
}
var qy = Uy(), F = wf();
async function vn(f, d, E) {
  const r = new URL(f, window.location.origin);
  r.searchParams.set("city", window.ARC_CITY.id);
  const H = await fetch(r, {
    signal: E,
    ...d === void 0 ? {} : {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(d)
    }
  }), B = await H.json();
  if (!H.ok) throw new Error(B.error || "Service unavailable");
  return B;
}
const Ji = (f) => window.ARC_CITY.id === "toronto" ? f : `${f}.${window.ARC_CITY.id}`;
function vu(f, d = Date.now()) {
  const E = Date.parse(f);
  return Number.isFinite(E) ? Math.max(0, Math.floor((d - E) / 1e3)) : null;
}
function yn(f) {
  return f === null ? "Time unknown" : f < 60 ? `${f}s` : f < 3600 ? `${Math.floor(f / 60)}m ${f % 60}s` : `${Math.floor(f / 3600)}h ${Math.floor(f % 3600 / 60)}m`;
}
function xh(f) {
  return Number(f.priority?.match(/\d+/)?.[0] ?? 99);
}
function Gf(f) {
  return [...f].sort((d, E) => (d.status === "open" ? 0 : 1) - (E.status === "open" ? 0 : 1) || xh(d) - xh(E) || Number(["missing", "stale"].includes(d.public_feed_status)) - Number(["missing", "stale"].includes(E.public_feed_status)) || String(d.received_at ?? "").localeCompare(String(E.received_at ?? "")) || d.id.localeCompare(E.id));
}
function Zf(f, d, E = Date.now(), r = null) {
  if (f && f.decision !== "pending") return f.decision;
  if (r?.assessment_blockers?.length) return "incomplete";
  if (!f) return "unassessed";
  if (r && (f.incident_revision ?? 0) !== (r.incident_revision ?? 0) || f.version !== d) return "changed";
  const H = f.evidence_epoch ?? f.created_epoch;
  return !Number.isFinite(H) || E / 1e3 - H > 120 ? "expired" : f.approvable ? "ready" : "blocked";
}
function Bf(f, d, E) {
  return f.incident_id === d && f.simulation_epoch === E;
}
function Xt(f) {
  return ["completed", "cancelled"].includes(f.status) ? "completed" : f.status !== "open" ? "reserved" : f.public_source && !f.requirements_source && !f.prepared_intake ? ["missing", "stale"].includes(f.public_feed_status) ? "history" : "reports" : f.agent_state === "awaiting_approval" ? "approval" : f.assessment_blockers?.length || f.agent_state === "needs_input" || f.agent_state === "watching" ? "input" : "working";
}
function El(f) {
  return { assigned: "Assigned", responding: "Responding to pickup", on_scene: "On scene", transporting: "Transporting", handover: "Hospital handover", completed: "Completed", cancelled: "Exercise ended" }[f] || "Assigned";
}
function Hy(f) {
  const d = ["assigned", "responding", "on_scene", "transporting", "handover", "completed"], E = d.indexOf(f);
  return E >= 0 && E < d.length - 1 ? d[E + 1] : null;
}
function By(f, d) {
  const E = f.find((H) => H.id === d);
  if (E && !["reports", "history"].includes(Xt(E))) return E.id;
  const r = Gf(f.filter((H) => !["reports", "history"].includes(Xt(H))));
  return r.find((H) => H.status === "open")?.id || r[0]?.id || E?.id || Gf(f)[0]?.id || null;
}
function zh(f) {
  const d = f.assessment_blockers || [];
  return d.some((E) => E.includes("changed public call") || E.includes("feed") || E.includes("no longer")) ? {
    title: "Can you verify this call?",
    body: "The published call changed or its source is no longer current. Review the details before ARC prepares another plan.",
    action: "Review call details",
    target: "intake"
  } : d.some((E) => E.includes("pickup location")) ? {
    title: "Where should the unit go?",
    body: "This report does not include a confirmed pickup point. Choose a location, then confirm the response requirements.",
    action: "Confirm pickup and requirements",
    target: "intake"
  } : d.length ? {
    title: "What response is needed?",
    body: "The public report does not supply the priority, required service and equipment. Confirm those details so ARC can assess this call.",
    action: "Confirm response requirements",
    target: "intake"
  } : { title: "This case needs your review", body: f.agent_reason || "Review the previous plan or adjust the requirements before asking ARC to continue.", action: "Review and retry", target: "retry" };
}
const ct = (f) => !!f && f.lat != null && f.lon != null && Number.isFinite(Number(f.lat)) && Number.isFinite(Number(f.lon));
function ki(f) {
  return new Set(
    Object.entries(f.proposals || {}).filter(
      ([d, E]) => E.decision === "pending" && E.approvable && E.version === f.version && f.agent.states[d]?.state === "awaiting_approval"
    ).map(([, d]) => d.ambulance_id)
  );
}
function Qf(f = "") {
  return f.includes("Planning") ? "Reviewing the request…" : f.includes("Federating") ? "Checking unit and hospital availability…" : f.includes("Calculating") ? "Comparing eligible resources and routes…" : f.includes("Recalling") ? "Checking what changed…" : "Preparing the evidence explanation…";
}
const hn = (f) => String(f).replace(/\bsimulated\s+/gi, "").replace(/\bsynthetic\s+/gi, "").replace(/\bpredefined\s+/gi, "required ");
function Yy(f, d) {
  const E = d.fleet.find((H) => H.id === f?.selected?.ambulance_id), r = d.hospitals.find((H) => H.id === f?.selected?.hospital_id);
  return E && E.status !== "available" ? E.name + " is now " + E.status + "." : r && (!r.accepting || r.slots < 1) ? r.name + " is no longer available to receive this transfer." : d.closures.length ? "A road closure may affect this plan’s routes." : "The operational picture changed after this plan was assessed.";
}
function Xf(f) {
  return {
    priority: f.priority || "",
    service: f.service || "",
    equipment: f.equipment || "",
    lat: f.lat == null ? "" : String(f.lat),
    lon: f.lon == null ? "" : String(f.lon),
    pickup_label: f.pickup_label || f.name,
    notes: f.notes || "",
    revision: f.incident_revision || 0
  };
}
const gn = (f, d = !1) => new Date(f).toLocaleTimeString("en-CA", {
  timeZone: window.ARC_CITY.timezone,
  hour: "2-digit",
  minute: "2-digit",
  ...d ? { second: "2-digit" } : {}
});
function Gy() {
  const [f, d] = F.useState(null), [E, r] = F.useState(
    () => sessionStorage.getItem(Ji("arc.selected"))
  ), [H, B] = F.useState({}), [U, J] = F.useState(!1), [X, C] = F.useState({}), [O, y] = F.useState(null), [N, z] = F.useState(!1), [Y, P] = F.useState(""), [W, ze] = F.useState(Date.now()), [de, ve] = F.useState([]), se = F.useRef({
    selected: E,
    epoch: "",
    sequence: 0,
    first: !0,
    alive: !0,
    controller: new AbortController()
  }), fe = F.useCallback((b) => P(b), []), Ee = F.useCallback(
    (b) => ve(
      (L) => [{ text: b, at: (/* @__PURE__ */ new Date()).toISOString() }, ...L].slice(0, 7)
    ),
    []
  ), w = F.useCallback(async () => {
    const b = se.current, L = ++b.sequence;
    try {
      const I = window.ARC_INITIAL_STATE;
      window.ARC_INITIAL_STATE = void 0;
      const R = (I ? await I : null) || await vn("/api/state", void 0, b.controller.signal);
      if (!b.alive || L !== b.sequence) return;
      b.epoch && b.epoch !== R.epoch && (B({}), C({}), y(null), ve([])), b.epoch = R.epoch;
      let q = b.selected;
      if ((b.first || !R.incidents.some((V) => V.id === q)) && (q = By(R.incidents, q)), b.first = !1, b.selected = q, r(q), d(R), q) {
        const V = await vn(
          "/api/recommendations/" + encodeURIComponent(q),
          void 0,
          b.controller.signal
        );
        if (!b.alive || L !== b.sequence) return;
        B((Ne) => {
          const ye = { ...Ne };
          return V?.simulation_epoch === R.epoch ? ye[q] = V : delete ye[q], ye;
        });
      }
      J(!0);
    } catch (I) {
      b.alive && L === b.sequence && !(I instanceof DOMException && I.name === "AbortError") && J(!1);
    }
  }, []), Z = F.useCallback(
    (b) => (se.current.selected = b, r(b), sessionStorage.setItem(Ji("arc.selected"), b), w()),
    [w]
  );
  F.useEffect(() => {
    const b = se.current;
    b.alive = !0, b.controller = new AbortController();
    let L;
    const I = async () => {
      await w(), b.alive && (L = setTimeout(I, 2e3));
    };
    I();
    const R = setInterval(() => ze(Date.now()), 1e3);
    return () => {
      b.alive = !1, b.sequence++, b.controller.abort(), clearTimeout(L), clearInterval(R);
    };
  }, [w]), F.useEffect(() => {
    if (!Y) return;
    const b = setTimeout(() => P(""), 5e3);
    return () => clearTimeout(b);
  }, [Y]);
  const x = O || f?.assessments?.[0] || null;
  F.useEffect(() => {
    if (!x) return;
    C(
      (q) => q[x.incident_id] ? { ...q, [x.incident_id]: "" } : q
    );
    let b = !1;
    const L = new AbortController();
    let I;
    const R = async () => {
      try {
        const q = await vn(
          "/api/jobs/" + x.id,
          void 0,
          L.signal
        );
        if (b) return;
        if (q.status === "running") {
          y(q), I = setTimeout(R, 850);
          return;
        }
        if (y(null), q.simulation_epoch !== se.current.epoch) return;
        q.result && (B((V) => ({ ...V, [q.incident_id]: q.result })), C(
          (V) => V[q.incident_id] ? { ...V, [q.incident_id]: "" } : V
        ), q.incident_id !== se.current.selected && (!q.automatic || q.trigger === "new incident" || q.result.changes.some(
          (V) => /^(Assignment revised|Route estimates changed)/.test(
            V.text
          )
        )) && fe(
          q.incident_id + (q.result.approvable ? " · plan ready for approval" : " · assessment needs attention")
        ), q.automatic || Ee(q.incident_id + " · assessment complete")), q.status === "error" && !q.automatic && C((V) => ({
          ...V,
          [q.incident_id]: q.error || "Assessment failed"
        })), await w();
      } catch {
        b || (w(), I = setTimeout(R, 1500));
      }
    };
    return I = setTimeout(R, 850), () => {
      b = !0, L.abort(), clearTimeout(I);
    };
  }, [x?.id, w, Ee, fe]);
  const ue = F.useCallback(
    async (b, L, I) => {
      z(!0);
      try {
        const R = await vn(b, L);
        return await w(), I && (fe(I), Ee(I)), R;
      } catch (R) {
        throw await w(), fe(R instanceof Error ? R.message : "Request failed"), R;
      } finally {
        z(!1);
      }
    },
    [w, fe, Ee]
  ), me = async (b, L = "Assess available resources and explain the best feasible assignment.") => {
    if (!E || x || N || !U) return;
    const I = E, R = H[I];
    C((q) => ({ ...q, [I]: "" })), z(!0);
    try {
      const q = await vn(
        b ? "/api/alternative" : "/api/agent/retry",
        b ? { recommendation_id: R.id, pair_id: b } : { incident_id: I, request: L }
      );
      y(q), Ee(I + " · assessment started");
    } catch (q) {
      C((V) => ({
        ...V,
        [I]: q instanceof Error ? q.message : "Assessment unavailable"
      }));
    } finally {
      z(!1);
    }
  }, $ = async (b) => {
    if (!E || N || !U) return;
    const L = H[E];
    try {
      const I = await ue(
        "/api/decision",
        { id: L.id, action: b },
        b === "approve" ? "Assignment reserved." : "Plan rejected."
      );
      B((R) => ({
        ...R,
        [L.incident_id]: I
      }));
    } catch (I) {
      C((R) => ({
        ...R,
        [L.incident_id]: I instanceof Error ? I.message : "Decision failed"
      }));
    }
  };
  return {
    state: f,
    selected: E,
    select: Z,
    rec: E && H[E] || null,
    connected: U,
    errors: X,
    job: x,
    busy: N,
    toast: Y,
    now: W,
    activities: de,
    notify: fe,
    refresh: w,
    mutate: ue,
    assess: me,
    decide: $
  };
}
const hu = (f) => String(f).replace(
  /[&<>"']/g,
  (d) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[d]
);
function Qy(f) {
  const d = f.getSize(), E = d.x <= 760;
  let r = 24, H = 24, B = 110;
  if (E) {
    const U = document.querySelector(
      ".detail-panel:not([hidden]), .inbox-panel:not([hidden])"
    );
    if (U) {
      const J = U.getBoundingClientRect();
      B = d.y - J.top + 18;
    }
    return {
      paddingTopLeft: [24, 100],
      paddingBottomRight: [24, Math.min(B, d.y - 210)]
    };
  }
  for (const [U, J] of [
    [".inbox-panel", "left"],
    [".detail-panel", "right"]
  ]) {
    const X = document.querySelector(U);
    if (X) {
      const C = X.getBoundingClientRect();
      C.width && C.height && (J === "left" ? r = C.right + 24 : H = d.x - C.left + 24);
    }
  }
  return {
    paddingTopLeft: [r, 100],
    paddingBottomRight: [H, B]
  };
}
function Xy(f) {
  const d = F.useRef(null), E = F.useRef(null), r = F.useRef(f), H = F.useRef(null), B = F.useRef(null), U = F.useRef(""), J = F.useRef(-1);
  return r.current = f, F.useEffect(() => {
    const X = window.L, C = window.ARC_CITY, O = X.map(d.current, {
      zoomControl: !1,
      preferCanvas: !1,
      minZoom: 10,
      maxZoom: 19,
      scrollWheelZoom: !0
    }).setView(C.center, C.zoom);
    E.current = O, H.current = X.layerGroup().addTo(O), B.current = X.layerGroup().addTo(O), f.onMapReady(O), X.control.scale({ position: "bottomleft", imperial: !1, maxWidth: 100 }).addTo(O), O.attributionControl.addAttribution(C.basemap_credit), O.createPane("cachedStreets"), O.getPane("cachedStreets").style.zIndex = "150", O.getPane("cachedStreets").style.pointerEvents = "none";
    const y = X.layerGroup().addTo(O);
    let N = !0, z = !1, Y = !1, P = !1, W;
    const ze = new AbortController(), de = () => {
      z || (z = !0, fetch("/" + C.basemap, { signal: ze.signal }).then((Z) => Z.json()).then((Z) => {
        N && X.geoJSON(Z, {
          pane: "cachedStreets",
          interactive: !1,
          style: (x) => ({
            color: "#fff",
            weight: String(x?.properties.class).includes("Arterial") ? 5 : 2.5,
            opacity: 1
          })
        }).addTo(y);
      }).catch(() => {
      }));
    }, ve = X.tileLayer(
      "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 19,
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }
    ), se = () => {
      Y || !N || (Y = !0, de(), O.getPane("cachedStreets").style.display = "", W && O.hasLayer(W) && O.removeLayer(W), ve.addTo(O));
    };
    try {
      const Z = X.maplibreGL({
        style: "https://tiles.openfreemap.org/styles/positron",
        interactive: !1
      });
      W = Z, Z.addTo(O), Z.getMaplibreMap().on("load", () => {
        !N || Y || (P = !0, O.getPane("cachedStreets").style.display = "none");
      }), Z.getMaplibreMap().on("error", se);
    } catch {
      se();
    }
    const fe = setTimeout(() => {
      P || se();
    }, 15e3), Ee = setTimeout(() => {
      P || de();
    }, 1200);
    O.on("click", (Z) => {
      if (!r.current.picking) return;
      const [x, ue, me, $] = C.bounds;
      if (Z.latlng.lat <= x || Z.latlng.lat >= me || Z.latlng.lng <= ue || Z.latlng.lng >= $) {
        r.current.notify(
          "Choose a pickup within " + C.name + " coverage."
        );
        return;
      }
      r.current.onPick(Z.latlng.lat, Z.latlng.lng);
    });
    const w = new ResizeObserver(() => O.invalidateSize({ pan: !1 }));
    return w.observe(d.current), () => {
      N = !1, ze.abort(), clearTimeout(fe), clearTimeout(Ee), w.disconnect(), O.remove(), E.current = null;
    };
  }, []), F.useEffect(() => {
    const X = E.current, C = f.state, O = f.rec;
    if (!X || !C || !H.current) return;
    const y = C.incidents.find((x) => x.id === f.selected), N = Zf(O, C.version, Date.now(), y), z = JSON.stringify([
      f.selected,
      f.feature,
      f.layers,
      O?.id,
      N,
      C.version,
      C.fleet,
      C.hospitals,
      C.incidents.filter(
        (x) => (x.status === "open" || x.id === f.selected) && x.service
      ).map((x) => [x.id, x.lat, x.lon, x.agent_state]),
      C.assignments.map((x) => [x.id, x.phase, x.hold_reason]),
      Object.entries(C.public_context).map(([x, ue]) => [
        x,
        ue.fetched_at,
        ue.stale
      ])
    ]);
    if (U.current === z) return;
    U.current = z, H.current.clearLayers();
    const Y = window.L, P = H.current, W = O?.selected, ze = ki(C), de = (x, ue) => f.feature?.kind === x && f.feature.id === ue, ve = (x, ue, me) => {
      x.on("click", (b) => {
        r.current.picking || (Y.DomEvent.stopPropagation(b.originalEvent), r.current.onSelect(ue));
      }), x.addTo(P);
      const $ = x.getElement?.();
      return $ && ($.setAttribute("tabindex", "0"), $.setAttribute("role", "button"), $.setAttribute("aria-label", me), $.addEventListener("keydown", (b) => {
        const L = b;
        (L.key === "Enter" || L.key === " ") && (L.preventDefault(), r.current.onSelect(ue));
      })), x;
    }, se = (x, ue, me) => {
      if (!ct(x)) return;
      const $ = de(ue, x.id), b = Y.marker([x.lat, x.lon], {
        title: x.name,
        alt: x.name,
        icon: Y.divIcon({
          className: "map-marker",
          html: `<div class="marker ${ue} ${me ? "muted" : ""} ${$ ? "active" : ""}">${ue === "hospital" ? "+" : "↗"}</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        })
      }).bindTooltip(hu(x.name));
      ve(b, { kind: ue, id: x.id }, x.name);
    };
    C.hospitals.filter(
      (x) => f.layers.resources || x.id === W?.hospital_id || de("hospital", x.id)
    ).forEach((x) => se(x, "hospital", !x.accepting || x.slots < 1)), C.fleet.filter(
      (x) => f.layers.resources || x.id === W?.ambulance_id || de("unit", x.id)
    ).forEach(
      (x) => se(x, "unit", x.status !== "available" && !ze.has(x.id))
    ), C.incidents.filter(
      (x) => (x.status === "open" || x.id === f.selected) && ct(x) && (x.service || x.id === f.selected)
    ).forEach((x) => {
      if (!ct(x)) return;
      const ue = x.agent_state === "awaiting_approval" ? "#28785c" : x.agent_state === "working" ? "#315fb6" : "#9c7131";
      ve(
        Y.circleMarker([x.lat, x.lon], {
          radius: x.id === f.selected ? 10 : 7,
          color: ue,
          weight: x.id === f.selected ? 3 : 2,
          fillColor: ue,
          fillOpacity: x.id === f.selected ? 0.85 : 0.5
        }).bindTooltip(hu(x.name), {
          permanent: x.id === f.selected,
          direction: "top",
          offset: [0, -10],
          className: "selected-map-label"
        }),
        { kind: "incident", id: x.id },
        x.name
      );
    }), C.closures.forEach((x, ue) => {
      ct(x) && ve(
        Y.circle([x.lat, x.lon], {
          radius: x.radius_m,
          color: "#ac694b",
          fillOpacity: 0.15,
          weight: 2
        }).bindTooltip(hu(x.name)),
        { kind: "closure", id: x.id || String(ue) },
        x.name
      );
    });
    const fe = C.assignments.find((x) => x.incident_id === f.selected), Ee = !!fe?.hold_reason || O?.decision === "pending" && N !== "ready";
    if (W)
      for (const [x, ue] of [
        [W.pickup_route, "#255bd6"],
        [W.transport_route, "#16786b"]
      ]) {
        const me = x.coordinates.map(
          ([$, b]) => [b, $]
        );
        Y.polyline(me, {
          color: "#fff",
          weight: 8,
          opacity: 0.95,
          interactive: !1
        }).addTo(P), Y.polyline(me, {
          color: Ee ? "#9a783a" : ue,
          weight: 4.5,
          dashArray: Ee ? "6 6" : void 0,
          lineCap: "round",
          interactive: !1
        }).addTo(P);
      }
    const w = (x, ue) => {
      let me = C.public_context[x]?.records || [];
      if (x === "roads" && ct(y)) {
        const $ = (b) => ct(b) ? Math.hypot(
          (b.lat - y.lat) * 111,
          (b.lon - y.lon) * 80
        ) : 1 / 0;
        me = [...me].sort((b, L) => $(b) - $(L));
      }
      for (const $ of me.slice(0, x === "roads" ? 100 : 500))
        ct($) && ve(
          Y.circleMarker([$.lat, $.lon], {
            radius: de(x, $.id) ? 8 : x === "stations" ? 6 : 4,
            color: ue,
            weight: de(x, $.id) ? 3 : 1,
            fillOpacity: 0.6
          }).bindTooltip(hu($.name)),
          { kind: x, id: $.id },
          $.name
        );
    };
    f.layers.calls && (w("police", "#66718a"), C.city.id === "seattle" && w("fire", "#66718a")), f.layers.roads && w("roads", "#a4762f"), f.layers.stations && C.city.id === "toronto" && w("stations", "#516e85");
    const Z = C.public_context.traffic;
    if ((Z?.mode === "live" && !Z.stale || W?.transport_route.traffic_aware) && X.attributionControl.addAttribution("© TomTom"), f.layers.traffic && Z?.mode === "live" && !Z.stale)
      for (const x of Z.records) {
        const ue = (x.coordinates || []).filter(
          (me) => !Array.isArray(me)
        ).map((me) => [me.latitude, me.longitude]);
        ve(
          Y.polyline(ue, {
            color: x.closed ? "#a33f39" : (x.speed_kph || 0) < (x.free_flow_kph || 0) * 0.5 ? "#c07928" : "#39816e",
            weight: 5,
            opacity: 0.65
          }).bindTooltip(hu(x.speed_kph + " km/h observed · " + x.name)),
          { kind: "traffic", id: x.id },
          x.name
        );
      }
  }, [f.state, f.rec, f.selected, f.feature, f.layers]), F.useEffect(() => {
    B.current?.clearLayers(), f.draftPoint && ct(f.draftPoint) && window.L.circleMarker([f.draftPoint.lat, f.draftPoint.lon], {
      radius: 7,
      color: "#3974cc",
      fillOpacity: 0.4
    }).bindTooltip("Unsaved pickup", { permanent: !0 }).addTo(B.current);
  }, [f.draftPoint]), F.useEffect(() => {
    const X = E.current, C = r.current.state;
    if (!X || !C || !f.ready || J.current === f.focus.serial) return;
    J.current = f.focus.serial;
    const O = requestAnimationFrame(() => {
      X.invalidateSize({ pan: !1 });
      const { rec: y, selected: N, focus: z } = r.current, Y = C.incidents.find((W) => W.id === N);
      let P = [];
      z.mode === "feature" && ct(z.point) ? P = [[z.point.lat, z.point.lon]] : z.mode === "overview" ? P = [
        ...C.fleet,
        ...C.hospitals,
        ...C.incidents.filter((W) => W.status === "open" && W.service)
      ].flatMap(
        (W) => ct(W) ? [[W.lat, W.lon]] : []
      ) : (ct(Y) && P.push([Y.lat, Y.lon]), y?.selected && P.push(
        ...y.selected.pickup_route.coordinates.map(
          ([W, ze]) => [ze, W]
        ),
        ...y.selected.transport_route.coordinates.map(
          ([W, ze]) => [ze, W]
        )
      )), P.length || (P = [C.city.center]), X.fitBounds(P, {
        ...Qy(X),
        maxZoom: z.mode === "overview" ? 14 : (P.length === 1, 15),
        animate: !1
      });
    });
    return () => cancelAnimationFrame(O);
  }, [f.focus, f.ready]), /* @__PURE__ */ c.jsx(
    "div",
    {
      id: "map",
      ref: d,
      className: f.picking ? "choosing-pickup" : "",
      "aria-label": `${window.ARC_CITY.name} incident, unit and hospital map`
    }
  );
}
const jh = {
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
function Ke({ name: f, size: d = 18 }) {
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
      children: /* @__PURE__ */ c.jsx("path", { d: jh[f] || jh.info })
    }
  );
}
function Ch({
  title: f,
  eyebrow: d,
  children: E,
  className: r = "",
  collapsed: H = !1,
  onCollapse: B,
  onClose: U,
  tools: J
}) {
  const X = F.useId();
  return /* @__PURE__ */ c.jsxs(
    "section",
    {
      className: `floating-panel ${r} ${H ? "is-collapsed" : ""}`,
      "aria-labelledby": X,
      children: [
        /* @__PURE__ */ c.jsxs("div", { className: "panel-header", children: [
          /* @__PURE__ */ c.jsxs("div", { className: "panel-title", children: [
            d && /* @__PURE__ */ c.jsx("span", { className: "eyebrow", children: d }),
            /* @__PURE__ */ c.jsx("h2", { id: X, children: f })
          ] }),
          /* @__PURE__ */ c.jsxs("div", { className: "panel-actions", children: [
            B && /* @__PURE__ */ c.jsx(
              "button",
              {
                className: "icon-button",
                "aria-label": `${H ? "Expand" : "Collapse"} ${f}`,
                "aria-expanded": !H,
                onClick: B,
                children: /* @__PURE__ */ c.jsx("span", { className: H ? "rotate" : "", children: /* @__PURE__ */ c.jsx(Ke, { name: "chevron" }) })
              }
            ),
            /* @__PURE__ */ c.jsx(
              "button",
              {
                className: "icon-button",
                "aria-label": `Close ${f}`,
                onClick: U,
                children: /* @__PURE__ */ c.jsx(Ke, { name: "close" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ c.jsxs("div", { className: "panel-content", hidden: H, children: [
          J && /* @__PURE__ */ c.jsx("div", { className: "panel-toolbar", children: J }),
          /* @__PURE__ */ c.jsx("div", { className: "panel-body", children: E })
        ] })
      ]
    }
  );
}
const Yf = {
  approval: "Review plans",
  input: "Questions for you",
  working: "With ARC",
  reserved: "Active assignments",
  completed: "Completed",
  reports: "Public reports",
  history: "Earlier reports"
}, Ah = [
  "approval",
  "input",
  "working",
  "reserved",
  "completed",
  "reports",
  "history"
];
function wy(f, d) {
  const E = Xt(f);
  if (E === "reports") return "Confirm response requirements";
  if (E === "history") return "Earlier public report";
  if (E === "completed") return "View completed assignment";
  if (E === "reserved") {
    const r = d.assignments.find((H) => H.incident_id === f.id);
    return r?.hold_reason ? "Journey needs review" : El(r?.phase);
  }
  return E === "approval" ? "Review ARC’s plan" : E === "input" ? zh(f).title : f.agent_state === "waiting" ? f.agent_reason?.includes("receiving") ? "Waiting for a receiving facility" : f.agent_reason?.includes("unit") ? "Waiting for a unit" : f.agent_reason?.includes("paused") ? "ARC is paused" : "ARC is monitoring availability" : f.agent_state === "working" ? "ARC is checking this call" : "ARC will prepare a plan";
}
function Zy({
  state: f,
  selected: d,
  onSelect: E,
  onClose: r,
  now: H,
  bucket: B,
  setBucket: U
}) {
  const [J, X] = F.useState(
    () => sessionStorage.getItem(Ji("arc.queueSource")) || "all"
  ), C = F.useMemo(
    () => Object.fromEntries(
      Ah.map((N) => [
        N,
        f.incidents.filter((z) => Xt(z) === N).length
      ])
    ),
    [f.incidents]
  ), O = ["reports", "history"].includes(B), y = F.useMemo(
    () => Gf(
      f.incidents.filter(
        (N) => (B === "all" ? !["reports", "history", "completed"].includes(Xt(N)) : Xt(N) === B) && (!O || J === "all" || J === "public" && !!N.public_source || J === "workspace" && !N.public_source || J === "prepared" && N.prepared_intake || N.public_kind === J)
      )
    ),
    [f.incidents, B, O, J]
  );
  return /* @__PURE__ */ c.jsxs(
    Ch,
    {
      title: "Work with ARC",
      eyebrow: "DISPATCH INBOX",
      className: "inbox-panel",
      onClose: r,
      children: [
        /* @__PURE__ */ c.jsx("div", { className: "queue-stages", children: ["approval", "working", "input"].map((N) => /* @__PURE__ */ c.jsxs(
          "button",
          {
            "data-queue-bucket": N,
            className: N,
            "aria-pressed": B === N,
            onClick: () => U(B === N ? "all" : N),
            children: [
              /* @__PURE__ */ c.jsx("b", { children: C[N] }),
              /* @__PURE__ */ c.jsx("span", { children: Yf[N] })
            ]
          },
          N
        )) }),
        /* @__PURE__ */ c.jsx("div", { className: "queue-aux", children: ["reserved", "completed", "reports", "history"].map((N) => /* @__PURE__ */ c.jsxs(
          "button",
          {
            "aria-pressed": B === N,
            onClick: () => U(B === N ? "all" : N),
            children: [
              Yf[N],
              " ",
              /* @__PURE__ */ c.jsx("b", { children: C[N] })
            ]
          },
          N
        )) }),
        O ? /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
          /* @__PURE__ */ c.jsxs("label", { className: "field-label", children: [
            "Incident source",
            /* @__PURE__ */ c.jsxs(
              "select",
              {
                "aria-label": "Incident source",
                value: J,
                onChange: (N) => {
                  X(N.target.value), sessionStorage.setItem(
                    Ji("arc.queueSource"),
                    N.target.value
                  );
                },
                children: [
                  /* @__PURE__ */ c.jsx("option", { value: "all", children: "All sources" }),
                  /* @__PURE__ */ c.jsx("option", { value: "public", children: "Public calls" }),
                  /* @__PURE__ */ c.jsxs("option", { value: "fire", children: [
                    f.city.name,
                    " Fire"
                  ] }),
                  f.city.id === "toronto" && /* @__PURE__ */ c.jsx("option", { value: "police", children: "Toronto Police" }),
                  /* @__PURE__ */ c.jsx("option", { value: "workspace", children: "Workspace cases" }),
                  /* @__PURE__ */ c.jsx("option", { value: "prepared", children: "Prepared intake" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ c.jsx("p", { className: "quiet", children: "Public reports need confirmed requirements before ARC can plan." }),
          /* @__PURE__ */ c.jsx("p", { className: "micro", children: (f.city.id === "seattle" ? ["fire"] : ["fire", "police"]).map(
            (N) => `${N === "fire" ? "Fire" : "Police"}: ${f.public_context[N]?.stale ? "stale" : f.public_context[N]?.mode === "live" ? "connected" : "unavailable"}`
          ).join(" · ") })
        ] }) : /* @__PURE__ */ c.jsx("p", { className: "quiet inbox-note", children: C.approval || C.input ? "Review a plan or answer a question. ARC follows up on the other cases." : "ARC is following your cases. The next decision will appear here." }),
        /* @__PURE__ */ c.jsxs("div", { className: "incident-list", children: [
          Ah.map((N) => {
            const z = y.filter((Y) => Xt(Y) === N);
            return z.length ? /* @__PURE__ */ c.jsxs(
              "details",
              {
                className: "queue-group",
                open: B === N || ["approval", "input", "working"].includes(N) || z.some((Y) => Y.id === d),
                children: [
                  /* @__PURE__ */ c.jsxs("summary", { children: [
                    Yf[N],
                    " ",
                    /* @__PURE__ */ c.jsx("span", { children: z.length })
                  ] }),
                  z.map((Y) => /* @__PURE__ */ c.jsxs(
                    "button",
                    {
                      className: `incident-card ${d === Y.id ? "selected" : ""}`,
                      "data-incident": Y.id,
                      "aria-pressed": d === Y.id,
                      onClick: () => E(Y.id),
                      onKeyDown: (P) => {
                        if (!["ArrowUp", "ArrowDown"].includes(P.key)) return;
                        P.preventDefault();
                        const W = y[(y.indexOf(Y) + (P.key === "ArrowDown" ? 1 : -1) + y.length) % y.length];
                        E(W.id), document.querySelector(
                          `[data-incident="${CSS.escape(W.id)}"]`
                        )?.focus();
                      },
                      children: [
                        /* @__PURE__ */ c.jsxs("span", { className: "incident-top", children: [
                          /* @__PURE__ */ c.jsx(
                            "span",
                            {
                              className: `priority ${Y.priority === "Priority 1" ? "urgent" : ""}`,
                              children: Y.status === "open" ? Y.priority || Y.public_call_type || "Public report" : Y.status === "assigned" ? "Approved" : "Ended"
                            }
                          ),
                          Y.status === "open" && /* @__PURE__ */ c.jsx("span", { children: yn(
                            vu(
                              Y.public_source ? Y.public_observed_at : Y.received_at || f.epoch,
                              H
                            )
                          ) })
                        ] }),
                        /* @__PURE__ */ c.jsx("strong", { children: Y.name }),
                        /* @__PURE__ */ c.jsx(
                          "span",
                          {
                            className: `queue-state ${N === "input" ? "attention" : ""}`,
                            children: wy(Y, f)
                          }
                        )
                      ]
                    },
                    Y.id
                  ))
                ]
              },
              N
            ) : null;
          }),
          !y.length && /* @__PURE__ */ c.jsxs("div", { className: "empty-state", children: [
            /* @__PURE__ */ c.jsx("strong", { children: B === "approval" ? "No plans waiting for review" : B === "input" ? "No questions for you" : "Nothing in this view" }),
            /* @__PURE__ */ c.jsx("p", { children: O ? "Try another source or view current reports." : "ARC will bring the next decision here." })
          ] })
        ] })
      ]
    }
  );
}
function Ly({
  workspace: f,
  incident: d,
  draft: E,
  setDraft: r,
  picking: H,
  onPick: B,
  details: U,
  onDetail: J,
  request: X,
  setRequest: C
}) {
  const O = f.state, y = f.rec, N = Zf(y, O.version, f.now, d), z = Xt(d), Y = zh(d), P = O.assignments.find((b) => b.incident_id === d.id), [W, ze] = F.useState(""), de = f.busy || !f.connected, ve = (b, L, I) => /* @__PURE__ */ c.jsxs(
    "details",
    {
      className: "review-details",
      open: U.has(b),
      onToggle: (R) => J(b, R.currentTarget.open),
      children: [
        /* @__PURE__ */ c.jsx("summary", { children: L }),
        I
      ]
    }
  );
  let se = "", fe = "", Ee = "";
  z === "reserved" || z === "completed" ? (se = P?.hold_reason ? "This journey needs review" : El(P?.phase), fe = P?.hold_reason || (["completed", "cancelled"].includes(P?.phase || "") ? "The unit and receiving slot were released. The unit stays at its last journey location." : P?.automatic ? "ARC is progressing this exercise along the approved route." : "This earlier assignment uses manual progress controls.")) : z === "reports" || z === "history" ? (se = z === "history" ? "Earlier public report" : "Is this a response case?", fe = "This is a public report, not a confirmed request to ARC. " + Y.body, Ee = "intake") : z === "input" ? (se = Y.title, fe = Y.body, Ee = Y.target) : N === "ready" ? (se = "ARC has a plan ready", fe = "Review the unit, destination and explanation below. Resources stay available until you approve.") : N === "changed" || N === "expired" ? (se = "ARC is reviewing this plan", fe = N === "changed" ? Yy(y, O) : "The previous evidence has aged. ARC will check current conditions before another approval.") : d.agent_state === "working" ? (se = "ARC is checking this case", fe = Qf(d.agent_reason)) : d.agent_state === "waiting" ? (se = d.agent_reason?.includes("unit") ? "ARC is waiting for a unit" : d.agent_reason?.includes("receiving") ? "ARC is waiting for a receiving facility" : "ARC is monitoring this case", fe = d.agent_reason || "") : (se = "ARC will prepare a plan", fe = "ARC will check eligible units, receiving facilities and routes, then bring you a recommendation."), !O.agent.enabled && z === "working" && (se = "ARC is paused", fe = "Resume ARC to continue preparing and refreshing plans.");
  const w = E || Xf(d), Z = y?.selected, x = !!((d.public_source || d.prepared_intake) && d.status === "open"), ue = !!d.assessment_blockers?.length, me = x ? ve(
    "intake",
    `Response details · ${ue ? "review required" : "ready"}`,
    /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
      /* @__PURE__ */ c.jsxs("details", { className: "source-details", children: [
        /* @__PURE__ */ c.jsx("summary", { children: "Published information" }),
        /* @__PURE__ */ c.jsx("p", { className: "quiet", children: d.prepared_intake ? "Prepared demo profile. Priority, requirements and pickup are supplied for this exercise." : `Published: ${d.public_call_type || "Call"} · ${d.public_location || "Location unavailable"} · ${yn(vu(d.public_observed_at, f.now))} ago. ${d.public_kind === "fire" ? `Published fire units: ${d.public_units || "not supplied"} · alarm level ${d.public_alarm_level ?? "not supplied"}. ` : ""}${d.pickup_source === "dispatcher" ? "Pickup entered by dispatcher." : "Public positions are approximate."}` })
      ] }),
      /* @__PURE__ */ c.jsxs(
        "form",
        {
          onSubmit: async (b) => {
            b.preventDefault(), ze("");
            const L = d.id;
            try {
              await f.mutate(
                "/api/incidents/details",
                { ...w, incident_id: L, revision: w.revision },
                "Incident details saved."
              ), r(void 0);
            } catch (I) {
              ze(
                I instanceof Error ? I.message : "Could not save details"
              );
            }
          },
          children: [
            /* @__PURE__ */ c.jsx("div", { className: "form-grid", children: ["priority", "service", "equipment"].map((b) => /* @__PURE__ */ c.jsxs("label", { children: [
              b === "priority" ? "Priority" : b === "service" ? "Required service" : "Required equipment",
              /* @__PURE__ */ c.jsxs(
                "select",
                {
                  required: !0,
                  value: w[b],
                  onChange: (L) => r({ ...w, [b]: L.target.value }),
                  children: [
                    /* @__PURE__ */ c.jsxs("option", { value: "", children: [
                      "Choose ",
                      b
                    ] }),
                    (b === "priority" ? ["Priority 1", "Priority 2", "Priority 3"] : b === "service" ? ["general", "cardiac", "trauma", "neuro", "pediatric"] : ["general", "advanced"]).map((L) => /* @__PURE__ */ c.jsx("option", { value: L, children: L }, L))
                  ]
                }
              )
            ] }, b)) }),
            /* @__PURE__ */ c.jsxs("label", { children: [
              "Pickup address or intersection",
              /* @__PURE__ */ c.jsx(
                "input",
                {
                  maxLength: 200,
                  value: w.pickup_label,
                  onChange: (b) => r({ ...w, pickup_label: b.target.value })
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
                    min: O.city.bounds[0] + 1e-6,
                    max: O.city.bounds[2] - 1e-6,
                    value: w.lat,
                    onChange: (b) => r({ ...w, lat: b.target.value })
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
                    min: O.city.bounds[1] + 1e-6,
                    max: O.city.bounds[3] - 1e-6,
                    value: w.lon,
                    onChange: (b) => r({ ...w, lon: b.target.value })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ c.jsx(
              "button",
              {
                type: "button",
                className: "text-button",
                "aria-pressed": H,
                onClick: () => {
                  r(w), B();
                },
                children: H ? "Cancel map pickup" : "Choose pickup on map"
              }
            ),
            /* @__PURE__ */ c.jsx("p", { className: "micro", children: H ? "Click a confirmed pickup point on the map." : "Confirm the pickup point. A street or postal area alone is not an exact pickup." }),
            /* @__PURE__ */ c.jsxs("label", { children: [
              "Dispatcher notes",
              /* @__PURE__ */ c.jsx(
                "textarea",
                {
                  rows: 3,
                  maxLength: 1e3,
                  value: w.notes,
                  onChange: (b) => r({ ...w, notes: b.target.value })
                }
              )
            ] }),
            /* @__PURE__ */ c.jsx("p", { className: "micro", children: "Priority, requirements and notes are dispatcher entries, separate from public facts." }),
            (W || w.revision !== (d.incident_revision || 0)) && /* @__PURE__ */ c.jsxs("div", { className: "notice warning", role: "alert", children: [
              /* @__PURE__ */ c.jsx("p", { children: W || "This case changed while you were editing. Your draft has been preserved." }),
              /* @__PURE__ */ c.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    r(Xf(d)), ze("");
                  },
                  children: "Discard draft and load current details"
                }
              )
            ] }),
            /* @__PURE__ */ c.jsx("button", { className: "primary", type: "submit", disabled: de, children: "Confirm & let ARC continue" })
          ]
        }
      )
    ] })
  ) : null, $ = (b) => /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
    /* @__PURE__ */ c.jsxs("section", { className: "journey-progress", children: [
      /* @__PURE__ */ c.jsx("h3", { children: "Journey progress" }),
      /* @__PURE__ */ c.jsx("ol", { className: "journey-stages", children: [
        "assigned",
        "responding",
        "on_scene",
        "transporting",
        "handover",
        "completed"
      ].map((L) => /* @__PURE__ */ c.jsx(
        "li",
        {
          className: b.phase === L ? "current" : "",
          "aria-current": b.phase === L ? "step" : void 0,
          children: El(L)
        },
        L
      )) }),
      b.hold_reason ? /* @__PURE__ */ c.jsx("p", { className: "notice warning", children: b.hold_reason }) : ["completed", "cancelled"].includes(b.phase) ? /* @__PURE__ */ c.jsxs("p", { className: "quiet", children: [
        "Ended ",
        b.completed_at ? gn(b.completed_at) : "",
        " · resources released."
      ] }) : b.automatic ? /* @__PURE__ */ c.jsxs("p", { className: "quiet", children: [
        "Next stage in",
        " ",
        yn(
          Math.max(0, Math.ceil((b.phase_ends_epoch || 0) - f.now / 1e3))
        ),
        " ",
        "· ",
        b.speed,
        "× exercise clock"
      ] }) : /* @__PURE__ */ c.jsx("p", { className: "quiet", children: "Earlier assignment · advance stages manually in Journey controls." }),
      /* @__PURE__ */ c.jsx("p", { className: "micro", children: "Progress follows assessed routes and exercise timing, not live crew updates." })
    ] }),
    !["completed", "cancelled"].includes(b.phase) && ve(
      "journey-controls",
      "Journey controls",
      /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
        /* @__PURE__ */ c.jsx("p", { className: "quiet", children: "Advance one exercise stage, or end this assignment and release its resources at the current position." }),
        /* @__PURE__ */ c.jsxs("div", { className: "button-row", children: [
          /* @__PURE__ */ c.jsxs(
            "button",
            {
              disabled: de || !!b.hold_reason,
              onClick: () => {
                f.mutate(
                  "/api/assignments/progress",
                  { id: b.id, revision: b.revision, action: "advance" },
                  "Assignment progress advanced."
                ).catch(() => {
                });
              },
              children: [
                "Advance to",
                " ",
                El(Hy(b.phase)).toLowerCase()
              ]
            }
          ),
          /* @__PURE__ */ c.jsx(
            "button",
            {
              disabled: de,
              onClick: () => {
                f.mutate(
                  "/api/assignments/progress",
                  { id: b.id, revision: b.revision, action: "cancel" },
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
    ve(
      "journey-history",
      "Journey history",
      /* @__PURE__ */ c.jsx("ol", { className: "trace", children: b.history.map((L, I) => /* @__PURE__ */ c.jsxs("li", { children: [
        El(L.phase),
        " · ",
        gn(L.at, !0)
      ] }, I)) })
    )
  ] });
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
    /* @__PURE__ */ c.jsxs("section", { className: "case-guidance", children: [
      /* @__PURE__ */ c.jsx("span", { className: "eyebrow", children: "ARC" }),
      /* @__PURE__ */ c.jsx("h3", { children: se }),
      /* @__PURE__ */ c.jsx("p", { children: fe }),
      Ee && /* @__PURE__ */ c.jsx(
        "button",
        {
          onClick: () => {
            J(Ee === "intake" ? "intake" : "manual", !0), requestAnimationFrame(
              () => document.querySelector(
                ".case-content details[open]"
              )?.scrollIntoView({ block: "nearest" })
            );
          },
          children: z === "reports" ? "Confirm this response case" : z === "history" ? "Review report details" : Y.action
        }
      )
    ] }),
    f.errors[d.id] && /* @__PURE__ */ c.jsx("p", { className: "notice error", role: "alert", children: f.errors[d.id] }),
    f.job && Bf(f.job, d.id, O.epoch) && /* @__PURE__ */ c.jsxs("p", { className: "assessment-progress", role: "status", children: [
      /* @__PURE__ */ c.jsx("span", { className: "agent-orb running" }),
      Qf(f.job.stage)
    ] }),
    ue && me,
    (y || P) && /* @__PURE__ */ c.jsxs("div", { className: "decision-heading", children: [
      /* @__PURE__ */ c.jsx("h3", { children: z === "completed" ? "Completed assignment" : z === "reserved" ? "Approved plan" : N === "ready" ? "Your decision" : "Response plan" }),
      /* @__PURE__ */ c.jsx(
        "span",
        {
          className: `status-label ${N === "ready" ? "success" : ""}`,
          children: {
            ready: "Ready for review",
            changed: "Review required",
            expired: "Evidence expired",
            approved: El(P?.phase),
            rejected: "Rejected",
            blocked: "Blocked",
            incomplete: "Details required"
          }[N]
        }
      )
    ] }),
    P && (!y || y.decision === "approved") && $(P),
    y && /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
      Z ? /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
        y.decision === "pending" && N === "ready" && /* @__PURE__ */ c.jsx("p", { className: "plan-explanation", children: hn(
          Z.reasons?.[0] || "These resources meet the confirmed requirements."
        ).replace(
          "Lowest total driving time among eligible pairs; ties prefer more receiving slots, then stable ID.",
          "This is the shortest combined driving time among eligible plans."
        ) }),
        /* @__PURE__ */ c.jsxs("section", { className: "plan-section", children: [
          /* @__PURE__ */ c.jsxs("div", { className: "plan-label", children: [
            /* @__PURE__ */ c.jsx("span", { children: "RESPONSE UNIT" }),
            /* @__PURE__ */ c.jsx("span", { children: y.decision === "approved" ? El(P?.phase) : ["changed", "expired"].includes(N) ? "Previous plan" : "Proposed" })
          ] }),
          /* @__PURE__ */ c.jsxs("div", { className: "plan-main", children: [
            /* @__PURE__ */ c.jsxs("div", { children: [
              /* @__PURE__ */ c.jsx("strong", { children: y.source_rows.fleet.find((b) => b.id === Z.ambulance_id)?.name || Z.ambulance_id }),
              /* @__PURE__ */ c.jsxs("p", { children: [
                "Meets the ",
                d.equipment,
                " equipment requirement"
              ] })
            ] }),
            y.decision !== "approved" && /* @__PURE__ */ c.jsxs("div", { className: "eta", children: [
              /* @__PURE__ */ c.jsxs("strong", { children: [
                "~",
                Z.pickup_min
              ] }),
              /* @__PURE__ */ c.jsx("small", { children: "min to pickup" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ c.jsxs("section", { className: "plan-section", children: [
          /* @__PURE__ */ c.jsx("div", { className: "plan-label", children: y.decision === "approved" ? "RECEIVING FACILITY" : "DESTINATION PREVIEW" }),
          /* @__PURE__ */ c.jsxs("div", { className: "plan-main", children: [
            /* @__PURE__ */ c.jsxs("div", { children: [
              /* @__PURE__ */ c.jsx("strong", { children: y.source_rows.hospitals.find(
                (b) => b.id === Z.hospital_id
              )?.name || Z.hospital_id }),
              /* @__PURE__ */ c.jsxs("p", { children: [
                "Meets the ",
                d.service,
                " service requirement"
              ] })
            ] }),
            y.decision !== "approved" && /* @__PURE__ */ c.jsxs("div", { className: "eta transport", children: [
              /* @__PURE__ */ c.jsxs("strong", { children: [
                "~",
                Z.transport_min
              ] }),
              /* @__PURE__ */ c.jsx("small", { children: "min from pickup" })
            ] })
          ] })
        ] }),
        y.decision !== "approved" && /* @__PURE__ */ c.jsx("p", { className: "micro", children: "Driving estimates exclude time on scene and hospital handover." })
      ] }) : /* @__PURE__ */ c.jsxs("p", { className: "notice warning", children: [
        /* @__PURE__ */ c.jsx("strong", { children: "No suitable plan yet" }),
        /* @__PURE__ */ c.jsx("br", {}),
        "ARC could not match the current requirements, available resources and routes."
      ] }),
      y.decision === "rejected" && /* @__PURE__ */ c.jsx("p", { className: "notice warning", children: "Plan rejected. Review the requirements or request another assessment when ready." }),
      !!y.changes.length && N === "ready" && /* @__PURE__ */ c.jsxs("div", { className: "notice", children: [
        /* @__PURE__ */ c.jsx("strong", { children: "What changed" }),
        y.changes.map((b, L) => /* @__PURE__ */ c.jsx("p", { children: hn(b.text) }, L))
      ] }),
      y.decision === "pending" && /* @__PURE__ */ c.jsxs(
        "div",
        {
          className: `evidence-quality ${["changed", "expired"].includes(N) ? "attention" : ""}`,
          children: [
            /* @__PURE__ */ c.jsx("span", { children: N === "expired" ? "Evidence expired" : "Checked" }),
            /* @__PURE__ */ c.jsxs("span", { children: [
              yn(
                Math.max(
                  0,
                  Math.floor(
                    f.now / 1e3 - (y.evidence_epoch || y.created_epoch)
                  )
                )
              ),
              " ",
              "ago"
            ] })
          ]
        }
      ),
      N === "ready" && Z && /* @__PURE__ */ c.jsxs("div", { className: "approval-area", children: [
        /* @__PURE__ */ c.jsxs("div", { className: "decision-actions", children: [
          /* @__PURE__ */ c.jsx(
            "button",
            {
              id: "approve",
              className: "primary approve",
              disabled: de || !!(f.job && !f.job.automatic && Bf(f.job, d.id, O.epoch)),
              onClick: () => {
                f.decide("approve");
              },
              children: "Approve plan"
            }
          ),
          /* @__PURE__ */ c.jsx(
            "button",
            {
              disabled: de || !!(f.job && !f.job.automatic && Bf(f.job, d.id, O.epoch)),
              onClick: () => {
                f.decide("reject");
              },
              children: "Reject plan"
            }
          )
        ] }),
        /* @__PURE__ */ c.jsx("p", { className: "micro", children: "Approval reserves this unit and one receiving slot." })
      ] }),
      !!y.alternatives.filter(
        (b) => b.type === "assignment" && b.eligible && b.id !== Z?.id
      ).length && ve(
        "alternatives",
        N === "ready" ? "Compare options" : "Other options at assessment",
        /* @__PURE__ */ c.jsx(c.Fragment, { children: y.alternatives.filter(
          (b) => b.type === "assignment" && b.eligible && b.id !== Z?.id
        ).sort(
          (b, L) => b.pickup_min - L.pickup_min || b.transport_min - L.transport_min
        ).map((b) => /* @__PURE__ */ c.jsxs("div", { className: "alternative-row", children: [
          /* @__PURE__ */ c.jsx("strong", { children: b.name }),
          /* @__PURE__ */ c.jsxs("p", { children: [
            "~",
            b.pickup_min,
            " min response · ~",
            b.transport_min,
            " min transport"
          ] }),
          N === "ready" && /* @__PURE__ */ c.jsx(
            "button",
            {
              disabled: de || !!f.job,
              onClick: () => {
                f.assess(b.id);
              },
              children: "Ask ARC to review this option"
            }
          )
        ] }, b.id)) })
      ),
      ve(
        "reasoning",
        "Why this plan?",
        /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
          y.explanation.evidence_ids.map((b) => {
            const L = y.evidence.find((I) => I.id === b);
            return L ? /* @__PURE__ */ c.jsxs("div", { className: "evidence-item", children: [
              /* @__PURE__ */ c.jsx("span", { className: "eid", children: b }),
              /* @__PURE__ */ c.jsx("p", { children: hn(L.text) })
            ] }, b) : null;
          }),
          y.alternatives.filter((b) => !b.eligible).map((b) => /* @__PURE__ */ c.jsxs("div", { className: "alternative-row", children: [
            /* @__PURE__ */ c.jsxs("strong", { children: [
              b.name,
              " · excluded"
            ] }),
            /* @__PURE__ */ c.jsx("p", { children: hn(b.reasons.join(" ")) })
          ] }, b.id))
        ] })
      ),
      ve(
        "sources",
        "Evidence & activity",
        /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
          /* @__PURE__ */ c.jsxs("p", { className: "quiet", children: [
            "Routes:",
            " ",
            Z ? `${Z.transport_route.mode} ${Z.transport_route.source}` : "unavailable or ineligible",
            " ",
            "·",
            " ",
            Z?.transport_route.traffic_aware ? "Traffic at assessment time" : "Static estimates; no live traffic",
            /* @__PURE__ */ c.jsx("br", {}),
            "Assessed",
            " ",
            new Date(y.created_at).toLocaleString("en-CA", {
              timeZone: O.city.timezone
            })
          ] }),
          y.changes.map((b, L) => /* @__PURE__ */ c.jsx("p", { className: "notice", children: hn(b.text) }, L)),
          /* @__PURE__ */ c.jsx("ol", { className: "trace", children: y.trace.map((b, L) => /* @__PURE__ */ c.jsxs("li", { children: [
            /* @__PURE__ */ c.jsx("strong", { children: b.tool }),
            /* @__PURE__ */ c.jsx("br", {}),
            hn(b.detail)
          ] }, L)) }),
          Object.entries(y.source_rows).map(([b, L]) => /* @__PURE__ */ c.jsxs("p", { className: "micro", children: [
            b,
            " · observed",
            " ",
            L[0]?.observed_at || "missing timestamp"
          ] }, b))
        ] })
      )
    ] }),
    !ue && me,
    d.status === "open" && !ue && !["working", "queued"].includes(d.agent_state || "") && ve(
      "manual",
      "Ask ARC to review this case",
      /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
        /* @__PURE__ */ c.jsxs("label", { children: [
          "Add an instruction",
          /* @__PURE__ */ c.jsx(
            "textarea",
            {
              rows: 3,
              value: X,
              onChange: (b) => C(b.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ c.jsx(
          "button",
          {
            className: "secondary-action",
            disabled: de || !!f.job,
            onClick: () => {
              f.assess(void 0, X);
            },
            children: f.job ? "Another assessment is running" : d.agent_state === "needs_input" ? "Retry assessment" : "Reassess now"
          }
        )
      ] })
    )
  ] });
}
function Vy({
  state: f,
  onSelect: d
}) {
  const E = ki(f);
  return /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
    /* @__PURE__ */ c.jsx("p", { className: "quiet", children: "Units and receiving facilities across this workspace." }),
    f.city.id === "toronto" && /* @__PURE__ */ c.jsx("p", { className: "micro", children: "Station-based positions use official Toronto geography. Unit staging and availability are scenario data." }),
    /* @__PURE__ */ c.jsxs("h3", { className: "section-title", children: [
      "Response units",
      " ",
      /* @__PURE__ */ c.jsxs("span", { children: [
        f.fleet.filter(
          (r) => r.status === "available" && !E.has(r.id)
        ).length,
        " ",
        "free"
      ] })
    ] }),
    f.fleet.map((r) => /* @__PURE__ */ c.jsxs(
      "button",
      {
        className: "resource-row",
        onClick: () => d({ kind: "unit", id: r.id }),
        children: [
          /* @__PURE__ */ c.jsx("span", { className: "resource-icon", children: /* @__PURE__ */ c.jsx(Ke, { name: "unit" }) }),
          /* @__PURE__ */ c.jsxs("span", { className: "resource-copy", children: [
            /* @__PURE__ */ c.jsx("strong", { children: r.name }),
            /* @__PURE__ */ c.jsx("small", { children: r.equipment.replaceAll(",", " · ") }),
            r.station_reference && /* @__PURE__ */ c.jsxs("small", { children: [
              "Base: ",
              r.station_reference.name
            ] })
          ] }),
          /* @__PURE__ */ c.jsx(
            "span",
            {
              className: `status-label ${r.status === "available" ? "success" : ""}`,
              children: r.status === "assigned" ? El(
                f.assignments.find((H) => H.id === r.active_assignment_id)?.phase
              ) : E.has(r.id) ? "Proposed" : r.status
            }
          )
        ]
      },
      r.id
    )),
    /* @__PURE__ */ c.jsx("h3", { className: "section-title", children: "Receiving facilities" }),
    f.hospitals.map((r) => /* @__PURE__ */ c.jsxs(
      "button",
      {
        className: "resource-row",
        onClick: () => d({ kind: "hospital", id: r.id }),
        children: [
          /* @__PURE__ */ c.jsx("span", { className: "resource-icon hospital", children: /* @__PURE__ */ c.jsx(Ke, { name: "hospital" }) }),
          /* @__PURE__ */ c.jsxs("span", { className: "resource-copy", children: [
            /* @__PURE__ */ c.jsx("strong", { children: r.name }),
            /* @__PURE__ */ c.jsx("small", { children: r.capabilities.replaceAll(",", " · ") })
          ] }),
          /* @__PURE__ */ c.jsx(
            "span",
            {
              className: `status-label ${r.accepting && r.slots > 0 ? "success" : "warning"}`,
              children: r.accepting && r.slots > 0 ? r.slots + " slots" : "Unavailable"
            }
          )
        ]
      },
      r.id
    ))
  ] });
}
function Ki(f, d) {
  return d ? d.kind === "incident" ? f.incidents.find((E) => E.id === d.id) || null : d.kind === "unit" ? f.fleet.find((E) => E.id === d.id) || null : d.kind === "hospital" ? f.hospitals.find((E) => E.id === d.id) || null : d.kind === "closure" ? f.closures.find((E, r) => (E.id || String(r)) === d.id) || null : f.public_context[d.kind]?.records.find((E) => E.id === d.id) || null : null;
}
const Ky = {
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
function Jy({
  state: f,
  feature: d,
  onCase: E
}) {
  const r = Ki(f, d);
  if (!r)
    return /* @__PURE__ */ c.jsx("p", { className: "notice warning", children: "This feature is no longer in the current picture." });
  const H = [];
  let B = "";
  if (d.kind === "unit") {
    const U = f.fleet.find((X) => X.id === d.id), J = f.assignments.find((X) => X.id === U.active_assignment_id);
    H.push(
      [
        "Status",
        J ? El(J.phase) : ki(f).has(U.id) ? "Proposed" : U.status
      ],
      ["Equipment", U.equipment.replaceAll(",", " · ")]
    ), U.station_reference && H.push(
      ["Base", U.station_reference.name],
      ["Address", U.station_reference.address]
    ), J && H.push([
      "Assignment",
      /* @__PURE__ */ c.jsx("button", { className: "text-button", onClick: () => E(J.incident_id), children: "Open assigned case" })
    ]), B = "Unit availability and movement are exercise data, not live vehicle tracking.";
  } else if (d.kind === "hospital") {
    const U = f.hospitals.find((J) => J.id === d.id);
    H.push(
      [
        "Receiving status",
        U.accepting && U.slots > 0 ? "Accepting" : "Unavailable"
      ],
      ["Available slots", U.slots],
      ["Services", U.capabilities.replaceAll(",", " · ")]
    ), B = "Receiving availability is workspace exercise data, separate from public hospital waits.";
  } else if (d.kind === "closure")
    H.push([
      "Radius",
      String("radius_m" in r ? r.radius_m : "") + " m"
    ]), B = "This scenario closure participates in route eligibility checks.";
  else {
    const U = r;
    for (const [C, O] of [
      ["Address", "address"],
      ["Location", "location"],
      ["Description", "description"],
      ["Published units", "units"],
      ["Observed speed", "speed_kph"],
      ["Free-flow speed", "free_flow_kph"],
      ["Confidence", "confidence"]
    ]) {
      const y = U[O];
      y != null && H.push([C, `${y}${O.includes("kph") ? " km/h" : ""}`]);
    }
    U.observed_at && H.push([
      "Source updated",
      new Date(U.observed_at).toLocaleString("en-CA", {
        timeZone: f.city.timezone
      })
    ]), U.updated_ms && H.push([
      "Source updated",
      new Date(Number(U.updated_ms)).toLocaleString("en-CA", {
        timeZone: f.city.timezone
      })
    ]);
    const J = f.public_context[d.kind];
    H.push([
      "Feed status",
      J?.stale ? "Stale" : J?.mode === "live" ? "Connected" : J?.mode || "Unavailable"
    ]), J?.fetched_at && H.push(["Retrieved", gn(J.fetched_at)]), J?.source_url && H.push([
      "Source",
      /* @__PURE__ */ c.jsx("a", { href: J.source_url, target: "_blank", rel: "noreferrer", children: "Official source ↗" })
    ]), B = d.kind === "stations" ? "Official station location. The catalogue contains no live vehicles, staffing or availability." : d.kind === "roads" ? "Public restriction context. These points do not automatically block routes or alter travel estimates." : "Published context does not establish a confirmed response case or resource availability.";
    const X = f.incidents.find(
      (C) => C.public_source && C.public_observed_at === U.observed_at && C.public_location === U.location
    );
    X && H.push([
      "ARC case",
      /* @__PURE__ */ c.jsx("button", { className: "text-button", onClick: () => E(X.id), children: "Open queued call" })
    ]);
  }
  return ct(r) && H.push([
    "Coordinates",
    `${r.lat.toFixed(5)}, ${r.lon.toFixed(5)}`
  ]), /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
    /* @__PURE__ */ c.jsx("div", { className: `feature-symbol ${d.kind}`, children: /* @__PURE__ */ c.jsx(
      Ke,
      {
        name: d.kind === "unit" ? "unit" : d.kind === "hospital" ? "hospital" : "pin",
        size: 26
      }
    ) }),
    /* @__PURE__ */ c.jsx("dl", { className: "attributes", children: H.map(([U, J]) => /* @__PURE__ */ c.jsxs("div", { children: [
      /* @__PURE__ */ c.jsx("dt", { children: U }),
      /* @__PURE__ */ c.jsx("dd", { children: J })
    ] }, U)) }),
    /* @__PURE__ */ c.jsx("p", { className: "quiet feature-note", children: B })
  ] });
}
const ky = {
  fire: "Public fire dispatch activity. Published positions may be approximate. Feed disappearance does not establish resolution.",
  police: "Public calls near mapped intersections. Reports may remain published after they have been handled.",
  roads: "Partial and scheduled restrictions provide context; these points do not automatically block routes.",
  hospitals: "Posted waits are not ambulance acceptance or available receiving slots.",
  traffic: "Sampled speeds describe nearby segments. Route estimates identify whether traffic was included.",
  stations: "Official Toronto station locations. No live staffing or vehicle availability is supplied."
};
function $y({ record: f, city: d }) {
  const [E, r] = F.useState(""), [H, B] = F.useState(!1);
  return /* @__PURE__ */ c.jsxs("details", { className: "review-details", children: [
    /* @__PURE__ */ c.jsxs("summary", { children: [
      "Camera ",
      f.id,
      " · ",
      f.name
    ] }),
    /* @__PURE__ */ c.jsx(
      "button",
      {
        onClick: () => {
          B(!1), r(
            `/api/cameras/${encodeURIComponent(f.id)}?city=${d}&t=${Date.now()}`
          );
        },
        children: E ? "Refresh snapshot" : "Load camera snapshot"
      }
    ),
    H ? /* @__PURE__ */ c.jsx("p", { role: "status", children: "Camera image unavailable." }) : E && /* @__PURE__ */ c.jsx(
      "img",
      {
        className: "camera-image",
        alt: `${d} traffic camera snapshot`,
        src: E,
        onError: () => B(!0)
      }
    )
  ] });
}
function Fy({
  workspace: f,
  layers: d,
  setLayers: E,
  onSelect: r,
  onCase: H
}) {
  const B = f.state, [U, J] = F.useState("fire"), X = B.public_context[U], C = X?.records || [], O = B.incidents.find((z) => z.id === f.selected), y = (z) => ct(z) && ct(O) ? Math.hypot((z.lat - O.lat) * 111, (z.lon - O.lon) * 80) : 1 / 0, N = U === "police" ? [...C].sort(
    (z, Y) => String(Y.observed_at).localeCompare(String(z.observed_at))
  ).slice(0, 30) : U === "roads" ? [...C].sort((z, Y) => y(z) - y(Y)).slice(0, 20) : C;
  return /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
    /* @__PURE__ */ c.jsx("h3", { className: "section-title first", children: "Map layers" }),
    /* @__PURE__ */ c.jsx("div", { className: "layer-list", children: [
      ["resources", "All units and facilities"],
      ["calls", "Public calls"],
      ["roads", "Road restrictions"],
      ["traffic", "Sampled traffic speeds"],
      ...B.city.id === "toronto" ? [["stations", "Ambulance stations"]] : []
    ].map(([z, Y]) => /* @__PURE__ */ c.jsxs("label", { children: [
      /* @__PURE__ */ c.jsx(
        "input",
        {
          type: "checkbox",
          checked: d[z],
          onChange: (P) => E({ ...d, [z]: P.target.checked })
        }
      ),
      /* @__PURE__ */ c.jsx("span", { children: Y })
    ] }, z)) }),
    /* @__PURE__ */ c.jsxs("p", { className: "micro", children: [
      B.incidents.filter(
        (z) => z.status === "open" && z.service && !ct(z)
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
          value: U,
          onChange: (z) => J(z.target.value),
          children: [
            /* @__PURE__ */ c.jsx("option", { value: "fire", children: "Fire & medical assists" }),
            B.city.id === "toronto" && /* @__PURE__ */ c.jsx("option", { value: "police", children: "Police calls" }),
            /* @__PURE__ */ c.jsx("option", { value: "roads", children: "Road restrictions" }),
            /* @__PURE__ */ c.jsx("option", { value: "hospitals", children: "Hospital wait context" }),
            /* @__PURE__ */ c.jsx("option", { value: "traffic", children: "Traffic conditions" }),
            B.city.id === "toronto" && /* @__PURE__ */ c.jsx("option", { value: "stations", children: "Ambulance stations" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ c.jsx("p", { className: "quiet", children: U === "hospitals" && B.city.id === "seattle" ? "No live Seattle hospital waits or acceptance feed is connected." : ky[U] }),
    /* @__PURE__ */ c.jsxs("p", { className: `micro ${X?.stale ? "attention" : ""}`, children: [
      X?.mode === "live" ? X.stale ? "Last retrieval is stale" : "Connected" : X?.mode === "cached" ? "Cached · refresh failed" : "Unavailable",
      X?.fetched_at ? " · retrieved " + gn(X.fetched_at) : "",
      X?.error ? " · " + X.error : ""
    ] }),
    /* @__PURE__ */ c.jsxs("div", { className: "public-list", children: [
      N.map((z) => /* @__PURE__ */ c.jsxs("div", { className: "public-row", children: [
        /* @__PURE__ */ c.jsx("strong", { children: z.name || z.id }),
        (U === "fire" || U === "police") && /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
          /* @__PURE__ */ c.jsxs("p", { children: [
            z.location,
            " ·",
            " ",
            yn(vu(z.observed_at, f.now)),
            " ago",
            z.units ? " · " + z.units : ""
          ] }),
          (() => {
            const Y = B.incidents.find(
              (P) => P.public_source && P.public_observed_at === z.observed_at && P.public_location === z.location
            );
            return Y ? /* @__PURE__ */ c.jsx("button", { onClick: () => H(Y.id), children: "Open queued call" }) : null;
          })()
        ] }),
        U === "stations" && /* @__PURE__ */ c.jsx("p", { children: z.address }),
        U === "roads" && /* @__PURE__ */ c.jsx("p", { children: z.description }),
        U === "hospitals" && /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
          /* @__PURE__ */ c.jsxs("p", { children: [
            z.wait_min != null ? `${z.wait_min} min posted wait` : "Wait unavailable",
            z.patients_waiting != null ? ` · ${z.patients_waiting} waiting` : ""
          ] }),
          /* @__PURE__ */ c.jsxs("p", { children: [
            yn(vu(z.observed_at, f.now)),
            " ago",
            (vu(z.observed_at, f.now) ?? 1 / 0) > 7200 ? " · stale / unverified" : ""
          ] })
        ] }),
        U === "traffic" && /* @__PURE__ */ c.jsxs("p", { children: [
          z.speed_kph,
          " km/h observed · ",
          z.free_flow_kph,
          " km/h free flow ·",
          " ",
          z.closed ? "road closed" : "no closure reported"
        ] }),
        ct(z) && U !== "hospitals" && /* @__PURE__ */ c.jsx(
          "button",
          {
            className: "text-button",
            onClick: () => r({ kind: U, id: z.id }),
            children: "Inspect on map ↗"
          }
        )
      ] }, z.id)),
      !N.length && /* @__PURE__ */ c.jsx("p", { className: "quiet", children: X?.mode === "live" ? "No records returned by this source." : "Waiting for available source data." })
    ] }),
    X?.source_url && /* @__PURE__ */ c.jsx("p", { className: "micro", children: /* @__PURE__ */ c.jsx("a", { href: X.source_url, target: "_blank", rel: "noreferrer", children: "Official source ↗" }) }),
    U === "traffic" && B.city.id === "toronto" && /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
      /* @__PURE__ */ c.jsx("p", { className: "quiet", children: "City traffic cameras · on-demand snapshots. Image capture time is not supplied; images may be old." }),
      [...B.public_context.cameras?.records || []].sort((z, Y) => y(z) - y(Y)).slice(0, 3).map((z) => /* @__PURE__ */ c.jsx($y, { record: z, city: B.city.id }, z.id))
    ] }),
    /* @__PURE__ */ c.jsx("h3", { className: "section-title", children: "Recent activity" }),
    [
      ...f.activities,
      ...B.agent.events.map((z) => ({
        text: (z.incident_id ? z.incident_id + " · " : "") + z.text,
        at: z.at
      }))
    ].sort((z, Y) => Y.at.localeCompare(z.at)).slice(0, 6).map((z, Y) => /* @__PURE__ */ c.jsxs("p", { className: "activity-row", children: [
      /* @__PURE__ */ c.jsx("time", { children: gn(z.at) }),
      z.text
    ] }, Y))
  ] });
}
function Wy({
  workspace: f,
  onClose: d
}) {
  const E = f.state, [r, H] = F.useState(!1), B = async (U) => {
    try {
      await f.mutate(
        "/api/scenario",
        { name: U, incident_id: f.selected },
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
    ].map(([U, J, X]) => /* @__PURE__ */ c.jsxs(
      "button",
      {
        disabled: f.busy || !f.connected || !f.selected,
        onClick: () => {
          B(U);
        },
        children: [
          /* @__PURE__ */ c.jsx("strong", { children: J }),
          /* @__PURE__ */ c.jsx("span", { children: X })
        ]
      },
      U
    )) }),
    /* @__PURE__ */ c.jsxs("details", { className: "review-details", children: [
      /* @__PURE__ */ c.jsx("summary", { children: "Service conditions" }),
      /* @__PURE__ */ c.jsx("div", { className: "button-row", children: [
        ["stale-feed", "Stale feed"],
        ["no-destination", "No destination"],
        ["zetaris-offline", "Data failure"],
        ["ai-offline", "AI failure"],
        ["refresh", "Restore feeds"]
      ].map(([U, J]) => /* @__PURE__ */ c.jsx(
        "button",
        {
          disabled: f.busy || !f.connected,
          onClick: () => {
            B(U);
          },
          children: J
        },
        U
      )) })
    ] }),
    /* @__PURE__ */ c.jsxs("label", { className: "field-label", children: [
      "Exercise journey speed",
      /* @__PURE__ */ c.jsxs(
        "select",
        {
          value: E.journey_speed || 10,
          disabled: f.busy || !f.connected,
          onChange: (U) => {
            f.mutate(
              "/api/journeys/speed",
              { speed: Number(U.target.value) },
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
        disabled: f.busy || !f.connected,
        onClick: () => {
          f.mutate("/api/demo/intake", {}).then(
            (U) => f.notify(
              U.loaded ? "Prepared intake loaded. ARC will assess automatically." : "Prepared intake is already loaded."
            )
          ).catch(() => {
          });
        },
        children: "Load prepared demo intake"
      }
    ),
    /* @__PURE__ */ c.jsx("p", { className: "quiet", children: E.scenario === "baseline" ? "Baseline scenario" : E.scenario.replaceAll("-", " ") }),
    /* @__PURE__ */ c.jsx("div", { className: "reset-section", children: r ? /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
      /* @__PURE__ */ c.jsx("p", { children: "Reset this city’s exercise cases, plans and reservations?" }),
      /* @__PURE__ */ c.jsxs("div", { className: "button-row", children: [
        /* @__PURE__ */ c.jsx(
          "button",
          {
            className: "danger",
            disabled: f.busy || !f.connected,
            onClick: () => {
              f.mutate("/api/reset", {}, "Workspace reset.").then(d).catch(() => {
              });
            },
            children: "Confirm reset"
          }
        ),
        /* @__PURE__ */ c.jsx("button", { onClick: () => H(!1), children: "Keep workspace" })
      ] })
    ] }) : /* @__PURE__ */ c.jsx(
      "button",
      {
        className: "text-button danger",
        onClick: () => H(!0),
        children: "Reset workspace"
      }
    ) })
  ] });
}
function Iy({ workspace: f }) {
  const [d, E] = F.useState(null), [r, H] = F.useState("");
  F.useEffect(() => {
    const U = new AbortController();
    return vn(
      "/api/world",
      void 0,
      U.signal
    ).then(E).catch((J) => {
      U.signal.aborted || H(J.message);
    }), () => U.abort();
  }, []);
  const B = f.state;
  return /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
    r ? /* @__PURE__ */ c.jsx("p", { className: "notice error", children: r }) : d ? /* @__PURE__ */ c.jsx(c.Fragment, { children: [
      [
        "Zetaris · federated product query",
        f.rec?.zetaris || B.integrations.zetaris || "Assess an incident first."
      ],
      [
        "Nightshift → NVIDIA Nemotron",
        f.rec?.ai || "No completed AI assessment yet."
      ],
      [
        "Meterless World Model",
        {
          entities: d.entities.length,
          recent_events_returned: d.events.length,
          events: d.events.slice(-8)
        }
      ]
    ].map(([U, J]) => /* @__PURE__ */ c.jsxs("section", { className: "integration-block", children: [
      /* @__PURE__ */ c.jsx("h3", { children: String(U) }),
      /* @__PURE__ */ c.jsx("pre", { children: JSON.stringify(J, null, 2) })
    ] }, String(U))) }) : /* @__PURE__ */ c.jsx("p", { children: "Loading integration evidence…" }),
    /* @__PURE__ */ c.jsxs("h3", { className: "section-title", children: [
      B.city.name,
      " road context · ",
      B.public_roads.mode
    ] }),
    /* @__PURE__ */ c.jsx("p", { className: "quiet", children: B.public_roads.note || B.public_roads.error || "Public point restrictions are contextual, not validated closure polygons." }),
    /* @__PURE__ */ c.jsxs("p", { className: "micro", children: [
      B.public_roads.fetched_at || "Not fetched",
      " ·",
      " ",
      B.public_roads.records.length,
      " records"
    ] }),
    /* @__PURE__ */ c.jsx(
      "button",
      {
        disabled: f.busy || !f.connected,
        onClick: () => {
          f.mutate("/api/roads/refresh", {}, "Public road context refreshed.").catch(() => {
          });
        },
        children: "Refresh public road context"
      }
    )
  ] });
}
function Py() {
  const [f, d] = F.useState(
    () => matchMedia("(max-width: 760px)").matches
  );
  return F.useEffect(() => {
    const E = matchMedia("(max-width: 760px)"), r = () => d(E.matches);
    return E.addEventListener("change", r), () => E.removeEventListener("change", r);
  }, []), f;
}
function eg() {
  const f = Gy(), d = f.state, E = Py(), [r, H] = F.useState(!E), [B, U] = F.useState("all"), [J, X] = F.useState({}), [C, O] = F.useState(E ? null : "feature"), [y, N] = F.useState(null), [z, Y] = F.useState(!1), [P, W] = F.useState({
    resources: !0,
    calls: !1,
    roads: !1,
    traffic: !1,
    stations: !1
  }), [ze, de] = F.useState({ serial: 0, mode: "selected" }), [ve, se] = F.useState(null), [fe, Ee] = F.useState({}), [w, Z] = F.useState({}), x = F.useRef(null), ue = F.useRef(""), me = F.useRef({}), $ = d?.incidents.find((D) => D.id === f.selected), b = y || (f.selected ? { kind: "incident", id: f.selected } : null), L = d ? Ki(d, b) : null;
  F.useEffect(() => {
    d && (ue.current && ue.current !== d.epoch && (Ee({}), U("all"), X({}), Z({}), se(null), N(null), me.current = {}), ue.current = d.epoch);
  }, [d?.epoch]);
  const I = () => {
    if (b) {
      const D = document.querySelector(".detail-panel .panel-body");
      D && (me.current[b.kind + b.id] = D.scrollTop);
    }
  };
  F.useEffect(() => {
    const D = document.querySelector(".detail-panel .panel-body");
    D && b && (D.scrollTop = me.current[b.kind + b.id] || 0);
  }, [b?.kind, b?.id, C, z]);
  const R = (D) => {
    I(), O(D), Y(!1), se(null), E && H(!1);
  }, q = async (D) => {
    if (I(), N(D), se(null), O("feature"), Y(!1), E && H(!1), D.kind === "incident") {
      const ne = d?.incidents.find((Q) => Q.id === D.id);
      ne && ["reports", "history", "completed"].includes(Xt(ne)) && U(Xt(ne)), await f.select(D.id), de((Q) => ({
        serial: Q.serial + 1,
        mode: "selected"
      }));
    }
  }, V = (D) => {
    q({ kind: "incident", id: D });
  }, Ne = () => {
    I(), O(null), se(null), document.getElementById("show-selected")?.focus({ preventScroll: !0 });
  };
  F.useEffect(() => {
    const D = (ne) => {
      ne.key === "Escape" && (ve ? (se(null), Y(!1)) : C ? (O(null), Y(!1)) : H(!1));
    };
    return window.addEventListener("keydown", D), () => window.removeEventListener("keydown", D);
  }, [C, ve]);
  const ye = (D, ne) => Ee((Q) => {
    const ae = { ...Q };
    return ne ? ae[D] = ne : delete ae[D], ae;
  }), St = w[f.selected || ""] || /* @__PURE__ */ new Set(), wt = (D, ne) => {
    if (!f.selected) return;
    const Q = f.selected;
    Z((ae) => {
      const mt = new Set(ae[Q] || []);
      return mt.has(D) === ne ? ae : (ne ? mt.add(D) : mt.delete(D), { ...ae, [Q]: mt });
    });
  }, ke = d ? {
    approval: d.incidents.filter((D) => Xt(D) === "approval").length,
    input: d.incidents.filter((D) => Xt(D) === "input").length
  } : null, h = d ? d.fleet.filter(
    (D) => D.status === "available" && !ki(d).has(D.id)
  ).length : 0, M = d?.incidents.find((D) => D.id === f.job?.incident_id), ee = d ? Zf(f.rec, d.version, f.now, $) : "unassessed", te = !!d?.assignments.find((D) => D.incident_id === f.selected)?.hold_reason || f.rec?.decision === "pending" && ee !== "ready", _e = C === "feature" ? L?.name || "Case details" : C === "resources" ? "Resources" : C === "context" ? "Map & source details" : C === "controls" ? "Workspace controls" : "System details";
  return /* @__PURE__ */ c.jsxs(
    "main",
    {
      className: `arc-workspace ${r ? "inbox-open" : ""} ${C ? "detail-open" : ""} ${ve ? "picking-location" : ""}`,
      children: [
        /* @__PURE__ */ c.jsx(
          Xy,
          {
            state: d,
            rec: f.rec,
            selected: f.selected,
            feature: b,
            layers: P,
            focus: ze,
            ready: f.connected,
            picking: !!ve,
            draftPoint: $ && fe[$.id] && fe[$.id].lat && fe[$.id].lon && (Number(fe[$.id].lat) !== $.lat || Number(fe[$.id].lon) !== $.lon) ? {
              lat: Number(fe[$.id].lat),
              lon: Number(fe[$.id].lon)
            } : null,
            onSelect: (D) => {
              q(D);
            },
            onPick: (D, ne) => {
              if (!ve || !d) return;
              const Q = d.incidents.find((ae) => ae.id === ve);
              Q && (ye(Q.id, {
                ...fe[Q.id] || Xf(Q),
                lat: D.toFixed(6),
                lon: ne.toFixed(6)
              }), se(null), Y(!1), f.notify("Pickup point selected. Save response details to confirm."));
            },
            onMapReady: (D) => {
              x.current = D;
            },
            notify: f.notify
          }
        ),
        /* @__PURE__ */ c.jsxs("div", { className: "workspace-ui", children: [
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
                  onChange: (D) => {
                    window.location.href = "/?city=" + encodeURIComponent(D.target.value);
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
                className: `connection ${f.connected ? "" : "offline"}`,
                role: "status",
                children: [
                  /* @__PURE__ */ c.jsx("i", {}),
                  f.connected ? "Workspace connected" : d ? "Connection lost" : "Connecting…"
                ]
              }
            ),
            /* @__PURE__ */ c.jsx("time", { children: gn(f.now) }),
            /* @__PURE__ */ c.jsxs(
              "button",
              {
                "aria-label": "Workspace controls",
                title: "Workspace controls",
                onClick: () => R(C === "controls" ? null : "controls"),
                "aria-pressed": C === "controls",
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
                onClick: () => R(C === "evidence" ? null : "evidence"),
                children: /* @__PURE__ */ c.jsx(Ke, { name: "more" })
              }
            )
          ] }),
          /* @__PURE__ */ c.jsxs("nav", { className: "workspace-nav", "aria-label": "Workspace panels", children: [
            /* @__PURE__ */ c.jsxs(
              "button",
              {
                "aria-expanded": r,
                onClick: () => {
                  H(!r), E && !r && O(null);
                },
                children: [
                  /* @__PURE__ */ c.jsx(Ke, { name: "inbox" }),
                  /* @__PURE__ */ c.jsx("span", { children: "Inbox" }),
                  !!ke && ke.approval + ke.input > 0 && /* @__PURE__ */ c.jsx("b", { children: ke.approval + ke.input })
                ]
              }
            ),
            /* @__PURE__ */ c.jsxs(
              "button",
              {
                id: "show-selected",
                onClick: () => {
                  N(
                    f.selected ? { kind: "incident", id: f.selected } : null
                  ), R("feature");
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
                "aria-pressed": C === "resources",
                onClick: () => R(C === "resources" ? null : "resources"),
                children: [
                  /* @__PURE__ */ c.jsx(Ke, { name: "unit" }),
                  /* @__PURE__ */ c.jsx("span", { children: "Resources" })
                ]
              }
            ),
            /* @__PURE__ */ c.jsxs(
              "button",
              {
                "aria-pressed": C === "context",
                onClick: () => R(C === "context" ? null : "context"),
                children: [
                  /* @__PURE__ */ c.jsx(Ke, { name: "layers" }),
                  /* @__PURE__ */ c.jsx("span", { children: "Layers" })
                ]
              }
            )
          ] }),
          !f.connected && d && /* @__PURE__ */ c.jsx("div", { className: "connection-warning", role: "alert", children: "Connection lost. The displayed picture may be out of date; approvals are unavailable." }),
          d && r && (!E || !C) && /* @__PURE__ */ c.jsx(
            Zy,
            {
              bucket: B,
              setBucket: U,
              state: d,
              selected: f.selected,
              now: f.now,
              onSelect: V,
              onClose: () => H(!1)
            }
          ),
          d && C && /* @__PURE__ */ c.jsx(
            Ch,
            {
              title: _e,
              eyebrow: C === "feature" ? Ky[b?.kind || "incident"] : C === "context" ? "OPERATIONAL PICTURE" : C === "resources" ? "WORKSPACE AVAILABILITY" : "ARC WORKSPACE",
              className: "detail-panel",
              collapsed: z,
              onCollapse: () => {
                Y(!z), ve && se(null);
              },
              onClose: Ne,
              tools: C === "feature" && L && ct(L) ? /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
                /* @__PURE__ */ c.jsxs(
                  "button",
                  {
                    onClick: () => de((D) => ({
                      serial: D.serial + 1,
                      mode: b?.kind === "incident" ? "selected" : "feature",
                      point: L
                    })),
                    children: [
                      /* @__PURE__ */ c.jsx(Ke, { name: "focus", size: 15 }),
                      "Zoom to"
                    ]
                  }
                ),
                b?.kind !== "incident" && /* @__PURE__ */ c.jsxs("button", { onClick: () => V(f.selected), children: [
                  /* @__PURE__ */ c.jsx(Ke, { name: "back", size: 15 }),
                  "Back to case"
                ] })
              ] }) : void 0,
              children: C === "feature" && b?.kind === "incident" && $ ? /* @__PURE__ */ c.jsx(
                Ly,
                {
                  workspace: f,
                  request: J[$.id] ?? "Assess available resources and explain the best feasible assignment.",
                  setRequest: (D) => X((ne) => ({
                    ...ne,
                    [$.id]: D
                  })),
                  incident: $,
                  draft: fe[$.id],
                  setDraft: (D) => ye($.id, D),
                  picking: ve === $.id,
                  onPick: () => {
                    se(ve ? null : $.id), !ve && E && Y(!0);
                  },
                  details: St,
                  onDetail: wt
                },
                d.epoch + $.id
              ) : C === "feature" && b ? /* @__PURE__ */ c.jsx(
                Jy,
                {
                  state: d,
                  feature: b,
                  onCase: V
                }
              ) : C === "resources" ? /* @__PURE__ */ c.jsx(
                Vy,
                {
                  state: d,
                  onSelect: (D) => {
                    q(D);
                    const ne = Ki(d, D);
                    ne && de((Q) => ({
                      serial: Q.serial + 1,
                      mode: "feature",
                      point: ne
                    }));
                  }
                }
              ) : C === "context" ? /* @__PURE__ */ c.jsx(
                Fy,
                {
                  workspace: f,
                  layers: P,
                  setLayers: W,
                  onSelect: (D) => {
                    q(D);
                    const ne = Ki(d, D);
                    ne && de((Q) => ({
                      serial: Q.serial + 1,
                      mode: "feature",
                      point: ne
                    }));
                  },
                  onCase: V
                }
              ) : C === "controls" ? /* @__PURE__ */ c.jsx(Wy, { workspace: f, onClose: Ne }) : C === "evidence" ? /* @__PURE__ */ c.jsx(Iy, { workspace: f }) : /* @__PURE__ */ c.jsx("p", { className: "quiet", children: "Select a case on the map or in your inbox." })
            }
          ),
          ve && /* @__PURE__ */ c.jsxs("div", { className: "pickup-prompt", role: "status", children: [
            /* @__PURE__ */ c.jsx(Ke, { name: "pin" }),
            /* @__PURE__ */ c.jsx("span", { children: "Click a pickup point on the map" }),
            /* @__PURE__ */ c.jsx(
              "button",
              {
                onClick: () => {
                  se(null), Y(!1);
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
                onClick: () => de((D) => ({
                  serial: D.serial + 1,
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
                onClick: () => de((D) => ({
                  serial: D.serial + 1,
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
                onClick: () => x.current?.zoomIn(),
                children: /* @__PURE__ */ c.jsx(Ke, { name: "plus" })
              }
            ),
            /* @__PURE__ */ c.jsx(
              "button",
              {
                "aria-label": "Zoom out",
                title: "Zoom out",
                onClick: () => x.current?.zoomOut(),
                children: /* @__PURE__ */ c.jsx(Ke, { name: "minus" })
              }
            )
          ] }),
          /* @__PURE__ */ c.jsxs("div", { className: "map-caption", children: [
            f.rec?.selected && /* @__PURE__ */ c.jsx("div", { className: "map-legend", children: te ? /* @__PURE__ */ c.jsxs("span", { children: [
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
            /* @__PURE__ */ c.jsx("p", { children: f.rec?.decision === "approved" ? "Approved route · exercise progress" : f.rec?.selected?.transport_route.traffic_aware ? "Traffic at assessment time · ordinary driving" : f.rec?.selected ? "Static driving estimates · no live traffic" : "Operational picture" }),
            /* @__PURE__ */ c.jsx(
              "button",
              {
                className: "resource-summary",
                onClick: () => R("resources"),
                children: d ? /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
                  /* @__PURE__ */ c.jsx("i", { className: h ? "" : "unavailable" }),
                  h,
                  " ",
                  h === 1 ? "unit" : "units",
                  " free",
                  /* @__PURE__ */ c.jsx("span", { children: "·" }),
                  d.hospitals.filter((D) => D.accepting && D.slots > 0).length,
                  " ",
                  "receiving facilities"
                ] }) : "Loading workspace…"
              }
            )
          ] }),
          /* @__PURE__ */ c.jsxs("section", { className: "agent-bar", "aria-label": "ARC agent status", children: [
            /* @__PURE__ */ c.jsx("span", { className: `agent-orb ${f.job ? "running" : ""}` }),
            /* @__PURE__ */ c.jsxs("div", { className: "agent-copy", children: [
              /* @__PURE__ */ c.jsx("strong", { children: d ? d.agent.enabled ? f.job ? "ARC is assessing" : "ARC is monitoring" : "ARC is paused" : "Connecting to ARC" }),
              /* @__PURE__ */ c.jsx("p", { children: d?.agent.error || (f.job ? (M?.name || "Current case") + " · " + Qf(f.job.stage) : ke && (ke.approval || ke.input) ? `${ke.approval} plans to review · ${ke.input} questions for you` : d?.agent.enabled ? "Following your cases and checking availability." : "Resume ARC to continue preparing plans.") })
            ] }),
            d && /* @__PURE__ */ c.jsxs(
              "button",
              {
                className: "agent-toggle",
                disabled: f.busy || !f.connected,
                "aria-label": d.agent.enabled ? "Pause agent" : "Resume agent",
                onClick: () => {
                  f.mutate("/api/agent/control", { enabled: !d.agent.enabled }).catch(() => {
                  });
                },
                children: [
                  /* @__PURE__ */ c.jsx(Ke, { name: d.agent.enabled ? "pause" : "play", size: 16 }),
                  /* @__PURE__ */ c.jsx("span", { children: d.agent.enabled ? "Pause" : "Resume" })
                ]
              }
            )
          ] }),
          f.toast && /* @__PURE__ */ c.jsx("div", { className: "toast", role: "status", "aria-live": "polite", children: f.toast })
        ] })
      ]
    }
  );
}
class tg extends F.Component {
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
qy.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ c.jsx(tg, { children: /* @__PURE__ */ c.jsx(eg, {}) })
);
