import * as Emptys from './Emptys';
import {RuntimeException} from "./Exceptions";
import {Predicate, Predicate2} from "./Functions";
import * as Types from "./Types";

export function checkNonNull(obj: any, message?: string | String | Function): any {
    if (Emptys.isNull(obj)) {
        if (message == null) {
            message = "is null";
        }
        throw new RuntimeException(message);
    }
    return obj;
}

export function checkNull(obj: any, message?: string | String | Function) {
    if (Emptys.isNotNull(obj)) {
        if (message == null) {
            message = "is not null";
        }
        throw new RuntimeException(message);
    }
    return obj;
}

export function checkTrue(expression: boolean | Boolean | Predicate<any> | Predicate2<any, any>, message?: string | String | Function): boolean {
    if (expression instanceof Function) {
        expression = (<Function>expression)();
    }

    if (!expression) {
        if (message == null) {
            message = "is not true expression";
        }
        throw new RuntimeException(message);
    }
    return true;
}

export function checkIndex(expression: boolean | Boolean | Predicate<any> | Predicate2<any, any>, message?: string | String | Function): boolean {
    if (expression instanceof Function) {
        expression = (<Function>expression)();
    }

    if (!expression) {
        if (message == null) {
            message = "Index outbound";
        }
        throw new RuntimeException(message);
    }
    return true;
}

export function test(predicate: Predicate<any> | Predicate2<any, any>, args: any): boolean {
    if (Types.isArray(args)) {
        const argsLength = Emptys.getLength(args);
        if (argsLength == 2) {
            return (<Predicate2<any, any>>predicate).test(args[0], args[1]);
        } else {
            return (<Predicate<any>>predicate).test(args[0]);
        }
    }
    return (<Predicate<any>>predicate).test(args);
}