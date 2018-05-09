import React from 'react';
import serialize from 'serialize-javascript';

/**
 * Default Document class that provides some sane defaults.
 *
 * @param {Object}   options               Document options.
 * @param {Object}   options.helmet        Optional React-Helmet override.
 * @param {Object}   options.assets        Asset manifest.
 * @param {Object}   options.data          Preloaded data.
 * @param {String}   options.content       Rendered HTML content.
 * @param {Function} options.appendToHead  Function that returns a React
 *                                         component that will be placed at
 *                                         the end of the document head.
 */
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
