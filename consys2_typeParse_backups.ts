
                // //& handle type matching                                                            
                // if(!_value || (inferredConfigType && typeof _value !== inferredConfigType)){
                //     log_co(`Checking type:`, {
                //         _key,
                //         _value,
                //         inferredConfigType,
                //         inferredValueType,
                //     })
                    
                //     if(!configItem._type){
                //         log_parser(`WARN: "${_key}" does not contain a type definition.`)
                //     }

                //     if(configItem._allowNull && !_value && typeof _value !== 'undefined'){
                //         log_parser(`Allowing null: "${_key}" => "null"`)
                //         setArgs(_key, null)
                //     }else if(configItem._allowUndefined && typeof _value === 'undefined'){
                //         log_parser(`Allowing undefined: "${_key}" => "undefined"`)
                //         setArgs(_key, undefined)
                //     }
                //     else if(configItem._default){
                //         log_parser(`Setting default to "${_key}" => "${configItem._default}"`)
                //         setArgs(_key, configItem._default)
                //     }
                //     else if(configItem._required && !_value){
                //         log_parser(`"${_key}" is required...`)
                //         throw new TypeError(`Value "${_key}" is required by the config.`)
                //     }
                //     else{
                //         log_parser(`Type mismatch: "${_key}" <${typeof _value}> !== '${inferredConfigType}'`, _value)
                //         // throw new TypeError(`Value "${_key}" of "${_value}" does not have type "${inferredConfigType}"`)
                //     }
                // }
                
                // //& handle range of string with min/max                                                    
                // if(typeof _value === 'string'){
                //     if(_value.length){
                //         if(configItem._min && _value.length < configItem._min){
                //             // if(settings.trimStrings){ //? padStrings: true ?
                //                 // setArgs(_key, )
                //             // }else{
                //                 let msg = `Value "${_value}" is less than config.min: ${configItem._min}`
                //                 throw new RangeError(msg)
                //             // }
                //         }else if(configItem._max && _value.length > configItem._max){
                //             if(settings.trimStrings){
                //                 setArgs(_key, _value.substring(0, configItem._max))
                //             }else{
                //                 let msg = `Value "${_value}" is greater than config.max: ${configItem._max}`
                //                 throw new RangeError(msg)
                //             }
                //         }
                //     }
                //     // else{
                //     //     if(configItem._min && _value < configItem._min){
                //     //         let msg = `Value "${_value}" is less than config.min: ${configItem._min}`
                //     //         throw new RangeError(msg)
                //     //     }else if(configItem.max && _value > configItem.max){
                //     //         let msg = `Value "${_value}" is greater than config.max: ${configItem.max}`
                //     //         throw new RangeError(msg)
                //     //     }
                //     // }
                // }

                // //& handle range of numbers with min/max                                            
                // if(typeof _value === 'number'){
                //     log_co(`NUMBER | ${_key}:${_value}`)
                //     // check if value is less than safe minimum
                //     if(_value < Number.MIN_SAFE_INTEGER){
                //         if(settings.clampRange){
                //             setArgs(_key, Number.MIN_SAFE_INTEGER)
                //         }else{
                //             let msg = `Value ${_value} is less than MIN_SAFE_NUMBER: ${Number.MIN_SAFE_INTEGER}`
                //             throw new RangeError(msg)
                //         }
                //     }
                //     // check if value is greater than safe maximum
                //     else if(_value > Number.MAX_SAFE_INTEGER){
                //         if(settings.clampRange){
                //             setArgs(_key, Number.MAX_SAFE_INTEGER)
                //         }else{
                //             let msg = `Value ${_value} is greater than MAX_SAFE_NUMBER: ${Number.MAX_SAFE_INTEGER}`
                //             throw new RangeError(msg)
                //         }
                //     }
                //     // check if config has min and value is less than min
                //     else if(configItem._min && _value < configItem._min){
                //         if(settings.clampRange){
                //             setArgs(_key, configItem._min)
                //         }else{
                //             let msg = `Value ${_value} is less than config.min: ${configItem._min}`
                //             throw new RangeError(msg)
                //         }
                //     }
                //     // check if config has max and value is greater than max
                //     else if(configItem._max && _value > configItem._max){
                //         if(settings.clampRange){
                //             setArgs(_key, configItem._max)
                //         }else{
                //             let msg = `Value ${_value} is greater than config.max: ${configItem._max}`
                //             throw new RangeError(msg)
                //         }
                //     }
                // }

                // //& handle config options array                                                     
                // if(configItem._options){
                //     if(!Array.isArray(configItem._options)){
                //         throw new Error(`CONSYS | Config options must be an array of values`)
                //     }
                //     log_parser(`Testing ${_value} in provided options:`, configItem._options)
                //     if(!configItem._options.includes(_value)){
                //         if(settings.clampOptions){
                //             setArgs(_key, configItem._options[0])
                //         }else{
                //             throw new Error(`CONSYS | Value "${_value}" does not exist in options: [ ${configItem._options.join(' | ')} ]`)
                //         }
                //     }

                    
                // }
