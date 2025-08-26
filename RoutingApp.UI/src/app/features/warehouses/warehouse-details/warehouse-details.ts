import { Component, inject } from '@angular/core';
import { WarehouseDetails, Warehouses } from '../warehouses';
import { ActivatedRoute } from '@angular/router';
import { Table } from '../../../shared/components/table/table';

@Component({
  selector: 'app-warehouse-details',
  imports: [Table],
  templateUrl: './warehouse-details.html',
  styleUrl: './warehouse-details.scss',
})
export class WarehouseDetailsPage {
  private warehouseService = inject(Warehouses);
  private route = inject(ActivatedRoute);

  warehouse?: WarehouseDetails;
  vehicleColumns = [
    { key: 'name', label: 'Vehicle Name' },
    { key: 'capacity', label: 'Capacity' },
  ];

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(id)) {
      this.warehouseService.getById(id).subscribe({
        next: (data) => (this.warehouse = data),
        error: (err) => console.error('API error:', err),
      });
    }
  }
}
