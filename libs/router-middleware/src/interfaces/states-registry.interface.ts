export interface StatesRegistry<T = any> {
    getByPath<V = T>(path: string): V;
}
