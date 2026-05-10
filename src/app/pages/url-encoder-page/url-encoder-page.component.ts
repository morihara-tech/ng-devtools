import { Component, inject, TemplateRef, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApplicationPageTemplateComponent } from '../../components/application-page-template/application-page-template.component';
import { HeadingComponent } from '../../components/heading/heading.component';
import { HelpDrawerService } from '../../services/help-drawer.service';
import { UrlEncoderInputCardComponent } from './url-encoder-input-card/url-encoder-input-card.component';
import { UrlEncoderOutputCardComponent } from './url-encoder-output-card/url-encoder-output-card.component';
import { UrlEncoderInputModel } from './url-encoder-model';

@Component({
  selector: 'app-url-encoder-page',
  imports: [
    ApplicationPageTemplateComponent,
    HeadingComponent,
    UrlEncoderInputCardComponent,
    UrlEncoderOutputCardComponent,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './url-encoder-page.component.html',
  styleUrl: './url-encoder-page.component.scss',
})
export class UrlEncoderPageComponent {
  private readonly output = viewChild<UrlEncoderOutputCardComponent>('output');
  private readonly helpDrawerService = inject(HelpDrawerService);

  onConvert(input: UrlEncoderInputModel): void {
    this.output()?.convert(input);
  }

  onClear(): void {
    this.output()?.clear();
  }

  onOpenHelp(content: TemplateRef<unknown>): void {
    this.helpDrawerService.open(content);
  }
}
