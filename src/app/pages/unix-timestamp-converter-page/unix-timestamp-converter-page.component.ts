import { Component, inject, TemplateRef, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApplicationPageTemplateComponent } from '../../components/application-page-template/application-page-template.component';
import { HeadingComponent } from '../../components/heading/heading.component';
import { HelpDrawerService } from '../../services/help-drawer.service';
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
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './unix-timestamp-converter-page.component.html',
  styleUrl: './unix-timestamp-converter-page.component.scss',
})
export class UnixTimestampConverterPageComponent {
  private readonly output = viewChild<UnixTimestampOutputCardComponent>('output');
  private readonly helpDrawerService = inject(HelpDrawerService);

  onConvert(input: UnixTimestampInputModel): void {
    this.output()?.convertResult(input);
  }

  onOpenHelp(content: TemplateRef<unknown>): void {
    this.helpDrawerService.open(content);
  }
}
