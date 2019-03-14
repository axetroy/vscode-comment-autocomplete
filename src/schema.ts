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
  arrowDash: /<!-*\s*$/,
  hash: /#{1,}\s*$/,
  hashBracket: /#\[\s*$/,
  hashArrow: /<#\s*$/,
  dashdash: /--{1,}\s*$/,
  dash: /-{1,}\s*$/,
  quote: /'\s*$/,
  percent: /\%\s*$/,
  semicolon: /\;\s*$/
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
  terraform = "terraform",
  // support #[ ]# style
  nim = "nim",
  // support <# #> style
  powershell = "powershell",
  // support -- styles
  ada = "ada",
  hivesql = "hive-sql",
  lua = "lua",
  pig = "pig",
  plsql = "plsql",
  sql = "sql",
  // - style
  haskell = "haskell",
  // ' style
  vb = "vb",
  diagram = "diagram",
  // % style
  bibtex = "bibtex",
  erlang = "erlang",
  latex = "latex",
  matlab = "matlab",
  // ; style
  clojure = "clojure",
  racket = "racket",
  lisp = "lisp"
}

enum Style {
  slash,
  star,
  arrowDash,
  hash,
  hashBracket,
  hashArrow,
  dashdash,
  dash,
  quote,
  percent,
  semicolon
}

const commonStyles = [
  Style.slash,
  Style.star,
  Style.arrowDash,
  Style.hash,
  Style.hashBracket,
  Style.hashArrow,
  Style.dashdash,
  Style.dash,
  Style.quote,
  Style.percent,
  Style.semicolon
];

// SEE: https://www.python.org/dev/peps/pep-0350/
const common: ISchema[] = [
  ...generate("TODO", commonStyles, {
    text: "TODO: ${do something}",
    document: "TODO: Informal tasks/features that are pending completion."
  }),
  ...generate("FIXME", commonStyles, {
    text: "FIXME: ${bug}",
    document:
      "FIXME: Areas of problematic or ugly code needing refactoring or cleanup."
  }),
  ...generate("BUG", commonStyles, {
    text: "BUG: ${#1024}",
    document: "BUG: Reported defects tracked in bug database."
  }),
  ...generate("NOBUG", commonStyles, {
    text: "NOBUG: ${WONTFIX}",
    document:
      "NOBUG: Problems that are well-known but will never be addressed due to design problems or domain limitations."
  }),
  ...generate("REQ", commonStyles, {
    text: "REQ: ${requirements}",
    document: "REQ: Satisfactions of specific, formal requirements."
  }),
  ...generate("RFE", commonStyles, {
    text: "RFE: ${Requests For Enhancement}",
    document: "RFE: Roadmap items not yet implemented."
  }),
  ...generate("IDEA", commonStyles, {
    text: "IDEA: ${what ideas}",
    document: "IDEA: Possible RFE candidates, but less formal than RFE."
  }),
  ...generate("???", commonStyles, {
    text: "???: ${confused here}",
    document: "???: Misunderstood details."
  }),
  ...generate("!!!", commonStyles, {
    text: "!!!: ${alert}",
    document: "!!!: In need of immediate attention."
  }),
  ...generate("HACK", commonStyles, {
    text: "HACK: ${HACK}",
    document:
      "HACK: Temporary code to force inflexible functionality, or simply a test change, or workaround a known problem."
  }),
  ...generate("PORT", commonStyles, {
    text: "PORT: ${Portability}",
    document: "PORT: Workarounds specific to OS, Python version, etc."
  }),
  ...generate("CAVEAT", commonStyles, {
    text: "CAVEAT: ${Caveats}",
    document:
      "CAVEAT: Implementation details/gotchas that stand out as non-intuitive."
  }),
  ...generate("NOTE", commonStyles, {
    text: "NOTE: ${NOTE}",
    document:
      "NOTE: Sections where a code reviewer found something that needs discussion or further investigation."
  }),
  ...generate("FAQ", commonStyles, {
    text: "FAQ: ${The question: the answer}",
    document: "FAQ: Interesting areas that require external explanation."
  }),
  ...generate("GLOSS", commonStyles, {
    text: "GLOSS: ${Glossary}",
    document: "GLOSS: Definitions for project glossary."
  }),
  ...generate("SEE", commonStyles, {
    text: "SEE: ${https://xxx.com}",
    document: "See: Pointers to other code, web link, etc."
  }),
  ...generate("TODOC", commonStyles, {
    text: "TODOC: ${Needs Documentation}",
    document: "TODOC: Areas of code that still need to be documented."
  }),
  ...generate("CRED", commonStyles, {
    text: "CRED: ${Credits}",
    document: "CRED: Accreditations for external provision of enlightenment."
  }),
  ...generate("STAT", commonStyles, {
    text: "STAT: ${STAT}",
    document: "STAT: File-level statistical indicator of maturity of this file."
  }),
  ...generate("RVD", commonStyles, {
    text: "RVD: ${Review message}",
    document: "RVD: File-level indicator that review was conducted."
  })
];

