import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Platform } from '@ng-frrri/router-middleware/internal';
import { PlatformFactory } from '../factories/platform.factory';

@Injectable()
export class ResolverPlatform<T = any> extends PlatformFactory(Platform.Resolver) implements Resolve<T[]> {
}
