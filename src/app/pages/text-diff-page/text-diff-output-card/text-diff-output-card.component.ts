import { Component } from '@angular/core';
import { diffLines, diffChars, type Change } from 'diff';
import { MatCardModule } from '@angular/material/card';
import { HeadingComponent } from '../../../components/heading/heading.component';
import { TextViewerTableComponent } from '../../../components/text-viewer-table/text-viewer-table.component';
import { TextDiffInputModel, TextDiffResult } from '../text-diff-model';

interface BuildState {
  originalLines: string[];
  modifiedLines: string[];
  originalRowHighlights: Record<number, string>;
  modifiedRowHighlights: Record<number, string>;
}

@Component({
  selector: 'app-text-diff-output-card',
  imports: [
    MatCardModule,
    HeadingComponent,
    TextViewerTableComponent,
  ],
  templateUrl: './text-diff-output-card.component.html',
  styleUrl: './text-diff-output-card.component.scss',
})
export class TextDiffOutputCardComponent {
  result?: TextDiffResult;

  /** Runs diff and builds HTML-highlighted split-view models for both sides. */
  diff(model: TextDiffInputModel): void {
    const changes: Change[] = diffLines(model.original, model.modified);
    this.result = this.buildResult(changes);
  }

  clear(): void {
    this.result = undefined;
  }

  /** Orchestrates the diff build: iterates changes and delegates to appropriate processors. */
  private buildResult(changes: Change[]): TextDiffResult {
    const state = this.createBuildState();

    let changeIndex = 0;
    while (changeIndex < changes.length) {
      const current = changes[changeIndex];
      const next = changes[changeIndex + 1];

      if (!current.removed && !current.added) {
        this.processUnchanged(state, current);
        changeIndex++;
      } else if (current.removed && next?.added) {
        this.processModifiedPair(state, current, next);
        changeIndex += 2;
      } else if (current.removed) {
        this.processRemoved(state, current);
        changeIndex++;
      } else if (current.added) {
        this.processAdded(state, current);
        changeIndex++;
      } else {
        changeIndex++;
      }
    }

    return this.toResult(state);
  }

  private createBuildState(): BuildState {
    return {
      originalLines: [],
      modifiedLines: [],
      originalRowHighlights: {},
      modifiedRowHighlights: {},
    };
  }

  private toResult(state: BuildState): TextDiffResult {
    return {
      originalValue: state.originalLines.join('\n'),
      modifiedValue: state.modifiedLines.join('\n'),
      originalRowHighlights: state.originalRowHighlights,
      modifiedRowHighlights: state.modifiedRowHighlights,
    };
  }

  /** Appends unchanged lines to both sides without any highlight. */
  private processUnchanged(state: BuildState, change: Change): void {
    for (const line of this.splitLines(change.value)) {
      state.originalLines.push(this.escapeHtml(line));
      state.modifiedLines.push(this.escapeHtml(line));
    }
  }

  /** Pairs a removed and an added block, performing character-level diffs on matching lines. */
  private processModifiedPair(state: BuildState, removed: Change, added: Change): void {
    const removedLines = this.splitLines(removed.value);
    const addedLines = this.splitLines(added.value);
    const maxLen = Math.max(removedLines.length, addedLines.length);

    for (let lineIndex = 0; lineIndex < maxLen; lineIndex++) {
      if (lineIndex < removedLines.length && lineIndex < addedLines.length) {
        this.appendCharDiffLine(state, removedLines[lineIndex], addedLines[lineIndex]);
      } else if (lineIndex < removedLines.length) {
        this.appendRemovedOnlyLine(state, removedLines[lineIndex]);
      } else {
        this.appendAddedOnlyLine(state, addedLines[lineIndex]);
      }
    }
  }

  /** Appends lines that only exist in the original (deleted lines). */
  private processRemoved(state: BuildState, change: Change): void {
    for (const line of this.splitLines(change.value)) {
      this.appendRemovedOnlyLine(state, line);
    }
  }

  /** Appends lines that only exist in the modified version (new lines). */
  private processAdded(state: BuildState, change: Change): void {
    for (const line of this.splitLines(change.value)) {
      this.appendAddedOnlyLine(state, line);
    }
  }

  private appendCharDiffLine(state: BuildState, origLine: string, modLine: string): void {
    const { origHtml, modHtml } = this.diffCharsToHtml(origLine, modLine);
    const origPos = state.originalLines.length + 1;
    const modPos = state.modifiedLines.length + 1;
    state.originalLines.push(origHtml);
    state.modifiedLines.push(modHtml);
    state.originalRowHighlights[origPos] = 'diff-modified';
    state.modifiedRowHighlights[modPos] = 'diff-modified';
  }

  private appendRemovedOnlyLine(state: BuildState, line: string): void {
    const origPos = state.originalLines.length + 1;
    state.originalLines.push(this.escapeHtml(line));
    state.modifiedLines.push('');
    state.originalRowHighlights[origPos] = 'diff-removed';
  }

  private appendAddedOnlyLine(state: BuildState, line: string): void {
    const modPos = state.modifiedLines.length + 1;
    state.originalLines.push('');
    state.modifiedLines.push(this.escapeHtml(line));
    state.modifiedRowHighlights[modPos] = 'diff-added';
  }

  /** Performs character-level diff and wraps changes in highlight spans. */
  private diffCharsToHtml(orig: string, mod: string): { origHtml: string; modHtml: string } {
    const chars: Change[] = diffChars(orig, mod);
    let origHtml = '';
    let modHtml = '';

    for (const change of chars) {
      const escaped = this.escapeHtml(change.value);
      if (change.removed) {
        origHtml += `<span class="diff-removed-char">${escaped}</span>`;
      } else if (change.added) {
        modHtml += `<span class="diff-added-char">${escaped}</span>`;
      } else {
        origHtml += escaped;
        modHtml += escaped;
      }
    }

    return { origHtml, modHtml };
  }

  /**
   * Splits a diff chunk value into individual lines.
   * diffLines appends a trailing '\n' to the last line, so we strip the resulting empty element.
   */
  private splitLines(value: string): string[] {
    const parts = value.split('\n');
    return parts[parts.length - 1] === '' ? parts.slice(0, -1) : parts;
  }

  /** Escapes HTML special characters to prevent XSS before injecting into innerHTML. */
  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
