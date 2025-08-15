import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hyper-link-text',
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
  ],
  templateUrl: './hyper-link-text.component.html',
  styleUrl: './hyper-link-text.component.scss'
})
export class HyperLinkTextComponent {
  @Input() url!: string;
  @Input() external?: boolean;
  @Input() openInNewTab?: boolean;

  get isExternal(): boolean {
    return this.external ?? this.url.startsWith('http');
  }

  get isOpenInNewTab(): boolean {
    return !!this.openInNewTab;
  }

  get target(): string {
    return this.isOpenInNewTab ? '_blank' : '_self';
  }

  get rel(): string {
    return this.isOpenInNewTab ? 'noopener noreferrer' : '';
  }

}
