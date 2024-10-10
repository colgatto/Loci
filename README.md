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
const data = new Loci( { lorem: 15, ipsum: { dolor: 23 }, amet: [1, 2, 3] } );
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

### Push value to Array
push 4 in `<Object>.amet`
```js
data.push(4, 'amet');
```

### Unshift value to Array
unshift 4 in `<Object>.amet`
```js
data.unshift(4, 'amet');
```

### Pop value from Array
pop from `<Object>.amet`
```js
data.pop('amet');
```

### Shift value from Array
shift from `<Object>.amet`
```js
data.shift('amet');
```