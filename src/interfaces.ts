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

export type T_ConsysConfig = { [key: string]: T_ConsysConfigItem };

export type T_ConsysReturn = { [key: string]: unknown }

export type T_ConsysCallback = (args:T_ConsysReturn) => any;

export type T_Consys = <T>(
    callback: T_ConsysCallback, 
    config:   T_ConsysConfig, 
    options:  T_ConsysOptions
) => void;
