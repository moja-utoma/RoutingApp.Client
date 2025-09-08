import { Component, inject } from '@angular/core';
import { Table } from '../../../shared/components/table/table';
import { Vehicle, VehiclesService } from '../vehicles-service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-vehicles-list',
  imports: [Table, RouterLink],
  templateUrl: './vehicles-list.html',
  styleUrl: './vehicles-list.scss',
})
export class VehiclesList {
  vehicles: Vehicle[] = [];
  private vehiclesService = inject(VehiclesService);
  private router = inject(Router);

  columns: {
    key: keyof Vehicle | string;
    label: string;
    link?: (dp: Vehicle) => string;
    get?: (v: Vehicle) => any;
  }[] = [
    { key: 'name', label: 'Name', link: (dp) => `/vehicles/${dp.id}` },
    { key: 'capacity', label: 'Capacity' },
    {
      key: 'warehouseName',
      label: 'Warehouse Name',
      get: (v: Vehicle) => v.warehouseName ?? 'Unassigned',
    },
    {
      key: 'warehouseAddress',
      label: 'Warehouse Address',
      get: (v: Vehicle) => v.warehouseAddress ?? '-',
    },
  ];

  ngOnInit() {
    this.vehiclesService.getAll().subscribe({
      next: (data) => (this.vehicles = data),
      error: (err) => console.error(err),
    });
  }

  onEdit = (element: Vehicle) => {
    this.router.navigate(['/vehicles/edit', element.id]);
  };

  onDelete = (id: number) => {
    this.vehiclesService.delete(id).subscribe({
      next: () => {
        this.vehicles = this.vehicles.filter((v) => v.id !== id);
        console.log('Deleted:', id);
      },
      error: (err) => console.error('Delete failed:', err),
    });
  };
}
