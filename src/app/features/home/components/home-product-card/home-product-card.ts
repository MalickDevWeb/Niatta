import { Component, EventEmitter, Input, Output, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product, ProductFormat } from '../../../../core/interfaces/product.interface';
import { FormatSelectorComponent } from '../../../../shared/components/format-selector/format-selector.component';

@Component({
  selector: 'app-home-product-card',
  standalone: true,
  imports: [CommonModule, FormatSelectorComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home-product-card.html',
  styleUrl: './home-product-card.css',
})
export class HomeProductCard {
  @Input({ required: true }) product!: Product;

  @Output() cardClick = new EventEmitter<string>();
  @Output() reportClick = new EventEmitter<{productId: string, formatId: string}>();

  selectorOpen = signal(false);
  selectedFormat = signal<ProductFormat | null>(null);

  get activeFormat(): ProductFormat {
    return this.selectedFormat() ?? this.product.formats[0];
  }

  get hasMultipleFormats(): boolean {
    return this.product.formats.length > 1;
  }

  get isImage(): boolean {
    return this.product.icon ? (this.product.icon.startsWith('http') || this.product.icon.startsWith('/')) : false;
  }

  get formattedPrice(): string {
    const price = this.activeFormat?.price ?? this.product.price;
    return price ? price.toLocaleString('fr-FR').replace(/\s/g, ' ') : '0';
  }

  onCardClick(event: Event) {
    if (this.hasMultipleFormats) {
      event.stopPropagation();
      this.selectorOpen.set(true);
    } else {
      this.cardClick.emit(this.product.id);
    }
  }

  onFormatSelected(format: ProductFormat) {
    this.selectedFormat.set(format);
  }

  onReport(formatId: string) {
    // If no formatId is provided or it's empty, we use the active format's ID
    const fId = formatId || this.activeFormat?.id;
    this.reportClick.emit({ productId: this.product.id, formatId: fId });
  }

  closeSelector() {
    this.selectorOpen.set(false);
  }
}
