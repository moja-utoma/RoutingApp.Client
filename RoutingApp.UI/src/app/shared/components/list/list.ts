import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-list',
  imports: [MatProgressSpinnerModule],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class List<T extends { id: number }>  {
  @Input() title = '';
  @Input() items: T[] | null = null;
  @Input() displayFn: (item: T) => string = (item) => JSON.stringify(item);
}
