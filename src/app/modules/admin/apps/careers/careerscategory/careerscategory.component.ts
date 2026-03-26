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
  selector: 'app-careerscategory',
  templateUrl: './careerscategory.component.html',
  styleUrls: ['./careerscategory.component.scss']
})
export class CareerscategoryComponent  implements OnInit {
    displayedColumns: string[] = ['Sr.No', 'catname' ,'topmenu','menuorder','type', 'status','actions'];
    dataSource : any
    @ViewChild(MatPaginator) paginator: MatPaginator;
    categoryList: any[];
    @ViewChild(MatSort) sort: MatSort;
    category : FormGroup
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

    type:string = "careers";
    constructor(
         private _formBuilder: FormBuilder,
         private campusService : CampusService,
         public _route: Router,
              ) {}

    ngOnInit(): void {
      this.category = this._formBuilder.group({
        search: [''],
     });
     this.listLoader = true
      this.getCategoryList()
    }

    getCategoryList(){
      this.campusService.getCategoryList(this.type,this.page,this.pageSize,this.startNum,this.columnIndex,this.sortValue,this.category.value.search).subscribe((res) =>{
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
      this.getCategoryList()
    }

    addCategory(){

      this._route.navigate(['apps/careers/addcarcategory']);
    }

    applyFilter(filterValue: string) {
      this.searchLoader = true
      this.getCategoryList()
    setTimeout(() => { this.searchLoader = false; }, 500);
      // this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    onSortChange(event: MatSort) {
      this.sortValue = event.direction
      this.columnIndex = this.displayedColumns.indexOf(event.active);
      this.getCategoryList()
    }

    editCategory(catId) {
      let cat_id = catId;
     // this._route.navigate(['apps/faqs/addcategory/update/'+ cat_id]);
      this._route.navigate(['apps/careers/addcarcategory/update/'+ cat_id]);
    }


    deleteCategory(catId){
      let cat_id = catId
        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to delete career category',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'Cancel'
        }).then((result) => {
          if (result.isConfirmed) {
            this.campusService.deleteCategoryDetails(cat_id).subscribe((res) =>{
              if(res.response_message == "Success"){
                this.getCategoryList()
                Swal.fire(
                  'Deleted!',
                  'Your career category has been deleted.',
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

