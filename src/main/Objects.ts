import * as HashCodes from "./HashCodes";
import * as Emptys from "./Emptys";
import * as Types from "./Types";


interface ObjectPropertyDescriptor {
    configurable?: boolean;
    enumerable?: boolean;
    value?: any;
    writable?: boolean;

    get?(): any;

    set?(v: any): void;
}


class SimpleObjectPropertyDescriptor implements ObjectPropertyDescriptor {
    configurable: boolean = true;
    enumerable: boolean = true;
    value: any;
    writable: boolean = true;
}

/**
 * @override Object.getPrototypeOf
 * @param obj
 */
export function getPrototypeOf(obj: any): any {
    if (obj == null) {
        return null;
    }
    if (!Types.isFunction(Object["getPrototypeOf"])) {
        // custom getPrototypeOf for Object
        Object["getPrototypeOf"] = getPrototypeOf;
    } else {
        // call ES API
        return Object["getPrototypeOf"](obj);
    }
    return obj.prototype;
}


/**
 * @Override override Object.keys(obj)
 * @param obj
 */
export function keys(obj: object): Array<string> {
    if (obj == null) {
        return [];
    }
    if (!Types.isFunction(Object["keys"])) {
        Object["keys"] = keys;
    } else {
        return Object["keys"](obj);
    }

    let ks: Array<string> = [];
    for (let property in obj) {
        if (hasOwnProperty(obj, property)) {
            ks.push(property);
        }
    }
    return ks;
}

export function allEnumerableKeys(obj: object): Array<string> {
    if (obj == null) {
        return [];
    }
    let ks: Array<string> = [];
    for (let property in obj) {
        ks.push(property);
    }
    return ks;
}

/**
 * @Override override Object.getOwnPropertyDescriptor(obj:object, property:string)
 * @param obj
 * @param property
 */
export function getOwnPropertyDescriptor(obj: object, property: string | number | symbol): object | undefined | null | ObjectPropertyDescriptor {
    if (!Types.isFunction(Object["getOwnPropertyDescriptor"])) {
        Object["getOwnPropertyDescriptor"] = (function () {
            return function (o: object, prop: string | number | symbol) {
                let oPrototype = getPrototypeOf(o);
                if (hasOwnProperty(oPrototype, prop)) {
                    return new SimpleObjectPropertyDescriptor();
                } else {
                    return undefined;
                }
            }
        })();
    }
    return Object.getOwnPropertyDescriptor.call(Object, obj, property);
}

export function getPropertyDescriptor(obj: object, property: string | number | symbol): object | null | ObjectPropertyDescriptor {
    let desc = getOwnPropertyDescriptor(obj, property);
    if (desc == null) {
        desc = getPropertyDescriptor(getPrototypeOf(obj), property);
    }
    return desc;
}

export function hasProperty(obj: object, property: string | number | symbol): boolean {
    if (hasOwnProperty(obj, property)) {
        return true;
    }
    return hasProperty(getPrototypeOf(obj), property);
}

/**
 * @Override Object.prototype.hasOwnProperty(property)
 */
export function hasOwnProperty(obj: object, property: string | number | symbol): boolean {
    if (!Types.isFunction(Object.prototype["hasOwnProperty"])) {
        Object.prototype["hasOwnProperty"] = function (prop: string): boolean {
            if (this.prototype != this.prototype.prototype) {
                let v = this.prototype[prop] != null;
                return v != null && this.prototype.prototype[prop] != v;
            } else {
                return this.prototype[prop] != null;
            }
        };
    }
    return Object.prototype["hasOwnProperty"].call(obj, property);
}

/**
 * @Override Object.prototype.propertyIsEnumerable()
 * @param obj
 * @param property
 */
export function propertyIsEnumerable(obj: object, property: string | number | symbol): boolean {
    if (obj == null || property == null) {
        return false;
    }
    if (!Types.isFunction(Object.prototype["propertyIsEnumerable"])) {
        Object.prototype["propertyIsEnumerable"] = function (prop: string | number | symbol) {
            for (let key in this) {
                if (key == prop) {
                    return true;
                }
            }
            return false;
        }
    }
    return Object.prototype["propertyIsEnumerable"].call(obj, property);
}

export function hasOwnEnumerableProperty(obj: any, property: string | number | symbol): boolean {
    if (obj == null || property == null) {
        return false;
    }
    return hasOwnProperty(obj, property) && propertyIsEnumerable(obj, property);
}

/**
 * @Override Object.defineProperty(obj, prop, descriptor)
 * @param obj
 * @param property
 * @param descriptor
 */
export function defineProperty(obj: any, property: string | number | symbol, descriptor: object | ObjectPropertyDescriptor | null | undefined) {
    if (obj == null || property == null || descriptor == null) {
        return;
    }
    if (!Types.isFunction(Object["defineProperty"])) {
        Object["defineProperty"] = function (o: object, prop: string | number | symbol, desc: object | ObjectPropertyDescriptor) {
            o[prop] = desc["value"];
        }
    }
    Object.defineProperty(obj, property, descriptor);
}

export function definePrototypeProperty(obj: object, property: string | number | symbol, desc: ObjectPropertyDescriptor): void {
    defineProperty(getPrototypeOf(obj), property, desc);
}


export function isNull(obj: any): boolean {
    return Emptys.isNull(obj);
}

export function isNotNull(obj: any) {
    return Emptys.isNotNull(obj);
}

export function isEmpty(obj: any): boolean {
    return Emptys.isEmpty(obj);
}

export function isNotEmpty(obj: any) {
    return Emptys.isNotEmpty(obj);
}

export function unknownNull(): unknown {
    return <unknown>null;
}

export function hashCode(object:any):number {
    return HashCodes.hashCode(object);
}
