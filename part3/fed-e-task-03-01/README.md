## 一、简答题

### 1、当我们点击按钮的时候动态给 data 增加的成员是否是响应式数据，如果不是的话，如何把新增成员设置成响应式数据，它的内部原理是什么。

```js
let vm = new Vue({
 el: '#el'
 data: {
  o: 'object',
  dog: {}
 },
 method: {
  clickHandler () {
   // 该 name 属性是否是响应式的
   this.dog.name = 'Trump'
  }
 }
})
```
答：不是。vue内部会在响应式数据被赋值为对象时才会重新将新对象的属性定义为响应式数据。
因此可以将dog对象赋值为一个新对象，新对象包含name字段，那么此时的dog的name属性就是
响应性的。
 　

　

　



### 2、请简述 Diff 算法的执行过程
答：snabbdom的diff算法优化了传统的diff算法，对比节点时只比较同级节点。比较时会依次
判断旧开始新开始、旧结束新结束、旧开始新结束、就结束新开始节点是否为相同节点。如果是相同
节点，则调用patchNode方法比较节点操作DOM，并更新索引。如果不同，则会判断旧节点中是否
"存在"新节点。如果存在则调用patchNode方法比较node修改DOM，并移动旧节点中的"新节点"。
如果不存在，则需要创建新的DOM，并将其插入DOM树中。
　

　

　



 

## 二、编程题

### 1、模拟 VueRouter 的 hash 模式的实现，实现思路和 History 模式类似，把 URL 中的 # 后面的内容作为路由的地址，可以通过 hashchange 事件监听路由地址的变化。
参考 js --> my-router.js

　

### 2、在模拟 Vue.js 响应式源码的基础上实现 v-html 指令，以及 v-on 指令。
v-on 参考 mini-vue --> js --> compiler.js onUpdater
v-html 参考 mini-vue --> js --> compiler.js htmlUpdater

 　

　

