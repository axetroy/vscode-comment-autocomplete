"use strict";
import VSCODE = require("vscode");
import { schemas, ISchema } from "./schema";

export function activate(context: VSCODE.ExtensionContext) {
  const vs: typeof VSCODE = require("vscode");

  class CommentCompletionItem extends vs.CompletionItem {
    constructor(
      schema: ISchema,
      document: VSCODE.TextDocument,
      position: VSCODE.Position
    ) {
      super(schema.label, VSCODE.CompletionItemKind.Snippet);
      this.insertText = schema.text;
      this.detail = schema.detail;
      this.documentation = schema.document;

      const line = document.lineAt(position.line).text;
      const prefix = line
        .slice(0, position.character)
        .match(new RegExp(schema.style.start));

      // the text insert start and end
      const start = position.translate(0, prefix ? -prefix[0].length : 0);
      const end = position.translate(0, 0);

      this.range = new VSCODE.Range(start, end);
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
              if (new RegExp("^" + schema.style.start).test(line)) {
                completes.push(
                  new CommentCompletionItem(schema, document, position)
                );
                continue;
              }

              const validRegWithSecondType = new RegExp(schema.style.start);
              const validMatcher = prefix.match(validRegWithSecondType);

              if (validMatcher) {
                if (validMatcher[0].length >= 2) {
                  completes.push(
                    new CommentCompletionItem(schema, document, position)
                  );
                  continue;
                }
              }

              const validRegWithSpace = new RegExp("\\s" + schema.style.start);
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
