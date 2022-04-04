## Vue.js 源码剖析-响应式原理、虚拟 DOM、模板编译和组件化

### 简答题

#### 1、请简述 Vue 首次渲染的过程。
答：
1.缓存公共的 mount 函数，并重写浏览器平台的 mount

2.判断是否传入了 render 函数，没有的话，是否传入了 template ，没有的话，则获取 el 节点的 outerHTML 作为 template

3.调用 baseCompile 函数

4.解析器(parse) 将模板字符串的模板编译转换成 AST 抽象语法树

5.优化器(optimize) - 对 AST 进行静态节点标记，主要用来做虚拟DOM的渲染优化

6.通过 generate 将 AST 抽象语法树转换为 render 函数的 js 字符串

7.将render函数 通过 createFunction 函数 转换为 一个可以执行的函数

8.将最后的 render 函数 挂载到 option 中

9.执行 公共的 mount 函数
　

　

　

#### 2、请简述 Vue 响应式原理。
答：Vue响应式原理核心是 数据劫持，采用 ES5 的 object.defineproperty 的 getter 和 setter 方法。

1.首先，在Vue初始化阶段，通过 observer 对 data 中的属性进行递归的劫持，包括 name、job_ undergo、a、b等 

2.在 get阶段也就是初始化视图时，为每一个劫持的属性分配一个 依赖收集器，主要收集当前属性的观察者对象，例子中 name 属性在模板中有两处被使用，那么 name 属性的依赖收集器中就存放两个观察者对象 

3.当点击按钮时，将 name 修改为 lisi 时，会触发 observer 的 setter 函数，将 value 更新为 lisi 最新值，然后通知依赖收集器数据发生了更新。 

4.依赖收集就是发布订阅模式，依赖收集器会通知所有的观察者对象，当前name 属性有两个观察者对象。 5.观察者对象调用对应的回调函数进行相关的处理和DOM更新
　

　

　

#### 3、请简述虚拟 DOM 中 Key 的作用和好处。
答：key是为了更准确的找到旧节点中是否存在可复用的节点，从而减少DOM操作。

　

　

　

#### 4、请简述 Vue 中模板编译的过程。
答：
1.缓存公共的 mount 函数，并重写浏览器平台的 mount

2.判断是否传入了 render 函数，没有的话，是否传入了 template ，没有的话，则获取 el 节点的 outerHTML 作为 template

3.调用 baseCompile 函数

4.解析器(parse) 将模板字符串的模板编译转换成 AST 抽象语法树

5.优化器(optimize) - 对 AST 进行静态节点标记，主要用来做虚拟DOM的渲染优化

6.通过 generate 将 AST 抽象语法树转换为 render 函数的 js 字符串

7.将render函数 通过 createFunction 函数 转换为 一个可以执行的函数

8.将最后的 render 函数 挂载到 option 中

9.执行 公共的 mount 函数

　

　
