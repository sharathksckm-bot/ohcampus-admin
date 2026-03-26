import { ChangeDetectionStrategy, Component, AfterViewInit, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CampusService } from 'app/modules/service/campus.service'
import Swal from 'sweetalert2';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit {
  @ViewChild(MatPaginator) paginatior: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['Sr.No','country','actions'];
  countryListData: any[];
  dataSource : any;
  countryList : FormGroup
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
      this.countryList = this._formBuilder.group({
        search: [''],
     });
     this.listLoader = true
     this.getCountryList();
    }

    onPageChange(event: PageEvent): void {
      this.page = event.pageIndex + 1;
      this.pageSize = event.pageSize;
      this.startNum = (this.pageSize * (event.pageIndex))
      this.getCountryList();
    }

    addNewCountry(){
      this._route.navigate(['apps/location/addcountry']);
    }

    applyFilter(filterValue: string) {
      this.searchLoader = true
      this.getCountryList();
      setTimeout(() => { this.searchLoader = false; }, 500);
      // this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    onSortChange(event: MatSort) {
      this.sortValue = event.direction
      this.columnIndex = this.displayedColumns.indexOf(event.active);
      this.getCountryList();
    }

    getCountryList(){
      this.campusService.getCountryList(this.page,this.pageSize,this.startNum,this.columnIndex,this.sortValue,this.countryList.value.search).subscribe((res) =>{
        this.countryListData = res.data;
        this.recordsTotal = res.recordsTotal
        this.recordsFiltered = res.recordsFiltered
      if(this.countryListData?.length != 0){
          this.dataSource = new MatTableDataSource<any>(this.countryListData);
          // this.dataSource.paginator = this.paginatior;
          this.dataSource.sort = this.sort;
          this.listLoader = false;
      }else{
        this.listLoader = false;
      }
      });
    }


    editCountry(countryId) {
      let country_id = countryId;
      this._route.navigate(['apps/location/addcountry/update/'+ country_id]);
    }

    deleteCountry(countryId){
      let country_Id = countryId
        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to delete country details',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'Cancel'
        }).then((result) => {
          if (result.isConfirmed) {
            this.campusService.deleteCountry(country_Id).subscribe((res) =>{
              if(res.response_message == "Success"){
                this.getCountryList()
                Swal.fire(
                  'Deleted!',
                  'Country details has been deleted.',
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
