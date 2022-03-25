/*
尽可能还原 Promise 中的每一个 API, 并通过注释的方式描述思路和原理.
*/

/*
主要步骤
1. 添加异步处理 resolve方法异步调用
2. then多次调用
3. then方法的链式调用
    3.1 链式调用实现
    3.2 链式调用结果传递
    3.3 结果值类型判断，普通值直接resolve，promise根据状态返回，then(resolve, reject)
4. promise循环调用，异步处理获取promise
5. 错误处理，构造器执行错误reject、successCallback错误传递给下一个promise
6. then参数可选

7. Promise.all，返回结果与参数顺序一致，若参数中的promise有状态为rejected，则Promise.all返回的promise的状态为rejected
8. Promise.resolve
9. finally，无论promise状态是什么都要执行，可以链式调用then方法，获取promise结果
10. catch方法，then方法注册失败回调
 */

// promise status
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

class MyPromise {
    status = PENDING
    // promise只有一种状态，可以用一个值保存正常值或错误原因
    value = undefined
    // 当promise状态未确定时需要将回调保存，待状态确定后执行回调
    successCallbacks = []
    failCallbacks = []
    constructor(executor) {
        try {
            executor(this.resolve, this.reject)
        } catch (e) {
            this.reject(e)
        }
    }

    // resolve、reject方法负责修改promise状态、并且保存任务值
    resolve = value => {
        if (this.status !== PENDING) return ;
        this.status = FULFILLED
        this.value = value
        // promise支持异步任务处理回调
        while (this.successCallbacks.length) this.successCallbacks.shift()()
    }

    reject = reason => {
        if (this.status !== PENDING) return ;
        this.status = FULFILLED
        this.value = reason
        // promise支持异步任务处理回调
        while (this.failCallbacks.length) this.failCallbacks.shift()()
    }

    // then方法可以根据promise状态执行对应回调
    then(successCallback, failCallback) {
        successCallback = successCallback ? successCallback : value => value
        // 默认failCallback会抛出错误，错误被捕获传递给nextPromise
        failCallback = failCallback ? failCallback : reason => { throw reason }
        // then方法链式调用需要返回promise
        let nextPromise = new MyPromise((nextPromiseResolve, nextPromiseReject) => {
            if (this.status === FULFILLED) {
                // 此处异步调用为了获取nextPromise
                setTimeout(() => {
                    try {
                        // 将当前promise回调结果传递给下一个promise，需要注意result类型
                        let result = successCallback(this.value)
                        MyPromise.resolvePromise(nextPromise, result, nextPromiseResolve, nextPromiseReject)
                    } catch (e) {
                        nextPromiseReject(e)
                    }
                },0)
            } else if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        // 将当前promise回调结果传递给下一个promise，需要注意result类型
                        let result = failCallback(this.value)
                        MyPromise.resolvePromise(nextPromise, result, nextPromiseResolve, nextPromiseReject)
                    } catch (e) {
                        nextPromiseReject(e)
                    }
                },0)
            } else {
                // promise异步任务多次调用then方法需要保存回调
                this.successCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            // 将当前promise回调结果传递给下一个promise，需要注意result类型
                            let result = successCallback(this.value)
                            MyPromise.resolvePromise(nextPromise, result, nextPromiseResolve, nextPromiseReject)
                        } catch (e) {
                            nextPromiseReject(e)
                        }
                    },0)
                })
                this.failCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            // 将当前promise回调结果传递给下一个promise，需要注意result类型
                            let result = failCallback(this.value)
                            MyPromise.resolvePromise(nextPromise, result, nextPromiseResolve, nextPromiseReject)
                        } catch (e) {
                            nextPromiseReject(e)
                        }
                    },0)
                })
            }
        })
        return nextPromise
    }

    // 普通值直接传递，如果值为promise将处理流程传递给下个promise
    static resolvePromise(nextPromise, result, nextResolve, nextReject) {
        if (nextPromise === result) {
            nextReject(new TypeError('Chaining cycle detected for promise #<Promise>'))
            return;
        }
        if (result instanceof MyPromise) {
            result.then(nextResolve, nextReject)
        } else {
            nextResolve(result)
        }
    }

    // catch方法捕获错误，就是then方法处理错误回调
    catch(failCallback) {
        return this.then(undefined, failCallback)
    }

    // finally回调无论promise是否成功都会执行，并且会将promise值传递给下一个promise
    finally(callback) {
        return this.then(value => {
            // return MyPromise.resolve(callback()).then(() => value)
            callback()
            return value
        }, reason => {
            return MyPromise.resolve(callback()).then(() => { throw reason })
        })
    }

    // 将值保存到promise中
    static resolve(value) {
        if (value instanceof MyPromise) return value
        return new MyPromise(resolve => resolve(value))
    }

    // all方法返回结果与数组参数顺序对应、支持异步操作。all方法返回promise，其状态由参数中任务执行状态决定
    static all(array) {
        return new MyPromise((resolve, reject) => {
            let result = []
            let count = 0
            function addData(index, value) {
                result[index] = value
                count++
                if (count === array.length) {
                    resolve(result)
                }
            }
            for (let i = 0; i < array.length; i++) {
                let current = array[i]
                if (current instanceof MyPromise) {
                    current.then(value => addData(i, value), reject)
                } else {
                    addData(i, current)
                }
            }
        })
    }
}

module.exports = MyPromise
