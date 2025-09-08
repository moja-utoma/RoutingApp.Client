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

export interface CreateWarehouse {
  id?: number;
  name: string;
  address: string;
  longitude: number;
  latitude: number;
  vehicleIds?: number[];
}

@Injectable({
  providedIn: 'root',
})
export class WarehousesService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7136/api/Warehouses';

  getAll(): Observable<Warehouse[]> {
    return this.http.get<Warehouse[]>(this.apiUrl);
  }

  getById(id: number): Observable<WarehouseDetails> {
    return this.http.get<WarehouseDetails>(`${this.apiUrl}/${id}`);
  }

  create(data: CreateWarehouse): Observable<Warehouse> {
    return this.http.post<Warehouse>(this.apiUrl, data);
  }

  update(data: CreateWarehouse): Observable<Warehouse> {
    return this.http.put<Warehouse>(this.apiUrl, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
