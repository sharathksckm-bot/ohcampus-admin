import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { CampusService } from 'app/modules/service/campus.service'
import Swal from 'sweetalert2';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
interface Status {
  id: string;
  name: string;
}

@Component({
  selector: 'app-predictlist',
  templateUrl: './predictlist.component.html',
  styleUrls: ['./predictlist.component.scss']
})
export class PredictlistComponent  implements OnInit {
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  status: Status[] = [
    {id: '1', name: 'Attended'},
    {id: '0', name: 'Pending'},
  ];
  displayedColumns: string[] = ['Sr.No', 'student_name', 'mobile_no', 'email', 'category', 'college', 'course', 'entrance_exam', 'rank', 'score', 'CreatedDate' ,'attended_by','attended_date','actions' ];
    dataSource : any
    @ViewChild(MatPaginator) paginator: MatPaginator;
    predictList: any[];
    @ViewChild(MatSort) sort: MatSort;
    predict : FormGroup
    responseForm : FormGroup
    listLoader:boolean = false;
    page: number = 1;
    pageSize: number = 10;
    startNum: number = 0;
    Loader : boolean = false;
    sortValue: string = "desc";
    recordsTotal: any;
    recordsFiltered: any;
    columnIndex: number = 1;
    searchLoader : boolean = false;
    addLoader: boolean = false;

    type = "college"
  applicationDetailsById: any;
    constructor(
         private _formBuilder: FormBuilder,
         private campusService : CampusService,
         public _route: Router,
         public dialog: MatDialog
              ) {}

    ngOnInit(): void {
      this.predict = this._formBuilder.group({
        search: [''],
     });

     this.responseForm = this._formBuilder.group({
      response: [''],
      name: [''],
      emailAddress: [''],
      college: [''],
      course: [''],
      exams: [''],
      rank: [''],
      score: [''],
   });

     this.listLoader = true
      this.getPredictList();
    }

    getPredictList(){
      this.campusService.getPredictList(this.page,this.pageSize,this.startNum,this.columnIndex,this.sortValue,this.predict.value.search).subscribe((res) =>{
        this.predictList = res.data
        this.recordsTotal = res.recordsTotal
        this.recordsFiltered = res.recordsFiltered
        if(this.predictList?.length != 0){
          this.dataSource = new MatTableDataSource<any>(this.predictList);
          // this.dataSource.paginator = this.paginator;
          this.listLoader = false;
          this.dataSource.sort = this.sort;
      }else{
        this.listLoader = false;
      }
      })
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
      this.getPredictList()
    }



    applyFilter(filterValue: string) {
      this.searchLoader = true
      this.getPredictList()
      setTimeout(() => { this.searchLoader = false; }, 500);
      // this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    onSortChange(event: MatSort) {
      this.sortValue = event.direction
      this.columnIndex = this.displayedColumns.indexOf(event.active);
      this.getPredictList()
    }

    updateStatus(id,status){
      let type = 'predict_admission'
      this.campusService.updateStatus(id,status,type).subscribe((res) =>{
        if(res.response_message == "Success"){
          this.getPredictList();
        Swal.fire(
          '',
          'Predict admission status updated.',
          'success'
        );
      }
  })
}

deletePredictDetails(predictId){
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete predict admission details',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.campusService.deleteAdmission(predictId).subscribe((res) =>{
          if(res.response_message == "Success"){
            this.getPredictList()
            Swal.fire(
              'Deleted!',
              'Predict admission details has been deleted.',
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

SendCourseApplicationResponse(){
  this.addLoader = true
  let type = 'Predict Admission'
  let enquiryId = this.applicationDetailsById.id
  let email = this.applicationDetailsById.email
  let name = this.applicationDetailsById.student_name
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
  this.responseForm.get('name').setValue(data.student_name)
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
  }
