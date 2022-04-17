const obj = {
  get foo() {
    console.log(this)
    return this.bar
  }
}

const proxy = new Proxy(obj,  {
  get(target, key, receiver) {
    if (key === 'bar') {
      return 'value - bar'
    }
    return Reflect.get(target, key, receiver)
  }
})
console.log(proxy.foo)
