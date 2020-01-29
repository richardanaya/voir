
<p align="center"><img width=150 src="https://richardanaya.github.io/voir/voir.png"></p>

# Voir

Voir is a minimalistic routing/rendering system for single page applications. I have observed there are three basic operations that occur during the page lifecycle.

* initial loading on first visit of a route
* setting of page state on navigation to a route
* rendering and rerendering of a current route

This library makes it easy to do this.

```javascript
class MyPageRoute extends PageRoute {
  constructor() {
    super("/blog/(?<postId>.*)")
  }
  
  async function onInit(){
    // perform some operation on first load

    // get parameters from route regex match
    const pageId = this.match.groups.postId;
  }
  
  async function onLoad(){
    // perform some operation when navigated to
  }
  
  async function onRender(){
    // render from session state and view state
  }
 }
```

Notice that the route paths are simply regex strings. You can take advantage of ES 2018 regex named groups for more expressive route matches.

## Usage

We're going to create a simple counter application.  

First let's import [`lit-html`](https://lit-html.polymer-project.org/) and voir as ES modules

```javascript
import {html, render} from 'https://unpkg.com/lit-html?module';
import {PageRoute} from 'https://cdn.jsdelivr.net/gh/richardanaya/voir@latest/voir.js';
```

Let's start by creating the session state for our app.

```javascript
var session = { counter: 0 };
```

Now lets think about its lifecycle a bit

```javascript
class CounterPageRoute extends PageRoute {
  constructor() {
    // all pages route to counter
    super("/*")
  }

  async function onRender(){
    // use lit to render to content holder
    render(document.body, html`<div>${session.counter}<button onclick="${this.onAdd}">+</button></div>`
  }
  
  function onAdd() {
    // modify state
    session.counter += 1;
    // rerender current page
    this.renderCurrentPage();
  }
}
```

Finally we register the page routes in the order we'd like them evaluated

```javascript
register([
  CounterPageRoute
  // other routes would go here
])
```

See this demo at: https://richardanaya.github.io/voir/demo.html

