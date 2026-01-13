import { Component, ElementRef, EventEmitter, forwardRef, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Compartment, EditorState, type Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { oneDark } from '@codemirror/theme-one-dark';

@Component({
  selector: 'app-codemirror',
  imports: [],
  templateUrl: './codemirror.component.html',
  styleUrl: './codemirror.component.scss',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CodemirrorComponent),
    multi: true,
  }],
})
export class CodemirrorComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('host', { static: true }) hostEl!: ElementRef<HTMLElement>;
  @Input() value: string = '';
  @Input() extensions: Extension[] = [];
  @Output() valueChange = new EventEmitter<string>();

  private view?: EditorView;
  private extensionCompartment = new Compartment();
  private themeCompartment = new Compartment();

  ngOnInit(): void {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = isDarkMode ? oneDark : [];

    const state = EditorState.create({
      doc: this.value,
      extensions: [
        this.extensionCompartment.of(this.extensions),
        this.themeCompartment.of(initialTheme),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            this.valueChange.emit(update.state.doc.toString());
          }
        }),
        EditorView.theme({
          '&.cm-focused': {
            outline: 'none'
          }
        }),
      ],
    });
    this.view = new EditorView({
      state,
      parent: this.hostEl.nativeElement,
    });

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      const newTheme = e.matches ? oneDark : [];
      this.view?.dispatch({
        effects: this.themeCompartment.reconfigure(newTheme),
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.view) {
      return;
    }
    if (changes['extensions']) {
      this.view.dispatch({
        effects: this.extensionCompartment.reconfigure(this.extensions),
      });
    }
    if (changes['value']) {
      const newValue: string = changes['value'].currentValue;
      if (newValue !== this.view.state.doc.toString()) {
        this.view.dispatch({
          changes: {
            from: 0,
            to: this.view.state.doc.length,
            insert: newValue
          },
        });
      } 
    }
  }

  ngOnDestroy(): void {
    this.view?.destroy();
    this.view = undefined;
  }

  focus(): void {
    this.view?.focus();
  }}