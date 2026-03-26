import { Component, OnInit,ViewChild ,TemplateRef, Input, EventEmitter, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators,NgForm, FormArray } from '@angular/forms';
import { CampusService } from 'app/modules/service/campus.service'
import { FuseValidators } from '@fuse/validators';
import { GlobalService } from 'app/modules/service/global.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';


@Component({
  selector: 'app-ranks',
  templateUrl: './ranks.component.html',
  styleUrls: ['./ranks.component.scss']
})
export class RanksComponent implements OnInit {
  config: AngularEditorConfig = {
    editable: true,
      spellcheck: true,
      height: 'auto',
      minHeight: '0',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
     uploadUrl: '',
     uploadWithCredentials: true,

};

  @Output() valueChanged: EventEmitter<string> = new EventEmitter<string>();
  @Input() collegeDetails: any;
  @Input() Rank: any;
  rankForm : FormGroup;
  showLoader: boolean = false;
  addLoader: boolean = false;
  updateLoader : boolean = false;
  updateButton : boolean = false;
  Loader : boolean = false;
  clgId: any;
  rankIndex: any;
  showAddButton: boolean = false;
  getCategoryListData: any;
  years: number[] = [];
  rankId: any;

  constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public globalService: GlobalService,
    public dialog: MatDialog,
    public _activatedroute: ActivatedRoute,
    public _route: Router, ) { }

    ngOnInit(): void {
      this.rankForm = this._formBuilder.group({
        rankArrayData: this._formBuilder.array([]),
      });

      this.clgId = this.collegeDetails.id
      if ((this.clgId != null)) {
        this.updateButton = true
        this.Loader = true
      }
      this.getRankCategoryList()
      this.generateYears()
      this.addItem()
    }

    generateYears(): void {
      const currentYear = new Date().getFullYear();
      for (let year = currentYear; year >= currentYear - 100; year--) {
        this.years.push(year);
      }
    }

    checkValidInputData(event: any, type) {
      this.globalService.checkValidInputData(event, type);
    }


    rankArrayData(): FormArray {
      return this.rankForm.get("rankArrayData") as FormArray;
    }

    multipleRankData(): FormGroup {
      return this._formBuilder.group({
        id:'',
        category_id: [''],
        rank: [''],
        description: [''],
        display_order: [''],
        year: [''],
      });
    }

    addItem(): void {
      this.rankArrayData().push(this.multipleRankData());
      this.showAddButton = false
    }

    // addMember(rankIndex){
    // let category_id = this.rankArrayData().controls[rankIndex].get('category_id').value
    // let rank = this.rankArrayData().controls[rankIndex].get('rank').value
    // let description = this.rankArrayData().controls[rankIndex].get('description').value
    // let year = this.rankArrayData().controls[rankIndex].get('year').value

    //   if(category_id != '' && rank != '' && description != '' && year != ''){
    //     this.showAddButton = true
    //   }else{
    //     this.showAddButton = false
    //   }

    // }
    addMember(){
        if(this.rankForm.status == "VALID"){
         this.showAddButton = true
        }
      }
    removeItem(rankData,rankIndex) {

        if(rankData?.length > 0){
            this.rankArrayData().removeAt(rankIndex)
          }
          if (rankIndex == 0){
            this.rankId = rankData.value.id;
            this.campusService.deleteRankForCollege(this.rankId).subscribe((res) =>{
              if(res.response_message == "Success"){
                this.showAddButton = true
                Swal.fire({
                    text: 'Your rank has been deleted !',
                    title : 'Alert',
                    icon: 'success',
                    showCancelButton: false,
                    confirmButtonColor: "#3290d6 !important",
                    confirmButtonText: 'Ok'
                  })
              }
              })
              this.rankArrayData().controls[rankIndex].get('id').setValue('') ;
            this.rankArrayData().controls[rankIndex].get('category_id').setValue('') ;
            this.rankArrayData().controls[rankIndex].get('rank').setValue('') ;
            this.rankArrayData().controls[rankIndex].get('description').setValue('') ;
            this.rankArrayData().controls[rankIndex].get('year').setValue('') ;
            this.rankArrayData().controls[rankIndex].get('display_order').setValue('') ;

          }else{
          this.rankId = rankData.value.id;
          this.campusService.deleteRankForCollege(this.rankId).subscribe((res) =>{
          if(res.response_message == "Success"){
            this.showAddButton = true
            Swal.fire({
                text: 'Your rank has been deleted !',
                title : 'Alert',
                icon: 'success',
                showCancelButton: false,
                confirmButtonColor: "#3290d6 !important",
                confirmButtonText: 'Ok'
              })
              this.rankArrayData().removeAt(rankIndex)

          }
          })
        }
    }

    getRankCategoryList(){
      this.campusService.getRankcategories().subscribe((res) =>{
        this.getCategoryListData = res.response_data
        this.getRankDetails()
      })
    }

    getRankDetails(){
      if(this.clgId != null){
        this.updateButton = true
        this.Rank.forEach((data,index) => {
        if(index!=0){
        this.addItem();
      }
      this.rankArrayData().controls[index].get('id').setValue(data.rank_id) ;
        this.rankArrayData().controls[index].get('category_id').setValue(data.category_id) ;
        this.rankArrayData().controls[index].get('rank').setValue(data.rank) ;
        this.rankArrayData().controls[index].get('description').setValue(data.description) ;

        let year
        this.years.forEach((item) => {
          if (item == data.year) {
            year = item;
          }
        });
        this.rankArrayData().controls[index].get('year').setValue(year) ;

        this.rankArrayData().controls[index].get('display_order').setValue(data.display_order) ;
        this.addMember()
      });
      this.Loader = false
        }
    }

    insertUpdateRankdetails(){
      if(this.rankForm.status == "INVALID"){
        this.rankForm.markAllAsTouched();
        Swal.fire('', 'Please fill all mandatory data', 'error')
          return
       }else{
      this.updateLoader = true
      this.clgId = this.collegeDetails.id
      let rank = this.rankForm.controls.rankArrayData.value
      this.campusService.insertupdateRankForClg(this.clgId,rank).subscribe((res) =>{
        if(res.response_message == "Success"){
          this.updateLoader = false
          Swal.fire({
            text: 'College rank updated successful',
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: "#3290d6 !important",
            confirmButtonText: 'Ok'
          }).then((result) => {
            if (result.isConfirmed) {
              this.sendValueToParent();
            }
          });
        }else{
          this.updateLoader = false
          Swal.fire('', res.response_message , 'error')
        }

      })
       }
      }



      back(){
        this.sendValueToParent2();
      }
      sendValueToParent() {
        const valueToSend = "12";
        this.valueChanged.emit(valueToSend);
      }


      sendValueToParent2() {
        const valueToSend = "10";
        this.valueChanged.emit(valueToSend);
      }

}
