import { Component, effect, ElementRef, forwardRef, inject, input, model, OnDestroy, OnInit, output, viewChild } from '@angular/core';
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
export class CodemirrorComponent implements OnInit, OnDestroy {
  private readonly hostEl = viewChild.required<ElementRef<HTMLElement>>('host');
  readonly value = model('');
  readonly extensions = input<Extension[]>([]);

  private readonly platformService = inject(PlatformService);
  private view?: EditorView;
  private extensionCompartment = new Compartment();
  private themeCompartment = new Compartment();
  private mediaQueryList: MediaQueryList | null = null;
  private themeListener = (e: MediaQueryListEvent) => this.updateTheme(e.matches);

  constructor() {
    effect(() => {
      const extensions = this.extensions();
      if (!this.view) return;
      this.view.dispatch({
        effects: this.extensionCompartment.reconfigure(extensions),
      });
    });

    effect(() => {
      const newValue = this.value();
      if (!this.view) return;
      if (newValue !== this.view.state.doc.toString()) {
        this.view.dispatch({
          changes: {
            from: 0,
            to: this.view.state.doc.length,
            insert: newValue
          },
        });
      }
    });
  }

  ngOnInit(): void {
    this.mediaQueryList = this.platformService.matchMedia('(prefers-color-scheme: dark)');
    if (!this.platformService.isBrowser()) {
      return;
    }
    const isDark = this.mediaQueryList?.matches ?? false;
    const state = EditorState.create({
      doc: this.value(),
      extensions: [
        this.extensionCompartment.of(this.extensions()),
        this.themeCompartment.of(this.getTheme(isDark)),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            this.value.set(update.state.doc.toString());
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
      parent: this.hostEl().nativeElement,
    });

    this.mediaQueryList?.addEventListener('change', this.themeListener);
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
