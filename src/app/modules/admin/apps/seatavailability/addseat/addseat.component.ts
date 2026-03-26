import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CampusService } from 'app/modules/service/campus.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-addseat',
    templateUrl: './addseat.component.html',
    styleUrls: ['./addseat.component.scss']
})
export class AddseatComponent implements OnInit {
    seatForm: FormGroup;
    isEditMode: boolean = false;
    seatId: string = '';
    isSubmitting: boolean = false;
    isLoading: boolean = false;

    years: number[] = [];
    states: string[] = [
        'Karnataka', 'Tamil Nadu', 'Maharashtra', 'Delhi', 'Uttar Pradesh',
        'Rajasthan', 'Kerala', 'West Bengal', 'Gujarat', 'Andhra Pradesh',
        'Telangana', 'Madhya Pradesh', 'Bihar', 'Punjab', 'Haryana'
    ];
    counselingTypes: string[] = ['State Quota', 'All India Quota', 'Deemed Universities'];
    courses: string[] = ['MBBS', 'BDS', 'AYUSH', 'BAMS', 'BHMS'];
    rounds: string[] = ['Round 1', 'Round 2', 'Round 3', 'Mop-up', 'Stray Vacancy'];
    categories: string[] = ['GEN', 'OBC', 'SC', 'ST', 'EWS', 'GM', '2A', '2B', '3A', '3B'];
    statuses: string[] = ['Active', 'Completed', 'Upcoming'];

    constructor(
        private _formBuilder: FormBuilder,
        private _route: ActivatedRoute,
        private _router: Router,
        private campusService: CampusService
    ) {
        const currentYear = new Date().getFullYear();
        for (let i = 0; i <= 2; i++) {
            this.years.push(currentYear - i);
        }
    }

    ngOnInit(): void {
        this.initForm();
        this._route.params.subscribe(params => {
            if (params['seat_id']) {
                this.isEditMode = true;
                this.seatId = params['seat_id'];
                this.loadSeatData();
            }
        });
    }

    initForm(): void {
        this.seatForm = this._formBuilder.group({
            year: [new Date().getFullYear(), Validators.required],
            state: ['', Validators.required],
            counseling_type: ['State Quota', Validators.required],
            college_name: ['', Validators.required],
            course: ['MBBS', Validators.required],
            round: ['Round 1', Validators.required],
            category: ['GEN', Validators.required],
            total_seats: ['', [Validators.required, Validators.min(1)]],
            filled_seats: ['', [Validators.required, Validators.min(0)]],
            status: ['Active', Validators.required]
        });

        // Auto-calculate available seats
        this.seatForm.get('total_seats').valueChanges.subscribe(() => this.validateSeats());
        this.seatForm.get('filled_seats').valueChanges.subscribe(() => this.validateSeats());
    }

    validateSeats(): void {
        const total = parseInt(this.seatForm.get('total_seats').value) || 0;
        const filled = parseInt(this.seatForm.get('filled_seats').value) || 0;
        
        if (filled > total) {
            this.seatForm.get('filled_seats').setErrors({ exceedsTotal: true });
        }
    }

    getAvailableSeats(): number {
        const total = parseInt(this.seatForm.get('total_seats').value) || 0;
        const filled = parseInt(this.seatForm.get('filled_seats').value) || 0;
        return Math.max(0, total - filled);
    }

    loadSeatData(): void {
        this.isLoading = true;
        this.campusService.getSeatById(this.seatId).subscribe((res) => {
            if (res.response_code === '200' && res.response_data) {
                const data = res.response_data;
                this.seatForm.patchValue({
                    year: data.year,
                    state: data.state,
                    counseling_type: data.counseling_type,
                    college_name: data.college_name,
                    course: data.course,
                    round: data.round,
                    category: data.category,
                    total_seats: data.total_seats,
                    filled_seats: data.filled_seats,
                    status: data.status
                });
            } else {
                Swal.fire({ icon: 'error', text: 'Failed to load seat data' });
                this._router.navigate(['/apps/seatavailability/seatlist']);
            }
            this.isLoading = false;
        }, (error) => {
            this.isLoading = false;
            Swal.fire({ icon: 'error', text: 'Error loading data' });
            this._router.navigate(['/apps/seatavailability/seatlist']);
        });
    }

    onSubmit(): void {
        if (this.seatForm.invalid) {
            this.seatForm.markAllAsTouched();
            Swal.fire({ icon: 'warning', text: 'Please fill all required fields' });
            return;
        }

        this.isSubmitting = true;
        const formData = this.seatForm.value;

        if (this.isEditMode) {
            formData.id = this.seatId;
        }

        this.campusService.insertUpdateSeatAvailability(formData).subscribe((res) => {
            this.isSubmitting = false;
            if (res.response_code === '200') {
                Swal.fire({
                    icon: 'success',
                    title: this.isEditMode ? 'Updated!' : 'Added!',
                    text: 'Seat availability data saved successfully.',
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    this._router.navigate(['/apps/seatavailability/seatlist']);
                });
            } else {
                Swal.fire({ icon: 'error', text: res.response_message || 'Failed to save' });
            }
        }, (error) => {
            this.isSubmitting = false;
            Swal.fire({ icon: 'error', text: 'An error occurred' });
        });
    }

    goBack(): void {
        this._router.navigate(['/apps/seatavailability/seatlist']);
    }
}
