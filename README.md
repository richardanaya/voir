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

We're going to create a simple counter application.  Let's start by creating the state for our app.

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

