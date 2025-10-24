import { Component, inject } from '@angular/core';
import {
  DeliveryPointsService,
  DeliveryPoint,
  DeliveryPointDetails,
} from '../delivery-points-service';
import { List } from '../../../shared/components/list/list';
import { Table } from '../../../shared/components/table/table';
import { Router, RouterLink } from '@angular/router';
import {
  createDefaultQueryParams,
  QueryParamsModel,
} from '../../../shared/models/request-respone-models';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-delivery-points-list',
  imports: [Table, RouterLink, ReactiveFormsModule],
  templateUrl: './delivery-points-list.html',
  styleUrl: './delivery-points-list.scss',
})
export class DeliveryPointsList {
  private deliveryService = inject(DeliveryPointsService);
  private router = inject(Router);

  deliveryPoints: DeliveryPoint[] = [];
  totalCount = 0;

  queryParams = createDefaultQueryParams();

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
    this.loadPage(this.queryParams);
  }

  loadPage(params: QueryParamsModel): void {
    this.queryParams = { ...params };

    this.deliveryService.getAll(this.queryParams).subscribe({
      next: (response) => {
        this.deliveryPoints = response.items;
        this.totalCount = response.totalCount;
      },
      error: (err) => console.error('API error:', err),
    });
  }

  onEdit = (element: DeliveryPoint) => {
    this.router.navigate(['/delivery-points/edit', element.id]);
  };

  onDelete = (id: number) => {
    this.deliveryService.delete(id).subscribe({
      next: () => {
        this.loadPage(this.queryParams);
      },
      error: (err) => console.error('Delete failed:', err),
    });
  };

  onPageChange(event: PageEvent): void {
    this.loadPage({
      ...this.queryParams,
      page: event.pageIndex + 1,
      pageSize: event.pageSize,
    });
  }

  onSortChange(event: Sort): void {
    this.loadPage({
      ...this.queryParams,
      orderBy: event.active,
      isDesc: event.direction === 'desc',
      page: 1,
    });
  }

  onSearch(searchString: string): void {
    this.loadPage({ ...this.queryParams, searchString, page: 1 });
  }
}