// SEE: https://babeljs.io/docs/en/babel-plugin-transform-react-jsx#custom
const jsx: ISchema[] = [
  ...generate("@jsx h", [Style.star], {
    text: "@jsx ${h}",
    document: new vscode.MarkdownString(
      `"Tell \`Babel\` to transform JSX into \`h()\` calls"`
    )
  })
];

// SEE: https://eslint.org/docs/user-guide/configuring#disabling-rules-with-inline-comments
const eslint: ISchema[] = [
  ...generate("eslint-disable", [Style.slash, Style.star], {
    text: "eslint-disable ${rule1, rule2, rule3}",
    document: new vscode.MarkdownString(
      `enable warnings for specific rules
\`\`\`javascript
/* eslint-disable */

alert('foo');

/* eslint-enable */
\`\`\`
      `
    )
  }),
  ...generate("eslint-enable", [Style.slash, Style.star], {
    text: "eslint-enable ${rule1, rule2, rule3}",
    document: new vscode.MarkdownString(
      `enable warnings for specific rules
\`\`\`javascript
/* eslint-disable no-alert, no-console */

alert('foo');
console.log('bar');

/* eslint-enable no-alert, no-console */
\`\`\`

To disable rule warnings in an entire file, put a \`/* eslint-disable */\` block comment at the top of the file:

\`\`\`javascript
/* eslint-disable */

alert('foo');
\`\`\`
      `
    )
  }),
  ...generate("eslint-disable-line", [Style.slash, Style.star], {
    text: "eslint-disable-line ${rule1, rule2, rule3}",
    document: new vscode.MarkdownString(
      `disable warnings for specific line
\`\`\`javascript
alert('foo'); // eslint-disable-line
\`\`\`
      `
    )
  }),
  ...generate("eslint-disable-next-line", [Style.slash, Style.star], {
    text: "eslint-disable-next-line ${rule1, rule2, rule3}",
    document: new vscode.MarkdownString(
      `disable warnings for specific next line
\`\`\`javascript
// eslint-disable-next-line
alert('foo');
\`\`\`
      `
    )
  }),
  ...generate("eslint-global", [Style.slash, Style.star], {
    text: "global ${var1, var2}",
    document: new vscode.MarkdownString(
      `to specify globals variable
\`\`\`javascript
// global deno
console.log(deno.version)
\`\`\`
      `
    )
  }),
  ...generate("eslint-env", [Style.slash, Style.star], {
    text: "eslint-env ${env1, env2}",
    document: new vscode.MarkdownString(
      `to specify environment
\`\`\`javascript
/* eslint-env node, mocha */
\`\`\`
      `
    )
  })
];

