import { Component, inject } from '@angular/core';
import { Warehouse, Warehouses } from '../warehouses';
import { Table } from '../../../shared/components/table/table';

@Component({
  selector: 'app-warehouses-list',
  imports: [Table],
  templateUrl: './warehouses-list.html',
  styleUrl: './warehouses-list.scss',
})
export class WarehousesList {
  private service = inject(Warehouses);
  warehouses: Warehouse[] = [];

  columns: { key: keyof Warehouse; label: string }[] = [
    { key: 'name', label: 'Name' },
    { key: 'address', label: 'Address' },
    { key: 'vehicleQuantity', label: 'Vehicles' },
  ];

  ngOnInit(): void {
    setTimeout(() => {
      this.service.getAll().subscribe({
        next: (data) => (this.warehouses = data),
        error: (err) => console.error('API error:', err),
      });
    }, 2000);
  }

}
