import { Component, ViewChild, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { SvgToPngSettingsModel, DEFAULT_SVG_TO_PNG_SETTINGS } from '../svg-to-png-model';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HeadingComponent } from '../../../components/heading/heading.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SvgCodeEditorComponent } from '../svg-code-editor/svg-code-editor.component';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-svg-to-png-input-card',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatSliderModule,
    HeadingComponent,
    SvgCodeEditorComponent,
  ],
  templateUrl: './svg-to-png-input-card.component.html',
  styleUrl: './svg-to-png-input-card.component.scss'
})
export class SvgToPngInputCardComponent implements OnInit {
  @ViewChild(SvgCodeEditorComponent) svgCodeEditorComponent?: SvgCodeEditorComponent;
  @Output() settingsChange: EventEmitter<SvgToPngSettingsModel> = new EventEmitter();
  @Output() svgCodeChange: EventEmitter<string> = new EventEmitter();

  formGroup?: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.resetForm();
    this.formGroup?.valueChanges.subscribe(() => {
      this.handleTransparentToggle();
      this.emitSettings();
    });
  }

  onSvgCodeChange(svgCode: string): void {
    this.svgCodeChange.emit(svgCode);
  }

  getSvgCode(): string {
    return this.svgCodeEditorComponent?.value ?? '';
  }

  get hasError(): boolean {
    if (!this.formGroup) {
      return true;
    }
    return this.formGroup.status !== 'VALID';
  }

  get scaleValue(): number {
    return this.formGroup?.controls['scale'].value ?? 100;
  }

  formatLabel(value: number): string {
    return `${value}%`;
  }

  onBackgroundColorChange(value: string): void {
    if (this.formGroup) {
      this.formGroup.controls['backgroundColor'].setValue(value, { emitEvent: false });
      this.emitSettings();
    }
  }

  private resetForm(): void {
    this.formGroup = this.fb.group({
      canvasWidth: this.fb.control<number>(DEFAULT_SVG_TO_PNG_SETTINGS.canvasWidth, [
        Validators.required,
        Validators.min(1),
        Validators.max(5000)
      ]),
      canvasHeight: this.fb.control<number>(DEFAULT_SVG_TO_PNG_SETTINGS.canvasHeight, [
        Validators.required,
        Validators.min(1),
        Validators.max(5000)
      ]),
      transparent: this.fb.control<boolean>(DEFAULT_SVG_TO_PNG_SETTINGS.transparent),
      backgroundColor: this.fb.control<string>(DEFAULT_SVG_TO_PNG_SETTINGS.backgroundColor),
      scale: this.fb.control<number>(DEFAULT_SVG_TO_PNG_SETTINGS.scale, [
        Validators.required,
        Validators.min(1),
        Validators.max(500)
      ]),
      offsetX: this.fb.control<number>(DEFAULT_SVG_TO_PNG_SETTINGS.offsetX, [
        Validators.required
      ]),
      offsetY: this.fb.control<number>(DEFAULT_SVG_TO_PNG_SETTINGS.offsetY, [
        Validators.required
      ]),
    });
  }

  private handleTransparentToggle(): void {
    if (!this.formGroup) {
      return;
    }
    const isTransparent = this.formGroup.controls['transparent'].value;
    const backgroundColorControl = this.formGroup.controls['backgroundColor'];
    
    if (isTransparent) {
      backgroundColorControl.disable({ emitEvent: false });
    } else {
      backgroundColorControl.enable({ emitEvent: false });
    }
  }

  private emitSettings(): void {
    if (!this.formGroup || this.hasError) {
      return;
    }
    const model: SvgToPngSettingsModel = {
      canvasWidth: Number(this.formGroup.controls['canvasWidth'].value),
      canvasHeight: Number(this.formGroup.controls['canvasHeight'].value),
      transparent: Boolean(this.formGroup.controls['transparent'].value),
      backgroundColor: this.formGroup.controls['backgroundColor'].value ?? '#ffffff',
      scale: Number(this.formGroup.controls['scale'].value),
      offsetX: Number(this.formGroup.controls['offsetX'].value),
      offsetY: Number(this.formGroup.controls['offsetY'].value),
    };
    this.settingsChange.emit(model);
  }
}