// SEE: https://jshint.com/docs/
const jslint: ISchema[] = [
  ...generate("jshint ignore:start", [Style.slash, Style.star], {
    document: new vscode.MarkdownString(
      `A directive for telling JSHint to ignore a block of code.
\`\`\`javascript
// Code here will be linted with JSHint.
/* jshint ignore:start */
// Code here will be ignored by JSHint.
/* jshint ignore:end */
\`\`\`
      `
    )
  }),
  ...generate("jshint ignore:end", [Style.slash, Style.star], {
    document: new vscode.MarkdownString(
      `A directive for telling JSHint to ignore a block of code.
\`\`\`javascript
// Code here will be linted with JSHint.
/* jshint ignore:start */
// Code here will be ignored by JSHint.
/* jshint ignore:end */
\`\`\`
      `
    )
  }),
  ...generate("jshint ignore:line", [Style.slash, Style.star], {
    document: new vscode.MarkdownString(
      `ignore a single line with a trailing comment
\`\`\`javascript
ignoreThis(); // jshint ignore:line
\`\`\`
      `
    )
  }),
  ...generate("jshint strict: true", [Style.slash, Style.star], {
    text: "jshint strict: ${true}",
    document: new vscode.MarkdownString(
      `A directive for setting JSHint options.
\`\`\`javascript
/* jshint strict: true */
\`\`\`
      `
    )
  }),
  ...generate("jslint vars: true", [Style.slash, Style.star], {
    text: "jslint vars: ${true}",
    document: new vscode.MarkdownString(
      `A directive for setting JSHint-compatible JSLint options.
\`\`\`javascript
/* jslint vars: true */
\`\`\`
      `
    )
  }),
  ...generate("jslint globals", [Style.slash, Style.star], {
    text: "jslint globals ${MY_LIB: false}",
    document: new vscode.MarkdownString(
      `A directive for telling JSHint about global variables that are defined elsewhere. If value is false (default), JSHint will consider that variable as read-only.
\`\`\`javascript
/* globals MY_LIB: false */
\`\`\`
      `
    )
  }),
  ...generate("jslint exported", [Style.slash, Style.star], {
    text: "exported ${EXPORTED_LIB}",
    document: new vscode.MarkdownString(
      `A directive for telling JSHint about global variables that are defined in the current file but used elsewhere.
\`\`\`javascript
/* exported EXPORTED_LIB */
\`\`\`
      `
    )
  })
];

const webpack: ISchema[] = [
  ...generate("webpackChunkName", [Style.star], {
    text: "webpackChunkName: ${'chunkName'}",
    document: new vscode.MarkdownString(
      `specify chunk name
\`\`\`javascript
require(/* webpackChunkName: 'chunkName' */'typescript')
\`\`\`
      `
    )
  })
];

// SEE: https://prettier.io/docs/en/ignore.html
const prettier: ISchema[] = [
  ...generate("prettier-ignore", [Style.slash, Style.star, Style.arrowDash], {
    document: new vscode.MarkdownString(
      `exclude the next node in the abstract syntax tree from formatting.
### Javascript
\`\`\`javascript
matrix(
  1, 0, 0,
  0, 1, 0,
  0, 0, 1
)

// prettier-ignore
matrix(
  1, 0, 0,
  0, 1, 0,
  0, 0, 1
)
\`\`\`

### HTML

\`\`\`html
<!-- prettier-ignore -->
<div         class="x"       >hello world</div            >
\`\`\`

### Markdown

\`\`\`markdown
<!-- prettier-ignore -->
Do   not    format   this
\`\`\`
      `
    )
  }),
  ...generate("prettier-ignore-attribute", [Style.arrowDash], {
    text: "prettier-ignore-attribute ${attribute1, attribute2}",
    document: new vscode.MarkdownString(
      `
\`\`\`html
<!-- prettier-ignore-attribute -->
<div
  (mousedown)="       onStart    (    )         "
  (mouseup)="         onEnd      (    )         "
></div>

<!-- prettier-ignore-attribute (mouseup) -->
<div
  (mousedown)="onStart()"
  (mouseup)="         onEnd      (    )         "
></div>
\`\`\`
      `
    )
  }),
  ...generate("prettier-ignore-start", [Style.arrowDash], {
    document: new vscode.MarkdownString(
      `
\`\`\`markdown
<!-- prettier-ignore-start -->
<!-- SOMETHING AUTO-GENERATED BY TOOLS - START -->

| MY | AWESOME | AUTO-GENERATED | TABLE |
|-|-|-|-|
| a | b | c | d |

<!-- SOMETHING AUTO-GENERATED BY TOOLS - END -->
<!-- prettier-ignore-end -->
\`\`\`
      `
    )
  }),
  ...generate("prettier-ignore-end", [Style.arrowDash])
];

const typescript: ISchema[] = [...generate("@ts-ignore", [Style.slash])];

