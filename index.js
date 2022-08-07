import consys from './dist/consys.js'


const config = {
    'name': {
        default: 'John',
        min: 1,
        max: 50,
    },
    'age':{
        type: 'number',
        min: 1,
        max: 100
    },
    'custom':{
        default: 'blap'
    },
    'obj':{
        type: {
            first: 'obj:first',
            last: 'obj:last'
        }
    },
    'obj:first':{},
    'obj:last':{},
}

const options = {
    allowCustom: false,
}




const func = (settings) => {
    console.log(`>> My name is ${settings.name} and I am ${settings.age} years old`)
    console.log('-'.repeat(60))
    console.log(settings)
}


const myFunc = consys(func, config, options)





myFunc({
    name: 'Mike',
    age: 1000,
    custom: 'dope',
    obj: {
        some: 'thing',
        count: 51
    }
})