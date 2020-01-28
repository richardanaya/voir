# Voir

Voir is a minimalistic routing system for templated pages in single page applications. I have observed there are three basic operations that occur during the page lifecycle.

* initial loading on visitation of a route
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

## Install
CDN:
```html
<script src="https://unpkg.com/voir@latest/voir.js"></script>
```

## Usage

We're going to create a simple counter application.  

### Make a store
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
    session.counter += 1;
    this.renderCurrentPage();
  }
}
```

See this demo at: https://richardanaya.github.io/voir/demo.html

![voir](https://richardanaya.github.io/voir/voir.png)
