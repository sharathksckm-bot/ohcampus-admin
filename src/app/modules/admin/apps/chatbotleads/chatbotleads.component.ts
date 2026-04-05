import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { interval, Subscription } from 'rxjs';

interface ChatbotLead {
  remark: string;
  id: number;
  session_id: string;
  name: string;
  phone: string;
  email: string;
  place: string;
  interested_course: string;
  lead_type: string;
  lead_score: number;
  status: string;
  source: string;
  created_at: string;
}

interface LeadStats {
  total: number;
  by_type: { hot: number; warm: number; cold: number };
  today: number;
}

interface Analytics {
  conversion_rate: number;
  avg_messages: number;
  this_week: number;
  weekly_growth: number;
  hot_pending: number;
  by_course: { interested_course: string; count: number }[];
  by_source: { source: string; count: number }[];
}

interface ChatMessage {
  role: string;
  message: string;
  created_at: string;
}

@Component({
  selector: 'app-chatbotleads',
  templateUrl: './chatbotleads.component.html',
  styleUrls: ['./chatbotleads.component.scss']
})
export class ChatbotleadsComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['name', 'contact', 'interest', 'remark', 'lead_type', 'status', 'created_at', 'actions'];
  dataSource: MatTableDataSource<ChatbotLead>;
  leads: ChatbotLead[] = [];
  stats: LeadStats | null = null;
  analytics: Analytics | null = null;
  showAnalytics = false;
  isLoading = true;
  notificationEnabled = true;
  filterLeadType = '';
  filterStatus = '';
  lastCheck: string = new Date().toISOString();
  pollSubscription: Subscription | null = null;

  // Conversation dialog
  showConversationDialog = false;
  selectedLead: ChatbotLead | null = null;
  conversationMessages: ChatMessage[] = [];
  loadingConversation = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private apiUrl = 'https://campusapi.ohcampus.com/apps/Chatbot';

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {
    this.dataSource = new MatTableDataSource<ChatbotLead>([]);
  }

  ngOnInit(): void {
    this.fetchLeads();
    this.fetchStats();
    this.fetchAnalytics();
    this.startPolling();
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

  startPolling(): void {
    this.pollSubscription = interval(30000).subscribe(() => {
      if (this.notificationEnabled) {
        this.checkNewLeads();
      }
    });
  }

  stopPolling(): void {
    if (this.pollSubscription) {
      this.pollSubscription.unsubscribe();
    }
  }

  fetchLeads(): void {
    this.isLoading = true;
    let url = `${this.apiUrl}/getLeads?`;
    if (this.filterLeadType) url += `lead_type=${this.filterLeadType}&`;
    if (this.filterStatus) url += `status=${this.filterStatus}&`;
    
    this.http.get<any>(url).subscribe({
      next: (response) => {
        if (response.response_code === '200') {
          this.leads = response.data.leads || [];
          this.dataSource.data = this.leads;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Error fetching leads', 'Close', { duration: 3000 });
      }
    });
  }

  fetchStats(): void {
    this.http.get<any>(`${this.apiUrl}/getLeadStats`).subscribe({
      next: (response) => {
        if (response.response_code === '200') {
          this.stats = response.data;
        }
      }
    });
  }

  fetchAnalytics(): void {
    this.http.get<any>(`${this.apiUrl}/getAnalytics`).subscribe({
      next: (response) => {
        if (response.response_code === '200') {
          this.analytics = response.data;
        }
      }
    });
  }

  checkNewLeads(): void {
    this.http.get<any>(`${this.apiUrl}/getNewLeadsCount?since=${encodeURIComponent(this.lastCheck)}`).subscribe({
      next: (response) => {
        if (response.response_code === '200' && response.data.count > 0) {
          response.data.leads.forEach((lead: any) => {
            const emoji = lead.lead_type === 'hot' ? '🔥' : lead.lead_type === 'warm' ? '🌡️' : '❄️';
            this.snackBar.open(`New ${lead.lead_type?.toUpperCase()} Lead! ${emoji} - ${lead.interested_course || 'General'}`, 'View', {
              duration: 8000,
              panelClass: ['snack-success']
            }).onAction().subscribe(() => {
              this.fetchLeads();
              this.fetchStats();
            });
          });
          this.lastCheck = response.data.last_check;
          this.fetchLeads();
          this.fetchStats();
        }
      }
    });
  }

  viewConversation(lead: ChatbotLead): void {
    this.selectedLead = lead;
    this.loadingConversation = true;
    this.showConversationDialog = true;
    this.conversationMessages = [];

    this.http.get<any>(`${this.apiUrl}/getConversation?session_id=${lead.session_id}`).subscribe({
      next: (response) => {
        if (response.response_code === '200') {
          this.conversationMessages = response.data.messages || [];
        }
        this.loadingConversation = false;
      },
      error: () => {
        this.loadingConversation = false;
        this.snackBar.open('Failed to load conversation', 'Close', { duration: 3000 });
      }
    });
  }

  closeConversationDialog(): void {
    this.showConversationDialog = false;
    this.selectedLead = null;
    this.conversationMessages = [];
  }

  updateStatus(lead: ChatbotLead, status: string): void {
    this.http.post<any>(`${this.apiUrl}/updateLeadStatus`, { lead_id: lead.id, status }).subscribe({
      next: (response) => {
        if (response.response_code === '200') {
          this.snackBar.open('Status updated', 'Close', { duration: 2000 });
          this.fetchLeads();
          this.fetchStats();
        }
      },
      error: () => {
        this.snackBar.open('Failed to update status', 'Close', { duration: 3000 });
      }
    });
  }

  callLead(lead: ChatbotLead): void {
    if (lead.phone) {
      window.open(`tel:${lead.phone}`, '_self');
      this.updateStatus(lead, 'contacted');
    }
  }

  whatsappLead(lead: ChatbotLead): void {
    if (lead.phone) {
      const phone = lead.phone.replace(/[^0-9]/g, '');
      const message = `Hi ${lead.name || ''},this is OhCampus team regarding your inquiry about ${lead.interested_course || 'college admission'}.`;
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
      this.updateStatus(lead, 'contacted');
    }
  }

  emailLead(lead: ChatbotLead): void {
    if (lead.email) {
      const subject = 'OhCampus - Your College Admission Inquiry';
      const body = `Hi ${lead.name || ''},\n\nThank you for your interest in ${lead.interested_course || 'college admissions'}.\n\nBest regards,\nOhCampus Team`;
      window.open(`mailto:${lead.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
    }
  }

  getLeadTypeClass(type: string): string {
    switch (type) {
      case 'hot': return 'lead-hot';
      case 'warm': return 'lead-warm';
      case 'cold': return 'lead-cold';
      default: return '';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'new': return 'status-new';
      case 'contacted': return 'status-contacted';
      case 'converted': return 'status-converted';
      case 'lost': return 'status-lost';
      default: return 'status-new';
    }
  }

  toggleNotifications(): void {
    this.notificationEnabled = !this.notificationEnabled;
    this.snackBar.open(
      this.notificationEnabled ? 'Notifications enabled' : 'Notifications paused',
      'Close',
      { duration: 2000 }
    );
  }

  toggleAnalytics(): void {
    this.showAnalytics = !this.showAnalytics;
    if (this.showAnalytics) {
      this.fetchAnalytics();
    }
  }

  applyFilter(): void {
    this.fetchLeads();
  }

  clearFilters(): void {
    this.filterLeadType = '';
    this.filterStatus = '';
    this.fetchLeads();
  }

  refresh(): void {
    this.fetchLeads();
    this.fetchStats();
    this.fetchAnalytics();
  }
}
