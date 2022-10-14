var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf, __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
}, __copyProps = (to, from, except, desc) => {
  if (from && typeof from == "object" || typeof from == "function")
    for (let key of __getOwnPropNames(from))
      !__hasOwnProp.call(to, key) && key !== except && __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: !0 }) : target,
  mod
)), __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: !0 }), mod);

// <stdin>
var stdin_exports = {};
__export(stdin_exports, {
  assets: () => assets_manifest_default,
  assetsBuildDirectory: () => assetsBuildDirectory,
  entry: () => entry,
  publicPath: () => publicPath,
  routes: () => routes
});
module.exports = __toCommonJS(stdin_exports);

// app/entry.server.tsx
var entry_server_exports = {};
__export(entry_server_exports, {
  default: () => handleRequest
});
var import_stream = require("stream"), import_node = require("@remix-run/node"), import_react = require("@remix-run/react"), import_isbot = __toESM(require("isbot")), import_server = require("react-dom/server"), import_jsx_runtime = require("react/jsx-runtime"), ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return (0, import_isbot.default)(request.headers.get("user-agent")) ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let didError = !1, { pipe, abort } = (0, import_server.renderToPipeableStream)(
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.RemixServer, {
        context: remixContext,
        url: request.url
      }),
      {
        onAllReady() {
          let body = new import_stream.PassThrough();
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new import_node.Response(body, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode
            })
          ), pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          didError = !0, console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let didError = !1, { pipe, abort } = (0, import_server.renderToPipeableStream)(
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.RemixServer, {
        context: remixContext,
        url: request.url
      }),
      {
        onShellReady() {
          let body = new import_stream.PassThrough();
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new import_node.Response(body, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode
            })
          ), pipe(body);
        },
        onShellError(err) {
          reject(err);
        },
        onError(error) {
          didError = !0, console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}

// app/root.tsx
var root_exports = {};
__export(root_exports, {
  default: () => App,
  meta: () => meta
});
var import_react2 = require("@remix-run/react"), import_jsx_runtime = require("react/jsx-runtime"), meta = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1"
});
function App() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
    lang: "en",
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("head", {
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react2.Meta, {}),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react2.Links, {})
        ]
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react2.Outlet, {}),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react2.ScrollRestoration, {}),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react2.Scripts, {}),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react2.LiveReload, {})
        ]
      })
    ]
  });
}

// app/routes/terminal.tsx
var terminal_exports = {};
__export(terminal_exports, {
  $createTerminalPrefixNode: () => $createTerminalPrefixNode,
  default: () => Index,
  links: () => links
});
var import_react3 = require("react");

// app/styles/terminal.css
var terminal_default = "/build/_assets/terminal-F2M25REN.css";

// app/styles/terminal-lexical.css
var terminal_lexical_default = "/build/_assets/terminal-lexical-VBPVS3HD.css";

