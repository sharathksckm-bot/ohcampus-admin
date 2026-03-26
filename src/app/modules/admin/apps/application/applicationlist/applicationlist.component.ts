import {  Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CampusService } from 'app/modules/service/campus.service'
import Swal from 'sweetalert2';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as xlsx from 'xlsx';
interface Status {
  id: string;
  name: string;
}

@Component({
  selector: 'app-applicationlist',
  templateUrl: './applicationlist.component.html',
  styleUrls: ['./applicationlist.component.scss']
})
export class ApplicationlistComponent implements OnInit {
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  @ViewChild('applicationDetails', { static: false }) applicationDetails: ElementRef;
  @ViewChild(MatPaginator) paginatior: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['Sr.No', 'student_name','email','mobile_no','entrance_exam', 'college','course','rank','score','CreatedDate','attended_by','attended_date','actions'];
  applicationListData: any[];
  dataSource : any;
  applicationList : FormGroup
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
  addLoader: boolean = false;
  pdf: any;
  status: Status[] = [
    {id: '1', name: 'Attended'},
    {id: '0', name: 'Pending'},
  ];
  applicationDetailsById: any;

  constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public _route: Router,
    public dialog: MatDialog,
    ){ }

    ngOnInit() {
      this.applicationList = this._formBuilder.group({
        search: [''],
     });

     this.responseForm = this._formBuilder.group({
      response: [''],
      emailAddress: [''],
      college: [''],
      course: [''],
      exams: [''],
      rank: [''],
      score: [''],
   });

     this.listLoader = true
     this.getCourseApplicationList();
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
      this.getCourseApplicationList();
    }

    addNewApplication(){
      this._route.navigate(['apps/application/addapplication']);
    }

    applyFilter(filterValue: string) {
      this.searchLoader = true
      this.getCourseApplicationList();
    setTimeout(() => { this.searchLoader = false; }, 500);
      // this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    onSortChange(event: MatSort) {
      this.sortValue = event.direction
      // this.columnIndex = this.displayedColumns.indexOf(event.active);
      this.getCourseApplicationList();
    }

    getCourseApplicationList(){
      this.campusService.getCourseApplicationList(this.page,this.pageSize,this.startNum,this.columnIndex,this.sortValue,this.applicationList.value.search).subscribe((res) =>{
        this.applicationListData = res.data;
        this.pdf = res.pdf
        this.recordsTotal = res.recordsTotal
        this.recordsFiltered = res.recordsFiltered
      if(this.applicationListData?.length != 0){
          this.dataSource = new MatTableDataSource<any>(this.applicationListData);
          // this.dataSource.paginator = this.paginatior;
          this.dataSource.sort = this.sort;
         this.listLoader = false;
      }else{
        this.listLoader = false;
      }
      });
    }

    editApplicationDetails(applicationId) {
      let application_Id = applicationId;
      this._route.navigate(['apps/apps/application/addapplication/update/'+ application_Id]);
    }

    deleteApplicationDetails(ApplicationId){
      let applicationId = ApplicationId
        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to delete application details',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'Cancel'
        }).then((result) => {
          if (result.isConfirmed) {
            this.campusService.deleteCourseApplication(applicationId).subscribe((res) =>{
              if(res.response_message == "Success"){
                this.getCourseApplicationList()
                Swal.fire(
                  'Deleted!',
                  'Application details has been deleted.',
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

  getPdf(){
    window.open(this.pdf, "_blank");
  }

  SendCourseApplicationResponse(){
    this.addLoader = true
    let type = 'Application'
    let enquiryId = this.applicationDetailsById.id
    let email = this.applicationDetailsById.email
    let name = ''
    let college = this.applicationDetailsById.college
    let course = this.applicationDetailsById.course
    let exams = this.applicationDetailsById.entrance_exam
    let rank = this.applicationDetailsById.rank
    let score = this.applicationDetailsById.score
    let response = this.responseForm.value.response

    this.campusService.SendCourseApplicationResponse(enquiryId,type,email,name,college,course,exams,rank,score,response).subscribe((res) =>{
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

  addApplicationResponse(data) {
    this.responseForm.get('emailAddress').setValue(data.email)
    this.responseForm.get('college').setValue(data.college)
    this.responseForm.get('course').setValue(data.course)
    this.responseForm.get('exams').setValue(data.entrance_exam)
    this.responseForm.get('rank').setValue(data.rank)
    this.responseForm.get('score').setValue(data.score)

    this.applicationDetailsById = data
      const dialogRef = this.dialog.open(this.callAPIDialog);
      dialogRef.afterClosed().subscribe((result) => { });
  }

  close() {
      this.dialog.closeAll();
  }

  updateStatus(id,status){
    let type = 'course_application'
    this.campusService.updateStatus(id,status,type).subscribe((res) =>{
      if(res.response_message == "Success"){
        this.getCourseApplicationList();
      Swal.fire(
        '',
        'Application status updated.',
        'success'
      );
    }
})
}

  getExcel() {
    const ws: xlsx.WorkSheet =  xlsx.utils.table_to_sheet(this.applicationDetails.nativeElement);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    ws['!cols'][11] = { hidden: true };
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
    xlsx.writeFile(wb, 'applicationDetails.xlsx');
  }


}
