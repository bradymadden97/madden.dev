import { useState } from "react";
import styles from "~/styles/terminal.css";
import lexicalStyles from "~/styles/terminal-lexical.css";
import {
  $createParagraphNode,
  $createRangeSelection,
  $createTextNode,
  $getPreviousSelection,
  $isRangeSelection,
  $setSelection,
  CLEAR_EDITOR_COMMAND,
  CLICK_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_EDITOR,
  EditorConfig,
  EditorState,
  ElementNode,
  KEY_ARROW_LEFT_COMMAND,
  KEY_ARROW_RIGHT_COMMAND,
  KEY_ENTER_COMMAND,
  KEY_MODIFIER_COMMAND,
  LexicalEditor,
  MOVE_TO_START,
  NodeKey,
  ParagraphNode,
  RangeSelection,
  SELECTION_CHANGE_COMMAND,
  SerializedTextNode,
  Spread,
  TextNode,
} from "lexical";

import { $getRoot, $getSelection } from "lexical";
import { useEffect } from "react";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export function links() {
  return [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "true",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Cousine&display=swap",
    },
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: lexicalStyles },
  ];
}

const DEFAULT_START = "~ $ ";

export default function Index() {
  const [userInput, setUserInput] = useState(DEFAULT_START);
  const [cursorPosition, setCursorPosition] = useState(userInput.length);

  const initialConfig = {
    namespace: "MyEditor",
    theme: {
      base: "terminal-base",
    },
    onError: (e: Error) => console.error(e),
    editorState: () => {
      const paragraph = $createParagraphNode();
      paragraph.append(new TerminalPrefixNode());
      $getRoot().append(paragraph);
      $getRoot().selectEnd();
    },
    nodes: [TerminalPrefixNode],
    editable: true,
  };

  return (
    <div id="term-container">
      <div id="term-border">
        <div id="term-header">
          <div id="term-header-red"></div>
          <div id="term-header-yellow"></div>
          <div id="term-header-green"></div>
        </div>
        <div id="term-body">
          {/*<input
            id="term-body-current-input"
            onChange={(e) => {
              let newInput = e.target.value;
              console.log(newInput);
              if (newInput.length < DEFAULT_START.length) {
                newInput = DEFAULT_START;
              }
              setUserInput(newInput);
            }}
            value={userInput + "\u2588"}
          />*/}
          <LexicalComposer initialConfig={initialConfig}>
            <PlainTextPlugin
              contentEditable={
                <ContentEditable
                  autoCorrect={false}
                  // autoComplete={false}
                  autoCapitalize={false}
                  spellCheck={false}
                  id="term-body-content-editable"
                />
              }
              placeholder=""
            />
            <OnChangePlugin onChange={onChange} />
            <HistoryPlugin />
            <TransformPlugin />
          </LexicalComposer>
        </div>
      </div>
    </div>
  );
}

function onChange(editorState: EditorState, editor: LexicalEditor) {
  editorState.read(() => {
    // Read the contents of the EditorState here.
    const root = $getRoot();
    const selection = $getSelection();

    // console.log(selection);
  });
}