// app/routes/terminal.tsx
var import_lexical = require("lexical"), import_lexical2 = require("lexical"), import_LexicalComposer = require("@lexical/react/LexicalComposer"), import_LexicalPlainTextPlugin = require("@lexical/react/LexicalPlainTextPlugin"), import_LexicalContentEditable = require("@lexical/react/LexicalContentEditable"), import_LexicalHistoryPlugin = require("@lexical/react/LexicalHistoryPlugin"), import_LexicalOnChangePlugin = require("@lexical/react/LexicalOnChangePlugin"), import_LexicalComposerContext = require("@lexical/react/LexicalComposerContext"), import_jsx_runtime = require("react/jsx-runtime");
function links() {
  return [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "true"
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Cousine&display=swap"
    },
    { rel: "stylesheet", href: terminal_default },
    { rel: "stylesheet", href: terminal_lexical_default }
  ];
}
var DEFAULT_START = "~ $ ";
function Index() {
  let [userInput, setUserInput] = (0, import_react3.useState)(DEFAULT_START), [cursorPosition, setCursorPosition] = (0, import_react3.useState)(userInput.length);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
    id: "term-container",
    children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
      id: "term-border",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
          id: "term-header",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
              id: "term-header-red"
            }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
              id: "term-header-yellow"
            }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
              id: "term-header-green"
            })
          ]
        }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
          id: "term-body",
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_LexicalComposer.LexicalComposer, {
            initialConfig: {
              namespace: "MyEditor",
              theme: {
                base: "terminal-base"
              },
              onError: (e) => console.error(e),
              editorState: () => {
                let paragraph = (0, import_lexical.$createParagraphNode)();
                paragraph.append(new TerminalPrefixNode()), (0, import_lexical2.$getRoot)().append(paragraph), (0, import_lexical2.$getRoot)().selectEnd();
              },
              nodes: [TerminalPrefixNode],
              editable: !0
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_LexicalPlainTextPlugin.PlainTextPlugin, {
                contentEditable: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_LexicalContentEditable.ContentEditable, {
                  autoCorrect: !1,
                  autoCapitalize: !1,
                  spellCheck: !1,
                  id: "term-body-content-editable"
                }),
                placeholder: ""
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_LexicalOnChangePlugin.OnChangePlugin, {
                onChange
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_LexicalHistoryPlugin.HistoryPlugin, {}),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TransformPlugin, {})
            ]
          })
        })
      ]
    })
  });
}
function onChange(editorState, editor) {
  editorState.read(() => {
    let root = (0, import_lexical2.$getRoot)(), selection = (0, import_lexical2.$getSelection)();
  });
}
function TransformPlugin() {
  let [editor] = (0, import_LexicalComposerContext.useLexicalComposerContext)();
  return editor.registerNodeTransform(import_lexical.ParagraphNode, (paragraphNode) => {
    let first = (0, import_lexical2.$getRoot)().getFirstDescendant();
    first instanceof TerminalPrefixNode || (first == null || first instanceof import_lexical.ParagraphNode && first.getChildrenSize() === 0 ? (paragraphNode.append(new TerminalPrefixNode()), paragraphNode.getParentOrThrow().selectEnd()) : first.insertBefore(new TerminalPrefixNode()));
  }), editor.registerCommand(
    import_lexical.KEY_ARROW_LEFT_COMMAND,
    (event, editor2) => {
      if (event.shiftKey)
        return !1;
      let selection = (0, import_lexical2.$getSelection)();
      if (!(0, import_lexical.$isRangeSelection)(selection))
        return !1;
      if (!selection.getNodes().every((n) => !(n instanceof TerminalPrefixNode))) {
        let terminalPrefix = (0, import_lexical2.$getRoot)().getFirstDescendant(), newSelection = (0, import_lexical.$createRangeSelection)();
        return newSelection.anchor.set(
          terminalPrefix.getKey(),
          terminalPrefix.getLength(),
          "text"
        ), newSelection.focus.set(
          terminalPrefix.getKey(),
          terminalPrefix.getLength(),
          "text"
        ), (0, import_lexical.$setSelection)(newSelection), event.preventDefault(), !0;
      }
      return !1;
    },
    import_lexical.COMMAND_PRIORITY_EDITOR
  ), editor.registerCommand(
    import_lexical.KEY_MODIFIER_COMMAND,
    (event, editor2) => {
      if (event.ctrlKey && event.key === "c") {
        let paragraph = (0, import_lexical.$createParagraphNode)();
        return paragraph.append(new TerminalPrefixNode()), (0, import_lexical2.$getRoot)().clear(), (0, import_lexical2.$getRoot)().append(paragraph), (0, import_lexical2.$getRoot)().selectEnd(), event.preventDefault(), !0;
      }
      return !1;
    },
    import_lexical.COMMAND_PRIORITY_EDITOR
  ), editor.registerCommand(
    import_lexical.SELECTION_CHANGE_COMMAND,
    (_event, _editor) => {
      var _a;
      let selectionNodes = (_a = (0, import_lexical2.$getSelection)()) == null ? void 0 : _a.getNodes();
      if (selectionNodes == null)
        return !1;
      let selection = (0, import_lexical2.$getSelection)();
      if (!(0, import_lexical.$isRangeSelection)(selection))
        return console.log(selection), !1;
      let offsets = selection.getCharacterOffsets(), isPointSelection = offsets[0] === offsets[1];
      if (selectionNodes.length === 1 && isPointSelection) {
        let onlyNode = selectionNodes[0];
        if (onlyNode instanceof TerminalPrefixNode && offsets[0] !== onlyNode.getLength()) {
          console.log(selection.focus.offset, selection.anchor.offset);
          let newSelection = (0, import_lexical.$createRangeSelection)();
          return newSelection.anchor.set(
            onlyNode.getKey(),
            onlyNode.getLength(),
            "text"
          ), newSelection.focus.set(
            onlyNode.getKey(),
            onlyNode.getLength(),
            "text"
          ), !0;
        }
      }
      return !1;
    },
    import_lexical.COMMAND_PRIORITY_EDITOR
  ), editor.registerCommand(
    import_lexical.MOVE_TO_START,
    (event, editor2) => {
      let root = (0, import_lexical2.$getRoot)(), selection = (0, import_lexical.$createRangeSelection)(), terminalPrefix = root.getFirstDescendant();
      return terminalPrefix instanceof TerminalPrefixNode ? (selection.anchor.set(
        terminalPrefix.getKey(),
        terminalPrefix.getLength(),
        "text"
      ), selection.focus.set(
        terminalPrefix.getKey(),
        terminalPrefix.getLength(),
        "text"
      ), (0, import_lexical.$setSelection)(selection), event.preventDefault(), !0) : !1;
    },
    import_lexical.COMMAND_PRIORITY_EDITOR
  ), editor.registerCommand(
    import_lexical.KEY_ENTER_COMMAND,
    (event, editor2) => {
      let paragraph = (0, import_lexical.$createParagraphNode)();
      return paragraph.append(new TerminalPrefixNode()), (0, import_lexical2.$getRoot)().clear(), (0, import_lexical2.$getRoot)().append(paragraph), (0, import_lexical2.$getRoot)().selectEnd(), event.preventDefault(), !0;
    },
    import_lexical.COMMAND_PRIORITY_EDITOR
  ), null;
}
var TerminalPrefixNode = class extends import_lexical.TextNode {
  static getType() {
    return "terminal-prefix-node";
  }
  static clone(node) {
    return new TerminalPrefixNode(node.__key);
  }
  constructor(key) {
    super("~ $ ", key), this.__mode = 1, this.__detail ^= 1 << 1;
  }
  getLength() {
    return this.getTextContent().length;
  }
  createDOM(config) {
    return super.createDOM(config);
  }
  updateDOM(prevNode, dom, config) {
    return super.updateDOM(prevNode, dom, config);
  }
  static importJSON(jsonNode) {
    return $createTerminalPrefixNode();
  }
  exportJSON() {
    return {
      ...super.exportJSON(),
      type: "terminal-prefix-node",
      version: 1
    };
  }
};
function $createTerminalPrefixNode() {
  return new TerminalPrefixNode();
}

