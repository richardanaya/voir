# Voir

#Install

npm:
```bash
npm install voir
```

CDN:
```html
<script src="https://unpkg.com/voir@1.0.0/voir.js"></script>
```

# Usage

We're going to create a simple counter application.  

### Make a store
Let's start by creating the state for our app.

```javascript
var state = { counter: 0 };
```

Next lets focus on the types of mutations we want to perform on this state.  In Voir we separate out mutations into their own functions:

```javascript
function counterMutations(state,action){
  	switch(action.type){
    	case "increment":
        state.counter += 1
        return;
  		case "decrement":
        state.counter -= 1
        return;
    }
  }
```

Great! Now lets put our mutations and state together in a store that can expose our state and the ability to change it to others.

```javascript
var store = Voir.createStore(state,counterMutations);
```

it's easy to add more mutation handlers if we want them

```javascript
var store = Voir.createStore(state,counterMutations,otherMutationHandler,...);
```

### Connect store to Vue

Now lets connect our Vue instance to the store so that any actions that come from our application go to our mutators.

```html
<div id="demo">
      {{state.counter}}<button>+</button><button>-</button>
</div>
```
```javascript
var demo = new Vue({
    el: '#demo',
    mixins: [Voir.StoreMixin(store)],
    data:{
      state: store.state
    }
})
```

### Dispatching actions

Let's make it easy for our view to dispatch actions. We use another mixin that makes it easy to emit actions from your component:

```html
<div id="demo">
      {{state.counter}}
      <button v-on:click="action('increment')">+</button>
      <button v-on:click="action('decrement')">-</button>
</div>
```
```javascript
var demo = new Vue({
    el: '#demo',
    mixins: [Voir.StoreMixin(store),Voir.ActionMixin],
    data:{
      state: store.state
    }
})
```

### Complete

```html
<html>
<head>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.0.5/vue.min.js"></script>
  <script src="voir.js"></script>
</head>
<body>
  <div id="demo">
      <p>{{state.counter}}</p>
      <button v-on:click="action('increment')">+</button>
      <button v-on:click="action('decrement')">-</button>
  </div>
</body>
<script>
  function counterMutations(state,action){
  	switch(action.type){
    	case "increment":
      	state.counter += 1
        return;
  		case "decrement":
      	state.counter -= 1
        return;
    }
  }

  var store = Voir.createStore({ counter: 0 }, counterMutations);

  var demo = new Vue({
      el: '#demo',
    	mixins: [Voir.StoreMixin(store),Voir.ActionMixin],
      data:{
      	state: store.state
      }
  })
</script>
</html>

```
