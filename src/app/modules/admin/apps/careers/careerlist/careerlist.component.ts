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
  selector: 'app-careerlist',
  templateUrl: './careerlist.component.html',
  styleUrls: ['./careerlist.component.scss']
})
export class CareerlistComponent implements OnInit  {
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  displayedColumns: string[] = ['Sr.No', 'title','image','description','category','status','actions'];
  dataSource : any
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  careerListData : FormGroup
  page: number = 1;
  pageSize: number = 10;
  startNum:  number = 0;
  listLoader:boolean = false;
  Loader : boolean = false;
  sortValue: string = "desc";
  recordsTotal: any;
  recordsFiltered: any;
  columnIndex: number = 1;
  Image: any;
  image: any;
  careerList: any;
  showFullDescription: boolean = false;
  searchLoader : boolean = false;


constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public _route: Router,
    public dialog: MatDialog,
) { }

ngOnInit(): void {
    this.careerListData = this._formBuilder.group({
      search: [''],
   });
   this.listLoader = true
    this.getCareersList()

}

toggleDescription(element: any): void {
  element.showFullDescription = !element.showFullDescription;
}

getCareersList(){
  this.campusService.getCareersList(this.page,this.pageSize,this.startNum,this.columnIndex,this.sortValue,this.careerListData.value.search).subscribe((res) =>{
    this.careerList = res.data
    this.recordsTotal = res.recordsTotal
    this.recordsFiltered = res.recordsFiltered
  if(this.careerList?.length != 0){
    this.dataSource = new MatTableDataSource<any>(this.careerList);
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
  this.getCareersList()
}

addCareerDetails(){
  this._route.navigate(['apps/careers/addcareer']);
}

applyFilter(filterValue: string) {
  // this.dataSource.filter = filterValue.trim().toLowerCase();
  this.searchLoader = true
  this.getCareersList()
    setTimeout(() => { this.searchLoader = false; }, 500);
}

editCareerDetails(careerId) {
  let career_id = careerId;
  this._route.navigate(['apps/careers/addcareer/update/'+ career_id]);
}

onSortChange(event: MatSort) {
  this.sortValue = event.direction
  this.columnIndex = this.displayedColumns.indexOf(event.active);
  this.getCareersList()
}


deleteCareerDetails(careerId){
  let career_id = careerId
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete career details',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.campusService.deleteCareers(career_id).subscribe((res) =>{
          if(res.response_message == "Success"){
            this.getCareersList()
            Swal.fire(
              'Deleted!',
              'Career details has been deleted.',
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