// app/routes/index.tsx
var routes_exports = {};
__export(routes_exports, {
  default: () => Index2,
  links: () => links2
});
var import_jsx_runtime = require("react/jsx-runtime");
function links2() {
  return [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "true"
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Cousine&display=swap"
    }
  ];
}
function Index2() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
    style: { fontFamily: "Cousine, monospace", fontSize: "16px" },
    children: "brady@madden.dev"
  });
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { version: "f45d6725", entry: { module: "/build/entry.client-R446PPQB.js", imports: ["/build/_shared/chunk-7S4CMYTF.js", "/build/_shared/chunk-WRE323JU.js", "/build/_shared/chunk-NNE7662T.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-YHQGQIYW.js", imports: void 0, hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/index": { id: "routes/index", parentId: "root", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/index-BVUWKGQ2.js", imports: void 0, hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/terminal": { id: "routes/terminal", parentId: "root", path: "terminal", index: void 0, caseSensitive: void 0, module: "/build/routes/terminal-HO7NDQ6L.js", imports: void 0, hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 } }, url: "/build/manifest-F45D6725.js" };

// server-entry-module:@remix-run/dev/server-build
var assetsBuildDirectory = "public/build", publicPath = "/build/", entry = { module: entry_server_exports }, routes = {
  root: {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/terminal": {
    id: "routes/terminal",
    parentId: "root",
    path: "terminal",
    index: void 0,
    caseSensitive: void 0,
    module: terminal_exports
  },
  "routes/index": {
    id: "routes/index",
    parentId: "root",
    path: void 0,
    index: !0,
    caseSensitive: void 0,
    module: routes_exports
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  assets,
  assetsBuildDirectory,
  entry,
  publicPath,
  routes
});
