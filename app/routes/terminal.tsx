import { useCallback, useMemo, useState } from "react";
import styles from "~/styles/terminal.css";
import lexicalStyles from "~/styles/terminal-lexical.css";

import { mergeRegister } from "@lexical/utils";
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
  KEY_ARROW_DOWN_COMMAND,
  KEY_ARROW_LEFT_COMMAND,
  KEY_ARROW_RIGHT_COMMAND,
  KEY_ARROW_UP_COMMAND,
  KEY_ENTER_COMMAND,
  KEY_MODIFIER_COMMAND,
  LexicalEditor,
  MOVE_TO_START,
  NodeKey,
  NodeSelection,
  ParagraphNode,
  RangeSelection,
  SELECTION_CHANGE_COMMAND,
  SerializedEditorState,
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
import { parseEditorState } from "lexical/LexicalUpdates";
import { cloneEditorState } from "lexical/LexicalEditorState";

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

export default function Index() {
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
          <ActiveComposer />
        </div>
      </div>
    </div>
  );
}

function ActiveComposer() {
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

  const [commandHistory, setCommandHistory] = useState<
    Array<{ editorState: EditorState; timeStamp: number }>
  >([]);
  const [commandPointer, setCommandPointer] = useState(0);
  const [lastClearedCommandIndex, setLastClearedCommandIndex] = useState<
    number | undefined
  >(undefined);

  const onEnter = (newCommand: EditorState) => {
    storeCommandToHistory(newCommand);
    executeCommand(newCommand);
  };

  const onCtrlC = (newCommand: EditorState) => {
    storeCommandToHistory(newCommand);
  };

  const storeCommandToHistory = (newCommand: EditorState) => {
    setCommandPointer(0);
    setCommandHistory((prev) => {
      const endSelection = $createRangeSelection();
      const end = $getRoot().getLastDescendant();
      if (end != null) {
        endSelection.anchor.set(end.getKey(), end.getTextContentSize(), "text");
        endSelection.focus.set(end.getKey(), end.getTextContentSize(), "text");
      }
      return [
        ...prev,
        {
          editorState: newCommand.clone(endSelection),
          timeStamp: Date.now(),
        },
      ];
    });
  };

  const executeCommand = (newCommand: EditorState) => {
    newCommand.read(() => {
      // TODO: Going to need editor to be passed in here so we can update

      /**
       * Clean up command and strip prefix characters
       */
      let command = $getRoot().getTextContent();
      const terminalPrefix = $getRoot().getFirstDescendant();
      if (terminalPrefix instanceof TerminalPrefixNode) {
        if (command.startsWith(terminalPrefix.getTextContent())) {
          command = command.substring(terminalPrefix.getTextContentSize());
        }
      }
      command = command.trim();

      /**
       * Match and dispatch the commands
       */
      switch (command) {
        case "clear":
          setLastClearedCommandIndex(commandHistory.length);
          break;

        default:
          console.log("Unhandled: ", command);
          break;
      }
    });
  };

  const onGetCommandHistory = useCallback(
    (history: "prev" | "next") => {
      const lastIndex = commandHistory.length;
      let newPointer;
      switch (history) {
        case "prev":
          newPointer = Math.min(lastIndex, commandPointer + 1);
          break;
        case "next":
          newPointer = Math.max(0, commandPointer - 1);
          break;
      }

      setCommandPointer(newPointer);

      if (newPointer === 0) {
        return null;
      } else {
        const atPointer = commandHistory[lastIndex - newPointer];
        return { ...atPointer, editorState: atPointer?.editorState?.clone() };
      }
    },
    [commandHistory, commandPointer]
  );

  return (
    <>
      {commandHistory
        .slice(
          lastClearedCommandIndex != undefined
            ? lastClearedCommandIndex + 1
            : undefined
        )
        .map((history) => (
          <LexicalComposer
            key={history.timeStamp}
            initialConfig={{
              ...initialConfig,
              editable: false,
              editorState: history.editorState,
            }}
          >
            <PlainTextPlugin
              contentEditable={
                <ContentEditable
                  readOnly={true}
                  className="term-body-content-editable"
                />
              }
              placeholder=""
            />
          </LexicalComposer>
        ))}
      <LexicalComposer initialConfig={initialConfig}>
        <PlainTextPlugin
          contentEditable={
            <ContentEditable
              autoCorrect={false}
              // autoComplete={false}
              autoCapitalize={false}
              spellCheck={false}
              className="term-body-content-editable"
            />
          }
          placeholder=""
        />

        <HistoryPlugin />

        <PreservePrefixPlugin />
        <TerminalKeyCommandsPlugin
          onCtrlC={onCtrlC}
          onEnter={onEnter}
          onGetCommandHistory={onGetCommandHistory}
        />
      </LexicalComposer>
    </>
  );
}

