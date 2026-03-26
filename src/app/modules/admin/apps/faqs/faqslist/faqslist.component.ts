import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CampusService } from 'app/modules/service/campus.service'
import Swal from 'sweetalert2';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup } from '@angular/forms';

interface Status {
  id: string;
  name: string;
}

@Component({
  selector: 'app-faqslist',
  templateUrl: './faqslist.component.html',
  styleUrls: ['./faqslist.component.scss']
})
export class FaqslistComponent implements OnInit {
  displayedColumns: string[] = ['Sr.No','heading','description','category','status','actions'];
  dataSource : any
  @ViewChild(MatPaginator) paginator: MatPaginator;
  faqsListData: any[];
  @ViewChild(MatSort) sort: MatSort;
  faqsList : FormGroup
  page: number = 1;
  pageSize: number = 10;
  startNum:  number = 0;
  listLoader:boolean = false;
  Loader : boolean = false;
  sortValue: string = "desc";
  recordsTotal: any;
  recordsFiltered: any;
  columnIndex: number = 0;
  CategoryList: any;
  searchLoader : boolean = false;

constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public _route: Router,
) { }

ngOnInit(): void {
    this.faqsList = this._formBuilder.group({
      search: [''],
   });
   this.listLoader = true
   this.getFaqList()

}

toggleDescription(element: any): void {
    element.showFullDescription = !element.showFullDescription;
}

getFaqList(){
    this.campusService.getFaqList(this.page,this.pageSize,this.startNum,this.columnIndex,this.sortValue,this.faqsList.value.search).subscribe((res) =>{
      this.faqsListData = res.data
      console.log(this.faqsListData)
      this.recordsTotal = res.recordsTotal
      this.recordsFiltered = res.recordsFiltered
    if(this.faqsListData?.length != 0){
      this.dataSource = new MatTableDataSource<any>(this.faqsListData);
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
    this.getFaqList()
}

addFaqs(){
    this._route.navigate(['apps/faqs/addfaqs']);
}

applyFilter(filterValue: string) {
    // this.dataSource.filter = filterValue.trim().toLowerCase();
    this.searchLoader = true
    this.getFaqList()
    setTimeout(() => { this.searchLoader = false; }, 500);
}

onSortChange(event: MatSort) {
    this.sortValue = event.direction
    this.columnIndex = this.displayedColumns.indexOf(event.active);
    this.getFaqList()
}

editFaqs(faqsId) {
    let faqs_id = faqsId;
    this._route.navigate(['apps/faqs/addfaqs/update/'+ faqs_id]);
}

deleteFaq(faqsId){
    let faqs_id = faqsId
      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to delete FAQs details',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.campusService.deleteFaq(faqs_id).subscribe((res) =>{
            if(res.response_message == "Success"){
              this.getFaqList()
              Swal.fire(
                'Deleted!',
                'Your FAQs details has been deleted.',
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
