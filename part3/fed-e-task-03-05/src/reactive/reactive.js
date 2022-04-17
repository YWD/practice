const isObject = value => value !== null && typeof value === 'object'

function reactive(target) {
  if (!isObject(target)) return
  const handler = {
    get(target, key, receiver) {
      tracker(target, key)
      return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
      const oldValue = Reflect.get(target, key, receiver)
      if (oldValue === value) return true
      trigger(target, key)
      return Reflect.set(target, key, value, receiver)
    },
    deleteProperty(target, key) {
      return Reflect.deleteProperty(target, key)
    }
  }
  return new Proxy(target, handler)
}
let activeEffect
const effect = callback => {
  activeEffect = callback
  callback()
  activeEffect = null
}
const targetMap = new WeakMap()
const tracker = (target, key) => {
  let keyMap = targetMap.get(target)
  if (!keyMap) {
    targetMap.set(target, (keyMap = new Map()))
  }
  let depSet = keyMap.get(key)
  if (!depSet) {
    keyMap.set(key, (depSet = new Set()))
  }
  depSet.add(activeEffect)
}
const trigger = (target, key) => {
  const keyMap = targetMap.get(target)
  if (!keyMap) return
  const depSet = keyMap.get(key)
  if (depSet) {
    depSet.forEach(callback => callback())
  }
}
