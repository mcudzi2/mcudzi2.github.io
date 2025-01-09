export function prependSlash(str) {
    if (typeof str !== 'string') {
        throw new Error("Argument must be of type 'string'.");
    }
    return str.charAt(0) === '/'
        ? str
        : ('/' + str);
}

export function appendSlash(str) {
    if (typeof str !== 'string') {
        throw new Error("Argument must be of type 'string'.");
    }
    return str.charAt(str.length - 1) === '/'
        ? str
        : (str + '/');
}

export function removeLeadingSlashes(str) {
    if (typeof str !== 'string') {
        throw new Error("Argument must be of type 'string'.");
    }
    return str.replace(/^\/+/g, '', str);
}

export function removeTrailingSlashes(str) {
    if (typeof str !== 'string') {
        throw new Error("Argument must be of type 'string'.");
    }
    return str.replace(/\/+$/g, '', str);
}