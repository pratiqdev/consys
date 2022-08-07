export interface I_consetConfigOptions {
    allowCustom?: boolean;
    clampRange?: boolean;
}

export interface I_consetConfigItem {
    type?: string;
    default?: any;
    min?: number;
    max?: number;
    msg?: string;
    env?: string;
    required?: boolean;
    allowNull?: boolean;
    allowUndefined?: boolean;
}

export interface I_consetConfigItems { [key: string]: I_consetConfigItem };