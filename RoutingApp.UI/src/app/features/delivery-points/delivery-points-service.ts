import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { from, map, Observable, switchMap, tap } from 'rxjs';
import { PaginatedResponse, QueryParamsModel } from '../../shared/models/request-respone-models';
import { environment } from '../../../environments/environment';
import { MsalService } from '@azure/msal-angular';

export interface CreateDeliveryPoint {
  id: number;
  name: string;
  address: string;
  longitude: number;
  latitude: number;
  weight: number;
}

export interface DeliveryPoint {
  id: number;
  name: string;
  address: string;
  longitude: number;
  latitude: number;
  weight: number;
}

export interface DeliveryPointDetails {
  id: number;
  name: string;
  address: string;
  longitude: number;
  latitude: number;
  weight: number;
}

@Injectable({
  providedIn: 'root',
})
export class DeliveryPointsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api.baseUrl}/api/DeliveryPoints`;

  constructor(private msalService: MsalService) {}

  getAll(params?: QueryParamsModel): Observable<PaginatedResponse<DeliveryPoint>> {
    // Step 1: Acquire token silently
    const account = this.msalService.instance.getActiveAccount();
    if (!account) {
      throw new Error('No active MSAL account. User must log in first.');
    }

    return from(
      this.msalService.acquireTokenSilent({
        scopes: [environment.api.scope],
        account: account,
      })
    ).pipe(
      switchMap((res) => {
        // Step 2: Build query params
        let parsed = new HttpParams();
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              parsed = parsed.set(key, value.toString());
            }
          });
        }

        // Step 3: Make the actual HTTP request with Authorization header
        return this.http.get<PaginatedResponse<DeliveryPoint>>(this.apiUrl, {
          params: parsed,
          headers: { Authorization: `Bearer ${res.accessToken}` },
        });
      })
    );
  }

  // getAll(params?: QueryParamsModel): Observable<PaginatedResponse<DeliveryPoint>> {
  //   let parsed = new HttpParams();
  //   if (params) {
  //     Object.entries(params).forEach(([key, value]) => {
  //       if (value !== undefined && value !== null) {
  //         parsed = parsed.set(key, value.toString());
  //       }
  //     });
  //   }

  //   return this.http.get<PaginatedResponse<DeliveryPoint>>(this.apiUrl, { params: parsed });
  // }

  getById(id: number): Observable<DeliveryPointDetails> {
    return this.http.get<DeliveryPointDetails>(`${this.apiUrl}/${id}`);
  }

  create(data: CreateDeliveryPoint): Observable<DeliveryPoint> {
    return this.http.post<DeliveryPoint>(this.apiUrl, data);
  }

  update(data: DeliveryPoint): Observable<DeliveryPoint> {
    return this.http.put<DeliveryPoint>(this.apiUrl, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl + `/${id}`);
  }

  searchAddress(
    query: string
  ): Observable<{ lat: number; lng: number; address: string; fullAddress: string }> {
    const encoded = encodeURIComponent(query);
    const url = `${environment.api.baseUrl}/api/Ors/search?text=${encoded}`;
    return this.http.get<any>(url).pipe(
      map((res) => ({
        lat: res.latitude,
        lng: res.longitude,
        address: res.address,
        fullAddress: res.fullAddress,
      }))
    );
  }
}
