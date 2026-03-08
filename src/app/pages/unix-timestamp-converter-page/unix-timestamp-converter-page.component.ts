import { Component, ViewChild } from '@angular/core';
import { ApplicationPageTemplateComponent } from '../../components/application-page-template/application-page-template.component';
import { HeadingComponent } from '../../components/heading/heading.component';
import { UnixTimestampInputCardComponent } from './unix-timestamp-input-card/unix-timestamp-input-card.component';
import { UnixTimestampOutputCardComponent } from './unix-timestamp-output-card/unix-timestamp-output-card.component';
import { UnixTimestampInputModel } from './unix-timestamp-model';

@Component({
  selector: 'app-unix-timestamp-converter-page',
  imports: [
    ApplicationPageTemplateComponent,
    HeadingComponent,
    UnixTimestampInputCardComponent,
    UnixTimestampOutputCardComponent,
  ],
  templateUrl: './unix-timestamp-converter-page.component.html',
  styleUrl: './unix-timestamp-converter-page.component.scss',
})
export class UnixTimestampConverterPageComponent {
  @ViewChild('output') output?: UnixTimestampOutputCardComponent;

  onConvert(input: UnixTimestampInputModel): void {
    if (!this.output) {
      return;
    }
    this.output.convertResult(input);
  }
}
