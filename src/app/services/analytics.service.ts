import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../env/env';

export interface IpLog {
  id: string;
  ip: string;
  country: string;
  city: string;
  browser: string;
  os: string;
  device: string;
  timestamp: string;
  userAgent: string;
}

export interface Analytics {
  totalLogs: number;
  uniqueIps: number;
  topCountries: { country: string; count: number }[];
  topBrowsers: { browser: string; count: number }[];
  topDevices: { device: string; count: number }[];
  dailyActivity: { date: string; count: number }[];
}

export interface LogFilters {
  page?: number;
  limit?: number;
  country?: string;
  browser?: string;
  startDate?: string;
  endDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  constructor(private http: HttpClient) {}

  getLogs(filters: LogFilters = {}): Observable<{ logs: IpLog[]; total: number }> {
    let params = new HttpParams();
    Object.keys(filters).forEach(key => {
      const value = (filters as any)[key];
      if (value) params = params.set(key, value.toString());
    });
    
    return this.http.get<{ logs: IpLog[]; total: number }>(`${environment.apiUrl}/api/iplogger/logs`, { params });
  }

  getAnalytics(days: number = 30): Observable<Analytics> {
    return this.http.get<Analytics>(`${environment.apiUrl}/api/iplogger/analytics?days=${days}`);
  }

  getIpAnalysis(ip: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/iplogger/ip/${ip}`);
  }

  deleteLogs(data: { olderThan?: string; ip?: string }): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/api/iplogger/logs`, { body: data });
  }
}