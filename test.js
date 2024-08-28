const Loci = require('./Loci');

const data = new Loci(15);

console.log("data.get() = ", data.get());

console.log("data.set(23) = ", data.set(23));

console.log("data.set('roba') = ", data.set('roba'));

console.log("data.undo() = ", data.undo());

console.log("data.get() = ", data.get());

console.log("data.undo() = ", data.undo());
console.log("data.undo() = ", data.undo());

console.log("data.set('altro') = ", data.set('altro'));

console.log("data.undo() = ", data.undo());
console.log("data.redo() = ", data.redo());
console.log("data.redo() = ", data.redo());


console.log('--------------------------');
//OBJECT

const data2 = new Loci([ [1,2,3], [4,{we: 55},6] ]);

console.log("data2.get() = ", data2.get() );

console.log("data2.set(50, 0, 1) = ", data2.set(50, 0, 1) );

console.log("data2.set(60, 1, 2) = ", data2.set(60, 1, 2) );

console.log("data2.undo() = ", data2.undo() );

console.log("data2.set(20, 1, 1, 'we') = ", data2.set(20, 1, 1, 'we') );

console.log(`data2.set([
	[11, 0, 0],
	[22, 0, 1],
	[33, 0, 2],
]);`, data2.set([
	[11, 0, 0],
	[22, 0, 1],
	[33, 0, 2],
]) );

console.log("data2.undo() = ", data2.undo() );
/**/