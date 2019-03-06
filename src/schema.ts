import * as vscode from "vscode";

export interface ISchema {
  label: string;
  text: string;
  detail?: string;
  document?: vscode.MarkdownString | string;
  style: ICommentRegExp;
}

interface ICommentRegExp {
  start: RegExp;
  end: RegExp;
}

const commentStyle: { [k: string]: ICommentRegExp } = {
  slash: {
    start: /\/*\s*$/,
    end: /.*/
  },
  star: {
    start: /\/*\**$/,
    end: /\**\//
  },
  dash: {
    start: /<\!?-*\s*$/,
    end: /-*>/
  }
};

export enum Language {
  js = "javascript",
  jsx = "javascriptreact",
  ts = "typescript",
  tsx = "typescriptreact",
  css = "css",
  scss = "scss",
  less = "less",
  sass = "sass",
  html = "html",
  vue = "vue",
  markdown = "markdown"
}

enum Style {
  slash = "//",
  star = "/*",
  dash = "<!--"
}

const common: ISchema[] = [
  ...generate("TODO", [Style.slash, Style.star, Style.dash]),
  ...generate("FIXME", [Style.slash, Style.star, Style.dash])
];

const eslint: ISchema[] = [
  ...generate("eslint-disable", [Style.slash, Style.star]),
  ...generate("eslint-enable", [Style.slash, Style.star]),
  ...generate("eslint-disable-next-line", [Style.slash, Style.star])
];

const prettier: ISchema[] = [
  ...generate("prettier-ignore", [Style.slash, Style.star, Style.dash]),
  ...generate("prettier-ignore-attribute", [Style.dash]),
  ...generate("prettier-ignore-start", [Style.dash]),
  ...generate("prettier-ignore-end", [Style.dash])
];

const typescript: ISchema[] = [
  ...generate("@ts-ignore", [Style.slash, Style.star]),
  ...generate("tslint:enable", [Style.slash, Style.star]),
  ...generate("tslint:disable", [Style.slash, Style.star]),
  ...generate("tslint:disable:rule1 rule2 rule3...", [Style.slash, Style.star]),
  ...generate("tslint:disable-next-line", [Style.slash, Style.star]),
  ...generate("tslint:disable-next-line:rule1 rule2 rule3...", [
    Style.slash,
    Style.star
  ])
];

interface ISchemas {
  selector: vscode.DocumentSelector;
  schemas: ISchema[];
  triggerCharacters: string[];
}

export const schemas: ISchemas[] = [
  // 通用的javascript/vue
  {
    selector: [
      Language.js,
      Language.jsx,
      Language.ts,
      Language.tsx,
      Language.vue
    ],
    schemas: [
      ...filter(common, commentStyle.slash),
      ...filter(common, commentStyle.star)
    ],
    triggerCharacters: ["/", "*"]
  },
  // javascript
  {
    selector: [Language.js, Language.jsx],
    schemas: [
      ...eslint,
      ...filter(prettier, commentStyle.slash),
      ...filter(prettier, commentStyle.star)
    ],
    triggerCharacters: ["/", "*"]
  },
  // typescript
  {
    selector: [Language.ts, Language.tsx],
    schemas: [
      ...typescript,
      ...filter(prettier, commentStyle.slash),
      ...filter(prettier, commentStyle.star)
    ],
    triggerCharacters: ["/", "*"]
  },
  // css
  {
    selector: [
      Language.css,
      Language.scss,
      Language.less,
      Language.sass,
      Language.markdown
    ],
    schemas: [
      ...filter(common, commentStyle.star),
      ...filter(prettier, commentStyle.star)
    ],
    triggerCharacters: ["/", "*"]
  },
  // html/markdown
  {
    selector: [Language.html, Language.markdown],
    schemas: [
      ...filter(common, commentStyle.dash),
      ...filter(prettier, commentStyle.dash)
    ],
    triggerCharacters: ["<"]
  }
];

// filter schema
function filter(schema: ISchema[], style: ICommentRegExp) {
  return schema.filter(v => v.style.start === style.start);
}

// generate schema
function generate(name: string, styles: Style | Style[]): ISchema[] {
  if (!Array.isArray(styles)) {
    styles = [styles];
  }
  return styles.map(v => {
    let prefix = "";
    let suffix = "";
    let style: ICommentRegExp;
    switch (v) {
      case Style.slash:
        prefix = "// ";
        style = commentStyle.slash;
        break;
      case Style.star:
        prefix = "/* ";
        suffix = " */";
        style = commentStyle.star;
        break;
      case Style.dash:
        prefix = "<!-- ";
        suffix = " -->";
        style = commentStyle.dash;
        break;
      default:
        style = commentStyle.slash;
    }
    return {
      label: prefix + name + suffix,
      text: prefix + name + suffix,
      style
    };
  });
}
