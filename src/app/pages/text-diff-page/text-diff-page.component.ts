import { Component, viewChild } from '@angular/core';
import { ApplicationPageTemplateComponent } from '../../components/application-page-template/application-page-template.component';
import { HeadingComponent } from '../../components/heading/heading.component';
import { TextDiffInputCardComponent } from './text-diff-input-card/text-diff-input-card.component';
import { TextDiffOutputCardComponent } from './text-diff-output-card/text-diff-output-card.component';
import { TextDiffInputModel } from './text-diff-model';

@Component({
  selector: 'app-text-diff-page',
  imports: [
    ApplicationPageTemplateComponent,
    HeadingComponent,
    TextDiffInputCardComponent,
    TextDiffOutputCardComponent,
  ],
  templateUrl: './text-diff-page.component.html',
  styleUrl: './text-diff-page.component.scss',
})
export class TextDiffPageComponent {
  private readonly output = viewChild<TextDiffOutputCardComponent>('output');

  onCompare(input: TextDiffInputModel): void {
    this.output()?.diff(input);
  }

  onClear(): void {
    this.output()?.clear();
  }
}
