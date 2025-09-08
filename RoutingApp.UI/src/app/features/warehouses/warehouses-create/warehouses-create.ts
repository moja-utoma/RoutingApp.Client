import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RoutesService } from '../../routes/routes-service';
import { Vehicle, VehiclesService } from '../../vehicles/vehicles-service';
import { CreateWarehouse, Warehouse, WarehousesService } from '../warehouses-service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-warehouses-create',
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatSelectModule],
  templateUrl: './warehouses-create.html',
  styleUrl: './warehouses-create.scss',
})
export class WarehousesCreate {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private service = inject(WarehousesService);
  private vehiclesService = inject(VehiclesService);

  routeForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    address: ['', Validators.required],
    longitude: [null, Validators.required],
    latitude: [null, Validators.required],
    vehicleIds: [],
  });

  submitting = false;
  editMode = false;
  currentId?: number;

  vehicles: Vehicle[] = [];
  loadingVehicles = true;

  ngOnInit() {
    this.loadVehicles();

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.editMode = true;
        this.currentId = +id;

        this.service.getById(this.currentId).subscribe((w) => {
          this.routeForm.patchValue(w);
        });
      }
    });
  }

  private loadVehicles() {
    this.vehiclesService.getAll().subscribe({
      next: (data) => {
        this.vehicles = data;
        this.loadingVehicles = false;
      },
      error: (err) => {
        console.error('Failed to load vehicles', err);
        this.loadingVehicles = false;
      },
    });
  }

  onSubmit() {
    if (this.routeForm.invalid) return;
    this.submitting = true;

    const payload: CreateWarehouse = {
      id: this.currentId ?? 0,
      ...this.routeForm.value,
      longitude: Number(this.routeForm.value.longitude),
      latitude: Number(this.routeForm.value.latitude),
      weight: Number(this.routeForm.value.weight),
    };

    const request$ = this.editMode ? this.service.update(payload) : this.service.create(payload);

    request$.subscribe({
      next: (saved: Warehouse) => {
        this.router.navigate(['/warehouses', saved.id], {
          state: {
            message: this.editMode
              ? 'Warehouse successfully updated!'
              : 'Warehouse successfully saved!',
          },
        });
      },
      error: (err) => {
        console.error('Failed to save warehouse', err);
        alert('Failed to save warehouse');
      },
      complete: () => {
        this.submitting = false;
      },
    });
  }

  onCancel() {
    this.router.navigate(['/warehouses']);
  }

  get vehicleIdsControl() {
    return this.routeForm.get('vehicleIds');
  }
}
