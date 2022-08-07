import dotenv from 'dotenv'
import { I_consetConfigItems, I_consetConfigItem, I_consetConfigOptions } from './interfaces'

dotenv.config()

const debugMode = true
const debug = (...v:any | any[]) => {
    debugMode && console.log('debug |', ...v)
}


/* 
config = {}
func = () => {}
realFunc = consys(func, config)

realFunc(arguments)
*/





//~/////////////////////////////////////////////////////////////////////////////////////////////////
const conset = <T>(
    callback:Function, 
    config: I_consetConfigItems, 
    options:I_consetConfigOptions
) => {

    //+ Parse function arguments for empty values
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++                                              
    if(!callback) return () => {};
    if(!config) return callback;
    if(!options) options = {}
    // const struct: any = {}


    //+ Create a settings object from parsed arguments
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++                                              
    const settings = {
        allowCustom: options?.allowCustom   ?? false,
        clampRange: options?.clampRange     ?? true
    }

    debug('conset | config:', {
        config, settings
    })






    // //+ create the struct object from config                                                        
    // //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++                                              
    // Object.entries(config).forEach((item:any) => {
    //     const configItemName:string = item[0]
    //     const configItem:I_consetConfigItem = item[1]

    //     struct[configItemName] = configItem
    // })








    //+ Parse the arguments and compare to config   
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++                                              
    const parser = (args: T) => {
        debug('conset | parser')

        const parsedArguments:any = {}

        //& Parse each argument                                                                     
        Object.entries(args).forEach((tempItem:any) => {
            let argName:string = tempItem[0]
            let argValue:any = tempItem[1]
            let configItem:any = config[argName] || null


            //$ Prevent custom arguments if they do not exist in the config                         
            if(!settings.allowCustom && !(argName in config)){
                throw new Error(`"${argName}" does not exist in config`)
            }

            //$ Find and use the env variable if one is specified
            if(configItem.env && configItem.env !== ''){
                argValue = process?.env[configItem.env] || tempItem[1]
            }


            if(configItem){
                debug(`Found "${argName}" in config:`, config[argName])

                // infer a type from config type or typeof config default
                let inferredType = configItem.type 
                    ?? typeof configItem.default 
                    ?? null

                //$ handle type mismatch and allow null / undefined
                if(inferredType && typeof argValue !== inferredType){
                    if(configItem.allowNull && !argValue && typeof argValue !== 'undefined'){
                        parsedArguments[argName] = null
                        return
                    }else if(configItem.allowUndefined && typeof argValue === 'undefined'){
                        parsedArguments[argName] = undefined
                        return
                    }else{
                        let msg = `Value of "${argName}" does not have type "${inferredType}"`
                        throw new TypeError(msg)
                    }
                }


                //$ handle range of string with min/max
                if(typeof argValue === 'string' || Array.isArray(argValue)){
                    if(argValue.length){
                        if(configItem.min && argValue.length < configItem.min){
                            let msg = `Value "${argValue}" is less than config.min: ${configItem.min}`
                            throw new RangeError(msg)
                        }else if(configItem.max && argValue.length > configItem.max){
                            let msg = `Value "${argValue}" is greater than config.max: ${configItem.max}`
                            throw new RangeError(msg)
                        }
                    }else{
                        if(configItem.min && argValue < configItem.min){
                            let msg = `Value "${argValue}" is less than config.min: ${configItem.min}`
                            throw new RangeError(msg)
                        }else if(configItem.max && argValue > configItem.max){
                            let msg = `Value "${argValue}" is greater than config.max: ${configItem.max}`
                            throw new RangeError(msg)
                        }
                    }
                }

                //$ handle range of numbers with min/max
                if(typeof argValue === 'number'){
                    // check if value is less than safe minimum
                    if(argValue < Number.MIN_SAFE_INTEGER){
                        if(settings.clampRange){
                            argValue = Number.MIN_SAFE_INTEGER
                        }else{
                            let msg = `Value ${argValue} is less than MIN_SAFE_NUMBER: ${Number.MIN_SAFE_INTEGER}`
                            throw new RangeError(msg)
                        }
                    }
                    // check if value is greater than safe maximum
                    else if(argValue > Number.MAX_SAFE_INTEGER){
                        if(settings.clampRange){
                            argValue = Number.MAX_SAFE_INTEGER
                        }else{
                            let msg = `Value ${argValue} is greater than MAX_SAFE_NUMBER: ${Number.MAX_SAFE_INTEGER}`
                            throw new RangeError(msg)
                        }
                    }
                    // check if config has min and value is less than min
                    else if(configItem.min && argValue < configItem.min){
                        if(settings.clampRange){
                            argValue = configItem.min
                        }else{
                            let msg = `Value ${argValue} is less than config.min: ${configItem.min}`
                            throw new RangeError(msg)
                        }
                    }
                    // check if config has max and value is greater than max
                    else if(configItem.max && argValue > configItem.max){
                        if(settings.clampRange){
                            argValue = configItem.max
                        }else{
                            let msg = `Value ${argValue} is greater than config.max: ${configItem.max}`
                            throw new RangeError(msg)
                        }
                    }
                }


          

                parsedArguments[argName] = argValue
             

            }else{
                debug(`No set "${argName}" in struct`)
                parsedArguments[argName] = argValue
            }
        })









        //$ If parsedArguments is missing a value included in the config
        //& Create it from the defaults of the config object                                        
        Object.entries(config).forEach((configItem:any) => {
            let configName = configItem[0]
            let configValues = configItem[1]

            if(!(configName in parsedArguments)){
                if(configValues.default){
                    parsedArguments[configName] = configValues.default
                }
                else if(configValues.allowNull){
                    parsedArguments[configName] = null
                }
                else if(configValues.allowUndefined){
                    parsedArguments[configName] = undefined
                }
                else if(configValues.required){
                    throw new Error(`Config item ${configName} is required`)
                }
            }
            
        })


        return parsedArguments
    }

    return (args:T) => callback(parser(args))
}


interface I_parserConfig {
    name?: string;
    age: number;
}


export default conset

export const types = {
    STRING: 'string',
    NUMBER: 'number',
    BOOLEAN: 'boolean',
    OBJECT: 'object',
    ARRAY: 'array',
}




// // conset takes a config object and returns the callback handler
// const myFunc = conset<I_parserConfig>((settings:any) => {
//     console.log(`>> My name is ${settings.name} and I am ${settings.age} years old`)
// }, {
//     'name': {
//         default: 'John',
//         min: 1,
//         max: 50,
//     },
//     'age':{
//         type: 'number',
//         min: 1,
//         max: 100
//     },
//     'custom':{
//         default: 'blap'
//     }
// }, {
//     // clampRange: false,
//     // allowCustom: true
// })

// // callback handler takes a callback and returns the settings parser
// // const valueParser = registerCallback((settings:any)=>{
// //     debug('myFunc |',settings)
// // })

// // pass values to the settings parser - which calls the callback set above
// myFunc({
//     name: 'Mike',
//     age: 1000,
// })