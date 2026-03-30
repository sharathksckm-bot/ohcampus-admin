import { Component, OnInit } from '@angular/core';
import { CampusService } from 'app/modules/service/campus.service';

interface LeadAnalytics {
  totalLeads: number;
  todayLeads: number;
  weekLeads: number;
  monthLeads: number;
  conversionRate: number;
  avgResponseTime: string;
  sourceBreakdown: { source: string; count: number; percentage: number }[];
  statusBreakdown: { status: string; count: number; percentage: number }[];
  dailyTrend: { date: string; count: number }[];
  topPerformingTimes: { time: string; count: number }[];
}

@Component({
  selector: 'app-lead-analytics',
  templateUrl: './lead-analytics.component.html',
  styleUrls: ['./lead-analytics.component.scss']
})
export class LeadAnalyticsComponent implements OnInit {

  loading: boolean = true;
  analytics: LeadAnalytics = {
    totalLeads: 0,
    todayLeads: 0,
    weekLeads: 0,
    monthLeads: 0,
    conversionRate: 0,
    avgResponseTime: '-',
    sourceBreakdown: [],
    statusBreakdown: [],
    dailyTrend: [],
    topPerformingTimes: []
  };

  // Date range filter
  dateRange: string = 'week';
  
  // Colors matching OHCampus brand
  brandColors = {
    primary: '#1a73e8',
    primaryDark: '#0d47a1',
    secondary: '#ff6f00',
    success: '#00c853',
    warning: '#ffc107',
    danger: '#f44336',
    info: '#2196f3',
    gray: '#64748b'
  };

  constructor(private campusService: CampusService) { }

  ngOnInit() {
    this.loadAnalytics();
  }

  loadAnalytics() {
    this.loading = true;
    this.campusService.getLeadAnalytics(this.dateRange).subscribe({
      next: (data: any) => {
        this.loading = false;
        if (data && data.response_code === 1) {
          this.analytics = data.data;
        }
      },
      error: (error: any) => {
        this.loading = false;
        console.error('Failed to load analytics', error);
      }
    });
  }

  onDateRangeChange(range: string) {
    this.dateRange = range;
    this.loadAnalytics();
  }

  formatSourceLabel(source: string): string {
    const sourceMap: { [key: string]: string } = {
      'website_management': 'Management Quota',
      'website_featured': 'Featured Packages',
      'website_scholarship': 'Scholarship',
      'website_callback': 'Callback Request',
      'website_chat': 'Chat with Expert',
      'mobile_app': 'Mobile App',
      'whatsapp': 'WhatsApp'
    };
    return sourceMap[source] || this.capitalizeFirst(source ? source.replace(/_/g, ' ') : 'Unknown');
  }

  capitalizeFirst(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'pending': this.brandColors.warning,
      'contacted': this.brandColors.info,
      'completed': this.brandColors.success,
      'cancelled': this.brandColors.danger
    };
    return colors[status] || this.brandColors.gray;
  }

  getMaxCount(): number {
    if (!this.analytics.sourceBreakdown || this.analytics.sourceBreakdown.length === 0) return 1;
    return Math.max(...this.analytics.sourceBreakdown.map(s => s.count));
  }

  exportAnalytics() {
    // Simple CSV export
    let csv = 'Metric,Value\n';
    csv += 'Total Leads,' + this.analytics.totalLeads + '\n';
    csv += 'Today,' + this.analytics.todayLeads + '\n';
    csv += 'This Week,' + this.analytics.weekLeads + '\n';
    csv += 'This Month,' + this.analytics.monthLeads + '\n';
    csv += 'Conversion Rate,' + this.analytics.conversionRate + '%\n';
    csv += '\nSource Breakdown\n';
    csv += 'Source,Count,Percentage\n';
    this.analytics.sourceBreakdown.forEach(s => {
      csv += this.formatSourceLabel(s.source) + ',' + s.count + ',' + s.percentage + '%\n';
    });
    csv += '\nStatus Breakdown\n';
    csv += 'Status,Count,Percentage\n';
    this.analytics.statusBreakdown.forEach(s => {
      csv += this.capitalizeFirst(s.status) + ',' + s.count + ',' + s.percentage + '%\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lead-analytics-' + new Date().toISOString().split('T')[0] + '.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
