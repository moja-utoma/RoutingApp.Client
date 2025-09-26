import { inject, Injectable } from '@angular/core';
import { Warehouse } from '../warehouses/warehouses-service';
import { DeliveryPoint } from '../delivery-points/delivery-points-service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { envAuth0, environment } from '../../../environments/environment';
import { AuthService } from '@auth0/auth0-angular';

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

export interface CalculatedRoute {
  id: number;
  routeId: number;
  calculation: string;
  createdAt: string; // ISO date string from backend
}

export interface RouteDetails {
  id: number;
  name: string;
  warehouses: WarehouseDetails[];
  deliveryPoints: DeliveryPointDetails[];
  calculatedRoute: CalculatedRoute | null;
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

  constructor(private auth: AuthService) {}

  streamRoute(body: {
    coordinates: [number, number][];
    radiuses: number[];
  }): Observable<{ lat: number; lng: number }> {
    const url = `https://localhost:7136/api/Ors/stream`;

    return new Observable((observer) => {
      this.auth
        .getAccessTokenSilently({
          authorizationParams: {
            audience: envAuth0.audience,
            scope: 'read:current_user',
          },
        })
        .subscribe({
          next: (token) => {
            fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // ✅ Injected here
              },
              body: JSON.stringify(body),
            })
              .then((response) => {
                const reader = response.body?.getReader();
                const decoder = new TextDecoder('utf-8');
                let buffer = '';

                function read() {
                  reader?.read().then(({ done, value }) => {
                    if (done) {
                      observer.complete();
                      return;
                    }

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n\n');
                    buffer = lines.pop() ?? '';

                    for (const line of lines) {
                      if (line.startsWith('data:')) {
                        try {
                          const json = JSON.parse(line.slice(5).trim());
                          observer.next(json);
                        } catch (e) {
                          console.warn('Failed to parse SSE line:', line);
                        }
                      }
                    }

                    read();
                  });
                }

                read();
              })
              .catch((err) => observer.error(err));
          },
          error: (err) => observer.error(err),
        });
    });
  }

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

  calculateRoute(id: number): Observable<CalculatedRoute> {
    return this.http.post<CalculatedRoute>(`${this.apiUrl}/Calculate/${id}`, {});
  }
}
