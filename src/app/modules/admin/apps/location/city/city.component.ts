import { ChangeDetectionStrategy, Component, AfterViewInit, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CampusService } from 'app/modules/service/campus.service'
import Swal from 'sweetalert2';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss']
})
export class CityComponent implements OnInit {
  @ViewChild(MatPaginator) paginatior: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['Sr.No','country', 'state','city','cityImage','actions'];
  cityListData: any[];
  dataSource : any;
  cityList : FormGroup
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
      this.cityList = this._formBuilder.group({
        search: [''],
     });
     this.listLoader = true
     this.getCityList();
    }

    onPageChange(event: PageEvent): void {
      this.page = event.pageIndex + 1;
      this.pageSize = event.pageSize;
      this.startNum = (this.pageSize * (event.pageIndex))
      this.getCityList();
    }

    addNewCity(){
      this._route.navigate(['apps/location/addcity']);
    }

    applyFilter(filterValue: string) {
      this.searchLoader = true
      this.getCityList();
      setTimeout(() => { this.searchLoader = false; }, 500);
      // this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    onSortChange(event: MatSort) {
      this.sortValue = event.direction
      this.columnIndex = this.displayedColumns.indexOf(event.active);
      this.getCityList();
    }

    getCityList(){
      this.campusService.getCityList(this.page,this.pageSize,this.startNum,this.columnIndex,this.sortValue,this.cityList.value.search).subscribe((res) =>{
        this.cityListData = res.data;
        this.recordsTotal = res.recordsTotal
        this.recordsFiltered = res.recordsFiltered
      if(this.cityListData?.length != 0){
          this.dataSource = new MatTableDataSource<any>(this.cityListData);
          // this.dataSource.paginator = this.paginatior;
          this.dataSource.sort = this.sort;
      this.listLoader = false;
      }else{
        this.listLoader = false;
      }
      });
    }


    editCity(cityId) {
      let city_id = cityId;
      this._route.navigate(['apps/location/addcity/update/'+ city_id]);
    }

    deleteCity(cityId){
      let city_Id = cityId
        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to delete city details',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'Cancel'
        }).then((result) => {
          if (result.isConfirmed) {
            this.campusService.deleteCity(city_Id).subscribe((res) =>{
              if(res.response_message == "Success"){
                this.getCityList()
                Swal.fire(
                  'Deleted!',
                  'City details has been deleted.',
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
