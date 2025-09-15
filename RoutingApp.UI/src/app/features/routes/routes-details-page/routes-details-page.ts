import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';

import { Table } from '../../../shared/components/table/table';
import { MapView, MapPoint } from '../../../shared/components/map-view/map-view';
import { RouteDetails, RoutesService } from '../routes-service';

@Component({
  selector: 'app-routes-details-page',
  standalone: true,
  imports: [CommonModule, Table, MatCardModule, MatTabsModule, MatProgressSpinnerModule, MapView],
  templateUrl: './routes-details-page.html',
  styleUrl: './routes-details-page.scss',
})
export class RoutesDetailsPage {
  private routesService = inject(RoutesService);
  private route = inject(ActivatedRoute);

  routeDetails?: RouteDetails;
  loading = true;
  error?: string;
  calculating = false;

  private _mapPoints: MapPoint[] = [];

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

  get mapPoints(): MapPoint[] {
    return this._mapPoints;
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
        if (data.calculatedRoute?.calculation) {
          this._mapPoints = this.extractMapPoints(data.calculatedRoute.calculation);
        } else {
          this._mapPoints = this.extractInitialMapPoints(data);
        }
        this.loading = false;
        console.log('mapPoints', this.mapPoints);
      },
      error: (err) => {
        console.error('API error:', err);
        this.error = 'Failed to load route details';
        this.loading = false;
      },
    });
  }

  calculateRoute(): void {
    if (!this.routeDetails) return;

    this.calculating = true;

    this.routesService.calculateRoute(this.routeDetails.id).subscribe({
      next: (calc) => {
        this.routeDetails!.calculatedRoute = calc;
        this._mapPoints = this.extractMapPoints(calc.calculation);
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
    const points: MapPoint[] = [];

    try {
      const parsed = JSON.parse(calculationJson);
      const clusters = parsed.clusters ?? [];

      const assignedDeliveryIds = new Set<number>();
      const usedWarehouseIds = new Set<number>();

      let routeGroupIndex = 0;

      clusters.forEach((cluster: { warehouse_id: any; routes: any[][]; }) => {
        const warehouseId = cluster.warehouse_id;
        usedWarehouseIds.add(warehouseId);

        const warehouse = this.routeDetails?.warehouses.find((w) => w.id === warehouseId);
        if (!warehouse) return;

        cluster.routes.forEach((route: any[], routeIndex: number) => {
          // Add warehouse as start point
          points.push({
            lat: warehouse.latitude,
            lng: warehouse.longitude,
            popup: `Warehouse: ${warehouse.name}`,
            group: routeGroupIndex,
            isConnected: true,
            order: 0,
            isWarehouse: true,
          });

          // Add delivery points
          route.forEach((point: any, i: number) => {
            assignedDeliveryIds.add(Number(point.id));
            points.push({
              lat: point.latitude,
              lng: point.longitude,
              popup: `Delivery ID: ${point.id}, Order: ${point.order}`,
              group: routeGroupIndex,
              isConnected: true,
              order: point.order,
              isWarehouse: false,
            });
          });

          // Add warehouse as end point
          points.push({
            lat: warehouse.latitude,
            lng: warehouse.longitude,
            popup: `Warehouse: ${warehouse.name} (Return)`,
            group: routeGroupIndex,
            isConnected: true,
            order: route.length + 1,
            isWarehouse: true,
          });

          routeGroupIndex++;
        });
      });

      // Add unassigned delivery points
      const allDeliveryPoints = this.routeDetails?.deliveryPoints ?? [];
      allDeliveryPoints.forEach((dp) => {
        if (!assignedDeliveryIds.has(dp.id)) {
          points.push({
            lat: dp.latitude,
            lng: dp.longitude,
            popup: `Unassigned Delivery: ${dp.name}`,
            isConnected: false,
            isWarehouse: false,
          });
        }
      });

      // Add unused warehouses
      const allWarehouses = this.routeDetails?.warehouses ?? [];
      allWarehouses.forEach((w) => {
        if (!usedWarehouseIds.has(w.id)) {
          points.push({
            lat: w.latitude,
            lng: w.longitude,
            popup: `Unused Warehouse: ${w.name}`,
            isConnected: false,
            isWarehouse: true,
          });
        }
      });

      return points;
    } catch (e) {
      console.error('Failed to parse calculation JSON:', e);
      return [];
    }
  }

  private extractInitialMapPoints(data: RouteDetails): MapPoint[] {
    const points: MapPoint[] = [];

    // Add warehouses
    for (const w of data.warehouses ?? []) {
      points.push({
        lat: w.latitude,
        lng: w.longitude,
        popup: `Warehouse: ${w.name}`,
        isWarehouse: true,
        isConnected: false,
      });
    }

    // Add delivery points
    for (const dp of data.deliveryPoints ?? []) {
      points.push({
        lat: dp.latitude,
        lng: dp.longitude,
        popup: `Delivery Point: ${dp.name}`,
        isWarehouse: false,
        isConnected: false,
      });
    }

    return points;
  }

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
