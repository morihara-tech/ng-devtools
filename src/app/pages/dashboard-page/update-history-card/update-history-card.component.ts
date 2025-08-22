import { Component } from '@angular/core';
import { UpdateHistoryComponent } from '../../../components/update-history/update-history.component';
import { HOME_UPDATE_HISTORIES } from '../../../../resources/update-history/def/home.update-history';

@Component({
  selector: 'app-update-history-card',
  imports: [
    UpdateHistoryComponent
  ],
  templateUrl: './update-history-card.component.html',
  styleUrl: './update-history-card.component.scss'
})
export class UpdateHistoryCardComponent {
  histories = HOME_UPDATE_HISTORIES;
}
