import { Component, inject } from '@angular/core';
import { Warehouse, Warehouses } from '../warehouses';
import { Table } from '../../../shared/components/table/table';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-warehouses-list',
  imports: [Table],
  templateUrl: './warehouses-list.html',
  styleUrl: './warehouses-list.scss',
})
export class WarehousesList {
  private service = inject(Warehouses);
  private dialog = inject(MatDialog);
  warehouses: Warehouse[] = [];

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
    setTimeout(() => {
      this.service.getAll().subscribe({
        next: (data) => (this.warehouses = data),
        error: (err) => console.error('API error:', err),
      });
    }, 0);
  }
}
