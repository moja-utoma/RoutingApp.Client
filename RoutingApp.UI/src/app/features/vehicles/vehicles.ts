import { inject, Injectable } from '@angular/core';
import { Warehouse } from '../warehouses/warehouses';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Vehicle {
  id: number;
  name: string;
  capacity: number;
  warehouse?: Warehouse | null;
}

@Injectable({
  providedIn: 'root',
})
export class Vehicles {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7136/api/Vehicles';

  getAll(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.apiUrl);
  }
}
