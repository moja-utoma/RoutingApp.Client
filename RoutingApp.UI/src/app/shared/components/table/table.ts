import { Component, Input } from '@angular/core';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-table',
  imports: [MatProgressSpinnerModule, MatTableModule, RouterLink, MatIcon, MatIconModule],
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

  @Input() onDelete?: (id: number) => void;
  @Input() onEdit?: (item: T) => void;
  @Input() showActions = false;

  get columnKeys(): string[] {
    const base = this.columns.map((c) => c.key.toString());
    return this.showActions ? [...base, 'actions'] : base;
  }
}
