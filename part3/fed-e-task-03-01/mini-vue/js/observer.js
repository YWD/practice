class Observer {
    constructor(data) {
        this.walk(data)
    }

    walk(data) {
        // 1.判断data是否为对象
        if (!data || typeof data !== 'object') {
            return
        }
        // 2.遍历data对象的所有属性
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key])
        })
    }

    defineReactive(obj, key, value) {
        let self = this
        // 每个属性都有一个自己的发布者，负责收集依赖，并发送通知
        let dep = new Dep()
        // 如果val是对象，把val内部的属性转换成响应式数据
        this.walk(value)
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get() {
                // 收集依赖
                Dep.target && dep.addSub(Dep.target)
                return value
            },
            set(newValue) {
                if (newValue === value) {
                    return
                }
                value = newValue
                self.walk(value)
                // 发送通知
                dep.notify()
            }
        })
    }
}
