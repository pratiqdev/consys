<div style="display:flex !important; flex-direction:column !important; justify-content:center !important; align-items:center !important; text-align:center !important;">

# consys

*Function argument <u>con</u>figuration <u>sys</u>tem*

[![shield](https://img.shields.io/badge/Version-1.0.0-blue)](https://npm.js/not-yet-published)
[![shield](https://img.shields.io/badge/Tests-Failing-red)](https://github.com/pratiqdev/consys/tree/main/test)


<p style="font-size:1.4rem;">
Create a schema for function arguments that can provide defaults, import env variables, clamp ranges and options, handle simple type coercion and more. Like TypeScript but, <b>terrible!</b>
</p>

</div>




<br />

## Installation

Install the package from npm using your preffered package manager
```
yarn add @pratiq/consys
```

or include the files directly from a CDN
```html
<script src="https://unpkg.com/not-yet-published"></script>
```










<br />

## Simple Example

Import consys and wrap it around your function, or pass `function`, `config` and `options` as arguments to consys

```js
import consys from '@pratiq/consys'

const config = {
    name: 'string',
    age: {
        _type: 'number',
        _min: '0',
        _max: '150',
    }
}

const originalFn = (s) => console.log(`My name is ${s.name} and I am ${s.age} years old.`)

const myFn = consys(myFn, config)

const result = myFn({ name: 'Johnny', age: '9000' })
// result => { "name": "Johnny", "age": 150 }
```









<br />

## Advanced Example

Defined the schema of your arguments
```js
const config = {
    name: 'string',
    
    building:{
        residents: {
            residentName: 'string',
            owner: {
                _type: 'string',
                _required: true
            },
        },
        age: {
            _type: 'number',
            _min: '0',
            _max: '100',
        }
    },
}
```

Provide options for better control of your arguments
```js
const options = {
    allowCustom: false,
    allowEmpty: false,
    clampRange: true,
    throwErrors: false,
}
```

Create or import your function
```js
const myFn = (settings) => {
    console.log(settings)
}
```

Pass everything to `consys()` and it will return a function
```js
const wrappedFunction = consys(myFn, config, options)
```

This new function can handle parsing the arguments passed to it
```js
wrappedFunction({
    name: 'John',
    building: {
        // year: 9999,
        residents: {
            res_name: 'Bob',
            owner: 'ME'
        }
    }
})
```




<br />

## Environment Variables

> **Do you only need to handle environment variables?**   
> **Check out a similar package just for that: [envy](https://github.com/pratiqdev/envy)**

Easily load env variables with the `_env` config directive

```js
const config = {
    name: 'string',
    apiKey: {
        _env: 'NEXT_PUBLIC_API_KEY'
    }
}
```

Or override arguments with env variables, **IF** they exist

```js
const options = {
    envOverride: true,
}
```




<br />

## Min / Max Clamping

Numerical values can be clamped within a range using the `_min` and `_max` config directives.

```js
const config = {
    coolFactor: {
        _type: 'number',
        _min: 0,
        _max: 9000,
    }
}
```




<br />

## Strict Schemas

Prevent or allow values not defined in the schema with the `allowCustom` option.

```js
const config = { name: 'string' }
const options = { allowCustom: true }
const fn = consys((s) => s, config, options)
const result = fn({ 
    any: 'value',
    allowed: 'with',
    no: 'errors',
    name: 1234 // ERROR
})
```




<br />

## String Trimming

Strings can be trimmed to the `_max` length provided if the `trimString` option is set to true

```js
const config = {
    longStory: {
        _type: 'string',
        _max: 255,
    }
}

const options = {
    trimStrings: true
}
```






<br />

## Options Clamping

With an array of options to match, incorrect values will throw errors, or use the first item in 
the list if the `clampOptions` option is set to true

```js
const options = {
    clampOptions: true
}
```




<br />

## Null Values

Null values are allowed if the `allowNull` option is set to true

```js
const options = {
    allowNull: true
}
```




<br />

## Default Values

Default values can be loaded using the `_default` config directive. Defaults will be loaded if no value is provided as an argument and 

```js
const config = {
    coolFactor: {
        _type: 'number',
        _default: 3
    }
}
```




<br />


## TypeScript


Types and explanations of each value used for the config or config items

```ts
export type T_ConsysConfig = { [key: string]: T_ConsysConfigItem };

export type T_ConsysConfigItem = {
    /** Literal type - 'string' | 'number' | 'float' | 'array' | 'object' */
    _type?: string;
    /** A default value to use if no argument is provided */
    _default?: any;
    /** Minumum acceptable value */
    _min?: number;
    /** Max acceptable value */
    _max?: number;
    /** The key of the env variable to load */
    _env?: string;
    /** Mark this option as strictly required if true */
    _required?: boolean;
    /** Allow null values as arguments for this item only */
    _allowNull?: boolean;
    /** Allow empty strings as arguments for this item only */
    _allowEmpty?: boolean;
    /** Options to match the argument against */
    _options?: any[];
}
```


```ts
export type T_ConsysOptions = {
    /** Allow values not defined in the config */
    allowCustom?: boolean;
    /** Clamp integer values to the nearest valid value. Always clamped within safe values */
    clampRange?: boolean;
    /** Clamp float values to the nearest valid value. Always clamped within safe values*/
    clampFloats?: boolean;
    /** Choose the first value from options array if the value used is not valid */
    clampOptions?: boolean;
    /** Trim strings to the provided "_max" length if exceeded */
    trimStrings?: boolean;
    /** The character used at the start of a key to delcare a config directive.  Default: "_" => "_max" */
    directiveDeclaration?: string;
    /** Allow null values as arguments without console.warn. Default: false */
    allowNull?: boolean;
    /** Allow empty strings as arguments without console.warn. Default: false */
    allowEmpty?: boolean;
    /** Disable error messages and throwing on fatal errors. Default: false */
    throwErrors?: boolean;
    /** Override arguments if a matching env variable is found */
    envOverride?: boolean;
}
```







```ts
export type T_ConsysReturn = { [key: string]: unknown }

export type T_ConsysCallback = (args:T_ConsysReturn) => any;

export type T_Consys = <T>(
    callback: T_ConsysCallback, 
    config:   T_ConsysConfig, 
    options:  T_ConsysOptions
) => void;
```













<br />

## Why?

After writing over 9000 functions and constantly rewriting similar logic to handle parsing values,
coercing types, importing .env vars, setting defaults and the endless pursuit of *the value of undefined*, I decided to create a wrapper function that can use a schema to parse and validate the arguments provided, without adding 10x overhead (testing in-progress).






<br />

## Contributing

If you or a loved one have been diagnosed with interest in this project, please browse the issues on github and create your own. You may be entitled to a Pull Request.
