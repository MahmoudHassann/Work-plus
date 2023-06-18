import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class FinanceService
{

    BaseURL: string = 'https://workplusnode.onrender.com/';
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for data
     */
    get data$(): Observable<any>
    {
        return this._data.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get data
     */
    getData(): Observable<any>
    {
        return this._httpClient.get('api/dashboards/finance').pipe(
            tap((response: any) => {
                this._data.next(response);
            })
        );
    }

    getTransactions():Observable<any>
    {
        return this._httpClient.get(`${this.BaseURL}finance`)
    }
    updateWallet(id:any,amount:any):Observable<any>
    {
        console.log(id,"ss",amount);
        let Data = {
            id:id,
            amount:amount
        }
        return this._httpClient.put(`${this.BaseURL}updateWallet`,Data)
    }
    updateTrans(id:any,sysEarn:any):Observable<any>
    {
        console.log(id);
        
        let data = {
            id:id,
            sysEarn:sysEarn
        }
        return this._httpClient.patch(`${this.BaseURL}updateTrans`,data)
    }
}
