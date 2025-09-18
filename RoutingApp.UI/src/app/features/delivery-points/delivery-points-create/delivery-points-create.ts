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
    //if (this.editMode) return;

    this.form.patchValue({
      latitude: point.lat,
      longitude: point.lng,
      address: point.popup ?? '',
    });

    this.mapPoints = [point];
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

    this.form
      .get('address')
      ?.valueChanges.pipe(
        filter((value) => value.trim().length > 5),
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((value: string) => {
        this.searchAddress(value.trim());
      });
  }

  searchAddress(query: string) {
    const encoded = encodeURIComponent(query);
    const layer = 'address,poi,manmade'; // 🎯 Focus on addressable and built features
    const featureType = 'settlement'; // 🏙 Filter to inhabited places

    const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encoded}`;

    this.http
      .get<any[]>(url)
      .pipe(
        map((results) => {
          if (!results.length) return null;

          const result = results[0];
          const lat = parseFloat(result.lat);
          const lng = parseFloat(result.lon);
          const addr = result.address ?? {};
          console.log(result);

          const street =
            addr.road || addr.pedestrian || addr.street || addr.residential || addr.footway || '';
          const number = addr.house_number || '';
          const city = addr.city || addr.town || addr.village || addr.suburb || addr.state || '';

          const shortAddress =
            [street, number, city].filter(Boolean).join(', ') || result.display_name;

          return {
            lat,
            lng,
            address: shortAddress,
            fullAddress: result.display_name,
          };
        }),
        catchError((err) => {
          console.error('Address search failed', err);
          return of(null);
        })
      )
      .subscribe((location) => {
        if (!location) return;

        const point: MapPoint = {
          lat: location.lat,
          lng: location.lng,
          popup: location.address,
        };

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