function PreservePrefixPlugin(): null {
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
    KEY_ARROW_RIGHT_COMMAND,
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
      // and the end of the offset is not the end of the TerminalPrefixNode,
      //  set the cursor to the end of TerminalPrefixNode
      const selectionNodes = selection.getNodes();
      if (!selectionNodes.every((n) => !(n instanceof TerminalPrefixNode))) {
        const offsets = selection.getCharacterOffsets();
        const root = $getRoot();
        const terminalPrefix = root.getFirstDescendant() as TerminalPrefixNode;
        if (offsets[1] < terminalPrefix.getLength()) {
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
      }
      return false;
    },
    COMMAND_PRIORITY_EDITOR
  );

  editor.registerCommand<MouseEvent>(
    CLICK_COMMAND,
    (event: MouseEvent, editor: LexicalEditor) => {
      const selectionNodes = $getSelection()?.getNodes();
      if (selectionNodes == null) {
        return false;
      }

      const selection = $getSelection();
      if (!$isRangeSelection(selection)) {
        return false;
      }

      const offsets = selection.getCharacterOffsets();
      const isPointSelection = offsets[0] === offsets[1];
      if (selectionNodes.length === 1 && isPointSelection) {
        const onlyNode = selectionNodes[0];
        if (onlyNode instanceof TerminalPrefixNode) {
          if (offsets[0] !== onlyNode.getLength()) {
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
            $setSelection(newSelection);
            event.preventDefault();
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

  return null;
}

function TerminalKeyCommandsPlugin(props: {
  onCtrlC: (command: EditorState) => void;
  onEnter: (command: EditorState) => void;
  onGetCommandHistory: (history: "prev" | "next") => {
    editorState: EditorState;
    timeStamp: number;
  } | null;
}): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand<KeyboardEvent>(
        KEY_ARROW_UP_COMMAND,
        (event: KeyboardEvent, editor: LexicalEditor) => {
          const history = props.onGetCommandHistory("prev");
          if (history != null) {
            editor.setEditorState(history.editorState);
          }
          event.preventDefault();
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerCommand<KeyboardEvent>(
        KEY_ARROW_DOWN_COMMAND,
        (event: KeyboardEvent, editor: LexicalEditor) => {
          const history = props.onGetCommandHistory("next");
          if (history != null) {
            editor.setEditorState(history.editorState);
          } else {
            $clearEntry();
          }
          event.preventDefault();
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerCommand(
        KEY_MODIFIER_COMMAND,
        (event, editor) => {
          if (event.ctrlKey && event.key === "c") {
            props.onCtrlC(editor.getEditorState());
            $clearEntry();
            event.preventDefault();
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerCommand<KeyboardEvent>(
        KEY_ENTER_COMMAND,
        (event: KeyboardEvent, editor: LexicalEditor) => {
          props.onEnter(editor.getEditorState());
          $clearEntry();
          event.preventDefault();
          return true;
        },
        COMMAND_PRIORITY_CRITICAL /* COMMAND_PRIORITY_EDITOR not working for some reason */
      )
    );
  }, [editor, props.onGetCommandHistory, props.onEnter, props.onCtrlC]);

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

export function $clearEntry(): void {
  const paragraph = $createParagraphNode();
  paragraph.append(new TerminalPrefixNode());
  $getRoot().clear();
  $getRoot().append(paragraph);
  $getRoot().selectEnd();
}

/**
 * TODO
 * [] Handle commands
 * [] Use block cursor
 * [] Autofocus when clicking anywhere within terminal
 *
 */
