import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, tap } from 'rxjs/operators';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styles: [],
})
export class AppComponent {

    constructor(private router: Router) {
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            tap(event => console.log(event.constructor.name)),
        ).subscribe();
    }

}
