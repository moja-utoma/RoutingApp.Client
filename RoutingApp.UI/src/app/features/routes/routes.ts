import { inject, Injectable } from '@angular/core';
import { Warehouse } from '../warehouses/warehouses';
import { DeliveryPoint } from '../delivery-points/delivery-points';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Route {
  id: number;
  name: string;
  warehouses: Warehouse[];
  deliveryPoints: DeliveryPoint[];
}

@Injectable({
  providedIn: 'root',
})
export class Routes {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7136/api/Routes';

  getAll(): Observable<Route[]> {
    return this.http.get<Route[]>(this.apiUrl);
  }
}
