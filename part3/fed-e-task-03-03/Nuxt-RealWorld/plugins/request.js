import axios from 'axios'

export const request = axios.create({
    baseURL: 'https://conduit.productionready.io',
    // baseURL: 'http://realworld.api.fed.lagounews.com'
})

export default ({ store }) => {
    console.log('plugin config')
    console.log(store.state)
    request.interceptors.request.use(config => {
        const user = store.state.user
        if (user && user.token)
            config.headers.Authorization = `Token ${user.token}`
        return config
    }, function (error) {
        // 如果请求失败(此时请求还没有发出去)就会进入这里
        // Do something with request error
        return Promise.reject(error)
    })
}
