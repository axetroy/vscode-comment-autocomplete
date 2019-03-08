// tslint:disable: no-invalid-template-strings
import * as vscode from "vscode";

type matcher = RegExp;

export interface ISchema {
  name: string;
  label: string;
  text: string;
  detail?: string;
  document?: vscode.MarkdownString | string;
  style: matcher;
}

const commentStyle: { [k: string]: matcher } = {
  slash: /\/{1,}\s*$/,
  star: /\/\**\s*$/,
  dash: /<!-*\s*$/,
  hash: /#{1,}\s*$/,
  hashBracket: /#\[\s*$/,
  hashArrow: /<#\s*$/
};

export enum Language {
  // the language support /* */ and // style
  js = "javascript",
  jsx = "javascriptreact",
  ts = "typescript",
  tsx = "typescriptreact",
  golang = "go",
  dart = "dart",
  al = "al",
  c = "c",
  cpp = "cpp",
  csharp = "csharp",
  flax = "flax",
  fsharp = "fsharp",
  haxe = "haxe",
  java = "java",
  jsonc = "jsonc",
  less = "less",
  pascal = "pascal",
  objectpascal = "objectpascal",
  php = "php",
  rust = "rust",
  scala = "scala",
  swift = "swift",
  verilog = "verilog",
  // the language only support // style
  asciidoc = "asciidoc",
  // the language only support /* */ style
  css = "css",
  scss = "scss",
  sass = "sass",
  stylus = "stylus",
  vue = "vue",
  // the language only support <!-- --> style
  html = "html",
  xml = "xml",
  markdown = "markdown",
  // the language only support # style
  yaml = "yaml",
  shellscript = "shellscript",
  makefile = "makefile",
  coffeescript = "coffeescript",
  dockerfile = "dockerfile",
  gdscript = "gdscript",
  graphql = "graphql",
  julia = "julia",
  perl = "perl",
  perl6 = "perl6",
  puppet = "puppet",
  r = "r",
  ruby = "ruby",
  tcl = "tcl",
  elixir = "elixir",
  python = "python",
  dotenv = "dotenv",
  gitignore = "gitignore",
  // support #[ ]# style
  nim = "nim",
  // support <# #> style
  powershell = "powershell"
}

enum Style {
  slash,
  star,
  dash,
  hash,
  hashBracket,
  hashArrow
}

const common: ISchema[] = [
  ...generate(
    "TODO",
    [
      Style.slash,
      Style.star,
      Style.dash,
      Style.hash,
      Style.hashBracket,
      Style.hashArrow
    ],
    {
      text: "TODO: ${do what?}"
    }
  ),
  ...generate(
    "FIXME",
    [
      Style.slash,
      Style.star,
      Style.dash,
      Style.hash,
      Style.hashBracket,
      Style.hashArrow
    ],
    {
      text: "FIXME: ${fix what?}"
    }
  )
];

const eslint: ISchema[] = [
  ...generate("eslint-disable", [Style.slash, Style.star], {
    text: "eslint-disable ${rule1, rule2, rule3}"
  }),
  ...generate("eslint-enable", [Style.slash, Style.star]),
  ...generate("eslint-disable-next-line", [Style.slash, Style.star], {
    text: "eslint-disable-next-line ${rule1, rule2, rule3}"
  })
];

const jslint: ISchema[] = [
  ...generate("jshint ignore:start", [Style.slash, Style.star]),
  ...generate("jshint ignore:end", [Style.slash, Style.star]),
  ...generate("jshint strict: true", [Style.slash, Style.star], {
    text: "jshint strict: ${true}"
  }),
  ...generate("jslint vars: true", [Style.slash, Style.star], {
    text: "jslint vars: ${true}"
  })
];

const webpack: ISchema[] = [
  ...generate("webpackChunkName", [Style.star], {
    text: "webpackChunkName: ${'chunkName'}"
  })
];