// SEE: https://palantir.github.io/tslint/usage/rule-flags/
const tslint: ISchema[] = [
  ...generate("tslint:enable", [Style.slash, Style.star], {
    text: "tslint:enable: ${rule1 rule2 rule3...}",
    document: new vscode.MarkdownString(
      `enable the listed rules for the rest of the file
\`\`\`typescript
/* tslint:enable */
\`\`\`
      `
    )
  }),
  ...generate("tslint:disable", [Style.slash, Style.star], {
    text: "tslint:disable: ${rule1 rule2 rule3...}",
    document: new vscode.MarkdownString(
      `disable the listed rules for the rest of the file
\`\`\`typescript
/* tslint:disable */
\`\`\`
      `
    )
  }),
  ...generate("tslint:disable-next-line", [Style.slash, Style.star], {
    text: "tslint:disable-next-line: ${rule1 rule2 rule3...}",
    document: new vscode.MarkdownString(
      `disables the listed rules for the next line
\`\`\`typescript
/* tslint:disable-next-line */
\`\`\`
      `
    )
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
      ...jsx,
      ...filter(prettier, [commentStyle.slash, commentStyle.star])
    ],
    triggerCharacters: ["/", "*", " "]
  },
  // typescript
  {
    selector: [Language.ts, Language.tsx],
    schemas: [
      ...typescript,
      ...eslint,
      ...tslint,
      ...webpack,
      ...jsx,
      ...filter(prettier, [commentStyle.slash, commentStyle.star])
    ],
    triggerCharacters: ["/", "*", " "]
  },
  // // style
  {
    selector: [Language.asciidoc],
    schemas: [...filter(common, commentStyle.slash)],
    triggerCharacters: ["/", " "]
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
      ...filter(common, [commentStyle.arrowDash]),
      ...filter(prettier, [commentStyle.arrowDash])
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
      Language.gitignore,
      Language.terraform
    ],
    schemas: [...filter(common, [commentStyle.hash])],
    triggerCharacters: ["#", " "]
  },
  // #[ ]# style
  {
    selector: [Language.nim],
    schemas: [...filter(common, [commentStyle.hashBracket])],
    triggerCharacters: ["#", "[", " "]
  },
  // <# #> style
  {
    selector: [Language.powershell],
    schemas: [...filter(common, [commentStyle.hashArrow])],
    triggerCharacters: ["<", "#", " "]
  },
  // -- style
  {
    selector: [
      Language.ada,
      Language.hivesql,
      Language.lua,
      Language.pig,
      Language.plsql,
      Language.sql
    ],
    schemas: [...filter(common, [commentStyle.dashdash])],
    triggerCharacters: ["-", " "]
  },
  // - style
  {
    selector: [Language.haskell],
    schemas: [...filter(common, [commentStyle.dash])],
    triggerCharacters: ["-", " "]
  },
  // ' style
  {
    selector: [Language.vb, Language.diagram],
    schemas: [...filter(common, [commentStyle.quote])],
    triggerCharacters: ["'", " "]
  },
  // % style
  {
    selector: [
      Language.bibtex,
      Language.erlang,
      Language.latex,
      Language.matlab
    ],
    schemas: [...filter(common, [commentStyle.percent])],
    triggerCharacters: ["%", " "]
  },
  // ;; style
  {
    selector: [Language.clojure, Language.racket, Language.lisp],
    schemas: [...filter(common, [commentStyle.semicolon])],
    triggerCharacters: [";", " "]
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
  options: { text?: string; document?: string | vscode.MarkdownString } = {}
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
      case Style.arrowDash:
        prefix = "<!-- ";
        suffix = " -->";
        style = commentStyle.arrowDash;
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
      case Style.dashdash:
        prefix = "-- ";
        style = commentStyle.dashdash;
        break;
      case Style.dash:
        prefix = "- ";
        style = commentStyle.dash;
        break;
      case Style.quote:
        prefix = "' ";
        style = commentStyle.quote;
        break;
      case Style.percent:
        prefix = "% ";
        style = commentStyle.percent;
        break;
      case Style.semicolon:
        prefix = ";; ";
        style = commentStyle.semicolon;
        break;
      default:
        prefix = "// ";
        style = commentStyle.slash;
    }
    return {
      name: name.split(" ")[0],
      label: prefix + name + suffix,
      detail: "comment-complete",
      document: options.document,
      text: prefix + (options.text || name) + suffix,
      style
    };
  });
}
