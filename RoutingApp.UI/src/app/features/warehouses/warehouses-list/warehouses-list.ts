import { Component, inject } from '@angular/core';
import { Warehouse, WarehousesService } from '../warehouses-service';
import { Table } from '../../../shared/components/table/table';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-warehouses-list',
  imports: [Table, RouterLink],
  templateUrl: './warehouses-list.html',
  styleUrl: './warehouses-list.scss',
})
export class WarehousesList {
  private service = inject(WarehousesService);
  warehouses: Warehouse[] = [];
  private router = inject(Router);

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

  onEdit = (element: Warehouse) => {
    this.router.navigate(['/warehouses/edit', element.id]);
  };

  onDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this warehouse?')) {
      this.service.delete(id).subscribe({
        next: () => {
          this.warehouses = this.warehouses.filter((w) => w.id !== id);
          console.log('Route deleted:', id);
        },
        error: (err) => console.error('Delete failed:', err),
      });
    }
  };
}
