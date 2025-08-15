import { Component, OnInit } from '@angular/core';
import { LocaleService } from '../../../components/locale/locale.service';
import { TEXT, Text } from '../../../../resources/texts/text';
import { mergeMap } from 'rxjs';

@Component({
  selector: 'app-github-card',
  imports: [],
  templateUrl: './github-card.component.html',
  styleUrl: './github-card.component.scss'
})
export class GithubCardComponent implements OnInit {
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
