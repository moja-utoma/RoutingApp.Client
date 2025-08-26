import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-table',
  imports: [MatProgressSpinnerModule, MatTableModule, RouterLink, MatIcon, MatTooltip],
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
    actions?: {
      icon: string;
      tooltip: string;
      action: (item: T) => void;
    }[];
  }[] = [];

  @Input() onDelete?: (item: T) => void;
  @Input() onEdit?: (item: T) => void;

  get columnKeys(): string[] {
    return this.columns.map((c) => c.key.toString());
  }

  handleAction(item: T, action: { icon: string; tooltip: string; action: (item: T) => void }) {
    action.action(item);
  }
}
