import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CampusService } from 'app/modules/service/campus.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-addgenericcutoff',
    templateUrl: './addgenericcutoff.component.html',
    styleUrls: ['./addgenericcutoff.component.scss']
})
export class AddgenericcutoffComponent implements OnInit {
    cutoffForm: FormGroup;
    isEditMode: boolean = false;
    cutoffId: string = '';
    isLoading: boolean = false;
    
    examTypes = [
        { code: 'KCET', name: 'Karnataka CET (KCET)' },
        { code: 'COMEDK', name: 'COMEDK UGET' },
        { code: 'JEE', name: 'JEE Main' }
    ];
    
    collegeTypes = [
        { value: 1, label: 'Government' },
        { value: 2, label: 'Private' }
    ];
    
    availableYears: string[] = [];
    availableRounds: string[] = ['Round 1', 'Round 2', 'Round 3', 'Mock Round', 'Special Round'];
    
    // Reservation codes by exam type
    kcetReservations = ['GM', 'GMH', 'GMK', 'GMR', '1G', '1H', '2AG', '2AH', '2BG', '2BH', '3AG', '3AH', '3BG', '3BH', 'SCG', 'SCH', 'STG', 'STH'];
    comedkReservations = ['GM', 'OBC', 'SC', 'ST'];
    jeeReservations = ['GEN', 'OBC-NCL', 'SC', 'ST', 'EWS', 'GEN-PwD', 'OBC-NCL-PwD', 'SC-PwD', 'ST-PwD', 'EWS-PwD'];
    
    currentReservations: string[] = [];
    cutoffData: { [key: string]: number } = {};

    constructor(
        private _formBuilder: FormBuilder,
        private _route: ActivatedRoute,
        private _router: Router,
        private campusService: CampusService
    ) { }

    ngOnInit(): void {
        // Generate years
        const currentYear = new Date().getFullYear();
        for (let i = currentYear; i >= currentYear - 5; i--) {
            this.availableYears.push(i.toString());
        }
        
        // Initialize form
        this.cutoffForm = this._formBuilder.group({
            exam_type: ['KCET', Validators.required],
            year: [currentYear.toString(), Validators.required],
            round: ['Round 1', Validators.required],
            category: ['Engineering'],
            college_name: ['', Validators.required],
            course: ['', Validators.required],
            college_type: [1, Validators.required],
            address: [''],
            url: [''],
            accreditation: [''],
            affiliated_to: ['']
        });
        
        // Update reservations when exam type changes
        this.cutoffForm.get('exam_type').valueChanges.subscribe(value => {
            this.updateReservations(value);
        });
        
        // Initialize reservations
        this.updateReservations('KCET');
        
        // Check if edit mode
        this._route.params.subscribe(params => {
            if (params['cutoff_id']) {
                this.isEditMode = true;
                this.cutoffId = params['cutoff_id'];
                this.loadCutoffData();
            }
        });
    }

    updateReservations(examType: string): void {
        switch (examType) {
            case 'KCET':
                this.currentReservations = this.kcetReservations;
                break;
            case 'COMEDK':
                this.currentReservations = this.comedkReservations;
                break;
            case 'JEE':
                this.currentReservations = this.jeeReservations;
                break;
            default:
                this.currentReservations = this.kcetReservations;
        }
        
        // Initialize cutoff data for new reservations
        if (!this.isEditMode) {
            this.cutoffData = {};
            this.currentReservations.forEach(res => {
                this.cutoffData[res] = null;
            });
        }
    }

    loadCutoffData(): void {
        this.isLoading = true;
        this.campusService.getGenericCutoffById(this.cutoffId).subscribe(
            (res) => {
                if (res.response_code === '200' && res.response_data) {
                    const data = res.response_data;
                    
                    this.cutoffForm.patchValue({
                        exam_type: data.exam_type,
                        year: data.year,
                        round: data.round,
                        category: data.category,
                        college_name: data.college_name,
                        course: data.course,
                        college_type: data.college_type,
                        address: data.address,
                        url: data.url,
                        accreditation: data.accreditation,
                        affiliated_to: data.affiliated_to
                    });
                    
                    // Update reservations first
                    this.updateReservations(data.exam_type);
                    
                    // Then load cutoff data
                    if (data.cutoff_data) {
                        this.cutoffData = typeof data.cutoff_data === 'string' 
                            ? JSON.parse(data.cutoff_data) 
                            : data.cutoff_data;
                    }
                }
                this.isLoading = false;
            },
            (error) => {
                console.error('Error loading cutoff:', error);
                this.isLoading = false;
                Swal.fire({
                    icon: 'error',
                    text: 'Failed to load cutoff data'
                });
            }
        );
    }

    onSubmit(): void {
        if (this.cutoffForm.invalid) {
            Swal.fire({
                icon: 'warning',
                text: 'Please fill all required fields'
            });
            return;
        }

        const formData = {
            ...this.cutoffForm.value,
            cutoff_data: this.cutoffData
        };

        if (this.isEditMode) {
            formData.id = this.cutoffId;
        }

        this.isLoading = true;
        this.campusService.insertUpdateGenericCutoff(formData).subscribe(
            (res) => {
                this.isLoading = false;
                if (res.response_code === '200') {
                    Swal.fire({
                        icon: 'success',
                        title: this.isEditMode ? 'Updated!' : 'Added!',
                        text: 'Cutoff entry has been saved successfully.',
                        timer: 2000,
                        showConfirmButton: false
                    }).then(() => {
                        this._router.navigate(['/apps/genericpredictor/genericpredictorlist']);
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        text: res.response_message || 'Failed to save'
                    });
                }
            },
            (error) => {
                this.isLoading = false;
                Swal.fire({
                    icon: 'error',
                    text: 'An error occurred while saving'
                });
            }
        );
    }

    goBack(): void {
        this._router.navigate(['/apps/genericpredictor/genericpredictorlist']);
    }

    getReservationLabel(code: string): string {
        const labels: { [key: string]: string } = {
            'GM': 'General Merit',
            'GMH': 'GM - HK',
            'GMK': 'GM - Kannada Medium',
            'GMR': 'GM - Rural',
            '1G': 'Cat-1 General',
            '1H': 'Cat-1 HK',
            '2AG': 'Cat-2A General',
            '2AH': 'Cat-2A HK',
            '2BG': 'Cat-2B General',
            '2BH': 'Cat-2B HK',
            '3AG': 'Cat-3A General',
            '3AH': 'Cat-3A HK',
            '3BG': 'Cat-3B General',
            '3BH': 'Cat-3B HK',
            'SCG': 'SC General',
            'SCH': 'SC HK',
            'STG': 'ST General',
            'STH': 'ST HK',
            'GEN': 'General',
            'OBC': 'OBC',
            'OBC-NCL': 'OBC Non-Creamy',
            'SC': 'SC',
            'ST': 'ST',
            'EWS': 'EWS',
            'GEN-PwD': 'General PwD',
            'OBC-NCL-PwD': 'OBC NCL PwD',
            'SC-PwD': 'SC PwD',
            'ST-PwD': 'ST PwD',
            'EWS-PwD': 'EWS PwD'
        };
        return labels[code] || code;
    }
}
