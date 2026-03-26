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
  selector: 'app-examlist',
  templateUrl: './examlist.component.html',
  styleUrls: ['./examlist.component.scss']
})
export class ExamlistComponent implements OnInit {
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  status: Status[] = [
    {id: '1', name: 'Active'},
    {id: '0', name: 'Inactive'},
  ];
  @ViewChild(MatPaginator) paginatior: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['Sr.No','title','category','created_by_name','create_date','updated_by_name','updated_date', 'status','actions'];
  examListData: any[];
  dataSource : any;
  examList : FormGroup
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
  image: any;
  link: string;


  constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public _route: Router,
    public dialog: MatDialog,
    ){ }

    ngOnInit() {
      this.examList = this._formBuilder.group({
        search: [''],
     });
     this.listLoader = true
     this.getExamList();
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
      this.getExamList();
    }

    addNewExam(){
      this._route.navigate(['apps/exams/addexam']);
    }

    applyFilter(filterValue: string) {
      this.searchLoader = true
      this.getExamList();
    setTimeout(() => { this.searchLoader = false; }, 500);
      // this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    onSortChange(event: MatSort) {
      this.sortValue = event.direction
      // this.columnIndex = this.displayedColumns.indexOf(event.active);
      this.getExamList();
    }

    getExamList(){
      this.campusService.getExamList(this.page,this.pageSize,this.startNum,this.columnIndex,this.sortValue,this.examList.value.search).subscribe((res) =>{
        this.examListData = res.data;
        this.recordsTotal = res.recordsTotal
        this.recordsFiltered = res.recordsFiltered
        // console.log(this.recordsFiltered+"  "+this.recordsTotal)
      if(this.examListData?.length != 0){
          this.dataSource = new MatTableDataSource<any>(this.examListData);
          // this.dataSource.paginator = this.paginatior;
          this.dataSource.sort = this.sort;
         this.listLoader = false;
      }else{
        this.listLoader = false;
      }
      });
    }

    editExamDetails(examId) {
      let exam_Id = examId;
      this._route.navigate(['apps/exams/addexam/update/'+ exam_Id]);
    }

    viewExamDetails(examId){
     // this.link ="https://win.k2key.in/Oh_Campus/examsdetails/"+examId
      this.link ="https://ohcampus.com/examsdetails/"+examId


      window.open(this.link, "_blank");
    }


    deleteExamDetails(ExamId){
      let examId = ExamId
        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to delete exam details',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'Cancel'
        }).then((result) => {
          if (result.isConfirmed) {
            this.campusService.deleteExam(examId).subscribe((res) =>{
              if(res.response_message == "Success"){
                this.getExamList()
                Swal.fire(
                  'Deleted!',
                  'Your exam details has been deleted.',
                  'success'
                );
              }
              else if(res.response_code=="300"){
                Swal.fire({ icon: 'warning',text : res.response_message
            }
                  );
            }

            });
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
