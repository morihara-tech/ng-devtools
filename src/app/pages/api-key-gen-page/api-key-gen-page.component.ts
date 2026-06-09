import { Component, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApplicationPageTemplateComponent } from '../../components/application-page-template/application-page-template.component';
import { HeadingComponent } from '../../components/heading/heading.component';
import { ApiKeyGenInputCardComponent } from './api-key-gen-input-card/api-key-gen-input-card.component';
import { ApiKeyGenOutputCardComponent } from './api-key-gen-output-card/api-key-gen-output-card.component';
import { ApiKeyGenInputModel } from './api-key-gen-model';
import { ApiKeyGenHelpComponent } from './api-key-gen-help/api-key-gen-help.component';

@Component({
  selector: 'app-api-key-gen-page',
  imports: [
    ApplicationPageTemplateComponent,
    HeadingComponent,
    ApiKeyGenInputCardComponent,
    ApiKeyGenOutputCardComponent,
    ApiKeyGenHelpComponent,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './api-key-gen-page.component.html',
  styleUrl: './api-key-gen-page.component.scss'
})
export class ApiKeyGenPageComponent {
  private readonly output = viewChild<ApiKeyGenOutputCardComponent>('output');

  onGenerate(input: ApiKeyGenInputModel): void {
    this.output()?.generateApiKeys(input);
  }
}
