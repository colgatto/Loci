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
	
		history(){
			return this.#history;
		}
	
		index(){
			return this.#index;
		}

		add(...args){
			
			if(this.#type == Loci.#types.PRIMITIVE){
				throw new Error("can't use add() on primitive data, only on object");
			}
			this.#index++;
			if(args[0] instanceof Array){
				//multiple add
				const list = [];
				for (let k = 0; k < args[0].length; k++) {
					const arg = args[0][k];
					let tmpV = this.#data;
					for (let i = 1; i < arg.length - 1; i++) {
						tmpV = tmpV[arg[i]];
					}
					const lastK = arg[arg.length - 1];
					if(typeof tmpV[lastK] != 'undefined') throw new Error(`"${lastK}" already defined, use set() for change value`);
					list.push({
						multi: true,
						type: 'add',
						args: arg,
						v: tmpV[lastK]
					});
					tmpV[lastK] = arg[0];
				}
				this.#history[this.#index] = {
					multi: true,
					type: 'add',
					list
				};
			}else{
				//single add
				let tmpV = this.#data;
				for (let i = 1; i < args.length - 1; i++) {
					tmpV = tmpV[args[i]];
				}
				const lastK = args[args.length - 1];
				if(typeof tmpV[lastK] != 'undefined') throw new Error(`"${lastK}" already defined, use set() for change value`);
				this.#history[this.#index] = {
					multi: false,
					type: 'add',
					args,
					v: tmpV[lastK]
				};
				tmpV[lastK] = args[0];
			}
			//reset history
			this.#history.splice(this.#index+1, this.#history.length-this.#index);
			return this.#data;
		}

		delete(...args){
			if(this.#type == Loci.#types.PRIMITIVE){
				throw new Error("can't use delete() on primitive data, only on object");
			}
			this.#index++;
			if(args[0] instanceof Array){
				//multiple delete
				const list = [];
				for (let k = 0; k < args[0].length; k++) {
					const arg = args[0][k];
					let tmpV = this.#data;
					for (let i = 0; i < arg.length - 1; i++) {
						tmpV = tmpV[arg[i]];
					}
					const lastK = arg[arg.length - 1];
					if(typeof tmpV[lastK] == 'undefined') throw new Error(`can't delete "${lastK}", is not defined`);
					list.push({
						multi: true,
						type: 'delete',
						args: arg,
						v: tmpV[lastK]
					});
					delete tmpV[lastK];
				}
				this.#history[this.#index] = {
					multi: true,
					type: 'delete',
					list
				};
			}else{
				//single delete
				let tmpV = this.#data;
				for (let i = 0; i < args.length - 1; i++) {
					tmpV = tmpV[args[i]];
				}
				const lastK = args[args.length - 1];
				if(typeof tmpV[lastK] == 'undefined') throw new Error(`can't delete "${lastK}", is not defined`);
				this.#history[this.#index] = {
					multi: false,
					type: 'delete',
					args,
					v: tmpV[lastK]
				};
				delete tmpV[lastK];
			}
			//reset history
			this.#history.splice(this.#index+1, this.#history.length-this.#index);
			return this.#data;
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
							multi: true,
							type: 'set',
							args: arg,
							v: tmpV[lastK]
						});
						if(typeof tmpV[lastK] == 'undefined') {
							this.#index--;
							throw new Error(`can't set "${lastK}", is not defined, use add() instead`);
						}
						tmpV[lastK] = arg[0];
					}
					this.#history[this.#index] = {
						multi: true,
						type: 'set',
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
						multi: false,
						type: 'set',
						args,
						v: tmpV[lastK]
					};
					if(typeof tmpV[lastK] == 'undefined') {
						this.#index--;
						throw new Error(`can't set "${lastK}", is not defined, use add() instead`);
					}
					tmpV[lastK] = args[0];
				}
			}
	
			//reset history
			this.#history.splice(this.#index+1, this.#history.length-this.#index);
			return this.#data;
		}
	
		#singleUndo(state){
			let tmpV = this.#data;
			const startIndex = state.type == 'delete' ? 0 : 1;
			for (let i = startIndex; i < state.args.length - 1; i++) {
				tmpV = tmpV[state.args[i]];
			}
			const lastK = state.args[state.args.length - 1];
			switch (state.type) {
				case 'set':
					tmpV[lastK] = state.v;
					break;
				case 'add':
					delete tmpV[lastK];
					break;
				case 'delete':
					tmpV[lastK] = state.v;
					break;
			}
		}
	
		undo(){
			if(this.#index == 0) return this.#data;
			if(this.#type == Loci.#types.PRIMITIVE){
				this.#index--;
				this.#data = this.#history[this.#index];
			}else{
				const state = this.#history[this.#index];
				if(state.multi){
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
			const startIndex = state.type == 'delete' ? 0 : 1;
			for (let i = startIndex; i < state.args.length - 1; i++) {
				tmpV = tmpV[state.args[i]];
			}
			const lastK = state.args[state.args.length - 1];
			switch (state.type) {
				case 'set':
					tmpV[lastK] = state.args[0];
					break;
				case 'add':
					tmpV[lastK] = state.args[0];
					break;
				case 'delete':
					delete tmpV[lastK];
					break;
			}
		}
	
		redo(){
			if(this.#index == this.#history.length-1) return this.#data;
			if(this.#type == Loci.#types.PRIMITIVE){
				this.#index++;
				this.#data = this.#history[this.#index];
			}else{
				this.#index++;
				const state = this.#history[this.#index];
				if(state.multi){
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
