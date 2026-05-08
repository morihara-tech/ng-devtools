import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ApiKeyGenPageComponent } from './api-key-gen-page.component';
import { ApiKeyGenOutputCardComponent } from './api-key-gen-output-card/api-key-gen-output-card.component';
import { ApiKeyGenInputModel } from './api-key-gen-model';

describe('ApiKeyGenPageComponent', () => {
  let component: ApiKeyGenPageComponent;
  let fixture: ComponentFixture<ApiKeyGenPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiKeyGenPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApiKeyGenPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call output.generateApiKeys on generate', () => {
    const outputDebugElement = fixture.debugElement.query(By.directive(ApiKeyGenOutputCardComponent));
    const outputComponent = outputDebugElement.componentInstance as ApiKeyGenOutputCardComponent;
    const input: ApiKeyGenInputModel = {
      format: 'base62',
      length: 32,
      count: 1,
      prefix: 'test',
    };
    let capturedInput: ApiKeyGenInputModel | undefined;

    outputComponent.generateApiKeys = (value: ApiKeyGenInputModel): void => {
      capturedInput = value;
    };

    component.onGenerate(input);

    expect(capturedInput).toEqual(input);
  });
});
