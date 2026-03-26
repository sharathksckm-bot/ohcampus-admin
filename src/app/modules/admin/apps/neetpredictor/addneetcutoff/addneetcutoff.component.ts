import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CampusService } from 'app/modules/service/campus.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-addneetcutoff',
    templateUrl: './addneetcutoff.component.html',
    styleUrls: ['./addneetcutoff.component.scss']
})
export class AddneetcutoffComponent implements OnInit {
    cutoffForm: FormGroup;
    isEditMode: boolean = false;
    cutoffId: string = '';
    isSubmitting: boolean = false;
    isLoading: boolean = false;

    // Dropdown options
    years: number[] = [];
    states: string[] = [
        'Karnataka', 'Tamil Nadu', 'Maharashtra', 'Delhi', 'Uttar Pradesh',
        'Rajasthan', 'Kerala', 'West Bengal', 'Gujarat', 'Andhra Pradesh',
        'Telangana', 'Madhya Pradesh', 'Bihar', 'Punjab', 'Haryana',
        'Odisha', 'Jharkhand', 'Assam', 'Chhattisgarh', 'Uttarakhand',
        'Goa', 'Himachal Pradesh', 'Jammu and Kashmir', 'Puducherry'
    ];
    counselingTypes: string[] = ['State Quota', 'All India Quota', 'Deemed Universities'];
    courses: string[] = ['MBBS', 'BDS', 'AYUSH', 'BAMS', 'BHMS', 'BUMS', 'BSMS'];
    categories: string[] = ['GEN', 'OBC', 'SC', 'ST', 'EWS', 'GM', '2A', '2B', '3A', '3B'];
    rounds: string[] = ['Round 1', 'Round 2', 'Round 3', 'Mop-up', 'Stray Vacancy'];
    collegeTypes: string[] = ['Government', 'Private', 'Deemed'];

    constructor(
        private _formBuilder: FormBuilder,
        private _route: ActivatedRoute,
        private _router: Router,
        private campusService: CampusService
    ) {
        // Generate years (current year and 5 years back)
        const currentYear = new Date().getFullYear();
        for (let i = 0; i <= 5; i++) {
            this.years.push(currentYear - i);
        }
    }

    ngOnInit(): void {
        this.initForm();
        
        // Check if edit mode
        this._route.params.subscribe(params => {
            if (params['cutoff_id']) {
                this.isEditMode = true;
                this.cutoffId = params['cutoff_id'];
                this.loadCutoffData();
            }
        });
    }

    initForm(): void {
        this.cutoffForm = this._formBuilder.group({
            year: ['', Validators.required],
            state: ['', Validators.required],
            counseling_type: ['State Quota', Validators.required],
            college_id: [''],
            college_name: ['', Validators.required],
            course: ['MBBS', Validators.required],
            category: ['GEN', Validators.required],
            round: ['Round 1', Validators.required],
            opening_rank: ['', [Validators.required, Validators.min(1)]],
            closing_rank: ['', [Validators.required, Validators.min(1)]],
            college_type: ['Government', Validators.required],
            annual_fee: ['', [Validators.min(0)]]
        });
    }

    loadCutoffData(): void {
        this.isLoading = true;
        this.campusService.getNeetCutoffById(this.cutoffId).subscribe((res) => {
            if (res.response_code === '200' && res.response_data) {
                const data = res.response_data;
                this.cutoffForm.patchValue({
                    year: data.year,
                    state: data.state,
                    counseling_type: data.counseling_type,
                    college_id: data.college_id,
                    college_name: data.college_name,
                    course: data.course,
                    category: data.category,
                    round: data.round,
                    opening_rank: data.opening_rank,
                    closing_rank: data.closing_rank,
                    college_type: data.college_type,
                    annual_fee: data.annual_fee
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    text: 'Failed to load cutoff data'
                });
                this._router.navigate(['/apps/neetpredictor/neetpredictorlist']);
            }
            this.isLoading = false;
        }, (error) => {
            this.isLoading = false;
            Swal.fire({
                icon: 'error',
                text: 'Error loading cutoff data'
            });
            this._router.navigate(['/apps/neetpredictor/neetpredictorlist']);
        });
    }

    onSubmit(): void {
        if (this.cutoffForm.invalid) {
            this.cutoffForm.markAllAsTouched();
            Swal.fire({
                icon: 'warning',
                text: 'Please fill all required fields correctly'
            });
            return;
        }

        // Validate opening rank <= closing rank
        const openingRank = this.cutoffForm.get('opening_rank').value;
        const closingRank = this.cutoffForm.get('closing_rank').value;
        
        if (parseInt(openingRank) > parseInt(closingRank)) {
            Swal.fire({
                icon: 'warning',
                text: 'Opening rank cannot be greater than closing rank'
            });
            return;
        }

        this.isSubmitting = true;
        const formData = this.cutoffForm.value;

        if (this.isEditMode) {
            formData.id = this.cutoffId;
        }

        this.campusService.insertUpdateNeetCutoff(formData).subscribe((res) => {
            this.isSubmitting = false;
            if (res.response_code === '200' || res.response_message === 'Success') {
                Swal.fire({
                    icon: 'success',
                    title: this.isEditMode ? 'Updated!' : 'Added!',
                    text: `NEET cutoff data has been ${this.isEditMode ? 'updated' : 'added'} successfully.`,
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    this._router.navigate(['/apps/neetpredictor/neetpredictorlist']);
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    text: res.response_message || 'Failed to save cutoff data'
                });
            }
        }, (error) => {
            this.isSubmitting = false;
            Swal.fire({
                icon: 'error',
                text: 'An error occurred while saving data'
            });
        });
    }

    goBack(): void {
        this._router.navigate(['/apps/neetpredictor/neetpredictorlist']);
    }

    // Form field error getters
    getErrorMessage(fieldName: string): string {
        const field = this.cutoffForm.get(fieldName);
        if (field?.hasError('required')) {
            return `${this.formatFieldName(fieldName)} is required`;
        }
        if (field?.hasError('min')) {
            return `${this.formatFieldName(fieldName)} must be greater than 0`;
        }
        return '';
    }

    private formatFieldName(fieldName: string): string {
        return fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
}
