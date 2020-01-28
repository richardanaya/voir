
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
    super("/blog/:postId")
  }
  
  async function onInit(params){
  	// perform some operation on first load
  }
  
  async function onLoad(params){
  	// perform some operation when navigated to
  }
  
  async function onRender(){
  	// render from session state and view state
  }
 }
```

## Usage

We're going to create a simple counter application.  

First let's import [`lit-html`](https://lit-html.polymer-project.org/) and voir as ES modules

```javascript
import {html, render} from 'https://unpkg.com/lit-html?module';
import {PageRoute} from 'https://unpkg.com/voir?module';
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

See this demo at: https://richardanaya.github.io/voir/demo.html

