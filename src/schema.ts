import * as vscode from "vscode";

export interface ISchema {
  name: string;
  label: string;
  text: string;
  detail?: string;
  document?: vscode.MarkdownString | string;
  style: ICommentRegExp;
}

interface ICommentRegExp {
  start: string;
  end: string;
}

const commentStyle: { [k: string]: ICommentRegExp } = {
  slash: {
    start: "\\/*\\**\\s*$",
    end: ".*"
  },
  star: {
    start: "\\/*\\**\\s*$",
    end: "\\**\\/"
  },
  dash: {
    start: "<\\!-*\\s*$",
    end: "-*>"
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
  slash,
  star,
  dash
}

const common: ISchema[] = [
  ...generate("TODO", [Style.slash, Style.star, Style.dash], {
    // tslint:disable-next-line
    text: "TODO: ${do what?}"
  }),
  ...generate("FIXME", [Style.slash, Style.star, Style.dash], {
    // tslint:disable-next-line
    text: "FIXME: ${fix what?}"
  })
];

const eslint: ISchema[] = [
  ...generate("eslint-disable", [Style.slash, Style.star], {
    // tslint:disable-next-line
    text: "eslint-disable ${rule1, rule2, rule3}"
  }),
  ...generate("eslint-enable", [Style.slash, Style.star]),
  ...generate("eslint-disable-next-line", [Style.slash, Style.star], {
    // tslint:disable-next-line
    text: "eslint-disable-next-line ${rule1, rule2, rule3}"
  })
];

const jslint: ISchema[] = [
  ...generate("jshint ignore:start", [Style.slash, Style.star]),
  ...generate("jshint ignore:end", [Style.slash, Style.star]),
  ...generate("jshint strict: true", [Style.slash, Style.star], {
    // tslint:disable-next-line
    text: "jshint strict: ${true}"
  }),
  ...generate("jslint vars: true", [Style.slash, Style.star], {
    // tslint:disable-next-line
    text: "jslint vars: ${true}"
  })
];

const webpack: ISchema[] = [
  ...generate("webpackChunkName", [Style.star], {
    // tslint:disable-next-line
    text: "webpackChunkName: ${'chunkName'}"
  })
];

const prettier: ISchema[] = [
  ...generate("prettier-ignore", [Style.slash, Style.star, Style.dash]),
  ...generate("prettier-ignore-attribute", [Style.dash], {
    // tslint:disable-next-line
    text: "prettier-ignore-attribute ${attribute1, attribute2}"
  }),
  ...generate("prettier-ignore-start", [Style.dash]),
  ...generate("prettier-ignore-end", [Style.dash])
];

const typescript: ISchema[] = [
  ...generate("@ts-ignore", [Style.slash, Style.star])
];

const tslint: ISchema[] = [
  ...generate("tslint:enable", [Style.slash, Style.star]),
  ...generate("tslint:disable", [Style.slash, Style.star], {
    // tslint:disable-next-line
    text: "tslint:disable: ${rule1 rule2 rule3...}"
  }),
  ...generate("tslint:disable-next-line", [Style.slash, Style.star], {
    // tslint:disable-next-line
    text: "tslint:disable-next-line: ${rule1 rule2 rule3...}"
  })
];

interface ISchemas {
  selector: vscode.DocumentSelector;
  schemas: ISchema[];
  triggerCharacters: string[];
}

export const schemas: ISchemas[] = [
  // common files
  {
    selector: [
      Language.js,
      Language.jsx,
      Language.ts,
      Language.tsx,
      Language.vue
    ],
    schemas: [...filter(common, [commentStyle.slash, commentStyle.star])],
    triggerCharacters: ["/", "*", " "]
  },
  // javascript like
  {
    selector: [Language.js, Language.jsx],
    schemas: [
      ...eslint,
      ...jslint,
      ...webpack,
      ...filter(prettier, [commentStyle.slash, commentStyle.star])
    ],
    triggerCharacters: ["/", "*", " "]
  },
  // typescript like
  {
    selector: [Language.ts, Language.tsx],
    schemas: [
      ...typescript,
      ...tslint,
      ...webpack,
      ...filter(prettier, [commentStyle.slash, commentStyle.star])
    ],
    triggerCharacters: ["/", "*", " "]
  },
  // css like
  {
    selector: [Language.css, Language.scss, Language.less, Language.sass],
    schemas: [
      ...filter(common, commentStyle.star),
      ...filter(prettier, commentStyle.star)
    ],
    triggerCharacters: ["/", "*", " "]
  },
  // html/markdown
  {
    selector: [Language.html, Language.markdown],
    schemas: [
      ...filter(common, [commentStyle.dash]),
      ...filter(prettier, [commentStyle.dash])
    ],
    triggerCharacters: ["<", "!", "-", " "]
  }
];

// filter schema
function filter(
  schema: ISchema[],
  style: ICommentRegExp | ICommentRegExp[]
): ISchema[] {
  const styles = Array.isArray(style) ? style : [style];
  const result: ISchema[] = [];
  for (const s of schema) {
    if (styles.includes(s.style)) {
      result.push(s);
    }
  }
  return result;
}

// generate schema
function generate(
  name: string,
  styles: Style[],
  options: { text?: string } = {}
): ISchema[] {
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
        prefix = "// ";
        style = commentStyle.slash;
    }
    return {
      name: name.split(" ")[0],
      label: prefix + name + suffix,
      text: prefix + (options.text || name) + suffix,
      style
    };
  });
}
