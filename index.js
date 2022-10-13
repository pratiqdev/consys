import consys from './dist/consys.js'
export default consys



// const testA = consys((s) => s, {
//     person: {
//         name: {
//             _type: 'string',
//             _default: 'Default'
//         },
//         // age: {
//             // _type: 'number',
//             // _default: 90
//         // }
//     }
// })

// const res = testA()
// console.log('|'.repeat(60))
// console.log(res)
// console.log('|'.repeat(60))

// expect(res.person.name).to.equal('Default')
// expect(res.person.age).to.equal(90)

// const config = {
//     name: 'string',
//     building:{
//         residents: {
//             res_name: 'string',
//             owner: {
//                 _type: 'string',
//                 _required: true
//             },
//         }
//     },


// }

// const options = {
//     allowCustom: false,
//     allowEmpty: false,
//     clampRange: true,
//     throwErrors: false,
// }

// const func = (settings) => {
//     // console.log('-'.repeat(100))
//     // console.log(`>> My name is ${settings.name} and I am ${settings.age} years old. I live in a ${settings.building.type} built in ${settings.building.year}`)
//     console.log('v'.repeat(100))
//     console.log(settings)
// }

// const myFunc = consys(func, config, options)

// myFunc({
//     name: 'John',
//     building: {
//         // year: 9999,
//         residents: {
//             res_name: 'Bob',
//             owner: 'ME'
//         }
//     }
// })