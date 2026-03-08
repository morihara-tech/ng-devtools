import { Component } from '@angular/core';
import { diffLines, diffChars, type Change } from 'diff';
import { MatCardModule } from '@angular/material/card';
import { HeadingComponent } from '../../../components/heading/heading.component';
import { TextViewerTableComponent } from '../../../components/text-viewer-table/text-viewer-table.component';
import { TextDiffInputModel, TextDiffResult } from '../text-diff-model';

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

  private buildResult(changes: Change[]): TextDiffResult {
    const originalLines: string[] = [];
    const modifiedLines: string[] = [];
    const originalRowHighlights: Record<number, string> = {};
    const modifiedRowHighlights: Record<number, string> = {};

    let changeIndex = 0;
    while (changeIndex < changes.length) {
      const change = changes[changeIndex];

      if (!change.removed && !change.added) {
        // Unchanged lines — add to both sides as-is
        for (const line of this.splitLines(change.value)) {
          originalLines.push(this.escapeHtml(line));
          modifiedLines.push(this.escapeHtml(line));
        }
        changeIndex++;
        continue;
      }

      if (change.removed && changes[changeIndex + 1]?.added) {
        // Consecutive removed + added block = modified lines
        const removedLines = this.splitLines(change.value);
        const addedLines = this.splitLines(changes[changeIndex + 1].value);
        const maxLen = Math.max(removedLines.length, addedLines.length);

        for (let lineIndex = 0; lineIndex < maxLen; lineIndex++) {
          if (lineIndex < removedLines.length && lineIndex < addedLines.length) {
            // Pair exists on both sides — character-level diff
            const { origHtml, modHtml } = this.diffCharsToHtml(removedLines[lineIndex], addedLines[lineIndex]);
            const origPos = originalLines.length + 1;
            const modPos = modifiedLines.length + 1;
            originalLines.push(origHtml);
            modifiedLines.push(modHtml);
            originalRowHighlights[origPos] = 'diff-modified';
            modifiedRowHighlights[modPos] = 'diff-modified';
          } else if (lineIndex < removedLines.length) {
            // Extra line only in original
            const origPos = originalLines.length + 1;
            originalLines.push(this.escapeHtml(removedLines[lineIndex]));
            modifiedLines.push('');
            originalRowHighlights[origPos] = 'diff-removed';
          } else {
            // Extra line only in modified
            const modPos = modifiedLines.length + 1;
            originalLines.push('');
            modifiedLines.push(this.escapeHtml(addedLines[lineIndex]));
            modifiedRowHighlights[modPos] = 'diff-added';
          }
        }
        changeIndex += 2;
        continue;
      }

      if (change.removed) {
        for (const line of this.splitLines(change.value)) {
          const origPos = originalLines.length + 1;
          originalLines.push(this.escapeHtml(line));
          modifiedLines.push('');
          originalRowHighlights[origPos] = 'diff-removed';
        }
        changeIndex++;
        continue;
      }

      if (change.added) {
        for (const line of this.splitLines(change.value)) {
          const modPos = modifiedLines.length + 1;
          originalLines.push('');
          modifiedLines.push(this.escapeHtml(line));
          modifiedRowHighlights[modPos] = 'diff-added';
        }
        changeIndex++;
        continue;
      }

      changeIndex++;
    }

    return {
      originalValue: originalLines.join('\n'),
      modifiedValue: modifiedLines.join('\n'),
      originalRowHighlights,
      modifiedRowHighlights,
    };
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