function TransformPlugin(): null {
  const [editor] = useLexicalComposerContext();

  editor.registerNodeTransform(ParagraphNode, (paragraphNode) => {
    const root = $getRoot();
    const first = root.getFirstDescendant();
    if (!(first instanceof TerminalPrefixNode)) {
      if (
        first == null ||
        (first instanceof ParagraphNode && first.getChildrenSize() === 0)
      ) {
        paragraphNode.append(new TerminalPrefixNode());
        paragraphNode.getParentOrThrow().selectEnd();
      } else {
        first.insertBefore(new TerminalPrefixNode());
      }
    }
  });

  editor.registerCommand<KeyboardEvent>(
    KEY_ARROW_LEFT_COMMAND,
    (event: KeyboardEvent, editor: LexicalEditor) => {
      // If we're holding shift, we're highlighting
      if (event.shiftKey) {
        return false;
      }

      // If not RangeSelection, bail early
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) {
        return false;
      }

      // If any part of the selection contains TerminalPrefixNode
      // set the cursor to the end of TerminalPrefixNode
      const selectionNodes = selection.getNodes();
      if (!selectionNodes.every((n) => !(n instanceof TerminalPrefixNode))) {
        const root = $getRoot();
        const terminalPrefix = root.getFirstDescendant() as TerminalPrefixNode;
        const newSelection = $createRangeSelection();
        newSelection.anchor.set(
          terminalPrefix.getKey(),
          terminalPrefix.getLength(),
          "text"
        );
        newSelection.focus.set(
          terminalPrefix.getKey(),
          terminalPrefix.getLength(),
          "text"
        );
        $setSelection(newSelection);
        event.preventDefault();
        return true;
      }

      return false;
    },
    COMMAND_PRIORITY_EDITOR
  );

  editor.registerCommand<KeyboardEvent>(
    KEY_MODIFIER_COMMAND,
    (event: KeyboardEvent, editor: LexicalEditor) => {
      if (event.ctrlKey && event.key === "c") {
        const paragraph = $createParagraphNode();
        paragraph.append(new TerminalPrefixNode());
        $getRoot().clear();
        $getRoot().append(paragraph);
        $getRoot().selectEnd();

        event.preventDefault();
        return true;
      }
      return false;
    },
    COMMAND_PRIORITY_EDITOR
  );

  editor.registerCommand<void>(
    SELECTION_CHANGE_COMMAND,
    (_event: void, _editor: LexicalEditor) => {
      const selectionNodes = $getSelection()?.getNodes();
      if (selectionNodes == null) {
        return false;
      }

      const selection = $getSelection();
      if (!$isRangeSelection(selection)) {
        console.log(selection);
        return false;
      }

      const offsets = selection.getCharacterOffsets();
      const isPointSelection = offsets[0] === offsets[1];
      if (selectionNodes.length === 1 && isPointSelection) {
        const onlyNode = selectionNodes[0];
        if (onlyNode instanceof TerminalPrefixNode) {
          if (offsets[0] !== onlyNode.getLength()) {
            console.log(selection.focus.offset, selection.anchor.offset);
            // console.log(offsets);
            const newSelection = $createRangeSelection();
            newSelection.anchor.set(
              onlyNode.getKey(),
              onlyNode.getLength(),
              "text"
            );
            newSelection.focus.set(
              onlyNode.getKey(),
              onlyNode.getLength(),
              "text"
            );
            //$setSelection(newSelection);
            return true;
          }
        }
      }

      return false;
    },
    COMMAND_PRIORITY_EDITOR
  );

  editor.registerCommand<KeyboardEvent>(
    MOVE_TO_START,
    (event: KeyboardEvent, editor: LexicalEditor) => {
      const root = $getRoot();
      const selection = $createRangeSelection();

      const terminalPrefix = root.getFirstDescendant();
      if (!(terminalPrefix instanceof TerminalPrefixNode)) {
        return false;
      }

      selection.anchor.set(
        terminalPrefix.getKey(),
        terminalPrefix.getLength(),
        "text"
      );
      selection.focus.set(
        terminalPrefix.getKey(),
        terminalPrefix.getLength(),
        "text"
      );
      $setSelection(selection);

      event.preventDefault();
      return true;
    },
    COMMAND_PRIORITY_EDITOR
  );

  editor.registerCommand<KeyboardEvent>(
    KEY_ENTER_COMMAND,
    (event: KeyboardEvent, editor: LexicalEditor) => {
      const paragraph = $createParagraphNode();
      paragraph.append(new TerminalPrefixNode());
      $getRoot().clear();
      $getRoot().append(paragraph);
      $getRoot().selectEnd();

      event.preventDefault();
      return true;
    },
    COMMAND_PRIORITY_EDITOR
  );

  return null;
}

type SerializedTerminalPrefixNode = Spread<
  {
    type: "terminal-prefix-node";
    version: number;
  },
  SerializedTextNode
>;

class TerminalPrefixNode extends TextNode {
  static getType(): string {
    return "terminal-prefix-node";
  }

  static clone(node: TerminalPrefixNode): TerminalPrefixNode {
    return new TerminalPrefixNode(node.__key);
  }

  constructor(key?: NodeKey) {
    super("~ $ ", key);
    this.__mode = 1;
    this.__detail ^= 1 << 1;
  }

  getLength(): number {
    return this.getTextContent().length;
  }

  createDOM(config: EditorConfig): HTMLElement {
    return super.createDOM(config);
  }

  updateDOM(
    prevNode: TerminalPrefixNode,
    dom: HTMLElement,
    config: EditorConfig
  ): boolean {
    return super.updateDOM(prevNode, dom, config);
  }

  static importJSON(
    jsonNode: SerializedTerminalPrefixNode
  ): TerminalPrefixNode {
    const node = $createTerminalPrefixNode();
    return node;
  }

  exportJSON(): SerializedTerminalPrefixNode {
    return {
      ...super.exportJSON(),
      type: "terminal-prefix-node",
      version: 1,
    };
  }
}

export function $createTerminalPrefixNode(): TerminalPrefixNode {
  return new TerminalPrefixNode();
}
