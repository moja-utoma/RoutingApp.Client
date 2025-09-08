import { inject, Injectable } from '@angular/core';
import { Warehouse } from '../warehouses/warehouses-service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreateVehicle {
  id: number;
  name: string;
  capacity: number;
  warehouseId?: number | null;
}

export interface Vehicle {
  id: number;
  name: string;
  capacity: number;
  warehouseId?: number | null;
  warehouseName?: string | null;
  warehouseAddress?: string | null;
}

export interface VehicleDetails {
  id: number;
  name: string;
  capacity: number;
  warehouse?: Warehouse | null;
}

@Injectable({
  providedIn: 'root',
})
export class VehiclesService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7136/api/Vehicles';

  getAll(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.apiUrl);
  }

  getById(id: number): Observable<VehicleDetails> {
    return this.http.get<VehicleDetails>(`${this.apiUrl}/${id}`);
  }

  create(data: CreateVehicle): Observable<Vehicle> {
    return this.http.post<Vehicle>(this.apiUrl, data);
  }

  update(data: Vehicle): Observable<Vehicle> {
    return this.http.put<Vehicle>(this.apiUrl, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl + `/${id}`);
  }
}
