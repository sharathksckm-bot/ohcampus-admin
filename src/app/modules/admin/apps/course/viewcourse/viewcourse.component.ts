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

@Component({
  selector: 'app-viewcourse',
  templateUrl: './viewcourse.component.html',
  styleUrls: ['./viewcourse.component.scss']
})
export class ViewcourseComponent implements OnInit {
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;

  displayedColumns: string[] = ['Sr.No','type','name','category','image','status','actions'];
  dataSource : any
  @ViewChild(MatPaginator) paginator: MatPaginator;
  courseListData: any[];
  @ViewChild(MatSort) sort: MatSort;
  courseList : FormGroup
  page: number = 1;
  pageSize: number = 10;
  startNum:  number = 0;
  listLoader:boolean = false;
  Loader : boolean = false;
  searchLoader : boolean = false;
  selectLoader : boolean = false;
  sortValue: string = "desc";
  recordsTotal: any;
  recordsFiltered: any;
  columnIndex: number = 0;
  courses: any;
  image: any;

 constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public _route: Router,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.courseList = this._formBuilder.group({
      search: [''],
      category: [''],
   });

   this.listLoader = true
    this.getCourseList()
    this.getAcCategoryForCourse()
  }

  getAcCategoryForCourse(){
    this.campusService.getAcCategoryForCourse().subscribe((res) =>{
      this.courses = res.response_data
    })
  }

  selectvalue(){
    this.selectLoader = true
    this.getCourseList()
    setTimeout(() => { this.selectLoader = false; }, 500);

  }

  getCourseList(){
    this.campusService.getCourseList(this.page,this.pageSize,this.startNum,this.columnIndex,this.sortValue,this.courseList.value.search,this.courseList.value.category).subscribe((res) =>{
      this.courseListData = res.data
      this.recordsTotal = res.recordsTotal
      this.recordsFiltered = res.recordsFiltered
    if(this.courseListData?.length != 0){
      this.dataSource = new MatTableDataSource<any>(this.courseListData);
      // this.dataSource.paginator = this.paginator;
      this.listLoader = false;
      this.dataSource.sort = this.sort;
    }else{
      this.listLoader = false;
    }
    })
  }

  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.startNum = (this.pageSize * (event.pageIndex))
    this.getCourseList()
  }

  addCoursetype(){
    this._route.navigate(['apps/course/addcourse']);
  }

  applyFilter(filterValue: string) {
    // this.dataSource.filter = filterValue.trim().toLowerCase();
    this.searchLoader = true
    this.getCourseList()
    setTimeout(() => { this.searchLoader = false; }, 500);
  }



editCourse(courseId) {
    let course_id = courseId;
    const url = 'apps/course/addcourse/update/' + course_id;
    window.open(url, '_blank');
  }


  onSortChange(event: MatSort) {
    this.sortValue = event.direction
    this.columnIndex = this.displayedColumns.indexOf(event.active);
    this.getCourseList()
  }

  deleteCourse(courseId){
    let course_id = courseId
      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to delete course details',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.campusService.deleteCourses(course_id).subscribe((res) =>{
            if(res.response_message == "Success"){
              this.getCourseList()
              Swal.fire(
                'Deleted!',
                'Your course details has been deleted.',
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
