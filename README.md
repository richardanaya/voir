# Voir

Voir is an incredibly simple store for keeping your mutations separate from your view components in Vue.js

![voir](https://richardanaya.github.io/voir/voir.png)

##Install

npm:
```bash
npm install voir
```

CDN:
```html
<script src="https://unpkg.com/voir@latest/voir.js"></script>
```

## Usage

We're going to create a simple counter application.  

### Make a store
Let's start by creating the state for our app.

```javascript
var state = { counter: 0 };
```

Next let's focus on the types of mutations we want to perform on this state.  In Voir we separate out mutations into their own functions:

```javascript
function counterMutations(state,action){
  	switch(action.type){
    	case "increment":
          state.counter += 1
          return;
  		case "decrement":
          state.counter -= 1
          return;
  		case "change":
          state.counter = action.data.number;
          return;        
    }
  }
```

Great! Now lets put our mutations and state together in a store that can expose our state and the ability to change it to others.

```javascript
var store = Voir.createStore(state,[counterMutations]);
```

it's easy to add more mutation handlers if we want them

```javascript
var store = Voir.createStore(state,[counterMutations,otherMutationHandler,...]);
```

### Connect store to Vue

Now lets connect our Vue instance to the store so that any actions that come from our application go to our mutators.

```html
<div id="demo">
      {{state.counter}}<button>+</button><button>-</button><button>Reset</button>
</div>
```
```javascript
Vue.use(Voir,{store:store});
var demo = new Vue({
    el: '#demo',
    data:{
      state: store.state
    }
})
```

### Dispatching actions

Dispatching actions in Voir is easy:

```html
<div id="demo">
      {{state.counter}}
      <button v-on:click="dispatch('increment')">+</button>
      <button v-on:click="dispatch('decrement')">-</button>
      <button v-on:click="dispatch('change',{number:0})">Reset</button>
</div>
```
```javascript
Vue.use(Voir,{store:store});
var demo = new Vue({
    el: '#demo',
    data:{
      state: store.state
    }
})
```


### Dispatching Asynchronous Actions

Dispatching asynchronous in Voir is conventionally done by dispatching new actions. This encourages reuse and also isolated steps that can be observed easily in Redux DevTools (see below).

```html
<div id="demo">
      {{state.counter}}
      <button v-on:click="dispatch('increment')">+</button>
      <button v-on:click="dispatch('decrement')">-</button>
      <button v-on:click="dispatch('change',{number:0})">Reset</button>
      <button v-on:click="dispatch('step')">Step</button>
</div>
```
```javascript
function counterMutations(state,action){
  	switch(action.type){
    	case "increment":
          state.counter += 1
          return;

      ...

      case "step":
          state.counter += 1
          setTimeout(function(){
            dispatch("increment:stepping first time");
            setTimeout(function(){
              dispatch("increment:stepping second time");
            },1000)
          },1000)
          return;     
    }
  }
```

Notice how comments can be added to an action on dispatch, allowing better logging in Redux DevTools.

#Redux DevTools

Voir currently has support for logging through Redux DevTools. For more instructions on installing your dev tools, checkout https://github.com/gaearon/redux-devtools

### Complete

```html
<html>
<head>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.0.5/vue.min.js"></script>
  <script src="https://unpkg.com/voir@latest/voir.js"></script>
</head>
<body>
  <div id="demo">
      <p>{{state.counter}}</p>
      <button v-on:click="dispatch('increment')">+</button>
      <button v-on:click="dispatch('decrement')">-</button>
      <button v-on:click="dispatch('change',{number:0})">Reset</button>
      <button v-on:click="dispatch('step')">Step</button>
  </div>
</body>
<script>
  function counterMutations(state,action,dispatch){
    switch(action.type){
        case "increment":
            state.counter += 1
            return;
        case "decrement":
            state.counter -= 1
            return;
        case "change":
            state.counter = action.data.number;
            return;
        case "step":
            state.counter += 1
            setTimeout(function(){
              dispatch("increment:stepping first time");
              setTimeout(function(){
                dispatch("increment:stepping second time");
              },1000)
            },1000)
            return;
    }
  }

  var store = Voir.createStore({ counter: 0 }, [counterMutations]);

  Vue.use(Voir,{store:store});

  var demo = new Vue({
      el: '#demo',
      data:{
        state: store.state
      }
  })
</script>
</html>

```
