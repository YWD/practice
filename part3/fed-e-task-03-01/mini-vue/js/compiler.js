class Compiler {
    constructor(vm) {
        this.el = vm.$el
        this.vm = vm
        this.compile(this.el)
    }
    // 编译模板，处理文本节点和元素节点
    compile(el) {
        let childNodes = el.childNodes
        for (const node of childNodes) {
            if(this.isTextNode(node)) {
                this.compileText(node)
            } else if (this.isElementNode(node)) {
                this.compileElement(node)
            }
            if (node.childNodes && node.childNodes.length) {
                this.compile(node)
            }
        }
    }

    // 编译元素节点，处理指令
    compileElement(node) {
        // 遍历所有属性节点
        Array.from(node.attributes).forEach(attr => {
            // 判断是否是指令
            let attrName = attr.name
            if (this.isDirective(attrName)) {
                // v-text --> text
                attrName = attrName.substr(2)
                // v-on:click eventName = 'click'
                let paramsArray = attrName.split(':')
                let eventName
                if (paramsArray.length > 1) {
                    attrName = paramsArray[0]
                    eventName = paramsArray[1]
                }
                let key = attr.value
                this.update(node, key, attrName, eventName)
            }
        })
    }

    update(node, key, attrName, eventName) {
        let updateFn = this[attrName + 'Updater']
        updateFn && updateFn.call(this, node, this.vm[key], key, eventName)
    }

    // 处理v-on指令
    // 只考虑了v-on:click="functionName"形式，不支持行内语句和对象形式
    onUpdater(node, value, key, eventName) {
        node.addEventListener(eventName, () => {
            this.vm.$options.methods[key]()
        })
    }

    // 处理v-html指令
    // 注意key和value的值，key可能是vm的键，也可能就是我们要的值
    htmlUpdater(node, value, key) {
        node.innerHTML = key.substr(1, key.length - 2)
        new Watcher(this.vm, key, newValue => {
            node.innerHTML = newValue
        })
    }

    // 处理v-text指令
    textUpdater(node, value, key) {
        node.textContent = value
        new Watcher(this.vm, key, newValue => {
            node.textContent = newValue
        })
    }
    // v-model
    modelUpdater(node, value, key) {
        node.value = value
        new Watcher(this.vm, key, newValue => {
            node.value = newValue
        })
        // 双向绑定
        node.addEventListener('input', () => {
            this.vm[key] = node.value
        })
    }

    // 编译文本节点，处理插值表达式
    compileText(node) {
        // {{ msg }}
        let reg = /\{\{(.+?)\}\}/
        let value = node.textContent
        if (reg.test(value)) {
            let key = RegExp.$1.trim()
            node.textContent = value.replace(reg, this.vm[key])

            // 创建watcher对象，当数据改变是更新视图
            new Watcher(this.vm, key, newValue => {
                node.textContent = newValue
            })
        }
    }

    // 判断元素属性是否是指令
    isDirective(attrName) {
        return attrName.startsWith('v-')
    }
    // 判断节点是否是文本节点
    isTextNode(node) {
        return node.nodeType === 3
    }
    // 判断节点是否是元素节点
    isElementNode(node) {
        return node.nodeType === 1
    }
}
