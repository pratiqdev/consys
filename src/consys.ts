import { T_ConsysConfig, T_ConsysConfigItem, T_ConsysOptions, T_Consys } from './interfaces'
import nestore from './nestore-eventless.js'




//==============================================================================
const consys: T_Consys = <T>(
    callback:Function, 
    config: T_ConsysConfig, 
    options:T_ConsysOptions
    ) => {
        
    let debug: (str:any) => ({ extend: (str:any) => any}) = (str:any) => ({ extend: (str:any) => {}})
    import('dotenv').then(mod => debug = mod.default.config()).catch(() => {})
    import('debug').then(mod => debug = mod.default).catch(() => {})
    
    const log = debug('@pq:consys')
    const log_config = log.extend('config')

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

    const settings = {
        directiveDeclaration:   options?.directiveDeclaration       ?? '_',
        clampRange:             options?.clampRange                 ?? true,
        clampFloats:            options?.clampFloats                ?? false,
        clampOptions:           options?.clampOptions               ?? true,
        trimStrings:            options?.trimStrings                ?? false,
        allowNull:              options?.allowNull                  ?? false,
        allowCustom:            options?.allowCustom                ?? false,
        // allowUndefined:         options?.allowUndefined             ?? false,
        allowEmpty:             options?.allowEmpty                 ?? false,
        throwErrors:            options?.throwErrors                ?? true,
        envOverride:            options?.envOverride                ?? false,
    }

    //$ UTILS
    /** Returns true if is string & starts with directive declaration character */
    const isConfigDirective = (val: any) => typeof val === 'string' && val.startsWith(settings.directiveDeclaration)
    /** Returns true if object contains at least one directive: _anything */
    const isConfigObject = (val: any) => typeof val === 'object' && Object.keys(val).some(key => isConfigDirective(key))
    /** Returns true if object contains only directives */
    const isStrictConfigObject = (val: any) => typeof val === 'object' && Object.keys(val).every(key => isConfigDirective(key))
    /** Returns true if arg is object & not array */
    const isObject = (val:any) => typeof val === 'object' && !Array.isArray(val) ///&& Object.keys(val).every(key => !isConfigDirective(key))


    const alreadyEmittedErrors:any[] = []


    const throwError = (msg:string) => {
        if(!alreadyEmittedErrors.includes(msg)){
            alreadyEmittedErrors.push(msg)
        }else{
            return
        }
        if(settings.throwErrors){
            throw new Error(msg)
        }else{
            console.log(`\n\x1b[33m`+'-'.repeat(80)+`\nCONSYS | Error:\n\n` + msg + '\n\x1b[0m')
        }
    }
    
    const throwTypeError = (msg:string ) => {
        if(!alreadyEmittedErrors.includes(msg)){
            alreadyEmittedErrors.push(msg)
        }else{
            return
        }
        if(settings.throwErrors){
            throw new TypeError(msg)
        }else{
            console.log(`\n\x1b[33m`+'-'.repeat(80)+`\nCONSYS | TypeError:\n\n` + msg + '\n\x1b[0m')
            // console.log(`\n\x1b[33mCONSYS | TypeError:\n` + msg + '\n\x1b[0m')
        }
    }
    
    const throwRangeError = (msg:string) => {
        if(!alreadyEmittedErrors.includes(msg)){
            alreadyEmittedErrors.push(msg)
        }else{
            return
        }
        if(settings.throwErrors){
            throw new RangeError(msg)
        }else{
            console.log(`\n\x1b[33m`+'-'.repeat(80)+`\nCONSYS | RangeError:\n\n` + msg + '\n\x1b[0m')
            // console.log(`\n\x1b[33mCONSYS | RangeError:\n` + msg + '\n\x1b[0m')
        }
    }



    const {
        get: getConfig,
        set: setConfig,
        store: configStore,
    } = nestore(config)
    
    log_config(`config:`, configStore)
    
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    const parser = (args:T) => {
        const { get:getArgs, set:setArgs, store:argStore } = nestore(args || {})

        try{
        const log_parser = log.extend('parser')
        const log_preCon = log_parser.extend('pre')
        const log_args = log_parser.extend('arg')
        const log_postCon = log_parser.extend('pst')


        log_parser(`args:`, argStore)
        log_parser('='.repeat(60))




        const createConfigObjectFromString = (_configKey:string, _configString:string) => {
            let _type 
            let _default

            switch(_configString.toLowerCase().trim()){
                case '':
                case 's':
                case 'str':
                case 'string': _type = 'string'; _default = ''; break;
                
                case 'n':
                case 'num':
                case 'int':
                case 'integer':
                case 'number': _type = 'number'; _default = 0; break;
                
                case 'a':
                case 'arr':
                case 'array': _type = 'array'; _default = []; break;
                    
                case 'o':
                case 'obj':
                case 'object': _type = 'array'; _default = {}; break;
                
                case 'b':
                case 'bool':
                case 'boolean': _type = 'boolean'; _default = false; break;

                case 'f':
                case 'float': _type = 'float'; _default = 0.0; break;
                
            }

            setConfig(_configKey, {
                _type,
                _default,
                _required: true,
            })
        }

        const preParseConfig = (_configKey:string, _configValue:any) => {


            if(isConfigObject(_configValue)){
                log_preCon(`Found configObject: ${_configKey}`)

                // if(_configValue._env && _configValue._env !== '' && process && process.env && process.env[_configValue._env] !== ''){
                //     console.log('pre override:')
                //     setArgs(_configKey, process.env[_configValue._env])
                // }
            }
            else if(typeof _configValue === 'string'){
                log_preCon(`Found config string...`)
                createConfigObjectFromString(_configKey, _configValue)
            }
            else{
                log_preCon(`Not a config object: ${_configKey}`)
                Object.entries(_configValue).forEach((cv:any) => {
                    let name = cv[0]
                    let value = cv[1]
                    log_preCon(`Parsing deeper into: "${_configKey}.${name}"`)
                    preParseConfig(`${_configKey}.${name}`, value)
                })
            }

        }

        const postParseConfig = (_configKey:string, _configValue:any) => {

            if(isConfigObject(_configValue)){
                log_postCon(`Found configObject: ${_configKey}`)
                
                //$ Find and use the env variable if one is specified
                if(_configValue._env && _configValue._env !== '' && process && process.env && process.env[_configValue._env] !== ''){
                    // if there is no current arg value, set one
                    if(!getArgs(_configKey)){
                        setArgs(_configKey, process.env[_configValue._env])
                    }
                    // override with env variable if set
                    if(settings.envOverride){
                        setArgs(_configKey, process.env[_configValue._env])
                    }
                }
            }
            else if(typeof _configValue === 'string'){
                log_postCon(`Found config string...`)
                createConfigObjectFromString(_configKey, _configValue)
            }
            else{
                log_postCon(`Not a config object: ${_configKey}`)
                Object.entries(_configValue).forEach((cv:any) => {
                    let name = cv[0]
                    let value = cv[1]
                    log_postCon(`Parsing deeper into: "${_configKey}.${name}"`)
                    // postParseConfig(`${_configKey}.${name}`, value)
                })
            }

            if(!(_configKey in argStore)){
                log_postCon(`No config item "${_configKey}" in args (store)`)
                // assign the default if exists
                if(_configValue._default){
                    // parsedArguments[configName] = configValues.default
                    setArgs(_configKey, _configValue._default)
                }
                // assign null if allowed
                else if(_configValue._allowNull){
                    setArgs(_configKey, null)
                    // parsedArguments[configName] = null
                }
                // or assign undefined if allowed
                // else if(_configValue._allowUndefined){
                    // parsedArguments[configName] = undefined
                    // setArgs(_configKey, undefined)

                // }
                // if arg required, throw error
                else if(_configValue._required){
                    // throw new Error(`Config item "${_configKey}" is required`)}
                    throwError(`Config item "${_configKey}" is required`)
                }
                
                // assign an empty object 
                // if(!getArgs(_configKey)){
                //     setArgs(_configKey, {})
                // }

            }

        }


        const parseSingleArgument = (_key:string) => {
            const _value:any = getArgs(_key)
            let configItem: T_ConsysConfigItem = getConfig(_key)

            log_args('-'.repeat(60))



            if(!settings.allowCustom && !configItem){
                throwError(`CONSYS | "${_key}" does not exist in config. Set option "{ allowCustom: true }" to allow arguments not defined in the config.`)
            }

            if(isObject(configItem) && !configItem._type){
                log_args('ZX4 | Object found with no type. Setting config _type to "object"')
                setConfig(_key, {...configItem, _type: 'object'})
                configItem = getConfig(_key)
            }

            if(typeof _value === 'string'){
                log_args(`String found: ${_value}`)
            }


      
            if(isConfigObject(configItem)){
                log_args(`D9E | Config item is configObject`)

                if(configItem._env && configItem._env !== '' && process && process.env && process.env[configItem._env] !== ''){
                    console.log('single override')
                    // setArgs(_key, process.env[configItem._env])
                }

           


                
                // infer a type from config type or typeof config default
                let inferredConfigType = 
                    configItem._type 
                    ?? typeof configItem._default 
                    ?? false

                let inferredValueType = 
                    _value?._type 
                    ?? typeof _value 
                    ?? false



                log_args({
                    _key,
                    _value,
                    configItem,
                    inferredConfigType,
                    inferredValueType,
                })

                
                
                if(_value && isObject(_value)){
                    Object.entries(_value).forEach((item:any) => {
                        let name = item[0]
                        log_args(`FGD | Parsing deeper into "${_key} => ${name}"`)
                        parseSingleArgument(`${_key}.${name}`)
                    })
                }

                if(configItem && isObject(configItem) && !isStrictConfigObject(configItem)){
                    Object.entries(configItem).forEach((item:any) => {
                        let name = item[0]
                        log_args(`P7F | Parsing deeper into "${_key} => ${name}"`)
                        parseSingleArgument(`${_key}.${name}`)
                    })
                }


                //& handle type matching                                                            
                if(inferredConfigType && typeof _value !== inferredConfigType){
                    if(!configItem._type){
                        log_parser(`WARN: "${_key}" does not contain a type definition.`)
                    }

                    // if(!_value && (settings.allowEmpty || configItem._allowEmpty)){
                    //     if(inferredConfigType === 'string') setArgs(_key, '')
                    //     if(inferredConfigType === 'array') setArgs(_key, [])
                    //     if(inferredConfigType === 'object') setArgs(_key, {})
                    // }

                    if((settings.allowNull || configItem._allowNull) && !_value && typeof _value !== 'undefined'){
                        log_parser(`Allowing null: "${_key}" => "null"`)
                        setArgs(_key, null)
                    }
                    // else if((settings.allowUndefined || configItem._allowUndefined) && typeof _value === 'undefined'){
                        // log_parser(`Allowing undefined: "${_key}" => "undefined"`)
                        // setArgs(_key, undefined)
                    // }
                    else if(configItem._default){
                        log_parser(`Setting default to "${_key}" => "${configItem._default}"`)
                        setArgs(_key, configItem._default)
                    }
                    else if(configItem._required && !_value){
                        if((settings.allowEmpty || configItem._allowEmpty)){
                            if(inferredConfigType === 'number') setArgs(_key, 0)
                            if(inferredConfigType === 'string') setArgs(_key, '')
                            if(inferredConfigType === 'array') setArgs(_key, [])
                            if(inferredConfigType === 'object') setArgs(_key, {})
                        }
                        else if(settings.allowNull){
                            setArgs(_key, null)
                        }
                        // else if(settings.allowUndefined){
                        //     setArgs(_key, undefined)
                        // }
                        else{
                            log_parser(`"${_key}" is required...`)
                            throwTypeError(`Value "${_key.split('.').pop()}" of type <${inferredConfigType}> is required. Received <${typeof _value}>  \n( ${_key.split('.').join(' > ')} ) = "${_value}"`)
                        }
                    }
                    else{
                        log_parser(`Type mismatch: "${_key}" <${typeof _value}> !== <${inferredConfigType}>`, _value)
                        // throw new TypeError(`Value "${_key}" of "${_value}" does not have type "${inferredConfigType}"`)
                    }
                    // log_args(`Type of value does not match inferredConfigType...`)
                    // throw new TypeError(`Key "${_key}" with value "${_value}" does not match type "${inferredConfigType}"`)
                }
                
                //& handle range of string with min/max                                                    
                if(inferredConfigType === 'string'){
                    if(_value && _value.length){
                        if(configItem._min && _value.length < configItem._min){
                            // if(settings.trimStrings){ //? padStrings: true ?
                                // setArgs(_key, )
                            // }else{
                                let msg = `Value "${_value}" is less than config.min: ${configItem._min}`
                                throwRangeError(msg)
                            // }
                        }else if(configItem._max && _value.length > configItem._max){
                            if(settings.trimStrings){
                                setArgs(_key, _value.substring(0, configItem._max))
                            }else{
                                let msg = `Value "${_value}" is greater than config.max: ${configItem._max}`
                                throwRangeError(msg)
                            }
                        }
                    }else{
                        if(settings.allowEmpty){
                            setArgs(_key, '')
                        }
                    }
                    // else{
                    //     if(configItem._min && _value < configItem._min){
                    //         let msg = `Value "${_value}" is less than config.min: ${configItem._min}`
                    //         throw new RangeError(msg)
                    //     }else if(configItem.max && _value > configItem.max){
                    //         let msg = `Value "${_value}" is greater than config.max: ${configItem.max}`
                    //         throw new RangeError(msg)
                    //     }
                    // }
                }

                //& handle range of numbers with min/max                                            
                if(inferredConfigType === 'number'){
                    log_args(`NUMBER | ${_key}:${_value}`)
                    // check if value is less than safe minimum
                    if(_value < Number.MIN_SAFE_INTEGER){
                        if(settings.clampRange){
                            setArgs(_key, Number.MIN_SAFE_INTEGER)
                        }else{
                            let msg = `Value ${_value} is less than MIN_SAFE_NUMBER: ${Number.MIN_SAFE_INTEGER}`
                            throwRangeError(msg)
                        }
                    }
                    // check if value is greater than safe maximum
                    else if(_value > Number.MAX_SAFE_INTEGER){
                        if(settings.clampRange){
                            setArgs(_key, Number.MAX_SAFE_INTEGER)
                        }else{
                            let msg = `Value ${_value} is greater than MAX_SAFE_NUMBER: ${Number.MAX_SAFE_INTEGER}`
                            throwRangeError(msg)
                        }
                    }
                    // check if config has min and value is less than min
                    else if(configItem._min && _value < configItem._min){
                        if(settings.clampRange){
                            setArgs(_key, configItem._min)
                        }else{
                            let msg = `Value ${_value} is less than config.min: ${configItem._min}`
                            throwRangeError(msg)
                        }
                    }
                    // check if config has max and value is greater than max
                    else if(configItem._max && _value > configItem._max){
                        if(settings.clampRange){
                            setArgs(_key, configItem._max)
                        }else{
                            let msg = `Value ${_value} is greater than config.max: ${configItem._max}`
                            throwRangeError(msg)
                        }
                    }
                }

                //& handle config options array                                                     
                if(configItem._options){
                    if(!Array.isArray(configItem._options)){
                        throwError(`CONSYS | Config options must be an array of values`)
                    }
                    log_parser(`Testing ${_value} in provided options:`, configItem._options)
                    if(!configItem._options.includes(_value)){
                        if(settings.clampOptions){
                            setArgs(_key, configItem._options[0])
                        }else{
                            throwError(`CONSYS | Value "${_value}" does not exist in options: [ ${configItem._options.join(' | ')} ]`)
                        }
                    }

                    
                }



            }
            // else{
            //     Object.entries(configItem).forEach((item:any) => {
            //         let name = item[0]
            //         let value = item[1]
            //         log_args(`>> z | Parsing deeper into "${_key} => ${name}"`)
            //         parseSingleArgument(`${_key}.${name}`)
            //     })
            // }



           
        }

   

        //& Create & assign defaults of the config object                                        
        log_preCon(`preParseConfig`, '-'.repeat(60))
        Object.entries(config).forEach((configItem:any) => {
            let configName = configItem[0]
            let configValues: T_ConsysConfigItem = configItem[1]
            preParseConfig(configName, configValues)
        })
        
        log_parser(`parseArgs`, '-'.repeat(60))
        Object.entries(argStore).forEach((arg:any) => {
            parseSingleArgument(arg[0])
        })

        log_postCon(`postParseConfig`, '-'.repeat(60))
        Object.entries(config).forEach((configItem:any) => {
            let configName = configItem[0]
            let configValues: T_ConsysConfigItem = configItem[1]
            postParseConfig(configName, configValues)
        })

        log_parser('PARSING COMPLETE')

        // throw new Error('test err...')
        return argStore

        }catch(err){
            const ERR:any = err 
            // console.log('Dumping config on error:', configStore)
            // console.log('|'.repeat(80))
            // console.log('|'.repeat(80))
            // console.log('Dumping store on error:', argStore)
            if(settings.throwErrors){
                throw new Error(ERR)
            }else{
                console.log('-'.repeat(80))
                console.log('CONSYS ERROR:\n', ERR.message || ERR);
                console.error(err)
                console.log('-'.repeat(80))
            }

            return false
        }


    }//////////////////////////////////////////////////////////////////// PARSER



    return (args:T) => callback(parser(args))

}//////////////////////////////////////////////////////////////////////// CONSYS







export default consys
