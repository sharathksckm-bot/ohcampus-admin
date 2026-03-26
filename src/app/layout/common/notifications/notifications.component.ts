import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { MatButton } from '@angular/material/button';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Notification } from 'app/layout/common/notifications/notifications.types';
import { NotificationsService } from 'app/layout/common/notifications/notifications.service';
import { CampusService } from 'app/modules/service/campus.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from 'app/modules/service/data.service';

@Component({
    selector       : 'notifications',
    templateUrl    : './notifications.component.html',
})
export class NotificationsComponent implements OnInit , AfterViewInit
{
    @ViewChild('notificationsOrigin') private _notificationsOrigin: MatButton;
    @ViewChild('notificationsPanel') private _notificationsPanel: TemplateRef<any>;

    private _overlayRef: OverlayRef;
    ApplicationNotificationCount: number = 0;
    CourseEnquiryNotificationCount: number = 0;
    EnqnotificationCount: number = 0;
    notificationCount: number = 0;
    UsersCount: number = 0;
    notificationData: any[]=[]
    currentUser: any;
    type: any;
    path: string;
    data: any;

    constructor(
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
        public _route: Router,
        public _activatedroute: ActivatedRoute,
        private campusService : CampusService,
        private dataService: DataService
    )
    {
    }

    ngOnInit(): void
    {

        this.dataService.data$.subscribe(data => {
            this.data = data;
            //alert(this.data)
        });

        this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
        this.type = this.currentUser.type;
        this.getNotificationCount()

    }

    ngAfterViewInit(): void {
    }


    
    // openPanel()
    // {

    //     if ( !this._notificationsPanel || !this._notificationsOrigin )
    //     {
    //         return;
    //     }

    //     if ( !this._overlayRef )
    //     {
    //         this._createOverlay();
    //     }

    //     this._overlayRef.attach(new TemplatePortal(this._notificationsPanel, this._viewContainerRef));

    // }



    openPanel() {
        // Create OverlayRef if not already created
        if (!this._overlayRef) {
          this._overlayRef = this._overlay.create();
        }
    
        // Check if a portal is already attached and detach it before attaching a new one
        if (this._overlayRef.hasAttached()) {
          this._overlayRef.detach();
        }
    
        // Attach the template portal
        this._overlayRef.attach(new TemplatePortal(this._notificationsPanel, this._viewContainerRef));
      }
    
      close() {
        if (this._overlayRef && this._overlayRef.hasAttached()) {
          this._overlayRef.detach();
        }
      }
    
      ngOnDestroy() {
        if (this._overlayRef) {
          this._overlayRef.dispose();
        }
      }

    
    markAllAsRead(): void
    {
        if(this.notificationCount != 0){
            this.notificationData.forEach((item) => {
                let logid = item.log_id
                let type = item.type
                this.notificationCount = 0
                this.campusService.updateLogStatus(logid,type).subscribe((res) =>{
                })
            })
            this.getNotificationCount()
            this._overlayRef.detach();
        }
    }

    // close(){
    //     this._overlayRef.detach();
    // }

    private _createOverlay(): void
    {
        this._overlayRef = this._overlay.create({
            hasBackdrop     : true,
            backdropClass   : 'fuse-backdrop-on-mobile',
            scrollStrategy  : this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay.position()
                                  .flexibleConnectedTo(this._notificationsOrigin._elementRef.nativeElement)
                                  .withLockedPosition(true)
                                  .withPush(true)
                                  .withPositions([
                                      {
                                          originX : 'start',
                                          originY : 'bottom',
                                          overlayX: 'start',
                                          overlayY: 'top'
                                      },
                                      {
                                          originX : 'start',
                                          originY : 'top',
                                          overlayX: 'start',
                                          overlayY: 'bottom'
                                      },
                                      {
                                          originX : 'end',
                                          originY : 'bottom',
                                          overlayX: 'end',
                                          overlayY: 'top'
                                      },
                                      {
                                          originX : 'end',
                                          originY : 'top',
                                          overlayX: 'end',
                                          overlayY: 'bottom'
                                      }
                                  ])
        });

        // Detach the overlay from the portal on backdrop click
        this._overlayRef.backdropClick().subscribe(() => {
            this._overlayRef.detach();
        });
    }

    getNotificationCount(){
        this.campusService.notificationCount1().subscribe((res) =>{
            this.notificationData = res.response_data

            this.notificationData.forEach((item) => {
                this.notificationCount = this.notificationCount + Number(item.count)
            })

            if(this.notificationCount != 0){
                if( this.type == 'Admin'){
                    if(this.data === '1'){
                    this.openPanel();
                    }
            }else{
                this.notificationCount = 0
            }
            }
        })

    }

    viewNoti(data){
console.log(data)
        let name  = data.name
        let logid = data.log_id
        let type = data.type

         this.campusService.updateLogStatus(logid,type).subscribe((res) =>{
            if(name == 'Enquiries'){
                this._route.navigate(['apps/enquiry/enquirylist']);
            }
            if(name == 'Applications'){
                this._route.navigate(['apps/application/applicationlist']);
            }
            if(name == 'Course Enquires'){
                this._route.navigate(['apps/courseenquiry/courseenquirylist']);
            }
            if(name == 'Predicted Admissions'){
                this._route.navigate(['apps/predict/predictlist']);
            }
            if(name == 'Question'){
                 this._route.navigate(['apps/questionsandans/questionandanslist']);
            }
            if(name == 'Review'){
                this._route.navigate(['apps/college/reviewlist']);
            }
            this.getNotificationCount()
            this.notificationCount = 0
            this.notificationCount = this.notificationCount - Number(data.count)

         })

    }
}
