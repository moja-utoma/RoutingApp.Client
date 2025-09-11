import { Component, inject } from '@angular/core';
import { Warehouse, WarehousesService } from '../warehouses-service';
import { Table } from '../../../shared/components/table/table';
import { Router, RouterLink } from '@angular/router';
import { createDefaultQueryParams, QueryParamsModel } from '../../../shared/models/query-params-model';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-warehouses-list',
  imports: [Table, RouterLink],
  templateUrl: './warehouses-list.html',
  styleUrl: './warehouses-list.scss',
})
export class WarehousesList {
  private service = inject(WarehousesService);
  private router = inject(Router);

  warehouses: Warehouse[] = [];
  totalCount = 0;

  queryParams = createDefaultQueryParams();

  columns: {
    key: keyof Warehouse;
    label: string;
    link?: (warehouse: Warehouse) => string;
  }[] = [
    { key: 'name', label: 'Name', link: (warehouse) => `/warehouses/${warehouse.id}` },
    { key: 'address', label: 'Address' },
    { key: 'vehicleQuantity', label: 'Vehicles' },
  ];

  ngOnInit(): void {
    this.loadPage(this.queryParams);
  }

  loadPage(params: QueryParamsModel): void {
    this.queryParams = { ...params };

    this.service.getAll(this.queryParams).subscribe({
      next: (response) => {
        this.warehouses = response.items;
        this.totalCount = response.totalCount;
      },
      error: (err) => console.error('API error:', err),
    });
  }

  onEdit = (element: Warehouse) => {
    this.router.navigate(['/warehouses/edit', element.id]);
  };

  onDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this warehouse?')) {
      this.service.delete(id).subscribe({
        next: () => {
            this.loadPage(this.queryParams);
        },
        error: (err) => console.error('Delete failed:', err),
      });
    }
  };

  onPageChange(event: PageEvent): void {
    this.loadPage({
      ...this.queryParams,
      page: event.pageIndex + 1,
      pageSize: event.pageSize,
    });
  }

  onSearch(searchString: string): void {
    this.loadPage({ ...this.queryParams, searchString, page: 1 });
  }

  onSort(orderBy: string, isDesc: boolean): void {
    this.loadPage({ ...this.queryParams, orderBy, isDesc, page: 1 });
  }
}
