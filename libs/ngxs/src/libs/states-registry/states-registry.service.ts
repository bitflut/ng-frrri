import { Injectable, Injector } from '@angular/core';
import { StatesRegistry } from '@ng-frrri/router-middleware';
import { NGXS_STATE_FACTORY, StateClass } from '@ngxs/store/internals';
import { StateFactory } from '@ngxs/store/src/internal/state-factory';

@Injectable({
    providedIn: 'root',
})
export class StatesRegistryService<State = StateClass> implements StatesRegistry<State> {

    constructor(
        protected injector: Injector,
    ) { }

    getByPath<T = State>(path: string): T {
        try {
            const stateFactory = this.injector.get<StateFactory>(NGXS_STATE_FACTORY);
            const state = stateFactory.states
                .filter(_state => _state.path === path)
                .map(_state => _state.instance)[0];
            return state;
        } catch (e) {
            throw new Error(`StatesRegistryService could not get \`${path}\``);
        }
    }

}
