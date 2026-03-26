import { ChangeDetectionStrategy, Component, AfterViewInit, OnDestroy, OnInit, ViewChild, ViewEncapsulation, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { CampusService } from 'app/modules/service/campus.service'
import Swal from 'sweetalert2';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

interface Status {
  id: string;
  name: string;
}

@Component({
  selector: 'app-viewblogs',
  templateUrl: './viewblogs.component.html',
  styleUrls: ['./viewblogs.component.scss']
})
export class ViewblogsComponent implements OnInit {
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  status: Status[] = [
    {id: '1', name: 'Active'},
    {id: '0', name: 'Inactive'},
  ];
  @ViewChild(MatPaginator) paginatior: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['Sr.No','title','category','image','created_by_name','create_date','updated_by_name','updated_date',  'status','views','actions'];
  blogListData: any[];
  dataSource : any;
  blogList : FormGroup
  listLoader:boolean = false;
  page: number = 1;
  pageSize: number = 10;
  startNum:  number = 0;
  sortValue: string = "desc";
  recordsTotal: any;
  count: number = 1;
  recordsFiltered: any;
  columnIndex: number = 1;
  image: any;
  searchLoader : boolean = false;
  link: string;


  constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public _route: Router,
    public dialog: MatDialog,
    ){ }

    ngOnInit() {
      this.blogList = this._formBuilder.group({
        search: [''],
     });
     this.listLoader = true
     this.getBlogList();
    }

    convertDate(inputFormat) {
      function pad(s) { return (s < 10) ? '0' + s : s; }

      var monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];

      var d = new Date(inputFormat);
      var day = pad(d.getDate());
      var month = monthNames[d.getMonth()];
      var year = d.getFullYear();

      var hours = pad(d.getHours());
      var minutes = pad(d.getMinutes());
      var seconds = pad(d.getSeconds());
      return [day, month, year].join(' ') + ' ' + [hours, minutes, seconds].join(':');
    }

    onPageChange(event: PageEvent): void {
      this.page = event.pageIndex + 1;
      this.pageSize = event.pageSize;
      this.startNum = (this.pageSize * (event.pageIndex))
      this.getBlogList();
    }

    addNewBlog(){
      this._route.navigate(['apps/blog/addblog']);
    }

    applyFilter(filterValue: string) {
      this.searchLoader = true
      this.getBlogList();
    setTimeout(() => { this.searchLoader = false; }, 500);
      // this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    onSortChange(event: MatSort) {
      this.sortValue = event.direction
      // this.columnIndex = this.displayedColumns.indexOf(event.active);
      this.getBlogList();
    }

    getBlogList(){
      this.campusService.getBlogList(this.page,this.pageSize,this.startNum,this.columnIndex,this.sortValue,this.blogList.value.search).subscribe((res) =>{
        this.blogListData = res.data;
        this.recordsTotal = res.recordsTotal
        this.recordsFiltered = res.recordsFiltered
      if(this.blogListData?.length != 0){
          this.dataSource = new MatTableDataSource<any>(this.blogListData);
          // this.dataSource.paginator = this.paginatior;
          this.dataSource.sort = this.sort;
         this.listLoader = false;
      }else{
        this.listLoader = false;
      }
      });
    }


    editBlogDetails(blogId) {

        let blog_Id = blogId;
        const url = '/apps/blog/addblog/update/' + blog_Id;
        window.open(url, '_blank');
    }

    viewBlogDetails(blogId){
      let blog_Id = blogId;
        this.link ="https://ohcampus.com/articledetails/"+ blog_Id
        window.open(this.link, "_blank");
    }

    deleteBlogDetails(BlogId){
      let blogId = BlogId
        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to delete article details',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'Cancel'
        }).then((result) => {
          if (result.isConfirmed) {
            this.campusService.deleteBlog(blogId).subscribe((res) =>{
              if(res.response_message == "Success"){
                this.getBlogList()
                Swal.fire(
                  'Deleted!',
                  'Your article details has been deleted.',
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
