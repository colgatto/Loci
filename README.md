# Loci

Memorized history for generic object.

Can be used in Node.js and browser.

## Usage 
```js
const Loci = require('./Loci');

const data = new Loci(15);
```

### Get current value

```js
let v = data.get();
```

### Set new value

```js
let v = data.set(23);
```

### Undo last change

```js
let v = data.undo();
```

### Revert last undo

```js
let v = data.redo();
```

## Usage with Object

```js
const data = new Loci( { lorem: 15, ipsum: { dolor: 23 } } );
```

### Change value
set `<Object>.ipsum.dolor` = 60
```js
data.set(60, 'ipsum', 'dolor');
```

### Change multiple values
set `<Object>.lorem` = 1 and `<Object>.ipsum.dolor` = 2
```js
data.set([
	[ 1, 'lorem' ],
	[ 2, 'ipsum', 'dolor' ]
]);
```
In this case, when undo/redo is used, all changes will be undone/redone.

### Add key
add `<Object>.ipsum.tenet` = 20
```js
data.add(20, 'ipsum', 'tenet');
```

### Delete key
delete `<Object>.ipsum.dolor`
```js
data.delete('ipsum', 'dolor');
```