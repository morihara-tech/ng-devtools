import { Component, ViewChild } from '@angular/core';
import { IpCidrInputCardComponent } from './ip-cidr-input-card/ip-cidr-input-card.component';
import { IpCidrOutputCardComponent } from './ip-cidr-output-card/ip-cidr-output-card.component';
import { HeadingComponent } from '../../components/heading/heading.component';
import { ApplicationPageTemplateComponent } from '../../components/application-page-template/application-page-template.component';
import { IpCidrInputModel } from './ip-cidr-model';

@Component({
  selector: 'app-ip-cidr-calculator-page',
  imports: [
    ApplicationPageTemplateComponent,
    HeadingComponent,
    IpCidrInputCardComponent,
    IpCidrOutputCardComponent,
  ],
  templateUrl: './ip-cidr-calculator-page.component.html',
  styleUrl: './ip-cidr-calculator-page.component.scss'
})
export class IpCidrCalculatorPageComponent {
  @ViewChild('output') output?: IpCidrOutputCardComponent;

  onCalculate(input: IpCidrInputModel): void {
    if (!this.output) {
      return;
    }
    this.output.calculateResult(input);
  }
}
