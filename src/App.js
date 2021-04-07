import React, { useState, useEffect } from "react";
import "./styles.css";
import unified from "unified";
import parse from "remark-parse";
import emoji from "remark-emoji";
import directive from "remark-directive";
import visit from "unist-util-visit";
import h from "hastscript";
import remark2rehype from "remark-rehype";
import format from "rehype-format";
import stringify from "rehype-stringify";

function htmlDirectives() {
  return transform;

  function transform(tree) {
    visit(
      tree,
      ["textDirective", "leafDirective", "containerDirective"],
      ondirective
    );
  }

  function ondirective(node) {
    var data = node.data || (node.data = {});
    var hast = h(node.name, node.attributes);

    data.hName = hast.tagName;
    data.hProperties = hast.properties;
  }
}

export default function App() {
  const [html, setHtml] = useState("");
  const [text, setText] = useState(`
:::main
I :heart: remark-directive
:::

I :heart: remark-emoji :call_me_hand:
`);
  useEffect(() => {
    const html = unified()
      .use(parse)
      .use(directive)
      .use(htmlDirectives)
      .use(remark2rehype)
      .use(format)
      .use(stringify)
      .use(emoji, {
        padSpaceAfter: false, // defaults to false
        emoticon: true // defaults to false
      })
      .processSync(text).contents;
    setHtml(html);
  }, [text]);

  return (
    <div className="App">
      <textarea value={text} onChange={(e) => setText(e.target.value)} />
      <div id="preview" dangerouslySetInnerHTML={{ __html: html }}></div>
    </div>
  );
}
