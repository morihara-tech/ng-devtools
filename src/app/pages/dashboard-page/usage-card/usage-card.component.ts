import { Component, OnInit } from '@angular/core';
import { mergeMap } from 'rxjs';
import { TEXT, Text } from '../../../../resources/texts/text';
import { LocaleService } from '../../../components/locale/locale.service';

@Component({
  selector: 'app-usage-card',
  imports: [],
  templateUrl: './usage-card.component.html',
  styleUrl: './usage-card.component.scss'
})
export class UsageCardComponent implements OnInit {
  text!: Text;

  constructor(
    private localeService: LocaleService
  ) {}

  ngOnInit(): void {
    this.localeService.get()
      .pipe(mergeMap((locale) => TEXT(locale)))
      .subscribe((res) => {
        this.text = res;
      });
  }

}
