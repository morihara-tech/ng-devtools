import { Component, inject, TemplateRef, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApplicationPageTemplateComponent } from '../../components/application-page-template/application-page-template.component';
import { HeadingComponent } from '../../components/heading/heading.component';
import { HelpDrawerService } from '../../services/help-drawer.service';
import { TextDiffInputCardComponent } from './text-diff-input-card/text-diff-input-card.component';
import { TextDiffOutputCardComponent } from './text-diff-output-card/text-diff-output-card.component';
import { TextDiffInputModel } from './text-diff-model';
import { TextDiffHelpComponent } from './text-diff-help/text-diff-help.component';

@Component({
  selector: 'app-text-diff-page',
  imports: [
    ApplicationPageTemplateComponent,
    HeadingComponent,
    TextDiffInputCardComponent,
    TextDiffOutputCardComponent,
    TextDiffHelpComponent,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './text-diff-page.component.html',
  styleUrl: './text-diff-page.component.scss',
})
export class TextDiffPageComponent {
  private readonly output = viewChild<TextDiffOutputCardComponent>('output');
  private readonly helpDrawerService = inject(HelpDrawerService);

  onCompare(input: TextDiffInputModel): void {
    this.output()?.diff(input);
  }

  onClear(): void {
    this.output()?.clear();
  }

  onOpenHelp(content: TemplateRef<unknown>): void {
    this.helpDrawerService.open(content);
  }
}
