import { ChangeDetectionStrategy, Component, AfterViewInit, OnDestroy, OnInit, ViewChild, ViewEncapsulation, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { CampusService } from 'app/modules/service/campus.service'
import Swal from 'sweetalert2';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-counsellingfeelist',
  templateUrl: './counsellingfeelist.component.html',
  styleUrls: ['./counsellingfeelist.component.scss']
})
export class CounsellingfeelistComponent implements OnInit {
  @ViewChild(MatPaginator) paginatior: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['Sr.No','college_type','category','sub_category','exam','fees','actions'];
  counsellingfeeListData: any[];
  dataSource : any;
  counsellingfeeList : FormGroup
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

  constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public _route: Router,
    public dialog: MatDialog,
    ){ }

    ngOnInit() {
      this.counsellingfeeList = this._formBuilder.group({
        search: [''],
     });
     this.listLoader = true
     this.getCounselingFeesList();
    }

    onPageChange(event: PageEvent): void {
      this.page = event.pageIndex + 1;
      this.pageSize = event.pageSize;
      this.startNum = (this.pageSize * (event.pageIndex))
      this.getCounselingFeesList();
    }

    addNewFee(){
      this._route.navigate(['apps/counsellingfee/addcounsellingfee']);
    }

    applyFilter(filterValue: string) {
      this.searchLoader = true
      this.getCounselingFeesList();
      setTimeout(() => { this.searchLoader = false; }, 500);
      // this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    onSortChange(event: MatSort) {
      this.sortValue = event.direction
      // this.columnIndex = this.displayedColumns.indexOf(event.active);
      this.getCounselingFeesList();
    }

    getCounselingFeesList(){
      this.campusService.getCounselingFeesList(this.page,this.pageSize,this.startNum,this.columnIndex,this.sortValue,this.counsellingfeeList.value.search).subscribe((res) =>{
        this.counsellingfeeListData = res.data;
        this.recordsTotal = res.recordsTotal
        this.recordsFiltered = res.recordsFiltered
      if(this.counsellingfeeListData?.length != 0){
          this.dataSource = new MatTableDataSource<any>(this.counsellingfeeListData);
          // this.dataSource.paginator = this.paginatior;
          this.dataSource.sort = this.sort;
         this.listLoader = false;
      }else{
        this.listLoader = false;
      }
      });
    }

    editCounselingFees(feeId) {
      this._route.navigate(['apps/counsellingfee/addcounsellingfee/update/'+ feeId]);
    }

    deleteCounselingFees(feeId){
        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to delete counselling fee details',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'Cancel'
        }).then((result) => {
          if (result.isConfirmed) {
            this.campusService.deleteCounselingFees(feeId).subscribe((res) =>{
              if(res.response_message == "Success"){
                this.getCounselingFeesList()
                Swal.fire(
                  'Deleted!',
                  'Counselling fee details has been deleted.',
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
