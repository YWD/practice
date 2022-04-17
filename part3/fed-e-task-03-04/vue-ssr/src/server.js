const express = require('express')
const fs = require('fs')
const path = require('path')
const templatePath = './src/index.template.html'
const { createBundleRenderer } = require('vue-server-renderer')
const isProd = process.env.NODE_ENV === 'production'

let renderer
let onReady
const app = express()

if (isProd) {
    const template = fs.readFileSync(templatePath, 'utf-8')
    const serverBundle = require('../dist/vue-ssr-server-bundle.json')
    const clientManifest = require('../dist/vue-ssr-client-manifest.json')
    renderer = createBundleRenderer(serverBundle, {
        runInNewContext: false,
        template,
        clientManifest,
    })
} else {
    // 开发模式
    // 打包构建 客户端+服务端
    // 创建渲染器
    // 源码改变 -> 打包客户端bundle + 服务端bundle
    onReady = require('../build/set-dev-server_local')(
        app,
        templatePath,
        (serverBundle, options) => {
            console.log('渲染renderer')
            renderer = createBundleRenderer(serverBundle, {
                runInNewContext: false,
                ...options
            })
        }
    )
}


app.use(express.static(path.resolve(__dirname, './dist/')))

// async ?
async function render(req, res) {
    const context = { url: req.url }
    try {
        const html = await renderer.renderToString(context)
        res.send(html)
    } catch (e) {
        res.status(500).end(e.message)
    }
}

app.get('*', isProd
    ? render
    : async (req, res) => {
        // 开发模式，等编译构建好再渲染
        console.log('app.get')
        await onReady
        console.log('onReady done..............')
        await render(req, res)
    }
)

app.listen(3000, () => {
    console.log('running at port 3000')
})
