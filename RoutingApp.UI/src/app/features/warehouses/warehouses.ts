import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Vehicle } from '../vehicles/vehicles-service';

export interface Warehouse {
  id: number;
  name: string;
  address: string;
  longitude: number;
  latitude: number;
  vehicleQuantity: number;
}

export interface WarehouseDetails {
  id: number;
  name: string;
  address: string;
  longitude: number;
  latitude: number;
  vehicles: Vehicle[];
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

  getById(id: number): Observable<WarehouseDetails> {
    return this.http.get<WarehouseDetails>(`${this.apiUrl}/${id}`);
  }
}
