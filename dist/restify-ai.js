var zs = Object.defineProperty;
var Hs = (s, e, t) => e in s ? zs(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var W = (s, e, t) => Hs(s, typeof e != "symbol" ? e + "" : e, t);
import { ref as K, nextTick as He, onUnmounted as Gt, computed as q, onMounted as Kt, watch as ot, isRef as Fs, defineComponent as Je, createElementBlock as T, openBlock as x, normalizeClass as w, renderSlot as Oe, createElementVNode as u, createCommentVNode as F, Fragment as $e, renderList as Xe, toDisplayString as $, createBlock as gt, resolveDynamicComponent as un, withCtx as Ye, createVNode as We, onBeforeUnmount as Bs, withModifiers as ht, unref as Y, normalizeStyle as rs, Transition as _t, withDirectives as Us, vModelText as qs, Teleport as js, normalizeProps as Pn, guardReactiveProps as Nn, createTextVNode as ve } from "vue";
import { defineStore as Ws } from "pinia";
let at = null;
const Gs = K(null), os = {
  title: "AI Assistant",
  aiName: "AI Assistant",
  you: "You",
  newChat: "New chat",
  placeholder: "Ask me anything...",
  inputPlaceholder: "Ask me anything...",
  supportPlaceholder: "Describe your support request...",
  loadingText: "Thinking...",
  analyzingText: "Analyzing...",
  craftingText: "Crafting response...",
  quotaRemaining: "{count} questions remaining",
  noQuota: "No AI credit available",
  contactSupport: "Contact Support",
  close: "Close",
  minimize: "Minimize",
  fullscreen: "Fullscreen",
  exitFullscreen: "Exit fullscreen",
  copyToClipboard: "Copy to clipboard",
  copied: "Copied!",
  showMore: "Show more",
  showLess: "Show less",
  retry: "Retry",
  attachFiles: "Attach files",
  emptyStateTitle: "How can I help you today?",
  emptyStateDescription: "Ask me anything or choose a suggestion below",
  keyboardShortcutHint: "Press ⌘G to toggle",
  sendMessage: "Send message",
  attachFile: "Attach file",
  // Close confirmation
  closeConfirmTitle: "Close conversation?",
  closeConfirmMessage: "This will clear your chat history. Are you sure you want to close?",
  confirmClose: "Close & Clear",
  cancel: "Cancel",
  // Support mode
  toggleSupportMode: "Toggle support mode",
  exitSupportMode: "Exit support mode",
  // Setup mode labels
  setupWelcomeTitle: "Welcome to AI Assistant",
  setupWelcomeDescription: "Let's get you set up to start using AI features.",
  setupApiKeyTitle: "API Key Configuration",
  setupApiKeyDescription: "Enter your API key to test the connection",
  setupTestingTitle: "Testing Connection...",
  setupBackendTitle: "Backend Configuration",
  setupBackendDescription: "Configure your backend endpoint",
  setupCompleteTitle: "Setup Complete!"
};
function Ks(s) {
  at = s, Gs.value = s;
}
function ae() {
  return at;
}
function Ja() {
  if (!at)
    throw new Error(
      "[@doderasoftware/restify-ai] Plugin not initialized. Make sure to call app.use(RestifyAiPlugin, config) before using the components."
    );
  return at;
}
function as() {
  return at !== null;
}
function fe(s, e) {
  const t = at, n = (t == null ? void 0 : t.labels) || {}, r = t == null ? void 0 : t.translate;
  if (r) {
    const a = r(s, e);
    if (a !== s)
      return a;
  }
  let o = n[s] || os[s];
  return e && Object.entries(e).forEach(([a, l]) => {
    o = o.replace(`{${a}}`, String(l));
  }), o;
}
function zn(s) {
  return {
    chatHistoryLimit: 15,
    maxAttachments: 5,
    maxFileSize: 10485760,
    acceptedFileTypes: "image/*,.pdf,.txt,.doc,.docx,.xls,.xlsx,.csv",
    chatHistoryKey: "restify_ai_chat_history",
    drawerStateKey: "restify_ai_drawer_open",
    keyboardShortcut: "cmd+g",
    enableSupportMode: !1
  }[s];
}
function mt(s) {
  const e = at;
  return e ? e[s] ?? zn(s) : zn(s);
}
const Hn = {
  Assistant: "assistant",
  User: "user",
  System: "system"
};
async function Vs(s, e) {
  const t = s.getReader();
  let n;
  for (; !(n = await t.read()).done; )
    e(n.value);
}
function Zs(s) {
  let e, t, n, r = !1;
  return function(a) {
    e === void 0 ? (e = a, t = 0, n = -1) : e = Ys(e, a);
    const l = e.length;
    let c = 0;
    for (; t < l; ) {
      r && (e[t] === 10 && (c = ++t), r = !1);
      let p = -1;
      for (; t < l && p === -1; ++t)
        switch (e[t]) {
          case 58:
            n === -1 && (n = t - c);
            break;
          case 13:
            r = !0;
          case 10:
            p = t;
            break;
        }
      if (p === -1)
        break;
      s(e.subarray(c, p), n), c = t, n = -1;
    }
    c === l ? e = void 0 : c !== 0 && (e = e.subarray(c), t -= c);
  };
}
function Qs(s, e, t) {
  let n = Fn();
  const r = new TextDecoder();
  return function(a, l) {
    if (a.length === 0)
      t == null || t(n), n = Fn();
    else if (l > 0) {
      const c = r.decode(a.subarray(0, l)), p = l + (a[l + 1] === 32 ? 2 : 1), f = r.decode(a.subarray(p));
      switch (c) {
        case "data":
          n.data = n.data ? n.data + `
` + f : f;
          break;
        case "event":
          n.event = f;
          break;
        case "id":
          s(n.id = f);
          break;
        case "retry":
          const k = parseInt(f, 10);
          isNaN(k) || e(n.retry = k);
          break;
      }
    }
  };
}
function Ys(s, e) {
  const t = new Uint8Array(s.length + e.length);
  return t.set(s), t.set(e, s.length), t;
}
function Fn() {
  return {
    data: "",
    event: "",
    id: "",
    retry: void 0
  };
}
var Xs = function(s, e) {
  var t = {};
  for (var n in s) Object.prototype.hasOwnProperty.call(s, n) && e.indexOf(n) < 0 && (t[n] = s[n]);
  if (s != null && typeof Object.getOwnPropertySymbols == "function")
    for (var r = 0, n = Object.getOwnPropertySymbols(s); r < n.length; r++)
      e.indexOf(n[r]) < 0 && Object.prototype.propertyIsEnumerable.call(s, n[r]) && (t[n[r]] = s[n[r]]);
  return t;
};
const cn = "text/event-stream", Js = 1e3, Bn = "last-event-id";
function er(s, e) {
  var { signal: t, headers: n, onopen: r, onmessage: o, onclose: a, onerror: l, openWhenHidden: c, fetch: p } = e, f = Xs(e, ["signal", "headers", "onopen", "onmessage", "onclose", "onerror", "openWhenHidden", "fetch"]);
  return new Promise((k, y) => {
    const v = Object.assign({}, n);
    v.accept || (v.accept = cn);
    let b;
    function I() {
      b.abort(), document.hidden || H();
    }
    c || document.addEventListener("visibilitychange", I);
    let h = Js, A = 0;
    function M() {
      document.removeEventListener("visibilitychange", I), window.clearTimeout(A), b.abort();
    }
    t == null || t.addEventListener("abort", () => {
      M(), k();
    });
    const E = p ?? window.fetch, _ = r ?? tr;
    async function H() {
      var X;
      b = new AbortController();
      try {
        const te = await E(s, Object.assign(Object.assign({}, f), { headers: v, signal: b.signal }));
        await _(te), await Vs(te.body, Zs(Qs((ie) => {
          ie ? v[Bn] = ie : delete v[Bn];
        }, (ie) => {
          h = ie;
        }, o))), a == null || a(), M(), k();
      } catch (te) {
        if (!b.signal.aborted)
          try {
            const ie = (X = l == null ? void 0 : l(te)) !== null && X !== void 0 ? X : h;
            window.clearTimeout(A), A = window.setTimeout(H, ie);
          } catch (ie) {
            M(), y(ie);
          }
      }
    }
    H();
  });
}
function tr(s) {
  const e = s.headers.get("content-type");
  if (!(e != null && e.startsWith(cn)))
    throw new Error(`Expected content-type to be ${cn}, Actual: ${e}`);
}
let bt = new AbortController();
function zt(s) {
  const e = ae(), t = (e == null ? void 0 : e.baseUrl) || "";
  if (!t || s.startsWith("http://") || s.startsWith("https://")) return s;
  const n = t.endsWith("/") ? t.slice(0, -1) : t, r = s.startsWith("/") ? s : `/${s}`;
  return `${n}${r}`;
}
function nr(s) {
  var e, t, n;
  try {
    if (s === "[DONE]") return "[DONE]";
    const r = JSON.parse(s);
    return ((n = (t = (e = r == null ? void 0 : r.choices) == null ? void 0 : e[0]) == null ? void 0 : t.delta) == null ? void 0 : n.content) || "";
  } catch {
    return null;
  }
}
function sr(s) {
  return new Promise((e) => setTimeout(e, s));
}
function lt(s) {
  const e = ae();
  return s === "chatHistory" ? (e == null ? void 0 : e.chatHistoryKey) || "restify_ai_chat_history" : s === "setupComplete" ? "restify_ai_setup_complete" : (e == null ? void 0 : e.drawerStateKey) || "restify_ai_drawer_open";
}
function en(s) {
  try {
    sessionStorage.setItem(lt("chatHistory"), JSON.stringify(s));
  } catch (e) {
    console.warn("[RestifyAi] Failed to save chat history:", e);
  }
}
function rr() {
  try {
    const s = sessionStorage.getItem(lt("chatHistory"));
    if (s)
      return JSON.parse(s);
  } catch (s) {
    console.warn("[RestifyAi] Failed to load chat history:", s);
  }
  return [];
}
function or() {
  try {
    sessionStorage.removeItem(lt("chatHistory"));
  } catch (s) {
    console.warn("[RestifyAi] Failed to clear chat history:", s);
  }
}
function tn(s) {
  try {
    localStorage.setItem(lt("drawerState"), JSON.stringify(s));
  } catch (e) {
    console.warn("[RestifyAi] Failed to save drawer state:", e);
  }
}
function ar() {
  try {
    const s = localStorage.getItem(lt("drawerState"));
    if (s !== null)
      return JSON.parse(s);
  } catch (s) {
    console.warn("[RestifyAi] Failed to load drawer state:", s);
  }
  return !1;
}
function ir() {
  try {
    return localStorage.getItem(lt("setupComplete")) === "true";
  } catch {
    return !1;
  }
}
function Un() {
  try {
    localStorage.setItem(lt("setupComplete"), "true");
  } catch (s) {
    console.warn("[RestifyAi] Failed to mark setup complete:", s);
  }
}
function lr(s) {
  const e = {};
  return s.forEach((t) => {
    var n;
    (n = t.attachments) == null || n.forEach((r) => {
      r != null && r.id && (e[r.id] = r);
    });
  }), e;
}
function qn() {
  return {
    isActive: !1,
    currentStep: "welcome",
    testApiKey: null,
    connectionStatus: "idle",
    backendConfigured: !1,
    lastError: null
  };
}
const yt = Ws("restifyAiStore", {
  state: () => {
    const s = rr();
    return {
      chatHistoryLimit: mt("chatHistoryLimit") || 15,
      chatHistory: s,
      uploadedFiles: lr(s),
      loading: !1,
      showChat: ar(),
      isFullscreen: !1,
      sending: !1,
      pageContext: null,
      quota: {
        limit: 100,
        used: 0,
        remaining: 100
      },
      error: {
        message: null,
        failedQuestion: null,
        failedAttachments: null,
        timestamp: null,
        quotaExceeded: !1
      },
      supportRequestMode: !1,
      setupState: !as() && !ir() ? { ...qn(), isActive: !0 } : qn()
    };
  },
  getters: {
    hasMessages: (s) => s.chatHistory.length > 0,
    isInSetupMode: (s) => s.setupState.isActive,
    canChat: (s) => !s.setupState.isActive || s.setupState.connectionStatus === "connected"
  },
  actions: {
    async scrollToBottom() {
      await He();
      const s = document.getElementById("rai-chat-bottom");
      s && s.scrollIntoView({ behavior: "smooth" });
    },
    parseStreamContent(s) {
      const e = ae(), t = e == null ? void 0 : e.parseStreamContent;
      return t ? t(s.data) : nr(s.data);
    },
    async askQuestion(s, e = [], t = [], n = !1) {
      const r = ae();
      if (!r)
        return console.warn("[RestifyAi] Cannot ask question - plugin not configured"), !1;
      let o = "", a = !1;
      const l = r.retry || {}, c = l.maxRetries ?? 0, p = l.retryDelay ?? 1e3;
      let f = 0;
      const k = e.map((v) => ({
        id: v.id,
        name: v.name,
        url: v.url,
        type: v.type,
        size: v.size,
        extractedText: v.extractedText
      })), y = async () => {
        var v, b, I, h;
        try {
          this.chatHistory.push({
            id: crypto.randomUUID(),
            role: Hn.User,
            message: s,
            loading: !1,
            attachments: k,
            mentions: t,
            timestamp: Date.now()
          }), k.forEach((L) => this.registerUploadedFile(L)), en(this.chatHistory), this.chatHistory.length >= this.chatHistoryLimit && ((v = r.onError) == null || v.call(r, new Error("Chat history limit reached")));
          const A = this.chatHistory.map((L) => ({
            role: L.role,
            message: L.message,
            attachments: L.attachments ?? []
          })), M = {}, E = (L) => {
            L != null && L.id && (M[L.id] = {
              extracted_text: L.extractedText || "",
              file_name: L.name,
              mime_type: L.type || "",
              ...L.size ? { file_size: L.size } : {},
              ...L.url ? { file_url: L.url } : {}
            });
          };
          Object.values(this.uploadedFiles).forEach(E), this.chatHistory.forEach((L) => {
            var J;
            (J = L.attachments) == null || J.forEach(E);
          }), k.forEach(E);
          const _ = Object.values(M), H = this.chatHistory.length;
          this.chatHistory.push({
            id: crypto.randomUUID(),
            role: Hn.Assistant,
            message: "",
            loading: !0,
            timestamp: Date.now()
          }), en(this.chatHistory), this.sending = !0, bt = new AbortController();
          const X = await r.getAuthToken();
          let ie = {
            "Content-Type": "application/json",
            Accept: "application/vnd.api+json",
            ...r.getCustomHeaders ? await r.getCustomHeaders() : {}
          };
          this.setupState.isActive && this.setupState.testApiKey ? ie["X-Test-Api-Key"] = this.setupState.testApiKey : X && (ie.Authorization = `Bearer ${X}`);
          let Se = {
            question: s,
            history: A,
            stream: !0,
            ..._.length > 0 && { files: _ },
            ...t.length > 0 && { mentions: t },
            ...this.supportRequestMode && { contact_support: !0 }
          };
          r.beforeSend && (Se = await r.beforeSend(Se)), r.buildRequest && (Se = await r.buildRequest(Se)), (b = r.onMessageSent) == null || b.call(r, this.chatHistory[H - 1]);
          const Ge = zt(r.endpoints.ask);
          let Z = {
            method: "POST",
            body: JSON.stringify(Se),
            headers: ie
          };
          return r.requestInterceptor && (Z = await r.requestInterceptor(Ge, Z)), (I = r.onStreamStart) == null || I.call(r), await er(Ge, {
            method: "POST",
            body: JSON.stringify(Se),
            signal: bt.signal,
            headers: Z.headers,
            openWhenHidden: !0,
            async onopen(L) {
              if (!L.ok) {
                if (L.status === 429) {
                  const J = yt();
                  throw J.error = {
                    message: fe("noQuota"),
                    failedQuestion: s,
                    failedAttachments: k,
                    timestamp: Date.now(),
                    quotaExceeded: !0
                  }, await J.fetchQuota(), new Error("Quota exceeded");
                }
                throw new Error(`Failed to connect: ${L.status}`);
              }
            },
            onmessage: async (L) => {
              var Ke, Pe, Ie;
              const J = this.parseStreamContent(L);
              if (!J) return;
              this.chatHistory[H].loading = !1;
              const ge = {
                content: J,
                done: J === "[DONE]",
                raw: L.data
              };
              (Ke = r.onStreamChunk) == null || Ke.call(r, ge), o ? J === "[DONE]" ? (this.chatHistory[H].streaming = !1, en(this.chatHistory), (Pe = r.onStreamEnd) == null || Pe.call(r, o), this.quota.remaining > 0 && !this.supportRequestMode && (this.quota.remaining--, this.quota.used++, this.quota.remaining === 0 && r.enableSupportMode !== !1 && (this.supportRequestMode = !0)), this.supportRequestMode && this.quota.remaining > 0 && (this.supportRequestMode = !1), r.afterResponse && await r.afterResponse(this.chatHistory[H]), (Ie = r.onResponseReceived) == null || Ie.call(r, this.chatHistory[H])) : (o += J, this.chatHistory[H].message = o) : (o = J, this.chatHistory[H].message = o, this.chatHistory[H].streaming = !0), await this.scrollToBottom();
            },
            onerror(L) {
              throw a = !0, L;
            }
          }), !0;
        } catch (A) {
          a = !0;
          const M = this.chatHistory.length - 1;
          return this.chatHistory.splice(M, 1), A.name === "AbortError" ? !0 : f < c && (l.shouldRetry ? l.shouldRetry(A, f) : !0) ? (f++, await sr(p * f), y()) : (this.error = {
            message: A.message || "Network error occurred. Please try again.",
            failedQuestion: s,
            failedAttachments: k,
            timestamp: Date.now()
          }, (h = r.onError) == null || h.call(r, A), !1);
        } finally {
          this.sending = !1;
        }
      };
      return y();
    },
    cancelRequest() {
      bt == null || bt.abort(), this.chatHistory = this.chatHistory.map((s) => ({
        ...s,
        streaming: !1,
        loading: !1
      })), this.sending = !1;
    },
    clearChatHistory() {
      var e;
      const s = ae();
      this.chatHistory = [], this.sending = !1, this.uploadedFiles = {}, this.quota.remaining > 0 && (this.supportRequestMode = !1), or(), (e = s == null ? void 0 : s.onNewChat) == null || e.call(s);
    },
    async retry() {
      if (!this.error.failedQuestion)
        return !1;
      const s = this.error.failedQuestion, e = this.error.failedAttachments || [];
      return this.clearError(), await this.askQuestion(s, e);
    },
    clearError() {
      this.error = {
        message: null,
        failedQuestion: null,
        failedAttachments: null,
        timestamp: null,
        quotaExceeded: !1
      };
    },
    toggleSupportMode() {
      this.supportRequestMode = !this.supportRequestMode;
    },
    async fetchQuota() {
      var e, t;
      const s = ae();
      if ((e = s == null ? void 0 : s.endpoints) != null && e.quota)
        try {
          const n = await s.getAuthToken(), r = s.getCustomHeaders ? await s.getCustomHeaders() : {}, o = zt(s.endpoints.quota), a = await fetch(o, {
            headers: {
              Accept: "application/json",
              ...n ? { Authorization: `Bearer ${n}` } : {},
              ...r
            }
          });
          if (a.ok) {
            const l = await a.json();
            this.quota = {
              limit: l.limit ?? this.quota.limit,
              used: l.used ?? this.quota.used,
              remaining: l.remaining ?? this.quota.remaining
            }, this.quota.remaining === 0 && s.enableSupportMode !== !1 && (this.supportRequestMode = !0), (t = s.onQuotaFetched) == null || t.call(s, this.quota);
          }
        } catch (n) {
          console.error("[RestifyAi] Failed to fetch quota:", n);
        }
    },
    async uploadFile(s) {
      var r, o, a, l, c;
      const e = ae();
      if (!((r = e == null ? void 0 : e.endpoints) != null && r.uploadFile))
        return console.warn("[RestifyAi] No uploadFile endpoint configured"), null;
      const n = {
        id: crypto.randomUUID(),
        name: s.name,
        type: s.type,
        size: s.size,
        uploading: !0,
        progress: 0
      };
      (o = e.onFileUploadStart) == null || o.call(e, n);
      try {
        const p = await e.getAuthToken(), f = e.getCustomHeaders ? await e.getCustomHeaders() : {}, k = zt(e.endpoints.uploadFile), y = new FormData();
        y.append("file", s);
        const v = await new Promise((b, I) => {
          const h = new XMLHttpRequest();
          h.upload.addEventListener("progress", (A) => {
            var M;
            if (A.lengthComputable) {
              const E = Math.round(A.loaded / A.total * 100);
              n.progress = E, (M = e.onFileUploadProgress) == null || M.call(e, n, E);
            }
          }), h.addEventListener("load", () => {
            var A, M;
            if (h.status >= 200 && h.status < 300)
              try {
                const E = JSON.parse(h.responseText), _ = {
                  ...n,
                  url: E.url || ((A = E.data) == null ? void 0 : A.url),
                  extractedText: E.extracted_text || ((M = E.data) == null ? void 0 : M.extracted_text),
                  uploading: !1,
                  progress: 100
                };
                b(_);
              } catch {
                I(new Error("Failed to parse upload response"));
              }
            else
              I(new Error(`Upload failed: ${h.status}`));
          }), h.addEventListener("error", () => {
            I(new Error("Upload failed"));
          }), h.open("POST", k), p && h.setRequestHeader("Authorization", `Bearer ${p}`), Object.entries(f).forEach(([A, M]) => {
            h.setRequestHeader(A, M);
          }), h.send(y);
        });
        return (a = e.onFileUploadComplete) == null || a.call(e, v), v;
      } catch (p) {
        const f = { ...n, uploading: !1 };
        return (l = e.onFileUploadError) == null || l.call(e, f, p), (c = e.onError) == null || c.call(e, p), null;
      }
    },
    setPageContext(s) {
      this.pageContext = s;
    },
    toggleDrawer() {
      var s, e;
      this.showChat = !this.showChat, tn(this.showChat), (e = (s = ae()) == null ? void 0 : s.onDrawerToggle) == null || e.call(s, this.showChat);
    },
    openDrawer() {
      var s, e;
      this.showChat = !0, tn(!0), (e = (s = ae()) == null ? void 0 : s.onDrawerToggle) == null || e.call(s, !0);
    },
    closeDrawer() {
      var s, e;
      this.showChat = !1, tn(!1), (e = (s = ae()) == null ? void 0 : s.onDrawerToggle) == null || e.call(s, !1);
    },
    startSupportRequest() {
      this.supportRequestMode = !0;
    },
    cancelSupportRequest() {
      this.quota.remaining > 0 && (this.supportRequestMode = !1);
    },
    registerUploadedFile(s) {
      s != null && s.id && (this.uploadedFiles[s.id] = { ...s });
    },
    // Setup mode actions
    startSetupMode() {
      this.setupState = {
        isActive: !0,
        currentStep: "welcome",
        testApiKey: null,
        connectionStatus: "idle",
        backendConfigured: !1,
        lastError: null
      };
    },
    setSetupStep(s) {
      this.setupState.currentStep = s;
    },
    setTestApiKey(s) {
      this.setupState.testApiKey = s;
    },
    async testConnection() {
      this.setupState.connectionStatus = "testing", this.setupState.lastError = null;
      const s = ae();
      if (!s)
        return this.setupState.connectionStatus = "failed", this.setupState.lastError = "Plugin not configured", !1;
      try {
        const e = {
          "Content-Type": "application/json",
          Accept: "application/json"
        };
        this.setupState.testApiKey && (e["X-Test-Api-Key"] = this.setupState.testApiKey);
        const t = s.endpoints.quota || s.endpoints.ask, n = zt(t), r = await fetch(n, {
          method: s.endpoints.quota ? "GET" : "POST",
          headers: e,
          ...s.endpoints.quota ? {} : {
            body: JSON.stringify({ question: "test", stream: !1 })
          }
        });
        return r.ok ? (this.setupState.connectionStatus = "connected", this.setupState.backendConfigured = !0, !0) : (this.setupState.connectionStatus = "failed", this.setupState.lastError = `Connection failed: ${r.status} ${r.statusText}`, !1);
      } catch (e) {
        return this.setupState.connectionStatus = "failed", this.setupState.lastError = e.message || "Connection failed", !1;
      }
    },
    completeSetup() {
      var s, e;
      this.setupState.isActive = !1, this.setupState.currentStep = "complete", Un(), (e = (s = ae()) == null ? void 0 : s.onSetupComplete) == null || e.call(s);
    },
    skipSetup() {
      this.setupState.isActive = !1, Un();
    }
  }
});
function is(s) {
  const e = /@\[([^\]]+)\]\(([^)]+)\)/g, t = [];
  let n = s, r;
  for (; (r = e.exec(s)) !== null; ) {
    const [o, a, l] = r, [c, p] = l.includes(":") ? l.split(":") : ["default", l];
    t.push({
      id: p,
      name: a,
      type: c
    }), n = n.replace(o, a);
  }
  return {
    cleanText: n,
    mentions: t
  };
}
function ur(s) {
  const { cleanText: e } = is(s);
  return e;
}
function ls(s) {
  return s.replace(
    /@([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g,
    '<span class="rai-mention">@$1</span>'
  );
}
function us(s, e) {
  const n = s.substring(0, e).match(/@(\w*)$/);
  return n ? {
    inMention: !0,
    query: n[1],
    startPos: e - n[0].length
  } : {
    inMention: !1,
    query: "",
    startPos: -1
  };
}
function gn(s, e) {
  var t, n;
  return e != null && e.getDisplayName ? e.getDisplayName(s) : s.name || s.title || ((t = s.attributes) == null ? void 0 : t.name) || ((n = s.attributes) == null ? void 0 : n.title) || "Unknown";
}
function cs(s, e) {
  var t, n;
  return e != null && e.getSubtitle ? e.getSubtitle(s) : ((t = s.attributes) == null ? void 0 : t.email) || ((n = s.attributes) == null ? void 0 : n.description) || null;
}
function cr(s, e) {
  return e != null && e.buildMentionText ? e.buildMentionText(s) : `@[${gn(s, e)}](${s.type}:${s.id})`;
}
function ds(s) {
  var t;
  const e = ae();
  return (t = e == null ? void 0 : e.mentionProviders) == null ? void 0 : t.find((n) => n.type === s);
}
function ps(s) {
  const e = ae(), t = (e == null ? void 0 : e.mentionProviders) || [];
  return s ? t.filter((n) => n.routes ? n.routes.some((r) => r.endsWith("*") ? s.startsWith(r.slice(0, -1)) : s === r || s.startsWith(r + "/")) : !0) : t;
}
function dr(s) {
  return s.map((e) => ({
    type: e.type,
    id: e.id,
    name: e.name
  }));
}
function pr(s) {
  return s.reduce((e, t) => {
    const n = t.type || "default";
    return e[n] || (e[n] = []), e[n].push(t), e;
  }, {});
}
function ei() {
  return {
    extractMentions: is,
    parseAndCleanMessage: ur,
    renderMentionsInHtml: ls,
    detectMentionContext: us,
    getMentionDisplayName: gn,
    getMentionSubtitle: cs,
    buildMentionText: cr,
    getMentionProvider: ds,
    getActiveMentionProviders: ps,
    formatMentionsForApi: dr,
    groupMentionsByType: pr
  };
}
function mn() {
  return {
    async: !1,
    breaks: !1,
    extensions: null,
    gfm: !0,
    hooks: null,
    pedantic: !1,
    renderer: null,
    silent: !1,
    tokenizer: null,
    walkTokens: null
  };
}
let ut = mn();
function fs(s) {
  ut = s;
}
const hs = /[&<>"']/, fr = new RegExp(hs.source, "g"), gs = /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, hr = new RegExp(gs.source, "g"), gr = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}, jn = (s) => gr[s];
function Te(s, e) {
  if (e) {
    if (hs.test(s))
      return s.replace(fr, jn);
  } else if (gs.test(s))
    return s.replace(hr, jn);
  return s;
}
const mr = /(^|[^\[])\^/g;
function j(s, e) {
  let t = typeof s == "string" ? s : s.source;
  e = e || "";
  const n = {
    replace: (r, o) => {
      let a = typeof o == "string" ? o : o.source;
      return a = a.replace(mr, "$1"), t = t.replace(r, a), n;
    },
    getRegex: () => new RegExp(t, e)
  };
  return n;
}
function Wn(s) {
  try {
    s = encodeURI(s).replace(/%25/g, "%");
  } catch {
    return null;
  }
  return s;
}
const Rt = { exec: () => null };
function Gn(s, e) {
  const t = s.replace(/\|/g, (o, a, l) => {
    let c = !1, p = a;
    for (; --p >= 0 && l[p] === "\\"; )
      c = !c;
    return c ? "|" : " |";
  }), n = t.split(/ \|/);
  let r = 0;
  if (n[0].trim() || n.shift(), n.length > 0 && !n[n.length - 1].trim() && n.pop(), e)
    if (n.length > e)
      n.splice(e);
    else
      for (; n.length < e; )
        n.push("");
  for (; r < n.length; r++)
    n[r] = n[r].trim().replace(/\\\|/g, "|");
  return n;
}
function wt(s, e, t) {
  const n = s.length;
  if (n === 0)
    return "";
  let r = 0;
  for (; r < n && s.charAt(n - r - 1) === e; )
    r++;
  return s.slice(0, n - r);
}
function yr(s, e) {
  if (s.indexOf(e[1]) === -1)
    return -1;
  let t = 0;
  for (let n = 0; n < s.length; n++)
    if (s[n] === "\\")
      n++;
    else if (s[n] === e[0])
      t++;
    else if (s[n] === e[1] && (t--, t < 0))
      return n;
  return -1;
}
function Kn(s, e, t, n) {
  const r = e.href, o = e.title ? Te(e.title) : null, a = s[1].replace(/\\([\[\]])/g, "$1");
  if (s[0].charAt(0) !== "!") {
    n.state.inLink = !0;
    const l = {
      type: "link",
      raw: t,
      href: r,
      title: o,
      text: a,
      tokens: n.inlineTokens(a)
    };
    return n.state.inLink = !1, l;
  }
  return {
    type: "image",
    raw: t,
    href: r,
    title: o,
    text: Te(a)
  };
}
function xr(s, e) {
  const t = s.match(/^(\s+)(?:```)/);
  if (t === null)
    return e;
  const n = t[1];
  return e.split(`
`).map((r) => {
    const o = r.match(/^\s+/);
    if (o === null)
      return r;
    const [a] = o;
    return a.length >= n.length ? r.slice(n.length) : r;
  }).join(`
`);
}
class qt {
  // set by the lexer
  constructor(e) {
    W(this, "options");
    W(this, "rules");
    // set by the lexer
    W(this, "lexer");
    this.options = e || ut;
  }
  space(e) {
    const t = this.rules.block.newline.exec(e);
    if (t && t[0].length > 0)
      return {
        type: "space",
        raw: t[0]
      };
  }
  code(e) {
    const t = this.rules.block.code.exec(e);
    if (t) {
      const n = t[0].replace(/^(?: {1,4}| {0,3}\t)/gm, "");
      return {
        type: "code",
        raw: t[0],
        codeBlockStyle: "indented",
        text: this.options.pedantic ? n : wt(n, `
`)
      };
    }
  }
  fences(e) {
    const t = this.rules.block.fences.exec(e);
    if (t) {
      const n = t[0], r = xr(n, t[3] || "");
      return {
        type: "code",
        raw: n,
        lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2],
        text: r
      };
    }
  }
  heading(e) {
    const t = this.rules.block.heading.exec(e);
    if (t) {
      let n = t[2].trim();
      if (/#$/.test(n)) {
        const r = wt(n, "#");
        (this.options.pedantic || !r || / $/.test(r)) && (n = r.trim());
      }
      return {
        type: "heading",
        raw: t[0],
        depth: t[1].length,
        text: n,
        tokens: this.lexer.inline(n)
      };
    }
  }
  hr(e) {
    const t = this.rules.block.hr.exec(e);
    if (t)
      return {
        type: "hr",
        raw: wt(t[0], `
`)
      };
  }
  blockquote(e) {
    const t = this.rules.block.blockquote.exec(e);
    if (t) {
      let n = wt(t[0], `
`).split(`
`), r = "", o = "";
      const a = [];
      for (; n.length > 0; ) {
        let l = !1;
        const c = [];
        let p;
        for (p = 0; p < n.length; p++)
          if (/^ {0,3}>/.test(n[p]))
            c.push(n[p]), l = !0;
          else if (!l)
            c.push(n[p]);
          else
            break;
        n = n.slice(p);
        const f = c.join(`
`), k = f.replace(/\n {0,3}((?:=+|-+) *)(?=\n|$)/g, `
    $1`).replace(/^ {0,3}>[ \t]?/gm, "");
        r = r ? `${r}
${f}` : f, o = o ? `${o}
${k}` : k;
        const y = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(k, a, !0), this.lexer.state.top = y, n.length === 0)
          break;
        const v = a[a.length - 1];
        if ((v == null ? void 0 : v.type) === "code")
          break;
        if ((v == null ? void 0 : v.type) === "blockquote") {
          const b = v, I = b.raw + `
` + n.join(`
`), h = this.blockquote(I);
          a[a.length - 1] = h, r = r.substring(0, r.length - b.raw.length) + h.raw, o = o.substring(0, o.length - b.text.length) + h.text;
          break;
        } else if ((v == null ? void 0 : v.type) === "list") {
          const b = v, I = b.raw + `
` + n.join(`
`), h = this.list(I);
          a[a.length - 1] = h, r = r.substring(0, r.length - v.raw.length) + h.raw, o = o.substring(0, o.length - b.raw.length) + h.raw, n = I.substring(a[a.length - 1].raw.length).split(`
`);
          continue;
        }
      }
      return {
        type: "blockquote",
        raw: r,
        tokens: a,
        text: o
      };
    }
  }
  list(e) {
    let t = this.rules.block.list.exec(e);
    if (t) {
      let n = t[1].trim();
      const r = n.length > 1, o = {
        type: "list",
        raw: "",
        ordered: r,
        start: r ? +n.slice(0, -1) : "",
        loose: !1,
        items: []
      };
      n = r ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`, this.options.pedantic && (n = r ? n : "[*+-]");
      const a = new RegExp(`^( {0,3}${n})((?:[	 ][^\\n]*)?(?:\\n|$))`);
      let l = !1;
      for (; e; ) {
        let c = !1, p = "", f = "";
        if (!(t = a.exec(e)) || this.rules.block.hr.test(e))
          break;
        p = t[0], e = e.substring(p.length);
        let k = t[2].split(`
`, 1)[0].replace(/^\t+/, (A) => " ".repeat(3 * A.length)), y = e.split(`
`, 1)[0], v = !k.trim(), b = 0;
        if (this.options.pedantic ? (b = 2, f = k.trimStart()) : v ? b = t[1].length + 1 : (b = t[2].search(/[^ ]/), b = b > 4 ? 1 : b, f = k.slice(b), b += t[1].length), v && /^[ \t]*$/.test(y) && (p += y + `
`, e = e.substring(y.length + 1), c = !0), !c) {
          const A = new RegExp(`^ {0,${Math.min(3, b - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), M = new RegExp(`^ {0,${Math.min(3, b - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), E = new RegExp(`^ {0,${Math.min(3, b - 1)}}(?:\`\`\`|~~~)`), _ = new RegExp(`^ {0,${Math.min(3, b - 1)}}#`), H = new RegExp(`^ {0,${Math.min(3, b - 1)}}<(?:[a-z].*>|!--)`, "i");
          for (; e; ) {
            const X = e.split(`
`, 1)[0];
            let te;
            if (y = X, this.options.pedantic ? (y = y.replace(/^ {1,4}(?=( {4})*[^ ])/g, "  "), te = y) : te = y.replace(/\t/g, "    "), E.test(y) || _.test(y) || H.test(y) || A.test(y) || M.test(y))
              break;
            if (te.search(/[^ ]/) >= b || !y.trim())
              f += `
` + te.slice(b);
            else {
              if (v || k.replace(/\t/g, "    ").search(/[^ ]/) >= 4 || E.test(k) || _.test(k) || M.test(k))
                break;
              f += `
` + y;
            }
            !v && !y.trim() && (v = !0), p += X + `
`, e = e.substring(X.length + 1), k = te.slice(b);
          }
        }
        o.loose || (l ? o.loose = !0 : /\n[ \t]*\n[ \t]*$/.test(p) && (l = !0));
        let I = null, h;
        this.options.gfm && (I = /^\[[ xX]\] /.exec(f), I && (h = I[0] !== "[ ] ", f = f.replace(/^\[[ xX]\] +/, ""))), o.items.push({
          type: "list_item",
          raw: p,
          task: !!I,
          checked: h,
          loose: !1,
          text: f,
          tokens: []
        }), o.raw += p;
      }
      o.items[o.items.length - 1].raw = o.items[o.items.length - 1].raw.trimEnd(), o.items[o.items.length - 1].text = o.items[o.items.length - 1].text.trimEnd(), o.raw = o.raw.trimEnd();
      for (let c = 0; c < o.items.length; c++)
        if (this.lexer.state.top = !1, o.items[c].tokens = this.lexer.blockTokens(o.items[c].text, []), !o.loose) {
          const p = o.items[c].tokens.filter((k) => k.type === "space"), f = p.length > 0 && p.some((k) => /\n.*\n/.test(k.raw));
          o.loose = f;
        }
      if (o.loose)
        for (let c = 0; c < o.items.length; c++)
          o.items[c].loose = !0;
      return o;
    }
  }
  html(e) {
    const t = this.rules.block.html.exec(e);
    if (t)
      return {
        type: "html",
        block: !0,
        raw: t[0],
        pre: t[1] === "pre" || t[1] === "script" || t[1] === "style",
        text: t[0]
      };
  }
  def(e) {
    const t = this.rules.block.def.exec(e);
    if (t) {
      const n = t[1].toLowerCase().replace(/\s+/g, " "), r = t[2] ? t[2].replace(/^<(.*)>$/, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", o = t[3] ? t[3].substring(1, t[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : t[3];
      return {
        type: "def",
        tag: n,
        raw: t[0],
        href: r,
        title: o
      };
    }
  }
  table(e) {
    const t = this.rules.block.table.exec(e);
    if (!t || !/[:|]/.test(t[2]))
      return;
    const n = Gn(t[1]), r = t[2].replace(/^\||\| *$/g, "").split("|"), o = t[3] && t[3].trim() ? t[3].replace(/\n[ \t]*$/, "").split(`
`) : [], a = {
      type: "table",
      raw: t[0],
      header: [],
      align: [],
      rows: []
    };
    if (n.length === r.length) {
      for (const l of r)
        /^ *-+: *$/.test(l) ? a.align.push("right") : /^ *:-+: *$/.test(l) ? a.align.push("center") : /^ *:-+ *$/.test(l) ? a.align.push("left") : a.align.push(null);
      for (let l = 0; l < n.length; l++)
        a.header.push({
          text: n[l],
          tokens: this.lexer.inline(n[l]),
          header: !0,
          align: a.align[l]
        });
      for (const l of o)
        a.rows.push(Gn(l, a.header.length).map((c, p) => ({
          text: c,
          tokens: this.lexer.inline(c),
          header: !1,
          align: a.align[p]
        })));
      return a;
    }
  }
  lheading(e) {
    const t = this.rules.block.lheading.exec(e);
    if (t)
      return {
        type: "heading",
        raw: t[0],
        depth: t[2].charAt(0) === "=" ? 1 : 2,
        text: t[1],
        tokens: this.lexer.inline(t[1])
      };
  }
  paragraph(e) {
    const t = this.rules.block.paragraph.exec(e);
    if (t) {
      const n = t[1].charAt(t[1].length - 1) === `
` ? t[1].slice(0, -1) : t[1];
      return {
        type: "paragraph",
        raw: t[0],
        text: n,
        tokens: this.lexer.inline(n)
      };
    }
  }
  text(e) {
    const t = this.rules.block.text.exec(e);
    if (t)
      return {
        type: "text",
        raw: t[0],
        text: t[0],
        tokens: this.lexer.inline(t[0])
      };
  }
  escape(e) {
    const t = this.rules.inline.escape.exec(e);
    if (t)
      return {
        type: "escape",
        raw: t[0],
        text: Te(t[1])
      };
  }
  tag(e) {
    const t = this.rules.inline.tag.exec(e);
    if (t)
      return !this.lexer.state.inLink && /^<a /i.test(t[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && /^<\/a>/i.test(t[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(t[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(t[0]) && (this.lexer.state.inRawBlock = !1), {
        type: "html",
        raw: t[0],
        inLink: this.lexer.state.inLink,
        inRawBlock: this.lexer.state.inRawBlock,
        block: !1,
        text: t[0]
      };
  }
  link(e) {
    const t = this.rules.inline.link.exec(e);
    if (t) {
      const n = t[2].trim();
      if (!this.options.pedantic && /^</.test(n)) {
        if (!/>$/.test(n))
          return;
        const a = wt(n.slice(0, -1), "\\");
        if ((n.length - a.length) % 2 === 0)
          return;
      } else {
        const a = yr(t[2], "()");
        if (a > -1) {
          const c = (t[0].indexOf("!") === 0 ? 5 : 4) + t[1].length + a;
          t[2] = t[2].substring(0, a), t[0] = t[0].substring(0, c).trim(), t[3] = "";
        }
      }
      let r = t[2], o = "";
      if (this.options.pedantic) {
        const a = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(r);
        a && (r = a[1], o = a[3]);
      } else
        o = t[3] ? t[3].slice(1, -1) : "";
      return r = r.trim(), /^</.test(r) && (this.options.pedantic && !/>$/.test(n) ? r = r.slice(1) : r = r.slice(1, -1)), Kn(t, {
        href: r && r.replace(this.rules.inline.anyPunctuation, "$1"),
        title: o && o.replace(this.rules.inline.anyPunctuation, "$1")
      }, t[0], this.lexer);
    }
  }
  reflink(e, t) {
    let n;
    if ((n = this.rules.inline.reflink.exec(e)) || (n = this.rules.inline.nolink.exec(e))) {
      const r = (n[2] || n[1]).replace(/\s+/g, " "), o = t[r.toLowerCase()];
      if (!o) {
        const a = n[0].charAt(0);
        return {
          type: "text",
          raw: a,
          text: a
        };
      }
      return Kn(n, o, n[0], this.lexer);
    }
  }
  emStrong(e, t, n = "") {
    let r = this.rules.inline.emStrongLDelim.exec(e);
    if (!r || r[3] && n.match(/[\p{L}\p{N}]/u))
      return;
    if (!(r[1] || r[2] || "") || !n || this.rules.inline.punctuation.exec(n)) {
      const a = [...r[0]].length - 1;
      let l, c, p = a, f = 0;
      const k = r[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (k.lastIndex = 0, t = t.slice(-1 * e.length + a); (r = k.exec(t)) != null; ) {
        if (l = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !l)
          continue;
        if (c = [...l].length, r[3] || r[4]) {
          p += c;
          continue;
        } else if ((r[5] || r[6]) && a % 3 && !((a + c) % 3)) {
          f += c;
          continue;
        }
        if (p -= c, p > 0)
          continue;
        c = Math.min(c, c + p + f);
        const y = [...r[0]][0].length, v = e.slice(0, a + r.index + y + c);
        if (Math.min(a, c) % 2) {
          const I = v.slice(1, -1);
          return {
            type: "em",
            raw: v,
            text: I,
            tokens: this.lexer.inlineTokens(I)
          };
        }
        const b = v.slice(2, -2);
        return {
          type: "strong",
          raw: v,
          text: b,
          tokens: this.lexer.inlineTokens(b)
        };
      }
    }
  }
  codespan(e) {
    const t = this.rules.inline.code.exec(e);
    if (t) {
      let n = t[2].replace(/\n/g, " ");
      const r = /[^ ]/.test(n), o = /^ /.test(n) && / $/.test(n);
      return r && o && (n = n.substring(1, n.length - 1)), n = Te(n, !0), {
        type: "codespan",
        raw: t[0],
        text: n
      };
    }
  }
  br(e) {
    const t = this.rules.inline.br.exec(e);
    if (t)
      return {
        type: "br",
        raw: t[0]
      };
  }
  del(e) {
    const t = this.rules.inline.del.exec(e);
    if (t)
      return {
        type: "del",
        raw: t[0],
        text: t[2],
        tokens: this.lexer.inlineTokens(t[2])
      };
  }
  autolink(e) {
    const t = this.rules.inline.autolink.exec(e);
    if (t) {
      let n, r;
      return t[2] === "@" ? (n = Te(t[1]), r = "mailto:" + n) : (n = Te(t[1]), r = n), {
        type: "link",
        raw: t[0],
        text: n,
        href: r,
        tokens: [
          {
            type: "text",
            raw: n,
            text: n
          }
        ]
      };
    }
  }
  url(e) {
    var n;
    let t;
    if (t = this.rules.inline.url.exec(e)) {
      let r, o;
      if (t[2] === "@")
        r = Te(t[0]), o = "mailto:" + r;
      else {
        let a;
        do
          a = t[0], t[0] = ((n = this.rules.inline._backpedal.exec(t[0])) == null ? void 0 : n[0]) ?? "";
        while (a !== t[0]);
        r = Te(t[0]), t[1] === "www." ? o = "http://" + t[0] : o = t[0];
      }
      return {
        type: "link",
        raw: t[0],
        text: r,
        href: o,
        tokens: [
          {
            type: "text",
            raw: r,
            text: r
          }
        ]
      };
    }
  }
  inlineText(e) {
    const t = this.rules.inline.text.exec(e);
    if (t) {
      let n;
      return this.lexer.state.inRawBlock ? n = t[0] : n = Te(t[0]), {
        type: "text",
        raw: t[0],
        text: n
      };
    }
  }
}
const kr = /^(?:[ \t]*(?:\n|$))+/, br = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, wr = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, It = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, vr = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, ms = /(?:[*+-]|\d{1,9}[.)])/, ys = j(/^(?!bull |blockCode|fences|blockquote|heading|html)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html))+?)\n {0,3}(=+|-+) *(?:\n+|$)/).replace(/bull/g, ms).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).getRegex(), yn = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, Tr = /^[^\n]+/, xn = /(?!\s*\])(?:\\.|[^\[\]\\])+/, Sr = j(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", xn).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Ar = j(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, ms).getRegex(), Vt = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", kn = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Cr = j("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", kn).replace("tag", Vt).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), xs = j(yn).replace("hr", It).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Vt).getRegex(), Er = j(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", xs).getRegex(), bn = {
  blockquote: Er,
  code: br,
  def: Sr,
  fences: wr,
  heading: vr,
  hr: It,
  html: Cr,
  lheading: ys,
  list: Ar,
  newline: kr,
  paragraph: xs,
  table: Rt,
  text: Tr
}, Vn = j("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", It).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Vt).getRegex(), _r = {
  ...bn,
  table: Vn,
  paragraph: j(yn).replace("hr", It).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", Vn).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Vt).getRegex()
}, Rr = {
  ...bn,
  html: j(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", kn).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
  heading: /^(#{1,6})(.*)(?:\n+|$)/,
  fences: Rt,
  // fences not supported
  lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
  paragraph: j(yn).replace("hr", It).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", ys).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
}, ks = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Mr = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, bs = /^( {2,}|\\)\n(?!\s*$)/, Ir = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, Lt = "\\p{P}\\p{S}", Lr = j(/^((?![*_])[\spunctuation])/, "u").replace(/punctuation/g, Lt).getRegex(), Dr = /\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g, Or = j(/^(?:\*+(?:((?!\*)[punct])|[^\s*]))|^_+(?:((?!_)[punct])|([^\s_]))/, "u").replace(/punct/g, Lt).getRegex(), $r = j("^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)[punct](\\*+)(?=[\\s]|$)|[^punct\\s](\\*+)(?!\\*)(?=[punct\\s]|$)|(?!\\*)[punct\\s](\\*+)(?=[^punct\\s])|[\\s](\\*+)(?!\\*)(?=[punct])|(?!\\*)[punct](\\*+)(?!\\*)(?=[punct])|[^punct\\s](\\*+)(?=[^punct\\s])", "gu").replace(/punct/g, Lt).getRegex(), Pr = j("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)[punct](_+)(?=[\\s]|$)|[^punct\\s](_+)(?!_)(?=[punct\\s]|$)|(?!_)[punct\\s](_+)(?=[^punct\\s])|[\\s](_+)(?!_)(?=[punct])|(?!_)[punct](_+)(?!_)(?=[punct])", "gu").replace(/punct/g, Lt).getRegex(), Nr = j(/\\([punct])/, "gu").replace(/punct/g, Lt).getRegex(), zr = j(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), Hr = j(kn).replace("(?:-->|$)", "-->").getRegex(), Fr = j("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", Hr).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), jt = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/, Br = j(/^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/).replace("label", jt).replace("href", /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), ws = j(/^!?\[(label)\]\[(ref)\]/).replace("label", jt).replace("ref", xn).getRegex(), vs = j(/^!?\[(ref)\](?:\[\])?/).replace("ref", xn).getRegex(), Ur = j("reflink|nolink(?!\\()", "g").replace("reflink", ws).replace("nolink", vs).getRegex(), wn = {
  _backpedal: Rt,
  // only used for GFM url
  anyPunctuation: Nr,
  autolink: zr,
  blockSkip: Dr,
  br: bs,
  code: Mr,
  del: Rt,
  emStrongLDelim: Or,
  emStrongRDelimAst: $r,
  emStrongRDelimUnd: Pr,
  escape: ks,
  link: Br,
  nolink: vs,
  punctuation: Lr,
  reflink: ws,
  reflinkSearch: Ur,
  tag: Fr,
  text: Ir,
  url: Rt
}, qr = {
  ...wn,
  link: j(/^!?\[(label)\]\((.*?)\)/).replace("label", jt).getRegex(),
  reflink: j(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", jt).getRegex()
}, dn = {
  ...wn,
  escape: j(ks).replace("])", "~|])").getRegex(),
  url: j(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
  _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
  del: /^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,
  text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
}, jr = {
  ...dn,
  br: j(bs).replace("{2,}", "*").getRegex(),
  text: j(dn.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
}, Ht = {
  normal: bn,
  gfm: _r,
  pedantic: Rr
}, vt = {
  normal: wn,
  gfm: dn,
  breaks: jr,
  pedantic: qr
};
class _e {
  constructor(e) {
    W(this, "tokens");
    W(this, "options");
    W(this, "state");
    W(this, "tokenizer");
    W(this, "inlineQueue");
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || ut, this.options.tokenizer = this.options.tokenizer || new qt(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
      inLink: !1,
      inRawBlock: !1,
      top: !0
    };
    const t = {
      block: Ht.normal,
      inline: vt.normal
    };
    this.options.pedantic ? (t.block = Ht.pedantic, t.inline = vt.pedantic) : this.options.gfm && (t.block = Ht.gfm, this.options.breaks ? t.inline = vt.breaks : t.inline = vt.gfm), this.tokenizer.rules = t;
  }
  /**
   * Expose Rules
   */
  static get rules() {
    return {
      block: Ht,
      inline: vt
    };
  }
  /**
   * Static Lex Method
   */
  static lex(e, t) {
    return new _e(t).lex(e);
  }
  /**
   * Static Lex Inline Method
   */
  static lexInline(e, t) {
    return new _e(t).inlineTokens(e);
  }
  /**
   * Preprocessing
   */
  lex(e) {
    e = e.replace(/\r\n|\r/g, `
`), this.blockTokens(e, this.tokens);
    for (let t = 0; t < this.inlineQueue.length; t++) {
      const n = this.inlineQueue[t];
      this.inlineTokens(n.src, n.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, t = [], n = !1) {
    this.options.pedantic && (e = e.replace(/\t/g, "    ").replace(/^ +$/gm, ""));
    let r, o, a;
    for (; e; )
      if (!(this.options.extensions && this.options.extensions.block && this.options.extensions.block.some((l) => (r = l.call({ lexer: this }, e, t)) ? (e = e.substring(r.raw.length), t.push(r), !0) : !1))) {
        if (r = this.tokenizer.space(e)) {
          e = e.substring(r.raw.length), r.raw.length === 1 && t.length > 0 ? t[t.length - 1].raw += `
` : t.push(r);
          continue;
        }
        if (r = this.tokenizer.code(e)) {
          e = e.substring(r.raw.length), o = t[t.length - 1], o && (o.type === "paragraph" || o.type === "text") ? (o.raw += `
` + r.raw, o.text += `
` + r.text, this.inlineQueue[this.inlineQueue.length - 1].src = o.text) : t.push(r);
          continue;
        }
        if (r = this.tokenizer.fences(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        if (r = this.tokenizer.heading(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        if (r = this.tokenizer.hr(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        if (r = this.tokenizer.blockquote(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        if (r = this.tokenizer.list(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        if (r = this.tokenizer.html(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        if (r = this.tokenizer.def(e)) {
          e = e.substring(r.raw.length), o = t[t.length - 1], o && (o.type === "paragraph" || o.type === "text") ? (o.raw += `
` + r.raw, o.text += `
` + r.raw, this.inlineQueue[this.inlineQueue.length - 1].src = o.text) : this.tokens.links[r.tag] || (this.tokens.links[r.tag] = {
            href: r.href,
            title: r.title
          });
          continue;
        }
        if (r = this.tokenizer.table(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        if (r = this.tokenizer.lheading(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        if (a = e, this.options.extensions && this.options.extensions.startBlock) {
          let l = 1 / 0;
          const c = e.slice(1);
          let p;
          this.options.extensions.startBlock.forEach((f) => {
            p = f.call({ lexer: this }, c), typeof p == "number" && p >= 0 && (l = Math.min(l, p));
          }), l < 1 / 0 && l >= 0 && (a = e.substring(0, l + 1));
        }
        if (this.state.top && (r = this.tokenizer.paragraph(a))) {
          o = t[t.length - 1], n && (o == null ? void 0 : o.type) === "paragraph" ? (o.raw += `
` + r.raw, o.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue[this.inlineQueue.length - 1].src = o.text) : t.push(r), n = a.length !== e.length, e = e.substring(r.raw.length);
          continue;
        }
        if (r = this.tokenizer.text(e)) {
          e = e.substring(r.raw.length), o = t[t.length - 1], o && o.type === "text" ? (o.raw += `
` + r.raw, o.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue[this.inlineQueue.length - 1].src = o.text) : t.push(r);
          continue;
        }
        if (e) {
          const l = "Infinite loop on byte: " + e.charCodeAt(0);
          if (this.options.silent) {
            console.error(l);
            break;
          } else
            throw new Error(l);
        }
      }
    return this.state.top = !0, t;
  }
  inline(e, t = []) {
    return this.inlineQueue.push({ src: e, tokens: t }), t;
  }
  /**
   * Lexing/Compiling
   */
  inlineTokens(e, t = []) {
    let n, r, o, a = e, l, c, p;
    if (this.tokens.links) {
      const f = Object.keys(this.tokens.links);
      if (f.length > 0)
        for (; (l = this.tokenizer.rules.inline.reflinkSearch.exec(a)) != null; )
          f.includes(l[0].slice(l[0].lastIndexOf("[") + 1, -1)) && (a = a.slice(0, l.index) + "[" + "a".repeat(l[0].length - 2) + "]" + a.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (l = this.tokenizer.rules.inline.blockSkip.exec(a)) != null; )
      a = a.slice(0, l.index) + "[" + "a".repeat(l[0].length - 2) + "]" + a.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    for (; (l = this.tokenizer.rules.inline.anyPunctuation.exec(a)) != null; )
      a = a.slice(0, l.index) + "++" + a.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    for (; e; )
      if (c || (p = ""), c = !1, !(this.options.extensions && this.options.extensions.inline && this.options.extensions.inline.some((f) => (n = f.call({ lexer: this }, e, t)) ? (e = e.substring(n.raw.length), t.push(n), !0) : !1))) {
        if (n = this.tokenizer.escape(e)) {
          e = e.substring(n.raw.length), t.push(n);
          continue;
        }
        if (n = this.tokenizer.tag(e)) {
          e = e.substring(n.raw.length), r = t[t.length - 1], r && n.type === "text" && r.type === "text" ? (r.raw += n.raw, r.text += n.text) : t.push(n);
          continue;
        }
        if (n = this.tokenizer.link(e)) {
          e = e.substring(n.raw.length), t.push(n);
          continue;
        }
        if (n = this.tokenizer.reflink(e, this.tokens.links)) {
          e = e.substring(n.raw.length), r = t[t.length - 1], r && n.type === "text" && r.type === "text" ? (r.raw += n.raw, r.text += n.text) : t.push(n);
          continue;
        }
        if (n = this.tokenizer.emStrong(e, a, p)) {
          e = e.substring(n.raw.length), t.push(n);
          continue;
        }
        if (n = this.tokenizer.codespan(e)) {
          e = e.substring(n.raw.length), t.push(n);
          continue;
        }
        if (n = this.tokenizer.br(e)) {
          e = e.substring(n.raw.length), t.push(n);
          continue;
        }
        if (n = this.tokenizer.del(e)) {
          e = e.substring(n.raw.length), t.push(n);
          continue;
        }
        if (n = this.tokenizer.autolink(e)) {
          e = e.substring(n.raw.length), t.push(n);
          continue;
        }
        if (!this.state.inLink && (n = this.tokenizer.url(e))) {
          e = e.substring(n.raw.length), t.push(n);
          continue;
        }
        if (o = e, this.options.extensions && this.options.extensions.startInline) {
          let f = 1 / 0;
          const k = e.slice(1);
          let y;
          this.options.extensions.startInline.forEach((v) => {
            y = v.call({ lexer: this }, k), typeof y == "number" && y >= 0 && (f = Math.min(f, y));
          }), f < 1 / 0 && f >= 0 && (o = e.substring(0, f + 1));
        }
        if (n = this.tokenizer.inlineText(o)) {
          e = e.substring(n.raw.length), n.raw.slice(-1) !== "_" && (p = n.raw.slice(-1)), c = !0, r = t[t.length - 1], r && r.type === "text" ? (r.raw += n.raw, r.text += n.text) : t.push(n);
          continue;
        }
        if (e) {
          const f = "Infinite loop on byte: " + e.charCodeAt(0);
          if (this.options.silent) {
            console.error(f);
            break;
          } else
            throw new Error(f);
        }
      }
    return t;
  }
}
class Wt {
  // set by the parser
  constructor(e) {
    W(this, "options");
    W(this, "parser");
    this.options = e || ut;
  }
  space(e) {
    return "";
  }
  code({ text: e, lang: t, escaped: n }) {
    var a;
    const r = (a = (t || "").match(/^\S*/)) == null ? void 0 : a[0], o = e.replace(/\n$/, "") + `
`;
    return r ? '<pre><code class="language-' + Te(r) + '">' + (n ? o : Te(o, !0)) + `</code></pre>
` : "<pre><code>" + (n ? o : Te(o, !0)) + `</code></pre>
`;
  }
  blockquote({ tokens: e }) {
    return `<blockquote>
${this.parser.parse(e)}</blockquote>
`;
  }
  html({ text: e }) {
    return e;
  }
  heading({ tokens: e, depth: t }) {
    return `<h${t}>${this.parser.parseInline(e)}</h${t}>
`;
  }
  hr(e) {
    return `<hr>
`;
  }
  list(e) {
    const t = e.ordered, n = e.start;
    let r = "";
    for (let l = 0; l < e.items.length; l++) {
      const c = e.items[l];
      r += this.listitem(c);
    }
    const o = t ? "ol" : "ul", a = t && n !== 1 ? ' start="' + n + '"' : "";
    return "<" + o + a + `>
` + r + "</" + o + `>
`;
  }
  listitem(e) {
    let t = "";
    if (e.task) {
      const n = this.checkbox({ checked: !!e.checked });
      e.loose ? e.tokens.length > 0 && e.tokens[0].type === "paragraph" ? (e.tokens[0].text = n + " " + e.tokens[0].text, e.tokens[0].tokens && e.tokens[0].tokens.length > 0 && e.tokens[0].tokens[0].type === "text" && (e.tokens[0].tokens[0].text = n + " " + e.tokens[0].tokens[0].text)) : e.tokens.unshift({
        type: "text",
        raw: n + " ",
        text: n + " "
      }) : t += n + " ";
    }
    return t += this.parser.parse(e.tokens, !!e.loose), `<li>${t}</li>
`;
  }
  checkbox({ checked: e }) {
    return "<input " + (e ? 'checked="" ' : "") + 'disabled="" type="checkbox">';
  }
  paragraph({ tokens: e }) {
    return `<p>${this.parser.parseInline(e)}</p>
`;
  }
  table(e) {
    let t = "", n = "";
    for (let o = 0; o < e.header.length; o++)
      n += this.tablecell(e.header[o]);
    t += this.tablerow({ text: n });
    let r = "";
    for (let o = 0; o < e.rows.length; o++) {
      const a = e.rows[o];
      n = "";
      for (let l = 0; l < a.length; l++)
        n += this.tablecell(a[l]);
      r += this.tablerow({ text: n });
    }
    return r && (r = `<tbody>${r}</tbody>`), `<table>
<thead>
` + t + `</thead>
` + r + `</table>
`;
  }
  tablerow({ text: e }) {
    return `<tr>
${e}</tr>
`;
  }
  tablecell(e) {
    const t = this.parser.parseInline(e.tokens), n = e.header ? "th" : "td";
    return (e.align ? `<${n} align="${e.align}">` : `<${n}>`) + t + `</${n}>
`;
  }
  /**
   * span level renderer
   */
  strong({ tokens: e }) {
    return `<strong>${this.parser.parseInline(e)}</strong>`;
  }
  em({ tokens: e }) {
    return `<em>${this.parser.parseInline(e)}</em>`;
  }
  codespan({ text: e }) {
    return `<code>${e}</code>`;
  }
  br(e) {
    return "<br>";
  }
  del({ tokens: e }) {
    return `<del>${this.parser.parseInline(e)}</del>`;
  }
  link({ href: e, title: t, tokens: n }) {
    const r = this.parser.parseInline(n), o = Wn(e);
    if (o === null)
      return r;
    e = o;
    let a = '<a href="' + e + '"';
    return t && (a += ' title="' + t + '"'), a += ">" + r + "</a>", a;
  }
  image({ href: e, title: t, text: n }) {
    const r = Wn(e);
    if (r === null)
      return n;
    e = r;
    let o = `<img src="${e}" alt="${n}"`;
    return t && (o += ` title="${t}"`), o += ">", o;
  }
  text(e) {
    return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : e.text;
  }
}
class vn {
  // no need for block level renderers
  strong({ text: e }) {
    return e;
  }
  em({ text: e }) {
    return e;
  }
  codespan({ text: e }) {
    return e;
  }
  del({ text: e }) {
    return e;
  }
  html({ text: e }) {
    return e;
  }
  text({ text: e }) {
    return e;
  }
  link({ text: e }) {
    return "" + e;
  }
  image({ text: e }) {
    return "" + e;
  }
  br() {
    return "";
  }
}
class Re {
  constructor(e) {
    W(this, "options");
    W(this, "renderer");
    W(this, "textRenderer");
    this.options = e || ut, this.options.renderer = this.options.renderer || new Wt(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new vn();
  }
  /**
   * Static Parse Method
   */
  static parse(e, t) {
    return new Re(t).parse(e);
  }
  /**
   * Static Parse Inline Method
   */
  static parseInline(e, t) {
    return new Re(t).parseInline(e);
  }
  /**
   * Parse Loop
   */
  parse(e, t = !0) {
    let n = "";
    for (let r = 0; r < e.length; r++) {
      const o = e[r];
      if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[o.type]) {
        const l = o, c = this.options.extensions.renderers[l.type].call({ parser: this }, l);
        if (c !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(l.type)) {
          n += c || "";
          continue;
        }
      }
      const a = o;
      switch (a.type) {
        case "space": {
          n += this.renderer.space(a);
          continue;
        }
        case "hr": {
          n += this.renderer.hr(a);
          continue;
        }
        case "heading": {
          n += this.renderer.heading(a);
          continue;
        }
        case "code": {
          n += this.renderer.code(a);
          continue;
        }
        case "table": {
          n += this.renderer.table(a);
          continue;
        }
        case "blockquote": {
          n += this.renderer.blockquote(a);
          continue;
        }
        case "list": {
          n += this.renderer.list(a);
          continue;
        }
        case "html": {
          n += this.renderer.html(a);
          continue;
        }
        case "paragraph": {
          n += this.renderer.paragraph(a);
          continue;
        }
        case "text": {
          let l = a, c = this.renderer.text(l);
          for (; r + 1 < e.length && e[r + 1].type === "text"; )
            l = e[++r], c += `
` + this.renderer.text(l);
          t ? n += this.renderer.paragraph({
            type: "paragraph",
            raw: c,
            text: c,
            tokens: [{ type: "text", raw: c, text: c }]
          }) : n += c;
          continue;
        }
        default: {
          const l = 'Token with "' + a.type + '" type was not found.';
          if (this.options.silent)
            return console.error(l), "";
          throw new Error(l);
        }
      }
    }
    return n;
  }
  /**
   * Parse Inline Tokens
   */
  parseInline(e, t) {
    t = t || this.renderer;
    let n = "";
    for (let r = 0; r < e.length; r++) {
      const o = e[r];
      if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[o.type]) {
        const l = this.options.extensions.renderers[o.type].call({ parser: this }, o);
        if (l !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(o.type)) {
          n += l || "";
          continue;
        }
      }
      const a = o;
      switch (a.type) {
        case "escape": {
          n += t.text(a);
          break;
        }
        case "html": {
          n += t.html(a);
          break;
        }
        case "link": {
          n += t.link(a);
          break;
        }
        case "image": {
          n += t.image(a);
          break;
        }
        case "strong": {
          n += t.strong(a);
          break;
        }
        case "em": {
          n += t.em(a);
          break;
        }
        case "codespan": {
          n += t.codespan(a);
          break;
        }
        case "br": {
          n += t.br(a);
          break;
        }
        case "del": {
          n += t.del(a);
          break;
        }
        case "text": {
          n += t.text(a);
          break;
        }
        default: {
          const l = 'Token with "' + a.type + '" type was not found.';
          if (this.options.silent)
            return console.error(l), "";
          throw new Error(l);
        }
      }
    }
    return n;
  }
}
class Mt {
  constructor(e) {
    W(this, "options");
    W(this, "block");
    this.options = e || ut;
  }
  /**
   * Process markdown before marked
   */
  preprocess(e) {
    return e;
  }
  /**
   * Process HTML after marked is finished
   */
  postprocess(e) {
    return e;
  }
  /**
   * Process all tokens before walk tokens
   */
  processAllTokens(e) {
    return e;
  }
  /**
   * Provide function to tokenize markdown
   */
  provideLexer() {
    return this.block ? _e.lex : _e.lexInline;
  }
  /**
   * Provide function to parse tokens
   */
  provideParser() {
    return this.block ? Re.parse : Re.parseInline;
  }
}
W(Mt, "passThroughHooks", /* @__PURE__ */ new Set([
  "preprocess",
  "postprocess",
  "processAllTokens"
]));
class Wr {
  constructor(...e) {
    W(this, "defaults", mn());
    W(this, "options", this.setOptions);
    W(this, "parse", this.parseMarkdown(!0));
    W(this, "parseInline", this.parseMarkdown(!1));
    W(this, "Parser", Re);
    W(this, "Renderer", Wt);
    W(this, "TextRenderer", vn);
    W(this, "Lexer", _e);
    W(this, "Tokenizer", qt);
    W(this, "Hooks", Mt);
    this.use(...e);
  }
  /**
   * Run callback for every token
   */
  walkTokens(e, t) {
    var r, o;
    let n = [];
    for (const a of e)
      switch (n = n.concat(t.call(this, a)), a.type) {
        case "table": {
          const l = a;
          for (const c of l.header)
            n = n.concat(this.walkTokens(c.tokens, t));
          for (const c of l.rows)
            for (const p of c)
              n = n.concat(this.walkTokens(p.tokens, t));
          break;
        }
        case "list": {
          const l = a;
          n = n.concat(this.walkTokens(l.items, t));
          break;
        }
        default: {
          const l = a;
          (o = (r = this.defaults.extensions) == null ? void 0 : r.childTokens) != null && o[l.type] ? this.defaults.extensions.childTokens[l.type].forEach((c) => {
            const p = l[c].flat(1 / 0);
            n = n.concat(this.walkTokens(p, t));
          }) : l.tokens && (n = n.concat(this.walkTokens(l.tokens, t)));
        }
      }
    return n;
  }
  use(...e) {
    const t = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return e.forEach((n) => {
      const r = { ...n };
      if (r.async = this.defaults.async || r.async || !1, n.extensions && (n.extensions.forEach((o) => {
        if (!o.name)
          throw new Error("extension name required");
        if ("renderer" in o) {
          const a = t.renderers[o.name];
          a ? t.renderers[o.name] = function(...l) {
            let c = o.renderer.apply(this, l);
            return c === !1 && (c = a.apply(this, l)), c;
          } : t.renderers[o.name] = o.renderer;
        }
        if ("tokenizer" in o) {
          if (!o.level || o.level !== "block" && o.level !== "inline")
            throw new Error("extension level must be 'block' or 'inline'");
          const a = t[o.level];
          a ? a.unshift(o.tokenizer) : t[o.level] = [o.tokenizer], o.start && (o.level === "block" ? t.startBlock ? t.startBlock.push(o.start) : t.startBlock = [o.start] : o.level === "inline" && (t.startInline ? t.startInline.push(o.start) : t.startInline = [o.start]));
        }
        "childTokens" in o && o.childTokens && (t.childTokens[o.name] = o.childTokens);
      }), r.extensions = t), n.renderer) {
        const o = this.defaults.renderer || new Wt(this.defaults);
        for (const a in n.renderer) {
          if (!(a in o))
            throw new Error(`renderer '${a}' does not exist`);
          if (["options", "parser"].includes(a))
            continue;
          const l = a, c = n.renderer[l], p = o[l];
          o[l] = (...f) => {
            let k = c.apply(o, f);
            return k === !1 && (k = p.apply(o, f)), k || "";
          };
        }
        r.renderer = o;
      }
      if (n.tokenizer) {
        const o = this.defaults.tokenizer || new qt(this.defaults);
        for (const a in n.tokenizer) {
          if (!(a in o))
            throw new Error(`tokenizer '${a}' does not exist`);
          if (["options", "rules", "lexer"].includes(a))
            continue;
          const l = a, c = n.tokenizer[l], p = o[l];
          o[l] = (...f) => {
            let k = c.apply(o, f);
            return k === !1 && (k = p.apply(o, f)), k;
          };
        }
        r.tokenizer = o;
      }
      if (n.hooks) {
        const o = this.defaults.hooks || new Mt();
        for (const a in n.hooks) {
          if (!(a in o))
            throw new Error(`hook '${a}' does not exist`);
          if (["options", "block"].includes(a))
            continue;
          const l = a, c = n.hooks[l], p = o[l];
          Mt.passThroughHooks.has(a) ? o[l] = (f) => {
            if (this.defaults.async)
              return Promise.resolve(c.call(o, f)).then((y) => p.call(o, y));
            const k = c.call(o, f);
            return p.call(o, k);
          } : o[l] = (...f) => {
            let k = c.apply(o, f);
            return k === !1 && (k = p.apply(o, f)), k;
          };
        }
        r.hooks = o;
      }
      if (n.walkTokens) {
        const o = this.defaults.walkTokens, a = n.walkTokens;
        r.walkTokens = function(l) {
          let c = [];
          return c.push(a.call(this, l)), o && (c = c.concat(o.call(this, l))), c;
        };
      }
      this.defaults = { ...this.defaults, ...r };
    }), this;
  }
  setOptions(e) {
    return this.defaults = { ...this.defaults, ...e }, this;
  }
  lexer(e, t) {
    return _e.lex(e, t ?? this.defaults);
  }
  parser(e, t) {
    return Re.parse(e, t ?? this.defaults);
  }
  parseMarkdown(e) {
    return (n, r) => {
      const o = { ...r }, a = { ...this.defaults, ...o }, l = this.onError(!!a.silent, !!a.async);
      if (this.defaults.async === !0 && o.async === !1)
        return l(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof n > "u" || n === null)
        return l(new Error("marked(): input parameter is undefined or null"));
      if (typeof n != "string")
        return l(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(n) + ", string expected"));
      a.hooks && (a.hooks.options = a, a.hooks.block = e);
      const c = a.hooks ? a.hooks.provideLexer() : e ? _e.lex : _e.lexInline, p = a.hooks ? a.hooks.provideParser() : e ? Re.parse : Re.parseInline;
      if (a.async)
        return Promise.resolve(a.hooks ? a.hooks.preprocess(n) : n).then((f) => c(f, a)).then((f) => a.hooks ? a.hooks.processAllTokens(f) : f).then((f) => a.walkTokens ? Promise.all(this.walkTokens(f, a.walkTokens)).then(() => f) : f).then((f) => p(f, a)).then((f) => a.hooks ? a.hooks.postprocess(f) : f).catch(l);
      try {
        a.hooks && (n = a.hooks.preprocess(n));
        let f = c(n, a);
        a.hooks && (f = a.hooks.processAllTokens(f)), a.walkTokens && this.walkTokens(f, a.walkTokens);
        let k = p(f, a);
        return a.hooks && (k = a.hooks.postprocess(k)), k;
      } catch (f) {
        return l(f);
      }
    };
  }
  onError(e, t) {
    return (n) => {
      if (n.message += `
Please report this to https://github.com/markedjs/marked.`, e) {
        const r = "<p>An error occurred:</p><pre>" + Te(n.message + "", !0) + "</pre>";
        return t ? Promise.resolve(r) : r;
      }
      if (t)
        return Promise.reject(n);
      throw n;
    };
  }
}
const it = new Wr();
function B(s, e) {
  return it.parse(s, e);
}
B.options = B.setOptions = function(s) {
  return it.setOptions(s), B.defaults = it.defaults, fs(B.defaults), B;
};
B.getDefaults = mn;
B.defaults = ut;
B.use = function(...s) {
  return it.use(...s), B.defaults = it.defaults, fs(B.defaults), B;
};
B.walkTokens = function(s, e) {
  return it.walkTokens(s, e);
};
B.parseInline = it.parseInline;
B.Parser = Re;
B.parser = Re.parse;
B.Renderer = Wt;
B.TextRenderer = vn;
B.Lexer = _e;
B.lexer = _e.lex;
B.Tokenizer = qt;
B.Hooks = Mt;
B.parse = B;
B.options;
B.setOptions;
B.use;
B.walkTokens;
B.parseInline;
Re.parse;
_e.lex;
/*! @license DOMPurify 3.3.0 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.3.0/LICENSE */
const {
  entries: Ts,
  setPrototypeOf: Zn,
  isFrozen: Gr,
  getPrototypeOf: Kr,
  getOwnPropertyDescriptor: Vr
} = Object;
let {
  freeze: ye,
  seal: Me,
  create: pn
} = Object, {
  apply: fn,
  construct: hn
} = typeof Reflect < "u" && Reflect;
ye || (ye = function(e) {
  return e;
});
Me || (Me = function(e) {
  return e;
});
fn || (fn = function(e, t) {
  for (var n = arguments.length, r = new Array(n > 2 ? n - 2 : 0), o = 2; o < n; o++)
    r[o - 2] = arguments[o];
  return e.apply(t, r);
});
hn || (hn = function(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), r = 1; r < t; r++)
    n[r - 1] = arguments[r];
  return new e(...n);
});
const Ft = xe(Array.prototype.forEach), Zr = xe(Array.prototype.lastIndexOf), Qn = xe(Array.prototype.pop), Tt = xe(Array.prototype.push), Qr = xe(Array.prototype.splice), Ut = xe(String.prototype.toLowerCase), nn = xe(String.prototype.toString), sn = xe(String.prototype.match), St = xe(String.prototype.replace), Yr = xe(String.prototype.indexOf), Xr = xe(String.prototype.trim), De = xe(Object.prototype.hasOwnProperty), me = xe(RegExp.prototype.test), At = Jr(TypeError);
function xe(s) {
  return function(e) {
    e instanceof RegExp && (e.lastIndex = 0);
    for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), r = 1; r < t; r++)
      n[r - 1] = arguments[r];
    return fn(s, e, n);
  };
}
function Jr(s) {
  return function() {
    for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
      t[n] = arguments[n];
    return hn(s, t);
  };
}
function P(s, e) {
  let t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Ut;
  Zn && Zn(s, null);
  let n = e.length;
  for (; n--; ) {
    let r = e[n];
    if (typeof r == "string") {
      const o = t(r);
      o !== r && (Gr(e) || (e[n] = o), r = o);
    }
    s[r] = !0;
  }
  return s;
}
function eo(s) {
  for (let e = 0; e < s.length; e++)
    De(s, e) || (s[e] = null);
  return s;
}
function je(s) {
  const e = pn(null);
  for (const [t, n] of Ts(s))
    De(s, t) && (Array.isArray(n) ? e[t] = eo(n) : n && typeof n == "object" && n.constructor === Object ? e[t] = je(n) : e[t] = n);
  return e;
}
function Ct(s, e) {
  for (; s !== null; ) {
    const n = Vr(s, e);
    if (n) {
      if (n.get)
        return xe(n.get);
      if (typeof n.value == "function")
        return xe(n.value);
    }
    s = Kr(s);
  }
  function t() {
    return null;
  }
  return t;
}
const Yn = ye(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "search", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]), rn = ye(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "enterkeyhint", "exportparts", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "inputmode", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "part", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]), on = ye(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]), to = ye(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]), an = ye(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]), no = ye(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]), Xn = ye(["#text"]), Jn = ye(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "exportparts", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inert", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "part", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "slot", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns", "slot"]), ln = ye(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "mask-type", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]), es = ye(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]), Bt = ye(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]), so = Me(/\{\{[\w\W]*|[\w\W]*\}\}/gm), ro = Me(/<%[\w\W]*|[\w\W]*%>/gm), oo = Me(/\$\{[\w\W]*/gm), ao = Me(/^data-[\-\w.\u00B7-\uFFFF]+$/), io = Me(/^aria-[\-\w]+$/), Ss = Me(
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  // eslint-disable-line no-useless-escape
), lo = Me(/^(?:\w+script|data):/i), uo = Me(
  /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
  // eslint-disable-line no-control-regex
), As = Me(/^html$/i), co = Me(/^[a-z][.\w]*(-[.\w]+)+$/i);
var ts = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ARIA_ATTR: io,
  ATTR_WHITESPACE: uo,
  CUSTOM_ELEMENT: co,
  DATA_ATTR: ao,
  DOCTYPE_NAME: As,
  ERB_EXPR: ro,
  IS_ALLOWED_URI: Ss,
  IS_SCRIPT_OR_DATA: lo,
  MUSTACHE_EXPR: so,
  TMPLIT_EXPR: oo
});
const Et = {
  element: 1,
  text: 3,
  // Deprecated
  progressingInstruction: 7,
  comment: 8,
  document: 9
}, po = function() {
  return typeof window > "u" ? null : window;
}, fo = function(e, t) {
  if (typeof e != "object" || typeof e.createPolicy != "function")
    return null;
  let n = null;
  const r = "data-tt-policy-suffix";
  t && t.hasAttribute(r) && (n = t.getAttribute(r));
  const o = "dompurify" + (n ? "#" + n : "");
  try {
    return e.createPolicy(o, {
      createHTML(a) {
        return a;
      },
      createScriptURL(a) {
        return a;
      }
    });
  } catch {
    return console.warn("TrustedTypes policy " + o + " could not be created."), null;
  }
}, ns = function() {
  return {
    afterSanitizeAttributes: [],
    afterSanitizeElements: [],
    afterSanitizeShadowDOM: [],
    beforeSanitizeAttributes: [],
    beforeSanitizeElements: [],
    beforeSanitizeShadowDOM: [],
    uponSanitizeAttribute: [],
    uponSanitizeElement: [],
    uponSanitizeShadowNode: []
  };
};
function Cs() {
  let s = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : po();
  const e = (R) => Cs(R);
  if (e.version = "3.3.0", e.removed = [], !s || !s.document || s.document.nodeType !== Et.document || !s.Element)
    return e.isSupported = !1, e;
  let {
    document: t
  } = s;
  const n = t, r = n.currentScript, {
    DocumentFragment: o,
    HTMLTemplateElement: a,
    Node: l,
    Element: c,
    NodeFilter: p,
    NamedNodeMap: f = s.NamedNodeMap || s.MozNamedAttrMap,
    HTMLFormElement: k,
    DOMParser: y,
    trustedTypes: v
  } = s, b = c.prototype, I = Ct(b, "cloneNode"), h = Ct(b, "remove"), A = Ct(b, "nextSibling"), M = Ct(b, "childNodes"), E = Ct(b, "parentNode");
  if (typeof a == "function") {
    const R = t.createElement("template");
    R.content && R.content.ownerDocument && (t = R.content.ownerDocument);
  }
  let _, H = "";
  const {
    implementation: X,
    createNodeIterator: te,
    createDocumentFragment: ie,
    getElementsByTagName: Se
  } = t, {
    importNode: Ge
  } = n;
  let Z = ns();
  e.isSupported = typeof Ts == "function" && typeof E == "function" && X && X.createHTMLDocument !== void 0;
  const {
    MUSTACHE_EXPR: L,
    ERB_EXPR: J,
    TMPLIT_EXPR: ge,
    DATA_ATTR: Ke,
    ARIA_ATTR: Pe,
    IS_SCRIPT_OR_DATA: Ie,
    ATTR_WHITESPACE: et,
    CUSTOM_ELEMENT: tt
  } = ts;
  let {
    IS_ALLOWED_URI: nt
  } = ts, Q = null;
  const D = P({}, [...Yn, ...rn, ...on, ...an, ...Xn]);
  let S = null;
  const ne = P({}, [...Jn, ...ln, ...es, ...Bt]);
  let O = Object.seal(pn(null, {
    tagNameCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    attributeNameCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    allowCustomizedBuiltInElements: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: !1
    }
  })), se = null, ue = null;
  const ce = Object.seal(pn(null, {
    tagCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    attributeCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    }
  }));
  let ke = !0, ee = !0, de = !1, we = !0, Ae = !1, Ce = !0, Ee = !1, Ve = !1, Ze = !1, Qe = !1, st = !1, ct = !1, Dt = !0, d = !1;
  const m = "user-content-";
  let N = !0, z = !1, G = {}, re = null;
  const Le = P({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
  let U = null;
  const Ne = P({}, ["audio", "video", "img", "source", "image", "track"]);
  let xt = null;
  const Tn = P({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]), Ot = "http://www.w3.org/1998/Math/MathML", $t = "http://www.w3.org/2000/svg", Be = "http://www.w3.org/1999/xhtml";
  let dt = Be, Zt = !1, Qt = null;
  const Is = P({}, [Ot, $t, Be], nn);
  let Pt = P({}, ["mi", "mo", "mn", "ms", "mtext"]), Nt = P({}, ["annotation-xml"]);
  const Ls = P({}, ["title", "style", "font", "a", "script"]);
  let kt = null;
  const Ds = ["application/xhtml+xml", "text/html"], Os = "text/html";
  let le = null, pt = null;
  const $s = t.createElement("form"), Sn = function(i) {
    return i instanceof RegExp || i instanceof Function;
  }, Yt = function() {
    let i = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (!(pt && pt === i)) {
      if ((!i || typeof i != "object") && (i = {}), i = je(i), kt = // eslint-disable-next-line unicorn/prefer-includes
      Ds.indexOf(i.PARSER_MEDIA_TYPE) === -1 ? Os : i.PARSER_MEDIA_TYPE, le = kt === "application/xhtml+xml" ? nn : Ut, Q = De(i, "ALLOWED_TAGS") ? P({}, i.ALLOWED_TAGS, le) : D, S = De(i, "ALLOWED_ATTR") ? P({}, i.ALLOWED_ATTR, le) : ne, Qt = De(i, "ALLOWED_NAMESPACES") ? P({}, i.ALLOWED_NAMESPACES, nn) : Is, xt = De(i, "ADD_URI_SAFE_ATTR") ? P(je(Tn), i.ADD_URI_SAFE_ATTR, le) : Tn, U = De(i, "ADD_DATA_URI_TAGS") ? P(je(Ne), i.ADD_DATA_URI_TAGS, le) : Ne, re = De(i, "FORBID_CONTENTS") ? P({}, i.FORBID_CONTENTS, le) : Le, se = De(i, "FORBID_TAGS") ? P({}, i.FORBID_TAGS, le) : je({}), ue = De(i, "FORBID_ATTR") ? P({}, i.FORBID_ATTR, le) : je({}), G = De(i, "USE_PROFILES") ? i.USE_PROFILES : !1, ke = i.ALLOW_ARIA_ATTR !== !1, ee = i.ALLOW_DATA_ATTR !== !1, de = i.ALLOW_UNKNOWN_PROTOCOLS || !1, we = i.ALLOW_SELF_CLOSE_IN_ATTR !== !1, Ae = i.SAFE_FOR_TEMPLATES || !1, Ce = i.SAFE_FOR_XML !== !1, Ee = i.WHOLE_DOCUMENT || !1, Qe = i.RETURN_DOM || !1, st = i.RETURN_DOM_FRAGMENT || !1, ct = i.RETURN_TRUSTED_TYPE || !1, Ze = i.FORCE_BODY || !1, Dt = i.SANITIZE_DOM !== !1, d = i.SANITIZE_NAMED_PROPS || !1, N = i.KEEP_CONTENT !== !1, z = i.IN_PLACE || !1, nt = i.ALLOWED_URI_REGEXP || Ss, dt = i.NAMESPACE || Be, Pt = i.MATHML_TEXT_INTEGRATION_POINTS || Pt, Nt = i.HTML_INTEGRATION_POINTS || Nt, O = i.CUSTOM_ELEMENT_HANDLING || {}, i.CUSTOM_ELEMENT_HANDLING && Sn(i.CUSTOM_ELEMENT_HANDLING.tagNameCheck) && (O.tagNameCheck = i.CUSTOM_ELEMENT_HANDLING.tagNameCheck), i.CUSTOM_ELEMENT_HANDLING && Sn(i.CUSTOM_ELEMENT_HANDLING.attributeNameCheck) && (O.attributeNameCheck = i.CUSTOM_ELEMENT_HANDLING.attributeNameCheck), i.CUSTOM_ELEMENT_HANDLING && typeof i.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements == "boolean" && (O.allowCustomizedBuiltInElements = i.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements), Ae && (ee = !1), st && (Qe = !0), G && (Q = P({}, Xn), S = [], G.html === !0 && (P(Q, Yn), P(S, Jn)), G.svg === !0 && (P(Q, rn), P(S, ln), P(S, Bt)), G.svgFilters === !0 && (P(Q, on), P(S, ln), P(S, Bt)), G.mathMl === !0 && (P(Q, an), P(S, es), P(S, Bt))), i.ADD_TAGS && (typeof i.ADD_TAGS == "function" ? ce.tagCheck = i.ADD_TAGS : (Q === D && (Q = je(Q)), P(Q, i.ADD_TAGS, le))), i.ADD_ATTR && (typeof i.ADD_ATTR == "function" ? ce.attributeCheck = i.ADD_ATTR : (S === ne && (S = je(S)), P(S, i.ADD_ATTR, le))), i.ADD_URI_SAFE_ATTR && P(xt, i.ADD_URI_SAFE_ATTR, le), i.FORBID_CONTENTS && (re === Le && (re = je(re)), P(re, i.FORBID_CONTENTS, le)), N && (Q["#text"] = !0), Ee && P(Q, ["html", "head", "body"]), Q.table && (P(Q, ["tbody"]), delete se.tbody), i.TRUSTED_TYPES_POLICY) {
        if (typeof i.TRUSTED_TYPES_POLICY.createHTML != "function")
          throw At('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
        if (typeof i.TRUSTED_TYPES_POLICY.createScriptURL != "function")
          throw At('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
        _ = i.TRUSTED_TYPES_POLICY, H = _.createHTML("");
      } else
        _ === void 0 && (_ = fo(v, r)), _ !== null && typeof H == "string" && (H = _.createHTML(""));
      ye && ye(i), pt = i;
    }
  }, An = P({}, [...rn, ...on, ...to]), Cn = P({}, [...an, ...no]), Ps = function(i) {
    let g = E(i);
    (!g || !g.tagName) && (g = {
      namespaceURI: dt,
      tagName: "template"
    });
    const C = Ut(i.tagName), V = Ut(g.tagName);
    return Qt[i.namespaceURI] ? i.namespaceURI === $t ? g.namespaceURI === Be ? C === "svg" : g.namespaceURI === Ot ? C === "svg" && (V === "annotation-xml" || Pt[V]) : !!An[C] : i.namespaceURI === Ot ? g.namespaceURI === Be ? C === "math" : g.namespaceURI === $t ? C === "math" && Nt[V] : !!Cn[C] : i.namespaceURI === Be ? g.namespaceURI === $t && !Nt[V] || g.namespaceURI === Ot && !Pt[V] ? !1 : !Cn[C] && (Ls[C] || !An[C]) : !!(kt === "application/xhtml+xml" && Qt[i.namespaceURI]) : !1;
  }, ze = function(i) {
    Tt(e.removed, {
      element: i
    });
    try {
      E(i).removeChild(i);
    } catch {
      h(i);
    }
  }, rt = function(i, g) {
    try {
      Tt(e.removed, {
        attribute: g.getAttributeNode(i),
        from: g
      });
    } catch {
      Tt(e.removed, {
        attribute: null,
        from: g
      });
    }
    if (g.removeAttribute(i), i === "is")
      if (Qe || st)
        try {
          ze(g);
        } catch {
        }
      else
        try {
          g.setAttribute(i, "");
        } catch {
        }
  }, En = function(i) {
    let g = null, C = null;
    if (Ze)
      i = "<remove></remove>" + i;
    else {
      const oe = sn(i, /^[\r\n\t ]+/);
      C = oe && oe[0];
    }
    kt === "application/xhtml+xml" && dt === Be && (i = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + i + "</body></html>");
    const V = _ ? _.createHTML(i) : i;
    if (dt === Be)
      try {
        g = new y().parseFromString(V, kt);
      } catch {
      }
    if (!g || !g.documentElement) {
      g = X.createDocument(dt, "template", null);
      try {
        g.documentElement.innerHTML = Zt ? H : V;
      } catch {
      }
    }
    const he = g.body || g.documentElement;
    return i && C && he.insertBefore(t.createTextNode(C), he.childNodes[0] || null), dt === Be ? Se.call(g, Ee ? "html" : "body")[0] : Ee ? g.documentElement : he;
  }, _n = function(i) {
    return te.call(
      i.ownerDocument || i,
      i,
      // eslint-disable-next-line no-bitwise
      p.SHOW_ELEMENT | p.SHOW_COMMENT | p.SHOW_TEXT | p.SHOW_PROCESSING_INSTRUCTION | p.SHOW_CDATA_SECTION,
      null
    );
  }, Xt = function(i) {
    return i instanceof k && (typeof i.nodeName != "string" || typeof i.textContent != "string" || typeof i.removeChild != "function" || !(i.attributes instanceof f) || typeof i.removeAttribute != "function" || typeof i.setAttribute != "function" || typeof i.namespaceURI != "string" || typeof i.insertBefore != "function" || typeof i.hasChildNodes != "function");
  }, Rn = function(i) {
    return typeof l == "function" && i instanceof l;
  };
  function Ue(R, i, g) {
    Ft(R, (C) => {
      C.call(e, i, g, pt);
    });
  }
  const Mn = function(i) {
    let g = null;
    if (Ue(Z.beforeSanitizeElements, i, null), Xt(i))
      return ze(i), !0;
    const C = le(i.nodeName);
    if (Ue(Z.uponSanitizeElement, i, {
      tagName: C,
      allowedTags: Q
    }), Ce && i.hasChildNodes() && !Rn(i.firstElementChild) && me(/<[/\w!]/g, i.innerHTML) && me(/<[/\w!]/g, i.textContent) || i.nodeType === Et.progressingInstruction || Ce && i.nodeType === Et.comment && me(/<[/\w]/g, i.data))
      return ze(i), !0;
    if (!(ce.tagCheck instanceof Function && ce.tagCheck(C)) && (!Q[C] || se[C])) {
      if (!se[C] && Ln(C) && (O.tagNameCheck instanceof RegExp && me(O.tagNameCheck, C) || O.tagNameCheck instanceof Function && O.tagNameCheck(C)))
        return !1;
      if (N && !re[C]) {
        const V = E(i) || i.parentNode, he = M(i) || i.childNodes;
        if (he && V) {
          const oe = he.length;
          for (let be = oe - 1; be >= 0; --be) {
            const qe = I(he[be], !0);
            qe.__removalCount = (i.__removalCount || 0) + 1, V.insertBefore(qe, A(i));
          }
        }
      }
      return ze(i), !0;
    }
    return i instanceof c && !Ps(i) || (C === "noscript" || C === "noembed" || C === "noframes") && me(/<\/no(script|embed|frames)/i, i.innerHTML) ? (ze(i), !0) : (Ae && i.nodeType === Et.text && (g = i.textContent, Ft([L, J, ge], (V) => {
      g = St(g, V, " ");
    }), i.textContent !== g && (Tt(e.removed, {
      element: i.cloneNode()
    }), i.textContent = g)), Ue(Z.afterSanitizeElements, i, null), !1);
  }, In = function(i, g, C) {
    if (Dt && (g === "id" || g === "name") && (C in t || C in $s))
      return !1;
    if (!(ee && !ue[g] && me(Ke, g))) {
      if (!(ke && me(Pe, g))) {
        if (!(ce.attributeCheck instanceof Function && ce.attributeCheck(g, i))) {
          if (!S[g] || ue[g]) {
            if (
              // First condition does a very basic check if a) it's basically a valid custom element tagname AND
              // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
              // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
              !(Ln(i) && (O.tagNameCheck instanceof RegExp && me(O.tagNameCheck, i) || O.tagNameCheck instanceof Function && O.tagNameCheck(i)) && (O.attributeNameCheck instanceof RegExp && me(O.attributeNameCheck, g) || O.attributeNameCheck instanceof Function && O.attributeNameCheck(g, i)) || // Alternative, second condition checks if it's an `is`-attribute, AND
              // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
              g === "is" && O.allowCustomizedBuiltInElements && (O.tagNameCheck instanceof RegExp && me(O.tagNameCheck, C) || O.tagNameCheck instanceof Function && O.tagNameCheck(C)))
            ) return !1;
          } else if (!xt[g]) {
            if (!me(nt, St(C, et, ""))) {
              if (!((g === "src" || g === "xlink:href" || g === "href") && i !== "script" && Yr(C, "data:") === 0 && U[i])) {
                if (!(de && !me(Ie, St(C, et, "")))) {
                  if (C)
                    return !1;
                }
              }
            }
          }
        }
      }
    }
    return !0;
  }, Ln = function(i) {
    return i !== "annotation-xml" && sn(i, tt);
  }, Dn = function(i) {
    Ue(Z.beforeSanitizeAttributes, i, null);
    const {
      attributes: g
    } = i;
    if (!g || Xt(i))
      return;
    const C = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: S,
      forceKeepAttr: void 0
    };
    let V = g.length;
    for (; V--; ) {
      const he = g[V], {
        name: oe,
        namespaceURI: be,
        value: qe
      } = he, ft = le(oe), Jt = qe;
      let pe = oe === "value" ? Jt : Xr(Jt);
      if (C.attrName = ft, C.attrValue = pe, C.keepAttr = !0, C.forceKeepAttr = void 0, Ue(Z.uponSanitizeAttribute, i, C), pe = C.attrValue, d && (ft === "id" || ft === "name") && (rt(oe, i), pe = m + pe), Ce && me(/((--!?|])>)|<\/(style|title|textarea)/i, pe)) {
        rt(oe, i);
        continue;
      }
      if (ft === "attributename" && sn(pe, "href")) {
        rt(oe, i);
        continue;
      }
      if (C.forceKeepAttr)
        continue;
      if (!C.keepAttr) {
        rt(oe, i);
        continue;
      }
      if (!we && me(/\/>/i, pe)) {
        rt(oe, i);
        continue;
      }
      Ae && Ft([L, J, ge], ($n) => {
        pe = St(pe, $n, " ");
      });
      const On = le(i.nodeName);
      if (!In(On, ft, pe)) {
        rt(oe, i);
        continue;
      }
      if (_ && typeof v == "object" && typeof v.getAttributeType == "function" && !be)
        switch (v.getAttributeType(On, ft)) {
          case "TrustedHTML": {
            pe = _.createHTML(pe);
            break;
          }
          case "TrustedScriptURL": {
            pe = _.createScriptURL(pe);
            break;
          }
        }
      if (pe !== Jt)
        try {
          be ? i.setAttributeNS(be, oe, pe) : i.setAttribute(oe, pe), Xt(i) ? ze(i) : Qn(e.removed);
        } catch {
          rt(oe, i);
        }
    }
    Ue(Z.afterSanitizeAttributes, i, null);
  }, Ns = function R(i) {
    let g = null;
    const C = _n(i);
    for (Ue(Z.beforeSanitizeShadowDOM, i, null); g = C.nextNode(); )
      Ue(Z.uponSanitizeShadowNode, g, null), Mn(g), Dn(g), g.content instanceof o && R(g.content);
    Ue(Z.afterSanitizeShadowDOM, i, null);
  };
  return e.sanitize = function(R) {
    let i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, g = null, C = null, V = null, he = null;
    if (Zt = !R, Zt && (R = "<!-->"), typeof R != "string" && !Rn(R))
      if (typeof R.toString == "function") {
        if (R = R.toString(), typeof R != "string")
          throw At("dirty is not a string, aborting");
      } else
        throw At("toString is not a function");
    if (!e.isSupported)
      return R;
    if (Ve || Yt(i), e.removed = [], typeof R == "string" && (z = !1), z) {
      if (R.nodeName) {
        const qe = le(R.nodeName);
        if (!Q[qe] || se[qe])
          throw At("root node is forbidden and cannot be sanitized in-place");
      }
    } else if (R instanceof l)
      g = En("<!---->"), C = g.ownerDocument.importNode(R, !0), C.nodeType === Et.element && C.nodeName === "BODY" || C.nodeName === "HTML" ? g = C : g.appendChild(C);
    else {
      if (!Qe && !Ae && !Ee && // eslint-disable-next-line unicorn/prefer-includes
      R.indexOf("<") === -1)
        return _ && ct ? _.createHTML(R) : R;
      if (g = En(R), !g)
        return Qe ? null : ct ? H : "";
    }
    g && Ze && ze(g.firstChild);
    const oe = _n(z ? R : g);
    for (; V = oe.nextNode(); )
      Mn(V), Dn(V), V.content instanceof o && Ns(V.content);
    if (z)
      return R;
    if (Qe) {
      if (st)
        for (he = ie.call(g.ownerDocument); g.firstChild; )
          he.appendChild(g.firstChild);
      else
        he = g;
      return (S.shadowroot || S.shadowrootmode) && (he = Ge.call(n, he, !0)), he;
    }
    let be = Ee ? g.outerHTML : g.innerHTML;
    return Ee && Q["!doctype"] && g.ownerDocument && g.ownerDocument.doctype && g.ownerDocument.doctype.name && me(As, g.ownerDocument.doctype.name) && (be = "<!DOCTYPE " + g.ownerDocument.doctype.name + `>
` + be), Ae && Ft([L, J, ge], (qe) => {
      be = St(be, qe, " ");
    }), _ && ct ? _.createHTML(be) : be;
  }, e.setConfig = function() {
    let R = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    Yt(R), Ve = !0;
  }, e.clearConfig = function() {
    pt = null, Ve = !1;
  }, e.isValidAttribute = function(R, i, g) {
    pt || Yt({});
    const C = le(R), V = le(i);
    return In(C, V, g);
  }, e.addHook = function(R, i) {
    typeof i == "function" && Tt(Z[R], i);
  }, e.removeHook = function(R, i) {
    if (i !== void 0) {
      const g = Zr(Z[R], i);
      return g === -1 ? void 0 : Qr(Z[R], g, 1)[0];
    }
    return Qn(Z[R]);
  }, e.removeHooks = function(R) {
    Z[R] = [];
  }, e.removeAllHooks = function() {
    Z = ns();
  }, e;
}
var ho = Cs();
function go() {
  return {
    parseMarkdown: (e) => {
      if (!e || typeof e != "string")
        return "";
      const t = ls(e), n = B.parse(t, {
        async: !1,
        breaks: !0,
        gfm: !0
      });
      return ho.sanitize(n, {
        ALLOWED_TAGS: [
          "p",
          "br",
          "strong",
          "em",
          "b",
          "i",
          "code",
          "pre",
          "ul",
          "ol",
          "li",
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "a",
          "blockquote",
          "span",
          "div",
          "table",
          "thead",
          "tbody",
          "tr",
          "th",
          "td"
        ],
        ALLOWED_ATTR: ["href", "class", "target", "rel", "data-mention-id", "data-mention-type"],
        ALLOW_UNKNOWN_PROTOCOLS: !1,
        FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover"],
        KEEP_CONTENT: !0
      });
    }
  };
}
function ti() {
  let s = null;
  function e(o) {
    const a = o || document.querySelector("[data-rai-chat-container]");
    a && requestAnimationFrame(() => {
      a.scrollTo({
        top: a.scrollHeight,
        behavior: "smooth"
      });
    });
  }
  function t(o, a = 100) {
    const { scrollTop: l, scrollHeight: c, clientHeight: p } = o;
    return c - l - p < a;
  }
  function n(o) {
    o && (r(), s = new MutationObserver(() => {
      (o.scrollTop === 0 || t(o)) && requestAnimationFrame(() => {
        o.scrollTo({
          top: o.scrollHeight,
          behavior: "smooth"
        });
      });
    }), s.observe(o, {
      childList: !0,
      subtree: !0
    }));
  }
  function r() {
    s && (s.disconnect(), s = null);
  }
  return Gt(() => {
    r();
  }), {
    scrollToBottom: e,
    setupAutoScroll: n,
    cleanupAutoScroll: r
  };
}
function ni() {
  const s = yt(), e = q(() => s.error), t = q(() => {
    var o, a;
    return ((o = e.value) == null ? void 0 : o.message) !== null && ((a = e.value) == null ? void 0 : a.message) !== void 0;
  });
  return {
    errorState: e,
    hasError: t,
    retry: async () => await s.retry(),
    clearError: () => {
      s.clearError();
    }
  };
}
function Es() {
  const s = yt(), e = q(() => s.pageContext);
  function t(o) {
    s.setPageContext(o);
  }
  function n() {
    s.setPageContext(null);
  }
  function r(o) {
    const a = s.pageContext;
    a && s.setPageContext({
      ...a,
      ...o,
      metadata: {
        ...a.metadata,
        ...o.metadata
      }
    });
  }
  return {
    context: e,
    setContext: t,
    clearContext: n,
    updateContext: r
  };
}
const Fe = [], _s = {
  id: "default",
  matcher: () => !0,
  priority: 0,
  getSuggestions: () => {
    const s = ae();
    return (s == null ? void 0 : s.defaultSuggestions) || [];
  }
};
function mo() {
  Fe.length = 0;
  const s = ae();
  s != null && s.suggestionProviders && Fe.push(...s.suggestionProviders), Fe.push(_s);
}
function yo(s, e) {
  const t = [...Fe].sort((n, r) => (r.priority || 0) - (n.priority || 0));
  for (const n of t)
    if (n.matcher && n.matcher(s, e) || n.routes && n.routes.some((o) => o.endsWith("*") ? s.startsWith(o.slice(0, -1)) : s === o || s.startsWith(o + "/")))
      return n;
  return _s;
}
function xo(s, e) {
  Fe.length === 0 && mo();
  const t = yo(s, e), n = e || {
    pageType: "default",
    routePath: s
  };
  return t.extractContext && (n.metadata = {
    ...n.metadata,
    ...t.extractContext(s)
  }), t.getSuggestions(n) || [];
}
function ko(s) {
  const e = Fe.findIndex((t) => t.id === s.id);
  if (e >= 0)
    Fe[e] = s;
  else {
    const t = Fe.findIndex((n) => n.id === "default");
    t >= 0 ? Fe.splice(t, 0, s) : Fe.push(s);
  }
}
const si = ko;
function Rs() {
  const { context: s } = Es(), e = yt(), t = q(() => {
    var c;
    if (e.quota.remaining === 0) {
      const p = ae();
      return (p == null ? void 0 : p.enableSupportMode) !== !1 ? [
        {
          id: "contact-support-quota",
          title: fe("contactSupport"),
          description: fe("noQuota"),
          prompt: "I need help with my account",
          className: "rai-suggestion--warning",
          isSupportRequest: !0
        }
      ] : [];
    }
    const o = ((c = s.value) == null ? void 0 : c.routePath) || (typeof window < "u" ? window.location.pathname : "/"), a = xo(o, s.value) || [], l = ae();
    return l != null && l.can ? a.filter((p) => !(p.permission && !l.can(p.permission))) : a;
  }), n = q(() => s.value !== null && s.value.pageType !== "default");
  function r(o) {
    return typeof o.prompt == "function" ? o.prompt(
      s.value || { pageType: "default" }
    ) : o.prompt;
  }
  return {
    suggestions: t,
    hasContextualSuggestions: n,
    resolvePrompt: r
  };
}
function ri(s, e) {
  const { setContext: t, clearContext: n, updateContext: r } = Es();
  function o() {
    if (!e)
      return {};
    const l = {};
    for (const [c, p] of Object.entries(e))
      l[c] = Fs(p) ? p.value : p;
    return l;
  }
  function a() {
    const l = {
      pageType: s,
      routePath: typeof window < "u" ? window.location.pathname : void 0,
      metadata: o()
    };
    t(l);
  }
  return Kt(() => {
    a();
  }), Gt(() => {
    n();
  }), e && ot(
    () => o(),
    (l) => {
      r({ metadata: l });
    },
    { deep: !0 }
  ), {
    setupContext: a
  };
}
function bo(s) {
  const e = s.toLowerCase().split("+");
  return {
    key: e.pop() || "",
    meta: e.includes("cmd") || e.includes("meta") || e.includes("command"),
    ctrl: e.includes("ctrl") || e.includes("control"),
    shift: e.includes("shift"),
    alt: e.includes("alt") || e.includes("option")
  };
}
function wo(s, e) {
  const t = s.key.toLowerCase(), n = e.meta ? s.metaKey : !s.metaKey, r = e.ctrl ? s.ctrlKey : !s.ctrlKey, o = e.shift ? s.shiftKey : !s.shiftKey, a = e.alt ? s.altKey : !s.altKey;
  let l = n && r && o && a;
  return (e.meta && !e.ctrl || !e.meta && e.ctrl) && (l = (s.metaKey || s.ctrlKey) && o && a), t === e.key && l;
}
function vo(s) {
  const { onToggle: e, enabled: t = !0 } = s, n = K(!1), r = s.shortcut !== void 0 ? s.shortcut : mt("keyboardShortcut") ?? "cmd+g";
  if (r === null)
    return { isActive: n };
  const o = bo(r);
  function a(l) {
    if (!t) return;
    const c = l.target, p = c.tagName === "INPUT" || c.tagName === "TEXTAREA", f = c.isContentEditable, k = c.closest("[data-ai-input]");
    (p || f) && !k || wo(l, o) && (l.preventDefault(), l.stopPropagation(), n.value = !n.value, e());
  }
  return Kt(() => {
    window.addEventListener("keydown", a, !0);
  }), Gt(() => {
    window.removeEventListener("keydown", a, !0);
  }), { isActive: n };
}
function oi(s) {
  return vo({
    onToggle: () => {
      s.value = !s.value;
    }
  });
}
const To = /* @__PURE__ */ Je({
  __name: "AiAvatar",
  props: {
    ui: {}
  },
  setup(s) {
    return (e, t) => {
      var n;
      return x(), T("div", {
        class: w(["w-6 h-6 min-w-[24px] flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600", (n = s.ui) == null ? void 0 : n.container])
      }, [
        Oe(e.$slots, "default", {}, () => {
          var r;
          return [
            (x(), T("svg", {
              class: w(["w-4 h-4 text-gray-400 dark:text-gray-500", (r = s.ui) == null ? void 0 : r.icon]),
              fill: "none",
              viewBox: "0 0 24 24",
              stroke: "currentColor",
              "stroke-width": "1.5"
            }, [...t[0] || (t[0] = [
              u("path", {
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                d: "M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
              }, null, -1)
            ])], 2))
          ];
        })
      ], 2);
    };
  }
}), ai = /* @__PURE__ */ Je({
  __name: "UserAvatar",
  props: {
    ui: {}
  },
  setup(s) {
    return (e, t) => {
      var n;
      return x(), T("div", {
        class: w(["w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0", (n = s.ui) == null ? void 0 : n.container])
      }, [
        Oe(e.$slots, "default", {}, () => {
          var r;
          return [
            (x(), T("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              viewBox: "0 0 24 24",
              fill: "currentColor",
              class: w(["w-5 h-5 text-gray-500 dark:text-gray-400", (r = s.ui) == null ? void 0 : r.icon])
            }, [...t[0] || (t[0] = [
              u("path", {
                "fill-rule": "evenodd",
                d: "M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z",
                "clip-rule": "evenodd"
              }, null, -1)
            ])], 2))
          ];
        })
      ], 2);
    };
  }
}), So = ["onClick", "onMouseenter"], Ao = /* @__PURE__ */ Je({
  __name: "MentionList",
  props: {
    items: {},
    selectedIndex: { default: 0 },
    providers: { default: () => [] },
    ui: {},
    texts: {}
  },
  emits: ["select", "update:selectedIndex"],
  setup(s, { emit: e }) {
    const t = s, n = q(() => t.ui || {}), r = e, o = K(t.selectedIndex);
    ot(() => t.selectedIndex, (h) => {
      o.value = h;
    }), ot(o, (h) => {
      r("update:selectedIndex", h);
    });
    const a = q(() => {
      const h = {};
      return t.items.forEach((A) => {
        const M = A.type || "default";
        h[M] || (h[M] = []), h[M].push(A);
      }), h;
    });
    function l(h) {
      return t.providers.find((A) => A.type === h) || ds(h);
    }
    function c(h) {
      const A = l(h);
      return (A == null ? void 0 : A.label) || h.charAt(0).toUpperCase() + h.slice(1) + "s";
    }
    function p(h, A) {
      let M = 0;
      const E = Object.keys(a.value);
      for (const _ of E) {
        if (_ === h)
          return M + A;
        M += a.value[_].length;
      }
      return M;
    }
    function f(h) {
      r("select", h);
    }
    function k(h) {
      o.value = h, r("update:selectedIndex", h);
    }
    function y(h) {
      const A = l(h.type);
      return gn(h, A);
    }
    function v(h) {
      const A = l(h.type);
      return cs(h, A);
    }
    function b(h) {
      const A = {
        employee: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
        job: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
        candidate: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
        project: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
        default: "bg-primary/10 text-primary"
      };
      return A[h] || A.default;
    }
    function I(h) {
      return h.split(" ").map((A) => A[0]).join("").slice(0, 2).toUpperCase();
    }
    return (h, A) => s.items.length > 0 ? (x(), T("div", {
      key: 0,
      class: w(["absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg max-h-60 overflow-y-auto z-50", n.value.root])
    }, [
      u("div", {
        class: w(["p-2", n.value.container])
      }, [
        (x(!0), T($e, null, Xe(a.value, (M, E) => (x(), T($e, { key: E }, [
          Object.keys(a.value).length > 1 ? (x(), T("div", {
            key: 0,
            class: w(["px-3 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide", n.value.groupHeader])
          }, $(c(E)), 3)) : F("", !0),
          (x(!0), T($e, null, Xe(M, (_, H) => (x(), T("button", {
            key: _.id,
            type: "button",
            class: w(["w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors mb-0.5", [
              n.value.item,
              {
                [n.value.itemSelected || "bg-primary/10"]: p(E, H) === o.value,
                "hover:bg-gray-50 dark:hover:bg-gray-700": p(E, H) !== o.value
              }
            ]]),
            onClick: (X) => f(_),
            onMouseenter: (X) => k(p(E, H))
          }, [
            Oe(h.$slots, "item-icon", {
              item: _,
              type: E
            }, () => [
              u("span", {
                class: w(["w-8 h-8 flex items-center justify-center rounded-full text-xs font-semibold flex-shrink-0", [n.value.itemIcon, b(_.type)]])
              }, $(I(y(_))), 3)
            ]),
            u("div", {
              class: w(["flex-1 min-w-0", n.value.itemContent])
            }, [
              u("p", {
                class: w(["text-sm font-medium text-gray-900 dark:text-gray-100 truncate", n.value.itemName])
              }, $(y(_)), 3),
              v(_) ? (x(), T("p", {
                key: 0,
                class: w(["text-xs text-gray-500 dark:text-gray-400 truncate", n.value.itemSubtitle])
              }, $(v(_)), 3)) : F("", !0)
            ], 2)
          ], 42, So))), 128))
        ], 64))), 128))
      ], 2)
    ], 2)) : F("", !0);
  }
}), Co = ["title"], Eo = {
  key: 0,
  class: "w-4 h-4 text-gray-500 dark:text-gray-400",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor"
}, _o = /* @__PURE__ */ Je({
  __name: "ChatMessageActions",
  props: {
    message: {},
    ui: {},
    texts: {}
  },
  emits: ["copy"],
  setup(s, { emit: e }) {
    const t = s, n = e, r = (c) => {
      var f;
      return (f = t.texts) != null && f[c] ? t.texts[c] : fe({
        copyToClipboard: "copyToClipboard",
        copied: "copied"
      }[c]);
    }, o = q(() => t.ui || {}), a = K(!1);
    async function l() {
      try {
        await navigator.clipboard.writeText(t.message.message), a.value = !0, n("copy", t.message), setTimeout(() => {
          a.value = !1;
        }, 2e3);
      } catch (c) {
        console.error("Failed to copy:", c);
      }
    }
    return (c, p) => (x(), T("div", {
      class: w(["flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity", o.value.container])
    }, [
      u("button", {
        type: "button",
        class: w(["p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors", [o.value.button, o.value.copyButton]]),
        title: a.value ? r("copied") : r("copyToClipboard"),
        onClick: l
      }, [
        a.value ? (x(), T("svg", {
          key: 1,
          class: w(["w-4 h-4 text-green-500", o.value.successState]),
          fill: "none",
          viewBox: "0 0 24 24",
          stroke: "currentColor"
        }, [...p[1] || (p[1] = [
          u("path", {
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "stroke-width": "2",
            d: "M5 13l4 4L19 7"
          }, null, -1)
        ])], 2)) : (x(), T("svg", Eo, [...p[0] || (p[0] = [
          u("path", {
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "stroke-width": "1.5",
            d: "M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
          }, null, -1)
        ])]))
      ], 10, Co)
    ], 2));
  }
}), Ro = { class: "h-12 w-12 flex items-center justify-center rounded-lg bg-white/20 overflow-hidden" }, Mo = ["src"], Io = {
  key: 1,
  class: "w-5 h-5 text-white",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor"
}, Lo = { class: "flex-1 min-w-0" }, Do = { class: "text-sm font-semibold text-white truncate" }, Oo = { class: "text-xs text-white/70" }, $o = {
  key: 0,
  class: "text-xs font-medium text-white/90"
}, Po = { class: "flex-shrink-0 mt-0.5" }, No = { class: "text-gray-600 dark:text-gray-400" }, zo = ["id", "innerHTML"], Ho = { class: "h-12 w-12 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 overflow-hidden border border-gray-200 dark:border-gray-600" }, Fo = ["src"], Bo = {
  key: 1,
  class: "w-5 h-5 text-gray-500 dark:text-gray-400",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor"
}, Uo = { class: "flex-1 min-w-0" }, qo = { class: "text-sm font-semibold text-gray-800 dark:text-gray-200 truncate" }, jo = { class: "text-xs text-gray-500 dark:text-gray-400" }, Wo = {
  key: 0,
  class: "text-xs font-medium text-primary"
}, Go = /* @__PURE__ */ Je({
  __name: "ChatMessage",
  props: {
    message: {},
    showActions: { type: Boolean, default: !0 },
    loadingText: { default: "Gathering data..." },
    ui: {},
    texts: {}
  },
  emits: ["copy"],
  setup(s, { emit: e }) {
    const t = s, n = e, r = (h) => {
      var M;
      return (M = t.texts) != null && M[h] ? t.texts[h] : {
        loadingText: "Gathering data...",
        showMore: "Show more",
        showLess: "Show less",
        openAttachment: "Open",
        attachment: "Attachment"
      }[h] || h;
    }, o = q(() => t.ui || {}), { parseMarkdown: a } = go(), l = K(!1), c = q(() => t.message.attachments ?? []), p = q(() => c.value.length > 0), f = q(() => {
      if (t.message.role !== "user") return !1;
      const h = t.message.message || "", A = h.split(`
`).length;
      return h.length > 200 || A > 4;
    });
    function k() {
      l.value = !l.value;
    }
    function y(h) {
      return (h.type || "").startsWith("image/") ? !0 : /(png|jpe?g|gif|webp)$/i.test(h.name || "");
    }
    function v(h) {
      if (h == null) return "";
      const A = typeof h == "string" ? parseInt(h, 10) : h;
      return Number.isNaN(A) ? "" : A >= 1024 * 1024 ? `${(A / (1024 * 1024)).toFixed(1)} MB` : A >= 1024 ? `${Math.round(A / 1024)} KB` : `${A} B`;
    }
    const b = q(() => {
      if (t.message.role === "assistant") {
        let h = t.message.message;
        return h = h.replace(/\\n/g, `
`), a(h);
      }
      return t.message.message;
    });
    function I(h) {
      n("copy", h);
    }
    return (h, A) => {
      var M;
      return x(), T("div", {
        class: w(["group relative animate-in fade-in slide-in-from-bottom-2 duration-300", [
          o.value.root,
          {
            "flex justify-end": s.message.role === "user",
            "flex justify-start": s.message.role === "assistant"
          }
        ]])
      }, [
        s.message.role === "user" ? (x(), T("div", {
          key: 0,
          class: w(["flex gap-3 justify-end", o.value.userMessage])
        }, [
          u("div", {
            class: w(["rounded-2xl px-4 py-3 bg-primary text-white max-w-fit", o.value.userBubble])
          }, [
            s.message.message ? (x(), T("p", {
              key: 0,
              class: w(["text-sm whitespace-pre-wrap", [o.value.content, { "line-clamp-4": !l.value && f.value }]])
            }, $(s.message.message), 3)) : F("", !0),
            f.value ? (x(), T("button", {
              key: 1,
              class: w(["mt-2 text-xs text-white/80 hover:text-white underline", o.value.showMoreButton]),
              onClick: k
            }, $(l.value ? r("showLess") : r("showMore")), 3)) : F("", !0),
            p.value ? (x(), T("div", {
              key: 2,
              class: w(["mt-3 space-y-2", o.value.attachmentsContainer])
            }, [
              (x(!0), T($e, null, Xe(c.value, (E) => (x(), gt(un(E.url ? "a" : "div"), {
                key: E.id,
                href: E.url || void 0,
                target: E.url ? "_blank" : void 0,
                rel: "noopener noreferrer",
                class: w(["flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 p-2 transition", [o.value.attachmentItem, E.url ? "hover:bg-white/20 cursor-pointer" : ""]])
              }, {
                default: Ye(() => [
                  u("div", Ro, [
                    E.url && y(E) ? (x(), T("img", {
                      key: 0,
                      src: E.url,
                      class: "object-cover h-full w-full",
                      alt: ""
                    }, null, 8, Mo)) : (x(), T("svg", Io, [...A[0] || (A[0] = [
                      u("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "1.5",
                        d: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                      }, null, -1)
                    ])]))
                  ]),
                  u("div", Lo, [
                    u("p", Do, $(E.name || r("attachment")), 1),
                    u("p", Oo, $(v(E.size)), 1)
                  ]),
                  E.url ? (x(), T("span", $o, $(r("openAttachment")), 1)) : F("", !0)
                ]),
                _: 2
              }, 1032, ["href", "target", "class"]))), 128))
            ], 2)) : F("", !0)
          ], 2),
          u("div", {
            class: w(["flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary", o.value.userAvatar])
          }, [...A[1] || (A[1] = [
            u("svg", {
              class: "h-4 w-4 text-white",
              viewBox: "0 0 24 24",
              fill: "currentColor"
            }, [
              u("path", {
                "fill-rule": "evenodd",
                d: "M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z",
                "clip-rule": "evenodd"
              })
            ], -1)
          ])], 2)
        ], 2)) : (x(), T("div", {
          key: 1,
          class: w(["flex items-start gap-3", o.value.assistantMessage])
        }, [
          u("div", Po, [
            We(To)
          ]),
          u("div", {
            class: w(["bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-5 py-4 shadow-sm rounded-2xl transition-all duration-200 flex-1", o.value.assistantBubble])
          }, [
            s.message.loading ? (x(), T("div", {
              key: 0,
              class: w(["flex items-center gap-2 text-sm min-w-[150px]", o.value.loadingIndicator])
            }, [
              u("div", {
                class: w(["flex space-x-1", o.value.loadingDots])
              }, [...A[2] || (A[2] = [
                u("div", {
                  class: "w-2 h-2 bg-gray-400 rounded-full animate-bounce",
                  style: { "animation-delay": "0ms" }
                }, null, -1),
                u("div", {
                  class: "w-2 h-2 bg-gray-400 rounded-full animate-bounce",
                  style: { "animation-delay": "150ms" }
                }, null, -1),
                u("div", {
                  class: "w-2 h-2 bg-gray-400 rounded-full animate-bounce",
                  style: { "animation-delay": "300ms" }
                }, null, -1)
              ])], 2),
              u("span", No, $(((M = s.texts) == null ? void 0 : M.loadingText) || s.loadingText), 1)
            ], 2)) : s.message.message ? (x(), T("div", {
              key: 1,
              id: s.message.id,
              class: w(["prose prose-sm max-w-none prose-gray dark:prose-invert", o.value.content]),
              innerHTML: b.value
            }, null, 10, zo)) : F("", !0),
            !s.message.loading && p.value ? (x(), T("div", {
              key: 2,
              class: w(["mt-4 space-y-2", o.value.attachmentsContainer])
            }, [
              (x(!0), T($e, null, Xe(c.value, (E) => (x(), gt(un(E.url ? "a" : "div"), {
                key: E.id,
                href: E.url || void 0,
                target: E.url ? "_blank" : void 0,
                rel: "noopener noreferrer",
                class: w(["flex items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3 transition", [o.value.attachmentItem, E.url ? "hover:bg-white dark:hover:bg-gray-600 cursor-pointer" : ""]])
              }, {
                default: Ye(() => [
                  u("div", Ho, [
                    E.url && y(E) ? (x(), T("img", {
                      key: 0,
                      src: E.url,
                      class: "object-cover h-full w-full",
                      alt: ""
                    }, null, 8, Fo)) : (x(), T("svg", Bo, [...A[3] || (A[3] = [
                      u("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "1.5",
                        d: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                      }, null, -1)
                    ])]))
                  ]),
                  u("div", Uo, [
                    u("p", qo, $(E.name || r("attachment")), 1),
                    u("p", jo, $(v(E.size)), 1)
                  ]),
                  E.url ? (x(), T("span", Wo, $(r("openAttachment")), 1)) : F("", !0)
                ]),
                _: 2
              }, 1032, ["href", "target", "class"]))), 128))
            ], 2)) : F("", !0)
          ], 2)
        ], 2)),
        s.message.role === "assistant" && !s.message.loading && !s.message.streaming && s.showActions ? (x(), gt(_o, {
          key: 2,
          message: s.message,
          class: w(["absolute -bottom-8 left-14", o.value.actionsContainer]),
          onCopy: I
        }, null, 8, ["message", "class"])) : F("", !0)
      ], 2);
    };
  }
}), Ms = (s, e) => {
  const t = s.__vccOpts || s;
  for (const [n, r] of e)
    t[n] = r;
  return t;
}, Ko = /* @__PURE__ */ Ms(Go, [["__scopeId", "data-v-57c4164f"]]), Vo = { class: "max-w-3xl mx-auto space-y-3" }, Zo = ["accept"], Qo = { class: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide" }, Yo = { class: "space-y-2" }, Xo = ["src"], Jo = {
  key: 1,
  class: "w-5 h-5 text-gray-500 dark:text-gray-400",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor"
}, ea = { class: "flex-1 min-w-0" }, ta = { class: "text-sm font-medium text-gray-800 dark:text-gray-200 truncate" }, na = { class: "text-xs text-gray-500 dark:text-gray-400" }, sa = {
  key: 0,
  class: "mt-1 h-1 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden"
}, ra = {
  key: 0,
  class: "text-xs text-gray-400"
}, oa = ["disabled", "onClick"], aa = { class: "py-1" }, ia = ["onClick", "onMouseenter"], la = { class: "flex items-start gap-3" }, ua = { class: "flex-1 min-w-0" }, ca = { class: "text-sm font-medium text-gray-900 dark:text-gray-100" }, da = { class: "text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2" }, pa = ["title"], fa = { class: "flex items-center" }, ha = ["placeholder", "disabled"], ga = { class: "absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 z-10" }, ma = ["title"], ya = ["title"], xa = ["disabled"], ka = {
  key: 0,
  class: "w-4 h-4",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor"
}, ba = {
  key: 1,
  class: "w-4 h-4",
  viewBox: "0 0 24 24",
  fill: "currentColor"
}, wa = {
  key: 0,
  class: "flex justify-center"
}, ss = 300, va = /* @__PURE__ */ Je({
  __name: "ChatInput",
  props: {
    modelValue: {},
    disabled: { type: Boolean, default: !1 },
    sending: { type: Boolean, default: !1 },
    placeholder: { default: "Ask me anything..." },
    supportPlaceholder: { default: "Describe your support request..." },
    minLength: { default: 3 },
    suggestions: { default: () => [] },
    hasHistory: { type: Boolean, default: !1 },
    supportRequestMode: { type: Boolean, default: !1 },
    showSupportModeToggle: { type: Boolean, default: !1 },
    contextLinkText: { default: "" },
    ui: {},
    texts: {}
  },
  emits: ["update:modelValue", "submit", "cancel", "suggestion-select", "toggle-support-mode", "context-link-click"],
  setup(s, { emit: e }) {
    const t = s, n = q(() => t.ui || {}), r = e, o = K(t.modelValue), a = K(null), l = K(null), c = K(!1), p = K(!1), f = K(0), k = K(!1), y = K(-1), v = K(null), b = K(!1), I = K([]), h = K(0), A = K({ inMention: !1, query: "", startPos: 0 }), M = K([]), E = q(() => {
      const d = ae();
      return (d == null ? void 0 : d.mentionProviders) || [];
    }), _ = K([]), H = mt("maxAttachments") || 5, X = mt("maxFileSize") || 10 * 1024 * 1024, te = mt("acceptedFileTypes") || "image/*,.pdf,.txt,.doc,.docx,.xls,.xlsx,.csv", ie = q(() => t.supportRequestMode ? t.supportPlaceholder : t.placeholder), Se = q(() => t.showSupportModeToggle ? t.supportRequestMode ? "pr-32" : "pr-24" : "pr-14");
    ot(() => t.modelValue, (d) => {
      o.value = d, He(L);
    }), ot(o, (d) => {
      r("update:modelValue", d), He(L), Ie(d);
    });
    const Ge = q(() => _.value.length > 0), Z = q(() => _.value.some((d) => d.uploading));
    function L() {
      const d = a.value;
      if (!d) return;
      d.style.height = "auto";
      const m = Math.min(d.scrollHeight, ss);
      d.style.height = `${m}px`, d.style.overflowY = d.scrollHeight > ss ? "auto" : "hidden";
    }
    const J = q(() => {
      var m;
      return (((m = o.value) == null ? void 0 : m.trim()) ?? "").length >= t.minLength ? !0 : Ge.value;
    }), ge = q(() => !t.disabled && !t.sending && J.value && !Z.value);
    function Ke() {
      L();
    }
    function Pe() {
      r("toggle-support-mode");
    }
    function Ie(d) {
      const m = a.value;
      if (!m) return;
      const N = m.selectionStart, z = us(d, N);
      A.value = z, z.inMention && z.query.length >= 0 ? et(z.query) : (b.value = !1, I.value = []);
    }
    async function et(d) {
      const m = ps();
      if (m.length === 0) {
        b.value = !1;
        return;
      }
      const N = [];
      for (const z of m)
        try {
          const G = await z.search(d);
          N.push(...G.map((re) => ({ ...re, type: z.type })));
        } catch (G) {
          console.warn(`Mention provider ${z.type} failed:`, G);
        }
      I.value = N.slice(0, 10), b.value = N.length > 0, h.value = 0;
    }
    function tt(d) {
      var re;
      const { startPos: m } = A.value, N = o.value.slice(0, m), z = o.value.slice(((re = a.value) == null ? void 0 : re.selectionStart) || m), G = d.name || d.label || d.title || d.id;
      o.value = `${N}@${G} ${z}`, M.value.push({
        id: d.id,
        name: G,
        type: d.type,
        metadata: d.attributes
      }), b.value = !1, I.value = [], He(() => {
        var U, Ne;
        (U = a.value) == null || U.focus();
        const Le = N.length + G.length + 2;
        (Ne = a.value) == null || Ne.setSelectionRange(Le, Le);
      });
    }
    function nt() {
      He(() => {
        const d = v.value;
        if (!d) return;
        const m = d.querySelector(`li:nth-child(${y.value + 1})`);
        m && m.scrollIntoView({ block: "nearest", behavior: "smooth" });
      });
    }
    function Q(d) {
      if (b.value && I.value.length > 0) {
        if (d.key === "ArrowDown") {
          d.preventDefault(), h.value = Math.min(h.value + 1, I.value.length - 1);
          return;
        }
        if (d.key === "ArrowUp") {
          d.preventDefault(), h.value = Math.max(h.value - 1, 0);
          return;
        }
        if (d.key === "Enter" || d.key === "Tab") {
          d.preventDefault();
          const m = I.value[h.value];
          m && tt(m);
          return;
        }
        if (d.key === "Escape") {
          d.preventDefault(), b.value = !1;
          return;
        }
      }
      if (k.value && t.suggestions.length > 0) {
        if (d.key === "ArrowDown") {
          d.preventDefault(), y.value = Math.min(y.value + 1, t.suggestions.length - 1), nt();
          return;
        }
        if (d.key === "ArrowUp") {
          d.preventDefault(), y.value = Math.max(y.value - 1, 0), nt();
          return;
        }
        if (d.key === "Enter" && y.value >= 0) {
          d.preventDefault();
          const m = t.suggestions[y.value];
          m && st(m);
          return;
        }
        if (d.key === "Escape") {
          d.preventDefault(), k.value = !1, y.value = -1;
          return;
        }
      }
      if (d.key === "Enter") {
        if (d.shiftKey) return;
        !t.sending && ge.value && (d.preventDefault(), D());
      }
    }
    function D() {
      if (!ge.value) return;
      const d = Ae(), m = o.value.trim(), N = [...M.value];
      r("submit", {
        message: m,
        attachments: d,
        mentions: N,
        isSupportRequest: t.supportRequestMode
      }), o.value = "", we(), M.value = [], He(L);
    }
    function S() {
      t.sending ? r("cancel") : ge.value && D();
    }
    function ne() {
      var d;
      t.disabled || t.sending || _.value.length >= H || (d = l.value) == null || d.click();
    }
    function O(d) {
      const m = d.target, N = m.files;
      N && N.length && se(N), m.value = "";
    }
    function se(d) {
      if (!d) return;
      const m = Array.from(d);
      for (const N of m) {
        if (_.value.length >= H) break;
        N.size > X || ue(N);
      }
    }
    function ue(d) {
      var Le;
      const m = crypto.randomUUID(), N = d.type.startsWith("image/") ? URL.createObjectURL(d) : void 0, z = ae(), G = !!((Le = z == null ? void 0 : z.endpoints) != null && Le.uploadFile), re = {
        id: m,
        name: d.name,
        type: d.type,
        size: d.size,
        uploading: G,
        progress: G ? 0 : 100,
        previewUrl: N
      };
      _.value.push(re), G && ce(d, m);
    }
    async function ce(d, m) {
      const N = yt();
      try {
        const z = await N.uploadFile(d), G = _.value.findIndex((re) => re.id === m);
        if (G === -1) return;
        if (z) {
          const re = _.value[G].previewUrl;
          _.value[G] = {
            ..._.value[G],
            id: z.id || m,
            url: z.url,
            extractedText: z.extractedText,
            uploading: !1,
            progress: 100,
            previewUrl: re || z.previewUrl
          };
        } else
          de(m);
      } catch {
        de(m);
      }
    }
    function ke(d) {
      return (d.type || "").startsWith("image/") ? !0 : /(png|jpe?g|gif|webp)$/i.test(d.name);
    }
    function ee(d) {
      if (d == null) return "";
      const m = typeof d == "string" ? parseInt(d, 10) : d;
      return Number.isNaN(m) ? "" : m >= 1024 * 1024 ? `${(m / (1024 * 1024)).toFixed(1)} MB` : m >= 1024 ? `${Math.round(m / 1024)} KB` : `${m} B`;
    }
    function de(d) {
      const m = _.value.findIndex((z) => z.id === d);
      if (m === -1) return;
      const [N] = _.value.splice(m, 1);
      N != null && N.previewUrl && URL.revokeObjectURL(N.previewUrl);
    }
    function we() {
      _.value.forEach((d) => {
        d.previewUrl && URL.revokeObjectURL(d.previewUrl);
      }), _.value = [];
    }
    function Ae() {
      return _.value.filter((d) => !d.uploading).map((d) => ({
        id: d.id,
        name: d.name,
        url: d.url,
        type: d.type,
        size: d.size
      }));
    }
    function Ce(d) {
      var m;
      return Array.from(((m = d.dataTransfer) == null ? void 0 : m.types) || []).includes("Files");
    }
    function Ee(d) {
      Ce(d) && (f.value += 1, p.value = !0);
    }
    function Ve(d) {
      Ce(d) || d.preventDefault();
    }
    function Ze(d) {
      Ce(d) && (f.value = Math.max(0, f.value - 1), f.value === 0 && (p.value = !1));
    }
    function Qe(d) {
      var m;
      Ce(d) && (f.value = 0, p.value = !1, se(((m = d.dataTransfer) == null ? void 0 : m.files) || null));
    }
    function st(d) {
      r("suggestion-select", d), k.value = !1, y.value = -1, He(() => {
        var m;
        return (m = a.value) == null ? void 0 : m.focus();
      });
    }
    function ct() {
      c.value = !0;
    }
    function Dt() {
      c.value = !1, setTimeout(() => {
        k.value = !1, b.value = !1, y.value = -1;
      }, 200);
    }
    return ot(o, (d) => {
      d && !t.hasHistory && c.value && t.suggestions.length > 0 ? k.value = !0 : k.value = !1;
    }), ot(() => t.suggestions, (d) => {
      o.value && !t.hasHistory && c.value && d.length > 0 ? k.value = !0 : d.length === 0 && (k.value = !1);
    }), Kt(() => {
      He(L);
    }), Bs(() => {
      we();
    }), (d, m) => {
      var N, z, G, re, Le;
      return x(), T("div", {
        class: w(["px-4 pb-4 bg-white dark:bg-gray-900 sticky bottom-0", n.value.root]),
        onDragenter: ht(Ee, ["prevent"]),
        onDragover: ht(Ve, ["prevent"]),
        onDragleave: ht(Ze, ["prevent"]),
        onDrop: ht(Qe, ["prevent"])
      }, [
        u("form", {
          onSubmit: ht(D, ["prevent"]),
          class: w(n.value.form)
        }, [
          u("div", Vo, [
            u("input", {
              ref_key: "fileInputRef",
              ref: l,
              type: "file",
              class: "hidden",
              multiple: "",
              accept: Y(te),
              onChange: O
            }, null, 40, Zo),
            _.value.length ? (x(), T("div", {
              key: 0,
              class: w(["border border-gray-200 dark:border-gray-700 rounded-2xl p-3 bg-gray-50 dark:bg-gray-800 space-y-3", n.value.attachmentsContainer])
            }, [
              u("p", Qo, $(((N = s.texts) == null ? void 0 : N.attachedFiles) || "Attached files"), 1),
              u("ul", Yo, [
                (x(!0), T($e, null, Xe(_.value, (U) => (x(), T("li", {
                  key: U.id,
                  class: w(["flex items-center gap-3 rounded-xl bg-white dark:bg-gray-700 p-2 shadow-sm border border-gray-100 dark:border-gray-600", n.value.attachmentItem])
                }, [
                  u("div", {
                    class: w(["h-10 w-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-600 overflow-hidden", n.value.attachmentThumbnail])
                  }, [
                    ke(U) ? (x(), T("img", {
                      key: 0,
                      src: U.previewUrl || U.url,
                      class: "object-cover h-full w-full",
                      alt: ""
                    }, null, 8, Xo)) : (x(), T("svg", Jo, [...m[3] || (m[3] = [
                      u("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "1.5",
                        d: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                      }, null, -1)
                    ])]))
                  ], 2),
                  u("div", ea, [
                    u("p", ta, $(U.name), 1),
                    u("p", na, $(ee(U.size)), 1),
                    U.uploading ? (x(), T("div", sa, [
                      u("div", {
                        class: "h-full bg-primary transition-all",
                        style: rs({ width: `${U.progress ?? 10}%` })
                      }, null, 4)
                    ])) : F("", !0)
                  ]),
                  U.uploading ? (x(), T("span", ra, $(Math.round(U.progress ?? 0)) + "% ", 1)) : F("", !0),
                  u("button", {
                    type: "button",
                    class: w(["p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed", n.value.attachmentRemove]),
                    disabled: U.uploading,
                    onClick: (Ne) => de(U.id)
                  }, [...m[4] || (m[4] = [
                    u("svg", {
                      class: "w-4 h-4 text-gray-500 dark:text-gray-400",
                      fill: "none",
                      viewBox: "0 0 24 24",
                      stroke: "currentColor"
                    }, [
                      u("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "1.5",
                        d: "M6 18L18 6M6 6l12 12"
                      })
                    ], -1)
                  ])], 10, oa)
                ], 2))), 128))
              ])
            ], 2)) : F("", !0),
            u("div", {
              class: w(["relative", n.value.inputContainer])
            }, [
              We(_t, {
                "enter-active-class": "transition ease-out duration-100",
                "enter-from-class": "transform opacity-0 scale-95",
                "enter-to-class": "transform opacity-100 scale-100",
                "leave-active-class": "transition ease-in duration-75",
                "leave-from-class": "transform opacity-100 scale-100",
                "leave-to-class": "transform opacity-0 scale-95"
              }, {
                default: Ye(() => [
                  k.value && s.suggestions.length > 0 ? (x(), T("div", {
                    key: 0,
                    ref_key: "dropdownRef",
                    ref: v,
                    class: w(["absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg max-h-80 overflow-y-auto z-10", n.value.suggestionsDropdown])
                  }, [
                    u("ul", aa, [
                      (x(!0), T($e, null, Xe(s.suggestions, (U, Ne) => (x(), T("li", {
                        key: U.id,
                        class: w(["px-4 py-3 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0", [
                          n.value.suggestionItem,
                          {
                            [n.value.suggestionItemSelected || "bg-primary/10"]: Ne === y.value,
                            "hover:bg-gray-50 dark:hover:bg-gray-700": Ne !== y.value
                          }
                        ]]),
                        onClick: (xt) => st(U),
                        onMouseenter: (xt) => y.value = Ne
                      }, [
                        u("div", la, [
                          u("div", ua, [
                            u("p", ca, $(U.title), 1),
                            u("p", da, $(U.description), 1)
                          ])
                        ])
                      ], 42, ia))), 128))
                    ])
                  ], 2)) : F("", !0)
                ]),
                _: 1
              }),
              We(_t, {
                "enter-active-class": "transition ease-out duration-100",
                "enter-from-class": "transform opacity-0 scale-95",
                "enter-to-class": "transform opacity-100 scale-100",
                "leave-active-class": "transition ease-in duration-75",
                "leave-from-class": "transform opacity-100 scale-100",
                "leave-to-class": "transform opacity-0 scale-95"
              }, {
                default: Ye(() => [
                  b.value && I.value.length > 0 ? (x(), gt(Ao, {
                    key: 0,
                    items: I.value,
                    "selected-index": h.value,
                    providers: E.value,
                    onSelect: tt,
                    "onUpdate:selectedIndex": m[0] || (m[0] = (U) => h.value = U)
                  }, null, 8, ["items", "selected-index", "providers"])) : F("", !0)
                ]),
                _: 1
              }),
              u("div", {
                class: w(["rounded-2xl border shadow-lg transition-all duration-200 bg-white dark:bg-gray-800", [
                  n.value.inputWrapper,
                  {
                    "border-primary shadow-primary/30": c.value || p.value,
                    "border-gray-200 dark:border-gray-700 shadow-gray-100 dark:shadow-gray-900": !c.value && !p.value
                  }
                ]])
              }, [
                u("button", {
                  type: "button",
                  class: w(["absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-primary transition z-10", n.value.attachButton]),
                  title: ((z = s.texts) == null ? void 0 : z.attachFiles) || "Attach files",
                  onClick: ne
                }, [...m[5] || (m[5] = [
                  u("svg", {
                    class: "w-5 h-5",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    stroke: "currentColor"
                  }, [
                    u("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "1.5",
                      d: "M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
                    })
                  ], -1)
                ])], 10, pa),
                u("div", fa, [
                  Us(u("textarea", {
                    ref_key: "textareaRef",
                    ref: a,
                    "onUpdate:modelValue": m[1] || (m[1] = (U) => o.value = U),
                    rows: "1",
                    "data-ai-input": "",
                    placeholder: ie.value,
                    disabled: s.disabled,
                    class: w(["block w-full bg-transparent py-3 text-sm leading-5 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 border-0 focus:outline-none focus-visible:outline-none resize-none pl-12", [n.value.textarea, Se.value]]),
                    onInput: Ke,
                    onKeydown: Q,
                    onFocus: ct,
                    onBlur: Dt
                  }, null, 42, ha), [
                    [qs, o.value]
                  ])
                ]),
                u("div", ga, [
                  s.showSupportModeToggle && !s.supportRequestMode ? (x(), T("button", {
                    key: 0,
                    type: "button",
                    class: w(["h-9 w-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 transition flex-shrink-0", n.value.supportToggle]),
                    title: ((G = s.texts) == null ? void 0 : G.toggleSupportMode) || Y(fe)("toggleSupportMode"),
                    onClick: Pe
                  }, [...m[6] || (m[6] = [
                    u("svg", {
                      class: "w-5 h-5",
                      fill: "none",
                      viewBox: "0 0 24 24",
                      stroke: "currentColor",
                      "stroke-width": "1.5"
                    }, [
                      u("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        d: "M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                      })
                    ], -1)
                  ])], 10, ma)) : F("", !0),
                  s.showSupportModeToggle && s.supportRequestMode ? (x(), T("button", {
                    key: 1,
                    type: "button",
                    class: w(["h-7 px-2 rounded-lg flex items-center gap-1 text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition flex-shrink-0", n.value.supportBadge]),
                    title: ((re = s.texts) == null ? void 0 : re.exitSupportMode) || Y(fe)("exitSupportMode"),
                    onClick: Pe
                  }, [
                    m[7] || (m[7] = u("svg", {
                      class: "w-3.5 h-3.5",
                      fill: "none",
                      viewBox: "0 0 24 24",
                      stroke: "currentColor",
                      "stroke-width": "2"
                    }, [
                      u("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        d: "M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                      })
                    ], -1)),
                    u("span", null, $(((Le = s.texts) == null ? void 0 : Le.supportLabel) || "Support"), 1),
                    m[8] || (m[8] = u("svg", {
                      class: "w-3 h-3",
                      fill: "none",
                      viewBox: "0 0 24 24",
                      stroke: "currentColor",
                      "stroke-width": "2"
                    }, [
                      u("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        d: "M6 18L18 6M6 6l12 12"
                      })
                    ], -1))
                  ], 10, ya)) : F("", !0),
                  u("button", {
                    disabled: !ge.value && !s.sending,
                    class: w(["h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-200 flex-shrink-0", [
                      n.value.sendButton,
                      {
                        [n.value.sendButtonActive || "bg-primary text-white hover:bg-primary/90"]: ge.value && !s.sending,
                        [n.value.stopButton || "bg-red-500 text-white hover:bg-red-600"]: s.sending,
                        [n.value.sendButtonDisabled || "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60"]: !ge.value && !s.sending
                      }
                    ]]),
                    type: "button",
                    onClick: ht(S, ["prevent"])
                  }, [
                    s.sending ? (x(), T("svg", ba, [...m[10] || (m[10] = [
                      u("path", {
                        "fill-rule": "evenodd",
                        d: "M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z",
                        "clip-rule": "evenodd"
                      }, null, -1)
                    ])])) : (x(), T("svg", ka, [...m[9] || (m[9] = [
                      u("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "2",
                        d: "M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                      }, null, -1)
                    ])]))
                  ], 10, xa)
                ])
              ], 2)
            ], 2),
            Oe(d.$slots, "context-link", {}, () => [
              s.contextLinkText ? (x(), T("div", wa, [
                u("button", {
                  type: "button",
                  class: w(["text-xs text-gray-400 hover:text-primary transition-colors", n.value.contextLink]),
                  onClick: m[2] || (m[2] = (U) => d.$emit("context-link-click"))
                }, $(s.contextLinkText), 3)
              ])) : F("", !0)
            ])
          ])
        ], 34)
      ], 34);
    };
  }
}), Ta = ["onClick"], Sa = /* @__PURE__ */ Je({
  __name: "AiEmptyState",
  props: {
    ui: {},
    texts: {}
  },
  emits: ["item-click"],
  setup(s, { emit: e }) {
    const t = s, n = e, r = (y) => {
      var b;
      return (b = t.texts) != null && b[y] ? t.texts[y] : fe({
        aiName: "aiName",
        title: "emptyStateTitle",
        description: "emptyStateDescription"
      }[y]);
    }, o = q(() => t.ui || {}), { suggestions: a, resolvePrompt: l } = Rs();
    function c(y) {
      const v = {
        ...y,
        prompt: l(y)
      };
      n("item-click", v);
    }
    function p(y) {
      return y.gradientClass ? y.gradientClass : y.className ? y.className : "bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900";
    }
    function f(y) {
      const v = y.category || "default", b = {
        hr: "bg-blue-100 dark:bg-blue-900/30",
        finance: "bg-green-100 dark:bg-green-900/30",
        analytics: "bg-purple-100 dark:bg-purple-900/30",
        support: "bg-amber-100 dark:bg-amber-900/30",
        default: "bg-primary/10"
      };
      return b[v] || b.default;
    }
    function k(y) {
      const v = y.category || "default", b = {
        hr: "text-blue-600 dark:text-blue-400",
        finance: "text-green-600 dark:text-green-400",
        analytics: "text-purple-600 dark:text-purple-400",
        support: "text-amber-600 dark:text-amber-400",
        default: "text-primary"
      };
      return b[v] || b.default;
    }
    return (y, v) => (x(), T("div", {
      class: w(["flex items-center justify-center p-4 h-full", o.value.root])
    }, [
      u("div", {
        class: w(["w-full max-w-4xl", o.value.content])
      }, [
        u("div", {
          class: w(["mb-8 text-center", o.value.header])
        }, [
          u("div", {
            class: w(["mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary", o.value.badge])
          }, [
            v[0] || (v[0] = u("svg", {
              class: "w-4 h-4",
              fill: "none",
              viewBox: "0 0 24 24",
              stroke: "currentColor",
              "stroke-width": "1.5"
            }, [
              u("path", {
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                d: "M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
              })
            ], -1)),
            u("span", null, $(r("aiName")), 1)
          ], 2),
          u("h1", {
            class: w(["mb-3 text-4xl font-bold tracking-tight text-gray-900 dark:text-white", o.value.title])
          }, $(r("title")), 3),
          u("p", {
            class: w(["text-gray-600 dark:text-gray-400", o.value.description])
          }, $(r("description")), 3)
        ], 2),
        u("div", {
          class: w(["mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3", o.value.grid])
        }, [
          (x(!0), T($e, null, Xe(Y(a), (b, I) => (x(), T("button", {
            key: b.id || I,
            class: w(["group relative overflow-hidden rounded-xl border border-gray-300 dark:border-gray-600 p-4 text-left transition-all hover:shadow-md hover:scale-[1.02]", [o.value.suggestionCard, p(b)]]),
            onClick: (h) => c(b)
          }, [
            u("div", {
              class: w(["mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg", [o.value.suggestionIconContainer, f(b)]])
            }, [
              b.icon ? (x(), gt(un(b.icon), {
                key: 0,
                class: w(["h-5 w-5", [o.value.suggestionIcon, k(b)]])
              }, null, 8, ["class"])) : (x(), T("svg", {
                key: 1,
                class: w(["h-5 w-5", [o.value.suggestionIcon, k(b)]]),
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor",
                "stroke-width": "1.5"
              }, [...v[1] || (v[1] = [
                u("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  d: "M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
                }, null, -1)
              ])], 2))
            ], 2),
            u("h3", {
              class: w(["mb-1 text-sm font-semibold text-gray-900 dark:text-white", o.value.suggestionTitle])
            }, $(b.title), 3),
            u("p", {
              class: w(["text-xs text-gray-600 dark:text-gray-400", o.value.suggestionDescription])
            }, $(b.description), 3)
          ], 10, Ta))), 128))
        ], 2)
      ], 2)
    ], 2));
  }
}), Aa = { class: "flex items-center gap-3" }, Ca = {
  key: 1,
  class: "text-xs text-gray-400 dark:text-gray-500 font-medium"
}, Ea = {
  key: 1,
  class: "flex items-center gap-2"
}, _a = {
  key: 0,
  class: "flex items-center gap-2 ml-auto mr-3"
}, Ra = ["title"], Ma = ["title"], Ia = ["title"], La = {
  key: 0,
  class: "w-5 h-5 text-gray-600 dark:text-gray-400",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1.5"
}, Da = {
  key: 1,
  class: "w-5 h-5 text-gray-600 dark:text-gray-400",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1.5"
}, Oa = {
  key: 0,
  class: "flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto"
}, $a = { class: "w-full max-w-md" }, Pa = { class: "bg-gray-900 rounded-xl overflow-hidden" }, Na = { class: "flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-gray-700" }, za = {
  key: 0,
  class: "flex-1 flex flex-col overflow-y-auto"
}, Ha = { class: "max-w-3xl mx-auto px-4 space-y-6" }, Fa = { class: "flex justify-center" }, Ba = { class: "inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary" }, Ua = {
  key: 0,
  class: "flex justify-center"
}, qa = ["title"], ja = {
  key: 0,
  class: "absolute inset-0 bg-black/50 flex items-center justify-center z-10"
}, Wa = { class: "text-lg font-semibold text-gray-900 dark:text-white mb-2" }, Ga = { class: "text-sm text-gray-600 dark:text-gray-400 mb-6" }, Ka = { class: "flex justify-end gap-3" }, Va = `import { RestifyAiPlugin } from '@doderasoftware/restify-ai'

app.use(RestifyAiPlugin, {
  endpoints: {
    ask: '/api/ai/ask',
    quota: '/api/ai/quota', // optional
  },
  getAuthToken: () => getToken(),
})`, Za = /* @__PURE__ */ Je({
  __name: "AiChatDrawer",
  props: {
    modelValue: { type: Boolean },
    ui: {},
    texts: {},
    width: { default: "600px" },
    fullscreenWidth: { default: "90vw" },
    position: { default: "right" },
    showBackdrop: { type: Boolean, default: !1 },
    closeOnBackdropClick: { type: Boolean, default: !1 },
    closeOnEscape: { type: Boolean, default: !0 },
    showQuota: { type: Boolean, default: !0 },
    showFullscreenToggle: { type: Boolean, default: !0 },
    showMinimizeButton: { type: Boolean, default: !0 },
    showCloseButton: { type: Boolean, default: !0 },
    showNewChatButton: { type: Boolean, default: !0 },
    confirmClose: { type: Boolean, default: !0 }
  },
  emits: ["update:modelValue", "close", "contact-support", "new-chat"],
  setup(s, { emit: e }) {
    const t = s, n = e, r = q({
      get: () => t.modelValue,
      set: (D) => n("update:modelValue", D)
    });
    function o(D, S) {
      var O;
      const ne = (O = t.texts) == null ? void 0 : O[D];
      if (ne) {
        let se = ne;
        if (S)
          for (const [ue, ce] of Object.entries(S))
            se = se.replace(`{${ue}}`, String(ce));
        return se;
      }
      return fe(D, S);
    }
    const a = yt(), l = K(""), c = K(fe("loadingText")), p = K(null), f = K(!1), k = K(!1), y = K(!1), v = q(() => !as()), b = q(() => mt("enableSupportMode") ?? !1), { suggestions: I, resolvePrompt: h } = Rs();
    function A() {
      navigator.clipboard.writeText(Va), k.value = !0, setTimeout(() => {
        k.value = !1;
      }, 2e3);
    }
    const M = q(() => {
      if (v.value) return [];
      const D = l.value.toLowerCase().trim(), S = I.value || [];
      let ne = S;
      if (D) {
        const O = /* @__PURE__ */ new Set(["a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by"]), se = D.split(/\s+/).filter((ue) => !O.has(ue));
        se.length > 0 && (ne = S.filter((ue) => {
          const ce = `${ue.title} ${ue.description || ""}`.toLowerCase();
          return se.every((ke) => ce.includes(ke));
        }));
      }
      return ne.slice(0, 5).map((O) => ({
        id: O.id,
        title: O.title,
        description: O.description || ""
      }));
    }), E = q(() => ({
      quota: a.quota,
      isFullscreen: f.value,
      hasHistory: a.chatHistory.length > 0,
      onNewChat: ge,
      onClose: ie,
      onMinimize: te,
      onToggleFullscreen: X
    })), _ = q(() => ({
      modelValue: l.value,
      sending: a.sending,
      disabled: !1,
      onSubmit: tt,
      onCancel: () => a.cancelRequest()
    }));
    function H(D) {
      const S = (I.value || []).find((ne) => ne.id === D.id);
      S && (l.value = h(S));
    }
    function X() {
      f.value = !f.value;
    }
    function te() {
      r.value = !1;
    }
    function ie() {
      t.confirmClose && !v.value && a.chatHistory.length > 0 ? y.value = !0 : (r.value = !1, n("close"));
    }
    function Se() {
      y.value = !1, a.clearChatHistory(), r.value = !1, n("close");
    }
    function Ge() {
      n("contact-support");
    }
    function Z() {
      a.toggleSupportMode();
    }
    async function L() {
      await He();
      const D = document.getElementById("rai-chat-bottom");
      D && D.scrollIntoView({ behavior: "smooth", block: "end" });
    }
    function J(D) {
      l.value = D.prompt, a.clearError();
    }
    function ge() {
      a.clearChatHistory(), n("new-chat");
    }
    function Ke(D) {
    }
    function Pe(D) {
      return new Promise((S) => setTimeout(S, D));
    }
    function Ie() {
      c.value = fe("loadingText");
    }
    async function et() {
      if (c.value = fe("loadingText"), await Pe(2e3), !a.sending) {
        Ie();
        return;
      }
      if (c.value = fe("analyzingText"), await Pe(3e3), !a.sending) {
        Ie();
        return;
      }
      c.value = fe("craftingText");
    }
    async function tt(D) {
      const { message: S, attachments: ne, mentions: O, isSupportRequest: se } = D;
      if (a.sending) return;
      a.clearError(), et(), await He(), L();
      const ue = O.map((ke) => ({
        id: ke.id,
        name: ke.name,
        type: ke.type || "unknown",
        metadata: ke.metadata
      })), ce = await a.askQuestion(S, ne, ue, se);
      Ie(), ce && L();
    }
    async function nt() {
      et();
      const D = await a.retry();
      Ie(), D && L();
    }
    function Q(D) {
      t.closeOnEscape && D.key === "Escape" && r.value && (y.value ? y.value = !1 : te());
    }
    return Kt(() => {
      window.addEventListener("keydown", Q);
    }), Gt(() => {
      window.removeEventListener("keydown", Q);
    }), (D, S) => (x(), gt(js, { to: "body" }, [
      We(_t, { name: "rai-fade" }, {
        default: Ye(() => {
          var ne;
          return [
            r.value && s.showBackdrop ? (x(), T("div", {
              key: 0,
              class: w(["fixed inset-0 bg-black/30 z-40", (ne = s.ui) == null ? void 0 : ne.backdrop]),
              onClick: S[0] || (S[0] = (O) => s.closeOnBackdropClick && te())
            }, null, 2)) : F("", !0)
          ];
        }),
        _: 1
      }),
      We(_t, {
        name: s.position === "left" ? "rai-slide-right" : "rai-slide-left"
      }, {
        default: Ye(() => {
          var ne, O, se, ue, ce, ke;
          return [
            r.value ? (x(), T("aside", {
              key: 0,
              class: w(["fixed top-0 bottom-0 z-50 flex-shrink-0 h-full border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl will-change-transform", [
                s.position === "left" ? "left-0 border-r" : "right-0 border-l",
                (ne = s.ui) == null ? void 0 : ne.drawer
              ]]),
              style: rs({ width: f.value ? s.fullscreenWidth : s.width })
            }, [
              u("div", {
                class: w(["h-full flex flex-col relative bg-white dark:bg-gray-900", (O = s.ui) == null ? void 0 : O.panel])
              }, [
                Oe(D.$slots, "header", Pn(Nn(E.value)), () => {
                  var ee, de, we, Ae, Ce, Ee;
                  return [
                    u("div", {
                      class: w(["flex items-center justify-between px-4 sm:px-6 pt-4 border-b border-gray-200 dark:border-gray-700 pb-4", (ee = s.ui) == null ? void 0 : ee.header])
                    }, [
                      u("div", Aa, [
                        v.value ? (x(), T("div", Ea, [...S[4] || (S[4] = [
                          u("span", { class: "flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" }, null, -1),
                          u("span", { class: "text-sm font-medium text-gray-700 dark:text-gray-300" }, "Setup Required", -1)
                        ])])) : (x(), T($e, { key: 0 }, [
                          s.showNewChatButton && Y(a).chatHistory.length > 0 ? (x(), T("button", {
                            key: 0,
                            type: "button",
                            class: w(["inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 transition-all duration-200 shadow-sm", (de = s.ui) == null ? void 0 : de.newChatButton]),
                            onClick: ge
                          }, [
                            S[3] || (S[3] = u("svg", {
                              class: "w-4 h-4",
                              fill: "none",
                              viewBox: "0 0 24 24",
                              stroke: "currentColor",
                              "stroke-width": "1.5"
                            }, [
                              u("path", {
                                "stroke-linecap": "round",
                                "stroke-linejoin": "round",
                                d: "M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
                              })
                            ], -1)),
                            u("span", null, $(o("newChat")), 1)
                          ], 2)) : (x(), T("span", Ca, $(o("keyboardShortcutHint")), 1))
                        ], 64))
                      ]),
                      s.showQuota && !v.value ? (x(), T("div", _a, [
                        Oe(D.$slots, "quota", {
                          quota: Y(a).quota
                        }, () => {
                          var Ve, Ze;
                          return [
                            Y(a).quota.remaining > 0 ? (x(), T("span", {
                              key: 0,
                              class: w(["text-xs text-green-600 dark:text-green-400", (Ve = s.ui) == null ? void 0 : Ve.quotaDisplay])
                            }, $(o("quotaRemaining", { count: Y(a).quota.remaining })), 3)) : Y(a).quota.remaining === 0 ? (x(), T("span", {
                              key: 1,
                              class: w(["text-xs text-red-600 dark:text-red-400", (Ze = s.ui) == null ? void 0 : Ze.quotaDisplay])
                            }, $(o("noQuota")), 3)) : F("", !0)
                          ];
                        }, !0)
                      ])) : F("", !0),
                      u("div", {
                        class: w(["flex items-center gap-1", (we = s.ui) == null ? void 0 : we.headerActions])
                      }, [
                        s.showCloseButton ? (x(), T("button", {
                          key: 0,
                          type: "button",
                          class: w(["p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors", (Ae = s.ui) == null ? void 0 : Ae.headerActionButton]),
                          title: o("close"),
                          onClick: ie
                        }, [...S[5] || (S[5] = [
                          u("svg", {
                            class: "w-5 h-5 text-gray-600 dark:text-gray-400",
                            fill: "none",
                            viewBox: "0 0 24 24",
                            stroke: "currentColor",
                            "stroke-width": "1.5"
                          }, [
                            u("path", {
                              "stroke-linecap": "round",
                              "stroke-linejoin": "round",
                              d: "M6 18L18 6M6 6l12 12"
                            })
                          ], -1)
                        ])], 10, Ra)) : F("", !0),
                        s.showMinimizeButton ? (x(), T("button", {
                          key: 1,
                          type: "button",
                          class: w(["p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors", (Ce = s.ui) == null ? void 0 : Ce.headerActionButton]),
                          title: o("minimize"),
                          onClick: te
                        }, [...S[6] || (S[6] = [
                          u("svg", {
                            class: "w-5 h-5 text-gray-600 dark:text-gray-400",
                            fill: "none",
                            viewBox: "0 0 24 24",
                            stroke: "currentColor",
                            "stroke-width": "1.5"
                          }, [
                            u("path", {
                              "stroke-linecap": "round",
                              "stroke-linejoin": "round",
                              d: "M5 12h14"
                            })
                          ], -1)
                        ])], 10, Ma)) : F("", !0),
                        s.showFullscreenToggle ? (x(), T("button", {
                          key: 2,
                          type: "button",
                          class: w(["p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors", (Ee = s.ui) == null ? void 0 : Ee.headerActionButton]),
                          title: f.value ? o("exitFullscreen") : o("fullscreen"),
                          onClick: X
                        }, [
                          f.value ? (x(), T("svg", Da, [...S[8] || (S[8] = [
                            u("path", {
                              "stroke-linecap": "round",
                              "stroke-linejoin": "round",
                              d: "M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"
                            }, null, -1)
                          ])])) : (x(), T("svg", La, [...S[7] || (S[7] = [
                            u("path", {
                              "stroke-linecap": "round",
                              "stroke-linejoin": "round",
                              d: "M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                            }, null, -1)
                          ])]))
                        ], 10, Ia)) : F("", !0)
                      ], 2)
                    ], 2)
                  ];
                }, !0),
                u("div", {
                  class: w(["h-full flex flex-col mx-auto w-full overflow-hidden", [{ "max-w-5xl": f.value }, (se = s.ui) == null ? void 0 : se.body]])
                }, [
                  v.value ? (x(), T("div", Oa, [
                    Oe(D.$slots, "setup", {}, () => [
                      S[12] || (S[12] = u("div", { class: "w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5" }, [
                        u("svg", {
                          class: "w-7 h-7 text-primary",
                          fill: "none",
                          viewBox: "0 0 24 24",
                          stroke: "currentColor",
                          "stroke-width": "1.5"
                        }, [
                          u("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            d: "M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
                          })
                        ])
                      ], -1)),
                      S[13] || (S[13] = u("h2", { class: "text-lg font-semibold text-gray-900 dark:text-white mb-1" }, " Almost there! ", -1)),
                      S[14] || (S[14] = u("p", { class: "text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm text-center" }, " Configure the plugin in your app entry file to start using AI. ", -1)),
                      u("div", $a, [
                        u("div", Pa, [
                          u("div", Na, [
                            S[9] || (S[9] = u("span", { class: "text-xs text-gray-400" }, "main.ts", -1)),
                            u("button", {
                              type: "button",
                              class: "text-xs text-gray-400 hover:text-white transition-colors",
                              onClick: A
                            }, $(k.value ? "✓ Copied" : "Copy"), 1)
                          ]),
                          S[10] || (S[10] = u("pre", { class: "text-xs text-gray-100 p-4 overflow-x-auto leading-relaxed" }, [
                            u("code", { class: "language-typescript" }, [
                              u("span", { class: "text-purple-400" }, "import"),
                              ve(" { RestifyAiPlugin } "),
                              u("span", { class: "text-purple-400" }, "from"),
                              ve(),
                              u("span", { class: "text-green-400" }, "'@doderasoftware/restify-ai'"),
                              ve(`

app.`),
                              u("span", { class: "text-yellow-300" }, "use"),
                              ve(`(RestifyAiPlugin, {
  `),
                              u("span", { class: "text-blue-300" }, "endpoints"),
                              ve(`: {
    `),
                              u("span", { class: "text-blue-300" }, "ask"),
                              ve(": "),
                              u("span", { class: "text-green-400" }, "'/api/ai/ask'"),
                              ve(`,
    `),
                              u("span", { class: "text-blue-300" }, "quota"),
                              ve(": "),
                              u("span", { class: "text-green-400" }, "'/api/ai/quota'"),
                              ve(", "),
                              u("span", { class: "text-gray-500" }, "// optional"),
                              ve(`
  },
  `),
                              u("span", { class: "text-blue-300" }, "getAuthToken"),
                              ve(": () => "),
                              u("span", { class: "text-yellow-300" }, "getToken"),
                              ve(`(),
})`)
                            ])
                          ], -1))
                        ]),
                        S[11] || (S[11] = u("p", { class: "text-xs text-gray-400 dark:text-gray-500 mt-4 text-center" }, [
                          ve(" Need help? Check the "),
                          u("a", {
                            href: "https://github.com/doderasoftware/restify-ai",
                            target: "_blank",
                            class: "text-primary hover:underline"
                          }, "documentation")
                        ], -1))
                      ])
                    ], !0)
                  ])) : (x(), T($e, { key: 1 }, [
                    Y(a).chatHistory.length === 0 ? (x(), T("div", za, [
                      Oe(D.$slots, "empty-state", {
                        suggestions: M.value,
                        onClick: J
                      }, () => [
                        We(Sa, { onItemClick: J })
                      ], !0)
                    ])) : (x(), T("div", {
                      key: 1,
                      ref_key: "chatContainer",
                      ref: p,
                      class: "flex-1 overflow-y-auto py-6 pb-24"
                    }, [
                      u("div", Ha, [
                        u("div", Fa, [
                          u("div", Ba, [
                            S[15] || (S[15] = u("svg", {
                              class: "w-4 h-4",
                              fill: "none",
                              viewBox: "0 0 24 24",
                              stroke: "currentColor",
                              "stroke-width": "1.5"
                            }, [
                              u("path", {
                                "stroke-linecap": "round",
                                "stroke-linejoin": "round",
                                d: "M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
                              })
                            ], -1)),
                            u("span", null, $(o("title") || Y(fe)("aiName")), 1)
                          ])
                        ]),
                        (x(!0), T($e, null, Xe(Y(a).chatHistory, (ee, de) => Oe(D.$slots, "message", {
                          key: ee.id || de,
                          message: ee,
                          isUser: ee.role === "user",
                          isLoading: ee.loading,
                          isStreaming: ee.streaming
                        }, () => [
                          We(Ko, {
                            message: ee,
                            "loading-text": c.value,
                            onCopy: Ke
                          }, null, 8, ["message", "loading-text"])
                        ], !0)), 128)),
                        Y(a).quota.remaining === 0 ? (x(), T("div", Ua, [
                          u("button", {
                            type: "button",
                            class: "inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all shadow-sm",
                            onClick: Ge
                          }, [
                            S[16] || (S[16] = u("svg", {
                              class: "w-5 h-5",
                              fill: "none",
                              stroke: "currentColor",
                              viewBox: "0 0 24 24"
                            }, [
                              u("path", {
                                "stroke-linecap": "round",
                                "stroke-linejoin": "round",
                                "stroke-width": "2",
                                d: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                              })
                            ], -1)),
                            u("span", null, $(Y(fe)("contactSupport")), 1)
                          ])
                        ])) : F("", !0),
                        Y(a).error.message ? (x(), T("div", {
                          key: 1,
                          class: w(["flex items-center gap-2 text-sm text-red-600 dark:text-red-400 px-2 py-1 pb-6", (ue = s.ui) == null ? void 0 : ue.errorContainer])
                        }, [
                          u("span", {
                            class: w((ce = s.ui) == null ? void 0 : ce.errorMessage)
                          }, $(Y(a).error.message), 3),
                          u("button", {
                            type: "button",
                            class: w(["inline-flex items-center gap-1 text-red-700 dark:text-red-300 hover:text-red-800 dark:hover:text-red-200 font-medium", (ke = s.ui) == null ? void 0 : ke.retryButton]),
                            title: o("retry"),
                            onClick: nt
                          }, [...S[17] || (S[17] = [
                            u("svg", {
                              class: "w-4 h-4",
                              fill: "none",
                              stroke: "currentColor",
                              viewBox: "0 0 24 24"
                            }, [
                              u("path", {
                                "stroke-linecap": "round",
                                "stroke-linejoin": "round",
                                "stroke-width": "2",
                                d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                              })
                            ], -1)
                          ])], 10, qa)
                        ], 2)) : F("", !0)
                      ])
                    ], 512)),
                    S[18] || (S[18] = u("div", {
                      id: "rai-chat-bottom",
                      class: "h-8"
                    }, null, -1)),
                    Oe(D.$slots, "input", Pn(Nn(_.value)), () => {
                      var ee, de;
                      return [
                        We(va, {
                          modelValue: l.value,
                          "onUpdate:modelValue": S[1] || (S[1] = (we) => l.value = we),
                          sending: Y(a).sending,
                          placeholder: ((ee = t.texts) == null ? void 0 : ee.placeholder) || Y(fe)("inputPlaceholder"),
                          "support-placeholder": ((de = t.texts) == null ? void 0 : de.supportPlaceholder) || Y(fe)("supportPlaceholder"),
                          suggestions: M.value,
                          "has-history": Y(a).chatHistory.length > 0,
                          "support-request-mode": Y(a).supportRequestMode,
                          "show-support-mode-toggle": b.value,
                          onSubmit: tt,
                          onCancel: Y(a).cancelRequest,
                          onSuggestionSelect: H,
                          onToggleSupportMode: Z
                        }, {
                          "context-link": Ye(() => [
                            Oe(D.$slots, "context-link", {}, void 0, !0)
                          ]),
                          _: 3
                        }, 8, ["modelValue", "sending", "placeholder", "support-placeholder", "suggestions", "has-history", "support-request-mode", "show-support-mode-toggle", "onCancel"])
                      ];
                    }, !0)
                  ], 64))
                ], 2)
              ], 2),
              We(_t, {
                "enter-active-class": "transition ease-out duration-200",
                "enter-from-class": "opacity-0",
                "enter-to-class": "opacity-100",
                "leave-active-class": "transition ease-in duration-150",
                "leave-from-class": "opacity-100",
                "leave-to-class": "opacity-0"
              }, {
                default: Ye(() => {
                  var ee, de, we;
                  return [
                    y.value ? (x(), T("div", ja, [
                      u("div", {
                        class: w(["bg-white dark:bg-gray-800 rounded-xl p-6 m-4 max-w-sm w-full shadow-xl", (ee = s.ui) == null ? void 0 : ee.closeConfirmModal])
                      }, [
                        u("h3", Wa, $(o("closeConfirmTitle")), 1),
                        u("p", Ga, $(o("closeConfirmMessage")), 1),
                        u("div", Ka, [
                          u("button", {
                            type: "button",
                            class: w(["px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors", (de = s.ui) == null ? void 0 : de.cancelButton]),
                            onClick: S[2] || (S[2] = (Ae) => y.value = !1)
                          }, $(o("cancel")), 3),
                          u("button", {
                            type: "button",
                            class: w(["px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors", (we = s.ui) == null ? void 0 : we.closeConfirmButton]),
                            onClick: Se
                          }, $(o("confirmClose")), 3)
                        ])
                      ], 2)
                    ])) : F("", !0)
                  ];
                }),
                _: 1
              })
            ], 6)) : F("", !0)
          ];
        }),
        _: 3
      }, 8, ["name"])
    ]));
  }
}), ii = /* @__PURE__ */ Ms(Za, [["__scopeId", "data-v-3d44dd49"]]), li = {
  install(s, e) {
    if (!e.endpoints || !e.getAuthToken) {
      console.warn("[@doderasoftware/restify-ai] Plugin requires endpoints and getAuthToken options.");
      return;
    }
    const t = {
      // Core
      endpoints: e.endpoints,
      baseUrl: e.baseUrl,
      getAuthToken: e.getAuthToken,
      getCustomHeaders: e.getCustomHeaders,
      // Request customization
      buildRequest: e.buildRequest,
      parseStreamContent: e.parseStreamContent,
      requestInterceptor: e.requestInterceptor,
      responseInterceptor: e.responseInterceptor,
      // Retry
      retry: e.retry,
      // Internationalization
      translate: e.translate,
      can: e.can,
      labels: {
        ...os,
        ...e.labels
      },
      // Providers
      mentionProviders: e.mentionProviders,
      suggestionProviders: e.suggestionProviders,
      defaultSuggestions: e.defaultSuggestions,
      // Theme
      theme: e.theme,
      // Limits
      chatHistoryLimit: e.chatHistoryLimit,
      maxAttachments: e.maxAttachments,
      maxFileSize: e.maxFileSize,
      acceptedFileTypes: e.acceptedFileTypes,
      // Storage keys
      chatHistoryKey: e.chatHistoryKey,
      drawerStateKey: e.drawerStateKey,
      // Features
      keyboardShortcut: e.keyboardShortcut,
      enableSupportMode: e.enableSupportMode,
      // Custom components
      assistantAvatar: e.assistantAvatar,
      userAvatar: e.userAvatar,
      // Lifecycle callbacks
      onQuotaFetched: e.onQuotaFetched,
      onError: e.onError,
      onMessageSent: e.onMessageSent,
      onResponseReceived: e.onResponseReceived,
      onDrawerToggle: e.onDrawerToggle,
      onNewChat: e.onNewChat,
      // Stream lifecycle hooks
      onStreamStart: e.onStreamStart,
      onStreamEnd: e.onStreamEnd,
      onStreamChunk: e.onStreamChunk,
      beforeSend: e.beforeSend,
      afterResponse: e.afterResponse,
      // File upload callbacks
      onFileUploadStart: e.onFileUploadStart,
      onFileUploadProgress: e.onFileUploadProgress,
      onFileUploadComplete: e.onFileUploadComplete,
      onFileUploadError: e.onFileUploadError
    };
    Ks(t), s.provide("restify-ai-config", t);
  }
};
export {
  To as AiAvatar,
  ii as AiChatDrawer,
  Sa as AiEmptyState,
  va as ChatInput,
  Ko as ChatMessage,
  _o as ChatMessageActions,
  Hn as ChatRoles,
  Ao as MentionList,
  li as RestifyAiPlugin,
  ai as UserAvatar,
  li as default,
  os as defaultLabels,
  dr as formatMentionsForApi,
  mt as getConfigValue,
  fe as getLabel,
  ae as getRestifyAiConfig,
  Ja as getRestifyAiConfigOrThrow,
  xo as getSuggestionsForPath,
  pr as groupMentionsByType,
  as as isConfigured,
  si as registerSuggestionProvider,
  Ks as setRestifyAiConfig,
  Es as useAiContext,
  oi as useAiDrawerShortcut,
  Rs as useAiSuggestions,
  ni as useChatErrorHandling,
  go as useChatMarkdown,
  ti as useChatScroll,
  vo as useKeyboardShortcut,
  ei as useMentionParsing,
  ri as usePageAiContext,
  yt as useRestifyAiStore
};
