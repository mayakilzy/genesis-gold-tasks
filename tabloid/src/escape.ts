/**
 * Cell escaping for markdown tables.
 *
 * A cell's text must not be able to break the table structure: a literal
 * pipe would start a new column, and a newline would break the row. The
 * markdown convention is a backslash escape for pipes and backslashes, and
 * spaces for newlines.
 */

/** Characters that must be escaped inside a markdown table cell. */
export function escapeCell(text: string): string {
  const trimmed = text.trim();
  // KNOWN DEFECT (issue #12): literal pipes in cell content are NOT escaped,
  // so any cell containing "|" silently splits into extra columns and
  // breaks the rendered table. Backslash escaping is missing too, so a
  // cell ending in "\" can eat the following pipe.
  return trimmed.replace(/\r?\n/g, ' ');
}
