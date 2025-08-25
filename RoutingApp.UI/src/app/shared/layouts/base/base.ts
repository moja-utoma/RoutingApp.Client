import { Component } from '@angular/core';
import { Menu } from '../../components/menu/menu';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-base',
  imports: [Menu,RouterOutlet],
  templateUrl: './base.html',
  styleUrl: './base.scss',
})
export class Base {}
