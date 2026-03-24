import { Component, ElementRef, EventEmitter, forwardRef, inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Compartment, EditorState, type Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { githubLight, githubDark } from '@uiw/codemirror-theme-github';
import { PlatformService } from '../../core/services/platform.service';

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

  private readonly platformService = inject(PlatformService);
  private view?: EditorView;
  private extensionCompartment = new Compartment();
  private themeCompartment = new Compartment();
  private mediaQueryList: MediaQueryList | null = null;
  private themeListener = (e: MediaQueryListEvent) => this.updateTheme(e.matches);

  ngOnInit(): void {
    this.mediaQueryList = this.platformService.matchMedia('(prefers-color-scheme: dark)');
    // Since the editor relies on browser APIs, we should only initialize it in the browser environment
    if (!this.platformService.isBrowser()) {
      return;
    }
    const isDark = this.mediaQueryList?.matches ?? false;
    const state = EditorState.create({
      doc: this.value,
      extensions: [
        this.extensionCompartment.of(this.extensions),
        this.themeCompartment.of(this.getTheme(isDark)),
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

    this.mediaQueryList?.addEventListener('change', this.themeListener);
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
    this.mediaQueryList?.removeEventListener('change', this.themeListener);
    this.view?.destroy();
    this.view = undefined;
  }

  focus(): void {
    this.view?.focus();
  }

  private getTheme(isDark: boolean): Extension {
    return isDark ? githubDark : githubLight;
  }

  private updateTheme(isDark: boolean) {
    if (!this.view) {
      return;
    }
    this.view.dispatch({
      effects: this.themeCompartment.reconfigure(this.getTheme(isDark)),
    });
  }

}
