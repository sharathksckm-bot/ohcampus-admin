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
  selector: 'app-subcategory',
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.scss']
})
export class SubcategoryComponent implements OnInit {
   // displayedColumns: string[] = ['Sr.No', 'categoyrname','eligibility', 'level', 'name', 'actions'];
    displayedColumns: string[] = ['Sr.No','name', 'categoyrname', 'level', 'eligibility',  'actions'];

    dataSource : any
    @ViewChild(MatPaginator) paginator: MatPaginator;
    categoryList: any[];
    @ViewChild(MatSort) sort: MatSort;
    subcategory : FormGroup
    listLoader:boolean = false;
    page: number = 1;
    pageSize: number = 10;
    startNum: number = 0;
    Loader : boolean = false;
    sortValue: string = "desc";
    recordsTotal: any;
    recordsFiltered: any;
    columnIndex: number = 0;
    searchLoader : boolean = false;
    selectLoader : boolean = false;
    selectLoader1 : boolean = false;


    type = "college"
    courses: any;
    courseData: any;
    constructor(
         private _formBuilder: FormBuilder,
         private campusService : CampusService,
         public _route: Router,
              ) {}

    ngOnInit(): void {
      this.subcategory = this._formBuilder.group({
        search: [''],
        cat: [''],
        level: ['']
     });
     this.listLoader = true
      this.getSubCategoryList()
      this.getAcCategoryForCourse()
      this.getCategoryForCourse()
    }


    getCategoryForCourse(){
        this.campusService.getCategoryForCourse().subscribe((res) =>{
          this.courseData = res.response_data
        })
      }

      selectvalue1(){
        this.selectLoader = true
        this.getSubCategoryList()
        setTimeout(() => { this.selectLoader = false; }, 500);

      }


    selectvalue(){
        this.selectLoader1 = true
        this.getSubCategoryList()
        setTimeout(() => { this.selectLoader1 = false; }, 500);

      }
    getSubCategoryList(){
      this.campusService.getSubCategoryList( this.page,this.pageSize,this.startNum,this.columnIndex,this.sortValue,this.subcategory.value.search,this.subcategory.value.cat,this.subcategory.value.level).subscribe((res) =>{
        this.categoryList = res.data
        this.recordsTotal = res.recordsTotal
        this.recordsFiltered = res.recordsFiltered
        if(this.categoryList?.length != 0){
          this.dataSource = new MatTableDataSource<any>(this.categoryList);
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
      this.getSubCategoryList()
    }

    addSubcategory (){
      this._route.navigate(['apps/college/addsubcategory']);
    }
    getAcCategoryForCourse(){
        this.campusService.getAcCategoryForCourse().subscribe((res) =>{
          this.courses = res.response_data

        })
      }
    applyFilter(filterValue: string) {
      this.searchLoader = true
      this.getSubCategoryList()
      setTimeout(() => { this.searchLoader = false; }, 500);
      // this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    onSortChange(event: MatSort) {
      this.sortValue = event.direction
      this.columnIndex = this.displayedColumns.indexOf(event.active);
      this.getSubCategoryList()
    }

    editCategory(catId) {
      let cat_id = catId;
      this._route.navigate(['apps/college/addsubcategory/update/'+ cat_id]);
    // this._route.navigate(['apps/college/addsubcategory']);
    }


    deleteCategory(catId){
      let cat_id = catId
        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to delete Subcategory',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'Cancel'
        }).then((result) => {
          if (result.isConfirmed) {
            this.campusService.deleteSubCategoryDetails(cat_id).subscribe((res) =>{
              if(res.response_message == "Success"){
                this.getSubCategoryList()
                Swal.fire(
                  'Deleted!',
                  'Your Subcategory has been deleted.',
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
