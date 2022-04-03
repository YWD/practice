
let _Vue
export default class MyRouter {
    static install(Vue) {
        // 1.判断当前插件是否被安装
        // if (_Vue) {
        //     return
        // }
        if (MyRouter.install.installed) {
            return
        }
        MyRouter.install.installed = true
        // 2.保存Vue
        _Vue = Vue
        // 3.将router注入到Vue
        _Vue.mixin({
            beforeCreate() {
                if (this.$options.router) {
                    _Vue.prototype.$router = this.$options.router
                }
            }
        })
    }

    constructor(options) {
        this.options = options
        this.routeMap = {}
        this.data = _Vue.observable({
            current: "/home"
        })
        this.init()
    }

    init() {
        this.createRouteMap()
        this.initComponent(_Vue)
        this.initEvent()
    }

    initComponent(Vue) {
        Vue.component("router-link", {
            props: {
                to: String,
            },
            render(h) {
                return h("a", {
                    attrs: {
                        href: this.to
                    },
                    on: {
                        click: this.clickHandler
                    }
                }, [this.$slots.default])
            },
            methods: {
                clickHandler(e) {
                    // 改变地址
                    // history.pushState({}, "", this.to)
                    window.location.hash = this.to
                    // 改变页面内容
                    this.$router.data.current = this.to
                    e.preventDefault()
                }
            },
            // template:"<a :href='to'><slot></slot><>"
        })
        const self = this
        Vue.component("router-view", {
            render(h) {
                const cm = self.routeMap[self.data.current]
                return h(cm)
            }
        })
    }

    createRouteMap() {
        this.options.routes.forEach(route => {
            this.routeMap[route.path] = route.component
        })
    }

    initEvent() {
        // observable
        // window.addEventListener("popstate", () => {
        //     this.data.current = window.location.pathname
        // })
        window.addEventListener('hashchange', () => {
            this.data.current = window.location.hash.substr(1)
        })
    }
}
