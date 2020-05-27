---
description: >-
  Read through this chapter in order to understand our way of thinking and
  coming up with @ng-frrri/router-middleware.
---

# Concept

## 1. States registry

### Synopsis

{% hint style="info" %}
Every application state is a deeply nested object. Therefore it should be possible to access a state's facade by providing a path to its state from root.
{% endhint %}

If we find a way to expose facades via paths, we can make any interaction highly customisable. Because dependency injection is now delegated to the **StatesRegistry**, we can easily use facades anywhere in our app.

{% tabs %}
{% tab title="app.ts" %}
```typescript
import { StatesRegistryService } from './states-registry.service';

const statesRegistry = new StatesRegistryService();
const notesFacade = statesRegistry.getByPath<'notes'>('entities.notes');
const usersFacade = statesRegistry.getByPath<'users'>('entities.users');

console.log(notesFacade.getOne(1));
// outputs: { id: 1, title: "Note #1", userId: 1 }

console.log(usersFacade.getOne(1));
// outputs: { id: 1, name: "Josef" }
```
{% endtab %}

{% tab title="app.state.ts" %}
```typescript
const applicationState = {
    entities: {
        notes: {
            entities: {
                1: {
                    id: 1,
                    title: 'Note #1',
                    userId: 1,
                },
                3: {
                    id: 3,
                    title: 'Note #3',
                    userId: 2,
                },
            },
            ids: [1, 3],
        },
        users: {
            entities: {
                1: {
                    id: 1,
                    name: 'Josef',
                },
                2: {
                    id: 2,
                    name: 'Sarah',
                },
            },
            ids: [1, 2],
        },
    },
};

const statesRegistry = new StatesRegistryService();
const notesFacade = statesRegistry.getByPath<'notes'>('entities.notes');
console.log(notesFacade.getOne(1));
```
{% endtab %}

{% tab title="dynamic-facade.ts" %}
```typescript
import { applicationState } from './app.state';

interface Facade<T> {
    getOne(id: number): T;
    getMany(): T[];
}

export class DynamicFacade<T = any> implements Facade<T> {
    constructor(public readonly path: string) { }

    private getState() {
        return this.path
            .split('.')
            .reduce((prev: any, curr) =>
                prev?.[curr] ?? prev,
                applicationState,
            );
    }
    
    getOne(id: number): T {
        const state = this.getState();
        return state.entities[id];
    }

    getMany(): T[] {
        const state = this.getState();
        return Object.values(state.entities);
    }
}
```
{% endtab %}

{% tab title="types.ts" %}
```typescript
import { applicationState } from './app.state';

export type EntityKeys = keyof typeof applicationState['entities'];
export type EntitiyIds<Entity extends EntityKeys> = keyof typeof applicationState['entities'][Entity]['entities'];
export type Entity<Entity extends EntityKeys> = typeof applicationState['entities'][Entity]['entities'][EntitiyIds<Entity>];
```
{% endtab %}

{% tab title="states-registry.service.ts" %}
```typescript
import { EntityKeys } from './types';
import { DynamicFacade } from './dynamic-facade';

class StatesRegistryService {
    getByPath<T extends EntityKeys>(path: string) {
        return new DynamicFacade<Entity<T>>(path);
    }
}
```
{% endtab %}
{% endtabs %}

### Where is the benefit?

#### 1.1. Smart-ui

One benefit: The StatesRegistry makes it possible to write general purpose smart-ui components that provide logic used by multiple entities. Imagine you were to write a smart ui component that can be consumed simply by providing a path to the entity's root state:

{% hint style="info" %}
Ready to use smart components are provided to you in **@ng-frrri/ui**
{% endhint %}

{% tabs %}
{% tab title="app.component.html" %}
For this example, we assume your facades exposes observables named **all$** and **loading$**

```markup
<h1>All Notes</h1>

<smart-ui path="entities.notes" #notes>
    <div data-loading>
        Loading posts...
    </div>
    
    <div *ngFor="let note of notes.all$ | async">
        {{ note | json }}
    </div>
</smart-ui>

<h1>All Users</h1>

<smart-ui path="entities.users" #notes>
    <div data-loading>
        Loading notes...
    </div>
    
    <div *ngFor="let user of users.all$ | async">
        {{ user | json }}
    </div>
</smart-ui>
```
{% endtab %}

{% tab title="smart-ui.component.html" %}
```markup
<ng-container *ngIf="loading$ | async">
    <ng-content select="[data-loading]"></ng-content>
</ng-container>

<ng-content></ng-content>

```
{% endtab %}
{% endtabs %}

#### 1.2. Router middleware

Mapping facades to paths and exposing them via a StatesRegistry is essential for our RouterMiddleware concept to work \(which we will explain next\). There are many use cases for the StatesRegistry in enterprise applications that you will find. But let's focus on what @ng-frrri does for you and continue with router middleware.

## 2. Router middleware

...

