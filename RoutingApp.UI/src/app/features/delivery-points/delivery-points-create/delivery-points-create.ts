import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DeliveryPoint, DeliveryPointsService } from '../delivery-points-service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MapPoint, MapView } from '../../../shared/components/map-view/map-view';
import { catchError, debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

@Component({
  selector: 'app-delivery-points-create',
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MapView],
  templateUrl: './delivery-points-create.html',
  styleUrl: './delivery-points-create.scss',
})
export class DeliveryPointsCreate {
  private fb = inject(FormBuilder);
  private deliveryService = inject(DeliveryPointsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private http = inject(HttpClient);

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    address: ['', Validators.required],
    longitude: [null, Validators.required],
    latitude: [null, Validators.required],
    weight: [null, Validators.required],
  });

  submitting = false;
  editMode = false;
  currentId?: number;

  mapPoints: MapPoint[] = [];

  onMapClick(point: MapPoint): void {
  this.form.patchValue({
    latitude: point.lat,
    longitude: point.lng,
    address: point.popup ?? '', // still stores short address internally
  });

  // Ensure popup always shows full address
  this.mapPoints = [{
    lat: point.lat,
    lng: point.lng,
    popup: point.popup, // already fullAddress from searchAddress
  }];
}


  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.editMode = true;
        this.currentId = +id;

        this.deliveryService.getById(this.currentId).subscribe((dp) => {
          this.form.patchValue(dp);
          this.mapPoints = [
            {
              lat: dp.latitude,
              lng: dp.longitude,
              popup: dp.address,
              isWarehouse: false,
            },
          ];
        });
      }
    });
  }

  onSearchClick(): void {
    const query = this.form.get('address')?.value?.trim();
    if (!query || query.length < 5) {
      alert('Please enter a valid address');
      return;
    }

    this.searchAddress(query);
  }

  searchAddress(query: string) {
    this.deliveryService
      .searchAddress(query)
      .pipe(
        catchError((err) => {
          console.error('Address search failed', err);
          return of(null);
        })
      )
      .subscribe((location) => {
        if (!location) return;

        console.log(location);

        const point: MapPoint = {
          lat: location.lat,
          lng: location.lng,
          popup: location.fullAddress,
        };
        console.log('point', point);

        this.mapPoints = [point];

        this.form.patchValue({
          latitude: location.lat,
          longitude: location.lng,
          address: location.address,
        });
      });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.submitting = true;

    const payload: DeliveryPoint = {
      id: this.currentId ?? 0,
      ...this.form.value,
      longitude: Number(this.form.value.longitude),
      latitude: Number(this.form.value.latitude),
      weight: Number(this.form.value.weight),
    };

    const request$ = this.editMode
      ? this.deliveryService.update(payload)
      : this.deliveryService.create(payload);

    request$.subscribe({
      next: (saved: DeliveryPoint) => {
        this.router.navigate(['/delivery-points', saved.id], {
          state: {
            message: this.editMode
              ? 'Delivery point successfully updated!'
              : 'Delivery point successfully saved!',
          },
        });
      },
      error: (err) => {
        console.error('Failed to save delivery point', err);
        alert('Failed to save delivery point');
      },
      complete: () => {
        this.submitting = false;
      },
    });
  }
}
