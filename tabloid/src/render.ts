import { alignmentSeparator, parseAlignment } from './align.js';
import { escapeCell } from './escape.js';

/**
 * Render a markdown table.
 *
 * The header row, one separator row carrying the alignments, and one row
 * per data record. Cells are escaped so their content can never break the
 * table structure.
 */
export function renderTable(
  header: readonly string[],
  rows: readonly (readonly string[])[],
  alignments?: readonly string[],
): string {
  const separator = header.map((_, index) => {
    const spec = alignments?.[index];
    const alignment =
      spec === undefined ? 'left' : parseAlignment(spec);
    return alignmentSeparator(alignment);
  });

  const renderRow = (cells: readonly string[]): string =>
    `| ${cells.map((cell) => escapeCell(cell)).join(' | ')} |`;

  return [renderRow(header), `| ${separator.join(' | ')} |`, ...rows.map(renderRow)].join(
    '\n',
  );
}
