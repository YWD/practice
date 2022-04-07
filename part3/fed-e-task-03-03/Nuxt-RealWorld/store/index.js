const cookieParser = process.server ? require('cookieparser') : undefined
import { request } from '@/plugins/request'

export const state = () => {
    return {
        user: null
    }
}

export const mutations = {
    setUser(state, user) {
        state.user = user
    }
}

export const actions = {
    // nuxtServerInit 是一个特殊的 action 方法
    // 这个 action 会在服务端渲染期间自动调用
    // 作用：初始化容器数据，传递数据给客户端使用
    // 刷新页面怎么知道是要服务器渲染？
    nuxtServerInit ({ commit }, { req }) {
        console.log('nuxtServerInit store')
        let user = null
        // 如果请求头中有 Cookie
        if (req.headers.cookie) {
            // 使用 cookieParser 把 cookie 字符串转为 JavaScript 对象
            const parsed = cookieParser.parse(req.headers.cookie)
            try {
                user = JSON.parse(parsed.user)

                request.interceptors.request.use(config => {
                    if (user && user.token)
                        config.headers.Authorization = `Token ${user.token}`
                    return config
                })
            } catch (err) {
                // No valid cookie found
                console.log(err)
            }
        }
        // 提交 mutation 修改 state 状态
        commit('setUser', user)
    }
}

