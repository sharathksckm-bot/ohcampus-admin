import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from "app/config";
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../../../../environments/environment';

@Component({
    selector: 'app-subscriptions',
    templateUrl: './subscriptions.component.html',
    styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {
    subscriptions: any[] = [];
    stats: any = { total_revenue: 0, active_count: 0, total_count: 0, monthly_revenue: 0 };
    plans: any[] = [];
    displayedColumns: string[] = ['user', 'plan', 'amount', 'status', 'start_date', 'expiry_date', 'actions'];
    loading = false;
    showGrantForm = false;
    searchUsers: any[] = [];
    selectedUser: any = null;
    selectedPlan: any = null;
    grantDays: number = null;
    grantNotes = '';
    userSearchText = '';
    searchText = '';
    filterStatus = '';

    constructor(
        private http: HttpClient,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.loadStats();
        this.loadSubscriptions();
        this.loadPlans();
    }

    loadStats(): void {
        this.http.post<any>(`${config.apiurl3}PremiumAdmin/getSubscriptionStats`, {})
            .subscribe(res => this.stats = res.data || { total_revenue: 0, active_count: 0, total_count: 0, monthly_revenue: 0 });
    }

    loadSubscriptions(): void {
        this.loading = true;
        this.http.post<any>(`${config.apiurl3}PremiumAdmin/getSubscriptions`, { 
            limit: 100,
            search: this.searchText,
            status: this.filterStatus
        }).subscribe({
                next: (res) => {
                    this.subscriptions = res.data?.subscriptions || [];
                    this.loading = false;
                },
                error: () => this.loading = false
            });
    }

    search(): void {
        this.loadSubscriptions();
    }

    loadPlans(): void {
        this.http.post<any>(`${config.apiurl3}PremiumAdmin/getPlans`, {})
            .subscribe(res => this.plans = res.data || []);
    }

    searchUser(): void {
        if (this.userSearchText.length < 2) {
            this.searchUsers = [];
            return;
        }
        this.http.post<any>(`${config.apiurl3}PremiumAdmin/searchUsers`, { search: this.userSearchText })
            .subscribe(res => this.searchUsers = res.data || []);
    }

    selectUser(user: any): void {
        this.selectedUser = user;
        this.searchUsers = [];
        this.userSearchText = `${user.f_name} ${user.l_name} (${user.email})`;
    }

    grantAccess(): void {
        if (!this.selectedUser || !this.selectedPlan) {
            this.snackBar.open('Please select user and plan', 'Close', { duration: 3000 });
            return;
        }

        this.loading = true;
        this.http.post<any>(`${config.apiurl3}PremiumAdmin/grantAccess`, {
            user_id: this.selectedUser.id,
            plan_id: this.selectedPlan.id,
            duration_days: this.grantDays || this.selectedPlan.duration_days,
            notes: this.grantNotes
        }).subscribe({
            next: (res) => {
                this.snackBar.open(res.response_message, 'Close', { duration: 3000 });
                this.closeGrantForm();
                this.loadSubscriptions();
                this.loadStats();
            },
            error: () => {
                this.loading = false;
                this.snackBar.open('Failed to grant access', 'Close', { duration: 3000 });
            }
        });
    }

    revokeAccess(sub: any): void {
        if (confirm('Are you sure you want to revoke this subscription?')) {
            this.http.post<any>(`${config.apiurl3}PremiumAdmin/revokeAccess`, { subscription_id: sub.id })
                .subscribe({
                    next: () => {
                        this.snackBar.open('Access revoked', 'Close', { duration: 3000 });
                        this.loadSubscriptions();
                        this.loadStats();
                    }
                });
        }
    }

    extendAccess(sub: any): void {
        const days = prompt('Enter number of days to extend:', '30');
        if (days && !isNaN(parseInt(days))) {
            this.http.post<any>(`${config.apiurl3}PremiumAdmin/extendAccess`, {
                subscription_id: sub.id,
                additional_days: parseInt(days)
            }).subscribe({
                next: (res) => {
                    this.snackBar.open(res.response_message, 'Close', { duration: 3000 });
                    this.loadSubscriptions();
                }
            });
        }
    }

    viewDetails(sub: any): void {
        alert(`Subscription Details:\n\nUser: ${sub.f_name} ${sub.l_name}\nEmail: ${sub.email}\nPlan: ${sub.plan_name}\nStatus: ${sub.status}\nStart: ${sub.start_date}\nExpiry: ${sub.expiry_date}\nRazorpay Order: ${sub.razorpay_order_id || 'N/A'}\nPayment ID: ${sub.razorpay_payment_id || 'N/A'}`);
    }

    isExpiringSoon(date: string): boolean {
        if (!date) return false;
        const expiry = new Date(date);
        const now = new Date();
        const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays <= 7 && diffDays > 0;
    }

    openGrantForm(): void {
        this.showGrantForm = true;
    }

    closeGrantForm(): void {
        this.showGrantForm = false;
        this.selectedUser = null;
        this.selectedPlan = null;
        this.userSearchText = '';
        this.searchUsers = [];
        this.grantDays = null;
        this.grantNotes = '';
        this.loading = false;
    }
}
