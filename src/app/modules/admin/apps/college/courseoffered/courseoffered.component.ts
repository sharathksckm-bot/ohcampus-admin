import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CampusService } from 'app/modules/service/campus.service'
import Swal from 'sweetalert2';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-courseoffered',
  templateUrl: './courseoffered.component.html',
  styleUrls: ['./courseoffered.component.scss']
})
export class CourseofferedComponent implements OnInit {

  displayedColumns: string[] = ['Sr.No','type','name','status','actions'];
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
  sortValue: string = "desc";
  recordsTotal: any;
  recordsFiltered: any;
  columnIndex: number = 0;

 constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public _route: Router,
  ) { }

  ngOnInit(): void {
    this.courseList = this._formBuilder.group({
      search: [''],
   });
   this.listLoader = true
    this.getCourseList()
  }

  getCourseList(){
    this.campusService.coursesOfferedInSameGrp(this.page,this.pageSize,this.startNum,this.columnIndex,this.sortValue,this.courseList.value.search).subscribe((res) =>{
      this.courseListData = res.data
      console.log(this.courseListData)
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
    this._route.navigate(['apps/college/addcourseoffered']);
  }

  applyFilter(filterValue: string) {
    // this.dataSource.filter = filterValue.trim().toLowerCase();
    this.getCourseList()
  }

  editCourse(courseId) {
    let course_id = courseId;
    this._route.navigate(['apps/college/addcourseoffered/update/'+ course_id]);
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
          });
        } else {
        }
     
    })
  }

}
