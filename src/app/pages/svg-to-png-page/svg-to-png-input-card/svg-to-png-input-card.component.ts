import { Component, ViewChild, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { SvgToPngSettingsModel } from '../svg-to-png-model';
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

  private resetForm(): void {
    this.formGroup = this.fb.group({
      canvasWidth: this.fb.control<number>(500, [
        Validators.required,
        Validators.min(1),
        Validators.max(5000)
      ]),
      canvasHeight: this.fb.control<number>(500, [
        Validators.required,
        Validators.min(1),
        Validators.max(5000)
      ]),
      transparent: this.fb.control<boolean>(false),
      backgroundColor: this.fb.control<string>('#ffffff'),
      scale: this.fb.control<number>(100, [
        Validators.required,
        Validators.min(1),
        Validators.max(500)
      ]),
      offsetX: this.fb.control<number>(0, [
        Validators.required
      ]),
      offsetY: this.fb.control<number>(0, [
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
      backgroundColorControl.disable();
    } else {
      backgroundColorControl.enable();
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
