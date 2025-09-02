import { Component, inject } from '@angular/core';
import { Table } from '../../../shared/components/table/table';
import { DeliveryPointDetails, DeliveryPointsService } from '../delivery-points-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-delivery-points-details-page',
  imports: [],
  templateUrl: './delivery-points-details-page.html',
  styleUrl: './delivery-points-details-page.scss',
})
export class DeliveryPointsDetailsPage {
  private service = inject(DeliveryPointsService);
  private route = inject(ActivatedRoute);

  deliveryPoint?: DeliveryPointDetails;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(id)) {
      this.service.getById(id).subscribe({
        next: (data) => (this.deliveryPoint = data),
        error: (err) => console.error('API error:', err),
      });
    }
  }
}
