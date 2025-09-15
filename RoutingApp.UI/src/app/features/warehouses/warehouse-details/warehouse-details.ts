import { Component, inject } from '@angular/core';
import { WarehouseDetails, WarehousesService } from '../warehouses-service';
import { ActivatedRoute } from '@angular/router';
import { Table } from '../../../shared/components/table/table';
import { MapView, MapPoint } from '../../../shared/components/map-view/map-view';

@Component({
  selector: 'app-warehouse-details',
  imports: [Table, MapView],
  templateUrl: './warehouse-details.html',
  styleUrl: './warehouse-details.scss',
})
export class WarehouseDetailsPage {
  private warehouseService = inject(WarehousesService);
  private route = inject(ActivatedRoute);

  pointMarker?: MapPoint;
  warehouse?: WarehouseDetails;
  vehicleColumns = [
    { key: 'name', label: 'Vehicle Name' },
    { key: 'capacity', label: 'Capacity' },
  ];

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(id)) {
      this.warehouseService.getById(id).subscribe({
        next: (data) => {
          this.warehouse = data;
          this.pointMarker = {
            lat: data.latitude,
            lng: data.longitude,
            popup: data.name,
          };
        },
        error: (err) => console.error('API error:', err),
      });
    }
  }
}
