import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ColumnRegular } from '@revolist/revogrid';
import { vi } from 'vitest';

import { PlatformService } from '../../../core/services/platform.service';
import { ColorPaletteOutputCardComponent } from './color-palette-output-card.component';

vi.mock('@revolist/angular-datagrid', () => ({
  RevoGrid: class {},
}));

type HNode = {
  tag: string;
  props: {
    style?: Record<string, string>;
  };
  children?: string | HNode[];
};

describe('ColorPaletteOutputCardComponent', () => {
  let component: ColorPaletteOutputCardComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: MatSnackBar, useValue: { open: vi.fn() } },
        {
          provide: PlatformService,
          useValue: {
            isBrowser: () => true,
            matchMedia: () => null,
          },
        },
      ],
    });

    component = TestBed.runInInjectionContext(() => new ColorPaletteOutputCardComponent());
  });

  it('sets compare-mode columns to text-only hex and preview background cell', () => {
    component.renderPalette({ mode: 'compare', colors: ['#112233'] });

    const hexColumn = component.columns.find(column => column.prop === 'hex');
    const previewColumn = component.columns.find(column => column.prop === 'preview');

    expect(hexColumn?.cellTemplate).toBeUndefined();
    expect(previewColumn?.cellTemplate).toBeDefined();
  });

  it('renders preview cell template as a background-only color cell', () => {
    component.renderPalette({ mode: 'compare', colors: ['#112233'] });

    const previewColumn = component.columns.find(column => column.prop === 'preview') as ColumnRegular;
    const previewCellTemplate = previewColumn.cellTemplate!;

    const h = (
      tag: string,
      props: { style?: Record<string, string> },
      children?: string | HNode[],
    ): HNode => ({ tag, props, children });
    const node = previewCellTemplate(h as never, {
      model: { preview: '#112233' },
      prop: 'preview',
    } as never) as HNode;

    expect(node.props.style?.['backgroundColor']).toBe('#112233');
    expect(node.props.style?.['width']).toBe('100%');
    expect(node.props.style?.['height']).toBe('100%');
    expect(node.props.style?.['borderRadius']).toBe('4px');
    expect(node.children).toBe('');
  });
});
