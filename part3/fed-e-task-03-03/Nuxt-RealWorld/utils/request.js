import axios from 'axios'

const request = axios.create({
    // baseURL: 'http://realworld.api.fed.lagounews.com'
    baseURL: 'https://conduit.productionready.io'
})

export default request
