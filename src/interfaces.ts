export interface I_consetConfigOptions {
    allowCustom?: boolean;
    clampRange?: boolean;
    clampFloats?: boolean;
    clampOptions?: boolean;
    trimStrings?: boolean;
    directiveDeclaration?: string;
    allowNull?: boolean;
    allowUndefined?: boolean;
    allowEmpty?: boolean;
}

export interface I_consetConfigItem {
    _type?: string;
    _default?: any;
    _min?: number;
    _max?: number;
    _msg?: string;
    _env?: string;
    _required?: boolean;
    _allowNull?: boolean;
    _allowUndefined?: boolean;
    _allowEmpty?: boolean;
    _options?: any[];
}

export interface I_consetConfigItems { [key: string]: I_consetConfigItem };