const fs = require('fs')
const chokidar = require('chokidar')
const path = require("path");
const resolve = file => path.resolve(__dirname, file)

let count = 0
module.exports = function (app, templatePath, cb) {
    let ready
    const onReady = new Promise(r => ready = r)

    let serverBundle
    let clientManifest
    let template

    const update = () => {
        console.log('update invoke...', count++)
        // 构建完毕，通知server可以render渲染了
        if (serverBundle && clientManifest) {
            console.log('promise ready')
            ready()
            //更新server中的renderer
            cb(serverBundle, {
                template,
                clientManifest,
            })
        }
    }

    // 监视构建template，调用update更新renderer
    template = fs.readFileSync(templatePath, 'utf-8')
    chokidar.watch(templatePath).on('change', () => {
        template = fs.readFileSync(templatePath, 'utf-8')
        console.log('template updated')
        update()
    })
    // 监视构建serverBundle，
    const serverConfig = require('./webpack.server.config')
    const webpack = require('webpack')
    const serverCompiler = webpack(serverConfig)
    const webpackDevMiddleware = require('webpack-dev-middleware')
    webpackDevMiddleware(serverCompiler, {
        logLevel: 'silent'
    })
    serverCompiler.hooks.done.tap('server', () => {
        serverBundle = JSON.parse(serverCompiler.outputFileSystem.readFileSync(resolve('../dist/vue-ssr-server-bundle.json'), 'utf-8'))
        update()
    })
    // 监视构建clientManifest
    const clientConfig = require('./webpack.client.config')
    clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
    clientConfig.entry.app = [
        'webpack-hot-middleware/client?reload=true&noInfo=true',
        clientConfig.entry.app
    ]
    clientConfig.output.filename = '[name].js'
    const clientCompiler = webpack(clientConfig)
    const clientDevMiddleware = webpackDevMiddleware(clientCompiler, {
        publicPath: clientConfig.output.publicPath,
        logLevel: 'silent'
    })
    clientCompiler.hooks.done.tap('client', () => {
        clientManifest = JSON.parse(clientCompiler.outputFileSystem.readFileSync(resolve('../dist/vue-ssr-client-manifest.json'), 'utf-8'))
        update()
    })
    app.use(clientDevMiddleware)
    const hotMiddleware = require('webpack-hot-middleware')
    app.use(hotMiddleware(clientCompiler, {
        log: true
    }))
    console.log('onReady return')
    return onReady
}
