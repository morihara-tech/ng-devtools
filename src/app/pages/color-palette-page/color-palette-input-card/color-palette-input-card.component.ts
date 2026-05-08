import { Component, inject, signal, OnInit, output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { HeadingComponent } from '../../../components/heading/heading.component';
import {
  ColorPaletteInputModel,
  ColorPaletteMode,
  isValidHexColor,
  normalizeHexColor,
} from '../color-palette-model';

const DEFAULT_COLORS = ['#4285F4', '#EA4335'];
const MIN_COLOR_COUNT = 1;
const MAX_COLOR_COUNT = 10;
const DEFAULT_COLOR_COUNT = 2;
const HEX_PATTERN = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

@Component({
  selector: 'app-color-palette-input-card',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSliderModule,
    MatIconModule,
    HeadingComponent,
  ],
  templateUrl: './color-palette-input-card.component.html',
  styleUrl: './color-palette-input-card.component.scss',
})
export class ColorPaletteInputCardComponent implements OnInit {
  readonly generate = output<ColorPaletteInputModel>();

  readonly mode = signal<ColorPaletteMode>('compare');
  readonly colorCount = signal(DEFAULT_COLOR_COUNT);
  readonly minCount = MIN_COLOR_COUNT;
  readonly maxCount = MAX_COLOR_COUNT;

  private readonly fb = inject(FormBuilder);
  colorArray!: FormArray<FormControl<string>>;

  ngOnInit(): void {
    this.colorArray = this.fb.array(
      DEFAULT_COLORS.map(c => this.fb.nonNullable.control(c, [Validators.required, Validators.pattern(HEX_PATTERN)])),
    );
    setTimeout(() => {
      this.onSubmit();
    }, 10);
  }

  get colorControls(): FormControl<string>[] {
    return this.colorArray.controls as FormControl<string>[];
  }

  onModeChange(mode: ColorPaletteMode): void {
    this.mode.set(mode);
  }

  onCountChange(value: number): void {
    this.colorCount.set(value);
    const target = value;
    const current = this.colorArray.length;
    if (target > current) {
      for (let i = current; i < target; i++) {
        this.colorArray.push(
          this.fb.nonNullable.control('#000000', [Validators.required, Validators.pattern(HEX_PATTERN)]),
        );
      }
    } else {
      while (this.colorArray.length > target) {
        this.colorArray.removeAt(this.colorArray.length - 1);
      }
    }
  }

  onColorPickerChange(index: number, value: string): void {
    this.colorArray.at(index).setValue(value);
  }

  onSubmit(): void {
    const validColors = this.colorControls
      .map(ctrl => ctrl.value)
      .filter(c => isValidHexColor(c))
      .map(c => normalizeHexColor(c));
    if (validColors.length === 0) return;
    this.generate.emit({ mode: this.mode(), colors: validColors });
  }

  formatSliderLabel(value: number): string {
    return `${value}`;
  }

  get hasError(): boolean {
    return this.colorArray.invalid;
  }
}
