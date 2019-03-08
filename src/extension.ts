"use strict";
import VSCODE = require("vscode");
import { schemas, ISchema } from "./schema";

interface IFocusArg {
  start: VSCODE.Position;
  end: VSCODE.Position;
}

export function activate(context: VSCODE.ExtensionContext) {
  const vs: typeof VSCODE = require("vscode");

  vs.commands.registerCommand("comment-complete.focus", (argv: IFocusArg) => {
    const editor = vs.window.activeTextEditor;
    if (!editor) {
      return;
    }
    editor.selection = new vs.Selection(argv.start, argv.end);
  });

  class CommentCompletionItem extends vs.CompletionItem {
    constructor(
      schema: ISchema,
      document: VSCODE.TextDocument,
      position: VSCODE.Position
    ) {
      super(schema.label, VSCODE.CompletionItemKind.Snippet);
      const reg = /\$\{([^\}]+)\}/;

      this.detail = schema.detail;
      this.documentation = schema.document;
      this.insertText = schema.text.replace(reg, "$1");

      const line = document.lineAt(position.line).text;
      const prefix = line.slice(0, position.character).match(schema.style);

      // the text insert start and end
      const start = position.translate(0, prefix ? -prefix[0].length : 0);
      const end = position.translate(0, 0);

      this.range = new VSCODE.Range(start, end);

      const matcher = schema.text.match(reg);

      if (matcher) {
        const content = matcher[1];
        const index = matcher.index || 0;

        const focusStart = start.translate(0, index);
        const focusEnd = focusStart.translate(0, +content.length);

        this.command = {
          title: "focus",
          command: "comment-complete.focus",
          arguments: [{ document, start: focusStart, end: focusEnd }]
        };
      }
    }
  }

  for (const s of schemas) {
    context.subscriptions.push(
      vs.languages.registerCompletionItemProvider(
        s.selector,
        {
          provideCompletionItems: (
            document: VSCODE.TextDocument,
            position: VSCODE.Position,
            token: VSCODE.CancellationToken
          ) => {
            const completes: CommentCompletionItem[] = [];
            const line = document.lineAt(position.line).text;
            const prefix = line.slice(0, position.character);
            for (const schema of s.schemas) {
              // if line a new line
              if (position.character === 1) {
                completes.push(
                  new CommentCompletionItem(schema, document, position)
                );
                continue;
              }

              // the the whole line match
              if (new RegExp("^" + schema.style.source).test(line)) {
                completes.push(
                  new CommentCompletionItem(schema, document, position)
                );
                continue;
              }

              const validMatcher = prefix.match(schema.style);

              if (validMatcher) {
                if (validMatcher[0].length >= 2) {
                  completes.push(
                    new CommentCompletionItem(schema, document, position)
                  );
                  continue;
                }
              }

              const validRegWithSpace = new RegExp("\\s" + schema.style.source);
              if (validRegWithSpace.test(prefix)) {
                completes.push(
                  new CommentCompletionItem(schema, document, position)
                );
                continue;
              }
            }
            return completes;
          }
        },
        ...s.triggerCharacters
      )
    );
  }
}

// this method is called when your extension is deactivated
export function deactivate(context: VSCODE.ExtensionContext) {
  //
}
