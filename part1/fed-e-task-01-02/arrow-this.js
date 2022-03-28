let obj = {
    value: 'obj',
    f1: function () {
        console.log(this)
    },
    f2: () => {
        console.log(this)
    },
    f3: function () {
        setTimeout(() => {
            console.log(this)
        })
        setTimeout(function () {
            console.log(this)
        })
        console.log(this)
    },
    f4: () => {
        setTimeout(() => {
            console.log(this)
        })
        setTimeout(function () {
            console.log(this)
        })
        console.log(this)
    }
}
// obj.f1()
// obj.f2()
// obj.f3()
obj.f4()
console.log(global)
