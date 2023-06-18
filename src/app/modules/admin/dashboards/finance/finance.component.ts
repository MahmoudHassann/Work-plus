import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApexOptions } from 'ng-apexcharts';
import { FinanceService } from 'app/modules/admin/dashboards/finance/finance.service';
import { UserService } from 'app/core/user/user.service';
import { AuthService } from 'app/auth.service';


@Component({
    selector       : 'finance',
    templateUrl    : './finance.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinanceComponent implements OnInit, AfterViewInit, OnDestroy
{
    @ViewChild('recentTransactionsTable', {read: MatSort}) recentTransactionsTableMatSort: MatSort;

    totaluserEarn=0
    ourtotalEarn=0
    pendingCounter=0
    completeCounter=0
    wallet:any
    data: any;
    accountBalanceOptions: ApexOptions;
    recentTransactionsDataSource: MatTableDataSource<any> = new MatTableDataSource();
    recentTransactionsTableColumns: string[] = ['transactionId', 'date', 'name', 'amount', 'status'];
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(private _financeService: FinanceService,private _changeDetectorRef: ChangeDetectorRef,private _userService:UserService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {

        this.getTransactions()
        // Get the data
        this._financeService.data$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {

                // Store the data
                this.data = data;

                // Store the table data
                this.recentTransactionsDataSource.data = data.recentTransactions;

                // Prepare the chart data
                this._prepareChartData();
            });
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void
    {
        // Make the data source sortable
        this.recentTransactionsDataSource.sort = this.recentTransactionsTableMatSort;
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Prepare the chart data from the data
     *
     * @private
     */
    private _prepareChartData(): void
    {
        // Account balance
        this.accountBalanceOptions = {
            chart  : {
                animations: {
                    speed           : 400,
                    animateGradually: {
                        enabled: false
                    }
                },
                fontFamily: 'inherit',
                foreColor : 'inherit',
                width     : '100%',
                height    : '100%',
                type      : 'area',
                sparkline : {
                    enabled: true
                }
            },
            colors : ['#A3BFFA', '#667EEA'],
            fill   : {
                colors : ['#CED9FB', '#AECDFD'],
                opacity: 0.5,
                type   : 'solid'
            },
            series : this.data.accountBalance.series,
            stroke : {
                curve: 'straight',
                width: 2
            },
            tooltip: {
                followCursor: true,
                theme       : 'dark',
                x           : {
                    format: 'MMM dd, yyyy'
                },
                y           : {
                    formatter: (value): string => value + '%'
                }
            },
            xaxis  : {
                type: 'datetime'
            }
        };
    }

    getTransactions()
    {
        this._financeService.getTransactions().subscribe(({
            next:(res)=>{
                console.log(res.wallet);
                this.ourtotalEarn = res.totalsysEarn
                this.totaluserEarn = res.totaluserEarn
                this.wallet = res.wallet
                for(let i = 0 ;i<this.wallet.length;i++)
                {
                    if(this.wallet[i].data.type == 'project_finished')
                    {
                        this.completeCounter += 1
                        
                        
                    }
                    else{
                        this.pendingCounter += 1
                    }
                }
                
                
                this._changeDetectorRef.detectChanges()
            }
        }))
    }

    update(id:any,type:any,userId:any,user_earn:any,sys_earn:any){
        if(type == 'withdraw_action')
        {
            let earnings:Number
            
           let data = {
                id:userId
            }
            this._userService.getUser(data).subscribe(({
                next:(res)=>{
                    console.log(res.data.wallet);
                    earnings = Number(user_earn) + res.data.wallet
                    this._changeDetectorRef.detectChanges()
                    this._financeService.updateWallet(userId,earnings).subscribe(({
                        next:(res)=>{
                            console.log(res);
                            this._changeDetectorRef.detectChanges()
                            this._financeService.updateTrans(id,sys_earn).subscribe(({
                                next:(res)=>{
                                    console.log(res);
                                    this.completeCounter = 0
                                    this.pendingCounter = 0
                                    this.getTransactions()
                                    this._changeDetectorRef.detectChanges()
                                    
                                }
                            }))
                        }
                    }))
                    
                }
            }))

        
        
            
        }
        else{

        }
        
        
    }
}
