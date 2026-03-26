import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { BooleanInput } from '@angular/cdk/coercion';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import { CampusService } from 'app/modules/service/campus.service'

@Component({
    selector       : 'user',
    templateUrl    : './user.component.html',
    // encapsulation  : ViewEncapsulation.None,
    // changeDetection: ChangeDetectionStrategy.OnPush,
    // exportAs       : 'user'
})
export class UserComponent implements OnInit, OnDestroy
{
    /* eslint-disable @typescript-eslint/naming-convention */
    static ngAcceptInputType_showAvatar: BooleanInput;
    /* eslint-enable @typescript-eslint/naming-convention */

    @Input() showAvatar: boolean = true;
    user: User;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    userData: any;
    showAvatar1 : boolean = false;
    page: number = 1;
    pageSize: number = 10;
    columnIndex: number = 1;
    startNum: number = 1;
    sortValue: string = "asc";
    search: string = "";
    userStatusListData: any;
    UserId: any;
    userstatus: any;
    Image: any;
    retriveUserData: any;
    userStatusId: any;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private campusService : CampusService,
        private _userService: UserService
    )
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
        // Subscribe to user changes
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;

                // Mark for check
                // this._changeDetectorRef.markForCheck();
            });

            this.userData = JSON.parse(localStorage.getItem("currentUser"));
            this.UserId = this.userData.userId
            this.userStatusList();
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

    profile(){
        this._router.navigate(['/pages/profile']);
    }

    settings(){
        this._router.navigate(['/pages/settings']);
    }
    /**
     * Update the user status
     *
     * @param status
     */
    userStatusList(){
        this.campusService.userStatusList(this.page,this.pageSize,this.startNum,this.columnIndex,this.sortValue,this.search).subscribe((res) =>{
          this.userStatusListData = res.data
          this.getUserDetailsById()
        })
    }

    getUserDetailsById(){
        this.campusService.getUserDetailsById(this.UserId).subscribe((res) =>{
            this.retriveUserData = res.response_data
            this.Image = this.retriveUserData.image

            let userstatus
            this.userStatusListData.forEach((status) => {
            if (status.id == res.response_data?.user_status) {
                userstatus = status.id;
                this.userstatus = status.name
                this.updateUserStatus(this.userstatus)
            }
            this.showAvatar1 = true
        })
        })
    }

    updateUserStatus(status: string): void
    {
        // Return if user is not available
        if ( !this.user )
        {
            return;
        }

        // Update the user
        this._userService.update({
            ...this.user,
            status
        }).subscribe();


            this.userStatusListData.forEach((statuss) => {
            if (statuss.name == status) {
                this.userStatusId = statuss.id
            }
        })
        // this.updateStatus();
    }

    updateStatus(){
        let FirstName = this.retriveUserData.f_name
        let LastName = this.retriveUserData.l_name
        let PhoneNumber = this.retriveUserData.phone
        let Email = this.retriveUserData.email
        let UserType = this.retriveUserData.user_type
        let UserStatus = this.userStatusId
        let ImageName = this.retriveUserData.image

        this.campusService.updateUserDetails(this.retriveUserData?.id,
            FirstName,LastName,
            PhoneNumber,Email,
            UserType,UserStatus,
            ImageName).subscribe((res) =>{

            })
    }
    /**
     * Sign out
     */
    signOut(): void
    {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('selectedExams');
        this._router.navigate(['/sign-out']);
    }
}
