export interface CrudOperatorOptions {
    /** Await until loaded (default: `false`) */
    await?: boolean;
    /**
     * During server side rendering, you probably want to wait for your resource to load
     * before resolving, regardless of the browser behaviour specified by `await`.
     */
    awaitPlatformServer?: boolean;
}
