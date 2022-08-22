import consys from './dist/consys.js'


const config = {
    // 'name': {
    //     default: 'John',
    //     min: 1,
    //     max: 50,
    // },
    // 'age':{
    //     type: 'number',
    //     min: 1,
    //     max: 100
    // },
    // 'custom':{
    //     default: 'damn',
    //     options: ['dope', 'sweet', 'damn']

    // },

    'building':{
        type: 'object',
        keys: ['year']
    },
    // '$type':{
    //     type: 'string',
    //     // options: ['house', 'business', 'hotel', 'public']
    // },
    '$year':{
        type: 'number',
        min: 1900,
        max: 2022,
    },
}

const options = {
    allowCustom: false,
    clampRange: true
}




const func = (settings) => {
    // console.log('-'.repeat(100))
    // console.log(`>> My name is ${settings.name} and I am ${settings.age} years old. I live in a ${settings.building.type} built in ${settings.building.year}`)
    console.log('-'.repeat(100))
    console.log(settings)
}


const myFunc = consys(func, config, options)





myFunc({
    // name: 'Mike',
    // age: 1000,
    // custom: 'sweet',
    building: {
        // type: 'house',
        year: 1702
    }
})