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
  selector: 'app-rankcategory',
  templateUrl: './rankcategory.component.html',
  styleUrls: ['./rankcategory.component.scss']
})
export class RankcategoryComponent implements OnInit {
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  displayedColumns: string[] = ['Sr.No', 'title','image','actions'];
  dataSource : any
  @ViewChild(MatPaginator) paginator: MatPaginator;
  rankCategoryList: any[];
  @ViewChild(MatSort) sort: MatSort;
  rankList : FormGroup
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
  searchLoader : boolean = false;
  constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public _route: Router,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
      this.rankList = this._formBuilder.group({
        search: [''],
     });
     this.listLoader = true
      this.getRankCategoryList()

  }

  getRankCategoryList(){
    this.campusService.getRankCategoryList(this.page,this.pageSize,this.startNum,this.columnIndex,this.sortValue,this.rankList.value.search).subscribe((res) =>{
      this.rankCategoryList = res.data
      this.recordsTotal = res.recordsTotal
      this.recordsFiltered = res.recordsFiltered
    if(this.rankCategoryList?.length != 0){
      this.dataSource = new MatTableDataSource<any>(this.rankCategoryList);
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
    this.getRankCategoryList()
  }

  addRnkCatDetails(){
    this._route.navigate(['apps/college/addrankcategory']);
  }

  applyFilter(filterValue: string) {
    // this.dataSource.filter = filterValue.trim().toLowerCase();
    this.searchLoader = true
    this.getRankCategoryList()
    setTimeout(() => { this.searchLoader = false; }, 500);
  }

 editRnkCatDetails(rankId) {
    let rank_id = rankId;
    this._route.navigate(['apps/college/addrankcategory/update/'+ rank_id]);
  }

  onSortChange(event: MatSort) {
    this.sortValue = event.direction
    this.columnIndex = this.displayedColumns.indexOf(event.active);
    this.getRankCategoryList()
  }


  deleteRnkCatDetails(rankId){
    let rank_id = rankId
      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to delete rank category',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.campusService.deleteRnkCatDetails(rank_id).subscribe((res) =>{
            if(res.response_message == "Success"){
              this.getRankCategoryList()
              Swal.fire(
                'Deleted!',
                'Your rank category has been deleted.',
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

