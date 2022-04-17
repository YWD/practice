const express = require('express')
const Vue = require('vue')
const vueServerRenderer = require('vue-server-renderer')
const fs = require('fs')

const server = express()
const renderer = vueServerRenderer.createRenderer({
    template: fs.readFileSync('./index.template.html', 'utf-8')
})
const createApp = () => {
    const app = new Vue({
        template: `
            <div id="app">
                <h1>hello {{ message }}</h1>
                <input v-model="message">
            </div>
        `,
        data: {
            message: 'world',
        }
    })
    return app
}

server.get('/', async (req, res) => {
    try {
        const app = createApp()
        const ret = await renderer.renderToString(app, {
            title: '自定义页面标题',
            meta: `
                <meta name="description" content="hello world">
            `
        })
        res.end(ret)
    } catch (e) {
        res.status(500).end('Interver Server Error.')
    }
})

server.listen(3000, () => {
    console.log('running at port 3000')
})
