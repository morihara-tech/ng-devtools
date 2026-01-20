import { Component, ViewChild } from '@angular/core';
import { PasswordGenInputCardComponent } from './password-gen-input-card/password-gen-input-card.component';
import { PasswordGenOutputCardComponent } from './password-gen-output-card/password-gen-output-card.component';
import { HeadingComponent } from '../../components/heading/heading.component';
import { ApplicationPageTemplateComponent } from '../../components/application-page-template/application-page-template.component';
import { PasswordGenInputModel } from './password-gen-model';

@Component({
    selector: 'app-password-gen-page',
    imports: [
        ApplicationPageTemplateComponent,
        HeadingComponent,
        PasswordGenInputCardComponent,
        PasswordGenOutputCardComponent,
    ],
    templateUrl: './password-gen-page.component.html',
    styleUrl: './password-gen-page.component.scss'
})
export class PasswordGenPageComponent {
  @ViewChild('output') output?: PasswordGenOutputCardComponent;

  onGenerate(input: PasswordGenInputModel): void {
    if (!this.output) {
      return;
    }
    this.output.generatePassword(input);
  }

}
