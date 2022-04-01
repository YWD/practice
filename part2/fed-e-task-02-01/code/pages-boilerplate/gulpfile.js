// 实现这个项目的构建任务
/*
1.clean任务，负责清空构建过程产生的文件，包括temp、dist目录
2.develop任务，负责编译项目文件sass->css，es6->js，swig模板->渲染后的文件
3.build任务，负责生成项目最后要发布的文件。需要把编译过的文件进一步压缩处理，以及处理
  构建注释等内容
 */
const { src, dest, parallel, series, watch } = require('gulp')
const loadPlugins = require('gulp-load-plugins')
const plugins = loadPlugins()
const sass = require('gulp-sass')(require('sass'))
const browserSync = require('browser-sync')
const bs = browserSync.create()

// 1.clean
const del = require('del')
const clean = () => {
  return del(['temp', 'dist'])
}

// 渲染HTML模板的数据
const data = {
  menus: [
    {
      name: 'Home',
      icon: 'aperture',
      link: 'index.html'
    },
    {
      name: 'Features',
      link: 'features.html'
    },
    {
      name: 'About',
      link: 'about.html'
    },
    {
      name: 'Contact',
      link: '#',
      children: [
        {
          name: 'Twitter',
          link: 'https://twitter.com/w_zce'
        },
        {
          name: 'About',
          link: 'https://weibo.com/zceme'
        },
        {
          name: 'divider'
        },
        {
          name: 'About',
          link: 'https://github.com/zce'
        }
      ]
    }
  ],
  pkg: require('./package.json'),
  date: new Date()
}
// 2.develop
// 2.1 html 读文件-处理文件-写文件
const pages = () => {
  return src('src/**/*.html', { base: 'src' })
    .pipe(plugins.swig({ data, defaults: { cache: false } }))
    .pipe(dest('temp'))
    .pipe(bs.reload({ stream: true }))
}
// 2.2 es6 -> js
const scripts = () => {
  return src('src/assets/scripts/**', { base: 'src' })
    .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
    .pipe(dest('temp'))
    .pipe(bs.reload({ stream: true }))
}
// 2.3 sass -> css
const styles = () => {
  return src('src/assets/styles/**', { base: 'src' })
    .pipe(sass())
    .pipe(dest('temp'))
    .pipe(bs.reload({ stream: true }))
}
// 2.4 启动服务发布开发环境项目
const serve = () => {
  watch('src/**/*.html', pages)   // 监听文件变化，重新编译文件，并推送到browser-server
  watch('src/assets/styles/**', styles)
  watch('src/assets/scripts/**', scripts)
  watch([
    'src/assets/images/**',
    'src/assets/fonts/**',
    'public/**'
  ], bs.reload)

  bs.init({
    notify: false,
    port: 2080,
    // open: false,
    // files: 'temp/**',
    server: {
      baseDir: ['temp', 'src', 'public'],
      routes: {
        '/node_modules': 'node_modules',
      }
    }
  })
}

const compile =  parallel(pages, styles, scripts)

// 2.5 组合develop各个task
const develop = series(
  compile,
  serve
)

// 3.build
// 3.1 处理编译后temp目录下的文件，发布时文件需要压缩、加密等操作
const useref = () => {
  return src('temp/**/*.html', { base: 'temp' })
    .pipe(plugins.useref({ searchPath: ['temp', '.'] }))
    .pipe(plugins.if(/\.js$/, plugins.uglify()))
    .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
    .pipe(plugins.if(/\.html$/, plugins.htmlmin()))
    .pipe(dest('dist'))
}
// 3.2 处理图片、文字、及其它内容
let imagemin
const importImagemin = async () => {
  imagemin = (await import('gulp-imagemin')).default
}
const images = () => {
  return src('src/assets/images/**', { base: 'src' })
    // .pipe(imagemin())
    .pipe(dest('dist'))
}
const handleImagemin = series(importImagemin, images)

const fonts = () => {
  return src('src/assets/fonts/**', { base: 'src' })
    .pipe(imagemin())
    .pipe(dest('dist'))
}
const handleFonts = series(importImagemin, fonts)

const extra = () => {
  return src('public/**', { base: 'public' })
    .pipe(dest('dist'))
}
// 3.3 组合build各个阶段task
const build = series(
  clean,
  parallel(
    series(compile, useref),
    series(
      handleImagemin,  // 新版imagemin无法通过require加载
      parallel(
        images,
        fonts,),
    ),
    extra,
  )
)

// 导出任务
module.exports = {
  clean,
  develop,
  build,
}
