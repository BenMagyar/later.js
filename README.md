# later.js 👋

A small framework to alleviate the pain in creating universal React / Redux /
React-Router applications.

## Motivation

Creating a universal [React](https://github.com/facebook/react/) /
[Redux](https://github.com/reactjs/redux) /
[React-Router](https://github.com/ReactTraining/react-router)
application from scratch is still somewhat a pain.
[after.js](https://github.com/jaredpalmer/after.js)
is *almost* perfect, but I wanted something that doesn't abandon
redux, or seem like an afterthought that gets tacked on (i.e. I don't like
passing in the redux store into `getInitialProps` of the parent containers).

later.js aims to fill the gap (or glue together) of
React/Redux/React-Router as separate libraries and the work required to have
a complete universal-rendering application. It is built with razzle in mind,
so some assumptions are made but it should be somewhat simple to apply to any
context.

With after.js in mind, I set out to:

- Make initial render/hydration easier
- Provide a way to easily and sensibly plug-in a redux store to data-fetching.
- Leave route-data-resolution to the user but make it easy to do.
- Make code-splitting easy and loading the split-chunks even easier.
- Make route transitions simple and don't require placeholders.

## Getting Started

later.js lists all `react-*` / `redux` dependencies as peerDependencies, they
must be installed first (with later.js).

```bash
npm i --save react \
  react-dom \
  react-helmet \
  react-router-dom \
  react-router-config \
  redux \
  react-redux \
  later.js
```

## Documentation
  - [Routing](#routing)
    - [`loadData` Declarations](#loaddata-declarations)
  - [`resolveRoute([store], [loadData], [ctx])`](#resolveroutestore-loaddata-ctx)
    - [Parameters](#parameters)
  - [`asyncComponent` / code-splitting](#asynccomponent--code-splitting)
  - [`render([options])`](#renderoptions)
    - [`options`](#options)
  - [`hydrate([options])`](#hydrateoptions)
    - [`options`](#options-1)
  - [`connectLink([Component], [eventHandler], [onError])`](#connectlinkcomponent-eventhandler)
    - [(Un)handled Route Changes](#unhandled-route-changes)
  - [`StatusConsumer`](#statusconsumer)

### Routing
Routing is provided by
[react-router](https://github.com/ReactTraining/react-router/tree/master/packages/react-router)
v4 and
[react-router-config](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config).

#### `loadData` Declarations
A user-provided [`resolveRoute`](#resolveRoute) function will be called with an
array of the functions/objects that are declared alongside the route. So two
instance types are supported within the loadData property:

- `Functions` - Will be called with the route context. See
  react-router's documentation for more information on the
  [match object](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/match.md).
- `Any` - Anything that is not a function will be passed through as itself.

An example better explains this process. In the following route setup:

```js
[{
  path: '/about',
  component: About,
  loadData: loadAbout,
  routes: [{
    path: '/about/me',
    component: Me,
    loadData: [loadAboutMe]
  }]
}]
```

If a user visited `/about/me` the provided [`resolveRoute`](#resolveRoute)
method would be used to create a `Promise` thats awaited on route changes,
structured as:

```js
Promise.all([
  resolveRoute(store, loadAbout, { match, req, }),
  resolveRoute(store, [loadAboutMe], { match, req, }),
])
```

It is expected that the store is populated with data and it is not passed into
the component.

**Note - It is assumed `resolveRoute` will return a `Promise`.**:

### `resolveRoute([store], [loadData], [ctx])`

#### Parameters
- `store` - The redux store created using `createStore`.
- `loadData` - The matched loadData match.
- `ctx` - Some request context for `loadData`. Including the react-router
  match and the request where possible.

`resolveRoute` is what is behind connecting the store to all of the `loadData`
properties. And is solely responsible for populating the redux store from the
calls.

### `asyncComponent` / code-splitting
An `asyncComponent` is provided that makes code-splitting (*and loading*) super
simple. When declaring a component within the [routing](#routing) setup, just
wrap the provided component in a simple loader function using dynamic imports.

```js
import { asyncComponent } from 'later.js';

const routes = [{
  path: '/about',
  component: asyncComponent(() => import('./asAbout')),
  routes: [{
    path: '/about/me',
    component: Me,
  }]
}]
```

If a user visited `/about/me` the server/client will load the chunk required
for the `./asAbout` page automatically. This automatically hooks up to the
[`connectLink`](#connectlink) method, so that progress can be shown on some
event, rather than through some global progress bar or a placeholder.

### `render([options])`
The `render` function makes server-side rendering easier, by building in
data-resolution and loading of `asyncComponent`s. It will return an html document
or redirect the user (using the `res` option).

#### `options`
- `res` - Express response.
- `req` - Express request.
- `routes` - Routes configuration.
- `assets` - Assets manifest.
- `createStore` - Function that creates a redux store.
- `resolveRoute` - Function that converts `loadData` properties to a `Promise`.
- `appendToHead` - *optional* - Function that returns a react-component to
  append to the *default* Document head.
- `document` - *optional* - [Alternative Document](#alternative-document).

A simple and shortened example:

```js
import { render } from 'later.js';
import createStore from './createStore';
import resolveRoute from './resolveRoute';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

...
  .get('/*', async (req, res) => {
    try {
      const html = await render({
        req,
        res,
        routes,
        assets,
        createStore,
        resolveRoute,
      });
      res.send(html);
    } catch (error) {
      res.json(error);
    }
  })
```

### `hydrate([options])`
The `hydrate` function replicates `render` on the client. Making it easier to
populate the store/load initial data that was prefetched on the server.

#### `options`
- `routes` - Routes configuration.
- `createStore` - Function to create a redux store.
- `resolveRoute` - Function that converts `loadData` properties to a `Promise`.

### `connectLink([Component], [eventHandler], [onError])`
`connectLink` makes it easy to connect components to the later.js data-loading
and `asyncComponent`-loading setup. Wrap a component with `connectLink` to
load the data/components before re-routing.

If the specified `eventHandler` option exists on the connected component
and it is a `function`/`Promise` it will call/await the provided handler.
After the handler is done (and it doesn't return/resolve to `false`!) it will
route to the `to` property that is provided on the `Component`.

The `onError` function is called when an error occurs. A `routeError` is also
passed to the child if an error occurs during the fetch.

```js
import { connectLink } from 'later.js';

const LoadingLink = ({ to, children, onClick, isRouteLoading, routeError}) => (
  <a href={to} onClick={onClick}>
    {isRouteLoading ? 'loading' : children}
    {routeError ? 'error!' : null}
  </a>
);

const ConnectedLoadingLink = connectLink(LoadingLink, 'onClick');

...

// In some render method...
<ConnectedLoadingLink to="/about" onClick={isOkToContinue}>
  About Me
</ConnectedLoadingLink>
```

#### (Un)handled Route Changes
Although `connectLink` makes it easy to connect to route changes, there may be
cases where a link/button/event is not causing the route to change! In those
cases later.js will fallback to a global route change handler.

Don't fret, `asyncComponent`'s will still get loaded and route-data will be
fetched. Want status updates on that global handler? Check out the
[StatusConsumer](#statusconsumer).

### `StatusConsumer`
The `<StatusConsumer/>` is a react-context-api consumer that provides an
`isRouteLoading` property for use in progress bars/indicators.

```js
import { StatusConsumer } from 'later.js';

const ProgressIndicator = () => (
  <StatusConsumer>
    {({ isRouteLoading }) => (
      {isRouteLoading ? 'loading!' : null}
    )}
  </StatusConsumer>
);
```

### Alternative Document
The document component used to render the page can be replaced. See the
[Document](https://github.com/BenMagyar/later.js/blob/master/src/Document.js)
component provided for what is required though. Make use of react-helmet where
possible instead.

## Inspiration
- [after.js](https://github.com/jaredpalmer/after.js) - later.js is basically
  a fork of after.js
- [razzle](https://github.com/jaredpalmer/razzle)
- [next.js](https://github.com/zeit/next.js)
- [react-router-config](https://www.npmjs.com/package/react-router-config)
