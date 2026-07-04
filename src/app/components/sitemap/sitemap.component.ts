import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HomeLinkDirective } from '../locale/home-link.directive';

@Component({
  selector: 'app-sitemap',
  imports: [RouterLink, HomeLinkDirective],
  templateUrl: './sitemap.component.html',
})
export class SitemapComponent {}
