(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.Voir = factory();
  }
}(this, function () {
    return {
      install: function(Vue, options){
        Vue.mixin({
          created: function(){
            options.store.vue = this;
            if(this.$root === this){
              this.$on("action",function(d){
        				options.store.dispatchAction(d);
              });
            }
          }
        })
        Vue.prototype.dispatch = function (name,data) {
          var n = name.split(":");
          this.$emit("action",{type:n[0],data:data,message:n[1]});
        }
      },
      createStore: function(initialState,mutators){
        var ret = {
          isDispatching:false,
        	state:initialState,
          subscribers:[],
          subscribe: function(fn){
            ret.subscribers.push(fn);
          },
          notify:function(action){
            for(var i=0;i<ret.subscribers.length;i++){
              ret.subscribers[i](action,ret.getState())
            }
          },
          getState:function(){
            return ret.state;
          },
          setState:function(state){
            ret.vue._data.state = state
          },
          dispatchAction: function(action){
            if(ret.isDispatching === true){
              throw Error("Dispatching an action while dispatch in progress is not allowed")
            }
            ret.isDispatching = true;
          	for(var j = 0 ; j < mutators.length; j++){
            	mutators[j](ret.state,action,function(name,data){
                var n = name.split(":");
                ret.dispatchAction({type:n[0],data:data,message:n[1]});
              });
            }
            ret.isDispatching = false;
            ret.notify(action);
          }
        };

        let isStarted = false;
        let isJump = false;

        if(window && window.__REDUX_DEVTOOLS_EXTENSION__){
          const devTools = window.__REDUX_DEVTOOLS_EXTENSION__.connect();
          devTools.subscribe((message) => {
            if (message.type === 'START') {
              isStarted = true;
              var state = JSON.parse(JSON.stringify(ret.getState()));
              devTools.init(state)
            } else if (message.type === 'STOP') {
              isStarted = false;
            } else if (message.type === 'ACTION') { // Received a store action from Dispatch monitor
              store.dispatchAction(JSON.parse(message.payload));
            }
          });

          ret.subscribe((action,state) => {
            if (!isStarted) return;
            var state = JSON.parse(JSON.stringify(ret.getState()));
            action.type = action.type+(action.message?(":"+action.message):"")
            devTools.send(action, store.getState());
          });
        }

      	return ret;
      }
    };
}));
