import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from './core/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  BaseURL:string = 'https://workplusnode.onrender.com/'

  private _authenticated: boolean = false;
  constructor(private _http:HttpClient, private _userService:UserService) { }

  signin(Data:object):Observable<any>{
    // Throw error, if the user is already logged in
    if ( this._authenticated )
    {
        return throwError('User is already logged in.');
    }

    return this._http.post(`${this.BaseURL}signin`, Data).pipe(
        switchMap((response: any) => {

            // Store the access token in the local storage
            localStorage.setItem('Token',response.token.accessToken)
            

            // Set the authenticated flag to true
            this._authenticated = true;

            // Store the user on the user service
            this._userService.user = response.user;

            

            // Return a new observable with the response
            return of(response);
        })
    );
  }


}
