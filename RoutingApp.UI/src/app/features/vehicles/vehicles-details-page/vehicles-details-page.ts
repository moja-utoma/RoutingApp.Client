import { Component, inject } from '@angular/core';
import { VehicleDetails, VehiclesService } from '../vehicles-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vehicles-details-page',
  imports: [],
  templateUrl: './vehicles-details-page.html',
  styleUrl: './vehicles-details-page.scss',
})
export class VehiclesDetailsPage {
  private service = inject(VehiclesService);
  private route = inject(ActivatedRoute);

  vehicle?: VehicleDetails;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(id)) {
      this.service.getById(id).subscribe({
        next: (data) => {
          this.vehicle = data;
        },
        error: (err) => console.error('API error:', err),
      });
    }
  }
}
