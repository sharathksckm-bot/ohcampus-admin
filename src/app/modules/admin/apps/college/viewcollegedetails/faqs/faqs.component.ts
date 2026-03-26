import { Component, OnInit, ViewChild, TemplateRef, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm, FormArray } from '@angular/forms';
import { CampusService } from 'app/modules/service/campus.service'
import { FuseValidators } from '@fuse/validators';
import { GlobalService } from 'app/modules/service/global.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
    selector: 'app-faqs',
    templateUrl: './faqs.component.html',
    styleUrls: ['./faqs.component.scss']
})
export class FaqsComponent implements OnInit {
    @Output() valueChanged: EventEmitter<string> = new EventEmitter<string>();
    @Input() collegeDetails: any;
    @Input() faqsData: any;

    faqsForm: FormGroup;
    showLoader: boolean = false;
    addLoader: boolean = false;
    updateLoader: boolean = false;
    updateButton: boolean = false;
    Loader: boolean = false;
    clgId: any;
    isChecked: any;
    // selectedFaqs = [];
    descriptionData: any;
    Ids: string;
    faqslist: any = [0];
    categoryList: any;
    faqsIds: any;
    showAddButton: boolean = false;
    faqsId: any;
    selectedFaqs: any[''] = [];
    idData: any = [];
    arrayD = [];
    reponseData: any;

    constructor(
        private _formBuilder: FormBuilder,
        private campusService: CampusService,
        public globalService: GlobalService,
        public dialog: MatDialog,
        public _activatedroute: ActivatedRoute,
        public _route: Router,) { }

    ngOnInit(): void {

        this.faqsForm = this._formBuilder.group({
            faqsArrayData: this._formBuilder.array([]),
        });
        this.changeSelection
        this.addItem()
        this.getCategoryListByType();
        this.clgId = this.collegeDetails.id
        if ((this.clgId != null)) {
            this.updateButton = true
           this.Loader = true
        }
    }

    faqsArrayData(): FormArray {
        return this.faqsForm.get("faqsArrayData") as FormArray;
    }

    multipleFaqsData(): FormGroup {
        return this._formBuilder.group({
            id: '',
            faqstype: [''],
            faqs: [''],
        });
    }   addItem(): void {
        this.faqsArrayData().push(this.multipleFaqsData());
        this.showAddButton = false
    }


    // addMember(faqsIndex) {

    //     this.showAddButton = true
    //     let faqstype = this.faqsArrayData().controls[faqsIndex].get('faqstype').value
    //     let faqs = this.faqsArrayData().controls[faqsIndex].get('faqs').value

    //     if (faqstype != '' && faqs != '') {
    //         this.showAddButton = false
    //     } else {
    //         this.showAddButton = true
    //     }

    // }
    addMember(){
        if(this.faqsForm.status == "VALID"){
         this.showAddButton = true
        }
      }

    // removeItem(faqsDataa, faqsIndex) {
    //     this.faqsId = faqsDataa.value.id;
    //     this.faqsArrayData().removeAt(faqsIndex)
    //     this.selectedFaqs[faqsIndex].length = 0
    //     this.showAddButton = true
    // }
    removeItem(faqsDataa, faqsIndex) {

        this.faqsId = faqsDataa.value.id;
        this.faqsArrayData().removeAt(faqsIndex);
        // Check if selectedFaqs at faqsIndex exists before modifying it
        if (this.selectedFaqs[faqsIndex]) {
            this.selectedFaqs[faqsIndex].length = 0;
        }

        this.showAddButton = true;
        this.campusService.deleteCollegeFaq(this.faqsId).subscribe((res) =>{
            this.reponseData = res.response_data


    });


    }



    getCategoryListByType() {
        let type = "faq"
        this.campusService.getCategoryListByType(type).subscribe((res) => {
            if (res.response_message == "Success") {
                this.categoryList = res.response_data
                this.Loader = false

                if ((this.clgId != null)) {
                    this.bindFaqs()
                }
            }
        })
    }

    bindFaqs() {
        if (this.faqsData && this.faqsData.length > 0) {
            console.log(this.faqsData)
            this.updateButton = true;
            this.faqsData.forEach((data, index) => {
              if(index!=0){
                this.addItem();
              }


                this.faqsArrayData().controls[index].get('id').setValue(data.id);
                this.faqsArrayData().controls[index].get('faqstype').setValue(data.faq_type);
                this.idData[index]=data.faq_ids

                this.getAllfaqsForCollege(data.faq_type, index);
            });
        }
    }


    changeSelection(selected, faqsIndex: number) {
        this.selectedFaqs[faqsIndex] = selected
    }

    getAllfaqsForCollege(catId, faqsIndex) {
        if (catId != '') {
            this.campusService.allFaqByCategory(catId).subscribe((res) => {
                if (res.response_message == "Success") {
                    this.faqslist[faqsIndex] = res.response_data
                       console.log( this.idData[faqsIndex]);
                    this.idData[faqsIndex].forEach((item) => {
                     this.faqslist[faqsIndex].forEach((itemm) => {
                      if (item == itemm.id) {
                        if (!Array.isArray(this.selectedFaqs[faqsIndex])) {
                            this.selectedFaqs[faqsIndex] = [];
                        }
                        this.selectedFaqs[faqsIndex].push(itemm)
                        this.changeSelection;

                    }})
                    this.faqsArrayData().controls[faqsIndex].get('faqs').setValue(this.selectedFaqs[faqsIndex]);
                    this.selectedFaqs[faqsIndex] = (this.selectedFaqs[faqsIndex])
                })
                this.Loader = false
                }
            })
        }

    }

    removeFaqs(index: number, id: any, faqsIndex) {
        if (id != null) {
            this.selectedFaqs = this.selectedFaqs[faqsIndex].filter(item => item.id !== id);
            const faqsControl = this.faqsForm.controls.faqsArrayData.value.faqs;
            if (faqsControl) {
                faqsControl.setValue(this.selectedFaqs[faqsIndex]);
            }
        }
    }

    updateFaqsDetails() {
        this.updateLoader = true
        let faqsData = this.faqsForm.controls.faqsArrayData.value
        this.campusService.updateFaqForCollege(this.clgId, faqsData).subscribe((res) => {
            if (res.response_message == "Success") {
                this.updateLoader = false
                Swal.fire({
                    text: 'FAQs updated successful',
                    icon: 'success',
                    showCancelButton: false,
                    confirmButtonColor: "#3290d6 !important",
                    confirmButtonText: 'Ok'
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.sendValueToParent()
                    }
                });
            } else {
                this.updateLoader = false
                Swal.fire('', res.response_message, 'error')
            }

        })
    }

    back() {
        this.sendValueToParent2();
    }

    sendValueToParent() {
        const valueToSend = "13";
        this.valueChanged.emit(valueToSend);
    }

    sendValueToParent2() {
        const valueToSend = "11";
        this.valueChanged.emit(valueToSend);
    }

}
