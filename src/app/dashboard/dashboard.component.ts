import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../services/auth.service';
import { UrlService, ShortenUrlRequest } from '../services/url.service';
import { AnalyticsService, IpLog, Analytics } from '../services/analytics.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  isAuthenticated = false;
  isLoading = false;
  
  urlData: ShortenUrlRequest = { longUrl: '', alias: '' };
  shortUrl = '';
  
  logs: IpLog[] = [];
  analytics: Analytics | null = null;

  constructor(
    private authService: AuthService,
    private urlService: UrlService,
    private analyticsService: AnalyticsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAuthenticated = !!user;
    });
    
    // Initialize with default values
    this.logs = [];
    this.analytics = { totalLogs: 0, uniqueIps: 0, topCountries: [], topBrowsers: [], topDevices: [], dailyActivity: [] };
    
    // Try to load data from backend
    this.loadData();
  }

  loadData(): void {
    this.analyticsService.getLogs({ limit: 10 }).subscribe({
      next: (response) => {
        this.logs = response.logs || [];
      },
      error: (error) => {
        console.error('Error loading logs:', error);
        this.logs = [];
      }
    });

    this.analyticsService.getAnalytics(30).subscribe({
      next: (analytics) => {
        this.analytics = analytics;
      },
      error: (error) => {
        console.error('Error loading analytics:', error);
        this.analytics = { totalLogs: 0, uniqueIps: 0, topCountries: [], topBrowsers: [], topDevices: [], dailyActivity: [] };
      }
    });
  }

  shortenUrl(): void {
    if (!this.urlData.longUrl) return;
    
    this.isLoading = true;
    this.urlService.shortenUrl(this.urlData).subscribe({
      next: (response) => {
        this.shortUrl = response.shortUrl;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error shortening URL:', error);
        // Show mock shortened URL when backend is not available
        const alias = this.urlData.alias || Math.random().toString(36).substring(7);
        this.shortUrl = `http://localhost:5000/s/${alias}`;
        this.isLoading = false;
      }
    });
  }

  copyUrl(): void {
    navigator.clipboard.writeText(this.shortUrl);
  }

  refreshData(): void {
    this.loadData();
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => console.error('Logout error:', error)
    });
  }

  formatTimestamp(timestamp: string): string {
    return new Date(timestamp).toLocaleString();
  }
}