const prettier: ISchema[] = [
  ...generate("prettier-ignore", [Style.slash, Style.star, Style.dash]),
  ...generate("prettier-ignore-attribute", [Style.dash], {
    text: "prettier-ignore-attribute ${attribute1, attribute2}"
  }),
  ...generate("prettier-ignore-start", [Style.dash]),
  ...generate("prettier-ignore-end", [Style.dash])
];

const typescript: ISchema[] = [...generate("@ts-ignore", [Style.slash])];

const tslint: ISchema[] = [
  ...generate("tslint:enable", [Style.slash, Style.star]),
  ...generate("tslint:disable", [Style.slash, Style.star], {
    text: "tslint:disable: ${rule1 rule2 rule3...}"
  }),
  ...generate("tslint:disable-next-line", [Style.slash, Style.star], {
    text: "tslint:disable-next-line: ${rule1 rule2 rule3...}"
  })
];

interface ISchemas {
  selector: vscode.DocumentSelector;
  schemas: ISchema[];
  triggerCharacters: string[];
}

export const schemas: ISchemas[] = [
  // /* */ and // style
  {
    selector: [
      Language.js,
      Language.jsx,
      Language.ts,
      Language.tsx,
      Language.vue,
      Language.jsonc,
      Language.golang,
      Language.dart,
      Language.al,
      Language.c,
      Language.cpp,
      Language.csharp,
      Language.flax,
      Language.fsharp,
      Language.haxe,
      Language.java,
      Language.pascal,
      Language.objectpascal,
      Language.php,
      Language.rust,
      Language.scala,
      Language.swift,
      Language.verilog
    ],
    schemas: [...filter(common, [commentStyle.slash, commentStyle.star])],
    triggerCharacters: ["/", "*", " "]
  },
  // javascript
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
  // typescript
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
  // // style
  {
    selector: [Language.asciidoc],
    schemas: [...filter(common, commentStyle.slash)],
    triggerCharacters: ["/"]
  },
  // /* */ style
  {
    selector: [Language.css, Language.scss, Language.sass, Language.stylus],
    schemas: [
      ...filter(common, commentStyle.star),
      ...filter(prettier, commentStyle.star)
    ],
    triggerCharacters: ["/", "*", " "]
  },
  // <!-- --> style
  {
    selector: [Language.html, Language.markdown, Language.xml],
    schemas: [
      ...filter(common, [commentStyle.dash]),
      ...filter(prettier, [commentStyle.dash])
    ],
    triggerCharacters: ["<", "!", "-", " "]
  },
  // # style
  {
    selector: [
      Language.yaml,
      Language.shellscript,
      Language.makefile,
      Language.coffeescript,
      Language.dockerfile,
      Language.gdscript,
      Language.graphql,
      Language.julia,
      Language.perl,
      Language.perl6,
      Language.puppet,
      Language.r,
      Language.ruby,
      Language.tcl,
      Language.elixir,
      Language.python,
      Language.dotenv,
      Language.gitignore
    ],
    schemas: [...filter(common, [commentStyle.hash])],
    triggerCharacters: ["#"]
  },
  // #[ ]# style
  {
    selector: [Language.nim],
    schemas: [...filter(common, [commentStyle.hashBracket])],
    triggerCharacters: ["#", "["]
  },
  // <# #> style
  {
    selector: [Language.powershell],
    schemas: [...filter(common, [commentStyle.hashArrow])],
    triggerCharacters: ["<", "#"]
  }
];

// filter schema
function filter(schema: ISchema[], style: matcher | matcher[]): ISchema[] {
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
    let style: matcher;
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
      case Style.hash:
        prefix = "# ";
        style = commentStyle.hash;
        break;
      case Style.hashBracket:
        prefix = "#[ ";
        suffix = " ]#";
        style = commentStyle.hashBracket;
        break;
      case Style.hashArrow:
        prefix = "<# ";
        suffix = " #>";
        style = commentStyle.hashArrow;
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
