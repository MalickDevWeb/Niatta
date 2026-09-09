import { Component, EventEmitter, Input, Output, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-home-product-card',
  standalone: true,
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home-product-card.html',
  styleUrl: './home-product-card.css',
})
export class HomeProductCard {
  @Input({ required: true }) id!: string;
  @Input({ required: true }) icon!: string;
  @Input({ required: true }) name!: string;
  @Input({ required: true }) unit!: string;
  @Input({ required: true }) price!: number;
  
  @Output() cardClick = new EventEmitter<string>();
}
