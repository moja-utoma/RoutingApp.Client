import { Component, inject } from '@angular/core';
import { Table } from '../../../shared/components/table/table';
import { Vehicle, Vehicles } from '../vehicles';

@Component({
  selector: 'app-vehicles-list',
  imports: [Table],
  templateUrl: './vehicles-list.html',
  styleUrl: './vehicles-list.scss',
})
export class VehiclesList {
  vehicles: Vehicle[] = [];
  private vehiclesService = inject(Vehicles);

  columns: { key: keyof Vehicle | string; label: string; get?: (v: Vehicle) => any }[] = [
    { key: 'name', label: 'Name' },
    { key: 'capacity', label: 'Capacity' },
    {
      key: 'warehouse',
      label: 'Warehouse Name',
      get: (v: Vehicle) => v.warehouse?.name ?? 'Unassigned',
    },
    {
      key: 'vehicleQuantity',
      label: 'Warehouse Vehicles',
      get: (v: Vehicle) => v.warehouse?.vehicleQuantity ?? 0,
    },
  ];
  
  ngOnInit() {
    this.vehiclesService.getAll().subscribe({
      next: (data) => (this.vehicles = data),
      error: (err) => console.error(err),
    });
  }
}
