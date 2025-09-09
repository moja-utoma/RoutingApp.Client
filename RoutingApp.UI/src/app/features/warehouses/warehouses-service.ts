import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Vehicle } from '../vehicles/vehicles-service';
import { QueryParamsModel } from '../../shared/models/query-params-model';
import { PaginatedResponse } from '../delivery-points/delivery-points-service';

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

  getAll(params?: QueryParamsModel): Observable<PaginatedResponse<Warehouse>> {
    let parsed = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          parsed = parsed.set(key, value.toString());
        }
      });
    }
    return this.http.get<PaginatedResponse<Warehouse>>(this.apiUrl, { params: parsed });
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
