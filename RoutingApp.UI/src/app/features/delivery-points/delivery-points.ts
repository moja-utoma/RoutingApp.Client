import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface DeliveryPoint {
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
export class DeliveryPoints {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7136/api/DeliveryPoints';

  getAll(): Observable<DeliveryPoint[]> {
    return this.http.get<DeliveryPoint[]>(this.apiUrl);
  }
}
