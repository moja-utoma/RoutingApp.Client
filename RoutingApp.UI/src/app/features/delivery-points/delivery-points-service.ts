import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
  private apiUrl = 'https://localhost:7136/api/DeliveryPoints';

  getAll(): Observable<DeliveryPoint[]> {
    return this.http.get<DeliveryPoint[]>(this.apiUrl);
  }

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
}
