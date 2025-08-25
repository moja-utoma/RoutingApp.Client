import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Warehouse {
  id: number;
  name: string;
  address: string;
  longitude: number;
  latitude: number;
  vehicleQuantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class Warehouses {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7136/api/Warehouses';

  getAll(): Observable<Warehouse[]> {
    return this.http.get<Warehouse[]>(this.apiUrl);
  }
}
