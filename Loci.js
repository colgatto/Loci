(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['Loci'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.Loci = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

    class Loci{

		#index;
		#data;
		#history;
		#type;
		
		static #types = {
			PRIMITIVE: 'PRIMITIVE',
			OBJECT: 'OBJECT'
		};
		
		constructor(data){
			this.#data = data;
			this.#type = typeof data == 'object' ? Loci.#types.OBJECT : Loci.#types.PRIMITIVE;
			this.#index = 0;
			this.#history = [this.#data];
		}
		
		get(){
			return this.#data;
		}
	
		getHistory(){
			return this.#history;
		}
	
		set(...args){
			this.#index++;
			if(this.#type == Loci.#types.PRIMITIVE){
				this.#history[this.#index] = args[0];
				this.#data = args[0];
			}else{
				if(args[0] instanceof Array){
					//multiple edit
					const list = [];
					for (let k = 0; k < args[0].length; k++) {
						const arg = args[0][k];
						let tmpV = this.#data;
						for (let i = 1; i < arg.length - 1; i++) {
							tmpV = tmpV[arg[i]];
						}
						const lastK = arg[arg.length - 1];
						list.push({
							args: arg,
							v: tmpV[lastK]
						});
						tmpV[lastK] = arg[0];
					}
					this.#history[this.#index] = {
						type: 'multi',
						list
					};
				}else{
					//single edit
					let tmpV = this.#data;
					for (let i = 1; i < args.length - 1; i++) {
						tmpV = tmpV[args[i]];
					}
					const lastK = args[args.length - 1];
					this.#history[this.#index] = {
						type: 'single',
						args,
						v: tmpV[lastK]
					};
					tmpV[lastK] = args[0];
				}
			}
	
			//reset history
			this.#history.splice(this.#index+1, this.#history.length-this.#index);
			return this.#data;
		}
	
		#singleUndo(state){
			let tmpV = this.#data;
			for (let i = 1; i < state.args.length - 1; i++) {
				tmpV = tmpV[state.args[i]];
			}
			const lastK = state.args[state.args.length - 1];
			tmpV[lastK] = state.v;
		}
	
		undo(){
			if(this.#index == 0) return this.#data;
			if(this.#type == Loci.#types.PRIMITIVE){
				this.#index--;
				this.#data = this.#history[this.#index];
			}else{
				const state = this.#history[this.#index];
				if(state.type == 'multi'){
					//multiple undo
					for (let k = 0; k < state.list.length; k++) {
						this.#singleUndo(state.list[k]);
					}
				}else{
					//single undo
					this.#singleUndo(state);
				}
				this.#index--;
			}
			return this.#data;
		}
	
		#singleRedo(state){
			let tmpV = this.#data;
			for (let i = 1; i < state.args.length - 1; i++) {
				tmpV = tmpV[state.args[i]];
			}
			const lastK = state.args[state.args.length - 1];
			tmpV[lastK] = state.args[0];
		}
	
		redo(){
			if(this.#index == this.#history.length-1) return this.#data;
			if(this.#type == Loci.#types.PRIMITIVE){
				this.#index++;
				this.#data = this.#history[this.#index];
			}else{
				this.#index++;
				const state = this.#history[this.#index];
				if(state.type == 'multi'){
					//multiple redo
					for (let k = 0; k < state.list.length; k++) {
						this.#singleRedo(state.list[k]);
					}
				}else{
					//single redo
					this.#singleRedo(state);
				}
			}
			return this.#data;
		}
	
	}

    return Loci;
}));