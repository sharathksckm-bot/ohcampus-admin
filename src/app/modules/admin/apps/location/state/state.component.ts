import { ChangeDetectionStrategy, Component, AfterViewInit, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CampusService } from 'app/modules/service/campus.service'
import Swal from 'sweetalert2';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.scss']
})
export class StateComponent implements OnInit {

  @ViewChild(MatPaginator) paginatior: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['Sr.No','country','state','actions'];
  stateListData: any[];
  dataSource : any;
  stateList : FormGroup
  listLoader:boolean = false;
  length: number;
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
    ){ }

    ngOnInit() {
      this.stateList = this._formBuilder.group({
        search: [''],
     });
     this.listLoader = true
     this.getStateList();
    }

    onPageChange(event: PageEvent): void {
      this.page = event.pageIndex + 1;
      this.pageSize = event.pageSize;
      this.startNum = (this.pageSize * (event.pageIndex))
      this.getStateList();
    }

    addNewState(){
      this._route.navigate(['apps/location/addstate']);
    }

    applyFilter(filterValue: string) {
      this.searchLoader = true
      this.getStateList();
      setTimeout(() => { this.searchLoader = false; }, 500);
      // this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    onSortChange(event: MatSort) {
      this.sortValue = event.direction
      this.columnIndex = this.displayedColumns.indexOf(event.active);
      this.getStateList();
    }

    getStateList(){
      this.campusService.getStateList(this.page,this.pageSize,this.startNum,this.columnIndex,this.sortValue,this.stateList.value.search).subscribe((res) =>{
        this.stateListData = res.data;
        this.recordsTotal = res.recordsTotal
        this.recordsFiltered = res.recordsFiltered
      if(this.stateListData?.length != 0){
          this.dataSource = new MatTableDataSource<any>(this.stateListData);
          // this.dataSource.paginator = this.paginatior;
          this.dataSource.sort = this.sort;
         this.listLoader = false;
      }else{
        this.listLoader = false;
      }
      });
    }


    editState(stateId) {
      let state_id = stateId;
      this._route.navigate(['apps/location/addstate/update/'+ state_id]);
    }

    deleteState(stateId){
      let state_Id = stateId
        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to delete state details',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'Cancel'
        }).then((result) => {
          if (result.isConfirmed) {
            this.campusService.deleteState(state_Id).subscribe((res) =>{
              if(res.response_message == "Success"){
                this.getStateList()
                Swal.fire(
                  'Deleted!',
                  'State details has been deleted.',
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
