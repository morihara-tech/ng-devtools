import { Component, ViewChild } from '@angular/core';
import { ApplicationPageTemplateComponent } from '../../components/application-page-template/application-page-template.component';
import { HeadingComponent } from '../../components/heading/heading.component';
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
  ],
  templateUrl: './url-encoder-page.component.html',
  styleUrl: './url-encoder-page.component.scss',
})
export class UrlEncoderPageComponent {
  @ViewChild('output') output?: UrlEncoderOutputCardComponent;

  onConvert(input: UrlEncoderInputModel): void {
    if (!this.output) {
      return;
    }
    this.output.convert(input);
  }

  onClear(): void {
    if (!this.output) {
      return;
    }
    this.output.clear();
  }
}
