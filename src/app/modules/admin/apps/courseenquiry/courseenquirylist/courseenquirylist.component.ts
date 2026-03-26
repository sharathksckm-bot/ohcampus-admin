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
  selector: 'app-courseenquirylist',
  templateUrl: './courseenquirylist.component.html',
  styleUrls: ['./courseenquirylist.component.scss']
})
export class CourseenquirylistComponent implements OnInit {
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  @ViewChild(MatPaginator) paginatior: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['Sr.No','name','email','phone','statename','cityname','category','coursename','interested', 'create_date','attended_by','attended_date','actions'];
  enquiryListData: any[];
  dataSource : any;
  enquiryList : FormGroup
  responseForm : FormGroup
  listLoader:boolean = false;
  page: number = 1;
  pageSize: number = 10;
  startNum:  number = 0;
  sortValue: string = "desc";
  recordsTotal: any;
  count: number = 1;
  recordsFiltered: any;
  columnIndex: number = 1;
  searchLoader : boolean = false;
  enquiryDetailsById: any;
  addLoader: boolean = false;
  status: Status[] = [
    {id: '1', name: 'Attended'},
    {id: '0', name: 'Pending'},
  ];

  constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public _route: Router,
    public dialog: MatDialog,
    ){ }

    ngOnInit() {
      this.enquiryList = this._formBuilder.group({
        search: [''],
     });

     this.responseForm = this._formBuilder.group({
      response: [''],
      name: [''],
      emailAddress: [''],
      category: [''],
      course: [''],
      intrested: [''],
   });

     this.listLoader = true
     this.getEnquiryList();
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
      this.getEnquiryList();
    }

    addNewEnquiry(){
      this._route.navigate(['apps/courseenquiry/addcourseenquiry']);
    }

    applyFilter(filterValue: string) {
      this.searchLoader = true
      this.getEnquiryList();
      setTimeout(() => { this.searchLoader = false; }, 500);
      // this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    onSortChange(event: MatSort) {
      this.sortValue = event.direction
      // this.columnIndex = this.displayedColumns.indexOf(event.active);
      this.getEnquiryList();
    }

    getEnquiryList(){
      this.campusService.getcourseInquiry(this.page,this.pageSize,this.startNum,this.columnIndex,this.sortValue,this.enquiryList.value.search).subscribe((res) =>{
        this.enquiryListData = res.data;
        this.recordsTotal = res.recordsTotal
        this.recordsFiltered = res.recordsFiltered
      if(this.enquiryListData?.length != 0){
          this.dataSource = new MatTableDataSource<any>(this.enquiryListData);
          // this.dataSource.paginator = this.paginatior;
          this.dataSource.sort = this.sort;
         this.listLoader = false;
      }else{
        this.listLoader = false;
      }
      });
    }

    editEnquiryDetails(enquiryId) {
      let enquiry_Id = enquiryId;
      this._route.navigate(['apps/courseenquiry/addcourseenquiry/update/'+ enquiry_Id]);
    }

    deleteEnquiryDetails(EnquiryId){
      let enquiryId = EnquiryId
        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to delete course enquiry details',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'Cancel'
        }).then((result) => {
          if (result.isConfirmed) {
            this.campusService.course_inquiryDelete(enquiryId).subscribe((res) =>{
              if(res.response_message == "Success"){
                this.getEnquiryList()
                Swal.fire(
                  'Deleted!',
                  'Course enquiry details has been deleted.',
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

SendCourseEnquiryResponse(){
  this.addLoader = true
  let email = this.enquiryDetailsById.email
  let name = this.enquiryDetailsById.name
  let course_cat = this.enquiryDetailsById.category
  let course = this.enquiryDetailsById.coursename
  let interested = this.enquiryDetailsById.interested
  let enquiryId = this.enquiryDetailsById.id
  let response = this.responseForm.value.response

  this.campusService.SendCourseEnquiryResponse(email,name,course_cat,course,interested,response,enquiryId).subscribe((res) =>{
    this.addLoader = false
    if(res.response_message == "Response sent successfully."){
      Swal.fire(
      '',
      'Response sent successfully',
      'success'
    );
    this.responseForm.get('response').setValue(null)
    this.dialog.closeAll();
    }
  });
}

updateStatus(id,status){
  let type = 'course_inquiry'
        this.campusService.updateStatus(id,status,type).subscribe((res) =>{
          if(res.response_message == "Success"){
             this.getEnquiryList();
          Swal.fire(
            '',
            'Course enquiry status updated.',
            'success'
          );
        }
    })
}

editEnquiry(data) {
  this.responseForm.get('name').setValue(data.name)
  this.responseForm.get('emailAddress').setValue(data.email)
  this.responseForm.get('category').setValue(data.category)
  this.responseForm.get('course').setValue(data.coursename)
  this.responseForm.get('intrested').setValue(data.interested)

  this.enquiryDetailsById = data
    const dialogRef = this.dialog.open(this.callAPIDialog);
    dialogRef.afterClosed().subscribe((result) => { });
}

close() {
    this.dialog.closeAll();
}

}
