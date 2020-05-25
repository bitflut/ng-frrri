import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as parseLinkHeaderNs from 'parse-link-header';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
const parseLinkHeader = parseLinkHeaderNs;

@Injectable()
export class PaginationInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    return this.handlePaginatedResponse(event);
                }
                return event;
            }),
        );
    }

    private handlePaginatedResponse(response: HttpResponse<any>): any {
        const isArray = Array.isArray(response.body);
        if (!isArray) { return response; }

        const hasLink = response.headers.has('Link') && response.headers.get('Link');
        const nextLink = hasLink && parseLinkHeader(hasLink).next;

        const paginatedResponse = new HttpResponse({
            body: { pagination: { data: response.body, next: nextLink.url } },
            headers: response.headers,
            status: response.status,
            statusText: response.statusText,
            url: response.url,
        });

        return paginatedResponse;
    }

}
