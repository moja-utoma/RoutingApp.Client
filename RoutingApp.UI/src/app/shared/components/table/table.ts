import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortHeader, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-table',
  imports: [
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatTableModule,
    RouterLink,
    MatIcon,
    MatIconModule,
    MatPaginator,
    MatSortModule,
    MatSort,
    MatSortHeader,
    MatFormField,
    MatLabel,
    MatInput
  ],
  templateUrl: './table.html',
  styleUrl: './table.scss',
})
export class Table<T extends { id: number }> {
  @Input() title = '';
  @Input() items: T[] | null = null;
  @Input() columns: {
    key: Extract<keyof T, string> | string;
    label: string;
    get?: (item: T) => any;
    link?: (item: T) => string;
  }[] = [];
  @Input() pageSizeOptions: number[] = [10, 25, 50];

  @Input() onDelete?: (id: number) => void;
  @Input() onEdit?: (item: T) => void;
  @Input() showActions = false;

  @Input() showPagination = false;
  @Input() pageIndex = 0;
  @Input() pageSize = 10;
  @Input() totalItems = 0;
  @Output() pageChange = new EventEmitter<PageEvent>();

  @Input() showSort = false;
  @Output() sortChange = new EventEmitter<Sort>();

  @Input() showSearch = false;
  @Output() searchChange = new EventEmitter<string>();

  searchControl = new FormControl('');

  ngOnInit(): void {
    if (this.showSearch) {
      this.searchControl.valueChanges
        .pipe(debounceTime(1000), distinctUntilChanged()) // wait 1 sec, check if val is actually different
        .subscribe((value: string | null) => {
          this.searchChange.emit(value?.trim() ?? '');
        });
    }
  }

  get columnKeys(): string[] {
    const base = this.columns.map((c) => c.key.toString());
    return this.showActions ? [...base, 'actions'] : base;
  }
}
