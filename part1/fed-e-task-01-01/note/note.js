// 函数柯里化实现
function curry(fn) {
    return function curriedFn(...args) {
        if (args.length >= fn.length) {
            return fn(...args)
        }
        return function (...leftArgs) {
            // args.length + leftArgs.length <= fn.length
            // 合并柯里化过程中传递的参数，递归调用curriedFn
            return curriedFn(args.concat(leftArgs))
        }
    }
}

// ... 操作符
// 作为形参是包含函数剩余参数的数组
// 作为实参会将数组解构赋值给函数参数

// promise分析
// then方法生成的promise的状态由父promise决定，当父promise状态确定时会确定子promise的状态

// common js module.exports

// npm i

// js消息队列、事件循环机制
