import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from "app/config";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../../../../environments/environment';

@Component({
    selector: 'app-plans',
    templateUrl: './plans.component.html',
    styleUrls: ['./plans.component.scss']
})
export class PlansComponent implements OnInit {
    plans: any[] = [];
    displayedColumns: string[] = ['plan_name', 'plan_code', 'price', 'duration', 'is_active', 'actions'];
    loading = false;
    showForm = false;
    editMode = false;
    form: FormGroup;

    constructor(
        private http: HttpClient,
        private fb: FormBuilder,
        private snackBar: MatSnackBar
    ) {
        this.initForm();
    }

    ngOnInit(): void {
        this.loadPlans();
    }

    initForm(): void {
        this.form = this.fb.group({
            id: [null],
            plan_name: ['', Validators.required],
            plan_code: ['', Validators.required],
            description: [''],
            features: [''],
            price: [0, Validators.required],
            duration_days: [365],
            is_active: [true]
        });
    }

    loadPlans(): void {
        this.loading = true;
        this.http.post<any>(`${config.apiurl3}PremiumAdmin/getPlans`, {})
            .subscribe({
                next: (res) => {
                    this.plans = res.data || [];
                    this.loading = false;
                },
                error: () => this.loading = false
            });
    }

    openForm(data?: any): void {
        if (data) {
            this.editMode = true;
            this.form.patchValue(data);
        } else {
            this.editMode = false;
            this.form.reset();
            this.form.patchValue({ duration_days: 365, is_active: true });
        }
        this.showForm = true;
    }

    closeForm(): void {
        this.showForm = false;
        this.form.reset();
    }

    savePlan(): void {
        if (this.form.invalid) {
            this.snackBar.open('Please fill all required fields', 'Close', { duration: 3000 });
            return;
        }

        this.loading = true;
        this.http.post<any>(`${config.apiurl3}PremiumAdmin/savePlan`, this.form.value)
            .subscribe({
                next: (res) => {
                    this.snackBar.open(res.response_message, 'Close', { duration: 3000 });
                    this.closeForm();
                    this.loadPlans();
                },
                error: () => {
                    this.loading = false;
                    this.snackBar.open('Failed to save plan', 'Close', { duration: 3000 });
                }
            });
    }

    deletePlan(item: any): void {
        if (confirm('Are you sure you want to delete this plan?')) {
            this.http.post<any>(`${config.apiurl3}PremiumAdmin/deletePlan`, { id: item.id })
                .subscribe({
                    next: () => {
                        this.snackBar.open('Plan deleted', 'Close', { duration: 3000 });
                        this.loadPlans();
                    }
                });
        }
    }
}
