// let b = {}
// function fn() {
//     return b.value = 1
// }
// console.log(fn())
// console.log(b)

let o1 = {
    x: 100
}
let o2 = o1
o1.y = o1 = {
    x: 200
}
console.log(o1)
console.log(o2)
