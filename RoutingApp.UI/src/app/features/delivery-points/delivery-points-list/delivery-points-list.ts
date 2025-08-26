import { Component, inject } from '@angular/core';
import { DeliveryPoints, DeliveryPoint } from '../delivery-points';
import { List } from '../../../shared/components/list/list';
import { Table } from '../../../shared/components/table/table';

@Component({
  selector: 'app-delivery-points-list',
  imports: [Table],
  templateUrl: './delivery-points-list.html',
  styleUrl: './delivery-points-list.scss',
})
export class DeliveryPointsList {
  private deliveryService = inject(DeliveryPoints);
  deliveryPoints: DeliveryPoint[] = [];

  columns: { key: keyof DeliveryPoint; label: string }[] = [
    { key: 'name', label: 'Name' },
    { key: 'address', label: 'Address' },
  ];

  ngOnInit(): void {
    setTimeout(() => {
      this.deliveryService.getAll().subscribe({
        next: (data) => (this.deliveryPoints = data),
        error: (err) => console.error('API error:', err),
      });
    }, 0);
  }
}
