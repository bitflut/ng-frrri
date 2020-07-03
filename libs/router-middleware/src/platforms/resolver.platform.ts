import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Platform } from '@ng-frrri/router-middleware/internal';
import { PlatformAbstract } from '../abstracts/platform.abstract';

@Injectable()
export class ResolverPlatform<T = any> extends PlatformAbstract implements Resolve<T[]> {
    platform = Platform.Resolver;
}
