import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User } from 'app/core/user/user.types';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);

    /**
     * Constructor
     */
    BaseURL: string = 'https://workplusnode.onrender.com/';
    constructor(private _httpClient: HttpClient) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: User) {
        // Store the value
        this._user.next(value);
    }

    get user$(): Observable<User> {
        return this._user.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the current logged in user data
     */
    get(): Observable<User> {
        return this._httpClient.get<User>('api/common/user').pipe(
            tap((user) => {
                this._user.next(user);
            })
        );
    }

    /**
     * Update the user
     *
     * @param user
     */
    update(user: User): Observable<any> {
        return this._httpClient.patch<User>('api/common/user', { user }).pipe(
            map((response) => {
                this._user.next(response);
            })
        );
    }

    getUsers(): Observable<any> {
        return this._httpClient.get(`${this.BaseURL}users`);
    }
    getUser(id:any): Observable<any> {
        return this._httpClient.post(`${this.BaseURL}user`,id);
    }

    sendToAll(msg:any)
    {
        return this._httpClient.post(`${this.BaseURL}send`,msg)
    }

    getVerfication(id: string):Observable<any> {
        return this._httpClient.post<{
            identity: string[];
            Message: string;
        }>(`${this.BaseURL}getVerfication`, {
            id: id,
        }); 
    }

    getReviews(): Observable<any> {
        return this._httpClient.get(`${this.BaseURL}getReviews`);
    }
    updateReviews(id: any): Observable<any> {
        const data = {
            id: id,
        };

        return this._httpClient.patch(`${this.BaseURL}updateReviews`, data);
    }

    getDiscuss(): Observable<any> {
        return this._httpClient.get(`${this.BaseURL}getDiscus`);
    }
    deletetDiscuss(id: any): Observable<any> {
        return this._httpClient.delete(`${this.BaseURL}deleteDiscuss/${id}`);
    }
    getJobs(): Observable<any> {
        return this._httpClient.get(`${this.BaseURL}getJobs`);
    }
    getProjects(): Observable<any> {
        return this._httpClient.get(`${this.BaseURL}freelanceProjects`);
    }
}
