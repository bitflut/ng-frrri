import { InjectionToken } from '@angular/core';
import { Middleware } from './interfaces/middleware.interface';
import { StatesRegistry } from './interfaces/states-registry.interface';

export const FRRRI_OPERATIONS = 'FRRRI_OPERATIONS';
export const FRRRI_MIDDLEWARE = new InjectionToken<Middleware[]>('FRRRI_MIDDLEWARE');
export const FRRRI_STATES_REGISTRY = new InjectionToken<StatesRegistry>('FRRRI_STATES_REGISTRY');
