import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { freelanceService } from 'app/modules/admin/apps/freelance/freelance.service';
import { Tag, Task } from 'app/modules/admin/apps/freelance/freelance.types';

@Injectable({
    providedIn: 'root'
})
export class freelanceTagsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _freelanceService: freelanceService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    
}

@Injectable({
    providedIn: 'root'
})
export class freelanceResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _freelanceService: freelanceService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Task[]>
    {
        return this._freelanceService.getfreelance();
    }
}

@Injectable({
    providedIn: 'root'
})
export class freelanceTaskResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _router: Router,
        private _freelanceService: freelanceService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    /* resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
        return this._freelanceService.getTaskById(route.paramMap.get('id'))
                   .pipe(
                       // Error here means the requested task is not available
                       catchError((error) => {
                            console.log(state.url);
                           // Log the error
                           console.error(error); */

                           // Get the parent url
                       /*     const parentUrl = state.url.split('/').slice(0, -1).join('/');
                           console.log(parentUrl); */
  
                           // Navigate to there
              /*              this._router.navigateByUrl(state.url);

                           // Throw an error
                           return throwError(error);
                       })
                    );
    } */
}
