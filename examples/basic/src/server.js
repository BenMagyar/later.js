import express from 'express';
import { render } from 'later.js';
import flush from 'styled-jsx/server';
import routes from './routes';
import { createStore } from './state';
import resolveRoute from './resolveRoute';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();
server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', async (req, res) => {
    try {
      const html = await render({
        req,
        res,
        routes,
        assets,
        createStore,
        resolveRoute,
        appendToHead: flush,
      });
      res.send(html);
    } catch (error) {
      console.error(error);
      res.json({ error, });
    }
  });

export default server;
