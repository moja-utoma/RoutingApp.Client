import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateRoute, RoutesService } from '../routes-service';
import { Warehouse, WarehousesService } from '../../warehouses/warehouses-service';
import {
  DeliveryPoint,
  DeliveryPointsService,
} from '../../delivery-points/delivery-points-service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-routes-create',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './routes-create.html',
  styleUrl: './routes-create.scss',
})
export class RoutesCreate {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private routesService = inject(RoutesService);
  private warehousesService = inject(WarehousesService);
  private deliveryPointsService = inject(DeliveryPointsService);

  routeForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    warehouseIds: [[], [Validators.required, Validators.minLength(1)]],
    deliveryPointIds: [[], [Validators.required, Validators.minLength(1)]],
  });

  editMode = false;
  submitting = false;
  currentId?: number;

  warehouses: Warehouse[] = [];
  deliveryPoints: DeliveryPoint[] = [];
  loadingData = true;

  ngOnInit() {
    this.loadFormData();

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.editMode = true;
        this.currentId = +id;
        this.routesService.getById(this.currentId).subscribe((route) => {
          this.routeForm.patchValue({
            name: route.name,
            warehouses: route.warehouses.map((w) => w.id),
            deliveryPoints: route.deliveryPoints.map((dp) => dp.id),
          });
        });
      }
    });
  }

  private loadFormData() {
    Promise.all([
      this.warehousesService.getAll().toPromise(),
      this.deliveryPointsService.getAll().toPromise(),
    ])
      .then(([warehouses, deliveryPoints]) => {
        this.warehouses = Array.isArray(warehouses) ? warehouses ?? [] : warehouses?.items ?? [];
        this.deliveryPoints = Array.isArray(deliveryPoints)
          ? deliveryPoints ?? []
          : deliveryPoints?.items ?? [];
        this.loadingData = false;
      })
      .catch((err) => {
        console.error('Error loading form data:', err);
        alert('Failed to load form data');
        this.loadingData = false;
      });
  }

  onSubmit() {
    if (this.routeForm.invalid) return;

    this.submitting = true;
    const payload: CreateRoute = {
      id: this.currentId ?? 0,
      ...this.routeForm.value,
    };

    const request$ = this.editMode
      ? this.routesService.update(payload)
      : this.routesService.create(payload);

    request$.subscribe({
      next: (saved) => {
        this.router.navigate(['/routes', saved.id], {
          state: {
            message: this.editMode ? 'Route successfully updated!' : 'Route successfully saved!',
          },
        });
      },
      error: (err) => {
        console.error('Failed to save route', err);
        alert('Failed to save route');
      },
      complete: () => {
        this.submitting = false;
      },
    });
  }

  onCancel() {
    this.router.navigate(['/routes']);
  }

  // Getter methods for template
  get nameControl() {
    return this.routeForm.get('name');
  }
  get warehouseIdsControl() {
    return this.routeForm.get('warehouseIds');
  }
  get deliveryPointIdsControl() {
    return this.routeForm.get('deliveryPointIds');
  }
}
