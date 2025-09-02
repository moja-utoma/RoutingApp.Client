import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DeliveryPoint, DeliveryPointsService } from '../delivery-points-service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delivery-points-create',
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule],
  templateUrl: './delivery-points-create.html',
  styleUrl: './delivery-points-create.scss',
})
export class DeliveryPointsCreate {
  private fb = inject(FormBuilder);
  private deliveryService = inject(DeliveryPointsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

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

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.editMode = true;
        this.currentId = +id;

        this.deliveryService.getById(this.currentId).subscribe((dp) => {
          this.form.patchValue(dp);
        });
      }
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
