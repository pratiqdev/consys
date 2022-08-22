import dotenv from 'dotenv'
import { I_consetConfigItems, I_consetConfigItem, I_consetConfigOptions } from './interfaces'
import debug from 'debug'
import argo from './argo.js'
const log = debug('consys')
dotenv.config()




/* 
config = {}
func = () => {}
realFunc = consys(func, config)

realFunc(arguments)
*/






//==============================================================================
const consys = <T>(
    callback:Function, 
    config: I_consetConfigItems, 
    options:I_consetConfigOptions
) => {

    const log_config = log.extend('config')

    //$ Parse function arguments for empty values                               
    if(!callback){ 
        log_config('WARN: No callback provided in config. Returning noop.')
        return () => {}; 
    }

    if(!config){
        log_config('WARN: No config provided. Returning original callback.')
        return callback;
    } 

    if(!options){
        log_config('WARN: No options provided. Using default options.')
        options = {}
    } 

    // const struct: any = {}


    //$ Create a settings object from parsed arguments                          
    const settings = {
        allowCustom: options?.allowCustom   ?? false,
        clampRange: options?.clampRange     ?? true,
    }

    log_config('Initial config:', {
        config, settings
    })






    // //? create the struct object from config                                 
    // Object.entries(config).forEach((item:any) => {
    //     const configItemName:string = item[0]
    //     const configItem:I_consetConfigItem = item[1]

    //     struct[configItemName] = configItem
    // })








    //& Parse the arguments and compare to config                               
    const parser = (args: T) => {
        const log_parser = log.extend('parser')

        log_parser('Running parser')

        const { get, set, store } = argo(args)



     


        const parseSingleArgument = (argName:string, argValue: any, configItem:any, parents?: string[]) => {

            log_parser(`Parsing: ${argName} : ${argValue} @ ${JSON.stringify(configItem)}`)
            log_parser({argName, argValue, configItem})


            //$ Prevent custom arguments if they do not exist in the config                         
            if(!settings.allowCustom && !(argName in config)){
                throw new Error(`CONSYS | "${argName}" does not exist in config. Set option "{ allowCustom: true }" to allow arguments not defined in the config.`)
            }

            
            
            if(configItem){
                log_parser(`Found "${argName}" in config:`, config[argName])
                
                //$ Find and use the env variable if one is specified
                if(configItem.env && configItem.env !== '' && process && process.env && process.env[configItem.env] !== ''){
                    argValue = process.env[configItem.env]
                }

                // infer a type from config type or typeof config default
                let inferredTypeDef = configItem.type 
                    ?? typeof configItem.default 
                    ?? null

                //$ handle type mismatch and allow null / undefined
                if(inferredTypeDef && typeof argValue !== inferredTypeDef){
                    if(configItem.allowNull && !argValue && typeof argValue !== 'undefined'){
                        // parsedArguments[argName] = null
                        set(argName, null)
                        return
                    }else if(configItem.allowUndefined && typeof argValue === 'undefined'){
                        // parsedArguments[argName] = undefined
                        set(argName, undefined)
                        return
                    }else if(!configItem.type){
                        log_parser(`WARN: "${argName}" does not contain a type definition.`)
                    }
                    else{
                        let msg = `Value "${argValue}" of "${argName}" does not have type "${inferredTypeDef}"`
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


                //$ handle object key:val assignment
                if(typeof argValue === 'object' && !Array.isArray(argValue)){

                    if(!('keys' in configItem) || !Array.isArray(configItem.keys)){
                        throw new Error(`CONSYS | Object "${argName}" must contain an array of keys.`)
                    }

                    configItem.keys.forEach((key:any) => {
                        const nestKey = `$${key}`
                        if(!(nestKey in config)){
                            log_parser(`WARN: Key "${nestKey}" from object "${argName}" not found in config.`)
                        }else{
                            // parseSingleArgument([ `$${key}` , argValue[`$${key}`],  ])

                            log_parser(`Found key "${nestKey}" in config:`, config[nestKey])
                            log_parser(`USING SETTER: "parsedArguments[${argName}][${key}]"`)

                            // parsedArguments[argName] = {}

                            parseSingleArgument(nestKey, argValue[key], config[nestKey], [argName, key])
                        } 
                    })

                }



                if(configItem.options){
                    if(!Array.isArray(configItem.options)){
                        throw new Error(`CONSYS | Config options must be an array of values`)
                    }
                    log_parser(`Testing ${argValue} in provided options:`, configItem.options)
                    if(!configItem.options.includes(argValue)){
                        throw new Error(`CONSYS | Value "${argValue}" does not exist in options: [ ${configItem.options.join(' | ')} ]`)
                    }

                    
                }

                //~ HOW TO HANDLE SETTING NESTED KEY:VALS
                if(parents){
                    
                    log_parser(`===> Assigning ${argValue} to ${parents}`)
                    set(parents.join('.'), argValue)
                    log_parser(`===> `, store)


                }else{
                    set(argName, argValue)
                }

             

            }else{
                log(`No set "${argName}" in struct`)
                // parsedArguments[argName] = argValue
                set(argName, argValue)
            }
        }

        // Object.entries(args).forEach(parseSingleArgument)

        Object.entries(args).forEach((arg:any) => {
            parseSingleArgument(arg[0], arg[1], config[arg[0]])
        })


        log_parser(`Done parsing arguments...`)
        log_parser(`Settings:`, store)









        //& Create & assign defaults of the config object                                        
        Object.entries(config).forEach((configItem:any) => {
            let configName = configItem[0]
            let configValues = configItem[1]
            
            //$ If parsedArguments is missing a value included in the config
            if(!(configName in store)){
                // assign the default if exists
                if(configValues.default){
                    // parsedArguments[configName] = configValues.default
                    set(configName, configValues.default)
                }
                // assign null if allowed
                else if(configValues.allowNull){
                    set(configName, null)
                    // parsedArguments[configName] = null
                }
                // or assign undefined if allowed
                else if(configValues.allowUndefined){
                    // parsedArguments[configName] = undefined
                    set(configName, undefined)

                }
                // if arg required, throw error
                else if(configValues.required){
                    throw new Error(`Config item ${configName} is required`)
                }
            }
            
        })


        return store
    }//////////////////////////////////////////////////////////////////// PARSER

    return (args:T) => callback(parser(args))

}//////////////////////////////////////////////////////////////////////// CONSYS






interface I_parserConfig {
    name?: string;
    age: number;
}

export const types = {
    STRING: 'string',
    NUMBER: 'number',
    BOOLEAN: 'boolean',
    OBJECT: 'object',
    ARRAY: 'array',
}

export default consys



// // conset takes a config object and returns the callback handler
// const myFunc = consys<I_parserConfig>((settings:any) => {
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

// // // callback handler takes a callback and returns the settings parser
// // // const valueParser = registerCallback((settings:any)=>{
// // //     log('myFunc |',settings)
// // // })

// // // pass values to the settings parser - which calls the callback set above
// myFunc({
//     name: 'Mike',
//     age: 1000,
// })