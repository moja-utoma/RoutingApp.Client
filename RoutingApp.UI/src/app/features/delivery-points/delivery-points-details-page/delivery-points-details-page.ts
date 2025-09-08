import { Component, inject } from '@angular/core';
import { Table } from '../../../shared/components/table/table';
import { DeliveryPointDetails, DeliveryPointsService } from '../delivery-points-service';
import { ActivatedRoute } from '@angular/router';
import { Map, MapPoint } from '../../../shared/components/map/map';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-delivery-points-details-page',
  imports: [Map, DecimalPipe],
  templateUrl: './delivery-points-details-page.html',
  styleUrl: './delivery-points-details-page.scss',
})
export class DeliveryPointsDetailsPage {
  private service = inject(DeliveryPointsService);
  private route = inject(ActivatedRoute);

  deliveryPoint?: DeliveryPointDetails;
  pointMarker?: MapPoint;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(id)) {
      this.service.getById(id).subscribe({
        next: (data) => {
          this.deliveryPoint = data;
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
