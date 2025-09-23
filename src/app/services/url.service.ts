import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../env/env';

export interface ShortenUrlRequest {
  longUrl: string;
  alias?: string;
}

export interface ShortenUrlResponse {
  shortUrl: string;
  alias: string;
  longUrl: string;
}

export interface UrlAnalytics {
  totalClicks: number;
  uniqueClicks: number;
  countries: { [key: string]: number };
  browsers: { [key: string]: number };
  devices: { [key: string]: number };
  dailyClicks: { date: string; clicks: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class UrlService {
  constructor(private http: HttpClient) {}

  shortenUrl(data: ShortenUrlRequest): Observable<ShortenUrlResponse> {
    return this.http.post<ShortenUrlResponse>(`${environment.apiUrl}/api/shorten`, data);
  }

  getUrlAnalytics(alias: string): Observable<UrlAnalytics> {
    return this.http.get<UrlAnalytics>(`${environment.apiUrl}/api/iplogger/url/${alias}`);
  }
}