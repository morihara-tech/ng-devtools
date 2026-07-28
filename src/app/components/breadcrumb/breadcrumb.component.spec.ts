import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { BreadcrumbComponent } from './breadcrumb.component';

describe('BreadcrumbComponent', () => {
  let fixture: ComponentFixture<BreadcrumbComponent>;
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreadcrumbComponent],
      providers: [
        provideRouter([
          { path: '', data: { breadcrumb: { label: 'ダッシュボードのラベル' } }, children: [] },
          { path: 'json-formatter', children: [] },
          { path: 'guide', data: { breadcrumb: { label: 'ご利用ガイド' } }, children: [] },
        ]),
      ],
    }).compileComponents();

    harness = await RouterTestingHarness.create();
  });

  it('renders the dashboard as a single current h1 node', async () => {
    fixture = TestBed.createComponent(BreadcrumbComponent);
    await harness.navigateByUrl('/');
    fixture.detectChanges();

    const h1 = fixture.nativeElement.querySelector('h1.breadcrumb-current');
    expect(h1?.textContent?.trim()).toBe('ダッシュボードのラベル');
    expect(fixture.nativeElement.querySelectorAll('li').length).toBe(1);
  });

  it('renders Home > category > current for a menu-def tool page', async () => {
    fixture = TestBed.createComponent(BreadcrumbComponent);
    await harness.navigateByUrl('/json-formatter');
    fixture.detectChanges();

    const items = Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('li'));
    expect(items.length).toBe(3);
    const h1 = fixture.nativeElement.querySelector('h1.breadcrumb-current');
    expect(h1).toBeTruthy();
    expect(fixture.nativeElement.querySelector('a[appHomeLink]')).toBeTruthy();
  });

  it('renders a route-data-driven page with a link back to Home', async () => {
    fixture = TestBed.createComponent(BreadcrumbComponent);
    await harness.navigateByUrl('/guide');
    fixture.detectChanges();

    const h1 = fixture.nativeElement.querySelector('h1.breadcrumb-current');
    expect(h1?.textContent?.trim()).toBe('ご利用ガイド');
    expect(fixture.nativeElement.querySelectorAll('li').length).toBe(2);
  });
});
