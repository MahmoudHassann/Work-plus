import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { Tag, Task } from 'app/modules/admin/apps/freelance/freelance.types';

@Injectable({
    providedIn: 'root'
})
export class freelanceService
{
    BaseURL: string = 'https://workplusnode.onrender.com/';
    // Private
    private _tags: BehaviorSubject<Tag[] | null> = new BehaviorSubject(null);
    private _task: BehaviorSubject<Task | null> = new BehaviorSubject(null);
    public _freelance: BehaviorSubject<Task | null> = new BehaviorSubject(null);
  /*   public _freelance: BehaviorSubject<any[] | null> = new BehaviorSubject(null); */

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
     * Get freelance
     */
    getfreelance(): Observable<any>
    {
        return this._httpClient.get(`${this.BaseURL}freelanceProjects`)
        
    }

    getCategories()
    {
        return this._httpClient.get(`${this.BaseURL}getCategories`)
    }
    getsubCategories()
    {
        return this._httpClient.get(`${this.BaseURL}getsubCategories`)
    }

  

   

    /**
     * Get task by id
     */
    

    
    /**
     * Update task
     *
     * @param id
     * @param task
     */
    updateTask(id: string, value: boolean): Observable<any>
    {
        let data = {
            id:id,
            value:value
        }
        return this._httpClient.put(`${this.BaseURL}updateProjects`,data)
    }

    
}
