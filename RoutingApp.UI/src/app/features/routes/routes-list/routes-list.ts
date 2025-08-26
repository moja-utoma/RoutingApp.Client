import { Component, inject } from '@angular/core';
import { Table } from '../../../shared/components/table/table';
import { Route, Routes } from '../routes';

@Component({
  selector: 'app-routes-list',
  imports: [Table],
  templateUrl: './routes-list.html',
  styleUrl: './routes-list.scss',
})
export class RoutesList {
  private routesService = inject(Routes);
  routes: Route[] = [];

  columns = [
    { key: 'name', label: 'Name' },
    {
      key: 'warehouseNames',
      label: 'Warehouses',
      get: (r: Route) => r.warehouseNames.join(', '),
    },
    {
      key: 'deliveryPointsQuantity',
      label: 'Delivery Points',
      get: (r: Route) => r.deliveryPointsQuantity,
    },
  ];

  ngOnInit(): void {
    this.routesService.getAll().subscribe({
      next: (data) => (this.routes = data),
      error: (err) => console.error('API error:', err),
    });
  }
}
