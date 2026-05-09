import { Component } from '@angular/core';
import { ApplicationPageTemplateComponent } from '../../components/application-page-template/application-page-template.component';

/** Displays the privacy policy content for the application. */
@Component({
  selector: 'app-privacy-policy-page',
  imports: [ApplicationPageTemplateComponent],
  templateUrl: './privacy-policy-page.component.html',
  styleUrl: './privacy-policy-page.component.scss',
})
export class PrivacyPolicyPageComponent {}
