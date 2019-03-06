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
        .match(schema.style.start);

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
            return s.schemas.map(
              v => new CommentCompletionItem(v, document, position)
            );
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
