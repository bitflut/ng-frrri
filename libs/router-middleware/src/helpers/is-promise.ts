export function isPromise<T = any>(source: any): source is Promise<T> {
    return source && source.then && 'then' in source && typeof source.then === 'function';
}
