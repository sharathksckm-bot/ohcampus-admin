import { ChangeDetectionStrategy, Component, AfterViewInit, OnDestroy, OnInit, ViewChild, ViewEncapsulation, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { CampusService } from 'app/modules/service/campus.service'
import Swal from 'sweetalert2';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

interface Status {
    id: string;
    name: string;
  }
@Component({
  selector: 'app-view-notification',
  templateUrl: './view-notification.component.html',
  styleUrls: ['./view-notification.component.scss']
})
export class ViewNotificationComponent implements OnInit {

  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
    //  status: Status[] = [
    //    {id: '1', name: 'Active'},
    //    {id: '0', name: 'Inactive'},
    //  ];
     @ViewChild(MatPaginator) paginatior: MatPaginator;
     @ViewChild(MatSort) sort: MatSort;
     displayedColumns: string[] = ['Sr.No','users','title','message','actions'];
    //  displayedColumns: string[] = ['Sr.No','users','title','message','created_by_name','create_date','updated_by_name','updated_date','actions'];

     notificationListData: any[];
     dataSource : any;
     certicationList : FormGroup
     listLoader:boolean = false;
     page: number = 1;
     pageSize: number = 10;
     startNum:  number = 0;
     sortValue: string = "desc";
     recordsTotal: any;
     count: number = 1;
     recordsFiltered: any;
     columnIndex: number = 1;
     image: any;
     searchLoader : boolean = false;
 
 
     constructor(
       private _formBuilder: FormBuilder,
       private campusService : CampusService,
       public _route: Router,
       public dialog: MatDialog,
       ){ }
 
       ngOnInit() {
         this.certicationList = this._formBuilder.group({
           search: [''],
        });
        this.listLoader = true
        this.getNotificationList();
       }
 
       convertDate(inputFormat) {
         function pad(s) { return (s < 10) ? '0' + s : s; }
 
         var monthNames = [
           "January", "February", "March", "April", "May", "June",
           "July", "August", "September", "October", "November", "December"
         ];
 
         var d = new Date(inputFormat);
         var day = pad(d.getDate());
         var month = monthNames[d.getMonth()];
         var year = d.getFullYear();
 
         var hours = pad(d.getHours());
         var minutes = pad(d.getMinutes());
         var seconds = pad(d.getSeconds());
         return [day, month, year].join(' ') + ' ' + [hours, minutes, seconds].join(':');
       }
 
       onPageChange(event: PageEvent): void {
         this.page = event.pageIndex + 1;
         this.pageSize = event.pageSize;
         this.startNum = (this.pageSize * (event.pageIndex))
         this.getNotificationList();
       }
 
       addNewNotification(){
         this._route.navigate(['apps/notification/addNotification']);
       }

       bulkNotification(){
         this._route.navigate(["apps/notification/bulkNotification"]);
       }
 
       applyFilter(filterValue: string) {
         this.searchLoader = true
         this.getNotificationList();
       setTimeout(() => { this.searchLoader = false; }, 500);
         // this.dataSource.filter = filterValue.trim().toLowerCase();
       }
 
       onSortChange(event: MatSort) {
         this.sortValue = event.direction
         // this.columnIndex = this.displayedColumns.indexOf(event.active);
         this.getNotificationList();
       }
 
       getNotificationList(){
        // alert(123)
         this.campusService.getNotificationList(this.page,this.pageSize,this.startNum,this.columnIndex,this.sortValue,this.certicationList.value.search).subscribe((res) =>{

          if(res.response_code == "200"){
           this.notificationListData = res.data;
          //  console.log(this.notificationListData)
           this.recordsTotal = res.recordsTotal;
          //  console.log(this.recordsTotal)
           this.recordsFiltered = res.recordsFiltered
         if(this.notificationListData?.length != 0){
             this.dataSource = new MatTableDataSource<any>(this.notificationListData);
            //  this.dataSource.paginator = this.paginatior;
            //  this.dataSource.sort = this.sort;
            //  console.log(this.dataSource)

            this.listLoader = false;
         }else{
           this.listLoader = false;
         }

        }else{
          console.error(res.response_message);
        }
         });
         
       }
 
       editnotificationDetails(certiId) {
        // alert(certiId)
         let id = certiId;
         //this._route.navigate(['apps/blog/addblog/update/'+ id]);
         this._route.navigate(['apps/notification/updateNotification/'+ id]);
 
       }
 
       viewBlogDetails(BlogId){
         console.log()
       }
 
       deleteNotification(notification_Id){
        // alert(CertiId)
           Swal.fire({
             title: 'Are you sure?',
             text: 'You want to delete notification details',
             icon: 'warning',
             showCancelButton: true,
             confirmButtonText: 'Yes',
             cancelButtonText: 'Cancel'
           }).then((result) => {
             if (result.isConfirmed) {
               this.campusService.deleteNotification(notification_Id).subscribe((res) =>{
                 if(res.response_message == "Success"){
                   this.getNotificationList()
                   Swal.fire(
                     'Deleted!',
                     'Your notification details has been deleted.',
                     'success'
                   );
                 }
                 else if(res.response_code=="300"){
                   Swal.fire({ icon: 'warning',text : res.response_message
               }
                     );
               }
 
               });
 
             } else {
             }
 
         })
       }
 
       openImgDialog(img) {
         const dialogRef = this.dialog.open(this.callAPIDialog);
         dialogRef.afterClosed().subscribe((result) => { });
         this.image = img;
       }
       close() {
         this.dialog.closeAll();
       }
 

}
