import { Component } from '@angular/core';
import { AdComponent } from '../../../components/ad/ad.component';
import { environment } from '../../../../environments/environment';

/**
 * Dashboard card that renders an AdSense advertisement.
 * Placed as a draggable, resizable card in the dashboard grid.
 */
@Component({
  selector: 'app-ad-card',
  imports: [AdComponent],
  templateUrl: './ad-card.component.html',
})
export class AdCardComponent {
  protected readonly dashboardSlot = environment.adsense.dashboardSlot;
}
