import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateVehicle, VehiclesService } from '../vehicles-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Warehouse, WarehousesService } from '../../warehouses/warehouses-service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-vehicles-create',
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatSelectModule],
  templateUrl: './vehicles-create.html',
  styleUrl: './vehicles-create.scss',
})
export class VehiclesCreate {
  private fb = inject(FormBuilder);
  private service = inject(VehiclesService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private warehousesService = inject(WarehousesService);

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    capacity: [null, Validators.required, Validators.min(0.1)],
    warehouseId: [null],
  });

  submitting = false;
  editMode = false;
  currentId?: number;

  warehouses: Warehouse[] = [];
  loadingWarehouses = true;

  ngOnInit() {
    this.loadWarehouses();

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.editMode = true;
        this.currentId = +id;

        this.service.getById(this.currentId).subscribe((v) => {
          this.form.patchValue(v);
        });
      }
    });
  }

  private loadWarehouses() {
    this.warehousesService.getAll().subscribe({
      next: (data) => {
        this.warehouses = data;
        this.loadingWarehouses = false;
      },
      error: (err) => {
        console.error('Failed to load warehouses', err);
        this.loadingWarehouses = false;
      },
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.submitting = true;
    const payload: CreateVehicle = {
      id: this.currentId ?? 0,
      ...this.form.value,
    };

    const request$ = this.editMode ? this.service.update(payload) : this.service.create(payload);

    request$.subscribe({
      next: (saved) => {
        this.router.navigate(['/vehicles', saved.id], {
          state: {
            message: this.editMode ? 'Vehicle updated!' : 'Vehicle created!',
          },
        });
      },
      error: (err) => {
        console.error('Failed to save vehicle', err);
        alert('Failed to save vehicle');
      },
      complete: () => {
        this.submitting = false;
      },
    });
  }

  onCancel() {
    this.router.navigate(['/vehicles']);
  }

  get nameControl() {
    return this.form.get('name');
  }

  get capacityControl() {
    return this.form.get('capacity');
  }

  get warehouseIdControl() {
    return this.form.get('warehouseId');
  }
}
