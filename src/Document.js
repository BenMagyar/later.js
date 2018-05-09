import React from 'react';
import serialize from 'serialize-javascript';

const Document = ({ helmet, assets, data, content, appendToHead }) => {
  const htmlAttrs = helmet.htmlAttributes.toComponent();
  const bodyAttrs = helmet.bodyAttributes.toComponent();
  return (
    <html {...htmlAttrs}>
      <head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta charSet="utf-8" />
        <title>later.js 👋</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {helmet.title.toComponent()}
        {helmet.meta.toComponent()}
        {helmet.link.toComponent()}
        {appendToHead ? appendToHead() : null}
      </head>
      <body {...bodyAttrs}>
        <div id="root" dangerouslySetInnerHTML={{ __html: content}} />
        <script
          id="preloaded-state"
          type="application/json"
          dangerouslySetInnerHTML={{ __html: serialize({ ...data }) }}
        />
        <script
          type="text/javascript"
          src={assets.client.js}
          defer
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
};

export default Document;
