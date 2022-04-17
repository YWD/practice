## 简答题

（请直接在本文件中作答）

#### 1、Vue 3.0 性能提升主要是通过哪几方面体现的？
1.响应性系统性能提升  
* Vue2通过defineProperty为对象的属性定义getter和setter方法，并收集和触发依赖，使对象
成为响应式对象。如果属性为对象，还会递归处理属性为对象的属性，使之成为响应性对象。  
* Vue3使用proxy对象实现响应性，性能优于defineProperty。proxy对象还能监听到对象属性的
新增和删除，还能监听数组的索引和length属性。proxy代理的对象，当对象的属性值为对象时，只有
访问到此属性时，才会去处理该属性对象的响应性，不会提前处理。   

2.编译优化
* 优化编译和重写虚拟dom，让首次渲染和更新dom性能有更大的提升  
vue2 通过标记静态根节点,优化 diff 算法  
vue3 标记和提升所有静态根节点,diff 的时候只比较动态节点内容

* Fragments, 模板里面不用创建唯一根节点,可以直接放同级标签和文本内容

　

#### 2、Vue 3.0 所采用的 Composition Api 与 Vue 2.x使用的Options Api 有什么区别？
* Options API通过一个描述组件选项的options对象，包含props,data,methods,等，来实现组件功能，开发复杂
组件时，同一功能模块代码被拆分到不同选项中使得业务逻辑表现的混乱
* Composition API通过将功能封装成方法，使得业务逻辑相互独立，并且可以复用

　

　

#### 3、Proxy 相对于 Object.defineProperty 有哪些优点？
* 性能好，能监听defineProperty监听不到了属性新增和删除，还能监听数组的索引和length属性

　

　

#### 4、Vue 3.0 在编译方面有哪些优化？
* vue.js 3.x中标记和提升所有的静态节点，diff的时候只需要对比动态节点内容；
* Fragments（升级vetur插件): template中不需要唯一根节点，可以直接放文本或者同级标签
静态提升(hoistStatic),当使用 hoistStatic 时,所有静态的节点都被提升到 render 方法之外.只会在应用启动的时候被创建一次,之后使用只需要应用提取的静态节点，随着每次的渲染被不停的复用。
* patch flag, 在动态标签末尾加上相应的标记,只能带 patchFlag 的节点才被认为是动态的元素,会被追踪属性的修改,能快速的找到动态节点,而不用逐个逐层遍历，提高了虚拟dom diff的性能。
* 缓存事件处理函数cacheHandler,避免每次触发都要重新生成全新的function去更新之前的函数
tree shaking 通过摇树优化核心库体积,减少不必要的代码量

　

　

#### 5、Vue.js 3.0 响应式系统的实现原理？
* reactive方法返回target对象的代理对象，监听对象的getter和setter方法并收集和触发依赖，
此外proxy对象还监听deleteProperty操作
* ref可以将一个值包装到一个对象的value属性中，在这个value的getter和setter方法中收集和触发
依赖
* effect标记依赖，调用是会先执行依赖
* track收集依赖，通过target，key找到依赖set收集依赖
* trigger触发依赖，通过target，key找到依赖set并逐个调用
　

　

　
