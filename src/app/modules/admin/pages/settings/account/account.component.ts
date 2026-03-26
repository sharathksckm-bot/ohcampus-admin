import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector       : 'settings-account',
    templateUrl    : './account.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsAccountComponent implements OnInit
{
    accountForm: FormGroup;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder
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
        this.accountForm = this._formBuilder.group({
            name    : ['Sharad Kadwaikar'],
            username: ['Sharad'],
            title   : ['junior Frontend Developer'],
            company : ['Qws Compony'],
            about   : ['Hey! This is Sharad;  Developer. I\'m mostly passionate about bleeding edge tech and chocolate! 🍫'],
            email   : ['sharad.k@mail.com', Validators.email],
            phone   : ['8554793094'],
            country : ['India'],
            language: ['English']
        });
    }
}
