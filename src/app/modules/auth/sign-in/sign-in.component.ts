import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import Swal from 'sweetalert2';
import { CampusService } from 'app/modules/service/campus.service'

@Component({
    selector     : 'auth-sign-in',
    templateUrl  : './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthSignInComponent implements OnInit
{
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    signInForm: FormGroup;
    additionalInfo: FormGroup;
    showAlert: boolean = false;
    Loader: boolean = false;
    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private campusService : CampusService,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Create the form
        this.signInForm = this._formBuilder.group({
            username     : ['', [Validators.required, Validators.email]],
            password  : ['', Validators.required],
        });

        this.additionalInfo = this._formBuilder.group({
            remember  : [''],
        });

        this.signIn()
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    signIn(): void
    {

        if ( this.signInForm.invalid )
        {
            return;
        }
        // if ( this.additionalInfo.value.remember == false)
        // {
        //     Swal.fire('','Please check the box','error')
        //     return
        // }
        this.Loader = true
        // Sign in
        let username = this.signInForm.value.email
        let password = this.signInForm.value.password
        this._authService.signIn(this.signInForm.value)
            .subscribe((res) => {
                    if(res.response_message == "Success"){
                        this.Loader = false
                        const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
                                this._router.navigateByUrl(redirectURL);
                        // Swal.fire({
                        //     text:  'Login successful ',
                        //     icon: 'success',
                        //     showCancelButton: false,
                        //     confirmButtonColor: "#3290d6 !important",
                        //     confirmButtonText: 'Ok'
                        //   }).then((result) => {
                        //     if (result.isConfirmed) {
                        //         const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
                        //         this._router.navigateByUrl(redirectURL);
                        //     }
                        //   });
                    }else{
                        this.Loader = false
                        Swal.fire({
                            text: res.response_message ,
                            icon: 'error',
                            showCancelButton: false,
                            confirmButtonColor: "#3290d6 !important",
                            confirmButtonText: 'Ok'
                          }).then((result) => {
                            if (result.isConfirmed) {

                            }
                          });
                    }

                }

            );
    }
}
