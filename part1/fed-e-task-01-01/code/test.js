let obj = {
    store: ['foo', 'bar', 'baz'],
    [Symbol.iterator]: function * () {
        for (let i = 0; i < this.store.length; i++) {
            yield this.store[i]
        }
    }
}

for (const objElement of obj) {
    console.log('cycle', objElement)
}

class A {

}
class Test extends A {
    constructor() {
        super()
    }
}
