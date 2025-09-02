import { Component, inject } from '@angular/core';
import {
  DeliveryPointsService,
  DeliveryPoint,
  DeliveryPointDetails,
} from '../delivery-points-service';
import { List } from '../../../shared/components/list/list';
import { Table } from '../../../shared/components/table/table';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-delivery-points-list',
  imports: [Table, RouterLink],
  templateUrl: './delivery-points-list.html',
  styleUrl: './delivery-points-list.scss',
})
export class DeliveryPointsList {
  private deliveryService = inject(DeliveryPointsService);
  deliveryPoints: DeliveryPoint[] = [];
  private router = inject(Router);

  columns: {
    key: keyof DeliveryPoint;
    label: string;
    link?: (dp: DeliveryPoint) => string;
  }[] = [
    { key: 'name', label: 'Name', link: (dp) => `/delivery-points/${dp.id}` },
    { key: 'address', label: 'Address' },
    { key: 'weight', label: 'Weight' },
  ];

  ngOnInit(): void {
    setTimeout(() => {
      this.deliveryService.getAll().subscribe({
        next: (data) => (this.deliveryPoints = data),
        error: (err) => console.error('API error:', err),
      });
    }, 0);
  }

  onEdit = (element: DeliveryPoint) => {
    this.router.navigate(['/delivery-points/edit', element.id]);
  };

  onDelete = (id: number) => {
    this.deliveryService.delete(id).subscribe({
      next: () => {
        this.deliveryPoints = this.deliveryPoints.filter((dp) => dp.id !== id);
        console.log('Deleted:', id);
      },
      error: (err) => console.error('Delete failed:', err),
    });
  };
}
