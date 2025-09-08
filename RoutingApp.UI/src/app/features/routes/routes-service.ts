import { inject, Injectable } from '@angular/core';
import { Warehouse } from '../warehouses/warehouses';
import { DeliveryPoint } from '../delivery-points/delivery-points-service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Route {
  id: number;
  name: string;
  warehouseNames: string[];
  deliveryPointsQuantity: number;
}

export interface PointDetails {
  id: number;
  name: string;
  address: string;
  longitude: number;
  latitude: number;
}

export interface WarehouseDetails extends PointDetails {
  vehicleQuantity: number;
}

export interface DeliveryPointDetails extends PointDetails {
  weight: number;
}

export interface RouteDetails {
  id: number;
  name: string;
  warehouses: WarehouseDetails[];
  deliveryPoints: DeliveryPointDetails[];
}

export interface CreateRoute {
  id: number;
  name: string;
  warehouses: number[];
  deliveryPoints: number[];
}

@Injectable({
  providedIn: 'root',
})
export class RoutesService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7136/api/Routes';

  getAll(): Observable<Route[]> {
    return this.http.get<Route[]>(this.apiUrl);
  }

  getById(id: number): Observable<RouteDetails> {
    return this.http.get<RouteDetails>(`${this.apiUrl}/${id}`);
  }

  create(data: CreateRoute): Observable<Route> {
    return this.http.post<Route>(this.apiUrl, data);
  }

  update(data: CreateRoute): Observable<Route> {
    return this.http.put<Route>(this.apiUrl, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
