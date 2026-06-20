import { Component } from '@angular/core';
import { ApplicationPageTemplateComponent } from '../../components/application-page-template/application-page-template.component';
import { HeadingComponent } from '../../components/heading/heading.component';
import { HyperLinkTextComponent } from '../../components/hyper-link-text/hyper-link-text.component';

/** Displays operator information and contact details for the application. */
@Component({
  selector: 'app-operator-info-page',
  imports: [ApplicationPageTemplateComponent, HeadingComponent, HyperLinkTextComponent],
  templateUrl: './operator-info-page.component.html',
  styleUrl: './operator-info-page.component.scss',
})
export class OperatorInfoPageComponent {}
