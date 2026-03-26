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
  selector: 'app-hostel',
  templateUrl: './hostel.component.html',
  styleUrls: ['./hostel.component.scss']
})
export class HostelComponent implements OnInit {

  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
   status: Status[] = [
     {id: '1', name: 'Active'},
     {id: '0', name: 'Inactive'},
   ];
   @ViewChild(MatPaginator) paginatior: MatPaginator;
   @ViewChild(MatSort) sort: MatSort;
   displayedColumns: string[] = ['Sr.No','title','image','college','status','actions'];
   hostelListData: any[];
   dataSource : any;
   hostelList : FormGroup
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
   link: string;
 
 
   constructor(
     private _formBuilder: FormBuilder,
     private campusService : CampusService,
     public _route: Router,
     public dialog: MatDialog,
     ){ }
 
     ngOnInit() {
       this.hostelList = this._formBuilder.group({
         search: [''],
      });
      this.listLoader = true
      this.getHostelList();
     }
 
    //  convertDate(inputFormat) {
    //    function pad(s) { return (s < 10) ? '0' + s : s; }
 
    //    var monthNames = [
    //      "January", "February", "March", "April", "May", "June",
    //      "July", "August", "September", "October", "November", "December"
    //    ];
 
    //    var d = new Date(inputFormat);
    //    var day = pad(d.getDate());
    //    var month = monthNames[d.getMonth()];
    //    var year = d.getFullYear();
 
    //    var hours = pad(d.getHours());
    //    var minutes = pad(d.getMinutes());
    //    var seconds = pad(d.getSeconds());
    //    return [day, month, year].join(' ') + ' ' + [hours, minutes, seconds].join(':');
    //  }
 
     onPageChange(event: PageEvent): void {
       this.page = event.pageIndex + 1;
       this.pageSize = event.pageSize;
       this.startNum = (this.pageSize * (event.pageIndex))
       this.getHostelList();
     }
 
     addNewHostel(){
       this._route.navigate(['apps/college/addhostel']);
     }
 
     applyFilter(filterValue: string) {
       this.searchLoader = true
      //  this.getHostelList();
     setTimeout(() => { this.searchLoader = false; }, 500);

       this.dataSource.filter = filterValue.trim().toLowerCase();
       console.log(this.dataSource.filter)
     }
 
     onSortChange(event: MatSort) {
       this.sortValue = event.direction
       // this.columnIndex = this.displayedColumns.indexOf(event.active);
       this.getHostelList();
     }
 
     getHostelList(){
       this.campusService.getHostelList(this.page,this.pageSize,this.startNum,this.columnIndex,this.sortValue,this.hostelList.value.search).subscribe((res) =>{
         this.hostelListData = res.data;
         this.recordsTotal = res.recordsTotal
         this.recordsFiltered = res.recordsFiltered
       if(this.hostelListData?.length != 0){
           this.dataSource = new MatTableDataSource<any>(this.hostelListData);
           // this.dataSource.paginator = this.paginatior;
           this.dataSource.sort = this.sort;
          this.listLoader = false;
       }else{
         this.listLoader = false;
       }
       });
     }
 
 
     editHostelDetails(hostelId) {
 
       
         let hostel_Id = hostelId;
         const url = '/apps/college/addhostel/update/' + hostel_Id;
         window.open(url, '_blank');
     }
 
     viewHostelDetails(hostelId){
       let hostel_Id = hostelId;
  
         this.link ="http://localhost:4200/hosteldetails/"+ hostelId
          const newWindow = window.open(this.link, "_blank");
      
     }
//  "https://ohcampus.com/hosteldetails/"+ hostelId
     deleteHostelDetails(HostelId){
       let hostelId = HostelId
         Swal.fire({
           title: 'Are you sure?',
           text: 'You want to delete Hostel details',
           icon: 'warning',
           showCancelButton: true,
           confirmButtonText: 'Yes',
           cancelButtonText: 'Cancel'
         }).then((result) => {
           if (result.isConfirmed) {

            let currentUser = JSON.parse(localStorage.getItem('currentUser'));
            let userId = currentUser.userId;
            let userType = currentUser.type;

            // alert(hostelId+"   "+userId+"  "+userType)
             this.campusService.deleteHostel(hostelId).subscribe((res) =>{
               if(res.response_message == "Success"){
                 this.getHostelList()
                 Swal.fire(
                   'Deleted!',
                   'Your Hostel details has been deleted.',
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
