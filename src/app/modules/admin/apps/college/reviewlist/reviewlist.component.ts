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
  selector: 'app-reviewlist',
  templateUrl: './reviewlist.component.html',
  styleUrls: ['./reviewlist.component.scss']
})
export class ReviewlistComponent implements OnInit {
  displayedColumns: string[] = ['Sr.No', 'title' ,'collegename','coursesName','status','rating','actions'];
  dataSource : any
  @ViewChild(MatPaginator) paginator: MatPaginator;
  ReviewList: any[];
  @ViewChild(MatSort) sort: MatSort;
  reviewForm : FormGroup
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

  constructor(
       private _formBuilder: FormBuilder,
       private campusService : CampusService,
       public _route: Router,
            ) {}

ngOnInit(): void {
  this.reviewForm = this._formBuilder.group({
      search: [''],
   });
   this.listLoader = true
    this.getReviewList()
}


getReviewList(){
  this.campusService.getReviewList(this.page,this.pageSize,this.startNum,this.columnIndex,this.sortValue,this.reviewForm.value.search).subscribe((res) =>{
    this.ReviewList = res.data
    this.recordsTotal = res.recordsTotal
    this.recordsFiltered = res.recordsFiltered
    if(this.ReviewList?.length != 0){
      this.dataSource = new MatTableDataSource<any>(this.ReviewList);
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
  this.getReviewList()
}

addCategory(){
  this._route.navigate(['apps/college/editreview']);
}

applyFilter(filterValue: string) {
  this.searchLoader = true
  this.getReviewList()
  setTimeout(() => { this.searchLoader = false; }, 500);
  // this.dataSource.filter = filterValue.trim().toLowerCase();
}

onSortChange(event: MatSort) {
  this.sortValue = event.direction
  this.columnIndex = this.displayedColumns.indexOf(event.active);
  this.getReviewList()
}

editReview(reviewId) {
  let review_id = reviewId;
  this._route.navigate(['apps/college/editreview/update/'+ review_id]);
}


deleteReview(reviewId){
  let review_id = reviewId
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete review details',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.campusService.deleteReview(review_id).subscribe((res) =>{
          if(res.response_message == "Success"){
            this.getReviewList()
            Swal.fire(
              'Deleted!',
              'Your review details has been deleted.',
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

}
