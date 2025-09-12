import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Table } from '../../../shared/components/table/table';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { RouteDetails, RoutesService } from '../routes-service';
import { ActivatedRoute } from '@angular/router';
import { Map, MapPoint } from '../../../shared/components/map/map';

@Component({
  selector: 'app-routes-details-page',
  imports: [CommonModule, Table, MatCardModule, MatTabsModule, MatProgressSpinnerModule, Map],
  templateUrl: './routes-details-page.html',
  styleUrl: './routes-details-page.scss',
})
export class RoutesDetailsPage {
  private routesService = inject(RoutesService);
  private route = inject(ActivatedRoute);

  routeDetails?: RouteDetails;
  loading = true;
  error?: string;

  warehouseColumns = [
    { key: 'name', label: 'Warehouse Name' },
    { key: 'address', label: 'Address' },
    { key: 'coordinates', label: 'Coordinates' },
    { key: 'vehicleQuantity', label: 'Vehicle Quantity' },
  ];

  deliveryPointColumns = [
    { key: 'name', label: 'Delivery Point Name' },
    { key: 'address', label: 'Address' },
    { key: 'coordinates', label: 'Coordinates' },
    { key: 'weight', label: 'Weight (kg)' },
  ];

  calculating = false;

  calculateRoute(): void {
    if (!this.routeDetails) return;

    this.calculating = true;

    this.routesService.calculateRoute(this.routeDetails.id).subscribe({
      next: (calc) => {
        this.routeDetails!.calculatedRoute = calc;
        //this.mapPoints = this.extractMapPoints(calc.calculation);
        this.calculating = false;
      },
      error: (err) => {
        console.error('Calculation error:', err);
        this.error = 'Failed to calculate route';
        this.calculating = false;
      },
    });
  }

  private extractMapPoints(calculationJson: string): MapPoint[] {
    try {
      const parsed = JSON.parse(calculationJson);
      const clusters = parsed.clusters ?? [];

      const points: MapPoint[] = [];

      for (const cluster of clusters) {
        for (const route of cluster.routes) {
          for (const point of route) {
            points.push({
              lat: point.latitude,
              lng: point.longitude,
              popup: `ID: ${point.id}, Order: ${point.order}`,
            });
          }
        }
      }

      return points;
    } catch (e) {
      console.error('Failed to parse calculation JSON:', e);
      return [];
    }
  }

  get mapPoints(): MapPoint[] {
    if (this.routeDetails?.calculatedRoute?.calculation) {
      return this.extractMapPoints(this.routeDetails.calculatedRoute.calculation);
    }

    const warehousePoints =
      this.routeDetails?.warehouses.map((w) => ({
        lat: w.latitude,
        lng: w.longitude,
        popup: `Warehouse: ${w.name}`,
      })) ?? [];

    const deliveryPoints =
      this.routeDetails?.deliveryPoints.map((dp) => ({
        lat: dp.latitude,
        lng: dp.longitude,
        popup: `Delivery Point: ${dp.name}`,
      })) ?? [];

    return [...warehousePoints, ...deliveryPoints];
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(id)) {
      this.loadRouteDetails(id);
    } else {
      this.error = 'Invalid route ID';
      this.loading = false;
    }
  }

  private loadRouteDetails(id: number): void {
    this.routesService.getById(id).subscribe({
      next: (data) => {
        this.routeDetails = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('API error:', err);
        this.error = 'Failed to load route details';
        this.loading = false;
      },
    });
  }

  // Transform data for table display
  get warehousesForTable() {
    return (
      this.routeDetails?.warehouses.map((w) => ({
        ...w,
        coordinates: `${w.latitude}, ${w.longitude}`,
      })) || []
    );
  }

  get deliveryPointsForTable() {
    return (
      this.routeDetails?.deliveryPoints.map((dp) => ({
        ...dp,
        coordinates: `${dp.latitude}, ${dp.longitude}`,
        weight: `${dp.weight} kg`,
      })) || []
    );
  }

  getTotalWeight(): number {
    return this.routeDetails?.deliveryPoints.reduce((sum, dp) => sum + dp.weight, 0) || 0;
  }
}
