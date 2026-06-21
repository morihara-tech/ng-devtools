import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NgTemplateOutlet } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, OnDestroy, signal, viewChild, viewChildren } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ApplicationPageTemplateComponent } from '../../components/application-page-template/application-page-template.component';
import { HeadingComponent } from '../../components/heading/heading.component';
import { HyperLinkTextComponent } from '../../components/hyper-link-text/hyper-link-text.component';
import { PlatformService } from '../../core/services/platform.service';

export interface GuideTocItem {
  readonly id: string;
  readonly title: string;
}

/** Section anchors shown in the guide page's table of contents, in document order. */
const TOC_ITEMS: readonly GuideTocItem[] = [
  { id: 'sql-formatter', title: $localize`:@@page.guide.section.sqlFormatter:SQL整形ツール` },
  { id: 'json-formatter', title: $localize`:@@page.guide.section.jsonFormatter:JSON整形ツール` },
  { id: 'api-key-gen', title: $localize`:@@page.guide.section.apiKeyGen:APIキー生成ツール` },
  { id: 'password-gen', title: $localize`:@@page.guide.section.passwordGen:パスワード生成ツール` },
  { id: 'color-palette', title: $localize`:@@page.guide.section.colorPalette:カラーパレット` },
  { id: 'uuid-gen', title: $localize`:@@page.guide.section.uuidGen:UUID生成ツール` },
  { id: 'ulid-gen', title: $localize`:@@page.guide.section.ulidGen:ULID生成ツール` },
  { id: 'unix-timestamp', title: $localize`:@@page.guide.section.unixTimestamp:UNIXタイム変換` },
  { id: 'url-encoder', title: $localize`:@@page.guide.section.urlEncoder:URLエンコード・デコードツール` },
  { id: 'text-diff', title: $localize`:@@page.guide.section.textDiff:テキスト比較ツール` },
  { id: 'svg-viewer', title: $localize`:@@page.guide.section.svgViewer:SVGビューアー` },
  { id: 'ip-cidr', title: $localize`:@@page.guide.section.ipCidr:IP/CIDR計算機` },
];

@Component({
  selector: 'app-guide-page',
  imports: [
    ApplicationPageTemplateComponent,
    HeadingComponent,
    HyperLinkTextComponent,
    MatDividerModule,
    MatIconModule,
    MatSidenavModule,
    NgTemplateOutlet,
  ],
  templateUrl: './guide-page.component.html',
  styleUrl: './guide-page.component.scss',
})
export class GuidePageComponent implements AfterViewInit, OnDestroy {
  protected readonly tocItems = TOC_ITEMS;

  protected readonly isCompact = signal(false);

  /** Whether the mobile (Compact) ToC drawer is currently open. */
  protected readonly isTocDrawerOpen = signal(false);

  /** Id of the ToC entry currently highlighted by scroll-spy. */
  protected readonly activeSectionId = signal<string | undefined>(TOC_ITEMS[0]?.id);

  private readonly articleRef = viewChild<ElementRef<HTMLElement>>('articleRef');
  private readonly sectionRefs = viewChildren<ElementRef<HTMLElement>>('sectionRef');

  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly platformService = inject(PlatformService);

  private intersectionObserver?: IntersectionObserver;
  private readonly breakpointSubscription = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .subscribe((result) => this.isCompact.set(result.matches));

  ngAfterViewInit(): void {
    // IntersectionObserver is a browser-only API; skip it during SSG prerendering (Node.js).
    if (!this.platformService.isBrowser()) return;

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible?.target.id) {
          this.activeSectionId.set(visible.target.id);
        }
      },
      { rootMargin: '-20% 0px -70% 0px' },
    );

    this.sectionRefs().forEach((section) => this.intersectionObserver?.observe(section.nativeElement));
  }

  ngOnDestroy(): void {
    this.intersectionObserver?.disconnect();
    this.breakpointSubscription.unsubscribe();
  }

  protected scrollToSection(sectionId: string, event: MouseEvent): void {
    event.preventDefault();
    const scrollToTarget = () =>
      this.articleRef()
        ?.nativeElement.querySelector(`#${sectionId}`)
        ?.scrollIntoView({ behavior: 'smooth' });

    if (this.isTocDrawerOpen()) {
      // Closing the mobile drawer triggers a CSS transition on the surrounding
      // layout; defer the scroll until after that settles, otherwise the
      // reflow cancels/overrides the smooth scroll.
      this.isTocDrawerOpen.set(false);
      setTimeout(scrollToTarget, 300);
    } else {
      scrollToTarget();
    }
  }
}
