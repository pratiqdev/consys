import consys from './dist/src/consys2.js'


const config = {
    name: 'string',
    building:{
        residents: {
            res_name: 'string',
            owner: {
                _type: 'string',
                _required: true
            },
        }
    },


}

const options = {
    allowCustom: false,
    allowEmpty: true,
    clampRange: true,
}

const func = (settings) => {
    // console.log('-'.repeat(100))
    // console.log(`>> My name is ${settings.name} and I am ${settings.age} years old. I live in a ${settings.building.type} built in ${settings.building.year}`)
    console.log('v'.repeat(100))
    console.log(settings)
}

const myFunc = consys(func, config, options)

myFunc({
    name: 'John',
    building: {
        // year: 9999,
        residents: {

        }
    }
})