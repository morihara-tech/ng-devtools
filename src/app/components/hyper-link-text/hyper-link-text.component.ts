import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
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
  readonly url = input.required<string>();
  readonly external = input<boolean>();
  readonly openInNewTab = input<boolean>();

  readonly isExternal = computed(() => this.external() ?? this.url().startsWith('http'));
  readonly isOpenInNewTab = computed(() => !!this.openInNewTab());
  readonly target = computed(() => this.isOpenInNewTab() ? '_blank' : '_self');
  readonly rel = computed(() => this.isOpenInNewTab() ? 'noopener noreferrer' : '');
}
