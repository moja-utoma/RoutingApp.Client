import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-table',
  imports: [MatProgressSpinnerModule, MatTableModule],
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
  }[] = [];

  get columnKeys(): string[] {
    return this.columns.map((c) => c.key.toString());
  }
}
