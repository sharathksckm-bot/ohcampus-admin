import { Component, OnInit,ViewChild ,TemplateRef, Input, EventEmitter, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators,NgForm, FormArray } from '@angular/forms';
import { CampusService } from 'app/modules/service/campus.service'
import { FuseValidators } from '@fuse/validators';
import { GlobalService } from 'app/modules/service/global.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ebrouchures',
  templateUrl: './ebrouchures.component.html',
  styleUrls: ['./ebrouchures.component.scss']
})
export class EbrouchuresComponent implements OnInit {
  @Output() valueChanged: EventEmitter<string> = new EventEmitter<string>();
  @Input() collegeDetails: any;
  @Input() brochures: any;
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  ebroucherForm : FormGroup;
  showLoader: boolean[] = [];
  addLoader: boolean = false;
  updateLoader : boolean = false;
  updateButton : boolean = false;
  Loader : boolean = false;
  clgId: any;
  ebroucherIndex: any;
  showAddButton: boolean = false;
  image: any;
  landing_img: any;
  uploaded_img: any;
  tempDocumentArray2: { file_name: any; file_dir: any; docName: any; DocumentExtn: string; };
  uploadDocs1: any;
  uploaded: { id: string; imageName: any; };
  uploaded_supporting_docs1: { id: string; imageName: any; };
  uploadDocs=[0];
  length: any;

  constructor(
    private _formBuilder: FormBuilder,
    private campusService : CampusService,
    public globalService: GlobalService,
    public dialog: MatDialog,
    public _activatedroute: ActivatedRoute,
    public _route: Router, ) { }

    ngOnInit(): void {
      this.ebroucherForm = this._formBuilder.group({
        ebroucher: this._formBuilder.array([]),
      });

      this.clgId = this.collegeDetails.id
      this.addItem()
      if ((this.clgId != null)) {
        this.updateButton = true
        this.Loader = true
        this.getBroucherDetails()
      }
      this.Loader = true
      setTimeout(() => {
          this.Loader = false
      }, 2000);

    }

    getBroucherDetails(){
      if(this.clgId != null){
        this.updateButton = true
        this.brochures.forEach((data,index) => {
        if(index!=0){
        this.addItem();
      }
        this.ebroucher().controls[index].get('id').setValue(data.id)
        this.ebroucher().controls[index].get('title').setValue(data.title) ;
        this.ebroucher().controls[index].get('file').setValue(data.file)
        this.uploadDocs[index] = data.image;

        this.addMember(index)
      });
      this.Loader = false
        }
    }

    ebroucher(): FormArray {
      return this.ebroucherForm.get("ebroucher") as FormArray;
    }

    multiEBroucher(): FormGroup {
      return this._formBuilder.group({
        id: '',
        title: [''],
        file:[''] ,
      });
    }

    addItem(): void {
      this.ebroucher().push(this.multiEBroucher());
      this.showAddButton = false

    }

    addMember(ebroucherIndex){
      let title = this.ebroucher().controls[ebroucherIndex].get('title').value
      if(title != ''  ){
        this.showAddButton = true
      } else{
        this.showAddButton = false
      }
    }


removeItem(ebroucherData, ebroucherIndex) {
    let brochureId = ebroucherData.value.id;
    this.ebroucherIndex = ebroucherIndex;
    this.campusService.deleteBrochureOfCollege(brochureId).subscribe((res) => {
        if (res.response_message == "Success") {
            this.showAddButton = true;
        }
    });
    if (ebroucherIndex === 0) {
        // Clear the title and uploaded PDF file for the first item
        ebroucherData.controls['title'].setValue(''); // Clear title
        ebroucherData.controls['file'].setValue(null); // Clear uploaded PDF file
        this.uploadDocs[0] = null; // Clear reference to uploaded PDF
    } else {
        // Delete the item
        let brochureId = ebroucherData.value.id;
        this.ebroucherIndex = ebroucherIndex;
        this.campusService.deleteBrochureOfCollege(brochureId).subscribe((res) => {
            if (res.response_message == "Success") {
                this.showAddButton = true;
            }
        });
        this.ebroucher().removeAt(ebroucherIndex);
    }
}




    sendValueToParent() {
      const valueToSend = "9";
      this.valueChanged.emit(valueToSend);
    }

    insertUpdateEBroucher(){
      if(this.ebroucherForm.status == "INVALID"){
        this.ebroucherForm.markAllAsTouched();
        Swal.fire('', 'Please fill all mandatory data', 'error')
          return
       }else{
        this.length = this.ebroucherForm.controls.ebroucher.value?.length
        if(this.ebroucherForm.controls.ebroucher.value[this.length-1].file ==''){
          Swal.fire('', 'Please upload document', 'error')
          return
        }
      this.updateLoader = true
      this.clgId = this.collegeDetails.id
      let ebroucher = this.ebroucherForm.controls.ebroucher.value
      this.campusService.saveBrochuresDoc(this.clgId,ebroucher).subscribe((res) =>{
        if(res.response_message == "Success"){
          this.updateLoader = false
          Swal.fire({
            text: 'College e-broucer updated successful',
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: "#3290d6 !important",
            confirmButtonText: 'Ok'
          }).then((result) => {
            if (result.isConfirmed) {
              this.sendValueToParent()
            }
          });
        }else{
          this.updateLoader = false
          Swal.fire('', res.response_message , 'error')
        }

      })
       }
      }


    onFileChange(event: any, docName: string, files: FileList,ebroucherIndex) {
      const formData = new FormData();
      formData.append('file', event.target.files[0]);

      if (docName === 'ebroucherDocument') {
        this.showLoader[ebroucherIndex] = true;
      }

      this.campusService.uploadBrochuresDocs(formData).subscribe(res => {
        if (res.response_message === "success") {
          this.showLoader[ebroucherIndex] = false;

          const fileType = res.File.split(".").pop().toLowerCase();
          const isPdf = fileType === "pdf";

          const formArrayControl = this.ebroucher().at(ebroucherIndex) as FormGroup;
          formArrayControl.get('FrontFileType')?.setValue(isPdf ? 'PDF' : 'IMG');
          formArrayControl.get('file')?.setValue(res.File);
          formArrayControl.get('FrontFilePath')?.setValue(res.FileDir);

          this.uploadDocs[ebroucherIndex] = res.FileDir;
          this.dialog.closeAll();
        } else {
          this.showLoader[ebroucherIndex] = false;
          Swal.fire('', res.response_message, 'error');
        }
      });
    }

    openImgDialog(img) {
      const dialogRef = this.dialog.open(this.callAPIDialog);
      dialogRef.afterClosed().subscribe((result) => { });
      this.image = img;
    }

    close() {
      this.dialog.closeAll();
    }



    back(){
      this.sendValueToParent2();
    }

    sendValueToParent2() {
      const valueToSend = "7";
      this.valueChanged.emit(valueToSend);
    }

}
