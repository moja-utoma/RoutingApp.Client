import { Component, inject } from '@angular/core';
import { Table } from '../../../shared/components/table/table';
import { Route, Routes } from '../routes';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-routes-list',
  imports: [Table, RouterLink],
  templateUrl: './routes-list.html',
  styleUrl: './routes-list.scss',
})
export class RoutesList {
  private routesService = inject(Routes);
  private router = inject(Router);
  routes: Route[] = [];

  columns: {
    key: keyof Route;
    label: string;
    link?: (dp: Route) => string;
    get?: (item: Route) => any;
  }[] = [
    { key: 'name', label: 'Name', link: (r) => `/routes/${r.id}` },
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

  onEdit = (element: Route) => {
    this.router.navigate(['/routes/edit', element.id]);
  };

  onDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this route?')) {
      this.routesService.delete(id).subscribe({
        next: () => {
          this.routes = this.routes.filter((route) => route.id !== id);
          console.log('Route deleted:', id);
        },
        error: (err) => console.error('Delete failed:', err),
      });
    }
  };
}
