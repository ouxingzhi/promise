var Promise = function(){

	function each(list,fn){
		var isList = 'length' in list,
			i,
			len;
		if(isList){
			for(i=0,len=list.length;i<len;i++){
				if(fn(list[i],i)) return;
			}
		}else{
			for(i in list){
				if(fn(list[i],i)) return;
			}
		}
	}
	var slice = [].slice;
	Function.bind = Function.bind || function(space){
		var args = slice.call(arguments),
			fn = this;
		space = args.shift();
		return function(){
			return fn.apply(space,args.concat(slice.call(arguments)));
		}
	};

	function Promise(){
		this.callbacks = [];
	}

	Promise.prototype = {
		constructor:Promise,
		then:function(fulfilled,rejected){
			var p = new Promise(),
				self = this;
			this.callbacks.push({
				fulfilled:function(){
					var sp = fulfilled && fulfilled.apply(self,arguments);
					if(sp instanceof Promise){
						sp.then(function(){
							p.resolve.apply(p,arguments);
						},function(){
							p.reject.apply(p,arguments);
						});
					}else{
						p.resolve.apply(p,arguments);
					}
				},
				rejected:function(){
					var sp = fulfilled && fulfilled.apply(self,arguments);
					p.reject.apply(p,[sp]);
				}
			});
			return p;
		},
		resolve:function(){
			var args = arguments,self = this;
			setTimeout(function(){
				each(this.callbacks,function(o){
					o.fulfilled && o.fulfilled.apply(self,args);
				});
			}.bind(this),0);
		},
		reject:function(){
			var args = arguments,self = this;
			setTimeout(function(){
				each(this.callbacks,function(o){
					o.rejected && o.rejected.apply(self,args);
				});
			}.bind(this),0);
		}
	};
	return Promise;
}();