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
      StoreMixin : function(store){
        return {
          created: function(){
            this.$on("action",function(d){
      				store.dispatchAction(d);
            })
          }
        };
      },

      ActionMixin : {
        methods: {
          action: function (name,data) {
            this.$emit("action",{type:name,data:data});
          }
        }
      },

      createStore: function(){
      	var initialState = arguments[0];
      	var mutators = [];
        for(var i = 1; i < arguments.length; i++){
        	mutators.push(arguments[i]);
        }
        var ret = {
        	state:initialState,
          dispatchAction: function(action){
          	for(var j = 0 ; j < mutators.length; j++){
            	mutators[j](ret.state,action);
            }
          }
        };
      	return ret;
      }
    };
}));
