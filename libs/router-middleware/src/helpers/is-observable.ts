import { from, isObservable, Observable, of } from 'rxjs';
import { isPromise } from './is-promise';

export function toObservable<T = any>(source: Observable<T> | Promise<T> | T) {
    return isObservable(source)
        ? source
        : isPromise(source)
            ? from(source)
            : of(source);
}
